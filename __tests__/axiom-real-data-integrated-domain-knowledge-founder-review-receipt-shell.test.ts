import {
  AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY,
  buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell,
  validateAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell,
  type AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell,
} from '@/lib/axiom/realDataIntegratedDomainKnowledgeFounderReviewReceiptShell';
import { buildAxiomRealDataSemanticFacetCoverage } from '@/lib/axiom/realDataSemanticFacetCoverage';

function cloneShell(
  shell: AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell,
): AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell {
  return JSON.parse(JSON.stringify(shell)) as AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell;
}

describe('Axiom integrated domain knowledge Founder review receipt shell', () => {
  it('prepares a high-coverage Founder review receipt shell without deciding review or projection', () => {
    const shell = buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell();
    const validation = validateAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell(shell);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'integrated_domain_knowledge_founder_review_receipt_shell_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY,
    });
    expect(shell).toMatchObject({
      objectType: 'axiom_integrated_domain_knowledge_founder_review_receipt_shell',
      lane: 'Falcon Lab',
      status:
        'founder_review_receipt_shell_prepared_not_received_not_decided_projection_blocked',
      reviewSourceRequired:
        'external_founder_review_result_required_before_surface_projection',
      reviewUnitCount: 9,
      maxCoreHumanReviewUnits: 100,
      surfaceProjectionGate: {
        status:
          'blocked_until_external_founder_receipt_accepts_or_holds_all_high_coverage_review_units',
        canProjectToNineCandidateSurfacesNow: false,
      },
    });
  });

  it('covers all six axes, all 42 facets, residual watchlist, and L3 contrast summary', () => {
    const coverage = buildAxiomRealDataSemanticFacetCoverage();
    const shell = buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell();
    const axisUnits = shell.reviewUnits.filter(
      (unit) => unit.unitKind === 'axis_semantic_facet_bundle',
    );
    const coveredFacetIds = new Set(
      shell.reviewUnits.flatMap((unit) => unit.sourceFacetIds),
    );
    const residualUnit = shell.reviewUnits.find(
      (unit) => unit.unitKind === 'residual_watchlist_review',
    );
    const l3Unit = shell.reviewUnits.find(
      (unit) => unit.unitKind === 'l3_contrast_summary_review',
    );

    expect(axisUnits).toHaveLength(6);
    expect(axisUnits.map((unit) => unit.sourceFacetIds.length)).toEqual([
      7, 7, 7, 7, 7, 7,
    ]);
    for (const facet of coverage.facets) {
      expect(coveredFacetIds.has(facet.facetId)).toBe(true);
    }
    expect(residualUnit?.sourceResidualIds).toEqual([
      'residual_low_frequency_high_risk_disclosure_discrimination',
      'residual_jurisdiction_history_currentness',
      'residual_pre_entry_and_growth_quality',
    ]);
    expect(residualUnit?.estimatedCoveragePercentAfterAcceptance).toBe(99);
    expect(l3Unit?.l3SeedCount).toBe(27);
  });

  it('keeps 85-90 percent as a floor only and blocks projection before external Founder receipt', () => {
    const shell = buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell();

    expect(shell.coveragePolicySnapshot).toMatchObject({
      minimumAcceptableCoveragePercent: 95,
      targetOverallSemanticCoveragePercent: 97,
      aspirationalReviewCoveragePercent: 99,
      eightyFiveToNinetyPercentRole: 'minimum_floor_only_not_axiom_target',
    });
    expect(shell.requiredReceiptFields).toContain('per_unit_decision');
    expect(shell.requiredReceiptFields).toContain(
      'explicit_surface_projection_permission_or_hold',
    );
    expect(shell.surfaceProjectionGate.prohibitedBeforeReceipt).toEqual(
      expect.arrayContaining([
        'six_axis_only_public_projection',
        'eighty_five_to_ninety_percent_as_final_coverage_target',
        'l3_27_direct_content_generation',
        'actual_public_navigation',
        'publication',
        'runtime_prompt_retrieval_model_provider_db_schema_change',
        'learning_update',
      ]),
    );
    expect(shell.notNow).toEqual(
      expect.arrayContaining([
        'no_founder_review_result_created_by_codex',
        'no_surface_projection_before_external_founder_receipt',
        'no_85_90_percent_as_final_coverage_target',
        'no_public_approval_or_publication',
        'no_learning_update',
      ]),
    );
  });

  it('rejects shells that pretend review, low-coverage projection, or runtime/public movement already happened', () => {
    const shell = cloneShell(buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell());

    shell.status =
      'founder_review_received' as 'founder_review_receipt_shell_prepared_not_received_not_decided_projection_blocked';
    shell.coveragePolicySnapshot.targetOverallSemanticCoveragePercent = 90 as 97;
    shell.reviewUnits = shell.reviewUnits.slice(0, 6);
    shell.reviewUnitCount = shell.reviewUnits.length;
    shell.surfaceProjectionGate.status =
      'projection_allowed' as 'blocked_until_external_founder_receipt_accepts_or_holds_all_high_coverage_review_units';
    shell.surfaceProjectionGate.canProjectToNineCandidateSurfacesNow = true as false;
    shell.surfaceProjectionGate.prohibitedBeforeReceipt = shell.surfaceProjectionGate.prohibitedBeforeReceipt.filter(
        (item) => item !== 'eighty_five_to_ninety_percent_as_final_coverage_target',
      ) as unknown as typeof shell.surfaceProjectionGate.prohibitedBeforeReceipt;
    shell.notNow = shell.notNow.filter((item) => item !== 'no_learning_update');

    const validation = validateAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell(shell);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'status_must_remain_prepared_not_received_not_decided_projection_blocked',
        'coverage_snapshot_must_keep_95_floor_97_target_99_aspirational_not_85_90_target',
        'review_unit_count_must_be_six_axis_units_plus_coverage_residual_and_l3_summary',
        'surface_projection_gate_must_remain_blocked_until_external_founder_receipt',
        'projection_gate_must_block_six_axis_85_90_runtime_and_learning_before_receipt',
        'not_now_must_block_codex_review_projection_85_90_publication_and_learning',
      ]),
    );
  });
});
