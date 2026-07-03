import {
  AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY,
  buildAxiomKernelDerivedWorkDesignViewSet,
  validateAxiomKernelDerivedWorkDesignViewSet,
  type AxiomKernelDerivedWorkDesignViewSet,
} from '@/lib/axiom/kernelDerivedWorkDesignViewSet';

function cloneViewSet(
  viewSet: AxiomKernelDerivedWorkDesignViewSet,
): AxiomKernelDerivedWorkDesignViewSet {
  return JSON.parse(JSON.stringify(viewSet)) as AxiomKernelDerivedWorkDesignViewSet;
}

describe('Axiom kernel-derived work-design view set', () => {
  it('compresses L3 21/27 bootstrap seeds into current kernel-derived view candidates without fixing the final count', () => {
    const viewSet = buildAxiomKernelDerivedWorkDesignViewSet();
    const validation = validateAxiomKernelDerivedWorkDesignViewSet(viewSet);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_derived_work_design_view_set_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEW_SET_BOUNDARY,
    });
    expect(viewSet).toMatchObject({
      objectType: 'axiom_kernel_derived_work_design_view_set',
      lane: 'Falcon Lab',
      status: 'current_kernel_eval_derived_view_candidates_ready_internal',
      sourceCorpusItemCount: 15,
      bootstrapPriorSeedCount: 27,
      evaluatedSeedCount: 27,
      currentDerivedViewCandidateCount: 5,
      viewCountStatus: 'current_eval_candidate_count_not_final',
      viewCountPolicy: 'derived_from_current_kernel_corpus_eval_not_hardcoded_from_falcon_or_l3',
    });
    expect(viewSet.currentDerivedViewCandidateCount).not.toBe(21);
    expect(viewSet.mustNotTreatAs).toEqual(
      expect.arrayContaining(['final_view_count', 'fixed_21_views', 'public_copy']),
    );
  });

  it('traces every current view candidate to seed evals, corpus rows, review units, and grounded fields', () => {
    const viewSet = buildAxiomKernelDerivedWorkDesignViewSet();

    expect(viewSet.candidates.map((candidate) => candidate.labelJa)).toEqual([
      '健康時間・回復・生活保障を一つの仕事条件として読む',
      '入口・開示・翻訳・支援接続を一続きの参加回路として読む',
      'source lens・反対仮説・公開境界を同時に読む',
      '作業手順・安全余力・感覚認知負荷を実装条件として読む',
      '役割・評価・処遇・学習成長を将来ループとして読む',
    ]);
    expect(viewSet.coverage.representedCorpusItemIds).toHaveLength(15);
    expect(viewSet.coverage.representedScenarioIds).toEqual(
      expect.arrayContaining([
        'l3_health_time_accommodation_lookup_trap_v0',
        'l3_disclosure_information_procedure_boundary_v0',
        'l3_policy_service_coordination_source_lens_v0',
        'l3_public_condition_window_non_lookup_v0',
        'l3_post_hiring_quality_evaluation_loop_v0',
      ]),
    );
    for (const candidate of viewSet.candidates) {
      expect(candidate.candidateStatus).toBe(
        'current_kernel_eval_view_candidate_review_required_not_final_public_view',
      );
      expect(candidate.sourceSeedIds.length).toBeGreaterThan(0);
      expect(candidate.seedEvals).toHaveLength(candidate.sourceSeedIds.length);
      expect(candidate.sourceCorpusItemIds.length).toBeGreaterThan(0);
      expect(candidate.reviewUnitIds.length).toBeGreaterThan(0);
      expect(candidate.corpusTraceStatus).toBe(
        'traced_to_15_item_kernel_corpus_without_raw_source_export',
      );
      expect(candidate.humanReviewRoute).toBe(
        'compressed_view_candidate_review_before_public_guide_or_downstream_content',
      );
      expect(candidate.publicUseStatus).toBe('not_public_approved');
      expect(candidate.publicationStatus).toBe('not_published');
    }
  });

  it('uses count-changing seed movements instead of preserving 21 as a public truth', () => {
    const viewSet = buildAxiomKernelDerivedWorkDesignViewSet();
    const allMovements = viewSet.candidates.flatMap((candidate) =>
      candidate.seedEvals.map((seedEval) => seedEval.movement),
    );

    expect(allMovements).toContain('merge_into_current_view_candidate');
    expect(allMovements).toContain('attach_as_cross_cutting_check_axis');
    expect(
      viewSet.candidates
        .find(
          (candidate) =>
            candidate.viewId === 'kernel_view_candidate_source_lens_boundary_and_counter_reading',
        )
        ?.sourceSeedIds,
    ).toEqual(
      expect.arrayContaining([
        'L3-PIP-14',
        'L3-CCA-22',
        'L3-CCA-23',
        'L3-CCA-24',
        'L3-CCA-25',
        'L3-CCA-26',
        'L3-CCA-27',
      ]),
    );
  });

  it('rejects view sets that lose seed/corpus coverage or move into final public use', () => {
    const viewSet = cloneViewSet(buildAxiomKernelDerivedWorkDesignViewSet());

    viewSet.coverage.evaluatedSeedIds = viewSet.coverage.evaluatedSeedIds.slice(1);
    viewSet.evaluatedSeedCount = 26;
    viewSet.coverage.representedCorpusItemIds = viewSet.coverage.representedCorpusItemIds.slice(0, 14);
    viewSet.viewCountStatus =
      'final_view_count' as unknown as AxiomKernelDerivedWorkDesignViewSet['viewCountStatus'];
    viewSet.candidates[0].publicUseStatus =
      'public_approved' as unknown as 'not_public_approved';
    viewSet.notNow = viewSet.notNow.filter((item) => item !== 'no_fixed_21_views');

    const validation = validateAxiomKernelDerivedWorkDesignViewSet(viewSet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'view_set_must_trace_to_all_15_kernel_corpus_items',
        'view_set_must_evaluate_all_27_bootstrap_prior_seeds',
        'view_count_must_remain_current_eval_candidate_count_not_final',
        expect.stringContaining('candidate_must_not_be_public_approved_or_published:'),
        'view_set_not_now_must_block_final_count_fixed_21_public_runtime_and_learning',
      ]),
    );
  });
});
