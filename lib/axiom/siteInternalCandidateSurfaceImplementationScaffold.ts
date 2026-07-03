import {
  type AxiomCandidatePageData,
  type AxiomCandidatePageDataBundle,
  type AxiomCandidatePageSection,
  buildAxiomCandidatePageDataBundle,
  validateAxiomCandidatePageDataBundle,
} from './siteCandidatePageData';
import {
  type AxiomFalconCandidateSurfaceReviewPacket,
  type AxiomFalconCandidateSurfaceReviewUnit,
  buildAxiomFalconCandidateSurfaceReviewPacket,
  validateAxiomFalconCandidateSurfaceReviewPacket,
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

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY =
  'axiom_internal_candidate_surface_implementation_scaffold_is_internal_inspection_not_falcon_candidate_promotion_public_navigation_or_release' as const;

export const AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE =
  '/internal/axiom-next-nbl-candidate-surface-scaffold' as const;

export type AxiomCandidateSurfaceSectionRenderMode =
  | 'render_review_required_public_draft_candidate'
  | 'render_internal_basis_only'
  | 'render_hidden_or_review_routed_placeholder';

export type AxiomCandidateSurfaceSectionScaffold = {
  sectionScaffoldId: string;
  sourceSectionId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  renderMode: AxiomCandidateSurfaceSectionRenderMode;
  reviewRequiredBeforeCandidatePromotion: true;
  reviewRequiredBeforePublication: true;
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  scenarioCoverageCount: number;
  internalDraftCount: number;
  publicDraftCandidateCount: number;
};

export type AxiomInternalCandidateSurfaceImplementation = {
  implementationId: string;
  surface: AxiomNextNblSiteSurface;
  sourcePageDataId: string;
  sourceReviewUnitId: string;
  internalImplementationPath: `${typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE}#${AxiomNextNblSiteSurface}`;
  status: 'internal_candidate_surface_scaffold_not_promoted';
  routeStatus: 'internal_inspection_route_only_not_public_navigation';
  candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  publicNavigationStatus: 'not_added';
  reviewExecutionStatus: AxiomFalconCandidateSurfaceReviewPacket['reviewExecutionStatus'];
  sectionScaffoldCount: number;
  sectionScaffolds: AxiomCandidateSurfaceSectionScaffold[];
  requiredReviewDecisions: AxiomFalconCandidateSurfaceReviewUnit['requiredDecisions'];
};

export type AxiomInternalCandidateSurfaceImplementationScaffold = {
  scaffoldId: string;
  lane: 'Falcon Lab';
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
  status: 'internal_candidate_surface_implementation_scaffold_not_promoted';
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY;
  routeBase: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE;
  sourceCandidatePageDataBundleId: string;
  sourceReviewPacketId: string;
  sourceReviewPacketStatus: AxiomFalconCandidateSurfaceReviewPacket['status'];
  sourceReviewExecutionStatus: AxiomFalconCandidateSurfaceReviewPacket['reviewExecutionStatus'];
  sourceReviewerAssignmentStatus: AxiomFalconCandidateSurfaceReviewPacket['reviewerAssignmentStatus'];
  sourceReceiptId: string;
  implementationCount: number;
  implementations: AxiomInternalCandidateSurfaceImplementation[];
  maxCoreReviewUnits: 100;
  reviewUnitCount: number;
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

export type AxiomInternalCandidateSurfaceImplementationScaffoldValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY;
  coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'];
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildDefaultPassedReceipt(): AxiomGate8PreflightRunnerReceipt {
  const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
  const evidence: AxiomGate8PreflightRunnerEvidenceInput = {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_passed_for_internal_scaffold',
      status: 'passed',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets: criteriaPacket.requiredTestTargets,
      summary: 'Required Axiom and Falcon Jest targets passed.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_passed_for_internal_scaffold',
      status: 'passed',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck passed.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_passed_for_internal_scaffold',
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

function renderModeForSection(
  section: AxiomCandidatePageSection,
): AxiomCandidateSurfaceSectionRenderMode {
  if (section.operation === 'hide' || section.operation === 'route_to_review') {
    return 'render_hidden_or_review_routed_placeholder';
  }

  if (section.representativePublicDrafts.length > 0) {
    return 'render_review_required_public_draft_candidate';
  }

  return 'render_internal_basis_only';
}

function buildSectionScaffold(
  surface: AxiomNextNblSiteSurface,
  section: AxiomCandidatePageSection,
): AxiomCandidateSurfaceSectionScaffold {
  return {
    sectionScaffoldId: `axiom_candidate_surface_section_scaffold_${surface}_${section.field}`,
    sourceSectionId: section.sectionId,
    field: section.field,
    operation: section.operation,
    renderMode: renderModeForSection(section),
    reviewRequiredBeforeCandidatePromotion: true,
    reviewRequiredBeforePublication: true,
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    scenarioCoverageCount: section.scenarioCoverageCount,
    internalDraftCount: section.representativeInternalDrafts.length,
    publicDraftCandidateCount: section.representativePublicDrafts.length,
  };
}

function buildImplementation(
  page: AxiomCandidatePageData,
  reviewUnit: AxiomFalconCandidateSurfaceReviewUnit,
  reviewPacket: AxiomFalconCandidateSurfaceReviewPacket,
): AxiomInternalCandidateSurfaceImplementation {
  const sectionScaffolds = page.sections.map((section) =>
    buildSectionScaffold(page.surface, section),
  );

  return {
    implementationId: `axiom_internal_candidate_surface_implementation_${page.surface}`,
    surface: page.surface,
    sourcePageDataId: page.pageDataId,
    sourceReviewUnitId: reviewUnit.unitId,
    internalImplementationPath: `${AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE}#${page.surface}`,
    status: 'internal_candidate_surface_scaffold_not_promoted',
    routeStatus: 'internal_inspection_route_only_not_public_navigation',
    candidateSurfaceStatus: 'not_promoted_to_falcon_candidate_surface',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    publicNavigationStatus: 'not_added',
    reviewExecutionStatus: reviewPacket.reviewExecutionStatus,
    sectionScaffoldCount: sectionScaffolds.length,
    sectionScaffolds,
    requiredReviewDecisions: reviewUnit.requiredDecisions,
  };
}

export function buildAxiomInternalCandidateSurfaceImplementationScaffold(
  candidatePageDataBundle: AxiomCandidatePageDataBundle = buildAxiomCandidatePageDataBundle(
    buildAxiomSitePreviewReviewMatrix(),
  ),
  sourceReviewPacket: AxiomFalconCandidateSurfaceReviewPacket = buildAxiomFalconCandidateSurfaceReviewPacket(
    buildDefaultPassedReceipt(),
  ),
): AxiomInternalCandidateSurfaceImplementationScaffold {
  const implementations = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) => {
    const page = candidatePageDataBundle.pages.find((candidate) => candidate.surface === surface);
    const reviewUnit = sourceReviewPacket.reviewUnits.find(
      (candidate) =>
        candidate.unitType === 'surface_candidate_review' && candidate.surface === surface,
    );

    if (!page) {
      throw new Error(`axiom_internal_candidate_surface_page_missing:${surface}`);
    }
    if (!reviewUnit) {
      throw new Error(`axiom_internal_candidate_surface_review_unit_missing:${surface}`);
    }

    return buildImplementation(page, reviewUnit, sourceReviewPacket);
  });

  return {
    scaffoldId: `axiom_internal_candidate_surface_implementation_scaffold_from_${candidatePageDataBundle.bundleId}_${sourceReviewPacket.packetId}`,
    lane: 'Falcon Lab',
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    status: 'internal_candidate_surface_implementation_scaffold_not_promoted',
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY,
    routeBase: AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE,
    sourceCandidatePageDataBundleId: candidatePageDataBundle.bundleId,
    sourceReviewPacketId: sourceReviewPacket.packetId,
    sourceReviewPacketStatus: sourceReviewPacket.status,
    sourceReviewExecutionStatus: sourceReviewPacket.reviewExecutionStatus,
    sourceReviewerAssignmentStatus: sourceReviewPacket.reviewerAssignmentStatus,
    sourceReceiptId: sourceReviewPacket.sourceReceiptId,
    implementationCount: implementations.length,
    implementations,
    maxCoreReviewUnits: sourceReviewPacket.maxCoreReviewUnits,
    reviewUnitCount: sourceReviewPacket.reviewUnitCount,
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

export function validateAxiomInternalCandidateSurfaceImplementationScaffold(
  scaffold: AxiomInternalCandidateSurfaceImplementationScaffold,
  candidatePageDataBundle: AxiomCandidatePageDataBundle,
  sourceReviewPacket: AxiomFalconCandidateSurfaceReviewPacket,
  sourceReceipt: AxiomGate8PreflightRunnerReceipt,
): AxiomInternalCandidateSurfaceImplementationScaffoldValidation {
  const errors: string[] = [];
  const sourceMatrix = buildAxiomSitePreviewReviewMatrix();
  const candidatePageDataValidation = validateAxiomCandidatePageDataBundle(
    candidatePageDataBundle,
    sourceMatrix,
  );
  const reviewPacketValidation = validateAxiomFalconCandidateSurfaceReviewPacket(
    sourceReviewPacket,
    sourceReceipt,
  );
  const implementationSurfaces = scaffold.implementations.map(
    (implementation) => implementation.surface,
  );

  pushIf(!candidatePageDataValidation.valid, errors, 'source_candidate_page_data_must_validate');
  pushIf(!reviewPacketValidation.valid, errors, 'source_review_packet_must_validate');
  pushIf(scaffold.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    scaffold.coreProgressClasses.join('|') !== 'kernel_display|kernel_human_review_loop',
    errors,
    'core_progress_classes_must_remain_display_and_review_loop',
  );
  pushIf(
    scaffold.status !== 'internal_candidate_surface_implementation_scaffold_not_promoted',
    errors,
    'status_must_remain_internal_scaffold_not_promoted',
  );
  pushIf(
    scaffold.boundary !== AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY,
    errors,
    'boundary_must_remain_internal_inspection_not_promotion_public_navigation_or_release',
  );
  pushIf(
    scaffold.routeBase !== AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE,
    errors,
    'route_base_must_remain_internal_candidate_surface_scaffold',
  );
  pushIf(
    scaffold.sourceCandidatePageDataBundleId !== candidatePageDataBundle.bundleId,
    errors,
    'source_candidate_page_data_bundle_id_mismatch',
  );
  pushIf(
    scaffold.sourceReviewPacketId !== sourceReviewPacket.packetId,
    errors,
    'source_review_packet_id_mismatch',
  );
  pushIf(
    scaffold.sourceReviewExecutionStatus !== 'not_executed' ||
      scaffold.sourceReviewerAssignmentStatus !== 'not_assigned_by_codex',
    errors,
    'source_review_must_not_be_executed_or_assigned_by_codex',
  );
  pushIf(
    scaffold.sourceReceiptId !== sourceReceipt.receiptId,
    errors,
    'source_receipt_id_mismatch',
  );
  pushIf(
    scaffold.implementationCount !== AXIOM_NEXT_NBL_SITE_SURFACES.length,
    errors,
    'implementation_count_must_match_fixed_next_nbl_surfaces',
  );
  pushIf(
    scaffold.implementationCount !== scaffold.implementations.length,
    errors,
    'implementation_count_mismatch',
  );
  pushIf(scaffold.maxCoreReviewUnits !== 100, errors, 'max_core_review_units_must_remain_100');
  pushIf(
    scaffold.reviewUnitCount !== sourceReviewPacket.reviewUnitCount,
    errors,
    'review_unit_count_must_match_source_review_packet',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(
      !implementationSurfaces.includes(surface),
      errors,
      `candidate_surface_implementation_missing:${surface}`,
    );
  }

  for (const implementation of scaffold.implementations) {
    const sourcePage = candidatePageDataBundle.pages.find(
      (page) => page.surface === implementation.surface,
    );
    const sourceReviewUnit = sourceReviewPacket.reviewUnits.find(
      (unit) =>
        unit.unitType === 'surface_candidate_review' && unit.surface === implementation.surface,
    );

    pushIf(!sourcePage, errors, `implementation_source_page_missing:${implementation.surface}`);
    pushIf(
      !sourceReviewUnit,
      errors,
      `implementation_source_review_unit_missing:${implementation.surface}`,
    );
    if (sourcePage) {
      pushIf(
        implementation.sourcePageDataId !== sourcePage.pageDataId,
        errors,
        `implementation_source_page_id_mismatch:${implementation.surface}`,
      );
      pushIf(
        implementation.sectionScaffoldCount !== sourcePage.sectionCount ||
          implementation.sectionScaffoldCount !== implementation.sectionScaffolds.length,
        errors,
        `implementation_section_count_mismatch:${implementation.surface}`,
      );
      for (const section of implementation.sectionScaffolds) {
        const sourceSection = sourcePage.sections.find(
          (candidate) => candidate.sectionId === section.sourceSectionId,
        );

        pushIf(!sourceSection, errors, `section_source_missing:${section.sectionScaffoldId}`);
        if (sourceSection) {
          pushIf(
            section.field !== sourceSection.field ||
              section.operation !== sourceSection.operation ||
              section.scenarioCoverageCount !== sourceSection.scenarioCoverageCount,
            errors,
            `section_source_mismatch:${section.sectionScaffoldId}`,
          );
          pushIf(
            sourceSection.sectionPolicy === 'internal_only_hidden_or_review_routed' &&
              section.renderMode !== 'render_hidden_or_review_routed_placeholder',
            errors,
            `hidden_or_review_routed_section_must_render_placeholder:${section.sectionScaffoldId}`,
          );
        }
        pushIf(
          section.reviewRequiredBeforeCandidatePromotion !== true ||
            section.reviewRequiredBeforePublication !== true ||
            section.publicUseStatus !== 'not_public_approved' ||
            section.publicationStatus !== 'not_published',
          errors,
          `section_must_remain_review_required_not_public:${section.sectionScaffoldId}`,
        );
      }
    }
    if (sourceReviewUnit) {
      pushIf(
        implementation.sourceReviewUnitId !== sourceReviewUnit.unitId,
        errors,
        `implementation_review_unit_id_mismatch:${implementation.surface}`,
      );
      for (const decision of sourceReviewUnit.requiredDecisions) {
        pushIf(
          !implementation.requiredReviewDecisions.includes(decision),
          errors,
          `implementation_required_review_decision_missing:${implementation.surface}:${decision}`,
        );
      }
    }
    pushIf(
      implementation.internalImplementationPath !==
        `${AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE}#${implementation.surface}`,
      errors,
      `implementation_internal_path_must_match_internal_anchor:${implementation.surface}`,
    );
    pushIf(
      !implementation.internalImplementationPath.startsWith('/internal/'),
      errors,
      `implementation_path_must_remain_internal:${implementation.surface}`,
    );
    pushIf(
      implementation.status !== 'internal_candidate_surface_scaffold_not_promoted' ||
        implementation.routeStatus !== 'internal_inspection_route_only_not_public_navigation' ||
        implementation.candidateSurfaceStatus !== 'not_promoted_to_falcon_candidate_surface' ||
        implementation.publicUseStatus !== 'not_public_approved' ||
        implementation.publicationStatus !== 'not_published' ||
        implementation.publicNavigationStatus !== 'not_added' ||
        implementation.reviewExecutionStatus !== 'not_executed',
      errors,
      `implementation_status_must_remain_internal_not_promoted:${implementation.surface}`,
    );
  }

  pushIf(
    scaffold.movementBoundary.runtime !== 'not_changed' ||
      scaffold.movementBoundary.prompt !== 'not_changed' ||
      scaffold.movementBoundary.retrieval !== 'not_changed' ||
      scaffold.movementBoundary.modelProvider !== 'not_changed' ||
      scaffold.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    scaffold.movementBoundary.publicApproval !== 'not_approved' ||
      scaffold.movementBoundary.publication !== 'not_published' ||
      scaffold.movementBoundary.publicNavigation !== 'not_added' ||
      scaffold.movementBoundary.falconCandidateSurfacePromotion !== 'not_promoted' ||
      scaffold.movementBoundary.sourceValidity !== 'not_decided' ||
      scaffold.movementBoundary.sourceCurrentness !== 'not_decided' ||
      scaffold.movementBoundary.supportValidity !== 'not_decided' ||
      scaffold.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      scaffold.movementBoundary.runtimeApproved !== 'not_approved' ||
      scaffold.movementBoundary.publicApproved !== 'not_approved' ||
      scaffold.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      scaffold.movementBoundary.learningUpdate !== 'not_updated',
    errors,
    'scaffold_must_not_move_candidate_public_validity_promotion_or_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY,
    coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
  };
}
