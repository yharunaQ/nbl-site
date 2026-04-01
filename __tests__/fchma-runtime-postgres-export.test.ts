import { buildFchmaRuntimePostgresExportBundle } from '@/lib/fchma/runtimePostgresExport';
import type { FchmaCaseRecord } from '@/lib/fchma/caseStore';

function buildCase(overrides: Partial<FchmaCaseRecord>): FchmaCaseRecord {
  return {
    id: '11111111-1111-4111-a111-111111111111',
    caseCode: 'FCHMA-00001',
    title: 'Runtime export case',
    primaryGoal: 'goal',
    status: 'in_followup',
    createdAt: '2026-03-31T00:00:00.000Z',
    updatedAt: '2026-03-31T01:00:00.000Z',
    intakePayload: {
      title: 'Runtime export case',
      primaryGoal: 'goal',
      respondentProfile: '30代、就業中',
      healthCondition: '全身性エリテマトーデス',
      workStatus: '事務職',
      difficulty: '午後の疲労',
      supportAndAccommodation: '時差出勤が必要',
      disclosure: '上司に説明済み',
      futureOutlook: '継続したい',
      narratives: '午後に疲労が強まる',
      inputType: 'survey_import',
      importContext: {
        datasetId: 'nanbyo_survey_4000',
        subjectKey: '1001',
        batchKey: 'respondents:nanbyo_survey_4000:v0',
        lane: 'respondents',
      },
    },
    intakePreview: {
      caseDraft: {
        title: 'Runtime export case',
        primaryGoal: 'goal',
        status: 'intake',
      },
      caseInputDraft: {
        inputType: 'survey_import',
        sourceLabel: 'survey_import:nanbyo_survey_4000:1001',
      },
      fieldPreviews: [
        {
          fieldKey: 'healthCondition',
          canonicalConcept: 'health_condition',
          responseType: 'free_text',
          rawValueText: '全身性エリテマトーデス',
        },
      ],
      healthConditions: [
        {
          rawLabel: '全身性エリテマトーデス',
          sourceType: 'survey_import',
          normalizationCandidates: [
            {
              seedId: 'seed-sle',
              preferredLabelSeed: '全身性エリテマトーデス',
              matchedAlias: '全身性エリテマトーデス',
              matchType: 'exact',
              labelKind: 'disease_label',
              normalizationScope: 'icd_candidate',
              icdLookupPriority: 'high',
              sourceDatasetIds: ['nanbyo_survey_4000'],
              sourceFields: ['xQ1'],
              reviewRequired: true,
            },
          ],
        },
      ],
      narrativeUnits: [
        {
          sourceFieldKey: 'difficulty',
          sequenceNo: 1,
          rawText: '午後に疲労が強まる',
        },
      ],
    },
    structurePreview: {
      elements: [],
      relations: [],
      hypotheses: [
        {
          label: 'accommodation_gap_amplification',
          rationale: '配慮不足',
          interventionPoints: ['必要配慮の言語化'],
        },
      ],
    },
    interventionPreview: [
      {
        title: '必要配慮の言語化と職場内調整',
        interventionType: 'accommodation',
        ownerRole: 'manager_or_hr',
        feasibility: 'high',
        rationale: '配慮調整',
        implementationNotes: ['上司と調整'],
        supporterLens: [],
      },
    ],
    review: {
      reviewerDecision: 'accepted',
      reviewNotes: 'accepted',
      selectedHypotheses: ['accommodation_gap_amplification'],
      selectedInterventions: ['必要配慮の言語化と職場内調整'],
      updatedAt: '2026-03-31T00:30:00.000Z',
    },
    feedbackRecords: [
      {
        id: '22222222-2222-4222-a222-222222222222',
        selectedInterventionTitle: '必要配慮の言語化と職場内調整',
        implemented: true,
        implementationNotes: '実施',
        observedEffect: '改善した',
        unresolvedIssues: '午後の疲労が残る',
        updatedStructureNotes: '午後の負荷を再確認',
        reviewerSummary: 'partial',
        recordedAt: '2026-03-31T02:00:00.000Z',
      },
    ],
    ...overrides,
  };
}

describe('fchma runtime postgres export', () => {
  it('maps runtime cases into core SQL table-shaped rows', () => {
    const bundle = buildFchmaRuntimePostgresExportBundle([buildCase({})]);

    expect(bundle.contractVersion).toBe('v0');
    expect(bundle.summary.cases).toBe(1);
    expect(bundle.summary.case_inputs).toBe(1);
    expect(bundle.summary.case_input_fields).toBe(1);
    expect(bundle.summary.narrative_units).toBe(1);
    expect(bundle.summary.health_conditions).toBe(1);
    expect(bundle.summary.structural_hypotheses).toBe(1);
    expect(bundle.summary.intervention_hypotheses).toBe(1);
    expect(bundle.summary.feedback_records).toBe(1);
    expect(bundle.summary.outcome_measures).toBe(3);
    expect(bundle.tables.cases[0].source_dataset_id).toBe('nanbyo_survey_4000');
    expect(bundle.tables.intervention_hypotheses[0].selected_status).toBe('selected');
    expect(bundle.tables.structural_hypotheses[0].reviewer_decision).toBe('accepted');
  });
});
