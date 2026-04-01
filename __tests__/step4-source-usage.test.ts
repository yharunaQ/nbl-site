import { buildStep4SourceUsageSummaries } from '@/lib/jac/step4SourceUsage';

describe('step4 source usage summary', () => {
  it('summarizes only actually displayed source contributions by role', () => {
    const summaries = buildStep4SourceUsageSummaries(
      {
        basisItems: [
          {
            id: 'basis-1',
            title: '勤務時間調整が有効な場合がある。',
            rankScore: 95,
            evidenceLaneLabel: '事例実践',
            confidenceLevel: 'high',
            confidenceScore: 0.88,
            riskLevel: 'low',
            sourceNames: ['AskJAN Website'],
            sourceUrls: ['https://askjan.example/basis'],
            linkedClaims: ['短時間勤務を試す'],
            conditions: [],
            missingContexts: [],
            sampleExcerpts: [],
          },
        ],
        supportCatalogItems: [],
        implementationKnowledgeItems: [
          {
            id: 'impl-1',
            accommodationTitle: '短時間勤務の調整',
            summary: '実施前後の確認に使う。',
            reason: null,
            examples: null,
            sections: [
              {
                usageFocus: 'dialogue',
                usageFocusLabel: '対話の軸',
                items: [
                  {
                    id: 'ref-canada',
                    title: '勤務時間調整の対話ガイド',
                    summary: '対話で確認する。',
                    sourceId: 'canada_duty_to_accommodate',
                    sourceName: 'Canada Duty to Accommodate Guidance',
                    sourceUrl: 'https://canada.example/dialogue',
                    category: 'practical_guidance',
                    categoryLabel: '実践ガイダンス',
                    usageFocus: 'dialogue',
                    usageFocusLabel: '対話の軸',
                    whyRelevant: '確認に使える。',
                    pageType: 'document',
                    evidenceScope: 'aggregated_index',
                  },
                ],
              },
            ],
          },
        ],
        practicalReferenceItems: [
          {
            id: 'practical-jobaccess',
            title: '勤務時間調整の試行例',
            summary: '試行候補。',
            sourceId: 'australia_jobaccess_guidance',
            sourceName: 'Australia JobAccess Employer Guidance',
            sourceUrl: 'https://jobaccess.example/trial',
            category: 'practical_guidance',
            categoryLabel: '実践ガイダンス',
            usageFocus: 'trial',
            usageFocusLabel: '試行候補',
            whyRelevant: '試行に使える。',
            pageType: 'document',
            evidenceScope: 'aggregated_index',
          },
        ],
        supplementalReferenceItems: [
          {
            id: 'supp-1',
            title: '勤務時間調整の補助資料',
            rankScore: 60,
            sourceNames: ['EARN Employer Guidance'],
            sourceUrls: ['https://earn.example/supplemental'],
            practiceStageLabel: '対話の軸',
            linkedClaims: [],
            sampleExcerpts: [],
          },
        ],
        hasContent: true,
        hasReferenceContent: true,
      },
      { includePracticalReferenceItems: false },
    );

    expect(summaries.map((item) => item.sourceName)).toEqual([
      'AskJAN Website',
      'Canada Duty to Accommodate Guidance',
      'EARN Employer Guidance',
    ]);
    expect(summaries[0].roles).toEqual(['根拠']);
    expect(summaries[1].usedParts).toEqual(['短時間勤務の調整: 勤務時間調整の対話ガイド']);
    expect(summaries.some((item) => item.sourceName.includes('JobAccess'))).toBe(false);
  });

  it('groups multiple pages from the same source family into one summary', () => {
    const summaries = buildStep4SourceUsageSummaries(
      {
        basisItems: [
          {
            id: 'basis-1',
            title: '勤務時間調整が有効な場合がある。',
            rankScore: 95,
            evidenceLaneLabel: '事例実践',
            confidenceLevel: 'high',
            confidenceScore: 0.88,
            riskLevel: 'low',
            sourceNames: ['AskJAN Website'],
            sourceUrls: ['https://askjan.example/basis'],
            linkedClaims: ['短時間勤務を試す'],
            conditions: [],
            missingContexts: [],
            sampleExcerpts: [],
          },
        ],
        supportCatalogItems: [],
        implementationKnowledgeItems: [
          {
            id: 'impl-1',
            accommodationTitle: '短時間勤務の調整',
            summary: '実施前後の確認に使う。',
            reason: null,
            examples: null,
            sections: [
              {
                usageFocus: 'trial',
                usageFocusLabel: '試行候補',
                items: [
                  {
                    id: 'ref-askjan',
                    title: '勤務時間調整の試行例',
                    summary: '試行候補。',
                    sourceId: 'askjan_website',
                    sourceName: 'AskJAN Website',
                    sourceUrl: 'https://askjan.example/trial',
                    category: 'case_example',
                    categoryLabel: '類似事例',
                    usageFocus: 'trial',
                    usageFocusLabel: '試行候補',
                    whyRelevant: '試行に使える。',
                    pageType: 'case_detail',
                    evidenceScope: 'specific_case',
                  },
                ],
              },
            ],
          },
        ],
        practicalReferenceItems: [],
        supplementalReferenceItems: [],
        hasContent: true,
        hasReferenceContent: true,
      },
      { includePracticalReferenceItems: false },
    );

    expect(summaries).toHaveLength(1);
    expect(summaries[0].sourceName).toBe('AskJAN Website');
    expect(summaries[0].roles).toEqual(expect.arrayContaining(['根拠', '試行候補']));
    expect(summaries[0].usedParts).toEqual(
      expect.arrayContaining([
        '勤務時間調整が有効な場合がある。',
        '短時間勤務の調整: 勤務時間調整の試行例',
      ]),
    );
  });
});
