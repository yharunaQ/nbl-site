import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  type AxiomCoreProgressClass,
} from './interactionHypothesisKernelContract';
import {
  buildAxiomKernelCorpusWave2Readout,
  validateAxiomKernelCorpusWave2Readout,
  type AxiomKernelCorpusWave2Readout,
} from './kernelCorpusWave2Readout';
import {
  type AxiomKernelCorpusReadoutItem,
} from './kernelCorpusReadout';
import {
  AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES,
  buildAxiomManualDocumentSourceFamilyAttachment,
  validateAxiomManualDocumentSourceFamilyAttachment,
  type AxiomManualDocumentSourceFamilyAttachment,
} from './manualDocumentSourceFamilyAttachment';

export const AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY =
  'axiom_kernel_corpus_manual_document_readout_projects_manual_documents_into_internal_corpus_not_public_runtime_or_promotion' as const;

export const AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_CORE_PROGRESS_CLASSES = [
  ...AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_CORE_PROGRESS_CLASSES,
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusManualDocumentCoverageUpdate = {
  sourceFamilyEntryId: 'source_family_manuals_and_documents';
  evidencePacketId: string;
  buildGroundingPacketId: string;
  priorCoverageRole: 'held_for_derived_non_sensitive_packet';
  projectedCoverageRole: 'manual_document_integrated_kernel_grounding_pending_review';
};

export type AxiomKernelCorpusManualDocumentReadout = {
  readoutId: string;
  objectType: 'axiom_kernel_corpus_manual_document_expanded_readout';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_VERSION;
  lane: 'Falcon Lab';
  status: 'manual_document_internal_kernel_corpus_readout_ready';
  boundary: typeof AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_CORE_PROGRESS_CLASSES;
  baseWave2ReadoutId: string;
  manualDocumentAttachmentId: string;
  basePacketCount: number;
  manualDocumentPacketCount: number;
  totalPacketCount: number;
  scenarioCount: number;
  totalReviewNavigationUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  corpusItems: AxiomKernelCorpusReadoutItem[];
  manualDocumentCoverageUpdate: AxiomKernelCorpusManualDocumentCoverageUpdate;
  aggregate: {
    groundedFieldCoverage: Record<AxiomKernelGroundedField, 'covered'>;
    evalPassingItemCount: number;
    internalDisplayOnlyItemCount: number;
    manualDocumentIntegratedFamilyCount: 1;
  };
  notNow: string[];
};

export type AxiomKernelCorpusManualDocumentReadoutValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_manual_document_readout_valid'
    | 'kernel_corpus_manual_document_readout_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_CORE_PROGRESS_CLASSES;
};

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function groundedFieldCoverage(): Record<AxiomKernelGroundedField, 'covered'> {
  return Object.fromEntries(
    AXIOM_KERNEL_GROUNDED_FIELDS.map((field) => [field, 'covered']),
  ) as Record<AxiomKernelGroundedField, 'covered'>;
}

