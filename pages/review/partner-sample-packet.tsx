import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, ShieldCheck, Target } from 'lucide-react';
import React from 'react';
import { partnerSampleCards, partnerSampleHero, partnerSampleRanking } from '@/lib/content/partnerSamplePacketReview';

const toneClass: Record<string, string> = {
  strong: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  caution: 'border-amber-200 bg-amber-50 text-amber-900',
  compare: 'border-sky-200 bg-sky-50 text-sky-900',
  drop: 'border-rose-200 bg-rose-50 text-rose-900',
};

export default function PartnerSamplePacketReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Partner Sample Packet</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/partner-pipeline"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Partner Pipeline
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/review/partner-dossier-kit"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-800 hover:border-sky-300 hover:text-sky-900"
                >
                  Next Asset
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Dossier Kit
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                  Review Draft
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Sample Packet
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {partnerSampleHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {partnerSampleHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {partnerSampleHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Why This Helps
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  実名候補を入れる前に、記入と判定の癖を揃えられる。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  曖昧なまま本番候補を入れるより、匿名サンプルで運用の型を先に合わせる。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Anonymous Samples</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {partnerSampleCards.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${toneClass[item.tone]}`}>
                    {item.tone}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                  {item.notes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">Sample Ranking</h2>
            </div>
            <div className="mt-6 overflow-x-auto rounded-[1.8rem] border border-stone-200 bg-white">
              <table className="min-w-full divide-y divide-stone-200 text-left text-sm text-slate-700">
                <thead className="bg-stone-50 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Slot</th>
                    <th className="px-5 py-4">Candidate</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {partnerSampleRanking.map((row) => (
                    <tr key={row.slot}>
                      <td className="px-5 py-4 font-bold text-slate-900">{row.slot}</td>
                      <td className="px-5 py-4">{row.candidate}</td>
                      <td className="px-5 py-4">{row.score}</td>
                      <td className="px-5 py-4">{row.decision}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-sky-200 bg-sky-50 p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Next Move</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              匿名サンプルで埋まり方を確認したら、次は live candidate を 1 枚 dossier で持つ。founder には scattered notes ではなく、round readout だけを上げる。
            </p>
            <Link
              href="/review/partner-dossier-kit"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-900 hover:border-sky-400"
            >
              Open Dossier Kit
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
