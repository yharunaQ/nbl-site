import NextLink from 'next/link';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Compass,
  ClipboardList,
  Ear,
  ExternalLink,
  FileSearch,
  FileText,
  Image as ImageIcon,
  Layers3,
  Maximize2,
  MessagesSquare,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Telescope,
  Workflow,
  Wrench,
  X,
} from 'lucide-react';
import {
  nextSiteCandidateBundleIntro,
  nextSiteCandidatePages,
  type NextSiteCandidatePage,
  workDesignMapNodes,
  workDesignStudioScenarios,
} from '@/lib/falconLab/nextNblPublicSiteFixtures';
import { founderProfile } from '@/lib/content/founderProfile';
import { nextNblPublicSocialAccount } from '@/lib/falconLab/nextNblPublicSocialAccount';

const previewBase = '/preview/falcon-next-nbl';
const publicHeroImage = '/images/next-nbl-work-design-hero-v1.webp';
const publicLogicFlowImage = '/images/next-nbl-work-logic-flow-v1.webp';
const publicWorkDesignMapVisualImage = '/images/next-nbl-work-design-map-visual-v1.webp';
const publicConditionWindowHeroImage = '/images/next-nbl-condition-window-hero-v1.webp';
const publicFutureDesign21ViewMapImage = '/images/next-nbl-future-design-21-view-map-v2.png';
const publicKnowledgeNetworkTheoryImage = '/images/next-nbl-knowledge-network-theory-map-v2.webp';
const publicKnowledgeNetworkTheoryMobileImage = '/images/next-nbl-knowledge-network-theory-map-mobile-v2.webp';
const publicArticleLibraryHubImage = '/images/next-nbl-open-work-questions-article-hub-v1.webp';
const publicArticleLibraryHubMobileImage = '/images/next-nbl-open-work-questions-article-hub-mobile-v1.webp';
const publicStudioStoryboardImage = '/images/next-nbl-work-design-studio-storyboard-v1.webp';
const publicCognitiveToolkitHeroImage = '/images/next-nbl-cognitive-toolkit-hero-v3.webp';
const normalizeNextNblBasePath = (basePath: string) => {
  if (basePath === '/' || basePath === '') return '';
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
};
const NextNblRouteBaseContext = createContext(previewBase);
type RoutedLinkProps = ComponentProps<typeof NextLink>;
const rewriteNextNblHref = (
  href: RoutedLinkProps['href'],
  routeBase: string,
): RoutedLinkProps['href'] => {
  if (typeof href !== 'string') return href;

  const normalizedPreviewBase = normalizeNextNblBasePath(previewBase);
  const normalizedRouteBase = normalizeNextNblBasePath(routeBase);

  if (normalizedRouteBase === normalizedPreviewBase) return href;
  if (href === normalizedPreviewBase) return normalizedRouteBase || '/';
  if (href.startsWith(`${normalizedPreviewBase}#`)) {
    return `${normalizedRouteBase || '/'}${href.slice(normalizedPreviewBase.length)}`;
  }
  if (href.startsWith(`${normalizedPreviewBase}/`)) {
    return `${normalizedRouteBase}${href.slice(normalizedPreviewBase.length)}`;
  }

  return href;
};

function Link({ href, ...props }: RoutedLinkProps) {
  const routeBase = useContext(NextNblRouteBaseContext);
  return <NextLink href={rewriteNextNblHref(href, routeBase)} {...props} />;
}
const publicStudioScenarioImages: Record<string, { src: string; alt: string; caption: string }> = {
  'WDS-01': {
    src: '/images/next-nbl-work-design-scene-month-end-v1.webp',
    alt: '月末締切が集中する事務チームを4コマで示すマンガ',
    caption: '月末締切を、本人だけの問題ではなく、量、締切、確認、回復の条件として見る入口です。',
  },
  'WDS-02': {
    src: '/images/next-nbl-work-design-scene-procedure-change-v1.webp',
    alt: '作業手順の変更が現場に残らない場面を4コマで示すマンガ',
    caption: '手順変更を、理解力だけでなく、変更点、確認先、戻り先が仕事に残っているかとして見る入口です。',
  },
  'WDS-03': {
    src: '/images/next-nbl-work-design-scene-route-tools-v1.webp',
    alt: '動線と道具で担当範囲が狭くなる場面を4コマで示すマンガ',
    caption: '動線と道具を、できる仕事を狭める要因ではなく、参加を広げる設計条件として見る入口です。',
  },
  'WDS-04': {
    src: '/images/next-nbl-work-design-scene-disclosure-evaluation-v1.webp',
    alt: '開示範囲と評価面談が混ざる場面を4コマで示すマンガ',
    caption: '開示を、話すか話さないかの二択にせず、仕事に必要な共有範囲と評価の分離として見る入口です。',
  },
};
const articleLibraryHref = (articleId: string) =>
  `${previewBase}/policy-research?article=${articleId}#article-reader`;
const eventHubHref = '/events';
const workConditionForumHubHref = '/events/work-condition-forum#forum-top';
const workUpdateFestHref = '/resources/songs';
const publicPageHrefById = (pageId: string) => {
  const page = nextSiteCandidatePages.find((candidate) => candidate.id === pageId);
  return getNextNblPreviewHref(page ?? nextSiteCandidatePages[0]);
};

const pageVisuals: Record<
  string,
  { src: string; alt: string; tone: string; objectPosition: string }
> = {
  'NS-01': {
    src: '/images/evolution-nextbeing3.webp',
    alt: '人間とAI時代の仕事設計を表すビジュアル',
    tone: 'from-slate-950 via-slate-950/86 to-slate-950/36',
    objectPosition: 'center',
  },
  'NS-02': {
    src: '/images/evolution-nextbeing3.webp',
    alt: '仕事設計の接触点を考えるビジュアル',
    tone: 'from-emerald-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
  'NS-03': {
    src: '/images/evolution-nextbeing3.webp',
    alt: '仕事と社会の設計条件を整理するビジュアル',
    tone: 'from-amber-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
  'NS-04': {
    src: '/images/evolution-nextbeing3.webp',
    alt: '企業と支援者が仕事設計を読み直すビジュアル',
    tone: 'from-rose-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
  'NS-05': {
    src: publicArticleLibraryHubImage,
    alt: 'ニュース、SNS、制度、研究、研修現場の問いを専門知識ネットワークで関係として読み、記事、図解、相談事例、21視点、教材へ返す図解',
    tone: 'from-indigo-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
  'NS-06': {
    src: '/images/evolution-nextbeing3.webp',
    alt: '共同実装と社会参加を表すビジュアル',
    tone: 'from-teal-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
  'NS-07': {
    src: publicKnowledgeNetworkTheoryImage,
    alt: '断片情報と偏りを、ICF相互作用とAI文脈読解で専門知識ネットワークへ変換し、人間向けインターフェイスへ展開する図解',
    tone: 'from-cyan-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
  'NS-09': {
    src: publicConditionWindowHeroImage,
    alt: '障害種類・疾病名から、時間、情報、環境、動線、評価、支援の職場条件へつなぎ、相談事例集、21視点、場面、記事、ツールキットへ進む図',
    tone: 'from-teal-950 via-slate-950/88 to-slate-950/34',
    objectPosition: 'center',
  },
};

const impactRows = [
  {
    label: '支援者',
    title: 'よい支援をしたいのに、職場条件まで動かせない',
    body: '診断名、障害の種類、配慮名、制度説明で止まる場面を、仕事の接触点へ戻す。',
  },
  {
    label: '企業',
    title: '何を変えればよいのか分からず、配慮が負担感になる',
    body: '人事判断ではなく、作業、時間、情報、評価、支援の設計条件へ分ける。',
  },
  {
    label: '社会実装',
    title: '個別ノウハウはあるのに、共通の見取り図になっていない',
    body: '障害・難病就労支援の知見を、人間の多様性に耐える仕事設計へ翻訳する。',
  },
];

const shiftRows = [
  {
    before: '診断名・障害種類から配慮を探す',
    after: '仕事のどこで条件が閉じているかを見る',
  },
  {
    before: '本人の努力か、企業の負担かで考える',
    after: '人・仕事・環境・支援・時間・制度の接点で考える',
  },
  {
    before: '支援の有無で止まる',
    after: '誰が、何を、どの局面で再翻訳するかを見る',
  },
  {
    before: '雇用・定着だけで成果を見る',
    after: '役割、評価、技能形成、参加の質まで見る',
  },
];

const journeySteps = [
  {
    icon: Sparkles,
    label: '1. 見方を切り替える',
    title: '困難を本人の中だけに置かない',
    body:
      'まず、働きにくさを人・仕事・環境・支援・時間・制度の接点で見る準備をする。',
    targetId: 'NS-01',
  },
  {
    icon: Layers3,
    label: '2. 接触点を選ぶ',
    title: 'どこで条件が閉じているかを探す',
    body:
      '健康時間、情報、作業、開示、支援、評価など、最初に見る接点を決める。',
    targetId: 'NS-02',
  },
  {
    icon: MessagesSquare,
    label: '3. 場面で試す',
    title: '企業側と支援者側の読みを並べる',
    body:
      'モデル化した職場場面で、正解配慮ではなく確認すべき仕事条件を取り出す。',
    targetId: 'NS-04',
  },
  {
    icon: Route,
    label: '4. 社会へ戻す',
    title: '研修、政策、SNS、共同実装へつなぐ',
    body:
      '現場の問いを、読める教材、提案骨子、連載、共同試作へ変換する。',
    targetId: 'NS-06',
  },
];

const concreteOutputCards = [
  {
    icon: Layers3,
    label: '仕事設計マップ',
    title: '困難を「人の問題」で止めず、接触点へ戻す',
    body:
      '健康時間、情報、作業、環境、支援、開示、評価を同じ地図に置き、次に確認する問いをそろえる。',
    targetId: 'NS-02',
  },
  {
    icon: BookOpen,
    label: '未来設計21視点',
    title: '人間の多様性を、仕事と社会の設計条件として学ぶ',
    body:
      '障害・難病就労支援の知見を、通して読めるガイドと必要時に引ける道具箱へ整理する。',
    targetId: 'NS-03',
  },
  {
    icon: MessagesSquare,
    label: 'モデル場面',
    title: '正解配慮ではなく、企業と支援者の読みを並べる',
    body:
      '実在ケースを使わず、現場が動かない理由を仕事設計の条件として分解する。',
    targetId: 'NS-04',
  },
  {
    icon: FileText,
    label: '政策・研修・SNS翻訳',
    title: '研究や制度の言葉を、社会が試せる問いへ変える',
    body:
      '現在政策の断定を避けながら、共同実装、研修、連載、提案骨子へ展開できる形にする。',
    targetId: 'NS-05',
  },
];

const detailReaderCards: Record<
  string,
  Array<{
    icon: typeof Layers3;
    label: string;
    title: string;
    body: string;
  }>
> = {
  'NS-02': [
    {
      icon: Layers3,
      label: 'このページで得られるもの',
      title: '7つの接触点を一枚で読む',
      body: '困難を診断名、障害の種類、配慮名で止めず、仕事のどこで条件が閉じているかを確認する。',
    },
    {
      icon: Wrench,
      label: '使える場面',
      title: '相談前、研修前、職場調整前',
      body: '関係者が同じ地図を見て、次に確認する問いをそろえるために使う。',
    },
    {
      icon: ShieldCheck,
      label: 'これはしない',
      title: '個別の配慮妥当性を決めない',
      body: '合理的配慮、職場責任、医学・法務・雇用判断の結論には使わない。',
    },
  ],
  'NS-03': [
    {
      icon: BookOpen,
      label: 'このページで得られるもの',
      title: '仕事設計ガイドとして通して読む',
      body: '健康時間、入口・翻訳、職場・価値の3章で、人間の多様性を前提にした仕事設計の全体像をつかむ。',
    },
    {
      icon: MessagesSquare,
      label: '使える場面',
      title: '必要な場面では道具箱として引く',
      body: '相談、研修、雇用管理、組織変革の場面で、近い視点に戻って確認できる。',
    },
    {
      icon: ShieldCheck,
      label: 'これはしない',
      title: '公式標準として固定しない',
      body: '21視点を完成済み標準や認定フレームとして扱わない。',
    },
  ],
  'NS-04': [
    {
      icon: MessagesSquare,
      label: 'このページで得られるもの',
      title: 'モデル場面で読み方を練習する',
      body: '企業側の制約と支援者側の問いを並べ、仕事接触点を見える化する。',
    },
    {
      icon: Wrench,
      label: '使える場面',
      title: '企業研修、支援者研修、共同試作',
      body: '45分程度のミニ研修や場面読解の教材として使える。',
    },
    {
      icon: ShieldCheck,
      label: 'これはしない',
      title: '実在ケースの判定に使わない',
      body: '実在ケース、法的安全保証、採用・配置・配慮妥当性判断に使わない。',
    },
  ],
  'NS-05': [
    {
      icon: FileText,
      label: 'このページで得られるもの',
      title: '資料を仕事設計の問いへ翻訳する',
      body: '研究、行政資料、試作メモ、旧サイト資産を混ぜず、資料の身元ごとに読む。',
    },
    {
      icon: Telescope,
      label: '使える場面',
      title: '政策メモ、研究レビュー、SNS前の論点整理',
      body: '断定ではなく、確認すべき論点と共同設計テーマへ戻す。',
    },
    {
      icon: ShieldCheck,
      label: 'これはしない',
      title: '現行政策や法令解釈を断定しない',
      body: '現在情報や制度説明は、公開前にlive verificationを必要とする。',
    },
  ],
  'NS-06': [
    {
      icon: Wrench,
      label: 'このページで得られるもの',
      title: '言葉だけでは届きにくい関係を、場に置く',
      body: '図解、音、場面、ワーク、進行台本で、関係者が同じ状況を見て話せる入口を選ぶ。',
    },
    {
      icon: MessagesSquare,
      label: '使える場面',
      title: '会議、研修、連携、相談準備',
      body: '説明を増やす前に、同じ場面を見て、次に確認する条件や役割を残す。',
    },
    {
      icon: ShieldCheck,
      label: 'これはしない',
      title: '教材を判断にしない',
      body: '医学、法務、就労可否、合理的配慮妥当性の結論には使わない。',
    },
  ],
};

export function getNextNblPreviewSlug(page: NextSiteCandidatePage) {
  if (page.id === 'NS-01') return 'top';
  return page.slugCandidate.replace('/next/', '');
}

export function getNextNblHref(page: NextSiteCandidatePage, basePath = previewBase) {
  const normalizedBase = normalizeNextNblBasePath(basePath);
  if (page.id === 'NS-01') return normalizedBase || '/';
  return `${normalizedBase}/${getNextNblPreviewSlug(page)}`;
}

export function getNextNblPreviewHref(page: NextSiteCandidatePage) {
  return getNextNblHref(page, previewBase);
}

export function getNextNblPublicHref(page: NextSiteCandidatePage) {
  return getNextNblHref(page, '');
}

export function getNextNblPreviewPageBySlug(slug: string) {
  const normalized = slug === 'index' ? 'top' : slug;
  return nextSiteCandidatePages.find((page) => getNextNblPreviewSlug(page) === normalized) ?? null;
}

function PreviewShell({
  children,
  currentId,
}: {
  children: ReactNode;
  currentId?: string;
}) {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbfaf5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link href={previewBase} className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white">
              N
            </span>
            Next Being Lab
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {nextSiteCandidatePages.map((page) => (
              <Link
                key={page.id}
                href={getNextNblPreviewHref(page)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  currentId === page.id
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                {page.label.replace(' / ', ' ')}
              </Link>
            ))}
          </nav>
          <Link
            href={publicPageHrefById('NS-07')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400"
          >
            理論を読む
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>
      <div className="border-b border-slate-200 bg-white px-5 py-2 text-center text-xs font-semibold text-slate-600">
        個別判断ではなく、仕事条件を整理するための読み物と道具です。
      </div>
      {children}
    </div>
  );
}

function HeroVisual({ page }: { page: NextSiteCandidatePage }) {
  const visual = pageVisuals[page.id] ?? pageVisuals['NS-01'];

  return (
    <div className="relative min-h-[520px] overflow-hidden bg-slate-950 lg:min-h-[640px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(45,212,191,0.30),transparent_30%),radial-gradient(circle_at_42%_78%,rgba(244,114,182,0.20),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)]" />
      <img
        src={visual.src}
        alt={visual.alt}
        className="absolute -right-24 top-0 hidden h-[68%] w-[70%] scale-110 object-cover opacity-[0.24] mix-blend-screen lg:block"
        style={{
          objectPosition: `${visual.objectPosition} top`,
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 58%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 58%, transparent 100%)',
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${visual.tone}`} />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.92)_0%,rgba(15,23,42,0.82)_37%,rgba(15,23,42,0.34)_70%,rgba(15,23,42,0.72)_100%)]" />
      <div className="absolute inset-0 opacity-28 [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute right-8 top-20 hidden w-[38rem] max-w-[45vw] rounded-lg border border-white/12 bg-white/7 p-5 shadow-2xl backdrop-blur-md lg:block">
        <div className="grid grid-cols-3 gap-3">
          {['人', '仕事', '支援', '時間', '場所', '価値'].map((label) => (
            <div key={label} className="rounded-lg border border-white/12 bg-white/[0.08] px-3 py-4">
              <p className="text-sm font-semibold tracking-normal text-cyan-50">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-cyan-300 via-white/70 to-rose-300" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbfaf5] via-slate-950/32 to-transparent" />
    </div>
  );
}

function StatusPills({ page }: { page: NextSiteCandidatePage }) {
  const items =
    page.id === 'NS-01'
      ? ['専門知識の整理', '生活機能の相互作用', '仕事設計', '社会実装']
      : ['診断名lookupにしない', '個別判断にしない', '仕事接点へ戻す'];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/86 backdrop-blur"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function PageHero({ page, isOverview = false }: { page: NextSiteCandidatePage; isOverview?: boolean }) {
  const Icon = page.icon;

  return (
    <section className="relative overflow-hidden">
      <HeroVisual page={page} />
      <div className="absolute inset-0">
        <div className="mx-auto grid h-full max-w-7xl items-center px-5 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-3xl pt-10 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <Icon size={14} />
                {page.eyebrow}
              </span>
              <span className="rounded-full border border-cyan-200/30 bg-cyan-100/15 px-3 py-1.5 text-xs font-semibold text-cyan-50">
                読み物と道具
              </span>
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-none tracking-normal md:text-7xl">
              {isOverview ? 'Next Being Lab' : page.headline}
            </h1>
            {isOverview ? (
              <p className="mt-5 max-w-3xl text-2xl font-semibold leading-snug text-white">
                {page.headline}
              </p>
            ) : null}
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 md:text-lg">
              {page.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={getNextNblPreviewHref(nextSiteCandidatePages[1])}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                {page.primaryActionLabel}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={getNextNblPreviewHref(nextSiteCandidatePages[3])}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18"
              >
                {page.secondaryActionLabel}
              </Link>
            </div>
            <div className="mt-7">
              <StatusPills page={page} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageCards() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-800">
            読み順
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
            蓄積された知恵を、6つの入口から読めるようにする
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          最初に必要なのは説明資料ではなく、読者が自分の現場課題から入れる読み順です。
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nextSiteCandidatePages.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.id}
              href={getNextNblPreviewHref(page)}
              className="group flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white">
                  <Icon size={18} />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {page.id}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-normal text-slate-950">
                {page.label}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{page.pagePromise}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                ページを見る
                <ArrowRight size={15} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ImpactRows() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 px-5 py-14 lg:grid-cols-3">
        {impactRows.map((row) => (
          <article key={row.label} className="border-slate-200 py-6 lg:border-r lg:px-8 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0">
            <p className="text-sm font-semibold text-cyan-800">{row.label}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">{row.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{row.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShiftPanel() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-800">
              見方の転換
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-5xl">
              変えるのは、答えではなく見方。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              障害・難病の就労支援で積み上がった知見を、より広い仕事と社会の設計へ開く。分類ではなく、相互作用を読み解く起点にする。
            </p>
          </div>
          <div className="space-y-3">
            {shiftRows.map((row) => (
              <div
                key={row.after}
                className="grid gap-3 rounded-lg border border-slate-200 bg-[#fbfaf5] p-4 shadow-sm md:grid-cols-[1fr_auto_1.15fr]"
              >
                <p className="text-sm leading-7 text-slate-500">{row.before}</p>
                <div className="flex items-center text-cyan-800">
                  <ArrowRight size={18} />
                </div>
                <p className="text-base font-semibold leading-7 text-slate-950">{row.after}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyPanel() {
  return (
    <section className="bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Reading flow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-5xl">
              読む順番が、そのまま仕事設計の手順になる。
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/70">
            次期NBLは知識の陳列棚ではなく、現場の詰まりを見方、問い、場面、共同実装へ進める道具として読めるようにする。
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {journeySteps.map((step) => {
            const Icon = step.icon;
            const target =
              nextSiteCandidatePages.find((page) => page.id === step.targetId) ??
              nextSiteCandidatePages[0];

            return (
              <Link
                key={step.label}
                href={getNextNblPreviewHref(target)}
                className="group flex min-h-[270px] flex-col rounded-lg border border-white/12 bg-white/7 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/70 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan-300 text-slate-950">
                    <Icon size={18} />
                  </span>
                  <p className="text-sm font-semibold text-cyan-100">{step.label}</p>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-normal">{step.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-white/72">{step.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
                  {target.label}へ
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

function ConcreteOutputsPanel() {
  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">
              What people can use
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
              計画ではなく、読者が手に取れる具体物へ。
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-700">
              次期NBLの役割は、専門的な分析構造そのものを説明することではありません。現場、研修、政策、SNSで使える読み物と問いに変換することです。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {concreteOutputCards.map((card) => {
              const Icon = card.icon;
              const target =
                nextSiteCandidatePages.find((page) => page.id === card.targetId) ??
                nextSiteCandidatePages[0];

              return (
                <Link
                  key={card.label}
                  href={getNextNblPreviewHref(target)}
                  className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 transition hover:border-rose-300 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-100 text-rose-800">
                      <Icon size={18} />
                    </span>
                    <p className="text-sm font-semibold text-rose-800">{card.label}</p>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-normal text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-800 group-hover:text-rose-950">
                    読む
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const publicNavItems = [
  { id: 'NS-01', label: '全体入口' },
  { id: 'NS-04', label: '場面から入る' },
  { id: 'NS-02', label: '相談事例集' },
  { id: 'NS-03', label: '21視点ガイド' },
  { id: 'NS-05', label: '記事集' },
  { id: 'NS-06', label: 'ツールキット' },
];

const publicUtilityNavItems = [
  { id: 'NS-09', label: '障害種類から見る', mobileLabel: '障害種類' },
  { id: 'NS-07', label: 'なぜ可能か' },
  { id: 'NS-08', label: 'このサイトについて', mobileLabel: 'サイト情報' },
];

const publicPageCopy: Record<
  string,
  {
    label: string;
    eyebrow: string;
    headline: string;
    lead: string;
    primary: string;
    secondary: string;
    problem: string;
    promise: string;
    notThis: string;
  }
> = {
  'NS-01': {
    label: '入口',
    eyebrow: '見えなかった関係を読む入口',
    headline: '見えなかった関係を、仕事条件の地図へ。',
    lead:
      '障害者雇用や難病就労支援に長く残る難しさを、本人、仕事、環境、支援、時間、制度の相互作用として読み直します。診断名や配慮名で止めず、社会で使える相談事例、21視点、記事、場面、認知補助ツールへ変換する入口です。',
    primary: '課題の地図を見る',
    secondary: '5つの入口を見る',
    problem: '診断名、障害の種類、配慮名、制度説明だけでは、本人、支援者、企業、制度のあいだで何を話せばよいかが見えにくい。',
    promise:
      '古くて新しい課題を、仕事条件の地図へ戻し、場面、相談事例、21視点、記事、認知補助ツールへ進む。',
    notThis: '個別相談、法的・医療判断、診断名別の配慮判定は行いません。',
  },
  'NS-02': {
    label: '仕事条件で読む相談事例集',
    eyebrow: '相談事例集',
    headline: '相談の一言から見立てを組み立てる',
    lead:
      'よくある相談を、答え集ではなく、複数の読み筋、まだ分からないこと、情報が増えると見えること、合意前の確認候補までたどる見立てのプロセスとして読めるようにします。',
    primary: '近い構造を読む',
    secondary: '理論を読む',
    problem: '障害者雇用・就労支援の相談は、本人、仕事、職場、支援、制度、時間、評価が絡み合い、人間だけでは見落としやすい。',
    promise:
      '断片相談を、複数の読み筋、追加確認、情報が増えると見えること、合意前の確認候補へつなぐ。',
    notThis: '判定表ではありません。個別対応の正解、法的・医療・人事判断を出すものではありません。',
  },
  'NS-03': {
    label: '未来設計21視点ガイド',
    eyebrow: '未来の設計地図',
    headline: '21視点で未来の仕事を設計する',
    lead:
      '障害者雇用や難病就労支援で蓄積されてきた知見を、人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計へ展開します。21視点は、未来の仕事を設計するための全体地図です。',
    primary: '未来地図を見る',
    secondary: 'なぜ可能か',
    problem: '大切な知見が、制度、症状、配慮、支援ノウハウに分かれてしまうと、企業や支援者が組織全体の仕事設計を変える見取り図になりにくい。',
    promise:
      '21の視点を、企業経営、雇用管理、専門支援、研修で使える3章構成のガイドブックとして示し、必要な視点へ戻れる道具箱としても使える形にする。',
    notThis: '公式基準、配慮判定表、診断名別マニュアルではありません。',
  },
  'NS-04': {
    label: '場面から入る',
    eyebrow: '入口ストーリー',
    headline: '場面から入る',
    lead:
      'タテ割り支援で見えにくくなった状況を、直感的なストーリーとして見える化します。場面カードは独立した答えではなく、相談事例集、理論、教材へ進むための導入です。',
    primary: '場面を読む',
    secondary: '相談事例集へ',
    problem: '本人の事情、企業の制約、支援者の問い、医療・生活側の情報が別々の言葉で語られ、同じ場面として共有されない。',
    promise:
      '実在ケースを使わず、ストーリー、図解、役割分担で「どこがつながっていないか」を見える形にし、次に読むページへつなぐ。',
    notThis: '採用、配置、合理的配慮、労務判断の妥当性を判定するものではありません。',
  },
  'NS-05': {
    label: '働き方の問いをひらく記事集',
    eyebrow: '社会の問いを読む',
    headline: '働き方の問いをひらく記事集',
    lead:
      'ニュース、SNS、制度、研究、研修現場で出てくる違和感を、賛否や感想で止めず、本人、仕事、環境、支援、時間、制度の関係として読み直します。記事、図解、相談事例、21視点、教材へつなぎ、社会の反応は次に直す説明の手がかりとして扱います。',
    primary: '問いから読む',
    secondary: '図解目次へ',
    problem: '制度、研究、ニュース、SNSの言葉が、そのままでは現場の仕事設計や研修の問いへ変換されにくい。',
    promise:
      '社会の違和感を、専門知識ネットワークに支えられた記事、図解、読後に話す問い、相談事例集や21視点への導線にする。SNS反応は根拠ではなく、次に直す説明の材料として扱う。',
    notThis: '個別相談への回答、現行制度、法令解釈、公式見解、統計評価をこのページだけで断定しません。',
  },
  'NS-06': {
    label: '認知補助ツールキット',
    eyebrow: '図解・ワーク・研修',
    headline: '認知補助ツールキット',
    lead:
      '長い説明や文書では伝わりにくいことが、音楽、映像、図解、一緒に手を動かす体験で一気に見えることがあります。認知補助ツールキットは、働きづらさの具体的な問いを、共感、笑い、ひらめき、手ざわりのあるワークへ変え、同じ場面を共有する入口です。',
    primary: 'ツールを見る',
    secondary: '場面から入る',
    problem: '役立つ情報は多いのに、診断名、障害の種類、制度、体験、啓発、研修素材に分かれ、組織のタテ割りやコミュニケーションの詰まりを越える道具になりにくい。',
    promise:
      '複雑な課題を、関係者が同じ場面を見て、合意前に確認する条件まで話せる道具の束へ変換する。',
    notThis: '成果保証、法的判断、このページだけでの個別相談回答は行いません。患者会・支援団体とは、売り込み先ではなく共同で言葉を整える相手として向き合います。',
  },
  'NS-07': {
    label: '理論と発見',
    eyebrow: 'なぜ可能か',
    headline: '見えなかった関係を、仕事条件の知識ネットワークへ。',
    lead:
      '障害者雇用や難病就労支援に長く残ってきた難しさを、本人、仕事、環境、支援、時間、制度の相互作用として読み直します。人間だけでは扱いきれなかった複雑な関係を、ICF準拠の枠組みとAIの文脈読解で知識ネットワークに変え、読める・学べる・使えるプロダクト群へ展開します。',
    primary: '理論を読む',
    secondary: 'プロダクト群を見る',
    problem: '既存情報は多いのに、本人の事情、職務、制度、支援、評価、時間の関係が分断され、人間の認知負荷だけに乗りやすい。',
    promise:
      '既存知見を、仕事条件の相互作用ネットワークとして再構成し、相談事例集、21視点、記事、場面、認知補助ツールへ渡す。',
    notThis: 'AIが個別の医学判断、法的判断、就労可否判断、合理的配慮の妥当性判断を行うものではありません。',
  },
  'NS-08': {
    label: 'このサイトについて',
    eyebrow: 'Next Being Lab',
    headline: 'NBLについて',
    lead:
      'このページでは、NBLの基本情報、創設者、連絡先、情報の扱い方、個別判断をしない境界を確認できます。',
    primary: 'お問い合わせ',
    secondary: '全体入口へ',
    problem: 'サイトの内容が充実していても、NBLとは何か、誰が運営し、どこへ連絡できるのかが見えなければ、読者は安心して読み進められない。',
    promise:
      'NBLの基本情報、運営目的、情報の扱い方、連絡先、個別判断をしない境界を、公開ページとして短く確認できるようにする。',
    notThis: 'このページはサイトの使い方ガイドや個別相談窓口ではありません。医学・法務・雇用判断、合理的配慮妥当性、実際のAI応答、自動判定は扱いません。',
  },
  'NS-09': {
    label: '障害種類から見る',
    eyebrow: '障害種類・疾病名から見る仕事条件',
    headline: '障害種類・疾病名から、職場条件へ。',
    lead:
      '発達障害、精神障害、難病、内部障害などの名前から調べ始めた時に、特性理解だけで止めず、時間、情報、環境、動線、評価、支援のどこを確認すればよいかへ進みます。',
    primary: '10分類を見る',
    secondary: '相談事例集へ',
    problem: '支援者や企業担当者は、発達障害、精神障害、難病、内部障害などの名前から調べ始めることが多い。その入口で、本人の問題だけに狭めず、仕事設計まで視界を広げられると次の打ち手が変わる。',
    promise:
      '障害種類・疾病名を、特性理解から仕事条件の発見へ広げる入口として使う。',
    notThis: '個別の医学判断、就労可否判断、法的判断、合理的配慮妥当性の判定を行うページではありません。',
  },
};

const publicShiftCards = [
  {
    before: '本人の問題として見る',
    after: '人と仕事の接点として見る',
    body: '困難を本人の中だけに閉じず、仕事の形、情報、環境、支援、時間と一緒に見る。',
  },
  {
    before: '診断名・障害種類から配慮を探す',
    after: '条件が閉じる場所を探す',
    body: '診断名は大切な情報。ただし、同じ診断名でも仕事上の困難と必要な設計は同じではない。',
  },
  {
    before: '支援の有無で考える',
    after: '誰が何を翻訳し直すかを見る',
    body: '本人、支援者、職場、制度の間で、何が伝わり、何が仕事条件に変換されていないかを見る。',
  },
  {
    before: '雇用・定着だけで見る',
    after: '参加の質まで見る',
    body: '働けているかだけでなく、役割、評価、技能形成、処遇、見直しの余地まで見る。',
  },
];

const publicAhaRows = [
  {
    scene: '体調変動と締切が重なる場面',
    stuck: '「疲れやすいので配慮が必要です」で止まる',
    reframed: '締切、休憩、回復時間、情報共有、評価が重なっていないかを見る',
    checks: ['締切', '休憩', '回復時間', '情報共有', '評価'],
    icon: Clock3,
    tone: 'text-cyan-800 bg-cyan-50 border-cyan-200',
  },
  {
    scene: '指示や変更連絡が見えにくい場面',
    stuck: '「コミュニケーションが苦手です」で止まる',
    reframed: '指示の粒度、相談先、暗黙ルール、変更連絡が見えるかを見る',
    checks: ['指示の粒度', '相談先', '暗黙ルール', '変更連絡'],
    icon: MessagesSquare,
    tone: 'text-rose-800 bg-rose-50 border-rose-200',
  },
  {
    scene: '役割と見通しが切れている場面',
    stuck: '「本人の意欲が続かない」で止まる',
    reframed: '役割、見通し、負荷、フィードバック、生活の余白が閉じていないかを見る',
    checks: ['役割', '見通し', '負荷', 'フィードバック', '生活の余白'],
    icon: Sparkles,
    tone: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  },
];

const publicStorySteps = [
  {
    number: '1',
    label: '入口情報',
    title: '診断名・障害の種類・困りごとの名前を受け取る',
    body: '入口情報を軽く扱いません。ただし、そこから配慮を自動で決めず、仕事場面へ進むための出発点にします。',
  },
  {
    number: '2',
    label: '仕事条件',
    title: '作業・時間・情報・環境・相談・評価に分ける',
    body: '本人の中だけに閉じず、どの条件が重なって働きづらさを生んでいるかを同じ図で見ます。',
  },
  {
    number: '3',
    label: '使える道具',
    title: '地図・場面・研修・記事へ変える',
    body: '支援者と企業が同じ仕事場面を見ながら、次に確認する問いを持てる形にします。',
  },
];

const publicCognitionCards = [
  {
    label: '1枚図解',
    title: '条件が重なる場所を見せる',
    body: '締切、休憩、回復時間、情報共有、評価を同じ地図に置く。',
    icon: BrainCircuit,
  },
  {
    label: '3コマ教材',
    title: '止まる、分ける、試す',
    body: '本人の問題で止まる場面から、確認できる仕事条件へ移る。',
    icon: Layers3,
  },
  {
    label: '研修ワーク',
    title: '同じ場面で書いてみる',
    body: '企業側の制約と支援者側の問いを、1枚のワークに並べる。',
    icon: MessagesSquare,
  },
  {
    label: '短い映像',
    title: 'SNSから教材へ戻す',
    body: '違和感を開き、詳しい図解や研修ページへ戻る入口にする。',
    icon: Sparkles,
  },
];

const publicConditionMapNodes = [
  '締切',
  '休憩',
  '回復時間',
  '情報共有',
  '相談先',
  '評価',
  '生活の余白',
];

const publicSystemBridgeCards = [
  {
    label: '場面で入る',
    title: '同じ場面を先に見る',
    body:
      '本人、企業、支援者、医療・生活側が別々に見ている断片を、まず一つのストーリーに戻します。',
    targetId: 'NS-04',
    icon: MessagesSquare,
  },
  {
    label: '相談で深める',
    title: '断片相談を読み筋に変える',
    body:
      '短い相談文を、複数の読み筋、追加確認、情報が増えた後の読み、合意前の確認候補へ展開します。',
    targetId: 'NS-02',
    icon: FileSearch,
  },
  {
    label: '理論へ戻る',
    title: 'なぜこの読み方が可能かを見る',
    body:
      '分断された情報を、ICF準拠の相互作用フレームとAIの文脈読解で知識ネットワークへ変える発想を確認します。',
    targetId: 'NS-07',
    icon: Network,
  },
  {
    label: '社会の問いを読む',
    title: '話題を、働き方の問いへひらく',
    body:
      'ニュース、研究、SNS上の違和感を、賛否ではなく現場で確認できる問いへ翻訳します。',
    targetId: 'NS-05',
    icon: Telescope,
  },
  {
    label: '使う形にする',
    title: '図解、ワーク、音、読み下しへ変える',
    body:
      '文章だけでは共有しにくい関係を、会議や研修で使える認知補助ツールへ展開します。',
    targetId: 'NS-06',
    icon: BrainCircuit,
  },
];

const publicAudienceEntryCards = [
  {
    label: '本人・家族',
    title: '自分の状況を整理して、相談や話し合いに持っていきたい',
    situation:
      '体調、通院、疲れやすさ、説明しにくい負担を、職場で話せる仕事条件へ分けたい。',
    firstQuestion:
      '共有してよいこと、共有しないこと、仕事上確認したい条件は分けられているか。',
    href: publicPageHrefById('NS-04'),
    nextLabel: '入力せず、場面を読む',
    boundary: '入力欄や相談受付はありません。病状や就労可否の判断はしません。',
    icon: Compass,
  },
  {
    label: '支援者',
    title: '支援・相談準備で、本人の言葉を職場に伝わる問いにしたい',
    situation:
      '病名や配慮名だけでは伝わらない困りごとを、時間、作業、情報、支援、評価の問いに変えたい。',
    firstQuestion:
      '病名や配慮名の説明で止まらず、どの時間、作業、情報、評価を確認すればよいか。',
    href: publicPageHrefById('NS-02'),
    nextLabel: '相談事例で読む',
    boundary: '個別支援の正誤や配慮妥当性は判定しません。',
    icon: MessagesSquare,
  },
  {
    label: '人事・管理職',
    title: '職場運用を整え、制度対応の先を話したい',
    situation:
      '配慮の必要性は分かるが、管理職の負荷、評価、情報共有、同僚説明をどう整理するかで止まっている。',
    firstQuestion:
      '誰かの努力にせず、締切、手順、共有範囲、評価のどこを少し試せるか。',
    href: publicPageHrefById('NS-03'),
    nextLabel: '21視点で整理する',
    boundary: '法的安全保証、社員評価、採用配置助言はしません。',
    icon: BookOpen,
  },
  {
    label: '研修・政策・研究',
    title: '研修・資料を、現場で話せる問いへ直したい',
    situation:
      '資料や調査で見えている課題を、研修、記事、図解、会議で使える問いに変換したい。',
    firstQuestion:
      '対象者ラベルを増やすのではなく、どの仕事、生活、制度の条件を設計対象にするか。',
    href: publicPageHrefById('NS-05'),
    nextLabel: '記事集へ',
    boundary: '最新政策や公式見解の断定、成果保証はしません。',
    icon: FileSearch,
  },
];

const publicOldNewProblemCards = [
  {
    label: '見える数字と、見えにくい参加',
    title: '雇用率や採用数は見えるが、役割・評価・成長は見えにくい',
    body: '働いているかだけでなく、どんな役割で、どう評価され、見直しや技能形成の余地があるかまで見ないと、参加の質が残りません。',
    icon: Telescope,
  },
  {
    label: '名前で止まる',
    title: '診断名・障害種別・配慮名から答えを探してしまう',
    body: '診断名は重要な情報です。ただし同じ病名でも、通勤、作業量、情報形式、評価、支援の条件は同じではありません。',
    icon: FileSearch,
  },
  {
    label: '健康時間',
    title: '通院・治療・回復・症状変動が勤務表や評価に翻訳されにくい',
    body: '難病や慢性疾患では、休むか頑張るかの二択ではなく、同じ週の仕事量、締切、回復時間、共有範囲を一緒に見る必要があります。',
    icon: Clock3,
  },
  {
    label: '情報の分断',
    title: '本人、企業、医療、福祉、行政が同じ仕事条件の地図を共有しにくい',
    body: 'それぞれの情報は有用でも、誰が何を仕事条件へ再翻訳するかが残らないと、本人の説明負担や現場の属人対応に戻ります。',
    icon: Network,
  },
  {
    label: '制度から現場へ',
    title: '合理的配慮や制度説明が、作業・手順・相談線・評価運用へ落ちにくい',
    body: '法務語や制度語を否定せず、職場で確認できる時間、作業、情報、環境、支援、評価の条件へ翻訳します。',
    icon: ClipboardList,
  },
  {
    label: '上司依存',
    title: '理解ある上司や個別対応に乗り、再利用できる設計単位にならない',
    body: '善意を責めるのではなく、誰が代わっても見直せる手順、記録、共有範囲、支援のつなぎ方へ戻します。',
    icon: Wrench,
  },
  {
    label: '検索・SNSの限界',
    title: '検索や要約は入口になる一方、古い障害観や単純化を再生産しうる',
    body: '反応や要約を根拠にせず、偏りのリスク、情報の身元、足りない確認を分けてから記事や教材へ戻します。',
    icon: Ear,
  },
  {
    label: '学びが育たない',
    title: '研修・政策・相談の問いが、改稿や教材化の循環に残りにくい',
    body: '一回限りの発信で終わらせず、誤読、沈黙、追加質問を、記事、図解、相談事例、21視点、ワークへ戻します。',
    icon: Workflow,
  },
];

const publicHomeProductCards = [
  {
    role: '場面から入る',
    label: '場面ストーリー',
    body: '本人・企業・支援者が別々に見ている場面を、ひとつの仕事条件として見える化します。',
    page: nextSiteCandidatePages[3],
    icon: Route,
  },
  {
    role: '相談事例集',
    label: '見立てのプロセス',
    body: '短い相談文を、正解配慮ではなく、読み筋、追加確認、次に話す問いへ変えます。',
    page: nextSiteCandidatePages[1],
    icon: MessagesSquare,
  },
  {
    role: '21視点ガイド',
    label: '未来の仕事設計',
    body: '蓄積された支援知見を、企業経営、雇用管理、専門支援、制度設計の視点として学べます。',
    page: nextSiteCandidatePages[2],
    icon: BookOpen,
  },
  {
    role: '記事集',
    label: '社会の問いをひらく',
    body: 'ニュースやSNSの違和感を、賛否ではなく、職場で確認できる働き方の問いへ開きます。',
    page: nextSiteCandidatePages[4],
    icon: FileText,
  },
  {
    role: 'ツールキット',
    label: '同じ場で話せる形へ',
    body: '文章だけでは共有しにくい関係を、図解、場面、ワーク、研修素材にして扱えるようにします。',
    page: nextSiteCandidatePages[5],
    icon: BrainCircuit,
  },
];

const publicConditionWindowCards = [
  {
    slug: 'visual-impairment',
    label: '情報アクセス',
    examples: '視覚障害',
    ordinary: '文字が読みにくい、見えない、移動しにくいという個人機能の問題として見がちです。',
    discovery:
      '資料、画面、掲示、会議、警告、移動案内を「仕事情報」として再設計すると、本人だけでなくチーム全体の確認精度も上がります。',
    workplace: '紙資料だけで更新される手順、見えにくい共有画面、通路や棚の配置、口頭で済む場所案内。',
    change: '読み上げ可能な資料、代替テキスト、画面共有の読み順、物の定位置、移動しやすい動線、確認できるIT環境。',
    social: '情報を見える人だけに預けない職場は、外国語話者、遠隔勤務者、初任者にも参加しやすくなります。',
    question: '必要な情報は、いつ、どの形式で、誰に確認できると仕事が進むか。',
    homeSummary: '資料、画面、掲示、動線、安全情報を、見える人だけに預けない仕事情報へ変える。',
    falconReading:
      '視覚障害の入口で見る核は、見える・見えないの判定ではなく、仕事情報がどの媒体、順序、場所、IT環境に閉じているかです。情報形式、補助技術、動線、安全、定着支援を一つの仕事設計として読みます。',
    difficultyFormula: {
      factors: ['見え方・読み取り方法の多様性', '視覚前提の資料・画面・動線・安全情報', '本人任せの調整'],
      result: '情報アクセスの不一致',
    },
    solutionFormula: {
      parts: ['情報形式を複線化', 'IT環境を整備', '動線と安全を設計', '企業調整と定着支援'],
      result: 'アクセスできる仕事設計',
    },
    snags: [
      { title: '資料・画面にアクセスできない', body: '紙、画像、共有画面、掲示だけで仕事情報が渡される。' },
      { title: 'IT環境が合わない', body: '読み上げ、拡大、ショートカット、権限、端末設定が業務側とつながらない。' },
      { title: '動線と安全情報が視覚前提', body: '棚、通路、警告、場所案内が見える人の暗黙知になっている。' },
      { title: '調整が本人任せ', body: '資料変換、説明依頼、危険確認を本人が毎回交渉する。' },
    ],
    implementations: [
      { title: '職業場面評価', body: '見え方ではなく、実際の資料、画面、移動、確認の接点を見る。' },
      { title: '資料形式の標準化', body: '読み上げ、テキスト化、代替テキスト、更新履歴を標準にする。' },
      { title: 'IT・補助技術の整備', body: '補助技術を私物努力ではなく業務環境として接続する。' },
      { title: '動線・安全設計', body: '物の定位置、声かけ、危険表示、避難導線を確認可能にする。' },
      { title: '企業調整と定着支援', body: '支援機関が職場側の運用変更と更新を一緒に見る。' },
    ],
    supportLoop: ['観察', '職業場面評価', '情報形式を設計', '実際に試す', '定着支援で更新'],
    agreements: [
      '見えない・見えにくいことを本人の努力不足にしない。',
      '資料や画面を渡しただけで共有済みにしない。',
      'アクセスできる情報設計は、仕事品質と安全を守る設計。',
    ],
    imageSrc: '/resources/disability-work-design/visual-impairment.webp',
    imageAlt: '視覚障害の仕事設計：情報アクセスと動線設計の観点からのインフォグラフィック',
    relatedProducts: [
      {
        label: '場面から入る',
        href: publicPageHrefById('NS-04'),
        reason: '資料、会議、動線の詰まりを、関係者が同じ場面として見られるようにする。',
      },
      {
        label: 'ツールキット',
        href: publicPageHrefById('NS-06'),
        reason: '読み上げ可能な資料、代替テキスト、確認しやすい図解やワークへ変える。',
      },
    ],
    icon: FileSearch,
  },
  {
    slug: 'hearing-impairment',
    label: '情報伝達',
    examples: '聴覚障害',
    ordinary: '聞こえにくさ、会話の難しさ、本人の聞き返しの問題として見がちです。',
    discovery:
      '音声前提の会議、呼び出し、雑談、警報、OJTを「情報が届く設計」に変えると、職場の暗黙情報そのものが整います。',
    workplace: '急な口頭指示、会議での同時発話、背後からの声かけ、アラーム、雑談で決まる小さな変更。',
    change: '字幕、文字チャット、発話順、議事メモ、視覚通知、確認タイム、情報共有ルール。',
    social: '声の大きい人が有利な職場から、記録と確認で動く職場へ変える入口になります。',
    question: '重要な連絡は、聞こえた人だけでなく、必要な人全員に残る形で届いているか。',
    homeSummary: '会議、指示、緊急連絡、雑談で決まる変更を、音声だけに閉じない情報導線へ変える。',
    falconReading:
      '聴覚障害の入口で見る核は、聞こえ方そのものではなく、重要情報が音声、同時発話、雑談、警報に閉じている職場設計です。情報保障を本人の聞き返しではなく、仕事情報が届く仕組みとして読みます。',
    difficultyFormula: {
      factors: ['聞こえ方・言語・情報アクセスの多様性', '音声前提の会議・指示・緊急連絡', '本人任せの情報保障'],
      result: '情報共有と会話参加のズレ',
    },
    solutionFormula: {
      parts: ['音声を複線化', '発話ルールを標準化', '文字・手話・業務導線へ', '企業調整と定着支援'],
      result: '情報が届く仕事設計',
    },
    snags: [
      { title: '口頭情報が抜け落ちる', body: '急な指示、変更、呼び出しが記録に残らない。' },
      { title: '会議で参加が崩れる', body: '同時発話、早い展開、誰が何を決めたかが追いにくい。' },
      { title: '緊急連絡と安全情報が届かない', body: '警報、電話、背後からの声かけが安全導線として弱い。' },
      { title: '情報保障が本人任せ', body: '通訳、字幕、文字共有、確認依頼を本人が毎回準備する。' },
    ],
    implementations: [
      { title: '職業場面評価', body: '聞こえの程度ではなく、情報が消える場面と意思決定の場所を見る。' },
      { title: '情報保障の標準化', body: '字幕、メモ、手話、チャット、視覚通知を運用ルールにする。' },
      { title: '会議・指示設計', body: '発話順、議題、決定ログ、確認時間を会議の標準にする。' },
      { title: '電話・緊急連絡の代替', body: '文字連絡、視覚アラート、担当分担、安全確認を用意する。' },
      { title: '企業調整と定着支援', body: '職場側の連絡文化と更新状況を継続的に見る。' },
    ],
    supportLoop: ['観察', '職業場面で評価', '情報導線を設計', '小さく試す', '定着支援で更新'],
    agreements: [
      '聞こえない・聞こえにくいことを本人の努力不足にしない。',
      '口頭だけで伝えたことを共有済みにしない。',
      '情報保障は特別扱いではなく、仕事品質と安全を守る設計。',
    ],
    imageSrc: '/resources/disability-work-design/hearing-impairment.webp',
    imageAlt: '聴覚障害の仕事設計：情報伝達と職場コミュニケーション設計のインフォグラフィック',
    relatedProducts: [
      {
        label: 'ツールキット',
        href: publicPageHrefById('NS-06'),
        reason: '会議、連絡、字幕、文字共有を、現場で使える補助ツールとして扱う。',
      },
      {
        label: '場面から入る',
        href: publicPageHrefById('NS-04'),
        reason: '口頭指示や雑談で決まる変更を、同じ仕事場面として見える化する。',
      },
    ],
    icon: Ear,
  },
  {
    slug: 'physical-disability',
    label: '動線と道具',
    examples: '肢体不自由',
    ordinary: '移動、姿勢、作業動作、体力の制約として見がちです。',
    discovery:
      '担当範囲、机や棚の配置、道具、休憩、代替手順を変えると、仕事の参加範囲そのものを広げられます。',
    workplace: '遠い保管場所、狭い通路、立ち作業前提、重い道具、移動を含む担当範囲、休憩しにくい配置。',
    change: '作業台の高さ、道具の選択、配置換え、分担の再設計、代替手順、移動量を減らす工程設計。',
    social: '身体に合う道具と動線を整えることは、年齢、けが、妊娠、疲労のある働き手にも効きます。',
    question: '仕事の場所、順序、道具、補助、代替手順はどう変えられるか。',
    homeSummary: '移動、上肢操作、姿勢、疲労を、動線・道具・分担・休憩の設計問題として見る。',
    falconReading:
      '肢体不自由の入口で見る核は、身体機能の不足ではなく、仕事がどれだけ移動量、姿勢保持、手作業、固定時間に依存しているかです。動線、道具、担当範囲、休憩、安全を同じ工程設計として読みます。',
    difficultyFormula: {
      factors: ['移動・上肢操作・姿勢保持・疲労や痛みの条件', '固定的な勤務・休憩・衛生・業務量', '本人任せの調整'],
      result: '動線・道具・体制の不一致',
    },
    solutionFormula: {
      parts: ['動線を短く', '作業を再設計', '姿勢と休憩を組み込む', '企業調整と定着支援'],
      result: '続けられる仕事設計',
    },
    snags: [
      { title: '移動・動線が重い', body: '保管場所、会議室、トイレ、作業場所が遠く、工程に移動負荷が隠れる。' },
      { title: '上肢操作・手作業が合わない', body: '道具、重さ、細かい操作、速度が一つの身体条件に寄っている。' },
      { title: '姿勢・疲労・痛みが設計外', body: '休憩、姿勢変更、回復時間が業務計画に入っていない。' },
      { title: '調整が本人任せ', body: '配置換えや代替手順の交渉を本人の説明力に預ける。' },
    ],
    implementations: [
      { title: '職業場面評価', body: 'できる動作だけでなく、工程の移動量、姿勢、回復を測る。' },
      { title: '動線・物理アクセス設計', body: '棚、机、入口、会議場所、衛生動線を仕事の一部として整える。' },
      { title: '上肢操作・道具の再設計', body: '道具、治具、手順、分担を変え、操作負荷を下げる。' },
      { title: '勤務・休憩・安全設計', body: '休憩、姿勢変更、代替担当、安全確認をあらかじめ組み込む。' },
      { title: '企業調整と定着支援', body: '設備だけで終わらず、運用と役割の更新を支援する。' },
    ],
    supportLoop: ['観察', '職業場面で評価', '動線と作業を設計', '小さく試す', '定着支援で更新'],
    agreements: [
      '歩けるか・動かせるかだけで支援を決めない。',
      '本人だけに説明・交渉・調整を背負わせない。',
      '設備ではなく、働き続けられる条件を成果にする。',
    ],
    imageSrc: '/resources/disability-work-design/physical-disability.webp',
    imageAlt: '肢体不自由の仕事設計：動線・作業継続性の観点からのインフォグラフィック',
    relatedProducts: [
      {
        label: '場面から入る',
        href: publicPageHrefById('NS-04'),
        reason: '動線、道具、担当範囲が仕事参加を狭める場面を具体化する。',
      },
      {
        label: '21視点ガイド',
        href: publicPageHrefById('NS-03'),
        reason: '作業量、動線、支援、役割を、雇用管理や制度設計の問いへ広げる。',
      },
    ],
    icon: Route,
  },
  {
    slug: 'internal-disability',
    label: '身体管理と勤務設計',
    examples: '内部障害',
    ordinary: '外から見えにくい病気、通院、体調管理への配慮として見がちです。',
    discovery:
      '治療、疲労、温度、食事、服薬、急変時対応を勤務表や評価とつなぐと、本人任せだった身体管理が職場条件になります。',
    workplace: '休憩を取りにくい繁忙時間、温度や空気、服薬や食事のタイミング、急な体調変化を言い出しにくい雰囲気。',
    change: '勤務量の山ならし、休憩の明示、温度・空調、通院日の組み込み、急変時の連絡線、評価時点の調整。',
    social: '見えにくい身体条件を扱える職場は、慢性疲労、育児・介護、加齢による変動にも強くなります。',
    question: '体調管理を本人の努力だけにせず、勤務表、環境、連絡線、評価にどう組み込むか。',
    homeSummary: '見えにくい身体管理を、通院、休憩、環境、連絡線、評価時点の運用へ翻訳する。',
    falconReading:
      '内部障害の入口で見る核は、病名の種類ではなく、治療、服薬、疲労、急変、環境条件が勤務表と評価にどう衝突するかです。見えにくい身体管理を本人努力から職場運用へ移す読みが必要です。',
    difficultyFormula: {
      factors: ['身体管理条件・体調変動', '固定的な勤務・休憩・衛生・業務量', '本人任せの調整'],
      result: '身体管理と勤務設計のズレ',
    },
    solutionFormula: {
      parts: ['通院を業務計画へ', '疾患管理を運用へ', '回復時間をバッファへ', '企業調整と継続確認'],
      result: '働ける仕事設計',
    },
    snags: [
      { title: '通院・治療と仕事の衝突', body: '通院日、服薬、検査、治療後の回復が勤務計画に入らない。' },
      { title: '職場内の体調管理が未設計', body: '温度、空調、食事、休憩、急変時連絡が個人対応に残る。' },
      { title: '疲労・息切れ・回復遅延', body: '同じ勤務時間でも負荷の密度や回復時間で継続性が変わる。' },
      { title: '見えにくさ・開示・制度の谷間', body: '必要な共有範囲と評価への影響を分けて話せない。' },
    ],
    implementations: [
      { title: '業務計画化', body: '通院、服薬、休憩、回復時間を勤務表と業務量に組み込む。' },
      { title: '職業場面評価', body: '症状名ではなく、作業密度、環境、時間帯、回復の接点を見る。' },
      { title: '医療情報の翻訳', body: '医療上の注意を、職場で扱える条件と確認事項に変える。' },
      { title: '職場運用ルール化', body: '急変時、休憩、代替担当、共有範囲を運用にする。' },
      { title: '就職後継続支援', body: '一度決めた配慮で終えず、体調変化と仕事変化に合わせて更新する。' },
    ],
    supportLoop: ['見える化', '職業場面で評価', '職場と合意', '小さく試す', '継続支援で更新'],
    agreements: [
      '病名だけで支援を決めない。',
      '体調管理を本人任せにしない。',
      '善意の配慮で終わらせず、職場の仕組みにする。',
    ],
    imageSrc: '/resources/disability-work-design/internal-disability.webp',
    imageAlt: '内部障害の仕事設計：体調管理と業務条件設計のインフォグラフィック',
    relatedProducts: [
      {
        label: '相談事例集',
        href: `${publicPageHrefById('NS-02')}?case=health-time#case-health-time`,
        reason: '体調変動、通院、回復、評価を一つの相談事例で読み直す。',
      },
      {
        label: '21視点ガイド',
        href: publicPageHrefById('NS-03'),
        reason: '健康時間、勤務量、評価時点を、組織の設計問いへ広げる。',
      },
    ],
    icon: Clock3,
  },
  {
    slug: 'intellectual-disability',
    label: '仕事の見える化',
    examples: '知的障害',
    ordinary: '理解力や判断力の問題として見がちです。',
    discovery:
      '仕事を見て、試して、確認できる形にすると、暗黙の期待や評価基準が整理され、教育しやすい職場になります。',
    workplace: '説明だけのOJT、手順の省略、抽象的な注意、完成イメージがない作業、誰に聞くか分からない状態。',
    change: '見本、写真付き手順、短い単位の練習、確認ポイント、担当範囲、フィードバックのタイミング。',
    social: '分かる形にする設計は、新人、外国語話者、配置転換者にも使える標準化になります。',
    question: '仕事は、見本、手順、確認先、合格ラインが見える形になっているか。',
    homeSummary: '理解力の問題に閉じず、見本、手順、確認先、合格ラインを見える仕事仕様へ変える。',
    falconReading:
      '知的障害の入口で見る核は、理解力の高低ではなく、仕事がどれだけ抽象指示、暗黙手順、曖昧な完了条件に依存しているかです。見て、試して、確認できる仕事に変えると、教育と評価の条件も整います。',
    difficultyFormula: {
      factors: ['理解速度・手順保持・判断支援ニーズ', '抽象指示・変動手順・曖昧な完了条件', '本人任せの相談'],
      result: '仕事の見える化不足',
    },
    solutionFormula: {
      parts: ['手順を見える化', '見本で学ぶ', '実習で確かめる', '企業調整と定着支援'],
      result: '見て・試して・確認できる仕事設計',
    },
    snags: [
      { title: '指示が抽象的', body: '何を、いつまでに、どの品質で行うかが言葉だけで渡される。' },
      { title: '手順と優先順位が変わる', body: '変更理由、戻り先、優先順位が見える形で残らない。' },
      { title: '実習と採用後がつながらない', body: 'できた場面が、採用後の担当範囲や支援条件に翻訳されない。' },
      { title: '相談が機能しない', body: '何を誰に聞けばよいか、失敗前に相談できる形になっていない。' },
    ],
    implementations: [
      { title: '職業場面評価', body: '能力名ではなく、実際の作業、確認、判断、相談の接点を見る。' },
      { title: 'ジョブコーチと手順設計', body: '手順書、見本、チェック、練習単位を現場で試す。' },
      { title: '実習から採用への橋渡し', body: '実習でできた条件を、採用後の役割と支援条件に残す。' },
      { title: '企業へのアプローチ', body: '本人訓練だけでなく、職場側の教え方と評価を整える。' },
      { title: '定着支援と意思決定支援', body: '相談、選択、振り返りを本人だけに背負わせない。' },
    ],
    supportLoop: ['観察', '職業場面で評価', '手順を設計', '実習で試す', '採用後に定着支援で更新'],
    agreements: [
      '理解力不足と決めつけない。',
      '本人だけに説明・判断・相談を背負わせない。',
      'できた実習を、働き続けられる条件へ翻訳する。',
    ],
    imageSrc: '/resources/disability-work-design/intellectual-disability.webp',
    imageAlt: '知的障害の仕事設計：業務構造化と支援設計のインフォグラフィック',
    relatedProducts: [
      {
        label: 'ツールキット',
        href: publicPageHrefById('NS-06'),
        reason: '見本、手順、確認先、ワークシートを、説明だけに頼らない教材へ変える。',
      },
      {
        label: '場面から入る',
        href: publicPageHrefById('NS-04'),
        reason: '仕事が見えない、試せない、確認できない場面を共有する。',
      },
    ],
    icon: ClipboardList,
  },
  {
    slug: 'mental-health',
    label: '回復と参加',
    examples: '精神障害',
    ordinary: '意欲、ストレス耐性、対人不安の問題として見がちです。',
    discovery:
      '回復、仕事量、対人環境、不確実性、評価、相談線を同時に設計すると、本人だけに負荷を戻さない職場になります。',
    workplace: '急な業務量増、評価面談への不安、相談先の不明確さ、対人負荷の集中、復調後に元通りを求める運用。',
    change: '予兆共有、負荷の段階化、相談線、評価の分離、復職・継続時の見直し日、対人負荷の調整。',
    social: '回復を前提にした職場は、メンタルヘルス不調だけでなく、燃え尽きや生活変化にも対応できます。',
    question: '予兆、相談先、仕事量、評価の見直し日は、先に話せる形になっているか。',
    homeSummary: '意欲やストレス耐性の話で止めず、回復、負荷、予兆、相談線、評価を同時に設計する。',
    falconReading:
      '精神障害の入口で見る核は、意欲や対人不安の説明ではなく、回復過程、仕事密度、評価、開示、相談線が互いにどう作用するかです。採用や復職の一点ではなく、働き続ける条件の更新として読みます。',
    difficultyFormula: {
      factors: ['症状変動・回復過程', '高密度・即時・曖昧な仕事設計', '支援接続の遅れ'],
      result: '安心・評価・相談経路の混線',
    },
    solutionFormula: {
      parts: ['負荷を見える化', '予兆で切替', '段階的に戻す', '企業調整と継続支援'],
      result: '回復と参加を両立する仕事設計',
    },
    snags: [
      { title: '波と予兆が見えにくい', body: '崩れる前の変化が、仕事量や相談線と結びついていない。' },
      { title: '仕事の負荷が高密度', body: '即時対応、曖昧な期待、対人負荷、評価不安が重なる。' },
      { title: '開示と相談が危険に感じられる', body: '話すと評価に響く、迷惑をかける、元通りを求められる不安がある。' },
      { title: '支援が単発で切れる', body: '採用、復職、面談の時だけ支援し、継続更新がない。' },
    ],
    implementations: [
      { title: '職業場面評価', body: '症状名ではなく、負荷、予兆、相談、評価の接点を見る。' },
      { title: '企業へのアプローチ', body: '職場側に、負荷調整と相談線を運用として持ってもらう。' },
      { title: '回復リズムの設計', body: '勤務量、休息、段階復帰、見直し日を時間設計にする。' },
      { title: '予兆対応と安全な共有', body: '共有範囲、評価との分離、切替条件を先に合意する。' },
      { title: '就職後継続支援', body: '状況変化に合わせて、支援機関と職場が更新する。' },
    ],
    supportLoop: ['聞く', '構造化', '職業場面で評価', '小さく試す', '予兆で調整', '継続支援で更新'],
    agreements: [
      '努力不足と決めつけない。',
      '本人だけに開示・交渉・調整を背負わせない。',
      '採用決定ではなく、働き続ける条件づくりを成果にする。',
    ],
    imageSrc: '/resources/disability-work-design/mental-health.webp',
    imageAlt: '精神障害の仕事設計：回復と就労継続の両立設計のインフォグラフィック',
    relatedProducts: [
      {
        label: '記事集',
        href: articleLibraryHref('mental-health-work-design'),
        reason: '回復、評価、対人負荷を、社会で共有できる働き方の問いに開く。',
      },
      {
        label: '相談事例集',
        href: publicPageHrefById('NS-02'),
        reason: '一言の相談を、予兆、相談線、仕事量、評価の確認問いへ分ける。',
      },
    ],
    icon: FileText,
  },
  {
    slug: 'developmental-disability',
    label: '仕事仕様と感覚環境',
    examples: '発達障害',
    ordinary: 'コミュニケーション、集中、こだわり、空気を読む力の問題として見がちです。',
    discovery:
      '曖昧な指示、急な変更、感覚刺激、暗黙ルールを仕事仕様として整えると、処理しやすい職場になります。',
    workplace: '口頭で変わる優先順位、例外だらけの手順、騒音や光、割り込み、評価基準が曖昧な仕事。',
    change: '明文化された指示、変更ログ、優先順位、集中できる環境、感覚調整、確認先、フィードバック方法。',
    social: '仕事仕様を明確にすることは、全員のミス削減、引き継ぎ、リモートワークにも役立ちます。',
    question: '仕事の仕様は、口頭や空気ではなく、見返せる形で残っているか。',
    homeSummary: '暗黙、即時、多重、感覚負荷を、本人の適応努力ではなく処理できる仕事仕様へ変える。',
    falconReading:
      '発達障害の入口で見る核は、コミュニケーション力やこだわりの説明ではなく、仕事が暗黙、即時、多重処理、感覚負荷、自己調整にどれだけ依存しているかです。本人を変える前に、仕事仕様と支援ネットワークを処理できる形に変えます。',
    difficultyFormula: {
      factors: ['認知・感覚・対人処理の特性', '暗黙・即時・多重の仕事設計', '本人任せの調整'],
      result: '情報・感覚・変更設計の不足',
    },
    solutionFormula: {
      parts: ['仕事を明示化', '負荷を単線化', '職業場面で評価', '企業調整と定着支援'],
      result: '処理できる仕事設計',
    },
    snags: [
      { title: '暗黙指示と優先順位不明', body: '何を、いつまでに、どの品質で行うかが曖昧で、確認コストと自己否定が増える。' },
      { title: '感覚・対人応答の過負荷', body: '音、光、人の多さ、即時応答が集中と回復を削る。' },
      { title: '割込み・切替・同時処理', body: '予定外の声かけ、電話、並行作業でミスと疲労が積み上がる。' },
      { title: '調整が本人任せ', body: '困りごとを説明できないまま、職場、家庭、支援機関の連携が切れる。' },
    ],
    implementations: [
      { title: '職業場面評価', body: '特性名ではなく、仕事場面のミスマッチを評価する。' },
      { title: 'ジョブコーチと業務設計', body: '手順書、見本、チェックリスト、確認方法を現場で試す。' },
      { title: '企業へのアプローチ', body: '本人だけに交渉を背負わせず、職場調整を支える。' },
      { title: '定着モニタリング', body: '指示、切替、感覚環境、相談ルートを継続的に確認する。' },
      { title: '相談の外部化', body: '何を相談すればよいかを、記録シートと定例面談に変える。' },
    ],
    supportLoop: ['観察', '職業場面で評価', '仕事を設計', '小さく試す', '定着支援で更新'],
    agreements: [
      '努力不足と決めつけない。',
      '本人だけに説明・交渉・調整を背負わせない。',
      '配慮は特別扱いではなく、仕事品質を上げる設計。',
    ],
    imageSrc: '/resources/disability-work-design/developmental-disability.webp',
    imageAlt: '発達障害の仕事設計：業務仕様と支援ネットワーク設計のインフォグラフィック',
    relatedProducts: [
      {
        label: '相談事例集',
        href: `${publicPageHrefById('NS-02')}?case=change-info#case-change-info`,
        reason: '手順変更、優先順位、確認先を、相談事例の読み筋で扱う。',
      },
      {
        label: 'ツールキット',
        href: publicPageHrefById('NS-06'),
        reason: '明文化、変更ログ、感覚環境を、現場で使える道具へ変える。',
      },
    ],
    icon: Wrench,
  },
  {
    slug: 'acquired-brain-injury',
    label: '外部記憶と遂行補助',
    examples: '高次脳機能障害',
    ordinary: '物忘れ、ミス、段取りの悪さ、以前との違いとして見がちです。',
    discovery:
      '記憶や遂行機能に頼りすぎる仕事を、記録、確認、リマインド、分担、段階化で進められる形に変えます。',
    workplace: '口頭依頼、複数締切、同時並行、手順変更、ミスを本人の注意不足として扱う評価。',
    change: 'チェックリスト、外部記憶、タスクボード、ダブルチェック、作業量の段階化、復帰後の再学習。',
    social: '記憶に頼らない仕事は、誰にとっても事故防止、品質管理、引き継ぎの基盤になります。',
    question: '忘れない努力ではなく、忘れても戻れる仕事の仕組みはあるか。',
    homeSummary: '物忘れやミスの話で止めず、記憶に頼らず戻れる工程、確認、外部記憶を設計する。',
    falconReading:
      '高次脳機能障害の入口で見る核は、以前との違いやミスの多さではなく、仕事が記憶、注意、切替、同時処理、言語化、疲労耐性にどれだけ依存しているかです。忘れない努力ではなく、忘れても戻れる工程に変えます。',
    difficultyFormula: {
      factors: ['記憶・注意・遂行・言語・疲労変化', '記憶依存・多重処理・即時判断・安全責任の仕事設計', '本人任せの相談'],
      result: '記憶・注意・工程設計の不足',
    },
    solutionFormula: {
      parts: ['外部記憶化', '工程分割', '注意負荷を調整', '安全基準を合意', '医療・リハ・企業調整'],
      result: '記憶に頼らず進められる仕事設計',
    },
    snags: [
      { title: '記憶と段取りが仕事に合わない', body: '口頭依頼、複数締切、変更手順が頭の中に残される。' },
      { title: '注意・切替・同時処理が過負荷', body: '割込み、並行作業、急な判断で疲労とエラーが増える。' },
      { title: '伝達と自己説明がずれる', body: '本人の説明、職場の期待、リハ側の情報が同じ言葉にならない。' },
      { title: '疲労・安全・相談が後手になる', body: '疲労のサイン、エラー回復、安全基準が先に合意されていない。' },
    ],
    implementations: [
      { title: '職業場面評価', body: '検査名だけでなく、実際の工程、注意、疲労、安全を評価する。' },
      { title: '外部記憶と手順設計', body: 'チェックリスト、タスクボード、リマインド、記録を仕事に埋め込む。' },
      { title: '注意・切替・疲労の設計', body: '単線化、休憩、締切分割、割込み制御を設計する。' },
      { title: '安全とエラー回復', body: 'ダブルチェック、停止基準、戻り方を本人責任だけにしない。' },
      { title: '医療・リハ・企業調整', body: 'リハ情報を職場条件に翻訳し、定着支援で更新する。' },
    ],
    supportLoop: ['観察', '職業場面で評価', '外部記憶と工程を設計', '小さく試す', '定着支援で更新'],
    agreements: [
      'ミスや物忘れを本人の注意不足だけにしない。',
      '記憶に頼る仕事を、戻れる工程へ変える。',
      'AIは候補生成、人間が文脈に合わせて判断する。',
    ],
    imageSrc: '/resources/disability-work-design/acquired-brain-injury.webp',
    imageAlt: '高次脳機能障害の仕事設計：記憶・遂行機能への環境補完のインフォグラフィック',
    relatedProducts: [
      {
        label: '21視点ガイド',
        href: publicPageHrefById('NS-03'),
        reason: '外部記憶、確認、品質管理を、組織の標準設計へ広げる。',
      },
      {
        label: 'ツールキット',
        href: publicPageHrefById('NS-06'),
        reason: 'チェックリスト、タスクボード、確認表を、会議や支援で使える形にする。',
      },
    ],
    icon: BrainCircuit,
  },
  {
    slug: 'intractable-disease',
    label: '健康時間',
    examples: '難病',
    ordinary: '病名の重さ、通院、できる日とできない日の差として見がちです。',
    discovery:
      '症状変動、治療、疲労、回復、締切、勤務量、評価時点を同じ時間軸に置くと、続けられる働き方が見えてきます。',
    workplace: '症状が読めない週、通院後の疲労、繁忙期と治療の衝突、短時間勤務なのに成果評価が曖昧な状態。',
    change: '負荷の山ならし、可変勤務、回復時間、締切再配置、代替担当、評価期間、体調変動時の連絡ルール。',
    social: '健康時間を扱える職場は、病気のある人だけでなく、誰もが長く働ける組織設計になります。',
    question: '同じ一週間の中で、負荷の山と回復時間はどこにあるか。',
    homeSummary: '病名の重さではなく、体調変動、治療、回復、締切、評価期間を同じ時間軸で見る。',
    falconReading:
      '難病の入口で見る核は、病名から必要配慮を引くことではなく、変動する体調と固定的な仕事がどこで衝突するかです。健康時間、開示、仕事量、評価、支援接続を働きながら更新する条件として読みます。',
    difficultyFormula: {
      factors: ['体調の変動性', '仕事の固定性', '困難の見えにくさ', '支援接続の弱さ'],
      result: '健康時間と仕事量の不一致',
    },
    solutionFormula: {
      parts: ['変動を扱える仕事設計', '判断できる開示', 'つながる支援', '継続的な見直し'],
      result: '働ける条件への変換',
    },
    snags: [
      { title: '体調の波', body: '同じ一日、同じ一週間でも動ける時間と回復時間が変わる。' },
      { title: '見えにくさ', body: '疲労、痛み、倦怠感、通院後の影響が周囲に伝わりにくい。' },
      { title: '生活・治療・仕事の衝突', body: '治療、家事、移動、締切、収入、評価が同じ時間に重なる。' },
      { title: '支援の遅れ', body: '困難が大きくなるまで、誰と何を調整するかが決まらない。' },
    ],
    implementations: [
      { title: '運用ルール化', body: '体調変動時の連絡、代替担当、勤務変更を毎回のお願いにしない。' },
      { title: '翻訳', body: '医療・生活の制約を、職場で扱える時間、量、環境、評価へ変える。' },
      { title: '開示判断', body: '誰に、何を、どの範囲で共有するかを本人と関係者で決める。' },
      { title: '仕事設計', body: '負荷の山ならし、締切再配置、回復時間、評価期間を設計する。' },
      { title: '更新', body: '体調、治療、仕事量が変わるたびに条件を見直す。' },
    ],
    supportLoop: ['変動を見える化', '仕事条件へ翻訳', '職場と合意', '小さく試す', '働きながら更新'],
    agreements: [
      '病名だけで支援を決めない。',
      '本人だけに説明責任を押しつけない。',
      '配慮は一度決めて終わりではなく、働きながら更新する。',
    ],
    imageSrc: '/resources/disability-work-design/intractable-disease.webp',
    imageAlt: '難病就労支援の仕事設計：体調変動と就労継続条件のインフォグラフィック',
    relatedProducts: [
      {
        label: '相談事例集',
        href: `${publicPageHrefById('NS-02')}?case=health-time#case-health-time`,
        reason: '疲れやすさ、症状変動、締切、回復を、仕事条件として読み直す。',
      },
      {
        label: '記事集',
        href: publicPageHrefById('NS-05'),
        reason: '健康時間を、障害者支援だけでなく一般の働き方の問いへ広げる。',
      },
    ],
    icon: Clock3,
  },
  {
    slug: 'neurodiversity',
    label: '処理特性の多様性',
    examples: 'ニューロダイバーシティ',
    ordinary: '発達障害の言い換えや、個性の尊重だけの話として見がちです。',
    discovery:
      '認知、感覚、注意、学習、コミュニケーションの違いを、チームの情報設計と仕事配分の設計に変えます。',
    workplace: '会議、資料、雑談、集中時間、変更連絡、アイデアの出し方が一つのスタイルに偏る状態。',
    change: '複数の参加方法、非同期共有、集中時間、感覚環境、得意な処理に合う役割、チーム内の確認ルール。',
    social: '標準的な働き方を一つに固定しないことは、創造性、学習、AI時代の協働にもつながります。',
    question: 'チームは、一つの処理スタイルだけを標準としていないか。',
    homeSummary: '診断名の言い換えではなく、標準的な人材像と仕事要求そのものを問い直す。',
    falconReading:
      'ニューロダイバーシティの入口で見る核は、発達障害を前向きに言い換えることではなく、標準的な人材像、暗黙処理、即時応答、同時処理、高対人負荷が誰を参加しにくくしているかです。強みと困りごとを同時に見て、選べる働き方へ変えます。',
    difficultyFormula: {
      factors: ['標準的な人材像', '暗黙・即時・同時処理・高対人負荷の仕事設計', '本人任せの開示'],
      result: '認知スタイルと職場運用のズレ',
    },
    solutionFormula: {
      parts: ['特性を見える化', '仕事を明示化', '選べる働き方', '安全な相談', '支援ネットワークで実装'],
      result: '多様な処理特性を前提にした仕事設計',
    },
    snags: [
      { title: '言葉だけ置き換える', body: '診断名を新しい言葉で包むだけで、仕事条件が変わらない。' },
      { title: '才能礼賛だけにする', body: '強みだけを語り、困りごとや支援条件を見えなくする。' },
      { title: '本人の適応努力に戻す', body: '標準的な働き方へ合わせる努力を本人だけに求める。' },
      { title: '企業理念で止まる', body: '多様性を掲げても、会議、評価、役割、相談が変わらない。' },
    ],
    implementations: [
      { title: '標準人材像を疑う', body: '即時応答、雑談、同時処理、対人負荷を標準にしすぎていないか見る。' },
      { title: '暗黙を明示へ', body: '期待、評価、変更、確認先を見返せる形にする。' },
      { title: '即時・同時を選択可能へ', body: '非同期、集中時間、複数参加方法、役割分担を用意する。' },
      { title: '心理的安全性を作る', body: '相談してよい範囲、評価との分離、失敗前の確認線を作る。' },
      { title: '支援ネットワークで実装する', body: '理念ではなく、職場、支援機関、教材、定着支援に落とす。' },
    ],
    supportLoop: ['聞く', '構造化', '職業場面で評価', '仕事を設計', '小さく試す', '定着支援で更新'],
    agreements: [
      '個人を普通に近づけるだけではない。',
      '強みと困りごとは同時に見る。',
      '配慮は例外処理ではなく、仕事品質を上げる設計。',
    ],
    imageSrc: '/resources/disability-work-design/neurodiversity.webp',
    imageAlt: 'ニューロダイバーシティの仕事設計：認知特性と環境設計のインフォグラフィック',
    relatedProducts: [
      {
        label: 'なぜ可能か',
        href: publicPageHrefById('NS-07'),
        reason: '処理特性を、ICF相互作用と仕事条件の知識ネットワークとして読む。',
      },
      {
        label: '21視点ガイド',
        href: publicPageHrefById('NS-03'),
        reason: '多様な処理スタイルを、チーム設計、学習、評価、情報共有へ広げる。',
      },
    ],
    icon: Network,
  },
];

const conditionCardAnchorHref = (slug: string) =>
  `${publicPageHrefById('NS-09')}#condition-${slug}`;

const publicConditionWindowFlow = [
  {
    label: '1. 入口',
    title: '障害種類・疾病名から探せる',
    body:
      '支援課題がある時、障害種類や疾病名から調べ始めることは自然です。その入口を職場で確認できる条件へつなぎます。',
  },
  {
    label: '2. 条件',
    title: '特性理解を、仕事の条件へ',
    body:
      '「この特性にはこの配慮」で終わらず、時間、情報、環境、評価、支援の条件まで視界を広げます。',
  },
  {
    label: '3. 場面',
    title: '職場で起きることとして見る',
    body:
      '本人の問題に見えていたことが、仕事の仕様、情報の渡し方、評価の仕組みとして見えてきます。',
  },
  {
    label: '4. 展開',
    title: '相談、研修、一般の働き方にも使う',
    body:
      '障害者支援の入口から、相談事例、21視点、記事、教材へ進むと、一般の仕事設計にも応用できます。',
  },
];

const publicConditionWindowRouteCards = [
  {
    label: '相談を持っている',
    title: '相談事例集へ',
    body: 'このページで見えた職場条件を、短い相談文の読み筋、追加確認、合意前の確認候補へ変えます。',
    href: publicPageHrefById('NS-02'),
    icon: MessagesSquare,
  },
  {
    label: '組織で学びたい',
    title: '21視点ガイドへ',
    body: '10分類で見えた観測点を、雇用管理、専門支援、研修、制度設計の視点へ広げます。',
    href: publicPageHrefById('NS-03'),
    icon: BookOpen,
  },
  {
    label: '同じ場面を見たい',
    title: '場面から入る',
    body: '困りごとが起きる場面を、実在ケースではないモデル場面として本人、企業、支援者で共有します。',
    href: publicPageHrefById('NS-04'),
    icon: Route,
  },
  {
    label: '社会の問いを扱いたい',
    title: '記事集へ',
    body: '障害者支援だけでなく、一般の働き方、評価、情報共有、健康時間の問いとして読み広げます。',
    href: publicPageHrefById('NS-05'),
    icon: FileText,
  },
  {
    label: '会議や研修で使いたい',
    title: 'ツールキットへ',
    body: '職場条件、起きやすい場面、進め方を、図解、場面、ワークシート、進行台本へ変えます。',
    href: publicPageHrefById('NS-06'),
    icon: BrainCircuit,
  },
];

type PublicConditionWindowCard = (typeof publicConditionWindowCards)[number];

function PublicConditionWindowInfographic({ card }: { card: PublicConditionWindowCard }) {
  const Icon = card.icon;

  return (
    <article
      id={`condition-${card.slug}`}
      className="scroll-mt-28 overflow-hidden border border-slate-300 bg-white shadow-sm"
    >
      <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="bg-slate-950 p-5 text-white md:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white text-slate-950">
              <Icon size={19} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                {card.label}
              </p>
              <h3 className="mt-1 break-all text-3xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
                {card.examples}
              </h3>
            </div>
          </div>
          <p className="mt-5 break-all text-base leading-8 text-white/82 [overflow-wrap:anywhere] md:break-normal">
            {card.falconReading}
          </p>
          <div className="mt-5 border-l-4 border-cyan-300 bg-white/8 px-4 py-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
              最初に見えやすい見方
            </p>
            <p className="mt-2 break-all text-sm leading-7 text-white/86 [overflow-wrap:anywhere] md:break-normal">
              {card.ordinary}
            </p>
          </div>
        </div>

        <div className="grid gap-4 bg-[#f7f3e8] p-5 md:p-7">
          <div className="grid gap-4 xl:grid-cols-2">
            <section className="border border-rose-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.14em] text-rose-800">
                起きやすい構造
              </p>
              <div className="mt-3 grid gap-2">
                {card.difficultyFormula.factors.map((factor, index) => (
                  <div key={factor} className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center bg-rose-700 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="min-w-0 break-all border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-900 [overflow-wrap:anywhere] md:break-normal">
                      {factor}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-rose-100 pt-3 text-sm font-semibold leading-6 text-rose-900">
                = {card.difficultyFormula.result}
              </p>
            </section>

            <section className="border border-cyan-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                変え方の方向
              </p>
              <div className="mt-3 grid gap-2">
                {card.solutionFormula.parts.map((part, index) => (
                  <div key={part} className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center bg-cyan-800 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="min-w-0 break-all border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm font-semibold leading-6 text-slate-900 [overflow-wrap:anywhere] md:break-normal">
                      {part}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-cyan-100 pt-3 text-sm font-semibold leading-6 text-cyan-950">
                = {card.solutionFormula.result}
              </p>
            </section>
          </div>

          <section className="border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
              職場で起きやすい4つの場面
            </p>
            <ol className="mt-3 grid gap-3 md:grid-cols-2">
              {card.snags.map((snag, index) => (
                <li key={snag.title} className="border-l-4 border-slate-300 bg-[#fbfaf5] px-3 py-3">
                  <p className="text-sm font-semibold leading-6 text-slate-950">
                    {index + 1}. {snag.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{snag.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <div className="grid gap-5 bg-white p-5 md:p-7 xl:grid-cols-[0.58fr_0.42fr]">
        <section>
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
            支援ネットワークで進める5つの確認
          </p>
          <ol className="mt-4 grid gap-3">
            {card.implementations.map((implementation, index) => (
              <li key={implementation.title} className="grid gap-3 border border-slate-200 bg-[#fbfaf5] p-3 md:grid-cols-[auto_1fr]">
                <span className="grid h-9 w-9 place-items-center bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-6 text-slate-950">
                    {implementation.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">
                    {implementation.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-4">
          <section className="border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
              進め方
            </p>
            <ol className="mt-3 flex flex-wrap items-center gap-2">
              {card.supportLoop.map((step, index) => (
                <li key={`${card.slug}-${step}`} className="contents">
                  <span className="border border-cyan-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800">
                    {index + 1}. {step}
                  </span>
                  {index < card.supportLoop.length - 1 ? (
                    <ArrowRight size={13} className="text-cyan-800" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
          </section>

          <section className="border border-slate-200 bg-[#fbfaf5] p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
              共有しておきたい3つの前提
            </p>
            <ul className="mt-3 grid gap-2">
              {card.agreements.map((agreement) => (
                <li key={agreement} className="flex gap-2 text-sm font-semibold leading-6 text-slate-900">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-cyan-800" aria-hidden="true" />
                  <span>{agreement}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-l-4 border-cyan-800 bg-cyan-50 px-4 py-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
              次に確認する問い
            </p>
            <p className="mt-2 break-all text-sm font-semibold leading-7 text-slate-950 [overflow-wrap:anywhere] md:break-normal">
              {card.question}
            </p>
            <p className="mt-2 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              {card.social}
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

const publicControlSkeletonCards = [
  {
    label: '入口',
    title: '読者の近い場面から入る',
    body: '支援者、企業、研修・政策、SNS反応の入口を分け、最初に読む面を迷わせない。',
    targetId: 'NS-01',
    icon: Route,
  },
  {
    label: '方法',
    title: '相談事例集の奥に考え方を置く',
    body: '相談事例集は実用面、理論ページは根拠面、21視点は学習面として分ける。',
    targetId: 'NS-07',
    icon: Network,
  },
  {
    label: '境界',
    title: '判断ではなく確認できる条件に戻す',
    body: '個別判断、法務・医療判断、配慮妥当性、現在政策の断定へ進まない。',
    targetId: 'NS-07',
    icon: ShieldCheck,
  },
];

const fatigueProductPacket = {
  status: '同じテーマで読む',
  title: '疲れやすい、で止めない',
  tagline: '疲れやすさを、仕事条件で読み直す。',
  lead:
    'これは代表例の一つです。「疲れやすいので配慮が必要です」を、休ませるか頑張るかの二択にしない。通院、締切、修正、回復、情報共有、評価、開示境界を同じ週の仕事条件として並べます。',
  sourceFragment: '「疲れやすいので配慮が必要です」で止まり、休ませるか頑張るかの話になってしまう。',
  otherExamples: [
    {
      label: '情報・手順',
      title: '「コミュニケーションが苦手」で止めない',
      body: '口頭指示、変更連絡、確認先、暗黙ルールを、仕事で確認できる手順へ分ける。',
    },
    {
      label: '評価・継続',
      title: '「意欲が続かない」で止めない',
      body: '役割、見通し、負荷、フィードバック、生活の余白を同じ地図に置く。',
    },
  ],
  routeCards: [
    {
      label: '場面',
      title: '同じ週を見る',
      body: '月末締切、通院、確認待ち、翌朝修正、回復時間を一枚の場面としてつかむ。',
      href: publicPageHrefById('NS-04'),
      icon: Route,
    },
    {
      label: '相談事例集',
      title: 'モデル事例で読む',
      body: '健康時間、仕事接触点、評価と継続に分け、追加確認と小さく試す条件へ進む。',
      href: `${publicPageHrefById('NS-02')}?case=health-time#case-health-time`,
      icon: MessagesSquare,
    },
    {
      label: '理論と発見',
      title: 'なぜ可能かを見る',
      body: '分断された情報を、仕事条件の知識ネットワークへ変える発想を読む。',
      href: publicPageHrefById('NS-07'),
      icon: Network,
    },
    {
      label: '21視点',
      title: '健康時間を学ぶ',
      body: '体調変動を就労可否の判定材料に戻さず、仕事時間と生活の自由度として扱う。',
      href: publicPageHrefById('NS-03'),
      icon: BookOpen,
    },
    {
      label: '記事',
      title: '社会の問いへ開く',
      body: '治療と仕事を同じ一週間として読み、個別テーマを記事と図解へ変える。',
      href: articleLibraryHref('treatment-work-time'),
      icon: FileText,
    },
    {
      label: '教材',
      title: '会議で使える形へ',
      body: '見えない病気と働く教材へ接続し、図解、場面、ワーク、読み下しに変換する。',
      href: publicPageHrefById('NS-06'),
      icon: BrainCircuit,
    },
    {
      label: '改稿',
      title: '読まれ方を見直す',
      body: '誤読、追加質問、沈黙を説明の直し方として扱い、知識の根拠や自動学習にはしない。',
      href: `${previewBase}#social-knowledge-loop`,
      icon: Workflow,
    },
  ],
  readingColumns: [
    {
      label: '健康・仕事・環境の見取り図',
      title: '健康状態だけで閉じない',
      items: ['健康・機能のリズム', '活動の量・順序', '参加と評価', '環境・情報共有', '支援と再翻訳', '時間と制度'],
    },
    {
      label: '仮の読み筋',
      title: '仕事条件としての読み筋',
      items: [
        '回復時間が工程表に入っていない',
        '評価条件が短期の波に引っ張られている',
        '共有範囲が曖昧で、本人が説明負荷を背負っている',
      ],
    },
    {
      label: '反証・別読み',
      title: '決めつけを止める確認',
      items: [
        '一時的な繁忙や確認手順の問題が主かもしれない',
        '業務内容より、情報の受け渡し時点が詰まりかもしれない',
        '本人が共有したくない情報まで前提にしていないか',
      ],
    },
    {
      label: '確認候補の例',
      title: '判断ではなく小さな確認へ',
      items: [
        '個別判断ではなく、関係者が確認するための仮置き例として扱う',
        '一週間だけ通院・締切・修正・回復を同じ表に置く',
        '通院翌日の午後に重い修正が集中しているかを確認する',
        '締切前の一次確認を前倒しできる余地を確認する',
      ],
    },
  ],
  reviewNotes: [
    '考え方を説明するためのモデル事例であり、個別の医学判断、就労可否判断、法的判断、配慮妥当性判断ではない。',
    '病名・障害名から配慮を自動で引く表ではなく、仕事条件を確認する入口として扱う。',
    '一般的な読み方の例として扱い、実際の対応は状況に応じて必要な専門確認へ切り分ける。',
  ],
  snsRevisionRows: [
    {
      label: '誤読',
      body: '病名別の助言や休職判断へ短絡した反応は、記事見出しと境界文を直す材料にする。',
    },
    {
      label: '追加質問',
      body: '通院、回復、締切、説明範囲への質問は、図解ラベルや研修問いの不足として扱う。',
    },
    {
      label: '沈黙',
      body: '反応が薄い場合は、例が抽象的すぎないか、場面カードや一週間表へ戻して直す。',
    },
    {
      label: '反映先',
      body: '相談事例、記事、教材、21視点の説明に戻す。SNS反応そのものを根拠にはしない。',
    },
  ],
};

const publicMethodBridgeRows = [
  {
    label: '分断情報',
    title: '資料や相談を、ばらばらのまま置かない',
    body:
      '本人の言葉、職場の制約、支援者の観察、制度情報を、それぞれの身元を残したまま同じ仕事場面へ戻します。',
  },
  {
    label: '相互作用',
    title: 'ICF準拠の枠組みで、関係を読む',
    body:
      '人、仕事、環境、支援、時間、制度がどの接点で自由度を開き、どこで閉じるかを見ます。',
  },
  {
    label: '出口',
    title: '読める・使えるプロダクトへ渡す',
    body:
      '相談事例集、21視点、記事、場面、認知補助ツールへ変換し、現場や研修で扱える形にします。',
  },
];

const publicSocialLoopSteps = [
  {
    label: '拾う',
    title: '社会の問いを選ぶ',
    body: 'ニュース、研修、SNS、現場の違和感から、扱うべき問いを一つに絞る。',
    icon: Ear,
  },
  {
    label: '読む',
    title: '仕事条件へ翻訳する',
    body: '人だけ、制度だけ、企業だけの話に閉じず、接点と未確認情報を分ける。',
    icon: Compass,
  },
  {
    label: '形にする',
    title: '記事、図解、教材へ分ける',
    body: '読む面、見る面、場で使う面を、同じテーマから作る。',
    icon: ImageIcon,
  },
  {
    label: '戻す',
    title: '反応を改稿の材料にする',
    body: '反応数ではなく、誤読、沈黙、追加質問、共同制作のヒントを見る。',
    icon: Workflow,
  },
];

const publicSceneComicFrames = [
  {
    label: '止まりやすい画面',
    title: '「本人の問題」として見える',
    body: '疲れやすい、伝わりにくい、続かない。言葉は分かるのに、次に何を見るかが止まる。',
  },
  {
    label: '見える化',
    title: '仕事条件に置き直す',
    body: '締切、休憩、情報共有、相談先、評価、生活の余白を同じ場面に並べる。',
  },
  {
    label: '次の問い',
    title: '確認できる形にする',
    body: '誰が、いつ、何を、どの範囲で変えられるかを、関係者が同じ地図で話す。',
  },
];

const sceneCardSampleVoices = [
  {
    label: '本人側',
    title: '月末前後に疲労が残る',
    body: '通院、入力作業、確認待ち、翌朝修正が重なり、休むかどうかだけでは説明しきれない。',
    tone: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  },
  {
    label: '企業側',
    title: '締切と人員余力が心配',
    body: '請求処理の遅れ、確認者の不在、急な代替が重なり、現場は「欠勤リスク」として受け取りやすい。',
    tone: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  {
    label: '支援者側',
    title: '体調説明を仕事条件へ翻訳する',
    body: '勤務量、確認時点、共有範囲、評価条件、見直し日へ分けると、本人に背負わせない相談になる。',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  {
    label: '医療・生活側',
    title: '回復時間と生活の余白を守る',
    body: '治療周期や翌日の回復を、共有してよい範囲で仕事予定へ接続し、無理を前提にしない。',
    tone: 'border-rose-200 bg-rose-50 text-rose-900',
  },
];

const sceneCardReadingSteps = [
  {
    label: '1. 同じ週を見る',
    body: '通院、締切、確認待ち、修正、回復が同じ週に重なっていないかを見る。',
  },
  {
    label: '2. 声を分ける',
    body: '本人、企業、支援者、医療・生活側が何を見ていて、何を見ていないかを分ける。',
  },
  {
    label: '3. 条件へ戻す',
    body: '休むかどうかではなく、締切分散、確認時点、共有境界、評価条件へ戻す。',
  },
  {
    label: '4. 相談事例集で深める',
    body: '近い相談を読み、複数の読み筋、追加確認、情報が増えた後の読みへ進む。',
  },
];

const sceneCardReaderUses = [
  {
    label: '本人・家族',
    body: '自分だけで説明を背負わず、相談に持っていく仕事条件を見つける。',
  },
  {
    label: '支援者',
    body: '本人の言葉と職場の制約を、同じ場面の上で翻訳する。',
  },
  {
    label: '人事・管理職',
    body: '現場の不安を責任論にせず、作業・時間・情報・評価へ分ける。',
  },
  {
    label: '研修・政策',
    body: '抽象テーマを、参加者が話せる短い職場場面へ変える。',
  },
];

const workMapWorksheetScenario = {
  label: 'モデル化した職場場面',
  title: '月末締切が集中する事務チーム',
  stuckPhrase: '「疲れやすいので配慮が必要です」で止まっている',
  situation:
    '月末の入力、確認待ち、口頭変更、翌朝の修正が重なり、本人も上司も「何を変える話なのか」を言語化できていない。',
  aim:
    '本人の状態を軽く扱わず、仕事側で確認できる条件を同じ地図に置く。',
};

const workMapWorksheetPrompts = [
  {
    label: '見えている事実',
    body: 'どの時間帯、作業、連絡、評価場面で負荷が重なっているか。',
  },
  {
    label: 'まだ分からないこと',
    body: '本人、上司、同僚、支援者の誰に確認しないと分からないか。',
  },
  {
    label: '次の小さな試作',
    body: '締切分散、休憩窓、変更連絡、確認方法、評価条件のどれを一つ試すか。',
  },
];

const consultationAudienceFilters = ['すべて', '当事者', '企業', '支援者', '行政・研修'] as const;
const consultationIssueFilters = [
  'すべて',
  '健康時間',
  '情報・手順',
  '開示・共有',
  '支援・翻訳',
  '評価・継続',
  '入口・移行',
  '研修・制度',
] as const;

const studioScenarioConsultationRoutes: Record<
  string,
  {
    audience: (typeof consultationAudienceFilters)[number];
    issue: (typeof consultationIssueFilters)[number];
    caseId: string;
    label: string;
  }
> = {
  'WDS-01': {
    audience: 'すべて',
    issue: '健康時間',
    caseId: 'health-time',
    label: '健康時間 / 通院と回復時間が読めない',
  },
  'WDS-02': {
    audience: 'すべて',
    issue: '情報・手順',
    caseId: 'change-info',
    label: '情報・手順 / 急な予定変更が続く',
  },
  'WDS-03': {
    audience: 'すべて',
    issue: '健康時間',
    caseId: 'sensory-office',
    label: '健康時間 / 職場にいるだけで消耗する',
  },
  'WDS-04': {
    audience: 'すべて',
    issue: '開示・共有',
    caseId: 'disclosure-boundary',
    label: '開示・共有 / どこまで聞いてよいか分からない',
  },
};

function getStudioScenarioConsultationRoute(scenarioId: string) {
  const route = studioScenarioConsultationRoutes[scenarioId];
  if (!route) return undefined;
  const params = new URLSearchParams({
    audience: route.audience,
    issue: route.issue,
    case: route.caseId,
  });
  return {
    ...route,
    href: `${publicPageHrefById('NS-02')}?${params.toString()}#case-${route.caseId}`,
  };
}

const partialQuestionTransformations = [
  {
    title: '診断名・障害種類から直行しない',
    partial: '「この診断名・障害種類なら、どんな配慮が必要ですか」',
    expanded: 'この仕事では、どの条件が閉じると働きづらさが強くなるか。',
  },
  {
    title: '本人の意欲だけで止めない',
    partial: '「本人の意欲が続かないのでしょうか」',
    expanded: '役割、見通し、負荷、フィードバック、相談先は見えているか。',
  },
  {
    title: '上司の善意に乗せきらない',
    partial: '「理解のある上司なら何とかできますか」',
    expanded: '誰が代わっても回る手順、記録、支援のつなぎ方になっているか。',
  },
  {
    title: '制度説明で終わらせない',
    partial: '「制度を説明すれば現場は動きますか」',
    expanded: '制度の目的は、職場で確認できる仕事条件へ翻訳されているか。',
  },
] as const;

const assessmentBreakthroughPanels = [
  {
    label: '1. 入口',
    title: '短い相談文を軽く扱わない',
    body: '一文の中には、本人の状態だけでなく、仕事量、情報共有、評価、支援、生活時間が折りたたまれていることがあります。',
  },
  {
    label: '2. 展開',
    title: '本人の中だけで説明しない',
    body: '「疲れやすい」「続かない」「伝わらない」を、体調、作業、手順、開示、支援、評価の接点に分けると、次に聞くことが変わります。',
  },
  {
    label: '3. 接続',
    title: '相談事例集で読みの伸び幅を見る',
    body: 'このページの地図を持って相談事例集へ戻ると、断片相談が読み筋、追加確認、情報が増えた後の読み、合意前の確認候補へ動く理由が見えます。',
  },
];

const assessmentConceptCards = [
  {
    label: '座標',
    title: 'ICFは、仕事場面を読む座標になる',
    body:
      'ICFは、健康状態だけでなく、心身機能、活動、参加、環境因子などを同じ場面で見るための国際的な枠組みです。就労支援では、本人の状態と仕事の条件を切り離さずに見る土台になります。',
  },
  {
    label: '関係',
    title: '分類だけでは、関係の動きが見えない',
    body:
      '分類は共通語になります。ただし、相談で大事なのは、締切、回復時間、指示、評価、支援、制度がどう絡んでいるかです。項目を並べるだけでは、その絡み方は見えません。',
  },
  {
    label: '読み筋',
    title: '相互作用を、相談の読み筋にする',
    body:
      '調査データ、資料、職場場面から見える典型的な絡み方を整理し、相談者の入口、複数の読み筋、追加確認、合意前の確認候補として読める形にします。',
  },
];

const assessmentOneLineDemo = {
  title: '「疲れやすい」を、7つの確認点に分ける。',
  fragment: '疲れやすいので配慮が必要です。',
  stuck:
    'ここで「本人の体調問題」や「休ませる配慮名」だけに縮めると、仕事側で何を確認すればよいかが見えにくくなります。',
  opened:
    '同じ一文を、健康時間、仕事接触点、情報と手順、開示境界、入口以前、支援と再翻訳、評価と参加の質へ開きます。',
};

const assessmentContactPointQuestions: Record<string, string> = {
  'WM-01': '疲労の山、通院、休憩、翌日の回復は、勤務予定や締切とどう重なるか。',
  'WM-02': 'どの作業、姿勢、移動、道具、確認場面で負荷が強くなるか。',
  'WM-03': '予定変更、締切、確認待ちは、本人が後から見返せる手順になっているか。',
  'WM-04': '仕事に必要な情報と、共有しない情報を、目的別に分けられているか。',
  'WM-05': '応募前、配置前、復職前に、勤務量や生活リズムを試せる余地があるか。',
  'WM-06': '本人の言葉を、誰が仕事条件、手順、評価条件へ翻訳し直しているか。',
  'WM-07': '調整後の働き方は、役割、評価、処遇、将来見通しへつながっているか。',
};

const assessmentFrameworkLayers = [
  {
    label: 'ICF',
    title: '土台の座標',
    body:
      '健康、活動、参加、環境を切り離さず、同じ仕事場面に置くための土台です。細かい分類表を覚えるためではなく、視野を狭めないために使います。',
  },
  {
    label: '7接点',
    title: '相談の入口地図',
    body:
      '短い相談文を、健康時間、仕事接触点、情報と手順、開示境界、入口以前、支援と再翻訳、評価と参加の質へ開きます。相談事例集ではこの地図を使います。',
  },
  {
    label: '21視点',
    title: '深掘りの詳細地図',
    body:
      '7接点で見えた詰まりを、研修、組織設計、専門支援でさらに読むための観測点です。毎回すべてを見るものではなく、必要な視点を開きます。',
  },
];

const assessmentLayerUsage = [
  '相談事例集では、まず7接点で入口をそろえる。',
  '詳しく学ぶ時は、21視点ガイドで該当する観測点を開く。',
  'どちらも、生活機能の見方を土台に、人と仕事の相互作用を読むための粒度違いの地図として使う。',
];

const assessmentMethodEngineRows = [
  {
    label: '1. 入口を壊さない',
    title: '一文を、判断ではなく観察入口として受け取る',
    body:
      '「疲れやすい」「急な変更が苦手」「続かない」を、本人の説明力や意欲の問題にせず、どの仕事場面で何が重なっているかを見る入口にします。',
    visibleOutput:
      '相談事例集では、断片相談、止まりやすい受け取り、複数の読み筋を分けて表示します。',
  },
  {
    label: '2. 情報源を分ける',
    title: '本人・職場・支援・制度を、混ぜずに同じ場面へ置く',
    body:
      '本人の語り、支援者の観察、職場の制約、公的・研究知、実装する人の条件は、同じではありません。混ぜる前に、どの視点から見た情報かを残します。',
    visibleOutput:
      '21視点や記事では、立場の違いを「誰が何を確認するか」へ戻します。',
  },
  {
    label: '3. 関係を読む',
    title: '項目ではなく、時間・作業・情報・評価の絡み方を見る',
    body:
      '重要なのは、症状名や配慮名の一覧ではなく、締切、回復、連絡、相談線、評価、収入、見直し日がどう重なって自由度を閉じるかです。',
    visibleOutput:
      '考え方ページでは7接点、21視点ページでは深掘りの観測点として見せます。',
  },
  {
    label: '4. 仮説を複数残す',
    title: '最初のもっともらしい答えで止めない',
    body:
      '「休憩が必要」「説明が必要」のような単線回答にせず、別の読み筋、足りない情報、反対に考える余地を残します。',
    visibleOutput:
      '相談事例集では、追加確認と、情報が増えた後に読みがどう変わるかを並べます。',
  },
  {
    label: '5. 次の道具へ渡す',
    title: '理解を、会議・研修・記事・教材で使える形へ変える',
    body:
      '読み取った構造は、相談の中だけで終わらせません。共有図、ワークシート、記事、研修、改稿ループへ渡せる形にします。',
    visibleOutput:
      'ツールキットと改稿ループでは、同じ読み方を図解、台本、更新素材へ変換します。',
  },
];

const assessmentKnowledgeLayerCards = [
  {
    label: '本人の言葉',
    title: '短い言葉を、弱い情報として捨てない',
    body:
      '説明が短い、揺れる、感覚的であること自体が、仕事条件へ翻訳し直す必要を示します。',
  },
  {
    label: '支援者・職場の観察',
    title: '善意や経験を、属人化したままにしない',
    body:
      '誰が見ても確認できる作業、時間、情報、相談線、評価条件へ分けます。',
  },
  {
    label: '公的・研究知',
    title: '制度や研究を、現場の問いへ翻訳する',
    body:
      '制度説明や研究知見を、そのまま答えにせず、職場で確認できる観測点へ戻します。',
  },
  {
    label: '実装する人の条件',
    title: '正しさより、回る条件を見る',
    body:
      '本人、上司、人事、支援機関、医療・生活側が、誰の負荷で何を続けられるかを確認します。',
  },
];

const assessmentSocialValueCards = [
  {
    title: '競争ではなく、同じ地図へ戻す',
    body:
      '障害者雇用、就労支援、両立支援、メンタルヘルス、ダイバーシティ施策を、別々のメニューとしてではなく、仕事条件の地図で接続します。',
  },
  {
    title: '支援のすごさを、再利用できる形にする',
    body:
      '熟練者が頭の中で行っている読みを、相談事例、記事、教材、研修で再利用できる粒度へ変換します。',
  },
  {
    title: 'AIを判断者ではなく、読みを広げる補助にする',
    body:
      'AIが結論を所有するのではなく、見落とし、追加確認、別仮説、次の道具化を支える位置に置きます。',
  },
];

const assessmentTheoryProblemCards = [
  {
    label: '問題の本質 01',
    title: '情報は多いが、そのまま拾うと偏りも拾う',
    body:
      '調査研究報告、マニュアル、合理的配慮事例集、雇用事例集、海外情報サイト、制度情報は重要です。ただし公開情報にも作成時点、対象範囲、前提、偏りがあるため、検索して要約するだけでは危うい。',
    icon: FileSearch,
  },
  {
    label: '問題の本質 02',
    title: '複雑さが、人間の認知負荷に押し込まれる',
    body:
      '本人、上司、人事、支援者、医療・生活側が、それぞれの断片を頭の中でつなごうとするほど、説明、調整、記録、判断の負荷が増え、重要な関係が落ちやすくなります。',
    icon: BrainCircuit,
  },
  {
    label: '問題の本質 03',
    title: '早すぎる結論が、設計の余地を閉じる',
    body:
      '「本人の問題」「配慮名の問題」「制度の問題」と早く名づけるほど、仕事量、情報形式、相談線、評価、回復時間など、変えられる条件が見えにくくなります。',
    icon: CircleAlert,
  },
] as const;

const assessmentTheoryNetworkStages = [
  {
    label: '1. 検索で終わらせない',
    title: '偏見を再生産しないために、情報の身元と視点を分ける',
    body:
      '単なる情報検索・要約ツールでは、古い先入観、診断名からの決めつけ、職場側だけの都合、善意の一般論まで一緒に拾ってしまいます。公開された調査研究報告、マニュアル、合理的配慮事例集、雇用事例集、海外情報サイト、制度情報を、そのまま答えにせず、誰の視点の情報か、作成時点と適用範囲はどこか、どこに偏りのリスクがあるかを残します。',
    icon: Layers3,
  },
  {
    label: '2. ICFを正しく使う',
    title: '分類表ではなく、相互作用を読む科学的フレームとして使う',
    body:
      'ICFを項目分類やチェックリストとして使うだけでは、仕事場面の動きは見えません。健康状態、活動、参加、環境因子、支援、時間、制度が互いにどう影響し、仕事条件としてどこが開き、どこが閉じるかを分析することが、この枠組みの本来の力です。',
    icon: Network,
  },
  {
    label: '3. 文脈を多次元に読む',
    title: 'AIの文脈読解力で、人間が保持しきれない関係を候補化する',
    body:
      'AIの価値は、文章を短く要約することだけではありません。複数の資料、立場、時系列、暗黙の前提、反対仮説、欠けている確認点を同時に読み、人間が一度に保持しきれない多次元の文脈を、検討可能な関係候補として広げます。ただしAIは判断者ではなく、読みを広げる補助です。',
    icon: Sparkles,
  },
  {
    label: '4. 人間の側へ戻す',
    title: '高度な知識ネットワークを、人間が使えるインターフェイスへ変える',
    body:
      'AIの高度な認知能力で成立したネットワークは、そのままでは人間や社会が使いにくい。相談事例、21視点、記事、場面ストーリー、図解、ワークシート、進行台本など、言語と非言語の認知を補助・拡張する形へ変換します。',
    icon: Route,
  },
] as const;

const assessmentTheoryProductInterfaces = [
  {
    label: '相談事例集',
    title: '断片相談から、複数の見立てへ',
    body:
      '短い相談を入口に、止まりやすい受け取り、別の読み筋、追加確認、情報が増えた後の読みへ展開する。',
    pageId: 'NS-02',
    icon: MessagesSquare,
  },
  {
    label: '21視点',
    title: '未来の仕事設計へ広げる',
    body:
      '個別相談の枠を超え、企業経営、雇用管理、専門支援、制度設計に使える問いの地図として読む。',
    pageId: 'NS-03',
    icon: BookOpen,
  },
  {
    label: '場面から入る',
    title: '複雑な関係を、ストーリーでつかむ',
    body:
      '言語説明だけでは共有しにくいズレを、モデル場面や4コマで直感的に見える形へ変える。',
    pageId: 'NS-04',
    icon: ImageIcon,
  },
  {
    label: '働き方の問いをひらく記事集',
    title: '社会の問いを、関係として読み直す',
    body:
      'ニュース、制度、研究、現場の違和感を、賛否ではなく観測点と次に話す問いへ変換する。',
    pageId: 'NS-05',
    icon: Telescope,
  },
  {
    label: '認知補助ツールキット',
    title: '言葉以外のチャンネルへ展開する',
    body:
      '図解、ワークシート、読み下し、進行台本、研修素材として、認知負荷を下げる道具へ変換する。',
    pageId: 'NS-06',
    icon: Wrench,
  },
] as const;

const assessmentTheoryBoundaryCards = [
  {
    title: '個別判断はしない',
    body:
      '医学判断、法的判断、就労可否判断、合理的配慮の妥当性判断を、このページやAIが所有しません。',
  },
  {
    title: '病名から配慮へ直行しない',
    body:
      '診断名や障害名は重要な情報ですが、支援の結論ではありません。仕事、環境、支援、時間、制度との関係で読みます。',
  },
  {
    title: 'AIを判断者にしない',
    body:
      'AIの役割は、見落としや複数仮説、追加確認、教材化を支えることです。最終判断や公開承認の代替にはしません。',
  },
  {
    title: '根拠と使い道を混ぜない',
    body:
      '既存情報、研究、制度、現場知は、根拠の身元や新しさを分けて扱います。社会に出す表現は別に安全確認します。',
  },
] as const;

const modelConsultationDemos = [
  {
    id: 'change-info',
    audience: '当事者',
    category: '情報・手順',
    label: '急な予定変更が続く',
    title: '朝礼後の予定変更で作業が止まる',
    fragment: '「急な変更が苦手です」で話が止まり、本人の問題として扱われそうになる。',
    partialQuestion: '急な変更が苦手な人には、どう配慮すればよいですか。',
    expandedQuestion: '変更情報は、誰が、いつ、何をする手順として残っているか。',
    stretch: '本人の苦手さから、変更連絡、確認先、評価の重なりへ広げる。',
    contactPoints: ['情報と手順', '支援と再翻訳', '評価と継続'],
    hypotheses: [
      {
        title: '変更情報が作業手順に変換されないまま流れている',
        body: '急な変更そのものより、誰が、いつ、何を変えるかが作業手順に落ちていない可能性を見る。',
      },
      {
        title: '相談先はあるが、翻訳する役割が空いている',
        body: '上司、人事、支援者の誰かは関わっていても、困りごとを仕事条件へ翻訳する役割が曖昧な可能性を見る。',
      },
    ],
    questions: [
      '変更は口頭だけか、後で確認できる形があるか。',
      '変更後に、誰へ何を確認すればよいかが決まっているか。',
      '予定変更が評価や注意に直結していないか。',
    ],
    addedInfo: '変更は朝礼後に口頭で伝えられ、変更後の作業順は残らない。確認先は日によって違い、本人は「また聞くと評価が下がる」と感じて途中で止まる。',
    narrowedReading:
      '詰まりは「急な変更が苦手」だけではない。変更後の正解が職場に残らず、確認行動が評価不安と結びつくため、本人は確認したくても動けなくなっている。',
    nextMoves: [
      '変更連絡を「変更点、期限、確認先」の3行テンプレートにする。',
      '確認してよい回数やタイミングを明示し、確認行動を注意対象にしない。',
      '1週間だけ、変更後の手戻り、確認回数、作業停止時間を同じ表で見る。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。実際の勤務評価、人事判断、診断情報、職場内の対立を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'health-time',
    audience: '当事者',
    category: '健康時間',
    label: '通院と回復時間が読めない',
    title: '体調変動と締切が同じ週に重なる',
    fragment: '「疲れやすいので配慮が必要です」で止まり、休ませるか頑張るかの話になってしまう。',
    partialQuestion: '疲れやすい人には、どのくらい休ませればよいですか。',
    expandedQuestion: '通院、締切、修正作業、回復時間は同じ週でどう重なっているか。',
    stretch: '休むか頑張るかの二択から、仕事時間と健康時間の設計へ広げる。',
    contactPoints: ['健康時間', '仕事接触点', '評価と継続'],
    hypotheses: [
      {
        title: '回復時間が仕事の予定に組み込まれていない',
        body: '通院、疲労、締切、翌日の回復が別々に扱われ、同じ予定表で見えていない可能性を見る。',
      },
      {
        title: '評価条件が短期の波に引っ張られている',
        body: '一時的な体調変動と、継続的な役割遂行の評価が混ざっている可能性を見る。',
      },
    ],
    questions: [
      '負荷が高い作業は、通院前後や回復が必要な日に重なっていないか。',
      '一時的に難しい日と、継続的に難しい作業は分けて見られているか。',
      '本人が回復予定を共有できる安全な範囲はどこか。',
    ],
    addedInfo: '月末締切の週に通院が入り、翌日に修正作業が集中する。本人は欠勤を避けたいが、午後に作業速度が落ち、翌朝まで疲労が残る。',
    narrowedReading:
      '必要なのは「休ませるかどうか」の二択ではない。通院、締切、修正、翌日の回復が同じ週に山を作っており、健康時間を工程表に入れていないことが詰まりになっている。',
    nextMoves: [
      '通院翌日の午後には重い修正を置かない週を1回試す。',
      '締切前の一次確認を前倒しし、通院後に手戻りの山を作らない。',
      '作業量だけでなく、工程を変えた後の安定性と翌日の回復を一緒に見る。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。病状、治療内容、勤務継続の判断、法的な配慮判断に踏み込む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'evaluation',
    audience: '企業',
    category: '評価・継続',
    label: '意欲が続かないと言われる',
    title: '評価面談で「続かない」が繰り返される',
    fragment: '「本人の意欲が続かない」で止まり、何を変えればよいかが分からない。',
    partialQuestion: '本人の意欲をどう高めればよいですか。',
    expandedQuestion: '評価条件、練習機会、判断範囲、フィードバックは見えているか。',
    stretch: '本人の姿勢から、育成と評価の条件へ広げる。',
    contactPoints: ['評価と継続', '入口以前', '支援と再翻訳'],
    hypotheses: [
      {
        title: '評価条件と育成条件が本人に見えていない',
        body: '成果だけが求められ、練習機会、フィードバック、役割の見通しが不足している可能性を見る。',
      },
      {
        title: '入口以前の期待調整が不足している',
        body: '採用時や配置時の説明と、実際の業務の粒度が合っていない可能性を見る。',
      },
    ],
    questions: [
      '評価される成果は、本人が事前に理解できる形で示されているか。',
      '練習できる場面と、評価される場面は分かれているか。',
      '支援者や上司は、同じ基準でフィードバックしているか。',
    ],
    addedInfo: '本人は注意された直後は改善するが、2週間ほどで元に戻る。手順書はあるが、どこまで自分で判断してよいかは曖昧で、注意は毎回「もっと主体的に」と表現される。',
    narrowedReading:
      '「意欲が続かない」のではなく、本人が判断してよい範囲と相談すべき範囲が見えず、注意だけが周期的に戻っている。評価語を変える前に、判断範囲と練習場面を分ける必要がある。',
    nextMoves: [
      '「主体性」ではなく、今期見る評価項目を1つに絞る。',
      '判断してよい範囲、相談する範囲、相談先を1枚に分ける。',
      '注意履歴ではなく、できた条件、止まった条件、次に変える条件を同じ記録に残す。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。実際の評価、配置転換、退職・継続判断を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'disclosure-boundary',
    audience: '企業',
    category: '開示・共有',
    label: 'どこまで聞いてよいか分からない',
    title: '開示を受けたが、仕事の話にできない',
    fragment: '本人から事情を聞いたが、踏み込みすぎが怖く、結局「無理しないで」で止まる。',
    partialQuestion: 'どこまで病状や事情を聞いてよいですか。',
    expandedQuestion: '仕事上必要な確認事項と、共有しない個人情報を分けられているか。',
    stretch: '聞くか聞かないかから、仕事条件として確認する範囲へ広げる。',
    contactPoints: ['開示境界', '情報と手順', '支援と再翻訳'],
    hypotheses: [
      {
        title: '聞くべきことが個人情報ではなく仕事条件として整理されていない',
        body: '詳しい事情を聞くか聞かないかではなく、仕事上確認すべき範囲が設計されていない可能性を見る。',
      },
      {
        title: '上司が一人で判断を抱えている',
        body: '本人への配慮と職場運営の両方を、直属上司だけで処理している可能性を見る。',
      },
    ],
    questions: [
      '仕事上必要な確認事項は、時間、作業、連絡、休憩、評価のどれか。',
      '本人が共有してよい範囲と、共有したくない範囲は分けられているか。',
      '上司以外に、人事や外部支援へ相談できる経路はあるか。',
    ],
    addedInfo: '上司は本人の詳しい事情を聞くことを避け、業務変更はその場の判断で行っている。同僚には理由が説明されず、本人も「どこまで話されたのか」が分からない。',
    narrowedReading:
      '必要なのは事情の深掘りではない。本人が共有してよい範囲、職場が知る必要のある仕事条件、同僚へ説明する業務手順が混ざっているため、本人の安心と職場運用の両方が不安定になっている。',
    nextMoves: [
      '本人に聞く項目を「仕事で困る場面」「共有してよい範囲」「共有しない範囲」に分ける。',
      '同僚へ伝える内容を、個人事情ではなく業務手順の変更として整える。',
      '上司が一人で抱えないよう、人事や支援者に相談する条件を先に決める。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。個人情報の扱い、職場内説明、合理的配慮の合意内容を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'manager-overload',
    audience: '企業',
    category: '支援・翻訳',
    label: '配慮が上司任せになる',
    title: '配慮対応が直属上司の善意に偏る',
    fragment: '上司が頑張って調整しているが、異動や繁忙期で続かなくなる。',
    partialQuestion: '上司がもっと理解すれば続きますか。',
    expandedQuestion: '上司が毎回判断している対応を、誰が代わっても回る手順にできるか。',
    stretch: '上司の善意から、職場運用と負荷分担へ広げる。',
    contactPoints: ['支援と再翻訳', '仕事接触点', '評価と継続'],
    hypotheses: [
      {
        title: '配慮が運用手順ではなく属人的な対応になっている',
        body: '上司の理解や善意はあっても、誰が代わっても回る業務手順になっていない可能性を見る。',
      },
      {
        title: '職場全体の負荷設計が見えない',
        body: '本人への支援だけを見て、上司や同僚の調整負荷が設計されていない可能性を見る。',
      },
    ],
    questions: [
      '上司が毎回判断している作業は何か。',
      '同じ対応を別の人が引き継げる記録や手順があるか。',
      '周囲の負担感や不公平感を確認する場はあるか。',
    ],
    addedInfo: '上司が休憩時間、作業配分、同僚への説明、支援者連絡を毎回判断している。繁忙期は確認が遅れ、同僚は「なぜ自分だけ負担が増えるのか」と感じ始めている。',
    narrowedReading:
      '配慮が上司の能力や善意に乗っている限り、異動や繁忙期で崩れる。必要なのは理解ある上司ではなく、代替者、記録、同僚への業務説明、見直し日を含む運用手順。',
    nextMoves: [
      '上司が抱えている判断を「休憩、作業配分、説明、支援者連絡」に分解する。',
      '繁忙期の代替確認者と記録場所を決める。',
      '同僚に伝える内容を個人事情ではなく業務手順にする。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。職場内の対立、負担配分、人事評価に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'sensory-office',
    audience: '当事者',
    category: '健康時間',
    label: '職場にいるだけで消耗する',
    title: '音、光、人の動きで集中が切れる',
    fragment: '仕事の内容は分かるのに、職場にいるだけで疲れ、午後にはミスが増える。',
    partialQuestion: '集中力を上げるにはどうすればよいですか。',
    expandedQuestion: '音、光、割り込み、場所、時間帯が作業品質にどう影響しているか。',
    stretch: '本人の集中力から、環境負荷と回復時間の配置へ広げる。',
    contactPoints: ['仕事接触点', '健康時間', '開示境界'],
    hypotheses: [
      {
        title: '作業能力ではなく環境負荷が仕事時間を削っている',
        body: '仕事内容の理解とは別に、音、光、視線、移動、割り込みが集中の持続時間を狭めている可能性を見る。',
      },
      {
        title: '環境調整を本人のわがままと見られる不安がある',
        body: '本人が困りごとを言語化しても、職場条件として扱われず、我慢の話になっている可能性を見る。',
      },
    ],
    questions: [
      '消耗が強い時間帯、場所、音、光、割り込みはどれか。',
      '同じ作業を別の場所や時間で行うと変化があるか。',
      '職場に伝えてよい表現と、伝えたくない表現は分けられているか。',
    ],
    addedInfo: '午前は作業できるが、午後は電話音、人の出入り、急な声かけが重なる。別室で30分作業するとミスが減るが、本人は「わがまま」と見られるのを恐れて言い出せない。',
    narrowedReading:
      '集中力の問題ではなく、環境刺激が作業品質と回復時間を削っている。別室という配慮名ではなく、どの時間帯のどの作業をどの環境で行うと品質が保てるかを見る必要がある。',
    nextMoves: [
      '午後の確認作業だけ30分静かな場所で試す。',
      '電話対応時間と集中作業時間を分け、ミスの変化を見る。',
      '説明は感覚特性ではなく作業品質を保つ条件として整える。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。感覚特性、職場内説明、勤務場所変更の合意を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'trial-to-employment',
    audience: '支援者',
    category: '入口・移行',
    label: '実習ではできたのに続かない',
    title: '実習成功と本採用後のつまずきがつながらない',
    fragment: '実習では評価が高かったが、採用後に同じように働けず、本人の問題として戻ってくる。',
    partialQuestion: '実習ではできたのに、なぜ採用後にできないのですか。',
    expandedQuestion: '実習時と採用後で、作業量、指示方法、相談先、支援頻度はどう変わったか。',
    stretch: '本人の変化から、成功条件の再現性へ広げる。',
    contactPoints: ['入口以前', '仕事接触点', '支援と再翻訳'],
    hypotheses: [
      {
        title: '実習場面と本採用後の仕事条件が違う',
        body: '実習では手順、時間、支援者の関与が整っていたが、本採用後には条件が変わっている可能性を見る。',
      },
      {
        title: '成功条件が記録されていない',
        body: '何がうまくいったかが本人の能力としてだけ扱われ、再現できる条件として残っていない可能性を見る。',
      },
    ],
    questions: [
      '実習時と採用後で、作業量、指示方法、相談先はどう変わったか。',
      '実習でうまくいった条件は記録されているか。',
      '支援者の関与が減った後、誰が翻訳役を担うか。',
    ],
    addedInfo: '実習中は支援者が週2回来て、作業を細かく分け、迷った時の確認先も決まっていた。採用後は作業量が増え、上司は忙しく、本人はまとめて指示を受けている。',
    narrowedReading:
      '実習で見えたのは「本人ならできる」だけではなく、作業量、指示粒度、確認先、支援頻度がそろった時の成功条件。本採用後に崩れたのは能力ではなく、成功条件の引き継ぎかもしれない。',
    nextMoves: [
      '実習時の成功条件を、作業量、指示方法、確認先、支援頻度に分けて職場へ戻す。',
      '本採用後に増えた仕事条件を1週間だけ記録する。',
      '支援者がいない日の確認先と、確認してよい時間を決める。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。採用継続、職場評価、支援機関の関与範囲を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'support-agency-delay',
    audience: '支援者',
    category: '支援・翻訳',
    label: '支援がいつも後手になる',
    title: '問題が大きくなってから支援機関につながる',
    fragment: '職場から連絡が来る時には、すでに本人も上司も疲弊している。',
    partialQuestion: '問題が起きたら支援機関に連絡すればよいですか。',
    expandedQuestion: '問題が大きくなる前に、どのサインを誰が軽く相談できるか。',
    stretch: '事後対応から、早期サインと軽い相談入口へ広げる。',
    contactPoints: ['支援と再翻訳', '健康時間', '評価と継続'],
    hypotheses: [
      {
        title: '早期サインが共有される経路がない',
        body: '欠勤、ミス、相談減少などの小さな変化が、支援につながる前に職場内で抱え込まれている可能性を見る。',
      },
      {
        title: '支援依頼の基準が重すぎる',
        body: '支援を呼ぶことが大ごとになり、軽い段階で相談しにくい構造がある可能性を見る。',
      },
    ],
    questions: [
      '支援に連絡する前に、どのサインが出ていたか。',
      '上司が軽く相談できる入口はあるか。',
      '本人の同意範囲と職場からの相談範囲は整理されているか。',
    ],
    addedInfo: '欠勤が増える前に、休憩が増え、会話が減り、確認ミスが出ていた。上司は「これくらいで支援機関へ連絡してよいのか」と迷い、本人も大ごとにされる不安で黙っていた。',
    narrowedReading:
      '後手になる原因は、サインが見えないことだけではない。軽い段階で相談すると本人を問題化してしまう、という不安があり、支援依頼の前に職場条件を一緒に点検する入口が必要。',
    nextMoves: [
      '欠勤前のサインを「休憩、会話、確認ミス」のように観察項目へ変える。',
      '本人同意の範囲で、職場が軽く相談できる内容を事前に決める。',
      '支援連絡ではなく、職場条件チェックとして月1回の短い確認を置く。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。本人同意、支援機関との情報共有、危機対応が必要な場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'worker-employer-conflict',
    audience: '支援者',
    category: '開示・共有',
    label: '本人希望と職場都合がぶつかる',
    title: '本人の希望と企業の運用制約が同じ表に乗らない',
    fragment: '本人は在宅を希望し、企業は出社を求め、支援者はどちらにも説明しきれない。',
    partialQuestion: '在宅を認めるべきか、出社を求めるべきか。',
    expandedQuestion: '通勤、教育、連携、評価を分けると、どの組み合わせが試せるか。',
    stretch: '二択対立から、仕事条件の組み合わせへ広げる。',
    contactPoints: ['開示境界', '仕事接触点', '支援と再翻訳'],
    hypotheses: [
      {
        title: '希望と制約が価値判断として衝突している',
        body: '在宅か出社かの二択になり、どの仕事条件なら成立するかが分解されていない可能性を見る。',
      },
      {
        title: '支援者が調停者になりすぎている',
        body: '支援者が双方の主張を受け止めるだけで、仕事設計の共通表へ翻訳する役割が過重になっている可能性を見る。',
      },
    ],
    questions: [
      '出社が必要な作業と、在宅でも成立する作業は分けられているか。',
      '本人が在宅を希望する理由は、通勤、環境、体調、集中のどれか。',
      '企業が出社を求める理由は、連携、管理、安全、教育のどれか。',
    ],
    addedInfo: '本人は通勤後に疲労が強く、企業は新人教育とチーム連携のため出社を重視している。双方とも理由はあるが、在宅か出社かの主張だけが前に出ている。',
    narrowedReading:
      '対立しているのは価値観だけではない。通勤後の回復、教育を受ける時間、チーム連携、評価の見え方を分けると、全部在宅か全部出社ではない設計余地が見えてくる。',
    nextMoves: [
      '出社日ごとに、目的を教育、連携、確認のどれか一つに絞る。',
      '通勤後すぐに重い作業を置かず、最初の30分を回復と確認に使う。',
      '集中作業日は在宅、教育日は出社という2週間の組み合わせを試す。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。勤務形態、雇用契約、合理的配慮の合意に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'training-menu',
    audience: '行政・研修',
    category: '研修・制度',
    label: '研修メニューが作れない',
    title: '従来の障害者雇用研修で扱えない層が増える',
    fragment: '企業向け研修を求められるが、制度説明や事例紹介だけでは現場の判断に届かない。',
    partialQuestion: '従来枠に収まらない人向け研修は何を教えればよいですか。',
    expandedQuestion: '受講者が明日、どの職場場面をどう確認できるようにするか。',
    stretch: '制度説明から、職場場面を読む演習へ広げる。',
    contactPoints: ['入口以前', '情報と手順', '支援と再翻訳'],
    hypotheses: [
      {
        title: '研修が制度知識と現場設計をつないでいない',
        body: '制度や配慮の説明はあるが、企業が自分の職場条件へ置き直す練習が不足している可能性を見る。',
      },
      {
        title: '対象者像を広げるほど話が抽象化している',
        body: '従来枠に収まらない就労困難性を扱おうとして、誰のどの場面を扱う研修かがぼやけている可能性を見る。',
      },
    ],
    questions: [
      '受講者は人事、管理職、支援者のどれか。',
      '研修後にできるようにしたい判断は何か。',
      '扱う場面は、採用、定着、休職復職、業務設計のどれか。',
    ],
    addedInfo: '企業担当者と企業を支援する支援者が混在し、45分程度で現場に持ち帰れる内容が求められている。受講者は制度の全体像より、明日どの場面で何を聞けばよいかを求めている。',
    narrowedReading:
      'この研修で価値が出るのは、知識を増やすことではなく、断片相談を仕事条件へ置き直す体験を共有すること。企業担当者と支援者が同じ場面を見れば、制度説明より先に会話の土台がそろう。',
    nextMoves: [
      '45分研修を「見方の転換」「モデル相談1件」「職場へ持ち帰る3質問」に絞る。',
      '制度説明は冒頭5分に留め、モデル相談を仕事条件へ変える演習に時間を使う。',
      '受講後の成果物を、明日職場で聞く確認質問3つにする。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。特定自治体、企業、研修委託の仕様や契約に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'policy-implementation-gap',
    audience: '行政・研修',
    category: '研修・制度',
    label: '制度説明が現場に届かない',
    title: '施策の言葉と職場の困りごとが接続しない',
    fragment: '施策資料は整っているのに、企業や支援現場では何を変える話か分からない。',
    partialQuestion: '制度をもっと分かりやすく説明すれば現場は動きますか。',
    expandedQuestion: '制度の目的は、職場で確認できるどの仕事条件へ変換されているか。',
    stretch: '情報提供から、現場の確認手順と成果の見方へ広げる。',
    contactPoints: ['情報と手順', '支援と再翻訳', '評価と継続'],
    hypotheses: [
      {
        title: '施策の目的が仕事条件へ翻訳されていない',
        body: '制度上の説明と、職場で確認する時間、作業、支援、評価の接点が分かれている可能性を見る。',
      },
      {
        title: '成果指標が現場の変化を拾えていない',
        body: '件数や参加者数は見えても、職場の設計がどう変わったかが見えない可能性を見る。',
      },
    ],
    questions: [
      '施策の対象は誰のどの行動変化か。',
      '企業が明日確認できる仕事条件は何か。',
      '成果は件数だけでなく、相談の早期化や手戻り減少で見られるか。',
    ],
    addedInfo: '説明会の参加者は多いが、終了後の企業相談は制度手続きに偏り、職場内の条件変更に進みにくい。担当者は制度名は覚えても、現場管理職へ何を聞けばよいかが残っていない。',
    narrowedReading:
      '足りないのは分かりやすい制度説明だけではない。制度の目的を、職場で確認できる時間、作業、支援、評価の手順へ翻訳する中間教材がないため、現場の行動が変わらない。',
    nextMoves: [
      '制度説明の後に、モデル相談1件を職場条件へ置き直す演習を入れる。',
      '参加後アンケートに、明日現場で確認する仕事条件を1つ書いてもらう。',
      '後日の相談記録を、手続き相談と仕事条件相談に分けて見る。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。行政施策、予算、委託仕様、制度解釈に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'resource-network',
    audience: '行政・研修',
    category: '支援・翻訳',
    label: '地域資源がつながらない',
    title: '相談窓口はあるのに、職場の条件変更まで届かない',
    fragment: '地域には支援機関があるが、企業・医療・福祉・雇用の情報がつながらない。',
    partialQuestion: '相談窓口を増やせばつながりますか。',
    expandedQuestion: '誰が健康・生活情報を仕事条件へ翻訳し、企業相談と本人相談をつなぐか。',
    stretch: '資源の量から、翻訳役と接続手順へ広げる。',
    contactPoints: ['支援と再翻訳', '健康時間', '入口以前'],
    hypotheses: [
      {
        title: '窓口間の役割分担が利用者から見えない',
        body: '相談先は複数あっても、誰が仕事条件へ翻訳するのかが分からない可能性を見る。',
      },
      {
        title: '健康時間と仕事時間をつなぐ役割が抜けている',
        body: '医療や生活の情報と、職場で変えられる条件が別々に扱われている可能性を見る。',
      },
    ],
    questions: [
      '本人、企業、支援機関のどこで情報が止まっているか。',
      '健康・生活の情報を、仕事条件へ翻訳する担当はいるか。',
      '企業が相談できる入口と、本人が相談できる入口はつながっているか。',
    ],
    addedInfo: '本人は医療側へ体調を相談し、企業は雇用側へ対応を相談するが、同じ職場場面として共有されない。支援機関は両方を知っていても、何を職場条件として戻すかが曖昧になっている。',
    narrowedReading:
      '地域資源が足りないのではなく、健康・生活・雇用の情報を同じ仕事場面へ戻す翻訳役が抜けている。窓口を増やすほど、誰が仕事条件へ接続するのかが見えにくくなる。',
    nextMoves: [
      '窓口一覧ではなく、誰が何を仕事条件へ翻訳するかを1枚にする。',
      '企業相談と本人相談を、同じ7接点の項目で記録する。',
      '地域会議では制度紹介より、1つのモデル相談を共同で読む。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。個別支援計画、医療情報、自治体連携、機関連携協定に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'return-to-work-step',
    audience: '当事者',
    category: '健康時間',
    label: '復職後の戻り方が分からない',
    title: '休職明けに、最初から以前と同じ量を求められる',
    fragment: '「もう復職したのだから通常勤務で大丈夫ですか」で止まり、戻り方の設計が見えない。',
    partialQuestion: '復職した人には、いつから通常業務を任せればよいですか。',
    expandedQuestion: '回復時間、作業量、判断範囲、評価期間を段階として分けられているか。',
    stretch: '復職できたかどうかから、戻り方の段階設計へ広げる。',
    contactPoints: ['健康時間', '入口以前', '評価と継続'],
    hypotheses: [
      {
        title: '復職の可否と仕事量の戻し方が混ざっている',
        body: '出勤できることと、以前と同じ負荷を継続できることが同じ判断として扱われている可能性を見る。',
      },
      {
        title: '評価期間が短すぎる',
        body: '初週の様子だけで安定性を判断し、疲労の蓄積や回復リズムを見落としている可能性を見る。',
      },
    ],
    questions: [
      '復職直後に戻す作業量、判断範囲、対人負荷は分けているか。',
      '疲労が翌日以降に出るかを確認する期間はあるか。',
      '上司、人事、産業保健、支援者の確認役割は分かれているか。',
    ],
    addedInfo: '初週は出勤できたが、2週目に修正作業と会議が重なり、午後の集中が落ちた。本人は「また休むと思われたくない」と言い出しにくく、上司は出勤できているなら戻せると見ている。',
    narrowedReading:
      '復職後のつまずきは、本人の覚悟不足ではない。出勤、作業量、会議負荷、判断範囲、翌日の回復を同じ速度で戻しているため、見た目の復職と継続できる仕事条件がずれている。',
    nextMoves: [
      '戻す業務を「定型」「判断あり」「対人負荷あり」に分ける。',
      '2週間だけ、作業量、会議負荷、翌日の疲労を別々に記録する。',
      '評価日は初週ではなく、2週目以降の回復リズムを見て置く。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。復職可否、医療情報、就業判定、勤務条件変更を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'morning-drowsiness',
    audience: '当事者',
    category: '健康時間',
    label: '午前中の眠気で注意される',
    title: '朝の立ち上がりが遅く、怠けているように見られる',
    fragment: '「朝が弱いので仕方ないです」で止まり、仕事の組み方の話にならない。',
    partialQuestion: '朝が弱い人には、始業時間を遅らせればよいですか。',
    expandedQuestion: '眠気、服薬、通勤、始業直後の作業負荷はどう重なっているか。',
    stretch: '始業時刻だけでなく、朝の仕事負荷と健康時間の接点へ広げる。',
    contactPoints: ['健康時間', '仕事接触点', '開示境界'],
    hypotheses: [
      {
        title: '朝の作業配置が体調の波とぶつかっている',
        body: '始業直後に判断や対人対応が集中し、立ち上がりの時間が作業品質へ直結している可能性を見る。',
      },
      {
        title: '説明できる範囲が整理されていない',
        body: '本人が詳しい事情を話すか黙るかの二択になり、仕事上必要な確認事項に変換されていない可能性を見る。',
      },
    ],
    questions: [
      '眠気が強い時間帯と、ミスが増える作業は一致しているか。',
      '始業直後に判断作業や電話対応が集中していないか。',
      '本人が共有してよい範囲で、作業配置の相談ができるか。',
    ],
    addedInfo: '午前10時頃から作業速度が安定するが、始業直後に電話対応と確認作業が重なる。午後の同じ作業ではミスが少なく、本人は詳しい体調説明を職場に出すことには抵抗がある。',
    narrowedReading:
      '問題は「朝が弱い」だけではない。立ち上がり時間に判断作業と電話対応が重なり、体調詳細を言わないと調整できない構造になっていることが詰まりになっている。',
    nextMoves: [
      '始業後30分は定型作業から始める週を試す。',
      '電話対応と確認作業を午前10時以降に寄せ、ミスの変化を見る。',
      '共有する説明を体調詳細ではなく、安定して作業できる時間帯として整える。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。服薬、治療、勤務時間変更、評価に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'commute-fatigue',
    audience: '当事者',
    category: '健康時間',
    label: '通勤だけで消耗する',
    title: '出社後に仕事を始める前から疲れている',
    fragment: '「在宅勤務にしたいです」で止まり、通勤、業務、評価が分けられない。',
    partialQuestion: '通勤がつらいなら在宅勤務にすべきですか。',
    expandedQuestion: '通勤負荷、出社の目的、在宅で成立する作業、評価条件を分けられるか。',
    stretch: '在宅か出社かの二択から、出社目的と作業配置の組み合わせへ広げる。',
    contactPoints: ['健康時間', '仕事接触点', '評価と継続'],
    hypotheses: [
      {
        title: '通勤負荷が仕事時間を削っている',
        body: '出社後の不調が仕事能力の問題として見られ、通勤で消耗した後の作業配置が見落とされている可能性を見る。',
      },
      {
        title: '出社の目的が一括りになっている',
        body: '教育、連携、確認、評価のための出社が分けられず、全部出社か全部在宅かになっている可能性を見る。',
      },
    ],
    questions: [
      '出社日に必要な仕事は、教育、連携、確認、作業のどれか。',
      '通勤直後に重い作業や評価場面が置かれていないか。',
      '在宅で成立する作業と、出社が必要な作業は分けられているか。',
    ],
    addedInfo: '本人は通勤後1時間ほど疲労が強いが、昼以降は安定する。企業は新人教育とチーム連携のため週数回の出社を求めており、在宅希望は協調性の問題として読まれかけている。',
    narrowedReading:
      '在宅希望は協調性の話ではなく、通勤で失われる仕事時間の話として見直せる。出社の目的と通勤直後の回復を分けると、教育と参加を守りながら消耗を下げる組み合わせが見える。',
    nextMoves: [
      '出社日は最初の30分を回復と当日確認に使う。',
      '教育・連携が必要な日と集中作業の日を分ける。',
      '2週間だけ出社目的ごとの成果、疲労、翌日の影響を記録する。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。勤務形態、契約、評価、合理的配慮の合意に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'chat-tone-misread',
    audience: '当事者',
    category: '情報・手順',
    label: 'チャットの意図が読めない',
    title: '短いチャット指示で優先度や温度感が分からない',
    fragment: '「文章の読み取りが苦手です」で止まり、職場の情報設計が見えない。',
    partialQuestion: 'チャットが苦手な人には、口頭で説明すべきですか。',
    expandedQuestion: 'チャット上で、期限、優先度、相談先、変更理由が見える形になっているか。',
    stretch: '本人の読み取りから、職場全体の情報粒度と確認ルールへ広げる。',
    contactPoints: ['情報と手順', '支援と再翻訳', '評価と継続'],
    hypotheses: [
      {
        title: '短文指示に暗黙情報が残っている',
        body: '期限、重要度、相談してよい範囲が書かれず、本人だけで補う構造になっている可能性を見る。',
      },
      {
        title: '確認行動が評価リスクになっている',
        body: '確認すると遅い、確認しないとミス、という二重負荷が発生している可能性を見る。',
      },
    ],
    questions: [
      'チャットには期限、優先度、成果物の形が入っているか。',
      '確認してよい相手とタイミングは決まっているか。',
      '同じ指示で他の人にも手戻りが出ていないか。',
    ],
    addedInfo: '「これお願い」だけの依頼が多く、期限や完成形は後から聞かないと分からない。本人は質問が多いと思われるのを避けて着手が遅れ、周囲は反応が遅いと見る。',
    narrowedReading:
      'チャットが苦手なのではなく、短文指示の中に期限、完成形、優先度、確認先が入っていない。本人の確認行動が評価リスクになっているため、分からない時ほど動けなくなる。',
    nextMoves: [
      '依頼文を「期限、優先度、成果物、確認先」の4点にそろえる。',
      '確認テンプレートを用意し、質問を仕事手順として扱う。',
      '1週間、指示の不足で発生した手戻りを本人以外も含めて見る。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。職場内評価、情報共有ルール、個人特性の説明範囲を含む場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'priority-switching',
    audience: '当事者',
    category: '情報・手順',
    label: '優先順位がすぐ変わる',
    title: '複数依頼の優先順位が変わり、何から手をつけるか止まる',
    fragment: '「段取りが苦手です」で止まり、仕事側の優先順位ルールが見えない。',
    partialQuestion: '段取りが苦手な人には、タスク管理を教えればよいですか。',
    expandedQuestion: '優先順位を変える基準、変更連絡、判断を戻す先は決まっているか。',
    stretch: '本人の段取りから、優先順位の決め方と変更管理へ広げる。',
    contactPoints: ['情報と手順', '評価と継続', '仕事接触点'],
    hypotheses: [
      {
        title: '優先順位の基準が本人に渡っていない',
        body: '早い順、重要な順、依頼者順などの基準が混ざり、本人だけで判断する構造になっている可能性を見る。',
      },
      {
        title: '変更時の評価条件が曖昧になっている',
        body: '途中で優先順位が変わっても、遅れや未完了の評価が元の基準のまま残っている可能性を見る。',
      },
    ],
    questions: [
      '複数依頼が来たとき、優先順位を誰が決めるか。',
      '途中変更があった場合、元のタスクの期限や評価は更新されるか。',
      '本人が判断に迷ったときに戻す先はあるか。',
    ],
    addedInfo: '午前中に3人から依頼が入り、午後に上司から別件を優先するよう言われた。元の依頼者には遅れの説明がされず、本人は板挟みのまま「段取りが悪い」と見られている。',
    narrowedReading:
      '段取り力の問題に見えるが、実際には優先順位を変える権限、元の依頼者への連絡、期限の更新、評価の更新が職場側で設計されていない。本人だけに調整責任が寄っている。',
    nextMoves: [
      '複数依頼は上司が優先順位を1行で返す運用にする。',
      '優先順位変更時は元の依頼者への連絡担当を決める。',
      '未完了評価ではなく、変更後の合意状況を確認する。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。業務命令、評価、配置、職場内調整に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'coworker-fairness',
    audience: '企業',
    category: '開示・共有',
    label: '周囲から不公平と言われる',
    title: '配慮内容を説明できず、同僚の納得が崩れる',
    fragment: '「特別扱いに見えるので困る」で止まり、説明の設計ができない。',
    partialQuestion: '周囲にどこまで本人の事情を説明すればよいですか。',
    expandedQuestion: '個人事情ではなく、仕事手順や役割分担として何を共有できるか。',
    stretch: '本人情報の共有から、職場運用としての説明可能性へ広げる。',
    contactPoints: ['開示境界', '支援と再翻訳', '評価と継続'],
    hypotheses: [
      {
        title: '配慮が個人事情としてしか説明されていない',
        body: '同僚に共有すべきなのは診断や事情ではなく、仕事の流れの変更である可能性を見る。',
      },
      {
        title: '周囲の負荷変化が扱われていない',
        body: '本人への対応だけを決め、同僚の作業量や相談先の変化を確認していない可能性を見る。',
      },
    ],
    questions: [
      '同僚に共有する必要があるのは、作業手順、期限、役割のどれか。',
      '周囲の負担が増えている作業は何か。',
      '個人情報を出さずに、業務上の変更として説明できるか。',
    ],
    addedInfo: '本人の休憩時間を増やしたが、同僚には理由も代替手順も共有されていない。結果的に同僚が急ぎ対応を引き受け、本人への不満として語られ始めている。',
    narrowedReading:
      '不公平感は、本人情報をもっと出せば解けるとは限らない。業務変更、代替手順、周囲の負荷調整が説明されていないため、職場運用の問題が本人への不満に変わっている。',
    nextMoves: [
      '同僚向けには個人事情ではなく業務手順の変更だけを説明する。',
      '代替対応が発生する作業を洗い出し、担当を固定しすぎない。',
      '周囲の負担感を、本人への不満ではなく運用改善として聞く。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。個人情報、職場内説明、労務管理、ハラスメント対応に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'short-time-evaluation',
    audience: '企業',
    category: '評価・継続',
    label: '短時間勤務の評価が曖昧',
    title: '短時間勤務で成果が見えにくいと言われる',
    fragment: '「勤務時間が短いので評価しにくい」で止まり、成果の見方が整理されない。',
    partialQuestion: '短時間勤務では、どの程度の成果を求めればよいですか。',
    expandedQuestion: '時間量ではなく、役割、成果物、安定性、引き継ぎ条件で評価できるか。',
    stretch: '時間の短さから、成果と継続性の評価条件へ広げる。',
    contactPoints: ['評価と継続', '健康時間', '仕事接触点'],
    hypotheses: [
      {
        title: '時間と成果の評価が混ざっている',
        body: '勤務時間が短いことと、期待役割を果たしているかが同じ軸で評価されている可能性を見る。',
      },
      {
        title: '引き継ぎ条件が評価に入っていない',
        body: '短時間勤務で重要になる情報共有や区切り方が、成果として扱われていない可能性を見る。',
      },
    ],
    questions: [
      '短時間勤務で担う役割は明確か。',
      '成果物、対応件数、品質、引き継ぎのどれで見るか。',
      '勤務時間外に仕事がこぼれない設計になっているか。',
    ],
    addedInfo: '本人は午前中に入力作業を安定して完了しているが、午後に発生する問い合わせ対応は別の人が受けている。評価では対応件数だけが見られ、午前中に終わらせた成果物や引き継ぎの品質は見えていない。',
    narrowedReading:
      '短時間勤務が評価しにくいのではなく、評価軸がフルタイムの対応件数に寄っている。役割範囲、成果物、引き継ぎ品質、午後にこぼれる仕事を分けると、貢献と調整課題が同時に見える。',
    nextMoves: [
      '短時間勤務の役割を、時間ではなく成果物単位で明文化する。',
      '午後にこぼれる問い合わせを1週間記録し、本人評価と職場負荷を分ける。',
      '評価項目に、完了した成果物と引き継ぎ品質を入れる。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。評価制度、賃金、勤務条件、雇用契約に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'ojt-overload',
    audience: '企業',
    category: '入口・移行',
    label: 'OJTが噛み合わない',
    title: '採用後のOJTで、教える側も本人も疲弊する',
    fragment: '「教えても覚えない」で止まり、教え方と業務粒度が見えない。',
    partialQuestion: '覚えるのに時間がかかる人には、何回まで教えればよいですか。',
    expandedQuestion: 'OJTの粒度、練習場面、確認方法、教える人の負荷は設計されているか。',
    stretch: '本人の習得速度から、教育設計と教える側の負荷へ広げる。',
    contactPoints: ['入口以前', '情報と手順', '支援と再翻訳'],
    hypotheses: [
      {
        title: '教える内容が大きすぎる',
        body: '業務を一連の流れとして教え、本人がどの部分で止まるかを見えなくしている可能性を見る。',
      },
      {
        title: '教える側の負荷が設計されていない',
        body: 'OJT担当者の時間や確認方法が決まらず、善意で支える構造になっている可能性を見る。',
      },
    ],
    questions: [
      '作業はどこまで細かく分けて教えているか。',
      '練習場面と本番評価場面は分かれているか。',
      'OJT担当者が確認する時間と範囲は決まっているか。',
    ],
    addedInfo: 'OJT担当者は忙しい合間に一連の流れを説明し、本人はメモを取るが、実際の作業では例外処理や判断部分で止まる。担当者は同じ説明を何度もしていると感じている。',
    narrowedReading:
      '覚えない問題ではなく、定型作業と判断作業が分かれておらず、練習する場所もOJT担当者の確認時間も設計されていない。本人の習得速度だけでなく、教える側の業務設計が詰まりになっている。',
    nextMoves: [
      '作業を「定型」「例外」「判断が必要」に分けて教える。',
      '本番前に、例外処理だけを練習できる短い場面を置く。',
      'OJT担当者が確認する時間を1日10分などに固定し、随時対応を減らす。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。採用評価、教育体制、配置、OJT担当者の負担調整に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'quality-error-safety',
    audience: '企業',
    category: '評価・継続',
    label: 'ミスをどう扱うか迷う',
    title: 'ミスが続き、安全や品質の不安がある',
    fragment: '「ミスが多いので任せられない」で止まり、リスクと設計の切り分けができない。',
    partialQuestion: 'ミスが多い人に、この仕事を続けさせてよいですか。',
    expandedQuestion: 'ミスの種類、発生条件、検知方法、許容できないリスクを分けられているか。',
    stretch: '任せるか外すかから、品質・安全・検知の設計へ広げる。',
    contactPoints: ['評価と継続', '仕事接触点', '情報と手順'],
    hypotheses: [
      {
        title: 'ミスの種類が一括りになっている',
        body: '軽微な手戻り、品質リスク、安全リスクが同じ「ミス」として扱われている可能性を見る。',
      },
      {
        title: '検知と修正の仕組みが不足している',
        body: '本人の注意だけに頼り、早めに気づく手順や二重確認の条件が設計されていない可能性を見る。',
      },
    ],
    questions: [
      'ミスは手戻り、品質、安全のどれに関わるか。',
      'どの時間帯、作業、情報条件で増えるか。',
      '本人以外の検知手順やチェックポイントはあるか。',
    ],
    addedInfo: '入力漏れは月末に増えるが、二重確認を入れると減る。安全に直結する作業ではなく、納期前の手戻りが主な問題だが、現場では全部「任せてよいか」の話になっている。',
    narrowedReading:
      'ミスがあるから外す、では粗すぎる。安全リスク、品質リスク、手戻りを分けると、この仕事は月末の検知手順を足せば続けられる領域と、任せ方を変える領域に分けて考えられる。',
    nextMoves: [
      'ミスを手戻り、品質、安全に分けて記録する。',
      '月末だけ二重確認を入れて、手戻りと負担の変化を見る。',
      '許容できないリスクの作業と、練習可能な作業を分ける。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。安全配慮義務、配置判断、品質責任、雇用判断に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'job-carving-value',
    audience: '企業',
    category: '支援・翻訳',
    label: '職務切り出しが雑用になる',
    title: '仕事を切り出したが、本人にも職場にも価値が見えない',
    fragment: '「できる仕事だけ任せればよい」で止まり、役割や成長が見えなくなる。',
    partialQuestion: 'できる仕事を切り出せば定着しますか。',
    expandedQuestion: '切り出した仕事は、職場の価値、本人の役割、評価、成長につながっているか。',
    stretch: 'できる作業の寄せ集めから、参加の質と価値設計へ広げる。',
    contactPoints: ['仕事接触点', '評価と継続', '支援と再翻訳'],
    hypotheses: [
      {
        title: '作業はあるが役割がない',
        body: 'できる作業を集めても、チームの中で何を担う人なのかが見えない可能性を見る。',
      },
      {
        title: '成長や評価の経路が閉じている',
        body: '簡単な作業だけを固定し、技能形成や役割拡張の機会がなくなっている可能性を見る。',
      },
    ],
    questions: [
      '切り出した作業はチームのどの困りごとを軽くしているか。',
      '本人の役割名や評価条件はあるか。',
      '慣れた後に広げられる作業や学習機会はあるか。',
    ],
    addedInfo: '本人は郵便仕分けと備品補充を担当しているが、忙しい時期には別の仕事を頼まれず、本人もチーム内での役割が分からない。周囲も「何を頼める人なのか」を説明できない。',
    narrowedReading:
      '職務切り出しが雑用に見えるのは、作業が簡単だからではない。チームのどの滞りを軽くしているか、何を任せる人なのか、慣れた後に何へ広がるかが見えないため、参加の質が閉じている。',
    nextMoves: [
      '切り出した仕事が誰の何を助けているかを書き出す。',
      '役割名と評価条件を1つずつ決める。',
      '慣れた後に追加できる作業候補を2つ置く。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。職務設計、評価、処遇、雇用契約に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'support-plan-not-workplace',
    audience: '支援者',
    category: '支援・翻訳',
    label: '支援計画が職場に届かない',
    title: '支援計画はあるが、職場の作業手順に変わらない',
    fragment: '「支援計画では配慮が必要と書いてあります」で止まり、職場で何をするかが見えない。',
    partialQuestion: '支援計画に書いた配慮を企業に伝えればよいですか。',
    expandedQuestion: '支援計画の言葉は、職場の時間、作業、情報、評価へ翻訳されているか。',
    stretch: '支援文書の共有から、職場で確認できる条件への翻訳へ広げる。',
    contactPoints: ['支援と再翻訳', '情報と手順', '評価と継続'],
    hypotheses: [
      {
        title: '支援計画の言葉が抽象的なまま残っている',
        body: '配慮が必要、見守りが必要などの言葉が、職場の具体手順に変換されていない可能性を見る。',
      },
      {
        title: '企業側の実行条件が確認されていない',
        body: '支援者が必要性を説明しても、企業側で誰がいつ何を変えるかが決まっていない可能性を見る。',
      },
    ],
    questions: [
      '支援計画の記述は、時間、作業、情報、評価のどれに関わるか。',
      '企業側で実行する人とタイミングは決まっているか。',
      '実行後に何を見て見直すかがあるか。',
    ],
    addedInfo: '計画には「疲労に配慮」と書かれているが、職場では月末残業と急な確認依頼が続いている。企業担当者は何を変える話か分からず、支援者は計画を伝えたことで役割を果たしたように見えている。',
    narrowedReading:
      '支援計画の共有はゴールではない。「疲労に配慮」という抽象語を、月末残業、急な確認依頼、回復時間、評価期間へ翻訳しない限り、職場は何も変えられない。',
    nextMoves: [
      '支援計画の一文を、職場で変えられる3条件へ置き直す。',
      '企業側の実行担当と確認日を決める。',
      '2週間後に疲労、手戻り、残業の変化を見る。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。支援計画、企業連携、本人同意、情報共有範囲に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'medical-life-work-gap',
    audience: '支援者',
    category: '健康時間',
    label: '医療・生活・仕事が分断する',
    title: '生活側では見えている不調が、職場設計につながらない',
    fragment: '「主治医には相談しています」で止まり、仕事上の条件変更に結びつかない。',
    partialQuestion: '医療側の意見を職場に伝えればよいですか。',
    expandedQuestion: '健康・生活の情報を、職場で確認できる時間、負荷、相談先へ翻訳できているか。',
    stretch: '医療情報の共有から、仕事条件への安全な翻訳へ広げる。',
    contactPoints: ['健康時間', '支援と再翻訳', '開示境界'],
    hypotheses: [
      {
        title: '健康情報が職場条件に変換されていない',
        body: '医療や生活側では重要な情報が、職場で何を確認するかに落ちていない可能性を見る。',
      },
      {
        title: '共有しない情報と共有する情報が分かれていない',
        body: '詳しい医療情報を出すか出さないかに寄り、仕事上必要な範囲が整理されていない可能性を見る。',
      },
    ],
    questions: [
      '職場に必要なのは診断情報か、時間・負荷・回復条件か。',
      '本人が共有してよい範囲はどこまでか。',
      '生活側で見えている変化を、職場のどの条件と照合するか。',
    ],
    addedInfo: '本人は夜間の疲労が強く、生活支援者は把握しているが、職場には「体調に波がある」とだけ伝わっている。月曜朝の欠勤が増え、職場は本人の自己管理の問題として見始めている。',
    narrowedReading:
      '医療情報をそのまま渡す必要がある、という話ではない。生活側で見えている夜間疲労を、週末の回復、月曜朝の負荷、勤務前後の余白として翻訳できると、職場が確認できる条件になる。',
    nextMoves: [
      '共有する情報を「月曜朝の負荷」「回復時間」「相談先」に限定する。',
      '生活側で見えている変化を職場条件へ翻訳する。',
      '欠勤前のサインを本人同意の範囲で確認できる形にする。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。医療情報、生活支援、本人同意、職場共有範囲に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'self-advocacy-words',
    audience: '支援者',
    category: '開示・共有',
    label: '本人がうまく説明できない',
    title: '本人の言葉が短く、職場に必要な情報へ広がらない',
    fragment: '「本人が言えないので支援者が説明します」で止まり、本人の関与が薄くなる。',
    partialQuestion: '本人が説明できない場合、支援者が代わりに説明すればよいですか。',
    expandedQuestion: '本人が言えること、支援者が補うこと、職場が確認することを分けられるか。',
    stretch: '代弁するかしないかから、本人参加を保った情報共有へ広げる。',
    contactPoints: ['開示境界', '支援と再翻訳', '情報と手順'],
    hypotheses: [
      {
        title: '本人の言葉を職場条件へ翻訳する支援が不足している',
        body: '本人が短く話す内容を、支援者が広げすぎず、仕事上の確認事項へ整える必要がある可能性を見る。',
      },
      {
        title: '支援者の代弁が本人の参加を弱めている',
        body: '説明を支援者が担いすぎることで、本人の希望や境界が見えにくくなる可能性を見る。',
      },
    ],
    questions: [
      '本人が自分で言える一文は何か。',
      '支援者が補うのは、作業、時間、情報、環境のどれか。',
      '職場が本人に直接確認する範囲は決まっているか。',
    ],
    addedInfo: '本人は「疲れる」とだけ言うが、支援者が聞くと電話対応後に集中が落ちることが分かる。本人は詳しい体調説明は望んでおらず、支援者が全部代弁すると本人の希望が薄くなる。',
    narrowedReading:
      '本人が説明できない、で止めると代弁が強くなりすぎる。本人の短い言葉を出発点にし、本人の同意範囲で、電話後の集中、確認作業、休憩などの仕事条件へ翻訳する支援が必要。',
    nextMoves: [
      '本人が言える一文を「電話後は確認作業を減らしたい」に整える。',
      '支援者は体調詳細ではなく作業条件だけを補足する。',
      '職場が本人に直接聞く項目を2つに絞る。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。本人同意、代理説明、個人情報、支援者の関与範囲に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'placement-fit',
    audience: '支援者',
    category: '入口・移行',
    label: '配置先が合わない',
    title: '本人に合う職場を探す話が、職種名だけで進む',
    fragment: '「事務が向いていると思います」で止まり、仕事条件の違いが見えない。',
    partialQuestion: 'この人にはどんな職種が向いていますか。',
    expandedQuestion: '職種名ではなく、作業粒度、時間、対人負荷、評価条件の組み合わせはどうか。',
    stretch: '職種適性から、具体的な仕事条件の相性へ広げる。',
    contactPoints: ['入口以前', '仕事接触点', '評価と継続'],
    hypotheses: [
      {
        title: '職種名が粗すぎる',
        body: '同じ事務でも、電話、締切、確認、対人調整、集中作業の比率で負荷が大きく変わる可能性を見る。',
      },
      {
        title: '評価条件との相性が見られていない',
        body: 'できる作業だけで配置を考え、評価される速度や判断範囲との相性を見落としている可能性を見る。',
      },
    ],
    questions: [
      'その職種で実際に多い作業は何か。',
      '締切、電話、対人調整、判断の比率はどのくらいか。',
      '本人が安定する条件と、職場が評価する条件は一致しているか。',
    ],
    addedInfo: '本人は入力作業は安定するが、電話での割り込み後にミスが増える。候補職場の事務は電話対応と来客対応が多く、職種名だけでは相性の違いが見えない。',
    narrowedReading:
      '「事務が向くか」ではなく、入力中心の事務、電話割り込みが多い事務、来客対応を含む事務は別の仕事条件として見る必要がある。職種名ではなく接触点の比率が配置の読みを変える。',
    nextMoves: [
      '候補職場の作業比率を電話、入力、確認、対人調整に分ける。',
      '本人が安定する作業条件と照合する。',
      '実習では職種名ではなく作業条件を記録する。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。職業紹介、採用判断、職場適性の最終判断に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'training-followup',
    audience: '行政・研修',
    category: '研修・制度',
    label: '研修後の変化が追えない',
    title: '研修は実施したが、職場で何が変わったか分からない',
    fragment: '「満足度は高かったです」で止まり、現場の変化に接続しない。',
    partialQuestion: '研修の効果はアンケート満足度で見ればよいですか。',
    expandedQuestion: '受講後に、職場で確認する問いや試作が生まれたかを見られるか。',
    stretch: '研修満足度から、職場で使われた問いと行動変化へ広げる。',
    contactPoints: ['評価と継続', '情報と手順', '支援と再翻訳'],
    hypotheses: [
      {
        title: '研修成果が理解度で止まっている',
        body: '受講者が分かったかではなく、職場で何を確認したかが見えていない可能性を見る。',
      },
      {
        title: '持ち帰り道具がない',
        body: '研修で学んだ視点が、現場で使う質問やシートに落ちていない可能性を見る。',
      },
    ],
    questions: [
      '受講者は研修後にどの職場場面を確認したか。',
      '持ち帰った質問やシートはあるか。',
      '1か月後に変化を見る項目は決まっているか。',
    ],
    addedInfo: '研修後アンケートでは満足度が高いが、1か月後に企業から来る相談は制度手続きに偏り、職場条件の話に進んでいない。受講者は良い話だったとは言えるが、現場で最初に聞く問いを持ち帰っていない。',
    narrowedReading:
      '満足度は研修の入口評価にすぎない。効果を見たいなら、受講者が職場で使った問い、確認した条件、相談内容が手続きから仕事条件へ移ったかを見る必要がある。',
    nextMoves: [
      '研修最後に「明日確認する仕事条件」を1つ書いてもらう。',
      '1か月後に確認した条件と変えた手順を聞く。',
      '相談記録を制度手続きと仕事条件に分ける。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。研修評価、委託仕様、自治体施策、成果指標に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'small-company-support',
    audience: '行政・研修',
    category: '支援・翻訳',
    label: '中小企業が支援を使えない',
    title: '支援メニューはあるが、忙しい職場が使いこなせない',
    fragment: '「支援制度を紹介しました」で止まり、企業内で使う余裕が見えない。',
    partialQuestion: '中小企業には、どの支援制度を案内すればよいですか。',
    expandedQuestion: '制度情報を、忙しい職場で実行できる一つの確認行動へ変換できているか。',
    stretch: '制度案内から、企業の実行余力に合わせた入口設計へ広げる。',
    contactPoints: ['支援と再翻訳', '情報と手順', '入口以前'],
    hypotheses: [
      {
        title: '支援制度が多すぎて選べない',
        body: '複数の制度や窓口を案内しても、企業側が最初に何をすればよいか分からない可能性を見る。',
      },
      {
        title: '管理職の時間制約が見えていない',
        body: '支援を使うための面談、書類、調整の時間が、現場の余力に合っていない可能性を見る。',
      },
    ],
    questions: [
      '企業が今週できる最小の確認行動は何か。',
      '支援を使うために必要な時間や書類はどの程度か。',
      '最初の相談先を一つに絞れているか。',
    ],
    addedInfo: '企業担当者は制度資料を受け取ったが、現場管理職は面談時間を取れず、本人への声かけも後回しになっている。制度を使う前の「最初の15分」が設計されていない。',
    narrowedReading:
      '中小企業に足りないのは制度名ではなく、忙しい現場で最初にできる行動への翻訳。制度資料を渡すだけでは、面談時間、確認項目、相談先が職場の予定に入らない。',
    nextMoves: [
      '最初の相談先を一つに絞る。',
      '15分でできる職場条件チェックに変換する。',
      '制度資料ではなく、今週確認する1項目を渡す。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。制度利用、助成、委託、企業支援メニューに関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'mental-health-diversity-gap',
    audience: '行政・研修',
    category: '研修・制度',
    label: 'メンタルヘルス研修と分断する',
    title: 'メンタルヘルス、障害者雇用、ダイバーシティが別研修になる',
    fragment: '「テーマが違うので別々に研修します」で止まり、共通の仕事条件が見えない。',
    partialQuestion: 'メンタルヘルス研修と障害者雇用研修は分けた方がよいですか。',
    expandedQuestion: '健康時間、開示、評価、相談先、仕事量の見直しは共通の仕事条件として扱えるか。',
    stretch: '研修テーマの違いから、人間の多様性に耐える仕事設計へ広げる。',
    contactPoints: ['健康時間', '開示境界', '評価と継続'],
    hypotheses: [
      {
        title: 'テーマ別研修が共通の現場課題を分断している',
        body: 'メンタルヘルス、障害者雇用、ダイバーシティで言葉は違っても、仕事量、相談先、評価、開示の課題は重なる可能性を見る。',
      },
      {
        title: '共通化しすぎると対象者の違いが消える',
        body: '共通フレームを作る一方で、制度、本人同意、支援資源の違いを消してしまうリスクを見る。',
      },
    ],
    questions: [
      '各研修で共通して扱う職場場面は何か。',
      '制度や本人同意の違いをどこで分けるか。',
      '受講者が持ち帰る共通の確認質問は何か。',
    ],
    addedInfo: '企業からは、メンタルヘルス不調、障害者雇用、育児介護との両立が別々に相談されるが、現場では同じ管理職が仕事量、相談先、開示、評価を調整している。',
    narrowedReading:
      'テーマを分けるほど、仕事量、相談先、開示、評価が別々に扱われ、現場管理職の負荷は統合されない。共通の仕事条件は同じ地図で見せ、制度差と情報共有境界は別枠で分ける設計が必要。',
    nextMoves: [
      '共通場面を「仕事量が変動する時」として1つ選ぶ。',
      '健康時間、開示、評価、相談先を共通確認軸にする。',
      '制度差と情報共有境界は別枠で明示する。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。研修設計、制度説明、個別のメンタルヘルス対応や障害者雇用判断に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
  {
    id: 'industrial-health-bridge',
    audience: '企業',
    category: '健康時間',
    label: '産業保健と現場がつながらない',
    title: '面談内容が、職場の仕事条件へ戻らない',
    fragment: '「産業医に相談済みです」で止まり、現場で何を変えるかが分からない。',
    partialQuestion: '産業保健に相談すれば、職場対応は決まりますか。',
    expandedQuestion: '産業保健で見えた制約を、職場の時間、負荷、情報共有、評価へ翻訳できているか。',
    stretch: '専門職への相談から、現場で実行できる仕事条件への接続へ広げる。',
    contactPoints: ['健康時間', '支援と再翻訳', '開示境界'],
    hypotheses: [
      {
        title: '助言が職場手順に変換されていない',
        body: '産業保健で得た助言が、勤務時間、会議負荷、締切、相談先などの職場条件に翻訳されていない可能性を見る。',
      },
      {
        title: '本人同意と共有範囲が曖昧',
        body: '医療詳細を共有しすぎるリスクと、何も共有されず職場が動けないリスクの両方を見る。',
      },
    ],
    questions: [
      '職場に戻す必要があるのは時間、負荷、場所、相談先のどれか。',
      '本人が共有してよい範囲は明確か。',
      '上司が実行する確認行動は一つに絞れているか。',
    ],
    addedInfo: '面談後に「無理をしない」と共有されたが、上司は締切調整、会議参加、残業判断をどう変えるか分からない。本人は詳しい内容の共有を望んでおらず、職場は聞きすぎを恐れて止まっている。',
    narrowedReading:
      '産業保健に相談した事実だけでは職場は動けない。医療詳細を共有しないまま、本人同意の範囲で「会議負荷」「締切」「残業判断」などの仕事条件へ翻訳する接続が必要。',
    nextMoves: [
      '本人同意の範囲を先に確認し、医療詳細ではなく仕事条件だけを共有する。',
      '今週変える条件を、会議負荷、締切調整、残業判断のどれか一つに絞る。',
      '産業保健の助言を、上司が実行できる「確認する時点」と「変える条件」に翻訳する。',
    ],
    individualConsultation:
      'この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。産業保健面談、医療情報、本人同意、就業判定に関わる場合、このページだけでは判断せず、必要な専門確認へ切り分けてください。',
  },
];

function getConsultationDemoSearchText(demo: (typeof modelConsultationDemos)[number]) {
  return [
    demo.audience,
    demo.category,
    demo.label,
    demo.title,
    demo.fragment,
    demo.partialQuestion,
    demo.expandedQuestion,
    demo.stretch,
    demo.addedInfo,
    demo.narrowedReading,
    demo.individualConsultation,
    ...demo.contactPoints,
    ...demo.questions,
    ...demo.nextMoves,
    ...demo.hypotheses.flatMap((hypothesis) => [hypothesis.title, hypothesis.body]),
  ]
    .join(' ')
    .toLocaleLowerCase();
}

const fqaContactPointAliases: Record<string, string> = {
  評価と継続: '評価と参加の質',
};

function normalizeFqaContactPoint(point: string) {
  return fqaContactPointAliases[point] ?? point;
}

const consultationAlternativeReadingsByCategory: Record<string, string> = {
  健康時間:
    '体調だけが理由とは限りません。締切、通勤、会議時間、評価期間、回復の置き方が重なっていないかも確認します。',
  '情報・手順':
    '本人の認知特性だけとは限りません。情報の形式、変更連絡、確認先、責任範囲が仕事手順として残っているかを確認します。',
  '開示・共有':
    '本人が説明できない問題だけとは限りません。共有してよい範囲、共有しない範囲、職場が知るべき仕事条件が混ざっていないかを確認します。',
  '支援・翻訳':
    '支援者や上司の力量だけとは限りません。翻訳役、記録、代替者、戻り回路が職場運用に組み込まれているかを確認します。',
  '評価・継続':
    '意欲や能力の問題だけとは限りません。評価基準、練習機会、役割、成果物、見直し時点が見えているかを確認します。',
  '入口・移行':
    '採用前後の本人変化だけとは限りません。実習、採用、復職、配置で成功条件が引き継がれているかを確認します。',
  '研修・制度':
    '制度理解や研修満足度だけでは不十分です。現場で最初に確認する問い、実行する人、戻って見る指標が残っているかを確認します。',
};

const consultationTrialMemoByCategory: Record<string, string> = {
  健康時間:
    '本人、上司、支援者で1週間だけ、負荷の山、回復時間、締切、翌日の状態を同じ表に残し、次の週に見直す。',
  '情報・手順':
    '上司またはチーム担当者が、変更点、期限、確認先を1週間同じ書式で残し、手戻りと確認しやすさを見る。',
  '開示・共有':
    '本人同意の範囲を先に分け、上司と人事が仕事上必要な共有事項だけを1枚にし、同僚説明の負担を確認する。',
  '支援・翻訳':
    '支援者、上司、人事のうち誰が翻訳役を持つかを決め、2週間だけ記録場所、代替者、見直し日を運用して戻る。',
  '評価・継続':
    '評価する成果物、練習する場面、相談する時点を1つずつ決め、次の面談で条件と結果を分けて見る。',
  '入口・移行':
    '実習、採用、復職、配置の成功条件を作業量、指示、相談先、支援頻度に分け、次の移行時に欠けた条件を見る。',
  '研修・制度':
    '受講者または企業担当者が、明日確認する仕事条件を1つ選び、1か月後に確認したか、何が変わったかを戻す。',
};

const consultationNextToolRoutesByCategory: Record<
  string,
  Array<{ label: string; href: string; body: string }>
> = {
  健康時間: [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '健康時間と評価条件の観測点へ進む。' },
    { label: '問いをひらく記事', href: articleLibraryHref('treatment-work-time'), body: '治療、回復、勤務量を同じ一週間として読む。' },
    { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '会議や研修で使う一枚地図へ変換する。' },
  ],
  '情報・手順': [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '情報、手順、変更連絡の観測点へ進む。' },
    { label: '場面から入る', href: publicPageHrefById('NS-04'), body: '同じ場面で見え方のズレを読む。' },
    { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '確認表や進行台本へ変換する。' },
  ],
  '開示・共有': [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '開示境界と共有条件の観測点へ進む。' },
    { label: '問いをひらく記事', href: articleLibraryHref('invisible-illness'), body: '見えない負担を説明力ではなく条件として読む。' },
    { label: '場面から入る', href: publicPageHrefById('NS-04'), body: '本人、企業、支援者の見え方の差へ戻る。' },
  ],
  '支援・翻訳': [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '支援と再翻訳の観測点へ進む。' },
    { label: '問いをひらく記事', href: articleLibraryHref('support-translation'), body: '支援資源を仕事条件へ戻す読みへ進む。' },
    { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '役割分担や戻り回路の道具へ変換する。' },
  ],
  '評価・継続': [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '評価と参加の質の観測点へ進む。' },
    { label: '問いをひらく記事', href: articleLibraryHref('employment-quality'), body: '雇用の質と参加の見方へ進む。' },
    { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '面談や記録で使う問いへ変換する。' },
  ],
  '入口・移行': [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '入口以前、移行、成功条件の観測点へ進む。' },
    { label: '場面から入る', href: publicPageHrefById('NS-04'), body: '移行時の見え方のズレを場面で読む。' },
    { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '移行前後の確認シートへ変換する。' },
  ],
  '研修・制度': [
    { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '制度説明を観測点へ戻す。' },
    { label: '問いをひらく記事', href: articleLibraryHref('policy-research-translation'), body: '制度や研究を現場の問いへ翻訳する。' },
    { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '研修台本、ワークシート、戻り回路へ変換する。' },
  ],
};

const consultationNextToolIntents: Record<
  string,
  { action: string; title: string; note: string }
> = {
  '21視点ガイド': {
    action: '学ぶ',
    title: '観測点を増やす',
    note: 'この事例で開いた問いを、企業、支援、制度設計にも使える視点へ広げる。',
  },
  '問いをひらく記事': {
    action: '共有する',
    title: '記事として読む',
    note: '社会の話題や研修の導入に使える、読み切れる文章へ進む。',
  },
  ツールキット: {
    action: '使う',
    title: '会議や研修の道具にする',
    note: '図解、ワークシート、進行台本など、場で扱える形へ変える。',
  },
  場面から入る: {
    action: '場面化する',
    title: 'ストーリーでつかむ',
    note: '本人、職場、支援者の見え方のズレを、同じモデル場面で読む。',
  },
  理論と発見: {
    action: '深める',
    title: 'なぜ可能かを読む',
    note: '断片情報を関係の地図へ変える考え方に戻る。',
  },
};

function getConsultationCasePassport(demo: (typeof modelConsultationDemos)[number]) {
  return {
    sourceLenses: [
      { label: '本人の言葉', body: demo.fragment },
      { label: '職場・支援者の観察', body: demo.addedInfo },
      {
        label: '公的・研究知',
        body: `このページでは結論根拠としてではなく、${demo.contactPoints.join('、')}の観測点へ戻す材料として扱います。`,
      },
      {
        label: '実装する人の条件',
        body: `最初の試行候補: ${demo.nextMoves[0]}`,
      },
    ],
    alternativeReading:
      consultationAlternativeReadingsByCategory[demo.category] ??
      '最初の読みだけで結論にせず、別の説明可能性、足りない情報、実装する人の条件を確認します。',
    trialMemo:
      consultationTrialMemoByCategory[demo.category] ??
      '本人、職場、支援者で確認する項目を1つ選び、短い期間で試して戻る。',
    nextTools:
      consultationNextToolRoutesByCategory[demo.category] ?? [
        { label: '21視点ガイド', href: publicPageHrefById('NS-03'), body: '該当する観測点へ進む。' },
        { label: '理論と発見', href: publicPageHrefById('NS-07'), body: '専門知識ネットワークの発想を確認する。' },
        { label: 'ツールキット', href: publicPageHrefById('NS-06'), body: '会議や研修で使う道具へ変換する。' },
      ],
  };
}

const consultationFlowSteps = [
  {
    label: '1',
    title: '入口を受け取る',
    body: '相談者の言葉を、そのまま大切に置く。',
  },
  {
    label: '2',
    title: '問いを直す',
    body: '止まりやすい問いを、仕事条件の問いへ広げる。',
  },
  {
    label: '3',
    title: '構造を見る',
    body: '7接点と複数の読み筋で、詰まり方を分ける。',
  },
  {
    label: '4',
    title: '確かめる',
    body: '追加で聞くことを選び、読みの解像度を上げる。',
  },
  {
    label: '5',
    title: '次に動く',
    body: '情報が増えた後の読みから、小さく試す。',
  },
];

function getConsultationReadingTrace(
  demo: (typeof modelConsultationDemos)[number],
  passport: ReturnType<typeof getConsultationCasePassport>,
) {
  const traceBodies = [
    demo.fragment,
    demo.expandedQuestion,
    `開いている接点: ${demo.contactPoints.join(' / ')}`,
    demo.questions[0],
    passport.trialMemo,
  ];
  return consultationFlowSteps.map((step, index) => ({
    ...step,
    body: traceBodies[index] ?? step.body,
  }));
}

function ModelConsultationLibrary() {
  const [selectedDemoId, setSelectedDemoId] = useState(modelConsultationDemos[0].id);
  const [selectedAudience, setSelectedAudience] =
    useState<(typeof consultationAudienceFilters)[number]>('すべて');
  const [selectedIssue, setSelectedIssue] =
    useState<(typeof consultationIssueFilters)[number]>('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const matchesFilters = (
    demo: (typeof modelConsultationDemos)[number],
    audience: (typeof consultationAudienceFilters)[number],
    issue: (typeof consultationIssueFilters)[number],
  ) =>
    (audience === 'すべて' || demo.audience === audience) &&
    (issue === 'すべて' || demo.category === issue);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const requestedAudienceParam = params.get('audience');
    const requestedIssueParam = params.get('issue') ?? params.get('category');
    const requestedAudience = consultationAudienceFilters.includes(
      requestedAudienceParam as (typeof consultationAudienceFilters)[number],
    )
      ? (requestedAudienceParam as (typeof consultationAudienceFilters)[number])
      : 'すべて';
    const requestedIssue = consultationIssueFilters.includes(
      requestedIssueParam as (typeof consultationIssueFilters)[number],
    )
      ? (requestedIssueParam as (typeof consultationIssueFilters)[number])
      : 'すべて';
    const hashCaseId = window.location.hash.startsWith('#case-')
      ? window.location.hash.replace('#case-', '')
      : '';
    const requestedDemoId = params.get('case') ?? hashCaseId;
    const requestedDemo = requestedDemoId
      ? modelConsultationDemos.find((demo) => demo.id === requestedDemoId)
      : undefined;
    const fallbackDemo = modelConsultationDemos.find((demo) =>
      matchesFilters(demo, requestedAudience, requestedIssue),
    );
    if (!requestedDemo && !fallbackDemo && requestedAudience === 'すべて' && requestedIssue === 'すべて') return;
    setSelectedAudience(requestedAudience);
    setSelectedIssue(requestedIssue);
    setSearchQuery('');
    setSelectedDemoId(
      requestedDemo && matchesFilters(requestedDemo, requestedAudience, requestedIssue)
        ? requestedDemo.id
        : fallbackDemo?.id ?? requestedDemo?.id ?? modelConsultationDemos[0].id,
    );
  }, []);
  const demoMatches = (
    demo: (typeof modelConsultationDemos)[number],
    audience: (typeof consultationAudienceFilters)[number],
    issue: (typeof consultationIssueFilters)[number],
  ) =>
    matchesFilters(demo, audience, issue) &&
    (!normalizedSearchQuery ||
      getConsultationDemoSearchText(demo).includes(normalizedSearchQuery));
  const filteredDemos = modelConsultationDemos.filter((demo) =>
    demoMatches(demo, selectedAudience, selectedIssue),
  );
  const selectedDemo =
    filteredDemos.find((demo) => demo.id === selectedDemoId) ??
    filteredDemos[0] ??
    modelConsultationDemos[0];
  const selectedContactPointLabels = new Set(
    selectedDemo.contactPoints.map((point) => normalizeFqaContactPoint(point)),
  );
  const selectedContactNodes = workDesignMapNodes.filter((node) =>
    selectedContactPointLabels.has(node.label),
  );
  const selectedPassport = getConsultationCasePassport(selectedDemo);
  const selectedTraceSteps = getConsultationReadingTrace(selectedDemo, selectedPassport);
  const selectFirstDemoFor = (
    audience: (typeof consultationAudienceFilters)[number],
    issue: (typeof consultationIssueFilters)[number],
  ) => {
    const firstDemo = modelConsultationDemos.find((demo) => demoMatches(demo, audience, issue));
    if (firstDemo) setSelectedDemoId(firstDemo.id);
  };

  return (
    <section id="consultation-library" className="mt-8 overflow-hidden border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-300 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              典型相談事例ライブラリ
            </p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-slate-950">
              相談を選ぶと、見立てが開く。
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
              30件のモデル事例から選び、入口語、止まりやすい読み、7接点、複数仮説、追加確認、短い試行、次の道具までを同じ画面で読みます。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-900">
              掲載 {modelConsultationDemos.length}件
            </span>
            <span className="border border-slate-300 bg-[#fbfaf5] px-3 py-2 text-xs font-semibold text-slate-700">
              選択中: {selectedDemo.audience} / {selectedDemo.category}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-b border-slate-300 bg-white p-5 lg:border-b-0 lg:border-r">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
              近い相談を選ぶ
            </p>
            <h4 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
              一言から、開く問いまで見る。
            </h4>
            <label className="mt-5 block">
              <span className="text-xs font-semibold text-slate-600">キーワードで探す</span>
              <span className="mt-2 flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 focus-within:border-cyan-700">
                <FileSearch size={16} className="text-cyan-800" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="例: 通勤、OJT、評価、チャット"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              表示中: {filteredDemos.length} / {modelConsultationDemos.length}件
            </p>
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-600">入口</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {consultationAudienceFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setSelectedAudience(filter);
                      selectFirstDemoFor(filter, selectedIssue);
                    }}
                    className={`border px-3 py-2 text-sm font-semibold transition ${
                      selectedAudience === filter
                        ? 'border-cyan-700 bg-cyan-700 text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-cyan-500'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-600">詰まり方</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {consultationIssueFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setSelectedIssue(filter);
                      selectFirstDemoFor(selectedAudience, filter);
                    }}
                    className={`border px-3 py-2 text-sm font-semibold transition ${
                      selectedIssue === filter
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-slate-500'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 grid max-h-[36rem] gap-2 overflow-y-auto pr-1">
              {filteredDemos.length > 0 ? (
                filteredDemos.map((demo) => (
                  <button
                    key={demo.id}
                    id={`case-${demo.id}`}
                    type="button"
                    onClick={() => setSelectedDemoId(demo.id)}
                    className={`border p-3 text-left transition ${
                      selectedDemo.id === demo.id
                        ? 'border-cyan-700 bg-cyan-50'
                        : 'border-slate-300 bg-white hover:border-cyan-500'
                    }`}
                  >
                    <span className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      {demo.audience} / {demo.category}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-snug text-slate-950">
                      {demo.label}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-slate-600">
                      {demo.title}
                    </span>
                    {selectedDemo.id === demo.id ? (
                      <span className="mt-3 block border-l-4 border-cyan-700 bg-white px-3 py-2 text-xs font-semibold leading-6 text-slate-800">
                        開く問い: {demo.expandedQuestion}
                      </span>
                    ) : null}
                  </button>
                ))
              ) : (
                <div className="border border-slate-300 bg-[#fbfaf5] p-4 text-sm leading-7 text-slate-700">
                  近い相談事例はまだありません。検索語やフィルターを減らすか、必要な専門確認へ切り分けてください。
                </div>
              )}
            </div>
            <div className="mt-5 border-l-4 border-cyan-700 bg-cyan-50 p-4 text-xs leading-6 text-slate-700">
              現在は{modelConsultationDemos.length}件の初期ライブラリです。実際の状況がこの範囲に収まらない場合、このページだけでは結論を出しません。近い相談がない場合は、必要な専門確認へ切り分けてください。
            </div>
          </div>
        </aside>
        <div className="min-w-0 bg-[#f7f3ea] p-4 md:p-6">
          {filteredDemos.length > 0 ? (
            <>
              <div className="border border-slate-300 bg-white shadow-sm">
                <div className="grid xl:grid-cols-[minmax(0,1fr)_18rem]">
                  <div className="bg-slate-950 p-5 text-white">
                    <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                      選択中の相談
                    </p>
                    <h4 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                      {selectedDemo.title}
                    </h4>
                    <p className="mt-3 text-base font-semibold leading-8 text-white/90">
                      {selectedDemo.label}
                    </p>
                    <p className="mt-4 border-l-4 border-cyan-300 bg-white/10 p-4 text-sm font-semibold leading-7 text-white/88">
                      {selectedDemo.fragment}
                    </p>
                  </div>
                  <div className="border-t border-slate-300 bg-cyan-50 p-5 xl:border-l xl:border-t-0">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-900">
                      今開いている仕事条件
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedDemo.contactPoints.map((point) => (
                        <span
                          key={point}
                          className="border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-900"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 border-t border-cyan-200 pt-4">
                      <p className="text-xs font-semibold tracking-[0.12em] text-cyan-900">
                        この事例で開く問い
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-slate-950">
                        {selectedDemo.expandedQuestion}
                      </p>
                    </div>
                  </div>
                </div>
                <ol className="grid border-t border-slate-300 bg-[#fbfaf5] md:grid-cols-5">
                  {selectedTraceSteps.map((step) => (
                    <li
                      key={step.label}
                      className="border-b border-slate-300 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                        {step.label}
                      </span>
                      <p className="mt-3 text-sm font-semibold text-slate-950">{step.title}</p>
                      <p className="mt-2 text-xs leading-6 text-slate-600">{step.body}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5 border border-slate-300 bg-white shadow-sm">
                <div className="border-b border-slate-300 p-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                    見立てボード
                  </p>
                  <h5 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
                    一言を、見立てのプロセスへ変える。
                  </h5>
                </div>
                <div className="grid gap-0 xl:grid-cols-[minmax(0,0.95fr)_4.5rem_minmax(0,1.05fr)]">
                  <article className="border-b border-slate-300 p-5 xl:border-b-0 xl:border-r">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      1. 相談者の入口
                    </p>
                    <h6 className="mt-2 text-lg font-semibold tracking-normal text-slate-950">
                      まず、そのまま受け取る言葉。
                    </h6>
                    <p className="mt-4 border-l-4 border-cyan-700 bg-cyan-50 p-4 text-lg font-semibold leading-8 tracking-normal text-slate-950">
                      {selectedDemo.fragment}
                    </p>
                  </article>
                  <div className="hidden items-center justify-center bg-[#fbfaf5] xl:flex">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-white text-cyan-800">
                      <ArrowRight size={20} aria-hidden="true" />
                    </span>
                  </div>
                  <article className="p-5">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      2. 問い直す
                    </p>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      <div className="border border-rose-200 bg-rose-50 p-4">
                        <p className="text-xs font-semibold tracking-[0.12em] text-rose-800">
                          2. このままだと止まりやすい問い
                        </p>
                        <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
                          {selectedDemo.partialQuestion}
                        </p>
                      </div>
                      <div className="border border-cyan-200 bg-cyan-50 p-4">
                        <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                          仕事条件として問い直す
                        </p>
                        <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
                          {selectedDemo.expandedQuestion}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 border-t border-slate-200 pt-4 text-sm font-semibold leading-7 text-slate-950">
                      ここで広がること: {selectedDemo.stretch}
                    </p>
                  </article>
                </div>
              </div>

              <div className="mt-5 border border-slate-300 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      3. 構造を見る
                    </p>
                    <h5 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
                      7接点と複数の読み筋で、詰まり方を分ける。
                    </h5>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-slate-700">
                    入口カテゴリは探すための手がかりです。読み筋では、仕事条件の7接点へ戻します。
                  </p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
                  {workDesignMapNodes.map((node) => {
                    const Icon = node.icon;
                    const active = selectedContactPointLabels.has(node.label);
                    return (
                      <div
                        key={node.id}
                        className={`border p-3 ${
                          active
                            ? 'border-cyan-700 bg-cyan-50 text-slate-950'
                            : 'border-slate-200 bg-[#fbfaf5] text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            size={16}
                            className={active ? 'text-cyan-800' : 'text-slate-400'}
                            aria-hidden="true"
                          />
                          <p className="text-xs font-semibold">{node.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="grid gap-3">
                    {selectedContactNodes.map((node) => (
                      <article key={node.id} className="border border-slate-200 bg-[#fbfaf5] p-3">
                        <p className="text-xs font-semibold text-cyan-800">{node.label}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          {node.firstQuestion}
                        </p>
                      </article>
                    ))}
                  </div>
                  <div className="grid gap-3">
                    {selectedDemo.hypotheses.map((hypothesis, index) => (
                      <article key={hypothesis.title} className="border border-slate-300 bg-white p-4">
                        <p className="text-xs font-semibold text-cyan-800">読み筋 {index + 1}</p>
                        <h4 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
                          {hypothesis.title}
                        </h4>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{hypothesis.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <article className="border border-slate-300 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-cyan-800">4. 解像度を上げる確認</p>
                  <h5 className="mt-2 text-lg font-semibold tracking-normal text-slate-950">
                    すぐ結論を出さず、何を聞けば読みが深まるかを見る。
                  </h5>
                  <ul className="mt-3 grid gap-2 text-sm leading-7 text-slate-700">
                    {selectedDemo.questions.map((question) => (
                      <li key={question} className="border border-slate-200 bg-[#fbfaf5] p-3">
                        {question}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="border-2 border-cyan-800 bg-slate-950 p-5 text-white shadow-sm">
                  <p className="text-sm font-semibold text-cyan-100">
                    5. 情報が増えると見えること
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    <span className="font-semibold text-white">追加情報: </span>
                    {selectedDemo.addedInfo}
                  </p>
                  <p className="mt-4 text-lg font-semibold leading-8 tracking-normal text-white">
                    {selectedDemo.narrowedReading}
                  </p>
                  <div className="mt-5 border-t border-white/15 pt-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                      合意前の確認候補例
                    </p>
                    <ol className="mt-3 grid gap-3 text-sm leading-7 text-white/80">
                      {selectedDemo.nextMoves.map((move, index) => (
                        <li key={move} className="border border-white/15 bg-white/10 p-3">
                          <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-slate-950">
                            {index + 1}
                          </span>
                          <span className="block">{move}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              </div>

              <div className="mt-5 border border-slate-300 bg-[#fbfaf5] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                      ケース読解パスポート
                    </p>
                    <h5 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
                      この事例を、次の道具へ渡せる形にする。
                    </h5>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">
                      情報源、別読み、短い試行、次の導線を分けると、相談事例は読み物で終わらず、会議、研修、記事、21視点へ持ち出せます。
                    </p>
                  </div>
                  <p className="border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-900">
                    モデル事例 / 個別判断ではありません
                  </p>
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      情報源レンズ
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {selectedPassport.sourceLenses.map((lens) => (
                        <article key={lens.label} className="border border-slate-300 bg-white p-3">
                          <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                            {lens.label}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{lens.body}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <article className="border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-semibold tracking-[0.12em] text-amber-900">
                        別読み
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-800">
                        {selectedPassport.alternativeReading}
                      </p>
                    </article>
                    <article className="border border-cyan-200 bg-cyan-50 p-4">
                      <p className="text-xs font-semibold tracking-[0.12em] text-cyan-900">
                        試行メモ
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-slate-950">
                        {selectedPassport.trialMemo}
                      </p>
                    </article>
                  </div>
                </div>
                <div id="case-handoff" className="mt-4 border border-slate-300 bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                        事例から次へ
                      </p>
                      <h6 className="mt-2 text-lg font-semibold tracking-normal text-slate-950">
                        読んだ事例を、どの形に変えるか。
                      </h6>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">
                        「{selectedDemo.expandedQuestion}」を、学ぶ、共有する、使う入口へ渡します。
                      </p>
                    </div>
                    <span className="w-fit border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-900">
                      相談で終わらせない
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {selectedPassport.nextTools.map((tool) => {
                      const intent =
                        consultationNextToolIntents[tool.label] ??
                        consultationNextToolIntents['理論と発見'];
                      return (
                        <Link
                          key={`${selectedDemo.id}-${tool.label}-${tool.href}`}
                          href={tool.href}
                          className="group flex min-h-[12rem] flex-col border border-slate-300 bg-[#fbfaf5] p-4 transition hover:border-cyan-700 hover:bg-cyan-50"
                        >
                          <span className="w-fit border border-cyan-200 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-cyan-900">
                            {intent.action}
                          </span>
                          <span className="mt-3 flex items-start justify-between gap-3 text-base font-semibold leading-7 text-slate-950">
                            {intent.title}
                            <ArrowRight
                              size={16}
                              className="mt-1 shrink-0 text-cyan-800 transition group-hover:translate-x-1"
                            />
                          </span>
                          <span className="mt-2 block text-xs font-semibold tracking-[0.1em] text-slate-500">
                            {tool.label}
                          </span>
                          <span className="mt-3 block text-sm leading-6 text-slate-700">
                            {tool.body}
                          </span>
                          <span className="mt-auto block border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">
                            {intent.note}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-5 border border-slate-300 bg-white p-4 text-sm leading-7 text-slate-700">
                <span className="font-semibold text-slate-950">この事例の注意事項: </span>
                {selectedDemo.individualConsultation}
              </div>
            </>
          ) : (
            <div className="mt-4 border border-slate-300 bg-[#fbfaf5] p-6">
              <h4 className="text-2xl font-semibold tracking-normal text-slate-950">
                近い相談事例はまだありません。
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                検索語やフィルターを変えると近い相談が見つかることがあります。このライブラリにない相談は、このページだけで結論を出さず、必要な専門確認へ切り分けてください。
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const publicDetailFlowPanels: Record<
  string,
  {
    kicker: string;
    title: string;
    body: string;
    steps: Array<{ label: string; title: string; body: string }>;
    nextLabel: string;
    nextTargetId: string;
  }
> = {
  'NS-02': {
    kicker: '事例集の読み方',
    title: '近い相談から、読み筋の流れを読む。',
    body:
      'このページは、配慮名を増やす場所ではありません。断片的な相談を、複数の読み筋、追加確認、情報が増えると見えること、合意前の確認候補として読める形にします。',
    steps: [
      {
        label: '探す',
        title: '近い相談を選ぶ',
        body: '当事者、企業、支援者、行政・研修の入口から、近い断片相談を選びます。',
      },
      {
        label: '読む',
        title: '複数の読み筋を見る',
        body: '本人の問題に閉じず、仕事、時間、情報、支援、評価のどこが絡むかを読みます。',
      },
      {
        label: '次へ',
        title: '追加で確認することを選ぶ',
        body: '結論を急がず、何を確認すれば構造がはっきりするかを見る。',
      },
    ],
    nextLabel: '理論を読む',
    nextTargetId: 'NS-07',
  },
  'NS-03': {
    kicker: '未来設計マップ',
    title: 'インクルーシブな企業・支援・制度を設計する。',
    body:
      '21視点は、未来の企業経営、雇用管理、専門支援、制度設計を、同じ仕事条件の地図で組み立てるための設計図です。',
    steps: [
      {
        label: '経営',
        title: '多様性を組織設計へ入れる',
        body: '人材戦略、事業継続、学習機会、評価のあり方を仕事条件として見る。',
      },
      {
        label: '雇用管理',
        title: '配慮を運用できる条件にする',
        body: '採用、配置、OJT、評価、異動、復職を再現できる手順へ戻す。',
      },
      {
        label: '支援・制度',
        title: '現場で使える社会インフラにする',
        body: '支援、地域資源、研修、政策を仕事条件へ翻訳する。',
      },
    ],
    nextLabel: 'なぜ可能かを読む',
    nextTargetId: 'NS-07',
  },
  'NS-04': {
    kicker: '場面で読む順番',
    title: 'タテ割りで見えない状況を、ストーリーで同じ場面に戻す。',
    body:
      '正解配慮を当てる練習ではありません。モデル化した職場場面を使い、本人、企業、支援者、医療・生活側が別々に見ている断片を、同じストーリーの上に並べます。相談事例集に入る前の全体像をつかむ入口です。',
    steps: [
      {
        label: '場面',
        title: '何が分断されているかを見る',
        body: '本人の困りごと、企業の制約、支援者の問い、医療・生活側の情報がどこで切れているかを見ます。',
      },
      {
        label: '二つの読み',
        title: '企業側と支援者側を同じ場面に置く',
        body: '責任の押し付け合いにせず、役割分担と確認条件を同じ設計表で話せる形にします。',
      },
      {
        label: '設計',
        title: '相談事例へ進む入口を作る',
        body: 'この場面から、どの相談事例を読むと読みが深まるかを分けます。',
      },
    ],
    nextLabel: '相談事例集へ進む',
    nextTargetId: 'NS-02',
  },
  'NS-05': {
    kicker: '記事の読み方',
    title: '社会の問いを、職場で話せる形にする。',
    body:
      'SNS、研究、制度、研修現場で出てくる話題を、賛否や感想で止めず、職場で何を見ればよいかへ読み直します。読者には、読み切れる記事として届けます。',
    steps: [
      {
        label: '問い',
        title: '社会で出やすい問いを一つ読む',
        body: '雇用率、見えない病気、治療と仕事など、よく出るテーマを記事として読みます。',
      },
      {
        label: '盲点',
        title: '止まりやすい読みを外す',
        body: '制度の善悪、個人の努力、企業批判だけで閉じず、何が見えなくなるかを確認します。',
      },
      {
        label: '条件',
        title: '仕事設計の問いにする',
        body: '参加、健康時間、支援、評価、処遇、開示境界など、次に確認できる条件を見ます。',
      },
    ],
    nextLabel: '教材へ進む',
    nextTargetId: 'NS-06',
  },
  'NS-06': {
    kicker: '教材の読み方',
    title: '図解、ワーク、短い映像で、同じ場面を共有する。',
    body:
      '認知補助ツールキットは、関係者が同じ場面を思い浮かべるための道具です。文章、図解、ミニマンガ、研修ワーク、短い映像台本を並べて読みます。',
    steps: [
      {
        label: '見る',
        title: 'まず一つの教材を読む',
        body: 'たとえば「疲れやすい」を、時間、情報、評価、相談の条件として見える形にします。',
      },
      {
        label: '話す',
        title: '企業と支援者が同じ場面で話す',
        body: '誰が悪いかではなく、どの条件を確認すればよいかを共有します。',
      },
      {
        label: '持ち帰る',
        title: '研修、配布資料、SNS入口へ移す',
        body: '長い説明を、職場で使えるワーク、図解、短い読み物へ分けます。',
      },
    ],
    nextLabel: '場面で読む',
    nextTargetId: 'NS-04',
  },
};

const publicPolicyFlowSteps = [
  {
    label: '論点を一言でつかむ',
    body: 'まず、社会で出ている問いを短い文として読む。',
    icon: FileSearch,
  },
  {
    label: '止まりやすい読みを外す',
    body: '制度の善悪、個人の努力、企業批判だけで閉じない。',
    icon: ClipboardList,
  },
  {
    label: '仕事設計の接点へ戻す',
    body: '人、仕事、環境、支援、時間、制度のどこを開く問いかに戻します。',
    icon: Network,
  },
  {
    label: '確認が必要な情報を分ける',
    body: '制度、統計、法令、行政運用は、結論にせず確認項目として残す。',
    icon: ShieldCheck,
  },
  {
    label: '次の道具へ進む',
    body: '相談事例集、21視点ガイド、教材へ読みをつなげる。',
    icon: Workflow,
  },
];

const questionNoteEditorialRoles = [
  {
    label: '特集',
    title: '雇用率の先にある、参加の質',
    body: '人数だけでは見えない役割、評価、処遇、相談経路、健康時間を同じ地図で読む。',
  },
  {
    label: '図解',
    title: '見えない負担を、仕事の条件に分ける',
    body: '通院、症状変動、説明負担、開示境界、評価のずれを一枚で見える形にする。',
  },
  {
    label: '再掲',
    title: '治療と仕事が分断される場面',
    body: '過去記事や資料を、いまの制度議論や研修で読める問いとして出し直す。',
  },
  {
    label: '次号',
    title: 'メンタルヘルスを、個人の努力に閉じない',
    body: 'セルフケア、締切、裁量、相談先、評価を分けて、職場で見える問いにする。',
  },
];

const questionNoteSnsLandingSteps = [
  {
    label: '投稿の問い',
    title: '雇用率は達成した。でも、よい雇用になっているかは別の問いです。',
    body:
      'タイムラインでは、まず短い違和感として出会います。ここでは、その違和感を制度批判や企業批判で止めず、仕事条件の問いへ開きます。',
  },
  {
    label: '記事で読む',
    title: '数字の外側にある、役割、評価、相談経路を見る。',
    body:
      '人数だけでは、働く人の役割、健康時間、評価、処遇、相談経路、見直しの仕組みが見えません。記事の中で、見落としやすい条件を並べます。',
  },
  {
    label: '現場で見る',
    title: 'あなたの現場では、何が見えていて、何が見えていませんか。',
    body:
      '読んだ後に残すのは正解ではなく、話せる問いです。個別の病状や所属先を書かず、仕事条件として何を見たいかを共有できる形にします。',
  },
  {
    label: '関連して読む',
    title: '相談事例集、21視点、教材でも読む。',
    body:
      '論点に近い相談事例、深掘りする視点、研修や図解にできる教材へ移動し、SNSの関心を次の理解へつなげます。',
  },
];

const questionNoteSample = {
  label: '記事 01',
  theme: '雇用率だけでは、よい雇用か分からない',
  snsHook: '雇用率は達成した。でも、よい雇用になっているかは、人数だけでは分からない。',
  rawQuestion: '障害者雇用率を満たしていれば、企業の取組は進んでいると言えるのか。',
  reframedQuestion:
    '雇用されている人数だけでなく、健康時間、役割、評価、処遇、相談経路、見直しが仕事条件として機能しているか。',
  notEnough:
    '制度指標の善悪や企業批判へ急ぐと、現場で何を見ればよいかがぼやけます。',
  output:
    '雇用率を入口にしつつ、参加の質、評価条件、支援の再翻訳、職場規模ごとの実装余力を次の問いとして並べる。',
};

const questionNoteSampleRows = [
  {
    label: '社会で出やすい問い',
    body: questionNoteSample.rawQuestion,
    tone: 'border-rose-200 bg-rose-50 text-rose-900',
  },
  {
    label: '止まりやすい読み',
    body: questionNoteSample.notEnough,
    tone: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  {
    label: '仕事条件へ戻す問い',
    body: questionNoteSample.reframedQuestion,
    tone: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  },
  {
    label: '見えてくること',
    body: questionNoteSample.output,
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
];

const questionNoteImpactNodes = ['役割', '健康時間', '評価', '処遇', '相談経路', '見直し'];

const questionNoteLeadArticles = [
  {
    label: '01',
    title: '雇用率だけでは、よい雇用か分からない。',
    body: '人数の達成から、役割、評価、健康時間、相談経路の質へ視点を移す。',
  },
  {
    label: '02',
    title: '見えない病気は、理解啓発だけでは足りない。',
    body: '共感の言葉から、通院、症状変動、説明負担、開示境界の設計へ進む。',
  },
  {
    label: '03',
    title: '治療と仕事を、別々の予定表にしない。',
    body: '治療、通勤、勤務量、回復、収入を同じ一週間として見る。',
  },
];

const questionNoteFollowUpQuestions = [
  '働いている人の役割、成果、評価、処遇はどのように接続しているか。',
  '短時間、通院、体調変動のある働き方は、評価や収入の不利に固定されていないか。',
  '企業規模、業種、人員余力、支援接続によって、同じ見方をどう実装し直すか。',
  '制度、統計、研究、現場事例のどれを根拠として使い、どれは確認待ちにするか。',
];

const questionNoteConversationPrompts = [
  {
    label: '支援者へ',
    body: '人数や定着だけでなく、本人の役割、評価、相談経路、生活の余白をどう観測していますか。',
  },
  {
    label: '企業担当者へ',
    body: '「雇用できている」先で、仕事の分担、評価、成長機会、周囲の負荷は見える形になっていますか。',
  },
  {
    label: '政策・研究に関わる人へ',
    body: '制度指標の外側にある参加の質を、どの資料、調査、現場記録から見られますか。',
  },
];

const questionNoteContentPacks = [
  {
    label: '回答 01',
    title: '雇用率だけでは、よい雇用か分からない。',
    hook: '人数は入口です。働いている先で、役割、評価、相談経路、回復時間が閉じていないかを見る必要があります。',
    answer:
      '雇用率は重要な入口ですが、それだけでは「働けている」の中身は分かりません。本人が担う役割、仕事量、評価、処遇、相談できる経路、体調変動がある時の見直し方まで見て、はじめて仕事条件としての雇用の質が見えてきます。',
    diagramTitle: '人数から参加の質へ',
    nodes: ['人数', '役割', '評価', '相談経路', '健康時間'],
    conversation:
      'あなたの職場や支援では、雇用された人数以外に、何を見れば「よい雇用に近づいている」と言えますか。',
    next: '相談事例集の評価・継続領域と、21視点ガイドの参加品質でも扱います。',
  },
  {
    label: '回答 02',
    title: '見えない病気は、理解啓発だけでは足りない。',
    hook: '「分かってほしい」で終わると、通院、食事、トイレ、疲労、説明負担が仕事条件に残りません。',
    answer:
      '見えない病気や慢性疾患の働きづらさは、本人が説明し続ける問題として扱うと消耗が増えます。大切なのは、どの時間帯に負荷が出るか、どの情報共有が遅れると困るか、どこまで共有し何を守るかを、仕事の条件として見える形にすることです。',
    diagramTitle: '共感から条件設計へ',
    nodes: ['通院', '症状変動', '説明負担', '開示境界', '評価'],
    conversation:
      '見えない負担を、本人の説明力ではなく、職場で確認できる条件として置くなら、最初に何を見るべきでしょうか。',
    next: '認知補助ツールキットの「見えない病気と働く」と、相談事例集の健康時間でも扱います。',
  },
  {
    label: '回答 03',
    title: '治療と仕事を、別々の予定表にしない。',
    hook: '医療は治療を見る。職場は勤務を見る。その間で、本人の一週間が分断されます。',
    answer:
      '治療と仕事は別々の世界ではなく、同じ生活時間の中で重なります。通院日、服薬後の時間、回復、通勤、勤務量、収入、相談先を同じ地図に置くと、復職できるかどうかだけでなく、どう戻ると続きやすいかが見えます。',
    diagramTitle: '一週間をつなぐ',
    nodes: ['治療', '通勤', '勤務量', '回復', '収入'],
    conversation:
      '治療、生活、勤務の予定を別々に見ていることで、どんな調整が見えなくなっていますか。',
    next: '相談事例集の復職・健康時間領域と、認知補助ツールキットの45分研修ワークでも扱います。',
  },
  {
    label: '回答 04',
    title: 'メンタルヘルスを、セルフケアだけに閉じない。',
    hook: '本人が整えるだけでは、締切、裁量、相談先、評価、心理的安全性の設計は変わりません。',
    answer:
      'セルフケアは大切ですが、職場の条件が見えないままでは本人の努力に負荷が寄りすぎます。仕事量の山、判断範囲、急な変更、相談のしやすさ、評価の言葉、休む前に軽く相談できる経路を同じ表に置くことで、早い段階での見直しが可能になります。',
    diagramTitle: '個人努力から早期相談へ',
    nodes: ['仕事量', '裁量', '変更', '相談先', '評価'],
    conversation:
      '不調が大きくなる前に、職場で軽く相談できるサインや経路はどこにありますか。',
    next: '相談事例集の支援・翻訳領域と、21視点ガイドの健康時間でも扱います。',
  },
  {
    label: '回答 05',
    title: 'ダイバーシティを、採用の看板で終わらせない。',
    hook: '多様な人を採用しても、仕事の条件が一種類のままだと、参加は広がりません。',
    answer:
      '多様性を組織の力にするには、採用や理念だけでなく、情報の出し方、会議、評価、育成、役割分担、回復時間、相談経路を変えられる必要があります。人を変えるのではなく、仕事の側に複数の通り道を作ることが、参加の質につながります。',
    diagramTitle: '採用から参加設計へ',
    nodes: ['採用', '情報', '会議', '育成', '役割'],
    conversation:
      'あなたの組織では、多様な人が入った後に、どの仕事条件が一種類のまま残っていますか。',
    next: '21視点ガイドの入口・翻訳・支援の面と、場面カードでも扱います。',
  },
  {
    label: '回答 06',
    title: '支援機関を増やすだけでは、職場は動かない。',
    hook: '窓口が増えても、健康・生活・仕事を翻訳する役割がなければ、情報はつながりません。',
    answer:
      '支援資源があることと、職場の条件変更まで届くことは同じではありません。本人の生活情報、医療側の読み筋、企業の制約、支援者の助言を、同じ仕事場面へ翻訳する役割が必要です。窓口の数だけでなく、誰が何を仕事条件へ戻すのかを見ることが重要です。',
    diagramTitle: '窓口から翻訳役へ',
    nodes: ['本人', '医療', '企業', '支援者', '仕事場面'],
    conversation:
      '支援資源はあるのに職場が動かない時、どこで翻訳役が抜けていますか。',
    next: '相談事例集の地域資源・支援接続領域と、政策研究記事でも扱います。',
  },
  {
    label: '回答 07',
    title: '医学モデルか社会モデルか、で止めない。',
    hook: 'からだの問題か、社会の問題か。二択にすると、同じ勤務場面で何が重なるかが消えます。',
    answer:
      '医学モデルと社会モデルの対比は、問題を本人だけに閉じないために重要です。しかし、その対比だけで止まると、本人の体調、作業、環境、支援、時間、制度が同じ場面でどう絡むかが見えにくくなります。必要なのは、どちらが正しいかを争うことではなく、同じ仕事場面に関係する条件を並べ直すことです。',
    diagramTitle: '二択から相互作用へ',
    nodes: ['本人', '仕事', '環境', '支援', '時間'],
    conversation:
      '本人の状態か職場環境かを決める前に、同じ勤務場面で重なっている条件は何ですか。',
    next: '相談事例集の7接点と、21視点ガイドの相互作用の読み方につながります。',
  },
  {
    label: '回答 08',
    title: '配慮名の前に、仕事を分解する。',
    hook: '短時間勤務、在宅、休憩。名前を早く決めるほど、実際の作業、時間、情報、評価が見えなくなることがあります。',
    answer:
      '合理的配慮は大切ですが、配慮名だけを早く決めると、職場で何が詰まっているかを見落としやすくなります。同じ「休憩」でも、体調回復のためなのか、会議後の情報整理のためなのか、移動後の負荷を下げるためなのかで設計は変わります。まず仕事を作業、時間、情報、環境、相談、評価に分けることで、配慮名は正解ではなく設計の選択肢になります。',
    diagramTitle: '配慮名から仕事分解へ',
    nodes: ['作業', '時間', '情報', '環境', '評価'],
    conversation:
      '配慮名を決める前に、どの作業、時間、情報、評価で詰まりが起きていますか。',
    next: '相談事例集の仕事接触点と、認知補助ツールキットの分解カード候補につながります。',
  },
  {
    label: '回答 09',
    title: '連携は、同じ場面を見ることから始まる。',
    hook: '関係者が集まっても、同じ出来事を見ていなければ、連携は連絡で終わります。',
    answer:
      '多分野連携は誰も否定しません。それでも機能しにくいのは、人事、現場、医療、福祉、行政、支援者が、それぞれ別の単位で問題を見ているからです。必要なのは、連携の必要性を確認することではなく、同じ仕事場面を見ながら、誰が何を確認し、何を次に試す条件に変えるのかを残すことです。',
    diagramTitle: '連絡から共同場面へ',
    nodes: ['本人', '企業', '医療', '支援', '役割'],
    conversation:
      '関係者が集まった時、同じ仕事場面として何を見れば、次の役割分担が残りますか。',
    next: '場面カードと、認知補助ツールキットのロールカード候補につながります。',
  },
  {
    label: '回答 10',
    title: '職場の不安を、人の評価で止めない。',
    hook: '現場の不安は、本人能力や企業姿勢の判定ではなく、安全、顧客対応、人員余力、代替、評価を分ける入口です。',
    answer:
      '職場側の不安や負担感は、ときに本人への否定や企業の消極性として扱われます。しかし、不安の中には、安全、顧客対応、人員余力、欠勤代替、求人表示、評価運用といった具体的な接触点が含まれています。ここを分解すると、責める話ではなく、仕事のどこを変えればよいかを話せるようになります。',
    diagramTitle: '不安から接触点へ',
    nodes: ['安全', '顧客対応', '人員余力', '代替', '評価'],
    conversation:
      '職場の不安を、本人評価ではなく接触点として分けるなら、最初にどこを見ますか。',
    next: '相談事例集の企業向け事例と、管理職向け教材候補につながります。',
  },
  {
    label: '回答 11',
    title: 'ワークショップを、いい話で終わらせない。',
    hook: '関係者地図が見えても、確認項目、役割分担、戻り回路が残らなければ、翌週の現場は変わりません。',
    answer:
      'ワークショップでは、関係者の見え方や課題構造が一気に明るくなることがあります。しかし、その気づきが現場に戻る時、何を、誰が、いつ、どの範囲で確認するのかが残っていなければ、実装は止まります。大切なのは、場の納得を、二週間だけ試せる条件、記録、戻り回路へ変えることです。',
    diagramTitle: '気づきから戻り回路へ',
    nodes: ['気づき', '確認項目', '役割分担', '実験', '戻り回路'],
    conversation:
      'ワークショップで見えた課題を、翌週の現場で試せる一手にするなら何が必要ですか。',
    next: '認知補助ツールキットの研修台本と、教材の更新ループにつながります。',
  },
  {
    label: '回答 12',
    title: '同じ仕事でも、三者の見え方は違う。',
    hook: '本人、人事労務、職場上司のどれかを正解にすると、仕事の構造が消えます。',
    answer:
      '同じ仕事でも、本人、人事労務、職場上司が見ているものは一致しません。本人は疲労や説明負担を見ているかもしれません。人事は制度や勤怠を見ているかもしれません。上司は作業の遅れや同僚負担を見ているかもしれません。どれかを正解にするのではなく、見え方の差を仕事条件の地図に置くことで、次に確認すべきことが見えてきます。',
    diagramTitle: '三者の見え方を並べる',
    nodes: ['本人', '人事労務', '上司', '困難', '負担'],
    conversation:
      '同じ一日を三者で見ると、どの困難、負担、満足、役割がずれて見えていますか。',
    next: '2001年三者紐付けデータの知見と、場面カードの三者視点設計につながります。',
  },
  {
    label: '回答 13',
    title: '制度や研究を、現場の問いに翻訳する。',
    hook: '通達、統計、研究会資料は重要です。でも、そのままでは職場で何を見るかに変わりにくい。',
    answer:
      '制度、政策、研究、統計は、現場の見落としを補う重要な材料です。一方で、その言葉は抽象度が高く、職場で最初に確認する作業、時間、情報、評価、相談経路へ変換されにくいことがあります。必要なのは、制度の正解をこの場で決めることではなく、資料が示している問題を、現場で観測できる問いへ翻訳することです。',
    diagramTitle: '資料から観測点へ',
    nodes: ['制度', '研究', '統計', '現場', '問い'],
    conversation:
      '制度や研究の言葉を、職場で最初に確認できる問いへ変えるなら、何を見ますか。',
    next: '政策・研究翻訳面と、働き方の問いをひらく記事集のタイムリーな論点整理につながります。',
  },
  {
    label: '回答 14',
    title: 'マニュアルを増やすより、会議で使える形にする。',
    hook: '資料が多いことと、関係者が同じ場面で話せることは違います。',
    answer:
        'マニュアル、好事例、行政資料、研修資料は増えています。それでも現場が動きにくいのは、読むことと会議で使えることが違うからです。長い資料は、誰が何を確認し、どの条件を変え、いつ戻って見るのかまで落ちにくい。必要なのは資料をさらに増やすことではなく、同じ場面を見る一枚、分ける表、二週間の確認へ変えることです。',
    diagramTitle: '資料から会議道具へ',
    nodes: ['資料', '一枚地図', '分ける表', '実験', '記録'],
    conversation:
      '読まれている資料を、次の会議で実際に使える一枚にするなら、何を残しますか。',
    next: '認知補助ツールキットの会議ツール候補と、研修商品化の設計につながります。',
  },
  {
    label: '回答 15',
    title: '支援者が動ける組織か、点数ではなく条件として見る。',
    hook: '支援者の頑張りを増やす前に、記録、会議、同行、学習回路が残っているかを見る。',
    answer:
      '支援者が動けるかどうかは、個人の熱意や知識だけでは決まりません。本人、医療・生活、企業、制度の情報を仕事条件へ翻訳する時間、記録の残し方、会議での扱い、同行や外部連携の位置づけ、振り返りの学習回路があるかで、支援の再現性は変わります。組織自己チェックは、良し悪しを判定するためではなく、どの条件を話し合うかを選ぶ入口です。',
    diagramTitle: '支援者が動ける組織条件',
    nodes: ['記録', '会議', '同行', '連携', '学習回路'],
    conversation:
      '支援者個人の努力ではなく、組織のどの条件が翻訳と連携を支えていますか。',
    next: '認知補助ツールキットの組織自己チェックと、支援者が動ける組織への教材につながります。',
  },
];

const questionLensArticles = questionNoteContentPacks.map((pack, index) => {
  const extras = [
    {
      id: 'employment-quality',
      category: '雇用の質',
      reader: '企業担当者・支援者',
      readingTime: '約5分',
      infographicImage: '/images/work-condition-lens-employment-quality-v1.webp',
      infographicAlt:
        '人数だけのグラフから、役割、評価、相談経路、健康時間、見直しへ視点が広がるインフォグラフィック',
      partialQuestion: '雇用率を満たしていれば、取組は進んでいると言えるのか。',
      lensQuestion: '人数の外側にある役割、健康時間、評価、処遇、相談経路をどう観測するか。',
      sectionHeadings: [
        '数字は入口であって、結論ではない',
        '定着の中に、参加の質を見に行く',
        '役割、評価、健康時間を同じ地図に置く',
        '評価を、成果と条件の関係として見る',
        '健康時間は、仕事設計の外に置けない',
        '企業批判ではなく、同じ地図で話す',
        '人数から、参加の質へ',
      ],
      paragraphs: [
        '障害者雇用率は、社会が「雇用の入口」を閉じないための重要な制度です。だから、人数を数えること自体を軽く見る必要はありません。問題は、人数が達成された瞬間に、そこで問いが止まってしまうことです。雇用された人が、どんな仕事を担い、どんな評価を受け、困った時にどこへ戻れ、体調や生活時間と仕事がどう折り合っているのかは、人数だけでは見えてきません。',
        '現場では「雇用率は達成している」「定着している」「大きなトラブルはない」という言葉が、取組の良し悪しを語る代わりになることがあります。しかし、本人の役割が補助的なまま固定されていたり、評価や成長機会が曖昧だったり、相談経路が上司の善意だけに依存していたりすると、雇用はあっても参加の質は広がりません。ここで見るべきなのは、制度上の入口ではなく、仕事の中にある自由度です。',
        'この読み方では、まず「人数」を入口として置き、その周囲に役割、評価、処遇、健康時間、相談経路、見直しの仕組みを並べます。これは難しい専門用語を増やすためではありません。職場で話し合える観測点を増やすためです。たとえば、同じ短時間勤務でも、役割が明確で評価方法が共有されている場合と、周囲が何となく仕事を軽くしているだけの場合では、本人の参加の意味も、周囲の負担も、将来の選択肢もまったく違います。',
        '評価を見る時も、「できているか、できていないか」だけでは足りません。何が成果として扱われ、何が見えない貢献として消えているのか。体調変動がある時に、成果の見方をどう調整しているのか。支援者や医療側からの情報が、職場の評価や役割設計にどう翻訳されているのか。ここまで見てはじめて、雇用の質は、抽象的な理念ではなく、観測できる仕事条件になります。',
        '健康時間も同じです。通院、疲労、回復、生活の余白は、個人の事情として職場の外に置かれがちです。しかし、締切、休憩、勤務量、情報共有、評価のタイミングと重なる時、健康時間は仕事設計の一部になります。体調に配慮しているつもりでも、重要な会議が毎回通院後に置かれていたり、短時間勤務のために情報共有から外れていたりすれば、配慮は参加の質を高めるどころか、別の不利を作ることがあります。',
        'この見方は、企業を責めるためのものではありません。支援者が正解を当てるためのものでもありません。人数を入口にしながら、その先で何を見れば「よい雇用に近づいている」と言えるのかを、関係者が同じ地図で話すためのものです。雇用率を満たした先に、役割、評価、健康時間、相談経路、見直しの余地が見えるなら、障害者雇用は単なる制度対応ではなく、人間の多様性を前提に仕事を設計する力へ変わります。',
        'だから、最初の問いは「雇用率を満たしたか」では終わりません。「雇用された人は、どんな役割で参加しているのか」「成果や貢献はどう見えているのか」「体調や生活時間と仕事はどう接続しているのか」「困った時に、本人だけが説明し続ける構造になっていないか」。このように問いを開くことが、人数から参加の質へ進む第一歩です。',
      ],
    },
    {
      id: 'invisible-illness',
      category: '見えない病気',
      reader: '人事・産業保健・支援者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-invisible-illness-v1.webp',
      infographicAlt:
        '見えない病気を理解啓発だけで終わらせず、通院、症状変動、説明負担、開示境界、評価を仕事条件として見るインフォグラフィック',
      partialQuestion: '見た目では分からない病気は、理解を広げればよいのか。',
      lensQuestion: '通院、症状変動、説明負担、開示境界、評価を仕事条件としてどう扱うか。',
      sectionHeadings: [
        '理解だけでは、説明負担は消えない',
        '見えない負担は、仕事条件と重なる場所で起きる',
        '説明負担を、職場で確認できる条件にする',
        '開示境界を守りながら、仕事上の条件を言葉にする',
        '共感を、具体的な設計へ変える',
      ],
      paragraphs: [
        '見えない病気や慢性疾患については、「周囲の理解を広げること」がよく語られます。それは大切です。しかし、理解という言葉だけでは、職場で何を変えればよいのかが残りにくいことがあります。本人が何度も説明し、周囲がそのたびに善意で受け止めるだけでは、説明する負担は本人に残り続けます。',
        '見えない働きづらさは、病気そのものだけで起きるわけではありません。通院の時間、症状の波、食事やトイレの制約、疲労の回復時間、急な変更への弱さ、説明するかどうかの迷い、評価で不利にならないかという不安が、仕事の条件と重なる場所で起きます。ここを見ないまま「理解が必要」と言っても、職場で確認できるものが増えません。',
        'この読み方では、まず説明負担を仕事条件として見ます。誰に、いつ、どこまで伝える必要があるのか。毎回本人が一から説明しているのか。共有しなくてもよい情報まで求められていないか。共有した情報が、勤務量、締切、休憩、評価、相談経路にどう反映されているのか。これらを分けて見ることで、共感を具体的な設計へ変えられます。',
        '開示境界も重要です。病名や症状をすべて共有すれば解決するわけではありません。本人が守りたい情報、仕事上共有した方がよい条件、周囲が知っておくと調整しやすいサインを分ける必要があります。病名ではなく、仕事に影響する条件として言葉を作ることで、プライバシーを守りながら職場の行動を変えやすくなります。',
        'この読み方の目的は、見えない病気を特別扱いすることではありません。見えない負担を、本人の説明力や周囲の思いやりだけに預けないことです。通院、症状変動、説明負担、開示境界、評価の見方を並べれば、職場で最初に確認することが見えてきます。',
      ],
    },
    {
      id: 'treatment-work-time',
      category: '治療と仕事',
      reader: '企業担当者・医療/支援関係者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-treatment-work-time-v1.webp',
      infographicAlt:
        '治療と仕事を別々の予定表にせず、治療、通勤、勤務量、回復、収入を一週間の統合マップとして見るインフォグラフィック',
      partialQuestion: '治療と仕事は、別々に調整すればよいのか。',
      lensQuestion: '治療、通勤、勤務量、回復、収入を同じ一週間としてどうつなぐか。',
      sectionHeadings: [
        '個別調整だけでは、一週間の全体が見えない',
        '本人の生活では、治療と仕事は同じ時間にある',
        '同じ一週間の地図として見る',
        '休めるかどうかから、続け方の設計へ',
        '医療、職場、支援を本人の時間に戻す',
      ],
      paragraphs: [
        '治療と仕事の両立は、しばしば「通院日に休めるか」「勤務時間を短くできるか」という個別調整として扱われます。もちろん、それらは必要です。ただし、治療は医療側、勤務は職場側、制度は支援側が別々に見ていると、本人の一週間は分断されます。',
        '本人の生活では、通院、治療後の疲労、通勤、勤務量、収入、家事、睡眠、相談先は同じ時間の中で重なります。月曜日に治療があり、火曜日に回復時間が必要で、水曜日に締切が集中し、木曜日に重要な会議がある。こうした具体的な時間の重なりを見ないと、「働けるかどうか」という大きすぎる問いに戻ってしまいます。',
        'この読み方では、治療と仕事を別々の予定表ではなく、同じ一週間の地図として見ます。どの時間帯に負荷が出るのか。通院後に何時間の回復が必要なのか。勤務量を減らすと収入や評価にどんな影響が出るのか。相談先は職場、医療、支援機関のどこにあり、誰が仕事条件へ翻訳するのか。',
        'この地図があると、解決策も変わります。単に「休めるようにする」だけでなく、締切の置き方、会議の時間、情報共有の方法、評価期間、収入の見通し、復帰の段階を組み合わせて考えられます。治療を優先すると仕事が不利になり、仕事を優先すると回復が崩れるという二択から抜け出せます。',
        'ここで大切なのは、医学的判断を職場が代わりに行うことではありません。医療、職場、支援、生活が見ている情報を、本人の一週間に戻して並べることです。その時、治療と仕事は対立する予定ではなく、続けやすい働き方を設計するための材料になります。',
      ],
    },
    {
      id: 'mental-health-work-design',
      category: 'メンタルヘルス',
      reader: '管理職・人事・支援者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-mental-health-work-design-v1.webp',
      infographicAlt:
        'メンタルヘルスをセルフケアだけに閉じず、仕事量、裁量、変更、相談先、評価を早期相談の条件として見るインフォグラフィック',
      partialQuestion: 'メンタルヘルスは、本人のセルフケアで対応する話なのか。',
      lensQuestion: '仕事量、裁量、変更、相談先、評価を早期相談の条件としてどう整えるか。',
      sectionHeadings: [
        'セルフケアだけでは、仕事の条件が残る',
        '不調の前に、小さな条件が積み重なる',
        '早期相談が可能になる条件を見る',
        '本人の問題にも、職場のせいにも閉じない',
        '相談できる職場は、言葉だけでは作れない',
      ],
      paragraphs: [
        'メンタルヘルスの話は、本人のセルフケア、ストレス対処、相談の促しとして語られがちです。それらは必要ですが、本人が整える努力だけに寄せすぎると、仕事の側にある条件が見えなくなります。仕事量の山、裁量の狭さ、急な変更、相談先の不明確さ、評価の言葉がそのままなら、本人の努力には限界があります。',
        '不調は、ある日突然現れるだけではありません。締切が重なる、判断範囲が曖昧になる、変更が続く、細かい確認が増える、評価の基準が見えない、相談すると弱い人だと思われる。こうした小さな条件が積み重なると、早い段階で相談すること自体が難しくなります。',
        'この読み方では、メンタルヘルスを個人の内面だけでなく、早期相談が可能になる条件として見ます。仕事量はどこで山になるのか。本人にどこまで裁量があるのか。急な変更を誰が整理するのか。相談先は上司だけなのか。評価の言葉は、失敗を責めるだけでなく、次に調整できる形になっているのか。',
        'この見方は、不調の原因を職場に決めつけるものではありません。逆に、本人の問題として閉じることも避けます。人、仕事、環境、支援、時間、評価の重なりを見て、休職や離職の前に小さく変えられる条件を探すためのものです。',
        '早期相談ができる職場は、「いつでも相談してください」と言うだけでは作れません。相談しても評価が下がらない、相談内容が整理される、試せる調整がある、見直しの時期が決まっている。そうした条件が見える時、メンタルヘルスは個人努力だけの話から、仕事設計の話へ移ります。',
      ],
    },
    {
      id: 'diversity-after-hiring',
      category: '多様性と参加',
      reader: '経営・人事・研修担当',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-diversity-after-hiring-v1.webp',
      infographicAlt:
        'ダイバーシティを採用の看板で終わらせず、採用、情報、会議、育成、役割を参加設計として見るインフォグラフィック',
      partialQuestion: '多様な人を採用すれば、ダイバーシティは進むのか。',
      lensQuestion: '採用後の情報、会議、評価、育成、役割を複数の通り道にできているか。',
      sectionHeadings: [
        '入口が広がっても、通り道が一つなら参加は広がらない',
        '障害者雇用の知見は、組織全体の仕事設計に使える',
        '暗黙のルールが、参加の幅を狭める',
        '多様性を、参加の条件として見る',
        '理念から、仕事設計力へ',
      ],
      paragraphs: [
        'ダイバーシティは、採用人数や属性の多様さだけでは完成しません。多様な人が組織に入っても、情報の出し方、会議の進め方、評価、育成、役割分担が一種類のままなら、参加できる人は限られます。入口が広がっても、仕事の中の通り道が狭いまま残るからです。',
        '障害者雇用や難病就労支援の知見が示してきたのは、人の多様性を受け入れるには、仕事の条件を見直す必要があるということです。これは特別な人だけの話ではありません。時間、場所、情報、評価、相談、回復、成長機会をどう設計するかは、AI時代の組織全体に関わる課題です。',
        'たとえば、会議で発言できる人だけが評価される職場では、事前に考えを整理する方が力を発揮する人の貢献は見えにくくなります。長時間働ける人が中心に置かれる職場では、短い時間で価値を出す設計が育ちません。暗黙のルールで仕事が回る職場では、背景の違う人ほど参加しにくくなります。',
        'この読み方では、多様性を理念ではなく、参加の条件として見ます。採用後に、情報は複数の形で届くか。会議の前後に考える余白はあるか。評価は一種類の働き方だけを前提にしていないか。育成や役割は、最初の配置で固定されていないか。',
        'この見方を持つと、ダイバーシティは「よいことをしている」という自己確認ではなく、組織の仕事設計力を高める問いになります。多様な人を採用した後に、どの仕事条件が一種類のまま残っているのか。そこを見られる組織ほど、人間の多様性を価値に変えやすくなります。',
      ],
    },
    {
      id: 'support-translation',
      category: '支援接続',
      reader: '支援機関・行政・企業支援者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-support-translation-v1.webp',
      infographicAlt:
        '支援機関を増やすだけでなく、本人、医療、企業、支援者の言葉を仕事場面へ翻訳する役割を見るインフォグラフィック',
      partialQuestion: '支援機関や相談窓口を増やせば、職場は動くのか。',
      lensQuestion: '本人、医療、企業、支援者の情報を、誰が仕事条件へ翻訳するのか。',
      sectionHeadings: [
        '窓口が増えても、現場に届くとは限らない',
        '情報がそれぞれの場所で止まる',
        '支援の量ではなく、翻訳の役割を見る',
        '翻訳は、本人情報を丸ごと渡すことではない',
        '連携を、働き方を変える力にする',
      ],
      paragraphs: [
        '支援機関や相談窓口が増えることは重要です。しかし、支援資源が存在することと、職場の条件変更まで届くことは同じではありません。本人は生活と体調を語り、医療側は治療やリスクを語り、企業は業務と人員制約を語り、支援者は制度や助言を語る。その言葉が同じ仕事場面につながらないと、窓口は増えても現場は動きません。',
        'よく起きるのは、情報がそれぞれの場所で止まることです。医療側の読み筋は職場の仕事量や締切に翻訳されず、企業側の制約は支援計画に戻らず、本人の生活上の負担は評価や配置の話から外れます。その結果、関係者はそれぞれ努力しているのに、本人は何度も同じ説明をし、職場は何を変えればよいか分からないままになります。',
        'この読み方では、支援の量ではなく、翻訳の役割を見ます。誰が本人の困りごとを仕事条件として言い換えるのか。誰が企業の制約を支援側に伝えるのか。医療情報を、病名やリスクだけでなく、勤務量、回復時間、相談経路へ変換するのは誰か。ここが見えないと、連携は善意の連絡に留まります。',
        '翻訳とは、本人の情報を職場に丸ごと渡すことではありません。守るべき情報を守りながら、仕事上確認すべき条件へ置き直すことです。たとえば「体調が不安定」ではなく、「午後に疲労が強くなる日は、締切確認を午前に寄せる必要がある」と表現する。こうした翻訳があると、職場は行動しやすくなります。',
        '支援機関を増やすことと同じくらい大切なのは、情報が仕事条件へ戻る通路を作ることです。本人、医療、企業、支援者の言葉が同じ場面に置かれる時、連携は単なる紹介や連絡ではなく、働き方を変える力になります。',
      ],
    },
    {
      id: 'icf-interaction',
      category: '相互作用',
      reader: '支援者・研修担当',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-icf-interaction-v1.webp',
      infographicAlt:
        '医学モデルか社会モデルかの二択から、同じ仕事場面で本人、仕事、環境、支援、時間の相互作用を見る図解',
      partialQuestion: '本人のからだの問題なのか、社会や環境の問題なのか。',
      lensQuestion: '同じ勤務場面で、本人、仕事、環境、支援、時間がどう重なっているか。',
      sectionHeadings: [
        '二択は、問題を開くための入口だった',
        '体調も環境も、同じ場面で起きている',
        '分類ではなく、関係を見る',
        '同じ勤務場面に戻す',
        '対立語から、設計の問いへ',
      ],
      paragraphs: [
        '医学モデルと社会モデルの対比は、問題を本人の努力や能力だけに閉じ込めないために大切でした。しかし、その対比が「どちらが正しいか」という議論に縮むと、実際の職場で何が重なっているかが見えにくくなります。',
        '体調の波がある人が、午前の長い会議、資料の事前共有の不足、移動後の休憩不足、評価への不安と同じ日に向き合っているとします。この時、問題はからだだけでも環境だけでもありません。本人の状態と仕事条件が、同じ場面で相互作用しています。',
        'ICF的な見方の価値は、分類表を覚えることではなく、健康状態、活動、参加、環境、支援、時間を同じ座標に置けることです。そこに仕事設計の観点を重ねると、何を本人の説明に任せ、何を仕事側で確認し、何を支援が翻訳するのかが見えます。',
        'この読み方では、抽象的なモデル対立から一度離れます。そして、同じ火曜午前の会議、同じ月末締切、同じ復職初週の予定に戻します。そこで、体調、作業、情報、環境、相談先、評価がどう重なっているかを見ます。',
        'この読み方は、医学モデルを捨てることでも、社会モデルだけにすることでもありません。人間の状態と仕事の条件を、対立ではなく設計材料として扱うことです。二択の議論から、同じ場面で何を変えられるかという問いへ進むための視点です。',
      ],
    },
    {
      id: 'reasonable-accommodation-work-design',
      category: '配慮と仕事設計',
      reader: '企業担当者・支援者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-accommodation-work-design-v1.webp',
      infographicAlt:
        '配慮名で止めず、作業、時間、情報、環境、相談、評価へ仕事を分解して見る図解',
      partialQuestion: 'どの配慮をすればよいのか。',
      lensQuestion: '配慮名の前に、どの作業、時間、情報、環境、評価が詰まっているか。',
      sectionHeadings: [
        '配慮名は、入口にも出口にもなりすぎる',
        '同じ配慮名でも、意味は場面で変わる',
        '仕事を分解すると、選択肢が増える',
        '義務の話と仕事設計の話を分ける',
        '配慮名から、確認できる条件へ',
      ],
      paragraphs: [
        '合理的配慮の話では、短時間勤務、在宅勤務、休憩、手順書、面談などの名前が先に出てきます。名前があることは大切ですが、そこから始めると、実際には何が詰まっているのかが見えにくくなることがあります。',
        '同じ「休憩」でも、痛みや疲労を回復するためなのか、会議後に情報を整理するためなのか、感覚過敏を落ち着けるためなのか、通勤後の負荷を下げるためなのかで設計は違います。配慮名だけでは、仕事のどこを変える話なのかが粗くなります。',
        'この読み方では、まず作業、時間、情報、環境、相談、評価に分けます。どの作業で止まるのか。いつ負荷が重なるのか。どの情報が消えるのか。何が評価され、何が評価されていないのか。分けることで、配慮は一つの正解ではなく、複数の調整候補になります。',
        'もちろん、法制度や義務の話は重要です。ただし、個別の法的判断をこのページで決めることはしません。ここで扱うのは、制度の言葉を現場で確認できる仕事条件に変えることです。義務の有無を断定する前に、仕事のどこを見ればよいかを整理します。',
        '配慮名の前に仕事を分解すると、本人だけが説明し続ける構造も変えやすくなります。本人の困りごと、職場の制約、支援者の助言を同じ表に置き、次に確認できる条件へ落とす。そこから、必要な配慮名や制度手続きが意味を持ちます。',
      ],
    },
    {
      id: 'multidisciplinary-shared-scene',
      category: '多分野連携',
      reader: '支援者・行政・研修担当',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-multidisciplinary-shared-scene-v1.webp',
      infographicAlt:
        '多分野連携を連絡で止めず、本人、企業、医療、支援、行政が同じ仕事場面を見るための図解',
      partialQuestion: '関係機関がもっと連携すれば解決するのか。',
      lensQuestion: '関係者が同じ仕事場面を見て、誰が何を確認するかを残せているか。',
      sectionHeadings: [
        '連携の必要性は、すでに共有されている',
        '分野ごとに、見ている単位が違う',
        '同じ場面がないと、連携は連絡で止まる',
        '役割分担は、場面の後に見える',
        '連携を、次に試す条件へ残す',
      ],
      paragraphs: [
        '多分野連携の必要性は、多くの人が理解しています。それでも機能しにくいのは、連携が不要だからではありません。関係者が集まっても、同じ仕事場面を見ていないことが多いからです。',
        '医療は症状や治療を見ます。福祉は生活や支援計画を見ます。企業は業務、人員、評価を見ます。行政は制度や資源を見ます。どれも必要ですが、見ている単位が違うままだと、同じ言葉で話しているようで、次の行動は残りません。',
        'この読み方では、連携を「誰とつながっているか」ではなく「同じ場面を見ているか」で読みます。たとえば復職初週、月末締切、通院後の勤務、会議での情報共有といった具体的な場面に、本人、企業、医療、支援、制度の情報を置きます。',
        '同じ場面が見えると、役割分担も変わります。医療側は何を仕事条件として伝えるのか。支援者は本人の言葉をどう翻訳するのか。企業はどの作業や時間を試せるのか。行政や制度はどの資源をつなげるのか。役割は抽象的な連携ではなく、場面の中で見えてきます。',
        '連携の価値は、会議に参加した人数ではありません。本人の生活と職場の条件が、次に確認できる問いとして残ることです。同じ場面を見ることから始めれば、連携は連絡ではなく、働き方を動かす力になります。',
      ],
    },
    {
      id: 'workplace-contact-decomposition',
      category: '職場接触点',
      reader: '管理職・企業担当者・支援者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-workplace-contact-decomposition-v1.webp',
      infographicAlt:
        '職場の不安を本人や企業の評価で止めず、安全、顧客対応、人員余力、欠勤代替、評価運用へ分解する図解',
      partialQuestion: '職場が不安を感じるのは、本人に問題があるからなのか。',
      lensQuestion: '安全、顧客対応、人員余力、欠勤代替、評価運用のどこで不安が生まれているか。',
      sectionHeadings: [
        '職場の不安は、消してよい信号ではない',
        '本人評価や企業姿勢に縮めない',
        '接触点に分けると、話せる形になる',
        '負担感を、設計材料に変える',
        '職場を責めず、条件を見る',
      ],
      paragraphs: [
        '職場側が不安や負担感を口にすると、それが本人への否定や企業の消極性として受け止められることがあります。しかし、不安を無視しても現場は動きません。大切なのは、不安を人の評価にせず、どこで起きている信号なのかを分けることです。',
        '職場の不安には、安全、顧客対応、人員余力、欠勤代替、求人表示、評価運用などが含まれます。これを「本人にできるか」「企業が理解しているか」という二択に縮めると、具体的な接触点が消えてしまいます。',
        'たとえば、急な欠勤が不安という言葉の中には、代替できない作業、顧客への説明、同僚へのしわ寄せ、評価で見る基準、事前に分けられる作業が混ざっています。分けて見ると、本人を責める話ではなく、仕事の設計をどう変えるかという話になります。',
        '支援者にとっても、職場の負担感は重要な情報です。本人の困難だけでなく、職場のどこに調整余力があり、どこに支援が必要かが見えるからです。支援は本人を守るだけでなく、職場が安全に試せる条件を整える役割も持ちます。',
        '職場の不安を扱うことは、企業側に寄りすぎることではありません。本人の働く場を現実に動かすために、見えにくい接触点を言葉にすることです。不安を攻撃ではなく設計材料として扱える時、関係者は同じ地図で話し始められます。',
      ],
    },
    {
      id: 'workshop-to-implementation',
      category: '実装と研修',
      reader: '研修担当・支援者・行政',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-workshop-implementation-v1.webp',
      infographicAlt:
        'ワークショップの気づきを確認項目、役割分担、二週間確認、記録、戻り回路へ変える図解',
      partialQuestion: 'ワークショップで気づきが出れば、現場は変わるのか。',
      lensQuestion: '気づきを、確認項目、役割分担、短い試行、戻り回路へ残せているか。',
      sectionHeadings: [
        'その場の納得だけでは、現場に残らない',
        '見えた構造を、次の確認へ落とす',
        '誰が何を戻すかまで決める',
        '二週間で確認できる単位にする',
        '研修を、実装の入口にする',
      ],
      paragraphs: [
        'ワークショップでは、関係者が初めて同じ地図を見る瞬間があります。本人、企業、支援者、医療・生活側の見え方が並び、問題の構造が明るくなる。これは大きな価値です。しかし、その場の納得だけでは翌週の現場に残りません。',
        '構造が見えた後に必要なのは、何を確認するかです。誰の困りごとかではなく、どの作業、時間、情報、評価、相談経路が詰まっているのか。気づきを、現場で確認できる小さな項目に落とす必要があります。',
        'さらに、役割分担と戻り回路が必要です。本人が何を共有するのか。企業が何を試すのか。支援者が何を翻訳するのか。試した後、いつ、誰が、何を見直すのか。ここが曖昧なままだと、ワークショップは「いい話」で終わります。',
        'この読み方では、二週間で確認できる単位を重視します。制度全体や組織文化を一度に変えるのではなく、次の二週間で変更連絡を文書化する、会議時間をずらす、相談先を固定する、評価項目を一つ確認する。小さな試行にすることで、学びが戻ってきます。',
        '研修やワークショップの目的は、理解を深めることだけではありません。現場に戻った時に、同じ場面を見ながら話せる道具を残すことです。気づき、確認、役割、実験、戻り回路までつながる時、研修は実装の入口になります。',
      ],
    },
    {
      id: 'triadic-perspective-gap',
      category: '三者視点',
      reader: '研究・支援者・企業担当者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-triadic-perspective-v1.webp',
      infographicAlt:
        '本人、人事労務、職場上司が同じ仕事を異なる視点で見ている差を、困難、負担、満足、役割、評価へ置く図解',
      partialQuestion: '本人、人事労務、職場上司のどの見方が正しいのか。',
      lensQuestion: '三者の見え方の差を、困難、負担、満足、役割、評価のどこに置けるか。',
      sectionHeadings: [
        '同じ仕事でも、見えているものは違う',
        'どれか一つを正解にしない',
        '本人の困難、人事の制度、上司の負担を並べる',
        'ズレは、構造を読むための手がかり',
        '三者の見え方を、仕事設計へ戻す',
      ],
      paragraphs: [
        '同じ仕事を見ていても、本人、人事労務、職場上司が見ているものは一致しません。本人は疲労、説明負担、相談しにくさを見ているかもしれません。人事は制度、勤怠、配慮申出を見ています。上司は作業の遅れ、同僚負担、顧客対応を見ています。',
        'ここで、どれか一つを正解にすると構造が失われます。本人の訴えだけを見ると職場の制約が消えます。職場の負担だけを見ると本人の健康時間が消えます。人事の制度運用だけを見ると日々の作業や評価が消えます。',
        '三者の見え方を並べると、困難、負担、満足、役割、評価がどこでずれているかが見えます。本人は仕事を続けるために工夫していても、上司には反応が薄いように見えるかもしれません。人事には安定しているように見えても、本人には生活側の余白が削られているかもしれません。',
        'このズレは、誰が間違っているかを決めるためのものではありません。仕事の構造を読むための手がかりです。何が本人に見え、何が職場に見え、何が制度や人事にしか見えていないのかを分けると、次に確認する問いが変わります。',
        '三者の見え方を同じ仕事条件の地図に置くことで、支援は代弁や調整依頼だけでなく、翻訳の役割を持てます。本人の困難、職場の負担、人事の制度運用を同じ場面で読める時、個別の不一致は仕事設計の改善材料になります。',
      ],
    },
    {
      id: 'policy-research-translation',
      category: '政策・研究',
      reader: '政策・研究・研修担当',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-policy-research-translation-v1.webp',
      infographicAlt:
        '制度、研究、統計、審議会資料を、作業、時間、情報、評価、相談経路、支援など現場で確認できる問いへ翻訳する図解',
      partialQuestion: '制度や研究資料を読めば、現場の課題は分かるのか。',
      lensQuestion: '制度や研究が示す問題を、職場で観測できる作業、時間、情報、評価、支援の問いへどう変えるか。',
      sectionHeadings: [
        '資料は重要だが、そのままでは現場で使いにくい',
        '抽象語は、現場の観測点へ翻訳する',
        '制度の正解をこの場で決めない',
        '研究と現場を、問いで接続する',
        '政策を、仕事条件の改善へ戻す',
      ],
      paragraphs: [
        '制度、政策、研究、統計、審議会資料は、現場の見落としを補う重要な材料です。個別の職場だけを見ていると見えない構造を示してくれます。しかし、その言葉は抽象度が高く、そのままでは職場で何を確認すればよいかに変換されにくいことがあります。',
        'たとえば「多様な就労ニーズへの対応」という言葉は重要ですが、現場では、勤務時間、通院、求人表示、評価、相談経路、支援者の役割に分けないと動きません。抽象語を、職場で観測できる条件へ翻訳する必要があります。',
        'このページで現行制度の解釈や法的判断を確定することはしません。政策や研究を扱う時ほど、出典、日付、制度の範囲を確認する必要があります。ここで行うのは、資料が示す問題を、現場で最初に見る問いへ変えることです。',
        '研究と現場をつなぐには、結論の移植ではなく、問いの翻訳が役立ちます。統計が示す傾向は、どの職場条件で観測できるのか。審議会資料が示す制度課題は、支援者や企業がどの場面で感じているのか。そこをつなぐと、資料は遠い話ではなくなります。',
        '政策や研究の価値は、現場にそのまま正解を渡すことではありません。現場で何を見落としているか、何を確認すれば次の改善に進めるかを示すことです。仕事条件へ翻訳できる時、制度や研究は、職場の具体的な改善に戻ってきます。',
      ],
    },
    {
      id: 'manual-abundance',
      category: '資料と会議',
      reader: '研修担当・管理職・支援者',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-manual-abundance-v1.webp',
      infographicAlt:
        '大量のマニュアルや好事例を、会議で使える一枚地図、分ける表、二週間確認、記録、見直しへ変換する図解',
      partialQuestion: 'マニュアルや好事例をもっと共有すれば、現場は動くのか。',
      lensQuestion: '資料を、同じ場面を見る一枚、分ける表、二週間の確認、記録へ変えられているか。',
      sectionHeadings: [
        '資料が多いほど、使えるとは限らない',
        '読むことと、会議で使うことは違う',
        '一枚地図、分ける表、二週間確認へ変える',
        '好事例を、そのまま移植しない',
        '資料を、戻り回路のある道具にする',
      ],
      paragraphs: [
        '障害者雇用や就労支援の領域には、マニュアル、好事例、行政資料、研修資料が数多くあります。それらは貴重です。しかし、資料が多いほど現場が動くとは限りません。むしろ、読むべきものが増えるほど、会議で何を決めるかが見えにくくなることがあります。',
        '読むことと、会議で使うことは違います。長い資料を共有しても、本人、企業、支援者、医療・生活側が同じ場面を見られなければ、話し合いは抽象的な理解で止まります。必要なのは、資料の内容を、会議の中で使える形へ変えることです。',
        'この読み方では、資料を三つに落とします。一つ目は、今日見る場面を示す一枚地図。二つ目は、本人、仕事、情報、時間、支援、評価に分ける表。三つ目は、二週間で確認する小さな試行です。この形になると、資料は読んで終わるものではなくなります。',
        '好事例も、そのまま移植すると失敗しやすくなります。大企業で機能した仕組みが、小規模職場でそのまま使えるとは限りません。地域資源、業種、人員余力、支援接続が違えば、同じ取組でも意味は変わります。だから、事例は真似るものではなく、自分たちの条件に翻訳する材料です。',
        '資料を増やすこと自体が目的ではありません。資料から、同じ場面を見る道具、分ける表、試す条件、戻って見直す記録を作ることが目的です。そこまで変換できる時、マニュアルや好事例は、会議で使える知識になります。',
      ],
    },
    {
      id: 'support-organization-self-check',
      category: '組織と支援',
      reader: '支援機関管理職・研修担当',
      readingTime: '約4分',
      infographicImage: '/images/work-condition-lens-support-translation-v1.webp',
      infographicAlt:
        '支援者の翻訳負荷を、組織の記録、会議、同行、学習回路へ戻すインフォグラフィック',
      partialQuestion: '支援者が動けないのは、本人の力量不足なのか。',
      lensQuestion: '記録、会議、同行、連携、学習回路のどこで支援者の翻訳が止まっているか。',
      sectionHeadings: [
        '支援者個人の努力だけでは続かない',
        '点数は、組織の良し悪しではない',
        '翻訳負荷を、組織機能として見る',
        '自己チェックを、会議の入口にする',
        '改善保証ではなく、次に話す条件へ',
      ],
      paragraphs: [
        '就労支援の現場では、支援者の熱意、知識、経験が大きな力になります。しかし、本人、医療・生活、企業、制度の情報を一人で翻訳し続ける状態では、支援は属人化しやすくなります。支援者が動けるかどうかは、本人の力量だけでなく、組織の中に支援を残す条件があるかで変わります。',
        '組織自己チェックは、組織の良し悪しを採点する道具ではありません。点数が高いか低いかよりも、記録、会議、同行、外部連携、振り返りのどこで支援者が止まりやすいかを見る入口です。監査、認証、法令適合性、改善効果の判定ではなく、次の会議で何を話すかを選ぶために使います。',
        '支援者の翻訳負荷は、相談件数や研修受講だけでは見えません。本人の希望を仕事条件へ言い換える時間はあるか。医療や生活側の情報を、職場で扱える範囲へ整理する場はあるか。企業側の制約を支援計画へ戻す記録はあるか。担当者が変わっても学びが残る仕組みはあるか。こうした条件が、支援の再現性を左右します。',
        '自己チェックを使う時は、結果を責める材料にしません。たとえば「上司・職場文化」の点が低ければ、上司が悪いと決めるのではなく、就労支援に関わる活動を業務として扱う言葉があるかを確認します。「評価」の点が低ければ、成果主義の批判ではなく、支援活動が記録や会議に残っているかを見る。',
        'この見方は、すぐに改善を保証するものではありません。むしろ、支援者の頑張りを増やす前に、どの条件を組織側に戻せるかを見つけるためのものです。記録を一つ残す、会議の最後に確認担当を決める、同行や外部連携を業務として扱う。小さな条件が残るほど、支援は個人の善意から組織の力へ移っていきます。',
      ],
    },
  ];

  return {
    ...pack,
    number: String(index + 1).padStart(2, '0'),
    ...extras[index],
  };
});

const questionLensCategories = ['すべて', ...Array.from(new Set(questionLensArticles.map((article) => article.category)))];

const articleToolkitLinks: Record<string, { title: string; href: string; note: string }[]> = {
  'invisible-illness': [
    {
      title: '教材 01: 見えない病気と働く',
      href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html',
      note: '見えない負担、説明負荷、通院、開示境界を、図解・場面・音・ワークへ分ける。',
    },
  ],
  'treatment-work-time': [
    {
      title: '教材 01: 見えない病気と働く',
      href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html',
      note: '健康時間と仕事条件を、見えない負担の場面から確認する。',
    },
    {
      title: '教材 05: 本人中心を、同じ一週間で読む',
      href: '/downloads/teaching-library/person-centered-icf-case-map-kit-v1.html',
      note: '治療、回復、仕事、支援を、同じ一週間のケース地図へ置く。',
    },
  ],
  'reasonable-accommodation-work-design': [
    {
      title: '教材 06: 配慮名の前に、仕事を分解する',
      href: '/downloads/teaching-library/accommodation-work-design-kit-v1.html',
      note: '配慮名を、作業、時間、情報、評価、相談線へ分けて扱う。',
    },
    {
      title: '教材 02: がんばり美談から、仕事の前提へ',
      href: '/downloads/teaching-library/work-assumption-shift-package-v1.html',
      note: '本人の努力が吸収している仕事の段差を、再現可能な前提へ戻す。',
    },
  ],
  'workplace-contact-decomposition': [
    {
      title: '教材 06: 配慮名の前に、仕事を分解する',
      href: '/downloads/teaching-library/accommodation-work-design-kit-v1.html',
      note: '職場の不安を、本人能力や企業姿勢ではなく接触点へ分ける。',
    },
  ],
  'manual-abundance': [
    {
      title: '教材 03: 研修後15分で、会議に一手を残す',
      href: '/downloads/teaching-library/manual-to-meeting-package-v1.html',
      note: '資料や研修を、今日見る場面、分ける表、二週間確認へ変える。',
    },
    {
      title: '教材 07: 支援者が動ける組織へ',
      href: '/downloads/teaching-library/support-organization-change-kit-v1.html',
      note: '支援機関内の記録、会議、同行、学習回路へ戻す。',
    },
  ],
  'policy-research-translation': [
    {
      title: '教材 03: 研修後15分で、会議に一手を残す',
      href: '/downloads/teaching-library/manual-to-meeting-package-v1.html',
      note: '制度・研究の言葉を、会議で使う3枚へ翻訳する。',
    },
  ],
  'workshop-to-implementation': [
    {
      title: '教材 03: 研修後15分で、会議に一手を残す',
      href: '/downloads/teaching-library/manual-to-meeting-package-v1.html',
      note: '研修後の気づきを、次回戻せる二週間確認へ残す。',
    },
    {
      title: '教材 04: 連携会議の地図合わせ',
      href: '/downloads/teaching-library/multidisciplinary-shared-scene-workshop-kit-v1.html',
      note: '関係者が同じ場面を見て、役割と戻り先を決める。',
    },
  ],
  'multidisciplinary-shared-scene': [
    {
      title: '教材 04: 連携会議の地図合わせ',
      href: '/downloads/teaching-library/multidisciplinary-shared-scene-workshop-kit-v1.html',
      note: '本人、企業、支援者、医療・生活側の地図を同じ場面に合わせる。',
    },
  ],
  'icf-interaction': [
    {
      title: '教材 05: 本人中心を、同じ一週間で読む',
      href: '/downloads/teaching-library/person-centered-icf-case-map-kit-v1.html',
      note: '生活機能の相互作用を、分類表ではなくケース地図として使う。',
    },
  ],
  'support-translation': [
    {
      title: '教材 07: 支援者が動ける組織へ',
      href: '/downloads/teaching-library/support-organization-change-kit-v1.html',
      note: '支援者個人の頑張りを、組織の翻訳・連携・学習機能へ戻す。',
    },
    {
      title: 'ツール: 組織自己チェック',
      href: '/organizations/diagnosis',
      note: '記録、会議、同行、学習回路のどこを話し合うか、短い自己チェックで入口を作る。',
    },
  ],
  'support-organization-self-check': [
    {
      title: 'ツール: 組織自己チェック',
      href: '/organizations/diagnosis',
      note: '点数で組織を裁かず、支援者が動ける条件を会議の論点にする。',
    },
    {
      title: '教材 07: 支援者が動ける組織へ',
      href: '/downloads/teaching-library/support-organization-change-kit-v1.html',
      note: '自己チェックで見えた論点を、支援機能マップ、改善会議シート、30日確認へつなぐ。',
    },
  ],
};

const articleReaderUseCards = [
  {
    label: '本人・家族',
    body: '自分の困りごとを責める話にせず、相談で確認したい仕事条件の言葉を拾う。',
  },
  {
    label: '支援者',
    body: '本人の言葉を、仕事・時間・情報・評価の問いへ翻訳する。',
  },
  {
    label: '人事・管理職',
    body: '制度や善意の説明だけでなく、現場で話せる条件を持ち帰る。',
  },
  {
    label: '研修・政策',
    body: '資料やニュースを、参加者が扱える問いと図解へ変える。',
  },
];

const publicOutputCards = [
  {
    label: '仕事の地図',
    body: '働きづらさを、本人・仕事・環境・支援・時間・制度の接点として見る。',
    targetId: 'NS-02',
  },
  {
    label: '21視点ガイド',
    body: '3章のガイドとして通読し、必要な場面では21の視点から確認する。',
    targetId: 'NS-03',
  },
  {
    label: 'モデル場面',
    body: '実在ケースを使わず、企業側と支援者側の読みを同じ場面で並べる。',
    targetId: 'NS-04',
  },
  {
    label: '共同試作',
    body: '研修、図解、研究メモ、連載など、社会に戻せる小さな成果物へ変える。',
    targetId: 'NS-06',
  },
];

const publicFirstProductCards = [
  {
    label: '場面カード',
    title: 'タテ割りで見えない状況を、ストーリーでつかむ',
    body: '企業、支援機関、医療・生活側の役割分担を、相談事例集の前に見える化する。',
    targetId: 'NS-04',
  },
  {
    label: '仕事条件で読む相談事例集',
      title: '断片相談を、多面的な読み筋と合意前の確認候補へ変える',
      body: '断片的な相談を、複数の読み筋、追加確認、合意前の確認候補へ変える事例集として見せる。',
    targetId: 'NS-02',
  },
  {
    label: '21視点ガイド',
    title: '仕事設計ガイドブックとして学び、道具箱として引ける形にする',
    body: '21の視点を、入門書、インフォグラフィック、研修、組織変革で使える3章構成にする。',
    targetId: 'NS-03',
  },
  {
    label: '働き方の問いをひらく記事集',
    title: 'SNSや社会のテーマを、働き方の問いへひらく',
    body: '短い違和感を、役割、時間、評価、支援、相談経路として見える形にする。',
    targetId: 'NS-05',
  },
  {
    label: '認知補助ツールキット',
    title: '文章・図解・音・映像で、組織の認知を補助する',
    body: 'マニュアル、ポスター、動画、研修へ展開し、タテ割りや伝達不全を越える道具にする。',
    targetId: 'NS-06',
  },
];

const publicConversionFlow = [
  {
    label: 'よくある詰まり',
    title: '診断名・障害種類・配慮名で話が止まる',
    body: '本人、支援者、職場、制度の言葉が別々になり、仕事場面に落ちない。',
  },
  {
    label: '分けて見る',
    title: '本人の話と職場の条件を、同じ場面で読み直す',
    body: '作業、時間、情報、環境、相談、評価に分けると、確認すべき条件が見える。',
  },
  {
    label: '断定しない',
    title: '使い方を絞り、確認できる問いにする',
    body: '診断名や障害の種類から配慮を自動で決めず、現場で確かめる問いとして扱う。',
  },
  {
    label: '使える形',
    title: '地図・場面集・研修・メモにする',
    body: '支援者と企業が同じ仕事場面を見ながら話せる道具へ変える。',
  },
];

const publicPartnershipRewriteExamples = [
  {
    before: '「疲れやすいので、配慮が必要です」',
    after: '月末締切、休憩の取り方、変更連絡、評価の見え方が重なっていないかを確認する。',
  },
  {
    before: '「コミュニケーションが苦手です」',
    after: '指示の粒度、相談先、暗黙ルール、変更連絡が見える形になっているかを確認する。',
  },
  {
    before: '「本人の意欲が続きません」',
    after: '役割、見通し、負荷、フィードバック、生活の余白が閉じていないかを確認する。',
  },
];

const publicPartnershipFitRows = [
  {
    title: '向いている素材',
    items: ['記事や研修資料を作り替えたい', '現場の違和感を教材にしたい', '制度や研究の言葉を現場の問いへ戻したい'],
  },
  {
    title: '扱わない相談',
    items: ['個別社員の配慮妥当性を判定する', '法務・医療・雇用判断を出す', '現行制度や統計を確認なしに断定する'],
  },
];

const publicTeachingMaterialShelves = [
  {
    title: '見えない病気と働く',
    image: '/resources/invisible-disability/invisible-backpack.webp',
    imageAlt: '見えない荷物を背負う人を表す図解',
    source: '見えない負担、説明負担、仕事の摩擦を扱う既存リソース',
    reader: '企業担当者、支援者、研修受講者',
    products: ['1枚図解', '3場面カード', '相談事例集への導線', 'SNS用の短い読み物'],
    boundary: '症状説明ではなく、仕事条件として何を確認するかに戻す。',
  },
  {
    title: '治療・通院・回復時間',
    image: '/resources/invisible-disability/medical-care-is-work.webp',
    imageAlt: '医療や通院も生活と仕事の一部であることを表す図解',
    source: '通院、治療、回復、生活の余白を扱う既存リソース',
    reader: '人事、上司、産業保健、支援機関',
    products: ['45分研修', '配布ワークシート', '職場確認リスト', '短い解説動画'],
    boundary: '就労可否や医療判断ではなく、時間設計と情報共有の問いにする。',
  },
  {
    title: '制度分断を、現場の問いにする',
    image: '/resources/work-support-transformation/chronic-illness-trends.webp',
    imageAlt: '慢性疾患と就労支援の広がりを表す図解',
    source: '慢性疾患、難病、治療と仕事、障害者雇用の接点を扱う既存リソース',
    reader: '政策・研究・研修に関わる人',
    products: ['問いをひらく記事', '制度横断の図解', '研究メモ', '講義スライド'],
    boundary: '現行制度の断定や国際比較の結論は、公開前に出典と日付を確認する。',
  },
  {
    title: '重いテーマを、考え始める入口にする',
    image: '/fest/2026gw/sns.jpg',
    imageAlt: '働き方アップデートをテーマにした音楽・ビジュアル実験の告知画像',
    source: '音楽、ビジュアル、短い映像、ポスターとして読める入口素材',
    reader: 'SNSで初めて触れる人、研修前の参加者',
    products: ['30秒動画', 'ポスター', 'キャンペーン伴走文', '詳しい教材への入口'],
    boundary: '感情を開く素材であり、助言、根拠認定、配慮判断の代替にしない。',
  },
];

const publicTeachingLibraryModes = [
  {
    label: '見える',
    title: '一枚図解',
    body: '複数の関係者が、同じ仕事場面を一瞬で思い浮かべられるようにする。',
    icon: ImageIcon,
  },
  {
    label: '場面でつかむ',
    title: 'ミニマンガ・場面カード',
    body: '本人、企業、支援者、医療・生活側が別々に見ていた状況を、同じ順番で読めるようにする。',
    icon: MessagesSquare,
  },
  {
    label: '書いて分ける',
    title: 'ワークシート・記入例',
    body: '分かっているつもりでも混ざる情報を、時間、情報、評価、相談、余白へ分ける。',
    icon: ClipboardList,
  },
  {
    label: '場で使う',
    title: '研修台本・配布資料',
    body: '企業担当者、支援者、研修担当者が、同じ問いを持ち帰れる形にする。',
    icon: BookOpen,
  },
  {
    label: '短く届く',
    title: 'ポスター・短い映像・音の入口',
    body: '文章を読む前に違和感を開き、詳しい教材や相談事例集へ戻れる入口を作る。',
    icon: Sparkles,
  },
];

const publicTeachingLibraryPackages = [
  {
    status: 'ミニ教材',
    title: '疲れやすい、で止めない。',
    problem: '体調の言葉だけで止まる相談を、月末締切、休憩、回復時間、情報共有、評価の重なりとして見る。',
    outputs: ['一枚図解', '記入例', '45分研修ワーク', '30秒入口'],
    reader: '企業担当者 / 支援者 / 研修担当者',
    image: '/resources/invisible-disability/energy-wave.webp',
    imageAlt: '体調の波を仕事条件と重ねて考えるための図解',
    href: '#prototype-a',
  },
  {
    status: '追加教材',
    title: '見えない病気と働く',
    problem: '理解啓発だけでは残る説明負担を、通院、症状変動、開示境界、情報共有の教材へ変える。',
    outputs: ['説明負担ワーク', '3場面カード', '開示境界シート', '研修導入図'],
    reader: '人事 / 産業保健 / 支援者',
    image: '/resources/invisible-disability/invisible-backpack.webp',
    imageAlt: '見えない荷物を背負う人を表す図解',
    href: '#prototype-a',
  },
  {
    status: '関連テーマ',
    title: '治療・通院・回復時間',
    problem: '医療の予定表と職場の予定表が分断される場面を、一週間の仕事条件マップへ変える。',
    outputs: ['一週間マップ', '職場確認リスト', '研修ワーク', '読み合わせ台本'],
    reader: '企業担当者 / 産業保健 / 医療・支援関係者',
    image: '/resources/work-support-transformation/balance-treatment-work.webp',
    imageAlt: '治療と仕事の両立を考えるための図解',
    href: '#prototype-a-scenes',
  },
  {
    status: '関連テーマ',
    title: '制度分断を、現場の問いにする',
    problem: '制度、研究、行政資料の言葉を、現場で最初に確認できる仕事条件の問いへ翻訳する。',
    outputs: ['政策翻訳図解', '講義スライド', '研究メモ', '研修用問いカード'],
    reader: '行政 / 研究 / 研修企画者',
    image: '/resources/work-support-transformation/foundational-training.webp',
    imageAlt: '基礎的研修から始まることを示した図解',
    href: '#prototype-a-scenes',
  },
  {
    status: '関連テーマ',
    title: '重いテーマを、考え始める入口にする',
    problem: '言葉だけでは避けられやすいテーマを、ポスター、短い映像、音、読み下しで話し始められる形にする。',
    outputs: ['ポスター', '短い映像台本', 'キャンペーン伴走文', '詳しい教材への入口'],
    reader: 'SNSから来た人 / 研修前の参加者 / 組織内の対話担当',
    image: '/fest/2026gw/sns.jpg',
    imageAlt: '働き方アップデートをテーマにした音楽・ビジュアル実験の告知画像',
    href: '#prototype-a-scenes',
  },
];

const publicTeachingLibraryNecessityRows = [
  {
    label: '数と質',
    title: '雇用数は見える。参加の質は見えにくい。',
    body: '人数や達成率だけでは、役割、評価、健康時間、相談線、成長機会が開いているかまでは見えません。',
  },
  {
    label: '個別性',
    title: '配慮は個別。判断材料は分散する。',
    body: '本人の状態、仕事の内容、安全、顧客対応、人員余力、欠勤代替、求人表示、支援資源、同意境界を同時に見る必要があり、単なる配慮名では決まりません。',
  },
  {
    label: '時間',
    title: '医療・生活・職場の時間が合わない。',
    body: '通院、治療、回復、勤務、引継ぎ、評価、収入が別々に扱われると、健康時間が仕事設計に戻りません。',
  },
  {
    label: '支援継続',
    title: '支援はある。翻訳が続かない。',
    body: '相談、紹介、会議、制度名があっても、本人条件、医療生活情報、職場条件、評価へつながり続けるとは限りません。',
  },
  {
    label: '共同場面',
    title: '同じ場に集まっても、同じ場面を見ていない。',
    body: '本人、企業、支援者、医療・生活側が別々の正しさを持ったままでは、次に誰が何を確認するかが残りません。',
  },
  {
    label: '移植',
    title: '良い事例はある。自社の一手に変換しにくい。',
    body: '事例集やマニュアルが増えても、業務、職場規模、評価運用、人員余力、欠勤代替へ翻訳できなければ、理解で止まります。',
  },
];

const publicTeachingLibraryLimitRows = [
  {
    title: '数字にすると、役割と評価が消える',
    body: '雇用率や件数は重要な入口ですが、どんな仕事で、どう評価され、続けられるかは別に見ないと残りません。',
  },
  {
    title: '制度にすると、仕事場面が粗くなる',
    body: '義務、手続き、支援制度の説明は必要ですが、実際の作業、時間、情報、評価の接触点が薄くなりやすい。',
  },
  {
    title: '分野ごとに学ぶと、境界の翻訳が抜ける',
    body: '人事、現場、医療、福祉、行政が別々に学ぶほど、誰が何を仕事条件へ翻訳するかが曖昧になります。',
  },
  {
    title: '支援メニューにすると、再翻訳の中身が消える',
    body: '相談先や支援機関名は必要ですが、それだけでは医療生活情報、求人、職場、評価のどこをつなぐかが見えません。',
  },
  {
    title: 'ワークショップにすると、その場の気づきで終わる',
    body: '関係者地図や段階整理は有効ですが、戻り回路と役割分担に残らないと、実装の場ではまた分断されます。',
  },
  {
    title: '事例を並べると、自分たちの条件に戻しにくい',
    body: '良い取組の紹介だけでは、職場規模、業務、人員余力、評価運用の違いをどう扱うかが残ります。',
  },
];

const publicTeachingLibraryConceptPillars = [
  {
    title: '同じ場面を作る',
    body: '本人、企業、支援者、医療・生活側が、別々の正しさではなく、同じ仕事場面を見ながら話せるようにする。',
  },
  {
    title: '翻訳を分ける',
    body: '病名、制度名、配慮名をそのまま答えにせず、時間、情報、作業、相談、評価、生活保障へ分ける。',
  },
  {
    title: '支援の役割を見える化する',
    body: '相談、紹介、会議、支援機関名ではなく、誰が何を仕事条件へ再翻訳しているかを見える形にする。',
  },
  {
    title: '試す単位にする',
    body: '大きな理念やマニュアルではなく、二週間だけ試せる調整、45分で扱える研修、1枚で共有できる図解へ落とす。',
  },
  {
    title: '戻って改良する',
    body: '反応、誤読、研修後の問い、相談事例を見て、教材そのものを継続的に直していく。',
  },
];

const publicTeachingLibraryCognitiveChannels = [
  {
    label: '図解',
    title: '関係を、一瞬で見える形にする',
    body: '本人、仕事、環境、支援、時間、評価、制度の重なりを、文章の前に一枚でつかめるようにする。',
    boundary: '図だけで判断させず、読み下しテキストと確認問いを添える。',
  },
  {
    label: '場面',
    title: '同じ職場場面を思い浮かべる',
    body: 'ミニマンガや場面カードで、本人、企業、支援者が別々に見ていたことを同じ場面に戻す。',
    boundary: '架空場面として扱い、個別ケースの正解例にしない。',
  },
  {
    label: 'コピー',
    title: '短い言葉で入口を作る',
    body: '「疲れやすい、で止めない。」のように、複雑な構造へ入る最初の問いを記憶に残す。',
    boundary: '強い言葉で煽らず、必ず仕事条件へ戻す。',
  },
  {
    label: '音・リズム',
    title: '話し始める空気を作る',
    body: '短い映像、音声、キャンペーンソングの伴走文で、重いテーマへの抵抗を下げる。',
    boundary: '情緒で判断を閉じず、助言・認証・正解の代替にしない。',
  },
  {
    label: 'ワーク',
    title: '手を動かして、次の確認に変える',
    body: 'ワークシート、記入例、45分研修台本で、理解を小さな確認行動へ移す。',
    boundary: '「自分で考えて」で放置せず、記入例と境界を付ける。',
  },
  {
    label: '読み下し',
    title: '誰でも追える経路を残す',
    body: '図、音、場面に依存せず、同じ意味をテキスト、alt、見出し構造で追えるようにする。',
    boundary: 'アクセシビリティを後付けにせず、最初から同等の理解経路として作る。',
  },
];

const publicTeachingLibraryProjectDemoRows = [
  {
    label: 'なぜ必要か',
    title: '正しい説明だけでは、同じ仕事場面を見られない。',
    body:
      '制度、医療、支援、企業、本人の言葉は、それぞれ正しくても別々に語られます。そのままでは、職場で何を確認し、誰が何を変えられるかが残りにくい。',
    output: '教材は、別々の正しさを同じ仕事場面へ戻すための認知補助です。',
  },
  {
    label: 'どう見せるか',
    title: '内容ごとに、合う見せ方を選ぶ。',
    body:
      '見えない負担は図で、体調変動は比喩で、制度分断は地図で、重いテーマは音やビジュアルで入口を作ります。',
    output: '記事、図解、場面カード、ワーク、研修、SNS入口を、内容に合わせて組み合わせます。',
  },
  {
    label: '何につながるか',
    title: '記事、相談事例集、21視点、教材、SNSを同じ問いへ戻す。',
    body:
      '一回限りの資料ではなく、社会で出た問いを記事にし、相談事例集で深め、21視点で学び、教材で組織に持ち込み、SNSの反応から改良します。',
    output: 'サイト全体が、専門知を社会で使える形へ変換する入口になります。',
  },
];

const publicTeachingLibraryContentDemos = [
  {
    label: '見えない負担',
    title: 'その荷物、見えていません',
    image: '/resources/invisible-disability/invisible-backpack.webp',
    imageAlt: '周囲から見える言葉と本人が背負っている見えない負担の違いを表す図解',
    content:
      '周囲から見えている言葉と、本人が実際に背負っている不安、通院、痛み、説明疲れ、移動負荷を一枚で並べます。',
    lighter:
      '長い症状説明を読まなくても、説明負担と仕事条件のズレを直感的につかめる。',
    packageIdea:
      '開示境界シート、上司向け読み下し、支援者との事前整理ワークへ展開する。',
  },
  {
    label: '体調変動',
    title: 'からだの中の天気予報',
    image: '/fest/2026gw/stage2/karada-tenki.jpg',
    imageAlt: '外から見えない体調変動を天気予報として表すイラスト',
    content:
      '外からは晴れて見えても、本人の中では疲労、痛み、乾き、息切れ、感染不安が同時に起きていることを、天気という比喩で示します。',
    lighter:
      '体調説明の専門語を減らし、勤務時間、会議、移動、休憩の調整に話をつなげやすい。',
    packageIdea:
      '一週間の健康時間マップ、会議・移動・休憩の確認シート、短い研修導入へ展開する。',
  },
  {
    label: '就労選択',
    title: '就労選択支援を、選択肢のハブとして見る',
    image: '/resources/work-support-transformation/job-choice-support.webp',
    imageAlt: '就労選択支援を、企業、定着支援、地域資源につなぐハブとして表す図解',
    content:
      '福祉的就労か一般就労かの二択ではなく、本人の希望、企業の受け皿、移行と定着、地域資源をつなぐ設計図として見せます。',
    lighter:
      '制度説明の負荷を下げ、何のために、誰が、どの実務へつなぐのかを一目で話せる。',
    packageIdea:
      '関係者ワークショップ、地域資源マップ、本人条件と職務条件のすり合わせ教材へ展開する。',
  },
  {
    label: '雇用の質',
    title: '雇用率だけでは、よい雇用か分からない',
    image: '/images/work-condition-lens-employment-quality-v1.webp',
    imageAlt: '雇用率だけでなく役割、評価、健康時間、相談経路、見直しを見る必要を示す図解',
    content:
      '人数だけを見る入口から、役割、評価、健康時間、相談経路、見直しへ視点を広げます。',
    lighter:
      '政策・統計の話を、職場で確認できる参加の質の問いへ変えられる。',
    packageIdea:
      '記事、管理職向け研修、雇用の質チェックシート、SNSインフォグラフィックへ展開する。',
  },
  {
    label: '重いテーマの入口',
    title: '言葉で避けられるテーマを、話し始める入口にする',
    image: '/fest/2026gw/sns.jpg',
    imageAlt: '働き方アップデートをテーマにした音楽・ビジュアル実験の告知画像',
    content:
      '制度や支援の話に入る前に、音、ビジュアル、短いコピーで、働き方を見直す空気を作ります。',
    lighter:
      'いきなり正論を読ませず、関心を開き、詳しい教材や場面カードへ戻せる。',
    packageIdea:
      'ポスター、30秒動画、キャンペーン伴走文、アクセシブルな読み下しへ展開する。',
  },
  {
    label: '仕事摩擦',
    title: '働きづらさを、人の問題で止めない',
    image: '/resources/invisible-disability/work-friction.webp',
    imageAlt: '見えにくい病気と仕事の摩擦を表す図解',
    content:
      '本人の体調、職場の手順、相談先、情報共有、評価がこすれる場所を、仕事の摩擦として見せます。',
    lighter:
      '個人の努力不足や職場の理解不足に寄せず、確認できる接触点へ話を戻せる。',
    packageIdea:
      '相談事例集、場面カード、21視点ガイドの参照教材として展開する。',
  },
];

const publicInvisibleIllnessPackageSteps = [
  {
    role: '気づく',
    title: 'その荷物、見えていません',
    image: '/resources/invisible-disability/invisible-backpack.webp',
    imageAlt: '周囲には見えない負担を背負っていることを表すバッグパックの図解',
    body: '外からは「元気そう」に見えても、通院、痛み、移動、説明疲れ、開示への不安が同時に背負われていることを一枚で見る。',
    next: 'まず、見えない負担を本人の気合いや説明不足ではなく、仕事条件へ戻す入口にする。',
  },
  {
    role: '同じ場面を見る',
    title: 'からだの中の天気予報',
    image: '/fest/2026gw/stage2/karada-tenki.jpg',
    imageAlt: '外から見えない体調変動を、体の中の天気として示す図解',
    body: '晴れて見える日にも、体の中では疲労、痛み、乾き、感染不安、息切れが動いている。会議、移動、休憩、締切と同じ場面で読む。',
    next: '体調の専門語を増やす前に、勤務時間、会議、移動、休憩のどこで重なるかを見る。',
  },
  {
    role: '動かす',
    title: '見えない負担を仕事条件へ分ける',
    image: '/resources/invisible-disability/work-friction.webp',
    imageAlt: '体調、仕事、情報共有、相談先がこすれる場所を示す図解',
    body: '症状説明で止めず、時間、移動、情報共有、相談先、評価、回復の余白へ分ける。次の会議で一つだけ確認できる形にする。',
    next: '印刷ワークで、本人、企業、支援者が同じ週の仕事条件を見ながら話す。',
  },
];

const publicInvisibleIllnessWorksheetRows = [
  {
    axis: '時間',
    prompt: '通院、移動、会議、締切、休憩、回復時間は同じ週のどこで重なるか。',
    sample: '週前半に通院、翌日に長時間会議、月末に締切が重なる。',
  },
  {
    axis: '情報共有',
    prompt: '何を、誰に、どこまで、いつ更新すれば仕事が進むか。',
    sample: '体調名ではなく、会議後に30分の回復時間が必要な日を共有する。',
  },
  {
    axis: '開示境界',
    prompt: '診断名や病状の詳細ではなく、仕事上共有すべき条件は何か。',
    sample: '腹痛の詳細ではなく、トイレ位置、途中退席の扱い、急な休憩の連絡方法を確認する。',
  },
  {
    axis: '相談線',
    prompt: '困った時に、本人、上司、人事、支援者のどこへ戻るか。',
    sample: '当日判断は上司、週単位の見直しは人事と支援者、医療情報は本人同意の範囲で整理する。',
  },
];

const publicInvisibleIllnessSceneCards = [
  {
    scene: '朝',
    stuck: '「今日は元気そうですね」で止まる',
    reframed: '移動、睡眠、朝の体調、午前会議の負荷を同じ地図に置く。',
  },
  {
    scene: '会議',
    stuck: '「集中力が続かない」で止まる',
    reframed: '会議時間、発言順、資料の事前共有、途中離席の扱いを見る。',
  },
  {
    scene: '月末',
    stuck: '「また休み？」で止まる',
    reframed: '締切、通院、回復時間、代替手順、評価の見方を分ける。',
  },
];

const publicInvisibleIllnessSixFunctionArtifacts = [
  {
    label: '注意を開く',
    title: '元気そう、のあとに何を見る？',
    image: '/resources/teaching-library/heron-scenes/ibd-looks-fine-scene.webp',
    imageAlt: '元気そうに見える場面から、見えない負担を考える4コマ教材',
    href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html#open-attention',
    body: '「元気そう」を否定せず、そこで判断を止めない。通勤、朝の体調、説明疲れ、会議の入り方へ注意を開く。',
    artifact: '冒頭5分カード: 元気そうに見える時ほど、次に見る仕事条件を一つ選ぶ。',
  },
  {
    label: '比喩でつかむ',
    title: '見えないバックパックと、からだの天気',
    image: '/resources/invisible-disability/invisible-backpack.webp',
    imageAlt: '外から見えない負担を背負うバッグパックの図解',
    href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html#metaphor',
    body: '見えない負担や体調変動を、気合い・性格・説明不足ではなく、背負っている荷物や変わる天気として一度つかむ。',
    artifact: '比喩カード: 荷物は本人だけが背負うものではなく、仕事条件で軽くできるものとして読む。',
  },
  {
    label: '場面で見る',
    title: '元気そう、通勤、通院を同じ場面で見る',
    image: '/resources/teaching-library/heron-scenes/collagen-hospital-visit-work-scene.webp',
    imageAlt: '通院も仕事の条件として見る4コマ教材',
    href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html#scene',
    body: 'IBD・膠原病の場面素材を、病名別理解ではなく、健康時間、移動、通院、説明負荷、開示境界の共有場面に戻す。',
    artifact: '場面カード: 本人、上司、人事、支援者が同じ場面を見て、違う確認点を出せるようにする。',
  },
  {
    label: '構造に置く',
    title: '仕事摩擦と支援摩擦へ置く',
    image: '/resources/invisible-disability/work-friction.webp',
    imageAlt: '見えない病気と仕事の摩擦を示す構造図',
    href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html#structure',
    body: '本人の問題、企業の理解不足、制度説明のどれかに閉じず、作業、時間、情報共有、相談線、評価、支援接続の摩擦に置く。',
    artifact: '構造マップ: どこを変えると負荷が下がるかを、接触点ごとに見える形にする。',
  },
  {
    label: '手を動かす',
    title: '一週間の健康時間マップ',
    image: '/resources/invisible-disability/medical-care-is-work.webp',
    imageAlt: '治療や通院も仕事条件と同時に考える図解',
    href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html#week-map',
    body: '通院、移動、会議、締切、休憩、回復時間を同じ週に置き、どこで負荷が重なっているかを見る。',
    artifact: '記入ワーク: 次の会議で確認する曜日、時間帯、会議、移動、休憩を一つに絞る。',
  },
  {
    label: '読み下し',
    title: '進行役の境界台本',
    image: '/resources/invisible-disability/common-overview.webp',
    imageAlt: '見えない障害や病気を仕事条件として見る概要図',
    href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html#read-down',
    body: '図や比喩だけで理解させず、同じ意味をテキストで追えるようにする。感動話、病状説明、本人責任、個別判断へ滑ることを防ぐ。',
    artifact: '読み下し台本: 今日は就労可否や配慮妥当性を決めず、次に確認する仕事条件を一つ選ぶ。',
  },
];

const publicInvisibleIllnessAudioEntries = [
  {
    title: '見えない荷物のヒーロー',
    still: '/songs/still/mienai-nimotsu-no-hero.jpg',
    audio: '/songs/audio/mienai-nimotsu-no-hero.mp3',
    body: '見えない負担を、本人の努力物語だけにせず、周囲が気づく入口にする。',
  },
  {
    title: 'からだの天気予報',
    still: '/songs/still/karada-no-tenki-yoho.jpg',
    audio: '/songs/audio/karada-no-tenki-yoho.mp3',
    body: '体調変動を、気分や根性ではなく、予定、移動、休憩、回復時間の話へ戻す。',
  },
  {
    title: '透明なリュック',
    still: '/songs/still/tomei-na-ryukku.jpg',
    audio: '/songs/audio/tomei-na-ryukku.mp3',
    body: '見えない負担と開示境界を、話し始められる比喩として置く。',
  },
];

const publicTeachingLibraryProblemContentPlans = [
  {
    family: '雇用数・雇用率・定着で止まる',
    product: '人数の向こう側',
    channels: ['図解', 'コピー・ビジュアル', '研修ワーク'],
    hook: '「達成しました」の後に、役割、評価、健康時間、相談線、成長機会を見に行く。',
    demo: '掲載',
  },
  {
    family: '医学モデル vs 社会モデルで止まる',
    product: 'からだか社会か、ではなく同じ仕事場面へ',
    channels: ['ミニマンガ', '相互作用図解'],
    hook: '体調か環境かを争うのではなく、同じ勤務場面で何が重なるかを見る。',
    demo: '掲載',
  },
  {
    family: '配慮名・義務・制度説明で止まる',
    product: '配慮名の前に、仕事を分解するカード',
    channels: ['ワークシート', '管理職カード', '場面カード'],
    hook: '休憩、短時間、在宅などの名前を決める前に、作業、時間、情報、評価を分ける。',
    demo: '掲載',
  },
  {
    family: '連携の必要性は分かるが、同じ場面が残らない',
    product: '連携会議の地図合わせ',
    channels: ['ロールカード', '卓上ワークショップ'],
    hook: '本人、企業、支援者、医療・生活側が、それぞれ何を見ているかを同じ机に置く。',
    demo: '掲載',
  },
  {
    family: '支援者の再翻訳負荷が見えない',
    product: '翻訳リレーが切れる場所',
    channels: ['マンガ', '役割図解', '支援者向けワーク'],
    hook: '相談件数ではなく、本人の言葉を職場の一手へ変える途中の負荷を見る。',
    demo: '掲載',
  },
  {
    family: '職場の不安が本人能力か企業姿勢に縮む',
    product: '職場の不安を5つに分ける',
    channels: ['図解', '管理職ミニ研修', 'チェックカード'],
    hook: '安全、顧客対応、人員余力、欠勤代替、評価運用を分けると、不安は攻撃ではなく設計材料になる。',
    demo: '掲載',
  },
  {
    family: 'ワークショップの気づきが実装へ残らない',
    product: 'いい話で終わらせない二週間確認',
    channels: ['ワークショップ', '進行台本', '実験カード'],
    hook: '気づきを、誰が、いつ、何を、どこまで試すかへ落とす。',
    demo: '候補',
  },
  {
    family: '本人・人事・上司の見え方が一致しない',
    product: '同じ一日、三つの見え方',
    channels: ['三者マンガ', '比較カード', '研修ワーク'],
    hook: 'どれかを正解にせず、同じ仕事の日を三つの視点から読む。',
    demo: '掲載',
  },
  {
    family: '症状変動・通院・回復時間が職場の一手へ戻らない',
    product: 'からだの天気と勤務の天気',
    channels: ['比喩図解', 'ポスター', '30秒動画', '音の入口'],
    hook: '晴れて見える日にも、体の中では風や雨が動いている。勤務の天気予報として見る。',
    demo: '掲載',
  },
  {
    family: '制度・政策・研究の言葉が現場の問いにならない',
    product: '制度の言葉を、現場の問いにする',
    channels: ['翻訳図解', '研修カード'],
    hook: '通達や統計の言葉を、現場で最初に確認できる仕事条件へ変換する。',
    demo: '候補',
  },
  {
    family: 'マニュアルや好事例は多いが、会議で使えない',
    product: '研修後15分で、会議に一手を残す',
    channels: ['会議ワークボード', 'ワークシート', '進行台本'],
    hook: '研修後の「大事ですね」で止めず、今日見る場面、分ける表、二週間確認へ分ける。',
    demo: '掲載',
  },
];

const publicTeachingLibraryMadeDemos = [
  {
    label: '図解 + コピー',
    title: '人数の向こう側',
    family: '雇用数・雇用率・定着で止まる',
    channel: 'Measurement compression',
    premise: '数字は大事です。ただし、数字だけでは「よい雇用」かどうかは見えません。',
    artifactTitle: '一枚図解の中心コピー',
    heroCopy: '雇用率のその先へ。人数では見えない「働けているか」を見る。',
    blocks: [
      { label: '見る点 1', text: '役割: 何の仕事を任され、何が任されていないか。' },
      { label: '見る点 2', text: '評価: 処理量だけでなく、確認品質、引き継ぎ、安定性が見えているか。' },
      { label: '見る点 3', text: '健康時間: 通院、回復、生活の余白が仕事時間から消えていないか。' },
      { label: '見る点 4', text: '相談線: 困った時に誰へ、どの粒度で戻せるか。' },
    ],
    useScene: '雇用率達成後の人事会議、管理職研修、政策記事の対応図解。',
  },
  {
    label: 'ミニマンガ',
    title: 'からだか社会か、ではなく同じ仕事場面へ',
    family: 'ICF的な相互作用モデル',
    channel: 'ICF interaction',
    premise: '医学モデルか社会モデルかの対立で止めず、同じ勤務場面で相互作用を見る。',
    artifactTitle: '3コマ台本',
    image: '/resources/teaching-library/generated/body-social-workscene-mini-manga-v1.webp',
    imageAlt: '体調側の見方、職場環境側の見方、同じ仕事場面での共同確認へ進む三コママンガ',
    downloadHref: '/downloads/teaching-library/mini-manga-body-social-workscene-v1.html',
    downloadLabel: '印刷用ミニマンガを開く',
    panels: [
      { label: '1コマ目', text: '人事: 「体調の問題なら、どこまで会社が変える話ですか？」' },
      { label: '2コマ目', text: '支援者: 「環境の問題なら、本人の体調説明はいらないのでしょうか？」' },
      { label: '3コマ目', text: '進行役: 「同じ火曜午前の会議で、体調、移動、資料、発言順、休憩を一緒に見ましょう。」' },
    ],
    useScene: '初学者向け研修、ICF説明ページ、支援者・企業合同ワークの導入。',
  },
  {
    label: 'ワークシート',
    title: '配慮名の前に、仕事を分解するカード',
    family: '合理的配慮・仕事設計',
    channel: 'Work design card',
    premise: '配慮名を早く決めるほど、実際の作業、時間、情報、評価が見えにくくなる。',
    artifactTitle: '記入カード',
    downloadHref: '/downloads/teaching-library/work-design-breakdown-cards-v1.html',
    downloadLabel: '印刷用カードを開く',
    blocks: [
      { label: '作業', text: 'どの作業で止まるか。定型、例外、判断、対人対応に分ける。' },
      { label: '時間', text: 'いつ重くなるか。開始前、繁忙期、移動後、会議後、終業後に分ける。' },
      { label: '情報', text: 'どの情報が消えるか。口頭変更、期限、完成形、確認先を見る。' },
      { label: '評価', text: '何が評価され、何が評価されないか。処理量、品質、引き継ぎ、安定性を分ける。' },
    ],
    useScene: '企業担当者と支援者が、個別判断の前に仕事条件をそろえる場。',
  },
  {
    label: 'ロールカード + 卓上ワーク',
    title: '連携会議の地図合わせ',
    family: '多分野連携 / Supporter translation load',
    channel: 'Co-design workshop',
    premise: '連携会議で人が集まっても、同じ場面を見ていなければ、次に試す条件は残りません。',
    artifactTitle: '4人のカード',
    downloadHref: '/downloads/teaching-library/coordination-role-cards-v1.html',
    downloadLabel: 'ロールカードを開く',
    roles: [
      { label: '本人', text: '「何を言うと不利になるか分からない」' },
      { label: '企業', text: '「どこまで聞いてよいか分からない」' },
      { label: '支援者', text: '「本人の言葉を職場の手順へ訳す時間が足りない」' },
      { label: '医療・生活側', text: '「通院や回復時間が職場の予定に乗らない」' },
    ],
    useScene: '支援者研修、企業・支援機関連携ワークショップ、地域の実装会議。',
  },
  {
    label: '管理職カード',
    title: '職場の不安を5つに分ける',
    family: 'Workplace contact decomposition',
    channel: 'Manager micro-training',
    premise: '職場の不安や負担感は、本人への批判ではなく、接触点を分解するための重要な信号です。',
    artifactTitle: '不安を分ける5枚',
    blocks: [
      { label: '安全', text: '危険がある作業か、確認で防げる作業か。' },
      { label: '顧客対応', text: '顧客への説明、待ち時間、品質基準はどこで発生するか。' },
      { label: '人員余力', text: '欠勤や遅れを誰が吸収しているか。' },
      { label: '欠勤代替', text: '代替できない作業、事前に分けられる作業はどれか。' },
      { label: '評価運用', text: 'できたことと調整が必要なことを、同じ評価で混ぜていないか。' },
    ],
    useScene: '管理職研修、OJT設計、採用後フォローの読み合わせ。',
  },
  {
    label: '三者マンガ',
    title: '同じ一日、三つの見え方',
    family: 'Triadic perspective gap',
    channel: 'Triadic storyboard',
    premise: '本人、人事、職場上司の見え方は、同じ一日でもずれます。どれかを正解にすると構造が失われます。',
    artifactTitle: '朝から夕方までの3視点',
    panels: [
      { label: '本人', text: '朝の移動で消耗し、午前の会議では発言を絞った。午後は入力に集中できた。' },
      { label: '人事', text: '勤怠は安定。配慮申出も大きな問題も出ていないように見える。' },
      { label: '上司', text: '午前の反応が薄く、午後は作業が速い。何を評価すればよいか迷う。' },
    ],
    useScene: '三者視点の価値を、歴史説明ではなく「見え方のずれ」教材として活かす。',
  },
  {
    label: '動画 + 音の入口',
    title: 'からだの天気と勤務の天気',
    family: '難病・慢性疾患・メンタルヘルスと雇用',
    channel: 'Poster / short video / sound cue',
    premise: '外から晴れて見えても、体の中では風や雨が動いている。体調変動を勤務の天気予報として見る。',
    artifactTitle: '30秒動画の骨子',
    beats: [
      { label: '0-5秒', text: '画面: 晴れの顔。字幕: 「今日は元気そう」に見える。' },
      { label: '5-12秒', text: '画面: 体の中に雨雲、風、気圧線。字幕: 中では、回復時間が減っている。' },
      { label: '12-22秒', text: '画面: 会議、移動、締切、休憩を天気図に置く。字幕: 体調を責めず、勤務の天気を見る。' },
      { label: '22-30秒', text: '画面: 「今日の仕事条件予報」カード。字幕: 次に変えられる条件を一つだけ選ぶ。' },
    ],
    soundHook: '短い口ずさみ: 「晴れに見えても、風は吹く。仕事の天気を、いっしょに見る。」',
    useScene: 'SNS導入、研修冒頭、ポスター、アクセシブルな読み下しつき動画。',
  },
  {
    label: '会議ツール',
    title: '研修後15分で、会議に一手を残す',
    family: 'Manual abundance / Workshop-to-implementation',
    channel: 'Meeting kit',
    premise: '資料や研修が増えても、会議で一手が残らなければ実装されません。研修後15分で、場で動く3枚に変えます。',
    artifactTitle: '15分会議3枚セット',
    downloadHref: '/downloads/teaching-library/three-sheet-meeting-kit-v1.html',
    downloadLabel: '15分会議3枚を開く',
    blocks: [
      { label: '1枚目', text: '今日見る場面: 誰が、いつ、何の仕事で止まったか。' },
      { label: '2枚目', text: '分ける表: 本人、仕事、情報、時間、支援、評価に分ける。' },
      { label: '3枚目', text: '二週間の確認: 何を、誰が、いつまで、どう戻すか。' },
    ],
    useScene: '研修後の現場会議、支援機関とのケース会議、企業内の改善ミーティング。',
  },
];

const publicPartnershipSampleMap = [
  {
    label: '時間',
    title: '締切の山が偏っている',
    body: '月末だけ作業量と確認待ちが重なり、回復時間が消える。',
  },
  {
    label: '情報',
    title: '変更連絡が口頭で流れる',
    body: '聞き逃しではなく、変更点が残らず、後から確認しにくい。',
  },
  {
    label: '評価',
    title: '処理量だけが見られる',
    body: '安定して続ける工夫や確認品質が、評価の言葉に乗りにくい。',
  },
  {
    label: '相談',
    title: '相談先が決まっていない',
    body: '困った時に誰へ、何を、どの粒度で相談するかが曖昧になる。',
  },
  {
    label: '余白',
    title: '生活側にしわ寄せが出る',
    body: '就業中だけ整っても、帰宅後の回復や通院準備が圧迫される。',
  },
];

const publicPartnershipMangaFrames = [
  {
    label: '1',
    title: '止まる',
    line: '「疲れやすいので、配慮が必要です」',
    body: '人事も支援者も、何を変える話なのかを決めにくい。',
  },
  {
    label: '2',
    title: '分ける',
    line: '「月末、口頭変更、確認待ち、評価のどこが重なる？」',
    body: '本人の状態を軽く扱わず、仕事の条件に分けて見る。',
  },
  {
    label: '3',
    title: '試す',
    line: '「月末前後だけ、変更メモと確認先を固定してみる」',
    body: '正解配慮ではなく、小さく確認できる仕事条件に戻す。',
  },
];

const publicCoCreationProductSteps = [
  {
    label: '条件マップ',
    title: '疲れやすい、で止めない',
    body: '締切、休憩、回復時間、情報共有、評価が重なる場所を一枚で見る。',
    output: '1枚図解 + 読み下し',
    icon: Layers3,
  },
  {
    label: 'ミニマンガ',
    title: '場面の変化を順番に読む',
    body: '止まりやすい見方、仕事条件への置き直し、次の問いを3場面で見せる。',
    output: '3場面カード + テキスト版',
    icon: MessagesSquare,
  },
  {
    label: '研修ワーク',
    title: '同じ場面で話す練習にする',
    body: '企業担当者と支援者が、配慮名ではなく確認条件で話せる導入にする。',
    output: '45分構成 + ワークシート',
    icon: BookOpen,
  },
  {
    label: '短い映像',
    title: '考え始める入口にする',
    body: '音や短い映像で違和感を開き、詳細ページや研修へ戻す。',
    output: '30秒台本 + 読み下し',
    icon: Sparkles,
  },
];

const publicPartnershipLessonTakeaways = [
  '疲れやすさを、本人の努力や意欲だけで説明しない。',
  '仕事量、締切、連絡、評価、回復時間を同じ地図に置く。',
  '支援者と企業担当者が、同じ場面を見ながら確認できる問いにする。',
  '個別判断ではなく、次に確認する仕事条件を一つ選ぶ。',
];

const publicPartnershipLongReadSections = [
  {
    eyebrow: '場面',
    title: '月末になると、働きづらさが強くなる。',
    paragraphs: [
      'ある職場で、月末が近づくと入力作業、確認待ち、差し戻し、会議準備が重なります。本人は「疲れやすいので配慮が必要」と伝えています。企業側は、本人の事情を尊重したいと思いながらも、締切をどう変えればよいのか、周囲に何を説明すればよいのかが分かりません。',
      'この場面を「疲れやすい人への対応」とだけ見ると、話し合いは止まりやすくなります。本人の体調説明、企業の負担感、同僚への説明、支援者の助言がばらばらに並び、職場で次に確認することが見えにくくなるからです。',
    ],
  },
  {
    eyebrow: '読み替え',
    title: '本人の状態を軽く扱わず、仕事の条件に置き直す。',
    paragraphs: [
      'ここで大切なのは、本人の疲れやすさを否定したり、一般的な努力の問題に戻したりしないことです。同時に、疲れやすさを本人の中だけで完結する説明にもしません。いつ、どの仕事条件と重なると働きづらさが強くなるのかを、関係者が同じ場面で見ます。',
      '月末の締切、休憩の取り方、変更連絡の残り方、確認先、評価で見られる項目、帰宅後の回復時間。これらを同じ地図に置くと、「何を配慮するか」より前に、「何を確認すればよいか」が見えてきます。',
    ],
  },
  {
    eyebrow: '共有',
    title: '企業と支援者が、同じ表を見て話せるようにする。',
    paragraphs: [
      '企業担当者は、職場の締切や人員配置の制約を知っています。支援者は、本人が言葉にしにくい負荷や生活側の余白に気づきやすい立場にいます。どちらか一方の見方だけでは、問題は「本人の説明不足」か「職場の理解不足」に寄ってしまいます。',
      '同じ表に置くと、企業側の制約と支援者側の問いが対立ではなく、次に確認する仕事条件になります。たとえば、月末前後だけ変更点を文書に残す、確認先を一つにする、休憩を後ろ倒しにしない、評価で見る項目を処理件数だけにしない、といった小さな試行が候補になります。',
    ],
  },
  {
    eyebrow: '次に試す条件',
    title: '正解を急がず、二週間だけ試せる条件にする。',
    paragraphs: [
      '最初から最終的な結論を決める必要はありません。むしろ、いきなり「合理的配慮は何か」「勤務を続けられるか」といった大きな問いに進むと、関係者の緊張が高まり、確認できることまで見えなくなります。',
      'この教材で持ち帰るのは、判断ではなく、二週間だけ試せる仕事条件です。月末前後の変更連絡をメモで残す。確認先を一人にする。休憩が後ろ倒しになった日を記録する。処理件数だけでなく、確認品質や手戻りの減少も見る。小さく試すことで、本人の状態と仕事条件の関係が少しずつ見えます。',
    ],
  },
];

const publicPartnershipCompletedWorksheetRows = [
  {
    axis: '時間',
    observed: '月末3営業日前から締切が重なり、休憩を後ろ倒しにしている。',
    nextQuestion: '月末だけ締切、確認、休憩の置き方を分けて見られるか。',
  },
  {
    axis: '情報',
    observed: '変更連絡が口頭、チャット、会議で分散し、確認のやり直しが増えている。',
    nextQuestion: '変更点だけを一か所に残し、誰が最終確認するかを決められるか。',
  },
  {
    axis: '評価',
    observed: '処理件数だけが見え、確認品質や安定して続ける工夫が見えにくい。',
    nextQuestion: '件数以外に、手戻りの減少、確認品質、継続性も見られるか。',
  },
  {
    axis: '相談',
    observed: '誰に何を相談すればよいかが曖昧で、本人が説明を抱え込みやすい。',
    nextQuestion: '相談先、相談してよい粒度、相談する時間帯を決められるか。',
  },
  {
    axis: '余白',
    observed: '帰宅後の回復時間と通院準備が削られ、翌週に疲労が残りやすい。',
    nextQuestion: '勤務中だけでなく、翌日以降の回復に影響する条件を見られるか。',
  },
];

const publicPartnershipFacilitatorScript = [
  {
    label: '導入',
    line: '今日は「疲れやすい人への配慮」を決める時間ではありません。疲れやすさが、どの仕事条件と重なると働きづらさになるのかを見ます。',
  },
  {
    label: '問いかけ',
    line: '本人の状態、企業の制約、支援者の気づきが、別々の紙に書かれていないでしょうか。同じ場面に置くと、次に確認できることは何でしょうか。',
  },
  {
    label: '板書',
    line: '「状態」ではなく「条件」を5つ並べる。時間、情報、評価、相談、余白。それぞれに、見えている事実と次に聞くことを書く。',
  },
  {
    label: 'まとめ',
    line: '結論を急がず、二週間だけ試せる条件を一つ選びます。試した後に、本人、上司、支援者が同じ表を見直せる形にします。',
  },
];

const publicPartnershipTrainingAgenda = [
  {
    time: '0-5分',
    title: '一場面を読む',
    body: '「疲れやすい」で止まった相談を、本人の問題として決めつけずに読む。',
  },
  {
    time: '5-15分',
    title: '条件マップに置く',
    body: '時間、情報、評価、相談、生活の余白へ分け、どこが重なるかを探す。',
  },
  {
    time: '15-30分',
    title: '企業側と支援者側を並べる',
    body: '企業の制約と支援者の問いを同じ表に置き、確認できることへ変える。',
  },
  {
    time: '30-40分',
    title: '次に試す条件を選ぶ',
    body: '全体解決ではなく、2週間だけ試せる条件変更を一つ書く。',
  },
  {
    time: '40-45分',
    title: '持ち帰る',
    body: '個別判断を避け、職場で確認する問いとして持ち帰る。',
  },
];

const publicPartnershipWorksheetPrompts = [
  'どの時間帯・時期に負荷が重なっていますか。',
  '口頭、チャット、紙、会議のどこで情報が消えますか。',
  '何が評価され、何が見えないままですか。',
  '誰が、いつ、どの粒度で相談を受けると動きやすいですか。',
];

const publicPartnershipVideoBeats = [
  {
    second: '0-6秒',
    visual: '机の上に「疲れやすい」の付箋だけが置かれる。',
    caption: 'そこで止めると、誰も動けない。',
  },
  {
    second: '6-14秒',
    visual: '付箋が、締切、休憩、情報共有、評価へ分かれる。',
    caption: '仕事の条件に分けると、見えるものが変わる。',
  },
  {
    second: '14-23秒',
    visual: '人事、上司、支援者のメモが同じ地図に重なる。',
    caption: '同じ場面を見られると、話し合いが始まる。',
  },
  {
    second: '23-30秒',
    visual: '最後に「まず一つ、確認できる条件へ」と表示する。',
    caption: '答えを急がず、仕事を見直す入口へ。',
  },
];

function getPublicCopy(page: NextSiteCandidatePage) {
  return publicPageCopy[page.id] ?? publicPageCopy['NS-01'];
}

function PublicShell({
  children,
  currentId = 'NS-01',
  routeBase = previewBase,
}: {
  children: ReactNode;
  currentId?: string;
  routeBase?: string;
}) {
  return (
    <NextNblRouteBaseContext.Provider value={routeBase}>
      <div className="nbl-public-preview min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#fbfaf5] text-slate-950">
      <div className="border-b border-cyan-900/20 bg-slate-950 px-5 py-2 text-white">
        <div className="mx-auto flex max-w-7xl min-w-0 flex-col gap-1 text-xs leading-5 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold tracking-[0.08em] text-cyan-100">
            働きづらさを仕事条件から考える
          </p>
          <p className="min-w-0 text-white/76">
            <span className="md:hidden">個別判断・最新制度の断定は扱いません。</span>
            <span className="hidden md:inline">
              個別相談、医療・法務・雇用判断、配慮妥当性の結論、最新制度の断定は扱いません。
            </span>
          </p>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbfaf5]/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link href={previewBase} className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-cyan-800">
              働きづらさを仕事の条件から考える
            </span>
            <span className="text-sm font-semibold text-slate-950">Next Being Lab</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {publicNavItems.map((item) => {
              const page = nextSiteCandidatePages.find((candidate) => candidate.id === item.id);
              if (!page) return null;
              return (
                <Link
                  key={item.id}
                  href={getNextNblPreviewHref(page)}
                  className={`border-b-2 px-3 py-1.5 text-sm transition ${
                    currentId === item.id
                      ? 'border-slate-950 text-slate-950'
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {publicUtilityNavItems.map((item) => {
              const page = nextSiteCandidatePages.find((candidate) => candidate.id === item.id);
              if (!page) return null;
              return (
                <Link
                  key={item.id}
                  href={getNextNblPreviewHref(page)}
                  className={`ml-2 rounded-md border px-3 py-1.5 text-sm transition ${
                    currentId === item.id
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-cyan-500 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="flex max-w-full flex-wrap gap-x-2 gap-y-1 overflow-x-hidden border-t border-slate-200 px-5 py-2 lg:hidden">
          {publicNavItems.map((item) => {
            const page = nextSiteCandidatePages.find((candidate) => candidate.id === item.id);
            if (!page) return null;
            return (
              <Link
                key={item.id}
                href={getNextNblPreviewHref(page)}
                className={`whitespace-nowrap border-b-2 px-2 py-1.5 text-[13px] ${
                  currentId === item.id
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {publicUtilityNavItems.map((item) => {
            const page = nextSiteCandidatePages.find((candidate) => candidate.id === item.id);
            if (!page) return null;
            return (
              <Link
                key={item.id}
                href={getNextNblPreviewHref(page)}
                className={`whitespace-nowrap rounded-md border px-2 py-1.5 text-[13px] ${
                  currentId === item.id
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-300 text-slate-600'
                }`}
              >
                {'mobileLabel' in item ? item.mobileLabel : item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
      </div>
    </NextNblRouteBaseContext.Provider>
  );
}

function PublicHero({
  page,
  overview = false,
}: {
  page: NextSiteCandidatePage;
  overview?: boolean;
}) {
  const copy = getPublicCopy(page);
  const mapPage = nextSiteCandidatePages[1];
  const scenePage = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-04') ?? mapPage;
  const detailFlow = publicDetailFlowPanels[page.id];
  const detailNextPage = detailFlow
    ? nextSiteCandidatePages.find((candidate) => candidate.id === detailFlow.nextTargetId)
    : undefined;
  const conceptPage = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-07');
  const currentPageHref = getNextNblPreviewHref(page);
  const primaryHref = overview
    ? `${previewBase}#old-new-problems`
    : page.id === 'NS-07'
      ? `${currentPageHref}#page-flow`
      : page.id === 'NS-08'
        ? '/contact'
      : page.id === 'NS-05'
        ? `${currentPageHref}#question-note-01`
        : page.id === 'NS-03'
          ? `${currentPageHref}#future-design-map`
      : `${currentPageHref}#page-flow`;
  const secondaryHref = overview
    ? `${previewBase}#product-map`
    : page.id === 'NS-02'
      ? getNextNblPreviewHref(conceptPage ?? mapPage)
      : page.id === 'NS-07'
        ? `${previewBase}#product-map`
        : page.id === 'NS-08'
          ? previewBase
        : page.id === 'NS-05'
          ? `${currentPageHref}#lens-library`
        : getNextNblPreviewHref(detailNextPage ?? mapPage);
  const primaryLabel = overview
    ? copy.primary
    : copy.primary;
  const secondaryLabel = overview
    ? copy.secondary
    : page.id === 'NS-02'
      ? '理論を読む'
      : page.id === 'NS-07'
        ? copy.secondary
        : page.id === 'NS-08'
          ? copy.secondary
        : page.id === 'NS-05'
          ? copy.secondary
        : detailFlow?.nextLabel ?? copy.secondary;
  const heroShellWidthClass =
    page.id === 'NS-06'
      ? 'max-w-[18rem] sm:max-w-7xl'
      : 'max-w-[22rem] sm:max-w-7xl';
  const heroTextWidthClass =
    page.id === 'NS-06'
      ? 'max-w-[18rem] sm:max-w-3xl'
      : 'max-w-[22rem] sm:max-w-3xl';

  return (
    <section className="relative overflow-hidden bg-[#11130f] text-white">
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div
        className={`mx-auto grid min-h-[560px] w-full items-center gap-10 px-5 py-16 lg:grid-cols-[0.88fr_1.12fr] ${heroShellWidthClass}`}
        style={{ boxSizing: 'border-box' }}
      >
        <div className={`relative z-10 min-w-0 ${heroTextWidthClass}`}>
          <p className="text-sm font-semibold tracking-[0.18em] text-cyan-100">{copy.eyebrow}</p>
          <h1
            aria-label={overview || page.id === 'NS-03' || page.id === 'NS-05' || page.id === 'NS-06' || page.id === 'NS-07' || page.id === 'NS-08' || page.id === 'NS-09' ? copy.headline : undefined}
            className="mt-5 max-w-full break-all text-[32px] font-semibold leading-[1.08] tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-[60px]"
          >
            {overview ? (
              <>
                <span className="block">見えなかった関係を、</span>
                <span className="block">仕事条件の</span>
                <span className="block">地図へ。</span>
              </>
            ) : page.id === 'NS-03' ? (
              <>
                <span className="block">21視点で</span>
                <span className="block">未来の仕事を設計する</span>
              </>
            ) : page.id === 'NS-05' ? (
              <>
                <span className="block">働き方の問いを</span>
                <span className="block">ひらく</span>
                <span className="block">記事集</span>
              </>
            ) : page.id === 'NS-07' ? (
              <>
                <span className="block">見えなかった関係を、</span>
                <span className="block">仕事条件の</span>
                <span className="block">知識ネットワークへ。</span>
              </>
            ) : page.id === 'NS-08' ? (
              <>
                <span className="block">NBL</span>
                <span className="block">について。</span>
              </>
            ) : page.id === 'NS-09' ? (
              <>
                <span className="block">障害種類・疾病名から、</span>
                <span className="block">職場条件へ。</span>
              </>
            ) : page.id === 'NS-06' ? (
              <>
                <span className="block">認知補助</span>
                <span className="block">ツールキット</span>
              </>
            ) : (
              copy.headline
            )}
          </h1>
          <p className="mt-7 max-w-2xl break-all text-base leading-8 text-white/82 [overflow-wrap:anywhere] md:break-normal md:text-lg md:leading-9">{copy.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
        <div className={`relative z-10 min-w-0 ${page.id === 'NS-02' || page.id === 'NS-03' || page.id === 'NS-04' || page.id === 'NS-06' || page.id === 'NS-07' || page.id === 'NS-08' || page.id === 'NS-09' ? 'block' : 'hidden lg:block'}`}>
          {overview ? (
          <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
            <div>
              <img
                src={publicHeroImage}
                alt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="border-t border-slate-200 bg-white p-5 text-slate-950">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  古くて新しい課題
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  関係を読めると、支援の形が変わる。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  本人、仕事、環境、支援、時間、制度を同じ地図に置き、相談、学習、記事、教材へ渡します。
                </p>
              </div>
            </div>
          </div>
          ) : page.id === 'NS-02' ? (
            <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
              <img
                src={publicWorkDesignMapVisualImage}
                alt="相談の一言を、時間、作業、情報、環境、支援、評価、共有の仕事条件へ展開する図"
                className="aspect-[16/9] w-full bg-white object-contain"
              />
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  相談事例集の読み方
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  一言を、仕事条件の地図へ。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  すぐに判断せず、同じ職場場面を時間、作業、情報、環境、支援、評価、共有へ分けて読みます。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-04' ? (
            <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
              <img
                src={publicStudioStoryboardImage}
                alt="場面から入る、月末締切、手順変更、動線と道具、開示と評価を並べた4コマストーリーボード"
                className="aspect-[16/9] w-full bg-white object-contain"
              />
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  4コマストーリー
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  4場面を、先に絵で見る。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  月末締切、手順変更、動線と道具、開示と評価。まず場面でつかみ、その後に仕事条件へ戻します。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-03' ? (
            <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
              <img
                src={publicFutureDesign21ViewMapImage}
                alt="21視点で未来の仕事を設計するために、仕事条件と人間の多様性を中心に、健康時間と生活、入口・翻訳・支援、職場・参加・価値の3設計面と、企業経営、雇用管理、専門支援、制度設計の4実装領域へ展開する図解"
                className="aspect-[16/9] w-full bg-white object-contain"
              />
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  未来設計マップ
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  仕事条件から、未来の取り組みへ。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  4領域は使う先、3設計面は見る角度、21視点は手元の問いです。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-07' ? (
            <div
              className="w-full max-w-full min-w-0 overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl"
            >
              <img
                src={publicKnowledgeNetworkTheoryMobileImage}
                alt="断片情報と偏りを、ICF相互作用とAI文脈読解で専門知識ネットワークへ変換し、相談事例、21視点、記事、場面、認知補助ツールへ展開する図解"
                className="mx-auto block w-full max-w-full bg-white sm:hidden"
                style={{ height: 'auto' }}
              />
              <img
                src={publicKnowledgeNetworkTheoryImage}
                alt="断片情報と偏りを、ICF相互作用とAI文脈読解で専門知識ネットワークへ変換し、相談事例、21視点、記事、場面、認知補助ツールへ展開する図解"
                className="hidden w-full min-w-0 max-w-full bg-white sm:block"
              />
              <div className="min-w-0 border-t border-slate-200 bg-white p-4 sm:p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  理論の全体像
                </p>
                <h2 className="mt-2 break-all text-xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-3xl">
                  断片情報を、使える関係の地図へ。
                </h2>
                <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                  偏りを含みうる情報をそのまま答えにせず、ICF相互作用とAIの文脈読解で専門知識ネットワークへ変換し、人間向けの入口へ戻します。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-08' ? (
            <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
              <img
                src={publicHeroImage}
                alt="Next Being Labの運営チームが公開情報、実践知、読者からの問いを整理し、仕事条件の見方として社会へ返しているイラスト"
                className="aspect-[16/9] w-full bg-white object-cover"
              />
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  基本情報
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  NBLとは何か、どこへ連絡できるか。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  運営主体、目的、情報の扱い、連絡先、個別判断をしない境界を確認できます。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-09' ? (
            <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
              <img
                src={publicConditionWindowHeroImage}
                alt="障害種類・疾病名から、時間、情報、環境、動線、評価、支援の職場条件へつなぎ、相談事例集、21視点、場面、記事、ツールキットへ進む図"
                className="aspect-[16/9] w-full bg-white object-contain"
              />
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  このページの見取り図
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  名前を入口にして、確認する条件へ進む。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  障害種類・疾病名を答えにせず、時間、情報、環境、動線、評価、支援へ視界を広げます。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-05' ? (
            <div className="w-full max-w-full overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl">
              <img
                src={publicArticleLibraryHubMobileImage}
                alt="ニュース、SNS、制度、研究、研修現場の問いを専門知識ネットワークで関係として読み、記事、図解、相談事例、21視点、教材へ返す図解"
                className="mx-auto block w-full max-w-full bg-white sm:hidden"
                style={{ height: 'auto' }}
              />
              <img
                src={publicArticleLibraryHubImage}
                alt="ニュース、SNS、制度、研究、研修現場の問いを専門知識ネットワークで関係として読み、記事、図解、相談事例、21視点、教材へ返す図解"
                className="hidden w-full bg-white sm:block"
              />
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  読む入口
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                  問いから、本文へ。
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  まず記事を選び、図解と本文で読む。
                </p>
              </div>
            </div>
          ) : page.id === 'NS-06' ? (
            <div className="w-full max-w-[16rem] min-w-0 overflow-hidden border border-white/18 bg-[#f8f3e8] text-slate-950 shadow-2xl sm:max-w-full">
              <img
                src={publicCognitiveToolkitHeroImage}
                alt="参加者が図解、音楽、映像、ワークシートを囲んで、あ、そうかと気づきながら同じ場面を共有する認知補助ツールキットの図解"
                className="block aspect-[16/9] w-full min-w-0 max-w-full bg-white object-contain"
              />
              <div className="min-w-0 border-t border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  このページ自体が入口
                </p>
                <h2 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-3xl">
                  見えると、同じ場面を話し始められる。
                </h2>
                <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                  音楽、映像、図解、ワークで、言葉だけでは届きにくい関係を場に置きます。
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-white/18 bg-[#f8f3e8] p-6 text-slate-950 shadow-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">{copy.eyebrow}</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-normal">
                {copy.label}
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-800">{copy.promise}</p>
              <div className="mt-6 grid gap-3">
                <div className="border border-slate-300 bg-white p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">使う場面</p>
                  <p className="mt-2 text-base font-semibold leading-7">{copy.problem}</p>
                </div>
                <div className="border border-slate-300 bg-white p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">扱わないこと</p>
                  <p className="mt-2 text-base font-semibold leading-7">{copy.notThis}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbfaf5] to-transparent" />
    </section>
  );
}

function PublicAhaPanel() {
  return (
    <section className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-7 lg:grid-cols-[0.64fr_1.36fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-rose-800">
              最初の見方の転換
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              困りごとの名前から、仕事の条件へ。
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              診断名、障害の種類、困りごとの名前は入口です。そこから一歩進めて、職場で確認できる条件に分けます。
            </p>
          </div>
          <div className="grid gap-4">
            {publicAhaRows.map((row, index) => {
              const Icon = row.icon;
              return (
                <article
                  key={row.stuck}
                  className="overflow-hidden border border-slate-300 bg-white shadow-sm md:grid md:grid-cols-[0.9fr_5rem_1.1fr]"
                >
                  <div className="p-5">
                    <div className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold ${row.tone}`}>
                      <Icon size={16} aria-hidden="true" />
                      <span>場面 {index + 1}: {row.scene}</span>
                    </div>
                    <div className="relative mt-4 border border-slate-300 bg-[#fbfaf5] p-4">
                      <span
                        className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-slate-300 bg-[#fbfaf5]"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-semibold text-slate-500">止まりやすい見方</p>
                      <p className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                        {row.stuck}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        読み下し: ここでは本人を責めず、まだ仕事条件に分けられていない言葉として受け取ります。
                      </p>
                    </div>
                  </div>
                  <div className="grid place-items-center border-y border-slate-200 bg-slate-50 px-5 py-3 md:border-x md:border-y-0 md:px-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-cyan-800 md:flex-col">
                      <span aria-hidden="true" className="rotate-90 text-2xl leading-none md:rotate-0">→</span>
                      <span>翻訳</span>
                    </div>
                  </div>
                  <div className="bg-[#f6fbfa] p-5">
                    <p className="text-sm font-semibold text-cyan-800">仕事の条件として見る</p>
                    <p className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                      {row.reframed}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${row.scene}で確認する仕事条件`}>
                      {row.checks.map((check) => (
                        <li
                          key={check}
                          className="border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                        >
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicReaderRoutesPanel() {
  return (
    <section id="reader-routes" className="scroll-mt-24 border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.64fr_1.36fr]">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              まず、近い立場から読む
            </p>
            <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              誰の困りごとから入っても、仕事条件の地図へ戻る。
            </h2>
            <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              本人、家族、支援者、企業、研修・政策に関わる人が、それぞれ別の言葉で困りごとを持っています。ここでは最初の立場を選び、その言葉を、時間、作業、情報、支援、評価、共有範囲として読み直します。
            </p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {publicAudienceEntryCards.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.label}
                  href={route.href}
                  className="group flex min-h-[320px] min-w-0 flex-col border border-slate-300 bg-[#fbfaf5] p-5 transition hover:border-cyan-500 hover:bg-cyan-50/50"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                        {route.label}
                      </p>
                      <h3 className="mt-1 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                        {route.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                    {route.situation}
                  </p>
                  <div className="mt-4 border-l-4 border-cyan-700 bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                      最初の問い
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold leading-7 text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                      {route.firstQuestion}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs leading-6 text-slate-600">
                    <p>
                      <span className="font-semibold text-rose-800">このページでしないこと: </span>
                      {route.boundary}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                    {route.nextLabel}
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicHomeOneGlancePanel() {
  return (
    <section id="old-new-problems" className="scroll-mt-24 border-b border-slate-200 bg-white py-12">
      <div className="mx-auto grid w-full max-w-[22rem] box-border gap-8 px-5 sm:max-w-7xl lg:grid-cols-[0.48fr_1.52fr]">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            古くて新しい課題
          </p>
          <h2
            aria-label="支援が足りないだけではない。関係を読める地図が足りなかった。"
            className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl"
          >
            <span className="block">支援が足りないだけではない。</span>
            <span className="block">関係を読める地図が足りなかった。</span>
          </h2>
          <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
            障害者雇用や難病就労支援には、制度、支援機関、マニュアル、好事例、研修があります。それでも現場で詰まるのは、本人、仕事、環境、支援、時間、制度の関係を同じ地図で読みにくいからです。
          </p>
          <Link
            href={publicPageHrefById('NS-07')}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-500"
          >
            なぜ可能かを見る
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2">
          {publicOldNewProblemCards.map((card) => {
            const Icon = card.icon;
            return (
            <article
              key={card.title}
              className="min-w-0 border border-slate-300 bg-[#fbfaf5] p-4 md:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-950 text-white md:h-10 md:w-10">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                    {card.label}
                  </p>
              <h3 className="mt-2 break-all text-lg font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-xl">
                    {card.title}
              </h3>
              <p className="mt-2 break-all text-sm leading-6 text-slate-700 [overflow-wrap:anywhere] md:break-normal md:leading-7">
                    {card.body}
              </p>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PublicHomeConditionWindowPanel() {
  const conditionWindowPage =
    nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-09') ??
    nextSiteCandidatePages[0];

  return (
    <section id="condition-window" className="scroll-mt-24 border-b border-slate-200 bg-[#f7f3e8] py-12">
      <div className="mx-auto grid w-full max-w-[22rem] box-border gap-8 px-5 sm:max-w-7xl lg:grid-cols-[0.52fr_1.48fr]">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            障害種類から見る
          </p>
          <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
            障害種類から入って、仕事の見方を広げる。
          </h2>
          <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
            発達障害、精神障害、難病、内部障害などから探し始める読者のための入口です。よくある特性理解に、時間、情報、環境、評価、支援の見方を重ねると、対応の選択肢が広がります。
          </p>
          <Link
            href={getNextNblPreviewHref(conditionWindowPage)}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
          >
            障害種類から見る
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {publicConditionWindowCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.examples}
                href={conditionCardAnchorHref(card.slug)}
                className="group flex min-h-[230px] flex-col border border-slate-300 bg-white p-4 transition hover:border-cyan-500 hover:bg-cyan-50/50"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  {card.label}
                  </p>
                </div>
                <h3 className="mt-2 break-all text-lg font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                  {card.examples}
                </h3>
                <p className="mt-3 break-all text-xs font-semibold tracking-[0.12em] text-cyan-800 [overflow-wrap:anywhere] md:break-normal">
                  読みを広げる入口
                </p>
                <p className="mt-1 flex-1 break-all text-sm leading-7 text-slate-800 [overflow-wrap:anywhere] md:break-normal">
                  {card.homeSummary}
                </p>
                <div className="mt-3 grid gap-1 border-t border-slate-200 pt-3 text-xs font-semibold leading-5 text-slate-600">
                  <p>
                    <span className="text-rose-800">起きやすいこと: </span>
                    {card.difficultyFormula.result}
                  </p>
                  <p>
                    <span className="text-cyan-800">確認する条件: </span>
                    {card.solutionFormula.result}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                  この見取り図を見る
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

function PublicHomeProductMapPanel() {
  const theoryPage = nextSiteCandidatePages[6];

  return (
    <section id="product-map" className="scroll-mt-24 border-b border-slate-200 bg-white py-12">
      <div className="mx-auto w-full max-w-[22rem] box-border px-5 sm:max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
          <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              5つの入口
          </p>
          <h2 className="mt-3 break-all text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
              同じ知識ネットワークを、使う形に分ける。
          </h2>
          <p className="mt-4 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              相談前に読む、組織で学ぶ、社会の話題を記事にする、研修で共有する。必要な場面が違うため、同じ仕事条件の地図を5つの入口に分けています。
          </p>
          </div>
          <Link
            href={getNextNblPreviewHref(theoryPage)}
            className="group grid min-w-0 gap-4 border border-slate-900 bg-slate-950 p-5 text-white transition hover:bg-cyan-950 md:grid-cols-[0.34fr_1fr_auto] md:items-center"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.16em] text-cyan-100">
                背景にある考え方
            </p>
            <h3 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
                なぜ可能か
            </h3>
          </div>
          <p className="break-all text-sm leading-7 text-white/78 [overflow-wrap:anywhere] md:break-normal">
              断片情報をそのまま答えにせず、ICF相互作用とAIの文脈読解で、本人・仕事・環境・支援・時間・制度の関係を見える地図へ変える方法です。
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 group-hover:text-white">
              考え方を見る
            <ArrowRight size={15} />
          </span>
        </Link>
        </div>
        <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {publicHomeProductCards.map((product) => {
            const Icon = product.icon;
            return (
            <Link
              key={product.label}
              href={getNextNblPreviewHref(product.page)}
              className="group flex min-h-[260px] flex-col border border-slate-300 bg-[#fbfaf5] p-5 transition hover:border-cyan-500 hover:bg-cyan-50/50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white">
                <Icon size={18} aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-cyan-800">
                {product.role}
              </p>
              <h3 className="mt-2 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                {product.label}
              </h3>
              <p className="mt-3 flex-1 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                {product.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                見る
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

function PublicControlSkeletonPanel() {
  return (
    <section className="border-b border-slate-200 bg-[#fbfaf5] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-4 md:grid-cols-3">
          {publicControlSkeletonCards.map((card) => {
            const Icon = card.icon;
            const page =
              nextSiteCandidatePages.find((candidate) => candidate.id === card.targetId) ??
              nextSiteCandidatePages[0];

            return (
              <Link
                key={card.label}
                href={getNextNblPreviewHref(page)}
                className="group min-w-0 border border-slate-300 bg-white p-5 transition hover:border-cyan-500 hover:bg-cyan-50/50"
              >
                <Icon size={20} className="text-cyan-800" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  {card.label}
                </p>
                <h2 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                  {card.title}
                </h2>
                <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                  {card.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                  確認する
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

function PublicHomeProofPanel() {
  return (
    <section className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              たとえば、疲れやすさ
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              配慮の話を、仕事の話に変える。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              疲れやすさは大切なサインです。だからこそ、月末締切や休憩、回復時間、情報共有、評価と一緒に見ます。
            </p>
          </div>
          <div className="border border-slate-300 bg-[#fbfaf5]">
            <div className="grid gap-0 md:grid-cols-[1fr_auto_1.12fr]">
              <div className="bg-white p-5">
                <p className="text-sm font-semibold text-rose-800">止まりやすい言い方</p>
                <p className="mt-3 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                  「疲れやすいので配慮が必要です」で止まる
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  本人の状態だけが前面に出て、仕事側の変えられる余地が隠れる。
                </p>
              </div>
              <div className="grid place-items-center border-y border-slate-300 bg-slate-50 px-5 py-4 md:border-x md:border-y-0">
                <ArrowRight size={24} className="rotate-90 text-cyan-800 md:rotate-0" aria-hidden="true" />
              </div>
              <div className="bg-cyan-50 p-5">
                <p className="text-sm font-semibold text-cyan-800">仕事の条件として見る</p>
                <p className="mt-3 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                  月末締切、休憩、回復時間、情報共有、評価の重なりを見る。
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  話し合いの焦点が、本人の弱さから、変えられる仕事条件へ移る。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicFlagshipThemePanel() {
  return (
    <section id="fatigue-product-packet" className="scroll-mt-24 border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              {fatigueProductPacket.status}
            </p>
            <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              「疲れやすい」を、同じ週の仕事条件として見直す。
            </h2>
            <p className="mt-4 break-all text-2xl font-semibold leading-snug tracking-normal text-cyan-900 [overflow-wrap:anywhere] md:break-normal">
              {fatigueProductPacket.tagline}
            </p>
            <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              {fatigueProductPacket.lead}
            </p>
            <div className="mt-6 border-l-4 border-cyan-700 bg-[#fbfaf5] p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                起点の断片
              </p>
              <p className="mt-2 break-all text-base font-semibold leading-7 text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                {fatigueProductPacket.sourceFragment}
              </p>
            </div>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {fatigueProductPacket.routeCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group min-w-0 border border-slate-300 bg-[#fbfaf5] p-5 transition hover:border-cyan-500 hover:bg-cyan-50/50"
                >
                  <Icon size={19} className="text-cyan-800" aria-hidden="true" />
                  <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-cyan-800">{card.label}</p>
                  <h3 className="mt-2 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                    {card.title}
                  </h3>
                  <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                    {card.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                    開く
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {fatigueProductPacket.otherExamples.map((example) => (
            <article key={example.label} className="border border-slate-300 bg-[#fbfaf5] p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                ほかの代表例 / {example.label}
              </p>
              <h3 className="mt-2 break-all text-lg font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                {example.title}
              </h3>
              <p className="mt-2 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                {example.body}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="grid gap-3 md:grid-cols-2">
            {fatigueProductPacket.readingColumns.map((column) => (
              <article key={column.label} className="min-w-0 border border-slate-300 bg-[#fbfaf5] p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">{column.label}</p>
                <h3 className="mt-2 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                  {column.title}
                </h3>
                <ul className="mt-4 grid gap-2 text-sm leading-7 text-slate-700">
                  {column.items.map((item) => (
                    <li key={item} className="border border-slate-200 bg-white px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <aside className="min-w-0 border border-slate-300 bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
              この読み方の注意
            </p>
            <h3 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
              読者に渡すのは、結論ではなく確認できる地図。
            </h3>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-white/78">
              {fatigueProductPacket.reviewNotes.map((note) => (
                <li key={note} className="border border-white/15 bg-white/[0.06] p-3">
                  {note}
                </li>
              ))}
            </ul>
            <div className="mt-5 border border-cyan-200/30 bg-cyan-50 p-4 text-slate-950">
              <p className="text-sm font-semibold text-cyan-900">
                SNS反応は根拠にしない
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                反応は、記事の見出し、図解ラベル、研修問いの直し方を見つけるために使います。相談受付や自動学習、個別判断には接続しません。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function PublicHomeSystemPanel() {
  return (
    <section className="border-b border-slate-200 bg-[#fbfaf5] py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.64fr_1.36fr]">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              何をする場所か
            </p>
            <h2 className="mt-3 break-all text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              説明を読むだけでなく、使える道具へ進む。
            </h2>
            <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              このサイトでは、場面、相談事例、理論、記事、教材を別々の資料として置きません。読者が近い課題から入り、同じ仕事条件の地図を使って読み返せるようにつなげています。
            </p>
            <div className="mt-6 border-l-4 border-cyan-700 bg-white p-4 text-sm leading-7 text-slate-700">
              ここで大切にするのは、すぐ答えを出すことではありません。本人、仕事、環境、支援、時間、制度の関係を見える形にし、関係者が確認できる問いへ変えることです。
            </div>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {publicSystemBridgeCards.map((card) => {
              const Icon = card.icon;
              const page =
                nextSiteCandidatePages.find((candidate) => candidate.id === card.targetId) ??
                nextSiteCandidatePages[0];

              return (
                <Link
                  key={card.label}
                  href={getNextNblPreviewHref(page)}
                  className="group flex min-h-[260px] min-w-0 flex-col border border-slate-300 bg-white p-4 transition hover:border-cyan-500 hover:bg-cyan-50/50"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-cyan-800">
                    {card.label}
                  </p>
                  <h3 className="mt-2 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">{card.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                    開く
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicMethodBridgePanel() {
  const conceptPage =
    nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-07') ??
    nextSiteCandidatePages[1];
  const casePage =
    nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-02') ??
    nextSiteCandidatePages[1];

  return (
    <section className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              サイト全体の奥にある発見
            </p>
            <h2 className="mt-3 break-all text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              分断情報を、仕事条件の知識ネットワークへ変える。
            </h2>
            <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              このサイトの強さは、ページ数ではありません。障害者雇用や難病就労支援の分断された知見を、人と仕事の相互作用として読み直し、相談、学習、記事、図解へ渡せる形にすることです。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={getNextNblPreviewHref(conceptPage)}
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
              >
                理論と発見を読む
                <ArrowRight size={15} />
              </Link>
              <Link
                href={getNextNblPreviewHref(casePage)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-500"
              >
                相談事例集へ進む
              </Link>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden border border-slate-300 bg-[#fbfaf5]">
            <div className="grid md:grid-cols-3">
              {publicMethodBridgeRows.map((row, index) => (
                <article
                  key={row.label}
                  className="relative border-b border-slate-300 bg-white p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  {index < publicMethodBridgeRows.length - 1 && (
                    <ArrowRight
                      size={18}
                      className="absolute -right-3 top-7 z-10 hidden rounded-full bg-white text-cyan-800 md:block"
                      aria-hidden="true"
                    />
                  )}
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                    {index + 1}. {row.label}
                  </p>
                  <h3 className="mt-3 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                    {row.title}
                  </h3>
                  <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">{row.body}</p>
                </article>
              ))}
            </div>
            <div className="border-t border-slate-300 bg-slate-950 p-5 text-white">
              <p className="text-sm font-semibold text-cyan-100">
                説明を増やしたいのではなく、認知負荷を下げる。
              </p>
              <p className="mt-2 break-all text-sm leading-7 text-white/78 [overflow-wrap:anywhere] md:break-normal">
                理論ページは、相談事例集、21視点、記事、場面、ツールキットが別々の思いつきではなく、同じ知識ネットワークの異なる出口であることを示します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicHomeRoutePanel() {
  const products = [
    {
      label: '場面から入る',
      title: 'まず、タテ割りで見えない状況をストーリーでつかむ',
      use: '相談事例集の前、研修冒頭、関係者の共通理解',
      output: '3場面ストーリー、企業・支援機関の役割分担、早めに確認したい点',
      avoid: '実在ケースの判断をしない',
      page: nextSiteCandidatePages[3],
    },
    {
      label: '仕事条件で読む相談事例集',
      title: '断片相談を、多面的な読み筋と合意前の確認候補へ変える',
      use: '相談前、支援者・企業担当者の検討、研修演習',
      output: '相談者の入口、複数の読み筋、確認したいこと、見方の転換、合意前の確認候補',
      avoid: '配慮の正解を決めない',
      page: nextSiteCandidatePages[1],
    },
    {
      label: '21視点ガイド',
      title: '仕事設計ガイドブックとして学び、必要時に引く',
      use: '入門書、研修、企業経営・雇用管理の学習',
      output: '3章のガイド、21視点の参照表、インフォグラフィック、研修骨格',
      avoid: '公式基準として扱わない',
      page: nextSiteCandidatePages[2],
    },
    {
      label: '問いをひらく記事',
      title: '社会の個別テーマを、仕事条件の問いで読む',
      use: 'SNS連載、研究メモ、行政資料、政策対話',
      output: 'テーマ別の記事、根拠の種類、読後に話す問い',
      avoid: '現行制度を断定しない',
      page: nextSiteCandidatePages[4],
    },
    {
      label: '認知補助ツールキット',
      title: '論理と直感の認知補助ツールへ展開する',
      use: 'マニュアル、ポスター、動画、研修、キャンペーン',
      output: 'ツールキット、図解、ポスター、音、動画、研修プログラム',
      avoid: '成果保証や個別相談にしない',
      page: nextSiteCandidatePages[5],
    },
    {
      label: '理論と発見',
      title: 'なぜこのサイト群が必要なのかを確認する',
      use: 'サイト全体の根拠、説明資料の土台、研修導入',
      output: '認知負荷の問題設定、ICF準拠の相互作用フレーム、専門知識ネットワーク、プロダクト群への接続',
      avoid: 'AIや理論だけで個別結論を出さない',
      page: nextSiteCandidatePages[6],
    },
  ];

  return (
    <section id="products" className="scroll-mt-24 border-b border-slate-200 bg-[#fbfaf5] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              読めるもの
            </p>
            <h2 className="mt-3 break-all text-3xl font-semibold tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
              必要な形から選ぶ。
            </h2>
          </div>
          <p className="min-w-0 max-w-2xl break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
            場面で全体像をつかみ、相談事例集で読みを深め、21視点で学び、記事集で社会の問いを読み、教材で組織の対話へ持ち込みます。
          </p>
        </div>
        <div className="mt-7 grid min-w-0 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {products.map((product) => (
            <Link
              key={product.label}
              href={getNextNblPreviewHref(product.page)}
              className="group flex min-h-[230px] min-w-0 flex-col border border-slate-300 bg-white p-5 transition hover:border-cyan-500 hover:bg-cyan-50/50"
            >
              <p className="text-sm font-semibold text-cyan-800">{product.label}</p>
              <p className="mt-3 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                {product.title}
              </p>
              <dl className="mt-4 flex-1 break-all space-y-2 text-sm leading-6 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                <div>
                  <dt className="font-semibold text-slate-950">使いどころ</dt>
                  <dd>{product.use}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">見られるもの</dt>
                  <dd>{product.output}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">注意</dt>
                  <dd>{product.avoid}</dd>
                </div>
              </dl>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                {product.label}を見る
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicHomeSpecialSeriesFeature() {
  return (
    <section id="featured-series" className="scroll-mt-24 border-b border-slate-200 bg-[#efe9dc] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid overflow-hidden border border-slate-300 bg-slate-950 text-white shadow-sm lg:grid-cols-[0.58fr_1.42fr]">
          <div className="relative min-h-[260px] bg-slate-900">
            <img
              src="/images/work-condition-forum-virtual-city-hero-v1.webp"
              alt="水辺の架空都市にある会議場へ参加者が向かうバーチャルフォーラムの風景"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/36" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/92 to-transparent p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                イベント
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal">
                仕事条件デザイン・バーチャルフォーラム
              </h2>
            </div>
          </div>
          <div className="grid gap-5 p-5 md:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
                記事集とも連動するイベント
              </p>
              <h3 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-4xl">
                「働ける人を探す」から、「働ける条件を設計する」へ。
              </h3>
              <p className="mt-4 max-w-3xl break-all text-base leading-8 text-white/76 [overflow-wrap:anywhere] md:break-normal">
                6セッション、22発表の仮想フォーラムとして、雇用率、ラベル、観察、見えない障害・難病、AI活用を仕事条件デザインの問いで読み直します。
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
                公式提携や翻訳ではなく、記事集の問いをフォーラム形式でも読めるイベント型コンテンツです。個別判断や制度・統計の断定には使いません。
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:min-w-[210px]">
              <Link
                href={workConditionForumHubHref}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                フォーラムを見る
                <ArrowRight size={15} />
              </Link>
              <Link
                href={eventHubHref}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/28 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                イベント一覧へ
              </Link>
              <Link
                href={workUpdateFestHref}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white/82 transition hover:bg-white/12"
              >
                音楽フェスを見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicSocialKnowledgeLoopPanel() {
  const articlePage =
    nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-05') ??
    nextSiteCandidatePages[4];
  const toolkitPage =
    nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-06') ??
    nextSiteCandidatePages[5];
  const casePage =
    nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-02') ??
    nextSiteCandidatePages[1];

  const communicationRoutes = [
    {
      label: 'SNS',
      title: '短い問い',
      body: 'Xで社会に問いを置く。',
      href: 'https://x.com/NBL_workdesign',
      cta: 'SNSを見る',
      external: true,
      icon: MessagesSquare,
    },
    {
      label: '記事',
      title: '深く読む',
      body: '記事と図解へ広げる。',
      href: getNextNblPreviewHref(articlePage),
      cta: '記事集へ',
      icon: BookOpen,
    },
    {
      label: 'イベント',
      title: '場で共有',
      body: 'フォーラムや音楽へ。',
      href: eventHubHref,
      cta: 'イベントへ',
      icon: Sparkles,
    },
    {
      label: 'ツール',
      title: '現場で使う',
      body: '図解、ワーク、自己チェックへ。',
      href: getNextNblPreviewHref(toolkitPage),
      cta: 'ツールキットへ',
      icon: Wrench,
    },
  ];

  return (
    <section id="social-communication" className="scroll-mt-24 border-b border-slate-200 bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
              SNSとコミュニケーション
            </p>
            <h2 className="mt-3 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              Xで短い問いを届け、サイトへ戻す。
            </h2>
            <p className="mt-5 break-all text-base leading-8 text-white/76 [overflow-wrap:anywhere] md:break-normal">
              NBL｜仕事条件デザインでは、働きづらさを人だけの問題で終わらせないための問いをXで発信しています。
            </p>
            <div className="mt-5 flex min-w-0 items-center gap-4 border border-white/16 bg-white/[0.06] p-4">
              <img
                src={nextNblPublicSocialAccount.profileIconPath}
                alt="NBL｜仕事条件デザインのXアイコン"
                className="h-14 w-14 shrink-0 rounded-full border border-cyan-100/50 bg-white object-cover"
              />
              <div className="min-w-0">
                <p className="break-all text-base font-semibold leading-snug text-white [overflow-wrap:anywhere] md:break-normal">
                  {nextNblPublicSocialAccount.displayName}
                </p>
                <p className="mt-1 text-sm text-cyan-100">{nextNblPublicSocialAccount.handle}</p>
              </div>
              <Link
                href="https://x.com/NBL_workdesign"
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex shrink-0 items-center gap-2 border border-cyan-200/50 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 hover:bg-white/10 hover:text-white"
              >
                Xで見る
                <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-3 break-all text-xs leading-6 text-white/58 [overflow-wrap:anywhere] md:break-normal">
              一部は自動投稿で運用しますが、個別相談、自動返信、DM対応、反応数による妥当性判断には使いません。
            </p>
          </div>
          <div className="min-w-0">
            <div className="grid gap-3 md:grid-cols-2">
              {communicationRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.label}
                    href={route.href}
                    target={route.external ? '_blank' : undefined}
                    rel={route.external ? 'noreferrer' : undefined}
                    className="group flex min-w-0 items-start gap-3 border border-white/14 bg-white/[0.07] p-4 transition hover:border-cyan-200/60 hover:bg-white/[0.1]"
                  >
                    <Icon size={19} className="mt-1 shrink-0 text-cyan-100" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                        {route.label}
                      </p>
                      <h3 className="mt-1 break-all text-lg font-semibold leading-snug tracking-normal [overflow-wrap:anywhere] md:break-normal">
                        {route.title}
                      </h3>
                      <p className="mt-2 break-all text-sm leading-6 text-white/68 [overflow-wrap:anywhere] md:break-normal">
                        {route.body}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 group-hover:text-white">
                        {route.cta}
                        {route.external ? <ExternalLink size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 border border-cyan-200/30 bg-cyan-50 p-5 text-slate-950">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                つながり方の例
              </p>
              <h3 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
                疲れやすい、で止めない。
              </h3>
              <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                Xの短い問いから、相談事例、記事、ツール、音楽へ移れます。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: '相談事例集', href: `${getNextNblPreviewHref(casePage)}?case=health-time#case-health-time` },
                  { label: '記事', href: getNextNblPreviewHref(articlePage) },
                  { label: 'ツール', href: getNextNblPreviewHref(toolkitPage) },
                  { label: '音楽', href: workUpdateFestHref },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-900 transition hover:border-cyan-500"
                  >
                    {item.label}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicHomeBoundaryStrip() {
  return (
    <section className="bg-slate-950 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between">
        <p className="text-lg font-semibold tracking-normal">
          ここで扱うのは、仕事の見方と教材です。
        </p>
        <p className="max-w-3xl text-sm leading-7 text-white/76">
          個別相談、医療・法務・雇用判断、配慮妥当性の結論は扱いません。制度や統計を現在情報として使う場合は、出典、日付、管轄を確認します。
        </p>
      </div>
    </section>
  );
}

function PublicCognitionPanel() {
  return (
    <section className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            見える形にする
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
            「疲れやすい」を、職場で話せる1枚に変える。
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-700">
            複雑な働きづらさは、文章だけでは同じ場面を思い浮かべにくいことがあります。そこで、ひとつの言葉を、仕事条件の地図、3コマ教材、研修ワーク、短い映像の入口へ変えます。
          </p>
        </div>
        <div className="mt-8 overflow-hidden border border-slate-300 bg-[#fbfaf5] shadow-sm">
          <div className="grid gap-0 xl:grid-cols-[0.78fr_1.22fr]">
            <div className="border-b border-slate-300 bg-white p-5 xl:border-b-0 xl:border-r">
              <p className="text-xs font-semibold tracking-[0.14em] text-rose-800">
                よくある止まり方
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
                「本人が疲れやすい」で止まると、職場で確認する条件が見えない。
              </h3>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-800">止まりやすい見方</p>
                  <p className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                    「本人が疲れやすい」
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    状態の説明だけでは、企業も支援者も次に試す条件を選びにくい。
                  </p>
                </div>
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-sm font-semibold text-cyan-800">仕事の条件として見る</p>
                  <p className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                    締切、休憩、回復時間、情報共有、評価の重なりを見る。
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    本人を責めず、仕事のどこを確認できるかへ戻す。
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="border-b border-slate-300 bg-white p-5 lg:border-b-0 lg:border-r">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  仕事条件マップ
                </p>
                <div className="mt-4 grid place-items-center">
                  <div className="relative h-64 w-64">
                    <div className="absolute inset-10 rounded-full border-2 border-slate-300 bg-[#fbfaf5]" />
                    <div className="absolute inset-[5.55rem] rounded-full bg-slate-950" />
                    <div className="absolute left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2 text-center text-xs font-semibold leading-5 text-white">
                      同じ
                      <br />
                      仕事場面
                    </div>
                    {publicConditionMapNodes.map((node, index) => {
                      const positions = [
                        'left-1/2 top-0 -translate-x-1/2',
                        'right-1 top-10',
                        'right-0 top-1/2 -translate-y-1/2',
                        'bottom-10 right-1',
                        'bottom-0 left-1/2 -translate-x-1/2',
                        'bottom-10 left-1',
                        'left-0 top-1/2 -translate-y-1/2',
                      ];
                      return (
                        <span
                          key={node}
                          className={`absolute ${positions[index]} rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm`}
                        >
                          {node}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  読み下し: この図は、本人の状態を軽く扱うものではありません。同じ人を、仕事の条件、支援、時間、評価との関係で見る入口です。
                </p>
              </div>
              <div className="grid gap-3 p-5">
                {publicSceneComicFrames.map((frame, index) => (
                  <article key={frame.label} className="border border-slate-300 bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      {index + 1}. {frame.label}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold tracking-normal text-slate-950">
                      {frame.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{frame.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="grid border-t border-slate-300 bg-white md:grid-cols-4">
            {publicCognitionCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className="border-b border-slate-300 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <Icon size={18} className="text-cyan-800" aria-hidden="true" />
                  <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-cyan-800">
                    {card.label}
                  </p>
                  <h3 className="mt-2 text-base font-semibold leading-snug tracking-normal text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-700">{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicFirstProductsPanel() {
  return (
    <section className="border-b border-slate-200 bg-[#fbfaf5] py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              5つの使い方
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              必要な形から選ぶ。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              場面、相談事例集、21視点、記事集、教材化。関係者が同じ問題を別々の言葉で抱え込まないための形を選びます。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {publicFirstProductCards.map((card) => {
              const page = nextSiteCandidatePages.find((candidate) => candidate.id === card.targetId)!;
              return (
                <Link
                  key={card.label}
                  href={getNextNblPreviewHref(page)}
                  className="group border border-slate-300 bg-white p-4 transition hover:border-cyan-500"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">{card.label}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug tracking-normal text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{card.body}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                    開く
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicConversionPanel() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            情報が道具になる流れ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
            配慮を探す前に、仕事のどこで詰まっているかを見る。
          </h2>
        </div>
        <div className="mt-8 grid gap-0 border border-slate-300 md:grid-cols-4">
          {publicConversionFlow.map((step, index) => (
            <article key={step.label} className="border-b border-slate-300 bg-[#fbfaf5] p-5 md:border-b-0 md:border-r last:md:border-r-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">{step.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-300">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold leading-snug tracking-normal text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicShiftPanel() {
  return (
    <section className="bg-[#efe9dc] py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.12em] text-rose-800">
              見方の転換
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-normal text-slate-950">
              見方が変わると、動かせる条件が見えてくる。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              障害や病気を軽く扱うのではありません。むしろ、体調、活動、参加、仕事、環境、支援、制度がどう絡むかを、より精密に見るための転換です。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {publicShiftCards.map((card) => (
              <article key={card.after} className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
                <p className="text-sm leading-6 text-slate-500 line-through decoration-rose-500/60">
                  {card.before}
                </p>
                <div className="my-4 h-px bg-gradient-to-r from-cyan-500 via-slate-300 to-rose-400" />
                <h3 className="text-xl font-semibold tracking-normal text-slate-950">{card.after}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicOutputPanel() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            このサイトで読めるもの
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
            必要な形から選ぶ。
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {publicOutputCards.map((card) => {
            const page = nextSiteCandidatePages.find((candidate) => candidate.id === card.targetId)!;
            return (
              <Link
                key={card.label}
                href={getNextNblPreviewHref(page)}
                className="group rounded-lg border border-slate-200 bg-[#fbfaf5] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-md"
              >
                <h3 className="text-2xl font-semibold tracking-normal text-slate-950">{card.label}</h3>
                <p className="mt-4 min-h-[112px] text-sm leading-7 text-slate-700">{card.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
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

function PublicBoundaryPanel() {
  return (
    <section className="border-t border-slate-200 bg-slate-950 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
            範囲
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal">仕事の見方を共有する</h2>
        </div>
        <div className="grid gap-4 text-sm leading-7 text-white/78 md:grid-cols-2">
          <div className="border border-white/15 p-4">
            <p className="font-semibold text-white">扱うこと</p>
            <p className="mt-2">仕事条件を見直す問い、場面、教材、図解の形に整理します。</p>
          </div>
          <div className="border border-white/15 p-4">
            <p className="font-semibold text-white">扱わないこと</p>
            <p className="mt-2">個別相談、医療・法務・雇用判断、配慮妥当性の結論は扱いません。</p>
          </div>
          <div className="border border-white/15 p-4">
            <p className="font-semibold text-white">診断名・障害種類の扱い</p>
            <p className="mt-2">診断名や障害の種類は大切な入口情報です。ただし、配慮を自動で引く表にはしません。</p>
          </div>
          <div className="border border-white/15 p-4">
            <p className="font-semibold text-white">制度・統計の扱い</p>
            <p className="mt-2">出典、日付、管轄、更新状況を確認し、現場で問える形に整えます。</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicToolsFutureDesignMap() {
  const domains = [
    {
      label: '企業経営',
      body: '人材戦略、事業継続、学習、評価の設計へ広げる。',
    },
    {
      label: '雇用管理',
      body: '採用、配置、OJT、評価、復職、異動の運用へ落とす。',
    },
    {
      label: '専門支援',
      body: '本人、職場、医療・生活、制度の言葉をつなぐ。',
    },
    {
      label: '制度設計',
      body: '地域資源、研修、政策評価を現場で使える形へ戻す。',
    },
  ];
  const planes = [
    {
      title: '健康時間と生活の自由度',
      body: '働く、休む、治療する、戻る、待つ余地を仕事設計へ入れる。',
      href: '#chapter-health-time',
      tone: 'border-cyan-200 bg-cyan-50 text-cyan-950',
      marker: 'bg-cyan-700 text-white',
    },
    {
      title: '入口・翻訳・支援の力',
      body: '求人、開示、支援、情報、相談線を、仕事で使える言葉へ変える。',
      href: '#chapter-entry-translation',
      tone: 'border-amber-200 bg-amber-50 text-amber-950',
      marker: 'bg-amber-600 text-white',
    },
    {
      title: '職場・参加・価値',
      body: '作業、環境、評価、学び、役割を、参加の質と組織価値へつなぐ。',
      href: '#chapter-worksite-value',
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-950',
      marker: 'bg-emerald-700 text-white',
    },
  ];

  return (
    <section id="future-design-map" className="scroll-mt-24 border-b border-slate-200 bg-[#f6f3ea] py-10">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="border border-slate-300 bg-white p-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              未来設計マップ
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              未来の仕事を、21の問いで設計する。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              障害者雇用や難病就労支援で見えてきた知見を、個別配慮の表ではなく、人間の多様性を前提にした仕事条件の設計地図へ展開します。
            </p>
            <p className="mt-5 border-l-2 border-cyan-700 pl-4 text-sm leading-7 text-slate-700">
              21視点は、経営、雇用管理、専門支援、制度設計をばらばらに扱わず、同じ仕事条件の地図へ戻すための問いです。
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2" aria-label="21視点を展開する実装領域">
              {domains.map((domain) => (
                <article
                  key={domain.label}
                  className="border border-slate-300 bg-[#fbfaf5] px-3 py-1.5 text-sm font-semibold text-slate-800"
                >
                  <p>{domain.label}</p>
                  <p className="mt-1 text-xs font-normal leading-5 text-slate-600">{domain.body}</p>
                </article>
              ))}
            </div>
            <Link
              href="#work-design-board"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
            >
              21視点の全体像を見る
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="overflow-hidden border border-slate-300 bg-white">
            <div className="border-b border-slate-300 bg-slate-950 p-5 text-white">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                全体像
              </p>
              <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
                3つの設計面が、7つの問いずつに開く。
              </h3>
            </div>
            <div className="p-5">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
                <article className="border border-slate-300 bg-[#fbfaf5] p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                    設計対象
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-7 text-slate-950">
                    人間の多様性を前提に、仕事条件そのものを設計する。
                  </p>
                </article>
                <div className="hidden items-center justify-center text-cyan-800 md:flex" aria-hidden="true">
                  <ArrowRight size={22} />
                </div>
                <article className="border border-slate-950 bg-slate-950 p-4 text-white">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                    21視点
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-7">
                    3面 x 7問いで、取り組みを具体化する。
                  </p>
                </article>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {planes.map((plane, index) => (
                  <a
                    key={plane.title}
                    href={plane.href}
                    className={`group flex min-h-[13rem] flex-col justify-between border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${plane.tone}`}
                  >
                    <span>
                      <span className={`inline-grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${plane.marker}`}>
                        {index + 1}
                      </span>
                      <span className="mt-3 block text-sm font-semibold leading-6 opacity-80">
                        7つの問い
                      </span>
                      <span className="mt-2 block text-xl font-semibold leading-snug tracking-normal">
                        {plane.title}
                      </span>
                    </span>
                    <span className="mt-4 block text-sm leading-7">
                      {plane.body}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-4 border border-slate-300 bg-[#fbfaf5] p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                  読み方
                </p>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
                  3つの面は別々の章ではなく、未来の仕事設計を同時に見るためのレンズです。21視点は、そのレンズを実装の問いへ落とす道具です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicDetailIntro({ page }: { page: NextSiteCandidatePage }) {
  if (page.id === 'NS-08') return null;
  if (page.id === 'NS-09') return null;
  if (page.id === 'NS-02' || page.id === 'NS-05' || page.id === 'NS-06') return null;
  if (page.id === 'NS-03') return <PublicToolsFutureDesignMap />;

  const copy = getPublicCopy(page);
  const flow = publicDetailFlowPanels[page.id];
  const nextPage = flow
    ? nextSiteCandidatePages.find((candidate) => candidate.id === flow.nextTargetId)
    : undefined;

  if (flow) {
    return (
      <section id="page-flow" className="scroll-mt-24 border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 lg:grid-cols-[0.66fr_1.34fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                {flow.kicker}
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
                {flow.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700">{flow.body}</p>
              {nextPage && (
                <Link
                  href={getNextNblPreviewHref(nextPage)}
                  className="mt-7 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
                >
                  {flow.nextLabel}
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
            <div className="overflow-hidden border border-slate-300 bg-[#fbfaf5]">
              <div className="grid md:grid-cols-3">
                {flow.steps.map((step, index) => (
                  <article
                    key={step.label}
                    className="relative border-b border-slate-300 bg-white p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                  >
                    {index < flow.steps.length - 1 && (
                      <ArrowRight
                        size={18}
                        className="absolute -right-3 top-7 z-10 hidden rounded-full bg-white text-cyan-800 md:block"
                        aria-hidden="true"
                      />
                    )}
                    <p className="text-sm font-semibold text-cyan-800">
                      {index + 1}. {step.label}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{step.body}</p>
                  </article>
                ))}
              </div>
              <div className="grid border-t border-slate-300 bg-slate-950 text-white md:grid-cols-3">
                <div className="border-b border-white/15 p-4 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">現場で起きやすいこと</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">{copy.problem}</p>
                </div>
                <div className="border-b border-white/15 p-4 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">このページで見ること</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">{copy.promise}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold tracking-[0.12em] text-rose-100">ここでは扱わないこと</p>
                  <p className="mt-2 text-sm leading-7 text-white/78">{copy.notThis}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid border border-slate-300 bg-[#fbfaf5] lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <article className="border-b border-slate-300 p-5 lg:border-b-0 lg:border-r">
            <p className="text-sm font-semibold text-cyan-800">現場で起きやすいこと</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{copy.problem}</p>
          </article>
          <article className="border-b border-slate-300 p-5 lg:border-b-0 lg:border-r">
            <p className="text-sm font-semibold text-cyan-800">このページで見ること</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{copy.promise}</p>
          </article>
          <article className="p-5">
            <p className="text-sm font-semibold text-rose-800">ここでは扱わないこと</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{copy.notThis}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function PublicAssessmentProcessPanel() {
  const steps = [
    {
      label: '入口',
      title: '相談の一言',
      body: 'まず本人、企業、支援者の短い言葉を、そのまま受け取る。',
    },
    {
      label: '保留',
      title: '止まりやすい読みを外す',
      body: '病名、配慮名、本人の努力、職場の善意だけで結論にしない。',
    },
    {
      label: '構造',
      title: '7接点へ分ける',
      body: '時間、作業、情報、環境、支援、評価、共有のどこが絡むかを見る。',
    },
    {
      label: '仮説',
      title: '複数の読み筋を立てる',
      body: '一つの説明で閉じず、別読みと足りない情報を並べる。',
    },
    {
      label: '確認',
      title: '合意前の確認候補にする',
      body: '判断ではなく、関係者が次に確かめる問いへ戻す。',
    },
  ];
  const channels = [
    {
      label: '場面で気づく',
      title: '近い相談として入る',
      body: '「これに似ている」という場面感から入り、本人だけの問題ではなかったと気づく。',
    },
    {
      label: '手順で確かめる',
      title: '見立ての手順を追う',
      body: '入口語、止まりやすい問い、7接点、複数仮説、追加確認、次の一手を順に読む。',
    },
  ];

  return (
    <div className="overflow-hidden border border-slate-300 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-slate-300 bg-slate-950 p-6 text-white lg:border-b-0 lg:border-r">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
            見立てプロセス
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
            相談の一言を、判断ではなく確認地図へ変える。
          </h2>
          <p className="mt-5 text-base leading-8 text-white/78">
            相談事例集は、よくある答えの一覧ではありません。断片的な相談から、どこで読みが止まりやすいか、何をまだ確認していないか、次に誰と何を話すかを組み立てるページです。
          </p>
          <div className="mt-7 grid gap-3">
            {channels.map((channel) => (
              <article key={channel.label} className="border border-white/15 bg-white/8 p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                  {channel.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug tracking-normal text-white">
                  {channel.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/72">{channel.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-[#fbfaf5] p-5">
          <div className="grid gap-3 xl:grid-cols-[0.95fr_1.05fr]">
            <article className="border border-slate-300 bg-white p-5">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                相談の一言
              </p>
              <p className="mt-3 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                月末前後に疲れが残り、翌日の修正がつらい。
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="border border-rose-200 bg-rose-50 p-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-rose-800">
                    止まりやすい読み
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-950">
                    体調の問題か、休ませるか、短時間勤務か。
                  </p>
                </div>
                <div className="border border-cyan-200 bg-cyan-50 p-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                    見立てとして開く
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-950">
                    通院、締切、修正、回復時間、評価不安は同じ週に重なっているか。
                  </p>
                </div>
              </div>
            </article>

            <div className="grid gap-2">
              {steps.map((step, index) => (
                <article
                  key={step.label}
                  className="grid grid-cols-[3.25rem_1fr] gap-3 border border-slate-300 bg-white p-3"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      {step.label}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold leading-snug tracking-normal text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-slate-700">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <p className="mt-5 border-l-4 border-cyan-700 bg-cyan-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-950">
            結論ではなく、話し合い前に確認する地図です。
          </p>
        </div>
      </div>
    </div>
  );
}

function PublicMapContent() {
  return (
    <section id="page-flow" className="scroll-mt-24 bg-[#efe9dc] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <PublicAssessmentProcessPanel />
        <ModelConsultationLibrary />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="border border-cyan-200 bg-cyan-50 p-5">
            <p className="text-sm font-semibold text-cyan-800">このページで使うもの</p>
            <h3 className="mt-2 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
              典型相談事例
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              近い構造を選び、相談者の入口から読み筋、追加確認、情報が増えると見えること、合意前の確認候補まで読みます。
            </p>
          </div>
          <div className="border border-slate-300 bg-white p-5">
            <p className="text-sm font-semibold text-slate-950">なぜこの読み方が可能か</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              断片相談を複数の読み筋へ開けるのは、分断された情報を仕事条件の知識ネットワークとして読み直しているからです。
            </p>
            <Link
              href={`${previewBase}/work-assessment-concept`}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
            >
              理論を読む
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="border border-slate-300 bg-white p-5">
            <p className="text-sm font-semibold text-slate-950">近い相談がないとき</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              近い相談がない場合、このページだけでは結論を出しません。必要な専門確認へ切り分けてください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicAssessmentConceptContent() {
  return (
    <section id="page-flow" className="scroll-mt-24 bg-[#efe9dc] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="overflow-hidden border border-slate-300 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="border-b border-slate-300 bg-slate-950 p-6 text-white lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
                古くて新しい課題
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                問題の本質は、過重な認知負荷にある。
              </h2>
              <p className="mt-5 text-base leading-8 text-white/78">
                働きづらさは、本人の状態だけでも、職場の善意だけでも、制度説明だけでも読めません。人、仕事、環境、支援、時間、制度が同時に動くため、関係者の頭の中だけで扱うには複雑すぎる。
              </p>
              <div className="mt-7 border border-cyan-200/40 bg-cyan-100/10 p-5">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                  隠されてきた真実
                </p>
                <p className="mt-3 text-2xl font-semibold leading-snug tracking-normal">
                  支援が足りないだけではない。関係を読める地図が足りなかった。
                </p>
              </div>
            </div>
            <div className="grid gap-0 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {assessmentTheoryProblemCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="border-b border-slate-300 bg-[#fbfaf5] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0 xl:border-b-0 xl:border-r"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      {card.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-300 bg-white p-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              専門知識ネットワーク
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              検索・要約ではなく、偏りをほどき、相互作用を読む知識ネットワークをつくる。
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
              障害者雇用、難病就労支援、両立支援、職場実践、制度情報には、有用な知見と同時に、先入観や偏見を含む語りも混ざりうる。だから情報を集めて要約するだけではなく、ICF準拠の相互作用フレームとAIの文脈読解で、関係の身元、偏りのリスク、使える問いを分けて再構成します。
            </p>
            <figure className="mt-6 overflow-hidden border border-slate-300 bg-[#fbfaf5]">
              <img
                src={publicKnowledgeNetworkTheoryMobileImage}
                alt="断片情報と偏りを、ICF相互作用とAI文脈読解で専門知識ネットワークへ変換し、相談事例、21視点、記事、場面、認知補助ツールへ展開する図解"
                className="mx-auto block bg-white sm:hidden"
                style={{ height: 'auto', maxWidth: 'calc(100vw - 2.5rem)', width: '340px' }}
              />
              <img
                src={publicKnowledgeNetworkTheoryImage}
                alt="断片情報と偏りを、ICF相互作用とAI文脈読解で専門知識ネットワークへ変換し、相談事例、21視点、記事、場面、認知補助ツールへ展開する図解"
                className="hidden w-full min-w-0 max-w-full bg-white sm:block"
              />
              <figcaption className="border-t border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700">
                左の断片情報をそのまま答えにせず、中央で相互作用の関係として読み直し、右側で人間が使える相談、学習、記事、場面、認知補助の入口へ翻訳します。
              </figcaption>
            </figure>
          </div>
          <div className="grid gap-4 bg-[#fbfaf5] p-5 md:grid-cols-2">
            {assessmentTheoryNetworkStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <article key={stage.label} className="border border-slate-300 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      {stage.label}
                    </p>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-snug tracking-normal text-slate-950 md:text-2xl">
                    {stage.title}
                  </h3>
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-sm leading-7 text-slate-700">{stage.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border border-slate-300 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            解決策としてのプロダクト群
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
            思いつきのページ群ではない。専門知識ネットワークの出口を、用途ごとに分けている。
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
            同じ知識ネットワークでも、相談前に読む、未来の取り組みに使う、社会の話題を読み直す、会議や研修で共有する、直感的に場面をつかむ、では必要な入口が違います。高度な関係ネットワークを、人間の言語・非言語の認知を補助するインターフェイスへ翻訳するために、ページと道具を分けています。
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {assessmentTheoryProductInterfaces.map((product) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.label}
                  href={publicPageHrefById(product.pageId)}
                  className="group flex min-h-[250px] flex-col border border-slate-300 bg-[#fbfaf5] p-5 transition hover:border-cyan-500 hover:bg-cyan-50/60"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-slate-950 text-white">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-cyan-800">
                    {product.label}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                    {product.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">{product.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                    開く
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="border border-slate-300 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
              AIの使い方
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal md:text-4xl">
              物知り回答機ではなく、関係を読む認知補助として使う。
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              このサイトで使いたいAIの力は、もっともらしい答えを急ぐことではありません。断片情報を世界そのものではなく一部の投影として受け取り、背後にある関係候補を広げ、人間が確認できる地図へ戻すことです。
            </p>
            <div className="mt-6 grid gap-3">
              {[
                '公開情報、相談の一文、SNSの反応を、そのまま世界の答えとして扱わない。',
                'AIの文脈読解で、暗黙の前提、反対仮説、欠けた確認点を関係候補として広げる。',
                '人間が確認できる地図、相談事例、記事、場面、ワーク、教材へ戻す。',
              ].map((item, index) => (
                <div key={item} className="grid grid-cols-[2.5rem_1fr] gap-3 border border-white/15 bg-white/8 p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-200 text-sm font-semibold text-slate-950">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-7 text-white/86">{item}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="border border-slate-300 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              境界
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              高度な読みを扱うほど、判断境界は明確にする。
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {assessmentTheoryBoundaryCards.map((card) => (
                <article key={card.title} className="border border-slate-300 bg-[#fbfaf5] p-4">
                  <h3 className="text-lg font-semibold leading-snug tracking-normal text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{card.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-900">
            このページを読んだ後に見るもの
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
            理論を、実際に読めるプロダクトで確かめる。
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={publicPageHrefById('NS-02')}
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
            >
              相談事例集へ
              <ArrowRight size={15} />
            </Link>
            <Link
              href={publicPageHrefById('NS-03')}
              className="inline-flex items-center gap-2 rounded-md border border-cyan-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-600"
            >
              未来設計21視点へ
            </Link>
            <Link
              href={publicPageHrefById('NS-06')}
              className="inline-flex items-center gap-2 rounded-md border border-cyan-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-600"
            >
              認知補助ツールへ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const workDesignGuideChapters = [
  {
    id: 'chapter-health-time',
    title: '健康時間と生活の自由度',
    lead:
      '体調や治療を「本人の事情」として職場の外へ追い出すと、仕事は安定しません。働く時間、休む時間、回復する時間、生活を支える条件を、仕事設計の中に入れて考えます。',
    use:
      '勤務時間、治療・回復、生活保障、評価を、継続可能な仕事条件として設計する面です。',
    structuralRole:
      '健康時間を就労能力の判定材料に戻さず、働く時間、治療、回復、生活保障、評価が互いにどう自由度を開閉するかを見る面です。',
    anchor:
      '健康・機能のリズム + 治療/回復 + 生活保障 + 仕事時間/負荷/場所 + 評価/収入/戻り回路',
    observes: '体調変動、治療、戻り方、移動と休息、生活保障、評価衝突、将来変化',
    items: [
      {
        title: '負荷をならす',
        scene: '通常業務では安定しているが、月末の締切が重なると翌日まで疲労が残る。',
        core:
          '体調変動は、本人の不安定さだけを意味しません。仕事の量、密度、順序、休憩、通勤、翌日の回復時間と重なることで、続ける余地が狭まったり広がったりします。',
        read:
          '働けるかどうかではなく、負荷が急に高くなる場所を地図にします。山場の順序、休憩、翌日への影響、相談のタイミングを見ます。',
        practice:
          '負荷が高くなる作業・時間帯・場所を並べ、休憩や作業順序の変更で翌日への影響が変わるかを確認する。',
        avoid: '短時間勤務を入れれば解決、または本人が安定すべき、という読みで閉じない。',
      },
      {
        title: '治療と仕事時間を合わせる',
        scene: '通院日は認められているが、重要な朝会に出られず情報が抜ける。',
        core:
          '治療時間は仕事の外側にある私用ではなく、働き続ける条件の一部です。通院や回復を仕事設計に入れないと、健康を守る時間と評価される時間がぶつかります。',
        read:
          '通院可否だけでなく、治療後の回復、引継ぎ、会議情報、評価、収入への影響までを一つの流れとして見ます。',
        practice:
          '治療や通院の周期、業務の山場、回復時間、情報共有、評価への影響を同じ月次予定に置く。',
        avoid: '通院を許可したかどうかだけで十分と考えない。',
      },
      {
        title: '休む・戻る道筋を作る',
        scene: '体調悪化で一度休んだ人が、復職時に元の業務量へすぐ戻される。',
        core:
          '休むことは就労継続の失敗ではありません。戻り方が設計されていない時に、休職や悪化は、辞めるか我慢するかの二択になりやすくなります。',
        read:
          '復職を元に戻ることだけにせず、仕事量、役割、評価、相談線、再調整の時点を決める回路として見ます。',
        practice:
          '休む前、休んでいる間、戻る時の相談線と、段階的に戻る仕事量・役割・評価を決める。',
        avoid: '休職を本人の離脱、復職を元の状態への復元としてだけ扱わない。',
      },
      {
        title: '移動と休憩場所まで含める',
        scene: '仕事そのものは調整されているが、通勤や職場内移動で働く前に疲れ切る。',
        core:
          '移動と休息は背景ではなく、仕事参加の条件です。通勤、職場内移動、姿勢、休息場所、温度、音、照明が、勤務前後の健康時間を変えます。',
        read:
          '業務内容だけでなく、通勤、座席、動線、休息場所、環境刺激を同じ図に置き、仕事が始まる前に閉じている余地を見ます。',
        practice:
          '通勤、職場内移動、休憩場所、作業場所の環境条件を、疲労や痛み、集中への影響として確認する。',
        avoid: '設備があることと、本人が安心して使えることを同じにしない。',
      },
      {
        title: '待てる余地をつくる',
        scene: '体調に合う条件を探したいが、収入不安や医療費があり急いで仕事を決めざるを得ない。',
        core:
          '生活保障は就労支援の背景ではありません。待つ、休む、試す、選び直す余地を直接左右する設計変数です。',
        read:
          '意欲や準備性だけで読まず、収入、医療費、制度カテゴリ、家族資源、地域資源が選択肢をどう狭めるかを見ます。',
        practice:
          '収入不安、使える制度、支援窓口、試せる勤務量を並べ、無理を前提にしない選択肢を作る。',
        avoid: '本人の選択を本人の意思だけで説明しない。',
      },
      {
        title: '評価・収入との衝突を見る',
        scene: '短時間勤務や通院調整はあるが、役割や評価が固定され、収入や将来見通しが狭くなる。',
        core:
          '配慮があっても、その働き方が低い評価、低い収入、固定的な役割につながるなら、参加の質は高まりません。',
        read:
          '配慮の有無ではなく、調整された働き方がどの基準で評価され、処遇や役割にどう接続しているかを見ます。',
        practice:
          '調整後の成果、役割、賃金、生活できる収入、将来見通しを分けて確認する。',
        avoid: '配慮があるからよい状態だと見ない。',
      },
      {
        title: '変化を話し直せる',
        scene: '治療変更、異動、繁忙期、生活変化があっても、一度決めた条件が見直されない。',
        core:
          '体調や生活は変化します。一度決めた配慮や役割を固定すると、変化した時に本人が説明し直す負担だけが増えます。',
        read:
          '初回合意を完成形にせず、変化、悪化予兆、将来不安、再発、生活変化を話し直すタイミングと相手を決めます。',
        practice:
          '初月、3か月後、治療変更後、繁忙期前など、共有範囲を守った見直し日を予定に入れる。',
        avoid: '将来不安を本人の心配性として片づけない。',
      },
    ],
  },
  {
    id: 'chapter-entry-translation',
    title: '入口・翻訳・支援の力',
    lead:
      '本人の状態と職場の条件は、そのままでは同じ言葉になりません。求人、面接、開示、支援計画、医療・生活情報を、仕事で確認できる言葉へ翻訳する力が必要です。',
    use:
      '求人、開示、支援連携、情報共有、相談経路を、実務で使える翻訳回路として設計する面です。',
    structuralRole:
      '本人の言葉、求人の言葉、職場の実務語、制度の言葉を、そのままぶつけず、仕事で確認できる条件へ翻訳し直す面です。',
    anchor:
      '本人条件 + 求人/職務条件 + 医療/生活情報 + 支援役割 + 開示境界 + 仕事手順 + source lens差',
    observes: '求人、体験、開示、支援再翻訳、相談線、情報手順、見え方のズレ',
    items: [
      {
        title: '求人と本人条件をすり合わせる',
        scene: '求人票の「臨機応変な対応」が、実際には何を求めるのか分からず応募前に選択肢が狭まる。',
        core:
          '求人票の言葉と本人の生活・機能の言葉がつながらないと、応募前から選択肢が狭まります。求人要件は、具体的な作業条件へ分けて読む必要があります。',
        read:
          '抽象語をそのまま能力要件にせず、作業、時間、対人、判断、環境、評価へ分解し、本人条件と職務条件を同じ地図に置きます。',
        practice:
          '求人の抽象語を具体作業へ分け、本人の希望や制約を職務条件に置き換えて、試せる余地を確認する。',
        avoid: '本人を求人条件に合わせるだけにしない。',
      },
      {
        title: '見学・実習で仕事像を確かめる',
        scene: '実習ではできたが、採用後に作業手順、相談線、評価、休憩が引き継がれない。',
        core:
          '見学や実習は適性判定だけの場ではありません。仕事像、生活リズム、作業接点、ストレス、相談線を確認し、採用後の設計へ渡す場です。',
        read:
          '体験で見えた情報を採用可否だけで消費せず、採用後の作業手順、相談線、評価、休憩、情報形式へ接続します。',
        practice:
          '体験で確認した作業、環境、評価、相談線を、採用後の引き継ぎ項目として残す。',
        avoid: '実習を適性判定だけにしない。',
      },
      {
        title: '伝える範囲を目的で決める',
        scene: 'どこまで伝えるべきか分からず、伝えすぎるか、何も伝えられない。',
        core:
          '開示は、病気や障害の名前を伝えるかどうかだけではありません。仕事で使う情報と守る情報を、目的と同意範囲で分けることが中核です。',
        read:
          '開示を善悪や勇気の問題にせず、業務影響、調整目的、共有先、更新時点を整理します。',
        practice:
          '伝えること、伝えないこと、必要になったら相談すること、共有先、更新時点を目的別に整理する。',
        avoid: '診断名共有を配慮取得の必須条件のように扱わない。',
      },
      {
        title: '人・仕事・制度をつなぎ直す',
        scene: '本人の言葉、医療・生活情報、職場の不安、制度の言葉が別々で、誰も仕事条件へつなげられない。',
        core:
          '支援の価値は、支援機関が存在することではありません。本人の言葉、職場の不安、制度情報、評価基準を、仕事で使える形につなぎ直すことにあります。',
        read:
          '支援量ではなく、支援が何をつないでいるかを見ます。本人条件を職務条件へ、職場不安を作業・安全・人員余力へ置き換えます。',
        practice:
          '支援者が職場へ伝える内容を、体調説明だけでなく、作業・時間・環境・評価の確認事項に直す。',
        avoid: '支援機関につながっていることを、支援が機能していることと同じにしない。',
      },
      {
        title: '戻れる相談ルートを残す',
        scene: '就職後、変化時、評価時、休職時、復職時に、どこへ戻ればよいか分からない。',
        core:
          '相談は就職前だけで終わりません。仕事が始まってから、変化、評価、休職、復職のたびに、条件をつなぎ直す場所が必要です。',
        read:
          '相談窓口の有無ではなく、相談後に仕事手順や評価へ反映される回路を見ます。',
        practice:
          '採用後に困った時の相談先、共有範囲、返答期限、職場手順への反映方法を決める。',
        avoid: '就職決定を支援終了とみなさない。',
      },
      {
        title: '情報を分かる手順に変える',
        scene: '説明はされたが、口頭指示、会議情報、変更連絡、非公式情報が仕事手順として残らない。',
        core:
          '情報形式が合わないと、能力があっても参加できません。情報を分かる形にするだけでなく、実際の仕事手順として使えるように同期する必要があります。',
        read:
          '理解不足を本人の問題にせず、口頭、文書、会議、チャット、非公式情報、安全確認がどこでこぼれるかを見ます。',
        practice:
          '指示や会議情報、変更連絡、安全確認を、文書、図、音声、実演、チェックリストで同期する。',
        avoid: '手順書があることと、仕事で使えることを同じにしない。',
      },
      {
        title: '見え方のズレを見つける',
        scene: '本人、職場、人事、支援者、資料が、同じ出来事を違う意味で見ている。',
        core:
          '視点差はノイズではありません。同じ出来事の見え方がずれる時、どこで言葉や情報がつながっていないかが見えます。',
        read:
          '一つの視点を正解にせず、本人、上司、人事、支援者、調査・資料が何を見て何を見ていないかを分けます。',
        practice:
          '本人の困りごと、職場の不安、支援者の説明、資料の視点を同じ表に置き、ズレの場所を確認する。',
        avoid: '三者差や資料差を単なる不一致として捨てない。',
      },
    ],
  },
  {
    id: 'chapter-worksite-value',
    title: '職場・参加・価値',
    lead:
      '働けているかどうかだけでは、参加の質は分かりません。作業、道具、環境、役割、技能形成、評価、成長のつながりを見て、仕事が本人と組織の価値に変わる条件を整えます。',
    use:
      '作業、環境、評価、学び、役割を、参加の質と組織価値へつなぐ面です。',
    structuralRole:
      '翻訳された条件が、実際の作業、環境、情報、評価、役割、学びとして実装され、参加の質へ変わる面です。',
    anchor:
      '仕事接触点 + 安全/顧客/人員余力 + 情報アクセス + 手順/切替 + 評価/処遇 + 学び + 実装資源',
    observes: '作業接触点、安全と人員余力、情報アクセス、指示と切替、成果評価、学び、地域資源',
    items: [
      {
        title: '作業・道具・座席を合わせる',
        scene: '「この仕事が難しい」と言われるが、作業、道具、座席、動線、姿勢のどこで詰まるのか分からない。',
        core:
          '配慮名を探す前に、仕事の接点を具体的に見ます。作業、道具、姿勢、動線、機器が少し変わるだけで、疲労や遂行のしやすさが変わることがあります。',
        read:
          '本人の能力評価へ進む前に、作業のどの部分が身体、感覚、認知、疲労と接しているかを分けます。',
        practice:
          '作業を入力、判断、作業、確認、報告に分け、道具、座席、配置、姿勢、機器の変更で何が変わるかを試す。',
        avoid: '作業分析なしに、本人側の能力評価へ進まない。',
      },
      {
        title: '安全・顧客・人員余力を見込む',
        scene: 'ミスや事故、顧客対応、欠勤代替が心配で、任せる仕事が極端に狭くなる。',
        core:
          '職場側の不安は、偏見だけとは限りません。安全、顧客、人員余力、代替体制が未分解のままだと、職場も本人も動きにくくなります。',
        read:
          '職場不安を、善意か差別かの二分法で見ず、何が実際の制約で、どこなら設計できるかを分けます。',
        practice:
          '安全、顧客対応、人員余力、代替体制、現場責任を作業ごとに分け、確認方法と止める基準を置く。',
        avoid: '職場不安をすべて理解不足として片づけない。安全を理由に過剰排除もしない。',
      },
      {
        title: '情報アクセスを整える',
        scene: '会議、文書、音声、ICT、非公式連絡にアクセスできず、判断や関係形成、評価に参加しにくい。',
        core:
          '仕事能力があっても、重要情報にアクセスできなければ参加しにくくなります。情報保障は会議参加だけでなく、公式情報と非公式情報、感覚刺激や情報量まで含みます。',
        read:
          '重要情報が誰にどの形式で届き、誰が会議や非公式情報からこぼれているかを見ます。',
        practice:
          '公式情報、非公式情報、文書、音声、会議、チャット、感覚刺激、情報量を分けてアクセス条件を整える。',
        avoid: 'ICT導入を、それだけで解決策とみなさない。',
      },
      {
        title: '指示・切替・記憶負荷を整える',
        scene: 'ミスや遅れが増えるが、指示の曖昧さ、切替の多さ、記憶負荷、確認回路が見られていない。',
        core:
          'ミスや遅れは本人特性だけでなく、指示の曖昧さ、切替の多さ、記憶負荷、確認回路の不足から生まれることがあります。',
        read:
          '手順を細かくすればよいと単純化せず、開始、切替、完了、確認、失敗から戻る道を設計します。',
        practice:
          '作業の開始、優先順位、完了条件、切替、同時並行、確認先、戻る手順を明確にする。',
        avoid: 'ミスや遅れを本人特性だけで説明しない。',
      },
      {
        title: '成果の見方を合わせる',
        scene: '働けてはいるが、配慮下の成果、役割、賃金、評価、昇進の見方が曖昧になる。',
        core:
          '働けていることと、仕事として評価されていることは同じではありません。役割、成果、評価、賃金、昇進、面談は参加の質の中核です。',
        read:
          '雇用継続だけを成功にせず、調整された条件下の成果をどう見るか、評価と処遇がどうつながるかを話し合います。',
        practice:
          '評価項目を、量、質、期限、共有、成長に分け、短時間や調整下でも見える成果を定義する。',
        avoid: '評価や処遇を就労支援の外に置かない。',
      },
      {
        title: '学び・役割・キャリアにつなげる',
        scene: '安定就労はしているが、学び、役割の広がり、将来希望が支援や評価と接続していない。',
        core:
          '仕事は、今の作業をこなすだけではありません。学び、役割の広がり、将来希望が接続して初めて、参加は厚みを持ちます。',
        read:
          '安定就労を同じ役割に固定することと混同せず、体調や支援を前提にしながら、学びと役割の広がりを設計します。',
        practice:
          '新しい仕事を学ぶ機会、役割拡張、本人の将来希望、職場の育成・評価を面談で接続する。',
        avoid: 'キャリアを障害者雇用や支援の後回しにしない。',
      },
      {
        title: '職場規模・地域資源に合わせる',
        scene: 'よい支援モデルに見えても、小規模職場、地域資源、業種、外部支援の条件が合わず機能しない。',
        core:
          '同じ支援や仕事設計でも、小規模職場、大企業、地域資源、業種によって実装可能性は変わります。一般論としてよい支援でも、現場条件に合わなければ機能しません。',
        read:
          '職場や地域の資源差を努力不足として見ず、同じ構造をその職場の条件でどう実装できるかを見ます。',
        practice:
          '職場規模、地域資源、外部支援、医療、福祉、産業保健、行政の接続可能性を確認する。',
        avoid: '大企業前提の支援モデルを小規模職場へそのまま当てない。',
      },
    ],
  },
];

const workDesignStudyExamples = [
  {
    title: '疲れやすいので配慮が必要です',
    stuck: '本人の体調問題、または短時間勤務の話だけで止まりやすい。',
    lenses: ['負荷', '治療', '移動', '評価', '相談'],
    aha:
      '締切、通院後の回復、通勤、休憩場所、評価不安、戻れる相談線を同じ地図に置くと、本人の弱さではなく仕事条件の重なりが見える。',
  },
  {
    title: 'コミュニケーションが苦手です',
    stuck: '本人の対人能力、または職場の理解不足だけで止まりやすい。',
    lenses: ['開示', '手順', 'ズレ', '情報', '指示'],
    aha:
      '口頭指示、会議情報、変更連絡、共有範囲、優先順位を分けると、話し方の問題ではなく情報と手順の設計課題が見える。',
  },
  {
    title: '雇用は続いているが、成長していない',
    stuck: '定着しているので成功、または本人が現状維持を望んでいると見られやすい。',
    lenses: ['評価', '成果', '学び', '地域'],
    aha:
      '役割、成果、処遇、学習機会、職場規模、外部資源を見ると、雇用継続だけでは測れない参加の質が見える。',
  },
];

const principalPatternGrammar = [
  {
    label: '1. 条件窓',
    title: '属性は答えではなく、見えやすくなる接触点を変える',
    body:
      '診断名、障害種類、機能、年齢、性別、地域、職場規模、制度カテゴリは、配慮表のキーではなく、どの相互作用を見落としやすいかを示す入口です。',
  },
  {
    label: '2. ICF接触点',
    title: '困難は、具体的な仕事接触点に現れる',
    body:
      '心身機能、活動、参加、環境、個人文脈、仕事要求が接する場所を見ます。作業、時間、情報、移動、評価、相談線などが観測点になります。',
  },
  {
    label: '3. 翻訳/再翻訳',
    title: '本人・職場・支援・制度の言葉をつなぎ直す',
    body:
      '支援の本質は存在ではなく、条件を仕事で使える言葉へ変える容量です。変化時には、同じ条件をもう一度翻訳し直す必要があります。',
  },
  {
    label: '4. 自由度と参加品質',
    title: '試せる、休める、戻れる、評価される、学べるかを見る',
    body:
      '結論は就労有無や満足度だけではありません。自由度が開くことで、役割、処遇、学習、所属、将来見通しまで含む参加品質が変わります。',
  },
];

const interpretiveDisciplineCards = [
  {
    title: '名前から決めつけない',
    body:
      '診断名、障害種類、年齢、地域、制度カテゴリは、答えではなく、どの接触点が見えやすくなるかを探す入口として扱います。',
  },
  {
    title: '一つの説明で閉じない',
    body:
      '疲れ、情報、評価、生活保障、職場側制約など、別の読みを残します。最初に見えた説明だけで完結させません。',
  },
  {
    title: '支援名・配慮名を正解にしない',
    body:
      '短時間勤務、手順書、面談、支援機関につながることは手段です。何の自由度を開いているかを確認します。',
  },
  {
    title: '根拠の身元と新しさを分ける',
    body:
      '研究、行政資料、過去調査、現場経験、相談事例は同じ強さではありません。日付、対象、使える範囲を分けます。',
  },
  {
    title: '共有範囲を守る',
    body:
      '仕事に必要な情報と、共有しない情報を分けます。目的、相手、範囲、更新時点、同意を確認します。',
  },
  {
    title: '学びを固定しない',
    body:
      'AIや専門家の読みは候補です。観察、反対の可能性、試した結果、人間の確認で見直せる形に残します。',
  },
];

const situationLevelGuide = [
  {
    icon: '🟢',
    label: '安定・予防',
    body: '条件が見えており、変化前に調整できる。',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
  {
    icon: '🟡',
    label: '要調整',
    body: '工夫で回るが、山場や変化で崩れやすい。',
    tone: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    icon: '🔴',
    label: '高頻度支障',
    body: '支障が反復し、評価・関係・健康時間へ波及する。',
    tone: 'border-rose-200 bg-rose-50 text-rose-950',
  },
  {
    icon: '💣',
    label: '破綻・停止',
    body: '仕事、健康、相談、参加のどれかが止まり始めている。',
    tone: 'border-slate-300 bg-slate-950 text-white',
  },
];

const workDesignSituationScales: Record<
  string,
  {
    axis: string;
    stable: string;
    adjust: string;
    high: string;
    critical: string;
  }
> = {
  '負荷をならす': {
    axis: '負荷と回復の余地',
    stable: '作業量、密度、順序、休憩、通勤、翌日の回復まで含めて山をならせている。',
    adjust: '山場は見えているが、順序変更や休憩が本人の都度調整に残っている。',
    high: '締切や繁忙の重なりで、翌日の疲労、品質低下、相談遅れが反復する。',
    critical: '負荷の山が読めず、欠勤、納期断念、数日単位の回復遅れにつながっている。',
  },
  '治療と仕事時間を合わせる': {
    axis: '治療・回復と勤務の同期',
    stable: '通院、治療後の回復、会議情報、引継ぎ、評価が同じ予定表で扱われている。',
    adjust: '通院日は認められるが、治療後の回復や抜けた情報の補完が弱い。',
    high: '受診日と会議、納期、収入、評価がぶつかり、健康時間を守るほど不利になる。',
    critical: '治療を優先すると仕事が止まり、仕事を優先すると治療や回復が崩れている。',
  },
  '休む・戻る道筋を作る': {
    axis: '休む・戻る回路',
    stable: '休む前、休む間、戻る時の相談線、仕事量、役割、評価、見直し日が決まっている。',
    adjust: '復帰直後の配慮はあるが、仕事量を戻す段階や再調整時点が曖昧である。',
    high: '元の業務量への早戻しが反復し、再不調、評価不安、相談控えにつながる。',
    critical: '休むと役割、関係、相談線が切れ、我慢するか辞めるかの二択になっている。',
  },
  '移動と休憩場所まで含める': {
    axis: '移動・休息・環境接触',
    stable: '通勤、職場内動線、座席、姿勢、休息場所、音・照明まで仕事参加の条件として扱えている。',
    adjust: '作業場所は調整できるが、通勤、会議室移動、安心して休める場所が残課題である。',
    high: '移動や環境刺激で働く前に消耗し、勤務中の集中、痛み、疲労が反復して悪化する。',
    critical: '通勤、動線、休息場所の問題で、出勤、滞在、会議参加そのものが止まり始めている。',
  },
  '待てる余地をつくる': {
    axis: '待つ・試す・選び直す自由',
    stable: '収入、医療費、制度、家族・地域資源が、試す・休む・選び直す余地を支えている。',
    adjust: '短期的には待てるが、医療費や収入不安で勤務量や応募先を急ぎやすい。',
    high: '生活保障の不足で、合わない仕事、無理な勤務量、早すぎる復帰を選びやすい。',
    critical: '治療、休息、再選択より目先の収入確保が優先され、選択肢が実質的に閉じている。',
  },
  '評価・収入との衝突を見る': {
    axis: '健康時間と評価・収入の接続',
    stable: '調整後の成果、役割、評価基準、賃金、生活できる収入、将来見通しを分けて説明できる。',
    adjust: '配慮下の成果は見えているが、評価、処遇、役割拡張への接続が弱い。',
    high: '短時間勤務や通院調整が、低評価、低収入、役割固定、将来不安に反復してつながる。',
    critical: '配慮はあるが、働き続けるほど生活保障や参加の質が狭くなっている。',
  },
  '変化を話し直せる': {
    axis: '変化時の再調整',
    stable: '治療変更、繁忙期、異動、生活変化の前に、共有範囲を守って話し直す相手と時点がある。',
    adjust: '悪化後は相談できるが、予兆、将来不安、繁忙期前の見直しが予定化されていない。',
    high: '変化のたびに本人が一から説明し直し、配慮や役割変更が後追いになる。',
    critical: '初回合意が固定され、治療、体調、生活、職場変化に条件が追いつかず仕事が止まる。',
  },
  '求人と本人条件をすり合わせる': {
    axis: '求人要件と本人条件の相互翻訳',
    stable: '求人の抽象語を、作業、時間、対人、判断、環境、評価へ分け、本人条件と照合できる。',
    adjust: '要件分解は始まっているが、応募前に確認・見学・試行できる情報が足りない。',
    high: '「臨機応変」「体力」などの抽象語が能力要件化し、応募前から選択肢を狭める。',
    critical: '求人語と本人条件が翻訳されず、応募、面接、採用判断が表層条件で止まっている。',
  },
  '見学・実習で仕事像を確かめる': {
    axis: '体験から採用後設計への接続',
    stable: '見学・実習で見えた作業、環境、生活リズム、相談線、評価を採用後設計へ渡している。',
    adjust: '体験中の支障は見えるが、採用後の手順、休憩、相談線、評価に残りにくい。',
    high: '実習条件と実勤務条件の差が大きく、採用後に同じ支障が再発する。',
    critical: '体験が適性判定だけに消費され、採用後の仕事設計へ接続していない。',
  },
  '伝える範囲を目的で決める': {
    axis: '開示・共有の目的限定',
    stable: '伝える内容、伝えない内容、共有先、同意範囲、更新時点が調整目的ごとに分かれている。',
    adjust: '人事や上司には共有できるが、同僚説明、更新時点、非共有情報の扱いで迷いが残る。',
    high: '共有範囲がぶれ、誤解、不利益、本人の説明負荷、職場側の過剰な推測が反復する。',
    critical: '必要情報が届かず調整が動かない、または過剰共有で不利益や二次被害が起きている。',
  },
  '人・仕事・制度をつなぎ直す': {
    axis: '支援の再翻訳容量',
    stable: '本人の言葉、職場不安、医療・生活情報、制度、評価基準を仕事条件へつなぎ直す役割がある。',
    adjust: '相談先はあるが、支援内容が作業、時間、環境、評価へ翻訳されきっていない。',
    high: '支援は存在するが、職場で何を誰が変えるのかに届かず、本人説明だけが増える。',
    critical: '本人、職場、医療・生活、制度が別々に動き、支援が仕事参加へ変換されていない。',
  },
  '戻れる相談ルートを残す': {
    axis: '継続相談と戻り回路',
    stable: '採用後、変化時、評価時、休職・復職時に戻れる相談先、共有範囲、返答期限がある。',
    adjust: '困った時の相談先はあるが、相談後に職場手順や評価へ戻す回路が弱い。',
    high: '問題が出るたびに相談先探しから始まり、対応遅れや本人の孤立感が反復する。',
    critical: '就職、異動、休職、復職を境に相談線が切れ、条件をつなぎ直す場所がない。',
  },
  '情報を分かる手順に変える': {
    axis: '情報形式から仕事手順への同期',
    stable: '口頭、文書、会議、チャット、変更連絡、安全確認が、実際に使える仕事手順として残る。',
    adjust: '手順書やチャットはあるが、変更、例外、非公式情報、安全確認がこぼれやすい。',
    high: '情報抜けが反復し、ミス、注意、確認控え、評価不安へ波及する。',
    critical: '情報形式が仕事手順に同期せず、作業開始、変更対応、安全確認が止まっている。',
  },
  '見え方のズレを見つける': {
    axis: 'source lens差の翻訳',
    stable: '本人、上司、人事、支援者、資料の見え方の差を、仕事条件の確認問いへ変えられている。',
    adjust: '視点差は見えているが、作業、情報、評価、支援のどの差かまでは分かれにくい。',
    high: '互いの見方が対立し、本人問題か職場問題かの押し付け合いになりやすい。',
    critical: '同じ出来事を同じ場面として共有できず、関係者間の調整が止まっている。',
  },
  '作業・道具・座席を合わせる': {
    axis: '作業接触点の設計',
    stable: '入力、判断、作業、確認、報告と、道具、座席、動線、姿勢、機器の接点を分けて調整できる。',
    adjust: '道具や座席は調整できるが、作業のどの接点で疲労や遂行困難が出るかが粗い。',
    high: '作業接触点が見えず、本人能力評価、苦手作業の回避、担当制限に戻りやすい。',
    critical: '作業、道具、姿勢、動線の接点が閉じ、担当できる仕事が極端に狭まっている。',
  },
  '安全・顧客・人員余力を見込む': {
    axis: '職場側制約の分解',
    stable: '安全、顧客対応、人員余力、代替体制、現場責任を作業ごとに分け、確認基準を置ける。',
    adjust: '職場側制約は話せるが、どこまで任せるか、止める基準、代替方法が曖昧である。',
    high: '安全・顧客・人員不安が未分解のまま反復し、任せる仕事や参加機会が狭まる。',
    critical: '安全や顧客対応を理由に、検証なしの排除、役割停止、過剰な保護が起きている。',
  },
  '情報アクセスを整える': {
    axis: '情報アクセスと参加',
    stable: '公式情報、非公式情報、会議、文書、音声、ICT、感覚刺激、情報量まで参加条件として整えている。',
    adjust: '公式情報は届くが、会議中のやりとり、非公式連絡、情報量の調整でこぼれやすい。',
    high: '情報アクセス不足が判断、関係形成、会議参加、評価に反復して響く。',
    critical: '重要情報から外れ、仕事参加、意思決定、安全確認、関係形成が成り立っていない。',
  },
  '指示・切替・記憶負荷を整える': {
    axis: '手順・切替・確認回路',
    stable: '開始条件、優先順位、完了条件、切替、同時並行、確認先、失敗から戻る手順が見える。',
    adjust: '通常時は回るが、割込み、急な優先順位変更、同時並行で確認回路が弱くなる。',
    high: 'ミスや遅れが反復し、注意や叱責だけが増えて、手順・切替の改善条件が見えない。',
    critical: '作業の開始、切替、完了、確認、復帰のどこかが止まり、仕事が継続しにくい。',
  },
  '成果の見方を合わせる': {
    axis: '成果・役割・処遇の価値翻訳',
    stable: '調整下の成果を、量、質、期限、共有、成長、役割、評価、賃金へ説明可能に接続している。',
    adjust: '成果は見えるが、通常評価への翻訳、処遇、昇進、将来見通しへの接続が弱い。',
    high: '雇用は続くが、役割固定、低評価、低処遇が反復し、参加の質が広がらない。',
    critical: '働いているのに、仕事としての価値、評価、処遇、将来の見通しが見えなくなっている。',
  },
  '学び・役割・キャリアにつなげる': {
    axis: '学習・役割拡張・将来見通し',
    stable: '新しい仕事を学ぶ機会、役割拡張、本人の将来希望、育成、評価が接続している。',
    adjust: '安定就労はあるが、次に学ぶ仕事、役割の広げ方、面談テーマが曖昧である。',
    high: '同じ役割に固定され、成長機会、本人希望、職場の育成会話が止まりやすい。',
    critical: '定着だけが成功扱いになり、学び、役割、キャリア、参加の厚みが閉じている。',
  },
  '職場規模・地域資源に合わせる': {
    axis: '実装資源との適合',
    stable: '職場規模、業種、地域資源、外部支援、医療、福祉、産業保健、行政に合わせて実装方法を変えている。',
    adjust: 'よいモデルはあるが、その職場の人員余力、地域資源、支援接続に合わせた翻訳が不足している。',
    high: '大企業前提、都市部前提、専門職常駐前提の方法が合わず、現場負荷が増える。',
    critical: '使える資源が接続せず、同じ仕事設計の構造をその職場で実装できない。',
  },
};

function WorkDesignSituationLevelStrip({ title }: { title: string }) {
  const scale = workDesignSituationScales[title];

  if (!scale) {
    return null;
  }

  const levels = [
    { ...situationLevelGuide[0], detail: scale.stable },
    { ...situationLevelGuide[1], detail: scale.adjust },
    { ...situationLevelGuide[2], detail: scale.high },
    { ...situationLevelGuide[3], detail: scale.critical },
  ];

  return (
    <div className="border-t border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">状況レベル</p>
          <p className="mt-1 text-sm leading-7 text-slate-600">
            観測軸: <span className="font-semibold text-slate-950">{scale.axis}</span>
          </p>
        </div>
        <p className="text-xs leading-6 text-slate-500">
          人や職場の採点ではなく、仕事条件としてどこまで扱えているかを見る目盛りです。
        </p>
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-4">
        {levels.map((level) => (
          <article key={`${title}-${level.label}`} className={`border p-4 ${level.tone}`}>
            <p className="text-sm font-semibold">
              <span aria-hidden="true">{level.icon}</span> {level.label}
            </p>
            <p className="mt-2 text-sm leading-7 opacity-90">{level.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function PublicToolsContent() {
  const designTargets = ['企業経営', '雇用管理', '専門支援', '制度設計'];
  const designPath = [
    {
      label: '実装領域',
      title: 'どこへ持ち込むか',
      body: '経営、雇用管理、専門支援、制度設計を、同じ仕事条件の地図で見る。',
    },
    {
      label: '設計面',
      title: '何を同時に見るか',
      body: '健康時間、入口・翻訳、職場・価値の3面で、取り組みの抜けを減らす。',
    },
    {
      label: '問い',
      title: '何を問うか',
      body: '各面を7つの問いへ開き、抽象的な理念を実装できる条件へ落とす。',
    },
  ];

  return (
    <section id="work-design-board" className="scroll-mt-24 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="overflow-hidden border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-300 bg-slate-950 p-6 text-white">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
              <div>
                <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
                  21視点ボード
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
                  未来の仕事設計を、21の観測点へ開く。
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-white/78">
                  人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計を、21の問いで組み立てるための全体地図です。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  ['3', '設計面'],
                  ['21', '問い'],
                ].map(([number, label]) => (
                  <div key={label} className="border border-white/15 bg-white/10 p-3">
                    <p className="text-3xl font-semibold leading-none text-cyan-100">{number}</p>
                    <p className="mt-2 text-xs font-semibold text-white/80">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-b border-slate-300 bg-[#fbfaf5] p-5">
            <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
              <article className="border border-cyan-200 bg-white p-5">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                  4つの実装領域
                </p>
                <p className="mt-3 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                  未来の取り組みに持ち込む。
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {designTargets.map((target) => (
                    <span
                      key={target}
                      className="border border-slate-300 bg-[#fbfaf5] px-3 py-2 text-sm font-semibold text-slate-800"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </article>
              <div className="grid gap-3 md:grid-cols-3">
                {designPath.map((step, index) => (
                  <article key={step.label} className="border border-slate-300 bg-white p-4">
                    <span className="inline-grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      {step.label}
                    </p>
                    <h3 className="mt-2 text-base font-semibold leading-snug text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-0 lg:grid-cols-3">
            {workDesignGuideChapters.map((chapter, chapterIndex) => (
              <article
                key={chapter.id}
                className="border-b border-slate-300 bg-[#fbfaf5] p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <p className="text-sm font-semibold text-cyan-800">設計面 {chapterIndex + 1} / 7視点</p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{chapter.use}</p>
                <div className="mt-5 grid gap-3">
                  <div className="border border-cyan-200 bg-white p-3">
                    <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                      構造上の束
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-950">
                      {chapter.anchor}
                    </p>
                  </div>
                  <div className="border border-slate-300 bg-white p-3">
                    <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                      この面で見る観測点
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-800">
                      {chapter.observes}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {chapter.items.map((item, index) => (
                    <a
                      key={item.title}
                      href={`#view-${chapterIndex * 7 + index + 1}`}
                      className="group grid grid-cols-[2.25rem_1fr] gap-3 border border-slate-300 bg-white p-3 transition hover:border-cyan-700 hover:bg-cyan-50"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                        {chapterIndex * 7 + index + 1}
                      </span>
                      <span>
                        <span className="block text-base font-semibold leading-snug text-slate-950">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">
                          {item.scene}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {workDesignGuideChapters.map((chapter, chapterIndex) => (
            <section
              key={chapter.id}
              aria-labelledby={`${chapter.id}-heading`}
              className="overflow-hidden border border-slate-300 bg-white"
            >
              <div className="border-b border-slate-300 bg-[#fbfaf5] p-6">
                <p className="text-sm font-semibold text-cyan-800">設計面 {chapterIndex + 1}</p>
                <h3
                  id={`${chapter.id}-heading`}
                  className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-slate-950"
                >
                  {chapter.title}
                </h3>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">{chapter.structuralRole}</p>
              </div>

              <div className="divide-y divide-slate-200">
                {chapter.items.map((item, index) => (
                  <details
                    key={item.title}
                    id={`view-${chapterIndex * 7 + index + 1}`}
                    className="group bg-white p-0"
                  >
                    <summary className="grid cursor-pointer list-none gap-4 p-5 transition hover:bg-cyan-50 md:grid-cols-[64px_0.9fr_1.35fr]">
                      <div className="flex items-start gap-3 md:block">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                          {chapterIndex * 7 + index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                          観測点
                        </p>
                        <h4 className="mt-1 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.scene}</p>
                      </div>
                      <p className="text-sm leading-7 text-slate-700">
                        <span className="font-semibold text-slate-950">本質構造: </span>
                        {item.core}
                      </p>
                    </summary>
                    <div className="grid gap-0 border-t border-slate-200 bg-[#fbfaf5] md:grid-cols-2 xl:grid-cols-4">
                      <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
                        <p className="text-sm font-semibold text-slate-950">よくあるサイン</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.scene}</p>
                      </div>
                      <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
                        <p className="text-sm font-semibold text-cyan-900">構造として読む</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.read}</p>
                      </div>
                      <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
                        <p className="text-sm font-semibold text-cyan-900">すぐ出す確認問い</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.practice}</p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm font-semibold text-rose-800">ひっかけ注意</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{item.avoid}</p>
                      </div>
                    </div>
                    <WorkDesignSituationLevelStrip title={item.title} />
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <details className="mt-10 border border-slate-300 bg-[#fbfaf5]">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-950">
            読み方の補助メモ
          </summary>
          <div className="border-t border-slate-300 bg-white p-5">
            <p className="max-w-3xl text-sm leading-7 text-slate-700">
              ここは中核構造ではなく、読みを急いで判断表にしないための注意点です。21視点は、配慮チェックリストでも、個別相談の答え集でもありません。
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {interpretiveDisciplineCards.map((card) => (
                <article key={card.title} className="border border-slate-200 bg-[#fbfaf5] p-4">
                  <h4 className="text-base font-semibold leading-snug tracking-normal text-slate-950">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

function PublicStudioContent() {
  return (
    <section className="bg-[#efe9dc] py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            モデル場面で読む
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 md:text-4xl">
            同じ場面を、企業側と支援者側で一緒に読む。
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-700">
            文章で説明する前に、各モデル場面を4コマのマンガで見ます。個別判断ではなく、止まりやすい見方、分断されている情報、つなぎ直す仕事条件を順番に並べます。
          </p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {sceneCardReaderUses.map((use) => (
            <article key={use.label} className="border border-slate-300 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                {use.label}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{use.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 space-y-5">
          {workDesignStudioScenarios.map((scenario, index) => {
            const contactLabels = scenario.contactPointIds
              .map((id) => workDesignMapNodes.find((node) => node.id === id)?.label)
              .filter(Boolean);
            const scenarioManga = publicStudioScenarioImages[scenario.id];
            const consultationRoute = getStudioScenarioConsultationRoute(scenario.id);

            return (
            <article id={scenario.id} key={scenario.id} className="overflow-hidden border border-slate-300 bg-white shadow-sm">
              {scenarioManga ? (
                <figure className="border-b border-slate-300 bg-[#fbfaf5] p-3 md:p-5">
                  <img
                    src={scenarioManga.src}
                    alt={scenarioManga.alt}
                    className="w-full border border-slate-200 bg-white object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <figcaption className="mt-3 text-xs leading-6 text-slate-600">
                    {scenarioManga.caption}
                    このマンガはモデル場面の入口です。実在ケースや個別判断ではありません。
                  </figcaption>
                </figure>
              ) : null}
              <div className="grid gap-0 lg:grid-cols-[0.36fr_0.64fr]">
                <div className="border-b border-slate-300 bg-slate-950 p-6 text-white lg:border-b-0 lg:border-r">
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                    モデル場面 {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-white">
                    {scenario.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/76">{scenario.workplace}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {contactLabels.map((label) => (
                      <span key={label} className="border border-white/18 bg-white/8 px-2 py-1 text-xs font-semibold text-cyan-100">
                        {label}
                      </span>
                    ))}
                  </div>
                  {consultationRoute ? (
                    <>
                      <p className="mt-5 text-xs font-semibold leading-6 text-cyan-100">
                        対応する相談: {consultationRoute.label}
                      </p>
                      <Link
                        href={consultationRoute.href}
                        className="mt-3 inline-flex items-center gap-2 border border-white/25 bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
                      >
                        相談事例集へ進む
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </>
                  ) : null}
                </div>
                <div className="grid gap-0">
                  <div className="grid border-b border-slate-300 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="border-b border-slate-300 bg-[#fbfaf5] p-5 lg:border-b-0 lg:border-r">
                      <p className="text-sm font-semibold text-cyan-800">絵で起きていること</p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{scenario.artificialCase}</p>
                      <div className="mt-4 border-l-4 border-cyan-700 bg-white px-4 py-3">
                        <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                          見落としやすい問い
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-7 text-slate-800">
                          {scenario.startingQuestion}
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2">
                      <div className="border-b border-slate-300 p-5 md:border-b-0 md:border-r">
                        <p className="text-sm font-semibold text-slate-950">企業側の読み</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{scenario.employerRead}</p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm font-semibold text-slate-950">支援者側の読み</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{scenario.practitionerRead}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-800">確認する設計条件</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                        {scenario.designMoves.slice(0, 3).map((move) => (
                          <li key={move} className="flex gap-2">
                            <CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-700" />
                            <span>{move}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cyan-800">追加で確認する問い</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                        {scenario.supportQuestions.slice(0, 3).map((question) => (
                          <li key={question} className="flex gap-2">
                            <FileSearch size={16} className="mt-1 shrink-0 text-cyan-700" aria-hidden="true" />
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 border border-slate-200 bg-[#fbfaf5] p-3">
                        <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">
                          この場面で持ち帰ること
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{scenario.output}</p>
                      </div>
                    </div>
                    <div className="border border-rose-200 bg-rose-50 p-4">
                      <p className="text-sm font-semibold text-rose-800">早めに確認したい点</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                        {scenario.redFlags.slice(0, 3).map((flag) => (
                          <li key={flag} className="flex gap-2">
                            <CircleAlert size={16} className="mt-1 shrink-0 text-rose-700" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 border-t border-rose-200 pt-3">
                        <p className="text-xs font-semibold tracking-[0.12em] text-rose-800">
                          見ている条件
                        </p>
                        <p className="mt-1 text-xs leading-6 text-slate-700">
                          {contactLabels.join(' / ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PublicArticleSnsOperationBoard() {
  const updateNotes = [
    {
      label: '拾う',
      body: 'ニュース、SNS、研修現場で出た問い、誤読、追加質問を見る。',
    },
    {
      label: '戻す',
      body: '近い記事、図解、教材へつなぎ、足りない説明は改稿候補にする。',
    },
    {
      label: '守る',
      body: '個別助言、自動返信、DM相談、反応の根拠化にはつなげない。',
    },
  ];

  return (
    <section id="social-question-loop" className="mt-8 scroll-mt-24 border-t border-slate-300 pt-6">
      <div className="grid gap-5 bg-white p-5 shadow-sm md:p-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            更新の入口
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950 md:text-3xl">
            読まれ方を見て、記事を直す。
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            反応は根拠ではなく、次に直す説明の手がかりです。公開ページには投稿候補や返信方針を置かず、必要な更新だけを記事や図解へ戻します。
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {updateNotes.map((note) => (
            <div key={note.label} className="border border-slate-200 bg-[#fbfaf5] p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                {note.label}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{note.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicArticleSpecialSeriesBlock() {
  const packetTitles = [
    '雇用率の先へ',
    'ラベルと言葉の向こうの就労経験',
    '観察から仕事をつくる',
    '見えない障害・難病・症状変動',
    'AIは支援者を置き換えるのか、増幅するのか',
  ];

  return (
    <section id="special-series" className="mt-8 scroll-mt-24 overflow-hidden border border-slate-300 bg-slate-950 text-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[320px] bg-slate-900">
          <img
            src="/images/work-condition-forum-virtual-city-hero-v1.webp"
            alt="水辺の架空都市にある会議場へ参加者が向かうバーチャルフォーラムの風景"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/35" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/88 to-transparent p-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
              イベント特集
            </p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-normal">
              仕事条件デザイン・バーチャルフォーラム
            </h3>
          </div>
        </div>
        <div className="p-5 md:p-7">
          <div className="flex flex-wrap gap-2 text-xs font-semibold tracking-[0.12em] text-cyan-100">
            <span className="border border-white/20 bg-white/10 px-3 py-2">6セッション</span>
            <span className="border border-white/20 bg-white/10 px-3 py-2">22発表</span>
            <span className="border border-white/20 bg-white/10 px-3 py-2">本文ページ</span>
          </div>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-normal md:text-4xl">
            「働ける人を探す」から、「働ける条件を設計する」へ。
          </h2>
          <p className="mt-4 text-base leading-8 text-white/78">
            海外の就労支援カンファレンス周辺のテーマ群に着想を得て、日本の障害者雇用、難病・慢性疾患、メンタルヘルス、若者移行、企業支援、制度実装、AI活用を、仕事条件デザインとして読み直すイベント型コンテンツです。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {packetTitles.map((title) => (
              <span key={title} className="border border-white/18 bg-white/[0.08] px-3 py-2 text-sm font-semibold text-white/88">
                {title}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-white/18 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-white/68">
              公式提携、翻訳、認定、制度・統計の断定ではありません。個別の医学・法務・雇用・配慮妥当性判断にも使いません。
            </p>
            <Link
              href={workConditionForumHubHref}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              イベントを開く
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicPolicyContent() {
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [selectedArticleId, setSelectedArticleId] = useState(questionLensArticles[0].id);
  const [expandedInfographicArticleId, setExpandedInfographicArticleId] = useState<string | null>(null);
  const articleReaderRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const articleId = new URLSearchParams(window.location.search).get('article');
    if (articleId && questionLensArticles.some((article) => article.id === articleId)) {
      setSelectedArticleId(articleId);
    }
  }, []);

  const visibleArticles =
    activeCategory === 'すべて'
      ? questionLensArticles
      : questionLensArticles.filter((article) => article.category === activeCategory);
  const selectedArticle =
    questionLensArticles.find((article) => article.id === selectedArticleId) ??
    visibleArticles[0] ??
    questionLensArticles[0];

  const chooseCategory = (category: string) => {
    setActiveCategory(category);
    const firstArticle =
      category === 'すべて'
        ? questionLensArticles[0]
        : questionLensArticles.find((article) => article.category === category);
    if (firstArticle) {
      setSelectedArticleId(firstArticle.id);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('article', firstArticle.id);
        url.hash = 'article-reader';
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      }
    }
  };

  const chooseArticle = (articleId: string, options: { scrollToArticle?: boolean } = {}) => {
    setSelectedArticleId(articleId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('article', articleId);
      url.hash = 'article-reader';
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
    if (options.scrollToArticle && typeof window !== 'undefined') {
      const schedule =
        window.requestAnimationFrame ??
        ((callback: FrameRequestCallback) => window.setTimeout(callback, 0));
      schedule(() => {
        articleReaderRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      });
    }
  };
  const hasImageInfographic = Boolean(selectedArticle.infographicImage);
  const selectedArticleSections = selectedArticle.paragraphs.map((paragraph, index) => ({
    heading: selectedArticle.sectionHeadings[index] ?? `読みどころ ${index + 1}`,
    paragraph,
  }));
  const selectedArticleToolkitLinks = articleToolkitLinks[selectedArticle.id] ?? [];
  const expandedInfographicArticle = questionLensArticles.find(
    (article) => article.id === expandedInfographicArticleId,
  );

  return (
    <section id="question-note-01" className="scroll-mt-24 bg-[#f7f3ea] py-14">
      <div className="mx-auto w-full px-5" style={{ maxWidth: 'min(80rem, 100vw)' }}>
        <div className="flex max-w-full flex-col gap-5 border-b border-slate-300 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              問いから記事を選ぶ
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-700">
              ニュースや制度の話題を、賛否ではなく職場で話せる問いへ戻す。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {questionLensCategories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => chooseCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-700 hover:text-cyan-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <PublicArticleSpecialSeriesBlock />

        <div className="mt-8 grid max-w-full gap-9 lg:grid-cols-[340px_1fr]">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
            <div className="bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                <BookOpen size={18} className="text-cyan-800" />
                <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                  記事一覧
                </p>
              </div>
              <nav aria-label="働き方の問いをひらく記事一覧" className="divide-y divide-slate-200">
                {visibleArticles.map((article) => (
                  <button
                    key={article.id}
                    type="button"
                    aria-pressed={selectedArticle.id === article.id}
                    onClick={() => chooseArticle(article.id, { scrollToArticle: true })}
                    className={`block w-full py-4 text-left transition ${
                      selectedArticle.id === article.id ? 'text-slate-950' : 'text-slate-600 hover:text-cyan-900'
                    }`}
                  >
                    <span className="block text-xs font-semibold tracking-[0.14em] text-cyan-800">
                      {article.category} / {article.readingTime}
                    </span>
                    <span className="mt-2 block text-base font-semibold leading-snug">
                      {article.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6">
                      {article.hook}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <article
              id="article-reader"
              ref={articleReaderRef}
              aria-live="polite"
              className="min-w-0 scroll-mt-24 bg-white px-6 py-8 shadow-sm md:px-10 md:py-11"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.13em] text-cyan-800">
                <span>記事 {selectedArticle.number}</span>
                <span>{selectedArticle.category}</span>
                <span>{selectedArticle.readingTime}</span>
                <span>{selectedArticle.reader}</span>
              </div>
              <h3 className="mt-4 max-w-3xl break-all text-4xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-5xl">
                {selectedArticle.title}
              </h3>
              <p className="mt-5 max-w-3xl border-l-4 border-cyan-800 pl-5 text-xl font-semibold leading-9 text-slate-800">
                {selectedArticle.hook}
              </p>

              <section id="lens-infographic" className="mt-9 scroll-mt-24 border border-slate-300 bg-[#fbfaf5] p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                      {hasImageInfographic ? '対応インフォグラフィック' : '図解の読みどころ'}
                    </p>
                    <h4 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-slate-950">
                      {selectedArticle.diagramTitle}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-900">
                    <ImageIcon size={20} aria-hidden="true" />
                    <span>本文を読む前後に確認する図解</span>
                  </div>
                </div>
                {selectedArticle.infographicImage ? (
                  <figure className="mx-auto mt-6 max-w-4xl overflow-hidden border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedInfographicArticleId(selectedArticle.id)}
                      className="group block w-full text-left"
                      aria-label={`${selectedArticle.diagramTitle}のインフォグラフィックを拡大して見る`}
                    >
                      <img
                        src={selectedArticle.infographicImage}
                        alt={selectedArticle.infographicAlt}
                        className="h-auto w-full transition duration-300 group-hover:scale-[1.01]"
                      />
                      <span className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm font-semibold text-cyan-900">
                        拡大して見る
                        <Maximize2 size={16} aria-hidden="true" />
                      </span>
                    </button>
                    <figcaption className="border-t border-slate-200 px-4 py-3 text-sm leading-6 text-slate-600">
                      記事の要点を、文章を読む前にも後にも確認できる図解です。
                    </figcaption>
                  </figure>
                ) : (
                  <div className="mt-5 border border-slate-300 bg-white p-5">
                    <p className="text-base leading-8 text-slate-700">
                      この記事を図解として読む時は、次の観点が中心になります。本文を読む前に、どこを見ればよいかを先につかめます。
                    </p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedArticle.nodes.map((node) => (
                        <div
                          key={`${selectedArticle.id}-diagram-${node}`}
                          className="border border-slate-300 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold text-slate-950"
                        >
                          {node}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <div className="mx-auto mt-10 max-w-[76ch] space-y-8 text-lg leading-9 text-slate-700">
                {selectedArticleSections.map((section) => (
                  <section key={`${selectedArticle.id}-${section.heading}`} className="space-y-3">
                    <h4 className="text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                      {section.heading}
                    </h4>
                    <p>{section.paragraph}</p>
                  </section>
                ))}
              </div>

              <section className="mt-10 border border-slate-300 bg-[#fbfaf5] p-5">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                    関係として読む
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                    社会の話題を、そのまま答えにせず、関係の地図へ戻す。
                  </h4>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[0.9fr_1fr_1.1fr]">
                  <div className="border border-rose-200 bg-rose-50 p-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-rose-700">
                      入口の言葉
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
                      {selectedArticle.partialQuestion}
                    </p>
                  </div>
                  <div className="border border-slate-300 bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                      戻す関係
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedArticle.nodes.slice(0, 6).map((node) => (
                        <span
                          key={`${selectedArticle.id}-relation-${node}`}
                          className="border border-slate-300 bg-[#fbfaf5] px-2.5 py-1.5 text-xs font-semibold text-slate-950"
                        >
                          {node}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border border-cyan-200 bg-cyan-50 p-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                      仕事条件で開いた問い
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-slate-950">
                      {selectedArticle.lensQuestion}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-300 pt-4 text-sm leading-7 text-slate-700">
                  {articleReaderUseCards.map((use, index) => (
                    <span key={use.label}>
                      <span className="font-semibold text-slate-950">{use.label}</span>: {use.body}
                      {index < articleReaderUseCards.length - 1 ? ' / ' : ''}
                    </span>
                  ))}
                </div>
              </section>

              <div className="mt-9 border-t border-slate-300 pt-6">
                <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                  この記事で見る条件
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedArticle.nodes.map((node) => (
                    <span
                      key={`${selectedArticle.id}-${node}`}
                      className="border border-slate-300 bg-[#fbfaf5] px-3 py-2 text-sm font-semibold text-slate-950"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-5 border-t border-slate-300 pt-6 lg:grid-cols-[0.86fr_1.14fr]">
                <div className="bg-[#fbfaf5] p-5 md:p-6">
                  <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                    読後に話す問い
                  </p>
                  <p className="mt-3 text-base font-semibold leading-8 text-slate-950">
                    {selectedArticle.conversation}
                  </p>
                </div>
                <div className="bg-cyan-50 p-5 md:p-6">
                  <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                    次に読む
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {selectedArticle.next}
                  </p>
                </div>
              </div>

              {selectedArticleToolkitLinks.length > 0 ? (
                <section className="mt-8 border border-cyan-200 bg-cyan-50 p-5">
                  <div className="flex items-center gap-2 text-cyan-900">
                    <Wrench size={18} aria-hidden="true" />
                    <h4 className="text-lg font-semibold leading-snug tracking-normal">
                      この記事を道具にする
                    </h4>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    この記事を読んだ後、会議・研修・場面共有で使うための道具です。
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {selectedArticleToolkitLinks.map((toolkit) => (
                      <a
                        key={toolkit.href}
                        href={toolkit.href}
                        className="block border border-cyan-200 bg-white p-4 transition hover:border-cyan-700"
                      >
                        <span className="text-sm font-semibold leading-6 text-cyan-900">
                          {toolkit.title}
                        </span>
                        <span className="mt-2 block text-sm leading-7 text-slate-700">
                          {toolkit.note}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="mt-8 border border-cyan-200 bg-cyan-50 p-5">
                  <div className="flex items-center gap-2 text-cyan-900">
                    <Wrench size={18} aria-hidden="true" />
                    <h4 className="text-lg font-semibold leading-snug tracking-normal">
                      この記事を道具にする
                    </h4>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    このテーマは、上の読後に話す問いと図解目次から、会議や研修で使う問い、図解ラベル、相談事例集・21視点への導線へ変換していきます。
                  </p>
                </section>
              )}

              <div className="mt-4 flex gap-3 border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
                <ShieldCheck size={18} className="mt-1 shrink-0 text-cyan-800" aria-hidden="true" />
                <p>
                  これは診断、医学判断、就労可否、法的判断、配慮妥当性の判定ではありません。SNSや読後反応は根拠ではなく、説明を直す手がかりとして扱います。制度・統計を扱う場合は、出典、日付、管轄を別途確認します。
                </p>
              </div>
            </article>

            <section id="lens-library" className="scroll-mt-24 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                    図解目次
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
                    記事ごとの図解から選ぶ。
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600">
                  記事本文とは別に、内容を直観的につかむための入口です。画像版があるものはサムネイルから開けます。
                </p>
              </div>
              <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                {questionLensArticles.map((article) => (
                  <a
                    key={`${article.id}-infographic-index`}
                    href="#lens-infographic"
                    onClick={() => chooseArticle(article.id)}
                    className={`group grid gap-4 py-4 transition md:grid-cols-[132px_1fr_auto] md:items-center ${
                      selectedArticle.id === article.id
                        ? 'bg-cyan-50 px-3'
                        : 'hover:bg-[#fbfaf5]'
                    }`}
                  >
                    <div className="h-20 overflow-hidden bg-slate-100">
                      {article.infographicImage ? (
                        <img
                          src={article.infographicImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-xs font-semibold text-slate-500">
                          読みどころ
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                        図解 {article.number} / {article.category}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold leading-snug tracking-normal text-slate-950">
                        {article.diagramTitle}
                      </h4>
                      <p className="mt-1 text-sm leading-7 text-slate-700">
                        {article.nodes.join(' / ')}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-900">
                      開く
                      <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <PublicArticleSnsOperationBoard />
      </div>
      {expandedInfographicArticle?.infographicImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${expandedInfographicArticle.diagramTitle}のインフォグラフィック拡大表示`}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4"
        >
          <div className="max-h-[92vh] w-full max-w-6xl overflow-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  インフォグラフィック
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
                  {expandedInfographicArticle.diagramTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExpandedInfographicArticleId(null)}
                className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                閉じる
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <img
              src={expandedInfographicArticle.infographicImage}
              alt={expandedInfographicArticle.infographicAlt}
              className="h-auto w-full"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PublicPartnershipContent() {
  const cognitiveToolkitPackages = [
    {
      label: '教材 01',
      title: '見えない病気と働く',
      catch: '元気そう、疲れやすい、通院が多い、で止めない。',
      useMoment: '見えない負担を、会議や研修で話し始めたい時',
      output: '健康時間、説明負荷、通院、開示境界の共有メモ',
      image: '/resources/invisible-disability/invisible-backpack.webp',
      thumbnails: [
        { src: '/resources/invisible-disability/invisible-backpack.webp', alt: '見えない負担をリュックで表した図解' },
        { src: '/songs/still/mienai-nimotsu-no-hero.jpg', alt: '見えない荷物のヒーローの音声入口ビジュアル' },
        { src: '/resources/teaching-library/heron-scenes/ibd-looks-fine-scene.webp', alt: '見た目では分かりにくい負担を示す場面マンガ' },
      ],
      href: '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html',
      audio: '/songs/audio/mienai-nimotsu-no-hero.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '見えない病気の理解は、症状説明だけでは職場の一手に戻りにくい。健康時間、説明負荷、通院、開示境界を同じ仕事条件として置くと、本人責任でも病名別理解でもない調整点が見える。',
      expertMoves: [
        '元気そうに見える日と、回復時間が必要な日を同じ一週間で見る。',
        '病状の詳細ではなく、仕事上共有すべき条件へ分ける。',
        '相談線、休憩、会議、締切を小さく試せる形にする。',
      ],
      balance: {
        focus: '言葉だけでは届きにくい負担を開く',
        coordination:
          '本人、職場、支援者が通院、回復時間、開示境界を同じ場面で話せるようにする。',
        cognition:
          '比喩、4コマ、音、読み下しで、言葉だけでは伝わりにくい見えない負担を入口化する。',
      },
      articles: [
        { title: '見えない病気は、理解だけでは仕事条件に戻らない。', href: articleLibraryHref('invisible-illness') },
        { title: '治療と仕事を、同じ一週間として読む。', href: articleLibraryHref('treatment-work-time') },
      ],
      deliverables: ['見えない負担の図解', '4コマ場面', '音の入口', '読み下しワーク'],
    },
    {
      label: '教材 02',
      title: 'がんばり美談から、仕事の前提へ',
      catch: 'ヒーローを増やすより、仕事の床を平らにする。',
      useMoment: '美談や称賛で止まり、仕事の前提が見えない時',
      output: '隠れた前提の分解カードと二週間確認',
      image: '/resources/teaching-library/heron-scenes/ableism-work-assumption-manga.webp',
      thumbnails: [
        { src: '/resources/teaching-library/heron-scenes/ableism-work-assumption-manga.webp', alt: 'がんばり美談を仕事の前提へ戻すマンガ' },
        { src: '/songs/still/ganbari-yori-sekkei.jpg', alt: 'がんばりより設計の音声入口ビジュアル' },
        { src: '/resources/invisible-disability/work-friction.webp', alt: '仕事の摩擦を示す図解' },
      ],
      href: '/downloads/teaching-library/work-assumption-shift-package-v1.html',
      audio: '/songs/audio/ganbari-yori-sekkei.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '美談は善意の入口になる一方で、本人の努力が仕事の段差、非公式な翻訳、評価の偏りを吸収している状態を見えにくくする。称賛で止めず、再現可能な仕事条件へ戻す。',
      expertMoves: [
        '誰の努力が、どの前提の不足を埋めているかを見る。',
        '役割、情報共有、相談先、評価、余力の偏りへ分解する。',
        '個人のすごさではなく、他の人にも移植できる条件にする。',
      ],
      balance: {
        focus: '称賛を入口に、仕事の前提を見える化する',
        coordination:
          '称賛を入口にしながら、役割、情報共有、相談先、評価を関係者で分けて見る。',
        cognition:
          'マンガと音で「がんばり」を揺らし、カードとワークで隠れた仕事の前提をつかむ。',
      },
      articles: [
        { title: '配慮名の前に、仕事を分解する。', href: articleLibraryHref('reasonable-accommodation-work-design') },
        { title: '職場の不安を、接触点に分けて読む。', href: articleLibraryHref('workplace-contact-decomposition') },
      ],
      deliverables: ['脱エイブリズム漫画', '音の入口', '美談分解カード', '二週間確認ワーク'],
    },
    {
      label: '教材 03',
      title: '研修後15分で、会議に一手を残す',
      catch: 'マニュアル、通達、好事例を、今日の場面、分ける表、二週間確認へ。',
      useMoment: '研修や資料を、会議の次に試す条件へ残したい時',
      output: '会議で使う3枚、15分進行台本、戻り回路',
      image: '/resources/work-support-transformation/foundational-training.webp',
      thumbnails: [
        { src: '/resources/work-support-transformation/foundational-training.webp', alt: '研修を仕事設計へつなぐ図解' },
        { src: '/images/work-condition-lens-manual-abundance-v1.webp', alt: '資料を会議道具へ変えるインフォグラフィック' },
        { src: '/songs/still/mae-ni-susumenai-mama-de.jpg', alt: '前に進めないままでの音声入口ビジュアル' },
      ],
      href: '/downloads/teaching-library/manual-to-meeting-package-v1.html',
      audio: '/songs/audio/mae-ni-susumenai-mama-de.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '資料不足ではなく、資料が会議の場面、役割分担、戻り回路へ翻訳されないことが詰まりになる。正しい説明を、今日見る場面、分ける表、二週間の確認へ落とす。',
      expertMoves: [
        '資料の論点を、会議で見る一つの場面へ戻す。',
        '本人、仕事、情報、時間、支援、評価に分けて書く。',
        '誰が、いつ、何を戻すかまで決める。',
      ],
      balance: {
        focus: '研修後の会議を、次に試す条件へ進める',
        coordination:
          '研修後の会議で、関係者が同じ場面、分ける表、二週間確認を残せるようにする。',
        cognition:
          '比喩と3枚シートで、資料の抽象語を手元の動作へ変える。ただし主戦場は連携と実装の詰まり。',
      },
      articles: [
        { title: 'マニュアルを増やすより、会議で使える形にする。', href: articleLibraryHref('manual-abundance') },
        { title: '制度や研究を、現場の問いに翻訳する。', href: articleLibraryHref('policy-research-translation') },
        { title: 'ワークショップの気づきを、実装へ残す。', href: articleLibraryHref('workshop-to-implementation') },
      ],
      deliverables: ['会議ワークボード', '15分進行台本', '会議で使う3枚', '戻り回路シート'],
    },
    {
      label: '教材 04',
      title: '連携会議の地図合わせ',
      catch: '関係者は集まった。でも、同じ場面を見ていない、で止めない。',
      useMoment: '関係者が集まるのに、見ている場面が揃わない時',
      output: '場面地図、4役割カード、確認担当、戻り先',
      image: '/images/work-condition-lens-multidisciplinary-shared-scene-v1.webp',
      thumbnails: [
        { src: '/images/work-condition-lens-multidisciplinary-shared-scene-v1.webp', alt: '多職種が同じ仕事場面を見るインフォグラフィック' },
        { src: '/images/work-condition-lens-workshop-implementation-v1.webp', alt: 'ワークショップの気づきを実装へつなぐ図解' },
        { src: '/songs/still/tsunagu-hikari.jpg', alt: 'つなぐ光の音声入口ビジュアル' },
      ],
      href: '/downloads/teaching-library/multidisciplinary-shared-scene-workshop-kit-v1.html',
      audio: '/songs/audio/tsunagu-hikari.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '多分野連携は、関係者を増やすだけでは進まない。本人、企業、支援者、医療・生活側がそれぞれ正しい言葉を持つほど、同じ仕事場面が消えやすい。会議の目的を「情報共有」から「同じ場面を机に置く」へ変える。',
      expertMoves: [
        '最初に一つの仕事場面を選び、全員が同じ場面を見る。',
        '本人、企業、支援者、医療・生活側の言葉を、仕事、時間、情報、支援へ置き直す。',
        '会議の最後に、誰が何を確認して戻すかを決める。',
      ],
      balance: {
        focus: '同じ場面を机に置く',
        coordination:
          '連携会議で、本人、企業、支援者、医療・生活側が同じ場面、役割、戻り先を共有できるようにする。',
        cognition:
          'ロールカードと場面地図で、分野別の言葉をひとつの仕事場面へ戻す。音や情緒より、共同作業の認知負荷を下げる比重が高い。',
      },
      articles: [
        { title: '多職種連携は、同じ場面を見るところから始まる。', href: articleLibraryHref('multidisciplinary-shared-scene') },
        { title: 'ワークショップの気づきを、実装へ残す。', href: articleLibraryHref('workshop-to-implementation') },
      ],
      deliverables: ['場面地図', '4役割カード', '30分進行台本', '戻り回路シート'],
    },
    {
      label: '教材 05',
      title: '本人中心を、同じ一週間で読む',
      catch: '希望、病状、求人、支援を、別々の紙で終わらせない。',
      useMoment: '本人中心を、希望だけでも支援者任せでもなく整理したい時',
      output: '同じ一週間の地図、相互作用カード、次に聞く3問',
      image: '/images/work-condition-lens-icf-interaction-v1.webp',
      thumbnails: [
        { src: '/images/work-condition-lens-icf-interaction-v1.webp', alt: '生活機能の相互作用を仕事場面へ戻すインフォグラフィック' },
        { src: '/resources/invisible-disability/common-overview.webp', alt: '見えない障害の共通する壁を示す図解' },
        { src: '/songs/still/hito-ga-saki.jpg', alt: '人が先の音声入口ビジュアル' },
      ],
      href: '/downloads/teaching-library/person-centered-icf-case-map-kit-v1.html',
      audio: '/songs/audio/hito-ga-saki.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '本人中心は、本人の希望だけを聞くことでも、支援者が全部を整えることでもない。希望、健康時間、仕事内容、環境、支援、制度接続を同じ一週間に置くと、本人の意思と実装条件を同時に守れる。',
      expertMoves: [
        '本人の希望を、仕事の一週間、回復時間、相談線と一緒に置く。',
        '医学的な見方と社会的な見方を対立させず、本人、仕事、環境、支援、時間の相互作用として読む。',
        '決めつけではなく、次に確認すべき問いを合意メモに残す。',
      ],
      balance: {
        focus: '本人中心を、条件中心に翻訳する',
        coordination:
          '本人、支援者、企業が、希望、健康時間、仕事内容、支援を同じ一週間で確認できるようにする。',
        cognition:
          '一週間地図と相互作用カードで、抽象的な生活機能の説明を、見て書けるケース整理へ変える。',
      },
      articles: [
        { title: '生活機能の見方は、同じ仕事場面を見る地図になる。', href: articleLibraryHref('icf-interaction') },
        { title: '治療と仕事を、同じ一週間として読む。', href: articleLibraryHref('treatment-work-time') },
      ],
      deliverables: ['同じ一週間の地図', '相互作用カード', '確認問いリスト', '合意メモ'],
    },
    {
      label: '教材 06',
      title: '配慮名の前に、仕事を分解する',
      catch: '合理的配慮を、名前当てではなく、作業・時間・情報・評価へ戻す。',
      useMoment: '配慮名や制度説明の前に、実際の仕事を見たい時',
      output: '仕事分解表、二週間確認シート、合意メモ',
      image: '/images/work-condition-lens-accommodation-work-design-v1.webp',
      thumbnails: [
        { src: '/images/work-condition-lens-accommodation-work-design-v1.webp', alt: '合理的配慮を仕事設計へ戻すインフォグラフィック' },
        { src: '/resources/invisible-disability/work-friction.webp', alt: '仕事の摩擦を示す図解' },
        { src: '/songs/still/hairyo-ga-areba-hatarakeru.jpg', alt: '配慮があれば働けるの音声入口ビジュアル' },
      ],
      href: '/downloads/teaching-library/accommodation-work-design-kit-v1.html',
      audio: '/songs/audio/hairyo-ga-areba-hatarakeru.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '合理的配慮は、配慮名や義務の説明で止まると、実際の仕事のどこを変えるのかが粗くなる。作業、時間、情報、評価、相談線へ分けると、本人の困難、職場の不安、支援者の翻訳が同じ表に乗る。',
      expertMoves: [
        '配慮名を出す前に、止まっている作業、時間、情報、評価、相談線を分ける。',
        '職場側の不安を、本人能力や企業姿勢の判定にせず、接触点へ分ける。',
        '二週間で試せる小さな設計変更を一つ選ぶ。',
      ],
      balance: {
        focus: '配慮名を、仕事条件にほどく',
        coordination:
          '本人、上司、人事、支援者が、配慮名ではなく具体的な作業・情報・評価の接触点を話せるようにする。',
        cognition:
          'カード、分解表、短い音の入口で、制度説明の重さを仕事の観察に戻す。',
      },
      articles: [
        { title: '配慮名の前に、仕事を分解する。', href: articleLibraryHref('reasonable-accommodation-work-design') },
        { title: '職場の不安を、接触点に分けて読む。', href: articleLibraryHref('workplace-contact-decomposition') },
      ],
      deliverables: ['作業分解カード', '配慮前提表', '音の入口', '二週間確認シート'],
    },
    {
      label: '教材 07',
      title: '支援者が動ける組織へ',
      catch: '支援者個人の力量でなく、翻訳・連携・学習が続く条件を見る。',
      useMoment: '支援者の頑張りが属人化し、組織に残らない時',
      output: '翻訳負荷マップ、組織機能診断ミニ、30日改善シート',
      image: '/images/work-condition-lens-support-translation-v1.webp',
      thumbnails: [
        { src: '/images/work-condition-lens-support-translation-v1.webp', alt: '支援者の翻訳負荷を示すインフォグラフィック' },
        { src: '/resources/work-support-transformation/foundational-training.webp', alt: '支援者研修を仕事設計へつなぐ図解' },
        { src: '/songs/still/tomo-ni-tsukuru-mirai.jpg', alt: 'ともに作る未来の音声入口ビジュアル' },
      ],
      href: '/downloads/teaching-library/support-organization-change-kit-v1.html',
      audio: '/songs/audio/tomo-ni-tsukuru-mirai.mp3',
      functions: ['注意', '比喩', '場面', '構造', 'ワーク', '読み下し', '音'],
      expertRead:
        '支援の質は、支援者個人の熱意や知識だけでは決まらない。本人、医療生活、求人、職場、制度を翻訳し続ける機能が、組織の記録、会議、役割、学習に残るかで変わる。',
      expertMoves: [
        '支援者が一人で抱えている翻訳作業を、組織の機能として見える化する。',
        '相談件数やメニュー名ではなく、職場へ戻る情報、役割、学習回路を見る。',
        '30日で変える会議、記録、同行、振り返りを一つ選ぶ。',
      ],
      balance: {
        focus: '支援を、組織の翻訳機能へ戻す',
        coordination:
          '支援機関内で、担当者個人の頑張りを、記録、会議、同行、振り返りの組織条件へ移す。',
        cognition:
          '組織診断ミニ、支援機能マップ、改善会議シートで、抽象的な組織課題を机上で扱える形にする。',
      },
      articles: [
        { title: '支援はある。翻訳が続くかを見る。', href: articleLibraryHref('support-translation') },
        { title: 'マニュアルを増やすより、会議で使える形にする。', href: articleLibraryHref('manual-abundance') },
      ],
      deliverables: ['組織診断ミニ', '支援機能マップ', '改善会議シート', '30日確認'],
    },
    {
      label: 'ツール 08',
      title: '組織自己チェック',
      catch: '点数で組織を裁かず、支援者が動ける条件を話し合う。',
      useMoment: '支援機関やチームで、記録、会議、同行、学習回路の詰まりを見たい時',
      output: '5観点の自己チェック、会議で話す論点、次の30日確認',
      image: '/images/work-condition-lens-support-translation-v1.webp',
      thumbnails: [
        { src: '/images/work-condition-lens-support-translation-v1.webp', alt: '支援者の翻訳負荷を示すインフォグラフィック' },
        { src: '/resources/work-support-transformation/foundational-training.webp', alt: '支援者研修を仕事設計へつなぐ図解' },
        { src: '/images/work-condition-lens-manual-abundance-v1.webp', alt: '資料を会議道具へ変えるインフォグラフィック' },
      ],
      href: '/organizations/diagnosis',
      functions: ['自己チェック', '会議', '記録', '同行', '学習回路'],
      expertRead:
        '支援者が動けるかどうかは、個人の熱意だけでは決まらない。記録、会議、同行、外部連携、振り返りが組織に残るかを見ることで、支援者の翻訳負荷を組織の条件として扱える。',
      expertMoves: [
        'スコアを組織の良し悪しにせず、次に話す観点として扱う。',
        '支援者が一人で抱える翻訳作業を、記録、会議、同行、学習回路へ分ける。',
        '30日で確認できる小さな組織条件を一つ選ぶ。',
      ],
      balance: {
        focus: '支援者の動きにくさを、組織条件として見る',
        coordination:
          '管理職、支援者、研修担当が、支援者個人の頑張りではなく、組織に残る条件を同じ画面で話せるようにする。',
        cognition:
          '短い自己チェックで、抽象的な組織課題を記録、会議、同行、学習回路の観点へ分ける。',
      },
      articles: [
        { title: '支援者が動ける組織か、点数ではなく条件として見る。', href: articleLibraryHref('support-organization-self-check') },
        { title: '支援はある。翻訳が続くかを見る。', href: articleLibraryHref('support-translation') },
      ],
      deliverables: ['5観点チェック', '話し合い論点', '組織条件メモ', '30日確認'],
    },
  ];

  const toolkitProductionRules = [
    ['図解', '関係を一目で置く'],
    ['音楽', '読む前の注意を開く'],
    ['4コマ・動画', '同じ場面を直感で見る'],
    ['ワークショップ', '場で動いて確認する'],
    ['ワークシート', '合意前の条件を書く'],
    ['進行台本', '誰が何を戻すか残す'],
  ];

  const toolkitReaderIntents = [
    {
      label: '相談準備',
      title: '自分の状況を説明しきれない',
      body: 'まず場面と図解で、仕事上共有したい条件だけを取り出す。',
    },
    {
      label: '会議',
      title: '関係者の見ている場面が揃わない',
      body: '同じ場面、役割、確認担当、戻り先を机の上に置く。',
    },
    {
      label: '研修',
      title: '理解で終わらず、次の一手を残したい',
      body: '資料を一枚地図、分ける表、二週間確認へ変える。',
    },
    {
      label: '組織改善',
      title: '支援者の翻訳負荷が属人化している',
      body: '記録、会議、同行、振り返りに残る組織機能として見る。',
    },
  ];

  return (
    <section id="page-flow" className="scroll-mt-24 overflow-x-hidden bg-[#efe9dc] py-16">
      <div className="mx-auto min-w-0 max-w-[18rem] px-5 sm:max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              言葉だけでは届きにくいところへ
            </p>
            <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
              見て、聞いて、笑って、手を動かす。
            </h2>
            <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              多くの言葉や文書では分かりにくいことも、音楽、映像、一緒に手を動かす体験で、同じ場面としてつかみやすくなることがあります。ここでは、働きづらさの問いを「読む」だけでなく、共感できる絵、ふっと笑える場面、気づきを促す音や動き、会議で使うワークへ変えます。
            </p>
          </div>
          <div className="min-w-0 border border-slate-300 bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
              伝わり方を増やす
            </p>
            <h3 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
              読むだけでなく、感じて、試して、残す。
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {toolkitProductionRules.map(([label, body]) => (
                <article key={label} className="border border-white/18 bg-white/8 p-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-cyan-100">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-white">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-6 grid min-w-0 gap-3 lg:grid-cols-[0.92fr_0.54fr_1.08fr]">
          <Link
            href={publicPageHrefById('NS-05')}
            className="group min-w-0 border border-slate-300 bg-white p-5 shadow-sm transition hover:border-cyan-600"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
              文章で深く読む
            </p>
            <h3 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
              問いをひらく記事
            </h3>
            <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
              記事、見出し、本文、補助インフォグラフィックで、社会の問いをじっくり読む。
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
              記事で読む
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </Link>
          <div className="grid min-w-0 place-items-center border border-slate-300 bg-[#fbfaf5] p-5 text-center shadow-sm">
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
              同じ問い
            </p>
            <p className="mt-3 break-all text-lg font-semibold leading-7 text-slate-950 [overflow-wrap:anywhere] md:break-normal">
              見えない負担、配慮名、同じ場面、支援の組織化
            </p>
          </div>
          <a
            href="#prototype-a"
            className="group min-w-0 border border-cyan-700 bg-cyan-950 p-5 text-white shadow-sm transition hover:bg-cyan-900"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
              体験で同じ場面をつかむ
            </p>
            <h3 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
              認知補助ツールキット
            </h3>
            <p className="mt-3 break-all text-sm leading-7 text-white/78 [overflow-wrap:anywhere] md:break-normal">
              図解、音楽、映像、ワークショップ、ワークシート、進行台本で、関係者が同じ場面を話せるようにする。
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 group-hover:text-white">
              ツールで扱う
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </a>
        </section>

        <section className="mt-6 overflow-hidden border border-slate-300 bg-slate-950 text-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-[0.48fr_0.52fr]">
            <div className="relative min-h-[250px] bg-slate-900">
              <img
                src="/songs/still/ganbari-yori-sekkei.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-slate-950/34" />
            </div>
            <div className="p-5 md:p-7">
              <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                音楽で入る
              </p>
              <h3 className="mt-2 break-all text-3xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal">
                WORK UPDATE FEST 2026
              </h3>
              <p className="mt-4 break-all text-base leading-8 text-white/76 [overflow-wrap:anywhere] md:break-normal">
                言葉だけでは届きにくい働き方の問いを、音楽と映像から感じ取る入口です。記事を読む前に、場面の空気、笑い、違和感、ひらめきを共有したい時に使えます。
              </p>
              <Link
                href={workUpdateFestHref}
                className="mt-5 inline-flex items-center gap-2 border border-white/28 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                音楽フェスを開く
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 border border-slate-300 bg-white p-5 shadow-sm md:p-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              体験の入口を選ぶ
            </p>
            <h3 className="mt-2 break-all text-2xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
              どの場で、見て、聞いて、手を動かしたいか。
            </h3>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {toolkitReaderIntents.map((intent) => (
              <article key={intent.label} className="border border-slate-200 bg-[#fbfaf5] p-4">
                <p className="text-xs font-semibold tracking-[0.12em] text-cyan-800">
                  {intent.label}
                </p>
                <h4 className="mt-2 text-base font-semibold leading-snug tracking-normal text-slate-950">
                  {intent.title}
                </h4>
                <p className="mt-2 text-sm leading-7 text-slate-700">{intent.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div id="prototype-a" className="mt-8 scroll-mt-24">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                キット一覧
              </p>
              <h3 className="mt-2 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                近いテーマを選んで、すぐ開く。
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-700">
              各キットは、図解、場面、音、ワーク、進行台本をまとめた入口です。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cognitiveToolkitPackages.map((pack) => (
              <article key={pack.title} className="flex h-full flex-col border border-slate-300 bg-white shadow-sm">
                <div className="grid h-60 min-h-0 grid-cols-[1.58fr_1fr] gap-2 overflow-hidden border-b border-slate-200 bg-[#fbfaf5] p-2">
                  <div className="min-h-0 overflow-hidden border border-slate-200 bg-white">
                    <img
                      src={pack.thumbnails[0].src}
                      alt={pack.thumbnails[0].alt}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="grid min-h-0 grid-rows-2 gap-2">
                    {pack.thumbnails.slice(1).map((thumbnail) => (
                      <div key={thumbnail.src} className="min-h-0 overflow-hidden border border-slate-200 bg-white">
                        <img
                          src={thumbnail.src}
                          alt={thumbnail.alt}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                    {pack.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
                    {pack.title}
                  </h3>
                  <p className="mt-4 border-l-4 border-cyan-800 bg-cyan-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                    {pack.catch}
                  </p>
                  <article className="mt-4 border border-cyan-100 bg-cyan-50 px-3 py-2">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-cyan-800">
                      使う場面
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                      {pack.useMoment}
                    </p>
                  </article>
                  <div className="mt-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                      実物
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[...pack.deliverables, pack.output].map((item) => (
                        <span
                          key={item}
                          className="border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <details className="mt-4 border border-slate-200 bg-[#fbfaf5] p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-cyan-900">
                      同じテーマを記事で読む
                    </summary>
                    <div className="mt-3 grid gap-2">
                      {pack.articles.map((article) => (
                        <Link
                          key={article.href}
                          href={article.href}
                          className="inline-flex items-center justify-between gap-3 border border-slate-300 bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-800 transition hover:border-cyan-700 hover:text-cyan-900"
                        >
                          <span>{article.title}</span>
                          <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </details>
                  {'audio' in pack ? (
                    <a
                      href={pack.audio}
                      className="mt-4 inline-flex w-fit items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-700 hover:text-cyan-900"
                    >
                      音の入口を開く
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  ) : null}
                  <a
                    href={pack.href}
                    className="mt-5 inline-flex w-fit items-center gap-2 border border-cyan-700 bg-cyan-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
                  >
                    キットを開く
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="border border-slate-300 bg-white p-5 shadow-sm md:p-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              使い方
            </p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
              近いテーマを選び、同じ場面を見て、ワークで一手にする。
            </h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ['1', '近いテーマを選ぶ', '病名や制度名ではなく、いま話したい場面に近い教材を選ぶ。'],
                ['2', 'キットを開く', '図解、マンガ、音、読み下しを見て、関係者が同じ場面を持つ。'],
                ['3', 'ワークで確認する', '次の会議や研修で、確認する条件と役割を一つに絞る。'],
              ].map(([step, title, body]) => (
                <article key={step} className="border border-slate-200 bg-[#fbfaf5] p-4">
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                    STEP {step}
                  </p>
                  <h4 className="mt-2 text-base font-semibold leading-snug tracking-normal text-slate-950">
                    {title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="border border-rose-200 bg-white p-5 shadow-sm md:p-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-rose-700">
              境界
            </p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
              教材は判断ではなく、場面共有の入口です。
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              このページは教材・研修・会議補助です。個別の就労可否、医学判断、法的判断、合理的配慮の妥当性判断を行うものではありません。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicConditionWindowContent() {
  return (
    <section id="page-flow" className="scroll-mt-24 bg-[#f7f3e8] py-12">
      <div className="mx-auto w-full max-w-[22rem] box-border px-5 sm:max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.62fr_1.38fr]">
          <div className="min-w-0 border border-slate-300 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
              このページの使い方
            </p>
            <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:break-normal md:text-5xl">
              障害種類・疾病名から、職場条件へ。
            </h2>
            <p className="mt-5 break-all text-base leading-8 text-white/78 [overflow-wrap:anywhere] md:break-normal">
              発達障害、精神障害、難病、内部障害などの名前から調べ始めた時に、特性理解だけで止めず、時間、情報、環境、動線、評価、支援の条件を確認できるようにします。
            </p>
          </div>

          <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {publicConditionWindowFlow.map((step) => (
              <article key={step.label} className="min-w-0 border border-slate-300 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                  {step.label}
                </p>
                <h3 className="mt-2 break-all text-xl font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                  {step.title}
                </h3>
                <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-8">
          <div className="grid gap-6 lg:grid-cols-[0.34fr_1.66fr]">
            <aside className="min-w-0 border border-slate-300 bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                障害種類別の見取り図
              </p>
              <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
                10分類を、職場で確認できる条件へつなぐ。
              </h2>
              <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                各分類で見えやすい職場上の論点を、本人だけの問題にせず、情報、時間、動線、相談先、評価、支援の条件として整理します。
              </p>
              <div className="mt-5 grid gap-2">
                {publicConditionWindowCards.map((card) => (
                  <a
                    key={`nav-${card.slug}`}
                    href={`#condition-${card.slug}`}
                    className="group flex items-start gap-3 border border-slate-200 bg-[#fbfaf5] px-3 py-2 text-sm transition hover:border-cyan-700 hover:bg-cyan-50"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 bg-cyan-700 transition group-hover:bg-cyan-950" />
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-950">{card.examples}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-600">{card.label}</span>
                    </span>
                  </a>
                ))}
              </div>
            </aside>

            <div className="grid min-w-0 gap-7">
              {publicConditionWindowCards.map((card) => (
                <PublicConditionWindowInfographic key={card.examples} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 border border-slate-300 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.5fr_1.5fr]">
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                次の読み方
              </p>
              <h2 className="mt-3 break-all text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal md:text-4xl">
                見えた論点に合わせて、次の入口を選ぶ。
              </h2>
              <p className="mt-5 break-all text-base leading-8 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                相談を深めたい、研修で使いたい、職場の場面で見たい、社会全体の働き方にも広げたい。目的に合わせて、同じ仕事条件の地図を別の入口から読めます。
              </p>
            </div>
            <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-5">
              {publicConditionWindowRouteCards.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.title}
                    href={route.href}
                    className="group flex min-h-[250px] flex-col border border-slate-300 bg-[#fbfaf5] p-4 transition hover:border-cyan-500 hover:bg-cyan-50/50"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-cyan-800">
                      {route.label}
                    </p>
                    <h3 className="mt-2 break-all text-lg font-semibold leading-snug tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                      {route.title}
                    </h3>
                    <p className="mt-3 flex-1 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                      {route.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                      開く
                      <ArrowRight size={15} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8 border border-rose-200 bg-rose-50 p-5 text-slate-900 shadow-sm md:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-rose-700" size={20} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[0.12em] text-rose-700">
                このページの範囲
              </p>
              <h2 className="mt-2 break-all text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:break-normal">
                個別判断は、必要な確認へ分ける。
              </h2>
              <p className="mt-3 break-all text-sm leading-7 text-slate-700 [overflow-wrap:anywhere] md:break-normal">
                ここでは病名・障害名から支援策、就労可否、医学判断、法的判断、合理的配慮妥当性を直接決めません。実際の対応は、本人の状況、仕事、環境、支援、時間、制度、必要な専門確認に分けて扱います。
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function PublicAboutContent() {
  const aboutFacts = [
    {
      label: '名称',
      title: 'Next Being Lab（NBL）',
      body: 'インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです。',
    },
    {
      label: '目的',
      title: '仕事設計と社会設計へ広げる',
      body: '働きづらさを、人、仕事、環境、支援、時間、制度の関係として読み直します。',
    },
  ];

  const operationPoints = [
    {
      label: '1',
      title: '公開情報を使う',
      body:
        '調査研究報告、マニュアル、合理的配慮事例集、雇用事例集、海外の情報提供サイト、制度などを、出典の性質と限界ごとに分けます。',
    },
    {
      label: '2',
      title: '関係として読む',
      body:
        '病名、障害種類、配慮名、制度語を結論にせず、本人、仕事、環境、支援、時間、制度の相互作用として読み直します。',
    },
    {
      label: '3',
      title: '使える入口へ戻す',
      body:
        'AIは整理、下書き、複数の読み筋、図解や教材への変換を支える補助として使います。最終判断者にはしません。',
    },
  ];

  const welcomeTopics = [
    '企業・支援機関との共同検討',
    '研修・教材・記事企画の相談',
    '研究、政策、社会発信に関する連携',
  ];

  const boundaryCards = [
    {
      title: '病名・障害名から支援策へ直行しません',
      body: '診断名や障害種類は入口情報です。同じ名前から同じ仕事条件や配慮を決めることはできません。',
    },
    {
      title: '個別相談や緊急相談の受付ではありません',
      body: '病状、職場事情、制度利用、配慮内容を入力して回答を得る場所ではありません。',
    },
    {
      title: '医学・法務・雇用判断をしません',
      body: '医学的判断、法的判断、就労可否、合理的配慮の妥当性判断、採用や配置の判断は扱いません。',
    },
    {
      title: 'AIを最終判断者にしません',
      body: 'AIは文章、図解、複数仮説、確認観点を整える補助です。人や組織の判断を置き換えません。',
    },
  ];

  return (
    <section id="page-flow" className="scroll-mt-24 bg-[#efe9dc] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <section className="overflow-hidden border border-slate-300 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="bg-slate-950 p-6 text-white md:p-8 lg:p-10">
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-100">
                基本情報
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal md:text-5xl">
                NBLは、実践知を仕事設計へつなぐ知識プラットフォームです。
              </h2>
              <div className="mt-6 space-y-4">
                {aboutFacts.map((item) => (
                  <article key={item.label} className="border border-white/16 bg-white/8 p-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-cyan-100">
                      {item.label}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-normal text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-white/76">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="bg-[#fbfaf5] p-6 md:p-8 lg:p-10">
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                創設者
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
                {founderProfile.name}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-cyan-900">
                {founderProfile.role}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{founderProfile.credential}</p>
              <p className="mt-5 text-base leading-8 text-slate-700">{founderProfile.summary}</p>
              <p className="mt-5 border border-cyan-200 bg-cyan-50 p-4 text-sm leading-7 text-slate-700">
                NBLは創設者個人への属人的な個別相談窓口ではなく、知識、方法論、共有資源、AI活用を育てる場として運営します。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={founderProfile.researchProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-400"
                >
                  {founderProfile.researchProfileLabel}
                  <ExternalLink size={15} />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  お問い合わせへ
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 border border-slate-300 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.62fr_1.38fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                どう運営しているか
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
                情報を集めて終わらせず、仕事条件として読み直します。
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {operationPoints.map((step) => (
                <article key={step.title} className="border border-slate-300 bg-[#fbfaf5] p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-800">
                    {step.label}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug tracking-normal text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="border border-cyan-200 bg-cyan-50 p-5 shadow-sm md:p-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              連絡先
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
              連携・お問い合わせは、NBLの窓口へ。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              NBLの活動、記事、教材、研修、共同検討についてのご連絡は、お問い合わせフォームまたはメールで受け付けています。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                お問い合わせフォーム
                <ArrowRight size={15} />
              </Link>
              <a
                href="mailto:info@nextbeinglab.org"
                className="inline-flex items-center gap-2 rounded-md border border-cyan-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-500"
              >
                info@nextbeinglab.org
              </a>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-700">
              個別の医学判断、法的判断、採用・配置判断、緊急相談を受け付ける窓口ではありません。
            </p>
          </div>
          <div className="border border-slate-300 bg-white p-5 shadow-sm md:p-6">
            <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
              話し始めやすいテーマ
            </p>
            <div className="mt-5 grid gap-3">
              {welcomeTopics.map((topic) => (
                <div key={topic} className="flex items-start gap-3 border border-slate-200 bg-[#fbfaf5] p-4">
                  <CheckCircle2 className="mt-1 shrink-0 text-cyan-800" size={18} aria-hidden="true" />
                  <p className="text-base font-semibold leading-7 text-slate-950">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 border border-rose-200 bg-rose-50 p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.56fr_1.44fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-rose-700">
                信頼のための境界
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
                扱わない判断を、先に明確にします。
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {boundaryCards.map((card) => (
                <article key={card.title} className="border border-rose-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-rose-700 text-white">
                      <ShieldCheck size={16} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug tracking-normal text-slate-950">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{card.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 border border-slate-300 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-5 md:grid-cols-[0.86fr_1.14fr] md:items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
                関連ページ
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-4xl">
                使う入口と、背景にある考え方へ。
              </h2>
            </div>
            <div>
              <p className="text-sm leading-7 text-slate-700">
                何を読むかは全体入口で、なぜこの見方が可能なのかは「理論と発見」で確認できます。公開中のNBLについてページも、基本情報の参照先として残しています。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={previewBase}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  全体入口へ
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href={publicPageHrefById('NS-07')}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-400"
                >
                  理論と発見へ
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-cyan-400"
                >
                  公開中のNBLについて
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function PublicDetailContent({ page }: { page: NextSiteCandidatePage }) {
  if (page.id === 'NS-02') return <PublicMapContent />;
  if (page.id === 'NS-03') return <PublicToolsContent />;
  if (page.id === 'NS-04') return <PublicStudioContent />;
  if (page.id === 'NS-05') return <PublicPolicyContent />;
  if (page.id === 'NS-06') return <PublicPartnershipContent />;
  if (page.id === 'NS-07') return <PublicAssessmentConceptContent />;
  if (page.id === 'NS-08') return <PublicAboutContent />;
  if (page.id === 'NS-09') return <PublicConditionWindowContent />;
  return <PublicOutputPanel />;
}

function PublicNextPagePanel({ page }: { page: NextSiteCandidatePage }) {
  if (page.id === 'NS-08') return null;

  const flow = publicDetailFlowPanels[page.id];
  const currentIndex = nextSiteCandidatePages.findIndex((candidate) => candidate.id === page.id);
  const routeNext = nextSiteCandidatePages[(currentIndex + 1) % nextSiteCandidatePages.length];
  const suggestedNext = flow
    ? nextSiteCandidatePages.find((candidate) => candidate.id === flow.nextTargetId)
    : routeNext;
  const topPage = nextSiteCandidatePages[0];

  return (
    <section className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-cyan-800">
            次に読む
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
            このページの理解を、次の場面へ移す。
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {suggestedNext && (
            <Link
              href={getNextNblPreviewHref(suggestedNext)}
              className="group border border-slate-300 bg-[#fbfaf5] p-5 transition hover:border-cyan-500 hover:bg-white"
            >
              <p className="text-sm font-semibold text-cyan-800">{flow?.nextLabel ?? '次のページへ'}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
                {getPublicCopy(suggestedNext).label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {getPublicCopy(suggestedNext).lead}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                開く
                <ArrowRight size={15} />
              </span>
            </Link>
          )}
          <Link
            href={getNextNblPreviewHref(topPage)}
            className="group border border-slate-300 bg-white p-5 transition hover:border-cyan-500"
          >
            <p className="text-sm font-semibold text-slate-500">入口に戻る</p>
            <h3 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
              はじめに
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              診断名・障害の種類から仕事条件へ、という全体の読み順に戻ります。
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
              戻る
              <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NextNblStaticSiteHomeCandidate({ routeBase = previewBase }: { routeBase?: string } = {}) {
  const topPage = nextSiteCandidatePages[0];

  return (
    <PublicShell currentId={topPage.id} routeBase={routeBase}>
      <main>
        <PublicHero page={topPage} overview />
        <PublicHomeOneGlancePanel />
        <PublicHomeConditionWindowPanel />
        <PublicHomeProductMapPanel />
        <PublicHomeSpecialSeriesFeature />
        <PublicSocialKnowledgeLoopPanel />
        <PublicHomeBoundaryStrip />
      </main>
    </PublicShell>
  );
}

function DetailReaderStrip({ page }: { page: NextSiteCandidatePage }) {
  const cards =
    detailReaderCards[page.id] ?? [
      {
        icon: Sparkles,
        label: 'このページで得られるもの',
        title: page.label,
        body: page.pagePromise,
      },
      {
        icon: Wrench,
        label: '使える場面',
        title: page.audience,
        body: page.lead,
      },
      {
        icon: ShieldCheck,
        label: 'これはしない',
        title: '個別判断にしない',
        body: page.boundary,
      },
    ];

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 md:grid-cols-3">
        {cards.map((item) => {
          const SmallIcon = item.icon;
          return (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5">
              <SmallIcon size={19} className="text-cyan-800" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PageSectionList({ page }: { page: NextSiteCandidatePage }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-800">
            このページでできること
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
            {page.pagePromise}
          </h2>
          <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
            <p>
              <span className="font-semibold text-slate-950">読む人: </span>
              {page.audience}
            </p>
            <p>
              <span className="font-semibold text-slate-950">素材の状態: </span>
              {page.sourceStatus}
            </p>
            <p>
              <span className="font-semibold text-slate-950">扱わないこと: </span>
              {page.boundary}
            </p>
          </div>
        </aside>
        <div className="space-y-4">
          {page.sections.map((section, index) => (
            <article key={section.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="text-2xl font-semibold tracking-normal text-slate-950">
                  {section.label}
                </h3>
              </div>
              <p className="mt-4 text-base leading-8 text-slate-700">{section.body}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {section.bullets.map((bullet) => (
                  <p key={bullet} className="rounded-lg border border-slate-200 bg-[#f7f3e8] p-4 text-sm leading-7 text-slate-700">
                    {bullet}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NextNblStaticSitePageCandidate({
  page,
  routeBase = previewBase,
}: {
  page: NextSiteCandidatePage;
  routeBase?: string;
}) {
  return (
    <PublicShell currentId={page.id} routeBase={routeBase}>
      <main>
        <PublicHero page={page} />
        <PublicDetailIntro page={page} />
        <PublicDetailContent page={page} />
        <PublicNextPagePanel page={page} />
        <PublicBoundaryPanel />
      </main>
    </PublicShell>
  );
}

export function NextNblStaticSiteNotFound({ routeBase = previewBase }: { routeBase?: string } = {}) {
  return (
    <PublicShell routeBase={routeBase}>
      <main className="mx-auto max-w-3xl px-5 py-24">
        <Sparkles className="text-cyan-800" size={32} />
        <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">
          ページが見つかりません
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          指定されたページは、このプレビューにはありません。
        </p>
        <Link
          href={previewBase}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          トップへ戻る
          <ArrowRight size={15} />
        </Link>
      </main>
    </PublicShell>
  );
}

export const nextNblStaticCandidateSummary = {
  title: nextSiteCandidateBundleIntro.title,
  previewBase,
  pageCount: nextSiteCandidatePages.length,
  routeHrefs: nextSiteCandidatePages.map((page) => getNextNblPreviewHref(page)),
  publicRouteHrefs: nextSiteCandidatePages.map((page) => getNextNblPublicHref(page)),
};
