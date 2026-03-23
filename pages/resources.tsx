import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenText,
  FolderKanban,
  LibraryBig,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
import {
  resourcesCollections,
  resourcesEditorialRules,
  resourcesGuardrails,
  resourcesIntro,
  resourcesReadingPaths,
  resourcesReleaseRule,
  resourcesThemeMapIntro,
  resourcesThemeTracks,
} from '@/lib/content/resourcesFirstRelease';

const collectionTone: Record<string, string> = {
  build_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  review_first: 'border-amber-200 bg-amber-50 text-amber-900',
  hold: 'border-stone-300 bg-stone-100 text-stone-700',
};

const publicStatusLabel: Record<string, string> = {
  build_now: '公開中',
  review_first: '整理中',
  hold: '保留',
};

const trackTone: Record<string, string> = {
  public_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  next_up: 'border-sky-200 bg-sky-50 text-sky-900',
  organizing: 'border-stone-300 bg-stone-100 text-stone-700',
};

const trackStatusLabel: Record<string, string> = {
  public_now: '公開導線あり',
  next_up: '次に公開',
  organizing: '整理中',
};

const readingPathLinks: Record<string, { href: string; cta: string }> = {
  基礎の地図から入る: { href: '/jac-foundations', cta: '仕事設計の見取り図を見る' },
  シリーズで理解を深める: {
    href: '/resources/invisible-disability',
    cta: 'シリーズを見る',
  },
  '動画や資料で文脈を広げる': { href: '/videos', cta: '公開動画を見る' },
};

export default function ResourcesPage() {
  const publicCollections = resourcesCollections.filter((collection) => collection.status !== 'hold');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#ecfeff_100%)] text-slate-900">
      <Head>
        <title>Resources | Next Being Lab</title>
        <meta
          name="description"
          content="Next Being Lab の公開資源を、シリーズ、方法論、動画の入口ごとに整理して束ねたページ。"
        />
        <link rel="canonical" href="https://nextbeinglab.org/resources" />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">Resources</p>
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
              NBL Resources
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {resourcesIntro.eyebrow}
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {resourcesIntro.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {resourcesIntro.subheadline}
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <LibraryBig size={16} />
              公開ルール
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {resourcesEditorialRules.map((rule) => (
                <li key={rule}>• {rule}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <BookOpenText size={18} className="text-cyan-700" />
            <h2 className="text-2xl font-black text-slate-900">読み方の入口</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {resourcesReadingPaths.map((path) => {
              const link = readingPathLinks[path.title];

              return (
                <article
                  key={path.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <h3 className="text-xl font-black text-slate-900">{path.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{path.summary}</p>
                  {link ? (
                    <Link
                      href={link.href}
                      className="mt-5 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      {link.cta}
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-violet-700" />
            <h2 className="text-2xl font-black text-slate-900">整理済みのテーママップ</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">{resourcesThemeMapIntro}</p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {resourcesThemeTracks.map((track) => {
              const isAvailable = Boolean(track.publicHref);

              return (
                <article
                  key={track.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{track.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{track.summary}</p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${trackTone[track.status]}`}
                    >
                      {trackStatusLabel[track.status]}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {track.signals.map((signal) => (
                      <span
                        key={signal}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{track.note}</p>
                  {isAvailable ? (
                    <Link
                      href={track.publicHref ?? '/resources'}
                      className="mt-5 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      {track.ctaLabel ?? 'このテーマを見る'}
                    </Link>
                  ) : (
                    <p className="mt-5 text-sm leading-7 text-slate-500">
                      素材整理は進んでいるため、公開順を設計しながら順次つないでいきます。
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <LibraryBig size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">公開中の collection</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {publicCollections.map((collection) => {
              const isAvailable = Boolean(collection.publicHref);

              return (
                <article
                  key={collection.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{collection.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{collection.summary}</p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${collectionTone[collection.status]}`}
                    >
                      {publicStatusLabel[collection.status]}
                    </span>
                  </div>
                  <div className="mt-5 rounded-[1.3rem] bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Assets</p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                      {collection.assets.map((asset) => (
                        <li key={asset}>• {asset}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{collection.note}</p>
                  {isAvailable ? (
                    <Link
                      href={collection.publicHref ?? collection.href}
                      className="mt-5 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    >
                      この collection を見る
                    </Link>
                  ) : (
                    <p className="mt-5 text-sm leading-7 text-slate-500">
                      主要資料を選びながら、公開順序を整理中です。
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">Guardrails</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {resourcesGuardrails.map((rule) => (
                <div
                  key={rule}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700"
                >
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm leading-8 text-slate-700 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-3">
              <FolderKanban size={18} className="text-rose-700" />
              <h2 className="text-2xl font-black text-slate-900">公開ルールの前提</h2>
            </div>
            <p className="mt-4">{resourcesReleaseRule}</p>
          </div>
        </section>

        <section className="pb-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">次に進む入口</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-xl font-black text-white">What We Do</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  NBL がいま何を公開し、どこから話を始められるかを確認できます。
                </p>
                <Link
                  href="/what-we-do"
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  What We Do を見る
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
                <h3 className="text-xl font-black text-white">Contact</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  公開面を見たうえで内容確認や連携を始めたい場合の入口です。
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                >
                  連携・お問い合わせ
                </Link>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
