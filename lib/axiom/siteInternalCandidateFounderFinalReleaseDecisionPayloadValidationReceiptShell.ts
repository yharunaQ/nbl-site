import {
  type AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit,
  type AxiomFounderFinalReleaseDecisionPayloadValidationOption,
  type AxiomFounderFinalReleaseDecisionPayloadValidationRequirement,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
} from './siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';
import {
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
} from './siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_is_not_received_not_validated_not_founder_decision_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell' as const;

export type AxiomFounderFinalReleaseDecisionPayloadValidationReceiptRequirement =
  | 'payload_validation_receipt_required_after_external_payload_validation'
  | 'receipt_must_name_valid_or_invalid_payload_outside_codex'
  | 'empty_payload_rejection_receipt_required_before_return_to_payload_shell'
  | 'human_review_execution_evidence_receipt_required_before_release'
  | 'source_support_validity_receipt_required_before_release'
  | 'public_navigation_authorization_receipt_required_before_release'
  | 'public_approval_publication_receipts_required_before_release'
  | 'runtime_and_learning_freeze_must_remain_confirmed';

export type AxiomFounderFinalReleaseDecisionPayloadValidationReceiptOption =
  | 'continue_waiting_for_validation_receipt'
  | 'return_to_payload_shell_for_external_completion'
  | 'keep_empty_payload_rejected_before_ingestion'
  | 'prepare_ingestion_contract_only_after_valid_external_payload_receipt';

