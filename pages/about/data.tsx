import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const SURVEY_DATA = [
  {
    label: '当事者調査（障害者就労）',
    id: 'employment_survey',
    n: '4,553',
    source: 'NIVR 調査研究報告書 No.100（2011）',
    href: 'https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku100.html',
  },
  {
    label: '当事者調査（難病者就労）',
    id: 'nanbyo_survey',
    n: '4,523',
    source: 'NIVR 調査研究報告書 No.172（2024）',
    href: 'https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku172.html',
  },
  {
    label: '支援者調査（障害者支援）',
    id: 'toku18',
    n: '3,053',
    source: 'NIVR 調査研究報告書 No.134（2017）',
    href: 'https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku134.html',
  },
  {
    label: '支援者調査（難病支援者）',
    id: 'nanbyo_supporter',
    n: '535',
    source: 'NIVR 調査研究報告書 No.172（2024）',
    href: 'https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku172.html',
  },
];

const KEY_FINDINGS = [
  {
    label: '就労困難の構造',
    body: '就労の詰まりは症状の種類ではなく、仕事・環境・支援・制度の設計との「ミスマッチ」から起きる。8つの問題ドメインと6つの因果モチーフが、困難の構造を体系化する。',
  },
  {
    label: '支援の実践格差',
    body: '支援者の71.9%が「意欲はあるが実施できていない」状態にある。最大の規定因子は上司・職場文化（+0.131）、次いで機関ミッション・法令理解（+0.118）。',
  },
  {
    label: '地域格差の実在',
    body: '都道府県によって就労支援の実践率に最大6倍の差がある。差は支援者個人の能力ではなく、地域の支援体制・機関ネットワークの構造で説明される。',
  },
  {
    label: '連携の効果',
    body: '就労移行支援事業所とのネットワーク参加は転換率を+17.0pt、就業・生活支援センターは+16.4pt、ハローワーク専門援助部門は+15.3pt押し上げる。',
  },
];

export default function AboutDataPage() {
  return (
    <>
      <PageSeo
        title="データ基盤について | NBL"
        description="NBLの知識ネットワークを支える調査データ——調査規模・分析方法・IPS/SE独立整合・倫理について。"
        path="/about/data"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14">

          <nav className="text-xs text-slate-400">
            <Link href="/about" className="hover:text-slate-700">NBLについて</Link>
            <span className="mx-2">/</span>
            <span>データ基盤</span>
          </nav>

          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              データ基盤について
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-700">
              NBLの知識ネットワークは、日本でNIVRが実施し結果が公表されている大規模調査を基盤にしています。
            </p>
          </header>

          {/* Survey overview */}
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900">調査の概要</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">調査</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">出典</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">n</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {SURVEY_DATA.map((s) => (
                    <tr key={s.id}>
                      <td className="px-5 py-3.5 text-slate-700">{s.label}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 hover:underline">
                          {s.source}
                        </a>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-slate-900">{s.n}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">合計</td>
                    <td className="px-5 py-3.5"></td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-950">12,664</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Key findings */}
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900">主な知見</h2>
            <div className="mt-5 space-y-4">
              {KEY_FINDINGS.map(({ label, body }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* IPS/SE */}
          <section className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-6">
            <h2 className="text-base font-semibold text-indigo-900">IPS/SEとの独立整合</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              日本のデータが示す就労支援の有効構造は、国際的に確立されたIPS（Individual Placement and Support）/ SE（Supported Employment）の原則と独立に整合しています。海外理論を適用したのではなく、日本の実データから積み上げた知識が、独立に同じ原則を再発見しました。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              これは日本の文脈に特化した精度の高い実践知識であることを意味します。
            </p>
            <div className="mt-4">
              <Link href="/organizations/design" className="text-sm font-semibold text-indigo-700 hover:underline">
                組織設計への含意を見る →
              </Link>
            </div>
          </section>

          {/* Ethics */}
          <section className="mt-10 rounded-2xl bg-slate-50 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-800">データ利用と倫理</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              調査は適切な倫理審査・同意取得のもとで実施しました。個人を特定できるデータは一切公開していません。集計・分析結果のみを知識ネットワークの根拠として使用しています。
            </p>
          </section>

          <div className="mt-10 flex gap-4">
            <Link href="/about/knowledge-base" className="text-sm font-semibold text-teal-700 hover:underline">
              ← 知識ネットワークについて
            </Link>
            <Link href="/about" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              NBLについてに戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
