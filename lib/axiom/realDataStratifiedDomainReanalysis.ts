import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';

export const AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_VERSION =
  'v0_2026_06_12' as const;

export const AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY =
  'axiom_stratified_domain_reanalysis_uses_derived_analysis_ready_counts_and_pattern_outputs_to_supersede_six_axis_correction_before_public_projection' as const;

export const AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomStratifiedSignalKind =
  | 'dominant_load_signal'
  | 'general_long_tail_scan_signal'
  | 'protected_low_n_disability_type_signal'
  | 'employment_phase_signal'
  | 'pattern_family_signal'
  | 'source_model_prior_signal';

export type AxiomStratifiedDomainSignal = {
  signalId: string;
  signalKind: AxiomStratifiedSignalKind;
  labelJa: string;
  sourceArtifactIds: string[];
  sourceMetric: {
    metricKind:
      | 'joint_subject_token_count'
      | 'joint_subject_keyword_count'
      | 'long_tail_health_condition_token_count'
      | 'all_scannable_layer_count'
      | 'employment_survey_respondent_count'
      | 'analysis_ready_item_coverage_count'
      | 'manifold_pattern_count'
      | 'source_model_prior_qualitative_signal';
    count?: number;
    denominator?: number;
    noteJa?: string;
  };
  interpretationJa: string;
  axisImplication:
    | 'dominant_signal_must_not_define_whole_domain'
    | 'must_split_from_existing_axis'
    | 'must_remain_visible_as_own_review_unit'
    | 'can_support_revised_axis_after_review'
    | 'method_guard_not_public_content';
};

export type AxiomLongTailHealthConditionSignal = {
  labelJa: string;
  sourceTokenColumn: `token__health_condition::${string}`;
  count: number;
  protectionReasonJa: string;
  routedToReviewUnitIds: string[];
};

export type AxiomUpperDisabilityCategorySignal = {
  labelJa: string;
  sourceFieldRawName: '分類名';
  sourceFieldDisplayName: '障害種類（ガイドブック集計用：暫定）';
  sourceCategoryRole: 'upper_disability_category_not_detail_disease_token';
  count: number;
  denominator: 4553;
  protectionReasonJa: string;
  routedToReviewUnitIds: string[];
};

export type AxiomEmploymentPhaseCoverageAudit = {
  auditId: 'employment_survey_3000_employment_phase_coverage_audit_v0_2026_06_12';
  sourceDatasetId: 'employment_survey_3000';
  sourceFields: {
    workExperienceRawName: '8就労経験';
    preEntryStructuredGroup: '7系 就職前や就職活動の職業的課題';
    preEntryFreeTextRawName: '７記述';
  };
  totalRespondents: 4553;
  currentIncomeWorkCount: 2340;
  currentIncomeWorkPercent: '51.4%';
  nonCurrentIncomeWorkCount: 1630;
  nonCurrentIncomeWorkPercent: '35.8%';
  neverIncomeWorkCount: 560;
  neverIncomeWorkPercent: '12.3%';
  q7StructuredAnyNotUnneededRespondentCount: 3324;
  q7StructuredAnyNotUnneededRespondentPercent: '73.0%';
  q7StructuredProblemOrResolvedRespondentCount: 2743;
  q7StructuredProblemOrResolvedRespondentPercent: '60.2%';
  q7FreeTextRespondentCount: 926;
  q7FreeTextRespondentPercent: '20.3%';
  q7FreeTextUnitCount: 1530;
  interpretationCorrectionJa: string;
};

export type AxiomProtectedTokenLayerId =
  | 'health_condition'
  | 'narrative_concept'
  | 'narrative_field'
  | 'concept'
  | 'frame';

export type AxiomProtectedTokenSignal = {
  layerId: AxiomProtectedTokenLayerId;
  labelJa: string;
  sourceTokenColumn: `token__${AxiomProtectedTokenLayerId}::${string}`;
  count: number;
  protectionClass:
    | 'low_n_high_specificity'
    | 'semantic_slot_completeness'
    | 'phase_specific_context'
    | 'icf_frame_anchor';
  routedToReviewUnitIds: string[];
};

export type AxiomProtectedTokenLayerSummary = {
  layerId: AxiomProtectedTokenLayerId;
  sourceColumnPrefix: `token__${AxiomProtectedTokenLayerId}::`;
  totalTokenCount: number;
  protectedTokenCount: number;
  protectionRule:
    | 'protect_all_low_n_and_work_design_specific_health_condition_tokens'
    | 'protect_all_narrative_semantic_slots_including_low_n_disclosure_and_health_condition_mentions'
    | 'protect_all_narrative_fields_because_field_absence_or_low_frequency_can_mark_phase_or_questionnaire_scope'
    | 'protect_all_top_level_concept_slots_as_semantic_axes'
    | 'protect_icf_environmental_factor_anchor';
  tokens: AxiomProtectedTokenSignal[];
};

export type AxiomPatternFamilyProtection = {
  familyId: 'communication_barrier' | 'fatigue_schedule' | 'accommodation_gap';
  patternCount: number;
  protectionReasonJa: string;
  routedToReviewUnitIds: string[];
};

export type AxiomPatternLevelProtection = {
  levelId: 'global' | 'local' | 'micro';
  patternCount: number;
  protectionReasonJa: string;
};

export type AxiomSourceLensProtection = {
  sourceLensId: 'nanbyo_survey_4000' | 'historical_linked_triangular_source_family';
  sourceArtifactId: string;
  protectionReasonJa: string;
  cannotUseAsJa: string[];
  routedToReviewUnitIds: string[];
};

export type AxiomMinoritySignalProtectionPolicy = {
  policyId: 'low_n_high_specificity_signal_sweep_before_axis_rebuild';
  scope:
    'all_scannable_layers_before_axis_rebuild_not_only_founder_examples';
  scannableLayerIds: readonly [
    'joint_subject_health_condition_tokens',
    'joint_subject_narrative_concept_tokens',
    'joint_subject_narrative_field_tokens',
    'joint_subject_concept_tokens',
    'joint_subject_frame_tokens',
    'employment_survey_upper_disability_category_labels',
    'employment_survey_employment_phase_labels',
    'manifold_pattern_family_counts',
    'manifold_pattern_level_counts',
    'source_model_prior_lenses',
  ];
  lowNThresholdCount: 500;
  dominantTokenThresholdCount: 500;
  totalHealthConditionTokenCount: 22;
  longTailHealthConditionTokenCount: 18;
  upperDisabilityCategoryCount: 9;
  requiredAction:
    'scan_rank_and_route_long_tail_and_category_and_phase_signals_before_integrated_axis_rebuild';
  prohibitedShortcut: 'patch_only_examples_named_in_founder_review';
  reviewUseJa: string;
};

export type AxiomRevisedReviewUnitCandidate = {
  unitId: string;
  titleJa: string;
  unitKind: 'domain_axis_candidate' | 'method_guard_candidate';
  whyRebuiltJa: string;
  sourceSignalIds: string[];
  replacesOrSplitsPriorAxisIds: string[];
  reviewRoute:
    'founder_review_required_before_integrated_domain_object_rebuild_or_surface_projection';
};

