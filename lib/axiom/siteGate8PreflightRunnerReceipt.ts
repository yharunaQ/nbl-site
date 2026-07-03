import {
  AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
  AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS,
  type AxiomGate8PreflightRunnerCriteriaPacket,
  type AxiomGate8RunnerCriterionId,
  buildAxiomGate8PreflightRunnerCriteriaPacket,
  validateAxiomGate8PreflightRunnerCriteriaPacket,
} from './siteGate8PreflightRunnerCriteria';
import { buildAxiomGate8PreflightContract } from './siteGate8PreflightContract';
import {
  type AxiomCandidatePageRouteMap,
  buildAxiomCandidatePageRouteMap,
} from './siteCandidatePageRouteMap';
import { buildAxiomCandidatePageDataBundle } from './siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from './sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from './siteSurfaceSlotContract';

export const AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY =
  'axiom_gate8_preflight_runner_receipt_is_internal_execution_evidence_not_candidate_promotion_or_public_release' as const;

export const AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS = [
  '/internal/axiom-next-nbl-preview',
  '/internal/axiom-next-nbl-candidate-pages',
  '/internal/axiom-next-nbl-candidate-surface-scaffold',
  '/internal/axiom-next-nbl-candidate-surface-render-adapter',
  '/internal/axiom-next-nbl-candidate-surface-page-shell',
  '/internal/axiom-next-nbl-candidate-public-page-preview',
  '/internal/axiom-next-nbl-candidate-public-page-hold-packet',
  '/internal/axiom-next-nbl-candidate-release-readiness-ledger',
  '/internal/axiom-next-nbl-candidate-surface-promotion-request-packet',
  '/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest',
  '/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell',
  '/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell',
  '/internal/axiom-next-nbl-candidate-final-public-release-review-packet',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell',
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell',
] as const;

export type AxiomGate8EvidenceStatus = 'passed' | 'failed' | 'not_run';

export type AxiomGate8CommandEvidence = {
  evidenceId: string;
  status: AxiomGate8EvidenceStatus;
  commandLabel: string;
  targets: string[];
  summary: string;
};

export type AxiomGate8RouteRenderingEvidence = {
  evidenceId: string;
  status: AxiomGate8EvidenceStatus;
  checkedInternalPaths: string[];
  httpStatusByPath: Record<string, number | 'not_run'>;
  summary: string;
};

export type AxiomGate8PreflightRunnerEvidenceInput = {
  jestEvidence: AxiomGate8CommandEvidence;
  typecheckEvidence: AxiomGate8CommandEvidence;
  routeRenderingEvidence: AxiomGate8RouteRenderingEvidence;
};

export type AxiomGate8CriterionReceiptStatus =
  | 'passed_internal_preflight_check'
  | 'failed_internal_preflight_check'
  | 'not_run';

export type AxiomGate8RunnerCriterionReceipt = {
  criterionId: AxiomGate8RunnerCriterionId;
  receiptStatus: AxiomGate8CriterionReceiptStatus;
  evidenceRefs: string[];
  evidenceSummary: string;
  satisfiesCriterionForCandidatePreflight: boolean;
  inheritedBlocksCandidatePromotion: true;
  doesNotBlockInternalInspection: true;
};

export type AxiomGate8PreflightRunnerReceipt = {
  receiptId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  receiptStatus:
    | 'passed_internal_preflight_not_promoted'
    | 'failed_internal_preflight_not_promoted'
    | 'not_run_internal_preflight_not_promoted';
  boundary: typeof AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY;
  sourceCriteriaPacketId: string;
  sourceRouteMapId: string;
  sourceCriteriaBoundary: typeof AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY;
  criterionReceiptCount: number;
  criterionReceipts: AxiomGate8RunnerCriterionReceipt[];
  routeTargetCount: number;
  routeTargets: {
    surface: (typeof AXIOM_NEXT_NBL_SITE_SURFACES)[number];
    internalPath: string;
  }[];
  requiredTestTargets: string[];
  evidence: AxiomGate8PreflightRunnerEvidenceInput;
  nextAllowedMovement:
    | 'prepare_falcon_candidate_surface_review_packet_only_not_public_release'
    | 'remain_internal_until_failed_or_not_run_checks_are_repaired';
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    publicNavigation: 'not_added';
    falconCandidateSurfacePromotion: 'not_promoted';
    sourceValidity: 'not_decided';
    sourceCurrentness: 'not_decided';
    supportValidity: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    knowledgePromotion: 'not_promoted';
    learningUpdate: 'not_updated';
  };
};

