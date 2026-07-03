import {
  AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY,
  buildAxiomRealDataSemanticFacetCoverage,
  validateAxiomRealDataSemanticFacetCoverage,
  type AxiomRealDataSemanticFacetCoverage,
} from '@/lib/axiom/realDataSemanticFacetCoverage';

function cloneCoverage(
  coverage: AxiomRealDataSemanticFacetCoverage,
): AxiomRealDataSemanticFacetCoverage {
  return JSON.parse(JSON.stringify(coverage)) as AxiomRealDataSemanticFacetCoverage;
}

describe('Axiom real-data semantic facet coverage', () => {
  it('treats six axes as review compression only and expands to 42 facets for high diversity coverage', () => {
    const coverage = buildAxiomRealDataSemanticFacetCoverage();
    const validation = validateAxiomRealDataSemanticFacetCoverage(coverage);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_data_semantic_facet_coverage_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_SEMANTIC_FACET_COVERAGE_BOUNDARY,
    });
    expect(coverage).toMatchObject({
      objectType: 'axiom_real_data_semantic_facet_coverage',
      lane: 'Falcon Lab',
      status: 'high_diversity_semantic_facet_coverage_ready_for_founder_review',
      axisCount: 6,
      facetCount: 42,
      coveragePolicy: {
        sixAxisRole: 'top_level_review_compression_only_not_final_domain_resolution',
        eightyFiveToNinetyPercentRole: 'minimum_floor_only_not_axiom_target',
        minimumAcceptableCoveragePercent: 95,
        targetOverallSemanticCoveragePercent: 97,
        aspirationalReviewCoveragePercent: 99,
        diversityCoveragePrinciple:
          'retain_low_frequency_high_risk_disability_type_specific_and_minor_source_lens_facets_even_when_not_large_components',
        stratifiedSubgroupProtection:
          'do_not_let_rare_disease_heavy_packet_loadings_swallow_sensory_internal_disability_pre_entry_or_other_low_n_signals',
      },
    });
  });

  it('shows that 85-90 percent is only a floor region and not the Axiom target', () => {
    const coverage = buildAxiomRealDataSemanticFacetCoverage();

    expect(coverage.coverageCurve).toEqual([
      {
        layer: 'six_top_level_axes',
        estimatedSemanticCoveragePercent: 72,
        interpretation: 'too_low_resolution_for_final_domain_knowledge',
      },
      {
        layer: 'six_axes_plus_l3_27_contrast',
        estimatedSemanticCoveragePercent: 88,
        interpretation: 'minimum_floor_region_but_not_enough_for_diversity_goal',
      },
      {
        layer: 'six_axes_plus_42_facets',
        estimatedSemanticCoveragePercent: 97,
        interpretation: 'target_high_diversity_coverage_before_public_projection',
      },
      {
        layer: 'facet_residual_watchlist',
        estimatedSemanticCoveragePercent: 99,
        interpretation: 'aspirational_after_founder_review_and_hold_resolution',
      },
    ]);
  });

  it('keeps low-frequency, high-risk, source-lens, and diversity residuals visible', () => {
    const coverage = buildAxiomRealDataSemanticFacetCoverage();
    const diversitySignals = new Set(
      coverage.facets.flatMap((facet) => facet.diversitySignals),
    );

    expect(diversitySignals.size).toBe(22);
    expect(coverage.diversitySignalCount).toBe(22);
    expect([...diversitySignals]).toEqual(
      expect.arrayContaining([
        'visual_impairment',
        'hearing_impairment',
        'internal_disability_regular_monitoring',
        'non_employed_or_pre_entry_experience',
      ]),
    );
    expect(coverage.facets.some((facet) => facet.coverageRole === 'low_frequency_high_risk_retained_detail')).toBe(true);
    expect(coverage.facets.some((facet) => facet.coverageRole === 'source_lens_residual_guard')).toBe(true);
    expect(coverage.residuals).toHaveLength(4);
    expect(coverage.residuals.map((residual) => residual.residualId)).toEqual([
      'residual_disability_type_specific_underrepresented_signals',
      'residual_low_frequency_high_risk_disclosure_discrimination',
      'residual_jurisdiction_history_currentness',
      'residual_pre_entry_and_growth_quality',
    ]);
  });

  it('gives every six-axis bundle enough facets while staying under the 100-unit review budget', () => {
    const coverage = buildAxiomRealDataSemanticFacetCoverage();
    const facetCountsByAxis = new Map<string, number>();

    for (const facet of coverage.facets) {
      facetCountsByAxis.set(
        facet.parentAxisId,
        (facetCountsByAxis.get(facet.parentAxisId) ?? 0) + 1,
      );
      expect(facet.kernelFieldsProtected.length).toBeGreaterThanOrEqual(5);
      expect(facet.l3SeedRefs.length).toBeGreaterThan(0);
      expect(facet.reviewRoute).toBe(
        'review_as_axis_facet_bundle_not_public_copy_or_individual_hypothesis',
      );
    }

    expect([...facetCountsByAxis.values()]).toEqual([7, 7, 7, 7, 7, 7]);
    expect(coverage.reviewCompression).toMatchObject({
      reviewUnitScale: 'six_axis_bundles_plus_facet_coverage_and_residual_summary',
      suggestedReviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
    });
  });

  it('rejects low-resolution six-axis finalization or 85-90 percent as final target', () => {
    const coverage = cloneCoverage(buildAxiomRealDataSemanticFacetCoverage());

    coverage.coveragePolicy.sixAxisRole =
      'final_domain_resolution' as 'top_level_review_compression_only_not_final_domain_resolution';
    coverage.coveragePolicy.eightyFiveToNinetyPercentRole =
      'target' as 'minimum_floor_only_not_axiom_target';
    coverage.coveragePolicy.diversityCoveragePrinciple =
      'retain_large_components_only' as 'retain_low_frequency_high_risk_disability_type_specific_and_minor_source_lens_facets_even_when_not_large_components';
    coverage.coveragePolicy.stratifiedSubgroupProtection =
      'allow_component_load_dominance' as 'do_not_let_rare_disease_heavy_packet_loadings_swallow_sensory_internal_disability_pre_entry_or_other_low_n_signals';
    coverage.coveragePolicy.minimumAcceptableCoveragePercent = 90 as 95;
    coverage.coveragePolicy.targetOverallSemanticCoveragePercent = 90 as 97;
    coverage.facets = coverage.facets.slice(0, 6);
    coverage.facetCount = coverage.facets.length;
    coverage.coverageCurve[2].estimatedSemanticCoveragePercent = 90 as 97;
    coverage.notNow = coverage.notNow.filter(
      (item) => item !== 'no_85_90_percent_as_final_coverage_target',
    );

    const validation = validateAxiomRealDataSemanticFacetCoverage(coverage);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'six_axis_role_must_be_review_compression_not_final_resolution',
        'coverage_policy_must_set_95_floor_97_target_and_99_aspirational_review_coverage',
        'coverage_policy_must_protect_disability_type_specific_low_n_signals',
        'coverage_must_expand_six_axes_to_42_facets',
        'coverage_curve_must_show_six_axes_low_resolution_and_42_facets_high_coverage',
        'not_now_must_block_low_resolution_projection_85_90_target_runtime_and_learning',
      ]),
    );
  });
});
