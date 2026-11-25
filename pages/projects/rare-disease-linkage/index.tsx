import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  HeartHandshake,
  Layers3,
  Route,
} from 'lucide-react';
import {
  DisclaimerBox,
  RareDiseaseProjectShell,
  SectionHeading,
} from '@/components/projects/RareDiseaseProjectChrome';
import {
  rareDiseaseBoundaryPrinciples,
  rareDiseaseHero,
  rareDiseaseImplementationLayers,
  rareDiseaseInteractionPatterns,
  rareDiseaseProjectRoute,
} from '@/lib/content/rareDiseaseLinkageProject';

export default function RareDiseaseLinkagePage() {
  return (
    <RareDiseaseProjectShell
      title="難病地域連携実装プロジェクト | Next Being Lab"
      description="難病支援を、丸投げから情報付き橋渡しへ。医療、福祉、雇用、生活支援のあいだで役割と情報をつなぐNBLの公開プロジェクト。"
      path={rareDiseaseProjectRoute}
    >
      <section className="border-b border-slate-200 bg-[#f4f7f8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-end">
          <div>
            <p className="inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
              {rareDiseaseHero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl">
              {rareDiseaseHero.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700 md:text-xl">
              {rareDiseaseHero.subtitle}
            </p>
            <p className="mt-6 max-w-3xl rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700 shadow-sm">
              {rareDiseaseHero.note}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${rareDiseaseProjectRoute}/resources`}
                className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                無料資料を見る
              </Link>
              <Link
                href={`${rareDiseaseProjectRoute}/partner`}
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                レビュー協力へ
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <HeartHandshake size={22} className="text-emerald-700" />
              <h2 className="text-xl font-black text-slate-950">NBLの立ち位置</h2>
            </div>
            <div className="mt-5 space-y-3">
              {rareDiseaseBoundaryPrinciples.map((principle) => (
                <div key={principle} className="flex gap-3 rounded-lg bg-slate-50 px-4 py-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
                  <p className="text-sm leading-7 text-slate-700">{principle}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading eyebrow="What blocks linkage" title="連携が止まる7つの場面">
            問題は、どこか一つの機関が悪いことではありません。情報、タイミング、役割、戻し方が途切れることで、本人が調整役を背負わされる構造です。
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-2">
            {rareDiseaseInteractionPatterns.map((pattern) => (
              <article
                key={pattern.title}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <h3 className="text-lg font-black text-slate-950">{pattern.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{pattern.observation}</p>
                <p className="mt-4 border-t border-slate-200 pt-4 text-sm font-semibold leading-7 text-emerald-900">
                  {pattern.response}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3">
            <Layers3 size={22} className="text-sky-700" />
            <h2 className="text-3xl font-black text-slate-950">3層で実装する</h2>
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {rareDiseaseImplementationLayers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-xl font-black text-slate-950">{layer.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {layer.points.map((point) => (
                    <span
                      key={point}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading eyebrow="Information-backed handoff" title="情報付き橋渡しの最小フロー">
            本人の詳細な病状を集めるのではなく、次の窓口が迷わず受け取れる情報の粒度を整えます。
          </SectionHeading>
          <div className="grid gap-4">
            {[
              ['1. 早期に気づく', '退職危機や孤立が深まる前に、相談先と確認事項を渡す。'],
              [
                '2. 本人と整理する',
                '希望、不安、生活上の制約、次に聞きたいことを本人の言葉で整える。',
              ],
              [
                '3. 情報付きでつなぐ',
                '必要最小限の情報、担当機関、戻し先を明記して次の窓口へ渡す。',
              ],
              ['4. つないだ後に戻す', '就職後、復職後、相談後の変化を地域内で見直す。'],
            ].map(([title, detail]) => (
              <div
                key={title}
                className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5"
              >
                <Route size={20} className="mt-1 shrink-0 text-emerald-700" />
                <div>
                  <p className="text-sm font-black text-slate-950">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#eef3f2]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              title: '無料資料',
              detail: '情報付きつなぎシート、相談準備シート、地域連携フローなどを順次公開します。',
              href: `${rareDiseaseProjectRoute}/resources`,
              cta: '資料ページへ',
            },
            {
              icon: GitBranch,
              title: '共同実施',
              detail: '既存研修や協議会に組み込み、地域ごとの連携フロー案を作ります。',
              href: `${rareDiseaseProjectRoute}/workshop`,
              cta: '共同実施を見る',
            },
            {
              icon: HeartHandshake,
              title: 'レビュー協力',
              detail: '本人・家族・患者会・支援機関と、危険な表現や使いにくさを直します。',
              href: `${rareDiseaseProjectRoute}/partner`,
              cta: '協力の形を見る',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-slate-200 bg-white p-6 transition hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              <item.icon size={22} className="text-emerald-700" />
              <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">
                {item.cta}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <DisclaimerBox includeFormNotice />
    </RareDiseaseProjectShell>
  );
}
