import {
  AXIOM_KERNEL_GROUNDED_FIELDS,
  type AxiomKernelGroundedField,
} from './interactionHypothesisKernelBuildGroundingContract';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomKernelCorpusManualDocumentReadout,
  validateAxiomKernelCorpusManualDocumentReadout,
  type AxiomKernelCorpusManualDocumentReadout,
} from './kernelCorpusManualDocumentReadout';
import {
  buildAxiomKernelCorpusReviewReadoutAdapter,
  validateAxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutAdapter,
} from './kernelCorpusReviewReadoutAdapter';
import {
  buildAxiomSourceFamilyKernelCoverageAudit,
  validateAxiomSourceFamilyKernelCoverageAudit,
  type AxiomSourceFamilyKernelCoverageAudit,
} from './sourceFamilyKernelCoverageAudit';

export const AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY =
  'axiom_kernel_corpus_sufficiency_gate_checks_internal_kernel_readiness_not_public_approval_or_promotion' as const;

export const AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_grounding',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusSufficiencyGateCheckId =
  | 'corpus_has_15_items'
  | 'all_core_eligible_source_families_represented'
  | 'five_l3_scenarios_covered'
  | 'all_grounded_fields_covered'
  | 'all_items_pass_eval'
  | 'all_items_review_routed'
  | 'review_budget_under_100'
  | 'display_contract_hides_raw_public_and_validity_fields'
  | 'delivery_layer_excluded_from_core_truth'
  | 'movement_boundaries_not_moved';

export type AxiomKernelCorpusSufficiencyGateCheck = {
  checkId: AxiomKernelCorpusSufficiencyGateCheckId;
  passed: boolean;
  expected: string;
  actual: string;
};

export type AxiomKernelCorpusSufficiencyGate = {
  gateId: string;
  objectType: 'axiom_kernel_corpus_sufficiency_gate';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_VERSION;
  lane: 'Falcon Lab';
  status:
    | 'passed_internal_kernel_sufficiency_gate_not_public_or_promotion'
    | 'failed_internal_kernel_sufficiency_gate_not_public_or_promotion';
  boundary: typeof AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_CORE_PROGRESS_CLASSES;
  sourceReadoutId: string;
  sourceAdapterId: string;
  sourceCoverageAuditId: string;
  checkCount: number;
  passedCheckCount: number;
  failedCheckCount: number;
  checks: AxiomKernelCorpusSufficiencyGateCheck[];
  nextAllowedMovement:
    | 'internal_slot_planning_allowed_from_kernel_corpus_not_public_page_filling'
    | 'repair_kernel_corpus_before_slot_planning';
  guardrails: {
    publicApproval: 'not_approved';
    publication: 'not_started';
    sourceSupportValidity: 'not_decided';
    runtimePromptRetrievalModelProviderDbSchema: 'not_changed';
    candidatePattern: 'not_candidate_pattern';
    learningUpdate: 'not_promoted';
  };
  notNow: string[];
};

export type AxiomKernelCorpusSufficiencyGateValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_sufficiency_gate_valid'
    | 'kernel_corpus_sufficiency_gate_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_CORE_PROGRESS_CLASSES;
};

type AxiomKernelCorpusReviewReadoutHiddenField =
  AxiomKernelCorpusReviewReadoutAdapter['displayContract']['hide'][number];

const REQUIRED_HIDDEN_DISPLAY_FIELDS: AxiomKernelCorpusReviewReadoutHiddenField[] = [
  'raw_original',
  'source_text',
  'field_values',
  'public_recommendation',
  'source_support_validity',
];

