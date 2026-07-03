import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomKernelCorpusHumanReviewResultReceipt,
  validateAxiomKernelCorpusHumanReviewResultReceipt,
  type AxiomKernelCorpusHumanReviewResultReceipt,
} from './kernelCorpusHumanReviewResultReceipt';
import {
  buildAxiomKernelCorpusManualDocumentReadout,
  validateAxiomKernelCorpusManualDocumentReadout,
  type AxiomKernelCorpusManualDocumentReadout,
} from './kernelCorpusManualDocumentReadout';
import {
  buildAxiomKernelDerivedWorkDesignViewsContract,
  validateAxiomKernelDerivedWorkDesignViewsContract,
  type AxiomKernelDerivedWorkDesignViewsContract,
} from './kernelDerivedWorkDesignViewsContract';
import {
  buildAxiomKernelDerivedWorkDesignViewSet,
  validateAxiomKernelDerivedWorkDesignViewSet,
  type AxiomKernelDerivedWorkDesignViewCandidate,
  type AxiomKernelDerivedWorkDesignViewSet,
} from './kernelDerivedWorkDesignViewSet';

export const AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY =
  'axiom_kernel_semantic_work_design_view_derivation_distinguishes_15_kernel_items_18_review_units_and_27_l3_semantic_seeds_not_simple_matching_or_publication' as const;

export const AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type SemanticSourceLayer = {
  layerId:
    | 'fifteen_item_kernel_corpus'
    | 'eighteen_compressed_kernel_review_units'
    | 'twenty_seven_l3_semantic_seed_prior';
  unitCount: 15 | 18 | 27;
  role:
    | 'evidence_grounded_reasoning_material'
    | 'compressed_structure_boundary_review_receipt'
    | 'content_rich_work_design_semantic_prior';
  isWorkDesignViewContent: boolean;
  isSemanticReviewApproval: boolean;
  useInDerivation:
    | 'pressures_and_tests_view_meaning_with_grounded_kernel_objects'
    | 'permits_kernel_backed_continuation_but_not_view_content_approval'
    | 'provides_semantic_view_meaning_to_reconstruct';
  mustNotBeUsedAs:
    | 'final_work_design_view_content'
    | 'semantic_view_content_review'
    | 'fixed_axiom_view_count';
};

export type AxiomSemanticWorkDesignViewBridgeCandidate = {
  bridgeCandidateId: string;
  sourceViewCandidateId: string;
  labelJa: string;
  semanticQuestionJa: string;
  sourceSeedLabelsJa: string[];
  sourceSeedCount: number;
  corpusItemCount: number;
  reviewUnitCount: number;
  corpusRoleInDerivation:
    'grounding_pressure_and_missing_context_test_not_direct_view_content';
  reviewReceiptRoleInDerivation:
    'provisional_kernel_structure_acceptance_not_semantic_view_content_review';
  seedRoleInDerivation:
    'semantic_work_design_prior_to_be_reconstructed_through_axiom_kernel_eval';
  requiredNextOperation:
    'content_level_semantic_reconstruction_before_public_guide_slot_filling';
  semanticReviewStatus: 'semantic_view_review_required_before_public_copy';
  publicGuideReadiness: 'not_ready_for_public_guide_copy';
};

export type AxiomKernelSemanticWorkDesignViewDerivation = {
  derivationId: string;
  objectType: 'axiom_kernel_semantic_work_design_view_derivation';
  contractVersion: typeof AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_VERSION;
  lane: 'Falcon Lab';
  status: 'semantic_work_design_view_derivation_bridge_ready_internal';
  boundary: typeof AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_CORE_PROGRESS_CLASSES;
  sourceCorpusReadoutId: string;
  sourceReviewReceiptId: string;
  sourceSeedContractId: string;
  sourceViewSetId: string;
  sourceLayerLedger: readonly [SemanticSourceLayer, SemanticSourceLayer, SemanticSourceLayer];
  derivationMethod:
    'semantic_reconstruction_not_simple_count_matching_or_review_unit_substitution';
  falseEquivalenceGuards: readonly [
    'do_not_treat_18_review_units_as_21_27_semantic_content_review',
    'do_not_treat_15_kernel_items_as_work_design_view_content',
    'do_not_simple_match_15_items_to_27_seeds',
    'do_not_replace_l3_semantic_prior_with_internal_information_governance_rules',
  ];
  bridgeCandidateCount: number;
  bridgeCandidates: AxiomSemanticWorkDesignViewBridgeCandidate[];
  humanReviewNeed:
    'semantic_view_level_review_still_required_even_after_18_unit_kernel_structure_acceptance';
  nextAllowedStep:
    'rebuild_work_design_views_guide_slots_from_semantic_bridge_candidates_with_review_route';
  notNow: string[];
};

