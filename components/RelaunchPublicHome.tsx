import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';
import { Noto_Sans_JP } from 'next/font/google';
import {
  relaunchPublicArtifacts,
  relaunchPublicBoundaries,
  relaunchPublicFirstVisitPaths,
  relaunchPublicHero,
  relaunchPublicLearningSignals,
  relaunchPublicLenses,
  relaunchPublicManifesto,
  relaunchPublicMoves,
  relaunchPublicQuestionPaths,
  relaunchPublicSignals,
  relaunchPublicStreams,
  relaunchPublicTensions,
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

        <section className="grid gap-8 pb-10 pt-12 xl:grid-cols-[minmax(0,1.02fr)_minmax(400px,0.98fr)] xl:items-end xl:pb-16">
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={showReviewTools ? '/review/what-we-do' : '/what-we-do'}
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
          </div>

          <aside className="overflow-hidden rounded-[2.2rem] border border-slate-800 bg-slate-950 text-white shadow-[0_36px_120px_-50px_rgba(15,23,42,0.9)]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-cyan-200">
                <Sparkles size={16} />
                このサイトが見せる運用の証拠
              </div>
              <p className="mt-4 text-2xl font-black leading-tight text-white">
                NBLは、相談を受けて終わるのでなく、
                <br />
                読み取り、設計し、再利用可能な部品を残す。
              </p>
            </div>

            <div className="grid gap-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-5">
                {relaunchPublicMoves.map((move) => (
                  <article
                    key={move.step}
                    className="relative rounded-[1.6rem] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-black text-cyan-200">
                        {move.step}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">{move.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{move.detail}</p>
                        <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
                          {move.proof}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="space-y-3">
                {relaunchPublicSignals.map((signal) => (
                  <article
                    key={signal.label}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-base font-black leading-6 text-white">{signal.value}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 border-t border-stone-300/80 py-10 xl:grid-cols-[minmax(280px,0.76fr)_minmax(0,1.24fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              初めて来た方へ
            </p>
            <h2
              className={`mt-3 text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
            >
              最初の10分で何を見るか。
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
              新聞や検索から来た方が迷わないように、立場に近い入口を先に置いています。個別判断より前に、
              まず公開中の説明と資源から現在地をつかめる構成です。
            </p>
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

        <section className="grid gap-5 border-t border-stone-300/80 py-10 lg:grid-cols-2">
          {relaunchPublicTensions.map((item, index) => (
            <article
              key={item.title}
              className={`rounded-[2rem] border p-6 shadow-sm ${
                index === 0 ? 'border-stone-300 bg-white/90' : 'border-cyan-200 bg-cyan-50/70'
              }`}
            >
              <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">
                {index === 0 ? '時代の変化' : 'NBLの応答'}
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
              <ul className="mt-5 space-y-3">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-2xl border border-black/5 bg-black/5 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
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
              の価値は、未来の理念だけでも、従来型の個別相談だけでもありません。現在の現場R&Dから、次に使える方法論、workflow、理解資源、判断境界を残すことにあります。
            </p>
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

        <section className="grid gap-8 border-t border-stone-300/80 py-12 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              蓄積するもの
            </p>
            <h2
              className={`mt-3 text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
            >
              何を積み上げるのか。
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
              `social OS` を抽象語で終わらせないために、NBL
              は残る単位を明示します。毎回の応答を、そのまま消耗品にしないためです。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {relaunchPublicArtifacts.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-stone-300 bg-white/90 p-6 shadow-sm shadow-stone-200/60"
              >
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                <p className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item.note}
                </p>
                <Link
                  href={resolveHref(item)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:bg-white hover:text-slate-950"
                >
                  {item.cta}
                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-stone-300/80 py-12 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">運用の見え方</p>
            <h2
              className={`mt-3 text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
            >
              このサイトが進化していると分かる根拠。
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
              NBL が見せたいのは、`AIで作りました`
              という話題性ではありません。更新が部品として残り、改善理由が追え、速さより境界が見えることです。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {relaunchPublicLearningSignals.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-stone-300 bg-white/90 p-6 shadow-sm shadow-stone-200/60"
              >
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                <p className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item.proof}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-300/80 py-12">
          <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
            <div>
              <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">旗艦領域</p>
              <h2
                className={`mt-3 text-3xl leading-tight text-slate-950 md:text-5xl ${display.className}`}
              >
                なぜ障害・難病と仕事設計から始めるのか。
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
                ここは `障害者雇用の narrow site`
                だからではなく、仕事・情報・運用・支援・制度の設計課題が最も立ち上がりやすい領域だからです。
              </p>
              <p className="mt-4 rounded-[1.6rem] border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm leading-7 text-slate-700">
                診断名だけでは結論を出さず、Person / Job / Environment / Support / Time /
                Institution の相互作用で読む。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relaunchPublicLenses.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.6rem] border border-stone-300 bg-white/90 p-5 shadow-sm shadow-stone-200/50"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-800">
                    {item.title}
                  </p>
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
              <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">全体構造</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Homeが束ねる5つの流れ</h2>
            </div>
          </div>

          <div className="relative mt-8">
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-stone-300 xl:block" />
            <div className="grid gap-5 xl:grid-cols-5">
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
                    この流れを見る
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-t border-stone-300/80 py-12 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-700" />
              <div>
                <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">境界と統治</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  AIと人の境界を先に見せる
                </h2>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
              NBL は `AIが全部やる` とも `人が常設対応する` とも見せません。どこまで AI
              が進め、どこで人が境界を持つかを、運営の前提として明示します。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {relaunchPublicBoundaries.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/70 p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                  {item.status}
                </p>
                <h3 className="mt-3 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-300/80 py-12">
          <div className="rounded-[2.2rem] border border-slate-900 bg-slate-950 px-6 py-8 text-slate-50 shadow-[0_28px_100px_-50px_rgba(15,23,42,0.8)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold tracking-[0.14em] text-slate-300">
                  入口の選び方
                </p>
                <h2 className="mt-3 text-3xl font-black text-white">何を知りたいかから入る</h2>
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
      </main>
    </div>
  );
}
