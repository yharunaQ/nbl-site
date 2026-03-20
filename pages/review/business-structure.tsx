import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  CircleDollarSign,
  FileWarning,
  Route,
  ShieldCheck,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  businessStructureDistribution,
  businessStructureGuardrails,
  businessStructureModelCards,
  businessStructurePartners,
  businessStructureRevenue,
  businessStructureValidationQueue,
  businessStructureVerdict,
} from '@/lib/content/businessStructureReview';

export default function BusinessStructureReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Business Structure</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/about"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To About
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Business Structure
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Viability Call
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {businessStructureVerdict.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {businessStructureVerdict.summary}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <CircleDollarSign size={16} />
                  Core Business Rule
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  人手の相談件数ではなく、再利用可能な system layer を売る。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  startup fee、recurring fee、bounded usage の hybrid で立ち上げる前提。
                </div>
                <Link
                  href="/review/business-validation"
                  className="mt-5 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
                >
                  Business Validation Review
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {businessStructureModelCards.map((card) => (
              <article key={card.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h2 className="text-xl font-black text-slate-900">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{card.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Route size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">Distribution Flywheel</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {businessStructureDistribution.map((step) => (
              <article key={step.step} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex items-center gap-3">
            <CircleDollarSign size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Revenue Stack</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {businessStructureRevenue.map((layer) => (
              <article key={layer.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{layer.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{layer.summary}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">Note: {layer.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Partnership Classes</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {businessStructurePartners.map((partner) => (
              <article key={partner.title} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <h3 className="text-lg font-bold text-slate-900">{partner.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{partner.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">Guardrails</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {businessStructureGuardrails.map((rule) => (
                <article key={rule.title} className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">{rule.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{rule.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <FileWarning size={18} className="text-rose-700" />
            <h2 className="text-2xl font-black text-slate-900">Validation Queue</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {businessStructureValidationQueue.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-stone-200 bg-rose-50 p-5 text-sm leading-7 text-rose-900">
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
