import {
  type AxiomActionabilityBand,
  type AxiomCoreProgressClass,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  runAxiomRealDataScaleUpIntegrationRun,
  validateAxiomRealDataScaleUpIntegrationRun,
  type AxiomRealDataScaleUpIntegrationRun,
} from './realDataScaleUpIntegrationRun';
import {
  buildAxiomSourceFamilyUtilizationLedger,
  validateAxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationGroup,
  type AxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationStatus,
} from './sourceFamilyUtilizationLedger';

export const AXIOM_KERNEL_CORPUS_READOUT_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY =
  'axiom_kernel_corpus_readout_is_internal_kernel_display_and_review_navigation_not_public_runtime_or_promotion' as const;

export const AXIOM_KERNEL_CORPUS_READOUT_CORE_PROGRESS_CLASSES = [
  'kernel_grounding',
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusReadoutItem = {
  itemId: string;
  packetId: string;
  groundingPacketId: string;
  scenarioId: string;
  kernelId: string;
  sourceFamilyEntryIds: string[];
  sourceFamilyGroups: AxiomSourceFamilyUtilizationGroup[];
  sourceFamilyStatuses: AxiomSourceFamilyUtilizationStatus[];
  sourceFoundationCount: number;
  evidenceSpanCount: number;
  groundedFields: AxiomKernelGroundedField[];
  inferenceCount: number;
  counterHypothesisCount: number;
  missingContextSlots: AxiomMissingContextSlot[];
  implementationActorCount: number;
  actionabilityBand: AxiomActionabilityBand;
  evalStatus: 'passes' | 'needs_repair';
  reviewUnitIds: string[];
  reviewRouteStatus:
    'compressed_framework_review_required_before_promotion';
  currentUseAllowed: 'internal_kernel_display_and_review_navigation_only';
  cannotYetSay: string[];
};

export type AxiomKernelCorpusSourceFamilyCoverage = {
  entryId: string;
  group: AxiomSourceFamilyUtilizationGroup;
  status: AxiomSourceFamilyUtilizationStatus;
  packetIds: string[];
  coverageRole:
    | 'integrated_kernel_grounding'
    | 'next_wave_kernel_grounding_candidate'
    | 'hold_until_packet_or_validity_work'
    | 'delivery_layer_not_core_truth';
};

export type AxiomKernelCorpusReviewNavigationUnit = {
  unitId: string;
  sourceUnitType: string;
  packetIds: string[];
  scenarioIds: string[];
  kernelFieldsInScope: AxiomKernelGroundedField[];
  reviewQuestion: string;
  routeStatus: 'human_review_required_before_promotion';
};

export type AxiomKernelCorpusReadout = {
  readoutId: string;
  objectType: 'axiom_kernel_corpus_readout';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_READOUT_VERSION;
  lane: 'Falcon Lab';
  status: 'stable_internal_kernel_corpus_readout_ready';
  boundary: typeof AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_READOUT_CORE_PROGRESS_CLASSES;
  sourceIntegrationRunId: string;
  sourceLedgerId: string;
  packetCount: number;
  scenarioCount: number;
  sourceFamilyEntryCount: number;
  reviewUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  corpusItems: AxiomKernelCorpusReadoutItem[];
  sourceFamilyCoverage: AxiomKernelCorpusSourceFamilyCoverage[];
  reviewNavigation: AxiomKernelCorpusReviewNavigationUnit[];
  nextWaveCandidateEntryIds: string[];
  aggregate: {
    groundedFieldCoverage: Record<AxiomKernelGroundedField, 'covered'>;
    evalPassingItemCount: number;
    integratedSourceFamilyCount: number;
    nextWaveSourceFamilyCount: number;
    deliveryLayerEntryCount: number;
  };
  notNow: string[];
};

export type AxiomKernelCorpusReadoutValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_readout_valid'
    | 'kernel_corpus_readout_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_READOUT_CORE_PROGRESS_CLASSES;
};

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function sourceFamilyCoverageRole(
  status: AxiomSourceFamilyUtilizationStatus,
): AxiomKernelCorpusSourceFamilyCoverage['coverageRole'] {
  if (status === 'integrated_in_axiom_scale_up_run') {
    return 'integrated_kernel_grounding';
  }
  if (
    status === 'partially_integrated_next_wave_candidate' ||
    status === 'manifest_ready_next_wave_candidate'
  ) {
    return 'next_wave_kernel_grounding_candidate';
  }
  if (status === 'delivery_layer_not_core_kernel') return 'delivery_layer_not_core_truth';

  return 'hold_until_packet_or_validity_work';
}

function allGroundedFieldsCovered(): Record<AxiomKernelGroundedField, 'covered'> {
  return Object.fromEntries(
    AXIOM_KERNEL_GROUNDED_FIELDS.map((field) => [field, 'covered']),
  ) as Record<AxiomKernelGroundedField, 'covered'>;
}

