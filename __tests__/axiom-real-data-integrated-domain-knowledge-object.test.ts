import {
  AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY,
  buildAxiomRealDataIntegratedDomainKnowledgeObject,
  validateAxiomRealDataIntegratedDomainKnowledgeObject,
  type AxiomRealDataIntegratedDomainKnowledgeObject,
} from '@/lib/axiom/realDataIntegratedDomainKnowledgeObject';
import { buildAxiomRealDataSemanticIntegrationRunPlan } from '@/lib/axiom/realDataSemanticIntegrationRunPlan';

function cloneKnowledgeObject(
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject,
): AxiomRealDataIntegratedDomainKnowledgeObject {
  return JSON.parse(JSON.stringify(knowledgeObject)) as AxiomRealDataIntegratedDomainKnowledgeObject;
}

describe('Axiom real-data integrated domain knowledge object candidate', () => {
  it('builds a non-public integrated domain knowledge candidate from all 14 packets', () => {
    const runPlan = buildAxiomRealDataSemanticIntegrationRunPlan();
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject(runPlan);
    const validation = validateAxiomRealDataIntegratedDomainKnowledgeObject(
      knowledgeObject,
      runPlan,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_data_integrated_domain_knowledge_object_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_OBJECT_BOUNDARY,
    });
    expect(knowledgeObject).toMatchObject({
      objectType: 'axiom_integrated_domain_knowledge_object_candidate',
      lane: 'Falcon Lab',
      status: 'built_from_real_derived_packets_pending_founder_human_review',
      sourceRunPlanId: 'axiom_real_data_semantic_integration_run_plan_v0_2026_06_11',
      inputPacketCount: 14,
      integratedAxisCount: 6,
      reviewCompression: {
        reviewUnitScale: 'integrated_domain_axis_not_individual_hypothesis',
        reviewUnitCount: 6,
        maxCoreHumanReviewUnits: 100,
      },
    });
  });

  it('keeps the domain structure independent from fixed 21 or 27 view counts', () => {
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();

    expect(knowledgeObject.viewCountStatus).toBe(
      'not_fixed_21_or_27_final_count_axes_are_candidate_components_for_reviewed_merge_split_rename_hold',
    );
    expect(knowledgeObject.reasoningEffortLabel).toBe(
      'xhigh_recommended_for_semantic_integration_as_development_reading_mode_not_runtime_provider_change',
    );
    expect(knowledgeObject.semanticReadingMethod).toEqual([
      'read_partial_data_as_reality_shadow',
      'stratify_by_disability_type_source_lens_and_employment_phase_before_component_compression',
      'retain_low_frequency_high_specificity_subgroup_signals_even_when_loadings_are_small',
      'separate_observation_inference_counter_missing_context',
      'keep_source_lens_and_bias_risk_visible',
      'synthesize_latent_work_design_structure_before_l3_prior_contrast',
      'compress_human_review_to_under_100_framework_units',
    ]);
    expect(knowledgeObject.diversityProtectionPolicy).toEqual({
      loadDominanceRisk:
        'rare_disease_heavy_survey_data_can_mislead_component_like_compression',
      requiredCorrection:
        'stratified_subgroup_and_multilevel_signal_retention_before_axis_projection',
      protectedSignalClasses: [
        'visual_and_hearing_communication_access',
        'internal_disability_regular_monitoring',
        'rare_disease_fluctuation_and_disclosure',
        'non_employed_or_pre_entry_experience',
        'low_frequency_high_specificity_disability_type_signals',
      ],
    });
    expect(knowledgeObject.l3PriorContrastReport).toMatchObject({
      status: 'pending_after_integrated_object_candidate',
      role: 'coverage_contrast_gap_merge_split_rename_drop_hold_and_naming_candidate_only',
      directContentUse: 'prohibited',
      finalViewCountFixing: 'prohibited',
    });
  });

  it('preserves kernel fields and covers every selected input packet across integrated axes', () => {
    const runPlan = buildAxiomRealDataSemanticIntegrationRunPlan();
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject(runPlan);
    const expectedPacketIds = runPlan.sourcePacketSelections.map(
      (selection) => selection.evidencePacketId,
    );
    const axisPacketIds = new Set(
      knowledgeObject.axes.flatMap((axisItem) => axisItem.sourcePacketIds),
    );

    for (const packetId of expectedPacketIds) {
      expect(axisPacketIds.has(packetId)).toBe(true);
    }
    for (const axisItem of knowledgeObject.axes) {
      expect(axisItem.observationSynthesisJa).not.toHaveLength(0);
      expect(axisItem.inferenceSynthesisJa).not.toHaveLength(0);
      expect(axisItem.counterHypothesesJa.length).toBeGreaterThan(0);
      expect(axisItem.missingContextQuestionsJa.length).toBeGreaterThan(0);
      expect(axisItem.implementationActorConditionsJa.length).toBeGreaterThan(0);
      expect(axisItem.cannotYetSayJa.length).toBeGreaterThan(0);
      expect(axisItem.l3PriorContrastInstruction).toBe(
        'compare_after_integration_for_coverage_gap_merge_split_rename_drop_or_hold_not_as_content_source',
      );
      expect(axisItem.humanReviewRoute).toBe(
        'founder_review_required_before_surface_projection_or_public_candidate_body_generation',
      );
    }
  });

  it('blocks page projection, public navigation, publication, runtime movement, and learning update', () => {
    const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();

    expect(knowledgeObject.surfaceProjection).toMatchObject({
      status: 'blocked_until_integrated_domain_axes_are_reviewed_or_explicitly_held',
      allowedAfterReview:
        'project_reviewed_axes_to_falcon_delivery_scaffold_as_public_candidate_content_slots',
    });
    expect(knowledgeObject.surfaceProjection.prohibitedNow).toEqual([
      'direct_page_body_generation_from_l3_27',
      'actual_public_navigation',
      'publication',
      'runtime_prompt_retrieval_model_provider_db_schema_change',
    ]);
    expect(knowledgeObject.notNow).toEqual(
      expect.arrayContaining([
        'no_direct_public_page_body_generation_before_founder_review',
        'no_l3_27_direct_public_copy',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects objects that drop packet coverage, fixed-count discipline, kernel fields, or review boundary', () => {
    const runPlan = buildAxiomRealDataSemanticIntegrationRunPlan();
    const knowledgeObject = cloneKnowledgeObject(
      buildAxiomRealDataIntegratedDomainKnowledgeObject(runPlan),
    );

    knowledgeObject.axes[0].sourcePacketIds = knowledgeObject.axes[0].sourcePacketIds.slice(1);
    knowledgeObject.axes[0].counterHypothesesJa = [];
    knowledgeObject.viewCountStatus =
      'fixed_21_views' as 'not_fixed_21_or_27_final_count_axes_are_candidate_components_for_reviewed_merge_split_rename_hold';
    knowledgeObject.l3PriorContrastReport.directContentUse = 'allowed' as 'prohibited';
    knowledgeObject.semanticReadingMethod = knowledgeObject.semanticReadingMethod.filter(
      (item) =>
        item !==
        'retain_low_frequency_high_specificity_subgroup_signals_even_when_loadings_are_small',
    ) as unknown as AxiomRealDataIntegratedDomainKnowledgeObject['semanticReadingMethod'];
    knowledgeObject.diversityProtectionPolicy.protectedSignalClasses = [] as unknown as AxiomRealDataIntegratedDomainKnowledgeObject['diversityProtectionPolicy']['protectedSignalClasses'];
    knowledgeObject.surfaceProjection.status =
      'ready_for_public_navigation' as 'blocked_until_integrated_domain_axes_are_reviewed_or_explicitly_held';
    knowledgeObject.notNow = knowledgeObject.notNow.filter(
      (item) => item !== 'no_l3_27_direct_public_copy',
    );

    const validation = validateAxiomRealDataIntegratedDomainKnowledgeObject(
      knowledgeObject,
      runPlan,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'integrated_axis_missing_packet:axiom_real_derived_evidence_packet_cr01_health_time_v0_2026_06_08',
        'view_count_must_not_be_fixed_to_21_or_27',
        'axis_must_preserve_kernel_fields:axiom_domain_axis_health_time_life_security_work_density',
        'l3_prior_contrast_report_must_prohibit_direct_content_and_fixed_count',
        'semantic_reading_must_protect_stratified_low_n_subgroup_signals',
        'diversity_protection_policy_must_block_rare_disease_load_dominance',
        'surface_projection_must_remain_blocked_until_axis_review',
        'not_now_must_block_public_l3_runtime_and_learning_movement',
      ]),
    );
  });
});
