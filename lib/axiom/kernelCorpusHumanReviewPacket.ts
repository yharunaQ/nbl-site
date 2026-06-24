import {
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  type AxiomActionabilityBand,
  type AxiomCoreProgressClass,
  type AxiomHumanReviewBlock,
  type AxiomHumanReviewNonBlocking,
  type AxiomMissingContextSlot,
} from './interactionHypothesisKernelContract';
import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import {
  buildAxiomKernelCorpusReviewReadoutAdapter,
  validateAxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutRow,
} from './kernelCorpusReviewReadoutAdapter';
import {
  buildAxiomKernelCorpusSufficiencyGate,
  validateAxiomKernelCorpusSufficiencyGate,
  type AxiomKernelCorpusSufficiencyGate,
} from './kernelCorpusSufficiencyGate';

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY =
  'axiom_kernel_corpus_human_review_packet_is_readable_checklist_not_review_execution_validity_or_promotion' as const;

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_CORE_PROGRESS_CLASSES = [
  'kernel_human_review_loop',
  'kernel_display',
  'kernel_eval',
  'kernel_grounding',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusHumanReviewUnitType =
  | 'compressed_kernel_review_unit'
  | 'source_family_coverage_review'
  | 'cross_corpus_boundary_review';

export type AxiomKernelCorpusHumanReviewChecklistItem = {
  checkId:
    | 'reality_shadow_use_without_perfection_requirement'
    | 'grounded_fields_are_traceable_without_raw_text'
    | 'counter_hypothesis_and_missing_context_visible'
    | 'actionability_band_does_not_become_final_advice'
    | 'source_support_validity_and_public_use_blocked'
    | 'delivery_layer_excluded_from_core_truth'
    | 'review_result_required_before_promotion';
  label: string;
  expectedDisposition:
    | 'accept_or_revise_or_hold_by_human_review'
    | 'must_remain_blocked_until_external_review_result';
  completionStatus: 'unchecked_review_required_outside_codex';
};

export type AxiomKernelCorpusHumanReviewBlockedDecisionStatus = {
  sourceValidity: 'not_decided';
  supportValidity: 'not_decided';
  candidatePattern: 'not_candidate_pattern';
  runtimeApproved: 'not_approved';
  publicApproved: 'not_approved';
  publicRelease: 'not_approved';
  publication: 'not_published';
  knowledgePromotion: 'not_promoted';
  learningUpdate: 'not_promoted';
};

export type AxiomKernelCorpusHumanReviewMovementBoundary = {
  runtime: 'not_changed';
  prompt: 'not_changed';
  retrieval: 'not_changed';
  modelProvider: 'not_changed';
  dbSchema: 'not_changed';
  sourceValidity: 'not_decided';
  supportValidity: 'not_decided';
  candidatePattern: 'not_candidate_pattern';
  runtimeApproved: 'not_approved';
  publicApproved: 'not_approved';
  publicRelease: 'not_approved';
  publication: 'not_published';
  knowledgePromotion: 'not_promoted';
  learningUpdate: 'not_promoted';
};

export type AxiomKernelCorpusHumanReviewUnit = {
  unitId: string;
  unitType: AxiomKernelCorpusHumanReviewUnitType;
  reviewScale:
    | 'compressed_corpus_unit_not_individual_hypothesis'
    | 'source_family_set_not_individual_source'
    | 'cross_corpus_boundary_not_public_release';
  coreProgressClass: 'kernel_human_review_loop';
  sourceReviewUnitId?: string;
  rowIds: string[];
  rowCount: number;
  packetIds: string[];
  scenarioIds: string[];
  sourceFamilyEntryIds: string[];
  actionabilityBands: AxiomActionabilityBand[];
  kernelFieldsInScope: AxiomKernelGroundedField[];
  missingContextSlots: AxiomMissingContextSlot[];
  cannotYetSayTotal: number;
  reviewQuestion: string;
  readableChecklist: AxiomKernelCorpusHumanReviewChecklistItem[];
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  reviewResultStatus: 'not_recorded';
  currentUseAllowed: 'internal_kernel_display_and_review_navigation_only';
  blocks: AxiomHumanReviewBlock[];
  doesNotBlock: AxiomHumanReviewNonBlocking[];
  blockedDecisionStatus: AxiomKernelCorpusHumanReviewBlockedDecisionStatus;
  approvalEffect: 'does_not_approve_source_support_validity_public_use_runtime_or_learning';
};

export type AxiomKernelCorpusHumanReviewPacket = {
  packetId: string;
  objectType: 'axiom_kernel_corpus_human_review_packet';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_VERSION;
  lane: 'Falcon Lab';
  status: 'compressed_human_review_packet_prepared_not_executed';
  boundary: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_CORE_PROGRESS_CLASSES;
  sourceAdapterId: string;
  sourceSufficiencyGateId: string;
  sourceCoverageAuditId: string;
  sourceGateStatus: AxiomKernelCorpusSufficiencyGate['status'];
  totalKernelRows: 15;
  maxCoreHumanReviewUnits: 100;
  unitCount: number;
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  reviewResultStatus: 'not_recorded';
  sourceFamilyCoverage: {
    coreEligibleSourceFamilyCount: 10;
    representedCoreEligibleSourceFamilyCount: 10;
    deliveryLayerExcludedCount: 1;
    sourceFamilyEntryIds: string[];
  };
  rowCoverage: {
    coveredRowCount: number;
    totalRowCount: 15;
    scenarioCount: 5;
  };
  readableChecklistSummary: {
    totalChecklistItemCount: number;
    uncheckedChecklistItemCount: number;
    checklistMode: 'readable_human_review_checklist_prepared_not_completed';
  };
  units: AxiomKernelCorpusHumanReviewUnit[];
  provisionalWorkAllowed: AxiomHumanReviewNonBlocking[];
  movementBoundary: AxiomKernelCorpusHumanReviewMovementBoundary;
  notNow: string[];
};

export type AxiomKernelCorpusHumanReviewPacketValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_human_review_packet_valid'
    | 'kernel_corpus_human_review_packet_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_CORE_PROGRESS_CLASSES;
};

