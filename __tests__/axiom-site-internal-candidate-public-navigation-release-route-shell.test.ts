import {
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_ROUTE,
  AXIOM_PUBLIC_NAVIGATION_RELEASE_ROUTE_REQUIREMENTS,
  buildAxiomInternalCandidatePublicNavigationReleaseRouteShell,
  validateAxiomInternalCandidatePublicNavigationReleaseRouteShell,
  type AxiomInternalCandidatePublicNavigationReleaseRouteShell,
} from '@/lib/axiom/siteInternalCandidatePublicNavigationReleaseRouteShell';
import { buildAxiomInternalCandidatePublicReleaseDecisionPacketShell } from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';
import { buildAxiomInternalCandidateSurfacePromotionHandoffManifest } from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneShell(
  shell: AxiomInternalCandidatePublicNavigationReleaseRouteShell,
): AxiomInternalCandidatePublicNavigationReleaseRouteShell {
  return JSON.parse(
    JSON.stringify(shell),
  ) as AxiomInternalCandidatePublicNavigationReleaseRouteShell;
}

function buildSources() {
  const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
  const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
  const requestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);
  const handoffManifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);
  const releaseDecisionShell =
    buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(handoffManifest);

  return { holdPacket, ledger, requestPacket, handoffManifest, releaseDecisionShell };
}

describe('Axiom internal candidate public-navigation release route shell', () => {
  it('builds a public-navigation route shell as review input only without route activation or release', () => {
    const { holdPacket, ledger, requestPacket, handoffManifest, releaseDecisionShell } =
      buildSources();
    const shell =
      buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(releaseDecisionShell);
    const validation = validateAxiomInternalCandidatePublicNavigationReleaseRouteShell(
      shell,
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
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(shell).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_PUBLIC_NAVIGATION_RELEASE_ROUTE_SHELL_ROUTE,
      sourceReleaseDecisionShellId: releaseDecisionShell.shellId,
      sourceReleaseDecisionShellStatus:
        'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
      sourceReleaseDecisionShellRequiredStatus:
        'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
      shellMode: 'public_navigation_release_route_review_input_only',
      releaseDecisionStatus: 'not_decided',
      publicApprovalStatus: 'not_approved',
      publicationStatus: 'not_published',
      actualPublicNavigationStatus: 'not_added',
      routeActivationStatus: 'not_activated',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      sourceSupportValidityStatus: 'not_decided',
      maxCoreReviewUnits: 100,
      navigationUnitCount: 11,
      nextAllowedMovement: 'founder_or_reviewer_can_authorize_public_navigation_outside_codex_only',
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

  it('keeps navigation units under the 100-unit cap and covers all fixed surfaces', () => {
    const { releaseDecisionShell } = buildSources();
    const shell =
      buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(releaseDecisionShell);

    expect(shell.navigationUnitCount).toBe(11);
    expect(shell.navigationUnitCount).toBeLessThanOrEqual(shell.maxCoreReviewUnits);
    expect(
      shell.navigationUnits
        .filter(
          (unit) => unit.unitType === 'surface_public_navigation_release_route_shell_review_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      shell.navigationUnits.every((unit) =>
        AXIOM_PUBLIC_NAVIGATION_RELEASE_ROUTE_REQUIREMENTS.every((requirement) =>
          unit.requiredNavigationRouteRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every navigation unit unactivated, unapproved, unpublished, and blocking release while allowing internal preview', () => {
    const { releaseDecisionShell } = buildSources();
    const shell =
      buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(releaseDecisionShell);

    expect(
      shell.navigationUnits.every(
        (unit) =>
          unit.routeActivationStatus === 'not_activated' &&
          unit.actualPublicNavigationStatus === 'not_added' &&
          unit.releaseDecisionStatus === 'not_decided' &&
          unit.publicApprovalStatus === 'not_approved' &&
          unit.publicationStatus === 'not_published' &&
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

  it('rejects missing surface unit, route activation, publication, and validity movement', () => {
    const { holdPacket, ledger, requestPacket, handoffManifest, releaseDecisionShell } =
      buildSources();
    const shell = cloneShell(
      buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(releaseDecisionShell),
    );
    shell.navigationUnits = shell.navigationUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    shell.navigationUnitCount = shell.navigationUnits.length;
    shell.routeActivationStatus =
      'activated' as unknown as AxiomInternalCandidatePublicNavigationReleaseRouteShell['routeActivationStatus'];
    shell.publicationStatus =
      'published' as unknown as AxiomInternalCandidatePublicNavigationReleaseRouteShell['publicationStatus'];
    shell.movementBoundary.publicNavigation =
      'added' as unknown as AxiomInternalCandidatePublicNavigationReleaseRouteShell['movementBoundary']['publicNavigation'];

    const validation = validateAxiomInternalCandidatePublicNavigationReleaseRouteShell(
      shell,
      releaseDecisionShell,
      handoffManifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'navigation_unit_count_must_match_release_decision_units',
        'surface_navigation_unit_missing:scene_entry_use_cases',
        'shell_must_remain_unactivated_unapproved_unpublished_unexecuted_unassigned_and_undecided',
        'navigation_route_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
