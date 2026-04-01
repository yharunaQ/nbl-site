import { selectPracticalReferencePreview } from '@/lib/jac/practicalReferenceCatalog';

describe('practical reference catalog', () => {
  it('prefers specific case references and excludes index pages', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'jeed-case',
          sourceId: 'jeed_reference',
          filePath: '/tmp/jeed-case.txt',
          excerpt: '聴覚障害者の製造ライン業務における合理的配慮事例｜危険箇所はランプで知らせる。',
          score: 3.2,
        },
        {
          id: 'askearn-guide',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-guide.txt',
          excerpt: 'Creating a neuroinclusive workplace | Provide written instructions and clear checklists.',
          score: 2.8,
        },
        {
          id: 'jeed-search',
          sourceId: 'jeed_reference',
          filePath: '/tmp/jeed-search.txt',
          excerpt: '検索結果｜障害者雇用事例リファレンスサービス',
          score: 5.5,
        },
      ],
      new Map([
        [
          'jeed-case',
          {
            id: 'jeed-case',
            sourceId: 'jeed_reference',
            filePath: '/workspace/references/web-cache/jeed_reference/case.txt',
            text: '聴覚障害者の製造ライン業務における合理的配慮事例',
            interactionContext: {
              finalUrl: 'https://example.com/jeed-case',
              pageType: 'case_detail',
              evidenceScope: 'specific_case',
            },
          },
        ],
        [
          'askearn-guide',
          {
            id: 'askearn-guide',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/guide.txt',
            text: 'Creating a neuroinclusive workplace',
            interactionContext: {
              finalUrl: 'https://example.com/askearn-guide',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['policy_and_training'],
            },
          },
        ],
        [
          'jeed-search',
          {
            id: 'jeed-search',
            sourceId: 'jeed_reference',
            filePath: '/workspace/references/web-cache/jeed_reference/search.txt',
            text: '検索結果',
            interactionContext: {
              finalUrl: 'https://example.com/jeed-search',
              pageType: 'search_index',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(2);
    expect(preview[0]).toMatchObject({
      id: 'jeed-case',
      category: 'case_example',
      categoryLabel: '類似事例',
    });
    expect(preview[1]).toMatchObject({
      id: 'askearn-guide',
      category: 'practical_guidance',
      categoryLabel: '実践ガイダンス',
    });
    expect(preview.map((item) => item.id)).not.toContain('jeed-search');
  });

  it('filters low-value event or admin pages and prefers action-oriented guidance', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'jobaccess-guide',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-guide.txt',
          excerpt:
            'Changes to work methods and tasks could include: written instructions, task lists, labels or reminders to support memory or comprehension.',
          score: 2.4,
        },
        {
          id: 'jobaccess-event',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-event.txt',
          excerpt:
            'How to join an event If you’re interested in joining an event, you can email jobs-ndrc@genu.org.au.',
          score: 4.9,
        },
        {
          id: 'gov-feedback',
          sourceId: 'uk_gov_disability_employment',
          filePath: '/tmp/gov-feedback.txt',
          excerpt:
            'Maybe Yes this page is useful No this page is not useful Thank you for your feedback Report a problem with this page.',
          score: 4.7,
        },
        {
          id: 'askearn-newsletter',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-newsletter.txt',
          excerpt:
            'Start by subscribing to our monthly newsletter and eblasts, which will connect you to upcoming events, developing news and promising practices in the world of disability.',
          score: 5.1,
        },
        {
          id: 'jobaccess-save',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-save.txt',
          excerpt:
            'Save Flexible working arrangements Find out about: types of flexible arrangements working from home agreeing to changes with your employer.',
          score: 4.8,
        },
      ],
      new Map([
        [
          'jobaccess-guide',
          {
            id: 'jobaccess-guide',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/guide.txt',
            text: 'Changes to work methods and tasks could include: written instructions, task lists, labels or reminders to support memory or comprehension.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-an-employer/know-rights-responsibilities/guidelines-reasonable-adjustment',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['task_redesign', 'communication_support'],
            },
          },
        ],
        [
          'jobaccess-event',
          {
            id: 'jobaccess-event',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/event.txt',
            text: 'How to join an event If you’re interested in joining an event, you can email jobs-ndrc@genu.org.au.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-an-employer/hire-someone-disability/help-recruit-and-hire-people/free-events-employment',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'gov-feedback',
          {
            id: 'gov-feedback',
            sourceId: 'uk_gov_disability_employment',
            filePath: '/workspace/references/web-cache/gov/feedback.txt',
            text: 'Maybe Yes this page is useful No this page is not useful Thank you for your feedback Report a problem with this page.',
            interactionContext: {
              finalUrl: 'https://www.gov.uk/access-to-work/claiming-from-your-grant',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'askearn-newsletter',
          {
            id: 'askearn-newsletter',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/newsletter.txt',
            text:
              'Start by subscribing to our monthly newsletter and eblasts, which will connect you to upcoming events, developing news and promising practices in the world of disability.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/earn-newsletter-march-2026',
              pageType: 'employer_publication',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'jobaccess-save',
          {
            id: 'jobaccess-save',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/save.txt',
            text:
              'Save Flexible working arrangements Find out about: types of flexible arrangements working from home agreeing to changes with your employer.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview.map((item) => item.id)).not.toContain('askearn-newsletter');
    expect(preview.map((item) => item.id)).not.toContain('jobaccess-save');
    expect(preview[0]).toMatchObject({
      id: 'jobaccess-guide',
      category: 'practical_guidance',
    });
    expect(preview[0].summary).toContain('手順を文書化');
  });

  it('filters abstract legal-risk or recourse guidance when practical coordination content is available', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askearn-legal-risk',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-legal-risk.txt',
          excerpt:
            'An effective process will also reduce employers’ exposure to legal risk and support compliance with equal opportunity laws and regulations.',
          score: 4.8,
        },
        {
          id: 'canada-recourse',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-recourse.txt',
          excerpt:
            'Represented employees may consult with their union to explore the recourse mechanisms open to them filing a complaint with the Canadian Human Rights Commission.',
          score: 4.5,
        },
        {
          id: 'canada-dialogue',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-dialogue.txt',
          excerpt:
            'If the employee is facing one or more barriers to their full participation in the workplace, the manager should talk to the employee to find timely solutions that address the barriers.',
          score: 2.8,
        },
      ],
      new Map([
        [
          'askearn-legal-risk',
          {
            id: 'askearn-legal-risk',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/legal-risk.txt',
            text: 'An effective process will also reduce employers’ exposure to legal risk and support compliance with equal opportunity laws and regulations.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/accommodation-process',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'canada-recourse',
          {
            id: 'canada-recourse',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/recourse.txt',
            text: 'Represented employees may consult with their union to explore the recourse mechanisms open to them filing a complaint with the Canadian Human Rights Commission.',
            interactionContext: {
              finalUrl:
                'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/implement-decision.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'canada-dialogue',
          {
            id: 'canada-dialogue',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/dialogue.txt',
            text: 'If the employee is facing one or more barriers to their full participation in the workplace, the manager should talk to the employee to find timely solutions that address the barriers.',
            interactionContext: {
              finalUrl:
                'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/make-informed-decision.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.id).toBe('canada-dialogue');
    expect(preview[0]?.summary).toContain('障壁・できること・必要な調整');
  });

  it('filters generic learning-center and external-link guidance when practical lines are available', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askearn-learning-center',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-learning-center.txt',
          excerpt:
            'Learning Center Employers who want to hire and retain the best talent know the value of creating a workplace that welcomes all workers, including those with disabilities.',
          score: 4.6,
        },
        {
          id: 'uk-ehrc-link',
          sourceId: 'uk_gov_disability_employment',
          filePath: '/tmp/uk-ehrc-link.txt',
          excerpt:
            'There’s more detail about employers’ obligations and how to meet them on the Equality and Human Rights Commission website.',
          score: 4.2,
        },
        {
          id: 'jobaccess-practical-line',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-practical-line.txt',
          excerpt:
            'Changes to work methods and tasks could include written instructions, task lists, labels or reminders to support memory or comprehension.',
          score: 2.3,
        },
      ],
      new Map([
        [
          'askearn-learning-center',
          {
            id: 'askearn-learning-center',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/learning-center.txt',
            text: 'Learning Center Employers who want to hire and retain the best talent know the value of creating a workplace that welcomes all workers, including those with disabilities.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/some-learning-center-guide',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'uk-ehrc-link',
          {
            id: 'uk-ehrc-link',
            sourceId: 'uk_gov_disability_employment',
            filePath: '/workspace/references/web-cache/gov/ehrc-link.txt',
            text: 'There’s more detail about employers’ obligations and how to meet them on the Equality and Human Rights Commission website.',
            interactionContext: {
              finalUrl: 'https://www.gov.uk/reasonable-adjustments-for-disabled-workers',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'jobaccess-practical-line',
          {
            id: 'jobaccess-practical-line',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/practical-line.txt',
            text: 'Changes to work methods and tasks could include written instructions, task lists, labels or reminders to support memory or comprehension.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-an-employer/know-rights-responsibilities/guidelines-reasonable-adjustment',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['task_redesign'],
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.id).toBe('jobaccess-practical-line');
    expect(preview[0]?.summary).toContain('手順を文書化');
  });

  it('filters source-family governance guidance when the consultation context does not match', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askearn-ict-governance',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-ict-governance.txt',
          excerpt:
            'Evaluating accessibility by testing ICT applications with automated accessibility testing tools and by considering the user experience of applicants, employees, and customers.',
          score: 4.9,
        },
        {
          id: 'jobaccess-schedule',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-schedule.txt',
          excerpt:
            'Flexible working time can help employees manage treatment schedules or energy levels and maintain productivity.',
          score: 2.2,
        },
      ],
      new Map([
        [
          'askearn-ict-governance',
          {
            id: 'askearn-ict-governance',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/ict-governance.txt',
            text: 'Evaluating accessibility by testing ICT applications with automated accessibility testing tools and by considering the user experience of applicants, employees, and customers.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/be-tech-savvy-accessible-information-and-communication-technology',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'jobaccess-schedule',
          {
            id: 'jobaccess-schedule',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/schedule.txt',
            text: 'Flexible working time can help employees manage treatment schedules or energy levels and maintain productivity.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job/flexible-working-arrangements',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
      ]),
      4,
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）'],
      },
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.id).toBe('jobaccess-schedule');
    expect(preview[0]?.summary).toContain('勤務時間や休憩');
  });

  it('boosts references that match the current consultation context', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'general-guide',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/general-guide.txt',
          excerpt: 'Create a supportive workplace culture and review policies regularly.',
          score: 4.8,
        },
        {
          id: 'schedule-guide',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/schedule-guide.txt',
          excerpt:
            'Flexible working time can help employees manage treatment schedules or energy levels and maintain productivity.',
          score: 2.3,
        },
      ],
      new Map([
        [
          'general-guide',
          {
            id: 'general-guide',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/general.txt',
            text: 'Create a supportive workplace culture and review policies regularly.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/supportive-business-culture',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['policy_and_training'],
            },
          },
        ],
        [
          'schedule-guide',
          {
            id: 'schedule-guide',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/flexible-time.txt',
            text: 'Flexible working time can help employees manage treatment schedules or energy levels and maintain productivity.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job/flexible-working-arrangements',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
      ]),
      4,
      {
        consultationText: 'フルタイム勤務だと疲労が強く、治療スケジュールとの両立が難しい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）', '疲労・倦怠（慢性疲労含む）'],
      },
    );

    expect(preview[0]).toMatchObject({
      id: 'schedule-guide',
      category: 'practical_guidance',
    });
    expect(preview[0].whyRelevant).toContain('勤務時間・疲労の調整');
  });

  it('prefers canonicalized Japanese practical fields when they are available', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'canada-canonical',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-canonical.txt',
          excerpt:
            'Accommodation process and review process with the employee and manager.',
          score: 1.8,
        },
      ],
      new Map([
        [
          'canada-canonical',
          {
            id: 'canada-canonical',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/canonical.txt',
            text: 'Accommodation process and review process with the employee and manager.',
            interactionContext: {
              finalUrl:
                'https://www.canada.ca/en/government/publicservice/example/accommodation.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              practicalTitleJa: '相談・合意・見直しを整理する対話ガイド',
              practicalSummaryJa:
                '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。',
              usageFocus: 'dialogue',
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]).toMatchObject({
      id: 'canada-canonical',
      title: '相談・合意・見直しを整理する対話ガイド',
      summary: '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。',
      usageFocus: 'dialogue',
      usageFocusLabel: '対話の軸',
    });
    expect(preview[0].whyRelevant).toContain('合意文書');
  });

  it('prefers concrete coordination guidance over abstract organizational process pages', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askearn-process',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-process.txt',
          excerpt:
            'An organization creates an efficient and responsive accommodation process through streamlining, building in flexibility, seeking feedback from employees who go through the process, and making continual improvements.',
          score: 4.9,
        },
        {
          id: 'canada-coordination',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-coordination.txt',
          excerpt:
            'If the employee is facing one or more barriers to their full participation in the workplace, the manager should talk to the employee to find timely solutions that address the barriers.',
          score: 2.6,
        },
      ],
      new Map([
        [
          'askearn-process',
          {
            id: 'askearn-process',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/process.txt',
            text: 'An organization creates an efficient and responsive accommodation process through streamlining, building in flexibility, seeking feedback from employees who go through the process, and making continual improvements.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/accommodation-process',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['policy_and_training'],
            },
          },
        ],
        [
          'canada-coordination',
          {
            id: 'canada-coordination',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/coordination.txt',
            text: 'If the employee is facing one or more barriers to their full participation in the workplace, the manager should talk to the employee to find timely solutions that address the barriers.',
            interactionContext: {
              finalUrl:
                'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/make-informed-decision.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
      ]),
      4,
      {
        consultationText: '職場との相談をどう進めるか、配慮案の見直し方も知りたい。',
      },
    );

    expect(preview[0]?.id).toBe('canada-coordination');
    expect(preview[0]?.summary).toContain('障壁・できること・必要な調整');
    expect(preview[0]?.usageFocusLabel).toBe('対話の軸');
    expect(preview[0]?.whyRelevant).toContain('本人と職場の調整プロセス');
  });

  it('skips generic portal, print, and duplicated multilingual reference urls', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'uk-print',
          sourceId: 'uk_gov_disability_employment',
          filePath: '/tmp/uk-print.txt',
          excerpt: 'Access to Work print page',
          score: 5,
        },
        {
          id: 'canada-portal',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-portal.txt',
          excerpt: 'Diversity and inclusion in the public service',
          score: 4.5,
        },
        {
          id: 'eu-multilingual',
          sourceId: 'eu_reasonable_accommodation',
          filePath: '/tmp/eu-multi.txt',
          excerpt: 'Angemessene Vorkehrungen am Arbeitsplatz',
          score: 4.2,
        },
        {
          id: 'jobaccess-keep',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-keep.txt',
          excerpt:
            'Changes to work methods and tasks could include written instructions and task lists.',
          score: 2.1,
        },
      ],
      new Map([
        [
          'uk-print',
          {
            id: 'uk-print',
            sourceId: 'uk_gov_disability_employment',
            filePath: '/workspace/references/web-cache/gov/print.txt',
            text: 'Access to Work print page',
            interactionContext: {
              finalUrl: 'https://www.gov.uk/access-to-work/print',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'canada-portal',
          {
            id: 'canada-portal',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/portal.txt',
            text: 'Diversity and inclusion in the public service',
            interactionContext: {
              finalUrl:
                'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'eu-multilingual',
          {
            id: 'eu-multilingual',
            sourceId: 'eu_reasonable_accommodation',
            filePath: '/workspace/references/web-cache/eu/multi.txt',
            text: 'Angemessene Vorkehrungen am Arbeitsplatz',
            interactionContext: {
              finalUrl: 'https://op.europa.eu/webpub/empl/reasonable-accommodation-at-work/de/',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'jobaccess-keep',
          {
            id: 'jobaccess-keep',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/keep.txt',
            text: 'Changes to work methods and tasks could include written instructions and task lists.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-an-employer/know-rights-responsibilities/guidelines-reasonable-adjustment',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['task_redesign'],
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.id).toBe('jobaccess-keep');
  });

  it('skips generic toolkit and grant-admin urls even when they rank highly', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askearn-toolkit',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-toolkit.txt',
          excerpt:
            'EARN’s Workplace Mental Health Toolkit provides employers with the knowledge, skills, and resources necessary to create a supportive work atmosphere.',
          score: 5.2,
        },
        {
          id: 'gov-apply',
          sourceId: 'uk_gov_disability_employment',
          filePath: '/tmp/gov-apply.txt',
          excerpt: 'You’ll need a letter confirming your grant has been approved before you can claim.',
          score: 5.1,
        },
        {
          id: 'jobaccess-practical',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-practical.txt',
          excerpt: 'Changes to work methods and tasks could include written instructions and task lists.',
          score: 2.2,
        },
      ],
      new Map([
        [
          'askearn-toolkit',
          {
            id: 'askearn-toolkit',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/toolkit.txt',
            text: 'EARN’s Workplace Mental Health Toolkit provides employers with the knowledge, skills, and resources necessary to create a supportive work atmosphere.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/mental-health-toolkit',
              pageType: 'employer_toolkit',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['policy_and_training'],
            },
          },
        ],
        [
          'gov-apply',
          {
            id: 'gov-apply',
            sourceId: 'uk_gov_disability_employment',
            filePath: '/workspace/references/web-cache/gov/apply.txt',
            text: 'You’ll need a letter confirming your grant has been approved before you can claim.',
            interactionContext: {
              finalUrl: 'https://www.gov.uk/access-to-work/claiming-from-your-grant',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'jobaccess-practical',
          {
            id: 'jobaccess-practical',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/practical.txt',
            text: 'Changes to work methods and tasks could include written instructions and task lists.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-an-employer/know-rights-responsibilities/guidelines-reasonable-adjustment',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['task_redesign'],
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.id).toBe('jobaccess-practical');
  });

  it('skips generic source-family landing pages while keeping concrete adjustment guides', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askearn-small-business',
          sourceId: 'askearn_employer_guidance',
          filePath: '/tmp/askearn-small-business.txt',
          excerpt: 'Learning Center The purpose of this toolkit is to help small businesses build their talent pipeline.',
          score: 5.3,
        },
        {
          id: 'gov-eligibility',
          sourceId: 'uk_gov_disability_employment',
          filePath: '/tmp/gov-eligibility.txt',
          excerpt: 'Your disability, illness or health condition You must have a condition that means you need support to do your job.',
          score: 5.1,
        },
        {
          id: 'germany-general',
          sourceId: 'germany_antidiscrimination_work',
          filePath: '/tmp/germany-general.txt',
          excerpt: 'Dazu gehört Förderung der sozialen Kompetenz – etwa durch ein Training sozialer und kommunikativer Fähigkeiten.',
          score: 4.9,
        },
        {
          id: 'jobaccess-keep',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-keep-2.txt',
          excerpt:
            'Changes to work methods and tasks could include written instructions and task lists.',
          score: 2.2,
        },
      ],
      new Map([
        [
          'askearn-small-business',
          {
            id: 'askearn-small-business',
            sourceId: 'askearn_employer_guidance',
            filePath: '/workspace/references/web-cache/askearn/small-business.txt',
            text: 'Learning Center The purpose of this toolkit is to help small businesses build their talent pipeline.',
            interactionContext: {
              finalUrl: 'https://askearn.org/page/small-business-toolkit',
              pageType: 'employer_toolkit',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'gov-eligibility',
          {
            id: 'gov-eligibility',
            sourceId: 'uk_gov_disability_employment',
            filePath: '/workspace/references/web-cache/gov/eligibility.txt',
            text: 'Your disability, illness or health condition You must have a condition that means you need support to do your job.',
            interactionContext: {
              finalUrl: 'https://www.gov.uk/access-to-work/eligibility',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'germany-general',
          {
            id: 'germany-general',
            sourceId: 'germany_antidiscrimination_work',
            filePath: '/workspace/references/web-cache/germany/general.txt',
            text: 'Dazu gehört Förderung der sozialen Kompetenz – etwa durch ein Training sozialer und kommunikativer Fähigkeiten.',
            interactionContext: {
              finalUrl:
                'https://www.bmas.de/DE/Soziales/Teilhabe-und-Inklusion/Politik-fuer-Menschen-mit-Behinderungen/Formen-der-Hilfe-fuer-Menschen-mit-Behinderungen/formen-der-hilfe-fuer-menschen-mit-behinderungen.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
            },
          },
        ],
        [
          'jobaccess-keep',
          {
            id: 'jobaccess-keep',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/keep-2.txt',
            text: 'Changes to work methods and tasks could include written instructions and task lists.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-an-employer/know-rights-responsibilities/guidelines-reasonable-adjustment',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['task_redesign'],
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.id).toBe('jobaccess-keep');
  });

  it('derives clean preview titles from askjan pages even when excerpt text is navigation-heavy', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askjan-sitting',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan-sitting.txt',
          excerpt: 'Employer Live Chat Home',
          score: 3.4,
        },
      ],
      new Map([
        [
          'askjan-sitting',
          {
            id: 'askjan-sitting',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/sitting.txt',
            text: 'Sitting Close Menu Close For Employers For Individuals For Others Toolkit ADA Library A to Z Lists Situations & Solutions Finder Publications & Articles.',
            interactionContext: {
              finalUrl: 'https://askjan.org/limitations/Sitting.cfm',
              pageType: 'case_guide',
              evidenceScope: 'specific_case',
              accommodationFacets: ['task_redesign'],
            },
          },
        ],
      ]),
      4,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0]?.title).toBe('Sitting');
    expect(preview[0]?.title).not.toMatch(/Employer Live Chat Home|Close Menu/i);
  });

  it('keeps preview diverse across sources when multiple relevant families are available', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askjan-sitting',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan-sitting.txt',
          excerpt: 'Sitting Close Menu Close For Employers',
          score: 4.8,
        },
        {
          id: 'askjan-sleep',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan-sleep.txt',
          excerpt: 'Sleeping/Stay Awake Close Menu Close For Employers',
          score: 4.5,
        },
        {
          id: 'jobaccess-flex',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-flex.txt',
          excerpt:
            'Flexible working arrangements can help employees manage treatment schedules or energy levels and maintain productivity.',
          score: 2.5,
        },
        {
          id: 'canada-dialogue',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-dialogue.txt',
          excerpt:
            'Managers should talk to the employee to find timely solutions that address barriers to participation.',
          score: 2.2,
        },
      ],
      new Map([
        [
          'askjan-sitting',
          {
            id: 'askjan-sitting',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/sitting.txt',
            text: 'Sitting Close Menu Close For Employers For Individuals For Others Toolkit ADA Library A to Z Lists.',
            interactionContext: {
              finalUrl: 'https://askjan.org/limitations/Sitting.cfm',
              pageType: 'case_guide',
              evidenceScope: 'specific_case',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
        [
          'askjan-sleep',
          {
            id: 'askjan-sleep',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/sleep.txt',
            text: 'Sleeping/Stay Awake Close Menu Close For Employers For Individuals For Others Toolkit ADA Library A to Z Lists.',
            interactionContext: {
              finalUrl: 'https://askjan.org/limitations/Sleeping-Stay-Awake.cfm',
              pageType: 'case_guide',
              evidenceScope: 'specific_case',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
        [
          'jobaccess-flex',
          {
            id: 'jobaccess-flex',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/flexible.txt',
            text: 'Flexible working arrangements can help employees manage treatment schedules or energy levels and maintain productivity.',
            interactionContext: {
              finalUrl:
                'https://jobaccess.gov.au/i-am-a-person-with-disability/working-or-about-start-work/getting-started-new-job/flexible-working-arrangements',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
        [
          'canada-dialogue',
          {
            id: 'canada-dialogue',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/dialogue.txt',
            text: 'Managers should talk to the employee to find timely solutions that address barriers to participation.',
            interactionContext: {
              finalUrl:
                'https://www.canada.ca/en/government/publicservice/wellness-inclusion-diversity-public-service/diversity-inclusion-public-service/working-government-canada-duty-accommodate-right-non-discrimination/duty-accommodate-general-process-managers/make-informed-decision.html',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['communication_support'],
            },
          },
        ],
      ]),
      3,
      {
        consultationText: 'フルタイム勤務だと疲労が強く、通院と両立するため勤務時間や休憩を調整したい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）', '疲労・倦怠（慢性疲労含む）'],
      },
    );

    expect(preview).toHaveLength(3);
    expect(preview.slice(0, 3).map((item) => item.sourceId)).toEqual([
      'askjan_website',
      'australia_jobaccess_guidance',
      'canada_duty_to_accommodate',
    ]);
  });

  it('backfills relevant website guidance even when evidence hits are JEED-heavy', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'jeed-case',
          sourceId: 'jeed_reference',
          filePath: '/tmp/jeed-case.txt',
          excerpt: '短時間勤務の事例。休憩を増やし、業務量を調整した。',
          score: 8.1,
        },
      ],
      new Map([
        [
          'jeed-case',
          {
            id: 'jeed-case',
            sourceId: 'jeed_reference',
            filePath: '/workspace/references/web-cache/jeed_reference/case.txt',
            text: '短時間勤務の事例。休憩を増やし、業務量を調整した。',
            interactionContext: {
              finalUrl: 'https://example.com/jeed-case',
              pageType: 'case_detail',
              evidenceScope: 'specific_case',
            },
          },
        ],
        [
          'askjan-guide',
          {
            id: 'askjan-guide',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/guide.txt',
            text:
              'Flexible schedules, modified break schedules, and adjusted start times can support employees whose fatigue and treatment schedules vary over time.',
            interactionContext: {
              finalUrl: 'https://example.com/askjan-guide',
              pageType: 'employer_guidance_page',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
        [
          'jobaccess-guide',
          {
            id: 'jobaccess-guide',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/guide.txt',
            text:
              'Flexible working arrangements can include altered start times, shorter shifts, and additional breaks so that fatigue can be managed at work.',
            interactionContext: {
              finalUrl: 'https://example.com/jobaccess-guide',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
      ]),
      4,
      {
        consultationText: 'フルタイム勤務だと疲労が強く、通院もあるので勤務時間や休憩を調整したい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）', '疲労・倦怠（慢性疲労含む）'],
      },
    );

    expect(preview.length).toBeGreaterThanOrEqual(3);
    expect(preview.map((item) => item.sourceId)).toContain('askjan_website');
    expect(preview.map((item) => item.sourceId)).toContain('australia_jobaccess_guidance');
  });

  it('keeps overseas guidance visible instead of letting JEED dominate the preview', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'jeed-case-1',
          sourceId: 'jeed_reference',
          filePath: '/tmp/jeed-case-1.txt',
          excerpt: '短時間勤務と休憩調整の事例。',
          score: 9.8,
        },
        {
          id: 'jeed-case-2',
          sourceId: 'jeed_reference',
          filePath: '/tmp/jeed-case-2.txt',
          excerpt: '勤務日数を減らした事例。',
          score: 9.2,
        },
        {
          id: 'askjan-case',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan-case.txt',
          excerpt: 'Flexible schedules and planned breaks can reduce fatigue.',
          score: 6.8,
        },
        {
          id: 'jobaccess-guide',
          sourceId: 'australia_jobaccess_guidance',
          filePath: '/tmp/jobaccess-guide.txt',
          excerpt: 'Flexible working arrangements can include altered start times and additional breaks.',
          score: 5.9,
        },
        {
          id: 'canada-guide',
          sourceId: 'canada_duty_to_accommodate',
          filePath: '/tmp/canada-guide.txt',
          excerpt: 'Managers should gather relevant information with the employee before deciding on adjustments.',
          score: 5.4,
        },
      ],
      new Map([
        [
          'jeed-case-1',
          {
            id: 'jeed-case-1',
            sourceId: 'jeed_reference',
            filePath: '/workspace/references/web-cache/jeed_reference/case-1.txt',
            text: '短時間勤務と休憩調整の事例。',
            interactionContext: {
              finalUrl: 'https://example.com/jeed-case-1',
              pageType: 'case_detail',
              evidenceScope: 'specific_case',
            },
          },
        ],
        [
          'jeed-case-2',
          {
            id: 'jeed-case-2',
            sourceId: 'jeed_reference',
            filePath: '/workspace/references/web-cache/jeed_reference/case-2.txt',
            text: '勤務日数を減らした事例。',
            interactionContext: {
              finalUrl: 'https://example.com/jeed-case-2',
              pageType: 'case_detail',
              evidenceScope: 'specific_case',
            },
          },
        ],
        [
          'askjan-case',
          {
            id: 'askjan-case',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/case.txt',
            text:
              'Flexible schedules, altered start times, and planned breaks can support employees whose fatigue changes across the week.',
            interactionContext: {
              finalUrl: 'https://example.com/askjan-case',
              pageType: 'case_guide',
              evidenceScope: 'specific_case',
              accommodationFacets: ['schedule_flexibility'],
            },
          },
        ],
        [
          'jobaccess-guide',
          {
            id: 'jobaccess-guide',
            sourceId: 'australia_jobaccess_guidance',
            filePath: '/workspace/references/web-cache/jobaccess/guide.txt',
            text:
              'Flexible working arrangements can include altered start times and additional breaks so that treatment schedules and fatigue can be managed at work.',
            interactionContext: {
              finalUrl: 'https://example.com/jobaccess-guide',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['schedule_flexibility'],
              practicalTitleJa: '勤務時間・休憩・治療スケジュールを整理する対話ガイド',
              practicalSummaryJa:
                '対話で確認: 勤務時間・休憩・通院との両立でどこに負担が出るかを、本人と職場で整理する。',
              usageFocus: 'dialogue',
            },
          },
        ],
        [
          'canada-guide',
          {
            id: 'canada-guide',
            sourceId: 'canada_duty_to_accommodate',
            filePath: '/workspace/references/web-cache/canada/guide.txt',
            text:
              'Managers should gather relevant information with the employee before deciding on adjustments to hours, tasks, or attendance expectations.',
            interactionContext: {
              finalUrl: 'https://example.com/canada-guide',
              pageType: 'document',
              evidenceScope: 'aggregated_index',
              accommodationFacets: ['communication_support', 'schedule_flexibility'],
              practicalTitleJa: '相談・合意・見直しを整理する対話ガイド',
              practicalSummaryJa:
                '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。',
              usageFocus: 'dialogue',
            },
          },
        ],
      ]),
      4,
      {
        consultationText: 'フルタイム勤務だと疲労が強く、通院と両立するため勤務時間や休憩を調整したい。',
        selectedTags: ['勤務時間・勤務日数（フルタイム/短時間）', '疲労・倦怠（慢性疲労含む）'],
        followUpAnswers: ['休憩の取り方と通院日の勤務時間も見直したい。'],
      },
    );

    expect(preview).toHaveLength(4);
    expect(new Set(preview.map((item) => item.sourceId)).size).toBe(4);
    expect(preview.filter((item) => item.sourceId !== 'jeed_reference')).toHaveLength(3);
    expect(preview.map((item) => item.sourceId)).toEqual(
      expect.arrayContaining([
        'askjan_website',
        'australia_jobaccess_guidance',
        'canada_duty_to_accommodate',
      ]),
    );
  });

  it('collapses same-source duplicate practical titles even when urls differ', () => {
    const preview = selectPracticalReferencePreview(
      [
        {
          id: 'askjan-case-1',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan-case-1.txt',
          excerpt: 'Cancer and fatigue case | Flexible schedule and rest breaks.',
          score: 5.6,
        },
        {
          id: 'askjan-case-2',
          sourceId: 'askjan_website',
          filePath: '/tmp/askjan-case-2.txt',
          excerpt: 'Long COVID and fatigue case | Adjust work hours and plan rest breaks.',
          score: 5.4,
        },
      ],
      new Map([
        [
          'askjan-case-1',
          {
            id: 'askjan-case-1',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/case1.txt',
            text: 'Cancer and fatigue case',
            interactionContext: {
              finalUrl: 'https://askjan.example/case1',
              pageType: 'case_detail',
              evidenceScope: 'specific_case',
              practicalTitleJa: '勤務時間・休憩・治療スケジュールの類似事例',
              practicalSummaryJa:
                '試し方の例: 勤務時間や休憩を、疲労や治療スケジュールに合わせて調整する。',
              usageFocus: 'trial',
            },
          },
        ],
        [
          'askjan-case-2',
          {
            id: 'askjan-case-2',
            sourceId: 'askjan_website',
            filePath: '/workspace/references/web-cache/askjan/case2.txt',
            text: 'Long COVID and fatigue case',
            interactionContext: {
              finalUrl: 'https://askjan.example/case2',
              pageType: 'case_detail',
              evidenceScope: 'specific_case',
              practicalTitleJa: '勤務時間・休憩・治療スケジュールの類似事例',
              practicalSummaryJa:
                '試し方の例: 勤務時間や休憩を、疲労や治療スケジュールに合わせて調整する。',
              usageFocus: 'trial',
            },
          },
        ],
      ]),
      4,
      {
        consultationText: '通院があり、午後に疲労が強くなる。',
        selectedAccommodationTitles: ['通院・治療スケジュールへの配慮'],
      },
    );

    expect(preview).toHaveLength(1);
    expect(preview[0].title).toBe('勤務時間・休憩・治療スケジュールの類似事例');
    expect(preview[0].sourceId).toBe('askjan_website');
  });
});
