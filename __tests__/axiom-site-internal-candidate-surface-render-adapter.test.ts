import {
  AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE,
  buildAxiomInternalCandidateSurfaceRenderAdapterBundle,
  validateAxiomInternalCandidateSurfaceRenderAdapterBundle,
  type AxiomInternalCandidateSurfaceRenderAdapterBundle,
} from '@/lib/axiom/siteInternalCandidateSurfaceRenderAdapter';
import { buildAxiomInternalCandidateSurfaceImplementationScaffold } from '@/lib/axiom/siteInternalCandidateSurfaceImplementationScaffold';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { buildAxiomFalconCandidateSurfaceReviewPacket } from '@/lib/axiom/siteFalconCandidateSurfaceReviewPacket';
import {
  AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS,
  buildAxiomGate8PreflightRunnerReceipt,
  type AxiomGate8PreflightRunnerEvidenceInput,
} from '@/lib/axiom/siteGate8PreflightRunnerReceipt';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from '@/lib/axiom/siteGate8PreflightRunnerCriteria';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function buildPassingEvidence(targets: string[]): AxiomGate8PreflightRunnerEvidenceInput {
  return {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_passed_for_render_adapter_test',
      status: 'passed',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets,
      summary: 'Required Axiom and Falcon Jest targets passed.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_passed_for_render_adapter_test',
      status: 'passed',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck passed.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_passed_for_render_adapter_test',
      status: 'passed',
      checkedInternalPaths: [...AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS],
      httpStatusByPath: Object.fromEntries(
        AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.map((path) => [path, 200]),
      ),
      summary: 'Internal Axiom routes returned HTTP 200.',
    },
  };
}

function buildSources() {
  const candidatePageDataBundle = buildAxiomCandidatePageDataBundle(
    buildAxiomSitePreviewReviewMatrix(),
  );
  const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
  const receipt = buildAxiomGate8PreflightRunnerReceipt(
    criteriaPacket,
    buildPassingEvidence(criteriaPacket.requiredTestTargets),
  );
  const reviewPacket = buildAxiomFalconCandidateSurfaceReviewPacket(receipt);
  const scaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
    candidatePageDataBundle,
    reviewPacket,
  );

  return { candidatePageDataBundle, receipt, reviewPacket, scaffold };
}

function cloneBundle(
  bundle: AxiomInternalCandidateSurfaceRenderAdapterBundle,
): AxiomInternalCandidateSurfaceRenderAdapterBundle {
  return JSON.parse(JSON.stringify(bundle)) as AxiomInternalCandidateSurfaceRenderAdapterBundle;
}

describe('Axiom internal candidate-surface render adapter bundle', () => {
  it('builds internal render adapters for all fixed surfaces from the implementation scaffold', () => {
    const { candidatePageDataBundle, receipt, reviewPacket, scaffold } = buildSources();
    const bundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle(scaffold);
    const validation = validateAxiomInternalCandidateSurfaceRenderAdapterBundle(
      bundle,
      scaffold,
      candidatePageDataBundle,
      reviewPacket,
      receipt,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(bundle).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_surface_render_adapter_bundle_not_promoted',
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_BOUNDARY,
      routeBase: AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE,
      sourceImplementationScaffoldId: scaffold.scaffoldId,
      adapterCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
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
    });
    expect(bundle.adapters.map((adapter) => adapter.surface)).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
  });

  it('keeps adapter paths internal and component output internal-preview-only', () => {
    const { scaffold } = buildSources();
    const bundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle(scaffold);

    expect(
      bundle.adapters.every(
        (adapter) =>
          adapter.internalRenderPath ===
            `${AXIOM_INTERNAL_CANDIDATE_SURFACE_RENDER_ADAPTER_ROUTE_BASE}#${adapter.surface}` &&
          adapter.internalRenderPath.startsWith('/internal/') &&
          adapter.adapterStatus === 'internal_render_adapter_not_promoted' &&
          adapter.shellStatus === 'internal_candidate_surface_shell_not_public_page' &&
          adapter.candidateSurfaceStatus === 'not_promoted_to_falcon_candidate_surface' &&
          adapter.publicUseStatus === 'not_public_approved' &&
          adapter.publicationStatus === 'not_published' &&
          adapter.publicNavigationStatus === 'not_added',
      ),
    ).toBe(true);
    expect(
      bundle.adapters.every((adapter) =>
        adapter.renderSlots.every(
          (slot) =>
            slot.allowedOutput === 'internal_preview_only' &&
            slot.reviewRequiredBeforeCandidatePromotion &&
            slot.reviewRequiredBeforePublication &&
            slot.publicUseStatus === 'not_public_approved' &&
            slot.publicationStatus === 'not_published',
        ),
      ),
    ).toBe(true);
  });

  it('maps section render modes to stable internal component kinds', () => {
    const { scaffold } = buildSources();
    const bundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle(scaffold);
    const componentKinds = new Set(
      bundle.adapters.flatMap((adapter) => adapter.renderSlots.map((slot) => slot.componentKind)),
    );

    expect(componentKinds).toContain('review_required_public_draft_candidate_block');
    expect(componentKinds).toContain('hidden_or_review_routed_placeholder_block');
    expect(
      bundle.adapters.every((adapter) =>
        adapter.renderSlots.every((slot) =>
          slot.renderMode === 'render_hidden_or_review_routed_placeholder'
            ? slot.componentKind === 'hidden_or_review_routed_placeholder_block'
            : true,
        ),
      ),
    ).toBe(true);
  });

  it('rejects missing adapters, public paths, and promotion movement', () => {
    const { candidatePageDataBundle, receipt, reviewPacket, scaffold } = buildSources();
    const bundle = cloneBundle(buildAxiomInternalCandidateSurfaceRenderAdapterBundle(scaffold));
    bundle.adapters = bundle.adapters.filter(
      (adapter) => adapter.surface !== 'scene_entry_use_cases',
    );
    bundle.adapterCount = bundle.adapters.length;
    bundle.adapters[0].internalRenderPath =
      '/preview/axiom-next-nbl#reader_facing_top_home' as unknown as AxiomInternalCandidateSurfaceRenderAdapterBundle['adapters'][number]['internalRenderPath'];
    bundle.movementBoundary.publicNavigation =
      'added' as unknown as AxiomInternalCandidateSurfaceRenderAdapterBundle['movementBoundary']['publicNavigation'];

    const validation = validateAxiomInternalCandidateSurfaceRenderAdapterBundle(
      bundle,
      scaffold,
      candidatePageDataBundle,
      reviewPacket,
      receipt,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'adapter_count_must_match_fixed_next_nbl_surfaces',
        'render_adapter_missing:scene_entry_use_cases',
        'render_adapter_internal_path_must_match_internal_anchor:reader_facing_top_home',
        'render_adapter_path_must_remain_internal:reader_facing_top_home',
        'render_adapter_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
