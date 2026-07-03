import {
  type AxiomCandidateSurfacePageRegionKind,
  type AxiomInternalCandidateSurfacePageShell,
  type AxiomInternalCandidateSurfacePageShellBundle,
  buildAxiomInternalCandidateSurfacePageShellBundle,
} from './siteInternalCandidateSurfacePageShell';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY =
  'axiom_internal_candidate_surface_page_shell_review_packet_is_review_input_not_review_execution_candidate_promotion_public_approval_or_release' as const;

export type AxiomPageShellReviewDecision =
  | 'review_region_kind_mapping'
  | 'review_hidden_or_review_routed_region_handling'
  | 'review_public_draft_candidate_region_placement'
  | 'confirm_source_support_validity_still_not_decided'
  | 'confirm_no_public_navigation_candidate_promotion_or_release'
  | 'confirm_review_execution_not_codex_owned';

export type AxiomPageShellReviewUnit = {
  unitId: string;
  unitType:
    | 'surface_page_shell_review'
    | 'cross_page_shell_boundary_review'
    | 'gate8_page_shell_receipt_boundary_review';
  surface?: AxiomNextNblSiteSurface;
  sourceShellId?: string;
  sourceInternalShellPath?: string;
  regionCount: number;
  publicDraftCandidateRegionCount: number;
  hiddenOrReviewRoutedRegionCount: number;
  regionKindsInScope: AxiomCandidateSurfacePageRegionKind[];
  questionSet: {
    regionKindQuestion: string;
    hiddenOrReviewRoutedQuestion: string;
    publicDraftCandidateQuestion: string;
    boundaryQuestion: string;
  };
  requiredDecisions: AxiomPageShellReviewDecision[];
  blocksCandidatePromotion: true;
  blocksPublicRelease: true;
  doesNotBlockInternalInspection: true;
};

export type AxiomInternalCandidateSurfacePageShellReviewPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_human_review_loop';
  status: 'internal_candidate_surface_page_shell_review_packet_prepared_not_executed';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY;
  sourcePageShellBundleId: string;
  sourcePageShellBundleStatus: AxiomInternalCandidateSurfacePageShellBundle['status'];
  sourcePageShellRequiredStatus: 'internal_candidate_surface_page_shell_bundle_not_promoted';
  maxCoreReviewUnits: 100;
  reviewUnitCount: number;
  reviewUnits: AxiomPageShellReviewUnit[];
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

export type AxiomInternalCandidateSurfacePageShellReviewPacketValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY;
  coreProgressClass: 'kernel_human_review_loop';
};

