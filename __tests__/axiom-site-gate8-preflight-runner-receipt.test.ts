import {
  AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS,
  AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY,
  buildAxiomGate8PreflightRunnerReceipt,
  buildNotRunAxiomGate8PreflightRunnerEvidenceInput,
  validateAxiomGate8PreflightRunnerReceipt,
  type AxiomGate8PreflightRunnerEvidenceInput,
  type AxiomGate8PreflightRunnerReceipt,
} from '@/lib/axiom/siteGate8PreflightRunnerReceipt';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from '@/lib/axiom/siteGate8PreflightRunnerCriteria';
import { buildAxiomGate8PreflightContract } from '@/lib/axiom/siteGate8PreflightContract';
import { buildAxiomCandidatePageRouteMap } from '@/lib/axiom/siteCandidatePageRouteMap';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function buildPacket() {
  const routeMap = buildAxiomCandidatePageRouteMap(
    buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
  );
  const preflight = buildAxiomGate8PreflightContract(routeMap);

  return {
    routeMap,
    preflight,
    packet: buildAxiomGate8PreflightRunnerCriteriaPacket(preflight, routeMap),
  };
}

function buildPassingEvidence(targets: string[]): AxiomGate8PreflightRunnerEvidenceInput {
  return {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_passed',
      status: 'passed',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets,
      summary: 'Required Axiom and Falcon Jest targets passed.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_passed',
      status: 'passed',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck passed.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_passed',
      status: 'passed',
      checkedInternalPaths: [...AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS],
      httpStatusByPath: Object.fromEntries(
        AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.map((path) => [path, 200]),
      ),
      summary: 'Internal Axiom candidate-surface internal routes returned HTTP 200.',
    },
  };
}

function cloneReceipt(receipt: AxiomGate8PreflightRunnerReceipt): AxiomGate8PreflightRunnerReceipt {
  return JSON.parse(JSON.stringify(receipt)) as AxiomGate8PreflightRunnerReceipt;
}

describe('Axiom Gate 8 preflight runner receipt', () => {
  it('builds a passed internal preflight receipt without promoting candidate or public release', () => {
    const { packet } = buildPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      packet,
      buildPassingEvidence(packet.requiredTestTargets),
    );
    const validation = validateAxiomGate8PreflightRunnerReceipt(receipt, packet);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(receipt).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      receiptStatus: 'passed_internal_preflight_not_promoted',
      boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_RECEIPT_BOUNDARY,
      sourceCriteriaPacketId: packet.packetId,
      sourceRouteMapId: packet.sourceRouteMapId,
      criterionReceiptCount: packet.criteriaCount,
      routeTargetCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
      nextAllowedMovement: 'prepare_falcon_candidate_surface_review_packet_only_not_public_release',
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
      receipt.criterionReceipts.every(
        (criterion) =>
          criterion.receiptStatus === 'passed_internal_preflight_check' &&
          criterion.satisfiesCriterionForCandidatePreflight &&
          criterion.inheritedBlocksCandidatePromotion &&
          criterion.doesNotBlockInternalInspection,
      ),
    ).toBe(true);
  });

  it('can represent a valid not-run receipt while keeping the work internal', () => {
    const { packet } = buildPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      packet,
      buildNotRunAxiomGate8PreflightRunnerEvidenceInput(),
    );
    const validation = validateAxiomGate8PreflightRunnerReceipt(receipt, packet);

    expect(validation.valid).toBe(true);
    expect(receipt.receiptStatus).toBe('not_run_internal_preflight_not_promoted');
    expect(receipt.nextAllowedMovement).toBe(
      'remain_internal_until_failed_or_not_run_checks_are_repaired',
    );
    expect(
      receipt.criterionReceipts.every((criterion) => criterion.receiptStatus === 'not_run'),
    ).toBe(true);
  });

  it('rejects missing required test target and promotion movement in a receipt', () => {
    const { packet } = buildPacket();
    const receipt = cloneReceipt(
      buildAxiomGate8PreflightRunnerReceipt(
        packet,
        buildPassingEvidence(packet.requiredTestTargets),
      ),
    );
    receipt.requiredTestTargets = receipt.requiredTestTargets.filter(
      (target) => target !== '__tests__/falcon-expert-agent-core-eval-profile.test.ts',
    );
    receipt.evidence.jestEvidence.targets = receipt.evidence.jestEvidence.targets.filter(
      (target) => target !== '__tests__/falcon-expert-agent-core-eval-profile.test.ts',
    );
    receipt.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomGate8PreflightRunnerReceipt['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomGate8PreflightRunnerReceipt(receipt, packet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'required_test_target_missing:__tests__/falcon-expert-agent-core-eval-profile.test.ts',
        'jest_evidence_must_include_all_required_targets',
        'receipt_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
