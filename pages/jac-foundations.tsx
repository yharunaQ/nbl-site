import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Layers3, Map, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react';
import PageSeo from '@/components/PageSeo';
import ZoomableImage from '@/components/ZoomableImage';
import {
  jacFoundationContextAxes,
  jacFoundationDevelopmentIntro,
  jacFoundationDevelopmentStats,
  jacFoundationDevelopmentSteps,
  jacFoundationEnterpriseSignals,
  jacFoundationGuardrails,
  jacFoundationInfographics,
  jacFoundationLayers,
  jacFoundationNotThisPage,
  jacFoundationPathwayIntro,
  jacFoundationPathwaySteps,
  jacFoundationPathwaySupport,
  jacFoundationPrinciples,
  jacFoundationReasons,
  jacFoundationTakeaways,
  jacFoundationsHero,
} from '@/lib/content/jacFoundations';

export default function JacFoundationsPage() {
  const conditionMap = jacFoundationInfographics.find((item) => item.slug === 'condition-map');
  const supportingInfographics = jacFoundationInfographics.filter(
    (item) => item.slug !== 'condition-map',
  );
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_48%,#eef2ff_100%)] text-slate-900">
      <PageSeo
        title="仕事設計の見取り図 | Next Being Lab"
        description="仕事設計の見取り図の3レイヤー構成と、その背景にある職場設計の考え方を、企業担当者にも読みやすい形で紹介するページ。"
        path="/jac-foundations"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">仕事設計の見取り図</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            トップへ戻る
          </Link>
        </div>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              公開向けの基礎説明
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {jacFoundationsHero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {jacFoundationsHero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {jacFoundationsHero.subheadline}
            </p>
            <p className="mt-4 max-w-3xl rounded-[1.4rem] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-7 text-slate-700">
              このページは、困りごとを「本人の問題」だけでなく、体調・移行・職場運用の
              3レイヤーと、仕事・環境・支援の条件で読むための基礎ページです。
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              {jacFoundationsHero.audience}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#layers-overview"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                まず3レイヤーを見る
              </Link>
              <Link
                href="#condition-map"
                className="rounded-full border border-sky-300 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
              >
                仕事のコンディションマップを見る
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Map size={16} />
              このページで見られること
            </div>
            <div className="mt-5 space-y-4">
              {jacFoundationTakeaways.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    0{index + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-black text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-sm font-semibold text-amber-950">このページだけでは決めないこと</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-amber-900">
                {jacFoundationNotThisPage.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section id="layers-overview" className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Map size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">まず3レイヤーを見る</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            3つのレイヤーそれぞれの役割と読み方を、下のセクションで確認できます。
          </p>
          {conditionMap ? (
            <article className="mt-8 grid gap-6 rounded-[2rem] border border-sky-200 bg-sky-50/80 p-6 shadow-sm shadow-sky-100/60 lg:grid-cols-[0.92fr,1.08fr] md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-900">
                  3レイヤーを読む補助線
                </p>
                <h3 className="mt-3 text-2xl font-black text-slate-900">{conditionMap.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{conditionMap.summary}</p>
                <p className="mt-4 rounded-[1.5rem] border border-white/80 bg-white/80 px-5 py-5 text-sm leading-7 text-slate-700">
                  {conditionMap.whatItAdds}
                </p>
                <Link
                  href="#condition-map"
                  className="mt-5 inline-flex rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-900 transition hover:border-sky-400 hover:bg-sky-100"
                >
                  図解を大きく見る
                </Link>
              </div>

              <figure className="rounded-[1.8rem] border border-sky-200 bg-white p-4">
                <div className="overflow-hidden rounded-[1.3rem] bg-slate-50 p-2">
                  <Image
                    src={conditionMap.imageSrc}
                    alt={`${conditionMap.title}のプレビュー`}
                    width={2400}
                    height={1600}
                    className="h-auto max-h-[20rem] w-full object-contain"
                  />
                </div>
              </figure>
            </article>
          ) : null}
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Map size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">各レイヤーをどう読むか</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            3つを並べて見たあとに、各レイヤーで何を問い、どこを見落としやすいかを読むと、図がギャラリーではなく地図として使いやすくなります。
          </p>
          <div className="mt-6 space-y-8">
            {jacFoundationLayers.map((layer, index) => (
              <article
                key={layer.title}
                id={`layer-${index + 1}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 md:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Layer 0{index + 1}
                </p>
                <h3 className="mt-3 text-3xl font-black text-slate-900">{layer.title}</h3>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">{layer.purpose}</p>

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                    <p className="text-sm font-semibold text-slate-900">
                      企業担当者にとっての意味
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {layer.businessMeaning}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                    <p className="text-sm font-semibold text-slate-900">
                      このレイヤーで見たい問い
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                      {layer.typicalQuestions.map((question) => (
                        <li key={question}>• {question}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5">
                    <p className="text-sm font-semibold text-amber-950">見落としやすい点</p>
                    <p className="mt-3 text-sm leading-7 text-amber-900">{layer.blindSpot}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {conditionMap ? (
          <section id="condition-map" className="border-t border-slate-200 py-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
                <div className="flex items-center gap-3">
                  <Map size={18} className="text-sky-700" />
                  <h2 className="text-2xl font-black text-slate-900">条件を重ねて読むための基礎図解</h2>
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-900">{conditionMap.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{conditionMap.summary}</p>
                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-900">この図が補うこと</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{conditionMap.whatItAdds}</p>
                </div>
                <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                  <p className="text-sm font-semibold text-slate-900">企業読者への意味</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {conditionMap.businessMeaning}
                  </p>
                </div>
              </article>

              <figure className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
                  <ZoomableImage
                    src={conditionMap.imageSrc}
                    alt={conditionMap.imageAlt}
                    width={2400}
                    height={1600}
                    imageClassName="h-auto max-h-[32rem] w-full object-contain"
                  />
                </div>
              </figure>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-sky-700" />
                  <h2 className="text-2xl font-black text-slate-900">この見取り図を読む前提</h2>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {jacFoundationPrinciples.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-slate-700" />
                  <h2 className="text-2xl font-black text-slate-900">個別化するときに最低限見る軸</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">
                  3レイヤーで全体像を掴んだ後も、そのまま結論には進みません。本人、仕事、環境、支援、時間、制度の条件を重ねてはじめて、個別事情に近い見立てになります。
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {jacFoundationContextAxes.map((axis) => (
                    <article
                      key={axis.title}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                    >
                      <h3 className="text-lg font-black text-slate-900">{axis.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{axis.detail}</p>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
            <div>
              <div className="flex items-center gap-3">
                <Layers3 size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">なぜこの見方を取るのか</h2>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
                困りごとを本人の属性だけに閉じず、どこで詰まりが生まれているかを切り分けて見るために、NBL
                は体調、移行、職場運用の3レイヤーを使っています。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {jacFoundationReasons.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-8 lg:grid-cols-[0.92fr,1.08fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {jacFoundationDevelopmentIntro.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">
                {jacFoundationDevelopmentIntro.headline}
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">
                {jacFoundationDevelopmentIntro.summary}
              </p>
              <p className="mt-4 max-w-3xl rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5 text-sm leading-7 text-slate-700">
                {jacFoundationDevelopmentIntro.note}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {jacFoundationDevelopmentStats.map((item) => (
                <article
                  key={`${item.value}-${item.label}`}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
                >
                  <p className="text-2xl font-black tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {jacFoundationDevelopmentSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Step {item.step}
                </p>
                <h3 className="mt-3 text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                <p className="mt-4 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                  {item.evidence}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-8 lg:grid-cols-[0.92fr,1.08fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {jacFoundationPathwayIntro.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">
                {jacFoundationPathwayIntro.headline}
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">
                {jacFoundationPathwayIntro.summary}
              </p>
            </div>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-700" />
                <h2 className="text-2xl font-black text-slate-900">
                  個別設計へ進むときの境界
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                この見取り図は、個別案件の最終判断を自動で返すためのものではありません。個別化が必要なときは、本人、仕事、環境、支援、時間、制度の条件を重ね、高リスク判断は人が持ちます。
              </p>
              <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                <p className="text-sm font-semibold text-slate-900">
                  典型パターンを確認したら、はたらく相談室（AI対話）で個別ケースの仮見立てへ進めます。
                </p>
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jacFoundationPathwaySteps.map((item) => {
              const statusClassName =
                item.status === '公開中'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : item.status === '招待制・無償'
                    ? 'border-sky-200 bg-sky-50 text-sky-900'
                    : item.status === '整備中'
                      ? 'border-cyan-200 bg-cyan-50 text-cyan-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900';

              return (
                <article
                  key={item.step}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Step {item.step}
                    </p>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold tracking-[0.16em] ${statusClassName}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.detail}</p>
                  <div className="mt-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">この段階の意味</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.businessMeaning}</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.routeNote}</p>
                  {item.href && item.cta ? (
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-950"
                    >
                      {item.cta}
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>

          <article className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">{jacFoundationPathwaySupport.title}</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-200">
              {jacFoundationPathwaySupport.detail}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
              {jacFoundationPathwaySupport.bullets.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </section>

        {supportingInfographics.length > 0 ? (
          <section className="border-t border-slate-200 py-12">
            <div className="flex items-center gap-3">
              <Map size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">関連する基礎図解</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
              3レイヤーと条件軸を掴んだあとに読むと、仕事設計としての論点がよりつながって見えてきます。
            </p>
            <div className="mt-6 space-y-8">
              {supportingInfographics.map((item) => (
                <article
                  key={item.title}
                  id={item.slug}
                  className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 lg:grid-cols-[0.88fr,1.12fr] md:p-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
                    <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                      <p className="text-sm font-semibold text-slate-900">この図が補うこと</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.whatItAdds}</p>
                    </div>
                    <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                      <p className="text-sm font-semibold text-slate-900">企業読者への意味</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.businessMeaning}</p>
                    </div>
                  </div>

                  <figure className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="overflow-hidden rounded-[1.3rem] bg-white p-2">
                      <ZoomableImage
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        width={2400}
                        height={1600}
                        imageClassName="h-auto max-h-[30rem] w-full object-contain"
                      />
                    </div>
                  </figure>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">企業担当者への示唆</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {jacFoundationEnterpriseSignals.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-700" />
                <h2 className="text-2xl font-black text-slate-900">このページでしないこと</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {jacFoundationGuardrails.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-50 shadow-sm shadow-slate-300/50">
            <h2 className="text-2xl font-black">次のステップ</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              3レイヤーの全体構造を確認したら、インタラクティブガイドで詳細を確かめてください。
              個別ケースの条件整理は、はたらく相談室（AI対話）で行えます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/jac/guide"
                className="rounded-full border border-slate-500 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                仕事設計ガイド（インタラクティブ）
              </Link>
              <Link
                href="/jac"
                className="rounded-full border border-slate-500 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                はたらく相談室（AI対話）
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
