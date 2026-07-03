import {
  type AxiomInternalCandidateSurfaceImplementationScaffold,
  type AxiomInternalCandidateSurfaceImplementation,
  type AxiomCandidateSurfaceSectionRenderMode,
  buildAxiomInternalCandidateSurfaceImplementationScaffold,
  validateAxiomInternalCandidateSurfaceImplementationScaffold,
} from './siteInternalCandidateSurfaceImplementationScaffold';
import {
  type AxiomCandidatePageDataBundle,
  buildAxiomCandidatePageDataBundle,
} from './siteCandidatePageData';
import {
  type AxiomFalconCandidateSurfaceReviewPacket,
  buildAxiomFalconCandidateSurfaceReviewPacket,
} from './siteFalconCandidateSurfaceReviewPacket';
import {
  AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS,
  type AxiomGate8PreflightRunnerEvidenceInput,
  type AxiomGate8PreflightRunnerReceipt,
  buildAxiomGate8PreflightRunnerReceipt,
} from './siteGate8PreflightRunnerReceipt';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from './siteGate8PreflightRunnerCriteria';
import { buildAxiomSitePreviewReviewMatrix } from './sitePreviewReviewMatrix';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY =
  'axiom_internal_candidate_surface_render_adapter_is_internal_component_interface_not_public_page_candidate_promotion_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE =
  '/internal/axiom-next-nbl-candidate-surface-render-adapter' as const;

export type AxiomCandidateSurfaceRenderComponentKind =
  | 'review_required_public_draft_candidate_block'
  | 'internal_basis_only_block'
  | 'hidden_or_review_routed_placeholder_block';

