import {
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_ROUTE,
  buildAxiomInternalCandidateSurfacePromotionHandoffManifest,
  validateAxiomInternalCandidateSurfacePromotionHandoffManifest,
  type AxiomInternalCandidateSurfacePromotionHandoffManifest,
} from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneManifest(
  manifest: AxiomInternalCandidateSurfacePromotionHandoffManifest,
): AxiomInternalCandidateSurfacePromotionHandoffManifest {
  return JSON.parse(
    JSON.stringify(manifest),
  ) as AxiomInternalCandidateSurfacePromotionHandoffManifest;
}

function buildSources() {
  const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();
  const ledger = buildAxiomInternalCandidateReleaseReadinessLedger(holdPacket);
  const requestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket(ledger);

  return { holdPacket, ledger, requestPacket };
}

describe('Axiom internal candidate-surface promotion handoff manifest', () => {
  it('builds a Founder/reviewer handoff manifest without executing review or promotion', () => {
    const { holdPacket, ledger, requestPacket } = buildSources();
    const manifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);
    const validation = validateAxiomInternalCandidateSurfacePromotionHandoffManifest(
      manifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(manifest).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_SURFACE_PROMOTION_HANDOFF_MANIFEST_ROUTE,
      sourcePromotionRequestPacketId: requestPacket.packetId,
      sourcePromotionRequestPacketStatus:
        'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
      sourcePromotionRequestRequiredStatus:
        'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
      sourceRequestSubmissionStatus: 'not_submitted_by_codex',
      sourceCandidatePromotionStatus: 'not_promoted',
      manifestMode: 'founder_reviewer_handoff_input_only',
      handoffStatus: 'prepared_not_sent_by_codex',
      founderDecisionStatus: 'not_decided',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      maxCoreReviewUnits: 100,
      manifestUnitCount: 11,
      sourceLedgerEntryCount: 66,
      nextAllowedMovement: 'founder_or_reviewer_can_review_outside_codex_only',
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
    const { requestPacket } = buildSources();
    const manifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);

    expect(manifest.manifestUnitCount).toBe(11);
    expect(manifest.manifestUnitCount).toBeLessThanOrEqual(manifest.maxCoreReviewUnits);
    expect(
      manifest.manifestUnits
        .filter(
          (unit) => unit.unitType === 'surface_candidate_surface_promotion_handoff_review_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      manifest.manifestUnits.every(
        (unit) =>
          unit.handoffDecisionOptions.includes('continue_internal_only') &&
          unit.handoffDecisionOptions.includes('return_to_kernel_revision') &&
          unit.handoffDecisionOptions.includes('send_to_human_review_outside_codex') &&
          unit.handoffDecisionOptions.includes(
            'prepare_separate_public_release_packet_after_review',
          ),
      ),
    ).toBe(true);
  });

  it('keeps every manifest unit unsent, undecided, and blocking promotion while allowing internal preview', () => {
    const { requestPacket } = buildSources();
    const manifest = buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket);

    expect(
      manifest.manifestUnits.every(
        (unit) =>
          unit.founderDecisionStatus === 'not_decided' &&
          unit.reviewExecutionStatus === 'not_executed' &&
          unit.reviewerAssignmentStatus === 'not_assigned_by_codex' &&
          unit.handoffStatus === 'prepared_not_sent_by_codex' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
  });

  it('rejects missing surface unit, sent handoff, decided founder status, and promotion movement', () => {
    const { holdPacket, ledger, requestPacket } = buildSources();
    const manifest = cloneManifest(
      buildAxiomInternalCandidateSurfacePromotionHandoffManifest(requestPacket),
    );
    manifest.manifestUnits = manifest.manifestUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    manifest.manifestUnitCount = manifest.manifestUnits.length;
    manifest.handoffStatus =
      'sent' as unknown as AxiomInternalCandidateSurfacePromotionHandoffManifest['handoffStatus'];
    manifest.founderDecisionStatus =
      'approved' as unknown as AxiomInternalCandidateSurfacePromotionHandoffManifest['founderDecisionStatus'];
    manifest.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidateSurfacePromotionHandoffManifest['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidateSurfacePromotionHandoffManifest(
      manifest,
      requestPacket,
      ledger,
      holdPacket,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'manifest_unit_count_must_match_source_request_units',
        'surface_handoff_unit_missing:scene_entry_use_cases',
        'manifest_must_remain_unexecuted_unsent_and_undecided',
        'handoff_manifest_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
