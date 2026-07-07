import NextLink from 'next/link';
import {
  ArrowRight,
  FileText,
  FileSearch,
  Layers3,
  MessagesSquare,
  Newspaper,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { nblVirtualNewsArticles } from '@/lib/content/nblVirtualNews';
import { nblVirtualNewsRealitySignals } from '@/lib/content/nblVirtualNewsRealitySignals';

const navItems = [
  { href: '/', label: 'トップ' },
  { href: '/virtual-news', label: 'バーチャルニュース' },
  { href: '/work-design-views-guide', label: '設計ガイド' },
  { href: '/case-readings', label: '相談事例' },
  { href: '/articles-social-questions', label: 'NBLレポート' },
  { href: '/toolkit-studio', label: 'ツールキット' },
  { href: '/work-condition-window', label: '障害種類から見る' },
  { href: '/theory-method-trust', label: 'NBLの専門性' },
  { href: '/projects', label: 'プロジェクト' },
  { href: '/about-boundary', label: 'サイト情報' },
] as const;

const primaryNavItems = navItems.filter((item) =>
  [
    '/',
    '/virtual-news',
    '/work-design-views-guide',
    '/case-readings',
    '/articles-social-questions',
    '/toolkit-studio',
  ].includes(item.href),
);

const roleCards = [
  {
    title: '現実課題に、いちばん近い専門知デモ',
    body: '制度、職場運用、地域連携、予算、相談線の詰まりを、本人だけの問題に閉じず、仕事条件の関係として読み替えます。',
    icon: Newspaper,
  },
  {
    title: '実在ニュースではなく、実装条件の模型',
    body: 'まだ十分に実現していない取り組みを、関係者、手順、費用、記録、見直しが見える架空記事として置きます。',
    icon: Sparkles,
  },
  {
    title: '読後に、相談・設計・会議へ戻す',
    body: '記事で終わらせず、仕事設計ガイド、相談事例、課題地図、ツールキットへ戻れるようにしています。',
    icon: Network,
  },
] as const;

const hubHeroImage = {
  src: '/images/nbl-virtual-news/virtual-news-field-reporting-hero-v1.png',
  alt: '現場で記者とカメラマンが仕事条件の変化を取材しているNBLバーチャルニュースの写真',
  caption:
    '現場で記者とカメラマンが、仕事の手順、道具、情報共有、参加の変化を取材する場面。相談室ではなく、社会の現場から問いを受け取り、仕事条件として読み直す。',
} as const;

const boundaryCards = [
  {
    title: '実在ニュースではありません',
    body: '記事は架空の実装ニュースです。実在企業、自治体、制度、統計、助成金、現行政策の説明や保証ではありません。',
  },
  {
    title: '判断記事ではありません',
    body: '個別相談、医療判断、法的判断、人事判断、就労可否、合理的配慮の妥当性判断は扱いません。',
  },
  {
    title: '確認する条件を増やします',
    body: '記事の役割は、関係者が仕事条件、役割分担、相談線、予算、見直し時点を話しやすくすることです。',
  },
] as const;

const priorityVirtualNewsArticleSlugs = [
  'public-awareness-employment-campaign',
  'employment-burden-assessment-subsidy-special-zone',
  'japanese-ips-integrated-employment-support',
] as const;

const priorityVirtualNewsArticles = priorityVirtualNewsArticleSlugs
  .map((slug) => nblVirtualNewsArticles.find((article) => article.slug === slug))
  .filter((article): article is (typeof nblVirtualNewsArticles)[number] => Boolean(article));

function RealitySignalsSection() {
  return (
    <section className="border-b border-teal-100 bg-[#eef5f1]" id="virtual-news-reality-signals">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
              Reality signals
            </p>
            <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
              バーチャルニュースに近づいた実ニュース。
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              架空記事を読んだあとで、現実の職場運用にも近い芽が見えた時は、ここで静かに祝います。
              評価や認定ではなく、次に読む仕事条件を見つけるためのメモです。
            </p>
          </div>
          <div className="grid gap-4">
            {nblVirtualNewsRealitySignals.map((signal) => (
              <article
                className="rounded-lg border border-teal-200 bg-white p-5 shadow-sm"
                data-virtual-news-reality-signal
                key={signal.id}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-950">
                    {signal.dateLabel}
                  </span>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-950">
                    {signal.sourceStatusLabel}
                  </span>
                </div>
                <h3 className="mt-4 break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                  {signal.headline}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-teal-900">
                  Source: {signal.sourceName}
                </p>
                <p className="mt-3 text-base leading-8 text-slate-700">{signal.nblReading}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {signal.workConditionTags.map((tag) => (
                    <span
                      className="rounded-full border border-slate-200 bg-[#fbfaf5] px-3 py-1 text-xs font-semibold text-slate-700"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-7 text-amber-950">
                  {signal.boundary}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <NextLink
                    className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-950"
                    href={signal.relatedVirtualArticle.href}
                  >
                    {signal.relatedVirtualArticle.label}
                    <ArrowRight size={15} />
                  </NextLink>
                  <NextLink
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href={signal.sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    原文を開く
                    <ArrowRight size={15} />
                  </NextLink>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {signal.relatedVirtualArticle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AxiomVirtualNewsHubPage() {
  return (
    <div className="nbl-public-preview axiom-public-candidate min-h-screen w-full max-w-[100vw] overflow-x-hidden break-words bg-[#fbfaf5] text-slate-950 [overflow-wrap:anywhere] [&_*]:min-w-0">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbfaf5]/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <NextLink href="/" className="flex shrink-0 flex-col leading-tight">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-teal-800">
              Next Being Lab
            </span>
            <span className="text-sm font-semibold text-slate-950">仕事条件で読む</span>
          </NextLink>
          <nav
            aria-label="NBL site navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
          >
            {primaryNavItems.map((item) => (
              <NextLink
                aria-current={item.href === '/virtual-news' ? 'page' : undefined}
                className={`whitespace-nowrap border-b-2 px-2.5 py-1.5 text-[13px] transition xl:px-3 xl:text-sm ${
                  item.href === '/virtual-news'
                    ? 'border-teal-800 text-slate-950'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </NextLink>
            ))}
          </nav>
          <form
            action="/search"
            className="hidden w-[min(23vw,270px)] min-w-[190px] shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm lg:flex"
          >
            <FileSearch className="shrink-0 text-teal-800" size={15} />
            <input
              aria-label="サイト内検索"
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              name="q"
              placeholder="サイト内検索"
              type="search"
            />
            <button
              className="shrink-0 rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white"
              type="submit"
            >
              検索
            </button>
          </form>
          <details className="group relative hidden lg:block">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-500 hover:text-teal-950 [&::-webkit-details-marker]:hidden">
              <Layers3 size={15} />
              全ページ
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <nav aria-label="NBL site all pages" className="grid p-2">
                {navItems.map((item) => (
                  <NextLink
                    aria-current={item.href === '/virtual-news' ? 'page' : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      item.href === '/virtual-news'
                        ? 'bg-teal-50 text-teal-950'
                        : 'text-slate-700 hover:bg-[#fbfaf5] hover:text-teal-950'
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </NextLink>
                ))}
              </nav>
            </div>
          </details>
        </div>
        <nav
          aria-label="NBL site mobile navigation"
          className="flex max-w-full gap-2 overflow-x-auto border-t border-slate-200 px-5 py-2 lg:hidden [scrollbar-width:none]"
        >
          <NextLink
            className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-2 py-1.5 text-[13px] font-semibold text-teal-800"
            href="/search"
          >
            検索
          </NextLink>
          {primaryNavItems.map((item) => (
            <NextLink
              aria-current={item.href === '/virtual-news' ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap border-b-2 px-2 py-1.5 text-[13px] ${
                item.href === '/virtual-news'
                  ? 'border-teal-800 text-slate-950'
                  : 'border-transparent text-slate-600'
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-[#eef5f1]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                NBL Virtual News
              </p>
              <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-6xl">
                NBLバーチャル・ニュース
              </h1>
              <p className="mt-6 max-w-3xl text-xl font-semibold leading-9 text-teal-950">
                現実の課題を、仕事条件のニュース像として先に読む。
              </p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 md:text-lg">
                NBLバーチャル・ニュースは、いま現場や制度の間に残っている難問を、
                実装された未来の架空記事として読む入口です。診断名や制度名だけで答えを出さず、
                本人、仕事、環境、支援、時間、評価、予算、相談線の関係へ戻します。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <NextLink
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-950"
                  href="#virtual-news-priority-themes"
                >
                  注目テーマを読む
                  <ArrowRight size={16} />
                </NextLink>
                <NextLink
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                  href="#virtual-news-library"
                >
                  記事一覧へ
                </NextLink>
              </div>
            </div>
            <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
              <img
                alt={hubHeroImage.alt}
                className="aspect-[16/10] w-full object-cover"
                src={hubHeroImage.src}
              />
              <figcaption className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
                {hubHeroImage.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 md:py-14">
            <div className="grid gap-4 md:grid-cols-3">
              {roleCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-5"
                    key={card.title}
                  >
                    <Icon className="text-teal-800" size={20} />
                    <h2 className="mt-4 text-xl font-semibold leading-7 tracking-normal text-slate-950">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="border-b border-teal-100 bg-[#eef5f1]"
          id="virtual-news-priority-themes"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 md:py-18">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                  Priority themes
                </p>
                <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
                  雇用から、企業経営と社会設計へ広がる3本。
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-700 md:text-lg">
                18本の中から、障害者雇用を人数や個別対応に閉じず、企業の経営改善、社会の認識、
                地域の支援線の設計へ発展させるビジョンが見える記事を先に置きます。
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {priorityVirtualNewsArticles.map((article, index) => (
                <article
                  className="overflow-hidden rounded-lg border border-teal-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
                  data-virtual-news-priority-card
                  key={article.slug}
                >
                  <NextLink className="group block h-full" href={article.path}>
                    <img
                      alt={article.heroImage.alt}
                      className="aspect-[16/9] w-full object-cover"
                      loading="lazy"
                      src={article.heroImage.src}
                    />
                    <div className="flex h-full flex-col p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-950">
                          重点テーマ {index + 1}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {article.readingTime}
                        </span>
                      </div>
                      <h3 className="mt-4 break-words text-xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                        {article.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{article.dek}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
                        重点記事を読む
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </NextLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-[#fbfaf5]" id="virtual-news-library">
          <div className="mx-auto max-w-7xl px-5 py-14 md:py-18">
            <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                  Article library
                </p>
                <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-5xl">
                  実装されたらニュースになる課題から読む。
                </h2>
              </div>
              <p className="text-base leading-8 text-slate-700 md:text-lg">
                制度、職場運用、地域連携、相談線、予算、評価。架空ニュースの形で、まだ見えにくい実装条件を具体的に読みます。
                読後は設計ガイド、相談事例、NBLレポート、ツールキットへ戻せます。
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {nblVirtualNewsArticles.map((article) => (
                <article
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                  data-virtual-news-hub-card
                  key={article.slug}
                >
                  <NextLink className="group block h-full" href={article.path}>
                    <img
                      alt={article.heroImage.alt}
                      className="aspect-[16/9] w-full object-cover"
                      loading="lazy"
                      src={article.heroImage.src}
                    />
                    <div className="flex h-full flex-col p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-semibold text-teal-900">
                          {article.issueLabel}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {article.readingTime}
                        </span>
                      </div>
                      <h3 className="mt-4 break-words text-xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere]">
                        {article.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{article.subtitle}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
                        記事を読む
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </NextLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RealitySignalsSection />

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                Boundary
              </p>
              <h2 className="mt-3 break-words text-3xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-4xl">
                ニュース形式でも、判断はしない。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-700">
                読者が現場で使うときは、実在ニュースとしてではなく、関係者が確認する条件を増やすための素材として扱います。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {boundaryCards.map((card) => (
                <article
                  className="rounded-lg border border-amber-200 bg-amber-50 p-5"
                  key={card.title}
                >
                  <ShieldCheck className="text-amber-800" size={20} />
                  <h3 className="mt-4 text-lg font-semibold leading-7 tracking-normal text-amber-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-amber-950/84">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-3">
            <NextLink
              className="group rounded-lg border border-white/15 bg-white/10 p-5 transition hover:bg-white/20"
              href="/scene-entry"
            >
              <MessagesSquare className="text-amber-100" size={20} />
              <h2 className="mt-4 text-xl font-semibold tracking-normal">8つの課題の地図</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                NBLが扱う問題空間を、体系的な地図として確認する。
              </p>
            </NextLink>
            <NextLink
              className="group rounded-lg border border-white/15 bg-white/10 p-5 transition hover:bg-white/20"
              href="/articles-social-questions"
            >
              <FileText className="text-amber-100" size={20} />
              <h2 className="mt-4 text-xl font-semibold tracking-normal">NBLレポート</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                ニュース型より深い論考、解説、批評として読む。
              </p>
            </NextLink>
            <NextLink
              className="group rounded-lg border border-white/15 bg-white/10 p-5 transition hover:bg-white/20"
              href="/toolkit-studio"
            >
              <Layers3 className="text-amber-100" size={20} />
              <h2 className="mt-4 text-xl font-semibold tracking-normal">ツールキット</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                会議、研修、共有で使う素材棚として使う。
              </p>
            </NextLink>
          </div>
        </section>
      </main>
    </div>
  );
}
