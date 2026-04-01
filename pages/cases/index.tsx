import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import PageSeo from '@/components/PageSeo';
import { buildFchmaIntakeBlueprint } from '@/lib/fchma/intakeBlueprint';
import {
  listCaseStructureSources,
  listSupportPracticeSources,
  respondentCanonicalConceptMap,
  supporterBehavioralDriverSchema,
} from '@/lib/fchma/sourceSpecs';
import { fchmaInitialTableMetadata } from '@/lib/fchma/schemaMetadata';
import { getFchmaCaseRepository, type FchmaCaseRecord } from '@/lib/fchma/caseRepository';
import { buildFchmaLearningSummary, type FchmaLearningSummary } from '@/lib/fchma/learningSummary';
import { buildFchmaRuntimePostgresExportBundle } from '@/lib/fchma/runtimePostgresExport';

type CasesPageProps = {
  respondentSourceCount: number;
  supportSourceCount: number;
  intakeSectionCount: number;
  canonicalConceptCount: number;
  supporterDimensionCount: number;
  tableCount: number;
  learningSummary: FchmaLearningSummary;
  runtimeExportSummary: Record<string, number>;
  recentCases: Array<
    Pick<FchmaCaseRecord, 'id' | 'caseCode' | 'title' | 'primaryGoal' | 'updatedAt' | 'status'>
  >;
};

export const getServerSideProps: GetServerSideProps<CasesPageProps> = async () => {
  const blueprint = buildFchmaIntakeBlueprint();
  const repository = getFchmaCaseRepository();
  const cases = await repository.listCases();
  const recentCases = cases.slice(0, 8).map((caseRecord) => ({
    id: caseRecord.id,
    caseCode: caseRecord.caseCode,
    title: caseRecord.title,
    primaryGoal: caseRecord.primaryGoal,
    updatedAt: caseRecord.updatedAt,
    status: caseRecord.status,
  }));

  return {
    props: {
      respondentSourceCount: listCaseStructureSources().length,
      supportSourceCount: listSupportPracticeSources().length,
      intakeSectionCount: blueprint.sections.length,
      canonicalConceptCount: respondentCanonicalConceptMap.canonical_concepts.length,
      supporterDimensionCount: Object.keys(
        supporterBehavioralDriverSchema.canonical_dimensions,
      ).length,
      tableCount: fchmaInitialTableMetadata.length,
      learningSummary: buildFchmaLearningSummary(cases),
      runtimeExportSummary: buildFchmaRuntimePostgresExportBundle(cases).summary,
      recentCases,
    },
  };
};

