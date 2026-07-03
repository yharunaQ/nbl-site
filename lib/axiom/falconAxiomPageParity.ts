import { type AxiomNextNblSiteSurface } from './siteSurfaceSlotContract';

export const AXIOM_FALCON_PAGE_PARITY_VERSION = 'v0_2026_06_12' as const;

export type AxiomFalconPageParityStatus =
  | 'preserved'
  | 'replaced_with_axiom_content'
  | 'upgraded_with_axiom_content'
  | 'not_applicable';

export type AxiomFalconPageParityExpectation = {
  surface: AxiomNextNblSiteSurface;
  falconRoleId: string;
  falconFeature: string;
  axiomReplacement: string;
  status: AxiomFalconPageParityStatus;
};

export const AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS = [
  {
    surface: 'reader_facing_top_home',
    falconRoleId: 'NS-01',
    falconFeature: '立場別の読者入口',
    axiomReplacement:
      '本人・家族、支援者、企業、研修/政策の入口を、Axiomの仕事条件読解へ戻す導線として再配置する。',
    status: 'upgraded_with_axiom_content',
  },
  {
    surface: 'reader_facing_top_home',
    falconRoleId: 'NS-01',
    falconFeature: '古くて新しい課題の一撃説明',
    axiomReplacement:
      '支援不足ではなく、本人・仕事・環境・支援・時間の関係を読む地図が不足していた、というAxiomの入口文法へ置換する。',
    status: 'replaced_with_axiom_content',
  },
  {
    surface: 'reader_facing_top_home',
    falconRoleId: 'NS-01',
    falconFeature: '5つの入口 / product map',
    axiomReplacement:
      '場面、相談、視点ガイド、記事、ツール、条件窓、方法、境界への9面導線として保持する。',
    status: 'preserved',
  },
  {
    surface: 'scene_entry_use_cases',
    falconRoleId: 'NS-04',
    falconFeature: '4コマ / モデル場面入口',
    axiomReplacement:
      '月末締切、手順変更、開示と評価、移動/道具/接触点のモデル場面としてAxiom読解へ置換する。',
    status: 'upgraded_with_axiom_content',
  },
  {
    surface: 'consultation_case_reading_collection',
    falconRoleId: 'NS-02',
    falconFeature: 'FAQカタログと相談ルート',
    axiomReplacement:
      '42 facet / residual guardの発想を持ち、健康時間、開示、手順、接触点、評価、入口以前などを静的相談FAQとして再構成する。',
    status: 'upgraded_with_axiom_content',
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    falconRoleId: 'NS-03',
    falconFeature: '21視点ボード',
    axiomReplacement:
      '固定21視点ではなく、Axiom統合知識を状況レベルと読者向け仕事設計視点へ再編集する。',
    status: 'replaced_with_axiom_content',
  },
  {
    surface: 'article_social_question_library',
    falconRoleId: 'NS-05',
    falconFeature: '記事集 / SNS運用ボード',
    axiomReplacement:
      'SNSはトップページ化せず、社会の違和感を記事、図解、見出し、詳細解説、相談/ツール導線へ戻す。',
    status: 'upgraded_with_axiom_content',
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    falconRoleId: 'NS-06',
    falconFeature: '認知補助ツールキット',
    axiomReplacement:
      '一枚地図、確認ワーク、場面スクリプト、研修素材、マルチモーダル教材へAxiom知識を道具化する。',
    status: 'upgraded_with_axiom_content',
  },
  {
    surface: 'work_condition_window',
    falconRoleId: 'NS-09',
    falconFeature: '障害種類・疾病名から見る入口',
    axiomReplacement:
      '障害種類から入る需要を保ち、感覚、内部/難病、認知/精神/発達、肢体/移動などを仕事条件質問へ変換する。',
    status: 'upgraded_with_axiom_content',
  },
  {
    surface: 'theory_method_trust_page',
    falconRoleId: 'NS-07',
    falconFeature: 'なぜ可能か / 方法説明',
    axiomReplacement:
      'AI超読解、仮説化、反対仮説、missing context、source lens、人間レビューの境界を説明する。',
    status: 'replaced_with_axiom_content',
  },
  {
    surface: 'about_operating_boundary_page',
    falconRoleId: 'NS-08',
    falconFeature: 'このサイトについて / 運営境界',
    axiomReplacement:
      'NBLがすること、しないこと、止めることを分け、個別判断や公開承認との境界を示す。',
    status: 'replaced_with_axiom_content',
  },
] as const satisfies readonly AxiomFalconPageParityExpectation[];

export type AxiomFalconPageParityValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_falcon_page_parity_valid'
    | 'axiom_falcon_page_parity_invalid';
  errorCount: number;
  errors: string[];
};

export function validateAxiomFalconPageParity(
  expectations: readonly AxiomFalconPageParityExpectation[] =
    AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS,
): AxiomFalconPageParityValidation {
  const errors: string[] = [];
  const surfaces = new Set(expectations.map((item) => item.surface));
  const sceneEntry = expectations.find(
    (item) =>
      item.surface === 'scene_entry_use_cases' &&
      item.falconRoleId === 'NS-04' &&
      item.falconFeature.includes('4コマ'),
  );
  const snsTopLevel = expectations.find(
    (item) =>
      item.falconFeature.includes('SNS') &&
      item.axiomReplacement.includes('トップページ化'),
  );

  for (const item of expectations) {
    if (item.status === 'not_applicable') {
      errors.push(`unexpected_not_applicable:${item.surface}:${item.falconFeature}`);
    }
    if (!item.axiomReplacement) {
      errors.push(`missing_axiom_replacement:${item.surface}:${item.falconFeature}`);
    }
  }

  for (const surface of [
    'reader_facing_top_home',
    'scene_entry_use_cases',
    'consultation_case_reading_collection',
    'twenty_one_views_work_design_guide',
    'article_social_question_library',
    'cognitive_support_toolkit_studio_multimodal_objects',
    'work_condition_window',
    'theory_method_trust_page',
    'about_operating_boundary_page',
  ] as const satisfies readonly AxiomNextNblSiteSurface[]) {
    if (!surfaces.has(surface)) {
      errors.push(`missing_surface_parity:${surface}`);
    }
  }

  if (!sceneEntry) {
    errors.push('scene_entry_must_preserve_falcon_ns04_scene_function');
  }
  if (!snsTopLevel) {
    errors.push('sns_circulation_demoted_from_top_level_must_be_recorded');
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_falcon_page_parity_valid'
        : 'axiom_falcon_page_parity_invalid',
    errorCount: errors.length,
    errors,
  };
}
