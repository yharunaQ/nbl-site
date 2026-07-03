import {
  type AxiomCandidateFounderFinalReleaseDecisionHandoffUnit,
  type AxiomFounderFinalReleaseDecisionHandoffOption,
  type AxiomFounderFinalReleaseDecisionHandoffRequirement,
  type AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
} from './siteInternalCandidateFounderFinalReleaseDecisionHandoffManifest';
import {
  type AxiomInternalCandidateFinalPublicReleaseReviewPacket,
  buildAxiomInternalCandidateFinalPublicReleaseReviewPacket,
} from './siteInternalCandidateFinalPublicReleaseReviewPacket';
import {
  type AxiomInternalCandidatePublicNavigationReleaseRouteShell,
  buildAxiomInternalCandidatePublicNavigationReleaseRouteShell,
} from './siteInternalCandidatePublicNavigationReleaseRouteShell';
import {
  type AxiomInternalCandidatePublicReleaseDecisionPacketShell,
  buildAxiomInternalCandidatePublicReleaseDecisionPacketShell,
} from './siteInternalCandidatePublicReleaseDecisionPacketShell';
import {
  type AxiomInternalCandidateSurfacePromotionHandoffManifest,
  buildAxiomInternalCandidateSurfacePromotionHandoffManifest,
} from './siteInternalCandidateSurfacePromotionHandoffManifest';
import {
  type AxiomInternalCandidateSurfacePromotionRequestPacket,
  buildAxiomInternalCandidateSurfacePromotionRequestPacket,
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

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_receipt_shell_is_not_received_review_input_not_founder_decision_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell' as const;

export type AxiomFounderFinalReleaseDecisionReceiptRequirement =
  | 'founder_decision_receipt_required_outside_codex'
  | 'receipt_must_name_release_or_no_release_decision_outside_codex'
  | 'human_review_execution_receipt_required_outside_codex'
  | 'source_support_validity_receipt_required_outside_codex'
  | 'public_navigation_authorization_receipt_required_outside_codex'
  | 'public_approval_publication_receipts_required_outside_codex'
  | 'rollback_correction_no_intake_confirmation_required'
  | 'runtime_and_learning_freeze_must_remain_confirmed';

export type AxiomFounderFinalReleaseDecisionReceiptOption =
  | 'continue_waiting_for_founder_receipt'
  | 'return_to_founder_handoff_revision'
  | 'prepare_founder_receipt_ingestion_after_external_decision'
  | 'prepare_no_receipt_hold_note';

export type AxiomCandidateFounderFinalReleaseDecisionReceiptUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_receipt_shell_input'
    | 'cross_founder_final_release_decision_receipt_shell_input'
    | 'gate8_founder_final_release_decision_receipt_shell_input';
  surface?: AxiomNextNblSiteSurface;
  sourceHandoffUnitId: string;
  sourceHandoffRequirements: AxiomFounderFinalReleaseDecisionHandoffRequirement[];
  sourceHandoffDecisionOptions: AxiomFounderFinalReleaseDecisionHandoffOption[];
  sourceHandoffStatus: 'prepared_not_sent_by_codex';
  sourceFounderDecisionStatus: 'not_decided';
  sourceReviewExecutionStatus: 'not_executed';
  sourceReviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceRouteActivationStatus: 'not_activated';
  sourceActualPublicNavigationStatus: 'not_added';
  sourcePublicApprovalStatus: 'not_approved';
  sourcePublicationStatus: 'not_published';
  requiredReceiptRequirements: AxiomFounderFinalReleaseDecisionReceiptRequirement[];
  receiptOptions: AxiomFounderFinalReleaseDecisionReceiptOption[];
  decisionReceiptStatus: 'not_received';
  founderDecisionStatus: 'not_decided';
  handoffStatus: 'prepared_not_sent_by_codex';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  releaseDecisionStatus: 'not_decided';
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  sourceSupportValidityStatus: 'not_decided';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell = {
  shellId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_ROUTE;
  sourceFounderHandoffManifestId: string;
  sourceFounderHandoffManifestStatus: AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest['status'];
  sourceFounderHandoffManifestRequiredStatus: 'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released';
  shellMode: 'founder_final_release_decision_receipt_shell_not_received_input_only';
  decisionReceiptStatus: 'not_received';
  founderDecisionStatus: 'not_decided';
  handoffStatus: 'prepared_not_sent_by_codex';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  releaseDecisionStatus: 'not_decided';
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  sourceSupportValidityStatus: 'not_decided';
  maxCoreReviewUnits: 100;
  receiptUnitCount: number;
  receiptUnits: AxiomCandidateFounderFinalReleaseDecisionReceiptUnit[];
  nextAllowedMovement: 'founder_receipt_can_be_ingested_only_after_external_decision_outside_codex';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShellValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_REQUIREMENTS: AxiomFounderFinalReleaseDecisionReceiptRequirement[] =
  [
    'founder_decision_receipt_required_outside_codex',
    'receipt_must_name_release_or_no_release_decision_outside_codex',
    'human_review_execution_receipt_required_outside_codex',
    'source_support_validity_receipt_required_outside_codex',
    'public_navigation_authorization_receipt_required_outside_codex',
    'public_approval_publication_receipts_required_outside_codex',
    'rollback_correction_no_intake_confirmation_required',
    'runtime_and_learning_freeze_must_remain_confirmed',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_OPTIONS: AxiomFounderFinalReleaseDecisionReceiptOption[] =
  [
    'continue_waiting_for_founder_receipt',
    'return_to_founder_handoff_revision',
    'prepare_founder_receipt_ingestion_after_external_decision',
    'prepare_no_receipt_hold_note',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function receiptUnitTypeForHandoffUnit(
  handoffUnit: AxiomCandidateFounderFinalReleaseDecisionHandoffUnit,
): AxiomCandidateFounderFinalReleaseDecisionReceiptUnit['unitType'] {
  if (handoffUnit.unitType === 'surface_founder_final_release_decision_handoff_input') {
    return 'surface_founder_final_release_decision_receipt_shell_input';
  }
  if (handoffUnit.unitType === 'cross_founder_final_release_decision_handoff_input') {
    return 'cross_founder_final_release_decision_receipt_shell_input';
  }

  return 'gate8_founder_final_release_decision_receipt_shell_input';
}

function buildReceiptUnit(
  handoffUnit: AxiomCandidateFounderFinalReleaseDecisionHandoffUnit,
): AxiomCandidateFounderFinalReleaseDecisionReceiptUnit {
  return {
    unitId: `axiom_founder_final_release_decision_receipt_shell_${handoffUnit.unitId}`,
    unitType: receiptUnitTypeForHandoffUnit(handoffUnit),
    surface: handoffUnit.surface,
    sourceHandoffUnitId: handoffUnit.unitId,
    sourceHandoffRequirements: [...handoffUnit.requiredHandoffRequirements],
    sourceHandoffDecisionOptions: [...handoffUnit.handoffDecisionOptions],
    sourceHandoffStatus: handoffUnit.handoffStatus,
    sourceFounderDecisionStatus: handoffUnit.founderDecisionStatus,
    sourceReviewExecutionStatus: handoffUnit.reviewExecutionStatus,
    sourceReviewerAssignmentStatus: handoffUnit.reviewerAssignmentStatus,
    sourceRouteActivationStatus: handoffUnit.routeActivationStatus,
    sourceActualPublicNavigationStatus: handoffUnit.actualPublicNavigationStatus,
    sourcePublicApprovalStatus: handoffUnit.publicApprovalStatus,
    sourcePublicationStatus: handoffUnit.publicationStatus,
    requiredReceiptRequirements: [...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_REQUIREMENTS],
    receiptOptions: [...FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_OPTIONS],
    decisionReceiptStatus: 'not_received',
    founderDecisionStatus: 'not_decided',
    handoffStatus: 'prepared_not_sent_by_codex',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    releaseDecisionStatus: 'not_decided',
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    sourceSupportValidityStatus: 'not_decided',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(
  sourceFounderHandoffManifest: AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest = buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(),
): AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell {
  const receiptUnits = sourceFounderHandoffManifest.manifestUnits.map((handoffUnit) =>
    buildReceiptUnit(handoffUnit),
  );

  return {
    shellId: `axiom_internal_candidate_founder_final_release_decision_receipt_shell_from_${sourceFounderHandoffManifest.manifestId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_ROUTE,
    sourceFounderHandoffManifestId: sourceFounderHandoffManifest.manifestId,
    sourceFounderHandoffManifestStatus: sourceFounderHandoffManifest.status,
    sourceFounderHandoffManifestRequiredStatus:
      'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
    shellMode: 'founder_final_release_decision_receipt_shell_not_received_input_only',
    decisionReceiptStatus: 'not_received',
    founderDecisionStatus: 'not_decided',
    handoffStatus: 'prepared_not_sent_by_codex',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    releaseDecisionStatus: 'not_decided',
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    sourceSupportValidityStatus: 'not_decided',
    maxCoreReviewUnits: 100,
    receiptUnitCount: receiptUnits.length,
    receiptUnits,
    nextAllowedMovement:
      'founder_receipt_can_be_ingested_only_after_external_decision_outside_codex',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
  sourceFounderHandoffManifest: AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
  sourceFinalReviewPacket: AxiomInternalCandidateFinalPublicReleaseReviewPacket = buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(),
  sourceNavigationRouteShell: AxiomInternalCandidatePublicNavigationReleaseRouteShell = buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(),
  sourceReleaseDecisionShell: AxiomInternalCandidatePublicReleaseDecisionPacketShell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(),
  sourceSurfaceHandoffManifest: AxiomInternalCandidateSurfacePromotionHandoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(),
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(),
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShellValidation {
  const errors: string[] = [];
  const sourceValidation = validateAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(
    sourceFounderHandoffManifest,
    sourceFinalReviewPacket,
    sourceNavigationRouteShell,
    sourceReleaseDecisionShell,
    sourceSurfaceHandoffManifest,
    sourcePromotionRequestPacket,
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const receiptUnitSurfaces = shell.receiptUnits
    .filter(
      (unit) => unit.unitType === 'surface_founder_final_release_decision_receipt_shell_input',
    )
    .map((unit) => unit.surface);

  pushIf(!sourceValidation.valid, errors, 'source_founder_handoff_manifest_must_validate');
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_review_loop',
  );
  pushIf(
    shell.status !==
      'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
    errors,
    'status_must_remain_prepared_not_received_not_decided_not_released',
  );
  pushIf(
    shell.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_not_received_review_input_not_founder_decision_public_approval_publication_navigation_or_release',
  );
  pushIf(
    shell.route !== AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_receipt_shell',
  );
  pushIf(
    shell.sourceFounderHandoffManifestId !== sourceFounderHandoffManifest.manifestId,
    errors,
    'source_founder_handoff_manifest_id_mismatch',
  );
  pushIf(
    shell.sourceFounderHandoffManifestStatus !== sourceFounderHandoffManifest.status,
    errors,
    'source_founder_handoff_manifest_status_mismatch',
  );
  pushIf(
    shell.sourceFounderHandoffManifestRequiredStatus !==
      'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
    errors,
    'source_founder_handoff_manifest_required_status_must_remain_prepared_not_sent_not_decided_not_released',
  );
  pushIf(
    shell.shellMode !== 'founder_final_release_decision_receipt_shell_not_received_input_only',
    errors,
    'shell_mode_must_be_founder_final_release_decision_receipt_shell_not_received_input_only',
  );
  pushIf(
    shell.decisionReceiptStatus !== 'not_received' ||
      shell.founderDecisionStatus !== 'not_decided' ||
      shell.handoffStatus !== 'prepared_not_sent_by_codex' ||
      shell.reviewExecutionStatus !== 'not_executed' ||
      shell.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      shell.releaseDecisionStatus !== 'not_decided' ||
      shell.routeActivationStatus !== 'not_activated' ||
      shell.actualPublicNavigationStatus !== 'not_added' ||
      shell.publicApprovalStatus !== 'not_approved' ||
      shell.publicationStatus !== 'not_published' ||
      shell.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'shell_must_remain_not_received_undecided_unsent_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(shell.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    shell.receiptUnitCount !== sourceFounderHandoffManifest.manifestUnitCount,
    errors,
    'receipt_unit_count_must_match_founder_handoff_units',
  );
  pushIf(
    shell.receiptUnitCount !== shell.receiptUnits.length,
    errors,
    'receipt_unit_count_mismatch',
  );
  pushIf(
    shell.receiptUnitCount > shell.maxCoreReviewUnits,
    errors,
    'receipt_units_must_remain_under_100',
  );
  pushIf(
    shell.nextAllowedMovement !==
      'founder_receipt_can_be_ingested_only_after_external_decision_outside_codex',
    errors,
    'next_allowed_movement_must_remain_external_founder_receipt_ingestion_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !receiptUnitSurfaces.includes(surface),
      errors,
      `surface_receipt_unit_missing:${surface}`,
    );
  }
  pushIf(
    !shell.receiptUnits.some(
      (unit) => unit.unitType === 'cross_founder_final_release_decision_receipt_shell_input',
    ),
    errors,
    'cross_founder_final_release_decision_receipt_shell_input_missing',
  );
  pushIf(
    !shell.receiptUnits.some(
      (unit) => unit.unitType === 'gate8_founder_final_release_decision_receipt_shell_input',
    ),
    errors,
    'gate8_founder_final_release_decision_receipt_shell_input_missing',
  );

  for (const unit of shell.receiptUnits) {
    const sourceHandoffUnit = sourceFounderHandoffManifest.manifestUnits.find(
      (handoffUnit) => handoffUnit.unitId === unit.sourceHandoffUnitId,
    );

    pushIf(!sourceHandoffUnit, errors, `source_founder_handoff_unit_missing:${unit.unitId}`);
    if (sourceHandoffUnit) {
      pushIf(
        unit.unitType !== receiptUnitTypeForHandoffUnit(sourceHandoffUnit) ||
          unit.surface !== sourceHandoffUnit.surface ||
          unit.sourceHandoffStatus !== sourceHandoffUnit.handoffStatus ||
          unit.sourceFounderDecisionStatus !== sourceHandoffUnit.founderDecisionStatus ||
          unit.sourceReviewExecutionStatus !== sourceHandoffUnit.reviewExecutionStatus ||
          unit.sourceReviewerAssignmentStatus !== sourceHandoffUnit.reviewerAssignmentStatus ||
          unit.sourceRouteActivationStatus !== sourceHandoffUnit.routeActivationStatus ||
          unit.sourceActualPublicNavigationStatus !==
            sourceHandoffUnit.actualPublicNavigationStatus ||
          unit.sourcePublicApprovalStatus !== sourceHandoffUnit.publicApprovalStatus ||
          unit.sourcePublicationStatus !== sourceHandoffUnit.publicationStatus,
        errors,
        `receipt_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceHandoffUnit.requiredHandoffRequirements) {
        pushIf(
          !unit.sourceHandoffRequirements.includes(requirement),
          errors,
          `source_handoff_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const option of sourceHandoffUnit.handoffDecisionOptions) {
        pushIf(
          !unit.sourceHandoffDecisionOptions.includes(option),
          errors,
          `source_handoff_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_REQUIREMENTS) {
      pushIf(
        !unit.requiredReceiptRequirements.includes(requirement),
        errors,
        `receipt_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_OPTIONS) {
      pushIf(
        !unit.receiptOptions.includes(option),
        errors,
        `receipt_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.decisionReceiptStatus !== 'not_received' ||
        unit.founderDecisionStatus !== 'not_decided' ||
        unit.handoffStatus !== 'prepared_not_sent_by_codex' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.releaseDecisionStatus !== 'not_decided' ||
        unit.routeActivationStatus !== 'not_activated' ||
        unit.actualPublicNavigationStatus !== 'not_added' ||
        unit.publicApprovalStatus !== 'not_approved' ||
        unit.publicationStatus !== 'not_published' ||
        unit.sourceSupportValidityStatus !== 'not_decided',
      errors,
      `receipt_unit_must_remain_not_received_undecided_unsent_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `receipt_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

  pushIf(
    shell.movementBoundary.runtime !== 'not_changed' ||
      shell.movementBoundary.prompt !== 'not_changed' ||
      shell.movementBoundary.retrieval !== 'not_changed' ||
      shell.movementBoundary.modelProvider !== 'not_changed' ||
      shell.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    shell.movementBoundary.publicApproval !== 'not_approved' ||
      shell.movementBoundary.publication !== 'not_published' ||
      shell.movementBoundary.publicNavigation !== 'not_added' ||
      shell.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      shell.movementBoundary.sourceValidity !== 'not_decided' ||
      shell.movementBoundary.sourceCurrentness !== 'not_decided' ||
      shell.movementBoundary.supportValidity !== 'not_decided' ||
      shell.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      shell.movementBoundary.runtimeApproved !== 'not_approved' ||
      shell.movementBoundary.publicApproved !== 'not_approved' ||
      shell.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      shell.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'founder_final_release_decision_receipt_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
