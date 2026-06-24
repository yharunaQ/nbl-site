import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  type AxiomActionabilityBand,
  type AxiomBootstrapLabel,
  type AxiomImplementationActorCondition,
  type AxiomInteractionHypothesisKernel,
  type AxiomMissingContext,
  type AxiomMissingContextSlot,
  type AxiomMovementBoundary,
  type AxiomObservation,
  type AxiomSourceLens,
  type AxiomSourceLensStatusValue,
} from './interactionHypothesisKernelContract';
import {
  type AxiomEvidenceFoundationKind,
  type AxiomEvidenceFoundationRef,
  type AxiomEvidenceLayer,
  type AxiomEvidenceSpanRef,
  type AxiomInheritedFrameEvalRoute,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  evaluateAxiomInteractionHypothesisKernelAgainstScenario,
  type AxiomInteractionHypothesisKernelEvalReport,
  type AxiomKernelEvalScenario,
} from './interactionHypothesisKernelEvaluator';
import {
  buildAllAxiomRealDerivedEvidencePacketFixtures,
  runAxiomRealDerivedEvidenceKernelBuildBatch,
  type AxiomRealDerivedCounterHypothesis,
  type AxiomRealDerivedEvidencePacket,
  type AxiomRealDerivedInferenceCandidate,
  type AxiomRealDerivedKernelBuildBatchRun,
} from './interactionHypothesisKernelRealDerivedEvidenceProtocol';
import {
  buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch,
  validateAxiomKernelReviewPromotionPacket,
  type AxiomKernelReviewPromotionPacket,
} from './interactionHypothesisKernelReviewPromotionPacket';
import {
  AXIOM_L3_EVAL_SCENARIO_IDS,
  type AxiomL3EvalScenarioId,
} from './interactionHypothesisKernelScenarioFixtures';
import {
  AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES,
  buildAxiomRealDataScaleUpIntakeManifest,
  validateAxiomRealDataScaleUpIntakeManifest,
  type AxiomRealDataScaleUpDataImperfectionPolicy,
  type AxiomRealDataScaleUpIntakeManifest,
  type AxiomRealDataScaleUpSourceFamily,
} from './realDataScaleUpIntakeManifest';

export const AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY =
  'axiom_real_data_scale_up_integration_run_builds_grounded_kernel_from_manifest_packets_not_runtime_public_or_learning' as const;

export type AxiomRealDataScaleUpPacketMapping = {
  sourceIntakeUnitId: string;
  sourceFamily: AxiomRealDataScaleUpSourceFamily;
  evidencePacketId: string;
  scenarioId: AxiomL3EvalScenarioId;
  status: 'accepted_for_scale_up_integration_run';
};

export type AxiomRealDataScaleUpIntegrationRun = {
  runId: string;
  objectType: 'axiom_real_data_scale_up_integration_run';
  contractVersion: typeof AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_VERSION;
  lane: 'Falcon Lab';
  status: 'passed_real_data_scale_up_integration_run' | 'failed_real_data_scale_up_integration_run';
  boundary: typeof AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES;
  manifest: AxiomRealDataScaleUpIntakeManifest;
  pilotBatchRun: AxiomRealDerivedKernelBuildBatchRun;
  intakeUnitIdsExecuted: string[];
  scaleUpPacketMappings: AxiomRealDataScaleUpPacketMapping[];
  pilotPacketCount: number;
  scaleUpPacketCount: number;
  integratedPacketCount: number;
  integratedScenarioCount: number;
  scaleUpEvidencePackets: AxiomRealDerivedEvidencePacket[];
  integratedBatchRun: AxiomRealDerivedKernelBuildBatchRun;
  evalReports: AxiomInteractionHypothesisKernelEvalReport[];
  reviewPromotionPacket: AxiomKernelReviewPromotionPacket;
  dataImperfectionPolicy: AxiomRealDataScaleUpDataImperfectionPolicy;
  hypothesisReviewCoverage: {
    reviewScale: 'compressed_framework_units_not_individual_hypotheses';
    appliesTo: 'all_pilot_and_scale_up_packet_hypotheses';
    compressedReviewUnitCount: number;
    maxCoreHumanReviewUnits: 100;
    reviewStatus:
      'routed_to_human_review_packet_promotion_not_moved';
  };
  notNow: string[];
};

