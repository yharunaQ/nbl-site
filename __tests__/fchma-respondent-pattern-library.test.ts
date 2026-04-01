import {
  getFchmaRespondentManifoldSummary,
  listFchmaRespondentManifoldPatterns,
} from '@/lib/fchma/respondentPatternLibrary';

describe('fchma respondent pattern library', () => {
  it('loads generated manifold summary', async () => {
    const summary = await getFchmaRespondentManifoldSummary();

    expect(summary).not.toBeNull();
    expect(summary?.subject_count).toBeGreaterThan(1000);
    expect(summary?.cluster_count).toBeGreaterThanOrEqual(3);
    expect(summary?.pattern_count).toBeGreaterThanOrEqual(26);
    expect(summary?.pattern_levels).toEqual(
      expect.arrayContaining(['global', 'local', 'micro']),
    );
  });

  it('loads manifold patterns with causal frameworks and narratives', async () => {
    const patterns = await listFchmaRespondentManifoldPatterns();

    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0]).toEqual(
      expect.objectContaining({
        pattern_key: expect.any(String),
        causal_framework: expect.objectContaining({
          summary: expect.any(String),
          chain: expect.any(Array),
        }),
        representative_narratives: expect.any(Array),
      }),
    );
  });
});
