import {
  type AxiomCandidatePageData,
  type AxiomCandidatePageDataBundle,
  buildAxiomCandidatePageDataBundle,
  validateAxiomCandidatePageDataBundle,
} from './siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from './sitePreviewReviewMatrix';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY =
  'axiom_site_candidate_page_route_map_is_internal_inspection_not_public_navigation_or_publication' as const;

export const AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE =
  '/internal/axiom-next-nbl-candidate-pages' as const;

export type AxiomCandidatePageRoute = {
  routeId: string;
  surface: AxiomNextNblSiteSurface;
  sourcePageDataId: string;
  internalPath: `${typeof AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE}#${AxiomNextNblSiteSurface}`;
  routeStatus: 'internal_inspection_route_only_not_public_navigation';
  rendererStatus: 'render_internal_inspection_surface_only';
  reviewRoute: AxiomCandidatePageData['reviewRoute'];
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomCandidatePageRouteMap = {
  routeMapId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_page_route_map_not_public_navigation';
  boundary: typeof AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY;
  routeBase: typeof AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE;
  sourceCandidatePageDataBundleId: string;
  routeCount: number;
  routes: AxiomCandidatePageRoute[];
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    publicNavigation: 'not_added';
    sourceValidity: 'not_decided';
    supportValidity: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    knowledgePromotion: 'not_promoted';
    learningUpdate: 'not_updated';
  };
};

export type AxiomCandidatePageRouteMapValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildCandidatePageRoute(page: AxiomCandidatePageData): AxiomCandidatePageRoute {
  return {
    routeId: `axiom_candidate_page_route_${page.surface}`,
    surface: page.surface,
    sourcePageDataId: page.pageDataId,
    internalPath: `${AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE}#${page.surface}`,
    routeStatus: 'internal_inspection_route_only_not_public_navigation',
    rendererStatus: 'render_internal_inspection_surface_only',
    reviewRoute: page.reviewRoute,
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

export function buildAxiomCandidatePageRouteMap(
  candidatePageDataBundle: AxiomCandidatePageDataBundle = buildAxiomCandidatePageDataBundle(
    buildAxiomSitePreviewReviewMatrix(),
  ),
): AxiomCandidatePageRouteMap {
  const routes = candidatePageDataBundle.pages.map((page) => buildCandidatePageRoute(page));

  return {
    routeMapId: `axiom_candidate_page_route_map_from_${candidatePageDataBundle.bundleId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_page_route_map_not_public_navigation',
    boundary: AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY,
    routeBase: AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE,
    sourceCandidatePageDataBundleId: candidatePageDataBundle.bundleId,
    routeCount: routes.length,
    routes,
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
  };
}

export function validateAxiomCandidatePageRouteMap(
  routeMap: AxiomCandidatePageRouteMap,
  candidatePageDataBundle: AxiomCandidatePageDataBundle,
): AxiomCandidatePageRouteMapValidation {
  const errors: string[] = [];
  const sourceMatrix = buildAxiomSitePreviewReviewMatrix();
  const bundleValidation = validateAxiomCandidatePageDataBundle(
    candidatePageDataBundle,
    sourceMatrix,
  );
  const routeSurfaces = routeMap.routes.map((route) => route.surface);

  pushIf(!bundleValidation.valid, errors, 'source_candidate_page_data_bundle_must_validate');
  pushIf(routeMap.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    routeMap.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    routeMap.status !== 'internal_candidate_page_route_map_not_public_navigation',
    errors,
    'status_must_remain_internal_route_map_not_public_navigation',
  );
  pushIf(
    routeMap.boundary !== AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY,
    errors,
    'boundary_must_remain_internal_inspection_not_public_navigation',
  );
  pushIf(
    routeMap.routeBase !== AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE,
    errors,
    'route_base_must_remain_internal_candidate_pages',
  );
  pushIf(
    routeMap.sourceCandidatePageDataBundleId !== candidatePageDataBundle.bundleId,
    errors,
    'source_candidate_page_data_bundle_id_mismatch',
  );
  pushIf(
    routeMap.routeCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'route_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(routeMap.routeCount !== routeMap.routes.length, errors, 'route_count_must_match_routes');

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!routeSurfaces.includes(surface), errors, `candidate_page_route_missing:${surface}`);
  }

  for (const route of routeMap.routes) {
    const sourcePage = candidatePageDataBundle.pages.find((page) => page.surface === route.surface);

    pushIf(!sourcePage, errors, `route_source_page_missing:${route.surface}`);
    pushIf(
      route.internalPath !== `${AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE}#${route.surface}`,
      errors,
      `route_internal_path_must_be_internal_anchor:${route.surface}`,
    );
    pushIf(
      route.routeStatus !== 'internal_inspection_route_only_not_public_navigation',
      errors,
      `route_status_must_remain_internal_inspection:${route.surface}`,
    );
    pushIf(
      route.rendererStatus !== 'render_internal_inspection_surface_only',
      errors,
      `route_renderer_status_must_remain_internal_only:${route.surface}`,
    );
    pushIf(
      route.publicUseStatus !== 'not_public_approved' ||
        route.publicationStatus !== 'not_published',
      errors,
      `route_must_not_be_public_approved_or_published:${route.surface}`,
    );
    if (sourcePage) {
      pushIf(
        route.sourcePageDataId !== sourcePage.pageDataId,
        errors,
        `route_source_page_data_id_mismatch:${route.surface}`,
      );
      pushIf(
        route.reviewRoute !== sourcePage.reviewRoute,
        errors,
        `route_review_route_must_match_page_data:${route.surface}`,
      );
    }
  }

  pushIf(
    routeMap.movementBoundary.runtime !== 'not_changed' ||
      routeMap.movementBoundary.prompt !== 'not_changed' ||
      routeMap.movementBoundary.retrieval !== 'not_changed' ||
      routeMap.movementBoundary.modelProvider !== 'not_changed' ||
      routeMap.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    routeMap.movementBoundary.publicApproval !== 'not_approved' ||
      routeMap.movementBoundary.publication !== 'not_published' ||
      routeMap.movementBoundary.publicNavigation !== 'not_added' ||
      routeMap.movementBoundary.sourceValidity !== 'not_decided' ||
      routeMap.movementBoundary.supportValidity !== 'not_decided' ||
      routeMap.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      routeMap.movementBoundary.runtimeApproved !== 'not_approved' ||
      routeMap.movementBoundary.publicApproved !== 'not_approved' ||
      routeMap.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      routeMap.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'route_map_must_not_move_public_navigation_approval_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SITE_CANDIDATE_PAGE_ROUTE_MAP_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
