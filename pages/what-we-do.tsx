import Link from 'next/link';
import {
  ArrowLeft,
  Boxes,
  BriefcaseBusiness,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import {
  whatWeDoArtifacts,
  whatWeDoAudiences,
  whatWeDoCommercialLanes,
  whatWeDoCopy,
  whatWeDoGuardrails,
  whatWeDoOffers,
  whatWeDoPrimaryCta,
  whatWeDoWorkflow,
} from '@/lib/content/whatWeDoReview';
import PageSeo from '@/components/PageSeo';

const offerTone = {
  offer_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  explain_only: 'border-sky-200 bg-sky-50 text-sky-900',
  hold: 'border-stone-300 bg-stone-100 text-stone-700',
} as const;

const offerLabels = {
  offer_now: 'いま案内できる',
  explain_only: '考え方として紹介',
  hold: 'いまは出さない',
} as const;

export default function WhatWeDoPage() {
  const publicOffers = whatWeDoOffers.filter((offer) => offer.state !== 'hold');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%,#ecfdf5_100%)] text-slate-900">
      <PageSeo
        title="What We Do | Next Being Lab"
        description="Next Being Lab が現在 public に案内している支援の入り口、AIチームが担う範囲、残していく成果物をまとめたページ。"
        path="/what-we-do"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">What We Do</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            トップへ戻る
          </Link>
        </div>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.08fr,0.92fr]">
          <div>
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              いま約束できること
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              現在の案内範囲
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {whatWeDoCopy.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {whatWeDoCopy.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/resources/work-support-transformation"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                変革テーマ群を見る
              </Link>
              <Link
                href="/jac-foundations"
                className="rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                仕事設計の見取り図を見る
              </Link>
              <Link
                href="/for-enterprise"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                企業向け整理を見る
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                連携・お問い合わせ
              </Link>
            </div>
            <p className="mt-5 max-w-3xl rounded-[1.4rem] border border-emerald-200 bg-emerald-50/70 px-4 py-4 text-sm leading-7 text-slate-700">
              AIが論点整理と叩き台生成を進め、高リスク判断と対外責任は人が持つ。NBL は
              `何でも相談できる窓口` ではなく、仕事設計、公開コレクション、private layer を往復させながら、
              次にも使える社会OSの部品を残す translation layer として動きます。
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Sparkles size={16} />
              このページの要点
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-900">{whatWeDoPrimaryCta.label}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{whatWeDoPrimaryCta.summary}</p>
            <ul className="mt-5 space-y-3 rounded-[1.4rem] border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-6 text-slate-700">
              {whatWeDoPrimaryCta.signals.map((signal) => (
                <li key={signal}>• {signal}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Workflow size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">どう進めるか</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whatWeDoWorkflow.map((step) => (
              <article
                key={step.step}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">現在案内している入り口</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {publicOffers.map((offer) => (
              <article
                key={offer.id}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{offer.summary}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${offerTone[offer.state]}`}
                  >
                    {offerLabels[offer.state]}
                  </span>
                </div>
                <div className="mt-5 rounded-[1.3rem] bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    主に含まれること
                  </p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {offer.includes.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">補足: {offer.caution}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <CircleDollarSign size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">公開コレクションと private layer の分け方</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            NBL は、公開物そのものを小売商品として積み上げるのではなく、free-first の公開コレクションで理解を返し、
            private layer で実装と運用を支える形を基本にしています。
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {whatWeDoCommercialLanes.map((lane) => (
              <article
                key={lane.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{lane.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{lane.summary}</p>
                <p className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  {lane.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Boxes size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">1ラウンドの後に残すもの</h2>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whatWeDoArtifacts.map((artifact) => (
              <article
                key={artifact.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
                  {artifact.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{artifact.summary}</p>
                <p className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
                  {artifact.whyItMatters}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">このページが主に想定する読者</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whatWeDoAudiences.map((audience) => (
              <article
                key={audience.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  {audience.priority}
                </p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.need}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">このページの境界</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {whatWeDoGuardrails.map((rule) => (
                <article
                  key={rule.title}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-bold text-slate-900">{rule.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{rule.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">次に見る入口</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-xl font-black text-white">Methods</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  困りごとをどんな単位で読んでいるかを先に確認したい場合の入口です。
                </p>
                <Link
                  href="/jac-foundations"
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  仕事設計の見取り図を見る
                </Link>
              </article>
              <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-xl font-black text-white">Resources</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  まず役立つ図解、シリーズ、動画の入口から入りたい場合はこちらです。
                </p>
                <Link
                  href="/resources"
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  Resources を見る
                </Link>
              </article>
              <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-xl font-black text-white">For Enterprise</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  企業や組織の担当者向けに、実務テーマをどう整理しているかを確認できます。
                </p>
                <Link
                  href="/for-enterprise"
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  企業向け整理を見る
                </Link>
              </article>
              <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-xl font-black text-white">Operating Model</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  AI がどこまで進め、人がどこで止めるかという公開上の原則を確認できます。
                </p>
                <Link
                  href="/operating-model"
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  Operating Model を見る
                </Link>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
