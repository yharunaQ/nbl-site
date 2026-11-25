import Link from 'next/link';
import { Building2, ClipboardList, GitBranch, ShieldCheck } from 'lucide-react';
import {
  DisclaimerBox,
  RareDiseaseProjectShell,
  SectionHeading,
} from '@/components/projects/RareDiseaseProjectChrome';
import {
  hospitalSupportItems,
  rareDiseaseProjectRoute,
} from '@/lib/content/rareDiseaseLinkageProject';

export default function RareDiseaseHospitalPage() {
  return (
    <RareDiseaseProjectShell
      title="病院向け実装支援 | 難病地域連携実装プロジェクト"
      description="病院の外来、医療相談室、地域連携室から、難病の生活・就労相談へ情報付きで橋渡しする初動フローを共同設計します。"
      path={`${rareDiseaseProjectRoute}/hospital`}
    >
      <section className="border-b border-slate-200 bg-[#f4f7f8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-sky-800">
              Hospital implementation
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              病院から地域へ、本人に説明責任を押し戻さない初動を作る。
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
              病院がすべてを担う必要はありません。一方で、最初の相談先や確認事項が見えないと、
              本人・家族が医療、生活、就労のあいだを一人で移動することになります。
            </p>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-emerald-700" />
              <h2 className="text-xl font-black">病院向けの境界</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              <li>• 医療判断は主治医・医療機関の範囲として扱う。</li>
              <li>• NBLは個別の病状評価や就労可否判断をしない。</li>
              <li>• 相談につなぐための情報粒度、役割分担、初動フローを整える。</li>
              <li>• 院内研修や既存会議への組み込みから始める。</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading eyebrow="Support menu" title="共同で整えるもの">
          医療機関の負担を増やすのではなく、地域へ橋渡ししやすい最小限の資料と流れを作ります。
        </SectionHeading>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {hospitalSupportItems.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6">
              <Building2 size={22} className="text-sky-700" />
              <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex items-center gap-3">
            <GitBranch size={22} className="text-emerald-700" />
            <h2 className="text-3xl font-black">院内初動フロー案</h2>
          </div>
          <div className="grid gap-4">
            {[
              [
                '外来・診療場面',
                '就労や生活の不安が見えたとき、個別判断をせず相談先と準備資料を案内する。',
              ],
              [
                '医療相談室・地域連携室',
                '本人の同意を前提に、次の窓口へ渡す情報と渡さない情報を整理する。',
              ],
              [
                '地域の相談先',
                '難病相談支援センター、保健所、ハローワーク等につなぎ、戻し先を確認する。',
              ],
              ['振り返り', 'つないだ後の困りごとを院内と地域でレビューし、フローを更新する。'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-black text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center gap-3">
            <ClipboardList size={22} className="text-emerald-800" />
            <h2 className="text-2xl font-black text-emerald-950">相談の入口</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-950">
            院内研修、地域連携会議、研究班の実装枠、自治体との協議など、既存の場に組み込める形でご相談ください。
            個人相談や病状判断の依頼は受け付けません。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              NBLへ連絡する
            </Link>
            <Link
              href={`${rareDiseaseProjectRoute}/workshop`}
              className="rounded-lg border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400"
            >
              共同実施ページを見る
            </Link>
          </div>
        </div>
      </section>

      <DisclaimerBox includeFormNotice />
    </RareDiseaseProjectShell>
  );
}
