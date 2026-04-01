import type { FchmaCaseInputType, FchmaResponseType } from '@/lib/fchma/types';
import {
  getHealthConditionNormalizationCandidates,
  type FchmaHealthConditionNormalizationCandidate,
} from '@/lib/fchma/healthConditionNormalization';

export type FchmaIntakeDraftPayload = {
  title: string;
  primaryGoal: string;
  respondentProfile: string;
  healthCondition: string;
  workStatus: string;
  difficulty: string;
  supportAndAccommodation: string;
  disclosure: string;
  futureOutlook: string;
  narratives: string;
  inputType?: FchmaCaseInputType;
  importContext?: {
    datasetId: string;
    subjectKey: string;
    batchKey?: string;
    lane: 'respondents';
  };
};

export type FchmaIntakeStructuredFieldKey =
  | 'respondentProfile'
  | 'healthCondition'
  | 'workStatus'
  | 'difficulty'
  | 'supportAndAccommodation'
  | 'disclosure'
  | 'futureOutlook'
  | 'narratives';

export type FchmaDraftFieldPreview = {
  fieldKey: string;
  canonicalConcept: string;
  responseType: FchmaResponseType;
  rawValueText: string;
};

export type FchmaNarrativeUnitPreview = {
  sourceFieldKey: string;
  sequenceNo: number;
  rawText: string;
};

export type FchmaHealthConditionPreview = {
  rawLabel: string;
  sourceType: 'user_input' | 'survey_import';
  normalizationCandidates: FchmaHealthConditionNormalizationCandidate[];
};

export type FchmaIntakeDraftPreview = {
  caseDraft: {
    title: string;
    primaryGoal: string;
    status: 'intake';
  };
  caseInputDraft: {
    inputType: FchmaCaseInputType;
    sourceLabel: string;
  };
  fieldPreviews: FchmaDraftFieldPreview[];
  healthConditions: FchmaHealthConditionPreview[];
  narrativeUnits: FchmaNarrativeUnitPreview[];
};

const intakeFieldConfig: Array<{
  fieldKey: FchmaIntakeStructuredFieldKey;
  canonicalConcept: string;
  responseType: FchmaResponseType;
}> = [
  {
    fieldKey: 'respondentProfile',
    canonicalConcept: 'respondent_profile',
    responseType: 'free_text',
  },
  {
    fieldKey: 'healthCondition',
    canonicalConcept: 'health_condition',
    responseType: 'free_text',
  },
  {
    fieldKey: 'workStatus',
    canonicalConcept: 'work_status',
    responseType: 'free_text',
  },
  {
    fieldKey: 'difficulty',
    canonicalConcept: 'activity_and_participation_difficulty',
    responseType: 'free_text',
  },
  {
    fieldKey: 'supportAndAccommodation',
    canonicalConcept: 'accommodation_and_support',
    responseType: 'free_text',
  },
  {
    fieldKey: 'disclosure',
    canonicalConcept: 'disclosure_and_explanation',
    responseType: 'free_text',
  },
  {
    fieldKey: 'futureOutlook',
    canonicalConcept: 'self_efficacy_and_future_outlook',
    responseType: 'free_text',
  },
  {
    fieldKey: 'narratives',
    canonicalConcept: 'narrative_units',
    responseType: 'free_text',
  },
];

function splitNarrativeUnits(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .flatMap((chunk) =>
      chunk
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    );
}

function splitHealthConditions(text: string): string[] {
  return text
    .split(/[、,;\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function buildFchmaIntakeDraftPreview(
  payload: FchmaIntakeDraftPayload,
): FchmaIntakeDraftPreview {
  const fieldPreviews = intakeFieldConfig
    .map<FchmaDraftFieldPreview | null>((config) => {
      const rawValueText = payload[config.fieldKey]?.trim();
      if (!rawValueText) {
        return null;
      }

      return {
        fieldKey: config.fieldKey,
        canonicalConcept: config.canonicalConcept,
        responseType: config.responseType,
        rawValueText,
      };
    })
    .filter((item): item is FchmaDraftFieldPreview => Boolean(item));

  const narrativeSources = [
    { sourceFieldKey: 'healthCondition', text: payload.healthCondition },
    { sourceFieldKey: 'workStatus', text: payload.workStatus },
    { sourceFieldKey: 'difficulty', text: payload.difficulty },
    { sourceFieldKey: 'supportAndAccommodation', text: payload.supportAndAccommodation },
    { sourceFieldKey: 'disclosure', text: payload.disclosure },
    { sourceFieldKey: 'futureOutlook', text: payload.futureOutlook },
    { sourceFieldKey: 'narratives', text: payload.narratives },
  ];

  const narrativeUnits = narrativeSources.flatMap<FchmaNarrativeUnitPreview>((source) =>
    splitNarrativeUnits(source.text).map((rawText, index) => ({
      sourceFieldKey: source.sourceFieldKey,
      sequenceNo: index + 1,
      rawText,
    })),
  );

  const healthConditionSourceType: FchmaHealthConditionPreview['sourceType'] =
    payload.inputType === 'survey_import' ? 'survey_import' : 'user_input';

  const healthConditions = splitHealthConditions(payload.healthCondition).map((rawLabel) => ({
    rawLabel,
    sourceType: healthConditionSourceType,
    normalizationCandidates: getHealthConditionNormalizationCandidates(rawLabel),
  }));

  const sourceLabel =
    payload.inputType === 'survey_import' && payload.importContext
      ? `survey_import:${payload.importContext.datasetId}:${payload.importContext.subjectKey}`
      : 'manual_case_intake';

  return {
    caseDraft: {
      title: payload.title.trim() || 'Untitled case',
      primaryGoal: payload.primaryGoal.trim(),
      status: 'intake',
    },
    caseInputDraft: {
      inputType: payload.inputType ?? 'intake_form',
      sourceLabel,
    },
    fieldPreviews,
    healthConditions,
    narrativeUnits,
  };
}
