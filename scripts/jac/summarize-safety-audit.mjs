#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const auditDir = path.join(root, '.tmp', 'jac-safety-audit');

const exactDay = process.env.JAC_AUDIT_DAY || '';
const days = Number(process.env.JAC_AUDIT_DAYS || '7');
const maxSamples = Number(process.env.JAC_AUDIT_SAMPLE_LIMIT || '5');

function isValidDay(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDayKey(date) {
  return date.toISOString().slice(0, 10);
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

function increment(map, key, n = 1) {
  map[key] = (map[key] || 0) + n;
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
  let totalEvidence = 0;

  for (const event of events) {
    const day = String(event?.at || '').slice(0, 10) || toDayKey(new Date());
    increment(byDay, day);
    increment(byOutcome, event?.outcome || 'unknown');
    increment(byMode, event?.safetyGate?.mode || 'unknown');
    increment(byPolicy, event?.safetyGate?.recommendationPolicy || 'unknown');
    const reasonCodes = Array.isArray(event?.safetyGate?.reasonCodes)
      ? event.safetyGate.reasonCodes
      : [];
    for (const code of reasonCodes) increment(byReasonCode, code);
    totalEvidence += Number(event?.runtime?.evidenceCount || 0);

    if (
      (event?.safetyGate?.mode || '') === 'strict' &&
      strictSamples.length < Math.max(1, maxSamples)
    ) {
      strictSamples.push({
        at: event.at,
        reasonCodes,
        summary: event?.safetyGate?.summary || '',
        evidenceCount: event?.runtime?.evidenceCount || 0,
        fallbackReason: event?.runtime?.fallbackReason || null,
      });
    }
  }

  const strictCount = byMode.strict || 0;
  const cautionCount = byMode.caution || 0;
  const normalCount = byMode.normal || 0;
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
    strictSamples,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
