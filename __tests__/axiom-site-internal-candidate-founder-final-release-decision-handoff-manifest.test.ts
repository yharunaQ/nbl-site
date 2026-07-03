import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
  type AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionHandoffManifest';
import { buildAxiomInternalCandidateFinalPublicReleaseReviewPacket } from '@/lib/axiom/siteInternalCandidateFinalPublicReleaseReviewPacket';
import { buildAxiomInternalCandidatePublicNavigationReleaseRouteShell } from '@/lib/axiom/siteInternalCandidatePublicNavigationReleaseRouteShell';
import { buildAxiomInternalCandidatePublicReleaseDecisionPacketShell } from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';
import { buildAxiomInternalCandidateSurfacePromotionHandoffManifest } from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneManifest(
  manifest: AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest,
): AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest {
  return JSON.parse(
    JSON.stringify(manifest),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest;
}

function buildSources() {
  const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
  const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
  const requestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);
  const surfaceHandoffManifest =
    buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);
  const releaseDecisionShell =
    buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(surfaceHandoffManifest);
  const navigationRouteShell =
    buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(releaseDecisionShell);
  const finalReviewPacket =
    buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(navigationRouteShell);

  return {
    holdPacket,
    ledger,
    requestPacket,
    surfaceHandoffManifest,
    releaseDecisionShell,
    navigationRouteShell,
    finalReviewPacket,
  };
}

describe('Axiom internal candidate Founder final-release decision handoff manifest', () => {
  it('builds a Founder final-release decision handoff manifest without sending handoff or deciding release', () => {
    const {
      holdPacket,
      ledger,
      requestPacket,
      surfaceHandoffManifest,
      releaseDecisionShell,
      navigationRouteShell,
      finalReviewPacket,
    } = buildSources();
    const manifest =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(finalReviewPacket);
    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(
      manifest,
      finalReviewPacket,
      navigationRouteShell,
      releaseDecisionShell,
      surfaceHandoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(manifest).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_MANIFEST_ROUTE,
      sourceFinalReviewPacketId: finalReviewPacket.packetId,
      sourceFinalReviewPacketStatus:
        'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
      sourceFinalReviewPacketRequiredStatus:
        'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
      manifestMode: 'founder_final_release_decision_handoff_input_only',
      handoffStatus: 'prepared_not_sent_by_codex',
      founderDecisionStatus: 'not_decided',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      releaseDecisionStatus: 'not_decided',
      routeActivationStatus: 'not_activated',
      actualPublicNavigationStatus: 'not_added',
      publicApprovalStatus: 'not_approved',
      publicationStatus: 'not_published',
      sourceSupportValidityStatus: 'not_decided',
      maxCoreReviewUnits: 100,
      manifestUnitCount: 11,
      nextAllowedMovement: 'founder_can_decide_final_release_outside_codex_only',
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

  it('keeps handoff units under the 100-unit cap and covers all fixed surfaces', () => {
    const { finalReviewPacket } = buildSources();
    const manifest =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(finalReviewPacket);

    expect(manifest.manifestUnitCount).toBe(11);
    expect(manifest.manifestUnitCount).toBeLessThanOrEqual(manifest.maxCoreReviewUnits);
    expect(
      manifest.manifestUnits
        .filter((unit) => unit.unitType === 'surface_founder_final_release_decision_handoff_input')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      manifest.manifestUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_HANDOFF_REQUIREMENTS.every((requirement) =>
          unit.requiredHandoffRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every handoff unit unsent, undecided, unexecuted, unassigned, unactivated, unapproved, and unpublished', () => {
    const { finalReviewPacket } = buildSources();
    const manifest =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(finalReviewPacket);

    expect(
      manifest.manifestUnits.every(
        (unit) =>
          unit.handoffStatus === 'prepared_not_sent_by_codex' &&
          unit.founderDecisionStatus === 'not_decided' &&
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

  it('rejects missing surface unit, sent handoff, Founder decision, and approval movement', () => {
    const {
      holdPacket,
      ledger,
      requestPacket,
      surfaceHandoffManifest,
      releaseDecisionShell,
      navigationRouteShell,
      finalReviewPacket,
    } = buildSources();
    const manifest = cloneManifest(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(finalReviewPacket),
    );
    manifest.manifestUnits = manifest.manifestUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    manifest.manifestUnitCount = manifest.manifestUnits.length;
    manifest.handoffStatus =
      'sent' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest['handoffStatus'];
    manifest.founderDecisionStatus =
      'decided' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest['founderDecisionStatus'];
    manifest.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest['movementBoundary']['publicApproval'];

    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(
      manifest,
      finalReviewPacket,
      navigationRouteShell,
      releaseDecisionShell,
      surfaceHandoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'manifest_unit_count_must_match_final_review_units',
        'surface_handoff_unit_missing:scene_entry_use_cases',
        'manifest_must_remain_unsent_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_handoff_manifest_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