export type AxiomGate8PreflightRunnerReceiptValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildDefaultRouteMap(): AxiomCandidatePageRouteMap {
  return buildAxiomCandidatePageRouteMap(
    buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
  );
}

export function buildNotRunAxiomGate8PreflightRunnerEvidenceInput(): AxiomGate8PreflightRunnerEvidenceInput {
  return {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_not_run',
      status: 'not_run',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets: [...AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS],
      summary: 'Jest targets are declared but not run.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_not_run',
      status: 'not_run',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck is declared but not run.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_not_run',
      status: 'not_run',
      checkedInternalPaths: [...AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS],
      httpStatusByPath: Object.fromEntries(
        AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.map((path) => [path, 'not_run']),
      ),
      summary: 'Internal route rendering checks are declared but not run.',
    },
  };
}

function allRequiredTargetsPresent(targets: string[]): boolean {
  return AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS.every((target) => targets.includes(target));
}

function allInternalRoutesRendered(evidence: AxiomGate8RouteRenderingEvidence): boolean {
  return AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.every(
    (path) =>
      evidence.checkedInternalPaths.includes(path) && evidence.httpStatusByPath[path] === 200,
  );
}

function criterionStatus(
  criterionId: AxiomGate8RunnerCriterionId,
  evidence: AxiomGate8PreflightRunnerEvidenceInput,
): AxiomGate8CriterionReceiptStatus {
  if (
    evidence.jestEvidence.status === 'failed' ||
    evidence.typecheckEvidence.status === 'failed' ||
    evidence.routeRenderingEvidence.status === 'failed'
  ) {
    return 'failed_internal_preflight_check';
  }

  if (
    evidence.jestEvidence.status === 'not_run' ||
    evidence.typecheckEvidence.status === 'not_run' ||
    evidence.routeRenderingEvidence.status === 'not_run'
  ) {
    return 'not_run';
  }

  const jestPassedWithTargets =
    evidence.jestEvidence.status === 'passed' &&
    allRequiredTargetsPresent(evidence.jestEvidence.targets);
  const typecheckPassed = evidence.typecheckEvidence.status === 'passed';
  const routesRendered =
    evidence.routeRenderingEvidence.status === 'passed' &&
    allInternalRoutesRendered(evidence.routeRenderingEvidence);

  const criterionChecks: Record<AxiomGate8RunnerCriterionId, boolean> = {
    no_public_affordances:
      jestPassedWithTargets &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-internal-preview.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes('__tests__/axiom-next-nbl-candidate-pages.test.tsx') &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-scaffold.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-render-adapter.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-page-shell.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-public-page-preview.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-public-page-hold-packet.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-release-readiness-ledger.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-promotion-request-packet.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-surface-promotion-handoff-manifest.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-public-release-decision-packet-shell.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-public-navigation-release-route-shell.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-final-public-release-review-packet.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.tsx',
      ) &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell.test.tsx',
      ),
    required_hold_labels:
      jestPassedWithTargets &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-site-gate8-preflight-contract.test.ts',
      ),
    internal_route_rendering:
      jestPassedWithTargets &&
      routesRendered &&
      evidence.jestEvidence.targets.includes(
        '__tests__/axiom-site-candidate-page-route-map.test.ts',
      ),
    axiom_contract_regression: jestPassedWithTargets && typecheckPassed,
    falcon_eval_preservation:
      jestPassedWithTargets &&
      evidence.jestEvidence.targets.includes(
        '__tests__/falcon-expert-agent-core-eval-profile.test.ts',
      ),
  };

  return criterionChecks[criterionId]
    ? 'passed_internal_preflight_check'
    : 'failed_internal_preflight_check';
}

