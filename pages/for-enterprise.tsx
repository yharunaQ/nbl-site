import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, ListChecks, ShieldCheck, Sparkles } from 'lucide-react';
import { publicEnterpriseEntry } from '@/lib/content/publicEnterpriseEntry';

export default function EnterpriseEntryPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
      <Head>
        <title>企業・組織向けの整理 | Next Being Lab</title>
        <meta
          name="description"
          content="合理的配慮、継続就労、ニューロダイバーシティ、相談導線を職場設計の観点から整理した、Next Being Lab の企業・組織向けページ。"
        />
        <link rel="canonical" href="https://nextbeinglab.org/for-enterprise" />
      </Head>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">企業・組織向けの整理</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            トップへ戻る
          </Link>
        </div>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              企業・組織向けの整理
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {publicEnterpriseEntry.hero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {publicEnterpriseEntry.hero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {publicEnterpriseEntry.hero.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/jac-foundations"
                className="rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
              >
                仕事設計の見取り図を見る
              </Link>
              <Link
                href="/videos"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                公開動画を見る
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                連携・お問い合わせ
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Sparkles size={16} />
              このページが返すこと
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {publicEnterpriseEntry.pageReturns.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {publicEnterpriseEntry.framingPoints.map((point) => (
            <article
              key={point.title}
              className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
            >
              <h2 className="text-xl font-black text-slate-900">{point.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{point.summary}</p>
              <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                {point.implication}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">この整理が役立ちやすい方</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {publicEnterpriseEntry.audiences.map((audience) => (
              <article
                key={audience.title}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-black text-slate-900">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{audience.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">先に共有したい実務テーマ</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            次の論点は、記事を読んだ後に `で、実務では何を見るのか`
            へ進むための起点です。タイトルだけでなく、どこから見始めるかまで書いています。
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {publicEnterpriseEntry.practicalThemes.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                <p className="mt-4 rounded-2xl border border-sky-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
                  {item.firstLook}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-3">
              <ListChecks size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">最初の3つの進め方</h2>
            </div>
            <div className="mt-5 space-y-4">
              {publicEnterpriseEntry.firstSteps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step.detail}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">このページの境界</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {publicEnterpriseEntry.boundaries.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
          <h2 className="text-2xl font-black">次に見る入口</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {publicEnterpriseEntry.resourceLinks.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">{item.summary}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
