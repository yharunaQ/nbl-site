import {
  buildFchmaReasoningBundle,
  getDefaultFchmaReasoningProvider,
  listFchmaReasoningProviders,
} from '@/lib/fchma/orchestration';

describe('fchma orchestration', () => {
  it('exposes deterministic preview as the current default provider', () => {
    expect(listFchmaReasoningProviders()).toEqual(['deterministic_preview']);
    expect(getDefaultFchmaReasoningProvider().providerId).toBe('deterministic_preview');
  });

  it('builds a reasoning bundle with structure and intervention previews', () => {
    const bundle = buildFchmaReasoningBundle({
      title: 'bundle test',
      primaryGoal: '働き続ける',
      respondentProfile: '40代',
      healthCondition: '関節リウマチ',
      workStatus: '事務職',
      difficulty: '朝のこわばりで開始が遅れやすい',
      supportAndAccommodation: '勤務時間調整は未整備',
      disclosure: '上司には相談済み',
      futureOutlook: '継続したいが不安あり',
      narratives: '朝の始業時間に負荷が集中する',
      inputType: 'intake_form',
    });

    expect(bundle.providerId).toBe('deterministic_preview');
    expect(bundle.structurePreview.elements.length).toBeGreaterThan(0);
    expect(bundle.interventionPreview.length).toBeGreaterThan(0);
  });
});
