import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildFchmaIntakeDraftPreview,
  type FchmaIntakeDraftPayload,
  type FchmaIntakeDraftPreview,
} from '@/lib/fchma/intakeDraft';
import { buildFchmaReasoningBundle } from '@/lib/fchma/orchestration';
import type { FchmaInterventionPreview } from '@/lib/fchma/interventionPreview';
import type { FchmaStructurePreview } from '@/lib/fchma/structuralPreview';

export type FchmaSurveyImportDatasetSummary = {
  datasetId: string;
  datasetLabel: string;
  version: string;
  batchKey: string;
  subjectCount: number;
  sampleSubjects: Array<{
    subjectKey: string;
    title: string;
    healthConditionHead: string;
    narrativeUnitCount: number;
  }>;
};

export type FchmaSurveyImportPayloadRecord = {
  datasetId: string;
  datasetLabel: string;
  subjectKey: string;
  payload: FchmaIntakeDraftPayload;
  summary: {
    healthConditionHead: string;
    difficultyLineCount: number;
    narrativeUnitCount: number;
  };
};

export type FchmaSurveyImportPreviewBundle = {
  payload: FchmaIntakeDraftPayload;
  intakePreview: FchmaIntakeDraftPreview;
  structurePreview: FchmaStructurePreview;
  interventionPreview: FchmaInterventionPreview[];
  summary: FchmaSurveyImportPayloadRecord['summary'];
  datasetLabel: string;
  subjectKey: string;
};

const respondentImportDatasets = [
  'employment_survey_3000',
  'nanbyo_survey_4000',
] as const;

function analysisReadyRoot(): string {
  return path.join(process.cwd(), 'data', 'analysis_ready', 'respondents');
}

function datasetIndexPath(datasetId: string): string {
  return path.join(
    analysisReadyRoot(),
    datasetId,
    'v0',
    'case_materialization',
    'case_materialization_index.json',
  );
}

function datasetPayloadPath(datasetId: string): string {
  return path.join(
    analysisReadyRoot(),
    datasetId,
    'v0',
    'case_materialization',
    'case_materialization_payloads.jsonl',
  );
}

export function buildSurveyImportPrimaryGoalFromSections(sections: {
  difficulty: string;
  supportAndAccommodation: string;
  workStatus: string;
  futureOutlook: string;
  datasetLabel: string;
}): string {
  const parts: string[] = [];
  if (sections.difficulty.trim()) parts.push('活動・参加上の困難の構造確認');
  if (sections.supportAndAccommodation.trim()) parts.push('必要な配慮・支援の再設計');
  if (sections.workStatus.trim()) parts.push('就労状況と負荷条件の再確認');
  if (sections.futureOutlook.trim()) parts.push('今後の希望と実行可能性の整理');
  return parts.length > 0 ? parts.join(' / ') : `${sections.datasetLabel}由来ケースの構造把握`;
}

export async function listFchmaSurveyImportDatasets(): Promise<FchmaSurveyImportDatasetSummary[]> {
  const results = await Promise.all(
    respondentImportDatasets.map(async (datasetId) => {
      try {
        const raw = await readFile(datasetIndexPath(datasetId), 'utf-8');
        return JSON.parse(raw) as FchmaSurveyImportDatasetSummary;
      } catch {
        return null;
      }
    }),
  );

  return results.filter((item): item is FchmaSurveyImportDatasetSummary => Boolean(item));
}

export async function getFchmaSurveyImportPayloadRecord(
  datasetId: string,
  subjectKey: string,
): Promise<FchmaSurveyImportPayloadRecord | null> {
  if (!respondentImportDatasets.includes(datasetId as (typeof respondentImportDatasets)[number])) {
    return null;
  }

  try {
    const raw = await readFile(datasetPayloadPath(datasetId), 'utf-8');
    const lines = raw.split('\n').filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line) as FchmaSurveyImportPayloadRecord;
      if (row.subjectKey === subjectKey) {
        return row;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function buildFchmaSurveyImportPreviewBundle(
  datasetId: string,
  subjectKey: string,
): Promise<FchmaSurveyImportPreviewBundle | null> {
  const record = await getFchmaSurveyImportPayloadRecord(datasetId, subjectKey);
  if (!record) {
    return null;
  }

  const reasoning = buildFchmaReasoningBundle(record.payload);
  return {
    payload: record.payload,
    intakePreview: buildFchmaIntakeDraftPreview(record.payload),
    structurePreview: reasoning.structurePreview,
    interventionPreview: reasoning.interventionPreview,
    summary: record.summary,
    datasetLabel: record.datasetLabel,
    subjectKey: record.subjectKey,
  };
}
