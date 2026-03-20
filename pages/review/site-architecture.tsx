import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  Compass,
  FolderKanban,
  Layers3,
  LayoutPanelTop,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';
import { siteAudiences, siteHoldItems, sitePageBriefs, sitePillars } from '@/lib/content/siteArchitecture';

const pillarTone: Record<string, string> = {
  build_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  review_first: 'border-amber-200 bg-amber-50 text-amber-900',
  hold: 'border-stone-300 bg-stone-100 text-stone-700',
};

export default function SiteArchitectureReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Site Architecture</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_32%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To NBL Home
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Site Map
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  NBL Whole-Site Design
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  NBL は、JAC単体ではなく
                  <span className="block text-slate-500">AI時代の社会OSを設計する基盤として組み立てる。</span>
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  `見えない障害の理解` は重要な1シリーズ、JACは中核の1 stream、
                  研究・理解促進・方法論・ビジョンを、それぞれ社会OSの層として適切なページへ置く前提の
                  provisional site architecture です。
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <ShieldCheck size={16} />
                  Design Rule
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                  <li>JAC を NBL 全体に吸収させない</li>
                  <li>理解促進コンテンツを啓発だけで終わらせない</li>
                  <li>研究、制度、体験談を同一の温度で並べない</li>
                  <li>hold 領域を public 導線に混ぜない</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Compass size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Audience Priority</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {siteAudiences.map((audience) => (
              <article key={audience.title} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  {audience.priority}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Content Streams</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {sitePillars.map((pillar) => (
              <article key={pillar.id} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{pillar.summary}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${pillarTone[pillar.publishState]}`}>
                    {pillar.publishState.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Primary Page</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{pillar.primaryPage}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Current Assets</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {pillar.currentAssets.map((asset) => (
                      <li key={asset}>• {asset}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{pillar.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <LayoutPanelTop size={18} className="text-rose-700" />
            <h2 className="text-2xl font-black text-slate-900">Provisional Site Map</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {sitePageBriefs.map((page) => (
              <article key={page.slug} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{page.slug}</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{page.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{page.role}</p>

                <div className="mt-5 grid gap-4 rounded-[1.35rem] bg-stone-100 p-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Include now</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-800">
                      {page.include.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Avoid</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                      {page.avoid.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-900">CTA: {page.cta}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <FolderKanban size={18} className="text-stone-700" />
              <h2 className="text-2xl font-black text-slate-900">Hold For Later</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {siteHoldItems.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
