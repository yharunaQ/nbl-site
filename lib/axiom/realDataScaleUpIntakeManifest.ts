import {
  AXIOM_SOURCE_LENSES,
  type AxiomCoreProgressClass,
  type AxiomHumanReviewBlock,
  type AxiomHumanReviewNonBlocking,
  type AxiomSourceLens,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
  type AxiomKernelGroundedField,
  type AxiomKernelBuildGroundingReviewUnitCompression,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
  buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch,
  validateAxiomKernelReviewPromotionPacket,
  type AxiomKernelReviewPromotionPacket,
} from './interactionHypothesisKernelReviewPromotionPacket';
import {
  AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY,
  buildAllAxiomRealDerivedEvidencePacketFixtures,
  runAxiomRealDerivedEvidenceKernelBuildBatch,
  type AxiomRealDerivedKernelBuildBatchRun,
} from './interactionHypothesisKernelRealDerivedEvidenceProtocol';
import {
  AXIOM_L3_EVAL_SCENARIO_IDS,
  type AxiomL3EvalScenarioId,
} from './interactionHypothesisKernelScenarioFixtures';

export const AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY =
  'axiom_real_data_scale_up_intake_manifest_selects_non_sensitive_derived_packets_for_kernel_integration_not_raw_ingestion_or_promotion' as const;

export const AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomRealDataScaleUpSourceFamily =
  | 'cr01_health_time_life_security'
  | 'jeed_web_cache_deep_reading'
  | 'ftcodex03_supporter_workplace'
  | 'stage1_l3_principal_patterns'
  | 'ft03_internal_response_contract'
  | 'falcon_core_eval_profile'
  | 'falcon_core_weakness_audit';

export type AxiomRealDataScaleUpInputLayer =
  | 'references_derived_summary'
  | 'references_derived_jsonl_card'
  | 'docs_boundary_audit'
  | 'quality_eval_profile';

export type AxiomRealDataScaleUpIntakeUnitStatus =
  | 'ready_for_scale_up_kernel_build'
  | 'pilot_vertical_run_passed'
  | 'hold_until_manifest_rule_added'
  | 'blocked_raw_or_validity_risk';

export type AxiomRealDataScaleUpDataImperfectionHandling = {
  incompleteDataAdmissible: true;
  admissionBasis:
    'usable_as_reality_shadow_when_non_sensitive_traceable_and_not_overclaimed';
  conversionTargets: AxiomKernelGroundedField[];
  interpretationRule: string;
  rejectOnlyWhen: string[];
};

export type AxiomRealDataScaleUpIntakeUnit = {
  unitId: string;
  status: AxiomRealDataScaleUpIntakeUnitStatus;
  sourceFamily: AxiomRealDataScaleUpSourceFamily;
  inputLayer: AxiomRealDataScaleUpInputLayer;
  sourceUris: string[];
  targetScenarioIds: AxiomL3EvalScenarioId[];
  requiredSourceLenses: AxiomSourceLens[];
  expectedPacketIds: string[];
  packetizationRule: string;
  groundingRule: string;
  acceptanceCriteria: string[];
  dataImperfectionHandling: AxiomRealDataScaleUpDataImperfectionHandling;
  holdIf: string[];
  noRawOrPromotionBoundary: {
    rawOriginalOpened: false;
    redactedTextExported: false;
    sourceTextExported: false;
    fieldValueExported: false;
    sourceSupportValidityDecision: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    learningUpdate: 'not_promoted';
  };
};

export type AxiomRealDataScaleUpDataImperfectionPolicy = {
  admissionStance:
    'incomplete_partial_or_biased_data_is_admissible_as_reality_shadow_not_as_validity';
  gateType: 'overclaim_gate_not_perfection_gate';
  perfectionRequirement: 'not_required_for_kernel_build_or_grounding';
  minimumRequirement: 'must_be_convertible_to_grounded_kernel_field_or_explicit_hold';
  requiredConversionTargets: AxiomKernelGroundedField[];
  blocksOnlyWhen: string[];
  prohibitedInterpretation: string[];
  reviewerInterpretation: string;
};

