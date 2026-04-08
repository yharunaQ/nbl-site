/**
 * Homepage Design Variant B — "Editorial / Data-Forward"
 * Preview only. Not indexed. Compare with current: /
 */
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const PROBLEM_STATS = [
  {
    num: '46.9%',
    label: '効果的な支援が届いていない',
    sub: 'n=9,076 当事者・難病患者 / NBL分析',
    color: 'border-rose-200 bg-rose-50',
    numColor: 'text-rose-600',
    labelColor: 'text-rose-900',
  },
  {
    num: '71.9%',
    label: '意欲はあるが実施できていない支援者',
    sub: 'n=3,053 支援者調査（JEED/NIVR）',
    color: 'border-amber-200 bg-amber-50',
    numColor: 'text-amber-600',
    labelColor: 'text-amber-900',
  },
  {
    num: '最大6倍',
    label: '都道府県別 支援実践率の格差',
    sub: 'n=3,053 支援者調査 / NBL分析',
    color: 'border-sky-200 bg-sky-50',
    numColor: 'text-sky-600',
    labelColor: 'text-sky-900',
  },
];

const TOOLS = [
  {
    index: '01',
    name: 'はたらく相談室',
    tagline: 'AI対話で就労の詰まりを構造化する',
    desc: '相談事例を入力すると、就労困難の構造仮説と具体的な一手を示します。支援者・当事者の双方が使えます。',
    href: '/jac',
    accent: 'teal',
  },
  {
    index: '02',
    name: '27フレーム ガイドブック',
    tagline: '就労困難を設計課題として読み替える',
    desc: '個人の特性ではなく、仕事・環境・支援の設計課題として就労の詰まりを理解する27のフレーム。',
    href: '/guide',
    accent: 'indigo',
  },
  {
    index: '03',
    name: '実践知識',
    tagline: '現場で効いている支援の体系知識',
    desc: '地域格差の構造、支援効果のエビデンス、障害別の仕事設計。実践者がすぐに使える知識ネットワーク。',
    href: '/knowledge',
    accent: 'amber',
  },
];

const ACCENT_COLORS: Record<string, { border: string; tag: string; num: string }> = {
  teal: {
    border: 'group-hover:border-teal-400',
    tag: 'bg-teal-100 text-teal-800',
    num: 'text-teal-500',
  },
  indigo: {
    border: 'group-hover:border-indigo-400',
    tag: 'bg-indigo-100 text-indigo-800',
    num: 'text-indigo-400',
  },
  amber: {
    border: 'group-hover:border-amber-400',
    tag: 'bg-amber-100 text-amber-800',
    num: 'text-amber-500',
  },
};

export default function HomeVariantB() {
  return (
    <>
      <PageSeo
        title="[Preview B] Next Being Lab"
        description="Design preview — not indexed."
        path="/preview/home-b"
      />

      <SiteNav />

      <main className="min-h-screen bg-white text-slate-900">

        {/* ── Editorial Hero ── */}
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-24 md:pt-24">

            {/* Eyebrow */}
            <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-600">
              就労支援 知識プラットフォーム — Next Being Lab
            </p>

            {/* Large editorial headline */}
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.1] tracking-tight text-slate-950 md:text-7xl lg:text-8xl">
              就労の詰まりは、<br />
              <em className="not-italic text-teal-500">設計</em>で解ける。
            </h1>

            {/* Sub message */}
            <div className="mt-8 max-w-2xl border-l-4 border-teal-400 pl-6">
              <p className="text-lg leading-8 text-slate-700">
                障害者・難病患者の就労問題は、個人の配慮をお願いするだけでは解けません。
                仕事そのものと職場環境を設計する専門知識——それが機能する就労を実現します。
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                国の就労支援研究（JEED/NIVR）のデータを元に、実践者が使える形で提供します。
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/jac"
                className="inline-block rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white transition hover:bg-slate-700"
              >
                今の事例を相談する →
              </Link>
              <Link
                href="/guide"
                className="inline-block rounded-full border-2 border-slate-300 px-7 py-3.5 text-sm font-black text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
              >
                27フレームを使う →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Data Banner ── */}
        <section className="border-b border-slate-100 bg-white py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-8 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              データが示す就労支援の現実
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {PROBLEM_STATS.map(({ num, label, sub, color, numColor, labelColor }) => (
                <div
                  key={num}
                  className={`rounded-2xl border ${color} p-6`}
                >
                  <p className={`text-5xl font-black leading-none tracking-tight ${numColor}`}>
                    {num}
                  </p>
                  <p className={`mt-3 text-base font-bold leading-6 ${labelColor}`}>{label}</p>
                  <p className="mt-2 text-xs text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tools ── */}
        <section className="border-b border-slate-100 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Tools</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  知識を実践に変えるツール
                </h2>
              </div>
              <Link
                href="/resources"
                className="text-sm font-bold text-teal-600 hover:underline"
              >
                全てのリソースを見る →
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {TOOLS.map(({ index, name, tagline, desc, href, accent }) => {
                const colors = ACCENT_COLORS[accent];
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-7 transition ${colors.border}`}
                  >
                    <span className={`self-start rounded-full px-2.5 py-1 text-xs font-black ${colors.tag}`}>
                      {index}
                    </span>
                    <h3 className="mt-5 text-xl font-black text-slate-950">{name}</h3>
                    <p className={`mt-1 text-sm font-semibold ${colors.num}`}>{tagline}</p>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{desc}</p>
                    <span className="mt-6 self-start text-sm font-bold text-slate-950 group-hover:underline">
                      使ってみる →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Knowledge Platform ── */}
        <section className="bg-slate-950 py-20 text-slate-100">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr,1fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-400">
                  知識の基盤
                </p>
                <h2 className="mt-4 text-4xl font-black leading-tight text-white">
                  9,000件超の当事者・支援者データから作られた知識ネットワーク
                </h2>
                <p className="mt-6 text-base leading-8 text-slate-300">
                  NBLは、JEED/NIVRの調査データ（当事者n=9,076、支援者n=3,053）を分析し、
                  就労困難の構造的パターンと支援効果のエビデンスを体系化しています。
                </p>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="inline-block rounded-full border-2 border-slate-600 px-6 py-3 text-sm font-black text-slate-300 transition hover:border-slate-400 hover:text-white"
                  >
                    NBLについて →
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { num: '8', label: 'ドメイン分類', desc: 'ICFベース就労困難分析フレーム' },
                  { num: '6', label: 'モチーフ類型', desc: '典型的な因果関係パターン' },
                  { num: '27', label: 'フレーム', desc: '仕事設計の分析フレーム' },
                  { num: '4層', label: '知識構造', desc: '当事者・支援者・エビデンス・実装' },
                ].map(({ num, label, desc }) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <p className="text-3xl font-black text-teal-400">{num}</p>
                    <p className="mt-1 text-sm font-bold text-white">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer call to action ── */}
        <section className="border-t border-slate-100 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-black text-slate-950">
              まず、相談事例を持ち込んでみる。
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              「はたらく相談室」は、今抱えている就労の詰まりを整理する入口です。<br />
              具体的な相談文を入力するほど、精度の高い分析が返ります。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/jac"
                className="inline-block rounded-full bg-teal-500 px-8 py-4 text-base font-black text-white transition hover:bg-teal-400"
              >
                はたらく相談室を使う →
              </Link>
              <Link
                href="/resources/work-design-foundations"
                className="inline-block rounded-full border-2 border-slate-300 px-8 py-4 text-base font-black text-slate-700 transition hover:border-slate-500"
              >
                基礎知識から入る →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
