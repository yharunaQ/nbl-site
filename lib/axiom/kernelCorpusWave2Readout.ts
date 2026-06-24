import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  buildAxiomKernelCorpusReadout,
  validateAxiomKernelCorpusReadout,
  type AxiomKernelCorpusReadout,
  type AxiomKernelCorpusReadoutItem,
} from './kernelCorpusReadout';
import {
  AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES,
  buildAxiomSourceFamilyScaleUpWave2Attachment,
  validateAxiomSourceFamilyScaleUpWave2Attachment,
  type AxiomSourceFamilyScaleUpWave2Attachment,
} from './sourceFamilyScaleUpWave2';
import {
  type AxiomCoreProgressClass,
} from './interactionHypothesisKernelContract';

export const AXIOM_KERNEL_CORPUS_WAVE2_READOUT_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY =
  'axiom_kernel_corpus_wave2_readout_projects_validated_wave2_packets_into_internal_corpus_not_public_runtime_or_promotion' as const;

export const AXIOM_KERNEL_CORPUS_WAVE2_READOUT_CORE_PROGRESS_CLASSES = [
  ...AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_CORE_PROGRESS_CLASSES,
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusWave2CoverageUpdate = {
  sourceFamilyEntryId: string;
  evidencePacketId: string;
  buildGroundingPacketId: string;
  priorCoverageRole: 'next_wave_kernel_grounding_candidate';
  projectedCoverageRole: 'wave2_integrated_kernel_grounding_pending_review';
};

export type AxiomKernelCorpusWave2Readout = {
  readoutId: string;
  objectType: 'axiom_kernel_corpus_wave2_expanded_readout';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_WAVE2_READOUT_VERSION;
  lane: 'Falcon Lab';
  status: 'expanded_internal_kernel_corpus_readout_ready';
  boundary: typeof AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_WAVE2_READOUT_CORE_PROGRESS_CLASSES;
  baseReadoutId: string;
  wave2AttachmentId: string;
  basePacketCount: number;
  wave2PacketCount: number;
  totalPacketCount: number;
  scenarioCount: number;
  totalReviewNavigationUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  corpusItems: AxiomKernelCorpusReadoutItem[];
  wave2CoverageUpdates: AxiomKernelCorpusWave2CoverageUpdate[];
  aggregate: {
    groundedFieldCoverage: Record<AxiomKernelGroundedField, 'covered'>;
    evalPassingItemCount: number;
    internalDisplayOnlyItemCount: number;
    wave2IntegratedFamilyCount: number;
  };
  notNow: string[];
};

export type AxiomKernelCorpusWave2ReadoutValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_wave2_readout_valid'
    | 'kernel_corpus_wave2_readout_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_WAVE2_READOUT_CORE_PROGRESS_CLASSES;
};

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function groundedFieldCoverage(): Record<AxiomKernelGroundedField, 'covered'> {
  return Object.fromEntries(
    AXIOM_KERNEL_GROUNDED_FIELDS.map((field) => [field, 'covered']),
  ) as Record<AxiomKernelGroundedField, 'covered'>;
}

