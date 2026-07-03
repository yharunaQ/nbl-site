import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
  buildAxiomThemeObjectSurfaceSlotFixture,
  validateAxiomThemeObjectSurfaceSlotContract,
} from './siteSurfaceSlotContract';
import {
  buildAxiomSiteContentSlotBundle,
  type AxiomSiteContentSlotBundle,
  validateAxiomSiteContentSlotBundle,
} from './siteContentSlotBuilder';
import {
  type AxiomInteractionHypothesisKernel,
  validateAxiomInteractionHypothesisKernelContract,
} from './interactionHypothesisKernelContract';
import {
  type AxiomL3EvalScenarioId,
  buildAxiomInteractionHypothesisKernelFixtureForScenario,
} from './interactionHypothesisKernelScenarioFixtures';

export const AXIOM_SITE_PREVIEW_DATA_BOUNDARY =
  'axiom_site_preview_data_is_internal_kernel_display_not_public_site_or_publication' as const;

export type AxiomSitePreviewSurfaceData = {
  surface: AxiomNextNblSiteSurface;
  navigationRole: string;
  slotCount: number;
  operationCounts: Record<AxiomSurfaceSlotOperation, number>;
  reviewRequiredSlotCount: number;
  publicDraftCount: number;
  hiddenFields: AxiomKernelFieldId[];
  reviewRoutedFields: AxiomKernelFieldId[];
  sampleInternalDrafts: string[];
};

export type AxiomSitePreviewData = {
  previewId: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_display';
  status: 'internal_preview_not_public_release';
  boundary: typeof AXIOM_SITE_PREVIEW_DATA_BOUNDARY;
  sourceScenarioId: AxiomL3EvalScenarioId;
  sourceKernel: {
    kernelId: string;
    kernelCoreProgressClass: 'kernel_build';
    actionabilityBand: AxiomInteractionHypothesisKernel['actionabilityBand'];
    reviewUnit: AxiomInteractionHypothesisKernel['humanReviewRoute']['reviewUnit'];
    reviewUnitScale: AxiomInteractionHypothesisKernel['humanReviewRoute']['reviewUnitScale'];
    estimatedCoreReviewUnits: number;
    reviewerQuestion: string;
  };
  sourceThemeId: string;
  sourceBundleId: string;
  surfaceCount: number;
  surfaces: AxiomSitePreviewSurfaceData[];
  contentSlotBundle: AxiomSiteContentSlotBundle;
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    knowledgePromotion: 'not_promoted';
  };
};

export type AxiomSitePreviewDataValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SITE_PREVIEW_DATA_BOUNDARY;
  coreProgressClass: 'kernel_display';
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function emptyOperationCounts(): Record<AxiomSurfaceSlotOperation, number> {
  return {
    display: 0,
    translate: 0,
    hide: 0,
    route_to_review: 0,
  };
}

function buildSurfacePreviewData(
  surface: AxiomNextNblSiteSurface,
  bundle: AxiomSiteContentSlotBundle,
  navigationRole: string,
): AxiomSitePreviewSurfaceData {
  const slots = bundle.slots.filter((slot) => slot.surface === surface);
  const operationCounts = emptyOperationCounts();

  for (const slot of slots) {
    operationCounts[slot.operation] += 1;
  }

  return {
    surface,
    navigationRole,
    slotCount: slots.length,
    operationCounts,
    reviewRequiredSlotCount: slots.filter((slot) => slot.reviewRequiredBeforePublication).length,
    publicDraftCount: slots.filter((slot) => slot.publicDraft !== null).length,
    hiddenFields: slots.filter((slot) => slot.operation === 'hide').map((slot) => slot.field),
    reviewRoutedFields: slots
      .filter((slot) => slot.operation === 'route_to_review')
      .map((slot) => slot.field),
    sampleInternalDrafts: slots.slice(0, 2).map((slot) => slot.internalDraft),
  };
}

