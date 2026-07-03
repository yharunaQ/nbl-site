import {
  AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY,
  buildAxiomWorkDesignBackboneSurfaceDraftAssembly,
  validateAxiomWorkDesignBackboneSurfaceDraftAssembly,
  type AxiomWorkDesignBackboneSurfaceDraftAssembly,
} from '@/lib/axiom/workDesignBackboneSurfaceDraftAssembly';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneDraftAssembly(
  draftAssembly: AxiomWorkDesignBackboneSurfaceDraftAssembly,
): AxiomWorkDesignBackboneSurfaceDraftAssembly {
  return JSON.parse(JSON.stringify(draftAssembly)) as AxiomWorkDesignBackboneSurfaceDraftAssembly;
}

describe('Axiom work-design backbone surface draft assembly', () => {
  it('builds review-required internal body drafts for all 9 next-NBL surfaces', () => {
    const draftAssembly = buildAxiomWorkDesignBackboneSurfaceDraftAssembly();
    const validation = validateAxiomWorkDesignBackboneSurfaceDraftAssembly(draftAssembly);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'work_design_backbone_surface_draft_assembly_valid',
      errorCount: 0,
      boundary: AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY,
    });
    expect(draftAssembly).toMatchObject({
      objectType: 'axiom_work_design_backbone_surface_draft_assembly',
      lane: 'Falcon Lab',
      status: 'surface_body_draft_candidates_ready_internal',
      surfaceDraftCandidateCount: 9,
      contentSourcePolicy: 'surface_body_drafts_from_axiom_semantic_backbone_not_falcon_public_copy',
    });
    expect(draftAssembly.surfaceDrafts.map((draft) => draft.surface)).toEqual([
      ...AXIOM_NEXT_NBL_SITE_SURFACES,
    ]);
    expect(draftAssembly.coverage.representedSeedDraftIds).toHaveLength(27);
    expect(draftAssembly.coverage.representedSectionDraftIds).toHaveLength(5);
    expect(draftAssembly.coverage.representedPropagationSlotCandidateIds).toHaveLength(9);
  });

  it('turns the backbone into meaningful surface-specific draft copy without fixing final view count', () => {
    const draftAssembly = buildAxiomWorkDesignBackboneSurfaceDraftAssembly();
    const bySurface = new Map(draftAssembly.surfaceDrafts.map((draft) => [draft.surface, draft]));

    expect(bySurface.get('reader_facing_top_home')).toMatchObject({
      pageHeadingCandidateJa: '働きづらさを、仕事条件の問いとして読み直す',
      bodySectionCandidateCount: 5,
      semanticReviewStatus: 'surface_body_draft_review_required',
    });
    expect(bySurface.get('work_condition_window')).toMatchObject({
      pageHeadingCandidateJa: '症状名ではなく、働く条件を開く',
      bodySectionCandidateCount: 5,
    });
    expect(bySurface.get('twenty_one_views_work_design_guide')).toMatchObject({
      pageHeadingCandidateJa: 'Axiom版 仕事設計の視点候補',
      bodySectionCandidateCount: 5,
    });
    expect(bySurface.get('theory_method_trust_page')).toMatchObject({
      pageHeadingCandidateJa: '根拠・限界・レビューの扱い',
      bodySectionCandidateCount: 1,
    });
    expect(bySurface.get('about_operating_boundary_page')).toMatchObject({
      pageHeadingCandidateJa: 'NBLがすること、しないこと',
      bodySectionCandidateCount: 1,
    });
    expect(draftAssembly.mustNotTreatAs).toEqual(
      expect.arrayContaining(['public_copy', 'public_navigation', 'final_view_count']),
    );
  });

  it('keeps every body draft and body section routed to review before public page copy', () => {
    const draftAssembly = buildAxiomWorkDesignBackboneSurfaceDraftAssembly();

    for (const draft of draftAssembly.surfaceDrafts) {
      expect(draft.semanticReviewStatus).toBe('surface_body_draft_review_required');
      expect(draft.publicUseStatus).toBe('not_public_approved');
      expect(draft.publicationStatus).toBe('not_published');
      expect(draft.reviewRoute).toBe('surface_body_draft_review_before_public_page_copy');
      expect(draft.surfaceReviewQuestionsJa).toHaveLength(3);
      expect(draft.openingThesisCandidateJa.length).toBeGreaterThan(40);
      for (const section of draft.bodySectionCandidates) {
        expect(section.reviewRoute).toBe('surface_body_section_review_before_public_copy');
        expect(section.sourceSeedDraftIds.length).toBeGreaterThan(0);
        expect(section.seedQuestionCandidatesJa).toHaveLength(section.sourceSeedDraftIds.length);
        expect(section.seedRoleCandidatesJa).toHaveLength(section.sourceSeedDraftIds.length);
      }
    }
    expect(draftAssembly.reviewPolicy).toEqual({
      reviewUnitScale: 'surface_body_draft_unit_not_individual_hypothesis',
      reviewRequiredBeforePublicCopy: true,
      semanticReviewRequiredBeforePublication: true,
    });
  });

  it('rejects draft assemblies that lose a surface draft or move into public/runtime territory', () => {
    const draftAssembly = cloneDraftAssembly(buildAxiomWorkDesignBackboneSurfaceDraftAssembly());

    draftAssembly.surfaceDrafts = draftAssembly.surfaceDrafts.slice(0, 8);
    draftAssembly.surfaceDraftCandidateCount = 8 as 9;
    draftAssembly.surfaceDrafts[0].bodySectionCandidates = [];
    draftAssembly.surfaceDrafts[0].bodySectionCandidateCount = 0;
    draftAssembly.surfaceDrafts[0].semanticReviewStatus =
      'review_completed' as 'surface_body_draft_review_required';
    draftAssembly.surfaceDrafts[0].publicUseStatus = 'public_approved' as 'not_public_approved';
    draftAssembly.notNow = draftAssembly.notNow.filter(
      (item) => item !== 'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    );

    const validation = validateAxiomWorkDesignBackboneSurfaceDraftAssembly(draftAssembly);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'draft_assembly_must_cover_nine_surfaces_in_fixed_order',
        'not_now_must_block_public_copy_runtime_and_learning',
        'surface_draft_must_have_body_section_for_each_source_section:reader_facing_top_home',
        'surface_draft_must_remain_review_required_not_public:reader_facing_top_home',
      ]),
    );
  });
});