function buildWave2CorpusItems(
  attachment: AxiomSourceFamilyScaleUpWave2Attachment,
): AxiomKernelCorpusReadoutItem[] {
  const mappingsByPacketId = new Map(
    attachment.packetMappings.map((mapping) => [mapping.evidencePacketId, mapping]),
  );
  const evalByKernelId = new Map(attachment.evalReports.map((report) => [report.kernelId, report]));

  return attachment.wave2BatchRun.runs.map((run) => {
    const packet = run.evidencePacket;
    const kernel = run.buildGroundingPacket.kernel;
    const mapping = mappingsByPacketId.get(packet.packetId);
    const groundingPacketId = run.buildGroundingPacket.packetId;
    const reviewUnitIds = attachment.wave2BatchRun.reviewUnitCompression.units
      .filter((unit) => unit.packetIds.includes(groundingPacketId))
      .map((unit) => unit.unitId);

    if (!mapping) throw new Error(`wave2_corpus_mapping_missing:${packet.packetId}`);

    return {
      itemId: `wave2_corpus_item_${packet.packetId}`,
      packetId: packet.packetId,
      groundingPacketId,
      scenarioId: packet.scenarioId,
      kernelId: kernel.kernelId,
      sourceFamilyEntryIds: [mapping.sourceFamilyEntryId],
      sourceFamilyGroups: [mapping.sourceFamilyGroup],
      sourceFamilyStatuses: ['manifest_ready_next_wave_candidate'],
      sourceFoundationCount: packet.sourceFoundationRefs.length,
      evidenceSpanCount: packet.evidenceSpans.length,
      groundedFields: [...AXIOM_KERNEL_GROUNDED_FIELDS],
      inferenceCount: kernel.inference.length,
      counterHypothesisCount: kernel.counterHypothesis.length,
      missingContextSlots: unique(kernel.missingContext.map((context) => context.slot)),
      implementationActorCount: kernel.implementationActorConditions.length,
      actionabilityBand: kernel.actionabilityBand,
      evalStatus: evalByKernelId.get(kernel.kernelId)?.status ?? 'needs_repair',
      reviewUnitIds,
      reviewRouteStatus: 'compressed_framework_review_required_before_promotion',
      currentUseAllowed: 'internal_kernel_display_and_review_navigation_only',
      cannotYetSay: [...kernel.cannotYetSay],
    };
  });
}

