import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  buildFchmaIntakeDraftPreview,
  type FchmaIntakeDraftPayload,
  type FchmaIntakeDraftPreview,
} from '@/lib/fchma/intakeDraft';
import {
  type FchmaInterventionPreview,
} from '@/lib/fchma/interventionPreview';
import { buildFchmaReasoningBundle } from '@/lib/fchma/orchestration';
import {
  type FchmaStructurePreview,
} from '@/lib/fchma/structuralPreview';
import type { FchmaCaseStatus } from '@/lib/fchma/types';

const runtimeDir = path.join(process.cwd(), '.tmp', 'fchma-cases');
const runtimeStorePath = path.join(runtimeDir, 'cases.json');

type FchmaCaseStore = {
  cases: FchmaCaseRecord[];
};

export type FchmaCaseReviewDecision = 'pending' | 'accepted' | 'modified' | 'rejected';

export type FchmaCaseReview = {
  reviewerDecision: FchmaCaseReviewDecision;
  reviewNotes: string;
  selectedHypotheses: string[];
  selectedInterventions: string[];
  updatedAt: string | null;
};

export type FchmaFeedbackRecord = {
  id: string;
  selectedInterventionTitle: string;
  implemented: boolean;
  implementationNotes: string;
  observedEffect: string;
  unresolvedIssues: string;
  updatedStructureNotes: string;
  reviewerSummary: string;
  recordedAt: string;
};

export type FchmaCaseRecord = {
  id: string;
  caseCode: string;
  title: string;
  primaryGoal: string;
  status: FchmaCaseStatus;
  createdAt: string;
  updatedAt: string;
  intakePayload: FchmaIntakeDraftPayload;
  intakePreview: FchmaIntakeDraftPreview;
  structurePreview: FchmaStructurePreview;
  interventionPreview: FchmaInterventionPreview[];
  review: FchmaCaseReview;
  feedbackRecords: FchmaFeedbackRecord[];
};

export type SaveFchmaCaseReviewInput = {
  reviewerDecision: FchmaCaseReviewDecision;
  reviewNotes?: string;
  selectedHypotheses?: string[];
  selectedInterventions?: string[];
};

export type AppendFchmaCaseFeedbackInput = {
  selectedInterventionTitle: string;
  implemented: boolean;
  implementationNotes?: string;
  observedEffect?: string;
  unresolvedIssues?: string;
  updatedStructureNotes?: string;
  reviewerSummary?: string;
};

let writeQueue: Promise<unknown> = Promise.resolve();

function buildCaseCode(index: number): string {
  return `FCHMA-${String(index).padStart(5, '0')}`;
}

function defaultCaseReview(): FchmaCaseReview {
  return {
    reviewerDecision: 'pending',
    reviewNotes: '',
    selectedHypotheses: [],
    selectedInterventions: [],
    updatedAt: null,
  };
}

function normalizeStringList(input: unknown): string[] {
  return Array.isArray(input)
    ? input
        .map((item) => String(item || '').trim())
        .filter((item) => item.length > 0)
    : [];
}

function normalizeCaseStatus(input: unknown): FchmaCaseStatus {
  const value = String(input || '').trim();
  if (
    value === 'intake' ||
    value === 'analyzing' ||
    value === 'in_review' ||
    value === 'planned' ||
    value === 'in_followup' ||
    value === 'closed'
  ) {
    return value;
  }

  return 'intake';
}

function normalizeCaseReviewDecision(input: unknown): FchmaCaseReviewDecision {
  const value = String(input || '').trim();
  if (value === 'accepted' || value === 'modified' || value === 'rejected') {
    return value;
  }

  return 'pending';
}

function normalizeCaseReview(input: unknown): FchmaCaseReview {
  if (!input || typeof input !== 'object') {
    return defaultCaseReview();
  }

  const row = input as Record<string, unknown>;
  return {
    reviewerDecision: normalizeCaseReviewDecision(row.reviewerDecision),
    reviewNotes: String(row.reviewNotes || '').trim(),
    selectedHypotheses: normalizeStringList(row.selectedHypotheses),
    selectedInterventions: normalizeStringList(row.selectedInterventions),
    updatedAt: row.updatedAt ? String(row.updatedAt) : null,
  };
}

