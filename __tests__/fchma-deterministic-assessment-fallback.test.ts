import type { FchmaAiAssessment, FchmaFullAssessment } from '@/lib/fchma/aiAssessmentOrchestration';
import { withDeterministicFchmaAssessmentFallback } from '@/lib/fchma/deterministicAssessmentFallback';

function buildBaseAssessment(overrides: Partial<FchmaFullAssessment> = {}): FchmaFullAssessment {
  return {
    consultation: '朝の体調変動で始業直後の会議参加が難しく、在宅勤務と休憩調整を相談したい。',
    extractedSignals: {
      healthConditions: [],
      workContext: ['朝の体調変動で始業直後の会議参加が難しく、在宅勤務と休憩調整を相談したい。'],
      difficultyContext: ['朝の体調変動で始業直後の会議参加が難しく、在宅勤務と休憩調整を相談したい。'],
      supportContext: ['朝の体調変動で始業直後の会議参加が難しく、在宅勤務と休憩調整を相談したい。'],
      disclosureContext: ['朝の体調変動で始業直後の会議参加が難しく、在宅勤務と休憩調整を相談したい。'],
      futureContext: [],
    },
    deterministicFollowupQuestions: [
      '体調変動や診断名として共有してよい範囲はどこまでありますか。',
      '上司、人事、支援者など、誰に何をどこまで伝えられているかを確認したいです。',
    ],
    matchedPatterns: [
      {
        patternKey: 'local_pattern_001',
        score: 6,
        matchedKeywordGroups: ['time_schedule', 'support'],
        matchedHealthConditions: [],
        causalSummary: '体調変動と時間帯負荷が参加の不安定さを強める。',
        causalAmplifiers: ['始業直後の会議負荷'],
        interventionPorts: ['時間設計の変更', '休憩余地の確保'],
        rationale: 'keyword overlap: time_schedule, support',
        clusterSubjectCount: 12,
        topLabels: { activities: ['会議参加'], participation: ['就労継続'] },
        representativeNarratives: [],
        highLiftRows: [],
      },
    ],
    aiAssessment: null,
    aiError: 'OPENAI_API_KEY が設定されていません。',
    modelId: null,
    promptVersion: 'fchma_assessment_v0',
    providerId: 'deterministic_only',
    generatedAt: '2026-04-07T00:00:00.000Z',
    ...overrides,
  };
}

describe('fchma deterministic assessment fallback', () => {
  it('replaces provider errors with a deterministic user-facing assessment', () => {
    const assessment = withDeterministicFchmaAssessmentFallback(buildBaseAssessment());

    expect(assessment.aiError).toBeNull();
    expect(assessment.providerId).toBe('deterministic_only');
    expect(assessment.aiAssessment).not.toBeNull();
    expect(assessment.aiAssessment?.frameworkSummary).toContain('暫定見立て');
    expect(assessment.aiAssessment?.structuralHypotheses.length).toBeGreaterThan(0);
    expect(assessment.aiAssessment?.interventionPlan.length).toBeGreaterThan(0);
    expect(assessment.aiAssessment?.structuredFollowupQuestions[0]?.suggestedOptions).toEqual([
      '日内変動がある',
      '週単位で波がある',
      '作業後に悪化する',
    ]);
  });

  it('keeps model-backed assessments untouched', () => {
    const existing: FchmaAiAssessment = {
      primaryDomainId: 'task_demand_mismatch',
      primaryDomainLabel: '仕事要求ミスマッチ',
      primaryMotifId: 'mismatch',
      primaryMotifLabel: 'ミスマッチ',
      frameworkSummary: 'model generated',
      structuralHypotheses: [],
      interventionPlan: [],
      followupQuestions: [],
      structuredFollowupQuestions: [],
      referenceItems: [],
    };

    const input = buildBaseAssessment({
      aiAssessment: existing,
      aiError: null,
      providerId: 'openai_fchma',
    });

    expect(withDeterministicFchmaAssessmentFallback(input)).toBe(input);
  });
});
