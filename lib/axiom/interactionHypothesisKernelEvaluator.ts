import {
  AXIOM_ACTIONABILITY_BANDS,
  AXIOM_ALLOWED_CORE_PROGRESS_CLASSES,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
  validateAxiomInteractionHypothesisKernelContract,
  type AxiomActionabilityBand,
  type AxiomInteractionHypothesisKernel,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';

export const AXIOM_INTERACTION_HYPOTHESIS_KERNEL_EVAL_BOUNDARY =
  'axiom_interaction_hypothesis_kernel_eval_is_non_runtime_scenario_check_not_model_or_public_movement' as const;

export type AxiomKernelEvalScenario = {
  id: string;
  expected_principal_pattern_ids: string[];
  expected_cross_cutting_check_ids: string[];
  required_interaction_reading_slots: string[];
  expected_actionability_bands: string[];
};

export type AxiomKernelEvalCheckId =
  | 'contract_valid'
  | 'core_progress_class_kernel_build_input'
  | 'scenario_principal_patterns_covered'
  | 'scenario_cross_cutting_checks_covered'
  | 'required_interaction_slots_covered'
  | 'actionability_band_allowed_by_scenario'
  | 'counter_hypothesis_present'
  | 'missing_context_present'
  | 'implementation_actor_conditions_present'
  | 'source_lenses_status_present'
  | 'movement_boundary_unchanged';

export type AxiomKernelEvalCheck = {
  id: AxiomKernelEvalCheckId;
  passed: boolean;
  expected: string[];
  actual: string[];
  note: string;
};

export type AxiomInteractionHypothesisKernelEvalReport = {
  reportId: string;
  generatedAt: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_eval';
  scenarioId: string;
  kernelId: string;
  status: 'passes' | 'needs_repair';
  score: 0 | 1 | 2;
  modelCalled: false;
  runtimeChanged: false;
  promptChanged: false;
  retrievalChanged: false;
  modelProviderChanged: false;
  dbSchemaChanged: false;
  publicApprovalChanged: false;
  knowledgePromotionChanged: false;
  boundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_EVAL_BOUNDARY;
  inheritedContractBoundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY;
  allowedCoreProgressClasses: typeof AXIOM_ALLOWED_CORE_PROGRESS_CLASSES;
  deliveryLayerProgressClass: 'delivery_layer_not_core_kernel';
  checks: AxiomKernelEvalCheck[];
  passedCheckCount: number;
  failedCheckCount: number;
  notNow: string[];
};

export type AxiomInteractionHypothesisKernelEvalSuiteReport = {
  reportId: string;
  generatedAt: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_eval';
  status: 'passes' | 'needs_repair';
  scenarioCount: number;
  passingScenarioCount: number;
  failingScenarioCount: number;
  averageScore: number;
  modelCalled: false;
  runtimeChanged: false;
  promptChanged: false;
  retrievalChanged: false;
  modelProviderChanged: false;
  dbSchemaChanged: false;
  publicApprovalChanged: false;
  knowledgePromotionChanged: false;
  boundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_EVAL_BOUNDARY;
  reports: AxiomInteractionHypothesisKernelEvalReport[];
  notNow: string[];
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function includesAll(actual: string[], expected: string[]): boolean {
  return expected.every((value) => actual.includes(value));
}

function normalizeScenarioSlot(slot: string): AxiomMissingContextSlot | null {
  if (slot === 'sourceLensDifferences') return 'source_lens';
  if (
    slot === 'person' ||
    slot === 'job' ||
    slot === 'environment' ||
    slot === 'support' ||
    slot === 'time' ||
    slot === 'institution' ||
    slot === 'evidence' ||
    slot === 'source_lens'
  ) {
    return slot;
  }

  return null;
}

function buildCheck(
  id: AxiomKernelEvalCheckId,
  passed: boolean,
  expected: string[],
  actual: string[],
  note: string,
): AxiomKernelEvalCheck {
  return {
    id,
    passed,
    expected: unique(expected),
    actual: unique(actual),
    note,
  };
}

function scoreChecks(checks: AxiomKernelEvalCheck[]): 0 | 1 | 2 {
  const failedCheckCount = checks.filter((check) => !check.passed).length;
  if (failedCheckCount === 0) return 2;
  if (failedCheckCount <= 3) return 1;
  return 0;
}

export function evaluateAxiomInteractionHypothesisKernelAgainstScenario(
  kernel: AxiomInteractionHypothesisKernel,
  scenario: AxiomKernelEvalScenario,
  generatedAt: string = new Date().toISOString(),
): AxiomInteractionHypothesisKernelEvalReport {
  const contractValidation = validateAxiomInteractionHypothesisKernelContract(kernel);
  const principalPatternIds = unique(
    kernel.inference.flatMap((inference) => inference.principalPatternCandidateIds),
  );
  const crossCuttingCheckIds = unique(
    kernel.inference.flatMap((inference) => inference.crossCuttingCheckIds),
  );
  const missingContextSlots = unique(kernel.missingContext.map((context) => context.slot));
  const requiredScenarioSlots = unique(
    scenario.required_interaction_reading_slots
      .map(normalizeScenarioSlot)
      .filter((slot): slot is AxiomMissingContextSlot => Boolean(slot)),
  );
  const actionabilityBands = [...AXIOM_ACTIONABILITY_BANDS];
  const scenarioBands = scenario.expected_actionability_bands.filter(
    (band): band is AxiomActionabilityBand =>
      actionabilityBands.includes(band as AxiomActionabilityBand),
  );
  const sourceLensKeys = Object.keys(kernel.sourceLensStatus);

  const checks: AxiomKernelEvalCheck[] = [
    buildCheck(
      'contract_valid',
      contractValidation.valid,
      ['contract_valid'],
      [contractValidation.validationStatus, ...contractValidation.errors],
      'A kernel_eval report can pass only when the underlying Axiom kernel contract is valid.',
    ),
    buildCheck(
      'core_progress_class_kernel_build_input',
      kernel.coreProgressClass === 'kernel_build',
      ['kernel_build'],
      [kernel.coreProgressClass],
      'The evaluator consumes a built kernel object; it does not relabel delivery-layer work as core progress.',
    ),
    buildCheck(
      'scenario_principal_patterns_covered',
      includesAll(principalPatternIds, scenario.expected_principal_pattern_ids),
      scenario.expected_principal_pattern_ids,
      principalPatternIds,
      'The kernel should carry the L3 principal interaction patterns expected by the scenario fixture.',
    ),
    buildCheck(
      'scenario_cross_cutting_checks_covered',
      includesAll(crossCuttingCheckIds, scenario.expected_cross_cutting_check_ids),
      scenario.expected_cross_cutting_check_ids,
      crossCuttingCheckIds,
      'The kernel should carry the scenario cross-cutting safety and reasoning checks.',
    ),
    buildCheck(
      'required_interaction_slots_covered',
      includesAll(missingContextSlots, requiredScenarioSlots),
      requiredScenarioSlots,
      missingContextSlots,
      'Required scenario contact points must be visible as missing-context slots before site rendering.',
    ),
    buildCheck(
      'actionability_band_allowed_by_scenario',
      scenarioBands.includes(kernel.actionabilityBand),
      scenarioBands,
      [kernel.actionabilityBand],
      'The selected actionability band must be one of the bands allowed by the scenario.',
    ),
    buildCheck(
      'counter_hypothesis_present',
      kernel.counterHypothesis.length > 0,
      ['at_least_one_counter_hypothesis'],
      kernel.counterHypothesis.map((counter) => counter.id),
      'Axiom must not collapse the reading into a single explanation.',
    ),
    buildCheck(
      'missing_context_present',
      kernel.missingContext.length > 0,
      ['missing_context_questions'],
      kernel.missingContext.map((context) => context.id),
      'Axiom kernel output must return questions that improve resolution before finality.',
    ),
    buildCheck(
      'implementation_actor_conditions_present',
      kernel.implementationActorConditions.length > 0,
      ['implementation_actor_conditions'],
      kernel.implementationActorConditions.map((condition) => condition.actor),
      'The kernel must expose actor conditions instead of making abstract recommendations.',
    ),
    buildCheck(
      'source_lenses_status_present',
      includesAll(sourceLensKeys, [
        'respondent_data',
        'supporter_data',
        'external_evidence',
        'implementation_actor_conditions',
      ]),
      ['respondent_data', 'supporter_data', 'external_evidence', 'implementation_actor_conditions'],
      sourceLensKeys,
      'The kernel must show source-lens strength and missingness explicitly.',
    ),
    buildCheck(
      'movement_boundary_unchanged',
      kernel.movementBoundary.runtime === 'not_changed' &&
        kernel.movementBoundary.prompt === 'not_changed' &&
        kernel.movementBoundary.retrieval === 'not_changed' &&
        kernel.movementBoundary.modelProvider === 'not_changed' &&
        kernel.movementBoundary.dbSchema === 'not_changed' &&
        kernel.movementBoundary.sourceValidity === 'not_decided' &&
        kernel.movementBoundary.supportValidity === 'not_decided' &&
        kernel.movementBoundary.candidatePattern === 'not_candidate_pattern' &&
        kernel.movementBoundary.runtimeApproved === 'not_approved' &&
        kernel.movementBoundary.publicApproved === 'not_approved' &&
        kernel.movementBoundary.knowledgePromotion === 'not_promoted',
      ['no_runtime_prompt_retrieval_model_provider_db_schema_or_approval_movement'],
      Object.values(kernel.movementBoundary),
      'Scenario evaluation is non-runtime and must not approve source/support validity, public use, or promotion.',
    ),
  ];

  const passedCheckCount = checks.filter((check) => check.passed).length;
  const failedCheckCount = checks.length - passedCheckCount;
  const score = scoreChecks(checks);

  return {
    reportId: `axiom_kernel_eval_${scenario.id}_${kernel.kernelId}`,
    generatedAt,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_eval',
    scenarioId: scenario.id,
    kernelId: kernel.kernelId,
    status: failedCheckCount === 0 ? 'passes' : 'needs_repair',
    score,
    modelCalled: false,
    runtimeChanged: false,
    promptChanged: false,
    retrievalChanged: false,
    modelProviderChanged: false,
    dbSchemaChanged: false,
    publicApprovalChanged: false,
    knowledgePromotionChanged: false,
    boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_EVAL_BOUNDARY,
    inheritedContractBoundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    allowedCoreProgressClasses: AXIOM_ALLOWED_CORE_PROGRESS_CLASSES,
    deliveryLayerProgressClass: 'delivery_layer_not_core_kernel',
    checks,
    passedCheckCount,
    failedCheckCount,
    notNow: [
      'no_model_call',
      'no_runtime_change',
      'no_prompt_change',
      'no_retrieval_change',
      'no_model_or_provider_change',
      'no_db_or_schema_change',
      'no_source_validity_decision',
      'no_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_public_approval',
      'no_knowledge_promotion',
      'no_public_site_publication',
    ],
  };
}

export function evaluateAxiomInteractionHypothesisKernelSuite(
  kernelsByScenarioId: Record<string, AxiomInteractionHypothesisKernel>,
  scenarios: AxiomKernelEvalScenario[],
  generatedAt: string = new Date().toISOString(),
): AxiomInteractionHypothesisKernelEvalSuiteReport {
  const reports = scenarios.map((scenario) => {
    const kernel = kernelsByScenarioId[scenario.id];

    if (!kernel) {
      throw new Error(`axiom_kernel_fixture_missing_for_scenario:${scenario.id}`);
    }

    return evaluateAxiomInteractionHypothesisKernelAgainstScenario(kernel, scenario, generatedAt);
  });
  const passingScenarioCount = reports.filter((report) => report.status === 'passes').length;
  const failingScenarioCount = reports.length - passingScenarioCount;
  const scoreTotal = reports.reduce((sum, report) => sum + report.score, 0);

  return {
    reportId: 'axiom_kernel_eval_suite_l3_scenarios_v0_2026_06_07',
    generatedAt,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_eval',
    status: failingScenarioCount === 0 ? 'passes' : 'needs_repair',
    scenarioCount: reports.length,
    passingScenarioCount,
    failingScenarioCount,
    averageScore: reports.length > 0 ? scoreTotal / reports.length : 0,
    modelCalled: false,
    runtimeChanged: false,
    promptChanged: false,
    retrievalChanged: false,
    modelProviderChanged: false,
    dbSchemaChanged: false,
    publicApprovalChanged: false,
    knowledgePromotionChanged: false,
    boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_EVAL_BOUNDARY,
    reports,
    notNow: [
      'no_model_call',
      'no_runtime_change',
      'no_prompt_change',
      'no_retrieval_change',
      'no_model_or_provider_change',
      'no_db_or_schema_change',
      'no_source_validity_decision',
      'no_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_public_approval',
      'no_knowledge_promotion',
      'no_public_site_publication',
    ],
  };
}
