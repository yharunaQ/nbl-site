import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

export default function KnowledgePracticePage() {
  return (
    <>
      <PageSeo
        title="実践知識 | Next Being Lab"
        description="就労支援の実践を変える知識。設計課題型支援者と個人特性型支援者の違い、転換を起こす3つの経路。"
        path="/knowledge/practice"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14">

          <nav className="text-xs text-slate-400">
            <Link href="/knowledge" className="hover:text-slate-700">実践知識</Link>
            <span className="mx-2">/</span>
            <span>実践知識</span>
          </nav>

          <header className="mt-6 max-w-2xl">
            <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              実践知識
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              現場で効く実践とは何か
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              日本の支援者調査が明らかにした、実践の質の差を生む構造と、その転換経路。
            </p>
          </header>

          <div className="mt-10 space-y-5">

            {/* Article 1: 2 types of practitioners */}
            <article id="q1q2-diff" className="rounded-2xl border border-slate-200 bg-white p-7">
              <h2 className="text-xl font-semibold text-slate-900">
                実践の構造の差——支援者の3つの違い
              </h2>
              <p className="mt-1 text-sm text-slate-500">意欲の差ではなく、問題の置き場所の差</p>

              <div className="mt-5 text-sm leading-7 text-slate-700 space-y-4">
                <p>
                  就労支援の現場に意欲的な支援者はたくさんいます。しかし意欲の高さが実践の質に直結しているわけではありません。
                  大規模支援者調査データが明らかにしたのは、実践の質の差を分ける<strong>3つの構造的な違い</strong>です。
                </p>
                <p>
                  2つのタイプの支援者が浮かびあがります——就労の困難を仕事・環境・制度の<strong>設計課題</strong>として読み替えて動く支援者（設計課題型）と、本人の特性・症状・能力の問題として帰着させる傾向がある支援者（個人特性型）です。この違いは、経験年数や診断名の有無によるものではありません。
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    n: '01',
                    title: '問題の置き場所',
                    typeB: '就労の困難を本人の特性・症状・能力に帰着させる。「この人にはこの仕事は向かない」「もう少し安定してから」。',
                    typeA: '就労の困難を仕事・環境・支援・制度の設計課題として読み替える。「この仕事のどの部分が合っていないか」を先に問う。',
                  },
                  {
                    n: '02',
                    title: '支援の射程',
                    typeB: '支援が相談室・就職前で完結する。就職後のフォローアップは単発で終わり、職場の現場に入る機会がほとんどない。',
                    typeA: '支援を職場の中まで届ける。就職後のフォローアップ・職場内の問題把握・雇用企業への継続的な関与が通常業務に組み込まれている。',
                  },
                  {
                    n: '03',
                    title: '企業へのアプローチ',
                    typeB: '「配慮をお願いする」スタンス。企業側の対応が弱ければ後退する。',
                    typeA: '「仕事をこう設計すれば継続できる」という具体的な提案を持って企業に臨む。支援効果データで最も有効な介入は、一貫して企業への積極的なアプローチです。',
                  },
                  {
                    n: '04',
                    title: '外部連携の使い方',
                    typeB: '「対応できないときに引き継ぐ」ための連携。単発で終わる。',
                    typeA: '外部機関を「支援を補完するパートナー」として設計に組み込む。就労移行支援との連携で転換率を17ポイント押し上げることが確認されています（NIVR No.134）。',
                  },
                ].map(({ n, title, typeB, typeA }) => (
                  <div key={n} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-400 mb-2">{n} {title}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-white border border-slate-200 px-3 py-2.5">
                        <p className="text-xs font-semibold text-slate-400 mb-1">個人特性型支援者</p>
                        <p className="text-sm text-slate-600">{typeB}</p>
                      </div>
                      <div className="rounded-lg bg-teal-50 border border-teal-200 px-3 py-2.5">
                        <p className="text-xs font-semibold text-teal-700 mb-1">設計課題型支援者</p>
                        <p className="text-sm text-slate-700">{typeA}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Article 2: Practice building */}
            <article id="practice-building" className="rounded-2xl border border-slate-200 bg-white p-7">
              <h2 className="text-xl font-semibold text-slate-900">
                実践知識はどう積まれるか
              </h2>
              <p className="mt-1 text-sm text-slate-500">転換を起こす3つの経路</p>

              <div className="mt-5 text-sm leading-7 text-slate-700 space-y-3">
                <p>
                  「知っている」と「できている」の間には壁があります。大規模支援者調査データが示す、実践転換の3つの有効経路：
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex gap-4 rounded-xl bg-slate-50 px-4 py-4">
                  <span className="shrink-0 text-xs font-semibold text-slate-400 mt-0.5">経路1</span>
                  <div>
                    <p className="font-semibold text-slate-800">実践経験の蓄積（最も効果が大きい）</p>
                    <p className="mt-1 text-sm text-slate-600">
                      特に「企業への働きかけ」の成功・失敗体験が、問題の置き場所を変えます。この経験を積める機会が持てる環境かどうかが、転換を規定します。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl bg-slate-50 px-4 py-4">
                  <span className="shrink-0 text-xs font-semibold text-slate-400 mt-0.5">経路2</span>
                  <div>
                    <p className="font-semibold text-slate-800">外部機関とのネットワーク</p>
                    <p className="mt-1 text-sm text-slate-600">
                      就労移行支援事業所・就業生活支援センター・ハローワーク専門援助との実質的な連携が、実践の幅を広げます。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-xl bg-slate-50 px-4 py-4">
                  <span className="shrink-0 text-xs font-semibold text-slate-400 mt-0.5">経路3</span>
                  <div>
                    <p className="font-semibold text-slate-800">ピア学習・実践者コミュニティ</p>
                    <p className="mt-1 text-sm text-slate-600">
                      他の実践者から具体的な実践のモデルを見る体験が、規範を更新する場として機能します。
                    </p>
                    <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                      <strong>注意：</strong>同じ機関内の閉じたコミュニティのみで学ぶと、古い規範がむしろ強化されることがあります。「この機関ではこうしている」という慣習が、より広い実践の可能性を見えにくくするケースです。この経路が転換につながるかは、<strong>どのようなコミュニティで、どんな実践のモデルに触れるか</strong>によって大きく変わります。
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-sm font-semibold text-slate-700">組織が変わるためには</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  個人の実践知識の蓄積だけでは、71.9%の問題は解決しません。データが示す転換の方向は「誤った実践を止める」ではなく「支援の射程を職場の中まで延ばす」——就職後フォローアップ・職場実習・雇用企業への継続的関与を通常業務として設計できる体制が必要です。これは組織設計の課題です。
                </p>
                <Link href="/organizations/design" className="mt-2 inline-block text-sm font-semibold text-teal-700 hover:underline">
                  組織設計の知識 →
                </Link>
              </div>
            </article>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/knowledge/network" className="text-sm font-semibold text-teal-700 hover:underline">
              連携体制の設計を見る →
            </Link>
            <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              仕事設計ガイドブック →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
