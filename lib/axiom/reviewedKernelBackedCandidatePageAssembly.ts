import {
  buildAxiomReviewedKernelBackedPublicContentSlotBundle,
  validateAxiomReviewedKernelBackedPublicContentSlotBundle,
  type AxiomReviewedKernelBackedPublicContentSlot,
  type AxiomReviewedKernelBackedPublicContentSlotBundle,
} from './reviewedKernelBackedPublicContentSlots';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  type AxiomKernelCorpusHumanReviewMovementBoundary,
} from './kernelCorpusHumanReviewPacket';

export const AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY =
  'axiom_reviewed_kernel_backed_candidate_page_assembly_is_internal_page_data_from_reviewed_slots_not_public_navigation_public_approval_or_publication' as const;

export const AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_grounding',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type PageDefinition = {
  surface: AxiomNextNblSiteSurface;
  pageTitleJa: string;
  routeIntent: string;
};

export type AxiomReviewedKernelBackedCandidatePageSection = {
  sectionId: string;
  sourceSlotId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  headingJa: string;
  bodyDraftJa: string | null;
  internalBasisJa: string;
  sourceReviewUnitIds: string[];
  sourceKernelRowIds: string[];
  sourceScenarioIds: string[];
  sectionStatus:
    | 'review_required_public_draft_from_reviewed_kernel_slot'
    | 'hidden_or_review_routed_no_public_body';
  reviewRoute:
    | 'public_copy_review_before_public_approval'
    | 'kernel_or_surface_review_before_public_body';
  mustNotClaim: AxiomReviewedKernelBackedPublicContentSlot['mustNotClaim'];
};

export type AxiomReviewedKernelBackedCandidatePage = {
  pageId: string;
  surface: AxiomNextNblSiteSurface;
  pageTitleJa: string;
  routeIntent: string;
  routeStatus: 'route_intent_only_actual_public_navigation_not_created';
  navigationRoleJa: string;
  sectionCount: number;
  sections: AxiomReviewedKernelBackedCandidatePageSection[];
  sourceSlotIds: string[];
  sourceReviewUnitIds: string[];
  sourceKernelRowIds: string[];
  sourceScenarioIds: string[];
  sourceFamilyLabelsJa: string[];
  pageStatus: 'internal_candidate_page_data_from_reviewed_kernel_slots';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomReviewedKernelBackedCandidatePageAssembly = {
  assemblyId: string;
  objectType: 'axiom_reviewed_kernel_backed_candidate_page_assembly';
  contractVersion: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_VERSION;
  lane: 'Falcon Lab';
  status: 'reviewed_kernel_backed_candidate_pages_ready_internal';
  boundary: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY;
  strengthensCore: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_CORE_PROGRESS_CLASSES;
  sourceSlotBundleId: string;
  sourceSlotBundleStatus: AxiomReviewedKernelBackedPublicContentSlotBundle['status'];
  pageCount: 9;
  sectionCount: number;
  sourceSlotCount: number;
  sourceKernelRowCount: 15;
  sourceReviewUnitCount: 18;
  pages: AxiomReviewedKernelBackedCandidatePage[];
  coverage: {
    surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
    representedSlotIds: string[];
    representedKernelRowIds: string[];
    representedReviewUnitIds: string[];
  };
  movementBoundary: AxiomKernelCorpusHumanReviewMovementBoundary;
  notNow: string[];
};

export type AxiomReviewedKernelBackedCandidatePageAssemblyValidation = {
  valid: boolean;
  validationStatus:
    | 'reviewed_kernel_backed_candidate_page_assembly_valid'
    | 'reviewed_kernel_backed_candidate_page_assembly_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY;
  strengthensCore: typeof AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_CORE_PROGRESS_CLASSES;
};

const PAGE_DEFINITIONS: PageDefinition[] = [
  { surface: 'reader_facing_top_home', pageTitleJa: 'Next NBL Home', routeIntent: 'future_home' },
  {
    surface: 'scene_entry_use_cases',
    pageTitleJa: 'Scene Entry and Use Cases',
    routeIntent: 'future_scene_entry_use_cases',
  },
  {
    surface: 'consultation_case_reading_collection',
    pageTitleJa: 'Consultation Case Readings',
    routeIntent: 'future_case_readings',
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    pageTitleJa: 'Kernel-derived Work-design Views Guide',
    routeIntent: 'future_kernel_derived_work_design_views_guide',
  },
  {
    surface: 'article_social_question_library',
    pageTitleJa: 'Article and Social Question Library',
    routeIntent: 'future_article_social_question_library',
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    pageTitleJa: 'Cognitive Support Toolkit Studio',
    routeIntent: 'future_toolkit_studio',
  },
  {
    surface: 'work_condition_window',
    pageTitleJa: 'Work-condition Window',
    routeIntent: 'future_work_condition_window',
  },
  {
    surface: 'theory_method_trust_page',
    pageTitleJa: 'Theory, Method, Trust',
    routeIntent: 'future_theory_method_trust',
  },
  {
    surface: 'about_operating_boundary_page',
    pageTitleJa: 'About and Operating Boundary',
    routeIntent: 'future_about_boundary',
  },
];

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) {
    errors.push(error);
  }
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pageDefinitionFor(surface: AxiomNextNblSiteSurface): PageDefinition {
  const definition = PAGE_DEFINITIONS.find((candidate) => candidate.surface === surface);
  if (!definition) {
    throw new Error(`reviewed_kernel_backed_candidate_page_definition_missing:${surface}`);
  }
  return definition;
}

