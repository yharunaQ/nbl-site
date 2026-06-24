import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
  AXIOM_REQUIRED_BOOTSTRAP_LABELS,
  AXIOM_SOURCE_LENSES,
  validateAxiomInteractionHypothesisKernelContract,
  type AxiomCoreProgressClass,
  type AxiomHumanReviewBlock,
  type AxiomHumanReviewNonBlocking,
  type AxiomInteractionHypothesisKernel,
  type AxiomMovementBoundary,
  type AxiomSourceLens,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_L3_EVAL_SCENARIO_IDS,
  buildAxiomInteractionHypothesisKernelFixtureForScenario,
  type AxiomL3EvalScenarioId,
} from './interactionHypothesisKernelScenarioFixtures';

export const AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY =
  'axiom_kernel_build_grounding_packet_is_non_runtime_evidence_grounded_kernel_build_not_promotion' as const;

export const AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_human_review_loop',
] as const;

export const AXIOM_KERNEL_GROUNDED_FIELDS = [
  'observation',
  'inference',
  'counterHypothesis',
  'missingContext',
  'implementationActorConditions',
  'sourceLensStatus',
  'actionabilityBand',
  'cannotYetSay',
  'humanReviewRoute',
] as const;

export type AxiomKernelGroundedField = (typeof AXIOM_KERNEL_GROUNDED_FIELDS)[number];

export type AxiomEvidenceFoundationKind =
  | 'non_sensitive_synthetic_scenario'
  | 'shared_evidence_foundation'
  | 'falcon_bootstrap_prior'
  | 'stage1_scima_fchma_output'
  | 'l3_principal_pattern_surface'
  | 'ft03_internal_response_contract'
  | 'falcon_core_weakness_audit';

export type AxiomEvidenceLayer =
  | 'reference_frame'
  | 'evidence'
  | 'structure'
  | 'hypothesis'
  | 'learning_boundary';

export type AxiomEvidenceFoundationRef = {
  id: string;
  kind: AxiomEvidenceFoundationKind;
  uri: string;
  layer: AxiomEvidenceLayer;
  status: 'available_as_bootstrap_prior_requires_axiom_eval';
  containsSensitiveRawText: false;
  allowedAsAxiomCoreTruth: false;
  requiresAxiomEval: true;
  note: string;
};

export type AxiomEvidenceSpanRef = {
  id: string;
  foundationRefId: string;
  lens: AxiomSourceLens;
  summary: string;
  supportsKernelFields: AxiomKernelGroundedField[];
  sourceValidity: 'not_decided';
  supportValidity: 'not_decided';
  publicUse: 'not_public_approved';
  promotionStatus: 'not_promoted';
  containsSensitiveRawText: false;
};

export type AxiomInheritedFrameSource =
  | 'falcon_public_page'
  | 'sns_progress'
  | 'stage1_scima_fchma'
  | 'l3_21_views'
  | 'ft03_contract';

export type AxiomInheritedFrameEvalRoute = {
  id: string;
  source: AxiomInheritedFrameSource;
  status: 'requires_axiom_eval';
  allowedUse: 'bootstrap_prior_only' | 'delivery_reference_only';
  allowedAsAxiomCoreTruth: false;
  reviewerQuestion: string;
};

export type AxiomKernelBuildGroundingInput = {
  inputId: string;
  objectType: 'axiom_kernel_build_grounding_input';
  contractVersion: typeof AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION;
  lane: 'Falcon Lab';
  inputMode: 'evidence_foundation_fixture';
  scenarioId: string;
  sourceFoundationRefs: AxiomEvidenceFoundationRef[];
  evidenceSpans: AxiomEvidenceSpanRef[];
  inheritedFrames: AxiomInheritedFrameEvalRoute[];
  targetReviewUnitCountCap: 100;
  movementBoundary: AxiomMovementBoundary;
};

export type AxiomGroundingRelation =
  | 'direct_observation_basis'
  | 'bootstrap_prior_support'
  | 'inference_requires_observation_bridge'
  | 'counter_hypothesis_requires_disconfirming_question'
  | 'missing_context_question_basis'
  | 'actor_condition_basis'
  | 'source_lens_boundary_basis'
  | 'actionability_band_basis'
  | 'cannot_yet_say_boundary_basis'
  | 'review_route_basis';

export type AxiomKernelGroundingLink = {
  linkId: string;
  kernelField: AxiomKernelGroundedField;
  kernelItemId: string;
  evidenceSpanIds: string[];
  relation: AxiomGroundingRelation;
  groundingStatus:
    | 'grounded_as_non_sensitive_fixture'
    | 'grounded_as_bootstrap_prior_requires_axiom_eval'
    | 'grounded_as_boundary_not_truth';
  note: string;
};

export type AxiomKernelGroundingMap = {
  mapId: string;
  coreProgressClass: Extract<AxiomCoreProgressClass, 'kernel_grounding'>;
  coverage: Record<AxiomKernelGroundedField, 'covered'>;
  groundingLinks: AxiomKernelGroundingLink[];
  notGroundedAsCoreTruth: string[];
};

export type AxiomReviewDrivenPromotionGate = {
  gateId: string;
  coreProgressClass: Extract<AxiomCoreProgressClass, 'kernel_human_review_loop'>;
  promotionReadinessStatus: 'review_required_before_promotion';
  reviewUnitScale: 'principal_pattern_or_frame_unit_not_individual_hypothesis';
  estimatedCoreReviewUnits: number;
  maxCoreHumanReviewUnits: 100;
  unitGroupingBasis: string[];
  blocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  blockedDecisionStatus: {
    sourceValidity: 'not_decided';
    supportValidity: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    publicRelease: 'not_approved';
    learningUpdate: 'not_promoted';
    knowledgePromotion: 'not_promoted';
  };
  reviewerQuestion: string;
};

