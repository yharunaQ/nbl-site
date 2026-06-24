import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomRealDataStratifiedDomainReanalysis,
  validateAxiomRealDataStratifiedDomainReanalysis,
  type AxiomPatternFamilyProtection,
  type AxiomPatternLevelProtection,
  type AxiomProtectedTokenLayerId,
  type AxiomRealDataStratifiedDomainReanalysis,
  type AxiomSourceLensProtection,
} from './realDataStratifiedDomainReanalysis';

export const AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_VERSION =
  'v0_2026_06_12' as const;

export const AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY =
  'axiom_all_layer_reanalysis_revalidates_provisional_review_units_before_any_integrated_domain_object_rebuild_or_surface_projection' as const;

export const AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomAllLayerRevalidationDecision =
  | 'maintain_after_all_layer_sweep'
  | 'split_after_all_layer_sweep'
  | 'merge_after_all_layer_sweep'
  | 'rename_after_all_layer_sweep'
  | 'hold_after_all_layer_sweep';

export type AxiomAllLayerGranularityStatus =
  | 'surface_candidate_ready_with_current_substructure'
  | 'requires_substructure_review_before_surface_projection'
  | 'method_guard_applies_across_domain_units';

export type AxiomAllLayerSubstructureCoverageRole =
  | 'core_structure'
  | 'low_n_high_specificity_protection'
  | 'phase_specific_protection'
  | 'implementation_contact_point'
  | 'source_lens_guard';

export type AxiomAllLayerRebuiltReviewSubstructure = {
  substructureId: string;
  labelJa: string;
  observationFocusJa: string;
  inferenceFocusJa: string;
  protectedSignalsJa: string[];
  coverageRole: AxiomAllLayerSubstructureCoverageRole;
  biasGuardJa: string;
  founderReviewQuestionJa: string;
  nextNblUseCandidateJa: string;
};

export type AxiomAllLayerRebuiltReviewUnit = {
  rebuiltUnitId: string;
  titleJa: string;
  unitKind: 'domain_axis_candidate' | 'method_guard_candidate';
  decisionFromProvisional:
    | 'maintained_from_single_provisional_candidate'
    | 'split_from_provisional_candidate'
    | 'maintained_with_boundary_tightening'
    | 'method_guard_maintained';
  sourceProvisionalUnitIds: string[];
  allLayerProtectionInputs: {
    tokenLayerIds: AxiomProtectedTokenLayerId[];
    protectedSignalLabelsJa: string[];
    patternFamilyIds: AxiomPatternFamilyProtection['familyId'][];
    patternLevelIds: AxiomPatternLevelProtection['levelId'][];
    sourceLensIds: AxiomSourceLensProtection['sourceLensId'][];
  };
  whyJa: string;
  reviewFocusJa: string;
  granularityStatus: AxiomAllLayerGranularityStatus;
  substructureCoverageStatus:
    | 'substructure_sufficient_for_founder_review_pending_public_copy'
    | 'substructure_must_be_reviewed_before_surface_projection';
  substructureCoverageNoteJa: string;
  substructures: AxiomAllLayerRebuiltReviewSubstructure[];
  founderReviewCard: {
    plainFindingJa: string;
    axiomReadingJa: string;
    changesReadingJa: string[];
    founderReviewQuestionJa: string;
    nextNblUseCandidateJa: string;
    boundaryNoteJa: string;
  };
  publicProjectionStatus:
    'blocked_until_founder_review_accepts_revises_splits_merges_or_holds_this_rebuilt_unit';
};

export type AxiomProvisionalReviewUnitRevalidation = {
  provisionalUnitId: string;
  decision: AxiomAllLayerRevalidationDecision;
  resultingRebuiltUnitIds: string[];
  reasonJa: string;
};

export type AxiomAllLayerCoverageReview = {
  reviewStatus:
    'coverage_sufficient_for_founder_review_not_for_final_public_projection';
  protectedTokenLayerCoverage: '5/5';
  protectedJointSubjectTokenCoverage: '49/49';
  longTailHealthConditionCoverage: '18/18';
  patternFamilyCoverage: '3/3';
  patternLevelCoverage: '3/3';
  sourceLensCoverage: '2/2';
  totalSubstructureCount: number;
  highGranularityUnitIds: string[];
  substructureRequiredUnitIds: string[];
  coverageConclusionJa: string;
  remainingRiskJa: string;
  prohibitedShortcut:
    'do_not_accept_top_level_10_without_substructure_coverage_review';
};

export type AxiomPreFounderAutonomousReviewPassId =
  | 'granularity_balance_review'
  | 'cross_disability_coverage_review'
  | 'mobility_and_accessibility_overlap_review'
  | 'source_count_bias_review'
  | 'surface_projection_risk_review';

export type AxiomPreFounderAutonomousReviewFinding = {
  findingId: string;
  passId: AxiomPreFounderAutonomousReviewPassId;
  severity:
    | 'resolved_by_autonomous_rebuild'
    | 'founder_attention_required_after_autonomous_rebuild';
  observationJa: string;
  correctionAppliedJa: string;
  remainingFounderQuestionJa: string;
  relatedRebuiltUnitIds: string[];
  relatedSubstructureIds: string[];
  blocksSurfaceProjection: boolean;
};

export type AxiomPreFounderAutonomousReview = {
  reviewId: string;
  status:
    'pre_founder_autonomous_review_complete_founder_attention_reduced_not_replaced';
  passIds: AxiomPreFounderAutonomousReviewPassId[];
  findingCount: number;
  resolvedFindingCount: number;
  founderAttentionRequiredCount: number;
  findings: AxiomPreFounderAutonomousReviewFinding[];
  founderReviewCompression: {
    founderReviewRoleJa: string;
    codexPreReviewRoleJa: string;
    founderMustReviewQuestionCount: number;
    founderMustNotReviewJa: string[];
  };
  notNow: string[];
};

export type AxiomAllLayerIntegratedDomainKnowledgeRebuild = {
  rebuildId: string;
  objectType: 'axiom_all_layer_integrated_domain_knowledge_rebuild_candidate';
  contractVersion: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_VERSION;
  lane: 'Falcon Lab';
  status: 'all_layer_rebuild_candidate_pending_founder_review';
  boundary: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY;
  strengthensCore: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_CORE_PROGRESS_CLASSES;
  sourceReanalysisId: string;
  provisionalReviewUnitCount: 9;
  revalidatedReviewUnitCount: 10;
  provisionalNineUseStatus:
    'not_fixed_only_comparison_scaffold_after_all_layer_reanalysis';
  revalidationPrincipleJa: string;
  provisionalCandidateRevalidations: AxiomProvisionalReviewUnitRevalidation[];
  rebuiltReviewUnits: AxiomAllLayerRebuiltReviewUnit[];
  allLayerCoverageReview: AxiomAllLayerCoverageReview;
  preFounderAutonomousReview: AxiomPreFounderAutonomousReview;
  coverageAssertions: {
    protectedJointSubjectTokenLayerCount: 5;
    protectedJointSubjectTokenCount: 49;
    longTailHealthConditionTokenCount: 18;
    patternFamilyCount: 3;
    patternLevelCount: 3;
    sourceLensCount: 2;
    mustNotDrop: readonly [
      'low_n_health_condition_tokens',
      'low_n_narrative_fields_and_concepts',
      'accommodation_gap_pattern_family',
      'micro_pattern_level',
      'source_lens_limits',
    ];
  };
  nextRequiredCoreMove:
    'founder_review_rebuilt_all_layer_units_before_integrated_domain_object_rebuild_or_surface_projection';
  notNow: string[];
};

export type AxiomAllLayerIntegratedDomainKnowledgeRebuildValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_all_layer_integrated_domain_knowledge_rebuild_valid'
    | 'axiom_all_layer_integrated_domain_knowledge_rebuild_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY;
  strengthensCore: typeof AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_CORE_PROGRESS_CLASSES;
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function unit(
  input: Omit<AxiomAllLayerRebuiltReviewUnit, 'publicProjectionStatus'>,
): AxiomAllLayerRebuiltReviewUnit {
  return {
    ...input,
    publicProjectionStatus:
      'blocked_until_founder_review_accepts_revises_splits_merges_or_holds_this_rebuilt_unit',
  };
}

function buildRevalidations(): AxiomProvisionalReviewUnitRevalidation[] {
  return [
    {
      provisionalUnitId: 'revised_unit_fluctuating_health_time_and_work_density',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_fluctuating_health_time_work_density'],
      reasonJa:
        '難病系の大きな負荷量は支配的だが、長尾health_conditionとnarrative fieldをrouteすれば、変動・疲労・仕事密度の中核単位として維持できる。',
    },
    {
      provisionalUnitId: 'revised_unit_regular_medical_monitoring_and_treatment_time',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_regular_medical_monitoring_treatment_time'],
      reasonJa:
        '血液透析、内部障害、定期通院・検診は難病の変動とは別の時間条件として維持する。',
    },
    {
      provisionalUnitId: 'revised_unit_communication_and_information_access',
      decision: 'split_after_all_layer_sweep',
      resultingRebuiltUnitIds: [
        'rebuilt_unit_sensory_information_access_communication',
        'rebuilt_unit_cognitive_procedural_access_switching_load',
      ],
      reasonJa:
        '全層スイープでは、視覚・聴覚などの情報形式アクセスと、知的障害・高次脳機能障害などの手順/理解/切替負荷を同じ単位に押し込めると低解像度になる。',
    },
    {
      provisionalUnitId: 'revised_unit_disclosure_stigma_and_purpose_limited_information',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_disclosure_stigma_purpose_limited_information'],
      reasonJa:
        'narrative_conceptとconceptのdisclosure信号、精神障害・難病の見えにくさ、差別リスクを一つの公開前レビュー単位として維持する。',
    },
    {
      provisionalUnitId: 'revised_unit_pre_entry_job_image_and_transition',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_pre_entry_job_image_transition'],
      reasonJa:
        '低頻度またはphase-specificなnarrative_fieldが入口前・移行期の仕事像形成を支えているため維持する。',
    },
    {
      provisionalUnitId: 'revised_unit_worksite_contact_task_safety_tools',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_worksite_contact_task_safety_tools'],
      reasonJa:
        'accommodation_gapとenvironmental_factorsを受け止める実装単位として維持する。ただし認知手順負荷は独立単位にも分ける。',
    },
    {
      provisionalUnitId: 'revised_unit_support_retranslation_continuity_network',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_support_retranslation_continuity_network'],
      reasonJa:
        '支援を存在ではなく再翻訳・handoff・再接続機能として読む単位は、pattern familyとnarrative field双方から維持される。',
    },
    {
      provisionalUnitId: 'revised_unit_role_value_growth_quality_loop',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_role_value_growth_quality_loop'],
      reasonJa:
        'self_efficacy、future outlook、9記述/9その他などの層が、就職・定着を超える質と成長の単位を支える。',
    },
    {
      provisionalUnitId: 'revised_unit_source_lens_universal_structure_and_boundary_guard',
      decision: 'maintain_after_all_layer_sweep',
      resultingRebuiltUnitIds: ['rebuilt_unit_source_lens_universal_structure_boundary_guard'],
      reasonJa:
        'nanbyo_survey_4000と2001 ABCの重みと限界を同時に持つmethod guardとして維持する。',
    },
  ];
}

