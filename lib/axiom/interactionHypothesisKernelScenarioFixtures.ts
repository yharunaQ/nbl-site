import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION,
  AXIOM_REQUIRED_BOOTSTRAP_LABELS,
  type AxiomActionabilityBand,
  type AxiomInteractionHypothesisKernel,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';

export const AXIOM_L3_EVAL_SCENARIO_IDS = [
  'l3_health_time_accommodation_lookup_trap_v0',
  'l3_disclosure_information_procedure_boundary_v0',
  'l3_policy_service_coordination_source_lens_v0',
  'l3_public_condition_window_non_lookup_v0',
  'l3_post_hiring_quality_evaluation_loop_v0',
] as const;

export type AxiomL3EvalScenarioId = (typeof AXIOM_L3_EVAL_SCENARIO_IDS)[number];

type AxiomScenarioKernelSeed = {
  scenarioId: AxiomL3EvalScenarioId;
  kernelId: string;
  observationText: string;
  inferenceText: string;
  counterHypothesisText: string;
  principalPatternCandidateIds: string[];
  crossCuttingCheckIds: string[];
  requiredSlots: AxiomMissingContextSlot[];
  actionabilityBand: AxiomActionabilityBand;
};

const SLOT_QUESTIONS: Record<
  AxiomMissingContextSlot,
  {
    question: string;
    whyItMatters: string;
  }
> = {
  person: {
    question:
      'What does the person identify as the concrete work-contact point, not only the condition label?',
    whyItMatters:
      'Axiom must not turn a thin personal or condition statement into a person-trait explanation.',
  },
  job: {
    question:
      'Which tasks, role expectations, evaluation moments, and decision points are actually in scope?',
    whyItMatters:
      'The same issue changes meaning depending on the work task, role, evaluation, and participation obligation.',
  },
  environment: {
    question:
      'Which physical, informational, social, safety, staffing, or tool conditions shape the contact point?',
    whyItMatters:
      'Axiom must locate interaction with the environment before naming support or intervention routes.',
  },
  support: {
    question:
      'Who can translate the issue across person, job, workplace, health, service, and institutional lenses?',
    whyItMatters:
      'Support is not valid merely because it exists; the translation function and boundary must be visible.',
  },
  time: {
    question:
      'What timing, sequence, recovery window, transition point, or future-review cycle changes the reading?',
    whyItMatters:
      'FCHMA reasoning needs time structure so it does not freeze a situation into a static trait.',
  },
  institution: {
    question:
      'Which organization, service, policy, manager, or reviewer owns the next decision or constraint?',
    whyItMatters:
      'A provisional insight is only useful when implementation authority and institutional constraints are visible.',
  },
  evidence: {
    question:
      'Which evidence is direct observation, which is inference, and which remains only a bootstrap prior?',
    whyItMatters:
      'Axiom must preserve evidence status before grounding, publication, or learning updates.',
  },
  source_lens: {
    question:
      'Where might respondent, supporter, employer, external evidence, and implementation actor lenses differ?',
    whyItMatters: 'Source-lens differences are translation stop-points, not noise to average away.',
  },
};

