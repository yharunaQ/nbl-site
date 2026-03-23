import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ArrowLeft, BookOpenText, Layers3, Route } from 'lucide-react';
import React from 'react';
import {
  parseCardEditionMarkdown,
  type CardEditionLayer,
} from '@/lib/content/workDesignEditorial';

type FrameReferencePageProps = {
  layers: CardEditionLayer[];
};

const COMMON_DESIGN_THINKING = '標準設計で土台を整え、個別調整で最適化する。';

function splitDesignThinking(designThinking: string) {
  const normalized = designThinking.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return { common: '', focus: '', original: '' };
  }

  if (!normalized.startsWith(COMMON_DESIGN_THINKING)) {
    return { common: '', focus: '', original: normalized };
  }

  const focus = normalized
    .slice(COMMON_DESIGN_THINKING.length)
    .trim()
    .replace(/^まずは\s*/, '')
    .replace(/を土台にし、そのうえで本人条件に合わせた個別調整を重ねる。?$/, '')
    .trim();

  return {
    common: COMMON_DESIGN_THINKING,
    focus,
    original: normalized,
  };
}

export default function WorkDesignFrameReferencePage({
  layers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_52%,#eef2ff_100%)] text-slate-900">
      <Head>
        <title>26フレームカード版 | Next Being Lab</title>
        <meta
          name="description"
          content="2026-03-09 時点の 26フレームカード版を基に、仕事設計の論点を利用者向けに読める形でまとめたページ。"
        />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">26フレームカード版</p>
          </div>
          <Link
            href="/jac-foundations"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            見取り図へ戻る
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <Link
            href="/jac-foundations"
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-slate-300 hover:text-slate-900"
          >
            見取り図
          </Link>
          <span>→</span>
          <span className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1.5 text-sky-900">
            26フレームカード版
          </span>
          <span>→</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
            詳細確認
          </span>
        </div>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.08fr,0.92fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              2026-03-09 カード版
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              26フレームを、現在の本体として読めるカード版で示す。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              このページは、2026-03-09 時点の 26フレームカード版を土台にしています。仕事設計の見取り図で見た
              3レイヤーを、フレーム単位で詳細確認できるようにした現在の本体です。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              公開本線は、見取り図とこの 26フレームカード版までに絞っています。個別判断や内部検証用の面は、
              利用者向けの導線とは分けて扱います。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {layers.map((layer) => (
                <a
                  key={layer.title}
                  href={`#${layer.title}`}
                  className="rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
                >
                  {layer.title}
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Route size={16} />
              この版の位置づけ
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <h2 className="text-lg font-black text-slate-900">いまの本体</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  26フレームの説明の仕方として、現在の本体はこのカード版です。
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <h2 className="text-lg font-black text-slate-900">このページの役割</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  見取り図で見た 3レイヤーを、各フレームの論点まで掘り下げて確認できるようにすることです。
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4">
                <h2 className="text-lg font-black text-amber-950">ここで決めないこと</h2>
                <p className="mt-2 text-sm leading-7 text-amber-900">
                  個別案件の最終判断、制度適用の断定、高リスク案件の完結はここでは行いません。
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">3レイヤー・26カード</h2>
          </div>
          <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50 px-5 py-5">
            <p className="text-sm font-semibold text-slate-900">カード全体で共通する設計原則</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{COMMON_DESIGN_THINKING}</p>
          </div>

          <div className="mt-8 space-y-8">
            {layers.map((layer) => (
              <section key={layer.title} id={layer.title} className="space-y-5">
                <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{layer.title}</h3>
                      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700">{layer.summary}</p>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900">
                      {layer.frames.length}フレーム
                    </span>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {layer.frames.map((frame) => (
                    <article
                      key={`${layer.title}-${frame.id}-${frame.title}`}
                      className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                          {frame.id}
                        </p>
                        {frame.context ? (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            先に見えやすい文脈: {frame.context}
                          </span>
                        ) : null}
                      </div>
                      <h4 className="mt-3 text-xl font-black text-slate-900">{frame.title}</h4>
                      {frame.intro ? (
                        <p className="mt-4 text-sm leading-7 text-slate-700">{frame.intro}</p>
                      ) : null}
                      {frame.jacInsight ? (
                        <div className="mt-4 rounded-[1.3rem] border border-sky-200 bg-sky-50 px-4 py-4">
                          <p className="text-sm font-semibold text-sky-950">JACの着眼点</p>
                          <p className="mt-2 text-sm leading-7 text-sky-900">{frame.jacInsight}</p>
                        </div>
                      ) : null}

                      <div className="mt-5 space-y-4">
                        {frame.severityLevels.length > 0 ? (
                          <section className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4">
                            <p className="text-sm font-semibold text-slate-900">状況レベル</p>
                            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                              {frame.severityLevels.map((item) => (
                                <li key={`${frame.id}-severity-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </section>
                        ) : null}

                        <div className="grid gap-4 lg:grid-cols-2">
                          <section className="rounded-[1.3rem] border border-emerald-200 bg-emerald-50 px-4 py-4">
                            <p className="text-sm font-semibold text-emerald-950">このフレームを使うとき</p>
                            <ul className="mt-3 space-y-2 text-sm leading-7 text-emerald-900">
                              {frame.useWhen.map((item) => (
                                <li key={`${frame.id}-use-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </section>
                          <section className="rounded-[1.3rem] border border-amber-200 bg-amber-50 px-4 py-4">
                            <p className="text-sm font-semibold text-amber-950">近いフレームとの見分け方</p>
                            <ul className="mt-3 space-y-2 text-sm leading-7 text-amber-900">
                              {frame.distinguish.map((item) => (
                                <li key={`${frame.id}-distinguish-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </section>
                        </div>

                        <section className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-4">
                          <p className="text-sm font-semibold text-slate-900">最初にやること</p>
                          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                            {frame.firstActions.map((item) => (
                              <li key={`${frame.id}-action-${item}`}>• {item}</li>
                            ))}
                          </ul>
                        </section>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <section className="rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-4">
                            <p className="text-sm font-semibold text-rose-950">見落としやすい点</p>
                            <ul className="mt-3 space-y-2 text-sm leading-7 text-rose-900">
                              {frame.pitfalls.map((item) => (
                                <li key={`${frame.id}-pitfall-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </section>
                          <section className="rounded-[1.3rem] border border-violet-200 bg-violet-50 px-4 py-4">
                            <p className="text-sm font-semibold text-violet-950">外部と一緒に考える場面</p>
                            <ul className="mt-3 space-y-2 text-sm leading-7 text-violet-900">
                              {frame.externalCollab.map((item) => (
                                <li key={`${frame.id}-external-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </section>
                        </div>

                        {frame.designThinking ? (
                          (() => {
                            const design = splitDesignThinking(frame.designThinking);

                            if (design.focus) {
                              return (
                                <section className="rounded-[1.3rem] border border-slate-900 bg-slate-950 px-4 py-4 text-slate-50">
                                  <p className="text-sm font-semibold text-slate-50">
                                    このフレームで先に整える土台
                                  </p>
                                  <p className="mt-3 text-sm leading-7 text-slate-200">{design.focus}</p>
                                </section>
                              );
                            }

                            if (design.original) {
                              return (
                                <section className="rounded-[1.3rem] border border-slate-900 bg-slate-950 px-4 py-4 text-slate-50">
                                  <p className="text-sm font-semibold text-slate-50">設計の考え方</p>
                                  <p className="mt-3 text-sm leading-7 text-slate-200">{design.original}</p>
                                </section>
                              );
                            }

                            return null;
                          })()
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <div className="flex items-center gap-3">
              <BookOpenText size={18} />
              <h2 className="text-2xl font-black">このページの使い方</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              まず見取り図で全体像をつかみ、次にこの 26フレームカード版で詳細を確かめる。この 2段を公開本線として
              使い、個別検討が必要な案件だけを別途扱います。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/jac-foundations"
                className="rounded-full border border-slate-500 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                見取り図へ戻る
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

export const getStaticProps: GetStaticProps<FrameReferencePageProps> = async () => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const sourcePath = path.join(process.cwd(), 'docs', 'guidebook', 'jac-26-card-edition.md');
  const markdown = await fs.readFile(sourcePath, 'utf8');

  return {
    props: {
      layers: parseCardEditionMarkdown(markdown),
    },
  };
};
