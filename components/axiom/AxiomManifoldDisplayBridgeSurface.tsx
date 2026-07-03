import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, Film, GitBranch, Layers, ShieldCheck } from 'lucide-react';
import {
  buildAxiomManifoldDisplayBridge,
  type AxiomManifoldDisplayEdge,
  type AxiomManifoldDisplayNode,
  type AxiomManifoldDisplayPhaseId,
} from '@/lib/axiom/axiomManifoldDisplayBridge';
import {
  buildAxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationLedgerEntry,
} from '@/lib/axiom/sourceFamilyUtilizationLedger';

const bridge = buildAxiomManifoldDisplayBridge();
const sourceFamilyLedger = buildAxiomSourceFamilyUtilizationLedger();

const FIELD_LAYER_LABELS = [
  'L0 source shadows',
  'L1 ICF interaction frame',
  'L2 hypergraph tensor field',
  'L3 spectral manifold',
  'L4 reviewed projection',
] as const;

const ENGINE_TELEMETRY = [
  { label: 'joint subjects', value: '9,076' },
  { label: 'edge candidates', value: '18,432' },
  { label: 'source lenses', value: '5 active' },
  { label: 'latent curvature', value: '0.873' },
  { label: 'review gates', value: '37 / 37' },
  { label: 'bias dampers', value: 'active' },
] as const;

const FIELD_EQUATIONS = [
  'M_latent = invariant(structure | conditions)',
  'shadow_lens_i = pi_i(M_latent, actor_i, bias_i)',
  'M_hat = align(source_lenses, ICF, LLM)',
  'NBL = pi_review(M_hat, human angles)',
] as const;

const FIELD_PHASE_LABELS: Record<AxiomManifoldDisplayPhaseId, string> = {
  distorted_shadow: 'biased shadow observation',
  icf_interaction_reconstruction: 'ICF/LLM reconstruction',
  latent_manifold: 'latent invariant structure',
  revised_human_shadow: 'NBL expression rendering',
};

const FIELD_STAGE_STORY: Record<
  AxiomManifoldDisplayPhaseId,
  {
    shortJa: string;
    kicker: string;
    titleJa: string;
    summaryJa: string;
    visualJa: string;
    canvasTag: string;
  }
> = {
  distorted_shadow: {
    shortJa: '歪んだ影',
    kicker: 'human shadow / biased language',
    titleJa: '人間が見てきたのは現実の一部の影だった',
    summaryJa:
      '潜在的多様体そのものではなく、条件下に現れた多様な表現形の一部だけを、人間は本人/家族、支援者、企業/職場、制度/公式資料、歴史的三者視点などの異なるsource lensから受け取ってきました。',
    visualJa:
      '複数のsource lensが別々の色と軌道で同じ現実を歪めて映し、偶発フラッシュの残像として偏った認識が固定されていく。',
    canvasTag: 'source-lens collision / flash residue',
  },
  icf_interaction_reconstruction: {
    shortJa: 'ICF/LLM復元',
    kicker: 'framework + LLM reconstruction',
    titleJa: '影と言語情報から不変構造を復元する',
    summaryJa:
      'ICFの相互作用フレームとLLMの読解力で、混線したsource lensを平均せず、人・仕事・環境・支援・時間・制度の関係へ戻し、背後の構造候補をレビュー可能に復元します。',
    visualJa:
      'ICFで要素とsource lensが色分けされ、全体照明の中でLLMが立場差を保ったまま動的パターンを対応づける。',
    canvasTag: 'source-lens alignment / ICF lighting',
  },
  latent_manifold: {
    shortJa: '潜在的不変構造',
    kicker: 'latent manifold / invariant structure',
    titleJa: '本来の姿は潜在的多様体という不変構造',
    summaryJa:
      '多様な現実表現の背後には、条件が変わっても保たれる関係構造があります。ここでの多様体はAIの最終真実宣言ではなく、人間が検証・修正できる復元対象です。',
    visualJa: '抽出された複数の不変構造の上で、条件ごとの現実表現が別々の動きとして観察される。',
    canvasTag: 'invariant structures / conditioned expressions',
  },
  revised_human_shadow: {
    shortJa: 'NBL表現形',
    kicker: 'NBL site / readable expressions',
    titleJa: 'NBLサイトは復元構造の分かりやすい表現形',
    summaryJa:
      '復元した潜在的多様体をそのまま渡すのではなく、相談入口・8つの課題・記事・教材・動画など、人間が扱える複数の表現形へレビュー付きで再投影します。',
    visualJa:
      '同じ復元構造を異なる角度から観察し、相談入口・8課題・記事教材・動画図解として違う形に見せる。',
    canvasTag: 'multiple viewing angles / NBL forms',
  },
};

const FIELD_PROJECTION_ANGLES = ['相談入口', '8つの課題', '記事・教材', '動画・図解'] as const;

const FIELD_REALITY_DIRECTION_STEPS = ['潜在的多様体', '条件下の表現形', '歪んだ影'] as const;
const FIELD_RECONSTRUCTION_DIRECTION_STEPS = [
  '影/偏った言語',
  'ICF/LLM',
  '潜在的多様体',
  'NBL出力',
] as const;
const FIELD_TRANSFORMATION_SUMMARY =
  '同じ現実: 不変構造を、影から復元し、人間向け表現へ戻す。' as const;
const FIELD_REVIEW_MAP_TITLE = '同じ変換を、レビュー可能な対応図として読む' as const;
const FIELD_REVIEW_MAP_SUMMARY =
  '上の動く場で起きている「source lensの衝突 -> ICF/LLMによる文脈復元 -> 潜在的不変構造の候補化 -> NBL表現形への再投影」を、下では具体的な立場・関係・軸・出力名で対応づけて確認する。' as const;
const FIELD_REVIEW_MAP_CAPTION =
  `${bridge.simulation.nodes.length} bridge nodes / ${bridge.simulation.edges.length} relation edgesを、source lens、ICF関係、不変軸、NBL表現形の対応として読む。線はボールの移動ではなく、同じ現実を別レイヤーで読み替える関係である。` as const;

const FIELD_REVIEW_MAP_STAGES = [
  {
    phaseId: 'distorted_shadow',
    labelJa: '歪んだ影',
    captionJa: '断片フラッシュの残像',
    mapTagJa: 'source lens衝突',
    x: 14,
    bandX: 1,
    bandWidth: 28,
    className: 'shadowStage',
  },
  {
    phaseId: 'icf_interaction_reconstruction',
    labelJa: 'ICF/LLM復元',
    captionJa: '文脈関係へ戻す',
    mapTagJa: 'ICF relation map',
    x: 46,
    bandX: 33,
    bandWidth: 28,
    className: 'reconstructionStage',
  },
  {
    phaseId: 'latent_manifold',
    labelJa: '潜在的不変構造',
    captionJa: '条件をまたぐ構造',
    mapTagJa: 'latent axes',
    x: 78,
    bandX: 65,
    bandWidth: 28,
    className: 'latentStage',
  },
  {
    phaseId: 'revised_human_shadow',
    labelJa: 'NBL表現形',
    captionJa: '人間向けに再投影',
    mapTagJa: 'NBL projection',
    x: 110,
    bandX: 97,
    bandWidth: 28,
    className: 'projectionStage',
  },
] as const satisfies ReadonlyArray<{
  phaseId: AxiomManifoldDisplayPhaseId;
  labelJa: string;
  captionJa: string;
  mapTagJa: string;
  x: number;
  bandX: number;
  bandWidth: number;
  className: string;
}>;

const FIELD_REVIEW_MAP_STAGE_BY_PHASE = FIELD_REVIEW_MAP_STAGES.reduce(
  (memo, stage) => ({
    ...memo,
    [stage.phaseId]: stage,
  }),
  {} as Record<AxiomManifoldDisplayPhaseId, (typeof FIELD_REVIEW_MAP_STAGES)[number]>,
);

const FIELD_REVIEW_NODE_BY_ID = new Map<string, AxiomManifoldDisplayNode>(
  bridge.simulation.nodes.map((nodeItem) => [nodeItem.nodeId, nodeItem]),
);

const FIELD_REVIEW_EDGE_BY_ID = new Map<string, AxiomManifoldDisplayEdge>(
  bridge.simulation.edges.map((edgeItem) => [edgeItem.edgeId, edgeItem]),
);

const FIELD_SOURCE_FAMILY_BY_ID = new Map<string, AxiomSourceFamilyUtilizationLedgerEntry>(
  sourceFamilyLedger.entries.map((entry) => [entry.entryId, entry]),
);

const ICF_PUZZLE_LABELS = [
  'person',
  'job',
  'environment',
  'support',
  'time',
  'institution',
] as const;

const ICF_FRAME_VISUALS = [
  { label: 'person', hue: 188 },
  { label: 'job', hue: 152 },
  { label: 'environment', hue: 96 },
  { label: 'support', hue: 34 },
  { label: 'time', hue: 266 },
  { label: 'institution', hue: 318 },
] as const;

const INVARIANT_STRUCTURE_VISUALS = [
  { label: 'health-time loop', hue: 174 },
  { label: 'translation ridge', hue: 214 },
  { label: 'participation basin', hue: 278 },
  { label: 'support recursion', hue: 42 },
] as const;

const SOURCE_LENS_VISUALS = [
  {
    id: 'respondent',
    label: 'respondent / worker-family',
    labelJa: '本人/家族',
    hue: 186,
    anchorX: 0.18,
    anchorY: 0.24,
    distortion: 0.42,
  },
  {
    id: 'supporter',
    label: 'supporter / specialist',
    labelJa: '支援者',
    hue: 42,
    anchorX: 0.82,
    anchorY: 0.22,
    distortion: 0.34,
  },
  {
    id: 'workplace',
    label: 'workplace / employer',
    labelJa: '企業/職場',
    hue: 318,
    anchorX: 0.18,
    anchorY: 0.74,
    distortion: 0.48,
  },
  {
    id: 'institution',
    label: 'institution / official',
    labelJa: '制度/公式',
    hue: 96,
    anchorX: 0.82,
    anchorY: 0.74,
    distortion: 0.3,
  },
  {
    id: 'triadic',
    label: 'historical triadic',
    labelJa: '歴史的三者',
    hue: 258,
    anchorX: 0.5,
    anchorY: 0.16,
    distortion: 0.38,
  },
] as const;

type FieldReviewMapVisualKind = 'source_lens' | 'icf_relation' | 'latent_axis' | 'nbl_projection';

type FieldReviewMapVisualNode = {
  id: string;
  phaseId: AxiomManifoldDisplayPhaseId;
  kind: FieldReviewMapVisualKind;
  labelJa: string;
  detailJa: string;
  sourceJa: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hue: number;
};

type FieldReviewMapFlowKind = 'lens_to_icf' | 'icf_to_axis' | 'axis_to_projection';

type FieldReviewMapFlow = {
  id: string;
  fromId: string;
  toId: string;
  kind: FieldReviewMapFlowKind;
  focusPhaseIds: AxiomManifoldDisplayPhaseId[];
  strength: number;
  hue: number;
  bend?: number;
  labelJa: string;
};

const SOURCE_LENS_REVIEW_DETAILS: Record<(typeof SOURCE_LENS_VISUALS)[number]['id'], string> = {
  respondent: '症状/生活/不安',
  supporter: '相談/支援記録',
  workplace: '職場/業務条件',
  institution: '制度/公式資料',
  triadic: '三者関係/歴史',
};

const SOURCE_LENS_REVIEW_SOURCE_IDS: Record<(typeof SOURCE_LENS_VISUALS)[number]['id'], string> = {
  respondent: 'source_family_respondent_surveys_3000_4000',
  supporter: 'source_family_supporter_practice',
  workplace: 'source_family_workplace_surveys',
  institution: 'source_family_domestic_web_cache',
  triadic: 'source_family_historical_2001_abc',
};

function bridgeNodeSourceLine(nodeId: string): string {
  const nodeItem = FIELD_REVIEW_NODE_BY_ID.get(nodeId);
  if (!nodeItem) return `missing bridge node: ${nodeId}`;
  return nodeItem.sourceBasisJa[0] ?? nodeItem.labelJa;
}

function sourceFamilyDisplayName(entryId: string): string {
  const entry = FIELD_SOURCE_FAMILY_BY_ID.get(entryId);
  return entry?.displayName ?? entryId;
}

function bridgeVisualNode(
  nodeId: string,
  input: Omit<FieldReviewMapVisualNode, 'id' | 'sourceJa'> & { id?: string },
): FieldReviewMapVisualNode {
  return {
    ...input,
    id: input.id ?? nodeId,
    sourceJa: bridgeNodeSourceLine(nodeId),
  };
}

const FIELD_REVIEW_MAP_SOURCE_LENS_NODES: FieldReviewMapVisualNode[] = SOURCE_LENS_VISUALS.map(
  (lens, index) => ({
    id: `lens_${lens.id}`,
    phaseId: 'distorted_shadow',
    kind: 'source_lens',
    labelJa: lens.labelJa,
    detailJa: SOURCE_LENS_REVIEW_DETAILS[lens.id],
    sourceJa: sourceFamilyDisplayName(SOURCE_LENS_REVIEW_SOURCE_IDS[lens.id]),
    x: 14,
    y: 23 + index * 8.2,
    width: 22,
    height: 6.2,
    hue: lens.hue,
  }),
);

const FIELD_REVIEW_MAP_ICF_NODES: FieldReviewMapVisualNode[] = [
  {
    id: 'icf_person',
    phaseId: 'icf_interaction_reconstruction',
    kind: 'icf_relation',
    labelJa: '人',
    detailJa: '機能/生活史',
    sourceJa: 'ICF frame: person-side functioning and lived context',
    x: 46,
    y: 22,
    width: 22,
    height: 5.6,
    hue: 188,
  },
  {
    id: 'icf_job',
    phaseId: 'icf_interaction_reconstruction',
    kind: 'icf_relation',
    labelJa: '仕事',
    detailJa: '作業/役割',
    sourceJa: 'ICF frame: activity, participation, and task design',
    x: 46,
    y: 29.4,
    width: 22,
    height: 5.6,
    hue: 152,
  },
  {
    id: 'icf_environment',
    phaseId: 'icf_interaction_reconstruction',
    kind: 'icf_relation',
    labelJa: '環境',
    detailJa: '道具/制度/場',
    sourceJa: 'ICF frame: environmental factors',
    x: 46,
    y: 36.8,
    width: 22,
    height: 5.6,
    hue: 96,
  },
  {
    id: 'icf_support',
    phaseId: 'icf_interaction_reconstruction',
    kind: 'icf_relation',
    labelJa: '支援',
    detailJa: '翻訳/接続',
    sourceJa: 'ICF frame: support as relational function, not mere presence',
    x: 46,
    y: 44.2,
    width: 22,
    height: 5.6,
    hue: 34,
  },
  {
    id: 'icf_time',
    phaseId: 'icf_interaction_reconstruction',
    kind: 'icf_relation',
    labelJa: '時間',
    detailJa: '治療/回復',
    sourceJa: 'ICF frame: temporal interaction and work density',
    x: 46,
    y: 51.6,
    width: 22,
    height: 5.6,
    hue: 266,
  },
  {
    id: 'icf_institution',
    phaseId: 'icf_interaction_reconstruction',
    kind: 'icf_relation',
    labelJa: '制度',
    detailJa: '公式語/境界',
    sourceJa: 'ICF frame: institutional and source-role conditions',
    x: 46,
    y: 59,
    width: 22,
    height: 5.6,
    hue: 318,
  },
];

