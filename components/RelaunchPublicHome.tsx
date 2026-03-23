import Link from 'next/link';
import { ArrowRight, Sparkles, Waypoints } from 'lucide-react';
import { Noto_Sans_JP } from 'next/font/google';
import {
  relaunchPublicFirstVisitPaths,
  relaunchPublicHero,
  relaunchPublicLenses,
  relaunchPublicManifesto,
  relaunchPublicQuestionPaths,
  relaunchPublicStreams,
} from '@/lib/content/relaunchPublicHome';

const display = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
});

type RelaunchPublicHomeProps = {
  reviewLink?: string;
};

export default function RelaunchPublicHome({ reviewLink }: RelaunchPublicHomeProps) {
  const showReviewTools = Boolean(reviewLink);
  const resolveHref = (item: { href: string; publicHref?: string }) =>
    showReviewTools ? item.href : (item.publicHref ?? item.href);
  const topQuickLinks = relaunchPublicStreams.filter((stream) =>
    ['what-we-do', 'methods', 'resources'].includes(stream.id),
  );
  const navigationLinks = [
    { label: 'What We Do', href: showReviewTools ? '/review/what-we-do' : '/what-we-do' },
    { label: 'About', href: showReviewTools ? '/review/about' : '/about' },
    {
      label: 'Operating Model',
      href: showReviewTools ? '/review/operating-loops' : '/operating-model',
    },
    {
      label: 'Resources',
      href: showReviewTools ? '/review/resources-first-release' : '/resources',
    },
  ];
  const stanceLinks = [
    {
      title: 'この姿勢の背景',
      detail: 'なぜこの方向へ向かうのか、NBLの本丸を読む。',
      href: showReviewTools ? '/review/about' : '/about',
    },
    {
      title: 'AI経営と判断境界',
      detail: 'どこまでAIが進め、どこで人が止めるかを見る。',
      href: showReviewTools ? '/review/operating-loops' : '/operating-model',
    },
    {
      title: '残していく成果物',
      detail: '地図、手順、公開資源をどう積み上げるかを見る。',
      href: showReviewTools ? '/review/what-we-do' : '/what-we-do',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.14),_transparent_24%),radial-gradient(circle_at_85%_10%,_rgba(245,158,11,0.12),_transparent_20%),linear-gradient(180deg,_rgba(255,255,255,0.25)_0%,_transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.25),transparent_82%)]" />

      <main className="relative mx-auto max-w-[90rem] px-6 pb-20 pt-6 md:pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">
              AI時代の人間参加を設計し直す研究と実装のスタジオ
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
            {showReviewTools ? (
              <Link
                href={reviewLink ?? '/review'}
                className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:text-slate-950"
              >
                Review Index
              </Link>
            ) : null}
            {showReviewTools ? (
              <Link
                href="/review/showcase-direction"
                className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900 transition hover:border-cyan-300 hover:bg-cyan-100"
              >
                Showcase Direction
              </Link>
            ) : null}
          </div>
        </header>

        <section className="grid gap-8 pb-10 pt-12 xl:grid-cols-[minmax(0,1.12fr)_360px] xl:items-start xl:pb-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-800">
              {relaunchPublicHero.eyebrow}
            </p>
            <h1
              className={`mt-5 max-w-5xl text-4xl leading-[1.08] text-slate-950 md:text-6xl ${display.className}`}
            >
              {relaunchPublicHero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              {relaunchPublicHero.subheadline}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
              {relaunchPublicHero.supportingCopy}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {relaunchPublicHero.primaryCta}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/jac-foundations"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white/80 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:border-cyan-400 hover:bg-white"
              >
                {relaunchPublicHero.secondaryCta}
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-5 max-w-3xl rounded-[1.4rem] border border-cyan-200 bg-cyan-50/80 px-4 py-4 text-sm leading-7 text-slate-700">
              {relaunchPublicHero.operatingNote}
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-slate-700">
              <Sparkles size={16} />
              いま見られるもの
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              まずはこの3つを見ると、NBLが何をしていて、どこまで公開されているかがつかめます。
            </p>
            <div className="mt-4 space-y-3">
              {topQuickLinks.map((item) => (
                <Link
                  key={item.title}
                  href={resolveHref(item)}
                  className="block rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <p className="text-base font-black text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.detail}</p>
                </Link>
              ))}
            </div>
            <div className="mt-5 rounded-[1.4rem] border border-cyan-200 bg-cyan-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-900">
                Human-in-Command
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                最終的な公開約束と高リスク判断は人が持ちます。
              </p>
            </div>
          </aside>
        </section>

        <section
          id="public-entry"
          className="grid gap-6 border-t border-stone-300/80 py-10 xl:grid-cols-[minmax(280px,0.76fr)_minmax(0,1.24fr)]"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              公開中の入口
            </p>
            <h2
              className={`mt-3 text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
            >
              ここから入れば、何をしているかが分かる。
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {relaunchPublicFirstVisitPaths.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-[1.8rem] border p-6 shadow-sm ${
                  index === 0
                    ? 'border-sky-200 bg-sky-50/80'
                    : index === 1
                      ? 'border-emerald-200 bg-emerald-50/70'
                      : 'border-amber-200 bg-amber-50/70'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {item.audience}
                </p>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:bg-white hover:text-slate-950"
                >
                  {item.cta}
                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 border-t border-stone-300/80 py-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <article className="rounded-[2.2rem] border border-stone-300 bg-white/90 p-8 shadow-[0_24px_100px_-50px_rgba(15,23,42,0.45)]">
            <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">NBLの基本姿勢</p>
            <h2
              className={`mt-5 max-w-4xl text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
            >
              人をAIに合わせるのでなく、
              <br />
              AI時代に人間が参加できる器を設計し直す。
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              NBL
              の価値は、未来の理念だけでも、従来型の個別相談だけでもありません。現在の現場R&Dから、次に使える方法論、手順、理解資源、判断境界を残すことにあります。
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {stanceLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[1.5rem] border border-stone-300 bg-stone-50/90 p-5 transition hover:border-stone-400 hover:bg-white"
                >
                  <p className="text-lg font-black text-slate-950">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
                </Link>
              ))}
            </div>
          </article>

          <div className="space-y-4">
            {relaunchPublicManifesto.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-[1.8rem] border p-6 ${
                  index === 2
                    ? 'border-amber-200 bg-amber-50/70'
                    : 'border-stone-300 bg-stone-50/90'
                }`}
              >
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-300/80 py-12">
          <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">最初の実装領域</p>
              <h2
                className={`mt-3 text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
              >
                なぜ障害・難病と仕事設計から始めるのか。
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
                ここは `障害者雇用だけのサイト`
                だからではなく、仕事・情報・運用・支援・制度の設計課題が、もっとも見えやすく立ち上がる領域だからです。
              </p>
              <p className="mt-4 rounded-[1.6rem] border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm leading-7 text-slate-700">
                診断名だけでは結論を出さず、本人・仕事・環境・支援・時間・制度の相互作用で読みます。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relaunchPublicLenses.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.6rem] border border-stone-300 bg-white/90 p-5 shadow-sm shadow-stone-200/50"
                >
                  <p className="text-sm font-semibold tracking-[0.14em] text-cyan-800">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stone-300/80 py-12">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-cyan-700" />
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">公開中の全体像</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">公開中の入口一覧</h2>
            </div>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-stone-300 xl:block" />
            <div className="grid gap-5 xl:grid-cols-4">
              {relaunchPublicStreams.map((stream, index) => (
                <article
                  key={stream.title}
                  className="relative rounded-[1.8rem] border border-stone-300 bg-white/90 p-6 shadow-sm shadow-stone-200/60"
                >
                  <div className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300 bg-cyan-50 text-sm font-black text-cyan-900">
                    {index + 1}
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {stream.question}
                  </p>
                  <h3 className="mt-3 text-xl font-black text-slate-950">{stream.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{stream.detail}</p>
                  <Link
                    href={resolveHref(stream)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:bg-white hover:text-slate-950"
                  >
                    この入口を見る
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stone-300/80 py-12">
          <div className="rounded-[2.2rem] border border-slate-900 bg-slate-950 px-6 py-8 text-slate-50 shadow-[0_28px_100px_-50px_rgba(15,23,42,0.8)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold tracking-[0.14em] text-slate-300">関心に近い入口</p>
                <h2 className="mt-3 text-3xl font-black text-white">知りたいことから入る</h2>
              </div>
              {showReviewTools ? (
                <Link
                  href="/review/showcase-direction"
                  className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 md:inline-flex"
                >
                  なぜこの構成か
                  <ArrowRight size={15} />
                </Link>
              ) : null}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
              {relaunchPublicQuestionPaths.map((item, index) => (
                <article
                  key={item.title}
                  className={`rounded-[1.8rem] border p-5 ${
                    index === 0 ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <h3 className="text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold text-cyan-100">{item.question}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{item.detail}</p>
                  <Link
                    href={resolveHref(item)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/15"
                  >
                    {item.cta}
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-stone-300/80 py-10">
          <div className="flex flex-col gap-5 text-sm leading-7 text-slate-600 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-semibold text-slate-900">Next Being Lab</p>
              <p className="mt-2 max-w-2xl">
                このサイトの公開コンテンツは
                {' '}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.ja"
                  target="_blank"
                  rel="noreferrer"
                  className="underline transition hover:text-slate-900"
                >
                  CC BY 4.0
                </a>
                {' '}
                を基本として提供しています。
              </p>
              <p className="mt-2 max-w-2xl">
                利用している OSS・外部ライブラリ等の権利は各著作者に帰属し、それぞれのライセンス条件に従います。
              </p>
            </div>
            <div className="text-slate-500 md:text-right">
              <p>© {new Date().getFullYear()} Next Being Lab</p>
              <p className="mt-2">
                <Link href="/contact" className="underline transition hover:text-slate-900">
                  お問い合わせ
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
