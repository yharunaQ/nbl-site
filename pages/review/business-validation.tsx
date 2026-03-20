import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  CircleDollarSign,
  FileWarning,
  ShieldCheck,
  Users,
  Waypoints,
} from 'lucide-react';
import React from 'react';
import {
  businessValidationBoundaries,
  businessValidationEscalation,
  businessValidationHero,
  businessValidationHypotheses,
  businessValidationNextChecks,
  businessValidationPartnerTypes,
  businessValidationRevenue,
} from '@/lib/content/businessValidationReview';

const fitTone: Record<string, string> = {
  strong: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  medium: 'border-amber-200 bg-amber-50 text-amber-900',
  weak: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function BusinessValidationReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Business Validation</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/business-structure"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Business Structure
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/review/design-partner-round"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-800 hover:border-sky-300 hover:text-sky-900"
                >
                  Next Round
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Design Partner
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                  Review Draft
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Business Validation
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {businessValidationHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {businessValidationHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {businessValidationHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Practical Rule
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  まずは 1-3 組の design partner で、fee と boundary を検証する。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  distribution を広げる前に、recurring layer と escalation line が本当に回るかを見る。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {businessValidationHypotheses.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h2 className="text-xl font-black text-slate-900">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Design Partner Types</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {businessValidationPartnerTypes.map((partner) => (
              <article key={partner.title} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{partner.title}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${fitTone[partner.fit]}`}>
                    {partner.fit}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{partner.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex items-center gap-3">
            <CircleDollarSign size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Revenue Hypotheses</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {businessValidationRevenue.map((item) => (
              <article key={item.id} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">Note: {item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">Boundary Design</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {businessValidationBoundaries.map((item) => (
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
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">Escalation Boundary</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {businessValidationEscalation.map((group) => (
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
          <div className="flex items-center gap-3">
            <FileWarning size={18} className="text-rose-700" />
            <h2 className="text-2xl font-black text-slate-900">Next Checks</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {businessValidationNextChecks.map((item) => (
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
