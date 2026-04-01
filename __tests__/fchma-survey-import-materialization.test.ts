import { buildSurveyImportPrimaryGoalFromSections } from '@/lib/fchma/surveyImportMaterialization';

describe('fchma survey import materialization', () => {
  it('builds a goal from populated sections in product order', () => {
    expect(
      buildSurveyImportPrimaryGoalFromSections({
        difficulty: '仕事内容に負荷がある',
        supportAndAccommodation: '必要な配慮が未整備',
        workStatus: '就業中',
        futureOutlook: '',
        datasetLabel: '難病患者調査',
      }),
    ).toBe('活動・参加上の困難の構造確認 / 必要な配慮・支援の再設計 / 就労状況と負荷条件の再確認');
  });

  it('falls back to a dataset-level goal when sections are empty', () => {
    expect(
      buildSurveyImportPrimaryGoalFromSections({
        difficulty: '',
        supportAndAccommodation: '',
        workStatus: '',
        futureOutlook: '',
        datasetLabel: '障害・疾病 就労調査',
      }),
    ).toBe('障害・疾病 就労調査由来ケースの構造把握');
  });
});
