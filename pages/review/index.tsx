import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, BookOpenText, BriefcaseBusiness, Compass, Workflow } from 'lucide-react';
import React from 'react';
import { reviewIndexCategories, reviewReadingOrder } from '@/lib/content/reviewIndex';

const statusTone: Record<string, string> = {
  foundational: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  important: 'border-sky-200 bg-sky-50 text-sky-900',
  operational: 'border-amber-200 bg-amber-50 text-amber-900',
};

const categoryIcon: Record<string, React.ReactNode> = {
  site: <BookOpenText size={18} className="text-emerald-700" />,
  business: <BriefcaseBusiness size={18} className="text-sky-700" />,
  ops: <Workflow size={18} className="text-amber-700" />,
};

export default function ReviewIndexPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Drafts | NBL</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#fffef8_0%,_#f8fafc_60%,_#f5f5f4_100%)]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-10 md:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
                Review Index
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Hidden Drafts
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700">
                <Compass size={16} />
                Local Review Navigator
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Review Drafts</p>
                <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  hidden review pages を、一覧と読む順番つきでまとめる。
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                  細かい route を覚えなくても、このページから `site`、`business`、`ops` の drafts を横断できる。
                </p>
              </div>

              <aside className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.4)]">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                  <BadgeCheck size={16} />
                  Suggested Reading Order
                </div>
                <ol className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                  {reviewReadingOrder.map((href, index) => (
                    <li key={href} className="rounded-[1rem] bg-stone-100 px-4 py-3">
                      <span className="font-bold text-slate-900">{index + 1}.</span> {href}
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="space-y-12">
            {reviewIndexCategories.map((category) => (
              <section key={category.id}>
                <div className="flex items-center gap-3">
                  {categoryIcon[category.id]}
                  <h2 className="text-2xl font-black text-slate-900">{category.title}</h2>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{category.summary}</p>
                <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {category.items.map((item) => (
                    <article key={item.href} className="rounded-[1.8rem] border border-stone-200 bg-white p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${statusTone[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                      <Link
                        href={item.href}
                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-slate-900 hover:border-stone-400 hover:bg-white"
                      >
                        Open Draft
                        <ArrowRight size={16} />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
