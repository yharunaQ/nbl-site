import {
  buildImplementationKnowledgeCatalog,
  flattenImplementationKnowledgeCatalog,
} from '@/lib/jac/implementationKnowledgeCatalog';
import { buildPracticalReferencePreview } from '@/lib/jac/practicalReferenceCatalog';

jest.mock('@/lib/jac/practicalReferenceCatalog', () => ({
  buildPracticalReferencePreview: jest.fn(),
}));

const mockBuildPracticalReferencePreview =
  buildPracticalReferencePreview as jest.MockedFunction<typeof buildPracticalReferencePreview>;

describe('implementation knowledge catalog', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('groups practical references by selected accommodation and preserves stage coverage', async () => {
    mockBuildPracticalReferencePreview.mockImplementation(async (_evidence, _maxItems, context) => {
      const selectedTitle = context?.selectedAccommodationTitles?.[0];

      if (selectedTitle === '短時間勤務の調整') {
        return [
          {
            id: 'dialogue-1',
            title: '勤務時間調整の対話ガイド',
            summary: '対話で確認: 疲労の波と始業時刻をすり合わせる。',
            sourceId: 'canada_duty_to_accommodate',
            sourceName: 'Canada Duty to Accommodate Guidance',
            sourceUrl: 'https://example.com/dialogue',
            category: 'practical_guidance',
            categoryLabel: '実践ガイダンス',
            usageFocus: 'dialogue',
            usageFocusLabel: '対話の軸',
            whyRelevant: '勤務時間調整の前提確認に使える。',
            pageType: 'document',
            evidenceScope: 'aggregated_index',
          },
          {
            id: 'trial-1',
            title: '短時間勤務の試行例',
            summary: '試し方の例: 短時間勤務と計画休憩を組み合わせる。',
            sourceId: 'askjan_website',
            sourceName: 'AskJAN Website',
            sourceUrl: 'https://example.com/trial',
            category: 'case_example',
            categoryLabel: '類似事例',
            usageFocus: 'trial',
            usageFocusLabel: '試行候補',
            whyRelevant: '小さく試す材料になる。',
            pageType: 'case_detail',
            evidenceScope: 'specific_case',
          },
          {
            id: 'review-1',
            title: '勤務時間調整の見直しポイント',
            summary: '見直しの観点: 試行後に負担と継続率を確認する。',
            sourceId: 'australia_jobaccess_guidance',
            sourceName: 'Australia JobAccess Employer Guidance',
            sourceUrl: 'https://example.com/review',
            category: 'practical_guidance',
            categoryLabel: '実践ガイダンス',
            usageFocus: 'review',
            usageFocusLabel: '見直しの軸',
            whyRelevant: '導入後レビューに使える。',
            pageType: 'employer_guidance_page',
            evidenceScope: 'aggregated_index',
          },
        ];
      }

      if (selectedTitle === '情報をスローダウンして共有') {
        return [
          {
            id: 'cognitive-trial-1',
            title: '手順を文書化する実践ガイド',
            summary: '試し方の例: 要点サマリーと手順書を先に共有する。',
            sourceId: 'australia_jobaccess_guidance',
            sourceName: 'Australia JobAccess Employer Guidance',
            sourceUrl: 'https://example.com/cognitive-trial',
            category: 'practical_guidance',
            categoryLabel: '実践ガイダンス',
            usageFocus: 'trial',
            usageFocusLabel: '試行候補',
            whyRelevant: '情報量を調整しやすい。',
            pageType: 'document',
            evidenceScope: 'aggregated_index',
          },
        ];
      }

      return [];
    });

    const catalog = await buildImplementationKnowledgeCatalog({
      accommodations: [
        {
          title: '短時間勤務の調整',
          reason: '疲労の波に合わせるため',
          examples: '開始時刻を遅らせる',
          priority: 1,
        },
        {
          title: '情報をスローダウンして共有',
          reason: '認知負荷を下げるため',
          examples: '要点サマリーを付ける',
          priority: 2,
        },
      ],
      evidence: [],
      practicalContext: {
        consultationText: '午後に疲れやすく、情報量が多いと処理が追いつかない。',
        selectedAccommodationTitles: ['短時間勤務の調整', '情報をスローダウンして共有'],
      },
      maxAccommodations: 3,
      maxItemsPerAccommodation: 4,
    });

    expect(catalog).toHaveLength(2);
    expect(catalog[0].accommodationTitle).toBe('短時間勤務の調整');
    expect(catalog[0].sections.map((section) => section.usageFocus)).toEqual([
      'dialogue',
      'trial',
      'review',
    ]);
    expect(catalog[0].summary).toContain('短時間勤務の調整');
    expect(catalog[1].sections.map((section) => section.usageFocus)).toEqual(['trial']);

    const flattened = flattenImplementationKnowledgeCatalog(catalog, 6);
    expect(flattened.map((item) => item.id)).toEqual([
      'dialogue-1',
      'trial-1',
      'review-1',
      'cognitive-trial-1',
    ]);
    expect(flattened[0].linkedAccommodationTitles).toEqual(['短時間勤務の調整']);
    expect(flattened[3].linkedAccommodationTitles).toEqual(['情報をスローダウンして共有']);
  });

  it('prefers distinct source families before repeating AskJAN within one accommodation', async () => {
    mockBuildPracticalReferencePreview.mockResolvedValue([
      {
        id: 'askjan-dialogue',
        title: '勤務時間調整の類似事例',
        summary: '対話で確認: 疲労の波と始業時刻をすり合わせる。',
        sourceId: 'askjan_website',
        sourceName: 'AskJAN Website',
        sourceUrl: 'https://example.com/askjan-dialogue',
        category: 'case_example',
        categoryLabel: '類似事例',
        usageFocus: 'dialogue',
        usageFocusLabel: '対話の軸',
        whyRelevant: '前提確認に使える。',
        pageType: 'case_detail',
        evidenceScope: 'specific_case',
      },
      {
        id: 'askjan-trial',
        title: '勤務時間調整の試行例',
        summary: '試し方の例: 短時間勤務と計画休憩を組み合わせる。',
        sourceId: 'askjan_website',
        sourceName: 'AskJAN Website',
        sourceUrl: 'https://example.com/askjan-trial',
        category: 'case_example',
        categoryLabel: '類似事例',
        usageFocus: 'trial',
        usageFocusLabel: '試行候補',
        whyRelevant: '小さく試す材料になる。',
        pageType: 'case_detail',
        evidenceScope: 'specific_case',
      },
      {
        id: 'askjan-review',
        title: '勤務時間調整の見直しポイント',
        summary: '見直しの観点: 試行後に負担と継続率を確認する。',
        sourceId: 'askjan_website',
        sourceName: 'AskJAN Website',
        sourceUrl: 'https://example.com/askjan-review',
        category: 'case_example',
        categoryLabel: '類似事例',
        usageFocus: 'review',
        usageFocusLabel: '見直しの軸',
        whyRelevant: '導入後レビューに使える。',
        pageType: 'case_detail',
        evidenceScope: 'specific_case',
      },
      {
        id: 'canada-dialogue',
        title: '勤務時間調整の対話ガイド',
        summary: '対話で確認: 本人と職場で制約条件を整理する。',
        sourceId: 'canada_duty_to_accommodate',
        sourceName: 'Canada Duty to Accommodate Guidance',
        sourceUrl: 'https://example.com/canada-dialogue',
        category: 'practical_guidance',
        categoryLabel: '実践ガイダンス',
        usageFocus: 'dialogue',
        usageFocusLabel: '対話の軸',
        whyRelevant: '確認に使える。',
        pageType: 'document',
        evidenceScope: 'aggregated_index',
      },
      {
        id: 'jobaccess-review',
        title: '勤務時間調整の見直しガイド',
        summary: '見直しの観点: 導入後レビューの観点を整理する。',
        sourceId: 'australia_jobaccess_guidance',
        sourceName: 'Australia JobAccess Employer Guidance',
        sourceUrl: 'https://example.com/jobaccess-review',
        category: 'practical_guidance',
        categoryLabel: '実践ガイダンス',
        usageFocus: 'review',
        usageFocusLabel: '見直しの軸',
        whyRelevant: 'レビューに使える。',
        pageType: 'document',
        evidenceScope: 'aggregated_index',
      },
    ]);

    const catalog = await buildImplementationKnowledgeCatalog({
      accommodations: [
        {
          title: '短時間勤務の調整',
          reason: '疲労の波に合わせるため',
          priority: 1,
        },
      ],
      evidence: [],
      practicalContext: {
        consultationText: '通院と疲労の両立のため勤務時間を見直したい。',
        selectedAccommodationTitles: ['短時間勤務の調整'],
      },
      maxAccommodations: 1,
      maxItemsPerAccommodation: 4,
    });

    expect(catalog).toHaveLength(1);
    const selectedSourceIds = catalog[0].sections.flatMap((section) =>
      section.items.map((item) => item.sourceId),
    );
    expect(selectedSourceIds).toEqual(
      expect.arrayContaining([
        'askjan_website',
        'canada_duty_to_accommodate',
        'australia_jobaccess_guidance',
      ]),
    );
    expect(catalog[0].summary).toContain('3つの source family');
  });
});
