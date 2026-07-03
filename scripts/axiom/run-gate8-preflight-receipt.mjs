#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const outputDir = path.join(repoRoot, 'references/axiom');
const outputJson = path.join(outputDir, 'axiom-gate8-preflight-runner-receipt-v0-2026-06-07.json');
const outputMd = path.join(outputDir, 'axiom-gate8-preflight-runner-receipt-v0-2026-06-07.md');

const requiredTestTargets = [
  '__tests__/axiom-next-nbl-candidate-pages.test.tsx',
  '__tests__/axiom-next-nbl-internal-preview.test.tsx',
  '__tests__/axiom-site-gate8-preflight-contract.test.ts',
  '__tests__/axiom-site-candidate-page-route-map.test.ts',
  '__tests__/axiom-site-candidate-page-data.test.ts',
  '__tests__/axiom-site-preview-review-matrix.test.ts',
  '__tests__/axiom-site-gate8-preflight-runner-criteria.test.ts',
  '__tests__/axiom-site-gate8-preflight-runner-receipt.test.ts',
  '__tests__/axiom-site-internal-candidate-surface-implementation-scaffold.test.ts',
  '__tests__/axiom-site-internal-candidate-surface-render-adapter.test.ts',
  '__tests__/axiom-site-internal-candidate-surface-page-shell.test.ts',
  '__tests__/axiom-site-internal-candidate-surface-page-shell-review-packet.test.ts',
  '__tests__/axiom-site-internal-candidate-public-page-preview-assembly.test.ts',
  '__tests__/axiom-site-internal-candidate-public-page-hold-packet.test.ts',
  '__tests__/axiom-site-internal-candidate-release-readiness-ledger.test.ts',
  '__tests__/axiom-site-internal-candidate-surface-promotion-request-packet.test.ts',
  '__tests__/axiom-site-internal-candidate-surface-promotion-handoff-manifest.test.ts',
  '__tests__/axiom-site-internal-candidate-public-release-decision-packet-shell.test.ts',
  '__tests__/axiom-site-internal-candidate-public-navigation-release-route-shell.test.ts',
  '__tests__/axiom-site-internal-candidate-final-public-release-review-packet.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-handoff-manifest.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-receipt-shell.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-ingestion-contract.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-shell.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-validation-gate.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.ts',
  '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-return-hold-shell.test.ts',
  '__tests__/axiom-gate8-preflight-runner-script.test.ts',
  '__tests__/axiom-interaction-hypothesis-kernel-contract.test.ts',
  '__tests__/axiom-interaction-hypothesis-kernel-evaluator.test.ts',
  '__tests__/axiom-next-nbl-candidate-surface-scaffold.test.tsx',
  '__tests__/axiom-next-nbl-candidate-surface-render-adapter.test.tsx',
  '__tests__/axiom-next-nbl-candidate-surface-page-shell.test.tsx',
  '__tests__/axiom-next-nbl-candidate-public-page-preview.test.tsx',
  '__tests__/axiom-next-nbl-candidate-public-page-hold-packet.test.tsx',
  '__tests__/axiom-next-nbl-candidate-release-readiness-ledger.test.tsx',
  '__tests__/axiom-next-nbl-candidate-surface-promotion-request-packet.test.tsx',
  '__tests__/axiom-next-nbl-candidate-surface-promotion-handoff-manifest.test.tsx',
  '__tests__/axiom-next-nbl-candidate-public-release-decision-packet-shell.test.tsx',
  '__tests__/axiom-next-nbl-candidate-public-navigation-release-route-shell.test.tsx',
  '__tests__/axiom-next-nbl-candidate-final-public-release-review-packet.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.tsx',
  '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell.test.tsx',
  '__tests__/falcon-expert-agent-core-eval-profile.test.ts',
];

const internalRouteTargets = [
  'http://127.0.0.1:3006/internal/axiom-next-nbl-preview',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-pages',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-surface-scaffold',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-surface-render-adapter',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-surface-page-shell',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-public-page-preview',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-public-page-hold-packet',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-release-readiness-ledger',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-surface-promotion-request-packet',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-final-public-release-review-packet',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell',
  'http://127.0.0.1:3006/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell',
];

