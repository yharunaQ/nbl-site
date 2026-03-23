import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Compass, ShieldCheck, Users, Waypoints } from 'lucide-react';
import {
  founderBoundaries,
  operatingLoops,
  operatingLoopsHero,
  operatingRisks,
  operatingTriggers,
} from '@/lib/content/operatingLoopsReview';

export default function OperatingModelPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_52%,#ecfeff_100%)] text-slate-900">
      <Head>
        <title>Operating Model | Next Being Lab</title>
        <meta
          name="description"
          content="Next Being Lab が、公開更新をどこまで AI で進め、どこで人が判断境界を持つかを整理したページ。"
        />
        <link rel="canonical" href="https://nextbeinglab.org/operating-model" />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">Operating Model</p>
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
            <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">
              Human-in-Command
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {operatingLoopsHero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {operatingLoopsHero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {operatingLoopsHero.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/what-we-do"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                What We Do を見る
              </Link>
              <Link
                href="/jac-foundations"
                className="rounded-full border border-cyan-300 bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:border-cyan-400 hover:bg-cyan-100"
              >
                仕事設計の見取り図を見る
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                連携・お問い合わせ
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              このページの要点
            </p>
            <div className="mt-5 space-y-3">
              <article className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-bold text-slate-900">AIが進めること</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  比較、整理、下書き、公開資源の更新を止めずに回すこと。
                </p>
              </article>
              <article className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-bold text-slate-900">人が決めること</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  公開約束、高リスク判断、外部への正式な回答と責任です。
                </p>
              </article>
              <article className="rounded-[1.4rem] border border-cyan-200 bg-cyan-50 px-4 py-4">
                <p className="text-sm font-bold text-slate-900">公開面で見せること</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  いま公開している範囲と、その更新原則だけを先に見せます。
                </p>
              </article>
            </div>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">公開面で見える3つの運営原則</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            公開サイトから見えるのは、NBL が何を更新し、どこで人が止まるかという最小単位です。内部の細かな運用ではなく、外から見て重要な原則だけを載せています。
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {operatingLoops.map((loop) => (
              <article
                key={loop.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{loop.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{loop.purpose}</p>
                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  人が確認するのは: {loop.founderNeeded}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="py-14">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-amber-700" />
              <h2 className="text-2xl font-black text-slate-900">AIと人の判断境界</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {founderBoundaries.map((boundary) => (
                <article
                  key={boundary.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-xl font-black text-slate-900">{boundary.title}</h3>
                  {boundary.aiCanDo.length > 0 ? (
                    <>
                      <p className="mt-4 text-sm font-bold text-slate-900">AIが進めること</p>
                      <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
                        {boundary.aiCanDo.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {boundary.founderDecides.length > 0 ? (
                    <>
                      <p className="mt-4 text-sm font-bold text-slate-900">人が決めること</p>
                      <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
                        {boundary.founderDecides.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Compass size={18} className="text-indigo-700" />
            <h2 className="text-2xl font-black text-slate-900">人が確認する場面</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {operatingTriggers.map((trigger) => (
              <article
                key={trigger.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{trigger.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">場面:</span> {trigger.when}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">対応:</span> {trigger.action}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">公開上の注意点</h2>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {operatingRisks.map((risk) => (
                <article
                  key={risk.title}
                  className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/60 p-6"
                >
                  <h3 className="text-xl font-black text-slate-900">{risk.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{risk.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">次に見るページ</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              このページで運営原則を掴んだら、次は NBL が今何を公開しているか、方法論をどう読んでいるか、実際に連携を始められるかへ進めます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/what-we-do"
                className="rounded-full border border-slate-500 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                What We Do を見る
              </Link>
              <Link
                href="/jac-foundations"
                className="rounded-full border border-slate-500 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                仕事設計の見取り図を見る
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-500 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-800"
              >
                連携・お問い合わせ
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
