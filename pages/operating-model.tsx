import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Compass, RefreshCcw, ShieldCheck, Users, Waypoints } from 'lucide-react';
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
          content="Next Being Lab が、AI中心の運営をどの定常ループで回し、どこで人が判断境界を持つかを整理したページ。"
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
                href="/about"
                className="rounded-full border border-cyan-300 bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:border-cyan-400 hover:bg-cyan-100"
              >
                About を見る
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
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <RefreshCcw size={16} />
              Goal
            </div>
            <p className="mt-5 text-2xl font-black text-slate-900">
              AI中心の運営を、
              <br />
              気分ではなく定常ループで回す。
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              すべてを Founder
              の逐次指示に戻さず、問いの選定、比較、統合、公開判断、記録が繰り返し回る状態を目指します。
            </p>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">定常ループ</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {operatingLoops.map((loop) => (
              <article
                key={loop.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-800">
                    {loop.cadence}
                  </span>
                  <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {loop.owner}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900">{loop.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{loop.purpose}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-900">Inputs</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {loop.inputs.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-bold text-slate-900">Outputs</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {loop.outputs.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  Founder boundary: {loop.founderNeeded}
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
                      <p className="mt-4 text-sm font-bold text-slate-900">Founderが決めること</p>
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
            <h2 className="text-2xl font-black text-slate-900">止めるべきタイミング</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {operatingTriggers.map((trigger) => (
              <article
                key={trigger.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{trigger.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">When:</span> {trigger.when}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">Action:</span> {trigger.action}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">避けたい失敗モード</h2>
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
      </main>
    </div>
  );
}