const movementBoundary = {
  runtime: 'not_changed',
  prompt: 'not_changed',
  retrieval: 'not_changed',
  modelProvider: 'not_changed',
  dbSchema: 'not_changed',
  publicApproval: 'not_approved',
  publication: 'not_published',
  publicNavigation: 'not_added',
  falconCandidateSurfacePromotion: 'not_promoted',
  sourceValidity: 'not_decided',
  sourceCurrentness: 'not_decided',
  supportValidity: 'not_decided',
  candidatePattern: 'not_candidate_pattern',
  runtimeApproved: 'not_approved',
  publicApproved: 'not_approved',
  knowledgePromotion: 'not_promoted',
  learningUpdate: 'not_updated',
};

function tail(value, maxLength = 4000) {
  if (!value) return '';
  return value.length > maxLength ? value.slice(value.length - maxLength) : value;
}

function runCommand({ evidenceId, commandLabel, command, args, targets }) {
  const started = performance.now();
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false,
    stdio: 'pipe',
  });
  const durationMs = Math.round(performance.now() - started);
  const passed = result.status === 0;

  return {
    evidenceId,
    status: passed ? 'passed' : 'failed',
    commandLabel,
    targets,
    exitCode: result.status,
    durationMs,
    summary: passed ? `${commandLabel} passed.` : `${commandLabel} failed.`,
    stdoutTail: tail(result.stdout),
    stderrTail: tail(result.stderr),
  };
}

