import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const SUBSECTIONS = [
  {
    href: '/knowledge/practice',
    label: '実践知識',
    title: '現場で効く実践とは何か',
    desc: '意欲ある支援者が実施できる支援者とそうでない支援者の違いは何か。実践を変える3つの経路。',
    badge: 'bg-teal-100 text-teal-800',
  },
  {
    href: '/knowledge/evidence',
    label: 'データ・エビデンス',
    title: '71.9%と地域6倍格差が示すもの',
    desc: '就労支援の実践格差がなぜ起きるか。データが示す構造的な原因。',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    href: '/knowledge/network',
    label: '地域連携ナビ',
    title: 'どの機関とつながると実践が変わるか',
    desc: '機関ネットワーク参加と転換率の関係。今から設計できる連携体制。',
    badge: 'bg-amber-100 text-amber-800',
  },
];

export default function KnowledgeIndexPage() {
  return (
    <>
      <PageSeo
        title="実践知識 | Next Being Lab"
        description="日本のデータが示す、就労支援の実践知識。71.9%問題・地域格差・連携効果のエビデンス。"
        path="/knowledge"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">

          <header className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              実践知識・エビデンス
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              日本のデータが示す、実践知識
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              個別事例を超えた、構造的・社会的な知識を提供するセクションです。
              「日本のデータが示している」という根拠を持って、実践を変えるための情報を届けます。
            </p>
          </header>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {SUBSECTIONS.map(({ href, label, title, desc, badge }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
              >
                <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
                  {label}
                </span>
                <p className="mt-4 font-semibold text-slate-900 group-hover:text-teal-700">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">{desc}</p>
                <span className="mt-4 text-xs font-semibold text-slate-400 group-hover:text-teal-600">
                  読む →
                </span>
              </Link>
            ))}
          </div>

          {/* Numbers strip */}
          <div className="mt-16 grid grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 text-center">
            {[
              { num: '71.9%', label: '支援者が「意欲はあるが実施できていない」' },
              { num: '最大6倍', label: '都道府県による実践率の格差' },
              { num: '9,000件超', label: '実データから導いた知識ネットワーク' },
            ].map(({ num, label }) => (
              <div key={num}>
                <p className="text-2xl font-semibold text-slate-950 md:text-3xl">{num}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