export default function CasesPage(props: CasesPageProps) {
  const metrics = [
    { label: 'Respondent Sources', value: props.respondentSourceCount },
    { label: 'Support Practice Sources', value: props.supportSourceCount },
    { label: 'Intake Sections', value: props.intakeSectionCount },
    { label: 'Canonical Concepts', value: props.canonicalConceptCount },
    { label: 'Supporter Dimensions', value: props.supporterDimensionCount },
    { label: 'Initial Tables', value: props.tableCount },
  ];

  const learningMetrics = [
    { label: 'Total Cases', value: props.learningSummary.totalCases },
    { label: 'Reviewed', value: props.learningSummary.reviewedCases },
    { label: 'Feedback Cases', value: props.learningSummary.feedbackCases },
    { label: 'Needs Follow-up', value: props.learningSummary.needsFollowupCount },
  ];

  function statusBadgeClass(status: FchmaCaseRecord['status']): string {
    if (status === 'planned') {
      return 'bg-emerald-100 text-emerald-800';
    }
    if (status === 'in_followup') {
      return 'bg-cyan-100 text-cyan-800';
    }
    if (status === 'in_review') {
      return 'bg-amber-100 text-amber-800';
    }
    return 'bg-slate-100 text-slate-700';
  }

  return (
    <>
      <PageSeo
        title="FCHMA Cases"
        description="Case-centered FCHMA workspace for intake, structure, intervention, and feedback."
      />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(12,74,110,0.14),_transparent_30%),linear-gradient(180deg,_#f7fbfc_0%,_#eef5f3_48%,_#f8faf7_100%)] text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
                  FCHMA Case Workspace
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                  ケース中心で、見立てと支援を分けて進める。
                </h1>
                <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                  現行JACは残したまま、新しいFCHMA系は respondent-side の構造知と
                  supporter-side の実践知を別レーンで束ねる。ここではその土台を、
                  intake、schema、support pattern の順で積み上げていく。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/cases/new"
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  New Case Intake
                </Link>
                <Link
                  href="/cases/import"
                  className="rounded-full border border-teal-300 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-900 transition hover:border-teal-500"
                >
                  Import Survey Case
                </Link>
                <Link
                  href="/jac"
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  Open Current JAC
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                Product Loop
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ['1. Intake', '元テキストと structured field を別保持し、case_inputs と narrative_units に分ける。'],
                  ['2. Structure', 'ICF と拡張カテゴリを chain / relation / hypothesis に写す。'],
                  ['3. Intervention', 'supporter pattern asset を使って実施主体と実装条件まで出す。'],
                  ['4. Feedback', '実施結果を feedback_records と outcome_measures に戻し、支援知を更新する。'],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 p-4">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-950 p-7 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Current Build Focus
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                <li>case-centered schema draft is in place</li>
                <li>dataset specs are generated from original structured sources</li>
                <li>supporter-side driver schema is separated from respondent-side evidence</li>
                <li>the current slice now persists saved cases, review decisions, and feedback notes</li>
              </ul>

              <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Runtime Export Readiness
                </p>
                <div className="mt-3 grid gap-2 text-xs text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <span>cases</span>
                    <span>{props.runtimeExportSummary.cases ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>case_inputs</span>
                    <span>{props.runtimeExportSummary.case_inputs ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>feedback_records</span>
                    <span>{props.runtimeExportSummary.feedback_records ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>outcome_measures</span>
                    <span>{props.runtimeExportSummary.outcome_measures ?? 0}</span>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Learning Loop
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  feedback を、次の見立て改善に戻す
                </h2>
              </div>
              <Link
                href="/cases/import"
                className="rounded-full border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-900 transition hover:border-cyan-500"
              >
                Import More Survey Cases
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {learningMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Source Mix
                </p>
                <div className="mt-4 space-y-3">
                  {props.learningSummary.sourceCounts.length === 0 ? (
                    <p className="text-sm text-slate-600">まだ learning source はありません。</p>
                  ) : (
                    props.learningSummary.sourceCounts.map((entry) => (
                      <div key={entry.label} className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-slate-700">{entry.label}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {entry.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Top Hypotheses
                </p>
                <div className="mt-4 space-y-3">
                  {props.learningSummary.topHypotheses.length === 0 ? (
                    <p className="text-sm text-slate-600">レビュー採択後にここへ集約されます。</p>
                  ) : (
                    props.learningSummary.topHypotheses.map((entry) => (
                      <div key={entry.label} className="rounded-2xl bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                          selected {entry.count}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Updated Structure Signals
                </p>
                <div className="mt-4 space-y-3">
                  {props.learningSummary.updatedStructureSignals.length === 0 ? (
                    <p className="text-sm text-slate-600">feedback の再見立てメモが集まるとここに出ます。</p>
                  ) : (
                    props.learningSummary.updatedStructureSignals.map((entry) => (
                      <div key={entry.label} className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-slate-700">{entry.label}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {entry.count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {props.learningSummary.topInterventions.slice(0, 4).map((entry) => (
                <article
                  key={entry.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                      {entry.interventionType}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {entry.ownerRole}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{entry.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      selected {entry.selectedCount}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                      improved {entry.improvedCount}
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      partial {entry.partiallyImprovedCount}
                    </span>
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-800">
                      not improved {entry.notImprovedCount}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
                      not implemented {entry.notImplementedCount}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Saved Cases
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  `.tmp` に保存されたケース
                </h2>
              </div>
              <Link
                href="/cases/new"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
              >
                Add Another
              </Link>
            </div>

            {props.recentCases.length === 0 ? (
              <p className="mt-6 text-sm leading-7 text-slate-600">
                まだ保存されたケースはありません。`/cases/new` で intake を保存するとここに並びます。
              </p>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {props.recentCases.map((caseRecord) => (
                  <Link
                    key={caseRecord.id}
                    href={`/cases/${caseRecord.id}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-slate-400 hover:bg-white"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {caseRecord.caseCode}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {caseRecord.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {caseRecord.primaryGoal || '主目標は未入力'}
                    </p>
                    <div className="mt-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusBadgeClass(
                          caseRecord.status,
                        )}`}
                      >
                        {caseRecord.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      updated: {new Date(caseRecord.updatedAt).toLocaleString('ja-JP')}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
