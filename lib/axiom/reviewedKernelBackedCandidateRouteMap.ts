import {
  buildAxiomReviewedKernelBackedCandidatePageAssembly,
  validateAxiomReviewedKernelBackedCandidatePageAssembly,
  type AxiomReviewedKernelBackedCandidatePage,
  type AxiomReviewedKernelBackedCandidatePageAssembly,
} from './reviewedKernelBackedCandidatePageAssembly';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  type AxiomKernelCorpusHumanReviewMovementBoundary,
} from './kernelCorpusHumanReviewPacket';

export const AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY =
  'axiom_reviewed_kernel_backed_candidate_route_map_is_internal_candidate_navigation_from_reviewed_pages_not_actual_public_navigation_public_approval_or_publication' as const;

export const AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export const AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE =
  '/internal/axiom-next-nbl-reviewed-candidate' as const;

type CandidateRouteDefinition = {
  surface: AxiomNextNblSiteSurface;
  slug: string;
  navLabelJa: string;
  visualTone: string;
};

export type AxiomReviewedKernelBackedCandidateRoute = {
  routeId: string;
  surface: AxiomNextNblSiteSurface;
  pageId: string;
  slug: string;
  path: string;
  navLabelJa: string;
  pageTitleJa: string;
  routeStatus: 'internal_candidate_route_created_not_actual_public_navigation';
  publicNavigationStatus: 'not_public_navigation';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  sourceSectionIds: string[];
  sourceSlotIds: string[];
  sourceKernelRowIds: string[];
  sourceReviewUnitIds: string[];
  visualTone: string;
};

export type AxiomReviewedKernelBackedCandidateRouteMap = {
  routeMapId: string;
  objectType: 'axiom_reviewed_kernel_backed_candidate_route_map';
  contractVersion: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_VERSION;
  lane: 'Falcon Lab';
  status: 'reviewed_kernel_backed_internal_candidate_routes_ready';
  boundary: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY;
  strengthensCore: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_CORE_PROGRESS_CLASSES;
  sourceAssemblyId: string;
  sourceAssemblyStatus: AxiomReviewedKernelBackedCandidatePageAssembly['status'];
  routeBase: typeof AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE;
  routeCount: 9;
  surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
  routes: AxiomReviewedKernelBackedCandidateRoute[];
  movementBoundary: AxiomKernelCorpusHumanReviewMovementBoundary;
  notNow: string[];
};

export type AxiomReviewedKernelBackedCandidateRouteMapValidation = {
  valid: boolean;
  validationStatus:
    | 'reviewed_kernel_backed_candidate_route_map_valid'
    | 'reviewed_kernel_backed_candidate_route_map_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY;
  strengthensCore: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_CORE_PROGRESS_CLASSES;
};

const ROUTE_DEFINITIONS: CandidateRouteDefinition[] = [
  {
    surface: 'reader_facing_top_home',
    slug: 'home',
    navLabelJa: 'Home',
    visualTone: 'from-slate-950 via-slate-950/86 to-slate-950/34',
  },
  {
    surface: 'scene_entry_use_cases',
    slug: 'scene-entry',
    navLabelJa: 'Scenes',
    visualTone: 'from-violet-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'consultation_case_reading_collection',
    slug: 'case-readings',
    navLabelJa: 'Case Readings',
    visualTone: 'from-emerald-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    slug: 'work-design-views-guide',
    navLabelJa: 'Views Guide',
    visualTone: 'from-amber-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'article_social_question_library',
    slug: 'articles-social-questions',
    navLabelJa: 'Questions',
    visualTone: 'from-indigo-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    slug: 'toolkit-studio',
    navLabelJa: 'Toolkit',
    visualTone: 'from-rose-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'work_condition_window',
    slug: 'work-condition-window',
    navLabelJa: 'Condition Window',
    visualTone: 'from-teal-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'theory_method_trust_page',
    slug: 'theory-method-trust',
    navLabelJa: 'Method',
    visualTone: 'from-cyan-950 via-slate-950/88 to-slate-950/34',
  },
  {
    surface: 'about_operating_boundary_page',
    slug: 'about-boundary',
    navLabelJa: 'Boundary',
    visualTone: 'from-stone-950 via-slate-950/88 to-slate-950/34',
  },
];

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) {
    errors.push(error);
  }
}

