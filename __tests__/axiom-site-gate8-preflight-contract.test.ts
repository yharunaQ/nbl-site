import {
  AXIOM_GATE8_PREFLIGHT_BOUNDARY,
  AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES,
  buildAxiomGate8PreflightContract,
  validateAxiomGate8PreflightContract,
  type AxiomGate8PreflightContract,
} from '@/lib/axiom/siteGate8PreflightContract';
import { buildAxiomCandidatePageRouteMap } from '@/lib/axiom/siteCandidatePageRouteMap';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePreflight(preflight: AxiomGate8PreflightContract): AxiomGate8PreflightContract {
  return JSON.parse(JSON.stringify(preflight)) as AxiomGate8PreflightContract;
}

describe('Axiom Gate 8 preflight contract', () => {
  it('builds a Gate 8 preflight contract from the internal candidate route map', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);
    const validation = validateAxiomGate8PreflightContract(preflight, routeMap);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_GATE8_PREFLIGHT_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(preflight).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'gate8_preflight_contract_not_candidate_surface_release',
      boundary: AXIOM_GATE8_PREFLIGHT_BOUNDARY,
      sourceRouteMapId: routeMap.routeMapId,
      requiredCheckCount: AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES.length,
      routePreflightCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
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
    });
  });

  it('requires the six Gate 8 check categories before candidate promotion', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);

    expect(preflight.requiredChecks.map((check) => check.category)).toEqual(
      AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES,
    );
    expect(
      preflight.requiredChecks.every(
        (check) =>
          check.status === 'required_before_falcon_candidate_surface' &&
          check.blocksPublicRelease &&
          check.blocksCandidatePromotionUntilSatisfied &&
          check.doesNotBlockInternalInspection,
      ),
    ).toBe(true);
  });

  it('keeps every surface on hold for currentness, accessibility, regression, boundary, and review', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);

    expect(preflight.routePreflights.map((route) => route.surface)).toEqual(
      AXIOM_NEXT_NBL_SITE_SURFACES,
    );
    expect(
      preflight.routePreflights.every(
        (route) =>
          route.candidateSurfaceStatus === 'not_promoted_to_falcon_candidate_surface' &&
          route.publicUseStatus === 'not_public_approved' &&
          route.publicationStatus === 'not_published' &&
          route.sourceCurrentnessStatus === 'hold_until_reviewed_or_live_currentness_check' &&
          route.accessibilityStatus === 'required_not_run' &&
          route.regressionStatus === 'required_not_run' &&
          route.publicBoundaryStatus === 'required_not_approved' &&
          route.humanReviewStatus === 'surface_review_unit_required_before_candidate_promotion',
      ),
    ).toBe(true);
    expect(
      preflight.routePreflights.every((route) =>
        AXIOM_GATE8_REQUIRED_CHECK_CATEGORIES.every((category) =>
          route.requiredCheckCategories.includes(category),
        ),
      ),
    ).toBe(true);
  });

  it('rejects missing checks, missing surface preflight, and promotion movement', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = clonePreflight(buildAxiomGate8PreflightContract(routeMap));
    preflight.requiredChecks = preflight.requiredChecks.filter(
      (check) => check.category !== 'public_boundary',
    );
    preflight.requiredCheckCount = preflight.requiredChecks.length;
    preflight.routePreflights = preflight.routePreflights.filter(
      (route) => route.surface !== 'scene_entry_use_cases',
    );
    preflight.routePreflightCount = preflight.routePreflights.length;
    preflight.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomGate8PreflightContract['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomGate8PreflightContract(preflight, routeMap);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'required_check_count_must_match_gate8_categories',
        'gate8_check_missing:public_boundary',
        'route_preflight_count_must_match_fixed_next_nbl_surfaces',
        'gate8_route_preflight_missing:scene_entry_use_cases',
        'gate8_preflight_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