function normalizeFeedbackRecord(input: unknown): FchmaFeedbackRecord | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const row = input as Record<string, unknown>;
  const id = String(row.id || '').trim();
  const selectedInterventionTitle = String(row.selectedInterventionTitle || '').trim();
  const recordedAt = String(row.recordedAt || '').trim();

  if (!id || !selectedInterventionTitle || !recordedAt) {
    return null;
  }

  return {
    id,
    selectedInterventionTitle,
    implemented: Boolean(row.implemented),
    implementationNotes: String(row.implementationNotes || '').trim(),
    observedEffect: String(row.observedEffect || '').trim(),
    unresolvedIssues: String(row.unresolvedIssues || '').trim(),
    updatedStructureNotes: String(row.updatedStructureNotes || '').trim(),
    reviewerSummary: String(row.reviewerSummary || '').trim(),
    recordedAt,
  };
}

function deriveStatusFromReview(review: FchmaCaseReview): FchmaCaseStatus {
  if (review.reviewerDecision === 'pending') {
    return 'intake';
  }

  if (review.selectedInterventions.length > 0 && review.reviewerDecision !== 'rejected') {
    return 'planned';
  }

  return 'in_review';
}

function normalizeIntakePayload(input: unknown): FchmaIntakeDraftPayload | null {
  if (!input || typeof input !== 'object') return null;
  const row = input as Record<string, unknown>;
  const importContext =
    row.importContext && typeof row.importContext === 'object'
      ? (row.importContext as Record<string, unknown>)
      : null;
  const inputType = row.inputType === 'survey_import' ? 'survey_import' : 'intake_form';

  const payload: FchmaIntakeDraftPayload = {
    title: String(row.title || '').trim(),
    primaryGoal: String(row.primaryGoal || '').trim(),
    respondentProfile: String(row.respondentProfile || '').trim(),
    healthCondition: String(row.healthCondition || '').trim(),
    workStatus: String(row.workStatus || '').trim(),
    difficulty: String(row.difficulty || '').trim(),
    supportAndAccommodation: String(row.supportAndAccommodation || '').trim(),
    disclosure: String(row.disclosure || '').trim(),
    futureOutlook: String(row.futureOutlook || '').trim(),
    narratives: String(row.narratives || '').trim(),
    inputType,
    importContext:
      inputType === 'survey_import' &&
      importContext &&
      typeof importContext.datasetId === 'string' &&
      typeof importContext.subjectKey === 'string'
        ? {
            datasetId: String(importContext.datasetId).trim(),
            subjectKey: String(importContext.subjectKey).trim(),
            batchKey: importContext.batchKey ? String(importContext.batchKey).trim() : undefined,
            lane: 'respondents',
          }
        : undefined,
  };

  if (!payload.title && !payload.primaryGoal && !payload.narratives && !payload.difficulty) {
    return null;
  }

  return payload;
}

function buildReasoningFromPayload(payload: FchmaIntakeDraftPayload): {
  structurePreview: FchmaStructurePreview;
  interventionPreview: FchmaInterventionPreview[];
} {
  const bundle = buildFchmaReasoningBundle(payload);
  return {
    structurePreview: bundle.structurePreview,
    interventionPreview: bundle.interventionPreview,
  };
}

function normalizeCaseRecord(input: unknown): FchmaCaseRecord | null {
  if (!input || typeof input !== 'object') return null;
  const row = input as Record<string, unknown>;
  const id = String(row.id || '').trim();
  const caseCode = String(row.caseCode || '').trim();
  const title = String(row.title || '').trim();
  const primaryGoal = String(row.primaryGoal || '').trim();
  const status = normalizeCaseStatus(row.status);
  const createdAt = String(row.createdAt || '').trim();
  const updatedAt = String(row.updatedAt || '').trim();
  const intakePayload = normalizeIntakePayload(row.intakePayload);
  const review = normalizeCaseReview(row.review);
  const feedbackRecords = Array.isArray(row.feedbackRecords)
    ? row.feedbackRecords
        .map((item) => normalizeFeedbackRecord(item))
        .filter((item): item is FchmaFeedbackRecord => item !== null)
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    : [];

  if (
    !id ||
    !caseCode ||
    !title ||
    !createdAt ||
    !updatedAt ||
    !intakePayload
  ) {
    return null;
  }

  const reasoning = buildReasoningFromPayload(intakePayload);

  return {
    id,
    caseCode,
    title,
    primaryGoal,
    status,
    createdAt,
    updatedAt,
    intakePayload,
    intakePreview: buildFchmaIntakeDraftPreview(intakePayload),
    structurePreview: reasoning.structurePreview,
    interventionPreview: reasoning.interventionPreview,
    review,
    feedbackRecords,
  };
}

