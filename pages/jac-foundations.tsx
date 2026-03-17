import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Layers3, Map, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react';
import {
  jacFoundationContextAxes,
  jacFoundationEnterpriseSignals,
  jacFoundationGuardrails,
  jacFoundationInfographics,
  jacFoundationLayers,
  jacFoundationNotThisPage,
  jacFoundationPrinciples,
  jacFoundationReasons,
  jacFoundationTakeaways,
  jacFoundationsHero,
} from '@/lib/content/jacFoundations';

const CONTACT_EMAIL = 'info@nextbeinglab.org';

export default function JacFoundationsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_48%,#eef2ff_100%)] text-slate-900">
      <Head>
        <title>JAC 26フレームの3レイヤー | Next Being Lab</title>
        <meta
          name="description"
          content="JAC 26フレームの3レイヤー構成と、その背景にある職場設計の考え方を、企業担当者にも読みやすい形で紹介するページ。"
        />
        <link rel="canonical" href="https://nextbeinglab.org/jac-foundations" />
      </Head>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">JAC foundations</p>
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
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              {jacFoundationsHero.audience}
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Map size={16} />
              What You Can Take From Here
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

        <section className="grid gap-10 border-t border-slate-200 py-12 lg:grid-cols-[0.9fr,1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Layers3 size={18} className="text-sky-700" />
              <h2 className="text-2xl font-black text-slate-900">なぜ3レイヤーで見るのか</h2>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
              JAC は、困りごとをひとまとめにせず、どこで詰まりが生まれているかを切り分けて見ます。
              体調、移行、職場運用を分けて捉えることで、本人の努力不足に還元しない見立てがしやすくなります。
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
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-sky-700" />
                <h2 className="text-2xl font-black text-slate-900">JACを読む前提</h2>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {jacFoundationPrinciples.map((item) => (
                  <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
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
                  <article key={axis.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-black text-slate-900">{axis.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{axis.detail}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Layers3 size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">3レイヤーの全体像</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            まずは 3レイヤーを並べて見て、論点がどこに偏っているかを掴みます。その後に各レイヤーの詳細を見ると、図版がギャラリーではなく地図として読みやすくなります。
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {jacFoundationLayers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {layer.frameCount}
                </p>
                <h3 className="mt-3 text-2xl font-black text-slate-900">{layer.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{layer.purpose}</p>
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                  {layer.businessMeaning}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Map size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">各レイヤーをどう読むか</h2>
          </div>
          <div className="mt-6 space-y-8">
            {jacFoundationLayers.map((layer, index) => (
              <article
                key={layer.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 md:p-8"
              >
                <div className="grid gap-8 lg:grid-cols-[0.92fr,1.08fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Layer 0{index + 1} / {layer.frameCount}
                    </p>
                    <h3 className="mt-3 text-3xl font-black text-slate-900">{layer.title}</h3>
                    <p className="mt-5 text-sm leading-7 text-slate-700">{layer.purpose}</p>

                    <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                      <p className="text-sm font-semibold text-slate-900">企業担当者にとっての意味</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{layer.businessMeaning}</p>
                    </div>

                    <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                      <p className="text-sm font-semibold text-slate-900">このレイヤーで見たい問い</p>
                      <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                        {layer.typicalQuestions.map((question) => (
                          <li key={question}>• {question}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5">
                      <p className="text-sm font-semibold text-amber-950">見落としやすい点</p>
                      <p className="mt-3 text-sm leading-7 text-amber-900">{layer.blindSpot}</p>
                    </div>
                  </div>

                  <figure className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="overflow-hidden rounded-[1.3rem] bg-white p-2">
                      <Image
                        src={layer.imageSrc}
                        alt={layer.imageAlt}
                        width={2464}
                        height={1728}
                        className="h-auto max-h-[32rem] w-full object-contain"
                      />
                    </div>
                    <figcaption className="mt-4 text-xs leading-6 text-slate-500">
                      {layer.imageNote}
                    </figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="flex items-center gap-3">
            <Map size={18} className="text-sky-700" />
            <h2 className="text-2xl font-black text-slate-900">JACを支える基礎図解</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            次の図は、3レイヤーを読むときの土台になる見方です。図版そのものを覚えるというより、どの前提を補っているのかを先に押さえると読みやすくなります。
          </p>
          <div className="mt-6 space-y-8">
            {jacFoundationInfographics.map((item) => (
              <article
                key={item.title}
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
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={2400}
                      height={1600}
                      className="h-auto max-h-[30rem] w-full object-contain"
                    />
                  </div>
                </figure>
              </article>
            ))}
          </div>
        </section>

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
            <h2 className="text-2xl font-black">次に見られるもの</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              JAC の基礎を押さえたうえで、職場設計と合理的配慮の補足ページや、YouTube の基礎説明へ進めます。個別事情の整理や連携相談が必要な場合のみ、お問い合わせへつなげてください。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/for-enterprise"
                className="rounded-full border border-slate-500 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                企業向け実務メモへ
              </Link>
              <Link
                href="/videos"
                className="rounded-full border border-slate-500 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              >
                公開動画を見る
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full border border-slate-500 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-800"
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
