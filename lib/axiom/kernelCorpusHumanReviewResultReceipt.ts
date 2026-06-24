import {
  buildAxiomKernelCorpusHumanReviewTool,
  validateAxiomKernelCorpusHumanReviewTool,
  type AxiomKernelCorpusHumanReviewDecisionOption,
  type AxiomKernelCorpusHumanReviewTool,
} from './kernelCorpusHumanReviewTool';
import {
  type AxiomKernelCorpusHumanReviewMovementBoundary,
} from './kernelCorpusHumanReviewPacket';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY =
  'axiom_kernel_corpus_human_review_result_receipt_records_founder_acceptance_and_allows_kernel_backed_public_interface_translation_without_final_validity_publication_runtime_or_learning_movement' as const;

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES = [
  'kernel_human_review_loop',
  'kernel_eval',
  'kernel_display',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusHumanReviewResultUnit = {
  resultUnitId: string;
  sourceReviewUnitId: string;
  toolUnitId: string;
  reviewDossierTitleJa: string;
  selectedDecision: Extract<
    AxiomKernelCorpusHumanReviewDecisionOption,
    'accept_as_provisional_kernel_structure'
  >;
  reviewerNameOrRole: 'Founder';
  decisionReason: string;
  requiredRevision: '';
  missingContextToCheck: '';
  sourceLensOrBiasRisk: '';
  promotionBlocker: '';
  reviewResultStatus: 'recorded_external_founder_acceptance';
  kernelUseStatus: 'accepted_as_provisional_kernel_structure';
  publicInterfaceUseStatus: 'eligible_for_kernel_backed_public_slot_translation';
};

export type AxiomKernelCorpusHumanReviewResultReceipt = {
  receiptId: string;
  objectType: 'axiom_kernel_corpus_human_review_result_receipt';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_VERSION;
  lane: 'Falcon Lab';
  status: 'founder_review_result_received_all_units_accept_provisional_kernel_structure';
  boundary: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES;
  sourceToolId: string;
  sourcePacketId: string;
  sourceToolBoundary: AxiomKernelCorpusHumanReviewTool['boundary'];
  sourceToolStatus: AxiomKernelCorpusHumanReviewTool['status'];
  reviewSource: 'founder_chat_review_result_2026_06_08';
  reviewerRole: 'Founder';
  externalReviewSummaryJa: string;
  unitCount: number;
  acceptedUnitCount: number;
  revisedUnitCount: 0;
  heldUnitCount: 0;
  overallDecision: 'all_units_accept_as_provisional_kernel_structure';
  reviewResultInterpretation: {
    provisionalKernelStructureAccepted: true;
    kernelBackedPublicInterfaceContinuation:
      'allowed_to_build_kernel_backed_public_interface_translation';
    directPublicationDecision: 'not_decided_by_this_receipt';
    sourceSupportValidity: 'not_decided_by_this_receipt';
    candidatePattern: 'not_candidate_pattern';
    runtimePromptRetrievalModelProviderDbSchema: 'not_changed';
    learningUpdate: 'not_promoted';
  };
  publicInterfaceBridge: {
    nextAllowedStep: 'build_kernel_backed_public_content_slots_from_reviewed_kernel_fields';
    allowedPublicTranslationFields: readonly [
      'observation',
      'inference',
      'counterHypothesis',
      'missingContext',
      'implementationActorConditions',
      'sourceLensStatus',
      'actionabilityBand',
      'cannotYetSay',
      'humanReviewRoute',
    ];
    publicTranslationRequirement:
      'translate_kernel_objects_into_safe_public_fields_without_presenting_them_as_final_source_support_validity_or_individual_judgment';
    doNotExposeAsPublicTruth: readonly [
      'final_support_validity',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
      'individual_case_final_judgment',
      'medical_legal_or_job_placement_finality',
      'raw_sensitive_source_text_or_field_values',
    ];
  };
  movementBoundary: AxiomKernelCorpusHumanReviewMovementBoundary;
  resultUnits: AxiomKernelCorpusHumanReviewResultUnit[];
  notNow: string[];
};

export type AxiomKernelCorpusHumanReviewResultReceiptValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_human_review_result_receipt_valid'
    | 'kernel_corpus_human_review_result_receipt_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES;
};

