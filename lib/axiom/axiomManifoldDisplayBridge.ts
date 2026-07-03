import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import { buildAxiomRealDataIntegratedDomainKnowledgeObject } from './realDataIntegratedDomainKnowledgeObject';
import { buildAxiomRealDataStratifiedDomainReanalysis } from './realDataStratifiedDomainReanalysis';

export const AXIOM_MANIFOLD_DISPLAY_BRIDGE_VERSION = 'v0_2026_06_28' as const;

export const AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY =
  'axiom_manifold_display_bridge_is_internal_kernel_display_for_shadow_to_structure_explanation_not_public_approval_or_truth_machine' as const;

export const AXIOM_MANIFOLD_DISPLAY_BRIDGE_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomManifoldDisplayPhaseId =
  | 'distorted_shadow'
  | 'icf_interaction_reconstruction'
  | 'latent_manifold'
  | 'revised_human_shadow';

export type AxiomManifoldDisplayNodeKind =
  | 'source_shadow_word'
  | 'interaction_frame'
  | 'latent_axis'
  | 'public_projection';

export type AxiomManifoldDisplayPoint = {
  x: number;
  y: number;
};

export type AxiomManifoldDisplayPhase = {
  phaseId: AxiomManifoldDisplayPhaseId;
  titleJa: string;
  shortLabelJa: string;
  explanationJa: string;
  displayCautionJa: string;
};

export type AxiomManifoldDisplayNode = {
  nodeId: string;
  kind: AxiomManifoldDisplayNodeKind;
  labelJa: string;
  shortLabelJa: string;
  weight: number;
  sourceBasisJa: string[];
  reviewStatus:
    | 'derived_signal_not_raw_source'
    | 'founder_accepted_internal_axis'
    | 'delivery_projection_candidate';
  publicUseStatus: 'internal_only' | 'candidate_projection_only' | 'not_public_approved';
  phaseCoordinates: Record<AxiomManifoldDisplayPhaseId, AxiomManifoldDisplayPoint>;
};

export type AxiomManifoldDisplayEdge = {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  weight: number;
  relationJa: string;
  evidenceDisciplineJa: string;
};

export type AxiomManifoldDisplayVideoStoryboardStep = {
  stepId: string;
  titleJa: string;
  visualMoveJa: string;
  narrationDraftJa: string;
  boundaryJa: string;
};

export type AxiomManifoldDisplayBridge = {
  bridgeId: string;
  contractVersion: typeof AXIOM_MANIFOLD_DISPLAY_BRIDGE_VERSION;
  lane: 'Falcon Lab';
  status: 'internal_html_svg_simulation_ready_for_founder_understanding_not_public_video_approval';
  boundary: typeof AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY;
  strengthensCore: typeof AXIOM_MANIFOLD_DISPLAY_BRIDGE_CORE_PROGRESS_CLASSES;
  sourceObjectIds: {
    stratifiedReanalysisId: string;
    integratedDomainKnowledgeObjectId: string;
  };
  numericSourceSummary: {
    jointSubjectCount: number;
    employmentSurveyCount: number;
    nanbyoSurveyCount: number;
    manifoldPatternCount: number;
    revisedReviewUnitCount: number;
    integratedAxisCount: number;
  };
  conceptThesisJa: string;
  boundaryLanguageJa: string;
  phases: AxiomManifoldDisplayPhase[];
  simulation: {
    nodes: AxiomManifoldDisplayNode[];
    edges: AxiomManifoldDisplayEdge[];
  };
  videoStoryboard: AxiomManifoldDisplayVideoStoryboardStep[];
  publicCopyRiskReview: {
    internalStatus: 'review';
    primaryRiskJa: string;
    saferFrameJa: string;
    requiredBeforePublicUseJa: string[];
  };
  notNow: string[];
};

export type AxiomManifoldDisplayBridgeValidation = {
  valid: boolean;
  validationStatus: 'axiom_manifold_display_bridge_valid' | 'axiom_manifold_display_bridge_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY;
  strengthensCore: typeof AXIOM_MANIFOLD_DISPLAY_BRIDGE_CORE_PROGRESS_CLASSES;
};

function point(x: number, y: number): AxiomManifoldDisplayPoint {
  return { x, y };
}

