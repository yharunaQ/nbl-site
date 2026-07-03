import {
  AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY,
  AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
  buildFalconAxiomPublicSiteUpdatePlan,
  getFalconAxiomPublicSiteUpdatePlanRowBySurface,
  validateFalconAxiomPublicSiteUpdatePlan,
  type FalconAxiomPublicSiteUpdatePlan,
} from '@/lib/axiom/falconAxiomPublicSiteUpdatePlan';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePlan(plan: FalconAxiomPublicSiteUpdatePlan): FalconAxiomPublicSiteUpdatePlan {
  return JSON.parse(JSON.stringify(plan)) as FalconAxiomPublicSiteUpdatePlan;
}

describe('Falcon to Axiom public site update plan', () => {
  it('maps Falcon final site roles to all 9 Axiom public-candidate surfaces', () => {
    const plan = buildFalconAxiomPublicSiteUpdatePlan();
    const validation = validateFalconAxiomPublicSiteUpdatePlan(plan);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'falcon_axiom_public_site_update_plan_valid',
      errorCount: 0,
      boundary: AXIOM_FALCON_AXIOM_PUBLIC_SITE_UPDATE_PLAN_BOUNDARY,
    });
    expect(plan).toMatchObject({
      objectType: 'falcon_axiom_public_site_update_plan',
      lane: 'Falcon Lab',
      status: 'falcon_final_site_scaffold_axiom_kernel_content_update_plan_ready',
      routeBase: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
      surfaceCount: 9,
    });
    expect(plan.rows.map((row) => row.surface)).toEqual([...AXIOM_NEXT_NBL_SITE_SURFACES]);
    expect(plan.rows.map((row) => row.falconPageRoleId)).toEqual([
      'NS-01',
      'NS-04',
      'NS-02',
      'NS-03',
      'NS-05',
      'NS-06',
      'NS-09',
      'NS-07',
      'NS-08',
    ]);
  });

  it('preserves Falcon page purpose and layout as delivery scaffold while replacing concrete content with accepted Axiom integrated knowledge', () => {
    const plan = buildFalconAxiomPublicSiteUpdatePlan();
    const home = getFalconAxiomPublicSiteUpdatePlanRowBySurface('reader_facing_top_home', plan);
    const guide = getFalconAxiomPublicSiteUpdatePlanRowBySurface(
      'twenty_one_views_work_design_guide',
      plan,
    );
    const scene = getFalconAxiomPublicSiteUpdatePlanRowBySurface(
      'scene_entry_use_cases',
      plan,
    );
    const toolkit = getFalconAxiomPublicSiteUpdatePlanRowBySurface(
      'cognitive_support_toolkit_studio_multimodal_objects',
      plan,
    );

    expect(home).toMatchObject({
      falconPageRoleId: 'NS-01',
      falconContextLabelJa: 'NBLトップページ',
      updateMode:
        'replace_falcon_copy_with_axiom_kernel_backed_content_preserve_public_site_role_and_layout',
      falconUsePolicy:
        'falcon_final_site_role_layout_and_visual_rhythm_are_delivery_scaffold_not_axiom_core_truth',
      axiomContentSource:
        'founder_accepted_all_layer_integrated_domain_knowledge_page_body_projection',
    });
    expect(home?.inheritedFalconLayoutModules).toEqual(
      expect.arrayContaining([
        'public_shell_header_navigation',
        'hero_visual_with_action_pair',
        'home_reader_path_product_map',
        'problem_promise_not_this_context_strip',
      ]),
    );
    expect(guide).toMatchObject({
      falconPageRoleId: 'NS-03',
      falconPageRoleJa: '未来の仕事・社会参加設計ガイド',
      navLabelJa: '設計ガイド',
      falconContextLabelJa: '未来の仕事・社会参加設計ガイド',
      promiseJa:
        'Founderレビュー済みの統合知識を、仕事・社会参加設計のマスタープランと状況レベルに再編集する。',
    });
    expect(scene).toMatchObject({
      falconPageRoleId: 'NS-04',
      falconPageRoleJa: '8つの課題',
      navLabelJa: '8つの課題',
    });
    expect(scene?.inheritedFalconLayoutModules).toEqual(
      expect.arrayContaining(['scene_comic_use_case_panel']),
    );
    expect(toolkit).toMatchObject({
      falconPageRoleId: 'NS-06',
      falconPageRoleJa: '認知補助ツールキット',
    });

    for (const row of plan.rows) {
      expect(row.inheritedFalconLayoutModules).toEqual(
        expect.arrayContaining([
          'hero_visual_with_action_pair',
          'surface_specific_content_body',
        ]),
      );
      expect(
        row.inheritedFalconLayoutModules.some((module) =>
          [
            'problem_promise_not_this_context_strip',
            'progressive_context_disclosure',
            'scene_comic_use_case_panel',
            'full_boundary_explanation_zone',
          ].includes(module),
        ),
      ).toBe(true);
      expect(row.axiomContentUpdateModules).toEqual(
        expect.arrayContaining([
          'page_heading_from_accepted_integrated_domain_knowledge',
          'opening_thesis_from_accepted_integrated_domain_knowledge',
          'body_sections_from_10_units_37_substructures',
          'public_copy_review_prompts_from_projection_boundary',
        ]),
      );
    }
  });

  it('keeps the update plan internal and blocks public/runtime/learning movement', () => {
    const plan = buildFalconAxiomPublicSiteUpdatePlan();

    for (const row of plan.rows) {
      expect(row.path).toMatch(/^\/internal\/axiom-next-nbl-public-candidate\//);
      expect(row.routeStatus).toBe('internal_candidate_route_created_not_actual_public_navigation');
      expect(row.publicNavigationStatus).toBe('not_public_navigation');
      expect(row.publicUseStatus).toBe('not_public_approved');
      expect(row.publicationStatus).toBe('not_published');
    }
    expect(plan.notNow).toEqual(
      expect.arrayContaining([
        'no_falcon_public_copy_as_axiom_core_truth',
        'no_actual_public_navigation',
        'no_public_approval_or_publication_execution',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects update plans that lose layout/content mapping or drift into publication', () => {
    const plan = clonePlan(buildFalconAxiomPublicSiteUpdatePlan());

    plan.rows = plan.rows.slice(0, 8);
    plan.surfaceCount = 8 as 9;
    plan.rows[0].path = '/next/top';
    plan.rows[0].inheritedFalconLayoutModules = [];
    plan.rows[0].axiomContentUpdateModules = [];
    plan.rows[0].publicUseStatus = 'public_approved' as 'not_public_approved';
    plan.rows[0].publicationStatus = 'published' as 'not_published';

    const validation = validateFalconAxiomPublicSiteUpdatePlan(plan);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'surface_count_must_be_9',
        'row_count_must_be_9',
        'all_9_axiom_surfaces_must_be_covered',
        expect.stringContaining('path_outside_public_candidate_base:'),
        expect.stringContaining('hero_layout_not_preserved:'),
        expect.stringContaining('context_or_progressive_disclosure_not_declared:'),
        expect.stringContaining('axiom_integrated_domain_body_not_declared:'),
        expect.stringContaining('public_use_status_must_remain_not_approved:'),
        expect.stringContaining('publication_status_must_remain_not_published:'),
      ]),
    );
  });
});
