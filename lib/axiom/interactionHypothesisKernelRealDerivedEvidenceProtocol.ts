import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION,
  AXIOM_REQUIRED_BOOTSTRAP_LABELS,
  type AxiomActionabilityBand,
  type AxiomImplementationActorCondition,
  type AxiomInteractionHypothesisKernel,
  type AxiomMissingContext,
  type AxiomMovementBoundary,
  type AxiomObservation,
  type AxiomSourceLensStatus,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION,
  buildAxiomKernelBuildGroundingPacketFromKernel,
  buildAxiomKernelBuildGroundingReviewUnitCompression,
  validateAxiomKernelBuildGroundingPacket,
  type AxiomEvidenceFoundationRef,
  type AxiomEvidenceSpanRef,
  type AxiomInheritedFrameEvalRoute,
  type AxiomKernelBuildGroundingInput,
  type AxiomKernelBuildGroundingPacket,
  type AxiomKernelBuildGroundingPacketValidation,
  type AxiomKernelBuildGroundingReviewUnitCompression,
} from './interactionHypothesisKernelBuildGroundingContract';
import { type AxiomL3EvalScenarioId } from './interactionHypothesisKernelScenarioFixtures';

export const AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY =
  'axiom_real_derived_evidence_protocol_is_non_sensitive_derived_packet_to_grounded_kernel_not_runtime_or_promotion' as const;

export type AxiomRealDerivedEvidenceDataPolicy = {
  inputLayer: 'references_derived_and_docs_only';
  rawOriginalOpened: false;
  sourceTextExported: false;
  redactedTextExported: false;
  fieldValueExported: false;
  containsSensitiveRawText: false;
  sourceSupportValidityDecision: 'not_decided';
  publicUse: 'not_public_approved';
  note: string;
};

export type AxiomRealDerivedInferenceCandidate = {
  id: string;
  text: string;
  observationIds: string[];
  principalPatternCandidateIds: string[];
  crossCuttingCheckIds: string[];
  confidence: 'low' | 'medium';
  statusLabel: 'provisional_not_reviewed';
};

export type AxiomRealDerivedCounterHypothesis = {
  id: string;
  text: string;
  wouldChange: string[];
  nextQuestionIds: string[];
};

export type AxiomRealDerivedEvidencePacket = {
  packetId: string;
  objectType: 'axiom_real_derived_evidence_packet';
  contractVersion: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION;
  lane: 'Falcon Lab';
  status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build';
  scenarioId: AxiomL3EvalScenarioId;
  dataPolicy: AxiomRealDerivedEvidenceDataPolicy;
  sourceFoundationRefs: AxiomEvidenceFoundationRef[];
  evidenceSpans: AxiomEvidenceSpanRef[];
  inheritedFrames: AxiomInheritedFrameEvalRoute[];
  observationCandidates: AxiomObservation[];
  inferenceCandidate: AxiomRealDerivedInferenceCandidate;
  counterHypothesis: AxiomRealDerivedCounterHypothesis[];
  missingContext: AxiomMissingContext[];
  implementationActorConditions: AxiomImplementationActorCondition[];
  sourceLensStatus: AxiomInteractionHypothesisKernel['sourceLensStatus'];
  actionabilityBand: AxiomActionabilityBand;
  cannotYetSay: string[];
  targetReviewUnitCountCap: 100;
  movementBoundary: AxiomMovementBoundary;
};

export type AxiomRealDerivedKernelBuildRun = {
  runId: string;
  objectType: 'axiom_real_derived_evidence_kernel_build_run';
  contractVersion: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION;
  lane: 'Falcon Lab';
  status: 'passed_real_derived_non_sensitive_kernel_build' | 'failed_real_derived_kernel_build';
  boundary: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY;
  evidencePacket: AxiomRealDerivedEvidencePacket;
  evidencePacketValidation: AxiomRealDerivedEvidencePacketValidation;
  buildGroundingInput: AxiomKernelBuildGroundingInput;
  buildGroundingPacket: AxiomKernelBuildGroundingPacket;
  validation: AxiomKernelBuildGroundingPacketValidation;
  reviewUnitCompression: AxiomKernelBuildGroundingReviewUnitCompression;
  notNow: string[];
};

export type AxiomRealDerivedKernelBuildBatchRun = {
  runId: string;
  objectType: 'axiom_real_derived_evidence_kernel_build_batch_run';
  contractVersion: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION;
  lane: 'Falcon Lab';
  status:
    | 'passed_real_derived_non_sensitive_kernel_build_batch'
    | 'failed_real_derived_kernel_build_batch';
  boundary: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY;
  packetCount: number;
  scenarioCount: number;
  runs: AxiomRealDerivedKernelBuildRun[];
  reviewUnitCompression: AxiomKernelBuildGroundingReviewUnitCompression;
  notNow: string[];
};