async function checkInternalRoutes() {
  const httpStatusByPath = {};
  const checkedInternalPaths = [];

  for (const url of internalRouteTargets) {
    const pathOnly = new URL(url).pathname;
    checkedInternalPaths.push(pathOnly);
    try {
      httpStatusByPath[pathOnly] = await getHttpStatusWithRetry(url);
    } catch (error) {
      httpStatusByPath[pathOnly] = `fetch_failed:${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }

  const passed = Object.values(httpStatusByPath).every((status) => status === 200);

  return {
    evidenceId: 'axiom_gate8_route_rendering_evidence_executed',
    status: passed ? 'passed' : 'failed',
    checkedInternalPaths,
    httpStatusByPath,
    summary: passed
      ? 'Internal Axiom candidate-surface internal routes returned HTTP 200.'
      : 'At least one internal Axiom route did not return HTTP 200.',
  };
}

async function getHttpStatusWithRetry(url, attempt = 1) {
  try {
    return await getHttpStatus(url);
  } catch (error) {
    if (attempt >= 5) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    return getHttpStatusWithRetry(url, attempt + 1);
  }
}

function getHttpStatus(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      response.resume();
      response.on('end', () => resolve(response.statusCode ?? 'missing_status'));
    });

    request.setTimeout(5000, () => {
      request.destroy(new Error(`timeout:${url}`));
    });
    request.on('error', reject);
  });
}

function criterionReceipt(criterionId, evidence) {
  const jestPassed = evidence.jestEvidence.status === 'passed';
  const typecheckPassed = evidence.typecheckEvidence.status === 'passed';
  const routesPassed = evidence.routeRenderingEvidence.status === 'passed';
  const targets = evidence.jestEvidence.targets;

  const checks = {
    no_public_affordances:
      jestPassed &&
      targets.includes('__tests__/axiom-next-nbl-internal-preview.test.tsx') &&
      targets.includes('__tests__/axiom-next-nbl-candidate-pages.test.tsx') &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-promotion-request-packet.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-promotion-handoff-manifest.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-public-release-decision-packet-shell.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-public-navigation-release-route-shell.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-final-public-release-review-packet.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.tsx',
      ) &&
      targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell.test.tsx',
      ),
    required_hold_labels:
      jestPassed && targets.includes('__tests__/axiom-site-gate8-preflight-contract.test.ts'),
    internal_route_rendering:
      jestPassed &&
      routesPassed &&
      targets.includes('__tests__/axiom-site-candidate-page-route-map.test.ts'),
    axiom_contract_regression: jestPassed && typecheckPassed,
    falcon_eval_preservation:
      jestPassed && targets.includes('__tests__/falcon-expert-agent-core-eval-profile.test.ts'),
  };

  const passed = checks[criterionId] === true;

  return {
    criterionId,
    receiptStatus: passed ? 'passed_internal_preflight_check' : 'failed_internal_preflight_check',
    evidenceRefs: [
      evidence.jestEvidence.evidenceId,
      evidence.typecheckEvidence.evidenceId,
      evidence.routeRenderingEvidence.evidenceId,
    ],
    evidenceSummary: [
      evidence.jestEvidence.summary,
      evidence.typecheckEvidence.summary,
      evidence.routeRenderingEvidence.summary,
    ].join(' '),
    satisfiesCriterionForCandidatePreflight: passed,
    inheritedBlocksCandidatePromotion: true,
    doesNotBlockInternalInspection: true,
  };
}

function buildMarkdown(receipt) {
  const criteriaRows = receipt.criterionReceipts
    .map(
      (criterion) =>
        `- ${criterion.criterionId}: ${criterion.receiptStatus} / satisfies=${criterion.satisfiesCriterionForCandidatePreflight}`,
    )
    .join('\n');
  const routeRows = Object.entries(receipt.evidence.routeRenderingEvidence.httpStatusByPath)
    .map(([routePath, status]) => `- ${routePath}: ${status}`)
    .join('\n');

  return `# Axiom Gate 8 Preflight Runner Receipt v0

Date: ${receipt.generatedAt}
Lane: ${receipt.lane}
Status: ${receipt.receiptStatus}
Boundary: ${receipt.boundary}

## Criteria

${criteriaRows}

## Route Rendering

${routeRows}

## Evidence

- Jest: ${receipt.evidence.jestEvidence.status} (${receipt.evidence.jestEvidence.durationMs}ms)
- Typecheck: ${receipt.evidence.typecheckEvidence.status} (${receipt.evidence.typecheckEvidence.durationMs}ms)
- Internal route rendering: ${receipt.evidence.routeRenderingEvidence.status}

## Movement Boundary

This receipt does not promote Falcon candidate surfaces, add public navigation, publish content, approve public use, decide source/support validity, move runtime/prompt/retrieval/model/provider/DB/schema, or update learning.
`;
}

const jestEvidence = runCommand({
  evidenceId: 'axiom_gate8_jest_evidence_executed',
  commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
  command: 'npx',
  args: ['jest', ...requiredTestTargets, '--runInBand'],
  targets: requiredTestTargets,
});

const typecheckEvidence = runCommand({
  evidenceId: 'axiom_gate8_typecheck_evidence_executed',
  commandLabel: 'npm run typecheck',
  command: 'npm',
  args: ['run', 'typecheck'],
  targets: ['tsc --noEmit'],
});

const routeRenderingEvidence = await checkInternalRoutes();

const evidence = {
  jestEvidence,
  typecheckEvidence,
  routeRenderingEvidence,
};

const criterionIds = [
  'no_public_affordances',
  'required_hold_labels',
  'internal_route_rendering',
  'axiom_contract_regression',
  'falcon_eval_preservation',
];
const criterionReceipts = criterionIds.map((criterionId) =>
  criterionReceipt(criterionId, evidence),
);
const passed = criterionReceipts.every(
  (criterion) => criterion.receiptStatus === 'passed_internal_preflight_check',
);

const receipt = {
  receiptId: 'axiom_gate8_runner_receipt_executed_v0_2026_06_07',
  generatedAt: new Date().toISOString(),
  lane: 'Falcon Lab',
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  receiptStatus: passed
    ? 'passed_internal_preflight_not_promoted'
    : 'failed_internal_preflight_not_promoted',
  boundary:
    'axiom_gate8_preflight_runner_receipt_is_internal_execution_evidence_not_candidate_promotion_or_public_release',
  sourceCriteriaPacketId: 'axiom_gate8_runner_criteria_packet_internal_required_not_run',
  criterionReceiptCount: criterionReceipts.length,
  criterionReceipts,
  requiredTestTargets,
  evidence,
  nextAllowedMovement: passed
    ? 'prepare_falcon_candidate_surface_review_packet_only_not_public_release'
    : 'remain_internal_until_failed_or_not_run_checks_are_repaired',
  movementBoundary,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputJson, `${JSON.stringify(receipt, null, 2)}\n`);
writeFileSync(outputMd, buildMarkdown(receipt));

console.log(
  JSON.stringify(
    {
      receiptStatus: receipt.receiptStatus,
      outputJson,
      outputMd,
    },
    null,
    2,
  ),
);

if (!passed) {
  process.exitCode = 1;
}
