import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  Compass,
  GitBranchPlus,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  showcaseAgents,
  showcaseDiagnoses,
  showcaseDirectionHero,
  showcaseDirections,
  showcaseGuardrails,
  showcasePhases,
} from '@/lib/content/showcaseDirectionReview';

export default function ShowcaseDirectionReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL Showcase Direction</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.16),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_28%),linear-gradient(180deg,_#fbf6ee_0%,_#f7f3ec_55%,_#f5efe6_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/relaunch-public-home"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:text-slate-950"
              >
                <ArrowLeft size={16} />
                Back To Relaunch Public Home
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-800">
                Multi-Agent Synthesis
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-800">
                  {showcaseDirectionHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                  {showcaseDirectionHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {showcaseDirectionHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                  <Sparkles size={16} />
                  Working Conclusion
                </div>
                <p className="mt-5 text-2xl font-black leading-tight text-slate-950">
                  `きれいなAIサイト` ではなく、`動く組織と設計思想の証拠` を返すトップへ。
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  見た目の polish は必要だが、主因は visual weakness より evidence weakness。先に機構を見せると、showcase と trust が同時に上がる。
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-cyan-700" />
            <h2 className="text-2xl font-black text-slate-950">Subagent Inputs</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {showcaseAgents.map((agent) => (
              <article key={agent.role} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{agent.role}</p>
                <p className="mt-3 text-sm font-semibold text-cyan-800">{agent.focus}</p>
                <p className="mt-4 text-sm leading-7 text-slate-700">{agent.conclusion}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-amber-700" />
              <h2 className="text-2xl font-black text-slate-950">Diagnosis</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {showcaseDiagnoses.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-amber-200 bg-amber-50/70 p-6">
                  <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-950">Direction</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {showcaseDirections.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <GitBranchPlus size={18} className="text-indigo-700" />
              <h2 className="text-2xl font-black text-slate-950">Phased Delivery</h2>
            </div>
            <div className="mt-6 grid gap-5 xl:grid-cols-4">
              {showcasePhases.map((phase) => (
                <article key={phase.phase} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">
                    {phase.phase}
                  </p>
                  <h3 className="mt-3 text-xl font-black text-slate-950">{phase.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{phase.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-950">Guardrails</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {showcaseGuardrails.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/70 p-6">
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
