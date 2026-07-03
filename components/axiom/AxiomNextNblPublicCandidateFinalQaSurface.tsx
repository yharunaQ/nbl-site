import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  buildAxiomNextNblPublicCandidateFinalQaRun,
  validateAxiomNextNblPublicCandidateFinalQaRun,
  type AxiomNextNblFinalQaPageSlug,
  type AxiomNextNblPublicLanguageRiskTerm,
  type AxiomNextNblVisualQaMatrixItem,
} from '@/lib/axiom/nextNblPublicCandidateFinalQa';
import {
  buildAxiomNblReportArticleVisualQaItems,
  validateAxiomNblReportArticleVisualQaItems,
  type AxiomNblReportArticleVisualQaItem,
} from './AxiomNextNblPublicCandidateSiteSurface';

const pageLabels: Record<AxiomNextNblFinalQaPageSlug, string> = {
  home: 'トップ',
  'scene-entry': '8つの課題',
  'case-readings': '相談事例',
  'work-design-views-guide': '設計ガイド',
  'articles-social-questions': 'NBLレポート',
  'toolkit-studio': 'ツールキット',
  'work-condition-window': '障害種類から見る',
  'theory-method-trust': 'NBLの専門性',
  'about-boundary': 'サイト情報',
};

const assetKindLabels: Record<AxiomNextNblVisualQaMatrixItem['assetKind'], string> = {
  hero: 'Hero図',
  issue_map: '課題地図',
  comic: '4コマ',
  guide_premise: '設計前提図',
  guide_situation: '状況レベル図',
  guide_design_items: '具体設計項目図',
  report_infographic: '記事図解',
  toolkit_shelf: '素材棚',
};

