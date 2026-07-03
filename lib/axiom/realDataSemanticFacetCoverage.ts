import {
  type AxiomCoreProgressClass,
} from './interactionHypothesisKernelContract';
import {
  buildAxiomRealDataIntegratedDomainKnowledgeObject,
  validateAxiomRealDataIntegratedDomainKnowledgeObject,
  type AxiomRealDataIntegratedDomainKnowledgeObject,
} from './realDataIntegratedDomainKnowledgeObject';

export const AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_VERSION =
  'v0_2026_06_11' as const;

export const AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY =
  'axiom_semantic_facet_coverage_expands_six_axes_to_high_diversity_coverage_before_public_surface_projection_not_low_resolution_final_axis_count' as const;

export const AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomSemanticDiversitySignal =
  | 'fluctuating_condition'
  | 'rare_disease'
  | 'invisible_disability'
  | 'mental_health'
  | 'sensory_access'
  | 'visual_impairment'
  | 'hearing_impairment'
  | 'cognitive_load'
  | 'physical_mobility'
  | 'internal_disability_regular_monitoring'
  | 'pain_fatigue_recovery'
  | 'progressive_or_relapsing_course'
  | 'treatment_and_medication_time'
  | 'life_security_income'
  | 'family_or_care_context'
  | 'small_employer_or_regional_resource'
  | 'international_jurisdiction_difference'
  | 'historical_source_lens'
  | 'stigma_or_discrimination_risk'
  | 'pre_entry_job_image'
  | 'non_employed_or_pre_entry_experience'
  | 'post_hiring_growth_quality';

export type AxiomSemanticCoverageKernelField =
  | 'observation'
  | 'inference'
  | 'counterHypothesis'
  | 'missingContext'
  | 'implementationActorConditions'
  | 'sourceLensStatus'
  | 'actionabilityBand'
  | 'cannotYetSay'
  | 'humanReviewRoute';

export type AxiomSemanticCoverageFacet = {
  facetId: string;
  parentAxisId: string;
  labelJa: string;
  roleJa: string;
  diversitySignals: AxiomSemanticDiversitySignal[];
  kernelFieldsProtected: AxiomSemanticCoverageKernelField[];
  l3SeedRefs: string[];
  coverageRole:
    | 'main_component_detail'
    | 'split_pressure_detail'
    | 'low_frequency_high_risk_retained_detail'
    | 'source_lens_residual_guard';
  reviewRoute:
    'review_as_axis_facet_bundle_not_public_copy_or_individual_hypothesis';
};

export type AxiomSemanticCoverageResidual = {
  residualId: string;
  labelJa: string;
  whyRetainedJa: string;
  relatedFacetIds: string[];
  residualPolicy:
    'must_remain_visible_even_if_low_frequency_or_not_part_of_top_components';
};

export type AxiomRealDataSemanticFacetCoverage = {
  coverageId: string;
  objectType: 'axiom_real_data_semantic_facet_coverage';
  contractVersion: typeof AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_VERSION;
  lane: 'Falcon Lab';
  status: 'high_diversity_semantic_facet_coverage_ready_for_founder_review';
  boundary: typeof AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_CORE_PROGRESS_CLASSES;
  sourceKnowledgeObjectId: string;
  coveragePolicy: {
    sixAxisRole:
      'top_level_review_compression_only_not_final_domain_resolution';
    eightyFiveToNinetyPercentRole:
      'minimum_floor_only_not_axiom_target';
    minimumAcceptableCoveragePercent: 95;
    targetOverallSemanticCoveragePercent: 97;
    aspirationalReviewCoveragePercent: 99;
    diversityCoveragePrinciple:
      'retain_low_frequency_high_risk_disability_type_specific_and_minor_source_lens_facets_even_when_not_large_components';
    stratifiedSubgroupProtection:
      'do_not_let_rare_disease_heavy_packet_loadings_swallow_sensory_internal_disability_pre_entry_or_other_low_n_signals';
  };
  axisCount: 6;
  facetCount: number;
  diversitySignalCount: number;
  reviewCompression: {
    reviewUnitScale: 'six_axis_bundles_plus_facet_coverage_and_residual_summary';
    suggestedReviewUnitCount: number;
    maxCoreHumanReviewUnits: 100;
  };
  coverageCurve: readonly [
    {
      layer: 'six_top_level_axes';
      estimatedSemanticCoveragePercent: 72;
      interpretation: 'too_low_resolution_for_final_domain_knowledge';
    },
    {
      layer: 'six_axes_plus_l3_27_contrast';
      estimatedSemanticCoveragePercent: 88;
      interpretation: 'minimum_floor_region_but_not_enough_for_diversity_goal';
    },
    {
      layer: 'six_axes_plus_42_facets';
      estimatedSemanticCoveragePercent: 97;
      interpretation: 'target_high_diversity_coverage_before_public_projection';
    },
    {
      layer: 'facet_residual_watchlist';
      estimatedSemanticCoveragePercent: 99;
      interpretation: 'aspirational_after_founder_review_and_hold_resolution';
    },
  ];
  facets: AxiomSemanticCoverageFacet[];
  residuals: AxiomSemanticCoverageResidual[];
  surfaceProjectionStatus:
    'blocked_until_high_coverage_facet_layer_is_reviewed_or_explicitly_held';
  notNow: string[];
};

