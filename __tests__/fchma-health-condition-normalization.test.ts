import { getHealthConditionNormalizationCandidates } from '@/lib/fchma/healthConditionNormalization';

describe('health condition normalization seeds', () => {
  it('returns ICD-oriented candidates for known disease labels', () => {
    const candidates = getHealthConditionNormalizationCandidates('全身性エリテマトーデス');

    expect(candidates[0]).toEqual(
      expect.objectContaining({
        preferredLabelSeed: '全身性エリテマトーデス',
        normalizationScope: 'icd_candidate',
        matchType: 'exact',
      }),
    );
  });

  it('keeps broad disability groups separate from ICD candidates', () => {
    const candidates = getHealthConditionNormalizationCandidates('難病、慢性疾患');

    expect(candidates[0]).toEqual(
      expect.objectContaining({
        preferredLabelSeed: '難病、慢性疾患',
        normalizationScope: 'non_icd_group',
      }),
    );
  });

  it('returns no candidate when the raw label is not in the seed dictionary', () => {
    expect(getHealthConditionNormalizationCandidates('午前にしんどい')).toEqual([]);
  });
});
