import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Compass, ShieldCheck, Target, Users, Waypoints } from 'lucide-react';
import React from 'react';
import {
  designPartnerAgentInsights,
  designPartnerBoundaries,
  designPartnerDecisionCards,
  designPartnerExperiment,
  designPartnerHero,
  designPartnerScorecard,
} from '@/lib/content/designPartnerRoundReview';

const toneClass: Record<string, string> = {
  strong: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  medium: 'border-amber-200 bg-amber-50 text-amber-900',
  avoid: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function DesignPartnerRoundReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Design Partner Round</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/business-validation"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Business Validation
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/review/commercial-package-round"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800 hover:border-emerald-300 hover:text-emerald-900"
                >
                  Next Round
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Commercial Package
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                  Review Draft
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Design Partner Round
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  {designPartnerHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {designPartnerHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {designPartnerHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Chief Of Staff Call
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  最速受注ではなく、learning loop と boundary safety が育つ相手を選ぶ。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  employer direct は残しつつも、first target は intermediary first で比較検証する。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {designPartnerDecisionCards.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-black text-slate-900">{item.title}</h2>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${toneClass[item.tone]}`}>
                    {item.label}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Agent Insights</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {designPartnerAgentInsights.map((item) => (
              <article key={item.role} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{item.role}</h3>
                <dl className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                  <div>
                    <dt className="font-bold text-slate-900">What seems strongest</dt>
                    <dd>{item.strongest}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-900">What seems risky</dt>
                    <dd>{item.risky}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-900">What needs to be true</dt>
                    <dd>{item.needsToBeTrue}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-900">Provisional recommendation</dt>
                    <dd>{item.recommendation}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Partner Scorecard</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {designPartnerScorecard.map((item) => (
                <article key={item.title} className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">Two-Week Experiment</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-4">
            {designPartnerExperiment.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">Boundary Design</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {designPartnerBoundaries.map((group) => (
                <article key={group.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-xl font-black text-slate-900">{group.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                    {group.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-sky-200 bg-sky-50 p-8">
            <div className="flex items-center gap-3">
              <Waypoints size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Next Move</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              次は、first commercial package を separate products にするのでなく、
              one core / two wrappers で保てるかを詰める。Offer Packaging Lead を本格参加させる。
            </p>
            <Link
              href="/review/commercial-package-round"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-900 hover:border-sky-400"
            >
              Open Commercial Package Round
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