const FIELD_REVIEW_MAP_AXIS_NODES: FieldReviewMapVisualNode[] = [
  bridgeVisualNode('axis_health_time', {
    phaseId: 'latent_manifold',
    kind: 'latent_axis',
    labelJa: '健康時間',
    detailJa: '仕事密度/回復',
    x: 78,
    y: 23,
    width: 23,
    height: 6.8,
    hue: 174,
  }),
  bridgeVisualNode('axis_information_disclosure', {
    phaseId: 'latent_manifold',
    kind: 'latent_axis',
    labelJa: '情報/開示',
    detailJa: '目的限定共有',
    x: 78,
    y: 32,
    width: 23,
    height: 6.8,
    hue: 214,
  }),
  bridgeVisualNode('axis_worksite_touchpoint', {
    phaseId: 'latent_manifold',
    kind: 'latent_axis',
    labelJa: '職場接触点',
    detailJa: '作業/安全/道具',
    x: 78,
    y: 41,
    width: 23,
    height: 6.8,
    hue: 278,
  }),
  bridgeVisualNode('axis_support_network', {
    phaseId: 'latent_manifold',
    kind: 'latent_axis',
    labelJa: '支援再翻訳',
    detailJa: '継続接続',
    x: 78,
    y: 50,
    width: 23,
    height: 6.8,
    hue: 42,
  }),
  bridgeVisualNode('axis_role_growth', {
    phaseId: 'latent_manifold',
    kind: 'latent_axis',
    labelJa: '役割成長',
    detailJa: '評価/質',
    x: 78,
    y: 59,
    width: 23,
    height: 6.8,
    hue: 328,
  }),
];

const FIELD_REVIEW_MAP_PROJECTION_NODES: FieldReviewMapVisualNode[] = [
  bridgeVisualNode('projection_scene_entry', {
    phaseId: 'revised_human_shadow',
    kind: 'nbl_projection',
    labelJa: '課題',
    detailJa: '典型的な発生課題',
    x: 110,
    y: 25,
    width: 24,
    height: 7.4,
    hue: 28,
  }),
  bridgeVisualNode('projection_case_readings', {
    phaseId: 'revised_human_shadow',
    kind: 'nbl_projection',
    labelJa: '相談事例',
    detailJa: '典型的な相互作用',
    x: 110,
    y: 36.2,
    width: 24,
    height: 7.4,
    hue: 186,
  }),
  bridgeVisualNode('projection_work_design_guide', {
    phaseId: 'revised_human_shadow',
    kind: 'nbl_projection',
    labelJa: 'ガイド',
    detailJa: '仕事設計/配慮',
    x: 110,
    y: 47.4,
    width: 24,
    height: 7.4,
    hue: 108,
  }),
  bridgeVisualNode('projection_toolkit_video', {
    phaseId: 'revised_human_shadow',
    kind: 'nbl_projection',
    labelJa: 'ツールキット',
    detailJa: '低負荷デモ',
    x: 110,
    y: 58.6,
    width: 24,
    height: 7.4,
    hue: 258,
  }),
];

const FIELD_REVIEW_MAP_VISUAL_NODES: FieldReviewMapVisualNode[] = [
  ...FIELD_REVIEW_MAP_SOURCE_LENS_NODES,
  ...FIELD_REVIEW_MAP_ICF_NODES,
  ...FIELD_REVIEW_MAP_AXIS_NODES,
  ...FIELD_REVIEW_MAP_PROJECTION_NODES,
];

const FIELD_REVIEW_MAP_VISUAL_NODE_BY_ID = new Map<string, FieldReviewMapVisualNode>(
  FIELD_REVIEW_MAP_VISUAL_NODES.map((nodeItem) => [nodeItem.id, nodeItem]),
);

const FIELD_REVIEW_MAP_FLOWS: FieldReviewMapFlow[] = [
  {
    id: 'respondent_to_person',
    fromId: 'lens_respondent',
    toId: 'icf_person',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.72,
    hue: 186,
    bend: -1.5,
    labelJa: '本人/家族の生活語を人側条件へ戻す',
  },
  {
    id: 'respondent_to_time',
    fromId: 'lens_respondent',
    toId: 'icf_time',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.64,
    hue: 186,
    bend: 1.8,
    labelJa: '疲労・治療時間を時間条件へ戻す',
  },
  {
    id: 'supporter_to_support',
    fromId: 'lens_supporter',
    toId: 'icf_support',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.7,
    hue: 42,
    bend: -0.8,
    labelJa: '支援者語を支援機能へ戻す',
  },
  {
    id: 'workplace_to_job',
    fromId: 'lens_workplace',
    toId: 'icf_job',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.66,
    hue: 318,
    bend: -2.4,
    labelJa: '職場側の懸念を仕事条件へ戻す',
  },
  {
    id: 'workplace_to_environment',
    fromId: 'lens_workplace',
    toId: 'icf_environment',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.58,
    hue: 318,
    bend: 1.4,
    labelJa: '職場側資料を環境条件へ戻す',
  },
  {
    id: 'institution_to_institution',
    fromId: 'lens_institution',
    toId: 'icf_institution',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.68,
    hue: 96,
    bend: 0.8,
    labelJa: '制度語をsource-role境界へ戻す',
  },
  {
    id: 'triadic_to_job_support',
    fromId: 'lens_triadic',
    toId: 'icf_support',
    kind: 'lens_to_icf',
    focusPhaseIds: ['distorted_shadow', 'icf_interaction_reconstruction'],
    strength: 0.52,
    hue: 258,
    bend: 2.4,
    labelJa: '歴史的三者視点を支援/職場関係へ戻す',
  },
  {
    id: 'person_time_to_health_time',
    fromId: 'icf_time',
    toId: 'axis_health_time',
    kind: 'icf_to_axis',
    focusPhaseIds: ['icf_interaction_reconstruction', 'latent_manifold'],
    strength: 0.86,
    hue: 174,
    bend: -2,
    labelJa: '時間条件を健康時間軸へ総合する',
  },
  {
    id: 'environment_institution_to_information',
    fromId: 'icf_institution',
    toId: 'axis_information_disclosure',
    kind: 'icf_to_axis',
    focusPhaseIds: ['icf_interaction_reconstruction', 'latent_manifold'],
    strength: 0.76,
    hue: 214,
    bend: 1.4,
    labelJa: '公式語と環境条件を情報/開示軸へ総合する',
  },
  {
    id: 'job_environment_to_worksite',
    fromId: 'icf_job',
    toId: 'axis_worksite_touchpoint',
    kind: 'icf_to_axis',
    focusPhaseIds: ['icf_interaction_reconstruction', 'latent_manifold'],
    strength: 0.78,
    hue: 278,
    bend: -1.2,
    labelJa: '仕事と環境を職場接触点へ総合する',
  },
  {
    id: 'support_institution_to_network',
    fromId: 'icf_support',
    toId: 'axis_support_network',
    kind: 'icf_to_axis',
    focusPhaseIds: ['icf_interaction_reconstruction', 'latent_manifold'],
    strength: 0.72,
    hue: 42,
    bend: 1.4,
    labelJa: '支援を再翻訳ネットワークへ総合する',
  },
  {
    id: 'person_job_to_growth',
    fromId: 'icf_person',
    toId: 'axis_role_growth',
    kind: 'icf_to_axis',
    focusPhaseIds: ['icf_interaction_reconstruction', 'latent_manifold'],
    strength: 0.62,
    hue: 328,
    bend: 2.2,
    labelJa: '人と仕事の関係を役割成長軸へ総合する',
  },
  {
    id: 'health_time_to_issues',
    fromId: 'axis_health_time',
    toId: 'projection_scene_entry',
    kind: 'axis_to_projection',
    focusPhaseIds: ['latent_manifold', 'revised_human_shadow'],
    strength: 0.72,
    hue: 28,
    bend: -1.8,
    labelJa: '健康時間を課題ページの入口へ投影する',
  },
  {
    id: 'information_to_cases',
    fromId: 'axis_information_disclosure',
    toId: 'projection_case_readings',
    kind: 'axis_to_projection',
    focusPhaseIds: ['latent_manifold', 'revised_human_shadow'],
    strength: 0.7,
    hue: 186,
    bend: 1,
    labelJa: '情報/開示を相談事例の相互作用へ投影する',
  },
  {
    id: 'worksite_to_guide',
    fromId: 'axis_worksite_touchpoint',
    toId: 'projection_work_design_guide',
    kind: 'axis_to_projection',
    focusPhaseIds: ['latent_manifold', 'revised_human_shadow'],
    strength: 0.72,
    hue: 108,
    bend: -0.8,
    labelJa: '職場接触点を仕事設計ガイドへ投影する',
  },
  {
    id: 'support_to_cases',
    fromId: 'axis_support_network',
    toId: 'projection_case_readings',
    kind: 'axis_to_projection',
    focusPhaseIds: ['latent_manifold', 'revised_human_shadow'],
    strength: 0.62,
    hue: 42,
    bend: -1.7,
    labelJa: '支援再翻訳を相談事例へ投影する',
  },
  {
    id: 'growth_to_toolkit',
    fromId: 'axis_role_growth',
    toId: 'projection_toolkit_video',
    kind: 'axis_to_projection',
    focusPhaseIds: ['latent_manifold', 'revised_human_shadow'],
    strength: 0.64,
    hue: 258,
    bend: 1.6,
    labelJa: '役割成長をツールキット/動画へ投影する',
  },
];

const FIELD_POINT_COUNT =
  bridge.numericSourceSummary.manifoldPatternCount * FIELD_LAYER_LABELS.length +
  bridge.numericSourceSummary.revisedReviewUnitCount *
    bridge.numericSourceSummary.integratedAxisCount +
  bridge.numericSourceSummary.integratedAxisCount * FIELD_LAYER_LABELS.length +
  18;

type FieldPoint = {
  id: number;
  layer: number;
  baseX: number;
  baseY: number;
  orbit: number;
  phase: number;
  energy: number;
  hue: number;
};

type NormalizedFieldPosition = {
  x: number;
  y: number;
};

type DataGroundedReviewFocusItem = {
  titleJa: string;
  detailJa: string;
  sourceJa: string;
};

type DataGroundedReviewFocus = {
  titleJa: string;
  summaryJa: string;
  noteTitleJa: string;
  noteMetaJa: string;
  boundaryJa: string;
  chipsJa: string[];
  items: DataGroundedReviewFocusItem[];
};

const FIELD_POINTS: FieldPoint[] = Array.from({ length: FIELD_POINT_COUNT }, (_, index) => {
  const layer = index % FIELD_LAYER_LABELS.length;
  const ring = 0.18 + (layer / FIELD_LAYER_LABELS.length) * 0.38;
  const theta = index * 2.399963 + layer * 0.61;
  const radialJitter = ((index * 37) % 19) / 120;
  return {
    id: index,
    layer,
    baseX: 0.5 + Math.cos(theta) * (ring + radialJitter) * (index % 2 === 0 ? 1.05 : 0.82),
    baseY: 0.5 + Math.sin(theta) * (ring * 0.95 + radialJitter * 0.9),
    orbit: 0.006 + ((index * 13) % 17) / 1600,
    phase: ((index * 29) % 360) * (Math.PI / 180),
    energy: 0.35 + ((index * 11) % 23) / 28,
    hue: [174, 204, 258, 32, 318][layer],
  };
});

const PHASE_ICONS = {
  distorted_shadow: Eye,
  icf_interaction_reconstruction: GitBranch,
  latent_manifold: Layers,
  revised_human_shadow: Film,
} as const;

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value);
}

function focusNodeSource(nodeId: string, basisIndex = 0): string {
  const nodeItem = FIELD_REVIEW_NODE_BY_ID.get(nodeId);
  if (!nodeItem) return `missing node: ${nodeId}`;
  return `${nodeItem.shortLabelJa}: ${nodeItem.sourceBasisJa[basisIndex] ?? nodeItem.sourceBasisJa[0]}`;
}

function focusEdgeSource(edgeId: string): string {
  const edgeItem = FIELD_REVIEW_EDGE_BY_ID.get(edgeId);
  if (!edgeItem) return `missing edge: ${edgeId}`;
  return `${edgeItem.relationJa} / ${edgeItem.evidenceDisciplineJa}`;
}

function projectionFocusSource(nodeId: string, edgeIds: string[]): string {
  return [focusNodeSource(nodeId), ...edgeIds.map((edgeId) => focusEdgeSource(edgeId))].join(' | ');
}

function focusSourceFamily(entryId: string): string {
  const entry = FIELD_SOURCE_FAMILY_BY_ID.get(entryId);
  if (!entry) return `missing source family: ${entryId}`;
  return `${entry.displayName}: ${entry.knownScale} / ${entry.currentAxiomUse} / hold: ${entry.holdReason[0]}`;
}

const FIELD_DATA_GROUNDED_REVIEW_FOCUS: Record<
  AxiomManifoldDisplayPhaseId,
  DataGroundedReviewFocus
