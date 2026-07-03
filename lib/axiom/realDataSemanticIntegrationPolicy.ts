import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';

export const AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_VERSION =
  'v0_2026_06_11' as const;

export const AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY =
  'axiom_real_data_semantic_integration_must_rebuild_domain_knowledge_before_public_page_body_expansion_l3_27_is_bootstrap_prior_not_content_source' as const;

export const AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomSemanticIntegrationReasoningEffort =
  | 'standard_deterministic'
  | 'high'
  | 'xhigh_recommended_for_semantic_integration';

export type AxiomSemanticIntegrationInputFamily =
  | 'survey_data'
  | 'workshop_summaries'
  | 'manuals_and_practice_documents'
  | 'domestic_web_cache'
  | 'international_web_cache'
  | 'stage1_scima_fchma_outputs'
  | 'ft03_contracts_and_reviewed_boundaries'
  | 'l3_27_seed_prior';

export type AxiomSemanticIntegrationStage = {
  stageId:
    | 'semantic_input_selection'
    | 'axiom_kernel_xhigh_context_reading'
    | 'integrated_knowledge_object_build'
    | 'l3_prior_contrast_and_coverage_check'
    | 'surface_projection_after_integration';
  order: 1 | 2 | 3 | 4 | 5;
  role: string;
  reasoningEffort: AxiomSemanticIntegrationReasoningEffort;
  allowedInputs: AxiomSemanticIntegrationInputFamily[];
  output:
    | 'traceable_non_sensitive_input_packet_set'
    | 'axiom_context_reading_notes'
    | 'axiom_integrated_domain_knowledge_object'
    | 'l3_prior_match_gap_split_merge_hold_report'
    | 'kernel_backed_public_surface_content_candidates';
  mustNotDo: string[];
};

export type AxiomRealDataSemanticIntegrationPolicy = {
  policyId: string;
  objectType: 'axiom_real_data_semantic_integration_policy';
  contractVersion: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_VERSION;
  lane: 'Falcon Lab';
  status:
    'real_data_semantic_integration_required_before_public_page_body_expansion';
  boundary: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES;
  centralCorrection: {
    fifteenOrEighteenKernelRole:
      'epistemic_reading_and_expression_skill_not_domain_content_inventory';
    l3TwentySevenSeedRole:
      'falcon_bootstrap_prior_for_contrast_coverage_gap_detection_and_naming_candidates_not_axiom_content_source';
    publicSurfaceRole:
      'projection_from_axiom_integrated_domain_knowledge_object_after_review_routing';
  };
  sourceFamilyPolicy: {
    primaryReadingFamilies: Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>[];
    l3PriorAllowedUses: readonly [
      'contrast_with_axiom_integrated_knowledge',
      'coverage_check',
      'gap_detection',
      'merge_split_rename_drop_or_hold_candidate',
      'post_integration_naming_candidate',
    ];
    l3PriorProhibitedUses: readonly [
      'direct_public_content_generation',
      'axiom_core_truth',
      'fixed_final_view_count',
      'semantic_review_completion',
      'source_support_validity',
    ];
  };
  processSequence: readonly [
    AxiomSemanticIntegrationStage,
    AxiomSemanticIntegrationStage,
    AxiomSemanticIntegrationStage,
    AxiomSemanticIntegrationStage,
    AxiomSemanticIntegrationStage,
  ];
  pageBodyExpansionGate: {
    gateStatus: 'blocked_until_integrated_knowledge_object_exists';
    prerequisite:
      'axiom_integrated_domain_knowledge_object_from_real_data_semantic_integration';
    allowedAfterPrerequisite:
      'project_integrated_knowledge_to_falcon_delivery_scaffold_surfaces';
    blockedCurrentShortcut:
      'do_not_expand_pages_directly_from_l3_27_seed_or_7_6_7_5_2_backbone';
  };
  reasoningModePolicy: {
    xhighRecommendedFor: readonly [
      'multi_source_context_reading',
      'bias_and_partiality_correction',
      'latent_structure_synthesis',
      'counter_hypothesis_and_missing_context_generation',
      'principal_component_like_factorization_without_fixing_count',
    ];
    xhighNotRequiredFor: readonly [
      'typed_contract_writing',
      'deterministic_validation',
      'jest_regression_tests',
      'route_shell_rendering',
    ];
    runtimeImplication:
      'reasoning_effort_guidance_for_codex_or_llm_reading_pass_not_runtime_provider_change';
  };
  notNow: readonly [
    'no_page_body_expansion_before_real_data_semantic_integration',
    'no_l3_27_direct_public_copy',
    'no_fixed_21_or_27_final_view_count',
    'no_source_support_validity_finality',
    'no_candidate_pattern_promotion',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_publication_or_public_approval',
    'no_learning_update',
  ];
};

