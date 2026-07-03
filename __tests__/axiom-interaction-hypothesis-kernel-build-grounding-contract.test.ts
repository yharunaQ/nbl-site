import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
  AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES,
  AXIOM_KERNEL_GROUNDED_FIELDS,
  buildAllAxiomKernelBuildGroundingPackets,
  buildAxiomKernelBuildGroundingInputFixture,
  buildAxiomKernelBuildGroundingPacket,
  buildAxiomKernelBuildGroundingReviewUnitCompression,
  validateAxiomKernelBuildGroundingPacket,
  type AxiomKernelBuildGroundingInput,
  type AxiomKernelBuildGroundingPacket,
} from '@/lib/axiom/interactionHypothesisKernelBuildGroundingContract';
import { evaluateAxiomInteractionHypothesisKernelAgainstScenario } from '@/lib/axiom/interactionHypothesisKernelEvaluator';
import {
  AXIOM_L3_EVAL_SCENARIO_IDS,
  type AxiomL3EvalScenarioId,
} from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';

type FalconCoreEvalProfile = {
  scenario_fixtures: Parameters<typeof evaluateAxiomInteractionHypothesisKernelAgainstScenario>[1][];
};

function loadJsonInputFixture(): AxiomKernelBuildGroundingInput {
  return JSON.parse(
    readFileSync(
      path.join(
        process.cwd(),
        'data/specs/axiom/axiom_kernel_build_grounding_input.fixture-v0-2026-06-08.json',
      ),
      'utf8',
    ),
  ) as AxiomKernelBuildGroundingInput;
}

function loadFalconCoreEvalProfile(): FalconCoreEvalProfile {
  return JSON.parse(
    readFileSync(
      path.join(
        process.cwd(),
        'data/specs/quality/falcon_expert_agent.core_eval_profile-v0-2026-06-07.json',
      ),
      'utf8',
    ),
  ) as FalconCoreEvalProfile;
}

function scenarioById(scenarioId: AxiomL3EvalScenarioId) {
  const scenario = loadFalconCoreEvalProfile().scenario_fixtures.find(
    (candidate) => candidate.id === scenarioId,
  );

  if (!scenario) {
    throw new Error(`scenario_missing:${scenarioId}`);
  }

  return scenario;
}

function clonePacket(
  packet: AxiomKernelBuildGroundingPacket = buildAxiomKernelBuildGroundingPacket(),
): AxiomKernelBuildGroundingPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomKernelBuildGroundingPacket;
}

