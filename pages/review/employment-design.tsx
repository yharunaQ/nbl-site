import Head from 'next/head';
import { Layers3, Route, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react';
import ZoomableImage from '@/components/ZoomableImage';
import { CoreStreamFooter } from '@/components/review/CoreStreamFooter';
import { ReviewHeroShell } from '@/components/review/ReviewHeroShell';
import { ReviewSectionTitle } from '@/components/review/ReviewSectionTitle';
import {
  employmentDesignClusters,
  employmentDesignFounderBoundary,
  employmentDesignGuardrails,
  employmentDesignHero,
  employmentDesignSequence,
  employmentDesignSignals,
  employmentDesignThemeLanes,
} from '@/lib/content/employmentDesignReview';

const clusterTone: Record<string, string> = {
  public_anchor: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  rewrite_needed: 'border-amber-200 bg-amber-50 text-amber-900',
};

const clusterLabel: Record<string, string> = {
  public_anchor: 'anchor',
  rewrite_needed: 'rewrite needed',
};

export default function EmploymentDesignReviewPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-slate-900">
      <Head>
        <title>Review Draft | NBL Employment Design</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main>
        <ReviewHeroShell
          theme="amber"
          backHref="/review/resources-first-release"
          backLabel="Back To Resources First Release"
          eyebrow={employmentDesignHero.eyebrow}
          title={employmentDesignHero.headline}
          subtitle={employmentDesignHero.subheadline}
          sideEyebrow="Current Boundary"
          sideTitle="制度批評を、現場で使える設計の言葉に訳し直す。"
          sideBody="今回は、`インフォグラフィック群` の棚卸しを 1 枚の hidden review へ進めるテスト。制度批評を前面に出すのではなく、仕事設計・支援設計・制度設計を同じ地図で読む collection 候補として束ね直す。運用上は、AI がここまで進め、public candidate の境界で Founder が切る。"
          sideExtra={
            <ul className="space-y-3 rounded-[1.4rem] border border-amber-200 bg-amber-50/70 p-4 text-sm leading-6 text-slate-700">
              {employmentDesignFounderBoundary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          }
        />

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Sparkles size={18} className="text-amber-700" />}
            eyebrow="Revival Logic"
            title="なぜこの候補を先に起こすか"
            description="大量の PNG や図解をそのまま出すのではなく、NBL の読み方が最も出やすい束から先に draft 化する。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {employmentDesignSignals.map((signal) => (
              <article
                key={signal.title}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
                  {signal.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-700">{signal.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Route size={18} className="text-cyan-700" />}
            eyebrow="Theme Lanes"
            title="3つの変革テーマをどう位置づけるか"
            description="この課題は企業だけの課題ではない。世界標準、日本の制度課題、慢性疾患支援を、NBL の仕事設計と resources の両方につながるテーマとして整理する。"
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {employmentDesignThemeLanes.map((lane) => (
              <article
                key={lane.title}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <h3 className="text-xl font-black text-slate-900">{lane.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{lane.summary}</p>

                <div className="mt-5 rounded-[1.4rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    NBL での役割
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{lane.nblRole}</p>
                </div>

                <div className="mt-4 rounded-[1.4rem] bg-stone-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    サイトでの位置づけ
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{lane.siteRole}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {lane.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {signal}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{lane.nextMove}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Layers3 size={18} className="text-cyan-700" />}
            eyebrow="Draft Collection"
            title="現在の hidden review 構成"
            description="3レイヤーとコンディションマップを anchor に置き、正常化と質の指標は rewrite 前提の補助図として扱う。"
          />
          <div className="mt-6 space-y-6">
            {employmentDesignClusters.map((cluster) => (
              <article
                key={cluster.id}
                className="rounded-[1.9rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl font-black text-slate-900">{cluster.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{cluster.summary}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${clusterTone[cluster.status]}`}
                  >
                    {clusterLabel[cluster.status]}
                  </span>
                </div>

                <div
                  className={`mt-6 grid gap-4 ${
                    cluster.images.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
                  }`}
                >
                  {cluster.images.map((image) => (
                    <figure key={image.src} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-3">
                      <div className="relative overflow-hidden rounded-[1.2rem] bg-white aspect-[4/3]">
                        <ZoomableImage
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          buttonClassName="h-full"
                          imageClassName="object-contain p-2"
                        />
                      </div>
                      <figcaption className="mt-3 text-sm font-semibold text-slate-700">
                        {image.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Why It Matters
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{cluster.whyItMatters}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Caution
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{cluster.caution}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Next Move
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{cluster.nextMove}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cluster.lenses.map((lens) => (
                        <span
                          key={lens}
                          className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {lens}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <ReviewSectionTitle
            icon={<Route size={18} className="text-emerald-700" />}
            eyebrow="Sequence"
            title="public candidate に上げる前の並べ順"
            description="強い主張画像から入るのではなく、方法論の anchor から始めて制度・評価軸へ進む。"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {employmentDesignSequence.map((step) => (
              <article
                key={step.step}
                className="rounded-[1.8rem] border border-stone-300 bg-white/92 p-6 shadow-sm shadow-stone-200/60"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-xl font-black text-slate-900">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <ReviewSectionTitle
              icon={<ShieldCheck size={18} className="text-slate-700" />}
              eyebrow="Guardrails"
              title="公開前に崩さない線"
              description="障害・難病領域の図解は、強いメッセージほど文脈を失いやすい。ここでは NBL らしい読み筋を守る。"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {employmentDesignGuardrails.map((rule) => (
                <article
                  key={rule}
                  className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-slate-700"
                >
                  {rule}
                </article>
              ))}
            </div>
          </div>
        </section>

        <CoreStreamFooter
          currentId="methods"
          title="Methods と Resources のあいだでどう使うか"
          description="この draft は、Resources の次候補でありつつ、Methods の読み方を public に見せる collection でもある。JAC foundations と見えない障害シリーズの間をつなぐ shelf として育てる。"
        />
      </main>
    </div>
  );
}