const SCENARIO_KERNEL_SEEDS: AxiomScenarioKernelSeed[] = [
  {
    scenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
    kernelId: 'axiom_kernel_fixture_health_time_meeting_density_v0_2026_06_07',
    observationText:
      'The synthetic worker reports afternoon fatigue and difficulty continuing after dense back-to-back online meetings.',
    inferenceText:
      'The useful provisional reading is a health-time and work-density contact-point problem, not a condition-to-accommodation conclusion.',
    counterHypothesisText:
      'The primary friction might be schedule unpredictability, meeting role ambiguity, evaluation pressure, or lack of recovery-time permission rather than meeting density itself.',
    principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
    crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27'],
    requiredSlots: ['person', 'job', 'environment', 'support', 'time', 'institution'],
    actionabilityBand: 'usable_provisional_insight',
  },
  {
    scenarioId: 'l3_disclosure_information_procedure_boundary_v0',
    kernelId: 'axiom_kernel_fixture_disclosure_information_procedure_v0_2026_06_07',
    observationText:
      'The synthetic support-staff scenario links mistakes to mixed verbal instructions and informal updates, while asking how much disability-related information should be shared.',
    inferenceText:
      'The provisional reading separates disclosure volume from work-procedure synchronization, confirmation, consent, safety, and evaluation design.',
    counterHypothesisText:
      'The primary friction might be unclear task closure, interruption load, handoff gaps, or informal update channels rather than disclosure amount.',
    principalPatternCandidateIds: ['L3-PIP-10', 'L3-PIP-13', 'L3-PIP-17', 'L3-PIP-18'],
    crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-26', 'L3-CCA-27'],
    requiredSlots: [
      'person',
      'job',
      'environment',
      'support',
      'time',
      'institution',
      'source_lens',
    ],
    actionabilityBand: 'usable_provisional_insight',
  },
  {
    scenarioId: 'l3_policy_service_coordination_source_lens_v0',
    kernelId: 'axiom_kernel_fixture_policy_service_coordination_v0_2026_06_07',
    observationText:
      'The synthetic policy/service scenario asks for coordination improvement across employers, support agencies, and public institutions with mixed and not-current-policy-verified sources.',
    inferenceText:
      'The provisional reading treats coordination as a source-lens and implementation-actor problem, not as an approved policy recommendation.',
    counterHypothesisText:
      'The apparent coordination issue might be decision-owner ambiguity, evidence-currentness weakness, service handoff timing, or local resource constraint.',
    principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
    crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
    requiredSlots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
    actionabilityBand: 'question_first_only',
  },
  {
    scenarioId: 'l3_public_condition_window_non_lookup_v0',
    kernelId: 'axiom_kernel_fixture_public_condition_window_v0_2026_06_07',
    observationText:
      'The synthetic public-site scenario asks for a disease or disability category page that tells readers what workplace support is usually needed.',
    inferenceText:
      'The provisional reading blocks disease-to-support lookup and reframes the category as a condition window into multiple work-contact points.',
    counterHypothesisText:
      'The public page need might be a work-condition window, a case-reading route, or a boundary/trust explanation rather than a category explainer.',
    principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-04', 'L3-PIP-10', 'L3-PIP-15', 'L3-PIP-21'],
    crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
    requiredSlots: ['person', 'job', 'environment', 'support', 'time', 'institution'],
    actionabilityBand: 'public_boundary_blocked',
  },
  {
    scenarioId: 'l3_post_hiring_quality_evaluation_loop_v0',
    kernelId: 'axiom_kernel_fixture_post_hiring_quality_loop_v0_2026_06_07',
    observationText:
      'The synthetic briefing scenario treats improving employment numbers as a possible success claim and asks what should be critiqued before public presentation.',
    inferenceText:
      'The provisional reading separates employment status from participation quality, role, evaluation, growth, future conversation, and source-lens outcome evidence.',
    counterHypothesisText:
      'The count improvement might hide role stagnation, health-time cost, evaluation exclusion, weak growth routes, or missing worker-benefit evidence.',
    principalPatternCandidateIds: ['L3-PIP-06', 'L3-PIP-19', 'L3-PIP-20', 'L3-PIP-21'],
    crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
    requiredSlots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
    actionabilityBand: 'usable_provisional_insight',
  },
];

function buildMissingContext(seed: AxiomScenarioKernelSeed) {
  return seed.requiredSlots.map((slot) => ({
    id: `mc_${seed.scenarioId}_${slot}`,
    slot,
    ...SLOT_QUESTIONS[slot],
  }));
}

