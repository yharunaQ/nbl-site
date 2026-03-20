import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CircleDot,
  PlayCircle,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import React from 'react';
import ZoomableImage from '@/components/ZoomableImage';
import {
  invisibleDisabilityGuardrails,
  invisibleDisabilityInitialLaunchSlugs,
  invisibleDisabilitySections,
  invisibleDisabilityStats,
  invisibleDisabilityVideos,
} from '@/lib/content/invisibleDisabilitySeries';

type InvisibleDisabilitySeriesPageProps = {
  variant: 'public' | 'review';
  backHref: string;
  backLabel: string;
};

function aspectClass(imageOrientation: 'portrait' | 'landscape') {
  return imageOrientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/10]';
}

const initialLaunchSlugSet = new Set<string>(invisibleDisabilityInitialLaunchSlugs);

export default function InvisibleDisabilitySeriesPage({
  variant,
  backHref,
  backLabel,
}: InvisibleDisabilitySeriesPageProps) {
  const isReview = variant === 'review';
  const visibleSections = isReview
    ? invisibleDisabilitySections
    : invisibleDisabilitySections
        .map((section) => ({
          ...section,
          cards: section.cards.filter((card) => initialLaunchSlugSet.has(card.slug)),
        }))
        .filter((section) => section.cards.length > 0);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.45),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_28%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_55%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20 md:pt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                {backLabel}
              </Link>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${
                  isReview
                    ? 'border border-amber-200 bg-amber-50 text-amber-800'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
              >
                {isReview ? 'Review Draft' : 'Public Series'}
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isReview ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                {isReview ? 'Noindex' : 'Resources'}
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
              <div className="space-y-7">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
                    Invisible Disability Series
                  </p>
                  <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                    見えない障害の理解を、
                    <span className="block text-slate-500">理解で終わらせず設計へつなぐ。</span>
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-slate-700 md:text-xl">
                    {isReview ? (
                      <>
                        当事者理解インフォグラフィックと4コマまんがを、NBLの
                        <span className="mx-1 rounded bg-sky-100 px-1.5 py-0.5 font-semibold text-sky-900">
                          review-first
                        </span>
                        なシリーズページとして束ねた draft です。病名知識だけでなく、仕事や支援の設計へ橋渡しする導線まで含めています。
                      </>
                    ) : (
                      <>
                        見た目では分かりにくい困りごとを、病名の解説だけで終わらせず、働く場の理解と設計へつなげるためのシリーズです。
                        最初の公開では、共通する壁が見えやすい5点を選び、理解から運用までの流れがつかめる構成にしています。
                      </>
                    )}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {invisibleDisabilityStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/85 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  <ShieldCheck size={16} />
                  Guardrails
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                  {invisibleDisabilityGuardrails.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CircleDot size={16} className="mt-1 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-stone-100 p-4 text-sm leading-6 text-slate-600">
                  {isReview
                    ? '初回公開ではホームに大量掲出せず、`Resources` か `Insights` の1シリーズページとして見せる想定です。'
                    : 'このシリーズは、かわいそうな話として消費するためではなく、仕事・運用・支援の摩擦を理解し直す入口として使う想定です。'}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 md:py-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-3 text-sky-700">
                <BookOpen size={18} />
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Lived Experience</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">
                見えにくい困りごとを、かわいそうではなく理解可能な形へ。
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-3 text-rose-700">
                <ShieldCheck size={18} />
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Misunderstanding</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">
                よくある誤解や説明負荷を、職場の摩擦として見直す。
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
              <div className="flex items-center gap-3 text-emerald-700">
                <Workflow size={18} />
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Work Design</p>
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">
                理解を、運用ルールや支援設計に接続して終える。
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-8 px-6 pb-20">
          {visibleSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`rounded-[2rem] border border-stone-200 bg-gradient-to-br ${section.accent} p-6 md:p-8`}
            >
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                  {section.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-700 md:text-lg">
                  {section.summary}
                </p>
              </div>

              <div className="mt-8 space-y-6">
                {section.cards.map((card) => (
                  <article
                    key={card.slug}
                    className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]"
                  >
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                      <div className="border-b border-stone-200/80 p-4 lg:border-b-0 lg:border-r">
                        <div
                          className={`relative overflow-hidden rounded-[1.4rem] bg-stone-100 ${aspectClass(card.imageOrientation)}`}
                        >
                          <ZoomableImage
                            src={card.imageSrc}
                            alt={card.imageAlt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            buttonClassName="h-full"
                            imageClassName="object-cover object-top"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-between p-6 md:p-7">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                            {card.role}
                          </p>
                          <h3 className="mt-3 text-2xl font-black text-slate-900">{card.title}</h3>
                          <p className="mt-4 text-sm leading-7 text-slate-700">{card.whyNow}</p>
                        </div>

                        <dl className="mt-6 space-y-4 rounded-[1.5rem] bg-stone-100/80 p-5">
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              What this piece highlights
                            </dt>
                            <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                              {card.context.highlight}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              Why it matters at work
                            </dt>
                            <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                              {card.context.workReason}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              Do not overgeneralize
                            </dt>
                            <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                              {card.context.caution}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                              Related approach or resource
                            </dt>
                            <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                              {card.context.related}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,_#0f172a,_#1e293b_55%,_#0f766e)] p-8 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-200">
                {isReview ? 'Release Recommendation' : 'Reading Recommendation'}
              </p>
              <h2 className="mt-4 text-3xl font-black">
                {isReview
                  ? 'まずは1ページ、5点構成で出すのが安全です。'
                  : 'まずは5点の公開セットから読み始められます。'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-100">
                {isReview
                  ? '`難病共通`、`からだの中の天気予報`、`見えないバックパック`、`体調に“波”がある人と働く`、`難病×支援機関あるある` の5点だけでも、理解から運用までの流れは十分に作れます。'
                  : 'まずは `難病共通`、`からだの中の天気予報`、`見えないバックパック`、`体調に“波”がある人と働く`、`難病×支援機関あるある` の5点から入ると、共通する壁と支援設計のつながりがつかみやすくなります。'}
              </p>
            </div>

            <aside className="rounded-[2rem] border border-stone-200 bg-stone-50 p-8">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                <PlayCircle size={16} />
                Related Videos
              </div>
              <div className="mt-5 space-y-4">
                {invisibleDisabilityVideos.map((video) => (
                  <a
                    key={video.url}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[1.4rem] border border-stone-200 bg-white p-5 transition-colors hover:border-slate-400"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{video.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{video.note}</p>
                      </div>
                      <ArrowUpRight size={18} className="shrink-0 text-slate-400" />
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