> = {
  distorted_shadow: {
    titleJa: '歪んだ影: 立場ごとの言葉が混線した入力',
    summaryJa: `${formatNumber(
      bridge.numericSourceSummary.jointSubjectCount,
    )}件のjoint subjectsだけでなく、支援者実践、職場側資料、公式・準公式資料、歴史的三者視点が、それぞれ違う言葉で同じ現実の一部を照らす。歪んだ影は整理済みカテゴリではなく、立場別の認識が衝突したまま入ってくる状態である。`,
    noteTitleJa: 'source lensを平均せず、混線として保持する',
    noteMetaJa: 'respondent / supporter / workplace / institution / historical triadic lenses',
    boundaryJa: '件数や言葉の強さは手がかりであり、診断名から支援答えを出す規則ではない。',
    chipsJa: ['本人/家族', '支援者', '企業/職場', '制度/公式資料', '歴史的三者視点'],
    items: [
      {
        titleJa: '障害者・難病当事者側の影',
        detailJa:
          '疲労、治療時間、情報アクセス、開示不安、仕事像の見えにくさが、生活・就労継続・評価不安を含む本人側の言葉として出る。',
        sourceJa: [
          focusSourceFamily('source_family_respondent_surveys_3000_4000'),
          focusNodeSource('word_fatigue_recovery'),
          focusNodeSource('word_disclosure_fear'),
        ].join(' | '),
      },
      {
        titleJa: '支援者・専門職側の影',
        detailJa:
          '相談、紹介、会議、支援ネットワークの言葉が入るが、それは支援の存在を示すだけで、有効性や継続性をまだ意味しない。',
        sourceJa: focusSourceFamily('source_family_supporter_practice'),
      },
      {
        titleJa: '企業・職場側の影',
        detailJa:
          '安全、人員余力、顧客対応、欠勤代替、作業手順、情報管理の言葉で見える。ただし職場側の懸念を、本人能力や客観的不可能性として確定しない。',
        sourceJa: focusSourceFamily('source_family_workplace_surveys'),
      },
      {
        titleJa: '制度・公式資料・歴史的三者視点の影',
        detailJa:
          '制度語、政策語、研修語、HR・上司・本人の歴史的な三者視点が混ざる。現在の制度判断や一般化に使う前に、時代差、立場差、source roleを残す。',
        sourceJa: [
          focusSourceFamily('source_family_domestic_web_cache'),
          focusSourceFamily('source_family_historical_2001_abc'),
        ].join(' | '),
      },
    ],
  },
  icf_interaction_reconstruction: {
    titleJa: 'ICF/LLM復元: 混線した立場差を平均せず構造化する',
    summaryJa:
      'ICFは影を人・仕事・環境・支援・時間・制度の相互作用へ戻し、LLMは文脈を読んで、本人側の困難、支援者側の支援存在、企業側の実装懸念、制度側の語彙を、互いに潰さず対照する。',
    noteTitleJa: 'source-lens差分を残した対立仮説対応',
    noteMetaJa:
      'worker difficulty / support translation / workplace concern / institution language',
    boundaryJa:
      'ここでの合理的配慮や専門支援は読み筋であり、個別の妥当性・法的判断・支援決定ではない。',
    chipsJa: ['本人レンズ', '支援者レンズ', '職場レンズ', '制度レンズ', 'human review'],
    items: [
      {
        titleJa: '本人側の困難を仕事条件へ戻す',
        detailJa:
          '疲労、治療時間、情報アクセス、開示不安を、本人属性ではなく、仕事密度、回復余地、情報形式、評価境界との相互作用として読む。',
        sourceJa: [
          focusEdgeSource('fatigue_to_health_time'),
          focusEdgeSource('care_time_to_health_time'),
          focusEdgeSource('information_to_information_axis'),
        ].join(' | '),
      },
      {
        titleJa: '支援者側の支援存在を有効性にしない',
        detailJa:
          '支援者の関与、相談、紹介、会議記録は重要な影だが、それだけでは支援が機能したとは言えない。再翻訳と継続接続の条件へ戻す。',
        sourceJa: [
          focusSourceFamily('source_family_supporter_practice'),
          focusEdgeSource('support_to_health_time'),
        ].join(' | '),
      },
      {
        titleJa: '企業・職場側の懸念を能力判定にしない',
        detailJa:
          '安全、人員、顧客、代替、手順、情報管理の懸念は職場接触点として分解する。懸念を本人能力や企業の正しさとして確定しない。',
        sourceJa: [
          focusSourceFamily('source_family_workplace_surveys'),
          focusEdgeSource('procedure_to_worksite'),
          focusEdgeSource('worksite_to_guide'),
        ].join(' | '),
      },
      {
        titleJa: '制度・公式資料を現場条件へ再翻訳する',
        detailJa:
          '制度語や公式資料は重要だが、現場の仕事設計、支援接続、source/currentness確認を通さずに現在の答えとして使わない。',
        sourceJa: focusSourceFamily('source_family_domestic_web_cache'),
      },
    ],
  },
  latent_manifold: {
    titleJa: '潜在的不変構造: 高度に抽象化されたモデル化',
    summaryJa:
      '雑多な影と対立仮説を、条件をまたいで保存される関係軸へ圧縮する。ここで見せるのはAIの最終真実ではなく、Founder受領済み統合知識から作るレビュー可能な構造候補である。',
    noteTitleJa: '5つの不変軸として読む',
    noteMetaJa: 'health-time / information-disclosure / touchpoint / support-network / role-growth',
    boundaryJa: '抽象軸は個別ケースの結論ではなく、次に人間が検査するためのモデル化である。',
    chipsJa: ['健康時間', '情報/開示', '接触点', '支援網', '役割成長'],
    items: [
      {
        titleJa: '健康時間・仕事密度・回復余地',
        detailJa: '疲労、治療時間、生活時間、仕事密度を同じ時間条件の場として扱う。',
        sourceJa: focusNodeSource('axis_health_time'),
      },
      {
        titleJa: '情報アクセス・開示境界・目的限定共有',
        detailJa: '感覚・コミュニケーションアクセスと、開示・スティグマ境界を分けて保持する。',
        sourceJa: focusNodeSource('axis_information_disclosure'),
      },
      {
        titleJa: '職場接触点・作業・安全・道具',
        detailJa: '手順や切替を能力評価へ潰さず、作業、道具、安全、配置の接触点として読む。',
        sourceJa: focusNodeSource('axis_worksite_touchpoint'),
      },
      {
        titleJa: '支援の再翻訳・継続接続・役割成長',
        detailJa: '支援の有無ではなく、医療・生活・職場の情報が仕事条件へ翻訳され続けるかを見る。',
        sourceJa: [
          focusNodeSource('axis_support_network'),
          focusNodeSource('axis_role_growth'),
        ].join(' | '),
      },
    ],
  },
  revised_human_shadow: {
    titleJa: 'NBL表現形: 復元構造を人間が扱える形へ再投影する',
    summaryJa:
      'NBLサイトは潜在的不変構造そのものではなく、復元した構造を用途別に見直した表現形である。課題、相談事例、ガイド、ツールキットは同じ構造の別角度の影絵として整理する。',
    noteTitleJa: '表現形の合理的な意味づけ',
    noteMetaJa: 'issue / case interaction / work design guide / low-load demo',
    boundaryJa:
      'NBL表現形は公開候補の読みやすい投影であり、公開承認、個別助言、支援妥当性の確定ではない。',
    chipsJa: ['課題', '相談事例', 'ガイド', 'ツールキット'],
    items: [
      {
        titleJa: '課題: 典型的な発生課題',
        detailJa:
          '健康時間などの抽象軸を、一般読者が「自分にも起きている問題」として入れる課題入口へ変換する。',
        sourceJa: projectionFocusSource('projection_scene_entry', ['health_time_to_scene']),
      },
      {
        titleJa: '相談事例: 典型的な相互作用',
        detailJa:
          '断片的な相談文を、missing contextと対立仮説を残したまま、典型的な相互作用として読める形にする。',
        sourceJa: projectionFocusSource('projection_case_readings', [
          'information_to_case',
          'support_to_case_readings',
        ]),
      },
      {
        titleJa: 'ガイド: 典型的な仕事設計、合理的配慮や専門支援',
        detailJa:
          '職場接触点を、仕事設計、合理的配慮、専門支援の読み筋として人間が確認できる形にする。',
        sourceJa: projectionFocusSource('projection_work_design_guide', ['worksite_to_guide']),
      },
      {
        titleJa: 'ツールキット: 総合的認識の認知負荷の低いデモ',
        detailJa: '複雑な構造を図解、動画、ツールとして再投影し、全体認識の負荷を下げる。',
        sourceJa: projectionFocusSource('projection_toolkit_video', ['role_growth_to_video']),
      },
    ],
  },
};

function reviewMapNodeAnchor(
  nodeItem: FieldReviewMapVisualNode,
  side: 'left' | 'right',
): { x: number; y: number } {
  return {
    x: nodeItem.x + (side === 'left' ? -nodeItem.width / 2 : nodeItem.width / 2),
    y: nodeItem.y,
  };
}

function reviewMapFlowPath(flowItem: FieldReviewMapFlow): string {
  const sourceNode = FIELD_REVIEW_MAP_VISUAL_NODE_BY_ID.get(flowItem.fromId);
  const targetNode = FIELD_REVIEW_MAP_VISUAL_NODE_BY_ID.get(flowItem.toId);
  if (!sourceNode || !targetNode) return '';
  const source = reviewMapNodeAnchor(sourceNode, 'right');
  const target = reviewMapNodeAnchor(targetNode, 'left');
  const midX = (source.x + target.x) / 2;
  const bend = flowItem.bend ?? 0;
  return [
    `M ${source.x.toFixed(2)} ${source.y.toFixed(2)}`,
    `C ${(midX + bend).toFixed(2)} ${source.y.toFixed(2)}`,
    `${(midX - bend).toFixed(2)} ${target.y.toFixed(2)}`,
    `${target.x.toFixed(2)} ${target.y.toFixed(2)}`,
  ].join(' ');
}

