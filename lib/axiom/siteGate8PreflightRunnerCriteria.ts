import {
  AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES,
  type AxiomGate8CheckCategory,
  type AxiomGate8PreflightContract,
  buildAxiomGate8PreflightContract,
  validateAxiomGate8PreflightContract,
} from './siteGate8PreflightContract';
import {
  type AxiomCandidatePageRouteMap,
  buildAxiomCandidatePageRouteMap,
} from './siteCandidatePageRouteMap';
import { buildAxiomCandidatePageDataBundle } from './siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from './sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from './siteSurfaceSlotContract';

export const AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY =
  'axiom_gate8_preflight_runner_criteria_is_internal_required_check_packet_not_candidate_promotion_or_public_release' as const;

export const AXIOM_GATE8_RUNNER_CRITERION_IDS = [
  'no_public_affordances',
  'required_hold_labels',
  'internal_route_rendering',
  'axiom_contract_regression',
  'falcon_eval_preservation',
] as const;

export const AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS = [
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
] as const;

export type AxiomGate8RunnerCriterionId = (typeof AXIOM_GATE8_RUNNER_CRITERION_IDS)[number];

export type AxiomGate8RunnerCriterion = {
  criterionId: AxiomGate8RunnerCriterionId;
  status: 'required_not_run';
  sourceGate8Category: AxiomGate8CheckCategory;
  relatedGate8Categories: AxiomGate8CheckCategory[];
  commandHint: string;
  evidenceRequired: string[];
  blocksCandidatePromotion: true;
  doesNotBlockInternalInspection: true;
};

export type AxiomGate8RunnerRouteTarget = {
  surface: (typeof AXIOM_NEXT_NBL_SITE_SURFACES)[number];
  internalPath: string;
  sourceRoutePreflightId: string;
  targetStatus: 'internal_route_target_required_not_run';
  renderRequirement: 'http_200_or_component_render_required_before_candidate_promotion';
  publicNavigationStatus: 'not_added';
};

export type AxiomGate8PreflightRunnerCriteriaPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'runner_criteria_packet_internal_required_not_run';
  boundary: typeof AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY;
  sourcePreflightId: string;
  sourceRouteMapId: string;
  criteriaCount: number;
  criteria: AxiomGate8RunnerCriterion[];
  routeTargetCount: number;
  routeTargets: AxiomGate8RunnerRouteTarget[];
  requiredTestTargetCount: number;
  requiredTestTargets: string[];
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

export type AxiomGate8PreflightRunnerCriteriaValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY;
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

function buildCriterion(criterionId: AxiomGate8RunnerCriterionId): AxiomGate8RunnerCriterion {
  const criteria: Record<AxiomGate8RunnerCriterionId, AxiomGate8RunnerCriterion> = {
    no_public_affordances: {
      criterionId,
      status: 'required_not_run',
      sourceGate8Category: 'public_boundary',
      relatedGate8Categories: ['public_boundary'],
      commandHint:
        'Render internal preview surfaces and assert no form, input, textarea, select, button, public approval, publish, or outbound navigation affordance is exposed.',
      evidenceRequired: [
        '__tests__/axiom-next-nbl-internal-preview.test.tsx',
        '__tests__/axiom-next-nbl-candidate-pages.test.tsx',
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
      ],
      blocksCandidatePromotion: true,
      doesNotBlockInternalInspection: true,
    },
    required_hold_labels: {
      criterionId,
      status: 'required_not_run',
      sourceGate8Category: 'source_currentness_hold',
      relatedGate8Categories: ['source_currentness_hold', 'human_review_gate'],
      commandHint:
        'Assert currentness, public boundary, human review, publication, source/support validity, and learning-update hold labels remain visible before candidate promotion.',
      evidenceRequired: [
        '__tests__/axiom-site-gate8-preflight-contract.test.ts',
        '__tests__/axiom-next-nbl-internal-preview.test.tsx',
        '__tests__/axiom-next-nbl-candidate-pages.test.tsx',
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
      ],
      blocksCandidatePromotion: true,
      doesNotBlockInternalInspection: true,
    },
    internal_route_rendering: {
      criterionId,
      status: 'required_not_run',
      sourceGate8Category: 'route_promotion_criteria',
      relatedGate8Categories: ['route_promotion_criteria', 'accessibility_readiness'],
      commandHint:
        'Confirm every fixed next-NBL surface has an internal route target and renders only as internal inspection before Falcon candidate-surface promotion.',
      evidenceRequired: [
        '__tests__/axiom-site-candidate-page-route-map.test.ts',
        '__tests__/axiom-next-nbl-candidate-pages.test.tsx',
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
      ],
      blocksCandidatePromotion: true,
      doesNotBlockInternalInspection: true,
    },
    axiom_contract_regression: {
      criterionId,
      status: 'required_not_run',
      sourceGate8Category: 'regression_readiness',
      relatedGate8Categories: ['regression_readiness'],
      commandHint:
        'Run the Axiom kernel, evaluator, surface slot, candidate page, route-map, preflight, and preview contracts together.',
      evidenceRequired: [
        '__tests__/axiom-interaction-hypothesis-kernel-contract.test.ts',
        '__tests__/axiom-interaction-hypothesis-kernel-evaluator.test.ts',
        '__tests__/axiom-site-preview-review-matrix.test.ts',
        '__tests__/axiom-site-candidate-page-data.test.ts',
        '__tests__/axiom-site-candidate-page-route-map.test.ts',
        '__tests__/axiom-site-gate8-preflight-contract.test.ts',
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
      ],
      blocksCandidatePromotion: true,
      doesNotBlockInternalInspection: true,
    },
    falcon_eval_preservation: {
      criterionId,
      status: 'required_not_run',
      sourceGate8Category: 'regression_readiness',
      relatedGate8Categories: ['regression_readiness'],
      commandHint:
        'Run the existing Falcon expert-agent core eval profile without weakening or replacing it.',
      evidenceRequired: ['__tests__/falcon-expert-agent-core-eval-profile.test.ts'],
      blocksCandidatePromotion: true,
      doesNotBlockInternalInspection: true,
    },
  };

  return criteria[criterionId];
}

