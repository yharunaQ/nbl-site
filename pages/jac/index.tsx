import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

// ---------------------------------------------------------------------------
// Example use cases — 3 roles, diagnosis optional
// ---------------------------------------------------------------------------

const EXAMPLES = [
  {
    role: '支援者として',
    situation:
      '担当している方が就職後3ヶ月で安定しない。記録の方法を変えるべきか、医療連携を強化すべきか判断がつかない。（診断名あり・なし、どちらでも相談できます）',
    badge: 'bg-teal-100 text-teal-800',
  },
  {
    role: '本人（障害・難病当事者）として',
    situation:
      '午後になると疲れやすく仕事に影響が出ている。診断名はあるが、職場に何をどう求めてよいかわからない。（診断名がない段階でも相談できます）',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    role: '企業（管理職・人事）として',
    situation:
      '復職した社員の業務負荷をどう調整すべきか。障害・病気の詳細は把握していないが、職場環境を変えたい。',
    badge: 'bg-amber-100 text-amber-800',
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JacIndexPage() {
  return (
    <>
      <PageSeo
        title="はたらく相談室 | Next Being Lab"
        description="就労の詰まりを、一緒に整理します。日本の当事者・支援者データから導いた専門知識が、現場の一手を示します。"
        path="/jac"
      />

      <SiteNav />

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.10),_transparent_28%),linear-gradient(180deg,_#f8fcfb_0%,_#eef5ff_55%,_#fffaf2_100%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">

          {/* Hero */}
          <header className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              はたらく相談室
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              就労の詰まりを、<br className="hidden sm:block" />
              一緒に整理する。
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              就労困難の的確な見立てには、問題の起こり方についての広範な専門知識が必要です。
              はたらく相談室は、ICFのフレームに沿って問題構造を鑑別的に整理し、
              対話を重ねながら信頼性の高い見立てへ効率的に到達します。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              膨大なチェックリストは使いません。専門家が行うような簡潔な対話で核心を絞り込みます。
              AIが最終的な判断を下すのではなく、高度な専門知識の部分で支援者・本人・企業担当者を支えます。
              見立てと判断は、相談した人が持ちます。
            </p>

            <div className="mt-7">
              <Link
                href="/jac/next"
                className="inline-block rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                相談を始める →
              </Link>
            </div>
          </header>

          {/* What you can input */}
          <section className="mt-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              どんな立場からでも相談できます
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              支援者・本人・企業、どの立場からでも。診断名があっても、まだなくても。
              「今、何に詰まっているか」を話すところから始めます。
            </p>
            <div className="mt-5 space-y-3">
              {EXAMPLES.map((ex) => (
                <div
                  key={ex.role}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                >
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ex.badge}`}>
                    {ex.role}
                  </span>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    「{ex.situation}」
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              対話で絞り込み、見立てに到達する
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              相談内容から一直線に結論を出すのではなく、確認・深掘りを繰り返しながら問題の構造を絞り込みます。
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: '01',
                  title: '状況を話す',
                  desc: '診断名・障害種別があれば参考にします。なくても問題ありません。「今、何が詰まっているか」から始めます。',
                },
                {
                  step: '02',
                  title: '対話で構造を絞る',
                  desc: 'ICFのフレームで因果構造を鑑別的に整理します。確認しながら一緒に問題の核心へ近づきます。チェックリストは使いません。',
                },
                {
                  step: '03',
                  title: '見立てと一手を整理する',
                  desc: '日本のデータが示す有効な介入を根拠に、具体的な次の一手と見立て仮説を整理します。持ち帰り、現場で使えます。',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs font-semibold text-slate-400">{step}</p>
                  <p className="mt-1 font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section className="mt-12 rounded-2xl bg-slate-50 px-6 py-5">
            <h2 className="text-sm font-semibold text-slate-700">入力内容について</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              入力した相談内容は、AIによる見立て生成のみに使用します。
              個人を特定できる情報の入力は不要です。相談内容はサーバーに保存されません。
            </p>
          </section>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/jac/next"
              className="inline-block rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              相談を始める →
            </Link>
            <p className="mt-4 text-xs text-slate-400">
              仕事設計のフレームを先に調べたい場合は{' '}
              <Link href="/guide" className="underline hover:text-slate-700">
                ガイドブック
              </Link>
              へ。
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
