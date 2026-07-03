import {
  type AxiomCandidateSurfacePromotionHandoffManifestUnit,
  type AxiomCandidateSurfacePromotionHandoffDecisionOption,
  type AxiomInternalCandidateSurfacePromotionHandoffManifest,
  buildAxiomInternalCandidateSurfacePromotionHandoffManifest,
  validateAxiomInternalCandidateSurfacePromotionHandoffManifest,
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

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY =
  'axiom_internal_candidate_public_release_decision_packet_shell_is_review_input_not_public_approval_public_navigation_publication_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_ROUTE =
  '/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell' as const;

export type AxiomPublicReleaseDecisionRequirement =
  | 'founder_public_release_decision_required'
  | 'human_review_execution_required'
  | 'source_support_validity_review_required'
  | 'public_boundary_review_required'
  | 'accessibility_review_required'
  | 'regression_receipt_currentness_required'
  | 'public_navigation_plan_required'
  | 'rollback_and_correction_playbook_required';

export type AxiomPublicReleaseDecisionOption =
  | 'no_release_continue_internal'
  | 'return_to_kernel_or_surface_revision'
  | 'request_source_support_validity_review'
  | 'prepare_public_release_packet_after_explicit_approval';

export type AxiomCandidatePublicReleaseDecisionUnit = {
  unitId: string;
  unitType:
    | 'surface_public_release_decision_shell_review_input'
    | 'cross_public_release_decision_shell_review_input'
    | 'gate8_public_release_decision_shell_review_input';
  surface?: AxiomNextNblSiteSurface;
  sourceHandoffManifestUnitId: string;
  sourceHandoffDecisionOptions: AxiomCandidateSurfacePromotionHandoffDecisionOption[];
  sourceHandoffStatus: 'prepared_not_sent_by_codex';
  sourceFounderDecisionStatus: 'not_decided';
  requiredReleaseDecisionRequirements: AxiomPublicReleaseDecisionRequirement[];
  releaseDecisionOptions: AxiomPublicReleaseDecisionOption[];
  releaseDecisionStatus: 'not_decided';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  publicNavigationStatus: 'not_added';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceSupportValidityStatus: 'not_decided';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidatePublicReleaseDecisionPacketShell = {
  shellId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_ROUTE;
  sourceHandoffManifestId: string;
  sourceHandoffManifestStatus: AxiomInternalCandidateSurfacePromotionHandoffManifest['status'];
  sourceHandoffManifestRequiredStatus: 'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted';
  shellMode: 'public_release_decision_review_input_only';
  releaseDecisionStatus: 'not_decided';
  publicApprovalStatus: 'not_approved';
  publicationStatus: 'not_published';
  publicNavigationStatus: 'not_added';
  handoffStatus: 'not_sent_by_codex';
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  sourceSupportValidityStatus: 'not_decided';
  maxCoreReviewUnits: 100;
  decisionUnitCount: number;
  decisionUnits: AxiomCandidatePublicReleaseDecisionUnit[];
  nextAllowedMovement: 'founder_or_reviewer_can_decide_outside_codex_only';
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

export type AxiomInternalCandidatePublicReleaseDecisionPacketShellValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

export const AXIOM_PUBLIC_RELEASE_DECISION_REQUIREMENTS: AxiomPublicReleaseDecisionRequirement[] = [
  'founder_public_release_decision_required',
  'human_review_execution_required',
  'source_support_validity_review_required',
  'public_boundary_review_required',
  'accessibility_review_required',
  'regression_receipt_currentness_required',
  'public_navigation_plan_required',
  'rollback_and_correction_playbook_required',
];

const RELEASE_DECISION_OPTIONS: AxiomPublicReleaseDecisionOption[] = [
  'no_release_continue_internal',
  'return_to_kernel_or_surface_revision',
  'request_source_support_validity_review',
  'prepare_public_release_packet_after_explicit_approval',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function decisionUnitTypeForHandoffUnit(
  handoffUnit: AxiomCandidateSurfacePromotionHandoffManifestUnit,
): AxiomCandidatePublicReleaseDecisionUnit['unitType'] {
  if (handoffUnit.unitType === 'surface_candidate_surface_promotion_handoff_review_input') {
    return 'surface_public_release_decision_shell_review_input';
  }
  if (handoffUnit.unitType === 'cross_candidate_surface_promotion_handoff_review_input') {
    return 'cross_public_release_decision_shell_review_input';
  }

  return 'gate8_public_release_decision_shell_review_input';
}

function buildDecisionUnit(
  handoffUnit: AxiomCandidateSurfacePromotionHandoffManifestUnit,
): AxiomCandidatePublicReleaseDecisionUnit {
  return {
    unitId: `axiom_public_release_decision_shell_${handoffUnit.unitId}`,
    unitType: decisionUnitTypeForHandoffUnit(handoffUnit),
    surface: handoffUnit.surface,
    sourceHandoffManifestUnitId: handoffUnit.unitId,
    sourceHandoffDecisionOptions: [...handoffUnit.handoffDecisionOptions],
    sourceHandoffStatus: handoffUnit.handoffStatus,
    sourceFounderDecisionStatus: handoffUnit.founderDecisionStatus,
    requiredReleaseDecisionRequirements: [...AXIOM_PUBLIC_RELEASE_DECISION_REQUIREMENTS],
    releaseDecisionOptions: [...RELEASE_DECISION_OPTIONS],
    releaseDecisionStatus: 'not_decided',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    publicNavigationStatus: 'not_added',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    sourceSupportValidityStatus: 'not_decided',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(
  sourceHandoffManifest: AxiomInternalCandidateSurfacePromotionHandoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(),
): AxiomInternalCandidatePublicReleaseDecisionPacketShell {
  const decisionUnits = sourceHandoffManifest.manifestUnits.map((handoffUnit) =>
    buildDecisionUnit(handoffUnit),
  );

  return {
    shellId: `axiom_internal_candidate_public_release_decision_packet_shell_from_${sourceHandoffManifest.manifestId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status:
      'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_ROUTE,
    sourceHandoffManifestId: sourceHandoffManifest.manifestId,
    sourceHandoffManifestStatus: sourceHandoffManifest.status,
    sourceHandoffManifestRequiredStatus:
      'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
    shellMode: 'public_release_decision_review_input_only',
    releaseDecisionStatus: 'not_decided',
    publicApprovalStatus: 'not_approved',
    publicationStatus: 'not_published',
    publicNavigationStatus: 'not_added',
    handoffStatus: 'not_sent_by_codex',
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    sourceSupportValidityStatus: 'not_decided',
    maxCoreReviewUnits: 100,
    decisionUnitCount: decisionUnits.length,
    decisionUnits,
    nextAllowedMovement: 'founder_or_reviewer_can_decide_outside_codex_only',
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

export function validateAxiomInternalCandidatePublicReleaseDecisionPacketShell(
  shell: AxiomInternalCandidatePublicReleaseDecisionPacketShell,
  sourceHandoffManifest: AxiomInternalCandidateSurfacePromotionHandoffManifest,
  sourcePromotionRequestPacket: AxiomInternalCandidateSurfacePromotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(),
  sourceReleaseReadinessLedger: AxiomInternalCandidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(),
  sourceHoldPacket: AxiomInternalCandidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(),
): AxiomInternalCandidatePublicReleaseDecisionPacketShellValidation {
  const errors: string[] = [];
  const handoffValidation = validateAxiomInternalCandidateSurfacePromotionHandoffManifest(
    sourceHandoffManifest,
    sourcePromotionRequestPacket,
    sourceReleaseReadinessLedger,
    sourceHoldPacket,
  );
  const decisionUnitSurfaces = shell.decisionUnits
    .filter((unit) => unit.unitType === 'surface_public_release_decision_shell_review_input')
    .map((unit) => unit.surface);

  pushIf(!handoffValidation.valid, errors, 'source_handoff_manifest_must_validate');
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_review_loop',
  );
  pushIf(
    shell.status !==
      'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
    errors,
    'status_must_remain_prepared_not_decided_not_approved_not_released',
  );
  pushIf(
    shell.boundary !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_review_input_not_public_approval_navigation_publication_or_release',
  );
  pushIf(
    shell.route !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_ROUTE,
    errors,
    'route_must_remain_internal_public_release_decision_packet_shell',
  );
  pushIf(
    shell.sourceHandoffManifestId !== sourceHandoffManifest.manifestId,
    errors,
    'source_handoff_manifest_id_mismatch',
  );
  pushIf(
    shell.sourceHandoffManifestStatus !== sourceHandoffManifest.status,
    errors,
    'source_handoff_manifest_status_mismatch',
  );
  pushIf(
    shell.sourceHandoffManifestRequiredStatus !==
      'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
    errors,
    'source_handoff_manifest_required_status_must_remain_prepared_not_sent_not_promoted',
  );
  pushIf(
    shell.shellMode !== 'public_release_decision_review_input_only',
    errors,
    'shell_mode_must_be_public_release_decision_review_input_only',
  );
  pushIf(
    shell.releaseDecisionStatus !== 'not_decided' ||
      shell.publicApprovalStatus !== 'not_approved' ||
      shell.publicationStatus !== 'not_published' ||
      shell.publicNavigationStatus !== 'not_added' ||
      shell.handoffStatus !== 'not_sent_by_codex' ||
      shell.reviewExecutionStatus !== 'not_executed' ||
      shell.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      shell.sourceSupportValidityStatus !== 'not_decided',
    errors,
    'shell_must_remain_unapproved_unpublished_unexecuted_unassigned_and_undecided',
  );
  pushIf(shell.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    shell.decisionUnitCount !== sourceHandoffManifest.manifestUnitCount,
    errors,
    'decision_unit_count_must_match_handoff_units',
  );
  pushIf(
    shell.decisionUnitCount !== shell.decisionUnits.length,
    errors,
    'decision_unit_count_mismatch',
  );
  pushIf(
    shell.decisionUnitCount > shell.maxCoreReviewUnits,
    errors,
    'decision_units_must_remain_under_100',
  );
  pushIf(
    shell.nextAllowedMovement !== 'founder_or_reviewer_can_decide_outside_codex_only',
    errors,
    'next_allowed_movement_must_remain_outside_codex_decision_only',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !decisionUnitSurfaces.includes(surface),
      errors,
      `surface_decision_unit_missing:${surface}`,
    );
  }
  pushIf(
    !shell.decisionUnits.some(
      (unit) => unit.unitType === 'cross_public_release_decision_shell_review_input',
    ),
    errors,
    'cross_public_release_decision_shell_review_input_missing',
  );
  pushIf(
    !shell.decisionUnits.some(
      (unit) => unit.unitType === 'gate8_public_release_decision_shell_review_input',
    ),
    errors,
    'gate8_public_release_decision_shell_review_input_missing',
  );

  for (const unit of shell.decisionUnits) {
    const sourceHandoffUnit = sourceHandoffManifest.manifestUnits.find(
      (handoffUnit) => handoffUnit.unitId === unit.sourceHandoffManifestUnitId,
    );

    pushIf(!sourceHandoffUnit, errors, `source_handoff_unit_missing:${unit.unitId}`);
    if (sourceHandoffUnit) {
      pushIf(
        unit.unitType !== decisionUnitTypeForHandoffUnit(sourceHandoffUnit) ||
          unit.surface !== sourceHandoffUnit.surface ||
          unit.sourceHandoffStatus !== sourceHandoffUnit.handoffStatus ||
          unit.sourceFounderDecisionStatus !== sourceHandoffUnit.founderDecisionStatus,
        errors,
        `decision_unit_source_mismatch:${unit.unitId}`,
      );
      for (const option of sourceHandoffUnit.handoffDecisionOptions) {
        pushIf(
          !unit.sourceHandoffDecisionOptions.includes(option),
          errors,
          `source_handoff_decision_option_missing:${unit.unitId}:${option}`,
        );
      }
    }

    for (const requirement of AXIOM_PUBLIC_RELEASE_DECISION_REQUIREMENTS) {
      pushIf(
        !unit.requiredReleaseDecisionRequirements.includes(requirement),
        errors,
        `release_decision_requirement_missing:${unit.unitId}:${requirement}`,
      );
    }
    for (const option of RELEASE_DECISION_OPTIONS) {
      pushIf(
        !unit.releaseDecisionOptions.includes(option),
        errors,
        `release_decision_option_missing:${unit.unitId}:${option}`,
      );
    }
    pushIf(
      unit.releaseDecisionStatus !== 'not_decided' ||
        unit.publicApprovalStatus !== 'not_approved' ||
        unit.publicationStatus !== 'not_published' ||
        unit.publicNavigationStatus !== 'not_added' ||
        unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
        unit.sourceSupportValidityStatus !== 'not_decided',
      errors,
      `decision_unit_must_remain_unapproved_unpublished_unexecuted_unassigned_and_undecided:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `decision_unit_boundary_flags_invalid:${unit.unitId}`,
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
    'release_decision_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
