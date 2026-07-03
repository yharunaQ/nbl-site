import {
  type AxiomStableSurfaceCandidatePageSlotData,
  type AxiomStableSurfaceCandidateSlot,
  buildAxiomSitePreviewReviewMatrix,
  type AxiomSitePreviewReviewMatrix,
  validateAxiomSitePreviewReviewMatrix,
} from './sitePreviewReviewMatrix';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';
import { AXIOM_L3_EVAL_SCENARIO_IDS } from './interactionHypothesisKernelScenarioFixtures';

export const AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY =
  'axiom_site_candidate_page_data_is_internal_slot_assembly_not_public_page_or_publication' as const;

export type AxiomCandidatePageSectionPolicy =
  | 'draftable_requires_review_before_public_use'
  | 'internal_only_hidden_or_review_routed';

export type AxiomCandidatePageSection = {
  sectionId: string;
  stableSlotId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  sectionPolicy: AxiomCandidatePageSectionPolicy;
  reviewRequiredBeforePublication: true;
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  scenarioCoverageCount: number;
  representativeInternalDrafts: string[];
  representativePublicDrafts: string[];
};

export type AxiomCandidatePageData = {
  pageDataId: string;
  objectType: 'axiom_candidate_page_data';
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_display';
  status: 'internal_candidate_page_data_not_public_page';
  boundary: typeof AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY;
  sourceMatrixId: string;
  surface: AxiomNextNblSiteSurface;
  navigationRole: string;
  scenarioCoverageCount: number;
  stableSlotCount: number;
  sectionCount: number;
  fieldsCovered: AxiomKernelFieldId[];
  operationsCovered: AxiomSurfaceSlotOperation[];
  hiddenFields: AxiomKernelFieldId[];
  reviewRoutedFields: AxiomKernelFieldId[];
  sections: AxiomCandidatePageSection[];
  reviewRoute: 'surface_review_unit_required_before_public_page_build';
};

export type AxiomCandidatePageDataBundle = {
  bundleId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_page_data_bundle_not_public_page_implementation';
  boundary: typeof AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY;
  sourceMatrixId: string;
  pageCount: number;
  pages: AxiomCandidatePageData[];
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    sourceValidity: 'not_decided';
    supportValidity: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    knowledgePromotion: 'not_promoted';
    learningUpdate: 'not_updated';
  };
};

export type AxiomCandidatePageDataBundleValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function sectionPolicyForSlot(
  slot: AxiomStableSurfaceCandidateSlot,
): AxiomCandidatePageSectionPolicy {
  if (slot.operation === 'hide' || slot.operation === 'route_to_review') {
    return 'internal_only_hidden_or_review_routed';
  }

  return 'draftable_requires_review_before_public_use';
}

function buildCandidatePageSection(
  slot: AxiomStableSurfaceCandidateSlot,
): AxiomCandidatePageSection {
  return {
    sectionId: `candidate_section_${slot.stableSlotId}`,
    stableSlotId: slot.stableSlotId,
    field: slot.field,
    operation: slot.operation,
    sectionPolicy: sectionPolicyForSlot(slot),
    reviewRequiredBeforePublication: true,
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    scenarioCoverageCount: slot.scenarioCoverageCount,
    representativeInternalDrafts: slot.representativeInternalDrafts,
    representativePublicDrafts: slot.representativePublicDrafts,
  };
}

function buildCandidatePageData(
  matrix: AxiomSitePreviewReviewMatrix,
  surfaceSlotData: AxiomStableSurfaceCandidatePageSlotData,
): AxiomCandidatePageData {
  const sections = surfaceSlotData.candidateSlots.map((slot) => buildCandidatePageSection(slot));

  return {
    pageDataId: `axiom_candidate_page_data_${surfaceSlotData.surface}_v0_2026_06_07`,
    objectType: 'axiom_candidate_page_data',
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_display',
    status: 'internal_candidate_page_data_not_public_page',
    boundary: AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
    sourceMatrixId: matrix.matrixId,
    surface: surfaceSlotData.surface,
    navigationRole: surfaceSlotData.navigationRole,
    scenarioCoverageCount: surfaceSlotData.scenarioCoverageCount,
    stableSlotCount: surfaceSlotData.stableSlotCount,
    sectionCount: sections.length,
    fieldsCovered: surfaceSlotData.fieldsCovered,
    operationsCovered: surfaceSlotData.operationsCovered,
    hiddenFields: surfaceSlotData.hiddenFields,
    reviewRoutedFields: surfaceSlotData.reviewRoutedFields,
    sections,
    reviewRoute: 'surface_review_unit_required_before_public_page_build',
  };
}

