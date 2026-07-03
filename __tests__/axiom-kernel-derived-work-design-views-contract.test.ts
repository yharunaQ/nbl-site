import {
  AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
  buildAxiomKernelDerivedWorkDesignViewsContract,
  validateAxiomKernelDerivedWorkDesignViewsContract,
  type AxiomKernelDerivedWorkDesignViewsContract,
} from '@/lib/axiom/kernelDerivedWorkDesignViewsContract';

function cloneContract(
  contract: AxiomKernelDerivedWorkDesignViewsContract,
): AxiomKernelDerivedWorkDesignViewsContract {
  return JSON.parse(JSON.stringify(contract)) as AxiomKernelDerivedWorkDesignViewsContract;
}

describe('Axiom kernel-derived work-design views contract', () => {
  it('treats L3 21/27 as bootstrap prior, not the final Axiom view count', () => {
    const contract = buildAxiomKernelDerivedWorkDesignViewsContract();
    const validation = validateAxiomKernelDerivedWorkDesignViewsContract(contract);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_derived_work_design_views_contract_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
    });
    expect(contract).toMatchObject({
      objectType: 'axiom_kernel_derived_work_design_views_contract',
      lane: 'Falcon Lab',
      status: 'kernel_derived_views_count_not_fixed_ready_for_axiom_eval',
      canonicalSurfaceRole: 'kernel_derived_work_design_views_guide',
      legacySurfaceNameStatus:
        'twenty_one_views_is_inherited_surface_label_only_not_final_axiom_view_count',
      countPolicy:
        'view_count_is_derived_by_axiom_kernel_eval_not_hardcoded_from_falcon_or_l3',
      derivedViewCountStatus: 'not_fixed_until_axiom_eval_and_review_driven_compression',
      bootstrapPriorSeedCount: 27,
      bootstrapPrincipalPatternCount: 21,
      bootstrapCrossCuttingAxisCount: 6,
    });
    expect(contract.mustNotTreatAs).toContain('fixed_21_view_public_truth');
  });

  it('allows every bootstrap seed to change count through kernel eval', () => {
    const contract = buildAxiomKernelDerivedWorkDesignViewsContract();

    expect(contract.seeds).toHaveLength(27);
    expect(contract.seeds.map((seed) => seed.labelJa)).toEqual(
      expect.arrayContaining([
        '体調変動と負荷平準化',
        'source lens差の翻訳停止点',
        '職場規模・地域・支援資源による実装差',
        '条件窓はlookupではない',
        'review / learning loopを閉じない',
      ]),
    );
    for (const seed of contract.seeds) {
      expect(seed.status).toBe('falcon_bootstrap_prior_requires_axiom_eval_not_final_view');
      expect(seed.allowedKernelMovement).toEqual(
        expect.arrayContaining(['merge', 'split', 'rename', 'drop', 'hold_for_missing_context']),
      );
    }
  });

  it('rejects contracts that turn 21 views into fixed public truth', () => {
    const contract = cloneContract(buildAxiomKernelDerivedWorkDesignViewsContract());

    contract.countPolicy =
      'fixed_21_views_from_l3' as unknown as AxiomKernelDerivedWorkDesignViewsContract['countPolicy'];
    contract.legacySurfaceNameStatus =
      'twenty_one_views_is_final_axiom_view_count' as unknown as AxiomKernelDerivedWorkDesignViewsContract['legacySurfaceNameStatus'];
    contract.derivedViewCountStatus =
      'fixed_after_founder_review' as unknown as AxiomKernelDerivedWorkDesignViewsContract['derivedViewCountStatus'];
    contract.mustNotTreatAs = contract.mustNotTreatAs.filter(
      (item) => item !== 'fixed_21_view_public_truth',
    ) as unknown as AxiomKernelDerivedWorkDesignViewsContract['mustNotTreatAs'];

    const validation = validateAxiomKernelDerivedWorkDesignViewsContract(contract);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'count_policy_must_not_hardcode_21_views',
        'legacy_21_surface_name_must_be_label_only',
        'derived_view_count_must_remain_not_fixed',
        'must_not_treat_bootstrap_prior_as_fixed_21_view_public_truth',
      ]),
    );
  });
});
