import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  Compass,
  FolderOpenDot,
  House,
  Layers3,
  MessageSquareQuote,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  homeFirstReleaseAudiences,
  homeFirstReleaseHero,
  homeFirstReleaseHoldItems,
  homeFirstReleaseOffers,
  homeFirstReleaseProofPoints,
  homeFirstReleaseStreams,
} from '@/lib/content/homeFirstRelease';

export default function HomeFirstReleaseReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Home First Release</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/what-we-do"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To What We Do
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Home First Release
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Home Role
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {homeFirstReleaseHero.headline}
                </h1>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {homeFirstReleaseHero.eyebrow}
                </p>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {homeFirstReleaseHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <MessageSquareQuote size={16} />
                  CTA Pair
                </div>
                <p className="mt-5 text-2xl font-black text-slate-900">
                  {homeFirstReleaseHero.primaryCta}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Secondary: {homeFirstReleaseHero.secondaryCta}
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  Home では `何者か` と `どこへ進むか` に絞り、支援詳細は What We Do 側へ逃がす。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Who We Work With</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homeFirstReleaseAudiences.map((audience) => (
              <article key={audience.title} className="rounded-[1.6rem] border border-stone-200 bg-white p-5">
                <h3 className="text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex items-center gap-3">
            <Compass size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">What We Do Snapshot</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {homeFirstReleaseOffers.map((offer) => (
              <article key={offer.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{offer.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{offer.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">Top-Level Streams</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {homeFirstReleaseStreams.map((stream) => (
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
              <House size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">Minimal Proof On Home</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {homeFirstReleaseProofPoints.map((point) => (
                <div key={point} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-slate-700">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center gap-3">
            <FolderOpenDot size={18} className="text-rose-700" />
            <h2 className="text-2xl font-black text-slate-900">Do Not Put On Home Yet</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {homeFirstReleaseHoldItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-900"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