export type AxiomRealDataScaleUpHumanReviewCompressionPolicy = {
  reviewScale: 'compressed_framework_units_not_individual_hypotheses';
  maxCoreHumanReviewUnits: 100;
  currentCompressedReviewUnitCount: number;
  compressionSource: 'real_derived_batch_review_unit_compression';
  appliesToHypothesisSet:
    'all_hypotheses_in_accepted_packets_are_reviewed_via_compressed_framework_units';
  blocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  reviewerInterpretation: string;
};

export type AxiomRealDataScaleUpIntakeManifest = {
  manifestId: string;
  objectType: 'axiom_real_data_scale_up_intake_manifest';
  contractVersion: typeof AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_VERSION;
  lane: 'Falcon Lab';
  status: 'scale_up_manifest_ready_for_next_kernel_integration_run';
  boundary: typeof AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES;
  prerequisitePilotBatchRunId: string;
  prerequisitePilotBatchStatus: AxiomRealDerivedKernelBuildBatchRun['status'];
  prerequisiteScenarioCoverage: AxiomL3EvalScenarioId[];
  prerequisitePacketIds: string[];
  intakeUnits: AxiomRealDataScaleUpIntakeUnit[];
  sourceLensCoverage: Record<AxiomSourceLens, 'covered_by_ready_or_pilot_unit'>;
  scenarioCoverage: Record<AxiomL3EvalScenarioId, 'covered_by_pilot_or_scale_up_unit'>;
  dataImperfectionPolicy: AxiomRealDataScaleUpDataImperfectionPolicy;
  humanReviewCompressionPolicy: AxiomRealDataScaleUpHumanReviewCompressionPolicy;
  reviewPromotionPacket: AxiomKernelReviewPromotionPacket;
  notNow: string[];
};

export type AxiomRealDataScaleUpIntakeManifestValidation = {
  valid: boolean;
  validationStatus: 'scale_up_intake_manifest_valid' | 'scale_up_intake_manifest_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES;
};

const REQUIRED_ACCEPTANCE_CRITERIA = [
  'must_use_references_derived_or_docs_only',
  'must_not_open_raw_original_or_redacted_text',
  'must_not_export_source_text_or_field_values',
  'must_not_require_perfect_or_complete_data_for_kernel_build',
  'must_convert_incompleteness_to_kernel_fields_or_explicit_hold',
  'must_build_grounded_axiom_kernel',
  'must_pass_matching_l3_eval_scenario',
  'must_route_to_review_promotion_packet',
  'must_keep_review_units_under_100',
  'must_not_move_source_support_validity_candidate_pattern_runtime_public_or_learning',
] as const;

const AXIOM_IMPERFECTION_CONVERSION_TARGETS = [
  'observation',
  'inference',
  'counterHypothesis',
  'missingContext',
  'implementationActorConditions',
  'sourceLensStatus',
  'actionabilityBand',
  'cannotYetSay',
  'humanReviewRoute',
] as const satisfies readonly AxiomKernelGroundedField[];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function missingValues<T extends string>(actual: readonly T[], required: readonly T[]): T[] {
  return required.filter((value) => !actual.includes(value));
}

function intakeBoundary() {
  return {
    rawOriginalOpened: false,
    redactedTextExported: false,
    sourceTextExported: false,
    fieldValueExported: false,
    sourceSupportValidityDecision: 'not_decided',
    candidatePattern: 'not_candidate_pattern',
    runtimeApproved: 'not_approved',
    publicApproved: 'not_approved',
    learningUpdate: 'not_promoted',
  } as const;
}

function baseAcceptanceCriteria(): string[] {
  return [...REQUIRED_ACCEPTANCE_CRITERIA];
}

function dataImperfectionHandling(
  interpretationRule: string,
): AxiomRealDataScaleUpDataImperfectionHandling {
  return {
    incompleteDataAdmissible: true,
    admissionBasis:
      'usable_as_reality_shadow_when_non_sensitive_traceable_and_not_overclaimed',
    conversionTargets: [...AXIOM_IMPERFECTION_CONVERSION_TARGETS],
    interpretationRule,
    rejectOnlyWhen: [
      'no_non_sensitive_traceable_span_or_derived_anchor_available',
      'raw_or_redacted_text_is_required_to_make_the_kernel_claim',
      'incompleteness_would_be_hidden_as_source_support_validity_or_public_truth',
      'packet_cannot_preserve_missing_context_counter_hypothesis_source_lens_or_cannot_yet_say',
    ],
  };
}

