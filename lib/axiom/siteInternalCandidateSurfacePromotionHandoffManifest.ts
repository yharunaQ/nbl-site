import {
  type AxiomCandidateSurfacePromotionRequestUnit,
  type AxiomCandidateSurfacePromotionReviewDecision,
  type AxiomInternalCandidateSurfacePromotionRequestPacket,
  buildAxiomInternalCandidateSurfacePromotionRequestPacket,
  validateAxiomInternalCandidateSurfacePromotionRequestPacket,
} from './siteInternalCandidateSurfacePromotionRequestPacket';
import {
  type AxiomInternalCandidateReleaseReadinessLedger,
  buildAxiomInternalCandidateReleaseReadinessLedger,
} from './siteInternalCandidateReleaseReadinessLedger';
import {
  type AxiomInternalCandidatePublicPageHoldPacket,
  buildAxiomInternalCandidatePublicPageHoldPacket,
} from './siteInternalCandidatePublicPageHoldPacket';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY =
  'axiom_internal_candidate_surface_promotion_handoff_manifest_is_review_handoff_input_not_review_execution_candidate_promotion_public_approval_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_ROUTE =
  '/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest' as const;

export type AxiomCandidateSurfacePromotionHandoffDecisionOption =
  | 'continue_internal_only'
  | 'return_to_kernel_revision'
  | 'send_to_human_review_outside_codex'
  | 'prepare_separate_public_release_packet_after_review';

export type AxiomCandidateSurfacePromotionHandoffManifestUnit = {
  unitId: string;
  unitType:
    | 'surface_candidate_surface_promotion_handoff_review_input'
    | 'cross_candidate_surface_promotion_handoff_review_input'
    | 'gate8_candidate_surface_promotion_handoff_review_input';
  surface?: AxiomNextNblSiteSurface;
  sourceRequestUnitId: string;
  sourceLedgerEntryCount: number;
  sourceRequestStatus: 'review_input_prepared_not_submitted_not_promoted';
  requiredReviewDecisions: AxiomCandidateSurfacePromotionReviewDecision[];
  handoffDecisionOptions: AxiomCandidateSurfacePromotionHandoffDecisionOption[];
  founderDecisionStatus: 'not_decided';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  handoffStatus: 'prepared_not_sent_by_codex';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidateSurfacePromotionHandoffManifest = {
  manifestId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_ROUTE;
  sourcePromotionRequestPacketId: string;
  sourcePromotionRequestPacketStatus: AxiomInternalCandidateSurfacePromotionRequestPacket['status'];
  sourcePromotionRequestRequiredStatus: 'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted';
  sourceRequestSubmissionStatus: 'not_submitted_by_codex';
  sourceCandidatePromotionStatus: 'not_promoted';
  manifestMode: 'founder_reviewer_handoff_input_only';
  handoffStatus: 'prepared_not_sent_by_codex';
  founderDecisionStatus: 'not_decided';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  maxCoreReviewUnits: 100;
  manifestUnitCount: number;
  sourceLedgerEntryCount: number;
  manifestUnits: AxiomCandidateSurfacePromotionHandoffManifestUnit[];
  nextAllowedMovement: 'founder_or_reviewer_can_review_outside_codex_only';
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    publicNavigation: 'not_added';
    falconCandidateSurfacePromotion: 'not_promoted';
    sourceValidity: 'not_decided';
    sourceCurrentness: 'not_decided';
    supportValidity: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    knowledgePromotion: 'not_promoted';
    learningUpdate: 'not_updated';
  };
};

export type AxiomInternalCandidateSurfacePromotionHandoffManifestValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

