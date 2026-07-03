import {
  AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY,
  buildAxiomIntegratedDomainKnowledgePageBodyProjection,
  getAxiomIntegratedDomainKnowledgePageBodyBySurface,
  validateAxiomIntegratedDomainKnowledgePageBodyProjection,
  type AxiomIntegratedDomainKnowledgePageBodyProjection,
} from '@/lib/axiom/integratedDomainKnowledgePageBodyProjection';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneProjection(
  projection: AxiomIntegratedDomainKnowledgePageBodyProjection,
): AxiomIntegratedDomainKnowledgePageBodyProjection {
  return JSON.parse(JSON.stringify(projection)) as AxiomIntegratedDomainKnowledgePageBodyProjection;
}

describe('Axiom integrated domain knowledge page body projection', () => {
  it('projects the Founder-accepted 10 units and 37 substructures into all 9 internal candidate page bodies', () => {
    const projection = buildAxiomIntegratedDomainKnowledgePageBodyProjection();
    const validation = validateAxiomIntegratedDomainKnowledgePageBodyProjection(projection);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_integrated_domain_knowledge_page_body_projection_valid',
      errorCount: 0,
      boundary: AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY,
    });
    expect(projection).toMatchObject({
      objectType: 'axiom_integrated_domain_knowledge_page_body_projection',
      lane: 'Falcon Lab',
      status:
        'internal_next_nbl_candidate_page_bodies_projected_from_founder_accepted_axiom_integrated_domain_knowledge',
      pageBodyCount: 9,
      secondOpinionControlResetApplied: true,
      noNewReviewObjectCreated: true,
    });
    expect(projection.pageBodies.map((pageBody) => pageBody.surface)).toEqual([
      ...AXIOM_NEXT_NBL_SITE_SURFACES,
    ]);
    expect(projection.coverage.representedUnitIds).toHaveLength(10);
    expect(projection.coverage.representedSubstructureIds).toHaveLength(37);
  });

  it('uses the work-design guide as the full 10-unit projection rather than an old 21/27 seed copy', () => {
    const projection = buildAxiomIntegratedDomainKnowledgePageBodyProjection();
    const guide = getAxiomIntegratedDomainKnowledgePageBodyBySurface(
      'twenty_one_views_work_design_guide',
      projection,
    );

    expect(guide).toMatchObject({
      pageHeadingJa: 'Axiom版 仕事設計視点ガイド',
      contentSourceStatus:
        'from_founder_accepted_all_layer_integrated_domain_knowledge_not_l3_direct_copy',
      routeStatus: 'internal_candidate_page_body_projection_not_actual_public_navigation',
      publicCopyReviewStatus:
        'internal_candidate_page_body_projection_public_copy_review_required',
      publicUseStatus: 'not_public_approved',
      publicationStatus: 'not_published',
    });
    expect(guide?.bodySections).toHaveLength(10);
    expect(guide?.sourceSubstructureIds).toHaveLength(37);
    expect(guide?.bodySections.map((section) => section.headingJa)).toEqual(
      expect.arrayContaining([
        '変動する健康時間・仕事密度・回復余地',
        '視覚・聴覚・身体条件を含む情報形式/コミュニケーションアクセス',
        '認知・高次脳・知的障害の手順理解/切替負荷',
        'source lens: 普遍構造候補と制度・時代差ブレーキ',
      ]),
    );
  });

  it('keeps every page internal, public-copy-review-required, and blocked from release movement', () => {
    const projection = buildAxiomIntegratedDomainKnowledgePageBodyProjection();

    for (const pageBody of projection.pageBodies) {
      expect(pageBody.bodySectionCount).toBeGreaterThanOrEqual(4);
      expect(pageBody.contentSourceStatus).toBe(
        'from_founder_accepted_all_layer_integrated_domain_knowledge_not_l3_direct_copy',
      );
      expect(pageBody.routeStatus).toBe(
        'internal_candidate_page_body_projection_not_actual_public_navigation',
      );
      expect(pageBody.publicCopyReviewStatus).toBe(
        'internal_candidate_page_body_projection_public_copy_review_required',
      );
      expect(pageBody.publicUseStatus).toBe('not_public_approved');
      expect(pageBody.publicationStatus).toBe('not_published');
    }
    expect(projection.notNow).toEqual(
      expect.arrayContaining([
        'no_new_gate8_or_final_release_shell_growth',
        'no_new_founder_review_object_before_page_body_projection',
        'no_l3_direct_content_as_axiom_truth',
        'no_actual_public_navigation',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects dropped surfaces, dropped accepted units, dropped substructures, and public movement', () => {
    const projection = cloneProjection(buildAxiomIntegratedDomainKnowledgePageBodyProjection());

    projection.pageBodies = projection.pageBodies.slice(0, 8);
    projection.pageBodyCount = 8 as 9;
    projection.coverage.representedUnitIds = projection.coverage.representedUnitIds.slice(0, 9);
    projection.coverage.representedSubstructureIds =
      projection.coverage.representedSubstructureIds.slice(0, 36);
    projection.secondOpinionControlResetApplied = false as true;
    projection.noNewReviewObjectCreated = false as true;
    projection.pageBodies[0].publicUseStatus = 'public_approved' as 'not_public_approved';
    projection.pageBodies[0].publicationStatus = 'published' as 'not_published';

    const validation = validateAxiomIntegratedDomainKnowledgePageBodyProjection(projection);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'page_body_count_must_be_9',
        'page_body_rows_must_be_9',
        'all_9_surfaces_must_have_page_bodies',
        'all_10_accepted_units_must_be_represented',
        'all_37_accepted_substructures_must_be_represented',
        'second_opinion_control_reset_must_be_applied',
        'projection_must_not_create_new_founder_review_object',
        expect.stringContaining('public_use_status_must_remain_not_approved:'),
        expect.stringContaining('publication_status_must_remain_not_published:'),
      ]),
    );
  });
});
