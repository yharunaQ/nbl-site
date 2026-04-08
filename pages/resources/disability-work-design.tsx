import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import ZoomableImage from '@/components/ZoomableImage';
import SiteNav from '@/components/SiteNav';
import {
  disabilityWorkDesignEntries,
  disabilityWorkDesignGuardrails,
  disabilityWorkDesignIntro,
} from '@/lib/content/disabilityWorkDesignSeries';

export default function DisabilityWorkDesignPage() {
  return (
    <>
      <PageSeo
        title="多様な障害特性を仕事設計で理解する | Next Being Lab"
        description="診断名から支援を決めるのではなく、どの仕事条件・環境条件を変えれば働き続けられるかを問うインフォグラフィックシリーズ。視覚・聴覚・肢体・内部・知的・精神・発達・高次脳機能・難病・ニューロダイバーシティの10分類。"
        path="/resources/disability-work-design"
      />

      <SiteNav />

      <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_50%,#ecfeff_100%)] text-slate-900">
        <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">

          {/* Header nav */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Next Being Lab
              </p>
              <p className="mt-2 text-sm text-slate-600">Resources / 障害別 仕事設計の見取り図</p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Resourcesへ戻る
            </Link>
          </div>

          {/* Intro */}
          <section className="py-12">
            <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              NBL Resources
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {disabilityWorkDesignIntro.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {disabilityWorkDesignIntro.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {disabilityWorkDesignIntro.subheadline}
            </p>
            <p className="mt-4 max-w-3xl rounded-2xl border border-teal-100 bg-teal-50/60 px-5 py-4 text-sm leading-7 text-slate-700">
              {disabilityWorkDesignIntro.framingNote}
            </p>
          </section>

          {/* Infographic grid */}
          <section className="border-t border-slate-200 py-12">
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-2">
              {disabilityWorkDesignEntries.map((entry) => (
                <article
                  key={entry.slug}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-black text-slate-900">{entry.label}</h2>
                  </div>
                  <p className="mb-5 text-sm leading-7 text-slate-700">{entry.framing}</p>
                  <ZoomableImage
                    src={entry.imageSrc}
                    alt={entry.imageAlt}
                    width={1200}
                    height={900}
                    imageClassName="rounded-xl"
                  />
                </article>
              ))}
            </div>
          </section>

          {/* Guardrails */}
          <section className="border-y border-slate-200 bg-white">
            <div className="py-12">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-700" />
                <h2 className="text-2xl font-black text-slate-900">Guardrails</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {disabilityWorkDesignGuardrails.map((rule) => (
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

          {/* Next links */}
          <section className="py-12">
            <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
              <h2 className="text-2xl font-black">次に進む入口</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                  <h3 className="text-xl font-black text-white">27フレーム ガイドブック</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    就労困難を仕事・環境・支援の設計課題として読む27のフレーム。障害別インフォグラフィックの基盤となる考え方。
                  </p>
                  <Link
                    href="/guide"
                    className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                  >
                    ガイドブックを見る
                  </Link>
                </article>
                <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                  <h3 className="text-xl font-black text-white">はたらく相談室</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    個別の就労の詰まりをAI対話で整理する。このインフォグラフィックの知識がアセスメントの基盤になっています。
                  </p>
                  <Link
                    href="/jac"
                    className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                  >
                    相談室を使う
                  </Link>
                </article>
                <article className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5">
                  <h3 className="text-xl font-black text-white">見えない障害の理解</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    難病・体調変動・見えにくい困りごとを、職場設計と支援設計に橋渡しするシリーズ。
                  </p>
                  <Link
                    href="/resources/invisible-disability"
                    className="mt-5 inline-flex rounded-full border border-slate-600 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                  >
                    シリーズを見る
                  </Link>
                </article>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