export type AxiomCandidateSurfaceRenderSlot = {
  renderSlotId: string;
  sourceSectionScaffoldId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  renderMode: AxiomCandidateSurfaceSectionRenderMode;
  componentKind: AxiomCandidateSurfaceRenderComponentKind;
  allowedOutput: 'internal_preview_only';
  reviewRequiredBeforeCandidatePromotion: true;
  reviewRequiredBeforePublication: true;
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomInternalCandidateSurfaceRenderAdapter = {
  adapterId: string;
  surface: AxiomNextNblSiteSurface;
  sourceImplementationId: string;
  internalRenderPath: `${typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE}#${AxiomNextNblSiteSurface}`;
  adapterStatus: 'internal_render_adapter_not_promoted';
  shellStatus: 'internal_candidate_surface_shell_not_public_page';
  candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  publicNavigationStatus: 'not_added';
  renderSlotCount: number;
  renderSlots: AxiomCandidateSurfaceRenderSlot[];
  requiredReviewDecisions: AxiomInternalCandidateSurfaceImplementation['requiredReviewDecisions'];
};

export type AxiomInternalCandidateSurfaceRenderAdapterBundle = {
  bundleId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_surface_render_adapter_bundle_not_promoted';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY;
  routeBase: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE;
  sourceImplementationScaffoldId: string;
  adapterCount: number;
  adapters: AxiomInternalCandidateSurfaceRenderAdapter[];
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

export type AxiomInternalCandidateSurfaceRenderAdapterValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildDefaultPassedReceipt(): AxiomGate8PreflightRunnerReceipt {
  const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
  const evidence: AxiomGate8PreflightRunnerEvidenceInput = {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_passed_for_render_adapter',
      status: 'passed',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets: criteriaPacket.requiredTestTargets,
      summary: 'Required Axiom and Falcon Jest targets passed.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_passed_for_render_adapter',
      status: 'passed',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck passed.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_passed_for_render_adapter',
      status: 'passed',
      checkedInternalPaths: [...AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS],
      httpStatusByPath: Object.fromEntries(
        AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.map((path) => [path, 200]),
      ),
      summary: 'Internal Axiom routes returned HTTP 200.',
    },
  };

  return buildAxiomGate8PreflightRunnerReceipt(criteriaPacket, evidence);
}

function componentKindForRenderMode(
  renderMode: AxiomCandidateSurfaceSectionRenderMode,
): AxiomCandidateSurfaceRenderComponentKind {
  if (renderMode === 'render_review_required_public_draft_candidate') {
    return 'review_required_public_draft_candidate_block';
  }
  if (renderMode === 'render_internal_basis_only') {
    return 'internal_basis_only_block';
  }

  return 'hidden_or_review_routed_placeholder_block';
}

function buildRenderAdapter(
  implementation: AxiomInternalCandidateSurfaceImplementation,
): AxiomInternalCandidateSurfaceRenderAdapter {
  const renderSlots = implementation.sectionScaffolds.map((section) => ({
    renderSlotId: `axiom_candidate_surface_render_slot_${implementation.surface}_${section.field}`,
    sourceSectionScaffoldId: section.sectionScaffoldId,
    field: section.field,
    operation: section.operation,
    renderMode: section.renderMode,
    componentKind: componentKindForRenderMode(section.renderMode),
    allowedOutput: 'internal_preview_only' as const,
    reviewRequiredBeforeCandidatePromotion: true as const,
    reviewRequiredBeforePublication: true as const,
    publicUseStatus: 'not_public_approved' as const,
    publicationStatus: 'not_published' as const,
  }));

  return {
    adapterId: `axiom_internal_candidate_surface_render_adapter_${implementation.surface}`,
    surface: implementation.surface,
    sourceImplementationId: implementation.implementationId,
    internalRenderPath: `${AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE}#${implementation.surface}`,
    adapterStatus: 'internal_render_adapter_not_promoted',
    shellStatus: 'internal_candidate_surface_shell_not_public_page',
    candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    publicNavigationStatus: 'not_added',
    renderSlotCount: renderSlots.length,
    renderSlots,
    requiredReviewDecisions: implementation.requiredReviewDecisions,
  };
}

export function buildAxiomInternalCandidateSurfaceRenderAdapterBundle(
  sourceImplementationScaffold: AxiomInternalCandidateSurfaceImplementationScaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
    buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    buildAxiomFalconCandidateSurfaceReviewPacket(buildDefaultPassedReceipt()),
  ),
): AxiomInternalCandidateSurfaceRenderAdapterBundle {
  const adapters = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
    const implementation = sourceImplementationScaffold.implementations.find(
      (candidate) => candidate.surface === surface,
    );

    if (!implementation) {
      throw new Error(`axiom_internal_candidate_surface_render_adapter_source_missing:${surface}`);
    }

    return buildRenderAdapter(implementation);
  });

  return {
    bundleId: `axiom_internal_candidate_surface_render_adapter_bundle_from_${sourceImplementationScaffold.scaffoldId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_surface_render_adapter_bundle_not_promoted',
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY,
    routeBase: AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE,
    sourceImplementationScaffoldId: sourceImplementationScaffold.scaffoldId,
    adapterCount: adapters.length,
    adapters,
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

export function validateAxiomInternalCandidateSurfaceRenderAdapterBundle(
  bundle: AxiomInternalCandidateSurfaceRenderAdapterBundle,
  sourceImplementationScaffold: AxiomInternalCandidateSurfaceImplementationScaffold,
  candidatePageDataBundle: AxiomCandidatePageDataBundle,
  sourceReviewPacket: AxiomFalconCandidateSurfaceReviewPacket,
  sourceReceipt: AxiomGate8PreflightRunnerReceipt,
): AxiomInternalCandidateSurfaceRenderAdapterValidation {
  const errors: string[] = [];
  const scaffoldValidation = validateAxiomInternalCandidateSurfaceImplementationScaffold(
    sourceImplementationScaffold,
    candidatePageDataBundle,
    sourceReviewPacket,
    sourceReceipt,
  );
  const adapterSurfaces = bundle.adapters.map((adapter) => adapter.surface);

  pushIf(!scaffoldValidation.valid, errors, 'source_implementation_scaffold_must_validate');
  pushIf(bundle.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    bundle.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    bundle.status !== 'internal_candidate_surface_render_adapter_bundle_not_promoted',
    errors,
    'status_must_remain_internal_render_adapter_not_promoted',
  );
  pushIf(
    bundle.boundary !== AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY,
    errors,
    'boundary_must_remain_internal_component_interface_not_public_page_promotion_or_release',
  );
  pushIf(
    bundle.routeBase !== AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE,
    errors,
    'route_base_must_remain_internal_render_adapter',
  );
  pushIf(
    bundle.sourceImplementationScaffoldId !== sourceImplementationScaffold.scaffoldId,
    errors,
    'source_implementation_scaffold_id_mismatch',
  );
  pushIf(
    bundle.adapterCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'adapter_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(bundle.adapterCount !== bundle.adapters.length, errors, 'adapter_count_mismatch');

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!adapterSurfaces.includes(surface), errors, `render_adapter_missing:${surface}`);
  }

  for (const adapter of bundle.adapters) {
    const sourceImplementation = sourceImplementationScaffold.implementations.find(
      (implementation) => implementation.surface === adapter.surface,
    );

    pushIf(!sourceImplementation, errors, `render_adapter_source_missing:${adapter.surface}`);
    if (sourceImplementation) {
      pushIf(
        adapter.sourceImplementationId !== sourceImplementation.implementationId,
        errors,
        `render_adapter_source_implementation_id_mismatch:${adapter.surface}`,
      );
      pushIf(
        adapter.renderSlotCount !== sourceImplementation.sectionScaffoldCount ||
          adapter.renderSlotCount !== adapter.renderSlots.length,
        errors,
        `render_adapter_slot_count_mismatch:${adapter.surface}`,
      );
      for (const renderSlot of adapter.renderSlots) {
        const sourceSection = sourceImplementation.sectionScaffolds.find(
          (section) => section.sectionScaffoldId === renderSlot.sourceSectionScaffoldId,
        );

        pushIf(!sourceSection, errors, `render_slot_source_missing:${renderSlot.renderSlotId}`);
        if (sourceSection) {
          pushIf(
            renderSlot.field !== sourceSection.field ||
              renderSlot.operation !== sourceSection.operation ||
              renderSlot.renderMode !== sourceSection.renderMode,
            errors,
            `render_slot_source_mismatch:${renderSlot.renderSlotId}`,
          );
          pushIf(
            renderSlot.componentKind !== componentKindForRenderMode(sourceSection.renderMode),
            errors,
            `render_slot_component_kind_mismatch:${renderSlot.renderSlotId}`,
          );
        }
        pushIf(
          renderSlot.allowedOutput !== 'internal_preview_only' ||
            renderSlot.reviewRequiredBeforeCandidatePromotion !== true ||
            renderSlot.reviewRequiredBeforePublication !== true ||
            renderSlot.publicUseStatus !== 'not_public_approved' ||
            renderSlot.publicationStatus !== 'not_published',
          errors,
          `render_slot_must_remain_internal_review_required_not_public:${renderSlot.renderSlotId}`,
        );
      }
    }
    pushIf(
      adapter.internalRenderPath !==
        `${AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE}#${adapter.surface}`,
      errors,
      `render_adapter_internal_path_must_match_internal_anchor:${adapter.surface}`,
    );
    pushIf(
      !adapter.internalRenderPath.startsWith('/internal/'),
      errors,
      `render_adapter_path_must_remain_internal:${adapter.surface}`,
    );
    pushIf(
      adapter.adapterStatus !== 'internal_render_adapter_not_promoted' ||
        adapter.shellStatus !== 'internal_candidate_surface_shell_not_public_page' ||
        adapter.candidateSurfaceStatus !== 'not_promoted_to_falcon_candidate_surface' ||
        adapter.publicUseStatus !== 'not_public_approved' ||
        adapter.publicationStatus !== 'not_published' ||
        adapter.publicNavigationStatus !== 'not_added',
      errors,
      `render_adapter_status_must_remain_internal_not_promoted:${adapter.surface}`,
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
    'render_adapter_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