const ACCEPT_DECISION_REASON =
  'Founder states that all 18 compressed review units are accepted as provisional kernel structure; detailed rule-by-rule verification is delegated to deterministic kernel checks.';

const ALLOWED_PUBLIC_TRANSLATION_FIELDS =
  [
    'observation',
    'inference',
    'counterHypothesis',
    'missingContext',
    'implementationActorConditions',
    'sourceLensStatus',
    'actionabilityBand',
    'cannotYetSay',
    'humanReviewRoute',
  ] as const;

const DO_NOT_EXPOSE_AS_PUBLIC_TRUTH =
  [
    'final_support_validity',
    'source_support_validity_finality',
    'candidate_pattern_promotion',
    'individual_case_final_judgment',
    'medical_legal_or_job_placement_finality',
    'raw_sensitive_source_text_or_field_values',
  ] as const;

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) {
    errors.push(error);
  }
}

export function buildAxiomKernelCorpusHumanReviewResultReceipt(
  tool: AxiomKernelCorpusHumanReviewTool = buildAxiomKernelCorpusHumanReviewTool(),
): AxiomKernelCorpusHumanReviewResultReceipt {
  return {
    receiptId: `axiom_kernel_corpus_founder_review_result_receipt_from_${tool.toolId}`,
    objectType: 'axiom_kernel_corpus_human_review_result_receipt',
    contractVersion: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_VERSION,
    lane: 'Falcon Lab',
    status: 'founder_review_result_received_all_units_accept_provisional_kernel_structure',
    boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES],
    sourceToolId: tool.toolId,
    sourcePacketId: tool.sourcePacketId,
    sourceToolBoundary: tool.boundary,
    sourceToolStatus: tool.status,
    reviewSource: 'founder_chat_review_result_2026_06_08',
    reviewerRole: 'Founder',
    externalReviewSummaryJa:
      '18項目すべてを「暫定kernel構造として受け入れる」とするFounderレビュー結果を受領した。これはAxiom kernelを次期NBL公開インターフェイスの生成基盤へ接続する許可であり、最終source/support validity、candidate_pattern昇格、runtime変更、公開承認、publication、learning updateを意味しない。',
    unitCount: tool.unitCount,
    acceptedUnitCount: tool.unitCount,
    revisedUnitCount: 0,
    heldUnitCount: 0,
    overallDecision: 'all_units_accept_as_provisional_kernel_structure',
    reviewResultInterpretation: {
      provisionalKernelStructureAccepted: true,
      kernelBackedPublicInterfaceContinuation:
        'allowed_to_build_kernel_backed_public_interface_translation',
      directPublicationDecision: 'not_decided_by_this_receipt',
      sourceSupportValidity: 'not_decided_by_this_receipt',
      candidatePattern: 'not_candidate_pattern',
      runtimePromptRetrievalModelProviderDbSchema: 'not_changed',
      learningUpdate: 'not_promoted',
    },
    publicInterfaceBridge: {
      nextAllowedStep: 'build_kernel_backed_public_content_slots_from_reviewed_kernel_fields',
      allowedPublicTranslationFields: ALLOWED_PUBLIC_TRANSLATION_FIELDS,
      publicTranslationRequirement:
        'translate_kernel_objects_into_safe_public_fields_without_presenting_them_as_final_source_support_validity_or_individual_judgment',
      doNotExposeAsPublicTruth: DO_NOT_EXPOSE_AS_PUBLIC_TRUTH,
    },
    movementBoundary: { ...tool.receiptTemplate.movementBoundary },
    resultUnits: tool.units.map((unit) => ({
      resultUnitId: `founder_acceptance_${unit.toolUnitId}`,
      sourceReviewUnitId: unit.sourceReviewUnitId,
      toolUnitId: unit.toolUnitId,
      reviewDossierTitleJa: unit.reviewDossier.titleJa,
      selectedDecision: 'accept_as_provisional_kernel_structure',
      reviewerNameOrRole: 'Founder',
      decisionReason: ACCEPT_DECISION_REASON,
      requiredRevision: '',
      missingContextToCheck: '',
      sourceLensOrBiasRisk: '',
      promotionBlocker: '',
      reviewResultStatus: 'recorded_external_founder_acceptance',
      kernelUseStatus: 'accepted_as_provisional_kernel_structure',
      publicInterfaceUseStatus: 'eligible_for_kernel_backed_public_slot_translation',
    })),
    notNow: [
      'no_source_or_support_validity_finality_from_this_receipt',
      'no_candidate_pattern_promotion_from_this_receipt',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_direct_publication_or_public_approval_from_this_receipt',
      'no_learning_update',
      'no_individual_case_final_judgment',
      'no_raw_sensitive_source_text_or_field_values_export',
    ],
  };
}

