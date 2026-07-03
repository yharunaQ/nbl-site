import {
  type AxiomCandidateReleaseReadinessLedgerUnit,
  type AxiomCandidateReleaseReadinessStatus,
  type AxiomInternalCandidateReleaseReadinessLedger,
  buildAxiomInternalCandidateReleaseReadinessLedger,
  validateAxiomInternalCandidateReleaseReadinessLedger,
} from './siteInternalCandidateReleaseReadinessLedger';
import {
  type AxiomInternalCandidatePublicPageHoldPacket,
  buildAxiomInternalCandidatePublicPageHoldPacket,
} from './siteInternalCandidatePublicPageHoldPacket';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY =
  'axiom_internal_candidate_surface_promotion_request_packet_is_review_input_not_candidate_promotion_public_approval_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_ROUTE =
  '/internal/axiom-next-nbl-candidate-surface-promotion-request-packet' as const;

export type AxiomCandidateSurfacePromotionReviewDecision =
  | 'confirm_public_boundary_hold'
  | 'confirm_accessibility_readiness'
  | 'confirm_regression_evidence_current'
  | 'confirm_source_support_validity_still_undecided'
  | 'confirm_human_review_route'
  | 'confirm_founder_public_release_gate_required'
  | 'confirm_no_candidate_promotion_public_navigation_or_release';