function check(
  checkId: AxiomKernelCorpusSufficiencyGateCheckId,
  passed: boolean,
  expected: string,
  actual: string,
): AxiomKernelCorpusSufficiencyGateCheck {
  return { checkId, passed, expected, actual };
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

export function buildAxiomKernelCorpusSufficiencyGate(
  readout: AxiomKernelCorpusManualDocumentReadout = buildAxiomKernelCorpusManualDocumentReadout(),
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(
    readout,
  ),
  coverageAudit: AxiomSourceFamilyKernelCoverageAudit =
    buildAxiomSourceFamilyKernelCoverageAudit(undefined, adapter),
): AxiomKernelCorpusSufficiencyGate {
  const scenarioCount = new Set(readout.corpusItems.map((item) => item.scenarioId)).size;
  const allGroundedFieldsCovered = AXIOM_KERNEL_GROUNDED_FIELDS.every(
    (field) => readout.aggregate.groundedFieldCoverage[field] === 'covered',
  );
  const representedCoreEligible = coverageAudit.summary.representedCoreEligibleEntryCount;
  const coreEligible = coverageAudit.summary.coreEligibleEntryCount;
  const deliveryExcluded = coverageAudit.entries.some(
    (entry) =>
      entry.entryId === 'source_family_falcon_heron_delivery_artifacts' &&
      entry.corpusCoverageStatus === 'excluded_delivery_layer_not_core_kernel',
  );
  const displayHidesRequiredFields = REQUIRED_HIDDEN_DISPLAY_FIELDS.every(
    (field) => adapter.displayContract.hide.includes(field),
  );

  const checks = [
    check('corpus_has_15_items', readout.totalPacketCount === 15, '15', String(readout.totalPacketCount)),
    check(
      'all_core_eligible_source_families_represented',
      representedCoreEligible === coreEligible && coreEligible === 10,
      '10 / 10 represented',
      `${representedCoreEligible} / ${coreEligible} represented`,
    ),
    check('five_l3_scenarios_covered', scenarioCount === 5, '5 scenarios', `${scenarioCount} scenarios`),
    check(
      'all_grounded_fields_covered',
      allGroundedFieldsCovered,
      AXIOM_KERNEL_GROUNDED_FIELDS.join(', '),
      Object.entries(readout.aggregate.groundedFieldCoverage)
        .filter(([, status]) => status === 'covered')
        .map(([field]) => field)
        .join(', '),
    ),
    check(
      'all_items_pass_eval',
      readout.aggregate.evalPassingItemCount === readout.totalPacketCount,
      `${readout.totalPacketCount} passing items`,
      `${readout.aggregate.evalPassingItemCount} passing items`,
    ),
    check(
      'all_items_review_routed',
      readout.corpusItems.every((item) => item.reviewUnitIds.length > 0),
      'all items review-routed',
      `${readout.corpusItems.filter((item) => item.reviewUnitIds.length > 0).length} review-routed items`,
    ),
    check(
      'review_budget_under_100',
      readout.totalReviewNavigationUnitCount <= readout.maxCoreHumanReviewUnits,
      '<= 100 review units',
      `${readout.totalReviewNavigationUnitCount} review units`,
    ),
    check(
      'display_contract_hides_raw_public_and_validity_fields',
      displayHidesRequiredFields,
      'hide raw/source/field/public/validity fields',
      adapter.displayContract.hide.join(', '),
    ),
    check(
      'delivery_layer_excluded_from_core_truth',
      deliveryExcluded,
      'Falcon/Heron delivery artifacts excluded',
      deliveryExcluded ? 'excluded' : 'not excluded',
    ),
    check(
      'movement_boundaries_not_moved',
      [
        'no_source_or_support_validity_decision',
        'no_public_approval_or_publication',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ].every((item) => readout.notNow.includes(item) && adapter.notNow.includes(item)),
      'validity/public/runtime/learning blocked',
      'validity/public/runtime/learning guardrails inspected',
    ),
  ] satisfies AxiomKernelCorpusSufficiencyGateCheck[];
  const failedCheckCount = checks.filter((item) => !item.passed).length;

  return {
    gateId: 'axiom_kernel_corpus_sufficiency_gate_v0_2026_06_08',
    objectType: 'axiom_kernel_corpus_sufficiency_gate',
    contractVersion: AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_VERSION,
    lane: 'Falcon Lab',
    status:
      failedCheckCount === 0
        ? 'passed_internal_kernel_sufficiency_gate_not_public_or_promotion'
        : 'failed_internal_kernel_sufficiency_gate_not_public_or_promotion',
    boundary: AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_CORE_PROGRESS_CLASSES],
    sourceReadoutId: readout.readoutId,
    sourceAdapterId: adapter.adapterId,
    sourceCoverageAuditId: coverageAudit.auditId,
    checkCount: checks.length,
    passedCheckCount: checks.length - failedCheckCount,
    failedCheckCount,
    checks,
    nextAllowedMovement:
      failedCheckCount === 0
        ? 'internal_slot_planning_allowed_from_kernel_corpus_not_public_page_filling'
        : 'repair_kernel_corpus_before_slot_planning',
    guardrails: {
      publicApproval: 'not_approved',
      publication: 'not_started',
      sourceSupportValidity: 'not_decided',
      runtimePromptRetrievalModelProviderDbSchema: 'not_changed',
      candidatePattern: 'not_candidate_pattern',
      learningUpdate: 'not_promoted',
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
      ...adapter.notNow,
      ...coverageAudit.notNow,
    ],
  };
}

