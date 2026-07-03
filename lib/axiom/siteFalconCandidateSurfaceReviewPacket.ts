import {
  type AxiomGate8PreflightRunnerReceipt,
  buildAxiomGate8PreflightRunnerReceipt,
  buildNotRunAxiomGate8PreflightRunnerEvidenceInput,
  validateAxiomGate8PreflightRunnerReceipt,
} from './siteGate8PreflightRunnerReceipt';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from './siteGate8PreflightRunnerCriteria';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY =
  'axiom_falcon_candidate_surface_review_packet_is_review_input_not_promotion_public_approval_or_release' as const;

export type AxiomFalconCandidateSurfaceReviewDecision =
  | 'public_boundary_ok_for_candidate_surface_required'
  | 'source_currentness_review_required'
  | 'source_support_validity_not_decided'
  | 'human_review_required_before_candidate_promotion'
  | 'public_release_requires_separate_founder_approval';

export type AxiomFalconCandidateSurfaceReviewUnit = {
  unitId: string;
  unitType: 'surface_candidate_review' | 'cross_surface_boundary_review' | 'gate8_receipt_review';
  surface?: AxiomNextNblSiteSurface;
  questionSet: {
    publicBoundaryQuestion: string;
    sourceCurrentnessQuestion: string;
    sourceSupportValidityQuestion: string;
    promotionQuestion: string;
  };
  requiredDecisions: AxiomFalconCandidateSurfaceReviewDecision[];
  blocksCandidatePromotion: true;
  blocksPublicRelease: true;
  doesNotBlockInternalInspection: true;
};

export type AxiomFalconCandidateSurfaceReviewPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_human_review_loop';
  status: 'candidate_surface_review_packet_prepared_not_promoted';
  boundary: typeof AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY;
  sourceReceiptId: string;
  sourceReceiptStatus: AxiomGate8PreflightRunnerReceipt['receiptStatus'];
  sourceReceiptRequiredStatus: 'passed_internal_preflight_not_promoted';
  maxCoreReviewUnits: 100;
  reviewUnitCount: number;
  reviewUnits: AxiomFalconCandidateSurfaceReviewUnit[];
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

export type AxiomFalconCandidateSurfaceReviewPacketValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY;
  coreProgressClass: 'kernel_human_review_loop';
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildSurfaceReviewUnit(
  surface: AxiomNextNblSiteSurface,
): AxiomFalconCandidateSurfaceReviewUnit {
  return {
    unitId: `axiom_candidate_surface_review_${surface}`,
    unitType: 'surface_candidate_review',
    surface,
    questionSet: {
      publicBoundaryQuestion:
        'Does this surface avoid final advice, diagnosis, legal judgment, accommodation finality, publication claims, and public approval language?',
      sourceCurrentnessQuestion:
        'Are currentness-sensitive claims held until reviewed or live-currentness checked?',
      sourceSupportValidityQuestion:
        'Are source validity, support validity, and intervention validity explicitly undecided?',
      promotionQuestion:
        'Is this surface ready only for Falcon candidate-surface inspection, not public release?',
    },
    requiredDecisions: [
      'public_boundary_ok_for_candidate_surface_required',
      'source_currentness_review_required',
      'source_support_validity_not_decided',
      'human_review_required_before_candidate_promotion',
      'public_release_requires_separate_founder_approval',
    ],
    blocksCandidatePromotion: true,
    blocksPublicRelease: true,
    doesNotBlockInternalInspection: true,
  };
}

function buildCrossSurfaceReviewUnit(): AxiomFalconCandidateSurfaceReviewUnit {
  return {
    unitId: 'axiom_candidate_surface_review_cross_surface_boundary',
    unitType: 'cross_surface_boundary_review',
    questionSet: {
      publicBoundaryQuestion:
        'Does the whole next-NBL surface system preserve Axiom kernel fields without turning provisional hypotheses into public-final claims?',
      sourceCurrentnessQuestion:
        'Does the system keep Falcon bootstrap priors separate from source-current Axiom truth?',
      sourceSupportValidityQuestion:
        'Does the system keep source/support validity undecided until the separate review path is completed?',
      promotionQuestion:
        'Is the only possible movement after review Falcon candidate-surface inspection, not public release?',
    },
    requiredDecisions: [
      'public_boundary_ok_for_candidate_surface_required',
      'source_currentness_review_required',
      'source_support_validity_not_decided',
      'human_review_required_before_candidate_promotion',
      'public_release_requires_separate_founder_approval',
    ],
    blocksCandidatePromotion: true,
    blocksPublicRelease: true,
    doesNotBlockInternalInspection: true,
  };
}

function buildGate8ReceiptReviewUnit(): AxiomFalconCandidateSurfaceReviewUnit {
  return {
    unitId: 'axiom_candidate_surface_review_gate8_receipt',
    unitType: 'gate8_receipt_review',
    questionSet: {
      publicBoundaryQuestion:
        'Does the passed Gate 8 receipt preserve no-public-affordance and no-public-approval boundaries?',
      sourceCurrentnessQuestion:
        'Does the receipt keep currentness-sensitive source claims on hold rather than declaring them valid?',
      sourceSupportValidityQuestion:
        'Does the receipt avoid treating regression success as source/support/intervention validity?',
      promotionQuestion:
        'Does the receipt support only a review packet and not automatic candidate promotion?',
    },
    requiredDecisions: [
      'public_boundary_ok_for_candidate_surface_required',
      'source_currentness_review_required',
      'source_support_validity_not_decided',
      'human_review_required_before_candidate_promotion',
      'public_release_requires_separate_founder_approval',
    ],
    blocksCandidatePromotion: true,
    blocksPublicRelease: true,
    doesNotBlockInternalInspection: true,
  };
}

