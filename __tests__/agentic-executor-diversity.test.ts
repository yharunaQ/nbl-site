import { rebalanceEvidenceBySource, type EvidenceItem } from '@/lib/knowledge/agenticExecutor';

describe('rebalanceEvidenceBySource', () => {
  it('keeps JEED from dominating the final evidence pool', () => {
    const evidence: EvidenceItem[] = [
      ...Array.from({ length: 12 }, (_, index) => ({
        id: `jeed-${index + 1}`,
        sourceId: 'jeed_reference',
        filePath: `/tmp/jeed-${index + 1}.md`,
        excerpt: `jeed ${index + 1}`,
        score: 100 - index,
      })),
      ...Array.from({ length: 4 }, (_, index) => ({
        id: `askjan-${index + 1}`,
        sourceId: 'askjan_website',
        filePath: `/tmp/askjan-${index + 1}.md`,
        excerpt: `askjan ${index + 1}`,
        score: 70 - index,
      })),
      ...Array.from({ length: 4 }, (_, index) => ({
        id: `askearn-${index + 1}`,
        sourceId: 'askearn_employer_guidance',
        filePath: `/tmp/askearn-${index + 1}.md`,
        excerpt: `askearn ${index + 1}`,
        score: 66 - index,
      })),
      ...Array.from({ length: 4 }, (_, index) => ({
        id: `jobaccess-${index + 1}`,
        sourceId: 'australia_jobaccess_guidance',
        filePath: `/tmp/jobaccess-${index + 1}.md`,
        excerpt: `jobaccess ${index + 1}`,
        score: 62 - index,
      })),
    ];

    const selected = rebalanceEvidenceBySource(evidence, 16, {
      maxPerSource: 3,
      websiteQuota: 6,
      candidatePoolSize: 32,
    });

    const jeedCount = selected.filter((item) => item.sourceId === 'jeed_reference').length;
    const websiteCount = selected.filter((item) =>
      ['askjan_website', 'askearn_employer_guidance', 'australia_jobaccess_guidance'].includes(
        item.sourceId,
      ),
    ).length;

    expect(selected).toHaveLength(12);
    expect(jeedCount).toBeLessThanOrEqual(3);
    expect(websiteCount).toBeGreaterThanOrEqual(6);
  });

  it('expands the candidate pool to preserve multiple website source families for step4', () => {
    const evidence: EvidenceItem[] = [
      ...Array.from({ length: 70 }, (_, index) => ({
        id: `askjan-${index + 1}`,
        sourceId: 'askjan_website',
        filePath: `/tmp/askjan-${index + 1}.md`,
        excerpt: `askjan ${index + 1}`,
        score: 200 - index,
      })),
      ...Array.from({ length: 50 }, (_, index) => ({
        id: `jeed-${index + 1}`,
        sourceId: 'jeed_reference',
        filePath: `/tmp/jeed-${index + 1}.md`,
        excerpt: `jeed ${index + 1}`,
        score: 120 - index,
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        id: `askearn-${index + 1}`,
        sourceId: 'askearn_employer_guidance',
        filePath: `/tmp/askearn-${index + 1}.md`,
        excerpt: `askearn ${index + 1}`,
        score: 20 - index,
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        id: `jobaccess-${index + 1}`,
        sourceId: 'australia_jobaccess_guidance',
        filePath: `/tmp/jobaccess-${index + 1}.md`,
        excerpt: `jobaccess ${index + 1}`,
        score: 18 - index,
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        id: `canada-${index + 1}`,
        sourceId: 'canada_duty_to_accommodate',
        filePath: `/tmp/canada-${index + 1}.md`,
        excerpt: `canada ${index + 1}`,
        score: 16 - index,
      })),
    ];

    const selected = rebalanceEvidenceBySource(evidence, 12, {
      maxPerSource: 3,
      websiteQuota: 10,
      candidatePoolSize: 96,
      minDistinctSources: 5,
      minDistinctWebsiteSources: 4,
    });

    const distinctWebsiteSources = new Set(selected.map((item) => item.sourceId));

    expect(selected).toHaveLength(11);
    expect(distinctWebsiteSources.size).toBeGreaterThanOrEqual(4);
    expect(distinctWebsiteSources.has('askearn_employer_guidance')).toBe(true);
    expect(distinctWebsiteSources.has('australia_jobaccess_guidance')).toBe(true);
    expect(distinctWebsiteSources.has('canada_duty_to_accommodate')).toBe(true);
  });
});