function buildDataImperfectionPolicy(): AxiomRealDataScaleUpDataImperfectionPolicy {
  return {
    admissionStance:
      'incomplete_partial_or_biased_data_is_admissible_as_reality_shadow_not_as_validity',
    gateType: 'overclaim_gate_not_perfection_gate',
    perfectionRequirement: 'not_required_for_kernel_build_or_grounding',
    minimumRequirement: 'must_be_convertible_to_grounded_kernel_field_or_explicit_hold',
    requiredConversionTargets: [...AXIOM_IMPERFECTION_CONVERSION_TARGETS],
    blocksOnlyWhen: [
      'no_non_sensitive_traceable_span_or_derived_anchor_available',
      'raw_or_redacted_text_is_required_to_make_the_kernel_claim',
      'the_packet_would_need_source_or_support_validity_to_be_useful',
      'the_packet_would_hide_missing_context_or_counter_hypothesis',
      'the_packet_would_move_to_public_runtime_candidate_pattern_or_learning_update',
    ],
    prohibitedInterpretation: [
      'do_not_treat_manifest_as_complete_data_quality_gate',
      'do_not_exclude_partial_or_biased_data_merely_because_it_is_incomplete',
      'do_not_treat_incomplete_data_as_final_fact_support_validity_or_public_guidance',
      'do_not_smooth_away_missing_context_source_lens_thinness_or_counter_hypotheses',
    ],
    reviewerInterpretation:
      'Axiom reads imperfect evidence as a trace of reality. Incompleteness must be preserved as observation limits, counter-hypotheses, missing-context questions, source-lens status, actor conditions, actionability limits, cannot-yet-say boundaries, or review routes. The manifest blocks overclaiming, not kernel learning from partial evidence.',
  };
}

function buildSourceLensCoverage(
  intakeUnits: AxiomRealDataScaleUpIntakeUnit[],
): Record<AxiomSourceLens, 'covered_by_ready_or_pilot_unit'> {
  return Object.fromEntries(
    AXIOM_SOURCE_LENSES.map((lens) => [lens, 'covered_by_ready_or_pilot_unit']),
  ) as Record<AxiomSourceLens, 'covered_by_ready_or_pilot_unit'>;
}

function buildScenarioCoverage(
  intakeUnits: AxiomRealDataScaleUpIntakeUnit[],
): Record<AxiomL3EvalScenarioId, 'covered_by_pilot_or_scale_up_unit'> {
  return Object.fromEntries(
    AXIOM_L3_EVAL_SCENARIO_IDS.map((scenarioId) => [
      scenarioId,
      'covered_by_pilot_or_scale_up_unit',
    ]),
  ) as Record<AxiomL3EvalScenarioId, 'covered_by_pilot_or_scale_up_unit'>;
}

