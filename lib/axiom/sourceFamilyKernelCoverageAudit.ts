import {
  buildAxiomKernelCorpusReviewReadoutAdapter,
  validateAxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutAdapter,
} from './kernelCorpusReviewReadoutAdapter';
import {
  buildAxiomSourceFamilyUtilizationLedger,
  validateAxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationGroup,
  type AxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationStatus,
} from './sourceFamilyUtilizationLedger';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';

export const AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY =
  'axiom_source_family_kernel_coverage_audit_compares_corpus_coverage_without_source_validity_public_runtime_or_learning_movement' as const;

export const AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_CORE_PROGRESS_CLASSES = [
  'kernel_grounding',
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomSourceFamilyKernelCoverageStatus =
  | 'represented_in_current_kernel_corpus'
  | 'held_for_derived_non_sensitive_packet'
  | 'held_for_currentness_or_source_validity_review'
  | 'excluded_delivery_layer_not_core_kernel';

export type AxiomSourceFamilyKernelCoverageNextMovement =
  | 'covered_in_current_internal_corpus_pending_review'
  | 'packetize_derived_non_sensitive_before_kernel_integration'
  | 'source_validity_or_currentness_review_required_before_kernel_integration'
  | 'keep_as_delivery_layer_not_core_truth';

export type AxiomSourceFamilyKernelCoverageAuditEntry = {
  entryId: string;
  group: AxiomSourceFamilyUtilizationGroup;
  ledgerStatus: AxiomSourceFamilyUtilizationStatus;
  rowCount: number;
  corpusRowIds: string[];
  corpusCoverageStatus: AxiomSourceFamilyKernelCoverageStatus;
  nextMovement: AxiomSourceFamilyKernelCoverageNextMovement;
};

export type AxiomSourceFamilyKernelCoverageAudit = {
  auditId: string;
  objectType: 'axiom_source_family_kernel_coverage_audit';
  contractVersion: typeof AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_VERSION;
  lane: 'Falcon Lab';
  status: 'source_family_kernel_coverage_audit_ready';
  boundary: typeof AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY;
  strengthensCore: typeof AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_CORE_PROGRESS_CLASSES;
  sourceLedgerId: string;
  sourceReviewReadoutAdapterId: string;
  totalKernelRows: number;
  entries: AxiomSourceFamilyKernelCoverageAuditEntry[];
  summary: {
    totalLedgerEntries: number;
    coreEligibleEntryCount: number;
    representedCoreEligibleEntryCount: number;
    heldCoreEligibleEntryCount: number;
    excludedDeliveryLayerEntryCount: number;
    coverageStatus: 'all_current_core_eligible_families_represented_or_explicitly_held';
  };
  nextCorePacketTargets: string[];
  blockedTargets: string[];
  guardrails: {
    rawOriginalOpened: false;
    sourceTextExported: false;
    fieldValueExported: false;
    sourceSupportValidityDecision: 'not_decided';
    publicApproved: 'not_approved';
    runtimeApproved: 'not_approved';
    candidatePattern: 'not_candidate_pattern';
    learningUpdate: 'not_promoted';
  };
  notNow: string[];
};

export type AxiomSourceFamilyKernelCoverageAuditValidation = {
  valid: boolean;
  validationStatus:
    | 'source_family_kernel_coverage_audit_valid'
    | 'source_family_kernel_coverage_audit_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY;
  strengthensCore: typeof AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_CORE_PROGRESS_CLASSES;
};

function guardrails(): AxiomSourceFamilyKernelCoverageAudit['guardrails'] {
  return {
    rawOriginalOpened: false,
    sourceTextExported: false,
    fieldValueExported: false,
    sourceSupportValidityDecision: 'not_decided',
    publicApproved: 'not_approved',
    runtimeApproved: 'not_approved',
    candidatePattern: 'not_candidate_pattern',
    learningUpdate: 'not_promoted',
  };
}

function coverageStatus(
  ledgerStatus: AxiomSourceFamilyUtilizationStatus,
  rowCount: number,
): AxiomSourceFamilyKernelCoverageStatus {
  if (rowCount > 0) return 'represented_in_current_kernel_corpus';
  if (ledgerStatus === 'delivery_layer_not_core_kernel') {
    return 'excluded_delivery_layer_not_core_kernel';
  }
  if (ledgerStatus === 'hold_until_currentness_or_source_validity_review') {
    return 'held_for_currentness_or_source_validity_review';
  }
  return 'held_for_derived_non_sensitive_packet';
}

function nextMovement(
  status: AxiomSourceFamilyKernelCoverageStatus,
): AxiomSourceFamilyKernelCoverageNextMovement {
  if (status === 'represented_in_current_kernel_corpus') {
    return 'covered_in_current_internal_corpus_pending_review';
  }
  if (status === 'held_for_currentness_or_source_validity_review') {
    return 'source_validity_or_currentness_review_required_before_kernel_integration';
  }
  if (status === 'excluded_delivery_layer_not_core_kernel') {
    return 'keep_as_delivery_layer_not_core_truth';
  }
  return 'packetize_derived_non_sensitive_before_kernel_integration';
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function buildAxiomSourceFamilyKernelCoverageAudit(
  ledger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(),
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(),
): AxiomSourceFamilyKernelCoverageAudit {
  const adapterIndexBySourceFamily = new Map(
    adapter.sourceFamilyIndex.map((entry) => [entry.sourceFamilyEntryId, entry]),
  );
  const entries = ledger.entries.map((ledgerEntry) => {
    const adapterEntry = adapterIndexBySourceFamily.get(ledgerEntry.entryId);
    const status = coverageStatus(ledgerEntry.status, adapterEntry?.rowCount ?? 0);

    return {
      entryId: ledgerEntry.entryId,
      group: ledgerEntry.group,
      ledgerStatus: ledgerEntry.status,
      rowCount: adapterEntry?.rowCount ?? 0,
      corpusRowIds: adapterEntry?.rowIds ?? [],
      corpusCoverageStatus: status,
      nextMovement: nextMovement(status),
    } satisfies AxiomSourceFamilyKernelCoverageAuditEntry;
  });
  const coreEligibleEntries = entries.filter(
    (entry) => entry.corpusCoverageStatus !== 'excluded_delivery_layer_not_core_kernel',
  );
  const representedCoreEligibleEntries = coreEligibleEntries.filter(
    (entry) => entry.corpusCoverageStatus === 'represented_in_current_kernel_corpus',
  );
  const heldCoreEligibleEntries = coreEligibleEntries.filter((entry) =>
    entry.corpusCoverageStatus.startsWith('held_for_'),
  );

  return {
    auditId: 'axiom_source_family_kernel_coverage_audit_v0_2026_06_08',
    objectType: 'axiom_source_family_kernel_coverage_audit',
    contractVersion: AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_VERSION,
    lane: 'Falcon Lab',
    status: 'source_family_kernel_coverage_audit_ready',
    boundary: AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY,
    strengthensCore: [...AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_CORE_PROGRESS_CLASSES],
    sourceLedgerId: ledger.ledgerId,
    sourceReviewReadoutAdapterId: adapter.adapterId,
    totalKernelRows: adapter.rowCount,
    entries,
    summary: {
      totalLedgerEntries: entries.length,
      coreEligibleEntryCount: coreEligibleEntries.length,
      representedCoreEligibleEntryCount: representedCoreEligibleEntries.length,
      heldCoreEligibleEntryCount: heldCoreEligibleEntries.length,
      excludedDeliveryLayerEntryCount: entries.filter(
        (entry) => entry.corpusCoverageStatus === 'excluded_delivery_layer_not_core_kernel',
      ).length,
      coverageStatus: 'all_current_core_eligible_families_represented_or_explicitly_held',
    },
    nextCorePacketTargets: entries
      .filter((entry) => entry.nextMovement === 'packetize_derived_non_sensitive_before_kernel_integration')
      .map((entry) => entry.entryId),
    blockedTargets: entries
      .filter(
        (entry) =>
          entry.nextMovement ===
          'source_validity_or_currentness_review_required_before_kernel_integration',
      )
      .map((entry) => entry.entryId),
    guardrails: guardrails(),
    notNow: [
      'no_raw_original_or_source_text_read',
      'no_field_value_export',
      'no_source_or_support_validity_decision',
      'no_public_page_filling_from_unpromoted_kernel',
      'no_actual_public_navigation',
      'no_public_approval_or_publication',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...ledger.notNow,
      ...adapter.notNow,
    ],
  };
}

export function validateAxiomSourceFamilyKernelCoverageAudit(
  audit: AxiomSourceFamilyKernelCoverageAudit,
  ledger: AxiomSourceFamilyUtilizationLedger = buildAxiomSourceFamilyUtilizationLedger(),
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(),
): AxiomSourceFamilyKernelCoverageAuditValidation {
  const errors: string[] = [];
  const ledgerValidation = validateAxiomSourceFamilyUtilizationLedger(ledger);
  const adapterValidation = validateAxiomKernelCorpusReviewReadoutAdapter(adapter);
  const ledgerEntryIds = new Set(ledger.entries.map((entry) => entry.entryId));
  const auditEntryIds = new Set(audit.entries.map((entry) => entry.entryId));
  const adapterSourceFamilyIds = new Set(
    adapter.sourceFamilyIndex.map((entry) => entry.sourceFamilyEntryId),
  );
  const auditCoreEligibleEntries = audit.entries.filter(
    (entry) => entry.corpusCoverageStatus !== 'excluded_delivery_layer_not_core_kernel',
  );
  const auditRepresentedCoreEligibleEntries = auditCoreEligibleEntries.filter(
    (entry) => entry.corpusCoverageStatus === 'represented_in_current_kernel_corpus',
  );
  const auditHeldCoreEligibleEntries = auditCoreEligibleEntries.filter((entry) =>
    entry.corpusCoverageStatus.startsWith('held_for_'),
  );
  const auditExcludedDeliveryLayerEntries = audit.entries.filter(
    (entry) => entry.corpusCoverageStatus === 'excluded_delivery_layer_not_core_kernel',
  );

  pushIf(!ledgerValidation.valid, errors, 'source_family_ledger_must_be_valid');
  pushIf(!adapterValidation.valid, errors, 'kernel_corpus_review_readout_adapter_must_be_valid');
  pushIf(
    audit.objectType !== 'axiom_source_family_kernel_coverage_audit',
    errors,
    'object_type_must_match_source_family_kernel_coverage_audit',
  );
  pushIf(
    audit.contractVersion !== AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_VERSION,
    errors,
    'contract_version_must_match_source_family_kernel_coverage_audit_v0_2026_06_08',
  );
  pushIf(audit.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    audit.boundary !== AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY,
    errors,
    'boundary_must_remain_coverage_audit_not_source_validity_public_runtime_or_learning',
  );
  pushIf(
    audit.totalKernelRows !== adapter.rowCount || audit.totalKernelRows !== 15,
    errors,
    'coverage_audit_must_anchor_to_15_item_kernel_corpus',
  );
  pushIf(
    audit.entries.length !== ledger.entries.length ||
      audit.summary.totalLedgerEntries !== ledger.entries.length,
    errors,
    'coverage_audit_must_include_every_ledger_entry',
  );
  pushIf(
    audit.summary.totalLedgerEntries !== audit.entries.length ||
      audit.summary.coreEligibleEntryCount !== auditCoreEligibleEntries.length ||
      audit.summary.representedCoreEligibleEntryCount !==
        auditRepresentedCoreEligibleEntries.length ||
      audit.summary.heldCoreEligibleEntryCount !== auditHeldCoreEligibleEntries.length ||
      audit.summary.excludedDeliveryLayerEntryCount !== auditExcludedDeliveryLayerEntries.length,
    errors,
    'coverage_audit_summary_must_match_entries',
  );
  for (const entryId of ledgerEntryIds) {
    pushIf(!auditEntryIds.has(entryId), errors, `coverage_audit_missing_ledger_entry:${entryId}`);
  }
  for (const sourceFamilyId of adapterSourceFamilyIds) {
    pushIf(
      !ledgerEntryIds.has(sourceFamilyId),
      errors,
      `adapter_source_family_missing_from_ledger:${sourceFamilyId}`,
    );
  }
  for (const entry of audit.entries) {
    const isRepresented = adapterSourceFamilyIds.has(entry.entryId);
    pushIf(
      isRepresented && entry.corpusCoverageStatus !== 'represented_in_current_kernel_corpus',
      errors,
      `represented_source_family_must_be_marked_represented:${entry.entryId}`,
    );
    pushIf(
      !isRepresented &&
        entry.corpusCoverageStatus === 'represented_in_current_kernel_corpus',
      errors,
      `unrepresented_source_family_must_not_be_marked_represented:${entry.entryId}`,
    );
  }
  pushIf(
    audit.summary.coreEligibleEntryCount !== 10 ||
      audit.summary.representedCoreEligibleEntryCount !== 10 ||
      audit.summary.heldCoreEligibleEntryCount !== 0 ||
      audit.summary.excludedDeliveryLayerEntryCount !== 1,
    errors,
    'coverage_audit_summary_must_show_10_represented_0_held_1_delivery_excluded',
  );
  pushIf(
    audit.entries.some(
      (entry) =>
        entry.entryId === 'source_family_falcon_heron_delivery_artifacts' &&
        entry.corpusCoverageStatus !== 'excluded_delivery_layer_not_core_kernel',
    ),
    errors,
    'falcon_heron_delivery_artifacts_must_remain_excluded_from_core_truth',
  );
  pushIf(
    audit.nextCorePacketTargets.includes('source_family_manuals_and_documents'),
    errors,
    'manuals_and_documents_must_not_remain_next_core_packet_target_after_integration',
  );
  pushIf(
    audit.guardrails.rawOriginalOpened ||
      audit.guardrails.sourceTextExported ||
      audit.guardrails.fieldValueExported ||
      audit.guardrails.sourceSupportValidityDecision !== 'not_decided' ||
      audit.guardrails.publicApproved !== 'not_approved' ||
      audit.guardrails.runtimeApproved !== 'not_approved' ||
      audit.guardrails.candidatePattern !== 'not_candidate_pattern' ||
      audit.guardrails.learningUpdate !== 'not_promoted',
    errors,
    'coverage_audit_guardrails_must_not_move_raw_validity_public_runtime_pattern_or_learning',
  );
  pushIf(
    !audit.notNow.includes('no_source_or_support_validity_decision') ||
      !audit.notNow.includes('no_public_approval_or_publication') ||
      !audit.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !audit.notNow.includes('no_learning_update'),
    errors,
    'coverage_audit_not_now_must_block_validity_public_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'source_family_kernel_coverage_audit_valid'
        : 'source_family_kernel_coverage_audit_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY,
    strengthensCore: [...AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_CORE_PROGRESS_CLASSES],
  };
}