export type AxiomKernelSemanticWorkDesignViewDerivationValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_semantic_work_design_view_derivation_valid'
    | 'kernel_semantic_work_design_view_derivation_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_CORE_PROGRESS_CLASSES;
};

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function layerLedger(): AxiomKernelSemanticWorkDesignViewDerivation['sourceLayerLedger'] {
  return [
    {
      layerId: 'fifteen_item_kernel_corpus',
      unitCount: 15,
      role: 'evidence_grounded_reasoning_material',
      isWorkDesignViewContent: false,
      isSemanticReviewApproval: false,
      useInDerivation:
        'pressures_and_tests_view_meaning_with_grounded_kernel_objects',
      mustNotBeUsedAs: 'final_work_design_view_content',
    },
    {
      layerId: 'eighteen_compressed_kernel_review_units',
      unitCount: 18,
      role: 'compressed_structure_boundary_review_receipt',
      isWorkDesignViewContent: false,
      isSemanticReviewApproval: false,
      useInDerivation:
        'permits_kernel_backed_continuation_but_not_view_content_approval',
      mustNotBeUsedAs: 'semantic_view_content_review',
    },
    {
      layerId: 'twenty_seven_l3_semantic_seed_prior',
      unitCount: 27,
      role: 'content_rich_work_design_semantic_prior',
      isWorkDesignViewContent: true,
      isSemanticReviewApproval: false,
      useInDerivation: 'provides_semantic_view_meaning_to_reconstruct',
      mustNotBeUsedAs: 'fixed_axiom_view_count',
    },
  ];
}

function bridgeCandidate(
  candidate: AxiomKernelDerivedWorkDesignViewCandidate,
): AxiomSemanticWorkDesignViewBridgeCandidate {
  return {
    bridgeCandidateId: `semantic_bridge:${candidate.viewId}`,
    sourceViewCandidateId: candidate.viewId,
    labelJa: candidate.labelJa,
    semanticQuestionJa: candidate.readingQuestionJa,
    sourceSeedLabelsJa: candidate.seedEvals.map((seedEval) => seedEval.labelJa),
    sourceSeedCount: candidate.sourceSeedCount,
    corpusItemCount: candidate.sourceCorpusItemIds.length,
    reviewUnitCount: candidate.reviewUnitIds.length,
    corpusRoleInDerivation:
      'grounding_pressure_and_missing_context_test_not_direct_view_content',
    reviewReceiptRoleInDerivation:
      'provisional_kernel_structure_acceptance_not_semantic_view_content_review',
    seedRoleInDerivation:
      'semantic_work_design_prior_to_be_reconstructed_through_axiom_kernel_eval',
    requiredNextOperation:
      'content_level_semantic_reconstruction_before_public_guide_slot_filling',
    semanticReviewStatus: 'semantic_view_review_required_before_public_copy',
    publicGuideReadiness: 'not_ready_for_public_guide_copy',
  };
}