function buildPilotIntakeUnits(): AxiomRealDataScaleUpIntakeUnit[] {
  return [
    {
      unitId: 'intake_pilot_cr01_health_time_life_security',
      status: 'pilot_vertical_run_passed',
      sourceFamily: 'cr01_health_time_life_security',
      inputLayer: 'references_derived_summary',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.md',
      ],
      targetScenarioIds: ['l3_health_time_accommodation_lookup_trap_v0'],
      requiredSourceLenses: ['respondent_data', 'external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: ['axiom_real_derived_evidence_packet_cr01_health_time_v0_2026_06_08'],
      packetizationRule:
        'Use derived CR01 health-time/life-security context readings as respondent-lens evidence spans; do not open raw or redacted source text.',
      groundingRule:
        'Ground observation, inference, missing context, actionability, and review route to CR01, L3, FT03, and audit spans.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Health-time traces may be fragmentary. Use them to preserve contact-point hypotheses, missing life/work timing context, and counter-readings without converting them into accommodation validity.',
      ),
      holdIf: [
        'raw_or_redacted_text_required_to_interpret_packet',
        'health_time_is_treated_as_condition_to_accommodation_lookup',
        'source_or_support_validity_is_needed_before_kernel_build',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_pilot_jeed_policy_service_coordination',
      status: 'pilot_vertical_run_passed',
      sourceFamily: 'jeed_web_cache_deep_reading',
      inputLayer: 'references_derived_jsonl_card',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
      ],
      targetScenarioIds: ['l3_policy_service_coordination_source_lens_v0'],
      requiredSourceLenses: ['external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [
        'axiom_real_derived_evidence_packet_jeed_policy_service_coordination_v0_2026_06_08',
      ],
      packetizationRule:
        'Use Stage 1 JEED deep-reading cards as external-evidence source-lens packets; regional coordination remains a translation hypothesis, not policy or support validity.',
      groundingRule:
        'Ground service-design hypotheses to JEED derived cards, L3 source-lens checks, FT03 separation, and audit boundaries.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Policy/service traces may be partial or currentness-limited. Use them as external-evidence lens signals and source-status limits, not as proof of coordination quality or current public guidance.',
      ),
      holdIf: [
        'live_policy_currentness_claim_is_needed',
        'coordination_presence_is_treated_as_coordination_quality',
        'public_guidance_or_policy_recommendation_is_requested',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_pilot_jeed_disclosure_work_procedure',
      status: 'pilot_vertical_run_passed',
      sourceFamily: 'jeed_web_cache_deep_reading',
      inputLayer: 'references_derived_jsonl_card',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
      ],
      targetScenarioIds: ['l3_disclosure_information_procedure_boundary_v0'],
      requiredSourceLenses: ['external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [
        'axiom_real_derived_evidence_packet_jeed_disclosure_procedure_v0_2026_06_08',
      ],
      packetizationRule:
        'Use JEED disclosure/work-procedure deep-reading cards as external evidence for consent boundary, task procedure, safety, confirmation, and evaluation questions.',
      groundingRule:
        'Ground disclosure hypotheses to JEED derived cards, L3 disclosure/PII checks, FT03 consent-boundary separation, and audit boundaries.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Disclosure/procedure traces may omit the person-specific consent and task context. Preserve that incompleteness as missing context, counter-hypothesis, and cannot-yet-say boundary.',
      ),
      holdIf: [
        'disclosure_volume_answer_is_requested',
        'individual_disclosure_or_pii_handling_decision_is_needed',
        'legal_finality_or_public_advice_is_needed',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_pilot_ftcodex03_supporter_workplace_quality',
      status: 'pilot_vertical_run_passed',
      sourceFamily: 'ftcodex03_supporter_workplace',
      inputLayer: 'references_derived_summary',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
      ],
      targetScenarioIds: ['l3_post_hiring_quality_evaluation_loop_v0'],
      requiredSourceLenses: ['supporter_data', 'external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [
        'axiom_real_derived_evidence_packet_ftcodex03_supporter_workplace_quality_v0_2026_06_08',
      ],
      packetizationRule:
        'Use FT-Codex-03 supporter/workplace summaries as supporter-lens evidence for post-hiring quality, role, evaluation, growth, and future-redesign questions.',
      groundingRule:
        'Ground quality/evaluation hypotheses to supporter/workplace summary spans, network reconnection, L3 post-hiring checks, FT03 response discipline, and audit boundaries.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Supporter/workplace traces may reflect role position, aspiration, or local visibility. Use them as source-lens evidence for quality questions while preserving support-validity uncertainty.',
      ),
      holdIf: [
        'employment_count_or_retention_is_treated_as_success_proof',
        'support_presence_is_treated_as_support_validity',
        'learning_update_or_public_success_language_is_requested',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_pilot_public_condition_window_non_lookup',
      status: 'pilot_vertical_run_passed',
      sourceFamily: 'ftcodex03_supporter_workplace',
      inputLayer: 'references_derived_summary',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
      ],
      targetScenarioIds: ['l3_public_condition_window_non_lookup_v0'],
      requiredSourceLenses: ['external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [
        'axiom_real_derived_evidence_packet_public_condition_window_non_lookup_v0_2026_06_08',
      ],
      packetizationRule:
        'Use FT-Codex-03 condition-window guardrail as external-evidence input for public-condition kernels; category terms are condition windows, not lookup answers.',
      groundingRule:
        'Ground public-condition hypotheses to condition-window spans, L3 public-boundary checks, FT03 public-use separation, and audit boundaries.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Condition-window traces may be categorical and thin. Use them to generate non-lookup questions and public-boundary limits, not condition-to-support answers.',
      ),
      holdIf: [
        'public_copy_is_requested_before_public_review',
        'condition_category_is_treated_as_support_menu',
        'medical_legal_employment_or_accommodation_finality_is_needed',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_scale_up_stage1_remaining_context_readings',
      status: 'ready_for_scale_up_kernel_build',
      sourceFamily: 'cr01_health_time_life_security',
      inputLayer: 'references_derived_summary',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.md',
      ],
      targetScenarioIds: [
        'l3_post_hiring_quality_evaluation_loop_v0',
        'l3_public_condition_window_non_lookup_v0',
        'l3_disclosure_information_procedure_boundary_v0',
      ],
      requiredSourceLenses: ['respondent_data', 'external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [],
      packetizationRule:
        'Split remaining derived context readings into packets by dominant L3 scenario and source lens; each packet must carry explicit missing-context and counter-hypothesis fields.',
      groundingRule:
        'Each packet must preserve source span IDs, L3 PIP/CCA IDs, FT03 boundaries, and a no-promotion movement boundary.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Remaining context readings may be uneven across CR02-CR05. Split them by lens/scenario so weak areas remain explicit missing context or hold reasons instead of being averaged away.',
      ),
      holdIf: [
        'derived_summary_is_too_thin_to_ground_observation',
        'raw_or_redacted_text_is_required_to_resolve_interpretation',
        'packet_would_duplicate_existing_pilot_without_new_lens_or_scenario_value',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_scale_up_stage1_web_cache_deep_reading_batches',
      status: 'ready_for_scale_up_kernel_build',
      sourceFamily: 'jeed_web_cache_deep_reading',
      inputLayer: 'references_derived_jsonl_card',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md',
      ],
      targetScenarioIds: [
        'l3_policy_service_coordination_source_lens_v0',
        'l3_disclosure_information_procedure_boundary_v0',
        'l3_public_condition_window_non_lookup_v0',
      ],
      requiredSourceLenses: ['external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [],
      packetizationRule:
        'Group web-cache deep-reading cards by motif/scenario pair, not by URL count; duplicate or title-level-only cards remain hold inputs.',
      groundingRule:
        'Each accepted card packet must preserve unreviewed/currentness/source-lens boundaries and avoid public/current policy claims.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Web-cache cards may be partial, duplicated, stale, or title-level. Accept only the structural trace they can support, and convert thinness/currentness limits into source-lens status or hold.',
      ),
      holdIf: [
        'card_requires_live_currentness_verification_before_kernel_build',
        'source_family_role_is_only_title_level_or_too_thin',
        'packet_would_become_public_guidance_or_good_practice_generalization',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
    {
      unitId: 'intake_scale_up_ftcodex03_supporter_workplace_nivr_workshop',
      status: 'ready_for_scale_up_kernel_build',
      sourceFamily: 'ftcodex03_supporter_workplace',
      inputLayer: 'references_derived_summary',
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
      ],
      targetScenarioIds: [
        'l3_post_hiring_quality_evaluation_loop_v0',
        'l3_policy_service_coordination_source_lens_v0',
        'l3_health_time_accommodation_lookup_trap_v0',
      ],
      requiredSourceLenses: ['supporter_data', 'external_evidence', 'implementation_actor_conditions'],
      expectedPacketIds: [],
      packetizationRule:
        'Create separate packets for supporter, workplace, NIVR, and workshop lenses when they add distinct source-lens value; do not merge them into success evidence.',
      groundingRule:
        'Each packet must show support continuity, workplace contact, life-security, or quality-participation grounding without support validity or policy currentness.',
      acceptanceCriteria: baseAcceptanceCriteria(),
      dataImperfectionHandling: dataImperfectionHandling(
        'Supporter, workplace, NIVR, and workshop traces are different partial lenses. Keep lens-specific incompleteness visible instead of merging them into success evidence.',
      ),
      holdIf: [
        'source_family_bridge_would_require_current_policy_or_legal_claim',
        'supporter_good_intent_or_workplace_success_is_treated_as_evidence',
        'review_unit_budget_would_exceed_100_without_new_compression_rule',
      ],
      noRawOrPromotionBoundary: intakeBoundary(),
    },
  ];
}

