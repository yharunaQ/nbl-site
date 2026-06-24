import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  buildAxiomKernelCorpusManualDocumentReadout,
  validateAxiomKernelCorpusManualDocumentReadout,
  type AxiomKernelCorpusManualDocumentReadout,
} from './kernelCorpusManualDocumentReadout';
import {
  type AxiomActionabilityBand,
  type AxiomCoreProgressClass,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';

export const AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY =
  'axiom_kernel_corpus_review_readout_adapter_is_internal_display_and_review_navigation_not_public_runtime_or_promotion' as const;

export const AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_human_review_loop',
  'kernel_grounding',
  'kernel_eval',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusReviewReadoutRow = {
  rowId: string;
  itemId: string;
  packetId: string;
  sourceFamilyEntryIds: string[];
  scenarioId: string;
  actionabilityBand: AxiomActionabilityBand;
  groundedFields: AxiomKernelGroundedField[];
  missingContextSlots: AxiomMissingContextSlot[];
  cannotYetSayCount: number;
  reviewUnitIds: string[];
  reviewStatus: 'review_required_before_promotion';
  displayUse: 'internal_review_readout_only';
  promotionStatus: 'not_promoted';
};

export type AxiomKernelCorpusReviewReadoutAdapter = {
  adapterId: string;
  objectType: 'axiom_kernel_corpus_review_readout_adapter';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_VERSION;
  lane: 'Falcon Lab';
  status: 'internal_review_readout_adapter_ready';
  boundary: typeof AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_CORE_PROGRESS_CLASSES;
  sourceWave2ReadoutId: string;
  sourceManualDocumentReadoutId: string;
  rowCount: number;
  wave2RowCount: number;
  manualDocumentRowCount: number;
  maxCoreHumanReviewUnits: 100;
  rows: AxiomKernelCorpusReviewReadoutRow[];
  reviewUnitIndex: Array<{
    reviewUnitId: string;
    rowIds: string[];
    rowCount: number;
  }>;
  sourceFamilyIndex: Array<{
    sourceFamilyEntryId: string;
    rowIds: string[];
    rowCount: number;
  }>;
  displayContract: {
    show: Array<
      | 'source_family'
      | 'scenario'
      | 'grounded_fields'
      | 'actionability_band'
      | 'missing_context_slots'
      | 'cannot_yet_say_count'
      | 'review_units'
    >;
    hide: Array<
      | 'raw_original'
      | 'source_text'
      | 'field_values'
      | 'public_recommendation'
      | 'source_support_validity'
    >;
  };
  notNow: string[];
};

export type AxiomKernelCorpusReviewReadoutAdapterValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_review_readout_adapter_valid'
    | 'kernel_corpus_review_readout_adapter_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_CORE_PROGRESS_CLASSES;
};

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function indexRows(
  rows: AxiomKernelCorpusReviewReadoutRow[],
  getIds: (row: AxiomKernelCorpusReviewReadoutRow) => string[],
) {
  const index = new Map<string, string[]>();
  for (const row of rows) {
    for (const id of getIds(row)) {
      index.set(id, [...(index.get(id) ?? []), row.rowId]);
    }
  }

  return Array.from(index.entries()).map(([id, rowIds]) => ({
    id,
    rowIds,
    rowCount: rowIds.length,
  }));
}