export type AxiomCandidateSurfacePromotionRequestUnit = {
  unitId: string;
  unitType:
    | 'surface_candidate_surface_promotion_request_review_input'
    | 'cross_candidate_surface_promotion_request_review_input'
    | 'gate8_candidate_surface_promotion_request_review_input';
  surface?: AxiomNextNblSiteSurface;
  sourceLedgerUnitId: string;
  sourceLedgerEntryCount: number;
  sourceReadinessStatuses: AxiomCandidateReleaseReadinessStatus[];
  requestStatus: 'review_input_prepared_not_submitted_not_promoted';
  promotionDisposition: 'blocked_until_human_review_and_founder_public_release_gate';
  humanReviewRoute: 'required_before_candidate_promotion';
  requiredReviewDecisions: AxiomCandidateSurfacePromotionReviewDecision[];
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidateSurfacePromotionRequestPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_ROUTE;
  sourceReleaseReadinessLedgerId: string;
  sourceReleaseReadinessLedgerStatus: AxiomInternalCandidateReleaseReadinessLedger['status'];
  sourceReleaseReadinessLedgerRequiredStatus: 'internal_candidate_release_readiness_ledger_prepared_not_released';
  sourceReleaseReadinessStatus: 'not_ready_public_release_hold';
  requestMode: 'human_review_input_only';
  requestSubmissionStatus: 'not_submitted_by_codex';
  candidatePromotionStatus: 'not_promoted';
  maxCoreReviewUnits: 100;
  requestUnitCount: number;
  sourceLedgerEntryCount: number;
  requestUnits: AxiomCandidateSurfacePromotionRequestUnit[];
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
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

export type AxiomInternalCandidateSurfacePromotionRequestPacketValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_CANDIDATE_SURFACE_PROMOTION_REVIEW_DECISIONS: AxiomCandidateSurfacePromotionReviewDecision[] =
  [
    'confirm_public_boundary_hold',
    'confirm_accessibility_readiness',
    'confirm_regression_evidence_current',
    'confirm_source_support_validity_still_undecided',
    'confirm_human_review_route',
    'confirm_founder_public_release_gate_required',
    'confirm_no_candidate_promotion_public_navigation_or_release',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function requestUnitTypeForLedgerUnit(
  ledgerUnit: AxiomCandidateReleaseReadinessLedgerUnit,
): AxiomCandidateSurfacePromotionRequestUnit['unitType'] {
  if (ledgerUnit.unitType === 'surface_candidate_release_readiness') {
    return 'surface_candidate_surface_promotion_request_review_input';
  }
  if (ledgerUnit.unitType === 'cross_candidate_release_readiness') {
    return 'cross_candidate_surface_promotion_request_review_input';
  }

  return 'gate8_candidate_surface_promotion_request_review_input';
}

function uniqueReadinessStatuses(
  ledgerUnit: AxiomCandidateReleaseReadinessLedgerUnit,
): AxiomCandidateReleaseReadinessStatus[] {
  return Array.from(new Set(ledgerUnit.entries.map((entry) => entry.readinessStatus)));
}

function buildRequestUnit(
  ledgerUnit: AxiomCandidateReleaseReadinessLedgerUnit,
): AxiomCandidateSurfacePromotionRequestUnit {
  return {
    unitId: `axiom_candidate_surface_promotion_request_${ledgerUnit.unitId}`,
    unitType: requestUnitTypeForLedgerUnit(ledgerUnit),
    surface: ledgerUnit.surface,
    sourceLedgerUnitId: ledgerUnit.unitId,
    sourceLedgerEntryCount: ledgerUnit.entryCount,
    sourceReadinessStatuses: uniqueReadinessStatuses(ledgerUnit),
    requestStatus: 'review_input_prepared_not_submitted_not_promoted',
    promotionDisposition: 'blocked_until_human_review_and_founder_public_release_gate',
    humanReviewRoute: 'required_before_candidate_promotion',
    requiredReviewDecisions: [...AXIOM_CANDIDATE_SURFACE_PROMOTION_REVIEW_DECISIONS],
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidateSurfacePromotionRequestPacket(
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
): AxiomInternalCandidateSurfacePromotionRequestPacket {
  const requestUnits = sourceReleaseReadinessLedger.ledgerUnits.map((ledgerUnit) =>
    buildRequestUnit(ledgerUnit),
  );

  return {
    packetId: `axiom_internal_candidate_surface_promotion_request_packet_from_${sourceReleaseReadinessLedger.ledgerId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_ROUTE,
    sourceReleaseReadinessLedgerId: sourceReleaseReadinessLedger.ledgerId,
    sourceReleaseReadinessLedgerStatus: sourceReleaseReadinessLedger.status,
    sourceReleaseReadinessLedgerRequiredStatus:
      'internal_candidate_release_readiness_ledger_prepared_not_released',
    sourceReleaseReadinessStatus: sourceReleaseReadinessLedger.releaseReadinessStatus,
    requestMode: 'human_review_input_only',
    requestSubmissionStatus: 'not_submitted_by_codex',
    candidatePromotionStatus: 'not_promoted',
    maxCoreReviewUnits: 100,
    requestUnitCount: requestUnits.length,
    sourceLedgerEntryCount: sourceReleaseReadinessLedger.ledgerEntryCount,
    requestUnits,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
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

export function validateAxiomInternalCandidateSurfacePromotionRequestPacket(
  packet: AxiomInternalCandidateSurfacePromotionRequestPacket,
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger,
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidateSurfacePromotionRequestPacketValidation {
  const errors: string[] = [];
  const ledgerValidation = validateAxiomInternalCandidateReleaseReadinessLedger(
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const requestUnitSurfaces = packet.requestUnits
    .filter((unit) => unit.unitType === 'surface_candidate_surface_promotion_request_review_input')
    .map((unit) => unit.surface);

  pushIf(!ledgerValidation.valid, errors, 'source_release_readiness_ledger_must_validate');
  pushIf(
    sourceReleaseReadinessLedger.status !==
      'internal_candidate_release_readiness_ledger_prepared_not_released',
    errors,
    'source_release_readiness_ledger_must_remain_prepared_not_released',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    packet.status !==
      'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
    errors,
    'status_must_remain_prepared_for_review_not_submitted_not_promoted',
  );
  pushIf(
    packet.boundary !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_review_input_not_promotion_public_approval_navigation_or_release',
  );
  pushIf(
    packet.route !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_ROUTE,
    errors,
    'route_must_remain_internal_promotion_request_packet',
  );
  pushIf(
    packet.sourceReleaseReadinessLedgerId !== sourceReleaseReadinessLedger.ledgerId,
    errors,
    'source_release_readiness_ledger_id_mismatch',
  );
  pushIf(
    packet.sourceReleaseReadinessLedgerStatus !== sourceReleaseReadinessLedger.status,
    errors,
    'source_release_readiness_ledger_status_mismatch',
  );
  pushIf(
    packet.sourceReleaseReadinessLedgerRequiredStatus !==
      'internal_candidate_release_readiness_ledger_prepared_not_released',
    errors,
    'source_release_readiness_ledger_required_status_must_remain_prepared_not_released',
  );
  pushIf(
    packet.sourceReleaseReadinessStatus !== 'not_ready_public_release_hold',
    errors,
    'source_release_readiness_status_must_remain_not_ready_public_release_hold',
  );
  pushIf(
    packet.requestMode !== 'human_review_input_only',
    errors,
    'request_mode_must_be_review_input_only',
  );
  pushIf(
    packet.requestSubmissionStatus !== 'not_submitted_by_codex' ||
      packet.candidatePromotionStatus !== 'not_promoted',
    errors,
    'request_must_not_be_submitted_or_promoted_by_codex',
  );
  pushIf(packet.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    packet.requestUnitCount !== sourceReleaseReadinessLedger.ledgerUnitCount,
    errors,
    'request_unit_count_must_match_ledger_units',
  );
  pushIf(
    packet.requestUnitCount !== packet.requestUnits.length,
    errors,
    'request_unit_count_mismatch',
  );
  pushIf(
    packet.requestUnitCount > packet.maxCoreReviewUnits,
    errors,
    'request_units_must_remain_under_100',
  );
  pushIf(
    packet.sourceLedgerEntryCount !== sourceReleaseReadinessLedger.ledgerEntryCount,
    errors,
    'source_ledger_entry_count_mismatch',
  );
  pushIf(
    packet.reviewExecutionStatus !== 'not_executed' ||
      packet.reviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'review_must_not_be_executed_or_assigned_by_codex',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !requestUnitSurfaces.includes(surface),
      errors,
      `surface_request_unit_missing:${surface}`,
    );
  }
  pushIf(
    !packet.requestUnits.some(
      (unit) => unit.unitType === 'cross_candidate_surface_promotion_request_review_input',
    ),
    errors,
    'cross_candidate_surface_promotion_request_review_input_missing',
  );
  pushIf(
    !packet.requestUnits.some(
      (unit) => unit.unitType === 'gate8_candidate_surface_promotion_request_review_input',
    ),
    errors,
    'gate8_candidate_surface_promotion_request_review_input_missing',
  );

  for (const unit of packet.requestUnits) {
    const sourceLedgerUnit = sourceReleaseReadinessLedger.ledgerUnits.find(
      (ledgerUnit) => ledgerUnit.unitId === unit.sourceLedgerUnitId,
    );

    pushIf(!sourceLedgerUnit, errors, `source_ledger_unit_missing:${unit.unitId}`);
    if (sourceLedgerUnit) {
      const expectedReadinessStatuses = uniqueReadinessStatuses(sourceLedgerUnit);

      pushIf(
        unit.unitType !== requestUnitTypeForLedgerUnit(sourceLedgerUnit) ||
          unit.surface !== sourceLedgerUnit.surface ||
          unit.sourceLedgerEntryCount !== sourceLedgerUnit.entryCount,
        errors,
        `request_unit_source_mismatch:${unit.unitId}`,
      );
      pushIf(
        expectedReadinessStatuses.some((status) => !unit.sourceReadinessStatuses.includes(status)),
        errors,
        `request_unit_readiness_status_missing:${unit.unitId}`,
      );
    }

    for (const decision of AXIOM_CANDIDATE_SURFACE_PROMOTION_REVIEW_DECISIONS) {
      pushIf(
        !unit.requiredReviewDecisions.includes(decision),
        errors,
        `promotion_review_decision_missing:${unit.unitId}:${decision}`,
      );
    }
    pushIf(
      unit.requestStatus !== 'review_input_prepared_not_submitted_not_promoted' ||
        unit.promotionDisposition !==
          'blocked_until_human_review_and_founder_public_release_gate' ||
        unit.humanReviewRoute !== 'required_before_candidate_promotion',
      errors,
      `request_unit_status_invalid:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `request_unit_boundary_flags_invalid:${unit.unitId}`,
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
      packet.movementBoundary.publicNavigation !== 'not_added' ||
      packet.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      packet.movementBoundary.sourceValidity !== 'not_decided' ||
      packet.movementBoundary.sourceCurrentness !== 'not_decided' ||
      packet.movementBoundary.supportValidity !== 'not_decided' ||
      packet.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      packet.movementBoundary.runtimeApproved !== 'not_approved' ||
      packet.movementBoundary.publicApproved !== 'not_approved' ||
      packet.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      packet.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'promotion_request_packet_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
