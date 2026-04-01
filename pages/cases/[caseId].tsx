import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import {
  type AppendFchmaCaseFeedbackInput,
  type FchmaCaseRecord,
  type SaveFchmaCaseReviewInput,
  getFchmaCaseRepository,
} from '@/lib/fchma/caseRepository';

type CaseDetailPageProps = {
  caseRecord: FchmaCaseRecord;
};

type ReviewFormState = {
  reviewerDecision: SaveFchmaCaseReviewInput['reviewerDecision'];
  reviewNotes: string;
  selectedHypotheses: string[];
  selectedInterventions: string[];
};

type FeedbackFormState = {
  selectedInterventionTitle: string;
  implemented: boolean;
  implementationNotes: string;
  observedEffect: string;
  unresolvedIssues: string;
  updatedStructureNotes: string;
  reviewerSummary: string;
};

const reviewDecisionLabels: Record<ReviewFormState['reviewerDecision'], string> = {
  pending: 'pending',
  accepted: 'accepted',
  modified: 'modified',
  rejected: 'rejected',
};

export const getServerSideProps: GetServerSideProps<CaseDetailPageProps> = async (context) => {
  const caseId = String(context.params?.caseId || '').trim();
  const repository = getFchmaCaseRepository();
  const caseRecord = caseId ? await repository.getCase(caseId) : null;

  if (!caseRecord) {
    return { notFound: true };
  }

  return {
    props: {
      caseRecord,
    },
  };
};

function buildInitialReviewForm(caseRecord: FchmaCaseRecord): ReviewFormState {
  return {
    reviewerDecision: caseRecord.review.reviewerDecision,
    reviewNotes: caseRecord.review.reviewNotes,
    selectedHypotheses: caseRecord.review.selectedHypotheses,
    selectedInterventions: caseRecord.review.selectedInterventions,
  };
}

function buildInitialFeedbackForm(caseRecord: FchmaCaseRecord): FeedbackFormState {
  const selectedInterventionTitle =
    caseRecord.review.selectedInterventions[0] || caseRecord.interventionPreview[0]?.title || '';

  return {
    selectedInterventionTitle,
    implemented: true,
    implementationNotes: '',
    observedEffect: '',
    unresolvedIssues: '',
    updatedStructureNotes: '',
    reviewerSummary: '',
  };
}

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

