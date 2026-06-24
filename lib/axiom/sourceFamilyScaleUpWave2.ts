import {
  type AxiomActionabilityBand,
  type AxiomBootstrapLabel,
  type AxiomCoreProgressClass,
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
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  evaluateAxiomInteractionHypothesisKernelAgainstScenario,
  type AxiomInteractionHypothesisKernelEvalReport,
  type AxiomKernelEvalScenario,
} from './interactionHypothesisKernelEvaluator';
import {
  AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
  runAxiomRealDerivedEvidenceKernelBuildBatch,
  type AxiomRealDerivedEvidencePacket,
  type AxiomRealDerivedKernelBuildBatchRun,
} from './interactionHypothesisKernelRealDerivedEvidenceProtocol';
import {
  type AxiomL3EvalScenarioId,
} from './interactionHypothesisKernelScenarioFixtures';
import {
  buildAxiomKernelCorpusReadout,
  validateAxiomKernelCorpusReadout,
  type AxiomKernelCorpusReadout,
} from './kernelCorpusReadout';
import {
  buildAxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationGroup,
  type AxiomSourceFamilyUtilizationLedger,
} from './sourceFamilyUtilizationLedger';

export const AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY =
  'axiom_source_family_scale_up_wave2_prepares_derived_non_sensitive_packets_for_kernel_grounding_not_public_runtime_or_promotion' as const;

