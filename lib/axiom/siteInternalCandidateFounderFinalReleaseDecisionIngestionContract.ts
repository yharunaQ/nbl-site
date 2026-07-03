import {
  type AxiomCandidateFounderFinalReleaseDecisionReceiptUnit,
  type AxiomFounderFinalReleaseDecisionReceiptRequirement,
  type AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
} from './siteInternalCandidateFounderFinalReleaseDecisionReceiptShell';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_ingestion_contract_is_empty_not_ingested_not_founder_decision_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract' as const;

export type AxiomFounderFinalReleaseDecisionIngestionRequirement =
  | 'external_founder_decision_payload_required_before_ingestion'
  | 'decision_payload_must_name_release_or_no_release'
  | 'human_review_execution_evidence_required_before_ingestion'
  | 'source_support_validity_evidence_required_before_ingestion'
  | 'public_navigation_authorization_required_before_ingestion'
  | 'public_approval_publication_evidence_required_before_ingestion'
  | 'rollback_correction_no_intake_confirmation_required'
  | 'runtime_and_learning_freeze_must_remain_confirmed';

export type AxiomFounderFinalReleaseDecisionIngestionOption =
  | 'keep_ingestion_empty_until_external_receipt'
  | 'reject_partial_or_ambiguous_founder_receipt'
  | 'prepare_ingestion_mapping_after_external_decision'
  | 'return_to_receipt_shell_hold_note';

