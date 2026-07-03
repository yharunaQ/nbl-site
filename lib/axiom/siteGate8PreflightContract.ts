import {
  type AxiomCandidatePageRouteMap,
  buildAxiomCandidatePageRouteMap,
  validateAxiomCandidatePageRouteMap,
} from './siteCandidatePageRouteMap';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';
import { buildAxiomCandidatePageDataBundle } from './siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from './sitePreviewReviewMatrix';

export const AXIOM_GATE8_PREFLIGHT_BOUNDARY =
  'axiom_gate8_preflight_is_candidate_surface_readiness_contract_not_public_approval_or_release' as const;

export const AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES = [
  'public_boundary',
  'source_currentness_hold',
  'accessibility_readiness',
  'regression_readiness',
  'route_promotion_criteria',
  'human_review_gate',
] as const;

export type AxiomGate8CheckCategory = (typeof AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES)[number];

export type AxiomGate8PreflightCheck = {
  checkId: string;
  category: AxiomGate8CheckCategory;
  status: 'required_before_falcon_candidate_surface';
  blocksPublicRelease: true;
  blocksCandidatePromotionUntilSatisfied: true;
  doesNotBlockInternalInspection: true;
  requirement: string;
};

export type AxiomGate8RoutePreflight = {
  routePreflightId: string;
  surface: AxiomNextNblSiteSurface;
  sourceRouteId: string;
  internalPath: string;
  candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  sourceCurrentnessStatus: 'hold_until_reviewed_or_live_currentness_check';
  accessibilityStatus: 'required_not_run';
  regressionStatus: 'required_not_run';
  publicBoundaryStatus: 'required_not_approved';
  humanReviewStatus: 'surface_review_unit_required_before_candidate_promotion';
  requiredCheckCategories: AxiomGate8CheckCategory[];
};

