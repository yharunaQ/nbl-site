import {
  type AxiomCandidatePublicPageHoldCategory,
  type AxiomCandidatePublicPageHoldCheck,
  type AxiomCandidatePublicPageHoldUnit,
  type AxiomInternalCandidatePublicPageHoldPacket,
  buildAxiomInternalCandidatePublicPageHoldPacket,
  validateAxiomInternalCandidatePublicPageHoldPacket,
} from './siteInternalCandidatePublicPageHoldPacket';
import { buildAxiomInternalCandidatePublicPagePreviewAssembly } from './siteInternalCandidatePublicPagePreviewAssembly';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY =
  'axiom_internal_candidate_release_readiness_ledger_is_internal_status_not_public_approval_public_navigation_candidate_promotion_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_ROUTE =
  '/internal/axiom-next-nbl-candidate-release-readiness-ledger' as const;

export type AxiomCandidateReleaseReadinessStatus =
  | 'internally_passed_not_released'
  | 'review_required_not_released'
  | 'held_until_founder_public_release_gate'
  | 'held_until_source_support_validity_review';

export type AxiomCandidateReleaseReadinessEntry = {
  entryId: string;
  sourceHoldCheckId: string;
  category: AxiomCandidatePublicPageHoldCategory;
  readinessStatus: AxiomCandidateReleaseReadinessStatus;
  releaseBlocker: true;
  candidatePromotionBlocker: true;
  publicNavigationBlocker: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomCandidateReleaseReadinessLedgerUnit = {
  unitId: string;
  unitType:
    | 'surface_candidate_release_readiness'
    | 'cross_candidate_release_readiness'
    | 'gate8_candidate_release_readiness';
  surface?: AxiomNextNblSiteSurface;
  sourceHoldUnitId: string;
  entryCount: number;
  entries: AxiomCandidateReleaseReadinessEntry[];
  releaseReadinessStatus: 'not_ready_public_release_hold';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidateReleaseReadinessLedger = {
  ledgerId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_release_readiness_ledger_prepared_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_ROUTE;
  sourceHoldPacketId: string;
  sourceHoldPacketStatus: AxiomInternalCandidatePublicPageHoldPacket['status'];
  sourceHoldPacketRequiredStatus: 'internal_candidate_public_page_hold_packet_prepared_not_released';
  releaseReadinessStatus: 'not_ready_public_release_hold';
  ledgerUnitCount: number;
  ledgerEntryCount: number;
  ledgerUnits: AxiomCandidateReleaseReadinessLedgerUnit[];
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    publicNavigation: 'not_added';
    falconCandidateSurfacePromotion: 'not_promoted';
    sourceValidity: 'not_decided';
    sourceCurrentness: 'not_decided';
    supportValidity: 'not_decided';
    candidatePattern: 'not_candidate_pattern';
    runtimeApproved: 'not_approved';
    publicApproved: 'not_approved';
    knowledgePromotion: 'not_promoted';
    learningUpdate: 'not_updated';
  };
};

export type AxiomInternalCandidateReleaseReadinessLedgerValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function readinessStatusForHoldCheck(
  check: AxiomCandidatePublicPageHoldCheck,
): AxiomCandidateReleaseReadinessStatus {
  if (check.category === 'regression_readiness') {
    return 'internally_passed_not_released';
  }
  if (check.category === 'source_currentness_hold') {
    return 'held_until_source_support_validity_review';
  }
  if (check.category === 'public_navigation_release_hold') {
    return 'held_until_founder_public_release_gate';
  }

  return 'review_required_not_released';
}

function buildReadinessEntry(
  unit: AxiomCandidatePublicPageHoldUnit,
  check: AxiomCandidatePublicPageHoldCheck,
): AxiomCandidateReleaseReadinessEntry {
  return {
    entryId: `axiom_candidate_release_readiness_${unit.unitId}_${check.category}`,
    sourceHoldCheckId: check.checkId,
    category: check.category,
    readinessStatus: readinessStatusForHoldCheck(check),
    releaseBlocker: true,
    candidatePromotionBlocker: true,
    publicNavigationBlocker: true,
    doesNotBlockInternalPreview: true,
  };
}

function buildLedgerUnit(
  holdUnit: AxiomCandidatePublicPageHoldUnit,
): AxiomCandidateReleaseReadinessLedgerUnit {
  const entries = holdUnit.holdChecks.map((check) => buildReadinessEntry(holdUnit, check));

  return {
    unitId: `axiom_candidate_release_readiness_${holdUnit.unitId}`,
    unitType:
      holdUnit.unitType === 'surface_candidate_public_page_hold'
        ? 'surface_candidate_release_readiness'
        : holdUnit.unitType === 'cross_candidate_public_page_hold'
          ? 'cross_candidate_release_readiness'
          : 'gate8_candidate_release_readiness',
    surface: holdUnit.surface,
    sourceHoldUnitId: holdUnit.unitId,
    entryCount: entries.length,
    entries,
    releaseReadinessStatus: 'not_ready_public_release_hold',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidateReleaseReadinessLedger(
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidateReleaseReadinessLedger {
  const ledgerUnits = sourceHoldPacket.holdUnits.map((holdUnit) => buildLedgerUnit(holdUnit));

  return {
    ledgerId: `axiom_internal_candidate_release_readiness_ledger_from_${sourceHoldPacket.packetId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_release_readiness_ledger_prepared_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_ROUTE,
    sourceHoldPacketId: sourceHoldPacket.packetId,
    sourceHoldPacketStatus: sourceHoldPacket.status,
    sourceHoldPacketRequiredStatus:
      'internal_candidate_public_page_hold_packet_prepared_not_released',
    releaseReadinessStatus: 'not_ready_public_release_hold',
    ledgerUnitCount: ledgerUnits.length,
    ledgerEntryCount: ledgerUnits.reduce((sum, unit) => sum + unit.entryCount, 0),
    ledgerUnits,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    movementBoundary: {
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      publicApproval: 'not_approved',
      publication: 'not_published',
      publicNavigation: 'not_added',
      falconCandidateSurfacePromotion: 'not_promoted',
      sourceValidity: 'not_decided',
      sourceCurrentness: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      knowledgePromotion: 'not_promoted',
      learningUpdate: 'not_updated',
    },
  };
}

export function validateAxiomInternalCandidateReleaseReadinessLedger(
  ledger: AxiomInternalCandidateReleaseReadinessLedger,
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket,
): AxiomInternalCandidateReleaseReadinessLedgerValidation {
  const errors: string[] = [];
  const previewAssembly = buildAxiomInternalCandidatePublicPagePreviewAssembly();
  const holdPacketValidation = validateAxiomInternalCandidatePublicPageHoldPacket(
    sourceHoldPacket,
    previewAssembly,
  );
  const ledgerSurfaces = ledger.ledgerUnits
    .filter((unit) => unit.unitType === 'surface_candidate_release_readiness')
    .map((unit) => unit.surface);

  pushIf(!holdPacketValidation.valid, errors, 'source_hold_packet_must_validate');
  pushIf(
    sourceHoldPacket.status !== 'internal_candidate_public_page_hold_packet_prepared_not_released',
    errors,
    'source_hold_packet_must_remain_prepared_not_released',
  );
  pushIf(ledger.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    ledger.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    ledger.status !== 'internal_candidate_release_readiness_ledger_prepared_not_released',
    errors,
    'status_must_remain_release_readiness_ledger_prepared_not_released',
  );
  pushIf(
    ledger.boundary !== AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY,
    errors,
    'boundary_must_remain_internal_status_not_public_approval_navigation_promotion_or_release',
  );
  pushIf(
    ledger.route !== AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_ROUTE,
    errors,
    'route_must_remain_internal_release_readiness_ledger',
  );
  pushIf(
    ledger.sourceHoldPacketId !== sourceHoldPacket.packetId,
    errors,
    'source_hold_packet_id_mismatch',
  );
  pushIf(
    ledger.sourceHoldPacketStatus !== sourceHoldPacket.status,
    errors,
    'source_hold_packet_status_mismatch',
  );
  pushIf(
    ledger.sourceHoldPacketRequiredStatus !==
      'internal_candidate_public_page_hold_packet_prepared_not_released',
    errors,
    'source_hold_packet_required_status_must_remain_prepared_not_released',
  );
  pushIf(
    ledger.releaseReadinessStatus !== 'not_ready_public_release_hold',
    errors,
    'release_readiness_status_must_remain_not_ready_public_release_hold',
  );
  pushIf(
    ledger.ledgerUnitCount !== sourceHoldPacket.holdUnitCount,
    errors,
    'ledger_unit_count_must_match_hold_units',
  );
  pushIf(
    ledger.ledgerUnitCount !== ledger.ledgerUnits.length,
    errors,
    'ledger_unit_count_mismatch',
  );
  pushIf(
    ledger.ledgerEntryCount !== ledger.ledgerUnits.reduce((sum, unit) => sum + unit.entryCount, 0),
    errors,
    'ledger_entry_count_mismatch',
  );
  pushIf(
    ledger.reviewExecutionStatus !== 'not_executed' ||
      ledger.reviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'review_must_not_be_executed_or_assigned_by_codex',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!ledgerSurfaces.includes(surface), errors, `surface_ledger_unit_missing:${surface}`);
  }
  pushIf(
    !ledger.ledgerUnits.some((unit) => unit.unitType === 'cross_candidate_release_readiness'),
    errors,
    'cross_candidate_release_readiness_missing',
  );
  pushIf(
    !ledger.ledgerUnits.some((unit) => unit.unitType === 'gate8_candidate_release_readiness'),
    errors,
    'gate8_candidate_release_readiness_missing',
  );

  for (const unit of ledger.ledgerUnits) {
    const sourceHoldUnit = sourceHoldPacket.holdUnits.find(
      (holdUnit) => holdUnit.unitId === unit.sourceHoldUnitId,
    );

    pushIf(!sourceHoldUnit, errors, `source_hold_unit_missing:${unit.unitId}`);
    if (sourceHoldUnit) {
      pushIf(
        unit.entryCount !== sourceHoldUnit.holdCheckCount ||
          unit.entryCount !== unit.entries.length,
        errors,
        `ledger_unit_entry_count_mismatch:${unit.unitId}`,
      );
      for (const entry of unit.entries) {
        const sourceHoldCheck = sourceHoldUnit.holdChecks.find(
          (check) => check.checkId === entry.sourceHoldCheckId,
        );

        pushIf(!sourceHoldCheck, errors, `ledger_entry_source_hold_check_missing:${entry.entryId}`);
        if (sourceHoldCheck) {
          pushIf(
            entry.category !== sourceHoldCheck.category ||
              entry.readinessStatus !== readinessStatusForHoldCheck(sourceHoldCheck),
            errors,
            `ledger_entry_source_mismatch:${entry.entryId}`,
          );
        }
        pushIf(
          entry.releaseBlocker !== true ||
            entry.candidatePromotionBlocker !== true ||
            entry.publicNavigationBlocker !== true ||
            entry.doesNotBlockInternalPreview !== true,
          errors,
          `ledger_entry_boundary_flags_invalid:${entry.entryId}`,
        );
      }
    }

    pushIf(
      unit.releaseReadinessStatus !== 'not_ready_public_release_hold' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `ledger_unit_must_remain_not_ready_and_blocking:${unit.unitId}`,
    );
  }

  pushIf(
    ledger.movementBoundary.runtime !== 'not_changed' ||
      ledger.movementBoundary.prompt !== 'not_changed' ||
      ledger.movementBoundary.retrieval !== 'not_changed' ||
      ledger.movementBoundary.modelProvider !== 'not_changed' ||
      ledger.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    ledger.movementBoundary.publicApproval !== 'not_approved' ||
      ledger.movementBoundary.publication !== 'not_published' ||
      ledger.movementBoundary.publicNavigation !== 'not_added' ||
      ledger.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      ledger.movementBoundary.sourceValidity !== 'not_decided' ||
      ledger.movementBoundary.sourceCurrentness !== 'not_decided' ||
      ledger.movementBoundary.supportValidity !== 'not_decided' ||
      ledger.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      ledger.movementBoundary.runtimeApproved !== 'not_approved' ||
      ledger.movementBoundary.publicApproved !== 'not_approved' ||
      ledger.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      ledger.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'release_readiness_ledger_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
