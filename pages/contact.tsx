import Link from 'next/link';
import { ArrowLeft, Mail, ShieldCheck, Sparkles, UserRound, Waypoints } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import { contactEntry } from '@/lib/content/contactEntry';
import { founderProfile } from '@/lib/content/founderProfile';
import ApplySection from '@/components/ApplySection';
import NewsletterSignup from '@/components/NewsletterSignup';

const CONTACT_EMAIL = 'info@nextbeinglab.org';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#eef2ff_100%)] text-slate-900">
      <PageSeo
        title="連携・お問い合わせ | Next Being Lab"
        description="Next Being Lab とどんな話を始められるか、Founder と NBL の背景、扱うテーマ、初回連絡の目安を確認できる案内ページ。"
        path="/contact"
      />

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">連携・お問い合わせ</p>
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
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              連携・お問い合わせ
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {contactEntry.hero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {contactEntry.hero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {contactEntry.hero.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
              >
                About を見る
              </Link>
              <Link
                href="/what-we-do"
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                What We Do を見る
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                メールで連絡する
              </a>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Sparkles size={16} />
              最初に分かること
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {contactEntry.quickPoints.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
            <p className="mt-5 rounded-[1.4rem] border border-sky-200 bg-sky-50/70 px-4 py-4 text-sm leading-7 text-slate-700">
              「どんなテーマで話を始めやすいか」と「NBL
              がまだ固定していない約束」を先に確認できます。
            </p>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">
              こうしたテーマで話を始めやすいです
            </h2>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {contactEntry.welcomeTopics.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <UserRound size={18} className="text-amber-700" />
                <h2 className="text-2xl font-black text-slate-900">Founder / NBL の背景</h2>
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {founderProfile.role}
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">{founderProfile.name}</p>
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
              <Link
                href="/about"
                className="mt-6 inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-950"
              >
                About を見る
              </Link>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <Waypoints size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">
                  連絡前に目線をそろえやすいページ
                </h2>
              </div>
              <div className="mt-5 space-y-4">
                {contactEntry.beforeEmailLinks.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                  >
                    <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.summary}</p>
                    <Link
                      href={item.href}
                      className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                    >
                      {item.cta}
                    </Link>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">
                  最初の連絡で共有されているとつながりやすいこと
                </h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {contactEntry.emailChecklist.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                要点が数行でも、最初のやりとりは始められます。箇条書きでも十分です。
              </p>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-700" />
                <h2 className="text-2xl font-black text-slate-900">この入口の境界</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {contactEntry.boundaries.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">最初のやりとりの進め方</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {contactEntry.steps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
                >
                  <h3 className="text-lg font-black text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{step.detail}</p>
                </article>
              ))}
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-flex rounded-full border border-slate-600 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            >
              {CONTACT_EMAIL} にメールする
            </a>
          </div>
        </section>

        <div className="border-t border-slate-200 pt-12">
          <div className="mx-auto max-w-xl px-6 mb-2">
            <p className="text-sm text-slate-500 leading-relaxed">
              AIツール「就労支援見立てサポート」の利用申込はこちらです。
              ツールの詳細は{' '}
              <Link href="/jac/intro" className="underline underline-offset-2 text-slate-700 hover:text-slate-950">
                紹介ページ
              </Link>
              {' '}で確認できます。
            </p>
          </div>
          <ApplySection />
        </div>

        <section className="border-t border-slate-200 py-12">
          <div className="mx-auto max-w-xl px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Newsletter
            </p>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              アップデートを受け取る
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              仕事設計の方法論、AIツールのアップデート、新しいリソースをメールでお届けします。
            </p>
            <NewsletterSignup />
          </div>
        </section>
      </main>
    </div>
  );
}
