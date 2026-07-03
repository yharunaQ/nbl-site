import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  evaluateAxiomInteractionHypothesisKernelSuite,
  evaluateAxiomInteractionHypothesisKernelAgainstScenario,
  type AxiomKernelEvalScenario,
} from '@/lib/axiom/interactionHypothesisKernelEvaluator';
import {
  buildAxiomInteractionHypothesisKernelFixture,
  type AxiomInteractionHypothesisKernel,
} from '@/lib/axiom/interactionHypothesisKernelContract';
import {
  AXIOM_L3_EVAL_SCENARIO_IDS,
  buildAllAxiomInteractionHypothesisKernelScenarioFixtures,
  buildAxiomInteractionHypothesisKernelFixtureForScenario,
} from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';

type FalconCoreEvalProfile = {
  scenario_fixtures: AxiomKernelEvalScenario[];
};

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

function loadHealthTimeScenario(): AxiomKernelEvalScenario {
  const profile = loadFalconCoreEvalProfile();
  const scenario = profile.scenario_fixtures.find(
    (fixture) => fixture.id === 'l3_health_time_accommodation_lookup_trap_v0',
  );

  if (!scenario) {
    throw new Error('health_time_scenario_fixture_missing');
  }

  return scenario;
}

function loadAxiomL3Scenarios(): AxiomKernelEvalScenario[] {
  const scenarioIds = new Set<string>(AXIOM_L3_EVAL_SCENARIO_IDS);
  return loadFalconCoreEvalProfile().scenario_fixtures.filter((fixture) =>
    scenarioIds.has(fixture.id),
  );
}

function cloneKernel(
  kernel: AxiomInteractionHypothesisKernel = buildAxiomInteractionHypothesisKernelFixture(),
): AxiomInteractionHypothesisKernel {
  return JSON.parse(JSON.stringify(kernel)) as AxiomInteractionHypothesisKernel;
}

describe('Axiom interaction-hypothesis kernel evaluator', () => {
  it('evaluates all five existing L3 scenarios as a non-runtime kernel_eval suite', () => {
    const suite = evaluateAxiomInteractionHypothesisKernelSuite(
      buildAllAxiomInteractionHypothesisKernelScenarioFixtures(),
      loadAxiomL3Scenarios(),
      '2026-06-07T00:00:00.000Z',
    );

    expect(suite).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_eval',
      status: 'passes',
      scenarioCount: 5,
      passingScenarioCount: 5,
      failingScenarioCount: 0,
      averageScore: 2,
      modelCalled: false,
      runtimeChanged: false,
      promptChanged: false,
      retrievalChanged: false,
      modelProviderChanged: false,
      dbSchemaChanged: false,
      publicApprovalChanged: false,
      knowledgePromotionChanged: false,
    });
    expect(suite.reports.map((report) => report.scenarioId).sort()).toEqual(
      [...AXIOM_L3_EVAL_SCENARIO_IDS].sort(),
    );
    expect(suite.notNow).toEqual(
      expect.arrayContaining(['no_public_site_publication', 'no_public_approval']),
    );
  });

  it('keeps each scenario fixture aligned with the Falcon eval profile expectations', () => {
    const scenarios = loadAxiomL3Scenarios();

    expect(scenarios).toHaveLength(5);

    for (const scenario of scenarios) {
      const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
        scenario.id as (typeof AXIOM_L3_EVAL_SCENARIO_IDS)[number],
      );
      const report = evaluateAxiomInteractionHypothesisKernelAgainstScenario(kernel, scenario);

      expect(report.status).toBe('passes');
      expect(report.score).toBe(2);
      expect(report.failedCheckCount).toBe(0);
      expect(kernel.inference[0].principalPatternCandidateIds).toEqual(
        scenario.expected_principal_pattern_ids,
      );
      expect(kernel.inference[0].crossCuttingCheckIds).toEqual(
        scenario.expected_cross_cutting_check_ids,
      );
    }
  });

  it('passes the first Axiom kernel fixture against the existing Falcon L3 health-time scenario', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixture();
    const scenario = loadHealthTimeScenario();
    const report = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      kernel,
      scenario,
      '2026-06-07T00:00:00.000Z',
    );

    expect(report).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_eval',
      scenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
      kernelId: 'axiom_kernel_fixture_health_time_meeting_density_v0_2026_06_07',
      status: 'passes',
      score: 2,
      modelCalled: false,
      runtimeChanged: false,
      promptChanged: false,
      retrievalChanged: false,
      modelProviderChanged: false,
      dbSchemaChanged: false,
      publicApprovalChanged: false,
      knowledgePromotionChanged: false,
      failedCheckCount: 0,
    });
    expect(report.deliveryLayerProgressClass).toBe('delivery_layer_not_core_kernel');
    expect(report.notNow).toEqual(
      expect.arrayContaining([
        'no_model_call',
        'no_runtime_change',
        'no_prompt_change',
        'no_retrieval_change',
        'no_db_or_schema_change',
        'no_public_site_publication',
      ]),
    );
    expect(report.checks.map((check) => check.id)).toEqual(
      expect.arrayContaining([
        'contract_valid',
        'scenario_principal_patterns_covered',
        'scenario_cross_cutting_checks_covered',
        'required_interaction_slots_covered',
        'actionability_band_allowed_by_scenario',
        'counter_hypothesis_present',
        'source_lenses_status_present',
        'movement_boundary_unchanged',
      ]),
    );
  });

  it('keeps all required health-time contact slots visible before site rendering', () => {
    const report = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      buildAxiomInteractionHypothesisKernelFixture(),
      loadHealthTimeScenario(),
    );
    const slotCheck = report.checks.find(
      (check) => check.id === 'required_interaction_slots_covered',
    );

    expect(slotCheck).toBeDefined();
    expect(slotCheck?.passed).toBe(true);
    expect(slotCheck?.expected).toEqual([
      'person',
      'job',
      'environment',
      'support',
      'time',
      'institution',
    ]);
    expect(slotCheck?.actual).toEqual(
      expect.arrayContaining(['person', 'job', 'environment', 'support', 'time', 'institution']),
    );
  });

  it('marks a kernel as needing repair when expected L3 pattern coverage is lost', () => {
    const kernel = cloneKernel();
    kernel.inference[0].principalPatternCandidateIds = ['L3-PIP-01'];

    const report = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      kernel,
      loadHealthTimeScenario(),
    );

    expect(report.status).toBe('needs_repair');
    expect(report.score).toBe(1);
    expect(report.failedCheckCount).toBe(1);
    expect(report.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'scenario_principal_patterns_covered',
          passed: false,
          expected: ['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06'],
          actual: ['L3-PIP-01'],
        }),
      ]),
    );
  });

  it('fails closed when a kernel tries to move runtime or approval boundary inside eval', () => {
    const kernel = cloneKernel();
    kernel.movementBoundary.runtime =
      'changed' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['runtime'];
    kernel.movementBoundary.publicApproved =
      'approved' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['publicApproved'];

    const report = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      kernel,
      loadHealthTimeScenario(),
    );

    expect(report.status).toBe('needs_repair');
    expect(report.score).toBe(1);
    expect(report.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'contract_valid',
          passed: false,
        }),
        expect.objectContaining({
          id: 'movement_boundary_unchanged',
          passed: false,
        }),
      ]),
    );
  });
});