function node(
  input: Omit<AxiomManifoldDisplayNode, 'publicUseStatus'> & {
    publicUseStatus?: AxiomManifoldDisplayNode['publicUseStatus'];
  },
): AxiomManifoldDisplayNode {
  return {
    ...input,
    publicUseStatus: input.publicUseStatus ?? 'not_public_approved',
  };
}

function edge(input: AxiomManifoldDisplayEdge): AxiomManifoldDisplayEdge {
  return input;
}

function signalBasis(
  signalById: Map<
    string,
    ReturnType<typeof buildAxiomRealDataStratifiedDomainReanalysis>['signals'][number]
  >,
  signalId: string,
): string {
  const signal = signalById.get(signalId);
  if (!signal) return `missing signal: ${signalId}`;
  const metric = signal.sourceMetric;
  const countText =
    typeof metric.count === 'number'
      ? `${metric.count}${typeof metric.denominator === 'number' ? ` / ${metric.denominator}` : ''}`
      : 'qualitative';
  return `${signal.labelJa}: ${countText}`;
}

export function buildAxiomManifoldDisplayBridge(): AxiomManifoldDisplayBridge {
  const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
  const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();
  const signalById = new Map(reanalysis.signals.map((signal) => [signal.signalId, signal]));
  const patternCount = reanalysis.patternFamilyProtections.reduce(
    (sum, family) => sum + family.patternCount,
    0,
  );

  const phases: AxiomManifoldDisplayPhase[] = [
    {
      phaseId: 'distorted_shadow',
      titleJa: '1. 歪んだ影',
      shortLabelJa: '影',
      explanationJa:
        '潜在的な不変構造は条件下で多様な表現形をとるが、人間にはその一部が日常語、アンケート項目、支援記録、制度資料の歪んだ影として現れる。',
      displayCautionJa:
        '影の密度は重要な手がかりだが、件数の大きさだけでAxiomの専門知識を決めない。',
    },
    {
      phaseId: 'icf_interaction_reconstruction',
      titleJa: '2. 相互作用で補正',
      shortLabelJa: '補正',
      explanationJa:
        'ICFの相互作用モデルとLLMの読解で、影や偏った言語情報を人・仕事・環境・支援・時間・制度の関係へ戻し、背後の構造を復元する。',
      displayCautionJa: 'ICFは支援推論の座標であり、単独の因果理論や配慮答えではない。',
    },
    {
      phaseId: 'latent_manifold',
      titleJa: '3. 潜在多様体',
      shortLabelJa: '多様体',
      explanationJa:
        '低頻度信号、pattern family、source lensを捨てずに、条件が変わっても保たれる仕事・参加条件の構造候補として検査できる形にする。',
      displayCautionJa:
        'ここで見える構造は人間レビュー済み候補の表示であり、AIによる真実の最終断定ではない。',
    },
    {
      phaseId: 'revised_human_shadow',
      titleJa: '4. NBL表現形',
      shortLabelJa: '表現',
      explanationJa:
        '復元した構造を、サイトページ、相談入口、図解、動画、記事など、人間が扱える複数の表現形へ再投影する。',
      displayCautionJa:
        '公開・動画化には、別途 public copy review、Founder判断、source/current claim確認が必要。',
    },
  ];

  const nodes: AxiomManifoldDisplayNode[] = [
    node({
      nodeId: 'word_fatigue_recovery',
      kind: 'source_shadow_word',
      labelJa: '疲れやすい / 回復できない',
      shortLabelJa: '疲労',
      weight: 0.92,
      sourceBasisJa: [
        signalBasis(signalById, 'signal_rare_disease_designated_heavy_loading'),
        signalBasis(signalById, 'signal_multilevel_pattern_family_balance'),
      ],
      reviewStatus: 'derived_signal_not_raw_source',
      phaseCoordinates: {
        distorted_shadow: point(13, 14),
        icf_interaction_reconstruction: point(25, 16),
        latent_manifold: point(28, 23),
        revised_human_shadow: point(17, 18),
      },
    }),
    node({
      nodeId: 'word_regular_care_time',
      kind: 'source_shadow_word',
      labelJa: '定期的な治療・検診が動かせない',
      shortLabelJa: '治療時間',
      weight: 0.74,
      sourceBasisJa: [signalBasis(signalById, 'signal_internal_disability_regular_monitoring')],
      reviewStatus: 'derived_signal_not_raw_source',
      phaseCoordinates: {
        distorted_shadow: point(35, 10),
        icf_interaction_reconstruction: point(38, 17),
        latent_manifold: point(38, 27),
        revised_human_shadow: point(18, 28),
      },
    }),
    node({
      nodeId: 'word_information_access',
      kind: 'source_shadow_word',
      labelJa: '読めない / 聞こえない / 伝わらない',
      shortLabelJa: '情報',
      weight: 0.78,
      sourceBasisJa: [signalBasis(signalById, 'signal_visual_hearing_information_access')],
      reviewStatus: 'derived_signal_not_raw_source',
      phaseCoordinates: {
        distorted_shadow: point(62, 13),
        icf_interaction_reconstruction: point(55, 18),
        latent_manifold: point(61, 28),
        revised_human_shadow: point(21, 40),
      },
    }),
    node({
      nodeId: 'word_disclosure_fear',
      kind: 'source_shadow_word',
      labelJa: '言うのが怖い / どう使われるか不安',
      shortLabelJa: '開示',
      weight: 0.7,
      sourceBasisJa: [signalBasis(signalById, 'signal_mental_health_emotion_stigma')],
      reviewStatus: 'derived_signal_not_raw_source',
      phaseCoordinates: {
        distorted_shadow: point(80, 19),
        icf_interaction_reconstruction: point(63, 26),
        latent_manifold: point(70, 34),
        revised_human_shadow: point(34, 49),
      },
    }),
    node({
      nodeId: 'word_pre_entry_transition',
      kind: 'source_shadow_word',
      labelJa: '仕事像が見えない / 試せない',
      shortLabelJa: '入口前',
      weight: 0.84,
      sourceBasisJa: [
        signalBasis(signalById, 'signal_pre_entry_job_image_and_transition'),
        signalBasis(signalById, 'signal_non_current_income_work_population'),
      ],
      reviewStatus: 'derived_signal_not_raw_source',
      phaseCoordinates: {
        distorted_shadow: point(18, 49),
        icf_interaction_reconstruction: point(36, 48),
        latent_manifold: point(44, 49),
        revised_human_shadow: point(49, 52),
      },
    }),
    node({
      nodeId: 'word_procedure_switching',
      kind: 'source_shadow_word',
      labelJa: '手順・切替・優先順位が重い',
      shortLabelJa: '手順',
      weight: 0.8,
      sourceBasisJa: [signalBasis(signalById, 'signal_cognitive_neuro_and_intellectual_access')],
      reviewStatus: 'derived_signal_not_raw_source',
      phaseCoordinates: {
        distorted_shadow: point(76, 49),
        icf_interaction_reconstruction: point(68, 43),
        latent_manifold: point(66, 47),
        revised_human_shadow: point(63, 48),
      },
    }),
    node({
      nodeId: 'axis_health_time',
      kind: 'latent_axis',
      labelJa: '健康時間・仕事密度・回復余地',
      shortLabelJa: '健康時間',
      weight: 0.96,
      sourceBasisJa: [
        'Founder accepted all-layer unit: health-time and work density',
        `${knowledgeObject.inputPacketCount} input packets before projection`,
      ],
      reviewStatus: 'founder_accepted_internal_axis',
      phaseCoordinates: {
        distorted_shadow: point(30, 30),
        icf_interaction_reconstruction: point(30, 30),
        latent_manifold: point(34, 33),
        revised_human_shadow: point(30, 28),
      },
    }),
    node({
      nodeId: 'axis_information_disclosure',
      kind: 'latent_axis',
      labelJa: '情報アクセス・開示境界・目的限定共有',
      shortLabelJa: '情報/開示',
      weight: 0.9,
      sourceBasisJa: [
        'All-layer rebuild split sensory access and disclosure boundary before page projection',
      ],
      reviewStatus: 'founder_accepted_internal_axis',
      phaseCoordinates: {
        distorted_shadow: point(62, 31),
        icf_interaction_reconstruction: point(57, 31),
        latent_manifold: point(59, 34),
        revised_human_shadow: point(42, 34),
      },
    }),
    node({
      nodeId: 'axis_worksite_touchpoint',
      kind: 'latent_axis',
      labelJa: '職場接触点・作業・安全・道具',
      shortLabelJa: '接触点',
      weight: 0.86,
      sourceBasisJa: [
        'Worksite touchpoint axis preserves task, tool, safety, and staffing conditions',
      ],
      reviewStatus: 'founder_accepted_internal_axis',
      phaseCoordinates: {
        distorted_shadow: point(67, 41),
        icf_interaction_reconstruction: point(63, 38),
        latent_manifold: point(66, 40),
        revised_human_shadow: point(57, 36),
      },
    }),
    node({
      nodeId: 'axis_support_network',
      kind: 'latent_axis',
      labelJa: '支援の再翻訳・継続接続・ネットワーク機能',
      shortLabelJa: '再翻訳',
      weight: 0.82,
      sourceBasisJa: ['Support is treated as retranslation and reconnection, not mere presence'],
      reviewStatus: 'founder_accepted_internal_axis',
      phaseCoordinates: {
        distorted_shadow: point(47, 38),
        icf_interaction_reconstruction: point(48, 37),
        latent_manifold: point(49, 38),
        revised_human_shadow: point(70, 28),
      },
    }),
    node({
      nodeId: 'axis_role_growth',
      kind: 'latent_axis',
      labelJa: '役割・評価・成長・就業後の質',
      shortLabelJa: '成長',
      weight: 0.76,
      sourceBasisJa: ['Employment outcome is not reduced to placement or retention only'],
      reviewStatus: 'founder_accepted_internal_axis',
      phaseCoordinates: {
        distorted_shadow: point(45, 50),
        icf_interaction_reconstruction: point(48, 49),
        latent_manifold: point(50, 48),
        revised_human_shadow: point(79, 37),
      },
    }),
    node({
      nodeId: 'projection_scene_entry',
      kind: 'public_projection',
      labelJa: '8つの課題 / old-new issue entrance',
      shortLabelJa: '8課題',
      weight: 0.68,
      sourceBasisJa: ['Projection candidate from accepted Axiom integrated-domain knowledge'],
      reviewStatus: 'delivery_projection_candidate',
      publicUseStatus: 'candidate_projection_only',
      phaseCoordinates: {
        distorted_shadow: point(88, 13),
        icf_interaction_reconstruction: point(84, 16),
        latent_manifold: point(80, 22),
        revised_human_shadow: point(30, 12),
      },
    }),
    node({
      nodeId: 'projection_case_readings',
      kind: 'public_projection',
      labelJa: '相談事例 / fragmented concern reconstruction',
      shortLabelJa: '相談',
      weight: 0.72,
      sourceBasisJa: [
        'Projection candidate that keeps counter-hypotheses and missing context visible',
      ],
      reviewStatus: 'delivery_projection_candidate',
      publicUseStatus: 'candidate_projection_only',
      phaseCoordinates: {
        distorted_shadow: point(88, 24),
        icf_interaction_reconstruction: point(84, 27),
        latent_manifold: point(79, 32),
        revised_human_shadow: point(44, 12),
      },
    }),
    node({
      nodeId: 'projection_work_design_guide',
      kind: 'public_projection',
      labelJa: '未来の仕事・社会参加設計ガイド',
      shortLabelJa: 'ガイド',
      weight: 0.72,
      sourceBasisJa: [
        'Projection candidate for human-readable work and participation design domains',
      ],
      reviewStatus: 'delivery_projection_candidate',
      publicUseStatus: 'candidate_projection_only',
      phaseCoordinates: {
        distorted_shadow: point(88, 36),
        icf_interaction_reconstruction: point(84, 38),
        latent_manifold: point(78, 43),
        revised_human_shadow: point(58, 12),
      },
    }),
    node({
      nodeId: 'projection_toolkit_video',
      kind: 'public_projection',
      labelJa: '図解・動画・ツールキット',
      shortLabelJa: '動画/図解',
      weight: 0.64,
      sourceBasisJa: [
        'Potential public video must remain awareness/explanation, not advice or proof',
      ],
      reviewStatus: 'delivery_projection_candidate',
      publicUseStatus: 'candidate_projection_only',
      phaseCoordinates: {
        distorted_shadow: point(88, 49),
        icf_interaction_reconstruction: point(84, 49),
        latent_manifold: point(74, 52),
        revised_human_shadow: point(73, 12),
      },
    }),
  ];

  const edges: AxiomManifoldDisplayEdge[] = [
    edge({
      edgeId: 'fatigue_to_health_time',
      sourceNodeId: 'word_fatigue_recovery',
      targetNodeId: 'axis_health_time',
      weight: 0.92,
      relationJa: '日常語を健康時間・仕事密度の相互作用へ戻す',
      evidenceDisciplineJa: 'high-density signal, not diagnosis-to-support rule',
    }),
    edge({
      edgeId: 'care_time_to_health_time',
      sourceNodeId: 'word_regular_care_time',
      targetNodeId: 'axis_health_time',
      weight: 0.74,
      relationJa: '定期管理時間を変動型疲労に吸収しない',
      evidenceDisciplineJa: 'protected subgroup signal',
    }),
    edge({
      edgeId: 'information_to_information_axis',
      sourceNodeId: 'word_information_access',
      targetNodeId: 'axis_information_disclosure',
      weight: 0.78,
      relationJa: '情報アクセスを開示問題だけに潰さない',
      evidenceDisciplineJa: 'sensory / communication access split required',
    }),
    edge({
      edgeId: 'disclosure_to_information_axis',
      sourceNodeId: 'word_disclosure_fear',
      targetNodeId: 'axis_information_disclosure',
      weight: 0.7,
      relationJa: '目的限定共有とスティグマを別の境界として残す',
      evidenceDisciplineJa: 'bias and dignity guard',
    }),
    edge({
      edgeId: 'pre_entry_to_role_growth',
      sourceNodeId: 'word_pre_entry_transition',
      targetNodeId: 'axis_role_growth',
      weight: 0.84,
      relationJa: '就職前の仕事像を就業後成果から切り離して見る',
      evidenceDisciplineJa: 'employment-phase signal, not low-frequency residue',
    }),
    edge({
      edgeId: 'procedure_to_worksite',
      sourceNodeId: 'word_procedure_switching',
      targetNodeId: 'axis_worksite_touchpoint',
      weight: 0.8,
      relationJa: '手順・切替負荷を能力問題でなく接触点設計へ戻す',
      evidenceDisciplineJa: 'cognitive/procedural access split required',
    }),
    edge({
      edgeId: 'support_to_health_time',
      sourceNodeId: 'axis_support_network',
      targetNodeId: 'axis_health_time',
      weight: 0.58,
      relationJa: '医療・生活・職場の時間情報を仕事条件へ再翻訳する',
      evidenceDisciplineJa: 'support validity not decided',
    }),
    edge({
      edgeId: 'health_time_to_scene',
      sourceNodeId: 'axis_health_time',
      targetNodeId: 'projection_scene_entry',
      weight: 0.68,
      relationJa: '健康時間を一般読者が入れるold-new issueにする',
      evidenceDisciplineJa: 'candidate projection only',
    }),
    edge({
      edgeId: 'information_to_case',
      sourceNodeId: 'axis_information_disclosure',
      targetNodeId: 'projection_case_readings',
      weight: 0.72,
      relationJa: '断片的な相談文をmissing contextつきで広げる',
      evidenceDisciplineJa: 'no individual final judgment',
    }),
    edge({
      edgeId: 'worksite_to_guide',
      sourceNodeId: 'axis_worksite_touchpoint',
      targetNodeId: 'projection_work_design_guide',
      weight: 0.7,
      relationJa: '職場接触点を仕事・社会参加設計の読み筋へ変換する',
      evidenceDisciplineJa: 'delivery scaffold, not core truth',
    }),
    edge({
      edgeId: 'role_growth_to_video',
      sourceNodeId: 'axis_role_growth',
      targetNodeId: 'projection_toolkit_video',
      weight: 0.64,
      relationJa: '複雑な構造を図解・動画・ツールキットへ再投影する',
      evidenceDisciplineJa: 'awareness/explanation asset, not advice',
    }),
    edge({
      edgeId: 'support_to_case_readings',
      sourceNodeId: 'axis_support_network',
      targetNodeId: 'projection_case_readings',
      weight: 0.62,
      relationJa: '支援を回答者ではなく翻訳回路として見せる',
      evidenceDisciplineJa: 'human review remains required',
    }),
  ];

  return {
    bridgeId: 'axiom_manifold_display_bridge_v0_2026_06_28',
    contractVersion: AXIOM_MANIFOLD_DISPLAY_BRIDGE_VERSION,
    lane: 'Falcon Lab',
    status:
      'internal_html_svg_simulation_ready_for_founder_understanding_not_public_video_approval',
    boundary: AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY,
    strengthensCore: [...AXIOM_MANIFOLD_DISPLAY_BRIDGE_CORE_PROGRESS_CLASSES],
    sourceObjectIds: {
      stratifiedReanalysisId: reanalysis.reanalysisId,
      integratedDomainKnowledgeObjectId: knowledgeObject.knowledgeObjectId,
    },
    numericSourceSummary: {
      jointSubjectCount: reanalysis.dataProfile.jointSubjectCount,
      employmentSurveyCount: reanalysis.dataProfile.datasetCounts.employment_survey_3000,
      nanbyoSurveyCount: reanalysis.dataProfile.datasetCounts.nanbyo_survey_4000,
      manifoldPatternCount: patternCount,
      revisedReviewUnitCount: reanalysis.revisedReviewUnitCount,
      integratedAxisCount: knowledgeObject.integratedAxisCount,
    },
    conceptThesisJa:
      'Axiomの専門知識ネットワークは、潜在的多様体としての不変構造が条件下で多様な表現形をとる、という前提に立つ。人間が受け取ってきた歪んだ影や偏った言語情報から、ICF相互作用とLLM読解で構造を復元し、最後にNBLサイトとして人間が扱える表現形へ戻す。',
    boundaryLanguageJa:
      'この表示は「真実の最終断定」ではなく、派生済みデータとFounder受領済みAxiom統合知識を、人間が検査できる形へ戻すkernel_displayである。',
    phases,
    simulation: { nodes, edges },
    videoStoryboard: [
      {
        stepId: 'scene_01_shadow_cloud',
        titleJa: '潜在的多様体は条件下で多様な表現形をとる',
        visualMoveJa:
          '薄い不変曲面から、職場・制度・支援・時間条件に応じた複数の表現形が分岐して現れる。',
        narrationDraftJa:
          '本来見たいのは、条件が変わっても保たれる構造です。ただし現実では、その構造は多様な表現形として現れます。',
        boundaryJa: 'source density does not equal public truth',
      },
      {
        stepId: 'scene_02_icf_correction',
        titleJa: '人間には偏った影だけが見えてきた',
        visualMoveJa:
          '日常語ノードがばらばらに浮かび、件数の大きい疲労・健康時間信号が強く光る一方で、見えにくい関係が暗部に残る。',
        narrationDraftJa:
          '資料や声は大事です。ただし、それは現実そのものではなく、見る位置や制度語によって歪んだ影です。',
        boundaryJa: 'human shadows are not the final structure',
      },
      {
        stepId: 'scene_03_latent_manifold',
        titleJa: 'ICF/LLMで影から不変構造を復元する',
        visualMoveJa:
          '人・仕事・環境・支援・時間・制度の補助線が入り、情報アクセス、治療時間、入口前、支援再翻訳などの軸が曲面状にまとまる。',
        narrationDraftJa:
          '強い信号だけで圧縮すると、見えにくい参加条件が消えます。AxiomはICFとLLMで、影の背後にある関係構造を復元候補として立ち上げます。',
        boundaryJa: 'candidate structure remains review-bound',
      },
      {
        stepId: 'scene_04_human_shadows',
        titleJa: '復元構造をNBLサイトの表現形にする',
        visualMoveJa:
          '復元した多様体から8つの課題、相談事例、ガイド、図解・動画などの単純化された投影面が生まれる。',
        narrationDraftJa:
          'NBLサイトの各ページは、多様体そのものではなく、人間が考え始められるように作ったレビュー付きの表現形です。',
        boundaryJa: 'projection is not public approval',
      },
      {
        stepId: 'scene_05_review_gate',
        titleJa: '表現形は公開前にレビューゲートを通す',
        visualMoveJa:
          '投影ノードの前にreview gateが入り、source/current claim、public copy、Founder判断が分離される。',
        narrationDraftJa:
          '見せ方が分かりやすくても、判断を閉じません。公開前には、人間レビューと境界確認を通します。',
        boundaryJa: 'no human judgment replacement',
      },
    ],
    publicCopyRiskReview: {
      internalStatus: 'review',
      primaryRiskJa:
        '「真実の多様体」という比喩が、AIが現実を最終発見するという過剰主張に読まれるリスクがある。',
      saferFrameJa:
        '公開向けには「真実を断定する」ではなく「多くの影を、仕事・環境・支援の条件として読み直す」と表現する。',
      requiredBeforePublicUseJa: [
        'Founder public-copy review',
        'campaign-content boundary review for video assets',
        'source/current-claim verification if statistics or official claims appear',
        'separate publication approval',
      ],
    },
    notNow: [
      'no_raw_or_sensitive_source_text_export',
      'no_actual_public_navigation_or_publication',
      'no_public_video_approval',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      'no_individual_case_final_judgment',
    ],
  };
}

