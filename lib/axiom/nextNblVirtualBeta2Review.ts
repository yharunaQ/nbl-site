import {
  AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
  buildFalconAxiomPublicSiteUpdatePlan,
  type FalconAxiomPublicSiteUpdatePlanRow,
} from './falconAxiomPublicSiteUpdatePlan';
import {
  AXIOM_VIRTUAL_BETA_AGENTS,
  type AxiomVirtualBetaAgent,
  type AxiomVirtualBetaBusinessReview,
  type AxiomVirtualBetaFinding,
  type AxiomVirtualBetaPriorityImprovement,
  type AxiomVirtualBetaStakeholderGroup,
} from './nextNblVirtualBetaTest';

export const AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_VERSION = 'v1_2026_06_24' as const;

export const AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_BOUNDARY =
  'axiom_next_nbl_virtual_beta2_is_internal_post_polish_pre_public_review_not_public_approval_publication_runtime_or_learning_update' as const;

export type AxiomVirtualBeta2Readiness =
  | 'near_candidate_ready'
  | 'needs_targeted_polish'
  | 'needs_visual_and_copy_qa'
  | 'hold_before_public_review';

export type AxiomVirtualBeta2PageReview = {
  pageSlug: string;
  pagePath: string;
  navLabelJa: string;
  pageRoleJa: string;
  beta2FocusJa: string;
  readiness: AxiomVirtualBeta2Readiness;
  reviewSummaryJa: string;
  pageStrengthJa: string;
  remainingRiskJa: string;
  betaFindings: AxiomVirtualBetaFinding[];
  finalQaChecksJa: string[];
  recommendedNextActionJa: string;
};

export type AxiomVirtualBeta2CrossSiteReview = {
  reviewId: string;
  titleJa: string;
  judgmentJa: string;
  strengthJa: string;
  riskJa: string;
  actionJa: string;
  affectedPageSlugs: string[];
};

export type AxiomNextNblVirtualBeta2Run = {
  runId: string;
  objectType: 'axiom_next_nbl_virtual_beta2_review_run';
  version: typeof AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_VERSION;
  lane: 'Falcon Lab';
  status: 'internal_virtual_beta2_review_completed_not_public_approval';
  boundary: typeof AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_BOUNDARY;
  candidateRouteBase: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE;
  agentCount: number;
  pageCount: 9;
  findingCount: number;
  agents: readonly AxiomVirtualBetaAgent[];
  pageReviews: readonly AxiomVirtualBeta2PageReview[];
  crossSiteReviews: readonly AxiomVirtualBeta2CrossSiteReview[];
  businessReviews: readonly AxiomVirtualBetaBusinessReview[];
  priorityImprovements: readonly AxiomVirtualBetaPriorityImprovement[];
  executiveSummaryJa: readonly string[];
  notNow: readonly string[];
};

export type AxiomNextNblVirtualBeta2RunValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_next_nbl_virtual_beta2_review_run_valid'
    | 'axiom_next_nbl_virtual_beta2_review_run_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_BOUNDARY;
};

const PAGE_REVIEW_BLUEPRINTS: Record<
  string,
  Omit<AxiomVirtualBeta2PageReview, 'pageSlug' | 'pagePath' | 'navLabelJa' | 'pageRoleJa'>