export function buildAxiomFalconCandidateSurfaceReviewPacket(
  receipt: AxiomGate8PreflightRunnerReceipt = buildAxiomGate8PreflightRunnerReceipt(
    buildAxiomGate8PreflightRunnerCriteriaPacket(),
    buildNotRunAxiomGate8PreflightRunnerEvidenceInput(),
  ),
): AxiomFalconCandidateSurfaceReviewPacket {
  const reviewUnits = [
    ...AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => buildSurfaceReviewUnit(surface)),
    buildCrossSurfaceReviewUnit(),
    buildGate8ReceiptReviewUnit(),
  ];

  return {
    packetId: `axiom_falcon_candidate_surface_review_packet_from_${receipt.receiptId}`,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_human_review_loop',
    status: 'candidate_surface_review_packet_prepared_not_promoted',
    boundary: AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY,
    sourceReceiptId: receipt.receiptId,
    sourceReceiptStatus: receipt.receiptStatus,
    sourceReceiptRequiredStatus: 'passed_internal_preflight_not_promoted',
    maxCoreReviewUnits: 100,
    reviewUnitCount: reviewUnits.length,
    reviewUnits,
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

export function validateAxiomFalconCandidateSurfaceReviewPacket(
  packet: AxiomFalconCandidateSurfaceReviewPacket,
  sourceReceipt: AxiomGate8PreflightRunnerReceipt,
): AxiomFalconCandidateSurfaceReviewPacketValidation {
  const errors: string[] = [];
  const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
  const receiptValidation = validateAxiomGate8PreflightRunnerReceipt(sourceReceipt, criteriaPacket);
  const reviewUnitSurfaces = packet.reviewUnits
    .filter((unit) => unit.unitType === 'surface_candidate_review')
    .map((unit) => unit.surface);

  pushIf(!receiptValidation.valid, errors, 'source_receipt_must_validate');
  pushIf(
    sourceReceipt.receiptStatus !== 'passed_internal_preflight_not_promoted',
    errors,
    'source_receipt_must_be_passed_internal_preflight_not_promoted',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClass !== 'kernel_human_review_loop',
    errors,
    'core_progress_class_must_remain_human_review_loop',
  );
  pushIf(
    packet.status !== 'candidate_surface_review_packet_prepared_not_promoted',
    errors,
    'status_must_remain_prepared_not_promoted',
  );
  pushIf(
    packet.boundary !== AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_review_input_not_promotion_or_release',
  );
  pushIf(packet.sourceReceiptId !== sourceReceipt.receiptId, errors, 'source_receipt_id_mismatch');
  pushIf(
    packet.sourceReceiptStatus !== sourceReceipt.receiptStatus,
    errors,
    'source_receipt_status_mismatch',
  );
  pushIf(
    packet.sourceReceiptRequiredStatus !== 'passed_internal_preflight_not_promoted',
    errors,
    'source_receipt_required_status_must_remain_passed_not_promoted',
  );
  pushIf(packet.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    packet.reviewUnitCount !== packet.reviewUnits.length,
    errors,
    'review_unit_count_mismatch',
  );
  pushIf(
    packet.reviewUnitCount > packet.maxCoreReviewUnits,
    errors,
    'review_units_must_remain_under_100',
  );
  pushIf(
    packet.reviewExecutionStatus !== 'not_executed' ||
      packet.reviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'review_must_not_be_executed_or_assigned_by_codex',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!reviewUnitSurfaces.includes(surface), errors, `surface_review_unit_missing:${surface}`);
  }

  pushIf(
    !packet.reviewUnits.some((unit) => unit.unitType === 'cross_surface_boundary_review'),
    errors,
    'cross_surface_boundary_review_unit_required',
  );
  pushIf(
    !packet.reviewUnits.some((unit) => unit.unitType === 'gate8_receipt_review'),
    errors,
    'gate8_receipt_review_unit_required',
  );

  for (const unit of packet.reviewUnits) {
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalInspection !== true,
      errors,
      `review_unit_boundary_flags_invalid:${unit.unitId}`,
    );
    for (const decision of [
      'public_boundary_ok_for_candidate_surface_required',
      'source_currentness_review_required',
      'source_support_validity_not_decided',
      'human_review_required_before_candidate_promotion',
      'public_release_requires_separate_founder_approval',
    ] as const) {
      pushIf(
        !unit.requiredDecisions.includes(decision),
        errors,
        `review_unit_required_decision_missing:${unit.unitId}:${decision}`,
      );
    }
    pushIf(
      Object.values(unit.questionSet).some((question) => question.trim().length === 0),
      errors,
      `review_unit_questions_required:${unit.unitId}`,
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
    'review_packet_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY,
    coreProgressClass: 'kernel_human_review_loop',
  };
}
