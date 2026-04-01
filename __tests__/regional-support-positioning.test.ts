import {
  buildRegionalSupportPromptGuidance,
  buildRegionalSupportSuggestionReason,
  REGIONAL_SUPPORT_POSITIONING_DETAIL,
} from '@/lib/jac/regionalSupportPositioning';

describe('regional support positioning', () => {
  it('defines regional support as context for supporting individualized adjustment', () => {
    expect(REGIONAL_SUPPORT_POSITIONING_DETAIL).toContain('直接解決ではなく');
    expect(REGIONAL_SUPPORT_POSITIONING_DETAIL).toContain('個別調整');
    expect(REGIONAL_SUPPORT_POSITIONING_DETAIL).toContain('支える');
  });

  it('keeps prompt guidance anchored to person-job adjustment before regional support', () => {
    const guidance = buildRegionalSupportPromptGuidance();

    expect(guidance).toContain('本人と職場の関係');
    expect(guidance).toContain('直接解決手段ではなく');
    expect(guidance).toContain('個別調整');
  });

  it('frames support suggestions as support linkage for individualized adjustment', () => {
    expect(
      buildRegionalSupportSuggestionReason('就職活動の実施', '企業へのアプローチ（連携）'),
    ).toContain('個別調整を支える支援連携');
  });
});