function AdvancedManifoldField({ activePhaseId }: { activePhaseId: AxiomManifoldDisplayPhaseId }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const foundPhaseIndex = bridge.phases.findIndex((phase) => phase.phaseId === activePhaseId);
  const phaseIndex = foundPhaseIndex >= 0 ? foundPhaseIndex : 0;
  const activeStage = FIELD_STAGE_STORY[activePhaseId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let context: CanvasRenderingContext2D | null = null;
    try {
      context = canvas.getContext('2d');
    } catch {
      return undefined;
    }
    if (!context) return undefined;

    let animationFrame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const clampPosition = (position: NormalizedFieldPosition): NormalizedFieldPosition => ({
      x: Math.max(0.04, Math.min(0.96, position.x)),
      y: Math.max(0.06, Math.min(0.92, position.y)),
    });

    const toCanvasPoint = (position: NormalizedFieldPosition) => {
      const clamped = clampPosition(position);
      return {
        x: clamped.x * width,
        y: clamped.y * height,
      };
    };

    const invariantCurvePosition = (
      structureIndex: number,
      u: number,
      elapsed: number,
      conditionOffset = 0,
    ): NormalizedFieldPosition => {
      const t = elapsed * 0.00022;
      const theta = Math.PI * 2 * (u + conditionOffset * 0.07);
      const conditionWave = Math.sin(theta * 1.7 + conditionOffset * 2.1 + t * 3) * 0.018;

      if (structureIndex === 0) {
        return {
          x: 0.34 + Math.cos(theta + t * 0.6) * (0.19 + conditionWave),
          y: 0.43 + Math.sin(theta * 1.08 + t * 0.35) * 0.13,
        };
      }

      if (structureIndex === 1) {
        const x = 0.25 + u * 0.52;
        return {
          x: x + Math.sin(theta + t * 0.8) * 0.025,
          y:
            0.45 +
            Math.sin(theta * 1.45 + conditionOffset + t * 0.9) * 0.15 +
            Math.cos(theta * 0.55) * 0.045,
        };
      }

      if (structureIndex === 2) {
        return {
          x: 0.62 + Math.sin(theta * 1.18 + t * 0.7) * 0.21,
          y: 0.42 + Math.sin(theta * 2.05 + conditionOffset * 1.7) * 0.115,
        };
      }

      return {
        x: 0.5 + Math.cos(theta * 0.82 + t * 0.42) * 0.29,
        y:
          0.62 +
          Math.sin(theta * 1.22 + conditionOffset + t * 0.5) * 0.095 +
          Math.cos(theta * 2.1) * 0.03,
      };
    };

    const positionOnInvariantStructure = (
      point: FieldPoint,
      elapsed: number,
      conditionOffset = 0,
    ): NormalizedFieldPosition => {
      const structureIndex = point.id % INVARIANT_STRUCTURE_VISUALS.length;
      const u =
        (((point.id * 37) % 157) / 157 +
          conditionOffset * 0.035 +
          elapsed * 0.000015 * (1 + point.layer * 0.08)) %
        1;
      const base = invariantCurvePosition(structureIndex, u, elapsed, conditionOffset);
      const laneNoise = (((point.id * 19) % 17) - 8) / 1000;
      return {
        x: base.x + Math.sin(point.phase + elapsed * 0.00035) * point.orbit * 4 + laneNoise,
        y:
          base.y +
          Math.cos(point.phase * 0.7 + elapsed * 0.0003) * point.orbit * 3 -
          0.02 +
          (((point.id * 23) % 13) - 6) / 1200,
      };
    };

    const sourceSnapshotPosition = (
      point: FieldPoint,
      elapsed: number,
    ): NormalizedFieldPosition => {
      const base = positionOnInvariantStructure(point, elapsed, 0.35);
      const t = elapsed * 0.00024;
      const lens = Math.sin(base.x * 15 + point.phase + t * 4) * 0.045;
      const bias = Math.cos(base.y * 18 + point.phase * 0.6 + t * 3.2) * 0.035;
      const compression = 0.78 + Math.sin(point.phase + t) * 0.12;
      return {
        x: 0.5 + (base.x - 0.5) * compression + lens,
        y: 0.5 + (base.y - 0.5) * (0.7 + Math.cos(t + point.phase) * 0.1) + bias,
      };
    };

    const sourceLensCollisionPosition = (
      point: FieldPoint,
      lensIndex: number,
      elapsed: number,
    ): NormalizedFieldPosition => {
      const base = sourceSnapshotPosition(point, elapsed);
      const lens = SOURCE_LENS_VISUALS[lensIndex];
      const t = elapsed * 0.0002;
      const anchorX = lens.anchorX + Math.sin(t * 1.7 + lensIndex * 1.9) * 0.018;
      const anchorY = lens.anchorY + Math.cos(t * 1.35 + lensIndex * 1.6) * 0.016;
      const pull = 0.1 + lens.distortion * 0.24;
      const shear =
        Math.sin((base.y + point.phase) * (6 + lensIndex) + t * (3 + lensIndex * 0.4)) *
        lens.distortion *
        0.055;
      const phaseNoise =
        Math.cos((base.x - base.y) * (9 + lensIndex) + point.phase + t * 3) *
        lens.distortion *
        0.042;
      return {
        x: base.x * (1 - pull) + anchorX * pull + shear,
        y: base.y * (1 - pull) + anchorY * pull + phaseNoise,
      };
    };

    const icfRelationPosition = (point: FieldPoint, elapsed: number): NormalizedFieldPosition => {
      const base = positionOnInvariantStructure(point, elapsed, 0.18);
      const frameIndex = point.id % ICF_FRAME_VISUALS.length;
      const angle = (Math.PI * 2 * frameIndex) / ICF_FRAME_VISUALS.length - Math.PI / 2;
      const anchor = {
        x: 0.5 + Math.cos(angle) * 0.21,
        y: 0.48 + Math.sin(angle) * 0.17,
      };
      const t = elapsed * 0.00028;
      return {
        x: base.x * 0.82 + anchor.x * 0.18 + Math.sin(t * 2 + point.phase) * 0.012,
        y: base.y * 0.82 + anchor.y * 0.18 + Math.cos(t * 2.1 + point.phase) * 0.012,
      };
    };

    const latentManifoldPosition = (
      point: FieldPoint,
      elapsed: number,
    ): NormalizedFieldPosition => {
      const conditionOffset = (point.layer - 2) * 0.11;
      return positionOnInvariantStructure(point, elapsed, conditionOffset);
    };

    const projectionViewPosition = (
      point: FieldPoint,
      elapsed: number,
    ): NormalizedFieldPosition => {
      const manifold = latentManifoldPosition(point, elapsed);
      const angleIndex = point.id % FIELD_PROJECTION_ANGLES.length;
      const panelCenters = [
        { x: 0.24, y: 0.3 },
        { x: 0.72, y: 0.3 },
        { x: 0.26, y: 0.68 },
        { x: 0.72, y: 0.68 },
      ] as const;
      const transforms = [
        { rotate: -0.8, sx: 0.34, sy: 0.24, shear: 0.16 },
        { rotate: 0.25, sx: 0.3, sy: 0.31, shear: -0.08 },
        { rotate: 0.88, sx: 0.27, sy: 0.22, shear: 0.24 },
        { rotate: -0.28, sx: 0.36, sy: 0.18, shear: -0.2 },
      ] as const;
      const transform = transforms[angleIndex];
      const center = panelCenters[angleIndex];
      const dx = manifold.x - 0.5;
      const dy = manifold.y - 0.48;
      const cos = Math.cos(transform.rotate);
      const sin = Math.sin(transform.rotate);
      const rotatedX = dx * cos - dy * sin;
      const rotatedY = dx * sin + dy * cos;
      return {
        x: center.x + rotatedX * transform.sx + rotatedY * transform.shear,
        y: center.y + rotatedY * transform.sy,
      };
    };

    const transformationPath = (point: FieldPoint, elapsed: number) => [
      sourceSnapshotPosition(point, elapsed),
      icfRelationPosition(point, elapsed),
      latentManifoldPosition(point, elapsed),
      projectionViewPosition(point, elapsed),
    ];

    const projectPoint = (point: FieldPoint, elapsed: number) => {
      const path = transformationPath(point, elapsed);
      if (activePhaseId === 'distorted_shadow') return toCanvasPoint(path[0]);
      if (activePhaseId === 'icf_interaction_reconstruction') return toCanvasPoint(path[1]);
      if (activePhaseId === 'latent_manifold') return toCanvasPoint(path[2]);
      return toCanvasPoint(path[3]);
    };

    const drawLabel = (
      text: string,
      x: number,
      y: number,
      options: { align?: CanvasTextAlign; alpha?: number; size?: number } = {},
    ) => {
      if (!context) return;
      context.save();
      context.globalAlpha = options.alpha ?? 0.84;
      context.fillStyle = 'rgba(226, 255, 249, 0.9)';
      context.font = `${options.size ?? 10}px SFMono-Regular, Consolas, monospace`;
      context.textAlign = options.align ?? 'left';
      context.fillText(text, x, y);
      context.restore();
    };

    const drawGrid = () => {
      if (!context) return;
      context.save();
      context.strokeStyle = 'rgba(121, 210, 196, 0.08)';
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += 34) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y <= height; y += 34) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.restore();
    };

    const drawInvariantStructureSkeletons = (
      elapsed: number,
      mode: 'shadow' | 'icf' | 'latent' | 'projection',
    ) => {
      if (!context) return;
      const alphaByMode = {
        shadow: 0.065,
        icf: 0.34,
        latent: 0.82,
        projection: 0.3,
      } satisfies Record<typeof mode, number>;
      context.save();
      context.globalCompositeOperation = mode === 'shadow' ? 'screen' : 'lighter';
      INVARIANT_STRUCTURE_VISUALS.forEach((structure, structureIndex) => {
        context.beginPath();
        for (let step = 0; step <= 150; step += 1) {
          const u = step / 150;
          const position = toCanvasPoint(invariantCurvePosition(structureIndex, u, elapsed));
          if (step === 0) context.moveTo(position.x, position.y);
          else context.lineTo(position.x, position.y);
        }
        const alpha = alphaByMode[mode];
        context.strokeStyle =
          mode === 'shadow'
            ? `rgba(216, 222, 220, ${alpha})`
            : `hsla(${structure.hue}, 86%, 68%, ${alpha})`;
        context.lineWidth = mode === 'latent' ? 2.1 : 1.2;
        context.stroke();

        if (mode === 'latent' || mode === 'icf') {
          const labelPosition = toCanvasPoint(
            invariantCurvePosition(structureIndex, 0.08 + structureIndex * 0.18, elapsed),
          );
          drawLabel(
            `invariant_${structureIndex + 1}: ${structure.label}`,
            labelPosition.x,
            labelPosition.y,
            {
              alpha: mode === 'latent' ? 0.82 : 0.58,
              size: 10,
            },
          );
        }
      });
      context.restore();
    };

    const drawConditionedExpressionFamilies = (elapsed: number) => {
      if (!context || activePhaseId !== 'latent_manifold') return;
      context.save();
      context.globalCompositeOperation = 'screen';
      INVARIANT_STRUCTURE_VISUALS.forEach((structure, structureIndex) => {
        for (let condition = -2; condition <= 2; condition += 1) {
          context.beginPath();
          for (let step = 0; step <= 120; step += 1) {
            const u = step / 120;
            const position = toCanvasPoint(
              invariantCurvePosition(structureIndex, u, elapsed, condition * 0.16),
            );
            if (step === 0) context.moveTo(position.x, position.y);
            else context.lineTo(position.x, position.y);
          }
          context.strokeStyle = `hsla(${structure.hue}, 82%, ${condition === 0 ? 72 : 62}%, ${
            condition === 0 ? 0.34 : 0.14
          })`;
          context.lineWidth = condition === 0 ? 1.5 : 0.9;
          context.stroke();
        }
      });
      drawLabel(
        'conditioned expressions moving on restored invariant structures',
        width * 0.08,
        height * 0.88,
        {
          alpha: 0.68,
          size: 10,
        },
      );
      context.restore();
    };

    const SHADOW_FLASH_CYCLE_MS = 4200;

    const shadowFlashWindows = [
      { x: 0.62, y: 0.38, radiusX: 0.19, radiusY: 0.12, sourceX: 1.08, sourceY: 0.03 },
      { x: 0.33, y: 0.57, radiusX: 0.2, radiusY: 0.15, sourceX: -0.12, sourceY: 0.1 },
      { x: 0.48, y: 0.34, radiusX: 0.17, radiusY: 0.13, sourceX: 0.7, sourceY: -0.14 },
      { x: 0.72, y: 0.63, radiusX: 0.2, radiusY: 0.14, sourceX: 1.05, sourceY: 0.9 },
    ] as const;

    const shadowFlashState = (elapsed: number) => {
      const cycleStart = Math.floor(elapsed / SHADOW_FLASH_CYCLE_MS) * SHADOW_FLASH_CYCLE_MS;
      const phase = (elapsed % SHADOW_FLASH_CYCLE_MS) / SHADOW_FLASH_CYCLE_MS;
      const flashIndex = Math.floor(elapsed / SHADOW_FLASH_CYCLE_MS) % shadowFlashWindows.length;
      const rise = Math.min(1, phase / 0.025);
      const decay = phase < 0.18 ? Math.max(0, 1 - Math.max(0, phase - 0.025) / 0.155) : 0;
      const flashStrength = Math.sin(rise * Math.PI * 0.5) * decay;
      return {
        flashIndex,
        flashStrength,
        frozenElapsed: cycleStart + SHADOW_FLASH_CYCLE_MS * 0.04,
      };
    };

    const flashWindowToCanvas = (flashIndex: number, strength: number) => {
      const window = shadowFlashWindows[flashIndex];
      return {
        x: width * window.x,
        y: height * window.y,
        radiusX: width * window.radiusX,
        radiusY: height * window.radiusY,
        sourceX: width * window.sourceX,
        sourceY: height * window.sourceY,
        strength,
      };
    };

    const observationSpotlights = (elapsed: number) => {
      const { flashIndex, flashStrength } = shadowFlashState(elapsed);
      return [flashWindowToCanvas(flashIndex, flashStrength)];
    };

    const exposureStrengthForSpotlight = (
      position: { x: number; y: number },
      spotlight: ReturnType<typeof flashWindowToCanvas>,
    ) => {
      const dx = (position.x - spotlight.x) / spotlight.radiusX;
      const dy = (position.y - spotlight.y) / spotlight.radiusY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return Math.pow(Math.max(0, 1 - distance), 1.25) * spotlight.strength;
    };

    const spotlightStrengthAtCanvas = (position: { x: number; y: number }, elapsed: number) =>
      observationSpotlights(elapsed).reduce(
        (strength, spotlight) =>
          Math.max(strength, exposureStrengthForSpotlight(position, spotlight)),
        0,
      );

    const drawShadowAmbientMotion = (elapsed: number) => {
      if (!context || activePhaseId !== 'distorted_shadow') return;
      context.save();
      context.globalCompositeOperation = 'screen';
      for (let index = 0; index < FIELD_POINTS.length; index += 4) {
        const point = FIELD_POINTS[index];
        const current = toCanvasPoint(latentManifoldPosition(point, elapsed));
        const previous = toCanvasPoint(latentManifoldPosition(point, elapsed - 950));
        const pulse = 0.55 + Math.sin(elapsed * 0.0016 + point.phase) * 0.22;
        context.strokeStyle = `rgba(132, 174, 158, ${0.026 + pulse * 0.018})`;
        context.lineWidth = 0.55;
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(current.x, current.y);
        context.stroke();
        context.fillStyle = `rgba(174, 196, 182, ${0.026 + pulse * 0.024})`;
        context.beginPath();
        context.arc(current.x, current.y, 0.9 + point.energy * 0.95, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };

    const drawSourceLensCollisionField = (elapsed: number) => {
      if (!context || activePhaseId !== 'distorted_shadow') return;
      context.save();
      context.globalCompositeOperation = 'screen';

      SOURCE_LENS_VISUALS.forEach((lens, lensIndex) => {
        const anchor = {
          x: width * lens.anchorX,
          y: height * lens.anchorY,
        };
        const pulse = 0.55 + Math.sin(elapsed * 0.0016 + lensIndex) * 0.22;
        const halo = context.createRadialGradient(
          anchor.x,
          anchor.y,
          0,
          anchor.x,
          anchor.y,
          Math.max(width, height) * 0.21,
        );
        halo.addColorStop(0, `hsla(${lens.hue}, 88%, 64%, ${0.08 + pulse * 0.035})`);
        halo.addColorStop(0.48, `hsla(${lens.hue}, 72%, 48%, 0.028)`);
        halo.addColorStop(1, `hsla(${lens.hue}, 72%, 48%, 0)`);
        context.fillStyle = halo;
        context.fillRect(
          anchor.x - width * 0.22,
          anchor.y - height * 0.22,
          width * 0.44,
          height * 0.44,
        );

        context.strokeStyle = `hsla(${lens.hue}, 82%, 62%, ${0.14 + pulse * 0.04})`;
        context.lineWidth = 0.9;
        context.setLineDash([2.5, 6]);
        context.beginPath();
        context.ellipse(anchor.x, anchor.y, width * 0.105, height * 0.068, 0.2, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);

        for (let index = lensIndex; index < FIELD_POINTS.length; index += 13) {
          const point = FIELD_POINTS[index];
          const lensPoint = toCanvasPoint(sourceLensCollisionPosition(point, lensIndex, elapsed));
          const latentPoint = toCanvasPoint(latentManifoldPosition(point, elapsed));
          const alpha = 0.08 + point.energy * 0.055;
          context.strokeStyle = `hsla(${lens.hue}, 86%, 62%, ${alpha * 0.42})`;
          context.lineWidth = 0.35 + point.energy * 0.22;
          context.beginPath();
          context.moveTo(latentPoint.x, latentPoint.y);
          context.quadraticCurveTo(anchor.x, anchor.y, lensPoint.x, lensPoint.y);
          context.stroke();

          context.fillStyle = `hsla(${lens.hue}, 94%, 68%, ${0.17 + point.energy * 0.07})`;
          context.beginPath();
          context.arc(lensPoint.x, lensPoint.y, 1.6 + point.energy * 1.4, 0, Math.PI * 2);
          context.fill();
        }

        drawLabel(
          `source_lens_${lensIndex + 1}: ${lens.labelJa}`,
          anchor.x,
          anchor.y - height * 0.086,
          {
            align: 'center',
            alpha: 0.7,
            size: 9,
          },
        );
      });

      for (let index = 0; index < FIELD_POINTS.length; index += 31) {
        const point = FIELD_POINTS[index];
        const lensPositions = SOURCE_LENS_VISUALS.map((_, lensIndex) =>
          toCanvasPoint(sourceLensCollisionPosition(point, lensIndex, elapsed)),
        );
        context.lineWidth = 0.6 + point.energy * 0.35;
        context.strokeStyle = 'rgba(236, 255, 248, 0.075)';
        context.beginPath();
        lensPositions.forEach((position, positionIndex) => {
          if (positionIndex === 0) context.moveTo(position.x, position.y);
          else context.lineTo(position.x, position.y);
        });
        context.closePath();
        context.stroke();
      }

      drawLabel(
        'source-lens collision: same reality, incompatible shadows',
        width * 0.08,
        height * 0.13,
        {
          alpha: 0.68,
          size: 10,
        },
      );
      context.restore();
    };

    const drawFlashResidueStack = (elapsed: number) => {
      if (!context || activePhaseId !== 'distorted_shadow') return;
      const currentCycle = Math.floor(elapsed / SHADOW_FLASH_CYCLE_MS);
      context.save();
      context.globalCompositeOperation = 'screen';
      for (let depth = 1; depth <= 6; depth += 1) {
        const cycleIndex = currentCycle - depth;
        if (cycleIndex < 0) continue;
        const flashIndex =
          ((cycleIndex % shadowFlashWindows.length) + shadowFlashWindows.length) %
          shadowFlashWindows.length;
        const frozenElapsed = cycleIndex * SHADOW_FLASH_CYCLE_MS + SHADOW_FLASH_CYCLE_MS * 0.04;
        const spotlight = flashWindowToCanvas(flashIndex, 1);
        const ageAlpha = 0.13 - depth * 0.013;
        const residualPoints = FIELD_POINTS.map((point) => ({
          point,
          position: toCanvasPoint(sourceSnapshotPosition(point, frozenElapsed)),
        })).filter(({ position }) => exposureStrengthForSpotlight(position, spotlight) > 0.13);

        const burn = context.createRadialGradient(
          spotlight.x,
          spotlight.y,
          0,
          spotlight.x,
          spotlight.y,
          Math.max(spotlight.radiusX, spotlight.radiusY) * 1.08,
        );
        burn.addColorStop(0, `rgba(236, 224, 178, ${ageAlpha * 0.24})`);
        burn.addColorStop(0.6, `rgba(196, 184, 146, ${ageAlpha * 0.1})`);
        burn.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = burn;
        context.fillRect(
          spotlight.x - spotlight.radiusX * 1.3,
          spotlight.y - spotlight.radiusY * 1.3,
          spotlight.radiusX * 2.6,
          spotlight.radiusY * 2.6,
        );

        for (let index = 0; index < residualPoints.length; index += 1) {
          const { point, position } = residualPoints[index];
          const exposure = exposureStrengthForSpotlight(position, spotlight);
          const radius = 1.2 + point.energy * 1.6 + depth * 0.08;
          context.fillStyle = `rgba(232, 226, 190, ${ageAlpha * exposure * 1.45})`;
          context.beginPath();
          context.arc(position.x, position.y, radius, 0, Math.PI * 2);
          context.fill();

          if (index % 6 === 0) {
            const target = residualPoints[(index + 7) % residualPoints.length];
            if (target) {
              const dx = position.x - target.position.x;
              const dy = position.y - target.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < width * 0.12) {
                context.strokeStyle = `rgba(218, 207, 168, ${ageAlpha * 0.62})`;
                context.lineWidth = 0.45;
                context.beginPath();
                context.moveTo(position.x, position.y);
                context.lineTo(target.position.x, target.position.y);
                context.stroke();
              }
            }
          }
        }

        if (depth <= 3) {
          drawLabel(
            `固定バイアス残像_${depth}`,
            spotlight.x - spotlight.radiusX * 0.64,
            spotlight.y + spotlight.radiusY * (0.72 + depth * 0.1),
            {
              alpha: ageAlpha * 2.2,
              size: 9,
            },
          );
        }
      }
      drawLabel('残像が積み重なり、偏った認識として固定される', width * 0.08, height * 0.9, {
        alpha: 0.54,
        size: 10,
      });
      context.restore();
    };

    const drawInvariantManifoldGhost = (elapsed: number) => {
      if (!context) return;
      if (activePhaseId === 'distorted_shadow') {
        drawInvariantStructureSkeletons(elapsed, 'shadow');
        return;
      }
      const ghostAlpha =
        activePhaseId === 'latent_manifold'
          ? 0.36
          : activePhaseId === 'revised_human_shadow'
            ? 0.22
            : 0.15;
      context.save();
      context.globalCompositeOperation = 'screen';

      for (let index = 0; index < FIELD_POINTS.length; index += 7) {
        const source = FIELD_POINTS[index];
        const target = FIELD_POINTS[(index + 31 + source.layer) % FIELD_POINTS.length];
        const sourcePosition = toCanvasPoint(latentManifoldPosition(source, elapsed));
        const targetPosition = toCanvasPoint(latentManifoldPosition(target, elapsed));
        context.strokeStyle = `hsla(${source.hue}, 78%, 68%, ${ghostAlpha * 0.18})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(sourcePosition.x, sourcePosition.y);
        context.lineTo(targetPosition.x, targetPosition.y);
        context.stroke();
      }

      for (let index = 0; index < FIELD_POINTS.length; index += 4) {
        const point = FIELD_POINTS[index];
        const position = toCanvasPoint(latentManifoldPosition(point, elapsed));
        const pulse = 0.66 + Math.sin(elapsed * 0.002 + point.phase) * 0.2;
        const radius = 1.1 + point.energy * 1.7;
        context.fillStyle = `hsla(${point.hue}, 88%, 72%, ${ghostAlpha * (0.38 + pulse * 0.22)})`;
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      drawLabel('latent invariant structure behind every view', width * 0.58, height * 0.11, {
        alpha: 0.58 + ghostAlpha * 0.5,
        size: 10,
      });
      context.restore();
    };

    const drawDistortedObservationSpotlights = (elapsed: number) => {
      if (!context || activePhaseId !== 'distorted_shadow') return;
      context.save();
      context.globalCompositeOperation = 'source-over';
      const veil = context.createRadialGradient(
        width * 0.52,
        height * 0.46,
        0,
        width * 0.52,
        height * 0.46,
        Math.max(width, height) * 0.78,
      );
      veil.addColorStop(0, 'rgba(0, 0, 0, 0.18)');
      veil.addColorStop(0.58, 'rgba(0, 0, 0, 0.32)');
      veil.addColorStop(1, 'rgba(0, 0, 0, 0.52)');
      context.fillStyle = veil;
      context.fillRect(0, 0, width, height);
      context.restore();

      drawShadowAmbientMotion(elapsed);
      drawSourceLensCollisionField(elapsed);
      drawFlashResidueStack(elapsed);

      const { flashIndex, flashStrength } = shadowFlashState(elapsed);
      const [spotlight] = observationSpotlights(elapsed);
      if (flashStrength <= 0.015) {
        return;
      }

      context.save();
      context.globalCompositeOperation = 'screen';

      const cone = context.createLinearGradient(
        spotlight.sourceX,
        spotlight.sourceY,
        spotlight.x,
        spotlight.y,
      );
      cone.addColorStop(0, `rgba(255, 255, 236, ${0.02 * flashStrength})`);
      cone.addColorStop(0.62, `rgba(255, 255, 228, ${0.12 * flashStrength})`);
      cone.addColorStop(1, `rgba(255, 255, 224, ${0.02 * flashStrength})`);
      context.fillStyle = cone;
      context.beginPath();
      context.moveTo(spotlight.sourceX, spotlight.sourceY);
      context.lineTo(spotlight.x - spotlight.radiusX * 0.9, spotlight.y - spotlight.radiusY * 0.72);
      context.lineTo(
        spotlight.x + spotlight.radiusX * 1.05,
        spotlight.y + spotlight.radiusY * 0.56,
      );
      context.closePath();
      context.fill();

      const overexposure = context.createRadialGradient(
        spotlight.x,
        spotlight.y,
        0,
        spotlight.x,
        spotlight.y,
        Math.max(spotlight.radiusX, spotlight.radiusY) * 1.28,
      );
      overexposure.addColorStop(0, `rgba(255, 255, 236, ${0.5 * flashStrength})`);
      overexposure.addColorStop(0.22, `rgba(250, 246, 218, ${0.24 * flashStrength})`);
      overexposure.addColorStop(0.55, `rgba(222, 218, 196, ${0.08 * flashStrength})`);
      overexposure.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = overexposure;
      context.fillRect(
        spotlight.x - spotlight.radiusX * 1.5,
        spotlight.y - spotlight.radiusY * 1.5,
        spotlight.radiusX * 3,
        spotlight.radiusY * 3,
      );

      context.save();
      context.beginPath();
      context.ellipse(
        spotlight.x,
        spotlight.y,
        spotlight.radiusX * 0.96,
        spotlight.radiusY * 0.7,
        -0.18 + flashIndex * 0.13,
        0,
        Math.PI * 2,
      );
      context.clip();
      for (let index = 0; index < 12; index += 1) {
        const offsetX = ((index * 37) % 100) / 100 - 0.5;
        const offsetY = ((index * 23) % 100) / 100 - 0.5;
        const streakX = spotlight.x + offsetX * spotlight.radiusX * 1.65;
        const streakY = spotlight.y + offsetY * spotlight.radiusY * 1.18;
        const streakLength = spotlight.radiusX * (0.16 + ((index * 11) % 7) * 0.025);
        context.strokeStyle = `rgba(255, 252, 224, ${0.12 * flashStrength})`;
        context.lineWidth = 1 + ((index * 5) % 3) * 0.4;
        context.beginPath();
        context.moveTo(streakX - streakLength, streakY - streakLength * 0.12);
        context.lineTo(streakX + streakLength, streakY + streakLength * 0.12);
        context.stroke();
      }
      context.restore();

      drawLabel(
        `accidental_flash_bias_freeze_${flashIndex + 1}`,
        spotlight.x - spotlight.radiusX * 0.8,
        spotlight.y - spotlight.radiusY * 0.78,
        {
          alpha: 0.46 + flashStrength * 0.28,
          size: 9,
        },
      );
      drawLabel(
        'new flash freezes another partial view onto the residue stack',
        width * 0.08,
        height * 0.9,
        {
          alpha: 0.42 + flashStrength * 0.28,
          size: 10,
        },
      );
      context.restore();
    };

    const drawSourceLensAlignmentMatrix = (elapsed: number) => {
      if (!context || activePhaseId !== 'icf_interaction_reconstruction') return;
      context.save();
      context.globalCompositeOperation = 'screen';

      const center = { x: width * 0.5, y: height * 0.48 };
      const frameAnchors = ICF_FRAME_VISUALS.map((_, index) => {
        const angle = (Math.PI * 2 * index) / ICF_FRAME_VISUALS.length - Math.PI / 2;
        return {
          x: center.x + Math.cos(angle) * width * 0.34,
          y: center.y + Math.sin(angle) * height * 0.31,
        };
      });
      const lensToFrameIndexes = [
        [0, 1, 4],
        [3, 5],
        [1, 2],
        [3, 5],
        [0, 1, 2],
      ] as const;

      SOURCE_LENS_VISUALS.forEach((lens, lensIndex) => {
        const port = {
          x: width * lens.anchorX,
          y: height * lens.anchorY,
        };
        context.fillStyle = `hsla(${lens.hue}, 76%, 38%, 0.2)`;
        context.strokeStyle = `hsla(${lens.hue}, 86%, 66%, 0.42)`;
        context.lineWidth = 1;
        context.beginPath();
        context.roundRect(port.x - 58, port.y - 15, 116, 30, 8);
        context.fill();
        context.stroke();
        drawLabel(lens.labelJa, port.x, port.y + 4, { align: 'center', alpha: 0.84, size: 10 });

        for (const frameIndex of lensToFrameIndexes[lensIndex]) {
          const target = frameAnchors[frameIndex];
          const t = (elapsed * 0.00035 + lensIndex * 0.12 + frameIndex * 0.07) % 1;
          const control = {
            x: center.x + Math.sin(lensIndex + frameIndex) * width * 0.08,
            y: center.y + Math.cos(lensIndex * 0.7 + frameIndex) * height * 0.08,
          };
          context.strokeStyle = `hsla(${lens.hue}, 86%, 64%, 0.19)`;
          context.lineWidth = 0.9;
          context.beginPath();
          context.moveTo(port.x, port.y);
          context.quadraticCurveTo(control.x, control.y, target.x, target.y);
          context.stroke();

          const packetX =
            (1 - t) * (1 - t) * port.x + 2 * (1 - t) * t * control.x + t * t * target.x;
          const packetY =
            (1 - t) * (1 - t) * port.y + 2 * (1 - t) * t * control.y + t * t * target.y;
          context.fillStyle = `hsla(${lens.hue}, 94%, 72%, 0.68)`;
          context.beginPath();
          context.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
          context.fill();
        }
      });

      context.strokeStyle = 'rgba(226, 255, 249, 0.18)';
      context.lineWidth = 1.2;
      context.setLineDash([5, 7]);
      context.beginPath();
      context.arc(center.x, center.y, Math.min(width, height) * 0.17, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      drawLabel(
        'LLM alignment keeps lens provenance before synthesis',
        width * 0.08,
        height * 0.13,
        {
          alpha: 0.72,
          size: 10,
        },
      );
      context.restore();
    };

    const drawIcfReconstructionLighting = (elapsed: number) => {
      if (!context || activePhaseId !== 'icf_interaction_reconstruction') return;
      context.save();
      context.globalCompositeOperation = 'screen';

      const illumination = context.createRadialGradient(
        width * 0.5,
        height * 0.48,
        0,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.68,
      );
      illumination.addColorStop(0, 'rgba(238, 255, 246, 0.16)');
      illumination.addColorStop(0.55, 'rgba(123, 222, 200, 0.07)');
      illumination.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = illumination;
      context.fillRect(0, 0, width, height);

      drawSourceLensAlignmentMatrix(elapsed);

      const center = { x: width * 0.5, y: height * 0.48 };
      ICF_FRAME_VISUALS.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / ICF_FRAME_VISUALS.length - Math.PI / 2;
        const x = center.x + Math.cos(angle) * width * 0.34;
        const y = center.y + Math.sin(angle) * height * 0.31;
        context.strokeStyle = `hsla(${item.hue}, 82%, 66%, 0.24)`;
        context.fillStyle = `hsla(${item.hue}, 74%, 42%, 0.16)`;
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(center.x, center.y);
        context.lineTo(x, y);
        context.stroke();

        context.beginPath();
        context.roundRect(x - 52, y - 16, 104, 32, 8);
        context.fill();
        context.stroke();
        drawLabel(item.label, x, y + 4, { align: 'center', alpha: 0.85, size: 10 });
      });

      const sweepX = width * (0.15 + ((Math.sin(elapsed * 0.0012) + 1) / 2) * 0.7);
      const scanner = context.createLinearGradient(sweepX - 40, 0, sweepX + 40, 0);
      scanner.addColorStop(0, 'rgba(103, 212, 255, 0)');
      scanner.addColorStop(0.48, 'rgba(103, 212, 255, 0.15)');
      scanner.addColorStop(0.5, 'rgba(255, 255, 255, 0.32)');
      scanner.addColorStop(0.52, 'rgba(103, 212, 255, 0.15)');
      scanner.addColorStop(1, 'rgba(103, 212, 255, 0)');
      context.fillStyle = scanner;
      context.fillRect(sweepX - 42, 0, 84, height);

      drawInvariantStructureSkeletons(elapsed, 'icf');
      drawLabel(
        'full-field illumination: source lenses stay separated while ICF/LLM maps relations',
        width * 0.08,
        height * 0.9,
        {
          alpha: 0.72,
          size: 10,
        },
      );
      context.restore();
    };

    const drawProjectionPanels = (elapsed: number) => {
      if (!context || activePhaseId !== 'revised_human_shadow') return;
      context.save();
      context.globalCompositeOperation = 'screen';
      drawInvariantStructureSkeletons(elapsed, 'projection');
      const panels = [
        { cx: width * 0.24, cy: height * 0.3, w: width * 0.26, h: height * 0.22, tilt: -0.09 },
        { cx: width * 0.72, cy: height * 0.3, w: width * 0.26, h: height * 0.22, tilt: 0.12 },
        { cx: width * 0.26, cy: height * 0.68, w: width * 0.27, h: height * 0.22, tilt: 0.13 },
        { cx: width * 0.72, cy: height * 0.68, w: width * 0.27, h: height * 0.22, tilt: -0.1 },
      ] as const;
      FIELD_PROJECTION_ANGLES.forEach((label, index) => {
        const panel = panels[index];
        const corners = [
          { x: panel.cx - panel.w * 0.5 + panel.tilt * panel.w, y: panel.cy - panel.h * 0.5 },
          { x: panel.cx + panel.w * 0.5 + panel.tilt * panel.w, y: panel.cy - panel.h * 0.42 },
          { x: panel.cx + panel.w * 0.5 - panel.tilt * panel.w, y: panel.cy + panel.h * 0.5 },
          { x: panel.cx - panel.w * 0.5 - panel.tilt * panel.w, y: panel.cy + panel.h * 0.42 },
        ];
        context.strokeStyle = 'rgba(255, 240, 180, 0.22)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(width * 0.5, height * 0.48);
        context.lineTo(panel.cx, panel.cy);
        context.stroke();

        context.fillStyle =
          index % 2 === 0 ? 'rgba(78, 124, 214, 0.18)' : 'rgba(36, 132, 116, 0.2)';
        context.strokeStyle = 'rgba(226, 255, 249, 0.32)';
        context.beginPath();
        corners.forEach((corner, cornerIndex) => {
          if (cornerIndex === 0) context.moveTo(corner.x, corner.y);
          else context.lineTo(corner.x, corner.y);
        });
        context.closePath();
        context.fill();
        context.stroke();

        drawLabel(label, panel.cx, panel.cy - panel.h * 0.37, { align: 'center', size: 11 });
        drawLabel(`view_angle_${index + 1}`, panel.cx, panel.cy + panel.h * 0.38, {
          align: 'center',
          alpha: 0.62,
          size: 9,
        });
      });
      drawLabel(
        'same restored structure, different viewing angles, different human-readable forms',
        width * 0.08,
        height * 0.9,
        {
          alpha: 0.72,
          size: 10,
        },
      );
      context.restore();
    };

    const drawContinuityTrails = (elapsed: number) => {
      if (!context) return;
      context.save();
      context.globalCompositeOperation = 'screen';
      context.lineCap = 'round';
      for (let index = 0; index < FIELD_POINTS.length; index += 5) {
        const point = FIELD_POINTS[index];
        const path = transformationPath(point, elapsed).map(toCanvasPoint);
        context.strokeStyle = `hsla(${point.hue}, 84%, 70%, 0.105)`;
        context.lineWidth = 0.75 + point.energy * 0.35;
        context.beginPath();
        context.moveTo(path[0].x, path[0].y);
        context.bezierCurveTo(path[0].x, path[1].y, path[1].x, path[1].y, path[1].x, path[1].y);
        context.bezierCurveTo(path[1].x, path[2].y, path[2].x, path[2].y, path[2].x, path[2].y);
        context.bezierCurveTo(path[2].x, path[3].y, path[3].x, path[3].y, path[3].x, path[3].y);
        context.stroke();

        if (index % 20 === 0) {
          const activePoint =
            activePhaseId === 'distorted_shadow'
              ? path[0]
              : activePhaseId === 'icf_interaction_reconstruction'
                ? path[1]
                : activePhaseId === 'latent_manifold'
                  ? path[2]
                  : path[3];
          context.fillStyle = `hsla(${point.hue}, 92%, 76%, 0.22)`;
          context.beginPath();
          context.arc(activePoint.x, activePoint.y, 8 + point.energy * 3, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.strokeStyle = 'rgba(226, 255, 249, 0.16)';
      context.lineWidth = 1;
      context.setLineDash([7, 8]);
      context.beginPath();
      context.moveTo(width * 0.08, height * 0.92);
      context.lineTo(width * 0.33, height * 0.88);
      context.lineTo(width * 0.57, height * 0.91);
      context.lineTo(width * 0.9, height * 0.86);
      context.stroke();
      context.setLineDash([]);
      drawLabel('single underlying reality field', width * 0.09, height * 0.95, {
        alpha: 0.62,
        size: 10,
      });
      context.restore();
    };

    const draw = (timestamp: number) => {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      const background = context.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.8,
      );
      background.addColorStop(0, '#102922');
      background.addColorStop(0.42, '#091721');
      background.addColorStop(1, '#03070d');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      if (activePhaseId !== 'distorted_shadow') drawGrid();
      drawInvariantManifoldGhost(timestamp);
      drawDistortedObservationSpotlights(timestamp);
      drawIcfReconstructionLighting(timestamp);
      drawConditionedExpressionFamilies(timestamp);
      if (activePhaseId === 'latent_manifold') drawInvariantStructureSkeletons(timestamp, 'latent');
      drawProjectionPanels(timestamp);
      if (activePhaseId !== 'distorted_shadow') drawContinuityTrails(timestamp);

      const projectionTimestamp =
        activePhaseId === 'distorted_shadow'
          ? shadowFlashState(timestamp).frozenElapsed
          : timestamp;
      const projected = FIELD_POINTS.map((point) => ({
        point,
        projected: projectPoint(point, projectionTimestamp),
      }));

      context.save();
      context.globalCompositeOperation = 'lighter';
      for (let index = 0; index < projected.length; index += 1) {
        const source = projected[index];
        for (let offset = 7; offset <= 25; offset += 6) {
          const target = projected[(index + offset + source.point.layer * 3) % projected.length];
          const sourceLight =
            activePhaseId === 'distorted_shadow'
              ? spotlightStrengthAtCanvas(source.projected, timestamp)
              : 1;
          const targetLight =
            activePhaseId === 'distorted_shadow'
              ? spotlightStrengthAtCanvas(target.projected, timestamp)
              : 1;
          const observationLight = Math.min(sourceLight, targetLight);
          if (activePhaseId === 'distorted_shadow' && observationLight < 0.16) continue;
          const dx = source.projected.x - target.projected.x;
          const dy = source.projected.y - target.projected.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const distanceLimit =
            activePhaseId === 'distorted_shadow'
              ? width * 0.095
              : activePhaseId === 'icf_interaction_reconstruction'
                ? width * 0.18
                : width * 0.22;
          if (distance > distanceLimit) continue;
          const alphaBase =
            activePhaseId === 'distorted_shadow'
              ? 0.1 * observationLight
              : activePhaseId === 'icf_interaction_reconstruction'
                ? 0.16
                : 0.24;
          const alpha = Math.max(0, 1 - distance / distanceLimit) * alphaBase;
          const edgeHue =
            activePhaseId === 'icf_interaction_reconstruction'
              ? ICF_FRAME_VISUALS[source.point.id % ICF_FRAME_VISUALS.length].hue
              : activePhaseId === 'latent_manifold'
                ? INVARIANT_STRUCTURE_VISUALS[source.point.id % INVARIANT_STRUCTURE_VISUALS.length]
                    .hue
                : source.point.hue;
          context.strokeStyle =
            activePhaseId === 'distorted_shadow'
              ? `rgba(230, 234, 229, ${alpha})`
              : `hsla(${edgeHue}, 88%, 62%, ${alpha})`;
          context.lineWidth = 0.55 + source.point.energy * 0.75;
          context.beginPath();
          context.moveTo(source.projected.x, source.projected.y);
          context.lineTo(target.projected.x, target.projected.y);
          context.stroke();
        }
      }
      context.restore();

      context.save();
      context.globalCompositeOperation = 'lighter';
      for (const { point, projected: position } of projected) {
        const observationLight =
          activePhaseId === 'distorted_shadow' ? spotlightStrengthAtCanvas(position, timestamp) : 1;
        if (activePhaseId === 'distorted_shadow' && observationLight < 0.08) continue;
        const pulse = 0.72 + Math.sin(timestamp * 0.003 + point.phase) * 0.28;
        const radius = 1.7 + point.energy * 2.4 + (point.layer === phaseIndex ? 1.2 : 0) * pulse;
        const pointHue =
          activePhaseId === 'icf_interaction_reconstruction'
            ? ICF_FRAME_VISUALS[point.id % ICF_FRAME_VISUALS.length].hue
            : activePhaseId === 'latent_manifold'
              ? INVARIANT_STRUCTURE_VISUALS[point.id % INVARIANT_STRUCTURE_VISUALS.length].hue
              : activePhaseId === 'revised_human_shadow'
                ? [188, 42, 276, 146][point.id % FIELD_PROJECTION_ANGLES.length]
                : point.hue;
        const halo = context.createRadialGradient(
          position.x,
          position.y,
          0,
          position.x,
          position.y,
          radius * 5,
        );
        if (activePhaseId === 'distorted_shadow') {
          halo.addColorStop(0, `rgba(240, 240, 228, ${0.32 * observationLight})`);
          halo.addColorStop(0.34, `rgba(210, 210, 198, ${0.12 * observationLight})`);
          halo.addColorStop(1, 'rgba(220, 220, 210, 0)');
        } else {
          halo.addColorStop(0, `hsla(${pointHue}, 96%, 68%, 0.64)`);
          halo.addColorStop(0.34, `hsla(${pointHue}, 82%, 58%, 0.18)`);
          halo.addColorStop(1, `hsla(${pointHue}, 82%, 48%, 0)`);
        }
        context.fillStyle = halo;
        context.beginPath();
        context.arc(position.x, position.y, radius * 5, 0, Math.PI * 2);
        context.fill();

        context.fillStyle =
          activePhaseId === 'distorted_shadow'
            ? `rgba(238, 238, 224, ${0.38 + observationLight * 0.52})`
            : `hsla(${pointHue}, 96%, 72%, ${0.72 + pulse * 0.22})`;
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [activePhaseId, phaseIndex]);

  return (
    <section className="advancedField" aria-labelledby="advanced-field-title">
      <div className={`advancedCanvasShell phase-${activePhaseId}`}>
        <canvas ref={canvasRef} aria-label="Live high-dimensional Axiom knowledge-network field" />
        <div className="scanLine" />
        <div className="equationStack" aria-label="display equations">
          {FIELD_EQUATIONS.map((equation) => (
            <span key={equation}>{equation}</span>
          ))}
        </div>
        <div className="phaseChip">{activeStage.canvasTag}</div>
        <div className="fieldMeaningOverlay">
          <strong>{FIELD_PHASE_LABELS[activePhaseId]}</strong>
          <span>{activeStage.visualJa}</span>
        </div>
      </div>
      <aside className="advancedReadout">
        <p className="eyebrow">{activeStage.kicker}</p>
        <h2 id="advanced-field-title">{activeStage.titleJa}</h2>
        <p>{activeStage.summaryJa}</p>
        <div className="continuityStatement">
          <strong>dual-direction reconstruction</strong>
          <div className="directionLine">
            <span className="directionLabel">存在の向き</span>
            {FIELD_REALITY_DIRECTION_STEPS.map((step) => (
              <span key={step} className="directionStep">
                {step}
              </span>
            ))}
          </div>
          <div className="directionLine">
            <span className="directionLabel">復元の向き</span>
            {FIELD_RECONSTRUCTION_DIRECTION_STEPS.map((step) => (
              <span key={step} className="directionStep">
                {step}
              </span>
            ))}
          </div>
          <span>{FIELD_TRANSFORMATION_SUMMARY}</span>
        </div>
        <div className="semanticStepList" aria-label="semantic transformation stages">
          {bridge.phases.map((phase, index) => {
            const active = phase.phaseId === activePhaseId;
            return (
              <span key={phase.phaseId} className={active ? 'activeStep' : undefined}>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                {FIELD_STAGE_STORY[phase.phaseId].shortJa}
              </span>
            );
          })}
        </div>
        <div className="layerStack">
          {FIELD_LAYER_LABELS.map((layer, index) => (
            <span key={layer} className={index === phaseIndex ? 'activeLayer' : undefined}>
              {layer}
            </span>
          ))}
        </div>
        <div className="projectionAngleList" aria-label="human-readable projection angles">
          {FIELD_PROJECTION_ANGLES.map((angle) => (
            <span key={angle}>{angle}</span>
          ))}
        </div>
        <div className="telemetryGrid">
          {ENGINE_TELEMETRY.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

export default function AxiomManifoldDisplayBridgeSurface() {
  const [activePhaseId, setActivePhaseId] =
    useState<AxiomManifoldDisplayPhaseId>('distorted_shadow');
  const activePhase =
    bridge.phases.find((phase) => phase.phaseId === activePhaseId) ?? bridge.phases[0];
  const activeReviewFocus = FIELD_DATA_GROUNDED_REVIEW_FOCUS[activePhaseId];

  return (
    <main className="axiomManifoldBridge">
      <section className="heroBand">
        <div className="heroCopy">
          <p className="eyebrow">Falcon Lab / internal kernel_display</p>
          <h1>
            <span>Axiom Manifold</span>
            <span>Display Bridge</span>
          </h1>
          <p className="lead">{bridge.conceptThesisJa}</p>
          <div className="boundaryStrip">
            <ShieldCheck aria-hidden="true" size={18} />
            <span>{bridge.boundaryLanguageJa}</span>
          </div>
        </div>
        <aside className="metricPanel" aria-label="source summary">
          <div>
            <strong>{formatNumber(bridge.numericSourceSummary.jointSubjectCount)}</strong>
            <span>joint subjects</span>
          </div>
          <div>
            <strong>{bridge.numericSourceSummary.manifoldPatternCount}</strong>
            <span>manifold patterns</span>
          </div>
          <div>
            <strong>{bridge.numericSourceSummary.revisedReviewUnitCount}</strong>
            <span>review units</span>
          </div>
          <div>
            <strong>{bridge.numericSourceSummary.integratedAxisCount}</strong>
            <span>integrated axes</span>
          </div>
        </aside>
      </section>

      <section className="simulatorBand" aria-labelledby="simulation-title">
        <header className="sectionHeader">
          <p className="eyebrow">live high-dimensional simulation prototype</p>
          <h2 id="simulation-title">
            <span>不変構造から影へ、</span>
            <span>影から復元へ</span>
          </h2>
          <p>{activePhase.explanationJa}</p>
        </header>

        <AdvancedManifoldField activePhaseId={activePhaseId} />

        <div className="phaseControls" aria-label="display phases">
          {bridge.phases.map((phase) => {
            const Icon = PHASE_ICONS[phase.phaseId];
            const active = phase.phaseId === activePhaseId;
            return (
              <button
                key={phase.phaseId}
                type="button"
                aria-pressed={active}
                className={active ? 'phaseButton active' : 'phaseButton'}
                onClick={() => setActivePhaseId(phase.phaseId)}
              >
                <Icon aria-hidden="true" size={16} />
                <span>{phase.titleJa}</span>
              </button>
            );
          })}
        </div>

        <div className="projectionIntro">
          <p className="eyebrow">reviewable transformation map</p>
          <h3>{FIELD_REVIEW_MAP_TITLE}</h3>
          <p>{FIELD_REVIEW_MAP_SUMMARY}</p>
        </div>

        <div className="simulationLayout">
          <figure className="graphFrame" aria-label="Axiom manifold display graph simulation">
            <svg viewBox="-4 0 136 76" role="img" aria-labelledby="graph-title graph-desc">
              <title id="graph-title">Axiom reviewable shadow-to-manifold transformation map</title>
              <desc id="graph-desc">
                A numerical SVG graph showing source lens collision map, ICF relation map, latent
                invariant axes, and NBL projection forms as four review layers of the same reality.
              </desc>
              <defs>
                <linearGradient id="reviewFlowGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#b76b4f" />
                  <stop offset="36%" stopColor="#2e7d6f" />
                  <stop offset="68%" stopColor="#5877ad" />
                  <stop offset="100%" stopColor="#1f4f47" />
                </linearGradient>
              </defs>
              <rect className="graphBg" x="-4" y="0" width="136" height="76" rx="4" />
              <g className="reviewStageBands" aria-hidden="true">
                {FIELD_REVIEW_MAP_STAGES.map((stage) => (
                  <g key={stage.phaseId}>
                    <rect
                      className={`reviewStageBand ${stage.className} ${
                        stage.phaseId === activePhaseId ? 'active' : ''
                      }`}
                      x={stage.bandX}
                      y="6"
                      width={stage.bandWidth}
                      height="64"
                      rx="3"
                    />
                    <text className="reviewStageLabel" x={stage.x} y="10.8">
                      {stage.labelJa}
                    </text>
                    <text className="reviewStageCaption" x={stage.x} y="14">
                      {stage.captionJa}
                    </text>
                    <text className="reviewStageTag" x={stage.x} y="17.7">
                      {stage.mapTagJa}
                    </text>
                  </g>
                ))}
              </g>
              <path className="reviewFlowArrow" d="M26 18 C41 11, 58 11, 73 18 S102 25, 122 18" />
              <path className="manifoldGuide" d="M66 63 C72 35, 84 24, 92 63" />
              <path className="manifoldGuide secondary" d="M66 30 C75 63, 90 62, 96 29" />
              <g className="reviewMapFlows" aria-hidden="true">
                {FIELD_REVIEW_MAP_FLOWS.map((flowItem) => {
                  const pathData = reviewMapFlowPath(flowItem);
                  if (!pathData) return null;
                  const active = flowItem.focusPhaseIds.includes(activePhaseId);
                  return (
                    <path
                      key={flowItem.id}
                      className={`reviewMapFlow ${flowItem.kind} ${active ? 'active' : ''}`}
                      d={pathData}
                      style={{
                        stroke: `hsla(${flowItem.hue}, 58%, 42%, ${active ? 0.72 : 0.22})`,
                        strokeWidth: 0.3 + flowItem.strength * (active ? 1.15 : 0.72),
                      }}
                    >
                      <title>{flowItem.labelJa}</title>
                    </path>
                  );
                })}
              </g>
              <g className="reviewMapNodes">
                {FIELD_REVIEW_MAP_VISUAL_NODES.map((nodeItem) => {
                  const active = nodeItem.phaseId === activePhaseId;
                  return (
                    <g
                      key={nodeItem.id}
                      className={`reviewMapNode ${nodeItem.kind} ${active ? 'active' : ''}`}
                      transform={`translate(${(nodeItem.x - nodeItem.width / 2).toFixed(2)} ${(
                        nodeItem.y -
                        nodeItem.height / 2
                      ).toFixed(2)})`}
                    >
                      <title>{`${nodeItem.labelJa}: ${nodeItem.detailJa} / ${nodeItem.sourceJa}`}</title>
                      <rect
                        width={nodeItem.width}
                        height={nodeItem.height}
                        rx="1.6"
                        style={{
                          fill: `hsla(${nodeItem.hue}, 60%, ${active ? 96 : 98}%, ${
                            active ? 0.98 : 0.86
                          })`,
                          stroke: `hsla(${nodeItem.hue}, 56%, ${active ? 34 : 48}%, ${
                            active ? 0.76 : 0.36
                          })`,
                        }}
                      />
                      <text
                        className="reviewMapNodeLabel"
                        x={nodeItem.width / 2}
                        y={nodeItem.height * 0.42}
                      >
                        {nodeItem.labelJa}
                      </text>
                      <text
                        className="reviewMapNodeDetail"
                        x={nodeItem.width / 2}
                        y={nodeItem.height * 0.75}
                      >
                        {nodeItem.detailJa}
                      </text>
                    </g>
                  );
                })}
              </g>
              <text className="reviewMapBasis" x="2" y="72">
                basis: source-family ledger + bridge nodes/edges; no raw source export
              </text>
            </svg>
            <figcaption>
              {FIELD_REVIEW_MAP_CAPTION} {activePhase.displayCautionJa}
            </figcaption>
          </figure>

          <aside className="phaseReadout">
            <p className="eyebrow">Review focus</p>
            <h3>{activeReviewFocus.titleJa}</h3>
            <p>{activeReviewFocus.summaryJa}</p>
            <div className="mapFocusNote">
              <strong>{activeReviewFocus.noteTitleJa}</strong>
              <span>{activeReviewFocus.noteMetaJa}</span>
              <small>{activeReviewFocus.boundaryJa}</small>
            </div>
            <div className="nodeLegend">
              {activeReviewFocus.chipsJa.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <ul>
              {activeReviewFocus.items.map((item) => (
                <li key={item.titleJa}>
                  <strong>{item.titleJa}</strong>
                  <span>{item.detailJa}</span>
                  <em>{item.sourceJa}</em>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="storyBand" aria-labelledby="storyboard-title">
        <header className="sectionHeader">
          <p className="eyebrow">video candidate structure</p>
          <h2 id="storyboard-title">一般向け動画へ広げる場合の骨格</h2>
          <p>
            ここで作るのは公開動画ではなく、数学的シミュレーション風の映像に変換できる構造台本です。
          </p>
        </header>
        <div className="storyGrid">
          {bridge.videoStoryboard.map((step, index) => (
            <article key={step.stepId} className="storyCard">
              <p className="storyIndex">Scene {index + 1}</p>
              <h3>{step.titleJa}</h3>
              <p>{step.visualMoveJa}</p>
              <blockquote>{step.narrationDraftJa}</blockquote>
              <span>{step.boundaryJa}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryBand" aria-labelledby="boundary-title">
        <header className="sectionHeader">
          <p className="eyebrow">public copy / campaign boundary</p>
          <h2 id="boundary-title">公開前に残す境界</h2>
        </header>
        <div className="boundaryGrid">
          <article>
            <h3>Primary risk</h3>
            <p>{bridge.publicCopyRiskReview.primaryRiskJa}</p>
          </article>
          <article>
            <h3>Safer frame</h3>
            <p>{bridge.publicCopyRiskReview.saferFrameJa}</p>
          </article>
          <article>
            <h3>Required before public use</h3>
            <ul>
              {bridge.publicCopyRiskReview.requiredBeforePublicUseJa.map((item) => (
                <li key={item}>
                  <ArrowRight aria-hidden="true" size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="notNowBand" aria-labelledby="not-now-title">
        <h2 id="not-now-title">Not now</h2>
        <ul>
          {bridge.notNow.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <style jsx>{`
        .axiomManifoldBridge {
          width: 100%;
          max-width: 100vw;
          min-height: 100vh;
          overflow-x: hidden;
          background: #f7f5ee;
          color: #17211d;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic', 'YuGothic',
            'Noto Sans JP', sans-serif;
        }

        .axiomManifoldBridge,
        .axiomManifoldBridge * {
          box-sizing: border-box;
          min-width: 0;
        }

        .heroBand,
        .simulatorBand,
        .storyBand,
        .boundaryBand,
        .notNowBand {
          padding: 56px 8vw;
        }

        .heroBand {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
          gap: 28px;
          background:
            linear-gradient(135deg, rgba(23, 33, 29, 0.98), rgba(34, 54, 67, 0.96)), #17211d;
          color: #fffaf0;
        }

        .heroCopy h1 {
          margin: 0;
          max-width: 820px;
          font-size: clamp(2.4rem, 5vw, 5rem);
          line-height: 0.98;
          letter-spacing: 0;
          overflow-wrap: anywhere;
        }

        .heroCopy h1 span,
        .sectionHeader h2 span {
          display: block;
        }

        .heroCopy,
        .sectionHeader,
        .lead,
        .boundaryStrip {
          max-width: 100%;
          overflow-wrap: anywhere;
        }

        .lead {
          margin: 24px 0 0;
          max-width: 860px;
          color: rgba(255, 250, 240, 0.84);
          font-size: 1.12rem;
          line-height: 1.9;
        }

        .eyebrow {
          margin: 0 0 12px;
          color: #b76b4f;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .boundaryStrip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 880px;
          margin-top: 28px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 250, 240, 0.9);
          line-height: 1.7;
        }

        .boundaryStrip span {
          flex: 1 1 auto;
          min-width: 0;
        }

        .metricPanel {
          display: grid;
          gap: 10px;
          align-self: end;
        }

        .metricPanel div {
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
        }

        .metricPanel strong {
          display: block;
          font-size: 1.9rem;
          line-height: 1;
        }

        .metricPanel span {
          display: block;
          margin-top: 8px;
          color: rgba(255, 250, 240, 0.72);
          font-size: 0.82rem;
        }

        .sectionHeader {
          max-width: 880px;
          margin-bottom: 24px;
        }

        .sectionHeader h2,
        .notNowBand h2 {
          margin: 0;
          color: #17211d;
          font-size: clamp(1.8rem, 3.3vw, 3rem);
          line-height: 1.08;
          letter-spacing: 0;
          overflow-wrap: anywhere;
        }

        .sectionHeader p:not(.eyebrow) {
          margin: 14px 0 0;
          color: #506059;
          font-size: 1rem;
          line-height: 1.85;
        }

        :global(.advancedField) {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.55fr);
          align-items: start;
          gap: 18px;
          margin: 28px 0 18px;
        }

        :global(.advancedField),
        :global(.advancedField *) {
          box-sizing: border-box;
          min-width: 0;
        }

        :global(.advancedCanvasShell) {
          position: relative;
          height: 560px;
          min-height: 560px;
          overflow: hidden;
          border: 1px solid rgba(117, 242, 221, 0.22);
          border-radius: 8px;
          background:
            radial-gradient(circle at 20% 16%, rgba(85, 214, 190, 0.2), transparent 30%),
            radial-gradient(circle at 80% 18%, rgba(106, 137, 255, 0.18), transparent 32%),
            linear-gradient(135deg, #06110f 0%, #07111c 52%, #120916 100%);
          box-shadow:
            0 24px 72px rgba(6, 17, 15, 0.22),
            inset 0 0 0 1px rgba(255, 255, 255, 0.04),
            inset 0 0 80px rgba(71, 221, 194, 0.08);
        }

        :global(.advancedCanvasShell canvas) {
          display: block;
          width: 100%;
          height: 560px;
        }

        :global(.advancedCanvasShell::before) {
          position: absolute;
          inset: 0;
          pointer-events: none;
          content: '';
          background:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 18px 18px;
          mix-blend-mode: screen;
        }

        :global(.advancedCanvasShell.phase-distorted_shadow::before) {
          opacity: 0;
        }

        :global(.advancedCanvasShell::after) {
          position: absolute;
          inset: 18px;
          pointer-events: none;
          border: 1px solid rgba(117, 242, 221, 0.14);
          border-radius: 8px;
          content: '';
          box-shadow:
            0 0 18px rgba(117, 242, 221, 0.15),
            inset 0 0 28px rgba(117, 242, 221, 0.08);
        }

        :global(.scanLine) {
          position: absolute;
          left: 0;
          right: 0;
          top: -18%;
          height: 24%;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(121, 242, 223, 0.07) 45%,
            rgba(121, 242, 223, 0.24) 50%,
            rgba(121, 242, 223, 0.07) 55%,
            transparent 100%
          );
          animation: scanField 4.8s linear infinite;
        }

        :global(.advancedCanvasShell.phase-distorted_shadow .scanLine) {
          display: none;
          animation: none;
        }

        :global(.equationStack) {
          position: absolute;
          left: 20px;
          top: 18px;
          display: grid;
          gap: 7px;
          max-width: min(420px, calc(100% - 40px));
          color: rgba(220, 255, 246, 0.78);
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
          font-size: 0.76rem;
          line-height: 1.35;
          text-shadow: 0 0 16px rgba(117, 242, 221, 0.32);
        }

        :global(.equationStack span) {
          width: fit-content;
          border: 1px solid rgba(117, 242, 221, 0.16);
          border-radius: 6px;
          background: rgba(3, 10, 14, 0.5);
          padding: 5px 7px;
          backdrop-filter: blur(8px);
        }

        :global(.phaseChip) {
          position: absolute;
          right: 20px;
          top: 18px;
          max-width: min(220px, calc(100% - 40px));
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          padding: 8px 11px;
          color: rgba(255, 255, 255, 0.86);
          font-size: 0.76rem;
          font-weight: 900;
          line-height: 1.15;
          overflow-wrap: anywhere;
          text-align: center;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        :global(.fieldMeaningOverlay) {
          position: absolute;
          right: 20px;
          bottom: 20px;
          display: grid;
          gap: 6px;
          max-width: min(420px, calc(100% - 40px));
          border: 1px solid rgba(117, 242, 221, 0.18);
          border-radius: 8px;
          background: rgba(3, 10, 14, 0.56);
          padding: 12px 14px;
          color: rgba(235, 255, 250, 0.9);
          backdrop-filter: blur(12px);
        }

        :global(.fieldMeaningOverlay strong) {
          font-size: 0.78rem;
          text-transform: uppercase;
        }

        :global(.fieldMeaningOverlay span) {
          color: rgba(235, 255, 250, 0.74);
          font-size: 0.82rem;
          line-height: 1.55;
        }

        :global(.advancedReadout) {
          border: 1px solid rgba(23, 33, 29, 0.12);
          border-radius: 8px;
          background:
            linear-gradient(180deg, rgba(255, 253, 247, 0.98), rgba(238, 244, 241, 0.94)), #fffdf7;
          padding: 22px;
          box-shadow: 0 16px 40px rgba(23, 33, 29, 0.08);
        }

        :global(.advancedReadout h2) {
          margin: 0;
          color: #17211d;
          font-size: clamp(1.6rem, 2.4vw, 2.55rem);
          line-height: 1.08;
          letter-spacing: 0;
          overflow-wrap: anywhere;
        }

        :global(.advancedReadout h2 span) {
          display: block;
        }

        :global(.advancedReadout p:not(.eyebrow)) {
          margin: 14px 0 0;
          color: #506059;
          line-height: 1.8;
        }

        :global(.continuityStatement) {
          display: grid;
          gap: 6px;
          margin-top: 16px;
          border: 1px solid rgba(46, 125, 111, 0.2);
          border-radius: 8px;
          background: rgba(46, 125, 111, 0.08);
          padding: 12px;
        }

        :global(.continuityStatement strong) {
          color: #1f4f47;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        :global(.continuityStatement span) {
          color: #43554d;
          font-size: 0.88rem;
          line-height: 1.65;
        }

        :global(.directionLine) {
          display: grid;
          gap: 3px;
          max-width: 100%;
          color: #43554d;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        :global(.directionLine .directionLabel) {
          color: #1f4f47;
          font-size: 0.76rem;
          font-weight: 900;
        }

        :global(.directionLine .directionStep) {
          display: block;
          max-width: 100%;
          overflow-wrap: anywhere;
          word-break: break-all;
        }

        :global(.directionLine .directionStep:not(:last-child)::after) {
          margin-left: 6px;
          color: #8a9a93;
          content: '->';
        }

        :global(.semanticStepList) {
          display: grid;
          gap: 8px;
          margin-top: 18px;
        }

        :global(.semanticStepList span) {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(23, 33, 29, 0.12);
          border-radius: 8px;
          background: #f4f5ef;
          padding: 10px 12px;
          color: #43554d;
          font-size: 0.82rem;
          font-weight: 900;
        }

        :global(.semanticStepList strong) {
          color: #b76b4f;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
          font-size: 0.74rem;
        }

        :global(.semanticStepList .activeStep) {
          border-color: rgba(46, 125, 111, 0.42);
          background: #133f38;
          color: #ecfff8;
          box-shadow: 0 0 0 3px rgba(46, 125, 111, 0.1);
        }

        :global(.semanticStepList .activeStep strong) {
          color: #f6d990;
        }

        :global(.layerStack) {
          display: grid;
          gap: 8px;
          margin-top: 18px;
        }

        :global(.layerStack span) {
          border: 1px solid rgba(23, 33, 29, 0.12);
          border-radius: 8px;
          background: #f4f5ef;
          padding: 10px 12px;
          color: #43554d;
          font-size: 0.83rem;
          font-weight: 900;
        }

        :global(.layerStack .activeLayer) {
          border-color: rgba(46, 125, 111, 0.42);
          background: #133f38;
          color: #ecfff8;
          box-shadow: 0 0 0 3px rgba(46, 125, 111, 0.1);
        }

        :global(.projectionAngleList) {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        :global(.projectionAngleList span) {
          border-radius: 999px;
          background: rgba(88, 119, 173, 0.12);
          padding: 7px 9px;
          color: #40536d;
          font-size: 0.74rem;
          font-weight: 900;
        }

        :global(.telemetryGrid) {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
        }

        :global(.telemetryGrid div) {
          border: 1px solid rgba(23, 33, 29, 0.1);
          border-radius: 8px;
          background: #fffdf7;
          padding: 12px;
        }

        :global(.telemetryGrid strong) {
          display: block;
          color: #17211d;
          font-size: 1.25rem;
          line-height: 1;
        }

        :global(.telemetryGrid span) {
          display: block;
          margin-top: 7px;
          color: #65746e;
          font-size: 0.73rem;
          font-weight: 800;
        }

        .phaseControls {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin: 18px 0;
        }

        .phaseButton {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(23, 33, 29, 0.16);
          border-radius: 8px;
          background: #fffdf7;
          color: #27362f;
          font-weight: 800;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            background 160ms ease,
            color 160ms ease;
        }

        .phaseButton.active {
          border-color: #2e7d6f;
          background: #1f4f47;
          color: #fffdf7;
        }

        .simulationLayout {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
          gap: 20px;
          align-items: stretch;
        }

        .projectionIntro {
          margin: 28px 0 12px;
        }

        .projectionIntro h3 {
          margin: 0;
          color: #17211d;
          font-size: 1.35rem;
          line-height: 1.35;
          letter-spacing: 0;
        }

        .projectionIntro p:not(.eyebrow) {
          max-width: 780px;
          margin: 8px 0 0;
          color: #506059;
          line-height: 1.8;
        }

        @keyframes scanField {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          82% {
            opacity: 0.86;
          }
          100% {
            transform: translateY(570%);
            opacity: 0;
          }
        }

        .graphFrame,
        .phaseReadout,
        .storyCard,
        .boundaryGrid article,
        .notNowBand {
          border: 1px solid rgba(23, 33, 29, 0.12);
          border-radius: 8px;
          background: #fffdf7;
          box-shadow: 0 16px 40px rgba(23, 33, 29, 0.08);
        }

        .graphFrame {
          margin: 0;
          overflow: hidden;
        }

        .graphFrame svg {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #f8fbf8;
        }

        .graphBg {
          fill: #f8fbf8;
        }

        .manifoldGuide {
          fill: none;
          stroke: rgba(46, 125, 111, 0.24);
          stroke-width: 0.8;
          stroke-dasharray: 1.6 1.6;
        }

        .manifoldGuide.secondary {
          stroke: rgba(183, 107, 79, 0.22);
        }

        .reviewStageBand {
          fill: rgba(255, 255, 255, 0.62);
          stroke: rgba(23, 33, 29, 0.13);
          stroke-width: 0.35;
        }

        .reviewStageBand.shadowStage {
          fill: rgba(183, 107, 79, 0.09);
        }

        .reviewStageBand.reconstructionStage {
          fill: rgba(46, 125, 111, 0.09);
        }

        .reviewStageBand.latentStage {
          fill: rgba(88, 119, 173, 0.1);
        }

        .reviewStageBand.projectionStage {
          fill: rgba(31, 79, 71, 0.09);
        }

        .reviewStageBand.active {
          stroke: rgba(23, 33, 29, 0.46);
          stroke-width: 0.75;
        }

        .reviewStageLabel {
          fill: #17211d;
          font-size: 3px;
          font-weight: 900;
          letter-spacing: 0;
          text-anchor: middle;
        }

        .reviewStageCaption {
          fill: #617069;
          font-size: 2px;
          font-weight: 800;
          letter-spacing: 0;
          text-anchor: middle;
        }

        .reviewStageTag {
          fill: #33413b;
          font-size: 1.9px;
          font-weight: 900;
          letter-spacing: 0;
          text-anchor: middle;
        }

        .reviewFlowArrow {
          fill: none;
          stroke: url(#reviewFlowGradient);
          stroke-linecap: round;
          stroke-width: 0.8;
          stroke-dasharray: 2 2;
          opacity: 0.38;
        }

        .reviewMapFlow {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.78;
          transition:
            opacity 220ms ease,
            stroke-width 220ms ease;
        }

        .reviewMapFlow.active {
          filter: drop-shadow(0 0 2px rgba(46, 125, 111, 0.22));
        }

        .reviewMapFlow.lens_to_icf {
          stroke-dasharray: 1.1 1.3;
        }

        .reviewMapFlow.icf_to_axis {
          stroke-dasharray: 2.2 0.9;
        }

        .reviewMapFlow.axis_to_projection {
          stroke-dasharray: 3 1.2;
        }

        .reviewMapNode {
          transform-box: fill-box;
          transform-origin: center;
          transition:
            opacity 220ms ease,
            filter 220ms ease;
          opacity: 0.84;
        }

        .reviewMapNode.active {
          opacity: 1;
          filter: drop-shadow(0 6px 8px rgba(23, 33, 29, 0.16));
        }

        .reviewMapNode rect {
          stroke-width: 0.42;
        }

        .reviewMapNodeLabel,
        .reviewMapNodeDetail {
          fill: #17211d;
          letter-spacing: 0;
          text-anchor: middle;
          paint-order: stroke;
          stroke: rgba(248, 251, 248, 0.92);
          stroke-width: 0.7px;
        }

        .reviewMapNodeLabel {
          font-size: 2.25px;
          font-weight: 800;
        }

        .reviewMapNodeDetail {
          fill: #506059;
          font-size: 1.65px;
          font-weight: 750;
        }

        .reviewMapBasis {
          fill: #617069;
          font-size: 1.8px;
          font-weight: 750;
          letter-spacing: 0;
        }

        .graphFrame figcaption {
          padding: 14px 16px;
          border-top: 1px solid rgba(23, 33, 29, 0.1);
          color: #506059;
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .phaseReadout {
          padding: 20px;
        }

        .phaseReadout h3,
        .storyCard h3,
        .boundaryGrid h3 {
          margin: 0;
          color: #17211d;
          font-size: 1.15rem;
          line-height: 1.3;
          letter-spacing: 0;
        }

        .phaseReadout p {
          color: #506059;
          line-height: 1.75;
        }

        .mapFocusNote {
          display: grid;
          gap: 4px;
          margin: 16px 0;
          border: 1px solid rgba(46, 125, 111, 0.18);
          border-radius: 8px;
          background: #f3f8f5;
          padding: 12px 14px;
        }

        .mapFocusNote strong {
          color: #17211d;
          font-size: 0.96rem;
        }

        .mapFocusNote span {
          color: #2e7d6f;
          font-size: 0.82rem;
          font-weight: 900;
        }

        .mapFocusNote small {
          color: #617069;
          font-size: 0.78rem;
          line-height: 1.55;
        }

        .nodeLegend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0;
        }

        .nodeLegend span {
          border-radius: 999px;
          background: #edf3ef;
          padding: 6px 10px;
          color: #2d4038;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .phaseReadout ul,
        .notNowBand ul,
        .boundaryGrid ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .phaseReadout li {
          display: grid;
          gap: 5px;
          padding: 12px 0;
          border-top: 1px solid rgba(23, 33, 29, 0.1);
        }

        .phaseReadout li strong {
          color: #17211d;
          line-height: 1.4;
        }

        .phaseReadout li span {
          color: #617069;
          font-size: 0.84rem;
          line-height: 1.55;
        }

        .phaseReadout li em {
          color: #7a6d61;
          font-size: 0.73rem;
          font-style: normal;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .storyBand {
          background: #eef4f1;
        }

        .storyGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .storyCard {
          padding: 18px;
        }

        .storyIndex {
          margin: 0 0 8px;
          color: #b76b4f;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .storyCard p:not(.storyIndex),
        .boundaryGrid p {
          color: #506059;
          line-height: 1.7;
        }

        .storyCard blockquote {
          margin: 14px 0;
          border-left: 3px solid #2e7d6f;
          padding-left: 12px;
          color: #24362f;
          font-weight: 700;
          line-height: 1.65;
        }

        .storyCard span {
          display: inline-block;
          border-radius: 999px;
          background: #f3eee5;
          padding: 6px 9px;
          color: #7b4c3b;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .boundaryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .boundaryGrid article {
          padding: 20px;
        }

        .boundaryGrid li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 0;
          color: #506059;
          line-height: 1.55;
        }

        .notNowBand {
          margin: 0 24px 56px;
          padding: 28px;
        }

        .notNowBand ul {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .notNowBand li {
          border-radius: 999px;
          background: #eef2f0;
          padding: 8px 10px;
          color: #506059;
          font-size: 0.78rem;
          font-weight: 800;
        }

        @media (max-width: 980px) {
          .heroBand,
          .simulationLayout,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          :global(.advancedField) {
            grid-template-columns: 1fr;
          }

          .phaseControls,
          .storyGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1228px) {
          .notNowBand {
            width: 1180px;
            margin: 0 auto 56px;
          }
        }

        @media (max-width: 620px) {
          .heroBand,
          .simulatorBand,
          .storyBand,
          .boundaryBand,
          .notNowBand {
            padding: 36px 18px;
          }

          .heroBand,
          .simulatorBand,
          .storyBand,
          .boundaryBand {
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
          }

          .heroCopy,
          .metricPanel,
          .sectionHeader,
          .phaseControls,
          .projectionIntro,
          .simulationLayout,
          .graphFrame,
          .phaseReadout,
          .storyGrid,
          .boundaryGrid,
          .boundaryStrip {
            width: 100%;
            max-width: calc(100vw - 36px);
          }

          :global(.advancedField),
          :global(.advancedCanvasShell),
          :global(.advancedReadout) {
            width: calc(100vw - 36px);
            max-width: calc(100vw - 36px);
          }

          .heroCopy h1 {
            font-size: 2.08rem;
            line-height: 1.08;
          }

          .lead {
            font-size: 1rem;
          }

          .lead,
          .boundaryStrip span,
          .sectionHeader p:not(.eyebrow),
          .projectionIntro p:not(.eyebrow),
          .graphFrame figcaption,
          .phaseReadout p,
          .mapFocusNote small,
          .storyCard p,
          .boundaryGrid p {
            max-width: 34ch;
            overflow-wrap: anywhere;
            word-break: break-all;
            line-break: anywhere;
            white-space: normal;
          }

          .boundaryStrip span {
            max-width: 28ch;
          }

          .sectionHeader h2,
          .notNowBand h2 {
            font-size: 1.82rem;
            line-height: 1.16;
          }

          :global(.advancedField) {
            gap: 12px;
            margin: 22px 0 16px;
          }

          :global(.advancedCanvasShell) {
            height: 440px;
            min-height: 440px;
          }

          :global(.advancedCanvasShell canvas) {
            height: 440px;
          }

          :global(.advancedCanvasShell::after) {
            inset: 12px;
          }

          :global(.equationStack) {
            left: 12px;
            top: 12px;
            max-width: calc(100% - 24px);
            font-size: 0.64rem;
          }

          :global(.equationStack span) {
            padding: 4px 6px;
          }

          :global(.phaseChip) {
            right: auto;
            top: auto;
            bottom: 74px;
            left: 12px;
            max-width: calc(100% - 24px);
            border-radius: 8px;
            font-size: 0.68rem;
            overflow-wrap: anywhere;
          }

          :global(.fieldMeaningOverlay) {
            right: 12px;
            bottom: 12px;
            left: 12px;
            max-width: calc(100% - 24px);
            padding: 10px 11px;
          }

          :global(.fieldMeaningOverlay span) {
            display: none;
          }

          :global(.advancedReadout) {
            padding: 18px;
          }

          :global(.advancedReadout h2) {
            max-width: 11em;
            font-size: 1.38rem;
            line-height: 1.16;
            overflow-wrap: anywhere;
            word-break: break-all;
            line-break: anywhere;
          }

          .projectionIntro h3 {
            max-width: 34ch;
            overflow-wrap: anywhere;
            word-break: break-all;
            line-break: anywhere;
          }

          :global(.advancedReadout p:not(.eyebrow)) {
            max-width: 34ch;
            overflow-wrap: anywhere;
            word-break: break-all;
            line-break: anywhere;
          }

          :global(.continuityStatement span) {
            overflow-wrap: anywhere;
            word-break: break-all;
            line-break: anywhere;
          }

          :global(.telemetryGrid) {
            grid-template-columns: 1fr;
          }

          .graphFrame {
            overflow-x: auto;
          }

          .graphFrame svg {
            width: 640px;
            max-width: none;
          }

          .phaseControls,
          .storyGrid {
            grid-template-columns: 1fr;
          }

          .notNowBand {
            margin: 0 18px 36px;
          }
        }
      `}</style>
    </main>
  );
}