const REQUIRED_PAGE_SHELL_REVIEW_DECISIONS: AxiomPageShellReviewDecision[] = [
  'review_region_kind_mapping',
  'review_hidden_or_review_routed_region_handling',
  'review_public_draft_candidate_region_placement',
  'confirm_source_support_validity_still_not_decided',
  'confirm_no_public_navigation_candidate_promotion_or_release',
  'confirm_review_execution_not_codex_owned',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function uniqueRegionKinds(shell: AxiomInternalCandidateSurfacePageShell) {
  return Array.from(new Set(shell.regions.map((region) => region.regionKind)));
}

function countRegions(
  shell: AxiomInternalCandidateSurfacePageShell,
  regionKind: AxiomCandidateSurfacePageRegionKind,
): number {
  return shell.regions.filter((region) => region.regionKind === regionKind).length;
}

function buildSurfaceReviewUnit(
  shell: AxiomInternalCandidateSurfacePageShell,
): AxiomPageShellReviewUnit {
  return {
    unitId: `axiom_page_shell_review_${shell.surface}`,
    unitType: 'surface_page_shell_review',
    surface: shell.surface,
    sourceShellId: shell.shellId,
    sourceInternalShellPath: shell.internalShellPath,
    regionCount: shell.regionCount,
    publicDraftCandidateRegionCount: countRegions(
      shell,
      'public_draft_candidate_region_review_required',
    ),
    hiddenOrReviewRoutedRegionCount: countRegions(
      shell,
      'hidden_or_review_routed_region_placeholder',
    ),
    regionKindsInScope: uniqueRegionKinds(shell),
    questionSet: {
      regionKindQuestion:
        'Do the page regions preserve the render adapter component kind mapping without inventing new public sections?',
      hiddenOrReviewRoutedQuestion:
        'Are hidden or review-routed fields still hidden or routed to review rather than surfaced as public copy?',
      publicDraftCandidateQuestion:
        'Are public draft candidate regions clearly review-required and not treated as approved publication copy?',
      boundaryQuestion:
        'Does this page shell remain an internal preview and not public navigation, candidate promotion, or release?',
    },
    requiredDecisions: [...REQUIRED_PAGE_SHELL_REVIEW_DECISIONS],
    blocksCandidatePromotion: true,
    blocksPublicRelease: true,
    doesNotBlockInternalInspection: true,
  };
}

function buildCrossPageShellBoundaryReviewUnit(
  sourcePageShellBundle: AxiomInternalCandidateSurfacePageShellBundle,
): AxiomPageShellReviewUnit {
  const allRegions = sourcePageShellBundle.shells.flatMap((shell) => shell.regions);

  return {
    unitId: 'axiom_page_shell_review_cross_page_shell_boundary',
    unitType: 'cross_page_shell_boundary_review',
    regionCount: allRegions.length,
    publicDraftCandidateRegionCount: allRegions.filter(
      (region) => region.regionKind === 'public_draft_candidate_region_review_required',
    ).length,
    hiddenOrReviewRoutedRegionCount: allRegions.filter(
      (region) => region.regionKind === 'hidden_or_review_routed_region_placeholder',
    ).length,
    regionKindsInScope: Array.from(new Set(allRegions.map((region) => region.regionKind))),
    questionSet: {
      regionKindQuestion:
        'Across all page shells, do region kinds remain stable and derived from Axiom adapter fields only?',
      hiddenOrReviewRoutedQuestion:
        'Across all surfaces, are hidden and review-routed regions consistently held before public use?',
      publicDraftCandidateQuestion:
        'Across all surfaces, are public draft candidate regions still review-required and not approved copy?',
      boundaryQuestion:
        'Does the full page-shell system keep public navigation, promotion, release, source/support validity, and learning updates unmoved?',
    },
    requiredDecisions: [...REQUIRED_PAGE_SHELL_REVIEW_DECISIONS],
    blocksCandidatePromotion: true,
    blocksPublicRelease: true,
    doesNotBlockInternalInspection: true,
  };
}

function buildGate8PageShellReceiptBoundaryReviewUnit(
  sourcePageShellBundle: AxiomInternalCandidateSurfacePageShellBundle,
): AxiomPageShellReviewUnit {
  return {
    unitId: 'axiom_page_shell_review_gate8_receipt_boundary',
    unitType: 'gate8_page_shell_receipt_boundary_review',
    regionCount: sourcePageShellBundle.shellCount,
    publicDraftCandidateRegionCount: sourcePageShellBundle.shells.filter((shell) =>
      shell.regions.some(
        (region) => region.regionKind === 'public_draft_candidate_region_review_required',
      ),
    ).length,
    hiddenOrReviewRoutedRegionCount: sourcePageShellBundle.shells.filter((shell) =>
      shell.regions.some(
        (region) => region.regionKind === 'hidden_or_review_routed_region_placeholder',
      ),
    ).length,
    regionKindsInScope: Array.from(
      new Set(
        sourcePageShellBundle.shells.flatMap((shell) =>
          shell.regions.map((region) => region.regionKind),
        ),
      ),
    ),
    questionSet: {
      regionKindQuestion:
        'Does the passed internal route evidence cover the page-shell route without implying public readiness?',
      hiddenOrReviewRoutedQuestion:
        'Does the route evidence avoid converting hidden/review-routed regions into public claims?',
      publicDraftCandidateQuestion:
        'Does route rendering evidence avoid treating public draft candidate regions as approved publication copy?',
      boundaryQuestion:
        'Does the Gate 8 evidence support only review preparation and not automatic candidate-surface promotion?',
    },
    requiredDecisions: [...REQUIRED_PAGE_SHELL_REVIEW_DECISIONS],
    blocksCandidatePromotion: true,
    blocksPublicRelease: true,
    doesNotBlockInternalInspection: true,
  };
}

export function buildAxiomInternalCandidateSurfacePageShellReviewPacket(
  sourcePageShellBundle: AxiomInternalCandidateSurfacePageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle(),
): AxiomInternalCandidateSurfacePageShellReviewPacket {
  const reviewUnits = [
    ...AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
      const shell = sourcePageShellBundle.shells.find((candidate) => candidate.surface === surface);

      if (!shell) {
        throw new Error(`axiom_page_shell_review_source_missing:${surface}`);
      }

      return buildSurfaceReviewUnit(shell);
    }),
    buildCrossPageShellBoundaryReviewUnit(sourcePageShellBundle),
    buildGate8PageShellReceiptBoundaryReviewUnit(sourcePageShellBundle),
  ];

  return {
    packetId: `axiom_internal_candidate_surface_page_shell_review_packet_from_${sourcePageShellBundle.bundleId}`,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_human_review_loop',
    status: 'internal_candidate_surface_page_shell_review_packet_prepared_not_executed',
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY,
    sourcePageShellBundleId: sourcePageShellBundle.bundleId,
    sourcePageShellBundleStatus: sourcePageShellBundle.status,
    sourcePageShellRequiredStatus: 'internal_candidate_surface_page_shell_bundle_not_promoted',
    maxCoreReviewUnits: 100,
    reviewUnitCount: reviewUnits.length,
    reviewUnits,
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

export function validateAxiomInternalCandidateSurfacePageShellReviewPacket(
  packet: AxiomInternalCandidateSurfacePageShellReviewPacket,
  sourcePageShellBundle: AxiomInternalCandidateSurfacePageShellBundle,
): AxiomInternalCandidateSurfacePageShellReviewPacketValidation {
  const errors: string[] = [];
  const reviewUnitSurfaces = packet.reviewUnits
    .filter((unit) => unit.unitType === 'surface_page_shell_review')
    .map((unit) => unit.surface);

  pushIf(
    sourcePageShellBundle.status !== 'internal_candidate_surface_page_shell_bundle_not_promoted',
    errors,
    'source_page_shell_bundle_must_remain_not_promoted',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClass !== 'kernel_human_review_loop',
    errors,
    'core_progress_class_must_remain_human_review_loop',
  );
  pushIf(
    packet.status !== 'internal_candidate_surface_page_shell_review_packet_prepared_not_executed',
    errors,
    'status_must_remain_prepared_not_executed',
  );
  pushIf(
    packet.boundary !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_review_input_not_execution_promotion_or_release',
  );
  pushIf(
    packet.sourcePageShellBundleId !== sourcePageShellBundle.bundleId,
    errors,
    'source_page_shell_bundle_id_mismatch',
  );
  pushIf(
    packet.sourcePageShellBundleStatus !== sourcePageShellBundle.status,
    errors,
    'source_page_shell_bundle_status_mismatch',
  );
  pushIf(
    packet.sourcePageShellRequiredStatus !==
      'internal_candidate_surface_page_shell_bundle_not_promoted',
    errors,
    'source_page_shell_required_status_must_remain_not_promoted',
  );
  pushIf(packet.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
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
    packet.reviewExecutionStatus !== 'not_executed' ||
      packet.reviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'review_must_not_be_executed_or_assigned_by_codex',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!reviewUnitSurfaces.includes(surface), errors, `surface_review_unit_missing:${surface}`);
  }

  pushIf(
    !packet.reviewUnits.some((unit) => unit.unitType === 'cross_page_shell_boundary_review'),
    errors,
    'cross_page_shell_boundary_review_missing',
  );
  pushIf(
    !packet.reviewUnits.some(
      (unit) => unit.unitType === 'gate8_page_shell_receipt_boundary_review',
    ),
    errors,
    'gate8_page_shell_receipt_boundary_review_missing',
  );

  for (const unit of packet.reviewUnits) {
    for (const decision of REQUIRED_PAGE_SHELL_REVIEW_DECISIONS) {
      pushIf(
        !unit.requiredDecisions.includes(decision),
        errors,
        `review_decision_missing:${unit.unitId}:${decision}`,
      );
    }
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalInspection !== true,
      errors,
      `review_unit_boundary_flags_invalid:${unit.unitId}`,
    );
    pushIf(
      unit.regionCount <= 0 ||
        unit.regionKindsInScope.length === 0 ||
        unit.questionSet.regionKindQuestion.trim().length === 0 ||
        unit.questionSet.boundaryQuestion.trim().length === 0,
      errors,
      `review_unit_must_include_region_scope_and_questions:${unit.unitId}`,
    );

    if (unit.unitType === 'surface_page_shell_review' && unit.surface) {
      const sourceShell = sourcePageShellBundle.shells.find(
        (shell) => shell.surface === unit.surface,
      );

      pushIf(!sourceShell, errors, `source_shell_missing:${unit.surface}`);
      if (sourceShell) {
        pushIf(
          unit.sourceShellId !== sourceShell.shellId ||
            unit.sourceInternalShellPath !== sourceShell.internalShellPath ||
            unit.regionCount !== sourceShell.regionCount,
          errors,
          `surface_review_source_shell_mismatch:${unit.surface}`,
        );
      }
    }
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
    'page_shell_review_packet_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY,
    coreProgressClass: 'kernel_human_review_loop',
  };
}
