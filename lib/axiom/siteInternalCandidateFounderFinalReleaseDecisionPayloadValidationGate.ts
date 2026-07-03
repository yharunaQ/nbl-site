import {
  type AxiomCandidateFounderFinalReleaseDecisionPayloadUnit,
  type AxiomFounderFinalReleaseDecisionPayloadFieldId,
  type AxiomFounderFinalReleaseDecisionPayloadRequirement,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
} from './siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_payload_validation_gate_is_not_run_empty_payload_rejected_not_founder_decision_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate' as const;

export type AxiomFounderFinalReleaseDecisionPayloadValidationRequirement =
  | 'payload_fields_must_be_non_empty_before_validation'
  | 'release_or_no_release_must_be_declared_before_validation'
  | 'human_review_execution_evidence_must_be_present_before_validation'
  | 'source_support_validity_evidence_must_be_present_before_validation'
  | 'public_navigation_authorization_must_be_present_before_validation'
  | 'public_approval_publication_evidence_must_be_present_before_validation'
  | 'rollback_correction_no_intake_confirmation_must_be_present_before_validation'
  | 'runtime_learning_freeze_confirmation_must_be_present_before_validation';

export type AxiomFounderFinalReleaseDecisionPayloadValidationOption =
  | 'keep_validation_gate_not_run_until_external_payload'
  | 'reject_empty_payload_before_ingestion'
  | 'return_to_payload_shell_for_external_completion'
  | 'prepare_validation_after_external_payload_arrives';

