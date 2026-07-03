import {
  type AxiomInternalCandidatePublicPagePreview,
  type AxiomInternalCandidatePublicPagePreviewAssembly,
  buildAxiomInternalCandidatePublicPagePreviewAssembly,
  validateAxiomInternalCandidatePublicPagePreviewAssembly,
} from './siteInternalCandidatePublicPagePreviewAssembly';
import { buildAxiomInternalCandidateSurfacePageShellBundle } from './siteInternalCandidateSurfacePageShell';
import { buildAxiomInternalCandidateSurfacePageShellReviewPacket } from './siteInternalCandidateSurfacePageShellReviewPacket';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY =
  'axiom_internal_candidate_public_page_hold_packet_is_hold_gate_not_public_navigation_review_execution_candidate_promotion_public_approval_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_ROUTE =
  '/internal/axiom-next-nbl-candidate-public-page-hold-packet' as const;

export type AxiomCandidatePublicPageHoldCategory =
  | 'public_boundary'
  | 'accessibility_readiness'
  | 'regression_readiness'
  | 'source_currentness_hold'
  | 'human_review_gate'
  | 'public_navigation_release_hold';

export type AxiomCandidatePublicPageHoldCheck = {
  checkId: string;
  category: AxiomCandidatePublicPageHoldCategory;
  requirement: string;
  evidenceSource:
    | 'candidate_public_page_preview_assembly'
    | 'gate8_runner_receipt'
    | 'human_review_packet'
    | 'founder_public_release_gate';
  holdStatus: 'required_hold_not_released';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomCandidatePublicPageHoldUnit = {
  unitId: string;
  unitType:
    | 'surface_candidate_public_page_hold'
    | 'cross_candidate_public_page_hold'
    | 'gate8_candidate_public_page_hold';
  surface?: AxiomNextNblSiteSurface;
  sourcePreviewId?: string;
  sourceInternalPreviewPath?: string;
  previewBlockCount: number;
  holdCheckCount: number;
  holdChecks: AxiomCandidatePublicPageHoldCheck[];
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  blocksCandidatePromotion: true;
  blocksPublicNavigation: true;
  blocksPublicRelease: true;
  doesNotBlockInternalPreview: true;
};

export type AxiomInternalCandidatePublicPageHoldPacket = {
  packetId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_public_page_hold_packet_prepared_not_released';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY;
  route: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_ROUTE;
  sourcePreviewAssemblyId: string;
  sourcePreviewAssemblyStatus: AxiomInternalCandidatePublicPagePreviewAssembly['status'];
  sourcePreviewAssemblyRequiredStatus: 'internal_candidate_public_page_preview_assembly_not_promoted';
  maxCoreReviewUnits: 100;
  holdUnitCount: number;
  holdUnits: AxiomCandidatePublicPageHoldUnit[];
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

export type AxiomInternalCandidatePublicPageHoldPacketValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY;
  coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'];
};

const REQUIRED_HOLD_CATEGORIES: AxiomCandidatePublicPageHoldCategory[] = [
  'public_boundary',
  'accessibility_readiness',
  'regression_readiness',
  'source_currentness_hold',
  'human_review_gate',
  'public_navigation_release_hold',
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildHoldCheck(
  unitPrefix: string,
  category: AxiomCandidatePublicPageHoldCategory,
): AxiomCandidatePublicPageHoldCheck {
  const requirements: Record<AxiomCandidatePublicPageHoldCategory, string> = {
    public_boundary:
      'Confirm the preview does not contain final advice, diagnosis, legal judgment, accommodation finality, public approval language, or release claims.',
    accessibility_readiness:
      'Confirm the internal preview remains accessibility-review-required before any candidate public page movement.',
    regression_readiness:
      'Confirm Axiom contracts, internal route rendering, and the existing Falcon expert-agent core eval remain passing before movement.',
    source_currentness_hold:
      'Confirm currentness-sensitive source claims remain held and source/support validity remains undecided.',
    human_review_gate:
      'Confirm human review is still not executed or assigned by Codex and must happen before candidate promotion.',
    public_navigation_release_hold:
      'Confirm public navigation, public approval, publication, and candidate-surface promotion remain blocked.',
  };
  const evidenceSources: Record<
    AxiomCandidatePublicPageHoldCategory,
    AxiomCandidatePublicPageHoldCheck['evidenceSource']
  > = {
    public_boundary: 'candidate_public_page_preview_assembly',
    accessibility_readiness: 'candidate_public_page_preview_assembly',
    regression_readiness: 'gate8_runner_receipt',
    source_currentness_hold: 'human_review_packet',
    human_review_gate: 'human_review_packet',
    public_navigation_release_hold: 'founder_public_release_gate',
  };

  return {
    checkId: `${unitPrefix}_${category}`,
    category,
    requirement: requirements[category],
    evidenceSource: evidenceSources[category],
    holdStatus: 'required_hold_not_released',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

function buildHoldChecks(unitPrefix: string): AxiomCandidatePublicPageHoldCheck[] {
  return REQUIRED_HOLD_CATEGORIES.map((category) => buildHoldCheck(unitPrefix, category));
}

function buildSurfaceHoldUnit(
  preview: AxiomInternalCandidatePublicPagePreview,
): AxiomCandidatePublicPageHoldUnit {
  const holdChecks = buildHoldChecks(`axiom_candidate_public_page_hold_${preview.surface}`);

  return {
    unitId: `axiom_candidate_public_page_hold_${preview.surface}`,
    unitType: 'surface_candidate_public_page_hold',
    surface: preview.surface,
    sourcePreviewId: preview.previewId,
    sourceInternalPreviewPath: preview.internalPreviewPath,
    previewBlockCount: preview.blockCount,
    holdCheckCount: holdChecks.length,
    holdChecks,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

function buildCrossHoldUnit(
  sourcePreviewAssembly: AxiomInternalCandidatePublicPagePreviewAssembly,
): AxiomCandidatePublicPageHoldUnit {
  const holdChecks = buildHoldChecks('axiom_candidate_public_page_hold_cross_surface');

  return {
    unitId: 'axiom_candidate_public_page_hold_cross_surface',
    unitType: 'cross_candidate_public_page_hold',
    previewBlockCount: sourcePreviewAssembly.previews.reduce(
      (sum, preview) => sum + preview.blockCount,
      0,
    ),
    holdCheckCount: holdChecks.length,
    holdChecks,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

function buildGate8HoldUnit(
  sourcePreviewAssembly: AxiomInternalCandidatePublicPagePreviewAssembly,
): AxiomCandidatePublicPageHoldUnit {
  const holdChecks = buildHoldChecks('axiom_candidate_public_page_hold_gate8');

  return {
    unitId: 'axiom_candidate_public_page_hold_gate8_receipt',
    unitType: 'gate8_candidate_public_page_hold',
    previewBlockCount: sourcePreviewAssembly.previewCount,
    holdCheckCount: holdChecks.length,
    holdChecks,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    blocksCandidatePromotion: true,
    blocksPublicNavigation: true,
    blocksPublicRelease: true,
    doesNotBlockInternalPreview: true,
  };
}

export function buildAxiomInternalCandidatePublicPageHoldPacket(
  sourcePreviewAssembly: AxiomInternalCandidatePublicPagePreviewAssembly = buildAxiomInternalCandidatePublicPagePreviewAssembly(),
): AxiomInternalCandidatePublicPageHoldPacket {
  const holdUnits = [
    ...AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
      const preview = sourcePreviewAssembly.previews.find(
        (candidate) => candidate.surface === surface,
      );

      if (!preview) {
        throw new Error(`axiom_candidate_public_page_hold_preview_missing:${surface}`);
      }

      return buildSurfaceHoldUnit(preview);
    }),
    buildCrossHoldUnit(sourcePreviewAssembly),
    buildGate8HoldUnit(sourcePreviewAssembly),
  ];

  return {
    packetId: `axiom_internal_candidate_public_page_hold_packet_from_${sourcePreviewAssembly.assemblyId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_public_page_hold_packet_prepared_not_released',
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY,
    route: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_ROUTE,
    sourcePreviewAssemblyId: sourcePreviewAssembly.assemblyId,
    sourcePreviewAssemblyStatus: sourcePreviewAssembly.status,
    sourcePreviewAssemblyRequiredStatus:
      'internal_candidate_public_page_preview_assembly_not_promoted',
    maxCoreReviewUnits: 100,
    holdUnitCount: holdUnits.length,
    holdUnits,
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

export function validateAxiomInternalCandidatePublicPageHoldPacket(
  packet: AxiomInternalCandidatePublicPageHoldPacket,
  sourcePreviewAssembly: AxiomInternalCandidatePublicPagePreviewAssembly,
): AxiomInternalCandidatePublicPageHoldPacketValidation {
  const errors: string[] = [];
  const pageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle();
  const pageShellReviewPacket =
    buildAxiomInternalCandidateSurfacePageShellReviewPacket(pageShellBundle);
  const previewAssemblyValidation = validateAxiomInternalCandidatePublicPagePreviewAssembly(
    sourcePreviewAssembly,
    pageShellBundle,
    pageShellReviewPacket,
  );
  const holdUnitSurfaces = packet.holdUnits
    .filter((unit) => unit.unitType === 'surface_candidate_public_page_hold')
    .map((unit) => unit.surface);

  pushIf(!previewAssemblyValidation.valid, errors, 'source_preview_assembly_must_validate');
  pushIf(
    sourcePreviewAssembly.status !== 'internal_candidate_public_page_preview_assembly_not_promoted',
    errors,
    'source_preview_assembly_must_remain_not_promoted',
  );
  pushIf(packet.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    packet.coreProgressClasses.join('|') !== 'kernel_eval|kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_eval_display_review_loop',
  );
  pushIf(
    packet.status !== 'internal_candidate_public_page_hold_packet_prepared_not_released',
    errors,
    'status_must_remain_hold_packet_prepared_not_released',
  );
  pushIf(
    packet.boundary !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY,
    errors,
    'boundary_must_remain_hold_gate_not_navigation_review_execution_promotion_or_release',
  );
  pushIf(
    packet.route !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_ROUTE,
    errors,
    'route_must_remain_internal_hold_packet',
  );
  pushIf(
    packet.sourcePreviewAssemblyId !== sourcePreviewAssembly.assemblyId,
    errors,
    'source_preview_assembly_id_mismatch',
  );
  pushIf(
    packet.sourcePreviewAssemblyStatus !== sourcePreviewAssembly.status,
    errors,
    'source_preview_assembly_status_mismatch',
  );
  pushIf(
    packet.sourcePreviewAssemblyRequiredStatus !==
      'internal_candidate_public_page_preview_assembly_not_promoted',
    errors,
    'source_preview_assembly_required_status_must_remain_not_promoted',
  );
  pushIf(packet.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(packet.holdUnitCount !== packet.holdUnits.length, errors, 'hold_unit_count_mismatch');
  pushIf(
    packet.holdUnitCount > packet.maxCoreReviewUnits,
    errors,
    'hold_units_must_remain_under_100',
  );
  pushIf(
    packet.reviewExecutionStatus !== 'not_executed' ||
      packet.reviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'review_must_not_be_executed_or_assigned_by_codex',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!holdUnitSurfaces.includes(surface), errors, `surface_hold_unit_missing:${surface}`);
  }
  pushIf(
    !packet.holdUnits.some((unit) => unit.unitType === 'cross_candidate_public_page_hold'),
    errors,
    'cross_candidate_public_page_hold_missing',
  );
  pushIf(
    !packet.holdUnits.some((unit) => unit.unitType === 'gate8_candidate_public_page_hold'),
    errors,
    'gate8_candidate_public_page_hold_missing',
  );

  for (const unit of packet.holdUnits) {
    const categories = unit.holdChecks.map((check) => check.category);

    pushIf(
      unit.holdCheckCount !== unit.holdChecks.length,
      errors,
      `hold_check_count_mismatch:${unit.unitId}`,
    );
    for (const category of REQUIRED_HOLD_CATEGORIES) {
      pushIf(
        !categories.includes(category),
        errors,
        `hold_category_missing:${unit.unitId}:${category}`,
      );
    }
    pushIf(
      unit.reviewExecutionStatus !== 'not_executed' ||
        unit.reviewerAssignmentStatus !== 'not_assigned_by_codex',
      errors,
      `hold_unit_review_must_not_be_executed_or_assigned:${unit.unitId}`,
    );
    pushIf(
      unit.blocksCandidatePromotion !== true ||
        unit.blocksPublicNavigation !== true ||
        unit.blocksPublicRelease !== true ||
        unit.doesNotBlockInternalPreview !== true,
      errors,
      `hold_unit_boundary_flags_invalid:${unit.unitId}`,
    );
    pushIf(unit.previewBlockCount <= 0, errors, `hold_unit_preview_scope_required:${unit.unitId}`);

    if (unit.unitType === 'surface_candidate_public_page_hold' && unit.surface) {
      const sourcePreview = sourcePreviewAssembly.previews.find(
        (preview) => preview.surface === unit.surface,
      );

      pushIf(!sourcePreview, errors, `source_preview_missing:${unit.surface}`);
      if (sourcePreview) {
        pushIf(
          unit.sourcePreviewId !== sourcePreview.previewId ||
            unit.sourceInternalPreviewPath !== sourcePreview.internalPreviewPath ||
            unit.previewBlockCount !== sourcePreview.blockCount,
          errors,
          `surface_hold_source_preview_mismatch:${unit.surface}`,
        );
      }
    }

    for (const check of unit.holdChecks) {
      pushIf(
        check.holdStatus !== 'required_hold_not_released' ||
          check.blocksCandidatePromotion !== true ||
          check.blocksPublicNavigation !== true ||
          check.blocksPublicRelease !== true ||
          check.doesNotBlockInternalPreview !== true ||
          check.requirement.trim().length === 0,
        errors,
        `hold_check_must_remain_required_and_blocking:${check.checkId}`,
      );
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
    'hold_packet_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY,
    coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
  };
}
