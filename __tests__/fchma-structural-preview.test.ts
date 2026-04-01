import { buildFchmaStructurePreview } from '@/lib/fchma/structuralPreview';

describe('fchma structural preview', () => {
  it('builds initial elements, relations, and hypotheses from intake text', () => {
    const preview = buildFchmaStructurePreview({
      title: '通院と会議負荷',
      primaryGoal: '離職を避けて継続したい',
      respondentProfile: '40代、都市圏、同居家族あり',
      healthCondition: '全身性エリテマトーデス、疲労',
      workStatus: '正社員。会議が多い企画職。',
      difficulty: '疲労が強く、午後の会議が続くと集中が切れる。',
      supportAndAccommodation: '通院配慮は一部あるが、勤務時間調整は未整備。',
      disclosure: '上司には一部説明したが、同僚には未説明。',
      futureOutlook: '働き続けたいが、悪化への不安がある。',
      narratives: '朝は比較的動ける。\n\n午後に痛みと疲労が強くなる。',
    });

    expect(preview.elements.map((element) => element.elementGroup)).toEqual(
      expect.arrayContaining([
        'health_condition',
        'activities',
        'participation',
        'environmental_factors',
        'personal_factors',
      ]),
    );

    expect(preview.relations.map((relation) => relation.relationType)).toEqual(
      expect.arrayContaining(['amplifies', 'inhibits']),
    );

    expect(preview.hypotheses.map((item) => item.label)).toEqual(
      expect.arrayContaining([
        'activity_participation_stability',
        'accommodation_gap_amplification',
      ]),
    );
  });
});
