import { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import PageSeo from '@/components/PageSeo';
import type { FchmaIntakeDraftPayload } from '@/lib/fchma/intakeDraft';
import type { FchmaInterventionPreview } from '@/lib/fchma/interventionPreview';
import type { FchmaStructurePreview } from '@/lib/fchma/structuralPreview';
import {
  listFchmaSurveyImportDatasets,
  type FchmaSurveyImportDatasetSummary,
} from '@/lib/fchma/surveyImportMaterialization';

type ImportPreviewResponse = {
  payload: FchmaIntakeDraftPayload;
  datasetLabel: string;
  subjectKey: string;
  summary: {
    healthConditionHead: string;
    difficultyLineCount: number;
    narrativeUnitCount: number;
  };
  structurePreview: FchmaStructurePreview;
  interventionPreview: FchmaInterventionPreview[];
};

type SurveyImportPageProps = {
  datasets: FchmaSurveyImportDatasetSummary[];
};

export const getServerSideProps: GetServerSideProps<SurveyImportPageProps> = async () => {
  return {
    props: {
      datasets: await listFchmaSurveyImportDatasets(),
    },
  };
};

export default function SurveyImportPage(props: SurveyImportPageProps) {
  const router = useRouter();
  const [datasetId, setDatasetId] = useState(props.datasets[0]?.datasetId ?? '');
  const [subjectKey, setSubjectKey] = useState('');
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDataset = props.datasets.find((item) => item.datasetId === datasetId) ?? null;

  async function handlePreview() {
    setIsLoading(true);
    setError(null);
    setPreview(null);

    try {
      const response = await fetch('/api/fchma/import-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId, subjectKey }),
      });
      const data = (await response.json()) as ImportPreviewResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Import preview failed');
      }
      setPreview(data);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!preview) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/fchma/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preview.payload),
      });

      const data = (await response.json()) as { caseRecord?: { id: string }; error?: string };
      if (!response.ok || !data.caseRecord) {
        throw new Error(data.error || 'Case save failed');
      }

      await router.push(`/cases/${data.caseRecord.id}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <PageSeo
        title="Survey Import Cases"
        description="Materialize respondent-side derived dataset subjects into the FCHMA case loop."
      />
      <main className="min-h-screen bg-[linear-gradient(180deg,_#f6fbff_0%,_#eef7f3_48%,_#fcfaf6_100%)] text-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:px-10">
          <section className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Survey Import
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              respondent-side derived subject を、そのまま `/cases` に入れる。
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              analysis-ready と projection から作った deterministic import pack を使って、
              secure original workbook を再読込せずに case loop を開始します。
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-7">
              <h2 className="text-2xl font-semibold text-slate-950">Import Source</h2>
              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Dataset
              </label>
              <select
                value={datasetId}
                onChange={(event) => setDatasetId(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              >
                {props.datasets.map((dataset) => (
                  <option key={dataset.datasetId} value={dataset.datasetId}>
                    {dataset.datasetLabel} ({dataset.subjectCount} subjects)
                  </option>
                ))}
              </select>

              <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Subject Key
              </label>
              <input
                value={subjectKey}
                onChange={(event) => setSubjectKey(event.target.value)}
                placeholder={selectedDataset?.sampleSubjects[0]?.subjectKey || 'subject key'}
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />

              {selectedDataset ? (
                <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Sample Subjects
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedDataset.sampleSubjects.slice(0, 10).map((sample) => (
                      <button
                        key={`${selectedDataset.datasetId}-${sample.subjectKey}`}
                        type="button"
                        onClick={() => setSubjectKey(sample.subjectKey)}
                        className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-500"
                      >
                        {sample.subjectKey}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!datasetId || !subjectKey || isLoading}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isLoading ? 'Building preview...' : 'Build Import Preview'}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!preview || isSaving}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                >
                  {isSaving ? 'Saving...' : 'Save As Case'}
                </button>
              </div>

              {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
            </article>

            <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-7">
              <h2 className="text-2xl font-semibold text-slate-950">Preview</h2>
              {!preview ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  dataset と subject key を選ぶと、survey_import payload と初期 reasoning preview をここで確認できます。
                </p>
              ) : (
                <div className="mt-5 space-y-5">
                  <div className="rounded-[1.5rem] bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Case Draft
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">
                      {preview.payload.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {preview.payload.primaryGoal}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                        {preview.datasetLabel}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        subject {preview.subjectKey}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        narratives {preview.summary.narrativeUnitCount}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Health / Work
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {preview.payload.healthCondition || 'No health condition lines'}
                      </p>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {preview.payload.workStatus || 'No work status lines'}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Difficulty / Support
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {preview.payload.difficulty || 'No difficulty lines'}
                      </p>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {preview.payload.supportAndAccommodation || 'No support lines'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      Initial Hypotheses
                    </p>
                    <div className="mt-4 space-y-3">
                      {preview.structurePreview.hypotheses.slice(0, 3).map((hypothesis) => (
                        <div key={hypothesis.label} className="rounded-2xl bg-white/10 p-4">
                          <p className="text-sm font-semibold text-white">{hypothesis.label}</p>
                          <p className="mt-2 text-sm leading-7 text-slate-200">
                            {hypothesis.rationale}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