> = {
  home: {
    beta2FocusJa: '初見3秒理解、入口選択、事業活用導線の自然さ。',
    readiness: 'needs_targeted_polish',
    reviewSummaryJa:
      'トップは、次期NBLサイト全体の役割をかなり伝えられる段階にある。残る焦点は、理念説明を増やさず、読者が自分の入口を即座に選べるかである。',
    pageStrengthJa: '「働きづらさを仕事条件の地図へ」という中心コピーと6つの入口は、サイト全体の地図として機能している。',
    remainingRiskJa:
      '入口が多い分、初見読者が「まず自分はどれか」で少し迷う可能性がある。事業活用導線も、個別相談受付と誤読されない整理が必要。',
    betaFindings: [
      {
        findingId: 'beta2_home_entry_choice_load',
        agentIds: ['media_sns_reader', 'nbl_product_editor'],
        severity: 'medium',
        lensJa: '初見の入口選択',
        whatWorkedJa: 'トップは全ページへの入口を持ち、サイトの広がりを伝えている。',
        issueJa: '入口の数が多く、SNSや紹介から来た読者が最初に押す場所を迷う可能性がある。',
        improvementJa: '入口を「見たい」「相談したい」「設計したい」「読みたい」「使いたい」の行動語でさらに束ねる。',
      },
      {
        findingId: 'beta2_home_business_contact_boundary',
        agentIds: ['nbl_partnership_lead', 'nbl_trust_ops'],
        severity: 'medium',
        lensJa: '事業活用導線',
        whatWorkedJa: '研修、教材、共同検討、講演、調査研究の入口として使える内容量がある。',
        issueJa: '問い合わせ導線が個別相談受付に見えると、運営境界が崩れる。',
        improvementJa: 'トップ下部とサイト情報で、活用相談は個別ケース判断ではなく研修・共同検討・資料活用であることを短く示す。',
      },
    ],
    finalQaChecksJa: ['Hero図と入口文言の一致', 'スマホで入口が一画面内に読みやすいか', '個別相談受付に見えないか'],
    recommendedNextActionJa: '入口カードの行動語をさらに磨き、サイト情報への活用導線と整合させる。',
  },
  'scene-entry': {
    beta2FocusJa: '8つの古くて新しい課題が、普通の職場場面ではなくNBLの挑戦課題として見えるか。',
    readiness: 'needs_visual_and_copy_qa',
    reviewSummaryJa:
      '8つの課題は、Axiom/NBLが解くべき認知負荷の高い社会課題として再定義されている。残る焦点は、4コマとHTML説明の対応、課題名の一撃理解、下部導線の最新化である。',
    pageStrengthJa: '見える数字、名前、健康時間、情報分断、制度、上司依存、検索/SNS/AI、学びの循環という整理は強い。',
    remainingRiskJa:
      '4コマ画像内の日本語、課題カード、説明文のどこかがズレると「よくある仕事場面集」に戻ってしまう。',
    betaFindings: [
      {
        findingId: 'beta2_scene_issue_not_ordinary_scene',
        agentIds: ['policy_research_admin', 'frontline_manager', 'media_sns_reader'],
        severity: 'high',
        lensJa: '課題定義',
        whatWorkedJa: '8課題は、古くから語られてきたが解けなかった構造問題に焦点を戻している。',
        issueJa: '各課題の説明が具体場面に寄りすぎると、普通の職場あるあるに見える。',
        improvementJa: '各課題に「なぜ解けにくかったか」を一文で置き、仕事条件の共通地図へ戻す。',
      },
      {
        findingId: 'beta2_scene_comic_qa',
        agentIds: ['worker_neurodivergent_mental_health', 'worker_visual_access', 'nbl_product_editor'],
        severity: 'medium',
        lensJa: '4コマ・代替情報',
        whatWorkedJa: 'Image-2.0の4コマは、直感的理解の入口として重要。',
        issueJa: '画像内テキストやaltが本文とズレると、認知負荷軽減ではなく負荷増になる。',
        improvementJa: '8枚すべてで、画像内テキスト、alt、HTML説明の三点対応表を確認する。',
      },
    ],
    finalQaChecksJa: ['8課題名とHero図の一致', '4コマ画像内日本語の読みやすさ', '次に進む導線のラベル更新'],
    recommendedNextActionJa: '8課題の画像/alt/説明対応表を作り、ズレだけを修正する。',
  },
  'case-readings': {
    beta2FocusJa: '相談の一言をつぶさず、アセスメントの流れとして読めるか。',
    readiness: 'near_candidate_ready',
    reviewSummaryJa:
      '相談事例は、役割、一言、複数チェック、当初見立て、確認問い、支援計画分岐へ進む構造が見える。ベータ2では公開候補としてかなり近い。',
    pageStrengthJa:
      '「アセスメントの流れ」追加により、答えの一覧ではなく、対話で見立てを深めるページとして読める。',
    remainingRiskJa:
      '右側パネルが情報量豊富なため、スマホでは長く感じる可能性がある。支援計画例が個別助言に見えない境界も維持したい。',
    betaFindings: [
      {
        findingId: 'beta2_case_flow_visible',
        agentIds: ['employment_support_provider', 'family_peer_support'],
        severity: 'low',
        lensJa: 'アセスメントの筋',
        whatWorkedJa: '一言を残し、条件に分け、当初見立て、確認、計画分岐へ進む流れが明確になった。',
        issueJa: '情報量が多く、初見では右側の読み順がやや長く感じられる可能性がある。',
        improvementJa: 'スマホ表示で、流れ、当初見立て、確認問いの見出し間隔を確認する。',
      },
      {
        findingId: 'beta2_case_no_individual_advice',
        agentIds: ['nbl_trust_ops', 'frontline_manager'],
        severity: 'medium',
        lensJa: '個別判断境界',
        whatWorkedJa: '支援計画例は確認条件に対応しており、即断を避けている。',
        issueJa: '「支援計画例」という言葉が強く読まれると、個別ケースの推奨に見える可能性がある。',
        improvementJa: '必要なら「例」「確認後に変わりうる案」のニュアンスを見出しに残す。',
      },
    ],
    finalQaChecksJa: ['複数チェック時の文言重複', 'スマホで右側結果が読めるか', '支援計画例が断定助言に見えないか'],
    recommendedNextActionJa: '表示確認だけで大きな再設計は不要。スマホ読み順と境界語を最終QAする。',
  },
  'work-design-views-guide': {
    beta2FocusJa: '未来の仕事・社会参加設計のマスタープランとして一撃で見えるか。',
    readiness: 'needs_visual_and_copy_qa',
    reviewSummaryJa:
      '設計ガイドは、Axiom統合知識を最も直接的に示す中核ページとして成立している。ベータ2の主課題は、ページの長さと図解量に対し、全体地図、5領域、10カードの読み順を最後まで保つこと。',
    pageStrengthJa: '5領域、具体設計項目、視点転換、状況レベル4コマの組み合わせは、実用的なガイドとして強い。',
    remainingRiskJa:
      '図解が多く、似た構造のカードが続くため、セクション境界が弱いと読み疲れが起きる。Image-2.0図解とHTML文言の一致確認が必要。',
    betaFindings: [
      {
        findingId: 'beta2_guide_master_plan_opening',
        agentIds: ['employer_hr_dei', 'policy_research_admin', 'nbl_product_editor'],
        severity: 'medium',
        lensJa: '冒頭のマスタープラン性',
        whatWorkedJa: '狭い標準的職業人像から、多様性を前提にした仕事・参加設計へ広げる導入は正しい。',
        issueJa: '導入が説明過多になると、マスタープランの迫力より解説感が出る。',
        improvementJa: '冒頭は大きな図と短文に寄せ、詳細は5領域以降へ送る。',
      },
      {
        findingId: 'beta2_guide_visual_sequence',
        agentIds: ['frontline_manager', 'worker_neurodivergent_mental_health'],
        severity: 'high',
        lensJa: '図解の読み順',
        whatWorkedJa: '具体設計項目と状況レベル4コマを連続させた構造は分かりやすい。',
        issueJa: '図解1と図解2が似て見える箇所では、見出しと区切りが弱いと読み迷う。',
        improvementJa: '各カードで図解1/図解2/視点転換/設計ポイントの見出し視認性を確認する。',
      },
    ],
    finalQaChecksJa: ['5領域アンカーの動作', '10カードの図解/本文一致', 'スマホでカード境界が見えるか'],
    recommendedNextActionJa: '全10カードのスクリーンショットQAを行い、図解と見出しのズレだけを直す。',
  },
  'articles-social-questions': {
    beta2FocusJa: 'NBLレポートとして、本格記事・索引・図解対応が公開候補品質に近いか。',
    readiness: 'needs_visual_and_copy_qa',
    reviewSummaryJa:
      'NBLレポートは、社会の問いとNBL専門知識をつなぐ母艦として方向は合っている。最大の残リスクは、記事本文とインフォグラフィックの不一致、および記事量に対する探しやすさである。',
    pageStrengthJa: 'NBLレポートという名称と編集地図は、記事集より社会対話プラットフォームとしての意味が出ている。',
    remainingRiskJa:
      '36本規模の記事は、目次・検索・索引・図解一致が弱いと読まれない。抽象的な図解はページ価値を落とす。',
    betaFindings: [
      {
        findingId: 'beta2_report_article_findability',
        agentIds: ['media_sns_reader', 'policy_research_admin'],
        severity: 'high',
        lensJa: '記事探索',
        whatWorkedJa: 'テーマ、立場、仕事条件から探す方向は合っている。',
        issueJa: '記事量が多いため、索引と本文リーダーの位置関係が少しでも分かりにくいと離脱する。',
        improvementJa: '記事選択、検索、編集地図、本文リーダーの順序をスマホとPCで確認する。',
      },
      {
        findingId: 'beta2_report_visual_match',
        agentIds: ['nbl_product_editor', 'nbl_social_growth'],
        severity: 'high',
        lensJa: '図解一致',
        whatWorkedJa: '本文前に横長図解を置く形式は、記事を一目で理解するために有効。',
        issueJa: '記事ごとの中心論点と図解が対応していないものが残ると、信頼感を損なう。',
        improvementJa: '各記事について、図解が「読者問い・仕事条件・設計論点」を表しているか対応表で確認する。',
      },
    ],
    finalQaChecksJa: ['記事検索/索引の使いやすさ', '画像拡大モーダルの戻り挙動', '記事ごとの図解一致'],
    recommendedNextActionJa: 'NBLレポートは、最終公開前に図解対応表と記事索引QAを別スライスで行う。',
  },
  'toolkit-studio': {
    beta2FocusJa: '素材棚が他ページへのリンク集ではなく、使う場面別の実用棚になっているか。',
    readiness: 'near_candidate_ready',
    reviewSummaryJa:
      'ツールキットは、選別図解、4コマ、音楽、フォーラム、チェックリストに加え、用途別パッケージが入り、実験的素材棚としての意味が強くなった。',
    pageStrengthJa:
      '媒体別の棚と、初回相談・管理職研修・健康時間・フォーラム後の用途別パッケージが組み合わさり、使い方が見える。',
    remainingRiskJa:
      '57枚の図解は価値がある一方で、画像量が多いため読み込み、カテゴリ理解、著作権・利用範囲の確認が必要。',
    betaFindings: [
      {
        findingId: 'beta2_toolkit_use_packages',
        agentIds: ['employment_support_provider', 'frontline_manager', 'nbl_social_growth'],
        severity: 'low',
        lensJa: '使う場面',
        whatWorkedJa: '用途別パッケージにより、素材が会議・研修・相談へ接続された。',
        issueJa: '各パッケージのリンク先が多くなると、またリンク集に見える可能性がある。',
        improvementJa: '各パッケージの到達状態を短く保ち、リンクは3つ程度に抑える。',
      },
      {
        findingId: 'beta2_toolkit_asset_governance',
        agentIds: ['nbl_trust_ops', 'media_sns_reader'],
        severity: 'medium',
        lensJa: '素材利用境界',
        whatWorkedJa: 'lightboxと使いどころ説明は素材棚として有効。',
        issueJa: '図解や音楽の利用範囲、転載、研修利用の境界が曖昧だと使いたい人が迷う。',
        improvementJa: 'サイト情報の著作権・活用歓迎文言とツールキットの境界を対応させる。',
      },
    ],
    finalQaChecksJa: ['57画像の読み込み/拡大', '用途別パッケージのリンク', '著作権・利用範囲との整合'],
    recommendedNextActionJa: '大きな構造変更は不要。素材利用境界と画像QAを仕上げる。',
  },
  'work-condition-window': {
    beta2FocusJa: '障害種類から知りたい読者を受け止め、職場設計へ自然に進めるか。',
    readiness: 'near_candidate_ready',
    reviewSummaryJa:
      '障害種類から見るページは、9カテゴリの順序、初心者向け説明、職場設計への橋渡しが入り、公開候補としてかなり読みやすくなった。',
    pageStrengthJa:
      '「まず知っておきたいこと」から始まるため、診断名別の答え表ではなく、読者の知りたい気持ちを受け止める入口になっている。',
    remainingRiskJa:
      '障害種類ごとの説明は、過度に一般化すると偏見につながる。各カテゴリで「人によって違う」「仕事条件で変わる」ニュアンスを保つ必要がある。',
    betaFindings: [
      {
        findingId: 'beta2_condition_beginner_entry',
        agentIds: ['worker_visual_access', 'worker_hearing_access', 'family_peer_support'],
        severity: 'low',
        lensJa: '初心者入口',
        whatWorkedJa: '各カード冒頭が、障害について知りたい読者の入口を受け止めるようになった。',
        issueJa: '説明が長くなると、カテゴリ選択から本文理解までの距離が伸びる。',
        improvementJa: '各カード冒頭の2段は維持しつつ、長すぎる説明があれば圧縮する。',
      },
      {
        findingId: 'beta2_condition_no_diagnosis_lookup',
        agentIds: ['employer_hr_dei', 'nbl_trust_ops'],
        severity: 'medium',
        lensJa: '診断名別答え表の回避',
        whatWorkedJa: '職場設計で見ることにより、障害者雇用を例外対応ではなく多様性対応の応用として示せている。',
        issueJa: '「障害種類から見る」という入口自体は、配慮答え表を期待させる可能性がある。',
        improvementJa: 'Heroとカテゴリカードで、障害名は入口であり、最終的には仕事条件を見ることを保つ。',
      },
    ],
    finalQaChecksJa: ['9カテゴリ冒頭説明の長さ', '診断名別断定の有無', 'カテゴリナビのスマホ表示'],
    recommendedNextActionJa: 'カテゴリ説明の細部QAだけでよい。構造変更は不要。',
  },
  'theory-method-trust': {
    beta2FocusJa: 'NBLの専門性が、内部用語ではなく読者向けに深みと凄みを持って伝わるか。',
    readiness: 'needs_targeted_polish',
    reviewSummaryJa:
      'NBLの専門性ページは、読み方の専門知識と、そこから作る専門知識ネットワークの二層を説明する重要ページである。残る課題は、内部用語を完全に抜き、情報源と個別相談情報の境界を誤解なく示すこと。',
    pageStrengthJa: '単純な検索・要約ではなく、偏りを含む情報を仮説として読み、言いすぎを止める専門性を示せている。',
    remainingRiskJa:
      '情報源の説明が具体化するほど、現在性・source validity・個別相談情報の扱いを誤解されるリスクが出る。',
    betaFindings: [
      {
        findingId: 'beta2_method_layer1_public_language',
        agentIds: ['policy_research_admin', 'nbl_trust_ops'],
        severity: 'medium',
        lensJa: '読み方の専門性',
        whatWorkedJa: 'Layer 1を根本的専門性として示す方向は強い。',
        issueJa: '内部用語が少しでも残ると、公開ページではなく開発説明に見える。',
        improvementJa: '「仮説として読む」「反対仮説を残す」「足りない文脈を聞く」「言いすぎを止める」に統一する。',
      },
      {
        findingId: 'beta2_method_source_boundary',
        agentIds: ['medical_welfare_education_connector', 'nbl_trust_ops'],
        severity: 'high',
        lensJa: '情報源と相談情報の境界',
        whatWorkedJa: '国内外の調査研究・実務資料・技術支援情報を読み込む説明は信頼形成に役立つ。',
        issueJa: '個別相談情報を知識作成材料にしていると読まれると危険。',
        improvementJa: '知識を作る材料と、知識を使う場面を分け、相談事例は下流の提供面であることを再確認する。',
      },
    ],
    finalQaChecksJa: ['内部語の残存', '情報源説明の現在性断定', '個別相談情報を材料に見せない図解'],
    recommendedNextActionJa: '公開前に本文内語彙と知識ネットワーク図の最終用語QAを行う。',
  },
  'about-boundary': {
    beta2FocusJa: '運営情報、責任者、問い合わせ、免責、著作権、SNS導線が必要最小限で安定しているか。',
    readiness: 'near_candidate_ready',
    reviewSummaryJa:
      'サイト情報は、コンセプト説明を繰り返さず、運営・責任・問い合わせ・免責・著作権・SNS導線に集中している。公開前QAでは表示安定性と権利文言が焦点。',
    pageStrengthJa: '運営主体、Researchmapリンク、問い合わせ境界、著作権と共有歓迎のバランスが見える。',
    remainingRiskJa:
      '著作権文言は、紹介・引用歓迎と無断転載禁止のバランスが微妙。標準ライセンス相当の整理が必要かもしれない。',
    betaFindings: [
      {
        findingId: 'beta2_about_stable_utility_page',
        agentIds: ['nbl_trust_ops', 'nbl_partnership_lead'],
        severity: 'low',
        lensJa: '運営情報',
        whatWorkedJa: 'トップや専門性ページと役割が分かれ、必要情報に集中している。',
        issueJa: '旧ページのちらつきやキャッシュ挙動が再発すると信頼を損なう。',
        improvementJa: 'no-storeと内部候補ルートの挙動を最後に再確認する。',
      },
      {
        findingId: 'beta2_about_copyright_and_sharing',
        agentIds: ['media_sns_reader', 'nbl_social_growth'],
        severity: 'medium',
        lensJa: '著作権と共有',
        whatWorkedJa: '盗用・無断転載は禁止しつつ、紹介やクレジット付き活用を歓迎する方向は良い。',
        issueJa: '商用利用、改変、大量転載、研修利用の扱いが曖昧だと問い合わせ前に迷う。',
        improvementJa: '「紹介・引用歓迎」「無断転載禁止」「研修・商用・改変は問い合わせ」の三分法で短く整理する。',
      },
    ],
    finalQaChecksJa: ['Researchmapリンク', '問い合わせ先と範囲', '著作権/引用/共有/SNS導線'],
    recommendedNextActionJa: '表示安定性と権利文言の最終QAでよい。大きな改修は不要。',
  },
};