export type AxiomRealDerivedEvidencePacketValidation = {
  valid: boolean;
  validationStatus:
    | 'real_derived_evidence_packet_valid'
    | 'real_derived_evidence_packet_invalid';
  errorCount: number;
  errors: string[];
  warningCount: number;
  warnings: string[];
  boundary: typeof AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY;
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

const REAL_DERIVED_SOURCE_FOUNDATIONS: AxiomEvidenceFoundationRef[] = [
  {
    id: 'foundation_stage1_cr01_health_time_life_security_context_reading',
    kind: 'stage1_scima_fchma_output',
    uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.md',
    layer: 'evidence',
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note: 'Derived CR01 context reading summary only; raw original and redacted text are not exported.',
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
    note: 'Used only to check the first real-derived packet against the existing health-time L3 evaluation expectations.',
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
    note: 'L3 PIP and CCA IDs are used as bootstrap pattern candidates, not promoted Axiom doctrine.',
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
    note: 'FT03 gives the response shape and brakes for observation/inference separation, missing context, counter hypotheses, and cannot-yet-say limits.',
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
    note: 'The audit is used to keep progress centered on kernel build, grounding, eval, display, and review loop.',
  },
];

const REAL_DERIVED_EVIDENCE_SPANS: AxiomEvidenceSpanRef[] = [
  {
    id: 'span_cr01_health_time_context_counts',
    foundationRefId: 'foundation_stage1_cr01_health_time_life_security_context_reading',
    lens: 'respondent_data',
    summary:
      'CR01 derived context reading covers 16 records without raw text export; redacted context type counts include health_time, life_security, sequence_or_choice, support_bridge, and work_time_design.',
    supportsKernelFields: ['observation', 'missingContext', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_cr01_core_reading_interacting_freedoms',
    foundationRefId: 'foundation_stage1_cr01_health_time_life_security_context_reading',
    lens: 'respondent_data',
    summary:
      'CR01 core reading keeps C01/C06 active only when health time, work design, life security, support, or sequence are read as interacting freedoms.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_health_time_actionability_prior',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 PIP-01, PIP-02, and PIP-06 frame health-time signals as workload, recovery, evaluation, income, and handoff questions rather than accommodation lookup.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_health_time_counter_mapping',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 CCA-22, CCA-23, CCA-24, and CCA-27 require anti-lookup, counter-structure, no support-validity finality, and review-loop separation.',
    supportsKernelFields: ['inference', 'counterHypothesis', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ft03_health_time_response_shape',
    foundationRefId: 'foundation_ft03_response_contract',
    lens: 'implementation_actor_conditions',
    summary:
      'FT03 V1 requires health, treatment, fatigue, rest, and return-to-work issues to be translated into work time, workload, and evaluation questions while preserving observation/inference separation.',
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
    id: 'span_falcon_audit_real_derived_kernel_gap',
    foundationRefId: 'foundation_falcon_core_weakness_audit',
    lens: 'implementation_actor_conditions',
    summary:
      'The weakness audit identifies the missing typed interaction-hypothesis kernel as the core rebuild target and rejects delivery-layer progress as core progress unless it strengthens kernel build, grounding, eval, display, or review loop.',
    supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
];

const REAL_DERIVED_INHERITED_FRAMES: AxiomInheritedFrameEvalRoute[] = [
  {
    id: 'inherited_stage1_cr01_context_reading',
    source: 'stage1_scima_fchma',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does CR01 context reading support a grounded provisional kernel without becoming source/support validity?',
  },
  {
    id: 'inherited_l3_health_time_21_view_prior',
    source: 'l3_21_views',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which L3 health-time pattern IDs are usable as review units rather than promoted truth?',
  },
  {
    id: 'inherited_ft03_response_contract_real_derived',
    source: 'ft03_contract',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the real-derived kernel preserve FT03 observation/inference/missing-context/counter-hypothesis brakes?',
  },
  {
    id: 'inherited_falcon_public_page_skeleton_real_derived',
    source: 'falcon_public_page',
    status: 'requires_axiom_eval',
    allowedUse: 'delivery_reference_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which public skeleton elements can display this kernel only after Axiom eval and public review?',
  },
];

const REAL_DERIVED_JEED_POLICY_SOURCE_FOUNDATIONS: AxiomEvidenceFoundationRef[] = [
  {
    id: 'foundation_stage1_web_cache_jeed_deep_reading_batch1',
    kind: 'stage1_scima_fchma_output',
    uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
    layer: 'evidence',
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note: 'Stage 1 web-cache deep-reading cards are used as non-sensitive derived reading cards, not as source/support validity or current policy.',
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
    note: 'Used only to check this real-derived packet against the existing policy/service coordination source-lens L3 evaluation expectations.',
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
    note: 'L3 PIP and CCA IDs are used as bootstrap pattern candidates, not promoted Axiom doctrine.',
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
    note: 'FT03 gives the response shape and brakes for observation/inference separation, missing context, counter hypotheses, and cannot-yet-say limits.',
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
    note: 'The audit is used to keep progress centered on kernel build, grounding, eval, display, and review loop.',
  },
];

const REAL_DERIVED_JEED_POLICY_EVIDENCE_SPANS: AxiomEvidenceSpanRef[] = [
  {
    id: 'span_jeed_regional_network_translation_window',
    foundationRefId: 'foundation_stage1_web_cache_jeed_deep_reading_batch1',
    lens: 'external_evidence',
    summary:
      'JEED deep-reading card 01fe0b103b8f reads regional resources and stakeholder connection as a translation surface from pre-entry participation to work continuity; source text is not exported and the card is unreviewed.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_jeed_coordination_counter_window',
    foundationRefId: 'foundation_stage1_web_cache_jeed_deep_reading_batch1',
    lens: 'external_evidence',
    summary:
      'The same JEED deep-reading card forbids using regional coordination as proof of effectiveness, institutional superiority, good practice generalization, source/support validity, candidate_pattern movement, or public/runtime approval.',
    supportsKernelFields: ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_policy_service_coordination_prior',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 PIP-11, PIP-12, PIP-14, and PIP-21 frame coordination as support translation capacity, return circuits, source-lens translation stops, and implementation differences by workplace, region, and resource conditions.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_policy_service_source_boundary',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 CCA-23, CCA-25, and CCA-27 require no support-validity finality, source/currentness/public boundary separation, and review-loop separation before promotion or runtime use.',
    supportsKernelFields: ['inference', 'counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ft03_policy_service_response_shape',
    foundationRefId: 'foundation_ft03_response_contract',
    lens: 'implementation_actor_conditions',
    summary:
      'FT03 requires service design hypotheses, policy/currentness claims, implementation actors, missing context, and cannot-yet-say boundaries to remain separate before any recommendation.',
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
    id: 'span_falcon_audit_jeed_kernel_gap',
    foundationRefId: 'foundation_falcon_core_weakness_audit',
    lens: 'implementation_actor_conditions',
    summary:
      'The weakness audit blocks treating public pages, SNS progress, or inherited Falcon outputs as Axiom core truth unless kernel build, grounding, eval, display, or review loop are strengthened.',
    supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
];

const REAL_DERIVED_JEED_POLICY_INHERITED_FRAMES: AxiomInheritedFrameEvalRoute[] = [
  {
    id: 'inherited_stage1_web_cache_jeed_deep_reading_policy_service',
    source: 'stage1_scima_fchma',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the JEED deep-reading card support a source-lens coordination kernel without becoming source/support validity or current policy?',
  },
  {
    id: 'inherited_l3_policy_service_21_view_prior',
    source: 'l3_21_views',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which L3 policy/service coordination IDs are usable as review units rather than promoted Axiom doctrine?',
  },
  {
    id: 'inherited_ft03_response_contract_policy_service',
    source: 'ft03_contract',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the policy/service packet preserve FT03 separation between service design hypothesis, currentness claim, and recommendation?',
  },
  {
    id: 'inherited_falcon_public_page_skeleton_policy_service',
    source: 'falcon_public_page',
    status: 'requires_axiom_eval',
    allowedUse: 'delivery_reference_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which public skeleton elements can display this coordination kernel only after Axiom eval and public review?',
  },
];

const REAL_DERIVED_JEED_DISCLOSURE_SOURCE_FOUNDATIONS: AxiomEvidenceFoundationRef[] =
  REAL_DERIVED_JEED_POLICY_SOURCE_FOUNDATIONS.map((source) =>
    source.id === 'foundation_falcon_core_eval_profile'
      ? {
          ...source,
          note: 'Used only to check this real-derived packet against the existing disclosure/information/work-procedure L3 evaluation expectations.',
        }
      : source,
  );

const REAL_DERIVED_JEED_DISCLOSURE_EVIDENCE_SPANS: AxiomEvidenceSpanRef[] = [
  {
    id: 'span_jeed_work_procedure_decomposition_window',
    foundationRefId: 'foundation_stage1_web_cache_jeed_deep_reading_batch1',
    lens: 'external_evidence',
    summary:
      'JEED deep-reading card 156fe85fe4cf reads work not as a broad employment slot but as task procedure, tools, placement, safety, and contact points; source text is not exported and the card is unreviewed.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_jeed_disclosure_translation_counter_window',
    foundationRefId: 'foundation_stage1_web_cache_jeed_deep_reading_batch1',
    lens: 'external_evidence',
    summary:
      'The same JEED card reads explanation, expression, understanding, and individual support as mutual translation into work conditions, not as disclosure volume, ability judgment, accommodation validity, or good-practice proof.',
    supportsKernelFields: ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_disclosure_information_procedure_prior',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 PIP-10, PIP-13, PIP-17, and PIP-18 frame disclosure, information format, sensory/information access, task switching, memory load, and confirmation structure as work-procedure design questions.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_disclosure_boundary_counter_mapping',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 CCA-22, CCA-23, CCA-26, and CCA-27 require anti-lookup, no support-validity finality, disclosure/consent/PII boundary, and review-loop separation.',
    supportsKernelFields: ['inference', 'counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ft03_disclosure_procedure_response_shape',
    foundationRefId: 'foundation_ft03_response_contract',
    lens: 'implementation_actor_conditions',
    summary:
      'FT03 requires disclosure purpose, information sharing, work-procedure design, confirmation, safety, evaluation, consent boundary, and cannot-yet-say limits to remain separate before any advice.',
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
    id: 'span_falcon_audit_disclosure_kernel_gap',
    foundationRefId: 'foundation_falcon_core_weakness_audit',
    lens: 'implementation_actor_conditions',
    summary:
      'The weakness audit blocks treating disclosure checklists, public page copy, or inherited Falcon outputs as Axiom core truth unless kernel build, grounding, eval, display, or review loop are strengthened.',
    supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
];

const REAL_DERIVED_JEED_DISCLOSURE_INHERITED_FRAMES: AxiomInheritedFrameEvalRoute[] = [
  {
    id: 'inherited_stage1_web_cache_jeed_deep_reading_disclosure_procedure',
    source: 'stage1_scima_fchma',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the JEED deep-reading card support a disclosure/procedure kernel without becoming disclosure advice, ability judgment, source/support validity, or good-practice proof?',
  },
  {
    id: 'inherited_l3_disclosure_information_21_view_prior',
    source: 'l3_21_views',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which L3 disclosure and work-procedure IDs are usable as review units rather than promoted Axiom doctrine?',
  },
  {
    id: 'inherited_ft03_response_contract_disclosure_procedure',
    source: 'ft03_contract',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the disclosure/procedure packet preserve FT03 separation between disclosure purpose, work procedure, consent boundary, and recommendation?',
  },
  {
    id: 'inherited_falcon_public_page_skeleton_disclosure_procedure',
    source: 'falcon_public_page',
    status: 'requires_axiom_eval',
    allowedUse: 'delivery_reference_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which public skeleton elements can display this disclosure/procedure kernel only after Axiom eval and public review?',
  },
];

const REAL_DERIVED_FTCODEX03_SUPPORTER_WORKPLACE_SOURCE_FOUNDATIONS: AxiomEvidenceFoundationRef[] = [
  {
    id: 'foundation_stage1_ftcodex03_supporter_workplace_summary',
    kind: 'stage1_scima_fchma_output',
    uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
    layer: 'evidence',
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note: 'Stage 1 FT-Codex-03 summary is used as non-sensitive derived supporter/workplace reading, not as support validity or outcome proof.',
  },
  {
    id: 'foundation_stage1_ftcodex03_network_reconnection',
    kind: 'stage1_scima_fchma_output',
    uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
    layer: 'structure',
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note: 'Network reconnection is used to locate C03/C05/C07 pressure and boundaries before Axiom eval.',
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
    note: 'Used only to check this real-derived packet against the existing post-hiring quality/evaluation-loop L3 scenario expectations.',
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
    note: 'L3 PIP and CCA IDs are used as bootstrap pattern candidates, not promoted Axiom doctrine.',
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
    note: 'FT03 gives the response shape and brakes for observation/inference separation, missing context, counter hypotheses, and cannot-yet-say limits.',
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
    note: 'The audit is used to keep progress centered on kernel build, grounding, eval, display, and review loop.',
  },
];

const REAL_DERIVED_FTCODEX03_SUPPORTER_WORKPLACE_EVIDENCE_SPANS: AxiomEvidenceSpanRef[] = [
  {
    id: 'span_ftcodex03_supporter_retranslation_capacity',
    foundationRefId: 'foundation_stage1_ftcodex03_supporter_workplace_summary',
    lens: 'supporter_data',
    summary:
      'FT-Codex-03 reads supporter materials as translation capacity across medical, institutional, job-opening, workplace, and person-explanation surfaces rather than as support-menu effectiveness.',
    supportsKernelFields: ['observation', 'inference', 'missingContext', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ftcodex03_workplace_quality_contact_window',
    foundationRefId: 'foundation_stage1_ftcodex03_supporter_workplace_summary',
    lens: 'supporter_data',
    summary:
      'FT-Codex-03 reads workplace materials as contact points for safety, staffing margin, job posting signals, consultation lines, livelihood effects, and future role redesign, not as employer correctness or accommodation validity.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ftcodex03_post_hiring_network_reconnection',
    foundationRefId: 'foundation_stage1_ftcodex03_network_reconnection',
    lens: 'external_evidence',
    summary:
      'FT-Codex-03 network reconnection says support continuity is the retranslation spine and quality participation must be read as role, value, future, career, and treatment redesign rather than satisfaction or tenure proof.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_post_hiring_quality_prior',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 PIP-06, PIP-19, PIP-20, and PIP-21 frame post-hiring quality as life-security, role/evaluation/value translation, learning/career/future view, and implementation differences.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_post_hiring_quality_counter_boundary',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 CCA-23, CCA-24, CCA-25, and CCA-27 require no support/accommodation validity finality, source/currentness boundary, and review-loop separation before success language or learning update.',
    supportsKernelFields: ['inference', 'counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ft03_post_hiring_quality_response_shape',
    foundationRefId: 'foundation_ft03_response_contract',
    lens: 'implementation_actor_conditions',
    summary:
      'FT03 requires employment status, participation quality, role, evaluation, growth, source lenses, counter hypotheses, and learning boundaries to remain separate before any public success claim.',
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
    id: 'span_falcon_audit_post_hiring_kernel_gap',
    foundationRefId: 'foundation_falcon_core_weakness_audit',
    lens: 'implementation_actor_conditions',
    summary:
      'The weakness audit blocks treating counts, public copy, or inherited Falcon outputs as Axiom core truth unless kernel build, grounding, eval, display, or review loop are strengthened.',
    supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
];

const REAL_DERIVED_FTCODEX03_SUPPORTER_WORKPLACE_INHERITED_FRAMES: AxiomInheritedFrameEvalRoute[] = [
  {
    id: 'inherited_stage1_ftcodex03_supporter_workplace_summary',
    source: 'stage1_scima_fchma',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does FT-Codex-03 support a post-hiring quality kernel without becoming support validity, employer correctness, outcome proof, or public success language?',
  },
  {
    id: 'inherited_l3_post_hiring_quality_21_view_prior',
    source: 'l3_21_views',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which L3 post-hiring quality IDs are usable as review units rather than promoted Axiom doctrine?',
  },
  {
    id: 'inherited_ft03_response_contract_post_hiring_quality',
    source: 'ft03_contract',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the post-hiring quality packet preserve FT03 separation between employment status, quality, source lens, critique, and learning update?',
  },
  {
    id: 'inherited_falcon_public_success_language_boundary',
    source: 'falcon_public_page',
    status: 'requires_axiom_eval',
    allowedUse: 'delivery_reference_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which public success-language elements must remain blocked until this kernel passes review and public approval?',
  },
];

const REAL_DERIVED_PUBLIC_CONDITION_WINDOW_SOURCE_FOUNDATIONS: AxiomEvidenceFoundationRef[] = [
  {
    id: 'foundation_stage1_ftcodex03_condition_window_guardrail',
    kind: 'stage1_scima_fchma_output',
    uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
    layer: 'evidence',
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note: 'FT-Codex-03 condition-window guardrail is used as non-sensitive derived reading, not public copy or current policy.',
  },
  {
    id: 'foundation_stage1_ftcodex03_condition_network_reconnection',
    kind: 'stage1_scima_fchma_output',
    uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
    layer: 'structure',
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note: 'Network reconnection is used to locate condition windows and source-lens boundaries before Axiom eval.',
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
    note: 'Used only to check this real-derived packet against the existing public condition-window non-lookup L3 scenario expectations.',
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
    note: 'L3 PIP and CCA IDs are used as bootstrap pattern candidates, not promoted Axiom doctrine.',
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
    note: 'FT03 gives the response shape and brakes for observation/inference separation, missing context, counter hypotheses, public boundary, and cannot-yet-say limits.',
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
    note: 'The audit is used to keep progress centered on kernel build, grounding, eval, display, and review loop.',
  },
];

const REAL_DERIVED_PUBLIC_CONDITION_WINDOW_EVIDENCE_SPANS: AxiomEvidenceSpanRef[] = [
  {
    id: 'span_ftcodex03_condition_window_guardrail',
    foundationRefId: 'foundation_stage1_ftcodex03_condition_window_guardrail',
    lens: 'external_evidence',
    summary:
      'FT-Codex-03 says disease names, disability names, system categories, age, region, and workplace size are condition windows, not taboo terms and not lookup keys for support or difficulty.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand', 'sourceLensStatus'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ftcodex03_public_boundary_no_lookup',
    foundationRefId: 'foundation_stage1_ftcodex03_condition_window_guardrail',
    lens: 'external_evidence',
    summary:
      'FT-Codex-03 boundary says support examples and employment difficulty must be read as interactions, avoiding simple causality, support validity, public approval, and condition-to-support lookup.',
    supportsKernelFields: ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_public_condition_window_prior',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 PIP-01, PIP-04, PIP-10, PIP-15, and PIP-21 frame categories as health-time, commute/rest, disclosure purpose, worksite contact, and implementation-difference condition windows.',
    supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_l3_public_condition_boundary_mapping',
    foundationRefId: 'foundation_stage1_l3_principal_patterns',
    lens: 'external_evidence',
    summary:
      'L3 CCA-22, CCA-24, CCA-25, and CCA-27 require anti-lookup, no support/accommodation validity finality, source/currentness/public boundary separation, and review-loop separation.',
    supportsKernelFields: ['inference', 'counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
  {
    id: 'span_ft03_public_condition_response_shape',
    foundationRefId: 'foundation_ft03_response_contract',
    lens: 'implementation_actor_conditions',
    summary:
      'FT03 requires public condition-window drafts to separate observation, inference, confirmation questions, source/currentness limits, public approval, and cannot-yet-say boundaries before any public-facing use.',
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
    id: 'span_falcon_audit_public_condition_kernel_gap',
    foundationRefId: 'foundation_falcon_core_weakness_audit',
    lens: 'implementation_actor_conditions',
    summary:
      'The weakness audit blocks treating public condition pages, Falcon public copy, or SNS progress as Axiom core truth unless kernel build, grounding, eval, display, or review loop are strengthened.',
    supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  },
];

const REAL_DERIVED_PUBLIC_CONDITION_WINDOW_INHERITED_FRAMES: AxiomInheritedFrameEvalRoute[] = [
  {
    id: 'inherited_stage1_ftcodex03_condition_window_guardrail',
    source: 'stage1_scima_fchma',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does FT-Codex-03 support a public condition-window kernel without becoming public copy, support validity, or condition-to-support lookup?',
  },
  {
    id: 'inherited_l3_public_condition_window_prior',
    source: 'l3_21_views',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which L3 public condition-window IDs are usable as review units rather than promoted Axiom doctrine?',
  },
  {
    id: 'inherited_ft03_response_contract_public_condition',
    source: 'ft03_contract',
    status: 'requires_axiom_eval',
    allowedUse: 'bootstrap_prior_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Does the public condition-window packet preserve FT03 separation between condition window, support examples, public currentness, and publication approval?',
  },
  {
    id: 'inherited_falcon_public_condition_page_skeleton',
    source: 'falcon_public_page',
    status: 'requires_axiom_eval',
    allowedUse: 'delivery_reference_only',
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion:
      'Which public condition-window page elements can display this kernel only after Axiom eval and public review?',
  },
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function sourceLensStatus(
  lens: AxiomSourceLensStatus['lens'],
  status: AxiomSourceLensStatus['status'],
  note: string,
): AxiomSourceLensStatus {
  return {
    lens,
    status,
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    note,
  };
}

function realDerivedPacketSlug(packet: AxiomRealDerivedEvidencePacket): string {
  return packet.packetId
    .replace('axiom_real_derived_evidence_packet_', '')
    .replace(/[^a-z0-9_]+/g, '_');
}

export function buildAxiomRealDerivedHealthTimeEvidencePacketFixture(): AxiomRealDerivedEvidencePacket {
  return {
    packetId: 'axiom_real_derived_evidence_packet_cr01_health_time_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
    dataPolicy: {
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
      note: 'This packet uses derived summaries and source references only. It does not read or export raw source text.',
    },
    sourceFoundationRefs: REAL_DERIVED_SOURCE_FOUNDATIONS,
    evidenceSpans: REAL_DERIVED_EVIDENCE_SPANS,
    inheritedFrames: REAL_DERIVED_INHERITED_FRAMES,
    observationCandidates: [
      {
        id: 'obs_real_cr01_context_counts',
        lens: 'respondent_data',
        text: 'CR01 derived context reading reports a non-sensitive 16-record health-time/life-security corridor with health_time, life_security, sequence_or_choice, support_bridge, and work_time_design context types; raw originals and source text were not exported.',
        evidencePointer: 'span_cr01_health_time_context_counts',
        statusLabel: 'shared_evidence_foundation',
      },
      {
        id: 'obs_real_cr01_interacting_freedoms',
        lens: 'respondent_data',
        text: 'CR01 core reading says C01/C06 should stay active only when health time, work design, life security, support, or sequence are read as interacting freedoms.',
        evidencePointer: 'span_cr01_core_reading_interacting_freedoms',
        statusLabel: 'shared_evidence_foundation',
      },
      {
        id: 'obs_real_l3_health_time_prior',
        lens: 'external_evidence',
        text: 'L3 health-time patterns and cross-cutting checks require the kernel to avoid condition-to-accommodation lookup and keep counter-structure, support-validity brakes, and review-loop separation visible.',
        evidencePointer: 'span_l3_health_time_actionability_prior',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inferenceCandidate: {
      id: 'inf_real_health_time_work_design_kernel',
      text: 'The first real-derived Axiom reading is a health-time/work-time/life-security interaction kernel: health-time signals should be translated into workload rhythm, recovery access, support bridge, evaluation/income, and sequence questions, not into a final accommodation recommendation.',
      observationIds: [
        'obs_real_cr01_context_counts',
        'obs_real_cr01_interacting_freedoms',
        'obs_real_l3_health_time_prior',
      ],
      principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
      crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_real_health_time_life_security_sequence',
        text: 'The primary contact point may be life-security constraint, sequence/choice loss, support-bridge gap, or evaluation/income conflict rather than workload rhythm itself.',
        wouldChange: [
          'missing context would move toward income, contract, treatment timing, support continuity, and return-route questions',
          'implementation actor conditions would require public/institutional and employer review before actionability rises',
        ],
        nextQuestionIds: ['mc_real_time_001', 'mc_real_institution_001', 'mc_real_support_001'],
      },
    ],
    missingContext: [
      {
        id: 'mc_real_person_001',
        slot: 'person',
        question:
          'Which health-time contact point is actually difficult for the person: fatigue, treatment timing, recovery, uncertainty, income pressure, or return route?',
        whyItMatters:
          'The derived corridor cannot be turned into a person-trait or capacity explanation without the person-defined contact point.',
      },
      {
        id: 'mc_real_job_001',
        slot: 'job',
        question:
          'Which workload rhythm, meeting density, task handoff, deadline, or role expectation creates the health-time contact point?',
        whyItMatters:
          'Health-time only becomes work-design knowledge when the concrete job condition is visible.',
      },
      {
        id: 'mc_real_environment_001',
        slot: 'environment',
        question:
          'Which workplace environment, tools, meeting format, rest access, commute, or informal rule changes the health-time burden?',
        whyItMatters:
          'The same health-time signal can mean physical access, information load, rest-place absence, or social participation pressure.',
      },
      {
        id: 'mc_real_support_001',
        slot: 'support',
        question:
          'Who can translate health, life-security, support-bridge, and work-time information into shared work-condition questions?',
        whyItMatters:
          'Support cannot be treated as valid merely because it exists; the translation function must be visible.',
      },
      {
        id: 'mc_real_time_001',
        slot: 'time',
        question:
          'What sequence matters: treatment, recovery, work start/end, income pressure, return route, review timing, or future change?',
        whyItMatters:
          'CR01 explicitly treats health time and life security as sequence and freedom issues, not static traits.',
      },
      {
        id: 'mc_real_institution_001',
        slot: 'institution',
        question:
          'Which employer, support, medical, welfare, or public actor can change the relevant time, workload, evaluation, or income constraint?',
        whyItMatters:
          'A provisional kernel is not actionable until implementation authority and institutional constraints are visible.',
      },
      {
        id: 'mc_real_evidence_001',
        slot: 'evidence',
        question:
          'Which parts are CR01 derived counts, which are L3/FT03 bootstrap priors, and which would need source/support validity review?',
        whyItMatters:
          'Axiom must not promote derived context reading or bootstrap priors into core truth without review.',
      },
      {
        id: 'mc_real_source_lens_001',
        slot: 'source_lens',
        question:
          'How would respondent, supporter, employer, health actor, public actor, and derived research lenses differ on the same health-time signal?',
        whyItMatters:
          'Source-lens differences are a translation stop point, not noise to average away.',
      },
    ],
    implementationActorConditions: [
      {
        actor: 'worker',
        condition:
          'Can name the lived health-time contact point without being forced into diagnosis proof or accommodation menu selection.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_person_001', 'mc_real_time_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Can inspect workload rhythm, rest access, role expectations, evaluation treatment, and income/contract effects.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_job_001', 'mc_real_environment_001', 'mc_real_institution_001'],
      },
      {
        actor: 'support_staff',
        condition:
          'Can translate health-time, life-security, and support-bridge information into shared work-condition questions while preserving consent and boundaries.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_support_001', 'mc_real_source_lens_001'],
      },
      {
        actor: 'reviewer',
        condition:
          'Must decide whether this real-derived packet can remain an internal grounded kernel fixture before any promotion, public copy, or learning update.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_evidence_001', 'mc_real_source_lens_001'],
      },
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'present_in_evidence_foundation_fixture',
        'CR01 is derived from respondent-related context reading counts and core reading only; raw source text is not exported.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'The first real-derived packet does not include a direct supporter-lens packet and routes this to missing context.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'L3, FT03, Falcon eval profile, and weakness audit are bootstrap priors requiring Axiom eval before core truth.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are generated as implementation visibility requirements, not recommendations.',
      ),
    },
    actionabilityBand: 'usable_provisional_insight',
    cannotYetSay: [
      'No medical conclusion can be drawn from this real-derived packet.',
      'No legal or employment judgment is made.',
      'No accommodation recommendation or support validity decision is approved.',
      'No public approval, runtime approval, candidate_pattern, knowledge promotion, or learning update is granted.',
      'No source/support validity decision is made from CR01, L3, FT03, or audit materials.',
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomRealDerivedJeedPolicyServiceEvidencePacketFixture(): AxiomRealDerivedEvidencePacket {
  return {
    packetId: 'axiom_real_derived_evidence_packet_jeed_policy_service_coordination_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_policy_service_coordination_source_lens_v0',
    dataPolicy: {
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
      note: 'This packet uses Stage 1 derived web-cache deep-reading cards and source references only. It does not read or export raw cached source text.',
    },
    sourceFoundationRefs: REAL_DERIVED_JEED_POLICY_SOURCE_FOUNDATIONS,
    evidenceSpans: REAL_DERIVED_JEED_POLICY_EVIDENCE_SPANS,
    inheritedFrames: REAL_DERIVED_JEED_POLICY_INHERITED_FRAMES,
    observationCandidates: [
      {
        id: 'obs_real_jeed_regional_network_translation',
        lens: 'external_evidence',
        text: 'JEED deep-reading card 01fe0b103b8f reads regional resources, employers, support agencies, and public institutions as a translation surface between pre-entry participation and work continuity; the source text is not exported and the card is unreviewed.',
        evidencePointer: 'span_jeed_regional_network_translation_window',
        statusLabel: 'falcon_bootstrap_prior',
      },
      {
        id: 'obs_real_jeed_source_identity_boundary',
        lens: 'external_evidence',
        text: 'The JEED card is local cached web-cache reading, not live-verified current policy, not source/support validity, and not public/runtime approval.',
        evidencePointer: 'span_jeed_coordination_counter_window',
        statusLabel: 'falcon_bootstrap_prior',
      },
      {
        id: 'obs_real_l3_policy_service_prior',
        lens: 'external_evidence',
        text: 'L3 policy/service coordination patterns require sourceLensDifferences, implementation actor conditions, review questions, and separation between service design hypothesis and currentness or policy claims.',
        evidencePointer: 'span_l3_policy_service_coordination_prior',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inferenceCandidate: {
      id: 'inf_real_jeed_policy_service_coordination_kernel',
      text: 'The JEED-derived policy/service coordination kernel is a source-lens and implementation-actor hypothesis: coordination should be read as job, environment, support, time, institution, and sourceLensDifferences translation capacity, not as a polished policy recommendation, current official policy status, or evidence that coordination quality is valid.',
      observationIds: [
        'obs_real_jeed_regional_network_translation',
        'obs_real_jeed_source_identity_boundary',
        'obs_real_l3_policy_service_prior',
      ],
      principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
      crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_real_jeed_coordination_quality_currentness',
        text: 'The main issue may be currentness, source-lens mismatch, decision-owner ambiguity, local resource limits, or service handoff timing rather than the presence or absence of regional coordination.',
        wouldChange: [
          'actionability would remain question_first_only or hold_or_research_needed until currentness and source/support validity are reviewed',
          'implementation actor conditions would need explicit employer, support agency, and public/institutional decision owners',
        ],
        nextQuestionIds: [
          'mc_real_jeed_support_001',
          'mc_real_jeed_time_001',
          'mc_real_jeed_institution_001',
          'mc_real_jeed_source_lens_001',
        ],
      },
    ],
    missingContext: [
      {
        id: 'mc_real_jeed_job_001',
        slot: 'job',
        question:
          'Which job conditions are actually being reconnected by coordination: task entry, workflow, role expectations, evaluation, handoff, or return route?',
        whyItMatters:
          'Service coordination cannot become useful unless it is tied to concrete job conditions rather than an abstract cooperation model.',
      },
      {
        id: 'mc_real_jeed_environment_001',
        slot: 'environment',
        question:
          'Which workplace and regional environment conditions change implementation: workplace size, industry, locality, available support resources, or informal contact routes?',
        whyItMatters:
          'The same coordination structure may open or close different freedoms depending on environment and resource conditions.',
      },
      {
        id: 'mc_real_jeed_support_001',
        slot: 'support',
        question:
          'What does each support actor translate: worker condition, employer work design, health or life information, evaluation concerns, or public/institutional procedure?',
        whyItMatters:
          'Support presence is not support quality; the translation function must be visible before redesign can be recommended.',
      },
      {
        id: 'mc_real_jeed_time_001',
        slot: 'time',
        question:
          'Where is the return circuit over time: before entry, after placement, when work changes, when difficulty appears, at review, or after interruption?',
        whyItMatters:
          'Coordination that only works at one contact point may fail as work, health, support, or institution conditions change.',
      },
      {
        id: 'mc_real_jeed_institution_001',
        slot: 'institution',
        question:
          'Which employer, support agency, medical or health actor, welfare actor, or public institution owns each decision and each boundary?',
        whyItMatters:
          'A policy/service hypothesis cannot become action guidance without decision owners and institutional constraints.',
      },
      {
        id: 'mc_real_jeed_source_lens_001',
        slot: 'source_lens',
        question:
          'Where might respondent, supporter, employer, institutional, and external evidence lenses differ on the same coordination signal?',
        whyItMatters:
          'Source-lens differences are a review stop point; they should return review questions before recommending service redesign.',
      },
      {
        id: 'mc_real_jeed_evidence_001',
        slot: 'evidence',
        question:
          'Which claims come from JEED deep-reading cards, L3 bootstrap priors, FT03 response discipline, or weakness-audit boundary notes, and which need source/currentness review?',
        whyItMatters:
          'Axiom must separate service design hypothesis from policy/currentness claims before public or runtime use.',
      },
    ],
    implementationActorConditions: [
      {
        actor: 'support_staff',
        condition:
          'Can describe what is being translated across worker condition, workplace design, support continuity, and institutional procedure.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_support_001', 'mc_real_jeed_source_lens_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Can identify the job, workflow, evaluation, handoff, and environment conditions that coordination is supposed to change.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_job_001', 'mc_real_jeed_environment_001'],
      },
      {
        actor: 'public_or_institutional_actor',
        condition:
          'Can identify decision ownership, currentness boundary, public procedure boundary, and regional resource constraints.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_time_001', 'mc_real_jeed_institution_001'],
      },
      {
        actor: 'reviewer',
        condition:
          'Must review source/currentness/support-validity boundaries before this packet can move toward candidate pattern, runtime use, public use, or learning update.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_evidence_001', 'mc_real_jeed_source_lens_001'],
      },
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'This JEED packet has no direct respondent data and routes respondent-lens differences to missing context.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'This JEED packet has no direct supporter data and routes support translation quality to missing context.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'JEED deep-reading cards, L3, FT03, Falcon eval profile, and weakness audit are bootstrap priors requiring Axiom eval before core truth.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are generated as decision-owner and boundary visibility requirements, not recommendations.',
      ),
    },
    actionabilityBand: 'question_first_only',
    cannotYetSay: [
      'No medical conclusion can be drawn from this JEED-derived packet.',
      'No legal or employment judgment is made.',
      'No accommodation recommendation, support validity decision, or coordination-quality decision is approved.',
      'No public approval, runtime approval, candidate_pattern, knowledge promotion, or learning update is granted.',
      'No current policy claim, source/support validity decision, or source currentness decision is made from JEED, L3, FT03, or audit materials.',
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomRealDerivedJeedDisclosureProcedureEvidencePacketFixture(): AxiomRealDerivedEvidencePacket {
  return {
    packetId: 'axiom_real_derived_evidence_packet_jeed_disclosure_procedure_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_disclosure_information_procedure_boundary_v0',
    dataPolicy: {
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
      note: 'This packet uses Stage 1 derived JEED web-cache deep-reading cards and source references only. It does not read or export raw cached source text.',
    },
    sourceFoundationRefs: REAL_DERIVED_JEED_DISCLOSURE_SOURCE_FOUNDATIONS,
    evidenceSpans: REAL_DERIVED_JEED_DISCLOSURE_EVIDENCE_SPANS,
    inheritedFrames: REAL_DERIVED_JEED_DISCLOSURE_INHERITED_FRAMES,
    observationCandidates: [
      {
        id: 'obs_real_jeed_work_procedure_decomposition',
        lens: 'external_evidence',
        text: 'JEED deep-reading card 156fe85fe4cf reads work as task procedure, tools, placement, safety, and contact points rather than a broad employment slot; source text is not exported and the card is unreviewed.',
        evidencePointer: 'span_jeed_work_procedure_decomposition_window',
        statusLabel: 'falcon_bootstrap_prior',
      },
      {
        id: 'obs_real_jeed_disclosure_translation_boundary',
        lens: 'external_evidence',
        text: 'The JEED card reads explanation, expression, understanding, and individual support as mutual translation into work conditions, not as disclosure volume, ability judgment, or accommodation validity.',
        evidencePointer: 'span_jeed_disclosure_translation_counter_window',
        statusLabel: 'falcon_bootstrap_prior',
      },
      {
        id: 'obs_real_l3_disclosure_procedure_prior',
        lens: 'external_evidence',
        text: 'L3 disclosure and information-procedure patterns require separating disclosure purpose from disclosure volume and translating information sharing into work-procedure, confirmation, safety, and evaluation design.',
        evidencePointer: 'span_l3_disclosure_information_procedure_prior',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inferenceCandidate: {
      id: 'inf_real_jeed_disclosure_procedure_kernel',
      text: 'The JEED-derived disclosure/procedure kernel is a consent-boundary and work-procedure hypothesis: who needs which information for which job, environment, support, time, institution, and sourceLensDifferences decision should be asked before any disclosure checklist, privacy warning, diagnosis-based communication rule, or broad information-sharing advice.',
      observationIds: [
        'obs_real_jeed_work_procedure_decomposition',
        'obs_real_jeed_disclosure_translation_boundary',
        'obs_real_l3_disclosure_procedure_prior',
      ],
      principalPatternCandidateIds: ['L3-PIP-10', 'L3-PIP-13', 'L3-PIP-17', 'L3-PIP-18'],
      crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-26', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_real_jeed_task_closure_interruption_handoff',
        text: 'The apparent disclosure problem may instead be unclear task closure, interruption load, supervisor handoff gap, informal update mismatch, safety confirmation gap, or evaluation ambiguity.',
        wouldChange: [
          'the next questions would move from disclosure volume toward work procedure, confirmation, safety, evaluation, and handoff design',
          'implementation actor conditions would require consent boundaries and decision owners before any information-sharing route is suggested',
        ],
        nextQuestionIds: [
          'mc_real_jeed_disc_person_001',
          'mc_real_jeed_disc_job_001',
          'mc_real_jeed_disc_support_001',
          'mc_real_jeed_disc_institution_001',
        ],
      },
    ],
    missingContext: [
      {
        id: 'mc_real_jeed_disc_person_001',
        slot: 'person',
        question:
          'What does the person consent to share, for which work decision, with whom, at what timing, and with what update or withdrawal boundary?',
        whyItMatters:
          'Disclosure purpose and consent boundary must be separated from disclosure volume before any information-sharing route is suggested.',
      },
      {
        id: 'mc_real_jeed_disc_job_001',
        slot: 'job',
        question:
          'Which task procedure, completion condition, instruction channel, safety step, role expectation, or evaluation point is failing?',
        whyItMatters:
          'Information sharing becomes useful only when connected to a concrete work-procedure decision.',
      },
      {
        id: 'mc_real_jeed_disc_environment_001',
        slot: 'environment',
        question:
          'Which environmental factor changes the information burden: noise, meeting format, informal updates, tool layout, supervisor availability, or interruption pattern?',
        whyItMatters:
          'Mistakes may come from information environment and workflow design, not from the person or disclosure amount.',
      },
      {
        id: 'mc_real_jeed_disc_support_001',
        slot: 'support',
        question:
          'Who can translate between person-consented information, workplace procedure, confirmation method, safety need, and evaluation rule?',
        whyItMatters:
          'Support must be defined as translation work, not as permission to disclose more information.',
      },
      {
        id: 'mc_real_jeed_disc_time_001',
        slot: 'time',
        question:
          'When does the information need appear: onboarding, task change, shift handoff, supervisor change, mistake review, health change, or evaluation timing?',
        whyItMatters:
          'The right information boundary may change over time and cannot be set by a static checklist.',
      },
      {
        id: 'mc_real_jeed_disc_institution_001',
        slot: 'institution',
        question:
          'Which employer, support, health, welfare, or public actor owns consent handling, workplace procedure change, safety confirmation, and evaluation boundary?',
        whyItMatters:
          'Disclosure and procedure design need decision ownership and institutional boundary visibility.',
      },
      {
        id: 'mc_real_jeed_disc_source_lens_001',
        slot: 'source_lens',
        question:
          'Where might respondent, supporter, employer, institutional, and external evidence lenses differ about the same information-sharing problem?',
        whyItMatters:
          'Source-lens differences should become review questions rather than being averaged into a generic disclosure answer.',
      },
      {
        id: 'mc_real_jeed_disc_evidence_001',
        slot: 'evidence',
        question:
          'Which parts come from JEED deep-reading cards, L3 bootstrap priors, FT03 response discipline, or weakness-audit boundary notes, and which need source/currentness review?',
        whyItMatters:
          'Axiom must not turn unreviewed deep-reading cards into support validity, disclosure advice, legal finality, or public copy.',
      },
    ],
    implementationActorConditions: [
      {
        actor: 'worker',
        condition:
          'Can define consent scope, purpose, audience, update point, and withdrawal or correction boundary for any information sharing.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_disc_person_001', 'mc_real_jeed_disc_time_001'],
      },
      {
        actor: 'support_staff',
        condition:
          'Can translate between person-consented information and work-procedure, confirmation, safety, and evaluation design without increasing disclosure by default.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_disc_support_001', 'mc_real_jeed_disc_source_lens_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Can identify which job procedure, environment condition, handoff, confirmation, or evaluation rule needs redesign.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_disc_job_001', 'mc_real_jeed_disc_environment_001'],
      },
      {
        actor: 'reviewer',
        condition:
          'Must review disclosure/consent/source/currentness boundaries before this packet can move toward candidate pattern, runtime use, public use, or learning update.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_jeed_disc_evidence_001', 'mc_real_jeed_disc_institution_001'],
      },
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'This JEED packet has no direct respondent data and routes consent and lived information boundaries to missing context.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'This JEED packet has no direct supporter data and routes support translation quality to missing context.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'JEED deep-reading cards, L3, FT03, Falcon eval profile, and weakness audit are bootstrap priors requiring Axiom eval before core truth.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are generated as consent, procedure, safety, evaluation, and review-boundary visibility requirements, not recommendations.',
      ),
    },
    actionabilityBand: 'question_first_only',
    cannotYetSay: [
      'No medical conclusion can be drawn from this JEED-derived disclosure/procedure packet.',
      'No legal or employment judgment is made.',
      'No accommodation recommendation, disclosure advice, support validity decision, or procedure-validity decision is approved.',
      'No public approval, runtime approval, candidate_pattern, knowledge promotion, or learning update is granted.',
      'No source/support validity decision, currentness decision, or public-use decision is made from JEED, L3, FT03, or audit materials.',
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomRealDerivedFtCodex03SupporterWorkplaceEvidencePacketFixture(): AxiomRealDerivedEvidencePacket {
  return {
    packetId: 'axiom_real_derived_evidence_packet_ftcodex03_supporter_workplace_quality_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_post_hiring_quality_evaluation_loop_v0',
    dataPolicy: {
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
      note: 'This packet uses Stage 1 FT-Codex-03 derived supporter/workplace summaries only. It does not read or export raw, redacted, or field-level source text.',
    },
    sourceFoundationRefs: REAL_DERIVED_FTCODEX03_SUPPORTER_WORKPLACE_SOURCE_FOUNDATIONS,
    evidenceSpans: REAL_DERIVED_FTCODEX03_SUPPORTER_WORKPLACE_EVIDENCE_SPANS,
    inheritedFrames: REAL_DERIVED_FTCODEX03_SUPPORTER_WORKPLACE_INHERITED_FRAMES,
    observationCandidates: [
      {
        id: 'obs_real_ftcodex03_supporter_translation_capacity',
        lens: 'supporter_data',
        text: 'FT-Codex-03 reads supporter-side materials as translation capacity across medical, institutional, job-opening, workplace, and person-explanation surfaces rather than support-menu effectiveness.',
        evidencePointer: 'span_ftcodex03_supporter_retranslation_capacity',
        statusLabel: 'shared_evidence_foundation',
      },
      {
        id: 'obs_real_ftcodex03_workplace_quality_contact',
        lens: 'supporter_data',
        text: 'FT-Codex-03 reads workplace-side materials as contact points for safety, staffing margin, job posting signals, consultation lines, livelihood effects, and future role redesign rather than employer correctness.',
        evidencePointer: 'span_ftcodex03_workplace_quality_contact_window',
        statusLabel: 'shared_evidence_foundation',
      },
      {
        id: 'obs_real_l3_post_hiring_quality_prior',
        lens: 'external_evidence',
        text: 'L3 post-hiring quality patterns require separating employment status from participation quality, role, evaluation, growth, future conversation, sourceLensDifferences, and review-loop boundaries.',
        evidencePointer: 'span_l3_post_hiring_quality_prior',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inferenceCandidate: {
      id: 'inf_real_ftcodex03_post_hiring_quality_kernel',
      text: 'The FT-Codex-03 supporter/workplace packet is a post-hiring quality and evaluation-loop kernel: employment counts, placement, continuation, or support presence should be critiqued through job, environment, support, time, institution, and sourceLensDifferences questions about role, evaluation, growth, livelihood, health-time cost, consultation line, and future redesign before any success language or public claim.',
      observationIds: [
        'obs_real_ftcodex03_supporter_translation_capacity',
        'obs_real_ftcodex03_workplace_quality_contact',
        'obs_real_l3_post_hiring_quality_prior',
      ],
      principalPatternCandidateIds: ['L3-PIP-06', 'L3-PIP-19', 'L3-PIP-20', 'L3-PIP-21'],
      crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_real_ftcodex03_count_hides_role_or_health_cost',
        text: 'Employment count improvement or continued placement may hide role stagnation, evaluation ambiguity, health-time cost, livelihood pressure, support discontinuity, or future redesign failure.',
        wouldChange: [
          'the critique would move from success language toward missing outcome signals and source-lens gaps',
          'implementation actor conditions would require employer, supporter, public/institutional, and reviewer visibility before public claims or learning updates',
        ],
        nextQuestionIds: [
          'mc_real_ftcodex03_job_001',
          'mc_real_ftcodex03_support_001',
          'mc_real_ftcodex03_time_001',
          'mc_real_ftcodex03_source_lens_001',
        ],
      },
    ],
    missingContext: [
      {
        id: 'mc_real_ftcodex03_job_001',
        slot: 'job',
        question:
          'What changed after hiring: role, task scope, evaluation criteria, treatment of support-enabled performance, wages, promotion, or future role conversation?',
        whyItMatters:
          'Employment status is not enough; post-hiring quality depends on role, evaluation, growth, and value translation.',
      },
      {
        id: 'mc_real_ftcodex03_environment_001',
        slot: 'environment',
        question:
          'Which workplace conditions shape post-hiring quality: safety, staffing margin, customer contact, consultation line, information format, absence substitution, or supervisor availability?',
        whyItMatters:
          'The same employment count can hide different workplace contact points and participation-quality costs.',
      },
      {
        id: 'mc_real_ftcodex03_support_001',
        slot: 'support',
        question:
          'Which support relation remains over time: referral, return circuit, employer explanation, medical/work interface, livelihood bridge, learning place, or review loop?',
        whyItMatters:
          'Support continuity is a retranslation spine, not proof that support or accommodation is valid.',
      },
      {
        id: 'mc_real_ftcodex03_time_001',
        slot: 'time',
        question:
          'What time horizon is being evaluated: initial placement, retention, health change, leave/income sequence, role expansion, treatment redesign, or future career conversation?',
        whyItMatters:
          'Post-hiring quality can change over time and should not be reduced to one count or one stable-status signal.',
      },
      {
        id: 'mc_real_ftcodex03_institution_001',
        slot: 'institution',
        question:
          'Which employer, support agency, medical or health actor, welfare actor, or public institution owns role/evaluation, support continuity, livelihood, and future redesign decisions?',
        whyItMatters:
          'A critique cannot become action guidance without decision owners and institutional constraints.',
      },
      {
        id: 'mc_real_ftcodex03_source_lens_001',
        slot: 'source_lens',
        question:
          'Where might respondent, supporter, employer, institutional, research, and public lenses differ about the same post-hiring quality signal?',
        whyItMatters:
          'Source-lens differences must be exposed before public success language or learning updates.',
      },
      {
        id: 'mc_real_ftcodex03_evidence_001',
        slot: 'evidence',
        question:
          'Which parts come from FT-Codex-03 summaries, network reconnection, L3 bootstrap priors, FT03 response discipline, or weakness-audit boundary notes, and which need source/currentness review?',
        whyItMatters:
          'Axiom must not turn supporter/workplace derived reading into outcome proof, source/support validity, or public copy.',
      },
    ],
    implementationActorConditions: [
      {
        actor: 'support_staff',
        condition:
          'Can describe support continuity as a retranslation spine across person, workplace, medical, livelihood, and institutional surfaces without claiming support validity.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_ftcodex03_support_001', 'mc_real_ftcodex03_source_lens_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Can inspect role, task scope, evaluation, workplace contact points, safety, staffing margin, and future redesign rather than relying on employment status.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_ftcodex03_job_001', 'mc_real_ftcodex03_environment_001'],
      },
      {
        actor: 'public_or_institutional_actor',
        condition:
          'Can distinguish program count signals from participation-quality, livelihood, source/currentness, and public-claim boundaries.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_ftcodex03_time_001', 'mc_real_ftcodex03_institution_001'],
      },
      {
        actor: 'reviewer',
        condition:
          'Must review source/currentness/outcome-evidence boundaries before this packet can move toward candidate pattern, runtime use, public use, or learning update.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_ftcodex03_evidence_001', 'mc_real_ftcodex03_source_lens_001'],
      },
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'This FT-Codex-03 packet does not include direct respondent data and routes respondent-lens differences to missing context.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'present_in_evidence_foundation_fixture',
        'Supporter/workplace-side derived readings are present as source-lens material, not support validity or outcome proof.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'FT-Codex-03 network reconnection, L3, FT03, Falcon eval profile, and weakness audit are bootstrap priors requiring Axiom eval before core truth.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are generated as role/evaluation/source-lens/review-boundary visibility requirements, not recommendations.',
      ),
    },
    actionabilityBand: 'question_first_only',
    cannotYetSay: [
      'No medical conclusion can be drawn from this FT-Codex-03 supporter/workplace packet.',
      'No legal or employment judgment is made.',
      'No accommodation recommendation, support validity decision, outcome proof, or public success claim is approved.',
      'No public approval, runtime approval, candidate_pattern, knowledge promotion, or learning update is granted.',
      'No source/support validity decision, currentness decision, or public-use decision is made from FT-Codex-03, L3, FT03, or audit materials.',
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomRealDerivedPublicConditionWindowEvidencePacketFixture(): AxiomRealDerivedEvidencePacket {
  return {
    packetId: 'axiom_real_derived_evidence_packet_public_condition_window_non_lookup_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_public_condition_window_non_lookup_v0',
    dataPolicy: {
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
      note: 'This packet uses Stage 1 derived condition-window summaries only. It does not read or export raw, redacted, or field-level source text and does not create public copy.',
    },
    sourceFoundationRefs: REAL_DERIVED_PUBLIC_CONDITION_WINDOW_SOURCE_FOUNDATIONS,
    evidenceSpans: REAL_DERIVED_PUBLIC_CONDITION_WINDOW_EVIDENCE_SPANS,
    inheritedFrames: REAL_DERIVED_PUBLIC_CONDITION_WINDOW_INHERITED_FRAMES,
    observationCandidates: [
      {
        id: 'obs_real_public_condition_window_guardrail',
        lens: 'external_evidence',
        text: 'FT-Codex-03 says disease names, disability names, system categories, age, region, and workplace size can be condition windows, but not lookup keys for support, difficulty, medical judgment, or accommodation finality.',
        evidencePointer: 'span_ftcodex03_condition_window_guardrail',
        statusLabel: 'falcon_bootstrap_prior',
      },
      {
        id: 'obs_real_public_condition_no_lookup_boundary',
        lens: 'external_evidence',
        text: 'FT-Codex-03 boundary requires support examples and employment difficulty to be read as person-job-environment-support-time-institution interactions, not as simple causality or public-approved support guidance.',
        evidencePointer: 'span_ftcodex03_public_boundary_no_lookup',
        statusLabel: 'falcon_bootstrap_prior',
      },
      {
        id: 'obs_real_l3_public_condition_window_prior',
        lens: 'external_evidence',
        text: 'L3 public condition-window patterns require reframing categories through health time, commute/rest, disclosure purpose, worksite contact points, implementation differences, and public-currentness boundaries.',
        evidencePointer: 'span_l3_public_condition_window_prior',
        statusLabel: 'falcon_bootstrap_prior',
      },
    ],
    inferenceCandidate: {
      id: 'inf_real_public_condition_window_non_lookup_kernel',
      text: 'The public condition-window kernel treats a category as a condition window, not an answer: it should show multiple possible work-contact points across person, job, environment, support, time, and institution, state public-currentness and public-approval limits, and convert support examples into confirmation questions and work-design lenses before any public page text.',
      observationIds: [
        'obs_real_public_condition_window_guardrail',
        'obs_real_public_condition_no_lookup_boundary',
        'obs_real_l3_public_condition_window_prior',
      ],
      principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-04', 'L3-PIP-10', 'L3-PIP-15', 'L3-PIP-21'],
      crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_real_public_condition_category_hides_contact_point',
        text: 'A disease, disability, or制度 category may hide several different contact points: health-time cost, commute/rest access, disclosure purpose, worksite tools/equipment, support continuity, regional resource gap, or evaluation boundary.',
        wouldChange: [
          'public-readable material would remain blocked and be converted into confirmation questions until source/currentness and public approval are reviewed',
          'implementation actor conditions would require public-copy reviewer and domain reviewer visibility before any category page is released',
        ],
        nextQuestionIds: [
          'mc_real_public_condition_person_001',
          'mc_real_public_condition_job_001',
          'mc_real_public_condition_support_001',
          'mc_real_public_condition_institution_001',
        ],
      },
    ],
    missingContext: [
      {
        id: 'mc_real_public_condition_person_001',
        slot: 'person',
        question:
          'Which lived contact point is actually opened by the category: health-time fluctuation, sensory/information access, mobility, disclosure boundary, life security, or role/evaluation concern?',
        whyItMatters:
          'A category cannot be used as a person-level answer or medical/work-capacity conclusion.',
      },
      {
        id: 'mc_real_public_condition_job_001',
        slot: 'job',
        question:
          'Which job condition could change the meaning of the category: workload rhythm, task procedure, tools/equipment, commute, safety, handoff, or evaluation?',
        whyItMatters:
          'Public condition-window content must point to work-design questions, not support menus.',
      },
      {
        id: 'mc_real_public_condition_environment_001',
        slot: 'environment',
        question:
          'Which environment condition matters: workplace size, region, rest place, meeting format, information format, physical layout, or informal rule?',
        whyItMatters:
          'The same category can open different environmental questions and cannot be generalized into a fixed difficulty profile.',
      },
      {
        id: 'mc_real_public_condition_support_001',
        slot: 'support',
        question:
          'Which support examples are only confirmation questions, and which would require source/support validity review before public use?',
        whyItMatters:
          'Support examples are not support validity and must not become public-approved advice automatically.',
      },
      {
        id: 'mc_real_public_condition_time_001',
        slot: 'time',
        question:
          'What timing changes the category reading: treatment, commute, rest, onboarding, task change, review timing, income pressure, or future progression?',
        whyItMatters:
          'Condition windows often change over time and should not become static public explanations.',
      },
      {
        id: 'mc_real_public_condition_institution_001',
        slot: 'institution',
        question:
          'Which employer, support, medical, welfare, or public actor can verify currentness, public boundary, and decision ownership before release?',
        whyItMatters:
          'Public condition-window content requires currentness and public approval boundaries before publication.',
      },
      {
        id: 'mc_real_public_condition_evidence_001',
        slot: 'evidence',
        question:
          'Which parts come from FT-Codex-03 summaries, L3 bootstrap priors, FT03 response discipline, or weakness-audit boundary notes, and which need source/currentness/public review?',
        whyItMatters:
          'Axiom must not turn unreviewed derived reading into public copy, source/support validity, or publication approval.',
      },
      {
        id: 'mc_real_public_condition_source_lens_001',
        slot: 'source_lens',
        question:
          'How might respondent, supporter, employer, institutional, research, public, and condition-category lenses differ on the same public-facing category?',
        whyItMatters:
          'Source-lens differences must remain visible before public condition pages are drafted or approved.',
      },
    ],
    implementationActorConditions: [
      {
        actor: 'worker',
        condition:
          'Can be represented through lived contact points and consent boundaries rather than diagnosis, disability category, or capacity generalization.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_public_condition_person_001', 'mc_real_public_condition_time_001'],
      },
      {
        actor: 'support_staff',
        condition:
          'Can translate support examples into confirmation questions and work-design lenses without treating them as valid recommendations.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_public_condition_support_001', 'mc_real_public_condition_source_lens_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Can inspect job, environment, procedure, tools, commute, safety, rest, and evaluation contact points before any workplace-facing wording.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_public_condition_job_001', 'mc_real_public_condition_environment_001'],
      },
      {
        actor: 'reviewer',
        condition:
          'Must review source/currentness/public-copy/public-safety boundaries before this packet can move toward public page content, candidate pattern, runtime use, or learning update.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_real_public_condition_evidence_001', 'mc_real_public_condition_institution_001'],
      },
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'This public condition-window packet has no direct respondent data and routes lived contact-point differences to missing context.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'This public condition-window packet has no direct supporter packet and routes support examples to missing context and review.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'FT-Codex-03, L3, FT03, Falcon eval profile, and weakness audit are bootstrap priors requiring Axiom eval before core truth or public use.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are generated as public-boundary, source-currentness, and work-design visibility requirements, not recommendations.',
      ),
    },
    actionabilityBand: 'public_boundary_blocked',
    cannotYetSay: [
      'No medical conclusion can be drawn from this public condition-window packet.',
      'No legal or employment judgment is made.',
      'No accommodation recommendation, support validity decision, category-difficulty profile, or public support guidance is approved.',
      'No public approval, runtime approval, candidate_pattern, knowledge promotion, publication, or learning update is granted.',
      'No source/support validity decision, currentness decision, or public-use decision is made from FT-Codex-03, L3, FT03, or audit materials.',
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAllAxiomRealDerivedEvidencePacketFixtures(): AxiomRealDerivedEvidencePacket[] {
  return [
    buildAxiomRealDerivedHealthTimeEvidencePacketFixture(),
    buildAxiomRealDerivedJeedPolicyServiceEvidencePacketFixture(),
    buildAxiomRealDerivedJeedDisclosureProcedureEvidencePacketFixture(),
    buildAxiomRealDerivedFtCodex03SupporterWorkplaceEvidencePacketFixture(),
    buildAxiomRealDerivedPublicConditionWindowEvidencePacketFixture(),
  ];
}

export function buildAxiomRealDerivedKernelBuildGroundingInput(
  packet: AxiomRealDerivedEvidencePacket = buildAxiomRealDerivedHealthTimeEvidencePacketFixture(),
): AxiomKernelBuildGroundingInput {
  return {
    inputId: `axiom_kernel_build_grounding_input_real_derived_${packet.scenarioId}_v0_2026_06_08`,
    objectType: 'axiom_kernel_build_grounding_input',
    contractVersion: AXIOM_KERNEL_BUILD_GROUNDING_CONTRACT_VERSION,
    lane: 'Falcon Lab',
    inputMode: 'evidence_foundation_fixture',
    scenarioId: packet.scenarioId,
    sourceFoundationRefs: packet.sourceFoundationRefs,
    evidenceSpans: packet.evidenceSpans,
    inheritedFrames: packet.inheritedFrames,
    targetReviewUnitCountCap: packet.targetReviewUnitCountCap,
    movementBoundary: packet.movementBoundary,
  };
}

export function buildAxiomRealDerivedInteractionHypothesisKernel(
  packet: AxiomRealDerivedEvidencePacket = buildAxiomRealDerivedHealthTimeEvidencePacketFixture(),
): AxiomInteractionHypothesisKernel {
  const packetSlug = realDerivedPacketSlug(packet);

  return {
    kernelId: `axiom_kernel_real_derived_${packetSlug}`,
    objectType: 'axiom_interaction_hypothesis_kernel',
    contractVersion: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_CONTRACT_VERSION,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_build',
    status: 'axiom_kernel_candidate_requires_eval',
    boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    bootstrapStatus: [...AXIOM_REQUIRED_BOOTSTRAP_LABELS],
    inputMode: 'evidence_foundation_fixture',
    observation: packet.observationCandidates,
    inference: [packet.inferenceCandidate],
    counterHypothesis: packet.counterHypothesis,
    missingContext: packet.missingContext,
    implementationActorConditions: packet.implementationActorConditions,
    sourceLensStatus: packet.sourceLensStatus,
    actionabilityBand: packet.actionabilityBand,
    cannotYetSay: packet.cannotYetSay,
    humanReviewRoute: {
      reviewUnit: 'kernel_contract',
      reviewUnitScale: 'framework_unit_not_instance_hypothesis',
      estimatedCoreReviewUnits: 8,
      routeStatus: 'provisional_internal_generation_allowed_review_required_before_promotion',
      blocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
      doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
      reviewerQuestion:
        `Does ${packet.packetId} produce a grounded provisional Axiom kernel for ${packet.scenarioId} without promoting source/support validity, runtime use, learning, or public use?`,
    },
    movementBoundary: packet.movementBoundary,
  };
}

export function validateAxiomRealDerivedEvidencePacket(
  packet: AxiomRealDerivedEvidencePacket,
): AxiomRealDerivedEvidencePacketValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  pushIf(
    packet.objectType !== 'axiom_real_derived_evidence_packet',
    errors,
    'object_type_must_be_axiom_real_derived_evidence_packet',
  );
  pushIf(
    packet.contractVersion !== AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    errors,
    'contract_version_must_match_real_derived_protocol_v0_2026_06_08',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.status !== 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    errors,
    'status_must_remain_ready_for_deterministic_kernel_build',
  );
  pushIf(
    packet.dataPolicy.inputLayer !== 'references_derived_and_docs_only' ||
      packet.dataPolicy.rawOriginalOpened !== false ||
      packet.dataPolicy.sourceTextExported !== false ||
      packet.dataPolicy.redactedTextExported !== false ||
      packet.dataPolicy.fieldValueExported !== false ||
      packet.dataPolicy.containsSensitiveRawText !== false ||
      packet.dataPolicy.sourceSupportValidityDecision !== 'not_decided' ||
      packet.dataPolicy.publicUse !== 'not_public_approved',
    errors,
    'real_derived_packet_must_not_open_or_export_raw_redacted_or_field_values',
  );
  pushIf(packet.sourceFoundationRefs.length === 0, errors, 'source_foundation_refs_required');
  pushIf(packet.evidenceSpans.length === 0, errors, 'evidence_spans_required');
  pushIf(packet.observationCandidates.length === 0, errors, 'observation_candidates_required');
  pushIf(!hasText(packet.inferenceCandidate.text), errors, 'inference_candidate_text_required');
  pushIf(packet.counterHypothesis.length === 0, errors, 'counter_hypothesis_required');
  pushIf(packet.missingContext.length === 0, errors, 'missing_context_required');
  pushIf(
    packet.implementationActorConditions.length === 0,
    errors,
    'implementation_actor_conditions_required',
  );

  const foundationIds = new Set(packet.sourceFoundationRefs.map((source) => source.id));
  const spanIds = new Set(packet.evidenceSpans.map((span) => span.id));
  const observationIds = new Set(packet.observationCandidates.map((observation) => observation.id));
  const missingContextIds = new Set(packet.missingContext.map((context) => context.id));

  for (const source of packet.sourceFoundationRefs) {
    pushIf(!hasText(source.uri), errors, `source_uri_required:${source.id}`);
    pushIf(
      source.status !== 'available_as_bootstrap_prior_requires_axiom_eval' ||
        source.containsSensitiveRawText !== false ||
        source.allowedAsAxiomCoreTruth !== false ||
        source.requiresAxiomEval !== true,
      errors,
      `source_must_remain_bootstrap_prior_requires_axiom_eval:${source.id}`,
    );
  }

  for (const span of packet.evidenceSpans) {
    pushIf(
      !foundationIds.has(span.foundationRefId),
      errors,
      `span_foundation_ref_missing:${span.id}`,
    );
    pushIf(
      span.sourceValidity !== 'not_decided' ||
        span.supportValidity !== 'not_decided' ||
        span.publicUse !== 'not_public_approved' ||
        span.promotionStatus !== 'not_promoted' ||
        span.containsSensitiveRawText !== false,
      errors,
      `span_must_not_move_validity_public_or_promotion:${span.id}`,
    );
  }

  for (const observation of packet.observationCandidates) {
    pushIf(!spanIds.has(observation.evidencePointer), errors, `observation_span_missing:${observation.id}`);
  }

  pushIf(
    packet.inferenceCandidate.observationIds.some((id) => !observationIds.has(id)),
    errors,
    'inference_observation_ids_must_point_to_observation_candidates',
  );
  pushIf(
    packet.inferenceCandidate.statusLabel !== 'provisional_not_reviewed',
    errors,
    'inference_must_remain_provisional_not_reviewed',
  );
  pushIf(
    packet.inferenceCandidate.principalPatternCandidateIds.length === 0 ||
      packet.inferenceCandidate.crossCuttingCheckIds.length === 0,
    errors,
    'inference_must_keep_l3_pattern_and_cross_cutting_ids',
  );

  for (const counter of packet.counterHypothesis) {
    pushIf(
      counter.nextQuestionIds.some((id) => !missingContextIds.has(id)),
      errors,
      `counter_next_questions_must_point_to_missing_context:${counter.id}`,
    );
  }

  for (const condition of packet.implementationActorConditions) {
    pushIf(
      condition.missingContextIds.some((id) => !missingContextIds.has(id)),
      errors,
      `actor_condition_missing_context_ref_missing:${condition.actor}`,
    );
  }

  const cannotYetSayText = packet.cannotYetSay.join(' ').toLowerCase();
  for (const required of [
    'medical',
    'legal',
    'employment',
    'accommodation',
    'support validity',
    'public approval',
    'runtime approval',
  ]) {
    pushIf(!cannotYetSayText.includes(required), errors, `cannot_yet_say_missing:${required}`);
  }

  if (packet.sourceLensStatus.supporter_data.status === 'thin_or_missing') {
    warnings.push('supporter_lens_missing_in_first_real_derived_packet');
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_derived_evidence_packet_valid'
        : 'real_derived_evidence_packet_invalid',
    errorCount: errors.length,
    errors,
    warningCount: warnings.length,
    warnings,
    boundary: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY,
  };
}

export function runAxiomRealDerivedEvidenceKernelBuild(
  evidencePacket: AxiomRealDerivedEvidencePacket = buildAxiomRealDerivedHealthTimeEvidencePacketFixture(),
): AxiomRealDerivedKernelBuildRun {
  const packetSlug = realDerivedPacketSlug(evidencePacket);
  const evidencePacketValidation = validateAxiomRealDerivedEvidencePacket(evidencePacket);
  const buildGroundingInput = buildAxiomRealDerivedKernelBuildGroundingInput(evidencePacket);
  const kernel = buildAxiomRealDerivedInteractionHypothesisKernel(evidencePacket);
  const buildGroundingPacket = buildAxiomKernelBuildGroundingPacketFromKernel({
    input: buildGroundingInput,
    kernel,
    packetId: `axiom_kernel_build_grounding_packet_real_derived_${packetSlug}`,
    mapId: `axiom_kernel_grounding_map_real_derived_${packetSlug}`,
    notGroundedAsCoreTruth: [
      'raw_original_survey_text',
      'redacted_source_text',
      'field_values',
      'source_support_validity',
      'falcon_public_page',
      'sns_progress',
      'stage1_derived_material_without_axiom_eval',
      'l3_21_views_without_axiom_eval',
      'ft03_contract_without_axiom_eval',
    ],
    notNow: [
      'no_raw_original_or_redacted_text_export',
      'no_public_page_filling',
      'no_public_navigation',
      'no_publication',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_or_learning_update',
    ],
  });
  const validation = validateAxiomKernelBuildGroundingPacket(buildGroundingPacket);
  const reviewUnitCompression = buildAxiomKernelBuildGroundingReviewUnitCompression([
    buildGroundingPacket,
  ]);
  const passed = evidencePacketValidation.valid && validation.valid;

  return {
    runId: `axiom_real_derived_kernel_build_run_${packetSlug}`,
    objectType: 'axiom_real_derived_evidence_kernel_build_run',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: passed
      ? 'passed_real_derived_non_sensitive_kernel_build'
      : 'failed_real_derived_kernel_build',
    boundary: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY,
    evidencePacket,
    evidencePacketValidation,
    buildGroundingInput,
    buildGroundingPacket,
    validation,
    reviewUnitCompression,
    notNow: buildGroundingPacket.notNow,
  };
}

export function runAxiomRealDerivedEvidenceKernelBuildBatch(
  evidencePackets: AxiomRealDerivedEvidencePacket[] = buildAllAxiomRealDerivedEvidencePacketFixtures(),
): AxiomRealDerivedKernelBuildBatchRun {
  const runs = evidencePackets.map((packet) => runAxiomRealDerivedEvidenceKernelBuild(packet));
  const reviewUnitCompression = buildAxiomKernelBuildGroundingReviewUnitCompression(
    runs.map((run) => run.buildGroundingPacket),
  );
  const passed = runs.every(
    (run) => run.status === 'passed_real_derived_non_sensitive_kernel_build',
  );

  return {
    runId: 'axiom_real_derived_kernel_build_batch_run_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_kernel_build_batch_run',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: passed
      ? 'passed_real_derived_non_sensitive_kernel_build_batch'
      : 'failed_real_derived_kernel_build_batch',
    boundary: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY,
    packetCount: runs.length,
    scenarioCount: new Set(runs.map((run) => run.evidencePacket.scenarioId)).size,
    runs,
    reviewUnitCompression,
    notNow: Array.from(new Set(runs.flatMap((run) => run.notNow))),
  };
}