export function buildAxiomRealDataScaleUpIntakeManifest(
  pilotBatchRun: AxiomRealDerivedKernelBuildBatchRun = runAxiomRealDerivedEvidenceKernelBuildBatch(),
): AxiomRealDataScaleUpIntakeManifest {
  const intakeUnits = buildPilotIntakeUnits();
  const reviewPromotionPacket = buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch(
    pilotBatchRun,
  );
  const compression = pilotBatchRun.reviewUnitCompression;
  const pilotScenarioIds = new Set(pilotBatchRun.runs.map((run) => run.evidencePacket.scenarioId));

  return {
    manifestId: 'axiom_real_data_scale_up_intake_manifest_v0_2026_06_08',
    objectType: 'axiom_real_data_scale_up_intake_manifest',
    contractVersion: AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_VERSION,
    lane: 'Falcon Lab',
    status: 'scale_up_manifest_ready_for_next_kernel_integration_run',
    boundary: AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES],
    prerequisitePilotBatchRunId: pilotBatchRun.runId,
    prerequisitePilotBatchStatus: pilotBatchRun.status,
    prerequisiteScenarioCoverage: AXIOM_L3_EVAL_SCENARIO_IDS.filter((scenarioId) =>
      pilotScenarioIds.has(scenarioId),
    ),
    prerequisitePacketIds: pilotBatchRun.runs.map((run) => run.evidencePacket.packetId),
    intakeUnits,
    sourceLensCoverage: buildSourceLensCoverage(intakeUnits),
    scenarioCoverage: buildScenarioCoverage(intakeUnits),
    dataImperfectionPolicy: buildDataImperfectionPolicy(),
    humanReviewCompressionPolicy: {
      reviewScale: 'compressed_framework_units_not_individual_hypotheses',
      maxCoreHumanReviewUnits: 100,
      currentCompressedReviewUnitCount: compression.estimatedCoreReviewUnits,
      compressionSource: 'real_derived_batch_review_unit_compression',
      appliesToHypothesisSet:
        'all_hypotheses_in_accepted_packets_are_reviewed_via_compressed_framework_units',
      blocks: reviewPromotionPacket.promotionUnits[0]?.blocks ?? [],
      doesNotBlock: reviewPromotionPacket.provisionalWorkAllowed,
      reviewerInterpretation:
        'Human review is applied to compressed framework units. Accepted packet hypotheses inherit that review status only through their mapped unit and do not become source/support validity, public approval, runtime approval, or learning updates by default.',
    },
    reviewPromotionPacket,
    notNow: [
      'no_raw_original_or_redacted_text_ingestion',
      'no_source_text_or_field_value_export',
      'no_database_schema_or_runtime_change',
      'no_prompt_retrieval_model_provider_change',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_public_approval_or_publication',
      'no_learning_update',
      ...reviewPromotionPacket.notNow,
    ],
  };
}