const CROSS_SITE_REVIEWS: readonly AxiomVirtualBeta2CrossSiteReview[] = [
  {
    reviewId: 'beta2_cross_public_language_and_internal_terms',
    titleJa: '公開語彙と内部語の最終掃除',
    judgmentJa: '全体として公開ページらしくなったが、内部由来の語彙が一語でも残ると完成感を落とす。',
    strengthJa: 'ページ名、ナビ名、Heroコピーはかなり読者向けに寄っている。',
    riskJa: 'Axiom、kernel、runtime、missing contextなどが本文中に残ると、専門性ではなく開発中メモに見える。',
    actionJa: '全9ページの本文テキストに対して内部語スキャンを行い、必要箇所を公開語へ置換する。',
    affectedPageSlugs: [
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ],
  },
  {
    reviewId: 'beta2_cross_visual_content_alignment',
    titleJa: 'Image-2.0図解と本文の一致',
    judgmentJa: 'Axiom版サイトの強みは図解・4コマ・音楽・素材棚にあるため、画像不一致は最優先で潰す必要がある。',
    strengthJa: 'Image-2.0の日本語入り図解により、Falcon版より直感的に伝わる部分が増えた。',
    riskJa: '記事や設計ガイドで画像が抽象的または本文とズレると、右脳的理解支援ではなく違和感になる。',
    actionJa: '主要画像について、alt、画像内日本語、直前本文、直後本文の四点対応を確認する。',
    affectedPageSlugs: [
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
    ],
  },
  {
    reviewId: 'beta2_cross_mobile_density',
    titleJa: 'スマホでの長大ページ密度',
    judgmentJa: '内容は十分厚い。次の品質差は、スマホで読み進められるかに出る。',
    strengthJa: '各ページに見出し、カード、画像、リンクがあり、PCでは十分レビュー可能。',
    riskJa: '設計ガイド、NBLレポート、ツールキットは長大なため、見出し階層や画像高さが崩れると読者が迷う。',
    actionJa: '390px幅で、Hero、最初の入口、主要カード、画像、下部導線のスクリーンショットQAを行う。',
    affectedPageSlugs: ['work-design-views-guide', 'articles-social-questions', 'toolkit-studio', 'case-readings'],
  },
  {
    reviewId: 'beta2_cross_public_boundary',
    titleJa: '個別相談・合理的配慮判定に見えない境界',
    judgmentJa: '全体として境界は保たれているが、相談事例と障害種類ページは誤解されやすい。',
    strengthJa: '確認問い、仮説、仕事条件、境界ページの分離は機能している。',
    riskJa: '支援計画例、障害種類、合理的配慮、診断名が並ぶ箇所は、個別答え表と誤読されやすい。',
    actionJa: '該当ページの見出しと境界文で「個別判断ではなく確認の入口」を保つ。',
    affectedPageSlugs: ['case-readings', 'work-condition-window', 'theory-method-trust', 'about-boundary'],
  },
];

