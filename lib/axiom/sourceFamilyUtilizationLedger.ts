import {
  type AxiomCoreProgressClass,
  type AxiomSourceLens,
} from './interactionHypothesisKernelContract';
import {
  runAxiomRealDataScaleUpIntegrationRun,
  type AxiomRealDataScaleUpIntegrationRun,
} from './realDataScaleUpIntegrationRun';

export const AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY =
  'axiom_source_family_utilization_ledger_tracks_evidence_coverage_for_kernel_grounding_not_source_validity_public_or_runtime' as const;

export const AXIOM_SOURCE_FAMILY_UTILIZATION_CORE_PROGRESS_CLASSES = [
  'kernel_grounding',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomSourceFamilyUtilizationStatus =
  | 'integrated_in_axiom_scale_up_run'
  | 'partially_integrated_next_wave_candidate'
  | 'manifest_ready_next_wave_candidate'
  | 'hold_until_derived_non_sensitive_packet'
  | 'hold_until_currentness_or_source_validity_review'
  | 'delivery_layer_not_core_kernel';

export type AxiomSourceFamilyUtilizationGroup =
  | 'respondent_survey'
  | 'supporter_data'
  | 'workplace_data'
  | 'workshop_practice_knowledge'
  | 'manual_or_document'
  | 'domestic_web_cache'
  | 'international_web_cache'
  | 'historical_2001_abc'
  | 'stage1_scima_fchma_derived'
  | 'l3_ft03_review_frame'
  | 'falcon_heron_delivery_layer';

export type AxiomSourceFamilyUtilizationLedgerEntry = {
  entryId: string;
  group: AxiomSourceFamilyUtilizationGroup;
  displayName: string;
  status: AxiomSourceFamilyUtilizationStatus;
  sourceLensContribution: AxiomSourceLens[];
  sourceUris: string[];
  knownScale: string;
  currentAxiomUse: string;
  nextAxiomUse: string;
  holdReason: string[];
  relatedIntegratedPacketIds: string[];
  targetKernelFields: Array<
    | 'observation'
    | 'inference'
    | 'counterHypothesis'
    | 'missingContext'
    | 'implementationActorConditions'
    | 'sourceLensStatus'
    | 'actionabilityBand'
    | 'cannotYetSay'
    | 'humanReviewRoute'
  >;
  noRawOrPromotionBoundary: {
    rawOriginalOpened: false;
    sourceTextExported: false;
    redactedTextExported: false;
    fieldValueExported: false;
    sourceSupportValidityDecision: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    learningUpdate: 'not_promoted';
  };
};

export type AxiomSourceFamilyUtilizationLedger = {
  ledgerId: string;
  objectType: 'axiom_source_family_utilization_ledger';
  contractVersion: typeof AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_VERSION;
  lane: 'Falcon Lab';
  status: 'source_family_utilization_ledger_ready';
  boundary: typeof AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY;
  strengthensCore: typeof AXIOM_SOURCE_FAMILY_UTILIZATION_CORE_PROGRESS_CLASSES;
  sourceIntegrationRunId: string;
  integratedPacketCount: number;
  integratedScenarioCount: number;
  compressedReviewUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  entries: AxiomSourceFamilyUtilizationLedgerEntry[];
  requiredGroups: AxiomSourceFamilyUtilizationGroup[];
  summary: {
    totalEntries: number;
    integratedEntries: number;
    nextWaveCandidateEntries: number;
    holdEntries: number;
    deliveryLayerEntries: number;
  };
  nextWaveRecommendation: {
    waveId: 'axiom_source_family_scale_up_wave_2_candidate';
    purpose: 'cover_unintegrated_survey_workshop_2001abc_and_international_web_cache_without_raw_or_public_movement';
    recommendedEntryIds: string[];
    blockedUntil: string[];
  };
  notNow: string[];
};

export type AxiomSourceFamilyUtilizationLedgerValidation = {
  valid: boolean;
  validationStatus:
    | 'source_family_utilization_ledger_valid'
    | 'source_family_utilization_ledger_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY;
  strengthensCore: typeof AXIOM_SOURCE_FAMILY_UTILIZATION_CORE_PROGRESS_CLASSES;
};

const TARGET_KERNEL_FIELDS: AxiomSourceFamilyUtilizationLedgerEntry['targetKernelFields'] = [
  'observation',
  'inference',
  'counterHypothesis',
  'missingContext',
  'implementationActorConditions',
  'sourceLensStatus',
  'actionabilityBand',
  'cannotYetSay',
  'humanReviewRoute',
];

const REQUIRED_GROUPS: AxiomSourceFamilyUtilizationGroup[] = [
  'respondent_survey',
  'supporter_data',
  'workplace_data',
  'workshop_practice_knowledge',
  'manual_or_document',
  'domestic_web_cache',
  'international_web_cache',
  'historical_2001_abc',
  'stage1_scima_fchma_derived',
  'l3_ft03_review_frame',
  'falcon_heron_delivery_layer',
];

function boundary() {
  return {
    rawOriginalOpened: false,
    sourceTextExported: false,
    redactedTextExported: false,
    fieldValueExported: false,
    sourceSupportValidityDecision: 'not_decided',
    candidatePattern: 'not_candidate_pattern',
    runtimeApproved: 'not_approved',
    publicApproved: 'not_approved',
    learningUpdate: 'not_promoted',
  } as const;
}

function entry(
  input: Omit<
    AxiomSourceFamilyUtilizationLedgerEntry,
    'targetKernelFields' | 'noRawOrPromotionBoundary'
  >,
): AxiomSourceFamilyUtilizationLedgerEntry {
  return {
    ...input,
    targetKernelFields: [...TARGET_KERNEL_FIELDS],
    noRawOrPromotionBoundary: boundary(),
  };
}

function integratedPacketIds(run: AxiomRealDataScaleUpIntegrationRun) {
  return run.integratedBatchRun.runs.map((buildRun) => buildRun.evidencePacket.packetId);
}

function buildEntries(
  run: AxiomRealDataScaleUpIntegrationRun,
): AxiomSourceFamilyUtilizationLedgerEntry[] {
  const packetIds = integratedPacketIds(run);
  const hasPacket = (fragment: string) =>
    packetIds.filter((packetId) => packetId.includes(fragment));

  return [
    entry({
      entryId: 'source_family_respondent_surveys_3000_4000',
      group: 'respondent_survey',
      displayName: 'Employment survey 3000 / nanbyo survey 4000 respondent datasets',
      status: 'partially_integrated_next_wave_candidate',
      sourceLensContribution: ['respondent_data'],
      sourceUris: [
        'data/specs/source-manifests/employment_survey_3000.source-manifest.json',
        'data/specs/source-manifests/nanbyo_survey_4000.source-manifest.json',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-source-inventory-and-contact-candidates-v0-2026-05-18.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.md',
      ],
      knownScale:
        'source inventory lists nanbyo_survey_4000 respondent 4523 and employment_survey_3000 respondent 4553, plus 36542 and 15068 non-identifying narrative units.',
      currentAxiomUse:
        'CR01 and CR02-CR05 derived readings are integrated as non-sensitive respondent-lens packets in the 8-packet scale-up run.',
      nextAxiomUse:
        'Wave 2 should connect source manifests and coverage audit to a respondent-survey coverage packet, without opening raw originals or field values.',
      holdReason: [
        'raw survey files and original free text remain outside this Axiom run',
        'source/support validity and representativeness are not decided',
      ],
      relatedIntegratedPacketIds: [
        ...hasPacket('cr01_health_time'),
        ...hasPacket('stage1_remaining_context'),
      ],
    }),
    entry({
      entryId: 'source_family_supporter_practice',
      group: 'supporter_data',
      displayName: 'Supporter practice datasets and FT-Codex supporter readings',
      status: 'partially_integrated_next_wave_candidate',
      sourceLensContribution: ['supporter_data', 'implementation_actor_conditions'],
      sourceUris: [
        'data/specs/source-manifests/supporter_practice_nanbyo.source-manifest.json',
        'data/specs/source-manifests/supporter_practice_toku18.source-manifest.json',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23-summary.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23-summary.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
      ],
      knownScale:
        'source inventory lists supporter_practice_nanbyo 208 records / 664 units and supporter_practice_toku18 600 records / 1701 units.',
      currentAxiomUse:
        'FT-Codex-03 supporter/workplace quality and network reconnection packets are integrated; FT-Codex-01/02 remain next-wave candidates.',
      nextAxiomUse:
        'Add a supporter-continuity packet from FT-Codex-01/02 to thicken C03/C04/C06 without treating support presence as support validity.',
      holdReason: [
        'supporter intention, referral, meeting, or network naming must not become support validity',
      ],
      relatedIntegratedPacketIds: [
        ...hasPacket('ftcodex03_supporter_workplace'),
        ...hasPacket('ftcodex03_network'),
      ],
    }),
    entry({
      entryId: 'source_family_workplace_surveys',
      group: 'workplace_data',
      displayName: 'Nanbyo workplace 2022/2023 and workplace-side derived readings',
      status: 'partially_integrated_next_wave_candidate',
      sourceLensContribution: ['implementation_actor_conditions', 'supporter_data'],
      sourceUris: [
        'data/specs/source-manifests/nanbyo_workplace_2022_2023.source-manifest.json',
        'data/specs/source-manifests/nanbyo_workplace_2022_2023_web_raw0324.source-manifest.json',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
      ],
      knownScale:
        'source inventory lists nanbyo_workplace_2022_2023 and web_raw0324 as 750 records / 1448 units each.',
      currentAxiomUse:
        'Workplace contact and network reconnection are integrated through FT-Codex-03 packets.',
      nextAxiomUse:
        'Add a workplace-contact packet focused on task, safety, staffing, customer, commute, absence substitution, and information format.',
      holdReason: [
        'workplace concern must not become person ability judgment or employer validity judgment',
      ],
      relatedIntegratedPacketIds: [
        ...hasPacket('ftcodex03_supporter_workplace'),
        ...hasPacket('ftcodex03_network'),
      ],
    }),
    entry({
      entryId: 'source_family_workshop_practice_knowledge',
      group: 'workshop_practice_knowledge',
      displayName: 'Workshop practice knowledge',
      status: 'manifest_ready_next_wave_candidate',
      sourceLensContribution: ['supporter_data', 'implementation_actor_conditions'],
      sourceUris: [
        'references/workshops/難病就労支援_相互作用パターン分析と連携設計.md',
        'references/workshops/HW好事例再整理.md',
        'references/workshops/【分析】障害者就労支援_連携ポイント整理.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-source-inventory-and-contact-candidates-v0-2026-05-18.md',
      ],
      knownScale: 'source inventory lists workshop family as 3 files.',
      currentAxiomUse:
        'Workshop signals are indirectly present through FT-Codex-03 summary/network reconnection but not yet as a dedicated packet.',
      nextAxiomUse:
        'Add a workshop actor-map / sequence-gap packet for C03/C04/C05/C08 review navigation.',
      holdReason: [
        'workshop fragments can reveal actor maps and sequence gaps but cannot support prevalence or public-ready claims',
      ],
      relatedIntegratedPacketIds: hasPacket('ftcodex03_network'),
    }),
    entry({
      entryId: 'source_family_manuals_and_documents',
      group: 'manual_or_document',
      displayName: 'Manuals and long-form documents',
      status: 'hold_until_derived_non_sensitive_packet',
      sourceLensContribution: ['external_evidence', 'implementation_actor_conditions'],
      sourceUris: [
        'references/documents/mhlw-treatment-work-mental-manual-2026.pdf',
        'references/documents/mhlw-treatment-work-mental-manual-2026.meta.json',
        'references/documents/2026+Resource_Disability+Inclusive+AI_Remediated.pdf',
        'references/index/normalized-manifest.json',
      ],
      knownScale:
        'normalized manifest lists 13 PDFs and 4150 guideline records including MHLW and Disability:IN materials.',
      currentAxiomUse:
        'Manual/document families are not directly packetized in the current 8-packet Axiom run.',
      nextAxiomUse:
        'Create derived chapter-level packets only after local preprocessing and currentness/source-role separation.',
      holdReason: [
        'long documents require chapter maps and content hashes before kernel packetization',
        'manuals cannot become current policy or public guidance without review',
      ],
      relatedIntegratedPacketIds: [],
    }),
    entry({
      entryId: 'source_family_domestic_web_cache',
      group: 'domestic_web_cache',
      displayName: 'Domestic official / quasi-official web-cache',
      status: 'integrated_in_axiom_scale_up_run',
      sourceLensContribution: ['external_evidence', 'implementation_actor_conditions'],
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md',
      ],
      knownScale:
        'web-cache audit lists 780 local txt sources, 32 source families, and domestic JEED/MHLW/NIVR source families; batch2 covers 279 official/semi-official sources.',
      currentAxiomUse:
        'JEED batch1 and official underread batch2 are integrated as external-evidence packets for policy/service, disclosure/procedure, and source-lens coordination.',
      nextAxiomUse:
        'If needed, add a P0 unintegrated Japan official/research packet using source cards only, without source text export.',
      holdReason: [
        'MHLW/e-Gov/JEED/NIVR currentness and public claims require live verification and human review',
      ],
      relatedIntegratedPacketIds: [
        ...hasPacket('jeed_policy_service'),
        ...hasPacket('jeed_disclosure'),
        ...hasPacket('web_cache_batch2'),
      ],
    }),
    entry({
      entryId: 'source_family_international_web_cache',
      group: 'international_web_cache',
      displayName: 'International web-cache: AskEARN, JAN, Australia, Canada, EU, Germany, UK',
      status: 'manifest_ready_next_wave_candidate',
      sourceLensContribution: ['external_evidence', 'implementation_actor_conditions'],
      sourceUris: [
        'references/index/normalized-manifest.json',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.md',
      ],
      knownScale:
        'normalized manifest lists US 259, AU 24, CA 20, EU 3, DE 28, and UK 27 records; web-cache audit identifies AskEARN, JAN, JobAccess, Canada, EU, Germany, and UK source families.',
      currentAxiomUse:
        'International web-cache is held as source-family boundary/comparison material and is not yet integrated into the 8-packet Axiom kernel run.',
      nextAxiomUse:
        'Add a jurisdiction-contrast packet for same-structure/different-jurisdiction counter-hypothesis, not Japanese legal or accommodation guidance.',
      holdReason: [
        'foreign guidance cannot be imported as Japan current policy, legal judgment, or support validity',
      ],
      relatedIntegratedPacketIds: [],
    }),
    entry({
      entryId: 'source_family_historical_2001_abc',
      group: 'historical_2001_abc',
      displayName: '2001 ABC linked HR / supervisor / disabled employee perspectives',
      status: 'manifest_ready_next_wave_candidate',
      sourceLensContribution: [
        'respondent_data',
        'supporter_data',
        'implementation_actor_conditions',
      ],
      sourceUris: [
        'data/specs/source-manifests/2001_ABC_survey.source-manifest.json',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-2001-abc-codex-chat-expert-use-overlay-v0-2026-05-23.md',
      ],
      knownScale:
        'L1 audit treats 2001 ABC as linked HR/personnel, workplace supervisor, and disabled employee perspectives with historical constraints.',
      currentAxiomUse:
        '2001 ABC is not yet directly integrated into the 8-packet Axiom run.',
      nextAxiomUse:
        'Add a triadic source-lens packet for person/workplace/HR view differences, especially C03-C06-C07 and C04 information participation.',
      holdReason: [
        'historical 2001 patterns cannot be generalized to current policy or rare disease contexts without review',
      ],
      relatedIntegratedPacketIds: [],
    }),
    entry({
      entryId: 'source_family_stage1_scima_fchma_derived',
      group: 'stage1_scima_fchma_derived',
      displayName: 'Stage 1 SCIMA/FCHMA derived kernel artifacts',
      status: 'integrated_in_axiom_scale_up_run',
      sourceLensContribution: [
        'respondent_data',
        'supporter_data',
        'external_evidence',
        'implementation_actor_conditions',
      ],
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-core-expert-kernel-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-core-scientific-findings-v0-2026-05-26.md',
      ],
      knownScale:
        'Stage 1 contains core route, mechanism, source-lens, L2/L3, and review artifacts across the derived directory.',
      currentAxiomUse:
        'Stage 1 derived readings and network reconnections are the main bootstrap evidence foundation for the current Axiom run.',
      nextAxiomUse:
        'Use this family as the backbone for the stable Axiom kernel corpus/readout object.',
      holdReason: [
        'Stage 1 derived artifacts remain bootstrap priors requiring Axiom eval and review before promotion',
      ],
      relatedIntegratedPacketIds: packetIds,
    }),
    entry({
      entryId: 'source_family_l3_ft03_review_frames',
      group: 'l3_ft03_review_frame',
      displayName: 'L3 21 views / FT03 internal expert-agent response contract / review frames',
      status: 'integrated_in_axiom_scale_up_run',
      sourceLensContribution: ['external_evidence', 'implementation_actor_conditions'],
      sourceUris: [
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
        'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft03-internal-expert-agent-response-contract-v0-2026-05-25.md',
        'data/specs/quality/falcon_expert_agent.core_eval_profile-v0-2026-06-07.json',
      ],
      knownScale:
        'L3 provides 21 principal interaction patterns and 6 cross-cutting checks; FT03 provides response discipline and review/promotion brakes.',
      currentAxiomUse:
        'Every Axiom packet is evaluated against L3/FT03-derived scenario checks and review-compression units.',
      nextAxiomUse:
        'Keep as review-frame and eval backbone; do not convert directly into public page truth.',
      holdReason: [
        'L3/FT03 are review/eval frames, not source/support validity or public approval',
      ],
      relatedIntegratedPacketIds: packetIds,
    }),
    entry({
      entryId: 'source_family_falcon_heron_delivery_artifacts',
      group: 'falcon_heron_delivery_layer',
      displayName: 'Falcon / Heron public pages, SNS, and delivery artifacts',
      status: 'delivery_layer_not_core_kernel',
      sourceLensContribution: ['external_evidence'],
      sourceUris: [
        'PLANS.md',
        'docs/nbl-workspace/axiom-next-nbl-site-completion-roadmap-v0-2026-06-07.md',
        'references/social/falcon-nextbeinglab-social-ops-dashboard-v0-2026-06-03.md',
      ],
      knownScale:
        'Falcon/Heron delivery artifacts include public skeletons, internal previews, SNS operation ledgers, and campaign assets.',
      currentAxiomUse:
        'Delivery artifacts are not treated as Axiom core truth; they may later receive kernel-backed content after review.',
      nextAxiomUse:
        'Use only as surface/navigation constraints after kernel corpus and review routes are stable.',
      holdReason: [
        'public pages and SNS progress are delivery_layer_not_core_kernel unless they strengthen kernel build, eval, grounding, display, or human review loop',
      ],
      relatedIntegratedPacketIds: [],
    }),
  ];
}