function normalizeStore(input: unknown): FchmaCaseStore {
  if (!input || typeof input !== 'object') {
    return { cases: [] };
  }

  const row = input as Record<string, unknown>;
  const cases = Array.isArray(row.cases)
    ? row.cases
        .map((item) => normalizeCaseRecord(item))
        .filter((item): item is FchmaCaseRecord => item !== null)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  return { cases };
}

async function ensureRuntimeStore(): Promise<void> {
  await mkdir(runtimeDir, { recursive: true });
  try {
    await readFile(runtimeStorePath, 'utf-8');
  } catch {
    await writeFile(runtimeStorePath, JSON.stringify({ cases: [] }, null, 2) + '\n', 'utf-8');
  }
}

async function readStore(): Promise<FchmaCaseStore> {
  await ensureRuntimeStore();
  const raw = await readFile(runtimeStorePath, 'utf-8');
  return normalizeStore(JSON.parse(raw));
}

async function persistStore(store: FchmaCaseStore): Promise<void> {
  const nextStore = {
    cases: store.cases.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };

  await writeFile(runtimeStorePath, JSON.stringify(nextStore, null, 2) + '\n', 'utf-8');
}

async function withStoreMutation<T>(
  mutator:
    | ((store: FchmaCaseStore) => Promise<{ store: FchmaCaseStore; result: T }>)
    | ((store: FchmaCaseStore) => { store: FchmaCaseStore; result: T }),
): Promise<T> {
  const run = writeQueue.then(async () => {
    const current = await readStore();
    const { store, result } = await mutator(current);
    await persistStore(store);
    return result;
  });

  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

function validatePayload(input: FchmaIntakeDraftPayload): FchmaIntakeDraftPayload {
  if (!input.title.trim()) {
    throw new Error('ケースタイトルを入力してください。');
  }
  if (!input.primaryGoal.trim()) {
    throw new Error('主な目標や主訴を入力してください。');
  }

  return {
    ...input,
    title: input.title.trim(),
    primaryGoal: input.primaryGoal.trim(),
    respondentProfile: input.respondentProfile.trim(),
    healthCondition: input.healthCondition.trim(),
    workStatus: input.workStatus.trim(),
    difficulty: input.difficulty.trim(),
    supportAndAccommodation: input.supportAndAccommodation.trim(),
    disclosure: input.disclosure.trim(),
    futureOutlook: input.futureOutlook.trim(),
    narratives: input.narratives.trim(),
    inputType: input.inputType === 'survey_import' ? 'survey_import' : 'intake_form',
    importContext:
      input.inputType === 'survey_import' && input.importContext
        ? {
            datasetId: input.importContext.datasetId.trim(),
            subjectKey: input.importContext.subjectKey.trim(),
            batchKey: input.importContext.batchKey?.trim() || undefined,
            lane: 'respondents',
          }
        : undefined,
  };
}

export async function listFchmaCases(): Promise<FchmaCaseRecord[]> {
  const store = await readStore();
  return store.cases;
}

export async function getFchmaCase(caseId: string): Promise<FchmaCaseRecord | null> {
  const store = await readStore();
  return store.cases.find((item) => item.id === caseId) ?? null;
}

export async function createFchmaCase(input: FchmaIntakeDraftPayload): Promise<FchmaCaseRecord> {
  const payload = validatePayload(input);
  const intakePreview = buildFchmaIntakeDraftPreview(payload);
  const reasoning = buildReasoningFromPayload(payload);
  const now = new Date().toISOString();

  return withStoreMutation(async (store) => {
    const record: FchmaCaseRecord = {
      id: randomUUID(),
      caseCode: buildCaseCode(store.cases.length + 1),
      title: intakePreview.caseDraft.title,
      primaryGoal: intakePreview.caseDraft.primaryGoal,
      status: 'intake',
      createdAt: now,
      updatedAt: now,
      intakePayload: payload,
      intakePreview,
      structurePreview: reasoning.structurePreview,
      interventionPreview: reasoning.interventionPreview,
      review: defaultCaseReview(),
      feedbackRecords: [],
    };

    return {
      store: {
        cases: [record, ...store.cases],
      },
      result: record,
    };
  });
}

function normalizeReviewInput(
  input: SaveFchmaCaseReviewInput,
  record: FchmaCaseRecord,
): FchmaCaseReview {
  const allowedHypotheses = new Set(record.structurePreview.hypotheses.map((item) => item.label));
  const allowedInterventions = new Set(record.interventionPreview.map((item) => item.title));

  return {
    reviewerDecision: normalizeCaseReviewDecision(input.reviewerDecision),
    reviewNotes: String(input.reviewNotes || '').trim(),
    selectedHypotheses: normalizeStringList(input.selectedHypotheses).filter((item) =>
      allowedHypotheses.has(item),
    ),
    selectedInterventions: normalizeStringList(input.selectedInterventions).filter((item) =>
      allowedInterventions.has(item),
    ),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeFeedbackInput(
  input: AppendFchmaCaseFeedbackInput,
  record: FchmaCaseRecord,
): Omit<FchmaFeedbackRecord, 'id' | 'recordedAt'> {
  const selectedInterventionTitle = String(input.selectedInterventionTitle || '').trim();
  const allowedInterventionTitles = new Set(record.interventionPreview.map((item) => item.title));

  if (!selectedInterventionTitle) {
    throw new Error('対象となる支援案を選択してください。');
  }

  if (!allowedInterventionTitles.has(selectedInterventionTitle)) {
    throw new Error('対象となる支援案がケースに存在しません。');
  }

  return {
    selectedInterventionTitle,
    implemented: Boolean(input.implemented),
    implementationNotes: String(input.implementationNotes || '').trim(),
    observedEffect: String(input.observedEffect || '').trim(),
    unresolvedIssues: String(input.unresolvedIssues || '').trim(),
    updatedStructureNotes: String(input.updatedStructureNotes || '').trim(),
    reviewerSummary: String(input.reviewerSummary || '').trim(),
  };
}

export async function saveFchmaCaseReview(
  caseId: string,
  input: SaveFchmaCaseReviewInput,
): Promise<FchmaCaseRecord | null> {
  return withStoreMutation((store) => {
    const target = store.cases.find((item) => item.id === caseId);
    if (!target) {
      return { store, result: null };
    }

    const review = normalizeReviewInput(input, target);
    const updatedRecord: FchmaCaseRecord = {
      ...target,
      status: deriveStatusFromReview(review),
      updatedAt: review.updatedAt || new Date().toISOString(),
      review,
    };

    return {
      store: {
        cases: store.cases.map((item) => (item.id === caseId ? updatedRecord : item)),
      },
      result: updatedRecord,
    };
  });
}

export async function appendFchmaCaseFeedback(
  caseId: string,
  input: AppendFchmaCaseFeedbackInput,
): Promise<FchmaCaseRecord | null> {
  return withStoreMutation((store) => {
    const target = store.cases.find((item) => item.id === caseId);
    if (!target) {
      return { store, result: null };
    }

    const normalized = normalizeFeedbackInput(input, target);
    const recordedAt = new Date().toISOString();
    const nextFeedbackRecord: FchmaFeedbackRecord = {
      id: randomUUID(),
      recordedAt,
      ...normalized,
    };

    const updatedRecord: FchmaCaseRecord = {
      ...target,
      status: 'in_followup',
      updatedAt: recordedAt,
      feedbackRecords: [nextFeedbackRecord, ...target.feedbackRecords],
    };

    return {
      store: {
        cases: store.cases.map((item) => (item.id === caseId ? updatedRecord : item)),
      },
      result: updatedRecord,
    };
  });
}
