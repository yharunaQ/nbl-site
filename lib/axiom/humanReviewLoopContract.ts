import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  type AxiomHumanReviewBlock,
  type AxiomHumanReviewNonBlocking,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_KERNEL_FIELD_IDS,
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';
import {
  type AxiomSitePreviewData,
  buildDefaultAxiomSitePreviewData,
  validateAxiomSitePreviewData,
} from './sitePreviewData';

export const AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY =
  'axiom_human_review_loop_units_are_framework_level_internal_units_not_public_approval' as const;

export type AxiomHumanReviewUnitType =
  | 'kernel_contract_review'
  | 'surface_slot_review'
  | 'cross_surface_boundary_review';

export type AxiomHumanReviewUnit = {
  unitId: string;
  unitType: AxiomHumanReviewUnitType;
  unitScale: 'framework_or_surface_unit_not_instance_hypothesis';
  coreProgressClass: 'kernel_human_review_loop';
  surface?: AxiomNextNblSiteSurface;
  kernelFieldsInScope: AxiomKernelFieldId[];
  reviewQuestion: string;
  reviewBlocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  approvalEffect: 'does_not_approve_publication_runtime_source_support_or_learning';
};

export type AxiomHumanReviewPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_human_review_loop';
  status: 'framework_level_review_packet_prepared_internal_only';
  boundary: typeof AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY;
  sourcePreviewId: string;
  sourceKernelId: string;
  sourceBundleId: string;
  maxCoreReviewUnits: 100;
  unitCount: number;
  units: AxiomHumanReviewUnit[];
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

export type AxiomHumanReviewPacketValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY;
  coreProgressClass: 'kernel_human_review_loop';
};

const REQUIRED_REVIEW_BLOCKS: AxiomHumanReviewBlock[] = [
  'public_release',
  'source_validity',
  'support_validity',
  'candidate_pattern',
  'runtime_approved',
  'public_approved',
  'outcome_learning_update',
];

