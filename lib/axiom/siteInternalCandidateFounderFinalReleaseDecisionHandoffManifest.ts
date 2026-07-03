import {
  type AxiomCandidateFinalPublicReleaseReviewUnit,
  type AxiomFinalPublicReleaseReviewOption,
  type AxiomFinalPublicReleaseReviewRequirement,
  type AxiomInternalCandidateFinalPublicReleaseReviewPacket,
  buildAxiomInternalCandidateFinalPublicReleaseReviewPacket,
  validateAxiomInternalCandidateFinalPublicReleaseReviewPacket,
} from './siteInternalCandidateFinalPublicReleaseReviewPacket';
import {
  type AxiomInternalCandidatePublicNavigationReleaseRouteShell,
  buildAxiomInternalCandidatePublicNavigationReleaseRouteShell,
} from './siteInternalCandidatePublicNavigationReleaseRouteShell';
import {
  type AxiomInternalCandidatePublicReleaseDecisionPacketShell,
  buildAxiomInternalCandidatePublicReleaseDecisionPacketShell,
} from './siteInternalCandidatePublicReleaseDecisionPacketShell';
import {
  type AxiomInternalCandidateSurfacePromotionHandoffManifest,
  buildAxiomInternalCandidateSurfacePromotionHandoffManifest,
} from './siteInternalCandidateSurfacePromotionHandoffManifest';
import {
  type AxiomInternalCandidateSurfacePromotionRequestPacket,
  buildAxiomInternalCandidateSurfacePromotionRequestPacket,
} from './siteInternalCandidateSurfacePromotionRequestPacket';
import {
  type AxiomInternalCandidateReleaseReadinessLedger,
  buildAxiomInternalCandidateReleaseReadinessLedger,
} from './siteInternalCandidateReleaseReadinessLedger';
import {
  type AxiomInternalCandidatePublicPageHoldPacket,
  buildAxiomInternalCandidatePublicPageHoldPacket,
} from './siteInternalCandidatePublicPageHoldPacket';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY =
  'axiom_internal_candidate_founder_final_release_decision_handoff_manifest_is_handoff_input_not_review_execution_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_ROUTE =
  '/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest' as const;

export type AxiomFounderFinalReleaseDecisionHandoffRequirement =
  | 'founder_must_decide_outside_codex'
  | 'human_review_must_execute_outside_codex_before_release'
  | 'source_support_validity_must_be_decided_outside_codex_before_release'
  | 'public_navigation_must_not_activate_from_codex'
  | 'public_approval_and_publication_must_not_be_set_by_codex'
  | 'rollback_correction_no_intake_boundary_must_be_confirmed'
  | 'runtime_prompt_retrieval_model_db_must_remain_frozen'
  | 'learning_update_must_remain_blocked';

export type AxiomFounderFinalReleaseDecisionHandoffOption =
  | 'continue_internal_hold'
  | 'return_to_final_review_packet_revision'
  | 'send_to_founder_final_release_decision_outside_codex'
  | 'prepare_no_release_or_release_candidate_status_note';

