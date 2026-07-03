import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  type AxiomActionabilityBand,
  type AxiomCoreProgressClass,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';
import {
  buildAxiomKernelCorpusManualDocumentReadout,
  validateAxiomKernelCorpusManualDocumentReadout,
  type AxiomKernelCorpusManualDocumentReadout,
} from './kernelCorpusManualDocumentReadout';
import {
  AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
  buildAxiomKernelDerivedWorkDesignViewsContract,
  validateAxiomKernelDerivedWorkDesignViewsContract,
  type AxiomKernelDerivedViewSeed,
  type AxiomKernelDerivedWorkDesignViewsContract,
} from './kernelDerivedWorkDesignViewsContract';

export const AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY =
  'axiom_kernel_derived_work_design_view_set_is_current_internal_eval_output_not_fixed_public_view_count_or_publication' as const;

export const AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_build',
  'kernel_grounding',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type SeedMovement =
  | 'merge_into_current_view_candidate'
  | 'attach_as_cross_cutting_check_axis';

type ViewCandidateDefinition = {
  viewId: string;
  labelJa: string;
  readingQuestionJa: string;
  seedIds: string[];
  scenarioIds: string[];
};

export type AxiomKernelDerivedWorkDesignViewSeedEval = {
  seedId: string;
  labelJa: string;
  seedKind: AxiomKernelDerivedViewSeed['seedKind'];
  movement: SeedMovement;
  targetViewId: string;
  status:
    'evaluated_as_bootstrap_prior_and_compressed_into_current_view_candidate_not_final';
};

export type AxiomKernelDerivedWorkDesignViewCandidate = {
  viewId: string;
  labelJa: string;
  readingQuestionJa: string;
  candidateStatus:
    'current_kernel_eval_view_candidate_review_required_not_final_public_view';
  sourceSeedIds: string[];
  sourceSeedCount: number;
  seedEvals: AxiomKernelDerivedWorkDesignViewSeedEval[];
  sourceCorpusItemIds: string[];
  sourcePacketIds: string[];
  sourceScenarioIds: string[];
  sourceFamilyEntryIds: string[];
  groundedFields: AxiomKernelGroundedField[];
  actionabilityBands: AxiomActionabilityBand[];
  missingContextSlots: AxiomMissingContextSlot[];
  reviewUnitIds: string[];
  corpusTraceStatus: 'traced_to_15_item_kernel_corpus_without_raw_source_export';
  humanReviewRoute:
    'compressed_view_candidate_review_before_public_guide_or_downstream_content';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomKernelDerivedWorkDesignViewSet = {
  viewSetId: string;
  objectType: 'axiom_kernel_derived_work_design_view_set';
  contractVersion: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_VERSION;
  lane: 'Falcon Lab';
  status: 'current_kernel_eval_derived_view_candidates_ready_internal';
  boundary: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY;
  inheritedViewBoundary: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_CORE_PROGRESS_CLASSES;
  sourceContractId: string;
  sourceCorpusReadoutId: string;
  sourceCorpusItemCount: 15;
  bootstrapPriorSeedCount: 27;
  evaluatedSeedCount: number;
  currentDerivedViewCandidateCount: number;
  viewCountStatus: 'current_eval_candidate_count_not_final';
  viewCountPolicy:
    'derived_from_current_kernel_corpus_eval_not_hardcoded_from_falcon_or_l3';
  candidates: AxiomKernelDerivedWorkDesignViewCandidate[];
  coverage: {
    evaluatedSeedIds: string[];
    representedCorpusItemIds: string[];
    representedScenarioIds: string[];
    representedSourceFamilyEntryIds: string[];
    representedReviewUnitIds: string[];
    groundedFieldsCovered: Record<AxiomKernelGroundedField, 'covered'>;
  };
  humanReviewCompression: {
    currentViewCandidateReviewUnitCount: number;
    maxCoreHumanReviewUnits: 100;
    reviewUnitScale: 'derived_view_candidate_unit_not_individual_hypothesis';
  };
  mustNotTreatAs: readonly [
    'final_view_count',
    'fixed_21_views',
    'public_copy',
    'source_support_validity_finality',
    'candidate_pattern_promotion',
    'publication_approval',
  ];
  notNow: string[];
};

export type AxiomKernelDerivedWorkDesignViewSetValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_derived_work_design_view_set_valid'
    | 'kernel_derived_work_design_view_set_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_CORE_PROGRESS_CLASSES;
};

