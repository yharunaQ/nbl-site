import {
  type AxiomCandidateFounderFinalReleaseDecisionIngestionUnit,
  type AxiomFounderFinalReleaseDecisionIngestionRequirement,
  type AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
} from './siteInternalCandidateFounderFinalReleaseDecisionIngestionContract';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_payload_shell_is_empty_schema_fixture_not_founder_decision_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell' as const;

export type AxiomFounderFinalReleaseDecisionPayloadRequirement =
  | 'external_founder_decision_payload_must_be_supplied_outside_codex'
  | 'payload_must_declare_release_or_no_release'
  | 'payload_must_reference_human_review_execution_evidence'
  | 'payload_must_reference_source_support_validity_evidence'
  | 'payload_must_reference_public_navigation_authorization'
  | 'payload_must_reference_public_approval_publication_evidence'
  | 'payload_must_confirm_rollback_correction_no_intake_boundary'
  | 'payload_must_confirm_runtime_and_learning_freeze';

export type AxiomFounderFinalReleaseDecisionPayloadFieldId =
  | 'founderDecision'
  | 'releaseDecision'
  | 'humanReviewExecutionEvidence'
  | 'sourceSupportValidityEvidence'
  | 'publicNavigationAuthorization'
  | 'publicApprovalPublicationEvidence'
  | 'rollbackCorrectionNoIntakeConfirmation'
  | 'runtimeLearningFreezeConfirmation';

export type AxiomFounderFinalReleaseDecisionPayloadOption =
  | 'keep_payload_empty_until_external_founder_decision'
  | 'reject_payload_missing_release_or_no_release'
  | 'reject_payload_without_review_and_validity_evidence'
  | 'prepare_ingestion_only_after_payload_validation';

export type AxiomFounderFinalReleaseDecisionPayloadField = {
  fieldId: AxiomFounderFinalReleaseDecisionPayloadFieldId;
  valueStatus: 'empty';
  acceptedStatus: 'not_accepted';
  requiredBeforeIngestion: true;
};

