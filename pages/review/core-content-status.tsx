import Head from 'next/head';
import Link from 'next/link';
import { Compass, Eye, FileStack, Route, ShieldCheck } from 'lucide-react';
import React from 'react';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  coreContentCheckSteps,
  coreContentStatusFounderDecisions,
  coreContentStatusHero,
  coreContentStatusTracks,
  coreContentStatusWhyConfusing,
} from '@/lib/content/coreContentStatusReview';

const stateTone: Record<string, string> = {
  public_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  hidden_review: 'border-sky-200 bg-sky-50 text-sky-900',
  implemented_but_misaligned: 'border-amber-200 bg-amber-50 text-amber-900',
  internal_tool: 'border-violet-200 bg-violet-50 text-violet-900',
  internal_base: 'border-stone-300 bg-stone-100 text-stone-700',
};

const stateLabel: Record<string, string> = {
  public_now: 'live',
  hidden_review: 'hidden review',
  implemented_but_misaligned: 'implemented but misaligned',
  internal_tool: 'internal tool',
  internal_base: 'internal base',
};

export default function CoreContentStatusReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL Core Content Status</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="cyan"
          backHref="/review"
          backLabel="Back To Review Index"
          eyebrow={coreContentStatusHero.eyebrow}
          title={coreContentStatusHero.headline}
          subtitle={coreContentStatusHero.subheadline}
          sideEyebrow="How To Use This Page"
          sideTitle="何が進んだかを、route 単位で確認する。"
          sideBody="このページは、`進んでいるのに見えない` を減らすための確認面です。各 track ごとに、いま見える route、まだ hidden review のままの route、次の判断点を並べています。"
          sideExtra={
            <ul className="space-y-3 rounded-[1.4rem] border border-cyan-200 bg-cyan-50/70 p-4 text-sm leading-6 text-slate-700">
              {coreContentStatusWhyConfusing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Compass size={18} className="text-cyan-700" />}
            eyebrow="Check Order"
            title="どう確認するか"
            description="いま何が出ていて、何がまだ境界前かを 4 ステップで確認する。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {coreContentCheckSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-xl font-black text-slate-900">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Eye size={18} className="text-emerald-700" />}
            eyebrow="Track Status"
            title="コアコンテンツの現在地"
            description="各 track について、何が今見えるか、なぜ見えにくいか、次にどこで Founder 判断が要るかを並べる。"
          />
          <div className="mt-6 space-y-6">
            {coreContentStatusTracks.map((track) => (
              <article
                key={track.title}
                className="rounded-[1.9rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl font-black text-slate-900">{track.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-slate-600">{track.role}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${stateTone[track.state]}`}
                  >
                    {stateLabel[track.state]}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Current State
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{track.currentState}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Why It Feels Missing
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{track.whyItFeelsMissing}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Next Move
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{track.nextMove}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Founder Check
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{track.founderCheck}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {track.publicRoute ? (
                    <Link
                      href={track.publicRoute}
                      className="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:bg-white hover:text-slate-900"
                    >
                      Open Public Route
                    </Link>
                  ) : null}
                  {track.reviewRoute ? (
                    <Link
                      href={track.reviewRoute}
                      className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:text-slate-900"
                    >
                      Open Review Route
                    </Link>
                  ) : null}
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Evidence
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {track.evidence.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<ShieldCheck size={18} className="text-slate-700" />}
              eyebrow="Founder Decisions"
              title="いま Founder が返すと効く判断"
              description="全部を判断する必要はない。境界が来ている論点だけを返せばよい。"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {coreContentStatusFounderDecisions.map((item) => (
                <article
                  key={item}
                  className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-slate-700"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ReviewSectionTitle
            icon={<Route size={18} className="text-amber-700" />}
            eyebrow="Practical Route"
            title="最短の確認ルート"
            description="時間がなければ、まずはこの 4 route だけ見れば現状がつかめる。"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              '/jac-foundations',
              '/review/work-design-frame-reference',
              '/review/work-design-workbook',
              '/review/work-design-guide',
            ].map(
              (href) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:text-slate-900"
                >
                  {href}
                </Link>
              ),
            )}
          </div>
        </section>

        <CoreStreamFooter
          currentId="methods"
          title="Methods の現在地を見失わないための review"
          description="このページは、仕事設計プロダクト群と制度インフォグラフィックが NBL の中で今どこにあるかを確認するための面です。public に出すかどうかの判断より前に、まず現状態を同じ地図に戻します。"
        />
      </main>
    </div>
  );
}
