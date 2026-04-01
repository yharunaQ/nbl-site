import Head from 'next/head';
import {
  Boxes,
  FileWarning,
  Layers3,
  ShieldCheck,
  Users,
  Waypoints,
} from 'lucide-react';
import React from 'react';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  jacPositioningArtifacts,
  jacPositioningAudiences,
  jacPositioningCards,
  jacPositioningGuardrails,
  jacPositioningHero,
  jacPositioningJourney,
  jacPositioningSurfaces,
  jacPositioningWordsToAvoid,
} from '@/lib/content/jacPositioningReview';

const surfaceTone: Record<string, string> = {
  explain_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  review_first: 'border-sky-200 bg-sky-50 text-sky-900',
  hold: 'border-stone-300 bg-stone-100 text-stone-700',
};

export default function JacPositioningReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | 仕事設計領域の位置づけ</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="cyan"
          backHref="/review/relaunch-public-home"
          backLabel="Back To Relaunch Public Home"
          eyebrow={jacPositioningHero.eyebrow}
          title={jacPositioningHero.headline}
          subtitle={jacPositioningHero.subheadline}
          sideEyebrow="Positioning Rule"
          sideTitle={jacPositioningHero.primaryCta}
          sideBody={`Secondary: ${jacPositioningHero.secondaryCta}`}
          sideExtra={
            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-cyan-200 bg-cyan-50/70 p-4 text-sm leading-7 text-slate-700">
                旧 `/jac` 系ページは、販売や個別相談ではなく `仕事設計プロダクト群` の説明に役割を限定する。
              </div>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {jacPositioningHero.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            eyebrow="Position"
            title="仕事設計プロダクト群をどう位置づけるか"
            description="仕事設計プロダクト群は NBL の現在のコアだが、NBL 全体そのものではない。方法論 / product stream としての役割を先に明確にする。"
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {jacPositioningCards.map((card) => (
              <article key={card.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <h2 className="text-xl font-black text-slate-900">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{card.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Boxes size={18} className="text-cyan-700" />}
            eyebrow="Artifacts"
            title="仕事設計プロダクト群が残すもの"
            description="即答ツールでなく方法論として見せるには、何を artifact として残すかが重要。"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {jacPositioningArtifacts.map((artifact) => (
              <article key={artifact.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">{artifact.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{artifact.summary}</p>
                <p className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  {artifact.whyItMatters}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Users size={18} className="text-sky-700" />}
            eyebrow="Audience"
            title="Primary Readers"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {jacPositioningAudiences.map((audience) => (
              <article key={audience.title} className="rounded-[1.6rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60">
                <h3 className="text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <ReviewSectionTitle
            icon={<Layers3 size={18} className="text-emerald-700" />}
            eyebrow="Surface Split"
            title="guide / draft / workbook を混ぜない"
            description="仕事設計プロダクト群の入口が複数あるほど、役割を先に分けておかないと責任範囲が曖昧になりやすい。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {jacPositioningSurfaces.map((surface) => (
              <article key={surface.id} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{surface.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{surface.role}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${surfaceTone[surface.state]}`}
                  >
                    {surface.state.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{surface.summary}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">Caution: {surface.caution}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Waypoints size={18} className="text-amber-700" />}
            eyebrow="Journey"
            title="Recommended Journey"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {jacPositioningJourney.map((step) => (
              <article key={step.step} className="rounded-[1.6rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<ShieldCheck size={18} className="text-slate-700" />}
              eyebrow="Guardrails"
              title="Guardrails"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {jacPositioningGuardrails.map((rule) => (
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
            {jacPositioningWordsToAvoid.map((word) => (
              <span
                key={word}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-900"
              >
                {word}
              </span>
            ))}
          </div>
        </section>

        <CoreStreamFooter
          currentId="methods"
          title="Methods は他の stream とどうつながるか"
          description="仕事設計プロダクト群は独立した相談サービスではなく、What We Do、Resources、Vision を支える現在のコアとして読む。"
        />
      </main>
    </div>
  );
}
