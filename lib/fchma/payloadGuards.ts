import type { FchmaIntakeDraftPayload } from '@/lib/fchma/intakeDraft';

export function isFchmaIntakeDraftPayload(value: unknown): value is FchmaIntakeDraftPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const importContext = candidate.importContext;
  const hasValidImportContext =
    importContext === undefined ||
    (importContext !== null &&
      typeof importContext === 'object' &&
      typeof (importContext as Record<string, unknown>).datasetId === 'string' &&
      typeof (importContext as Record<string, unknown>).subjectKey === 'string' &&
      typeof (importContext as Record<string, unknown>).lane === 'string');

  return (
    typeof candidate.title === 'string' &&
    typeof candidate.primaryGoal === 'string' &&
    typeof candidate.respondentProfile === 'string' &&
    typeof candidate.healthCondition === 'string' &&
    typeof candidate.workStatus === 'string' &&
    typeof candidate.difficulty === 'string' &&
    typeof candidate.supportAndAccommodation === 'string' &&
    typeof candidate.disclosure === 'string' &&
    typeof candidate.futureOutlook === 'string' &&
    typeof candidate.narratives === 'string' &&
    hasValidImportContext
  );
}
