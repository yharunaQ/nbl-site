export const AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION = 'v0_2026_06_07' as const;

export const AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY =
  'axiom_interaction_hypothesis_kernel_contract_is_non_runtime_kernel_build_not_public_or_promotion_movement' as const;

export const AXIOM_ALLOWED_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_eval',
  'kernel_grounding',
  'kernel_display',
  'kernel_human_review_loop',
] as const;

export type AxiomCoreProgressClass =
  | (typeof AXIOM_ALLOWED_CORE_PROGRESS_CLASSES)[number]
  | 'delivery_layer_not_core_kernel';

export const AXIOM_REQUIRED_BOOTSTRAP_LABELS = [
  'falcon_bootstrap_prior',
  'shared_evidence_foundation',
  'axiom_kernel_candidate',
  'requires_axiom_eval',
] as const;

export type AxiomBootstrapLabel = (typeof AXIOM_REQUIRED_BOOTSTRAP_LABELS)[number];

export const AXIOM_ACTIONABILITY_BANDS = [
  'usable_provisional_insight',
  'question_first_only',
  'hold_or_research_needed',
  'public_boundary_blocked',
] as const;

export type AxiomActionabilityBand = (typeof AXIOM_ACTIONABILITY_BANDS)[number];

export const AXIOM_SOURCE_LENSES = [
  'respondent_data',
  'supporter_data',
  'external_evidence',
  'implementation_actor_conditions',
] as const;

export type AxiomSourceLens = (typeof AXIOM_SOURCE_LENSES)[number];

export const AXIOM_HUMAN_REVIEW_BLOCKS = [
  'final_professional_judgment',
  'public_release',
  'source_validity',
  'support_validity',
  'candidate_pattern',
  'runtime_approved',
  'public_safe',
  'public_approved',
  'outcome_learning_update',
  'intervention_or_support_validity_finality',
] as const;

export type AxiomHumanReviewBlock = (typeof AXIOM_HUMAN_REVIEW_BLOCKS)[number];

export const AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK = [
  'provisional_hypothesis_generation',
  'counter_hypothesis_generation',
  'missing_context_question_generation',
  'actionability_band_classification',
  'non_sensitive_scenario_evaluation',
  'deterministic_kernel_logic_improvement',
  'internal_draft_output_with_provisional_label',
  'kernel_object_display_ui',
  'review_packet_preparation_from_labeled_provisional_objects',
] as const;

export type AxiomHumanReviewNonBlocking = (typeof AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK)[number];

export type AxiomSourceLensStatusValue =
  | 'present_in_synthetic_fixture'
  | 'present_in_evidence_foundation_fixture'
  | 'thin_or_missing'
  | 'bootstrap_prior_only'
  | 'requires_axiom_eval_before_core_truth'
  | 'not_applicable_to_fixture';

export const AXIOM_KERNEL_INPUT_MODES = [
  'synthetic_non_sensitive_fixture',
  'evidence_foundation_fixture',
] as const;

export type AxiomKernelInputMode = (typeof AXIOM_KERNEL_INPUT_MODES)[number];

export type AxiomSourceLensStatus = {
  lens: AxiomSourceLens;
  status: AxiomSourceLensStatusValue;
  sourceValidity: 'not_decided';
  supportValidity: 'not_decided';
  publicUse: 'not_public_approved';
  note: string;
};

export type AxiomObservation = {
  id: string;
  lens: AxiomSourceLens;
  text: string;
  evidencePointer: string;
  statusLabel: AxiomBootstrapLabel | 'synthetic_non_sensitive_fixture';
};

export type AxiomInference = {
  id: string;
  text: string;
  observationIds: string[];
  principalPatternCandidateIds: string[];
  crossCuttingCheckIds: string[];
  confidence: 'low' | 'medium';
  statusLabel: 'provisional_not_reviewed';
};

export type AxiomCounterHypothesis = {
  id: string;
  text: string;
  wouldChange: string[];
  nextQuestionIds: string[];
};

export type AxiomMissingContextSlot =
  | 'person'
  | 'job'
  | 'environment'
  | 'support'
  | 'time'
  | 'institution'
  | 'evidence'
  | 'source_lens';