export function validateAxiomManifoldDisplayBridge(
  bridge: AxiomManifoldDisplayBridge = buildAxiomManifoldDisplayBridge(),
): AxiomManifoldDisplayBridgeValidation {
  const errors: string[] = [];
  const phaseIds = new Set(bridge.phases.map((phase) => phase.phaseId));
  const nodeIds = new Set(bridge.simulation.nodes.map((nodeItem) => nodeItem.nodeId));

  if (bridge.lane !== 'Falcon Lab') errors.push('bridge_lane_must_remain_falcon_lab');
  if (bridge.boundary !== AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY) {
    errors.push('bridge_boundary_must_match_internal_display_contract');
  }
  if (!bridge.strengthensCore.includes('kernel_display')) {
    errors.push('bridge_must_strengthen_kernel_display');
  }
  if (bridge.numericSourceSummary.jointSubjectCount !== 9076) {
    errors.push('bridge_must_reference_existing_stratified_reanalysis_counts');
  }
  if (bridge.numericSourceSummary.manifoldPatternCount !== 44) {
    errors.push('bridge_must_preserve_44_manifold_pattern_basis');
  }
  if (!bridge.boundaryLanguageJa.includes('真実の最終断定')) {
    errors.push('bridge_must_block_truth_machine_language');
  }
  if (
    !bridge.publicCopyRiskReview.requiredBeforePublicUseJa.includes('separate publication approval')
  ) {
    errors.push('bridge_must_keep_publication_approval_separate');
  }

  for (const expectedKind of [
    'source_shadow_word',
    'latent_axis',
    'public_projection',
  ] satisfies AxiomManifoldDisplayNodeKind[]) {
    if (!bridge.simulation.nodes.some((nodeItem) => nodeItem.kind === expectedKind)) {
      errors.push(`bridge_missing_node_kind:${expectedKind}`);
    }
  }

  for (const nodeItem of bridge.simulation.nodes) {
    for (const phaseId of phaseIds) {
      const coordinate = nodeItem.phaseCoordinates[phaseId];
      if (!coordinate) errors.push(`node_missing_phase_coordinate:${nodeItem.nodeId}:${phaseId}`);
    }
    if (nodeItem.publicUseStatus === 'internal_only' && nodeItem.kind === 'public_projection') {
      errors.push(`projection_node_must_not_claim_internal_only:${nodeItem.nodeId}`);
    }
    if (nodeItem.sourceBasisJa.some((basis) => basis.includes('data/original_secure'))) {
      errors.push(`node_must_not_expose_sensitive_source_path:${nodeItem.nodeId}`);
    }
  }

  for (const edgeItem of bridge.simulation.edges) {
    if (!nodeIds.has(edgeItem.sourceNodeId) || !nodeIds.has(edgeItem.targetNodeId)) {
      errors.push(`edge_references_missing_node:${edgeItem.edgeId}`);
    }
    if (edgeItem.evidenceDisciplineJa.length === 0) {
      errors.push(`edge_missing_evidence_discipline:${edgeItem.edgeId}`);
    }
  }

  for (const requiredNotNow of [
    'no_raw_or_sensitive_source_text_export',
    'no_actual_public_navigation_or_publication',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
  ]) {
    if (!bridge.notNow.includes(requiredNotNow)) {
      errors.push(`bridge_missing_not_now:${requiredNotNow}`);
    }
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_manifold_display_bridge_valid'
        : 'axiom_manifold_display_bridge_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY,
    strengthensCore: [...AXIOM_MANIFOLD_DISPLAY_BRIDGE_CORE_PROGRESS_CLASSES],
  };
}