export type AxiomGate8PreflightContract = {
  preflightId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'gate8_preflight_contract_not_candidate_surface_release';
  boundary: typeof AXIOM_GATE8_PREFLIGHT_BOUNDARY;
  sourceRouteMapId: string;
  requiredCheckCount: number;
  requiredChecks: AxiomGate8PreflightCheck[];
  routePreflightCount: number;
  routePreflights: AxiomGate8RoutePreflight[];
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

export type AxiomGate8PreflightContractValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_GATE8_PREFLIGHT_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildRequiredCheck(category: AxiomGate8CheckCategory): AxiomGate8PreflightCheck {
  const requirements: Record<AxiomGate8CheckCategory, string> = {
    public_boundary:
      'Confirm the candidate surface does not provide final advice, public approval, diagnosis, legal judgment, accommodation finality, or publication claim.',
    source_currentness_hold:
      'Keep all current policy, source validity, support validity, and external evidence claims on hold until reviewed or live-currentness checked.',
    accessibility_readiness:
      'Run candidate-surface accessibility checks before any Falcon candidate promotion.',
    regression_readiness:
      'Run regression checks for Axiom contracts, Falcon eval profile, route rendering, and no-public-affordance boundaries before promotion.',
    route_promotion_criteria:
      'Promote only from internal candidate page data to Falcon candidate surface after all Gate 8 checks pass; never directly to public release.',
    human_review_gate:
      'Require framework/surface review before candidate promotion; review does not approve public release, source/support validity, or learning updates.',
  };

  return {
    checkId: `gate8_check_${category}`,
    category,
    status: 'required_before_falcon_candidate_surface',
    blocksPublicRelease: true,
    blocksCandidatePromotionUntilSatisfied: true,
    doesNotBlockInternalInspection: true,
    requirement: requirements[category],
  };
}

function buildRoutePreflight(
  routeMap: AxiomCandidatePageRouteMap,
  surface: AxiomNextNblSiteSurface,
): AxiomGate8RoutePreflight {
  const route = routeMap.routes.find((candidate) => candidate.surface === surface);

  if (!route) {
    throw new Error(`axiom_gate8_route_missing:${surface}`);
  }

  return {
    routePreflightId: `axiom_gate8_route_preflight_${surface}`,
    surface,
    sourceRouteId: route.routeId,
    internalPath: route.internalPath,
    candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    sourceCurrentnessStatus: 'hold_until_reviewed_or_live_currentness_check',
    accessibilityStatus: 'required_not_run',
    regressionStatus: 'required_not_run',
    publicBoundaryStatus: 'required_not_approved',
    humanReviewStatus: 'surface_review_unit_required_before_candidate_promotion',
    requiredCheckCategories: [...AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES],
  };
}

export function buildAxiomGate8PreflightContract(
  routeMap: AxiomCandidatePageRouteMap = buildAxiomCandidatePageRouteMap(
    buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
  ),
): AxiomGate8PreflightContract {
  const requiredChecks = AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES.map((category) =>
    buildRequiredCheck(category),
  );
  const routePreflights = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
    buildRoutePreflight(routeMap, surface),
  );

  return {
    preflightId: `axiom_gate8_preflight_from_${routeMap.routeMapId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'gate8_preflight_contract_not_candidate_surface_release',
    boundary: AXIOM_GATE8_PREFLIGHT_BOUNDARY,
    sourceRouteMapId: routeMap.routeMapId,
    requiredCheckCount: requiredChecks.length,
    requiredChecks,
    routePreflightCount: routePreflights.length,
    routePreflights,
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

export function validateAxiomGate8PreflightContract(
  preflight: AxiomGate8PreflightContract,
  sourceRouteMap: AxiomCandidatePageRouteMap,
): AxiomGate8PreflightContractValidation {
  const errors: string[] = [];
  const sourceCandidatePageDataBundle = buildAxiomCandidatePageDataBundle(
    buildAxiomSitePreviewReviewMatrix(),
  );
  const routeMapValidation = validateAxiomCandidatePageRouteMap(
    sourceRouteMap,
    sourceCandidatePageDataBundle,
  );
  const checkCategories = preflight.requiredChecks.map((check) => check.category);
  const preflightSurfaces = preflight.routePreflights.map((route) => route.surface);

  pushIf(!routeMapValidation.valid, errors, 'source_route_map_must_validate');
  pushIf(preflight.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    preflight.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    preflight.status !== 'gate8_preflight_contract_not_candidate_surface_release',
    errors,
    'status_must_remain_gate8_preflight_not_candidate_surface_release',
  );
  pushIf(
    preflight.boundary !== AXIOM_GATE8_PREFLIGHT_BOUNDARY,
    errors,
    'boundary_must_remain_candidate_readiness_not_public_approval',
  );
  pushIf(
    preflight.sourceRouteMapId !== sourceRouteMap.routeMapId,
    errors,
    'source_route_map_id_mismatch',
  );
  pushIf(
    preflight.requiredCheckCount !== AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES.length,
    errors,
    'required_check_count_must_match_gate8_categories',
  );
  pushIf(
    preflight.requiredCheckCount !== preflight.requiredChecks.length,
    errors,
    'required_check_count_must_match_required_checks_length',
  );

  for (const category of AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES) {
    pushIf(!checkCategories.includes(category), errors, `gate8_check_missing:${category}`);
  }

  for (const check of preflight.requiredChecks) {
    pushIf(
      check.status !== 'required_before_falcon_candidate_surface',
      errors,
      `gate8_check_status_must_be_required:${check.checkId}`,
    );
    pushIf(
      check.blocksPublicRelease !== true ||
        check.blocksCandidatePromotionUntilSatisfied !== true ||
        check.doesNotBlockInternalInspection !== true,
      errors,
      `gate8_check_blocking_flags_invalid:${check.checkId}`,
    );
    pushIf(
      check.requirement.trim().length === 0,
      errors,
      `gate8_check_requirement_required:${check.checkId}`,
    );
  }

  pushIf(
    preflight.routePreflightCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'route_preflight_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(
    preflight.routePreflightCount !== preflight.routePreflights.length,
    errors,
    'route_preflight_count_must_match_route_preflights_length',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !preflightSurfaces.includes(surface),
      errors,
      `gate8_route_preflight_missing:${surface}`,
    );
  }

  for (const routePreflight of preflight.routePreflights) {
    const sourceRoute = sourceRouteMap.routes.find(
      (route) => route.surface === routePreflight.surface,
    );

    pushIf(!sourceRoute, errors, `gate8_source_route_missing:${routePreflight.surface}`);
    if (sourceRoute) {
      pushIf(
        routePreflight.sourceRouteId !== sourceRoute.routeId ||
          routePreflight.internalPath !== sourceRoute.internalPath,
        errors,
        `gate8_route_preflight_must_match_source_route:${routePreflight.surface}`,
      );
    }
    pushIf(
      routePreflight.candidateSurfaceStatus !== 'not_promoted_to_falcon_candidate_surface' ||
        routePreflight.publicUseStatus !== 'not_public_approved' ||
        routePreflight.publicationStatus !== 'not_published',
      errors,
      `gate8_route_must_not_be_promoted_public_or_published:${routePreflight.surface}`,
    );
    pushIf(
      routePreflight.sourceCurrentnessStatus !== 'hold_until_reviewed_or_live_currentness_check' ||
        routePreflight.accessibilityStatus !== 'required_not_run' ||
        routePreflight.regressionStatus !== 'required_not_run' ||
        routePreflight.publicBoundaryStatus !== 'required_not_approved' ||
        routePreflight.humanReviewStatus !==
          'surface_review_unit_required_before_candidate_promotion',
      errors,
      `gate8_route_required_statuses_invalid:${routePreflight.surface}`,
    );

    for (const category of AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES) {
      pushIf(
        !routePreflight.requiredCheckCategories.includes(category),
        errors,
        `gate8_route_required_category_missing:${routePreflight.surface}:${category}`,
      );
    }
  }

  pushIf(
    preflight.movementBoundary.runtime !== 'not_changed' ||
      preflight.movementBoundary.prompt !== 'not_changed' ||
      preflight.movementBoundary.retrieval !== 'not_changed' ||
      preflight.movementBoundary.modelProvider !== 'not_changed' ||
      preflight.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    preflight.movementBoundary.publicApproval !== 'not_approved' ||
      preflight.movementBoundary.publication !== 'not_published' ||
      preflight.movementBoundary.publicNavigation !== 'not_added' ||
      preflight.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      preflight.movementBoundary.sourceValidity !== 'not_decided' ||
      preflight.movementBoundary.sourceCurrentness !== 'not_decided' ||
      preflight.movementBoundary.supportValidity !== 'not_decided' ||
      preflight.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      preflight.movementBoundary.runtimeApproved !== 'not_approved' ||
      preflight.movementBoundary.publicApproved !== 'not_approved' ||
      preflight.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      preflight.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'gate8_preflight_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_GATE8_PREFLIGHT_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
