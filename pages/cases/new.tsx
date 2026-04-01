import { useState } from 'react';
import { useRouter } from 'next/router';
import PageSeo from '@/components/PageSeo';
import {
  buildFchmaIntakeDraftPreview,
  type FchmaIntakeDraftPayload,
  type FchmaIntakeDraftPreview,
  type FchmaIntakeStructuredFieldKey,
} from '@/lib/fchma/intakeDraft';
import { buildFchmaIntakeBlueprint } from '@/lib/fchma/intakeBlueprint';
import type { FchmaStructurePreview } from '@/lib/fchma/structuralPreview';
import type { FchmaInterventionPreview } from '@/lib/fchma/interventionPreview';

const intakeBlueprint = buildFchmaIntakeBlueprint();

const initialPayload: FchmaIntakeDraftPayload = {
  title: '',
  primaryGoal: '',
  respondentProfile: '',
  healthCondition: '',
  workStatus: '',
  difficulty: '',
  supportAndAccommodation: '',
  disclosure: '',
  futureOutlook: '',
  narratives: '',
};

const fieldBySectionId: Record<string, FchmaIntakeStructuredFieldKey> = {
  respondent_profile: 'respondentProfile',
  health_condition: 'healthCondition',
  work_status: 'workStatus',
  difficulty: 'difficulty',
  support_and_accommodation: 'supportAndAccommodation',
  disclosure: 'disclosure',
  future_outlook: 'futureOutlook',
  narratives: 'narratives',
};