export function buildAxiomKernelCorpusReadout(
  integrationRun: AxiomRealDataScaleUpIntegrationRun = runAxiomRealDataScaleUpIntegrationRun(),
  sourceLedger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(
    integrationRun,
  ),
): AxiomKernelCorpusReadout {
  const evalByKernelId = new Map(
    integrationRun.evalReports.map((report) => [report.kernelId, report]),
  );
  const reviewUnits = integrationRun.reviewPromotionPacket.promotionUnits;
  const sourceFamilyCoverage = sourceLedger.entries.map((entry) => ({
    entryId: entry.entryId,
    group: entry.group,
    status: entry.status,
    packetIds: [...entry.relatedIntegratedPacketIds],
    coverageRole: sourceFamilyCoverageRole(entry.status),
  }));

  const corpusItems = integrationRun.integratedBatchRun.runs.map((run) => {
    const packet = run.evidencePacket;
    const kernel = run.buildGroundingPacket.kernel;
    const relatedSourceFamilies = sourceLedger.entries.filter((entry) =>
      entry.relatedIntegratedPacketIds.includes(packet.packetId),
    );
    const groundingPacketId = run.buildGroundingPacket.packetId;
    const itemReviewUnits = reviewUnits.filter((unit) =>
      unit.packetIds.includes(groundingPacketId),
    );
    const evalReport = evalByKernelId.get(kernel.kernelId);

    return {
      itemId: `corpus_item_${packet.packetId}`,
      packetId: packet.packetId,
      groundingPacketId,
      scenarioId: packet.scenarioId,
      kernelId: kernel.kernelId,
      sourceFamilyEntryIds: relatedSourceFamilies.map((entry) => entry.entryId),
      sourceFamilyGroups: unique(relatedSourceFamilies.map((entry) => entry.group)),
      sourceFamilyStatuses: unique(relatedSourceFamilies.map((entry) => entry.status)),
      sourceFoundationCount: packet.sourceFoundationRefs.length,
      evidenceSpanCount: packet.evidenceSpans.length,
      groundedFields: [...AXIOM_KERNEL_GROUNDED_FIELDS],
      inferenceCount: kernel.inference.length,
      counterHypothesisCount: kernel.counterHypothesis.length,
      missingContextSlots: unique(kernel.missingContext.map((context) => context.slot)),
      implementationActorCount: kernel.implementationActorConditions.length,
      actionabilityBand: kernel.actionabilityBand,
      evalStatus: evalReport?.status ?? 'needs_repair',
      reviewUnitIds: itemReviewUnits.map((unit) => unit.unitId),
      reviewRouteStatus: 'compressed_framework_review_required_before_promotion',
      currentUseAllowed: 'internal_kernel_display_and_review_navigation_only',
      cannotYetSay: [...kernel.cannotYetSay],
    } satisfies AxiomKernelCorpusReadoutItem;
  });

  const reviewNavigation = reviewUnits.map((unit) => ({
    unitId: unit.unitId,
    sourceUnitType: unit.sourceUnitType,
    packetIds: [...unit.packetIds],
    scenarioIds: [...unit.scenarioIds],
    kernelFieldsInScope: [...unit.kernelFieldsInScope],
    reviewQuestion: unit.reviewQuestion,
    routeStatus: 'human_review_required_before_promotion',
  })) satisfies AxiomKernelCorpusReviewNavigationUnit[];

  return {
    readoutId: 'axiom_kernel_corpus_readout_v0_2026_06_08',
    objectType: 'axiom_kernel_corpus_readout',
    contractVersion: AXIOM_KERNEL_CORPUS_READOUT_VERSION,
    lane: 'Falcon Lab',
    status: 'stable_internal_kernel_corpus_readout_ready',
    boundary: AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_READOUT_CORE_PROGRESS_CLASSES],
    sourceIntegrationRunId: integrationRun.runId,
    sourceLedgerId: sourceLedger.ledgerId,
    packetCount: integrationRun.integratedPacketCount,
    scenarioCount: integrationRun.integratedScenarioCount,
    sourceFamilyEntryCount: sourceLedger.entries.length,
    reviewUnitCount: integrationRun.hypothesisReviewCoverage.compressedReviewUnitCount,
    maxCoreHumanReviewUnits: 100,
    corpusItems,
    sourceFamilyCoverage,
    reviewNavigation,
    nextWaveCandidateEntryIds: [...sourceLedger.nextWaveRecommendation.recommendedEntryIds],
    aggregate: {
      groundedFieldCoverage: allGroundedFieldsCovered(),
      evalPassingItemCount: corpusItems.filter((item) => item.evalStatus === 'passes').length,
      integratedSourceFamilyCount: sourceFamilyCoverage.filter(
        (entry) => entry.coverageRole === 'integrated_kernel_grounding',
      ).length,
      nextWaveSourceFamilyCount: sourceFamilyCoverage.filter(
        (entry) => entry.coverageRole === 'next_wave_kernel_grounding_candidate',
      ).length,
      deliveryLayerEntryCount: sourceFamilyCoverage.filter(
        (entry) => entry.coverageRole === 'delivery_layer_not_core_truth',
      ).length,
    },
    notNow: [
      'no_public_page_filling_from_unpromoted_kernel',
      'no_actual_public_navigation',
      'no_public_approval_or_publication',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...integrationRun.notNow,
      ...sourceLedger.notNow,
    ],
  };
}