export type AxiomRealDataStratifiedDomainReanalysis = {
  reanalysisId: string;
  objectType: 'axiom_real_data_stratified_domain_reanalysis';
  contractVersion: typeof AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_VERSION;
  lane: 'Falcon Lab';
  status: 'stratified_reanalysis_complete_six_axis_candidate_superseded';
  boundary: typeof AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_CORE_PROGRESS_CLASSES;
  sourceArtifacts: {
    jointSubjectSpaceCsv: 'data/analysis_ready/pattern_library/respondents/v0/respondent_joint_subject_space.csv';
    respondentManifoldPatternsJson: 'data/analysis_ready/pattern_library/respondents/v0/respondent_manifold_patterns.json';
    employmentSurveyAnalysisReadyManifest: 'data/analysis_ready/respondents/employment_survey_3000/v0/analysis-ready-manifest.json';
    employmentSurveyStructuredFeaturesCsv: 'data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv';
    employmentSurveyCodebookCsv: 'data/analysis_ready/respondents/employment_survey_3000/v0/codebook.csv';
    nanbyoSourceModelPrior: 'data/specs/source-model-priors/nanbyo_survey_4000/nanbyo-kanja.source-model-prior.json';
    abc2001SourceModelPrior: 'data/specs/source-model-priors/2001_ABC_survey/2001_ABC_survey.source-model-prior-v0-2026-05-22.json';
    nanbyoPhase1PatternCardSample: 'references/derived/scima-fchma/nanbyo_survey_4000/phase1-v0-2026-05-13/phase1-founder-reviewable-pattern-card-sample-v0-2026-05-13.md';
  };
  dataProfile: {
    jointSubjectCount: 9076;
    datasetCounts: {
      employment_survey_3000: 4553;
      nanbyo_survey_4000: 4523;
    };
    noteJa: string;
  };
  oldSixAxisFinding:
    'superseded_not_safe_to_use_as_final_integrated_domain_knowledge';
  reanalysisReasonJa: string;
  generalizedProtectionFindingJa: string;
  minoritySignalProtectionPolicy: AxiomMinoritySignalProtectionPolicy;
  employmentPhaseCoverageAudit: AxiomEmploymentPhaseCoverageAudit;
  upperDisabilityCategorySignals: AxiomUpperDisabilityCategorySignal[];
  longTailHealthConditionSignals: AxiomLongTailHealthConditionSignal[];
  protectedTokenLayerSummaries: AxiomProtectedTokenLayerSummary[];
  patternFamilyProtections: AxiomPatternFamilyProtection[];
  patternLevelProtections: AxiomPatternLevelProtection[];
  sourceLensProtections: AxiomSourceLensProtection[];
  signals: AxiomStratifiedDomainSignal[];
  reviewUnitCandidateSetStatus:
    'provisional_pre_all_layer_candidate_set_requires_revalidation_after_all_layer_sweep';
  reviewUnitCandidateSetUseJa: string;
  revisedReviewUnitCount: 9;
  revisedReviewUnitCandidates: AxiomRevisedReviewUnitCandidate[];
  nextRequiredCoreMove:
    'rebuild_integrated_domain_knowledge_object_from_all_layer_reanalysis_and_revalidate_review_unit_candidates_before_surface_projection';
  notNow: string[];
};

