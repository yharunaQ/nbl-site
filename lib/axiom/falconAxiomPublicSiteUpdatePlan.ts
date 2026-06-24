import {
  buildAxiomReviewedKernelBackedCandidateRouteMap,
  type AxiomReviewedKernelBackedCandidateRouteMap,
} from './reviewedKernelBackedCandidateRouteMap';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';

export const AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE =
  '/internal/axiom-next-nbl-public-candidate' as const;

export const AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY =
  'falcon_final_site_structure_is_delivery_scaffold_axiom_kernel_backbone_replaces_concrete_content_not_core_truth_backfill' as const;

export const AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type FalconFinalNblPageRoleId =
  | 'NS-01'
  | 'NS-02'
  | 'NS-03'
  | 'NS-04'
  | 'NS-05'
  | 'NS-06'
  | 'NS-07'
  | 'NS-08'
  | 'NS-09';

export type FalconInheritedLayoutModule =
  | 'public_shell_header_navigation'
  | 'hero_visual_with_action_pair'
  | 'problem_promise_not_this_context_strip'
  | 'progressive_context_disclosure'
  | 'scene_comic_use_case_panel'
  | 'faq_catalog_grid'
  | 'situation_level_work_design_ladder'
  | 'three_depth_article_layout'
  | 'full_boundary_explanation_zone'
  | 'home_reader_path_product_map'
  | 'surface_specific_content_body'
  | 'review_focus_boundary_panel'
  | 'site_boundary_footer';

export type AxiomPublicSiteContentUpdateModule =
  | 'page_heading_from_accepted_integrated_domain_knowledge'
  | 'opening_thesis_from_accepted_integrated_domain_knowledge'
  | 'body_sections_from_10_units_37_substructures'
  | 'public_copy_review_prompts_from_projection_boundary'
  | 'boundary_language_from_founder_receipt';

export type FalconAxiomPublicSiteUpdatePlanDefinition = {
  surface: AxiomNextNblSiteSurface;
  falconPageRoleId: FalconFinalNblPageRoleId;
  falconPageRoleJa: string;
  navLabelJa: string;
  falconContextLabelJa: string;
  eyebrowJa: string;
  leadJa: string;
  problemJa: string;
  promiseJa: string;
  notThisJa: string;
  primarySlug: string;
  primaryLabelJa: string;
  secondarySlug: string;
  secondaryLabelJa: string;
  visual: {
    src: string;
    alt: string;
  };
  inheritedFalconLayoutModules: readonly FalconInheritedLayoutModule[];
  axiomContentUpdateModules: readonly AxiomPublicSiteContentUpdateModule[];
};