export function buildAxiomSitePreviewData(
  kernel: AxiomInteractionHypothesisKernel,
  sourceScenarioId: AxiomL3EvalScenarioId,
): AxiomSitePreviewData {
  const theme = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
  const contentSlotBundle = buildAxiomSiteContentSlotBundle(kernel, theme);
  const themeSurfaceById = new Map(theme.surfaces.map((surface) => [surface.surface, surface]));

  return {
    previewId: `axiom_site_preview_from_${kernel.kernelId}`,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_display',
    status: 'internal_preview_not_public_release',
    boundary: AXIOM_SITE_PREVIEW_DATA_BOUNDARY,
    sourceScenarioId,
    sourceKernel: {
      kernelId: kernel.kernelId,
      kernelCoreProgressClass: kernel.coreProgressClass,
      actionabilityBand: kernel.actionabilityBand,
      reviewUnit: kernel.humanReviewRoute.reviewUnit,
      reviewUnitScale: kernel.humanReviewRoute.reviewUnitScale,
      estimatedCoreReviewUnits: kernel.humanReviewRoute.estimatedCoreReviewUnits,
      reviewerQuestion: kernel.humanReviewRoute.reviewerQuestion,
    },
    sourceThemeId: theme.themeId,
    sourceBundleId: contentSlotBundle.bundleId,
    surfaceCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
    surfaces: AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
      buildSurfacePreviewData(
        surface,
        contentSlotBundle,
        themeSurfaceById.get(surface)?.navigationRole ?? '',
      ),
    ),
    contentSlotBundle,
    movementBoundary: {
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      publicApproval: 'not_approved',
      publication: 'not_published',
      knowledgePromotion: 'not_promoted',
    },
  };
}

export function buildDefaultAxiomSitePreviewData(): AxiomSitePreviewData {
  const sourceScenarioId: AxiomL3EvalScenarioId = 'l3_health_time_accommodation_lookup_trap_v0';
  const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(sourceScenarioId);

  return buildAxiomSitePreviewData(kernel, sourceScenarioId);
}

export function validateAxiomSitePreviewData(
  previewData: AxiomSitePreviewData,
): AxiomSitePreviewDataValidation {
  const errors: string[] = [];
  const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
    previewData.sourceScenarioId,
  );
  const theme = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
  const kernelValidation = validateAxiomInteractionHypothesisKernelContract(kernel);
  const themeValidation = validateAxiomThemeObjectSurfaceSlotContract(theme);
  const bundleValidation = validateAxiomSiteContentSlotBundle(previewData.contentSlotBundle, theme);
  const surfaceIds = previewData.surfaces.map((surface) => surface.surface);

  pushIf(previewData.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    previewData.coreProgressClass !== 'kernel_display',
    errors,
    'core_progress_must_be_kernel_display',
  );
  pushIf(
    previewData.status !== 'internal_preview_not_public_release',
    errors,
    'status_must_remain_internal_preview_not_public_release',
  );
  pushIf(
    previewData.boundary !== AXIOM_SITE_PREVIEW_DATA_BOUNDARY,
    errors,
    'boundary_must_remain_internal_preview_not_publication',
  );
  pushIf(!kernelValidation.valid, errors, 'source_kernel_contract_must_validate');
  pushIf(!themeValidation.valid, errors, 'source_theme_contract_must_validate');
  pushIf(!bundleValidation.valid, errors, 'content_slot_bundle_must_validate');
  pushIf(
    previewData.surfaceCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'surface_count_must_match_fixed_next_nbl_site_surfaces',
  );
  pushIf(
    previewData.surfaceCount !== previewData.surfaces.length,
    errors,
    'surface_count_must_match_surface_data_length',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!surfaceIds.includes(surface), errors, `surface_missing:${surface}`);
  }

  for (const surface of previewData.surfaces) {
    pushIf(surface.slotCount === 0, errors, `surface_slot_count_required:${surface.surface}`);
    pushIf(
      surface.reviewRequiredSlotCount !== surface.slotCount,
      errors,
      `all_surface_slots_must_require_review:${surface.surface}`,
    );
    pushIf(
      surface.sampleInternalDrafts.length === 0,
      errors,
      `surface_sample_internal_draft_required:${surface.surface}`,
    );
  }

  pushIf(
    previewData.contentSlotBundle.slots.some(
      (slot) =>
        (slot.operation === 'hide' || slot.operation === 'route_to_review') &&
        slot.publicDraft !== null,
    ),
    errors,
    'hidden_or_review_routed_slots_must_not_have_public_drafts',
  );
  pushIf(
    previewData.movementBoundary.runtime !== 'not_changed' ||
      previewData.movementBoundary.prompt !== 'not_changed' ||
      previewData.movementBoundary.retrieval !== 'not_changed' ||
      previewData.movementBoundary.modelProvider !== 'not_changed' ||
      previewData.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    previewData.movementBoundary.publicApproval !== 'not_approved' ||
      previewData.movementBoundary.publication !== 'not_published' ||
      previewData.movementBoundary.knowledgePromotion !== 'not_promoted',
    errors,
    'public_approval_publication_or_promotion_must_not_move',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SITE_PREVIEW_DATA_BOUNDARY,
    coreProgressClass: 'kernel_display',
  };
}