export type AxiomMissingContext = {
  id: string;
  slot: AxiomMissingContextSlot;
  question: string;
  whyItMatters: string;
};

export type AxiomImplementationActor =
  | 'worker'
  | 'support_staff'
  | 'employer_manager'
  | 'medical_or_health_actor'
  | 'public_or_institutional_actor'
  | 'reviewer';

export type AxiomImplementationActorCondition = {
  actor: AxiomImplementationActor;
  condition: string;
  requiredBeforeAction: boolean;
  missingContextIds: string[];
};

export type AxiomHumanReviewRoute = {
  reviewUnit: 'kernel_contract';
  reviewUnitScale: 'framework_unit_not_instance_hypothesis';
  estimatedCoreReviewUnits: number;
  routeStatus: 'provisional_internal_generation_allowed_review_required_before_promotion';
  blocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  reviewerQuestion: string;
};

export type AxiomMovementBoundary = {
  runtime: 'not_changed';
  prompt: 'not_changed';
  retrieval: 'not_changed';
  modelProvider: 'not_changed';
  dbSchema: 'not_changed';
  sourceValidity: 'not_decided';
  supportValidity: 'not_decided';
  candidatePattern: 'not_candidate_pattern';
  runtimeApproved: 'not_approved';
  publicApproved: 'not_approved';
  knowledgePromotion: 'not_promoted';
};

export type AxiomInteractionHypothesisKernel = {
  kernelId: string;
  objectType: 'axiom_interaction_hypothesis_kernel';
  contractVersion: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION;
  lane: 'Falcon Lab';
  coreProgressClass: Extract<AxiomCoreProgressClass, 'kernel_build'>;
  status: 'axiom_kernel_candidate_requires_eval';
  boundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY;
  bootstrapStatus: AxiomBootstrapLabel[];
  inputMode: AxiomKernelInputMode;
  observation: AxiomObservation[];
  inference: AxiomInference[];
  counterHypothesis: AxiomCounterHypothesis[];
  missingContext: AxiomMissingContext[];
  implementationActorConditions: AxiomImplementationActorCondition[];
  sourceLensStatus: Record<AxiomSourceLens, AxiomSourceLensStatus>;
  actionabilityBand: AxiomActionabilityBand;
  cannotYetSay: string[];
  humanReviewRoute: AxiomHumanReviewRoute;
  movementBoundary: AxiomMovementBoundary;
};

export type AxiomInteractionHypothesisKernelValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  warningCount: number;
  warnings: string[];
  boundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY;
  coreProgressClass: AxiomCoreProgressClass;
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function missingValues<T extends string>(actual: readonly T[], required: readonly T[]): T[] {
  return required.filter((value) => !actual.includes(value));
}

function hasNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

function hasRequiredCannotYetSay(cannotYetSay: string[]): boolean {
  const joined = cannotYetSay.join(' ').toLowerCase();

  return [
    'medical',
    'legal',
    'employment',
    'accommodation',
    'support validity',
    'public approval',
    'runtime approval',
  ].every((needle) => joined.includes(needle));
}

