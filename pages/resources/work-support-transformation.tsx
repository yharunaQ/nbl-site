import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDot,
  LibraryBig,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';
import PageSeo from '@/components/PageSeo';
import ZoomableImage from '@/components/ZoomableImage';
import {
  workSupportTransformationGuardrails,
  workSupportTransformationHero,
  workSupportTransformationPaths,
  workSupportTransformationPositioning,
  workSupportTransformationSections,
  workSupportTransformationSignals,
  workSupportTransformationVideos,
} from '@/lib/content/workSupportTransformation';

function aspectClass(imageOrientation: 'landscape' | 'portrait') {
  return imageOrientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[16/10]';
}

export default function WorkSupportTransformationPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <PageSeo
        title="就労支援設計の変革テーマ群 | Next Being Lab"
        description="障害者雇用支援の世界標準、日本における変革課題、慢性疾患の支援を、制度・専門支援・仕事設計をつなぐ公開 collection としてまとめた Next Being Lab のページ。"
        path="/resources/work-support-transformation"
      />

      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.45),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(167,243,208,0.25),_transparent_30%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_55%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20 md:pt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-stone-400 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Resourcesへ戻る
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
                Public Collection
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Social OS Layer
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
              <div className="space-y-7">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
                    {workSupportTransformationHero.eyebrow}
                  </p>
                  <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                    {workSupportTransformationHero.headline}
                    <span className="block text-slate-500">制度と仕事設計を、同じ地図で読む。</span>
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-slate-700 md:text-xl">
                    {workSupportTransformationHero.subheadline}
                  </p>
                  <p className="max-w-3xl rounded-[1.5rem] border border-sky-200 bg-sky-50/80 px-5 py-5 text-sm leading-7 text-slate-700">
                    {workSupportTransformationHero.supportingCopy}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {workSupportTransformationSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {signal.label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{signal.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/88 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  <LibraryBig size={16} />
                  NBL での位置づけ
                </div>
                <div className="mt-5 space-y-4">
                  {workSupportTransformationPositioning.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[1.4rem] border border-stone-200 bg-stone-50 px-4 py-4"
                    >
                      <h2 className="text-lg font-black text-slate-900">{item.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 md:py-12">
          {workSupportTransformationSections.map((section) => (
            <section
              key={section.id}
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

              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                {section.cards.map((card) => (
                  <article
                    key={card.slug}
                    className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/92 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]"
                  >
                    <div className="border-b border-stone-200/80 p-4">
                      <div
                        className={`relative overflow-hidden rounded-[1.4rem] bg-stone-100 ${aspectClass(card.imageOrientation)}`}
                      >
                        <ZoomableImage
                          src={card.imageSrc}
                          alt={card.imageAlt}
                          fill
                          sizes="(max-width: 1280px) 100vw, 50vw"
                          buttonClassName="h-full"
                          imageClassName="object-contain p-2"
                        />
                      </div>
                    </div>

                    <div className="p-6 md:p-7">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        {card.role}
                      </p>
                      <h3 className="mt-3 text-2xl font-black text-slate-900">{card.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-slate-700">{card.summary}</p>

                      <dl className="mt-6 space-y-4 rounded-[1.5rem] bg-stone-100/80 p-5">
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            Why it matters
                          </dt>
                          <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                            {card.whyItMatters}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            Caution
                          </dt>
                          <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                            {card.caution}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            Related
                          </dt>
                          <dd className="mt-1.5 text-sm leading-7 text-slate-800">
                            {card.relatedLabel}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
              <article>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-slate-700" />
                  <h2 className="text-2xl font-black text-slate-900">この collection の境界</h2>
                </div>
                <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
                  {workSupportTransformationGuardrails.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CircleDot size={16} className="mt-1 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
                <div className="flex items-center gap-3">
                  <PlayCircle size={18} className="text-sky-700" />
                  <h2 className="text-2xl font-black text-slate-900">補助動画</h2>
                </div>
                <div className="mt-5 space-y-4">
                  {workSupportTransformationVideos.map((video) => (
                    <a
                      key={video.title}
                      href={video.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-[1.4rem] border border-stone-200 bg-white px-4 py-4 transition hover:border-stone-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">{video.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-700">{video.note}</p>
                        </div>
                        <ArrowUpRight size={16} className="mt-1 shrink-0 text-slate-500" />
                      </div>
                    </a>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">次に見る入口</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {workSupportTransformationPaths.map((path) => (
                <article
                  key={path.title}
                  className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
                >
                  <h3 className="text-xl font-black text-white">{path.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{path.summary}</p>
                  <Link
                    href={path.href}
                    className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                  >
                    {path.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
