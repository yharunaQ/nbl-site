import {
  AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY,
  buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
  validateAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
  type AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
} from '@/lib/axiom/realDataIntegratedDomainKnowledgeL3ContrastReport';
import { buildAxiomRealDataIntegratedDomainKnowledgeObject } from '@/lib/axiom/realDataIntegratedDomainKnowledgeObject';

function cloneReport(
  report: AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
): AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport {
  return JSON.parse(JSON.stringify(report)) as AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport;
}

describe('Axiom integrated domain knowledge L3 prior contrast report', () => {
  it('compares the six integrated Axiom axes against all 27 L3 seeds without making L3 a content source', () => {
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();
    const report = buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
      knowledgeObject,
    );
    const validation = validateAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
      report,
      knowledgeObject,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'integrated_domain_knowledge_l3_contrast_report_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY,
    });
    expect(report).toMatchObject({
      objectType: 'axiom_integrated_domain_knowledge_l3_prior_contrast_report',
      lane: 'Falcon Lab',
      status: 'ready_for_founder_review_of_l3_contrast_against_integrated_axes',
      sourceKnowledgeObjectId:
        'axiom_integrated_domain_knowledge_object_candidate_v0_2026_06_11',
      integratedAxisCount: 6,
      l3SeedCount: 27,
      l3PrincipalPatternCount: 21,
      l3CrossCuttingAxisCount: 6,
      finalViewCountStatus:
        'not_fixed_l3_contrast_can_trigger_merge_split_rename_drop_or_hold_only',
    });
    expect(report.rows).toHaveLength(27);
    expect(new Set(report.rows.map((row) => row.seedId)).size).toBe(27);
    expect(
      report.rows.every(
        (row) =>
          row.l3UseBoundary ===
          'bootstrap_prior_contrast_only_not_axiom_content_source_or_public_copy',
      ),
    ).toBe(true);
  });

  it('keeps merge, split, rename, and hold pressure visible for Founder review', () => {
    const report = buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport();

    expect(report.movementSummary).toEqual({
      covered_by_integrated_axis: 14,
      merge_into_integrated_axis: 3,
      split_pressure_on_integrated_axis: 8,
      rename_candidate_after_review: 1,
      gap_or_hold_until_missing_context: 1,
    });
    expect(
      report.rows.find((row) => row.seedId === 'L3-PIP-09'),
    ).toMatchObject({
      movement: 'split_pressure_on_integrated_axis',
      comparedAxisIds: [
        'axiom_domain_axis_information_participation_disclosure_boundary',
        'axiom_domain_axis_value_role_growth_quality_loop',
      ],
    });
    expect(
      report.rows.find((row) => row.seedId === 'L3-PIP-09')?.reasonJa,
    ).toContain('未就業・就職前の障害者データ');
    expect(
      report.rows.find((row) => row.seedId === 'L3-CCA-25'),
    ).toMatchObject({
      movement: 'gap_or_hold_until_missing_context',
    });
    expect(
      report.rows.find((row) => row.seedId === 'L3-PIP-08'),
    ).toMatchObject({
      movement: 'rename_candidate_after_review',
    });
  });

  it('covers every integrated axis and compresses review to six axes plus one contrast summary', () => {
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();
    const report = buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
      knowledgeObject,
    );
    const axisIds = knowledgeObject.axes.map((axis) => axis.axisId);
    const comparedAxisIds = new Set(report.rows.flatMap((row) => row.comparedAxisIds));

    for (const axisId of axisIds) {
      expect(comparedAxisIds.has(axisId)).toBe(true);
    }
    expect(report.founderReviewRoute).toMatchObject({
      reviewUnitScale: 'six_integrated_axes_plus_l3_contrast_summary_not_27_public_views',
      maxCoreHumanReviewUnits: 100,
      suggestedReviewUnitCount: 7,
    });
    expect(report.founderReviewRoute.reviewMustNotDecide).toEqual([
      'source_support_validity',
      'candidate_pattern_promotion',
      'public_approval',
      'publication',
      'runtime_or_learning_update',
    ]);
  });

  it('rejects reports that drop L3 rows, use L3 as content, fix view count, or widen review decisions', () => {
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();
    const report = cloneReport(
      buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(knowledgeObject),
    );

    report.rows = report.rows.slice(1);
    report.l3SeedCount = 26 as 27;
    report.rows[0].l3UseBoundary =
      'content_source' as 'bootstrap_prior_contrast_only_not_axiom_content_source_or_public_copy';
    report.movementSummary.covered_by_integrated_axis = 0;
    report.finalViewCountStatus =
      'fixed_21_views' as 'not_fixed_l3_contrast_can_trigger_merge_split_rename_drop_or_hold_only';
    report.l3UsePolicy.prohibited =
      'direct_content_allowed' as 'direct_content_generation_axiom_core_truth_fixed_view_count_semantic_approval_source_support_validity';
    report.founderReviewRoute.suggestedReviewUnitCount = 27 as unknown as 7;
    report.founderReviewRoute.reviewMustNotDecide = report.founderReviewRoute.reviewMustNotDecide.filter(
      (item) => item !== 'publication',
    ) as unknown as AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport['founderReviewRoute']['reviewMustNotDecide'];
    report.notNow = report.notNow.filter(
      (item) => item !== 'no_fixed_21_or_27_final_view_count',
    );

    const validation = validateAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
      report,
      knowledgeObject,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'report_must_cover_all_27_l3_seed_rows_once',
        'l3_contrast_missing_seed:L3-PIP-01',
        'l3_row_must_keep_bootstrap_prior_boundary:L3-PIP-02',
        'movement_summary_must_cover_27_rows_and_keep_gap_split_merge_pressure_visible',
        'l3_policy_must_prohibit_content_source_fixed_count_and_semantic_approval',
        'founder_review_route_must_compress_to_axes_plus_summary_and_block_publication',
        'not_now_must_block_l3_fixed_count_runtime_public_and_learning_movement',
      ]),
    );
  });
});
