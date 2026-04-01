import { buildStep4EvidencePack } from '@/lib/jac/step4EvidencePack';
import {
  buildImplementationKnowledgeCatalog,
  flattenImplementationKnowledgeCatalog,
} from '@/lib/jac/implementationKnowledgeCatalog';
import {
  buildPracticalReferencePreview,
  type PracticalReferencePreviewItem,
} from '@/lib/jac/practicalReferenceCatalog';
import {
  getCitationEvidenceDetails,
  type CitationEvidenceDetail,
} from '@/lib/knowledge/claimRegistry';

jest.mock('@/lib/knowledge/claimRegistry', () => ({
  getCitationEvidenceDetails: jest.fn(),
}));

jest.mock('@/lib/jac/practicalReferenceCatalog', () => ({
  buildPracticalReferencePreview: jest.fn(),
}));

jest.mock('@/lib/jac/implementationKnowledgeCatalog', () => ({
  buildImplementationKnowledgeCatalog: jest.fn(),
  flattenImplementationKnowledgeCatalog: jest.fn(),
}));

const mockGetCitationEvidenceDetails =
  getCitationEvidenceDetails as jest.MockedFunction<typeof getCitationEvidenceDetails>;
const mockBuildPracticalReferencePreview =
  buildPracticalReferencePreview as jest.MockedFunction<typeof buildPracticalReferencePreview>;
const mockBuildImplementationKnowledgeCatalog =
  buildImplementationKnowledgeCatalog as jest.MockedFunction<typeof buildImplementationKnowledgeCatalog>;
const mockFlattenImplementationKnowledgeCatalog =
  flattenImplementationKnowledgeCatalog as jest.MockedFunction<typeof flattenImplementationKnowledgeCatalog>;