export type AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_payload_validation_receipt_shell_input'
    | 'cross_founder_final_release_decision_payload_validation_receipt_shell_input'
    | 'gate8_founder_final_release_decision_payload_validation_receipt_shell_input';
  surface?: AxiomNextNblSiteSurface;
  sourceValidationUnitId: string;
  sourceValidationRequirements: AxiomFounderFinalReleaseDecisionPayloadValidationRequirement[];
  sourceValidationOptions: AxiomFounderFinalReleaseDecisionPayloadValidationOption[];
  sourceValidationExecutionStatus: 'not_run';
  sourcePayloadValidationStatus: 'not_validated';
  sourceEmptyPayloadDisposition: 'rejected_before_ingestion';
  sourceExternalDecisionPayloadStatus: 'empty';
  sourcePayloadAcceptanceStatus: 'not_accepted';
  sourceIngestionStatus: 'not_ingested';
  requiredReceiptRequirements: AxiomFounderFinalReleaseDecisionPayloadValidationReceiptRequirement[];
  receiptOptions: AxiomFounderFinalReleaseDecisionPayloadValidationReceiptOption[];
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell = {
  shellId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_ROUTE;
  sourceValidationGateId: string;
  sourceValidationGateStatus: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate['status'];
  sourceValidationGateRequiredStatus: 'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released';
  shellMode: 'founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only';
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
  receiptUnitCount: number;
  receiptUnits: AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit[];
  nextAllowedMovement: 'payload_validation_receipt_can_be_ingested_only_after_valid_external_payload_validation_outside_codex';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellValidation =
  {
    valid: boolean;
    validationStatus: 'contract_valid' | 'contract_invalid';
    errorCount: number;
    errors: string[];
    boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY;
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  };

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_REQUIREMENTS: AxiomFounderFinalReleaseDecisionPayloadValidationReceiptRequirement[] =
  [
    'payload_validation_receipt_required_after_external_payload_validation',
    'receipt_must_name_valid_or_invalid_payload_outside_codex',
    'empty_payload_rejection_receipt_required_before_return_to_payload_shell',
    'human_review_execution_evidence_receipt_required_before_release',
    'source_support_validity_receipt_required_before_release',
    'public_navigation_authorization_receipt_required_before_release',
    'public_approval_publication_receipts_required_before_release',
    'runtime_and_learning_freeze_must_remain_confirmed',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_OPTIONS: AxiomFounderFinalReleaseDecisionPayloadValidationReceiptOption[] =
  [
    'continue_waiting_for_validation_receipt',
    'return_to_payload_shell_for_external_completion',
    'keep_empty_payload_rejected_before_ingestion',
    'prepare_ingestion_contract_only_after_valid_external_payload_receipt',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function receiptUnitTypeForValidationUnit(
  validationUnit: AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit['unitType'] {
  if (
    validationUnit.unitType ===
    'surface_founder_final_release_decision_payload_validation_gate_input'
  ) {
    return 'surface_founder_final_release_decision_payload_validation_receipt_shell_input';
  }
  if (
    validationUnit.unitType === 'cross_founder_final_release_decision_payload_validation_gate_input'
  ) {
    return 'cross_founder_final_release_decision_payload_validation_receipt_shell_input';
  }

  return 'gate8_founder_final_release_decision_payload_validation_receipt_shell_input';
}

function buildReceiptUnit(
  validationUnit: AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptUnit {
  return {
    unitId: `axiom_founder_final_release_decision_payload_validation_receipt_shell_${validationUnit.unitId}`,
    unitType: receiptUnitTypeForValidationUnit(validationUnit),
    surface: validationUnit.surface,
    sourceValidationUnitId: validationUnit.unitId,
    sourceValidationRequirements: [...validationUnit.requiredValidationRequirements],
    sourceValidationOptions: [...validationUnit.validationOptions],
    sourceValidationExecutionStatus: validationUnit.validationExecutionStatus,
    sourcePayloadValidationStatus: validationUnit.payloadValidationStatus,
    sourceEmptyPayloadDisposition: validationUnit.emptyPayloadDisposition,
    sourceExternalDecisionPayloadStatus: validationUnit.externalDecisionPayloadStatus,
    sourcePayloadAcceptanceStatus: validationUnit.payloadAcceptanceStatus,
    sourceIngestionStatus: validationUnit.ingestionStatus,
    requiredReceiptRequirements: [
      ...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_REQUIREMENTS,
    ],
    receiptOptions: [...FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_OPTIONS],
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

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
  sourceValidationGate: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(),
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell {
  const receiptUnits = sourceValidationGate.validationUnits.map((validationUnit) =>
    buildReceiptUnit(validationUnit),
  );

  return {
    shellId: `axiom_internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_from_${sourceValidationGate.gateId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
    boundary:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY,
    route:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_ROUTE,
    sourceValidationGateId: sourceValidationGate.gateId,
    sourceValidationGateStatus: sourceValidationGate.status,
    sourceValidationGateRequiredStatus:
      'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
    shellMode:
      'founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only',
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
    receiptUnitCount: receiptUnits.length,
    receiptUnits,
    nextAllowedMovement:
      'payload_validation_receipt_can_be_ingested_only_after_valid_external_payload_validation_outside_codex',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  sourceValidationGate: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  sourcePayloadShell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(),
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellValidation {
  const errors: string[] = [];
  const sourceValidation =
    validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(
      sourceValidationGate,
      sourcePayloadShell,
    );
  const receiptUnitSurfaces = shell.receiptUnits
    .filter(
      (unit) =>
        unit.unitType ===
        'surface_founder_final_release_decision_payload_validation_receipt_shell_input',
    )
    .map((unit) => unit.surface);

  pushIf(!sourceValidation.valid, errors, 'source_payload_validation_gate_must_validate');
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    shell.status !==
      'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
    errors,
    'status_must_remain_prepared_not_received_not_validated_not_released',
  );
  pushIf(
    shell.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_not_received_not_validated_not_founder_decision_public_approval_publication_navigation_or_release',
  );
  pushIf(
    shell.route !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_payload_validation_receipt_shell',
  );
  pushIf(
    shell.sourceValidationGateId !== sourceValidationGate.gateId,
    errors,
    'source_validation_gate_id_mismatch',
  );
  pushIf(
    shell.sourceValidationGateStatus !== sourceValidationGate.status,
    errors,
    'source_validation_gate_status_mismatch',
  );
  pushIf(
    shell.sourceValidationGateRequiredStatus !==
      'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
    errors,
    'source_validation_gate_required_status_must_remain_not_run_empty_payload_rejected_not_released',
  );
  pushIf(
    shell.shellMode !==
      'founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only',
    errors,
    'shell_mode_must_be_founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only',
  );
  pushIf(
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
    'shell_must_remain_not_received_not_run_not_validated_empty_rejected_not_accepted_not_ingested_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(shell.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    shell.receiptUnitCount !== sourceValidationGate.validationUnitCount,
    errors,
    'validation_receipt_unit_count_must_match_validation_units',
  );
  pushIf(
    shell.receiptUnitCount !== shell.receiptUnits.length,
    errors,
    'validation_receipt_unit_count_mismatch',
  );
  pushIf(
    shell.receiptUnitCount > shell.maxCoreReviewUnits,
    errors,
    'validation_receipt_units_must_remain_under_100',
  );
  pushIf(
    shell.nextAllowedMovement !==
      'payload_validation_receipt_can_be_ingested_only_after_valid_external_payload_validation_outside_codex',
    errors,
    'next_allowed_movement_must_remain_valid_external_payload_validation_receipt_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !receiptUnitSurfaces.includes(surface),
      errors,
      `surface_payload_validation_receipt_unit_missing:${surface}`,
    );
  }
  pushIf(
    !shell.receiptUnits.some(
      (unit) =>
        unit.unitType ===
        'cross_founder_final_release_decision_payload_validation_receipt_shell_input',
    ),
    errors,
    'cross_founder_final_release_decision_payload_validation_receipt_shell_input_missing',
  );
  pushIf(
    !shell.receiptUnits.some(
      (unit) =>
        unit.unitType ===
        'gate8_founder_final_release_decision_payload_validation_receipt_shell_input',
    ),
    errors,
    'gate8_founder_final_release_decision_payload_validation_receipt_shell_input_missing',
  );

  for (const unit of shell.receiptUnits) {
    const sourceValidationUnit = sourceValidationGate.validationUnits.find(
      (validationUnit) => validationUnit.unitId === unit.sourceValidationUnitId,
    );

    pushIf(!sourceValidationUnit, errors, `source_validation_unit_missing:${unit.unitId}`);
    if (sourceValidationUnit) {
      pushIf(
        unit.unitType !== receiptUnitTypeForValidationUnit(sourceValidationUnit) ||
          unit.surface !== sourceValidationUnit.surface ||
          unit.sourceValidationExecutionStatus !== sourceValidationUnit.validationExecutionStatus ||
          unit.sourcePayloadValidationStatus !== sourceValidationUnit.payloadValidationStatus ||
          unit.sourceEmptyPayloadDisposition !== sourceValidationUnit.emptyPayloadDisposition ||
          unit.sourceExternalDecisionPayloadStatus !==
            sourceValidationUnit.externalDecisionPayloadStatus ||
          unit.sourcePayloadAcceptanceStatus !== sourceValidationUnit.payloadAcceptanceStatus ||
          unit.sourceIngestionStatus !== sourceValidationUnit.ingestionStatus,
        errors,
        `validation_receipt_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceValidationUnit.requiredValidationRequirements) {
        pushIf(
          !unit.sourceValidationRequirements.includes(requirement),
          errors,
          `source_validation_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const option of sourceValidationUnit.validationOptions) {
        pushIf(
          !unit.sourceValidationOptions.includes(option),
          errors,
          `source_validation_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_REQUIREMENTS) {
      pushIf(
        !unit.requiredReceiptRequirements.includes(requirement),
        errors,
        `validation_receipt_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_OPTIONS) {
      pushIf(
        !unit.receiptOptions.includes(option),
        errors,
        `validation_receipt_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
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
      `validation_receipt_unit_must_remain_not_received_not_run_not_validated_empty_rejected_not_accepted_not_ingested_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `validation_receipt_unit_boundary_flags_invalid:${unit.unitId}`,
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
    'founder_final_release_decision_payload_validation_receipt_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
