import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY,
  buildAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  validateAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  type AxiomAllLayerIntegratedDomainKnowledgeRebuild,
} from './allLayerIntegratedDomainKnowledgeRebuild';

export const AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_VERSION =
  'v0_2026_06_12' as const;

export const AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY =
  'axiom_all_layer_integrated_domain_knowledge_founder_review_result_receipt_records_acceptance_for_internal_surface_projection_without_public_validity_publication_runtime_or_learning_movement' as const;

export const AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultUnit = {
  resultUnitId: string;
  sourceRebuiltUnitId: string;
  sourceTitleJa: string;
  sourceSubstructureIds: string[];
  acceptedSubstructureCount: number;
  selectedDecision:
    'accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection';
  reviewerRole: 'Founder';
  reviewResultStatus: 'recorded_external_founder_acceptance';
  acceptedMeaningJa: string;
  requiredRevision: '';
  missingContextToCheckBeforeInternalProjection: '';
  sourceLensOrBiasRiskToHoldBeforeInternalProjection: '';
  publicApprovalStatus: 'not_public_approved';
};

export type AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt = {
  receiptId: string;
  objectType: 'axiom_all_layer_integrated_domain_knowledge_founder_review_result_receipt';
  contractVersion: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_VERSION;
  lane: 'Falcon Lab';
  status:
    'founder_review_result_received_all_10_rebuilt_units_accepted_for_internal_surface_projection';
  boundary: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY;
  strengthensCore: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES;
  sourceRebuildId: string;
  sourceRebuildBoundary: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY;
  sourceRebuildStatus: AxiomAllLayerIntegratedDomainKnowledgeRebuild['status'];
  sourcePreFounderAutonomousReviewId: string;
  reviewSource: 'founder_chat_review_result_2026_06_12';
  reviewerRole: 'Founder';
  externalReviewSummaryJa: string;
  acceptedPreconditions: {
    preFounderAutonomousReviewCompleted: true;
    employmentPhaseCoverageAuditIncluded: true;
    upperDisabilityCategoryLayerIncluded: true;
    allLayerCoverageReviewIncluded: true;
  };
  unitCount: 10;
  acceptedUnitCount: 10;
  revisedUnitCount: 0;
  heldUnitCount: 0;
  totalAcceptedSubstructureCount: number;
  overallDecision:
    'all_10_rebuilt_units_accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection';
  reviewResultInterpretation: {
    integratedDomainKnowledgeAccepted: true;
    internalNextNblCandidateSurfaceProjection:
      'allowed_to_project_accepted_integrated_domain_knowledge_to_next_nbl_internal_candidate_surfaces';
    directPublicationDecision: 'not_decided_by_this_receipt';
    sourceSupportValidity: 'not_decided_by_this_receipt';
    candidatePattern: 'not_candidate_pattern';
    runtimePromptRetrievalModelProviderDbSchema: 'not_changed';
    learningUpdate: 'not_promoted';
  };
  surfaceProjectionBridge: {
    nextAllowedStep:
      'build_axiom_integrated_domain_knowledge_backed_next_nbl_candidate_page_bodies';
    allowedScope:
      'internal_founder_review_candidate_pages_only_not_actual_public_navigation';
    mustCarryForward: readonly [
      '10_rebuilt_units',
      '37_substructures',
      'pre_founder_autonomous_review_findings',
      'employment_phase_coverage_audit',
      'upper_disability_category_layer',
      'source_lens_boundary_notes',
      'not_public_approval',
    ];
    prohibitedByThisReceipt: readonly [
      'actual_public_navigation',
      'publication',
      'public_approval',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
      'runtime_prompt_retrieval_model_provider_db_schema_change',
      'learning_update',
      'raw_sensitive_source_text_or_field_values_export',
    ];
  };
  resultUnits: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultUnit[];
  notNow: string[];
};

export type AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceiptValidation = {
  valid: boolean;
  validationStatus:
    | 'all_layer_integrated_domain_knowledge_founder_review_result_receipt_valid'
    | 'all_layer_integrated_domain_knowledge_founder_review_result_receipt_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY;
  strengthensCore: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES;
};

const MUST_CARRY_FORWARD = [
  '10_rebuilt_units',
  '37_substructures',
  'pre_founder_autonomous_review_findings',
  'employment_phase_coverage_audit',
  'upper_disability_category_layer',
  'source_lens_boundary_notes',
  'not_public_approval',
] as const;