export type AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_payload_validation_gate_input'
    | 'cross_founder_final_release_decision_payload_validation_gate_input'
    | 'gate8_founder_final_release_decision_payload_validation_gate_input';
  surface?: AxiomNextNblSiteSurface;
  sourcePayloadUnitId: string;
  sourcePayloadRequirements: AxiomFounderFinalReleaseDecisionPayloadRequirement[];
  sourcePayloadFieldIds: AxiomFounderFinalReleaseDecisionPayloadFieldId[];
  sourcePayloadSchemaStatus: 'declared_empty_fixture';
  sourceExternalDecisionPayloadStatus: 'empty';
  sourcePayloadAcceptanceStatus: 'not_accepted';
  sourceIngestionStatus: 'not_ingested';
  requiredValidationRequirements: AxiomFounderFinalReleaseDecisionPayloadValidationRequirement[];
  validationOptions: AxiomFounderFinalReleaseDecisionPayloadValidationOption[];
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate = {
  gateId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_ROUTE;
  sourcePayloadShellId: string;
  sourcePayloadShellStatus: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell['status'];
  sourcePayloadShellRequiredStatus: 'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released';
  gateMode: 'founder_final_release_decision_payload_validation_gate_empty_payload_rejected';
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
  validationUnitCount: number;
  validationUnits: AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit[];
  nextAllowedMovement: 'payload_validation_can_run_only_after_external_payload_arrives_outside_codex';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGateValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_REQUIREMENTS: AxiomFounderFinalReleaseDecisionPayloadValidationRequirement[] =
  [
    'payload_fields_must_be_non_empty_before_validation',
    'release_or_no_release_must_be_declared_before_validation',
    'human_review_execution_evidence_must_be_present_before_validation',
    'source_support_validity_evidence_must_be_present_before_validation',
    'public_navigation_authorization_must_be_present_before_validation',
    'public_approval_publication_evidence_must_be_present_before_validation',
    'rollback_correction_no_intake_confirmation_must_be_present_before_validation',
    'runtime_learning_freeze_confirmation_must_be_present_before_validation',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_OPTIONS: AxiomFounderFinalReleaseDecisionPayloadValidationOption[] =
  [
    'keep_validation_gate_not_run_until_external_payload',
    'reject_empty_payload_before_ingestion',
    'return_to_payload_shell_for_external_completion',
    'prepare_validation_after_external_payload_arrives',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function validationUnitTypeForPayloadUnit(
  payloadUnit: AxiomCandidateFounderFinalReleaseDecisionPayloadUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit['unitType'] {
  if (payloadUnit.unitType === 'surface_founder_final_release_decision_payload_shell_input') {
    return 'surface_founder_final_release_decision_payload_validation_gate_input';
  }
  if (payloadUnit.unitType === 'cross_founder_final_release_decision_payload_shell_input') {
    return 'cross_founder_final_release_decision_payload_validation_gate_input';
  }

  return 'gate8_founder_final_release_decision_payload_validation_gate_input';
}

function buildValidationUnit(
  payloadUnit: AxiomCandidateFounderFinalReleaseDecisionPayloadUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadValidationUnit {
  return {
    unitId: `axiom_founder_final_release_decision_payload_validation_gate_${payloadUnit.unitId}`,
    unitType: validationUnitTypeForPayloadUnit(payloadUnit),
    surface: payloadUnit.surface,
    sourcePayloadUnitId: payloadUnit.unitId,
    sourcePayloadRequirements: [...payloadUnit.requiredPayloadRequirements],
    sourcePayloadFieldIds: payloadUnit.payloadFields.map((field) => field.fieldId),
    sourcePayloadSchemaStatus: payloadUnit.payloadSchemaStatus,
    sourceExternalDecisionPayloadStatus: payloadUnit.externalDecisionPayloadStatus,
    sourcePayloadAcceptanceStatus: payloadUnit.payloadAcceptanceStatus,
    sourceIngestionStatus: payloadUnit.ingestionStatus,
    requiredValidationRequirements: [
      ...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_REQUIREMENTS,
    ],
    validationOptions: [...FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_OPTIONS],
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

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(
  sourcePayloadShell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(),
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate {
  const validationUnits = sourcePayloadShell.payloadUnits.map((payloadUnit) =>
    buildValidationUnit(payloadUnit),
  );

  return {
    gateId: `axiom_internal_candidate_founder_final_release_decision_payload_validation_gate_from_${sourcePayloadShell.shellId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
    boundary:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_ROUTE,
    sourcePayloadShellId: sourcePayloadShell.shellId,
    sourcePayloadShellStatus: sourcePayloadShell.status,
    sourcePayloadShellRequiredStatus:
      'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
    gateMode: 'founder_final_release_decision_payload_validation_gate_empty_payload_rejected',
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
    validationUnitCount: validationUnits.length,
    validationUnits,
    nextAllowedMovement:
      'payload_validation_can_run_only_after_external_payload_arrives_outside_codex',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(
  gate: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  sourcePayloadShell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGateValidation {
  const errors: string[] = [];
  const validationUnitSurfaces = gate.validationUnits
    .filter(
      (unit) =>
        unit.unitType === 'surface_founder_final_release_decision_payload_validation_gate_input',
    )
    .map((unit) => unit.surface);

  pushIf(
    sourcePayloadShell.externalDecisionPayloadStatus !== 'empty',
    errors,
    'source_payload_shell_must_remain_empty',
  );
  pushIf(
    sourcePayloadShell.payloadAcceptanceStatus !== 'not_accepted',
    errors,
    'source_payload_shell_must_not_be_accepted',
  );
  pushIf(gate.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    gate.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    gate.status !==
      'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
    errors,
    'status_must_remain_prepared_not_run_empty_payload_rejected_not_released',
  );
  pushIf(
    gate.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY,
    errors,
    'boundary_must_remain_not_run_empty_payload_rejected_not_founder_decision_public_approval_publication_navigation_or_release',
  );
  pushIf(
    gate.route !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_payload_validation_gate',
  );
  pushIf(
    gate.sourcePayloadShellId !== sourcePayloadShell.shellId,
    errors,
    'source_payload_shell_id_mismatch',
  );
  pushIf(
    gate.sourcePayloadShellStatus !== sourcePayloadShell.status,
    errors,
    'source_payload_shell_status_mismatch',
  );
  pushIf(
    gate.sourcePayloadShellRequiredStatus !==
      'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
    errors,
    'source_payload_shell_required_status_must_remain_prepared_empty_not_received_not_ingested_not_released',
  );
  pushIf(
    gate.gateMode !==
      'founder_final_release_decision_payload_validation_gate_empty_payload_rejected',
    errors,
    'gate_mode_must_be_founder_final_release_decision_payload_validation_gate_empty_payload_rejected',
  );
  pushIf(
    gate.validationExecutionStatus !== 'not_run' ||
      gate.payloadValidationStatus !== 'not_validated' ||
      gate.emptyPayloadDisposition !== 'rejected_before_ingestion' ||
      gate.externalDecisionPayloadStatus !== 'empty' ||
      gate.payloadAcceptanceStatus !== 'not_accepted' ||
      gate.ingestionStatus !== 'not_ingested' ||
      gate.decisionReceiptStatus !== 'not_received' ||
      gate.founderDecisionStatus !== 'not_decided' ||
      gate.reviewExecutionStatus !== 'not_executed' ||
      gate.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      gate.releaseDecisionStatus !== 'not_decided' ||
      gate.routeActivationStatus !== 'not_activated' ||
      gate.actualPublicNavigationStatus !== 'not_added' ||
      gate.publicApprovalStatus !== 'not_approved' ||
      gate.publicationStatus !== 'not_published' ||
      gate.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'payload_validation_gate_must_remain_not_run_not_validated_empty_rejected_not_accepted_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(gate.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    gate.validationUnitCount !== sourcePayloadShell.payloadUnitCount,
    errors,
    'validation_unit_count_must_match_payload_units',
  );
  pushIf(
    gate.validationUnitCount !== gate.validationUnits.length,
    errors,
    'validation_unit_count_mismatch',
  );
  pushIf(
    gate.validationUnitCount > gate.maxCoreReviewUnits,
    errors,
    'validation_units_must_remain_under_100',
  );
  pushIf(
    gate.nextAllowedMovement !==
      'payload_validation_can_run_only_after_external_payload_arrives_outside_codex',
    errors,
    'next_allowed_movement_must_remain_external_payload_validation_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !validationUnitSurfaces.includes(surface),
      errors,
      `surface_validation_unit_missing:${surface}`,
    );
  }
  pushIf(
    !gate.validationUnits.some(
      (unit) =>
        unit.unitType === 'cross_founder_final_release_decision_payload_validation_gate_input',
    ),
    errors,
    'cross_founder_final_release_decision_payload_validation_gate_input_missing',
  );
  pushIf(
    !gate.validationUnits.some(
      (unit) =>
        unit.unitType === 'gate8_founder_final_release_decision_payload_validation_gate_input',
    ),
    errors,
    'gate8_founder_final_release_decision_payload_validation_gate_input_missing',
  );

  for (const unit of gate.validationUnits) {
    const sourcePayloadUnit = sourcePayloadShell.payloadUnits.find(
      (payloadUnit) => payloadUnit.unitId === unit.sourcePayloadUnitId,
    );

    pushIf(!sourcePayloadUnit, errors, `source_payload_unit_missing:${unit.unitId}`);
    if (sourcePayloadUnit) {
      pushIf(
        unit.unitType !== validationUnitTypeForPayloadUnit(sourcePayloadUnit) ||
          unit.surface !== sourcePayloadUnit.surface ||
          unit.sourcePayloadSchemaStatus !== sourcePayloadUnit.payloadSchemaStatus ||
          unit.sourceExternalDecisionPayloadStatus !==
            sourcePayloadUnit.externalDecisionPayloadStatus ||
          unit.sourcePayloadAcceptanceStatus !== sourcePayloadUnit.payloadAcceptanceStatus ||
          unit.sourceIngestionStatus !== sourcePayloadUnit.ingestionStatus,
        errors,
        `validation_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourcePayloadUnit.requiredPayloadRequirements) {
        pushIf(
          !unit.sourcePayloadRequirements.includes(requirement),
          errors,
          `source_payload_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const field of sourcePayloadUnit.payloadFields) {
        pushIf(
          !unit.sourcePayloadFieldIds.includes(field.fieldId),
          errors,
          `source_payload_field_missing:${unit.unitId}:${field.fieldId}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_REQUIREMENTS) {
      pushIf(
        !unit.requiredValidationRequirements.includes(requirement),
        errors,
        `validation_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_OPTIONS) {
      pushIf(
        !unit.validationOptions.includes(option),
        errors,
        `validation_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
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
      `validation_unit_must_remain_not_run_not_validated_empty_rejected_not_accepted_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `validation_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

  pushIf(
    gate.movementBoundary.runtime !== 'not_changed' ||
      gate.movementBoundary.prompt !== 'not_changed' ||
      gate.movementBoundary.retrieval !== 'not_changed' ||
      gate.movementBoundary.modelProvider !== 'not_changed' ||
      gate.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    gate.movementBoundary.publicApproval !== 'not_approved' ||
      gate.movementBoundary.publication !== 'not_published' ||
      gate.movementBoundary.publicNavigation !== 'not_added' ||
      gate.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      gate.movementBoundary.sourceValidity !== 'not_decided' ||
      gate.movementBoundary.sourceCurrentness !== 'not_decided' ||
      gate.movementBoundary.supportValidity !== 'not_decided' ||
      gate.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      gate.movementBoundary.runtimeApproved !== 'not_approved' ||
      gate.movementBoundary.publicApproved !== 'not_approved' ||
      gate.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      gate.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'founder_final_release_decision_payload_validation_gate_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary:
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
