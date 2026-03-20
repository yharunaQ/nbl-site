import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, FileText, FolderKanban, ShieldCheck } from 'lucide-react';
import React from 'react';
import { partnerDossierAssets, partnerDossierHero, partnerDossierRules } from '@/lib/content/partnerDossierKitReview';

export default function PartnerDossierKitReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | NBL Partner Dossier Kit</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/review/partner-sample-packet"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back To Partner Sample Packet
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                Review Draft
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Dossier Kit
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  {partnerDossierHero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  {partnerDossierHero.headline}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  {partnerDossierHero.subheadline}
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Why This Helps
                </div>
                <p className="mt-5 text-xl font-black text-slate-900">
                  founder が scattered notes を追わなくても current state を掴める。
                </p>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4 text-sm leading-7 text-slate-700">
                  live candidate が増えても、判断の正本を dossier と round readout に寄せる。
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-3">
            <FolderKanban size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">Kit Assets</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {partnerDossierAssets.map((item) => (
              <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">Operating Rules</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {partnerDossierRules.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-stone-200 bg-stone-50 p-6">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-sky-200 bg-sky-50 p-8">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">Next Move</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              実名候補が入り次第、A1 / A2 / B1 / C1 ごとに dossier を作る。3-4 conversation 後は round readout へ閉じ、advance 候補だけ短い memo を founder に上げる。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
