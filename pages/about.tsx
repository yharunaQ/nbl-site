import Link from 'next/link';
import {
  ArrowLeft,
  GitBranchPlus,
  Layers3,
  ShieldCheck,
  Sparkles,
  UserRound,
  Waypoints,
} from 'lucide-react';
import {
  aboutReviewGuardrails,
  aboutReviewHero,
  aboutReviewHorizons,
  aboutReviewKeyPoints,
  aboutReviewPillars,
  aboutReviewShifts,
  aboutReviewSystemSteps,
} from '@/lib/content/aboutReview';
import PageSeo from '@/components/PageSeo';
import { founderProfile } from '@/lib/content/founderProfile';

const STREAM_LINKS: Record<string, { href: string; cta: string }> = {
  'What We Do': { href: '/what-we-do', cta: 'What We Do を見る' },
  Methods: { href: '/jac-foundations', cta: '仕事設計の見取り図を見る' },
  Resources: { href: '/resources', cta: 'Resources を見る' },
  'Operating Model': { href: '/operating-model', cta: 'Operating Model を見る' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#fef3c7_100%)] text-slate-900">
      <PageSeo
        title="About | Next Being Lab"
        description="Next Being Lab が何を目指し、何を目指さず、現場R&Dから参加設計までをどうつないでいるかをまとめたページ。"
        path="/about"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">About</p>
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
            <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              NBL Purpose
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {aboutReviewHero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {aboutReviewHero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {aboutReviewHero.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/what-we-do"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                What We Do を見る
              </Link>
              <Link
                href="/for-enterprise"
                className="rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
              >
                企業向け整理を見る
              </Link>
              <Link
                href="/operating-model"
                className="rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:border-amber-400 hover:bg-amber-100"
              >
                Operating Model を見る
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                連携・お問い合わせ
              </Link>
            </div>
            <p className="mt-5 max-w-3xl rounded-[1.4rem] border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm leading-7 text-slate-700">
              AI-native だから信頼できるのではなく、どこで AI が進み、どこで人が止めるかが見えるから
              trust が積み上がる。NBL はその境界ごと public に設計します。
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Sparkles size={16} />
              このページの要点
            </div>
            <div className="mt-5 space-y-4">
              {aboutReviewKeyPoints.map((point) => (
                <article
                  key={point.title}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <h2 className="text-lg font-black text-slate-900">{point.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{point.summary}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <UserRound size={18} className="text-amber-700" />
                <h2 className="text-2xl font-black text-slate-900">Founder</h2>
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {founderProfile.role}
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{founderProfile.name}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{founderProfile.credential}</p>
              <a
                href={founderProfile.researchProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
              >
                {founderProfile.researchProfileLabel}
              </a>
              <p className="mt-4 text-sm leading-7 text-slate-700">{founderProfile.summary}</p>
              <p className="mt-4 rounded-[1.4rem] border border-amber-200 bg-amber-50/70 px-4 py-4 text-sm leading-7 text-slate-700">
                {founderProfile.stance}
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {founderProfile.focus.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">連絡前に分かること</h2>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-700">
                NBL は、Founder
                個人への直接相談だけで回る組織ではなく、方法論、図解、動画、AI運営のループを積み上げる形で動いています。
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                そのうえで、内容確認、共同検討、登壇や研究連携について話を始められます。迷う場合は、連携・お問い合わせページから入れます。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
                >
                  連携・お問い合わせ
                </Link>
                <Link
                  href="/what-we-do"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  What We Do を見る
                </Link>
                <Link
                  href="/for-enterprise"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  企業向け整理を見る
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">現場から何を積み上げるか</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aboutReviewSystemSteps.map((step) => (
              <article
                key={step.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{step.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <GitBranchPlus size={18} className="text-amber-700" />
            <h2 className="text-2xl font-black text-slate-900">いまの実装と、その先の地平</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {aboutReviewHorizons.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-amber-200 bg-amber-50/70 p-6"
              >
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Waypoints size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">従来の読み方から何をずらすか</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {aboutReviewShifts.map((shift) => (
              <article
                key={shift.from}
                className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">From</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">{shift.from}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  To
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{shift.to}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-emerald-700" />
            <h2 className="text-2xl font-black text-slate-900">いまの4つの流れ</h2>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {aboutReviewPillars.map((pillar) => {
              const link = STREAM_LINKS[pillar.title];

              return (
                <article
                  key={pillar.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <h3 className="text-xl font-black text-slate-900">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{pillar.summary}</p>
                  {link ? (
                    <Link
                      href={link.href}
                      className="mt-5 inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-950"
                    >
                      {link.cta}
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="py-14">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-700" />
              <h2 className="text-2xl font-black text-slate-900">読み違えないための境界</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {aboutReviewGuardrails.map((rule) => (
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
      </main>
    </div>
  );
}
