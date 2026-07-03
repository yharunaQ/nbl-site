import {
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_ROUTE,
  buildAxiomInternalCandidatePublicPageHoldPacket,
  validateAxiomInternalCandidatePublicPageHoldPacket,
  type AxiomInternalCandidatePublicPageHoldPacket,
} from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { buildAxiomInternalCandidatePublicPagePreviewAssembly } from '@/lib/axiom/siteInternalCandidatePublicPagePreviewAssembly';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePacket(
  packet: AxiomInternalCandidatePublicPageHoldPacket,
): AxiomInternalCandidatePublicPageHoldPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomInternalCandidatePublicPageHoldPacket;
}

describe('Axiom internal candidate-public-page hold packet', () => {
  it('builds an internal hold packet from the candidate-public-page preview assembly', () => {
    const previewAssembly = buildAxiomInternalCandidatePublicPagePreviewAssembly();
    const packet = buildAxiomInternalCandidatePublicPageHoldPacket(previewAssembly);
    const validation = validateAxiomInternalCandidatePublicPageHoldPacket(packet, previewAssembly);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_public_page_hold_packet_prepared_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_PUBLIC_PAGE_HOLD_PACKET_ROUTE,
      sourcePreviewAssemblyId: previewAssembly.assemblyId,
      sourcePreviewAssemblyStatus: 'internal_candidate_public_page_preview_assembly_not_promoted',
      sourcePreviewAssemblyRequiredStatus:
        'internal_candidate_public_page_preview_assembly_not_promoted',
      maxCoreReviewUnits: 100,
      holdUnitCount: 11,
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
      packet.holdUnits
        .filter((unit) => unit.unitType === 'surface_candidate_public_page_hold')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
  });

  it('keeps required public-boundary, accessibility, regression, source, human-review, and release holds', () => {
    const packet = buildAxiomInternalCandidatePublicPageHoldPacket(
      buildAxiomInternalCandidatePublicPagePreviewAssembly(),
    );
    const categories = new Set(
      packet.holdUnits.flatMap((unit) => unit.holdChecks.map((check) => check.category)),
    );

    expect(categories).toEqual(
      new Set([
        'public_boundary',
        'accessibility_readiness',
        'regression_readiness',
        'source_currentness_hold',
        'human_review_gate',
        'public_navigation_release_hold',
      ]),
    );
    expect(
      packet.holdUnits.every(
        (unit) =>
          unit.holdCheckCount === 6 &&
          unit.reviewExecutionStatus === 'not_executed' &&
          unit.reviewerAssignmentStatus === 'not_assigned_by_codex' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
    expect(
      packet.holdUnits.every((unit) =>
        unit.holdChecks.every(
          (check) =>
            check.holdStatus === 'required_hold_not_released' &&
            check.blocksCandidatePromotion &&
            check.blocksPublicNavigation &&
            check.blocksPublicRelease &&
            check.doesNotBlockInternalPreview,
        ),
      ),
    ).toBe(true);
  });

  it('keeps hold units under the core review unit budget', () => {
    const packet = buildAxiomInternalCandidatePublicPageHoldPacket(
      buildAxiomInternalCandidatePublicPagePreviewAssembly(),
    );

    expect(packet.holdUnitCount).toBe(11);
    expect(packet.holdUnitCount).toBeLessThanOrEqual(packet.maxCoreReviewUnits);
  });

  it('rejects missing surface hold, executed review, and promotion movement', () => {
    const previewAssembly = buildAxiomInternalCandidatePublicPagePreviewAssembly();
    const packet = clonePacket(buildAxiomInternalCandidatePublicPageHoldPacket(previewAssembly));
    packet.holdUnits = packet.holdUnits.filter((unit) => unit.surface !== 'scene_entry_use_cases');
    packet.holdUnitCount = packet.holdUnits.length;
    packet.reviewExecutionStatus =
      'executed' as unknown as AxiomInternalCandidatePublicPageHoldPacket['reviewExecutionStatus'];
    packet.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidatePublicPageHoldPacket['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidatePublicPageHoldPacket(packet, previewAssembly);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'review_must_not_be_executed_or_assigned_by_codex',
        'surface_hold_unit_missing:scene_entry_use_cases',
        'hold_packet_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