export function buildAxiomKernelCorpusWave2Readout(
  baseReadout: AxiomKernelCorpusReadout = buildAxiomKernelCorpusReadout(),
  attachment: AxiomSourceFamilyScaleUpWave2Attachment = buildAxiomSourceFamilyScaleUpWave2Attachment(
    baseReadout,
  ),
): AxiomKernelCorpusWave2Readout {
  const wave2Items = buildWave2CorpusItems(attachment);
  const corpusItems = [...baseReadout.corpusItems, ...wave2Items];
  const wave2CoverageUpdates = attachment.packetMappings.map((mapping) => ({
    sourceFamilyEntryId: mapping.sourceFamilyEntryId,
    evidencePacketId: mapping.evidencePacketId,
    buildGroundingPacketId: mapping.buildGroundingPacketId,
    priorCoverageRole: 'next_wave_kernel_grounding_candidate',
    projectedCoverageRole: 'wave2_integrated_kernel_grounding_pending_review',
  })) satisfies AxiomKernelCorpusWave2CoverageUpdate[];

  return {
    readoutId: 'axiom_kernel_corpus_wave2_expanded_readout_v0_2026_06_08',
    objectType: 'axiom_kernel_corpus_wave2_expanded_readout',
    contractVersion: AXIOM_KERNEL_CORPUS_WAVE2_READOUT_VERSION,
    lane: 'Falcon Lab',
    status: 'expanded_internal_kernel_corpus_readout_ready',
    boundary: AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_WAVE2_READOUT_CORE_PROGRESS_CLASSES],
    baseReadoutId: baseReadout.readoutId,
    wave2AttachmentId: attachment.attachmentId,
    basePacketCount: baseReadout.packetCount,
    wave2PacketCount: attachment.wave2PacketCount,
    totalPacketCount: corpusItems.length,
    scenarioCount: new Set(corpusItems.map((item) => item.scenarioId)).size,
    totalReviewNavigationUnitCount:
      baseReadout.reviewNavigation.length +
      attachment.wave2BatchRun.reviewUnitCompression.units.length,
    maxCoreHumanReviewUnits: 100,
    corpusItems,
    wave2CoverageUpdates,
    aggregate: {
      groundedFieldCoverage: groundedFieldCoverage(),
      evalPassingItemCount: corpusItems.filter((item) => item.evalStatus === 'passes').length,
      internalDisplayOnlyItemCount: corpusItems.filter(
        (item) => item.currentUseAllowed === 'internal_kernel_display_and_review_navigation_only',
      ).length,
      wave2IntegratedFamilyCount: wave2CoverageUpdates.length,
    },
    notNow: [
      'no_public_page_filling_from_unpromoted_kernel',
      'no_actual_public_navigation',
      'no_public_approval_or_publication',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...baseReadout.notNow,
      ...attachment.notNow,
    ],
  };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function validateAxiomKernelCorpusWave2Readout(
  readout: AxiomKernelCorpusWave2Readout,
  baseReadout: AxiomKernelCorpusReadout = buildAxiomKernelCorpusReadout(),
  attachment: AxiomSourceFamilyScaleUpWave2Attachment = buildAxiomSourceFamilyScaleUpWave2Attachment(
    baseReadout,
  ),
): AxiomKernelCorpusWave2ReadoutValidation {
  const errors: string[] = [];
  const baseValidation = validateAxiomKernelCorpusReadout(baseReadout);
  const attachmentValidation = validateAxiomSourceFamilyScaleUpWave2Attachment(
    attachment,
    baseReadout,
  );
  const packetIds = new Set(readout.corpusItems.map((item) => item.packetId));

  pushIf(!baseValidation.valid, errors, 'base_kernel_corpus_readout_must_be_valid');
  pushIf(!attachmentValidation.valid, errors, 'wave2_attachment_must_be_valid');
  pushIf(
    readout.objectType !== 'axiom_kernel_corpus_wave2_expanded_readout',
    errors,
    'object_type_must_match_wave2_expanded_readout',
  );
  pushIf(
    readout.contractVersion !== AXIOM_KERNEL_CORPUS_WAVE2_READOUT_VERSION,
    errors,
    'contract_version_must_match_wave2_readout_v0_2026_06_08',
  );
  pushIf(readout.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    readout.boundary !== AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY,
    errors,
    'boundary_must_remain_internal_readout_not_public_runtime_or_promotion',
  );
  pushIf(
    readout.basePacketCount !== 8 ||
      readout.wave2PacketCount !== 6 ||
      readout.totalPacketCount !== 14 ||
      readout.corpusItems.length !== 14,
    errors,
    'wave2_readout_must_project_14_total_kernel_items',
  );
  pushIf(
    readout.scenarioCount !== 5,
    errors,
    'wave2_readout_must_still_cover_all_five_l3_scenarios',
  );
  pushIf(
    readout.maxCoreHumanReviewUnits !== 100 || readout.totalReviewNavigationUnitCount > 100,
    errors,
    'wave2_readout_review_navigation_must_remain_under_100',
  );
  for (const mapping of attachment.packetMappings) {
    pushIf(
      !packetIds.has(mapping.evidencePacketId),
      errors,
      `wave2_packet_missing_from_expanded_readout:${mapping.evidencePacketId}`,
    );
  }
  for (const item of readout.corpusItems) {
    pushIf(item.evalStatus !== 'passes', errors, `corpus_item_eval_must_pass:${item.itemId}`);
    pushIf(
      item.currentUseAllowed !== 'internal_kernel_display_and_review_navigation_only',
      errors,
      `corpus_item_must_remain_internal_display_only:${item.itemId}`,
    );
    pushIf(item.reviewUnitIds.length === 0, errors, `corpus_item_missing_review_route:${item.itemId}`);
  }
  pushIf(
    readout.wave2CoverageUpdates.length !== 6 ||
      readout.aggregate.wave2IntegratedFamilyCount !== 6,
    errors,
    'wave2_readout_must_project_six_source_family_updates',
  );
  pushIf(
    !readout.notNow.includes('no_source_or_support_validity_decision') ||
      !readout.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !readout.notNow.includes('no_public_page_filling_from_unpromoted_kernel') ||
      !readout.notNow.includes('no_learning_update'),
    errors,
    'wave2_readout_not_now_must_block_validity_runtime_public_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_wave2_readout_valid'
        : 'kernel_corpus_wave2_readout_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_WAVE2_READOUT_CORE_PROGRESS_CLASSES],
  };
}