export type AxiomCandidateFounderFinalReleaseDecisionHandoffUnit = {
  unitId: string;
  unitType:
    | 'surface_founder_final_release_decision_handoff_input'
    | 'cross_founder_final_release_decision_handoff_input'
    | 'gate8_founder_final_release_decision_handoff_input';
  surface?: AxiomNextNblSiteSurface;
  sourceFinalReviewUnitId: string;
  sourceFinalReviewRequirements: AxiomFinalPublicReleaseReviewRequirement[];
  sourceFinalReviewOptions: AxiomFinalPublicReleaseReviewOption[];
  sourceReviewExecutionStatus: 'not_executed';
  sourceReviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceReleaseDecisionStatus: 'not_decided';
  sourceRouteActivationStatus: 'not_activated';
  sourceActualPublicNavigationStatus: 'not_added';
  sourcePublicApprovalStatus: 'not_approved';
  sourcePublicationStatus: 'not_published';
  requiredHandoffRequirements: AxiomFounderFinalReleaseDecisionHandoffRequirement[];
  handoffDecisionOptions: AxiomFounderFinalReleaseDecisionHandoffOption[];
  handoffStatus: 'prepared_not_sent_by_codex';
  founderDecisionStatus: 'not_decided';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  releaseDecisionStatus: 'not_decided';
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  sourceSupportValidityStatus: 'not_decided';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest = {
  manifestId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_ROUTE;
  sourceFinalReviewPacketId: string;
  sourceFinalReviewPacketStatus: AxiomInternalCandidateFinalPublicReleaseReviewPacket['status'];
  sourceFinalReviewPacketRequiredStatus: 'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released';
  manifestMode: 'founder_final_release_decision_handoff_input_only';
  handoffStatus: 'prepared_not_sent_by_codex';
  founderDecisionStatus: 'not_decided';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  releaseDecisionStatus: 'not_decided';
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  sourceSupportValidityStatus: 'not_decided';
  maxCoreReviewUnits: 100;
  manifestUnitCount: number;
  manifestUnits: AxiomCandidateFounderFinalReleaseDecisionHandoffUnit[];
  nextAllowedMovement: 'founder_can_decide_final_release_outside_codex_only';
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

export type AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifestValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_REQUIREMENTS: AxiomFounderFinalReleaseDecisionHandoffRequirement[] =
  [
    'founder_must_decide_outside_codex',
    'human_review_must_execute_outside_codex_before_release',
    'source_support_validity_must_be_decided_outside_codex_before_release',
    'public_navigation_must_not_activate_from_codex',
    'public_approval_and_publication_must_not_be_set_by_codex',
    'rollback_correction_no_intake_boundary_must_be_confirmed',
    'runtime_prompt_retrieval_model_db_must_remain_frozen',
    'learning_update_must_remain_blocked',
  ];

const FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_OPTIONS: AxiomFounderFinalReleaseDecisionHandoffOption[] =
  [
    'continue_internal_hold',
    'return_to_final_review_packet_revision',
    'send_to_founder_final_release_decision_outside_codex',
    'prepare_no_release_or_release_candidate_status_note',
  ];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function handoffUnitTypeForFinalReviewUnit(
  reviewUnit: AxiomCandidateFinalPublicReleaseReviewUnit,
): AxiomCandidateFounderFinalReleaseDecisionHandoffUnit['unitType'] {
  if (reviewUnit.unitType === 'surface_final_public_release_review_input') {
    return 'surface_founder_final_release_decision_handoff_input';
  }
  if (reviewUnit.unitType === 'cross_final_public_release_review_input') {
    return 'cross_founder_final_release_decision_handoff_input';
  }

  return 'gate8_founder_final_release_decision_handoff_input';
}

function buildHandoffUnit(
  reviewUnit: AxiomCandidateFinalPublicReleaseReviewUnit,
): AxiomCandidateFounderFinalReleaseDecisionHandoffUnit {
  return {
    unitId: `axiom_founder_final_release_decision_handoff_${reviewUnit.unitId}`,
    unitType: handoffUnitTypeForFinalReviewUnit(reviewUnit),
    surface: reviewUnit.surface,
    sourceFinalReviewUnitId: reviewUnit.unitId,
    sourceFinalReviewRequirements: [...reviewUnit.requiredFinalReviewRequirements],
    sourceFinalReviewOptions: [...reviewUnit.finalReviewOptions],
    sourceReviewExecutionStatus: reviewUnit.reviewExecutionStatus,
    sourceReviewerAssignmentStatus: reviewUnit.reviewerAssignmentStatus,
    sourceReleaseDecisionStatus: reviewUnit.releaseDecisionStatus,
    sourceRouteActivationStatus: reviewUnit.routeActivationStatus,
    sourceActualPublicNavigationStatus: reviewUnit.actualPublicNavigationStatus,
    sourcePublicApprovalStatus: reviewUnit.publicApprovalStatus,
    sourcePublicationStatus: reviewUnit.publicationStatus,
    requiredHandoffRequirements: [...AXIOM_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_REQUIREMENTS],
    handoffDecisionOptions: [...FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_OPTIONS],
    handoffStatus: 'prepared_not_sent_by_codex',
    founderDecisionStatus: 'not_decided',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    releaseDecisionStatus: 'not_decided',
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    sourceSupportValidityStatus: 'not_decided',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(
  sourceFinalReviewPacket: AxiomInternalCandidateFinalPublicReleaseReviewPacket = buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(),
): AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest {
  const manifestUnits = sourceFinalReviewPacket.reviewUnits.map((reviewUnit) =>
    buildHandoffUnit(reviewUnit),
  );

  return {
    manifestId: `axiom_internal_candidate_founder_final_release_decision_handoff_manifest_from_${sourceFinalReviewPacket.packetId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_ROUTE,
    sourceFinalReviewPacketId: sourceFinalReviewPacket.packetId,
    sourceFinalReviewPacketStatus: sourceFinalReviewPacket.status,
    sourceFinalReviewPacketRequiredStatus:
      'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
    manifestMode: 'founder_final_release_decision_handoff_input_only',
    handoffStatus: 'prepared_not_sent_by_codex',
    founderDecisionStatus: 'not_decided',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    releaseDecisionStatus: 'not_decided',
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    sourceSupportValidityStatus: 'not_decided',
    maxCoreReviewUnits: 100,
    manifestUnitCount: manifestUnits.length,
    manifestUnits,
    nextAllowedMovement: 'founder_can_decide_final_release_outside_codex_only',
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

export function validateAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(
  manifest: AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
  sourceFinalReviewPacket: AxiomInternalCandidateFinalPublicReleaseReviewPacket,
  sourceNavigationRouteShell: AxiomInternalCandidatePublicNavigationReleaseRouteShell = buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(),
  sourceReleaseDecisionShell: AxiomInternalCandidatePublicReleaseDecisionPacketShell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(),
  sourceHandoffManifest: AxiomInternalCandidateSurfacePromotionHandoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(),
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(),
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifestValidation {
  const errors: string[] = [];
  const sourceValidation = validateAxiomInternalCandidateFinalPublicReleaseReviewPacket(
    sourceFinalReviewPacket,
    sourceNavigationRouteShell,
    sourceReleaseDecisionShell,
    sourceHandoffManifest,
    sourcePromotionRequestPacket,
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const manifestUnitSurfaces = manifest.manifestUnits
    .filter((unit) => unit.unitType === 'surface_founder_final_release_decision_handoff_input')
    .map((unit) => unit.surface);

  pushIf(
    !sourceValidation.valid,
    errors,
    'source_final_public_release_review_packet_must_validate',
  );
  pushIf(manifest.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    manifest.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_review_loop',
  );
  pushIf(
    manifest.status !==
      'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
    errors,
    'status_must_remain_prepared_not_sent_not_decided_not_released',
  );
  pushIf(
    manifest.boundary !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY,
    errors,
    'boundary_must_remain_handoff_input_not_review_execution_public_approval_publication_navigation_or_release',
  );
  pushIf(
    manifest.route !==
      AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_ROUTE,
    errors,
    'route_must_remain_internal_founder_final_release_decision_handoff_manifest',
  );
  pushIf(
    manifest.sourceFinalReviewPacketId !== sourceFinalReviewPacket.packetId,
    errors,
    'source_final_review_packet_id_mismatch',
  );
  pushIf(
    manifest.sourceFinalReviewPacketStatus !== sourceFinalReviewPacket.status,
    errors,
    'source_final_review_packet_status_mismatch',
  );
  pushIf(
    manifest.sourceFinalReviewPacketRequiredStatus !==
      'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
    errors,
    'source_final_review_packet_required_status_must_remain_prepared_not_executed_not_approved_not_released',
  );
  pushIf(
    manifest.manifestMode !== 'founder_final_release_decision_handoff_input_only',
    errors,
    'manifest_mode_must_be_founder_final_release_decision_handoff_input_only',
  );
  pushIf(
    manifest.handoffStatus !== 'prepared_not_sent_by_codex' ||
      manifest.founderDecisionStatus !== 'not_decided' ||
      manifest.reviewExecutionStatus !== 'not_executed' ||
      manifest.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      manifest.releaseDecisionStatus !== 'not_decided' ||
      manifest.routeActivationStatus !== 'not_activated' ||
      manifest.actualPublicNavigationStatus !== 'not_added' ||
      manifest.publicApprovalStatus !== 'not_approved' ||
      manifest.publicationStatus !== 'not_published' ||
      manifest.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'manifest_must_remain_unsent_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
  );
  pushIf(manifest.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    manifest.manifestUnitCount !== sourceFinalReviewPacket.reviewUnitCount,
    errors,
    'manifest_unit_count_must_match_final_review_units',
  );
  pushIf(
    manifest.manifestUnitCount !== manifest.manifestUnits.length,
    errors,
    'manifest_unit_count_mismatch',
  );
  pushIf(
    manifest.manifestUnitCount > manifest.maxCoreReviewUnits,
    errors,
    'manifest_units_must_remain_under_100',
  );
  pushIf(
    manifest.nextAllowedMovement !== 'founder_can_decide_final_release_outside_codex_only',
    errors,
    'next_allowed_movement_must_remain_founder_outside_codex_decision_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !manifestUnitSurfaces.includes(surface),
      errors,
      `surface_handoff_unit_missing:${surface}`,
    );
  }
  pushIf(
    !manifest.manifestUnits.some(
      (unit) => unit.unitType === 'cross_founder_final_release_decision_handoff_input',
    ),
    errors,
    'cross_founder_final_release_decision_handoff_input_missing',
  );
  pushIf(
    !manifest.manifestUnits.some(
      (unit) => unit.unitType === 'gate8_founder_final_release_decision_handoff_input',
    ),
    errors,
    'gate8_founder_final_release_decision_handoff_input_missing',
  );

  for (const unit of manifest.manifestUnits) {
    const sourceReviewUnit = sourceFinalReviewPacket.reviewUnits.find(
      (reviewUnit) => reviewUnit.unitId === unit.sourceFinalReviewUnitId,
    );

    pushIf(!sourceReviewUnit, errors, `source_final_review_unit_missing:${unit.unitId}`);
    if (sourceReviewUnit) {
      pushIf(
        unit.unitType !== handoffUnitTypeForFinalReviewUnit(sourceReviewUnit) ||
          unit.surface !== sourceReviewUnit.surface ||
          unit.sourceReviewExecutionStatus !== sourceReviewUnit.reviewExecutionStatus ||
          unit.sourceReviewerAssignmentStatus !== sourceReviewUnit.reviewerAssignmentStatus ||
          unit.sourceReleaseDecisionStatus !== sourceReviewUnit.releaseDecisionStatus ||
          unit.sourceRouteActivationStatus !== sourceReviewUnit.routeActivationStatus ||
          unit.sourceActualPublicNavigationStatus !==
            sourceReviewUnit.actualPublicNavigationStatus ||
          unit.sourcePublicApprovalStatus !== sourceReviewUnit.publicApprovalStatus ||
          unit.sourcePublicationStatus !== sourceReviewUnit.publicationStatus,
        errors,
        `handoff_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceReviewUnit.requiredFinalReviewRequirements) {
        pushIf(
          !unit.sourceFinalReviewRequirements.includes(requirement),
          errors,
          `source_final_review_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const option of sourceReviewUnit.finalReviewOptions) {
        pushIf(
          !unit.sourceFinalReviewOptions.includes(option),
          errors,
          `source_final_review_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_REQUIREMENTS) {
      pushIf(
        !unit.requiredHandoffRequirements.includes(requirement),
        errors,
        `handoff_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_OPTIONS) {
      pushIf(
        !unit.handoffDecisionOptions.includes(option),
        errors,
        `handoff_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.handoffStatus !== 'prepared_not_sent_by_codex' ||
        unit.founderDecisionStatus !== 'not_decided' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.releaseDecisionStatus !== 'not_decided' ||
        unit.routeActivationStatus !== 'not_activated' ||
        unit.actualPublicNavigationStatus !== 'not_added' ||
        unit.publicApprovalStatus !== 'not_approved' ||
        unit.publicationStatus !== 'not_published' ||
        unit.sourceSupportValidityStatus !== 'not_decided',
      errors,
      `handoff_unit_must_remain_unsent_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `handoff_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

  pushIf(
    manifest.movementBoundary.runtime !== 'not_changed' ||
      manifest.movementBoundary.prompt !== 'not_changed' ||
      manifest.movementBoundary.retrieval !== 'not_changed' ||
      manifest.movementBoundary.modelProvider !== 'not_changed' ||
      manifest.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    manifest.movementBoundary.publicApproval !== 'not_approved' ||
      manifest.movementBoundary.publication !== 'not_published' ||
      manifest.movementBoundary.publicNavigation !== 'not_added' ||
      manifest.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      manifest.movementBoundary.sourceValidity !== 'not_decided' ||
      manifest.movementBoundary.sourceCurrentness !== 'not_decided' ||
      manifest.movementBoundary.supportValidity !== 'not_decided' ||
      manifest.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      manifest.movementBoundary.runtimeApproved !== 'not_approved' ||
      manifest.movementBoundary.publicApproved !== 'not_approved' ||
      manifest.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      manifest.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'founder_final_release_decision_handoff_manifest_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
