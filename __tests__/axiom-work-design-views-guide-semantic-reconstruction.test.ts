import {
  AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY,
  buildAxiomWorkDesignViewsGuideSemanticReconstruction,
  validateAxiomWorkDesignViewsGuideSemanticReconstruction,
  type AxiomWorkDesignViewsGuideSemanticReconstruction,
} from '@/lib/axiom/workDesignViewsGuideSemanticReconstruction';

function cloneReconstruction(
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignViewsGuideSemanticReconstruction {
  return JSON.parse(JSON.stringify(reconstruction)) as AxiomWorkDesignViewsGuideSemanticReconstruction;
}

describe('Axiom work-design views guide semantic reconstruction', () => {
  it('reconstructs all L3 27 semantic seeds as internal content candidates, not public copy', () => {
    const reconstruction = buildAxiomWorkDesignViewsGuideSemanticReconstruction();
    const validation = validateAxiomWorkDesignViewsGuideSemanticReconstruction(reconstruction);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'work_design_views_guide_semantic_reconstruction_valid',
      errorCount: 0,
      boundary: AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY,
    });
    expect(reconstruction).toMatchObject({
      objectType: 'axiom_work_design_views_guide_semantic_reconstruction',
      lane: 'Falcon Lab',
      status: 'work_design_views_guide_semantic_reconstruction_candidates_ready_internal',
      contentSourcePolicy:
        'l3_27_seed_meaning_is_reconstructed_with_axiom_kernel_pressure_not_replaced_by_15_or_18_internal_control_units',
      semanticSeedDraftCount: 27,
      principalPatternDraftCount: 21,
      crossCuttingAxisDraftCount: 6,
      sectionDraftCount: 5,
      viewCountStatus: 'semantic_reconstruction_candidate_count_not_final',
    });
    expect(reconstruction.mustNotTreatAs).toEqual(
      expect.arrayContaining(['public_copy', 'final_view_count', 'fixed_21_views']),
    );
  });

  it('preserves content-rich work-design meaning for representative principal patterns and cross-cutting axes', () => {
    const reconstruction = buildAxiomWorkDesignViewsGuideSemanticReconstruction();
    const bySeed = new Map(reconstruction.seedDrafts.map((draft) => [draft.seedId, draft]));

    expect(bySeed.get('L3-PIP-01')).toMatchObject({
      sourceSeedLabelJa: '体調変動と負荷平準化',
      semanticRoleJa:
        '体調の波を本人の自己管理不足ではなく、仕事量、締切、休息、代替手順の平準化課題として読む。',
      readerQuestionCandidateJa:
        '一週間や月内で負荷が偏り、回復時間や次の作業準備を奪っていないか。',
    });
    expect(bySeed.get('L3-PIP-10')).toMatchObject({
      sourceSeedLabelJa: '応募・面接・開示の目的限定設計',
      semanticRoleJa:
        '開示を勇気や説明力の問題にせず、応募、面接、配属で何のために何を共有するかの目的限定設計として読む。',
    });
    expect(bySeed.get('L3-PIP-19')).toMatchObject({
      sourceSeedLabelJa: '役割・評価・処遇の価値翻訳',
      readerQuestionCandidateJa:
        '本人の貢献が、役割、評価、処遇の言葉に翻訳されず見えなくなっていないか。',
    });
    expect(bySeed.get('L3-CCA-22')).toMatchObject({
      sourceSeedLabelJa: '条件窓はlookupではない',
      semanticRoleJa:
        '条件窓を診断名や制度名から答えを引くlookupではなく、働く条件を開く入口として保つ。',
    });
    expect(bySeed.get('L3-CCA-27')).toMatchObject({
      sourceSeedLabelJa: 'review / learning loopを閉じない',
      readerQuestionCandidateJa:
        '反応、納得感、暫定仮説を、そのまま学習済み知識にしていないか。',
    });
  });

  it('keeps 15 kernel items and 18 review units as pressure/permission, not semantic content approval', () => {
    const reconstruction = buildAxiomWorkDesignViewsGuideSemanticReconstruction();

    for (const draft of reconstruction.seedDrafts) {
      expect(draft.sourceLayerUse).toEqual({
        l3Seed: 'semantic_prior',
        kernelCorpus: 'grounding_pressure_missing_context_and_counter_hypothesis_test',
        reviewReceipt: 'provisional_kernel_structure_permission_not_semantic_approval',
      });
      expect(draft.reviewStatus).toBe(
        'semantic_view_content_review_required_before_public_copy',
      );
      expect(draft.publicUseStatus).toBe('not_public_approved');
      expect(draft.publicationStatus).toBe('not_published');
    }
    expect(reconstruction.reviewPolicy).toEqual({
      reviewUnitScale: 'semantic_view_seed_or_section_unit_not_individual_hypothesis',
      semanticReviewRequired: true,
      eighteenUnitReviewReceiptRole:
        'permits_kernel_backed_continuation_but_does_not_approve_semantic_view_content',
    });
  });

  it('groups the 27 seed drafts under semantic section candidates without fixing final view count', () => {
    const reconstruction = buildAxiomWorkDesignViewsGuideSemanticReconstruction();
    const coveredDraftIds = reconstruction.sectionDrafts.flatMap(
      (section) => section.semanticSeedDraftIds,
    );

    expect(reconstruction.sectionDrafts.map((section) => section.headingJa)).toEqual([
      '健康時間・回復・生活保障を一つの仕事条件として読む',
      '入口・開示・翻訳・支援接続を一続きの参加回路として読む',
      'source lens・反対仮説・公開境界を同時に読む',
      '作業手順・安全余力・感覚認知負荷を実装条件として読む',
      '役割・評価・処遇・学習成長を将来ループとして読む',
    ]);
    expect(new Set(coveredDraftIds).size).toBe(27);
    for (const section of reconstruction.sectionDrafts) {
      expect(section.seedDraftCount).toBeGreaterThan(0);
      expect(section.sectionStatus).toBe(
        'internal_semantic_reconstruction_candidate_not_final_public_section',
      );
      expect(section.reviewRoute).toBe('semantic_view_content_review_before_public_guide');
    }
  });

  it('rejects reconstruction artifacts that become public copy or lose semantic seed coverage', () => {
    const reconstruction = cloneReconstruction(buildAxiomWorkDesignViewsGuideSemanticReconstruction());

    reconstruction.seedDrafts = reconstruction.seedDrafts.slice(0, 26);
    reconstruction.semanticSeedDraftCount = 26 as 27;
    reconstruction.seedDrafts[0].sourceLayerUse.reviewReceipt =
      'semantic_approval' as unknown as 'provisional_kernel_structure_permission_not_semantic_approval';
    reconstruction.seedDrafts[0].reviewStatus =
      'semantic_review_completed' as unknown as 'semantic_view_content_review_required_before_public_copy';
    reconstruction.seedDrafts[0].publicationStatus = 'published' as unknown as 'not_published';
    reconstruction.viewCountStatus =
      'final_view_count' as unknown as 'semantic_reconstruction_candidate_count_not_final';
    reconstruction.notNow = reconstruction.notNow.filter(
      (item) => item !== 'no_public_copy_from_semantic_reconstruction_candidates',
    );

    const validation = validateAxiomWorkDesignViewsGuideSemanticReconstruction(reconstruction);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'semantic_reconstruction_must_cover_27_seed_drafts_as_21_principal_plus_6_axis',
        'semantic_reconstruction_must_not_set_final_view_count',
        'not_now_must_block_public_copy_semantic_review_completion_runtime_and_learning',
        expect.stringContaining('semantic_seed_draft_must_preserve_layer_roles:'),
        expect.stringContaining('semantic_seed_draft_must_require_review_and_remain_unpublished:'),
      ]),
    );
  });
});
