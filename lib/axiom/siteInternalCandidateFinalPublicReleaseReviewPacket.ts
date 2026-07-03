import {
  type AxiomCandidatePublicNavigationReleaseRouteUnit,
  type AxiomInternalCandidatePublicNavigationReleaseRouteShell,
  type AxiomPublicNavigationReleaseRouteOption,
  type AxiomPublicNavigationReleaseRouteRequirement,
  buildAxiomInternalCandidatePublicNavigationReleaseRouteShell,
  validateAxiomInternalCandidatePublicNavigationReleaseRouteShell,
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

export const AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY =
  'axiom_internal_candidate_final_public_release_review_packet_is_review_input_not_public_approval_publication_actual_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_ROUTE =
  '/internal/axiom-next-nbl-candidate-final-public-release-review-packet' as const;

export type AxiomFinalPublicReleaseReviewRequirement =
  | 'founder_final_public_release_review_required'
  | 'human_review_execution_required_outside_codex'
  | 'public_navigation_authorization_required_outside_codex'
  | 'source_support_validity_decision_required_outside_codex'
  | 'public_boundary_accessibility_regression_receipt_required'
  | 'rollback_correction_and_no_intake_boundary_required'
  | 'runtime_prompt_retrieval_model_db_freeze_required'
  | 'learning_update_block_required';

export type AxiomFinalPublicReleaseReviewOption =
  | 'continue_internal_hold'
  | 'return_to_navigation_route_shell_revision'
  | 'request_external_final_release_review'
  | 'prepare_no_release_status_packet';

export type AxiomCandidateFinalPublicReleaseReviewUnit = {
  unitId: string;
  unitType:
    | 'surface_final_public_release_review_input'
    | 'cross_final_public_release_review_input'
    | 'gate8_final_public_release_review_input';
  surface?: AxiomNextNblSiteSurface;
  sourceNavigationUnitId: string;
  sourceNavigationRouteRequirements: AxiomPublicNavigationReleaseRouteRequirement[];
  sourceNavigationRouteOptions: AxiomPublicNavigationReleaseRouteOption[];
  sourceRouteActivationStatus: 'not_activated';
  sourceActualPublicNavigationStatus: 'not_added';
  sourcePublicApprovalStatus: 'not_approved';
  sourcePublicationStatus: 'not_published';
  requiredFinalReviewRequirements: AxiomFinalPublicReleaseReviewRequirement[];
  finalReviewOptions: AxiomFinalPublicReleaseReviewOption[];
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

export type AxiomInternalCandidateFinalPublicReleaseReviewPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_ROUTE;
  sourceNavigationRouteShellId: string;
  sourceNavigationRouteShellStatus: AxiomInternalCandidatePublicNavigationReleaseRouteShell['status'];
  sourceNavigationRouteShellRequiredStatus: 'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released';
  packetMode: 'final_public_release_review_input_only';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  releaseDecisionStatus: 'not_decided';
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  sourceSupportValidityStatus: 'not_decided';
  maxCoreReviewUnits: 100;
  reviewUnitCount: number;
  reviewUnits: AxiomCandidateFinalPublicReleaseReviewUnit[];
  nextAllowedMovement: 'founder_or_reviewer_can_execute_final_public_release_review_outside_codex_only';
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

export type AxiomInternalCandidateFinalPublicReleaseReviewPacketValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_FINAL_PUBLIC_RELEASE_REVIEW_REQUIREMENTS: AxiomFinalPublicReleaseReviewRequirement[] =
  [
    'founder_final_public_release_review_required',
    'human_review_execution_required_outside_codex',
    'public_navigation_authorization_required_outside_codex',
    'source_support_validity_decision_required_outside_codex',
    'public_boundary_accessibility_regression_receipt_required',
    'rollback_correction_and_no_intake_boundary_required',
    'runtime_prompt_retrieval_model_db_freeze_required',
    'learning_update_block_required',
  ];

const FINAL_PUBLIC_RELEASE_REVIEW_OPTIONS: AxiomFinalPublicReleaseReviewOption[] = [
  'continue_internal_hold',
  'return_to_navigation_route_shell_revision',
  'request_external_final_release_review',
  'prepare_no_release_status_packet',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function finalReviewUnitTypeForNavigationUnit(
  navigationUnit: AxiomCandidatePublicNavigationReleaseRouteUnit,
): AxiomCandidateFinalPublicReleaseReviewUnit['unitType'] {
  if (navigationUnit.unitType === 'surface_public_navigation_release_route_shell_review_input') {
    return 'surface_final_public_release_review_input';
  }
  if (navigationUnit.unitType === 'cross_public_navigation_release_route_shell_review_input') {
    return 'cross_final_public_release_review_input';
  }

  return 'gate8_final_public_release_review_input';
}

function buildFinalReviewUnit(
  navigationUnit: AxiomCandidatePublicNavigationReleaseRouteUnit,
): AxiomCandidateFinalPublicReleaseReviewUnit {
  return {
    unitId: `axiom_final_public_release_review_${navigationUnit.unitId}`,
    unitType: finalReviewUnitTypeForNavigationUnit(navigationUnit),
    surface: navigationUnit.surface,
    sourceNavigationUnitId: navigationUnit.unitId,
    sourceNavigationRouteRequirements: [...navigationUnit.requiredNavigationRouteRequirements],
    sourceNavigationRouteOptions: [...navigationUnit.routeShellOptions],
    sourceRouteActivationStatus: navigationUnit.routeActivationStatus,
    sourceActualPublicNavigationStatus: navigationUnit.actualPublicNavigationStatus,
    sourcePublicApprovalStatus: navigationUnit.publicApprovalStatus,
    sourcePublicationStatus: navigationUnit.publicationStatus,
    requiredFinalReviewRequirements: [...AXIOM_FINAL_PUBLIC_RELEASE_REVIEW_REQUIREMENTS],
    finalReviewOptions: [...FINAL_PUBLIC_RELEASE_REVIEW_OPTIONS],
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

export function buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(
  sourceNavigationRouteShell: AxiomInternalCandidatePublicNavigationReleaseRouteShell = buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(),
): AxiomInternalCandidateFinalPublicReleaseReviewPacket {
  const reviewUnits = sourceNavigationRouteShell.navigationUnits.map((navigationUnit) =>
    buildFinalReviewUnit(navigationUnit),
  );

  return {
    packetId: `axiom_internal_candidate_final_public_release_review_packet_from_${sourceNavigationRouteShell.shellId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_ROUTE,
    sourceNavigationRouteShellId: sourceNavigationRouteShell.shellId,
    sourceNavigationRouteShellStatus: sourceNavigationRouteShell.status,
    sourceNavigationRouteShellRequiredStatus:
      'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
    packetMode: 'final_public_release_review_input_only',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    releaseDecisionStatus: 'not_decided',
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    sourceSupportValidityStatus: 'not_decided',
    maxCoreReviewUnits: 100,
    reviewUnitCount: reviewUnits.length,
    reviewUnits,
    nextAllowedMovement:
      'founder_or_reviewer_can_execute_final_public_release_review_outside_codex_only',
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

export function validateAxiomInternalCandidateFinalPublicReleaseReviewPacket(
  packet: AxiomInternalCandidateFinalPublicReleaseReviewPacket,
  sourceNavigationRouteShell: AxiomInternalCandidatePublicNavigationReleaseRouteShell,
  sourceReleaseDecisionShell: AxiomInternalCandidatePublicReleaseDecisionPacketShell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(),
  sourceHandoffManifest: AxiomInternalCandidateSurfacePromotionHandoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(),
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(),
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidateFinalPublicReleaseReviewPacketValidation {
  const errors: string[] = [];
  const sourceValidation = validateAxiomInternalCandidatePublicNavigationReleaseRouteShell(
    sourceNavigationRouteShell,
    sourceReleaseDecisionShell,
    sourceHandoffManifest,
    sourcePromotionRequestPacket,
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const reviewUnitSurfaces = packet.reviewUnits
    .filter((unit) => unit.unitType === 'surface_final_public_release_review_input')
    .map((unit) => unit.surface);

  pushIf(!sourceValidation.valid, errors, 'source_navigation_route_shell_must_validate');
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_review_loop',
  );
  pushIf(
    packet.status !==
      'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
    errors,
    'status_must_remain_prepared_not_executed_not_approved_not_released',
  );
  pushIf(
    packet.boundary !== AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_review_input_not_public_approval_publication_actual_navigation_or_release',
  );
  pushIf(
    packet.route !== AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_ROUTE,
    errors,
    'route_must_remain_internal_final_public_release_review_packet',
  );
  pushIf(
    packet.sourceNavigationRouteShellId !== sourceNavigationRouteShell.shellId,
    errors,
    'source_navigation_route_shell_id_mismatch',
  );
  pushIf(
    packet.sourceNavigationRouteShellStatus !== sourceNavigationRouteShell.status,
    errors,
    'source_navigation_route_shell_status_mismatch',
  );
  pushIf(
    packet.sourceNavigationRouteShellRequiredStatus !==
      'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
    errors,
    'source_navigation_route_shell_required_status_must_remain_prepared_not_added_not_approved_not_released',
  );
  pushIf(
    packet.packetMode !== 'final_public_release_review_input_only',
    errors,
    'packet_mode_must_be_final_public_release_review_input_only',
  );
  pushIf(
    packet.reviewExecutionStatus !== 'not_executed' ||
      packet.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      packet.releaseDecisionStatus !== 'not_decided' ||
      packet.routeActivationStatus !== 'not_activated' ||
      packet.actualPublicNavigationStatus !== 'not_added' ||
      packet.publicApprovalStatus !== 'not_approved' ||
      packet.publicationStatus !== 'not_published' ||
      packet.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'packet_must_remain_unexecuted_unassigned_unactivated_unapproved_unpublished_and_undecided',
  );
  pushIf(packet.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    packet.reviewUnitCount !== sourceNavigationRouteShell.navigationUnitCount,
    errors,
    'review_unit_count_must_match_navigation_units',
  );
  pushIf(
    packet.reviewUnitCount !== packet.reviewUnits.length,
    errors,
    'review_unit_count_mismatch',
  );
  pushIf(
    packet.reviewUnitCount > packet.maxCoreReviewUnits,
    errors,
    'review_units_must_remain_under_100',
  );
  pushIf(
    packet.nextAllowedMovement !==
      'founder_or_reviewer_can_execute_final_public_release_review_outside_codex_only',
    errors,
    'next_allowed_movement_must_remain_outside_codex_final_review_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!reviewUnitSurfaces.includes(surface), errors, `surface_review_unit_missing:${surface}`);
  }
  pushIf(
    !packet.reviewUnits.some((unit) => unit.unitType === 'cross_final_public_release_review_input'),
    errors,
    'cross_final_public_release_review_input_missing',
  );
  pushIf(
    !packet.reviewUnits.some((unit) => unit.unitType === 'gate8_final_public_release_review_input'),
    errors,
    'gate8_final_public_release_review_input_missing',
  );

  for (const unit of packet.reviewUnits) {
    const sourceNavigationUnit = sourceNavigationRouteShell.navigationUnits.find(
      (navigationUnit) => navigationUnit.unitId === unit.sourceNavigationUnitId,
    );

    pushIf(!sourceNavigationUnit, errors, `source_navigation_unit_missing:${unit.unitId}`);
    if (sourceNavigationUnit) {
      pushIf(
        unit.unitType !== finalReviewUnitTypeForNavigationUnit(sourceNavigationUnit) ||
          unit.surface !== sourceNavigationUnit.surface ||
          unit.sourceRouteActivationStatus !== sourceNavigationUnit.routeActivationStatus ||
          unit.sourceActualPublicNavigationStatus !==
            sourceNavigationUnit.actualPublicNavigationStatus ||
          unit.sourcePublicApprovalStatus !== sourceNavigationUnit.publicApprovalStatus ||
          unit.sourcePublicationStatus !== sourceNavigationUnit.publicationStatus,
        errors,
        `review_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceNavigationUnit.requiredNavigationRouteRequirements) {
        pushIf(
          !unit.sourceNavigationRouteRequirements.includes(requirement),
          errors,
          `source_navigation_route_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const option of sourceNavigationUnit.routeShellOptions) {
        pushIf(
          !unit.sourceNavigationRouteOptions.includes(option),
          errors,
          `source_navigation_route_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_FINAL_PUBLIC_RELEASE_REVIEW_REQUIREMENTS) {
      pushIf(
        !unit.requiredFinalReviewRequirements.includes(requirement),
        errors,
        `final_review_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of FINAL_PUBLIC_RELEASE_REVIEW_OPTIONS) {
      pushIf(
        !unit.finalReviewOptions.includes(option),
        errors,
        `final_review_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.releaseDecisionStatus !== 'not_decided' ||
        unit.routeActivationStatus !== 'not_activated' ||
        unit.actualPublicNavigationStatus !== 'not_added' ||
        unit.publicApprovalStatus !== 'not_approved' ||
        unit.publicationStatus !== 'not_published' ||
        unit.sourceSupportValidityStatus !== 'not_decided',
      errors,
      `review_unit_must_remain_unexecuted_unassigned_unactivated_unapproved_unpublished_and_undecided:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `review_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

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
    packet.movementBoundary.publicApproval !== 'not_approved' ||
      packet.movementBoundary.publication !== 'not_published' ||
      packet.movementBoundary.publicNavigation !== 'not_added' ||
      packet.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      packet.movementBoundary.sourceValidity !== 'not_decided' ||
      packet.movementBoundary.sourceCurrentness !== 'not_decided' ||
      packet.movementBoundary.supportValidity !== 'not_decided' ||
      packet.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      packet.movementBoundary.runtimeApproved !== 'not_approved' ||
      packet.movementBoundary.publicApproved !== 'not_approved' ||
      packet.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      packet.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'final_public_release_review_packet_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