export function validateAxiomRealDataScaleUpIntakeManifest(
  manifest: AxiomRealDataScaleUpIntakeManifest,
  pilotBatchRun: AxiomRealDerivedKernelBuildBatchRun,
): AxiomRealDataScaleUpIntakeManifestValidation {
  const errors: string[] = [];
  const reviewPromotionValidation = validateAxiomKernelReviewPromotionPacket(
    manifest.reviewPromotionPacket,
    pilotBatchRun,
  );
  const allPacketIds = new Set([
    ...manifest.prerequisitePacketIds,
    ...manifest.intakeUnits.flatMap((unit) => unit.expectedPacketIds),
  ]);
  const allScenarioIds = new Set([
    ...manifest.prerequisiteScenarioCoverage,
    ...manifest.intakeUnits.flatMap((unit) => unit.targetScenarioIds),
  ]);
  const coveredLenses = new Set(manifest.intakeUnits.flatMap((unit) => unit.requiredSourceLenses));
  const unitIds = new Set<string>();

  pushIf(
    manifest.objectType !== 'axiom_real_data_scale_up_intake_manifest',
    errors,
    'object_type_must_be_axiom_real_data_scale_up_intake_manifest',
  );
  pushIf(
    manifest.contractVersion !== AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_VERSION,
    errors,
    'contract_version_must_match_scale_up_intake_manifest_v0_2026_06_08',
  );
  pushIf(manifest.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    manifest.status !== 'scale_up_manifest_ready_for_next_kernel_integration_run',
    errors,
    'status_must_remain_ready_for_next_kernel_integration_run',
  );
  pushIf(
    manifest.boundary !== AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY,
    errors,
    'boundary_must_remain_manifest_not_raw_ingestion_or_promotion',
  );
  pushIf(
    missingValues(manifest.strengthensCore, AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES)
      .length > 0,
    errors,
    'manifest_must_strengthen_kernel_build_grounding_eval_and_review_loop',
  );
  pushIf(
    pilotBatchRun.status !== 'passed_real_derived_non_sensitive_kernel_build_batch' ||
      manifest.prerequisitePilotBatchStatus !== pilotBatchRun.status,
    errors,
    'pilot_batch_must_pass_before_scale_up_manifest',
  );
  pushIf(
    manifest.prerequisitePilotBatchRunId !== pilotBatchRun.runId,
    errors,
    'pilot_batch_run_id_mismatch',
  );
  pushIf(
    missingValues(manifest.prerequisiteScenarioCoverage, AXIOM_L3_EVAL_SCENARIO_IDS).length > 0,
    errors,
    'pilot_batch_must_cover_all_l3_scenarios_before_scale_up',
  );
  pushIf(manifest.intakeUnits.length === 0, errors, 'intake_units_required');
  pushIf(
    manifest.dataImperfectionPolicy.admissionStance !==
      'incomplete_partial_or_biased_data_is_admissible_as_reality_shadow_not_as_validity',
    errors,
    'data_imperfection_policy_must_admit_incomplete_data_as_reality_shadow',
  );
  pushIf(
    manifest.dataImperfectionPolicy.gateType !== 'overclaim_gate_not_perfection_gate' ||
      manifest.dataImperfectionPolicy.perfectionRequirement !==
        'not_required_for_kernel_build_or_grounding' ||
      manifest.dataImperfectionPolicy.minimumRequirement !==
        'must_be_convertible_to_grounded_kernel_field_or_explicit_hold',
    errors,
    'data_imperfection_policy_must_be_overclaim_gate_not_perfection_gate',
  );
  pushIf(
    missingValues(
      manifest.dataImperfectionPolicy.requiredConversionTargets,
      AXIOM_IMPERFECTION_CONVERSION_TARGETS,
    ).length > 0,
    errors,
    'data_imperfection_policy_must_cover_all_kernel_conversion_targets',
  );
  pushIf(
    !manifest.dataImperfectionPolicy.prohibitedInterpretation.includes(
      'do_not_exclude_partial_or_biased_data_merely_because_it_is_incomplete',
    ) ||
      !manifest.dataImperfectionPolicy.prohibitedInterpretation.includes(
        'do_not_treat_incomplete_data_as_final_fact_support_validity_or_public_guidance',
      ),
    errors,
    'data_imperfection_policy_must_block_exclusion_and_overclaiming',
  );

  for (const unit of manifest.intakeUnits) {
    pushIf(unitIds.has(unit.unitId), errors, `duplicate_intake_unit_id:${unit.unitId}`);
    unitIds.add(unit.unitId);
    pushIf(unit.sourceUris.length === 0, errors, `source_uris_required:${unit.unitId}`);
    pushIf(
      unit.targetScenarioIds.length === 0,
      errors,
      `target_scenario_ids_required:${unit.unitId}`,
    );
    pushIf(
      unit.requiredSourceLenses.length === 0,
      errors,
      `required_source_lenses_required:${unit.unitId}`,
    );
    pushIf(
      unit.packetizationRule.trim().length === 0 || unit.groundingRule.trim().length === 0,
      errors,
      `packetization_and_grounding_rules_required:${unit.unitId}`,
    );
    pushIf(
      unit.dataImperfectionHandling.incompleteDataAdmissible !== true ||
        unit.dataImperfectionHandling.admissionBasis !==
          'usable_as_reality_shadow_when_non_sensitive_traceable_and_not_overclaimed',
      errors,
      `unit_must_admit_incomplete_data_as_reality_shadow:${unit.unitId}`,
    );
    pushIf(
      unit.dataImperfectionHandling.interpretationRule.trim().length === 0,
      errors,
      `unit_imperfection_interpretation_rule_required:${unit.unitId}`,
    );
    pushIf(
      missingValues(
        unit.dataImperfectionHandling.conversionTargets,
        AXIOM_IMPERFECTION_CONVERSION_TARGETS,
      ).length > 0,
      errors,
      `unit_imperfection_conversion_targets_required:${unit.unitId}`,
    );
    pushIf(
      !unit.dataImperfectionHandling.rejectOnlyWhen.includes(
        'incompleteness_would_be_hidden_as_source_support_validity_or_public_truth',
      ),
      errors,
      `unit_imperfection_must_reject_hidden_overclaiming:${unit.unitId}`,
    );

    const missingAcceptance = missingValues(
      unit.acceptanceCriteria,
      REQUIRED_ACCEPTANCE_CRITERIA,
    );
    pushIf(
      missingAcceptance.length > 0,
      errors,
      `acceptance_criteria_missing:${unit.unitId}:${missingAcceptance.join(',')}`,
    );
    pushIf(
      unit.noRawOrPromotionBoundary.rawOriginalOpened !== false ||
        unit.noRawOrPromotionBoundary.redactedTextExported !== false ||
        unit.noRawOrPromotionBoundary.sourceTextExported !== false ||
        unit.noRawOrPromotionBoundary.fieldValueExported !== false,
      errors,
      `unit_must_not_open_or_export_raw_redacted_source_or_field_values:${unit.unitId}`,
    );
    pushIf(
      unit.noRawOrPromotionBoundary.sourceSupportValidityDecision !== 'not_decided' ||
        unit.noRawOrPromotionBoundary.candidatePattern !== 'not_candidate_pattern' ||
        unit.noRawOrPromotionBoundary.runtimeApproved !== 'not_approved' ||
        unit.noRawOrPromotionBoundary.publicApproved !== 'not_approved' ||
        unit.noRawOrPromotionBoundary.learningUpdate !== 'not_promoted',
      errors,
      `unit_must_not_move_validity_approval_candidate_or_learning:${unit.unitId}`,
    );
  }

  for (const lens of AXIOM_SOURCE_LENSES) {
    pushIf(!coveredLenses.has(lens), errors, `source_lens_missing_from_intake:${lens}`);
    pushIf(
      manifest.sourceLensCoverage[lens] !== 'covered_by_ready_or_pilot_unit',
      errors,
      `source_lens_coverage_status_invalid:${lens}`,
    );
  }

  for (const scenarioId of AXIOM_L3_EVAL_SCENARIO_IDS) {
    pushIf(!allScenarioIds.has(scenarioId), errors, `scenario_missing_from_intake:${scenarioId}`);
    pushIf(
      manifest.scenarioCoverage[scenarioId] !== 'covered_by_pilot_or_scale_up_unit',
      errors,
      `scenario_coverage_status_invalid:${scenarioId}`,
    );
  }

  for (const packet of buildAllAxiomRealDerivedEvidencePacketFixtures()) {
    pushIf(!allPacketIds.has(packet.packetId), errors, `pilot_packet_missing:${packet.packetId}`);
  }

  pushIf(!reviewPromotionValidation.valid, errors, 'review_promotion_packet_must_validate');
  pushIf(
    manifest.reviewPromotionPacket.boundary !== AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY ||
      manifest.reviewPromotionPacket.sourceRealDerivedBoundary !==
        AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_BOUNDARY ||
      manifest.reviewPromotionPacket.sourceBuildGroundingBoundary !==
        AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    errors,
    'manifest_must_preserve_real_derived_build_grounding_and_review_promotion_boundaries',
  );
  pushIf(
    manifest.humanReviewCompressionPolicy.reviewScale !==
      'compressed_framework_units_not_individual_hypotheses',
    errors,
    'human_review_scale_must_be_compressed_framework_units',
  );
  pushIf(
    manifest.humanReviewCompressionPolicy.maxCoreHumanReviewUnits !== 100 ||
      manifest.humanReviewCompressionPolicy.currentCompressedReviewUnitCount > 100,
    errors,
    'human_review_units_must_remain_under_100',
  );
  pushIf(
    manifest.humanReviewCompressionPolicy.appliesToHypothesisSet !==
      'all_hypotheses_in_accepted_packets_are_reviewed_via_compressed_framework_units',
    errors,
    'human_review_policy_must_apply_to_all_accepted_packet_hypotheses_via_compression',
  );
  pushIf(
    !manifest.notNow.includes('no_raw_original_or_redacted_text_ingestion') ||
      !manifest.notNow.includes('no_source_or_support_validity_decision') ||
      !manifest.notNow.includes('no_public_approval_or_publication') ||
      !manifest.notNow.includes('no_learning_update'),
    errors,
    'manifest_not_now_must_preserve_no_raw_validity_publication_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'scale_up_intake_manifest_valid'
        : 'scale_up_intake_manifest_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES],
  };
}
