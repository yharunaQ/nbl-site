import {
  AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_ROUTE,
  buildAxiomInternalCandidateReleaseReadinessLedger,
  validateAxiomInternalCandidateReleaseReadinessLedger,
  type AxiomInternalCandidateReleaseReadinessLedger,
} from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneLedger(
  ledger: AxiomInternalCandidateReleaseReadinessLedger,
): AxiomInternalCandidateReleaseReadinessLedger {
  return JSON.parse(JSON.stringify(ledger)) as AxiomInternalCandidateReleaseReadinessLedger;
}

describe('Axiom internal candidate-release readiness ledger', () => {
  it('builds an internal readiness ledger from the hold packet without release movement', () => {
    const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
    const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
    const validation = validateAxiomInternalCandidateReleaseReadinessLedger(ledger, holdPacket);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(ledger).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_release_readiness_ledger_prepared_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_RELEASE_READINESS_LEDGER_ROUTE,
      sourceHoldPacketId: holdPacket.packetId,
      sourceHoldPacketStatus: 'internal_candidate_public_page_hold_packet_prepared_not_released',
      sourceHoldPacketRequiredStatus:
        'internal_candidate_public_page_hold_packet_prepared_not_released',
      releaseReadinessStatus: 'not_ready_public_release_hold',
      ledgerUnitCount: 11,
      ledgerEntryCount: 66,
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
      ledger.ledgerUnits
        .filter((unit) => unit.unitType === 'surface_candidate_release_readiness')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
  });

  it('separates internal regression pass from held public release gates', () => {
    const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(
      buildAxiomInternalCandidatePublicPageHoldPacket(),
    );
    const statuses = new Set(
      ledger.ledgerUnits.flatMap((unit) => unit.entries.map((entry) => entry.readinessStatus)),
    );

    expect(statuses).toEqual(
      new Set([
        'internally_passed_not_released',
        'review_required_not_released',
        'held_until_founder_public_release_gate',
        'held_until_source_support_validity_review',
      ]),
    );
    expect(
      ledger.ledgerUnits.every(
        (unit) =>
          unit.releaseReadinessStatus === 'not_ready_public_release_hold' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
  });

  it('keeps all ledger entries as blockers while allowing internal preview', () => {
    const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(
      buildAxiomInternalCandidatePublicPageHoldPacket(),
    );

    expect(
      ledger.ledgerUnits.every((unit) =>
        unit.entries.every(
          (entry) =>
            entry.releaseBlocker &&
            entry.candidatePromotionBlocker &&
            entry.publicNavigationBlocker &&
            entry.doesNotBlockInternalPreview,
        ),
      ),
    ).toBe(true);
  });

  it('rejects missing surface ledger, executed review, and promotion movement', () => {
    const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
    const ledger = cloneLedger(buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket));
    ledger.ledgerUnits = ledger.ledgerUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    ledger.ledgerUnitCount = ledger.ledgerUnits.length;
    ledger.reviewExecutionStatus =
      'executed' as unknown as AxiomInternalCandidateReleaseReadinessLedger['reviewExecutionStatus'];
    ledger.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidateReleaseReadinessLedger['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidateReleaseReadinessLedger(ledger, holdPacket);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'review_must_not_be_executed_or_assigned_by_codex',
        'surface_ledger_unit_missing:scene_entry_use_cases',
        'release_readiness_ledger_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