function sectionHeading(slot: AxiomReviewedKernelBackedPublicContentSlot) {
  if (slot.operation === 'hide') {
    return `${slot.publicSlotLabelJa}（非表示）`;
  }
  if (slot.operation === 'route_to_review') {
    return `${slot.publicSlotLabelJa}（reviewへ戻す）`;
  }

  return slot.publicSlotLabelJa;
}

function buildSection(
  slot: AxiomReviewedKernelBackedPublicContentSlot,
): AxiomReviewedKernelBackedCandidatePageSection {
  const hasPublicBody = slot.publicDraftJa !== null;

  return {
    sectionId: `section:${slot.slotId}`,
    sourceSlotId: slot.slotId,
    field: slot.field,
    operation: slot.operation,
    headingJa: sectionHeading(slot),
    bodyDraftJa: slot.publicDraftJa,
    internalBasisJa: slot.internalBasisJa,
    sourceReviewUnitIds: [...slot.sourceReviewUnitIds],
    sourceKernelRowIds: [...slot.sourceKernelRowIds],
    sourceScenarioIds: [...slot.sourceScenarioIds],
    sectionStatus: hasPublicBody
      ? 'review_required_public_draft_from_reviewed_kernel_slot'
      : 'hidden_or_review_routed_no_public_body',
    reviewRoute: hasPublicBody
      ? 'public_copy_review_before_public_approval'
      : 'kernel_or_surface_review_before_public_body',
    mustNotClaim: slot.mustNotClaim,
  };
}