const VIEW_CANDIDATE_DEFINITIONS: ViewCandidateDefinition[] = [
  {
    viewId: 'kernel_view_candidate_health_time_recovery_and_life_security',
    labelJa: '健康時間・回復・生活保障を一つの仕事条件として読む',
    readingQuestionJa:
      '体調変動、治療、休職復職、移動、生活保障、評価時間を別々に扱わず、働ける条件の時間設計として読めているか。',
    seedIds: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-03', 'L3-PIP-04', 'L3-PIP-05', 'L3-PIP-06', 'L3-PIP-07'],
    scenarioIds: [
      'l3_health_time_accommodation_lookup_trap_v0',
      'l3_post_hiring_quality_evaluation_loop_v0',
    ],
  },
  {
    viewId: 'kernel_view_candidate_entry_disclosure_translation_and_support_line',
    labelJa: '入口・開示・翻訳・支援接続を一続きの参加回路として読む',
    readingQuestionJa:
      '求人、応募、面接、開示、情報形式、支援接続が、本人だけの説明努力ではなく相互翻訳の回路として設計されているか。',
    seedIds: ['L3-PIP-08', 'L3-PIP-09', 'L3-PIP-10', 'L3-PIP-11', 'L3-PIP-12', 'L3-PIP-13'],
    scenarioIds: [
      'l3_disclosure_information_procedure_boundary_v0',
      'l3_public_condition_window_non_lookup_v0',
    ],
  },
  {
    viewId: 'kernel_view_candidate_source_lens_boundary_and_counter_reading',
    labelJa: 'source lens・反対仮説・公開境界を同時に読む',
    readingQuestionJa:
      '条件窓をlookupにせず、根拠lens差、別解釈、開示同意、公開境界、learning loop停止点を保持しているか。',
    seedIds: ['L3-PIP-14', 'L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-26', 'L3-CCA-27'],
    scenarioIds: [
      'l3_policy_service_coordination_source_lens_v0',
      'l3_public_condition_window_non_lookup_v0',
      'l3_disclosure_information_procedure_boundary_v0',
    ],
  },
  {
    viewId: 'kernel_view_candidate_worksite_procedure_sensory_cognitive_capacity',
    labelJa: '作業手順・安全余力・感覚認知負荷を実装条件として読む',
    readingQuestionJa:
      '道具、設備、安全、顧客、人員余力、会議文書音声、タスク切替、記憶負荷が、配慮名ではなく現場実装条件として見えているか。',
    seedIds: ['L3-PIP-15', 'L3-PIP-16', 'L3-PIP-17', 'L3-PIP-18', 'L3-PIP-21'],
    scenarioIds: [
      'l3_policy_service_coordination_source_lens_v0',
      'l3_disclosure_information_procedure_boundary_v0',
      'l3_post_hiring_quality_evaluation_loop_v0',
    ],
  },
  {
    viewId: 'kernel_view_candidate_value_evaluation_growth_and_future_loop',
    labelJa: '役割・評価・処遇・学習成長を将来ループとして読む',
    readingQuestionJa:
      '採用後の参加が空洞化せず、役割、評価、処遇、学習、キャリア、見直しが価値翻訳のループとして続いているか。',
    seedIds: ['L3-PIP-19', 'L3-PIP-20'],
    scenarioIds: ['l3_post_hiring_quality_evaluation_loop_v0'],
  },
];

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function fieldCoverage(): Record<AxiomKernelGroundedField, 'covered'> {
  return Object.fromEntries(
    AXIOM_KERNEL_GROUNDED_FIELDS.map((field) => [field, 'covered']),
  ) as Record<AxiomKernelGroundedField, 'covered'>;
}

function seedMovement(seed: AxiomKernelDerivedViewSeed): SeedMovement {
  return seed.seedKind === 'l3_cross_cutting_axis'
    ? 'attach_as_cross_cutting_check_axis'
    : 'merge_into_current_view_candidate';
}

