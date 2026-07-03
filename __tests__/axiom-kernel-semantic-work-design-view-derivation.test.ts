import {
  AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY,
  buildAxiomKernelSemanticWorkDesignViewDerivation,
  validateAxiomKernelSemanticWorkDesignViewDerivation,
  type AxiomKernelSemanticWorkDesignViewDerivation,
} from '@/lib/axiom/kernelSemanticWorkDesignViewDerivation';

function cloneDerivation(
  derivation: AxiomKernelSemanticWorkDesignViewDerivation,
): AxiomKernelSemanticWorkDesignViewDerivation {
  return JSON.parse(JSON.stringify(derivation)) as AxiomKernelSemanticWorkDesignViewDerivation;
}

describe('Axiom kernel semantic work-design view derivation', () => {
  it('distinguishes 15 kernel items, 18 review units, and 27 semantic seeds before deriving views', () => {
    const derivation = buildAxiomKernelSemanticWorkDesignViewDerivation();
    const validation = validateAxiomKernelSemanticWorkDesignViewDerivation(derivation);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_semantic_work_design_view_derivation_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_SEMANTIC_WORK_DESIGN_VIEW_DERIVATION_BOUNDARY,
    });
    expect(derivation).toMatchObject({
      objectType: 'axiom_kernel_semantic_work_design_view_derivation',
      lane: 'Falcon Lab',
      status: 'semantic_work_design_view_derivation_bridge_ready_internal',
      derivationMethod: 'semantic_reconstruction_not_simple_count_matching_or_review_unit_substitution',
      humanReviewNeed:
        'semantic_view_level_review_still_required_even_after_18_unit_kernel_structure_acceptance',
    });
    expect(derivation.sourceLayerLedger).toEqual([
      expect.objectContaining({
        layerId: 'fifteen_item_kernel_corpus',
        unitCount: 15,
        role: 'evidence_grounded_reasoning_material',
        isWorkDesignViewContent: false,
      }),
      expect.objectContaining({
        layerId: 'eighteen_compressed_kernel_review_units',
        unitCount: 18,
        role: 'compressed_structure_boundary_review_receipt',
        isSemanticReviewApproval: false,
      }),
      expect.objectContaining({
        layerId: 'twenty_seven_l3_semantic_seed_prior',
        unitCount: 27,
        role: 'content_rich_work_design_semantic_prior',
        isWorkDesignViewContent: true,
        mustNotBeUsedAs: 'fixed_axiom_view_count',
      }),
    ]);
  });

  it('keeps false-equivalence guards against simple 15/18/27 matching', () => {
    const derivation = buildAxiomKernelSemanticWorkDesignViewDerivation();

    expect(derivation.falseEquivalenceGuards).toEqual([
      'do_not_treat_18_review_units_as_21_27_semantic_content_review',
      'do_not_treat_15_kernel_items_as_work_design_view_content',
      'do_not_simple_match_15_items_to_27_seeds',
      'do_not_replace_l3_semantic_prior_with_internal_information_governance_rules',
    ]);
    expect(derivation.notNow).toEqual(
      expect.arrayContaining([
        'no_semantic_view_content_approval_from_18_review_units',
        'no_final_view_count_from_15_kernel_items',
        'no_simple_matching_between_15_18_and_27_layers',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('builds bridge candidates that preserve seed meaning while using kernel corpus only as pressure/test material', () => {
    const derivation = buildAxiomKernelSemanticWorkDesignViewDerivation();

    expect(derivation.bridgeCandidateCount).toBe(5);
    expect(derivation.bridgeCandidates.map((candidate) => candidate.labelJa)).toEqual([
      '健康時間・回復・生活保障を一つの仕事条件として読む',
      '入口・開示・翻訳・支援接続を一続きの参加回路として読む',
      'source lens・反対仮説・公開境界を同時に読む',
      '作業手順・安全余力・感覚認知負荷を実装条件として読む',
      '役割・評価・処遇・学習成長を将来ループとして読む',
    ]);
    for (const candidate of derivation.bridgeCandidates) {
      expect(candidate.sourceSeedLabelsJa.length).toBe(candidate.sourceSeedCount);
      expect(candidate.sourceSeedLabelsJa.length).toBeGreaterThan(0);
      expect(candidate.corpusItemCount).toBeGreaterThan(0);
      expect(candidate.reviewUnitCount).toBeGreaterThan(0);
      expect(candidate.corpusRoleInDerivation).toBe(
        'grounding_pressure_and_missing_context_test_not_direct_view_content',
      );
      expect(candidate.reviewReceiptRoleInDerivation).toBe(
        'provisional_kernel_structure_acceptance_not_semantic_view_content_review',
      );
      expect(candidate.seedRoleInDerivation).toBe(
        'semantic_work_design_prior_to_be_reconstructed_through_axiom_kernel_eval',
      );
      expect(candidate.semanticReviewStatus).toBe(
        'semantic_view_review_required_before_public_copy',
      );
      expect(candidate.publicGuideReadiness).toBe('not_ready_for_public_guide_copy');
    }
  });

  it('rejects derivations that confuse layer roles or treat review units as semantic approval', () => {
    const derivation = cloneDerivation(buildAxiomKernelSemanticWorkDesignViewDerivation());

    derivation.sourceLayerLedger[0].isWorkDesignViewContent = true;
    derivation.sourceLayerLedger[1].isSemanticReviewApproval = true;
    derivation.sourceLayerLedger[2].mustNotBeUsedAs =
      'final_work_design_view_content' as unknown as 'fixed_axiom_view_count';
    derivation.derivationMethod =
      'simple_matching' as unknown as AxiomKernelSemanticWorkDesignViewDerivation['derivationMethod'];
    derivation.falseEquivalenceGuards = derivation.falseEquivalenceGuards.filter(
      (guard) => guard !== 'do_not_simple_match_15_items_to_27_seeds',
    ) as unknown as AxiomKernelSemanticWorkDesignViewDerivation['falseEquivalenceGuards'];
    derivation.bridgeCandidates[0].reviewReceiptRoleInDerivation =
      'semantic_view_content_review' as unknown as AxiomKernelSemanticWorkDesignViewDerivation['bridgeCandidates'][number]['reviewReceiptRoleInDerivation'];
    derivation.notNow = derivation.notNow.filter(
      (item) => item !== 'no_semantic_view_content_approval_from_18_review_units',
    );

    const validation = validateAxiomKernelSemanticWorkDesignViewDerivation(derivation);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'derivation_method_must_not_be_simple_matching_or_review_unit_substitution',
        'false_equivalence_guards_must_block_15_18_27_confusion',
        '15_item_layer_must_be_evidence_material_not_view_content',
        '18_review_unit_layer_must_be_structure_review_not_semantic_approval',
        '27_seed_layer_must_be_semantic_prior_not_fixed_count',
        'not_now_must_block_semantic_approval_final_count_simple_matching_runtime_and_learning',
        expect.stringContaining('candidate_review_receipt_role_must_not_be_semantic_review:'),
      ]),
    );
  });
});