export function buildAxiomCandidatePageDataBundle(
  matrix: AxiomSitePreviewReviewMatrix = buildAxiomSitePreviewReviewMatrix(),
): AxiomCandidatePageDataBundle {
  const pages = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
    const surfaceSlotData = matrix.stableSurfacePageSlots.find(
      (candidate) => candidate.surface === surface,
    );

    if (!surfaceSlotData) {
      throw new Error(`axiom_candidate_page_surface_missing:${surface}`);
    }

    return buildCandidatePageData(matrix, surfaceSlotData);
  });

  return {
    bundleId: `axiom_candidate_page_data_bundle_from_${matrix.matrixId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_page_data_bundle_not_public_page_implementation',
    boundary: AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
    sourceMatrixId: matrix.matrixId,
    pageCount: pages.length,
    pages,
    movementBoundary: {
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      publicApproval: 'not_approved',
      publication: 'not_published',
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

export function validateAxiomCandidatePageDataBundle(
  bundle: AxiomCandidatePageDataBundle,
  sourceMatrix: AxiomSitePreviewReviewMatrix,
): AxiomCandidatePageDataBundleValidation {
  const errors: string[] = [];
  const matrixValidation = validateAxiomSitePreviewReviewMatrix(sourceMatrix);
  const pageSurfaces = bundle.pages.map((page) => page.surface);

  pushIf(!matrixValidation.valid, errors, 'source_matrix_must_validate');
  pushIf(bundle.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    bundle.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    bundle.status !== 'internal_candidate_page_data_bundle_not_public_page_implementation',
    errors,
    'status_must_remain_internal_candidate_page_data_not_public_page_implementation',
  );
  pushIf(
    bundle.boundary !== AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
    errors,
    'boundary_must_remain_internal_slot_assembly_not_public_page',
  );
  pushIf(bundle.sourceMatrixId !== sourceMatrix.matrixId, errors, 'source_matrix_id_mismatch');
  pushIf(
    bundle.pageCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'page_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(bundle.pageCount !== bundle.pages.length, errors, 'page_count_must_match_pages_length');

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!pageSurfaces.includes(surface), errors, `candidate_page_missing:${surface}`);
  }

  for (const page of bundle.pages) {
    const sourceSurface = sourceMatrix.stableSurfacePageSlots.find(
      (surface) => surface.surface === page.surface,
    );

    pushIf(
      page.objectType !== 'axiom_candidate_page_data',
      errors,
      `page_object_type_invalid:${page.surface}`,
    );
    pushIf(page.lane !== 'Falcon Lab', errors, `page_lane_must_remain_falcon_lab:${page.surface}`);
    pushIf(
      page.coreProgressClass !== 'kernel_display',
      errors,
      `page_core_progress_must_be_kernel_display:${page.surface}`,
    );
    pushIf(
      page.status !== 'internal_candidate_page_data_not_public_page',
      errors,
      `page_status_must_remain_internal_candidate_page_data:${page.surface}`,
    );
    pushIf(
      page.boundary !== AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
      errors,
      `page_boundary_must_remain_internal_slot_assembly:${page.surface}`,
    );
    pushIf(
      page.scenarioCoverageCount !== AXIOM_L3_EVAL_SCENARIO_IDS.length,
      errors,
      `page_must_cover_all_l3_scenarios:${page.surface}`,
    );
    pushIf(!sourceSurface, errors, `source_surface_missing_for_page:${page.surface}`);
    if (sourceSurface) {
      pushIf(
        page.stableSlotCount !== sourceSurface.stableSlotCount,
        errors,
        `page_stable_slot_count_must_match_source_surface:${page.surface}`,
      );
    }
    pushIf(
      page.sectionCount !== page.sections.length,
      errors,
      `page_section_count_mismatch:${page.surface}`,
    );
    pushIf(
      page.sectionCount !== page.stableSlotCount,
      errors,
      `page_sections_must_match_stable_slots:${page.surface}`,
    );
    pushIf(
      page.reviewRoute !== 'surface_review_unit_required_before_public_page_build',
      errors,
      `page_review_route_required_before_public_page_build:${page.surface}`,
    );

    for (const section of page.sections) {
      pushIf(
        section.reviewRequiredBeforePublication !== true ||
          section.publicUseStatus !== 'not_public_approved' ||
          section.publicationStatus !== 'not_published',
        errors,
        `section_must_remain_review_required_not_public:${section.sectionId}`,
      );
      pushIf(
        section.scenarioCoverageCount !== AXIOM_L3_EVAL_SCENARIO_IDS.length,
        errors,
        `section_must_cover_all_l3_scenarios:${section.sectionId}`,
      );
      pushIf(
        section.sectionPolicy === 'internal_only_hidden_or_review_routed' &&
          section.representativePublicDrafts.length > 0,
        errors,
        `internal_only_section_must_not_have_public_drafts:${section.sectionId}`,
      );
    }
  }

  pushIf(
    bundle.movementBoundary.runtime !== 'not_changed' ||
      bundle.movementBoundary.prompt !== 'not_changed' ||
      bundle.movementBoundary.retrieval !== 'not_changed' ||
      bundle.movementBoundary.modelProvider !== 'not_changed' ||
      bundle.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    bundle.movementBoundary.publicApproval !== 'not_approved' ||
      bundle.movementBoundary.publication !== 'not_published' ||
      bundle.movementBoundary.sourceValidity !== 'not_decided' ||
      bundle.movementBoundary.supportValidity !== 'not_decided' ||
      bundle.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      bundle.movementBoundary.runtimeApproved !== 'not_approved' ||
      bundle.movementBoundary.publicApproved !== 'not_approved' ||
      bundle.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      bundle.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'candidate_page_data_must_not_move_approval_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
