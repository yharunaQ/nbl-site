import {
  AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE,
  AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY,
  buildAxiomCandidatePageRouteMap,
  validateAxiomCandidatePageRouteMap,
  type AxiomCandidatePageRouteMap,
} from '@/lib/axiom/siteCandidatePageRouteMap';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneRouteMap(routeMap: AxiomCandidatePageRouteMap): AxiomCandidatePageRouteMap {
  return JSON.parse(JSON.stringify(routeMap)) as AxiomCandidatePageRouteMap;
}

describe('Axiom site candidate page route map', () => {
  it('builds internal inspection routes for all fixed next NBL surfaces', () => {
    const bundle = buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix());
    const routeMap = buildAxiomCandidatePageRouteMap(bundle);
    const validation = validateAxiomCandidatePageRouteMap(routeMap, bundle);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(routeMap).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_page_route_map_not_public_navigation',
      boundary: AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY,
      routeBase: AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE,
      sourceCandidatePageDataBundleId: bundle.bundleId,
      routeCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        publicNavigation: 'not_added',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        knowledgePromotion: 'not_promoted',
        learningUpdate: 'not_updated',
      },
    });
    expect(routeMap.routes.map((route) => route.surface)).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(routeMap.routes.every((route) => route.internalPath.startsWith('/internal/'))).toBe(
      true,
    );
  });

  it('keeps every route internal-only, not public approved, and not published', () => {
    const bundle = buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix());
    const routeMap = buildAxiomCandidatePageRouteMap(bundle);

    expect(
      routeMap.routes.every(
        (route) =>
          route.routeStatus === 'internal_inspection_route_only_not_public_navigation' &&
          route.rendererStatus === 'render_internal_inspection_surface_only' &&
          route.publicUseStatus === 'not_public_approved' &&
          route.publicationStatus === 'not_published',
      ),
    ).toBe(true);
    expect(
      routeMap.routes.every(
        (route) => route.reviewRoute === 'surface_review_unit_required_before_public_page_build',
      ),
    ).toBe(true);
  });

  it('rejects route maps that drop a surface or move public navigation', () => {
    const bundle = buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix());
    const routeMap = cloneRouteMap(buildAxiomCandidatePageRouteMap(bundle));
    routeMap.routes = routeMap.routes.filter((route) => route.surface !== 'scene_entry_use_cases');
    routeMap.routeCount = routeMap.routes.length;
    routeMap.movementBoundary.publicNavigation =
      'added' as unknown as AxiomCandidatePageRouteMap['movementBoundary']['publicNavigation'];

    const validation = validateAxiomCandidatePageRouteMap(routeMap, bundle);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'route_count_must_match_fixed_next_nbl_surfaces',
        'candidate_page_route_missing:scene_entry_use_cases',
        'route_map_must_not_move_public_navigation_approval_validity_promotion_or_learning',
      ]),
    );
  });
});
