#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const auditDir = path.join(root, '.tmp', 'jac-safety-audit');
const lookbackMinutes = Number(process.env.JAC_AUDIT_ALERT_LOOKBACK_MINUTES || '180');
const sampleLimit = Number(process.env.JAC_AUDIT_ALERT_SAMPLE_LIMIT || '10');
const enforce =
  process.argv.includes('--enforce') || String(process.env.JAC_AUDIT_ALERT_ENFORCE || '') === 'true';
const maxActiveAlerts = Number(process.env.JAC_AUDIT_ALERT_MAX_ACTIVE || '0');

const strongReasonCodes = new Set([
  'high_risk_without_specific_case',
  'high_risk_dominant',
  'aggregated_evidence_dominant',
]);

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

async function loadRecentEvents() {
  const files = await fs.readdir(auditDir).catch(() => []);
  const jsonlFiles = files.filter((file) => file.endsWith('.jsonl')).sort();
  if (jsonlFiles.length === 0) return [];

  const thresholdMs = Date.now() - Math.max(1, lookbackMinutes) * 60 * 1000;
  const rows = [];
  for (const file of jsonlFiles) {
    const fullPath = path.join(auditDir, file);
    const raw = await fs.readFile(fullPath, 'utf8').catch(() => '');
    if (!raw) continue;
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const event = JSON.parse(trimmed);
        const atMs = new Date(String(event?.at || '')).getTime();
        if (!Number.isFinite(atMs) || atMs < thresholdMs) continue;
        rows.push(event);
      } catch {
        // ignore malformed rows
      }
    }
  }
  return rows;
}

async function main() {
  const recentEvents = await loadRecentEvents();
  const immediate = recentEvents.filter(isImmediateReviewEvent);
  const samples = immediate.slice(0, Math.max(1, sampleLimit)).map((event) => ({
    at: event?.at || '',
    outcome: event?.outcome || 'unknown',
    mode: event?.safetyGate?.mode || 'unknown',
    immediateReviewReasons: pickImmediateReasons(event),
    summary: event?.safetyGate?.summary || '',
    fallbackReason: event?.runtime?.fallbackReason || null,
    evidenceCount: event?.runtime?.evidenceCount || 0,
  }));

  const output = {
    generatedAt: new Date().toISOString(),
    auditDir,
    windowMinutes: Math.max(1, lookbackMinutes),
    enforce,
    maxActiveAlerts,
    totalRecentEvents: recentEvents.length,
    activeAlertCount: immediate.length,
    status: immediate.length > maxActiveAlerts ? 'alert' : 'ok',
    samples,
  };

  console.log(JSON.stringify(output, null, 2));
  if (enforce && immediate.length > maxActiveAlerts) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