function summarize(entries: AxiomSourceFamilyUtilizationLedgerEntry[]) {
  return {
    totalEntries: entries.length,
    integratedEntries: entries.filter((entry) => entry.status === 'integrated_in_axiom_scale_up_run')
      .length,
    nextWaveCandidateEntries: entries.filter(
      (entry) =>
        entry.status === 'partially_integrated_next_wave_candidate' ||
        entry.status === 'manifest_ready_next_wave_candidate',
    ).length,
    holdEntries: entries.filter(
      (entry) =>
        entry.status === 'hold_until_derived_non_sensitive_packet' ||
        entry.status === 'hold_until_currentness_or_source_validity_review',
    ).length,
    deliveryLayerEntries: entries.filter(
      (entry) => entry.status === 'delivery_layer_not_core_kernel',
    ).length,
  };
}

export function buildAxiomSourceFamilyUtilizationLedger(
  integrationRun: AxiomRealDataScaleUpIntegrationRun = runAxiomRealDataScaleUpIntegrationRun(),
): AxiomSourceFamilyUtilizationLedger {
  const entries = buildEntries(integrationRun);

  return {
    ledgerId: 'axiom_source_family_utilization_ledger_v0_2026_06_08',
    objectType: 'axiom_source_family_utilization_ledger',
    contractVersion: AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_VERSION,
    lane: 'Falcon Lab',
    status: 'source_family_utilization_ledger_ready',
    boundary: AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY,
    strengthensCore: [...AXIOM_SOURCE_FAMILY_UTILIZATION_CORE_PROGRESS_CLASSES],
    sourceIntegrationRunId: integrationRun.runId,
    integratedPacketCount: integrationRun.integratedPacketCount,
    integratedScenarioCount: integrationRun.integratedScenarioCount,
    compressedReviewUnitCount:
      integrationRun.hypothesisReviewCoverage.compressedReviewUnitCount,
    maxCoreHumanReviewUnits: 100,
    entries,
    requiredGroups: [...REQUIRED_GROUPS],
    summary: summarize(entries),
    nextWaveRecommendation: {
      waveId: 'axiom_source_family_scale_up_wave_2_candidate',
      purpose:
        'cover_unintegrated_survey_workshop_2001abc_and_international_web_cache_without_raw_or_public_movement',
      recommendedEntryIds: [
        'source_family_respondent_surveys_3000_4000',
        'source_family_supporter_practice',
        'source_family_workplace_surveys',
        'source_family_workshop_practice_knowledge',
        'source_family_historical_2001_abc',
        'source_family_international_web_cache',
      ],
      blockedUntil: [
        'derived_non_sensitive_packet_spec_exists_for_each_wave_2_family',
        'raw_original_or_source_text_export_is_not_required',
        'source_support_validity_public_currentness_runtime_and_learning_remain_unmoved',
      ],
    },
    notNow: [
      'no_raw_original_or_redacted_text_ingestion',
      'no_source_text_or_field_value_export',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_public_approval_or_publication',
      'no_learning_update',
      'no_delivery_artifact_as_axiom_core_truth',
      ...integrationRun.notNow,
    ],
  };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function validateAxiomSourceFamilyUtilizationLedger(
  ledger: AxiomSourceFamilyUtilizationLedger,
): AxiomSourceFamilyUtilizationLedgerValidation {
  const errors: string[] = [];
  const entryIds = new Set<string>();
  const groups = new Set(ledger.entries.map((entry) => entry.group));

  pushIf(
    ledger.objectType !== 'axiom_source_family_utilization_ledger',
    errors,
    'object_type_must_be_axiom_source_family_utilization_ledger',
  );
  pushIf(
    ledger.contractVersion !== AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_VERSION,
    errors,
    'contract_version_must_match_source_family_utilization_ledger_v0_2026_06_08',
  );
  pushIf(ledger.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    ledger.boundary !== AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY,
    errors,
    'boundary_must_remain_coverage_not_validity_public_or_runtime',
  );
  pushIf(
    ledger.integratedPacketCount < 8 || ledger.integratedScenarioCount !== 5,
    errors,
    'ledger_must_anchor_to_integrated_8_packet_5_scenario_run',
  );
  pushIf(
    ledger.compressedReviewUnitCount > 100 ||
      ledger.maxCoreHumanReviewUnits !== 100,
    errors,
    'ledger_review_units_must_remain_under_100',
  );

  for (const group of REQUIRED_GROUPS) {
    pushIf(!groups.has(group), errors, `required_source_family_group_missing:${group}`);
  }

  for (const entry of ledger.entries) {
    pushIf(entryIds.has(entry.entryId), errors, `duplicate_entry_id:${entry.entryId}`);
    entryIds.add(entry.entryId);
    pushIf(entry.sourceUris.length === 0, errors, `source_uris_required:${entry.entryId}`);
    pushIf(
      entry.sourceLensContribution.length === 0,
      errors,
      `source_lens_contribution_required:${entry.entryId}`,
    );
    pushIf(
      entry.targetKernelFields.length !== TARGET_KERNEL_FIELDS.length,
      errors,
      `target_kernel_fields_must_cover_all_required_fields:${entry.entryId}`,
    );
    pushIf(
      entry.noRawOrPromotionBoundary.rawOriginalOpened !== false ||
        entry.noRawOrPromotionBoundary.sourceTextExported !== false ||
        entry.noRawOrPromotionBoundary.redactedTextExported !== false ||
        entry.noRawOrPromotionBoundary.fieldValueExported !== false,
      errors,
      `entry_must_not_open_or_export_raw_source_or_field_values:${entry.entryId}`,
    );
    pushIf(
      entry.noRawOrPromotionBoundary.sourceSupportValidityDecision !== 'not_decided' ||
        entry.noRawOrPromotionBoundary.candidatePattern !== 'not_candidate_pattern' ||
        entry.noRawOrPromotionBoundary.runtimeApproved !== 'not_approved' ||
        entry.noRawOrPromotionBoundary.publicApproved !== 'not_approved' ||
        entry.noRawOrPromotionBoundary.learningUpdate !== 'not_promoted',
      errors,
      `entry_must_not_move_validity_candidate_runtime_public_or_learning:${entry.entryId}`,
    );
  }

  for (const requiredEntryId of ledger.nextWaveRecommendation.recommendedEntryIds) {
    pushIf(
      !entryIds.has(requiredEntryId),
      errors,
      `next_wave_recommended_entry_missing:${requiredEntryId}`,
    );
  }
  pushIf(
    !ledger.notNow.includes('no_delivery_artifact_as_axiom_core_truth') ||
      !ledger.notNow.includes('no_source_or_support_validity_decision') ||
      !ledger.notNow.includes('no_public_approval_or_publication') ||
      !ledger.notNow.includes('no_learning_update'),
    errors,
    'ledger_not_now_must_block_delivery_truth_validity_publication_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'source_family_utilization_ledger_valid'
        : 'source_family_utilization_ledger_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY,
    strengthensCore: [...AXIOM_SOURCE_FAMILY_UTILIZATION_CORE_PROGRESS_CLASSES],
  };
}