function buildRouteTarget(
  routePreflight: AxiomGate8PreflightContract['routePreflights'][number],
): AxiomGate8RunnerRouteTarget {
  return {
    surface: routePreflight.surface,
    internalPath: routePreflight.internalPath,
    sourceRoutePreflightId: routePreflight.routePreflightId,
    targetStatus: 'internal_route_target_required_not_run',
    renderRequirement: 'http_200_or_component_render_required_before_candidate_promotion',
    publicNavigationStatus: 'not_added',
  };
}

export function buildAxiomGate8PreflightRunnerCriteriaPacket(
  preflight: AxiomGate8PreflightContract = buildAxiomGate8PreflightContract(buildDefaultRouteMap()),
  sourceRouteMap: AxiomCandidatePageRouteMap = buildDefaultRouteMap(),
): AxiomGate8PreflightRunnerCriteriaPacket {
  const criteria = AXIOM_GATE8_RUNNER_CRITERION_IDS.map((criterionId) =>
    buildCriterion(criterionId),
  );
  const routeTargets = preflight.routePreflights.map((routePreflight) =>
    buildRouteTarget(routePreflight),
  );

  return {
    packetId: `axiom_gate8_runner_criteria_from_${preflight.preflightId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status: 'runner_criteria_packet_internal_required_not_run',
    boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
    sourcePreflightId: preflight.preflightId,
    sourceRouteMapId: sourceRouteMap.routeMapId,
    criteriaCount: criteria.length,
    criteria,
    routeTargetCount: routeTargets.length,
    routeTargets,
    requiredTestTargetCount: AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS.length,
    requiredTestTargets: [...AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS],
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

export function validateAxiomGate8PreflightRunnerCriteriaPacket(
  packet: AxiomGate8PreflightRunnerCriteriaPacket,
  preflight: AxiomGate8PreflightContract,
  sourceRouteMap: AxiomCandidatePageRouteMap,
): AxiomGate8PreflightRunnerCriteriaValidation {
  const errors: string[] = [];
  const preflightValidation = validateAxiomGate8PreflightContract(preflight, sourceRouteMap);
  const criterionIds = packet.criteria.map((criterion) => criterion.criterionId);
  const routeTargetSurfaces = packet.routeTargets.map((target) => target.surface);
  const relatedGate8Categories = new Set(
    packet.criteria.flatMap((criterion) => criterion.relatedGate8Categories),
  );

  pushIf(!preflightValidation.valid, errors, 'source_preflight_must_validate');
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    packet.status !== 'runner_criteria_packet_internal_required_not_run',
    errors,
    'status_must_remain_runner_criteria_required_not_run',
  );
  pushIf(
    packet.boundary !== AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
    errors,
    'boundary_must_remain_internal_required_check_packet',
  );
  pushIf(
    packet.sourcePreflightId !== preflight.preflightId,
    errors,
    'source_preflight_id_mismatch',
  );
  pushIf(
    packet.sourceRouteMapId !== sourceRouteMap.routeMapId,
    errors,
    'source_route_map_id_mismatch',
  );
  pushIf(
    packet.criteriaCount !== AXIOM_GATE8_RUNNER_CRITERION_IDS.length,
    errors,
    'criteria_count_must_match_required_runner_criteria',
  );
  pushIf(packet.criteriaCount !== packet.criteria.length, errors, 'criteria_count_mismatch');

  for (const criterionId of AXIOM_GATE8_RUNNER_CRITERION_IDS) {
    pushIf(!criterionIds.includes(criterionId), errors, `runner_criterion_missing:${criterionId}`);
  }

  for (const criterion of packet.criteria) {
    pushIf(
      criterion.status !== 'required_not_run',
      errors,
      `runner_criterion_status_must_be_required_not_run:${criterion.criterionId}`,
    );
    pushIf(
      !AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES.includes(criterion.sourceGate8Category),
      errors,
      `runner_criterion_source_category_invalid:${criterion.criterionId}`,
    );
    for (const relatedCategory of criterion.relatedGate8Categories) {
      pushIf(
        !AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES.includes(relatedCategory),
        errors,
        `runner_criterion_related_category_invalid:${criterion.criterionId}:${relatedCategory}`,
      );
    }
    pushIf(
      criterion.commandHint.trim().length === 0,
      errors,
      `runner_criterion_command_hint_required:${criterion.criterionId}`,
    );
    pushIf(
      criterion.evidenceRequired.length === 0,
      errors,
      `runner_criterion_evidence_required:${criterion.criterionId}`,
    );
    pushIf(
      criterion.blocksCandidatePromotion !== true ||
        criterion.doesNotBlockInternalInspection !== true,
      errors,
      `runner_criterion_blocking_flags_invalid:${criterion.criterionId}`,
    );
  }

  for (const category of AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES) {
    pushIf(
      !relatedGate8Categories.has(category),
      errors,
      `runner_criteria_related_gate8_category_missing:${category}`,
    );
  }

  pushIf(
    packet.routeTargetCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'route_target_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(
    packet.routeTargetCount !== packet.routeTargets.length,
    errors,
    'route_target_count_mismatch',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !routeTargetSurfaces.includes(surface),
      errors,
      `runner_route_target_missing:${surface}`,
    );
  }

  for (const target of packet.routeTargets) {
    const sourceRoutePreflight = preflight.routePreflights.find(
      (routePreflight) => routePreflight.surface === target.surface,
    );

    pushIf(
      !sourceRoutePreflight,
      errors,
      `runner_source_route_preflight_missing:${target.surface}`,
    );
    if (sourceRoutePreflight) {
      pushIf(
        target.internalPath !== sourceRoutePreflight.internalPath ||
          target.sourceRoutePreflightId !== sourceRoutePreflight.routePreflightId,
        errors,
        `runner_route_target_must_match_preflight:${target.surface}`,
      );
    }
    pushIf(
      !target.internalPath.startsWith('/internal/'),
      errors,
      `runner_route_target_must_remain_internal:${target.surface}`,
    );
    pushIf(
      target.targetStatus !== 'internal_route_target_required_not_run' ||
        target.renderRequirement !==
          'http_200_or_component_render_required_before_candidate_promotion' ||
        target.publicNavigationStatus !== 'not_added',
      errors,
      `runner_route_target_status_invalid:${target.surface}`,
    );
  }

  pushIf(
    packet.requiredTestTargetCount !== AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS.length,
    errors,
    'required_test_target_count_must_match_runner_targets',
  );
  pushIf(
    packet.requiredTestTargetCount !== packet.requiredTestTargets.length,
    errors,
    'required_test_target_count_mismatch',
  );

  for (const testTarget of AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS) {
    pushIf(
      !packet.requiredTestTargets.includes(testTarget),
      errors,
      `required_test_target_missing:${testTarget}`,
    );
  }

  pushIf(
    packet.movementBoundary.runtime !== 'not_changed' ||
      packet.movementBoundary.prompt !== 'not_changed' ||
      packet.movementBoundary.retrieval !== 'not_changed' ||
      packet.movementBoundary.modelProvider !== 'not_changed' ||
      packet.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    packet.movementBoundary.publicApproval !== 'not_approved' ||
      packet.movementBoundary.publication !== 'not_published' ||
      packet.movementBoundary.publicNavigation !== 'not_added' ||
      packet.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      packet.movementBoundary.sourceValidity !== 'not_decided' ||
      packet.movementBoundary.sourceCurrentness !== 'not_decided' ||
      packet.movementBoundary.supportValidity !== 'not_decided' ||
      packet.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      packet.movementBoundary.runtimeApproved !== 'not_approved' ||
      packet.movementBoundary.publicApproved !== 'not_approved' ||
      packet.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      packet.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'runner_criteria_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