const PROHIBITED_BY_THIS_RECEIPT = [
  'actual_public_navigation',
  'publication',
  'public_approval',
  'source_support_validity_finality',
  'candidate_pattern_promotion',
  'runtime_prompt_retrieval_model_provider_db_schema_change',
  'learning_update',
  'raw_sensitive_source_text_or_field_values_export',
] as const;

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildResultUnits(
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild,
): AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultUnit[] {
  return rebuild.rebuiltReviewUnits.map((unit) => ({
    resultUnitId: `founder_acceptance_${unit.rebuiltUnitId}`,
    sourceRebuiltUnitId: unit.rebuiltUnitId,
    sourceTitleJa: unit.titleJa,
    sourceSubstructureIds: unit.substructures.map(
      (substructure) => substructure.substructureId,
    ),
    acceptedSubstructureCount: unit.substructures.length,
    selectedDecision:
      'accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection',
    reviewerRole: 'Founder',
    reviewResultStatus: 'recorded_external_founder_acceptance',
    acceptedMeaningJa:
      'Founder review passed this rebuilt unit as Axiom integrated domain knowledge suitable for internal next-NBL candidate page projection, after the pre-Founder autonomous review and employment-phase / upper-disability-category correction.',
    requiredRevision: '',
    missingContextToCheckBeforeInternalProjection: '',
    sourceLensOrBiasRiskToHoldBeforeInternalProjection: '',
    publicApprovalStatus: 'not_public_approved',
  }));
}

export function buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild =
    buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(),
): AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt {
  const resultUnits = buildResultUnits(rebuild);

  return {
    receiptId:
      'axiom_all_layer_integrated_domain_knowledge_founder_review_result_receipt_v0_2026_06_12',
    objectType:
      'axiom_all_layer_integrated_domain_knowledge_founder_review_result_receipt',
    contractVersion:
      AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_VERSION,
    lane: 'Falcon Lab',
    status:
      'founder_review_result_received_all_10_rebuilt_units_accepted_for_internal_surface_projection',
    boundary:
      AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY,
    strengthensCore: [
      ...AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES,
    ],
    sourceRebuildId: rebuild.rebuildId,
    sourceRebuildBoundary: rebuild.boundary,
    sourceRebuildStatus: rebuild.status,
    sourcePreFounderAutonomousReviewId: rebuild.preFounderAutonomousReview.reviewId,
    reviewSource: 'founder_chat_review_result_2026_06_12',
    reviewerRole: 'Founder',
    externalReviewSummaryJa:
      'Founder states that the current Axiom all-layer integrated domain knowledge review is very well done and should be treated as passed. This acceptance applies to the rebuilt 10 units with substructures, after the mobility correction, pre-Founder autonomous review, employment-phase correction, and upper-disability-category layer correction. It allows internal next-NBL candidate page body projection, but does not decide source/support validity, public approval, publication, runtime, DB/schema, candidate_pattern, or learning update.',
    acceptedPreconditions: {
      preFounderAutonomousReviewCompleted: true,
      employmentPhaseCoverageAuditIncluded: true,
      upperDisabilityCategoryLayerIncluded: true,
      allLayerCoverageReviewIncluded: true,
    },
    unitCount: 10,
    acceptedUnitCount: 10,
    revisedUnitCount: 0,
    heldUnitCount: 0,
    totalAcceptedSubstructureCount:
      rebuild.allLayerCoverageReview.totalSubstructureCount,
    overallDecision:
      'all_10_rebuilt_units_accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection',
    reviewResultInterpretation: {
      integratedDomainKnowledgeAccepted: true,
      internalNextNblCandidateSurfaceProjection:
        'allowed_to_project_accepted_integrated_domain_knowledge_to_next_nbl_internal_candidate_surfaces',
      directPublicationDecision: 'not_decided_by_this_receipt',
      sourceSupportValidity: 'not_decided_by_this_receipt',
      candidatePattern: 'not_candidate_pattern',
      runtimePromptRetrievalModelProviderDbSchema: 'not_changed',
      learningUpdate: 'not_promoted',
    },
    surfaceProjectionBridge: {
      nextAllowedStep:
        'build_axiom_integrated_domain_knowledge_backed_next_nbl_candidate_page_bodies',
      allowedScope:
        'internal_founder_review_candidate_pages_only_not_actual_public_navigation',
      mustCarryForward: MUST_CARRY_FORWARD,
      prohibitedByThisReceipt: PROHIBITED_BY_THIS_RECEIPT,
    },
    resultUnits,
    notNow: [
      'no_source_or_support_validity_finality_from_this_receipt',
      'no_candidate_pattern_promotion_from_this_receipt',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_actual_public_navigation_from_this_receipt',
      'no_direct_publication_or_public_approval_from_this_receipt',
      'no_learning_update',
      'no_individual_case_final_judgment',
      'no_raw_sensitive_source_text_or_field_values_export',
    ],
  };
}