function manualDocumentCorpusItem(
  attachment: AxiomManualDocumentSourceFamilyAttachment,
): AxiomKernelCorpusReadoutItem {
  const run = attachment.manualDocumentBatchRun.runs[0];
  const packet = run.evidencePacket;
  const kernel = run.buildGroundingPacket.kernel;
  const evalReport = attachment.evalReports.find((report) => report.kernelId === kernel.kernelId);
  const groundingPacketId = run.buildGroundingPacket.packetId;
  const reviewUnitIds = attachment.manualDocumentBatchRun.reviewUnitCompression.units
    .filter((unit) => unit.packetIds.includes(groundingPacketId))
    .map((unit) => unit.unitId);

  return {
    itemId: `manual_document_corpus_item_${packet.packetId}`,
    packetId: packet.packetId,
    groundingPacketId,
    scenarioId: packet.scenarioId,
    kernelId: kernel.kernelId,
    sourceFamilyEntryIds: ['source_family_manuals_and_documents'],
    sourceFamilyGroups: ['manual_or_document'],
    sourceFamilyStatuses: ['hold_until_derived_non_sensitive_packet'],
    sourceFoundationCount: packet.sourceFoundationRefs.length,
    evidenceSpanCount: packet.evidenceSpans.length,
    groundedFields: [...AXIOM_KERNEL_GROUNDED_FIELDS],
    inferenceCount: kernel.inference.length,
    counterHypothesisCount: kernel.counterHypothesis.length,
    missingContextSlots: unique(kernel.missingContext.map((context) => context.slot)),
    implementationActorCount: kernel.implementationActorConditions.length,
    actionabilityBand: kernel.actionabilityBand,
    evalStatus: evalReport?.status ?? 'needs_repair',
    reviewUnitIds,
    reviewRouteStatus: 'compressed_framework_review_required_before_promotion',
    currentUseAllowed: 'internal_kernel_display_and_review_navigation_only',
    cannotYetSay: [...kernel.cannotYetSay],
  };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function buildAxiomKernelCorpusManualDocumentReadout(
  baseReadout: AxiomKernelCorpusWave2Readout = buildAxiomKernelCorpusWave2Readout(),
  attachment: AxiomManualDocumentSourceFamilyAttachment = buildAxiomManualDocumentSourceFamilyAttachment(
    baseReadout,
  ),
): AxiomKernelCorpusManualDocumentReadout {
  const manualItem = manualDocumentCorpusItem(attachment);
  const corpusItems = [...baseReadout.corpusItems, manualItem];
  const manualDocumentCoverageUpdate = {
    sourceFamilyEntryId: 'source_family_manuals_and_documents',
    evidencePacketId: attachment.packetMapping.evidencePacketId,
    buildGroundingPacketId: attachment.packetMapping.buildGroundingPacketId,
    priorCoverageRole: 'held_for_derived_non_sensitive_packet',
    projectedCoverageRole: 'manual_document_integrated_kernel_grounding_pending_review',
  } satisfies AxiomKernelCorpusManualDocumentCoverageUpdate;

  return {
    readoutId: 'axiom_kernel_corpus_manual_document_expanded_readout_v0_2026_06_08',
    objectType: 'axiom_kernel_corpus_manual_document_expanded_readout',
    contractVersion: AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_VERSION,
    lane: 'Falcon Lab',
    status: 'manual_document_internal_kernel_corpus_readout_ready',
    boundary: AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_CORE_PROGRESS_CLASSES],
    baseWave2ReadoutId: baseReadout.readoutId,
    manualDocumentAttachmentId: attachment.attachmentId,
    basePacketCount: baseReadout.totalPacketCount,
    manualDocumentPacketCount: attachment.manualDocumentPacketCount,
    totalPacketCount: corpusItems.length,
    scenarioCount: new Set(corpusItems.map((item) => item.scenarioId)).size,
    totalReviewNavigationUnitCount:
      baseReadout.totalReviewNavigationUnitCount + attachment.reviewUnitCount,
    maxCoreHumanReviewUnits: 100,
    corpusItems,
    manualDocumentCoverageUpdate,
    aggregate: {
      groundedFieldCoverage: groundedFieldCoverage(),
      evalPassingItemCount: corpusItems.filter((item) => item.evalStatus === 'passes').length,
      internalDisplayOnlyItemCount: corpusItems.filter(
        (item) => item.currentUseAllowed === 'internal_kernel_display_and_review_navigation_only',
      ).length,
      manualDocumentIntegratedFamilyCount: 1,
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

export function validateAxiomKernelCorpusManualDocumentReadout(
  readout: AxiomKernelCorpusManualDocumentReadout,
  baseReadout: AxiomKernelCorpusWave2Readout = buildAxiomKernelCorpusWave2Readout(),
  attachment: AxiomManualDocumentSourceFamilyAttachment = buildAxiomManualDocumentSourceFamilyAttachment(
    baseReadout,
  ),
): AxiomKernelCorpusManualDocumentReadoutValidation {
  const errors: string[] = [];
  const baseValidation = validateAxiomKernelCorpusWave2Readout(baseReadout);
  const attachmentValidation = validateAxiomManualDocumentSourceFamilyAttachment(
    attachment,
    baseReadout,
  );
  const packetIds = new Set(readout.corpusItems.map((item) => item.packetId));
  const manualItem = readout.corpusItems.find((item) =>
    item.sourceFamilyEntryIds.includes('source_family_manuals_and_documents'),
  );

  pushIf(!baseValidation.valid, errors, 'base_wave2_readout_must_be_valid');
  pushIf(!attachmentValidation.valid, errors, 'manual_document_attachment_must_be_valid');
  pushIf(
    readout.objectType !== 'axiom_kernel_corpus_manual_document_expanded_readout',
    errors,
    'object_type_must_match_manual_document_expanded_readout',
  );
  pushIf(
    readout.contractVersion !== AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_VERSION,
    errors,
    'contract_version_must_match_manual_document_readout_v0_2026_06_08',
  );
  pushIf(readout.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    readout.boundary !== AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY,
    errors,
    'boundary_must_remain_manual_document_readout_not_public_runtime_or_promotion',
  );
  pushIf(
    readout.basePacketCount !== 14 ||
      readout.manualDocumentPacketCount !== 1 ||
      readout.totalPacketCount !== 15 ||
      readout.corpusItems.length !== 15,
    errors,
    'manual_document_readout_must_project_15_total_kernel_items',
  );
  pushIf(
    readout.scenarioCount !== 5,
    errors,
    'manual_document_readout_must_preserve_all_five_l3_scenarios',
  );
  pushIf(
    readout.maxCoreHumanReviewUnits !== 100 ||
      readout.totalReviewNavigationUnitCount > 100,
    errors,
    'manual_document_review_navigation_must_remain_under_100',
  );
  pushIf(
    !packetIds.has(attachment.packetMapping.evidencePacketId),
    errors,
    `manual_document_packet_missing_from_readout:${attachment.packetMapping.evidencePacketId}`,
  );
  pushIf(!manualItem, errors, 'manual_document_source_family_missing_from_readout');
  if (manualItem) {
    pushIf(manualItem.evalStatus !== 'passes', errors, 'manual_document_item_eval_must_pass');
    pushIf(
      manualItem.currentUseAllowed !== 'internal_kernel_display_and_review_navigation_only',
      errors,
      'manual_document_item_must_remain_internal_display_only',
    );
    pushIf(manualItem.reviewUnitIds.length === 0, errors, 'manual_document_item_missing_review_route');
    pushIf(
      manualItem.actionabilityBand !== 'hold_or_research_needed',
      errors,
      'manual_document_item_must_remain_hold_or_research_needed',
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
    for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
      pushIf(!item.groundedFields.includes(field), errors, `corpus_item_missing_grounded_field:${item.itemId}:${field}`);
    }
  }
  pushIf(
    readout.manualDocumentCoverageUpdate.sourceFamilyEntryId !==
      'source_family_manuals_and_documents' ||
      readout.manualDocumentCoverageUpdate.projectedCoverageRole !==
        'manual_document_integrated_kernel_grounding_pending_review',
    errors,
    'manual_document_coverage_update_must_mark_manual_family_integrated_pending_review',
  );
  pushIf(
    !readout.notNow.includes('no_source_or_support_validity_decision') ||
      !readout.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !readout.notNow.includes('no_public_page_filling_from_unpromoted_kernel') ||
      !readout.notNow.includes('no_learning_update'),
    errors,
    'manual_document_readout_not_now_must_block_validity_runtime_public_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_manual_document_readout_valid'
        : 'kernel_corpus_manual_document_readout_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_CORE_PROGRESS_CLASSES],
  };
}