const HANDOFF_DECISION_OPTIONS: AxiomCandidateSurfacePromotionHandoffDecisionOption[] = [
  'continue_internal_only',
  'return_to_kernel_revision',
  'send_to_human_review_outside_codex',
  'prepare_separate_public_release_packet_after_review',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function handoffUnitTypeForRequestUnit(
  requestUnit: AxiomCandidateSurfacePromotionRequestUnit,
): AxiomCandidateSurfacePromotionHandoffManifestUnit['unitType'] {
  if (requestUnit.unitType === 'surface_candidate_surface_promotion_request_review_input') {
    return 'surface_candidate_surface_promotion_handoff_review_input';
  }
  if (requestUnit.unitType === 'cross_candidate_surface_promotion_request_review_input') {
    return 'cross_candidate_surface_promotion_handoff_review_input';
  }

  return 'gate8_candidate_surface_promotion_handoff_review_input';
}

function buildManifestUnit(
  requestUnit: AxiomCandidateSurfacePromotionRequestUnit,
): AxiomCandidateSurfacePromotionHandoffManifestUnit {
  return {
    unitId: `axiom_candidate_surface_promotion_handoff_${requestUnit.unitId}`,
    unitType: handoffUnitTypeForRequestUnit(requestUnit),
    surface: requestUnit.surface,
    sourceRequestUnitId: requestUnit.unitId,
    sourceLedgerEntryCount: requestUnit.sourceLedgerEntryCount,
    sourceRequestStatus: requestUnit.requestStatus,
    requiredReviewDecisions: [...requestUnit.requiredReviewDecisions],
    handoffDecisionOptions: [...HANDOFF_DECISION_OPTIONS],
    founderDecisionStatus: 'not_decided',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    handoffStatus: 'prepared_not_sent_by_codex',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidateSurfacePromotionHandoffManifest(
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(),
): AxiomInternalCandidateSurfacePromotionHandoffManifest {
  const manifestUnits = sourcePromotionRequestPacket.requestUnits.map((requestUnit) =>
    buildManifestUnit(requestUnit),
  );

  return {
    manifestId: `axiom_internal_candidate_surface_promotion_handoff_manifest_from_${sourcePromotionRequestPacket.packetId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_ROUTE,
    sourcePromotionRequestPacketId: sourcePromotionRequestPacket.packetId,
    sourcePromotionRequestPacketStatus: sourcePromotionRequestPacket.status,
    sourcePromotionRequestRequiredStatus:
      'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
    sourceRequestSubmissionStatus: sourcePromotionRequestPacket.requestSubmissionStatus,
    sourceCandidatePromotionStatus: sourcePromotionRequestPacket.candidatePromotionStatus,
    manifestMode: 'founder_reviewer_handoff_input_only',
    handoffStatus: 'prepared_not_sent_by_codex',
    founderDecisionStatus: 'not_decided',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    maxCoreReviewUnits: 100,
    manifestUnitCount: manifestUnits.length,
    sourceLedgerEntryCount: sourcePromotionRequestPacket.sourceLedgerEntryCount,
    manifestUnits,
    nextAllowedMovement: 'founder_or_reviewer_can_review_outside_codex_only',
    movementBoundary: {
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      publicApproval: 'not_approved',
      publication: 'not_published',
      publicNavigation: 'not_added',
      falconCandidateSurfacePromotion: 'not_promoted',
      sourceValidity: 'not_decided',
      sourceCurrentness: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      knowledgePromotion: 'not_promoted',
      learningUpdate: 'not_updated',
    },
  };
}

export function validateAxiomInternalCandidateSurfacePromotionHandoffManifest(
  manifest: AxiomInternalCandidateSurfacePromotionHandoffManifest,
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket,
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidateSurfacePromotionHandoffManifestValidation {
  const errors: string[] = [];
  const requestPacketValidation = validateAxiomInternalCandidateSurfacePromotionRequestPacket(
    sourcePromotionRequestPacket,
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const manifestUnitSurfaces = manifest.manifestUnits
    .filter((unit) => unit.unitType === 'surface_candidate_surface_promotion_handoff_review_input')
    .map((unit) => unit.surface);

  pushIf(!requestPacketValidation.valid, errors, 'source_promotion_request_packet_must_validate');
  pushIf(manifest.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    manifest.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_review_loop',
  );
  pushIf(
    manifest.status !==
      'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
    errors,
    'status_must_remain_prepared_not_sent_not_promoted',
  );
  pushIf(
    manifest.boundary !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY,
    errors,
    'boundary_must_remain_handoff_input_not_review_execution_promotion_public_approval_or_release',
  );
  pushIf(
    manifest.route !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_ROUTE,
    errors,
    'route_must_remain_internal_promotion_handoff_manifest',
  );
  pushIf(
    manifest.sourcePromotionRequestPacketId !== sourcePromotionRequestPacket.packetId,
    errors,
    'source_promotion_request_packet_id_mismatch',
  );
  pushIf(
    manifest.sourcePromotionRequestPacketStatus !== sourcePromotionRequestPacket.status,
    errors,
    'source_promotion_request_packet_status_mismatch',
  );
  pushIf(
    manifest.sourcePromotionRequestRequiredStatus !==
      'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
    errors,
    'source_promotion_request_required_status_must_remain_prepared_for_review_not_submitted_not_promoted',
  );
  pushIf(
    manifest.sourceRequestSubmissionStatus !== 'not_submitted_by_codex' ||
      manifest.sourceCandidatePromotionStatus !== 'not_promoted',
    errors,
    'source_request_must_not_be_submitted_or_promoted',
  );
  pushIf(
    manifest.manifestMode !== 'founder_reviewer_handoff_input_only' ||
      manifest.handoffStatus !== 'prepared_not_sent_by_codex' ||
      manifest.founderDecisionStatus !== 'not_decided' ||
      manifest.reviewExecutionStatus !== 'not_executed' ||
      manifest.reviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'manifest_must_remain_unexecuted_unsent_and_undecided',
  );
  pushIf(manifest.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    manifest.manifestUnitCount !== sourcePromotionRequestPacket.requestUnitCount,
    errors,
    'manifest_unit_count_must_match_source_request_units',
  );
  pushIf(
    manifest.manifestUnitCount !== manifest.manifestUnits.length,
    errors,
    'manifest_unit_count_mismatch',
  );
  pushIf(
    manifest.manifestUnitCount > manifest.maxCoreReviewUnits,
    errors,
    'manifest_units_must_remain_under_100',
  );
  pushIf(
    manifest.sourceLedgerEntryCount !== sourcePromotionRequestPacket.sourceLedgerEntryCount,
    errors,
    'source_ledger_entry_count_mismatch',
  );
  pushIf(
    manifest.nextAllowedMovement !== 'founder_or_reviewer_can_review_outside_codex_only',
    errors,
    'next_allowed_movement_must_remain_outside_codex_review_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !manifestUnitSurfaces.includes(surface),
      errors,
      `surface_handoff_unit_missing:${surface}`,
    );
  }
  pushIf(
    !manifest.manifestUnits.some(
      (unit) => unit.unitType === 'cross_candidate_surface_promotion_handoff_review_input',
    ),
    errors,
    'cross_candidate_surface_promotion_handoff_review_input_missing',
  );
  pushIf(
    !manifest.manifestUnits.some(
      (unit) => unit.unitType === 'gate8_candidate_surface_promotion_handoff_review_input',
    ),
    errors,
    'gate8_candidate_surface_promotion_handoff_review_input_missing',
  );

  for (const unit of manifest.manifestUnits) {
    const sourceRequestUnit = sourcePromotionRequestPacket.requestUnits.find(
      (requestUnit) => requestUnit.unitId === unit.sourceRequestUnitId,
    );

    pushIf(!sourceRequestUnit, errors, `source_request_unit_missing:${unit.unitId}`);
    if (sourceRequestUnit) {
      pushIf(
        unit.unitType !== handoffUnitTypeForRequestUnit(sourceRequestUnit) ||
          unit.surface !== sourceRequestUnit.surface ||
          unit.sourceLedgerEntryCount !== sourceRequestUnit.sourceLedgerEntryCount ||
          unit.sourceRequestStatus !== sourceRequestUnit.requestStatus,
        errors,
        `handoff_unit_source_mismatch:${unit.unitId}`,
      );
      for (const decision of sourceRequestUnit.requiredReviewDecisions) {
        pushIf(
          !unit.requiredReviewDecisions.includes(decision),
          errors,
          `handoff_unit_review_decision_missing:${unit.unitId}:${decision}`,
        );
      }
    }

    for (const option of HANDOFF_DECISION_OPTIONS) {
      pushIf(
        !unit.handoffDecisionOptions.includes(option),
        errors,
        `handoff_decision_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.founderDecisionStatus !== 'not_decided' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.handoffStatus !== 'prepared_not_sent_by_codex',
      errors,
      `handoff_unit_must_remain_unexecuted_unsent_and_undecided:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `handoff_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

  pushIf(
    manifest.movementBoundary.runtime !== 'not_changed' ||
      manifest.movementBoundary.prompt !== 'not_changed' ||
      manifest.movementBoundary.retrieval !== 'not_changed' ||
      manifest.movementBoundary.modelProvider !== 'not_changed' ||
      manifest.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    manifest.movementBoundary.publicApproval !== 'not_approved' ||
      manifest.movementBoundary.publication !== 'not_published' ||
      manifest.movementBoundary.publicNavigation !== 'not_added' ||
      manifest.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      manifest.movementBoundary.sourceValidity !== 'not_decided' ||
      manifest.movementBoundary.sourceCurrentness !== 'not_decided' ||
      manifest.movementBoundary.supportValidity !== 'not_decided' ||
      manifest.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      manifest.movementBoundary.runtimeApproved !== 'not_approved' ||
      manifest.movementBoundary.publicApproved !== 'not_approved' ||
      manifest.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      manifest.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'handoff_manifest_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