export function buildAxiomInteractionHypothesisKernelFixture(): AxiomInteractionHypothesisKernel {
  return {
    kernelId: 'axiom_kernel_fixture_health_time_meeting_density_v0_2026_06_07',
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
        id: 'obs_001',
        lens: 'respondent_data',
        text: 'The synthetic worker reports afternoon fatigue and difficulty continuing after dense back-to-back online meetings.',
        evidencePointer: 'synthetic_fixture:l3_health_time_accommodation_lookup_trap_v0',
        statusLabel: 'synthetic_non_sensitive_fixture',
      },
      {
        id: 'obs_002',
        lens: 'external_evidence',
        text: 'Falcon bootstrap material treats health-condition labels as condition windows, not as direct accommodation lookup keys.',
        evidencePointer:
          'data/specs/quality/falcon_expert_agent.core_eval_profile-v0-2026-06-07.json',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inference: [
      {
        id: 'inf_001',
        text: 'The useful provisional reading is a health-time and work-density contact-point problem, not a condition-to-accommodation conclusion.',
        observationIds: ['obs_001', 'obs_002'],
        principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
        crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27'],
        confidence: 'medium',
        statusLabel: 'provisional_not_reviewed',
      },
    ],
    counterHypothesis: [
      {
        id: 'counter_001',
        text: 'The primary friction might be schedule unpredictability, meeting role ambiguity, evaluation pressure, or lack of recovery-time permission rather than meeting density itself.',
        wouldChange: [
          'next questions would move from meeting count to predictability, role, recovery access, and evaluation expectations',
          'implementation conditions would route to manager scheduling authority and review boundaries before any support option',
        ],
        nextQuestionIds: ['mc_job_001', 'mc_time_001', 'mc_institution_001'],
      },
    ],
    missingContext: [
      {
        id: 'mc_person_001',
        slot: 'person',
        question:
          'What does the worker identify as the most difficult moment: fatigue, role overload, recovery loss, evaluation pressure, or another contact point?',
        whyItMatters:
          'The kernel must not convert a thin fatigue statement into a person-trait explanation before the worker-defined contact point is clear.',
      },
      {
        id: 'mc_job_001',
        slot: 'job',
        question:
          'Which tasks, decision points, and participation obligations are attached to the online meetings?',
        whyItMatters:
          'Meeting density has different meanings if meetings are information intake, decision-making, evaluation, customer response, or coordination work.',
      },
      {
        id: 'mc_time_001',
        slot: 'time',
        question:
          'How long is recovery time after meetings, and is short recovery time actually available in the schedule?',
        whyItMatters:
          'The hypothesis changes if the issue is total workload, meeting sequencing, recovery access, or end-of-day depletion.',
      },
      {
        id: 'mc_environment_001',
        slot: 'environment',
        question:
          'What meeting environment factors are present, such as camera expectation, interruption, sensory load, decision speed, or informal chat?',
        whyItMatters:
          'The same meeting count can have different functional meaning depending on environmental demands and participation rules.',
      },
      {
        id: 'mc_support_001',
        slot: 'support',
        question:
          'Is there a support route that can translate health-time information into scheduling, role, and evaluation questions without forcing disclosure?',
        whyItMatters:
          'Support is not valid merely because it exists; the kernel needs to know whether it can translate the issue into work conditions.',
      },
      {
        id: 'mc_institution_001',
        slot: 'institution',
        question:
          'Who can change meeting cadence, role expectations, break rules, or evaluation treatment?',
        whyItMatters:
          'A provisional insight is only actionable if the implementation actor and decision owner are visible.',
      },
      {
        id: 'mc_source_lens_001',
        slot: 'source_lens',
        question:
          'What would the employer, support staff, and any health actor say about the same meeting pattern?',
        whyItMatters:
          'Axiom must preserve source-lens differences instead of averaging them into one explanation.',
      },
    ],
    implementationActorConditions: [
      {
        actor: 'worker',
        condition:
          'Can describe which meeting moments produce depletion without being asked to prove a diagnosis.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_person_001', 'mc_job_001', 'mc_time_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Has authority to inspect meeting density, role assignment, recovery access, and evaluation expectations.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_environment_001', 'mc_institution_001'],
      },
      {
        actor: 'support_staff',
        condition:
          'Can translate health-time and work-density information into questions while preserving consent and source-lens boundaries.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_support_001', 'mc_source_lens_001'],
      },
    ],
    sourceLensStatus: {
      respondent_data: {
        lens: 'respondent_data',
        status: 'present_in_synthetic_fixture',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Synthetic respondent-like statement only; no sensitive raw case text is used.',
      },
      supporter_data: {
        lens: 'supporter_data',
        status: 'thin_or_missing',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Supporter lens is intentionally missing and routed to missing context.',
      },
      external_evidence: {
        lens: 'external_evidence',
        status: 'bootstrap_prior_only',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Falcon Stage 1 and L3 materials are bootstrap priors, not Axiom core truth.',
      },
      implementation_actor_conditions: {
        lens: 'implementation_actor_conditions',
        status: 'present_in_synthetic_fixture',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        note: 'Actor conditions are provisional and require review before recommendation or promotion.',
      },
    },
    actionabilityBand: 'usable_provisional_insight',
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
        'Does this contract preserve useful provisional FCHMA insight while blocking finality, promotion, public release, and learning updates?',
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