export type AxiomRealDataStratifiedDomainReanalysisValidation = {
  valid: boolean;
  validationStatus:
    | 'real_data_stratified_domain_reanalysis_valid'
    | 'real_data_stratified_domain_reanalysis_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_CORE_PROGRESS_CLASSES;
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

const SOURCE = {
  joint:
    'data/analysis_ready/pattern_library/respondents/v0/respondent_joint_subject_space.csv',
  patterns:
    'data/analysis_ready/pattern_library/respondents/v0/respondent_manifold_patterns.json',
  employmentManifest:
    'data/analysis_ready/respondents/employment_survey_3000/v0/analysis-ready-manifest.json',
  employmentStructuredFeatures:
    'data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv',
  employmentCodebook:
    'data/analysis_ready/respondents/employment_survey_3000/v0/codebook.csv',
  nanbyoPrior:
    'data/specs/source-model-priors/nanbyo_survey_4000/nanbyo-kanja.source-model-prior.json',
  abcPrior:
    'data/specs/source-model-priors/2001_ABC_survey/2001_ABC_survey.source-model-prior-v0-2026-05-22.json',
  nanbyoPhase1:
    'references/derived/scima-fchma/nanbyo_survey_4000/phase1-v0-2026-05-13/phase1-founder-reviewable-pattern-card-sample-v0-2026-05-13.md',
} as const;

const LONG_TAIL_HEALTH_CONDITION_SIGNALS = [
  {
    labelJa: '知的障害',
    count: 432,
    routedToReviewUnitIds: [
      'revised_unit_communication_and_information_access',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
  {
    labelJa: '難病法による指定難病の診断を受けたが、医療受給者証は所持していない',
    count: 341,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
    ],
  },
  {
    labelJa: 'クローン病',
    count: 337,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
    ],
  },
  {
    labelJa: '高次脳機能障害',
    count: 282,
    routedToReviewUnitIds: [
      'revised_unit_communication_and_information_access',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
  {
    labelJa: '弱視・視野障害',
    count: 277,
    routedToReviewUnitIds: ['revised_unit_communication_and_information_access'],
  },
  {
    labelJa: '難聴',
    count: 238,
    routedToReviewUnitIds: ['revised_unit_communication_and_information_access'],
  },
  {
    labelJa: '多発性硬化症／視神経脊髄炎',
    count: 238,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
  {
    labelJa: '切断、その他',
    count: 223,
    routedToReviewUnitIds: [
      'revised_unit_worksite_contact_task_safety_tools',
      'revised_unit_communication_and_information_access',
    ],
  },
  {
    labelJa: '難病法上も障害者総合支援法上でも指定されていない難病の診断を受けている',
    count: 223,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
    ],
  },
  {
    labelJa: 'シェーグレン症候群',
    count: 207,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_communication_and_information_access',
    ],
  },
  {
    labelJa: 'てんかん',
    count: 189,
    routedToReviewUnitIds: [
      'revised_unit_worksite_contact_task_safety_tools',
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
    ],
  },
  {
    labelJa: '気分障害（うつ、そううつ等）',
    count: 187,
    routedToReviewUnitIds: [
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
      'revised_unit_support_retranslation_continuity_network',
    ],
  },
  {
    labelJa: '血液透析適用',
    count: 186,
    routedToReviewUnitIds: ['revised_unit_regular_medical_monitoring_and_treatment_time'],
  },
  {
    labelJa: 'ろうあ',
    count: 150,
    routedToReviewUnitIds: ['revised_unit_communication_and_information_access'],
  },
  {
    labelJa: '統合失調症',
    count: 150,
    routedToReviewUnitIds: [
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
      'revised_unit_support_retranslation_continuity_network',
    ],
  },
  {
    labelJa: '頸髄損傷',
    count: 146,
    routedToReviewUnitIds: [
      'revised_unit_worksite_contact_task_safety_tools',
      'revised_unit_regular_medical_monitoring_and_treatment_time',
    ],
  },
  {
    labelJa: '皮膚筋炎／多発性筋炎',
    count: 142,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
  {
    labelJa: '重症筋無力症',
    count: 141,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
] as const satisfies ReadonlyArray<{
  labelJa: string;
  count: number;
  routedToReviewUnitIds: readonly string[];
}>;

const UPPER_DISABILITY_CATEGORY_SIGNALS = [
  {
    labelJa: '難病',
    count: 2138,
    routedToReviewUnitIds: [
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
    ],
  },
  {
    labelJa: '内部障害',
    count: 757,
    routedToReviewUnitIds: ['revised_unit_regular_medical_monitoring_and_treatment_time'],
  },
  {
    labelJa: '肢体不自由',
    count: 651,
    routedToReviewUnitIds: [
      'revised_unit_worksite_contact_task_safety_tools',
      'revised_unit_communication_and_information_access',
    ],
  },
  {
    labelJa: '精神障害',
    count: 598,
    routedToReviewUnitIds: [
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
      'revised_unit_support_retranslation_continuity_network',
    ],
  },
  {
    labelJa: '聴覚・平衡機能障害',
    count: 464,
    routedToReviewUnitIds: ['revised_unit_communication_and_information_access'],
  },
  {
    labelJa: '知的障害',
    count: 432,
    routedToReviewUnitIds: [
      'revised_unit_communication_and_information_access',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
  {
    labelJa: '視覚障害',
    count: 349,
    routedToReviewUnitIds: ['revised_unit_communication_and_information_access'],
  },
  {
    labelJa: '発達障害',
    count: 335,
    routedToReviewUnitIds: [
      'revised_unit_communication_and_information_access',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
  {
    labelJa: '高次脳機能障害',
    count: 290,
    routedToReviewUnitIds: [
      'revised_unit_communication_and_information_access',
      'revised_unit_worksite_contact_task_safety_tools',
    ],
  },
] as const satisfies ReadonlyArray<{
  labelJa: string;
  count: number;
  routedToReviewUnitIds: readonly string[];
}>;

function buildLongTailHealthConditionSignals(): AxiomLongTailHealthConditionSignal[] {
  return LONG_TAIL_HEALTH_CONDITION_SIGNALS.map((signalItem) => ({
    labelJa: signalItem.labelJa,
    sourceTokenColumn: `token__health_condition::${signalItem.labelJa}`,
    count: signalItem.count,
    protectionReasonJa:
      '件数は相対的に少ないが、仕事設計上の制約・接触点・情報形式・開示境界・支援接続を変える可能性があるため、主成分的な圧縮で消してはいけない。',
    routedToReviewUnitIds: [...signalItem.routedToReviewUnitIds],
  }));
}

function buildUpperDisabilityCategorySignals(): AxiomUpperDisabilityCategorySignal[] {
  return UPPER_DISABILITY_CATEGORY_SIGNALS.map((signalItem) => ({
    labelJa: signalItem.labelJa,
    sourceFieldRawName: '分類名',
    sourceFieldDisplayName: '障害種類（ガイドブック集計用：暫定）',
    sourceCategoryRole: 'upper_disability_category_not_detail_disease_token',
    count: signalItem.count,
    denominator: 4553,
    protectionReasonJa:
      '詳細疾病・詳細障害tokenだけでは、視覚障害、聴覚・平衡機能障害、肢体不自由、内部障害、精神障害、発達障害などの上位障害種類としての仕事設計差が見えにくくなるため、別レイヤーとして保護する。',
    routedToReviewUnitIds: [...signalItem.routedToReviewUnitIds],
  }));
}

function buildEmploymentPhaseCoverageAudit(): AxiomEmploymentPhaseCoverageAudit {
  return {
    auditId: 'employment_survey_3000_employment_phase_coverage_audit_v0_2026_06_12',
    sourceDatasetId: 'employment_survey_3000',
    sourceFields: {
      workExperienceRawName: '8就労経験',
      preEntryStructuredGroup: '7系 就職前や就職活動の職業的課題',
      preEntryFreeTextRawName: '７記述',
    },
    totalRespondents: 4553,
    currentIncomeWorkCount: 2340,
    currentIncomeWorkPercent: '51.4%',
    nonCurrentIncomeWorkCount: 1630,
    nonCurrentIncomeWorkPercent: '35.8%',
    neverIncomeWorkCount: 560,
    neverIncomeWorkPercent: '12.3%',
    q7StructuredAnyNotUnneededRespondentCount: 3324,
    q7StructuredAnyNotUnneededRespondentPercent: '73.0%',
    q7StructuredProblemOrResolvedRespondentCount: 2743,
    q7StructuredProblemOrResolvedRespondentPercent: '60.2%',
    q7FreeTextRespondentCount: 926,
    q7FreeTextRespondentPercent: '20.3%',
    q7FreeTextUnitCount: 1530,
    interpretationCorrectionJa:
      '入口前・未就業・求職中の材料は低頻度ではない。現在収入のある仕事がない回答者は35.8%であり、7系の就職前/就職活動課題も大きな構造化データとして存在する。したがってcandidate 6は「低頻度保護」ではなく、就職後中心の読みで過小評価されやすい就労フェーズ信号として扱う。',
  };
}

type ProtectedTokenSpec = readonly [
  string,
  number,
  AxiomProtectedTokenSignal['protectionClass'],
  readonly string[],
];

function protectedToken(
  labelJa: string,
  count: number,
  protectionClass: AxiomProtectedTokenSignal['protectionClass'],
  routedToReviewUnitIds: readonly string[],
): ProtectedTokenSpec {
  return [labelJa, count, protectionClass, routedToReviewUnitIds] as const;
}

const PROTECTED_TOKEN_LAYERS = [
  {
    layerId: 'health_condition',
    sourceColumnPrefix: 'token__health_condition::',
    protectionRule:
      'protect_all_low_n_and_work_design_specific_health_condition_tokens',
    tokens: [
      protectedToken('難病法による指定難病の診断を受け、医療受給者証を所持している', 3835, 'semantic_slot_completeness', ['revised_unit_fluctuating_health_time_and_work_density', 'revised_unit_disclosure_stigma_and_purpose_limited_information']),
      protectedToken('難病、慢性疾患', 2348, 'semantic_slot_completeness', ['revised_unit_fluctuating_health_time_and_work_density', 'revised_unit_disclosure_stigma_and_purpose_limited_information']),
      protectedToken('潰瘍性大腸炎', 650, 'semantic_slot_completeness', ['revised_unit_fluctuating_health_time_and_work_density']),
      protectedToken('全身性エリテマトーデス', 530, 'semantic_slot_completeness', ['revised_unit_fluctuating_health_time_and_work_density']),
      ...LONG_TAIL_HEALTH_CONDITION_SIGNALS.map((signalItem) => protectedToken(
        signalItem.labelJa,
        signalItem.count,
        'low_n_high_specificity',
        signalItem.routedToReviewUnitIds,
      )),
    ],
  },
  {
    layerId: 'narrative_concept',
    sourceColumnPrefix: 'token__narrative_concept::',
    protectionRule:
      'protect_all_narrative_semantic_slots_including_low_n_disclosure_and_health_condition_mentions',
    tokens: [
      protectedToken('activity_and_participation_difficulty', 5830, 'semantic_slot_completeness', ['revised_unit_worksite_contact_task_safety_tools']),
      protectedToken('accommodation_and_support', 5794, 'semantic_slot_completeness', ['revised_unit_support_retranslation_continuity_network', 'revised_unit_worksite_contact_task_safety_tools']),
      protectedToken('narrative_units', 4284, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('health_condition', 246, 'low_n_high_specificity', ['revised_unit_fluctuating_health_time_and_work_density', 'revised_unit_regular_medical_monitoring_and_treatment_time']),
      protectedToken('disclosure_and_explanation', 189, 'low_n_high_specificity', ['revised_unit_disclosure_stigma_and_purpose_limited_information']),
    ],
  },
  {
    layerId: 'narrative_field',
    sourceColumnPrefix: 'token__narrative_field::',
    protectionRule:
      'protect_all_narrative_fields_because_field_absence_or_low_frequency_can_mark_phase_or_questionnaire_scope',
    tokens: [
      protectedToken('xQ7', 4479, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('xQ16', 4478, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('xQ6', 4476, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('xQ15', 4469, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('xQ10', 4463, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('9記述', 2074, 'phase_specific_context', ['revised_unit_role_value_growth_quality_loop']),
      protectedToken('自由記述', 1877, 'phase_specific_context', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('10記述', 927, 'phase_specific_context', ['revised_unit_worksite_contact_task_safety_tools']),
      protectedToken('７記述', 926, 'phase_specific_context', ['revised_unit_pre_entry_job_image_and_transition']),
      protectedToken('11記述', 880, 'phase_specific_context', ['revised_unit_support_retranslation_continuity_network']),
      protectedToken('xQ01', 815, 'semantic_slot_completeness', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('xQ21', 656, 'semantic_slot_completeness', ['revised_unit_role_value_growth_quality_loop']),
      protectedToken('6記述', 511, 'phase_specific_context', ['revised_unit_pre_entry_job_image_and_transition']),
      protectedToken('5記述', 491, 'phase_specific_context', ['revised_unit_pre_entry_job_image_and_transition']),
      protectedToken('xQ05', 246, 'low_n_high_specificity', ['revised_unit_source_lens_universal_structure_and_boundary_guard']),
      protectedToken('9その他', 238, 'low_n_high_specificity', ['revised_unit_role_value_growth_quality_loop']),
      protectedToken('xQ15-3', 189, 'low_n_high_specificity', ['revised_unit_disclosure_stigma_and_purpose_limited_information']),
      protectedToken('xQ11', 149, 'low_n_high_specificity', ['revised_unit_support_retranslation_continuity_network']),
    ],
  },
  {
    layerId: 'concept',
    sourceColumnPrefix: 'token__concept::',
    protectionRule: 'protect_all_top_level_concept_slots_as_semantic_axes',
    tokens: [
      protectedToken('self_efficacy_and_future_outlook', 4430, 'semantic_slot_completeness', ['revised_unit_role_value_growth_quality_loop']),
      protectedToken('accommodation_and_support', 4293, 'semantic_slot_completeness', ['revised_unit_support_retranslation_continuity_network', 'revised_unit_worksite_contact_task_safety_tools']),
      protectedToken('disclosure_and_explanation', 3368, 'semantic_slot_completeness', ['revised_unit_disclosure_stigma_and_purpose_limited_information']),
    ],
  },
  {
    layerId: 'frame',
    sourceColumnPrefix: 'token__frame::',
    protectionRule: 'protect_icf_environmental_factor_anchor',
    tokens: [
      protectedToken('environmental_factors', 4306, 'icf_frame_anchor', ['revised_unit_worksite_contact_task_safety_tools', 'revised_unit_support_retranslation_continuity_network']),
    ],
  },
] as const satisfies ReadonlyArray<{
  layerId: AxiomProtectedTokenLayerId;
  sourceColumnPrefix: `token__${AxiomProtectedTokenLayerId}::`;
  protectionRule: AxiomProtectedTokenLayerSummary['protectionRule'];
  tokens: readonly (readonly [
    string,
    number,
    AxiomProtectedTokenSignal['protectionClass'],
    readonly string[],
  ])[];
}>;

function buildProtectedTokenLayerSummaries(): AxiomProtectedTokenLayerSummary[] {
  return PROTECTED_TOKEN_LAYERS.map((layer) => ({
    layerId: layer.layerId,
    sourceColumnPrefix: layer.sourceColumnPrefix,
    totalTokenCount: layer.tokens.length,
    protectedTokenCount: layer.tokens.length,
    protectionRule: layer.protectionRule,
    tokens: layer.tokens.map(([labelJa, count, protectionClass, routedToReviewUnitIds]) => ({
      layerId: layer.layerId,
      labelJa,
      sourceTokenColumn: `${layer.sourceColumnPrefix}${labelJa}`,
      count,
      protectionClass,
      routedToReviewUnitIds: [...routedToReviewUnitIds],
    })),
  }));
}

function buildPatternFamilyProtections(): AxiomPatternFamilyProtection[] {
  return [
    {
      familyId: 'communication_barrier',
      patternCount: 16,
      protectionReasonJa:
        'コミュニケーション障壁は疲労・時間軸へ吸収せず、情報形式、会議、説明、理解、意思疎通の仕事条件として保持する。',
      routedToReviewUnitIds: ['revised_unit_communication_and_information_access'],
    },
    {
      familyId: 'fatigue_schedule',
      patternCount: 21,
      protectionReasonJa:
        '疲労・時間scheduleは大きなfamilyだが、これだけで統合知識全体を代表させない。',
      routedToReviewUnitIds: ['revised_unit_fluctuating_health_time_and_work_density'],
    },
    {
      familyId: 'accommodation_gap',
      patternCount: 7,
      protectionReasonJa:
        '件数は小さいが、配慮が制度名や善意で止まり、実際の仕事条件へ翻訳されない構造を示すため必ず保持する。',
      routedToReviewUnitIds: [
        'revised_unit_worksite_contact_task_safety_tools',
        'revised_unit_support_retranslation_continuity_network',
      ],
    },
  ];
}

function buildPatternLevelProtections(): AxiomPatternLevelProtection[] {
  return [
    {
      levelId: 'global',
      patternCount: 11,
      protectionReasonJa:
        '全体に反復する構造を見るが、globalだけを真理扱いしてlocal/microを潰さない。',
    },
    {
      levelId: 'local',
      patternCount: 17,
      protectionReasonJa:
        '特定の条件窓や場面で立ち上がる構造を、全体平均に吸収せず保持する。',
    },
    {
      levelId: 'micro',
      patternCount: 16,
      protectionReasonJa:
        '少数の具体的接触点から見える実装条件を、例外やノイズとして捨てない。',
    },
  ];
}

function buildSourceLensProtections(): AxiomSourceLensProtection[] {
  return [
    {
      sourceLensId: 'nanbyo_survey_4000',
      sourceArtifactId: SOURCE.nanbyoPrior,
      protectionReasonJa:
        '難病データは健康時間・開示・変動の高密度信号を持つが、それだけで障害者就労全体を代表させず、source lensとして重みと限界を同時に持つ。',
      cannotUseAsJa: [
        '障害者就労全体の単独代表',
        '疾患名から配慮を直結する辞書',
        'source/support validityの最終判断',
      ],
      routedToReviewUnitIds: [
        'revised_unit_fluctuating_health_time_and_work_density',
        'revised_unit_disclosure_stigma_and_purpose_limited_information',
        'revised_unit_source_lens_universal_structure_and_boundary_guard',
      ],
    },
    {
      sourceLensId: 'historical_linked_triangular_source_family',
      sourceArtifactId: SOURCE.abcPrior,
      protectionReasonJa:
        '2001 ABCは時代差を持つが、身体・感覚・内部・知的障害などの多様性比較と普遍構造候補の発見材料として保持する。',
      cannotUseAsJa: [
        '現行日本実務の答え',
        '制度差を無視した直接転用',
        'current-policy claim',
      ],
      routedToReviewUnitIds: [
        'revised_unit_communication_and_information_access',
        'revised_unit_regular_medical_monitoring_and_treatment_time',
        'revised_unit_source_lens_universal_structure_and_boundary_guard',
      ],
    },
  ];
}

function signal(
  input: Omit<AxiomStratifiedDomainSignal, 'sourceArtifactIds'> & {
    sourceArtifactIds?: string[];
  },
): AxiomStratifiedDomainSignal {
  return {
    ...input,
    sourceArtifactIds: input.sourceArtifactIds ?? [SOURCE.joint],
  };
}

function reviewUnit(
  input: Omit<AxiomRevisedReviewUnitCandidate, 'reviewRoute'>,
): AxiomRevisedReviewUnitCandidate {
  return {
    ...input,
    reviewRoute:
      'founder_review_required_before_integrated_domain_object_rebuild_or_surface_projection',
  };
}

function buildSignals(): AxiomStratifiedDomainSignal[] {
  return [
    signal({
      signalId: 'signal_rare_disease_designated_heavy_loading',
      signalKind: 'dominant_load_signal',
      labelJa: '指定難病・慢性疾患系の負荷量が強い',
      sourceMetric: {
        metricKind: 'joint_subject_token_count',
        count: 3835,
        denominator: 9076,
        noteJa: '指定難病医療受給者証所持token。慢性疾患tokenは2348。',
      },
      interpretationJa:
        '難病系の健康時間・開示・体調変動は大きな主成分になりやすいが、これだけでAxiom全体の専門知識を代表させると他障害種別を潰す。',
      axisImplication: 'dominant_signal_must_not_define_whole_domain',
    }),
    signal({
      signalId: 'signal_general_long_tail_health_condition_sweep',
      signalKind: 'general_long_tail_scan_signal',
      labelJa: '低頻度・高特異性の健康条件tokenを例示に限らず一括保護する',
      sourceMetric: {
        metricKind: 'long_tail_health_condition_token_count',
        count: 18,
        denominator: 22,
        noteJa:
          'joint subject spaceのhealth_condition token 22種類のうち18種類が500件未満。Founderが例示した視覚・聴覚/内部障害だけでなく、知的障害、高次脳機能障害、頸髄損傷、切断、てんかん、重症筋無力症等を含む。',
      },
      interpretationJa:
        '少数例が埋没する問題は個別例の修正ではなく、低頻度でも仕事設計上の意味が強いtokenを全件スキャンし、レビュー単位へ必ずrouteする問題として扱う。',
      axisImplication: 'method_guard_not_public_content',
    }),
    signal({
      signalId: 'signal_all_scannable_layers_before_axis_rebuild',
      signalKind: 'general_long_tail_scan_signal',
      labelJa: '軸再構成前に全scannable layerを保護する',
      sourceArtifactIds: [SOURCE.joint, SOURCE.patterns, SOURCE.nanbyoPrior, SOURCE.abcPrior],
      sourceMetric: {
        metricKind: 'all_scannable_layer_count',
        count: 10,
        noteJa:
          'health_condition、narrative_concept、narrative_field、concept、frame、上位障害種類分類、就労フェーズ、pattern family、pattern level、source-model prior lensの10層。',
      },
      interpretationJa:
        'Axiom統合知識は、件数の大きい信号を主成分的にまとめる前に、自由記述field、上位障害種類、就労フェーズ、semantic concept、local/micro pattern、source lensをすべて保持・routeしてから圧縮する。',
      axisImplication: 'method_guard_not_public_content',
    }),
    signal({
      signalId: 'signal_upper_disability_category_sweep',
      signalKind: 'general_long_tail_scan_signal',
      labelJa: '上位障害種類分類を詳細疾病tokenと別に保護する',
      sourceArtifactIds: [SOURCE.employmentStructuredFeatures, SOURCE.employmentCodebook],
      sourceMetric: {
        metricKind: 'analysis_ready_item_coverage_count',
        count: 9,
        denominator: 9,
        noteJa:
          'employment_survey_3000の「分類名」には、難病、内部障害、肢体不自由、精神障害、聴覚・平衡機能障害、知的障害、視覚障害、発達障害、高次脳機能障害の上位9カテゴリがある。',
      },
      interpretationJa:
        '詳細疾病分類だけを長尾として見ると、上位の障害種類ごとの情報アクセス、移動、定期管理、開示、支援接続の違いが消える。上位分類は詳細tokenの集計補助ではなく、別の読解レイヤーとして扱う。',
      axisImplication: 'method_guard_not_public_content',
    }),
    signal({
      signalId: 'signal_visual_hearing_information_access',
      signalKind: 'protected_low_n_disability_type_signal',
      labelJa: '視覚・聴覚の情報アクセスとコミュニケーション',
      sourceMetric: {
        metricKind: 'joint_subject_token_count',
        count: 665,
        denominator: 9076,
        noteJa: '弱視・視野障害277、難聴238、ろうあ150の合計。communication keywordは1289。',
      },
      interpretationJa:
        '視覚・聴覚の問題は、病状開示ではなく、資料、音声、会議、意思伝達、情報媒体の参加設計として分離する必要がある。',
      axisImplication: 'must_split_from_existing_axis',
    }),
    signal({
      signalId: 'signal_internal_disability_regular_monitoring',
      signalKind: 'protected_low_n_disability_type_signal',
      labelJa: '内部障害・血液透析等の定期管理時間',
      sourceMetric: {
        metricKind: 'joint_subject_token_count',
        count: 186,
        denominator: 9076,
        noteJa: '血液透析適用token。employment_survey_3000には「決められた通院を行うこと」の分析ready項目もある。',
      },
      interpretationJa:
        '内部障害の定期検診・透析・管理時間は、難病の変動/再燃とは別の時間設計問題として扱う必要がある。',
      axisImplication: 'must_split_from_existing_axis',
    }),
    signal({
      signalId: 'signal_pre_entry_job_image_and_transition',
      signalKind: 'employment_phase_signal',
      labelJa: '未就業・入口前の仕事像と移行経験',
      sourceArtifactIds: [SOURCE.joint, SOURCE.employmentManifest, SOURCE.nanbyoPhase1],
      sourceMetric: {
        metricKind: 'joint_subject_token_count',
        count: 926,
        denominator: 9076,
        noteJa:
          'employment_survey_3000の就職前/就職活動 narrative field「７記述」token。構造化項目として職場見学・職業体験、求人検索、面接練習、応募連絡も分析readyに存在する。',
      },
      interpretationJa:
        '入口前の材料は薄いのではなく、未就業者・求職者・訓練中の仕事像形成として独立に読むべきである。ただし「７記述」926件は自由記述フィールドの規模であり、未就業・非就労中の人口規模そのものではない。',
      axisImplication: 'must_remain_visible_as_own_review_unit',
    }),
    signal({
      signalId: 'signal_non_current_income_work_population',
      signalKind: 'employment_phase_signal',
      labelJa: '現在収入のある仕事がない層は低頻度ではない',
      sourceArtifactIds: [SOURCE.employmentStructuredFeatures, SOURCE.employmentManifest],
      sourceMetric: {
        metricKind: 'employment_survey_respondent_count',
        count: 1630,
        denominator: 4553,
        noteJa:
          '8就労経験: 現在は収入のある仕事がないが過去就労あり1070、過去に収入のある仕事なし560。合計1630、35.8%。',
      },
      interpretationJa:
        'candidate 6の入口前・移行期信号は低頻度だから守るのではない。就職後の職場配慮や定着データを中心に読むと、35.8%の非就労中/未就労経験層と、就職前・就職活動課題が過小評価されるため独立させる。',
      axisImplication: 'must_remain_visible_as_own_review_unit',
    }),
    signal({
      signalId: 'signal_cognitive_neuro_and_intellectual_access',
      signalKind: 'protected_low_n_disability_type_signal',
      labelJa: '認知・高次脳・知的障害の手順/理解/切替負荷',
      sourceMetric: {
        metricKind: 'joint_subject_token_count',
        count: 903,
        denominator: 9076,
        noteJa: '高次脳機能障害282、知的障害432、てんかん189の合計。cognition keywordは1507。',
      },
      interpretationJa:
        '認知・高次脳・知的障害の問題は、情報アクセス、手順設計、切替負荷、評価接点にまたがる独立信号として扱う。',
      axisImplication: 'can_support_revised_axis_after_review',
    }),
    signal({
      signalId: 'signal_mental_health_emotion_stigma',
      signalKind: 'protected_low_n_disability_type_signal',
      labelJa: '精神障害・感情負荷・スティグマ',
      sourceMetric: {
        metricKind: 'joint_subject_token_count',
        count: 337,
        denominator: 9076,
        noteJa: '気分障害187、統合失調症150の合計。emotion keywordは1107。',
      },
      interpretationJa:
        '精神障害・感情負荷は、開示リスク、対人環境、評価不安、再発/悪化を話せる条件として分けて読む。',
      axisImplication: 'can_support_revised_axis_after_review',
    }),
    signal({
      signalId: 'signal_multilevel_pattern_family_balance',
      signalKind: 'pattern_family_signal',
      labelJa: '44 manifold patternsは疲労だけでなく通信・配慮gapを分けている',
      sourceArtifactIds: [SOURCE.patterns],
      sourceMetric: {
        metricKind: 'manifold_pattern_count',
        count: 44,
        noteJa:
          'communication_barrier 16、fatigue_schedule 21、accommodation_gap 7。global/local/microの多層パターン。',
      },
      interpretationJa:
        'Falcon側の派生分析は、疲労・時間だけでなく、communication barrierとaccommodation gapを別パターン族として保持していた。',
      axisImplication: 'must_split_from_existing_axis',
    }),
    signal({
      signalId: 'signal_abc2001_diversity_condition_windows',
      signalKind: 'source_model_prior_signal',
      labelJa: '2001 ABCは身体・感覚・内部・知的障害の多様性比較に使える',
      sourceArtifactIds: [SOURCE.abcPrior],
      sourceMetric: {
        metricKind: 'source_model_prior_qualitative_signal',
        noteJa:
          'source-model priorはphysical, sensory, internal, and intellectual disability windowsが多様性条件つき比較に十分厚いと記録している。',
      },
      interpretationJa:
        '2001 ABCは後ろ向きなブレーキだけではなく、時代差を保ちながら障害種別ごとの仕事接触点を比較する材料になる。',
      axisImplication: 'method_guard_not_public_content',
    }),
  ];
}

function buildReviewUnits(): AxiomRevisedReviewUnitCandidate[] {
  return [
    reviewUnit({
      unitId: 'revised_unit_fluctuating_health_time_and_work_density',
      titleJa: '変動する健康時間・仕事密度・回復余地',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '難病系の変動・疲労・痛みは大きな信号だが、健康時間全体を代表させず、変動型の仕事密度調整として分ける。',
      sourceSignalIds: [
        'signal_rare_disease_designated_heavy_loading',
        'signal_general_long_tail_health_condition_sweep',
        'signal_multilevel_pattern_family_balance',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_health_time_life_security_work_density',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_regular_medical_monitoring_and_treatment_time',
      titleJa: '定期検診・治療・内部障害の時間条件',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '内部障害や透析等の定期管理は、難病の変動・再燃と同じ軸に潰さず、予測可能だが動かしにくい時間条件として読む。',
      sourceSignalIds: [
        'signal_general_long_tail_health_condition_sweep',
        'signal_internal_disability_regular_monitoring',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_health_time_life_security_work_density',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_communication_and_information_access',
      titleJa: '視覚・聴覚・認知を含むコミュニケーション/情報アクセス',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '感覚障害や認知負荷は、本人情報の開示ではなく、資料・音声・会議・手順・意思伝達の参加設計として独立させる。',
      sourceSignalIds: [
        'signal_general_long_tail_health_condition_sweep',
        'signal_visual_hearing_information_access',
        'signal_cognitive_neuro_and_intellectual_access',
        'signal_multilevel_pattern_family_balance',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_information_participation_disclosure_boundary',
        'axiom_domain_axis_worksite_contact_task_information_safety',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_disclosure_stigma_and_purpose_limited_information',
      titleJa: '開示・スティグマ・目的限定情報共有',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '難病・精神障害・見えにくい障害の開示リスクを、情報アクセス問題から分けて扱う。',
      sourceSignalIds: [
        'signal_general_long_tail_health_condition_sweep',
        'signal_rare_disease_designated_heavy_loading',
        'signal_mental_health_emotion_stigma',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_information_participation_disclosure_boundary',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_pre_entry_job_image_and_transition',
      titleJa: '入口前の仕事像・体験接続・移行支援',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '未就業・非就労中・就職前のデータは低頻度ではなく、応募前に仕事条件を知る/試す/相談する独立フェーズ単位として扱う。',
      sourceSignalIds: [
        'signal_pre_entry_job_image_and_transition',
        'signal_non_current_income_work_population',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_information_participation_disclosure_boundary',
        'axiom_domain_axis_value_role_growth_quality_loop',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_worksite_contact_task_safety_tools',
      titleJa: '職場接触点・作業・安全・道具の実装条件',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '作業、手順、道具、安全、人員余力は維持するが、情報アクセスと開示をこの軸に混ぜすぎない。',
      sourceSignalIds: [
        'signal_general_long_tail_health_condition_sweep',
        'signal_cognitive_neuro_and_intellectual_access',
        'signal_multilevel_pattern_family_balance',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_worksite_contact_task_information_safety',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_support_retranslation_continuity_network',
      titleJa: '支援の再翻訳・継続接続・ネットワーク機能',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '支援の存在ではなく、本人・職場・医療・制度を仕事条件に翻訳し直す機能として維持する。',
      sourceSignalIds: ['signal_multilevel_pattern_family_balance'],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_support_retranslation_continuity_network',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_role_value_growth_quality_loop',
      titleJa: '役割・評価・成長・就業後の質',
      unitKind: 'domain_axis_candidate',
      whyRebuiltJa:
        '就職・定着だけではなく、価値、役割、評価、成長、選び直しを扱う軸として維持する。',
      sourceSignalIds: [
        'signal_pre_entry_job_image_and_transition',
        'signal_non_current_income_work_population',
        'signal_abc2001_diversity_condition_windows',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_value_role_growth_quality_loop',
      ],
    }),
    reviewUnit({
      unitId: 'revised_unit_source_lens_universal_structure_and_boundary_guard',
      titleJa: 'source lens: 普遍構造候補と制度・時代差ブレーキ',
      unitKind: 'method_guard_candidate',
      whyRebuiltJa:
        '海外/歴史資料を後ろ向きなブレーキだけにせず、普遍構造候補を拾いながらcurrentnessとjurisdictionの限界を保持する。',
      sourceSignalIds: [
        'signal_all_scannable_layers_before_axis_rebuild',
        'signal_abc2001_diversity_condition_windows',
      ],
      replacesOrSplitsPriorAxisIds: [
        'axiom_domain_axis_source_lens_jurisdiction_historical_brake',
      ],
    }),
  ];
}

export function buildAxiomRealDataStratifiedDomainReanalysis(): AxiomRealDataStratifiedDomainReanalysis {
  return {
    reanalysisId:
      'axiom_real_data_stratified_domain_reanalysis_v0_2026_06_12',
    objectType: 'axiom_real_data_stratified_domain_reanalysis',
    contractVersion: AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_VERSION,
    lane: 'Falcon Lab',
    status: 'stratified_reanalysis_complete_six_axis_candidate_superseded',
    boundary: AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_CORE_PROGRESS_CLASSES],
    sourceArtifacts: {
      jointSubjectSpaceCsv: SOURCE.joint,
      respondentManifoldPatternsJson: SOURCE.patterns,
      employmentSurveyAnalysisReadyManifest: SOURCE.employmentManifest,
      employmentSurveyStructuredFeaturesCsv: SOURCE.employmentStructuredFeatures,
      employmentSurveyCodebookCsv: SOURCE.employmentCodebook,
      nanbyoSourceModelPrior: SOURCE.nanbyoPrior,
      abc2001SourceModelPrior: SOURCE.abcPrior,
      nanbyoPhase1PatternCardSample: SOURCE.nanbyoPhase1,
    },
    dataProfile: {
      jointSubjectCount: 9076,
      datasetCounts: {
        employment_survey_3000: 4553,
        nanbyo_survey_4000: 4523,
      },
      noteJa:
        '件数はほぼ均衡しているが、指定難病・慢性疾患系tokenと疲労/時間schedule信号が強いため、負荷量だけで圧縮すると難病寄りになる。',
    },
    oldSixAxisFinding:
      'superseded_not_safe_to_use_as_final_integrated_domain_knowledge',
    reanalysisReasonJa:
      '旧6軸はレビュー圧縮としては有用だったが、層別・サブグループ・就業フェーズを先に見るというAxiom再分析方針に照らすと、感覚障害の情報アクセス、内部障害の定期管理、入口前経験が混線または過小評価される。',
    generalizedProtectionFindingJa:
      'Founderが指摘した混線例は症状であって本体ではない。本体は、高頻度の難病・慢性疾患信号が強い時に、件数の少ない健康条件だけでなく、上位障害種類、就労フェーズ、自由記述field、local/micro pattern、source lensが主成分的圧縮で消える危険である。なお入口前・未就業/非就労中の材料は低頻度ではなく、就職後中心の読みで過小評価されやすい大きなフェーズ信号として扱う。',
    minoritySignalProtectionPolicy: {
      policyId: 'low_n_high_specificity_signal_sweep_before_axis_rebuild',
      scope: 'all_scannable_layers_before_axis_rebuild_not_only_founder_examples',
      scannableLayerIds: [
        'joint_subject_health_condition_tokens',
        'joint_subject_narrative_concept_tokens',
        'joint_subject_narrative_field_tokens',
        'joint_subject_concept_tokens',
        'joint_subject_frame_tokens',
        'employment_survey_upper_disability_category_labels',
        'employment_survey_employment_phase_labels',
        'manifold_pattern_family_counts',
        'manifold_pattern_level_counts',
        'source_model_prior_lenses',
      ],
      lowNThresholdCount: 500,
      dominantTokenThresholdCount: 500,
      totalHealthConditionTokenCount: 22,
      longTailHealthConditionTokenCount: 18,
      upperDisabilityCategoryCount: 9,
      requiredAction:
        'scan_rank_and_route_long_tail_and_category_and_phase_signals_before_integrated_axis_rebuild',
      prohibitedShortcut: 'patch_only_examples_named_in_founder_review',
      reviewUseJa:
        'レビュー時には、個別例の修正だけでなく、health_condition長尾18 token、上位障害種類9カテゴリ、就労フェーズ、narrative field、pattern family/level、source lensがどのreview unitにもrouteされず消えていないかを見る。',
    },
    employmentPhaseCoverageAudit: buildEmploymentPhaseCoverageAudit(),
    upperDisabilityCategorySignals: buildUpperDisabilityCategorySignals(),
    longTailHealthConditionSignals: buildLongTailHealthConditionSignals(),
    protectedTokenLayerSummaries: buildProtectedTokenLayerSummaries(),
    patternFamilyProtections: buildPatternFamilyProtections(),
    patternLevelProtections: buildPatternLevelProtections(),
    sourceLensProtections: buildSourceLensProtections(),
    signals: buildSignals(),
    reviewUnitCandidateSetStatus:
      'provisional_pre_all_layer_candidate_set_requires_revalidation_after_all_layer_sweep',
    reviewUnitCandidateSetUseJa:
      'この9件は、旧6軸を止めるために作った暫定候補セットであり、全scannable layer保護後の最終review unit構造ではない。次工程では、9件を固定入力にせず、保護されたtoken layer、pattern family/level、source lensから維持・分割・統合・rename・holdを再判定して統合知識オブジェクトを再構築する。',
    revisedReviewUnitCount: 9,
    revisedReviewUnitCandidates: buildReviewUnits(),
    nextRequiredCoreMove:
      'rebuild_integrated_domain_knowledge_object_from_all_layer_reanalysis_and_revalidate_review_unit_candidates_before_surface_projection',
    notNow: [
      'no_use_of_old_six_axis_object_as_final_axiom_domain_knowledge',
      'no_public_candidate_surface_projection_before_rebuilt_integrated_domain_object',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_public_approval_or_publication',
      'no_learning_update',
      'no_raw_sensitive_text_export',
    ],
  };
}

export function validateAxiomRealDataStratifiedDomainReanalysis(
  reanalysis: AxiomRealDataStratifiedDomainReanalysis,
): AxiomRealDataStratifiedDomainReanalysisValidation {
  const errors: string[] = [];
  const signalIds = new Set(reanalysis.signals.map((signalItem) => signalItem.signalId));
  const reviewUnitIds = new Set(
    reanalysis.revisedReviewUnitCandidates.map((unit) => unit.unitId),
  );
  const unitSignalIds = new Set(
    reanalysis.revisedReviewUnitCandidates.flatMap((unit) => unit.sourceSignalIds),
  );
  const longTailLabels = new Set(
    reanalysis.longTailHealthConditionSignals.map((signalItem) => signalItem.labelJa),
  );
  const upperDisabilityCategoryLabels = new Set(
    reanalysis.upperDisabilityCategorySignals.map((signalItem) => signalItem.labelJa),
  );
  const protectedLayerIds = new Set(
    reanalysis.protectedTokenLayerSummaries.map((layer) => layer.layerId),
  );
  const patternFamilyIds = new Set(
    reanalysis.patternFamilyProtections.map((family) => family.familyId),
  );
  const patternLevelIds = new Set(
    reanalysis.patternLevelProtections.map((level) => level.levelId),
  );
  const sourceLensIds = new Set(
    reanalysis.sourceLensProtections.map((lens) => lens.sourceLensId),
  );

  pushIf(
    reanalysis.objectType !== 'axiom_real_data_stratified_domain_reanalysis',
    errors,
    'object_type_must_be_stratified_domain_reanalysis',
  );
  pushIf(reanalysis.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    reanalysis.status !== 'stratified_reanalysis_complete_six_axis_candidate_superseded' ||
      reanalysis.oldSixAxisFinding !==
        'superseded_not_safe_to_use_as_final_integrated_domain_knowledge',
    errors,
    'six_axis_candidate_must_be_superseded_by_stratified_reanalysis',
  );
  pushIf(
    reanalysis.dataProfile.jointSubjectCount !== 9076 ||
      reanalysis.dataProfile.datasetCounts.employment_survey_3000 !== 4553 ||
      reanalysis.dataProfile.datasetCounts.nanbyo_survey_4000 !== 4523,
    errors,
    'data_profile_must_match_joint_subject_space_counts',
  );
  pushIf(
    reanalysis.signals.length < 12 ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalKind === 'dominant_load_signal' &&
          signalItem.axisImplication === 'dominant_signal_must_not_define_whole_domain',
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_general_long_tail_health_condition_sweep' &&
          signalItem.sourceMetric.metricKind ===
            'long_tail_health_condition_token_count' &&
          signalItem.sourceMetric.count === 18 &&
          signalItem.sourceMetric.denominator === 22,
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_all_scannable_layers_before_axis_rebuild' &&
          signalItem.sourceMetric.metricKind === 'all_scannable_layer_count' &&
          signalItem.sourceMetric.count === 10,
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_upper_disability_category_sweep' &&
          signalItem.sourceMetric.metricKind === 'analysis_ready_item_coverage_count' &&
          signalItem.sourceMetric.count === 9,
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_visual_hearing_information_access' &&
          signalItem.axisImplication === 'must_split_from_existing_axis',
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_internal_disability_regular_monitoring' &&
          signalItem.axisImplication === 'must_split_from_existing_axis',
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_pre_entry_job_image_and_transition' &&
          signalItem.axisImplication === 'must_remain_visible_as_own_review_unit',
      ) ||
      !reanalysis.signals.some(
        (signalItem) =>
          signalItem.signalId === 'signal_non_current_income_work_population' &&
          signalItem.sourceMetric.metricKind === 'employment_survey_respondent_count' &&
          signalItem.sourceMetric.count === 1630 &&
          signalItem.sourceMetric.denominator === 4553 &&
          signalItem.axisImplication === 'must_remain_visible_as_own_review_unit',
      ),
    errors,
    'signals_must_include_dominant_load_and_protected_subgroup_split_findings',
  );
  pushIf(
    reanalysis.minoritySignalProtectionPolicy.policyId !==
      'low_n_high_specificity_signal_sweep_before_axis_rebuild' ||
      reanalysis.minoritySignalProtectionPolicy.scope !==
        'all_scannable_layers_before_axis_rebuild_not_only_founder_examples' ||
      reanalysis.minoritySignalProtectionPolicy.scannableLayerIds.length !== 10 ||
      ![
        'joint_subject_health_condition_tokens',
        'joint_subject_narrative_concept_tokens',
        'joint_subject_narrative_field_tokens',
        'joint_subject_concept_tokens',
        'joint_subject_frame_tokens',
        'employment_survey_upper_disability_category_labels',
        'employment_survey_employment_phase_labels',
        'manifold_pattern_family_counts',
        'manifold_pattern_level_counts',
        'source_model_prior_lenses',
      ].every((layerId) =>
        reanalysis.minoritySignalProtectionPolicy.scannableLayerIds.includes(
          layerId as (typeof reanalysis.minoritySignalProtectionPolicy.scannableLayerIds)[number],
        ),
      ) ||
      reanalysis.minoritySignalProtectionPolicy.lowNThresholdCount !== 500 ||
      reanalysis.minoritySignalProtectionPolicy.totalHealthConditionTokenCount !== 22 ||
      reanalysis.minoritySignalProtectionPolicy.longTailHealthConditionTokenCount !== 18 ||
      reanalysis.minoritySignalProtectionPolicy.upperDisabilityCategoryCount !== 9 ||
      reanalysis.minoritySignalProtectionPolicy.requiredAction !==
        'scan_rank_and_route_long_tail_and_category_and_phase_signals_before_integrated_axis_rebuild' ||
      reanalysis.minoritySignalProtectionPolicy.prohibitedShortcut !==
        'patch_only_examples_named_in_founder_review',
    errors,
    'minority_signal_policy_must_block_example_only_patch',
  );
  pushIf(
    reanalysis.employmentPhaseCoverageAudit.totalRespondents !== 4553 ||
      reanalysis.employmentPhaseCoverageAudit.currentIncomeWorkCount !== 2340 ||
      reanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkCount !== 1630 ||
      reanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkPercent !== '35.8%' ||
      reanalysis.employmentPhaseCoverageAudit.neverIncomeWorkCount !== 560 ||
      reanalysis.employmentPhaseCoverageAudit.q7StructuredAnyNotUnneededRespondentCount !==
        3324 ||
      reanalysis.employmentPhaseCoverageAudit.q7StructuredProblemOrResolvedRespondentCount !==
        2743 ||
      reanalysis.employmentPhaseCoverageAudit.q7FreeTextRespondentCount !== 926 ||
      reanalysis.employmentPhaseCoverageAudit.q7FreeTextUnitCount !== 1530 ||
      !reanalysis.employmentPhaseCoverageAudit.interpretationCorrectionJa.includes(
        '低頻度ではない',
      ),
    errors,
    'employment_phase_audit_must_prevent_treating_pre_entry_as_low_frequency',
  );
  pushIf(
    reanalysis.upperDisabilityCategorySignals.length !== 9 ||
      ![
        '視覚障害',
        '聴覚・平衡機能障害',
        '肢体不自由',
        '内部障害',
        '知的障害',
        '精神障害',
        '発達障害',
        '高次脳機能障害',
        '難病',
      ].every((label) => upperDisabilityCategoryLabels.has(label)) ||
      !reanalysis.upperDisabilityCategorySignals.every(
        (signalItem) =>
          signalItem.sourceFieldRawName === '分類名' &&
          signalItem.sourceCategoryRole ===
            'upper_disability_category_not_detail_disease_token' &&
          signalItem.denominator === 4553 &&
          signalItem.routedToReviewUnitIds.length > 0 &&
          signalItem.routedToReviewUnitIds.every((unitId) => reviewUnitIds.has(unitId)),
      ) ||
      reanalysis.upperDisabilityCategorySignals.find((signalItem) => signalItem.labelJa === '難病')
        ?.count !== 2138 ||
      reanalysis.upperDisabilityCategorySignals.find(
        (signalItem) => signalItem.labelJa === '内部障害',
      )?.count !== 757 ||
      reanalysis.upperDisabilityCategorySignals.find(
        (signalItem) => signalItem.labelJa === '視覚障害',
      )?.count !== 349,
    errors,
    'upper_disability_category_signals_must_be_preserved_separately_from_detail_health_tokens',
  );
  pushIf(
    reanalysis.protectedTokenLayerSummaries.length !== 5 ||
      !['health_condition', 'narrative_concept', 'narrative_field', 'concept', 'frame'].every(
        (layerId) => protectedLayerIds.has(layerId as AxiomProtectedTokenLayerId),
      ) ||
      !reanalysis.protectedTokenLayerSummaries.every(
        (layer) =>
          layer.protectedTokenCount === layer.totalTokenCount &&
          layer.tokens.length === layer.totalTokenCount &&
          layer.tokens.every(
            (token) =>
              token.sourceTokenColumn === `${layer.sourceColumnPrefix}${token.labelJa}` &&
              token.routedToReviewUnitIds.length > 0 &&
              token.routedToReviewUnitIds.every((unitId) => reviewUnitIds.has(unitId)),
          ),
      ) ||
      reanalysis.protectedTokenLayerSummaries.find(
        (layer) => layer.layerId === 'health_condition',
      )?.totalTokenCount !== 22 ||
      reanalysis.protectedTokenLayerSummaries.find(
        (layer) => layer.layerId === 'narrative_concept',
      )?.totalTokenCount !== 5 ||
      reanalysis.protectedTokenLayerSummaries.find(
        (layer) => layer.layerId === 'narrative_field',
      )?.totalTokenCount !== 18 ||
      reanalysis.protectedTokenLayerSummaries.find((layer) => layer.layerId === 'concept')
        ?.totalTokenCount !== 3 ||
      reanalysis.protectedTokenLayerSummaries.find((layer) => layer.layerId === 'frame')
        ?.totalTokenCount !== 1,
    errors,
    'all_joint_subject_token_layers_must_be_scanned_and_routed_before_axis_rebuild',
  );
  pushIf(
    !reanalysis.protectedTokenLayerSummaries
      .find((layer) => layer.layerId === 'narrative_field')
      ?.tokens.some(
        (token) =>
          token.labelJa === 'xQ11' &&
          token.count === 149 &&
          token.protectionClass === 'low_n_high_specificity',
      ) ||
      !reanalysis.protectedTokenLayerSummaries
        .find((layer) => layer.layerId === 'narrative_concept')
        ?.tokens.some(
          (token) =>
            token.labelJa === 'disclosure_and_explanation' &&
            token.count === 189 &&
            token.protectionClass === 'low_n_high_specificity',
        ),
    errors,
    'low_n_narrative_fields_and_concepts_must_not_be_dropped',
  );
  pushIf(
    reanalysis.patternFamilyProtections.length !== 3 ||
      !['communication_barrier', 'fatigue_schedule', 'accommodation_gap'].every((familyId) =>
        patternFamilyIds.has(familyId as AxiomPatternFamilyProtection['familyId']),
      ) ||
      reanalysis.patternFamilyProtections.find((family) => family.familyId === 'communication_barrier')
        ?.patternCount !== 16 ||
      reanalysis.patternFamilyProtections.find((family) => family.familyId === 'fatigue_schedule')
        ?.patternCount !== 21 ||
      reanalysis.patternFamilyProtections.find((family) => family.familyId === 'accommodation_gap')
        ?.patternCount !== 7 ||
      !reanalysis.patternFamilyProtections.every(
        (family) =>
          family.routedToReviewUnitIds.length > 0 &&
          family.routedToReviewUnitIds.every((unitId) => reviewUnitIds.has(unitId)),
      ),
    errors,
    'pattern_families_including_small_accommodation_gap_must_be_preserved',
  );
  pushIf(
    reanalysis.patternLevelProtections.length !== 3 ||
      !['global', 'local', 'micro'].every((levelId) =>
        patternLevelIds.has(levelId as AxiomPatternLevelProtection['levelId']),
      ) ||
      reanalysis.patternLevelProtections.find((level) => level.levelId === 'global')
        ?.patternCount !== 11 ||
      reanalysis.patternLevelProtections.find((level) => level.levelId === 'local')
        ?.patternCount !== 17 ||
      reanalysis.patternLevelProtections.find((level) => level.levelId === 'micro')
        ?.patternCount !== 16,
    errors,
    'pattern_levels_must_preserve_global_local_and_micro_resolution',
  );
  pushIf(
    reanalysis.sourceLensProtections.length !== 2 ||
      !['nanbyo_survey_4000', 'historical_linked_triangular_source_family'].every((lensId) =>
        sourceLensIds.has(lensId as AxiomSourceLensProtection['sourceLensId']),
      ) ||
      !reanalysis.sourceLensProtections.every(
        (lens) =>
          lens.cannotUseAsJa.length > 0 &&
          lens.routedToReviewUnitIds.length > 0 &&
          lens.routedToReviewUnitIds.every((unitId) => reviewUnitIds.has(unitId)),
      ),
    errors,
    'source_lens_protections_must_preserve_weight_and_limits_before_axis_rebuild',
  );
  pushIf(
    reanalysis.longTailHealthConditionSignals.length !== 18 ||
      !reanalysis.longTailHealthConditionSignals.every(
        (signalItem) =>
          signalItem.count > 0 &&
          signalItem.count < reanalysis.minoritySignalProtectionPolicy.lowNThresholdCount &&
          signalItem.sourceTokenColumn === `token__health_condition::${signalItem.labelJa}` &&
          signalItem.routedToReviewUnitIds.length > 0 &&
          signalItem.routedToReviewUnitIds.every((unitId) => reviewUnitIds.has(unitId)),
      ) ||
      ![
        '知的障害',
        '高次脳機能障害',
        '弱視・視野障害',
        '難聴',
        '血液透析適用',
        '頸髄損傷',
        '皮膚筋炎／多発性筋炎',
        '重症筋無力症',
      ].every((label) => longTailLabels.has(label)),
    errors,
    'long_tail_health_condition_signals_must_be_scanned_and_routed_not_example_only',
  );
  pushIf(
    reanalysis.reviewUnitCandidateSetStatus !==
      'provisional_pre_all_layer_candidate_set_requires_revalidation_after_all_layer_sweep' ||
      !reanalysis.reviewUnitCandidateSetUseJa.includes('最終review unit構造ではない') ||
      !reanalysis.reviewUnitCandidateSetUseJa.includes('維持・分割・統合・rename・hold'),
    errors,
    'review_unit_candidates_must_remain_provisional_after_all_layer_sweep',
  );
  pushIf(
    reanalysis.revisedReviewUnitCount !== 9 ||
      reanalysis.revisedReviewUnitCandidates.length !== 9 ||
      !reanalysis.revisedReviewUnitCandidates.some(
        (unit) => unit.unitId === 'revised_unit_regular_medical_monitoring_and_treatment_time',
      ) ||
      !reanalysis.revisedReviewUnitCandidates.some(
        (unit) => unit.unitId === 'revised_unit_communication_and_information_access',
      ) ||
      !reanalysis.revisedReviewUnitCandidates.some(
        (unit) => unit.unitId === 'revised_unit_pre_entry_job_image_and_transition',
      ),
    errors,
    'reanalysis_must_keep_nine_provisional_review_unit_candidates_with_split_health_access_and_pre_entry_units',
  );
  for (const signalId of unitSignalIds) {
    pushIf(!signalIds.has(signalId), errors, `review_unit_references_missing_signal:${signalId}`);
  }
  for (const unit of reanalysis.revisedReviewUnitCandidates) {
    pushIf(
      unit.reviewRoute !==
        'founder_review_required_before_integrated_domain_object_rebuild_or_surface_projection',
      errors,
      `review_unit_must_route_to_founder_before_rebuild:${unit.unitId}`,
    );
  }
  pushIf(
    reanalysis.nextRequiredCoreMove !==
      'rebuild_integrated_domain_knowledge_object_from_all_layer_reanalysis_and_revalidate_review_unit_candidates_before_surface_projection',
    errors,
    'next_core_move_must_rebuild_from_all_layer_reanalysis_and_revalidate_review_units_not_project_surfaces',
  );
  pushIf(
    !reanalysis.notNow.includes('no_use_of_old_six_axis_object_as_final_axiom_domain_knowledge') ||
      !reanalysis.notNow.includes('no_public_candidate_surface_projection_before_rebuilt_integrated_domain_object') ||
      !reanalysis.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !reanalysis.notNow.includes('no_raw_sensitive_text_export'),
    errors,
    'not_now_must_block_old_six_axis_public_runtime_learning_and_raw_text_export',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_data_stratified_domain_reanalysis_valid'
        : 'real_data_stratified_domain_reanalysis_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_CORE_PROGRESS_CLASSES],
  };
}