export type AxiomCandidateFounderFinalReleaseDecisionPayloadUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_payload_shell_input'
    | 'cross_founder_final_release_decision_payload_shell_input'
    | 'gate8_founder_final_release_decision_payload_shell_input';
  surface?: AxiomNextNblSiteSurface;
  sourceIngestionUnitId: string;
  sourceIngestionRequirements: AxiomFounderFinalReleaseDecisionIngestionRequirement[];
  sourceExternalDecisionPayloadStatus: 'empty';
  sourceIngestionStatus: 'not_ingested';
  sourceDecisionReceiptStatus: 'not_received';
  sourceFounderDecisionStatus: 'not_decided';
  sourceReviewExecutionStatus: 'not_executed';
  sourceReviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceRouteActivationStatus: 'not_activated';
  sourceActualPublicNavigationStatus: 'not_added';
  sourcePublicApprovalStatus: 'not_approved';
  sourcePublicationStatus: 'not_published';
  requiredPayloadRequirements: AxiomFounderFinalReleaseDecisionPayloadRequirement[];
  payloadFields: AxiomFounderFinalReleaseDecisionPayloadField[];
  payloadOptions: AxiomFounderFinalReleaseDecisionPayloadOption[];
  payloadSchemaStatus: 'declared_empty_fixture';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell = {
  shellId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_ROUTE;
  sourceIngestionContractId: string;
  sourceIngestionContractStatus: AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract['status'];
  sourceIngestionContractRequiredStatus: 'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released';
  shellMode: 'founder_final_release_decision_payload_shell_empty_fixture_only';
  payloadSchemaStatus: 'declared_empty_fixture';
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
  payloadUnitCount: number;
  payloadUnits: AxiomCandidateFounderFinalReleaseDecisionPayloadUnit[];
  nextAllowedMovement: 'external_founder_payload_may_be_filled_only_after_founder_decision_outside_codex';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShellValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_REQUIREMENTS: AxiomFounderFinalReleaseDecisionPayloadRequirement[] =
  [
    'external_founder_decision_payload_must_be_supplied_outside_codex',
    'payload_must_declare_release_or_no_release',
    'payload_must_reference_human_review_execution_evidence',
    'payload_must_reference_source_support_validity_evidence',
    'payload_must_reference_public_navigation_authorization',
    'payload_must_reference_public_approval_publication_evidence',
    'payload_must_confirm_rollback_correction_no_intake_boundary',
    'payload_must_confirm_runtime_and_learning_freeze',
  ];

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_FIELD_IDS: AxiomFounderFinalReleaseDecisionPayloadFieldId[] =
  [
    'founderDecision',
    'releaseDecision',
    'humanReviewExecutionEvidence',
    'sourceSupportValidityEvidence',
    'publicNavigationAuthorization',
    'publicApprovalPublicationEvidence',
    'rollbackCorrectionNoIntakeConfirmation',
    'runtimeLearningFreezeConfirmation',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_OPTIONS: AxiomFounderFinalReleaseDecisionPayloadOption[] =
  [
    'keep_payload_empty_until_external_founder_decision',
    'reject_payload_missing_release_or_no_release',
    'reject_payload_without_review_and_validity_evidence',
    'prepare_ingestion_only_after_payload_validation',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function payloadUnitTypeForIngestionUnit(
  ingestionUnit: AxiomCandidateFounderFinalReleaseDecisionIngestionUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadUnit['unitType'] {
  if (
    ingestionUnit.unitType === 'surface_founder_final_release_decision_ingestion_contract_input'
  ) {
    return 'surface_founder_final_release_decision_payload_shell_input';
  }
  if (ingestionUnit.unitType === 'cross_founder_final_release_decision_ingestion_contract_input') {
    return 'cross_founder_final_release_decision_payload_shell_input';
  }

  return 'gate8_founder_final_release_decision_payload_shell_input';
}

function buildPayloadFields(): AxiomFounderFinalReleaseDecisionPayloadField[] {
  return AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_FIELD_IDS.map((fieldId) => ({
    fieldId,
    valueStatus: 'empty',
    acceptedStatus: 'not_accepted',
    requiredBeforeIngestion: true,
  }));
}

function buildPayloadUnit(
  ingestionUnit: AxiomCandidateFounderFinalReleaseDecisionIngestionUnit,
): AxiomCandidateFounderFinalReleaseDecisionPayloadUnit {
  return {
    unitId: `axiom_founder_final_release_decision_payload_shell_${ingestionUnit.unitId}`,
    unitType: payloadUnitTypeForIngestionUnit(ingestionUnit),
    surface: ingestionUnit.surface,
    sourceIngestionUnitId: ingestionUnit.unitId,
    sourceIngestionRequirements: [...ingestionUnit.requiredIngestionRequirements],
    sourceExternalDecisionPayloadStatus: ingestionUnit.externalDecisionPayloadStatus,
    sourceIngestionStatus: ingestionUnit.ingestionStatus,
    sourceDecisionReceiptStatus: ingestionUnit.decisionReceiptStatus,
    sourceFounderDecisionStatus: ingestionUnit.founderDecisionStatus,
    sourceReviewExecutionStatus: ingestionUnit.reviewExecutionStatus,
    sourceReviewerAssignmentStatus: ingestionUnit.reviewerAssignmentStatus,
    sourceRouteActivationStatus: ingestionUnit.routeActivationStatus,
    sourceActualPublicNavigationStatus: ingestionUnit.actualPublicNavigationStatus,
    sourcePublicApprovalStatus: ingestionUnit.publicApprovalStatus,
    sourcePublicationStatus: ingestionUnit.publicationStatus,
    requiredPayloadRequirements: [...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_REQUIREMENTS],
    payloadFields: buildPayloadFields(),
    payloadOptions: [...FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_OPTIONS],
    payloadSchemaStatus: 'declared_empty_fixture',
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

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(
  sourceIngestionContract: AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract = buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(),
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell {
  const payloadUnits = sourceIngestionContract.ingestionUnits.map((ingestionUnit) =>
    buildPayloadUnit(ingestionUnit),
  );

  return {
    shellId: `axiom_internal_candidate_founder_final_release_decision_payload_shell_from_${sourceIngestionContract.contractId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_ROUTE,
    sourceIngestionContractId: sourceIngestionContract.contractId,
    sourceIngestionContractStatus: sourceIngestionContract.status,
    sourceIngestionContractRequiredStatus:
      'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
    shellMode: 'founder_final_release_decision_payload_shell_empty_fixture_only',
    payloadSchemaStatus: 'declared_empty_fixture',
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
    payloadUnitCount: payloadUnits.length,
    payloadUnits,
    nextAllowedMovement:
      'external_founder_payload_may_be_filled_only_after_founder_decision_outside_codex',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
  sourceIngestionContract: AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShellValidation {
  const errors: string[] = [];
  const payloadUnitSurfaces = shell.payloadUnits
    .filter(
      (unit) => unit.unitType === 'surface_founder_final_release_decision_payload_shell_input',
    )
    .map((unit) => unit.surface);

  pushIf(
    sourceIngestionContract.externalDecisionPayloadStatus !== 'empty',
    errors,
    'source_ingestion_contract_payload_must_remain_empty',
  );
  pushIf(
    sourceIngestionContract.ingestionStatus !== 'not_ingested',
    errors,
    'source_ingestion_contract_must_not_be_ingested',
  );
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    shell.status !==
      'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
    errors,
    'status_must_remain_prepared_empty_not_received_not_ingested_not_released',
  );
  pushIf(
    shell.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_empty_schema_fixture_not_founder_decision_public_approval_publication_navigation_or_release',
  );
  pushIf(
    shell.route !== AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_payload_shell',
  );
  pushIf(
    shell.sourceIngestionContractId !== sourceIngestionContract.contractId,
    errors,
    'source_ingestion_contract_id_mismatch',
  );
  pushIf(
    shell.sourceIngestionContractStatus !== sourceIngestionContract.status,
    errors,
    'source_ingestion_contract_status_mismatch',
  );
  pushIf(
    shell.sourceIngestionContractRequiredStatus !==
      'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
    errors,
    'source_ingestion_contract_required_status_must_remain_prepared_empty_not_ingested_not_released',
  );
  pushIf(
    shell.shellMode !== 'founder_final_release_decision_payload_shell_empty_fixture_only',
    errors,
    'shell_mode_must_be_founder_final_release_decision_payload_shell_empty_fixture_only',
  );
  pushIf(
    shell.payloadSchemaStatus !== 'declared_empty_fixture' ||
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
    'payload_shell_must_remain_empty_not_accepted_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(shell.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    shell.payloadUnitCount !== sourceIngestionContract.ingestionUnitCount,
    errors,
    'payload_unit_count_must_match_ingestion_units',
  );
  pushIf(
    shell.payloadUnitCount !== shell.payloadUnits.length,
    errors,
    'payload_unit_count_mismatch',
  );
  pushIf(
    shell.payloadUnitCount > shell.maxCoreReviewUnits,
    errors,
    'payload_units_must_remain_under_100',
  );
  pushIf(
    shell.nextAllowedMovement !==
      'external_founder_payload_may_be_filled_only_after_founder_decision_outside_codex',
    errors,
    'next_allowed_movement_must_remain_external_founder_payload_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !payloadUnitSurfaces.includes(surface),
      errors,
      `surface_payload_unit_missing:${surface}`,
    );
  }
  pushIf(
    !shell.payloadUnits.some(
      (unit) => unit.unitType === 'cross_founder_final_release_decision_payload_shell_input',
    ),
    errors,
    'cross_founder_final_release_decision_payload_shell_input_missing',
  );
  pushIf(
    !shell.payloadUnits.some(
      (unit) => unit.unitType === 'gate8_founder_final_release_decision_payload_shell_input',
    ),
    errors,
    'gate8_founder_final_release_decision_payload_shell_input_missing',
  );

  for (const unit of shell.payloadUnits) {
    const sourceIngestionUnit = sourceIngestionContract.ingestionUnits.find(
      (ingestionUnit) => ingestionUnit.unitId === unit.sourceIngestionUnitId,
    );

    pushIf(!sourceIngestionUnit, errors, `source_ingestion_unit_missing:${unit.unitId}`);
    if (sourceIngestionUnit) {
      pushIf(
        unit.unitType !== payloadUnitTypeForIngestionUnit(sourceIngestionUnit) ||
          unit.surface !== sourceIngestionUnit.surface ||
          unit.sourceExternalDecisionPayloadStatus !==
            sourceIngestionUnit.externalDecisionPayloadStatus ||
          unit.sourceIngestionStatus !== sourceIngestionUnit.ingestionStatus ||
          unit.sourceDecisionReceiptStatus !== sourceIngestionUnit.decisionReceiptStatus ||
          unit.sourceFounderDecisionStatus !== sourceIngestionUnit.founderDecisionStatus ||
          unit.sourceReviewExecutionStatus !== sourceIngestionUnit.reviewExecutionStatus ||
          unit.sourceReviewerAssignmentStatus !== sourceIngestionUnit.reviewerAssignmentStatus ||
          unit.sourceRouteActivationStatus !== sourceIngestionUnit.routeActivationStatus ||
          unit.sourceActualPublicNavigationStatus !==
            sourceIngestionUnit.actualPublicNavigationStatus ||
          unit.sourcePublicApprovalStatus !== sourceIngestionUnit.publicApprovalStatus ||
          unit.sourcePublicationStatus !== sourceIngestionUnit.publicationStatus,
        errors,
        `payload_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceIngestionUnit.requiredIngestionRequirements) {
        pushIf(
          !unit.sourceIngestionRequirements.includes(requirement),
          errors,
          `source_ingestion_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_REQUIREMENTS) {
      pushIf(
        !unit.requiredPayloadRequirements.includes(requirement),
        errors,
        `payload_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const fieldId of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_FIELD_IDS) {
      const field = unit.payloadFields.find((candidateField) => candidateField.fieldId === fieldId);
      pushIf(!field, errors, `payload_field_missing:${unit.unitId}:${fieldId}`);
      if (field) {
        pushIf(
          field.valueStatus !== 'empty' ||
            field.acceptedStatus !== 'not_accepted' ||
            field.requiredBeforeIngestion !== true,
          errors,
          `payload_field_must_remain_empty_not_accepted_required:${unit.unitId}:${fieldId}`,
        );
      }
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_OPTIONS) {
      pushIf(
        !unit.payloadOptions.includes(option),
        errors,
        `payload_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.payloadSchemaStatus !== 'declared_empty_fixture' ||
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
      `payload_unit_must_remain_empty_not_accepted_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `payload_unit_boundary_flags_invalid:${unit.unitId}`,
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
    'founder_final_release_decision_payload_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
