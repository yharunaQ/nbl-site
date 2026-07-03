import {
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY,
  buildAxiomInternalCandidateSurfacePageShellReviewPacket,
  validateAxiomInternalCandidateSurfacePageShellReviewPacket,
  type AxiomInternalCandidateSurfacePageShellReviewPacket,
} from '@/lib/axiom/siteInternalCandidateSurfacePageShellReviewPacket';
import { buildAxiomInternalCandidateSurfacePageShellBundle } from '@/lib/axiom/siteInternalCandidateSurfacePageShell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePacket(
  packet: AxiomInternalCandidateSurfacePageShellReviewPacket,
): AxiomInternalCandidateSurfacePageShellReviewPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomInternalCandidateSurfacePageShellReviewPacket;
}

describe('Axiom internal candidate-surface page-shell review packet', () => {
  it('builds a compressed not-executed review packet from the page shell bundle', () => {
    const pageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle();
    const packet = buildAxiomInternalCandidateSurfacePageShellReviewPacket(pageShellBundle);
    const validation = validateAxiomInternalCandidateSurfacePageShellReviewPacket(
      packet,
      pageShellBundle,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY,
      coreProgressClass: 'kernel_human_review_loop',
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_human_review_loop',
      status: 'internal_candidate_surface_page_shell_review_packet_prepared_not_executed',
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PAGE_SHELL_REVIEW_PACKET_BOUNDARY,
      sourcePageShellBundleId: pageShellBundle.bundleId,
      sourcePageShellBundleStatus: 'internal_candidate_surface_page_shell_bundle_not_promoted',
      sourcePageShellRequiredStatus: 'internal_candidate_surface_page_shell_bundle_not_promoted',
      maxCoreReviewUnits: 100,
      reviewUnitCount: 11,
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
    });
    expect(
      packet.reviewUnits
        .filter((unit) => unit.unitType === 'surface_page_shell_review')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      packet.reviewUnits.some((unit) => unit.unitType === 'cross_page_shell_boundary_review'),
    ).toBe(true);
    expect(
      packet.reviewUnits.some(
        (unit) => unit.unitType === 'gate8_page_shell_receipt_boundary_review',
      ),
    ).toBe(true);
  });

  it('keeps region kind, hidden/review-routed, and public draft candidate placement in scope', () => {
    const packet = buildAxiomInternalCandidateSurfacePageShellReviewPacket(
      buildAxiomInternalCandidateSurfacePageShellBundle(),
    );
    const allRegionKinds = new Set(packet.reviewUnits.flatMap((unit) => unit.regionKindsInScope));

    expect(allRegionKinds).toContain('public_draft_candidate_region_review_required');
    expect(allRegionKinds).toContain('hidden_or_review_routed_region_placeholder');
    expect(
      packet.reviewUnits.every(
        (unit) =>
          unit.requiredDecisions.includes('review_region_kind_mapping') &&
          unit.requiredDecisions.includes('review_hidden_or_review_routed_region_handling') &&
          unit.requiredDecisions.includes('review_public_draft_candidate_region_placement') &&
          unit.requiredDecisions.includes(
            'confirm_no_public_navigation_candidate_promotion_or_release',
          ) &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalInspection,
      ),
    ).toBe(true);
  });

  it('keeps review unit count under the core review unit budget', () => {
    const packet = buildAxiomInternalCandidateSurfacePageShellReviewPacket(
      buildAxiomInternalCandidateSurfacePageShellBundle(),
    );

    expect(packet.reviewUnitCount).toBe(11);
    expect(packet.reviewUnitCount).toBeLessThanOrEqual(packet.maxCoreReviewUnits);
  });

  it('rejects missing surface review, executed review, and promotion movement', () => {
    const pageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle();
    const packet = clonePacket(
      buildAxiomInternalCandidateSurfacePageShellReviewPacket(pageShellBundle),
    );
    packet.reviewUnits = packet.reviewUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    packet.reviewUnitCount = packet.reviewUnits.length;
    packet.reviewExecutionStatus =
      'executed' as unknown as AxiomInternalCandidateSurfacePageShellReviewPacket['reviewExecutionStatus'];
    packet.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidateSurfacePageShellReviewPacket['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidateSurfacePageShellReviewPacket(
      packet,
      pageShellBundle,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'review_must_not_be_executed_or_assigned_by_codex',
        'surface_review_unit_missing:scene_entry_use_cases',
        'page_shell_review_packet_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
