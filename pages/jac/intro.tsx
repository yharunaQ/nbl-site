import Link from 'next/link';
import { Noto_Sans_JP } from 'next/font/google';
import { ArrowRight, CheckCircle, Download, Shield, Users } from 'lucide-react';
import PageSeo from '@/components/PageSeo';

const display = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
});

const STEPS = [
  {
    step: '01',
    label: '相談内容を入力',
    detail:
      '状況・困りごと・希望を自由に書いてください。診断名がなくても、整理しきれていなくても大丈夫です。',
  },
  {
    step: '02',
    label: 'AIが見立てを生成',
    detail:
      '入力をもとに、職業的困難の構造と支援仮説をAIが整理します。実証データ由来の類似パターンとも照合されます。',
  },
  {
    step: '03',
    label: '追加情報で見立てを更新',
    detail:
      '見立てをより確かにするための確認項目が提示されます。選択肢から選ぶか補足を自由記述して再生成できます。',
  },
  {
    step: '04',
    label: '合意文書のドラフトを作成',
    detail:
      '採用する仮説・介入案を選び、備考を加えて合意文書にまとめます。印刷またはコピーして支援記録に活用できます。',
  },
];

const BEFORE_AFTER = [
  {
    before: '経験と勘に頼った整理。支援者ごとにバラつきが出る。',
    after: '1076件の調査データと実践事例を背景に、系統的な見立てが出る。',
  },
  {
    before: '配慮候補を一から考えるのに時間がかかる。',
    after: '数分でドラフトが出る。支援者は確認・調整に集中できる。',
  },
  {
    before: '診断名があると先入観が入り、条件の見落としが起きやすい。',
    after: '診断名ではなく、本人・仕事・環境・支援・時間の条件で読み直す。',
  },
  {
    before: '配慮の合意文書をゼロから書くのが手間。',
    after: '相談整理から合意文書ドラフトまで、一つの流れで完結する。',
  },
];

const EVIDENCE_NUMBERS = [
  { value: '1,076', unit: '件', label: '調査データ課題行' },
  { value: '4,914', unit: '件', label: '経験の断片' },
  { value: '539', unit: '関連', label: 'GLM統計関係' },
  { value: '44', unit: 'パターン', label: 'ケースクラスタ照合' },
];

