import {
  AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY,
  AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE,
  buildAxiomReviewedKernelBackedCandidateRouteMap,
  getAxiomReviewedKernelBackedCandidatePageForSlug,
  validateAxiomReviewedKernelBackedCandidateRouteMap,
  type AxiomReviewedKernelBackedCandidateRouteMap,
} from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';

function cloneRouteMap(
  routeMap: AxiomReviewedKernelBackedCandidateRouteMap,
): AxiomReviewedKernelBackedCandidateRouteMap {
  return JSON.parse(JSON.stringify(routeMap)) as AxiomReviewedKernelBackedCandidateRouteMap;
}

describe('Axiom reviewed kernel-backed candidate route map', () => {
  it('builds 9 internal candidate routes from reviewed page assembly', () => {
    const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap();
    const validation = validateAxiomReviewedKernelBackedCandidateRouteMap(routeMap);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'reviewed_kernel_backed_candidate_route_map_valid',
      errorCount: 0,
      boundary: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY,
    });
    expect(routeMap).toMatchObject({
      objectType: 'axiom_reviewed_kernel_backed_candidate_route_map',
      lane: 'Falcon Lab',
      status: 'reviewed_kernel_backed_internal_candidate_routes_ready',
      routeBase: AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE,
      routeCount: 9,
    });
    expect(routeMap.routes.map((route) => route.slug)).toEqual([
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ]);
  });

  it('keeps all candidate route paths internal and traceable to kernel sections', () => {
    const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap();

    for (const route of routeMap.routes) {
      expect(route.path).toMatch(/^\/internal\/axiom-next-nbl-reviewed-candidate\//);
      expect(route.routeStatus).toBe('internal_candidate_route_created_not_actual_public_navigation');
      expect(route.publicNavigationStatus).toBe('not_public_navigation');
      expect(route.publicUseStatus).toBe('not_public_approved');
      expect(route.publicationStatus).toBe('not_published');
      expect(route.sourceSectionIds.length).toBeGreaterThan(0);
      expect(route.sourceSlotIds.length).toBeGreaterThan(0);
      expect(route.sourceKernelRowIds.length).toBeGreaterThan(0);
      expect(route.sourceReviewUnitIds.length).toBeGreaterThan(0);
    }
  });

  it('resolves a slug to its reviewed candidate page and route', () => {
    const resolved = getAxiomReviewedKernelBackedCandidatePageForSlug('work-condition-window');

    expect(resolved?.route.surface).toBe('work_condition_window');
    expect(resolved?.route.path).toBe(
      '/internal/axiom-next-nbl-reviewed-candidate/work-condition-window',
    );
    expect(resolved?.page.pageTitleJa).toBe('Work-condition Window');
  });

  it('rejects route maps that drift into public navigation or lose route coverage', () => {
    const routeMap = cloneRouteMap(buildAxiomReviewedKernelBackedCandidateRouteMap());

    routeMap.routes = routeMap.routes.slice(0, 8);
    routeMap.routeCount = 8 as 9;
    routeMap.routes[0].path = '/work-condition-window';
    routeMap.routes[0].publicNavigationStatus =
      'public_navigation' as unknown as 'not_public_navigation';
    routeMap.movementBoundary.publication = 'published' as unknown as 'not_published';
    routeMap.notNow = routeMap.notNow.filter(
      (item) => item !== 'no_actual_public_navigation_from_internal_candidate_routes',
    );

    const validation = validateAxiomReviewedKernelBackedCandidateRouteMap(routeMap);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'route_map_must_cover_nine_surfaces_in_fixed_order',
        'route_map_must_have_unique_expected_slugs',
        expect.stringContaining('route_path_must_stay_internal_candidate:'),
        expect.stringContaining('route_must_not_be_public_navigation_approved_or_published:'),
        'movement_boundary_must_not_move_public_navigation_finality_publication_runtime_promotion_or_learning',
        'not_now_must_block_public_navigation_finality_publication_runtime_learning_and_sensitive_source_export',
      ]),
    );
  });
});
