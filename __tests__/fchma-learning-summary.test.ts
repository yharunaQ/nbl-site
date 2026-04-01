import { buildFchmaLearningSummary } from '@/lib/fchma/learningSummary';
import type { FchmaCaseRecord } from '@/lib/fchma/caseRepository';

function buildCaseRecord(overrides: Partial<FchmaCaseRecord>): FchmaCaseRecord {
  const base: FchmaCaseRecord = {
    id: 'case-1',
    caseCode: 'FCHMA-00001',
    title: 'case',
    primaryGoal: 'goal',
    status: 'planned',
    createdAt: '2026-03-31T00:00:00.000Z',
    updatedAt: '2026-03-31T00:00:00.000Z',
    intakePayload: {
      title: 'case',
      primaryGoal: 'goal',
      respondentProfile: 'profile',
      healthCondition: 'condition',
      workStatus: 'work',
      difficulty: 'difficulty',
      supportAndAccommodation: 'support',
      disclosure: 'disclosure',
      futureOutlook: 'future',
      narratives: 'narrative',
      inputType: 'intake_form',
    },
    intakePreview: {
      caseDraft: { title: 'case', primaryGoal: 'goal', status: 'intake' },
      caseInputDraft: { inputType: 'intake_form', sourceLabel: 'manual_case_intake' },
      fieldPreviews: [],
      healthConditions: [],
      narrativeUnits: [],
    },
    structurePreview: {
      elements: [],
      relations: [],
      hypotheses: [],
    },
    interventionPreview: [
      {
        title: '必要配慮の言語化と職場内調整',
        interventionType: 'accommodation',
        ownerRole: 'manager_or_hr',
        feasibility: 'high',
        rationale: 'rationale',
        implementationNotes: [],
        supporterLens: [],
      },
    ],
    review: {
      reviewerDecision: 'accepted',
      reviewNotes: 'notes',
      selectedHypotheses: ['accommodation_gap_amplification'],
      selectedInterventions: ['必要配慮の言語化と職場内調整'],
      updatedAt: '2026-03-31T00:00:00.000Z',
    },
    feedbackRecords: [],
  };

  return {
    ...base,
    ...overrides,
  };
}

describe('fchma learning summary', () => {
  it('aggregates source counts, hypotheses, and intervention outcomes', () => {
    const manualCase = buildCaseRecord({
      id: 'case-1',
      feedbackRecords: [
        {
          id: 'feedback-1',
          selectedInterventionTitle: '必要配慮の言語化と職場内調整',
          implemented: true,
          implementationNotes: '実施',
          observedEffect: '改善した',
          unresolvedIssues: '午後の負荷は残る',
          updatedStructureNotes: '午後の業務密度を再確認したい',
          reviewerSummary: 'partial',
          recordedAt: '2026-03-31T01:00:00.000Z',
        },
      ],
      status: 'in_followup',
    });

    const surveyCase = buildCaseRecord({
      id: 'case-2',
      caseCode: 'FCHMA-00002',
      intakePayload: {
        ...buildCaseRecord({}).intakePayload,
        inputType: 'survey_import',
        importContext: {
          datasetId: 'nanbyo_survey_4000',
          subjectKey: '1001',
          batchKey: 'respondents:nanbyo_survey_4000:v0',
          lane: 'respondents',
        },
      },
      feedbackRecords: [],
      review: {
        reviewerDecision: 'accepted',
        reviewNotes: 'selected',
        selectedHypotheses: ['accommodation_gap_amplification'],
        selectedInterventions: ['必要配慮の言語化と職場内調整'],
        updatedAt: '2026-03-31T00:00:00.000Z',
      },
    });

    const summary = buildFchmaLearningSummary([manualCase, surveyCase]);

    expect(summary.totalCases).toBe(2);
    expect(summary.feedbackCases).toBe(1);
    expect(summary.needsFollowupCount).toBe(1);
    expect(summary.sourceCounts).toEqual(
      expect.arrayContaining([
        { label: 'manual_intake', count: 1 },
        { label: 'survey_import', count: 1 },
      ]),
    );
    expect(summary.datasetCounts).toEqual(
      expect.arrayContaining([{ label: 'nanbyo_survey_4000', count: 1 }]),
    );
    expect(summary.topHypotheses[0]).toEqual({
      label: 'accommodation_gap_amplification',
      count: 2,
    });
    expect(summary.topInterventions[0].partiallyImprovedCount).toBe(1);
    expect(summary.updatedStructureSignals).toEqual(
      expect.arrayContaining([{ label: '午後', count: 1 }]),
    );
  });
});
