import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, FileStack, ShieldCheck, Target } from 'lucide-react';
import React from 'react';
import {
  commercialDiscoveryHero,
  commercialDiscoveryQuestions,
  commercialDiscoverySections,
} from '@/lib/content/commercialDiscoveryKitReview';

export default function CommercialDiscoveryKitReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Commercial Discovery Kit</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(234,179,8,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/commercial-package-round"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Commercial Package
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/review/partner-discovery-ops"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-800 hover:border-sky-300 hover:text-sky-900"
                >
                  Next Round
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Partner Ops
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-amber-800">
                  Review Draft
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Discovery Kit
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                  {commercialDiscoveryHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {commercialDiscoveryHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {commercialDiscoveryHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Discovery Rule
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  sell より先に、fit と boundary を確認する。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  one-page brief から入り、exclusions と boundary を先に見せて unsafe fit を落とす。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <FileStack size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">Kit Components</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {commercialDiscoverySections.map((section) => (
              <article key={section.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{section.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                  {section.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <Target size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Discovery Questions</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-5">
              {commercialDiscoveryQuestions.map((question) => (
                <article key={question.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-lg font-bold text-slate-900">{question.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{question.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">Boundary Reminder</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              high-risk 領域は `AI-supported, human-decided` を原則にする。final employment decisions、medical
              interpretation、crisis / safety、major missing context cases は must-escalate に入る。
            </p>
            <Link
              href="/review/partner-discovery-ops"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:border-rose-400"
            >
              Open Partner Discovery Ops
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
