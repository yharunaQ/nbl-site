import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

const INSTITUTIONS = [
  {
    name: '就労移行支援事業所',
    delta: '転換率を17ポイント押し上げる',
    rank: 1,
    desc: '最も転換効果が高い。就業準備・実習支援・企業アプローチを伴う実地連携が有効。',
    tip: '単なる情報共有でなく、企業調整への同席・共同提案が効く。',
  },
  {
    name: '就業・生活支援センター',
    delta: '転換率を16ポイント押し上げる',
    rank: 2,
    desc: '生活基盤と就労を一体支援。定着フォローとの継続的な接続が特に有効。',
    tip: '就職後の定着担当として最初から役割を明示する。',
  },
  {
    name: 'ハローワーク専門援助部門',
    delta: '転換率を15ポイント押し上げる',
    rank: 3,
    desc: '公的求人接続・企業側調整の機能。支援者が企業との交渉ルートを持つ効果が大きい。',
    tip: '就職先開拓の共同作業として関与させる。',
  },
  {
    name: '難病相談支援センター',
    delta: '転換率を3ポイント押し上げる',
    rank: 4,
    desc: '医療との橋渡し。難病・慢性疾患が関わるケースで医療情報と就労支援を接続する。',
    tip: '診断書・意見書の取得ルートとして活用。',
  },
];

export default function KnowledgeNetworkPage() {
  return (
    <>
      <PageSeo
        title="地域連携ナビ | Next Being Lab"
        description="どの機関とつながると実践が変わるか——機関別の転換効果と連携設計の実践知識。"
        path="/knowledge/network"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14">

          <nav className="text-xs text-slate-400">
            <Link href="/knowledge" className="hover:text-slate-700">実践知識</Link>
            <span className="mx-2">/</span>
            <span>地域連携ナビ</span>
          </nav>

          <header className="mt-6 max-w-2xl">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              地域連携ナビ
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              どの機関とつながると、実践が変わるか
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              機関ネットワーク参加と実践転換率の関係（日本支援者大規模調査・NIVR No.134より）。
            </p>
          </header>

          {/* Quality vs quantity — shown first */}
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
            <h2 className="font-semibold text-amber-900">「つながっている」だけでは変わらない</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              支援者の多くが何らかの外部機関と関係を持っています。しかし連携があっても実践が変わらないケースは少なくありません——連携の有無ではなく、<strong>連携の質</strong>が転換を規定します。
            </p>

            <h3 className="mt-5 text-sm font-semibold text-amber-800">「参加しているが変わらない」問題</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-4 py-3">
                <p className="text-xs font-semibold text-slate-400 mb-1">変わらない連携</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  {['情報共有だけで終わる', '引き継ぎ先として使うだけ', '名前は知っているが使わない'].map(
                    (item) => <li key={item}>• {item}</li>,
                  )}
                </ul>
              </div>
              <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-3">
                <p className="text-xs font-semibold text-teal-700 mb-1">変わる連携</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  {['企業調整を一緒に行う', '定着フォローを継続的に担う', '実習・就業場面での実地関与'].map(
                    (item) => <li key={item}>• {item}</li>,
                  )}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              では、どの機関との連携が、実際に転換を起こしているか——大規模調査データが示す結果を見ていきます。
            </p>
          </section>

          {/* Institution effectiveness */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">機関別の転換効果</h2>
            <p className="mt-2 text-sm text-slate-500">
              出典：NIVR 調査研究報告書 No.134（2017）
            </p>
            <div className="mt-5 space-y-4">
              {INSTITUTIONS.map(({ name, delta, rank, desc, tip }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">第{rank}位</p>
                      <p className="mt-1 font-semibold text-slate-900">{name}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                      {delta}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
                  <div className="mt-3 rounded-xl bg-slate-50 px-4 py-2.5">
                    <p className="text-xs font-semibold text-slate-500">連携を活かすポイント</p>
                    <p className="mt-1 text-sm text-slate-700">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Regional gap + org management */}
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">地域の連携体制と組織の課題</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              連携体制の整備は、個人の努力に帰せる問題ではありません。地域によって利用できる機関の種類・密度・質が大きく異なり、都道府県によって実践転換率に最大6倍の差があります（
              <Link href="/knowledge/evidence" className="text-teal-700 hover:underline">地域格差の構造</Link>）。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              しかし、これを「地域格差の問題」として片づけることは、実践の改善につながりません。重要なのは<strong>組織として連携を業務に組み込む設計</strong>です。地域の資源状況に影響を受けながらも、以下は組織管理の取り組みとして進められます。
            </p>
            <ul className="mt-3 space-y-2">
              {[
                '利用可能な連携ルートを組織として可視化し、業務として整備する',
                '外部連携を「個人の努力」ではなく「チームの設計」として運用する',
                '管理職・組織が連携の実績を評価・支援する体制をつくる',
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/organizations/design" className="mt-4 inline-block text-sm font-semibold text-teal-700 hover:underline">
              組織設計の知識 →
            </Link>
          </section>

          {/* Steps */}
          <section className="mt-10">
            <h2 className="font-semibold text-slate-900">連携を設計する</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              連携の質を変えるための考え方。ただし、組織や地域の体制に課題がある場合は一部の実施が困難になります——連携設計と組織設計は並行して考える必要があります。
            </p>
            <div className="mt-4 space-y-3">
              {[
                { step: '担当ケースに関わる機関を書き出す', detail: '誰が何をしているか可視化する。機関名だけでなく「何を一緒にしているか」を明示する' },
                { step: '企業調整ルートを確認する', detail: 'ハローワーク・就労移行支援との連携で「企業交渉への同席」が実現できているか確認する' },
                { step: '定着フォローの担当を決める', detail: '就職後の継続関与の担い手を事前に決め、引き継ぎではなく共同関与を設計する' },
                { step: '連携を「引き継ぎ」から「共同作業」に変える', detail: '同席・共同提案を通常業務として組み込むには、組織として業務時間と評価の設計が必要' },
              ].map(({ step, detail }, i) => (
                <div key={i} className="flex gap-4 text-sm text-slate-700">
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{step}</p>
                    <p className="mt-0.5 text-slate-600">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/knowledge/evidence" className="text-sm font-semibold text-teal-700 hover:underline">
              ← データ・エビデンス
            </Link>
            <Link href="/knowledge" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              実践知識トップへ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
