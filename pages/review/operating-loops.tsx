import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Compass, RefreshCcw, ShieldCheck, Users, Waypoints } from 'lucide-react';
import React from 'react';
import {
  founderBoundaries,
  operatingLoops,
  operatingLoopsHero,
  operatingRisks,
  operatingTriggers,
} from '@/lib/content/operatingLoopsReview';

export default function OperatingLoopsReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Operating Loops</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/relaunch-home"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Relaunch Home
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Operating Loops
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {operatingLoopsHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {operatingLoopsHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {operatingLoopsHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <RefreshCcw size={16} />
                  Goal
                </div>
                <p className="mt-5 text-2xl font-black text-slate-900">
                  `AI中心` を気分ではなく、繰り返し回る運用に変える
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  Founder が毎回すべてを指示しなくても進むよう、loop、artifact、境界、止まる条件を先に定義する。
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Recurring Loops</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {operatingLoops.map((loop) => (
              <article key={loop.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-800">
                    {loop.cadence}
                  </span>
                  <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {loop.owner}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900">{loop.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{loop.purpose}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-stone-100 p-4">
                    <p className="text-sm font-bold text-slate-900">Inputs</p>
                    <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-slate-700">
                      {loop.inputs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-bold text-slate-900">Outputs</p>
                    <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-slate-700">
                      {loop.outputs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  Founder boundary: {loop.founderNeeded}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-amber-700" />
              <h2 className="text-2xl font-black text-slate-900">Founder Boundary</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {founderBoundaries.map((boundary) => (
                <article key={boundary.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-xl font-black text-slate-900">{boundary.title}</h3>
                  {boundary.aiCanDo.length > 0 && (
                    <>
                      <p className="mt-4 text-sm font-bold text-slate-900">AIが進める</p>
                      <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-slate-700">
                        {boundary.aiCanDo.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {boundary.founderDecides.length > 0 && (
                    <>
                      <p className="mt-4 text-sm font-bold text-slate-900">Founderが決める</p>
                      <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-slate-700">
                        {boundary.founderDecides.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Compass size={18} className="text-indigo-700" />
            <h2 className="text-2xl font-black text-slate-900">Triggers</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {operatingTriggers.map((trigger) => (
              <article key={trigger.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{trigger.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">When:</span> {trigger.when}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">Action:</span> {trigger.action}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">Failure Modes To Watch</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {operatingRisks.map((risk) => (
                <article key={risk.title} className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/60 p-6">
                  <h3 className="text-xl font-black text-slate-900">{risk.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{risk.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
