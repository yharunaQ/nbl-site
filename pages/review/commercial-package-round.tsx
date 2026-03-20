import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, ShieldCheck, Tags, Target, Waypoints } from 'lucide-react';
import React from 'react';
import {
  commercialPackageAgentInsights,
  commercialPackageDecisions,
  commercialPackageExperiments,
  commercialPackageHero,
  commercialPackageSections,
  commercialPackageWordsToAvoid,
  commercialPackageWrappers,
} from '@/lib/content/commercialPackageRoundReview';

const toneClass: Record<string, string> = {
  strong: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  medium: 'border-sky-200 bg-sky-50 text-sky-900',
  warning: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function CommercialPackageRoundReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Commercial Package Round</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/design-partner-round"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Design Partner Round
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/review/commercial-discovery-kit"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-800 hover:border-amber-300 hover:text-amber-900"
                >
                  Next Asset
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Discovery Kit
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                  Review Draft
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Commercial Package
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {commercialPackageHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {commercialPackageHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {commercialPackageHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Chief Of Staff Call
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  package を増やすのではなく、shared core を守って wrapper だけを narrow に分ける。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  これで NBL は labor outsourcing ではなく social OS の導入単位を売る形を保ちやすい。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 lg:grid-cols-4">
            {commercialPackageDecisions.map((item) => (
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

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Package Architecture</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {commercialPackageSections.map((section) => (
                <article key={section.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                    {section.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Wrappers</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {commercialPackageWrappers.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                  {item.assumptions.map((assumption) => (
                    <li key={assumption}>• {assumption}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">Agent Insights</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {commercialPackageAgentInsights.map((item) => (
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
              <ShieldCheck size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">Words To Avoid</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {commercialPackageWordsToAvoid.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-sm leading-7 text-rose-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Tags size={18} className="text-slate-700" />
            <h2 className="text-2xl font-black text-slate-900">Next Experiment</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-4">
            {commercialPackageExperiments.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
          <Link
            href="/review/commercial-discovery-kit"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:border-slate-400"
          >
            Open Commercial Discovery Kit
          </Link>
        </section>
      </main>
    </div>
  );
}