function buildPage(
  definition: PageDefinition,
  slotBundle: AxiomReviewedKernelBackedPublicContentSlotBundle,
): AxiomReviewedKernelBackedCandidatePage {
  const sourceSurface = slotBundle.surfaces.find((surface) => surface.surface === definition.surface);
  const sections = (sourceSurface?.slots ?? []).map(buildSection);

  return {
    pageId: `reviewed_kernel_candidate_page:${definition.surface}`,
    surface: definition.surface,
    pageTitleJa: definition.pageTitleJa,
    routeIntent: definition.routeIntent,
    routeStatus: 'route_intent_only_actual_public_navigation_not_created',
    navigationRoleJa: sourceSurface?.navigationRoleJa ?? 'missing source surface',
    sectionCount: sections.length,
    sections,
    sourceSlotIds: sections.map((section) => section.sourceSlotId),
    sourceReviewUnitIds: unique(sections.flatMap((section) => section.sourceReviewUnitIds)),
    sourceKernelRowIds: unique(sections.flatMap((section) => section.sourceKernelRowIds)),
    sourceScenarioIds: unique(sections.flatMap((section) => section.sourceScenarioIds)),
    sourceFamilyLabelsJa: sourceSurface?.sourceFamilyLabelsJa ?? [],
    pageStatus: 'internal_candidate_page_data_from_reviewed_kernel_slots',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

export function buildAxiomReviewedKernelBackedCandidatePageAssembly(
  slotBundle: AxiomReviewedKernelBackedPublicContentSlotBundle =
    buildAxiomReviewedKernelBackedPublicContentSlotBundle(),
): AxiomReviewedKernelBackedCandidatePageAssembly {
  const pages = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
    buildPage(pageDefinitionFor(surface), slotBundle),
  );
  const representedSlotIds = unique(pages.flatMap((page) => page.sourceSlotIds));
  const representedKernelRowIds = unique(pages.flatMap((page) => page.sourceKernelRowIds));
  const representedReviewUnitIds = unique(pages.flatMap((page) => page.sourceReviewUnitIds));

  return {
    assemblyId: `axiom_reviewed_kernel_backed_candidate_page_assembly_from_${slotBundle.bundleId}`,
    objectType: 'axiom_reviewed_kernel_backed_candidate_page_assembly',
    contractVersion: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_VERSION,
    lane: 'Falcon Lab',
    status: 'reviewed_kernel_backed_candidate_pages_ready_internal',
    boundary: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY,
    strengthensCore: [...AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_CORE_PROGRESS_CLASSES],
    sourceSlotBundleId: slotBundle.bundleId,
    sourceSlotBundleStatus: slotBundle.status,
    pageCount: 9,
    sectionCount: pages.reduce((sum, page) => sum + page.sectionCount, 0),
    sourceSlotCount: slotBundle.slotCount,
    sourceKernelRowCount: 15,
    sourceReviewUnitCount: 18,
    pages,
    coverage: {
      surfacesCovered: [...AXIOM_NEXT_NBL_SITE_SURFACES],
      representedSlotIds,
      representedKernelRowIds,
      representedReviewUnitIds,
    },
    movementBoundary: { ...slotBundle.movementBoundary },
    notNow: [
      'no_actual_public_navigation_from_route_intent',
      'no_public_approval_or_publication_execution_from_page_assembly',
      'no_final_source_support_validity_claim',
      'no_candidate_pattern_promotion',
      'no_individual_case_final_judgment',
      'no_raw_sensitive_source_text_or_field_values_export',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
    ],
  };
}

export function validateAxiomReviewedKernelBackedCandidatePageAssembly(
  assembly: AxiomReviewedKernelBackedCandidatePageAssembly,
  slotBundle: AxiomReviewedKernelBackedPublicContentSlotBundle =
    buildAxiomReviewedKernelBackedPublicContentSlotBundle(),
): AxiomReviewedKernelBackedCandidatePageAssemblyValidation {
  const errors: string[] = [];
  const slotBundleValidation = validateAxiomReviewedKernelBackedPublicContentSlotBundle(slotBundle);
  const expectedSurfaceOrder = AXIOM_NEXT_NBL_SITE_SURFACES.join('|');
  const actualSurfaceOrder = assembly.pages.map((page) => page.surface).join('|');
  const sourceSlotIds = new Set(slotBundle.surfaces.flatMap((surface) => surface.slots.map((slot) => slot.slotId)));
  const representedSlotIds = new Set(assembly.coverage.representedSlotIds);
  const allSections = assembly.pages.flatMap((page) => page.sections);

  pushIf(!slotBundleValidation.valid, errors, 'source_reviewed_slot_bundle_must_be_valid');
  pushIf(
    assembly.objectType !== 'axiom_reviewed_kernel_backed_candidate_page_assembly',
    errors,
    'object_type_must_match_reviewed_kernel_backed_candidate_page_assembly',
  );
  pushIf(
    assembly.contractVersion !== AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_VERSION,
    errors,
    'contract_version_must_match_reviewed_kernel_backed_candidate_page_assembly_v0_2026_06_08',
  );
  pushIf(assembly.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    assembly.status !== 'reviewed_kernel_backed_candidate_pages_ready_internal',
    errors,
    'status_must_be_reviewed_kernel_backed_candidate_pages_ready_internal',
  );
  pushIf(
    assembly.boundary !== AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY,
    errors,
    'boundary_must_remain_internal_page_data_not_public_navigation_or_publication',
  );
  pushIf(assembly.sourceSlotBundleId !== slotBundle.bundleId, errors, 'source_slot_bundle_id_mismatch');
  pushIf(
    assembly.sourceSlotBundleStatus !== slotBundle.status,
    errors,
    'source_slot_bundle_status_mismatch',
  );
  pushIf(
    assembly.pageCount !== 9 ||
      assembly.pages.length !== 9 ||
      actualSurfaceOrder !== expectedSurfaceOrder,
    errors,
    'assembly_must_cover_nine_surfaces_in_fixed_order',
  );
  pushIf(
    assembly.sectionCount !== allSections.length ||
      assembly.sectionCount !== slotBundle.slotCount ||
      assembly.sourceSlotCount !== slotBundle.slotCount,
    errors,
    'assembly_sections_must_represent_every_source_slot_once',
  );
  pushIf(
    assembly.coverage.representedSlotIds.length !== slotBundle.slotCount ||
      Array.from(sourceSlotIds).some((slotId) => !representedSlotIds.has(slotId)),
    errors,
    'coverage_must_represent_every_source_slot',
  );
  pushIf(
    assembly.coverage.representedKernelRowIds.length !== 15 ||
      assembly.sourceKernelRowCount !== 15,
    errors,
    'assembly_must_represent_all_15_kernel_rows',
  );
  pushIf(
    assembly.sourceReviewUnitCount !== 18 ||
      assembly.coverage.representedReviewUnitIds.length === 0,
    errors,
    'assembly_must_trace_to_founder_accepted_review_units',
  );

  for (const page of assembly.pages) {
    pushIf(page.sectionCount !== page.sections.length, errors, `page_section_count_mismatch:${page.pageId}`);
    pushIf(
      page.routeStatus !== 'route_intent_only_actual_public_navigation_not_created',
      errors,
      `page_must_not_create_actual_public_navigation:${page.pageId}`,
    );
    pushIf(
      page.pageStatus !== 'internal_candidate_page_data_from_reviewed_kernel_slots' ||
        page.publicUseStatus !== 'not_public_approved' ||
        page.publicationStatus !== 'not_published',
      errors,
      `page_must_remain_internal_not_public_approved_or_published:${page.pageId}`,
    );
    pushIf(page.sourceSlotIds.length !== page.sectionCount, errors, `page_must_trace_each_section_to_slot:${page.pageId}`);
    pushIf(page.sourceKernelRowIds.length === 0, errors, `page_missing_kernel_row_trace:${page.pageId}`);
    for (const section of page.sections) {
      pushIf(!sourceSlotIds.has(section.sourceSlotId), errors, `section_source_slot_missing:${section.sectionId}`);
      pushIf(section.sourceKernelRowIds.length === 0, errors, `section_missing_kernel_row_trace:${section.sectionId}`);
      pushIf(
        section.internalBasisJa.trim().length === 0,
        errors,
        `section_internal_basis_required:${section.sectionId}`,
      );
      pushIf(
        (section.operation === 'hide' || section.operation === 'route_to_review') &&
          section.bodyDraftJa !== null,
        errors,
        `hidden_or_review_routed_section_must_not_have_public_body:${section.sectionId}`,
      );
      pushIf(
        (section.operation === 'display' || section.operation === 'translate') &&
          (section.bodyDraftJa === null || section.bodyDraftJa.trim().length === 0),
        errors,
        `display_or_translate_section_must_have_review_required_body:${section.sectionId}`,
      );
      pushIf(
        section.mustNotClaim.join('|') !==
          slotBundle.publicInterfaceBridge.doNotExposeAsPublicTruth.join('|'),
        errors,
        `section_must_carry_public_truth_exclusions:${section.sectionId}`,
      );
    }
  }

  pushIf(
    assembly.movementBoundary.runtime !== 'not_changed' ||
      assembly.movementBoundary.prompt !== 'not_changed' ||
      assembly.movementBoundary.retrieval !== 'not_changed' ||
      assembly.movementBoundary.modelProvider !== 'not_changed' ||
      assembly.movementBoundary.dbSchema !== 'not_changed' ||
      assembly.movementBoundary.sourceValidity !== 'not_decided' ||
      assembly.movementBoundary.supportValidity !== 'not_decided' ||
      assembly.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      assembly.movementBoundary.publicApproved !== 'not_approved' ||
      assembly.movementBoundary.publicRelease !== 'not_approved' ||
      assembly.movementBoundary.publication !== 'not_published' ||
      assembly.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      assembly.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'movement_boundary_must_not_move_navigation_finality_publication_runtime_promotion_or_learning',
  );
  pushIf(
    !assembly.notNow.includes('no_actual_public_navigation_from_route_intent') ||
      !assembly.notNow.includes('no_public_approval_or_publication_execution_from_page_assembly') ||
      !assembly.notNow.includes('no_final_source_support_validity_claim') ||
      !assembly.notNow.includes('no_candidate_pattern_promotion') ||
      !assembly.notNow.includes('no_individual_case_final_judgment') ||
      !assembly.notNow.includes('no_raw_sensitive_source_text_or_field_values_export') ||
      !assembly.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !assembly.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_navigation_finality_publication_runtime_learning_and_sensitive_source_export',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'reviewed_kernel_backed_candidate_page_assembly_valid'
        : 'reviewed_kernel_backed_candidate_page_assembly_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY,
    strengthensCore: [...AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_CORE_PROGRESS_CLASSES],
  };
}
