import {
  type AxiomActionabilityBand,
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
  type AxiomInheritedFrameEvalRoute,
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
import { type AxiomL3EvalScenarioId } from './interactionHypothesisKernelScenarioFixtures';
import {
  buildAxiomKernelCorpusWave2Readout,
  validateAxiomKernelCorpusWave2Readout,
  type AxiomKernelCorpusWave2Readout,
} from './kernelCorpusWave2Readout';
import {
  buildAxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationLedger,
} from './sourceFamilyUtilizationLedger';

export const AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY =
  'axiom_manual_document_source_family_attachment_packetizes_documents_as_derived_non_sensitive_kernel_grounding_not_public_guidance_or_source_validity' as const;

export const AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_grounding',
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomManualDocumentSourceFamilyAttachment = {
  attachmentId: string;
  objectType: 'axiom_manual_document_source_family_attachment';
  contractVersion: typeof AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_VERSION;
  lane: 'Falcon Lab';
  status: 'manual_document_packet_attached_to_kernel_corpus_pending_review';
  boundary: typeof AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY;
  strengthensCore: typeof AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES;
  baseReadoutId: string;
  sourceLedgerId: string;
  sourceFamilyEntryId: 'source_family_manuals_and_documents';
  basePacketCount: 14;
  manualDocumentPacketCount: 1;
  projectedCorpusPacketCount: 15;
  manualDocumentBatchRun: AxiomRealDerivedKernelBuildBatchRun;
  evalReports: AxiomInteractionHypothesisKernelEvalReport[];
  packetMapping: {
    sourceFamilyEntryId: 'source_family_manuals_and_documents';
    evidencePacketId: string;
    buildGroundingPacketId: string;
    kernelId: string;
    scenarioId: AxiomL3EvalScenarioId;
    status: 'prepared_as_derived_non_sensitive_packet_attached_to_corpus';
  };
  reviewUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  nextStepAfterAttachment: 'project_manual_document_packet_into_kernel_corpus_readout';
  notNow: string[];
};

export type AxiomManualDocumentSourceFamilyAttachmentValidation = {
  valid: boolean;
  validationStatus:
    | 'manual_document_source_family_attachment_valid'
    | 'manual_document_source_family_attachment_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY;
  strengthensCore: typeof AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES;
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

const MANUAL_DOCUMENT_SCENARIO: AxiomKernelEvalScenario = {
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

function missingContext(): AxiomMissingContext[] {
  const slots: AxiomMissingContextSlot[] = [
    'job',
    'environment',
    'support',
    'time',
    'institution',
    'source_lens',
  ];

  return slots.map((slot) => ({
    id: `mc_manual_document_${slot}_001`,
    slot,
    question:
      `What ${slot} context is needed before manual/document evidence can move beyond provisional source-lens grounding?`,
    whyItMatters:
      'Manuals and long-form documents are useful reality-shadow inputs, but currentness, jurisdiction, chapter role, and implementation actor fit must remain explicit before promotion.',
  }));
}

function observation(id: string, lens: AxiomSourceLens, text: string, evidencePointer: string): AxiomObservation {
  return {
    id,
    lens,
    text,
    evidencePointer,
    statusLabel: 'shared_evidence_foundation',
  };
}

function inheritedFrames(): AxiomInheritedFrameEvalRoute[] {
  return [
    {
      id: 'inherited_manual_document_stage1_source_lens',
      source: 'stage1_scima_fchma',
      status: 'requires_axiom_eval',
      allowedUse: 'bootstrap_prior_only',
      allowedAsAxiomCoreTruth: false,
      reviewerQuestion:
        'Does the manual/document family strengthen source-lens and implementation-actor grounding without becoming current policy or source/support validity?',
    },
    {
      id: 'inherited_manual_document_l3_policy_service',
      source: 'l3_21_views',
      status: 'requires_axiom_eval',
      allowedUse: 'bootstrap_prior_only',
      allowedAsAxiomCoreTruth: false,
      reviewerQuestion:
        'Which L3 policy/service/source-lens units should review manual/document use before promotion?',
    },
    {
      id: 'inherited_manual_document_ft03_boundary',
      source: 'ft03_contract',
      status: 'requires_axiom_eval',
      allowedUse: 'bootstrap_prior_only',
      allowedAsAxiomCoreTruth: false,
      reviewerQuestion:
        'Does the packet preserve FT03 separation between evidence role, missing context, counter-hypothesis, and recommendation?',
    },
  ];
}

export function buildAxiomManualDocumentEvidencePacket(): AxiomRealDerivedEvidencePacket {
  const missing = missingContext();
  const missingIds = missing.map((context) => context.id);
  const observations = [
    observation(
      'obs_manual_document_manifest_scope',
      'external_evidence',
      'The normalized manifest and document metadata identify manuals and long-form documents as a distinct source family that can ground source-role, chapter-map, currentness, and implementation-actor questions.',
      'span_manual_document_manifest_scope',
    ),
    observation(
      'obs_manual_document_work_policy_translation',
      'implementation_actor_conditions',
      'Manual/document evidence should translate treatment-work, AI/tool inclusion, and institutional guidance into work-condition questions, not direct public guidance or support validity.',
      'span_manual_document_work_policy_translation',
    ),
  ];

  return {
    packetId: 'axiom_manual_document_packet_chapter_level_source_lens_v0_2026_06_08',
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
      note:
        'Manual/document packet uses local metadata, normalized manifest, and derived boundary artifacts only; no PDF text, raw source text, redacted text, or field values are opened or exported.',
    },
    sourceFoundationRefs: [
      foundation(
        'foundation_manual_document_mhlw_mental_manual_meta',
        'shared_evidence_foundation',
        'references/documents/mhlw-treatment-work-mental-manual-2026.meta.json',
        'evidence',
        'Local metadata for a long-form MHLW treatment-work mental-health manual; used for document-family role and currentness questions, not as current policy approval.',
      ),
      foundation(
        'foundation_manual_document_mhlw_mental_manual_pdf',
        'shared_evidence_foundation',
        'references/documents/mhlw-treatment-work-mental-manual-2026.pdf',
        'evidence',
        'PDF presence is recorded as a source-family object; this packet does not read or export PDF text.',
      ),
      foundation(
        'foundation_manual_document_disability_inclusive_ai_pdf',
        'shared_evidence_foundation',
        'references/documents/2026+Resource_Disability+Inclusive+AI_Remediated.pdf',
        'evidence',
        'Disability-inclusive AI resource is kept as a tool/inclusion source-lens object, not jurisdictional guidance for Japan.',
      ),
      foundation(
        'foundation_manual_document_normalized_manifest',
        'shared_evidence_foundation',
        'references/index/normalized-manifest.json',
        'structure',
        'Normalized manifest provides document/source-family scale and indexing without source text export.',
      ),
      foundation(
        'foundation_manual_document_l3_principal_patterns',
        'l3_principal_pattern_surface',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
        'structure',
        'L3 policy/service and source-lens IDs are used as eval/review priors, not promoted doctrine.',
      ),
      foundation(
        'foundation_ft03_response_contract',
        'ft03_internal_response_contract',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft03-internal-expert-agent-response-contract-v0-2026-05-25.md',
        'reference_frame',
        'FT03 preserves observation, inference, counter-hypothesis, missing-context, cannot-yet-say, and review-route separation.',
      ),
      foundation(
        'foundation_falcon_core_weakness_audit',
        'falcon_core_weakness_audit',
        'docs/nbl-workspace/falcon-expert-agent-core-weakness-audit-and-v2-rebuild-2026-06-07.md',
        'learning_boundary',
        'Falcon weakness audit keeps this as kernel work rather than public copy or runtime behavior.',
      ),
    ],
    evidenceSpans: [
      span(
        'span_manual_document_manifest_scope',
        'foundation_manual_document_normalized_manifest',
        'external_evidence',
        'The normalized manifest records manuals and guideline-like documents as a scale-bearing source family, useful for coverage and source-role questions without extracting source text.',
        ['observation', 'sourceLensStatus', 'missingContext'],
      ),
      span(
        'span_manual_document_chapter_currentness_boundary',
        'foundation_manual_document_mhlw_mental_manual_meta',
        'external_evidence',
        'Manual metadata can support chapter-map, currentness, document role, and institutional-source questions; it cannot by itself approve public guidance, legal meaning, or support validity.',
        ['counterHypothesis', 'sourceLensStatus', 'cannotYetSay'],
      ),
      span(
        'span_manual_document_work_policy_translation',
        'foundation_manual_document_mhlw_mental_manual_pdf',
        'implementation_actor_conditions',
        'Treatment-work manuals should be converted into work-condition, actor, timing, support, and institutional-context questions before any recommendation or public use.',
        ['observation', 'inference', 'implementationActorConditions', 'actionabilityBand'],
      ),
      span(
        'span_manual_document_ai_tool_inclusion_boundary',
        'foundation_manual_document_disability_inclusive_ai_pdf',
        'implementation_actor_conditions',
        'AI/tool inclusion material is useful for tool-risk and accessibility actor questions, but cannot become Japanese policy, accommodation validity, or automated support advice.',
        ['counterHypothesis', 'implementationActorConditions', 'cannotYetSay'],
      ),
      span(
        'span_manual_document_l3_policy_service_prior',
        'foundation_manual_document_l3_principal_patterns',
        'external_evidence',
        'L3 PIP-11, PIP-12, PIP-14, and PIP-21 frame manuals/documents as source-lens translation, support-continuity, return-circuit, and implementation-variation questions.',
        ['inference', 'actionabilityBand', 'humanReviewRoute'],
      ),
      span(
        'span_manual_document_ft03_boundary',
        'foundation_ft03_response_contract',
        'implementation_actor_conditions',
        'FT03 blocks source/support validity, public approval, runtime approval, promotion, and learning update while allowing provisional kernel display and review-packet preparation.',
        ['implementationActorConditions', 'humanReviewRoute', 'cannotYetSay'],
      ),
      span(
        'span_manual_document_falcon_audit_boundary',
        'foundation_falcon_core_weakness_audit',
        'implementation_actor_conditions',
        'The Falcon weakness audit requires manuals/documents to become auditable kernel objects and review routes, not final answers, public copy, or direct recommendations.',
        ['sourceLensStatus', 'humanReviewRoute', 'cannotYetSay'],
      ),
    ],
    inheritedFrames: inheritedFrames(),
    observationCandidates: observations,
    inferenceCandidate: {
      id: 'inf_manual_document_source_lens_kernel',
      text:
        'Manuals and long-form documents strengthen Axiom by adding source-role, currentness, chapter-map, tool-risk, and implementation-actor grounding while keeping public guidance and source/support validity blocked.',
      observationIds: observations.map((item) => item.id),
      principalPatternCandidateIds: ['L3-PIP-11', 'L3-PIP-12', 'L3-PIP-14', 'L3-PIP-21'],
      crossCuttingCheckIds: ['L3-CCA-23', 'L3-CCA-25', 'L3-CCA-27'],
      confidence: 'medium',
      statusLabel: 'provisional_not_reviewed',
    },
    counterHypothesis: [
      {
        id: 'counter_manual_document_currentness_or_jurisdiction_overclaim',
        text:
          'A manual or long-form document may be outdated, jurisdiction-specific, too general, or actor-misaligned; without chapter-role and source/currentness review it may mislead public guidance or support decisions.',
        wouldChange: [
          'actionability remains hold_or_research_needed',
          'manual/document corpus row cannot move to public page filling or recommendation',
        ],
        nextQuestionIds: missingIds,
      },
    ],
    missingContext: missing,
    implementationActorConditions: [
      {
        actor: 'public_or_institutional_actor',
        condition:
          'Document role, currentness, jurisdiction, and institutional scope must be checked before any public-facing use.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_manual_document_institution_001', 'mc_manual_document_source_lens_001'],
      },
      {
        actor: 'support_staff',
        condition:
          'Manual content must be translated into case-specific work-condition questions rather than copied as support guidance.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_manual_document_support_001', 'mc_manual_document_job_001'],
      },
      {
        actor: 'employer_manager',
        condition:
          'Workplace implementation conditions such as task, environment, timing, tool access, and evaluation context must be explicit.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_manual_document_environment_001', 'mc_manual_document_time_001'],
      },
      {
        actor: 'reviewer',
        condition:
          'Reviewer must block current-policy, legal, accommodation, source-validity, support-validity, and AI-tool overclaims.',
        requiredBeforeAction: true,
        missingContextIds: ['mc_manual_document_source_lens_001', 'mc_manual_document_institution_001'],
      },
    ] satisfies AxiomImplementationActorCondition[],
    sourceLensStatus: {
      respondent_data: sourceLensStatus(
        'respondent_data',
        'thin_or_missing',
        'Manual/document packet requires respondent contrast before support or work-condition use.',
      ),
      supporter_data: sourceLensStatus(
        'supporter_data',
        'thin_or_missing',
        'Supporter practice contrast is needed before manual/document content becomes implementation guidance.',
      ),
      external_evidence: sourceLensStatus(
        'external_evidence',
        'present_in_evidence_foundation_fixture',
        'Manual metadata, PDF objects, normalized manifest, L3, and FT03 are present as non-sensitive evidence foundation refs.',
      ),
      implementation_actor_conditions: sourceLensStatus(
        'implementation_actor_conditions',
        'present_in_evidence_foundation_fixture',
        'Actor conditions are explicit and review-routed.',
      ),
    },
    actionabilityBand: 'hold_or_research_needed' satisfies AxiomActionabilityBand,
    cannotYetSay: [
      'No medical, legal, employment, accommodation, or support validity finality is decided from manual/document evidence.',
      'No manual/document source is approved as current policy, legal advice, accommodation validity, support validity, or public guidance.',
      'No PDF text, source text, raw original, redacted text, or field value has been opened or exported.',
      'No public approval, runtime approval, candidate_pattern, publication, knowledge promotion, or learning update is granted.',
    ],
    targetReviewUnitCountCap: 100,
    movementBoundary: { ...UNCHANGED_MOVEMENT_BOUNDARY },
  };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function buildAxiomManualDocumentSourceFamilyAttachment(
  baseReadout: AxiomKernelCorpusWave2Readout = buildAxiomKernelCorpusWave2Readout(),
  sourceLedger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(),
): AxiomManualDocumentSourceFamilyAttachment {
  const packet = buildAxiomManualDocumentEvidencePacket();
  const batchRun = runAxiomRealDerivedEvidenceKernelBuildBatch([packet]);
  const buildRun = batchRun.runs[0];
  const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
    buildRun.buildGroundingPacket.kernel,
    MANUAL_DOCUMENT_SCENARIO,
  );

  return {
    attachmentId: 'axiom_manual_document_source_family_attachment_v0_2026_06_08',
    objectType: 'axiom_manual_document_source_family_attachment',
    contractVersion: AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_VERSION,
    lane: 'Falcon Lab',
    status: 'manual_document_packet_attached_to_kernel_corpus_pending_review',
    boundary: AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY,
    strengthensCore: [...AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES],
    baseReadoutId: baseReadout.readoutId,
    sourceLedgerId: sourceLedger.ledgerId,
    sourceFamilyEntryId: 'source_family_manuals_and_documents',
    basePacketCount: 14,
    manualDocumentPacketCount: 1,
    projectedCorpusPacketCount: 15,
    manualDocumentBatchRun: batchRun,
    evalReports: [evalReport],
    packetMapping: {
      sourceFamilyEntryId: 'source_family_manuals_and_documents',
      evidencePacketId: packet.packetId,
      buildGroundingPacketId: buildRun.buildGroundingPacket.packetId,
      kernelId: buildRun.buildGroundingPacket.kernel.kernelId,
      scenarioId: packet.scenarioId,
      status: 'prepared_as_derived_non_sensitive_packet_attached_to_corpus',
    },
    reviewUnitCount: batchRun.reviewUnitCompression.units.length,
    maxCoreHumanReviewUnits: 100,
    nextStepAfterAttachment: 'project_manual_document_packet_into_kernel_corpus_readout',
    notNow: [
      'no_raw_original_or_source_text_read',
      'no_pdf_text_export',
      'no_field_value_export',
      'no_source_or_support_validity_decision',
      'no_public_page_filling_from_unpromoted_kernel',
      'no_actual_public_navigation',
      'no_public_approval_or_publication',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...baseReadout.notNow,
    ],
  };
}