const BUSINESS_REVIEWS: readonly AxiomVirtualBetaBusinessReview[] = [
  {
    businessReviewId: 'beta2_business_public_trust',
    titleJa: '公開信頼の母艦',
    valueHypothesisJa:
      '次期NBLサイトは、NBLの専門性、扱う課題、扱わない境界を社会に示す公開信頼の母艦になる。',
    useCasesJa: ['企業・行政・支援機関への初回共有', '講演・研修前の前提資料', 'SNSから深い読解へ戻す受け皿'],
    risksJa: ['個別相談窓口と誤解される', '画像と本文の不一致で専門性が疑われる'],
    nextOperatingMovesJa: ['公開前QAを文書化する', '問い合わせ前に読む代表ページをサイト情報へ置く'],
  },
  {
    businessReviewId: 'beta2_business_training_packages',
    titleJa: '研修・教材パッケージへの展開',
    valueHypothesisJa:
      '設計ガイド、相談事例、ツールキットを組み合わせることで、企業研修・支援者研修・行政研修の教材パッケージに展開できる。',
    useCasesJa: ['管理職研修', '支援者のアセスメント研修', '政策・研究会の共通フレーム提示'],
    risksJa: ['研修提供と個別判断の境界が曖昧になる', '素材利用ルールが曖昧だと活用されにくい'],
    nextOperatingMovesJa: ['ツールキット用途別パッケージを研修メニュー案へ接続する', '著作権・利用条件をサイト情報と整合させる'],
  },
  {
    businessReviewId: 'beta2_business_editorial_social_loop',
    titleJa: 'NBLレポートとSNS社会対話',
    valueHypothesisJa:
      'NBLレポートは、社会の問いを記事・図解・相談事例・設計ガイドへ戻す編集循環の中心になりうる。',
    useCasesJa: ['ニュース/SNSからの論点整理', 'フォーラム後の追加読解', '記事から研修・図解への展開'],
    risksJa: ['反応数最適化に見える', '記事が短い独り言に戻る', '図解不一致で共有されにくい'],
    nextOperatingMovesJa: ['記事ごとの図解対応表を作る', 'SNS反応は改善候補メモに止め、学習更新と分ける'],
  },
];