export function validateAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
  receipt: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild =
    buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(),
): AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceiptValidation {
  const errors: string[] = [];
  const rebuildValidation =
    validateAxiomAllLayerIntegratedDomainKnowledgeRebuild(rebuild);
  const sourceUnitIds = new Set(
    rebuild.rebuiltReviewUnits.map((unit) => unit.rebuiltUnitId),
  );
  const receiptUnitIds = new Set(
    receipt.resultUnits.map((unit) => unit.sourceRebuiltUnitId),
  );
  const totalSubstructureCount = rebuild.rebuiltReviewUnits.reduce(
    (total, unit) => total + unit.substructures.length,
    0,
  );

  pushIf(!rebuildValidation.valid, errors, 'source_all_layer_rebuild_must_be_valid');
  pushIf(
    receipt.objectType !==
      'axiom_all_layer_integrated_domain_knowledge_founder_review_result_receipt',
    errors,
    'object_type_must_match_all_layer_founder_review_result_receipt',
  );
  pushIf(receipt.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    receipt.status !==
      'founder_review_result_received_all_10_rebuilt_units_accepted_for_internal_surface_projection',
    errors,
    'status_must_record_founder_acceptance_of_all_10_rebuilt_units',
  );
  pushIf(
    receipt.reviewSource !== 'founder_chat_review_result_2026_06_12' ||
      receipt.reviewerRole !== 'Founder',
    errors,
    'review_source_must_be_external_founder_result_2026_06_12',
  );
  pushIf(
    receipt.sourceRebuildId !== rebuild.rebuildId ||
      receipt.sourceRebuildBoundary !== rebuild.boundary ||
      receipt.sourceRebuildStatus !== rebuild.status ||
      receipt.sourcePreFounderAutonomousReviewId !==
        rebuild.preFounderAutonomousReview.reviewId,
    errors,
    'source_rebuild_trace_must_remain_intact',
  );
  pushIf(
    receipt.acceptedPreconditions.preFounderAutonomousReviewCompleted !== true ||
      receipt.acceptedPreconditions.employmentPhaseCoverageAuditIncluded !== true ||
      receipt.acceptedPreconditions.upperDisabilityCategoryLayerIncluded !== true ||
      receipt.acceptedPreconditions.allLayerCoverageReviewIncluded !== true,
    errors,
    'acceptance_must_include_prefounder_employment_phase_upper_category_and_coverage_corrections',
  );
  pushIf(
    receipt.unitCount !== 10 ||
      receipt.acceptedUnitCount !== 10 ||
      receipt.resultUnits.length !== 10 ||
      receipt.revisedUnitCount !== 0 ||
      receipt.heldUnitCount !== 0 ||
      receipt.totalAcceptedSubstructureCount !== totalSubstructureCount ||
      receipt.totalAcceptedSubstructureCount !==
        rebuild.allLayerCoverageReview.totalSubstructureCount,
    errors,
    'receipt_counts_must_record_10_of_10_acceptance_and_all_substructures',
  );
  pushIf(
    receipt.overallDecision !==
      'all_10_rebuilt_units_accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection',
    errors,
    'overall_decision_must_accept_all_10_for_internal_surface_projection',
  );
  pushIf(
    receipt.reviewResultInterpretation.integratedDomainKnowledgeAccepted !== true ||
      receipt.reviewResultInterpretation.internalNextNblCandidateSurfaceProjection !==
        'allowed_to_project_accepted_integrated_domain_knowledge_to_next_nbl_internal_candidate_surfaces',
    errors,
    'receipt_must_allow_internal_candidate_surface_projection',
  );
  pushIf(
    receipt.reviewResultInterpretation.directPublicationDecision !==
      'not_decided_by_this_receipt' ||
      receipt.reviewResultInterpretation.sourceSupportValidity !==
        'not_decided_by_this_receipt' ||
      receipt.reviewResultInterpretation.candidatePattern !== 'not_candidate_pattern' ||
      receipt.reviewResultInterpretation.runtimePromptRetrievalModelProviderDbSchema !==
        'not_changed' ||
      receipt.reviewResultInterpretation.learningUpdate !== 'not_promoted',
    errors,
    'receipt_must_not_move_publication_validity_candidate_runtime_or_learning',
  );
  pushIf(
    receipt.surfaceProjectionBridge.nextAllowedStep !==
      'build_axiom_integrated_domain_knowledge_backed_next_nbl_candidate_page_bodies' ||
      receipt.surfaceProjectionBridge.allowedScope !==
        'internal_founder_review_candidate_pages_only_not_actual_public_navigation' ||
      receipt.surfaceProjectionBridge.mustCarryForward.join('|') !==
        MUST_CARRY_FORWARD.join('|') ||
      receipt.surfaceProjectionBridge.prohibitedByThisReceipt.join('|') !==
        PROHIBITED_BY_THIS_RECEIPT.join('|'),
    errors,
    'surface_projection_bridge_must_allow_only_internal_candidate_page_body_projection',
  );

  for (const unit of rebuild.rebuiltReviewUnits) {
    pushIf(
      !receiptUnitIds.has(unit.rebuiltUnitId),
      errors,
      `receipt_missing_rebuilt_unit:${unit.rebuiltUnitId}`,
    );
  }
  for (const resultUnit of receipt.resultUnits) {
    const sourceUnit = rebuild.rebuiltReviewUnits.find(
      (unit) => unit.rebuiltUnitId === resultUnit.sourceRebuiltUnitId,
    );

    pushIf(
      !sourceUnitIds.has(resultUnit.sourceRebuiltUnitId) ||
        !sourceUnit ||
        resultUnit.sourceTitleJa !== sourceUnit.titleJa ||
        resultUnit.acceptedSubstructureCount !== sourceUnit.substructures.length ||
        resultUnit.sourceSubstructureIds.join('|') !==
          sourceUnit.substructures.map((substructure) => substructure.substructureId).join('|'),
      errors,
      `receipt_unit_must_trace_to_source_rebuild_unit:${resultUnit.resultUnitId}`,
    );
    pushIf(
      resultUnit.selectedDecision !==
        'accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection' ||
        resultUnit.reviewerRole !== 'Founder' ||
        resultUnit.reviewResultStatus !== 'recorded_external_founder_acceptance' ||
        resultUnit.requiredRevision !== '' ||
        resultUnit.missingContextToCheckBeforeInternalProjection !== '' ||
        resultUnit.sourceLensOrBiasRiskToHoldBeforeInternalProjection !== '' ||
        resultUnit.publicApprovalStatus !== 'not_public_approved',
      errors,
      `receipt_unit_must_record_founder_acceptance_without_public_approval:${resultUnit.resultUnitId}`,
    );
  }

  pushIf(
    !receipt.notNow.includes('no_source_or_support_validity_finality_from_this_receipt') ||
      !receipt.notNow.includes('no_candidate_pattern_promotion_from_this_receipt') ||
      !receipt.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !receipt.notNow.includes('no_actual_public_navigation_from_this_receipt') ||
      !receipt.notNow.includes('no_direct_publication_or_public_approval_from_this_receipt') ||
      !receipt.notNow.includes('no_learning_update') ||
      !receipt.notNow.includes('no_individual_case_final_judgment') ||
      !receipt.notNow.includes('no_raw_sensitive_source_text_or_field_values_export'),
    errors,
    'not_now_must_block_validity_public_navigation_publication_runtime_learning_and_sensitive_source_export',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'all_layer_integrated_domain_knowledge_founder_review_result_receipt_valid'
        : 'all_layer_integrated_domain_knowledge_founder_review_result_receipt_invalid',
    errorCount: errors.length,
    errors,
    boundary:
      AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY,
    strengthensCore: [
      ...AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES,
    ],
  };
}