export type AxiomKernelReviewCompressionUnit = {
  unitId: string;
  unitType:
    | 'kernel_contract'
    | 'actionability_band'
    | 'l3_principal_pattern_family'
    | 'cross_cutting_check_family'
    | 'source_lens_status'
    | 'implementation_actor_conditions'
    | 'review_driven_promotion_gate'
    | 'cannot_yet_say_boundary';
  packetIds: string[];
  scenarioIds: string[];
  reviewQuestion: string;
  blocksPromotion: true;
};

export type AxiomKernelBuildGroundingReviewUnitCompression = {
  compressionId: string;
  objectType: 'axiom_kernel_build_grounding_review_unit_compression';
  lane: 'Falcon Lab';
  coreProgressClass: Extract<AxiomCoreProgressClass, 'kernel_human_review_loop'>;
  packetCount: number;
  scenarioCount: number;
  reviewUnitScale: 'compressed_framework_units_not_individual_hypotheses';
  estimatedCoreReviewUnits: number;
  maxCoreHumanReviewUnits: 100;
  units: AxiomKernelReviewCompressionUnit[];
  blocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  blockedDecisionStatus: AxiomReviewDrivenPromotionGate['blockedDecisionStatus'];
};

export type AxiomKernelBuildGroundingPacket = {
  packetId: string;
  objectType: 'axiom_kernel_build_grounding_packet';
  contractVersion: typeof AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION;
  lane: 'Falcon Lab';
  boundary: typeof AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES;
  inheritedKernelBoundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY;
  input: AxiomKernelBuildGroundingInput;
  kernel: AxiomInteractionHypothesisKernel;
  groundingMap: AxiomKernelGroundingMap;
  reviewDrivenPromotionGate: AxiomReviewDrivenPromotionGate;
  movementBoundary: AxiomMovementBoundary;
  notNow: string[];
};

export type AxiomKernelBuildGroundingPacketValidation = {
  valid: boolean;
  validationStatus: 'build_grounding_contract_valid' | 'build_grounding_contract_invalid';
  errorCount: number;
  errors: string[];
  warningCount: number;
  warnings: string[];
  boundary: typeof AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY;
  coreProgressClasses: typeof AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES;
};

export type AxiomKernelBuildGroundingPacketFromKernelOptions = {
  input: AxiomKernelBuildGroundingInput;
  kernel: AxiomInteractionHypothesisKernel;
  packetId: string;
  mapId: string;
  notGroundedAsCoreTruth?: string[];
  notNow?: string[];
};

const UNCHANGED_MOVEMENT_BOUNDARY: AxiomMovementBoundary = {
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
};

type AxiomBuildGroundingScenarioSeed = {
  scenarioId: AxiomL3EvalScenarioId;
  slug: string;
  syntheticFoundationId: string;
  syntheticSpanId: string;
  patternPriorSpanId: string;
  patternMappingSpanId: string;
  signalSummary: string;
  priorSummary: string;
  mappingSummary: string;
};

const AXIOM_BUILD_GROUNDING_SCENARIO_SEEDS: Record<
  AxiomL3EvalScenarioId,
  AxiomBuildGroundingScenarioSeed
> = {
  l3_health_time_accommodation_lookup_trap_v0: {
    scenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
    slug: 'health_time',
    syntheticFoundationId: 'foundation_non_sensitive_synthetic_health_time_scenario',
    syntheticSpanId: 'span_synthetic_respondent_health_time',
    patternPriorSpanId: 'span_l3_health_time_pattern_prior',
    patternMappingSpanId: 'span_l3_principal_pattern_mapping',
    signalSummary:
      'Non-sensitive worker-like scenario signal: fatigue appears after dense online meeting sequences.',
    priorSummary:
      'The health-time scenario expects condition-window reasoning instead of disease-to-support lookup.',
    mappingSummary:
      'L3 IDs map the provisional reading to health time, work-density contact points, and anti-lookup checks.',
  },
  l3_disclosure_information_procedure_boundary_v0: {
    scenarioId: 'l3_disclosure_information_procedure_boundary_v0',
    slug: 'disclosure_procedure',
    syntheticFoundationId: 'foundation_non_sensitive_synthetic_disclosure_procedure_scenario',
    syntheticSpanId: 'span_synthetic_disclosure_procedure_scenario_signal',
    patternPriorSpanId: 'span_l3_disclosure_procedure_pattern_prior',
    patternMappingSpanId: 'span_l3_disclosure_procedure_principal_pattern_mapping',
    signalSummary:
      'Non-sensitive support-staff scenario signal: errors are tied to mixed instructions, informal updates, and disclosure-boundary uncertainty.',
    priorSummary:
      'The disclosure/procedure scenario expects separation of disclosure amount from work-procedure, consent, safety, and evaluation design.',
    mappingSummary:
      'L3 IDs map the provisional reading to disclosure boundary, procedure synchronization, and source-lens checks.',
  },
  l3_policy_service_coordination_source_lens_v0: {
    scenarioId: 'l3_policy_service_coordination_source_lens_v0',
    slug: 'policy_service_coordination',
    syntheticFoundationId: 'foundation_non_sensitive_synthetic_policy_service_coordination_scenario',
    syntheticSpanId: 'span_synthetic_policy_service_coordination_scenario_signal',
    patternPriorSpanId: 'span_l3_policy_service_coordination_pattern_prior',
    patternMappingSpanId: 'span_l3_policy_service_coordination_principal_pattern_mapping',
    signalSummary:
      'Non-sensitive policy/service scenario signal: coordination is requested across employers, support agencies, and public institutions.',
    priorSummary:
      'The policy/service scenario expects source-lens and implementation-actor reasoning instead of approved policy recommendation.',
    mappingSummary:
      'L3 IDs map the provisional reading to decision-owner, service handoff, source currentness, and institutional constraint checks.',
  },
  l3_public_condition_window_non_lookup_v0: {
    scenarioId: 'l3_public_condition_window_non_lookup_v0',
    slug: 'public_condition_window',
    syntheticFoundationId: 'foundation_non_sensitive_synthetic_public_condition_window_scenario',
    syntheticSpanId: 'span_synthetic_public_condition_window_scenario_signal',
    patternPriorSpanId: 'span_l3_public_condition_window_pattern_prior',
    patternMappingSpanId: 'span_l3_public_condition_window_principal_pattern_mapping',
    signalSummary:
      'Non-sensitive public-site scenario signal: a disease or disability category page asks what workplace support is usually needed.',
    priorSummary:
      'The public condition-window scenario expects disease-to-support lookup to be blocked and reframed as multiple work-contact points.',
    mappingSummary:
      'L3 IDs map the provisional reading to public boundary, condition-window, case-route, and anti-lookup checks.',
  },
  l3_post_hiring_quality_evaluation_loop_v0: {
    scenarioId: 'l3_post_hiring_quality_evaluation_loop_v0',
    slug: 'post_hiring_quality',
    syntheticFoundationId: 'foundation_non_sensitive_synthetic_post_hiring_quality_scenario',
    syntheticSpanId: 'span_synthetic_post_hiring_quality_scenario_signal',
    patternPriorSpanId: 'span_l3_post_hiring_quality_pattern_prior',
    patternMappingSpanId: 'span_l3_post_hiring_quality_principal_pattern_mapping',
    signalSummary:
      'Non-sensitive briefing scenario signal: employment-number improvement is treated as a possible success claim needing critique.',
    priorSummary:
      'The post-hiring quality scenario expects employment status to be separated from participation quality, role, evaluation, growth, and worker-benefit evidence.',
    mappingSummary:
      'L3 IDs map the provisional reading to employment quality, evaluation loop, growth route, and outcome-evidence checks.',
  },
};

