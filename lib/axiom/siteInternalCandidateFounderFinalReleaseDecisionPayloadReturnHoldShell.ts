import {
  type AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit,
  type AxiomFounderFinalReleaseDecisionPayloadValidationReceiptOption,
  type AxiomFounderFinalReleaseDecisionPayloadValidationReceiptRequirement,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
} from './siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell';
import {
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
} from './siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import {
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
} from './siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_payload_return_hold_shell_is_empty_payload_return_hold_not_founder_decision_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell' as const;

export type AxiomFounderFinalReleaseDecisionPayloadReturnHoldRequirement =
  | 'empty_payload_rejection_must_remain_visible_before_return'
  | 'external_payload_completion_required_outside_codex'
  | 'validation_receipt_required_before_any_ingestion_retry'
  | 'return_note_must_preserve_required_payload_fields'
  | 'human_review_and_source_support_validity_must_remain_unmoved'
  | 'public_navigation_public_approval_and_publication_must_remain_blocked'
  | 'runtime_prompt_retrieval_model_provider_db_schema_must_remain_unchanged'
  | 'learning_update_must_remain_blocked';

export type AxiomFounderFinalReleaseDecisionPayloadReturnHoldOption =
  | 'return_to_payload_shell_for_external_completion'
  | 'continue_waiting_for_validation_receipt'
  | 'keep_public_release_on_hold'
  | 'prepare_external_payload_completion_note_only';

