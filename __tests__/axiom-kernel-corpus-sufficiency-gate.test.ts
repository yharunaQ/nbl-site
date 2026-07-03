import {
  AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY,
  buildAxiomKernelCorpusSufficiencyGate,
  validateAxiomKernelCorpusSufficiencyGate,
  type AxiomKernelCorpusSufficiencyGate,
} from '@/lib/axiom/kernelCorpusSufficiencyGate';

function cloneGate(gate: AxiomKernelCorpusSufficiencyGate): AxiomKernelCorpusSufficiencyGate {
  return JSON.parse(JSON.stringify(gate)) as AxiomKernelCorpusSufficiencyGate;
}

describe('Axiom kernel corpus sufficiency gate', () => {
  it('passes the compact internal sufficiency gate for the 15-item kernel corpus', () => {
    const gate = buildAxiomKernelCorpusSufficiencyGate();
    const validation = validateAxiomKernelCorpusSufficiencyGate(gate);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_sufficiency_gate_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_SUFFICIENCY_GATE_BOUNDARY,
    });
    expect(gate).toMatchObject({
      objectType: 'axiom_kernel_corpus_sufficiency_gate',
      lane: 'Falcon Lab',
      status: 'passed_internal_kernel_sufficiency_gate_not_public_or_promotion',
      checkCount: 10,
      passedCheckCount: 10,
      failedCheckCount: 0,
      nextAllowedMovement: 'internal_slot_planning_allowed_from_kernel_corpus_not_public_page_filling',
    });
  });

  it('checks source families, scenarios, grounding, eval, review budget, display hides, and delivery exclusion', () => {
    const gate = buildAxiomKernelCorpusSufficiencyGate();
    const byId = new Map(gate.checks.map((check) => [check.checkId, check]));

    for (const checkId of [
      'corpus_has_15_items',
      'all_core_eligible_source_families_represented',
      'five_l3_scenarios_covered',
      'all_grounded_fields_covered',
      'all_items_pass_eval',
      'all_items_review_routed',
      'review_budget_under_100',
      'display_contract_hides_raw_public_and_validity_fields',
      'delivery_layer_excluded_from_core_truth',
      'movement_boundaries_not_moved',
    ] as const) {
      expect(byId.get(checkId)).toMatchObject({ passed: true });
    }
    expect(byId.get('corpus_has_15_items')?.actual).toBe('15');
    expect(byId.get('all_core_eligible_source_families_represented')?.actual).toBe(
      '10 / 10 represented',
    );
  });

  it('does not move public approval, source/support validity, runtime, candidate pattern, or learning', () => {
    const gate = buildAxiomKernelCorpusSufficiencyGate();

    expect(gate.guardrails).toMatchObject({
      publicApproval: 'not_approved',
      publication: 'not_started',
      sourceSupportValidity: 'not_decided',
      runtimePromptRetrievalModelProviderDbSchema: 'not_changed',
      candidatePattern: 'not_candidate_pattern',
      learningUpdate: 'not_promoted',
    });
    expect(gate.notNow).toEqual(
      expect.arrayContaining([
        'no_source_or_support_validity_decision',
        'no_public_approval_or_publication',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects gates that drop checks, fail guardrails, or claim public movement', () => {
    const gate = cloneGate(buildAxiomKernelCorpusSufficiencyGate());

    gate.checks = gate.checks.slice(0, 9);
    gate.checkCount = 9;
    gate.failedCheckCount = 1;
    gate.status = 'failed_internal_kernel_sufficiency_gate_not_public_or_promotion';
    gate.nextAllowedMovement = 'repair_kernel_corpus_before_slot_planning';
    gate.guardrails.publicApproval = 'approved' as unknown as 'not_approved';
    gate.notNow = gate.notNow.filter((item) => item !== 'no_learning_update');

    const validation = validateAxiomKernelCorpusSufficiencyGate(gate);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'sufficiency_gate_check_counts_must_match_checks',
        'sufficiency_gate_check_missing:movement_boundaries_not_moved',
        'sufficiency_gate_must_pass_before_internal_slot_planning',
        'sufficiency_gate_next_movement_must_be_internal_slot_planning_only',
        'sufficiency_gate_guardrails_must_not_move_public_validity_runtime_pattern_or_learning',
        'sufficiency_gate_not_now_must_block_validity_public_runtime_and_learning',
      ]),
    );
  });
});
