import { buildFchmaInterventionPreview } from '@/lib/fchma/interventionPreview';

describe('fchma intervention preview', () => {
  it('builds intervention candidates from the structure preview and supporter schema', () => {
    const preview = buildFchmaInterventionPreview({
      title: '通院と会議負荷',
      primaryGoal: '離職を避けたい',
      respondentProfile: '40代、都市圏',
      healthCondition: '全身性エリテマトーデス',
      workStatus: '正社員。会議の多い職場。',
      difficulty: '疲労が強く、午後の会議が続くと集中できない。',
      supportAndAccommodation: '通院配慮はあるが、勤務時間調整は未整備。',
      disclosure: '上司には説明済みだが、同僚には未説明。',
      futureOutlook: '働き続けたいが、悪化への不安がある。',
      narratives: '午後に痛みが強くなる。',
    });

    expect(preview.length).toBeGreaterThan(0);
    expect(preview.map((item) => item.interventionType)).toEqual(
      expect.arrayContaining(['work_design', 'accommodation']),
    );
    expect(preview.every((item) => item.supporterLens.length > 0)).toBe(true);
  });
});
