import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const STATS = [
  {
    num: '46.9%',
    label: 'の当事者・難病患者に、効果的な配慮・支援が届いていない就労困難のパターンが確認されている',
    sub: 'n=9,076 当事者・難病患者調査 / NBL分析',
    accent: 'text-rose-400',
  },
  {
    num: '71.9%',
    label: 'の就労支援者が、意欲はあるが実施できていない',
    sub: 'n=3,053 支援者調査（JEED/NIVR）',
    accent: 'text-amber-400',
  },
  {
    num: '最大6倍',
    label: '都道府県によって就労支援の実践率に差がある',
    sub: 'n=3,053 支援者調査 / NBL分析',
    accent: 'text-sky-400',
  },
  {
    num: '9,000件超',
    label: '当事者・支援者の実データから導いた知識ネットワーク',
    sub: 'JEED/NIVR 調査データを元に構築',
    accent: 'text-teal-400',
  },
];

const ENTRY_CARDS = [
  {
    q: '今の相談事例を整理したい',
    desc: '就労の困難を構造化し、具体的な一手を示します。',
    cta: 'はたらく相談室（AI対話）',
    href: '/jac',
    color: 'border-teal-500 bg-teal-950/40 hover:bg-teal-950/60',
    badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  },
  {
    q: '典型的な困難パターンを知りたい',
    desc: '27のフレームで就労の詰まりを設計の課題として読み替える。',
    cta: '仕事設計ガイドブック',
    href: '/guide',
    color: 'border-indigo-500/60 bg-indigo-950/30 hover:bg-indigo-950/50',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  },
  {
    q: '支援実践の全体像を把握したい',
    desc: '現場で効いている実践の知識、地域格差の構造、データが示すエビデンス。',
    cta: '実践知識',
    href: '/knowledge',
    color: 'border-amber-500/50 bg-amber-950/20 hover:bg-amber-950/40',
    badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  {
    q: '職場・組織の環境を変えたい',
    desc: '個人の配慮を超えた、職場設計・組織設計の知識。',
    cta: '職場・組織設計',
    href: '/organizations',
    color: 'border-slate-600 bg-slate-800/60 hover:bg-slate-800/80',
    badgeColor: 'bg-slate-700 text-slate-300 border border-slate-600',
  },
];

export default function HomePage() {
  return (
    <>
      <PageSeo
        title="Next Being Lab | 就労の詰まりは、設計で解ける"
        description="日本の当事者・支援者のデータから導いた、インクルーシブ就労支援の実践知識。27のフレームと対話AIが、現場の一手を示します。"
        path="/"
        imagePath="/social/home-og.png"
        imageAlt="Next Being Lab トップページの就労支援知識プラットフォーム紹介画像"
      />

      <SiteNav />

      <main className="min-h-screen bg-slate-950 text-slate-100">

        {/* ── Dark Hero ── */}
        <section className="relative overflow-hidden border-b border-slate-800">
          {/* Subtle radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(20,184,166,0.12),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_20%,rgba(99,102,241,0.08),transparent)]" />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-32">
            <div className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">

              {/* Left: headline */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-950/60 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase">
                  就労支援 知識プラットフォーム
                </span>
                <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                  就労の詰まりは、<br />
                  <span className="text-teal-400">仕事と環境の</span><br />
                  設計で解ける。
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                  障害者・難病患者の就労問題は、「配慮をお願いする」だけでは解けません。
                  必要なのは、仕事そのものと職場環境を設計する専門知識——
                  それが、当事者と企業の双方にとって機能する就労を実現します。
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  NBLは国の就労支援研究（JEED/NIVR）の調査研究や海外情報等から、
                  その専門知識を実践者が使える形で提供します。
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/jac"
                    className="inline-block rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
                  >
                    今の事例を相談する →
                  </Link>
                  <Link
                    href="/guide"
                    className="inline-block rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
                  >
                    フレームを調べる →
                  </Link>
                </div>
              </div>

              {/* Right: floating key stat */}
              <div className="flex flex-col gap-4 lg:pl-8">
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">就労困難の現実</p>
                  <p className="mt-3 text-5xl font-semibold text-white">46.9%</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    の当事者・難病患者に、効果的な配慮・支援が届いていない就労困難のパターンが確認されている
                  </p>
                  <p className="mt-3 text-xs text-slate-600">n=9,076 当事者・難病患者調査 / NBL分析</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">支援者の実態</p>
                  <p className="mt-3 text-5xl font-semibold text-white">71.9%</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    の就労支援者が、意欲はあるが実施できていない
                  </p>
                  <p className="mt-3 text-xs text-slate-600">n=3,053 支援者調査（JEED/NIVR）</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Sub stats ── */}
        <section className="border-b border-slate-800 bg-slate-900/60 py-8">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {STATS.map(({ num, label, sub, accent }) => (
                <div key={num} className="border-l border-slate-700 pl-5">
                  <p className={`text-2xl font-semibold ${accent}`}>{num}</p>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">{label}</p>
                  <p className="mt-1 text-xs text-slate-600">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Entry cards ── */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            何をしたいですか
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ENTRY_CARDS.map(({ q, desc, cta, href, color, badgeColor }) => (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col rounded-2xl border p-6 transition ${color}`}
              >
                <p className="text-base font-semibold text-slate-100 group-hover:text-white">
                  {q}
                </p>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-400">{desc}</p>
                <span className={`mt-5 self-start rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
                  {cta} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── About ── */}
        <section className="border-t border-slate-800 py-12">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Next Being Lab（NBL）とは</p>
            <p className="mt-4 text-base leading-8 text-slate-400">
              インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです。
              就労支援を起点に、AI時代に多様な人が能力・意欲を発揮して参加できる仕事設計へと、取り組みを広げています。
            </p>
            <p className="mt-3 text-xs text-slate-600">
              AIで人を不要にするのではなく、AIで余力をつくり、人が参加できる仕事を増やす。
            </p>
            <div className="mt-5">
              <Link href="/about" className="text-sm font-semibold text-teal-400 hover:underline">
                NBLについて詳しく →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