type AxiomResolvedGroundingSpanIds = {
  syntheticObservation: string;
  patternPrior: string;
  patternMapping: string;
  ft03Separation: string;
  falconAudit: string;
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function includesEvery<T extends string>(actual: readonly T[], expected: readonly T[]): boolean {
  return expected.every((value) => actual.includes(value));
}

function movementBoundaryIsUnchanged(boundary: AxiomMovementBoundary): boolean {
  return Object.entries(UNCHANGED_MOVEMENT_BOUNDARY).every(
    ([key, expected]) => boundary[key as keyof AxiomMovementBoundary] === expected,
  );
}

export function buildAxiomKernelBuildGroundingInputFixtureForScenario(
  scenarioId: AxiomL3EvalScenarioId,
): AxiomKernelBuildGroundingInput {
  const seed = AXIOM_BUILD_GROUNDING_SCENARIO_SEEDS[scenarioId];

  return {
    inputId: `axiom_kernel_build_grounding_input_${seed.slug}_v0_2026_06_08`,
    objectType: 'axiom_kernel_build_grounding_input',
    contractVersion: AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION,
    lane: 'Falcon Lab',
    inputMode: 'evidence_foundation_fixture',
    scenarioId: seed.scenarioId,
    sourceFoundationRefs: [
      {
        id: seed.syntheticFoundationId,
        kind: 'non_sensitive_synthetic_scenario',
        uri: 'data/specs/axiom/axiom_kernel_build_grounding_input.fixture-v0-2026-06-08.json',
        layer: 'evidence',
        status: 'available_as_bootstrap_prior_requires_axiom_eval',
        containsSensitiveRawText: false,
        allowedAsAxiomCoreTruth: false,
        requiresAxiomEval: true,
        note: 'A non-sensitive scenario carrier for deterministic kernel-build tests.',
      },
      {
        id: 'foundation_falcon_core_eval_profile',
        kind: 'falcon_bootstrap_prior',
        uri: 'data/specs/quality/falcon_expert_agent.core_eval_profile-v0-2026-06-07.json',
        layer: 'evidence',
        status: 'available_as_bootstrap_prior_requires_axiom_eval',
        containsSensitiveRawText: false,
        allowedAsAxiomCoreTruth: false,
        requiresAxiomEval: true,
        note: 'Falcon L3 eval expectations are bootstrap priors for Axiom eval, not Axiom truth.',
      },
      {
        id: 'foundation_stage1_l3_principal_patterns',
        kind: 'l3_principal_pattern_surface',
        uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
        layer: 'structure',
        status: 'available_as_bootstrap_prior_requires_axiom_eval',
        containsSensitiveRawText: false,
        allowedAsAxiomCoreTruth: false,
        requiresAxiomEval: true,
        note: 'L3 principal patterns seed pattern IDs and cross-cutting checks without promotion.',
      },
      {
        id: 'foundation_ft03_response_contract',
        kind: 'ft03_internal_response_contract',
        uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft03-internal-expert-agent-response-contract-v0-2026-05-25.md',
        layer: 'reference_frame',
        status: 'available_as_bootstrap_prior_requires_axiom_eval',
        containsSensitiveRawText: false,
        allowedAsAxiomCoreTruth: false,
        requiresAxiomEval: true,
        note: 'FT03 supplies observation/inference separation and boundary discipline.',
      },
      {
        id: 'foundation_falcon_core_weakness_audit',
        kind: 'falcon_core_weakness_audit',
        uri: 'docs/nbl-workspace/falcon-expert-agent-core-weakness-audit-and-v2-rebuild-2026-06-07.md',
        layer: 'learning_boundary',
        status: 'available_as_bootstrap_prior_requires_axiom_eval',
        containsSensitiveRawText: false,
        allowedAsAxiomCoreTruth: false,
        requiresAxiomEval: true,
        note: 'The audit fixes the target: kernel build, grounding, eval, display, and review loop only.',
      },
    ],
    evidenceSpans: [
      {
        id: seed.syntheticSpanId,
        foundationRefId: seed.syntheticFoundationId,
        lens: 'respondent_data',
        summary: seed.signalSummary,
        supportsKernelFields: ['observation', 'missingContext'],
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        promotionStatus: 'not_promoted',
        containsSensitiveRawText: false,
      },
      {
        id: seed.patternPriorSpanId,
        foundationRefId: 'foundation_falcon_core_eval_profile',
        lens: 'external_evidence',
        summary: seed.priorSummary,
        supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        promotionStatus: 'not_promoted',
        containsSensitiveRawText: false,
      },
      {
        id: seed.patternMappingSpanId,
        foundationRefId: 'foundation_stage1_l3_principal_patterns',
        lens: 'external_evidence',
        summary: seed.mappingSummary,
        supportsKernelFields: ['inference', 'counterHypothesis', 'sourceLensStatus'],
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        promotionStatus: 'not_promoted',
        containsSensitiveRawText: false,
      },
      {
        id: 'span_ft03_separation_contract',
        foundationRefId: 'foundation_ft03_response_contract',
        lens: 'implementation_actor_conditions',
        summary:
          'FT03 requires observation, inference, missing context, implementation actors, and cannot-yet-say boundaries to remain separate.',
        supportsKernelFields: [
          'inference',
          'counterHypothesis',
          'missingContext',
          'implementationActorConditions',
          'cannotYetSay',
          'humanReviewRoute',
        ],
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        promotionStatus: 'not_promoted',
        containsSensitiveRawText: false,
      },
      {
        id: 'span_falcon_audit_kernel_gap',
        foundationRefId: 'foundation_falcon_core_weakness_audit',
        lens: 'implementation_actor_conditions',
        summary:
          'The rebuild audit says progress counts only when kernel build, eval, grounding, display, or human-review loop improves.',
        supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        publicUse: 'not_public_approved',
        promotionStatus: 'not_promoted',
        containsSensitiveRawText: false,
      },
    ],
    inheritedFrames: [
      {
        id: 'inherited_falcon_public_page_skeleton',
        source: 'falcon_public_page',
        status: 'requires_axiom_eval',
        allowedUse: 'delivery_reference_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          'Which public-page frame is only a delivery skeleton, and which part has passed Axiom kernel evaluation?',
      },
      {
        id: 'inherited_sns_progress',
        source: 'sns_progress',
        status: 'requires_axiom_eval',
        allowedUse: 'delivery_reference_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          'Which social signal can seed a question without becoming evidence or learning input?',
      },
      {
        id: 'inherited_stage1_scima_fchma_outputs',
        source: 'stage1_scima_fchma',
        status: 'requires_axiom_eval',
        allowedUse: 'bootstrap_prior_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          'Which Stage 1 structure can be reused as a bootstrap prior while preserving Axiom eval requirements?',
      },
      {
        id: 'inherited_l3_21_views',
        source: 'l3_21_views',
        status: 'requires_axiom_eval',
        allowedUse: 'bootstrap_prior_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          'Which 21-view condensation should become a review unit instead of hundreds of individual hypotheses?',
      },
      {
        id: 'inherited_ft03_contract',
        source: 'ft03_contract',
        status: 'requires_axiom_eval',
        allowedUse: 'bootstrap_prior_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          'Which FT03 response discipline should be enforced before any runtime or public use?',
      },
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomKernelBuildGroundingInputFixture(): AxiomKernelBuildGroundingInput {
  return buildAxiomKernelBuildGroundingInputFixtureForScenario(
    'l3_health_time_accommodation_lookup_trap_v0',
  );
}

function resolveGroundingSpanIds(input: AxiomKernelBuildGroundingInput): AxiomResolvedGroundingSpanIds {
  const syntheticObservation = input.evidenceSpans.find(
    (span) => span.lens === 'respondent_data' && span.supportsKernelFields.includes('observation'),
  ) ?? input.evidenceSpans.find(
    (span) => span.supportsKernelFields.includes('observation'),
  );
  const patternPrior = input.evidenceSpans.find(
    (span) =>
      span.lens === 'external_evidence' && span.supportsKernelFields.includes('actionabilityBand'),
  );
  const patternMapping = input.evidenceSpans.find(
    (span) =>
      span.lens === 'external_evidence' &&
      span.supportsKernelFields.includes('counterHypothesis') &&
      span.supportsKernelFields.includes('sourceLensStatus'),
  );
  const ft03Separation = input.evidenceSpans.find(
    (span) =>
      span.foundationRefId === 'foundation_ft03_response_contract' &&
      span.supportsKernelFields.includes('humanReviewRoute'),
  );
  const falconAudit = input.evidenceSpans.find(
    (span) => span.foundationRefId === 'foundation_falcon_core_weakness_audit',
  );

  if (!syntheticObservation || !patternPrior || !patternMapping || !ft03Separation || !falconAudit) {
    throw new Error(`axiom_grounding_span_resolution_failed:${input.scenarioId}`);
  }

  return {
    syntheticObservation: syntheticObservation.id,
    patternPrior: patternPrior.id,
    patternMapping: patternMapping.id,
    ft03Separation: ft03Separation.id,
    falconAudit: falconAudit.id,
  };
}

function assertAxiomL3ScenarioId(scenarioId: string): AxiomL3EvalScenarioId {
  if (AXIOM_L3_EVAL_SCENARIO_IDS.includes(scenarioId as AxiomL3EvalScenarioId)) {
    return scenarioId as AxiomL3EvalScenarioId;
  }

  throw new Error(`unknown_axiom_l3_eval_scenario:${scenarioId}`);
}

function buildGroundingLinks(
  kernel: AxiomInteractionHypothesisKernel,
  spanIds: AxiomResolvedGroundingSpanIds,
  input: AxiomKernelBuildGroundingInput,
): AxiomKernelGroundingLink[] {
  const inputEvidenceSpanIds = new Set(input.evidenceSpans.map((span) => span.id));
  const observationLinks: AxiomKernelGroundingLink[] = kernel.observation.map((observation) => {
    const isRespondentSignal = observation.lens === 'respondent_data';
    const evidenceSpanId = inputEvidenceSpanIds.has(observation.evidencePointer)
      ? observation.evidencePointer
      : isRespondentSignal
        ? spanIds.syntheticObservation
        : spanIds.patternPrior;

    return {
      linkId: `ground_${observation.id}`,
      kernelField: 'observation',
      kernelItemId: observation.id,
      evidenceSpanIds: [evidenceSpanId],
      relation: isRespondentSignal ? 'direct_observation_basis' : 'bootstrap_prior_support',
      groundingStatus: isRespondentSignal
        ? 'grounded_as_non_sensitive_fixture'
        : 'grounded_as_bootstrap_prior_requires_axiom_eval',
      note: isRespondentSignal
        ? 'The observation is only a non-sensitive fixture signal and cannot become case truth.'
        : 'Falcon material is inherited as bootstrap prior and still requires Axiom eval.',
    };
  });

  const inferenceLinks: AxiomKernelGroundingLink[] = kernel.inference.map((inference) => ({
    linkId: `ground_${inference.id}`,
    kernelField: 'inference',
    kernelItemId: inference.id,
    evidenceSpanIds: [spanIds.patternPrior, spanIds.patternMapping, spanIds.ft03Separation],
    relation: 'inference_requires_observation_bridge',
    groundingStatus: 'grounded_as_bootstrap_prior_requires_axiom_eval',
    note: 'The inference must remain provisional and tied back to observation plus pattern priors.',
  }));

  const counterLinks: AxiomKernelGroundingLink[] = kernel.counterHypothesis.map((counter) => ({
    linkId: `ground_${counter.id}`,
    kernelField: 'counterHypothesis',
    kernelItemId: counter.id,
    evidenceSpanIds: [spanIds.patternMapping, spanIds.ft03Separation],
    relation: 'counter_hypothesis_requires_disconfirming_question',
    groundingStatus: 'grounded_as_boundary_not_truth',
    note: 'The counter-hypothesis is a required disconfirmation route, not a competing final claim.',
  }));

  const missingContextLinks: AxiomKernelGroundingLink[] = kernel.missingContext.map((context) => ({
    linkId: `ground_${context.id}`,
    kernelField: 'missingContext',
    kernelItemId: context.id,
    evidenceSpanIds: [spanIds.syntheticObservation, spanIds.ft03Separation],
    relation: 'missing_context_question_basis',
    groundingStatus: 'grounded_as_boundary_not_truth',
    note: 'Missing-context questions are grounded as resolution requirements, not as conclusions.',
  }));

  const actorConditionLinks: AxiomKernelGroundingLink[] = kernel.implementationActorConditions.map(
    (condition) => ({
      linkId: `ground_actor_${condition.actor}`,
      kernelField: 'implementationActorConditions',
      kernelItemId: condition.actor,
      evidenceSpanIds: [spanIds.ft03Separation],
      relation: 'actor_condition_basis',
      groundingStatus: 'grounded_as_boundary_not_truth',
      note: 'Actor conditions show who must be visible before actionability rises.',
    }),
  );

  const sourceLensLinks: AxiomKernelGroundingLink[] = AXIOM_SOURCE_LENSES.map((lens) => ({
    linkId: `ground_source_lens_${lens}`,
    kernelField: 'sourceLensStatus',
    kernelItemId: lens,
    evidenceSpanIds: [spanIds.patternMapping, spanIds.falconAudit],
    relation: 'source_lens_boundary_basis',
    groundingStatus: 'grounded_as_boundary_not_truth',
    note: 'Source-lens status preserves lens strength and missingness before validity review.',
  }));

  return [
    ...observationLinks,
    ...inferenceLinks,
    ...counterLinks,
    ...missingContextLinks,
    ...actorConditionLinks,
    ...sourceLensLinks,
    {
      linkId: 'ground_actionability_band',
      kernelField: 'actionabilityBand',
      kernelItemId: kernel.actionabilityBand,
      evidenceSpanIds: [spanIds.patternPrior, spanIds.ft03Separation],
      relation: 'actionability_band_basis',
      groundingStatus: 'grounded_as_boundary_not_truth',
      note: 'Actionability is provisional because actor conditions and missing context are visible.',
    },
    {
      linkId: 'ground_cannot_yet_say',
      kernelField: 'cannotYetSay',
      kernelItemId: 'cannot_yet_say_boundary',
      evidenceSpanIds: [spanIds.ft03Separation, spanIds.falconAudit],
      relation: 'cannot_yet_say_boundary_basis',
      groundingStatus: 'grounded_as_boundary_not_truth',
      note: 'Cannot-yet-say boundaries block medical, legal, support-validity, public, runtime, and promotion claims.',
    },
    {
      linkId: 'ground_human_review_route',
      kernelField: 'humanReviewRoute',
      kernelItemId: kernel.humanReviewRoute.reviewUnit,
      evidenceSpanIds: [spanIds.ft03Separation, spanIds.falconAudit],
      relation: 'review_route_basis',
      groundingStatus: 'grounded_as_boundary_not_truth',
      note: 'The review route gates promotion and finality while allowing provisional kernel work.',
    },
  ];
}

function buildReviewDrivenPromotionGate(): AxiomReviewDrivenPromotionGate {
  return {
    gateId: 'axiom_review_driven_promotion_gate_framework_units_v0_2026_06_08',
    coreProgressClass: 'kernel_human_review_loop',
    promotionReadinessStatus: 'review_required_before_promotion',
    reviewUnitScale: 'principal_pattern_or_frame_unit_not_individual_hypothesis',
    estimatedCoreReviewUnits: 27,
    maxCoreHumanReviewUnits: 100,
    unitGroupingBasis: [
      '21_views_or_principal_pattern_condensation',
      '27_frame_grade_review_units',
      'source_lens_validity_review_units',
      'implementation_actor_condition_review_units',
    ],
    blocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    blockedDecisionStatus: {
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
      knowledgePromotion: 'not_promoted',
    },
    reviewerQuestion:
      'Which compressed frame-level units are ready for source/support review before any candidate-pattern, public, runtime, or learning movement?',
  };
}

export function buildAxiomKernelBuildGroundingPacket(
  input: AxiomKernelBuildGroundingInput = buildAxiomKernelBuildGroundingInputFixture(),
): AxiomKernelBuildGroundingPacket {
  const scenarioId = assertAxiomL3ScenarioId(input.scenarioId);
  const spanIds = resolveGroundingSpanIds(input);
  const baseKernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(scenarioId);
  const kernel: AxiomInteractionHypothesisKernel = {
    ...baseKernel,
    kernelId: baseKernel.kernelId.replace('axiom_kernel_fixture_', 'axiom_kernel_grounded_'),
    inputMode: 'evidence_foundation_fixture',
    observation: baseKernel.observation.map((observation) => ({
      ...observation,
      evidencePointer:
        observation.lens === 'respondent_data' ? spanIds.syntheticObservation : spanIds.patternPrior,
      statusLabel:
        observation.lens === 'respondent_data'
          ? 'shared_evidence_foundation'
          : observation.statusLabel,
    })),
    sourceLensStatus: {
      respondent_data: {
        ...baseKernel.sourceLensStatus.respondent_data,
        status: 'present_in_evidence_foundation_fixture',
        note: 'Respondent-like signal is represented only as a non-sensitive evidence foundation fixture.',
      },
      supporter_data: {
        ...baseKernel.sourceLensStatus.supporter_data,
        status: 'thin_or_missing',
        note: 'Supporter lens remains missing and must be routed to missing context before promotion.',
      },
      external_evidence: {
        ...baseKernel.sourceLensStatus.external_evidence,
        status: 'bootstrap_prior_only',
        note: 'Falcon Stage 1, L3, and FT03 materials remain bootstrap priors that require Axiom eval.',
      },
      implementation_actor_conditions: {
        ...baseKernel.sourceLensStatus.implementation_actor_conditions,
        status: 'present_in_evidence_foundation_fixture',
        note: 'Actor conditions are grounded as review and actionability boundaries, not recommendations.',
      },
    },
  };

  return buildAxiomKernelBuildGroundingPacketFromKernel({
    input,
    kernel,
    packetId: `axiom_kernel_build_grounding_packet_${scenarioId}_v0_2026_06_08`,
    mapId: `axiom_kernel_grounding_map_${scenarioId}_v0_2026_06_08`,
  });
}

export function buildAxiomKernelBuildGroundingPacketFromKernel({
  input,
  kernel,
  packetId,
  mapId,
  notGroundedAsCoreTruth = [
    'falcon_public_page',
    'sns_progress',
    'stage1_scima_fchma_without_axiom_eval',
    'l3_21_views_without_axiom_eval',
    'ft03_contract_without_axiom_eval',
  ],
  notNow = [
    'no_public_page_filling',
    'no_public_navigation',
    'no_publication',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_source_or_support_validity_decision',
    'no_candidate_pattern_or_learning_update',
  ],
}: AxiomKernelBuildGroundingPacketFromKernelOptions): AxiomKernelBuildGroundingPacket {
  const spanIds = resolveGroundingSpanIds(input);

  return {
    packetId,
    objectType: 'axiom_kernel_build_grounding_packet',
    contractVersion: AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION,
    lane: 'Falcon Lab',
    boundary: AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES],
    inheritedKernelBoundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    input,
    kernel,
    groundingMap: {
      mapId,
      coreProgressClass: 'kernel_grounding',
      coverage: {
        observation: 'covered',
        inference: 'covered',
        counterHypothesis: 'covered',
        missingContext: 'covered',
        implementationActorConditions: 'covered',
        sourceLensStatus: 'covered',
        actionabilityBand: 'covered',
        cannotYetSay: 'covered',
        humanReviewRoute: 'covered',
      },
      groundingLinks: buildGroundingLinks(kernel, spanIds, input),
      notGroundedAsCoreTruth,
    },
    reviewDrivenPromotionGate: buildReviewDrivenPromotionGate(),
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
    notNow,
  };
}

export function buildAllAxiomKernelBuildGroundingPackets(): AxiomKernelBuildGroundingPacket[] {
  return AXIOM_L3_EVAL_SCENARIO_IDS.map((scenarioId) =>
    buildAxiomKernelBuildGroundingPacket(
      buildAxiomKernelBuildGroundingInputFixtureForScenario(scenarioId),
    ),
  );
}

export function buildAxiomKernelBuildGroundingReviewUnitCompression(
  packets: AxiomKernelBuildGroundingPacket[] = buildAllAxiomKernelBuildGroundingPackets(),
): AxiomKernelBuildGroundingReviewUnitCompression {
  const packetIds = packets.map((packet) => packet.packetId);
  const scenarioIds = packets.map((packet) => packet.input.scenarioId);
  const unitSeeds: Omit<AxiomKernelReviewCompressionUnit, 'packetIds' | 'scenarioIds'>[] = [
    {
      unitId: 'review_unit_kernel_contract',
      unitType: 'kernel_contract',
      reviewQuestion:
        'Does the interaction-hypothesis kernel contract preserve observation, inference, counter-hypothesis, missing context, source-lens, actionability, and review-route separation across scenarios?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_actionability_bands',
      unitType: 'actionability_band',
      reviewQuestion:
        'Are actionability bands assigned from visible evidence, missing context, and actor conditions rather than advice confidence?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_l3_principal_pattern_family',
      unitType: 'l3_principal_pattern_family',
      reviewQuestion:
        'Do L3 principal patterns function as bootstrap pattern candidates requiring Axiom eval rather than promoted Axiom doctrine?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_cross_cutting_check_family',
      unitType: 'cross_cutting_check_family',
      reviewQuestion:
        'Do cross-cutting checks prevent disease lookup, source-lens flattening, public-boundary drift, and finality claims across scenarios?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_source_lens_status',
      unitType: 'source_lens_status',
      reviewQuestion:
        'Are respondent, supporter, external evidence, and implementation actor lenses kept distinct with missingness visible?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_implementation_actor_conditions',
      unitType: 'implementation_actor_conditions',
      reviewQuestion:
        'Do implementation actor conditions show who must be visible before any provisional insight can become action guidance?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_review_driven_promotion_gate',
      unitType: 'review_driven_promotion_gate',
      reviewQuestion:
        'Does the promotion gate block source/support validity, candidate-pattern, runtime/public approval, publication, and learning update while allowing provisional kernel work?',
      blocksPromotion: true,
    },
    {
      unitId: 'review_unit_cannot_yet_say_boundary',
      unitType: 'cannot_yet_say_boundary',
      reviewQuestion:
        'Are medical, legal, employment, accommodation, support-validity, public, runtime, and learning boundaries explicit across scenarios?',
      blocksPromotion: true,
    },
  ];

  return {
    compressionId: 'axiom_kernel_build_grounding_review_unit_compression_v0_2026_06_08',
    objectType: 'axiom_kernel_build_grounding_review_unit_compression',
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_human_review_loop',
    packetCount: packets.length,
    scenarioCount: new Set(scenarioIds).size,
    reviewUnitScale: 'compressed_framework_units_not_individual_hypotheses',
    estimatedCoreReviewUnits: unitSeeds.length,
    maxCoreHumanReviewUnits: 100,
    units: unitSeeds.map((unit) => ({
      ...unit,
      packetIds,
      scenarioIds,
    })),
    blocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    blockedDecisionStatus: buildReviewDrivenPromotionGate().blockedDecisionStatus,
  };
}

function buildKernelItemIdsByField(
  kernel: AxiomInteractionHypothesisKernel,
): Record<AxiomKernelGroundedField, Set<string>> {
  return {
    observation: new Set(kernel.observation.map((observation) => observation.id)),
    inference: new Set(kernel.inference.map((inference) => inference.id)),
    counterHypothesis: new Set(kernel.counterHypothesis.map((counter) => counter.id)),
    missingContext: new Set(kernel.missingContext.map((context) => context.id)),
    implementationActorConditions: new Set(
      kernel.implementationActorConditions.map((condition) => condition.actor),
    ),
    sourceLensStatus: new Set(Object.keys(kernel.sourceLensStatus)),
    actionabilityBand: new Set([kernel.actionabilityBand]),
    cannotYetSay: new Set(['cannot_yet_say_boundary']),
    humanReviewRoute: new Set([kernel.humanReviewRoute.reviewUnit]),
  };
}

function everyKernelItemHasGrounding(
  field: AxiomKernelGroundedField,
  itemIds: Set<string>,
  links: AxiomKernelGroundingLink[],
): boolean {
  return [...itemIds].every((itemId) =>
    links.some((link) => link.kernelField === field && link.kernelItemId === itemId),
  );
}

export function validateAxiomKernelBuildGroundingPacket(
  packet: AxiomKernelBuildGroundingPacket,
): AxiomKernelBuildGroundingPacketValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  pushIf(
    packet.objectType !== 'axiom_kernel_build_grounding_packet',
    errors,
    'object_type_must_be_axiom_kernel_build_grounding_packet',
  );
  pushIf(
    packet.contractVersion !== AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION,
    errors,
    'contract_version_must_match_axiom_kernel_build_grounding_v0_2026_06_08',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.boundary !== AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    errors,
    'boundary_must_remain_non_runtime_build_grounding_not_promotion',
  );
  pushIf(
    !includesEvery(packet.strengthensCore, AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES),
    errors,
    'packet_must_strengthen_kernel_build_grounding_and_human_review_loop',
  );
  pushIf(
    packet.inheritedKernelBoundary !== AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    errors,
    'packet_must_inherit_kernel_contract_boundary',
  );
  pushIf(!movementBoundaryIsUnchanged(packet.movementBoundary), errors, 'movement_boundary_changed');
  pushIf(
    !movementBoundaryIsUnchanged(packet.input.movementBoundary),
    errors,
    'input_movement_boundary_changed',
  );

  const kernelValidation = validateAxiomInteractionHypothesisKernelContract(packet.kernel);
  pushIf(
    !kernelValidation.valid,
    errors,
    `kernel_contract_invalid:${kernelValidation.errors.join('|')}`,
  );
  pushIf(
    packet.kernel.inputMode !== 'evidence_foundation_fixture',
    errors,
    'grounded_packet_kernel_input_mode_must_be_evidence_foundation_fixture',
  );
  pushIf(
    !includesEvery(packet.kernel.bootstrapStatus, AXIOM_REQUIRED_BOOTSTRAP_LABELS),
    errors,
    'grounded_kernel_must_keep_required_bootstrap_labels',
  );

  const foundationIds = new Set(packet.input.sourceFoundationRefs.map((source) => source.id));
  for (const source of packet.input.sourceFoundationRefs) {
    pushIf(!hasText(source.id), errors, 'source_foundation_id_required');
    pushIf(!hasText(source.uri), errors, `source_foundation_uri_required:${source.id}`);
    pushIf(
      source.status !== 'available_as_bootstrap_prior_requires_axiom_eval' ||
        source.allowedAsAxiomCoreTruth !== false ||
        source.requiresAxiomEval !== true ||
        source.containsSensitiveRawText !== false,
      errors,
      `source_foundation_must_remain_bootstrap_prior_requiring_axiom_eval:${source.id}`,
    );
  }

  const spanIds = new Set(packet.input.evidenceSpans.map((span) => span.id));
  for (const span of packet.input.evidenceSpans) {
    pushIf(!hasText(span.id), errors, 'evidence_span_id_required');
    pushIf(
      !foundationIds.has(span.foundationRefId),
      errors,
      `evidence_span_foundation_ref_missing:${span.id}`,
    );
    pushIf(
      span.sourceValidity !== 'not_decided' ||
        span.supportValidity !== 'not_decided' ||
        span.publicUse !== 'not_public_approved' ||
        span.promotionStatus !== 'not_promoted' ||
        span.containsSensitiveRawText !== false,
      errors,
      `evidence_span_must_not_move_validity_public_or_promotion:${span.id}`,
    );
    pushIf(
      span.supportsKernelFields.length === 0,
      errors,
      `evidence_span_must_support_at_least_one_kernel_field:${span.id}`,
    );
  }

  for (const frame of packet.input.inheritedFrames) {
    pushIf(
      frame.status !== 'requires_axiom_eval' || frame.allowedAsAxiomCoreTruth !== false,
      errors,
      `inherited_frame_must_require_axiom_eval_before_core_truth:${frame.id}`,
    );
    pushIf(
      (frame.source === 'falcon_public_page' || frame.source === 'sns_progress') &&
        frame.allowedUse !== 'delivery_reference_only',
      errors,
      `public_or_sns_frame_must_not_be_bootstrap_truth:${frame.id}`,
    );
  }

  for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
    pushIf(packet.groundingMap.coverage[field] !== 'covered', errors, `grounding_field_uncovered:${field}`);
    pushIf(
      !packet.groundingMap.groundingLinks.some((link) => link.kernelField === field),
      errors,
      `grounding_link_missing_for_field:${field}`,
    );
  }

  const itemIdsByField = buildKernelItemIdsByField(packet.kernel);
  for (const link of packet.groundingMap.groundingLinks) {
    pushIf(!hasText(link.linkId), errors, 'grounding_link_id_required');
    pushIf(
      link.evidenceSpanIds.length === 0,
      errors,
      `grounding_link_evidence_span_required:${link.linkId}`,
    );
    pushIf(
      link.evidenceSpanIds.some((spanId) => !spanIds.has(spanId)),
      errors,
      `grounding_link_evidence_span_missing:${link.linkId}`,
    );
    pushIf(
      !itemIdsByField[link.kernelField].has(link.kernelItemId),
      errors,
      `grounding_link_kernel_item_missing:${link.kernelField}:${link.kernelItemId}`,
    );
  }

  for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
    pushIf(
      !everyKernelItemHasGrounding(field, itemIdsByField[field], packet.groundingMap.groundingLinks),
      errors,
      `every_kernel_item_must_have_grounding:${field}`,
    );
  }

  const gate = packet.reviewDrivenPromotionGate;
  pushIf(
    gate.coreProgressClass !== 'kernel_human_review_loop',
    errors,
    'review_driven_promotion_gate_must_strengthen_kernel_human_review_loop',
  );
  pushIf(
    gate.promotionReadinessStatus !== 'review_required_before_promotion',
    errors,
    'promotion_gate_must_require_review_before_promotion',
  );
  pushIf(
    gate.estimatedCoreReviewUnits > gate.maxCoreHumanReviewUnits ||
      gate.maxCoreHumanReviewUnits !== 100,
    errors,
    'core_human_review_units_must_stay_within_100',
  );
  pushIf(
    !includesEvery(gate.blocks, AXIOM_HUMAN_REVIEW_BLOCKS) ||
      !includesEvery(gate.doesNotBlock, AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK),
    errors,
    'review_gate_must_block_promotion_but_not_provisional_kernel_work',
  );
  pushIf(
    gate.blockedDecisionStatus.sourceValidity !== 'not_decided' ||
      gate.blockedDecisionStatus.supportValidity !== 'not_decided' ||
      gate.blockedDecisionStatus.candidatePattern !== 'not_candidate_pattern' ||
      gate.blockedDecisionStatus.runtimeApproved !== 'not_approved' ||
      gate.blockedDecisionStatus.publicApproved !== 'not_approved' ||
      gate.blockedDecisionStatus.publicRelease !== 'not_approved' ||
      gate.blockedDecisionStatus.learningUpdate !== 'not_promoted' ||
      gate.blockedDecisionStatus.knowledgePromotion !== 'not_promoted',
    errors,
    'review_gate_must_not_move_validity_approval_public_release_or_learning',
  );

  if (packet.kernel.sourceLensStatus.supporter_data.status === 'thin_or_missing') {
    warnings.push('supporter_lens_remains_missing_and_must_stay_in_missing_context');
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0 ? 'build_grounding_contract_valid' : 'build_grounding_contract_invalid',
    errorCount: errors.length,
    errors,
    warningCount: warnings.length,
    warnings,
    boundary: AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    coreProgressClasses: [...AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES],
  };
}
