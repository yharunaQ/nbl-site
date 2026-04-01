import { buildStep4HolisticJudgment } from '@/lib/jac/step4HolisticJudgment';

describe('step4 holistic judgment', () => {
  it('explains the assessment as a synthesis instead of a single decisive basis card', () => {
    const judgment = buildStep4HolisticJudgment({
      causalSummary: '勤務時間と疲労の波が一致せず、業務継続が不安定になっている。',
      followUpAnswerCount: 3,
      glmInsightCount: 2,
      sourceUsageSummaries: [
        {
          key: 'askjan',
          sourceName: 'AskJAN Website',
          sourceUrl: 'https://askjan.example',
          roles: ['根拠', '試行候補'],
          usedParts: ['勤務時間調整が有効な場合がある。'],
        },
        {
          key: 'canada',
          sourceName: 'Canada Duty to Accommodate Guidance',
          sourceUrl: 'https://canada.example',
          roles: ['対話の軸'],
          usedParts: ['短時間勤務の調整: 勤務時間調整の対話ガイド'],
        },
      ],
      step4Output: {
        basisItems: [
          {
            id: 'basis-1',
            title: '勤務時間調整が有効な場合がある。',
            rankScore: 80,
            evidenceLaneLabel: '事例実践',
            confidenceLevel: 'high',
            confidenceScore: 0.82,
            riskLevel: 'low',
            sourceNames: ['AskJAN Website'],
            sourceUrls: ['https://askjan.example'],
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
            reason: '疲労の波に合わせるため',
            examples: '開始時刻を遅らせる',
            sections: [
              {
                usageFocus: 'dialogue',
                usageFocusLabel: '対話の軸',
                items: [],
              },
              {
                usageFocus: 'trial',
                usageFocusLabel: '試行候補',
                items: [],
              },
            ],
          },
        ],
        practicalReferenceItems: [],
        supplementalReferenceItems: [],
        hasContent: true,
        hasReferenceContent: true,
      },
    });

    expect(judgment.summary).toContain('1件の決定的根拠に依らず');
    expect(judgment.materialSignals).toEqual(
      expect.arrayContaining([
        { label: '相談文', value: '主情報' },
        { label: '追加確認', value: '3件' },
        { label: '統計知見', value: '2件' },
        { label: '安定根拠', value: '1件' },
        { label: '実施資料', value: '1件' },
        { label: 'source family', value: '2系統' },
      ]),
    );
    expect(judgment.keyPoints).toEqual(
      expect.arrayContaining([
        '勤務時間と疲労の波が一致せず、業務継続が不安定になっている。',
        '安定根拠: 勤務時間調整が有効な場合がある。',
        '短時間勤務の調整: 対話の軸・試行候補に使う資料を参照',
      ]),
    );
    expect(judgment.stableBasisNote).toContain('安定根拠カードはまだ少数');
  });
});