export function buildAxiomKernelSemanticWorkDesignViewDerivation(
  corpusReadout: AxiomKernelCorpusManualDocumentReadout =
    buildAxiomKernelCorpusManualDocumentReadout(),
  reviewReceipt: AxiomKernelCorpusHumanReviewResultReceipt =
    buildAxiomKernelCorpusHumanReviewResultReceipt(),
  seedContract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
  viewSet: AxiomKernelDerivedWorkDesignViewSet = buildAxiomKernelDerivedWorkDesignViewSet(
    seedContract,
    corpusReadout,
  ),
): AxiomKernelSemanticWorkDesignViewDerivation {
  return {
    derivationId: `axiom_kernel_semantic_work_design_view_derivation_from_${viewSet.viewSetId}`,
    objectType: 'axiom_kernel_semantic_work_design_view_derivation',
    contractVersion: AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_VERSION,
    lane: 'Falcon Lab',
    status: 'semantic_work_design_view_derivation_bridge_ready_internal',
    boundary: AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY,
    strengthensCore: [
      ...AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_CORE_PROGRESS_CLASSES,
    ],
    sourceCorpusReadoutId: corpusReadout.readoutId,
    sourceReviewReceiptId: reviewReceipt.receiptId,
    sourceSeedContractId: seedContract.contractId,
    sourceViewSetId: viewSet.viewSetId,
    sourceLayerLedger: layerLedger(),
    derivationMethod:
      'semantic_reconstruction_not_simple_count_matching_or_review_unit_substitution',
    falseEquivalenceGuards: [
      'do_not_treat_18_review_units_as_21_27_semantic_content_review',
      'do_not_treat_15_kernel_items_as_work_design_view_content',
      'do_not_simple_match_15_items_to_27_seeds',
      'do_not_replace_l3_semantic_prior_with_internal_information_governance_rules',
    ],
    bridgeCandidateCount: viewSet.candidates.length,
    bridgeCandidates: viewSet.candidates.map(bridgeCandidate),
    humanReviewNeed:
      'semantic_view_level_review_still_required_even_after_18_unit_kernel_structure_acceptance',
    nextAllowedStep:
      'rebuild_work_design_views_guide_slots_from_semantic_bridge_candidates_with_review_route',
    notNow: [
      'no_semantic_view_content_approval_from_18_review_units',
      'no_final_view_count_from_15_kernel_items',
      'no_simple_matching_between_15_18_and_27_layers',
      'no_public_guide_copy_until_semantic_reconstruction_and_review_route',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...corpusReadout.notNow,
      ...reviewReceipt.notNow,
      ...viewSet.notNow,
    ],
  };
}