export function validateAxiomManualDocumentSourceFamilyAttachment(
  attachment: AxiomManualDocumentSourceFamilyAttachment,
  baseReadout: AxiomKernelCorpusWave2Readout = buildAxiomKernelCorpusWave2Readout(),
): AxiomManualDocumentSourceFamilyAttachmentValidation {
  const errors: string[] = [];
  const baseValidation = validateAxiomKernelCorpusWave2Readout(baseReadout);
  const run = attachment.manualDocumentBatchRun.runs[0];
  const evalReport = attachment.evalReports[0];

  pushIf(!baseValidation.valid, errors, 'base_wave2_readout_must_be_valid');
  pushIf(
    attachment.objectType !== 'axiom_manual_document_source_family_attachment',
    errors,
    'object_type_must_match_manual_document_attachment',
  );
  pushIf(
    attachment.contractVersion !== AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_VERSION,
    errors,
    'contract_version_must_match_manual_document_attachment_v0_2026_06_08',
  );
  pushIf(attachment.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    attachment.boundary !== AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY,
    errors,
    'boundary_must_remain_manual_document_attachment_not_public_guidance_or_validity',
  );
  pushIf(
    attachment.basePacketCount !== 14 ||
      attachment.manualDocumentPacketCount !== 1 ||
      attachment.projectedCorpusPacketCount !== 15,
    errors,
    'manual_document_attachment_must_project_15_total_kernel_items',
  );
  pushIf(
    attachment.sourceFamilyEntryId !== 'source_family_manuals_and_documents' ||
      attachment.packetMapping.sourceFamilyEntryId !== 'source_family_manuals_and_documents',
    errors,
    'manual_document_attachment_must_target_manuals_and_documents_source_family',
  );
  pushIf(
    attachment.manualDocumentBatchRun.packetCount !== 1 ||
      attachment.manualDocumentBatchRun.status !== 'passed_real_derived_non_sensitive_kernel_build_batch',
    errors,
    'manual_document_batch_must_build_one_passing_packet',
  );
  pushIf(!run || run.status !== 'passed_real_derived_non_sensitive_kernel_build', errors, 'manual_document_build_run_must_pass');
  pushIf(!evalReport || evalReport.status !== 'passes', errors, 'manual_document_eval_must_pass_l3_policy_service_scenario');
  pushIf(
    attachment.reviewUnitCount === 0 ||
      attachment.reviewUnitCount > attachment.maxCoreHumanReviewUnits,
    errors,
    'manual_document_review_units_must_exist_and_remain_under_100',
  );
  if (run) {
    pushIf(
      run.evidencePacket.dataPolicy.rawOriginalOpened ||
        run.evidencePacket.dataPolicy.sourceTextExported ||
        run.evidencePacket.dataPolicy.redactedTextExported ||
        run.evidencePacket.dataPolicy.fieldValueExported,
      errors,
      'manual_document_packet_must_not_open_or_export_raw_source_or_field_values',
    );
    pushIf(
      run.evidencePacket.movementBoundary.sourceValidity !== 'not_decided' ||
        run.evidencePacket.movementBoundary.supportValidity !== 'not_decided' ||
        run.evidencePacket.movementBoundary.publicApproved !== 'not_approved' ||
        run.evidencePacket.movementBoundary.runtimeApproved !== 'not_approved' ||
        run.evidencePacket.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
        run.evidencePacket.movementBoundary.knowledgePromotion !== 'not_promoted',
      errors,
      'manual_document_packet_must_not_move_validity_public_runtime_pattern_or_promotion',
    );
  }
  pushIf(
    !attachment.notNow.includes('no_source_or_support_validity_decision') ||
      !attachment.notNow.includes('no_public_approval_or_publication') ||
      !attachment.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !attachment.notNow.includes('no_learning_update'),
    errors,
    'manual_document_attachment_not_now_must_block_validity_public_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'manual_document_source_family_attachment_valid'
        : 'manual_document_source_family_attachment_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY,
    strengthensCore: [...AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES],
  };
}
