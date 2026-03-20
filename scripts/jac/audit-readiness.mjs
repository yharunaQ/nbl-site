#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ENFORCE = process.argv.includes('--enforce');

const MAX_TIER_MISMATCH = Number(process.env.JAC_MAX_TIER_MISMATCH || 0);
const MAX_UNCOVERED_ROWS = Number(process.env.JAC_MAX_UNCOVERED_ROWS || 0);
const MAX_WORDING_REVIEW = Number(process.env.JAC_MAX_WORDING_REVIEW || 0);
const MAX_LOW_DIFF_OVERLAP = Number(process.env.JAC_MAX_LOW_DIFF_OVERLAP || 0);
const MAX_ACTIONABLE_UNCOVERED_RAW = Number(process.env.JAC_MAX_ACTIONABLE_UNCOVERED_RAW || 0);
const MAX_ACTIONABLE_UNCOVERED_WEB = Number(process.env.JAC_MAX_ACTIONABLE_UNCOVERED_WEB || 0);

function runAudit(scriptRelativePath) {
  const scriptPath = path.join(process.cwd(), scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(
      `Audit failed: ${scriptRelativePath}\n${String(result.stderr || '').trim()}\n${String(result.stdout || '').trim()}`,
    );
  }

  const stdout = String(result.stdout || '').trim();
  if (!stdout) {
    throw new Error(`Audit returned empty output: ${scriptRelativePath}`);
  }

  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(
      `Audit returned invalid JSON: ${scriptRelativePath}\n${stdout.slice(0, 2000)}\n${String(error)}`,
    );
  }
}

function makeCheck(id, label, actual, threshold, comparator = 'lte') {
  const pass = comparator === 'lte' ? actual <= threshold : actual >= threshold;
  return {
    id,
    label,
    pass,
    actual,
    threshold,
    comparator,
  };
}

function main() {
  const tier = runAudit('scripts/jac/audit-tier-alignment.mjs');
  const uncovered = runAudit('scripts/jac/audit-uncovered-issues.mjs');
  const wording = runAudit('scripts/jac/audit-wording-grounding.mjs');
  const minority = runAudit('scripts/jac/audit-minority-diff.mjs');

  const lowDiffHighOverlapPairCount = Number(
    minority?.differentiationAudit?.lowDiffHighOverlapPairCount || 0,
  );
  const rawActionableUncovered = Number(
    minority?.rareNarrativeCoverage?.rawData?.actionableUncoveredCount || 0,
  );
  const webActionableUncovered = Number(
    minority?.rareNarrativeCoverage?.webCache?.actionableUncoveredCount || 0,
  );

  const checks = [
    makeCheck(
      'tier_alignment_mismatch',
      'Tier A/B 設計整合の不一致件数',
      Number(tier?.mismatchCount || 0),
      MAX_TIER_MISMATCH,
    ),
    makeCheck(
      'data2_uncovered_rows',
      'data2 課題行の未カバー件数',
      Number(uncovered?.uncoveredRows || 0),
      MAX_UNCOVERED_ROWS,
    ),
    makeCheck(
      'wording_review_required',
      '文言の根拠不足レビュー件数',
      Number(wording?.reviewRequiredCount || 0),
      MAX_WORDING_REVIEW,
    ),
    makeCheck(
      'minority_low_diff_overlap_pairs',
      '高重複かつ低差分ペア件数',
      lowDiffHighOverlapPairCount,
      MAX_LOW_DIFF_OVERLAP,
    ),
    makeCheck(
      'minority_actionable_uncovered_raw',
      'raw_data 希少記述の actionable 未カバー件数',
      rawActionableUncovered,
      MAX_ACTIONABLE_UNCOVERED_RAW,
    ),
    makeCheck(
      'minority_actionable_uncovered_web',
      'web_cache 希少記述の actionable 未カバー件数',
      webActionableUncovered,
      MAX_ACTIONABLE_UNCOVERED_WEB,
    ),
  ];

  const failedChecks = checks.filter((check) => !check.pass);
  const ready = failedChecks.length === 0;

  const summary = {
    generatedAt: new Date().toISOString(),
    overallStatus: ready ? 'READY' : 'NOT_READY',
    thresholds: {
      maxTierMismatch: MAX_TIER_MISMATCH,
      maxUncoveredRows: MAX_UNCOVERED_ROWS,
      maxWordingReview: MAX_WORDING_REVIEW,
      maxLowDiffOverlap: MAX_LOW_DIFF_OVERLAP,
      maxActionableUncoveredRaw: MAX_ACTIONABLE_UNCOVERED_RAW,
      maxActionableUncoveredWeb: MAX_ACTIONABLE_UNCOVERED_WEB,
    },
    checks,
    failedCheckIds: failedChecks.map((check) => check.id),
    snapshot: {
      tierAlignment: {
        totalCards: Number(tier?.totalCards || 0),
        mismatchCount: Number(tier?.mismatchCount || 0),
        alignmentRate: Number(tier?.alignmentRate || 0),
      },
      uncovered: {
        totalIssueRows: Number(uncovered?.totalIssueRows || 0),
        uncoveredRows: Number(uncovered?.uncoveredRows || 0),
        coverageRate: Number(uncovered?.coverageRate || 0),
      },
      wording: {
        cardCount: Number(wording?.cardCount || 0),
        reviewRequiredCount: Number(wording?.reviewRequiredCount || 0),
      },
      minority: {
        lowDiffHighOverlapPairCount,
        rawActionableUncovered,
        webActionableUncovered,
        rawActionableCoverageRate: Number(
          minority?.rareNarrativeCoverage?.rawData?.actionableCoverageRate || 0,
        ),
        webActionableCoverageRate: Number(
          minority?.rareNarrativeCoverage?.webCache?.actionableCoverageRate || 0,
        ),
      },
    },
  };

  console.log(JSON.stringify(summary, null, 2));

  if (ENFORCE && !ready) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
