#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const auditDir = path.join(root, '.tmp', 'jac-safety-audit');

const exactDay = process.env.JAC_AUDIT_DAY || '';
const days = Number(process.env.JAC_AUDIT_DAYS || '7');
const maxSamples = Number(process.env.JAC_AUDIT_SAMPLE_LIMIT || '5');

const enforce =
  process.argv.includes('--enforce') || String(process.env.JAC_AUDIT_ENFORCE || '') === 'true';
const maxStrictRatePct = Number(process.env.JAC_AUDIT_MAX_STRICT_RATE_PCT || '45');
const maxFallbackRatePct = Number(process.env.JAC_AUDIT_MAX_FALLBACK_RATE_PCT || '35');
const maxErrorRatePct = Number(process.env.JAC_AUDIT_MAX_ERROR_RATE_PCT || '10');
const minAvgEvidenceCount = Number(process.env.JAC_AUDIT_MIN_AVG_EVIDENCE_COUNT || '0.5');
const maxImmediateReviewRatePct = Number(process.env.JAC_AUDIT_MAX_IMMEDIATE_REVIEW_RATE_PCT || '70');

const strongReasonCodes = new Set([
  'high_risk_without_specific_case',
  'high_risk_dominant',
  'aggregated_evidence_dominant',
]);

function isValidDay(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function increment(map, key, n = 1) {
  map[key] = (map[key] || 0) + n;
}

function pickImmediateReasons(event) {
  const fromSignals = Array.isArray(event?.signals?.immediateReviewReasons)
    ? event.signals.immediateReviewReasons
    : [];
  if (fromSignals.length > 0) return fromSignals;

  const reasons = [];
  const outcome = String(event?.outcome || '');
  const mode = String(event?.safetyGate?.mode || '');
  const reasonCodes = Array.isArray(event?.safetyGate?.reasonCodes) ? event.safetyGate.reasonCodes : [];
  const warningCount = Number(event?.runtime?.warningCount || 0);
  const selectedSourceCount = Number(event?.runtime?.selectedSourceCount || 0);
  const evidenceCount = Number(event?.runtime?.evidenceCount || 0);

  if (outcome === 'error') reasons.push('outcome_error');
  if (outcome === 'fallback') reasons.push('outcome_fallback');
  if (mode === 'strict') reasons.push('strict_mode');
  if (reasonCodes.some((code) => strongReasonCodes.has(code))) {
    reasons.push('critical_reason_code');
  }
  if (warningCount >= 3) reasons.push('warning_count_high');
  if (selectedSourceCount > 0 && evidenceCount === 0) reasons.push('evidence_zero_with_sources');
  return reasons;
}

function isImmediateReviewEvent(event) {
  if (event?.signals?.requiresImmediateReview === true) return true;
  return pickImmediateReasons(event).length > 0;
}

function evaluateGate(summary) {
  if (!enforce) return [];
  const failures = [];
  if (summary.strictRatePct > maxStrictRatePct) {
    failures.push(`strictRatePct ${summary.strictRatePct} > ${maxStrictRatePct}`);
  }
  if (summary.fallbackRatePct > maxFallbackRatePct) {
    failures.push(`fallbackRatePct ${summary.fallbackRatePct} > ${maxFallbackRatePct}`);
  }
  if (summary.errorRatePct > maxErrorRatePct) {
    failures.push(`errorRatePct ${summary.errorRatePct} > ${maxErrorRatePct}`);
  }
  if (summary.averageEvidenceCount < minAvgEvidenceCount) {
    failures.push(`averageEvidenceCount ${summary.averageEvidenceCount} < ${minAvgEvidenceCount}`);
  }
  if (summary.immediateReviewRatePct > maxImmediateReviewRatePct) {
    failures.push(
      `immediateReviewRatePct ${summary.immediateReviewRatePct} > ${maxImmediateReviewRatePct}`,
    );
  }
  return failures;
}

async function loadEvents() {
  const files = await fs.readdir(auditDir).catch(() => []);
  const jsonlFiles = files.filter((file) => file.endsWith('.jsonl'));
  if (jsonlFiles.length === 0) return [];

  let selectedFiles = jsonlFiles;
  if (exactDay && isValidDay(exactDay)) {
    selectedFiles = jsonlFiles.filter((file) => file === `${exactDay}.jsonl`);
  } else {
    const threshold = Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000;
    selectedFiles = jsonlFiles.filter((file) => {
      const day = file.replace(/\.jsonl$/, '');
      if (!isValidDay(day)) return false;
      return new Date(`${day}T00:00:00.000Z`).getTime() >= threshold;
    });
  }

  const rows = [];
  for (const file of selectedFiles.sort()) {
    const fullPath = path.join(auditDir, file);
    const raw = await fs.readFile(fullPath, 'utf8').catch(() => '');
    if (!raw) continue;
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        rows.push(JSON.parse(trimmed));
      } catch {
        // ignore malformed rows
      }
    }
  }
  return rows;
}

