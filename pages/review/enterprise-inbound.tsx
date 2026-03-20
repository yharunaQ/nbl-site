import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react';
import {
  enterpriseInboundAudiences,
  enterpriseInboundCards,
  enterpriseInboundHero,
  enterpriseInboundJacNotes,
} from '@/lib/content/enterpriseInboundReview';

export default function EnterpriseInboundReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Enterprise Inbound</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/home-first-release"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Home First Release
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Enterprise Inbound
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  {enterpriseInboundHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {enterpriseInboundHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {enterpriseInboundHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <Globe size={16} />
                  Public Readiness
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  narrow compliance site に見せず、仕事設計と社会OSの入口にする。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  今の仮公開でも、safe な範囲で enterprise reader の入口を持たせる。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Primary Readers</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {enterpriseInboundAudiences.map((audience) => (
              <article key={audience.title} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <h3 className="text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {enterpriseInboundCards.map((card) => (
              <article key={card.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h2 className="text-xl font-black text-slate-900">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-700">{card.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">JAC Entry Posture</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {enterpriseInboundJacNotes.map((note) => (
                <article key={note} className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-slate-700">
                  {note}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-sky-200 bg-sky-50 p-8">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Implementation Hint</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              current public site では `企業・組織の方へ` の safe entry を作り、hidden review では Home / What We Do / JAC / revenue posture をこの前提で揃える。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