export function validateAxiomInteractionHypothesisKernelContract(
  kernel: AxiomInteractionHypothesisKernel,
): AxiomInteractionHypothesisKernelValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  pushIf(
    kernel.objectType !== 'axiom_interaction_hypothesis_kernel',
    errors,
    'object_type_must_be_axiom_interaction_hypothesis_kernel',
  );
  pushIf(
    kernel.contractVersion !== AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION,
    errors,
    'contract_version_must_match_axiom_v0_2026_06_07',
  );
  pushIf(kernel.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    kernel.coreProgressClass !== 'kernel_build',
    errors,
    'first_axiom_contract_must_be_kernel_build_not_delivery_layer',
  );
  pushIf(
    kernel.boundary !== AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    errors,
    'boundary_must_remain_non_runtime_kernel_build',
  );
  pushIf(
    kernel.status !== 'axiom_kernel_candidate_requires_eval',
    errors,
    'status_must_remain_axiom_kernel_candidate_requires_eval',
  );
  pushIf(
    !AXIOM_KERNEL_INPUT_MODES.includes(kernel.inputMode),
    errors,
    'input_mode_must_remain_non_runtime_fixture',
  );

  const missingBootstrap = missingValues(kernel.bootstrapStatus, AXIOM_REQUIRED_BOOTSTRAP_LABELS);
  pushIf(
    missingBootstrap.length > 0,
    errors,
    `bootstrap_status_missing:${missingBootstrap.join(',')}`,
  );

  pushIf(kernel.observation.length === 0, errors, 'observation_required');
  pushIf(kernel.inference.length === 0, errors, 'inference_required');
  pushIf(kernel.counterHypothesis.length === 0, errors, 'counter_hypothesis_required');
  pushIf(kernel.missingContext.length === 0, errors, 'missing_context_required');
  pushIf(
    kernel.implementationActorConditions.length === 0,
    errors,
    'implementation_actor_conditions_required',
  );
  pushIf(kernel.cannotYetSay.length === 0, errors, 'cannot_yet_say_required');

  for (const observation of kernel.observation) {
    pushIf(!hasNonEmptyText(observation.id), errors, 'observation_id_required');
    pushIf(
      !hasNonEmptyText(observation.text),
      errors,
      `observation_text_required:${observation.id}`,
    );
    pushIf(
      !hasNonEmptyText(observation.evidencePointer),
      errors,
      `observation_evidence_pointer_required:${observation.id}`,
    );
  }

  const observationIds = new Set(kernel.observation.map((observation) => observation.id));
  for (const inference of kernel.inference) {
    pushIf(!hasNonEmptyText(inference.text), errors, `inference_text_required:${inference.id}`);
    pushIf(
      inference.statusLabel !== 'provisional_not_reviewed',
      errors,
      `inference_must_remain_provisional_not_reviewed:${inference.id}`,
    );
    pushIf(
      inference.observationIds.some((id) => !observationIds.has(id)),
      errors,
      `inference_observation_ids_must_point_to_observation:${inference.id}`,
    );
    pushIf(
      inference.principalPatternCandidateIds.length === 0,
      errors,
      `inference_principal_pattern_candidates_required:${inference.id}`,
    );
    pushIf(
      inference.crossCuttingCheckIds.length === 0,
      errors,
      `inference_cross_cutting_checks_required:${inference.id}`,
    );
  }

  const missingContextIds = new Set(kernel.missingContext.map((context) => context.id));
  for (const counter of kernel.counterHypothesis) {
    pushIf(
      !hasNonEmptyText(counter.text),
      errors,
      `counter_hypothesis_text_required:${counter.id}`,
    );
    pushIf(
      counter.wouldChange.length === 0,
      errors,
      `counter_hypothesis_would_change_required:${counter.id}`,
    );
  }

  for (const context of kernel.missingContext) {
    pushIf(
      !hasNonEmptyText(context.question),
      errors,
      `missing_context_question_required:${context.id}`,
    );
    pushIf(
      !hasNonEmptyText(context.whyItMatters),
      errors,
      `missing_context_why_it_matters_required:${context.id}`,
    );
  }

  for (const actorCondition of kernel.implementationActorConditions) {
    pushIf(
      !hasNonEmptyText(actorCondition.condition),
      errors,
      `implementation_actor_condition_text_required:${actorCondition.actor}`,
    );
    pushIf(
      actorCondition.missingContextIds.some((id) => !missingContextIds.has(id)),
      errors,
      `implementation_actor_condition_missing_context_ids_invalid:${actorCondition.actor}`,
    );
  }

  for (const lens of AXIOM_SOURCE_LENSES) {
    const status = kernel.sourceLensStatus[lens];
    pushIf(!status, errors, `source_lens_status_required:${lens}`);

    if (status) {
      pushIf(status.lens !== lens, errors, `source_lens_status_lens_mismatch:${lens}`);
      pushIf(
        status.sourceValidity !== 'not_decided' ||
          status.supportValidity !== 'not_decided' ||
          status.publicUse !== 'not_public_approved',
        errors,
        `source_lens_status_must_not_approve_validity_or_public_use:${lens}`,
      );
      pushIf(!hasNonEmptyText(status.note), errors, `source_lens_note_required:${lens}`);
    }
  }

  pushIf(
    !AXIOM_ACTIONABILITY_BANDS.includes(kernel.actionabilityBand),
    errors,
    'actionability_band_must_be_known_axiom_band',
  );
  pushIf(
    !hasRequiredCannotYetSay(kernel.cannotYetSay),
    errors,
    'cannot_yet_say_must_block_medical_legal_employment_accommodation_support_public_runtime_finality',
  );

  const reviewRoute = kernel.humanReviewRoute;
  pushIf(
    reviewRoute.reviewUnit !== 'kernel_contract',
    errors,
    'review_unit_must_be_kernel_contract',
  );
  pushIf(
    reviewRoute.reviewUnitScale !== 'framework_unit_not_instance_hypothesis',
    errors,
    'review_unit_scale_must_not_be_instance_hypothesis_queue',
  );
  pushIf(
    reviewRoute.estimatedCoreReviewUnits < 1 || reviewRoute.estimatedCoreReviewUnits > 100,
    errors,
    'estimated_core_review_units_must_remain_between_1_and_100',
  );
  pushIf(
    reviewRoute.routeStatus !==
      'provisional_internal_generation_allowed_review_required_before_promotion',
    errors,
    'review_route_must_allow_provisional_generation_and_require_review_before_promotion',
  );

  const missingBlocks = missingValues(reviewRoute.blocks, AXIOM_HUMAN_REVIEW_BLOCKS);
  pushIf(
    missingBlocks.length > 0,
    errors,
    `human_review_blocks_missing:${missingBlocks.join(',')}`,
  );

  const missingNonBlocks = missingValues(
    reviewRoute.doesNotBlock,
    AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  );
  pushIf(
    missingNonBlocks.length > 0,
    errors,
    `human_review_nonblocking_items_missing:${missingNonBlocks.join(',')}`,
  );

  pushIf(
    kernel.movementBoundary.runtime !== 'not_changed' ||
      kernel.movementBoundary.prompt !== 'not_changed' ||
      kernel.movementBoundary.retrieval !== 'not_changed' ||
      kernel.movementBoundary.modelProvider !== 'not_changed' ||
      kernel.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    kernel.movementBoundary.sourceValidity !== 'not_decided' ||
      kernel.movementBoundary.supportValidity !== 'not_decided' ||
      kernel.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      kernel.movementBoundary.runtimeApproved !== 'not_approved' ||
      kernel.movementBoundary.publicApproved !== 'not_approved' ||
      kernel.movementBoundary.knowledgePromotion !== 'not_promoted',
    errors,
    'validity_candidate_pattern_runtime_public_or_promotion_must_not_move',
  );

  pushIf(
    kernel.actionabilityBand === 'public_boundary_blocked' &&
      !kernel.humanReviewRoute.blocks.includes('public_release'),
    warnings,
    'public_boundary_blocked_should_route_public_release_to_review',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    warningCount: warnings.length,
    warnings,
    boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    coreProgressClass: kernel.coreProgressClass,
  };
}