function buildRebuiltUnits(): AxiomAllLayerRebuiltReviewUnit[] {
  return [
    unit({
      rebuiltUnitId: 'rebuilt_unit_fluctuating_health_time_work_density',
      titleJa: '変動する健康時間・仕事密度・回復余地',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_with_boundary_tightening',
      sourceProvisionalUnitIds: ['revised_unit_fluctuating_health_time_and_work_density'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['health_condition', 'narrative_field'],
        protectedSignalLabelsJa: [
          '難病法による指定難病の診断を受け、医療受給者証を所持している',
          '多発性硬化症／視神経脊髄炎',
          '皮膚筋炎／多発性筋炎',
          '重症筋無力症',
          'xQ15-3',
        ],
        patternFamilyIds: ['fatigue_schedule'],
        patternLevelIds: ['global', 'local', 'micro'],
        sourceLensIds: ['nanbyo_survey_4000'],
      },
      whyJa:
        '変動・疲労・回復余地は大きな単位として維持するが、難病だけで健康時間全体を代表させない。',
      reviewFocusJa:
        '難病の変動、精神面の再発、感覚環境による消耗、治療予定が混線していないかを見る。',
      granularityStatus: 'surface_candidate_ready_with_current_substructure',
      substructureCoverageStatus:
        'substructure_sufficient_for_founder_review_pending_public_copy',
      substructureCoverageNoteJa:
        '健康時間は上位候補として維持できるが、難病の変動・仕事密度・回復余地・収入/評価衝突を下部構造として分けて読む。',
      substructures: [
        {
          substructureId: 'health_time_fluctuation_relapse_and_fatigue',
          labelJa: '変動・再燃・疲労が仕事密度と衝突する',
          observationFocusJa:
            '指定難病、慢性疾患、多発性硬化症、皮膚筋炎/多発性筋炎、重症筋無力症、クローン病などで、体調変動と仕事量の噛み合わせが問題化する。',
          inferenceFocusJa:
            '働きづらさは病名単体ではなく、変動の予測しにくさ、締切、勤務密度、回復時間が同じ時間軸で衝突する時に強まる。',
          protectedSignalsJa: [
            '難病法による指定難病の診断を受け、医療受給者証を所持している',
            '難病法による指定難病の診断を受けたが、医療受給者証は所持していない',
            'クローン病',
            '多発性硬化症／視神経脊髄炎',
            'シェーグレン症候群',
            '皮膚筋炎／多発性筋炎',
            '重症筋無力症',
          ],
          coverageRole: 'core_structure',
          biasGuardJa:
            '難病データの大きさは中核シグナルだが、これだけで健康時間全体を代表させない。',
          founderReviewQuestionJa:
            '変動・再燃・疲労を、病名別ではなく仕事密度との相互作用として読む下部構造でよいか。',
          nextNblUseCandidateJa:
            'work-condition windowで「体調変動ではなく時間設計を見る」説明に使う。',
        },
        {
          substructureId: 'health_time_recovery_margin_and_return_route',
          labelJa: '回復余地・戻り方・選び直しの時間',
          observationFocusJa:
            '疲労や悪化だけでなく、休む、戻る、減らす、選び直す経路の有無が働き続ける条件を左右する。',
          inferenceFocusJa:
            '回復余地は本人のセルフケアではなく、勤務密度、休憩、復帰ルート、評価時期の設計として現れる。',
          protectedSignalsJa: ['fatigue_schedule', 'global', 'local', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '症状の強さだけを見ず、仕事側が回復余地を許しているかを見る。',
          founderReviewQuestionJa:
            '回復余地と戻り方を、健康時間候補の内部構造として明示してよいか。',
          nextNblUseCandidateJa:
            '相談事例とtoolkitで「戻れる仕事条件」のチェック項目に使う。',
        },
        {
          substructureId: 'health_time_commute_and_mobility_consumption',
          labelJa: '通勤・職場外移動が健康時間を消耗する',
          observationFocusJa:
            '通勤、出張、職場外移動、移動前後の準備や回復が、勤務そのものとは別に健康時間を消耗する。',
          inferenceFocusJa:
            '移動は単なるアクセス手段ではなく、仕事密度、回復余地、出勤頻度、働ける時間帯を変える健康時間条件である。',
          protectedSignalsJa: ['fatigue_schedule', 'environmental_factors', 'xQ05'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '職場に到着した後の作業だけを仕事条件と見なさず、職場外移動で消える健康時間を残す。',
          founderReviewQuestionJa:
            '通勤・職場外移動による健康時間の消耗を、健康時間候補の下部構造として明示してよいか。',
          nextNblUseCandidateJa:
            'work-condition windowと相談事例で「通勤も仕事条件の一部」として説明する。',
        },
        {
          substructureId: 'health_time_income_evaluation_collision',
          labelJa: '健康を守る行動が収入・評価と衝突する',
          observationFocusJa:
            '休む、通院する、仕事量を調整する行動が、収入低下や低評価として跳ね返る。',
          inferenceFocusJa:
            '健康時間の問題は生活保障と評価制度の問題を伴い、体調管理だけでは解けない。',
          protectedSignalsJa: ['xQ15-3', 'narrative_field', 'nanbyo_survey_4000'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '健康管理を本人努力に閉じず、評価・収入・制度との衝突として読む。',
          founderReviewQuestionJa:
            '収入・評価との衝突を、健康時間候補の必須下部構造として残すべきか。',
          nextNblUseCandidateJa:
            'homeとarticleで「働く時間と生活保障」をつなぐ説明に使う。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '働きづらさは、体調の有無だけでなく、仕事密度・回復余地・評価時期が健康時間と噛み合わない時に強くなる。',
        axiomReadingJa:
          'Axiomは、体調変動を本人の不安定さではなく、仕事量、締切、通勤、回復時間、収入不安、評価タイミングが同じ時間軸で衝突する構造として読む。',
        changesReadingJa: [
          '病名から配慮を逆引きする前に、時間、負荷、回復、評価の配置を見る。',
          '難病の変動を中心に置きつつ、精神面の再発、感覚環境の消耗、内部障害の時間制約を埋もれさせない。',
          '休む、減らす、戻る、選び直す自由を、本人の事情ではなく仕事条件の一部として扱う。',
        ],
        founderReviewQuestionJa:
          'この発見を、Axiom版NBLの健康時間・仕事密度を読む中心候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'home、work-condition window、相談事例、toolkitで「健康時間を仕事条件として読む」導線に使う。',
        boundaryNoteJa:
          '難病データの量で健康時間全体を代表させない。定期治療時間と情報アクセス問題は別候補にも分けて読む。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_regular_medical_monitoring_treatment_time',
      titleJa: '定期検診・治療・内部障害の時間条件',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_from_single_provisional_candidate',
      sourceProvisionalUnitIds: ['revised_unit_regular_medical_monitoring_and_treatment_time'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['health_condition', 'narrative_concept'],
        protectedSignalLabelsJa: ['血液透析適用', '頸髄損傷', 'health_condition'],
        patternFamilyIds: ['fatigue_schedule'],
        patternLevelIds: ['local', 'micro'],
        sourceLensIds: ['historical_linked_triangular_source_family'],
      },
      whyJa:
        '定期的で動かしにくい医療・管理時間を、変動・再燃型の健康時間とは別に保持する。',
      reviewFocusJa:
        '内部障害の定期管理を難病の体調変動や一般的な通院配慮に吸収していないかを見る。',
      granularityStatus: 'surface_candidate_ready_with_current_substructure',
      substructureCoverageStatus:
        'substructure_sufficient_for_founder_review_pending_public_copy',
      substructureCoverageNoteJa:
        '定期医療時間は、健康変動とは別の具体候補として十分に輪郭がある。内部障害・透析・定期検診・治療継続を下部構造として保持する。',
      substructures: [
        {
          substructureId: 'regular_medical_time_dialysis_and_fixed_treatment',
          labelJa: '透析・固定治療時間が勤務時間と衝突する',
          observationFocusJa:
            '血液透析適用など、定期的で動かしにくい治療時間が働く時間を制約する。',
          inferenceFocusJa:
            'これは体調変動ではなく、仕事の時間割に組み込むべき固定的な医療時間である。',
          protectedSignalsJa: ['血液透析適用', 'health_condition'],
          coverageRole: 'low_n_high_specificity_protection',
          biasGuardJa:
            '件数が少なくても、時間設計を大きく変えるため健康時間候補から独立させる。',
          founderReviewQuestionJa:
            '透析などの固定治療時間を独立下部構造として扱ってよいか。',
          nextNblUseCandidateJa:
            'work-condition windowで「治療時間を勤務条件に入れる」説明に使う。',
        },
        {
          substructureId: 'regular_medical_time_checkups_and_continuous_monitoring',
          labelJa: '定期検診・継続管理が働くリズムを決める',
          observationFocusJa:
            '検診、通院、服薬、経過観察が、働ける曜日・時間・回復リズムを左右する。',
          inferenceFocusJa:
            '医療管理は勤務外の私事ではなく、仕事の持続可能性を支える時間条件である。',
          protectedSignalsJa: ['narrative_concept', 'historical_linked_triangular_source_family'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '通院一般に丸めず、頻度・固定性・回復との関係を見る。',
          founderReviewQuestionJa:
            '定期検診・継続管理を仕事条件として明示してよいか。',
          nextNblUseCandidateJa:
            '相談事例で「通院配慮」より細かい時間条件の読み方に使う。',
        },
        {
          substructureId: 'regular_medical_time_internal_disability_and_body_management',
          labelJa: '内部障害・身体管理が見えにくい時間条件になる',
          observationFocusJa:
            '頸髄損傷など、身体管理や体調維持が仕事前後・勤務中の消耗や準備時間に影響する。',
          inferenceFocusJa:
            '外から見えにくい管理時間は、本人都合ではなく就労継続の前提条件として読む必要がある。',
          protectedSignalsJa: ['頸髄損傷', 'local', 'micro'],
          coverageRole: 'low_n_high_specificity_protection',
          biasGuardJa:
            '難病の変動や一般的な通院配慮に吸収せず、内部障害・身体管理の時間条件として保持する。',
          founderReviewQuestionJa:
            '内部障害・身体管理の時間条件を、この候補の下部構造として残してよいか。',
          nextNblUseCandidateJa:
            'toolkitで「勤務前後の見えにくい時間」を確認する項目に使う。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '定期検診、透析、治療、服薬、回復時間は、勤務外の私事ではなく、働くための時間条件である。',
        axiomReadingJa:
          'Axiomは、定期的で動かしにくい医療・管理時間を、日ごとの体調変動とは別の構造として読む。ここには内部障害、血液透析、継続治療、定期検診のような少数でも重要な信号が含まれる。',
        changesReadingJa: [
          '「通院配慮」と一括せず、頻度、固定性、疲労回復、勤務時間との衝突を分ける。',
          '内部障害の定期管理を、難病の変動や一般的な疲労に吸収しない。',
          '働ける時間を増やす議論だけでなく、治療を続けながら働ける時間設計を見る。',
        ],
        founderReviewQuestionJa:
          'この発見を、健康時間候補から独立した定期医療・内部障害時間の候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'work-condition window、相談事例、toolkitで「治療時間を仕事設計に入れる」説明に使う。',
        boundaryNoteJa:
          '医療判断や就労可否判断はしない。あくまで仕事条件として扱うべき時間構造の発見である。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_sensory_information_access_communication',
      titleJa: '視覚・聴覚・身体条件を含む情報形式/コミュニケーションアクセス',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'split_from_provisional_candidate',
      sourceProvisionalUnitIds: ['revised_unit_communication_and_information_access'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['health_condition', 'frame'],
        protectedSignalLabelsJa: ['弱視・視野障害', '難聴', 'ろうあ', '切断、その他', 'environmental_factors'],
        patternFamilyIds: ['communication_barrier'],
        patternLevelIds: ['global', 'local', 'micro'],
        sourceLensIds: ['historical_linked_triangular_source_family'],
      },
      whyJa:
        '情報媒体、音声、視覚情報、会議速度、身体的接触点を、開示や認知手順負荷から分けて読む。',
      reviewFocusJa:
        '感覚障害のコミュニケーション問題を、本人が病状を開示する問題に吸収していないかを見る。',
      granularityStatus: 'requires_substructure_review_before_surface_projection',
      substructureCoverageStatus:
        'substructure_must_be_reviewed_before_surface_projection',
      substructureCoverageNoteJa:
        'この候補は上位カテゴリとして妥当だが、視覚、聴覚、身体操作、会議/緊急連絡を分けないと公開本文では粗くなる。移動課題はここだけに閉じず、健康時間と職場接触点にもまたがる。',
      substructures: [
        {
          substructureId: 'sensory_access_visual_information_format',
          labelJa: '視覚情報・文書形式・画面情報へのアクセス',
          observationFocusJa:
            '弱視・視野障害では、文書、画面、掲示、図表、現場表示などの情報形式が参加条件になる。',
          inferenceFocusJa:
            '視覚情報へのアクセスは、本人が説明する開示問題ではなく、仕事側の情報形式設計である。',
          protectedSignalsJa: ['弱視・視野障害', 'environmental_factors'],
          coverageRole: 'low_n_high_specificity_protection',
          biasGuardJa:
            '件数が多い難病開示に吸収せず、視覚情報形式そのものを独立して扱う。',
          founderReviewQuestionJa:
            '視覚情報アクセスを、情報形式候補の明確な下部構造として受け入れてよいか。',
          nextNblUseCandidateJa:
            'toolkitで「文書・画面・掲示の形式」を確認する項目に使う。',
        },
        {
          substructureId: 'sensory_access_hearing_voice_meeting_information',
          labelJa: '聴覚・音声・会議進行へのアクセス',
          observationFocusJa:
            '難聴・ろうあでは、音声情報、会議進行、口頭指示、雑音環境、緊急連絡が参加条件になる。',
          inferenceFocusJa:
            '聞こえの問題はコミュニケーション努力ではなく、音声依存の仕事設計として読む。',
          protectedSignalsJa: ['難聴', 'ろうあ', 'communication_barrier'],
          coverageRole: 'low_n_high_specificity_protection',
          biasGuardJa:
            '聴覚アクセスを「説明すればよい」「開示すればよい」に丸めない。',
          founderReviewQuestionJa:
            '聴覚・音声・会議進行を、視覚アクセスとは別の下部構造として扱ってよいか。',
          nextNblUseCandidateJa:
            'work-condition windowで「音声依存の仕事条件」を見える化する。',
        },
        {
          substructureId: 'sensory_access_body_operation_and_tool_contact',
          labelJa: '身体操作・道具操作へのアクセス',
          observationFocusJa:
            '切断、その他の身体条件では、道具、姿勢、操作、作業台、端末などへの接触が参加条件になる。',
          inferenceFocusJa:
            '身体条件によるアクセスは、情報形式だけでなく、道具操作と作業接触点の設計として読む。ただし職場内外の移動は別下部構造にも分ける。',
          protectedSignalsJa: ['切断、その他', 'environmental_factors', 'local', 'micro'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '身体操作の問題を感覚情報や一般的配慮に吸収せず、道具操作・作業接触点として残す。移動課題をこの箱だけに押し込めない。',
          founderReviewQuestionJa:
            '身体操作・道具操作を、この候補の下部構造として扱い、移動課題は別候補にもまたがらせてよいか。',
          nextNblUseCandidateJa:
            'toolkit/studioで作業接触点の分解カードに使う。',
        },
        {
          substructureId: 'sensory_access_emergency_and_informal_information',
          labelJa: '緊急連絡・雑談・暗黙共有からこぼれる情報',
          observationFocusJa:
            '正式な資料だけでなく、急な連絡、雑談、朝礼、現場の声かけなどが仕事情報になる。',
          inferenceFocusJa:
            '情報アクセスは媒体だけではなく、非公式な情報経路に参加できるかにも左右される。',
          protectedSignalsJa: ['communication_barrier', 'global', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '文書化された情報だけを見て、現場の非公式情報経路を落とさない。',
          founderReviewQuestionJa:
            '緊急連絡・非公式情報経路を、情報アクセス候補に含めてよいか。',
          nextNblUseCandidateJa:
            '相談事例で「伝えたつもり/聞いていない」の構造を説明する。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '視覚・聴覚・身体条件による情報アクセスは、本人が何を開示するかとは別の、仕事への参加条件である。',
        axiomReadingJa:
          'Axiomは、文書、音声、視覚情報、会議速度、連絡手段、道具、身体的接触点を、開示や本人説明の問題とは分けて読む。',
        changesReadingJa: [
          '感覚障害の困難を「コミュニケーションが苦手」という本人側の表現で止めない。',
          '資料形式、音声情報、画面情報、会議進行、緊急連絡など、仕事側の情報形式を見る。',
          '情報アクセスの設計不足を、開示不足や理解不足として扱わない。',
        ],
        founderReviewQuestionJa:
          'この発見を、開示候補とは独立した情報形式/コミュニケーションアクセス候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'work-condition window、toolkit、記事で「情報形式を仕事条件として見る」説明に使う。',
        boundaryNoteJa:
          '視覚・聴覚・身体条件を、難病の開示問題や認知手順負荷に混ぜない。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_cognitive_procedural_access_switching_load',
      titleJa: '認知・高次脳・知的障害の手順理解/切替負荷',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'split_from_provisional_candidate',
      sourceProvisionalUnitIds: [
        'revised_unit_communication_and_information_access',
        'revised_unit_worksite_contact_task_safety_tools',
      ],
      allLayerProtectionInputs: {
        tokenLayerIds: ['health_condition', 'concept', 'frame'],
        protectedSignalLabelsJa: ['知的障害', '高次脳機能障害', 'てんかん', 'accommodation_and_support', 'environmental_factors'],
        patternFamilyIds: ['communication_barrier', 'fatigue_schedule', 'accommodation_gap'],
        patternLevelIds: ['local', 'micro'],
        sourceLensIds: ['historical_linked_triangular_source_family'],
      },
      whyJa:
        '認知・手順・切替負荷は情報形式だけではなく、作業手順、評価、支援翻訳、環境要因にまたがるため独立させる。',
      reviewFocusJa:
        '認知負荷を本人能力問題にせず、手順・道具・説明・切替・評価接点として読めているかを見る。',
      granularityStatus: 'requires_substructure_review_before_surface_projection',
      substructureCoverageStatus:
        'substructure_must_be_reviewed_before_surface_projection',
      substructureCoverageNoteJa:
        '認知・手順・切替負荷は、理解、記憶、切替、暗黙ルール、評価の複数構造を含むため、下部構造レビューなしに本文へ出すと本人能力問題に戻る危険がある。',
      substructures: [
        {
          substructureId: 'cognitive_access_instruction_and_procedure_format',
          labelJa: '指示・手順・説明形式が合わない',
          observationFocusJa:
            '知的障害や高次脳機能障害では、手順の粒度、順序、視覚化、反復確認が作業参加を左右する。',
          inferenceFocusJa:
            '理解困難は本人能力だけでなく、手順の分解と説明形式の不一致として読む。',
          protectedSignalsJa: ['知的障害', '高次脳機能障害', 'accommodation_and_support'],
          coverageRole: 'low_n_high_specificity_protection',
          biasGuardJa:
            '本人の理解力評価へ短絡せず、指示・手順の設計を先に見る。',
          founderReviewQuestionJa:
            '指示・手順・説明形式を、この候補の主要下部構造として受け入れてよいか。',
          nextNblUseCandidateJa:
            'toolkitで「手順をどこまで分けるか」のカードに使う。',
        },
        {
          substructureId: 'cognitive_access_switching_priority_exception_load',
          labelJa: '切替・優先順位・例外対応の負荷',
          observationFocusJa:
            '急な変更、複数作業、例外対応、優先順位変更が負荷を増やす。',
          inferenceFocusJa:
            '切替負荷は能力不足ではなく、仕事の変動性と支援/道具の不足で増える。',
          protectedSignalsJa: ['てんかん', 'fatigue_schedule', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '変化に弱いという人物評価にせず、切替設計として扱う。',
          founderReviewQuestionJa:
            '切替・優先順位・例外対応を、手順理解とは別の下部構造として残すべきか。',
          nextNblUseCandidateJa:
            '相談事例で「急な変更が苦手」の仕事側構造を説明する。',
        },
        {
          substructureId: 'cognitive_access_memory_checking_and_error_tolerance',
          labelJa: '記憶・確認・ミス許容度の設計',
          observationFocusJa:
            '記憶、確認、ミスの許容度、再確認のしやすさが作業継続を左右する。',
          inferenceFocusJa:
            '記憶や確認の問題は、チェックリスト、ペア確認、道具、エラー許容度の設計で変わる。',
          protectedSignalsJa: ['高次脳機能障害', 'communication_barrier', 'accommodation_gap'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            'ミスを本人の注意不足として処理せず、確認構造として読む。',
          founderReviewQuestionJa:
            '記憶・確認・ミス許容度を、認知手順候補の下部構造として扱ってよいか。',
          nextNblUseCandidateJa:
            'toolkit/studioで確認手順とミス許容度の設計に使う。',
        },
        {
          substructureId: 'cognitive_access_implicit_rules_and_evaluation_feedback',
          labelJa: '暗黙ルール・評価基準・フィードバックが見えない',
          observationFocusJa:
            '暗黙の職場ルール、期待値、評価基準、注意のされ方が見えにくいと負荷が増える。',
          inferenceFocusJa:
            '職場適応の問題は、本人の社会性ではなく、評価基準とフィードバックの見える化不足として読む。',
          protectedSignalsJa: ['environmental_factors', 'local', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '暗黙ルールへの不適応を性格や態度にしない。',
          founderReviewQuestionJa:
            '暗黙ルールと評価フィードバックを、認知・手順候補の下部構造に含めるべきか。',
          nextNblUseCandidateJa:
            'work-design guideで「評価を見える化する」視点に使う。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '認知・高次脳・知的障害に関わる働きづらさは、能力の有無ではなく、手順、説明、切替、評価の設計で大きく変わる。',
        axiomReadingJa:
          'Axiomは、理解、記憶、切替、段取り、暗黙ルール、評価フィードバックを、本人の能力問題ではなく職場接触点の設計問題として読む。',
        changesReadingJa: [
          '「できる/できない」で判断する前に、作業手順と説明の形式を見る。',
          '切替負荷、優先順位、例外対応、暗黙の評価基準を仕事条件として扱う。',
          '支援者の説明と職場の運用がずれていないかを見る。',
        ],
        founderReviewQuestionJa:
          'この発見を、感覚情報アクセスとは分けた認知・手順・切替負荷候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'toolkit/studio、相談事例、work-design guideで「手順と評価を設計する」カードに使う。',
        boundaryNoteJa:
          '本人能力のラベル化、医学的判定、作業適性の最終判断には使わない。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_disclosure_stigma_purpose_limited_information',
      titleJa: '開示・スティグマ・目的限定情報共有',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_with_boundary_tightening',
      sourceProvisionalUnitIds: ['revised_unit_disclosure_stigma_and_purpose_limited_information'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['health_condition', 'narrative_concept', 'concept', 'narrative_field'],
        protectedSignalLabelsJa: ['disclosure_and_explanation', '気分障害（うつ、そううつ等）', '統合失調症', 'xQ15-3'],
        patternFamilyIds: ['communication_barrier', 'accommodation_gap'],
        patternLevelIds: ['global', 'local', 'micro'],
        sourceLensIds: ['nanbyo_survey_4000'],
      },
      whyJa:
        '開示を情報アクセスから分け、目的限定、同意、不利益評価、差別リスクを中心に置く。',
      reviewFocusJa:
        '開示を支援の万能入口にせず、話す/話さない/必要部分だけ共有する条件が残っているかを見る。',
      granularityStatus: 'surface_candidate_ready_with_current_substructure',
      substructureCoverageStatus:
        'substructure_sufficient_for_founder_review_pending_public_copy',
      substructureCoverageNoteJa:
        '開示候補は具体性が高いが、目的限定、見えにくさ、精神障害/難病、差別リスクを下部構造として分けて保持する。',
      substructures: [
        {
          substructureId: 'disclosure_purpose_limited_information_sharing',
          labelJa: '目的限定の情報共有',
          observationFocusJa:
            '何をどこまで共有するかは、支援、職場調整、評価、プライバシーの境界に関わる。',
          inferenceFocusJa:
            '開示は量ではなく、目的、相手、利用範囲、同意で設計する必要がある。',
          protectedSignalsJa: ['disclosure_and_explanation', 'concept'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '開示を支援の入口として強制せず、共有する目的を限定する。',
          founderReviewQuestionJa:
            '目的限定情報共有を、開示候補の中心下部構造としてよいか。',
          nextNblUseCandidateJa:
            'about/operating-boundaryとtoolkitで開示前整理に使う。',
        },
        {
          substructureId: 'disclosure_invisible_condition_and_stigma',
          labelJa: '見えにくい障害・難病・精神障害とスティグマ',
          observationFocusJa:
            '気分障害、統合失調症、難病、慢性疾患などでは、見えにくさと偏見が開示判断を難しくする。',
          inferenceFocusJa:
            '話す/話さないの問題は、本人の説明力ではなく、不利益評価や偏見リスクとの相互作用である。',
          protectedSignalsJa: [
            '気分障害（うつ、そううつ等）',
            '統合失調症',
            '難病法上も障害者総合支援法上でも指定されていない難病の診断を受けている',
          ],
          coverageRole: 'low_n_high_specificity_protection',
          biasGuardJa:
            '見えにくい状態を、説明不足や自己管理不足にしない。',
          founderReviewQuestionJa:
            '見えにくさとスティグマを、開示候補の独立下部構造として残してよいか。',
          nextNblUseCandidateJa:
            '記事と相談事例で「言う/言わない」以前の条件整理に使う。',
        },
        {
          substructureId: 'disclosure_evaluation_and_overmanagement_risk',
          labelJa: '不利益評価・過剰管理への転化リスク',
          observationFocusJa:
            '共有された情報が、配慮ではなく低評価、過剰管理、役割縮小に使われる危険がある。',
          inferenceFocusJa:
            '開示は支援への橋にもなるが、評価・管理の材料にもなるため、境界を設計する必要がある。',
          protectedSignalsJa: ['xQ15-3', 'accommodation_gap', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '開示すれば解決するという単線的な支援観を避ける。',
          founderReviewQuestionJa:
            '不利益評価・過剰管理リスクを、開示候補の必須下部構造にするべきか。',
          nextNblUseCandidateJa:
            'theory/trustで「なぜ断定しないか」の説明に使う。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '開示は「全部話すか隠すか」ではなく、目的を限定し、不利益を避けながら仕事条件へつなぐ設計である。',
        axiomReadingJa:
          'Axiomは、開示、説明、同意、スティグマ、不利益評価、過剰管理を、情報共有の量ではなく境界設計の問題として読む。',
        changesReadingJa: [
          '支援を受けるために本人がすべて説明する前提を置かない。',
          '誰に、何を、何のために、どこまで共有するかを仕事条件と結びつける。',
          '見えにくい障害や難病、精神障害の開示リスクを同じ箱に押し込めず、必要な違いを残す。',
        ],
        founderReviewQuestionJa:
          'この発見を、Axiom版NBLの開示・スティグマ・目的限定情報共有候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          '記事、work-condition window、about/operating-boundaryで「開示前に条件を言語化する」導線に使う。',
        boundaryNoteJa:
          '開示を推奨・強制しない。法的判断や合理的配慮の最終判断にも進めない。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_pre_entry_job_image_transition',
      titleJa: '入口前の仕事像・体験接続・移行支援',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_from_single_provisional_candidate',
      sourceProvisionalUnitIds: ['revised_unit_pre_entry_job_image_and_transition'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['narrative_field', 'concept'],
        protectedSignalLabelsJa: [
          '７記述',
          '6記述',
          '5記述',
          '8就労経験:現在収入のある仕事なし35.8%',
          'self_efficacy_and_future_outlook',
        ],
        patternFamilyIds: ['accommodation_gap'],
        patternLevelIds: ['local', 'micro'],
        sourceLensIds: [],
      },
      whyJa:
        '入口前・応募前・移行期の材料は低頻度ではない。現在収入のある仕事がない層35.8%と7系就職前/就職活動課題を、就職後中心の読みで過小評価しないため維持する。',
      reviewFocusJa:
        '就職済み事例に引きずられて、未就業・応募前・訓練中の仕事条件理解を薄くしていないかを見る。',
      granularityStatus: 'requires_substructure_review_before_surface_projection',
      substructureCoverageStatus:
        'substructure_must_be_reviewed_before_surface_projection',
      substructureCoverageNoteJa:
        '入口前候補は就職済みデータに埋もれやすい。未就業、応募前、訓練/体験、家族・学校・支援接続を分けてレビューする必要がある。',
      substructures: [
        {
          substructureId: 'pre_entry_no_work_experience_job_image_gap',
          labelJa: '非就労中・未就業層と仕事像の空白',
          observationFocusJa:
            'employment_survey_3000では、現在収入のある仕事がない回答者が35.8%ある。これは低頻度ではなく、入口前・移行期の仕事条件を読む大きなフェーズ信号である。',
          inferenceFocusJa:
            '仕事像の空白は本人の準備不足ではなく、仕事条件を試し、翻訳する機会の不足として読む。',
          protectedSignalsJa: [
            '8就労経験:現在収入のある仕事なし35.8%',
            '７記述',
            'self_efficacy_and_future_outlook',
          ],
          coverageRole: 'phase_specific_protection',
          biasGuardJa:
            '就職済みデータで仕事設計全体を代表させず、非就労中/未就業層を少数例扱いしない。',
          founderReviewQuestionJa:
            '非就労中・未就業層を、入口前候補の独立下部構造としてよいか。',
          nextNblUseCandidateJa:
            'homeとwork-design guideで「働く前に仕事条件を考える」導線に使う。',
        },
        {
          substructureId: 'pre_entry_application_before_disclosure_and_condition_translation',
          labelJa: '応募前に条件を言語化できない',
          observationFocusJa:
            '応募前には、何を伝えるか、どんな条件が必要か、仕事側に何を聞くかが曖昧になりやすい。',
          inferenceFocusJa:
            '応募前の困難は本人の意欲ではなく、仕事条件と言葉の準備不足として読む。',
          protectedSignalsJa: ['6記述', 'disclosure_and_explanation'],
          coverageRole: 'phase_specific_protection',
          biasGuardJa:
            '入口前の開示問題を、就業後の開示候補だけに吸収しない。',
          founderReviewQuestionJa:
            '応募前の条件言語化を、入口前候補の下部構造として明示してよいか。',
          nextNblUseCandidateJa:
            'toolkitで応募前質問・条件整理カードに使う。',
        },
        {
          substructureId: 'pre_entry_training_work_trial_and_experience_connection',
          labelJa: '訓練・職場体験・試行機会との接続',
          observationFocusJa:
            '訓練や体験が仕事条件の理解につながらないと、実際の職場で何が必要か分かりにくい。',
          inferenceFocusJa:
            '体験機会は単なる準備ではなく、仕事条件を検証する小さな実験として読む。',
          protectedSignalsJa: ['5記述', 'accommodation_gap', 'local'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '訓練や体験を就職前の一般論にせず、条件検証の場として扱う。',
          founderReviewQuestionJa:
            '訓練・体験接続を、入口前候補の実装下部構造として残すべきか。',
          nextNblUseCandidateJa:
            'case-readingとtoolkitで「試して分かる仕事条件」の説明に使う。',
        },
        {
          substructureId: 'pre_entry_family_school_support_transition_handoff',
          labelJa: '家族・学校・支援機関から職場へのhandoff',
          observationFocusJa:
            '学校、家族、支援機関、医療から職場へ情報や支援が引き継がれないと、入口で条件が途切れる。',
          inferenceFocusJa:
            '入口前支援は、本人を送り出すことではなく、仕事条件へ翻訳してhandoffする機能である。',
          protectedSignalsJa: ['accommodation_and_support', 'support_retranslation', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '入口前を本人の準備だけにせず、接続の設計として読む。',
          founderReviewQuestionJa:
            '移行handoffを、入口前候補の下部構造として含めてよいか。',
          nextNblUseCandidateJa:
            '相談事例とaboutで「入口前から支援を切らない」説明に使う。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '就職前の仕事像や体験接続が薄いと、本人も職場も「どんな条件なら働けるか」を考えにくくなる。',
        axiomReadingJa:
          'Axiomは、未就業、応募前、訓練、移行期の材料を、就職後支援の前段階ではなく、仕事条件を理解する独立した領域として読む。',
        changesReadingJa: [
          '就職済みデータだけで仕事設計を代表させない。',
          '仕事経験の不足を本人の準備不足ではなく、体験機会と翻訳の不足として見る。',
          '応募前から、作業、時間、情報、評価、支援接続を試せる形にする。',
        ],
        founderReviewQuestionJa:
          'この発見を、入口前・移行期の仕事像形成候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'home、work-design guide、toolkitで「働く前に仕事条件を試す」導線に使う。',
        boundaryNoteJa:
          '就職していない/現在収入のある仕事がない人のデータは低頻度ではない。公開本文へ進める時も、就職後中心の読みで入口前フェーズを過小評価しない。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_worksite_contact_task_safety_tools',
      titleJa: '職場接触点・移動・作業・安全・道具の実装条件',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_with_boundary_tightening',
      sourceProvisionalUnitIds: ['revised_unit_worksite_contact_task_safety_tools'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['concept', 'frame', 'narrative_field'],
        protectedSignalLabelsJa: ['accommodation_and_support', 'environmental_factors', '10記述', 'xQ05'],
        patternFamilyIds: ['accommodation_gap'],
        patternLevelIds: ['global', 'local', 'micro'],
        sourceLensIds: ['historical_linked_triangular_source_family'],
      },
      whyJa:
        '配慮を善意や制度名で止めず、移動、作業、道具、安全、情報、人員余力の接触点として保持する。',
      reviewFocusJa:
        'accommodation_gapが小さいfamilyだからといって、現場実装の核心を落としていないかを見る。',
      granularityStatus: 'requires_substructure_review_before_surface_projection',
      substructureCoverageStatus:
        'substructure_must_be_reviewed_before_surface_projection',
      substructureCoverageNoteJa:
        '現場実装候補は広く、職場内移動・職場外移動、作業、道具、安全、人員余力、顧客接点、評価を分けなければ抽象的な配慮論に戻る。',
      substructures: [
        {
          substructureId: 'worksite_contact_task_decomposition_and_work_density',
          labelJa: '作業分解・仕事密度・手順の接触点',
          observationFocusJa:
            '配慮が必要な場面は、作業量、手順、締切、同時並行、ミス許容度の接触点に現れる。',
          inferenceFocusJa:
            '仕事を変えるには、能力評価ではなく、どの作業接点が負荷を作っているかを分解する必要がある。',
          protectedSignalsJa: ['activity_and_participation_difficulty', 'fatigue_schedule', 'global'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '作業困難を本人の能力問題にせず、仕事密度と手順の設計として読む。',
          founderReviewQuestionJa:
            '作業分解・仕事密度を、現場実装候補の中核下部構造としてよいか。',
          nextNblUseCandidateJa:
            'toolkit/studioで仕事分解カードに使う。',
        },
        {
          substructureId: 'worksite_contact_tools_equipment_and_environment',
          labelJa: '道具・設備・物理/感覚環境',
          observationFocusJa:
            '道具、端末、作業台、照明、音、移動経路、休憩場所が実装条件になる。',
          inferenceFocusJa:
            '環境調整は周辺配慮ではなく、仕事が成立する接触面そのものである。',
          protectedSignalsJa: ['environmental_factors', '切断、その他', '弱視・視野障害'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '道具・環境を一般的な職場改善に丸めず、障害特性と仕事接触点の相互作用として読む。',
          founderReviewQuestionJa:
            '道具・設備・環境を現場実装候補の明確な下部構造としてよいか。',
          nextNblUseCandidateJa:
            'work-condition windowで「環境は仕事条件」の説明に使う。',
        },
        {
          substructureId: 'worksite_contact_internal_external_mobility_and_commute',
          labelJa: '職場内移動・職場外移動・通勤接続',
          observationFocusJa:
            '職場内の移動経路、フロア間移動、休憩場所への距離、職場外移動、通勤、出張が、働ける時間や担当できる作業を左右する。',
          inferenceFocusJa:
            '移動は単なる移動能力ではなく、環境、道具、勤務場所、勤務頻度、支援接続、健康時間が交差する仕事接触点である。',
          protectedSignalsJa: [
            'environmental_factors',
            '切断、その他',
            '頸髄損傷',
            'fatigue_schedule',
            'xQ05',
          ],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '移動課題を本人の身体能力や通勤努力に閉じず、職場内外の経路・距離・回復・支援接続の設計として読む。',
          founderReviewQuestionJa:
            '職場内移動・職場外移動・通勤接続を、現場実装候補の独立した下部構造として扱ってよいか。',
          nextNblUseCandidateJa:
            'work-condition windowとtoolkit/studioで「移動経路・通勤・休憩場所」を仕事条件カードにする。',
        },
        {
          substructureId: 'worksite_contact_safety_risk_and_error_tolerance',
          labelJa: '安全・リスク・ミス許容度',
          observationFocusJa:
            '安全確認、体調悪化時の対応、ミスの影響、危険作業、単独作業が配慮の成否を左右する。',
          inferenceFocusJa:
            '安全は就労可否の断定ではなく、仕事接触点と支援体制の設計である。',
          protectedSignalsJa: ['てんかん', '頸髄損傷', 'micro'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '安全リスクを理由に排除へ短絡せず、変更可能な条件として分解する。',
          founderReviewQuestionJa:
            '安全・リスク・ミス許容度を現場実装候補に含めてよいか。',
          nextNblUseCandidateJa:
            '相談事例で安全懸念を仕事条件へ分解する説明に使う。',
        },
        {
          substructureId: 'worksite_contact_staffing_customer_and_coordination_margin',
          labelJa: '人員余力・顧客接点・調整余地',
          observationFocusJa:
            '職場規模、人員余力、顧客対応、代替要員、上司の調整余地により同じ配慮でも実装可能性が変わる。',
          inferenceFocusJa:
            '配慮の実装は制度の有無ではなく、現場が調整を吸収できる余白に左右される。',
          protectedSignalsJa: ['accommodation_gap', '10記述', 'xQ05'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '配慮を本人と制度の二者関係にせず、職場資源を含めて読む。',
          founderReviewQuestionJa:
            '人員余力・顧客接点を現場実装候補の下部構造として扱ってよいか。',
          nextNblUseCandidateJa:
            'toolkit/studioで職場規模と調整余地の確認に使う。',
        },
        {
          substructureId: 'worksite_contact_evaluation_role_and_feedback_connection',
          labelJa: '評価・役割・フィードバック接点',
          observationFocusJa:
            '役割、評価基準、注意のされ方、成果の見え方が、配慮後の働きやすさを左右する。',
          inferenceFocusJa:
            '実装は作業を変えるだけではなく、評価・役割・フィードバックと接続して初めて安定する。',
          protectedSignalsJa: ['self_efficacy_and_future_outlook', '9記述', 'accommodation_gap'],
          coverageRole: 'implementation_contact_point',
          biasGuardJa:
            '配慮を楽にすることだけにせず、役割と評価の接点まで見る。',
          founderReviewQuestionJa:
            '評価・役割・フィードバック接点を現場実装候補に含めるべきか。',
          nextNblUseCandidateJa:
            'work-design guideで「配慮後の役割設計」へ展開する。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '配慮は制度名や善意ではなく、職場のどの接触点をどう変えられるかで実装される。',
        axiomReadingJa:
          'Axiomは、移動経路、作業、道具、安全、情報、人員余力、顧客接点、評価基準を、配慮が現実に働くかどうかを決める接触点として読む。',
        changesReadingJa: [
          '「配慮あり/なし」で止めず、どの作業接点が未分解かを見る。',
          '職場側の不安を能力判断にせず、変更可能な接触点へ分解する。',
          '小さいaccommodation_gap familyを、現場実装の核心として保護する。',
        ],
        founderReviewQuestionJa:
          'この発見を、Axiom版NBLの現場実装候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'toolkit/studio、相談事例、work-condition windowで仕事条件カードや図解へ展開する。',
        boundaryNoteJa:
          '個別職場への実装指示や安全判断はしない。候補として接触点を見える化する。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_support_retranslation_continuity_network',
      titleJa: '支援の再翻訳・継続接続・ネットワーク機能',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_from_single_provisional_candidate',
      sourceProvisionalUnitIds: ['revised_unit_support_retranslation_continuity_network'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['narrative_concept', 'concept', 'narrative_field', 'frame'],
        protectedSignalLabelsJa: ['accommodation_and_support', '11記述', 'xQ11', 'environmental_factors'],
        patternFamilyIds: ['accommodation_gap', 'communication_barrier'],
        patternLevelIds: ['local', 'micro'],
        sourceLensIds: [],
      },
      whyJa:
        '支援を支援者の存在ではなく、本人・職場・医療・制度を仕事条件へ再翻訳する機能として保持する。',
      reviewFocusJa:
        '支援の有無を支援の質と誤読せず、handoffと再接続が見えているかを見る。',
      granularityStatus: 'surface_candidate_ready_with_current_substructure',
      substructureCoverageStatus:
        'substructure_sufficient_for_founder_review_pending_public_copy',
      substructureCoverageNoteJa:
        '支援再翻訳は具体性が高いが、言葉の翻訳、handoff、変化後の再接続を下部構造として保持する。',
      substructures: [
        {
          substructureId: 'support_retranslation_between_person_medical_workplace_language',
          labelJa: '本人・医療・職場の言葉を仕事条件へ翻訳する',
          observationFocusJa:
            '本人の困りごと、医療情報、職場の業務言語がそのままではつながらない。',
          inferenceFocusJa:
            '支援の中核は、各者の言葉を仕事条件として再翻訳することにある。',
          protectedSignalsJa: ['accommodation_and_support', 'environmental_factors'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '支援者の有無を支援の質として扱わない。',
          founderReviewQuestionJa:
            '再翻訳機能を、支援候補の中心下部構造としてよいか。',
          nextNblUseCandidateJa:
            'theory/method/trustでNBLの支援観として説明する。',
        },
        {
          substructureId: 'support_handoff_role_boundary_and_continuity',
          labelJa: 'handoff・役割境界・継続接続',
          observationFocusJa:
            '相談、職場定着、医療、支援機関の間で役割や情報が途切れやすい。',
          inferenceFocusJa:
            '支援は一回の助言ではなく、役割境界を保ちながら接続を切らさない仕組みである。',
          protectedSignalsJa: ['11記述', 'xQ11', 'local'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '関係者を増やすこと自体を支援の質にしない。',
          founderReviewQuestionJa:
            'handoffと継続接続を、支援候補の下部構造として明示してよいか。',
          nextNblUseCandidateJa:
            '相談事例で「誰が何をつなぐか」を示す説明に使う。',
        },
        {
          substructureId: 'support_reconnection_after_change_worsening_or_return',
          labelJa: '悪化・復職・配置換え後に戻れる接続',
          observationFocusJa:
            '体調悪化、復職、配置換え、業務変更後に、以前の支援や条件へ戻れないことがある。',
          inferenceFocusJa:
            '支援の質は、変化後に再接続できるかで決まる。',
          protectedSignalsJa: ['fatigue_schedule', 'communication_barrier', 'micro'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '初回調整だけで支援が完了したと見なさない。',
          founderReviewQuestionJa:
            '変化後の再接続を、支援候補の必須下部構造として残してよいか。',
          nextNblUseCandidateJa:
            'toolkitで「変化時の戻り先」を確認する項目に使う。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '支援の質は、支援者がいることではなく、本人・職場・医療・制度の言葉を仕事条件へ翻訳し続けられることで決まる。',
        axiomReadingJa:
          'Axiomは、相談、紹介、会議、医療情報、職場説明を、個別の支援行為ではなく、言葉を変換し、handoffし、変化後に再接続する機能として読む。',
        changesReadingJa: [
          '相談回数や支援機関の有無だけで支援の質を評価しない。',
          '本人の言葉、医療の言葉、職場の言葉、制度の言葉のずれを見る。',
          '変化、悪化、復職、配置換えの後に戻れる接続を支援の一部として扱う。',
        ],
        founderReviewQuestionJa:
          'この発見を、Axiom版NBLの支援ネットワーク候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'theory/method/trust、相談事例、aboutで「支援を再翻訳機能として読む」説明に使う。',
        boundaryNoteJa:
          '支援機関や専門職の優劣判断にしない。関係者間の機能設計として扱う。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_role_value_growth_quality_loop',
      titleJa: '役割・評価・成長・就業後の質',
      unitKind: 'domain_axis_candidate',
      decisionFromProvisional: 'maintained_from_single_provisional_candidate',
      sourceProvisionalUnitIds: ['revised_unit_role_value_growth_quality_loop'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['concept', 'narrative_field'],
        protectedSignalLabelsJa: ['self_efficacy_and_future_outlook', '9記述', '9その他', 'xQ21'],
        patternFamilyIds: ['fatigue_schedule', 'accommodation_gap'],
        patternLevelIds: ['global', 'local'],
        sourceLensIds: [],
      },
      whyJa:
        '就職・定着だけでなく、役割、評価、学習、選び直し、成長の質を扱う単位として保持する。',
      reviewFocusJa:
        '健康時間を守ることが、評価・成長・役割からの排除として働いていないかを見る。',
      granularityStatus: 'surface_candidate_ready_with_current_substructure',
      substructureCoverageStatus:
        'substructure_sufficient_for_founder_review_pending_public_copy',
      substructureCoverageNoteJa:
        '就業後の質は具体候補として維持できる。役割、評価、成長、選び直しを下部構造として保持する。',
      substructures: [
        {
          substructureId: 'role_value_growth_role_design_after_hiring',
          labelJa: '就職後の役割設計',
          observationFocusJa:
            '就職後に任される役割や責任が、本人の価値感や成長機会とずれることがある。',
          inferenceFocusJa:
            '就労支援は採用で終わらず、役割の意味と調整を見続ける必要がある。',
          protectedSignalsJa: ['self_efficacy_and_future_outlook', '9記述'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '就職したことだけを成功と見なさない。',
          founderReviewQuestionJa:
            '就職後の役割設計を、この候補の下部構造としてよいか。',
          nextNblUseCandidateJa:
            'work-design guideで「配慮後の役割」を説明する。',
        },
        {
          substructureId: 'role_value_growth_evaluation_and_income_fairness',
          labelJa: '評価・処遇・収入の公正さ',
          observationFocusJa:
            '健康時間を守る行動が、低評価、低処遇、成長機会の喪失として働くことがある。',
          inferenceFocusJa:
            '働き続ける質は、評価と処遇が健康時間と矛盾しないかに左右される。',
          protectedSignalsJa: ['xQ21', 'fatigue_schedule'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '配慮を受けることが低い期待や役割縮小につながる構造を見落とさない。',
          founderReviewQuestionJa:
            '評価・処遇・収入の公正さを、就業後の質候補に含めるべきか。',
          nextNblUseCandidateJa:
            'articleとSNSで「働き続ける質」を説明する。',
        },
        {
          substructureId: 'role_value_growth_learning_career_and_rechoice',
          labelJa: '学習・キャリア・選び直し',
          observationFocusJa:
            '働き続ける中で、学習、キャリア、配置、働き方を選び直す機会が必要になる。',
          inferenceFocusJa:
            '成長は余分な要素ではなく、健康時間と両立する仕事設計の成果である。',
          protectedSignalsJa: ['9その他', 'accommodation_gap', 'local'],
          coverageRole: 'core_structure',
          biasGuardJa:
            '定着だけを成果にして、成長や選び直しを支援外にしない。',
          founderReviewQuestionJa:
            '学習・キャリア・選び直しを、この候補の下部構造として扱ってよいか。',
          nextNblUseCandidateJa:
            'homeとwork-design guideで「働き続ける質」を中心テーマ化する。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '就労支援の目的は就職・定着で終わらず、役割、評価、成長、選び直しの質が更新されることにある。',
        axiomReadingJa:
          'Axiomは、就職、定着、配慮実施の後に、役割、評価、学習、キャリア、成長機会、働き続ける意味がどう変わるかを読む。',
        changesReadingJa: [
          '雇用率や定着だけを成果にしない。',
          '健康時間を守ることが、評価や成長からの排除として働いていないかを見る。',
          '本人の選び直しや将来像を、支援の余白ではなく就労の質として扱う。',
        ],
        founderReviewQuestionJa:
          'この発見を、Axiom版NBLの就業後の質・成長候補として受け入れてよいか。',
        nextNblUseCandidateJa:
          'home、work-design guide、SNS/articleで「働き続ける質」を中心テーマ化する。',
        boundaryNoteJa:
          '成果指標を一つに固定しない。雇用継続、健康、評価、成長の緊張関係を残す。',
      },
    }),
    unit({
      rebuiltUnitId: 'rebuilt_unit_source_lens_universal_structure_boundary_guard',
      titleJa: 'source lens: 普遍構造候補と制度・時代差ブレーキ',
      unitKind: 'method_guard_candidate',
      decisionFromProvisional: 'method_guard_maintained',
      sourceProvisionalUnitIds: ['revised_unit_source_lens_universal_structure_and_boundary_guard'],
      allLayerProtectionInputs: {
        tokenLayerIds: ['narrative_concept', 'narrative_field'],
        protectedSignalLabelsJa: ['narrative_units', '自由記述'],
        patternFamilyIds: ['communication_barrier', 'fatigue_schedule', 'accommodation_gap'],
        patternLevelIds: ['global', 'local', 'micro'],
        sourceLensIds: ['nanbyo_survey_4000', 'historical_linked_triangular_source_family'],
      },
      whyJa:
        '各sourceを答えではなく部分的な光として扱い、普遍構造候補と制度・時代差の限界を同時に保持する。',
      reviewFocusJa:
        '難病データや歴史資料を過大代表させず、かつ制度差だけを理由に普遍構造候補を捨てていないかを見る。',
      granularityStatus: 'method_guard_applies_across_domain_units',
      substructureCoverageStatus:
        'substructure_sufficient_for_founder_review_pending_public_copy',
      substructureCoverageNoteJa:
        'これはdomain unitではなく全体にかかるmethod guard。source lensごとの重み、限界、普遍構造候補、公開前ブレーキを分ける。',
      substructures: [
        {
          substructureId: 'source_lens_dominant_nanbyo_loading_guard',
          labelJa: '難病データの大きさを過大代表させない',
          observationFocusJa:
            'nanbyo_survey_4000は大きな信号を持つが、全障害領域を代表するわけではない。',
          inferenceFocusJa:
            'データ量の大きさは重要な材料だが、多様性coverageの代替にはならない。',
          protectedSignalsJa: ['nanbyo_survey_4000', 'long_tail_health_condition_tokens'],
          coverageRole: 'source_lens_guard',
          biasGuardJa:
            '件数の多い難病側へ、感覚障害・認知・内部障害・入口前の知識を吸収しない。',
          founderReviewQuestionJa:
            '難病データの大きさをmethod guardとして明示してよいか。',
          nextNblUseCandidateJa:
            'theory/method/trustで「なぜ層別に読むか」を説明する。',
        },
        {
          substructureId: 'source_lens_historical_international_universal_structure_probe',
          labelJa: '歴史・国際資料から普遍構造候補を探す',
          observationFocusJa:
            '2001 ABCや国際web-cacheは制度差・時代差を持つ一方、繰り返し現れる構造を照らす。',
          inferenceFocusJa:
            '古い/海外だから捨てるのではなく、現在日本への適用限界と普遍構造候補を分けて読む。',
          protectedSignalsJa: ['historical_linked_triangular_source_family', 'narrative_units'],
          coverageRole: 'source_lens_guard',
          biasGuardJa:
            '資料を答えとして輸入せず、構造を照らすレンズとして使う。',
          founderReviewQuestionJa:
            '歴史・国際資料の普遍構造候補探索を、このmethod guardに含めてよいか。',
          nextNblUseCandidateJa:
            'aboutと記事で「複数sourceをどう読むか」の説明に使う。',
        },
        {
          substructureId: 'source_lens_projection_brake_before_public_claim',
          labelJa: '公開前の過剰一般化ブレーキ',
          observationFocusJa:
            '各候補はsource lensの偏りを持つため、公開本文にする前に表現範囲を確認する必要がある。',
          inferenceFocusJa:
            'Axiom coreの発見候補と公開主張は同じではない。source/support validityとpublic approvalは別に残す。',
          protectedSignalsJa: ['source_lens_limits', 'publicProjectionStatus', 'notNow'],
          coverageRole: 'source_lens_guard',
          biasGuardJa:
            'レビュー済み候補をそのまま公開承認と取り違えない。',
          founderReviewQuestionJa:
            '公開前ブレーキを、Axiom core全体にかかるmethod guardとして維持してよいか。',
          nextNblUseCandidateJa:
            'theory/method/trustでNBLの慎重さと信頼境界を説明する。',
        },
      ],
      founderReviewCard: {
        plainFindingJa:
          '国内外・過去資料・調査データは答えそのものではなく、普遍構造候補と制度差を分けて読むためのレンズである。',
        axiomReadingJa:
          'Axiomは、難病調査、国内実務、国際web-cache、2001 ABC、Stage 1成果を、それぞれ部分的な光として扱う。量の多い資料に引きずられず、制度や時代を超えて反復する構造候補と、現在日本ではそのまま使えない限界を同時に保持する。',
        changesReadingJa: [
          '資料数の多さを、そのまま専門知識の重要度にしない。',
          '海外・歴史資料を後ろ向きな制約だけでなく、普遍構造候補を見つける補助線として使う。',
          'source/support validityや公開判断に進む前に、source lensごとの偏りを残す。',
        ],
        founderReviewQuestionJa:
          'このmethod guardを、Axiom coreの統合知識全体にかかる読み方の安全装置として受け入れてよいか。',
        nextNblUseCandidateJa:
          'theory/method/trust、about、記事で「なぜ断定しないのか、なぜ多様なsourceを使うのか」を説明する。',
        boundaryNoteJa:
          'これは公開主張の承認ではない。source/support validity、publication、learning updateは別ゲートに残す。',
      },
    }),
  ];
}

function buildAllLayerCoverageReview(
  rebuiltReviewUnits: AxiomAllLayerRebuiltReviewUnit[],
  reanalysis: AxiomRealDataStratifiedDomainReanalysis,
): AxiomAllLayerCoverageReview {
  const substructureCount = rebuiltReviewUnits.reduce(
    (total, unitItem) => total + unitItem.substructures.length,
    0,
  );
  const substructureSignals = new Set(
    rebuiltReviewUnits.flatMap((unitItem) =>
      unitItem.substructures.flatMap((substructure) => substructure.protectedSignalsJa),
    ),
  );
  const longTailCoveredCount = reanalysis.longTailHealthConditionSignals.filter(
    (signalItem) => substructureSignals.has(signalItem.labelJa),
  ).length;
  const protectedLayerCount = new Set(
    rebuiltReviewUnits.flatMap((unitItem) => unitItem.allLayerProtectionInputs.tokenLayerIds),
  ).size;
  const protectedJointSubjectTokenCount = reanalysis.protectedTokenLayerSummaries.reduce(
    (total, layer) => total + layer.protectedTokenCount,
    0,
  );
  const patternFamilyCount = new Set(
    rebuiltReviewUnits.flatMap(
      (unitItem) => unitItem.allLayerProtectionInputs.patternFamilyIds,
    ),
  ).size;
  const patternLevelCount = new Set(
    rebuiltReviewUnits.flatMap(
      (unitItem) => unitItem.allLayerProtectionInputs.patternLevelIds,
    ),
  ).size;
  const sourceLensCount = new Set(
    rebuiltReviewUnits.flatMap(
      (unitItem) => unitItem.allLayerProtectionInputs.sourceLensIds,
    ),
  ).size;

  return {
    reviewStatus:
      'coverage_sufficient_for_founder_review_not_for_final_public_projection',
    protectedTokenLayerCoverage: `${protectedLayerCount}/5` as '5/5',
    protectedJointSubjectTokenCoverage: `${protectedJointSubjectTokenCount}/49` as '49/49',
    longTailHealthConditionCoverage:
      `${longTailCoveredCount}/${reanalysis.longTailHealthConditionSignals.length}` as '18/18',
    patternFamilyCoverage: `${patternFamilyCount}/3` as '3/3',
    patternLevelCoverage: `${patternLevelCount}/3` as '3/3',
    sourceLensCoverage: `${sourceLensCount}/2` as '2/2',
    totalSubstructureCount: substructureCount,
    highGranularityUnitIds: rebuiltReviewUnits
      .filter(
        (unitItem) =>
          unitItem.granularityStatus ===
          'surface_candidate_ready_with_current_substructure',
      )
      .map((unitItem) => unitItem.rebuiltUnitId),
    substructureRequiredUnitIds: rebuiltReviewUnits
      .filter(
        (unitItem) =>
          unitItem.granularityStatus ===
          'requires_substructure_review_before_surface_projection',
      )
      .map((unitItem) => unitItem.rebuiltUnitId),
    coverageConclusionJa:
      '10候補はFounder review単位としては十分に全層coverageを持つ。ただし3・4・6・7は上位候補名だけでは粗いため、下部構造レビューを通してから公開候補本文へ投影する。',
    remainingRiskJa:
      'coverageはsource/support validityや公開承認ではない。件数の多い難病シグナルに、感覚障害、認知/高次脳/知的障害、内部障害、現場実装の低頻度・高特異性構造を再吸収しないこと、また低頻度ではない入口前/非就労中フェーズを就職後中心の読みで過小評価しないことが残るリスクである。',
    prohibitedShortcut:
      'do_not_accept_top_level_10_without_substructure_coverage_review',
  };
}

function buildPreFounderAutonomousReview(
  rebuiltReviewUnits: AxiomAllLayerRebuiltReviewUnit[],
  coverageReview: AxiomAllLayerCoverageReview,
): AxiomPreFounderAutonomousReview {
  const substructureIds = new Set(
    rebuiltReviewUnits.flatMap((unitItem) =>
      unitItem.substructures.map((substructure) => substructure.substructureId),
    ),
  );
  const relatedOrEmpty = (ids: string[]) =>
    ids.filter((substructureId) => substructureIds.has(substructureId));
  const findings: AxiomPreFounderAutonomousReviewFinding[] = [
    {
      findingId: 'pre_founder_granularity_balance_01',
      passId: 'granularity_balance_review',
      severity: 'founder_attention_required_after_autonomous_rebuild',
      observationJa:
        '10候補のうち3・4・6・7は、上位ラベルだけでは抽象度が高く、Founderが「何を受け入れるのか」を判断しづらい。',
      correctionAppliedJa:
        '候補3・4・6・7を下部構造レビュー必須にし、各候補の中に観察焦点、推論焦点、bias guard、候補サイト用途を持つsubstructureを置いた。',
      remainingFounderQuestionJa:
        'この下部構造の分け方で、上位候補を公開候補本文へ投影する前の判断単位として足りるか。',
      relatedRebuiltUnitIds: coverageReview.substructureRequiredUnitIds,
      relatedSubstructureIds: relatedOrEmpty([
        'sensory_access_visual_information_format',
        'sensory_access_hearing_voice_meeting_information',
        'cognitive_access_instruction_and_procedure_format',
        'cognitive_access_switching_priority_exception_load',
        'pre_entry_training_work_trial_and_experience_connection',
        'worksite_contact_internal_external_mobility_and_commute',
      ]),
      blocksSurfaceProjection: true,
    },
    {
      findingId: 'pre_founder_cross_disability_coverage_01',
      passId: 'cross_disability_coverage_review',
      severity: 'resolved_by_autonomous_rebuild',
      observationJa:
        '件数の多い難病データだけで主軸を作ると、感覚障害、認知/高次脳/知的障害、精神障害、内部障害、現場実装の低頻度・高特異性シグナルが埋没する。さらに、低頻度ではない入口前/非就労中フェーズも、就職後中心の読みで過小評価される。',
      correctionAppliedJa:
        'health_condition、narrative_concept、narrative_field、concept、frameの5層に加え、上位障害種類9カテゴリと就労フェーズ監査を保持し、49 protected tokens、18 long-tail health signals、3 pattern families、3 pattern levels、2 source lensesを10候補と37下部構造へrouteした。',
      remainingFounderQuestionJa:
        'このcoverageで、少数例に由来する重要構造がまだ消えていないと見てよいか。',
      relatedRebuiltUnitIds: rebuiltReviewUnits.map((unitItem) => unitItem.rebuiltUnitId),
      relatedSubstructureIds: relatedOrEmpty([
        'sensory_access_visual_information_format',
        'sensory_access_hearing_voice_meeting_information',
        'cognitive_access_instruction_and_procedure_format',
        'regular_medical_time_checkups_and_continuous_monitoring',
        'disclosure_purpose_limited_information_sharing',
        'support_retranslation_between_person_medical_workplace_language',
      ]),
      blocksSurfaceProjection: true,
    },
    {
      findingId: 'pre_founder_mobility_accessibility_overlap_01',
      passId: 'mobility_and_accessibility_overlap_review',
      severity: 'resolved_by_autonomous_rebuild',
      observationJa:
        '職場内移動・職場外移動・通勤の課題を「身体操作・道具操作」に吸収すると、移動が健康時間、現場接触点、安全、人員余力にまたがる実装条件であることが見えにくくなる。',
      correctionAppliedJa:
        '通勤・職場外移動による健康時間消耗を候補1へ、職場内移動・職場外移動・通勤接続を候補7へ移し、候補3は身体操作・道具操作へのアクセスに範囲を狭めた。',
      remainingFounderQuestionJa:
        '移動を候補1・7に分け、候補3には身体操作/道具操作だけを残す整理で妥当か。',
      relatedRebuiltUnitIds: [
        'rebuilt_unit_fluctuating_health_time_work_density',
        'rebuilt_unit_sensory_information_access_communication',
        'rebuilt_unit_worksite_contact_task_safety_tools',
      ],
      relatedSubstructureIds: relatedOrEmpty([
        'health_time_commute_and_mobility_consumption',
        'sensory_access_body_operation_and_tool_contact',
        'worksite_contact_internal_external_mobility_and_commute',
      ]),
      blocksSurfaceProjection: true,
    },
    {
      findingId: 'pre_founder_source_count_bias_01',
      passId: 'source_count_bias_review',
      severity: 'founder_attention_required_after_autonomous_rebuild',
      observationJa:
        'source数、回答数、時代、制度圏の違いは、重要度の代理変数にはならない。量の多いsource familyがAxiomの発見全体を支配するリスクが残る。',
      correctionAppliedJa:
        'source lens・制度差・歴史差をmethod guard候補として明示し、海外・歴史資料を答えではなく、普遍構造候補と適用限界を分けるレンズとして扱った。',
      remainingFounderQuestionJa:
        'このsource lens guardで、国内外・過去資料・調査データの使い分けが十分に保たれるか。',
      relatedRebuiltUnitIds: [
        'rebuilt_unit_source_lens_universal_structure_boundary_guard',
      ],
      relatedSubstructureIds: relatedOrEmpty([
        'source_lens_historical_international_universal_structure_probe',
        'source_lens_projection_brake_before_public_claim',
      ]),
      blocksSurfaceProjection: true,
    },
    {
      findingId: 'pre_founder_surface_projection_risk_01',
      passId: 'surface_projection_risk_review',
      severity: 'founder_attention_required_after_autonomous_rebuild',
      observationJa:
        '10候補をそのまま次期NBLページ本文へ流すと、Axiom coreの統合知識候補と公開コピー、source/support validity、publication approvalが混線する。',
      correctionAppliedJa:
        'publicProjectionStatus、notNow、coverage review、substructureRequiredUnitIdsを保持し、Founder review後も公開承認・source/support validity・runtime・learning updateは別ゲートに残した。',
      remainingFounderQuestionJa:
        'Founder reviewでは、公開文言ではなく、公開本文へ進めてよい統合知識単位かどうかだけを判断する、という境界でよいか。',
      relatedRebuiltUnitIds: rebuiltReviewUnits.map((unitItem) => unitItem.rebuiltUnitId),
      relatedSubstructureIds: [],
      blocksSurfaceProjection: true,
    },
  ];

  return {
    reviewId: 'axiom_pre_founder_autonomous_review_v0_2026_06_12',
    status:
      'pre_founder_autonomous_review_complete_founder_attention_reduced_not_replaced',
    passIds: [
      'granularity_balance_review',
      'cross_disability_coverage_review',
      'mobility_and_accessibility_overlap_review',
      'source_count_bias_review',
      'surface_projection_risk_review',
    ],
    findingCount: findings.length,
    resolvedFindingCount: findings.filter(
      (finding) => finding.severity === 'resolved_by_autonomous_rebuild',
    ).length,
    founderAttentionRequiredCount: findings.filter(
      (finding) =>
        finding.severity === 'founder_attention_required_after_autonomous_rebuild',
    ).length,
    findings,
    founderReviewCompression: {
      founderReviewRoleJa:
        `Founderは、全${coverageReview.totalSubstructureCount}下部構造を一つずつ監査するのではなく、Codex自律レビュー後に残った5つの高レベル論点と10候補の意味単位を判断する。`,
      codexPreReviewRoleJa:
        'Codexは、粒度差、障害種別横断coverage、移動/アクセス混線、source件数バイアス、公開投影リスクを先に検査し、修正済み箇所と残る判断点を分ける。',
      founderMustReviewQuestionCount: findings.length,
      founderMustNotReviewJa: [
        '個別仮説数百件のsource/support validity最終判断',
        '公開コピーの承認',
        'runtime/prompt/retrieval/model/provider/DB/schema判断',
        'learning update',
      ],
    },
    notNow: [
      'no_replacement_of_founder_review_by_codex_autonomous_review',
      'no_source_or_support_validity_decision',
      'no_public_approval_or_publication',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
    ],
  };
}

export function buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(
  reanalysis: AxiomRealDataStratifiedDomainReanalysis = buildAxiomRealDataStratifiedDomainReanalysis(),
): AxiomAllLayerIntegratedDomainKnowledgeRebuild {
  const rebuiltReviewUnits = buildRebuiltUnits();
  const allLayerCoverageReview = buildAllLayerCoverageReview(rebuiltReviewUnits, reanalysis);
  const preFounderAutonomousReview = buildPreFounderAutonomousReview(
    rebuiltReviewUnits,
    allLayerCoverageReview,
  );

  return {
    rebuildId: 'axiom_all_layer_integrated_domain_knowledge_rebuild_v0_2026_06_12',
    objectType: 'axiom_all_layer_integrated_domain_knowledge_rebuild_candidate',
    contractVersion: AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_VERSION,
    lane: 'Falcon Lab',
    status: 'all_layer_rebuild_candidate_pending_founder_review',
    boundary: AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY,
    strengthensCore: [
      ...AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_CORE_PROGRESS_CLASSES,
    ],
    sourceReanalysisId: reanalysis.reanalysisId,
    provisionalReviewUnitCount: reanalysis.revisedReviewUnitCount,
    revalidatedReviewUnitCount: 10,
    provisionalNineUseStatus:
      'not_fixed_only_comparison_scaffold_after_all_layer_reanalysis',
    revalidationPrincipleJa:
      '暫定9候補は固定入力ではない。全scannable layerの保護結果を見て、維持・分割・統合・rename・holdを再判定する。今回の再判定では、コミュニケーション/情報アクセス候補を、感覚情報アクセスと認知・手順・切替負荷に分割する。',
    provisionalCandidateRevalidations: buildRevalidations(),
    rebuiltReviewUnits,
    allLayerCoverageReview,
    preFounderAutonomousReview,
    coverageAssertions: {
      protectedJointSubjectTokenLayerCount: 5,
      protectedJointSubjectTokenCount: 49,
      longTailHealthConditionTokenCount:
        reanalysis.minoritySignalProtectionPolicy.longTailHealthConditionTokenCount,
      patternFamilyCount: 3,
      patternLevelCount: 3,
      sourceLensCount: 2,
      mustNotDrop: [
        'low_n_health_condition_tokens',
        'low_n_narrative_fields_and_concepts',
        'accommodation_gap_pattern_family',
        'micro_pattern_level',
        'source_lens_limits',
      ],
    },
    nextRequiredCoreMove:
      'founder_review_rebuilt_all_layer_units_before_integrated_domain_object_rebuild_or_surface_projection',
    notNow: [
      'no_use_of_provisional_nine_as_fixed_final_domain_units',
      'no_surface_projection_before_founder_review_of_rebuilt_all_layer_units',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_public_approval_or_publication',
      'no_learning_update',
      'no_raw_sensitive_text_export',
    ],
  };
}

export function validateAxiomAllLayerIntegratedDomainKnowledgeRebuild(
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild,
  reanalysis: AxiomRealDataStratifiedDomainReanalysis = buildAxiomRealDataStratifiedDomainReanalysis(),
): AxiomAllLayerIntegratedDomainKnowledgeRebuildValidation {
  const errors: string[] = [];
  const reanalysisValidation = validateAxiomRealDataStratifiedDomainReanalysis(reanalysis);
  const provisionalIds = new Set(
    reanalysis.revisedReviewUnitCandidates.map((candidate) => candidate.unitId),
  );
  const rebuiltIds = new Set(rebuild.rebuiltReviewUnits.map((unitItem) => unitItem.rebuiltUnitId));
  const allDecisionResultIds = new Set(
    rebuild.provisionalCandidateRevalidations.flatMap(
      (decision) => decision.resultingRebuiltUnitIds,
    ),
  );
  const coveredTokenLayers = new Set(
    rebuild.rebuiltReviewUnits.flatMap((unitItem) => unitItem.allLayerProtectionInputs.tokenLayerIds),
  );
  const coveredPatternFamilies = new Set(
    rebuild.rebuiltReviewUnits.flatMap(
      (unitItem) => unitItem.allLayerProtectionInputs.patternFamilyIds,
    ),
  );
  const coveredPatternLevels = new Set(
    rebuild.rebuiltReviewUnits.flatMap(
      (unitItem) => unitItem.allLayerProtectionInputs.patternLevelIds,
    ),
  );
  const coveredSourceLenses = new Set(
    rebuild.rebuiltReviewUnits.flatMap(
      (unitItem) => unitItem.allLayerProtectionInputs.sourceLensIds,
    ),
  );
  const substructureSignals = new Set(
    rebuild.rebuiltReviewUnits.flatMap((unitItem) =>
      unitItem.substructures.flatMap((substructure) => substructure.protectedSignalsJa),
    ),
  );
  const longTailHealthConditionSubstructureCoverageCount =
    reanalysis.longTailHealthConditionSignals.filter((signalItem) =>
      substructureSignals.has(signalItem.labelJa),
    ).length;
  const totalSubstructureCount = rebuild.rebuiltReviewUnits.reduce(
    (total, unitItem) => total + unitItem.substructures.length,
    0,
  );
  const requiredPreFounderPassIds: AxiomPreFounderAutonomousReviewPassId[] = [
    'granularity_balance_review',
    'cross_disability_coverage_review',
    'mobility_and_accessibility_overlap_review',
    'source_count_bias_review',
    'surface_projection_risk_review',
  ];
  const preFounderPassIds = new Set(rebuild.preFounderAutonomousReview.passIds);
  const preFounderFindingPassIds = new Set(
    rebuild.preFounderAutonomousReview.findings.map((finding) => finding.passId),
  );
  const mobilityReviewFinding = rebuild.preFounderAutonomousReview.findings.find(
    (finding) => finding.passId === 'mobility_and_accessibility_overlap_review',
  );

  pushIf(!reanalysisValidation.valid, errors, 'source_reanalysis_must_be_valid');
  pushIf(
    rebuild.objectType !== 'axiom_all_layer_integrated_domain_knowledge_rebuild_candidate',
    errors,
    'object_type_must_be_all_layer_rebuild_candidate',
  );
  pushIf(rebuild.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    rebuild.status !== 'all_layer_rebuild_candidate_pending_founder_review',
    errors,
    'status_must_remain_pending_founder_review',
  );
  pushIf(
    rebuild.sourceReanalysisId !== reanalysis.reanalysisId,
    errors,
    'source_reanalysis_id_must_match',
  );
  pushIf(
    rebuild.provisionalReviewUnitCount !== 9 ||
      rebuild.provisionalNineUseStatus !==
        'not_fixed_only_comparison_scaffold_after_all_layer_reanalysis',
    errors,
    'provisional_nine_must_not_be_used_as_fixed_final_units',
  );
  pushIf(
    rebuild.revalidatedReviewUnitCount !== 10 ||
      rebuild.rebuiltReviewUnits.length !== 10 ||
      !rebuiltIds.has('rebuilt_unit_sensory_information_access_communication') ||
      !rebuiltIds.has('rebuilt_unit_cognitive_procedural_access_switching_load'),
    errors,
    'all_layer_rebuild_must_split_information_access_from_cognitive_procedural_load',
  );
  pushIf(
    rebuild.provisionalCandidateRevalidations.length !== 9 ||
      !rebuild.provisionalCandidateRevalidations.every(
        (decision) =>
          provisionalIds.has(decision.provisionalUnitId) &&
          decision.resultingRebuiltUnitIds.every((rebuiltUnitId) =>
            rebuiltIds.has(rebuiltUnitId),
          ),
      ) ||
      !rebuild.provisionalCandidateRevalidations.some(
        (decision) =>
          decision.provisionalUnitId ===
            'revised_unit_communication_and_information_access' &&
          decision.decision === 'split_after_all_layer_sweep' &&
          decision.resultingRebuiltUnitIds.length === 2,
      ),
    errors,
    'all_provisional_candidates_must_be_revalidated_and_information_access_must_split',
  );
  for (const rebuiltUnitId of rebuiltIds) {
    pushIf(
      !allDecisionResultIds.has(rebuiltUnitId),
      errors,
      `rebuilt_unit_missing_from_revalidation_decisions:${rebuiltUnitId}`,
    );
  }
  for (const unitItem of rebuild.rebuiltReviewUnits) {
    const founderReviewCard = unitItem.founderReviewCard;
    const requiresSubstructureReview =
      unitItem.granularityStatus ===
      'requires_substructure_review_before_surface_projection';

    pushIf(
      unitItem.publicProjectionStatus !==
        'blocked_until_founder_review_accepts_revises_splits_merges_or_holds_this_rebuilt_unit' ||
        unitItem.sourceProvisionalUnitIds.length === 0 ||
        !unitItem.sourceProvisionalUnitIds.every((unitId) => provisionalIds.has(unitId)) ||
        unitItem.allLayerProtectionInputs.protectedSignalLabelsJa.length === 0,
      errors,
      `rebuilt_unit_must_keep_review_route_and_source_trace:${unitItem.rebuiltUnitId}`,
    );
    pushIf(
      !unitItem.granularityStatus ||
        !unitItem.substructureCoverageStatus ||
        !unitItem.substructureCoverageNoteJa ||
        unitItem.substructures.length < 3,
      errors,
      `rebuilt_unit_must_have_reviewable_substructure:${unitItem.rebuiltUnitId}`,
    );
    pushIf(
      requiresSubstructureReview &&
        (unitItem.substructureCoverageStatus !==
          'substructure_must_be_reviewed_before_surface_projection' ||
          unitItem.substructures.length < 4),
      errors,
      `coarse_unit_must_be_decomposed_before_surface_projection:${unitItem.rebuiltUnitId}`,
    );
    for (const substructure of unitItem.substructures) {
      pushIf(
        !substructure.substructureId ||
          !substructure.labelJa ||
          !substructure.observationFocusJa ||
          !substructure.inferenceFocusJa ||
          substructure.protectedSignalsJa.length === 0 ||
          !substructure.biasGuardJa ||
          !substructure.founderReviewQuestionJa ||
          !substructure.nextNblUseCandidateJa,
        errors,
        `substructure_must_be_clear_and_grounded:${unitItem.rebuiltUnitId}:${substructure.substructureId}`,
      );
    }
    pushIf(
      !founderReviewCard ||
        !founderReviewCard.plainFindingJa ||
        !founderReviewCard.axiomReadingJa ||
        !founderReviewCard.founderReviewQuestionJa ||
        !founderReviewCard.nextNblUseCandidateJa ||
        !founderReviewCard.boundaryNoteJa ||
        !Array.isArray(founderReviewCard.changesReadingJa) ||
        founderReviewCard.changesReadingJa.length < 2,
      errors,
      `rebuilt_unit_must_have_clear_founder_review_card:${unitItem.rebuiltUnitId}`,
    );
  }
  pushIf(
    rebuild.allLayerCoverageReview.reviewStatus !==
      'coverage_sufficient_for_founder_review_not_for_final_public_projection' ||
      rebuild.allLayerCoverageReview.protectedTokenLayerCoverage !== '5/5' ||
      rebuild.allLayerCoverageReview.protectedJointSubjectTokenCoverage !== '49/49' ||
      rebuild.allLayerCoverageReview.longTailHealthConditionCoverage !== '18/18' ||
      rebuild.allLayerCoverageReview.patternFamilyCoverage !== '3/3' ||
      rebuild.allLayerCoverageReview.patternLevelCoverage !== '3/3' ||
      rebuild.allLayerCoverageReview.sourceLensCoverage !== '2/2' ||
      rebuild.allLayerCoverageReview.totalSubstructureCount !== totalSubstructureCount ||
      totalSubstructureCount < 34 ||
      longTailHealthConditionSubstructureCoverageCount !== 18 ||
      ![
        'rebuilt_unit_sensory_information_access_communication',
        'rebuilt_unit_cognitive_procedural_access_switching_load',
        'rebuilt_unit_pre_entry_job_image_transition',
        'rebuilt_unit_worksite_contact_task_safety_tools',
      ].every((unitId) =>
        rebuild.allLayerCoverageReview.substructureRequiredUnitIds.includes(unitId),
      ) ||
      rebuild.allLayerCoverageReview.prohibitedShortcut !==
        'do_not_accept_top_level_10_without_substructure_coverage_review',
    errors,
    'all_layer_coverage_review_must_protect_long_tail_substructure_and_coarse_units',
  );
  pushIf(
    rebuild.preFounderAutonomousReview.status !==
      'pre_founder_autonomous_review_complete_founder_attention_reduced_not_replaced' ||
      rebuild.preFounderAutonomousReview.findingCount !== 5 ||
      rebuild.preFounderAutonomousReview.findings.length !== 5 ||
      rebuild.preFounderAutonomousReview.resolvedFindingCount < 2 ||
      rebuild.preFounderAutonomousReview.founderAttentionRequiredCount < 2 ||
      !requiredPreFounderPassIds.every(
        (passId) => preFounderPassIds.has(passId) && preFounderFindingPassIds.has(passId),
      ) ||
      !rebuild.preFounderAutonomousReview.findings.every(
        (finding) =>
          finding.observationJa &&
          finding.correctionAppliedJa &&
          finding.remainingFounderQuestionJa &&
          finding.blocksSurfaceProjection,
      ),
    errors,
    'pre_founder_autonomous_review_must_run_all_required_passes_before_founder_review',
  );
  pushIf(
    !mobilityReviewFinding ||
      ![
        'rebuilt_unit_fluctuating_health_time_work_density',
        'rebuilt_unit_sensory_information_access_communication',
        'rebuilt_unit_worksite_contact_task_safety_tools',
      ].every((unitId) => mobilityReviewFinding.relatedRebuiltUnitIds.includes(unitId)) ||
      ![
        'health_time_commute_and_mobility_consumption',
        'sensory_access_body_operation_and_tool_contact',
        'worksite_contact_internal_external_mobility_and_commute',
      ].every((substructureId) =>
        mobilityReviewFinding.relatedSubstructureIds.includes(substructureId),
      ),
    errors,
    'pre_founder_autonomous_review_must_record_mobility_accessibility_correction',
  );
  pushIf(
    !rebuild.preFounderAutonomousReview.founderReviewCompression.founderReviewRoleJa.includes(
      '一つずつ監査するのではなく',
    ) ||
      !rebuild.preFounderAutonomousReview.founderReviewCompression.codexPreReviewRoleJa.includes(
        '先に検査',
      ) ||
      rebuild.preFounderAutonomousReview.founderReviewCompression.founderMustReviewQuestionCount !==
        5 ||
      !rebuild.preFounderAutonomousReview.notNow.includes(
        'no_replacement_of_founder_review_by_codex_autonomous_review',
      ) ||
      !rebuild.preFounderAutonomousReview.notNow.includes(
        'no_public_approval_or_publication',
      ) ||
      !rebuild.preFounderAutonomousReview.notNow.includes('no_learning_update'),
    errors,
    'pre_founder_autonomous_review_must_reduce_but_not_replace_founder_review',
  );
  pushIf(
    rebuild.coverageAssertions.protectedJointSubjectTokenLayerCount !== 5 ||
      rebuild.coverageAssertions.protectedJointSubjectTokenCount !== 49 ||
      rebuild.coverageAssertions.longTailHealthConditionTokenCount !== 18 ||
      rebuild.coverageAssertions.patternFamilyCount !== 3 ||
      rebuild.coverageAssertions.patternLevelCount !== 3 ||
      rebuild.coverageAssertions.sourceLensCount !== 2,
    errors,
    'coverage_assertions_must_match_all_layer_reanalysis_counts',
  );
  pushIf(
    !['health_condition', 'narrative_concept', 'narrative_field', 'concept', 'frame'].every(
      (layerId) => coveredTokenLayers.has(layerId as AxiomProtectedTokenLayerId),
    ) ||
      !['communication_barrier', 'fatigue_schedule', 'accommodation_gap'].every((familyId) =>
        coveredPatternFamilies.has(familyId as AxiomPatternFamilyProtection['familyId']),
      ) ||
      !['global', 'local', 'micro'].every((levelId) =>
        coveredPatternLevels.has(levelId as AxiomPatternLevelProtection['levelId']),
      ) ||
      !['nanbyo_survey_4000', 'historical_linked_triangular_source_family'].every((lensId) =>
        coveredSourceLenses.has(lensId as AxiomSourceLensProtection['sourceLensId']),
      ),
    errors,
    'rebuilt_units_must_cover_all_protected_layers_patterns_and_source_lenses',
  );
  pushIf(
    rebuild.nextRequiredCoreMove !==
      'founder_review_rebuilt_all_layer_units_before_integrated_domain_object_rebuild_or_surface_projection',
    errors,
    'next_core_move_must_be_founder_review_of_rebuilt_all_layer_units',
  );
  pushIf(
    !rebuild.notNow.includes('no_use_of_provisional_nine_as_fixed_final_domain_units') ||
      !rebuild.notNow.includes('no_surface_projection_before_founder_review_of_rebuilt_all_layer_units') ||
      !rebuild.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !rebuild.notNow.includes('no_public_approval_or_publication') ||
      !rebuild.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_fixed_nine_surface_runtime_publication_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_all_layer_integrated_domain_knowledge_rebuild_valid'
        : 'axiom_all_layer_integrated_domain_knowledge_rebuild_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY,
    strengthensCore: [
      ...AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_CORE_PROGRESS_CLASSES,
    ],
  };
}
