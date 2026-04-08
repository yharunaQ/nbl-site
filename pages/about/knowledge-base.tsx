import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const DOMAINS = [
  { id: 'D1', label: '症状変動', desc: '体調・治療・疲労の波と仕事密度のミスマッチ' },
  { id: 'D2', label: '感覚・認知ギャップ', desc: '感覚処理・認知様式と環境要求の不整合' },
  { id: 'D3', label: '情報処理負荷', desc: '指示・情報・マルチタスクの処理容量超過' },
  { id: 'D4', label: '対人コミュニケーション', desc: '職場内の意思疎通・関係構築の困難' },
  { id: 'D5', label: '開示・配慮交渉', desc: '困難の開示と配慮の実装における障壁' },
  { id: 'D6', label: '就労移行・参加経路', desc: '就職プロセス・支援接続の断絶' },
  { id: 'D7', label: '時間経過・移行', desc: '経過・再発・制度移行に伴う不安定化' },
  { id: 'D8', label: '組織・制度設計', desc: '職場構造・機関体制・政策の不整合' },
];

const MOTIFS = [
  { id: 'M1', label: '増幅', desc: '一つの困難が他の困難を連鎖的に強める' },
  { id: 'M2', label: 'ミスマッチ', desc: '本人の機能特性と環境要求が合っていない' },
  { id: 'M3', label: 'ボトルネック', desc: '一点の詰まりが全体の流れを止めている' },
  { id: 'M4', label: '緩衝', desc: '保護因子が困難を和らげている構造' },
  { id: 'M5', label: '補償', desc: '本人または環境が困難を別の方法で補っている' },
  { id: 'M6', label: '遅延再燃', desc: '一時的な安定の後、困難が再び現れる' },
];

export default function KnowledgeBasePage() {
  return (
    <>
      <PageSeo
        title="知識ネットワークについて | NBL"
        description="NBLの専門知識ネットワーク——FCHMAアトラス・3ループ更新サイクル・知識の構造。"
        path="/about/knowledge-base"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14">

          <nav className="text-xs text-slate-400">
            <Link href="/about" className="hover:text-slate-700">NBLについて</Link>
            <span className="mx-2">/</span>
            <span>知識ネットワーク</span>
          </nav>

          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              知識ネットワークについて
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-700">
              NBLの専門知識ネットワークは、日本の調査データから導いた就労困難の因果構造と、有効な介入の体系です。
            </p>
          </header>

          {/* FCHMA 概要 */}
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900">FCHMAとは</h2>
            <p className="mt-1 text-xs text-slate-400 tracking-wide">
              Framework-guided Contextual Hypergraph and Manifold Analysis（枠組み誘導型 文脈ハイパーグラフ・マニフォールド分析法）
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              FCHMAはNBLが独自に開発した就労困難の分析方法論です。9,000件超の一次調査データを基盤に、就労の詰まりを「症状の列挙」ではなく「因果連鎖の構造」として分析するために設計されました。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              ICF（国際生活機能分類）を参照枠として、身体機能・活動・参加・環境因子・個人因子の相互作用を捉え、「どの経路で困難が起きているか」を特定します。AIによる仮説候補の生成と、支援者・当事者による検証・フィードバックを組み合わせることで、ケースごとの因果構造を明らかにします。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              はたらく相談室（/jac/next）では、このFCHMAの実装プロファイルとして「Functional Causal Hypothesis Manifold Analysis」を採用し、ICFベースの機能的因果仮説の生成と検証を1セッション内で完結させる設計をとっています。
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">従来のアプローチ</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                  <li>• 診断名 → 配慮対応表のルックアップ</li>
                  <li>• 症状・困りごとのチェックリスト化</li>
                  <li>• 単一要因への対処</li>
                  <li>• 静的なケース記録</li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">FCHMAのアプローチ</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
                  <li>• 因果経路から介入点を特定</li>
                  <li>• 複数因子の相互作用・連鎖を構造化</li>
                  <li>• 時間経過・変化・再燃を含む動的分析</li>
                  <li>• 仮説の生成・検証・学習サイクル</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FCHMA Atlas */}
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900">FCHMAアトラス（8ドメイン × 6モチーフ）</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              FCHMAを実装する分析構造です。8つの問題ドメインと6つの因果モチーフの組み合わせで、困難の構造を特定します。
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
                8つの問題ドメイン
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {DOMAINS.map((d) => (
                  <div key={d.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-xs font-semibold text-teal-700">{d.id}</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">{d.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
                6つの因果モチーフ
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {MOTIFS.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-xs font-semibold text-indigo-700">{m.id}</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">{m.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3-loop update */}
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-slate-900">知識は更新し続ける：3ループ構造</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              専門知識ネットワークは、3つのループで継続的に更新されます。
            </p>
            <div className="mt-5 space-y-4">
              {[
                {
                  loop: 'ループ1',
                  title: '外部知識の更新',
                  desc: '国際ガイドライン・研究成果・新しいエビデンスを定期的に取り込み、知識の外縁を広げます。',
                },
                {
                  loop: 'ループ2',
                  title: '実ケースからの学習',
                  desc: 'はたらく相談室（AI対話）で積み上がる実際の相談事例から、典型パターンと介入の有効性を更新します。',
                },
                {
                  loop: 'ループ3',
                  title: '一次データの更新',
                  desc: '継続的な調査実施と分析により、日本のデータ基盤そのものを更新します。',
                },
              ].map(({ loop, title, desc }) => (
                <div key={loop} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="shrink-0 text-xs font-semibold text-slate-400 mt-0.5">{loop}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1.5 text-sm leading-7 text-slate-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 flex gap-4">
            <Link href="/about/data" className="text-sm font-semibold text-teal-700 hover:underline">
              データ基盤・調査概要 →
            </Link>
            <Link href="/about" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              ← NBLについてに戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