export function validateAxiomKernelSemanticWorkDesignViewDerivation(
  derivation: AxiomKernelSemanticWorkDesignViewDerivation,
  corpusReadout: AxiomKernelCorpusManualDocumentReadout =
    buildAxiomKernelCorpusManualDocumentReadout(),
  reviewReceipt: AxiomKernelCorpusHumanReviewResultReceipt =
    buildAxiomKernelCorpusHumanReviewResultReceipt(),
  seedContract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
  viewSet: AxiomKernelDerivedWorkDesignViewSet = buildAxiomKernelDerivedWorkDesignViewSet(
    seedContract,
    corpusReadout,
  ),
): AxiomKernelSemanticWorkDesignViewDerivationValidation {
  const errors: string[] = [];
  const corpusValidation = validateAxiomKernelCorpusManualDocumentReadout(corpusReadout);
  const receiptValidation = validateAxiomKernelCorpusHumanReviewResultReceipt(reviewReceipt);
  const seedContractValidation = validateAxiomKernelDerivedWorkDesignViewsContract(seedContract);
  const viewSetValidation = validateAxiomKernelDerivedWorkDesignViewSet(
    viewSet,
    seedContract,
    corpusReadout,
  );
  const layersById = new Map(derivation.sourceLayerLedger.map((layer) => [layer.layerId, layer]));

  pushIf(!corpusValidation.valid, errors, 'source_15_item_kernel_corpus_must_be_valid');
  pushIf(!receiptValidation.valid, errors, 'source_18_unit_review_receipt_must_be_valid');
  pushIf(!seedContractValidation.valid, errors, 'source_27_seed_contract_must_be_valid');
  pushIf(!viewSetValidation.valid, errors, 'source_view_set_scaffold_must_be_valid');
  pushIf(
    derivation.objectType !== 'axiom_kernel_semantic_work_design_view_derivation',
    errors,
    'object_type_must_match_semantic_work_design_view_derivation',
  );
  pushIf(derivation.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    derivation.boundary !== AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY,
    errors,
    'boundary_must_distinguish_15_18_27_layers',
  );
  pushIf(
    derivation.derivationMethod !==
      'semantic_reconstruction_not_simple_count_matching_or_review_unit_substitution',
    errors,
    'derivation_method_must_not_be_simple_matching_or_review_unit_substitution',
  );
  pushIf(
    !derivation.falseEquivalenceGuards.includes(
      'do_not_treat_18_review_units_as_21_27_semantic_content_review',
    ) ||
      !derivation.falseEquivalenceGuards.includes(
        'do_not_treat_15_kernel_items_as_work_design_view_content',
      ) ||
      !derivation.falseEquivalenceGuards.includes('do_not_simple_match_15_items_to_27_seeds'),
    errors,
    'false_equivalence_guards_must_block_15_18_27_confusion',
  );

  pushIf(
    layersById.get('fifteen_item_kernel_corpus')?.unitCount !== 15 ||
      layersById.get('fifteen_item_kernel_corpus')?.role !==
        'evidence_grounded_reasoning_material' ||
      layersById.get('fifteen_item_kernel_corpus')?.isWorkDesignViewContent !== false,
    errors,
    '15_item_layer_must_be_evidence_material_not_view_content',
  );
  pushIf(
    layersById.get('eighteen_compressed_kernel_review_units')?.unitCount !== 18 ||
      layersById.get('eighteen_compressed_kernel_review_units')?.role !==
        'compressed_structure_boundary_review_receipt' ||
      layersById.get('eighteen_compressed_kernel_review_units')?.isSemanticReviewApproval !== false,
    errors,
    '18_review_unit_layer_must_be_structure_review_not_semantic_approval',
  );
  pushIf(
    layersById.get('twenty_seven_l3_semantic_seed_prior')?.unitCount !== 27 ||
      layersById.get('twenty_seven_l3_semantic_seed_prior')?.role !==
        'content_rich_work_design_semantic_prior' ||
      layersById.get('twenty_seven_l3_semantic_seed_prior')?.mustNotBeUsedAs !==
        'fixed_axiom_view_count',
    errors,
    '27_seed_layer_must_be_semantic_prior_not_fixed_count',
  );

  pushIf(
    derivation.bridgeCandidateCount !== derivation.bridgeCandidates.length ||
      derivation.bridgeCandidateCount !== viewSet.candidates.length,
    errors,
    'bridge_candidate_count_must_match_source_view_set_scaffold',
  );
  pushIf(
    derivation.humanReviewNeed !==
      'semantic_view_level_review_still_required_even_after_18_unit_kernel_structure_acceptance',
    errors,
    'semantic_view_review_must_remain_required_after_18_unit_receipt',
  );
  pushIf(
    derivation.nextAllowedStep !==
      'rebuild_work_design_views_guide_slots_from_semantic_bridge_candidates_with_review_route',
    errors,
    'next_step_must_rebuild_guide_slots_with_review_route',
  );
  pushIf(
    !derivation.notNow.includes('no_semantic_view_content_approval_from_18_review_units') ||
      !derivation.notNow.includes('no_final_view_count_from_15_kernel_items') ||
      !derivation.notNow.includes('no_simple_matching_between_15_18_and_27_layers') ||
      !derivation.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !derivation.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_semantic_approval_final_count_simple_matching_runtime_and_learning',
  );

  for (const candidate of derivation.bridgeCandidates) {
    pushIf(
      candidate.corpusRoleInDerivation !==
        'grounding_pressure_and_missing_context_test_not_direct_view_content',
      errors,
      `candidate_corpus_role_must_not_be_view_content:${candidate.bridgeCandidateId}`,
    );
    pushIf(
      candidate.reviewReceiptRoleInDerivation !==
        'provisional_kernel_structure_acceptance_not_semantic_view_content_review',
      errors,
      `candidate_review_receipt_role_must_not_be_semantic_review:${candidate.bridgeCandidateId}`,
    );
    pushIf(
      candidate.seedRoleInDerivation !==
        'semantic_work_design_prior_to_be_reconstructed_through_axiom_kernel_eval',
      errors,
      `candidate_seed_role_must_be_semantic_prior:${candidate.bridgeCandidateId}`,
    );
    pushIf(
      candidate.semanticReviewStatus !== 'semantic_view_review_required_before_public_copy' ||
        candidate.publicGuideReadiness !== 'not_ready_for_public_guide_copy',
      errors,
      `candidate_must_require_semantic_review_before_public_copy:${candidate.bridgeCandidateId}`,
    );
    pushIf(
      candidate.sourceSeedLabelsJa.length !== candidate.sourceSeedCount ||
        candidate.sourceSeedLabelsJa.length === 0,
      errors,
      `candidate_must_preserve_seed_meaning_labels:${candidate.bridgeCandidateId}`,
    );
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_semantic_work_design_view_derivation_valid'
        : 'kernel_semantic_work_design_view_derivation_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY,
    strengthensCore: [
      ...AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_CORE_PROGRESS_CLASSES,
    ],
  };
}