export function validateAxiomKernelCorpusReadout(
  readout: AxiomKernelCorpusReadout,
  integrationRun: AxiomRealDataScaleUpIntegrationRun = runAxiomRealDataScaleUpIntegrationRun(),
  sourceLedger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(
    integrationRun,
  ),
): AxiomKernelCorpusReadoutValidation {
  const errors: string[] = [];
  const integrationValidation = validateAxiomRealDataScaleUpIntegrationRun(integrationRun);
  const ledgerValidation = validateAxiomSourceFamilyUtilizationLedger(sourceLedger);
  const requiredGroups = new Set(sourceLedger.requiredGroups);
  const coverageGroups = new Set(readout.sourceFamilyCoverage.map((entry) => entry.group));
  const itemPacketIds = new Set(readout.corpusItems.map((item) => item.packetId));
  const expectedPacketIds = integrationRun.integratedBatchRun.runs.map(
    (run) => run.evidencePacket.packetId,
  );

  pushIf(!integrationValidation.valid, errors, 'source_integration_run_must_be_valid');
  pushIf(!ledgerValidation.valid, errors, 'source_family_ledger_must_be_valid');
  pushIf(readout.objectType !== 'axiom_kernel_corpus_readout', errors, 'object_type_must_match');
  pushIf(
    readout.contractVersion !== AXIOM_KERNEL_CORPUS_READOUT_VERSION,
    errors,
    'contract_version_must_match_kernel_corpus_readout_v0_2026_06_08',
  );
  pushIf(readout.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    readout.boundary !== AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY,
    errors,
    'boundary_must_remain_internal_display_not_public_runtime_or_promotion',
  );
  pushIf(
    readout.packetCount !== 8 ||
      readout.scenarioCount !== 5 ||
      readout.corpusItems.length !== expectedPacketIds.length,
    errors,
    'readout_must_cover_integrated_8_packet_5_scenario_run',
  );
  pushIf(
    readout.reviewUnitCount > 100 || readout.maxCoreHumanReviewUnits !== 100,
    errors,
    'readout_review_units_must_remain_under_100',
  );
  for (const packetId of expectedPacketIds) {
    pushIf(!itemPacketIds.has(packetId), errors, `missing_corpus_item_for_packet:${packetId}`);
  }
  for (const group of requiredGroups) {
    pushIf(!coverageGroups.has(group), errors, `missing_source_family_coverage_group:${group}`);
  }
  for (const item of readout.corpusItems) {
    pushIf(item.sourceFamilyEntryIds.length === 0, errors, `item_missing_source_family:${item.itemId}`);
    pushIf(item.reviewUnitIds.length === 0, errors, `item_missing_review_navigation:${item.itemId}`);
    pushIf(item.evalStatus !== 'passes', errors, `item_eval_must_pass:${item.itemId}`);
    for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
      pushIf(
        !item.groundedFields.includes(field),
        errors,
        `item_missing_grounded_field:${item.itemId}:${field}`,
      );
    }
    pushIf(
      item.currentUseAllowed !== 'internal_kernel_display_and_review_navigation_only',
      errors,
      `item_must_remain_internal_use_only:${item.itemId}`,
    );
  }
  pushIf(
    readout.aggregate.deliveryLayerEntryCount !== 1 ||
      !readout.sourceFamilyCoverage.some(
        (entry) =>
          entry.group === 'falcon_heron_delivery_layer' &&
          entry.coverageRole === 'delivery_layer_not_core_truth',
      ),
    errors,
    'falcon_heron_delivery_must_remain_delivery_layer_not_core_truth',
  );
  pushIf(
    !readout.notNow.includes('no_public_page_filling_from_unpromoted_kernel') ||
      !readout.notNow.includes('no_source_or_support_validity_decision') ||
      !readout.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !readout.notNow.includes('no_learning_update'),
    errors,
    'readout_not_now_must_block_public_validity_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_readout_valid'
        : 'kernel_corpus_readout_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_READOUT_CORE_PROGRESS_CLASSES],
  };
}
