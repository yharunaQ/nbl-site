import Link from 'next/link';
import { CalendarClock, CheckCircle2, ClipboardCheck, UsersRound } from 'lucide-react';
import {
  DisclaimerBox,
  RareDiseaseProjectShell,
  SectionHeading,
} from '@/components/projects/RareDiseaseProjectChrome';
import { rareDiseaseProjectRoute, workshopFormats } from '@/lib/content/rareDiseaseLinkageProject';

export default function RareDiseaseWorkshopPage() {
  return (
    <RareDiseaseProjectShell
      title="共同実施ページ | 難病地域連携実装プロジェクト"
      description="難病地域連携を、商業的な研修販売ではなく、既存研修・協議会・委託枠に組み込む共同実施として設計します。"
      path={`${rareDiseaseProjectRoute}/workshop`}
    >
      <section className="border-b border-slate-200 bg-[#f4f7f8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
              Co-implementation
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              研修を売るのではなく、地域の連携フローを一緒に作る。
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
              ワークショップは、NBLの講義を消費してもらう場ではありません。参加機関が、自分たちの地域で使える
              「情報付き橋渡し」の流れを作り、資料を直す共同実施の場です。
            </p>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UsersRound size={22} className="text-emerald-700" />
              <h2 className="text-xl font-black">対象</h2>
            </div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {[
                '医療機関、医療相談室、地域連携室',
                '難病相談支援センター、保健所、自治体',
                'ハローワーク、就業・生活支援センター、就労支援機関',
                '本人・家族・患者会などのレビュー協力者',
                '企業、研究班、財団、協議会などの費用負担候補',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg bg-slate-50 px-4 py-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading eyebrow="Formats" title="共同実施の型">
          地域の現状に合わせ、既存の会議や研修に差し込める小さな型から始めます。成果物は資料、役割分担表、次の一手です。
        </SectionHeading>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {workshopFormats.map((format) => (
            <article key={format.title} className="rounded-lg border border-slate-200 bg-white p-6">
              <ClipboardCheck size={22} className="text-sky-700" />
              <h2 className="mt-4 text-xl font-black text-slate-950">{format.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{format.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex items-center gap-3">
            <CalendarClock size={22} className="text-emerald-700" />
            <h2 className="text-3xl font-black">90分の例</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['0-10分', 'NBLの立ち位置とやらないことを確認する。'],
              ['10-25分', '地域で連携が止まる場面を匿名・一般化して共有する。'],
              ['25-55分', '初動、相談、就職後、見直しのフローを作る。'],
              ['55-75分', '情報付きつなぎシートの項目をレビューする。'],
              ['75-90分', '次の一手、レビュー担当、公開できる資料を決める。'],
            ].map(([time, detail]) => (
              <div key={time} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-black text-emerald-800">{time}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="text-2xl font-black text-emerald-950">残す成果物</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-emerald-950">
              <li>• 地域連携フロー案</li>
              <li>• 機関別役割分担表</li>
              <li>• 情報付きつなぎシートの改善点</li>
              <li>• 本人・家族向け資料の危険表現メモ</li>
              <li>• 次回レビューまでの担当と期限</li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-black text-slate-950">相談の始め方</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              既存研修、協議会、研究班、委託事業、院内会議などへの組み込み可否を一緒に確認します。
              個人の病状や個別相談ではなく、地域の連携設計としてご連絡ください。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                NBLへ連絡する
              </Link>
              <Link
                href={`${rareDiseaseProjectRoute}/resources`}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                資料ページを見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DisclaimerBox includeFormNotice />
    </RareDiseaseProjectShell>
  );
}