export function buildAxiomInteractionHypothesisKernelFixtureForScenario(
  scenarioId: AxiomL3EvalScenarioId,
): AxiomInteractionHypothesisKernel {
  const seed = SCENARIO_KERNEL_SEEDS.find((candidate) => candidate.scenarioId === scenarioId);

  if (!seed) {
    throw new Error(`unknown_axiom_l3_eval_scenario:${scenarioId}`);
  }

  const missingContext = buildMissingContext(seed);
  const missingContextIds = missingContext.map((context) => context.id);

  return {
    kernelId: seed.kernelId,
    objectType: 'axiom_interaction_hypothesis_kernel',
    contractVersion: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_build',
    status: 'axiom_kernel_candidate_requires_eval',
    boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    bootstrapStatus: [...AXIOM_REQUIRED_BOOTSTRAP_LABELS],
    inputMode: 'synthetic_non_sensitive_fixture',
    observation: [
      {
        id: 'obs_synthetic_scenario',
        lens: 'respondent_data',
        text: seed.observationText,
        evidencePointer: `synthetic_fixture:${seed.scenarioId}`,
        statusLabel: 'synthetic_non_sensitive_fixture',
      },
      {
        id: 'obs_falcon_bootstrap_prior',
        lens: 'external_evidence',
        text: 'Falcon L3 scenario expectations are used as bootstrap priors for Axiom kernel evaluation, not as Axiom core truth.',
        evidencePointer:
          'data/specs/quality/falcon_expert_agent.core_eval_profile-v0-2026-06-07.json',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inference: [
      {
        id: 'inf_scenario_kernel_reading',
        text: seed.inferenceText,
        observationIds: ['obs_synthetic_scenario', 'obs_falcon_bootstrap_prior'],
        principalPatternCandidateIds: seed.principalPatternCandidateIds,
        crossCuttingCheckIds: seed.crossCuttingCheckIds,
        confidence: 'medium',
        statusLabel: 'provisional_not_reviewed',
      },
    ],
    counterHypothesis: [
      {
        id: 'counter_scenario_kernel_reading',
        text: seed.counterHypothesisText,
        wouldChange: [
          'next questions would shift before any final support, public, policy, or evaluation claim',
          'implementation actor conditions would need to be re-routed before promotion or publication',
        ],
        nextQuestionIds: missingContextIds.slice(0, 3),
      },
    ],
    missingContext,
    implementationActorConditions: [
      {
        actor: 'support_staff',
        condition:
          'Can translate the provisional kernel reading into review questions without approving support validity.',
        requiredBeforeAction: true,
        missingContextIds: missingContextIds.slice(0, 2),
      },
      {
        actor: 'employer_manager',
        condition:
          'Can identify which work-design or evaluation conditions are actually adjustable in the scenario.',
        requiredBeforeAction: true,
        missingContextIds: missingContextIds.slice(2, 4),
      },
      {
        actor: 'reviewer',
        condition:
          'Can decide whether the framework-level reading is fit for further kernel evaluation without publication or promotion.',
        requiredBeforeAction: true,
        missingContextIds: missingContextIds.slice(-2),
      },
    ],
    sourceLensStatus: {
      respondent_data: {
        lens: 'respondent_data',
        status: seed.requiredSlots.includes('person')
          ? 'present_in_synthetic_fixture'
          : 'not_applicable_to_fixture',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Synthetic scenario input only; no sensitive raw case text is used.',
      },
      supporter_data: {
        lens: 'supporter_data',
        status: 'thin_or_missing',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Supporter lens is either synthetic or missing and must be routed to missing context.',
      },
      external_evidence: {
        lens: 'external_evidence',
        status: 'bootstrap_prior_only',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Falcon L3 materials are bootstrap priors for evaluation, not Axiom core truth.',
      },
      implementation_actor_conditions: {
        lens: 'implementation_actor_conditions',
        status: 'present_in_synthetic_fixture',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Actor conditions are provisional and require review before recommendation, release, or promotion.',
      },
    },
    actionabilityBand: seed.actionabilityBand,
    cannotYetSay: [
      'No medical conclusion can be drawn from this fixture.',
      'No legal or employment judgment is made.',
      'No accommodation recommendation or support validity decision is approved.',
      'No public approval, runtime approval, candidate_pattern, or knowledge promotion is granted.',
    ],
    humanReviewRoute: {
      reviewUnit: 'kernel_contract',
      reviewUnitScale: 'framework_unit_not_instance_hypothesis',
      estimatedCoreReviewUnits: 1,
      routeStatus: 'provisional_internal_generation_allowed_review_required_before_promotion',
      blocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
      doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
      reviewerQuestion:
        'Does this scenario kernel preserve useful provisional FCHMA insight while blocking finality, publication, promotion, and learning updates?',
    },
    movementBoundary: {
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      knowledgePromotion: 'not_promoted',
    },
  };
}

export function buildAllAxiomInteractionHypothesisKernelScenarioFixtures(): Record<
  AxiomL3EvalScenarioId,
  AxiomInteractionHypothesisKernel
> {
  return Object.fromEntries(
    AXIOM_L3_EVAL_SCENARIO_IDS.map((scenarioId) => [
      scenarioId,
      buildAxiomInteractionHypothesisKernelFixtureForScenario(scenarioId),
    ]),
  ) as Record<AxiomL3EvalScenarioId, AxiomInteractionHypothesisKernel>;
}
