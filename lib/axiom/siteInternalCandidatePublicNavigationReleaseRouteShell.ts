import {
  type AxiomCandidatePublicReleaseDecisionUnit,
  type AxiomPublicReleaseDecisionOption,
  type AxiomPublicReleaseDecisionRequirement,
  type AxiomInternalCandidatePublicReleaseDecisionPacketShell,
  buildAxiomInternalCandidatePublicReleaseDecisionPacketShell,
  validateAxiomInternalCandidatePublicReleaseDecisionPacketShell,
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

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY =
  'axiom_internal_candidate_public_navigation_release_route_shell_is_review_input_not_actual_public_navigation_public_approval_publication_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_ROUTE =
  '/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell' as const;

export type AxiomPublicNavigationReleaseRouteRequirement =
  | 'explicit_founder_public_navigation_decision_required'
  | 'public_release_decision_must_be_approved_outside_codex'
  | 'source_support_validity_must_be_decided_outside_codex'
  | 'public_boundary_and_accessibility_must_be_reviewed'
  | 'regression_receipt_must_be_current'
  | 'rollback_and_correction_route_must_exist'
  | 'no_personal_data_collection_or_case_intake_route'
  | 'no_runtime_or_learning_update_route';

export type AxiomPublicNavigationReleaseRouteOption =
  | 'keep_internal_only'
  | 'return_to_release_decision_shell_revision'
  | 'prepare_public_navigation_after_explicit_approval'
  | 'prepare_no_release_hold_notice';

export type AxiomCandidatePublicNavigationReleaseRouteUnit = {
  unitId: string;
  unitType:
    | 'surface_public_navigation_release_route_shell_review_input'
    | 'cross_public_navigation_release_route_shell_review_input'
    | 'gate8_public_navigation_release_route_shell_review_input';
  surface?: AxiomNextNblSiteSurface;
  sourceDecisionUnitId: string;
  sourceReleaseDecisionRequirements: AxiomPublicReleaseDecisionRequirement[];
  sourceReleaseDecisionOptions: AxiomPublicReleaseDecisionOption[];
  sourceReleaseDecisionStatus: 'not_decided';
  sourcePublicApprovalStatus: 'not_approved';
  sourcePublicationStatus: 'not_published';
  sourcePublicNavigationStatus: 'not_added';
  requiredNavigationRouteRequirements: AxiomPublicNavigationReleaseRouteRequirement[];
  routeShellOptions: AxiomPublicNavigationReleaseRouteOption[];
  routeActivationStatus: 'not_activated';
  actualPublicNavigationStatus: 'not_added';
  releaseDecisionStatus: 'not_decided';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceSupportValidityStatus: 'not_decided';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidatePublicNavigationReleaseRouteShell = {
  shellId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_ROUTE;
  sourceReleaseDecisionShellId: string;
  sourceReleaseDecisionShellStatus: AxiomInternalCandidatePublicReleaseDecisionPacketShell['status'];
  sourceReleaseDecisionShellRequiredStatus: 'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released';
  shellMode: 'public_navigation_release_route_review_input_only';
  releaseDecisionStatus: 'not_decided';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  actualPublicNavigationStatus: 'not_added';
  routeActivationStatus: 'not_activated';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceSupportValidityStatus: 'not_decided';
  maxCoreReviewUnits: 100;
  navigationUnitCount: number;
  navigationUnits: AxiomCandidatePublicNavigationReleaseRouteUnit[];
  nextAllowedMovement: 'founder_or_reviewer_can_authorize_public_navigation_outside_codex_only';
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

export type AxiomInternalCandidatePublicNavigationReleaseRouteShellValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_PUBLIC_NAVIGATION_RELEASE_ROUTE_REQUIREMENTS: AxiomPublicNavigationReleaseRouteRequirement[] =
  [
    'explicit_founder_public_navigation_decision_required',
    'public_release_decision_must_be_approved_outside_codex',
    'source_support_validity_must_be_decided_outside_codex',
    'public_boundary_and_accessibility_must_be_reviewed',
    'regression_receipt_must_be_current',
    'rollback_and_correction_route_must_exist',
    'no_personal_data_collection_or_case_intake_route',
    'no_runtime_or_learning_update_route',
  ];

const PUBLIC_NAVIGATION_RELEASE_ROUTE_OPTIONS: AxiomPublicNavigationReleaseRouteOption[] = [
  'keep_internal_only',
  'return_to_release_decision_shell_revision',
  'prepare_public_navigation_after_explicit_approval',
  'prepare_no_release_hold_notice',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function navigationUnitTypeForDecisionUnit(
  decisionUnit: AxiomCandidatePublicReleaseDecisionUnit,
): AxiomCandidatePublicNavigationReleaseRouteUnit['unitType'] {
  if (decisionUnit.unitType === 'surface_public_release_decision_shell_review_input') {
    return 'surface_public_navigation_release_route_shell_review_input';
  }
  if (decisionUnit.unitType === 'cross_public_release_decision_shell_review_input') {
    return 'cross_public_navigation_release_route_shell_review_input';
  }

  return 'gate8_public_navigation_release_route_shell_review_input';
}

function buildNavigationUnit(
  decisionUnit: AxiomCandidatePublicReleaseDecisionUnit,
): AxiomCandidatePublicNavigationReleaseRouteUnit {
  return {
    unitId: `axiom_public_navigation_release_route_shell_${decisionUnit.unitId}`,
    unitType: navigationUnitTypeForDecisionUnit(decisionUnit),
    surface: decisionUnit.surface,
    sourceDecisionUnitId: decisionUnit.unitId,
    sourceReleaseDecisionRequirements: [...decisionUnit.requiredReleaseDecisionRequirements],
    sourceReleaseDecisionOptions: [...decisionUnit.releaseDecisionOptions],
    sourceReleaseDecisionStatus: decisionUnit.releaseDecisionStatus,
    sourcePublicApprovalStatus: decisionUnit.publicApprovalStatus,
    sourcePublicationStatus: decisionUnit.publicationStatus,
    sourcePublicNavigationStatus: decisionUnit.publicNavigationStatus,
    requiredNavigationRouteRequirements: [...AXIOM_PUBLIC_NAVIGATION_RELEASE_ROUTE_REQUIREMENTS],
    routeShellOptions: [...PUBLIC_NAVIGATION_RELEASE_ROUTE_OPTIONS],
    routeActivationStatus: 'not_activated',
    actualPublicNavigationStatus: 'not_added',
    releaseDecisionStatus: 'not_decided',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    sourceSupportValidityStatus: 'not_decided',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(
  sourceReleaseDecisionShell: AxiomInternalCandidatePublicReleaseDecisionPacketShell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(),
): AxiomInternalCandidatePublicNavigationReleaseRouteShell {
  const navigationUnits = sourceReleaseDecisionShell.decisionUnits.map((decisionUnit) =>
    buildNavigationUnit(decisionUnit),
  );

  return {
    shellId: `axiom_internal_candidate_public_navigation_release_route_shell_from_${sourceReleaseDecisionShell.shellId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_ROUTE,
    sourceReleaseDecisionShellId: sourceReleaseDecisionShell.shellId,
    sourceReleaseDecisionShellStatus: sourceReleaseDecisionShell.status,
    sourceReleaseDecisionShellRequiredStatus:
      'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
    shellMode: 'public_navigation_release_route_review_input_only',
    releaseDecisionStatus: 'not_decided',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    actualPublicNavigationStatus: 'not_added',
    routeActivationStatus: 'not_activated',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    sourceSupportValidityStatus: 'not_decided',
    maxCoreReviewUnits: 100,
    navigationUnitCount: navigationUnits.length,
    navigationUnits,
    nextAllowedMovement: 'founder_or_reviewer_can_authorize_public_navigation_outside_codex_only',
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

export function validateAxiomInternalCandidatePublicNavigationReleaseRouteShell(
  shell: AxiomInternalCandidatePublicNavigationReleaseRouteShell,
  sourceReleaseDecisionShell: AxiomInternalCandidatePublicReleaseDecisionPacketShell,
  sourceHandoffManifest: AxiomInternalCandidateSurfacePromotionHandoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(),
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(),
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidatePublicNavigationReleaseRouteShellValidation {
  const errors: string[] = [];
  const sourceValidation = validateAxiomInternalCandidatePublicReleaseDecisionPacketShell(
    sourceReleaseDecisionShell,
    sourceHandoffManifest,
    sourcePromotionRequestPacket,
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const navigationUnitSurfaces = shell.navigationUnits
    .filter(
      (unit) => unit.unitType === 'surface_public_navigation_release_route_shell_review_input',
    )
    .map((unit) => unit.surface);

  pushIf(!sourceValidation.valid, errors, 'source_public_release_decision_shell_must_validate');
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_review_loop',
  );
  pushIf(
    shell.status !==
      'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
    errors,
    'status_must_remain_prepared_not_added_not_approved_not_released',
  );
  pushIf(
    shell.boundary !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_review_input_not_actual_public_navigation_approval_publication_or_release',
  );
  pushIf(
    shell.route !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_ROUTE,
    errors,
    'route_must_remain_internal_public_navigation_release_route_shell',
  );
  pushIf(
    shell.sourceReleaseDecisionShellId !== sourceReleaseDecisionShell.shellId,
    errors,
    'source_release_decision_shell_id_mismatch',
  );
  pushIf(
    shell.sourceReleaseDecisionShellStatus !== sourceReleaseDecisionShell.status,
    errors,
    'source_release_decision_shell_status_mismatch',
  );
  pushIf(
    shell.sourceReleaseDecisionShellRequiredStatus !==
      'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
    errors,
    'source_release_decision_shell_required_status_must_remain_prepared_not_decided_not_approved_not_released',
  );
  pushIf(
    shell.shellMode !== 'public_navigation_release_route_review_input_only',
    errors,
    'shell_mode_must_be_public_navigation_release_route_review_input_only',
  );
  pushIf(
    shell.releaseDecisionStatus !== 'not_decided' ||
      shell.publicApprovalStatus !== 'not_approved' ||
      shell.publicationStatus !== 'not_published' ||
      shell.actualPublicNavigationStatus !== 'not_added' ||
      shell.routeActivationStatus !== 'not_activated' ||
      shell.reviewExecutionStatus !== 'not_executed' ||
      shell.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      shell.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'shell_must_remain_unactivated_unapproved_unpublished_unexecuted_unassigned_and_undecided',
  );
  pushIf(shell.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    shell.navigationUnitCount !== sourceReleaseDecisionShell.decisionUnitCount,
    errors,
    'navigation_unit_count_must_match_release_decision_units',
  );
  pushIf(
    shell.navigationUnitCount !== shell.navigationUnits.length,
    errors,
    'navigation_unit_count_mismatch',
  );
  pushIf(
    shell.navigationUnitCount > shell.maxCoreReviewUnits,
    errors,
    'navigation_units_must_remain_under_100',
  );
  pushIf(
    shell.nextAllowedMovement !==
      'founder_or_reviewer_can_authorize_public_navigation_outside_codex_only',
    errors,
    'next_allowed_movement_must_remain_outside_codex_navigation_authorization_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !navigationUnitSurfaces.includes(surface),
      errors,
      `surface_navigation_unit_missing:${surface}`,
    );
  }
  pushIf(
    !shell.navigationUnits.some(
      (unit) => unit.unitType === 'cross_public_navigation_release_route_shell_review_input',
    ),
    errors,
    'cross_public_navigation_release_route_shell_review_input_missing',
  );
  pushIf(
    !shell.navigationUnits.some(
      (unit) => unit.unitType === 'gate8_public_navigation_release_route_shell_review_input',
    ),
    errors,
    'gate8_public_navigation_release_route_shell_review_input_missing',
  );

  for (const unit of shell.navigationUnits) {
    const sourceDecisionUnit = sourceReleaseDecisionShell.decisionUnits.find(
      (decisionUnit) => decisionUnit.unitId === unit.sourceDecisionUnitId,
    );

    pushIf(!sourceDecisionUnit, errors, `source_decision_unit_missing:${unit.unitId}`);
    if (sourceDecisionUnit) {
      pushIf(
        unit.unitType !== navigationUnitTypeForDecisionUnit(sourceDecisionUnit) ||
          unit.surface !== sourceDecisionUnit.surface ||
          unit.sourceReleaseDecisionStatus !== sourceDecisionUnit.releaseDecisionStatus ||
          unit.sourcePublicApprovalStatus !== sourceDecisionUnit.publicApprovalStatus ||
          unit.sourcePublicationStatus !== sourceDecisionUnit.publicationStatus ||
          unit.sourcePublicNavigationStatus !== sourceDecisionUnit.publicNavigationStatus,
        errors,
        `navigation_unit_source_mismatch:${unit.unitId}`,
      );
      for (const requirement of sourceDecisionUnit.requiredReleaseDecisionRequirements) {
        pushIf(
          !unit.sourceReleaseDecisionRequirements.includes(requirement),
          errors,
          `source_release_decision_requirement_missing:${unit.unitId}:${requirement}`,
        );
      }
      for (const option of sourceDecisionUnit.releaseDecisionOptions) {
        pushIf(
          !unit.sourceReleaseDecisionOptions.includes(option),
          errors,
          `source_release_decision_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_PUBLIC_NAVIGATION_RELEASE_ROUTE_REQUIREMENTS) {
      pushIf(
        !unit.requiredNavigationRouteRequirements.includes(requirement),
        errors,
        `navigation_route_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of PUBLIC_NAVIGATION_RELEASE_ROUTE_OPTIONS) {
      pushIf(
        !unit.routeShellOptions.includes(option),
        errors,
        `navigation_route_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.routeActivationStatus !== 'not_activated' ||
        unit.actualPublicNavigationStatus !== 'not_added' ||
        unit.releaseDecisionStatus !== 'not_decided' ||
        unit.publicApprovalStatus !== 'not_approved' ||
        unit.publicationStatus !== 'not_published' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.sourceSupportValidityStatus !== 'not_decided',
      errors,
      `navigation_unit_must_remain_unactivated_unapproved_unpublished_unexecuted_unassigned_and_undecided:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `navigation_unit_boundary_flags_invalid:${unit.unitId}`,
    );
  }

  pushIf(
    shell.movementBoundary.runtime !== 'not_changed' ||
      shell.movementBoundary.prompt !== 'not_changed' ||
      shell.movementBoundary.retrieval !== 'not_changed' ||
      shell.movementBoundary.modelProvider !== 'not_changed' ||
      shell.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    shell.movementBoundary.publicApproval !== 'not_approved' ||
      shell.movementBoundary.publication !== 'not_published' ||
      shell.movementBoundary.publicNavigation !== 'not_added' ||
      shell.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      shell.movementBoundary.sourceValidity !== 'not_decided' ||
      shell.movementBoundary.sourceCurrentness !== 'not_decided' ||
      shell.movementBoundary.supportValidity !== 'not_decided' ||
      shell.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      shell.movementBoundary.runtimeApproved !== 'not_approved' ||
      shell.movementBoundary.publicApproved !== 'not_approved' ||
      shell.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      shell.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'navigation_route_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
