import {
  buildFchmaMinimalIntakePayload,
  buildFchmaMinimalSignalPreview,
} from '@/lib/fchma/minimalIntake';

describe('fchma minimal intake', () => {
  it('infers a thin intake payload from a single consultation narrative', () => {
    const payload = buildFchmaMinimalIntakePayload(
      '全身性エリテマトーデスがあり、午後の会議が続くと疲労で集中が切れます。上司には一部相談したが、勤務時間の調整はまだありません。働き続けたいが不安があります。',
    );

    expect(payload.title).toContain('全身性エリテマトーデス');
    expect(payload.healthCondition).toContain('全身性エリテマトーデス');
    expect(payload.workStatus).toContain('会議');
    expect(payload.difficulty).toContain('疲労');
    expect(payload.supportAndAccommodation).toContain('調整');
  });

  it('builds a preview bundle with structure, interventions, and follow-up questions', () => {
    const preview = buildFchmaMinimalSignalPreview(
      '午後になると疲労が強く、会議の理解が落ちます。配慮はまだなく、上司にどう説明するか迷っています。働き続けたいです。',
    );

    expect(preview.intakePreview.caseDraft.status).toBe('intake');
    expect(preview.reasoningBundle.structurePreview.hypotheses.length).toBeGreaterThan(0);
    expect(preview.reasoningBundle.interventionPreview.length).toBeGreaterThan(0);
    expect(preview.followupQuestions.length).toBeGreaterThan(0);
  });
});