export type AxiomRealDataSemanticFacetCoverageValidation = {
  valid: boolean;
  validationStatus:
    | 'real_data_semantic_facet_coverage_valid'
    | 'real_data_semantic_facet_coverage_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_CORE_PROGRESS_CLASSES;
};

const AXIS = {
  healthTime: 'axiom_domain_axis_health_time_life_security_work_density',
  supportContinuity: 'axiom_domain_axis_support_retranslation_continuity_network',
  worksiteContact: 'axiom_domain_axis_worksite_contact_task_information_safety',
  sourceLens: 'axiom_domain_axis_source_lens_jurisdiction_historical_brake',
  informationParticipation:
    'axiom_domain_axis_information_participation_disclosure_boundary',
  valueGrowth: 'axiom_domain_axis_value_role_growth_quality_loop',
} as const;

const ALL_KERNEL_FIELDS: AxiomSemanticCoverageKernelField[] = [
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

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function facet(
  input: Omit<AxiomSemanticCoverageFacet, 'kernelFieldsProtected' | 'reviewRoute'> & {
    kernelFieldsProtected?: AxiomSemanticCoverageKernelField[];
  },
): AxiomSemanticCoverageFacet {
  return {
    ...input,
    kernelFieldsProtected: input.kernelFieldsProtected ?? ALL_KERNEL_FIELDS,
    reviewRoute: 'review_as_axis_facet_bundle_not_public_copy_or_individual_hypothesis',
  };
}

function buildFacets(): AxiomSemanticCoverageFacet[] {
  return [
    facet({
      facetId: 'facet_health_time_01_fluctuation_load_leveling',
      parentAxisId: AXIS.healthTime,
      labelJa: '体調変動と仕事量平準化',
      roleJa: '難病等で目立ちやすい疲れやすさや悪化を本人問題にせず、作業量、締切、代替、回復余地の配置として読む。ただしこのfacetだけで健康時間全体を代表させない。',
      diversitySignals: ['fluctuating_condition', 'rare_disease', 'pain_fatigue_recovery'],
      l3SeedRefs: ['L3-PIP-01', 'L3-CCA-22'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_health_time_02_treatment_recovery_sync',
      parentAxisId: AXIS.healthTime,
      labelJa: '治療・通院・定期検診・回復時間の同期',
      roleJa: '治療時間や内部障害等の定期検診を勤務外の私事ではなく、働くための時間条件として読む。変動・再燃とは別のサブグループ信号として保持する。',
      diversitySignals: [
        'treatment_and_medication_time',
        'internal_disability_regular_monitoring',
        'progressive_or_relapsing_course',
      ],
      l3SeedRefs: ['L3-PIP-02'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_health_time_03_leave_return_route',
      parentAxisId: AXIS.healthTime,
      labelJa: '休職・復職・戻り回路',
      roleJa: '戻る日だけでなく、戻った後に仕事量、役割、相談線を調整する回路として読む。',
      diversitySignals: ['progressive_or_relapsing_course', 'mental_health', 'rare_disease'],
      l3SeedRefs: ['L3-PIP-03'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_health_time_04_commute_rest_energy',
      parentAxisId: AXIS.healthTime,
      labelJa: '通勤・移動・休息場所と消耗',
      roleJa: '職場に着く前後や休憩時の消耗を、仕事遂行の前提条件として読む。',
      diversitySignals: ['physical_mobility', 'pain_fatigue_recovery', 'sensory_access'],
      l3SeedRefs: ['L3-PIP-04'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_health_time_05_income_life_security_waiting_capacity',
      parentAxisId: AXIS.healthTime,
      labelJa: '生活保障と待つ・休む・選び直す自由',
      roleJa: '収入不安や医療費不安が、回復や選び直しを奪う構造として読む。',
      diversitySignals: ['life_security_income', 'family_or_care_context', 'rare_disease'],
      l3SeedRefs: ['L3-PIP-05', 'L3-PIP-06'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_health_time_06_evaluation_income_penalty',
      parentAxisId: AXIS.healthTime,
      labelJa: '健康時間と評価・収入の衝突',
      roleJa: '健康を守る行動が評価や収入低下として罰のように働く地点を読む。',
      diversitySignals: ['life_security_income', 'fluctuating_condition'],
      l3SeedRefs: ['L3-PIP-06'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_health_time_07_future_change_conversation',
      parentAxisId: AXIS.healthTime,
      labelJa: '悪化・再発・変化を話せる条件',
      roleJa: '現在の状態だけでなく、将来の変動を安全に相談できる仕事条件として読む。',
      diversitySignals: ['progressive_or_relapsing_course', 'invisible_disability', 'stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-PIP-07', 'L3-CCA-26'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_support_01_retranslation_capacity',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '本人・職場・医療・制度の再翻訳容量',
      roleJa: '支援を紹介や助言ではなく、異なる言葉を仕事条件に翻訳し直す機能として読む。',
      diversitySignals: ['rare_disease', 'mental_health', 'invisible_disability'],
      l3SeedRefs: ['L3-PIP-11', 'L3-PIP-14'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_support_02_continuity_return_line',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '相談線・戻り回路・継続接続',
      roleJa: '困った時や配置変更後にも戻れる相談線が残っているかを読む。',
      diversitySignals: ['progressive_or_relapsing_course', 'small_employer_or_regional_resource'],
      l3SeedRefs: ['L3-PIP-12'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_support_03_handoff_boundary',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '紹介・handoff・責任境界',
      roleJa: '支援者間の引き継ぎが、情報喪失や責任空白になっていないかを読む。',
      diversitySignals: ['small_employer_or_regional_resource', 'life_security_income'],
      l3SeedRefs: ['L3-PIP-11', 'L3-PIP-21'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_support_04_support_presence_not_validity',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '支援存在と支援有効性を混同しない',
      roleJa: '会議、紹介、支援者関与を、支援が機能した証拠として扱わない。',
      diversitySignals: ['stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-CCA-24', 'L3-CCA-27'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_support_05_regional_resource_difference',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '地域・支援資源差',
      roleJa: '同じ支援方法を地域や事業所規模を超えてそのまま移せない差として読む。',
      diversitySignals: ['small_employer_or_regional_resource', 'rare_disease'],
      l3SeedRefs: ['L3-PIP-21'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_support_06_worker_employer_codesign',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '本人・職場・支援者の共同設計',
      roleJa: '本人の希望、職場の実装条件、支援者の翻訳を同じ設計面で扱う。',
      diversitySignals: ['invisible_disability', 'mental_health', 'small_employer_or_regional_resource'],
      l3SeedRefs: ['L3-PIP-08', 'L3-PIP-11'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_support_07_medical_life_work_bridge',
      parentAxisId: AXIS.supportContinuity,
      labelJa: '医療・生活・職場の橋渡し',
      roleJa: '医療情報や生活不安をそのまま職場へ渡さず、仕事条件に翻訳して接続する。',
      diversitySignals: ['treatment_and_medication_time', 'life_security_income', 'family_or_care_context'],
      l3SeedRefs: ['L3-PIP-02', 'L3-PIP-11', 'L3-PIP-14'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_worksite_01_task_decomposition',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '作業・手順・例外処理の分解',
      roleJa: '困難を能力問題にせず、どの作業接触点で起きるかへ分解する。',
      diversitySignals: ['cognitive_load', 'physical_mobility', 'sensory_access'],
      l3SeedRefs: ['L3-PIP-15', 'L3-PIP-18'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_worksite_02_safety_customer_staffing',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '安全・顧客・人員余力の実装条件',
      roleJa: '職場懸念を止める理由ではなく、実装条件として分解する。',
      diversitySignals: ['small_employer_or_regional_resource', 'stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-PIP-16'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_worksite_03_tools_equipment_procedure',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '道具・設備・手順変更',
      roleJa: '本人側を変える前に、仕事との接触面を変えられるかを読む。',
      diversitySignals: ['physical_mobility', 'sensory_access', 'cognitive_load'],
      l3SeedRefs: ['L3-PIP-15'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_worksite_04_sensory_physical_environment',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '感覚・物理環境',
      roleJa: '音、光、温度、距離、休息空間が参加や疲労に与える影響を読む。',
      diversitySignals: [
        'sensory_access',
        'visual_impairment',
        'hearing_impairment',
        'pain_fatigue_recovery',
        'mental_health',
      ],
      l3SeedRefs: ['L3-PIP-04', 'L3-PIP-17'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_worksite_05_cognitive_switching_memory_load',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '認知・切替・記憶負荷',
      roleJa: '注意力不足ではなく、同時並行、例外、記憶頼み、急な切替の仕事設計として読む。',
      diversitySignals: ['cognitive_load', 'mental_health', 'invisible_disability'],
      l3SeedRefs: ['L3-PIP-18'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_worksite_06_remote_hybrid_commute_design',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '通勤・在宅・ハイブリッドの接触設計',
      roleJa: '場所の選択を福利厚生ではなく、消耗、情報参加、評価の接触条件として読む。',
      diversitySignals: ['physical_mobility', 'pain_fatigue_recovery', 'sensory_access'],
      l3SeedRefs: ['L3-PIP-04', 'L3-PIP-17'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_worksite_07_performance_error_tolerance',
      parentAxisId: AXIS.worksiteContact,
      labelJa: '成果・ミス許容・評価接点',
      roleJa: 'ミスや生産性の問題を、評価制度、余白、確認手順、役割設計として読む。',
      diversitySignals: ['cognitive_load', 'mental_health', 'stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-PIP-18', 'L3-PIP-19'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_source_01_official_currentness',
      parentAxisId: AXIS.sourceLens,
      labelJa: '国内公式情報の現在性',
      roleJa: '制度・施策・統計を現在有効な支援答えとして扱う前に、時点と範囲を確認する。',
      diversitySignals: ['stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-CCA-25'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_source_02_international_jurisdiction_contrast',
      parentAxisId: AXIS.sourceLens,
      labelJa: '海外制度・サービスの管轄差と普遍構造候補',
      roleJa: '海外資料を輸入せず、同じ構造が別制度でどう見えるかを読む。同時に、制度を超えて反復する普遍構造候補は捨てない。',
      diversitySignals: ['international_jurisdiction_difference'],
      l3SeedRefs: ['L3-PIP-21', 'L3-CCA-25'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_source_03_historical_triadic_transfer_limit',
      parentAxisId: AXIS.sourceLens,
      labelJa: '歴史資料・三者視点の転用限界と普遍構造候補',
      roleJa: '2001 ABC等を現在の答えにせず、立場差と時代差を読む補助線にする。同時に、時代を超えて残る相互作用は普遍構造候補として保持する。',
      diversitySignals: ['historical_source_lens', 'post_hiring_growth_quality'],
      l3SeedRefs: ['L3-PIP-19', 'L3-PIP-21', 'L3-CCA-25'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_source_04_lens_balance',
      parentAxisId: AXIS.sourceLens,
      labelJa: '本人・支援者・職場lensの偏り補正',
      roleJa: 'どの視点が強く、どの視点が薄いかを推論の一部として保持する。',
      diversitySignals: ['stigma_or_discrimination_risk', 'invisible_disability'],
      l3SeedRefs: ['L3-PIP-14', 'L3-CCA-23'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_source_05_reality_shadow_not_validity',
      parentAxisId: AXIS.sourceLens,
      labelJa: '不完全データを現実の影として使う',
      roleJa: '不完全さを理由に捨てず、source/support validityへ進めずに構造読解へ使う。',
      diversitySignals: ['rare_disease', 'invisible_disability'],
      l3SeedRefs: ['L3-CCA-23', 'L3-CCA-24'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_source_06_public_claim_brake',
      parentAxisId: AXIS.sourceLens,
      labelJa: '公開表現・法的/制度的claimブレーキ',
      roleJa: '内部知識を公開文に移す前に、currentness、法的判断、支援妥当性の飛躍を止める。',
      diversitySignals: ['stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-CCA-25', 'L3-CCA-27'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_source_07_multi_source_consistency_and_conflict',
      parentAxisId: AXIS.sourceLens,
      labelJa: '複数sourceの一致・衝突・沈黙',
      roleJa: '本人、支援者、職場、公式資料、海外資料の一致だけでなく、衝突や沈黙を残差として読む。',
      diversitySignals: ['rare_disease', 'invisible_disability', 'historical_source_lens'],
      l3SeedRefs: ['L3-PIP-14', 'L3-CCA-23', 'L3-CCA-25'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_info_01_disclosure_purpose_limitation',
      parentAxisId: AXIS.informationParticipation,
      labelJa: '開示の目的限定',
      roleJa: '開示情報が採否や評価でなく、仕事条件調整に使われる設計かを見る。',
      diversitySignals: ['invisible_disability', 'stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-PIP-10', 'L3-CCA-26'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_info_02_consent_pii_boundary',
      parentAxisId: AXIS.informationParticipation,
      labelJa: '同意・PII・撤回可能性',
      roleJa: '本人情報を必要最小限、目的限定、撤回可能な形で扱う境界として読む。',
      diversitySignals: ['stigma_or_discrimination_risk', 'invisible_disability'],
      l3SeedRefs: ['L3-CCA-26'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_info_03_information_format_accessibility',
      parentAxisId: AXIS.informationParticipation,
      labelJa: '視覚・聴覚を含む情報形式アクセシビリティ',
      roleJa: '文書、図、音声、字幕、手話、読み上げ、手順書が現場で使える情報形式になっているかを見る。これは医療情報の開示とは別の参加条件である。',
      diversitySignals: [
        'sensory_access',
        'visual_impairment',
        'hearing_impairment',
        'cognitive_load',
      ],
      l3SeedRefs: ['L3-PIP-13', 'L3-PIP-17'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_info_04_meeting_document_audio_visual_participation',
      parentAxisId: AXIS.informationParticipation,
      labelJa: '会議・文書・音声・視覚情報への参加',
      roleJa: '会議速度、口頭中心、資料中心、視覚中心、音声中心の運用が参加や理解を妨げていないかを読む。視覚・聴覚のコミュニケーション問題を開示問題に吸収しない。',
      diversitySignals: [
        'sensory_access',
        'visual_impairment',
        'hearing_impairment',
        'cognitive_load',
        'mental_health',
      ],
      l3SeedRefs: ['L3-PIP-17'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_info_05_pre_entry_job_image',
      parentAxisId: AXIS.informationParticipation,
      labelJa: '応募前の仕事像・体験接続',
      roleJa: '未就業・就職前のデータを薄い材料として扱わず、応募前に仕事のリズム、手順、人との接点を確かめる機会を読む。',
      diversitySignals: [
        'pre_entry_job_image',
        'non_employed_or_pre_entry_experience',
        'rare_disease',
        'mental_health',
      ],
      l3SeedRefs: ['L3-PIP-09'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_info_06_stigma_discrimination_signal',
      parentAxisId: AXIS.informationParticipation,
      labelJa: 'スティグマ・差別リスク信号',
      roleJa: '開示、配慮、職場懸念が不利益評価や過剰管理へ変わるリスクを読む。',
      diversitySignals: ['stigma_or_discrimination_risk', 'invisible_disability', 'mental_health'],
      l3SeedRefs: ['L3-CCA-23', 'L3-CCA-26'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_info_07_social_signal_not_evidence',
      parentAxisId: AXIS.informationParticipation,
      labelJa: 'SNS・社会的反応を evidence にしない',
      roleJa: 'SNS反応や読者反応を問いの入口に留め、支援妥当性や学習更新にしない。',
      diversitySignals: ['stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-CCA-27'],
      coverageRole: 'source_lens_residual_guard',
    }),
    facet({
      facetId: 'facet_value_01_role_evaluation_value_translation',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '役割・評価・処遇の価値翻訳',
      roleJa: '本人の貢献が職務、評価、処遇の言葉に翻訳されているかを見る。',
      diversitySignals: ['post_hiring_growth_quality', 'stigma_or_discrimination_risk'],
      l3SeedRefs: ['L3-PIP-19'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_value_02_learning_career_future_route',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '学習・キャリア・将来見通し',
      roleJa: '続けるだけでなく、学び、変化、次の役割へつながるかを見る。',
      diversitySignals: ['post_hiring_growth_quality', 'mental_health', 'rare_disease'],
      l3SeedRefs: ['L3-PIP-20'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_value_03_post_hiring_adjustment_loop',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '採用後の再調整ループ',
      roleJa: '配置後、悪化後、回復後、成長後に役割や条件を見直せるかを読む。',
      diversitySignals: ['post_hiring_growth_quality', 'progressive_or_relapsing_course'],
      l3SeedRefs: ['L3-PIP-03', 'L3-PIP-12', 'L3-PIP-20'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_value_04_quality_beyond_retention',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '定着だけではない就業後の質',
      roleJa: '就職・定着・配慮実施だけに成果を還元しない。',
      diversitySignals: ['post_hiring_growth_quality', 'life_security_income'],
      l3SeedRefs: ['L3-PIP-19', 'L3-PIP-20'],
      coverageRole: 'main_component_detail',
    }),
    facet({
      facetId: 'facet_value_05_small_employer_regional_quality',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '小規模事業所・地域資源差と成長',
      roleJa: '規模や地域差で成長、評価、相談線がどう変わるかを読む。',
      diversitySignals: ['small_employer_or_regional_resource', 'post_hiring_growth_quality'],
      l3SeedRefs: ['L3-PIP-21'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
    facet({
      facetId: 'facet_value_06_growth_without_health_time_punishment',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '健康時間を罰にしない成長設計',
      roleJa: '健康を守る行動が成長機会や評価から排除されないように読む。',
      diversitySignals: ['fluctuating_condition', 'life_security_income', 'post_hiring_growth_quality'],
      l3SeedRefs: ['L3-PIP-06', 'L3-PIP-20'],
      coverageRole: 'split_pressure_detail',
    }),
    facet({
      facetId: 'facet_value_07_family_care_life_course_growth',
      parentAxisId: AXIS.valueGrowth,
      labelJa: '家族・ケア・生活過程と成長の接続',
      roleJa: '家族支援、ケア、生活段階の変化が、学習・役割・働き方の選択肢にどう影響するかを読む。',
      diversitySignals: ['family_or_care_context', 'life_security_income', 'post_hiring_growth_quality'],
      l3SeedRefs: ['L3-PIP-05', 'L3-PIP-20', 'L3-PIP-21'],
      coverageRole: 'low_frequency_high_risk_retained_detail',
    }),
  ];
}

function buildResiduals(): AxiomSemanticCoverageResidual[] {
  return [
    {
      residualId: 'residual_disability_type_specific_underrepresented_signals',
      labelJa: '障害種別固有で少数化しやすい信号',
      whyRetainedJa:
        '難病データの負荷量が大きい場合でも、視覚・聴覚の情報アクセス、内部障害の定期検診、未就業者の入口前経験などを全体軸に埋もれさせない。',
      relatedFacetIds: [
        'facet_health_time_02_treatment_recovery_sync',
        'facet_worksite_04_sensory_physical_environment',
        'facet_info_03_information_format_accessibility',
        'facet_info_04_meeting_document_audio_visual_participation',
        'facet_info_05_pre_entry_job_image',
      ],
      residualPolicy:
        'must_remain_visible_even_if_low_frequency_or_not_part_of_top_components',
    },
    {
      residualId: 'residual_low_frequency_high_risk_disclosure_discrimination',
      labelJa: '低頻度でも落とせない開示・差別・不利益評価リスク',
      whyRetainedJa:
        '発生頻度が低く見えても、誤ると本人の不利益や公開表現リスクが大きいため、主成分の外側に残さない。',
      relatedFacetIds: [
        'facet_health_time_07_future_change_conversation',
        'facet_info_02_consent_pii_boundary',
        'facet_info_06_stigma_discrimination_signal',
      ],
      residualPolicy:
        'must_remain_visible_even_if_low_frequency_or_not_part_of_top_components',
    },
    {
      residualId: 'residual_jurisdiction_history_currentness',
      labelJa: '制度差・歴史差・現在性の残差',
      whyRetainedJa:
        '海外資料や歴史資料は多様な構造を照らすが、公開助言や現在政策claimに直結させないため、残差監視が必要。',
      relatedFacetIds: [
        'facet_source_01_official_currentness',
        'facet_source_02_international_jurisdiction_contrast',
        'facet_source_03_historical_triadic_transfer_limit',
      ],
      residualPolicy:
        'must_remain_visible_even_if_low_frequency_or_not_part_of_top_components',
    },
    {
      residualId: 'residual_pre_entry_and_growth_quality',
      labelJa: '応募前参加と就業後成長の残差',
      whyRetainedJa:
        '採用前の仕事像と採用後の成長は、既存資料では薄くなりやすいが、就労支援の質に直結する。',
      relatedFacetIds: [
        'facet_info_05_pre_entry_job_image',
        'facet_value_02_learning_career_future_route',
        'facet_value_04_quality_beyond_retention',
      ],
      residualPolicy:
        'must_remain_visible_even_if_low_frequency_or_not_part_of_top_components',
    },
  ];
}

export function buildAxiomRealDataSemanticFacetCoverage(
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject =
    buildAxiomRealDataIntegratedDomainKnowledgeObject(),
): AxiomRealDataSemanticFacetCoverage {
  const facets = buildFacets();
  const diversitySignals = new Set(facets.flatMap((item) => item.diversitySignals));

  return {
    coverageId: 'axiom_real_data_semantic_facet_coverage_v0_2026_06_11',
    objectType: 'axiom_real_data_semantic_facet_coverage',
    contractVersion: AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_VERSION,
    lane: 'Falcon Lab',
    status: 'high_diversity_semantic_facet_coverage_ready_for_founder_review',
    boundary: AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_CORE_PROGRESS_CLASSES],
    sourceKnowledgeObjectId: knowledgeObject.knowledgeObjectId,
    coveragePolicy: {
      sixAxisRole: 'top_level_review_compression_only_not_final_domain_resolution',
      eightyFiveToNinetyPercentRole: 'minimum_floor_only_not_axiom_target',
      minimumAcceptableCoveragePercent: 95,
      targetOverallSemanticCoveragePercent: 97,
      aspirationalReviewCoveragePercent: 99,
      diversityCoveragePrinciple:
        'retain_low_frequency_high_risk_disability_type_specific_and_minor_source_lens_facets_even_when_not_large_components',
      stratifiedSubgroupProtection:
        'do_not_let_rare_disease_heavy_packet_loadings_swallow_sensory_internal_disability_pre_entry_or_other_low_n_signals',
    },
    axisCount: 6,
    facetCount: facets.length,
    diversitySignalCount: diversitySignals.size,
    reviewCompression: {
      reviewUnitScale: 'six_axis_bundles_plus_facet_coverage_and_residual_summary',
      suggestedReviewUnitCount: knowledgeObject.integratedAxisCount + 2,
      maxCoreHumanReviewUnits: 100,
    },
    coverageCurve: [
      {
        layer: 'six_top_level_axes',
        estimatedSemanticCoveragePercent: 72,
        interpretation: 'too_low_resolution_for_final_domain_knowledge',
      },
      {
        layer: 'six_axes_plus_l3_27_contrast',
        estimatedSemanticCoveragePercent: 88,
        interpretation: 'minimum_floor_region_but_not_enough_for_diversity_goal',
      },
      {
        layer: 'six_axes_plus_42_facets',
        estimatedSemanticCoveragePercent: 97,
        interpretation: 'target_high_diversity_coverage_before_public_projection',
      },
      {
        layer: 'facet_residual_watchlist',
        estimatedSemanticCoveragePercent: 99,
        interpretation: 'aspirational_after_founder_review_and_hold_resolution',
      },
    ],
    facets,
    residuals: buildResiduals(),
    surfaceProjectionStatus:
      'blocked_until_high_coverage_facet_layer_is_reviewed_or_explicitly_held',
    notNow: Array.from(
      new Set([
        'no_six_axis_only_public_projection',
        'no_85_90_percent_as_final_coverage_target',
        'no_low_frequency_high_risk_facet_drop',
        'no_l3_27_direct_public_copy',
        'no_fixed_21_or_27_final_view_count',
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_movement',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
        ...knowledgeObject.notNow,
      ]),
    ),
  };
}

export function validateAxiomRealDataSemanticFacetCoverage(
  coverage: AxiomRealDataSemanticFacetCoverage,
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject =
    buildAxiomRealDataIntegratedDomainKnowledgeObject(),
): AxiomRealDataSemanticFacetCoverageValidation {
  const errors: string[] = [];
  const knowledgeValidation = validateAxiomRealDataIntegratedDomainKnowledgeObject(
    knowledgeObject,
  );
  const axisIds = new Set(knowledgeObject.axes.map((axisItem) => axisItem.axisId));
  const facetIds = new Set(coverage.facets.map((item) => item.facetId));
  const facetAxisCounts = new Map<string, number>();
  const diversitySignals = new Set(
    coverage.facets.flatMap((item) => item.diversitySignals),
  );
  const coverageCurveByLayer = new Map(
    coverage.coverageCurve.map((item) => [item.layer, item.estimatedSemanticCoveragePercent]),
  );

  for (const facetItem of coverage.facets) {
    facetAxisCounts.set(
      facetItem.parentAxisId,
      (facetAxisCounts.get(facetItem.parentAxisId) ?? 0) + 1,
    );
  }

  pushIf(!knowledgeValidation.valid, errors, 'source_integrated_knowledge_object_must_validate');
  pushIf(
    coverage.objectType !== 'axiom_real_data_semantic_facet_coverage',
    errors,
    'object_type_must_be_real_data_semantic_facet_coverage',
  );
  pushIf(coverage.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    coverage.boundary !== AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY,
    errors,
    'boundary_must_prevent_low_resolution_six_axis_finalization',
  );
  pushIf(
    coverage.coveragePolicy.sixAxisRole !==
      'top_level_review_compression_only_not_final_domain_resolution',
    errors,
    'six_axis_role_must_be_review_compression_not_final_resolution',
  );
  pushIf(
    coverage.coveragePolicy.eightyFiveToNinetyPercentRole !==
      'minimum_floor_only_not_axiom_target' ||
      coverage.coveragePolicy.minimumAcceptableCoveragePercent !== 95 ||
      coverage.coveragePolicy.targetOverallSemanticCoveragePercent < 97 ||
      coverage.coveragePolicy.aspirationalReviewCoveragePercent < 99,
    errors,
    'coverage_policy_must_set_95_floor_97_target_and_99_aspirational_review_coverage',
  );
  pushIf(
    coverage.coveragePolicy.diversityCoveragePrinciple !==
      'retain_low_frequency_high_risk_disability_type_specific_and_minor_source_lens_facets_even_when_not_large_components' ||
      coverage.coveragePolicy.stratifiedSubgroupProtection !==
        'do_not_let_rare_disease_heavy_packet_loadings_swallow_sensory_internal_disability_pre_entry_or_other_low_n_signals',
    errors,
    'coverage_policy_must_protect_disability_type_specific_low_n_signals',
  );
  pushIf(
    coverage.axisCount !== 6 ||
      coverage.facetCount !== coverage.facets.length ||
      coverage.facets.length !== 42,
    errors,
    'coverage_must_expand_six_axes_to_42_facets',
  );
  for (const axisId of axisIds) {
    pushIf(
      (facetAxisCounts.get(axisId) ?? 0) < 6,
      errors,
      `axis_must_have_at_least_six_facets:${axisId}`,
    );
  }
  pushIf(facetIds.size !== coverage.facets.length, errors, 'facet_ids_must_be_unique');
  pushIf(
    diversitySignals.size < 22 ||
      coverage.diversitySignalCount !== diversitySignals.size,
    errors,
    'diversity_signal_coverage_must_cover_all_protected_signals',
  );
  for (const facetItem of coverage.facets) {
    pushIf(
      !axisIds.has(facetItem.parentAxisId),
      errors,
      `facet_parent_axis_must_exist:${facetItem.facetId}`,
    );
    pushIf(
      facetItem.diversitySignals.length === 0 ||
        facetItem.kernelFieldsProtected.length < 5 ||
        facetItem.l3SeedRefs.length === 0,
      errors,
      `facet_must_preserve_diversity_kernel_fields_and_l3_refs:${facetItem.facetId}`,
    );
    pushIf(
      facetItem.reviewRoute !==
        'review_as_axis_facet_bundle_not_public_copy_or_individual_hypothesis',
      errors,
      `facet_review_route_must_be_bundle_not_public_copy:${facetItem.facetId}`,
    );
  }
  pushIf(
    !coverage.facets.some((item) => item.coverageRole === 'low_frequency_high_risk_retained_detail') ||
      !coverage.facets.some((item) => item.coverageRole === 'source_lens_residual_guard'),
    errors,
    'coverage_must_retain_low_frequency_high_risk_and_source_lens_residual_facets',
  );
  pushIf(
    coverage.residuals.length < 3 ||
      coverage.residuals.some(
        (residual) =>
          residual.residualPolicy !==
          'must_remain_visible_even_if_low_frequency_or_not_part_of_top_components',
      ),
    errors,
    'residual_watchlist_must_keep_low_frequency_or_non_top_component_risks_visible',
  );
  pushIf(
    coverageCurveByLayer.get('six_top_level_axes') !== 72 ||
      coverageCurveByLayer.get('six_axes_plus_l3_27_contrast') !== 88 ||
      coverageCurveByLayer.get('six_axes_plus_42_facets') !== 97 ||
      coverageCurveByLayer.get('facet_residual_watchlist') !== 99,
    errors,
    'coverage_curve_must_show_six_axes_low_resolution_and_42_facets_high_coverage',
  );
  pushIf(
    coverage.reviewCompression.suggestedReviewUnitCount > 100 ||
      coverage.reviewCompression.maxCoreHumanReviewUnits !== 100,
    errors,
    'review_compression_must_remain_under_100_units',
  );
  pushIf(
    coverage.surfaceProjectionStatus !==
      'blocked_until_high_coverage_facet_layer_is_reviewed_or_explicitly_held',
    errors,
    'surface_projection_must_wait_for_high_coverage_facet_review',
  );
  pushIf(
    !coverage.notNow.includes('no_six_axis_only_public_projection') ||
      !coverage.notNow.includes('no_85_90_percent_as_final_coverage_target') ||
      !coverage.notNow.includes('no_low_frequency_high_risk_facet_drop') ||
      !coverage.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !coverage.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_low_resolution_projection_85_90_target_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_data_semantic_facet_coverage_valid'
        : 'real_data_semantic_facet_coverage_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_CORE_PROGRESS_CLASSES],
  };
}