const PRIORITY_IMPROVEMENTS: readonly AxiomVirtualBetaPriorityImprovement[] = [
  {
    improvementId: 'beta2_p0_visual_content_alt_matrix',
    severity: 'high',
    titleJa: '主要画像の本文一致・alt・スマホ表示QA',
    affectedPageSlugs: [
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
    ],
    ownerLensJa: '編集・アクセシビリティ・視覚情報アクセス',
    actionJa: '主要Hero、4コマ、記事図解、設計ガイド図解、ツールキット画像のalt/本文/画像内日本語を対応表で点検する。',
    whyNowJa: 'Axiom版の価値は右脳的理解支援にあるため、画像不一致は公開候補品質を直接損なう。',
  },
  {
    improvementId: 'beta2_p0_boundary_and_internal_language_sweep',
    severity: 'high',
    titleJa: '内部語・個別判断誤認・公開境界の横断スキャン',
    affectedPageSlugs: [
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ],
    ownerLensJa: '信頼運営・公開コピー',
    actionJa: '内部語、個別相談受付に見える文言、合理的配慮判定に見える文言を全ページでスキャンする。',
    whyNowJa: '内容が厚くなった今、公開前の信頼を損なう最大リスクは意味ではなく境界の見え方に移った。',
  },
  {
    improvementId: 'beta2_p1_mobile_density_screenshots',
    severity: 'medium',
    titleJa: '長大ページのモバイル密度確認',
    affectedPageSlugs: ['work-design-views-guide', 'articles-social-questions', 'toolkit-studio', 'case-readings'],
    ownerLensJa: 'UX・読者負荷',
    actionJa: '390px幅でHero、入口、主要カード、画像、下部導線のスクリーンショットを取り、切れ・重複・見出し迷子を修正する。',
    whyNowJa: '公開候補の内容は厚いので、スマホで読めないと実利用に届かない。',
  },
  {
    improvementId: 'beta2_p1_report_infographic_article_match',
    severity: 'medium',
    titleJa: 'NBLレポートの記事別インフォグラフィック一致確認',
    affectedPageSlugs: ['articles-social-questions'],
    ownerLensJa: 'NBL編集・SNS社会対話',
    actionJa: '記事ごとに読者問い、仕事条件、設計論点、図解の一致を確認し、ズレる画像はImage-2.0で差し替え候補にする。',
    whyNowJa: '記事ページは量が大きく、図解不一致の違和感が最も目立ちやすい。',
  },
  {
    improvementId: 'beta2_p1_rights_and_reuse_language',
    severity: 'medium',
    titleJa: '素材利用・引用・転載・研修利用の権利文言整理',
    affectedPageSlugs: ['toolkit-studio', 'about-boundary', 'articles-social-questions'],
    ownerLensJa: '信頼運営・事業活用',
    actionJa: '紹介・引用歓迎、無断転載禁止、研修/商用/改変は問い合わせ、という三分法をサイト情報とツールキットで揃える。',
    whyNowJa: '素材棚が充実したため、使いたい読者ほど利用ルールを確認したくなる。',
  },
  {
    improvementId: 'beta2_p2_release_candidate_packet',
    severity: 'low',
    titleJa: '公開候補レビュー用の最終パケット作成',
    affectedPageSlugs: [
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ],
    ownerLensJa: 'Founder review preparation',
    actionJa: 'ベータ2修正後に、ページ一覧、未承認境界、残リスク、公開判断で見る点を1枚にまとめる。',
    whyNowJa: '次の段階は新規構築ではなく、公開判断前のレビュー準備へ移るため。',
  },
];