function buildCriterionReceipt(
  criterionId: AxiomGate8RunnerCriterionId,
  evidence: AxiomGate8PreflightRunnerEvidenceInput,
): AxiomGate8RunnerCriterionReceipt {
  const receiptStatus = criterionStatus(criterionId, evidence);

  return {
    criterionId,
    receiptStatus,
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
    satisfiesCriterionForCandidatePreflight: receiptStatus === 'passed_internal_preflight_check',
    inheritedBlocksCandidatePromotion: true,
    doesNotBlockInternalInspection: true,
  };
}

function receiptStatusFromCriteria(
  criterionReceipts: AxiomGate8RunnerCriterionReceipt[],
): AxiomGate8PreflightRunnerReceipt['receiptStatus'] {
  if (
    criterionReceipts.every(
      (receipt) => receipt.receiptStatus === 'passed_internal_preflight_check',
    )
  ) {
    return 'passed_internal_preflight_not_promoted';
  }

  if (
    criterionReceipts.some((receipt) => receipt.receiptStatus === 'failed_internal_preflight_check')
  ) {
    return 'failed_internal_preflight_not_promoted';
  }

  return 'not_run_internal_preflight_not_promoted';
}

export function buildAxiomGate8PreflightRunnerReceipt(
  criteriaPacket: AxiomGate8PreflightRunnerCriteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket(),
  evidence: AxiomGate8PreflightRunnerEvidenceInput = buildNotRunAxiomGate8PreflightRunnerEvidenceInput(),
): AxiomGate8PreflightRunnerReceipt {
  const criterionReceipts = criteriaPacket.criteria.map((criterion) =>
    buildCriterionReceipt(criterion.criterionId, evidence),
  );
  const receiptStatus = receiptStatusFromCriteria(criterionReceipts);

  return {
    receiptId: `axiom_gate8_runner_receipt_from_${criteriaPacket.packetId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    receiptStatus,
    boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY,
    sourceCriteriaPacketId: criteriaPacket.packetId,
    sourceRouteMapId: criteriaPacket.sourceRouteMapId,
    sourceCriteriaBoundary: criteriaPacket.boundary,
    criterionReceiptCount: criterionReceipts.length,
    criterionReceipts,
    routeTargetCount: criteriaPacket.routeTargetCount,
    routeTargets: criteriaPacket.routeTargets.map((target) => ({
      surface: target.surface,
      internalPath: target.internalPath,
    })),
    requiredTestTargets: [...criteriaPacket.requiredTestTargets],
    evidence,
    nextAllowedMovement:
      receiptStatus === 'passed_internal_preflight_not_promoted'
        ? 'prepare_falcon_candidate_surface_review_packet_only_not_public_release'
        : 'remain_internal_until_failed_or_not_run_checks_are_repaired',
    movementBoundary: {
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
    },
  };
}

export function validateAxiomGate8PreflightRunnerReceipt(
  receipt: AxiomGate8PreflightRunnerReceipt,
  criteriaPacket: AxiomGate8PreflightRunnerCriteriaPacket,
): AxiomGate8PreflightRunnerReceiptValidation {
  const errors: string[] = [];
  const sourceRouteMap = buildDefaultRouteMap();
  const sourcePreflight = buildAxiomGate8PreflightContract(sourceRouteMap);
  const criteriaValidation = validateAxiomGate8PreflightRunnerCriteriaPacket(
    criteriaPacket,
    sourcePreflight,
    sourceRouteMap,
  );
  const criterionReceiptIds = receipt.criterionReceipts.map((criterion) => criterion.criterionId);
  const routeTargetSurfaces = receipt.routeTargets.map((target) => target.surface);

  pushIf(!criteriaValidation.valid, errors, 'source_criteria_packet_must_validate');
  pushIf(receipt.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    receipt.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    receipt.boundary !== AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY,
    errors,
    'boundary_must_remain_internal_execution_evidence',
  );
  pushIf(
    receipt.sourceCriteriaPacketId !== criteriaPacket.packetId,
    errors,
    'source_criteria_packet_id_mismatch',
  );
  pushIf(
    receipt.sourceRouteMapId !== criteriaPacket.sourceRouteMapId,
    errors,
    'source_route_map_id_mismatch',
  );
  pushIf(
    receipt.sourceCriteriaBoundary !== criteriaPacket.boundary,
    errors,
    'source_criteria_boundary_mismatch',
  );
  pushIf(
    receipt.criterionReceiptCount !== criteriaPacket.criteria.length,
    errors,
    'criterion_receipt_count_must_match_criteria',
  );
  pushIf(
    receipt.criterionReceiptCount !== receipt.criterionReceipts.length,
    errors,
    'criterion_receipt_count_mismatch',
  );

  for (const criterion of criteriaPacket.criteria) {
    pushIf(
      !criterionReceiptIds.includes(criterion.criterionId),
      errors,
      `criterion_receipt_missing:${criterion.criterionId}`,
    );
  }

  for (const criterionReceipt of receipt.criterionReceipts) {
    pushIf(
      criterionReceipt.inheritedBlocksCandidatePromotion !== true ||
        criterionReceipt.doesNotBlockInternalInspection !== true,
      errors,
      `criterion_receipt_boundary_flags_invalid:${criterionReceipt.criterionId}`,
    );
    pushIf(
      criterionReceipt.satisfiesCriterionForCandidatePreflight !==
        (criterionReceipt.receiptStatus === 'passed_internal_preflight_check'),
      errors,
      `criterion_receipt_satisfaction_mismatch:${criterionReceipt.criterionId}`,
    );
    pushIf(
      criterionReceipt.evidenceRefs.length === 0 ||
        criterionReceipt.evidenceSummary.trim().length === 0,
      errors,
      `criterion_receipt_evidence_required:${criterionReceipt.criterionId}`,
    );
  }

  const expectedReceiptStatus = receiptStatusFromCriteria(receipt.criterionReceipts);
  pushIf(receipt.receiptStatus !== expectedReceiptStatus, errors, 'receipt_status_mismatch');

  pushIf(
    receipt.routeTargetCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'route_target_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(
    receipt.routeTargetCount !== receipt.routeTargets.length,
    errors,
    'route_target_count_mismatch',
  );
  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!routeTargetSurfaces.includes(surface), errors, `route_target_missing:${surface}`);
  }
  for (const target of receipt.routeTargets) {
    pushIf(
      !target.internalPath.startsWith('/internal/'),
      errors,
      `route_target_must_remain_internal:${target.surface}`,
    );
  }

  for (const testTarget of AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS) {
    pushIf(
      !receipt.requiredTestTargets.includes(testTarget),
      errors,
      `required_test_target_missing:${testTarget}`,
    );
  }

  pushIf(
    !allRequiredTargetsPresent(receipt.evidence.jestEvidence.targets),
    errors,
    'jest_evidence_must_include_all_required_targets',
  );
  if (receipt.receiptStatus === 'passed_internal_preflight_not_promoted') {
    pushIf(
      receipt.evidence.jestEvidence.status !== 'passed' ||
        receipt.evidence.typecheckEvidence.status !== 'passed' ||
        receipt.evidence.routeRenderingEvidence.status !== 'passed' ||
        !allInternalRoutesRendered(receipt.evidence.routeRenderingEvidence),
      errors,
      'passed_receipt_requires_passed_jest_typecheck_and_internal_route_rendering',
    );
    pushIf(
      receipt.nextAllowedMovement !==
        'prepare_falcon_candidate_surface_review_packet_only_not_public_release',
      errors,
      'passed_receipt_next_movement_must_be_review_packet_only',
    );
  }

  pushIf(
    receipt.movementBoundary.runtime !== 'not_changed' ||
      receipt.movementBoundary.prompt !== 'not_changed' ||
      receipt.movementBoundary.retrieval !== 'not_changed' ||
      receipt.movementBoundary.modelProvider !== 'not_changed' ||
      receipt.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    receipt.movementBoundary.publicApproval !== 'not_approved' ||
      receipt.movementBoundary.publication !== 'not_published' ||
      receipt.movementBoundary.publicNavigation !== 'not_added' ||
      receipt.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      receipt.movementBoundary.sourceValidity !== 'not_decided' ||
      receipt.movementBoundary.sourceCurrentness !== 'not_decided' ||
      receipt.movementBoundary.supportValidity !== 'not_decided' ||
      receipt.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      receipt.movementBoundary.runtimeApproved !== 'not_approved' ||
      receipt.movementBoundary.publicApproved !== 'not_approved' ||
      receipt.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      receipt.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'receipt_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
