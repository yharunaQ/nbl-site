import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Compass, Layers3, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react';
import {
  nextHorizonGuardrails,
  nextHorizonHero,
  nextHorizonQuestions,
  nextHorizonReasons,
  nextHorizonTracks,
} from '@/lib/content/nextHorizonReview';

export default function NextHorizonReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Next Horizon</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/relaunch-home"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Relaunch Home
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Next Horizon
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                  {nextHorizonHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {nextHorizonHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {nextHorizonHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <Rocket size={16} />
                  Position
                </div>
                <p className="mt-5 text-2xl font-black text-slate-900">
                  DAO を resurrect する話ではなく、NBL の `next horizon` を事業構造に入れる話
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  public に raw lab を戻すのではなく、内部 incubation として位置づけ直し、本流の
                  R&amp;D と並走させる。
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Dual Track</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {nextHorizonTracks.map((track) => (
              <article key={track.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{track.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{track.role}</p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Current form:</span> {track.currentForm}
                  </p>
                  <p className="mt-3">
                    <span className="font-semibold text-slate-900">Value:</span> {track.value}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Why This Matters Now</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {nextHorizonReasons.map((reason) => (
                <article key={reason.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-xl font-black text-slate-900">{reason.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{reason.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-indigo-700" />
            <h2 className="text-2xl font-black text-slate-900">Core Questions For The Next Horizon</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {nextHorizonQuestions.map((question) => (
              <article key={question.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{question.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{question.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Guardrails</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {nextHorizonGuardrails.map((guardrail) => (
                <article key={guardrail.title} className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/60 p-6">
                  <h3 className="text-xl font-black text-slate-900">{guardrail.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{guardrail.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