export default function JacIntroPage() {
  return (
    <>
      <PageSeo
        title="就労支援見立てサポート — 利用申込 | Next Being Lab"
        description="就労支援員・ジョブコーチ向けAI補助ツール。相談内容から配慮設計の叩き台を自動整理します。"
        path="/jac/intro"
      />

      <div className="min-h-screen bg-[#f5efe6] text-slate-900">
        {/* Nav */}
        <header className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition">
              Next Being Lab
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/jac/guide"
              className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-stone-400 transition"
            >
              仕事設計ガイド
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              利用申込
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 pb-24 space-y-16">

          {/* Hero */}
          <section className="pt-10 pb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-800">
              就労支援者向けAI補助ツール
            </p>
            <h1
              className={`mt-4 text-4xl md:text-6xl leading-[1.08] text-slate-950 ${display.className}`}
            >
              相談の整理を、
              <br />
              もっと速く、確かに。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              就労支援員・ジョブコーチ・障害者職業生活相談員が、相談後の整理作業に使うAI補助ツールです。
              相談内容を入力するだけで、職業的課題の仮見立てと配慮候補の優先順位をドラフトします。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
              >
                利用を申し込む（招待制）
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/jac/guide"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-white transition"
              >
                仕事設計ガイドを見る
              </Link>
            </div>
          </section>

          {/* Before / After */}
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6">
              何が変わるか
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {BEFORE_AFTER.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[1.8rem] border border-stone-200 bg-white/90 p-6"
                >
                  <p className="text-sm text-slate-500 line-through leading-relaxed">
                    {item.before}
                  </p>
                  <div className="mt-3 flex items-start gap-2">
                    <CheckCircle size={18} className="text-cyan-600 mt-0.5 shrink-0" />
                    <p className="text-base font-semibold text-slate-900 leading-relaxed">
                      {item.after}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6">
              操作の流れ
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.8rem] border border-stone-200 bg-white/90 p-6"
                >
                  <p className={`text-4xl font-black text-slate-200 ${display.className}`}>
                    {item.step}
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-950">{item.label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center">
              所要時間の目安：慣れれば1件あたり10〜15分
            </p>
          </section>

          {/* Evidence */}
          <section className="rounded-[2.2rem] border border-slate-900 bg-slate-950 px-8 py-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              背景にあるもの
            </p>
            <h2 className={`text-2xl md:text-3xl text-white leading-snug ${display.className}`}>
              診断名ではなく、条件で読む。
              <br />
              その根拠は、データと実践の積み重ね。
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-8 max-w-2xl">
              調査データ・実務記述・経験の断片・GLM統計をICFベースの相互作用モデルで統合し、
              実証データ由来の44ケースパターンとして整理しています。
              古い障害モデルや診断名だけのバイアスを除外したうえで、
              AIが個別ケースとの照合と構造仮説の生成を行います。
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {EVIDENCE_NUMBERS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center"
                >
                  <p className={`text-3xl font-black text-white ${display.className}`}>
                    {item.value}
                    <span className="text-lg ml-0.5">{item.unit}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* For whom + data handling */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.8rem] border border-stone-200 bg-white/90 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-cyan-700" />
                <p className="text-sm font-bold uppercase tracking-widest text-slate-600">
                  対象ユーザー
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  '就労移行・就労継続支援事業所の支援員',
                  'ジョブコーチ（職場適応援助者）',
                  '障害者職業生活相談員',
                  '企業の障害者雇用担当者・人事',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-base text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.8rem] border border-stone-200 bg-white/90 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-cyan-700" />
                <p className="text-sm font-bold uppercase tracking-widest text-slate-600">
                  データの扱い
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  '入力内容はNBLのサーバーに保存されません',
                  'AI処理のためOpenAIに送信されます（個人特定情報は入力しないでください）',
                  '最終判断は必ず支援者と本人が行います',
                  'アセスメント実行は1日20件まで（タグ提案・補足質問の生成は含まない / 就労支援業務に限る / 日本時間0時リセット）',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-6">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Guidebook Download */}
          <section className="rounded-[2rem] border border-cyan-200 bg-cyan-50/60 px-8 py-8">
            <div className="flex items-center gap-3 mb-4">
              <Download size={20} className="text-cyan-700 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-800">Free Download</p>
                <h2 className={`text-xl text-slate-950 font-bold ${display.className}`}>
                  仕事設計ガイドブック（26フレーム版）
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-7 max-w-2xl mb-5">
              3レイヤー・26フレームをまとめたガイドブックです。ブラウザで開き、印刷またはPDF保存してお使いください。
              診断名ではなく条件で読むための現場リファレンスとして活用できます。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/downloads/jac-26-card-guidebook.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-800 transition"
              >
                <Download size={15} />
                ガイドブックを開く（HTML）
              </a>
              <Link
                href="/jac/guide"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-stone-50 transition"
              >
                インタラクティブガイドを見る
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              ブラウザの印刷メニュー（Ctrl+P / ⌘+P）→「PDFとして保存」でPDF化できます。
            </p>
          </section>

          {/* Bottom CTA */}
          <section className="rounded-[2rem] border border-stone-300 bg-white/90 px-8 py-10 text-center">
            <p className="text-sm font-semibold text-slate-500 mb-3">招待制・無償提供（フィードバック条件）</p>
            <h2 className={`text-2xl md:text-3xl text-slate-950 ${display.className}`}>
              使ってみませんか。
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto leading-7">
              申込フォームから職種・メールアドレスをお送りください。確認のうえ、数日以内に個人単位のアクセストークンをお送りします。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition"
              >
                利用を申し込む
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/jac/guide"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-stone-50 transition"
              >
                仕事設計ガイドを先に見る
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-400">
              すでにアクセストークンをお持ちの方は
              <Link href="/jac/next" className="underline text-slate-600 hover:text-slate-900 transition ml-1">
                こちらからツールを使えます
              </Link>
              。
            </p>
          </section>

        </main>

        <footer className="border-t border-stone-300/80 py-8">
          <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-sm text-slate-500">
            <p>Next Being Lab</p>
            <Link href="/" className="hover:text-slate-900 transition">
              トップへ
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
