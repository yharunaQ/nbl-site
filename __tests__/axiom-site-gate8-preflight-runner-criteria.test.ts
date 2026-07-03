import {
  AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
  AXIOM_GATE8_RUNNER_CRITERION_IDS,
  AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS,
  buildAxiomGate8PreflightRunnerCriteriaPacket,
  validateAxiomGate8PreflightRunnerCriteriaPacket,
  type AxiomGate8PreflightRunnerCriteriaPacket,
} from '@/lib/axiom/siteGate8PreflightRunnerCriteria';
import { buildAxiomGate8PreflightContract } from '@/lib/axiom/siteGate8PreflightContract';
import { buildAxiomCandidatePageRouteMap } from '@/lib/axiom/siteCandidatePageRouteMap';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePacket(
  packet: AxiomGate8PreflightRunnerCriteriaPacket,
): AxiomGate8PreflightRunnerCriteriaPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomGate8PreflightRunnerCriteriaPacket;
}

describe('Axiom Gate 8 preflight runner criteria packet', () => {
  it('builds an internal required-not-run criteria packet from the Gate 8 preflight', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);
    const packet = buildAxiomGate8PreflightRunnerCriteriaPacket(preflight, routeMap);
    const validation = validateAxiomGate8PreflightRunnerCriteriaPacket(packet, preflight, routeMap);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status: 'runner_criteria_packet_internal_required_not_run',
      boundary: AXIOM_GATE8_PREFLIGHT_RUNNER_CRITERIA_BOUNDARY,
      sourcePreflightId: preflight.preflightId,
      sourceRouteMapId: routeMap.routeMapId,
      criteriaCount: AXIOM_GATE8_RUNNER_CRITERION_IDS.length,
      routeTargetCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
      requiredTestTargetCount: AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS.length,
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

  it('requires the five first-runner criteria without running or satisfying them', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);
    const packet = buildAxiomGate8PreflightRunnerCriteriaPacket(preflight, routeMap);

    expect(packet.criteria.map((criterion) => criterion.criterionId)).toEqual(
      AXIOM_GATE8_RUNNER_CRITERION_IDS,
    );
    expect(
      packet.criteria.every(
        (criterion) =>
          criterion.status === 'required_not_run' &&
          criterion.blocksCandidatePromotion &&
          criterion.doesNotBlockInternalInspection &&
          criterion.commandHint.length > 0 &&
          criterion.evidenceRequired.length > 0,
      ),
    ).toBe(true);
    expect(
      new Set(packet.criteria.flatMap((criterion) => criterion.relatedGate8Categories)),
    ).toEqual(
      new Set([
        'public_boundary',
        'source_currentness_hold',
        'accessibility_readiness',
        'regression_readiness',
        'route_promotion_criteria',
        'human_review_gate',
      ]),
    );
  });

  it('targets all nine internal candidate page routes before any public navigation exists', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);
    const packet = buildAxiomGate8PreflightRunnerCriteriaPacket(preflight, routeMap);

    expect(packet.routeTargets.map((target) => target.surface)).toEqual(
      AXIOM_NEXT_NBL_SITE_SURFACES,
    );
    expect(
      packet.routeTargets.every(
        (target) =>
          target.internalPath.startsWith('/internal/') &&
          target.targetStatus === 'internal_route_target_required_not_run' &&
          target.renderRequirement ===
            'http_200_or_component_render_required_before_candidate_promotion' &&
          target.publicNavigationStatus === 'not_added',
      ),
    ).toBe(true);
  });

  it('keeps Falcon eval preservation in the required regression targets', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);
    const packet = buildAxiomGate8PreflightRunnerCriteriaPacket(preflight, routeMap);

    expect(packet.requiredTestTargets).toEqual([...AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS]);
    expect(packet.requiredTestTargets).toEqual(
      expect.arrayContaining([
        '__tests__/falcon-expert-agent-core-eval-profile.test.ts',
        '__tests__/axiom-interaction-hypothesis-kernel-contract.test.ts',
        '__tests__/axiom-interaction-hypothesis-kernel-evaluator.test.ts',
        '__tests__/axiom-site-gate8-preflight-contract.test.ts',
        '__tests__/axiom-site-candidate-page-route-map.test.ts',
        '__tests__/axiom-next-nbl-internal-preview.test.tsx',
        '__tests__/axiom-next-nbl-candidate-pages.test.tsx',
        '__tests__/axiom-site-internal-candidate-surface-implementation-scaffold.test.ts',
        '__tests__/axiom-site-internal-candidate-surface-render-adapter.test.ts',
        '__tests__/axiom-site-internal-candidate-surface-page-shell.test.ts',
        '__tests__/axiom-site-internal-candidate-surface-page-shell-review-packet.test.ts',
        '__tests__/axiom-site-internal-candidate-public-page-preview-assembly.test.ts',
        '__tests__/axiom-site-internal-candidate-public-page-hold-packet.test.ts',
        '__tests__/axiom-site-internal-candidate-release-readiness-ledger.test.ts',
        '__tests__/axiom-site-internal-candidate-surface-promotion-request-packet.test.ts',
        '__tests__/axiom-site-internal-candidate-surface-promotion-handoff-manifest.test.ts',
        '__tests__/axiom-site-internal-candidate-public-release-decision-packet-shell.test.ts',
        '__tests__/axiom-site-internal-candidate-public-navigation-release-route-shell.test.ts',
        '__tests__/axiom-site-internal-candidate-final-public-release-review-packet.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-handoff-manifest.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-receipt-shell.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-ingestion-contract.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-shell.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-validation-gate.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.ts',
        '__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-return-hold-shell.test.ts',
        '__tests__/axiom-next-nbl-candidate-surface-scaffold.test.tsx',
        '__tests__/axiom-next-nbl-candidate-surface-render-adapter.test.tsx',
        '__tests__/axiom-next-nbl-candidate-surface-page-shell.test.tsx',
        '__tests__/axiom-next-nbl-candidate-public-page-preview.test.tsx',
        '__tests__/axiom-next-nbl-candidate-public-page-hold-packet.test.tsx',
        '__tests__/axiom-next-nbl-candidate-release-readiness-ledger.test.tsx',
        '__tests__/axiom-next-nbl-candidate-surface-promotion-request-packet.test.tsx',
        '__tests__/axiom-next-nbl-candidate-surface-promotion-handoff-manifest.test.tsx',
        '__tests__/axiom-next-nbl-candidate-public-release-decision-packet-shell.test.tsx',
        '__tests__/axiom-next-nbl-candidate-public-navigation-release-route-shell.test.tsx',
        '__tests__/axiom-next-nbl-candidate-final-public-release-review-packet.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.tsx',
        '__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell.test.tsx',
      ]),
    );
  });

  it('rejects missing criterion, missing test target, and promotion movement', () => {
    const routeMap = buildAxiomCandidatePageRouteMap(
      buildAxiomCandidatePageDataBundle(buildAxiomSitePreviewReviewMatrix()),
    );
    const preflight = buildAxiomGate8PreflightContract(routeMap);
    const packet = clonePacket(buildAxiomGate8PreflightRunnerCriteriaPacket(preflight, routeMap));
    packet.criteria = packet.criteria.filter(
      (criterion) => criterion.criterionId !== 'falcon_eval_preservation',
    );
    packet.criteriaCount = packet.criteria.length;
    packet.requiredTestTargets = packet.requiredTestTargets.filter(
      (testTarget) => testTarget !== '__tests__/falcon-expert-agent-core-eval-profile.test.ts',
    );
    packet.requiredTestTargetCount = packet.requiredTestTargets.length;
    packet.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomGate8PreflightRunnerCriteriaPacket['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomGate8PreflightRunnerCriteriaPacket(packet, preflight, routeMap);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'criteria_count_must_match_required_runner_criteria',
        'runner_criterion_missing:falcon_eval_preservation',
        'required_test_target_missing:__tests__/falcon-expert-agent-core-eval-profile.test.ts',
        'runner_criteria_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
