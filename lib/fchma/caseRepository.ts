import {
  appendFchmaCaseFeedback,
  createFchmaCase,
  getFchmaCase,
  listFchmaCases,
  saveFchmaCaseReview,
  type AppendFchmaCaseFeedbackInput,
  type FchmaCaseRecord,
  type SaveFchmaCaseReviewInput,
} from '@/lib/fchma/caseStore';
import type { FchmaIntakeDraftPayload } from '@/lib/fchma/intakeDraft';

export type {
  AppendFchmaCaseFeedbackInput,
  FchmaCaseRecord,
  SaveFchmaCaseReviewInput,
} from '@/lib/fchma/caseStore';

export interface FchmaCaseRepository {
  kind: 'file_runtime_store' | 'postgresql';
  listCases: () => Promise<FchmaCaseRecord[]>;
  getCase: (caseId: string) => Promise<FchmaCaseRecord | null>;
  createCase: (input: FchmaIntakeDraftPayload) => Promise<FchmaCaseRecord>;
  saveReview: (
    caseId: string,
    input: SaveFchmaCaseReviewInput,
  ) => Promise<FchmaCaseRecord | null>;
  appendFeedback: (
    caseId: string,
    input: AppendFchmaCaseFeedbackInput,
  ) => Promise<FchmaCaseRecord | null>;
}

const fileRuntimeStoreRepository: FchmaCaseRepository = {
  kind: 'file_runtime_store',
  listCases: listFchmaCases,
  getCase: getFchmaCase,
  createCase: createFchmaCase,
  saveReview: saveFchmaCaseReview,
  appendFeedback: appendFchmaCaseFeedback,
};

export function getFchmaCaseRepository(): FchmaCaseRepository {
  return fileRuntimeStoreRepository;
}

export function listAvailableFchmaCaseRepositoryKinds(): FchmaCaseRepository['kind'][] {
  return ['file_runtime_store'];
}
