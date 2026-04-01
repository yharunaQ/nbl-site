import { buildStep4OutputModel } from '@/lib/jac/step4OutputModel';

describe('buildStep4OutputModel', () => {
  it('groups direct basis by evidence detail instead of raw citation card', () => {
    const model = buildStep4OutputModel({
      basisCitations: [
        {
          claim: '短時間勤務の調整を検討する',
          evidence_ids: ['claim-1'],
          evidence_details: [
            {
              evidence_id: 'claim-1',
              summary: '勤務時間や休憩の調整が有効な場合がある。',
              evidence_role: 'direct_basis',
              public_safe: true,
              evidence_lane_label: '事例実践',
              confidence_level: 'high',
              confidence_score: 0.82,
              risk_level: 'low',
              source_names: ['AskJAN Website'],
              source_urls: ['https://example.com/basis'],
              conditions: ['疲労の波を本人と確認する'],
              missing_contexts: ['time'],
              sample_excerpts: [
                {
                  record_id: 'r1',
                  source_name: 'AskJAN Website',
                  source_url: 'https://example.com/basis',
                  excerpt: 'Flexible schedules may help.',
                },
              ],
            },
          ],
        },
        {
          claim: '休憩の取り方も再検討する',
          evidence_ids: ['claim-1'],
          evidence_details: [
            {
              evidence_id: 'claim-1',
              summary: '勤務時間や休憩の調整が有効な場合がある。',
              evidence_role: 'direct_basis',
              public_safe: true,
              evidence_lane_label: '事例実践',
              confidence_level: 'high',
              confidence_score: 0.82,
              risk_level: 'low',
              source_names: ['AskJAN Website'],
              source_urls: ['https://example.com/basis'],
              conditions: ['疲労の波を本人と確認する'],
              missing_contexts: ['time'],
              sample_excerpts: [],
            },
          ],
        },
      ],
      referenceCitations: [],
      supportCatalogItems: [],
      implementationKnowledgeItems: [],
      practicalReferenceItems: [],
    });

    expect(model.basisItems).toHaveLength(1);
    expect(model.basisItems[0].linkedClaims).toEqual([
      '短時間勤務の調整を検討する',
      '休憩の取り方も再検討する',
    ]);
    expect(model.basisItems[0].title).toBe('勤務時間や休憩の調整が有効な場合がある。');
  });

  it('keeps related reading as supplemental references and preserves previews', () => {
    const model = buildStep4OutputModel({
      basisCitations: [],
      referenceCitations: [
        {
          claim: '勤務時間調整の参考資料',
          evidence_ids: ['ref-1'],
          evidence_details: [
            {
              evidence_id: 'ref-1',
              summary: '対話で確認: 勤務時間や休憩の取り方を本人とすり合わせる。',
              evidence_role: 'related_reading',
              public_safe: false,
              source_names: ['Canada Duty to Accommodate Guidance'],
              source_urls: ['https://example.com/reference'],
              practice_stage_label: '対話の軸',
              sample_excerpts: [
                {
                  record_id: 'r2',
                  source_name: 'Canada Duty to Accommodate Guidance',
                  source_url: 'https://example.com/reference',
                  excerpt: 'Meet with the employee to discuss working time.',
                },
              ],
            },
          ],
        },
      ],
      supportCatalogItems: [
        {
          title: '地域の支援機関との役割分担',
          summary: '職場との調整を支える支援連携を確認する。',
          recommendedSupports: [],
        },
      ],
      implementationKnowledgeItems: [
        {
          id: 'impl-1',
          accommodationTitle: '短時間勤務の調整',
          summary: '短時間勤務を実施する前後の確認と見直しに使う。',
          reason: '疲労の波に合わせるため',
          examples: '開始時刻を遅らせる',
          sections: [
            {
              usageFocus: 'trial',
              usageFocusLabel: '試行候補',
              items: [],
            },
          ],
        },
      ],
      practicalReferenceItems: [
        {
          id: 'preview-1',
          title: '勤務時間・休憩を調整する具体策',
          summary: '試し方の例: 短時間勤務と休憩導線を組み合わせる。',
          sourceId: 'askjan_website',
          sourceName: 'AskJAN Website',
          sourceUrl: 'https://example.com/practical',
          category: 'practical_guidance',
          categoryLabel: '雇用ガイダンス',
          usageFocus: 'trial',
          usageFocusLabel: '試行候補',
          whyRelevant: '勤務時間の再設計に直結する。',
          pageType: 'guide',
          evidenceScope: '参考資料',
        },
      ],
    });

    expect(model.supportCatalogItems).toHaveLength(1);
    expect(model.implementationKnowledgeItems).toHaveLength(1);
    expect(model.practicalReferenceItems).toHaveLength(1);
    expect(model.supplementalReferenceItems).toHaveLength(1);
    expect(model.supplementalReferenceItems[0].practiceStageLabel).toBe('対話の軸');
    expect(model.hasReferenceContent).toBe(true);
  });
});