const REQUIRED_NON_BLOCKING: AxiomHumanReviewNonBlocking[] = [
  'provisional_hypothesis_generation',
  'counter_hypothesis_generation',
  'missing_context_question_generation',
  'actionability_band_classification',
  'non_sensitive_scenario_evaluation',
  'deterministic_kernel_logic_improvement',
  'kernel_object_display_ui',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function uniqueFields(fields: AxiomKernelFieldId[]): AxiomKernelFieldId[] {
  return AXIOM_KERNEL_FIELD_IDS.filter((field) => fields.includes(field));
}

function missingValues<T extends string>(actual: readonly T[], required: readonly T[]): T[] {
  return required.filter((value) => !actual.includes(value));
}

function buildSurfaceUnit(
  previewData: AxiomSitePreviewData,
  surface: AxiomSitePreviewData['surfaces'][number],
): AxiomHumanReviewUnit {
  const fields = uniqueFields(
    previewData.contentSlotBundle.slots
      .filter((slot) => slot.surface === surface.surface)
      .map((slot) => slot.field),
  );

  return {
    unitId: `review_surface_${surface.surface}`,
    unitType: 'surface_slot_review',
    unitScale: 'framework_or_surface_unit_not_instance_hypothesis',
    coreProgressClass: 'kernel_human_review_loop',
    surface: surface.surface,
    kernelFieldsInScope: fields,
    reviewQuestion: `Can ${surface.surface} display, translate, hide, and route these Axiom kernel fields without becoming public approval, final advice, or learning update?`,
    reviewBlocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    approvalEffect: 'does_not_approve_publication_runtime_source_support_or_learning',
  };
}

export function buildAxiomHumanReviewPacket(
  previewData: AxiomSitePreviewData,
): AxiomHumanReviewPacket {
  const kernelUnit: AxiomHumanReviewUnit = {
    unitId: 'review_kernel_contract',
    unitType: 'kernel_contract_review',
    unitScale: 'framework_or_surface_unit_not_instance_hypothesis',
    coreProgressClass: 'kernel_human_review_loop',
    kernelFieldsInScope: [...AXIOM_KERNEL_FIELD_IDS],
    reviewQuestion: previewData.sourceKernel.reviewerQuestion,
    reviewBlocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    approvalEffect: 'does_not_approve_publication_runtime_source_support_or_learning',
  };
  const surfaceUnits = previewData.surfaces.map((surface) =>
    buildSurfaceUnit(previewData, surface),
  );
  const crossSurfaceUnit: AxiomHumanReviewUnit = {
    unitId: 'review_cross_surface_boundary',
    unitType: 'cross_surface_boundary_review',
    unitScale: 'framework_or_surface_unit_not_instance_hypothesis',
    coreProgressClass: 'kernel_human_review_loop',
    kernelFieldsInScope: [...AXIOM_KERNEL_FIELD_IDS],
    reviewQuestion:
      'Across all fixed next NBL surfaces, do hidden and review-routed fields stay out of public drafts while provisional display remains useful?',
    reviewBlocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    approvalEffect: 'does_not_approve_publication_runtime_source_support_or_learning',
  };
  const units = [kernelUnit, ...surfaceUnits, crossSurfaceUnit];

  return {
    packetId: `axiom_human_review_packet_from_${previewData.previewId}`,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_human_review_loop',
    status: 'framework_level_review_packet_prepared_internal_only',
    boundary: AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY,
    sourcePreviewId: previewData.previewId,
    sourceKernelId: previewData.sourceKernel.kernelId,
    sourceBundleId: previewData.sourceBundleId,
    maxCoreReviewUnits: 100,
    unitCount: units.length,
    units,
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

export function buildDefaultAxiomHumanReviewPacket(): AxiomHumanReviewPacket {
  return buildAxiomHumanReviewPacket(buildDefaultAxiomSitePreviewData());
}

export function validateAxiomHumanReviewPacket(
  packet: AxiomHumanReviewPacket,
  sourcePreviewData: AxiomSitePreviewData,
): AxiomHumanReviewPacketValidation {
  const errors: string[] = [];
  const previewValidation = validateAxiomSitePreviewData(sourcePreviewData);
  const surfacesWithUnits = new Set(
    packet.units
      .filter((unit) => unit.unitType === 'surface_slot_review')
      .map((unit) => unit.surface),
  );

  pushIf(!previewValidation.valid, errors, 'source_preview_data_must_validate');
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClass !== 'kernel_human_review_loop',
    errors,
    'core_progress_must_be_kernel_human_review_loop',
  );
  pushIf(
    packet.status !== 'framework_level_review_packet_prepared_internal_only',
    errors,
    'status_must_remain_framework_level_review_packet_prepared_internal_only',
  );
  pushIf(
    packet.boundary !== AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY,
    errors,
    'boundary_must_remain_internal_review_loop_not_public_approval',
  );
  pushIf(packet.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_be_100');
  pushIf(packet.unitCount !== packet.units.length, errors, 'unit_count_must_match_units_length');
  pushIf(packet.unitCount > packet.maxCoreReviewUnits, errors, 'unit_count_must_not_exceed_100');
  pushIf(
    packet.sourcePreviewId !== sourcePreviewData.previewId,
    errors,
    'source_preview_id_mismatch',
  );
  pushIf(
    packet.sourceKernelId !== sourcePreviewData.sourceKernel.kernelId,
    errors,
    'source_kernel_id_mismatch',
  );
  pushIf(
    packet.sourceBundleId !== sourcePreviewData.sourceBundleId,
    errors,
    'source_bundle_id_mismatch',
  );
  pushIf(
    packet.units.filter((unit) => unit.unitType === 'kernel_contract_review').length !== 1,
    errors,
    'exactly_one_kernel_contract_review_unit_required',
  );
  pushIf(
    packet.units.filter((unit) => unit.unitType === 'cross_surface_boundary_review').length !== 1,
    errors,
    'exactly_one_cross_surface_boundary_review_unit_required',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!surfacesWithUnits.has(surface), errors, `surface_review_unit_missing:${surface}`);
  }

  for (const unit of packet.units) {
    pushIf(
      unit.unitScale !== 'framework_or_surface_unit_not_instance_hypothesis',
      errors,
      `unit_scale_must_not_be_instance_hypothesis:${unit.unitId}`,
    );
    pushIf(
      unit.coreProgressClass !== 'kernel_human_review_loop',
      errors,
      `unit_core_progress_must_be_kernel_human_review_loop:${unit.unitId}`,
    );
    pushIf(
      unit.kernelFieldsInScope.length === 0,
      errors,
      `unit_kernel_fields_required:${unit.unitId}`,
    );
    pushIf(
      unit.reviewQuestion.trim().length === 0,
      errors,
      `unit_review_question_required:${unit.unitId}`,
    );

    const missingReviewBlocks = missingValues(unit.reviewBlocks, REQUIRED_REVIEW_BLOCKS);
    const missingNonBlocking = missingValues(unit.doesNotBlock, REQUIRED_NON_BLOCKING);

    pushIf(
      missingReviewBlocks.length > 0,
      errors,
      `unit_review_blocks_missing:${unit.unitId}:${missingReviewBlocks.join(',')}`,
    );
    pushIf(
      missingNonBlocking.length > 0,
      errors,
      `unit_non_blocking_routes_missing:${unit.unitId}:${missingNonBlocking.join(',')}`,
    );
    pushIf(
      unit.approvalEffect !== 'does_not_approve_publication_runtime_source_support_or_learning',
      errors,
      `unit_must_not_approve_publication_runtime_source_support_or_learning:${unit.unitId}`,
    );
  }

  pushIf(
    packet.movementBoundary.runtime !== 'not_changed' ||
      packet.movementBoundary.prompt !== 'not_changed' ||
      packet.movementBoundary.retrieval !== 'not_changed' ||
      packet.movementBoundary.modelProvider !== 'not_changed' ||
      packet.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    packet.movementBoundary.publicApproval !== 'not_approved' ||
      packet.movementBoundary.publication !== 'not_published' ||
      packet.movementBoundary.sourceValidity !== 'not_decided' ||
      packet.movementBoundary.supportValidity !== 'not_decided' ||
      packet.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      packet.movementBoundary.runtimeApproved !== 'not_approved' ||
      packet.movementBoundary.publicApproved !== 'not_approved' ||
      packet.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      packet.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'review_packet_must_not_move_approval_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY,
    coreProgressClass: 'kernel_human_review_loop',
  };
}