export type AxiomRealDataScaleUpIntegrationRunValidation = {
  valid: boolean;
  validationStatus:
    | 'real_data_scale_up_integration_run_valid'
    | 'real_data_scale_up_integration_run_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES;
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

const L3_EVAL_SCENARIOS: Record<AxiomL3EvalScenarioId, AxiomKernelEvalScenario> = {
  l3_health_time_accommodation_lookup_trap_v0: {
    id: 'l3_health_time_accommodation_lookup_trap_v0',
    expected_principal_pattern_ids: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
    expected_cross_cutting_check_ids: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27'],
    required_interaction_reading_slots: [
      'person',
      'job',
      'environment',
      'support',
      'time',
      'institution',
    ],
    expected_actionability_bands: ['usable_provisional_insight', 'question_first_only'],
  },
  l3_disclosure_information_procedure_boundary_v0: {
    id: 'l3_disclosure_information_procedure_boundary_v0',
    expected_principal_pattern_ids: ['L3-PIP-10', 'L3-PIP-13', 'L3-PIP-17', 'L3-PIP-18'],
    expected_cross_cutting_check_ids: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-26', 'L3-CCA-27'],
    required_interaction_reading_slots: [
      'person',
      'job',
      'environment',
      'support',
      'time',
      'institution',
      'source_lens',
    ],
    expected_actionability_bands: ['usable_provisional_insight', 'question_first_only'],
  },
  l3_policy_service_coordination_source_lens_v0: {
    id: 'l3_policy_service_coordination_source_lens_v0',
    expected_principal_pattern_ids: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
    expected_cross_cutting_check_ids: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
    required_interaction_reading_slots: [
      'job',
      'environment',
      'support',
      'time',
      'institution',
      'source_lens',
    ],
    expected_actionability_bands: ['question_first_only', 'hold_or_research_needed'],
  },
  l3_public_condition_window_non_lookup_v0: {
    id: 'l3_public_condition_window_non_lookup_v0',
    expected_principal_pattern_ids: ['L3-PIP-01', 'L3-PIP-04', 'L3-PIP-10', 'L3-PIP-15', 'L3-PIP-21'],
    expected_cross_cutting_check_ids: ['L3-CCA-22', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
    required_interaction_reading_slots: [
      'person',
      'job',
      'environment',
      'support',
      'time',
      'institution',
    ],
    expected_actionability_bands: ['public_boundary_blocked', 'question_first_only'],
  },
  l3_post_hiring_quality_evaluation_loop_v0: {
    id: 'l3_post_hiring_quality_evaluation_loop_v0',
    expected_principal_pattern_ids: ['L3-PIP-06', 'L3-PIP-19', 'L3-PIP-20', 'L3-PIP-21'],
    expected_cross_cutting_check_ids: ['L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
    required_interaction_reading_slots: [
      'job',
      'environment',
      'support',
      'time',
      'institution',
      'source_lens',
    ],
    expected_actionability_bands: [
      'usable_provisional_insight',
      'question_first_only',
      'public_boundary_blocked',
    ],
  },
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function dataPolicy(note: string): AxiomRealDerivedEvidencePacket['dataPolicy'] {
  return {
    inputLayer: 'references_derived_and_docs_only',
    rawOriginalOpened: false,
    sourceTextExported: false,
    redactedTextExported: false,
    fieldValueExported: false,
    containsSensitiveRawText: false,
    sourceSupportValidityDecision: 'not_decided',
    publicUse: 'not_public_approved',
    note,
  };
}

function foundation(
  id: string,
  kind: AxiomEvidenceFoundationKind,
  uri: string,
  layer: AxiomEvidenceLayer,
  note: string,
): AxiomEvidenceFoundationRef {
  return {
    id,
    kind,
    uri,
    layer,
    status: 'available_as_bootstrap_prior_requires_axiom_eval',
    containsSensitiveRawText: false,
    allowedAsAxiomCoreTruth: false,
    requiresAxiomEval: true,
    note,
  };
}

function span(
  id: string,
  foundationRefId: string,
  lens: AxiomSourceLens,
  summary: string,
  supportsKernelFields: AxiomEvidenceSpanRef['supportsKernelFields'],
): AxiomEvidenceSpanRef {
  return {
    id,
    foundationRefId,
    lens,
    summary,
    supportsKernelFields,
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  };
}

function inheritedFrame(
  id: string,
  source: AxiomInheritedFrameEvalRoute['source'],
  allowedUse: AxiomInheritedFrameEvalRoute['allowedUse'],
  reviewerQuestion: string,
): AxiomInheritedFrameEvalRoute {
  return {
    id,
    source,
    status: 'requires_axiom_eval',
    allowedUse,
    allowedAsAxiomCoreTruth: false,
    reviewerQuestion,
  };
}

function sourceLensStatus(
  lens: AxiomSourceLens,
  status: AxiomSourceLensStatusValue,
  note: string,
): AxiomInteractionHypothesisKernel['sourceLensStatus'][AxiomSourceLens] {
  return {
    lens,
    status,
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    note,
  };
}

function observation(
  id: string,
  lens: AxiomSourceLens,
  text: string,
  evidencePointer: string,
  statusLabel: AxiomBootstrapLabel = 'shared_evidence_foundation',
): AxiomObservation {
  return {
    id,
    lens,
    text,
    evidencePointer,
    statusLabel,
  };
}

function missingContext(
  prefix: string,
  slots: AxiomMissingContextSlot[],
): AxiomMissingContext[] {
  return slots.map((slot) => ({
    id: `mc_scale_${prefix}_${slot}`,
    slot,
    question: `What ${slot} context is still needed before this scale-up packet can be used beyond provisional kernel reasoning?`,
    whyItMatters:
      'The scale-up run must preserve incomplete evidence as missing context instead of turning it into support validity or public guidance.',
  }));
}

function actorCondition(
  actor: AxiomImplementationActorCondition['actor'],
  condition: string,
  missingContextIds: string[],
): AxiomImplementationActorCondition {
  return {
    actor,
    condition,
    requiredBeforeAction: true,
    missingContextIds,
  };
}

function cannotYetSay(extra: string): string[] {
  return [
    'No medical, legal, employment, accommodation, or support validity finality is decided.',
    'No public approval, runtime approval, candidate_pattern, publication, knowledge promotion, or learning update is granted.',
    extra,
  ];
}

function scaleUpFoundationRefsForCommonL3(): AxiomEvidenceFoundationRef[] {
  return [
    foundation(
      'foundation_scale_up_l3_principal_patterns',
      'l3_principal_pattern_surface',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
      'structure',
      'L3 patterns are used as eval surface and bootstrap pattern candidates, not promoted Axiom truth.',
    ),
    foundation(
      'foundation_ft03_response_contract',
      'ft03_internal_response_contract',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft03-internal-expert-agent-response-contract-v0-2026-05-25.md',
      'reference_frame',
      'FT03 preserves observation/inference/counter-hypothesis/missing-context/cannot-yet-say discipline.',
    ),
    foundation(
      'foundation_falcon_core_weakness_audit',
      'falcon_core_weakness_audit',
      'docs/nbl-workspace/falcon-expert-agent-core-weakness-audit-and-v2-rebuild-2026-06-07.md',
      'learning_boundary',
      'The audit keeps this work centered on kernel build, grounding, eval, and review loop rather than delivery scaffolding.',
    ),
  ];
}

export function buildAxiomScaleUpStage1RemainingContextEvidencePacket(): AxiomRealDerivedEvidencePacket {
  const packetId =
    'axiom_real_data_scale_up_packet_stage1_remaining_context_readings_v0_2026_06_08';
  const sourceFoundationRefs = [
    foundation(
      'foundation_scale_up_cr02_quality_value_context',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.md',
      'evidence',
      'CR02 is a derived context reading with no raw text or field value export.',
    ),
    foundation(
      'foundation_scale_up_cr03_prework_entry_context',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.md',
      'evidence',
      'CR03 is a derived context reading used for entry/prework sequence questions, not readiness-deficit claims.',
    ),
    foundation(
      'foundation_scale_up_cr04_worksite_contact_context',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md',
      'evidence',
      'CR04 is a derived contact-point reading with no source text export.',
    ),
    foundation(
      'foundation_scale_up_cr05_residual_hold_context',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.md',
      'evidence',
      'CR05 is the deliberate residual brake layer for overclaim control.',
    ),
    ...scaleUpFoundationRefsForCommonL3(),
  ];
  const evidenceSpans = [
    span(
      'span_scale_cr02_quality_value_translation',
      'foundation_scale_up_cr02_quality_value_context',
      'respondent_data',
      'CR02 records quality/value participation as conditional performance, role or work value, future outlook, and support retranslation; it warns against satisfaction-only or work-status coverage.',
      ['observation', 'inference', 'actionabilityBand', 'sourceLensStatus'],
    ),
    span(
      'span_scale_cr03_prework_entry_sequence',
      'foundation_scale_up_cr03_prework_entry_context',
      'respondent_data',
      'CR03 frames prework/entry as training, life rhythm, stamina, support bridge, self outlook, and entry action sequence rather than preparedness deficit.',
      ['observation', 'missingContext', 'counterHypothesis', 'sourceLensStatus'],
    ),
    span(
      'span_scale_cr04_worksite_contact_decomposition',
      'foundation_scale_up_cr04_worksite_contact_context',
      'respondent_data',
      'CR04 decomposes worksite contact into support retranslation, task/workflow, access/rest/safety, information contact, mobility, evaluation value, and energy/posture.',
      ['observation', 'inference', 'implementationActorConditions'],
    ),
    span(
      'span_scale_cr05_residual_hold_brake',
      'foundation_scale_up_cr05_residual_hold_context',
      'respondent_data',
      'CR05 is a residual hold and counterexample layer that prevents health condition, impairment, satisfaction, nonwork, or preparation signals from becoming single-cause support logic.',
      ['counterHypothesis', 'missingContext', 'cannotYetSay', 'sourceLensStatus'],
    ),
    span(
      'span_scale_l3_quality_participation_patterns',
      'foundation_scale_up_l3_principal_patterns',
      'external_evidence',
      'L3-PIP-06, PIP-19, PIP-20, and PIP-21 keep evaluation, role, value, future, career, and implementation difference visible beyond employment count or satisfaction.',
      ['inference', 'counterHypothesis', 'actionabilityBand', 'sourceLensStatus'],
    ),
    span(
      'span_scale_ft03_quality_review_boundary',
      'foundation_ft03_response_contract',
      'implementation_actor_conditions',
      'FT03 requires provisional insight to remain separated from final support validity, public use, and learning update.',
      ['humanReviewRoute', 'cannotYetSay', 'implementationActorConditions'],
    ),
    span(
      'span_scale_falcon_audit_stage1_remaining_core_boundary',
      'foundation_falcon_core_weakness_audit',
      'implementation_actor_conditions',
      'The Falcon weakness audit requires this packet to strengthen kernel build, grounding, eval, or review loop rather than delivery-layer scaffolding.',
      ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    ),
  ];
  const missing = missingContext('stage1_remaining', [
    'job',
    'environment',
    'support',
    'time',
    'institution',
    'source_lens',
  ]);
  const missingIds = missing.map((context) => context.id);

  return {
    packetId,
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: 'v0_2026_06_08',
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_post_hiring_quality_evaluation_loop_v0',
    dataPolicy: dataPolicy(
      'Scale-up CR02-CR05 packet uses derived context readings only; incomplete evidence is retained as missing context, counter-hypothesis, source-lens status, and hold boundary.',
    ),
    sourceFoundationRefs,
    evidenceSpans,
    inheritedFrames: [
      inheritedFrame(
        'inherited_scale_cr02_cr05_context_readings',
        'stage1_scima_fchma',
        'bootstrap_prior_only',
        'Do CR02-CR05 strengthen quality/value and residual-brake kernel reasoning without becoming source/support validity?',
      ),
      inheritedFrame(
        'inherited_scale_l3_quality_patterns',
        'l3_21_views',
        'bootstrap_prior_only',
        'Which quality-participation L3 IDs remain review units rather than promoted frames?',
      ),
    ],
    observationCandidates: [
      observation(
        'obs_scale_cr02_quality_value_translation',
        'respondent_data',
        'CR02 indicates that participation quality should be read through conditional performance, role or work value, future outlook, and support retranslation rather than satisfaction-only evidence.',
        'span_scale_cr02_quality_value_translation',
      ),
      observation(
        'obs_scale_cr04_contact_decomposition',
        'respondent_data',
        'CR04 adds worksite contact decomposition across task workflow, access/rest/safety, information contact, mobility, posture/energy, and evaluation value.',
        'span_scale_cr04_worksite_contact_decomposition',
      ),
      observation(
        'obs_scale_cr05_residual_hold_brake',
        'respondent_data',
        'CR05 functions as a brake layer that keeps residual, low-context, body/function, health-time, and support-bridge signals from being overclaimed.',
        'span_scale_cr05_residual_hold_brake',
      ),
    ],
    inferenceCandidate: {
      id: 'inf_scale_stage1_quality_value_residual_hold_kernel',
      text:
        'The scale-up reading treats post-hiring quality as a value/evaluation/contact-point translation problem with residual brakes, not as employment status, satisfaction, or support-presence proof.',
      observationIds: [
        'obs_scale_cr02_quality_value_translation',
        'obs_scale_cr04_contact_decomposition',
        'obs_scale_cr05_residual_hold_brake',
      ],
      principalPatternCandidateIds: ['L3-PIP-06', 'L3-PIP-19', 'L3-PIP-20', 'L3-PIP-21'],
      crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_scale_quality_value_satisfaction_or_status',
        text:
          'The apparent quality signal might still be satisfaction-only, work-status coverage, structured-field coverage, or a low-context residual signal rather than a closed participation-quality mechanism.',
        wouldChange: [
          'actionability would shift to hold_or_research_needed',
          'review would need route-specific countercheck before promotion',
        ],
        nextQuestionIds: missingIds,
      },
    ],
    missingContext: missing,
    implementationActorConditions: [
      actorCondition(
        'worker',
        'The worker-side role, evaluation, fatigue/time cost, future outlook, and perceived value must be visible before using the quality hypothesis.',
        missingIds.slice(0, 3),
      ),
      actorCondition(
        'employer_manager',
        'The workplace must identify which task/contact/evaluation point is actually redesignable, not merely whether support exists.',
        missingIds.slice(1, 4),
      ),
      actorCondition(
        'reviewer',
        'A reviewer must inspect whether CR05 residual brakes prevent overclaiming from CR02-CR04 signals.',
        missingIds.slice(3),
      ),
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'present_in_evidence_foundation_fixture',
        'CR02-CR05 are derived respondent/context readings with raw text and field values not exported.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'This packet does not itself establish supporter lens validity.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'L3/FT03 are eval and boundary references, not promoted truth.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are explicit but still provisional.',
      ),
    },
    actionabilityBand: 'usable_provisional_insight',
    cannotYetSay: cannotYetSay(
      'No participation-quality, evaluation, value, role, or future-growth claim is approved from CR02-CR05.',
    ),
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomScaleUpWebCacheBatch2UnderreadAxesEvidencePacket(): AxiomRealDerivedEvidencePacket {
  const sourceFoundationRefs = [
    foundation(
      'foundation_scale_up_web_cache_batch2_underread_axes',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md',
      'evidence',
      'Batch 2 deep-reading artifact summarizes official/semi-official underread axes without source text export.',
    ),
    ...scaleUpFoundationRefsForCommonL3(),
  ];
  const evidenceSpans = [
    span(
      'span_scale_web_cache_batch2_scope_underread_axes',
      'foundation_scale_up_web_cache_batch2_underread_axes',
      'external_evidence',
      'Batch 2 returns 279 official/semi-official web-cache sources to C05, C06, C07, and C08 underread axes without using them as support validity or current guidance.',
      ['observation', 'sourceLensStatus', 'missingContext'],
    ),
    span(
      'span_scale_web_cache_batch2_motif_routes',
      'foundation_scale_up_web_cache_batch2_underread_axes',
      'external_evidence',
      'Motifs WCB2-M01 through M04 connect worksite contact, life-security sequencing, quality/value/career translation, and prework-entry translation to QR route additions.',
      ['observation', 'inference', 'actionabilityBand'],
    ),
    span(
      'span_scale_web_cache_batch2_source_family_boundary',
      'foundation_scale_up_web_cache_batch2_underread_axes',
      'external_evidence',
      'Source family profiles distinguish candidate structure input, source readiness, and source family boundary; legal, policy, current, and service claims require live verification and human review.',
      ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    ),
    span(
      'span_scale_l3_policy_source_lens_patterns',
      'foundation_scale_up_l3_principal_patterns',
      'external_evidence',
      'L3-PIP-11, PIP-12, PIP-14, and PIP-21 require support continuity, consultation lines, source-lens difference, and implementation-resource differences to remain visible.',
      ['inference', 'counterHypothesis', 'sourceLensStatus'],
    ),
    span(
      'span_scale_ft03_policy_currentness_boundary',
      'foundation_ft03_response_contract',
      'implementation_actor_conditions',
      'FT03 keeps official material in evidence/readiness territory until source validity, currentness, and public use are separately reviewed.',
      ['implementationActorConditions', 'humanReviewRoute', 'cannotYetSay'],
    ),
    span(
      'span_scale_falcon_audit_web_cache_batch2_core_boundary',
      'foundation_falcon_core_weakness_audit',
      'implementation_actor_conditions',
      'The Falcon weakness audit blocks treating official-source reading, public page filling, or source-currentness shells as Axiom core progress.',
      ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    ),
  ];
  const missing = missingContext('web_cache_batch2', [
    'job',
    'environment',
    'support',
    'time',
    'institution',
    'source_lens',
  ]);
  const missingIds = missing.map((context) => context.id);

  return {
    packetId: 'axiom_real_data_scale_up_packet_web_cache_batch2_underread_axes_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: 'v0_2026_06_08',
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_policy_service_coordination_source_lens_v0',
    dataPolicy: dataPolicy(
      'Scale-up web-cache batch2 packet uses derived motif/source-family summaries only; currentness, legal, policy, service, source validity, and support validity remain undecided.',
    ),
    sourceFoundationRefs,
    evidenceSpans,
    inheritedFrames: [
      inheritedFrame(
        'inherited_scale_web_cache_batch2_underread_axes',
        'stage1_scima_fchma',
        'bootstrap_prior_only',
        'Can official/semi-official underread axes strengthen source-lens reasoning without becoming current policy guidance?',
      ),
      inheritedFrame(
        'inherited_scale_l3_policy_source_lens_prior',
        'l3_21_views',
        'bootstrap_prior_only',
        'Do source-lens and implementation-resource differences remain review units?',
      ),
    ],
    observationCandidates: [
      observation(
        'obs_scale_web_cache_batch2_underread_scope',
        'external_evidence',
        'Batch 2 identifies 279 official/semi-official sources touching underread C05/C06/C07/C08 axes while explicitly keeping source text unexported.',
        'span_scale_web_cache_batch2_scope_underread_axes',
      ),
      observation(
        'obs_scale_web_cache_batch2_motif_translation',
        'external_evidence',
        'The four motif cards translate official-source material into worksite contact, life-security sequencing, quality/value/career, and prework-entry windows.',
        'span_scale_web_cache_batch2_motif_routes',
      ),
    ],
    inferenceCandidate: {
      id: 'inf_scale_web_cache_batch2_policy_service_source_lens_kernel',
      text:
        'The scale-up reading treats official/semi-official material as source-lens and implementation-actor evidence for coordination questions, not as approved policy, service guidance, or support validity.',
      observationIds: [
        'obs_scale_web_cache_batch2_underread_scope',
        'obs_scale_web_cache_batch2_motif_translation',
      ],
      principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
      crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_scale_web_cache_batch2_current_policy_or_good_practice',
        text:
          'The apparent coordination signal might be a stale source-family boundary, a title-level card, a good-practice narrative, or a policy/currentness claim requiring live verification rather than kernel integration.',
        wouldChange: [
          'packet would remain hold_until_manifest_rule_added',
          'public or current guidance would remain blocked',
        ],
        nextQuestionIds: missingIds,
      },
    ],
    missingContext: missing,
    implementationActorConditions: [
      actorCondition(
        'public_or_institutional_actor',
        'Institutional actor roles, currentness, and service-boundary claims must be separately reviewed before any public or policy use.',
        missingIds.slice(3),
      ),
      actorCondition(
        'support_staff',
        'Support agencies can use the packet only to ask source-lens and handoff questions, not to assert service quality.',
        missingIds.slice(1, 4),
      ),
      actorCondition(
        'reviewer',
        'A reviewer must check that official-source status is not silently promoted to source validity or current guidance.',
        missingIds.slice(4),
      ),
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'No respondent narrative is introduced by this web-cache packet.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'Supporter lens is represented only as a source-family/actor question.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'Official/semi-official sources remain bootstrap evidence requiring currentness/source-validity review.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are explicit but do not approve policy or service advice.',
      ),
    },
    actionabilityBand: 'question_first_only',
    cannotYetSay: cannotYetSay(
      'No current policy, public service guidance, legal claim, or source/support validity is approved from web-cache batch2.',
    ),
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomScaleUpFtCodex03NetworkReconnectionEvidencePacket(): AxiomRealDerivedEvidencePacket {
  const sourceFoundationRefs = [
    foundation(
      'foundation_scale_up_ftcodex03_summary',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
      'evidence',
      'FT-Codex-03 summary is used as non-sensitive supporter/workplace/NIVR/workshop context reading.',
    ),
    foundation(
      'foundation_scale_up_ftcodex03_network_reconnection',
      'stage1_scima_fchma_output',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
      'structure',
      'Network reconnection maps C01-C08 pressures and boundaries without source/support validity or promotion.',
    ),
    ...scaleUpFoundationRefsForCommonL3(),
  ];
  const evidenceSpans = [
    span(
      'span_scale_ftcodex03_health_time_support_timing',
      'foundation_scale_up_ftcodex03_network_reconnection',
      'supporter_data',
      'C01 health-time is thickened by support timing, workplace consultation lines, leave-income sequences, and career redesign; condition fluctuation is not work-capacity prediction.',
      ['observation', 'inference', 'actionabilityBand'],
    ),
    span(
      'span_scale_ftcodex03_support_continuity_spine',
      'foundation_scale_up_ftcodex03_network_reconnection',
      'supporter_data',
      'C03 support continuity becomes a retranslation spine across person, workplace, medical, livelihood, and policy/practice surfaces; support presence is not continuity proof.',
      ['observation', 'counterHypothesis', 'sourceLensStatus'],
    ),
    span(
      'span_scale_ftcodex03_life_security_workplace_contact',
      'foundation_scale_up_ftcodex03_network_reconnection',
      'implementation_actor_conditions',
      'C05/C06 pressures connect workplace contact, staffing, information format, income, leave, medical cost, family support, and work-continuation choices.',
      ['missingContext', 'implementationActorConditions', 'cannotYetSay'],
    ),
    span(
      'span_scale_l3_health_time_patterns',
      'foundation_scale_up_l3_principal_patterns',
      'external_evidence',
      'L3-PIP-01, PIP-02, and PIP-06 require health fluctuation, treatment/recovery time, evaluation, income, and handoff conflicts to be translated into interaction questions.',
      ['inference', 'counterHypothesis', 'actionabilityBand', 'sourceLensStatus'],
    ),
    span(
      'span_scale_ft03_health_support_boundary',
      'foundation_ft03_response_contract',
      'implementation_actor_conditions',
      'FT03 blocks medical, legal, employment, accommodation, support-validity, public, runtime, and learning finality.',
      ['humanReviewRoute', 'cannotYetSay', 'implementationActorConditions'],
    ),
    span(
      'span_scale_falcon_audit_ftcodex03_network_core_boundary',
      'foundation_falcon_core_weakness_audit',
      'implementation_actor_conditions',
      'The Falcon weakness audit requires supporter/workplace/NIVR/workshop reconnection to remain kernel grounding work, not support validity or public success language.',
      ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    ),
  ];
  const missing = missingContext('ftcodex03_network', [
    'person',
    'job',
    'environment',
    'support',
    'time',
    'institution',
  ]);
  const missingIds = missing.map((context) => context.id);

  return {
    packetId: 'axiom_real_data_scale_up_packet_ftcodex03_network_reconnection_v0_2026_06_08',
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: 'v0_2026_06_08',
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
    dataPolicy: dataPolicy(
      'Scale-up FT-Codex-03 network packet uses supporter/workplace/NIVR/workshop derived summaries only; support presence, policy/currentness, and support validity remain unapproved.',
    ),
    sourceFoundationRefs,
    evidenceSpans,
    inheritedFrames: [
      inheritedFrame(
        'inherited_scale_ftcodex03_network_reconnection',
        'stage1_scima_fchma',
        'bootstrap_prior_only',
        'Can FT-Codex-03 reconnect health-time with support timing and workplace/life-security conditions without lookup or support-validity movement?',
      ),
      inheritedFrame(
        'inherited_scale_l3_health_time_prior',
        'l3_21_views',
        'bootstrap_prior_only',
        'Do health-time L3 IDs remain interaction patterns rather than disease-to-accommodation answers?',
      ),
    ],
    observationCandidates: [
      observation(
        'obs_scale_ftcodex03_health_time_support_timing',
        'supporter_data',
        'FT-Codex-03 network reconnection reads health-time through support timing, workplace consultation lines, leave-income sequences, and career redesign.',
        'span_scale_ftcodex03_health_time_support_timing',
      ),
      observation(
        'obs_scale_ftcodex03_support_continuity_spine',
        'supporter_data',
        'Support continuity is framed as a retranslation spine across person, workplace, medical, livelihood, and policy/practice surfaces, not as support presence.',
        'span_scale_ftcodex03_support_continuity_spine',
      ),
    ],
    inferenceCandidate: {
      id: 'inf_scale_ftcodex03_health_time_support_reconnection_kernel',
      text:
        'The scale-up reading treats health-time friction as interaction among support timing, workplace consultation, livelihood sequence, treatment/recovery, and evaluation/income, not as a condition-to-accommodation lookup.',
      observationIds: [
        'obs_scale_ftcodex03_health_time_support_timing',
        'obs_scale_ftcodex03_support_continuity_spine',
      ],
      principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
      crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_scale_ftcodex03_support_presence_not_continuity',
        text:
          'The apparent health-time support signal might be only meeting presence, referral, network naming, or supporter intention rather than an actual retranslation loop.',
        wouldChange: [
          'supporter_data would remain source-lens evidence only',
          'actionability would become question_first_only until continuity is checked',
        ],
        nextQuestionIds: missingIds,
      },
    ],
    missingContext: missing,
    implementationActorConditions: [
      actorCondition(
        'worker',
        'The worker-side treatment/recovery time, income pressure, role expectation, and return route must be visible.',
        missingIds.slice(0, 3),
      ),
      actorCondition(
        'support_staff',
        'Support staff must show the actual translation path between health, workplace, livelihood, and evaluation conditions.',
        missingIds.slice(2, 5),
      ),
      actorCondition(
        'employer_manager',
        'The workplace must expose consultation line, staffing, leave-income sequence, and evaluation contact points before action guidance.',
        missingIds.slice(1, 6),
      ),
    ],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'This packet strengthens supporter/workplace network reasoning but does not add direct respondent narrative.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'present_in_evidence_foundation_fixture',
        'Supporter/workplace/NIVR/workshop source lenses are present as derived summaries, not support-validity proof.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'bootstrap_prior_only',
        'L3 and FT03 remain bootstrap/eval references requiring Axiom review.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Workplace, support, medical/livelihood, and institutional actor conditions are explicit but provisional.',
      ),
    },
    actionabilityBand: 'usable_provisional_insight',
    cannotYetSay: cannotYetSay(
      'No disease/disability category, health-time condition, support presence, or workplace network signal is approved as accommodation or support-validity evidence.',
    ),
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

export function buildAxiomRealDataScaleUpEvidencePackets(): AxiomRealDerivedEvidencePacket[] {
  return [
    buildAxiomScaleUpStage1RemainingContextEvidencePacket(),
    buildAxiomScaleUpWebCacheBatch2UnderreadAxesEvidencePacket(),
    buildAxiomScaleUpFtCodex03NetworkReconnectionEvidencePacket(),
  ];
}

function buildScaleUpPacketMappings(
  manifest: AxiomRealDataScaleUpIntakeManifest,
  packets: AxiomRealDerivedEvidencePacket[],
): AxiomRealDataScaleUpPacketMapping[] {
  const readyUnits = new Map(
    manifest.intakeUnits
      .filter((unit) => unit.status === 'ready_for_scale_up_kernel_build')
      .map((unit) => [unit.unitId, unit]),
  );
  const mappingInputs = [
    {
      sourceIntakeUnitId: 'intake_scale_up_stage1_remaining_context_readings',
      packet: packets[0],
    },
    {
      sourceIntakeUnitId: 'intake_scale_up_stage1_web_cache_deep_reading_batches',
      packet: packets[1],
    },
    {
      sourceIntakeUnitId: 'intake_scale_up_ftcodex03_supporter_workplace_nivr_workshop',
      packet: packets[2],
    },
  ];

  return mappingInputs.map(({ sourceIntakeUnitId, packet }) => {
    const sourceUnit = readyUnits.get(sourceIntakeUnitId);

    return {
      sourceIntakeUnitId,
      sourceFamily: sourceUnit?.sourceFamily ?? 'falcon_core_weakness_audit',
      evidencePacketId: packet.packetId,
      scenarioId: packet.scenarioId,
      status: 'accepted_for_scale_up_integration_run',
    };
  });
}

function buildEvalReports(batchRun: AxiomRealDerivedKernelBuildBatchRun) {
  return batchRun.runs.map((run) =>
    evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      L3_EVAL_SCENARIOS[run.evidencePacket.scenarioId],
      '2026-06-08T00:00:00.000Z',
    ),
  );
}

export function runAxiomRealDataScaleUpIntegrationRun(
  manifest: AxiomRealDataScaleUpIntakeManifest = buildAxiomRealDataScaleUpIntakeManifest(),
): AxiomRealDataScaleUpIntegrationRun {
  const pilotBatchRun = runAxiomRealDerivedEvidenceKernelBuildBatch(
    buildAllAxiomRealDerivedEvidencePacketFixtures(),
  );
  const scaleUpEvidencePackets = buildAxiomRealDataScaleUpEvidencePackets();
  const scaleUpPacketMappings = buildScaleUpPacketMappings(manifest, scaleUpEvidencePackets);
  const integratedBatchRunBase = runAxiomRealDerivedEvidenceKernelBuildBatch([
    ...buildAllAxiomRealDerivedEvidencePacketFixtures(),
    ...scaleUpEvidencePackets,
  ]);
  const integratedBatchRun: AxiomRealDerivedKernelBuildBatchRun = {
    ...integratedBatchRunBase,
    runId: 'axiom_real_data_scale_up_integrated_kernel_build_batch_run_v0_2026_06_08',
  };
  const evalReports = buildEvalReports(integratedBatchRun);
  const reviewPromotionPacket =
    buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch(integratedBatchRun);
  const passed =
    pilotBatchRun.status === 'passed_real_derived_non_sensitive_kernel_build_batch' &&
    integratedBatchRun.status === 'passed_real_derived_non_sensitive_kernel_build_batch' &&
    evalReports.every((report) => report.status === 'passes') &&
    integratedBatchRun.reviewUnitCompression.estimatedCoreReviewUnits <= 100;

  return {
    runId: 'axiom_real_data_scale_up_integration_run_v0_2026_06_08',
    objectType: 'axiom_real_data_scale_up_integration_run',
    contractVersion: AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_VERSION,
    lane: 'Falcon Lab',
    status: passed
      ? 'passed_real_data_scale_up_integration_run'
      : 'failed_real_data_scale_up_integration_run',
    boundary: AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES],
    manifest,
    pilotBatchRun,
    intakeUnitIdsExecuted: scaleUpPacketMappings.map((mapping) => mapping.sourceIntakeUnitId),
    scaleUpPacketMappings,
    pilotPacketCount: pilotBatchRun.packetCount,
    scaleUpPacketCount: scaleUpEvidencePackets.length,
    integratedPacketCount: integratedBatchRun.packetCount,
    integratedScenarioCount: integratedBatchRun.scenarioCount,
    scaleUpEvidencePackets,
    integratedBatchRun,
    evalReports,
    reviewPromotionPacket,
    dataImperfectionPolicy: manifest.dataImperfectionPolicy,
    hypothesisReviewCoverage: {
      reviewScale: 'compressed_framework_units_not_individual_hypotheses',
      appliesTo: 'all_pilot_and_scale_up_packet_hypotheses',
      compressedReviewUnitCount:
        integratedBatchRun.reviewUnitCompression.estimatedCoreReviewUnits,
      maxCoreHumanReviewUnits: 100,
      reviewStatus: 'routed_to_human_review_packet_promotion_not_moved',
    },
    notNow: Array.from(
      new Set([
        'no_raw_original_or_redacted_text_ingestion',
        'no_source_text_or_field_value_export',
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_movement',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
        'no_review_execution_or_reviewer_assignment_by_codex',
        ...manifest.notNow,
        ...integratedBatchRun.notNow,
        ...reviewPromotionPacket.notNow,
      ]),
    ),
  };
}

export function validateAxiomRealDataScaleUpIntegrationRun(
  run: AxiomRealDataScaleUpIntegrationRun,
): AxiomRealDataScaleUpIntegrationRunValidation {
  const errors: string[] = [];
  const manifestValidation = validateAxiomRealDataScaleUpIntakeManifest(
    run.manifest,
    run.pilotBatchRun,
  );
  const reviewPromotionValidation = validateAxiomKernelReviewPromotionPacket(
    run.reviewPromotionPacket,
    run.integratedBatchRun,
  );
  const executedUnitIds = new Set(run.intakeUnitIdsExecuted);
  const readyUnitIds = new Set(
    run.manifest.intakeUnits
      .filter((unit) => unit.status === 'ready_for_scale_up_kernel_build')
      .map((unit) => unit.unitId),
  );
  const integratedPacketIds = new Set(
    run.integratedBatchRun.runs.map((buildRun) => buildRun.evidencePacket.packetId),
  );

  pushIf(
    run.objectType !== 'axiom_real_data_scale_up_integration_run',
    errors,
    'object_type_must_be_axiom_real_data_scale_up_integration_run',
  );
  pushIf(
    run.contractVersion !== AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_VERSION,
    errors,
    'contract_version_must_match_scale_up_integration_run_v0_2026_06_08',
  );
  pushIf(run.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    run.boundary !== AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY,
    errors,
    'boundary_must_remain_kernel_integration_not_runtime_public_or_learning',
  );
  pushIf(!manifestValidation.valid, errors, 'manifest_must_validate_before_scale_up_run');
  pushIf(
    run.pilotBatchRun.status !== 'passed_real_derived_non_sensitive_kernel_build_batch',
    errors,
    'pilot_batch_must_pass_before_scale_up_integration',
  );
  pushIf(
    run.integratedBatchRun.status !== 'passed_real_derived_non_sensitive_kernel_build_batch',
    errors,
    'integrated_batch_must_pass_kernel_build',
  );
  pushIf(
    run.pilotPacketCount !== run.pilotBatchRun.packetCount ||
      run.scaleUpPacketCount !== run.scaleUpEvidencePackets.length ||
      run.integratedPacketCount !== run.integratedBatchRun.packetCount ||
      run.integratedPacketCount !== run.pilotPacketCount + run.scaleUpPacketCount,
    errors,
    'packet_counts_must_match_pilot_plus_scale_up',
  );
  pushIf(
    run.integratedScenarioCount !== AXIOM_L3_EVAL_SCENARIO_IDS.length,
    errors,
    'integrated_run_must_cover_all_l3_scenarios',
  );
  pushIf(
    run.scaleUpPacketMappings.length !== run.scaleUpEvidencePackets.length,
    errors,
    'scale_up_packet_mappings_must_match_scale_up_packets',
  );

  for (const mapping of run.scaleUpPacketMappings) {
    pushIf(
      !readyUnitIds.has(mapping.sourceIntakeUnitId),
      errors,
      `scale_up_mapping_must_use_manifest_ready_unit:${mapping.sourceIntakeUnitId}`,
    );
    pushIf(
      !executedUnitIds.has(mapping.sourceIntakeUnitId),
      errors,
      `scale_up_mapping_must_be_executed:${mapping.sourceIntakeUnitId}`,
    );
    pushIf(
      !integratedPacketIds.has(mapping.evidencePacketId),
      errors,
      `scale_up_packet_missing_from_integrated_batch:${mapping.evidencePacketId}`,
    );
  }

  for (const buildRun of run.integratedBatchRun.runs) {
    pushIf(
      !buildRun.evidencePacketValidation.valid || !buildRun.validation.valid,
      errors,
      `integrated_packet_must_validate:${buildRun.evidencePacket.packetId}`,
    );
  }

  for (const report of run.evalReports) {
    pushIf(report.status !== 'passes', errors, `l3_eval_must_pass:${report.scenarioId}`);
    pushIf(
      report.runtimeChanged !== false ||
        report.promptChanged !== false ||
        report.retrievalChanged !== false ||
        report.modelProviderChanged !== false ||
        report.dbSchemaChanged !== false ||
        report.publicApprovalChanged !== false ||
        report.knowledgePromotionChanged !== false,
      errors,
      `l3_eval_must_not_move_runtime_public_or_promotion:${report.scenarioId}`,
    );
  }

  pushIf(!reviewPromotionValidation.valid, errors, 'review_promotion_packet_must_validate');
  pushIf(
    run.hypothesisReviewCoverage.reviewScale !==
      'compressed_framework_units_not_individual_hypotheses' ||
      run.hypothesisReviewCoverage.appliesTo !== 'all_pilot_and_scale_up_packet_hypotheses' ||
      run.hypothesisReviewCoverage.compressedReviewUnitCount > 100,
    errors,
    'all_hypotheses_must_route_through_compressed_review_units_under_100',
  );
  pushIf(
    run.dataImperfectionPolicy.gateType !== 'overclaim_gate_not_perfection_gate',
    errors,
    'integration_run_must_preserve_overclaim_gate_not_perfection_gate',
  );
  pushIf(
    !run.notNow.includes('no_source_or_support_validity_decision') ||
      !run.notNow.includes('no_public_approval_or_publication') ||
      !run.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !run.notNow.includes('no_learning_update'),
    errors,
    'integration_run_not_now_must_preserve_no_validity_public_runtime_or_learning',
  );
  pushIf(
    run.status !==
      (errors.length === 0
        ? 'passed_real_data_scale_up_integration_run'
        : 'failed_real_data_scale_up_integration_run'),
    errors,
    'status_must_match_validation_result',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_data_scale_up_integration_run_valid'
        : 'real_data_scale_up_integration_run_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES],
  };
}