const BLOCKED_DECISION_STATUS: AxiomKernelCorpusHumanReviewBlockedDecisionStatus = {
  sourceValidity: 'not_decided',
  supportValidity: 'not_decided',
  candidatePattern: 'not_candidate_pattern',
  runtimeApproved: 'not_approved',
  publicApproved: 'not_approved',
  publicRelease: 'not_approved',
  publication: 'not_published',
  knowledgePromotion: 'not_promoted',
  learningUpdate: 'not_promoted',
};

const MOVEMENT_BOUNDARY: AxiomKernelCorpusHumanReviewMovementBoundary = {
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
  publicRelease: 'not_approved',
  publication: 'not_published',
  knowledgePromotion: 'not_promoted',
  learningUpdate: 'not_promoted',
};

const COMMON_CHECKLIST_ITEMS: AxiomKernelCorpusHumanReviewChecklistItem[] = [
  {
    checkId: 'reality_shadow_use_without_perfection_requirement',
    label:
      '不完全な実データを現実の影として使えているか。完璧なデータだけをcore化する設計になっていないか。',
    expectedDisposition: 'accept_or_revise_or_hold_by_human_review',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
  {
    checkId: 'grounded_fields_are_traceable_without_raw_text',
    label:
      'observation, inference, counterHypothesis, missingContextなどのkernel fieldが、raw/source textを開かずにtraceできるか。',
    expectedDisposition: 'accept_or_revise_or_hold_by_human_review',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
  {
    checkId: 'counter_hypothesis_and_missing_context_visible',
    label:
      '反対仮説とmissing contextが、判断の弱さとして隠れず、次の確認質問として見えているか。',
    expectedDisposition: 'accept_or_revise_or_hold_by_human_review',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
  {
    checkId: 'actionability_band_does_not_become_final_advice',
    label:
      'actionabilityBandが暫定利用範囲の分類に留まり、助言・支援妥当性・最終判断へ滑っていないか。',
    expectedDisposition: 'accept_or_revise_or_hold_by_human_review',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
  {
    checkId: 'source_support_validity_and_public_use_blocked',
    label:
      'source/support validity、public approval、publication、runtime approval、learning updateが止まっているか。',
    expectedDisposition: 'must_remain_blocked_until_external_review_result',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
  {
    checkId: 'review_result_required_before_promotion',
    label:
      'この単位をcandidate_pattern、public content、runtime-approved object、learning updateへ進めるには別途人間レビュー結果が必要か。',
    expectedDisposition: 'must_remain_blocked_until_external_review_result',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
];

const CROSS_BOUNDARY_CHECKLIST_ITEMS: AxiomKernelCorpusHumanReviewChecklistItem[] = [
  ...COMMON_CHECKLIST_ITEMS,
  {
    checkId: 'delivery_layer_excluded_from_core_truth',
    label:
      'Falcon/Heron公開ページ、SNS進捗、外部payload shellがAxiom core truthとして混入していないか。',
    expectedDisposition: 'must_remain_blocked_until_external_review_result',
    completionStatus: 'unchecked_review_required_outside_codex',
  },
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function missingValues<T extends string>(actual: readonly T[], required: readonly T[]): T[] {
  return required.filter((value) => !actual.includes(value));
}

function stableKernelFields(fields: AxiomKernelGroundedField[]): AxiomKernelGroundedField[] {
  return AXIOM_KERNEL_GROUNDED_FIELDS.filter((field) => fields.includes(field));
}

function summarizeRows(rows: AxiomKernelCorpusReviewReadoutRow[]) {
  return {
    rowIds: rows.map((row) => row.rowId),
    packetIds: rows.map((row) => row.packetId),
    scenarioIds: unique(rows.map((row) => row.scenarioId)),
    sourceFamilyEntryIds: unique(rows.flatMap((row) => row.sourceFamilyEntryIds)),
    actionabilityBands: unique(rows.map((row) => row.actionabilityBand)),
    kernelFieldsInScope: stableKernelFields(rows.flatMap((row) => row.groundedFields)),
    missingContextSlots: unique(rows.flatMap((row) => row.missingContextSlots)),
    cannotYetSayTotal: rows.reduce((sum, row) => sum + row.cannotYetSayCount, 0),
  };
}

function buildReviewUnit(
  unitId: string,
  unitType: AxiomKernelCorpusHumanReviewUnitType,
  reviewScale: AxiomKernelCorpusHumanReviewUnit['reviewScale'],
  rows: AxiomKernelCorpusReviewReadoutRow[],
  reviewQuestion: string,
  sourceReviewUnitId?: string,
  checklist: AxiomKernelCorpusHumanReviewChecklistItem[] = COMMON_CHECKLIST_ITEMS,
): AxiomKernelCorpusHumanReviewUnit {
  const summary = summarizeRows(rows);

  return {
    unitId,
    unitType,
    reviewScale,
    coreProgressClass: 'kernel_human_review_loop',
    sourceReviewUnitId,
    rowIds: summary.rowIds,
    rowCount: rows.length,
    packetIds: summary.packetIds,
    scenarioIds: summary.scenarioIds,
    sourceFamilyEntryIds: summary.sourceFamilyEntryIds,
    actionabilityBands: summary.actionabilityBands,
    kernelFieldsInScope: summary.kernelFieldsInScope,
    missingContextSlots: summary.missingContextSlots,
    cannotYetSayTotal: summary.cannotYetSayTotal,
    reviewQuestion,
    readableChecklist: checklist.map((item) => ({ ...item })),
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    reviewResultStatus: 'not_recorded',
    currentUseAllowed: 'internal_kernel_display_and_review_navigation_only',
    blocks: [...AXIOM_HUMAN_REVIEW_BLOCKS],
    doesNotBlock: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    blockedDecisionStatus: { ...BLOCKED_DECISION_STATUS },
    approvalEffect: 'does_not_approve_source_support_validity_public_use_runtime_or_learning',
  };
}

function rowsForReviewUnit(
  adapter: AxiomKernelCorpusReviewReadoutAdapter,
  rowIds: string[],
): AxiomKernelCorpusReviewReadoutRow[] {
  const rowsById = new Map(adapter.rows.map((row) => [row.rowId, row]));
  return rowIds.map((rowId) => rowsById.get(rowId)).filter(Boolean) as AxiomKernelCorpusReviewReadoutRow[];
}

export function buildAxiomKernelCorpusHumanReviewPacket(
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(),
  sufficiencyGate: AxiomKernelCorpusSufficiencyGate = buildAxiomKernelCorpusSufficiencyGate(
    undefined,
    adapter,
  ),
): AxiomKernelCorpusHumanReviewPacket {
  const compressedUnits = adapter.reviewUnitIndex.map((indexEntry) =>
    buildReviewUnit(
      `kernel_corpus_human_review_${indexEntry.reviewUnitId}`,
      'compressed_kernel_review_unit',
      'compressed_corpus_unit_not_individual_hypothesis',
      rowsForReviewUnit(adapter, indexEntry.rowIds),
      `Review compressed kernel unit ${indexEntry.reviewUnitId}: are the grouped observations, inferences, counter-hypotheses, missing-context questions, source-lens limits, actionability bands, and cannot-yet-say boundaries acceptable as provisional Axiom kernel structure?`,
      indexEntry.reviewUnitId,
    ),
  );
  const sourceFamilyCoverageUnit = buildReviewUnit(
    'kernel_corpus_human_review_source_family_coverage',
    'source_family_coverage_review',
    'source_family_set_not_individual_source',
    adapter.rows,
    'Do all 10 core-eligible source families remain represented as provisional, non-sensitive kernel grounding without requiring perfect source completeness or granting source/support validity?',
  );
  const crossBoundaryUnit = buildReviewUnit(
    'kernel_corpus_human_review_cross_corpus_boundary',
    'cross_corpus_boundary_review',
    'cross_corpus_boundary_not_public_release',
    adapter.rows,
    'Across the 15-item corpus, do raw/source/field/public/validity fields stay hidden, delivery-layer artifacts stay excluded from core truth, and review remain a promotion gate rather than a stop on provisional kernel work?',
    undefined,
    CROSS_BOUNDARY_CHECKLIST_ITEMS,
  );
  const units = [...compressedUnits, sourceFamilyCoverageUnit, crossBoundaryUnit];
  const sourceFamilyEntryIds = adapter.sourceFamilyIndex.map((entry) => entry.sourceFamilyEntryId);
  const totalChecklistItemCount = units.reduce(
    (sum, unit) => sum + unit.readableChecklist.length,
    0,
  );

  return {
    packetId: `axiom_kernel_corpus_human_review_packet_from_${adapter.adapterId}`,
    objectType: 'axiom_kernel_corpus_human_review_packet',
    contractVersion: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_VERSION,
    lane: 'Falcon Lab',
    status: 'compressed_human_review_packet_prepared_not_executed',
    boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_CORE_PROGRESS_CLASSES],
    sourceAdapterId: adapter.adapterId,
    sourceSufficiencyGateId: sufficiencyGate.gateId,
    sourceCoverageAuditId: sufficiencyGate.sourceCoverageAuditId,
    sourceGateStatus: sufficiencyGate.status,
    totalKernelRows: 15,
    maxCoreHumanReviewUnits: 100,
    unitCount: units.length,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    reviewResultStatus: 'not_recorded',
    sourceFamilyCoverage: {
      coreEligibleSourceFamilyCount: 10,
      representedCoreEligibleSourceFamilyCount: 10,
      deliveryLayerExcludedCount: 1,
      sourceFamilyEntryIds,
    },
    rowCoverage: {
      coveredRowCount: new Set(units.flatMap((unit) => unit.rowIds)).size,
      totalRowCount: 15,
      scenarioCount: new Set(adapter.rows.map((row) => row.scenarioId)).size as 5,
    },
    readableChecklistSummary: {
      totalChecklistItemCount,
      uncheckedChecklistItemCount: totalChecklistItemCount,
      checklistMode: 'readable_human_review_checklist_prepared_not_completed',
    },
    units,
    provisionalWorkAllowed: [...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK],
    movementBoundary: { ...MOVEMENT_BOUNDARY },
    notNow: [
      'no_human_review_execution_by_codex',
      'no_reviewer_assignment_by_codex',
      'no_review_result_recorded',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_or_public_approval',
      'no_publication',
      'no_learning_update',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_public_page_filling_from_unpromoted_kernel',
      'no_actual_public_navigation',
      ...adapter.notNow,
      ...sufficiencyGate.notNow,
    ],
  };
}

export function validateAxiomKernelCorpusHumanReviewPacket(
  packet: AxiomKernelCorpusHumanReviewPacket,
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(),
  sufficiencyGate: AxiomKernelCorpusSufficiencyGate = buildAxiomKernelCorpusSufficiencyGate(
    undefined,
    adapter,
  ),
): AxiomKernelCorpusHumanReviewPacketValidation {
  const errors: string[] = [];
  const adapterValidation = validateAxiomKernelCorpusReviewReadoutAdapter(adapter);
  const gateValidation = validateAxiomKernelCorpusSufficiencyGate(sufficiencyGate, undefined, adapter);
  const unitIds = new Set(packet.units.map((unit) => unit.unitId));
  const packetSourceReviewUnitIds = new Set(
    packet.units
      .filter((unit) => unit.unitType === 'compressed_kernel_review_unit')
      .map((unit) => unit.sourceReviewUnitId),
  );
  const coveredRowIds = new Set(packet.units.flatMap((unit) => unit.rowIds));
  const adapterRowIds = new Set(adapter.rows.map((row) => row.rowId));
  const packetSourceFamilyIds = new Set(packet.sourceFamilyCoverage.sourceFamilyEntryIds);
  const adapterSourceFamilyIds = new Set(
    adapter.sourceFamilyIndex.map((entry) => entry.sourceFamilyEntryId),
  );

  pushIf(!adapterValidation.valid, errors, 'source_review_readout_adapter_must_be_valid');
  pushIf(!gateValidation.valid, errors, 'source_sufficiency_gate_must_be_valid');
  pushIf(
    sufficiencyGate.status !== 'passed_internal_kernel_sufficiency_gate_not_public_or_promotion',
    errors,
    'source_sufficiency_gate_must_pass_before_human_review_packet',
  );
  pushIf(
    packet.objectType !== 'axiom_kernel_corpus_human_review_packet',
    errors,
    'object_type_must_match_kernel_corpus_human_review_packet',
  );
  pushIf(
    packet.contractVersion !== AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_VERSION,
    errors,
    'contract_version_must_match_kernel_corpus_human_review_packet_v0_2026_06_08',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.status !== 'compressed_human_review_packet_prepared_not_executed',
    errors,
    'status_must_remain_human_review_packet_prepared_not_executed',
  );
  pushIf(
    packet.boundary !== AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_readable_checklist_not_review_execution_validity_or_promotion',
  );
  pushIf(packet.sourceAdapterId !== adapter.adapterId, errors, 'source_adapter_id_mismatch');
  pushIf(
    packet.sourceSufficiencyGateId !== sufficiencyGate.gateId,
    errors,
    'source_sufficiency_gate_id_mismatch',
  );
  pushIf(
    packet.sourceCoverageAuditId !== sufficiencyGate.sourceCoverageAuditId,
    errors,
    'source_coverage_audit_id_mismatch',
  );
  pushIf(
    packet.totalKernelRows !== adapter.rowCount || packet.totalKernelRows !== 15,
    errors,
    'human_review_packet_must_anchor_to_15_kernel_rows',
  );
  pushIf(
    packet.unitCount !== packet.units.length ||
      packet.unitCount !== adapter.reviewUnitIndex.length + 2 ||
      packet.unitCount > packet.maxCoreHumanReviewUnits,
    errors,
    'human_review_packet_unit_count_must_match_compressed_units_plus_two_and_stay_under_100',
  );
  pushIf(packet.maxCoreHumanReviewUnits !== 100, errors, 'max_core_review_units_must_be_100');
  pushIf(
    packet.reviewExecutionStatus !== 'not_executed' ||
      packet.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      packet.reviewResultStatus !== 'not_recorded',
    errors,
    'human_review_packet_must_not_execute_assign_or_record_review_result',
  );
  pushIf(
    packet.sourceFamilyCoverage.coreEligibleSourceFamilyCount !== 10 ||
      packet.sourceFamilyCoverage.representedCoreEligibleSourceFamilyCount !== 10 ||
      packet.sourceFamilyCoverage.deliveryLayerExcludedCount !== 1 ||
      packet.sourceFamilyCoverage.sourceFamilyEntryIds.length !== adapter.sourceFamilyIndex.length,
    errors,
    'source_family_coverage_must_show_10_represented_and_1_delivery_excluded',
  );
  for (const sourceFamilyId of adapterSourceFamilyIds) {
    pushIf(
      !packetSourceFamilyIds.has(sourceFamilyId),
      errors,
      `source_family_missing_from_human_review_packet:${sourceFamilyId}`,
    );
  }
  pushIf(
    packet.rowCoverage.coveredRowCount !== adapter.rows.length ||
      packet.rowCoverage.totalRowCount !== 15 ||
      packet.rowCoverage.scenarioCount !== 5,
    errors,
    'row_coverage_must_cover_15_rows_and_5_scenarios',
  );
  for (const rowId of adapterRowIds) {
    pushIf(!coveredRowIds.has(rowId), errors, `row_missing_from_human_review_packet:${rowId}`);
  }
  for (const reviewUnit of adapter.reviewUnitIndex) {
    pushIf(
      !packetSourceReviewUnitIds.has(reviewUnit.reviewUnitId),
      errors,
      `compressed_review_unit_missing:${reviewUnit.reviewUnitId}`,
    );
  }
  pushIf(
    !packet.units.some((unit) => unit.unitType === 'source_family_coverage_review'),
    errors,
    'source_family_coverage_review_unit_required',
  );
  pushIf(
    !packet.units.some((unit) => unit.unitType === 'cross_corpus_boundary_review'),
    errors,
    'cross_corpus_boundary_review_unit_required',
  );
  pushIf(
    packet.readableChecklistSummary.totalChecklistItemCount <= 0 ||
      packet.readableChecklistSummary.uncheckedChecklistItemCount !==
        packet.readableChecklistSummary.totalChecklistItemCount ||
      packet.readableChecklistSummary.checklistMode !==
        'readable_human_review_checklist_prepared_not_completed',
    errors,
    'readable_checklist_summary_must_remain_prepared_not_completed',
  );

  for (const unit of packet.units) {
    pushIf(!unitIds.has(unit.unitId), errors, `unit_missing_from_index:${unit.unitId}`);
    pushIf(
      unit.coreProgressClass !== 'kernel_human_review_loop',
      errors,
      `unit_core_progress_must_be_kernel_human_review_loop:${unit.unitId}`,
    );
    pushIf(unit.rowIds.length === 0 || unit.rowCount !== unit.rowIds.length, errors, `unit_rows_required:${unit.unitId}`);
    pushIf(unit.packetIds.length === 0, errors, `unit_packet_refs_required:${unit.unitId}`);
    pushIf(unit.scenarioIds.length === 0, errors, `unit_scenario_refs_required:${unit.unitId}`);
    pushIf(
      unit.sourceFamilyEntryIds.length === 0,
      errors,
      `unit_source_family_refs_required:${unit.unitId}`,
    );
    pushIf(
      unit.kernelFieldsInScope.length === 0,
      errors,
      `unit_kernel_fields_required:${unit.unitId}`,
    );
    pushIf(unit.readableChecklist.length < 5, errors, `unit_readable_checklist_required:${unit.unitId}`);
    pushIf(
      unit.readableChecklist.some(
        (item) => item.completionStatus !== 'unchecked_review_required_outside_codex',
      ),
      errors,
      `unit_checklist_must_remain_unchecked:${unit.unitId}`,
    );
    pushIf(
      unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.reviewResultStatus !== 'not_recorded',
      errors,
      `unit_must_not_execute_assign_or_record_review_result:${unit.unitId}`,
    );
    pushIf(
      unit.currentUseAllowed !== 'internal_kernel_display_and_review_navigation_only',
      errors,
      `unit_must_remain_internal_kernel_display_only:${unit.unitId}`,
    );
    pushIf(
      unit.approvalEffect !==
        'does_not_approve_source_support_validity_public_use_runtime_or_learning',
      errors,
      `unit_must_not_approve_validity_public_runtime_or_learning:${unit.unitId}`,
    );
    const missingBlocks = missingValues(unit.blocks, AXIOM_HUMAN_REVIEW_BLOCKS);
    const missingNonBlocking = missingValues(unit.doesNotBlock, AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK);
    pushIf(
      missingBlocks.length > 0,
      errors,
      `unit_review_blocks_missing:${unit.unitId}:${missingBlocks.join(',')}`,
    );
    pushIf(
      missingNonBlocking.length > 0,
      errors,
      `unit_non_blocking_routes_missing:${unit.unitId}:${missingNonBlocking.join(',')}`,
    );
    pushIf(
      unit.blockedDecisionStatus.sourceValidity !== 'not_decided' ||
        unit.blockedDecisionStatus.supportValidity !== 'not_decided' ||
        unit.blockedDecisionStatus.candidatePattern !== 'not_candidate_pattern' ||
        unit.blockedDecisionStatus.runtimeApproved !== 'not_approved' ||
        unit.blockedDecisionStatus.publicApproved !== 'not_approved' ||
        unit.blockedDecisionStatus.publicRelease !== 'not_approved' ||
        unit.blockedDecisionStatus.publication !== 'not_published' ||
        unit.blockedDecisionStatus.knowledgePromotion !== 'not_promoted' ||
        unit.blockedDecisionStatus.learningUpdate !== 'not_promoted',
      errors,
      `unit_must_not_move_blocked_decisions:${unit.unitId}`,
    );
  }

  pushIf(
    missingValues(packet.provisionalWorkAllowed, AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK).length > 0,
    errors,
    'provisional_work_allowed_must_include_all_non_blocking_routes',
  );
  pushIf(
    packet.movementBoundary.runtime !== 'not_changed' ||
      packet.movementBoundary.prompt !== 'not_changed' ||
      packet.movementBoundary.retrieval !== 'not_changed' ||
      packet.movementBoundary.modelProvider !== 'not_changed' ||
      packet.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    packet.movementBoundary.sourceValidity !== 'not_decided' ||
      packet.movementBoundary.supportValidity !== 'not_decided' ||
      packet.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      packet.movementBoundary.runtimeApproved !== 'not_approved' ||
      packet.movementBoundary.publicApproved !== 'not_approved' ||
      packet.movementBoundary.publicRelease !== 'not_approved' ||
      packet.movementBoundary.publication !== 'not_published' ||
      packet.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      packet.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'human_review_packet_must_not_move_validity_public_promotion_or_learning',
  );
  pushIf(
    !packet.notNow.includes('no_human_review_execution_by_codex') ||
      !packet.notNow.includes('no_reviewer_assignment_by_codex') ||
      !packet.notNow.includes('no_source_or_support_validity_decision') ||
      !packet.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !packet.notNow.includes('no_public_page_filling_from_unpromoted_kernel') ||
      !packet.notNow.includes('no_learning_update'),
    errors,
    'human_review_packet_not_now_must_block_review_execution_validity_runtime_public_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_human_review_packet_valid'
        : 'kernel_corpus_human_review_packet_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_CORE_PROGRESS_CLASSES],
  };
}