export const AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES = [
  'kernel_grounding',
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomSourceFamilyScaleUpWave2PacketMapping = {
  sourceFamilyEntryId: string;
  sourceFamilyGroup: AxiomSourceFamilyUtilizationGroup;
  evidencePacketId: string;
  buildGroundingPacketId: string;
  kernelId: string;
  scenarioId: AxiomL3EvalScenarioId;
  status: 'prepared_as_derived_non_sensitive_packet_attached_to_corpus';
};

export type AxiomSourceFamilyScaleUpWave2Attachment = {
  attachmentId: string;
  objectType: 'axiom_source_family_scale_up_wave2_attachment';
  contractVersion: typeof AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_VERSION;
  lane: 'Falcon Lab';
  status: 'prepared_wave2_packets_attached_to_stable_corpus';
  boundary: typeof AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY;
  strengthensCore: typeof AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES;
  baseReadoutId: string;
  sourceLedgerId: string;
  basePacketCount: number;
  wave2PacketCount: number;
  projectedCorpusPacketCount: number;
  wave2BatchRun: AxiomRealDerivedKernelBuildBatchRun;
  evalReports: AxiomInteractionHypothesisKernelEvalReport[];
  packetMappings: AxiomSourceFamilyScaleUpWave2PacketMapping[];
  reviewUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  nextStepAfterWave2: 'integrate_wave2_into_kernel_corpus_readout_after_validation';
  notNow: string[];
};

export type AxiomSourceFamilyScaleUpWave2AttachmentValidation = {
  valid: boolean;
  validationStatus:
    | 'source_family_scale_up_wave2_attachment_valid'
    | 'source_family_scale_up_wave2_attachment_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY;
  strengthensCore: typeof AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES;
};

type Wave2Seed = {
  entryId: string;
  packetId: string;
  scenarioId: AxiomL3EvalScenarioId;
  actionabilityBand: AxiomActionabilityBand;
  sourceFoundations: Array<{
    id: string;
    kind: AxiomEvidenceFoundationKind;
    uri: string;
    layer: AxiomEvidenceLayer;
    note: string;
  }>;
  spans: Array<{
    id: string;
    foundationRefId: string;
    lens: AxiomSourceLens;
    summary: string;
    supportsKernelFields: AxiomEvidenceSpanRef['supportsKernelFields'];
  }>;
  observations: Array<{
    id: string;
    lens: AxiomSourceLens;
    text: string;
    evidencePointer: string;
    statusLabel?: AxiomBootstrapLabel;
  }>;
  inference: {
    id: string;
    text: string;
    principalPatternCandidateIds: string[];
    crossCuttingCheckIds: string[];
  };
  counter: {
    id: string;
    text: string;
    wouldChange: string[];
  };
  missingSlots: AxiomMissingContextSlot[];
  actorConditions: Array<{
    actor: AxiomImplementationActorCondition['actor'];
    condition: string;
  }>;
  sourceLensNotes: Record<AxiomSourceLens, {
    status: AxiomSourceLensStatusValue;
    note: string;
  }>;
  cannotYetSayExtra: string;
  dataPolicyNote: string;
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
    required_interaction_reading_slots: ['person', 'job', 'environment', 'support', 'time', 'institution'],
    expected_actionability_bands: ['usable_provisional_insight', 'question_first_only'],
  },
  l3_disclosure_information_procedure_boundary_v0: {
    id: 'l3_disclosure_information_procedure_boundary_v0',
    expected_principal_pattern_ids: ['L3-PIP-10', 'L3-PIP-13', 'L3-PIP-17', 'L3-PIP-18'],
    expected_cross_cutting_check_ids: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-26', 'L3-CCA-27'],
    required_interaction_reading_slots: ['person', 'job', 'environment', 'support', 'time', 'institution', 'source_lens'],
    expected_actionability_bands: ['usable_provisional_insight', 'question_first_only'],
  },
  l3_policy_service_coordination_source_lens_v0: {
    id: 'l3_policy_service_coordination_source_lens_v0',
    expected_principal_pattern_ids: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
    expected_cross_cutting_check_ids: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
    required_interaction_reading_slots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
    expected_actionability_bands: ['question_first_only', 'hold_or_research_needed'],
  },
  l3_public_condition_window_non_lookup_v0: {
    id: 'l3_public_condition_window_non_lookup_v0',
    expected_principal_pattern_ids: ['L3-PIP-01', 'L3-PIP-04', 'L3-PIP-10', 'L3-PIP-15', 'L3-PIP-21'],
    expected_cross_cutting_check_ids: ['L3-CCA-22', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
    required_interaction_reading_slots: ['person', 'job', 'environment', 'support', 'time', 'institution'],
    expected_actionability_bands: ['public_boundary_blocked', 'question_first_only'],
  },
  l3_post_hiring_quality_evaluation_loop_v0: {
    id: 'l3_post_hiring_quality_evaluation_loop_v0',
    expected_principal_pattern_ids: ['L3-PIP-06', 'L3-PIP-19', 'L3-PIP-20', 'L3-PIP-21'],
    expected_cross_cutting_check_ids: ['L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
    required_interaction_reading_slots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
    expected_actionability_bands: ['usable_provisional_insight', 'question_first_only', 'public_boundary_blocked'],
  },
};

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

function span(input: Wave2Seed['spans'][number]): AxiomEvidenceSpanRef {
  return {
    ...input,
    sourceValidity: 'not_decided',
    supportValidity: 'not_decided',
    publicUse: 'not_public_approved',
    promotionStatus: 'not_promoted',
    containsSensitiveRawText: false,
  };
}

function observation(input: Wave2Seed['observations'][number]): AxiomObservation {
  return {
    ...input,
    statusLabel: input.statusLabel ?? 'shared_evidence_foundation',
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

function missingContext(packetId: string, slots: AxiomMissingContextSlot[]): AxiomMissingContext[] {
  return slots.map((slot) => ({
    id: `mc_wave2_${packetId}_${slot}`,
    slot,
    question: `What ${slot} context must be checked before this wave2 source-family packet can move beyond provisional kernel grounding?`,
    whyItMatters:
      'Wave2 keeps imperfect evidence useful as structure-reading input while blocking source/support validity, public guidance, runtime, and learning movement.',
  }));
}

function cannotYetSay(extra: string): string[] {
  return [
    'No medical, legal, employment, accommodation, or support validity finality is decided.',
    'No public approval, runtime approval, candidate_pattern, publication, knowledge promotion, or learning update is granted.',
    extra,
  ];
}

function commonFoundations(): AxiomEvidenceFoundationRef[] {
  return [
    foundation(
      'foundation_wave2_l3_principal_patterns',
      'l3_principal_pattern_surface',
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
      'structure',
      'L3 IDs are used as scenario/eval priors and review-unit candidates, not promoted Axiom doctrine.',
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
      'This keeps the wave centered on kernel build, grounding, eval, display, and review loop.',
    ),
  ];
}

function commonSpans(
  packetKey: string,
  patternSummary: string,
  mappingSummary: string,
): AxiomEvidenceSpanRef[] {
  return [
    span({
      id: `span_wave2_${packetKey}_l3_actionability_prior`,
      foundationRefId: 'foundation_wave2_l3_principal_patterns',
      lens: 'external_evidence',
      summary: patternSummary,
      supportsKernelFields: ['inference', 'actionabilityBand', 'sourceLensStatus'],
    }),
    span({
      id: `span_wave2_${packetKey}_l3_counter_mapping`,
      foundationRefId: 'foundation_wave2_l3_principal_patterns',
      lens: 'external_evidence',
      summary: mappingSummary,
      supportsKernelFields: ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
    }),
    span({
      id: `span_wave2_${packetKey}_ft03_boundary`,
      foundationRefId: 'foundation_ft03_response_contract',
      lens: 'implementation_actor_conditions',
      summary:
        'FT03 blocks source/support validity, public approval, runtime approval, promotion, and learning update while allowing provisional kernel display and review packet preparation.',
      supportsKernelFields: ['implementationActorConditions', 'humanReviewRoute', 'cannotYetSay'],
    }),
    span({
      id: `span_wave2_${packetKey}_falcon_audit_boundary`,
      foundationRefId: 'foundation_falcon_core_weakness_audit',
      lens: 'implementation_actor_conditions',
      summary:
        'The Falcon weakness audit requires source-family scale-up to produce auditable kernel objects and review routes rather than delivery copy or final advice.',
      supportsKernelFields: ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
    }),
  ];
}

function packetFromSeed(seed: Wave2Seed): AxiomRealDerivedEvidencePacket {
  const missing = missingContext(seed.packetId, seed.missingSlots);
  const missingIds = missing.map((context) => context.id);

  return {
    packetId: seed.packetId,
    objectType: 'axiom_real_derived_evidence_packet',
    contractVersion: AXIOM_REAL_DERIVED_EVIDENCE_PROTOCOL_VERSION,
    lane: 'Falcon Lab',
    status: 'real_derived_non_sensitive_packet_ready_for_deterministic_kernel_build',
    scenarioId: seed.scenarioId,
    dataPolicy: {
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
      note: seed.dataPolicyNote,
    },
    sourceFoundationRefs: [
      ...seed.sourceFoundations.map((source) =>
        foundation(source.id, source.kind, source.uri, source.layer, source.note),
      ),
      ...commonFoundations(),
    ],
    evidenceSpans: [
      ...seed.spans.map(span),
      ...commonSpans(seed.entryId, seed.inference.text, seed.counter.text),
    ],
    inheritedFrames: [
      {
        id: `inherited_wave2_${seed.entryId}`,
        source: 'stage1_scima_fchma',
        status: 'requires_axiom_eval',
        allowedUse: 'bootstrap_prior_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          `Does ${seed.entryId} strengthen Axiom kernel grounding without becoming source/support validity or public guidance?`,
      },
      {
        id: `inherited_wave2_${seed.entryId}_l3`,
        source: 'l3_21_views',
        status: 'requires_axiom_eval',
        allowedUse: 'bootstrap_prior_only',
        allowedAsAxiomCoreTruth: false,
        reviewerQuestion:
          `Which L3 units for ${seed.entryId} should remain compressed review units before promotion?`,
      },
    ],
    observationCandidates: seed.observations.map(observation),
    inferenceCandidate: {
      id: seed.inference.id,
      text: seed.inference.text,
      observationIds: seed.observations.map((item) => item.id),
      principalPatternCandidateIds: [...seed.inference.principalPatternCandidateIds],
      crossCuttingCheckIds: [...seed.inference.crossCuttingCheckIds],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: seed.counter.id,
        text: seed.counter.text,
        wouldChange: [...seed.counter.wouldChange],
        nextQuestionIds: missingIds,
      },
    ],
    missingContext: missing,
    implementationActorConditions: seed.actorConditions.map((condition, index) => ({
      actor: condition.actor,
      condition: condition.condition,
      requiredBeforeAction: true,
      missingContextIds: missingIds.slice(index, index + 3).length > 0
        ? missingIds.slice(index, index + 3)
        : missingIds,
    })),
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        seed.sourceLensNotes.respondent_data.status,
        seed.sourceLensNotes.respondent_data.note,
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        seed.sourceLensNotes.supporter_data.status,
        seed.sourceLensNotes.supporter_data.note,
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        seed.sourceLensNotes.external_evidence.status,
        seed.sourceLensNotes.external_evidence.note,
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        seed.sourceLensNotes.implementation_actor_conditions.status,
        seed.sourceLensNotes.implementation_actor_conditions.note,
      ),
    },
    actionabilityBand: seed.actionabilityBand,
    cannotYetSay: cannotYetSay(seed.cannotYetSayExtra),
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

function wave2Seeds(): Wave2Seed[] {
  return [
    {
      entryId: 'source_family_respondent_surveys_3000_4000',
      packetId: 'axiom_wave2_packet_respondent_surveys_3000_4000_v0_2026_06_08',
      scenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
      actionabilityBand: 'usable_provisional_insight',
      sourceFoundations: [
        {
          id: 'foundation_wave2_employment_survey_3000_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/employment_survey_3000.source-manifest.json',
          layer: 'evidence',
          note: 'Manifest only: 4553 respondent rows and multiple free-text columns; raw source remains restricted.',
        },
        {
          id: 'foundation_wave2_nanbyo_survey_4000_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/nanbyo_survey_4000.source-manifest.json',
          layer: 'evidence',
          note: 'Manifest only: rare-disease respondent survey source family, not row text or field values.',
        },
        {
          id: 'foundation_wave2_free_text_context_coverage_audit',
          kind: 'stage1_scima_fchma_output',
          uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-free-text-llm-context-coverage-audit-v0-2026-05-23.md',
          layer: 'structure',
          note: 'Derived coverage audit only; it supports source-family coverage and missing-context targeting.',
        },
      ],
      spans: [
        {
          id: 'span_wave2_respondent_manifest_scale',
          foundationRefId: 'foundation_wave2_employment_survey_3000_manifest',
          lens: 'respondent_data',
          summary:
            'The employment survey manifest records a cross-disability respondent source family with structured rows and multiple free-text columns, useful for person-side interaction signals but not support validity.',
          supportsKernelFields: ['observation', 'missingContext', 'sourceLensStatus'],
        },
        {
          id: 'span_wave2_respondent_nanbyo_manifest_scale',
          foundationRefId: 'foundation_wave2_nanbyo_survey_4000_manifest',
          lens: 'respondent_data',
          summary:
            'The rare-disease respondent source family supports health-time and life-security interaction reading as a reality-shadow input without raw text exposure.',
          supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
        },
        {
          id: 'span_wave2_respondent_coverage_audit_gap',
          foundationRefId: 'foundation_wave2_free_text_context_coverage_audit',
          lens: 'external_evidence',
          summary:
            'The coverage audit turns free-text coverage into missing-context and source-lens questions rather than extracting row-level claims.',
          supportsKernelFields: ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
        },
      ],
      observations: [
        {
          id: 'obs_wave2_respondent_survey_scale',
          lens: 'respondent_data',
          text:
            'Respondent survey manifests show large person-side source families with structured and free-text signals that can thicken health-time and work-condition questions.',
          evidencePointer: 'span_wave2_respondent_manifest_scale',
        },
        {
          id: 'obs_wave2_respondent_health_time_shadow',
          lens: 'respondent_data',
          text:
            'Rare-disease respondent data should be read as a reality-shadow input for health time, life security, and work contact, not as disease-to-accommodation lookup.',
          evidencePointer: 'span_wave2_respondent_nanbyo_manifest_scale',
        },
      ],
      inference: {
        id: 'inf_wave2_respondent_health_time_source_family_kernel',
        text:
          'Respondent surveys strengthen Axiom by widening person-side health-time, work-density, recovery, and life-security grounding while preserving missing context and anti-lookup boundaries.',
        principalPatternCandidateIds: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
        crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27'],
      },
      counter: {
        id: 'counter_wave2_respondent_person_side_overfit',
        text:
          'Person-side survey scale might over-personalize structural issues unless workplace, support, time, and institutional context remain explicit missing-context questions.',
        wouldChange: ['actionability would fall to question_first_only', 'review would require source-lens contrast before corpus integration'],
      },
      missingSlots: ['person', 'job', 'environment', 'support', 'time', 'institution'],
      actorConditions: [
        { actor: 'worker', condition: 'Worker-side health-time, role, recovery, and life-security context must remain visible.' },
        { actor: 'support_staff', condition: 'Support staff must use survey signals to ask structural questions, not infer support validity.' },
        { actor: 'reviewer', condition: 'Reviewer must inspect person-side overfit and source-lens contrast before promotion.' },
      ],
      sourceLensNotes: {
        respondent_data: { status: 'present_in_evidence_foundation_fixture', note: 'Manifest and derived coverage only; raw rows/text not opened.' },
        supporter_data: { status: 'thin_or_missing', note: 'Supporter lens is a missing-context requirement for this packet.' },
        external_evidence: { status: 'bootstrap_prior_only', note: 'Coverage audit and L3/FT03 are bootstrap priors.' },
        implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture', note: 'Actor conditions are provisional and review-routed.' },
      },
      cannotYetSayExtra:
        'No respondent survey row, free-text field, disease category, or prevalence reading is approved for public or support guidance.',
      dataPolicyNote:
        'Respondent wave2 packet uses source manifests and derived coverage audit only; no raw rows, redacted text, source text, or field values are opened or exported.',
    },
    {
      entryId: 'source_family_supporter_practice',
      packetId: 'axiom_wave2_packet_supporter_practice_v0_2026_06_08',
      scenarioId: 'l3_policy_service_coordination_source_lens_v0',
      actionabilityBand: 'question_first_only',
      sourceFoundations: [
        {
          id: 'foundation_wave2_supporter_nanbyo_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/supporter_practice_nanbyo.source-manifest.json',
          layer: 'evidence',
          note: 'Supporter practice source manifest only; no supporter narrative text is exported.',
        },
        {
          id: 'foundation_wave2_supporter_toku18_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/supporter_practice_toku18.source-manifest.json',
          layer: 'evidence',
          note: 'Supporter practice source manifest only; used for source-family coverage.',
        },
        {
          id: 'foundation_wave2_ftcodex01_supporter_reading',
          kind: 'stage1_scima_fchma_output',
          uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23-summary.md',
          layer: 'structure',
          note: 'FT-Codex-01 derived supporter/context reading summary.',
        },
      ],
      spans: [
        {
          id: 'span_wave2_supporter_manifest_scale',
          foundationRefId: 'foundation_wave2_supporter_nanbyo_manifest',
          lens: 'supporter_data',
          summary:
            'Supporter practice manifests show a distinct support lens that can reveal coordination, referral, retranslation, and continuity questions but not support validity.',
          supportsKernelFields: ['observation', 'sourceLensStatus', 'missingContext'],
        },
        {
          id: 'span_wave2_supporter_ftcodex01_continuity',
          foundationRefId: 'foundation_wave2_ftcodex01_supporter_reading',
          lens: 'supporter_data',
          summary:
            'FT-Codex-01 keeps support continuity and health-time/life-security translation visible as a network function rather than as support presence proof.',
          supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
        },
      ],
      observations: [
        {
          id: 'obs_wave2_supporter_continuity_lens',
          lens: 'supporter_data',
          text:
            'Supporter practice families contribute a continuity and retranslation lens across worker, workplace, medical/life, and institutional surfaces.',
          evidencePointer: 'span_wave2_supporter_manifest_scale',
        },
        {
          id: 'obs_wave2_supporter_ftcodex01_network_function',
          lens: 'supporter_data',
          text:
            'FT-Codex-01 derived reading treats support as a network translation function, not as evidence that a support mechanism works.',
          evidencePointer: 'span_wave2_supporter_ftcodex01_continuity',
        },
      ],
      inference: {
        id: 'inf_wave2_supporter_policy_service_coordination_kernel',
        text:
          'Supporter practice strengthens the kernel by adding service-continuity, referral, retranslation, and handoff questions while preserving the support-validity brake.',
        principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
        crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
      },
      counter: {
        id: 'counter_wave2_supporter_presence_as_validity',
        text:
          'The supporter signal may only show support presence, intention, or meeting records, not actual continuity, translation quality, or outcome support.',
        wouldChange: ['keep actionability question_first_only', 'require reviewer contrast with respondent and workplace lenses'],
      },
      missingSlots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
      actorConditions: [
        { actor: 'support_staff', condition: 'Support role, handoff boundary, and retranslation work must be explicit before use.' },
        { actor: 'employer_manager', condition: 'Workplace-side contact point must be identified before support coordination rises in actionability.' },
        { actor: 'reviewer', condition: 'Reviewer must block support-presence-as-support-validity overclaim.' },
      ],
      sourceLensNotes: {
        respondent_data: { status: 'thin_or_missing', note: 'Respondent contrast is needed before support signals are raised.' },
        supporter_data: { status: 'present_in_evidence_foundation_fixture', note: 'Supporter manifest and FT-Codex derived summary are present.' },
        external_evidence: { status: 'bootstrap_prior_only', note: 'L3/FT03 are bootstrap priors.' },
        implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture', note: 'Coordination actor conditions are explicit.' },
      },
      cannotYetSayExtra:
        'No supporter practice source is approved as support effectiveness, provider quality, or intervention validity.',
      dataPolicyNote:
        'Supporter wave2 packet uses manifests and Stage 1 derived summaries only; no raw supporter text or field values are used.',
    },
    {
      entryId: 'source_family_workplace_surveys',
      packetId: 'axiom_wave2_packet_workplace_surveys_v0_2026_06_08',
      scenarioId: 'l3_disclosure_information_procedure_boundary_v0',
      actionabilityBand: 'question_first_only',
      sourceFoundations: [
        {
          id: 'foundation_wave2_workplace_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/nanbyo_workplace_2022_2023.source-manifest.json',
          layer: 'evidence',
          note: 'Workplace-side source manifest only; used for coverage without workplace text export.',
        },
        {
          id: 'foundation_wave2_workplace_web_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/nanbyo_workplace_2022_2023_web_raw0324.source-manifest.json',
          layer: 'evidence',
          note: 'Workplace-side web raw manifest only; no raw text is opened.',
        },
        {
          id: 'foundation_wave2_cr04_worksite_contact',
          kind: 'stage1_scima_fchma_output',
          uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md',
          layer: 'structure',
          note: 'CR04 derived worksite-contact reading.',
        },
      ],
      spans: [
        {
          id: 'span_wave2_workplace_manifest_contact_surface',
          foundationRefId: 'foundation_wave2_workplace_manifest',
          lens: 'implementation_actor_conditions',
          summary:
            'Workplace-side manifests add employer/worksite contact surfaces such as staffing, safety, customer, absence substitution, job task, and information-management concerns.',
          supportsKernelFields: ['observation', 'missingContext', 'sourceLensStatus'],
        },
        {
          id: 'span_wave2_workplace_cr04_decomposition',
          foundationRefId: 'foundation_wave2_cr04_worksite_contact',
          lens: 'implementation_actor_conditions',
          summary:
            'CR04 decomposes worksite contact into task/workflow, access/rest/safety, information contact, mobility, evaluation value, and energy/posture.',
          supportsKernelFields: ['observation', 'inference', 'implementationActorConditions'],
        },
      ],
      observations: [
        {
          id: 'obs_wave2_workplace_contact_surface',
          lens: 'implementation_actor_conditions',
          text:
            'Workplace surveys bring the worksite contact surface into the kernel as task, safety, staffing, customer, information, and absence-substitution conditions.',
          evidencePointer: 'span_wave2_workplace_manifest_contact_surface',
        },
        {
          id: 'obs_wave2_workplace_cr04_decomposition',
          lens: 'implementation_actor_conditions',
          text:
            'CR04 indicates that disclosure/procedure issues should be decomposed into actual work-contact points rather than person ability or employer validity judgments.',
          evidencePointer: 'span_wave2_workplace_cr04_decomposition',
        },
      ],
      inference: {
        id: 'inf_wave2_workplace_disclosure_procedure_kernel',
        text:
          'Workplace-side data strengthens disclosure/procedure reasoning by translating abstract accommodation talk into task, safety, information, evaluation, and workflow contact points.',
        principalPatternCandidateIds: ['L3-PIP-10', 'L3-PIP-13', 'L3-PIP-17', 'L3-PIP-18'],
        crossCuttingCheckIds: ['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-26', 'L3-CCA-27'],
      },
      counter: {
        id: 'counter_wave2_workplace_concern_as_truth',
        text:
          'Workplace concern might reflect untested fear, low information quality, or institutional constraint rather than objective infeasibility or person ability.',
        wouldChange: ['require bias/discrimination risk review', 'keep disclosure/procedure packet internal and question-first'],
      },
      missingSlots: ['person', 'job', 'environment', 'support', 'time', 'institution', 'source_lens'],
      actorConditions: [
        { actor: 'employer_manager', condition: 'Workplace task, safety, information, and staffing constraints must be named as contact points.' },
        { actor: 'worker', condition: 'Worker consent, disclosure boundary, and evaluation impact must be visible.' },
        { actor: 'reviewer', condition: 'Reviewer must prevent workplace concern from becoming ability or employer-validity judgment.' },
      ],
      sourceLensNotes: {
        respondent_data: { status: 'thin_or_missing', note: 'Person-side experience must be contrasted before use.' },
        supporter_data: { status: 'thin_or_missing', note: 'Supporter lens is a missing-context need.' },
        external_evidence: { status: 'bootstrap_prior_only', note: 'L3/FT03 are boundary priors.' },
        implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture', note: 'Workplace actor conditions are present through manifests and CR04.' },
      },
      cannotYetSayExtra:
        'No workplace concern is approved as objective infeasibility, person ability, employer validity, or legal/accommodation adequacy.',
      dataPolicyNote:
        'Workplace wave2 packet uses source manifests and derived CR04 only; no workplace raw text, redacted text, or field values are exported.',
    },
    {
      entryId: 'source_family_workshop_practice_knowledge',
      packetId: 'axiom_wave2_packet_workshop_practice_knowledge_v0_2026_06_08',
      scenarioId: 'l3_policy_service_coordination_source_lens_v0',
      actionabilityBand: 'question_first_only',
      sourceFoundations: [
        {
          id: 'foundation_wave2_workshop_interaction_design',
          kind: 'shared_evidence_foundation',
          uri: 'references/workshops/難病就労支援_相互作用パターン分析と連携設計.md',
          layer: 'evidence',
          note: 'Workshop derived/practice knowledge file; used as actor-map and sequence-gap input only.',
        },
        {
          id: 'foundation_wave2_workshop_hw_cases',
          kind: 'shared_evidence_foundation',
          uri: 'references/workshops/HW好事例再整理.md',
          layer: 'evidence',
          note: 'Workshop/practice memo; not prevalence, public claim, or source validity.',
        },
      ],
      spans: [
        {
          id: 'span_wave2_workshop_actor_map',
          foundationRefId: 'foundation_wave2_workshop_interaction_design',
          lens: 'supporter_data',
          summary:
            'Workshop material can reveal actor maps, sequence gaps, early information problems, and collaboration transitions across support and workplace actors.',
          supportsKernelFields: ['observation', 'missingContext', 'implementationActorConditions'],
        },
        {
          id: 'span_wave2_workshop_case_reorganization',
          foundationRefId: 'foundation_wave2_workshop_hw_cases',
          lens: 'supporter_data',
          summary:
            'Practice reorganization material helps locate where good-case narratives need source-lens and mechanism review before promotion.',
          supportsKernelFields: ['observation', 'inference', 'actionabilityBand'],
        },
      ],
      observations: [
        {
          id: 'obs_wave2_workshop_actor_sequence',
          lens: 'supporter_data',
          text:
            'Workshop practice knowledge supplies actor-map and sequence-gap signals for coordination and service handoff reasoning.',
          evidencePointer: 'span_wave2_workshop_actor_map',
        },
        {
          id: 'obs_wave2_workshop_good_case_boundary',
          lens: 'supporter_data',
          text:
            'Good-case/practice narratives can point to mechanisms, but they require review before being treated as source validity or transferable practice.',
          evidencePointer: 'span_wave2_workshop_case_reorganization',
        },
      ],
      inference: {
        id: 'inf_wave2_workshop_policy_service_actor_map_kernel',
        text:
          'Workshop practice knowledge strengthens policy/service coordination by exposing actor maps, stage transitions, and sequence gaps that survey or web-cache sources alone can miss.',
        principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
        crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
      },
      counter: {
        id: 'counter_wave2_workshop_fragment_as_general_rule',
        text:
          'Workshop fragments might overfill missing axes or overgeneralize from partial practice knowledge unless treated as actor-map questions.',
        wouldChange: ['route to hold_or_research_needed', 'require comparison with respondent/workplace/source lenses'],
      },
      missingSlots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
      actorConditions: [
        { actor: 'support_staff', condition: 'Workshop actor maps must be translated into concrete handoff and missing-information questions.' },
        { actor: 'public_or_institutional_actor', condition: 'Institutional stage boundaries must be visible before policy/service use.' },
        { actor: 'reviewer', condition: 'Reviewer must block workshop-fragment overgeneralization.' },
      ],
      sourceLensNotes: {
        respondent_data: { status: 'thin_or_missing', note: 'Respondent-side contrast is needed.' },
        supporter_data: { status: 'present_in_evidence_foundation_fixture', note: 'Workshop/practice knowledge is present as support lens.' },
        external_evidence: { status: 'bootstrap_prior_only', note: 'Workshop files are evidence-layer practice knowledge, not source validity.' },
        implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture', note: 'Actor maps and sequence gaps are explicit.' },
      },
      cannotYetSayExtra:
        'No workshop fragment is approved as prevalence, support validity, public-ready claim, or official/current policy.',
      dataPolicyNote:
        'Workshop wave2 packet uses local reference workshop files only as non-sensitive practice-knowledge summaries.',
    },
    {
      entryId: 'source_family_historical_2001_abc',
      packetId: 'axiom_wave2_packet_2001_abc_triadic_source_lens_v0_2026_06_08',
      scenarioId: 'l3_post_hiring_quality_evaluation_loop_v0',
      actionabilityBand: 'usable_provisional_insight',
      sourceFoundations: [
        {
          id: 'foundation_wave2_2001_abc_manifest',
          kind: 'shared_evidence_foundation',
          uri: 'data/specs/source-manifests/2001_ABC_survey.source-manifest.json',
          layer: 'evidence',
          note: 'Manifest only: historical linked A/B/C source family with strict raw-text restrictions and era limitations.',
        },
        {
          id: 'foundation_wave2_2001_abc_triadic_synthesis',
          kind: 'stage1_scima_fchma_output',
          uri: 'references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22/2001-abc-survey-triadic-scima-fchma-synthesis-cards-v0-2026-05-22.md',
          layer: 'structure',
          note: 'Derived triadic synthesis cards only; historical source family remains non-current.',
        },
        {
          id: 'foundation_wave2_2001_abc_mechanism_crosswalk',
          kind: 'stage1_scima_fchma_output',
          uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.md',
          layer: 'structure',
          note: 'Stage 1 mechanism crosswalk for historical triadic perspective differences.',
        },
      ],
      spans: [
        {
          id: 'span_wave2_2001_abc_manifest_limits',
          foundationRefId: 'foundation_wave2_2001_abc_manifest',
          lens: 'external_evidence',
          summary:
            'The 2001 ABC manifest records linked HR, supervisor, and disabled employee perspectives with historical limits, selection bias, and raw-text externalization blocks.',
          supportsKernelFields: ['observation', 'sourceLensStatus', 'cannotYetSay'],
        },
        {
          id: 'span_wave2_2001_abc_triadic_perspective',
          foundationRefId: 'foundation_wave2_2001_abc_triadic_synthesis',
          lens: 'implementation_actor_conditions',
          summary:
            'Triadic synthesis cards help compare HR/workplace/person views around role, evaluation, burden, participation, and support continuity.',
          supportsKernelFields: ['observation', 'inference', 'implementationActorConditions'],
        },
        {
          id: 'span_wave2_2001_abc_mechanism_crosswalk',
          foundationRefId: 'foundation_wave2_2001_abc_mechanism_crosswalk',
          lens: 'external_evidence',
          summary:
            'Mechanism crosswalk links historical triadic differences to worksite contact, information participation, life security, and quality/evaluation routes.',
          supportsKernelFields: ['inference', 'counterHypothesis', 'actionabilityBand'],
        },
      ],
      observations: [
        {
          id: 'obs_wave2_2001_abc_triadic_lens',
          lens: 'implementation_actor_conditions',
          text:
            '2001 ABC contributes a historical triadic source lens across HR/personnel, workplace supervisor, and disabled employee perspectives.',
          evidencePointer: 'span_wave2_2001_abc_triadic_perspective',
        },
        {
          id: 'obs_wave2_2001_abc_limits',
          lens: 'external_evidence',
          text:
            'The 2001 ABC manifest requires era, selection, linkage, and raw-text limits to remain explicit before any mechanism use.',
          evidencePointer: 'span_wave2_2001_abc_manifest_limits',
        },
      ],
      inference: {
        id: 'inf_wave2_2001_abc_post_hiring_quality_kernel',
        text:
          '2001 ABC strengthens post-hiring quality reasoning by making person/workplace/HR perspective differences visible while blocking current-policy and generalization overclaims.',
        principalPatternCandidateIds: ['L3-PIP-06', 'L3-PIP-19', 'L3-PIP-20', 'L3-PIP-21'],
        crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-27'],
      },
      counter: {
        id: 'counter_wave2_2001_abc_historical_overclaim',
        text:
          'Historical 2001 triadic signals might not transfer to current rare-disease, policy, or workplace contexts without explicit contrast and review.',
        wouldChange: ['route to historical boundary hold', 'prevent candidate_pattern and public use movement'],
      },
      missingSlots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
      actorConditions: [
        { actor: 'employer_manager', condition: 'Employer/workplace perspective must be read as one lens, not as objective feasibility.' },
        { actor: 'worker', condition: 'Worker perspective must remain visible against HR and supervisor lenses.' },
        { actor: 'reviewer', condition: 'Reviewer must enforce historical and linkage limitations before integration.' },
      ],
      sourceLensNotes: {
        respondent_data: { status: 'present_in_evidence_foundation_fixture', note: 'Disabled employee perspective exists as historical derived/manifest lens.' },
        supporter_data: { status: 'thin_or_missing', note: 'Supporter lens is indirect and historical.' },
        external_evidence: { status: 'bootstrap_prior_only', note: '2001 ABC is historical and requires Axiom eval before use.' },
        implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture', note: 'HR/workplace/person actor differences are explicit.' },
      },
      cannotYetSayExtra:
        'No 2001 ABC historical pattern is approved as current policy, rare-disease evidence, public guidance, or universal workplace mechanism.',
      dataPolicyNote:
        '2001 ABC wave2 packet uses manifest and derived synthesis/crosswalk only; no sensitive raw text, diagnosis text, or row-level values are opened.',
    },
    {
      entryId: 'source_family_international_web_cache',
      packetId: 'axiom_wave2_packet_international_web_cache_jurisdiction_contrast_v0_2026_06_08',
      scenarioId: 'l3_policy_service_coordination_source_lens_v0',
      actionabilityBand: 'hold_or_research_needed',
      sourceFoundations: [
        {
          id: 'foundation_wave2_normalized_manifest_international',
          kind: 'shared_evidence_foundation',
          uri: 'references/index/normalized-manifest.json',
          layer: 'evidence',
          note: 'Normalized manifest gives country/source-family counts for international web-cache coverage; no source text export.',
        },
        {
          id: 'foundation_wave2_web_cache_source_audit',
          kind: 'stage1_scima_fchma_output',
          uri: 'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.md',
          layer: 'evidence',
          note: 'Web-cache audit identifies AskEARN, JAN, AU JobAccess, Canada, EU, Germany, and UK families.',
        },
      ],
      spans: [
        {
          id: 'span_wave2_international_manifest_country_counts',
          foundationRefId: 'foundation_wave2_normalized_manifest_international',
          lens: 'external_evidence',
          summary:
            'Normalized manifest records international source-family coverage across US, AU, CA, EU, DE, and UK records for jurisdiction contrast only.',
          supportsKernelFields: ['observation', 'sourceLensStatus', 'missingContext'],
        },
        {
          id: 'span_wave2_international_source_family_audit',
          foundationRefId: 'foundation_wave2_web_cache_source_audit',
          lens: 'external_evidence',
          summary:
            'The web-cache audit distinguishes international source families that may supply same-structure/different-jurisdiction counter-hypotheses, not Japanese current policy.',
          supportsKernelFields: ['observation', 'inference', 'counterHypothesis', 'actionabilityBand'],
        },
      ],
      observations: [
        {
          id: 'obs_wave2_international_jurisdiction_coverage',
          lens: 'external_evidence',
          text:
            'International web-cache coverage can provide jurisdiction-contrast input across US, AU, CA, EU, Germany, and UK source families.',
          evidencePointer: 'span_wave2_international_manifest_country_counts',
        },
        {
          id: 'obs_wave2_international_counter_structure',
          lens: 'external_evidence',
          text:
            'International sources should be used to ask whether the same work-design structure appears under different legal/service frames, not to import guidance.',
          evidencePointer: 'span_wave2_international_source_family_audit',
        },
      ],
      inference: {
        id: 'inf_wave2_international_policy_service_jurisdiction_contrast_kernel',
        text:
          'International web-cache strengthens Axiom by adding jurisdiction-contrast counter-hypotheses for policy/service coordination while explicitly blocking Japanese current-policy or legal import.',
        principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
        crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
      },
      counter: {
        id: 'counter_wave2_international_policy_import',
        text:
          'A foreign accommodation or support frame might be legally, institutionally, culturally, or service-system incompatible with Japanese practice.',
        wouldChange: ['hold as jurisdiction contrast only', 'require official-source triage and currentness review before any public use'],
      },
      missingSlots: ['job', 'environment', 'support', 'time', 'institution', 'source_lens'],
      actorConditions: [
        { actor: 'public_or_institutional_actor', condition: 'Jurisdiction, source currentness, and legal/service role must be explicit.' },
        { actor: 'support_staff', condition: 'Support use must stay at contrast-question level, not imported practice guidance.' },
        { actor: 'reviewer', condition: 'Reviewer must block foreign-policy import and public/current claims.' },
      ],
      sourceLensNotes: {
        respondent_data: { status: 'thin_or_missing', note: 'No respondent lens is introduced by this packet.' },
        supporter_data: { status: 'thin_or_missing', note: 'Supporter lens must be supplied separately.' },
        external_evidence: { status: 'bootstrap_prior_only', note: 'International web-cache remains comparison material requiring review.' },
        implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture', note: 'Jurisdiction/currentness/source-role conditions are explicit.' },
      },
      cannotYetSayExtra:
        'No international source is approved as Japanese legal guidance, current policy, accommodation instruction, or public source validity.',
      dataPolicyNote:
        'International web-cache wave2 packet uses normalized manifest and source audit only; no cached source text is exported or treated as current truth.',
    },
  ];
}

export function buildAxiomSourceFamilyScaleUpWave2Packets(): AxiomRealDerivedEvidencePacket[] {
  return wave2Seeds().map(packetFromSeed);
}

function buildEvalReports(
  batchRun: AxiomRealDerivedKernelBuildBatchRun,
): AxiomInteractionHypothesisKernelEvalReport[] {
  return batchRun.runs.map((run) =>
    evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      L3_EVAL_SCENARIOS[run.evidencePacket.scenarioId],
    ),
  );
}

export function buildAxiomSourceFamilyScaleUpWave2Attachment(
  baseReadout: AxiomKernelCorpusReadout = buildAxiomKernelCorpusReadout(),
  sourceLedger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(),
): AxiomSourceFamilyScaleUpWave2Attachment {
  const packets = buildAxiomSourceFamilyScaleUpWave2Packets();
  const wave2BatchRun = runAxiomRealDerivedEvidenceKernelBuildBatch(packets);
  const evalReports = buildEvalReports(wave2BatchRun);
  const entriesById = new Map(sourceLedger.entries.map((entry) => [entry.entryId, entry]));
  const runsByPacketId = new Map(
    wave2BatchRun.runs.map((run) => [run.evidencePacket.packetId, run]),
  );
  const packetMappings = wave2Seeds().map((seed) => {
    const entry = entriesById.get(seed.entryId);
    const run = runsByPacketId.get(seed.packetId);
    if (!entry || !run) {
      throw new Error(`axiom_wave2_mapping_failed:${seed.entryId}:${seed.packetId}`);
    }

    return {
      sourceFamilyEntryId: entry.entryId,
      sourceFamilyGroup: entry.group,
      evidencePacketId: seed.packetId,
      buildGroundingPacketId: run.buildGroundingPacket.packetId,
      kernelId: run.buildGroundingPacket.kernel.kernelId,
      scenarioId: seed.scenarioId,
      status: 'prepared_as_derived_non_sensitive_packet_attached_to_corpus',
    } satisfies AxiomSourceFamilyScaleUpWave2PacketMapping;
  });

  return {
    attachmentId: 'axiom_source_family_scale_up_wave2_attachment_v0_2026_06_08',
    objectType: 'axiom_source_family_scale_up_wave2_attachment',
    contractVersion: AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_VERSION,
    lane: 'Falcon Lab',
    status: 'prepared_wave2_packets_attached_to_stable_corpus',
    boundary: AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY,
    strengthensCore: [...AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES],
    baseReadoutId: baseReadout.readoutId,
    sourceLedgerId: sourceLedger.ledgerId,
    basePacketCount: baseReadout.packetCount,
    wave2PacketCount: packets.length,
    projectedCorpusPacketCount: baseReadout.packetCount + packets.length,
    wave2BatchRun,
    evalReports,
    packetMappings,
    reviewUnitCount: wave2BatchRun.reviewUnitCompression.estimatedCoreReviewUnits,
    maxCoreHumanReviewUnits: 100,
    nextStepAfterWave2: 'integrate_wave2_into_kernel_corpus_readout_after_validation',
    notNow: [
      'no_raw_original_or_redacted_text_ingestion',
      'no_source_text_or_field_value_export',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_public_page_filling_from_unpromoted_kernel',
      'no_public_approval_or_publication',
      'no_learning_update',
      ...baseReadout.notNow,
      ...sourceLedger.notNow,
      ...wave2BatchRun.notNow,
    ],
  };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function validateAxiomSourceFamilyScaleUpWave2Attachment(
  attachment: AxiomSourceFamilyScaleUpWave2Attachment,
  baseReadout: AxiomKernelCorpusReadout = buildAxiomKernelCorpusReadout(),
  sourceLedger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(),
): AxiomSourceFamilyScaleUpWave2AttachmentValidation {
  const errors: string[] = [];
  const baseValidation = validateAxiomKernelCorpusReadout(baseReadout);
  const requiredEntryIds = new Set(sourceLedger.nextWaveRecommendation.recommendedEntryIds);
  const mappedEntryIds = new Set(attachment.packetMappings.map((mapping) => mapping.sourceFamilyEntryId));
  const mappedPacketIds = new Set(attachment.packetMappings.map((mapping) => mapping.evidencePacketId));
  const runPacketIds = new Set(attachment.wave2BatchRun.runs.map((run) => run.evidencePacket.packetId));

  pushIf(!baseValidation.valid, errors, 'base_kernel_corpus_readout_must_be_valid');
  pushIf(
    attachment.objectType !== 'axiom_source_family_scale_up_wave2_attachment',
    errors,
    'object_type_must_match_wave2_attachment',
  );
  pushIf(
    attachment.contractVersion !== AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_VERSION,
    errors,
    'contract_version_must_match_source_family_scale_up_wave2_v0_2026_06_08',
  );
  pushIf(attachment.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    attachment.boundary !== AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY,
    errors,
    'boundary_must_remain_wave2_grounding_not_public_runtime_or_promotion',
  );
  pushIf(
    attachment.basePacketCount !== 8 ||
      attachment.wave2PacketCount !== 6 ||
      attachment.projectedCorpusPacketCount !== 14,
    errors,
    'wave2_must_attach_six_packets_to_the_8_packet_base_corpus',
  );
  pushIf(
    attachment.wave2BatchRun.status !== 'passed_real_derived_non_sensitive_kernel_build_batch',
    errors,
    'wave2_kernel_build_batch_must_pass',
  );
  pushIf(
    attachment.evalReports.length !== attachment.wave2PacketCount ||
      attachment.evalReports.some((report) => report.status !== 'passes'),
    errors,
    'wave2_l3_eval_reports_must_all_pass',
  );
  pushIf(
    attachment.reviewUnitCount > 100 || attachment.maxCoreHumanReviewUnits !== 100,
    errors,
    'wave2_review_units_must_remain_under_100',
  );
  for (const entryId of requiredEntryIds) {
    pushIf(!mappedEntryIds.has(entryId), errors, `wave2_required_entry_missing:${entryId}`);
  }
  for (const packetId of runPacketIds) {
    pushIf(!mappedPacketIds.has(packetId), errors, `wave2_packet_mapping_missing:${packetId}`);
  }
  for (const run of attachment.wave2BatchRun.runs) {
    const packet = run.evidencePacket;
    pushIf(
      packet.dataPolicy.rawOriginalOpened !== false ||
        packet.dataPolicy.sourceTextExported !== false ||
        packet.dataPolicy.redactedTextExported !== false ||
        packet.dataPolicy.fieldValueExported !== false ||
        packet.dataPolicy.sourceSupportValidityDecision !== 'not_decided' ||
        packet.dataPolicy.publicUse !== 'not_public_approved',
      errors,
      `wave2_packet_must_not_open_or_export_raw_or_move_validity:${packet.packetId}`,
    );
  }
  pushIf(
    !attachment.notNow.includes('no_source_or_support_validity_decision') ||
      !attachment.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !attachment.notNow.includes('no_public_page_filling_from_unpromoted_kernel') ||
      !attachment.notNow.includes('no_learning_update'),
    errors,
    'wave2_not_now_must_block_validity_runtime_public_page_filling_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'source_family_scale_up_wave2_attachment_valid'
        : 'source_family_scale_up_wave2_attachment_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY,
    strengthensCore: [...AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES],
  };
}
