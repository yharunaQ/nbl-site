import NextLink from 'next/link';
import {
  createContext,
  useEffect,
  useContext,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  Accessibility,
  Activity,
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  Copy,
  DoorOpen,
  Ear,
  Eye,
  FileSearch,
  FileText,
  HeartHandshake,
  Home,
  Layers3,
  Lightbulb,
  Laptop,
  Map,
  Maximize2,
  Menu,
  MessageCircle,
  MessagesSquare,
  Network,
  Puzzle,
  Route,
  SearchCheck,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Train,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  buildAxiomReviewedKernelBackedCandidateRouteMap,
  getAxiomReviewedKernelBackedCandidateRouteBySlug,
  type AxiomReviewedKernelBackedCandidateRoute,
} from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';
import {
  buildAxiomIntegratedDomainKnowledgePageBodyProjection,
  getAxiomIntegratedDomainKnowledgePageBodyBySurface,
  type AxiomIntegratedDomainKnowledgePageBody,
  type AxiomIntegratedDomainKnowledgePageBodySection,
} from '@/lib/axiom/integratedDomainKnowledgePageBodyProjection';
import {
  AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
  buildFalconAxiomPublicSiteUpdatePlan,
  getFalconAxiomPublicSiteUpdatePlanRowBySurface,
  type FalconAxiomPublicSiteUpdatePlanRow,
} from '@/lib/axiom/falconAxiomPublicSiteUpdatePlan';
import { rewriteAxiomCandidateHrefToPublished } from '@/lib/axiom/nextNblPublishedRoutes';
import {
  buildAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  type AxiomAllLayerRebuiltReviewSubstructure,
} from '@/lib/axiom/allLayerIntegratedDomainKnowledgeRebuild';
import { type AxiomNextNblSiteSurface } from '@/lib/axiom/siteSurfaceSlotContract';
import { SITE_URL } from '@/lib/siteMetadata';

type AxiomPublicCandidatePageContext = FalconAxiomPublicSiteUpdatePlanRow & {
  icon: LucideIcon;
};

type ExperienceCard = {
  title: string;
  body: string;
  tag?: string;
};

type PageExperience = {
  eyebrow: string;
  concreteTitle: string;
  concreteBody: string;
  featureTitle: string;
  featureLead: string;
  cards: readonly ExperienceCard[];
  stepsTitle: string;
  steps: readonly string[];
};

type DeepPageModule = {
  eyebrow: string;
  title: string;
  lead: string;
  cards: readonly ExperienceCard[];
};

type ArticleSocialQuestionFullArticle = {
  id: string;
  featureLabel: string;
  readingTime: string;
  title: string;
  category: string;
  reader: string;
  hook: string;
  imageSrc: string;
  imageAlt: string;
  sections: readonly {
    heading: string;
    body: string;
  }[];
  oldReading: string;
  designReading: string;
  firstMove: string;
  discussionQuestions: readonly string[];
  nextUseGroups: readonly {
    title: string;
    intent: string;
    href: string;
    items: readonly string[];
  }[];
};

const articleCatalogCategories = [
  '健康時間',
  '情報アクセス',
  '職場運用',
  '開示・評価',
  '入口・移行',
  '支援・制度',
] as const;

type ArticleCatalogCategory = (typeof articleCatalogCategories)[number];

const articleCatalogCategoryFilters = ['すべて', ...articleCatalogCategories] as const;

type ArticleCatalogCategoryFilter = (typeof articleCatalogCategoryFilters)[number];

const articleCatalogAudienceFilters = [
  'すべて',
  '本人・家族',
  '企業・管理職',
  '支援者',
  '医療・福祉・教育',
  '行政・政策',
  '研究・発信',
] as const;

type ArticleCatalogAudienceFilter = (typeof articleCatalogAudienceFilters)[number];
type ArticleCatalogAudience = Exclude<ArticleCatalogAudienceFilter, 'すべて'>;

const articleCatalogThemes = [
  '雇用の質',
  '見えない病気',
  '治療と仕事',
  'メンタルヘルス',
  '多様性と参加',
  '支援接続',
  '相互作用',
  '配慮と仕事設計',
  '多分野連携',
  '職場接触点',
  '実装と研修',
  '三者視点',
  '政策・研究',
  '資料と会議',
  '組織と支援',
] as const;

type ArticleCatalogTheme = (typeof articleCatalogThemes)[number];

const articleCatalogThemeFilters = ['すべて', ...articleCatalogThemes] as const;

type ArticleCatalogThemeFilter = (typeof articleCatalogThemeFilters)[number];

type ArticleCatalogEntry = {
  id: string;
  title: string;
  category: ArticleCatalogCategory;
  theme: ArticleCatalogTheme;
  audiences: readonly ArticleCatalogAudience[];
  readerQuestion: string;
  argument: string;
  firstUse: string;
  nextHref: string;
  nextLabel: string;
  tags: readonly string[];
  depth: 'まず読む' | '深く読む' | '実装へ戻す';
};

type SceneComic = {
  id: string;
  issueLabel: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  commonMisread: string;
  axiomRead: string;
  nextMove: string;
  whyThisScene: string;
  sharedAction: string;
  panelCaptions: readonly string[];
};

type ConsultationFaqCategory = {
  title: string;
  lead: string;
  examples: readonly string[];
};

type ConsultationStakeholderEntry = {
  stakeholder: string;
  lead: string;
  fragments: readonly string[];
};

type ConsultationSupportPlanBranch = {
  question: string;
  condition: string;
  plan: string;
};

type ConsultationThemeAssessment = {
  avoid: string;
  widen: string;
  counter: string;
  branches: readonly ConsultationSupportPlanBranch[];
};

type ConsultationReadingCase = {
  id: string;
  category: string;
  audience: string;
  title: string;
  consultation: string;
  stuckReading: string;
  workConditionReading: string;
  counterHypothesis: string;
  missingContext: readonly string[];
  afterMoreInfo: string;
  nextMove: string;
  supportPlanBranches: readonly ConsultationSupportPlanBranch[];
};

type WorkConditionCategoryEntry = {
  id: string;
  title: string;
  subtitle: string;
  firstUnderstanding: string;
  designBridge: string;
  overview: string;
  easyToSee: string;
  workConditionRead: string;
  lenses: readonly string[];
  scenes: readonly string[];
  questions: readonly string[];
  nextUse: readonly string[];
  icon: LucideIcon;
  accentClass: string;
};

type WorkConditionLens = {
  title: string;
  body: string;
  icon: LucideIcon;
};

type WorkConditionRoute = {
  label: string;
  title: string;
  body: string;
  slug: string;
  icon: LucideIcon;
};

const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap();
const pageBodyProjection = buildAxiomIntegratedDomainKnowledgePageBodyProjection();
const updatePlan = buildFalconAxiomPublicSiteUpdatePlan(routeMap);
const integratedDomainKnowledgeRebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
const integratedSubstructureById = new globalThis.Map(
  integratedDomainKnowledgeRebuild.rebuiltReviewUnits.flatMap((unit) =>
    unit.substructures.map((substructure) => [substructure.substructureId, substructure] as const),
  ),
);

type StableLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

type AxiomNextNblSiteRouteMode = 'internal_candidate' | 'published';

const AxiomNextNblRouteModeContext = createContext<AxiomNextNblSiteRouteMode>('internal_candidate');

const primaryDesktopNavSlugs = [
  'home',
  'scene-entry',
  'case-readings',
  'work-design-views-guide',
  'articles-social-questions',
  'toolkit-studio',
] as const;

const publishedProjectsNavItem = {
  href: '/projects',
  label: 'プロジェクト',
} as const;

function resolveHrefForRouteMode(href: string, routeMode: AxiomNextNblSiteRouteMode) {
  return routeMode === 'published' ? rewriteAxiomCandidateHrefToPublished(href) : href;
}

function buildAbsoluteShareUrl(href: string) {
  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  return new URL(href, `${SITE_URL}/`).toString();
}

function replaceBrowserUrl(href: string, routeMode: AxiomNextNblSiteRouteMode) {
  if (typeof window === 'undefined') {
    return;
  }

  const resolvedHref = resolveHrefForRouteMode(href, routeMode);
  window.history.replaceState(null, '', resolvedHref);
}

function Link({ children, href, ...props }: StableLinkProps) {
  const routeMode = useContext(AxiomNextNblRouteModeContext);
  const resolvedHref = resolveHrefForRouteMode(href, routeMode);

  if (href.startsWith(AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE)) {
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={resolvedHref} {...props}>
      {children}
    </NextLink>
  );
}

function ShareActionStrip({
  contentHref,
  intro,
  shareHref,
  shareText,
}: {
  contentHref: string;
  intro: string;
  shareHref: string;
  shareText: string;
}) {
  const routeMode = useContext(AxiomNextNblRouteModeContext);
  const [copied, setCopied] = useState(false);
  const resolvedContentHref = resolveHrefForRouteMode(contentHref, routeMode);
  const absoluteShareUrl = buildAbsoluteShareUrl(resolveHrefForRouteMode(shareHref, routeMode));
  const xShareHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(absoluteShareUrl)}`;

  async function copyShareUrl() {
    try {
      if (!navigator.clipboard) {
        throw new Error('clipboard_unavailable');
      }
      await navigator.clipboard.writeText(absoluteShareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="mt-5 flex flex-col gap-3 rounded-lg border border-teal-100 bg-[#eef5f1] p-4 text-sm leading-6 text-slate-700 sm:flex-row sm:items-center sm:justify-between"
      data-share-action-strip
    >
      <p className="font-semibold text-teal-950">{intro}</p>
      <div className="flex flex-wrap gap-2">
        <a
          className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-teal-900 transition hover:border-teal-500 hover:text-teal-950"
          href={xShareHref}
          rel="noreferrer"
          target="_blank"
        >
          <Share2 size={14} />
          Xで共有
        </a>
        <button
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-950"
          onClick={copyShareUrl}
          type="button"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'コピー済み' : 'URLコピー'}
        </button>
        <a
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-950"
          href={resolvedContentHref}
        >
          本文で開く
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

const surfaceIcons: Record<AxiomNextNblSiteSurface, LucideIcon> = {
  reader_facing_top_home: Sparkles,
  scene_entry_use_cases: MessagesSquare,
  consultation_case_reading_collection: ClipboardList,
  twenty_one_views_work_design_guide: Network,
  article_social_question_library: FileSearch,
  cognitive_support_toolkit_studio_multimodal_objects: Layers3,
  work_condition_window: SearchCheck,
  theory_method_trust_page: BrainCircuit,
  about_operating_boundary_page: ShieldCheck,
};

const pageExperiences: Record<AxiomNextNblSiteSurface, PageExperience> = {
  reader_facing_top_home: {
    eyebrow: 'トップページ',
    concreteTitle: '働きづらさを、人の問題で終わらせない。',
    concreteBody:
      '診断名や制度名だけで答えを探す前に、本人、仕事、環境、支援、時間、評価の関係を見える形にします。',
    featureTitle: '問いはばらばらでも、見る地図はひとつ。',
    featureLead:
      '困りごと、相談、設計、記事、図解、障害種類。入口は違っても、NBLが見るのは本人、仕事、環境、支援、時間、評価の関係です。',
    cards: [
      {
        title: '課題でつかむ',
        body: '昔から言われてきたのに解けにくかった課題を、4コマと短い読み替えで見る。',
        tag: 'Issue',
      },
      {
        title: '相談をほどく',
        body: 'まとまっていない一言をつぶさず、見立て、確認したいこと、支援計画の分岐へ進む。',
        tag: 'Case',
      },
      {
        title: '設計へ広げる',
        body: '障害者雇用の知見を、人間の多様性を前提にした仕事・社会参加の設計へ広げる。',
        tag: 'Guide',
      },
    ],
    stepsTitle: '迷ったら',
    steps: [
      '8つの課題で全体像を見る',
      '近い相談事例を開く',
      '設計ガイドで整理する',
      'レポートやツールで共有する',
    ],
  },
  scene_entry_use_cases: {
    eyebrow: '古くて新しい課題を4コマで見る',
    concreteTitle: '昔から言われてきたのに解けなかった課題を、仕事条件の地図へ。',
    concreteBody:
      '雇用率、診断名、制度、善意、検索結果など、見えやすい入口だけでは解けない問題を、関係者で扱える仕事条件へ読み替えます。',
    featureTitle: 'このページの役割',
    featureLead:
      '抽象説明の前に、本人・職場・支援者・政策検討の場が同じ課題を見ながら、どこで詰まり、何を変えられるのかを話せる入口にします。',
    cards: [
      {
        title: '見えやすい入口',
        body: '数字、名前、制度語、善意、検索結果など、話を始めやすいが、そこで止まると問題を狭くしてしまう入口を見る。',
        tag: '1',
      },
      {
        title: '高い認知負荷',
        body: '本人、仕事、時間、情報、環境、支援、評価、制度が同時に絡むため、普通の説明では共通理解になりにくい。',
        tag: '2',
      },
      {
        title: '仕事条件の地図',
        body: '誰かの問題に閉じず、変えられる条件、まだ分からない条件、次に確認する問いへ分ける。',
        tag: '3',
      },
      {
        title: '社会の学びへ戻す',
        body: '相談、研修、記事、図解、制度検討を一回ごとに閉じず、次の理解と実装へ循環させる。',
        tag: '4',
      },
    ],
    stepsTitle: 'ユースケースの読み方',
    steps: [
      '8課題から選ぶ',
      '4コマで問題状況を見る',
      'よくある誤読を外す',
      '相談事例やツールへ進む',
    ],
  },
  consultation_case_reading_collection: {
    eyebrow: '相談入口ツール',
    concreteTitle: '一言の相談をつぶさず、次に確認する条件へ進む。',
    concreteBody:
      '短い相談を本人の問題に閉じず、仕事、環境、支援、時間、評価のどこを一緒に見るかへ広げます。',
    featureTitle: '相談入口で扱うこと',
    featureLead:
      '本来は動的相談にしたかった入口を、静的ページでも使える相談ツールとして組み直します。',
    cards: [
      { title: '健康時間の相談', body: '疲れ、通院、回復、締切、評価が衝突する相談。' },
      { title: '開示と情報共有', body: '何を誰にどこまで伝えるかが分からない相談。' },
      { title: '手順理解と変更', body: '作業手順、切替、急な変更、支援接続が絡む相談。' },
      { title: '職場接触点', body: '移動、道具、姿勢、安全、コミュニケーションの相談。' },
      { title: '評価と成長', body: '働けているが、役割・評価・成長が止まる相談。' },
      { title: '就職前・移行', body: '仕事像、体験、移行、応募前の不安に関わる相談。' },
    ],
    stepsTitle: '1件の相談の読み順',
    steps: [
      '相談文を観察として置く',
      '暫定見立てを作る',
      '別の可能性を出す',
      '確認質問と関係者条件へ分ける',
    ],
  },
  twenty_one_views_work_design_guide: {
    eyebrow: '仕事設計ガイド',
    concreteTitle: '配慮名を探す前に、働ける条件を設計する。',
    concreteBody:
      'レビュー済みの統合知識を、問題状況から改善状況へ進むための実用的な視点と状況レベルに変換します。',
    featureTitle: '仕事設計ガイドの読み方',
    featureLead:
      '視点は公式分類ではなく、企業・支援者・本人が仕事条件を点検するための実践的な地図です。',
    cards: [
      { title: '状況レベル1', body: '本人問題、症状名、配慮名だけで止まっている状態を見つける。' },
      { title: '状況レベル2', body: '時間、情報、動線、手順、評価、支援の条件へ分ける。' },
      { title: '状況レベル3', body: '関係者が変えられる条件と、まだ確認が必要な条件を分ける。' },
      { title: '状況レベル4', body: '働き続ける質、成長、役割、再調整ループへつなぐ。' },
    ],
    stepsTitle: '視点を作る順番',
    steps: [
      '中核発見を読む',
      '下部構造で具体化する',
      '読者向けの視点へ統合する',
      '数や名前を公開前に整える',
    ],
  },
  article_social_question_library: {
    eyebrow: 'NBLレポート',
    concreteTitle: '社会の違和感を、仕事条件の論考へ。',
    concreteBody:
      '当事者、企業、支援者、政策議論の問いを入口に、働きづらさの背後にある条件を読み直します。',
    featureTitle: '記事の3層設計',
    featureLead:
      '一撃で分かる図解、見出しだけで流せる本文、総合知識に基づく論理的な解説を分けて作ります。',
    cards: [
      { title: '一撃の図解', body: '問題の構造を、最初の画面でつかめる形にする。' },
      { title: '流し読み見出し', body: '忙しい読者が、見出しだけで論点を追えるようにする。' },
      {
        title: '深い解説',
        body: '読者の問いを、別解、まだ分からないこと、次に見る条件まで広げる。',
      },
    ],
    stepsTitle: '記事化の順番',
    steps: [
      '読者の問いを拾う',
      '仕事条件の問いへ戻す',
      '解決への最小経路を描く',
      '相談事例やツールへ返す',
    ],
  },
  cognitive_support_toolkit_studio_multimodal_objects: {
    eyebrow: '言葉以外の入口',
    concreteTitle: '図解、4コマ、音楽、資料で、感じ取りにくい仕事条件を見える形へ。',
    concreteBody:
      '文章だけでは届きにくい働きづらさや職場設計の話を、見る、聞く、並べる、話すための素材として選べます。',
    featureTitle: '素材棚に入るもの',
    featureLead:
      '同じ仕事条件の問いを、図解、4コマ、音楽、フォーラム資料、SNSカードなど複数の認知経路で扱います。',
    cards: [
      {
        title: '選別図解',
        body: 'ICFと就労支援プロセスを入口に、全体地図、制度、支援接続、難病、疾患別場面を内容別に探す。',
      },
      { title: '疾患別4コマ', body: 'IBDや膠原病の見えにくい生活接点を、場面として共有する。' },
      { title: '音楽入口', body: '重くなりやすいテーマに、感覚的に入るきっかけを作る。' },
      { title: 'フォーラム資料', body: '研修、会議、地域連携で同じ素材を見ながら話す。' },
    ],
    stepsTitle: '素材の選び方',
    steps: [
      '図解を選ぶ',
      '場面を共有する',
      '音楽や資料で入口を作る',
      '話した後に記事や相談事例へ戻る',
    ],
  },
  work_condition_window: {
    eyebrow: '障害者雇用から、これからの職場設計へ',
    concreteTitle: '障害者雇用は、例外対応ではない。',
    concreteBody:
      '視覚、聴覚、肢体、内部、知的、精神、発達、高次脳機能障害、難病。障害種類から見える課題は、誰もが活躍できる仕事／参加設計の応用問題です。',
    featureTitle: '入口として扱うカテゴリ',
    featureLead:
      '多いデータに引きずられず、視覚・聴覚・内部・肢体・精神・発達・高次脳・知的・難病などの違いを埋もれさせません。',
    cards: [
      { title: '感覚障害', body: '情報形式、会議参加、警告、コミュニケーション経路を見る。' },
      { title: '内部障害・難病', body: '通院、定期検診、体調変動、回復時間を区別して読む。' },
      { title: '認知・発達・精神', body: '手順理解、切替、予測可能性、評価環境を見る。' },
      { title: '肢体・移動', body: '職場内外の移動、道具、姿勢、安全、接触点を見る。' },
    ],
    stepsTitle: 'カテゴリ入口の使い方',
    steps: ['名前から入る', '典型問題を疑う', '仕事条件へ分ける', '相談事例や視点へ移る'],
  },
  theory_method_trust_page: {
    eyebrow: 'NBLの専門性',
    concreteTitle: '読む力を、仕事と参加の専門性へ。',
    concreteBody:
      '診断名や支援策名で答えを出すのではなく、どの条件が絡み、何がまだ分からないかを見える形にしてから、各ページへ展開します。',
    featureTitle: '二層の専門知識',
    featureLead:
      '一つは、不完全な情報を相互作用と人権モデルの観点で読む基礎専門性。もう一つは、その読み方でまとめた仕事・社会参加の専門知識です。',
    cards: [
      {
        title: '基礎になる読み方',
        body: '本人だけの問題にも、職場だけの責任にも、制度名だけの答えにも閉じない。',
      },
      {
        title: '専門知識ネットワーク',
        body: '仕事、環境、支援、時間、制度の関係として、共通構造と少数の違いを残す。',
      },
      {
        title: '社会に届く翻訳',
        body: '相談、設計、記事、図解、音楽、資料へ、読者の目的に合わせて出し直す。',
      },
    ],
    stepsTitle: '知識が作られる順番',
    steps: [
      '不完全なデータを読む',
      '現実の構造を仮説化する',
      '多様性と少数信号を保護する',
      '公開面へ翻訳する',
    ],
  },
  about_operating_boundary_page: {
    eyebrow: 'サイト情報',
    concreteTitle: '運営者、責任者、連絡先、免責、著作権を確認するページです。',
    concreteBody:
      'サイトの内容説明ではなく、Next Being Labを利用・引用・問い合わせる前に必要な基本情報をまとめます。',
    featureTitle: '必要最小限のサイト情報',
    featureLead:
      'コンセプトや専門性の説明は他ページに任せ、このページでは運営・責任・問い合わせ・免責・著作権に絞ります。',
    cards: [
      {
        title: '運営者',
        body: 'Next Being Lab（NBL）',
      },
      { title: '責任者', body: '創設者・運営責任者: 春名由一郎' },
      {
        title: '問い合わせ',
        body: 'info@nextbeinglab.org',
      },
    ],
    stepsTitle: 'このページに置く情報',
    steps: ['運営者・責任者', '運営目的', '問い合わせ先', '免責事項と著作権'],
  },
};

const workConditionCategories: readonly WorkConditionCategoryEntry[] = [
  {
    id: 'visual-impairment',
    title: '視覚障害',
    subtitle: '見えにくさを、情報形式・移動・評価の条件として見る',
    firstUnderstanding:
      '視覚障害は、単に「見えない」だけではありません。文字、画面、周囲の動き、掲示、明るさ、距離、移動経路によって、同じ職場でも分かりやすさが大きく変わります。',
    designBridge:
      '仕事では、読む・探す・移動する・安全を確認する・成果を示すための情報形式を整えることが重要です。',
    overview:
      '視覚障害には、見えない、見えにくい、見える範囲が狭い、まぶしさや暗さで見え方が変わるなど、さまざまな状態があります。仕事では、紙や画面の文字だけでなく、掲示、周囲の動き、危険箇所、評価に必要な情報が分かりにくくなることがあります。情報の出し方と移動のしやすさが整うと、力を発揮しやすくなります。',
    easyToSee: '文字を大きくする、音声読み上げを使う、といった道具の話だけに見えやすい。',
    workConditionRead:
      '資料、画面、掲示、会議資料、職場内移動、安全確認、評価に必要な情報が、どの形式で届くかを見る。',
    lenses: [
      '資料・画面・帳票の形式',
      '会議資料の事前共有',
      '掲示・警告・非公式情報',
      '職場内移動と安全確認',
    ],
    scenes: [
      '朝礼の資料が当日紙で配られる',
      '掲示板だけで変更が伝わる',
      '通路や置き場所が日によって変わる',
    ],
    questions: [
      '仕事に必要な情報は、文字、音声、図、実物確認のどれで届いているか。',
      '移動や安全確認は、本人の注意だけに任されていないか。',
      '評価に必要な成果や手順が、見える形式で共有されているか。',
    ],
    nextUse: ['情報形式', '職場接触点', '相談事例'],
    icon: Eye,
    accentClass: 'from-cyan-50 via-white to-teal-50 border-cyan-200',
  },
  {
    id: 'hearing-balance-impairment',
    title: '聴覚・平衡機能障害',
    subtitle: '聞こえにくさを、会議参加・緊急連絡・合図の条件として見る',
    firstUnderstanding:
      '聴覚障害は、音が聞こえるかどうかだけではなく、騒音の中で聞き分ける、話の流れを追う、呼びかけや警報に気づく、といった場面で困りごとが変わります。平衡機能障害では、立位や移動の不安定さも仕事に影響します。',
    designBridge:
      '仕事では、会議、電話、連絡、警報、雑談で流れる情報を音声だけに頼らず、移動や立ち仕事の安全も一緒に確認します。',
    overview:
      '聴覚障害では、声が聞こえない、聞き取りにくい、騒がしい場所で話が分かりにくい、音の方向が分かりにくいことがあります。平衡機能障害では、立ち仕事や移動でふらつきや不安が出ることもあります。会議、電話、呼びかけ、警報、雑談の情報を音声だけに任せないことが、参加しやすさにつながります。',
    easyToSee: '聞こえるか聞こえないか、筆談できるか、という単発の配慮に寄りやすい。',
    workConditionRead:
      '会議、電話、呼びかけ、雑談で流れる情報、警告音、緊急連絡、姿勢や移動の安定性を仕事条件として分ける。',
    lenses: [
      '音声依存の会議・電話',
      '呼びかけ・警告・緊急連絡',
      '雑談で流れる非公式情報',
      '平衡・移動・立位の安全',
    ],
    scenes: [
      '会議で決定事項が口頭だけで流れる',
      '呼びかけや警告音に気づけない',
      '立ち仕事や移動でふらつきが出る',
    ],
    questions: [
      '重要な連絡は、音声以外の経路でも残っているか。',
      '会議参加は、聞き取る努力ではなく参加形式として設計されているか。',
      '平衡や移動の不安定さが出る場面を、作業配置や休憩と一緒に確認しているか。',
    ],
    nextUse: ['情報形式', '職場接触点', '場面'],
    icon: Ear,
    accentClass: 'from-orange-50 via-white to-amber-50 border-orange-200',
  },
  {
    id: 'physical-disability',
    title: '肢体不自由',
    subtitle: '動きにくさを、動線・姿勢・道具・仕事密度の条件として見る',
    firstUnderstanding:
      '肢体不自由では、移動、姿勢、手の操作、道具の扱い、痛みや疲れなどが人によって大きく違います。入口や段差だけでなく、作業場所までの距離や道具の置き方でも働きやすさが変わります。',
    designBridge:
      '仕事では、通勤、職場内移動、姿勢、道具、休憩、仕事量の重なりを、本人の努力ではなく職場の接触点として見ます。',
    overview:
      '肢体不自由では、手足や体幹を動かしにくい、長く同じ姿勢を保ちにくい、痛みや疲れが出やすい、道具を扱いにくいなどの困りごとが起こります。段差や設備だけでなく、通勤、職場内の移動、机や道具の位置、休憩、仕事量の重なりによって働きやすさが変わります。',
    easyToSee: '段差や設備だけの問題、または本人の身体能力だけの問題として見えやすい。',
    workConditionRead:
      '通勤、職場内移動、作業姿勢、道具配置、休憩場所、安全、顧客接点、締切密度を同じ地図で見る。',
    lenses: ['通勤・職場内移動', '作業姿勢と道具配置', '休憩場所と回復', '安全・顧客接点・仕事量'],
    scenes: [
      '入口は入れるが作業場所まで遠い',
      '長時間同じ姿勢で作業が続く',
      '道具の位置が日によって変わる',
    ],
    questions: [
      'できる/できないではなく、どの動線や姿勢で消耗が増えているか。',
      '道具、机、端末、保管場所は、作業の順番と合っているか。',
      '移動や姿勢の負荷が、締切や評価と衝突していないか。',
    ],
    nextUse: ['職場接触点', '健康時間', 'ツールキット'],
    icon: Accessibility,
    accentClass: 'from-lime-50 via-white to-emerald-50 border-lime-200',
  },
  {
    id: 'internal-disability',
    title: '内部障害',
    subtitle: '見えにくい身体管理を、勤務表・回復・安全の条件として見る',
    firstUnderstanding:
      '内部障害は外から分かりにくいことが多く、本人が普通に見えていても、治療、検査、疲労、感染への注意、身体管理が仕事と深く関わる場合があります。',
    designBridge:
      '仕事では、通院や検診を私事として切り離さず、勤務表、繁忙期、回復時間、安全管理と同じ地図で考えます。',
    overview:
      '内部障害は、心臓、腎臓、呼吸器、ぼうこう・直腸など、体の内部の機能に関わる障害です。外から見えにくいため、通院、透析、検査、服薬、疲れやすさ、感染への注意などが仕事に影響していても、周囲に伝わりにくいことがあります。勤務表、回復時間、安全管理を含めて考えることが大切です。',
    easyToSee: '外から見えにくいため、普通に働けているか、急に休むかの二択で見られやすい。',
    workConditionRead:
      '治療時間、定期検診、体調管理、疲労、感染や安全、勤務外の回復、繁忙期の仕事密度を分けて確認する。',
    lenses: ['定期検診・治療時間', '疲労と回復余地', '安全・感染・身体管理', '繁忙期と勤務密度'],
    scenes: [
      '検査日は固定だが勤務表に入りにくい',
      '忙しい時期に回復時間が消える',
      '体調管理の行動が評価低下に見える',
    ],
    questions: [
      '治療や検診は、勤務外の私事ではなく仕事を続ける条件として扱われているか。',
      '疲労や安全管理は、本人の自己管理だけに閉じていないか。',
      '繁忙期や代替手順まで含めて、戻り方が決まっているか。',
    ],
    nextUse: ['健康時間', '治療・検診時間', '相談事例'],
    icon: Activity,
    accentClass: 'from-rose-50 via-white to-pink-50 border-rose-200',
  },
  {
    id: 'intellectual-disability',
    title: '知的障害',
    subtitle: '分かりにくさを、説明形式・役割・反復の条件として見る',
    firstUnderstanding:
      '知的障害では、抽象的な説明、複数の指示、初めての判断、相談のタイミングが分かりにくいことがあります。一方で、具体的な手順、実物、反復、役割の見える化によって力を発揮しやすくなります。',
    designBridge:
      '仕事では、理解力を本人だけの問題にせず、説明の形式、作業の分け方、練習機会、評価基準を職場側にも残します。',
    overview:
      '知的障害では、説明を理解するのに時間がかかる、抽象的な言葉が分かりにくい、複数の指示を同時に覚えにくい、判断や相談のタイミングがつかみにくいことがあります。実物を見せる、手順を分ける、例を示す、繰り返し練習できるようにすることで、できる仕事や成長の道筋が見えやすくなります。',
    easyToSee: '能力不足、理解不足、指示待ちとして本人側に寄せられやすい。',
    workConditionRead:
      '説明の具体性、作業の分け方、反復機会、役割の見え方、確認する相手、評価基準の見える化を確認する。',
    lenses: ['具体的な説明形式', '作業分解と反復', '役割と期待値', '確認相手と評価基準'],
    scenes: [
      '一度の説明で覚える前提になっている',
      '抽象的な注意だけが残る',
      'できている作業が評価に結びつかない',
    ],
    questions: [
      '指示は、実物、手順、例、練習機会として残っているか。',
      '役割や期待値は、本人にも周囲にも同じように見えているか。',
      'ミスした時に、責める前に戻れる手順があるか。',
    ],
    nextUse: ['手順と戻り方', '評価と成長', '相談事例'],
    icon: Lightbulb,
    accentClass: 'from-yellow-50 via-white to-stone-50 border-yellow-200',
  },
  {
    id: 'mental-disability',
    title: '精神障害',
    subtitle: '不調や不安を、予測可能性・相談線・評価の条件として見る',
    firstUnderstanding:
      '精神障害では、気分、睡眠、不安、集中、対人緊張などが、仕事の負荷や人間関係、急な変更の影響を受けることがあります。調子の波は本人の弱さではなく、環境や仕事量との相互作用として現れることがあります。',
    designBridge:
      '仕事では、早めに相談できる線、予測しやすい業務量、評価や注意の伝え方、休む・戻る道筋を整えます。',
    overview:
      '精神障害では、気分、意欲、不安、集中、睡眠、対人緊張などが仕事の負荷や人間関係の影響を受けることがあります。調子がよい時と悪い時の差があり、急な変更、強い指摘、相談しにくさが不調を長引かせることもあります。早めに相談できる線と、休む・戻る道筋があると働き続けやすくなります。',
    easyToSee: 'メンタルが弱い、安定してから働くべき、という本人状態の話に閉じやすい。',
    workConditionRead:
      '負荷の予測可能性、相談しやすさ、業務量の波、評価の伝え方、悪化時の戻り方、開示範囲を分ける。',
    lenses: ['予測可能な業務量', '相談線と早期サイン', '評価・注意の伝え方', '悪化時の戻り方'],
    scenes: [
      '急な変更や強い指摘で不調が続く',
      '相談すると評価が下がる不安がある',
      '復職後の仕事量が一気に戻る',
    ],
    questions: [
      '調子を崩す前に、誰がどのサインを見て相談できるか。',
      '注意や評価は、人格ではなく仕事条件として伝えられているか。',
      '悪化、休職、復職、配置換えの戻り道が見えているか。',
    ],
    nextUse: ['開示・評価', '支援接続', '記事'],
    icon: HeartHandshake,
    accentClass: 'from-violet-50 via-white to-fuchsia-50 border-violet-200',
  },
  {
    id: 'developmental-disability',
    title: '発達障害',
    subtitle: '特性を、手順・切替・暗黙ルール・刺激環境の条件として見る',
    firstUnderstanding:
      '発達障害では、注意、切替、優先順位、感覚刺激、会話や暗黙のルールの受け取り方に違いが出ることがあります。得意なことがある一方で、曖昧さや急な変更で急に難しくなる場面があります。',
    designBridge:
      '仕事では、特性を性格の問題にせず、手順、変更予告、優先順位、刺激環境、確認方法を見える条件として整えます。',
    overview:
      '発達障害では、注意の向け方、切替、優先順位、感覚の過敏さ、読み書き、会話や暗黙のルールの受け取り方に得意不得意が出ることがあります。曖昧な指示、急な変更、同時進行、騒音や光の刺激が重なると、仕事が急に難しくなることがあります。手順や環境を見える形にすると、力を使いやすくなります。',
    easyToSee: 'こだわり、空気が読めない、注意不足といった性格や努力の話に寄りやすい。',
    workConditionRead:
      '手順の明確さ、変更予告、優先順位、例外処理、刺激環境、暗黙ルール、確認方法を仕事条件として扱う。',
    lenses: ['手順・優先順位・例外', '変更予告と切替', '刺激環境と集中', '暗黙ルールの明文化'],
    scenes: [
      '突然の割り込みで優先順位が崩れる',
      '暗黙の期待が評価に響く',
      '音や光で集中が続かない',
    ],
    questions: [
      '手順や優先順位は、口頭の雰囲気ではなく見える形で共有されているか。',
      '変更や割り込みの時、何を止めて何を先にするか決まっているか。',
      '刺激環境や暗黙ルールが、本人の努力不足として扱われていないか。',
    ],
    nextUse: ['手順と戻り方', '情報形式', '場面'],
    icon: Puzzle,
    accentClass: 'from-sky-50 via-white to-indigo-50 border-sky-200',
  },
  {
    id: 'higher-brain-dysfunction',
    title: '高次脳機能障害',
    subtitle: '記憶・注意・疲労を、確認手順と戻り方の条件として見る',
    firstUnderstanding:
      '高次脳機能障害では、記憶、注意、段取り、感情の調整、疲れやすさなどが変化し、外見からは分かりにくいことがあります。「前はできたのに」と見られやすいことも、本人と周囲の戸惑いを大きくします。',
    designBridge:
      '仕事では、覚える努力に頼りきらず、記録、確認、作業順序、ミス後に戻る手順を職場の中に置きます。',
    overview:
      '高次脳機能障害は、病気や事故の後に、記憶、注意、段取り、感情の調整、見落とし、疲れやすさなどに変化が出ることがあります。外見から分かりにくく、「前はできたのに」と見られて本人も周囲も戸惑いやすい障害です。記録、確認、作業の順番、ミス後に戻る手順を仕事の中に用意することが助けになります。',
    easyToSee: '前はできたのに、うっかり、忘れっぽい、ミスが多いという評価に寄りやすい。',
    workConditionRead:
      '記憶補助、注意を向ける順番、疲労、手順の外部化、ミス後の復帰、周囲の確認方法を設計する。',
    lenses: ['記憶補助と手順外部化', '注意配分と疲労', 'ミス後の戻り方', '周囲の確認と役割分担'],
    scenes: [
      '複数作業を同時に求められる',
      '疲れると確認漏れが増える',
      'ミス後にどこへ戻るか分からない',
    ],
    questions: [
      '覚える努力ではなく、記録、チェック、合図として仕事側に残せているか。',
      '疲労や注意の波を、作業順序や休憩と一緒に見ているか。',
      'ミスした後に、本人と周囲が同じ手順へ戻れるか。',
    ],
    nextUse: ['手順と戻り方', '支援接続', 'ツールキット'],
    icon: BrainCircuit,
    accentClass: 'from-blue-50 via-white to-slate-50 border-blue-200',
  },
  {
    id: 'intractable-disease',
    title: '難病',
    subtitle: '変動する体調を、健康時間・開示・戻り方の条件として見る',
    firstUnderstanding:
      '難病や慢性疾患では、症状が安定しない、再燃する、治療や通院が続く、薬の影響や疲れが出るなど、日によって働ける条件が変わることがあります。元気に見える日があるため、つらさが伝わりにくい場合もあります。',
    designBridge:
      '仕事では、休むか頑張るかの二択ではなく、仕事量、通院、回復、開示、収入や評価との関係を一緒に設計します。',
    overview:
      '難病や慢性疾患では、体調が日によって変わる、症状が再燃する、治療や通院が続く、薬の影響や疲れが出るなど、働き方に波が生じることがあります。元気に見える日があるため、つらい時との落差が伝わりにくいこともあります。仕事量、休み方、戻り方、収入や評価との関係を一緒に考える必要があります。',
    easyToSee: '病気が重いか軽いか、働けるか働けないか、本人が頑張れるかの話になりやすい。',
    workConditionRead:
      '変動、再燃、通院、薬の影響、収入不安、開示、休む・戻る・選び直す自由を仕事条件として置く。',
    lenses: [
      '体調変動と仕事密度',
      '通院・治療・薬の影響',
      '収入・評価との衝突',
      '休む・戻る・選び直す道',
    ],
    scenes: [
      '良い日と悪い日の差が評価に響く',
      '通院や再燃が勤務表に入らない',
      '休んだ後の戻り方が決まっていない',
    ],
    questions: [
      '体調が悪い日だけでなく、変動を前提にした仕事量や代替手順があるか。',
      '開示は病名説明ではなく、何を調整するための共有になっているか。',
      '休む、戻る、働き方を選び直す条件が、収入や評価と衝突していないか。',
    ],
    nextUse: ['健康時間', '開示・評価', '記事'],
    icon: Stethoscope,
    accentClass: 'from-purple-50 via-white to-rose-50 border-purple-200',
  },
] as const;

const workConditionLenses: readonly WorkConditionLens[] = [
  {
    title: '時間',
    body: '勤務時間、通院、回復、繁忙期、戻り方を同じ時間表で見る。',
    icon: Clock3,
  },
  {
    title: '情報',
    body: '文字、音声、図、会議、警告、変更連絡の形式を見る。',
    icon: FileText,
  },
  {
    title: '動線・接触点',
    body: '通勤、職場内移動、道具、姿勢、休憩場所、安全を確認する。',
    icon: Route,
  },
  {
    title: '手順',
    body: '開始、切替、優先順位、例外、ミス後の戻り方を見える化する。',
    icon: ClipboardList,
  },
  {
    title: '開示・評価',
    body: '共有範囲、共有目的、評価に使わない範囲、成長の見え方を分ける。',
    icon: ShieldCheck,
  },
  {
    title: '支援',
    body: '本人、職場、支援者、医療、制度の言葉を仕事条件へつなぎ直す。',
    icon: UsersRound,
  },
] as const;

const workConditionRoutes: readonly WorkConditionRoute[] = [
  {
    label: '相談したい',
    title: '近い相談から読む',
    body: '自分や職場の一言に近い相談を選び、見立て、別解、確認質問へ進む。',
    slug: 'case-readings',
    icon: MessageCircle,
  },
  {
    label: '設計したい',
    title: '仕事設計ガイドへ進む',
    body: '健康時間、情報形式、職場接触点、開示、評価、支援接続を設計領域として読む。',
    slug: 'work-design-views-guide',
    icon: Network,
  },
  {
    label: '課題を共有したい',
    title: '8つの課題を見る',
    body: '古くて新しい課題を4コマで見て、仕事条件の地図へ読み替える。',
    slug: 'scene-entry',
    icon: MessagesSquare,
  },
  {
    label: '論点を深めたい',
    title: 'NBLレポートで読む',
    body: '見えない病気、治療と仕事、開示、雇用の質などの社会的論点から読む。',
    slug: 'articles-social-questions',
    icon: FileSearch,
  },
  {
    label: '会議で使いたい',
    title: 'ツールキットへ進む',
    body: '図解、ワーク、場面カードを使って、関係者で同じ条件地図を見ながら話す。',
    slug: 'toolkit-studio',
    icon: Layers3,
  },
] as const;

const theoryMethodProblemCards = [
  {
    title: '相互作用が複雑すぎる',
    body: '働きづらさは、本人の状態だけでなく、仕事量、手順、評価、通勤、治療、支援、制度が同時に絡んで起きます。人間だけで全体を見続けるには、認知負荷が大きすぎます。',
    icon: Network,
  },
  {
    title: '情報には一面性が混ざる',
    body: '国内外の資料、調査、制度情報、現場の声は重要です。一方で、障害を本人問題や雇用負担として切り取る情報も多く、そのままAIに読ませると古い見方を再生産する危険があります。',
    icon: FileSearch,
  },
  {
    title: '支援策名では解けない',
    body: '合理的配慮、時短、在宅、通院配慮などの名前だけでは、何を変えればよいか分かりません。必要なのは、状況を構造として読み、次に確認する条件へ変える専門性です。',
    icon: ShieldCheck,
  },
] as const;

const theoryMethodKnowledgeLayerCards = [
  {
    label: 'Layer 1',
    title: '専門情報を読む基礎専門性',
    body: '第一層は安全策ではなく、専門性の土台です。ICF的な相互作用の見方と人権モデルの考え方を土台に、障害や病気に関する情報を、本人だけの問題にも、職場だけの責任にも、制度名だけの答えにも閉じずに読みます。',
    points: [
      '観察、推論、価値判断、提案を分け、根拠と解釈を混ぜない',
      '多数データや目立つ声だけに引きずられず、少数でも重要な信号を残す',
      '反対仮説、未確認事項、まだ言えないことを残し、AIの読解力を断定ではなく仮説づくりに使う',
    ],
  },
  {
    label: 'Layer 2',
    title: '読み取ってまとめた仕事・社会参加の知識',
    body: 'その読み方で、健康時間、情報形式、職場接触点、開示、評価、支援接続などの関係をまとめます。これはサイト全体で、場面、相談事例、設計ガイド、記事、図解・ツールとして提供します。',
    points: [
      '障害種類や病名だけで閉じず、仕事条件の関係として読む',
      '個別判断ではなく、問いと設計の材料として使う',
      '複雑な知識を、読者の目的に合わせて複数の入口へ分ける',
    ],
  },
] as const;

const theoryMethodFoundationCards = [
  {
    title: '人の問題に閉じない',
    body: '体調、認知負荷、経験だけに原因を閉じず、仕事量、情報形式、環境、支援、時間、制度との関係で読む。',
  },
  {
    title: '制度名を答えにしない',
    body: '合理的配慮や支援策名を否定せず、作業、手順、評価、相談線、回復時間へ翻訳する。',
  },
  {
    title: '少数の信号を消さない',
    body: '多いデータで全体をならす前に、視覚、聴覚、内部障害、精神、発達、難病などの違いを保つ。',
  },
  {
    title: 'AIを断定に使わない',
    body: '大量情報を読む力を、結論の自動化ではなく、仮説、反対仮説、確認質問、言い切らない境界へ使う。',
  },
] as const;

const theoryMethodKernelSteps = [
  {
    title: '1. 断片を、そのまま信じない',
    body: '調査回答、ワークショップ記録、制度資料、実務資料、国内外の公開情報、SNS上の問いを、まず観察・推論・価値判断・提案に分けます。きれいな文章でも、根拠と解釈を混ぜません。',
  },
  {
    title: '2. ICF的な相互作用に置き直す',
    body: '本人、仕事、環境、支援、時間、制度、証拠状態の関係として読みます。病名や障害種類は入口ですが、仕事設計の答えにはしません。',
  },
  {
    title: '3. 仮説と反対仮説を同時に作る',
    body: '「たぶんこうだ」と一つに決めず、別の見方、足りない文脈、まだ言えないことを一緒に出します。ここでLLMの読解力を使います。',
  },
  {
    title: '4. 実データを専門知識ネットワークへ統合する',
    body: '調査データ、ワークショップ、マニュアル、国内外の情報を、件数の多い領域だけに引きずられないように読み込み、仕事条件の共通構造と少数でも重要な違いを残します。',
  },
  {
    title: '5. 人間が読める形に翻訳する',
    body: '専門知識ネットワークはそのままでは複雑すぎます。場面、相談事例、仕事設計ガイド、記事、ツール、障害種類別入口に分け、読者の目的に合わせて出し直します。',
  },
] as const;

const theoryMethodInterfaceCards = [
  {
    title: '8つの課題',
    body: '8つの古くて新しい課題を4コマで見て、問題が本人の中だけでなく仕事条件の衝突として見えることを直感的に伝える。',
    href: 'scene-entry',
  },
  {
    title: '相談事例集',
    body: '断片的な相談を、当初見立て、追加確認、支援計画の分岐へほどく。',
    href: 'case-readings',
  },
  {
    title: '仕事設計ガイド',
    body: '個別相談を超えて、AI時代の仕事・社会参加設計のマスタープランとして読む。',
    href: 'work-design-views-guide',
  },
  {
    title: 'NBLレポート',
    body: '現場の切実な問い、政策議論、社会的論点を、仕事条件の論考として広げる。',
    href: 'articles-social-questions',
  },
  {
    title: 'ツールキット',
    body: '図解、ワーク、研修、資料、場面カードで、複雑な知識を会議や対話で扱える形にする。',
    href: 'toolkit-studio',
  },
  {
    title: '障害種類から見る',
    body: '障害種類や疾病名から入り、診断名別の答えではなく、仕事条件の確認へ進む。',
    href: 'work-condition-window',
  },
] as const;

const theoryMethodBoundaryCards = [
  {
    title: '動的チャットは当面、公開面にしない',
    body: '利用者が直接AIに個別相談する形ではなく、典型的な問いに合わせて静的コンテンツを前もって作ります。個別判断をAIに任せないためです。',
  },
  {
    title: 'SNSは社会との循環として扱う',
    body: 'ニュースや社会の問いに反応して発信する運用はあります。ただし、反応をそのまま根拠にせず、次の問いや改善候補として扱います。',
  },
  {
    title: '人間の確認が止める',
    body: '公開、最終判断、内容の更新は、人間の確認を通さずに進めません。AIを活用しても、責任の境界は消しません。',
  },
] as const;

const toolkitShelves = [
  {
    id: 'toolkit-shelf-infographics',
    eyebrow: 'Infographics',
    title: '選別図解',
    body: 'ICFと就労支援プロセスで見方の土台をそろえてから、全体地図、偏見の読み替え、制度、支援接続、難病、疾患別場面を内容から選ぶ棚です。',
    image: '/images/axiom-toolkit-selected-infographics/top-13.png',
    imageAlt: '仕事のコンディションマップA3の図解',
    tags: ['図解', '拡大表示', '会議共有'],
    href: '#toolkit-selected-infographic-library',
    action: '選別図解を見る',
  },
  {
    id: 'toolkit-shelf-scenes',
    eyebrow: 'Comics',
    title: '4コマ・マンガ',
    body: '月末締切、手順変更、情報形式、移動、開示と評価などを場面として見せ、同じ対象を見ながら話せるようにします。',
    image: '/images/axiom-scene-comics/axiom-scene-procedure-switching-load-v1.png',
    imageAlt: '手順変更と切替負荷を4コマで示す場面カード',
    tags: ['4コマ', '場面カード', '研修入口'],
    href: '#toolkit-infographic-ibd-scenes',
    action: '4コマ棚を見る',
  },
  {
    id: 'toolkit-shelf-music',
    eyebrow: 'Music',
    title: '音楽',
    body: '啓発やキャンペーンとして閉じず、働き方を更新するための入口として曲を使います。曲は判断や助言ではなく、話し始める合図です。',
    image: '/songs/still/hataraki-kata-update.jpg',
    imageAlt: 'WORK UPDATE FEST 2026の楽曲「働き方アップデート」のビジュアル',
    tags: ['フェス形式', '試聴', '対話の入口'],
    href: '/resources/songs',
    action: '音楽集を開く',
    audio: '/songs/audio/hataraki-kata-update.mp3',
  },
  {
    id: 'toolkit-shelf-workshop',
    eyebrow: 'Workshop',
    title: 'フォーラム',
    body: 'ワークコンディション・フォーラムの図解やPDFを、研修、勉強会、職場会議で使うための素材棚として扱います。',
    image: '/images/work-condition-forum-virtual-stage-v1.webp',
    imageAlt: 'ワークコンディション・フォーラムの仮想ステージ画像',
    tags: ['フォーラム', '研修素材', '会議共有'],
    href: '/events/work-condition-forum',
    action: 'フォーラムを見る',
  },
  {
    id: 'toolkit-shelf-organization-checklist',
    eyebrow: 'Checklist',
    title: '就労支援機関チェックリスト',
    body: '支援機関や診断名に関する確認を、サービス名や病名で止めず、仕事条件の確認に戻すための入口です。',
    image: '/images/work-condition-lens-treatment-work-time-v1.webp',
    imageAlt: '治療と仕事の時間を同じ地図で見るチェックリスト素材',
    tags: ['organizations/diagnosis', '確認項目', '支援接続'],
    href: '/organizations/diagnosis',
    action: 'チェックリストへ',
  },
] as const;

const toolkitUseModes = [
  {
    title: '5分でつかむ',
    body: '図解、SNSカード、4コマを一つ選び、何が本人問題に見えていたかだけを話す。',
  },
  {
    title: '30分で話す',
    body: '場面カードと設計ボードを並べ、時間、情報、動線、評価、支援のどこを見るかに分ける。',
  },
  {
    title: '研修・イベントで使う',
    body: '音楽、フォーラム資料、記事、設計ガイドを組み合わせ、感覚的入口から仕事条件の議論へ進む。',
  },
] as const;

type ToolkitUsePackageMaterial = {
  label: string;
  detail: string;
  href: string;
  icon: LucideIcon;
};

type ToolkitUsePackage = {
  id: string;
  title: string;
  lead: string;
  scene: string;
  materials: readonly ToolkitUsePackageMaterial[];
  outcome: string;
};

const toolkitUsePackages: readonly ToolkitUsePackage[] = [
  {
    id: 'toolkit-use-package-first-meeting-map',
    title: '初回相談・初回会議で、同じ地図を見る',
    lead: '一言の相談をすぐ結論にせず、本人・職場・支援者が同じ仕事条件を見ながら話し始めるための組み合わせです。',
    scene: '初回面談、職場会議、支援機関との共有',
    materials: [
      {
        label: '仕事のコンディションマップ',
        detail: '何を仕事条件として見るかを一枚で共有する。',
        href: '#toolkit-infographic-work-condition-map',
        icon: Map,
      },
      {
        label: '相談事例集',
        detail: '断片的な相談を、確認したい条件へ広げる。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        icon: ClipboardList,
      },
      {
        label: '仕事設計ガイド',
        detail: '相談を、再利用できる設計視点へつなぐ。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-health-time-livelihood',
        ),
        icon: Network,
      },
    ],
    outcome: '誰かの問題として閉じず、どの条件を一緒に確認するかをそろえられます。',
  },
  {
    id: 'toolkit-use-package-manager-training',
    title: '管理職・人事研修で、個人問題化を止める',
    lead: '理解ある上司頼みや精神論に戻りやすいテーマを、手順、情報、評価、相談線として扱うための研修パッケージです。',
    scene: '管理職研修、人事勉強会、雇用管理の見直し',
    materials: [
      {
        label: '能力主義とエイブリズムの図解',
        detail: '能力評価がどこで人を狭く見てしまうかを確認する。',
        href: '#toolkit-infographic-bias-and-ableism',
        icon: Eye,
      },
      {
        label: '制度と雇用の図解',
        detail: '制度語を、職場で見直せる運用条件に翻訳する。',
        href: '#toolkit-infographic-policy-and-employment',
        icon: ShieldCheck,
      },
      {
        label: 'NBLレポート',
        detail: '現場と政策の論点を、短い論考として読む。',
        href: candidatePath('articles-social-questions'),
        icon: FileSearch,
      },
    ],
    outcome: '善意や個別対応を責めず、次に直せる仕事条件として話せるようにします。',
  },
  {
    id: 'toolkit-use-package-health-time',
    title: '難病・慢性疾患の健康時間を話す',
    lead: '休むか頑張るかではなく、通院、回復、仕事量、締切、評価を同じ時間軸で見るための組み合わせです。',
    scene: '治療と仕事の両立、復職、症状変動の相談',
    materials: [
      {
        label: '難病と健康時間の図解',
        detail: '体調変動を、勤務表と評価から切り離さずに見る。',
        href: '#toolkit-infographic-rare-disease-health-time',
        icon: Stethoscope,
      },
      {
        label: '音楽集',
        detail: '言いにくいテーマを、話し始める入口にする。',
        href: '/resources/songs',
        icon: Sparkles,
      },
      {
        label: '障害種類から見る',
        detail: '疾病名から、仕事条件の確認へ進む。',
        href: candidateAnchorPath('work-condition-window', 'condition-window-intractable-disease'),
        icon: SearchCheck,
      },
    ],
    outcome: '健康を守る行動が評価低下として働く地点を、先に見つけやすくします。',
  },
  {
    id: 'toolkit-use-package-forum-workshop',
    title: '研修・フォーラム後に、実装へ残す',
    lead: 'イベントの気づきをその場限りにせず、二週間で確認する条件、会議で使う図、次に読む論点へ残します。',
    scene: 'フォーラム、研修後フォロー、プロジェクト会議',
    materials: [
      {
        label: 'ワークコンディション・フォーラム',
        detail: '講演や会議で使える資料群を開く。',
        href: '/events/work-condition-forum',
        icon: UsersRound,
      },
      {
        label: '5つの設計領域',
        detail: '気づきを、健康時間、情報参加、手順変更、評価、支援接続へ振り分ける。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-health-time-livelihood',
        ),
        icon: Layers3,
      },
      {
        label: 'NBLレポート索引',
        detail: '参加者の問いに近い論考へ戻る。',
        href: candidateAnchorPath('articles-social-questions', 'nbl-report-editorial-map'),
        icon: FileText,
      },
    ],
    outcome: '「よかった」で終わらせず、次の会議で確認できる仕事条件へ変換します。',
  },
] as const;

const toolkitBoundaryNotes = [
  '音楽や図解は、助言や判定の代わりではありません。',
  '個別相談、医学・法務・雇用判断、合理的配慮の最終判断には使いません。',
  '反応数や盛り上がりは、知識の正しさの証拠ではなく、次に直す説明・図解・教材の手がかりとして扱います。',
] as const;

type ToolkitSelectedInfographic = {
  title: string;
  file: string;
  alt: string;
  lens: string;
  use: string;
};

type ToolkitSelectedInfographicGroup = {
  id: string;
  navLabel: string;
  title: string;
  lead: string;
  usefulFor: string;
  items: readonly ToolkitSelectedInfographic[];
};

const toolkitSelectedInfographicBasePath = '/images/axiom-toolkit-selected-infographics';

const toolkitSelectedInfographicSrc = (file: string) =>
  `${toolkitSelectedInfographicBasePath}/${file}`;

const toolkitSelectedInfographicGroups: readonly ToolkitSelectedInfographicGroup[] = [
  {
    id: 'toolkit-infographic-employment-support-expertise',
    navLabel: '専門性の再整理',
    title: '就労支援の専門知識リストを、現場で使う形に読み替える',
    lead: 'ICFと就労支援のプロセスを最初に置き、専門知識を本人・仕事・環境・支援・時間の関係として読み直す棚です。',
    usefulFor:
      '病名や配慮名で止まらず、相談、研修、会議、支援記録を同じ見方で読み始める入口として使う。',
    items: [
      {
        title: 'ICFで生活機能を読む',
        file: 'top-22.png',
        alt: 'ICFの生活機能と環境因子を示す図解',
        lens: '健康状態だけでなく、活動、参加、環境、個人因子の関係を見る。',
        use: '病名説明から相互作用の説明へ切り替える時に使う。',
      },
      {
        title: '就労支援のプロセス',
        file: 'top-15.png',
        alt: '障害者就労支援のプロセスを示す図解',
        lens: '相談、準備、職場理解、定着、見直しを一連の流れとして見る。',
        use: '支援が単発助言で止まっている時、次の工程を確認する。',
      },
      {
        title: '障害者就労支援の5つの核',
        file: 'employment-support-five-core-v1.png',
        alt: '障害者就労支援の専門知識とスキルを5つの核で整理した図解',
        lens: '知識・スキルの一覧を、構造的に読む、共同で把握する、設計する、実装する、学び直す流れとして見る。',
        use: '支援者研修やチーム会議で、支援を病名別メニューや就職ゴールに閉じないために使う。',
      },
      {
        title: '就労支援の言葉をアップデートする',
        file: 'employment-support-vocabulary-update-v1.png',
        alt: '就労支援で使う言葉を支援の質が上がる言い方へ更新する図解',
        lens: '障害特性、アセスメント、連携などの言葉を、本人、仕事、環境、支援条件が見える言い方へ変える。',
        use: '記録、研修、会議資料の言葉が本人分類や配慮メニュー化に寄っていないかを点検する。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-work-condition-map',
    navLabel: '全体地図',
    title: '仕事条件を一枚で見る',
    lead: '本人、仕事、環境、支援、時間、制度が別々に語られてしまう時、同じ仕事条件の地図を見ながら話すための棚です。',
    usefulFor: '相談、会議、研修の冒頭で「どこを見ているのか」をそろえる。',
    items: [
      {
        title: '仕事のコンディションマップ',
        file: 'top-13.png',
        alt: '仕事のコンディションマップA3',
        lens: '本人、仕事、環境、支援、時間を同じ画面で見る。',
        use: '複数の関係者が話す前に、共通地図として置く。',
      },
      {
        title: '本人中心の就労支援の総合',
        file: 'top-16.png',
        alt: '本人中心の就労支援を総合的に示す図解',
        lens: '本人中心を、本人任せではなく支援と職場条件の連動として見る。',
        use: '支援者研修で、関係者の役割分担を話す時に使う。',
      },
      {
        title: '治療と仕事の両立',
        file: 'top-14.png',
        alt: '治療と仕事の両立を示す図解',
        lens: '治療時間、回復時間、仕事量、評価時期を同じ時間軸で見る。',
        use: '通院配慮を単なる休暇扱いにしないために使う。',
      },
      {
        title: '体調変動と働き方',
        file: 'top-03.png',
        alt: '体調が変わる人に変わらない働き方を押しつけていないかを示す図解',
        lens: '体調変動を本人の不安定さではなく、働き方との噛み合わせとして見る。',
        use: '「昨日は元気だった」という誤読をほどく時に使う。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-bias-and-ableism',
    navLabel: '偏見の読み替え',
    title: '能力主義とエイブリズムをほどく',
    lead: '働ける、できる、努力する、迷惑をかけない、という言葉の奥にある見えにくい前提を見直す棚です。',
    usefulFor: '啓発、管理職研修、支援者研修で、本人問題化を止める。',
    items: [
      {
        title: '能力主義の3つの話',
        file: 'top-01.png',
        alt: '能力主義に含まれる3つの話を整理した図解',
        lens: '公平、競争、自己責任が混ざる時、どの能力観で話しているかを見る。',
        use: '能力評価の議論が精神論に寄る前に使う。',
      },
      {
        title: 'Equality, Equity, Justice',
        file: 'top-02.png',
        alt: 'Equality, Equity, Justiceの違いを示す図解',
        lens: '同じ扱い、公平な調整、構造そのものの変更を分けて見る。',
        use: '配慮を特別扱いと誤解しやすい場面で使う。',
      },
      {
        title: 'エイブリズム',
        file: 'top-09.png',
        alt: 'エイブリズムの仕組みを示す図解',
        lens: 'できないからではなく、できる前提の設計が人を排除することを見る。',
        use: '障害者雇用を本人努力だけで語る流れを変える。',
      },
      {
        title: '脱エイブリズムまんが',
        file: 'top-23.png',
        alt: 'ヒーロー化ではなく前提を変えることを示す漫画',
        lens: '個人を称える前に、困りごとを生む設計を変える。',
        use: '感情的な啓発から仕事設計の話へ戻す。',
      },
      {
        title: '内面化された障害差別',
        file: 'top-24.png',
        alt: '内面化された障害差別を本人の弱さに見せない図解',
        lens: '本人が自分を責める背景に、周囲の前提や評価があることを見る。',
        use: '自己責任感や申し訳なさが強い相談を扱う時に使う。',
      },
      {
        title: '昭和から令和へ',
        file: 'top-18.png',
        alt: '古い雇用観から新しい仕事設計へ更新する図解',
        lens: '古い働き方の常識が、現在の多様な参加を妨げることを見る。',
        use: '組織文化や管理職研修の入口に使う。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-policy-and-employment',
    navLabel: '制度・雇用',
    title: '制度を、現場の仕事設計へ戻す',
    lead: '合理的配慮、雇用率、雇用枠、企業負担の話を、制度名で止めず、現場の設計課題へ戻す棚です。',
    usefulFor: '人事、企業、行政、研修で、制度説明を実装の話へつなげる。',
    items: [
      {
        title: '合理的配慮',
        file: 'top-11.png',
        alt: '合理的配慮を精神論ではなく経営戦略として示す図解',
        lens: '配慮を気遣いではなく、働く条件の設計として見る。',
        use: '配慮の名前だけで会議が止まる時に使う。',
      },
      {
        title: '合理的配慮の米国トレンド',
        file: 'top-12.png',
        alt: '合理的配慮の日米比較と米国トレンドを示す図解',
        lens: '制度差をそのまま輸入せず、実装の考え方を比較して見る。',
        use: '海外事例を表面的に引用しないために使う。',
      },
      {
        title: '障害者雇用の正常化',
        file: 'top-19.png',
        alt: '企業へのしわ寄せを解消する障害者雇用の正常化を示す図解',
        lens: '企業負担の問題を、職場だけで抱え込ませない構造として見る。',
        use: '企業、支援機関、行政の役割を分ける議論で使う。',
      },
      {
        title: '障害者雇用率制度の更新',
        file: 'top-20.png',
        alt: '障害者雇用率制度の基本的考え方の更新を示す図解',
        lens: '人数達成だけでなく、参加の質や仕事設計へ制度をつなげる。',
        use: '雇用率の話を質の話へ広げる時に使う。',
      },
      {
        title: '障害者雇用枠',
        file: 'top-21.png',
        alt: '障害者雇用枠を入口として捉え直す図解',
        lens: '雇用枠をゴールではなく、仕事条件確認の入口として見る。',
        use: '雇用枠か一般枠かの二択に見える場面で使う。',
      },
      {
        title: '疲弊しない障害者雇用',
        file: 'top-34.png',
        alt: '疲弊しない障害者雇用の考え方を示す図解',
        lens: '本人、支援者、企業の誰か一人に負荷を寄せない構造を見る。',
        use: '現場が疲れ切る前に支援接続を見直す。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-support-pathways',
    navLabel: '支援接続',
    title: '支援接続、研修、海外比較を使い分ける',
    lead: '就労選択支援、基礎的研修、IPS、海外比較、難病相談支援センターを、制度紹介ではなく接続設計として見る棚です。',
    usefulFor: '支援機関、研修、地域連携、政策検討で「誰が何をつなぐか」を話す。',
    items: [
      {
        title: '就労選択支援',
        file: 'top-08.png',
        alt: '就労選択支援をインクルーシブ雇用の要として示す図解',
        lens: '本人の選択を、仕事情報、体験、支援接続と結びつけて見る。',
        use: '入口支援を単なる進路選択で終わらせない。',
      },
      {
        title: '基礎的研修から始まる',
        file: 'top-10.png',
        alt: '基礎的研修で障害者就労支援を変える図解',
        lens: '研修を知識伝達ではなく、支援の共通言語づくりとして見る。',
        use: '支援者育成や地域の共通研修を設計する時に使う。',
      },
      {
        title: 'IPSの本質',
        file: 'top-06.png',
        alt: 'IPSの本質を仕事と支援の同時設計として示す図解',
        lens: '早く就職することだけでなく、仕事と支援を同時に設計する。',
        use: 'IPSを手法名で消費せず、支援原理を読む時に使う。',
      },
      {
        title: 'IPSの日本での理解',
        file: 'top-07.png',
        alt: 'IPSが日本に合わないのかを問い直す図解',
        lens: '海外手法と国内制度の違いを、合う合わないだけで終わらせない。',
        use: '制度差を越えて使える構造を考える時に使う。',
      },
      {
        title: '諸外国の3層',
        file: 'top-17.png',
        alt: '諸外国の障害者就労支援と雇用支援を3層で見る図解',
        lens: '国ごとの制度差を、支援、雇用、社会参加の層で比較する。',
        use: '海外動向を日本の実装課題へ翻訳する時に使う。',
      },
      {
        title: '難病相談支援センターの変革課題',
        file: 'top-32.png',
        alt: '難病相談支援センターの課題と改革方向性を示す図解',
        lens: '相談窓口を、医療・生活・仕事をつなぐ翻訳拠点として見る。',
        use: '地域の難病支援体制を見直す時に使う。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-rare-disease-health-time',
    navLabel: '難病・健康時間',
    title: '難病と健康時間を、仕事条件として読む',
    lead: '見えにくい症状、手帳制度の外側、通院、体調変動、制度の穴を、本人の問題ではなく仕事条件と支援接続で読む棚です。',
    usefulFor: '難病の就労相談、企業説明、支援機関連携、政策議論で使う。',
    items: [
      {
        title: '難病患者に共通した経験',
        file: 'top-28.png',
        alt: '難病患者に共通した経験をまとめた図解',
        lens: '診断名が違っても、見えにくさ、説明負荷、制度の谷間が重なる。',
        use: '個別疾患の話から共通構造へ移る時に使う。',
      },
      {
        title: '難病と仕事あるある',
        file: 'top-25.png',
        alt: '難病と仕事に関するあるあるトップ10',
        lens: 'よくある困りごとを、笑い話で終わらせず設計課題として見る。',
        use: '当事者の経験を職場に伝える入口として使う。',
      },
      {
        title: '難病と支援機関あるある',
        file: 'top-26.png',
        alt: '難病と支援機関のすれ違いをまとめた図解',
        lens: '助けを求めても支援制度に乗りにくい理由を、接続の問題として見る。',
        use: '支援機関側の入口改善を話す時に使う。',
      },
      {
        title: '難病フォーカスグループの意見',
        file: 'top-27.png',
        alt: '難病フォーカスグループの意見をまとめた図解',
        lens: '当事者の語りを、制度、職場、支援接続のどこに届いていないかで読む。',
        use: '声を紹介で終わらせず、次に変える条件を話す時に使う。',
      },
      {
        title: '手帳がない、でも働く上の困難がある',
        file: 'top-04.png',
        alt: '手帳がない場合の仕事上の困難を示す図解',
        lens: '制度対象かどうかと、仕事上の困難の有無を分けて見る。',
        use: '手帳がないから支援不要という誤読を避ける。',
      },
      {
        title: '制度のリストにない生活の困難',
        file: 'top-05.png',
        alt: '制度のリストにない生活の困難を示す図解',
        lens: '制度分類に入らない困難も、仕事条件には影響することを見る。',
        use: '制度説明と生活実態のズレを話す時に使う。',
      },
      {
        title: '難病制度の穴',
        file: 'top-31.png',
        alt: '難病制度の穴を示す図解',
        lens: '医療、生活、就労の制度が分かれることで生じる谷間を見る。',
        use: '政策や支援体制の改善論点を整理する。',
      },
      {
        title: '難病就労支援の投資効果',
        file: 'top-30.png',
        alt: '難病就労支援の投資効果を示す図解',
        lens: '就労支援をコストではなく、本人・企業・社会への投資として見る。',
        use: '支援体制の優先順位を話す時に使う。',
      },
      {
        title: '難病就労支援の諸外国の動向',
        file: 'top-29.png',
        alt: '難病就労支援の諸外国の動向を示す図解',
        lens: '国ごとの制度差の中に、普遍的な支援接続の課題を見る。',
        use: '海外動向を現在の日本の課題へつなげる。',
      },
      {
        title: '難病分かって欲しい',
        file: 'top-33.png',
        alt: '難病について分かって欲しいことをまとめた図解',
        lens: '分かってほしい気持ちを、職場で確認できる条件へ翻訳する。',
        use: '本人の説明負荷を減らす資料として使う。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-ibd-scenes',
    navLabel: 'IBD',
    title: 'IBDの生活接点を4コマで読む',
    lead: 'トイレ、通勤、会議、通院、開示、在宅勤務、学習機会など、見えにくい準備と不安を場面で読める棚です。',
    usefulFor: '疾患名の説明ではなく、仕事上どの条件を確認するかを話す。',
    items: [
      {
        title: 'その荷物、見えていません',
        file: 'ibd-01.png',
        alt: 'IBDの見えない準備をバックパックで示す図解',
        lens: 'トイレ、食事、薬、通院、説明負荷など、見えない準備を見る。',
        use: '「普通に見える」人の準備コストを共有する。',
      },
      {
        title: '初出勤とトイレマップ',
        file: 'ibd-02.png',
        alt: '初出勤とトイレマップを示すIBD4コマ',
        lens: '職場のトイレ動線と安心感を、仕事開始条件として見る。',
        use: '初日や異動時の環境確認に使う。',
      },
      {
        title: '会議室とトイレの往復',
        file: 'ibd-03.png',
        alt: '会議室とトイレの往復を示すIBD4コマ',
        lens: '会議時間、退席しやすさ、座席、議事共有を同時に見る。',
        use: '会議参加の条件を調整する時に使う。',
      },
      {
        title: '満員電車とお腹のタイミング',
        file: 'ibd-04.png',
        alt: '満員電車とお腹のタイミングを示すIBD4コマ',
        lens: '通勤時間、混雑、トイレ不安、在宅や時差出勤を結びつけて見る。',
        use: '通勤を勤務外の自己責任にしないために使う。',
      },
      {
        title: '行きたいけど、行けない夜',
        file: 'ibd-05.png',
        alt: '行きたいけど行けない夜を示すIBD4コマ',
        lens: '飲み会や交流が、体調管理や評価とどう関係するかを見る。',
        use: '非公式参加を強制しない職場文化を話す。',
      },
      {
        title: '元気そう、って言われるけど',
        file: 'ibd-06.png',
        alt: '元気そうと言われるけれど困難があることを示すIBD4コマ',
        lens: '外見と体調、説明負荷、誤解を分けて見る。',
        use: '見た目で判断しない説明に使う。',
      },
      {
        title: '通院スケジュール地獄',
        file: 'ibd-07.png',
        alt: '通院スケジュール地獄を示すIBD4コマ',
        lens: '通院、検査、回復、仕事量、予定変更を同じ時間軸で見る。',
        use: '通院配慮を業務設計に組み込む時に使う。',
      },
      {
        title: '履歴書と秘密',
        file: 'ibd-08.png',
        alt: '履歴書と秘密を示すIBD4コマ',
        lens: '開示するかしないかではなく、何を何のために共有するかを見る。',
        use: '応募、面接、採用後の情報共有を話す。',
      },
      {
        title: 'がまんの先にあったもの',
        file: 'ibd-09.png',
        alt: 'がまんの先にあったものを示すIBD4コマ',
        lens: '我慢を美徳にせず、悪化前の相談線を見る。',
        use: '早めの相談や休憩基準を決める時に使う。',
      },
      {
        title: '在宅勤務になって変わったこと',
        file: 'ibd-10.png',
        alt: '在宅勤務になって変わったことを示すIBD4コマ',
        lens: '場所の変更が、トイレ、食事、体調管理、集中にどう効くかを見る。',
        use: '在宅勤務を特権ではなく条件調整として説明する。',
      },
      {
        title: '資格を取りたいのに',
        file: 'ibd-11.png',
        alt: '資格を取りたいのに困難があることを示すIBD4コマ',
        lens: '学習機会、試験、体調、キャリア成長を同じ設計に入れる。',
        use: '定着だけでなく成長機会を話す時に使う。',
      },
    ],
  },
  {
    id: 'toolkit-infographic-collagen-scenes',
    navLabel: '膠原病',
    title: '膠原病の変動と生活条件を4コマで読む',
    lead: '疲労、日差し、感染、水分、手指、階段、通院、病名説明など、職場で見落とされやすい条件を場面で読める棚です。',
    usefulFor: '体調変動を本人の気分や努力不足に見せないために使う。',
    items: [
      {
        title: 'からだの中の天気予報',
        file: 'collagen-01.png',
        alt: '膠原病の見えない全身性を天気予報として示す図解',
        lens: '体調を単発症状ではなく、変動する全身条件として見る。',
        use: '本人の説明負荷を減らす入口に使う。',
      },
      {
        title: '人生すごろく',
        file: 'collagen-02.png',
        alt: '膠原病と人生の変化をすごろくとして示す図解',
        lens: '治療、生活、仕事、将来の選び直しを長い時間軸で見る。',
        use: '復職や継続就労を長期設計として話す。',
      },
      {
        title: '朝から、もうフルマラソン後？',
        file: 'collagen-03.png',
        alt: '朝から強い疲労があることを示す膠原病4コマ',
        lens: '疲労を気合い不足ではなく、勤務開始前の消耗として見る。',
        use: '始業時間、仕事密度、回復余地を話す。',
      },
      {
        title: '昨日は元気だったよね？',
        file: 'collagen-04.png',
        alt: '昨日は元気だったのに今日はつらいことを示す膠原病4コマ',
        lens: '日ごとの変動を、矛盾ではなく条件として見る。',
        use: '変動を前提にした業務配分を話す。',
      },
      {
        title: '通院も、仕事の一部',
        file: 'collagen-05.png',
        alt: '通院も仕事の一部として示す膠原病4コマ',
        lens: '通院、検査、服薬、回復を働くための時間条件として見る。',
        use: '治療時間を勤務設計に入れる時に使う。',
      },
      {
        title: '日差しと体調の関係',
        file: 'collagen-06.png',
        alt: '日差しと体調の関係を示す膠原病4コマ',
        lens: '日差し、移動、席、外出予定を体調条件として見る。',
        use: '外勤、通勤、窓際席、休憩場所を話す。',
      },
      {
        title: 'あなたの風邪、こっちには重症かも',
        file: 'collagen-07.png',
        alt: '感染リスクの違いを示す膠原病4コマ',
        lens: '感染リスクを過敏さではなく、免疫や治療の条件として見る。',
        use: '体調不良時の出勤、マスク、会議参加を話す。',
      },
      {
        title: '階段と荷物がラスボス',
        file: 'collagen-08.png',
        alt: '階段と荷物が大きな負荷になることを示す膠原病4コマ',
        lens: '移動、荷物、階段、痛みを職場接触点として見る。',
        use: '動線、備品、荷物、担当場所を見直す。',
      },
      {
        title: '手袋が制服です',
        file: 'collagen-09.png',
        alt: '手袋が必要な場面を示す膠原病4コマ',
        lens: '手指、冷え、衛生、見た目、作業道具を同時に見る。',
        use: '服装や道具を本人の好みで片づけない。',
      },
      {
        title: 'お水が手放せない会議',
        file: 'collagen-10.png',
        alt: '水分が必要な会議場面を示す膠原病4コマ',
        lens: '水分、薬、発声、会議時間、席を参加条件として見る。',
        use: '会議ルールや飲食可否を話す。',
      },
      {
        title: '病名説明ルーレット',
        file: 'collagen-11.png',
        alt: '病名説明の難しさを示す膠原病4コマ',
        lens: '病名を全部説明する負荷と、仕事に必要な情報共有を分ける。',
        use: '開示範囲と説明資料を考える時に使う。',
      },
      {
        title: 'また休み？と言われた日',
        file: 'collagen-12.png',
        alt: 'また休みと言われた日のつらさを示す膠原病4コマ',
        lens: '欠勤を責める前に、悪化、回復、代替手順、相談線を見る。',
        use: '休み方と戻り方を設計する時に使う。',
      },
    ],
  },
] as const;

const toolkitSelectedInfographicCount = toolkitSelectedInfographicGroups.reduce(
  (sum, group) => sum + group.items.length,
  0,
);

function findToolkitSelectedInfographicById(itemId: string) {
  for (const group of toolkitSelectedInfographicGroups) {
    const item = group.items.find((candidate) => toolkitInfographicId(candidate.file) === itemId);

    if (item) {
      return item;
    }
  }

  return null;
}

export type AxiomToolkitInfographicShareItem = {
  id: string;
  title: string;
  description: string;
  groupTitle: string;
  imageSrc: string;
  imageAlt: string;
  targetPath: string;
  sharePath: string;
};

export function buildAxiomToolkitInfographicShareItems(): readonly AxiomToolkitInfographicShareItem[] {
  return toolkitSelectedInfographicGroups.flatMap((group) =>
    group.items.map((item) => {
      const id = toolkitInfographicId(item.file);

      return {
        id,
        title: item.title,
        description: `${item.lens} ${item.use}`,
        groupTitle: group.title,
        imageSrc: toolkitSelectedInfographicSrc(item.file),
        imageAlt: item.alt,
        targetPath: toolkitInfographicContentPath(id),
        sharePath: toolkitInfographicSharePath(id),
      };
    }),
  );
}

const deepPageModules: Record<AxiomNextNblSiteSurface, readonly DeepPageModule[]> = {
  reader_facing_top_home: [
    {
      eyebrow: 'このサイトの中心',
      title: '働きづらさを、人の問題で終わらせない。',
      lead: '疲れ、説明しづらさ、評価の不透明さ、通勤や手順の負荷、支援の分断。それらを本人の弱さや職場の善意だけで片づけず、仕事・環境・支援・時間・評価の関係として見直します。',
      cards: [
        {
          title: '本人の問題に閉じない',
          body: '体調や特性の説明で終わらせず、仕事量、手順、情報形式、回復時間、評価との関係を見る。',
          tag: 'Person',
        },
        {
          title: '制度名で止まらない',
          body: '合理的配慮や支援策名を、現場で確認できる作業、時間、相談線、評価運用へ翻訳する。',
          tag: 'Work',
        },
        {
          title: '関係者で同じ地図を見る',
          body: '本人、企業、支援者、医療、制度が別々の言葉で話している状態を、共有できる仕事条件へ戻す。',
          tag: 'Map',
        },
        {
          title: '社会の学びへ育てる',
          body: '相談、研修、記事、図解、制度検討を一回限りで終わらせず、次の理解と実装へ循環させる。',
          tag: 'Loop',
        },
      ],
    },
    {
      eyebrow: '読者別の入口',
      title: '近い言葉から入って、同じ仕事条件の地図へ進む。',
      lead: 'このサイトは、専門家向けの体系をそのまま置くのではなく、読者が実際に持ちやすい問いから入れるように作っています。',
      cards: [
        {
          title: '状況を直感的につかみたい',
          body: 'まずは「8つの課題」で、何が古くて新しい問題なのかを4コマで見る。',
          tag: '8課題',
        },
        {
          title: '相談に近いものを探したい',
          body: '相談事例で、一言の相談がどのように見立てと確認事項へ広がるかを見る。',
          tag: '相談',
        },
        {
          title: '仕事を設計し直したい',
          body: '設計ガイドで、健康時間、情報形式、移動、評価、支援接続を具体的な設計領域として読む。',
          tag: '設計',
        },
        {
          title: '会議や研修で共有したい',
          body: 'NBLレポートやツールキットで、議論を始めるための記事、図解、4コマ、音楽、資料へ進む。',
          tag: '共有',
        },
      ],
    },
  ],
  scene_entry_use_cases: [
    {
      eyebrow: '古くて新しい課題',
      title: '8つの古くて新しい課題を、仕事条件の地図へ。',
      lead: '抽象的な説明の前に、昔から理念や制度では語られてきたのに解けなかった課題を、4コマで共通認識へ変えます。',
      cards: [
        {
          title: '数字・名前で止まる',
          body: '雇用率や診断名を入口にしつつ、役割、評価、通勤、仕事量、情報形式、支援条件へ広げる。',
          tag: '1-2',
        },
        {
          title: '時間・情報が分断される',
          body: '通院、治療、回復、仕事密度、本人・企業・医療・福祉・行政の情報を同じ地図に置く。',
          tag: '3-4',
        },
        {
          title: '制度・善意に依存する',
          body: '制度説明や理解ある上司を、作業、手順、共有範囲、相談線、記録、引き継ぎへ翻訳する。',
          tag: '5-6',
        },
        {
          title: '情報と学びを循環させる',
          body: '検索、SNS、AI要約、研修、政策、相談の問いを、次に確認する仕事条件と教材改稿へ戻す。',
          tag: '7-8',
        },
      ],
    },
    {
      eyebrow: '三者の読み',
      title: '本人・職場・支援者が、同じ場面を別の言葉で読んでいる。',
      lead: '場面ページの目的は、正解を出すことではなく、同じ画面を見ながらズレている読みを並べることです。',
      cards: [
        {
          title: '本人の読み',
          body: '責められたくない、迷惑をかけたくない、でも何を言えばよいか分からない。',
        },
        {
          title: '職場の読み',
          body: 'どこまで聞いてよいか、評価や業務配分とどうつなげるかが分からない。',
        },
        { title: '支援者の読み', body: '本人の安心と職場の運用を、どの順番でつなぐかを見極める。' },
        {
          title: '次の確認',
          body: '誰が何を変えられるか、まだ足りない文脈は何かを相談事例へ送る。',
        },
      ],
    },
  ],
  consultation_case_reading_collection: [
    {
      eyebrow: '相談入口ツール',
      title: '一言の相談から、見立てと次の確認へ進む。',
      lead: '立場、近い一言、困りごと、近い事例を選びながら、相談を責める言葉ではなく仕事条件の地図へ変えます。',
      cards: [
        { title: '健康時間', body: '疲れ、通院、回復時間、締切、仕事密度、評価時期が重なる相談。' },
        { title: '開示と共有範囲', body: '誰に、何を、どこまで、どの言葉で伝えるかが難しい相談。' },
        {
          title: '手順理解と変更',
          body: '手順書、口頭指示、急な変更、確認方法、切替負荷が絡む相談。',
        },
        {
          title: '職場内外の移動',
          body: '通勤、職場内移動、休憩場所、道具、姿勢、安全動線の相談。',
        },
        { title: '評価と役割', body: '働けているが、評価、成長、役割、期待値調整が止まる相談。' },
        { title: '就職前・移行', body: '就職前の仕事像、体験不足、応募前不安、復職/転職の相談。' },
      ],
    },
    {
      eyebrow: '1件の相談を読む順番',
      title: '広い相談入口と、個別判断しない境界を両立する。',
      lead: '静的ページでも、将来の動的相談に戻せるよう、各相談を同じ読解手順で扱います。',
      cards: [
        { title: '観察', body: '相談文に書かれている事実と、まだ推測にすぎないことを分ける。' },
        {
          title: '暫定見立て',
          body: '本人・仕事・環境・支援・時間のどこに衝突がありそうかを置く。',
        },
        { title: '反対仮説', body: '別の説明、制度差、職場運用、情報不足、本人希望の違いを出す。' },
        { title: '確認質問', body: '具体的な助言前に必要な文脈を、関係者が確認できる問いにする。' },
      ],
    },
  ],
  twenty_one_views_work_design_guide: [
    {
      eyebrow: '状況レベル',
      title: '問題対応・早期対応・予防を、同じ地図で見る。',
      lead: '専門的な整理をそのまま貼るのではなく、読者が仕事・社会参加設計に使える状況レンズへ再編集します。',
      cards: [
        { title: '破綻・停止', body: '仕事や参加が止まり、本人説明や善意だけでは戻れない。' },
        { title: '高頻度支障', body: '時間、情報、動線、手順、評価、支援接続の詰まりが繰り返す。' },
        { title: '要調整', body: '誰が何を変えられるか、何を確認すべきかが見えている。' },
        { title: '安定・予防', body: '働き続ける質、役割、評価、再調整ループまで設計している。' },
      ],
    },
    {
      eyebrow: '設計領域',
      title: '最終的な数は固定せず、仕事・社会参加設計に効く束へまとめる。',
      lead: '未来の仕事・社会参加設計ガイドとしての実用性を保ちつつ、多様性を潰さないように結合・分割・名称変更できる余地を残します。',
      cards: [
        {
          title: '健康時間と仕事密度',
          body: '体調変動、通院、回復、締切、代替手順を同じ時間軸で見る。',
        },
        {
          title: '情報形式と参加',
          body: '視覚、聴覚、認知、言語、会議参加、警告、資料形式を分けて見る。',
        },
        {
          title: '移動・道具・接触点',
          body: '職場内外の移動、姿勢、道具、安全、休憩場所を仕事条件として見る。',
        },
        {
          title: '評価・成長・就職前',
          body: '評価、役割、成長、仕事像、移行、応募前体験をつないで見る。',
        },
      ],
    },
  ],
  article_social_question_library: [
    {
      eyebrow: '三層読み',
      title: '一撃の図解、見出し、深い解説を分ける。',
      lead: '社会の違和感を、感想や賛否で終わらせず、読者が現場で抱える問いから仕事条件の問いへ戻す編集設計として使います。',
      cards: [
        {
          title: '一撃の図解',
          body: '最初の画面で、何が本人問題化され、どの条件を見直すのかを示す。',
        },
        {
          title: '見出しで流し読み',
          body: '忙しい読者が、見出しだけで論点と方向転換を追えるようにする。',
        },
        {
          title: '深い解説',
          body: '総合知識に基づき、別の読み、まだ分からないこと、越えない境界を本文で示す。',
        },
        { title: '次の導線', body: '記事だけで終わらせず、相談事例、設計ガイド、ツールへ戻す。' },
      ],
    },
    {
      eyebrow: '読者の問い',
      title: '当事者・企業・支援者・政策議論の問いから始める。',
      lead: '公開記事は、NBL側が知っていることを説明する面ではなく、読者がすでに現場で抱えている違和感を、仕事条件として扱える問いへ整理する面です。',
      cards: [
        {
          title: '当事者・家族',
          body: '働きたいのに続かない、説明しても伝わらない、将来像が見えない、という切実さから入る。',
        },
        {
          title: '企業・管理職',
          body: '配慮したいが業務、評価、人員余力、情報共有とどう両立するか分からない、という悩みから入る。',
        },
        {
          title: '支援者・専門職',
          body: '本人の言葉、職場の制約、制度の言葉をどう同じ仕事場面へ翻訳するか、という負荷から入る。',
        },
        {
          title: '政策・社会議論',
          body: '雇用率、合理的配慮、AI、D&I、両立支援を、現場で変えられる参加条件へ戻す。',
        },
      ],
    },
    {
      eyebrow: '広がる理由',
      title: '社会問題の解決に向かう最小経路を示す。',
      lead: 'worth spreading な記事とは、強い主張のことではありません。読者の現実に近く、同時に社会の見方を変え、最初の一手まで見える論理です。',
      cards: [
        {
          title: '誤読を外す',
          body: '本人問題、企業の善意不足、制度の有無だけで止まる読みを外す。',
        },
        {
          title: '関係を置く',
          body: '人、仕事、環境、支援、時間、制度を同じ地図に置いて、詰まりの位置を見える化する。',
        },
        {
          title: '最初の一手',
          body: '大きな理念で終わらせず、会議、確認、図解、相談、設計ガイドへ移れる小さな経路を示す。',
        },
        {
          title: '広める価値',
          body: '障害者雇用の話を、誰もが活躍できる仕事・社会参加設計の問いへ広げる。',
        },
      ],
    },
  ],
  cognitive_support_toolkit_studio_multimodal_objects: [
    {
      eyebrow: '道具の束',
      title: '複雑な知識を、会議で使える形にする。',
      lead: '総合知識を文章だけで読ませず、図解、ワーク、場面、研修素材など複数の認知経路へ変換します。',
      cards: [
        { title: '一枚地図', body: '本人、仕事、環境、支援、時間、制度を同じ図に置く。' },
        { title: '確認ワーク', body: 'まだ分からないことを、面談や会議で確認できる問いにする。' },
        { title: '場面スクリプト', body: '本人・職場・支援者の読みのズレを、短い対話として扱う。' },
        {
          title: '研修素材',
          body: '記事、相談事例、場面を、研修やワークショップで使える教材へ変える。',
        },
      ],
    },
    {
      eyebrow: '使う場面',
      title: '長い説明を読む前に、同じ対象を見ながら話せるようにする。',
      lead: 'ツールキットは余った資料置き場ではなく、認知負荷を下げるための実装面です。',
      cards: [
        {
          title: '本人との面談',
          body: '何を伝えるかより先に、何がまだ言葉になっていないかを見る。',
        },
        { title: '職場会議', body: '配慮名ではなく、業務密度、手順、評価、相談線を一緒に見る。' },
        { title: '支援者研修', body: '助言の速さより、複数仮説と確認質問を作る力を育てる。' },
        { title: '社会発信', body: 'SNSや記事の問いを、誤読を増やさない図解へ変換する。' },
      ],
    },
  ],
  work_condition_window: [
    {
      eyebrow: 'カテゴリ入口',
      title: '障害種類から入っても、障害種類で終わらせない。',
      lead: 'データ数の多い難病だけに引きずられず、視覚、聴覚、内部、肢体、精神、発達、知的、高次脳などの重要なシグナルを残します。',
      cards: [
        {
          title: '視覚・聴覚など感覚障害',
          body: '情報形式、会議参加、警告、移動、コミュニケーション経路を見る。',
        },
        { title: '内部障害', body: '定期検診、治療時間、疲労、職務密度、勤務外の回復条件を見る。' },
        { title: '難病', body: '体調変動、予測困難性、開示、収入不安、戻り回路を区別して見る。' },
        {
          title: '肢体不自由・移動',
          body: '職場内外の移動、姿勢、道具、接触点、安全、休憩場所を見る。',
        },
        {
          title: '精神・発達・認知',
          body: '予測可能性、手順、切替、刺激環境、評価、支援接続を見る。',
        },
        {
          title: '知的・高次脳機能',
          body: '説明形式、反復、記憶補助、役割設計、周囲の翻訳条件を見る。',
        },
      ],
    },
    {
      eyebrow: '名前から条件へ',
      title: '病名・障害名は入口。確認するのは仕事条件。',
      lead: 'カテゴリページは、診断名別の答え表ではなく、相談事例と設計ガイドへ移るための変換面です。',
      cards: [
        { title: '時間', body: '勤務時間、回復時間、通院、締切、繁忙期、戻り方。' },
        { title: '情報', body: '口頭、文字、図、音、会議、警告、変更連絡。' },
        { title: '動線と接触点', body: '通勤、職場内移動、休憩、道具、姿勢、安全。' },
        { title: '評価と支援', body: '期待値、評価時期、相談線、外部支援、再調整ループ。' },
      ],
    },
  ],
  theory_method_trust_page: [
    {
      eyebrow: 'AI超読解の使いどころ',
      title: 'AIは最終判断ではなく、複雑な関係を読むために使う。',
      lead: 'ここで使うAIは、単なる検索や要約ではなく、断片情報を仮説的な相互作用構造へ変換する読解規律として位置づけます。',
      cards: [
        { title: '断片を分類する', body: '観察、推論、規範、提案を分け、事実と解釈を混ぜない。' },
        {
          title: '相互作用に置く',
          body: '本人、仕事、環境、支援、時間、制度、証拠状態の関係として読む。',
        },
        { title: '反対仮説を置く', body: '一つの説明に寄せず、別の説明や足りない文脈を並べる。' },
        {
          title: 'レビューで止める',
          body: '公開、最終判断、学習への反映を、人間の確認なしに進めない。',
        },
      ],
    },
    {
      eyebrow: '信頼の作り方',
      title: '強い専門性は、断定の強さではなく、止め方の明確さで支える。',
      lead: '読者に見せるのは、万能AIではなく、複雑さを扱いながら境界を越えない専門知識ネットワークです。',
      cards: [
        {
          title: '不完全なデータを使う',
          body: '現実の影として読み、欠損や偏りを明示して仮説化する。',
        },
        {
          title: '少数信号を守る',
          body: 'データ量の多い領域に、視覚・聴覚・移動・就職前の参加などを埋もれさせない。',
        },
        {
          title: '公開面へ翻訳する',
          body: '専門知識をそのまま出さず、読者の認知負荷に合わせて再編集する。',
        },
        { title: '個別判断にしない', body: '医療、法律、人事、合理的配慮の最終判断は行わない。' },
      ],
    },
  ],
  about_operating_boundary_page: [
    {
      eyebrow: 'NBLの責任',
      title: '人間的ビジョンと、AIネイティブな専門性を両方見せる。',
      lead: 'このページは免責文の置き場ではなく、何を実現しようとしていて、どこを越えないのかを明確にするページです。',
      cards: [
        {
          title: 'すること',
          body: '働きづらさを、本人だけでなく、仕事・環境・支援・時間の関係として読み直す。',
        },
        {
          title: '支えること',
          body: '本人、家族、支援者、企業、研修、政策の対話に使える言葉と図を作る。',
        },
        {
          title: 'しないこと',
          body: '診断、就労可否、法的判断、人事判断、合理的配慮の最終判断をしない。',
        },
        {
          title: '止めること',
          body: '公開、根拠の最終判断、個別相談化、内容更新は、それぞれ別の人間確認で止める。',
        },
      ],
    },
    {
      eyebrow: '運営導線',
      title: '公開面は、専門知識ネットワークを社会に渡す翻訳面である。',
      lead: 'SNSや記事は目的地ではなく、社会の問いを受け取り、知識ネットワークへ戻す循環として扱います。',
      cards: [
        { title: '読む', body: '場面、相談事例、視点、記事、ツールから入る。' },
        { title: '話す', body: '本人・職場・支援者が同じ対象を見ながら対話する。' },
        {
          title: '見直す',
          body: '読者の反応や新しい資料を、すぐ結論にせず、見直し候補として扱う。',
        },
        { title: '守る', body: '個別相談やセンシティブ情報を公開面で扱わない。' },
      ],
    },
  ],
};

const articleSocialQuestionDraftFullArticles: readonly ArticleSocialQuestionFullArticle[] = [
  {
    id: 'good-story-conditions',
    featureLabel: '特集 01',
    readingTime: '約7分',
    title: '「いい話」で終わらせない。成功を、次の人に渡せる条件へ。',
    category: '雇用の質',
    reader: '企業・支援者・研修担当者・政策議論',
    hook: '障害者雇用の成功例は、励ましにもなります。しかし、美談として消費された瞬間に、次の人を支える設計材料は失われます。問うべきなのは「誰が立派だったか」ではなく、「何が噛み合ったから働けたのか」です。',
    imageSrc: '/images/nbl-workdesign-post-cards/CAD-2026-06-04-05.png',
    imageAlt:
      '表面の成功談の下に、役割、環境、支援、時間、評価の根が広がっている様子を描いたイラスト',
    sections: [
      {
        heading: '成功談は、再現条件が抜けると次の人に届かない',
        body: '成功例は社会を動かす力を持っています。ただし、そこに「本人が頑張った」「職場が理解した」という物語だけが残ると、次に同じような困難を抱える人には届きません。成功談が本当に価値を持つのは、どの仕事条件が揃った時に、その人の力が仕事として現れたのかを次の現場へ渡せる時です。',
      },
      {
        heading: '「本人の努力」と「職場の善意」だけでは、設計が残らない',
        body: '現場では、成功が個人の美徳や担当者の熱意として語られがちです。しかし実際には、作業量をどこまで絞ったか、説明をどの形式にしたか、相談先が誰だったか、体調や生活の変化が起きた時に戻れる道があったか、評価の言葉が本人にも上司にも同じように見えていたかが重なっています。ここを落とすと、成功は「よい話」にはなっても、雇用の質を上げる知識にはなりません。',
      },
      {
        heading: '見るべき根は、役割、仕事量、情報形式、相談線、評価、戻り道',
        body: '成功場面を読む時は、根を六つに分けます。任せた役割は何か。仕事量や締切はどう調整されたか。情報や手順はどの形式で届いたか。相談線は人の善意ではなく仕組みとしてあったか。何を成果として評価したか。うまくいかない時に戻れる手順はあったか。この分解によって、成功談は「その人だけの話」から「次の人にも試せる条件」へ変わります。',
      },
      {
        heading: '研修や政策議論では、成功の空気ではなく条件を引き継ぐ',
        body: '企業研修、支援者研修、政策議論で成功例を使うなら、感動の共有で終えないことが重要です。成功の空気を広げるだけでは、別の職場、別の障害種類、別の生活条件に移した瞬間に使えなくなります。引き継ぐべきなのは、本人、仕事、環境、支援、時間、制度がどう噛み合ったかという条件の地図です。',
      },
    ],
    oldReading: '本人の努力と職場の善意があったから、うまくいった。',
    designReading:
      '役割、仕事量、情報形式、相談線、評価、戻り道が噛み合ったため、働ける条件が一時的に成立した。',
    firstMove:
      'うまくいった場面を一つ選び、誰が何を変えたのかを「役割・仕事量・情報形式・相談線・評価・戻り道」に分けてメモする。',
    discussionQuestions: [
      'この成功例で、本人以外の条件は何が変わっていたか。',
      '担当者が変わっても残せる条件はどれか。',
      '次の人に渡すなら、成功の根として何を記録に残すか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '成功談の裏にある条件を、相談の一言としてほどく。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '障害者雇用のニュースを、本人努力か企業責任かで終わらせたくない。',
          '診断名別の研修をしても、現場の判断が変わらない。',
          '本人とは整理できたのに、職場で何を変える話にすればよいか迷う。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '美談ではなく、役割・評価・支援接続として引き継ぐ。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-relationship-evaluation-growth',
        ),
        items: [
          '役割・評価・成長を、定着後の質として見る。',
          '目的限定の情報共有と、不利益不安を分ける。',
          '支援や研修を、誰が何を変えるかへ戻す。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '成功例を、次の職場で使える共有物に変える。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '成功条件メモ: 役割・仕事量・情報形式・相談線・評価・戻り道。',
          '研修ワーク: 美談を条件分解して、別職場に移せるか確認する。',
          '会議用一枚地図: 本人、仕事、環境、支援、時間、制度を同じ画面に置く。',
        ],
      },
    ],
  },
  {
    id: 'after-hiring-participation',
    featureLabel: '特集 02',
    readingTime: '約7分',
    title: '採用後の空白を埋める。参加は、雇った後に設計する。',
    category: '企業・雇用管理',
    reader: '本人・人事・管理職・支援者・制度設計に関わる人',
    hook: '採用できたことは大きな一歩です。しかし、配属後の役割、評価、相談線、成長、戻り道が空白のままなら、参加は入口で止まります。雇用の次に必要なのは、働き続ける条件を設計することです。',
    imageSrc: '/images/nbl-workdesign-post-cards/CAD-2026-06-04-02.png',
    imageAlt: '採用の入口から、役割設計、評価、成長、戻り道へ橋が続く様子を表した編集イラスト',
    sections: [
      {
        heading: '採用数は入口を示すが、参加の質までは示さない',
        body: '雇用率や採用人数は、社会参加の入口として重要です。ただし、そこだけを成果として見ると、採用後に何が起きているかが見えません。役割が狭いまま固定される。評価の言葉が曖昧なままになる。相談先が担当者の善意に依存する。成長機会が減る。こうしたことは、数字だけでは見落とされやすい参加の質です。',
      },
      {
        heading: '配属後の空白は、本人の不安と管理職の迷いとして現れる',
        body: '採用時には配慮事項や希望を確認していても、配属後の仕事の渡し方、仕事量の変え方、評価面談で扱う内容、体調や生活の変化が起きた時の相談線が決まっていないことがあります。その空白は、本人には「どこまで言ってよいか分からない」という不安として、管理職には「何を変えればよいか分からない」という迷いとして、支援者には「職場語へ翻訳し続ける負荷」として現れます。',
      },
      {
        heading: '役割と評価を曖昧にすると、働けていても育ちにくい',
        body: '定着しているように見えても、役割が広がらず、評価が曖昧で、成長の機会が用意されていなければ、参加は浅いままになります。仕事を続けることだけでなく、何を任せるのか、何を成果として見るのか、学び直しや配置変更をどう扱うのかまで設計すると、採用後の支援は「維持」から「参加の質」へ進みます。',
      },
      {
        heading: '雇用管理は、採用後の節目を設計できるかで変わる',
        body: '最初に大きな制度を作る必要はありません。採用後一か月、三か月、半年の節目で、担当業務、仕事量、説明形式、評価項目、相談線、成長機会、戻り道を確認するだけでも、本人、上司、人事、支援者の見ている地図がそろいやすくなります。採用はゴールではなく、参加設計の始まりです。',
      },
    ],
    oldReading: '採用できたか、定着しているかを主な成果として見る。',
    designReading:
      '採用後に、配属、役割、仕事量、評価、相談線、成長、戻り道が設計されているかを見る。',
    firstMove:
      '採用後1か月、3か月、6か月で確認する項目を、配属、役割、仕事量、評価、相談線、成長機会、戻り道に分ける。',
    discussionQuestions: [
      '採用後に本人が最初に相談できる相手は誰か。',
      '評価される成果は、本人にも上司にも同じ言葉で見えているか。',
      'うまくいかない時に、配置や役割を選び直す道はあるか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '採用後の空白を、関係者それぞれの相談として読む。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '本人に任せてよい仕事量や役割の決め方が難しい。',
          '配慮はありますが、成長機会が減っている気がします。',
          '実習ではできたのに、採用後の条件へ引き継がれません。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '採用後を、定着だけでなく役割・評価・成長として設計する。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-relationship-evaluation-growth',
        ),
        items: [
          '役割・評価・成長を、参加の質として見る。',
          '就職前・入口・移行で分かった条件を採用後へ残す。',
          '支援者の言葉を、職場の確認行動へ再翻訳する。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '採用後の節目を、面談や会議で使える形にする。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '1か月・3か月・6か月の確認表。',
          '役割、仕事量、評価、相談線、成長機会、戻り道の面談メモ。',
          '配属後の見え方のずれを確認する4コマ/場面教材。',
        ],
      },
    ],
  },
  {
    id: 'health-time-work-condition',
    featureLabel: '特集 03',
    readingTime: '約7分',
    title: '「疲れやすい」で止めない。健康時間を、仕事の設計条件にする。',
    category: '健康時間・評価',
    reader: '本人・企業・支援者・産業保健・制度設計',
    hook: '「疲れやすい」は大切な言葉です。しかし、そのままでは職場で何を変えればよいかが見えにくい。健康時間を仕事密度、回復時間、通院、生活保障、評価時期と同じ地図に置くと、本人の弱さではなく設計できる条件が見えてきます。',
    imageSrc: '/images/nbl-workdesign-post-cards/CAD-2026-06-06-09.png',
    imageAlt: '疲れやすさを健康時間と仕事条件へ翻訳するための編集イラスト',
    sections: [
      {
        heading: '「疲れやすい」は入口であって、結論ではない',
        body: '本人が「疲れやすい」と言う時、そこには体調、薬、治療、通勤、睡眠、家事、収入不安、仕事量、評価時期が重なっていることがあります。職場側がその言葉だけを受け取ると、「短時間勤務にするか」「休ませるか」という狭い選択になりがちです。けれど本当に見るべきなのは、どの時間帯、どの仕事密度、どの移動や回復不足が働きづらさを強めているのかです。',
      },
      {
        heading: '体調変動は、仕事密度と回復時間の設計で強く変わる',
        body: '健康状態は本人の中だけで起きるものではありません。月末だけ崩れる、通院週に仕事が詰まる、繁忙期の後に戻れない、会議や移動で消耗して作業時間が残らない。こうした場面では、体調管理だけを求めても解けません。締切、勤務密度、回復時間、通院、通勤、休憩場所、代替手順を同じ時間軸で見る必要があります。',
      },
      {
        heading: '休む、減らす、戻る、選び直す自由を仕事条件に入れる',
        body: '健康時間の設計では、働ける時間を増やすことだけを目標にしません。休む、減らす、戻る、選び直す自由を仕事条件に入れることが必要です。体調が悪くなってから例外対応を探すのではなく、悪化前に仕事量を調整できるか、休んだ後に戻る手順があるか、評価面談で健康を守る行動が不利に扱われないかを先に確認します。',
      },
      {
        heading: '健康を守る行動が評価や収入の低下として罰にならないようにする',
        body: '健康時間は生活保障ともつながっています。休むと収入が減る、通院すると評価が下がる、無理をしないと役割が狭くなる。こうした構造があると、本人は体調を守る行動を取りにくくなります。健康時間を仕事の設計条件として扱うとは、勤務表だけでなく、評価、収入、役割、相談線まで同時に見ることです。',
      },
    ],
    oldReading: '疲れやすい人には、勤務時間を短くするか、休ませるかを考える。',
    designReading: '仕事密度、回復時間、通院、生活保障、評価時期、代替手順を同じ時間地図で見る。',
    firstMove:
      '本人、上司、支援者で一週間の時間地図を作り、崩れやすい時間帯、回復余地、通院、締切、評価予定を一枚に置く。',
    discussionQuestions: [
      '疲れやすさが強くなるのは、どの時間帯、どの仕事密度、どの移動や会議の後か。',
      '休む、減らす、戻る、選び直す手順は、本人にも上司にも見えているか。',
      '健康を守る行動が、評価や収入の低下として罰のように働いていないか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '疲れやすさを、体調だけでなく仕事時間の相談として読む。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '月末だけ体調が崩れます。仕事を続けられるのでしょうか。',
          '急な欠勤や体調変動に、現場がどう備えればよいか分からない。',
          '通勤だけで消耗し、仕事に入る前につらくなります。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '健康時間を、勤務表、生活保障、評価の同じ設計領域で見る。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-health-time-livelihood',
        ),
        items: [
          '変動する健康時間・仕事密度・回復余地。',
          '治療・検診時間を勤務表の外に追い出さない。',
          '通勤・移動・休憩場所を、仕事前提の消耗として見る。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '健康時間を、本人と職場が同じ表で見られる形にする。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '一週間の時間地図: 通院、締切、回復、移動、評価予定を一枚に置く。',
          '面談メモ: 休む、減らす、戻る、選び直す手順を確認する。',
          '会議用カード: 健康を守る行動が評価や収入の罰になっていないかを見る。',
        ],
      },
    ],
  },
  {
    id: 'employment-rate-work-design',
    featureLabel: '本格論考 01',
    readingTime: '約8分',
    title: '雇用率の先へ。人数管理から、参加の質を設計する。',
    category: '雇用の質・政策議論',
    reader: '行政・政策・企業・研究・支援者',
    hook: '雇用率は入口を開くために重要です。しかし、人数が増えたことだけでは、仕事の役割、成長、評価、健康時間、相談線が良くなったかは分かりません。これから問うべきなのは「何人働いているか」に加えて、「どんな条件なら人間の多様性が仕事として現れるか」です。',
    imageSrc: '/images/work-condition-lens-employment-quality-v1.png',
    imageAlt: '雇用率の数字から、役割、評価、健康時間、支援接続へ視点が広がる図解',
    sections: [
      {
        heading: '数字は入口を開くが、仕事の中身までは語らない',
        body: '雇用率や採用数は、障害者雇用を社会的に進めるための強い仕組みです。一方で、その数字だけを成果として読むと、配属後の役割が狭いままか、評価が曖昧なままか、健康を守る行動が不利に働いていないか、支援が途切れていないかが見えにくくなります。人数は必要です。しかし、人数は参加の質を測るための入口であって、結論ではありません。',
      },
      {
        heading: '「働けている」の中に、低い役割や孤立が隠れることがある',
        body: '在籍している、出勤している、問題なく見える。それでも、任される仕事が広がらない、評価面談で何を伸ばせばよいか分からない、相談すると不利になりそうで言えない、通院や回復時間を守ると収入が下がるという構造が残ることがあります。この状態を本人の意欲や企業の理解不足だけで読まず、役割、評価、賃金、健康時間、支援接続の噛み合わせとして読み直す必要があります。',
      },
      {
        heading: '政策指標も企業指標も、仕事条件へ翻訳して初めて使える',
        body: '政策や企業の報告では、数字は比較しやすく、説明しやすい。しかし現場で役に立つのは、数字の横に置かれた仕事条件です。どの役割が増えたのか。評価の言葉は本人と上司で共有されているか。健康時間を守る選択が罰になっていないか。支援や研修は職場の行動を変えたか。数字を否定せず、数字が意味を持つ条件を一緒に読むことが、雇用の質を上げる最小経路です。',
      },
      {
        heading: 'AI時代の参加設計は、マイノリティ政策から社会全体の設計へ広がる',
        body: '障害者雇用で見えてきた論点は、特定の人だけの配慮ではありません。AI時代には、誰もが体調、認知負荷、家庭、学習、移動、情報形式、評価の影響を受けながら働きます。障害者雇用で鍛えられた仕事条件の読み方は、人間の多様性を前提にした社会参加設計のマスタープランへ発展できます。',
      },
    ],
    oldReading: '雇用率、採用数、定着率を上げることが主な成果である。',
    designReading:
      '人数を入口にしつつ、役割、評価、成長、健康時間、相談線、支援接続の質を同時に見る。',
    firstMove:
      '雇用率や採用数の資料を読む時、横に「役割」「評価」「健康時間」「相談線」「成長機会」「戻り道」の空欄を置く。',
    discussionQuestions: [
      'この数字は、どの仕事条件の改善を伴っているか。',
      '在籍している人の役割、評価、健康時間はどう見えているか。',
      '次の報告や研修に、人数以外の何を一つ足せるか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '数字や制度の話を、本人・企業・支援者の相談へ戻す。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '雇用率は満たしていますが、仕事の質に自信がありません。',
          '配慮はあるのに、任される仕事や成長機会が減っています。',
          '制度や研究を、現場の会議で使える問いにしたい。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '人数管理から、参加の質と仕事設計へ広げる。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-relationship-evaluation-growth',
        ),
        items: [
          '役割・評価・成長を、参加の質として見る。',
          '健康時間を、評価や収入と同じ地図に置く。',
          '支援接続を、採用後の設計として残す。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '政策・企業報告を、会議で使える仕事条件表へ変える。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '雇用の質チェック: 人数、役割、評価、健康時間、支援接続。',
          '研修ワーク: 数字の横に、見えない仕事条件を書く。',
          '会議用一枚地図: 在籍から参加の質へ問いを広げる。',
        ],
      },
    ],
  },
  {
    id: 'invisible-illness-work-conditions',
    featureLabel: '本格論考 02',
    readingTime: '約8分',
    title: '見えない病気は、理解だけでは仕事条件に戻らない。',
    category: '見えない病気・開示境界',
    reader: '本人・企業・支援者・医療福祉',
    hook: '「見た目では分からないから理解してほしい」は切実な入口です。しかし理解啓発だけでは、通院、回復時間、症状変動、説明負担、評価不安をどう仕事に組み込むかまでは決まりません。見えない負担を、仕事条件へ翻訳する必要があります。',
    imageSrc: '/images/work-condition-lens-invisible-illness-v1.png',
    imageAlt: '見えない病気の説明負担、通院、回復、開示境界を仕事条件として整理する図解',
    sections: [
      {
        heading: '「元気そうに見える」は、負担がないという意味ではない',
        body: '難病、内部障害、慢性疾患、精神障害などでは、外から見える状態と、本人が使えるエネルギーや回復余地がずれることがあります。見た目だけで判断されると、本人は説明を繰り返し、無理を重ね、悪化してから相談することになりやすい。まず必要なのは、見えない負担を信じることです。しかし、そこで止まると職場の行動は変わりません。',
      },
      {
        heading: '理解を求めるほど、本人の説明負担が増えることがある',
        body: '理解啓発は大切ですが、本人に病状やつらさを何度も説明させる形になると、それ自体が負担になります。しかも、病状を詳しく話したからといって、仕事量、通院時間、情報共有、評価、緊急時対応が変わるとは限りません。共有すべきなのは、病気のすべてではなく、仕事を安全に続けるために変える条件です。',
      },
      {
        heading: '開示は「どこまで話すか」ではなく「何を変えるために話すか」',
        body: '開示の悩みは、話すか話さないかの二択ではありません。誰に、どの範囲で、何の目的で共有するのか。評価に関わる人と調整に必要な人を分けられるか。通院、休憩、業務量、緊急時、情報形式のどれを変えるためか。ここまで分けると、開示は本人の勇気だけに依存しない仕事設計になります。',
      },
      {
        heading: '見えない病気を、健康時間・開示境界・評価の三つで読む',
        body: '見えない負担を仕事条件へ戻すには、少なくとも三つの地図が必要です。健康時間の地図、開示境界の地図、評価の地図です。どの時間に崩れやすいか。何を共有し、何を共有しないか。健康を守る行動が評価や収入で罰にならないか。この三つを同時に見ると、理解の言葉が具体的な職場行動に変わります。',
      },
    ],
    oldReading: '見えない病気は、周囲の理解不足をなくせば解決に近づく。',
    designReading:
      '理解を入口にし、健康時間、開示境界、説明負担、評価不安を仕事条件として設計する。',
    firstMove:
      '本人に何度も説明させている内容を、仕事上共有する条件、共有しない情報、評価に関わる情報に分ける。',
    discussionQuestions: [
      '本人が繰り返し説明していることは、仕事条件として記録できないか。',
      '通院や回復時間は、勤務表や評価と同じ地図に置かれているか。',
      '共有する相手、目的、範囲は分かれているか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '見えない負担を、本人・企業・支援者の言葉で選べるようにする。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '元気そうと言われ、つらさを説明し続けるのが苦しい。',
          '病名を聞いても、職場で何を調整すればよいか分からない。',
          'どこまで話せばよいか、評価に響かないか不安です。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '健康時間と開示境界を、同じ仕事設計の中で見る。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-health-time-livelihood',
        ),
        items: [
          '健康時間、仕事密度、回復余地を同じ時間軸に置く。',
          '目的限定の情報共有と、不利益不安を分ける。',
          '休む、減らす、戻る、選び直す自由を設計する。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '見えない負担を、比喩、4コマ、面談メモで共有する。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '見えない負担の図解: 症状説明から仕事条件へ。',
          '開示境界メモ: 誰に、何のために、どこまで共有するか。',
          '健康時間カード: 通院、回復、仕事量、評価予定を一枚にする。',
        ],
      },
    ],
  },
  {
    id: 'treatment-work-same-week',
    featureLabel: '本格論考 03',
    readingTime: '約7分',
    title: '治療と仕事を、同じ一週間として読む。',
    category: '治療と仕事・健康時間',
    reader: '本人・企業・産業保健・支援者',
    hook: '治療、検診、服薬、リハビリ、回復時間は、仕事の外側にある私事として扱われがちです。しかし働く人にとっては、同じ一週間の中で仕事量、通勤、締切、収入、評価とぶつかります。治療と仕事を別々の予定表にすると、支援の焦点がずれます。',
    imageSrc: '/images/work-condition-lens-treatment-work-time-v1.png',
    imageAlt: '治療時間と仕事時間を同じ一週間に並べて、衝突点と調整点を見る図解',
    sections: [
      {
        heading: '治療時間を勤務の外に置くと、衝突が見えない',
        body: '定期検診、透析、通院、服薬、リハビリ、休養は、制度上は勤務外の予定に見えることがあります。しかし実際には、移動、待ち時間、回復、薬の副作用、翌日の仕事密度まで含めて、一週間の働き方に影響します。職場が治療時間を「私事」として外に置くほど、本人は自分で調整を抱え込みやすくなります。',
      },
      {
        heading: '内部障害の検診と難病の体調変動は、同じではないが同じ時間地図で読める',
        body: '内部障害の定期的な検診や治療と、難病の変動する体調は同じ問題ではありません。前者は予定化しやすい一方、後者は予測しにくい波を含むことがあります。ただし、どちらも勤務密度、回復余地、通勤、評価時期と衝突する点では同じ時間地図で扱えます。違いを潰さず、共通の設計面に置くことが重要です。',
      },
      {
        heading: '仕事量と治療予定を、調整可能なものとして並べる',
        body: '「通院があるから働けない」でも、「仕事だから治療を後回しにする」でもありません。必要なのは、治療予定、仕事量、締切、回復時間、代替手順、評価のタイミングを並べ、どこを先に変えられるかを見ることです。予定化できるものは予定化し、変動するものには戻り道と相談線を用意します。',
      },
      {
        heading: '治療と仕事の両立は、本人の自己管理だけでは成立しない',
        body: '本人の自己管理は大切です。しかし、勤務表、締切、評価、収入、支援接続が変わらなければ、自己管理だけで持続可能な働き方を作ることは難しい。治療と仕事を同じ一週間として読むとは、本人の努力を支える仕事条件を可視化することです。',
      },
    ],
    oldReading: '治療や通院は本人の私事であり、勤務とは別に調整する。',
    designReading: '治療、回復、勤務密度、通勤、締切、評価を同じ一週間の条件として読む。',
    firstMove: '治療・検診・服薬・回復時間を、勤務表、締切、会議、通勤、評価予定と同じ紙面に置く。',
    discussionQuestions: [
      '治療予定の前後に、仕事量や会議が集中していないか。',
      '予定化できる調整と、変動に備える調整を分けているか。',
      '治療を守る行動が、評価や収入の罰のように働いていないか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '通院や検診を、勤務表と同じ問題として相談できるようにする。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '通院や検診を、職場にどう伝えればよいか迷います。',
          '治療週に仕事が詰まり、体調が崩れます。',
          '復職後の仕事量と通院予定をどう見直せばよいでしょうか。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '治療時間を、健康時間と仕事密度の設計へ戻す。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-health-time-livelihood',
        ),
        items: [
          '治療・検診時間を勤務表の外に追い出さない。',
          '変動する健康時間と仕事密度を同じ時間軸に置く。',
          '休む、減らす、戻る、選び直す自由を残す。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '治療と仕事の予定表を、相談で使える形にする。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '一週間の時間地図: 治療、通勤、回復、締切を同じ面に置く。',
          '予定化/変動メモ: 決まっている治療と、変わりやすい体調を分ける。',
          '復職後の確認表: 1週、1か月、3か月で仕事量を見直す。',
        ],
      },
    ],
  },
  {
    id: 'mental-health-work-design',
    featureLabel: '本格論考 04',
    readingTime: '約8分',
    title: 'メンタルヘルスを、セルフケアだけに閉じない。',
    category: 'メンタルヘルス・職場運用',
    reader: '本人・企業・支援者・産業保健',
    hook: 'セルフケア、相談してください、無理をしないでください。どれも必要な言葉です。しかし仕事量、裁量、急な変更、相談線、評価の言葉が変わらなければ、早期相談は起きにくい。メンタルヘルスを、個人の心の問題だけでなく仕事条件として読み直します。',
    imageSrc: '/images/work-condition-lens-mental-health-work-design-v1.png',
    imageAlt: 'メンタルヘルスを仕事量、裁量、相談線、評価の条件として整理する図解',
    sections: [
      {
        heading: '「相談してください」は、相談できる条件があって初めて機能する',
        body: '職場でメンタルヘルスの話をする時、「早めに相談してください」という言葉はよく使われます。しかし、相談した後に評価が下がるのではないか、仕事を外されるのではないか、上司に迷惑をかけるのではないかという不安が残る場では、相談は遅れます。相談の呼びかけだけでなく、相談先、記録範囲、評価との切り分けが必要です。',
      },
      {
        heading: '不調のサインは、仕事量と裁量の変化として現れることがある',
        body: '不眠、疲労、集中困難、ミス、遅刻、欠勤などを本人の状態だけで見ると、対応が遅れます。仕事量の山、急な変更、裁量のなさ、孤立、感情労働、曖昧な評価、ハラスメント不安などが重なっていないかを見る必要があります。不調は本人の中だけでなく、仕事条件との相互作用として現れます。',
      },
      {
        heading: '早期対応は、段階ではなく予防と見直しの設計である',
        body: 'メンタルヘルス対応を「悪化してから休職」「復職してから調整」という流れだけで見ると、支援は後手になります。黄信号の段階で仕事量を減らす、会議を減らす、相談先を変える、評価時期を調整する、戻り道を決める。こうした予防的な見直しを通常業務の中に入れることで、本人にも職場にも早い選択肢が増えます。',
      },
      {
        heading: 'セルフケアと職場設計は対立しない',
        body: '本人が自分の状態を知り、休む、相談する、整えることは大切です。ただし、それを本人だけの責任に閉じると、仕事側の条件が見えません。セルフケアを支えるためにも、仕事量、裁量、相談線、評価、戻り道を設計する必要があります。',
      },
    ],
    oldReading: '本人が早く相談し、セルフケアを行えばよい。',
    designReading: '早期相談を可能にする仕事量、裁量、相談線、評価の切り分け、戻り道を見る。',
    firstMove:
      '不調の話題を、仕事量の山、裁量、急な変更、相談先、評価語、戻り道のどれに関係するか分ける。',
    discussionQuestions: [
      '相談すると何が変わり、何が評価から切り離されるかが見えているか。',
      '黄信号の段階で減らせる仕事量や会議はあるか。',
      '本人のセルフケアだけでなく、職場側が変える条件は何か。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '本人の不調と職場の条件を、同じ相談の中で扱う。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '相談してくださいと言われても、評価に響きそうで言えません。',
          '急な変更や仕事量の山で不調が強くなります。',
          '復職後、どの仕事量から戻ればよいか分かりません。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: 'メンタルヘルスを、健康時間と職場運用の両方から見る。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-worksite-access-operations',
        ),
        items: [
          '安全に止める基準を、働き続ける条件にする。',
          '手順変更と切替負荷を、本人の柔軟性だけで読まない。',
          '評価不安と情報共有を切り分ける。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '相談の呼びかけを、実際に相談できる条件表へ変える。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '黄信号メモ: 仕事量、ミス、疲労、相談先、評価語を見る。',
          '早期対応カード: 減らす、止める、戻る、選び直す。',
          '会議用地図: 本人の状態と職場条件を分けて置く。',
        ],
      },
    ],
  },
  {
    id: 'support-translation-continuity',
    featureLabel: '本格論考 05',
    readingTime: '約8分',
    title: '支援はある。翻訳が続くかを見る。',
    category: '支援接続・多分野連携',
    reader: '支援者・企業・行政・本人',
    hook: '支援機関、医療、福祉、企業、人事、上司、家族。関係者が多いほど安心に見える一方で、本人の言葉が職場の仕事条件へ翻訳されず、支援者だけがつなぎ続けることがあります。支援の有無ではなく、翻訳が続く仕組みを見ます。',
    imageSrc: '/images/work-condition-lens-support-translation-v1.webp',
    imageAlt: '本人の言葉、医療福祉の言葉、企業の言葉を仕事条件へ翻訳し続ける支援接続の図解',
    sections: [
      {
        heading: '支援が増えても、職場の行動が変わらないことがある',
        body: '相談先や制度があることは重要です。しかし、支援者の助言が「本人に配慮してください」という一般語のまま職場へ届くと、上司は何を変えればよいか分かりません。本人の困りごとを、仕事量、情報形式、通院時間、評価、相談線、戻り道へ翻訳するところまで進んで初めて、支援は職場の行動につながります。',
      },
      {
        heading: '翻訳は一回では終わらない',
        body: '就職前、実習、採用後、異動、復職、体調変化、評価面談。仕事の条件は変わり続けます。最初の面談で整理したことも、時間が経つと合わなくなる。支援接続を見る時は、最初につながったかだけでなく、変化が起きた時に再翻訳できるかを見ます。',
      },
      {
        heading: '多職種連携は、同じ場面を見られるかで決まる',
        body: '医療は健康状態を、福祉は生活や支援を、企業は仕事遂行を、人事は制度を見ます。どれも必要ですが、同じ仕事場面に戻らないと話はずれます。例えば「月末に体調が崩れる」という場面を、治療、勤務密度、通勤、評価、収入不安、相談線として同じ紙面に置くと、誰が何を変えるかが見えます。',
      },
      {
        heading: '支援者個人の力量ではなく、翻訳を残す組織条件を見る',
        body: 'よい支援者がいるかどうかだけに頼ると、担当者が変わった瞬間に知識が消えます。記録、会議、同行、振り返り、企業への戻し方、本人への説明の仕方が組織に残るか。支援接続の質は、支援者個人の熱意ではなく、翻訳を続ける条件として見る必要があります。',
      },
    ],
    oldReading: '支援機関や制度につながっていれば、必要な支援は届いている。',
    designReading: '本人の言葉が仕事条件へ翻訳され、変化後にも再翻訳される仕組みがあるかを見る。',
    firstMove:
      '支援者の助言を一つ選び、「誰が」「いつ」「どの仕事条件を」「どう変えるか」の表に直す。',
    discussionQuestions: [
      '支援者の言葉は、職場の具体的な行動へ翻訳されているか。',
      '体調変化や異動の後に、同じ整理をやり直す道はあるか。',
      '担当者が変わっても残る記録や会議の形はあるか。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '支援者、企業、本人の言葉のずれを相談入口へ戻す。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '支援者とは整理できたのに、職場で何を変える話にすればよいか迷う。',
          '医療、福祉、企業で見ているものがずれています。',
          '実習で分かったことが、採用後に残りません。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '支援接続を、制度名ではなく知識更新の回路として見る。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-support-institution-learning',
        ),
        items: [
          '支援者の翻訳を、職場行動へ戻す。',
          '多職種連携を、同じ仕事場面を見ることから始める。',
          '記録、会議、研修を、次の改善につながる回路にする。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '連携を、同じ場面で話せる道具に変える。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '翻訳表: 本人の言葉、支援者の言葉、職場の行動。',
          '場面共有カード: 同じ困りごとを五者の視点で見る。',
          '引き継ぎメモ: 実習、採用後、復職後に残す条件。',
        ],
      },
    ],
  },
  {
    id: 'policy-research-ai-era',
    featureLabel: '本格論考 06',
    readingTime: '約8分',
    title: '政策・研究・AI時代の資料を、仕事条件の問いへ戻す。',
    category: '政策・研究・AI',
    reader: '行政・研究・発信・企業・支援者',
    hook: '政策資料、研究論文、国際情報、AI要約は、視野を広げる強い材料です。しかし、それらをそのまま答えとして移植すると、制度差、時代差、立場差、データの偏りまで一緒に持ち込むことがあります。資料は答えではなく、仕事条件を照らすレンズとして使います。',
    imageSrc: '/images/work-condition-lens-policy-research-translation-v1.png',
    imageAlt: '政策、研究、国際情報、AI要約を仕事条件の問いへ翻訳する図解',
    sections: [
      {
        heading: '資料は、現実そのものではなく現実の影である',
        body: '調査データ、制度資料、国際文献、ウェブ情報は、どれも重要です。ただし、調査対象、質問設計、制度背景、時代、国、立場によって、見えるものと見えないものが変わります。資料を信じないのではなく、資料が何を照らし、何を落としているかを見ながら使うことが必要です。',
      },
      {
        heading: '少数シグナルを、頻度の低さだけで落とさない',
        body: 'データ数の多いテーマは、全体像を作る時に強く見えます。しかし、視覚障害、聴覚障害、肢体不自由、内部障害、精神障害、発達障害など、それぞれに特有の職場条件があります。件数が少ないから薄い材料と扱うと、人間の多様性を反映するために重要な知識が埋もれます。頻度と重要性を分けて読む必要があります。',
      },
      {
        heading: 'AI要約は、偏りを整った文章にしてしまうことがある',
        body: 'AIは大量の資料を読む力を持ちます。その力はこのサイトの中核でもあります。一方で、何を見るべきかの地図がないまま要約すると、本人要因への偏り、病名別の単純化、制度の一面性、古い差別的な見方を、読みやすい文章として再生産する危険があります。AIを使うほど、仕事条件の読み筋を先に置く必要があります。',
      },
      {
        heading: '政策・研究・AIを、現場で話す問いへ戻す',
        body: 'よい資料は、現場の問いを増やします。この資料は何を照らしているか。どの障害種類や立場が見えにくいか。本人、仕事、環境、支援、時間、制度のどこを変えるヒントになるか。会議で最初に確認するなら何か。資料を答えとして渡すのではなく、仕事条件の問いへ戻すことで、政策、研究、AIは現場の意思決定を支える道具になります。',
      },
    ],
    oldReading: '信頼できそうな資料やAI要約を、分かりやすい説明として使う。',
    designReading:
      '資料が照らすもの、見落とすもの、少数シグナル、現場で確認すべき仕事条件を分けて読む。',
    firstMove:
      '資料を一つ選び、「主張」「見えている条件」「見えにくい条件」「現場で聞く問い」の四つに分ける。',
    discussionQuestions: [
      'この資料は、どの立場や障害種類を見えにくくしていないか。',
      'AI要約は、本人要因だけで説明していないか。',
      '現場の会議で、最初に確認する仕事条件は何か。',
    ],
    nextUseGroups: [
      {
        title: '近い相談で読む',
        intent: '政策や研究の論点を、現場の迷いへ戻す。',
        href: candidateAnchorPath('case-readings', 'consultation-finder'),
        items: [
          '調査や制度の資料を、現場の会議でどう使えばよいか迷います。',
          'AIで要約した内容が、偏りを再生産していないか不安です。',
          '少数例の重要な課題が、全体の議論に埋もれていないか確認したい。',
        ],
      },
      {
        title: '設計ガイドで見る',
        intent: '資料を、五つの設計領域に照らして読み直す。',
        href: candidateAnchorPath(
          'work-design-views-guide',
          'work-design-domain-support-institution-learning',
        ),
        items: [
          '健康時間、情報アクセス、職場接触点、開示評価、支援制度へ分ける。',
          '少数シグナルを、頻度ではなく設計上の重要性で保持する。',
          '支援や制度の知識を、現場の行動へ翻訳する。',
        ],
      },
      {
        title: 'ツールにする',
        intent: '資料読みを、AI時代の安全な会議・発信の道具にする。',
        href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
        items: [
          '資料読解メモ: 主張、照らすもの、落とすもの、現場の問い。',
          'AI要約チェック: 本人要因化、病名単純化、制度一面化を点検する。',
          '少数シグナル保護表: 件数と重要性を分けて残す。',
        ],
      },
    ],
  },
];

const axiomArticleCatalogEntries: readonly ArticleCatalogEntry[] = [
  {
    id: 'health-time-work-condition',
    title: '「疲れやすい」で止めない。健康時間を、仕事の設計条件にする。',
    category: '健康時間',
    theme: '治療と仕事',
    audiences: ['本人・家族', '企業・管理職', '支援者', '医療・福祉・教育'],
    readerQuestion:
      '疲れやすい、休みがち、波があると言われても、職場で何を変えればよいのか分からない。',
    argument:
      '疲れやすさを本人の弱さではなく、仕事密度、回復時間、通院、移動、評価時期の噛み合いとして読む。',
    firstUse: '一週間の時間地図に、通院、締切、回復、移動、評価予定を一緒に置く。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-health-time-livelihood',
    ),
    nextLabel: '健康時間・生活保障・仕事密度へ',
    tags: ['疲労', '体調変動', '回復時間', '評価'],
    depth: 'まず読む',
  },
  {
    id: 'treatment-work-same-week',
    title: '治療と仕事を、同じ一週間として読む。',
    category: '健康時間',
    theme: '治療と仕事',
    audiences: ['本人・家族', '企業・管理職', '医療・福祉・教育', '支援者'],
    readerQuestion:
      '通院や定期検診は勤務の外にある話なのか、仕事の予定として一緒に見てよいのか迷う。',
    argument:
      '治療時間を私事として外に追い出すと、勤務密度、回復余地、評価、収入の衝突が見えなくなる。',
    firstUse: '治療、検診、服薬、回復に必要な時間を、勤務表と同じ紙面に置く。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: '通院・勤務の相談入口へ',
    tags: ['通院', '定期検診', '内部障害', '勤務表'],
    depth: '深く読む',
  },
  {
    id: 'commute-exhaustion',
    title: '通勤で消耗する人の仕事設計。',
    category: '健康時間',
    theme: '職場接触点',
    audiences: ['本人・家族', '企業・管理職', '支援者'],
    readerQuestion: '仕事そのものより、職場に着く前後の移動や待ち時間で消耗してしまう。',
    argument:
      '通勤や移動は仕事の外側ではなく、仕事に入る前提条件であり、勤務密度や休憩場所と一緒に見る。',
    firstUse: '自宅から作業開始までの消耗点を、移動、待機、着替え、休憩場所に分けて書く。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-worksite-access-operations',
    ),
    nextLabel: '情報・手順・接触点へ',
    tags: ['通勤', '移動', '休憩場所', '消耗'],
    depth: '実装へ戻す',
  },
  {
    id: 'rest-reduce-return-choose',
    title: '休む・減らす・戻る・選び直す自由を設計する。',
    category: '健康時間',
    theme: '見えない病気',
    audiences: ['本人・家族', '企業・管理職', '行政・政策', '支援者'],
    readerQuestion: '休むと評価や収入が下がりそうで、無理をしない選択がしにくい。',
    argument:
      '健康を守る行動が罰のように働く時、休む自由は制度や勤務表だけでなく評価と戻り道の問題になる。',
    firstUse: '休む、仕事量を減らす、復帰する、役割を選び直す時の確認先を一枚にする。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-health-time-livelihood',
    ),
    nextLabel: '健康時間・生活保障・仕事密度へ',
    tags: ['休職', '復職', '収入不安', '戻り道'],
    depth: '深く読む',
  },
  {
    id: 'same-meeting-not-same-information',
    title: '会議にいるのに、同じ情報に参加できない。',
    category: '情報アクセス',
    theme: '職場接触点',
    audiences: ['本人・家族', '企業・管理職', '支援者', '医療・福祉・教育'],
    readerQuestion:
      '会議には参加しているのに、口頭の流れ、資料、雑談、緊急連絡の一部が抜け落ちる。',
    argument: '参加の有無ではなく、情報がどの形式で届き、どのタイミングで確認できるかを見る。',
    firstUse: '口頭、文字、図、音、手話、字幕、チャット、事後メモのどこで情報が落ちるか分ける。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-worksite-access-operations',
    ),
    nextLabel: '情報・手順・接触点へ',
    tags: ['聴覚障害', '視覚障害', '情報保障', '会議'],
    depth: 'まず読む',
  },
  {
    id: 'verbal-only-workplace',
    title: '口頭説明だけの職場を、見返せる手順に変える。',
    category: '情報アクセス',
    theme: '資料と会議',
    audiences: ['企業・管理職', '支援者', '本人・家族'],
    readerQuestion: '説明はしているのに、作業の開始、切替、完了、例外対応で同じ詰まりが起きる。',
    argument: '理解力の問題にする前に、手順が残る形式、確認先、例外時の戻り方があるかを見る。',
    firstUse: '一つの作業を、開始条件、途中確認、完了条件、例外時の確認先に分けて書く。',
    nextHref: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
    nextLabel: '手順を見える道具へ',
    tags: ['手順書', '発達障害', '高次脳機能障害', '確認'],
    depth: '実装へ戻す',
  },
  {
    id: 'sensory-access-work-spec',
    title: '視覚・聴覚の情報保障を、特別扱いではなく仕事の仕様にする。',
    category: '情報アクセス',
    theme: '配慮と仕事設計',
    audiences: ['企業・管理職', '支援者', '行政・政策', '本人・家族'],
    readerQuestion: '情報保障を個別配慮として頼むたびに、本人にも職場にも負担が残る。',
    argument:
      '情報保障は親切の追加ではなく、会議、警告、資料、評価、雑談参加を成立させる仕事仕様である。',
    firstUse: '通常業務で必要な情報を、見る、聞く、読む、触れる、後で確認する経路に分ける。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-worksite-access-operations',
    ),
    nextLabel: '情報・手順・接触点へ',
    tags: ['視覚障害', '聴覚障害', '字幕', '資料形式'],
    depth: '深く読む',
  },
  {
    id: 'ai-summary-work-map',
    title: 'AI要約と仕事条件の地図。',
    category: '情報アクセス',
    theme: '政策・研究',
    audiences: ['研究・発信', '企業・管理職', '支援者', '行政・政策'],
    readerQuestion:
      'AIで資料を要約すると便利だが、古い偏見まできれいな文章として再生産されないか不安がある。',
    argument:
      'AI要約の前に、本人、仕事、環境、支援、時間、制度を分ける地図を置くと、偏った要約を点検しやすい。',
    firstUse: 'AIの出力を、本人要因だけで説明していないか、仕事条件の欄で読み返す。',
    nextHref: candidatePath('theory-method-trust'),
    nextLabel: 'NBLの専門性を読む',
    tags: ['AI', '要約', '偏見', '情報発信'],
    depth: '深く読む',
  },
  {
    id: 'procedure-change-return-route',
    title: '急な変更で止まるのは、手順に戻り道がないから。',
    category: '職場運用',
    theme: '職場接触点',
    audiences: ['企業・管理職', '支援者', '本人・家族'],
    readerQuestion: '急な変更や例外対応のたびに、本人も周囲も緊張して仕事が止まる。',
    argument: '柔軟性の不足ではなく、変更前後の違い、確認先、戻る手順が見えるかを見る。',
    firstUse: '変更が起きる作業を一つ選び、変更前、変更後、確認先、戻る条件を並べる。',
    nextHref: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
    nextLabel: '手順カードへ',
    tags: ['手順変更', '切替', '例外対応', '戻り方'],
    depth: 'まず読む',
  },
  {
    id: 'movement-tools-contact-points',
    title: '職場内移動・道具・休憩場所を、仕事の接触点として見る。',
    category: '職場運用',
    theme: '職場接触点',
    audiences: ['本人・家族', '企業・管理職', '支援者'],
    readerQuestion: '移動、姿勢、道具、休憩場所の問題が、仕事の成果や安全に影響している気がする。',
    argument:
      '作業そのものだけでなく、作業に入るまでの接触点が整っているかを見ると、職場設計が変わる。',
    firstUse: '入口、動線、机、端末、道具、休憩場所、トイレ、安全連絡を作業順に並べる。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-worksite-access-operations',
    ),
    nextLabel: '情報・手順・接触点へ',
    tags: ['肢体不自由', '移動', '道具', '安全'],
    depth: '実装へ戻す',
  },
  {
    id: 'safe-stop-criteria',
    title: '安全に止める基準が、働き続ける条件になる。',
    category: '職場運用',
    theme: 'メンタルヘルス',
    audiences: ['企業・管理職', '支援者', '医療・福祉・教育'],
    readerQuestion: '無理をしてから止まるのではなく、早めに調整する基準を職場で共有したい。',
    argument: '悪化後の例外対応だけでなく、止める、減らす、相談する基準を通常業務の一部にする。',
    firstUse: '赤信号になる前の黄信号を、本人サイン、仕事量、ミス、疲労、周囲の変化で決める。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: '急な変動の相談入口へ',
    tags: ['予防', '安全', '悪化', '早期対応'],
    depth: '深く読む',
  },
  {
    id: 'manual-to-meeting',
    title: 'マニュアルを増やすより、会議で使える形にする。',
    category: '職場運用',
    theme: '資料と会議',
    audiences: ['企業・管理職', '支援者', '行政・政策'],
    readerQuestion: '制度やマニュアルはあるのに、現場の会議で何を話せばよいかに落ちてこない。',
    argument: '知識の量より、本人、上司、人事、支援者が同じ対象を見ながら話せる形が必要になる。',
    firstUse: '一つのマニュアル項目を、会議で確認する問いと、変える仕事条件に翻訳する。',
    nextHref: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
    nextLabel: '会議用一枚地図へ',
    tags: ['マニュアル', '会議', '研修', '翻訳'],
    depth: '実装へ戻す',
  },
  {
    id: 'disclosure-for-change',
    title: 'どこまで話すかではなく、何を変えるために話すか。',
    category: '開示・評価',
    theme: '見えない病気',
    audiences: ['本人・家族', '企業・管理職', '支援者'],
    readerQuestion:
      '障害や病気について、どこまで話せばよいのか、話した後に不利にならないか不安がある。',
    argument:
      '開示は情報量の問題ではなく、何を調整するために、誰に、どの範囲で共有するかの設計である。',
    firstUse:
      '伝える情報を、仕事量、情報形式、通院時間、緊急時、評価のどれを変えるためかに分ける。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-relationship-evaluation-growth',
    ),
    nextLabel: '開示・評価・役割・成長へ',
    tags: ['開示', '不利益不安', '情報共有', '評価'],
    depth: 'まず読む',
  },
  {
    id: 'evaluation-anxiety-separate',
    title: '評価に響く不安を、情報共有と切り分ける。',
    category: '開示・評価',
    theme: '三者視点',
    audiences: ['本人・家族', '企業・管理職', '行政・政策', '支援者'],
    readerQuestion: '必要な相談をしたいが、評価や処遇に悪く響くのではないかと思って言い出せない。',
    argument:
      '評価不安がある場では、相談ルート、評価者、共有目的、記録範囲を分けないと、調整が止まる。',
    firstUse: '相談したい内容ごとに、評価に関わる人、調整に必要な人、記録に残す範囲を分ける。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: '開示・評価の相談入口へ',
    tags: ['評価', '処遇', '心理的安全', '相談線'],
    depth: '深く読む',
  },
  {
    id: 'accommodation-growth-risk',
    title: '配慮があるのに、成長機会が減る職場をどう読むか。',
    category: '開示・評価',
    theme: '多様性と参加',
    audiences: ['本人・家族', '企業・管理職', '支援者', '行政・政策'],
    readerQuestion: '配慮はあるが、任される仕事や学ぶ機会が少なくなっている気がする。',
    argument:
      '働き続けることだけでなく、役割、評価、学習、賃金、選び直しが狭くなっていないかを見る。',
    firstUse: '現在の配慮が、仕事量を守るものか、役割や成長を狭めているものかを分ける。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-relationship-evaluation-growth',
    ),
    nextLabel: '開示・評価・役割・成長へ',
    tags: ['成長機会', '役割', '賃金', '雇用の質'],
    depth: 'まず読む',
  },
  {
    id: 'beyond-working',
    title: '「働けている」の先に、役割と賃金を見る。',
    category: '開示・評価',
    theme: '雇用の質',
    audiences: ['行政・政策', '企業・管理職', '研究・発信', '支援者'],
    readerQuestion: '雇用率や定着だけで、障害者雇用の質を見てよいのか疑問がある。',
    argument:
      '働けているかだけでなく、役割の広がり、評価、賃金、学習機会、選び直しの自由を見る必要がある。',
    firstUse: '採用数や定着率を見る時に、役割、評価、成長、収入の項目を一緒に並べる。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-relationship-evaluation-growth',
    ),
    nextLabel: '開示・評価・役割・成長へ',
    tags: ['雇用の質', '賃金', '評価', '政策議論'],
    depth: '深く読む',
  },
  {
    id: 'after-hiring-blank',
    title: '採用後の空白を埋める。参加は、雇った後に設計する。',
    category: '入口・移行',
    theme: '多様性と参加',
    audiences: ['本人・家族', '企業・管理職', '支援者', '行政・政策'],
    readerQuestion: '採用はできたが、配属後の役割、評価、相談線、成長が空白のままになっている。',
    argument: '採用は入口であり、参加の質は採用後の役割設計、仕事量、評価、戻り道で決まる。',
    firstUse: '採用後1か月、3か月、6か月で確認する項目を、役割、仕事量、評価、相談線に分ける。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-pre-entry-transition',
    ),
    nextLabel: '就職前・入口・移行へ',
    tags: ['採用後', '定着', '役割', '相談線'],
    depth: 'まず読む',
  },
  {
    id: 'before-work-anxiety',
    title: '働く前の不安を、意欲の問題にしない。',
    category: '入口・移行',
    theme: '多様性と参加',
    audiences: ['本人・家族', '支援者', '医療・福祉・教育', '行政・政策'],
    readerQuestion:
      'まだ働いていない人の不安や迷いを、どう仕事条件の話につなげればよいか分からない。',
    argument:
      '就職前の不安は低頻度の例外ではなく、仕事像、体験、支援接続、生活保障が未接続な状態として読む。',
    firstUse: '不安を、仕事内容、通勤、体調、説明形式、人間関係、収入、支援接続に分けて聞く。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-pre-entry-transition',
    ),
    nextLabel: '就職前・入口・移行へ',
    tags: ['未就業', '仕事像', '不安', '体験'],
    depth: '深く読む',
  },
  {
    id: 'trial-to-after-hiring',
    title: '実習で見えた条件を、採用後に残す。',
    category: '入口・移行',
    theme: '支援接続',
    audiences: ['支援者', '企業・管理職', '医療・福祉・教育', '本人・家族'],
    readerQuestion: '実習や職場体験では分かったことが、採用後の仕事条件に引き継がれない。',
    argument:
      '体験で見えた条件を記録しなければ、採用後にまた本人説明と職場調整をやり直すことになる。',
    firstUse: '実習で見えた仕事量、説明形式、休憩、相談線、評価語を採用後の確認表に残す。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: '実習・移行の相談入口へ',
    tags: ['実習', '職場体験', '移行', '採用後'],
    depth: '実装へ戻す',
  },
  {
    id: 'return-to-work-volume',
    title: '復職後の仕事量を、戻る日だけで決めない。',
    category: '入口・移行',
    theme: '治療と仕事',
    audiences: ['本人・家族', '企業・管理職', '医療・福祉・教育', '支援者'],
    readerQuestion:
      '復職日は決まったが、その後どの仕事量で、いつ見直すかが曖昧なままになっている。',
    argument: '復職は日付ではなく、仕事量、回復、評価、相談線、選び直しの連続した設計である。',
    firstUse: '復職後の1週目、1か月、3か月で仕事量と相談タイミングを分けて決める。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-health-time-livelihood',
    ),
    nextLabel: '健康時間・生活保障・仕事密度へ',
    tags: ['復職', '仕事量', '回復', '見直し'],
    depth: '深く読む',
  },
  {
    id: 'support-translation-continuity',
    title: '支援はある。翻訳が続くかを見る。',
    category: '支援・制度',
    theme: '支援接続',
    audiences: ['支援者', '企業・管理職', '行政・政策', '本人・家族'],
    readerQuestion: '支援機関や制度はあるのに、職場で何を変える話にすればよいかが続かない。',
    argument:
      '支援の有無だけでなく、本人の言葉が職場の仕事条件へ翻訳され、変化後に再翻訳されるかを見る。',
    firstUse: '支援者の助言を、誰が、いつ、どの仕事条件を変えるかの表に直す。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-support-institution-learning',
    ),
    nextLabel: '支援・制度・知識更新へ',
    tags: ['支援接続', '翻訳', '再翻訳', '連携'],
    depth: 'まず読む',
  },
  {
    id: 'diagnosis-training-limits',
    title: '診断名別研修では、現場の判断は変わりにくい。',
    category: '支援・制度',
    theme: '実装と研修',
    audiences: ['企業・管理職', '支援者', '行政・政策', '研究・発信'],
    readerQuestion: '障害特性の研修をしても、現場で仕事の渡し方や相談の仕方が変わりにくい。',
    argument:
      '診断名の知識だけでなく、仕事、環境、支援、時間をどう見直すかまで研修に入れる必要がある。',
    firstUse: '研修テーマを、診断名ではなく、情報形式、仕事量、評価、相談線、戻り道に置き換える。',
    nextHref: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
    nextLabel: '研修素材へ',
    tags: ['研修', '診断名', '仕事設計', '企業支援'],
    depth: '実装へ戻す',
  },
  {
    id: 'research-to-field-question',
    title: '制度や研究を、現場の問いに翻訳する。',
    category: '支援・制度',
    theme: '政策・研究',
    audiences: ['行政・政策', '研究・発信', '支援者', '企業・管理職'],
    readerQuestion:
      '調査、制度、海外事例、研究成果を読んでも、現場の会議で何を変える話にすればよいか迷う。',
    argument:
      '資料は答えではなく、見落とされやすい条件を照らすレンズとして読み、現場の問いに戻す。',
    firstUse: '一つの資料を、何が見えているか、何が見えていないか、現場で聞く問いに分ける。',
    nextHref: candidatePath('theory-method-trust'),
    nextLabel: '方法と信頼の説明へ',
    tags: ['研究', '制度', '海外事例', '翻訳'],
    depth: '深く読む',
  },
  {
    id: 'multi-actor-same-scene',
    title: '多職種連携は、同じ場面を見るところから始まる。',
    category: '支援・制度',
    theme: '多分野連携',
    audiences: ['支援者', '医療・福祉・教育', '企業・管理職', '行政・政策'],
    readerQuestion:
      '本人、企業、医療、福祉、行政が関わっているのに、話している対象がずれてしまう。',
    argument:
      '連携は情報共有量ではなく、同じ仕事場面を見ながら、誰がどの条件を変えるかを合わせることから始まる。',
    firstUse: '一つの困りごとを、本人、職場、支援者、医療、制度がそれぞれ何を見ているかに分ける。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: '関係者別の相談入口へ',
    tags: ['多職種連携', '場面共有', '役割分担', '地域'],
    depth: '実装へ戻す',
  },
  {
    id: 'employment-rate-work-design',
    title: '雇用率の先へ。人数管理から、参加の質を設計する。',
    category: '開示・評価',
    theme: '雇用の質',
    audiences: ['行政・政策', '企業・管理職', '研究・発信', '支援者'],
    readerQuestion:
      '雇用率や定着率は重要だが、その先にある役割、評価、成長、健康時間をどう見ればよいのか。',
    argument:
      '人数を否定せず、人数が意味を持つための仕事条件、役割、評価、見直し周期を社会的な成果指標として読む。',
    firstUse:
      '雇用数の資料を読む時に、役割、評価、相談経路、健康時間、見直し周期の空欄を横に置く。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-relationship-evaluation-growth',
    ),
    nextLabel: '開示・評価・役割・成長へ',
    tags: ['雇用率', '参加の質', '役割', '評価', 'バーチャルフォーラム'],
    depth: '深く読む',
  },
  {
    id: 'invisible-illness-work-conditions',
    title: '見えない病気は、理解だけでは仕事条件に戻らない。',
    category: '健康時間',
    theme: '見えない病気',
    audiences: ['本人・家族', '企業・管理職', '医療・福祉・教育', '支援者'],
    readerQuestion:
      '見た目では分からない病気や障害について、理解啓発だけで職場の行動は変わるのか。',
    argument:
      '理解を入口にしながら、通院、症状変動、説明負担、開示境界、評価を仕事条件として扱う。',
    firstUse: '本人に何度も説明させている内容を、仕事上共有すべき条件と共有しない情報に分ける。',
    nextHref: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
    nextLabel: '見えない負担を扱う教材へ',
    tags: ['見えない病気', '説明負担', '開示境界', '通院'],
    depth: 'まず読む',
  },
  {
    id: 'mental-health-work-design',
    title: 'メンタルヘルスを、セルフケアだけに閉じない。',
    category: '職場運用',
    theme: 'メンタルヘルス',
    audiences: ['企業・管理職', '支援者', '医療・福祉・教育', '本人・家族'],
    readerQuestion:
      'メンタルヘルス対策が、本人のセルフケアや相談してくださいという呼びかけで止まっている。',
    argument: '仕事量、裁量、急な変更、相談先、評価の言葉を、早期相談が可能になる条件として読む。',
    firstUse: '不調の話題を、仕事量の山、裁量、変更、相談先、評価語のどこに関係するか分ける。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: 'メンタルヘルスの相談入口へ',
    tags: ['メンタルヘルス', '早期相談', '仕事量', '評価'],
    depth: '深く読む',
  },
  {
    id: 'label-lived-work-experience',
    title: 'ラベルと言葉の向こうの就労経験を読む。',
    category: '情報アクセス',
    theme: '相互作用',
    audiences: ['本人・家族', '支援者', '企業・管理職', '研究・発信'],
    readerQuestion:
      '診断名、障害名、制度の言葉は必要だが、それだけで本人の仕事経験を理解したことになるのか。',
    argument:
      'ラベルを消すのではなく、ラベルの奥にある仕事場面、情報環境、時間変動、開示境界、評価語へ進む。',
    firstUse: '診断名や制度語を見たら、どの仕事場面、どの時間、どの情報経路の話かを一つ聞く。',
    nextHref: candidatePath('theory-method-trust'),
    nextLabel: '相互作用として読む理由へ',
    tags: ['診断名', 'ラベル', 'ICF', '相互作用', 'バーチャルフォーラム'],
    depth: '深く読む',
  },
  {
    id: 'reasonable-accommodation-work-design',
    title: '配慮名の前に、仕事を分解する。',
    category: '職場運用',
    theme: '配慮と仕事設計',
    audiences: ['企業・管理職', '支援者', '行政・政策', '本人・家族'],
    readerQuestion: '合理的配慮の名前や制度説明はあるが、実際の仕事のどこを変えるのかが粗い。',
    argument: '配慮名を先に探すのではなく、作業、時間、情報、環境、相談、評価の接触点へ分解する。',
    firstUse: '相談内容を、作業、時間、情報、環境、相談線、評価のどこに関係するかに置く。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-worksite-access-operations',
    ),
    nextLabel: '情報・手順・接触点へ',
    tags: ['合理的配慮', '仕事分解', '接触点', '制度語'],
    depth: 'まず読む',
  },
  {
    id: 'workshop-to-implementation',
    title: 'ワークショップの気づきを、実装へ残す。',
    category: '支援・制度',
    theme: '実装と研修',
    audiences: ['支援者', '企業・管理職', '行政・政策', '研究・発信'],
    readerQuestion:
      '研修やワークショップでは納得が生まれるが、現場に戻ると何を変えるかが残らない。',
    argument:
      '気づきを、確認項目、役割分担、二週間の試行、記録、戻り回路へ変換して初めて実装になる。',
    firstUse: '研修後15分で、誰が、いつ、どの仕事条件を確認して戻すかを一つ決める。',
    nextHref: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
    nextLabel: '研修後の道具へ',
    tags: ['研修', 'ワークショップ', '実装', '二週間確認'],
    depth: '実装へ戻す',
  },
  {
    id: 'triadic-perspective-gap',
    title: '本人・人事・上司の見え方の差を、仕事設計に変える。',
    category: '開示・評価',
    theme: '三者視点',
    audiences: ['企業・管理職', '支援者', '研究・発信'],
    readerQuestion: '本人、人事、現場上司で、同じ仕事を見ているはずなのに話が噛み合わない。',
    argument:
      'どれか一つを正解にせず、本人の困難、人事の制度、上司の負担を同じ仕事条件地図に置く。',
    firstUse: '一つの場面について、本人、人事、上司がそれぞれ何を見ているかを三列で書く。',
    nextHref: candidateAnchorPath('case-readings', 'consultation-finder'),
    nextLabel: '三者の相談入口へ',
    tags: ['三者視点', '人事', '上司', '本人の声', '評価'],
    depth: '深く読む',
  },
  {
    id: 'support-organization-self-check',
    title: '支援者が動ける組織へ。翻訳負荷を、組織の条件として見る。',
    category: '支援・制度',
    theme: '組織と支援',
    audiences: ['支援者', '行政・政策', '研究・発信'],
    readerQuestion: '支援者個人は頑張っているのに、記録、会議、同行、振り返りが組織に残りにくい。',
    argument:
      '支援者の力量だけでなく、本人・医療・企業・制度を仕事条件へ翻訳し続ける組織機能を見る。',
    firstUse: '支援者が一人で抱えている翻訳作業を、記録、会議、同行、振り返りに分ける。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-support-institution-learning',
    ),
    nextLabel: '支援・制度・知識更新へ',
    tags: ['支援組織', '翻訳負荷', '記録', '会議', '学習回路'],
    depth: '深く読む',
  },
  {
    id: 'support-toolbox-integration',
    title: '支援ツールボックスを、手法名ではなく条件変更ポートで統合する。',
    category: '支援・制度',
    theme: '支援接続',
    audiences: ['支援者', '企業・管理職', '行政・政策', '研究・発信'],
    readerQuestion:
      'CE、IPS、定着支援、AT、AIなど、手法は増えるが、目の前の仕事条件に何が効くのか迷う。',
    argument:
      '支援手法を競わせず、人、仕事、環境、支援、時間、制度のどこを変える道具かとして統合する。',
    firstUse: '手法名を出す前に、変えたい条件が仕事量、情報、環境、支援線、評価のどれかを選ぶ。',
    nextHref: candidatePath('theory-method-trust'),
    nextLabel: '方法と境界を読む',
    tags: ['支援手法', 'AI', 'AT', 'IPS', '条件変更'],
    depth: '深く読む',
  },
  {
    id: 'sustainable-employment-outcomes',
    title: '持続可能な雇用成果とは何か。',
    category: '開示・評価',
    theme: '雇用の質',
    audiences: ['行政・政策', '企業・管理職', '支援者', '研究・発信'],
    readerQuestion:
      '定着期間が長ければ成功なのか。無理の継続や支援終了後の空白をどう見ればよいのか。',
    argument:
      '成果を在籍だけでなく、本人便益、役割成長、支援継続、企業側の学習、見直し可能性として読む。',
    firstUse: '成果報告に、本人便益、役割の伸び、相談経路、見直し可能性の欄を足す。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-relationship-evaluation-growth',
    ),
    nextLabel: '開示・評価・役割・成長へ',
    tags: ['成果指標', '定着', '本人便益', '組織学習'],
    depth: '深く読む',
  },
  {
    id: 'job-analysis-job-creation',
    title: '観察から仕事をつくる。ジョブ分析と職務創出を読み直す。',
    category: '職場運用',
    theme: '職場接触点',
    audiences: ['企業・管理職', '支援者', '行政・政策'],
    readerQuestion:
      '求人がない、任せる仕事がないと言われる職場で、どこから仕事の可能性を見つけるのか。',
    argument: '求人票の前に、作業順序、タイミング、引き継ぎ、エラー許容度、役割価値を観察する。',
    firstUse: '職場を一つ選び、求人票にない準備、確認、引き継ぎ、滞留作業を付箋化する。',
    nextHref: candidateAnchorPath(
      'work-design-views-guide',
      'work-design-domain-worksite-access-operations',
    ),
    nextLabel: '情報・手順・接触点へ',
    tags: ['ジョブ分析', '職務創出', '観察', '役割価値'],
    depth: '深く読む',
  },
  {
    id: 'policy-research-ai-era',
    title: '政策・研究・AI時代の資料を、仕事条件の問いへ戻す。',
    category: '支援・制度',
    theme: '政策・研究',
    audiences: ['行政・政策', '研究・発信', '支援者', '企業・管理職'],
    readerQuestion:
      '政策、研究、国際資料、AI要約を使う時、どうすれば古い見方や一面性を再生産しないか。',
    argument:
      '資料を正解として移植せず、何を照らし、何を見落とし、現場で何を確認するかに変換する。',
    firstUse: '資料を読む時に、主張、見えている条件、見えていない条件、現場で聞く問いに分ける。',
    nextHref: candidatePath('theory-method-trust'),
    nextLabel: 'NBLの専門性を読む',
    tags: ['政策研究', 'AI時代', '国際資料', '資料の読み方'],
    depth: '深く読む',
  },
];

type ArticleExpansionProfile = {
  hook: string;
  sectionHeadings: readonly [string, string, string, string];
  oldReading?: string;
  designReading?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const articleExpansionProfiles: Record<string, ArticleExpansionProfile> = {
  'commute-exhaustion': {
    hook: '通勤や職場内移動で消耗している人に、「仕事そのものはできるのに」と言うだけでは足りません。職場に着くまで、席につくまで、休憩できるまでの条件も、仕事の一部として設計する必要があります。',
    sectionHeadings: [
      '通勤は、仕事の外側ではなく仕事に入る前提である',
      '消耗点を、移動、待機、姿勢、休憩に分ける',
      '職場内移動と職場外移動を、同じ地図で別々に見る',
      '働く前に疲れきらない条件を先に置く',
    ],
    imageSrc: '/images/work-condition-lens-workplace-contact-decomposition-v1.png',
  },
  'rest-reduce-return-choose': {
    hook: '休むこと、仕事量を減らすこと、戻ること、役割を選び直すことが「例外」扱いのままだと、健康を守る行動が本人の不利益になりやすい。働き続けるためには、止まる自由まで仕事条件に含める必要があります。',
    sectionHeadings: [
      '休む自由は、制度だけでなく評価と収入の問題でもある',
      '減らす、戻る、選び直す手順がないと無理が続く',
      '本人の自己管理を、職場の戻り道で支える',
      '健康を守る行動を、罰ではなく設計として扱う',
    ],
    imageSrc: '/images/work-condition-lens-invisible-illness-v1.png',
  },
  'same-meeting-not-same-information': {
    hook: '同じ会議に出ている、同じ資料を見ている、同じ職場にいる。それでも、聞こえ方、見え方、記録の残り方、確認のしやすさが違えば、同じ情報に参加しているとは言えません。',
    sectionHeadings: [
      '参加していることと、情報にアクセスできていることは違う',
      '口頭、文字、図、音、警告、雑談を分けて見る',
      '視覚・聴覚の情報保障を、個別のお願いに閉じない',
      '会議の参加条件を、仕事の情報仕様として整える',
    ],
    imageSrc: '/images/work-condition-lens-workplace-contact-decomposition-v1.png',
  },
  'verbal-only-workplace': {
    hook: '「説明したのに伝わらない」と感じる時、理解力だけを見ると職場は変わりません。口頭で消える情報を、見返せる手順、確認先、例外時の戻り方として残せるかが問われます。',
    sectionHeadings: [
      '口頭説明だけでは、仕事の開始条件が残らない',
      '手順は、開始、途中確認、完了、例外に分ける',
      '見返せる形にすると、本人だけでなく職場も楽になる',
      '説明の量ではなく、確認できる構造を増やす',
    ],
    imageSrc: '/images/work-condition-lens-manual-abundance-v1.webp',
  },
  'sensory-access-work-spec': {
    hook: '視覚・聴覚などの情報保障は、優しさや特別扱いではありません。会議、警告、資料、評価、雑談参加を成立させるための仕事の仕様です。',
    sectionHeadings: [
      '情報保障は、仕事を成立させる仕様である',
      '見る、聞く、読む、触れる、後で確認する経路を増やす',
      '個別のお願いにし続けるほど、本人の負担が増える',
      '通常業務の情報設計として組み込む',
    ],
    imageSrc: '/images/work-condition-lens-accommodation-work-design-v1.png',
  },
  'ai-summary-work-map': {
    hook: 'AI要約は便利です。しかし、何を見るべきかの地図がないまま使うと、本人要因への偏りや古い障害観を、整った文章として再生産する危険があります。',
    sectionHeadings: [
      'AIは読みやすくできるが、正しく読むとは限らない',
      '要約の前に、仕事条件の地図を置く',
      '本人要因化、病名単純化、制度一面化を点検する',
      'AIを、支援者の代替ではなく読みの増幅器にする',
    ],
    imageSrc: '/images/nbl-workdesign-post-cards/CAD-2026-06-04-08.png',
  },
  'procedure-change-return-route': {
    hook: '急な変更で仕事が止まる時、それを「柔軟性がない」と読むと解決が狭くなります。変更前後の違い、確認先、戻る手順が見えるかどうかが、切替を支えます。',
    sectionHeadings: [
      '急な変更は、能力ではなく手順の見え方を問う',
      '変更前、変更後、確認先、戻る条件を並べる',
      '例外対応を、個人の勘ではなく共有手順にする',
      '戻り道があるほど、変更への不安は下がる',
    ],
    imageSrc: '/images/work-condition-lens-workplace-contact-decomposition-v1.png',
  },
  'movement-tools-contact-points': {
    hook: '移動、姿勢、道具、休憩場所、安全連絡は、仕事の周辺ではありません。作業に入るまでの接触点が整わなければ、できる仕事もできない仕事に変わります。',
    sectionHeadings: [
      '仕事は作業だけでなく、作業に入る接触点で決まる',
      '入口、動線、机、端末、道具、休憩場所を順に見る',
      '職場内移動と職場外移動の役割を分ける',
      '道具と環境を変えると、能力の見え方が変わる',
    ],
    imageSrc: '/images/work-condition-lens-workplace-contact-decomposition-v1.png',
  },
  'safe-stop-criteria': {
    hook: '悪化してから止まるのではなく、早く止める、減らす、相談する基準を通常業務に入れる。安全に止める基準は、働き続けるための条件です。',
    sectionHeadings: [
      '止める基準がないと、無理か離脱かの二択になる',
      '赤信号の前に、黄信号を共有する',
      '安全停止は、本人だけでなく上司の判断負担も下げる',
      '予防と見直しを通常業務に入れる',
    ],
    imageSrc: '/images/work-condition-lens-mental-health-work-design-v1.png',
  },
  'manual-to-meeting': {
    hook: 'マニュアルや制度資料が増えても、会議で何を確認し、誰が何を変えるかに落ちなければ、現場は動きません。知識は会議で使える形にして初めて仕事条件を変えます。',
    sectionHeadings: [
      'マニュアルの量と、現場で使える度合いは違う',
      '資料を、会議で確認する問いへ翻訳する',
      '本人、上司、人事、支援者が同じ対象を見る',
      '知識を、次の二週間の実装へ残す',
    ],
    imageSrc: '/images/work-condition-lens-manual-abundance-v1.webp',
  },
  'disclosure-for-change': {
    hook: '障害や病気をどこまで話すか。その問いは大切ですが、それだけでは開示の負担が本人に残ります。何を変えるために、誰に、どの範囲で共有するかを設計する必要があります。',
    sectionHeadings: [
      '開示は、情報量ではなく目的の設計である',
      '共有する相手、範囲、記録、評価を分ける',
      '不利益不安がある場では、相談は遅れる',
      '仕事条件を変えるための開示境界をつくる',
    ],
    imageSrc: '/images/work-condition-lens-invisible-illness-v1.png',
  },
  'evaluation-anxiety-separate': {
    hook: '必要な相談をしたいのに、評価や処遇に響くのではないかと思って言えない。この不安を本人の遠慮にすると、調整の入口が閉じます。',
    sectionHeadings: [
      '評価不安があると、相談は始まらない',
      '評価者、調整者、記録範囲を分ける',
      '相談したことが何を変え、何を変えないかを見える化する',
      '評価から切り離せる情報共有を設計する',
    ],
    imageSrc: '/images/work-condition-lens-triadic-perspective-v1.png',
  },
  'accommodation-growth-risk': {
    hook: '配慮があるのに、任される仕事や学ぶ機会が減っている。これは配慮が悪いという話ではなく、働き続ける条件と成長する条件が切り離されているサインです。',
    sectionHeadings: [
      '配慮が、成長機会を狭めることがある',
      '守る条件と広げる条件を同時に見る',
      '役割、評価、学習、賃金を分けて確認する',
      '配慮を、参加の質へつなぎ直す',
    ],
    imageSrc: '/images/work-condition-lens-diversity-after-hiring-v1.webp',
  },
  'beyond-working': {
    hook: '働けている。定着している。問題は起きていない。それでも、役割、賃金、評価、成長の機会が狭いままなら、参加の質はまだ見えていません。',
    sectionHeadings: [
      '在籍は成果の一部であって、参加の全体ではない',
      '役割の広がりと賃金を、雇用の質として見る',
      '評価の言葉が曖昧だと、成長の道が消える',
      '働けている先に、選び直しの自由を置く',
    ],
    imageSrc: '/images/work-condition-lens-employment-quality-v1.png',
  },
  'before-work-anxiety': {
    hook: 'まだ働いていない人の不安を、意欲の不足として読むと、入口はさらに遠くなります。仕事像、体験、通勤、健康時間、支援接続がまだ結ばれていない状態として読む必要があります。',
    sectionHeadings: [
      '働く前の不安は、意欲だけの問題ではない',
      '仕事像、体験、生活保障、支援接続を分けて聞く',
      '未就業の声を、薄い材料として扱わない',
      '働く前から、仕事条件の地図をつくる',
    ],
    imageSrc: '/images/nbl-workdesign-post-cards/CAD-2026-06-13-01.png',
  },
  'trial-to-after-hiring': {
    hook: '実習や職場体験で見えた条件が、採用後に残らない。すると本人も職場も、同じ調整を最初からやり直すことになります。',
    sectionHeadings: [
      '体験で見えた条件は、採用後に消えやすい',
      '仕事量、説明形式、休憩、相談線を記録する',
      '実習の成功を、採用後の確認表へ移す',
      '移行支援を、記録と会議の形に残す',
    ],
    imageSrc: '/images/nbl-workdesign-post-cards/CAD-2026-06-04-02.png',
  },
  'return-to-work-volume': {
    hook: '復職日が決まっても、仕事量、回復、評価、相談線が決まっていなければ、戻った後に崩れやすい。復職は日付ではなく、戻り方の設計です。',
    sectionHeadings: [
      '復職は、戻る日だけでは設計できない',
      '仕事量と回復余地を段階的に確認する',
      '評価時期と相談線を、復職後の表に入れる',
      '戻った後に選び直せる道を残す',
    ],
    imageSrc: '/images/work-condition-lens-treatment-work-time-v1.png',
  },
  'diagnosis-training-limits': {
    hook: '診断名や障害特性を学ぶ研修は必要です。しかし、そのままでは現場の仕事の渡し方、評価、相談線、手順は変わりにくい。研修は仕事条件へ戻して初めて実装になります。',
    sectionHeadings: [
      '診断名を知っても、仕事の変え方は自動では見えない',
      '研修テーマを、情報形式、仕事量、評価、相談線へ戻す',
      '管理職の判断負担を下げる形で設計する',
      '研修後の一手を、二週間の試行へ残す',
    ],
    imageSrc: '/images/work-condition-lens-workshop-implementation-v1.png',
  },
  'research-to-field-question': {
    hook: '制度、研究、海外事例を読んでも、現場の会議で何を変えるかに落ちなければ使えません。資料は答えではなく、見落とされた条件を照らすレンズです。',
    sectionHeadings: [
      '資料は答えではなく、問いを増やす材料である',
      '何が見えていて、何が見えていないかを分ける',
      '現場で確認する仕事条件へ翻訳する',
      '研究と実務を、同じ場面でつなぐ',
    ],
    imageSrc: '/images/work-condition-lens-policy-research-translation-v1.png',
  },
  'multi-actor-same-scene': {
    hook: '関係者が多いのに話がずれる時、情報共有量を増やすだけでは足りません。本人、企業、医療、福祉、行政が、同じ仕事場面を見ているかが問われます。',
    sectionHeadings: [
      '連携は、同じ場面を見られるかで決まる',
      '本人、職場、医療、福祉、制度の見方を分ける',
      '誰がどの条件を変えるかを合わせる',
      '多職種連携を、会議の量ではなく場面共有で設計する',
    ],
    imageSrc: '/images/work-condition-lens-multidisciplinary-shared-scene-v1.webp',
  },
  'label-lived-work-experience': {
    hook: '診断名、障害名、制度の言葉は必要です。しかし、その言葉だけで本人の就労経験を理解したつもりになると、仕事場面の条件が消えます。',
    sectionHeadings: [
      'ラベルは入口であって、仕事経験そのものではない',
      '制度語の奥にある場面、時間、情報経路を見る',
      '診断名を消さず、診断名で止まらない',
      '相互作用としての就労経験へ進む',
    ],
    imageSrc: '/images/work-condition-lens-icf-interaction-v1.png',
  },
  'reasonable-accommodation-work-design': {
    hook: '合理的配慮の名前を探す前に、仕事を分解する。作業、時間、情報、環境、相談線、評価のどこが詰まっているかを見ないと、配慮は制度語のまま残ります。',
    sectionHeadings: [
      '配慮名の前に、仕事の接触点を見る',
      '作業、時間、情報、環境、相談、評価に分ける',
      '制度語を、職場で変える条件へ翻訳する',
      '配慮を、本人だけでなく仕事設計として扱う',
    ],
    imageSrc: '/images/work-condition-lens-accommodation-work-design-v1.png',
  },
  'workshop-to-implementation': {
    hook: 'ワークショップで気づきが生まれても、現場に戻った時に何を変えるかが残らなければ、よい時間で終わります。気づきは実装へ渡す必要があります。',
    sectionHeadings: [
      '気づきは、現場に戻ると消えやすい',
      '誰が、いつ、どの条件を確認するかを決める',
      '二週間の試行と戻り回路を残す',
      '研修を、組織の学習回路に変える',
    ],
    imageSrc: '/images/work-condition-lens-workshop-implementation-v1.png',
  },
  'triadic-perspective-gap': {
    hook: '本人、人事、現場上司は、同じ仕事を見ているようで違うものを見ています。どれか一つを正解にするのではなく、見え方の差を仕事設計に変えます。',
    sectionHeadings: [
      '三者の見え方は、ずれていることが自然である',
      '本人の困難、人事の制度、上司の負担を並べる',
      '見え方の差を、責任追及ではなく設計材料にする',
      '三者で同じ仕事条件地図を見る',
    ],
    imageSrc: '/images/work-condition-lens-triadic-perspective-v1.png',
  },
  'support-organization-self-check': {
    hook: '支援者個人が頑張っているのに、記録、会議、同行、振り返りが組織に残らない。支援の質は、個人の力量だけでなく組織が翻訳負荷を持てるかで変わります。',
    sectionHeadings: [
      '支援者の頑張りだけでは、知識が残らない',
      '翻訳作業を、記録、会議、同行、振り返りに分ける',
      '組織が持つべき支援条件を見える化する',
      '支援者が動ける組織を、学習回路として設計する',
    ],
    imageSrc: '/images/work-condition-lens-support-translation-v1.webp',
  },
  'support-toolbox-integration': {
    hook: 'CE、IPS、定着支援、AT、AI。手法が増えるほど、目の前の仕事条件に何が効くのか分かりにくくなることがあります。手法名ではなく、どの条件を変える道具かで統合します。',
    sectionHeadings: [
      '支援手法を競わせると、目の前の条件が見えなくなる',
      '人、仕事、環境、支援、時間、制度のどこを変えるかで見る',
      '手法名の前に、変えたい条件を選ぶ',
      '支援ツールボックスを、条件変更ポートで統合する',
    ],
    imageSrc: '/images/work-condition-lens-support-translation-v1.webp',
  },
  'sustainable-employment-outcomes': {
    hook: '定着期間が長いことは大切です。しかし、無理の継続、低い役割、支援終了後の空白が隠れているなら、持続可能な雇用成果とは言えません。',
    sectionHeadings: [
      '定着は成果の一部だが、成果の全部ではない',
      '本人便益、役割成長、支援継続、組織学習を見る',
      '無理の継続を、成功として数えない',
      '成果報告を、次の人に渡せる条件へ変える',
    ],
    imageSrc: '/images/work-condition-lens-employment-quality-v1.png',
  },
  'job-analysis-job-creation': {
    hook: '求人がない、任せる仕事がない。そう見える職場にも、準備、確認、引き継ぎ、滞留作業、役割価値が隠れていることがあります。観察から仕事をつくる視点が必要です。',
    sectionHeadings: [
      '求人票の前に、職場の実際の流れを見る',
      '準備、確認、引き継ぎ、滞留作業を探す',
      '役割価値とエラー許容度を分ける',
      'ジョブ分析を、職務創出へつなげる',
    ],
    imageSrc: '/images/work-condition-lens-workplace-contact-decomposition-v1.png',
  },
};

function articleInfographicSrc(articleId: string) {
  return `/images/axiom-article-image2-infographics/${articleId}-v1.png`;
}

function articleInfographicAlt(entry: ArticleCatalogEntry) {
  return `${entry.title}の読者の問いを、仕事条件の見方へ読み替える流れをイラストで示すインフォグラフィック`;
}

function buildArticleVisualCorrespondence(entry: ArticleCatalogEntry) {
  return {
    body: `${entry.readerQuestion}という読者の問いを、${entry.category}だけでなく、本人・仕事・環境・支援・時間・制度の関係として見るための図解です。`,
    cues: Array.from(
      new Set([entry.theme, entry.category, ...entry.tags.slice(0, 2), entry.nextLabel]),
    ),
  };
}

const oldReadingByCategory: Record<ArticleCatalogCategory, string> = {
  健康時間: '本人の体調管理や勤務時間の調整だけで考える。',
  情報アクセス: '本人が聞き返す、見落とす、理解する努力をすればよいと考える。',
  職場運用: '手順、道具、移動、休憩、安全を仕事の周辺問題として扱う。',
  '開示・評価': '本人がどこまで話すか、職場がどこまで配慮するかの二択で考える。',
  '入口・移行': '働く前、実習、採用後、復職後を別々の出来事として扱う。',
  '支援・制度': '制度、支援機関、研修、資料があれば現場に届くと考える。',
};

function buildGeneratedArticleSections(
  entry: ArticleCatalogEntry,
  profile: ArticleExpansionProfile,
): ArticleSocialQuestionFullArticle['sections'] {
  return [
    {
      heading: profile.sectionHeadings[0],
      body: `${entry.readerQuestion} この問いは、本人の努力や現場の理解不足だけで片づけると見えにくくなります。まず見るべきなのは、本人、仕事、環境、支援、時間、制度のどこが噛み合っていないのかです。${entry.theme}の論点は、社会的には大きく見えても、現場では一つの仕事場面として現れます。`,
    },
    {
      heading: profile.sectionHeadings[1],
      body: `${entry.argument} ここで重要なのは、問題を一つの原因に閉じないことです。仕事量、情報形式、移動、相談線、評価、生活保障、支援接続のどれが関係しているかを分けると、本人責任でも企業批判でもない、変えられる条件が見えてきます。`,
    },
    {
      heading: profile.sectionHeadings[2],
      body: `このテーマは、関係者によって見え方が変わります。本人には不安や説明負担として、企業には判断負担や運用の迷いとして、支援者には翻訳負荷として、政策や研究の場には指標や制度の空白として現れます。だからこそ、同じ場面を同じ地図で見ながら、どの条件を誰が変えるのかを話す必要があります。`,
    },
    {
      heading: profile.sectionHeadings[3],
      body: `最初の一手は、${entry.firstUse} です。これは結論ではなく、相談や会議を具体化する入口です。うまくいくかどうかは、個別状況、職務内容、職場環境、支援資源、時期、制度条件によって変わります。だからこそ、早い段階で小さく試し、記録し、見直せる形にすることが重要です。`,
    },
  ];
}

function buildGeneratedDiscussionQuestions(entry: ArticleCatalogEntry) {
  return [
    `この問いを、${entry.category}だけでなく、どの仕事条件と一緒に見る必要があるか。`,
    '本人、職場、支援者で、同じ場面を見ていると言えるか。',
    `明日から小さく確認するなら、${entry.firstUse}をどこで試せるか。`,
  ] as const;
}

function buildGeneratedNextUseGroups(entry: ArticleCatalogEntry) {
  return [
    {
      title: '近い相談で読む',
      intent: '記事の論点を、断片的な相談の一言へ戻す。',
      href: candidateAnchorPath('case-readings', 'consultation-finder'),
      items: [
        entry.readerQuestion,
        `${entry.category}の問題に見えているが、他の条件も絡んでいないか確認する。`,
        '本人、企業、支援者の見え方の差を一つの場面で並べる。',
      ],
    },
    {
      title: '設計ガイドで見る',
      intent: '論点を、仕事・社会参加設計の確認項目へ戻す。',
      href: entry.nextHref.includes('work-design-views-guide')
        ? entry.nextHref
        : candidatePath('work-design-views-guide'),
      items: [
        entry.argument,
        `${entry.category}を、本人・仕事・環境・支援・時間・制度の地図に置く。`,
        '単発対応で終わらせず、予防・見直し・成長の条件も確認する。',
      ],
    },
    {
      title: 'ツールにする',
      intent: '読後の気づきを、会議や研修で使える形にする。',
      href: candidateAnchorPath('toolkit-studio', 'toolkit-studio-modules'),
      items: [
        entry.firstUse,
        `記事の要点を「${entry.tags.slice(0, 3).join(' / ')}」の確認カードにする。`,
        '一枚地図、4コマ、面談メモ、研修ワークのどれで共有すると動きやすいか選ぶ。',
      ],
    },
  ] satisfies ArticleSocialQuestionFullArticle['nextUseGroups'];
}

function buildGeneratedFullArticle(
  entry: ArticleCatalogEntry,
  index: number,
): ArticleSocialQuestionFullArticle {
  const profile = articleExpansionProfiles[entry.id] ?? {
    hook: entry.argument,
    sectionHeadings: [
      '読者の問いを、仕事条件の問いへ戻す',
      '一つの原因ではなく、相互作用として見る',
      '関係者の見え方を、同じ場面に置く',
      '最初の一手を、試せる形にする',
    ],
  };

  return {
    id: entry.id,
    featureLabel: `本格記事 ${String(index + 1).padStart(2, '0')}`,
    readingTime: entry.depth === '実装へ戻す' ? '約6分' : '約7分',
    title: entry.title,
    category: `${entry.theme}・${entry.category}`,
    reader: entry.audiences.join('・'),
    hook: profile.hook,
    imageSrc: articleInfographicSrc(entry.id),
    imageAlt: articleInfographicAlt(entry),
    sections: buildGeneratedArticleSections(entry, profile),
    oldReading: profile.oldReading ?? oldReadingByCategory[entry.category],
    designReading: profile.designReading ?? entry.argument,
    firstMove: entry.firstUse,
    discussionQuestions: buildGeneratedDiscussionQuestions(entry),
    nextUseGroups: buildGeneratedNextUseGroups(entry),
  };
}

function buildArticleSocialQuestionFullArticles(
  entries: readonly ArticleCatalogEntry[],
  drafts: readonly ArticleSocialQuestionFullArticle[],
): readonly ArticleSocialQuestionFullArticle[] {
  const draftById = new globalThis.Map(drafts.map((article) => [article.id, article]));
  const draftByTitle = new globalThis.Map(drafts.map((article) => [article.title, article]));

  return entries.map((entry, index) => {
    const reusableDraft = draftById.get(entry.id) ?? draftByTitle.get(entry.title);
    if (!reusableDraft) {
      return buildGeneratedFullArticle(entry, index);
    }

    return {
      ...reusableDraft,
      id: entry.id,
      featureLabel: `本格記事 ${String(index + 1).padStart(2, '0')}`,
      category: `${entry.theme}・${entry.category}`,
      reader: entry.audiences.join('・'),
      imageSrc: articleInfographicSrc(entry.id),
      imageAlt: articleInfographicAlt(entry),
    };
  });
}

const articleSocialQuestionFullArticles = buildArticleSocialQuestionFullArticles(
  axiomArticleCatalogEntries,
  articleSocialQuestionDraftFullArticles,
);

export type AxiomNblReportShareItem = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  targetPath: string;
  sharePath: string;
};

export function buildAxiomNblReportShareItems(): readonly AxiomNblReportShareItem[] {
  return articleSocialQuestionFullArticles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.hook,
    imageSrc: article.imageSrc,
    imageAlt: article.imageAlt,
    targetPath: nblReportArticleContentPath(article.id),
    sharePath: nblReportArticleSharePath(article.id),
  }));
}

export type AxiomNblReportArticleVisualQaItem = {
  articleId: string;
  articleNumber: number;
  title: string;
  theme: ArticleCatalogTheme;
  category: ArticleCatalogCategory;
  readerQuestion: string;
  imageSrc: string;
  imageAlt: string;
  visualCorrespondenceBody: string;
  visualCues: readonly string[];
  hook: string;
  oldReading: string;
  designReading: string;
  sectionHeadings: readonly string[];
  nextUseTargets: readonly string[];
  humanVisualCheckJa: readonly string[];
};

export type AxiomNblReportArticleVisualQaValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_nbl_report_article_visual_qa_valid'
    | 'axiom_nbl_report_article_visual_qa_invalid';
  errorCount: number;
  errors: string[];
};

const articleVisualHumanCheckJa = [
  '図解が記事タイトルと読者問いを一目で支えているか。',
  '図解対応の本文と画像altが、同じ仕事条件の論点を示しているか。',
  '記事本文の4見出しと、図解の中心メッセージがずれていないか。',
] as const;

export function buildAxiomNblReportArticleVisualQaItems(): readonly AxiomNblReportArticleVisualQaItem[] {
  const entryById = new globalThis.Map(
    axiomArticleCatalogEntries.map((entry) => [entry.id, entry]),
  );

  return articleSocialQuestionFullArticles.map((article, index) => {
    const entry = entryById.get(article.id);
    const visualCorrespondence = entry
      ? buildArticleVisualCorrespondence(entry)
      : { body: article.designReading, cues: [] };

    return {
      articleId: article.id,
      articleNumber: index + 1,
      title: article.title,
      theme: entry?.theme ?? '雇用の質',
      category: entry?.category ?? '支援・制度',
      readerQuestion: entry?.readerQuestion ?? article.hook,
      imageSrc: article.imageSrc,
      imageAlt: article.imageAlt,
      visualCorrespondenceBody: visualCorrespondence.body,
      visualCues: visualCorrespondence.cues,
      hook: article.hook,
      oldReading: article.oldReading,
      designReading: article.designReading,
      sectionHeadings: article.sections.map((section) => section.heading),
      nextUseTargets: article.nextUseGroups.map((group) => group.title),
      humanVisualCheckJa: articleVisualHumanCheckJa,
    };
  });
}

export function validateAxiomNblReportArticleVisualQaItems(
  items: readonly AxiomNblReportArticleVisualQaItem[],
): AxiomNblReportArticleVisualQaValidation {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (items.length !== 36) {
    errors.push(`article_visual_qa_must_cover_36_articles:${items.length}`);
  }

  for (const item of items) {
    if (ids.has(item.articleId)) {
      errors.push(`duplicate_article_id:${item.articleId}`);
    }
    ids.add(item.articleId);

    if (!item.imageSrc.startsWith('/images/axiom-article-image2-infographics/')) {
      errors.push(`article_image_must_use_image2_infographic:${item.articleId}`);
    }
    if (!item.imageAlt.includes(item.title)) {
      errors.push(`article_alt_must_include_title:${item.articleId}`);
    }
    if (item.visualCorrespondenceBody.length < 60) {
      errors.push(`article_visual_correspondence_too_short:${item.articleId}`);
    }
    if (item.visualCues.length < 4) {
      errors.push(`article_visual_cues_too_few:${item.articleId}`);
    }
    if (item.sectionHeadings.length < 4) {
      errors.push(`article_sections_too_few:${item.articleId}`);
    }
    if (item.nextUseTargets.length < 3) {
      errors.push(`article_next_use_targets_too_few:${item.articleId}`);
    }
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_nbl_report_article_visual_qa_valid'
        : 'axiom_nbl_report_article_visual_qa_invalid',
    errorCount: errors.length,
    errors,
  };
}

function normalizeArticleCatalogSearch(input: string) {
  return input.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function articleCatalogEntryMatchesSearch(entry: ArticleCatalogEntry, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  const searchTerms = normalizedQuery.split(' ').filter(Boolean);
  const haystack = normalizeArticleCatalogSearch(
    [
      entry.title,
      entry.category,
      entry.theme,
      entry.audiences.join(' '),
      entry.readerQuestion,
      entry.argument,
      entry.firstUse,
      entry.nextLabel,
      entry.tags.join(' '),
    ].join(' '),
  );

  return searchTerms.every((term) => haystack.includes(term));
}

const sceneComics: readonly SceneComic[] = [
  {
    id: 'visible-numbers-invisible-participation',
    issueLabel: '雇用の質',
    title: '見える数字と、見えにくい参加',
    subtitle: '雇用率や採用数は見えるが、役割・評価・成長は見えにくい。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-visible-participation-v1.png',
    alt: '雇用率の数字から役割、評価、成長、健康時間、相談線を含む参加の質へ読み替える4コマ',
    commonMisread: '雇用率、採用数、定着率が上がれば、参加の問題は解けていると読む。',
    axiomRead:
      '働いているかだけでなく、どんな役割で、どう評価され、何を学び、体調や相談線をどう扱えるかまで見る。',
    nextMove:
      '数字の横に、役割、評価、成長機会、健康時間、相談線を並べ、参加の質を話せる地図にする。',
    whyThisScene:
      '数字は共有しやすい一方で、数字だけでは仕事の中身や本人の将来が見えない。古くからある「雇用の量と質」の分断を扱う入口です。',
    sharedAction:
      '数字の先にある役割・評価・成長を、本人、企業、支援者が同じ地図で見られるようにする。',
    panelCaptions: [
      '雇用率は上がった。',
      'でも役割や成長は見えない。',
      '参加の質を分けて見る。',
      '数字の先を設計する。',
    ],
  },
  {
    id: 'name-stops',
    issueLabel: '名前で止まる',
    title: '名前で止まる',
    subtitle: '診断名・障害種別・配慮名から答えを探してしまう。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-name-stops-v1.png',
    alt: '診断名を入口にしつつ、同じ名前でも通勤、仕事量、情報形式、評価、支援条件が異なることを示す4コマ',
    commonMisread: '診断名や障害種別を見れば、必要な配慮や支援の答えが決まると読む。',
    axiomRead:
      '名前は重要な入口として扱いながら、通勤、仕事量、情報形式、評価、支援接続、環境条件の組み合わせを確認する。',
    nextMove:
      '病名や障害名を消さず、そこから仕事条件チェックへ進む。名前から分かることと、まだ分からないことを分ける。',
    whyThisScene:
      '診断名や障害種別は話を始める助けになる一方、同じ名前の中に多様な働き方がある。名前だけで止まると、個別性と共通設計の両方が失われます。',
    sharedAction: '名前を入口にし、答えは一人ひとりの仕事条件の中で確認する。',
    panelCaptions: [
      '診断名から答えを探す。',
      '同じ名前でも条件は違う。',
      '仕事条件に分ける。',
      '名前を入口にして確認する。',
    ],
  },
  {
    id: 'health-time',
    issueLabel: '健康時間',
    title: '健康時間',
    subtitle: '通院・治療・回復・症状変動が勤務表や評価に翻訳されにくい。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-health-time-v1.png',
    alt: '通院、治療、回復、仕事量、評価タイミングを同じ週の勤務表へ翻訳する4コマ',
    commonMisread: '休むか頑張るか、本人が体調管理できているか、という二択にする。',
    axiomRead: '通院、治療、回復、症状変動、仕事密度、締切、共有範囲、評価時期を同じ時間軸で見る。',
    nextMove:
      '同じ週の勤務表に、仕事量、通院・治療、回復時間、評価タイミング、代替手順を一緒に置く。',
    whyThisScene:
      '健康と仕事を別々に見ると、努力不足にも、過剰配慮にも寄りやすい。健康時間は、働き続けるための時間設計として扱う必要があります。',
    sharedAction: '休むか頑張るかではなく、仕事と回復を同じ予定表で相談できるようにする。',
    panelCaptions: [
      '休むか頑張るかの二択になる。',
      '通院・治療・回復が見えない。',
      '同じ週の仕事量と回復を重ねる。',
      '勤務表と評価に翻訳する。',
    ],
  },
  {
    id: 'information-fragmentation',
    issueLabel: '情報の分断',
    title: '情報の分断',
    subtitle: '本人、企業、医療、福祉、行政が同じ仕事条件の地図を共有しにくい。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-information-fragmentation-v1.png',
    alt: '本人、企業、医療、福祉、行政の情報を同じ仕事条件の共有マップにする4コマ',
    commonMisread: 'それぞれが持つ情報を増やせば、自然に連携できると読む。',
    axiomRead:
      '誰が何を、どの仕事条件へ翻訳するのかを見る。本人の説明負担、企業の判断負担、支援者の橋渡しを同じ地図に載せる。',
    nextMove:
      '本人、企業、医療・福祉、制度・行政の情報を、作業、時間、情報、環境、支援、評価の共通枠へ戻す。',
    whyThisScene:
      '情報が多いほど解けるとは限らない。別々の言葉で持たれた情報が仕事条件へ翻訳されないと、本人の説明負担と現場の属人対応に戻ります。',
    sharedAction: 'それぞれの情報を、同じ仕事条件の共有マップへ置き直す。',
    panelCaptions: [
      'それぞれの情報はある。',
      'でも同じ地図にならない。',
      '誰が何を仕事条件へ翻訳するか。',
      '説明負担を一人に戻さない。',
    ],
  },
  {
    id: 'policy-to-practice',
    issueLabel: '制度から現場へ',
    title: '制度から現場へ',
    subtitle: '合理的配慮や制度説明が、作業・手順・相談線・評価運用へ落ちにくい。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-policy-to-practice-v1.png',
    alt: '合理的配慮や制度語を作業、手順、情報、環境、支援、評価へ翻訳する4コマ',
    commonMisread: '制度やガイドラインを説明すれば、現場の行動も変わると読む。',
    axiomRead:
      '法務語や制度語を否定せず、職場で確認できる作業、時間、情報、環境、支援、評価の条件へ翻訳する。',
    nextMove: '制度説明の横に、明日の作業手順、締切、情報の渡し方、相談先、評価の見方を短く置く。',
    whyThisScene:
      '合理的配慮や制度は重要でも、職場で何を変えるかが見えなければ実装されない。制度と現場の間にある翻訳負荷を扱う課題です。',
    sharedAction: '制度を守るだけでなく、働ける条件として現場で確認できる形にする。',
    panelCaptions: [
      '制度説明はある。',
      'でも仕事に落ちない。',
      '作業・手順・評価へ翻訳する。',
      '現場で確認できる形にする。',
    ],
  },
  {
    id: 'manager-dependence',
    issueLabel: '上司依存',
    title: '上司依存',
    subtitle: '理解ある上司や個別対応に乗り、再利用できる設計単位にならない。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-manager-dependence-v1.png',
    alt: '理解ある上司の個別対応を、誰が代わっても見直せる仕事設計へ変える4コマ',
    commonMisread: '理解ある人がいればうまくいき、いなければ仕方がないと読む。',
    axiomRead:
      '善意や経験を責めず、手順、共有範囲、相談線、記録、引き継ぎとして残せる設計単位へ変える。',
    nextMove:
      'うまくいった個別対応を、誰が、何を、どこまで、いつ見直すかが分かる短い設計シートにする。',
    whyThisScene:
      '善意は大切だが、善意だけに依存すると異動や繁忙で途切れる。属人性を責めるのではなく、続けられる形へ変える課題です。',
    sharedAction: '個別対応を、人に頼りきらない再利用できる仕事設計へ変える。',
    panelCaptions: [
      '理解ある上司が支えている。',
      'でも異動で途切れる。',
      '善意を設計単位にする。',
      '誰が代わっても見直せる。',
    ],
  },
  {
    id: 'search-ai-limits',
    issueLabel: '検索・SNS・AI',
    title: '検索・SNS・AI要約の限界',
    subtitle: '検索や要約は入口になる一方、古い障害観や単純化を再生産しうる。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-search-ai-limits-v1.png',
    alt: '検索、SNS、AI要約を答えにせず、偏り、情報の身元、足りない確認を分けて現場の問いへ戻す4コマ',
    commonMisread: '検索結果、SNSで反応が多い投稿、AI要約を分かりやすい答えとして使う。',
    axiomRead:
      '情報をそのまま使わず、誰の情報か、何を照らすか、何が足りないか、少数の声が埋もれていないかを分けて読む。',
    nextMove:
      '記事や教材へ使う前に、主張、根拠の身元、偏り、現場で確認する仕事条件の問いへ分ける。',
    whyThisScene:
      '検索やAIは入口として強いが、古い障害観や多数派の見方も同時に増幅する。便利さと危うさを同時に扱う課題です。',
    sharedAction: '反応や要約を答えにせず、確認できる仕事条件へ戻す。',
    panelCaptions: [
      'すぐ答えが見つかる。',
      'でも古い見方も混ざる。',
      '偏り・身元・不足を分ける。',
      '現場で確認する問いへ戻す。',
    ],
  },
  {
    id: 'learning-loop',
    issueLabel: '学びの循環',
    title: '学びが育たない',
    subtitle: '研修・政策・相談の問いが、改稿や教材化の循環に残りにくい。',
    image: '/images/axiom-scene-comics/axiom-scene-old-new-learning-loop-v1.png',
    alt: '相談、研修、会議、政策で生まれた誤読、沈黙、質問を記事、図解、相談事例、仕事設計、研修ワークへ循環させる4コマ',
    commonMisread: '相談、研修、会議、政策資料を、その場で終わる個別イベントとして扱う。',
    axiomRead:
      '誤読、沈黙、追加質問、言いづらい反応を、次の相談事例、記事、図解、仕事設計、研修ワークへ戻す学習資産として読む。',
    nextMove:
      '一回の発信や相談の後に、残った問い、誤解された点、追加で必要な図解や事例を短く記録して改稿へ回す。',
    whyThisScene:
      '現場の違和感や政策議論の問いが、次の教材や実装へ残らないと、社会全体の学びが育たない。NBLサイト全体の更新循環につながる課題です。',
    sharedAction: '一回の発信を、次の理解と実装へ循環させる。',
    panelCaptions: [
      '一回ごとに終わる。',
      '誤読や沈黙が消える。',
      '問いを集めて改稿する。',
      '社会の学びとして育てる。',
    ],
  },
];

const sceneIssueMapHero = {
  src: '/images/axiom-scene-comics/axiom-scene-old-new-issue-map-v2.png',
  alt: '見える数字、名前、健康時間、情報分断、制度、上司依存、検索SNSAI、学びの循環という8つの古くて新しい課題を仕事条件の地図へつなぐ図',
} as const;

const homeWhyHeroVisual = {
  src: '/images/next-nbl-home-why-hero-imagegen-v1.png',
  webpSrc: '/images/next-nbl-home-why-hero-imagegen-v1.webp',
  alt: '障害者雇用・難病就労支援の断片的な情報を、AIの文脈読解補助と人間の確認を通して、本人・仕事・環境・支援・時間・評価の条件地図へ読み替える図',
} as const;

const homeHeroVisual = {
  src: '/images/next-nbl-home-hero-image2-v1.png',
  alt: '働きづらさを仕事条件の地図へ変換し、8つの課題、相談事例、設計ガイド、NBLレポート、ツールキット、障害種類から見る入口へつなぐ図解',
} as const;

const consultationAssessmentHeroVisual = {
  src: '/images/next-nbl-consultation-assessment-loop-hero-v1.png',
  alt: '相談の一言を受け止め、条件を一緒に確認し、仕事・環境・支援・時間・評価を見ながら支援計画を組み直す対話型アセスメントの循環図',
} as const;

const articleReportHeroVisual = {
  src: '/images/next-nbl-report-hero-v1.png',
  alt: 'NBLレポート。本人の違和感、企業の迷い、支援者の翻訳負荷、政策議論、ニュースSNSを、仕事条件の問いへ戻し、読む、話す、相談へ戻す、設計へつなぐ流れを示す図解。',
} as const;

const toolkitHeroVisual = {
  src: '/images/next-nbl-toolkit-hero-image2-v1.png',
  alt: 'ツールキット。言葉だけでは届きにくいことを、選別図解、4コマ・マンガ、音楽、フォーラム、チェックリストという別の形で手渡す素材棚の図解。',
} as const;

const workConditionWindowHeroVisual = {
  src: '/images/next-nbl-condition-window-hero-image2-v1.png',
  alt: '障害者雇用は例外対応ではなく、視覚、聴覚、肢体、内部、知的、精神、発達、高次脳、難病の入口を、誰もが活躍できる仕事・参加設計へつなぐ図解。',
} as const;

const consultationFaqCategories: readonly ConsultationFaqCategory[] = [
  {
    title: '健康時間・仕事密度',
    lead: '疲れ、通院、回復時間、締切、仕事量、翌日の影響が同じ週に重なる相談。',
    examples: [
      '疲れやすいので、どのくらい休めばよいですか。',
      '通院の翌日に修正作業が集中してしまいます。',
      '月末だけ体調が崩れます。仕事を続けられるのでしょうか。',
    ],
  },
  {
    title: '情報形式・参加',
    lead: '会議、資料、音声、文字、図、警告、連絡方法が参加条件になっている相談。',
    examples: [
      '同じ会議にいるのに、話についていけません。',
      '口頭説明だけだと、後で確認できず不安です。',
      '見落としや聞き返しを注意されます。',
    ],
  },
  {
    title: '手順変更・切替負荷',
    lead: '手順書、急な変更、優先順位、確認先、切替の負荷が絡む相談。',
    examples: [
      '急な予定変更が続くと作業が止まります。',
      '説明されたはずなのに、変更後の正解が分かりません。',
      '確認すると評価が下がる気がして聞けません。',
    ],
  },
  {
    title: '職場内外の移動・道具',
    lead: '通勤、職場内移動、休憩場所、姿勢、道具、安全、接触点が仕事遂行に影響する相談。',
    examples: [
      '通勤だけで消耗し、仕事に入る前につらくなります。',
      '職場内の移動や物の配置で作業が途切れます。',
      '休憩場所や姿勢の調整をどう相談すればよいですか。',
    ],
  },
  {
    title: '開示・共有範囲',
    lead: '何を、誰に、どこまで、どの目的で伝えるかが評価や不利益不安と絡む相談。',
    examples: [
      '病名や障害名をどこまで伝えるべきか分かりません。',
      '伝えると評価に響くのではないかと不安です。',
      '職場はどこまで聞いてよいのでしょうか。',
    ],
  },
  {
    title: '評価・役割・成長',
    lead: '働けているが、評価、期待値、役割、成長、仕事の質が止まりやすい相談。',
    examples: [
      '配慮はありますが、成長機会が減っている気がします。',
      'できる仕事だけ任され、評価につながりません。',
      '安定して働くことと、挑戦することをどう両立しますか。',
    ],
  },
  {
    title: '支援接続・再翻訳',
    lead: '支援者、医療、企業、人事、上司の言葉が仕事の手順へつながらない相談。',
    examples: [
      '支援機関では整理できたのに、職場で使える言葉になりません。',
      '医療側の説明を、業務調整にどうつなげればよいですか。',
      '相談先はあるのに、現場の手順が変わりません。',
    ],
  },
  {
    title: '研修・制度・地域連携',
    lead: '研修、制度設計、地域支援、連携会議が現場の確認行動へつながらない相談。',
    examples: [
      '診断名別の研修をしても、現場の判断が変わりません。',
      '相談件数は増えていますが、仕事条件の改善につながっているか分かりません。',
      '地域の支援資源を、企業や本人が使える形にしたい。',
    ],
  },
  {
    title: '就職前・復職・移行',
    lead: '仕事像、職場体験、応募前不安、復職、異動、転職など、移行の段差に関わる相談。',
    examples: [
      '働くイメージが持てず、応募前に止まっています。',
      '実習ではできたのに、採用後の条件へ引き継がれません。',
      '復職後、どの仕事量から戻ればよいか分かりません。',
    ],
  },
];

const consultationStakeholderEntries: readonly ConsultationStakeholderEntry[] = [
  {
    stakeholder: '本人・家族',
    lead: '働きたい気持ち、不安、体調、説明の難しさが混ざったまま入れる入口。',
    fragments: [
      '働きたいけれど、続けられるか分からない。',
      '病気や障害のことを、どこまで話せばよいか分からない。',
      '疲れやすさをどう説明すればよいか分からない。',
      'できる仕事があるのか、働く前から不安が大きい。',
    ],
  },
  {
    stakeholder: '企業担当者・上司',
    lead: '業務配分、評価、聞いてよい範囲、現場運用の迷いから入る入口。',
    fragments: [
      'どこまで聞いてよいのか分からない。',
      '配慮したいが、業務や評価とどう両立すればよいか分からない。',
      '急な欠勤や体調変動に、現場がどう備えればよいか分からない。',
      '本人に任せてよい仕事量や役割の決め方が難しい。',
    ],
  },
  {
    stakeholder: '支援者',
    lead: '本人の言葉、職場の運用、制度や医療情報を仕事条件へ翻訳する入口。',
    fragments: [
      '本人の困りごとを、職場で使える言葉に変えたい。',
      '企業に何を確認すれば、見立ての解像度が上がるか知りたい。',
      '支援機関では整理できたが、現場の手順に反映されない。',
      '本人の安心と職場の実装条件を、どの順番でつなげばよいか迷う。',
    ],
  },
  {
    stakeholder: '医療・福祉・教育',
    lead: '病状や生活情報を、就労可否ではなく仕事条件へ接続する入口。',
    fragments: [
      '医療側の情報を、職場にどう伝えればよいか分からない。',
      '生活リズムや通院情報を、仕事の予定表にどう接続すればよいか。',
      '実習や訓練で見えたことを、採用後にどう残せばよいか。',
      '本人の強みや不安を、仕事場面の確認項目にしたい。',
    ],
  },
  {
    stakeholder: '行政・研修・政策',
    lead: '個別相談を超えて、制度、研修、地域支援、事業設計の問いへ開く入口。',
    fragments: [
      '研修で、診断名別配慮表ではない見方をどう伝えるか。',
      '企業と支援機関の連携が、相談件数だけで終わっていないか見たい。',
      '制度やマニュアルがあっても現場で詰まる理由を整理したい。',
      '地域の支援資源を、仕事条件の改善にどうつなげればよいか。',
    ],
  },
  {
    stakeholder: '研究・記事・社会発信',
    lead: '社会の論点や断片的な声を、偏見を増やさず仕事条件の問いへ戻す入口。',
    fragments: [
      '障害者雇用のニュースを、本人努力か企業責任かで終わらせたくない。',
      'SNSの短い声を、どの仕事条件の問いとして読めばよいか。',
      '海外事例や古い資料を、日本の現場にそのまま当てはめてよいのか。',
      '記事や図解にする時、どこまで一般化してよいか迷う。',
    ],
  },
];

const consultationReadingCases: readonly ConsultationReadingCase[] = [
  {
    id: 'health-time',
    category: '健康時間',
    audience: '本人・職場',
    title: '体調変動と締切が同じ週に重なる',
    consultation: '月末前後に疲れが残り、翌日の修正がつらいです。',
    stuckReading: '体調管理の問題か、休ませるか、短時間勤務にするかで止まりやすい。',
    workConditionReading:
      '通院、締切、修正作業、回復時間、評価時期が同じ週に重なっているかを見る。',
    counterHypothesis:
      '体調変動だけでなく、締切前の一次確認不足や、戻れる手順のなさが負荷を増やしている可能性がある。',
    missingContext: [
      '通院前後に重い作業が重なっているか。',
      '一時的に難しい日と、継続的に難しい作業を分けているか。',
      '回復予定を安全に共有できる範囲はどこか。',
    ],
    afterMoreInfo:
      '月末締切の週に通院が入り、翌日に修正作業が集中する。午後に作業速度が落ち、翌朝まで疲労が残る。',
    nextMove: '通院翌日の午後に重い修正を置かない週を1回試し、作業量と翌日の回復を同じ表で見る。',
    supportPlanBranches: [
      {
        question: '通院前後に重い作業が重なっているか。',
        condition: '通院翌日に負荷が集中しているなら',
        plan: '締切、修正、回復時間を同じ週次表に置き、重い修正を別日に逃がす。',
      },
      {
        question: '一次確認や修正範囲が遅れて、疲労が後ろにずれていないか。',
        condition: '作業量より確認待ちが疲労を増やしているなら',
        plan: '一次確認の前倒し、修正範囲の切り分け、戻れる手順を先に決める。',
      },
    ],
  },
  {
    id: 'sensory-access',
    category: '情報形式・参加',
    audience: '本人・支援者・職場',
    title: '同じ会議にいても、同じ情報に参加できない',
    consultation: '会議には出ていますが、話の一部が抜けて後で困ります。',
    stuckReading: '集中力、聞き返し、説明不足の問題として片づけられやすい。',
    workConditionReading:
      '口頭、文字、図、音、画面共有、発言順、警告、記録が参加条件としてそろっているかを見る。',
    counterHypothesis:
      '本人の理解力ではなく、会議の情報形式が一経路に偏り、確認できる記録が残っていない可能性がある。',
    missingContext: [
      '会議後に確認できる資料やメモがあるか。',
      '聞こえ方、見え方、処理速度の違いを前提にした参加方法があるか。',
      '発言や質問のタイミングが固定されすぎていないか。',
    ],
    afterMoreInfo:
      '重要な変更は口頭で流れ、資料には反映されない。本人は聞き返すほど会議を止めてしまうと感じている。',
    nextMove: '変更点、担当、期限を会議後に3行で残し、質問できる時間を会議の外に置く。',
    supportPlanBranches: [
      {
        question: '会議後に確認できる資料やメモがあるか。',
        condition: '口頭情報だけが抜け落ちているなら',
        plan: '変更点、担当、期限を会議後に短く残し、確認できる記録を標準化する。',
      },
      {
        question: '発言や質問のタイミングが固定されすぎていないか。',
        condition: '質問のタイミングで参加しにくいなら',
        plan: '会議外の確認時間、文字での質問経路、発言順の調整を用意する。',
      },
    ],
  },
  {
    id: 'procedure-change',
    category: '手順変更',
    audience: '本人・職場',
    title: '朝礼後の予定変更で作業が止まる',
    consultation: '急な変更が苦手です。どう配慮してもらえばよいですか。',
    stuckReading: '急な変更が苦手な人への配慮名探しに直行しやすい。',
    workConditionReading: '変更情報は、誰が、いつ、何をする手順として残っているかを見る。',
    counterHypothesis:
      '変更そのものより、変更後の正解、確認先、評価との関係が見えないために止まっている可能性がある。',
    missingContext: [
      '変更は口頭だけか、後で見返せる形があるか。',
      '変更後に誰へ何を確認すればよいかが決まっているか。',
      '確認行動が注意や評価低下に結びついていないか。',
    ],
    afterMoreInfo:
      '変更は朝礼後に口頭で伝えられ、作業順は残らない。確認先は日によって違い、本人は聞くほど評価が下がると感じている。',
    nextMove:
      '変更連絡を「変更点、期限、確認先」の3行テンプレートにし、確認行動を注意対象にしない。',
    supportPlanBranches: [
      {
        question: '変更は口頭だけか、後で見返せる形があるか。',
        condition: '変更後の正解が見えないなら',
        plan: '変更点、期限、確認先を残すテンプレートを作り、作業順を見返せるようにする。',
      },
      {
        question: '確認行動が注意や評価低下に結びついていないか。',
        condition: '確認すること自体が評価不安になっているなら',
        plan: '確認行動を減点ではなく品質確認として扱う運用を上司と共有する。',
      },
    ],
  },
  {
    id: 'mobility-contact',
    category: '移動・道具',
    audience: '本人・職場',
    title: '通勤と職場内移動で、仕事前に消耗する',
    consultation: '仕事自体はできそうですが、移動と休憩場所で消耗します。',
    stuckReading: '通勤や移動を仕事の外側の個人事情として扱いがちになる。',
    workConditionReading:
      '通勤、職場内移動、道具、姿勢、休憩場所、安全動線を仕事に入る前提条件として読む。',
    counterHypothesis:
      '業務能力の問題ではなく、作業に入る前の消耗や、道具・配置の接触点が負荷を増やしている可能性がある。',
    missingContext: [
      'どの移動で消耗し、どの作業に影響しているか。',
      '休憩場所や道具配置を変えられる余地があるか。',
      '通勤後すぐ重い作業に入る設計になっていないか。',
    ],
    afterMoreInfo:
      '出社直後に会議室移動が続き、休憩場所は遠い。道具を取りに行く回数が多く、午後の作業前に疲れている。',
    nextMove: '出社後30分の作業配置、道具の置き場、休憩場所への動線を同じ地図にする。',
    supportPlanBranches: [
      {
        question: 'どの移動で消耗し、どの作業に影響しているか。',
        condition: '仕事前の移動で消耗しているなら',
        plan: '出社直後の会議・移動・重い作業を再配置し、仕事に入る前提条件を整える。',
      },
      {
        question: '休憩場所や道具配置を変えられる余地があるか。',
        condition: '道具や休憩場所が接触点になっているなら',
        plan: '道具の置き場、休憩場所、動線を同じ地図にして、往復回数を減らす。',
      },
    ],
  },
  {
    id: 'disclosure-evaluation',
    category: '開示・評価',
    audience: '本人・企業',
    title: 'どこまで話すかと、どう評価されるかが混ざる',
    consultation: '病気や障害のことを伝えると、評価に響くのではないかと不安です。',
    stuckReading: '言うか言わないか、本人が説明するかしないかの二択になりやすい。',
    workConditionReading:
      '共有する目的、共有範囲、仕事条件への接続、評価との切り分けが設計されているかを見る。',
    counterHypothesis:
      '開示量の問題ではなく、共有目的が曖昧で、評価や役割変更と混ざっている可能性がある。',
    missingContext: [
      '何を変えるために共有したいのか。',
      '誰が知る必要があり、誰は知らなくてよいのか。',
      '共有後に評価や役割がどう扱われるか確認されているか。',
    ],
    afterMoreInfo:
      '本人は通院日の調整だけ伝えたいが、職場は業務配分や評価への影響も気にしている。共有先が決まらず話が止まる。',
    nextMove:
      '病名ではなく「調整したい仕事条件」を先に書き、共有先、共有目的、評価との切り分けを一枚にする。',
    supportPlanBranches: [
      {
        question: '何を変えるために共有したいのか。',
        condition: '共有目的が勤務調整だけなら',
        plan: '病名ではなく、通院日、勤務時間、連絡方法など調整したい条件に絞って共有する。',
      },
      {
        question: '共有後に評価や役割がどう扱われるか確認されているか。',
        condition: '評価や役割変更と混ざっているなら',
        plan: '共有先、共有目的、評価に使わない範囲を分け、本人と職場で確認する。',
      },
    ],
  },
  {
    id: 'pre-entry-transition',
    category: '就職前・移行',
    audience: '本人・支援者',
    title: '働く前の不安が、意欲の問題に見えてしまう',
    consultation: '働きたい気持ちはありますが、どんな仕事なら続けられるか分かりません。',
    stuckReading: '準備不足、意欲不足、自己理解不足として本人側に寄せやすい。',
    workConditionReading:
      '仕事を試す機会、役割の見え方、生活リズム、支援接続、応募前情報が不足していないかを見る。',
    counterHypothesis:
      '本人の意欲ではなく、仕事像を作る体験と、採用後へ引き継ぐ条件が足りない可能性がある。',
    missingContext: [
      'どの仕事場面をまだ見たことがないか。',
      '小さく試せる作業や見学機会があるか。',
      '体験で分かった条件を採用後に残せるか。',
    ],
    afterMoreInfo:
      '見学はしたが作業手順や休憩、相談先までは見えていない。本人は「できるかどうか」だけを聞かれ、条件の話ができていない。',
    nextMove:
      '応募前に、小さな作業体験、必要な支援、休憩、相談先、採用後への引き継ぎ項目を並べる。',
    supportPlanBranches: [
      {
        question: 'どの仕事場面をまだ見たことがないか。',
        condition: '仕事像がまだ薄いなら',
        plan: '見学だけでなく、小さな作業体験、休憩、相談先、作業ペースを確認する。',
      },
      {
        question: '体験で分かった条件を採用後に残せるか。',
        condition: '体験で分かった条件が採用後に残らないなら',
        plan: '体験で見えた条件を、採用後の業務量、支援、相談線へ引き継ぐ表にする。',
      },
    ],
  },
  {
    id: 'employer-scope',
    category: '企業運用',
    audience: '企業担当者・上司',
    title: 'どこまで聞いてよいか分からず、調整が止まる',
    consultation: '本人にどこまで聞いてよいのか分からず、配慮の話が進みません。',
    stuckReading: '聞くこと自体が危ない、または本人が全部説明すべき、という二択になりやすい。',
    workConditionReading:
      '病名や詳細事情ではなく、変えたい仕事条件、共有目的、共有先、評価との切り分けを確認する。',
    counterHypothesis:
      '情報不足ではなく、聞く目的と使い道が職場側で整理されていないため、本人も話しにくくなっている可能性がある。',
    missingContext: [
      '何を変えるために聞くのかが明確か。',
      '聞いた情報を誰が見て、何には使わないか決まっているか。',
      '評価や配置判断と、仕事条件の調整を分けて説明できているか。',
    ],
    afterMoreInfo:
      '職場は勤務時間を調整したいが、病名や症状の詳細まで必要なのか判断できず、本人は評価に使われる不安で話せない。',
    nextMove: '聞く前に「調整したい条件」「共有先」「評価には使わない範囲」を職場側で短く書く。',
    supportPlanBranches: [
      {
        question: '何を変えるために聞くのかが明確か。',
        condition: '勤務時間や作業量を調整したいだけなら',
        plan: '聞く内容を仕事条件に限定し、病名や私生活の詳細へ広げない。',
      },
      {
        question: '評価や配置判断と、仕事条件の調整を分けて説明できているか。',
        condition: '評価に使われる不安が強いなら',
        plan: '共有先、記録範囲、評価と切り分ける範囲を先に説明してから話す。',
      },
    ],
  },
  {
    id: 'support-translation',
    category: '支援接続',
    audience: '支援者',
    title: '支援機関で整理した内容が、職場手順へ移らない',
    consultation: '本人とは整理できたのに、職場で何を変える話にすればよいか迷います。',
    stuckReading: '本人への助言、企業への説明、制度紹介のどれか一つに寄りやすい。',
    workConditionReading:
      '本人の言葉を、作業、時間、情報形式、相談線、評価条件のどこへ接続するかを見る。',
    counterHypothesis:
      '支援内容の質ではなく、支援者の見立てを職場の運用言語へ再翻訳する役割が空いている可能性がある。',
    missingContext: [
      '本人の困りごとは、どの作業や時間帯に出ているか。',
      '職場側が変更できる条件は何か。',
      '支援者が同席後、誰が手順や記録へ落とすか決まっているか。',
    ],
    afterMoreInfo:
      '本人は「疲れる」と話しているが、職場では作業量、休憩、締切、確認先のどれを変える話か見えていない。',
    nextMove: '本人の言葉を、作業量、休憩、締切、確認先の4列に分けて職場会議へ持ち込む。',
    supportPlanBranches: [
      {
        question: '本人の困りごとは、どの作業や時間帯に出ているか。',
        condition: '本人の言葉が職場の運用語に変わっていないなら',
        plan: '「疲れる」を作業量、休憩、締切、確認先の列に分けて会議へ持ち込む。',
      },
      {
        question: '支援者が同席後、誰が手順や記録へ落とすか決まっているか。',
        condition: '支援者同席後に手順へ落ちないなら',
        plan: '会議後に誰が手順、記録、再確認日へ落とすかを決める。',
      },
    ],
  },
  {
    id: 'training-policy',
    category: '研修・制度',
    audience: '行政・研修',
    title: '診断名別の研修では、現場の判断が変わらない',
    consultation: '研修で障害特性を説明しても、現場の仕事設計に結びつきません。',
    stuckReading: 'もっと多くの障害特性や配慮例を教えればよい、という方向へ寄りやすい。',
    workConditionReading:
      '研修で扱う知識が、時間、情報、動線、手順、評価、支援接続の確認行動へ変換されているかを見る。',
    counterHypothesis:
      '知識量不足ではなく、参加者が自分の職場で確認する問いに翻訳できていない可能性がある。',
    missingContext: [
      '研修後に、職場で何を1つ確認する設計になっているか。',
      '障害種類ごとの説明が、仕事条件の共通地図へ戻っているか。',
      '企業担当者、支援者、行政が同じ言葉で話せる成果物があるか。',
    ],
    afterMoreInfo:
      '研修資料は詳しいが、参加者は自分の部署で何を変えるかを持ち帰れていない。質問も個別配慮名に集中している。',
    nextMove:
      '配慮例の一覧ではなく、参加者が自部署で時間・情報・評価の1項目を点検するワークに変える。',
    supportPlanBranches: [
      {
        question: '障害種類ごとの説明が、仕事条件の共通地図へ戻っているか。',
        condition: '研修が障害特性の説明で止まっているなら',
        plan: '時間、情報、動線、手順、評価、支援接続の確認ワークへ変換する。',
      },
      {
        question: '研修後に、職場で何を1つ確認する設計になっているか。',
        condition: '参加者が現場で何を変えるか持ち帰れないなら',
        plan: '自部署で1つ点検する項目と、次回共有する記録を研修成果物にする。',
      },
    ],
  },
];

const consultationCaseIdsByStakeholder: Readonly<Record<string, string>> = {
  '本人・家族': 'health-time',
  '企業担当者・上司': 'employer-scope',
  支援者: 'support-translation',
  '医療・福祉・教育': 'pre-entry-transition',
  '行政・研修・政策': 'training-policy',
  '研究・記事・社会発信': 'training-policy',
};

const consultationThemeTitlesByStakeholder: Readonly<Record<string, string>> = {
  '本人・家族': '健康時間・仕事密度',
  '企業担当者・上司': '開示・共有範囲',
  支援者: '支援接続・再翻訳',
  '医療・福祉・教育': '就職前・復職・移行',
  '行政・研修・政策': '研修・制度・地域連携',
  '研究・記事・社会発信': '研修・制度・地域連携',
};

const consultationCaseIdsByTheme: Readonly<Record<string, string>> = {
  '健康時間・仕事密度': 'health-time',
  '情報形式・参加': 'sensory-access',
  '手順変更・切替負荷': 'procedure-change',
  '職場内外の移動・道具': 'mobility-contact',
  '開示・共有範囲': 'disclosure-evaluation',
  '評価・役割・成長': 'disclosure-evaluation',
  '支援接続・再翻訳': 'support-translation',
  '研修・制度・地域連携': 'training-policy',
  '就職前・復職・移行': 'pre-entry-transition',
};

const consultationThemeAssessments: Readonly<Record<string, ConsultationThemeAssessment>> = {
  '健康時間・仕事密度': {
    avoid: '疲れやすさや通院を、本人の体調管理だけに閉じない。',
    widen: '通院、回復時間、仕事量、締切、評価時期を同じ時間軸で見る。',
    counter:
      '疲労そのものではなく、確認待ち、急な修正、戻れる手順のなさが負荷を増やしている可能性を残す。',
    branches: [
      {
        question: '疲労や症状が強くなる曜日・時間帯と、作業密度の山が重なっていないか。',
        condition: '仕事密度の山と体調変動が重なっているなら',
        plan: '重い作業、確認、締切、回復時間を週次で並べ、負荷の山をずらす。',
      },
      {
        question: '休む、減らす、戻る判断を、本人だけが抱えていないか。',
        condition: '戻り方の判断が本人任せになっているなら',
        plan: '休む基準、戻る作業量、相談先をあらかじめ決め、復帰後の調整を見える化する。',
      },
      {
        question: '健康を守る行動が、評価や収入低下として働いていないか。',
        condition: '健康行動と評価・収入が衝突しているなら',
        plan: '通院、休憩、勤務時間調整を評価・役割・生活保障と切り分けて確認する。',
      },
    ],
  },
  '情報形式・参加': {
    avoid: '聞き返しや見落としを、集中力や理解力だけの問題にしない。',
    widen: '音声、文字、図、画面、記録、発言順、確認経路を参加条件として見る。',
    counter: '本人が参加できていないのではなく、情報の出し方が一経路に偏っている可能性を残す。',
    branches: [
      {
        question: '重要な変更や担当、期限が、後で確認できる形で残っているか。',
        condition: '口頭やその場の流れだけで情報が進んでいるなら',
        plan: '変更点、担当、期限を短く残す記録を会議や朝礼の標準にする。',
      },
      {
        question: '見え方、聞こえ方、処理速度の違いを前提にした参加方法があるか。',
        condition: '情報形式が一つに偏っているなら',
        plan: '文字、図、事前資料、録画・メモ、確認時間など複数経路を組み合わせる。',
      },
      {
        question: '質問や確認が、会議中だけに限られていないか。',
        condition: 'その場で聞けないことが参加を止めているなら',
        plan: '会議外の質問経路、確認担当、返信期限を決めて参加の余地を作る。',
      },
    ],
  },
  '手順変更・切替負荷': {
    avoid: '急な変更が苦手、という特性名や配慮名だけで止めない。',
    widen: '変更点、優先順位、確認先、期限、評価との関係を手順として残す。',
    counter: '変更そのものではなく、変更後の正解が見えないことが停止を生んでいる可能性を残す。',
    branches: [
      {
        question: '変更後に何を優先し、何を止めるかが明確か。',
        condition: '優先順位が残っていないなら',
        plan: '変更時に「やること、止めること、確認先」を一枚で示す。',
      },
      {
        question: '確認する行動が、注意や低評価につながっていないか。',
        condition: '確認しにくさが停止を増やしているなら',
        plan: '確認を品質確保の手順として扱い、聞き方と確認先を固定する。',
      },
      {
        question: '切替の前後に、戻れる手順や作業メモがあるか。',
        condition: '切替後に戻る場所が分からないなら',
        plan: '中断位置、次の一手、再開条件を短く残す作業メモを使う。',
      },
    ],
  },
  '職場内外の移動・道具': {
    avoid: '通勤、動線、道具、姿勢を仕事の外側の個人事情として扱わない。',
    widen: '仕事に入る前の消耗、職場内移動、道具配置、休憩場所、安全動線を仕事条件として見る。',
    counter: '業務能力ではなく、仕事前後の接触点が作業力を削っている可能性を残す。',
    branches: [
      {
        question: '出社直後や移動後に、重い作業や会議が続いていないか。',
        condition: '仕事前の消耗が大きいなら',
        plan: '出社直後の予定、移動、重い作業を再配置し、仕事に入る余白を作る。',
      },
      {
        question: '道具の置き場や職場内移動が、作業を何度も中断させていないか。',
        condition: '道具や配置が接触点になっているなら',
        plan: '道具、席、休憩場所、移動経路を同じ地図で見直す。',
      },
      {
        question: '休憩場所や姿勢調整が、実際に使える条件になっているか。',
        condition: '休憩や姿勢調整が名目だけなら',
        plan: '場所、時間、使い方、周囲への共有範囲を具体化する。',
      },
    ],
  },
  '開示・共有範囲': {
    avoid: '病名や障害名を言うか言わないかの二択にしない。',
    widen: '共有目的、共有範囲、調整したい仕事条件、評価との切り分けを見る。',
    counter: '情報量不足ではなく、情報の使い道が曖昧なため話せなくなっている可能性を残す。',
    branches: [
      {
        question: '何を変えるために共有するのかが明確か。',
        condition: '目的が勤務調整や連絡方法の整理なら',
        plan: '病名ではなく、調整したい時間、作業量、連絡方法に絞って共有する。',
      },
      {
        question: '誰が知る必要があり、誰は知らなくてよいか分かれているか。',
        condition: '共有範囲が広がりすぎているなら',
        plan: '共有先、記録範囲、本人が確認できる内容を決める。',
      },
      {
        question: '共有した情報が、評価や役割変更に使われる不安が残っていないか。',
        condition: '評価との混同が不安を強めているなら',
        plan: '調整のための情報と評価判断を分けて説明し、扱いを確認する。',
      },
    ],
  },
  '評価・役割・成長': {
    avoid: '安定しているから大丈夫、配慮されているから十分、で止めない。',
    widen: '役割、評価、技能形成、挑戦機会、期待値の更新を参加の質として見る。',
    counter: '困りごとが減っていても、成長や評価から外れている可能性を残す。',
    branches: [
      {
        question: '任される仕事が、成長や評価につながる役割になっているか。',
        condition: 'できる仕事だけに固定されているなら',
        plan: '安定業務と挑戦業務を分け、評価につながる小さな役割を設計する。',
      },
      {
        question: '配慮によって、研修、異動、昇格、技能形成から外れていないか。',
        condition: '配慮が成長機会の縮小になっているなら',
        plan: '配慮条件を保ちながら参加できる研修・役割・評価機会を作る。',
      },
      {
        question: '本人、上司、人事で、期待値の見直しが定期的にできているか。',
        condition: '期待値が初期状態のまま止まっているなら',
        plan: '定期的に役割、負荷、評価、次の挑戦を見直す場を置く。',
      },
    ],
  },
  '支援接続・再翻訳': {
    avoid: '本人への助言、企業への説明、制度紹介のどれか一つで終わらせない。',
    widen: '本人の言葉を、作業、時間、情報、相談線、評価条件へ翻訳する。',
    counter:
      '支援内容の不足ではなく、支援の見立てを職場運用へ再翻訳する役割が空いている可能性を残す。',
    branches: [
      {
        question: '本人の言葉が、どの作業・時間帯・相手との場面で起きているか分かれているか。',
        condition: '本人の言葉が職場で使える単位になっていないなら',
        plan: '困りごとを作業、時間、情報、相談先、評価の列に分ける。',
      },
      {
        question: '支援者同席後に、誰が手順や記録へ落とすか決まっているか。',
        condition: '会議後に実装担当が空いているなら',
        plan: '会議後の記録、手順化、再確認日、担当者を決める。',
      },
      {
        question: '医療・福祉・教育の情報が、就労可否ではなく仕事条件へ接続されているか。',
        condition: '専門情報が現場の言葉に変わっていないなら',
        plan: '症状名や制度名を、時間、作業量、環境、支援接続の確認項目へ置き直す。',
      },
    ],
  },
  '研修・制度・地域連携': {
    avoid: '障害特性や制度説明を増やせば現場が変わる、で止めない。',
    widen: '研修、制度、連携会議を、現場で確認する仕事条件の問いへ変える。',
    counter: '知識量不足ではなく、参加者が自分の場面へ翻訳する導線がない可能性を残す。',
    branches: [
      {
        question: '研修後に、参加者が自部署で何を1つ確認するか決まっているか。',
        condition: '研修が聞いて終わる形なら',
        plan: '時間、情報、評価、支援接続から1項目を点検する持ち帰りワークにする。',
      },
      {
        question: '企業、支援者、行政が同じ仕事条件の言葉で話せる成果物があるか。',
        condition: '連携が相談件数や紹介で止まっているなら',
        plan: '共通の確認表、会議メモ、改善テーマを残す。',
      },
      {
        question: '制度語が、作業、手順、相談線、評価運用へ翻訳されているか。',
        condition: '制度説明が現場実装へ落ちていないなら',
        plan: '制度の趣旨を、職場で確認できる条件と担当に分解する。',
      },
    ],
  },
  '就職前・復職・移行': {
    avoid: '働く前の不安を、意欲不足や準備不足として本人側に寄せない。',
    widen: '仕事像、体験機会、生活リズム、復職段階、採用後への引き継ぎを見る。',
    counter: '本人の不安ではなく、仕事を具体的に試し、条件を残す機会が不足している可能性を残す。',
    branches: [
      {
        question: 'まだ見ていない仕事場面、作業量、休憩、相談先は何か。',
        condition: '仕事像が抽象的なままなら',
        plan: '見学だけでなく、小さな作業体験、休憩、相談線、作業ペースを確認する。',
      },
      {
        question: '実習や訓練で分かった条件が、採用後や復職後に引き継がれるか。',
        condition: '体験で得た知見が消えているなら',
        plan: '体験で見えた条件を、採用後の業務量、支援、相談線へ引き継ぐ表にする。',
      },
      {
        question: '復職・異動・転職の段階で、戻る仕事量や役割を小さく試せるか。',
        condition: 'いきなり元の働き方へ戻す設計なら',
        plan: '戻る量、戻る順番、再確認日、調整できる条件を段階的に置く。',
      },
    ],
  },
};

const consultationCaseIdsByFragment: Readonly<Record<string, string>> = {
  '働きたいけれど、続けられるか分からない。': 'health-time',
  '病気や障害のことを、どこまで話せばよいか分からない。': 'disclosure-evaluation',
  '疲れやすさをどう説明すればよいか分からない。': 'health-time',
  'できる仕事があるのか、働く前から不安が大きい。': 'pre-entry-transition',
  'どこまで聞いてよいのか分からない。': 'employer-scope',
  '配慮したいが、業務や評価とどう両立すればよいか分からない。': 'employer-scope',
  '急な欠勤や体調変動に、現場がどう備えればよいか分からない。': 'health-time',
  '本人に任せてよい仕事量や役割の決め方が難しい。': 'employer-scope',
  '本人の困りごとを、職場で使える言葉に変えたい。': 'support-translation',
  '企業に何を確認すれば、見立ての解像度が上がるか知りたい。': 'support-translation',
  '支援機関では整理できたが、現場の手順に反映されない。': 'support-translation',
  '本人の安心と職場の実装条件を、どの順番でつなげばよいか迷う。': 'support-translation',
  '医療側の情報を、職場にどう伝えればよいか分からない。': 'support-translation',
  '生活リズムや通院情報を、仕事の予定表にどう接続すればよいか。': 'health-time',
  '実習や訓練で見えたことを、採用後にどう残せばよいか。': 'pre-entry-transition',
  '本人の強みや不安を、仕事場面の確認項目にしたい。': 'pre-entry-transition',
  '研修で、診断名別配慮表ではない見方をどう伝えるか。': 'training-policy',
  '企業と支援機関の連携が、相談件数だけで終わっていないか見たい。': 'training-policy',
  '制度やマニュアルがあっても現場で詰まる理由を整理したい。': 'training-policy',
  '地域の支援資源を、仕事条件の改善にどうつなげればよいか。': 'training-policy',
  '障害者雇用のニュースを、本人努力か企業責任かで終わらせたくない。': 'training-policy',
  'SNSの短い声を、どの仕事条件の問いとして読めばよいか。': 'training-policy',
  '海外事例や古い資料を、日本の現場にそのまま当てはめてよいのか。': 'training-policy',
  '記事や図解にする時、どこまで一般化してよいか迷う。': 'training-policy',
};

function getConsultationReadingCaseById(id: string) {
  return consultationReadingCases.find((item) => item.id === id) ?? consultationReadingCases[0];
}

function getConsultationThemeAssessment(category: ConsultationFaqCategory) {
  return consultationThemeAssessments[category.title];
}

function uniqueConsultationSupportPlanBranches(
  branches: readonly ConsultationSupportPlanBranch[],
): ConsultationSupportPlanBranch[] {
  const seen = new Set<string>();

  return branches.filter((branch) => {
    const key = `${branch.question}::${branch.condition}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function candidatePath(slug: string) {
  return `${AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE}/${slug}`;
}

function candidateAnchorPath(slug: string, anchor: string) {
  return `${candidatePath(slug)}#${anchor}`;
}

function candidateQueryPath(
  slug: string,
  params: Record<string, string | undefined>,
  anchor?: string,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  const hash = anchor ? `#${anchor}` : '';

  return `${candidatePath(slug)}${query ? `?${query}` : ''}${hash}`;
}

function nblReportArticleContentPath(articleId: string, visual = false) {
  return candidateQueryPath(
    'articles-social-questions',
    { article: articleId, visual: visual ? '1' : undefined },
    visual ? 'article-visual' : 'full-article-reader',
  );
}

function nblReportArticleSharePath(articleId: string) {
  return `/share/nbl-report/${articleId}`;
}

function toolkitInfographicId(file: string) {
  return file.replace(/\.[^.]+$/, '');
}

function toolkitInfographicContentPath(itemId: string) {
  return candidateQueryPath(
    'toolkit-studio',
    { image: itemId },
    'toolkit-selected-infographic-library',
  );
}

function toolkitInfographicSharePath(itemId: string) {
  return `/share/toolkit-infographic/${itemId}`;
}

const workDesignGeneratedVisualAssets = {
  hero: {
    src: '/images/axiom-work-design-guide/work-social-participation-hero-v1.png',
    alt: '未来の仕事・社会参加設計ガイド。仕事、生活、健康、職場アクセス、評価と成長、支援と制度をつなぐ水彩調の関係地図。',
  },
  premiseMap: {
    src: '/images/axiom-work-design-guide/work-design-premise-map-v1.png',
    alt: '狭い標準像から多様性を前提にした仕事・社会参加設計へ読み替える図。障害・難病就労で見えてきた無理を、健康時間、情報形式、移動、支援、評価の仕事条件として整理する。',
  },
  healthTime: {
    src: '/images/axiom-work-design-guide/health-time-design-card-v1.png',
    alt: '健康時間を設計する。破綻・停止、高頻度支障、要調整、安定・予防の4つの状況レベルを示す図解カード。',
  },
  healthTimeItems: {
    src: '/images/axiom-work-design-guide/health-time-items-board-v1.png',
    alt: '具体設計項目、健康時間。変動・再燃・疲労、回復余地・戻り方、通勤・移動の消耗、収入・評価との衝突を示す図解ボード。',
  },
  treatmentTime: {
    src: '/images/axiom-work-design-guide/treatment-time-design-card-v1.png',
    alt: '治療・検診時間を設計する。治療か仕事かの二択から、勤務表に健康時間を置く状態までを示す図解カード。',
  },
  treatmentTimeItems: {
    src: '/images/axiom-work-design-guide/treatment-time-items-board-v1.png',
    alt: '具体設計項目、治療・検診時間。透析・固定治療時間、定期検診・継続管理、内部障害・身体管理を示す図解ボード。',
  },
  informationAccess: {
    src: '/images/axiom-work-design-guide/information-access-design-card-v1.png',
    alt: '情報形式を設計する。会議や連絡から外れる状態から、同じ流れを見ながら話せる状態までを示す図解カード。',
  },
  informationAccessItems: {
    src: '/images/axiom-work-design-guide/information-access-items-board-v1.png',
    alt: '具体設計項目、情報形式。視覚情報・文書形式、聴覚・音声・会議進行、身体操作・道具操作、緊急連絡・非公式情報を示す図解ボード。',
  },
  procedureSwitching: {
    src: '/images/axiom-work-design-guide/procedure-switching-design-card-v1.png',
    alt: '手順と戻り方を設計する。開始・切替・完了で詰まる状態から、失敗しても仕事に戻れる状態までを示す図解カード。',
  },
  procedureSwitchingItems: {
    src: '/images/axiom-work-design-guide/procedure-switching-items-board-v1.png',
    alt: '具体設計項目、手順と切替。指示・手順・説明形式、切替・優先順位・例外対応、記憶・確認・ミス許容度、暗黙ルール・評価基準を示す図解ボード。',
  },
  preEntryTransition: {
    src: '/images/axiom-work-design-guide/pre-entry-transition-design-card-v1.png',
    alt: '就職前から仕事像を設計する。求人語が壁になる状態から、体験を採用後へつなぐ状態までを示す図解カード。',
  },
  preEntryTransitionItems: {
    src: '/images/axiom-work-design-guide/pre-entry-transition-items-board-v1.png',
    alt: '具体設計項目、就職前・移行。非就労・未就業層の仕事像、応募前の条件言語化、訓練・職場体験・試行機会、家族・学校・支援から職場へを示す図解ボード。',
  },
  worksiteAccess: {
    src: '/images/axiom-work-design-guide/worksite-access-design-card-v1.png',
    alt: '職場アクセスを設計する。情報、動線、道具、安全を仕事の接点として整える4つの状況レベル図解カード。',
  },
  worksiteContactItems: {
    src: '/images/axiom-work-design-guide/worksite-contact-items-board-v1.png',
    alt: '具体設計項目、職場接触点。作業分解・仕事密度、道具・設備・環境、職場内外の移動、安全・ミス許容度、人員余力・顧客接点、評価・役割・フィードバックを示す図解ボード。',
  },
  disclosureEvaluation: {
    src: '/images/axiom-work-design-guide/disclosure-evaluation-design-card-v1.png',
    alt: '伝える情報を設計する。調整が動かない状態から、調整と評価を両立する状態までを示す図解カード。',
  },
  disclosureEvaluationItems: {
    src: '/images/axiom-work-design-guide/disclosure-evaluation-items-board-v1.png',
    alt: '具体設計項目、伝える情報。目的限定の情報共有、見えにくさとスティグマ、不利益評価・過剰管理リスクを示す図解ボード。',
  },
  supportContinuity: {
    src: '/images/axiom-work-design-guide/support-continuity-design-card-v1.png',
    alt: '支援を仕事条件へつなぎ直す。本人・職場・支援が別々の状態から、悪化や変更時に再調整できる状態までを示す図解カード。',
  },
  supportContinuityItems: {
    src: '/images/axiom-work-design-guide/support-continuity-items-board-v1.png',
    alt: '具体設計項目、支援の接続。言葉を仕事条件へ翻訳、handoff・役割境界、悪化・復職・配置換え後を示す図解ボード。',
  },
  growthQuality: {
    src: '/images/axiom-work-design-guide/growth-quality-design-card-v1.png',
    alt: '続けるだけでなく育つ道を設計する。定着だけの状態から、役割・賃金・学びを更新する状態までを示す図解カード。',
  },
  growthQualityItems: {
    src: '/images/axiom-work-design-guide/growth-quality-items-board-v1.png',
    alt: '具体設計項目、評価と成長。就職後の役割設計、評価・処遇・収入の公正さ、学習・キャリア・選び直しを示す図解ボード。',
  },
  diverseEvidence: {
    src: '/images/axiom-work-design-guide/diverse-evidence-design-card-v1.png',
    alt: '多様な資料から全体像を設計する。一つの資料で一般化する状態から、共通構造と保留を分けて伝える状態までを示す図解カード。',
  },
  diverseEvidenceItems: {
    src: '/images/axiom-work-design-guide/diverse-evidence-items-board-v1.png',
    alt: '具体設計項目、資料の読み方。多数データを過大代表させない、歴史・国際資料から構造を探す、公開前の過剰一般化ブレーキを示す図解ボード。',
  },
} as const;

const theoryMethodHeroVisual = {
  src: '/images/next-nbl-method-trust-hero-reading-power-v1.png',
  alt: '読む力を支援の専門性へ変える流れ。部分的な情報を相互作用として読み、人に届く形へ翻訳する図解。',
} as const;

function routeContext(route: AxiomReviewedKernelBackedCandidateRoute) {
  const row = getFalconAxiomPublicSiteUpdatePlanRowBySurface(route.surface, updatePlan);
  if (!row) {
    throw new Error(`falcon_axiom_public_site_update_row_missing:${route.surface}`);
  }
  return {
    ...row,
    icon: surfaceIcons[route.surface],
  };
}

function pageBodyForRoute(route: AxiomReviewedKernelBackedCandidateRoute) {
  return getAxiomIntegratedDomainKnowledgePageBodyBySurface(route.surface, pageBodyProjection);
}

function publicCandidateRoutes() {
  return routeMap.routes.map((route) => ({
    ...route,
    context: routeContext(route),
  }));
}

function toReaderFacingText(text: string) {
  return text
    .replace(/source\/support validity/g, '根拠の最終確認')
    .replace(/source lens[:：]?/g, '資料の読み方')
    .replace(/cannot-yet-say/g, 'まだ確認が必要なこと')
    .replace(/learning update/g, '内容更新')
    .replace(/^Axiomは、?/, '')
    .replace(/^Axiomでは、?/, '')
    .replace(/^Axiomの統合知識を使って、?/, '')
    .replace(/Axiom版NBL/g, 'このサイト')
    .replace(/Axiomの/g, '')
    .replace(/Axiom/g, 'このガイド');
}

function toReaderFacingWorkDesignSubstructure(
  substructure: AxiomAllLayerRebuiltReviewSubstructure,
) {
  if (substructure.substructureId === 'source_lens_projection_brake_before_public_claim') {
    return {
      labelJa: '発見候補と公開メッセージを分ける',
      inferenceFocusJa:
        '読み取った発見をそのまま一般論にせず、どこまで言えるか、どこから先は確認が必要かを分けて伝える。',
    };
  }

  if (substructure.substructureId === 'source_lens_dominant_nanbyo_loading_guard') {
    return {
      labelJa: '多数データに埋もれる違いを残す',
      inferenceFocusJa:
        '件数の多い領域だけで全体像を作らず、視覚・聴覚・移動・就職前参加などの少数でも重要な条件を残す。',
    };
  }

  if (
    substructure.substructureId === 'source_lens_historical_international_universal_structure_probe'
  ) {
    return {
      labelJa: '国や時代を越えて残る構造を探す',
      inferenceFocusJa:
        '海外資料や過去資料を現行制度の答えとしてではなく、制度や時代が違っても反復する仕事参加の構造を読む材料にする。',
    };
  }

  return {
    labelJa: substructure.labelJa,
    inferenceFocusJa: toReaderFacingText(substructure.inferenceFocusJa),
  };
}

const workDesignPointHeadingBySubstructureId: Record<string, string> = {
  health_time_fluctuation_relapse_and_fatigue: '体調変動と仕事密度を同じ時間表で設計する',
  health_time_recovery_margin_and_return_route: '休む・減らす・戻る手順を先に設計する',
  health_time_commute_and_mobility_consumption: '通勤・移動の消耗を仕事時間の条件として設計する',
  health_time_income_evaluation_collision: '健康を守る行動と評価・収入の関係を設計する',
  regular_medical_time_dialysis_and_fixed_treatment: '固定治療時間を勤務表の前提として設計する',
  regular_medical_time_checkups_and_continuous_monitoring:
    '定期検診と継続管理を働くリズムに組み込む',
  regular_medical_time_internal_disability_and_body_management:
    '身体管理時間を見える仕事条件として設計する',
  sensory_access_visual_information_format: '視覚情報と文書形式を届く形に設計する',
  sensory_access_hearing_voice_meeting_information: '音声・会議情報を参加できる形に設計する',
  sensory_access_body_operation_and_tool_contact: '身体操作と道具接点を使える条件として設計する',
  sensory_access_emergency_and_informal_information: '緊急連絡と非公式情報をこぼれない形に設計する',
  cognitive_access_instruction_and_procedure_format: '指示・手順・説明形式を分かる形に設計する',
  cognitive_access_switching_priority_exception_load: '切替・優先順位・例外対応の戻り道を設計する',
  cognitive_access_memory_checking_and_error_tolerance:
    '記憶・確認・ミス許容度を支える道具を設計する',
  cognitive_access_implicit_rules_and_evaluation_feedback:
    '暗黙ルールと評価基準を見えるフィードバックにする',
  disclosure_purpose_limited_information_sharing: '共有目的と範囲を限定して情報共有を設計する',
  disclosure_invisible_condition_and_stigma: '見えにくい状態を説明負担にしない共有設計をする',
  disclosure_evaluation_and_overmanagement_risk: '評価・管理に使われすぎない境界を設計する',
  pre_entry_no_work_experience_job_image_gap: '働く前から仕事像を試せる条件を設計する',
  pre_entry_application_before_disclosure_and_condition_translation:
    '応募前に必要条件を言葉にできる準備を設計する',
  pre_entry_training_work_trial_and_experience_connection:
    '訓練・体験を仕事条件の検証機会として設計する',
  pre_entry_family_school_support_transition_handoff:
    '家族・学校・支援から職場への引き継ぎを設計する',
  worksite_contact_task_decomposition_and_work_density: '作業分解と仕事密度を接触点から設計する',
  worksite_contact_tools_equipment_and_environment: '道具・設備・環境を仕事の接触面として設計する',
  worksite_contact_internal_external_mobility_and_commute: '職場内外の移動と通勤接続を設計する',
  worksite_contact_safety_risk_and_error_tolerance: '安全とミス許容度を排除ではなく設計条件にする',
  worksite_contact_staffing_customer_and_coordination_margin:
    '人員余力・顧客接点・調整余地を設計する',
  worksite_contact_evaluation_role_and_feedback_connection:
    '評価・役割・フィードバックの接点を設計する',
  support_retranslation_between_person_medical_workplace_language:
    '本人・医療・職場の言葉を仕事条件へ翻訳する',
  support_handoff_role_boundary_and_continuity: 'handoff・役割境界・継続接続を設計する',
  support_reconnection_after_change_worsening_or_return:
    '悪化・復職・配置換え後に戻れる接続を設計する',
  role_value_growth_role_design_after_hiring: '就職後の役割を成長条件として設計する',
  role_value_growth_evaluation_and_income_fairness: '評価・処遇・収入の公正さを設計する',
  role_value_growth_learning_career_and_rechoice: '学習・キャリア・選び直しの道を設計する',
  source_lens_dominant_nanbyo_loading_guard: '多数データに埋もれる違いを残して設計する',
  source_lens_historical_international_universal_structure_probe:
    '国や時代を越えて残る構造を設計知に使う',
  source_lens_projection_brake_before_public_claim: '発見候補と公開メッセージを分けて設計する',
};

function toWorkDesignPointHeading(label: string, substructureId?: string) {
  if (substructureId && workDesignPointHeadingBySubstructureId[substructureId]) {
    return workDesignPointHeadingBySubstructureId[substructureId];
  }

  return label
    .replace(/が仕事密度と衝突する/g, 'を仕事密度と一緒に設計する')
    .replace(/が評価・収入と衝突する/g, 'と評価・収入の関係を設計する')
    .replace(/が会議参加を左右する/g, 'を会議参加の条件として設計する')
    .replace(/が仕事像を狭める/g, 'を仕事像づくりの機会として設計する')
    .replace(/が支援を切る/g, 'を支援が途切れない条件として設計する')
    .replace(/が役割固定を生む/g, 'を役割と成長の条件として設計する')
    .replace(/を分ける/g, 'を分けて設計する')
    .replace(/を読む/g, 'を設計に使う')
    .replace(/を残す/g, 'を残して設計する');
}

export function AxiomNextNblPublicCandidateSiteNotFound({ slug }: { slug: string }) {
  return (
    <main className="min-h-screen bg-[#fbfaf5] px-5 py-24 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8">
        <Sparkles className="text-teal-800" size={30} />
        <p className="mt-5 text-sm font-semibold text-teal-800">
          Founder review candidate route not found
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">{slug}</h1>
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          href={candidatePath('home')}
        >
          Homeへ戻る
          <ArrowRight size={15} />
        </Link>
      </section>
    </main>
  );
}

function PublicCandidateShell({
  children,
  currentRoute,
}: {
  children: ReactNode;
  currentRoute: AxiomReviewedKernelBackedCandidateRoute;
}) {
  const routeMode = useContext(AxiomNextNblRouteModeContext);
  const [siteSearchQuery, setSiteSearchQuery] = useState('');
  const allRoutes = publicCandidateRoutes();
  const primaryDesktopRoutes = allRoutes.filter((item) =>
    primaryDesktopNavSlugs.includes(item.slug as (typeof primaryDesktopNavSlugs)[number]),
  );

  return (
    <div className="nbl-public-preview axiom-public-candidate min-h-screen w-full max-w-[100vw] overflow-x-hidden break-words bg-[#fbfaf5] text-slate-950 [overflow-wrap:anywhere] [&_*]:min-w-0">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbfaf5]/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link href={candidatePath('home')} className="flex shrink-0 flex-col leading-tight">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-teal-800">
              Next Being Lab
            </span>
            <span className="text-sm font-semibold text-slate-950">仕事条件で読む</span>
          </Link>
          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="NBL site navigation"
          >
            {primaryDesktopRoutes.map((item) => (
              <Link
                aria-current={item.slug === currentRoute.slug ? 'page' : undefined}
                className={`whitespace-nowrap border-b-2 px-2.5 py-1.5 text-[13px] transition xl:px-3 xl:text-sm ${
                  item.slug === currentRoute.slug
                    ? 'border-teal-800 text-slate-950'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
                href={candidatePath(item.slug)}
                key={item.routeId}
              >
                {item.context.navLabelJa}
              </Link>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <form
              action="/search"
              className="flex w-[min(23vw,270px)] min-w-[190px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
            >
              <FileSearch className="shrink-0 text-teal-800" size={15} />
              <input
                aria-label="サイト内検索"
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                name="q"
                onChange={(event) => setSiteSearchQuery(event.target.value)}
                placeholder="サイト内検索"
                type="search"
                value={siteSearchQuery}
              />
              <button
                className="shrink-0 rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white"
                type="submit"
              >
                検索
              </button>
            </form>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-500 hover:text-teal-950 [&::-webkit-details-marker]:hidden">
                <Menu size={15} />
                全ページ
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <nav aria-label="NBL site all pages" className="grid p-2">
                  {allRoutes.map((item) => (
                    <Link
                      aria-current={item.slug === currentRoute.slug ? 'page' : undefined}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        item.slug === currentRoute.slug
                          ? 'bg-teal-50 text-teal-950'
                          : 'text-slate-700 hover:bg-[#fbfaf5] hover:text-teal-950'
                      }`}
                      href={candidatePath(item.slug)}
                      key={item.routeId}
                    >
                      {item.context.navLabelJa}
                    </Link>
                  ))}
                  {routeMode === 'published' ? (
                    <Link
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fbfaf5] hover:text-teal-950"
                      href={publishedProjectsNavItem.href}
                    >
                      {publishedProjectsNavItem.label}
                    </Link>
                  ) : null}
                </nav>
              </div>
            </details>
          </div>
        </div>
        <nav
          aria-label="NBL site mobile navigation"
          className="flex max-w-full gap-2 overflow-x-auto border-t border-slate-200 px-5 py-2 lg:hidden [scrollbar-width:none]"
        >
          <Link
            className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-2 py-1.5 text-[13px] font-semibold text-teal-800"
            href="/search"
          >
            検索
          </Link>
          {allRoutes.map((item) => (
            <Link
              aria-current={item.slug === currentRoute.slug ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap border-b-2 px-2 py-1.5 text-[13px] ${
                item.slug === currentRoute.slug
                  ? 'border-teal-800 text-slate-950'
                  : 'border-transparent text-slate-600'
              }`}
              href={candidatePath(item.slug)}
              key={item.routeId}
            >
              {item.context.navLabelJa}
            </Link>
          ))}
          {routeMode === 'published' ? (
            <Link
              className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-2 py-1.5 text-[13px] text-slate-600"
              href={publishedProjectsNavItem.href}
            >
              {publishedProjectsNavItem.label}
            </Link>
          ) : null}
        </nav>
      </header>
      {children}
    </div>
  );
}

function CandidateHero({
  context,
  experience,
  pageBody,
}: {
  context: AxiomPublicCandidatePageContext;
  experience: PageExperience;
  pageBody: AxiomIntegratedDomainKnowledgePageBody;
}) {
  const Icon = context.icon;
  const sceneHero = context.surface === 'scene_entry_use_cases' ? sceneComics[0] : null;
  const isSceneEntryHero = context.surface === 'scene_entry_use_cases';
  const isCaseReadingsHero = context.surface === 'consultation_case_reading_collection';
  const isWorkDesignGuideHero = context.surface === 'twenty_one_views_work_design_guide';
  const isArticlesHero = context.surface === 'article_social_question_library';
  const isToolkitHero = context.surface === 'cognitive_support_toolkit_studio_multimodal_objects';
  const isWorkConditionWindowHero = context.surface === 'work_condition_window';
  const isTheoryMethodTrustHero = context.surface === 'theory_method_trust_page';
  const heroVisual = {
    src: isSceneEntryHero
      ? sceneIssueMapHero.src
      : isCaseReadingsHero
        ? consultationAssessmentHeroVisual.src
        : isWorkDesignGuideHero
          ? workDesignGeneratedVisualAssets.hero.src
          : isTheoryMethodTrustHero
            ? theoryMethodHeroVisual.src
            : context.visual.src,
    alt: isSceneEntryHero
      ? sceneIssueMapHero.alt
      : isCaseReadingsHero
        ? consultationAssessmentHeroVisual.alt
        : isWorkDesignGuideHero
          ? workDesignGeneratedVisualAssets.hero.alt
          : isTheoryMethodTrustHero
            ? theoryMethodHeroVisual.alt
            : context.visual.alt,
  };
  const heroHeading = sceneHero ? (
    <>
      古くて新しい
      <br />
      課題を、
      <br />
      仕事条件の地図へ
    </>
  ) : isCaseReadingsHero ? (
    <>
      相談の一言を、
      <br />
      仕事条件の
      <br />
      対話へ
    </>
  ) : isWorkDesignGuideHero ? (
    <>
      未来の仕事・
      <br />
      社会参加
      <br />
      設計ガイド
    </>
  ) : isTheoryMethodTrustHero ? (
    <>
      部分的な
      <br />
      情報を、
      <br />
      仕事と参加の
      <br />
      専門知識へ
    </>
  ) : isArticlesHero ? (
    <>
      NBLレポート
      <br />
      社会の問いを、
      <br />
      仕事条件へ
    </>
  ) : isToolkitHero ? (
    <>
      言葉だけでは
      <br />
      届きにくいことを、
      <br />
      別の形へ
    </>
  ) : (
    pageBody.pageHeadingJa
  );
  const heroConcreteTitle = sceneHero ? (
    <>
      分かっているはずなのに、
      <br />
      解けなかった課題を、
      <br />
      4コマで見える形にする。
    </>
  ) : isCaseReadingsHero ? (
    <>
      その一言を、
      <br />
      本人の問題に閉じず、
      <br />
      一緒に確認する条件へ。
    </>
  ) : isWorkDesignGuideHero ? (
    <>
      障害者雇用の知見を、
      <br />
      これからの参加設計へ。
    </>
  ) : isTheoryMethodTrustHero ? (
    <>
      AIの読む力を、
      <br />
      断定ではなく、
      <br />
      関係を見抜く力として使う。
    </>
  ) : isArticlesHero ? (
    <>
      社会の違和感を、
      <br />
      仕事条件の問いとして
      <br />
      読み直す。
    </>
  ) : isToolkitHero ? (
    <>
      図解、4コマ、音楽、フォーラムを、
      <br />
      話し始める素材として選ぶ。
    </>
  ) : (
    experience.concreteTitle
  );
  const heroOpening = sceneHero
    ? '昔から理念や制度では語られてきたのに、現実には解けなかった課題を、4コマと短い読み替えで見るページです。何が数字、名前、制度、善意、検索結果に見えていたのか、どの関係を仕事条件として共有すればよいのかをつかめます。'
    : isCaseReadingsHero
      ? 'まとまっていない相談を急いで答えにせず、言葉の奥にある仕事、環境、支援、時間、評価の条件を一緒に確認します。専門的アセスメントは、個人の問題探しではなく、視野を広げるコミュニケーションです。'
      : isWorkDesignGuideHero
        ? '障害者雇用や難病就労支援で見えてきた課題を、人間の多様性を前提にした仕事と社会参加の設計図へ広げます。企業経営、雇用管理、専門支援、制度設計まで、同じ地図で考えるためのガイドです。'
        : isArticlesHero
          ? 'NBLレポートは、現場の困りごと、企業の迷い、支援者の翻訳負荷、政策議論の違和感を、仕事条件の問いとして読み直す論考の入口です。読者の問いから入り、構造、別解、まだ確認したいことへ進みます。'
          : isToolkitHero
            ? '文書だけでは伝わりにくい働きづらさや参加の条件を、図解、4コマ、音楽、フォーラム資料、チェックリストとして扱える形にします。読む前に、見て、聞いて、会議に持ち込める素材棚です。'
            : isTheoryMethodTrustHero
              ? '障害や病気に関する情報には、重要な手がかりと偏りが同時に含まれます。このサイトでは、それをそのまま要約せず、本人、仕事、環境、支援、時間、制度の関係として読み直し、仮説、反対仮説、確認したいことへ変換します。'
              : pageBody.openingThesisJa;
  const heroSubLabel = isCaseReadingsHero
    ? '相談事例集'
    : isWorkDesignGuideHero
      ? '未来の仕事・社会参加設計ガイド'
      : isTheoryMethodTrustHero
        ? 'NBLの専門性'
        : isArticlesHero
          ? 'NBLレポート'
          : isToolkitHero
            ? 'ツールキット'
            : context.falconPageRoleJa;

  if (isWorkConditionWindowHero) {
    return <WorkConditionWindowHero context={context} />;
  }

  return (
    <section className="relative overflow-hidden bg-[#20251e] text-white">
      <div className="mx-auto grid min-h-[610px] w-full max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative z-10 w-full max-w-[330px] min-w-0 md:max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <Icon size={14} />
            {experience.eyebrow}
          </span>
          <p className="mt-4 text-sm font-semibold tracking-[0.08em] text-amber-100">
            {heroSubLabel}
          </p>
          <h1
            aria-label={isWorkDesignGuideHero ? '未来の仕事・社会参加設計ガイド' : undefined}
            className="mt-5 max-w-full break-all text-[31px] font-semibold leading-[1.1] tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-[62px] md:leading-[1.04]"
          >
            {heroHeading}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/86 md:text-lg md:leading-9">
            {heroOpening}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {isToolkitHero ? (
              <>
                <a
                  className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-50"
                  href="#toolkit-selected-infographic-library"
                >
                  図解棚を見る
                  <ArrowRight size={16} />
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18"
                  href="#toolkit-shelf-music"
                >
                  音楽・資料へ
                </a>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-50"
                  href={candidatePath(context.primarySlug)}
                >
                  {context.primaryLabelJa}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18"
                  href={candidatePath(context.secondarySlug)}
                >
                  {context.secondaryLabelJa}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="relative z-10 w-full max-w-[330px] min-w-0 lg:max-w-none">
          <div className="min-w-0 overflow-hidden rounded-lg border border-white/18 bg-white shadow-2xl">
            {isArticlesHero ? (
              <ArticleReportHeroVisual />
            ) : isToolkitHero ? (
              <ToolkitHeroVisual />
            ) : (
              <img
                alt={heroVisual.alt}
                className={`h-[240px] w-full bg-slate-100 md:h-[330px] ${
                  sceneHero ||
                  isCaseReadingsHero ||
                  isWorkDesignGuideHero ||
                  isTheoryMethodTrustHero
                    ? 'object-contain'
                    : 'object-cover'
                }`}
                src={heroVisual.src}
              />
            )}
            <div className="bg-white p-6 text-slate-950">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                {experience.eyebrow}
              </p>
              <h2 className="mt-3 break-all text-[22px] font-semibold leading-snug tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-2xl">
                {heroConcreteTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{experience.concreteBody}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeTopHero() {
  return (
    <section
      className="border-b border-teal-950 bg-[#071f1d] text-white"
      aria-labelledby="home-why-title"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.16em] text-teal-200">Next Being Lab</p>
          <h1
            id="home-why-title"
            aria-label="障害者雇用・難病就労支援から、AI時代の仕事設計へ。"
            className="mt-4 text-[2.1rem] font-semibold leading-[1.05] tracking-normal text-white sm:text-[2.7rem] md:text-[3.45rem] xl:text-[3.75rem]"
          >
            <span className="block">障害者雇用・</span>
            <span className="block">難病就労支援から、</span>
            <span className="block sm:hidden">AI時代の</span>
            <span className="block sm:hidden">仕事設計へ。</span>
            <span className="hidden whitespace-nowrap sm:block">AI時代の仕事設計へ。</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg md:leading-9">
            AIが仕事や社会を急速に変える時代には、人の多様性と、仕事・環境・支援の組み合わせから、働き方と社会参加を設計する力が重要になります。けれど、その関係は複雑で、理念や想いだけでは実装しきれません。NBLはAIで読み解く負担を下げ、障害者雇用・難病就労支援で見えてきた知見を、仕事・環境・支援・時間・評価の条件として読み直すラボです。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(45,212,191,0.18)] transition hover:bg-teal-50"
              href={candidatePath('about-boundary')}
            >
              サイト情報
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <HomeWhyHeroImage />
      </div>
    </section>
  );
}

function HomeWhyHeroImage() {
  return (
    <figure className="aspect-[4/3] min-w-0 overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_34px_90px_rgba(13,148,136,0.28)] ring-1 ring-teal-200/20 lg:ml-auto lg:max-w-[560px]">
      <picture className="block h-full w-full">
        <source srcSet={homeWhyHeroVisual.webpSrc} type="image/webp" />
        <img
          alt={homeWhyHeroVisual.alt}
          className="block h-full w-full max-w-full bg-[#f7f0df] object-cover object-center"
          src={homeWhyHeroVisual.src}
        />
      </picture>
    </figure>
  );
}

function ArticleReportHeroVisual() {
  return (
    <img
      alt={articleReportHeroVisual.alt}
      className="block h-auto w-full bg-[#f7f0df]"
      src={articleReportHeroVisual.src}
    />
  );
}

function ToolkitHeroVisual() {
  return (
    <img
      alt={toolkitHeroVisual.alt}
      className="block h-auto w-full bg-[#f7f0df]"
      src={toolkitHeroVisual.src}
    />
  );
}

function WorkConditionWindowHero({ context }: { context: AxiomPublicCandidatePageContext }) {
  return (
    <section className="border-b border-slate-200 bg-[#f4ead8]">
      <div className="mx-auto grid min-h-[620px] max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-14">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/72 px-3 py-1.5 text-xs font-semibold text-teal-900 shadow-sm">
            <SearchCheck size={14} />
            障害者雇用から、これからの職場設計へ
          </span>
          <p className="mt-5 text-sm font-semibold tracking-[0.08em] text-teal-800">
            誰もが活躍できる仕事・参加設計へ
          </p>
          <h1 className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-normal text-slate-950 md:text-[64px] md:leading-[1.02]">
            障害者雇用は、例外対応ではない。
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-700 md:text-lg md:leading-9">
            視覚、聴覚、肢体、内部、知的、精神、発達、高次脳機能障害、難病。障害種類から見える課題は、誰もが活躍できる仕事／参加設計の応用問題です。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-950"
              href="#condition-window-categories"
            >
              障害種類から読む
              <ArrowRight size={16} />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              href={candidatePath(context.primarySlug)}
            >
              設計ガイドへ
            </Link>
          </div>
        </div>

        <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <img
            alt={workConditionWindowHeroVisual.alt}
            className="block h-auto w-full bg-[#f7f0df]"
            src={workConditionWindowHeroVisual.src}
          />
        </figure>
      </div>
    </section>
  );
}

function AboutSiteInfoHero() {
  return (
    <section className="border-b border-slate-200 bg-[#f3eadb]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-teal-900">
            <ShieldCheck size={14} />
            サイト情報
          </span>
          <h1 className="mt-5 text-[36px] font-semibold leading-tight tracking-normal text-slate-950 md:text-[64px] md:leading-[1.04]">
            Next Being Labについて
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg md:leading-9">
            運営者、責任者、運営目的、問い合わせ先、免責事項、著作権の扱いを確認するためのページです。サイトの使い方や専門性の説明は、各ページに分けて掲載しています。
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
            Basic information
          </p>
          <dl className="mt-5 grid gap-4 text-sm leading-7">
            <div className="grid gap-1 border-t border-slate-200 pt-4 md:grid-cols-[9rem_1fr]">
              <dt className="font-semibold text-slate-500">サイト名</dt>
              <dd className="font-semibold text-slate-950">Next Being Lab（NBL）</dd>
            </div>
            <div className="grid gap-1 border-t border-slate-200 pt-4 md:grid-cols-[9rem_1fr]">
              <dt className="font-semibold text-slate-500">運営者</dt>
              <dd className="font-semibold text-slate-950">Next Being Lab</dd>
            </div>
            <div className="grid gap-1 border-t border-slate-200 pt-4 md:grid-cols-[9rem_1fr]">
              <dt className="font-semibold text-slate-500">創設者・運営責任者</dt>
              <dd className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold text-slate-950">
                春名由一郎
                <a
                  className="text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950"
                  href="https://researchmap.jp/yharuna"
                  rel="noreferrer"
                  target="_blank"
                >
                  プロフィール
                </a>
              </dd>
            </div>
            <div className="grid gap-1 border-t border-slate-200 pt-4 md:grid-cols-[9rem_1fr]">
              <dt className="font-semibold text-slate-500">問い合わせ先</dt>
              <dd className="font-semibold text-slate-950">info@nextbeinglab.org</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function AboutSiteInfoContent() {
  const infoSections = [
    {
      title: '運営目的',
      body: '障害者・難病患者の就労支援で蓄積されてきた知見を、人間の多様性を前提にした仕事・社会参加設計の知識として整理し、社会に分かりやすく提供することを目的としています。',
      items: [
        '働きづらさを、人だけの問題で終わらせない視点を広げる',
        '本人、企業、支援者、政策・研究の対話に使える言葉と図を作る',
        '記事、相談事例、設計ガイド、図解・ツールとして届ける',
      ],
    },
    {
      title: '問い合わせ',
      body: '連絡はメールで受け付けます。研修、教材活用、共同検討、講演、調査研究、記事・図解の活用についての相談を想定しています。個別の病状、診断名、勤務先名、第三者の個人情報など、センシティブな情報は初回連絡に含めないでください。',
      items: [
        'info@nextbeinglab.org',
        '個別相談、医療・法律・人事判断、合理的配慮の最終判断は扱いません',
        'SNSやDMでは個別相談を扱いません',
        '返信内容は個別の医療・法律・人事判断ではありません',
      ],
    },
    {
      title: '免責事項',
      body: 'このサイトは情報提供と検討支援のためのものです。個別事案の最終判断は、本人、勤務先、医療・福祉・行政・法律等の関係者が、具体的状況に応じて行う必要があります。',
      items: [
        '医療判断、法的判断、人事判断、就労可否判断は行いません',
        '合理的配慮の妥当性や実施義務を最終判断しません',
        '就職、定着、問題解決、紛争防止を保証しません',
      ],
    },
    {
      title: '著作権・利用',
      body: 'このサイトの文章、図解、画像、音楽、資料、ツール等の権利は、特記がない限りNext Being Labまたは各権利者に帰属します。NBL作成コンテンツは、出典を明記した紹介・引用・非営利の共有を歓迎します。',
      items: [
        'SNSでの紹介、リンク共有、感想の投稿は歓迎します',
        'NBL名、ページURL、該当コンテンツ名を明記して活用してください',
        '無断で自作として表示すること、出典を伏せた転載・複製・二次利用はできません',
        '営利利用、大量転載、改変しての配布、教材・研修・出版物への組み込みは事前にご連絡ください',
        '外部資料やリンク先の権利は、それぞれの権利者に帰属します',
      ],
    },
    {
      title: 'SNS発信',
      body: 'NBLでは、記事、図解、相談事例、設計ガイドにつながる問いを、Xの専用アカウントでも発信します。投稿は個別相談の回答ではなく、サイトの内容を社会の問いへ届けるためのものです。',
      items: [
        'X: NBL｜仕事条件デザイン（@NBL_workdesign）',
        '投稿の紹介、引用、感想、議論のきっかけとしての共有を歓迎します',
        'DMや返信では、個別相談、医療・法律・人事判断を扱いません',
      ],
    },
  ] as const;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {infoSections.map((section) => (
            <article
              className="rounded-xl border border-slate-200 bg-[#fbfaf5] p-6"
              key={section.title}
            >
              <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{section.body}</p>
              <ul className="mt-5 grid gap-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    className="flex gap-3 text-sm leading-7 text-slate-700"
                    key={`${section.title}-${itemIndex}`}
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-700" />
                    <span>
                      {item === 'X: NBL｜仕事条件デザイン（@NBL_workdesign）' ? (
                        <a
                          className="font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950"
                          href="https://x.com/NBL_workdesign"
                          rel="noreferrer"
                          target="_blank"
                        >
                          {item}
                        </a>
                      ) : (
                        item
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-6">
          <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
            再利用ルールの考え方
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            NBL作成コンテンツは、標準的なオープンライセンスである
            <a
              className="mx-1 font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950"
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.ja"
              rel="noreferrer"
              target="_blank"
            >
              Creative Commons 表示-非営利 4.0 国際
            </a>
            の考え方を参考に、クレジットを明記した非営利の紹介・共有を促進します。個別コンテンツに別条件がある場合は、その表示を優先します。
          </p>
        </div>
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">Note</p>
          <p className="mt-3 text-base leading-8 text-white/84">
            このページは、サイト情報として必要な基本事項を簡潔に示すものです。NBLの専門性については「NBLの専門性」、記事とSNS連動については「NBLレポート」を参照してください。
          </p>
        </div>
      </div>
    </section>
  );
}

function ReaderPromiseBand({ context }: { context: AxiomPublicCandidatePageContext }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[330px] gap-4 px-0 py-8 md:max-w-7xl md:grid-cols-3 md:px-5">
        {[
          { label: '現場で起きやすいこと', body: context.problemJa, icon: FileSearch },
          { label: 'このページで見ること', body: context.promiseJa, icon: Route },
          { label: 'ここでは扱わないこと', body: context.notThisJa, icon: ShieldCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5"
            >
              <Icon size={19} className="text-teal-800" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PageExperienceSection({ experience }: { experience: PageExperience }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid gap-9 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
            Page experience
          </p>
          <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
            {experience.featureTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-700">{experience.featureLead}</p>
          <div className="mt-7 rounded-lg border border-amber-200 bg-[#fff8e8] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
              {experience.stepsTitle}
            </p>
            <ol className="mt-4 grid gap-3">
              {experience.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-7 text-slate-700">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {experience.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <Lightbulb size={18} className="text-teal-800" />
                {card.tag ? (
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                    {card.tag}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 break-words text-xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleSocialQuestionPublicContent() {
  const routeMode = useContext(AxiomNextNblRouteModeContext);
  const [activeArticleCategory, setActiveArticleCategory] =
    useState<ArticleCatalogCategoryFilter>('すべて');
  const [activeArticleTheme, setActiveArticleTheme] = useState<ArticleCatalogThemeFilter>('すべて');
  const [activeArticleAudience, setActiveArticleAudience] =
    useState<ArticleCatalogAudienceFilter>('すべて');
  const [articleCatalogSearch, setArticleCatalogSearch] = useState('');
  const [selectedFullArticleId, setSelectedFullArticleId] = useState(
    articleSocialQuestionFullArticles[0]?.id ?? '',
  );
  const [isArticleVisualExpanded, setIsArticleVisualExpanded] = useState(false);
  const normalizedArticleCatalogSearch = normalizeArticleCatalogSearch(articleCatalogSearch);
  const filteredArticleCatalogEntries = axiomArticleCatalogEntries.filter((entry) => {
    const matchesCategory =
      activeArticleCategory === 'すべて' || entry.category === activeArticleCategory;
    const matchesTheme = activeArticleTheme === 'すべて' || entry.theme === activeArticleTheme;
    const matchesAudience =
      activeArticleAudience === 'すべて' || entry.audiences.includes(activeArticleAudience);
    return (
      matchesCategory &&
      matchesTheme &&
      matchesAudience &&
      articleCatalogEntryMatchesSearch(entry, normalizedArticleCatalogSearch)
    );
  });
  const filteredArticleCatalogIds = new Set(filteredArticleCatalogEntries.map((entry) => entry.id));
  const visibleFullArticles = articleSocialQuestionFullArticles.filter((article) =>
    filteredArticleCatalogIds.has(article.id),
  );
  const selectedFullArticle =
    articleSocialQuestionFullArticles.find((article) => article.id === selectedFullArticleId) ??
    articleSocialQuestionFullArticles[0];
  const selectedFullArticleIndex = Math.max(
    0,
    articleSocialQuestionFullArticles.findIndex((article) => article.id === selectedFullArticle.id),
  );
  const selectedArticleCatalogEntry =
    axiomArticleCatalogEntries.find((entry) => entry.id === selectedFullArticle.id) ??
    axiomArticleCatalogEntries[0];
  const selectedVisualCorrespondence = selectedArticleCatalogEntry
    ? buildArticleVisualCorrespondence(selectedArticleCatalogEntry)
    : null;
  const selectedArticleContentHref = nblReportArticleContentPath(selectedFullArticle.id);
  const selectedArticleVisualHref = nblReportArticleContentPath(selectedFullArticle.id, true);
  const selectedArticleShareHref = nblReportArticleSharePath(selectedFullArticle.id);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('article');
    const linkedArticle = articleSocialQuestionFullArticles.find(
      (article) => article.id === articleId,
    );

    if (linkedArticle) {
      setSelectedFullArticleId(linkedArticle.id);
    }
    if (linkedArticle && params.get('visual') === '1') {
      setIsArticleVisualExpanded(true);
    }
  }, []);

  return (
    <>
      <section className="border-b border-slate-200 bg-[#f7f3e8]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                NBLレポート
              </p>
              <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                社会の問いから、読みたい論考を探す。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700">
                本人の苦しさ、企業の実装の迷い、支援者の翻訳負荷、政策議論の違和感から入れます。短い語句、テーマ、立場で選ぶと、下の本文リーダーに直接つながります。
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <label
                className="text-sm font-semibold text-slate-950"
                htmlFor="article-catalog-search"
              >
                記事検索
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  aria-label="記事検索"
                  className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  id="article-catalog-search"
                  onChange={(event) => setArticleCatalogSearch(event.target.value)}
                  placeholder="例: 通院、開示、雇用の質、メンタルヘルス、政策、AI"
                  type="search"
                  value={articleCatalogSearch}
                />
                <button
                  className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                  onClick={() => {
                    setActiveArticleTheme('すべて');
                    setActiveArticleCategory('すべて');
                    setActiveArticleAudience('すべて');
                    setArticleCatalogSearch('');
                  }}
                  type="button"
                >
                  絞り込みを戻す
                </button>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {visibleFullArticles.length}件を表示しています。
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">本格テーマ</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {articleCatalogThemes.map((theme) => {
                  const count = axiomArticleCatalogEntries.filter(
                    (entry) => entry.theme === theme,
                  ).length;
                  const isActive = activeArticleTheme === theme;

                  return (
                    <button
                      aria-label={`本格テーマ ${theme} で絞り込む`}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-900'
                      }`}
                      key={theme}
                      onClick={() => setActiveArticleTheme(theme)}
                      type="button"
                    >
                      <span>{theme}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}本
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">仕事条件と立場</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {articleCatalogCategoryFilters.map((category) => (
                  <button
                    aria-label={`仕事条件 ${category} で絞り込む`}
                    aria-pressed={activeArticleCategory === category}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      activeArticleCategory === category
                        ? 'border-teal-800 bg-teal-800 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-900'
                    }`}
                    key={category}
                    onClick={() => setActiveArticleCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {articleCatalogAudienceFilters.map((audience) => (
                  <button
                    aria-pressed={activeArticleAudience === audience}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      activeArticleAudience === audience
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-900'
                    }`}
                    key={audience}
                    onClick={() => setActiveArticleAudience(audience)}
                    type="button"
                  >
                    {audience}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section
            className="mt-6 rounded-lg border border-teal-100 bg-white p-5 shadow-sm md:p-6"
            data-article-editorial-map
          >
            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                  Editorial map
                </p>
                <h3 className="mt-2 break-words text-2xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                  NBLレポートの編集地図
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  読者の違和感から入り、テーマ、立場、仕事条件、図解を行き来しながら、本文リーダーで読む記事を選びます。
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
                  <p className="text-sm font-semibold text-slate-950">問いから探す</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    本人の苦しさ、企業の迷い、支援者の翻訳負荷、政策議論の違和感を入口にします。
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
                  <p className="text-sm font-semibold text-slate-950">テーマで広げる</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {articleCatalogThemes.length}の本格テーマと{articleCatalogCategories.length}
                    の仕事条件から、近い論点を選べます。
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
                  <p className="text-sm font-semibold text-slate-950">図解と本文を対応させる</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    各記事の図解は、飾りではなく、本文で読む問いと設計の関係を先に見せる入口です。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-7 grid gap-8 lg:grid-cols-[340px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">
                    記事を選ぶ
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-normal">
                    {visibleFullArticles.length}件を表示
                  </p>
                </div>
                <nav
                  aria-label="本格記事セレクター"
                  className="max-h-[720px] divide-y divide-slate-200 overflow-y-auto"
                >
                  {visibleFullArticles.map((article) => {
                    const isSelected = selectedFullArticle.id === article.id;
                    const articleIndex = Math.max(
                      0,
                      articleSocialQuestionFullArticles.findIndex(
                        (candidate) => candidate.id === article.id,
                      ),
                    );

                    return (
                      <button
                        aria-label={`本格記事 ${article.title} を読む`}
                        aria-pressed={isSelected}
                        className={`block w-full p-4 text-left transition ${
                          isSelected
                            ? 'bg-teal-50 text-slate-950'
                            : 'bg-white text-slate-700 hover:bg-[#fbfaf5] hover:text-teal-950'
                        }`}
                        data-full-article-selector
                        key={article.id}
                        onClick={() => {
                          setSelectedFullArticleId(article.id);
                          setIsArticleVisualExpanded(false);
                          replaceBrowserUrl(nblReportArticleContentPath(article.id), routeMode);
                        }}
                        type="button"
                      >
                        <span className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
                          <span>記事 {articleIndex + 1}</span>
                          <span>{article.readingTime}</span>
                        </span>
                        <span className="mt-2 block text-base font-semibold leading-snug">
                          {article.title}
                        </span>
                        <span className="mt-2 block text-xs font-semibold text-slate-500">
                          {article.featureLabel} / {article.category}
                        </span>
                      </button>
                    );
                  })}
                  {visibleFullArticles.length === 0 ? (
                    <div className="p-5 text-sm leading-7 text-slate-700">
                      近い記事が見つかりません。検索語を短くするか、絞り込みを戻して探してください。
                    </div>
                  ) : null}
                </nav>
              </div>
            </aside>

            <article
              aria-live="polite"
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              data-full-article-reader
              id="full-article-reader"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                  <span>記事 {selectedFullArticleIndex + 1}</span>
                  <span>{selectedFullArticle.featureLabel}</span>
                  <span>{selectedFullArticle.readingTime}</span>
                  <span>{selectedFullArticle.reader}</span>
                </div>
                <h3 className="mt-4 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                  {selectedFullArticle.title}
                </h3>
                <p className="mt-5 border-l-4 border-teal-700 pl-5 text-lg font-semibold leading-8 text-slate-800">
                  {selectedFullArticle.hook}
                </p>
                <ShareActionStrip
                  contentHref={selectedArticleContentHref}
                  intro="この記事をSNSや会議メモで共有できます。"
                  shareHref={selectedArticleShareHref}
                  shareText={`NBLレポート「${selectedFullArticle.title}」`}
                />

                <div className="mt-7 grid gap-3 md:grid-cols-2">
                  <section className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                      よくある読み
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {selectedFullArticle.oldReading}
                    </p>
                  </section>
                  <section className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                    <p className="text-xs font-semibold tracking-[0.16em] text-teal-900">
                      この記事で見ること
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-800">
                      {selectedFullArticle.designReading}
                    </p>
                  </section>
                </div>

                {selectedVisualCorrespondence ? (
                  <section
                    className="mt-6 rounded-lg border border-slate-200 bg-[#eef5f1] p-5"
                    data-article-visual-correspondence
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                      図解対応
                    </p>
                    <h4 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
                      この図解で先に見ること
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {selectedVisualCorrespondence.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedVisualCorrespondence.cues.map((cue) => (
                        <span
                          className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-900"
                          key={`${selectedFullArticle.id}-${cue}`}
                        >
                          {cue}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                <figure
                  className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                  data-article-visual
                  id="article-visual"
                >
                  <button
                    aria-label={`${selectedFullArticle.title}の図解をページ上で拡大表示`}
                    className="group relative block w-full cursor-zoom-in bg-slate-100 text-left"
                    onClick={() => setIsArticleVisualExpanded(true)}
                    type="button"
                  >
                    <img
                      alt={selectedFullArticle.imageAlt}
                      className="block h-auto max-h-[560px] w-full object-contain"
                      src={selectedFullArticle.imageSrc}
                    />
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/82 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition group-hover:bg-teal-900">
                      <Maximize2 size={14} />
                      拡大
                    </span>
                  </button>
                  <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-xs leading-6 text-slate-600">
                    図解をクリックすると、このページ上で拡大表示します。
                  </figcaption>
                </figure>
                <ShareActionStrip
                  contentHref={selectedArticleVisualHref}
                  intro="この図解を入口に共有できます。"
                  shareHref={selectedArticleShareHref}
                  shareText={`図解で読むNBLレポート「${selectedFullArticle.title}」`}
                />
              </div>

              <div className="border-t border-slate-200 p-6 md:p-8">
                <div className="mx-auto max-w-5xl space-y-8">
                  <div className="mx-auto max-w-[78ch] space-y-7 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
                    {selectedFullArticle.sections.map((section) => (
                      <section key={section.heading}>
                        <h4 className="text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                          {section.heading}
                        </h4>
                        <p className="mt-3">{section.body}</p>
                      </section>
                    ))}
                  </div>

                  <section className="rounded-lg border border-amber-200 bg-[#fff8e8] p-5 md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
                      現場へ戻す
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
                      読み終えたあと、会議や相談で最初に話すこと
                    </h4>
                    <p className="mt-3 max-w-[78ch] text-sm leading-7 text-slate-700">
                      記事を「なるほど」で終えず、本人、職場、支援者が同じ対象を見ながら次の確認に進むための入口です。結論ではなく、次の相談や会議を少しよくするための問いとして使います。
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-md border border-amber-100 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-950">最初の一手</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          {selectedFullArticle.firstMove}
                        </p>
                      </div>
                      <div className="rounded-md border border-amber-100 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-950">会議・相談で使う問い</p>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                          {selectedFullArticle.discussionQuestions.map((question) => (
                            <li key={question} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-lg border border-teal-200 bg-teal-50 p-5 md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                      この記事から深める
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
                      近い相談、設計視点、使う道具を選ぶ
                    </h4>
                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      {selectedFullArticle.nextUseGroups.map((group) => (
                        <Link
                          key={`${selectedFullArticle.title}-${group.title}`}
                          className="group rounded-md border border-teal-100 bg-white p-4 transition hover:border-teal-400 hover:shadow-sm"
                          href={group.href}
                        >
                          <span className="flex items-start justify-between gap-3 text-sm font-semibold text-teal-950">
                            {group.title}
                            <ArrowRight
                              size={15}
                              className="mt-1 shrink-0 transition group-hover:translate-x-0.5"
                            />
                          </span>
                          <span className="mt-2 block text-sm leading-7 text-slate-700">
                            {group.intent}
                          </span>
                          <span className="mt-4 block space-y-2">
                            {group.items.map((item) => (
                              <span
                                className="block rounded border border-slate-100 bg-[#fbfaf5] px-3 py-2 text-xs leading-5 text-slate-700"
                                key={`${selectedFullArticle.title}-${group.title}-${item}`}
                              >
                                {item}
                              </span>
                            ))}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </article>
          </div>

          {isArticleVisualExpanded ? (
            <div
              aria-label={`${selectedFullArticle.title}の拡大図解`}
              aria-modal="true"
              className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/82 px-4 py-6 backdrop-blur-sm"
              data-article-visual-lightbox
              role="dialog"
            >
              <button
                aria-label="背景を押して拡大図解を閉じる"
                className="absolute inset-0 cursor-zoom-out"
                onClick={() => setIsArticleVisualExpanded(false)}
                type="button"
              />
              <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 md:px-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                      図解を拡大表示
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-950">
                      {selectedFullArticle.title}
                    </p>
                  </div>
                  <button
                    aria-label="拡大図解を閉じる"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                    onClick={() => setIsArticleVisualExpanded(false)}
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="min-h-0 overflow-auto bg-slate-100 p-3 md:p-5">
                  <img
                    alt={selectedFullArticle.imageAlt}
                    className="mx-auto block max-h-[72vh] w-auto max-w-full rounded-md object-contain"
                    src={selectedFullArticle.imageSrc}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function ToolkitStudioPublicContent() {
  const routeMode = useContext(AxiomNextNblRouteModeContext);
  const [selectedToolkitInfographic, setSelectedToolkitInfographic] =
    useState<ToolkitSelectedInfographic | null>(null);
  const selectedToolkitInfographicId = selectedToolkitInfographic
    ? toolkitInfographicId(selectedToolkitInfographic.file)
    : '';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('image');
    const linkedItem = itemId ? findToolkitSelectedInfographicById(itemId) : null;

    if (linkedItem) {
      setSelectedToolkitInfographic(linkedItem);
    }
  }, []);

  function closeSelectedToolkitInfographic() {
    setSelectedToolkitInfographic(null);
    replaceBrowserUrl(
      candidateAnchorPath('toolkit-studio', 'toolkit-selected-infographic-library'),
      routeMode,
    );
  }

  return (
    <>
      <section className="border-y border-slate-200 bg-[#fbfaf5]" id="toolkit-studio-modules">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              Pick by medium
            </p>
            <h2 className="mt-3 max-w-3xl break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
              見る、読む、聞く、話す素材を選ぶ。
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
              仕事条件の複雑さを、文章だけでなく、図解、4コマ、音楽、フォーラム、チェックリストとして使える棚に並べます。
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {toolkitShelves.map((shelf) => (
              <article
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                data-toolkit-shelf-card
                id={shelf.id}
                key={shelf.id}
              >
                <div className="grid min-h-full gap-0 md:grid-cols-[0.92fr_1.08fr]">
                  <div className="bg-slate-100">
                    <img
                      alt={shelf.imageAlt}
                      className="h-full min-h-[230px] w-full object-cover"
                      loading="lazy"
                      src={shelf.image}
                    />
                  </div>
                  <div className="flex min-h-full flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                      {shelf.eyebrow}
                    </p>
                    <h3 className="mt-3 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                      {shelf.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{shelf.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {shelf.tags.map((tag) => (
                        <span
                          className="rounded-full border border-slate-200 bg-[#fbfaf5] px-3 py-1 text-xs font-semibold text-slate-600"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {'audio' in shelf && shelf.audio ? (
                      <audio className="mt-5 w-full" controls preload="none" src={shelf.audio}>
                        このブラウザでは音声を再生できません。
                      </audio>
                    ) : null}
                    <Link
                      className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-teal-800 hover:text-teal-950"
                      href={shelf.href}
                    >
                      {shelf.action}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#eef5f1]" id="toolkit-use-packages">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                Use packages
              </p>
              <h2 className="mt-3 max-w-3xl break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
                使う場面から、素材を組み合わせる。
              </h2>
            </div>
            <p className="text-base leading-8 text-slate-700 md:text-lg">
              図解、4コマ、音楽、フォーラム資料は、単体で眺めるだけでは力を出しきれません。
              初回相談、管理職研修、健康時間の話し合い、フォーラム後の実装など、場面ごとに組み合わせて使える形にします。
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {toolkitUsePackages.map((usePackage) => (
              <article
                className="rounded-lg border border-teal-100 bg-white p-6 shadow-sm"
                data-toolkit-use-package-card
                id={usePackage.id}
                key={usePackage.id}
              >
                <p className="inline-flex rounded-full border border-teal-100 bg-[#eef5f1] px-3 py-1 text-xs font-semibold text-teal-900">
                  {usePackage.scene}
                </p>
                <h3 className="mt-4 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                  {usePackage.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{usePackage.lead}</p>

                <div className="mt-5 grid gap-3">
                  {usePackage.materials.map((material) => {
                    const MaterialIcon = material.icon;

                    return (
                      <Link
                        className="group grid gap-3 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4 transition hover:border-teal-500 hover:bg-white sm:grid-cols-[auto_1fr_auto] sm:items-center"
                        href={material.href}
                        key={`${usePackage.id}-${material.label}`}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-teal-800 shadow-sm">
                          <MaterialIcon size={18} />
                        </span>
                        <span>
                          <span className="block break-words text-sm font-semibold leading-snug text-slate-950 [overflow-wrap:anywhere]">
                            {material.label}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-slate-700">
                            {material.detail}
                          </span>
                        </span>
                        <ArrowRight
                          className="text-teal-700 transition group-hover:translate-x-0.5"
                          size={16}
                        />
                      </Link>
                    );
                  })}
                </div>

                <p className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
                  {usePackage.outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-b border-slate-200 bg-white"
        id="toolkit-selected-infographic-library"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                Selected infographics
              </p>
              <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
                選別済みの図解を、内容で探す。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg">
                {toolkitSelectedInfographicCount}
                枚の図解と4コマを、画像のテーマではなく「何を読み替える道具か」で整理しました。
                画像を押すと、このページ上で拡大して読めます。
              </p>
            </div>
            <nav
              aria-label="選別インフォグラフィック棚"
              className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4"
            >
              {toolkitSelectedInfographicGroups.map((group) => (
                <a
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                  href={`#${group.id}`}
                  key={group.id}
                >
                  {group.navLabel}
                  <span className="ml-1 text-slate-400">{group.items.length}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-10 space-y-10">
            {toolkitSelectedInfographicGroups.map((group) => (
              <section
                className="scroll-mt-24 rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 shadow-sm md:p-6"
                data-toolkit-infographic-group
                id={group.id}
                key={group.id}
              >
                <div className="grid gap-5 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                      {group.navLabel} / {group.items.length}枚
                    </p>
                    <h3 className="mt-3 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
                      {group.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{group.lead}</p>
                    <p className="mt-4 rounded-lg border border-teal-100 bg-white p-4 text-sm leading-7 text-teal-950">
                      {group.usefulFor}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item) => (
                      <button
                        aria-label={`${item.title}を拡大して読む`}
                        className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
                        data-toolkit-infographic-card
                        key={`${group.id}-${item.file}`}
                        onClick={() => {
                          const itemId = toolkitInfographicId(item.file);
                          setSelectedToolkitInfographic(item);
                          replaceBrowserUrl(toolkitInfographicContentPath(itemId), routeMode);
                        }}
                        type="button"
                      >
                        <span className="grid h-44 w-full place-items-center overflow-hidden rounded-md bg-slate-100 p-2">
                          <img
                            alt={item.alt}
                            className="max-h-full w-full object-contain"
                            loading="lazy"
                            src={toolkitSelectedInfographicSrc(item.file)}
                          />
                        </span>
                        <span className="mt-3 block break-words text-base font-semibold leading-snug text-slate-950 [overflow-wrap:anywhere]">
                          {item.title}
                        </span>
                        <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
                          何を見る図か
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">
                          {item.lens}
                        </span>
                        <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
                          使いどころ
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">
                          {item.use}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-semibold text-teal-800 group-hover:text-teal-950">
                          <Maximize2 size={13} />
                          拡大して読む
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#eef5f1]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.78fr_1.22fr] md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              How to use
            </p>
            <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
              使い方は、時間と場面から選ぶ。
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              素材を全部読む必要はありません。短くつかむ、対話に使う、研修やイベントに持ち込む、という三つの使い方で選べます。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {toolkitUseModes.map((mode) => (
              <div
                key={mode.title}
                className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm"
              >
                <h3 className="break-words text-xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                  {mode.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{mode.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbf9]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr] md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100">
                  Boundary
                </p>
                <h2 className="mt-3 break-words text-2xl font-semibold tracking-normal [overflow-wrap:anywhere] md:text-3xl">
                  素材は、判断の代わりではなく、話し始めるための道具。
                </h2>
              </div>
              <ul className="grid gap-3">
                {toolkitBoundaryNotes.map((note) => (
                  <li
                    className="flex gap-3 rounded-lg border border-white/18 bg-[#fffdf7] p-4 text-sm leading-7 text-slate-700"
                    key={note}
                  >
                    <ShieldCheck className="mt-1 shrink-0 text-teal-800" size={17} />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {selectedToolkitInfographic ? (
        <div
          aria-label={`${selectedToolkitInfographic.title}の拡大図解`}
          aria-modal="true"
          className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/82 px-4 py-6 backdrop-blur-sm"
          data-toolkit-infographic-lightbox
          role="dialog"
        >
          <button
            aria-label="背景を押して拡大図解を閉じる"
            className="absolute inset-0 cursor-zoom-out"
            onClick={closeSelectedToolkitInfographic}
            type="button"
          />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 md:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                  図解を拡大表示
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-950">
                  {selectedToolkitInfographic.title}
                </p>
              </div>
              <button
                aria-label="拡大図解を閉じる"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-teal-500 hover:text-teal-900"
                onClick={closeSelectedToolkitInfographic}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 overflow-auto bg-slate-100 p-3 md:p-5">
              <img
                alt={selectedToolkitInfographic.alt}
                className="mx-auto block max-h-[72vh] w-auto max-w-full rounded-md object-contain"
                src={toolkitSelectedInfographicSrc(selectedToolkitInfographic.file)}
              />
              <div className="mx-auto mt-4 grid max-w-5xl gap-3 md:grid-cols-2">
                <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
                    何を見る図か
                  </span>
                  {selectedToolkitInfographic.lens}
                </p>
                <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
                    使いどころ
                  </span>
                  {selectedToolkitInfographic.use}
                </p>
              </div>
              {selectedToolkitInfographicId ? (
                <ShareActionStrip
                  contentHref={toolkitInfographicContentPath(selectedToolkitInfographicId)}
                  intro="この図解を単体で共有できます。"
                  shareHref={toolkitInfographicSharePath(selectedToolkitInfographicId)}
                  shareText={`NBLツールキット「${selectedToolkitInfographic.title}」`}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DeepPageModules({ surface }: { surface: AxiomNextNblSiteSurface }) {
  const modules = deepPageModules[surface];
  const sectionId =
    surface === 'cognitive_support_toolkit_studio_multimodal_objects'
      ? 'toolkit-studio-modules'
      : undefined;

  return (
    <section className="border-y border-slate-200 bg-[#f7f3e8]" id={sectionId}>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
            Page content
          </p>
          <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
            読者導線を保ったまま、専門知識を読みやすい本文にする。
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-700">
            これまでのサイトで有効だった入口、読み順、道具化の構造を落とさず、具体的な本文と見立てを新しい専門知識に合わせて更新します。
          </p>
        </div>
        <div className="mt-10 grid gap-6">
          {modules.map((module) => (
            <article
              key={module.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                    {module.eyebrow}
                  </p>
                  <h3 className="mt-3 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
                    {module.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{module.lead}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {module.cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Map size={17} className="mt-1 shrink-0 text-teal-800" />
                        {card.tag ? (
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {card.tag}
                          </span>
                        ) : null}
                      </div>
                      <h4 className="mt-3 break-words text-lg font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                        {card.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const workDesignSituationLevels = [
  {
    label: '破綻・停止',
    title: '参加が止まる',
    body: '欠勤、離職、評価低下、孤立、過剰な本人説明など、仕事や参加が続かなくなっている。',
    visual: '!',
    tone: 'border-slate-300 bg-slate-950 text-white',
  },
  {
    label: '高頻度支障',
    title: '同じ衝突が繰り返す',
    body: '時間、情報、手順、移動、評価、支援のどこかで同じ詰まりが反復している。',
    visual: '↻',
    tone: 'border-rose-200 bg-rose-50 text-rose-950',
  },
  {
    label: '要調整',
    title: '条件に分けて直す',
    body: '本人の努力や診断名ではなく、変えられる仕事条件と確認が必要な条件に分けている。',
    visual: '◇',
    tone: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    label: '安定・予防',
    title: '続ける・育つ・選び直す',
    body: '今の安定だけでなく、回復、成長、役割、評価、再調整まで設計に入っている。',
    visual: '✓',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
] as const;

const workDesignAudienceUses = [
  {
    title: '本人・家族',
    body: '「自分の問題」と思っていた困りごとを、時間・情報・評価・支援接続のどこで起きているかに分ける。',
  },
  {
    title: '企業・上司・人事',
    body: '配慮の名前を探す前に、勤務密度、情報形式、手順、評価、相談線を具体的に点検する。',
  },
  {
    title: '支援者・医療・福祉・教育',
    body: '本人の言葉や医療・生活情報を、職場で確認できる仕事条件へ翻訳する。',
  },
  {
    title: '行政・研修・地域連携',
    body: '診断名別の知識提供だけでなく、現場が持ち帰れる点検視点と共通言語を作る。',
  },
] as const;

type WorkDesignSituationScale = {
  axis: string;
  critical: string;
  high: string;
  adjust: string;
  stable: string;
};

type WorkDesignVisualStory = {
  icon: LucideIcon;
  conclusion: string;
  levels: readonly [
    { scene: string; body: string; icon: LucideIcon },
    { scene: string; body: string; icon: LucideIcon },
    { scene: string; body: string; icon: LucideIcon },
    { scene: string; body: string; icon: LucideIcon },
  ];
};

const axiomWorkDesignSituationScales: Record<string, WorkDesignSituationScale> = {
  rebuilt_unit_fluctuating_health_time_work_density: {
    axis: '健康時間・仕事密度・回復余地',
    critical:
      '体調悪化、欠勤、納期断念、数日単位の回復遅れが起きても、仕事量や評価の置き方が変わらない。',
    high: '締切、繁忙、通勤、回復不足が重なり、翌日の疲労、品質低下、相談遅れが反復する。',
    adjust:
      '山場や悪化しやすい時期は見えているが、仕事量、休憩、戻り方の調整が本人の都度交渉に残る。',
    stable: '仕事量、密度、通勤、休憩、回復、戻り方、評価時期を同じ時間軸で見直せる。',
  },
  rebuilt_unit_regular_medical_monitoring_treatment_time: {
    axis: '定期治療・検診・身体管理と勤務時間',
    critical:
      '治療や検診を優先すると仕事が止まり、仕事を優先すると治療や回復が崩れる二択になっている。',
    high: '通院日や治療後の回復が会議、納期、収入、評価とぶつかり、健康を守るほど不利になる。',
    adjust: '通院や検診日は認められるが、治療後の回復、抜けた情報の補完、評価時期との調整が弱い。',
    stable: '治療・検診・服薬・回復・引継ぎ・評価を、勤務の時間設計に組み込めている。',
  },
  rebuilt_unit_sensory_information_access_communication: {
    axis: '情報形式・会議参加・非公式情報へのアクセス',
    critical:
      '重要情報、会議、緊急連絡、雑談から外れ、作業開始、意思決定、安全確認、関係形成が成り立たない。',
    high: '聞き漏れ、見落とし、資料形式の不一致、会議参加の遅れが反復し、評価や関係にも響く。',
    adjust: '公式資料は届くが、口頭補足、画面情報、会議中の流れ、非公式連絡でこぼれやすい。',
    stable: '音声、文字、図、画面、警告、会議進行、非公式情報を、参加できる形式に整えられている。',
  },
  rebuilt_unit_cognitive_procedural_access_switching_load: {
    axis: '手順理解・切替・確認回路',
    critical: '作業の開始、切替、完了、確認、失敗から戻る手順のどこかが止まり、継続が難しい。',
    high: '急な変更、例外対応、同時並行でミスや遅れが反復し、注意や叱責だけが増える。',
    adjust: '通常時は回るが、割込み、優先順位変更、例外発生時の確認先や戻り方が曖昧である。',
    stable: '開始条件、優先順位、完了条件、切替、確認先、戻り方が仕事手順として見える。',
  },
  rebuilt_unit_disclosure_stigma_purpose_limited_information: {
    axis: '目的限定の情報共有と評価境界',
    critical: '必要情報が届かず調整が動かない、または過剰共有で不利益評価や二次被害が起きている。',
    high: '共有範囲がぶれ、誤解、不利益、本人の説明負荷、職場側の過剰な推測が反復する。',
    adjust: '人事や上司には話せるが、同僚説明、更新時点、伝えない情報の扱いで迷いが残る。',
    stable: '伝える内容、伝えない内容、共有先、同意範囲、更新時点を、調整目的ごとに分けられる。',
  },
  rebuilt_unit_pre_entry_job_image_transition: {
    axis: '就職前の仕事像・体験・移行接続',
    critical:
      '求人語と本人条件が翻訳されず、応募、面接、採用判断が表層条件や不安だけで止まっている。',
    high: '「臨機応変」「体力」などの抽象語が能力要件化し、応募前から選択肢を狭める。',
    adjust: '職場体験や見学はあるが、採用後の手順、休憩、相談線、評価へ引き継がれにくい。',
    stable: '求人の抽象語を作業、時間、対人、判断、環境、評価へ分け、本人条件と試行できる。',
  },
  rebuilt_unit_worksite_contact_task_safety_tools: {
    axis: '職場接触点・移動・道具・安全',
    critical:
      '通勤、動線、道具、姿勢、安全、顧客接点の問題で、出勤、滞在、担当、会議参加が止まり始める。',
    high: '移動や作業接触点で消耗や痛み、ミス、安全不安が反復し、担当できる仕事が狭まる。',
    adjust:
      '道具や席は一部調整できるが、職場内外の移動、休憩場所、代替手順、止める基準が曖昧である。',
    stable:
      '作業、道具、座席、動線、通勤、休憩、安全、顧客対応、人員余力を接触点ごとに点検できる。',
  },
  rebuilt_unit_support_retranslation_continuity_network: {
    axis: '支援の再翻訳・handoff・戻り回路',
    critical: '本人、職場、医療・生活、制度が別々に動き、支援が仕事参加へ変換されていない。',
    high: '支援は存在するが、職場で何を誰が変えるのかに届かず、本人説明だけが増える。',
    adjust: '相談先はあるが、医療・生活情報、職場不安、評価基準を仕事条件へ翻訳しきれていない。',
    stable: '本人の言葉、職場の制約、医療・生活情報、制度、評価を仕事条件へつなぎ直す役割がある。',
  },
  rebuilt_unit_role_value_growth_quality_loop: {
    axis: '役割・評価・成長・就業後の質',
    critical:
      '定着だけが成功扱いになり、仕事としての価値、評価、処遇、学び、将来の見通しが閉じている。',
    high: '雇用は続くが、役割固定、低評価、低処遇、成長機会の不足が反復する。',
    adjust: '安定就労はあるが、調整下の成果を評価、役割拡張、処遇、将来希望へ接続しにくい。',
    stable: '成果、役割、評価、賃金、学習機会、本人の将来希望を、働き続ける質として見直せる。',
  },
  rebuilt_unit_source_lens_universal_structure_boundary_guard: {
    axis: '情報の見え方・普遍化・境界ブレーキ',
    critical:
      '一つのデータ群、時代、国、制度、障害種類の見え方を、そのまま一般論として出してしまう。',
    high: '件数の多い領域や分かりやすい物語に引きずられ、少数だが重要な条件が埋もれる。',
    adjust: '情報源の偏りは意識しているが、どこまで普遍化できるか、どこで止めるかが曖昧である。',
    stable:
      '各資料を現実の一面として扱い、普遍構造候補、制度差、時代差、まだ確認が必要なことを分けて読める。',
  },
};

const workDesignVisualStories: Record<string, WorkDesignVisualStory> = {
  rebuilt_unit_fluctuating_health_time_work_density: {
    icon: Clock3,
    conclusion: '時間を味方につける設計が、力を出し続けられる仕事をつくる。',
    levels: [
      {
        scene: '締切・通勤・疲労が重なる',
        body: '仕事も回復も止まりがちになる。',
        icon: BriefcaseBusiness,
      },
      {
        scene: '同じ崩れ方が毎月起きる',
        body: '本人の都度交渉だけが増える。',
        icon: CalendarDays,
      },
      {
        scene: '密度・移動・休養を分ける',
        body: '衝突している条件を見える化する。',
        icon: Train,
      },
      {
        scene: '戻り方と評価時期を置く',
        body: '回復と成果を両立しやすくする。',
        icon: Home,
      },
    ],
  },
  rebuilt_unit_regular_medical_monitoring_treatment_time: {
    icon: Stethoscope,
    conclusion: '治療や検診の時間を、働くための条件として組み込む。',
    levels: [
      {
        scene: '治療か仕事かの二択になる',
        body: '健康を守るほど仕事が不利になる。',
        icon: Stethoscope,
      },
      {
        scene: '通院後の回復がこぼれる',
        body: '会議、納期、評価とぶつかる。',
        icon: CalendarDays,
      },
      {
        scene: '治療・回復・引継ぎを分ける',
        body: '抜けた情報の補完まで扱う。',
        icon: ClipboardList,
      },
      {
        scene: '勤務表に健康時間を置く',
        body: '継続治療と仕事を同じ予定に載せる。',
        icon: Clock3,
      },
    ],
  },
  rebuilt_unit_sensory_information_access_communication: {
    icon: MessageCircle,
    conclusion: '情報形式を選べることが、会議参加や安全確認の入口になる。',
    levels: [
      {
        scene: '重要情報が届かない',
        body: '会議、指示、安全確認から外れる。',
        icon: MessageCircle,
      },
      {
        scene: '聞き漏れ・見落としが続く',
        body: '遅れや誤解が評価にも響く。',
        icon: FileText,
      },
      {
        scene: '音声・文字・図を分ける',
        body: '届き方を参加条件として選ぶ。',
        icon: Laptop,
      },
      {
        scene: '誰もが同じ流れを見られる',
        body: '会議と連絡が参加できる形になる。',
        icon: UsersRound,
      },
    ],
  },
  rebuilt_unit_cognitive_procedural_access_switching_load: {
    icon: ClipboardList,
    conclusion: '手順と戻り方が見えると、失敗しても仕事に戻れる。',
    levels: [
      {
        scene: '開始・切替・完了で止まる',
        body: 'どこから戻るかが分からない。',
        icon: ClipboardList,
      },
      {
        scene: '急な変更でミスが反復する',
        body: '注意や叱責だけが増える。',
        icon: MessageCircle,
      },
      {
        scene: '優先順位と確認先を分ける',
        body: '例外時の手順を見える化する。',
        icon: SearchCheck,
      },
      {
        scene: '戻れる仕事手順になる',
        body: '開始条件、完了条件、確認先がそろう。',
        icon: ShieldCheck,
      },
    ],
  },
  rebuilt_unit_disclosure_stigma_purpose_limited_information: {
    icon: ShieldCheck,
    conclusion: '伝える情報と伝えない情報を分けることが、評価と安全を守る。',
    levels: [
      {
        scene: '話せず調整が動かない',
        body: 'または話しすぎて不利益が起きる。',
        icon: Shield,
      },
      {
        scene: '共有範囲が毎回ぶれる',
        body: '説明負荷と推測が増えていく。',
        icon: MessagesSquare,
      },
      {
        scene: '目的ごとに情報を分ける',
        body: '共有先、更新時点、同意範囲を置く。',
        icon: FileText,
      },
      {
        scene: '調整と評価を両立する',
        body: '必要情報だけで仕事条件を変えられる。',
        icon: Network,
      },
    ],
  },
  rebuilt_unit_pre_entry_job_image_transition: {
    icon: DoorOpen,
    conclusion: '入口の前から仕事条件を試せると、選択肢が広がる。',
    levels: [
      {
        scene: '求人語が不安だけを生む',
        body: '応募や面接の前に選択肢が狭まる。',
        icon: DoorOpen,
      },
      {
        scene: '抽象語が能力要件になる',
        body: '臨機応変や体力が曖昧な壁になる。',
        icon: BriefcaseBusiness,
      },
      {
        scene: '作業・時間・環境に分ける',
        body: '求人や体験を条件に翻訳する。',
        icon: Route,
      },
      {
        scene: '採用後へ引き継げる',
        body: '見学、体験、相談線が仕事につながる。',
        icon: HeartHandshake,
      },
    ],
  },
  rebuilt_unit_worksite_contact_task_safety_tools: {
    icon: Map,
    conclusion: '情報・動線・道具・安全を、仕事の接点として整える。',
    levels: [
      {
        scene: '接点で参加が止まる',
        body: '移動、道具、姿勢、安全で仕事に入れない。',
        icon: Map,
      },
      {
        scene: '消耗や不安が繰り返す',
        body: '担当できる仕事が少しずつ狭まる。',
        icon: Train,
      },
      {
        scene: '動線・道具・休憩を分ける',
        body: '接触点ごとに直せる条件を見る。',
        icon: Laptop,
      },
      {
        scene: '安全に止める基準がある',
        body: '無理をしないで続ける手順がある。',
        icon: Shield,
      },
    ],
  },
  rebuilt_unit_support_retranslation_continuity_network: {
    icon: HeartHandshake,
    conclusion: '支援を仕事条件へ翻訳し直す役割が、本人説明の負荷を下げる。',
    levels: [
      {
        scene: '支援と職場が別々に動く',
        body: '本人が全部を説明する状態になる。',
        icon: UsersRound,
      },
      {
        scene: '相談先はあるが変化に届かない',
        body: '誰が何を変えるかが曖昧なまま残る。',
        icon: MessagesSquare,
      },
      {
        scene: '言葉と条件を翻訳する',
        body: '医療・生活・職場の情報をつなぐ。',
        icon: Network,
      },
      {
        scene: '戻り回路が用意される',
        body: '悪化、復職、変更時に再調整できる。',
        icon: HeartHandshake,
      },
    ],
  },
  rebuilt_unit_role_value_growth_quality_loop: {
    icon: Network,
    conclusion: '定着だけでなく、役割・評価・成長まで参加の質として設計する。',
    levels: [
      {
        scene: '続いているだけになる',
        body: '価値、処遇、学びが閉じていく。',
        icon: BriefcaseBusiness,
      },
      {
        scene: '低評価や役割固定が反復する',
        body: '安定の代わりに将来像が狭まる。',
        icon: CalendarDays,
      },
      {
        scene: '成果と調整条件を分ける',
        body: '評価できる形へ仕事を見直す。',
        icon: SearchCheck,
      },
      {
        scene: '育つ道と選び直す道がある',
        body: '役割、賃金、学び、希望を更新できる。',
        icon: Lightbulb,
      },
    ],
  },
  rebuilt_unit_source_lens_universal_structure_boundary_guard: {
    icon: SearchCheck,
    conclusion: '一つの資料に引きずられず、多様性から全体像をつくる。',
    levels: [
      {
        scene: '一つの見え方で一般化する',
        body: '制度、時代、障害種類の違いが消える。',
        icon: FileSearch,
      },
      {
        scene: '多数データが全体を覆う',
        body: '少数でも重要な条件が埋もれる。',
        icon: Layers3,
      },
      {
        scene: '資料ごとの光を分ける',
        body: 'どこまで言えるかを見える化する。',
        icon: SearchCheck,
      },
      {
        scene: '共通構造と保留を分ける',
        body: '普遍化できることと確認が必要なことを並べる。',
        icon: ShieldCheck,
      },
    ],
  },
};

const workDesignGeneratedCardAssetsByUnit: Record<
  string,
  { src: string; alt: string; caption: string }
> = {
  rebuilt_unit_fluctuating_health_time_work_density: {
    src: workDesignGeneratedVisualAssets.healthTime.src,
    alt: workDesignGeneratedVisualAssets.healthTime.alt,
    caption: '体調の波を、仕事の時間設計として扱う代表カード。',
  },
  rebuilt_unit_regular_medical_monitoring_treatment_time: {
    src: workDesignGeneratedVisualAssets.treatmentTime.src,
    alt: workDesignGeneratedVisualAssets.treatmentTime.alt,
    caption: '治療・検診・回復を、勤務時間の外ではなく仕事条件として扱う代表カード。',
  },
  rebuilt_unit_sensory_information_access_communication: {
    src: workDesignGeneratedVisualAssets.informationAccess.src,
    alt: workDesignGeneratedVisualAssets.informationAccess.alt,
    caption: '音声・文字・図・会議進行を、参加できる情報形式へ変える代表カード。',
  },
  rebuilt_unit_cognitive_procedural_access_switching_load: {
    src: workDesignGeneratedVisualAssets.procedureSwitching.src,
    alt: workDesignGeneratedVisualAssets.procedureSwitching.alt,
    caption: '注意や叱責の前に、開始・切替・確認・戻り方を仕事手順として整える代表カード。',
  },
  rebuilt_unit_pre_entry_job_image_transition: {
    src: workDesignGeneratedVisualAssets.preEntryTransition.src,
    alt: workDesignGeneratedVisualAssets.preEntryTransition.alt,
    caption: '求人語や体験を、採用後にも引き継げる仕事条件へ翻訳する代表カード。',
  },
  rebuilt_unit_worksite_contact_task_safety_tools: {
    src: workDesignGeneratedVisualAssets.worksiteAccess.src,
    alt: workDesignGeneratedVisualAssets.worksiteAccess.alt,
    caption: '情報・動線・道具・安全を、仕事の接点として整える代表カード。',
  },
  rebuilt_unit_disclosure_stigma_purpose_limited_information: {
    src: workDesignGeneratedVisualAssets.disclosureEvaluation.src,
    alt: workDesignGeneratedVisualAssets.disclosureEvaluation.alt,
    caption: '話す量ではなく、目的・共有先・同意範囲を設計する代表カード。',
  },
  rebuilt_unit_support_retranslation_continuity_network: {
    src: workDesignGeneratedVisualAssets.supportContinuity.src,
    alt: workDesignGeneratedVisualAssets.supportContinuity.alt,
    caption: '本人・職場・医療生活情報・制度を、現場で動く仕事条件へつなぎ直す代表カード。',
  },
  rebuilt_unit_role_value_growth_quality_loop: {
    src: workDesignGeneratedVisualAssets.growthQuality.src,
    alt: workDesignGeneratedVisualAssets.growthQuality.alt,
    caption: '定着だけで終わらせず、役割・評価・賃金・学びを更新する代表カード。',
  },
  rebuilt_unit_source_lens_universal_structure_boundary_guard: {
    src: workDesignGeneratedVisualAssets.diverseEvidence.src,
    alt: workDesignGeneratedVisualAssets.diverseEvidence.alt,
    caption: '多数データや一つの資料に引きずられず、多様な資料から全体像を読む代表カード。',
  },
};

const workDesignConcreteItemsAssetsByUnit: Record<
  string,
  { src: string; alt: string; caption: string }
> = {
  rebuilt_unit_fluctuating_health_time_work_density: {
    src: workDesignGeneratedVisualAssets.healthTimeItems.src,
    alt: workDesignGeneratedVisualAssets.healthTimeItems.alt,
    caption: '健康時間を、症状ではなく時間・移動・回復・評価の設計項目として分ける。',
  },
  rebuilt_unit_regular_medical_monitoring_treatment_time: {
    src: workDesignGeneratedVisualAssets.treatmentTimeItems.src,
    alt: workDesignGeneratedVisualAssets.treatmentTimeItems.alt,
    caption: '治療・検診・身体管理を、勤務外の私事ではなく働くための時間条件として分ける。',
  },
  rebuilt_unit_sensory_information_access_communication: {
    src: workDesignGeneratedVisualAssets.informationAccessItems.src,
    alt: workDesignGeneratedVisualAssets.informationAccessItems.alt,
    caption: '視覚・聴覚・身体操作・非公式情報を、参加できる情報形式として分ける。',
  },
  rebuilt_unit_cognitive_procedural_access_switching_load: {
    src: workDesignGeneratedVisualAssets.procedureSwitchingItems.src,
    alt: workDesignGeneratedVisualAssets.procedureSwitchingItems.alt,
    caption: '手順、切替、確認、評価基準を、本人能力ではなく戻れる仕事手順として分ける。',
  },
  rebuilt_unit_disclosure_stigma_purpose_limited_information: {
    src: workDesignGeneratedVisualAssets.disclosureEvaluationItems.src,
    alt: workDesignGeneratedVisualAssets.disclosureEvaluationItems.alt,
    caption: '情報共有を、話す量ではなく目的・同意・評価境界として分ける。',
  },
  rebuilt_unit_pre_entry_job_image_transition: {
    src: workDesignGeneratedVisualAssets.preEntryTransitionItems.src,
    alt: workDesignGeneratedVisualAssets.preEntryTransitionItems.alt,
    caption: '就職前の仕事像、応募前条件、体験、handoffを、採用後へつながる設計項目として分ける。',
  },
  rebuilt_unit_worksite_contact_task_safety_tools: {
    src: workDesignGeneratedVisualAssets.worksiteContactItems.src,
    alt: workDesignGeneratedVisualAssets.worksiteContactItems.alt,
    caption: '職場の接触点を、作業、道具、移動、安全、人員余力、評価の設計項目として分ける。',
  },
  rebuilt_unit_support_retranslation_continuity_network: {
    src: workDesignGeneratedVisualAssets.supportContinuityItems.src,
    alt: workDesignGeneratedVisualAssets.supportContinuityItems.alt,
    caption: '支援を、本人説明で止めず、仕事条件への翻訳と戻り回路として分ける。',
  },
  rebuilt_unit_role_value_growth_quality_loop: {
    src: workDesignGeneratedVisualAssets.growthQualityItems.src,
    alt: workDesignGeneratedVisualAssets.growthQualityItems.alt,
    caption: '定着だけでなく、役割、評価、収入、学習、選び直しを働き続ける質として分ける。',
  },
  rebuilt_unit_source_lens_universal_structure_boundary_guard: {
    src: workDesignGeneratedVisualAssets.diverseEvidenceItems.src,
    alt: workDesignGeneratedVisualAssets.diverseEvidenceItems.alt,
    caption: '資料の読み方を、多数データ、歴史・国際資料、公開前の一般化ブレーキに分ける。',
  },
};

const workDesignConcreteItemDiagramSrc = (substructureId: string) =>
  `/images/axiom-work-design-guide/item-diagrams/${substructureId}-v1.png`;

const workDesignSectionImplementationPoints: Record<string, readonly string[]> = {
  rebuilt_unit_fluctuating_health_time_work_density: [
    '締切、勤務密度、体調変動、回復時間を同じ時間表に置いて見る。',
    '悪化した時に減らす仕事、戻る手順、選び直す余地を先に用意する。',
    '健康を守る行動が、収入や評価の低下として返っていないかを確認する。',
  ],
  rebuilt_unit_regular_medical_monitoring_treatment_time: [
    '透析、定期治療、検診、服薬、身体管理を勤務外の私事として外さない。',
    '固定的に動かしにくい医療時間と、変動する回復時間を分けて扱う。',
    '本人が毎回説明しなくても、勤務表や相談線に医療時間が反映される形にする。',
  ],
  rebuilt_unit_sensory_information_access_communication: [
    '情報が口頭、文字、図、音、画面、現場表示のどの経路で届いているかを見る。',
    '視覚、聴覚、身体操作、非公式な連絡を一つに混ぜず、それぞれ参加条件として分ける。',
    '「伝えたつもり」ではなく、後で確認できる記録と質問できる場を残す。',
  ],
  rebuilt_unit_cognitive_procedural_access_switching_load: [
    '開始、切替、例外対応、完了、確認のどこで止まるかを手順として分ける。',
    '急な変更やミスを本人評価へ直結させず、戻れる道具と確認先を置く。',
    '暗黙ルールや評価基準を、注意ではなく見える手順として扱う。',
  ],
  rebuilt_unit_pre_entry_job_image_transition: [
    '就職前の不安を意欲不足とせず、仕事条件を試す機会の不足として見る。',
    '応募前に、聞くこと、伝えること、試したい条件を短い言葉にする。',
    '家族、学校、支援、医療で分かったことを採用後の仕事条件へ引き継ぐ。',
  ],
  rebuilt_unit_worksite_contact_task_safety_tools: [
    '仕事を、作業、道具、動線、安全、人員余力、評価接点に分解して見る。',
    '通勤や職場内外の移動を、仕事の外ではなく働ける時間と体力の条件として扱う。',
    '安全やミスを排除理由にせず、変更できる接触点と支援体制に分ける。',
  ],
  rebuilt_unit_disclosure_stigma_purpose_limited_information: [
    '何を話すかより先に、何を変えるために共有するのかを決める。',
    '共有先、利用範囲、同意、評価との切り分けを一枚で見えるようにする。',
    '見えにくい状態やスティグマを、説明不足や本人責任へ戻さない。',
  ],
  rebuilt_unit_support_retranslation_continuity_network: [
    '本人、医療、生活、職場、制度の言葉を、仕事条件の言葉へ翻訳し直す。',
    '支援者を増やすだけでなく、誰が何をつなぐかの役割境界を置く。',
    '悪化、復職、配置換え、業務変更の後に戻れる相談線を用意する。',
  ],
  rebuilt_unit_role_value_growth_quality_loop: [
    '就職や定着で終わらせず、役割、評価、処遇、学習を見続ける。',
    '健康時間を守ることが、低い期待や役割固定に変わっていないか確認する。',
    '成長、配置転換、選び直しを、特別扱いではなく参加の質として扱う。',
  ],
  rebuilt_unit_source_lens_universal_structure_boundary_guard: [
    '件数の多いデータで、少数でも重要な条件を覆い隠していないかを見る。',
    '古い資料や海外資料を答えとしてではなく、反復する構造を照らす材料にする。',
    '発見候補、公開メッセージ、まだ言えないことを分けて表現する。',
  ],
};

const workDesignSubstructureImplementationPoints: Record<string, readonly string[]> = {
  health_time_fluctuation_relapse_and_fatigue: [
    '調子が崩れる時期と、仕事量・締切・会議が重なる時期を同じ表にする。',
    '重い作業を前後へ動かせるか、代替・一時減量・翌日の回復枠を確認する。',
  ],
  health_time_recovery_margin_and_return_route: [
    '休む、減らす、戻る、選び直す手順を、困ってからではなく平時に決める。',
    '戻った後の仕事量、役割、相談先をセットで見直す。',
  ],
  health_time_commute_and_mobility_consumption: [
    '通勤や職場外移動の前後に、どの作業へ影響が出るかを記録する。',
    '出社頻度、移動時間、休憩場所、在宅や直行直帰の余地を同じ条件として見る。',
  ],
  health_time_income_evaluation_collision: [
    '休む・通院する・仕事量を調整する行動が、評価や収入へどう返るかを確認する。',
    '健康を守る選択が罰にならない評価期間・成果の見方を置く。',
  ],
  regular_medical_time_dialysis_and_fixed_treatment: [
    '固定治療時間を勤務表の外に置かず、働ける曜日・時間帯の前提にする。',
    '治療前後の移動、疲労、回復を含めて担当業務を組む。',
  ],
  regular_medical_time_checkups_and_continuous_monitoring: [
    '検診、通院、経過観察の頻度を、繁忙期や締切と重ねて確認する。',
    '継続管理に必要な連絡・休憩・調整を、毎回のお願いにしない。',
  ],
  regular_medical_time_internal_disability_and_body_management: [
    '外から見えにくい身体管理や準備時間を、本人都合ではなく仕事前提として扱う。',
    '勤務前後、休憩中、移動後に必要な管理時間を具体的に置く。',
  ],
  sensory_access_visual_information_format: [
    '文書、画面、掲示、図表、現場表示を、見える形式・読める順序に分ける。',
    '拡大、音声化、代替テキスト、確認時間を仕事手順に入れる。',
  ],
  sensory_access_hearing_voice_meeting_information: [
    '会議、朝礼、口頭指示、雑音環境、緊急連絡を音声依存のままにしない。',
    '文字記録、発言順、要点共有、質問時間を会議設計に入れる。',
  ],
  sensory_access_body_operation_and_tool_contact: [
    '道具、端末、姿勢、作業台、操作回数を、身体操作の接触点として分ける。',
    '操作が難しい箇所を本人努力で補う前に、配置・道具・手順を変えられるか見る。',
  ],
  sensory_access_emergency_and_informal_information: [
    '雑談、声かけ、急な変更、緊急連絡が誰にどう届くかを確認する。',
    '非公式情報も、後で確認できる短い記録や共通場所に残す。',
  ],
  cognitive_access_instruction_and_procedure_format: [
    '指示を、開始条件、順番、完了基準、確認先に分けて書く。',
    '説明形式を口頭だけにせず、図、例、チェック欄、反復確認へ変える。',
  ],
  cognitive_access_switching_priority_exception_load: [
    '急な変更時に、何を止め、何を先にし、誰へ確認するかを決める。',
    '例外対応を本人の機転に任せず、分岐ルールとして見える化する。',
  ],
  cognitive_access_memory_checking_and_error_tolerance: [
    '記憶に頼る作業を、チェックリスト、ペア確認、道具で支える。',
    'ミスが起きた時の影響、戻し方、注意の仕方を先に決める。',
  ],
  cognitive_access_implicit_rules_and_evaluation_feedback: [
    '暗黙の期待値や評価基準を、行動例とフィードバック方法に変える。',
    '注意や叱責ではなく、何を変えればよいかが分かる返し方にする。',
  ],
  disclosure_purpose_limited_information_sharing: [
    '病名や詳細事情の前に、変えたい仕事条件と共有目的を書く。',
    '共有先、共有範囲、使わない用途、撤回や更新の方法を決める。',
  ],
  disclosure_invisible_condition_and_stigma: [
    '見えにくい状態を、説明不足や自己管理不足として扱わない。',
    '不安、偏見、スティグマが話しにくさを作っていないかを確認する。',
  ],
  disclosure_evaluation_and_overmanagement_risk: [
    '共有した情報が低評価、役割縮小、過剰管理に使われない境界を置く。',
    '調整のための情報と、人事評価・配置判断の情報を分ける。',
  ],
  pre_entry_no_work_experience_job_image_gap: [
    '働いた経験の少なさを準備不足とせず、仕事像を作る機会の不足として見る。',
    '見学、短時間体験、作業サンプルで、できる条件を小さく試す。',
  ],
  pre_entry_application_before_disclosure_and_condition_translation: [
    '応募前に、聞きたい条件、伝えたい条件、まだ分からない条件を分ける。',
    '開示するかどうかの前に、仕事側へ何を確認するかを言葉にする。',
  ],
  pre_entry_training_work_trial_and_experience_connection: [
    '訓練や職場体験を、単なる練習ではなく仕事条件を検証する場にする。',
    '体験で分かった条件を、採用後の手順や相談線へ引き継ぐ。',
  ],
  pre_entry_family_school_support_transition_handoff: [
    '家族、学校、支援機関、医療が持つ情報を、職場で使える条件へ翻訳する。',
    '送り出して終わりにせず、採用後に誰が何をつなぐかを決める。',
  ],
  worksite_contact_task_decomposition_and_work_density: [
    '仕事を作業量、締切、同時並行、確認、ミス許容度に分ける。',
    '負荷が高い接点を、本人能力ではなく仕事密度と手順の問題として見る。',
  ],
  worksite_contact_tools_equipment_and_environment: [
    '端末、作業台、照明、音、温度、休憩場所を仕事の接触面として点検する。',
    '道具や環境を一般改善で終わらせず、担当作業との相互作用で見る。',
  ],
  worksite_contact_internal_external_mobility_and_commute: [
    '職場内移動、職場外移動、通勤、休憩場所までの距離を同じ地図にする。',
    '移動後の疲労や時間消耗が、どの作業や役割に影響するかを見る。',
  ],
  worksite_contact_safety_risk_and_error_tolerance: [
    '安全懸念を就労可否の断定にせず、危険箇所、単独作業、支援体制に分ける。',
    'ミスが起きた時の影響と戻し方を、責める前に設計する。',
  ],
  worksite_contact_staffing_customer_and_coordination_margin: [
    '人員余力、代替要員、顧客接点、繁忙時間が調整余地を左右するかを見る。',
    '同じ配慮でも、職場規模や運用余白で実装方法が変わることを前提にする。',
  ],
  worksite_contact_evaluation_role_and_feedback_connection: [
    '配慮後の役割、成果の見え方、フィードバック方法を一緒に設計する。',
    '楽にするだけでなく、役割と評価が閉じないかを見る。',
  ],
  support_retranslation_between_person_medical_workplace_language: [
    '本人の言葉、医療の言葉、職場の言葉を、作業・時間・情報形式へ翻訳する。',
    '診断名や症状説明で止めず、職場で変えられる条件へ落とす。',
  ],
  support_handoff_role_boundary_and_continuity: [
    '誰が本人、職場、医療、支援機関をつなぐのかを明確にする。',
    '役割境界を曖昧にせず、つなぐ情報とつながない情報を分ける。',
  ],
  support_reconnection_after_change_worsening_or_return: [
    '悪化、復職、配置換え、業務変更の後に再相談できる入口を残す。',
    '一度決めた配慮を固定せず、変化後に更新する手順を持つ。',
  ],
  role_value_growth_role_design_after_hiring: [
    '採用後に任せる役割が、本人の価値感や成長機会とつながるかを見る。',
    '安定だけで役割を固定せず、責任や挑戦の幅を調整する。',
  ],
  role_value_growth_evaluation_and_income_fairness: [
    '健康時間を守る行動が、低評価や低処遇として返っていないかを見る。',
    '成果の見方、評価期間、賃金や役割の扱いを健康時間と両立させる。',
  ],
  role_value_growth_learning_career_and_rechoice: [
    '学習、配置転換、働き方変更、選び直しを支援の外に出さない。',
    '続けるだけでなく、育つ道と戻る道を同時に設計する。',
  ],
  source_lens_dominant_nanbyo_loading_guard: [
    '件数の多い難病データだけで全体像を代表させない。',
    '感覚、認知、内部障害、移動、就職前参加などの少数信号を別に残す。',
  ],
  source_lens_historical_international_universal_structure_probe: [
    '古い資料や海外資料を、現行日本の答えとしてそのまま使わない。',
    '制度や時代を越えて反復する構造と、適用できない部分を分ける。',
  ],
  source_lens_projection_brake_before_public_claim: [
    '発見候補をそのまま公開主張にせず、言える範囲を確認する。',
    'まだ言えないこと、追加確認が必要なこと、公開向けに言い換えることを分ける。',
  ],
};

function getWorkDesignVisualStory(section: AxiomIntegratedDomainKnowledgePageBodySection) {
  const fallback: WorkDesignVisualStory = {
    icon: Map,
    conclusion: '問題をほどき、仕事条件として設計し直す。',
    levels: [
      { scene: '参加が止まる', body: '困りごとが続いている。', icon: Shield },
      { scene: '同じ支障が反復する', body: '同じ場所で詰まりが起きる。', icon: CalendarDays },
      { scene: '条件に分ける', body: '変えられる部分を見つける。', icon: SearchCheck },
      { scene: '予防して続ける', body: '戻れる設計を置く。', icon: ShieldCheck },
    ],
  };

  return workDesignVisualStories[section.sourceRebuiltUnitId] ?? fallback;
}

type WorkDesignDomain = {
  id: string;
  label: string;
  title: string;
  shortTitle: string;
  lead: string;
  signal: string;
  aim: string;
  sectionIds: readonly string[];
  icon: LucideIcon;
  panelClass: string;
  badgeClass: string;
  railClass: string;
};

const workDesignDomains: readonly WorkDesignDomain[] = [
  {
    id: 'pre-entry-transition',
    label: '設計領域 A',
    title: '就職前・入口・移行を設計する',
    shortTitle: '入口と移行',
    lead: '求人、職場体験、面接、復職、移行支援を、採用前の不安や表層条件で止めず、仕事条件を試せる入口に変える領域です。',
    signal: '応募前から、仕事像や必要条件が曖昧なまま狭まる。',
    aim: '求人語、体験、引継ぎ、復職後の手順まで、参加前から試せる形にする。',
    sectionIds: ['rebuilt_unit_pre_entry_job_image_transition'],
    icon: Route,
    panelClass: 'border-sky-200 bg-sky-50',
    badgeClass: 'bg-sky-100 text-sky-950',
    railClass: 'bg-sky-500',
  },
  {
    id: 'health-time-livelihood',
    label: '設計領域 B',
    title: '健康時間・生活保障・仕事密度を設計する',
    shortTitle: '健康時間',
    lead: '体調変動、治療、回復、通勤、収入不安、評価時期を、本人の不安定さではなく仕事の時間設計として扱う領域です。',
    signal: '健康を守るほど、締切、収入、評価、役割が崩れる。',
    aim: '働く時間、回復する時間、治療の時間、戻る道筋を同じ時間軸で設計する。',
    sectionIds: [
      'rebuilt_unit_fluctuating_health_time_work_density',
      'rebuilt_unit_regular_medical_monitoring_treatment_time',
    ],
    icon: BrainCircuit,
    panelClass: 'border-emerald-200 bg-emerald-50',
    badgeClass: 'bg-emerald-100 text-emerald-950',
    railClass: 'bg-emerald-500',
  },
  {
    id: 'worksite-access-operations',
    label: '設計領域 C',
    title: '情報・手順・接触点を設計する',
    shortTitle: '職場アクセス',
    lead: '視覚・聴覚などの情報アクセス、認知的な手順理解、職場内外の移動、道具、安全を、職場で実際に使う接点として整える領域です。',
    signal: '働ける力はあるのに、情報形式、手順、移動、道具の接点で止まる。',
    aim: '情報が届き、手順に戻れ、移動・道具・安全が仕事の仕様として扱われる。',
    sectionIds: [
      'rebuilt_unit_sensory_information_access_communication',
      'rebuilt_unit_cognitive_procedural_access_switching_load',
      'rebuilt_unit_worksite_contact_task_safety_tools',
    ],
    icon: Map,
    panelClass: 'border-violet-200 bg-violet-50',
    badgeClass: 'bg-violet-100 text-violet-950',
    railClass: 'bg-violet-500',
  },
  {
    id: 'relationship-evaluation-growth',
    label: '設計領域 D',
    title: '開示・評価・役割・成長を設計する',
    shortTitle: '評価と成長',
    lead: '何を共有し、何を共有しないか、どう評価し、どう役割や成長につなぐかを、善意や理解だけに預けない領域です。',
    signal: '配慮はあるが、評価、処遇、役割、将来像が閉じていく。',
    aim: '目的限定の情報共有と、成果・役割・成長を両立させる評価運用を作る。',
    sectionIds: [
      'rebuilt_unit_disclosure_stigma_purpose_limited_information',
      'rebuilt_unit_role_value_growth_quality_loop',
    ],
    icon: Network,
    panelClass: 'border-amber-200 bg-amber-50',
    badgeClass: 'bg-amber-100 text-amber-950',
    railClass: 'bg-amber-500',
  },
  {
    id: 'support-institution-learning',
    label: '設計領域 E',
    title: '支援・制度・知識更新を設計する',
    shortTitle: '支援と制度',
    lead: '本人、職場、医療・福祉・教育、行政、研究、制度情報を、現場で使える仕事条件へ翻訳し直す領域です。',
    signal: '支援や情報は多いのに、誰が何を変えるのかに届かない。',
    aim: '支援の引き継ぎ、制度差、情報源の偏り、まだ確認が必要なことを分けて、知識を見直せる。',
    sectionIds: [
      'rebuilt_unit_support_retranslation_continuity_network',
      'rebuilt_unit_source_lens_universal_structure_boundary_guard',
    ],
    icon: Layers3,
    panelClass: 'border-teal-200 bg-teal-50',
    badgeClass: 'bg-teal-100 text-teal-950',
    railClass: 'bg-teal-500',
  },
] as const;

const workDesignDomainSectionId = (domainId: string) => `work-design-domain-${domainId}`;
const workDesignTopicSectionId = (sectionId: string) => `work-design-topic-${sectionId}`;

const workDesignPremiseMoves = [
  {
    title: '対応',
    body: 'いま止まっている参加を、時間、情報、手順、評価、支援の条件に分ける。',
    icon: ClipboardList,
  },
  {
    title: '早期発見',
    body: '同じ衝突が繰り返される前に、どの接点で詰まり始めるかを見る。',
    icon: SearchCheck,
  },
  {
    title: '予防',
    body: '破綻してから個別対応するのではなく、先に戻り方と相談線を置く。',
    icon: ShieldCheck,
  },
  {
    title: '成長',
    body: '続けるだけで終わらせず、役割、評価、学び、選び直しへつなぐ。',
    icon: Network,
  },
] as const;

function WorkDesignDomainTileGrid({
  guideSections,
}: {
  guideSections: readonly AxiomIntegratedDomainKnowledgePageBodySection[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {workDesignDomains.map((domain) => {
        const Icon = domain.icon;
        const sectionCount = guideSections.filter((section) =>
          domain.sectionIds.includes(section.sourceRebuiltUnitId),
        ).length;
        return (
          <a
            aria-label={`${domain.title}へ移動`}
            className={`group relative min-h-[230px] overflow-hidden rounded-lg border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 ${domain.panelClass}`}
            href={`#${workDesignDomainSectionId(domain.id)}`}
            key={domain.id}
          >
            <span className={`absolute left-0 top-0 h-full w-1 ${domain.railClass}`} />
            <div className="relative z-10">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950 shadow-sm">
                <Icon size={21} />
              </div>
              <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-slate-500">
                {domain.label}
              </p>
              <h3 className="mt-2 break-words text-[17px] font-semibold leading-snug text-slate-950 [overflow-wrap:anywhere]">
                {domain.title}
              </h3>
              <p
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${domain.badgeClass}`}
              >
                {domain.shortTitle}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{domain.aim}</p>
              <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {sectionCount}論点
              </p>
            </div>
            <div className="absolute bottom-3 right-3 grid h-14 w-14 place-items-center rounded-full bg-white/70 text-slate-500 transition group-hover:bg-white group-hover:text-teal-800">
              <ArrowRight size={20} />
            </div>
          </a>
        );
      })}
    </div>
  );
}

function WorkDesignDomainTopicLinks({
  domain,
  sections,
}: {
  domain: WorkDesignDomain;
  sections: readonly AxiomIntegratedDomainKnowledgePageBodySection[];
}) {
  return (
    <div className="mt-5 rounded-lg border border-white bg-white/70 p-4">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-600">この領域の設計論点</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {sections.map((section) => (
          <a
            className="group flex min-h-[76px] items-start justify-between gap-3 rounded-lg border border-white bg-white px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            data-work-design-domain-topic-link
            href={`#${workDesignTopicSectionId(section.sectionId)}`}
            key={section.sectionId}
          >
            <span className="min-w-0">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${domain.badgeClass}`}
              >
                {section.substructureCount}項目
              </span>
              <span className="mt-2 block break-words text-sm font-semibold leading-6 text-slate-950 [overflow-wrap:anywhere]">
                {toReaderFacingText(section.headingJa)}
              </span>
            </span>
            <ArrowRight
              className="mt-1 shrink-0 text-slate-500 group-hover:text-teal-800"
              size={17}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

function WorkDesignSituationScaleStrip({
  section,
}: {
  section: AxiomIntegratedDomainKnowledgePageBodySection;
}) {
  const story = getWorkDesignVisualStory(section);
  const generatedCard = workDesignGeneratedCardAssetsByUnit[section.sourceRebuiltUnitId];

  return (
    <div className="border-t border-slate-200 bg-[#fbfaf5] p-5 md:p-6">
      <span className="sr-only">図解2｜状況レベル4コマ</span>
      {generatedCard ? (
        <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <img alt={generatedCard.alt} className="block h-auto w-full" src={generatedCard.src} />
          <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-600">
            {generatedCard.caption}
          </figcaption>
        </figure>
      ) : (
        <div className="grid gap-3 lg:grid-cols-4">
          {workDesignSituationLevels.map((level, index) => {
            const storyLevel = story.levels[index];
            const SceneIcon = storyLevel.icon;
            return (
              <article
                key={`${section.sectionId}:${level.label}`}
                className={`relative min-h-[245px] overflow-hidden rounded-lg border p-4 ${level.tone}`}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/28" />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/92 text-base font-semibold text-slate-950 shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <span className="block text-xs font-semibold opacity-70">場面 {index + 1}</span>
                    <span className="block text-sm font-semibold">{level.label}</span>
                  </div>
                </div>

                <div className="relative z-10 mt-4 rounded-lg bg-white/82 p-4 text-slate-950 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f3eadb] text-slate-900">
                      <SceneIcon size={22} />
                    </span>
                    <div>
                      <p className="text-base font-semibold leading-6">{storyLevel.scene}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{storyLevel.body}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-teal-700"
                      style={{ width: `${25 + index * 25}%` }}
                    />
                  </div>
                </div>

                <p className="relative z-10 mt-4 text-sm font-semibold leading-6 opacity-90">
                  {level.title}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WorkDesignMasterMap() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-[330px] px-0 py-14 md:max-w-7xl md:px-5 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              このガイドの前提
            </p>
            <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
              障害者雇用の知見を、これからの仕事設計へ。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              多くの人が感じる漠然とした生きづらさや働きづらさの奥には、狭い「標準的な職業人」像へ人を押し込む構造があります。障害や難病の就労問題は、その無理が以前からはっきり現れてきた領域です。
            </p>
          </div>

          <div className="min-w-0">
            <div className="grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
                <p className="font-semibold text-slate-950">連続した課題として見る</p>
                <p className="mt-2">
                  「障害者の職業問題」、多くの人のストレス、雇用管理負担は、別々ではなく連続しています。
                </p>
              </div>
              <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
                <p className="font-semibold text-slate-950">仕事の意味が変わる時代の設計知にする</p>
                <p className="mt-2">
                  障害や病気への対応で見えてきた知見を、人間の多様性を前提にした仕事・社会参加の再設計へ使います。
                </p>
              </div>
            </div>
            <div className="mt-5 border-l-4 border-amber-500 bg-[#fff8e8] py-4 pl-4 pr-3">
              <p className="text-sm font-semibold text-slate-950">
                個人の問題ではなく、仕事条件の設計へ。
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {workDesignPremiseMoves.map((move) => {
                  const Icon = move.icon;
                  return (
                    <div className="flex gap-3" key={move.title}>
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-amber-800 shadow-sm">
                        <Icon size={17} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold leading-6 text-slate-950">
                          {move.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">
                          {move.body}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkDesignConcreteItemsPanel({
  section,
  domain,
  substructures,
}: {
  section: AxiomIntegratedDomainKnowledgePageBodySection;
  domain: WorkDesignDomain;
  substructures: readonly AxiomAllLayerRebuiltReviewSubstructure[];
}) {
  const itemsAsset = workDesignConcreteItemsAssetsByUnit[section.sourceRebuiltUnitId];
  const readerFacingItems = substructures.map((substructure) => ({
    ...toReaderFacingWorkDesignSubstructure(substructure),
    substructureId: substructure.substructureId,
    points: workDesignSubstructureImplementationPoints[substructure.substructureId] ?? [
      toReaderFacingText(substructure.inferenceFocusJa),
    ],
  }));

  return (
    <section className="border-t border-slate-200 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">具体設計項目と設計ポイント</p>
          <p className="mt-1 text-sm leading-7 text-slate-600">
            一枚のまとめボードで見る代わりに、項目ごとに分けて、説明と設計ポイントを同じ場所で読みます。
            {itemsAsset ? ` ${itemsAsset.caption}` : ''}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {section.substructureCount}項目
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {readerFacingItems.map((item, index) => (
          <article
            className="grid gap-4 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4"
            data-work-design-item-point-card
            key={item.substructureId}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${domain.railClass}`} />
              <div>
                <h5 className="text-lg font-semibold leading-7 text-slate-950 md:text-xl md:leading-8">
                  {toWorkDesignPointHeading(item.labelJa, item.substructureId)}
                </h5>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.inferenceFocusJa}</p>
              </div>
            </div>

            <figure
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              data-work-design-item-image-diagram
            >
              <img
                alt={`具体設計項目、${item.labelJa}。${item.inferenceFocusJa}`}
                className="block h-auto w-full bg-[#f8f4e8]"
                loading="lazy"
                src={workDesignConcreteItemDiagramSrc(item.substructureId)}
              />
              <figcaption className="sr-only">
                具体設計項目 {index + 1}: {item.labelJa}
              </figcaption>
            </figure>

            <ul className="mt-3 grid gap-2">
              {item.points.map((point) => (
                <li
                  className="flex gap-2 text-sm leading-7 text-slate-700"
                  data-work-design-item-point
                  key={point}
                >
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkDesignPerspectiveShiftPanel({
  section,
}: {
  section: AxiomIntegratedDomainKnowledgePageBodySection;
}) {
  const scale = axiomWorkDesignSituationScales[section.sourceRebuiltUnitId];
  const story = getWorkDesignVisualStory(section);
  const sectionPoints = workDesignSectionImplementationPoints[section.sourceRebuiltUnitId] ?? [
    toReaderFacingText(section.readerFacingSummaryJa),
  ];

  return (
    <div
      className="mt-5 border-l-4 border-teal-700 bg-[#fbfaf5] py-4 pl-4 pr-3"
      data-work-design-perspective-comparison
    >
      <p className="text-sm font-semibold text-slate-950">視点転換のポイント</p>
      <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-700">
        <p>
          問題状況は固定ではなく、
          {scale?.axis ? (
            <>
              <span className="font-semibold text-slate-950">{scale.axis}</span>を分けて設計すると
            </>
          ) : (
            '条件を分けて設計すると'
          )}
          変わります。図解2は、その変化を「破綻・停止」から「安定・予防」へ動く流れとして読みます。
          {story.conclusion}
        </p>
        <p>
          <span className="font-semibold text-rose-900">詰まり・古い読み: </span>
          {scale?.high ?? '同じ支障が、本人の努力や周囲の個別対応として繰り返される。'}{' '}
          本人の努力、診断名、配慮名、職場の善意だけで考えてしまう。
        </p>
        <p>
          <span className="font-semibold text-teal-900">設計・設計の読み: </span>
          {scale?.stable ?? '続ける、戻る、育つために必要な条件を仕事の側へ置く。'}{' '}
          {toReaderFacingText(section.changesReadingJa[0] ?? section.readerFacingSummaryJa)}
        </p>
        <div className="rounded-lg border border-teal-100 bg-white/80 p-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-teal-900">
            この論点で見るポイント
          </p>
          <ul className="mt-3 grid gap-2">
            {sectionPoints.map((point, index) => (
              <li
                className="grid grid-cols-[auto_1fr] gap-3 rounded-md bg-teal-50/70 px-3 py-2 text-sm leading-7 text-slate-700"
                data-work-design-section-point
                key={point}
              >
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-800 text-[11px] font-semibold leading-none text-white">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function WorkDesignGuidePublicContent({
  pageBody,
}: {
  pageBody: AxiomIntegratedDomainKnowledgePageBody;
}) {
  const guideSections = pageBody.bodySections;
  const representedSubstructureCount = new Set(
    guideSections.flatMap((section) => section.sourceSubstructureIds),
  ).size;
  const sectionsByDomain = workDesignDomains.map((domain) => ({
    domain,
    sections: guideSections.filter((section) =>
      domain.sectionIds.includes(section.sourceRebuiltUnitId),
    ),
  }));

  return (
    <>
      <WorkDesignMasterMap />

      <section className="border-y border-slate-200 bg-[#f7f3e8]">
        <div className="mx-auto max-w-[330px] px-0 py-14 md:max-w-7xl md:px-5 md:py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                5つの設計領域
              </p>
              <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                5つの入口から、詳しい設計カードへ。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700">
                どの領域から読んでも、目標は同じです。関係者が、変えられる条件とまだ確認が必要な条件を分けて話せる状態を作ります。
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              {workDesignDomains.length}領域 / {guideSections.length}論点 /{' '}
              {representedSubstructureCount}項目
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">5つの設計領域へ進む</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  近い領域から読んで構いません。必要なところだけ使えるガイドです。
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                5領域 / {guideSections.length}論点 / {representedSubstructureCount}項目
              </p>
            </div>
            <WorkDesignDomainTileGrid guideSections={guideSections} />
          </div>

          <div className="mt-10 grid gap-6">
            {sectionsByDomain.map(({ domain, sections }) => {
              return (
                <section
                  className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  id={workDesignDomainSectionId(domain.id)}
                  key={domain.id}
                >
                  <div className={`border-b border-slate-200 p-5 md:p-6 ${domain.panelClass}`}>
                    <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${domain.badgeClass}`}
                          >
                            {domain.label}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                            {sections.length}設計論点
                          </span>
                        </div>
                        <h3 className="mt-4 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                          {domain.title}
                        </h3>
                        <p className="mt-4 text-base leading-8 text-slate-700">{domain.lead}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-white bg-white/82 p-4">
                          <p className="text-xs font-semibold tracking-[0.16em] text-rose-900">
                            起きやすいこと
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{domain.signal}</p>
                        </div>
                        <div className="rounded-lg border border-white bg-white/82 p-4">
                          <p className="text-xs font-semibold tracking-[0.16em] text-teal-900">
                            設計すること
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{domain.aim}</p>
                        </div>
                      </div>
                    </div>
                    <WorkDesignDomainTopicLinks domain={domain} sections={sections} />
                  </div>

                  <div className="grid gap-6 p-5 md:p-6">
                    {sections.map((section) => {
                      const substructures = section.sourceSubstructureIds
                        .map((substructureId) => integratedSubstructureById.get(substructureId))
                        .filter(
                          (
                            substructure,
                          ): substructure is NonNullable<
                            ReturnType<typeof integratedSubstructureById.get>
                          > => substructure !== undefined,
                        );
                      return (
                        <article
                          className="scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                          id={workDesignTopicSectionId(section.sectionId)}
                          key={section.sectionId}
                        >
                          <div className="p-5 md:p-6">
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${domain.badgeClass}`}
                              >
                                {domain.shortTitle}
                              </span>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                具体設計項目 {section.substructureCount}
                              </span>
                            </div>
                            <h4 className="mt-4 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
                              {toReaderFacingText(section.headingJa)}
                            </h4>
                            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
                              {toReaderFacingText(section.readerFacingSummaryJa)}
                            </p>
                            <WorkDesignPerspectiveShiftPanel section={section} />
                          </div>

                          <WorkDesignSituationScaleStrip section={section} />
                          <WorkDesignConcreteItemsPanel
                            domain={domain}
                            section={section}
                            substructures={substructures}
                          />
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[330px] px-0 py-14 md:max-w-7xl md:px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              このガイドを使う人
            </p>
            <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
              立場が違っても、同じ設計地図で話せるようにする
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workDesignAudienceUses.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5"
              >
                <Map className="text-teal-800" size={20} />
                <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WorkConditionCategoryCard({
  category,
  index,
}: {
  category: WorkConditionCategoryEntry;
  index: number;
}) {
  const Icon = category.icon;

  return (
    <article
      className={`scroll-mt-24 overflow-hidden rounded-2xl border bg-gradient-to-br shadow-sm ${category.accentClass}`}
      data-work-condition-category-card
      id={`condition-window-${category.id}`}
    >
      <div className="grid lg:grid-cols-[0.76fr_1.24fr]">
        <div className="lg:self-start">
          <header className="relative overflow-hidden bg-slate-950 p-5 text-white md:p-6 lg:rounded-br-2xl">
            <Icon
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-8 text-white/7"
              size={160}
              strokeWidth={1.4}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-teal-900 shadow-sm">
                  <Icon size={22} />
                </span>
              </div>
              <h3
                className="mt-6 text-3xl font-semibold leading-tight tracking-normal text-white md:text-4xl"
                data-work-condition-category-title
              >
                {category.title}
              </h3>
              <p className="mt-4 text-base font-semibold leading-8 text-white/88">
                {category.subtitle}
              </p>
            </div>
          </header>

          <aside className="p-5 md:p-6">
            <div className="rounded-xl border border-white bg-white/82 p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-teal-900">
                まず知っておきたいこと
              </p>
              <p className="text-[17px] font-semibold leading-9 text-slate-950">
                {category.firstUnderstanding}
              </p>
              <div className="mt-4 rounded-lg border border-teal-100 bg-teal-50 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-teal-900">
                  職場設計で見ること
                </p>
                <p className="mt-2 text-sm font-semibold leading-7 text-slate-800">
                  {category.designBridge}
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{category.overview}</p>
            </div>
          </aside>
        </div>

        <div className="bg-white/72 p-5 md:p-6">
          <div
            className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch"
            data-work-condition-flow-card
          >
            <section className="rounded-xl border border-rose-100 bg-rose-50/80 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-rose-900 shadow-sm">
                  <X size={15} />
                </span>
                <p className="text-xs font-semibold tracking-[0.16em] text-rose-900">
                  ここで止まりやすい
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{category.easyToSee}</p>
            </section>

            <div className="grid place-items-center text-slate-500">
              <span className="hidden rounded-full bg-white p-2 shadow-sm lg:block">
                <ArrowRight size={18} />
              </span>
              <span className="rounded-full bg-white p-2 shadow-sm lg:hidden">
                <ArrowRight className="rotate-90" size={18} />
              </span>
            </div>

            <section className="rounded-xl border border-teal-100 bg-teal-50 p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-teal-900 shadow-sm">
                  <Route size={15} />
                </span>
                <p className="text-xs font-semibold tracking-[0.16em] text-teal-900">
                  仕事条件に変える
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{category.workConditionRead}</p>
            </section>
          </div>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-slate-950">確認する仕事条件</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {category.lenses.length}項目
              </span>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {category.lenses.map((lens, lensIndex) => (
                <div
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[#fbfaf5] px-3 py-2 text-sm font-semibold leading-6 text-slate-800"
                  key={lens}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-950 text-[11px] font-semibold text-white">
                    {lensIndex + 1}
                  </span>
                  <span>{lens}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">職場で起きやすい場面</p>
              <div className="mt-3 grid gap-2">
                {category.scenes.map((scene, sceneIndex) => (
                  <div
                    className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-slate-200 bg-[#fbfaf5] p-3"
                    key={scene}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-teal-900 shadow-sm">
                      {sceneIndex + 1}
                    </span>
                    <p className="text-sm leading-7 text-slate-700">{scene}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">次に確認する問い</p>
              <div className="mt-3 grid gap-2">
                {category.questions.map((question) => (
                  <div className="flex gap-3 rounded-lg bg-teal-50 p-3" key={question}>
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-800" />
                    <p className="text-sm leading-7 text-slate-700">{question}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white/88 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                この入口からつながる読み方
              </p>
              <div className="flex flex-wrap gap-2">
                {category.nextUse.map((item) => (
                  <span
                    className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

function WorkConditionWindowPublicContent() {
  return (
    <>
      <section className="bg-[#fbfaf5]" id="condition-window-categories">
        <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
          <h2 className="sr-only">障害種類・疾病名から見る入口</h2>
          <nav aria-label="障害種類・疾病名から見るカテゴリ">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-9">
              {workConditionCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <a
                    className="group flex min-h-[112px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md"
                    data-work-condition-entry-link
                    href={`#condition-window-${category.id}`}
                    key={category.id}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-teal-900 transition group-hover:bg-teal-900 group-hover:text-white">
                        <Icon size={17} />
                      </span>
                    </span>
                    <span className="mt-4 text-sm font-semibold leading-6 text-slate-950">
                      {category.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>

          <div className="mt-8 grid gap-8">
            {workConditionCategories.map((category, index) => {
              return (
                <WorkConditionCategoryCard category={category} index={index} key={category.id} />
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
                職場設計として深める
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
                障害種類から見えた条件を、相談・設計・記事・素材へつなぐ。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700">
                それぞれの障害種類で見えた時間、情報、動線、手順、評価、支援の条件を、より具体的な相談、設計、場面共有、論考、ツールへ展開します。
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {workConditionRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  className="group flex h-full flex-col rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 transition hover:-translate-y-0.5 hover:border-teal-700 hover:bg-white hover:shadow-md"
                  href={candidatePath(route.slug)}
                  key={route.slug}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal-900 shadow-sm">
                      {route.label}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white">
                      <Icon size={18} />
                    </span>
                  </span>
                  <span className="mt-5 text-lg font-semibold leading-7 tracking-normal text-slate-950">
                    {route.title}
                  </span>
                  <span className="mt-3 grow text-sm leading-7 text-slate-700">{route.body}</span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                    開く
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function TheoryMethodTrustPublicContent() {
  return (
    <>
      <section className="bg-[#fbfaf5]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              NBLが扱う難しさ
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
              人間の多様性は、単純な支援メニューでは扱えない。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
              障害者雇用や難病就労支援の課題は、本人の状態、仕事の設計、環境、支援、時間、制度が絡み合って起きます。NBLは、この複雑さを減らすのではなく、扱える形にするためのサイトです。
            </p>
            <p className="mt-4 rounded-lg border border-teal-100 bg-white p-4 text-sm font-semibold leading-7 text-slate-800 shadow-sm">
              NBLが目指す専門知識は、AIが最終判断をするためのものではありません。人間には重すぎる相互作用を、尊厳を損なわずに扱える形へ読み替え、よりよい問い、仮説、確認順序、説明の形を作るための知識の地図です。
            </p>
          </div>

          <div className="grid gap-4">
            {theoryMethodProblemCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6"
                  key={card.title}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-900">
                      <Icon size={21} />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-normal text-slate-950">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-slate-700">{card.body}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                二層の専門知識
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
                読み方の専門知識こそ、NBLの専門性の土台です。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
                NBLサイトで見えている相談事例、設計ガイド、記事、図解は、読み取った専門知識の提供面です。その前に、障害や病気の情報を、人の問題、職場の責任、制度名の答え、検索結果の要約へ閉じないための基礎専門性があります。
              </p>
              <p className="mt-4 rounded-lg border border-teal-100 bg-[#eff7f4] p-4 text-sm font-semibold leading-7 text-slate-800">
                この第一層があるから、大量の資料とAIの読解力を、偏見の再生産ではなく、よりよい問いと仕事・社会参加設計へ向けられます。
              </p>
            </div>

            <div>
              <div className="grid gap-4 md:grid-cols-2">
                {theoryMethodKnowledgeLayerCards.map((layer) => (
                  <article
                    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-[#fbfaf5] p-5 shadow-sm md:p-6"
                    key={layer.title}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                      {layer.label}
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold leading-8 tracking-normal text-slate-950">
                      {layer.title}
                    </h3>
                    <p className="mt-4 text-base leading-8 text-slate-700">{layer.body}</p>
                    <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-700">
                      {layer.points.map((point) => (
                        <li
                          className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                          key={point}
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {theoryMethodFoundationCards.map((card) => (
                  <article
                    className="rounded-lg border border-teal-100 bg-white p-4 shadow-sm"
                    key={card.title}
                  >
                    <h3 className="text-base font-semibold leading-7 tracking-normal text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              どう可能にするか
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
              第一層では、AIの読解力を「断定」ではなく仮説づくりに使う。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
              AIを検索や要約だけに使いません。断片的で偏りを含む情報を、人、仕事、環境、支援、時間、制度の相互作用として置き直し、仮説、反対仮説、足りない文脈、まだ言えないことを分けるために使います。ここに、NBLの基礎専門性があります。
            </p>
          </div>

          <figure className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-[#fbfaf5] shadow-sm">
            <img
              alt="調査データ、ワークショップ記録、実務資料、制度政策資料、国内外の公開情報を相互作用として読み、多様な専門知識ネットワークを作ってから場面、相談事例、設計ガイド、記事、図解ツールへ活用する流れを示す図解"
              className="block h-auto w-full"
              src="/images/next-nbl-knowledge-network-method-v3.png"
            />
            <figcaption className="border-t border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700">
              重要なのは、知識を作る材料と、知識を使う場面を混ぜないことです。調査データ、ワークショップ記録、実務資料、制度・政策資料、国内外の公開情報から専門知識ネットワークを作り、その後に、場面、相談事例、設計ガイド、記事、図解・ツールとして活用します。
            </figcaption>
          </figure>

          <div className="mt-10 grid gap-4">
            {theoryMethodKernelSteps.map((step) => (
              <article
                className="grid gap-4 rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 md:grid-cols-[0.32fr_1fr] md:p-6"
                key={step.title}
              >
                <h3 className="text-lg font-semibold leading-7 tracking-normal text-slate-950">
                  {step.title}
                </h3>
                <p className="text-base leading-8 text-slate-700">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eff7f4]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                専門知識ネットワーク
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
                第二層では、読み取った知識を相互作用のネットワークとして持つ。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
                読解材料には、障害者・難病患者、雇用企業、支援者・支援機関に関する国内の調査研究、NIVR等の研究資料、JEEDの障害者雇用事例・合理的配慮事例、治療と仕事の両立支援資料、各種マニュアルやガイドブック、JANやEARNなど米国の技術支援情報、英国・EU・カナダ・豪州・ドイツ等の公開情報が含まれます。
              </p>
              <p className="mt-4 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
                これらは、公式見解の代替や引用集として使うのではありません。資料が何を照らし、何を落としているかを見ながら、人、仕事、環境、支援、時間、制度の関係として読み直し、使える専門知識ネットワークへ統合します。
              </p>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xl md:p-6">
              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                {[
                  '国内調査研究',
                  'NIVR等の研究資料',
                  'JEED事例・合理的配慮事例',
                  '治療と仕事の両立支援資料',
                  '各種マニュアル・ガイド',
                  'JAN・EARN等の海外技術支援情報',
                ].map((label) => (
                  <div
                    className="rounded-lg border border-teal-100 bg-[#eff7f4] px-4 py-3 text-sm font-semibold leading-6 text-teal-950"
                    key={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  '人・体調・認知負荷',
                  '仕事量・手順・評価',
                  '環境・情報・動線',
                  '支援者・医療・制度',
                  '時間・回復・収入',
                  '仮説・反対仮説・保留',
                ].map((label) => (
                  <div
                    className="rounded-lg border border-slate-200 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold leading-6 text-slate-800"
                    key={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-slate-950 p-5 text-white">
                <p className="text-sm font-semibold tracking-[0.16em] text-teal-100">
                  このサイトの価値
                </p>
                <p className="mt-3 text-xl font-semibold leading-8 tracking-normal">
                  複雑な全体像を、読者の目的に合わせて、相談・設計・記事・図解・ツールへ翻訳する。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              人間とのインターフェイス
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
              直接チャットではなく、典型的な問いに先回りして届ける。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg md:leading-9">
              このサイトでは、利用者がAIに直接チャット相談する形を当面とりません。代わりに、よく起きるコミュニケーションの型を想定し、静的なページ、記事、図解、ツールとして前もって作ります。
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {theoryMethodInterfaceCards.map((card) => (
              <Link
                className="group flex h-full flex-col rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 transition hover:-translate-y-0.5 hover:border-teal-700 hover:bg-white hover:shadow-md"
                href={candidatePath(card.href)}
                key={card.title}
              >
                <span className="text-lg font-semibold leading-7 tracking-normal text-slate-950">
                  {card.title}
                </span>
                <span className="mt-3 grow text-sm leading-7 text-slate-700">{card.body}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                  開く
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#20251e] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-100">
              境界と運営
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
              AIを使っても、責任の境界は消さない。
            </h2>
            <p className="mt-5 text-base leading-8 text-white/78 md:text-lg md:leading-9">
              強い専門性は、複雑さを途中で小さく丸めすぎないことで生まれます。一方で、公開、個別判断、学習への反映は、AIが勝手に進めるものではありません。
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {theoryMethodBoundaryCards.map((card) => (
              <article
                className="rounded-lg border border-white/18 bg-[#fffdf7] p-5 text-slate-950"
                key={card.title}
              >
                <h3 className="text-xl font-semibold tracking-normal text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SceneEntryPublicContent() {
  return (
    <>
      <section className="border-y border-slate-200 bg-[#f7f3e8]">
        <div className="mx-auto max-w-[330px] px-0 py-16 md:max-w-7xl md:px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              Old-new problems
            </p>
            <h2 className="mt-3 break-all text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              <span className="block md:inline">8つの古くて新しい課題を、</span>
              <span className="block md:inline">仕事条件の地図へ</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              雇用率、診断名、制度、善意、検索結果など、見えやすい入口だけでは解けない問題があります。
              ここでは、その詰まりを4コマで見える形にし、本人・職場・支援者・政策検討の場が同じ仕事条件を話せる入口にします。
            </p>
          </div>

          <nav
            aria-label="8つの古くて新しい課題"
            className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
          >
            {sceneComics.map((scene, index) => (
              <a
                className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
                data-scene-showcase-selector
                href={`#scene-showcase-${scene.id}`}
                key={scene.id}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                  {String(index + 1).padStart(2, '0')} / {scene.issueLabel}
                </span>
                <span className="mt-2 block break-words text-base font-semibold leading-snug text-slate-950 [overflow-wrap:anywhere]">
                  {scene.title}
                </span>
                <span className="mt-2 block text-xs leading-6 text-slate-600">
                  {scene.subtitle}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-10 grid gap-8">
            {sceneComics.map((scene, index) => (
              <article
                className="scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                id={`scene-showcase-${scene.id}`}
                key={scene.title}
              >
                <div className="grid gap-6 border-b border-slate-200 bg-[#fbfaf5] p-5 md:p-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-teal-800">
                      課題 {index + 1} / {scene.issueLabel}
                    </p>
                    <h3 className="mt-3 break-words text-2xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
                      {scene.title}
                    </h3>
                    <p className="mt-3 text-base leading-8 text-slate-700">{scene.subtitle}</p>
                  </div>
                  <p className="rounded-lg border border-teal-100 bg-white p-4 text-sm font-semibold leading-7 text-slate-800">
                    {scene.sharedAction}
                  </p>
                </div>

                <img
                  alt={scene.alt}
                  className="w-full bg-slate-100 object-contain"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={scene.image}
                />
                <div className="sr-only">
                  <ol aria-label={`${scene.title}の4コマ説明`}>
                    {scene.panelCaptions.map((caption) => (
                      <li key={caption}>{caption}</li>
                    ))}
                  </ol>
                </div>
                <div className="grid gap-6 border-t border-slate-200 p-6 md:p-8 lg:grid-cols-[0.74fr_1.26fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      なぜ古くて新しい課題なのか
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{scene.whyThisScene}</p>
                  </div>
                  <dl className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-900">
                        止まりやすい読み
                      </dt>
                      <dd className="mt-2 text-sm leading-7 text-slate-700">
                        {scene.commonMisread}
                      </dd>
                    </div>
                    <div className="rounded-lg border border-teal-100 bg-teal-50/70 p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-900">
                        仕事条件の読み
                      </dt>
                      <dd className="mt-2 text-sm leading-7 text-slate-700">{scene.axiomRead}</dd>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-[#fff8e8] p-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
                        次に変える条件
                      </dt>
                      <dd className="mt-2 text-sm leading-7 text-slate-700">{scene.nextMove}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[330px] gap-6 px-0 py-14 md:max-w-7xl md:grid-cols-3 md:px-5">
          {[
            {
              title: '相談事例へ進む',
              body: '場面に近い相談文を選び、観察、暫定見立て、反対仮説、確認質問へ分ける。',
              slug: 'case-readings',
            },
            {
              title: '仕事設計へ進む',
              body: '場面で見えた衝突を、時間、情報、動線、手順、評価、支援接続の設計に変える。',
              slug: 'work-design-views-guide',
            },
            {
              title: 'ツールで共有する',
              body: '4コマを、面談、職場会議、研修で使える問いや一枚地図へ変換する。',
              slug: 'toolkit-studio',
            },
          ].map((item) => (
            <Link
              className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white hover:shadow-md"
              href={candidatePath(item.slug)}
              key={item.title}
            >
              <MessagesSquare className="text-teal-800" size={20} />
              <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
                続けて読む
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function ConsultationCaseReadingPublicContent() {
  const [selectedStakeholder, setSelectedStakeholder] = useState(consultationStakeholderEntries[0]);
  const [selectedTheme, setSelectedTheme] = useState(consultationFaqCategories[0]);
  const [selectedThemes, setSelectedThemes] = useState<ConsultationFaqCategory[]>([
    consultationFaqCategories[0],
  ]);
  const [selectedFragment, setSelectedFragment] = useState(
    consultationStakeholderEntries[0].fragments[0],
  );
  const [selectedCaseId, setSelectedCaseId] = useState(consultationReadingCases[0].id);
  const selectedCase = getConsultationReadingCaseById(selectedCaseId);
  const selectedThemeAssessmentEntries = selectedThemes.map((theme) => ({
    theme,
    assessment: getConsultationThemeAssessment(theme),
  }));
  const combinedSupportPlanBranches = uniqueConsultationSupportPlanBranches([
    ...selectedCase.supportPlanBranches,
    ...selectedThemeAssessmentEntries.flatMap((entry) => entry.assessment.branches),
  ]);
  const toggleConsultationTheme = (category: ConsultationFaqCategory) => {
    const isSelected = selectedThemes.some((theme) => theme.title === category.title);

    if (isSelected) {
      if (selectedThemes.length === 1) {
        return;
      }
      const nextThemes = selectedThemes.filter((theme) => theme.title !== category.title);
      const nextPrimaryTheme =
        selectedTheme.title === category.title ? nextThemes[0] : selectedTheme;
      setSelectedThemes(nextThemes);
      setSelectedTheme(nextPrimaryTheme);
      setSelectedCaseId(consultationCaseIdsByTheme[nextPrimaryTheme.title] ?? selectedCaseId);
      return;
    }

    setSelectedThemes([...selectedThemes, category]);
    setSelectedTheme(category);
    setSelectedCaseId(consultationCaseIdsByTheme[category.title] ?? selectedCaseId);
  };

  return (
    <>
      <section className="border-y border-slate-200 bg-[#efe9dc]" id="consultation-finder">
        <div className="mx-auto max-w-[330px] px-0 py-14 md:max-w-7xl md:px-5 md:py-16">
          <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-900">
                Consultation finder
              </p>
              <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
                一言を受け止めて、仕事条件の対話へ進む
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700 md:text-lg">
                相談の一言をつぶさず、立場、いま出ている言葉、具体チェックを手がかりにします。アセスメントは個人の問題を探す作業ではなく、どの条件を一緒に確認すれば支援計画が変わるかを見つけるコミュニケーションです。
              </p>

              <div className="mt-7 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  1. いまの立場
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {consultationStakeholderEntries.map((entry) => {
                    const isSelected = selectedStakeholder.stakeholder === entry.stakeholder;
                    return (
                      <button
                        aria-pressed={isSelected}
                        className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                          isSelected
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-slate-200 bg-[#fbfaf5] text-slate-700 hover:border-teal-300 hover:bg-white'
                        }`}
                        key={entry.stakeholder}
                        onClick={() => {
                          const nextThemeTitle =
                            consultationThemeTitlesByStakeholder[entry.stakeholder];
                          const nextTheme =
                            consultationFaqCategories.find(
                              (category) => category.title === nextThemeTitle,
                            ) ?? selectedTheme;
                          setSelectedStakeholder(entry);
                          setSelectedTheme(nextTheme);
                          setSelectedThemes([nextTheme]);
                          setSelectedFragment(entry.fragments[0]);
                          setSelectedCaseId(
                            consultationCaseIdsByFragment[entry.fragments[0]] ??
                              consultationCaseIdsByStakeholder[entry.stakeholder] ??
                              selectedCaseId,
                          );
                        }}
                        type="button"
                      >
                        {entry.stakeholder}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                    2. 近い一言
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {selectedStakeholder.lead}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {selectedStakeholder.fragments.map((fragment) => {
                      const isSelected = selectedFragment === fragment;
                      return (
                        <button
                          aria-pressed={isSelected}
                          className={`rounded-md border p-3 text-left text-sm leading-6 transition ${
                            isSelected
                              ? 'border-teal-700 bg-teal-50 text-slate-950'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
                          }`}
                          key={fragment}
                          onClick={() => {
                            setSelectedFragment(fragment);
                            setSelectedCaseId(
                              consultationCaseIdsByFragment[fragment] ?? selectedCaseId,
                            );
                          }}
                          type="button"
                        >
                          {fragment}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                    3. 具体チェック
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    近い領域は複数選べます。カードの説明を手がかりに、相談のどの条件を見に行くかを絞ります。
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {consultationFaqCategories.map((category) => {
                      const isSelected = selectedThemes.some(
                        (theme) => theme.title === category.title,
                      );
                      return (
                        <button
                          aria-pressed={isSelected}
                          className={`rounded-md border p-3 text-left transition ${
                            isSelected
                              ? 'border-slate-950 bg-slate-950 text-white'
                              : 'border-slate-200 bg-[#fbfaf5] text-slate-700 hover:border-teal-300 hover:bg-white'
                          }`}
                          key={category.title}
                          onClick={() => toggleConsultationTheme(category)}
                          type="button"
                        >
                          <span className="block text-sm font-semibold">{category.title}</span>
                          <span
                            className={`mt-1 block text-xs leading-5 ${isSelected ? 'text-white/72' : 'text-slate-500'}`}
                          >
                            {category.lead}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {selectedStakeholder.stakeholder}
                </span>
                {selectedThemes.map((theme) => (
                  <span
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900"
                    key={theme.title}
                  >
                    {theme.title}
                  </span>
                ))}
              </div>
              <h3 className="mt-5 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-3xl">
                この相談なら、まずこう分ける
              </h3>
              <p className="mt-4 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4 text-lg font-semibold leading-8 text-slate-950">
                「{selectedFragment}」
              </p>
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                  選択した具体チェック
                </p>
                <ul className="mt-3 grid gap-2">
                  {selectedThemes.map((theme) => (
                    <li
                      className="rounded-md border border-teal-100 bg-teal-50 px-3 py-3 text-sm leading-6 text-slate-700"
                      key={theme.title}
                    >
                      <span className="block font-semibold text-slate-950">{theme.title}</span>
                      <span className="mt-1 block text-slate-600">{theme.lead}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-5 rounded-lg border border-teal-100 bg-teal-50 p-4"
                data-consultation-assessment-flow
              >
                <p className="text-xs font-semibold tracking-[0.16em] text-teal-900">
                  アセスメントの流れ
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-5">
                  {[
                    {
                      title: '一言を残す',
                      body: selectedFragment,
                    },
                    {
                      title: '条件に分ける',
                      body: `${selectedThemes.length}領域を選択`,
                    },
                    {
                      title: '当初見立て',
                      body: '決めつけを外して広げる',
                    },
                    {
                      title: '一緒に確認',
                      body: `${combinedSupportPlanBranches.length}個の確認問い`,
                    },
                    {
                      title: '計画が変わる',
                      body: '確認結果ごとに支援案を分ける',
                    },
                  ].map((step, index) => (
                    <div
                      className="rounded-md border border-white bg-white/85 p-3"
                      key={step.title}
                    >
                      <span className="text-xs font-semibold text-teal-900">{index + 1}</span>
                      <p className="mt-1 text-sm font-semibold leading-snug text-slate-950">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{step.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                  専門家としての当初の見立て
                </p>
                <div className="mt-3 grid gap-3">
                  <div className="rounded-lg border border-rose-100 bg-rose-50/70 p-4">
                    <p className="text-sm font-semibold text-rose-900">まず外したい決めつけ</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {selectedCase.stuckReading}
                    </p>
                    <ul className="mt-3 grid gap-1.5">
                      {selectedThemeAssessmentEntries.map((entry) => (
                        <li className="text-sm leading-6 text-slate-700" key={entry.theme.title}>
                          {entry.assessment.avoid}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
                    <p className="text-sm font-semibold text-teal-900">広げて見る</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {selectedCase.workConditionReading}
                    </p>
                    <ul className="mt-3 grid gap-1.5">
                      {selectedThemeAssessmentEntries.map((entry) => (
                        <li className="text-sm leading-6 text-slate-700" key={entry.theme.title}>
                          {entry.assessment.widen}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-700">別の可能性も残す</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {selectedCase.counterHypothesis}
                    </p>
                    <ul className="mt-3 grid gap-1.5">
                      {selectedThemeAssessmentEntries.map((entry) => (
                        <li className="text-sm leading-6 text-slate-700" key={entry.theme.title}>
                          {entry.assessment.counter}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-amber-200 bg-[#fff8e8] p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-amber-900">
                  見立ての精度を上げるために、一緒に確認したいこと
                </p>
                <div className="mt-3 grid gap-3">
                  {combinedSupportPlanBranches.map((branch, index) => (
                    <div
                      className="rounded-lg border border-amber-100 bg-white p-4"
                      key={branch.condition}
                    >
                      <p className="text-xs font-semibold tracking-[0.14em] text-amber-900">
                        確認 {index + 1}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-slate-950">
                        {branch.question}
                      </p>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        <div className="rounded-md border border-slate-200 bg-[#fbfaf5] p-3">
                          <p className="text-xs font-semibold text-slate-500">見えてきたら</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {branch.condition}
                          </p>
                        </div>
                        <div className="rounded-md border border-teal-100 bg-teal-50 p-3">
                          <p className="text-xs font-semibold text-teal-900">支援計画例</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">{branch.plan}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                近い事例: <span className="font-semibold text-slate-950">{selectedCase.title}</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[330px] gap-5 px-0 py-14 md:max-w-7xl md:grid-cols-3 md:px-5">
          <article className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <SearchCheck className="text-teal-800" size={20} />
            <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
              一言から始める
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              質問がまとまっていなくても、立場、一言、具体チェックから始められます。足りない情報は、見立ての精度を上げるために一緒に確認する材料です。
            </p>
          </article>
          <Link
            className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white hover:shadow-md"
            href={candidatePath('work-design-views-guide')}
          >
            <Map className="text-teal-800" size={20} />
            <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
              設計ガイドへ進む
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              相談で見えた詰まりを、仕事・社会参加設計の地図と状況レベルへ整理します。
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
              続けて読む
              <ArrowRight size={15} />
            </span>
          </Link>
          <Link
            className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white hover:shadow-md"
            href={candidatePath('toolkit-studio')}
          >
            <Layers3 className="text-teal-800" size={20} />
            <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
              ツールで共有する
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              見立てを一枚地図、確認ワーク、面談メモに変え、関係者が同じ対象を見ながら話せるようにします。
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
              道具を見る
              <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

function HomePublicContent({ currentSlug }: { currentSlug: string }) {
  const primaryEntrances = [
    {
      slug: 'scene-entry',
      tag: '8つの課題',
      title: '古くて新しい課題を、4コマでつかむ',
      body: '雇用率、診断名、制度、善意、検索結果。そこで止まりやすい問題を、仕事条件の問いへ戻す。',
      visualWords: ['あるある', '誤読', '共通認識'],
      accentClass: 'from-amber-100 via-white to-teal-50',
      iconClass: 'bg-amber-500 text-white',
      chipClass: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      slug: 'case-readings',
      tag: '相談事例',
      title: '一言の相談を、見立てと支援計画へほどく',
      body: '短い相談をつぶさず、決めつけを外し、次に一緒に確認する条件へ進む。',
      visualWords: ['一言', '見立て', '分岐'],
      accentClass: 'from-rose-100 via-white to-amber-50',
      iconClass: 'bg-rose-500 text-white',
      chipClass: 'bg-rose-50 text-rose-900 border-rose-200',
    },
    {
      slug: 'work-design-views-guide',
      tag: '設計ガイド',
      title: '誰もが活躍できる仕事・参加設計へ',
      body: '障害や病気への対応で見えてきた知見を、これからの仕事と社会参加の設計原理として使う。',
      visualWords: ['多様性', '設計領域', '予防'],
      accentClass: 'from-teal-100 via-white to-emerald-50',
      iconClass: 'bg-teal-600 text-white',
      chipClass: 'bg-teal-50 text-teal-900 border-teal-200',
    },
    {
      slug: 'articles-social-questions',
      tag: 'NBLレポート',
      title: '社会の違和感を、読める論考へ',
      body: '現場の切実な問い、企業の迷い、支援者の翻訳負荷、政策議論を、社会に広げられる論考にする。',
      visualWords: ['問い', '論考', '共有'],
      accentClass: 'from-sky-100 via-white to-teal-50',
      iconClass: 'bg-sky-600 text-white',
      chipClass: 'bg-sky-50 text-sky-900 border-sky-200',
    },
    {
      slug: 'toolkit-studio',
      tag: 'ツールキット',
      title: '図解・音楽・素材で、共通理解をつくる',
      body: '文章だけでは届きにくい複雑な知識を、会議や研修で扱いやすい形へ変える。',
      visualWords: ['図解', '音楽', '研修'],
      accentClass: 'from-violet-100 via-white to-sky-50',
      iconClass: 'bg-violet-600 text-white',
      chipClass: 'bg-violet-50 text-violet-900 border-violet-200',
    },
    {
      slug: 'work-condition-window',
      tag: '障害種類から見る',
      title: '障害種類を、職場設計の応用問題として読む',
      body: '視覚、聴覚、肢体、内部、知的、精神、発達、高次脳、難病から、仕事条件の確認へ進む。',
      visualWords: ['種類', '条件', '応用'],
      accentClass: 'from-lime-100 via-white to-emerald-50',
      iconClass: 'bg-lime-700 text-white',
      chipClass: 'bg-lime-50 text-lime-950 border-lime-200',
    },
  ] as const;
  const howSteps = [
    {
      title: '断片とバイアスを、そのまま要約しない',
      body: '障害者雇用・就労支援、難病就労支援の情報は膨大ですが、断片的で、偏見や制度側の見方も混ざります。単純要約では、問題を再生産してしまうことがあります。',
      icon: ClipboardList,
      tag: 'Source',
    },
    {
      title: '理念を、実践できる構造へ変える',
      body: 'ICFの相互作用モデル、障害者権利条約の理念、合理的配慮などの政策概念を、本人・仕事・環境・支援・時間・評価の関係として扱います。',
      icon: BrainCircuit,
      tag: 'Frame',
    },
    {
      title: 'AIで認知負荷を下げ、人間の実践を広げる',
      body: 'AIの文脈読解を補助線に、総合的な読み、バイアス点検、問題構造の整理を進め、人が確認し、話し合い、試せる地図へ戻します。',
      icon: Map,
      tag: 'Practice',
    },
  ] as const;

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">How</p>
              <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                膨大で偏りを含む情報を、実践できる仕事条件の地図へ。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700">
                NBLは、AIに判断を任せるのではなく、人だけでは追いきれなかった文脈の重なりを読みほどき、偏見や決めつけを点検しながら、人間が確認し、共有し、設計できる形へ戻します。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-950"
                  href={candidatePath('theory-method-trust')}
                >
                  NBLの専門性
                  <ArrowRight size={16} />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                  href="/projects"
                >
                  プロジェクト
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {howSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article
                    className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                    key={step.title}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#071f1d] text-white">
                        <Icon size={19} />
                      </span>
                      <span className="rounded-full border border-teal-100 bg-white px-2.5 py-1 text-xs font-semibold text-teal-800">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-normal text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{step.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-teal-100 bg-[#eef7f4]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                What
              </p>
              <h2 className="mt-3 break-words text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                未解決の働きづらさは、
                <span className="block">仕事・社会参加設計の応用問題。</span>
              </h2>
            </div>
            <div className="rounded-lg border border-teal-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold leading-8 tracking-normal text-slate-950 md:text-2xl md:leading-10">
                問いはばらばらでも、見る地図はひとつ。
              </p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                さまざまな働きづらさは、多様な人間と社会・環境の相互作用を踏まえた仕事と社会参加の設計課題です。課題、相談、設計、レポート、図解、障害種類。どこから入っても、同じ地図へ進めます。
              </p>
            </div>
          </div>
          <figure className="mt-9 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <img
              alt={homeHeroVisual.alt}
              className="block h-auto w-full bg-[#f7f0df]"
              src={homeHeroVisual.src}
            />
          </figure>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {primaryEntrances.map((entrance) => {
              const item = publicCandidateRoutes().find((route) => route.slug === entrance.slug);
              if (!item) {
                return null;
              }
              const ContextIcon = item.context.icon;
              return (
                <Link
                  className={`group relative flex min-h-[280px] flex-col overflow-hidden rounded-lg border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${entrance.accentClass} ${
                    item.slug === currentSlug ? 'border-slate-950' : 'border-slate-200'
                  }`}
                  href={candidatePath(item.slug)}
                  key={item.routeId}
                >
                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-lg shadow-sm ${entrance.iconClass}`}
                    >
                      <ContextIcon size={19} />
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${entrance.chipClass}`}
                    >
                      {entrance.tag}
                    </span>
                  </div>
                  <h3 className="relative mt-5 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                    {entrance.title}
                  </h3>
                  <p className="relative mt-3 flex-1 text-sm leading-7 text-slate-700">
                    {entrance.body}
                  </p>
                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {entrance.visualWords.map((word, index) => (
                      <span
                        className="inline-flex items-center rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-semibold leading-5 text-slate-800 shadow-sm"
                        key={word}
                      >
                        <span className="sr-only">{index + 1}. </span>
                        {word}
                      </span>
                    ))}
                  </div>
                  <span className="relative mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal-900 group-hover:text-teal-700">
                    開く
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

type CandidateNextStep = {
  slug: string;
  title: string;
  body: string;
  label: string;
  icon: LucideIcon;
};

const smartNextStepsBySlug: Partial<Record<string, readonly CandidateNextStep[]>> = {
  'scene-entry': [
    {
      slug: 'case-readings',
      title: '自分の相談に近づけて読む',
      body: '8つの課題で見えた構造を、相談の一言、見立て、確認したい条件へほどきます。',
      label: '相談事例へ',
      icon: ClipboardList,
    },
    {
      slug: 'work-design-views-guide',
      title: '仕事・参加設計へ広げる',
      body: '古くて新しい課題を、健康時間、情報形式、評価、支援接続などの設計領域へ展開します。',
      label: '設計ガイドへ',
      icon: Network,
    },
    {
      slug: 'toolkit-studio',
      title: '会議や研修で共有する',
      body: '4コマや図解を、関係者が同じ場面を見ながら話すための素材として使います。',
      label: 'ツールへ',
      icon: Layers3,
    },
  ],
  'case-readings': [
    {
      slug: 'work-design-views-guide',
      title: '見立てを設計原則へつなぐ',
      body: '相談で見えた詰まりを、個別対応で終わらせず、仕事・社会参加設計の地図へ広げます。',
      label: '設計ガイドへ',
      icon: Network,
    },
    {
      slug: 'work-condition-window',
      title: '障害種類からも確認する',
      body: '近い障害種類・疾病名の入口から、見落としやすい仕事条件を補って確認します。',
      label: '障害種類から見る',
      icon: SearchCheck,
    },
    {
      slug: 'toolkit-studio',
      title: '相談を共有しやすくする',
      body: '図解、4コマ、チェックリストを使い、本人、職場、支援者が同じ対象を見られるようにします。',
      label: 'ツールへ',
      icon: Layers3,
    },
  ],
  'work-design-views-guide': [
    {
      slug: 'case-readings',
      title: '設計視点を相談に戻す',
      body: 'マスタープランの論点を、具体的な相談の一言と確認質問へ戻して読みます。',
      label: '相談事例へ',
      icon: ClipboardList,
    },
    {
      slug: 'articles-social-questions',
      title: '社会の問いとして深める',
      body: '仕事・参加設計の論点を、雇用の質、治療と仕事、政策・研究などの本格レポートで読みます。',
      label: 'NBLレポートへ',
      icon: FileSearch,
    },
    {
      slug: 'toolkit-studio',
      title: '設計を素材にする',
      body: '設計領域を、会議、研修、SNS、説明資料で使いやすい図解や4コマへ移します。',
      label: 'ツールへ',
      icon: Layers3,
    },
  ],
  'articles-social-questions': [
    {
      slug: 'case-readings',
      title: '論点を相談に戻す',
      body: '記事で見えた社会の問いを、本人、企業、支援者の具体的な相談へ戻して読みます。',
      label: '相談事例へ',
      icon: ClipboardList,
    },
    {
      slug: 'work-design-views-guide',
      title: '仕事・参加設計に戻す',
      body: '記事の論点を、5つの設計領域、10論点、具体設計項目へ接続します。',
      label: '設計ガイドへ',
      icon: Network,
    },
    {
      slug: 'toolkit-studio',
      title: '共有素材に変える',
      body: 'レポートの問いを、図解、4コマ、フォーラム資料、研修素材として共有します。',
      label: 'ツールへ',
      icon: Layers3,
    },
  ],
  'toolkit-studio': [
    {
      slug: 'scene-entry',
      title: '素材を課題共有に使う',
      body: '図解や4コマを、8つの古くて新しい課題を共有する入口として使います。',
      label: '8つの課題へ',
      icon: MessagesSquare,
    },
    {
      slug: 'case-readings',
      title: '素材を相談に戻す',
      body: '素材で見えた違和感を、相談の一言、確認質問、支援計画の分岐へ戻します。',
      label: '相談事例へ',
      icon: ClipboardList,
    },
    {
      slug: 'articles-social-questions',
      title: '素材の背景を読む',
      body: '図解や音楽でつかんだ論点を、NBLレポートで深く読みます。',
      label: 'NBLレポートへ',
      icon: FileSearch,
    },
  ],
  'work-condition-window': [
    {
      slug: 'case-readings',
      title: '近い相談として読む',
      body: '障害種類から見えた条件を、断片的な相談の一言としてほどきます。',
      label: '相談事例へ',
      icon: ClipboardList,
    },
    {
      slug: 'work-design-views-guide',
      title: '職場設計へ広げる',
      body: '障害種類の入口から見えた課題を、誰もが活躍できる仕事・参加設計へ広げます。',
      label: '設計ガイドへ',
      icon: Network,
    },
    {
      slug: 'theory-method-trust',
      title: 'なぜこの読み方をするか',
      body: '障害種類や病名で止めない理由を、NBLの専門性と読み方から確認します。',
      label: 'NBLの専門性へ',
      icon: BrainCircuit,
    },
  ],
  'theory-method-trust': [
    {
      slug: 'work-design-views-guide',
      title: '専門性を設計ガイドで見る',
      body: '読み方の専門性が、仕事・社会参加設計のマスタープランにどう現れるかを見ます。',
      label: '設計ガイドへ',
      icon: Network,
    },
    {
      slug: 'articles-social-questions',
      title: '社会の問いとして読む',
      body: '専門知識ネットワークが、ニュース、政策、研修、SNSの問いへどう翻訳されるかを読みます。',
      label: 'NBLレポートへ',
      icon: FileSearch,
    },
    {
      slug: 'about-boundary',
      title: '運営と責任を確認する',
      body: '運営者、問い合わせ、免責、著作権、SNS発信の扱いを確認します。',
      label: 'サイト情報へ',
      icon: ShieldCheck,
    },
  ],
  'about-boundary': [
    {
      slug: 'home',
      title: 'トップへ戻る',
      body: 'サイト全体の入口から、課題、相談、設計、レポート、ツール、障害種類へ進み直します。',
      label: 'トップへ',
      icon: Home,
    },
    {
      slug: 'theory-method-trust',
      title: 'NBLの専門性を読む',
      body: 'このサイトが単なる検索や要約ではなく、情報をどう読み替えるかを確認します。',
      label: 'NBLの専門性へ',
      icon: BrainCircuit,
    },
    {
      slug: 'articles-social-questions',
      title: 'NBLレポートへ進む',
      body: 'サイト情報を確認したうえで、社会の問いを仕事条件の論考として読みます。',
      label: 'NBLレポートへ',
      icon: FileSearch,
    },
  ],
};

function NextPagePanel({
  currentRoute,
}: {
  currentRoute: AxiomReviewedKernelBackedCandidateRoute;
}) {
  const steps = smartNextStepsBySlug[currentRoute.slug] ?? [];

  return (
    <section className="border-y border-slate-200 bg-[#f3eadb]">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Next</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 md:text-3xl">
              このページから、次に進む。
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-700">
            順番に読ませるためではなく、いまの関心に合わせて、相談、設計、記事、素材、専門性へ移れるようにしています。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700 hover:shadow-md"
                href={candidatePath(step.slug)}
                key={`${currentRoute.slug}:${step.slug}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white">
                    <Icon size={18} />
                  </span>
                  <span className="rounded-full bg-[#fbfaf5] px-3 py-1 text-xs font-semibold text-teal-900">
                    {step.label}
                  </span>
                </span>
                <span className="mt-5 block text-xl font-semibold leading-7 tracking-normal text-slate-950">
                  {step.title}
                </span>
                <span className="mt-3 block flex-1 text-sm leading-7 text-slate-700">
                  {step.body}
                </span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
                  開く
                  <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BoundaryFooter() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs leading-6 text-slate-500 md:flex-row md:items-center md:justify-between">
      <p className="font-semibold text-slate-600">Next Being Lab / 仕事条件で読む</p>
      <p>個別相談、医療・法律・人事判断、合理的配慮の最終判断は扱いません。</p>
    </footer>
  );
}

export default function AxiomNextNblPublicCandidateSiteSurface({
  routeMode = 'internal_candidate',
  slug,
}: {
  routeMode?: AxiomNextNblSiteRouteMode;
  slug: string;
}) {
  const route = getAxiomReviewedKernelBackedCandidateRouteBySlug(slug, routeMap);
  const pageBody = route ? pageBodyForRoute(route) : null;

  if (!route || !pageBody) {
    return <AxiomNextNblPublicCandidateSiteNotFound slug={slug} />;
  }

  const context = routeContext(route);
  const experience = pageExperiences[route.surface];
  const isHome = route.slug === 'home';
  const isSceneEntry = route.surface === 'scene_entry_use_cases';
  const isCaseReadings = route.surface === 'consultation_case_reading_collection';
  const isWorkDesignGuide = route.surface === 'twenty_one_views_work_design_guide';
  const isArticleLibrary = route.surface === 'article_social_question_library';
  const isToolkitStudio = route.surface === 'cognitive_support_toolkit_studio_multimodal_objects';
  const isWorkConditionWindow = route.surface === 'work_condition_window';
  const isTheoryMethodTrust = route.surface === 'theory_method_trust_page';
  const isAboutBoundary = route.surface === 'about_operating_boundary_page';

  return (
    <AxiomNextNblRouteModeContext.Provider value={routeMode}>
      <PublicCandidateShell currentRoute={route}>
        <main>
          {isHome ? (
            <HomeTopHero />
          ) : isAboutBoundary ? (
            <AboutSiteInfoHero />
          ) : (
            <CandidateHero context={context} experience={experience} pageBody={pageBody} />
          )}
          {isSceneEntry ? (
            <SceneEntryPublicContent />
          ) : isCaseReadings ? (
            <ConsultationCaseReadingPublicContent />
          ) : isWorkDesignGuide ? (
            <WorkDesignGuidePublicContent pageBody={pageBody} />
          ) : isArticleLibrary ? (
            <ArticleSocialQuestionPublicContent />
          ) : isToolkitStudio ? (
            <ToolkitStudioPublicContent />
          ) : isWorkConditionWindow ? (
            <WorkConditionWindowPublicContent />
          ) : isTheoryMethodTrust ? (
            <TheoryMethodTrustPublicContent />
          ) : isAboutBoundary ? (
            <AboutSiteInfoContent />
          ) : isHome ? (
            <HomePublicContent currentSlug={route.slug} />
          ) : (
            <>
              <ReaderPromiseBand context={context} />
              <PageExperienceSection experience={experience} />
              <DeepPageModules surface={route.surface} />
            </>
          )}
          {isHome ? null : <NextPagePanel currentRoute={route} />}
          <BoundaryFooter />
        </main>
      </PublicCandidateShell>
    </AxiomNextNblRouteModeContext.Provider>
  );
}