export type AxiomCandidateFounderFinalReleaseDecisionIngestionUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_ingestion_contract_input'
    | 'cross_founder_final_release_decision_ingestion_contract_input'
    | 'gate8_founder_final_release_decision_ingestion_contract_input';
  surface?: AxiomNextNblSiteSurface;
  sourceReceiptUnitId: string;
  sourceReceiptRequirements: AxiomFounderFinalReleaseDecisionReceiptRequirement[];
  sourceDecisionReceiptStatus: 'not_received';
  sourceFounderDecisionStatus: 'not_decided';
  sourceReviewExecutionStatus: 'not_executed';
  sourceReviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceRouteActivationStatus: 'not_activated';
  sourceActualPublicNavigationStatus: 'not_added';
  sourcePublicApprovalStatus: 'not_approved';
  sourcePublicationStatus: 'not_published';
  requiredIngestionRequirements: AxiomFounderFinalReleaseDecisionIngestionRequirement[];
  ingestionOptions: AxiomFounderFinalReleaseDecisionIngestionOption[];
  externalDecisionPayloadStatus: 'empty';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract = {
  contractId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_ROUTE;
  sourceReceiptShellId: string;
  sourceReceiptShellStatus: AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell['status'];
  sourceReceiptShellRequiredStatus: 'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released';
  contractMode: 'founder_final_release_decision_ingestion_contract_empty_not_ingested';
  externalDecisionPayloadStatus: 'empty';
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
  ingestionUnitCount: number;
  ingestionUnits: AxiomCandidateFounderFinalReleaseDecisionIngestionUnit[];
  nextAllowedMovement: 'founder_decision_payload_ingestion_allowed_only_after_external_receipt_outside_codex';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContractValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_REQUIREMENTS: AxiomFounderFinalReleaseDecisionIngestionRequirement[] =
  [
    'external_founder_decision_payload_required_before_ingestion',
    'decision_payload_must_name_release_or_no_release',
    'human_review_execution_evidence_required_before_ingestion',
    'source_support_validity_evidence_required_before_ingestion',
    'public_navigation_authorization_required_before_ingestion',
    'public_approval_publication_evidence_required_before_ingestion',
    'rollback_correction_no_intake_confirmation_required',
    'runtime_and_learning_freeze_must_remain_confirmed',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_INGESTION_OPTIONS: AxiomFounderFinalReleaseDecisionIngestionOption[] =
  [
    'keep_ingestion_empty_until_external_receipt',
    'reject_partial_or_ambiguous_founder_receipt',
    'prepare_ingestion_mapping_after_external_decision',
    'return_to_receipt_shell_hold_note',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function ingestionUnitTypeForReceiptUnit(
  receiptUnit: AxiomCandidateFounderFinalReleaseDecisionReceiptUnit,
): AxiomCandidateFounderFinalReleaseDecisionIngestionUnit['unitType'] {
  if (receiptUnit.unitType === 'surface_founder_final_release_decision_receipt_shell_input') {
    return 'surface_founder_final_release_decision_ingestion_contract_input';
  }
  if (receiptUnit.unitType === 'cross_founder_final_release_decision_receipt_shell_input') {
    return 'cross_founder_final_release_decision_ingestion_contract_input';
  }

  return 'gate8_founder_final_release_decision_ingestion_contract_input';
}

function buildIngestionUnit(
  receiptUnit: AxiomCandidateFounderFinalReleaseDecisionReceiptUnit,
): AxiomCandidateFounderFinalReleaseDecisionIngestionUnit {
  return {
    unitId: `axiom_founder_final_release_decision_ingestion_contract_${receiptUnit.unitId}`,
    unitType: ingestionUnitTypeForReceiptUnit(receiptUnit),
    surface: receiptUnit.surface,
    sourceReceiptUnitId: receiptUnit.unitId,
    sourceReceiptRequirements: [...receiptUnit.requiredReceiptRequirements],
    sourceDecisionReceiptStatus: receiptUnit.decisionReceiptStatus,
    sourceFounderDecisionStatus: receiptUnit.founderDecisionStatus,
    sourceReviewExecutionStatus: receiptUnit.reviewExecutionStatus,
    sourceReviewerAssignmentStatus: receiptUnit.reviewerAssignmentStatus,
    sourceRouteActivationStatus: receiptUnit.routeActivationStatus,
    sourceActualPublicNavigationStatus: receiptUnit.actualPublicNavigationStatus,
    sourcePublicApprovalStatus: receiptUnit.publicApprovalStatus,
    sourcePublicationStatus: receiptUnit.publicationStatus,
    requiredIngestionRequirements: [...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_REQUIREMENTS],
    ingestionOptions: [...FOUNDER_FINAL_RELEASE_DECISION_INGESTION_OPTIONS],
    externalDecisionPayloadStatus: 'empty',
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

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(
  sourceReceiptShell: AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(),
): AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract {
  const ingestionUnits = sourceReceiptShell.receiptUnits.map((receiptUnit) =>
    buildIngestionUnit(receiptUnit),
  );

  return {
    contractId: `axiom_internal_candidate_founder_final_release_decision_ingestion_contract_from_${sourceReceiptShell.shellId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_ROUTE,
    sourceReceiptShellId: sourceReceiptShell.shellId,
    sourceReceiptShellStatus: sourceReceiptShell.status,
    sourceReceiptShellRequiredStatus:
      'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
    contractMode: 'founder_final_release_decision_ingestion_contract_empty_not_ingested',
    externalDecisionPayloadStatus: 'empty',
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
    ingestionUnitCount: ingestionUnits.length,
    ingestionUnits,
    nextAllowedMovement:
      'founder_decision_payload_ingestion_allowed_only_after_external_receipt_outside_codex',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(
  contract: AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
  sourceReceiptShell: AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
): AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContractValidation {
  const errors: string[] = [];
  const ingestionUnitSurfaces = contract.ingestionUnits
    .filter(
      (unit) => unit.unitType === 'surface_founder_final_release_decision_ingestion_contract_input',
    )
    .map((unit) => unit.surface);

  pushIf(
    sourceReceiptShell.decisionReceiptStatus !== 'not_received',
    errors,
    'source_receipt_shell_must_not_be_received',
  );
  pushIf(
    sourceReceiptShell.founderDecisionStatus !== 'not_decided',
    errors,
    'source_receipt_shell_must_not_be_decided',
  );
  pushIf(contract.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    contract.coreProgressClasses.join('|') !==
      'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    contract.status !==
      'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
    errors,
    'status_must_remain_prepared_empty_not_ingested_not_released',
  );
  pushIf(
    contract.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY,
    errors,
    'boundary_must_remain_empty_not_ingested_not_founder_decision_public_approval_publication_navigation_or_release',
  );
  pushIf(
    contract.route !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_ingestion_contract',
  );
  pushIf(
    contract.sourceReceiptShellId !== sourceReceiptShell.shellId,
    errors,
    'source_receipt_shell_id_mismatch',
  );
  pushIf(
    contract.sourceReceiptShellStatus !== sourceReceiptShell.status,
    errors,
    'source_receipt_shell_status_mismatch',
  );
  pushIf(
    contract.sourceReceiptShellRequiredStatus !==
      'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
    errors,
    'source_receipt_shell_required_status_must_remain_prepared_not_received_not_decided_not_released',
  );
  pushIf(
    contract.contractMode !==
      'founder_final_release_decision_ingestion_contract_empty_not_ingested',
    errors,
    'contract_mode_must_be_founder_final_release_decision_ingestion_contract_empty_not_ingested',
  );
  pushIf(
    contract.externalDecisionPayloadStatus !== 'empty' ||
      contract.ingestionStatus !== 'not_ingested' ||
      contract.decisionReceiptStatus !== 'not_received' ||
      contract.founderDecisionStatus !== 'not_decided' ||
      contract.reviewExecutionStatus !== 'not_executed' ||
      contract.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      contract.releaseDecisionStatus !== 'not_decided' ||
      contract.routeActivationStatus !== 'not_activated' ||
      contract.actualPublicNavigationStatus !== 'not_added' ||
      contract.publicApprovalStatus !== 'not_approved' ||
      contract.publicationStatus !== 'not_published' ||
      contract.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'ingestion_contract_must_remain_empty_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(contract.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    contract.ingestionUnitCount !== sourceReceiptShell.receiptUnitCount,
    errors,
    'ingestion_unit_count_must_match_receipt_units',
  );
  pushIf(
    contract.ingestionUnitCount !== contract.ingestionUnits.length,
    errors,
    'ingestion_unit_count_mismatch',
  );
  pushIf(
    contract.ingestionUnitCount > contract.maxCoreReviewUnits,
    errors,
    'ingestion_units_must_remain_under_100',
  );
  pushIf(
    contract.nextAllowedMovement !==
      'founder_decision_payload_ingestion_allowed_only_after_external_receipt_outside_codex',
    errors,
    'next_allowed_movement_must_remain_external_founder_payload_ingestion_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !ingestionUnitSurfaces.includes(surface),
      errors,
      `surface_ingestion_unit_missing:${surface}`,
    );
  }
  pushIf(
    !contract.ingestionUnits.some(
      (unit) => unit.unitType === 'cross_founder_final_release_decision_ingestion_contract_input',
    ),
    errors,
    'cross_founder_final_release_decision_ingestion_contract_input_missing',
  );
  pushIf(
    !contract.ingestionUnits.some(
      (unit) => unit.unitType === 'gate8_founder_final_release_decision_ingestion_contract_input',
    ),
    errors,
    'gate8_founder_final_release_decision_ingestion_contract_input_missing',
  );

  for (const unit of contract.ingestionUnits) {
    const sourceReceiptUnit = sourceReceiptShell.receiptUnits.find(
      (receiptUnit) => receiptUnit.unitId === unit.sourceReceiptUnitId,
    );

    pushIf(!sourceReceiptUnit, errors, `source_receipt_unit_missing:${unit.unitId}`);
    if (sourceReceiptUnit) {
      pushIf(
        unit.unitType !== ingestionUnitTypeForReceiptUnit(sourceReceiptUnit) ||
          unit.surface !== sourceReceiptUnit.surface ||
          unit.sourceDecisionReceiptStatus !== sourceReceiptUnit.decisionReceiptStatus ||
          unit.sourceFounderDecisionStatus !== sourceReceiptUnit.founderDecisionStatus ||
          unit.sourceReviewExecutionStatus !== sourceReceiptUnit.reviewExecutionStatus ||
          unit.sourceReviewerAssignmentStatus !== sourceReceiptUnit.reviewerAssignmentStatus ||
          unit.sourceRouteActivationStatus !== sourceReceiptUnit.routeActivationStatus ||
          unit.sourceActualPublicNavigationStatus !==
            sourceReceiptUnit.actualPublicNavigationStatus ||
          unit.sourcePublicApprovalStatus !== sourceReceiptUnit.publicApprovalStatus ||
          unit.sourcePublicationStatus !== sourceReceiptUnit.publicationStatus,
        errors,
        `ingestion_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceReceiptUnit.requiredReceiptRequirements) {
        pushIf(
          !unit.sourceReceiptRequirements.includes(requirement),
          errors,
          `source_receipt_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_REQUIREMENTS) {
      pushIf(
        !unit.requiredIngestionRequirements.includes(requirement),
        errors,
        `ingestion_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_INGESTION_OPTIONS) {
      pushIf(
        !unit.ingestionOptions.includes(option),
        errors,
        `ingestion_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.externalDecisionPayloadStatus !== 'empty' ||
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
      `ingestion_unit_must_remain_empty_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `ingestion_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

  pushIf(
    contract.movementBoundary.runtime !== 'not_changed' ||
      contract.movementBoundary.prompt !== 'not_changed' ||
      contract.movementBoundary.retrieval !== 'not_changed' ||
      contract.movementBoundary.modelProvider !== 'not_changed' ||
      contract.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    contract.movementBoundary.publicApproval !== 'not_approved' ||
      contract.movementBoundary.publication !== 'not_published' ||
      contract.movementBoundary.publicNavigation !== 'not_added' ||
      contract.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      contract.movementBoundary.sourceValidity !== 'not_decided' ||
      contract.movementBoundary.sourceCurrentness !== 'not_decided' ||
      contract.movementBoundary.supportValidity !== 'not_decided' ||
      contract.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      contract.movementBoundary.runtimeApproved !== 'not_approved' ||
      contract.movementBoundary.publicApproved !== 'not_approved' ||
      contract.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      contract.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'founder_final_release_decision_ingestion_contract_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