async function main() {
  const events = await loadEvents();
  if (events.length === 0) {
    console.log(
      JSON.stringify(
        {
          total: 0,
          message: 'No safety audit logs found in selected window.',
          auditDir,
          enforce,
        },
        null,
        2,
      ),
    );
    return;
  }

  const byDay = {};
  const byOutcome = {};
  const byMode = {};
  const byPolicy = {};
  const byReasonCode = {};
  const strictSamples = [];
  const immediateReviewSamples = [];
  let totalEvidence = 0;
  let immediateReviewCount = 0;

  for (const event of events) {
    const day = String(event?.at || '').slice(0, 10) || toDayKey(new Date());
    increment(byDay, day);
    increment(byOutcome, event?.outcome || 'unknown');
    increment(byMode, event?.safetyGate?.mode || 'unknown');
    increment(byPolicy, event?.safetyGate?.recommendationPolicy || 'unknown');
    const reasonCodes = Array.isArray(event?.safetyGate?.reasonCodes) ? event.safetyGate.reasonCodes : [];
    for (const code of reasonCodes) increment(byReasonCode, code);
    totalEvidence += Number(event?.runtime?.evidenceCount || 0);

    if ((event?.safetyGate?.mode || '') === 'strict' && strictSamples.length < Math.max(1, maxSamples)) {
      strictSamples.push({
        at: event.at,
        reasonCodes,
        summary: event?.safetyGate?.summary || '',
        evidenceCount: event?.runtime?.evidenceCount || 0,
        fallbackReason: event?.runtime?.fallbackReason || null,
      });
    }

    if (isImmediateReviewEvent(event)) {
      immediateReviewCount += 1;
      if (immediateReviewSamples.length < Math.max(1, maxSamples)) {
        immediateReviewSamples.push({
          at: event.at,
          outcome: event?.outcome || 'unknown',
          mode: event?.safetyGate?.mode || 'unknown',
          immediateReviewReasons: pickImmediateReasons(event),
          summary: event?.safetyGate?.summary || '',
          fallbackReason: event?.runtime?.fallbackReason || null,
          evidenceCount: event?.runtime?.evidenceCount || 0,
        });
      }
    }
  }

  const strictCount = byMode.strict || 0;
  const cautionCount = byMode.caution || 0;
  const normalCount = byMode.normal || 0;
  const fallbackCount = byOutcome.fallback || 0;
  const errorCount = byOutcome.error || 0;

  const summary = {
    total: events.length,
    window: exactDay && isValidDay(exactDay) ? { day: exactDay } : { days: Math.max(1, days) },
    distribution: {
      byDay,
      byOutcome,
      byMode: { strict: strictCount, caution: cautionCount, normal: normalCount },
      byPolicy,
      byReasonCode,
    },
    averageEvidenceCount: Number((totalEvidence / events.length).toFixed(3)),
    strictRatePct: Number(((strictCount / events.length) * 100).toFixed(2)),
    cautionRatePct: Number(((cautionCount / events.length) * 100).toFixed(2)),
    fallbackRatePct: Number(((fallbackCount / events.length) * 100).toFixed(2)),
    errorRatePct: Number(((errorCount / events.length) * 100).toFixed(2)),
    immediateReviewRatePct: Number(((immediateReviewCount / events.length) * 100).toFixed(2)),
    strictSamples,
    immediateReviewSamples,
  };

  const gateFailures = evaluateGate(summary);

  const output = {
    ...summary,
    enforce,
    thresholds: {
      maxStrictRatePct,
      maxFallbackRatePct,
      maxErrorRatePct,
      minAvgEvidenceCount,
      maxImmediateReviewRatePct,
    },
    gateFailures,
    status: gateFailures.length > 0 ? 'alert' : 'ok',
  };

  console.log(JSON.stringify(output, null, 2));
  if (gateFailures.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
