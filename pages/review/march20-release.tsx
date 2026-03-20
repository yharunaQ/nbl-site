import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ClipboardCheck, PackageCheck } from 'lucide-react';
import React from 'react';
import { march20ReleaseBuckets, march20ReleaseHero } from '@/lib/content/march20ReleaseReview';

export default function March20ReleaseReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL March 20 Release</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
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
                March 20
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  {march20ReleaseHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {march20ReleaseHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {march20ReleaseHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <CalendarDays size={16} />
                  Sprint Focus
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  `全部完成` ではなく、`ここまでなら public に出せる` を固める。
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {march20ReleaseBuckets.map((bucket, index) => {
              const Icon = index === 0 ? PackageCheck : ClipboardCheck;
              return (
                <article key={bucket.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-sky-700" />
                    <h2 className="text-xl font-black text-slate-900">{bucket.title}</h2>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                    {bucket.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
