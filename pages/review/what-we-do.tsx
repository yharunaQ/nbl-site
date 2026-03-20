import Head from 'next/head';
import {
  Boxes,
  BriefcaseBusiness,
  FileWarning,
  ShieldCheck,
  Users,
  Workflow,
} from 'lucide-react';
import React from 'react';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  whatWeDoArtifacts,
  whatWeDoAudiences,
  whatWeDoCopy,
  whatWeDoGuardrails,
  whatWeDoOffers,
  whatWeDoPrimaryCta,
  whatWeDoWordsToAvoid,
  whatWeDoWorkflow,
} from '@/lib/content/whatWeDoReview';

const offerTone: Record<string, string> = {
  offer_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  explain_only: 'border-sky-200 bg-sky-50 text-sky-900',
  hold: 'border-stone-300 bg-stone-100 text-stone-700',
};

export default function WhatWeDoReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL What We Do</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="emerald"
          backHref="/review/relaunch-public-home"
          backLabel="Back To Relaunch Public Home"
          eyebrow="What We Do"
          title={whatWeDoCopy.headline}
          subtitle={whatWeDoCopy.subheadline}
          sideEyebrow="Public Promise"
          sideTitle={whatWeDoPrimaryCta.label}
          sideBody={whatWeDoPrimaryCta.summary}
          sideLink={{ href: '/review/showcase-direction', label: 'Showcase Direction' }}
          sideExtra={
            <ul className="space-y-3 rounded-[1.4rem] border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-6 text-slate-700">
              {whatWeDoPrimaryCta.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Workflow size={18} className="text-emerald-700" />}
            eyebrow="Mechanism"
            title="What We Do が返す流れ"
            description="What We Do は、offer の一覧より先に、どのように設計課題へ変換し、何を残すかが分かるページとして整える。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whatWeDoWorkflow.map((step) => (
              <article key={step.step} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10">
          <ReviewSectionTitle
            icon={<BriefcaseBusiness size={18} className="text-emerald-700" />}
            eyebrow="Offer Posture"
            title="いま約束できること"
            description="初期公開では、offer を consulting menu のように見せず、何が offer_now で、何が explain_only かを明確に分ける。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {whatWeDoOffers.map((offer) => (
              <article key={offer.id} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{offer.summary}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${offerTone[offer.state]}`}
                  >
                    {offer.state.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Include</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {offer.includes.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">Caution: {offer.caution}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Boxes size={18} className="text-cyan-700" />}
            eyebrow="Artifacts"
            title="1 round のあとに残るもの"
            description="NBL の価値は、その場の助言だけでなく、次の現場へ持ち越せる artifact が残ることにある。"
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whatWeDoArtifacts.map((artifact) => (
              <article key={artifact.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">{artifact.title}</p>
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
            eyebrow="Audience Priority"
            title="誰に最初に返すか"
            description="障害者雇用の narrow site に戻らないよう、audience は `仕事設計と組織運用の問い` でつながる順に置く。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whatWeDoAudiences.map((audience) => (
              <article key={audience.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-5 shadow-sm shadow-stone-200/60">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  {audience.priority}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.need}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<ShieldCheck size={18} className="text-slate-700" />}
              eyebrow="Guardrails"
              title="Evidence And Ethics Guardrails"
              description="障害・雇用文脈では、offer の魅力より先に guardrail を失うと、設計の正しさも信頼も崩れやすい。"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {whatWeDoGuardrails.map((rule) => (
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
            {whatWeDoWordsToAvoid.map((word) => (
              <span
                key={word}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-900"
              >
                {word}
              </span>
            ))}
          </div>
        </section>

        <CoreStreamFooter currentId="what-we-do" />
      </main>
    </div>
  );
}
