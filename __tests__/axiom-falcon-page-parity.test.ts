import {
  AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS,
  validateAxiomFalconPageParity,
} from '@/lib/axiom/falconAxiomPageParity';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom Falcon page parity', () => {
  it('keeps every Falcon page role represented without downgrading page functions', () => {
    const validation = validateAxiomFalconPageParity();

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_falcon_page_parity_valid',
      errorCount: 0,
    });
    expect(
      new Set(AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS.map((item) => item.surface)),
    ).toEqual(new Set(AXIOM_NEXT_NBL_SITE_SURFACES));
    expect(
      AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS.every((item) =>
        ['preserved', 'replaced_with_axiom_content', 'upgraded_with_axiom_content'].includes(
          item.status,
        ),
      ),
    ).toBe(true);
  });

  it('specifically protects scene, consultation, article, toolkit, and condition-window functions', () => {
    expect(AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          surface: 'scene_entry_use_cases',
          falconRoleId: 'NS-04',
          falconFeature: '4コマ / モデル場面入口',
          status: 'upgraded_with_axiom_content',
        }),
        expect.objectContaining({
          surface: 'consultation_case_reading_collection',
          falconFeature: 'FAQカタログと相談ルート',
        }),
        expect.objectContaining({
          surface: 'article_social_question_library',
          falconFeature: '記事集 / SNS運用ボード',
        }),
        expect.objectContaining({
          surface: 'cognitive_support_toolkit_studio_multimodal_objects',
          falconFeature: '認知補助ツールキット',
        }),
        expect.objectContaining({
          surface: 'work_condition_window',
          falconFeature: '障害種類・疾病名から見る入口',
        }),
      ]),
    );
  });

  it('records that SNS circulation is not a top-level page replacement for scene entry', () => {
    const snsParity = AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS.find((item) =>
      item.falconFeature.includes('SNS'),
    );
    const sceneParity = AXIOM_FALCON_PAGE_PARITY_EXPECTATIONS.find(
      (item) => item.surface === 'scene_entry_use_cases',
    );

    expect(sceneParity).toMatchObject({
      falconRoleId: 'NS-04',
    });
    expect(snsParity?.axiomReplacement).toContain('SNSはトップページ化せず');
  });
});