export default function CaseDetailPage({ caseRecord }: CaseDetailPageProps) {
  const [currentCase, setCurrentCase] = useState(caseRecord);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(buildInitialReviewForm(caseRecord));
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormState>(
    buildInitialFeedbackForm(caseRecord),
  );
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const availableInterventionTitles =
    currentCase.review.selectedInterventions.length > 0
      ? currentCase.review.selectedInterventions
      : currentCase.interventionPreview.map((item) => item.title);

  function toggleArrayValue(
    field: 'selectedHypotheses' | 'selectedInterventions',
    value: string,
  ) {
    setReviewForm((current) => {
      const existing = current[field];
      const nextValues = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];

      return {
        ...current,
        [field]: nextValues,
      };
    });
  }

  async function handleSaveReview() {
    setIsSavingReview(true);
    setReviewError(null);
    setReviewMessage(null);

    try {
      const response = await fetch(`/api/fchma/cases/${currentCase.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      const data = (await response.json()) as { caseRecord?: FchmaCaseRecord; error?: string };

      if (!response.ok || !data.caseRecord) {
        throw new Error(data.error || 'Review save failed');
      }

      const nextCaseRecord = data.caseRecord;

      setCurrentCase(nextCaseRecord);
      setReviewForm(buildInitialReviewForm(nextCaseRecord));
      setFeedbackForm((current) => {
        const nextDefault =
          nextCaseRecord.review.selectedInterventions[0] ||
          current.selectedInterventionTitle ||
          nextCaseRecord.interventionPreview[0]?.title ||
          '';

        return {
          ...current,
          selectedInterventionTitle: nextDefault,
        };
      });
      setReviewMessage('構造レビューを保存しました。');
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSavingReview(false);
    }
  }

  async function handleSaveFeedback() {
    setIsSavingFeedback(true);
    setFeedbackError(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`/api/fchma/cases/${currentCase.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm),
      });
      const data = (await response.json()) as { caseRecord?: FchmaCaseRecord; error?: string };

      if (!response.ok || !data.caseRecord) {
        throw new Error(data.error || 'Feedback save failed');
      }

      const nextCaseRecord = data.caseRecord;

      setCurrentCase(nextCaseRecord);
      setFeedbackForm({
        ...buildInitialFeedbackForm(nextCaseRecord),
        selectedInterventionTitle:
          feedbackForm.selectedInterventionTitle ||
          nextCaseRecord.review.selectedInterventions[0] ||
          nextCaseRecord.interventionPreview[0]?.title ||
          '',
      });
      setFeedbackMessage('実施結果を保存しました。');
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSavingFeedback(false);
    }
  }

  return (
    <>
      <PageSeo
        title={`${currentCase.title} | FCHMA Case`}
        description={currentCase.primaryGoal || 'FCHMA case detail'}
      />
      <main className="min-h-screen bg-[linear-gradient(180deg,_#f5faf6_0%,_#eef6fb_100%)] text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
          <section className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
                  {currentCase.caseCode}
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                  {currentCase.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  {currentCase.primaryGoal || '主目標は未入力'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusBadgeClass(
                      currentCase.status,
                    )}`}
                  >
                    {currentCase.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    updated: {new Date(currentCase.updatedAt).toLocaleString('ja-JP')}
                  </span>
                  {currentCase.intakePayload.inputType === 'survey_import' &&
                  currentCase.intakePayload.importContext ? (
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-900">
                      import {currentCase.intakePayload.importContext.datasetId} /{' '}
                      {currentCase.intakePayload.importContext.subjectKey}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/cases"
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Back to Cases
                </Link>
                <Link
                  href="/cases/new"
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  New Intake
                </Link>
                <Link
                  href="/cases/import"
                  className="rounded-full border border-cyan-300 px-5 py-3 text-sm font-semibold text-cyan-900"
                >
                  Import Survey Case
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Intake Preview</h2>
              <div className="mt-4 space-y-3">
                {currentCase.intakePreview.fieldPreviews.map((field) => (
                  <div key={field.fieldKey} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {field.fieldKey} <span className="text-slate-400">/</span>{' '}
                      {field.canonicalConcept}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-teal-700">
                      {field.responseType}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{field.rawValueText}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Health Conditions</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {currentCase.intakePreview.healthConditions.map((item) => (
                  <div
                    key={item.rawLabel}
                    className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700"
                  >
                    <p className="font-medium text-slate-900">{item.rawLabel}</p>
                    {item.normalizationCandidates.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.normalizationCandidates.map((candidate) => (
                          <span
                            key={`${item.rawLabel}-${candidate.seedId}`}
                            className="rounded-full bg-white px-2 py-1 text-xs text-cyan-900"
                          >
                            {candidate.preferredLabelSeed} · {candidate.normalizationScope}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        seed-based normalization candidate なし
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <h2 className="mt-8 text-xl font-semibold text-slate-950">Narrative Units</h2>
              <div className="mt-4 space-y-3">
                {currentCase.intakePreview.narrativeUnits.slice(0, 16).map((unit) => (
                  <div
                    key={`${unit.sourceFieldKey}-${unit.sequenceNo}-${unit.rawText}`}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {unit.sourceFieldKey} #{unit.sequenceNo}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{unit.rawText}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Structure Preview</h2>
              <div className="mt-4 grid gap-3">
                {currentCase.structurePreview.elements.map((element) => (
                  <div key={element.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{element.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      {element.elementGroup} · {element.polarity}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{element.evidenceSource}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3">
                {currentCase.structurePreview.relations.map((relation) => (
                  <div key={relation.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {relation.sourceElementId} → {relation.targetElementId}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-teal-700">
                      {relation.relationType}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{relation.rationale}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {currentCase.structurePreview.hypotheses.map((hypothesis) => (
                  <div key={hypothesis.label} className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{hypothesis.label}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{hypothesis.rationale}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hypothesis.interventionPoints.map((point) => (
                        <span
                          key={point}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-teal-800"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
              <h2 className="text-xl font-semibold text-slate-950">Intervention Preview</h2>
              <div className="mt-4 space-y-3">
                {currentCase.interventionPreview.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.interventionType}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.ownerRole}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.rationale}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.implementationNotes.map((note) => (
                        <span
                          key={note}
                          className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-slate-700"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.supporterLens.map((lens) => (
                        <span
                          key={lens}
                          className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white"
                        >
                          {lens}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Human Review
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    構造候補の採択と修正
                  </h2>
                </div>
                {currentCase.review.updatedAt ? (
                  <span className="text-xs text-slate-500">
                    reviewed: {new Date(currentCase.review.updatedAt).toLocaleString('ja-JP')}
                  </span>
                ) : null}
              </div>

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Reviewer Decision
              </label>
              <select
                value={reviewForm.reviewerDecision}
                onChange={(event) =>
                  setReviewForm((current) => ({
                    ...current,
                    reviewerDecision: event.target.value as ReviewFormState['reviewerDecision'],
                  }))
                }
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                {Object.entries(reviewDecisionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Selected Hypotheses
                </p>
                <div className="mt-3 space-y-3">
                  {currentCase.structurePreview.hypotheses.map((hypothesis) => (
                    <label key={hypothesis.label} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
                      <input
                        type="checkbox"
                        checked={reviewForm.selectedHypotheses.includes(hypothesis.label)}
                        onChange={() => toggleArrayValue('selectedHypotheses', hypothesis.label)}
                        className="mt-1 h-4 w-4 rounded border-slate-300"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">
                          {hypothesis.label}
                        </span>
                        <span className="mt-1 block text-sm leading-7 text-slate-600">
                          {hypothesis.rationale}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Selected Interventions
                </p>
                <div className="mt-3 space-y-3">
                  {currentCase.interventionPreview.map((intervention) => (
                    <label key={intervention.title} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
                      <input
                        type="checkbox"
                        checked={reviewForm.selectedInterventions.includes(intervention.title)}
                        onChange={() => toggleArrayValue('selectedInterventions', intervention.title)}
                        className="mt-1 h-4 w-4 rounded border-slate-300"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">
                          {intervention.title}
                        </span>
                        <span className="mt-1 block text-sm leading-7 text-slate-600">
                          {intervention.rationale}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Review Notes
              </label>
              <textarea
                value={reviewForm.reviewNotes || ''}
                onChange={(event) =>
                  setReviewForm((current) => ({ ...current, reviewNotes: event.target.value }))
                }
                rows={6}
                placeholder="採択理由、修正点、却下理由、追加確認事項を記録"
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
              />

              {reviewError ? <p className="mt-4 text-sm text-rose-700">{reviewError}</p> : null}
              {reviewMessage ? <p className="mt-4 text-sm text-emerald-700">{reviewMessage}</p> : null}

              <button
                type="button"
                onClick={handleSaveReview}
                disabled={isSavingReview}
                className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSavingReview ? 'Saving Review...' : 'Save Review'}
              </button>
            </article>

            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Feedback Recorder
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  実施と結果をケースへ戻す
                </h2>
              </div>

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Intervention
              </label>
              <select
                value={feedbackForm.selectedInterventionTitle}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    selectedInterventionTitle: event.target.value,
                  }))
                }
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                {availableInterventionTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>

              <label className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={feedbackForm.implemented}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      implemented: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                実施された
              </label>

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Implementation Notes
              </label>
              <textarea
                value={feedbackForm.implementationNotes || ''}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    implementationNotes: event.target.value,
                  }))
                }
                rows={4}
                placeholder="誰が、どのように、どこまで実施したか"
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
              />

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Observed Effect
              </label>
              <textarea
                value={feedbackForm.observedEffect || ''}
                onChange={(event) =>
                  setFeedbackForm((current) => ({ ...current, observedEffect: event.target.value }))
                }
                rows={4}
                placeholder="改善した点、変化した連鎖、安定化した場面"
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
              />

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Unresolved Issues
              </label>
              <textarea
                value={feedbackForm.unresolvedIssues || ''}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    unresolvedIssues: event.target.value,
                  }))
                }
                rows={4}
                placeholder="残課題、副作用、新たに見えた問題"
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
              />

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Updated Structure Notes
              </label>
              <textarea
                value={feedbackForm.updatedStructureNotes || ''}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    updatedStructureNotes: event.target.value,
                  }))
                }
                rows={4}
                placeholder="見立て修正に関わるメモ"
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
              />

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Reviewer Summary
              </label>
              <textarea
                value={feedbackForm.reviewerSummary || ''}
                onChange={(event) =>
                  setFeedbackForm((current) => ({
                    ...current,
                    reviewerSummary: event.target.value,
                  }))
                }
                rows={4}
                placeholder="今回の実施結果の要約"
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
              />

              {feedbackError ? <p className="mt-4 text-sm text-rose-700">{feedbackError}</p> : null}
              {feedbackMessage ? (
                <p className="mt-4 text-sm text-emerald-700">{feedbackMessage}</p>
              ) : null}

              <button
                type="button"
                onClick={handleSaveFeedback}
                disabled={isSavingFeedback}
                className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSavingFeedback ? 'Saving Feedback...' : 'Save Feedback'}
              </button>

              <div className="mt-8 space-y-3">
                {currentCase.feedbackRecords.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                    まだ feedback は記録されていません。最初の実施結果をここから残せます。
                  </div>
                ) : (
                  currentCase.feedbackRecords.map((record) => (
                    <div key={record.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {record.selectedInterventionTitle}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            record.implemented
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {record.implemented ? 'implemented' : 'not implemented'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {new Date(record.recordedAt).toLocaleString('ja-JP')}
                      </p>
                      {record.observedEffect ? (
                        <p className="mt-3 text-sm leading-7 text-slate-700">
                          Effect: {record.observedEffect}
                        </p>
                      ) : null}
                      {record.unresolvedIssues ? (
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          Unresolved: {record.unresolvedIssues}
                        </p>
                      ) : null}
                      {record.updatedStructureNotes ? (
                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          Structure: {record.updatedStructureNotes}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