function groupedByPage(items: readonly AxiomNextNblVisualQaMatrixItem[]) {
  return items.reduce(
    (groups, item) => {
      groups[item.pageSlug] = [...(groups[item.pageSlug] ?? []), item];
      return groups;
    },
    {} as Partial<Record<AxiomNextNblFinalQaPageSlug, AxiomNextNblVisualQaMatrixItem[]>>,
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MatrixItemCard({ item }: { item: AxiomNextNblVisualQaMatrixItem }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
              {assetKindLabels[item.assetKind]}
            </span>
            <span className="text-xs font-semibold text-slate-500">{item.qaId}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-normal text-slate-950">
            {item.intendedReaderUnderstandingJa}
          </h3>
        </div>
        <Link
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
          href={item.pagePath}
        >
          ページを見る
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">画像</p>
          <p className="mt-1 break-all text-sm leading-6 text-slate-800">{item.imageSrc}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">周辺コピー</p>
          <p className="mt-1 text-sm leading-6 text-slate-800">{item.surroundingCopyJa}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
        <p className="text-xs font-semibold text-amber-900">alt確認</p>
        <p className="mt-1 text-sm leading-6 text-slate-800">{item.imageAlt}</p>
      </div>

      <ul className="mt-4 grid gap-2 md:grid-cols-3">
        {item.humanVisualCheckJa.map((check) => (
          <li className="flex gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700" key={check}>
            <ImageIcon className="mt-1 shrink-0 text-teal-700" size={15} />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function RiskTermCard({ term }: { term: AxiomNextNblPublicLanguageRiskTerm }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-normal text-slate-950">{term.term}</h3>
        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-900">
          {term.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{term.readerRiskJa}</p>
      <p className="mt-3 rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-950">
        {term.replacementPrincipleJa}
      </p>
    </article>
  );
}

function ReportArticleQaCard({ item }: { item: AxiomNblReportArticleVisualQaItem }) {
  return (
    <article
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      data-report-article-visual-qa-item
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">
          記事 {item.articleNumber}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {item.theme}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {item.category}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug tracking-normal text-slate-950">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{item.readerQuestion}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-500">図解</p>
          <p className="mt-1 break-all text-sm leading-6 text-slate-800">{item.imageSrc}</p>
          <p className="mt-3 text-xs font-semibold text-slate-500">alt</p>
          <p className="mt-1 text-sm leading-6 text-slate-800">{item.imageAlt}</p>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 p-3">
          <p className="text-xs font-semibold text-teal-900">この図解で先に見ること</p>
          <p className="mt-1 text-sm leading-6 text-slate-800">{item.visualCorrespondenceBody}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.visualCues.map((cue) => (
              <span
                className="rounded-full border border-teal-200 bg-white px-2.5 py-1 text-xs font-semibold text-teal-900"
                key={`${item.articleId}-${cue}`}
              >
                {cue}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">本文見出し</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
            {item.sectionHeadings.map((heading) => (
              <li key={`${item.articleId}-${heading}`}>{heading}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-900">確認点</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
            {item.humanVisualCheckJa.map((check) => (
              <li key={`${item.articleId}-${check}`}>{check}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function AxiomNextNblPublicCandidateFinalQaSurface() {
  const run = buildAxiomNextNblPublicCandidateFinalQaRun();
  const validation = validateAxiomNextNblPublicCandidateFinalQaRun(run);
  const reportArticleItems = buildAxiomNblReportArticleVisualQaItems();
  const reportArticleValidation = validateAxiomNblReportArticleVisualQaItems(reportArticleItems);
  const groups = groupedByPage(run.visualQaMatrix);

  return (
    <main className="min-h-screen bg-[#fbfaf5] text-slate-950">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
              Falcon Lab / internal final QA
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-6xl">
              公開候補 Final QA：画像・本文・境界語を揃える。
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-200">
              ベータ2の結果を、公開前に人間が確認しやすい形へ圧縮した確認面です。
              ブラウザの実画面確認がブロックされているため、ここでは主要画像・本文・alt・公開語彙の対応をコード上の契約として固定します。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard label="pages" value={run.pageCoverage.length} />
            <StatCard label="visual checks" value={run.visualQaMatrix.length} />
            <StatCard label="risk terms" value={run.publicLanguageRiskTerms.length} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-teal-700" size={20} />
              <h2 className="text-2xl font-semibold tracking-normal text-slate-950">QA結論</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {run.qaConclusionsJa.map((conclusion) => (
                <li className="flex gap-2" key={conclusion}>
                  <ShieldCheck className="mt-1 shrink-0 text-teal-700" size={15} />
                  <span>{conclusion}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className={validation.valid ? 'text-teal-700' : 'text-red-700'} size={20} />
              <h2 className="text-2xl font-semibold tracking-normal text-slate-950">検証状態</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{validation.validationStatus}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              error count: <strong>{validation.errorCount}</strong>
            </p>
            {validation.errors.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm leading-6 text-red-900">
                {validation.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            visual matrix
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            主要画像・本文・alt対応表
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-650">
            画像が「飾り」になっていないか、本文と違う意味を出していないか、altだけでも要点が伝わるかを確認するための表です。
          </p>
        </div>

        <div className="space-y-8">
          {run.pageCoverage
            .filter((pageSlug) => groups[pageSlug]?.length)
            .map((pageSlug) => (
              <section className="rounded-lg border border-slate-200 bg-[#fffdf8] p-4 shadow-sm md:p-6" key={pageSlug}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold tracking-normal text-slate-950">
                    {pageLabels[pageSlug]}
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {groups[pageSlug]?.length ?? 0} items
                  </span>
                </div>
                <div className="grid gap-4">
                  {groups[pageSlug]?.map((item) => (
                    <MatrixItemCard item={item} key={item.qaId} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
              language boundary
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              公開語彙リスク
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-650">
              内部語は、読者には「設計思想」ではなく「開発中の説明」に見えます。公開候補本文では公開語へ翻訳します。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {run.publicLanguageRiskTerms.map((term) => (
              <RiskTermCard key={term.term} term={term} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            report article visuals
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            NBLレポート36記事・図解対応表
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-650">
            NBLレポートはHeroだけでなく、各記事の図解が本文の入口になります。ここでは36本すべてについて、記事の問い、図解、alt、図解対応、本文見出しの一致を確認します。
          </p>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
            <strong>validation:</strong> {reportArticleValidation.validationStatus} / error count:{' '}
            {reportArticleValidation.errorCount}
            {reportArticleValidation.errors.length > 0 && (
              <ul className="mt-2 text-red-900">
                {reportArticleValidation.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          {reportArticleItems.map((item) => (
            <ReportArticleQaCard item={item} key={item.articleId} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white">
          <h2 className="text-2xl font-semibold tracking-normal">今回動かしていない境界</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {run.notNow.map((item) => (
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
