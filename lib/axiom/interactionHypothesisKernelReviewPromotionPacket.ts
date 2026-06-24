import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  type AxiomHumanReviewBlock,
  type AxiomHumanReviewNonBlocking,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelBuildGroundingReviewUnitCompression,
  type AxiomKernelGroundedField,
  type AxiomKernelReviewCompressionUnit,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY,
  AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
  runAxiomRealDerivedEvidenceKernelBuildBatch,
  type AxiomRealDerivedKernelBuildBatchRun,
} from './interactionHypothesisKernelRealDerivedEvidenceProtocol';

export const AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY =
  'axiom_kernel_review_promotion_packet_prepares_human_review_without_source_support_validity_or_promotion_movement' as const;

export type AxiomReviewPromotionBlockedDecisionStatus =
  AxiomKernelBuildGroundingReviewUnitCompression['blockedDecisionStatus'];

export type AxiomKernelReviewPromotionMovementBoundary = {
  runtime: 'not_changed';
  prompt: 'not_changed';
  retrieval: 'not_changed';
  modelProvider: 'not_changed';
  dbSchema: 'not_changed';
  sourceValidity: 'not_decided';
  supportValidity: 'not_decided';
  candidatePattern: 'not_candidate_pattern';
  runtimeApproved: 'not_approved';
  publicApproved: 'not_approved';
  publicRelease: 'not_approved';
  knowledgePromotion: 'not_promoted';
  learningUpdate: 'not_promoted';
};

export type AxiomKernelReviewPromotionUnit = {
  unitId: string;
  sourceCompressionUnitId: string;
  sourceUnitType: AxiomKernelReviewCompressionUnit['unitType'];
  reviewScale: 'compressed_framework_unit_not_individual_hypothesis';
  coreProgressClass: 'kernel_human_review_loop';
  packetIds: string[];
  scenarioIds: string[];
  kernelFieldsInScope: AxiomKernelGroundedField[];
  currentUseAllowed: 'internal_provisional_kernel_build_grounding_eval_display_only';
  promotionRoute: 'requires_human_review_before_source_support_validity_candidate_pattern_runtime_public_or_learning';
  requiresHumanReview: true;
  reviewQuestion: string;
  blocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  blockedDecisionStatus: AxiomReviewPromotionBlockedDecisionStatus;
};

export type AxiomKernelReviewPromotionPacket = {
  packetId: string;
  objectType: 'axiom_kernel_review_promotion_packet';
  contractVersion: typeof AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_VERSION;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_human_review_loop';
  status: 'review_packet_prepared_promotion_not_moved';
  boundary: typeof AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY;
  sourceBatchRunId: string;
  sourceRealDerivedBoundary: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY;
  sourceBuildGroundingBoundary: typeof AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY;
  sourcePacketIds: string[];
  sourceScenarioIds: string[];
  reviewUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  promotionUnits: AxiomKernelReviewPromotionUnit[];
  blockedDecisionStatus: AxiomReviewPromotionBlockedDecisionStatus;
  provisionalWorkAllowed: AxiomHumanReviewNonBlocking[];
  movementBoundary: AxiomKernelReviewPromotionMovementBoundary;
  notNow: string[];
};

export type AxiomKernelReviewPromotionPacketValidation = {
  valid: boolean;
  validationStatus: 'review_promotion_packet_valid' | 'review_promotion_packet_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY;
  coreProgressClass: 'kernel_human_review_loop';
};

