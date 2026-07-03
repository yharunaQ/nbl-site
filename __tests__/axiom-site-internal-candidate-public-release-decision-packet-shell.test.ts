import {
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_ROUTE,
  AXIOM_PUBLIC_RELEASE_DECISION_REQUIREMENTS,
  buildAxiomInternalCandidatePublicReleaseDecisionPacketShell,
  validateAxiomInternalCandidatePublicReleaseDecisionPacketShell,
  type AxiomInternalCandidatePublicReleaseDecisionPacketShell,
} from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';
import { buildAxiomInternalCandidateSurfacePromotionHandoffManifest } from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneShell(
  shell: AxiomInternalCandidatePublicReleaseDecisionPacketShell,
): AxiomInternalCandidatePublicReleaseDecisionPacketShell {
  return JSON.parse(
    JSON.stringify(shell),
  ) as AxiomInternalCandidatePublicReleaseDecisionPacketShell;
}

function buildSources() {
  const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
  const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
  const requestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);
  const handoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);

  return { holdPacket, ledger, requestPacket, handoffManifest };
}

describe('Axiom internal candidate public-release decision packet shell', () => {
  it('builds a public-release decision shell as review input only without approval or release', () => {
    const { holdPacket, ledger, requestPacket, handoffManifest } = buildSources();
    const shell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(handoffManifest);
    const validation = validateAxiomInternalCandidatePublicReleaseDecisionPacketShell(
      shell,
      handoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(shell).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_PUBLIC_RELEASE_DECISION_PACKET_SHELL_ROUTE,
      sourceHandoffManifestId: handoffManifest.manifestId,
      sourceHandoffManifestStatus:
        'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
      sourceHandoffManifestRequiredStatus:
        'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
      shellMode: 'public_release_decision_review_input_only',
      releaseDecisionStatus: 'not_decided',
      publicApprovalStatus: 'not_approved',
      publicationStatus: 'not_published',
      publicNavigationStatus: 'not_added',
      handoffStatus: 'not_sent_by_codex',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      sourceSupportValidityStatus: 'not_decided',
      maxCoreReviewUnits: 100,
      decisionUnitCount: 11,
      nextAllowedMovement: 'founder_or_reviewer_can_decide_outside_codex_only',
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

  it('keeps decision units under the 100-unit cap and covers all fixed surfaces', () => {
    const { handoffManifest } = buildSources();
    const shell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(handoffManifest);

    expect(shell.decisionUnitCount).toBe(11);
    expect(shell.decisionUnitCount).toBeLessThanOrEqual(shell.maxCoreReviewUnits);
    expect(
      shell.decisionUnits
        .filter((unit) => unit.unitType === 'surface_public_release_decision_shell_review_input')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      shell.decisionUnits.every((unit) =>
        AXIOM_PUBLIC_RELEASE_DECISION_REQUIREMENTS.every((requirement) =>
          unit.requiredReleaseDecisionRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every decision unit undecided, unapproved, unpublished, and blocking release while allowing internal preview', () => {
    const { handoffManifest } = buildSources();
    const shell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(handoffManifest);

    expect(
      shell.decisionUnits.every(
        (unit) =>
          unit.releaseDecisionStatus === 'not_decided' &&
          unit.publicApprovalStatus === 'not_approved' &&
          unit.publicationStatus === 'not_published' &&
          unit.publicNavigationStatus === 'not_added' &&
          unit.reviewExecutionStatus === 'not_executed' &&
          unit.reviewerAssignmentStatus === 'not_assigned_by_codex' &&
          unit.sourceSupportValidityStatus === 'not_decided' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
  });

  it('rejects missing surface unit, approval, publication, and validity movement', () => {
    const { holdPacket, ledger, requestPacket, handoffManifest } = buildSources();
    const shell = cloneShell(
      buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(handoffManifest),
    );
    shell.decisionUnits = shell.decisionUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    shell.decisionUnitCount = shell.decisionUnits.length;
    shell.publicApprovalStatus =
      'approved' as unknown as AxiomInternalCandidatePublicReleaseDecisionPacketShell['publicApprovalStatus'];
    shell.publicationStatus =
      'published' as unknown as AxiomInternalCandidatePublicReleaseDecisionPacketShell['publicationStatus'];
    shell.movementBoundary.supportValidity =
      'decided' as unknown as AxiomInternalCandidatePublicReleaseDecisionPacketShell['movementBoundary']['supportValidity'];

    const validation = validateAxiomInternalCandidatePublicReleaseDecisionPacketShell(
      shell,
      handoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'decision_unit_count_must_match_handoff_units',
        'surface_decision_unit_missing:scene_entry_use_cases',
        'shell_must_remain_unapproved_unpublished_unexecuted_unassigned_and_undecided',
        'release_decision_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
