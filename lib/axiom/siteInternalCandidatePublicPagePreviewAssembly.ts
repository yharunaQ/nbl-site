import {
  type AxiomCandidateSurfacePageRegion,
  type AxiomInternalCandidateSurfacePageShell,
  type AxiomInternalCandidateSurfacePageShellBundle,
  buildAxiomInternalCandidateSurfacePageShellBundle,
} from './siteInternalCandidateSurfacePageShell';
import {
  type AxiomInternalCandidateSurfacePageShellReviewPacket,
  type AxiomPageShellReviewDecision,
  type AxiomPageShellReviewUnit,
  buildAxiomInternalCandidateSurfacePageShellReviewPacket,
  validateAxiomInternalCandidateSurfacePageShellReviewPacket,
} from './siteInternalCandidateSurfacePageShellReviewPacket';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY =
  'axiom_internal_candidate_public_page_preview_assembly_is_internal_preview_not_public_navigation_public_approval_candidate_promotion_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE =
  '/internal/axiom-next-nbl-candidate-public-page-preview' as const;

export type AxiomCandidatePublicPagePreviewBlockTreatment =
  | 'candidate_public_copy_placeholder_review_required'
  | 'internal_basis_not_public_copy'
  | 'hidden_or_review_route_placeholder';

export type AxiomCandidatePublicPagePreviewBlock = {
  blockId: string;
  sourceRegionId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  treatment: AxiomCandidatePublicPagePreviewBlockTreatment;
  contentSource: 'axiom_kernel_object_fields_only';
  reviewRequiredBeforeCandidatePromotion: true;
  reviewRequiredBeforePublication: true;
  requiredReviewDecisions: AxiomPageShellReviewDecision[];
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomInternalCandidatePublicPagePreview = {
  previewId: string;
  surface: AxiomNextNblSiteSurface;
  sourceShellId: string;
  sourceReviewUnitId: string;
  internalPreviewPath: `${typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE}#${AxiomNextNblSiteSurface}`;
  previewStatus: 'internal_candidate_public_page_preview_not_promoted';
  routeStatus: 'internal_preview_route_only_not_public_navigation';
  candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  publicNavigationStatus: 'not_added';
  reviewExecutionStatus: 'not_executed';
  blockCount: number;
  blocks: AxiomCandidatePublicPagePreviewBlock[];
};

export type AxiomInternalCandidatePublicPagePreviewAssembly = {
  assemblyId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_public_page_preview_assembly_not_promoted';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY;
  routeBase: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE;
  sourcePageShellBundleId: string;
  sourcePageShellReviewPacketId: string;
  sourceReviewExecutionStatus: AxiomInternalCandidateSurfacePageShellReviewPacket['reviewExecutionStatus'];
  previewCount: number;
  previews: AxiomInternalCandidatePublicPagePreview[];
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

export type AxiomInternalCandidatePublicPagePreviewAssemblyValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function treatmentForRegion(
  region: AxiomCandidateSurfacePageRegion,
): AxiomCandidatePublicPagePreviewBlockTreatment {
  if (region.regionKind === 'public_draft_candidate_region_review_required') {
    return 'candidate_public_copy_placeholder_review_required';
  }
  if (region.regionKind === 'internal_basis_region') {
    return 'internal_basis_not_public_copy';
  }

  return 'hidden_or_review_route_placeholder';
}

function buildPreviewBlock(
  shell: AxiomInternalCandidateSurfacePageShell,
  region: AxiomCandidateSurfacePageRegion,
  reviewUnit: AxiomPageShellReviewUnit,
): AxiomCandidatePublicPagePreviewBlock {
  return {
    blockId: `axiom_candidate_public_page_preview_block_${shell.surface}_${region.field}`,
    sourceRegionId: region.regionId,
    field: region.field,
    operation: region.operation,
    treatment: treatmentForRegion(region),
    contentSource: 'axiom_kernel_object_fields_only',
    reviewRequiredBeforeCandidatePromotion: true,
    reviewRequiredBeforePublication: true,
    requiredReviewDecisions: [...reviewUnit.requiredDecisions],
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

function buildPreview(
  shell: AxiomInternalCandidateSurfacePageShell,
  reviewUnit: AxiomPageShellReviewUnit,
): AxiomInternalCandidatePublicPagePreview {
  const blocks = shell.regions.map((region) => buildPreviewBlock(shell, region, reviewUnit));

  return {
    previewId: `axiom_internal_candidate_public_page_preview_${shell.surface}`,
    surface: shell.surface,
    sourceShellId: shell.shellId,
    sourceReviewUnitId: reviewUnit.unitId,
    internalPreviewPath: `${AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE}#${shell.surface}`,
    previewStatus: 'internal_candidate_public_page_preview_not_promoted',
    routeStatus: 'internal_preview_route_only_not_public_navigation',
    candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    publicNavigationStatus: 'not_added',
    reviewExecutionStatus: 'not_executed',
    blockCount: blocks.length,
    blocks,
  };
}

export function buildAxiomInternalCandidatePublicPagePreviewAssembly(
  sourcePageShellBundle: AxiomInternalCandidateSurfacePageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle(),
  sourcePageShellReviewPacket: AxiomInternalCandidateSurfacePageShellReviewPacket = buildAxiomInternalCandidateSurfacePageShellReviewPacket(
    sourcePageShellBundle,
  ),
): AxiomInternalCandidatePublicPagePreviewAssembly {
  const previews = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
    const shell = sourcePageShellBundle.shells.find((candidate) => candidate.surface === surface);
    const reviewUnit = sourcePageShellReviewPacket.reviewUnits.find(
      (candidate) =>
        candidate.unitType === 'surface_page_shell_review' && candidate.surface === surface,
    );

    if (!shell) {
      throw new Error(`axiom_candidate_public_page_preview_shell_missing:${surface}`);
    }
    if (!reviewUnit) {
      throw new Error(`axiom_candidate_public_page_preview_review_unit_missing:${surface}`);
    }

    return buildPreview(shell, reviewUnit);
  });

  return {
    assemblyId: `axiom_internal_candidate_public_page_preview_assembly_from_${sourcePageShellBundle.bundleId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_public_page_preview_assembly_not_promoted',
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY,
    routeBase: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE,
    sourcePageShellBundleId: sourcePageShellBundle.bundleId,
    sourcePageShellReviewPacketId: sourcePageShellReviewPacket.packetId,
    sourceReviewExecutionStatus: sourcePageShellReviewPacket.reviewExecutionStatus,
    previewCount: previews.length,
    previews,
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

export function validateAxiomInternalCandidatePublicPagePreviewAssembly(
  assembly: AxiomInternalCandidatePublicPagePreviewAssembly,
  sourcePageShellBundle: AxiomInternalCandidateSurfacePageShellBundle,
  sourcePageShellReviewPacket: AxiomInternalCandidateSurfacePageShellReviewPacket,
): AxiomInternalCandidatePublicPagePreviewAssemblyValidation {
  const errors: string[] = [];
  const reviewPacketValidation = validateAxiomInternalCandidateSurfacePageShellReviewPacket(
    sourcePageShellReviewPacket,
    sourcePageShellBundle,
  );
  const previewSurfaces = assembly.previews.map((preview) => preview.surface);

  pushIf(!reviewPacketValidation.valid, errors, 'source_page_shell_review_packet_must_validate');
  pushIf(assembly.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    assembly.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    assembly.status !== 'internal_candidate_public_page_preview_assembly_not_promoted',
    errors,
    'status_must_remain_internal_preview_assembly_not_promoted',
  );
  pushIf(
    assembly.boundary !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY,
    errors,
    'boundary_must_remain_internal_preview_not_public_navigation_promotion_or_release',
  );
  pushIf(
    assembly.routeBase !== AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE,
    errors,
    'route_base_must_remain_internal_candidate_public_page_preview',
  );
  pushIf(
    assembly.sourcePageShellBundleId !== sourcePageShellBundle.bundleId,
    errors,
    'source_page_shell_bundle_id_mismatch',
  );
  pushIf(
    assembly.sourcePageShellReviewPacketId !== sourcePageShellReviewPacket.packetId,
    errors,
    'source_page_shell_review_packet_id_mismatch',
  );
  pushIf(
    assembly.sourceReviewExecutionStatus !== 'not_executed',
    errors,
    'source_review_execution_status_must_remain_not_executed',
  );
  pushIf(
    assembly.previewCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'preview_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(assembly.previewCount !== assembly.previews.length, errors, 'preview_count_mismatch');

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !previewSurfaces.includes(surface),
      errors,
      `candidate_public_page_preview_missing:${surface}`,
    );
  }

  for (const preview of assembly.previews) {
    const sourceShell = sourcePageShellBundle.shells.find(
      (shell) => shell.surface === preview.surface,
    );
    const sourceReviewUnit = sourcePageShellReviewPacket.reviewUnits.find(
      (unit) => unit.unitType === 'surface_page_shell_review' && unit.surface === preview.surface,
    );

    pushIf(
      !sourceShell,
      errors,
      `candidate_public_page_preview_source_shell_missing:${preview.surface}`,
    );
    pushIf(
      !sourceReviewUnit,
      errors,
      `candidate_public_page_preview_source_review_unit_missing:${preview.surface}`,
    );

    if (sourceShell && sourceReviewUnit) {
      pushIf(
        preview.sourceShellId !== sourceShell.shellId ||
          preview.sourceReviewUnitId !== sourceReviewUnit.unitId ||
          preview.blockCount !== sourceShell.regionCount ||
          preview.blockCount !== preview.blocks.length,
        errors,
        `candidate_public_page_preview_source_mismatch:${preview.surface}`,
      );

      for (const block of preview.blocks) {
        const sourceRegion = sourceShell.regions.find(
          (region) => region.regionId === block.sourceRegionId,
        );

        pushIf(
          !sourceRegion,
          errors,
          `candidate_public_page_preview_block_source_missing:${block.blockId}`,
        );
        if (sourceRegion) {
          pushIf(
            block.field !== sourceRegion.field ||
              block.operation !== sourceRegion.operation ||
              block.treatment !== treatmentForRegion(sourceRegion),
            errors,
            `candidate_public_page_preview_block_source_mismatch:${block.blockId}`,
          );
        }
        pushIf(
          block.contentSource !== 'axiom_kernel_object_fields_only' ||
            block.reviewRequiredBeforeCandidatePromotion !== true ||
            block.reviewRequiredBeforePublication !== true ||
            block.publicUseStatus !== 'not_public_approved' ||
            block.publicationStatus !== 'not_published' ||
            block.requiredReviewDecisions.length === 0,
          errors,
          `candidate_public_page_preview_block_must_remain_review_required_not_public:${block.blockId}`,
        );
      }
    }

    pushIf(
      preview.internalPreviewPath !==
        `${AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE}#${preview.surface}`,
      errors,
      `candidate_public_page_preview_internal_path_must_match_internal_anchor:${preview.surface}`,
    );
    pushIf(
      !preview.internalPreviewPath.startsWith('/internal/'),
      errors,
      `candidate_public_page_preview_path_must_remain_internal:${preview.surface}`,
    );
    pushIf(
      preview.previewStatus !== 'internal_candidate_public_page_preview_not_promoted' ||
        preview.routeStatus !== 'internal_preview_route_only_not_public_navigation' ||
        preview.candidateSurfaceStatus !== 'not_promoted_to_falcon_candidate_surface' ||
        preview.publicUseStatus !== 'not_public_approved' ||
        preview.publicationStatus !== 'not_published' ||
        preview.publicNavigationStatus !== 'not_added' ||
        preview.reviewExecutionStatus !== 'not_executed',
      errors,
      `candidate_public_page_preview_status_must_remain_internal_not_promoted:${preview.surface}`,
    );
  }

  pushIf(
    assembly.movementBoundary.runtime !== 'not_changed' ||
      assembly.movementBoundary.prompt !== 'not_changed' ||
      assembly.movementBoundary.retrieval !== 'not_changed' ||
      assembly.movementBoundary.modelProvider !== 'not_changed' ||
      assembly.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    assembly.movementBoundary.publicApproval !== 'not_approved' ||
      assembly.movementBoundary.publication !== 'not_published' ||
      assembly.movementBoundary.publicNavigation !== 'not_added' ||
      assembly.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      assembly.movementBoundary.sourceValidity !== 'not_decided' ||
      assembly.movementBoundary.sourceCurrentness !== 'not_decided' ||
      assembly.movementBoundary.supportValidity !== 'not_decided' ||
      assembly.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      assembly.movementBoundary.runtimeApproved !== 'not_approved' ||
      assembly.movementBoundary.publicApproved !== 'not_approved' ||
      assembly.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      assembly.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'candidate_public_page_preview_assembly_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
