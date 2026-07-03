import {
  AXIOM_L3_EVAL_SCENARIO_IDS,
  type AxiomL3EvalScenarioId,
  buildAxiomInteractionHypothesisKernelFixtureForScenario,
} from './interactionHypothesisKernelScenarioFixtures';
import {
  type AxiomSitePreviewData,
  buildAxiomSitePreviewData,
  validateAxiomSitePreviewData,
} from './sitePreviewData';
import {
  type AxiomHumanReviewPacket,
  buildAxiomHumanReviewPacket,
  validateAxiomHumanReviewPacket,
} from './humanReviewLoopContract';
import {
  AXIOM_KERNEL_FIELD_IDS,
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';
import type { AxiomActionabilityBand } from './interactionHypothesisKernelContract';

export const AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY =
  'axiom_site_preview_review_matrix_is_multi_scenario_internal_slot_stabilization_not_publication' as const;

export type AxiomScenarioPreviewReviewMatrixEntry = {
  scenarioId: AxiomL3EvalScenarioId;
  kernelId: string;
  previewId: string;
  reviewPacketId: string;
  actionabilityBand: AxiomActionabilityBand;
  previewValidationStatus: 'contract_valid';
  reviewValidationStatus: 'contract_valid';
  surfaceCount: number;
  contentSlotCount: number;
  reviewUnitCount: number;
};

export type AxiomStableSurfaceCandidateSlot = {
  stableSlotId: string;
  surface: AxiomNextNblSiteSurface;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  scenarioCoverageCount: number;
  scenarioIds: AxiomL3EvalScenarioId[];
  reviewRequiredBeforePublication: true;
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  representativeInternalDrafts: string[];
  representativePublicDrafts: string[];
};

export type AxiomStableSurfaceCandidatePageSlotData = {
  surface: AxiomNextNblSiteSurface;
  navigationRole: string;
  scenarioCoverageCount: number;
  stableSlotCount: number;
  fieldsCovered: AxiomKernelFieldId[];
  operationsCovered: AxiomSurfaceSlotOperation[];
  hiddenFields: AxiomKernelFieldId[];
  reviewRoutedFields: AxiomKernelFieldId[];
  candidateSlots: AxiomStableSurfaceCandidateSlot[];
};

export type AxiomSitePreviewReviewMatrix = {
  matrixId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'multi_scenario_internal_preview_review_matrix_not_public_release';
  boundary: typeof AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY;
  scenarioCount: number;
  scenarios: AxiomScenarioPreviewReviewMatrixEntry[];
  surfaceCount: number;
  stableSurfacePageSlots: AxiomStableSurfaceCandidatePageSlotData[];
  sourcePreviews: AxiomSitePreviewData[];
  sourceReviewPackets: AxiomHumanReviewPacket[];
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

export type AxiomSitePreviewReviewMatrixValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function uniqueFields(fields: AxiomKernelFieldId[]): AxiomKernelFieldId[] {
  return AXIOM_KERNEL_FIELD_IDS.filter((field) => fields.includes(field));
}

function uniqueOperations(operations: AxiomSurfaceSlotOperation[]): AxiomSurfaceSlotOperation[] {
  const order: AxiomSurfaceSlotOperation[] = ['display', 'translate', 'hide', 'route_to_review'];

  return order.filter((operation) => operations.includes(operation));
}

function slotKey(
  surface: AxiomNextNblSiteSurface,
  field: AxiomKernelFieldId,
  operation: AxiomSurfaceSlotOperation,
): string {
  return `${surface}:${field}:${operation}`;
}

function buildStableSurfaceCandidatePageSlotData(
  surface: AxiomNextNblSiteSurface,
  previews: AxiomSitePreviewData[],
): AxiomStableSurfaceCandidatePageSlotData {
  const surfacePreviews = previews
    .map((preview) => preview.surfaces.find((candidate) => candidate.surface === surface))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));
  const slots = previews.flatMap((preview) =>
    preview.contentSlotBundle.slots
      .filter((slot) => slot.surface === surface)
      .map((slot) => ({
        scenarioId: preview.sourceScenarioId,
        slot,
      })),
  );
  const slotIds = Array.from(
    new Set(slots.map(({ slot }) => slotKey(surface, slot.field, slot.operation))),
  );
  const candidateSlots = slotIds.map((stableSlotId) => {
    const matchingSlots = slots.filter(
      ({ slot }) => slotKey(surface, slot.field, slot.operation) === stableSlotId,
    );
    const firstSlot = matchingSlots[0].slot;

    return {
      stableSlotId,
      surface,
      field: firstSlot.field,
      operation: firstSlot.operation,
      scenarioCoverageCount: matchingSlots.length,
      scenarioIds: matchingSlots.map(({ scenarioId }) => scenarioId),
      reviewRequiredBeforePublication: true as const,
      publicUseStatus: 'not_public_approved' as const,
      publicationStatus: 'not_published' as const,
      representativeInternalDrafts: matchingSlots.slice(0, 2).map(({ slot }) => slot.internalDraft),
      representativePublicDrafts: matchingSlots
        .map(({ slot }) => slot.publicDraft)
        .filter((draft): draft is string => Boolean(draft))
        .slice(0, 2),
    };
  });

  return {
    surface,
    navigationRole: surfacePreviews[0]?.navigationRole ?? '',
    scenarioCoverageCount: surfacePreviews.length,
    stableSlotCount: candidateSlots.length,
    fieldsCovered: uniqueFields(candidateSlots.map((slot) => slot.field)),
    operationsCovered: uniqueOperations(candidateSlots.map((slot) => slot.operation)),
    hiddenFields: uniqueFields(
      candidateSlots.filter((slot) => slot.operation === 'hide').map((slot) => slot.field),
    ),
    reviewRoutedFields: uniqueFields(
      candidateSlots
        .filter((slot) => slot.operation === 'route_to_review')
        .map((slot) => slot.field),
    ),
    candidateSlots,
  };
}