export function buildAxiomKernelCorpusReviewReadoutAdapter(
  readout: AxiomKernelCorpusManualDocumentReadout = buildAxiomKernelCorpusManualDocumentReadout(),
): AxiomKernelCorpusReviewReadoutAdapter {
  const rows = readout.corpusItems.map((item) => ({
    rowId: `review_readout_row_${item.itemId}`,
    itemId: item.itemId,
    packetId: item.packetId,
    sourceFamilyEntryIds: [...item.sourceFamilyEntryIds],
    scenarioId: item.scenarioId,
    actionabilityBand: item.actionabilityBand,
    groundedFields: [...item.groundedFields],
    missingContextSlots: [...item.missingContextSlots],
    cannotYetSayCount: item.cannotYetSay.length,
    reviewUnitIds: [...item.reviewUnitIds],
    reviewStatus: 'review_required_before_promotion',
    displayUse: 'internal_review_readout_only',
    promotionStatus: 'not_promoted',
  })) satisfies AxiomKernelCorpusReviewReadoutRow[];

  const reviewUnitIndex = indexRows(rows, (row) => row.reviewUnitIds).map((entry) => ({
    reviewUnitId: entry.id,
    rowIds: entry.rowIds,
    rowCount: entry.rowCount,
  }));
  const sourceFamilyIndex = indexRows(rows, (row) => row.sourceFamilyEntryIds).map((entry) => ({
    sourceFamilyEntryId: entry.id,
    rowIds: entry.rowIds,
    rowCount: entry.rowCount,
  }));

  return {
    adapterId: 'axiom_kernel_corpus_review_readout_adapter_v0_2026_06_08',
    objectType: 'axiom_kernel_corpus_review_readout_adapter',
    contractVersion: AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_VERSION,
    lane: 'Falcon Lab',
    status: 'internal_review_readout_adapter_ready',
    boundary: AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_CORE_PROGRESS_CLASSES],
    sourceWave2ReadoutId: readout.baseWave2ReadoutId,
    sourceManualDocumentReadoutId: readout.readoutId,
    rowCount: rows.length,
    wave2RowCount: rows.filter((row) => row.itemId.startsWith('wave2_corpus_item_')).length,
    manualDocumentRowCount: rows.filter((row) =>
      row.itemId.startsWith('manual_document_corpus_item_'),
    ).length,
    maxCoreHumanReviewUnits: 100,
    rows,
    reviewUnitIndex,
    sourceFamilyIndex,
    displayContract: {
      show: [
        'source_family',
        'scenario',
        'grounded_fields',
        'actionability_band',
        'missing_context_slots',
        'cannot_yet_say_count',
        'review_units',
      ],
      hide: [
        'raw_original',
        'source_text',
        'field_values',
        'public_recommendation',
        'source_support_validity',
      ],
    },
    notNow: [
      'no_public_page_filling_from_unpromoted_kernel',
      'no_actual_public_navigation',
      'no_public_approval_or_publication',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...readout.notNow,
    ],
  };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function validateAxiomKernelCorpusReviewReadoutAdapter(
  adapter: AxiomKernelCorpusReviewReadoutAdapter,
  readout: AxiomKernelCorpusManualDocumentReadout = buildAxiomKernelCorpusManualDocumentReadout(),
): AxiomKernelCorpusReviewReadoutAdapterValidation {
  const errors: string[] = [];
  const readoutValidation = validateAxiomKernelCorpusManualDocumentReadout(readout);
  const rowIds = new Set(adapter.rows.map((row) => row.rowId));
  const sourceFamilyIds = new Set(adapter.sourceFamilyIndex.map((entry) => entry.sourceFamilyEntryId));
  const reviewUnitIds = new Set(adapter.reviewUnitIndex.map((entry) => entry.reviewUnitId));

  pushIf(!readoutValidation.valid, errors, 'source_manual_document_readout_must_be_valid');
  pushIf(
    adapter.objectType !== 'axiom_kernel_corpus_review_readout_adapter',
    errors,
    'object_type_must_match_review_readout_adapter',
  );
  pushIf(
    adapter.contractVersion !== AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_VERSION,
    errors,
    'contract_version_must_match_review_readout_adapter_v0_2026_06_08',
  );
  pushIf(adapter.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    adapter.boundary !== AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY,
    errors,
    'boundary_must_remain_internal_display_not_public_runtime_or_promotion',
  );
  pushIf(
    adapter.rowCount !== 15 ||
      adapter.rows.length !== 15 ||
      adapter.wave2RowCount !== 6 ||
      adapter.manualDocumentRowCount !== 1,
    errors,
    'adapter_must_expose_15_rows_with_6_wave2_rows_and_1_manual_document_row',
  );
  pushIf(
    adapter.reviewUnitIndex.length > adapter.maxCoreHumanReviewUnits,
    errors,
    'review_unit_index_must_remain_under_100',
  );
  for (const row of adapter.rows) {
    pushIf(rowIds.has(row.rowId) === false, errors, `row_missing_from_index:${row.rowId}`);
    pushIf(row.reviewStatus !== 'review_required_before_promotion', errors, `row_must_require_review:${row.rowId}`);
    pushIf(row.displayUse !== 'internal_review_readout_only', errors, `row_must_remain_internal:${row.rowId}`);
    pushIf(row.promotionStatus !== 'not_promoted', errors, `row_must_not_be_promoted:${row.rowId}`);
    pushIf(row.reviewUnitIds.length === 0, errors, `row_missing_review_units:${row.rowId}`);
    pushIf(row.sourceFamilyEntryIds.length === 0, errors, `row_missing_source_family:${row.rowId}`);
    for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
      pushIf(!row.groundedFields.includes(field), errors, `row_missing_grounded_field:${row.rowId}:${field}`);
    }
  }
  for (const row of adapter.rows) {
    for (const sourceFamilyEntryId of row.sourceFamilyEntryIds) {
      pushIf(!sourceFamilyIds.has(sourceFamilyEntryId), errors, `source_family_index_missing:${sourceFamilyEntryId}`);
    }
    for (const reviewUnitId of row.reviewUnitIds) {
      pushIf(!reviewUnitIds.has(reviewUnitId), errors, `review_unit_index_missing:${reviewUnitId}`);
    }
  }
  pushIf(
    !adapter.displayContract.hide.includes('raw_original') ||
      !adapter.displayContract.hide.includes('source_support_validity') ||
      !adapter.displayContract.hide.includes('public_recommendation'),
    errors,
    'adapter_display_contract_must_hide_raw_validity_and_public_recommendation',
  );
  pushIf(
    !adapter.notNow.includes('no_source_or_support_validity_decision') ||
      !adapter.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !adapter.notNow.includes('no_public_page_filling_from_unpromoted_kernel') ||
      !adapter.notNow.includes('no_learning_update'),
    errors,
    'adapter_not_now_must_block_validity_runtime_public_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_review_readout_adapter_valid'
        : 'kernel_corpus_review_readout_adapter_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_CORE_PROGRESS_CLASSES],
  };
}
