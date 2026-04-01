import { buildFchmaMinimalSignalPreview } from '@/lib/fchma/minimalIntake';
import { matchFchmaRespondentPatternsForPreview } from '@/lib/fchma/respondentPatternMatcher';

describe('fchma respondent pattern matcher', () => {
  it('matches manifold-derived respondent patterns to a minimal preview', async () => {
    const preview = buildFchmaMinimalSignalPreview(
      '午後の会議が続くと疲労で集中が切れる。勤務時間の調整はまだなく、上司への説明にも迷いがある。働き続けたいが不安がある。',
    );

    const matches = await matchFchmaRespondentPatternsForPreview(preview);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toEqual(
      expect.objectContaining({
        patternKey: expect.any(String),
        score: expect.any(Number),
        causalSummary: expect.any(String),
      }),
    );
  });
});
