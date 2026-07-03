import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  AXIOM_ACTIONABILITY_BANDS,
  AXIOM_ALLOWED_CORE_PROGRESS_CLASSES,
  AXIOM_HUMAN_REVIEW_BLOCKS,
  AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
  AXIOM_REQUIRED_BOOTSTRAP_LABELS,
  AXIOM_SOURCE_LENSES,
  buildAxiomInteractionHypothesisKernelFixture,
  validateAxiomInteractionHypothesisKernelContract,
  type AxiomInteractionHypothesisKernel,
} from '@/lib/axiom/interactionHypothesisKernelContract';

function loadJsonFixture(): AxiomInteractionHypothesisKernel {
  return JSON.parse(
    readFileSync(
      path.join(
        process.cwd(),
        'data/specs/axiom/axiom_interaction_hypothesis_kernel.fixture-v0-2026-06-07.json',
      ),
      'utf8',
    ),
  ) as AxiomInteractionHypothesisKernel;
}

function cloneKernel(
  kernel: AxiomInteractionHypothesisKernel = buildAxiomInteractionHypothesisKernelFixture(),
): AxiomInteractionHypothesisKernel {
  return JSON.parse(JSON.stringify(kernel)) as AxiomInteractionHypothesisKernel;
}

describe('Axiom interaction-hypothesis kernel contract', () => {
  it('validates the generated typed fixture as non-runtime kernel_build progress', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixture();
    const validation = validateAxiomInteractionHypothesisKernelContract(kernel);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
      coreProgressClass: 'kernel_build',
    });
    expect(kernel).toMatchObject({
      objectType: 'axiom_interaction_hypothesis_kernel',
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_build',
      status: 'axiom_kernel_candidate_requires_eval',
      inputMode: 'synthetic_non_sensitive_fixture',
      boundary: AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    });
    expect(AXIOM_ALLOWED_CORE_PROGRESS_CLASSES).toEqual([
      'kernel_build',
      'kernel_eval',
      'kernel_grounding',
      'kernel_display',
      'kernel_human_review_loop',
    ]);
  });

  it('keeps the checked-in JSON fixture aligned with the typed contract', () => {
    const fixture = loadJsonFixture();
    const validation = validateAxiomInteractionHypothesisKernelContract(fixture);

    expect(validation.valid).toBe(true);
    expect(fixture.kernelId).toBe('axiom_kernel_fixture_health_time_meeting_density_v0_2026_06_07');
    expect(fixture.bootstrapStatus).toEqual([...AXIOM_REQUIRED_BOOTSTRAP_LABELS]);
    expect(fixture.actionabilityBand).toBe('usable_provisional_insight');
    expect(Object.keys(fixture.sourceLensStatus).sort()).toEqual([...AXIOM_SOURCE_LENSES].sort());
  });

  it('locks the minimum Axiom kernel fields requested for the first implementation task', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixture();

    expect(Object.keys(kernel)).toEqual(
      expect.arrayContaining([
        'observation',
        'inference',
        'counterHypothesis',
        'missingContext',
        'implementationActorConditions',
        'sourceLensStatus',
        'actionabilityBand',
        'cannotYetSay',
        'humanReviewRoute',
      ]),
    );
    expect(kernel.observation.length).toBeGreaterThan(0);
    expect(kernel.inference.length).toBeGreaterThan(0);
    expect(kernel.counterHypothesis.length).toBeGreaterThan(0);
    expect(kernel.missingContext.length).toBeGreaterThan(0);
    expect(kernel.implementationActorConditions.length).toBeGreaterThan(0);
    expect(AXIOM_ACTIONABILITY_BANDS).toContain(kernel.actionabilityBand);
  });

  it('separates observation, inference, counter-hypothesis, missing context, and actor conditions', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixture();
    const observationIds = new Set(kernel.observation.map((observation) => observation.id));
    const missingContextIds = new Set(kernel.missingContext.map((context) => context.id));

    for (const inference of kernel.inference) {
      expect(inference.statusLabel).toBe('provisional_not_reviewed');
      expect(inference.observationIds.every((id) => observationIds.has(id))).toBe(true);
      expect(inference.principalPatternCandidateIds).toEqual(
        expect.arrayContaining(['L3-PIP-01', 'L3-PIP-02', 'L3-PIP-06']),
      );
      expect(inference.crossCuttingCheckIds).toEqual(
        expect.arrayContaining(['L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-27']),
      );
    }

    expect(kernel.counterHypothesis[0].nextQuestionIds).toEqual(
      expect.arrayContaining(['mc_job_001', 'mc_time_001', 'mc_institution_001']),
    );
    expect(
      kernel.implementationActorConditions.every((condition) =>
        condition.missingContextIds.every((id) => missingContextIds.has(id)),
      ),
    ).toBe(true);
  });

  it('keeps Falcon material as bootstrap prior instead of Axiom core truth', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixture();

    expect(kernel.bootstrapStatus).toEqual([
      'falcon_bootstrap_prior',
      'shared_evidence_foundation',
      'axiom_kernel_candidate',
      'requires_axiom_eval',
    ]);
    expect(kernel.sourceLensStatus.external_evidence).toMatchObject({
      status: 'bootstrap_prior_only',
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      publicUse: 'not_public_approved',
    });
    expect(kernel.sourceLensStatus.external_evidence.note).toContain('not Axiom core truth');
  });

  it('models human review as a promotion/finality gate, not a provisional-reasoning stop', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixture();

    expect(kernel.humanReviewRoute).toMatchObject({
      reviewUnit: 'kernel_contract',
      reviewUnitScale: 'framework_unit_not_instance_hypothesis',
      estimatedCoreReviewUnits: 1,
      routeStatus: 'provisional_internal_generation_allowed_review_required_before_promotion',
    });
    expect(kernel.humanReviewRoute.blocks).toEqual([...AXIOM_HUMAN_REVIEW_BLOCKS]);
    expect(kernel.humanReviewRoute.doesNotBlock).toEqual([...AXIOM_HUMAN_REVIEW_MUST_NOT_BLOCK]);
    expect(kernel.humanReviewRoute.blocks).toEqual(
      expect.arrayContaining([
        'final_professional_judgment',
        'public_release',
        'source_validity',
        'support_validity',
        'candidate_pattern',
        'runtime_approved',
        'public_approved',
        'outcome_learning_update',
      ]),
    );
    expect(kernel.humanReviewRoute.doesNotBlock).toEqual(
      expect.arrayContaining([
        'provisional_hypothesis_generation',
        'counter_hypothesis_generation',
        'missing_context_question_generation',
        'actionability_band_classification',
        'non_sensitive_scenario_evaluation',
        'deterministic_kernel_logic_improvement',
        'kernel_object_display_ui',
      ]),
    );
  });

  it('rejects delivery-layer progress labeled as Axiom core kernel work', () => {
    const kernel = cloneKernel();
    kernel.coreProgressClass =
      'delivery_layer_not_core_kernel' as unknown as AxiomInteractionHypothesisKernel['coreProgressClass'];

    const validation = validateAxiomInteractionHypothesisKernelContract(kernel);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining(['first_axiom_contract_must_be_kernel_build_not_delivery_layer']),
    );
  });

  it('rejects runtime, prompt, retrieval, model/provider, DB/schema, or approval movement', () => {
    const kernel = cloneKernel();
    kernel.movementBoundary = {
      runtime:
        'changed' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['runtime'],
      prompt:
        'changed' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['prompt'],
      retrieval:
        'changed' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['retrieval'],
      modelProvider:
        'changed' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['modelProvider'],
      dbSchema:
        'changed' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['dbSchema'],
      sourceValidity:
        'decided' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['sourceValidity'],
      supportValidity:
        'decided' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['supportValidity'],
      candidatePattern:
        'candidate_pattern' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['candidatePattern'],
      runtimeApproved:
        'approved' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['runtimeApproved'],
      publicApproved:
        'approved' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['publicApproved'],
      knowledgePromotion:
        'promoted' as unknown as AxiomInteractionHypothesisKernel['movementBoundary']['knowledgePromotion'],
    };

    const validation = validateAxiomInteractionHypothesisKernelContract(kernel);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
        'validity_candidate_pattern_runtime_public_or_promotion_must_not_move',
      ]),
    );
  });

  it('rejects a kernel object that drops counter-hypothesis or source-lens discipline', () => {
    const kernel = cloneKernel();
    kernel.counterHypothesis = [];
    kernel.sourceLensStatus.supporter_data = {
      ...kernel.sourceLensStatus.supporter_data,
      sourceValidity:
        'decided' as unknown as AxiomInteractionHypothesisKernel['sourceLensStatus']['supporter_data']['sourceValidity'],
    };

    const validation = validateAxiomInteractionHypothesisKernelContract(kernel);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'counter_hypothesis_required',
        'source_lens_status_must_not_approve_validity_or_public_use:supporter_data',
      ]),
    );
  });
});
