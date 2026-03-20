import Head from 'next/head';
import {
  FileWarning,
  GitBranchPlus,
  Layers3,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
import React from 'react';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  aboutReviewGuardrails,
  aboutReviewHero,
  aboutReviewHorizons,
  aboutReviewKeyPoints,
  aboutReviewPillars,
  aboutReviewShifts,
  aboutReviewSystemSteps,
  aboutReviewWordsToAvoid,
} from '@/lib/content/aboutReview';

export default function AboutReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL About</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="amber"
          backHref="/review/relaunch-public-home"
          backLabel="Back To Relaunch Public Home"
          eyebrow={aboutReviewHero.eyebrow}
          title={aboutReviewHero.headline}
          subtitle={aboutReviewHero.subheadline}
          sideEyebrow="Core Message"
          sideTitle="AI は人間を消すためではなく、人間参加の器を広げるために使う。"
          sideBody="About は、NBL が何を否定し、何を本丸としているかを曖昧にしないためのページとして使う。"
          sideLink={{ href: '/review/business-structure', label: 'Business Structure Review' }}
          sideExtra={
            <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50/70 p-4 text-sm leading-7 text-slate-700">
              雇用支援の話だけで閉じず、AI時代に人間がどう参加できるかという大きな問いへ戻す。
            </div>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            eyebrow="Core Points"
            title="About がまず返すこと"
            description="About は `思想ページ` で終わらず、NBL の反人間的な誤解を止めつつ、現場R&Dと participation design の両方をつなぐ。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {aboutReviewKeyPoints.map((point) => (
              <article key={point.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <h2 className="text-xl font-black text-slate-900">{point.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{point.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Waypoints size={18} className="text-sky-700" />}
            eyebrow="System Chain"
            title="現場R&Dから participation design までの鎖"
            description="About では、理念を語るだけでなく、現場から何がどう積み上がっていくのかを visible にしておく。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aboutReviewSystemSteps.map((step) => (
              <article key={step.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60">
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<GitBranchPlus size={18} className="text-amber-700" />}
            eyebrow="Two Horizons"
            title="NBL が同時に持つ2つの時間軸"
            description="未来の理念だけでなく、現在の実装R&Dを土台にしながら、その次の participation design へ接続する。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {aboutReviewHorizons.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-amber-200 bg-amber-50/70 p-6">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Waypoints size={18} className="text-sky-700" />}
            eyebrow="Important Shifts"
            title="従来の読み方から何をずらすか"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {aboutReviewShifts.map((shift) => (
              <article key={shift.from} className="rounded-[1.6rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">From</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">{shift.from}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">To</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{shift.to}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <ReviewSectionTitle
            icon={<Layers3 size={18} className="text-emerald-700" />}
            eyebrow="Current Streams"
            title="いまの stream がどうつながるか"
            description="About は別の孤立ページではなく、What We Do、Methods、Resources、Operating Model を上位で束ねる。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {aboutReviewPillars.map((pillar) => (
              <article key={pillar.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <h3 className="text-xl font-black text-slate-900">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{pillar.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<ShieldCheck size={18} className="text-slate-700" />}
              eyebrow="Guardrails"
              title="About で落としてはいけない境界"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {aboutReviewGuardrails.map((rule) => (
                <article key={rule.title} className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">{rule.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{rule.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ReviewSectionTitle
            icon={<FileWarning size={18} className="text-rose-700" />}
            eyebrow="Copy Guardrail"
            title="Words To Avoid In First Release"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {aboutReviewWordsToAvoid.map((word) => (
              <span
                key={word}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-900"
              >
                {word}
              </span>
            ))}
          </div>
        </section>

        <CoreStreamFooter currentId="vision" />
      </main>
    </div>
  );
}
