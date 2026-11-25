import Link from 'next/link';
import { HandCoins, HeartHandshake, MessageSquareWarning, UsersRound } from 'lucide-react';
import {
  DisclaimerBox,
  RareDiseaseProjectShell,
  SectionHeading,
} from '@/components/projects/RareDiseaseProjectChrome';
import {
  fundingCandidates,
  rareDiseaseNoPersonalInfoNotice,
  rareDiseasePartnerRoles,
  rareDiseaseProjectRoute,
} from '@/lib/content/rareDiseaseLinkageProject';

export default function RareDiseasePartnerPage() {
  return (
    <RareDiseaseProjectShell
      title="レビュー協力 | 難病地域連携実装プロジェクト"
      description="本人・家族・患者会・公的支援機関を顧客ではなく共同設計者として位置付け、資料と連携フローをレビューする協力ページ。"
      path={`${rareDiseaseProjectRoute}/partner`}
    >
      <section className="border-b border-slate-200 bg-[#f4f7f8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
              Review partners
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              本人・家族・患者会・公的支援機関は、顧客ではなく共同設計者です。
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
              NBLは、資料の言葉、情報の粒度、就労圧力に見える箇所、既存機関批判に見える箇所を、
              関係者と一緒に直します。
            </p>
          </div>
          <aside className="rounded-lg border border-rose-200 bg-rose-50 p-6">
            <div className="flex items-center gap-3">
              <MessageSquareWarning size={22} className="text-rose-800" />
              <h2 className="text-xl font-black text-rose-950">送らないでください</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-rose-950">
              {rareDiseaseNoPersonalInfoNotice}
            </p>
            <p className="mt-3 text-sm leading-7 text-rose-950">
              レビュー協力では、個別相談ではなく、資料の表現、構成、危険な誤解、使いやすさについてご意見をいただきます。
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading eyebrow="Roles" title="協力の形">
          協力者ごとに役割と境界を分けます。誰か一者に負担を寄せず、公開資料と連携フローを育てます。
        </SectionHeading>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {rareDiseasePartnerRoles.map((role) => (
            <article key={role.partner} className="rounded-lg border border-slate-200 bg-white p-6">
              <UsersRound size={22} className="text-emerald-700" />
              <h2 className="mt-4 text-xl font-black text-slate-950">{role.partner}</h2>
              <dl className="mt-4 space-y-4 text-sm leading-7">
                <div>
                  <dt className="font-bold text-slate-950">役割</dt>
                  <dd className="text-slate-700">{role.role}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">境界</dt>
                  <dd className="text-slate-700">{role.boundary}</dd>
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
              <HandCoins size={22} className="text-sky-700" />
              <h2 className="text-3xl font-black">持続可能な費用負担候補</h2>
            </div>
            <p className="mt-4 text-base leading-8 text-slate-700">
              無料資料と共同レビューを続けるため、費用負担の候補は本人・家族・患者会ではなく、既存の実装枠や社会的投資枠に置きます。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fundingCandidates.map((candidate) => (
              <div key={candidate} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold leading-7 text-slate-800">{candidate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center gap-3">
              <HeartHandshake size={22} className="text-emerald-800" />
              <h2 className="text-2xl font-black text-emerald-950">レビューしたい方へ</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-emerald-950">
              「この表現は就労圧力に見える」「この項目は本人が書きにくい」「このつなぎ方は現場で詰まる」
              といった資料改善の視点でご連絡ください。
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-black text-slate-950">連絡時のお願い</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              所属、協力したい観点、レビュー可能な資料種別だけで十分です。病名、病状、具体的な個別相談、第三者の個人情報は送らないでください。
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
