import Head from 'next/head';
import Link from 'next/link';
import {
  BookOpenText,
  FolderKanban,
  LibraryBig,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  resourcesCollections,
  resourcesEditorialRules,
  resourcesGuardrails,
  resourcesIntro,
  resourcesReadingPaths,
  resourcesReleaseRule,
} from '@/lib/content/resourcesFirstRelease';

const collectionTone: Record<string, string> = {
  build_now: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  review_first: 'border-amber-200 bg-amber-50 text-amber-900',
  hold: 'border-stone-300 bg-stone-100 text-stone-700',
};

export default function ResourcesFirstReleaseReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL Resources First Release</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="emerald"
          backHref="/review/relaunch-public-home"
          backLabel="Back To Relaunch Public Home"
          eyebrow={resourcesIntro.eyebrow}
          title={resourcesIntro.headline}
          subtitle={resourcesIntro.subheadline}
          sideEyebrow="Editorial Rule"
          sideTitle="素材を棚卸しのまま置かず、series として編集する。"
          sideBody="Resources はアーカイブではなく、理解と方法論をつなぐ public shelf として設計する。"
          sideExtra={
            <ul className="space-y-3 rounded-[1.4rem] border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-6 text-slate-700">
              {resourcesEditorialRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<BookOpenText size={18} className="text-cyan-700" />}
            eyebrow="Reading Logic"
            title="Resources の読み方"
            description="素材の種類より先に、どんな順で理解を深めるかを示すと、ただの倉庫に見えにくくなる。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {resourcesReadingPaths.map((path) => (
              <article key={path.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <h3 className="text-xl font-black text-slate-900">{path.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{path.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<LibraryBig size={18} className="text-emerald-700" />}
            eyebrow="Collections"
            title="初期公開で束ねる collection"
            description="build_now / review_first / hold を分けたうえで、各 collection が何を返すのかを先に示す。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {resourcesCollections.map((collection) => (
              <article key={collection.title} className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{collection.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{collection.summary}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${collectionTone[collection.status]}`}
                  >
                    {collection.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-5 rounded-[1.3rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Assets</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {collection.assets.map((asset) => (
                      <li key={asset}>• {asset}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{collection.note}</p>
                <Link
                  href={collection.href}
                  className="mt-5 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-stone-400 hover:text-slate-900"
                >
                  Review Link
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<ShieldCheck size={18} className="text-slate-700" />}
              eyebrow="Guardrails"
              title="Guardrails"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {resourcesGuardrails.map((rule) => (
                <div key={rule} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-slate-700">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ReviewSectionTitle
            icon={<FolderKanban size={18} className="text-rose-700" />}
            eyebrow="Release Rule"
            title="Release Rule"
          />
          <div className="mt-6 rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 text-sm leading-8 text-slate-700 shadow-sm shadow-stone-200/60">
            {resourcesReleaseRule}
          </div>
        </section>

        <CoreStreamFooter
          currentId="resources"
          title="Resources は他の stream とどうつながるか"
          description="Resources は資料の倉庫でなく、Methods と Vision のあいだで理解を深め、What We Do の前提をそろえる shelf として機能する。"
        />
      </main>
    </div>
  );
}
