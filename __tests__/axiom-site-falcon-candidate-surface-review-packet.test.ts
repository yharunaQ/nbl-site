import {
  AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY,
  buildAxiomFalconCandidateSurfaceReviewPacket,
  validateAxiomFalconCandidateSurfaceReviewPacket,
  type AxiomFalconCandidateSurfaceReviewPacket,
} from '@/lib/axiom/siteFalconCandidateSurfaceReviewPacket';
import {
  AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS,
  buildAxiomGate8PreflightRunnerReceipt,
  buildNotRunAxiomGate8PreflightRunnerEvidenceInput,
  type AxiomGate8PreflightRunnerEvidenceInput,
} from '@/lib/axiom/siteGate8PreflightRunnerReceipt';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from '@/lib/axiom/siteGate8PreflightRunnerCriteria';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function buildPassingEvidence(targets: string[]): AxiomGate8PreflightRunnerEvidenceInput {
  return {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_passed_for_candidate_review',
      status: 'passed',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets,
      summary: 'Required Axiom and Falcon Jest targets passed.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_passed_for_candidate_review',
      status: 'passed',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck passed.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_passed_for_candidate_review',
      status: 'passed',
      checkedInternalPaths: [...AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS],
      httpStatusByPath: Object.fromEntries(
        AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.map((path) => [path, 200]),
      ),
      summary: 'Internal Axiom routes returned HTTP 200.',
    },
  };
}

function clonePacket(
  packet: AxiomFalconCandidateSurfaceReviewPacket,
): AxiomFalconCandidateSurfaceReviewPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomFalconCandidateSurfaceReviewPacket;
}

describe('Axiom Falcon candidate-surface review packet', () => {
  it('builds a compressed review packet from a passed Gate 8 receipt without promotion', () => {
    const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      criteriaPacket,
      buildPassingEvidence(criteriaPacket.requiredTestTargets),
    );
    const packet = buildAxiomFalconCandidateSurfaceReviewPacket(receipt);
    const validation = validateAxiomFalconCandidateSurfaceReviewPacket(packet, receipt);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY,
      coreProgressClass: 'kernel_human_review_loop',
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_human_review_loop',
      status: 'candidate_surface_review_packet_prepared_not_promoted',
      boundary: AXIOM_FALCON_CANDIDATE_SURFACE_REVIEW_PACKET_BOUNDARY,
      sourceReceiptId: receipt.receiptId,
      sourceReceiptStatus: 'passed_internal_preflight_not_promoted',
      sourceReceiptRequiredStatus: 'passed_internal_preflight_not_promoted',
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
        .filter((unit) => unit.unitType === 'surface_candidate_review')
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      packet.reviewUnits.some((unit) => unit.unitType === 'cross_surface_boundary_review'),
    ).toBe(true);
    expect(packet.reviewUnits.some((unit) => unit.unitType === 'gate8_receipt_review')).toBe(true);
  });

  it('keeps every review unit blocking promotion and public release while allowing internal inspection', () => {
    const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      criteriaPacket,
      buildPassingEvidence(criteriaPacket.requiredTestTargets),
    );
    const packet = buildAxiomFalconCandidateSurfaceReviewPacket(receipt);

    expect(
      packet.reviewUnits.every(
        (unit) =>
          unit.blocksCandidatePromotion &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalInspection &&
          unit.requiredDecisions.includes('human_review_required_before_candidate_promotion') &&
          unit.requiredDecisions.includes('public_release_requires_separate_founder_approval'),
      ),
    ).toBe(true);
  });

  it('rejects a review packet built from a not-run receipt', () => {
    const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      criteriaPacket,
      buildNotRunAxiomGate8PreflightRunnerEvidenceInput(),
    );
    const packet = buildAxiomFalconCandidateSurfaceReviewPacket(receipt);

    const validation = validateAxiomFalconCandidateSurfaceReviewPacket(packet, receipt);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining(['source_receipt_must_be_passed_internal_preflight_not_promoted']),
    );
  });

  it('rejects missing surface review, review execution, and promotion movement', () => {
    const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      criteriaPacket,
      buildPassingEvidence(criteriaPacket.requiredTestTargets),
    );
    const packet = clonePacket(buildAxiomFalconCandidateSurfaceReviewPacket(receipt));
    packet.reviewUnits = packet.reviewUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    packet.reviewUnitCount = packet.reviewUnits.length;
    packet.reviewExecutionStatus =
      'executed' as unknown as AxiomFalconCandidateSurfaceReviewPacket['reviewExecutionStatus'];
    packet.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomFalconCandidateSurfaceReviewPacket['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomFalconCandidateSurfaceReviewPacket(packet, receipt);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'review_must_not_be_executed_or_assigned_by_codex',
        'surface_review_unit_missing:scene_entry_use_cases',
        'review_packet_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
