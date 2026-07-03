import {
  type AxiomActionabilityBand,
  type AxiomCoreProgressClass,
  type AxiomImplementationActor,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';
import {
  buildAxiomRealDataSemanticIntegrationRunPlan,
  validateAxiomRealDataSemanticIntegrationRunPlan,
  type AxiomRealDataSemanticIntegrationRunPlan,
} from './realDataSemanticIntegrationRunPlan';

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_VERSION =
  'v0_2026_06_11' as const;

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY =
  'axiom_integrated_domain_knowledge_object_candidate_synthesizes_real_derived_packets_before_any_public_surface_projection_not_final_views_or_publication' as const;

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomIntegratedDomainKnowledgeAxis = {
  axisId: string;
  candidateLabelJa: string;
  integrationRoleJa: string;
  sourcePacketIds: string[];
  observationSynthesisJa: string;
  inferenceSynthesisJa: string;
  counterHypothesesJa: string[];
  missingContextQuestionsJa: Array<{
    slot: AxiomMissingContextSlot;
    questionJa: string;
  }>;
  implementationActorConditionsJa: Array<{
    actor: AxiomImplementationActor;
    conditionJa: string;
  }>;
  sourceLensStatusSummaryJa: string;
  actionabilityBand: AxiomActionabilityBand;
  cannotYetSayJa: string[];
  l3PriorContrastInstruction:
    'compare_after_integration_for_coverage_gap_merge_split_rename_drop_or_hold_not_as_content_source';
  humanReviewRoute:
    'founder_review_required_before_surface_projection_or_public_candidate_body_generation';
};

export type AxiomRealDataIntegratedDomainKnowledgeObject = {
  knowledgeObjectId: string;
  objectType: 'axiom_integrated_domain_knowledge_object_candidate';
  contractVersion: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_VERSION;
  lane: 'Falcon Lab';
  status: 'built_from_real_derived_packets_pending_founder_human_review';
  boundary: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_CORE_PROGRESS_CLASSES;
  sourceRunPlanId: string;
  inputPacketCount: number;
  integratedAxisCount: number;
  viewCountStatus:
    'not_fixed_21_or_27_final_count_axes_are_candidate_components_for_reviewed_merge_split_rename_hold';
  reasoningEffortLabel:
    'xhigh_recommended_for_semantic_integration_as_development_reading_mode_not_runtime_provider_change';
  semanticReadingMethod: readonly [
    'read_partial_data_as_reality_shadow',
    'stratify_by_disability_type_source_lens_and_employment_phase_before_component_compression',
    'retain_low_frequency_high_specificity_subgroup_signals_even_when_loadings_are_small',
    'separate_observation_inference_counter_missing_context',
    'keep_source_lens_and_bias_risk_visible',
    'synthesize_latent_work_design_structure_before_l3_prior_contrast',
    'compress_human_review_to_under_100_framework_units',
  ];
  diversityProtectionPolicy: {
    loadDominanceRisk:
      'rare_disease_heavy_survey_data_can_mislead_component_like_compression';
    requiredCorrection:
      'stratified_subgroup_and_multilevel_signal_retention_before_axis_projection';
    protectedSignalClasses: readonly [
      'visual_and_hearing_communication_access',
      'internal_disability_regular_monitoring',
      'rare_disease_fluctuation_and_disclosure',
      'non_employed_or_pre_entry_experience',
      'low_frequency_high_specificity_disability_type_signals',
    ];
  };
  axes: AxiomIntegratedDomainKnowledgeAxis[];
  l3PriorContrastReport: {
    status: 'pending_after_integrated_object_candidate';
    role: 'coverage_contrast_gap_merge_split_rename_drop_hold_and_naming_candidate_only';
    directContentUse: 'prohibited';
    finalViewCountFixing: 'prohibited';
    expectedNextOutput:
      'l3_prior_match_gap_split_merge_hold_report_after_founder_review_or_explicit_hold';
  };
  reviewCompression: {
    reviewUnitScale: 'integrated_domain_axis_not_individual_hypothesis';
    reviewUnitCount: number;
    maxCoreHumanReviewUnits: 100;
    reviewStatus: 'founder_review_required_before_surface_projection';
  };
  surfaceProjection: {
    status:
      'blocked_until_integrated_domain_axes_are_reviewed_or_explicitly_held';
    allowedAfterReview:
      'project_reviewed_axes_to_falcon_delivery_scaffold_as_public_candidate_content_slots';
    prohibitedNow: readonly [
      'direct_page_body_generation_from_l3_27',
      'actual_public_navigation',
      'publication',
      'runtime_prompt_retrieval_model_provider_db_schema_change',
    ];
  };
  notNow: string[];
};

export type AxiomRealDataIntegratedDomainKnowledgeObjectValidation = {
  valid: boolean;
  validationStatus:
    | 'real_data_integrated_domain_knowledge_object_valid'
    | 'real_data_integrated_domain_knowledge_object_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_CORE_PROGRESS_CLASSES;
};

const PACKETS = {
  cr01: 'axiom_real_derived_evidence_packet_cr01_health_time_v0_2026_06_08',
  jeedPolicy: 'axiom_real_derived_evidence_packet_jeed_policy_service_coordination_v0_2026_06_08',
  jeedDisclosure: 'axiom_real_derived_evidence_packet_jeed_disclosure_procedure_v0_2026_06_08',
  ftcodexQuality:
    'axiom_real_derived_evidence_packet_ftcodex03_supporter_workplace_quality_v0_2026_06_08',
  publicWindow:
    'axiom_real_derived_evidence_packet_public_condition_window_non_lookup_v0_2026_06_08',
  stage1Remaining:
    'axiom_real_data_scale_up_packet_stage1_remaining_context_readings_v0_2026_06_08',
  webCacheBatch2:
    'axiom_real_data_scale_up_packet_web_cache_batch2_underread_axes_v0_2026_06_08',
  ftcodexNetwork:
    'axiom_real_data_scale_up_packet_ftcodex03_network_reconnection_v0_2026_06_08',
  respondentSurveys:
    'axiom_wave2_packet_respondent_surveys_3000_4000_v0_2026_06_08',
  supporterPractice: 'axiom_wave2_packet_supporter_practice_v0_2026_06_08',
  workplaceSurveys: 'axiom_wave2_packet_workplace_surveys_v0_2026_06_08',
  workshopPractice:
    'axiom_wave2_packet_workshop_practice_knowledge_v0_2026_06_08',
  historicalAbc:
    'axiom_wave2_packet_2001_abc_triadic_source_lens_v0_2026_06_08',
  internationalWeb:
    'axiom_wave2_packet_international_web_cache_jurisdiction_contrast_v0_2026_06_08',
} as const;

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function axis(
  input: Omit<AxiomIntegratedDomainKnowledgeAxis, 'l3PriorContrastInstruction' | 'humanReviewRoute'>,
): AxiomIntegratedDomainKnowledgeAxis {
  return {
    ...input,
    l3PriorContrastInstruction:
      'compare_after_integration_for_coverage_gap_merge_split_rename_drop_or_hold_not_as_content_source',
    humanReviewRoute:
      'founder_review_required_before_surface_projection_or_public_candidate_body_generation',
  };
}

function buildAxes(): AxiomIntegratedDomainKnowledgeAxis[] {
  return [
    axis({
      axisId: 'axiom_domain_axis_health_time_life_security_work_density',
      candidateLabelJa: '健康時間・生活保障・仕事密度の相互調整',
      integrationRoleJa:
        '体調変動を本人属性や病名から読むのではなく、仕事量、回復時間、通院、定期検診、収入不安、評価時期が衝突する相互作用として読む。ただし内部障害の定期的管理と難病の変動・再燃を同じ問題に潰さない。',
      sourcePacketIds: [
        PACKETS.cr01,
        PACKETS.publicWindow,
        PACKETS.ftcodexNetwork,
        PACKETS.respondentSurveys,
        PACKETS.stage1Remaining,
      ],
      observationSynthesisJa:
        ' respondent系、CR01、公開condition window、FT-Codex-03は、健康状態そのものよりも、仕事量・回復・通院・定期検診・収入・評価が同じ時間軸で絡むことを示している。同時に、難病に多い変動・再燃と、内部障害等に多い定期検査・管理の時間制約は層別して読む必要がある。',
      inferenceSynthesisJa:
        'Axiomでは、配慮や相談の入口を病名対応に置かず、仕事密度と生活保障を含む時間設計の再調整として仮説化する。その際、負荷量の大きい難病由来の体調変動だけで全体を代表させず、内部障害・精神障害・感覚障害などの時間制約をサブグループ信号として保持する。',
      counterHypothesesJa: [
        '体調変動に見える問題が、実際には評価制度、勤務量、情報不足、生活保障不安によって増幅されているだけかもしれない。',
        '逆に、仕事設計だけで読めない医療・生活側の制約が大きい場合、職場調整だけでは支援仮説にならない。',
      ],
      missingContextQuestionsJa: [
        { slot: 'time', questionJa: '一週間、月内、通院・検診前後、悪化時の仕事量と回復時間はどう配置されているか。' },
        { slot: 'person', questionJa: '本人はどの条件なら働き続ける見通しを持てるか。' },
        { slot: 'source_lens', questionJa: 'この時間問題は難病の変動、内部障害の定期管理、精神面の再発リスク、感覚環境による消耗のどれに近いか、または複合か。' },
        { slot: 'institution', questionJa: '休む、減らす、戻る、選び直すための収入・制度・評価上の余地はあるか。' },
      ],
      implementationActorConditionsJa: [
        { actor: 'worker', conditionJa: '体調、回復、収入、評価不安を切り離さず説明できる安全な相談線が必要。' },
        { actor: 'employer_manager', conditionJa: '仕事量、締切、代替、評価時期を調整可能な単位として見える化する必要。' },
        { actor: 'support_staff', conditionJa: '医療・生活・職場の時間情報を仕事条件へ再翻訳する役割が必要。' },
      ],
      sourceLensStatusSummaryJa:
        'respondent側が厚く、supporter/workplace lensで過度な本人化を補正する必要がある。',
      actionabilityBand: 'usable_provisional_insight',
      cannotYetSayJa: [
        '病名別の配慮答えは言えない。',
        '内部障害の定期検診と難病の体調変動を同じ健康時間問題として一括りにはできない。',
        '勤務継続や配慮有効性の最終判断はできない。',
        '生活保障・医療・職場調整のどれが主因かは個別文脈なしに言えない。',
      ],
    }),
    axis({
      axisId: 'axiom_domain_axis_support_retranslation_continuity_network',
      candidateLabelJa: '支援の再翻訳・継続接続・ネットワーク機能',
      integrationRoleJa:
        '支援を「支援者がいるか」ではなく、本人・職場・医療・制度の言葉を仕事条件へ翻訳し直し続ける機能として読む。',
      sourcePacketIds: [
        PACKETS.ftcodexQuality,
        PACKETS.ftcodexNetwork,
        PACKETS.supporterPractice,
        PACKETS.workshopPractice,
        PACKETS.jeedPolicy,
      ],
      observationSynthesisJa:
        'FT-Codex-03、supporter practice、workshop materialは、相談・紹介・会議そのものよりも、変化後も戻れる翻訳回路の有無を示している。',
      inferenceSynthesisJa:
        'Axiomでは、支援の質を支援存在の有無でなく、役割境界、情報翻訳、handoff、再接続の持続性として仮説化する。',
      counterHypothesesJa: [
        '支援者の関与記録は、実際の継続性や翻訳品質を示していないかもしれない。',
        '支援が厚いほど本人や職場の主体的な調整容量が育つとは限らない。',
      ],
      missingContextQuestionsJa: [
        { slot: 'support', questionJa: '誰が、どの情報を、どの相手の言葉へ翻訳しているか。' },
        { slot: 'institution', questionJa: '相談後、配置変更後、悪化後、失敗後にも戻れる線があるか。' },
        { slot: 'source_lens', questionJa: '支援者視点だけで、本人・職場の経験が薄くなっていないか。' },
      ],
      implementationActorConditionsJa: [
        { actor: 'support_staff', conditionJa: '紹介や助言ではなく、再翻訳と再接続の責任範囲を明確にする必要。' },
        { actor: 'employer_manager', conditionJa: '支援者に渡すべき職務・評価・安全・情報条件を具体化する必要。' },
        { actor: 'reviewer', conditionJa: '支援存在を支援有効性として扱う過剰推論を止める必要。' },
      ],
      sourceLensStatusSummaryJa:
        'supporter lensが厚く、respondent/workplace lensとの照合なしにはsupport validityへ進めない。',
      actionabilityBand: 'question_first_only',
      cannotYetSayJa: [
        '支援機関や支援者の有効性は言えない。',
        '個別ケースでどの支援者が適切かは言えない。',
        '制度・地域・職場条件を無視して一般化はできない。',
      ],
    }),
    axis({
      axisId: 'axiom_domain_axis_worksite_contact_task_information_safety',
      candidateLabelJa: '職場接触点・タスク・情報・安全の実装条件',
      integrationRoleJa:
        '配慮を抽象的な善意や制度手続に閉じず、作業、情報形式、安全、人員余力、顧客接点、評価に分解して読む。',
      sourcePacketIds: [
        PACKETS.jeedDisclosure,
        PACKETS.workplaceSurveys,
        PACKETS.webCacheBatch2,
        PACKETS.ftcodexQuality,
        PACKETS.stage1Remaining,
      ],
      observationSynthesisJa:
        'JEED disclosure/procedure、workplace survey、web-cache underread axesは、職場側の懸念を能力判断ではなく接触点の未分解として読む必要を示す。',
      inferenceSynthesisJa:
        'Axiomでは、開示・配慮・手順を、何を誰に知らせるかではなく、どの仕事接触点をどう変更できるかの実装仮説として組み直す。',
      counterHypothesesJa: [
        '職場懸念は現実の安全・人員制約かもしれないが、未検証の不安や情報不足かもしれない。',
        '本人の困難とされるものが、実は手順、道具、会議形式、例外処理の設計不全かもしれない。',
      ],
      missingContextQuestionsJa: [
        { slot: 'job', questionJa: '困難が起きる具体的な作業、手順、例外処理、時間帯はどこか。' },
        { slot: 'environment', questionJa: '安全、音、光、移動、休息、情報形式は仕事遂行にどう接触しているか。' },
        { slot: 'support', questionJa: '現場で実装を支える人員・権限・道具・手順はあるか。' },
      ],
      implementationActorConditionsJa: [
        { actor: 'employer_manager', conditionJa: '職務、手順、安全、顧客、人員余力を具体的な変更単位で示す必要。' },
        { actor: 'worker', conditionJa: '開示情報が採否や評価ではなく仕事条件調整に使われる保証が必要。' },
        { actor: 'reviewer', conditionJa: '職場懸念を客観的不可能性や本人能力判断として固定しない確認が必要。' },
      ],
      sourceLensStatusSummaryJa:
        'workplace/implementation lensが厚いが、本人経験と支援翻訳なしには可否判断へ進めない。',
      actionabilityBand: 'question_first_only',
      cannotYetSayJa: [
        '法的配慮義務や合理的配慮の十分性は言えない。',
        '職場側の懸念が妥当か差別的かはこの段階では言えない。',
        '特定の調整策が有効とは言えない。',
      ],
    }),
    axis({
      axisId: 'axiom_domain_axis_source_lens_jurisdiction_historical_brake',
      candidateLabelJa: 'source lens・制度差・歴史差から見る普遍構造と過剰一般化ブレーキ',
      integrationRoleJa:
        '国内外web、2001 ABC、Stage1成果を、答えの輸入や過去知識の再利用にしない。同時に、時代や国を超えて反復する構造を見つける材料として読み、普遍構造候補と制度・時代依存の限界を分ける。',
      sourcePacketIds: [
        PACKETS.jeedPolicy,
        PACKETS.webCacheBatch2,
        PACKETS.historicalAbc,
        PACKETS.internationalWeb,
        PACKETS.stage1Remaining,
      ],
      observationSynthesisJa:
        '国際web-cacheと2001 ABCは、現行日本実務の答えではない。一方で、制度差・時代差・立場差を超えて繰り返し現れる相互作用を照らし、何が普遍構造候補で、何が現在日本の制度文脈に依存するかを分ける材料である。',
      inferenceSynthesisJa:
        'Axiomでは、source lensを補助情報ではなく、普遍構造候補の発見、反対仮説生成、過剰一般化ブレーキを同時に担う推論装置として組み込む。',
      counterHypothesesJa: [
        '海外制度で成立する支援構造が、日本の法制度・サービス・文化・職場慣行では成立しないかもしれない。',
        '逆に、国や時代が違っても反復する構造を、制度差だけを理由に捨ててしまうと重要な発見を失うかもしれない。',
        '2001年の三者視点は有益な構造対照だが、現代の難病・障害者雇用の文脈には転用できないかもしれない。',
      ],
      missingContextQuestionsJa: [
        { slot: 'source_lens', questionJa: 'この知見は誰の視点、どの制度、どの時代、どの目的から来ているか。' },
        { slot: 'institution', questionJa: '制度・サービス・法律・企業慣行の違いで何が変わるか。' },
        { slot: 'evidence', questionJa: '比較材料に留めるべきなのか、時代や国を超えて反復する普遍構造候補として保持すべきなのか。' },
      ],
      implementationActorConditionsJa: [
        { actor: 'public_or_institutional_actor', conditionJa: '法制度・政策・サービスの現在性と管轄差を明示する必要。' },
        { actor: 'support_staff', conditionJa: '海外・歴史資料を実務指示ではなく問いの生成に使う必要。' },
        { actor: 'reviewer', conditionJa: 'current policy claim、source validity、public guidanceへの飛躍を止める必要。' },
      ],
      sourceLensStatusSummaryJa:
        'external evidence lensは、普遍構造候補の発見とcurrentness/jurisdiction holdの両方を担う。公開・実務claimへは別レビューが必要。',
      actionabilityBand: 'hold_or_research_needed',
      cannotYetSayJa: [
        '海外資料を日本の法的・制度的助言として使えない。',
        '歴史資料を現在の一般的構造として確定できないが、普遍構造候補として捨ててもいけない。',
        'source/support validityは未判断。',
      ],
    }),
    axis({
      axisId: 'axiom_domain_axis_information_participation_disclosure_boundary',
      candidateLabelJa: '参加アクセス・情報形式・開示境界の分離設計',
      integrationRoleJa:
        '開示を本人の説明力に閉じない。さらに、視覚・聴覚等の感覚障害に関わるコミュニケーション/情報アクセス問題を、難病や精神障害等の開示問題と混同せず、別の参加設計として分けて読む。',
      sourcePacketIds: [
        PACKETS.publicWindow,
        PACKETS.jeedDisclosure,
        PACKETS.workplaceSurveys,
        PACKETS.workshopPractice,
        PACKETS.ftcodexQuality,
      ],
      observationSynthesisJa:
        '公開condition window、JEED手続、workplace/workshop資料は、情報が「伝わった」だけでは仕事条件にならず、形式・タイミング・目的限定が必要なことを示す。視覚・聴覚等の情報アクセスは、本人情報の開示とは異なる参加条件として分けて扱う必要がある。',
      inferenceSynthesisJa:
        'Axiomでは、開示や情報提供を、採否・評価の材料ではなく、参加の質を支える仕事情報環境の設計として仮説化する。開示境界、会議・文書・音声・視覚情報アクセス、応募前の仕事像を分けた上で接続する。',
      counterHypothesesJa: [
        '情報共有が増えるほど安全になるのではなく、不利益評価や過剰管理を生むことがある。',
        '感覚障害のコミュニケーション困難を開示の問題に吸収すると、必要な情報形式・会議設計・環境調整が見えなくなるかもしれない。',
        '本人が開示しないことが問題なのではなく、開示しても調整単位へ翻訳されない環境が問題かもしれない。',
      ],
      missingContextQuestionsJa: [
        { slot: 'person', questionJa: '本人は何を共有したくないか、何なら目的限定で共有できるか。' },
        { slot: 'job', questionJa: '情報は具体的な手順、道具、会議、評価、相談線へ変換されているか。' },
        { slot: 'environment', questionJa: '情報形式、会議速度、文書、音声、視覚情報が参加を妨げていないか。視覚・聴覚アクセスの問題を開示問題に混ぜていないか。' },
      ],
      implementationActorConditionsJa: [
        { actor: 'worker', conditionJa: '同意、目的限定、不利益防止、撤回可能性が見える必要。' },
        { actor: 'employer_manager', conditionJa: '情報を評価ではなく作業条件調整に使う運用が必要。' },
        { actor: 'support_staff', conditionJa: '本人情報を現場で使える手順や道具に翻訳する支援が必要。' },
      ],
      sourceLensStatusSummaryJa:
        'person/workplace/support lensの交差点であり、開示リスクと感覚アクセスを混ぜるとsource lens差がそのまま過剰一般化リスクになる。',
      actionabilityBand: 'question_first_only',
      cannotYetSayJa: [
        '開示すべき内容や範囲は個別に決められない。',
        '視覚・聴覚等の参加アクセス問題を、本人が開示すべき医療情報の問題として扱ってよいとは言えない。',
        '情報共有の適法性・十分性は言えない。',
        '公開用にはさらに安全な表現変換が必要。',
      ],
    }),
    axis({
      axisId: 'axiom_domain_axis_value_role_growth_quality_loop',
      candidateLabelJa: '役割・価値・成長・就業後の質のループ',
      integrationRoleJa:
        '就職を入口の成功で終えず、採用後に役割、評価、学習、キャリア、再調整がどう循環するかとして読む。',
      sourcePacketIds: [
        PACKETS.ftcodexQuality,
        PACKETS.historicalAbc,
        PACKETS.respondentSurveys,
        PACKETS.workplaceSurveys,
        PACKETS.jeedPolicy,
      ],
      observationSynthesisJa:
        'FT-Codex-03 quality、2001 ABC、respondent/workplace系は、雇用後の評価・役割・成長が本人、職場、制度の間でずれることを示している。',
      inferenceSynthesisJa:
        'Axiomでは、就労支援の成果を就職や配慮実施だけでなく、価値が役割・評価・処遇・学習へ翻訳され続けるループとして捉える。',
      counterHypothesesJa: [
        '安定就労に見えても、役割固定、評価されない貢献、成長機会の喪失が隠れているかもしれない。',
        '本人の満足だけでも企業評価だけでも、就業後の質を十分に説明できない。',
      ],
      missingContextQuestionsJa: [
        { slot: 'job', questionJa: '本人の貢献は職務、役割、評価、処遇の言葉に翻訳されているか。' },
        { slot: 'time', questionJa: '配置後、悪化後、回復後、成長後に役割を調整する回路があるか。' },
        { slot: 'support', questionJa: '支援は就職前だけでなく、就業後の質と再調整に接続しているか。' },
      ],
      implementationActorConditionsJa: [
        { actor: 'worker', conditionJa: '続けるだけでなく、学び、選び直し、価値を示す機会が必要。' },
        { actor: 'employer_manager', conditionJa: '役割・評価・処遇を健康時間や仕事条件と連動して見直す必要。' },
        { actor: 'reviewer', conditionJa: '成果を就職・定着・配慮実施だけに還元しない確認が必要。' },
      ],
      sourceLensStatusSummaryJa:
        'historical triadic lensと現在のrespondent/workplace lensを対照し、成果概念の狭さを補正する。',
      actionabilityBand: 'usable_provisional_insight',
      cannotYetSayJa: [
        '特定施策が定着や成長を保証するとは言えない。',
        '企業・本人・支援者のどの評価を優先すべきかは言えない。',
        '公開前に表現を支援有効性の断定から切り離す必要がある。',
      ],
    }),
  ];
}

export function buildAxiomRealDataIntegratedDomainKnowledgeObject(
  runPlan: AxiomRealDataSemanticIntegrationRunPlan =
    buildAxiomRealDataSemanticIntegrationRunPlan(),
): AxiomRealDataIntegratedDomainKnowledgeObject {
  const axes = buildAxes();

  return {
    knowledgeObjectId:
      'axiom_integrated_domain_knowledge_object_candidate_v0_2026_06_11',
    objectType: 'axiom_integrated_domain_knowledge_object_candidate',
    contractVersion: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_VERSION,
    lane: 'Falcon Lab',
    status: 'built_from_real_derived_packets_pending_founder_human_review',
    boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY,
    strengthensCore: [
      ...AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_CORE_PROGRESS_CLASSES,
    ],
    sourceRunPlanId: runPlan.runPlanId,
    inputPacketCount: runPlan.totalInputPacketCount,
    integratedAxisCount: axes.length,
    viewCountStatus:
      'not_fixed_21_or_27_final_count_axes_are_candidate_components_for_reviewed_merge_split_rename_hold',
    reasoningEffortLabel:
      'xhigh_recommended_for_semantic_integration_as_development_reading_mode_not_runtime_provider_change',
    semanticReadingMethod: [
      'read_partial_data_as_reality_shadow',
      'stratify_by_disability_type_source_lens_and_employment_phase_before_component_compression',
      'retain_low_frequency_high_specificity_subgroup_signals_even_when_loadings_are_small',
      'separate_observation_inference_counter_missing_context',
      'keep_source_lens_and_bias_risk_visible',
      'synthesize_latent_work_design_structure_before_l3_prior_contrast',
      'compress_human_review_to_under_100_framework_units',
    ],
    diversityProtectionPolicy: {
      loadDominanceRisk:
        'rare_disease_heavy_survey_data_can_mislead_component_like_compression',
      requiredCorrection:
        'stratified_subgroup_and_multilevel_signal_retention_before_axis_projection',
      protectedSignalClasses: [
        'visual_and_hearing_communication_access',
        'internal_disability_regular_monitoring',
        'rare_disease_fluctuation_and_disclosure',
        'non_employed_or_pre_entry_experience',
        'low_frequency_high_specificity_disability_type_signals',
      ],
    },
    axes,
    l3PriorContrastReport: {
      status: 'pending_after_integrated_object_candidate',
      role: 'coverage_contrast_gap_merge_split_rename_drop_hold_and_naming_candidate_only',
      directContentUse: 'prohibited',
      finalViewCountFixing: 'prohibited',
      expectedNextOutput:
        'l3_prior_match_gap_split_merge_hold_report_after_founder_review_or_explicit_hold',
    },
    reviewCompression: {
      reviewUnitScale: 'integrated_domain_axis_not_individual_hypothesis',
      reviewUnitCount: axes.length,
      maxCoreHumanReviewUnits: 100,
      reviewStatus: 'founder_review_required_before_surface_projection',
    },
    surfaceProjection: {
      status:
        'blocked_until_integrated_domain_axes_are_reviewed_or_explicitly_held',
      allowedAfterReview:
        'project_reviewed_axes_to_falcon_delivery_scaffold_as_public_candidate_content_slots',
      prohibitedNow: [
        'direct_page_body_generation_from_l3_27',
        'actual_public_navigation',
        'publication',
        'runtime_prompt_retrieval_model_provider_db_schema_change',
      ],
    },
    notNow: Array.from(
      new Set([
        'no_direct_public_page_body_generation_before_founder_review',
        'no_l3_27_direct_public_copy',
        'no_fixed_21_or_27_final_view_count',
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_movement',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
        ...runPlan.notNow,
      ]),
    ),
  };
}

export function validateAxiomRealDataIntegratedDomainKnowledgeObject(
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject,
  runPlan: AxiomRealDataSemanticIntegrationRunPlan =
    buildAxiomRealDataSemanticIntegrationRunPlan(),
): AxiomRealDataIntegratedDomainKnowledgeObjectValidation {
  const errors: string[] = [];
  const runPlanValidation = validateAxiomRealDataSemanticIntegrationRunPlan(runPlan);
  const expectedPacketIds = new Set(
    runPlan.sourcePacketSelections.map((selection) => selection.evidencePacketId),
  );
  const axisPacketIds = new Set(
    knowledgeObject.axes.flatMap((axisItem) => axisItem.sourcePacketIds),
  );

  pushIf(!runPlanValidation.valid, errors, 'source_run_plan_must_validate');
  pushIf(
    knowledgeObject.objectType !== 'axiom_integrated_domain_knowledge_object_candidate',
    errors,
    'object_type_must_be_integrated_domain_knowledge_object_candidate',
  );
  pushIf(knowledgeObject.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    knowledgeObject.status !== 'built_from_real_derived_packets_pending_founder_human_review',
    errors,
    'knowledge_object_must_remain_pending_founder_human_review',
  );
  pushIf(
    knowledgeObject.boundary !== AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY,
    errors,
    'boundary_must_keep_integrated_object_before_public_surface_projection',
  );
  pushIf(
    knowledgeObject.inputPacketCount !== runPlan.totalInputPacketCount ||
      knowledgeObject.inputPacketCount !== 14,
    errors,
    'integrated_object_must_use_14_real_derived_input_packets',
  );
  pushIf(
    knowledgeObject.integratedAxisCount !== knowledgeObject.axes.length ||
      knowledgeObject.axes.length !== 6 ||
      knowledgeObject.reviewCompression.reviewUnitCount !== knowledgeObject.axes.length ||
      knowledgeObject.reviewCompression.maxCoreHumanReviewUnits !== 100,
    errors,
    'integrated_axes_must_be_six_compressed_review_units_under_100',
  );
  pushIf(
    knowledgeObject.viewCountStatus !==
      'not_fixed_21_or_27_final_count_axes_are_candidate_components_for_reviewed_merge_split_rename_hold',
    errors,
    'view_count_must_not_be_fixed_to_21_or_27',
  );
  pushIf(
    !knowledgeObject.semanticReadingMethod.includes(
      'stratify_by_disability_type_source_lens_and_employment_phase_before_component_compression',
    ) ||
      !knowledgeObject.semanticReadingMethod.includes(
        'retain_low_frequency_high_specificity_subgroup_signals_even_when_loadings_are_small',
      ),
    errors,
    'semantic_reading_must_protect_stratified_low_n_subgroup_signals',
  );
  pushIf(
    knowledgeObject.diversityProtectionPolicy.loadDominanceRisk !==
      'rare_disease_heavy_survey_data_can_mislead_component_like_compression' ||
      knowledgeObject.diversityProtectionPolicy.requiredCorrection !==
        'stratified_subgroup_and_multilevel_signal_retention_before_axis_projection' ||
      knowledgeObject.diversityProtectionPolicy.protectedSignalClasses.length !== 5,
    errors,
    'diversity_protection_policy_must_block_rare_disease_load_dominance',
  );
  for (const packetId of expectedPacketIds) {
    pushIf(!axisPacketIds.has(packetId), errors, `integrated_axis_missing_packet:${packetId}`);
  }
  for (const axisItem of knowledgeObject.axes) {
    pushIf(axisItem.sourcePacketIds.length === 0, errors, `axis_missing_sources:${axisItem.axisId}`);
    pushIf(
      axisItem.observationSynthesisJa.length === 0 ||
        axisItem.inferenceSynthesisJa.length === 0 ||
        axisItem.counterHypothesesJa.length === 0 ||
        axisItem.missingContextQuestionsJa.length === 0 ||
        axisItem.implementationActorConditionsJa.length === 0 ||
        axisItem.cannotYetSayJa.length === 0,
      errors,
      `axis_must_preserve_kernel_fields:${axisItem.axisId}`,
    );
    pushIf(
      axisItem.l3PriorContrastInstruction !==
        'compare_after_integration_for_coverage_gap_merge_split_rename_drop_or_hold_not_as_content_source',
      errors,
      `axis_l3_prior_must_be_contrast_only:${axisItem.axisId}`,
    );
    pushIf(
      axisItem.humanReviewRoute !==
        'founder_review_required_before_surface_projection_or_public_candidate_body_generation',
      errors,
      `axis_must_route_to_founder_review:${axisItem.axisId}`,
    );
  }
  pushIf(
    knowledgeObject.l3PriorContrastReport.directContentUse !== 'prohibited' ||
      knowledgeObject.l3PriorContrastReport.finalViewCountFixing !== 'prohibited',
    errors,
    'l3_prior_contrast_report_must_prohibit_direct_content_and_fixed_count',
  );
  pushIf(
    knowledgeObject.surfaceProjection.status !==
      'blocked_until_integrated_domain_axes_are_reviewed_or_explicitly_held' ||
      !knowledgeObject.surfaceProjection.prohibitedNow.includes('actual_public_navigation') ||
      !knowledgeObject.surfaceProjection.prohibitedNow.includes('publication'),
    errors,
    'surface_projection_must_remain_blocked_until_axis_review',
  );
  pushIf(
    !knowledgeObject.notNow.includes('no_direct_public_page_body_generation_before_founder_review') ||
      !knowledgeObject.notNow.includes('no_l3_27_direct_public_copy') ||
      !knowledgeObject.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !knowledgeObject.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_public_l3_runtime_and_learning_movement',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_data_integrated_domain_knowledge_object_valid'
        : 'real_data_integrated_domain_knowledge_object_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY,
    strengthensCore: [
      ...AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_CORE_PROGRESS_CLASSES,
    ],
  };
}
