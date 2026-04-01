import { buildFchmaIntakeBlueprint } from '@/lib/fchma/intakeBlueprint';
import { buildFchmaIntakeDraftPreview } from '@/lib/fchma/intakeDraft';

describe('fchma intake blueprint', () => {
  it('builds the canonical intake sections from respondent concepts', () => {
    const blueprint = buildFchmaIntakeBlueprint();

    expect(blueprint.sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        'respondent_profile',
        'health_condition',
        'work_status',
        'difficulty',
        'support_and_accommodation',
        'disclosure',
        'future_outlook',
        'narratives',
      ]),
    );
  });

  it('includes dataset-aware suggested fields', () => {
    const blueprint = buildFchmaIntakeBlueprint();
    const healthSection = blueprint.sections.find((section) => section.id === 'health_condition');

    expect(healthSection?.suggestedFields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ datasetId: 'employment_survey_3000', rawName: '分類名' }),
        expect.objectContaining({ datasetId: 'nanbyo_survey_4000', rawName: 'Q05_1' }),
      ]),
    );
  });
});

describe('fchma intake draft preview', () => {
  it('turns free-form intake into field, condition, and narrative previews', () => {
    const preview = buildFchmaIntakeDraftPreview({
      title: '通院と勤務継続',
      primaryGoal: '離職を避けたい',
      respondentProfile: '40代、都市圏、同居家族あり',
      healthCondition: '全身性エリテマトーデス、うつ症状',
      workStatus: '正社員。対人調整が多い事務職。',
      difficulty: '疲労が強く、会議が続くと集中が切れる。',
      supportAndAccommodation: '通院配慮は一部あるが、勤務時間調整は未整備。',
      disclosure: '上司には一部説明したが、同僚には未説明。',
      futureOutlook: '働き続けたいが、悪化への不安がある。',
      narratives: '朝は比較的動ける。\n\n午後に痛みと疲労が強くなる。',
    });

    expect(preview.caseDraft.status).toBe('intake');
    expect(preview.fieldPreviews.map((field) => field.canonicalConcept)).toEqual(
      expect.arrayContaining([
        'health_condition',
        'activity_and_participation_difficulty',
        'narrative_units',
      ]),
    );
    expect(preview.healthConditions.map((item) => item.rawLabel)).toEqual([
      '全身性エリテマトーデス',
      'うつ症状',
    ]);
    expect(preview.healthConditions[0].normalizationCandidates[0]).toEqual(
      expect.objectContaining({
        preferredLabelSeed: '全身性エリテマトーデス',
        normalizationScope: 'icd_candidate',
      }),
    );
    expect(preview.narrativeUnits.length).toBeGreaterThanOrEqual(7);
  });
});