export function buildAxiomSitePreviewReviewMatrix(): AxiomSitePreviewReviewMatrix {
  const previews = AXIOM_L3_EVAL_SCENARIO_IDS.map((scenarioId) => {
    const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(scenarioId);

    return buildAxiomSitePreviewData(kernel, scenarioId);
  });
  const reviewPackets = previews.map((preview) => buildAxiomHumanReviewPacket(preview));
  const scenarios = previews.map((preview, index) => {
    const previewValidation = validateAxiomSitePreviewData(preview);
    const reviewValidation = validateAxiomHumanReviewPacket(reviewPackets[index], preview);

    if (!previewValidation.valid || !reviewValidation.valid) {
      throw new Error(
        `invalid_axiom_preview_review_matrix_entry:${preview.sourceScenarioId}:${[
          ...previewValidation.errors,
          ...reviewValidation.errors,
        ].join(',')}`,
      );
    }

    return {
      scenarioId: preview.sourceScenarioId,
      kernelId: preview.sourceKernel.kernelId,
      previewId: preview.previewId,
      reviewPacketId: reviewPackets[index].packetId,
      actionabilityBand: preview.sourceKernel.actionabilityBand,
      previewValidationStatus: 'contract_valid' as const,
      reviewValidationStatus: 'contract_valid' as const,
      surfaceCount: preview.surfaceCount,
      contentSlotCount: preview.contentSlotBundle.slotCount,
      reviewUnitCount: reviewPackets[index].unitCount,
    };
  });

  return {
    matrixId: 'axiom_site_preview_review_matrix_all_l3_v0_2026_06_07',
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status: 'multi_scenario_internal_preview_review_matrix_not_public_release',
    boundary: AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY,
    scenarioCount: AXIOM_L3_EVAL_SCENARIO_IDS.length,
    scenarios,
    surfaceCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
    stableSurfacePageSlots: AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
      buildStableSurfaceCandidatePageSlotData(surface, previews),
    ),
    sourcePreviews: previews,
    sourceReviewPackets: reviewPackets,
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

export function validateAxiomSitePreviewReviewMatrix(
  matrix: AxiomSitePreviewReviewMatrix,
): AxiomSitePreviewReviewMatrixValidation {
  const errors: string[] = [];
  const scenarioIds = matrix.scenarios.map((scenario) => scenario.scenarioId);
  const previewScenarioIds = matrix.sourcePreviews.map((preview) => preview.sourceScenarioId);
  const reviewPacketPreviewIds = matrix.sourceReviewPackets.map((packet) => packet.sourcePreviewId);
  const surfaceIds = matrix.stableSurfacePageSlots.map((surface) => surface.surface);

  pushIf(matrix.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    matrix.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    matrix.status !== 'multi_scenario_internal_preview_review_matrix_not_public_release',
    errors,
    'status_must_remain_internal_preview_review_matrix_not_public_release',
  );
  pushIf(
    matrix.boundary !== AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY,
    errors,
    'boundary_must_remain_multi_scenario_internal_slot_stabilization',
  );
  pushIf(
    matrix.scenarioCount !== AXIOM_L3_EVAL_SCENARIO_IDS.length,
    errors,
    'scenario_count_must_match_all_l3_eval_scenarios',
  );
  pushIf(
    matrix.scenarioCount !== matrix.scenarios.length,
    errors,
    'scenario_count_must_match_scenarios_length',
  );
  pushIf(
    matrix.scenarioCount !== matrix.sourcePreviews.length,
    errors,
    'scenario_count_must_match_source_previews_length',
  );
  pushIf(
    matrix.scenarioCount !== matrix.sourceReviewPackets.length,
    errors,
    'scenario_count_must_match_source_review_packets_length',
  );

  for (const scenarioId of AXIOM_L3_EVAL_SCENARIO_IDS) {
    pushIf(!scenarioIds.includes(scenarioId), errors, `scenario_missing:${scenarioId}`);
    pushIf(
      !previewScenarioIds.includes(scenarioId),
      errors,
      `source_preview_missing:${scenarioId}`,
    );
  }

  for (const scenario of matrix.scenarios) {
    pushIf(
      scenario.previewValidationStatus !== 'contract_valid',
      errors,
      `scenario_preview_must_validate:${scenario.scenarioId}`,
    );
    pushIf(
      scenario.reviewValidationStatus !== 'contract_valid',
      errors,
      `scenario_review_packet_must_validate:${scenario.scenarioId}`,
    );
    pushIf(
      scenario.surfaceCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
      errors,
      `scenario_surface_count_must_match_fixed_surfaces:${scenario.scenarioId}`,
    );
    pushIf(
      scenario.reviewUnitCount > 100,
      errors,
      `scenario_review_units_must_not_exceed_100:${scenario.scenarioId}`,
    );
  }

  for (const preview of matrix.sourcePreviews) {
    const previewValidation = validateAxiomSitePreviewData(preview);

    pushIf(
      !previewValidation.valid,
      errors,
      `source_preview_must_validate:${preview.sourceScenarioId}`,
    );
    pushIf(
      !reviewPacketPreviewIds.includes(preview.previewId),
      errors,
      `source_review_packet_missing_for_preview:${preview.previewId}`,
    );
  }

  for (const reviewPacket of matrix.sourceReviewPackets) {
    const preview = matrix.sourcePreviews.find(
      (candidate) => candidate.previewId === reviewPacket.sourcePreviewId,
    );

    pushIf(!preview, errors, `source_review_packet_preview_missing:${reviewPacket.packetId}`);
    if (preview) {
      const reviewValidation = validateAxiomHumanReviewPacket(reviewPacket, preview);

      pushIf(
        !reviewValidation.valid,
        errors,
        `source_review_packet_must_validate:${reviewPacket.packetId}`,
      );
    }
  }

  pushIf(
    matrix.surfaceCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'surface_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(
    matrix.surfaceCount !== matrix.stableSurfacePageSlots.length,
    errors,
    'surface_count_must_match_stable_surface_page_slots_length',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!surfaceIds.includes(surface), errors, `stable_surface_missing:${surface}`);
  }

  for (const surface of matrix.stableSurfacePageSlots) {
    pushIf(
      surface.scenarioCoverageCount !== AXIOM_L3_EVAL_SCENARIO_IDS.length,
      errors,
      `surface_must_cover_all_scenarios:${surface.surface}`,
    );
    pushIf(
      surface.stableSlotCount !== surface.candidateSlots.length,
      errors,
      `surface_stable_slot_count_must_match_candidate_slots:${surface.surface}`,
    );
    pushIf(
      surface.stableSlotCount === 0,
      errors,
      `surface_stable_slots_required:${surface.surface}`,
    );

    for (const slot of surface.candidateSlots) {
      pushIf(
        slot.scenarioCoverageCount !== AXIOM_L3_EVAL_SCENARIO_IDS.length,
        errors,
        `stable_slot_must_cover_all_scenarios:${slot.stableSlotId}`,
      );
      pushIf(
        slot.reviewRequiredBeforePublication !== true ||
          slot.publicUseStatus !== 'not_public_approved' ||
          slot.publicationStatus !== 'not_published',
        errors,
        `stable_slot_must_remain_review_required_not_public:${slot.stableSlotId}`,
      );
      pushIf(
        (slot.operation === 'hide' || slot.operation === 'route_to_review') &&
          slot.representativePublicDrafts.length > 0,
        errors,
        `hidden_or_review_slot_must_not_have_public_drafts:${slot.stableSlotId}`,
      );
    }
  }

  pushIf(
    matrix.movementBoundary.runtime !== 'not_changed' ||
      matrix.movementBoundary.prompt !== 'not_changed' ||
      matrix.movementBoundary.retrieval !== 'not_changed' ||
      matrix.movementBoundary.modelProvider !== 'not_changed' ||
      matrix.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    matrix.movementBoundary.publicApproval !== 'not_approved' ||
      matrix.movementBoundary.publication !== 'not_published' ||
      matrix.movementBoundary.sourceValidity !== 'not_decided' ||
      matrix.movementBoundary.supportValidity !== 'not_decided' ||
      matrix.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      matrix.movementBoundary.runtimeApproved !== 'not_approved' ||
      matrix.movementBoundary.publicApproved !== 'not_approved' ||
      matrix.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      matrix.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'matrix_must_not_move_approval_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