function findBlueprint(row: FalconAxiomPublicSiteUpdatePlanRow) {
  const blueprint = PAGE_REVIEW_BLUEPRINTS[row.slug];
  if (!blueprint) {
    throw new Error(`virtual_beta2_page_review_blueprint_missing:${row.slug}`);
  }
  return blueprint;
}

function buildPageReview(row: FalconAxiomPublicSiteUpdatePlanRow): AxiomVirtualBeta2PageReview {
  return {
    pageSlug: row.slug,
    pagePath: row.path,
    navLabelJa: row.navLabelJa,
    pageRoleJa: row.falconPageRoleJa,
    ...findBlueprint(row),
  };
}

export function buildAxiomNextNblVirtualBeta2Run(): AxiomNextNblVirtualBeta2Run {
  const plan = buildFalconAxiomPublicSiteUpdatePlan();
  const pageReviews = plan.rows.map((row) => buildPageReview(row));
  const findingCount =
    pageReviews.reduce((sum, page) => sum + page.betaFindings.length, 0) +
    CROSS_SITE_REVIEWS.length;

  return {
    runId: `axiom_next_nbl_virtual_beta2_review:${AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_VERSION}`,
    objectType: 'axiom_next_nbl_virtual_beta2_review_run',
    version: AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_VERSION,
    lane: 'Falcon Lab',
    status: 'internal_virtual_beta2_review_completed_not_public_approval',
    boundary: AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_BOUNDARY,
    candidateRouteBase: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
    agentCount: AXIOM_VIRTUAL_BETA_AGENTS.length,
    pageCount: 9,
    findingCount,
    agents: AXIOM_VIRTUAL_BETA_AGENTS,
    pageReviews,
    crossSiteReviews: CROSS_SITE_REVIEWS,
    businessReviews: BUSINESS_REVIEWS,
    priorityImprovements: PRIORITY_IMPROVEMENTS,
    executiveSummaryJa: [
      'ベータ2では、9ページは公開候補として一巡しており、残る中心課題は新規構築ではなく公開前QAである。',
      '最優先は、Image-2.0図解と本文の一致、内部語と個別判断誤認の除去、スマホでの長大ページ密度確認である。',
      '事業視点では、NBLサイトは営業ページではなく、研修、共同検討、レポート、SNS社会対話、素材活用を支える公開信頼の母艦として使うのが自然である。',
    ],
    notNow: [
      'no_public_approval',
      'no_publication_execution',
      'no_actual_public_navigation_change',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_source_support_validity_finality',
      'no_candidate_pattern_promotion',
      'no_individual_consultation_or_case_judgment',
      'no_personal_data_collection_or_feedback_form_activation',
      'no_learning_update_from_virtual_beta2',
    ],
  };
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

export function validateAxiomNextNblVirtualBeta2Run(
  run: AxiomNextNblVirtualBeta2Run,
): AxiomNextNblVirtualBeta2RunValidation {
  const errors: string[] = [];
  const plan = buildFalconAxiomPublicSiteUpdatePlan();
  const expectedSlugs = plan.rows.map((row) => row.slug);
  const reviewedSlugs = run.pageReviews.map((review) => review.pageSlug);
  const agentIds = new Set(run.agents.map((agent) => agent.agentId));
  const stakeholderGroups = new Set(run.agents.map((agent) => agent.stakeholderGroup));
  const findingAgentIds = run.pageReviews.flatMap((review) =>
    review.betaFindings.flatMap((finding) => finding.agentIds),
  );
  const readinessValues = new Set(run.pageReviews.map((review) => review.readiness));

  pushIf(
    run.objectType !== 'axiom_next_nbl_virtual_beta2_review_run',
    errors,
    'object_type_must_match',
  );
  pushIf(run.version !== AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_VERSION, errors, 'version_must_match');
  pushIf(run.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    run.status !== 'internal_virtual_beta2_review_completed_not_public_approval',
    errors,
    'status_must_not_be_public_approval',
  );
  pushIf(
    run.boundary !== AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_BOUNDARY,
    errors,
    'boundary_must_remain_internal_virtual_beta2',
  );
  pushIf(run.candidateRouteBase !== AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE, errors, 'candidate_route_base_must_match');
  pushIf(run.pageCount !== 9, errors, 'page_count_must_be_9');
  pushIf(run.pageReviews.length !== 9, errors, 'must_review_all_9_pages');
  pushIf(run.agentCount !== run.agents.length, errors, 'agent_count_must_match_agents');
  pushIf(run.agents.length < 12, errors, 'must_have_broad_virtual_beta_agent_coverage');
  pushIf(run.crossSiteReviews.length < 4, errors, 'must_have_cross_site_review_coverage');
  pushIf(run.businessReviews.length < 3, errors, 'must_have_business_team_review_coverage');
  pushIf(run.priorityImprovements.length < 5, errors, 'must_have_actionable_improvement_queue');
  pushIf(
    !readinessValues.has('near_candidate_ready') ||
      !readinessValues.has('needs_visual_and_copy_qa') ||
      !readinessValues.has('needs_targeted_polish'),
    errors,
    'must_have_mixed_readiness_assessment',
  );

  for (const slug of expectedSlugs) {
    pushIf(!reviewedSlugs.includes(slug), errors, `missing_page_review:${slug}`);
  }

  for (const review of run.pageReviews) {
    pushIf(
      review.betaFindings.length < 2,
      errors,
      `each_page_needs_at_least_two_beta2_findings:${review.pageSlug}`,
    );
    pushIf(
      review.finalQaChecksJa.length < 3,
      errors,
      `each_page_needs_final_qa_checks:${review.pageSlug}`,
    );
    pushIf(
      !review.pagePath.startsWith(run.candidateRouteBase),
      errors,
      `page_path_must_remain_internal_candidate:${review.pageSlug}`,
    );
  }

  for (const agentId of findingAgentIds) {
    pushIf(!agentIds.has(agentId), errors, `finding_references_unknown_agent:${agentId}`);
  }

  const requiredGroups: AxiomVirtualBetaStakeholderGroup[] = [
    'disabled_worker_or_jobseeker',
    'rare_disease_or_chronic_condition_worker',
    'sensory_access_user',
    'employer_hr_dei',
    'employment_support_provider',
    'policy_research_administration',
    'nbl_product_editorial',
    'nbl_partnership_revenue',
    'nbl_trust_operations',
    'nbl_social_growth',
  ];
  for (const group of requiredGroups) {
    pushIf(!stakeholderGroups.has(group), errors, `missing_stakeholder_group:${group}`);
  }

  for (const requiredBoundary of [
    'no_public_approval',
    'no_publication_execution',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_individual_consultation_or_case_judgment',
    'no_learning_update_from_virtual_beta2',
  ]) {
    pushIf(!run.notNow.includes(requiredBoundary), errors, `missing_not_now:${requiredBoundary}`);
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_next_nbl_virtual_beta2_review_run_valid'
        : 'axiom_next_nbl_virtual_beta2_review_run_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_NEXT_NBL_VIRTUAL_BETA2_REVIEW_BOUNDARY,
  };
}