function buildCandidate(
  definition: ViewCandidateDefinition,
  contract: AxiomKernelDerivedWorkDesignViewsContract,
  readout: AxiomKernelCorpusManualDocumentReadout,
): AxiomKernelDerivedWorkDesignViewCandidate {
  const sourceSeeds = definition.seedIds
    .map((seedId) => contract.seeds.find((seedItem) => seedItem.seedId === seedId))
    .filter((seedItem): seedItem is AxiomKernelDerivedViewSeed => Boolean(seedItem));
  const corpusItems = readout.corpusItems.filter((item) =>
    definition.scenarioIds.includes(item.scenarioId),
  );

  return {
    viewId: definition.viewId,
    labelJa: definition.labelJa,
    readingQuestionJa: definition.readingQuestionJa,
    candidateStatus:
      'current_kernel_eval_view_candidate_review_required_not_final_public_view',
    sourceSeedIds: definition.seedIds,
    sourceSeedCount: definition.seedIds.length,
    seedEvals: sourceSeeds.map((seedItem) => ({
      seedId: seedItem.seedId,
      labelJa: seedItem.labelJa,
      seedKind: seedItem.seedKind,
      movement: seedMovement(seedItem),
      targetViewId: definition.viewId,
      status:
        'evaluated_as_bootstrap_prior_and_compressed_into_current_view_candidate_not_final',
    })),
    sourceCorpusItemIds: corpusItems.map((item) => item.itemId),
    sourcePacketIds: unique(corpusItems.map((item) => item.packetId)),
    sourceScenarioIds: unique(corpusItems.map((item) => item.scenarioId)),
    sourceFamilyEntryIds: unique(corpusItems.flatMap((item) => item.sourceFamilyEntryIds)),
    groundedFields: [...AXIOM_KERNEL_GROUNDED_FIELDS],
    actionabilityBands: unique(corpusItems.map((item) => item.actionabilityBand)),
    missingContextSlots: unique(corpusItems.flatMap((item) => item.missingContextSlots)),
    reviewUnitIds: unique(corpusItems.flatMap((item) => item.reviewUnitIds)),
    corpusTraceStatus: 'traced_to_15_item_kernel_corpus_without_raw_source_export',
    humanReviewRoute:
      'compressed_view_candidate_review_before_public_guide_or_downstream_content',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

export function buildAxiomKernelDerivedWorkDesignViewSet(
  contract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
  readout: AxiomKernelCorpusManualDocumentReadout = buildAxiomKernelCorpusManualDocumentReadout(),
): AxiomKernelDerivedWorkDesignViewSet {
  const candidates = VIEW_CANDIDATE_DEFINITIONS.map((definition) =>
    buildCandidate(definition, contract, readout),
  );
  const evaluatedSeedIds = unique(candidates.flatMap((candidate) => candidate.sourceSeedIds));
  const representedCorpusItemIds = unique(
    candidates.flatMap((candidate) => candidate.sourceCorpusItemIds),
  );
  const representedScenarioIds = unique(
    candidates.flatMap((candidate) => candidate.sourceScenarioIds),
  );
  const representedSourceFamilyEntryIds = unique(
    candidates.flatMap((candidate) => candidate.sourceFamilyEntryIds),
  );
  const representedReviewUnitIds = unique(
    candidates.flatMap((candidate) => candidate.reviewUnitIds),
  );

  return {
    viewSetId: `axiom_kernel_derived_work_design_view_set_from_${readout.readoutId}`,
    objectType: 'axiom_kernel_derived_work_design_view_set',
    contractVersion: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_VERSION,
    lane: 'Falcon Lab',
    status: 'current_kernel_eval_derived_view_candidates_ready_internal',
    boundary: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY,
    inheritedViewBoundary: contract.boundary,
    strengthensCore: [...AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_CORE_PROGRESS_CLASSES],
    sourceContractId: contract.contractId,
    sourceCorpusReadoutId: readout.readoutId,
    sourceCorpusItemCount: 15,
    bootstrapPriorSeedCount: contract.bootstrapPriorSeedCount,
    evaluatedSeedCount: evaluatedSeedIds.length,
    currentDerivedViewCandidateCount: candidates.length,
    viewCountStatus: 'current_eval_candidate_count_not_final',
    viewCountPolicy:
      'derived_from_current_kernel_corpus_eval_not_hardcoded_from_falcon_or_l3',
    candidates,
    coverage: {
      evaluatedSeedIds,
      representedCorpusItemIds,
      representedScenarioIds,
      representedSourceFamilyEntryIds,
      representedReviewUnitIds,
      groundedFieldsCovered: fieldCoverage(),
    },
    humanReviewCompression: {
      currentViewCandidateReviewUnitCount: candidates.length,
      maxCoreHumanReviewUnits: 100,
      reviewUnitScale: 'derived_view_candidate_unit_not_individual_hypothesis',
    },
    mustNotTreatAs: [
      'final_view_count',
      'fixed_21_views',
      'public_copy',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
      'publication_approval',
    ],
    notNow: [
      'no_final_view_count_from_current_eval_output',
      'no_fixed_21_views',
      'no_public_copy_from_current_view_candidates',
      'no_public_approval_or_publication',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...contract.mustNotTreatAs.map((item) => `contract_must_not_treat_as:${item}`),
      ...readout.notNow,
    ],
  };
}

export function validateAxiomKernelDerivedWorkDesignViewSet(
  viewSet: AxiomKernelDerivedWorkDesignViewSet,
  contract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
  readout: AxiomKernelCorpusManualDocumentReadout = buildAxiomKernelCorpusManualDocumentReadout(),
): AxiomKernelDerivedWorkDesignViewSetValidation {
  const errors: string[] = [];
  const contractValidation = validateAxiomKernelDerivedWorkDesignViewsContract(contract);
  const readoutValidation = validateAxiomKernelCorpusManualDocumentReadout(readout);
  const expectedSeedIds = new Set(contract.seeds.map((seed) => seed.seedId));
  const actualSeedIds = new Set(viewSet.coverage.evaluatedSeedIds);
  const readoutItemIds = new Set(readout.corpusItems.map((item) => item.itemId));

  pushIf(!contractValidation.valid, errors, 'source_kernel_derived_views_contract_must_be_valid');
  pushIf(!readoutValidation.valid, errors, 'source_15_item_kernel_corpus_readout_must_be_valid');
  pushIf(
    viewSet.objectType !== 'axiom_kernel_derived_work_design_view_set',
    errors,
    'object_type_must_match_kernel_derived_work_design_view_set',
  );
  pushIf(viewSet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    viewSet.boundary !== AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY,
    errors,
    'boundary_must_remain_current_eval_output_not_fixed_public_view_count',
  );
  pushIf(
    viewSet.inheritedViewBoundary !== AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
    errors,
    'inherited_view_boundary_must_state_l3_21_27_is_bootstrap_prior',
  );
  pushIf(
    viewSet.sourceCorpusItemCount !== 15 ||
      readout.corpusItems.length !== 15 ||
      viewSet.coverage.representedCorpusItemIds.length !== 15,
    errors,
    'view_set_must_trace_to_all_15_kernel_corpus_items',
  );
  pushIf(
    viewSet.bootstrapPriorSeedCount !== 27 ||
      viewSet.evaluatedSeedCount !== 27 ||
      actualSeedIds.size !== 27,
    errors,
    'view_set_must_evaluate_all_27_bootstrap_prior_seeds',
  );
  for (const seedId of expectedSeedIds) {
    pushIf(!actualSeedIds.has(seedId), errors, `bootstrap_seed_missing_from_view_eval:${seedId}`);
  }
  pushIf(
    viewSet.viewCountStatus !== 'current_eval_candidate_count_not_final' ||
      viewSet.viewCountPolicy !==
        'derived_from_current_kernel_corpus_eval_not_hardcoded_from_falcon_or_l3',
    errors,
    'view_count_must_remain_current_eval_candidate_count_not_final',
  );
  pushIf(
    viewSet.humanReviewCompression.currentViewCandidateReviewUnitCount !==
      viewSet.candidates.length ||
      viewSet.humanReviewCompression.currentViewCandidateReviewUnitCount >
        viewSet.humanReviewCompression.maxCoreHumanReviewUnits,
    errors,
    'view_candidate_review_units_must_match_candidates_and_remain_under_100',
  );
  pushIf(
    !viewSet.mustNotTreatAs.includes('final_view_count') ||
      !viewSet.mustNotTreatAs.includes('fixed_21_views') ||
      !viewSet.mustNotTreatAs.includes('public_copy'),
    errors,
    'view_set_must_not_be_treated_as_final_count_fixed_21_or_public_copy',
  );
  pushIf(
    !viewSet.notNow.includes('no_final_view_count_from_current_eval_output') ||
      !viewSet.notNow.includes('no_fixed_21_views') ||
      !viewSet.notNow.includes('no_public_copy_from_current_view_candidates') ||
      !viewSet.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !viewSet.notNow.includes('no_learning_update'),
    errors,
    'view_set_not_now_must_block_final_count_fixed_21_public_runtime_and_learning',
  );

  for (const candidate of viewSet.candidates) {
    pushIf(
      candidate.candidateStatus !==
        'current_kernel_eval_view_candidate_review_required_not_final_public_view',
      errors,
      `candidate_must_remain_review_required_not_final:${candidate.viewId}`,
    );
    pushIf(candidate.sourceSeedIds.length === 0, errors, `candidate_missing_seed_trace:${candidate.viewId}`);
    pushIf(candidate.seedEvals.length !== candidate.sourceSeedIds.length, errors, `candidate_seed_eval_count_mismatch:${candidate.viewId}`);
    pushIf(candidate.sourceCorpusItemIds.length === 0, errors, `candidate_missing_corpus_trace:${candidate.viewId}`);
    pushIf(candidate.reviewUnitIds.length === 0, errors, `candidate_missing_review_route:${candidate.viewId}`);
    pushIf(
      candidate.publicUseStatus !== 'not_public_approved' ||
        candidate.publicationStatus !== 'not_published',
      errors,
      `candidate_must_not_be_public_approved_or_published:${candidate.viewId}`,
    );
    for (const itemId of candidate.sourceCorpusItemIds) {
      pushIf(!readoutItemIds.has(itemId), errors, `candidate_references_unknown_corpus_item:${candidate.viewId}:${itemId}`);
    }
    for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
      pushIf(!candidate.groundedFields.includes(field), errors, `candidate_missing_grounded_field:${candidate.viewId}:${field}`);
    }
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_derived_work_design_view_set_valid'
        : 'kernel_derived_work_design_view_set_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_CORE_PROGRESS_CLASSES],
  };
}
