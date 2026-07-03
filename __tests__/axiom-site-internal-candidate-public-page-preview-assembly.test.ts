import {
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE,
  buildAxiomInternalCandidatePublicPagePreviewAssembly,
  validateAxiomInternalCandidatePublicPagePreviewAssembly,
  type AxiomInternalCandidatePublicPagePreviewAssembly,
} from '@/lib/axiom/siteInternalCandidatePublicPagePreviewAssembly';
import { buildAxiomInternalCandidateSurfacePageShellBundle } from '@/lib/axiom/siteInternalCandidateSurfacePageShell';
import { buildAxiomInternalCandidateSurfacePageShellReviewPacket } from '@/lib/axiom/siteInternalCandidateSurfacePageShellReviewPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneAssembly(
  assembly: AxiomInternalCandidatePublicPagePreviewAssembly,
): AxiomInternalCandidatePublicPagePreviewAssembly {
  return JSON.parse(JSON.stringify(assembly)) as AxiomInternalCandidatePublicPagePreviewAssembly;
}

describe('Axiom internal candidate-public-page preview assembly', () => {
  it('builds internal preview assemblies for all fixed next-NBL surfaces', () => {
    const pageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle();
    const reviewPacket = buildAxiomInternalCandidateSurfacePageShellReviewPacket(pageShellBundle);
    const assembly = buildAxiomInternalCandidatePublicPagePreviewAssembly(
      pageShellBundle,
      reviewPacket,
    );
    const validation = validateAxiomInternalCandidatePublicPagePreviewAssembly(
      assembly,
      pageShellBundle,
      reviewPacket,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(assembly).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_public_page_preview_assembly_not_promoted',
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ASSEMBLY_BOUNDARY,
      routeBase: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE,
      sourcePageShellBundleId: pageShellBundle.bundleId,
      sourcePageShellReviewPacketId: reviewPacket.packetId,
      sourceReviewExecutionStatus: 'not_executed',
      previewCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
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
    expect(assembly.previews.map((preview) => preview.surface)).toEqual(
      AXIOM_NEXT_NBL_SITE_SURFACES,
    );
  });

  it('keeps preview paths internal and blocks review-required before promotion or publication', () => {
    const assembly = buildAxiomInternalCandidatePublicPagePreviewAssembly();

    expect(
      assembly.previews.every(
        (preview) =>
          preview.internalPreviewPath ===
            `${AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_PREVIEW_ROUTE_BASE}#${preview.surface}` &&
          preview.internalPreviewPath.startsWith('/internal/') &&
          preview.previewStatus === 'internal_candidate_public_page_preview_not_promoted' &&
          preview.routeStatus === 'internal_preview_route_only_not_public_navigation' &&
          preview.candidateSurfaceStatus === 'not_promoted_to_falcon_candidate_surface' &&
          preview.publicUseStatus === 'not_public_approved' &&
          preview.publicationStatus === 'not_published' &&
          preview.publicNavigationStatus === 'not_added' &&
          preview.reviewExecutionStatus === 'not_executed',
      ),
    ).toBe(true);
    expect(
      assembly.previews.every((preview) =>
        preview.blocks.every(
          (block) =>
            block.contentSource === 'axiom_kernel_object_fields_only' &&
            block.reviewRequiredBeforeCandidatePromotion &&
            block.reviewRequiredBeforePublication &&
            block.publicUseStatus === 'not_public_approved' &&
            block.publicationStatus === 'not_published' &&
            block.requiredReviewDecisions.length > 0,
        ),
      ),
    ).toBe(true);
  });

  it('maps page shell regions into stable internal preview block treatments', () => {
    const assembly = buildAxiomInternalCandidatePublicPagePreviewAssembly();
    const treatments = new Set(
      assembly.previews.flatMap((preview) => preview.blocks.map((block) => block.treatment)),
    );

    expect(treatments).toContain('candidate_public_copy_placeholder_review_required');
    expect(treatments).toContain('hidden_or_review_route_placeholder');
    expect(
      assembly.previews.every((preview) =>
        preview.blocks.every((block) =>
          block.treatment === 'candidate_public_copy_placeholder_review_required'
            ? block.requiredReviewDecisions.includes(
                'review_public_draft_candidate_region_placement',
              )
            : true,
        ),
      ),
    ).toBe(true);
  });

  it('rejects missing preview, public path, and promotion movement', () => {
    const pageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle();
    const reviewPacket = buildAxiomInternalCandidateSurfacePageShellReviewPacket(pageShellBundle);
    const assembly = cloneAssembly(
      buildAxiomInternalCandidatePublicPagePreviewAssembly(pageShellBundle, reviewPacket),
    );
    assembly.previews = assembly.previews.filter(
      (preview) => preview.surface !== 'scene_entry_use_cases',
    );
    assembly.previewCount = assembly.previews.length;
    assembly.previews[0].internalPreviewPath =
      '/preview/axiom-next-nbl#reader_facing_top_home' as unknown as AxiomInternalCandidatePublicPagePreviewAssembly['previews'][number]['internalPreviewPath'];
    assembly.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidatePublicPagePreviewAssembly['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidatePublicPagePreviewAssembly(
      assembly,
      pageShellBundle,
      reviewPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'preview_count_must_match_fixed_next_nbl_surfaces',
        'candidate_public_page_preview_missing:scene_entry_use_cases',
        'candidate_public_page_preview_internal_path_must_match_internal_anchor:reader_facing_top_home',
        'candidate_public_page_preview_path_must_remain_internal:reader_facing_top_home',
        'candidate_public_page_preview_assembly_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
