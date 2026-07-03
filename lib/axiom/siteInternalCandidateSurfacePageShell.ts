import {
  AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE,
  type AxiomCandidateSurfaceRenderComponentKind,
  type AxiomCandidateSurfaceRenderSlot,
  type AxiomInternalCandidateSurfaceRenderAdapter,
  type AxiomInternalCandidateSurfaceRenderAdapterBundle,
  buildAxiomInternalCandidateSurfaceRenderAdapterBundle,
} from './siteInternalCandidateSurfaceRenderAdapter';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY =
  'axiom_internal_candidate_surface_page_shell_is_internal_preview_not_public_page_navigation_candidate_promotion_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE =
  '/internal/axiom-next-nbl-candidate-surface-page-shell' as const;

export type AxiomCandidateSurfacePageRegionKind =
  | 'public_draft_candidate_region_review_required'
  | 'internal_basis_region'
  | 'hidden_or_review_routed_region_placeholder';

export type AxiomCandidateSurfacePageRegion = {
  regionId: string;
  sourceRenderSlotId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  sourceComponentKind: AxiomCandidateSurfaceRenderComponentKind;
  regionKind: AxiomCandidateSurfacePageRegionKind;
  placement: 'surface_body';
  allowedContentSource: 'axiom_kernel_object_fields_only';
  allowedOutput: 'internal_preview_only';
  reviewRequiredBeforeCandidatePromotion: true;
  reviewRequiredBeforePublication: true;
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomInternalCandidateSurfacePageShell = {
  shellId: string;
  surface: AxiomNextNblSiteSurface;
  sourceAdapterId: string;
  sourceAdapterPath: `${typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE}#${AxiomNextNblSiteSurface}`;
  internalShellPath: `${typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE}#${AxiomNextNblSiteSurface}`;
  shellStatus: 'internal_candidate_surface_page_shell_not_promoted';
  shellKind: 'internal_preview_page_shell';
  candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  publicNavigationStatus: 'not_added';
  reviewExecutionStatus: 'not_executed';
  regionCount: number;
  regions: AxiomCandidateSurfacePageRegion[];
  requiredReviewDecisions: AxiomInternalCandidateSurfaceRenderAdapter['requiredReviewDecisions'];
};

export type AxiomInternalCandidateSurfacePageShellBundle = {
  bundleId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_surface_page_shell_bundle_not_promoted';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY;
  routeBase: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE;
  sourceRenderAdapterBundleId: string;
  shellCount: number;
  shells: AxiomInternalCandidateSurfacePageShell[];
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

export type AxiomInternalCandidateSurfacePageShellValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function regionKindForComponentKind(
  componentKind: AxiomCandidateSurfaceRenderComponentKind,
): AxiomCandidateSurfacePageRegionKind {
  if (componentKind === 'review_required_public_draft_candidate_block') {
    return 'public_draft_candidate_region_review_required';
  }
  if (componentKind === 'internal_basis_only_block') {
    return 'internal_basis_region';
  }

  return 'hidden_or_review_routed_region_placeholder';
}

function buildPageRegion(
  surface: AxiomNextNblSiteSurface,
  renderSlot: AxiomCandidateSurfaceRenderSlot,
): AxiomCandidateSurfacePageRegion {
  return {
    regionId: `axiom_candidate_surface_page_region_${surface}_${renderSlot.field}`,
    sourceRenderSlotId: renderSlot.renderSlotId,
    field: renderSlot.field,
    operation: renderSlot.operation,
    sourceComponentKind: renderSlot.componentKind,
    regionKind: regionKindForComponentKind(renderSlot.componentKind),
    placement: 'surface_body',
    allowedContentSource: 'axiom_kernel_object_fields_only',
    allowedOutput: 'internal_preview_only',
    reviewRequiredBeforeCandidatePromotion: true,
    reviewRequiredBeforePublication: true,
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

function buildPageShell(
  adapter: AxiomInternalCandidateSurfaceRenderAdapter,
): AxiomInternalCandidateSurfacePageShell {
  const regions = adapter.renderSlots.map((renderSlot) =>
    buildPageRegion(adapter.surface, renderSlot),
  );

  return {
    shellId: `axiom_internal_candidate_surface_page_shell_${adapter.surface}`,
    surface: adapter.surface,
    sourceAdapterId: adapter.adapterId,
    sourceAdapterPath: adapter.internalRenderPath,
    internalShellPath: `${AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE}#${adapter.surface}`,
    shellStatus: 'internal_candidate_surface_page_shell_not_promoted',
    shellKind: 'internal_preview_page_shell',
    candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    publicNavigationStatus: 'not_added',
    reviewExecutionStatus: 'not_executed',
    regionCount: regions.length,
    regions,
    requiredReviewDecisions: adapter.requiredReviewDecisions,
  };
}

export function buildAxiomInternalCandidateSurfacePageShellBundle(
  sourceRenderAdapterBundle: AxiomInternalCandidateSurfaceRenderAdapterBundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle(),
): AxiomInternalCandidateSurfacePageShellBundle {
  const shells = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
    const adapter = sourceRenderAdapterBundle.adapters.find(
      (candidate) => candidate.surface === surface,
    );

    if (!adapter) {
      throw new Error(`axiom_internal_candidate_surface_page_shell_source_missing:${surface}`);
    }

    return buildPageShell(adapter);
  });

  return {
    bundleId: `axiom_internal_candidate_surface_page_shell_bundle_from_${sourceRenderAdapterBundle.bundleId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_surface_page_shell_bundle_not_promoted',
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY,
    routeBase: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE,
    sourceRenderAdapterBundleId: sourceRenderAdapterBundle.bundleId,
    shellCount: shells.length,
    shells,
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

export function validateAxiomInternalCandidateSurfacePageShellBundle(
  bundle: AxiomInternalCandidateSurfacePageShellBundle,
  sourceRenderAdapterBundle: AxiomInternalCandidateSurfaceRenderAdapterBundle,
): AxiomInternalCandidateSurfacePageShellValidation {
  const errors: string[] = [];
  const shellSurfaces = bundle.shells.map((shell) => shell.surface);

  pushIf(bundle.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    bundle.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    bundle.status !== 'internal_candidate_surface_page_shell_bundle_not_promoted',
    errors,
    'status_must_remain_internal_page_shell_not_promoted',
  );
  pushIf(
    bundle.boundary !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY,
    errors,
    'boundary_must_remain_internal_preview_not_public_page_navigation_promotion_or_release',
  );
  pushIf(
    bundle.routeBase !== AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE,
    errors,
    'route_base_must_remain_internal_page_shell',
  );
  pushIf(
    bundle.sourceRenderAdapterBundleId !== sourceRenderAdapterBundle.bundleId,
    errors,
    'source_render_adapter_bundle_id_mismatch',
  );
  pushIf(
    bundle.shellCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'shell_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(bundle.shellCount !== bundle.shells.length, errors, 'shell_count_mismatch');

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!shellSurfaces.includes(surface), errors, `page_shell_missing:${surface}`);
  }

  for (const shell of bundle.shells) {
    const sourceAdapter = sourceRenderAdapterBundle.adapters.find(
      (adapter) => adapter.surface === shell.surface,
    );

    pushIf(!sourceAdapter, errors, `page_shell_source_missing:${shell.surface}`);
    if (sourceAdapter) {
      pushIf(
        shell.sourceAdapterId !== sourceAdapter.adapterId ||
          shell.sourceAdapterPath !== sourceAdapter.internalRenderPath,
        errors,
        `page_shell_source_adapter_mismatch:${shell.surface}`,
      );
      pushIf(
        shell.regionCount !== sourceAdapter.renderSlotCount ||
          shell.regionCount !== shell.regions.length,
        errors,
        `page_shell_region_count_mismatch:${shell.surface}`,
      );
      for (const region of shell.regions) {
        const sourceRenderSlot = sourceAdapter.renderSlots.find(
          (renderSlot) => renderSlot.renderSlotId === region.sourceRenderSlotId,
        );

        pushIf(!sourceRenderSlot, errors, `page_region_source_missing:${region.regionId}`);
        if (sourceRenderSlot) {
          pushIf(
            region.field !== sourceRenderSlot.field ||
              region.operation !== sourceRenderSlot.operation ||
              region.sourceComponentKind !== sourceRenderSlot.componentKind,
            errors,
            `page_region_source_mismatch:${region.regionId}`,
          );
          pushIf(
            region.regionKind !== regionKindForComponentKind(sourceRenderSlot.componentKind),
            errors,
            `page_region_kind_mismatch:${region.regionId}`,
          );
        }
        pushIf(
          region.placement !== 'surface_body' ||
            region.allowedContentSource !== 'axiom_kernel_object_fields_only' ||
            region.allowedOutput !== 'internal_preview_only' ||
            region.reviewRequiredBeforeCandidatePromotion !== true ||
            region.reviewRequiredBeforePublication !== true ||
            region.publicUseStatus !== 'not_public_approved' ||
            region.publicationStatus !== 'not_published',
          errors,
          `page_region_must_remain_internal_review_required_not_public:${region.regionId}`,
        );
      }
    }
    pushIf(
      shell.internalShellPath !==
        `${AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE}#${shell.surface}`,
      errors,
      `page_shell_internal_path_must_match_internal_anchor:${shell.surface}`,
    );
    pushIf(
      !shell.internalShellPath.startsWith('/internal/'),
      errors,
      `page_shell_path_must_remain_internal:${shell.surface}`,
    );
    pushIf(
      shell.shellStatus !== 'internal_candidate_surface_page_shell_not_promoted' ||
        shell.shellKind !== 'internal_preview_page_shell' ||
        shell.candidateSurfaceStatus !== 'not_promoted_to_falcon_candidate_surface' ||
        shell.publicUseStatus !== 'not_public_approved' ||
        shell.publicationStatus !== 'not_published' ||
        shell.publicNavigationStatus !== 'not_added' ||
        shell.reviewExecutionStatus !== 'not_executed',
      errors,
      `page_shell_status_must_remain_internal_not_promoted:${shell.surface}`,
    );
  }

  pushIf(
    bundle.movementBoundary.runtime !== 'not_changed' ||
      bundle.movementBoundary.prompt !== 'not_changed' ||
      bundle.movementBoundary.retrieval !== 'not_changed' ||
      bundle.movementBoundary.modelProvider !== 'not_changed' ||
      bundle.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    bundle.movementBoundary.publicApproval !== 'not_approved' ||
      bundle.movementBoundary.publication !== 'not_published' ||
      bundle.movementBoundary.publicNavigation !== 'not_added' ||
      bundle.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      bundle.movementBoundary.sourceValidity !== 'not_decided' ||
      bundle.movementBoundary.sourceCurrentness !== 'not_decided' ||
      bundle.movementBoundary.supportValidity !== 'not_decided' ||
      bundle.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      bundle.movementBoundary.runtimeApproved !== 'not_approved' ||
      bundle.movementBoundary.publicApproved !== 'not_approved' ||
      bundle.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      bundle.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'page_shell_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