export default function NewCasePage() {
  const router = useRouter();
  const [payload, setPayload] = useState<FchmaIntakeDraftPayload>(initialPayload);
  const [preview, setPreview] = useState<FchmaIntakeDraftPreview | null>(null);
  const [structurePreview, setStructurePreview] = useState<FchmaStructurePreview | null>(null);
  const [interventionPreview, setInterventionPreview] = useState<FchmaInterventionPreview[] | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuildingStructure, setIsBuildingStructure] = useState(false);
  const [isBuildingInterventions, setIsBuildingInterventions] = useState(false);
  const [isSavingCase, setIsSavingCase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePreview() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/fchma/intake-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Preview request failed');
      }

      const data = (await response.json()) as FchmaIntakeDraftPreview;
      setPreview(data);
      setStructurePreview(null);
      setInterventionPreview(null);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Unknown error');
      setPreview(null);
      setStructurePreview(null);
      setInterventionPreview(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStructurePreview() {
    setIsBuildingStructure(true);
    setError(null);

    try {
      const response = await fetch('/api/fchma/structure-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Structure preview request failed');
      }

      const data = (await response.json()) as FchmaStructurePreview;
      setStructurePreview(data);
      setInterventionPreview(null);
    } catch (structureError) {
      setError(structureError instanceof Error ? structureError.message : 'Unknown error');
      setStructurePreview(null);
      setInterventionPreview(null);
    } finally {
      setIsBuildingStructure(false);
    }
  }

  async function handleInterventionPreview() {
    setIsBuildingInterventions(true);
    setError(null);

    try {
      const response = await fetch('/api/fchma/intervention-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Intervention preview request failed');
      }

      const data = (await response.json()) as FchmaInterventionPreview[];
      setInterventionPreview(data);
    } catch (interventionError) {
      setError(interventionError instanceof Error ? interventionError.message : 'Unknown error');
      setInterventionPreview(null);
    } finally {
      setIsBuildingInterventions(false);
    }
  }

  async function handleSaveCase() {
    setIsSavingCase(true);
    setError(null);

    try {
      const response = await fetch('/api/fchma/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { caseRecord?: { id: string }; error?: string };
      if (!response.ok || !data.caseRecord) {
        throw new Error(data.error || 'Case save failed');
      }

      await router.push(`/cases/${data.caseRecord.id}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unknown error');
    } finally {
      setIsSavingCase(false);
    }
  }

  return (
    <>
      <PageSeo
        title="New FCHMA Case"
        description="Interactive intake preview for the FCHMA case-centered workflow."
      />
      <main className="min-h-screen bg-[linear-gradient(180deg,_#f5faf6_0%,_#edf4ff_48%,_#fcfaf6_100%)] text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
          <section className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              New Case Intake
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              まず intake を、structure に渡せる形へ整える。
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              この画面は respondent-side の canonical concept を土台に、入力内容を
              `case_input_fields`、`health_conditions`、`narrative_units`
              へどう落とすかを preview する最初の slice です。
            </p>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
                <label className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Case Title
                </label>
                <input
                  value={payload.title}
                  onChange={(event) => setPayload((current) => ({ ...current, title: event.target.value }))}
                  placeholder="例: 難病と通院配慮が重なるケース"
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                />

                <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Primary Goal
                </label>
                <textarea
                  value={payload.primaryGoal}
                  onChange={(event) =>
                    setPayload((current) => ({ ...current, primaryGoal: event.target.value }))
                  }
                  placeholder="例: 離職を避けながら通院と仕事の両立を再設計したい"
                  rows={3}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
                />
              </article>

              {intakeBlueprint.sections.map((section) => {
                const fieldKey = fieldBySectionId[section.id];
                if (!fieldKey) {
                  return null;
                }

                return (
                  <article
                    key={section.id}
                    className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                          {section.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.sourceDatasets.map((datasetId) => (
                          <span
                            key={datasetId}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {datasetId}
                          </span>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={payload[fieldKey]}
                      onChange={(event) =>
                        setPayload((current) => ({ ...current, [fieldKey]: event.target.value }))
                      }
                      rows={section.id === 'narratives' ? 8 : 5}
                      placeholder={`${section.title} に関する事実、状態、経過、支援状況を自由記述で入力`}
                      className="mt-5 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-900"
                    />

                    {section.suggestedFields.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {section.suggestedFields.slice(0, 8).map((field) => (
                          <span
                            key={`${section.id}-${field.datasetId}-${field.rawName}`}
                            className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
                          >
                            {field.displayName} · {field.responseType}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isSubmitting}
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? 'Building Preview...' : 'Preview Intake Draft'}
                </button>
                <button
                  type="button"
                  onClick={handleStructurePreview}
                  disabled={isBuildingStructure}
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  {isBuildingStructure ? 'Building Structure...' : 'Build Structure Preview'}
                </button>
                <button
                  type="button"
                  onClick={handleInterventionPreview}
                  disabled={isBuildingInterventions}
                  className="rounded-full border border-cyan-300 px-6 py-3 text-sm font-semibold text-cyan-900 transition hover:border-cyan-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  {isBuildingInterventions ? 'Building Plan...' : 'Build Intervention Preview'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCase}
                  disabled={isSavingCase}
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {isSavingCase ? 'Saving Case...' : 'Save Case Draft'}
                </button>
                {error ? <p className="text-sm text-rose-700">{error}</p> : null}
              </div>
            </div>

            <aside className="space-y-6">
              <article className="rounded-[1.75rem] border border-slate-200/80 bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Preview Target
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                  <li>`case_inputs` に raw intake を残す</li>
                  <li>`case_input_fields` に concept ごとの field preview を出す</li>
                  <li>`health_conditions` に病名候補を分離する</li>
                  <li>`narrative_units` に paragraph 単位で分割する</li>
                </ul>
              </article>

              <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6">
                <h2 className="text-lg font-semibold text-slate-950">Normalized Preview</h2>
                {!preview ? (
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Preview を実行すると、現在の intake が FCHMA の初期データ層にどう入るかをここに表示します。
                  </p>
                ) : (
                  <div className="mt-4 space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Case Draft
                      </p>
                      <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">title:</span>{' '}
                          {preview.caseDraft.title}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">goal:</span>{' '}
                          {preview.caseDraft.primaryGoal || '未入力'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Field Previews
                      </p>
                      <div className="mt-3 space-y-3">
                        {preview.fieldPreviews.map((field) => (
                          <div key={field.fieldKey} className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {field.fieldKey} <span className="text-slate-400">/</span>{' '}
                              {field.canonicalConcept}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-teal-700">
                              {field.responseType}
                            </p>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                              {field.rawValueText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Health Conditions
                        </p>
                        <div className="mt-3 space-y-2">
                          {preview.healthConditions.length === 0 ? (
                            <p className="text-sm text-slate-500">なし</p>
                          ) : (
                            preview.healthConditions.map((item) => (
                              <div
                                key={item.rawLabel}
                                className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                              >
                                <p className="font-medium text-slate-900">{item.rawLabel}</p>
                                {item.normalizationCandidates.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.normalizationCandidates.map((candidate) => (
                                      <span
                                        key={`${item.rawLabel}-${candidate.seedId}`}
                                        className="rounded-full border border-cyan-200 bg-white px-2 py-1 text-xs text-cyan-900"
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
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Narrative Units
                        </p>
                        <div className="mt-3 space-y-2">
                          {preview.narrativeUnits.length === 0 ? (
                            <p className="text-sm text-slate-500">なし</p>
                          ) : (
                            preview.narrativeUnits.slice(0, 12).map((unit) => (
                              <div
                                key={`${unit.sourceFieldKey}-${unit.sequenceNo}-${unit.rawText.slice(0, 24)}`}
                                className="rounded-xl border border-slate-200 px-3 py-2"
                              >
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  {unit.sourceFieldKey} #{unit.sequenceNo}
                                </p>
                                <p className="mt-1 text-sm leading-7 text-slate-700">{unit.rawText}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Structure Preview
                      </p>
                      {!structurePreview ? (
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          Structure preview を実行すると、health condition、activities、environmental
                          factors などの初期候補と relation が表示されます。
                        </p>
                      ) : (
                        <div className="mt-3 space-y-6">
                          <div className="grid gap-3">
                            {structurePreview.elements.map((element) => (
                              <div
                                key={element.id}
                                className="rounded-2xl border border-slate-200 px-4 py-3"
                              >
                                <p className="text-sm font-semibold text-slate-900">{element.label}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                                  {element.elementGroup} · {element.polarity}
                                </p>
                                <p className="mt-2 text-sm text-slate-600">
                                  source: {element.evidenceSource}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="grid gap-3">
                            {structurePreview.relations.map((relation) => (
                              <div
                                key={relation.id}
                                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                              >
                                <p className="font-semibold text-slate-900">
                                  {relation.sourceElementId} → {relation.targetElementId}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-teal-700">
                                  {relation.relationType}
                                </p>
                                <p className="mt-2 leading-7">{relation.rationale}</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid gap-3">
                            {structurePreview.hypotheses.map((hypothesis) => (
                              <div
                                key={hypothesis.label}
                                className="rounded-2xl border border-cyan-200 bg-cyan-50/60 px-4 py-4"
                              >
                                <p className="text-sm font-semibold text-slate-900">
                                  {hypothesis.label}
                                </p>
                                <p className="mt-2 text-sm leading-7 text-slate-700">
                                  {hypothesis.rationale}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {hypothesis.interventionPoints.map((point) => (
                                    <span
                                      key={point}
                                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                                    >
                                      {point}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Intervention Preview
                      </p>
                      {!interventionPreview ? (
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          supporter-side pattern を使った intervention preview を実行すると、実施主体、
                          feasibility、支援者側の着眼点まで含めた候補が表示されます。
                        </p>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {interventionPreview.map((item) => (
                            <div
                              key={item.title}
                              className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-4"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                  {item.interventionType}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                  owner: {item.ownerRole}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                  feasibility: {item.feasibility}
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
                                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                                  >
                                    {lens}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}