export type AxiomRealDataSemanticIntegrationPolicyValidation = {
  valid: boolean;
  validationStatus:
    | 'real_data_semantic_integration_policy_valid'
    | 'real_data_semantic_integration_policy_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES;
};

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function semanticIntegrationStages(): AxiomRealDataSemanticIntegrationPolicy['processSequence'] {
  return [
    {
      stageId: 'semantic_input_selection',
      order: 1,
      role:
        'Select traceable non-sensitive derived packets from survey, workshop, manual, web-cache, SCIMA/FCHMA, and reviewed boundary artifacts.',
      reasoningEffort: 'standard_deterministic',
      allowedInputs: [
        'survey_data',
        'workshop_summaries',
        'manuals_and_practice_documents',
        'domestic_web_cache',
        'international_web_cache',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ],
      output: 'traceable_non_sensitive_input_packet_set',
      mustNotDo: [
        'open_raw_sensitive_originals',
        'treat_l3_seed_prior_as_source_packet',
        'decide_source_support_validity',
      ],
    },
    {
      stageId: 'axiom_kernel_xhigh_context_reading',
      order: 2,
      role:
        'Use Axiom epistemic kernel skills to read partial and biased data as reality shadows, separating observation, inference, counter-hypothesis, missing context, source lens, actionability, and cannot-yet-say.',
      reasoningEffort: 'xhigh_recommended_for_semantic_integration',
      allowedInputs: [
        'survey_data',
        'workshop_summaries',
        'manuals_and_practice_documents',
        'domestic_web_cache',
        'international_web_cache',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ],
      output: 'axiom_context_reading_notes',
      mustNotDo: [
        'flatten_fragments_into_generic_summary',
        'hide_data_partiality',
        'produce_public_copy',
      ],
    },
    {
      stageId: 'integrated_knowledge_object_build',
      order: 3,
      role:
        'Build the Axiom integrated domain knowledge object from the context reading notes before any public surface expansion.',
      reasoningEffort: 'xhigh_recommended_for_semantic_integration',
      allowedInputs: [
        'survey_data',
        'workshop_summaries',
        'manuals_and_practice_documents',
        'domestic_web_cache',
        'international_web_cache',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ],
      output: 'axiom_integrated_domain_knowledge_object',
      mustNotDo: [
        'fix_final_view_count',
        'promote_candidate_pattern',
        'skip_human_review_route',
      ],
    },
    {
      stageId: 'l3_prior_contrast_and_coverage_check',
      order: 4,
      role:
        'Compare the Axiom integrated knowledge object against L3 27 seed prior to detect coverage, gaps, merge/split pressure, rename candidates, and holds.',
      reasoningEffort: 'high',
      allowedInputs: ['l3_27_seed_prior'],
      output: 'l3_prior_match_gap_split_merge_hold_report',
      mustNotDo: [
        'use_l3_seed_prior_as_content_source',
        'treat_l3_27_as_axiom_truth',
        'force_final_count_to_21_or_27',
      ],
    },
    {
      stageId: 'surface_projection_after_integration',
      order: 5,
      role:
        'Project the integrated knowledge object to Falcon delivery scaffold surfaces as review-required public-candidate content.',
      reasoningEffort: 'standard_deterministic',
      allowedInputs: [
        'survey_data',
        'workshop_summaries',
        'manuals_and_practice_documents',
        'domestic_web_cache',
        'international_web_cache',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
        'l3_27_seed_prior',
      ],
      output: 'kernel_backed_public_surface_content_candidates',
      mustNotDo: [
        'publish',
        'create_actual_public_navigation',
        'move_runtime_or_learning',
      ],
    },
  ];
}

export function buildAxiomRealDataSemanticIntegrationPolicy(): AxiomRealDataSemanticIntegrationPolicy {
  return {
    policyId: 'axiom_real_data_semantic_integration_policy_v0_2026_06_11',
    objectType: 'axiom_real_data_semantic_integration_policy',
    contractVersion: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_VERSION,
    lane: 'Falcon Lab',
    status: 'real_data_semantic_integration_required_before_public_page_body_expansion',
    boundary: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES],
    centralCorrection: {
      fifteenOrEighteenKernelRole:
        'epistemic_reading_and_expression_skill_not_domain_content_inventory',
      l3TwentySevenSeedRole:
        'falcon_bootstrap_prior_for_contrast_coverage_gap_detection_and_naming_candidates_not_axiom_content_source',
      publicSurfaceRole:
        'projection_from_axiom_integrated_domain_knowledge_object_after_review_routing',
    },
    sourceFamilyPolicy: {
      primaryReadingFamilies: [
        'survey_data',
        'workshop_summaries',
        'manuals_and_practice_documents',
        'domestic_web_cache',
        'international_web_cache',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ],
      l3PriorAllowedUses: [
        'contrast_with_axiom_integrated_knowledge',
        'coverage_check',
        'gap_detection',
        'merge_split_rename_drop_or_hold_candidate',
        'post_integration_naming_candidate',
      ],
      l3PriorProhibitedUses: [
        'direct_public_content_generation',
        'axiom_core_truth',
        'fixed_final_view_count',
        'semantic_review_completion',
        'source_support_validity',
      ],
    },
    processSequence: semanticIntegrationStages(),
    pageBodyExpansionGate: {
      gateStatus: 'blocked_until_integrated_knowledge_object_exists',
      prerequisite:
        'axiom_integrated_domain_knowledge_object_from_real_data_semantic_integration',
      allowedAfterPrerequisite:
        'project_integrated_knowledge_to_falcon_delivery_scaffold_surfaces',
      blockedCurrentShortcut:
        'do_not_expand_pages_directly_from_l3_27_seed_or_7_6_7_5_2_backbone',
    },
    reasoningModePolicy: {
      xhighRecommendedFor: [
        'multi_source_context_reading',
        'bias_and_partiality_correction',
        'latent_structure_synthesis',
        'counter_hypothesis_and_missing_context_generation',
        'principal_component_like_factorization_without_fixing_count',
      ],
      xhighNotRequiredFor: [
        'typed_contract_writing',
        'deterministic_validation',
        'jest_regression_tests',
        'route_shell_rendering',
      ],
      runtimeImplication:
        'reasoning_effort_guidance_for_codex_or_llm_reading_pass_not_runtime_provider_change',
    },
    notNow: [
      'no_page_body_expansion_before_real_data_semantic_integration',
      'no_l3_27_direct_public_copy',
      'no_fixed_21_or_27_final_view_count',
      'no_source_support_validity_finality',
      'no_candidate_pattern_promotion',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_publication_or_public_approval',
      'no_learning_update',
    ],
  };
}