describe('Axiom interaction-hypothesis kernel build + grounding contract', () => {
  it('builds a non-runtime packet that strengthens kernel_build, kernel_grounding, and review loop', () => {
    const packet = buildAxiomKernelBuildGroundingPacket();
    const validation = validateAxiomKernelBuildGroundingPacket(packet);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'build_grounding_contract_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_BUILD_GROUNDING_BOUNDARY,
    });
    expect(validation.coreProgressClasses).toEqual([
      'kernel_build',
      'kernel_grounding',
      'kernel_human_review_loop',
    ]);
    expect(packet.strengthensCore).toEqual([...AXIOM_KERNEL_BUILD_GROUNDING_REQUIRED_CORE_CLASSES]);
    expect(packet.kernel).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_build',
      inputMode: 'evidence_foundation_fixture',
      status: 'axiom_kernel_candidate_requires_eval',
    });
    expect(packet.groundingMap.coreProgressClass).toBe('kernel_grounding');
    expect(packet.reviewDrivenPromotionGate).toMatchObject({
      coreProgressClass: 'kernel_human_review_loop',
      promotionReadinessStatus: 'review_required_before_promotion',
      reviewUnitScale: 'principal_pattern_or_frame_unit_not_individual_hypothesis',
      maxCoreHumanReviewUnits: 100,
    });
    expect(packet.notNow).toEqual(
      expect.arrayContaining([
        'no_public_page_filling',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_source_or_support_validity_decision',
      ]),
    );
  });

  it('keeps the checked-in evidence input fixture aligned with the typed builder', () => {
    const input = loadJsonInputFixture();
    const typedInput = buildAxiomKernelBuildGroundingInputFixture();
    const packet = buildAxiomKernelBuildGroundingPacket(input);
    const validation = validateAxiomKernelBuildGroundingPacket(packet);

    expect(validation.valid).toBe(true);
    expect(input.inputId).toBe(typedInput.inputId);
    expect(input.inputMode).toBe('evidence_foundation_fixture');
    expect(input.sourceFoundationRefs.map((source) => source.id)).toEqual(
      typedInput.sourceFoundationRefs.map((source) => source.id),
    );
    expect(input.evidenceSpans.map((span) => span.id)).toEqual(
      typedInput.evidenceSpans.map((span) => span.id),
    );
    expect(input.inheritedFrames.every((frame) => frame.status === 'requires_axiom_eval')).toBe(
      true,
    );
    expect(input.inheritedFrames.every((frame) => frame.allowedAsAxiomCoreTruth === false)).toBe(
      true,
    );
  });

  it('builds valid grounded packets for all five L3 scenario fixtures', () => {
    const packets = buildAllAxiomKernelBuildGroundingPackets();

    expect(packets.map((packet) => packet.input.scenarioId).sort()).toEqual(
      [...AXIOM_L3_EVAL_SCENARIO_IDS].sort(),
    );

    for (const packet of packets) {
      const validation = validateAxiomKernelBuildGroundingPacket(packet);
      const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
        packet.kernel,
        scenarioById(packet.input.scenarioId as AxiomL3EvalScenarioId),
        '2026-06-08T00:00:00.000Z',
      );

      expect(validation.valid).toBe(true);
      expect(packet.kernel.inputMode).toBe('evidence_foundation_fixture');
      expect(packet.groundingMap.groundingLinks.length).toBeGreaterThan(
        AXIOM_KERNEL_GROUNDED_FIELDS.length,
      );
      expect(evalReport.status).toBe('passes');
      expect(evalReport.failedCheckCount).toBe(0);
    }
  });

  it('grounds every required kernel field and every kernel item in evidence spans', () => {
    const packet = buildAxiomKernelBuildGroundingPacket();
    const links = packet.groundingMap.groundingLinks;

    for (const field of AXIOM_KERNEL_GROUNDED_FIELDS) {
      expect(packet.groundingMap.coverage[field]).toBe('covered');
      expect(links.some((link) => link.kernelField === field)).toBe(true);
    }

    for (const observation of packet.kernel.observation) {
      expect(
        links.some((link) => link.kernelField === 'observation' && link.kernelItemId === observation.id),
      ).toBe(true);
    }
    for (const inference of packet.kernel.inference) {
      expect(
        links.some((link) => link.kernelField === 'inference' && link.kernelItemId === inference.id),
      ).toBe(true);
    }
    for (const counter of packet.kernel.counterHypothesis) {
      expect(
        links.some(
          (link) => link.kernelField === 'counterHypothesis' && link.kernelItemId === counter.id,
        ),
      ).toBe(true);
    }
    for (const context of packet.kernel.missingContext) {
      expect(
        links.some(
          (link) => link.kernelField === 'missingContext' && link.kernelItemId === context.id,
        ),
      ).toBe(true);
    }
  });

  it('keeps Falcon pages, SNS progress, Stage 1, L3, and FT03 as inherited frames requiring Axiom eval', () => {
    const packet = buildAxiomKernelBuildGroundingPacket();

    expect(packet.input.inheritedFrames.map((frame) => frame.source)).toEqual([
      'falcon_public_page',
      'sns_progress',
      'stage1_scima_fchma',
      'l3_21_views',
      'ft03_contract',
    ]);
    expect(packet.input.inheritedFrames.every((frame) => frame.status === 'requires_axiom_eval')).toBe(
      true,
    );
    expect(packet.input.inheritedFrames.every((frame) => frame.allowedAsAxiomCoreTruth === false)).toBe(
      true,
    );
    expect(packet.groundingMap.notGroundedAsCoreTruth).toEqual(
      expect.arrayContaining([
        'falcon_public_page',
        'sns_progress',
        'stage1_scima_fchma_without_axiom_eval',
        'l3_21_views_without_axiom_eval',
        'ft03_contract_without_axiom_eval',
      ]),
    );
  });

  it('models review-driven promotion as a promotion gate, not a stop on provisional kernel work', () => {
    const gate = buildAxiomKernelBuildGroundingPacket().reviewDrivenPromotionGate;

    expect(gate.estimatedCoreReviewUnits).toBeLessThanOrEqual(100);
    expect(gate.blockedDecisionStatus).toEqual({
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
      knowledgePromotion: 'not_promoted',
    });
    expect(gate.blocks).toEqual(
      expect.arrayContaining([
        'source_validity',
        'support_validity',
        'candidate_pattern',
        'runtime_approved',
        'public_approved',
        'outcome_learning_update',
      ]),
    );
    expect(gate.doesNotBlock).toEqual(
      expect.arrayContaining([
        'provisional_hypothesis_generation',
        'counter_hypothesis_generation',
        'missing_context_question_generation',
        'deterministic_kernel_logic_improvement',
      ]),
    );
  });

  it('compresses all five scenario packets into framework-level review units under the 100-unit budget', () => {
    const packets = buildAllAxiomKernelBuildGroundingPackets();
    const compression = buildAxiomKernelBuildGroundingReviewUnitCompression(packets);

    expect(compression).toMatchObject({
      objectType: 'axiom_kernel_build_grounding_review_unit_compression',
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_human_review_loop',
      packetCount: 5,
      scenarioCount: 5,
      reviewUnitScale: 'compressed_framework_units_not_individual_hypotheses',
      maxCoreHumanReviewUnits: 100,
    });
    expect(compression.estimatedCoreReviewUnits).toBeLessThanOrEqual(100);
    expect(compression.estimatedCoreReviewUnits).toBe(compression.units.length);
    expect(compression.units.map((unit) => unit.unitType)).toEqual([
      'kernel_contract',
      'actionability_band',
      'l3_principal_pattern_family',
      'cross_cutting_check_family',
      'source_lens_status',
      'implementation_actor_conditions',
      'review_driven_promotion_gate',
      'cannot_yet_say_boundary',
    ]);
    expect(
      compression.units.every(
        (unit) => unit.packetIds.length === 5 && unit.scenarioIds.length === 5,
      ),
    ).toBe(true);
    expect(compression.blockedDecisionStatus).toMatchObject({
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
    });
  });

  it('rejects a packet that loses evidence grounding for a kernel item', () => {
    const packet = clonePacket();
    const firstObservationId = packet.kernel.observation[0].id;
    const observationLink = packet.groundingMap.groundingLinks.find(
      (link) => link.kernelField === 'observation' && link.kernelItemId === firstObservationId,
    );

    if (!observationLink) {
      throw new Error('first_observation_grounding_missing_in_test_fixture');
    }

    observationLink.evidenceSpanIds = [];

    const validation = validateAxiomKernelBuildGroundingPacket(packet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([`grounding_link_evidence_span_required:${observationLink.linkId}`]),
    );
  });

  it('rejects inherited public or SNS frames when they are treated as Axiom core truth', () => {
    const packet = clonePacket();
    packet.input.inheritedFrames[0].allowedAsAxiomCoreTruth = true as unknown as false;
    packet.input.inheritedFrames[0].allowedUse = 'bootstrap_prior_only';

    const validation = validateAxiomKernelBuildGroundingPacket(packet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'inherited_frame_must_require_axiom_eval_before_core_truth:inherited_falcon_public_page_skeleton',
        'public_or_sns_frame_must_not_be_bootstrap_truth:inherited_falcon_public_page_skeleton',
      ]),
    );
  });

  it('rejects validity, approval, runtime, promotion, or learning movement inside the build-grounding packet', () => {
    const packet = clonePacket();
    packet.movementBoundary.runtime = 'changed' as unknown as 'not_changed';
    packet.input.evidenceSpans[0].sourceValidity = 'decided' as unknown as 'not_decided';
    packet.reviewDrivenPromotionGate.blockedDecisionStatus.candidatePattern =
      'candidate_pattern' as unknown as 'not_candidate_pattern';

    const validation = validateAxiomKernelBuildGroundingPacket(packet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'movement_boundary_changed',
        'evidence_span_must_not_move_validity_public_or_promotion:span_synthetic_respondent_health_time',
        'review_gate_must_not_move_validity_approval_public_release_or_learning',
      ]),
    );
  });
});