describe('buildStep4EvidencePack', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('builds Step 4 basis and references from matched claims instead of raw assessment citations', async () => {
    const details: CitationEvidenceDetail[] = [
      {
        evidence_id: 'claim-askjan',
        summary: '勤務時間や休憩を本人と確認しながら短時間勤務を試行する。',
        evidence_lane: 'employer_guidance',
        evidence_lane_label: '雇用主ガイダンス',
        evidence_role: 'direct_basis',
        evidence_role_label: '見立ての根拠',
        source_ids: ['askjan_website'],
        source_names: ['AskJAN Website'],
        source_urls: ['https://askjan.example/schedule'],
        countries: ['us'],
        legal_contexts: [],
        trust_tiers: ['external'],
        confidence_level: 'high',
        confidence_score: 0.91,
        risk_level: 'low',
        risk_reasons: [],
        page_types: ['employer_guidance_page'],
        evidence_scopes: ['specific_case'],
        note_type: null,
        curation_risk_level: null,
        public_safe: true,
        must_pair_with_regional_support: false,
        missing_contexts: ['time'],
        conditions: ['本人の疲労の波と通院予定を確認する'],
        is_partial: false,
        sample_excerpts: [
          {
            record_id: 'record-askjan',
            source_id: 'askjan_website',
            source_name: 'AskJAN Website',
            file_path: 'references/web-cache/askjan/schedule.md',
            source_url: 'https://askjan.example/schedule',
            excerpt: 'Flexible schedules and planned breaks can reduce fatigue.',
          },
        ],
      },
      {
        evidence_id: 'claim-canada',
        summary: '本人と職場で勤務時間の制約と試行条件を文書化して見直す。',
        evidence_lane: 'employer_guidance',
        evidence_lane_label: '雇用主ガイダンス',
        evidence_role: 'direct_basis',
        evidence_role_label: '見立ての根拠',
        source_ids: ['canada_duty_to_accommodate'],
        source_names: ['Canada Duty to Accommodate Guidance'],
        source_urls: ['https://canada.example/dialogue'],
        countries: ['ca'],
        legal_contexts: [],
        trust_tiers: ['external'],
        confidence_level: 'medium',
        confidence_score: 0.72,
        risk_level: 'low',
        risk_reasons: [],
        page_types: ['document'],
        evidence_scopes: ['specific_case'],
        note_type: null,
        curation_risk_level: null,
        public_safe: true,
        must_pair_with_regional_support: false,
        missing_contexts: [],
        conditions: ['通院頻度と始業時刻の柔軟性を確認する'],
        is_partial: false,
        sample_excerpts: [],
      },
      {
        evidence_id: 'claim-reference',
        summary: '対話で確認: 勤務時間調整の候補と見直し周期を合意する。',
        evidence_lane: 'employer_guidance',
        evidence_lane_label: '雇用主ガイダンス',
        evidence_role: 'related_reading',
        evidence_role_label: '具体策の参考資料',
        source_ids: ['askearn_employer_guidance'],
        source_names: ['EARN Employer Guidance'],
        source_urls: ['https://earn.example/dialogue'],
        countries: ['us'],
        legal_contexts: [],
        trust_tiers: ['external'],
        confidence_level: 'medium',
        confidence_score: 0.66,
        risk_level: 'low',
        risk_reasons: [],
        page_types: ['employer_guidance_page'],
        evidence_scopes: ['aggregated_index'],
        note_type: null,
        curation_risk_level: null,
        public_safe: false,
        must_pair_with_regional_support: false,
        missing_contexts: [],
        conditions: [],
        is_partial: false,
        sample_excerpts: [],
      },
    ];
    const preview: PracticalReferencePreviewItem[] = [
      {
        id: 'preview-askjan',
        title: '勤務時間・休憩を調整する具体策',
        summary: '試し方の例: 短時間勤務と計画休憩を組み合わせる。',
        sourceId: 'askjan_website',
        sourceName: 'AskJAN Website',
        sourceUrl: 'https://askjan.example/schedule',
        category: 'case_example',
        categoryLabel: '類似事例',
        usageFocus: 'trial',
        usageFocusLabel: '試行候補',
        whyRelevant: '勤務時間調整の実例として使える。',
        pageType: 'case_detail',
        evidenceScope: 'specific_case',
      },
      {
        id: 'preview-jobaccess',
        title: '調整後の見直しポイント',
        summary: '見直しの観点: 試行後に効果と負担を確認する。',
        sourceId: 'australia_jobaccess_guidance',
        sourceName: 'Australia JobAccess Employer Guidance',
        sourceUrl: 'https://jobaccess.example/review',
        category: 'practical_guidance',
        categoryLabel: '実践ガイダンス',
        usageFocus: 'review',
        usageFocusLabel: '見直しの軸',
        whyRelevant: '試行後レビューの材料になる。',
        pageType: 'employer_guidance_page',
        evidenceScope: 'aggregated_index',
      },
    ];

    mockGetCitationEvidenceDetails.mockResolvedValue(details);
    mockBuildPracticalReferencePreview.mockResolvedValue(preview);
    mockBuildImplementationKnowledgeCatalog.mockResolvedValue([
      {
        id: 'impl-schedule',
        accommodationTitle: '短時間勤務の調整',
        summary: '短時間勤務を実施する前後の確認と見直しに使う。',
        reason: '疲労の波に合わせるため',
        examples: '開始時刻を遅らせる',
        sections: [
          {
            usageFocus: 'trial',
            usageFocusLabel: '試行候補',
            items: [preview[0]],
          },
        ],
      },
    ]);
    mockFlattenImplementationKnowledgeCatalog.mockReturnValue(preview);

    const pack = await buildStep4EvidencePack({
      assessment: {
        summary: '体調変動と勤務時間のミスマッチが続いている。',
        causal_summary: '勤務時間と疲労の波が一致せず、業務継続が不安定になっている。',
        agreement: '短時間勤務と計画休憩を2週間試行し、本人と上司で見直す。',
        kpi: '疲労自己評価、勤務継続率、業務完了率を週次確認。',
        accommodations: [
          {
            title: '短時間勤務の調整',
            reason: '疲労の波に合わせるため',
            examples: '開始時刻を遅らせる',
            priority: 1,
          },
        ],
      },
      claimIds: ['claim-askjan', 'claim-canada', 'claim-reference'],
      evidence: [
        {
          id: 'record-askjan',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan.md',
          excerpt: 'Flexible schedules and planned breaks can reduce fatigue.',
          score: 88,
        },
      ],
      supportCatalogItems: [],
      evidenceContext: {
        consultationText: 'フルタイム勤務が難しく、午後に疲労が強くなる。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
        followUpAnswers: ['午後に疲れやすい'],
        selectedAccommodationTitles: ['短時間勤務の調整'],
      },
      practicalContext: {
        consultationText: 'フルタイム勤務が難しく、午後に疲労が強くなる。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
        followUpAnswers: ['午後に疲れやすい'],
        selectedAccommodationTitles: ['短時間勤務の調整'],
      },
    });

    expect(mockGetCitationEvidenceDetails).toHaveBeenCalledWith([
      'claim-askjan',
      'claim-canada',
      'claim-reference',
    ]);
    expect(pack.basisItems.length).toBeGreaterThanOrEqual(2);
    expect(pack.basisItems.map((item) => item.sourceNames[0])).toEqual(
      expect.arrayContaining(['AskJAN Website', 'Canada Duty to Accommodate Guidance']),
    );
    expect(pack.practicalReferenceItems.map((item) => item.sourceId)).toEqual([
      'askjan_website',
      'australia_jobaccess_guidance',
    ]);
    expect(pack.implementationKnowledgeItems).toHaveLength(1);
    expect(pack.implementationKnowledgeItems[0].accommodationTitle).toBe('短時間勤務の調整');
    expect(pack.hasContent).toBe(true);
  });

  it('keeps general diverse preview ahead of duplicated implementation-only AskJAN items', async () => {
    mockGetCitationEvidenceDetails.mockResolvedValue([]);
    mockBuildImplementationKnowledgeCatalog.mockResolvedValue([
      {
        id: 'impl-schedule',
        accommodationTitle: '通院・治療スケジュールへの配慮',
        summary: '実施前後の確認に使う。',
        reason: '治療との両立のため',
        examples: '通院日の時差出勤',
        sections: [],
      },
    ]);
    mockFlattenImplementationKnowledgeCatalog.mockReturnValue([
      {
        id: 'impl-askjan-1',
        title: '勤務時間・休憩・治療スケジュールの類似事例',
        summary: '試し方の例: 勤務時間や休憩を、疲労や治療スケジュールに合わせて調整する。',
        sourceId: 'askjan_website',
        sourceName: 'AskJAN Website',
        sourceUrl: 'https://askjan.example/case-1',
        category: 'case_example',
        categoryLabel: '類似事例',
        usageFocus: 'trial',
        usageFocusLabel: '試行候補',
        whyRelevant: '調整案の試行材料になる。',
        pageType: 'case_detail',
        evidenceScope: 'specific_case',
        linkedAccommodationTitles: ['通院・治療スケジュールへの配慮'],
      },
      {
        id: 'impl-askjan-2',
        title: '勤務時間・休憩・治療スケジュールの類似事例',
        summary: '試し方の例: 勤務時間や休憩を、疲労や治療スケジュールに合わせて調整する。',
        sourceId: 'askjan_website',
        sourceName: 'AskJAN Website',
        sourceUrl: 'https://askjan.example/case-2',
        category: 'case_example',
        categoryLabel: '類似事例',
        usageFocus: 'trial',
        usageFocusLabel: '試行候補',
        whyRelevant: '調整案の試行材料になる。',
        pageType: 'case_detail',
        evidenceScope: 'specific_case',
        linkedAccommodationTitles: ['勤務時間の柔軟な調整（短時間勤務や時差出勤）'],
      },
    ]);
    mockBuildPracticalReferencePreview.mockResolvedValue([
      {
        id: 'general-canada',
        title: '相談・合意・見直しを整理する対話ガイド',
        summary: '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。',
        sourceId: 'canada_duty_to_accommodate',
        sourceName: 'Canada Duty to Accommodate Guidance',
        sourceUrl: 'https://canada.example/dialogue',
        category: 'practical_guidance',
        categoryLabel: '実践ガイダンス',
        usageFocus: 'dialogue',
        usageFocusLabel: '対話の軸',
        whyRelevant: '実施前の確認に使える。',
        pageType: 'document',
        evidenceScope: 'aggregated_index',
      },
      {
        id: 'general-jobaccess',
        title: '勤務時間・休憩・治療スケジュールを整理する対話ガイド',
        summary: '対話で確認: 勤務時間・休憩・通院との両立でどこに負担が出るかを、本人と職場で整理する。',
        sourceId: 'australia_jobaccess_guidance',
        sourceName: 'Australia JobAccess Employer Guidance',
        sourceUrl: 'https://jobaccess.example/dialogue',
        category: 'practical_guidance',
        categoryLabel: '実践ガイダンス',
        usageFocus: 'dialogue',
        usageFocusLabel: '対話の軸',
        whyRelevant: '実施前の確認に使える。',
        pageType: 'document',
        evidenceScope: 'aggregated_index',
      },
    ]);

    const pack = await buildStep4EvidencePack({
      assessment: {
        accommodations: [
          {
            title: '通院・治療スケジュールへの配慮',
            reason: '治療との両立のため',
            priority: 1,
          },
        ],
      },
      claimIds: [],
      evidence: [],
      supportCatalogItems: [],
      practicalContext: {
        consultationText: '通院と勤務の両立が難しい。',
        selectedAccommodationTitles: ['通院・治療スケジュールへの配慮'],
      },
    });

    expect(pack.practicalReferenceItems.map((item) => item.sourceId)).toEqual([
      'canada_duty_to_accommodate',
      'australia_jobaccess_guidance',
      'askjan_website',
    ]);
    expect(pack.practicalReferenceItems[2].linkedAccommodationTitles).toEqual(
      expect.arrayContaining([
        '通院・治療スケジュールへの配慮',
        '勤務時間の柔軟な調整（短時間勤務や時差出勤）',
      ]),
    );
  });
});
