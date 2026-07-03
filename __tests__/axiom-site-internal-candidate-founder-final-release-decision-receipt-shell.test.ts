import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
  type AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionReceiptShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionHandoffManifest';
import { buildAxiomInternalCandidateFinalPublicReleaseReviewPacket } from '@/lib/axiom/siteInternalCandidateFinalPublicReleaseReviewPacket';
import { buildAxiomInternalCandidatePublicNavigationReleaseRouteShell } from '@/lib/axiom/siteInternalCandidatePublicNavigationReleaseRouteShell';
import { buildAxiomInternalCandidatePublicReleaseDecisionPacketShell } from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';
import { buildAxiomInternalCandidateSurfacePromotionHandoffManifest } from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell,
): AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell {
  return JSON.parse(
    JSON.stringify(shell),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell;
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
  const founderHandoffManifest =
    buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(finalReviewPacket);

  return {
    holdPacket,
    ledger,
    requestPacket,
    surfaceHandoffManifest,
    releaseDecisionShell,
    navigationRouteShell,
    finalReviewPacket,
    founderHandoffManifest,
  };
}

describe('Axiom internal candidate Founder final-release decision receipt shell', () => {
  it('builds a Founder final-release decision receipt shell without receiving or deciding release', () => {
    const {
      holdPacket,
      ledger,
      requestPacket,
      surfaceHandoffManifest,
      releaseDecisionShell,
      navigationRouteShell,
      finalReviewPacket,
      founderHandoffManifest,
    } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(founderHandoffManifest);
    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(
      shell,
      founderHandoffManifest,
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
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(shell).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_SHELL_ROUTE,
      sourceFounderHandoffManifestId: founderHandoffManifest.manifestId,
      sourceFounderHandoffManifestStatus:
        'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
      sourceFounderHandoffManifestRequiredStatus:
        'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
      shellMode: 'founder_final_release_decision_receipt_shell_not_received_input_only',
      decisionReceiptStatus: 'not_received',
      founderDecisionStatus: 'not_decided',
      handoffStatus: 'prepared_not_sent_by_codex',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      releaseDecisionStatus: 'not_decided',
      routeActivationStatus: 'not_activated',
      actualPublicNavigationStatus: 'not_added',
      publicApprovalStatus: 'not_approved',
      publicationStatus: 'not_published',
      sourceSupportValidityStatus: 'not_decided',
      maxCoreReviewUnits: 100,
      receiptUnitCount: 11,
      nextAllowedMovement:
        'founder_receipt_can_be_ingested_only_after_external_decision_outside_codex',
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

  it('keeps receipt units under the 100-unit cap and covers all fixed surfaces', () => {
    const { founderHandoffManifest } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(founderHandoffManifest);

    expect(shell.receiptUnitCount).toBe(11);
    expect(shell.receiptUnitCount).toBeLessThanOrEqual(shell.maxCoreReviewUnits);
    expect(
      shell.receiptUnits
        .filter(
          (unit) => unit.unitType === 'surface_founder_final_release_decision_receipt_shell_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      shell.receiptUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_RECEIPT_REQUIREMENTS.every((requirement) =>
          unit.requiredReceiptRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every receipt unit not received, undecided, unsent, unexecuted, unassigned, unactivated, unapproved, and unpublished', () => {
    const { founderHandoffManifest } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(founderHandoffManifest);

    expect(
      shell.receiptUnits.every(
        (unit) =>
          unit.decisionReceiptStatus === 'not_received' &&
          unit.founderDecisionStatus === 'not_decided' &&
          unit.handoffStatus === 'prepared_not_sent_by_codex' &&
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

  it('rejects missing surface unit, received decision, Founder decision, and public approval movement', () => {
    const {
      holdPacket,
      ledger,
      requestPacket,
      surfaceHandoffManifest,
      releaseDecisionShell,
      navigationRouteShell,
      finalReviewPacket,
      founderHandoffManifest,
    } = buildSources();
    const shell = cloneShell(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(founderHandoffManifest),
    );
    shell.receiptUnits = shell.receiptUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    shell.receiptUnitCount = shell.receiptUnits.length;
    shell.decisionReceiptStatus =
      'received' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell['decisionReceiptStatus'];
    shell.founderDecisionStatus =
      'decided' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell['founderDecisionStatus'];
    shell.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell['movementBoundary']['publicApproval'];

    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(
      shell,
      founderHandoffManifest,
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
        'receipt_unit_count_must_match_founder_handoff_units',
        'surface_receipt_unit_missing:scene_entry_use_cases',
        'shell_must_remain_not_received_undecided_unsent_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_receipt_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
