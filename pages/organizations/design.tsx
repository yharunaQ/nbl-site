import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const IPS_PRINCIPLES = [
  {
    num: '1',
    ips: '競争的雇用を目標にする',
    jp: '就職前の本人支援に限定せず、実際の仕事の場面での職場・企業支援と一体的な総合的支援が効果的な就労支援に不可欠——企業への積極的アプローチが最有効介入として確認（NIVR No.134）。',
  },
  {
    num: '2',
    ips: '精神科医療との統合',
    jp: '精神科医療機関との連携が支援転換率に寄与。医療と就労支援の分断が困難を長期化させるパターンが日本データでも確認された。',
  },
  {
    num: '3',
    ips: '除外基準を設けない',
    jp: '支援受け入れの障壁低減・準備度によらない早期支援開始が成果に寄与。',
  },
  {
    num: '4',
    ips: '本人の選好に基づく',
    jp: '本人の希望・強みを起点にした職務設計が定着率を高める。27フレームの設計層Ⅱ（仕事・環境の適合設計）はこの原則の実装。',
  },
  {
    num: '5',
    ips: '迅速な求職活動',
    jp: '長期就労前訓練より直接就職支援が成果高い。職場での一体的支援と組み合わせることが鍵。',
  },
  {
    num: '6',
    ips: '体系的な求人開拓',
    jp: '企業への積極的アプローチ（連携・交渉・共同提案）が最有効介入として一貫して確認された。',
  },
  {
    num: '7',
    ips: '継続的なサポート',
    jp: '就業・生活支援センターとの継続関与が転換率を16ポイント押し上げる。精神科医療機関との継続連携も定着を規定する重要因子。',
  },
  {
    num: '8',
    ips: '給付相談',
    jp: '障害年金・各種手当の制度活用支援が就労継続に寄与。',
  },
];

export default function OrganizationsDesignPage() {
  return (
    <>
      <PageSeo
        title="インクルーシブ職場設計 | Next Being Lab"
        description="日本の大規模調査データが示す効果的実践の構造——「誰を枠に当てはめるか」から「仕事をどう設計するか」への転換。国際的エビデンスとの独立した整合が普遍性を示す。"
        path="/organizations/design"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14">

          <nav className="text-xs text-slate-400">
            <Link href="/organizations" className="hover:text-slate-700">職場・組織設計</Link>
            <span className="mx-2">/</span>
            <span>インクルーシブ職場設計</span>
          </nav>

          <header className="mt-6">
            <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              組織設計
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              日本のデータが示す、効果的実践の構造
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              支援者3,053人の大規模調査データが明らかにした——効果的な就労支援の実践構造。この構造が国際的なエビデンスと独立に整合することが、知識の普遍性を示します。
            </p>
          </header>

          {/* Core finding: scope of support */}
          <section className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 px-6 py-6">
            <h2 className="font-semibold text-teal-900">データが示す核心：支援の射程</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              分析が明らかにした最大の発見は「間違った実践をしていること」ではなく、<strong>「支援の射程が職場の外で止まっている」</strong>という構造的問題です。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              効果が確認されているが普及していない実践はすべて、職場内・就職後フェーズへの関与でした。真の専門性実践者（Q1）はそうでない支援者（Q2）より、これらを<strong>30〜40ポイント高い頻度</strong>で実施しています。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold text-slate-400 mb-2">普及しているが差別化しない実践</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  {['就職希望者への情報提供', '障害理解・配慮の助言', '本人の強み・希望の把握'].map(item => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div className="rounded-xl bg-teal-100 border border-teal-300 px-4 py-3">
                <p className="text-xs font-semibold text-teal-800 mb-2">Q1が特に多く行う・効果確認済みの実践</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  {['就職後のフォローアップでの問題把握', '実際の職場での実習・情報収集', '雇用企業への継続的な地域支援体制'].map(item => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">出典：NIVR No.134 相当 支援者調査 n=3,053 / NBL分析（ロジスティック回帰）</p>
          </section>

          {/* International alignment */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">国際的エビデンスとの整合——普遍性の根拠</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              日本のデータが示す実践構造は、IPS（Individual Placement and Support）・SE（Supported Employment）として国際的に確立されたアプローチの8原則と独立に整合しています。これは海外理論の輸入ではありません——日本の実態から積み上げた分析が、同じ構造に到達したという事実が、知識の普遍性を支えます。
            </p>
          </section>

          {/* IPS 8 principles table */}
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">日本データの実践構造とIPS/SE原則の対応</h2>
            <p className="mt-2 text-sm text-slate-500">
              出典（データの出所）：NIVR 調査研究報告書 No.100（2011）・No.134（2017）・No.172（2024）
            </p>
            <div className="mt-5 space-y-4">
              {IPS_PRINCIPLES.map(({ num, ips, jp }) => (
                <div key={num} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {num}
                    </span>
                    <p className="font-semibold text-slate-900">{ips}</p>
                  </div>
                  <div className="mt-3 rounded-xl bg-indigo-50 px-4 py-3">
                    <p className="text-xs font-semibold text-indigo-700 mb-1">日本データが示すこと</p>
                    <p className="text-sm leading-6 text-slate-700">{jp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-400 space-y-0.5">
              <p>
                NIVR No.100：
                <a href="https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku100.html" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 hover:underline ml-1">
                  障害者の自立支援と就業支援の効果的連携（2011）
                </a>
              </p>
              <p>
                NIVR No.134：
                <a href="https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku134.html" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 hover:underline ml-1">
                  地域支援のあり方に関する研究（2017）
                </a>
              </p>
              <p>
                NIVR No.172：
                <a href="https://www.nivr.jeed.go.jp/research/report/houkoku/houkoku172.html" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 hover:underline ml-1">
                  難病患者の就労困難性に関する調査研究（2024）
                </a>
              </p>
            </div>
          </section>

          {/* Design shift */}
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900">職場設計の転換</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              「障害者雇用枠に当てはめる」設計から、「仕事を設計して多様な人が参加できるようにする」設計へ——これがデータの示す方向です。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold text-slate-400 mb-2">従来の設計</p>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  {['誰をどの枠に当てはめるか', '配慮リストを作る', '標準的な仕事に合わせる'].map(
                    (item) => <li key={item}>• {item}</li>,
                  )}
                </ul>
              </div>
              <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3">
                <p className="text-xs font-semibold text-teal-700 mb-2">インクルーシブ設計</p>
                <ul className="text-sm text-slate-700 space-y-1.5">
                  {['仕事をどう設計するか', '職場環境を変える', '多様な機能プロフィールを前提に設計する'].map(
                    (item) => <li key={item}>• {item}</li>,
                  )}
                </ul>
              </div>
            </div>
          </section>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/guide" className="text-sm font-semibold text-teal-700 hover:underline">
              仕事設計ガイドブック（27フレーム）→
            </Link>
            <Link href="/jac/next" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              組織の課題をはたらく相談室で整理する →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
