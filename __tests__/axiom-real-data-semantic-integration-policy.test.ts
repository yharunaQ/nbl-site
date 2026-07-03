import {
  AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY,
  buildAxiomRealDataSemanticIntegrationPolicy,
  validateAxiomRealDataSemanticIntegrationPolicy,
  type AxiomRealDataSemanticIntegrationPolicy,
} from '@/lib/axiom/realDataSemanticIntegrationPolicy';

function clonePolicy(
  policy: AxiomRealDataSemanticIntegrationPolicy,
): AxiomRealDataSemanticIntegrationPolicy {
  return JSON.parse(JSON.stringify(policy)) as AxiomRealDataSemanticIntegrationPolicy;
}

describe('Axiom real-data semantic integration policy', () => {
  it('makes real-data semantic integration the required step before public page body expansion', () => {
    const policy = buildAxiomRealDataSemanticIntegrationPolicy();
    const validation = validateAxiomRealDataSemanticIntegrationPolicy(policy);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_data_semantic_integration_policy_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY,
    });
    expect(policy).toMatchObject({
      objectType: 'axiom_real_data_semantic_integration_policy',
      lane: 'Falcon Lab',
      status: 'real_data_semantic_integration_required_before_public_page_body_expansion',
      pageBodyExpansionGate: {
        gateStatus: 'blocked_until_integrated_knowledge_object_exists',
        prerequisite:
          'axiom_integrated_domain_knowledge_object_from_real_data_semantic_integration',
        blockedCurrentShortcut:
          'do_not_expand_pages_directly_from_l3_27_seed_or_7_6_7_5_2_backbone',
      },
    });
  });

  it('separates Axiom epistemic kernel skill from Falcon L3 semantic prior', () => {
    const policy = buildAxiomRealDataSemanticIntegrationPolicy();

    expect(policy.centralCorrection).toEqual({
      fifteenOrEighteenKernelRole:
        'epistemic_reading_and_expression_skill_not_domain_content_inventory',
      l3TwentySevenSeedRole:
        'falcon_bootstrap_prior_for_contrast_coverage_gap_detection_and_naming_candidates_not_axiom_content_source',
      publicSurfaceRole:
        'projection_from_axiom_integrated_domain_knowledge_object_after_review_routing',
    });
    expect(policy.sourceFamilyPolicy.l3PriorAllowedUses).toEqual([
      'contrast_with_axiom_integrated_knowledge',
      'coverage_check',
      'gap_detection',
      'merge_split_rename_drop_or_hold_candidate',
      'post_integration_naming_candidate',
    ]);
    expect(policy.sourceFamilyPolicy.l3PriorProhibitedUses).toEqual([
      'direct_public_content_generation',
      'axiom_core_truth',
      'fixed_final_view_count',
      'semantic_review_completion',
      'source_support_validity',
    ]);
  });

  it('recommends xhigh only for the semantic reading and integration stages, not deterministic scaffolding', () => {
    const policy = buildAxiomRealDataSemanticIntegrationPolicy();

    expect(policy.processSequence.map((stage) => [stage.order, stage.stageId, stage.reasoningEffort])).toEqual([
      [1, 'semantic_input_selection', 'standard_deterministic'],
      [2, 'axiom_kernel_xhigh_context_reading', 'xhigh_recommended_for_semantic_integration'],
      [3, 'integrated_knowledge_object_build', 'xhigh_recommended_for_semantic_integration'],
      [4, 'l3_prior_contrast_and_coverage_check', 'high'],
      [5, 'surface_projection_after_integration', 'standard_deterministic'],
    ]);
    expect(policy.reasoningModePolicy).toMatchObject({
      runtimeImplication:
        'reasoning_effort_guidance_for_codex_or_llm_reading_pass_not_runtime_provider_change',
    });
    expect(policy.reasoningModePolicy.xhighRecommendedFor).toEqual(
      expect.arrayContaining([
        'multi_source_context_reading',
        'bias_and_partiality_correction',
        'latent_structure_synthesis',
        'principal_component_like_factorization_without_fixing_count',
      ]),
    );
    expect(policy.reasoningModePolicy.xhighNotRequiredFor).toEqual(
      expect.arrayContaining(['typed_contract_writing', 'jest_regression_tests']),
    );
  });

  it('rejects policies that shortcut from L3 seed content to public pages or make xhigh a blanket requirement', () => {
    const policy = clonePolicy(buildAxiomRealDataSemanticIntegrationPolicy());

    policy.centralCorrection.l3TwentySevenSeedRole =
      'content_source' as 'falcon_bootstrap_prior_for_contrast_coverage_gap_detection_and_naming_candidates_not_axiom_content_source';
    policy.pageBodyExpansionGate.gateStatus =
      'ready_for_page_expansion' as 'blocked_until_integrated_knowledge_object_exists';
    policy.pageBodyExpansionGate.blockedCurrentShortcut =
      'allow_l3_direct_expansion' as 'do_not_expand_pages_directly_from_l3_27_seed_or_7_6_7_5_2_backbone';
    policy.processSequence[0].reasoningEffort = 'xhigh_recommended_for_semantic_integration';
    policy.sourceFamilyPolicy.l3PriorProhibitedUses =
      (policy.sourceFamilyPolicy.l3PriorProhibitedUses.filter(
        (use) => use !== 'direct_public_content_generation',
      ) as unknown) as AxiomRealDataSemanticIntegrationPolicy['sourceFamilyPolicy']['l3PriorProhibitedUses'];
    policy.notNow = policy.notNow.filter(
      (item) => item !== 'no_l3_27_direct_public_copy',
    ) as unknown as AxiomRealDataSemanticIntegrationPolicy['notNow'];

    const validation = validateAxiomRealDataSemanticIntegrationPolicy(policy);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'l3_27_seed_role_must_be_bootstrap_prior_not_content_source',
        'page_body_expansion_gate_must_be_blocked_until_integrated_knowledge_object_exists',
        'page_body_expansion_must_not_shortcut_from_l3_or_prior_backbone',
        'xhigh_should_be_recommended_for_context_reading_and_integrated_knowledge_build_only',
        'l3_prior_must_prohibit_direct_public_content_generation',
        'not_now_must_block_page_shortcut_l3_public_copy_runtime_and_learning',
      ]),
    );
  });
});