function routePath(slug: string) {
  return `${AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE}/${slug}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildRoute(
  definition: CandidateRouteDefinition,
  assembly: AxiomReviewedKernelBackedCandidatePageAssembly,
): AxiomReviewedKernelBackedCandidateRoute {
  const page = assembly.pages.find((candidate) => candidate.surface === definition.surface);

  return {
    routeId: `reviewed_kernel_candidate_route:${definition.surface}`,
    surface: definition.surface,
    pageId: page?.pageId ?? `missing_page:${definition.surface}`,
    slug: definition.slug,
    path: routePath(definition.slug),
    navLabelJa: definition.navLabelJa,
    pageTitleJa: page?.pageTitleJa ?? definition.navLabelJa,
    routeStatus: 'internal_candidate_route_created_not_actual_public_navigation',
    publicNavigationStatus: 'not_public_navigation',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    sourceSectionIds: page?.sections.map((section) => section.sectionId) ?? [],
    sourceSlotIds: page?.sourceSlotIds ?? [],
    sourceKernelRowIds: page?.sourceKernelRowIds ?? [],
    sourceReviewUnitIds: page?.sourceReviewUnitIds ?? [],
    visualTone: definition.visualTone,
  };
}

export function buildAxiomReviewedKernelBackedCandidateRouteMap(
  assembly: AxiomReviewedKernelBackedCandidatePageAssembly =
    buildAxiomReviewedKernelBackedCandidatePageAssembly(),
): AxiomReviewedKernelBackedCandidateRouteMap {
  const routes = ROUTE_DEFINITIONS.map((definition) => buildRoute(definition, assembly));

  return {
    routeMapId: `axiom_reviewed_kernel_backed_candidate_route_map_from_${assembly.assemblyId}`,
    objectType: 'axiom_reviewed_kernel_backed_candidate_route_map',
    contractVersion: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_VERSION,
    lane: 'Falcon Lab',
    status: 'reviewed_kernel_backed_internal_candidate_routes_ready',
    boundary: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY,
    strengthensCore: [...AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_CORE_PROGRESS_CLASSES],
    sourceAssemblyId: assembly.assemblyId,
    sourceAssemblyStatus: assembly.status,
    routeBase: AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE,
    routeCount: 9,
    surfacesCovered: [...AXIOM_NEXT_NBL_SITE_SURFACES],
    routes,
    movementBoundary: { ...assembly.movementBoundary },
    notNow: [
      'no_actual_public_navigation_from_internal_candidate_routes',
      'no_public_approval_or_publication_execution_from_candidate_routes',
      'no_final_source_support_validity_claim',
      'no_candidate_pattern_promotion',
      'no_individual_case_final_judgment',
      'no_raw_sensitive_source_text_or_field_values_export',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
    ],
  };
}

export function getAxiomReviewedKernelBackedCandidateRouteBySlug(
  slug: string,
  routeMap: AxiomReviewedKernelBackedCandidateRouteMap =
    buildAxiomReviewedKernelBackedCandidateRouteMap(),
) {
  return routeMap.routes.find((route) => route.slug === slug);
}

export function getAxiomReviewedKernelBackedCandidatePageForSlug(
  slug: string,
  assembly: AxiomReviewedKernelBackedCandidatePageAssembly =
    buildAxiomReviewedKernelBackedCandidatePageAssembly(),
  routeMap: AxiomReviewedKernelBackedCandidateRouteMap =
    buildAxiomReviewedKernelBackedCandidateRouteMap(assembly),
): { route: AxiomReviewedKernelBackedCandidateRoute; page: AxiomReviewedKernelBackedCandidatePage } | null {
  const route = getAxiomReviewedKernelBackedCandidateRouteBySlug(slug, routeMap);
  if (!route) return null;

  const page = assembly.pages.find((candidate) => candidate.surface === route.surface);
  if (!page) return null;

  return { route, page };
}

export function validateAxiomReviewedKernelBackedCandidateRouteMap(
  routeMap: AxiomReviewedKernelBackedCandidateRouteMap,
  assembly: AxiomReviewedKernelBackedCandidatePageAssembly =
    buildAxiomReviewedKernelBackedCandidatePageAssembly(),
): AxiomReviewedKernelBackedCandidateRouteMapValidation {
  const errors: string[] = [];
  const assemblyValidation = validateAxiomReviewedKernelBackedCandidatePageAssembly(assembly);
  const expectedSurfaces = AXIOM_NEXT_NBL_SITE_SURFACES.join('|');
  const actualSurfaces = routeMap.routes.map((route) => route.surface).join('|');
  const expectedSlugs = new Set(ROUTE_DEFINITIONS.map((definition) => definition.slug));
  const actualSlugs = new Set(routeMap.routes.map((route) => route.slug));
  const pageIds = new Set(assembly.pages.map((page) => page.pageId));

  pushIf(!assemblyValidation.valid, errors, 'source_page_assembly_must_be_valid');
  pushIf(
    routeMap.objectType !== 'axiom_reviewed_kernel_backed_candidate_route_map',
    errors,
    'object_type_must_match_reviewed_kernel_backed_candidate_route_map',
  );
  pushIf(
    routeMap.contractVersion !== AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_VERSION,
    errors,
    'contract_version_must_match_reviewed_kernel_backed_candidate_route_map_v0_2026_06_08',
  );
  pushIf(routeMap.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    routeMap.status !== 'reviewed_kernel_backed_internal_candidate_routes_ready',
    errors,
    'status_must_be_reviewed_kernel_backed_internal_candidate_routes_ready',
  );
  pushIf(
    routeMap.boundary !== AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY,
    errors,
    'boundary_must_remain_internal_candidate_navigation_not_public_navigation_or_publication',
  );
  pushIf(routeMap.sourceAssemblyId !== assembly.assemblyId, errors, 'source_assembly_id_mismatch');
  pushIf(
    routeMap.sourceAssemblyStatus !== assembly.status,
    errors,
    'source_assembly_status_mismatch',
  );
  pushIf(
    routeMap.routeBase !== AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE,
    errors,
    'route_base_must_remain_internal_candidate_base',
  );
  pushIf(
    routeMap.routeCount !== 9 ||
      routeMap.routes.length !== 9 ||
      routeMap.surfacesCovered.join('|') !== expectedSurfaces ||
      actualSurfaces !== expectedSurfaces,
    errors,
    'route_map_must_cover_nine_surfaces_in_fixed_order',
  );
  pushIf(
    actualSlugs.size !== routeMap.routes.length ||
      Array.from(expectedSlugs).some((slug) => !actualSlugs.has(slug)),
    errors,
    'route_map_must_have_unique_expected_slugs',
  );

  for (const route of routeMap.routes) {
    pushIf(!pageIds.has(route.pageId), errors, `route_page_missing_from_assembly:${route.routeId}`);
    pushIf(
      !route.path.startsWith(`${AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE}/`),
      errors,
      `route_path_must_stay_internal_candidate:${route.routeId}`,
    );
    pushIf(
      route.routeStatus !== 'internal_candidate_route_created_not_actual_public_navigation' ||
        route.publicNavigationStatus !== 'not_public_navigation' ||
        route.publicUseStatus !== 'not_public_approved' ||
        route.publicationStatus !== 'not_published',
      errors,
      `route_must_not_be_public_navigation_approved_or_published:${route.routeId}`,
    );
    pushIf(route.sourceSectionIds.length === 0, errors, `route_missing_section_trace:${route.routeId}`);
    pushIf(route.sourceSlotIds.length === 0, errors, `route_missing_slot_trace:${route.routeId}`);
    pushIf(route.sourceKernelRowIds.length === 0, errors, `route_missing_kernel_row_trace:${route.routeId}`);
    pushIf(route.sourceReviewUnitIds.length === 0, errors, `route_missing_review_unit_trace:${route.routeId}`);
  }

  pushIf(
    unique(routeMap.routes.flatMap((route) => route.sourceKernelRowIds)).length !== 15,
    errors,
    'route_map_must_represent_all_15_kernel_rows',
  );
  pushIf(
    routeMap.movementBoundary.runtime !== 'not_changed' ||
      routeMap.movementBoundary.prompt !== 'not_changed' ||
      routeMap.movementBoundary.retrieval !== 'not_changed' ||
      routeMap.movementBoundary.modelProvider !== 'not_changed' ||
      routeMap.movementBoundary.dbSchema !== 'not_changed' ||
      routeMap.movementBoundary.sourceValidity !== 'not_decided' ||
      routeMap.movementBoundary.supportValidity !== 'not_decided' ||
      routeMap.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      routeMap.movementBoundary.publicApproved !== 'not_approved' ||
      routeMap.movementBoundary.publicRelease !== 'not_approved' ||
      routeMap.movementBoundary.publication !== 'not_published' ||
      routeMap.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      routeMap.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'movement_boundary_must_not_move_public_navigation_finality_publication_runtime_promotion_or_learning',
  );
  pushIf(
    !routeMap.notNow.includes('no_actual_public_navigation_from_internal_candidate_routes') ||
      !routeMap.notNow.includes('no_public_approval_or_publication_execution_from_candidate_routes') ||
      !routeMap.notNow.includes('no_final_source_support_validity_claim') ||
      !routeMap.notNow.includes('no_candidate_pattern_promotion') ||
      !routeMap.notNow.includes('no_individual_case_final_judgment') ||
      !routeMap.notNow.includes('no_raw_sensitive_source_text_or_field_values_export') ||
      !routeMap.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !routeMap.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_public_navigation_finality_publication_runtime_learning_and_sensitive_source_export',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'reviewed_kernel_backed_candidate_route_map_valid'
        : 'reviewed_kernel_backed_candidate_route_map_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_BOUNDARY,
    strengthensCore: [...AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_ROUTE_MAP_CORE_PROGRESS_CLASSES],
  };
}