export function validateAxiomKernelCorpusHumanReviewResultReceipt(
  receipt: AxiomKernelCorpusHumanReviewResultReceipt,
  tool: AxiomKernelCorpusHumanReviewTool = buildAxiomKernelCorpusHumanReviewTool(),
): AxiomKernelCorpusHumanReviewResultReceiptValidation {
  const errors: string[] = [];
  const toolValidation = validateAxiomKernelCorpusHumanReviewTool(tool);
  const sourceToolUnitIds = new Set(tool.units.map((unit) => unit.toolUnitId));
  const sourceReviewUnitIds = new Set(tool.units.map((unit) => unit.sourceReviewUnitId));
  const receiptToolUnitIds = new Set(receipt.resultUnits.map((unit) => unit.toolUnitId));
  const receiptSourceReviewUnitIds = new Set(
    receipt.resultUnits.map((unit) => unit.sourceReviewUnitId),
  );

  pushIf(!toolValidation.valid, errors, 'source_human_review_tool_must_be_valid');
  pushIf(
    receipt.objectType !== 'axiom_kernel_corpus_human_review_result_receipt',
    errors,
    'object_type_must_match_kernel_corpus_human_review_result_receipt',
  );
  pushIf(
    receipt.contractVersion !== AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_VERSION,
    errors,
    'contract_version_must_match_kernel_corpus_human_review_result_receipt_v0_2026_06_08',
  );
  pushIf(receipt.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    receipt.status !==
      'founder_review_result_received_all_units_accept_provisional_kernel_structure',
    errors,
    'status_must_record_founder_acceptance_of_all_units',
  );
  pushIf(
    receipt.boundary !== AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY,
    errors,
    'boundary_must_allow_public_interface_translation_without_finality_movement',
  );
  pushIf(receipt.sourceToolId !== tool.toolId, errors, 'source_tool_id_mismatch');
  pushIf(receipt.sourcePacketId !== tool.sourcePacketId, errors, 'source_packet_id_mismatch');
  pushIf(
    receipt.sourceToolBoundary !== tool.boundary || receipt.sourceToolStatus !== tool.status,
    errors,
    'source_tool_trace_must_remain_intact',
  );
  pushIf(
    receipt.reviewSource !== 'founder_chat_review_result_2026_06_08' ||
      receipt.reviewerRole !== 'Founder',
    errors,
    'review_source_must_be_external_founder_result',
  );
  pushIf(
    receipt.unitCount !== tool.unitCount ||
      receipt.acceptedUnitCount !== tool.unitCount ||
      receipt.resultUnits.length !== tool.unitCount ||
      receipt.revisedUnitCount !== 0 ||
      receipt.heldUnitCount !== 0,
    errors,
    'receipt_counts_must_record_18_of_18_acceptance_with_no_revise_or_hold',
  );
  pushIf(
    receipt.overallDecision !== 'all_units_accept_as_provisional_kernel_structure',
    errors,
    'overall_decision_must_accept_all_units_as_provisional_kernel_structure',
  );
  pushIf(
    receipt.reviewResultInterpretation.provisionalKernelStructureAccepted !== true ||
      receipt.reviewResultInterpretation.kernelBackedPublicInterfaceContinuation !==
        'allowed_to_build_kernel_backed_public_interface_translation',
    errors,
    'receipt_must_allow_kernel_backed_public_interface_translation',
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
    receipt.publicInterfaceBridge.nextAllowedStep !==
      'build_kernel_backed_public_content_slots_from_reviewed_kernel_fields',
    errors,
    'next_allowed_step_must_be_kernel_backed_public_slot_translation',
  );
  pushIf(
    receipt.publicInterfaceBridge.allowedPublicTranslationFields.join('|') !==
      ALLOWED_PUBLIC_TRANSLATION_FIELDS.join('|'),
    errors,
    'public_translation_fields_must_match_kernel_contract_fields',
  );
  pushIf(
    receipt.publicInterfaceBridge.doNotExposeAsPublicTruth.join('|') !==
      DO_NOT_EXPOSE_AS_PUBLIC_TRUTH.join('|'),
    errors,
    'public_truth_exclusions_must_block_finality_and_sensitive_source_export',
  );

  for (const toolUnit of tool.units) {
    pushIf(
      !receiptToolUnitIds.has(toolUnit.toolUnitId),
      errors,
      `receipt_missing_tool_unit:${toolUnit.toolUnitId}`,
    );
    pushIf(
      !receiptSourceReviewUnitIds.has(toolUnit.sourceReviewUnitId),
      errors,
      `receipt_missing_source_review_unit:${toolUnit.sourceReviewUnitId}`,
    );
  }
  for (const resultUnit of receipt.resultUnits) {
    pushIf(
      !sourceToolUnitIds.has(resultUnit.toolUnitId) ||
        !sourceReviewUnitIds.has(resultUnit.sourceReviewUnitId),
      errors,
      `receipt_unit_must_trace_to_source_tool:${resultUnit.resultUnitId}`,
    );
    pushIf(
      resultUnit.selectedDecision !== 'accept_as_provisional_kernel_structure' ||
        resultUnit.reviewerNameOrRole !== 'Founder' ||
        resultUnit.requiredRevision !== '' ||
        resultUnit.missingContextToCheck !== '' ||
        resultUnit.sourceLensOrBiasRisk !== '' ||
        resultUnit.promotionBlocker !== '' ||
        resultUnit.reviewResultStatus !== 'recorded_external_founder_acceptance' ||
        resultUnit.kernelUseStatus !== 'accepted_as_provisional_kernel_structure' ||
        resultUnit.publicInterfaceUseStatus !==
          'eligible_for_kernel_backed_public_slot_translation',
      errors,
      `receipt_unit_must_record_founder_acceptance_only:${resultUnit.resultUnitId}`,
    );
  }

  pushIf(
    receipt.movementBoundary.runtime !== 'not_changed' ||
      receipt.movementBoundary.prompt !== 'not_changed' ||
      receipt.movementBoundary.retrieval !== 'not_changed' ||
      receipt.movementBoundary.modelProvider !== 'not_changed' ||
      receipt.movementBoundary.dbSchema !== 'not_changed' ||
      receipt.movementBoundary.sourceValidity !== 'not_decided' ||
      receipt.movementBoundary.supportValidity !== 'not_decided' ||
      receipt.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      receipt.movementBoundary.runtimeApproved !== 'not_approved' ||
      receipt.movementBoundary.publicApproved !== 'not_approved' ||
      receipt.movementBoundary.publicRelease !== 'not_approved' ||
      receipt.movementBoundary.publication !== 'not_published' ||
      receipt.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      receipt.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'movement_boundary_must_not_move_runtime_validity_publication_promotion_or_learning',
  );
  pushIf(
    !receipt.notNow.includes('no_source_or_support_validity_finality_from_this_receipt') ||
      !receipt.notNow.includes('no_candidate_pattern_promotion_from_this_receipt') ||
      !receipt.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !receipt.notNow.includes('no_direct_publication_or_public_approval_from_this_receipt') ||
      !receipt.notNow.includes('no_learning_update') ||
      !receipt.notNow.includes('no_individual_case_final_judgment') ||
      !receipt.notNow.includes('no_raw_sensitive_source_text_or_field_values_export'),
    errors,
    'not_now_must_block_finality_runtime_publication_learning_and_sensitive_source_export',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_human_review_result_receipt_valid'
        : 'kernel_corpus_human_review_result_receipt_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_CORE_PROGRESS_CLASSES],
  };
}
