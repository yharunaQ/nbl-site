import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Compass, ShieldCheck, Target, Waypoints } from 'lucide-react';
import React from 'react';
import {
  partnerDiscoveryHero,
  partnerDiscoveryScorecard,
  partnerDiscoverySequence,
  partnerDiscoveryStopRules,
  partnerDiscoveryTargets,
} from '@/lib/content/partnerDiscoveryOpsReview';

const toneClass: Record<string, string> = {
  primary: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  secondary: 'border-sky-200 bg-sky-50 text-sky-900',
  comparison: 'border-amber-200 bg-amber-50 text-amber-900',
};

export default function PartnerDiscoveryOpsReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Partner Discovery Ops</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/commercial-discovery-kit"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Discovery Kit
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/review/partner-pipeline"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800 hover:border-emerald-300 hover:text-emerald-900"
                >
                  Next Asset
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Pipeline
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                  Review Draft
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Partner Discovery Ops
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  {partnerDiscoveryHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {partnerDiscoveryHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {partnerDiscoveryHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Chief Of Staff Call
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  相手探しを広げるのでなく、固定条件で4 conversation を比較する。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  primary target は employer-facing intermediary、比較対象として employer と lighthouse を残す。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Target Conditions</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {partnerDiscoveryTargets.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${toneClass[item.tone]}`}>
                    {item.tone}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                  {item.items.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Fixed Scorecard</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {partnerDiscoveryScorecard.map((item) => (
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
            <Waypoints size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">Outreach Sequence</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-5">
            {partnerDiscoverySequence.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">Stop Rules</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {partnerDiscoveryStopRules.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-rose-50 p-6">
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                </article>
              ))}
            </div>
            <Link
              href="/review/partner-pipeline"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:border-rose-400"
            >
              Open Partner Pipeline
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
