import {
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE,
  buildAxiomInternalCandidateSurfacePageShellBundle,
  validateAxiomInternalCandidateSurfacePageShellBundle,
  type AxiomInternalCandidateSurfacePageShellBundle,
} from '@/lib/axiom/siteInternalCandidateSurfacePageShell';
import { buildAxiomInternalCandidateSurfaceRenderAdapterBundle } from '@/lib/axiom/siteInternalCandidateSurfaceRenderAdapter';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneBundle(
  bundle: AxiomInternalCandidateSurfacePageShellBundle,
): AxiomInternalCandidateSurfacePageShellBundle {
  return JSON.parse(JSON.stringify(bundle)) as AxiomInternalCandidateSurfacePageShellBundle;
}

describe('Axiom internal candidate-surface page shell bundle', () => {
  it('builds internal page shells for all fixed surfaces from the render adapter', () => {
    const renderAdapterBundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle();
    const bundle = buildAxiomInternalCandidateSurfacePageShellBundle(renderAdapterBundle);
    const validation = validateAxiomInternalCandidateSurfacePageShellBundle(
      bundle,
      renderAdapterBundle,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(bundle).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_surface_page_shell_bundle_not_promoted',
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_BOUNDARY,
      routeBase: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE,
      sourceRenderAdapterBundleId: renderAdapterBundle.bundleId,
      shellCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
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
    expect(bundle.shells.map((shell) => shell.surface)).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
  });

  it('keeps shell paths internal and all regions internal-preview-only', () => {
    const renderAdapterBundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle();
    const bundle = buildAxiomInternalCandidateSurfacePageShellBundle(renderAdapterBundle);

    expect(
      bundle.shells.every(
        (shell) =>
          shell.internalShellPath ===
            `${AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_ROUTE_BASE}#${shell.surface}` &&
          shell.internalShellPath.startsWith('/internal/') &&
          shell.shellStatus === 'internal_candidate_surface_page_shell_not_promoted' &&
          shell.shellKind === 'internal_preview_page_shell' &&
          shell.candidateSurfaceStatus === 'not_promoted_to_falcon_candidate_surface' &&
          shell.publicUseStatus === 'not_public_approved' &&
          shell.publicationStatus === 'not_published' &&
          shell.publicNavigationStatus === 'not_added' &&
          shell.reviewExecutionStatus === 'not_executed',
      ),
    ).toBe(true);
    expect(
      bundle.shells.every((shell) =>
        shell.regions.every(
          (region) =>
            region.placement === 'surface_body' &&
            region.allowedContentSource === 'axiom_kernel_object_fields_only' &&
            region.allowedOutput === 'internal_preview_only' &&
            region.reviewRequiredBeforeCandidatePromotion &&
            region.reviewRequiredBeforePublication &&
            region.publicUseStatus === 'not_public_approved' &&
            region.publicationStatus === 'not_published',
        ),
      ),
    ).toBe(true);
  });

  it('maps render component kinds into stable page region kinds', () => {
    const renderAdapterBundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle();
    const bundle = buildAxiomInternalCandidateSurfacePageShellBundle(renderAdapterBundle);
    const regionKinds = new Set(
      bundle.shells.flatMap((shell) => shell.regions.map((region) => region.regionKind)),
    );

    expect(regionKinds).toContain('public_draft_candidate_region_review_required');
    expect(regionKinds).toContain('hidden_or_review_routed_region_placeholder');
    expect(
      bundle.shells.every((shell) =>
        shell.regions.every((region) =>
          region.sourceComponentKind === 'review_required_public_draft_candidate_block'
            ? region.regionKind === 'public_draft_candidate_region_review_required'
            : true,
        ),
      ),
    ).toBe(true);
  });

  it('rejects missing shells, public paths, and promotion movement', () => {
    const renderAdapterBundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle();
    const bundle = cloneBundle(
      buildAxiomInternalCandidateSurfacePageShellBundle(renderAdapterBundle),
    );
    bundle.shells = bundle.shells.filter((shell) => shell.surface !== 'scene_entry_use_cases');
    bundle.shellCount = bundle.shells.length;
    bundle.shells[0].internalShellPath =
      '/preview/axiom-next-nbl#reader_facing_top_home' as unknown as AxiomInternalCandidateSurfacePageShellBundle['shells'][number]['internalShellPath'];
    bundle.movementBoundary.publicNavigation =
      'added' as unknown as AxiomInternalCandidateSurfacePageShellBundle['movementBoundary']['publicNavigation'];

    const validation = validateAxiomInternalCandidateSurfacePageShellBundle(
      bundle,
      renderAdapterBundle,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'shell_count_must_match_fixed_next_nbl_surfaces',
        'page_shell_missing:scene_entry_use_cases',
        'page_shell_internal_path_must_match_internal_anchor:reader_facing_top_home',
        'page_shell_path_must_remain_internal:reader_facing_top_home',
        'page_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
