import Link from 'next/link';
import { DownloadCloud, FileText, ShieldAlert } from 'lucide-react';
import {
  DisclaimerBox,
  RareDiseaseProjectShell,
  SectionHeading,
} from '@/components/projects/RareDiseaseProjectChrome';
import {
  rareDiseaseNoPersonalInfoNotice,
  rareDiseaseProjectRoute,
  rareDiseaseResources,
} from '@/lib/content/rareDiseaseLinkageProject';

export default function RareDiseaseResourcesPage() {
  return (
    <RareDiseaseProjectShell
      title="無料資料 | 難病地域連携実装プロジェクト"
      description="情報付きつなぎシート、相談準備シート、地域連携フローなど、難病地域連携を支える無料資料の入口。"
      path={`${rareDiseaseProjectRoute}/resources`}
    >
      <section className="border-b border-slate-200 bg-[#f4f7f8]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="inline-flex rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-sky-800">
            Free Resources
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
            丸投げを減らすための、共通資料を公開準備する。
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
            資料は、本人・家族に説明負担を寄せすぎず、次の窓口が受け取りやすい情報の粒度を整えるためのものです。
            公開前に、本人・家族・患者会・実務者のレビューを受けながら更新します。
          </p>
          <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-900">
              <ShieldAlert size={18} />
              フォームや連絡時の注意
            </div>
            <p className="mt-3 text-sm leading-7 text-rose-950">
              {rareDiseaseNoPersonalInfoNotice}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading eyebrow="Resource set" title="最初の無料資料セット">
          個別相談の受付ではなく、地域で使える共通資料のレビュー版として整えます。公開ファイル化する前の段階では、危険表現と使いにくい項目の確認を優先します。
        </SectionHeading>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {rareDiseaseResources.map((resource) => (
            <article
              key={resource.title}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <FileText size={22} className="shrink-0 text-emerald-700" />
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
                  {resource.status}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">{resource.title}</h2>
              <dl className="mt-4 space-y-3 text-sm leading-7">
                <div>
                  <dt className="font-bold text-slate-950">想定利用者</dt>
                  <dd className="text-slate-700">{resource.target}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">使い方</dt>
                  <dd className="text-slate-700">{resource.use}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <DownloadCloud size={22} className="text-sky-700" />
              <h2 className="text-3xl font-black">公開順序</h2>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-700">
              最初から完成版として出さず、レビューしやすい短い版で公開します。本人・家族向け資料と機関向け資料を混ぜず、
              それぞれの読み手が不安なく使える言葉に分けます。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                '1',
                '相談準備とつなぎ',
                '本人・家族向け相談準備シートと情報付きつなぎシートを先に整える。',
              ],
              ['2', '地域フロー', '機関別役割分担表と地域連携フローを共同レビューする。'],
              ['3', '共同実施', '院内、自治体、協議会、研究班の既存枠に組み込む資料へ整える。'],
            ].map(([step, title, detail]) => (
              <div key={step} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Step {step}
                </p>
                <h3 className="mt-2 text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-2xl font-black text-emerald-950">レビュー協力を受け付けます</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-950">
            資料の表現、順序、使いづらさについてのレビューを歓迎します。個別相談ではなく、資料改善の観点でご連絡ください。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`${rareDiseaseProjectRoute}/partner`}
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              レビュー協力を見る
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400"
            >
              NBLへ連絡する
            </Link>
          </div>
        </div>
      </section>

      <DisclaimerBox includeFormNotice />
    </RareDiseaseProjectShell>
  );
}
