import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  Compass,
  Flag,
  Layers3,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
} from 'lucide-react';
import React from 'react';
import {
  relaunchHomeAudiences,
  relaunchHomeGuardrails,
  relaunchHomeHero,
  relaunchHomeImplementationPoints,
  relaunchHomeOffers,
  relaunchHomePhases,
  relaunchHomePositions,
  relaunchHomeReasons,
  relaunchHomeStreams,
} from '@/lib/content/relaunchHome';

export default function RelaunchHomeReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Relaunch Home</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_56%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Review Index
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Relaunch Home
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  {relaunchHomeHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {relaunchHomeHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {relaunchHomeHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <Rocket size={16} />
                  Relaunch Role
                </div>
                <p className="mt-5 text-2xl font-black text-slate-900">
                  temporary public site の次に置く、NBL全体の本流入口
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  このページは、障害就労だけにも、未来思想だけにも寄らず、NBL が何を目指し、どの
                  stream をどう束ねるかを最初に返す役割を持つ。
                </p>
                <Link
                  href="/review/about"
                  className="mt-5 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
                >
                  Vision Draft を確認
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Flag size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Core Position</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {relaunchHomePositions.map((position) => (
              <article key={position.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{position.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{position.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Why NBL Exists Now</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {relaunchHomeReasons.map((reason) => (
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
            <h2 className="text-2xl font-black text-slate-900">What NBL Builds Now</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {relaunchHomeOffers.map((offer) => (
              <article key={offer.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{offer.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{offer.detail}</p>
                <p className="mt-4 rounded-2xl bg-stone-100 px-4 py-3 text-sm leading-6 text-slate-600">
                  Boundary: {offer.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-amber-700" />
              <h2 className="text-2xl font-black text-slate-900">Why Disability And Work Matter Here</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {relaunchHomeImplementationPoints.map((point) => (
                <article key={point.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-xl font-black text-slate-900">{point.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{point.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Who Should Feel Addressed</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relaunchHomeAudiences.map((audience) => (
              <article key={audience.title} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <h3 className="text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-rose-700" />
            <h2 className="text-2xl font-black text-slate-900">Five Connected Streams</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {relaunchHomeStreams.map((stream) => (
              <article key={stream.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{stream.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{stream.summary}</p>
                <Link
                  href={stream.href}
                  className="mt-5 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
                >
                  Review Link
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Waypoints size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">Relaunch Sequence</h2>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {relaunchHomePhases.map((phase) => (
                <article key={phase.phase} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{phase.phase}</p>
                  <h3 className="mt-3 text-xl font-black text-slate-900">{phase.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{phase.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Trust And Boundaries</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {relaunchHomeGuardrails.map((guardrail) => (
              <article key={guardrail.title} className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/60 p-6">
                <h3 className="text-xl font-black text-slate-900">{guardrail.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{guardrail.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