const UNCHANGED_REVIEW_PROMOTION_MOVEMENT_BOUNDARY: AxiomKernelReviewPromotionMovementBoundary = {
  runtime: 'not_changed',
  prompt: 'not_changed',
  retrieval: 'not_changed',
  modelProvider: 'not_changed',
  dbSchema: 'not_changed',
  sourceValidity: 'not_decided',
  supportValidity: 'not_decided',
  candidatePattern: 'not_candidate_pattern',
  runtimeApproved: 'not_approved',
  publicApproved: 'not_approved',
  publicRelease: 'not_approved',
  knowledgePromotion: 'not_promoted',
  learningUpdate: 'not_promoted',
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function missingValues<T extends string>(actual: readonly T[], required: readonly T[]): T[] {
  return required.filter((value) => !actual.includes(value));
}

function kernelFieldsForReviewUnit(
  unitType: AxiomKernelReviewCompressionUnit['unitType'],
): AxiomKernelGroundedField[] {
  if (unitType === 'actionability_band') return ['actionabilityBand', 'missingContext'];
  if (unitType === 'l3_principal_pattern_family') return ['inference', 'observation'];
  if (unitType === 'cross_cutting_check_family') {
    return ['inference', 'counterHypothesis', 'cannotYetSay'];
  }
  if (unitType === 'source_lens_status') return ['sourceLensStatus', 'missingContext'];
  if (unitType === 'implementation_actor_conditions') {
    return ['implementationActorConditions', 'missingContext'];
  }
  if (unitType === 'review_driven_promotion_gate') return ['humanReviewRoute'];
  if (unitType === 'cannot_yet_say_boundary') return ['cannotYetSay'];

  return [...AXIOM_KERNEL_GROUNDED_FIELDS];
}

function buildPromotionUnit(
  compressionUnit: AxiomKernelReviewCompressionUnit,
  blockedDecisionStatus: AxiomReviewPromotionBlockedDecisionStatus,
): AxiomKernelReviewPromotionUnit {
  return {
    unitId: `promotion_${compressionUnit.unitId}`,
    sourceCompressionUnitId: compressionUnit.unitId,
    sourceUnitType: compressionUnit.unitType,
    reviewScale: 'compressed_framework_unit_not_individual_hypothesis',
    coreProgressClass: 'kernel_human_review_loop',
    packetIds: compressionUnit.packetIds,
    scenarioIds: compressionUnit.scenarioIds,
    kernelFieldsInScope: kernelFieldsForReviewUnit(compressionUnit.unitType),
    currentUseAllowed: 'internal_provisional_kernel_build_grounding_eval_display_only',
    promotionRoute:
      'requires_human_review_before_source_support_validity_candidate_pattern_runtime_public_or_learning',
    requiresHumanReview: true,
    reviewQuestion: compressionUnit.reviewQuestion,
    blocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    blockedDecisionStatus,
  };
}

export function buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch(
  batchRun: AxiomRealDerivedKernelBuildBatchRun = runAxiomRealDerivedEvidenceKernelBuildBatch(),
): AxiomKernelReviewPromotionPacket {
  const compression = batchRun.reviewUnitCompression;
  const promotionUnits = compression.units.map((unit) =>
    buildPromotionUnit(unit, compression.blockedDecisionStatus),
  );

  return {
    packetId: `axiom_kernel_review_promotion_packet_from_${batchRun.runId}`,
    objectType: 'axiom_kernel_review_promotion_packet',
    contractVersion: AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_VERSION,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_human_review_loop',
    status: 'review_packet_prepared_promotion_not_moved',
    boundary: AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
    sourceBatchRunId: batchRun.runId,
    sourceRealDerivedBoundary: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY,
    sourceBuildGroundingBoundary: AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    sourcePacketIds: batchRun.runs.map((run) => run.evidencePacket.packetId),
    sourceScenarioIds: Array.from(new Set(batchRun.runs.map((run) => run.evidencePacket.scenarioId))),
    reviewUnitCount: promotionUnits.length,
    maxCoreHumanReviewUnits: 100,
    promotionUnits,
    blockedDecisionStatus: compression.blockedDecisionStatus,
    provisionalWorkAllowed: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    movementBoundary: { ...UNCHANGED_REVIEW_PROMOTION_MOVEMENT_BOUNDARY },
    notNow: [
      'no_human_review_result_created_by_codex',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_or_public_approval',
      'no_publication',
      'no_learning_update',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_public_page_filling_from_unpromoted_kernel',
      ...batchRun.notNow,
    ],
  };
}

export function validateAxiomKernelReviewPromotionPacket(
  packet: AxiomKernelReviewPromotionPacket,
  sourceBatchRun: AxiomRealDerivedKernelBuildBatchRun,
): AxiomKernelReviewPromotionPacketValidation {
  const errors: string[] = [];
  const compression = sourceBatchRun.reviewUnitCompression;
  const compressionUnitIds = new Set(compression.units.map((unit) => unit.unitId));

  pushIf(
    packet.objectType !== 'axiom_kernel_review_promotion_packet',
    errors,
    'object_type_must_be_axiom_kernel_review_promotion_packet',
  );
  pushIf(
    packet.contractVersion !== AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_VERSION,
    errors,
    'contract_version_must_match_review_promotion_packet_v0_2026_06_08',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClass !== 'kernel_human_review_loop',
    errors,
    'core_progress_must_be_kernel_human_review_loop',
  );
  pushIf(
    packet.status !== 'review_packet_prepared_promotion_not_moved',
    errors,
    'status_must_remain_review_packet_prepared_promotion_not_moved',
  );
  pushIf(
    packet.boundary !== AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_review_packet_without_promotion_movement',
  );
  pushIf(
    packet.sourceBatchRunId !== sourceBatchRun.runId,
    errors,
    'source_batch_run_id_mismatch',
  );
  pushIf(
    sourceBatchRun.status !== 'passed_real_derived_non_sensitive_kernel_build_batch',
    errors,
    'source_batch_must_pass_before_review_promotion_packet',
  );
  pushIf(
    packet.sourceRealDerivedBoundary !== AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY ||
      packet.sourceBuildGroundingBoundary !== AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    errors,
    'source_boundaries_must_match_real_derived_and_build_grounding_contracts',
  );
  pushIf(packet.maxCoreHumanReviewUnits !== 100, errors, 'max_core_review_units_must_be_100');
  pushIf(
    packet.reviewUnitCount !== packet.promotionUnits.length,
    errors,
    'review_unit_count_must_match_promotion_units_length',
  );
  pushIf(
    packet.reviewUnitCount !== compression.units.length,
    errors,
    'review_unit_count_must_match_source_compression_units',
  );
  pushIf(
    packet.reviewUnitCount > packet.maxCoreHumanReviewUnits,
    errors,
    'review_unit_count_must_not_exceed_100',
  );

  for (const unit of packet.promotionUnits) {
    pushIf(
      !compressionUnitIds.has(unit.sourceCompressionUnitId),
      errors,
      `source_compression_unit_missing:${unit.unitId}`,
    );
    pushIf(
      unit.reviewScale !== 'compressed_framework_unit_not_individual_hypothesis',
      errors,
      `review_scale_must_not_be_instance_hypothesis:${unit.unitId}`,
    );
    pushIf(
      unit.coreProgressClass !== 'kernel_human_review_loop',
      errors,
      `unit_core_progress_must_be_kernel_human_review_loop:${unit.unitId}`,
    );
    pushIf(
      unit.packetIds.length === 0 || unit.scenarioIds.length === 0,
      errors,
      `unit_packet_and_scenario_refs_required:${unit.unitId}`,
    );
    pushIf(
      unit.kernelFieldsInScope.length === 0,
      errors,
      `unit_kernel_fields_required:${unit.unitId}`,
    );
    pushIf(
      unit.currentUseAllowed !== 'internal_provisional_kernel_build_grounding_eval_display_only',
      errors,
      `unit_current_use_must_remain_internal_provisional_only:${unit.unitId}`,
    );
    pushIf(
      unit.promotionRoute !==
        'requires_human_review_before_source_support_validity_candidate_pattern_runtime_public_or_learning',
      errors,
      `unit_promotion_route_must_require_human_review:${unit.unitId}`,
    );
    pushIf(unit.requiresHumanReview !== true, errors, `unit_must_require_human_review:${unit.unitId}`);
    pushIf(unit.reviewQuestion.trim().length === 0, errors, `review_question_required:${unit.unitId}`);

    const missingBlocks = missingValues(unit.blocks, AXIOM_HUMAN_REVIEW_BLOCKS);
    const missingNonBlocking = missingValues(unit.doesNotBlock, AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK);

    pushIf(
      missingBlocks.length > 0,
      errors,
      `unit_blocks_missing:${unit.unitId}:${missingBlocks.join(',')}`,
    );
    pushIf(
      missingNonBlocking.length > 0,
      errors,
      `unit_non_blocking_routes_missing:${unit.unitId}:${missingNonBlocking.join(',')}`,
    );
    pushIf(
      unit.blockedDecisionStatus.sourceValidity !== 'not_decided' ||
        unit.blockedDecisionStatus.supportValidity !== 'not_decided' ||
        unit.blockedDecisionStatus.candidatePattern !== 'not_candidate_pattern' ||
        unit.blockedDecisionStatus.runtimeApproved !== 'not_approved' ||
        unit.blockedDecisionStatus.publicApproved !== 'not_approved' ||
        unit.blockedDecisionStatus.publicRelease !== 'not_approved' ||
        unit.blockedDecisionStatus.learningUpdate !== 'not_promoted' ||
        unit.blockedDecisionStatus.knowledgePromotion !== 'not_promoted',
      errors,
      `unit_must_not_move_blocked_decisions:${unit.unitId}`,
    );
  }

  pushIf(
    packet.blockedDecisionStatus.sourceValidity !== 'not_decided' ||
      packet.blockedDecisionStatus.supportValidity !== 'not_decided' ||
      packet.blockedDecisionStatus.candidatePattern !== 'not_candidate_pattern' ||
      packet.blockedDecisionStatus.runtimeApproved !== 'not_approved' ||
      packet.blockedDecisionStatus.publicApproved !== 'not_approved' ||
      packet.blockedDecisionStatus.publicRelease !== 'not_approved' ||
      packet.blockedDecisionStatus.learningUpdate !== 'not_promoted' ||
      packet.blockedDecisionStatus.knowledgePromotion !== 'not_promoted',
    errors,
    'packet_must_not_move_blocked_decisions',
  );
  pushIf(
    missingValues(packet.provisionalWorkAllowed, AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK).length > 0,
    errors,
    'provisional_work_allowed_must_include_all_non_blocking_routes',
  );
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
    packet.movementBoundary.sourceValidity !== 'not_decided' ||
      packet.movementBoundary.supportValidity !== 'not_decided' ||
      packet.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      packet.movementBoundary.runtimeApproved !== 'not_approved' ||
      packet.movementBoundary.publicApproved !== 'not_approved' ||
      packet.movementBoundary.publicRelease !== 'not_approved' ||
      packet.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      packet.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'movement_boundary_must_not_move_validity_approval_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'review_promotion_packet_valid'
        : 'review_promotion_packet_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
    coreProgressClass: 'kernel_human_review_loop',
  };
}