export function validateAxiomKernelCorpusSufficiencyGate(
  gate: AxiomKernelCorpusSufficiencyGate,
  readout: AxiomKernelCorpusManualDocumentReadout = buildAxiomKernelCorpusManualDocumentReadout(),
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(
    readout,
  ),
  coverageAudit: AxiomSourceFamilyKernelCoverageAudit =
    buildAxiomSourceFamilyKernelCoverageAudit(undefined, adapter),
): AxiomKernelCorpusSufficiencyGateValidation {
  const errors: string[] = [];
  const readoutValidation = validateAxiomKernelCorpusManualDocumentReadout(readout);
  const adapterValidation = validateAxiomKernelCorpusReviewReadoutAdapter(adapter, readout);
  const coverageValidation = validateAxiomSourceFamilyKernelCoverageAudit(coverageAudit, undefined, adapter);
  const checkIds = new Set(gate.checks.map((item) => item.checkId));

  pushIf(!readoutValidation.valid, errors, 'source_manual_document_readout_must_be_valid');
  pushIf(!adapterValidation.valid, errors, 'source_review_readout_adapter_must_be_valid');
  pushIf(!coverageValidation.valid, errors, 'source_family_coverage_audit_must_be_valid');
  pushIf(
    gate.objectType !== 'axiom_kernel_corpus_sufficiency_gate',
    errors,
    'object_type_must_match_kernel_corpus_sufficiency_gate',
  );
  pushIf(
    gate.contractVersion !== AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_VERSION,
    errors,
    'contract_version_must_match_kernel_corpus_sufficiency_gate_v0_2026_06_08',
  );
  pushIf(gate.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    gate.boundary !== AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY,
    errors,
    'boundary_must_remain_sufficiency_gate_not_public_approval_or_promotion',
  );
  pushIf(
    gate.checkCount !== 10 ||
      gate.checks.length !== 10 ||
      gate.passedCheckCount !== gate.checks.filter((item) => item.passed).length ||
      gate.failedCheckCount !== gate.checks.filter((item) => !item.passed).length,
    errors,
    'sufficiency_gate_check_counts_must_match_checks',
  );
  for (const requiredCheckId of [
    'corpus_has_15_items',
    'all_core_eligible_source_families_represented',
    'five_l3_scenarios_covered',
    'all_grounded_fields_covered',
    'all_items_pass_eval',
    'all_items_review_routed',
    'review_budget_under_100',
    'display_contract_hides_raw_public_and_validity_fields',
    'delivery_layer_excluded_from_core_truth',
    'movement_boundaries_not_moved',
  ] satisfies AxiomKernelCorpusSufficiencyGateCheckId[]) {
    pushIf(!checkIds.has(requiredCheckId), errors, `sufficiency_gate_check_missing:${requiredCheckId}`);
  }
  pushIf(
    gate.failedCheckCount !== 0 ||
      gate.status !== 'passed_internal_kernel_sufficiency_gate_not_public_or_promotion',
    errors,
    'sufficiency_gate_must_pass_before_internal_slot_planning',
  );
  pushIf(
    gate.nextAllowedMovement !==
      'internal_slot_planning_allowed_from_kernel_corpus_not_public_page_filling',
    errors,
    'sufficiency_gate_next_movement_must_be_internal_slot_planning_only',
  );
  pushIf(
    gate.guardrails.publicApproval !== 'not_approved' ||
      gate.guardrails.publication !== 'not_started' ||
      gate.guardrails.sourceSupportValidity !== 'not_decided' ||
      gate.guardrails.runtimePromptRetrievalModelProviderDbSchema !== 'not_changed' ||
      gate.guardrails.candidatePattern !== 'not_candidate_pattern' ||
      gate.guardrails.learningUpdate !== 'not_promoted',
    errors,
    'sufficiency_gate_guardrails_must_not_move_public_validity_runtime_pattern_or_learning',
  );
  pushIf(
    !gate.notNow.includes('no_source_or_support_validity_decision') ||
      !gate.notNow.includes('no_public_approval_or_publication') ||
      !gate.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !gate.notNow.includes('no_learning_update'),
    errors,
    'sufficiency_gate_not_now_must_block_validity_public_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_sufficiency_gate_valid'
        : 'kernel_corpus_sufficiency_gate_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_CORE_PROGRESS_CLASSES],
  };
}
