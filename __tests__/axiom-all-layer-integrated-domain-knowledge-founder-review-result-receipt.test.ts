import {
  AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY,
  buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
  validateAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
  type AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
} from '@/lib/axiom/allLayerIntegratedDomainKnowledgeFounderReviewResultReceipt';
import { buildAxiomAllLayerIntegratedDomainKnowledgeRebuild } from '@/lib/axiom/allLayerIntegratedDomainKnowledgeRebuild';

function cloneReceipt(
  receipt: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
): AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt {
  return JSON.parse(JSON.stringify(receipt)) as AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt;
}

describe('Axiom all-layer integrated domain knowledge Founder review result receipt', () => {
  it('records Founder acceptance of all 10 rebuilt units for internal candidate surface projection', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
    const receipt =
      buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(rebuild);
    const validation =
      validateAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
        receipt,
        rebuild,
      );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus:
        'all_layer_integrated_domain_knowledge_founder_review_result_receipt_valid',
      errorCount: 0,
      boundary:
        AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RESULT_RECEIPT_BOUNDARY,
    });
    expect(receipt).toMatchObject({
      objectType:
        'axiom_all_layer_integrated_domain_knowledge_founder_review_result_receipt',
      lane: 'Falcon Lab',
      status:
        'founder_review_result_received_all_10_rebuilt_units_accepted_for_internal_surface_projection',
      reviewSource: 'founder_chat_review_result_2026_06_12',
      reviewerRole: 'Founder',
      unitCount: 10,
      acceptedUnitCount: 10,
      revisedUnitCount: 0,
      heldUnitCount: 0,
      totalAcceptedSubstructureCount:
        rebuild.allLayerCoverageReview.totalSubstructureCount,
      overallDecision:
        'all_10_rebuilt_units_accept_as_axiom_integrated_domain_knowledge_for_internal_surface_projection',
    });
    expect(receipt.externalReviewSummaryJa).toContain(
      'very well done and should be treated as passed',
    );
    expect(receipt.resultUnits).toHaveLength(rebuild.rebuiltReviewUnits.length);
  });

  it('keeps the pre-Founder, employment-phase, upper-category, and coverage corrections inside the accepted scope', () => {
    const receipt = buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt();

    expect(receipt.acceptedPreconditions).toEqual({
      preFounderAutonomousReviewCompleted: true,
      employmentPhaseCoverageAuditIncluded: true,
      upperDisabilityCategoryLayerIncluded: true,
      allLayerCoverageReviewIncluded: true,
    });
    expect(receipt.surfaceProjectionBridge.mustCarryForward).toEqual([
      '10_rebuilt_units',
      '37_substructures',
      'pre_founder_autonomous_review_findings',
      'employment_phase_coverage_audit',
      'upper_disability_category_layer',
      'source_lens_boundary_notes',
      'not_public_approval',
    ]);
    expect(
      receipt.resultUnits.find(
        (unit) =>
          unit.sourceRebuiltUnitId ===
          'rebuilt_unit_pre_entry_job_image_transition',
      )?.sourceSubstructureIds,
    ).toEqual(
      expect.arrayContaining(['pre_entry_no_work_experience_job_image_gap']),
    );
  });

  it('allows only internal next-NBL candidate page body projection and blocks public/runtime/learning movement', () => {
    const receipt = buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt();

    expect(receipt.reviewResultInterpretation).toMatchObject({
      integratedDomainKnowledgeAccepted: true,
      internalNextNblCandidateSurfaceProjection:
        'allowed_to_project_accepted_integrated_domain_knowledge_to_next_nbl_internal_candidate_surfaces',
      directPublicationDecision: 'not_decided_by_this_receipt',
      sourceSupportValidity: 'not_decided_by_this_receipt',
      candidatePattern: 'not_candidate_pattern',
      runtimePromptRetrievalModelProviderDbSchema: 'not_changed',
      learningUpdate: 'not_promoted',
    });
    expect(receipt.surfaceProjectionBridge).toMatchObject({
      nextAllowedStep:
        'build_axiom_integrated_domain_knowledge_backed_next_nbl_candidate_page_bodies',
      allowedScope:
        'internal_founder_review_candidate_pages_only_not_actual_public_navigation',
    });
    expect(receipt.surfaceProjectionBridge.prohibitedByThisReceipt).toEqual(
      expect.arrayContaining([
        'actual_public_navigation',
        'publication',
        'public_approval',
        'source_support_validity_finality',
        'runtime_prompt_retrieval_model_provider_db_schema_change',
        'learning_update',
      ]),
    );
    expect(receipt.notNow).toEqual(
      expect.arrayContaining([
        'no_actual_public_navigation_from_this_receipt',
        'no_direct_publication_or_public_approval_from_this_receipt',
        'no_learning_update',
      ]),
    );
  });

  it('rejects receipts that drop units, corrections, or public boundary blocks', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
    const receipt = cloneReceipt(
      buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(rebuild),
    );

    receipt.acceptedUnitCount = 9 as 10;
    receipt.resultUnits = receipt.resultUnits.slice(0, 9);
    receipt.acceptedPreconditions.upperDisabilityCategoryLayerIncluded = false as true;
    receipt.reviewResultInterpretation.directPublicationDecision =
      'approved' as 'not_decided_by_this_receipt';
    receipt.surfaceProjectionBridge.allowedScope =
      'actual_public_navigation' as 'internal_founder_review_candidate_pages_only_not_actual_public_navigation';
    receipt.surfaceProjectionBridge.prohibitedByThisReceipt =
      receipt.surfaceProjectionBridge.prohibitedByThisReceipt.filter(
        (item) => item !== 'publication',
      ) as unknown as typeof receipt.surfaceProjectionBridge.prohibitedByThisReceipt;
    receipt.notNow = receipt.notNow.filter((item) => item !== 'no_learning_update');

    const validation =
      validateAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
        receipt,
        rebuild,
      );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'acceptance_must_include_prefounder_employment_phase_upper_category_and_coverage_corrections',
        'receipt_counts_must_record_10_of_10_acceptance_and_all_substructures',
        'receipt_must_not_move_publication_validity_candidate_runtime_or_learning',
        'surface_projection_bridge_must_allow_only_internal_candidate_page_body_projection',
        'receipt_missing_rebuilt_unit:rebuilt_unit_source_lens_universal_structure_boundary_guard',
        'not_now_must_block_validity_public_navigation_publication_runtime_learning_and_sensitive_source_export',
      ]),
    );
  });
});
