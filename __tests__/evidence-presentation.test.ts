import {
  citationHasDirectBasis,
  enrichReferenceCitationsByContext,
  filterReferenceCitationsByUsefulness,
  groupEvidenceByRole,
  mergeReferenceCitationsByClaim,
  resolveEvidencePresentationRole,
  sortCitationsByContext,
  splitCitationsByPresentation,
} from '@/lib/jac/evidencePresentation';

describe('evidence presentation helpers', () => {
  it('keeps direct basis evidence in the root basis group', () => {
    expect(
      resolveEvidencePresentationRole({
        evidence_role: 'direct_basis',
        evidence_lane: 'legal_policy',
        is_partial: false,
      }),
    ).toBe('direct_basis');
  });

  it('treats aggregated evidence as a conditional hypothesis when no explicit role exists', () => {
    expect(
      resolveEvidencePresentationRole({
        evidence_lane: 'aggregated_general',
        is_partial: true,
      }),
    ).toBe('conditional_hypothesis');
  });

  it('demotes external aggregated legal guidance to practical reference presentation', () => {
    expect(
      resolveEvidencePresentationRole({
        evidence_role: 'direct_basis',
        evidence_lane: 'legal_policy',
        trust_tiers: ['external'],
        evidence_scopes: ['aggregated_index'],
        page_types: ['document'],
        is_partial: true,
      }),
    ).toBe('related_reading');
  });

  it('demotes index-like web pages to practical reference presentation', () => {
    expect(
      resolveEvidencePresentationRole({
        evidence_role: 'direct_basis',
        evidence_lane: 'case_practice',
        trust_tiers: ['external'],
        evidence_scopes: ['aggregated_index'],
        page_types: ['search_index'],
      }),
    ).toBe('related_reading');
  });

  it('groups support catalog details separately from direct basis evidence', () => {
    const groups = groupEvidenceByRole([
      {
        evidence_id: 'basis-1',
        evidence_role: 'direct_basis',
      },
      {
        evidence_id: 'support-1',
        evidence_role: 'support_catalog',
      },
    ]);

    expect(groups.map((group) => group.role)).toEqual(['direct_basis', 'support_catalog']);
    expect(groups[0]?.details).toHaveLength(1);
    expect(groups[1]?.details).toHaveLength(1);
  });

  it('detects whether a citation has direct basis evidence', () => {
    expect(
      citationHasDirectBasis({
        evidence_details: [
          {
            evidence_role: 'direct_basis',
            public_safe: true,
          },
        ],
      }),
    ).toBe(true);

    expect(
      citationHasDirectBasis({
        evidence_details: [
          {
            evidence_role: 'conditional_hypothesis',
            public_safe: false,
          },
        ],
      }),
    ).toBe(false);
  });

  it('splits citations into basis and reference presentation lanes', () => {
    const { basisCitations, referenceCitations } = splitCitationsByPresentation([
      {
        claim: '根拠として使える',
        evidence_details: [{ evidence_role: 'direct_basis', public_safe: true }],
      },
      {
        claim: '参考資料として扱う',
        evidence_details: [{ evidence_role: 'support_catalog', public_safe: false }],
      },
    ]);

    expect(basisCitations).toHaveLength(1);
    expect(referenceCitations).toHaveLength(1);
  });

  it('sorts reference citations by consultation context', () => {
    const sorted = sortCitationsByContext(
      [
        {
          claim: '一般的な職場文化の見直し',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary: 'Create a supportive workplace culture and review policies regularly.',
              public_safe: false,
            },
          ],
        },
        {
          claim: '勤務時間と疲労への具体調整',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'Flexible working time can help employees manage treatment schedules or energy levels.',
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）', '疲労・倦怠（慢性疲労含む）'],
      },
    );

    expect(sorted[0]?.claim).toBe('勤務時間と疲労への具体調整');
  });

  it('filters out low-value admin or generic reference citations while keeping practical ones', () => {
    const filtered = filterReferenceCitationsByUsefulness(
      [
        {
          claim: '支援制度の申請手続き',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'legal_policy',
              summary: 'You’ll need a letter confirming your grant has been approved before you can claim.',
              source_urls: ['https://www.gov.uk/access-to-work/claiming-from-your-grant'],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
        {
          claim: '勤務時間と休憩の具体調整',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'Flexible working time can help employees manage treatment schedules or energy levels.',
              source_urls: [
                'https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job/flexible-working-arrangements',
              ],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
        {
          claim: 'ニュースレター案内',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'Start by subscribing to our monthly newsletter and eblasts, which will connect you to upcoming events, developing news and promising practices in the world of disability.',
              source_urls: ['https://askearn.org/page/earn-newsletter-march-2026'],
              page_types: ['employer_publication'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
        {
          claim: '保存済み導線',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'Save Flexible working arrangements Find out about: types of flexible arrangements working from home agreeing to changes with your employer.',
              source_urls: [
                'https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job',
              ],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
      },
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.claim).toBe('勤務時間と休憩の具体調整');
  });

  it('filters newly blocked source-family intro statements from related reading', () => {
    const filtered = filterReferenceCitationsByUsefulness([
      {
        claim: '導入文',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'employer_guidance',
            summary:
              'Getting Started / Publications Increasing demand for candidates to fill jobs in specialized fields is producing talent shortages.',
            source_urls: ['https://askearn.org/publication/neurodiversity-hiring-checklist'],
            page_types: ['employer_publication'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '調整案を相談する具体策',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'legal_policy',
            summary:
              'If the employee is facing one or more barriers to their full participation in the workplace, the manager should talk to the employee to find timely solutions that address the barriers.',
            source_urls: [
              'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/make-informed-decision.html',
            ],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '一般的な雇用メリット',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'employer_guidance',
            summary:
              'Providing workplace accommodations yields multiple benefits for employers, including retaining valuable employees, improving overall production and morale, and reducing workers’ compensation and training costs.',
            source_urls: ['https://askearn.org/page/accommodation-process'],
            page_types: ['employer_guidance_page'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: 'step-by-step 導入文',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'legal_policy',
            summary:
              'This page is Part of Get ready to employ someone for the first time: step by step Step 1 : Check that you’re taking on someone as an employee Follow these steps if you want to take on someone with the employment status of employee for the first time.',
            source_urls: ['https://www.gov.uk/reasonable-adjustments-for-disabled-workers'],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '法的リスクの一般論',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'employer_guidance',
            summary:
              'An effective process will also reduce employers’ exposure to legal risk and support compliance with equal opportunity laws and regulations.',
            source_urls: ['https://askearn.org/page/accommodation-process'],
            page_types: ['employer_guidance_page'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '歓迎姿勢の一般論',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'employer_guidance',
            summary:
              'Organizations may want to demonstrate that they welcome accommodation requests and consider them a way to enhance productivity.',
            source_urls: ['https://askearn.org/page/accommodation-process'],
            page_types: ['employer_guidance_page'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '救済導線の一般論',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'legal_policy',
            summary:
              'Represented employees may consult with their union to explore the recourse mechanisms open to them filing a complaint with the Canadian Human Rights Commission.',
            source_urls: [
              'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/implement-decision.html',
            ],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '外部誘導の一般論',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'legal_policy',
            summary:
              'There’s more detail about employers’ obligations and how to meet them on the Equality and Human Rights Commission website.',
            source_urls: ['https://www.gov.uk/reasonable-adjustments-for-disabled-workers'],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: 'EU の制度一般論',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'legal_policy',
            summary:
              'Collective bargaining and social dialogue between employers and trade unions play an important role in negotiating and implementing measures for reasonable accommodation in the workplace for persons with disabilities.',
            source_urls: ['https://op.europa.eu/webpub/empl/reasonable-accommodation-at-work/en/'],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
    ]);

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.claim).toBe('調整案を相談する具体策');
  });

  it('filters source-family governance references when the consultation context does not match', () => {
    const filtered = filterReferenceCitationsByUsefulness(
      [
        {
          claim: 'ICT ガバナンス',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'Evaluating accessibility by testing ICT applications with automated accessibility testing tools and by considering the user experience of applicants, employees, and customers.',
              source_ids: ['askearn_employer_guidance'],
              source_urls: ['https://askearn.org/page/be-tech-savvy-accessible-information-and-communication-technology'],
              page_types: ['employer_guidance_page'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
        {
          claim: '勤務時間の具体調整',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'Flexible working time can help employees manage treatment schedules or energy levels.',
              source_ids: ['australia_jobaccess_guidance'],
              source_urls: ['https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job/flexible-working-arrangements'],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
      },
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.claim).toBe('勤務時間の具体調整');
  });

  it('dedupes repeated reference citations by source url', () => {
    const filtered = filterReferenceCitationsByUsefulness([
      {
        claim: '手順の明確化',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'employer_guidance',
            summary: 'Written instructions and task lists can support memory or comprehension.',
            source_urls: ['https://example.com/practical-guide'],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
      {
        claim: '同じページ由来の重複引用',
        evidence_details: [
          {
            evidence_role: 'related_reading',
            evidence_lane: 'employer_guidance',
            summary: 'Written instructions and task lists can support memory or comprehension.',
            source_urls: ['https://example.com/practical-guide'],
            page_types: ['document'],
            evidence_scopes: ['aggregated_index'],
            public_safe: false,
          },
        ],
      },
    ]);

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.claim).toBe('手順の明確化');
  });

  it('rewrites reference detail summaries toward practical context-matched sentences', () => {
    const enriched = enrichReferenceCitationsByContext(
      [
        {
          claim: '勤務設計の参考',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary: 'Organizations of all sizes can benefit from supporting neurodiversity at work.',
              sample_excerpts: [
                {
                  excerpt:
                    'Flexible working time can help employees manage treatment schedules or energy levels and maintain productivity.',
                },
                {
                  excerpt:
                    'Organizations of all sizes in all industries can benefit from supporting neurodiversity at work.',
                },
              ],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
      },
    );

    expect(enriched[0]?.evidence_details?.[0]?.summary).toContain('勤務時間や休憩');
    expect(enriched[0]?.evidence_details?.[0]?.sample_excerpts?.[0]?.excerpt).toContain(
      'Flexible working time',
    );
  });

  it('rewrites generic reference citation claims into short practical labels', () => {
    const enriched = enrichReferenceCitationsByContext(
      [
        {
          claim: '勤務設計の参考',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary: 'Organizations of all sizes can benefit from supporting neurodiversity at work.',
              sample_excerpts: [
                {
                  excerpt:
                    'Flexible working time can help employees manage treatment schedules or energy levels and maintain productivity.',
                },
              ],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
      },
    );

    expect(enriched[0]?.claim).toBe('勤務時間・休憩を調整する具体策');
  });

  it('rewrites coordination-oriented reference claims into a concrete adjustment-process label', () => {
    const enriched = enrichReferenceCitationsByContext(
      [
        {
          claim: '参考資料',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'legal_policy',
              summary:
                'If the employee is facing one or more barriers to their full participation in the workplace, the manager should talk to the employee to find timely solutions that address the barriers.',
              sample_excerpts: [
                {
                  excerpt:
                    'Managers should review functional abilities, restrictions, and possible adjustments with the employee.',
                },
              ],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: '職場との相談をどう進めるか、配慮案の見直し方も知りたい。',
      },
    );

    const detail = enriched[0]?.evidence_details?.[0] as
      | { practice_stage_label?: string; summary?: string }
      | undefined;

    expect(enriched[0]?.claim).toBe('本人と職場で調整案をすり合わせる具体策');
    expect(detail?.practice_stage_label).toBe('対話の軸');
    expect(detail?.summary).toContain('対話で確認:');
    expect(detail?.summary).toContain('障壁・できること・必要な調整');
  });

  it('rewrites review-oriented reference claims into a follow-up label', () => {
    const enriched = enrichReferenceCitationsByContext(
      [
        {
          claim: '参考資料',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'legal_policy',
              summary:
                'Managers should follow-up and review accommodations to evaluate whether the adjustment is working and what should be revised.',
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: '配慮を入れたあと、どの時点で見直すかも整理したい。',
      },
    );

    const detail = enriched[0]?.evidence_details?.[0] as
      | { practice_stage_label?: string; summary?: string }
      | undefined;

    expect(enriched[0]?.claim).toBe('調整後の見直しポイント');
    expect(detail?.practice_stage_label).toBe('見直しの軸');
    expect(detail?.summary).toContain('見直しの観点:');
  });

  it('does not rewrite support catalog citation claims', () => {
    const enriched = enrichReferenceCitationsByContext([
      {
        claim: '地域支援との接続が必要な論点',
        evidence_details: [
          {
            evidence_role: 'support_catalog',
            note_type: 'support_catalog',
            summary: '地域の支援機関と連携して調整を支える。',
            public_safe: false,
          },
        ],
      },
    ]);

    expect(enriched[0]?.claim).toBe('地域支援との接続が必要な論点');
  });

  it('filters abstract organizational process references while keeping concrete coordination references', () => {
    const filtered = filterReferenceCitationsByUsefulness(
      [
        {
          claim: '組織プロセスの一般論',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'employer_guidance',
              summary:
                'An organization creates an efficient and responsive accommodation process through streamlining, building in flexibility, seeking feedback from employees who go through the process, and making continual improvements.',
              source_urls: ['https://askearn.org/page/accommodation-process'],
              page_types: ['employer_guidance_page'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
        {
          claim: '調整の進め方',
          evidence_details: [
            {
              evidence_role: 'related_reading',
              evidence_lane: 'legal_policy',
              summary:
                'If the employee is facing barriers to participation, the manager should talk to the employee to find timely solutions.',
              source_urls: [
                'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/make-informed-decision.html',
              ],
              page_types: ['document'],
              evidence_scopes: ['aggregated_index'],
              public_safe: false,
            },
          ],
        },
      ],
      {
        consultationText: '職場との相談をどう進めるか、配慮案の見直し方も知りたい。',
      },
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.claim).toBe('調整の進め方');
  });

  it('merges reference-only citations that converge on the same practical claim', () => {
    const merged = mergeReferenceCitationsByClaim(
      enrichReferenceCitationsByContext(
        [
          {
            claim: '勤務設計の参考',
            evidence_ids: ['ref-1'],
            evidence_lanes: [{ evidence_id: 'ref-1', lane: 'employer_guidance', label: '雇用主ガイダンス' }],
            evidence_details: [
              {
                evidence_id: 'ref-1',
                evidence_role: 'related_reading',
                evidence_lane: 'employer_guidance',
                summary: 'Flexible working time can help employees manage treatment schedules.',
                source_urls: ['https://example.com/flexible-time'],
                page_types: ['document'],
                evidence_scopes: ['aggregated_index'],
                public_safe: false,
              },
            ],
          },
          {
            claim: '参考資料',
            evidence_ids: ['ref-2'],
            evidence_lanes: [{ evidence_id: 'ref-2', lane: 'employer_guidance', label: '雇用主ガイダンス' }],
            evidence_details: [
              {
                evidence_id: 'ref-2',
                evidence_role: 'related_reading',
                evidence_lane: 'employer_guidance',
                summary: 'Adjust work schedules and breaks to reduce fatigue.',
                source_urls: ['https://example.com/breaks'],
                page_types: ['document'],
                evidence_scopes: ['aggregated_index'],
                public_safe: false,
              },
            ],
          },
        ],
        {
          consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
          selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
        },
      ),
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
      },
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]?.claim).toBe('勤務時間・休憩を調整する具体策');
    expect(merged[0]?.evidence_ids).toEqual(['ref-1', 'ref-2']);
    expect(merged[0]?.evidence_details).toHaveLength(2);
  });
});