export type AxiomCandidateFounderFinalReleaseDecisionPayloadReturnHoldUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_payload_return_hold_shell_input'
    | 'cross_founder_final_release_decision_payload_return_hold_shell_input'
    | 'gate8_founder_final_release_decision_payload_return_hold_shell_input';
  surface?: AxiomNextNblSiteSurface;
  sourceValidationReceiptUnitId: string;
  sourceValidationReceiptRequirements: AxiomFounderFinalReleaseDecisionPayloadValidationReceiptRequirement[];
  sourceValidationReceiptOptions: AxiomFounderFinalReleaseDecisionPayloadValidationReceiptOption[];
  sourceValidationReceiptStatus: 'not_received';
  sourceValidationExecutionStatus: 'not_run';
  sourcePayloadValidationStatus: 'not_validated';
  sourceEmptyPayloadDisposition: 'rejected_before_ingestion';
  sourceExternalDecisionPayloadStatus: 'empty';
  sourcePayloadAcceptanceStatus: 'not_accepted';
  sourceIngestionStatus: 'not_ingested';
  requiredReturnHoldRequirements: AxiomFounderFinalReleaseDecisionPayloadReturnHoldRequirement[];
  returnHoldOptions: AxiomFounderFinalReleaseDecisionPayloadReturnHoldOption[];
  returnHoldStatus: 'payload_return_hold_prepared';
  returnTargetStatus: 'external_payload_shell_completion_required';
  validationReceiptStatus: 'not_received';
  validationExecutionStatus: 'not_run';
  payloadValidationStatus: 'not_validated';
  emptyPayloadDisposition: 'rejected_before_ingestion';
  externalDecisionPayloadStatus: 'empty';
  payloadAcceptanceStatus: 'not_accepted';
  ingestionStatus: 'not_ingested';
  decisionReceiptStatus: 'not_received';
  founderDecisionStatus: 'not_decided';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell = {
  shellId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_payload_return_hold_shell_prepared_empty_payload_return_hold_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_ROUTE;
  sourceValidationReceiptShellId: string;
  sourceValidationReceiptShellStatus: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell['status'];
  sourceValidationReceiptShellRequiredStatus: 'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released';
  shellMode: 'founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion';
  returnHoldStatus: 'payload_return_hold_prepared';
  returnTargetStatus: 'external_payload_shell_completion_required';
  validationReceiptStatus: 'not_received';
  validationExecutionStatus: 'not_run';
  payloadValidationStatus: 'not_validated';
  emptyPayloadDisposition: 'rejected_before_ingestion';
  externalDecisionPayloadStatus: 'empty';
  payloadAcceptanceStatus: 'not_accepted';
  ingestionStatus: 'not_ingested';
  decisionReceiptStatus: 'not_received';
  founderDecisionStatus: 'not_decided';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  releaseDecisionStatus: 'not_decided';
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  sourceSupportValidityStatus: 'not_decided';
  maxCoreReviewUnits: 100;
  returnHoldUnitCount: number;
  returnHoldUnits: AxiomCandidateFounderFinalReleaseDecisionPayloadReturnHoldUnit[];
  nextAllowedMovement: 'external_payload_shell_may_be_completed_outside_codex_then_validation_gate_may_be_rebuilt';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_REQUIREMENTS: AxiomFounderFinalReleaseDecisionPayloadReturnHoldRequirement[] =
  [
    'empty_payload_rejection_must_remain_visible_before_return',
    'external_payload_completion_required_outside_codex',
    'validation_receipt_required_before_any_ingestion_retry',
    'return_note_must_preserve_required_payload_fields',
    'human_review_and_source_support_validity_must_remain_unmoved',
    'public_navigation_public_approval_and_publication_must_remain_blocked',
    'runtime_prompt_retrieval_model_provider_db_schema_must_remain_unchanged',
    'learning_update_must_remain_blocked',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_OPTIONS: AxiomFounderFinalReleaseDecisionPayloadReturnHoldOption[] =
  [
    'return_to_payload_shell_for_external_completion',
    'continue_waiting_for_validation_receipt',
    'keep_public_release_on_hold',
    'prepare_external_payload_completion_note_only',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function returnHoldUnitTypeForValidationReceiptUnit(
  receiptUnit: AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadReturnHoldUnit['unitType'] {
  if (
    receiptUnit.unitType ===
    'surface_founder_final_release_decision_payload_validation_receipt_shell_input'
  ) {
    return 'surface_founder_final_release_decision_payload_return_hold_shell_input';
  }
  if (
    receiptUnit.unitType ===
    'cross_founder_final_release_decision_payload_validation_receipt_shell_input'
  ) {
    return 'cross_founder_final_release_decision_payload_return_hold_shell_input';
  }

  return 'gate8_founder_final_release_decision_payload_return_hold_shell_input';
}

function buildReturnHoldUnit(
  receiptUnit: AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadReturnHoldUnit {
  return {
    unitId: `axiom_founder_final_release_decision_payload_return_hold_shell_${receiptUnit.unitId}`,
    unitType: returnHoldUnitTypeForValidationReceiptUnit(receiptUnit),
    surface: receiptUnit.surface,
    sourceValidationReceiptUnitId: receiptUnit.unitId,
    sourceValidationReceiptRequirements: [...receiptUnit.requiredReceiptRequirements],
    sourceValidationReceiptOptions: [...receiptUnit.receiptOptions],
    sourceValidationReceiptStatus: receiptUnit.validationReceiptStatus,
    sourceValidationExecutionStatus: receiptUnit.validationExecutionStatus,
    sourcePayloadValidationStatus: receiptUnit.payloadValidationStatus,
    sourceEmptyPayloadDisposition: receiptUnit.emptyPayloadDisposition,
    sourceExternalDecisionPayloadStatus: receiptUnit.externalDecisionPayloadStatus,
    sourcePayloadAcceptanceStatus: receiptUnit.payloadAcceptanceStatus,
    sourceIngestionStatus: receiptUnit.ingestionStatus,
    requiredReturnHoldRequirements: [
      ...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_REQUIREMENTS,
    ],
    returnHoldOptions: [...FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_OPTIONS],
    returnHoldStatus: 'payload_return_hold_prepared',
    returnTargetStatus: 'external_payload_shell_completion_required',
    validationReceiptStatus: 'not_received',
    validationExecutionStatus: 'not_run',
    payloadValidationStatus: 'not_validated',
    emptyPayloadDisposition: 'rejected_before_ingestion',
    externalDecisionPayloadStatus: 'empty',
    payloadAcceptanceStatus: 'not_accepted',
    ingestionStatus: 'not_ingested',
    decisionReceiptStatus: 'not_received',
    founderDecisionStatus: 'not_decided',
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

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
  sourceValidationReceiptShell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(),
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell {
  const returnHoldUnits = sourceValidationReceiptShell.receiptUnits.map((receiptUnit) =>
    buildReturnHoldUnit(receiptUnit),
  );

  return {
    shellId: `axiom_internal_candidate_founder_final_release_decision_payload_return_hold_shell_from_${sourceValidationReceiptShell.shellId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_payload_return_hold_shell_prepared_empty_payload_return_hold_not_released',
    boundary:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_ROUTE,
    sourceValidationReceiptShellId: sourceValidationReceiptShell.shellId,
    sourceValidationReceiptShellStatus: sourceValidationReceiptShell.status,
    sourceValidationReceiptShellRequiredStatus:
      'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
    shellMode:
      'founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion',
    returnHoldStatus: 'payload_return_hold_prepared',
    returnTargetStatus: 'external_payload_shell_completion_required',
    validationReceiptStatus: 'not_received',
    validationExecutionStatus: 'not_run',
    payloadValidationStatus: 'not_validated',
    emptyPayloadDisposition: 'rejected_before_ingestion',
    externalDecisionPayloadStatus: 'empty',
    payloadAcceptanceStatus: 'not_accepted',
    ingestionStatus: 'not_ingested',
    decisionReceiptStatus: 'not_received',
    founderDecisionStatus: 'not_decided',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    releaseDecisionStatus: 'not_decided',
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    sourceSupportValidityStatus: 'not_decided',
    maxCoreReviewUnits: 100,
    returnHoldUnitCount: returnHoldUnits.length,
    returnHoldUnits,
    nextAllowedMovement:
      'external_payload_shell_may_be_completed_outside_codex_then_validation_gate_may_be_rebuilt',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell,
  sourceValidationReceiptShell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  sourceValidationGate: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(),
  sourcePayloadShell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(),
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellValidation {
  const errors: string[] = [];
  const sourceValidation =
    validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
      sourceValidationReceiptShell,
      sourceValidationGate,
      sourcePayloadShell,
    );
  const returnHoldUnitSurfaces = shell.returnHoldUnits
    .filter(
      (unit) =>
        unit.unitType === 'surface_founder_final_release_decision_payload_return_hold_shell_input',
    )
    .map((unit) => unit.surface);

  pushIf(!sourceValidation.valid, errors, 'source_payload_validation_receipt_shell_must_validate');
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    shell.status !==
      'internal_candidate_founder_final_release_decision_payload_return_hold_shell_prepared_empty_payload_return_hold_not_released',
    errors,
    'status_must_remain_prepared_empty_payload_return_hold_not_released',
  );
  pushIf(
    shell.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_empty_payload_return_hold_not_founder_decision_public_approval_publication_navigation_or_release',
  );
  pushIf(
    shell.route !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_payload_return_hold_shell',
  );
  pushIf(
    shell.sourceValidationReceiptShellId !== sourceValidationReceiptShell.shellId,
    errors,
    'source_validation_receipt_shell_id_mismatch',
  );
  pushIf(
    shell.sourceValidationReceiptShellStatus !== sourceValidationReceiptShell.status,
    errors,
    'source_validation_receipt_shell_status_mismatch',
  );
  pushIf(
    shell.sourceValidationReceiptShellRequiredStatus !==
      'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
    errors,
    'source_validation_receipt_shell_required_status_must_remain_not_received_not_validated_not_released',
  );
  pushIf(
    shell.shellMode !==
      'founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion',
    errors,
    'shell_mode_must_be_founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion',
  );
  pushIf(
    shell.returnHoldStatus !== 'payload_return_hold_prepared' ||
      shell.returnTargetStatus !== 'external_payload_shell_completion_required' ||
      shell.validationReceiptStatus !== 'not_received' ||
      shell.validationExecutionStatus !== 'not_run' ||
      shell.payloadValidationStatus !== 'not_validated' ||
      shell.emptyPayloadDisposition !== 'rejected_before_ingestion' ||
      shell.externalDecisionPayloadStatus !== 'empty' ||
      shell.payloadAcceptanceStatus !== 'not_accepted' ||
      shell.ingestionStatus !== 'not_ingested' ||
      shell.decisionReceiptStatus !== 'not_received' ||
      shell.founderDecisionStatus !== 'not_decided' ||
      shell.reviewExecutionStatus !== 'not_executed' ||
      shell.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      shell.releaseDecisionStatus !== 'not_decided' ||
      shell.routeActivationStatus !== 'not_activated' ||
      shell.actualPublicNavigationStatus !== 'not_added' ||
      shell.publicApprovalStatus !== 'not_approved' ||
      shell.publicationStatus !== 'not_published' ||
      shell.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'shell_must_remain_return_hold_not_received_not_run_not_validated_empty_rejected_not_accepted_not_ingested_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(shell.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    shell.returnHoldUnitCount !== sourceValidationReceiptShell.receiptUnitCount,
    errors,
    'return_hold_unit_count_must_match_validation_receipt_units',
  );
  pushIf(
    shell.returnHoldUnitCount !== shell.returnHoldUnits.length,
    errors,
    'return_hold_unit_count_mismatch',
  );
  pushIf(
    shell.returnHoldUnitCount > shell.maxCoreReviewUnits,
    errors,
    'return_hold_units_must_remain_under_100',
  );
  pushIf(
    shell.nextAllowedMovement !==
      'external_payload_shell_may_be_completed_outside_codex_then_validation_gate_may_be_rebuilt',
    errors,
    'next_allowed_movement_must_remain_external_payload_completion_then_validation_rebuild_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !returnHoldUnitSurfaces.includes(surface),
      errors,
      `surface_payload_return_hold_unit_missing:${surface}`,
    );
  }
  pushIf(
    !shell.returnHoldUnits.some(
      (unit) =>
        unit.unitType === 'cross_founder_final_release_decision_payload_return_hold_shell_input',
    ),
    errors,
    'cross_founder_final_release_decision_payload_return_hold_shell_input_missing',
  );
  pushIf(
    !shell.returnHoldUnits.some(
      (unit) =>
        unit.unitType === 'gate8_founder_final_release_decision_payload_return_hold_shell_input',
    ),
    errors,
    'gate8_founder_final_release_decision_payload_return_hold_shell_input_missing',
  );

  for (const unit of shell.returnHoldUnits) {
    const sourceReceiptUnit = sourceValidationReceiptShell.receiptUnits.find(
      (receiptUnit) => receiptUnit.unitId === unit.sourceValidationReceiptUnitId,
    );

    pushIf(!sourceReceiptUnit, errors, `source_validation_receipt_unit_missing:${unit.unitId}`);
    if (sourceReceiptUnit) {
      pushIf(
        unit.unitType !== returnHoldUnitTypeForValidationReceiptUnit(sourceReceiptUnit) ||
          unit.surface !== sourceReceiptUnit.surface ||
          unit.sourceValidationReceiptStatus !== sourceReceiptUnit.validationReceiptStatus ||
          unit.sourceValidationExecutionStatus !== sourceReceiptUnit.validationExecutionStatus ||
          unit.sourcePayloadValidationStatus !== sourceReceiptUnit.payloadValidationStatus ||
          unit.sourceEmptyPayloadDisposition !== sourceReceiptUnit.emptyPayloadDisposition ||
          unit.sourceExternalDecisionPayloadStatus !==
            sourceReceiptUnit.externalDecisionPayloadStatus ||
          unit.sourcePayloadAcceptanceStatus !== sourceReceiptUnit.payloadAcceptanceStatus ||
          unit.sourceIngestionStatus !== sourceReceiptUnit.ingestionStatus,
        errors,
        `return_hold_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceReceiptUnit.requiredReceiptRequirements) {
        pushIf(
          !unit.sourceValidationReceiptRequirements.includes(requirement),
          errors,
          `source_validation_receipt_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const option of sourceReceiptUnit.receiptOptions) {
        pushIf(
          !unit.sourceValidationReceiptOptions.includes(option),
          errors,
          `source_validation_receipt_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_REQUIREMENTS) {
      pushIf(
        !unit.requiredReturnHoldRequirements.includes(requirement),
        errors,
        `return_hold_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_OPTIONS) {
      pushIf(
        !unit.returnHoldOptions.includes(option),
        errors,
        `return_hold_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.returnHoldStatus !== 'payload_return_hold_prepared' ||
        unit.returnTargetStatus !== 'external_payload_shell_completion_required' ||
        unit.validationReceiptStatus !== 'not_received' ||
        unit.validationExecutionStatus !== 'not_run' ||
        unit.payloadValidationStatus !== 'not_validated' ||
        unit.emptyPayloadDisposition !== 'rejected_before_ingestion' ||
        unit.externalDecisionPayloadStatus !== 'empty' ||
        unit.payloadAcceptanceStatus !== 'not_accepted' ||
        unit.ingestionStatus !== 'not_ingested' ||
        unit.decisionReceiptStatus !== 'not_received' ||
        unit.founderDecisionStatus !== 'not_decided' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.releaseDecisionStatus !== 'not_decided' ||
        unit.routeActivationStatus !== 'not_activated' ||
        unit.actualPublicNavigationStatus !== 'not_added' ||
        unit.publicApprovalStatus !== 'not_approved' ||
        unit.publicationStatus !== 'not_published' ||
        unit.sourceSupportValidityStatus !== 'not_decided',
      errors,
      `return_hold_unit_must_remain_return_hold_not_received_not_run_not_validated_empty_rejected_not_accepted_not_ingested_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `return_hold_unit_boundary_flags_invalid:${unit.unitId}`,
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
    'founder_final_release_decision_payload_return_hold_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