export function validateAxiomRealDataSemanticIntegrationPolicy(
  policy: AxiomRealDataSemanticIntegrationPolicy,
): AxiomRealDataSemanticIntegrationPolicyValidation {
  const errors: string[] = [];
  const stageIds = policy.processSequence.map((stage) => stage.stageId);
  const stageOrders = policy.processSequence.map((stage) => stage.order);
  const xhighStages = policy.processSequence.filter(
    (stage) => stage.reasoningEffort === 'xhigh_recommended_for_semantic_integration',
  );
  const deterministicStages = policy.processSequence.filter(
    (stage) => stage.reasoningEffort === 'standard_deterministic',
  );

  pushIf(policy.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    policy.status !== 'real_data_semantic_integration_required_before_public_page_body_expansion',
    errors,
    'policy_must_block_page_body_expansion_until_real_data_semantic_integration',
  );
  pushIf(
    policy.centralCorrection.fifteenOrEighteenKernelRole !==
      'epistemic_reading_and_expression_skill_not_domain_content_inventory',
    errors,
    'fifteen_or_eighteen_kernel_role_must_be_epistemic_skill_not_domain_inventory',
  );
  pushIf(
    policy.centralCorrection.l3TwentySevenSeedRole !==
      'falcon_bootstrap_prior_for_contrast_coverage_gap_detection_and_naming_candidates_not_axiom_content_source',
    errors,
    'l3_27_seed_role_must_be_bootstrap_prior_not_content_source',
  );
  pushIf(
    policy.pageBodyExpansionGate.gateStatus !==
      'blocked_until_integrated_knowledge_object_exists',
    errors,
    'page_body_expansion_gate_must_be_blocked_until_integrated_knowledge_object_exists',
  );
  pushIf(
    policy.pageBodyExpansionGate.blockedCurrentShortcut !==
      'do_not_expand_pages_directly_from_l3_27_seed_or_7_6_7_5_2_backbone',
    errors,
    'page_body_expansion_must_not_shortcut_from_l3_or_prior_backbone',
  );
  pushIf(policy.processSequence.length !== 5, errors, 'process_sequence_must_have_5_stages');
  pushIf(
    stageOrders.join(',') !== '1,2,3,4,5',
    errors,
    'process_sequence_must_preserve_required_order',
  );
  pushIf(
    !stageIds.includes('integrated_knowledge_object_build'),
    errors,
    'integrated_knowledge_object_build_stage_required',
  );
  pushIf(
    !stageIds.includes('l3_prior_contrast_and_coverage_check'),
    errors,
    'l3_prior_contrast_stage_required_after_integration',
  );
  pushIf(
    xhighStages.length !== 2,
    errors,
    'xhigh_should_be_recommended_for_context_reading_and_integrated_knowledge_build_only',
  );
  pushIf(
    deterministicStages.length < 2,
    errors,
    'deterministic_contract_validation_and_surface_projection_must_not_require_xhigh',
  );
  pushIf(
    !policy.sourceFamilyPolicy.l3PriorProhibitedUses.includes('direct_public_content_generation'),
    errors,
    'l3_prior_must_prohibit_direct_public_content_generation',
  );
  pushIf(
    !policy.sourceFamilyPolicy.l3PriorAllowedUses.includes('coverage_check'),
    errors,
    'l3_prior_must_remain_available_for_coverage_check',
  );
  pushIf(
    !policy.notNow.includes('no_page_body_expansion_before_real_data_semantic_integration') ||
      !policy.notNow.includes('no_l3_27_direct_public_copy') ||
      !policy.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !policy.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_page_shortcut_l3_public_copy_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_data_semantic_integration_policy_valid'
        : 'real_data_semantic_integration_policy_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES],
  };
}
