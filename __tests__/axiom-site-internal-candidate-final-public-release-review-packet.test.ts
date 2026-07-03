import {
  AXIOM_FINAL_PUBLIC_RELEASE_REVIEW_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_ROUTE,
  buildAxiomInternalCandidateFinalPublicReleaseReviewPacket,
  validateAxiomInternalCandidateFinalPublicReleaseReviewPacket,
  type AxiomInternalCandidateFinalPublicReleaseReviewPacket,
} from '@/lib/axiom/siteInternalCandidateFinalPublicReleaseReviewPacket';
import { buildAxiomInternalCandidatePublicNavigationReleaseRouteShell } from '@/lib/axiom/siteInternalCandidatePublicNavigationReleaseRouteShell';
import { buildAxiomInternalCandidatePublicReleaseDecisionPacketShell } from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';
import { buildAxiomInternalCandidateSurfacePromotionHandoffManifest } from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePacket(
  packet: AxiomInternalCandidateFinalPublicReleaseReviewPacket,
): AxiomInternalCandidateFinalPublicReleaseReviewPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomInternalCandidateFinalPublicReleaseReviewPacket;
}

function buildSources() {
  const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
  const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
  const requestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);
  const handoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);
  const releaseDecisionShell =
    buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(handoffManifest);
  const navigationRouteShell =
    buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(releaseDecisionShell);

  return {
    holdPacket,
    ledger,
    requestPacket,
    handoffManifest,
    releaseDecisionShell,
    navigationRouteShell,
  };
}

describe('Axiom internal candidate final public-release review packet', () => {
  it('builds a final public-release review packet as review input only without executing review or release', () => {
    const {
      holdPacket,
      ledger,
      requestPacket,
      handoffManifest,
      releaseDecisionShell,
      navigationRouteShell,
    } = buildSources();
    const packet = buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(navigationRouteShell);
    const validation = validateAxiomInternalCandidateFinalPublicReleaseReviewPacket(
      packet,
      navigationRouteShell,
      releaseDecisionShell,
      handoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_FINAL_PUBLIC_RELEASE_REVIEW_PACKET_ROUTE,
      sourceNavigationRouteShellId: navigationRouteShell.shellId,
      sourceNavigationRouteShellStatus:
        'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
      sourceNavigationRouteShellRequiredStatus:
        'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
      packetMode: 'final_public_release_review_input_only',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      releaseDecisionStatus: 'not_decided',
      routeActivationStatus: 'not_activated',
      actualPublicNavigationStatus: 'not_added',
      publicApprovalStatus: 'not_approved',
      publicationStatus: 'not_published',
      sourceSupportValidityStatus: 'not_decided',
      maxCoreReviewUnits: 100,
      reviewUnitCount: 11,
      nextAllowedMovement:
        'founder_or_reviewer_can_execute_final_public_release_review_outside_codex_only',
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

  it('keeps final review units under the 100-unit cap and covers all fixed surfaces', () => {
    const { navigationRouteShell } = buildSources();
    const packet = buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(navigationRouteShell);

    expect(packet.reviewUnitCount).toBe(11);
    expect(packet.reviewUnitCount).toBeLessThanOrEqual(packet.maxCoreReviewUnits);
    expect(
      packet.reviewUnits
        .filter((unit) => unit.unitType === 'surface_final_public_release_review_input')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      packet.reviewUnits.every((unit) =>
        AXIOM_FINAL_PUBLIC_RELEASE_REVIEW_REQUIREMENTS.every((requirement) =>
          unit.requiredFinalReviewRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every final review unit unexecuted, unassigned, unactivated, unapproved, and unpublished', () => {
    const { navigationRouteShell } = buildSources();
    const packet = buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(navigationRouteShell);

    expect(
      packet.reviewUnits.every(
        (unit) =>
          unit.reviewExecutionStatus === 'not_executed' &&
          unit.reviewerAssignmentStatus === 'not_assigned_by_codex' &&
          unit.releaseDecisionStatus === 'not_decided' &&
          unit.routeActivationStatus === 'not_activated' &&
          unit.actualPublicNavigationStatus === 'not_added' &&
          unit.publicApprovalStatus === 'not_approved' &&
          unit.publicationStatus === 'not_published' &&
          unit.sourceSupportValidityStatus === 'not_decided' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
  });

  it('rejects missing surface unit, review execution, route activation, and approval movement', () => {
    const {
      holdPacket,
      ledger,
      requestPacket,
      handoffManifest,
      releaseDecisionShell,
      navigationRouteShell,
    } = buildSources();
    const packet = clonePacket(
      buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(navigationRouteShell),
    );
    packet.reviewUnits = packet.reviewUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    packet.reviewUnitCount = packet.reviewUnits.length;
    packet.reviewExecutionStatus =
      'executed' as unknown as AxiomInternalCandidateFinalPublicReleaseReviewPacket['reviewExecutionStatus'];
    packet.publicApprovalStatus =
      'approved' as unknown as AxiomInternalCandidateFinalPublicReleaseReviewPacket['publicApprovalStatus'];
    packet.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFinalPublicReleaseReviewPacket['movementBoundary']['publicApproval'];

    const validation = validateAxiomInternalCandidateFinalPublicReleaseReviewPacket(
      packet,
      navigationRouteShell,
      releaseDecisionShell,
      handoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'review_unit_count_must_match_navigation_units',
        'surface_review_unit_missing:scene_entry_use_cases',
        'packet_must_remain_unexecuted_unassigned_unactivated_unapproved_unpublished_and_undecided',
        'final_public_release_review_packet_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
