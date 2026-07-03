import {
  AXIOM_CANDIDATE_SURFACE_PROMOTION_REVIEW_DECISIONS,
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_ROUTE,
  buildAxiomInternalCandidateSurfacePromotionRequestPacket,
  validateAxiomInternalCandidateSurfacePromotionRequestPacket,
  type AxiomInternalCandidateSurfacePromotionRequestPacket,
} from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePacket(
  packet: AxiomInternalCandidateSurfacePromotionRequestPacket,
): AxiomInternalCandidateSurfacePromotionRequestPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomInternalCandidateSurfacePromotionRequestPacket;
}

describe('Axiom internal candidate-surface promotion request packet', () => {
  it('builds a review-input-only request packet from the readiness ledger without promotion movement', () => {
    const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
    const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
    const packet = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);
    const validation = validateAxiomInternalCandidateSurfacePromotionRequestPacket(
      packet,
      ledger,
      holdPacket,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_REQUEST_PACKET_ROUTE,
      sourceReleaseReadinessLedgerId: ledger.ledgerId,
      sourceReleaseReadinessLedgerStatus:
        'internal_candidate_release_readiness_ledger_prepared_not_released',
      sourceReleaseReadinessLedgerRequiredStatus:
        'internal_candidate_release_readiness_ledger_prepared_not_released',
      sourceReleaseReadinessStatus: 'not_ready_public_release_hold',
      requestMode: 'human_review_input_only',
      requestSubmissionStatus: 'not_submitted_by_codex',
      candidatePromotionStatus: 'not_promoted',
      maxCoreReviewUnits: 100,
      requestUnitCount: 11,
      sourceLedgerEntryCount: 66,
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
  });

  it('condenses the 66 readiness entries into 11 core review units under the review cap', () => {
    const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
    const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
    const packet = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);

    expect(packet.sourceLedgerEntryCount).toBe(66);
    expect(packet.requestUnitCount).toBe(11);
    expect(packet.requestUnitCount).toBeLessThanOrEqual(packet.maxCoreReviewUnits);
    expect(
      packet.requestUnits
        .filter(
          (unit) => unit.unitType === 'surface_candidate_surface_promotion_request_review_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      packet.requestUnits.every((unit) =>
        AXIOM_CANDIDATE_SURFACE_PROMOTION_REVIEW_DECISIONS.every((decision) =>
          unit.requiredReviewDecisions.includes(decision),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every request unit blocked while allowing internal preview inspection', () => {
    const packet = buildAxiomInternalCandidateSurfacePromotionRequestPacket(
      buildAxiomInternalCandidateReleaseReadinessLedger(
        buildAxiomInternalCandidatePublicPageHoldPacket(),
      ),
    );

    expect(
      packet.requestUnits.every(
        (unit) =>
          unit.requestStatus === 'review_input_prepared_not_submitted_not_promoted' &&
          unit.promotionDisposition ===
            'blocked_until_human_review_and_founder_public_release_gate' &&
          unit.humanReviewRoute === 'required_before_candidate_promotion' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
  });

  it('rejects missing surface request unit, executed review, submission, and promotion movement', () => {
    const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
    const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
    const packet = clonePacket(buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger));
    packet.requestUnits = packet.requestUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    packet.requestUnitCount = packet.requestUnits.length;
    packet.reviewExecutionStatus =
      'executed' as unknown as AxiomInternalCandidateSurfacePromotionRequestPacket['reviewExecutionStatus'];
    packet.requestSubmissionStatus =
      'submitted' as unknown as AxiomInternalCandidateSurfacePromotionRequestPacket['requestSubmissionStatus'];
    packet.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidateSurfacePromotionRequestPacket['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidateSurfacePromotionRequestPacket(
      packet,
      ledger,
      holdPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'request_unit_count_must_match_ledger_units',
        'surface_request_unit_missing:scene_entry_use_cases',
        'review_must_not_be_executed_or_assigned_by_codex',
        'request_must_not_be_submitted_or_promoted_by_codex',
        'promotion_request_packet_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