export type FalconAxiomPublicSiteUpdatePlanRow = FalconAxiomPublicSiteUpdatePlanDefinition & {
  rowId: string;
  slug: string;
  path: string;
  updateMode: 'replace_falcon_copy_with_axiom_kernel_backed_content_preserve_public_site_role_and_layout';
  falconUsePolicy: 'falcon_final_site_role_layout_and_visual_rhythm_are_delivery_scaffold_not_axiom_core_truth';
  axiomContentSource: 'founder_accepted_all_layer_integrated_domain_knowledge_page_body_projection';
  routeStatus: 'internal_candidate_route_created_not_actual_public_navigation';
  publicNavigationStatus: 'not_public_navigation';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type FalconAxiomPublicSiteUpdatePlan = {
  updatePlanId: string;
  objectType: 'falcon_axiom_public_site_update_plan';
  contractVersion: typeof AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_VERSION;
  lane: 'Falcon Lab';
  status: 'falcon_final_site_scaffold_axiom_kernel_content_update_plan_ready';
  boundary: typeof AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY;
  strengthensCore: typeof AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_CORE_PROGRESS_CLASSES;
  routeBase: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE;
  sourceRouteMapId: string;
  surfaceCount: 9;
  surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
  rows: FalconAxiomPublicSiteUpdatePlanRow[];
  notNow: readonly [
    'no_falcon_public_copy_as_axiom_core_truth',
    'no_actual_public_navigation',
    'no_public_approval_or_publication_execution',
    'no_source_support_validity_finality',
    'no_candidate_pattern_promotion',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_learning_update',
  ];
};

export type FalconAxiomPublicSiteUpdatePlanValidation = {
  valid: boolean;
  validationStatus:
    | 'falcon_axiom_public_site_update_plan_valid'
    | 'falcon_axiom_public_site_update_plan_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY;
  strengthensCore: typeof AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_CORE_PROGRESS_CLASSES;
};

const COMMON_LAYOUT_MODULES = [
  'public_shell_header_navigation',
  'hero_visual_with_action_pair',
  'progressive_context_disclosure',
  'surface_specific_content_body',
  'review_focus_boundary_panel',
  'site_boundary_footer',
] as const satisfies readonly FalconInheritedLayoutModule[];

const COMMON_UPDATE_MODULES = [
  'page_heading_from_accepted_integrated_domain_knowledge',
  'opening_thesis_from_accepted_integrated_domain_knowledge',
  'body_sections_from_10_units_37_substructures',
  'public_copy_review_prompts_from_projection_boundary',
  'boundary_language_from_founder_receipt',
] as const satisfies readonly AxiomPublicSiteContentUpdateModule[];

export const FALCON_AXIOM_PUBLIC_SITE_UPDATE_DEFINITIONS = [
  {
    surface: 'reader_facing_top_home',
    falconPageRoleId: 'NS-01',
    falconPageRoleJa: 'トップページ',
    navLabelJa: 'トップ',
    falconContextLabelJa: 'NBLトップページ',
    eyebrowJa: '働きづらさを仕事条件の地図へ',
    leadJa:
      'サイト全体のコンセプトを一撃で示し、8つの課題、相談事例、設計ガイド、NBLレポート、ツールキット、障害種類別入口へ進めるトップページです。',
    problemJa:
      '診断名、障害の種類、配慮名、制度説明だけでは、本人、支援者、企業、制度のあいだで何を話せばよいかが見えにくい。',
    promiseJa: '働きづらさを人の問題で終わらせず、仕事と参加を設計する入口へ翻訳する。',
    notThisJa: '個別相談、法的・医療判断、診断名別の配慮判定は行いません。',
    primarySlug: 'scene-entry',
    primaryLabelJa: '8つの課題',
    secondarySlug: 'case-readings',
    secondaryLabelJa: '相談事例を見る',
    visual: {
      src: '/images/next-nbl-home-hero-image2-v1.png',
      alt: '働きづらさを仕事条件の地図へ変換し、8つの課題、相談事例、設計ガイド、NBLレポート、ツールキット、障害種類から見る入口へつなぐ図解',
    },
    inheritedFalconLayoutModules: [
      'public_shell_header_navigation',
      'hero_visual_with_action_pair',
      'problem_promise_not_this_context_strip',
      'home_reader_path_product_map',
      'progressive_context_disclosure',
      'surface_specific_content_body',
      'review_focus_boundary_panel',
      'site_boundary_footer',
    ],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'work_condition_window',
    falconPageRoleId: 'NS-09',
    falconPageRoleJa: '障害種類・疾病名から見る入口',
    navLabelJa: '障害種類から見る',
    falconContextLabelJa: '障害種類・疾病名から見る入口',
    eyebrowJa: '障害者雇用から、これからの職場設計へ',
    leadJa:
      '視覚、聴覚、肢体、内部、知的、精神、発達、高次脳機能障害、難病。障害種類から見える課題は、誰もが活躍できる仕事／参加設計の応用問題です。',
    problemJa:
      '支援者や企業担当者は、障害種類・疾病名から調べ始めることが多い。その入口で本人の問題だけに狭めると、仕事設計まで視界が広がらない。',
    promiseJa: '名前を入口として受け取りつつ、次に見る仕事条件と確認質問へ変換する。',
    notThisJa: '病名・障害名から支援策、就労可否、医学判断、法的判断を直接導きません。',
    primarySlug: 'case-readings',
    primaryLabelJa: '相談事例へ進む',
    secondarySlug: 'theory-method-trust',
    secondaryLabelJa: 'NBLの専門性',
    visual: {
      src: '/images/next-nbl-condition-window-hero-image2-v1.png',
      alt: '障害者雇用は例外対応ではなく、障害種類から見える課題を誰もが活躍できる仕事・参加設計へつなぐ図解',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'consultation_case_reading_collection',
    falconPageRoleId: 'NS-02',
    falconPageRoleJa: '相談の一言を、仕事条件の対話へ',
    navLabelJa: '相談事例',
    falconContextLabelJa: '相談の一言を、仕事条件の対話へ',
    eyebrowJa: '相談の一言から見立てを組み立てる',
    leadJa:
      'よくある相談を答え集にせず、一言の奥にある仕事、環境、支援、時間、評価の条件を一緒に確認していく見立てのプロセスとして読めるようにします。',
    problemJa:
      '相談は、本人、仕事、職場、支援、制度、時間、評価が絡み合い、人間だけでは見落としやすい。',
    promiseJa:
      'まとまっていない相談の一言をつぶさず、当初の見立て、一緒に確認したいこと、確認後に変わる支援計画の例へほどく。',
    notThisJa:
      '判定表ではありません。個別対応の正解、法的・医療・人事判断を出すものではありません。',
    primarySlug: 'work-design-views-guide',
    primaryLabelJa: '設計ガイドへ',
    secondarySlug: 'theory-method-trust',
    secondaryLabelJa: '理論を読む',
    visual: {
      src: '/images/next-nbl-work-design-map-visual-v1.webp',
      alt: '相談の一文を仕事条件へ分ける地図',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    falconPageRoleId: 'NS-03',
    falconPageRoleJa: '未来の仕事・社会参加設計ガイド',
    navLabelJa: '設計ガイド',
    falconContextLabelJa: '未来の仕事・社会参加設計ガイド',
    eyebrowJa: '未来の仕事・社会参加設計',
    leadJa:
      '障害者雇用や難病就労支援で蓄積されてきた知見を、人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計へ展開します。',
    problemJa:
      '大切な知見が、制度、症状、配慮、支援ノウハウに分かれてしまうと、企業や支援者が組織全体の仕事設計を変える見取り図になりにくい。',
    promiseJa:
      '障害者雇用や難病就労支援で見えてきた知見を、仕事・社会参加設計のマスタープランと状況レベルに再編集する。',
    notThisJa: '公式基準、配慮判定表、診断名別マニュアル、固定21視点として扱いません。',
    primarySlug: 'articles-social-questions',
    primaryLabelJa: 'NBLレポートへ広げる',
    secondarySlug: 'case-readings',
    secondaryLabelJa: '相談事例へ',
    visual: {
      src: '/images/next-nbl-future-design-21-view-map-v2.png',
      alt: '仕事設計の視点候補を示す未来地図',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES, 'situation_level_work_design_ladder'],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'theory_method_trust_page',
    falconPageRoleId: 'NS-07',
    falconPageRoleJa: 'NBLの専門性',
    navLabelJa: 'NBLの専門性',
    falconContextLabelJa: 'NBLの専門性',
    eyebrowJa: '読み方の専門知識と専門知識ネットワーク',
    leadJa:
      '専門情報をどう読み、どう言いすぎずに届けるかという第一層と、その読み方でまとめた仕事・社会参加の専門知識を、読める・学べる・使えるページ群へ展開します。',
    problemJa:
      '既存情報は多いのに、本人の事情、職務、制度、支援、評価、時間の関係が分断され、人間の認知負荷だけに乗りやすい。',
    promiseJa:
      'AIの読解力を、断定ではなく仮説づくりに使い、情報の偏り、反対の見方、まだ確認が必要なことを分けて扱う。',
    notThisJa:
      'AIが医学判断、法的判断、就労可否判断、合理的配慮妥当性判断を行うものではありません。',
    primarySlug: 'work-design-views-guide',
    primaryLabelJa: '設計ガイドを見る',
    secondarySlug: 'about-boundary',
    secondaryLabelJa: '運営境界へ',
    visual: {
      src: '/images/next-nbl-knowledge-network-theory-map-v2.webp',
      alt: '断片情報を知識ネットワークへ変換する図解',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'article_social_question_library',
    falconPageRoleId: 'NS-05',
    falconPageRoleJa: '働き方の問いをひらくNBLレポート',
    navLabelJa: 'NBLレポート',
    falconContextLabelJa: '働き方の問いをひらくNBLレポート',
    eyebrowJa: '社会の問いを読む',
    leadJa:
      'ニュース、SNS、制度、研究、研修現場で出てくる違和感を、賛否や感想で止めず、本人、仕事、環境、支援、時間、制度の関係として読み直します。',
    problemJa:
      '制度、研究、ニュース、SNSの言葉が、そのままでは現場の仕事設計や研修の問いへ変換されにくい。',
    promiseJa: '社会の違和感を、記事、図解、読後に話す問い、相談事例集や設計ガイドへの導線にする。',
    notThisJa:
      '個別相談への回答、現行制度、法令解釈、公式見解、統計評価をこのページだけで断定しません。',
    primarySlug: 'scene-entry',
    primaryLabelJa: '場面で見る',
    secondarySlug: 'work-design-views-guide',
    secondaryLabelJa: '設計ガイドへ',
    visual: {
      src: '/images/next-nbl-open-work-questions-article-hub-v1.webp',
      alt: '社会の問いを記事・図解・相談事例へ戻す図解',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES, 'three_depth_article_layout'],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    falconPageRoleId: 'NS-06',
    falconPageRoleJa: '認知補助ツールキット',
    navLabelJa: 'ツールキット',
    falconContextLabelJa: '認知補助ツールキット',
    eyebrowJa: '図解・4コマ・音楽・資料',
    leadJa:
      '長い説明や文書では伝わりにくいことを、選別済みの図解、4コマ、音楽、フォーラム資料として並べ、ひとりで読む時も会議や研修でも使える入口にします。',
    problemJa:
      '役立つ情報は多いのに、診断名、制度、体験、啓発、研修素材に分かれ、タテ割りやコミュニケーションの詰まりを越える道具になりにくい。',
    promiseJa:
      '複雑な仕事条件の見立てを、同じ素材を見ながら話せる図解・4コマ・音楽・教材の棚へ変換する。',
    notThisJa: '成果保証、個別相談、医学・法務・雇用判断には使いません。',
    primarySlug: 'case-readings',
    primaryLabelJa: '相談事例へ',
    secondarySlug: 'articles-social-questions',
    secondaryLabelJa: 'NBLレポートへ',
    visual: {
      src: '/images/next-nbl-cognitive-toolkit-hero-v3.webp',
      alt: '認知補助ツールキットの場面と図解',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES, 'progressive_context_disclosure'],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'about_operating_boundary_page',
    falconPageRoleId: 'NS-08',
    falconPageRoleJa: 'このサイトについて',
    navLabelJa: 'サイト情報',
    falconContextLabelJa: 'このサイトについて',
    eyebrowJa: 'Next Being Lab',
    leadJa:
      'Next Being Labの運営者、責任者、運営目的、問い合わせ先、免責事項、著作権の扱いを確認できます。',
    problemJa:
      'サイトの内容が充実していても、運営者、責任者、問い合わせ先、免責事項、著作権の扱いが見えなければ、読者は安心して利用できない。',
    promiseJa:
      'サイト情報として必要な運営・責任・連絡・権利・免責の情報を、必要最小限に整理して示す。',
    notThisJa:
      'このページは個別相談窓口、法的告知の完全版、プライバシーポリシー全文、利用規約全文ではありません。',
    primarySlug: 'home',
    primaryLabelJa: '入口へ戻る',
    secondarySlug: 'theory-method-trust',
    secondaryLabelJa: '方法を読む',
    visual: {
      src: '/images/next-nbl-work-logic-flow-v1.webp',
      alt: 'NBLの運営境界と仕事条件の読み順を示す図',
    },
    inheritedFalconLayoutModules: [...COMMON_LAYOUT_MODULES, 'full_boundary_explanation_zone'],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
  {
    surface: 'scene_entry_use_cases',
    falconPageRoleId: 'NS-04',
    falconPageRoleJa: '8つの課題',
    navLabelJa: '8つの課題',
    falconContextLabelJa: '8つの課題',
    eyebrowJa: '古くて新しい課題を4コマで見る',
    leadJa:
      '抽象的な説明に入る前に、昔から理念や制度では語られてきたのに解けなかった8つの課題を4コマで見て、何が数字・名前・制度・善意・検索結果に見え、どの仕事条件を共有すれば共通認識に進めるのかをつかみます。',
    problemJa:
      '障害者雇用や難病就労支援の重要課題は、本人、仕事、時間、情報、環境、支援、評価、制度が同時に絡むため、制度説明や普通の場面例だけでは認知負荷が高くなりやすい。',
    promiseJa:
      'セリフ入り4コマ、短い解説、確認ポイント、有益なユースケースを通して、古くて新しい課題をNBLの仕事条件地図へ読み替える入口にする。',
    notThisJa: '個別相談の回答や配慮判定ではなく、問題状況の読み方をつかむための入口です。',
    primarySlug: 'case-readings',
    primaryLabelJa: '相談事例へ進む',
    secondarySlug: 'toolkit-studio',
    secondaryLabelJa: 'ツールを見る',
    visual: {
      src: '/images/next-nbl-work-design-studio-storyboard-v1.webp',
      alt: '働きづらさの場面を4コマと仕事条件で読む storyboard',
    },
    inheritedFalconLayoutModules: [
      'public_shell_header_navigation',
      'hero_visual_with_action_pair',
      'scene_comic_use_case_panel',
      'surface_specific_content_body',
      'review_focus_boundary_panel',
      'site_boundary_footer',
    ],
    axiomContentUpdateModules: [...COMMON_UPDATE_MODULES],
  },
] as const satisfies readonly FalconAxiomPublicSiteUpdatePlanDefinition[];

function candidatePath(slug: string) {
  return `${AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE}/${slug}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function definitionForSurface(surface: AxiomNextNblSiteSurface) {
  const definition = FALCON_AXIOM_PUBLIC_SITE_UPDATE_DEFINITIONS.find(
    (candidate) => candidate.surface === surface,
  );
  if (!definition) {
    throw new Error(`falcon_axiom_public_site_update_definition_missing:${surface}`);
  }
  return definition;
}

export function buildFalconAxiomPublicSiteUpdatePlan(
  routeMap: AxiomReviewedKernelBackedCandidateRouteMap = buildAxiomReviewedKernelBackedCandidateRouteMap(),
): FalconAxiomPublicSiteUpdatePlan {
  const rows = routeMap.routes.map((route): FalconAxiomPublicSiteUpdatePlanRow => {
    const definition = definitionForSurface(route.surface);

    return {
      ...definition,
      rowId: `falcon_axiom_public_site_update:${route.surface}`,
      slug: route.slug,
      path: candidatePath(route.slug),
      updateMode:
        'replace_falcon_copy_with_axiom_kernel_backed_content_preserve_public_site_role_and_layout',
      falconUsePolicy:
        'falcon_final_site_role_layout_and_visual_rhythm_are_delivery_scaffold_not_axiom_core_truth',
      axiomContentSource:
        'founder_accepted_all_layer_integrated_domain_knowledge_page_body_projection',
      routeStatus: route.routeStatus,
      publicNavigationStatus: route.publicNavigationStatus,
      publicUseStatus: route.publicUseStatus,
      publicationStatus: route.publicationStatus,
    };
  });

  return {
    updatePlanId: `falcon_axiom_public_site_update_plan_from_${routeMap.routeMapId}`,
    objectType: 'falcon_axiom_public_site_update_plan',
    contractVersion: AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_VERSION,
    lane: 'Falcon Lab',
    status: 'falcon_final_site_scaffold_axiom_kernel_content_update_plan_ready',
    boundary: AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY,
    strengthensCore: [...AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_CORE_PROGRESS_CLASSES],
    routeBase: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
    sourceRouteMapId: routeMap.routeMapId,
    surfaceCount: 9,
    surfacesCovered: [...AXIOM_NEXT_NBL_SITE_SURFACES],
    rows,
    notNow: [
      'no_falcon_public_copy_as_axiom_core_truth',
      'no_actual_public_navigation',
      'no_public_approval_or_publication_execution',
      'no_source_support_validity_finality',
      'no_candidate_pattern_promotion',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
    ],
  };
}

export function getFalconAxiomPublicSiteUpdatePlanRowBySurface(
  surface: AxiomNextNblSiteSurface,
  plan: FalconAxiomPublicSiteUpdatePlan = buildFalconAxiomPublicSiteUpdatePlan(),
) {
  return plan.rows.find((row) => row.surface === surface) ?? null;
}

export function validateFalconAxiomPublicSiteUpdatePlan(
  plan: FalconAxiomPublicSiteUpdatePlan,
): FalconAxiomPublicSiteUpdatePlanValidation {
  const errors: string[] = [];
  const coveredSurfaces = unique(plan.rows.map((row) => row.surface));
  const coveredFalconRoles = unique(plan.rows.map((row) => row.falconPageRoleId));
  const sceneEntryRow = plan.rows.find((row) => row.surface === 'scene_entry_use_cases');
  const snsAsTopLevelPage = plan.rows.find(
    (row) =>
      row.navLabelJa.includes('SNS') ||
      row.falconPageRoleJa.includes('SNS') ||
      row.falconContextLabelJa.includes('SNS循環') ||
      row.falconContextLabelJa.includes('SNS circulation'),
  );

  pushIf(plan.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(plan.surfaceCount !== 9, errors, 'surface_count_must_be_9');
  pushIf(plan.rows.length !== 9, errors, 'row_count_must_be_9');
  pushIf(coveredSurfaces.length !== 9, errors, 'all_9_axiom_surfaces_must_be_covered');
  pushIf(coveredFalconRoles.length !== 9, errors, 'all_9_falcon_delivery_roles_must_be_unique');

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!coveredSurfaces.includes(surface), errors, `missing_surface:${surface}`);
  }

  pushIf(
    !sceneEntryRow ||
      sceneEntryRow.falconPageRoleId !== 'NS-04' ||
      !sceneEntryRow.inheritedFalconLayoutModules.includes('scene_comic_use_case_panel'),
    errors,
    'scene_entry_must_restore_falcon_ns04_with_scene_comic_use_case_panel',
  );
  pushIf(
    Boolean(snsAsTopLevelPage),
    errors,
    `sns_circulation_must_not_be_top_level_reader_page:${snsAsTopLevelPage?.surface ?? 'unknown'}`,
  );

  for (const row of plan.rows) {
    pushIf(!row.slug, errors, `missing_slug:${row.surface}`);
    pushIf(
      !row.path.startsWith(plan.routeBase),
      errors,
      `path_outside_public_candidate_base:${row.surface}`,
    );
    pushIf(
      row.falconUsePolicy !==
        'falcon_final_site_role_layout_and_visual_rhythm_are_delivery_scaffold_not_axiom_core_truth',
      errors,
      `falcon_use_policy_invalid:${row.surface}`,
    );
    pushIf(
      row.axiomContentSource !==
        'founder_accepted_all_layer_integrated_domain_knowledge_page_body_projection',
      errors,
      `axiom_content_source_invalid:${row.surface}`,
    );
    pushIf(
      !row.inheritedFalconLayoutModules.includes('hero_visual_with_action_pair'),
      errors,
      `hero_layout_not_preserved:${row.surface}`,
    );
    pushIf(
      !row.inheritedFalconLayoutModules.includes('problem_promise_not_this_context_strip') &&
        !row.inheritedFalconLayoutModules.includes('progressive_context_disclosure') &&
        !row.inheritedFalconLayoutModules.includes('scene_comic_use_case_panel') &&
        !row.inheritedFalconLayoutModules.includes('full_boundary_explanation_zone'),
      errors,
      `context_or_progressive_disclosure_not_declared:${row.surface}`,
    );
    pushIf(
      !row.axiomContentUpdateModules.includes('body_sections_from_10_units_37_substructures'),
      errors,
      `axiom_integrated_domain_body_not_declared:${row.surface}`,
    );
    pushIf(
      row.publicNavigationStatus !== 'not_public_navigation',
      errors,
      `public_navigation_status_must_remain_not_public:${row.surface}`,
    );
    pushIf(
      row.publicUseStatus !== 'not_public_approved',
      errors,
      `public_use_status_must_remain_not_approved:${row.surface}`,
    );
    pushIf(
      row.publicationStatus !== 'not_published',
      errors,
      `publication_status_must_remain_not_published:${row.surface}`,
    );
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'falcon_axiom_public_site_update_plan_valid'
        : 'falcon_axiom_public_site_update_plan_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY,
    strengthensCore: [...AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_CORE_PROGRESS_CLASSES],
  };
}
