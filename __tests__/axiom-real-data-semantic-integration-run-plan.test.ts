import {
  AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY,
  buildAxiomRealDataSemanticIntegrationRunPlan,
  validateAxiomRealDataSemanticIntegrationRunPlan,
  type AxiomRealDataSemanticIntegrationRunPlan,
} from '@/lib/axiom/realDataSemanticIntegrationRunPlan';

function cloneRunPlan(
  runPlan: AxiomRealDataSemanticIntegrationRunPlan,
): AxiomRealDataSemanticIntegrationRunPlan {
  return JSON.parse(JSON.stringify(runPlan)) as AxiomRealDataSemanticIntegrationRunPlan;
}

describe('Axiom real-data semantic integration run plan', () => {
  it('selects all real-derived scale-up and wave2 packets for semantic integration', () => {
    const runPlan = buildAxiomRealDataSemanticIntegrationRunPlan();
    const validation = validateAxiomRealDataSemanticIntegrationRunPlan(runPlan);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_data_semantic_integration_run_plan_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY,
    });
    expect(runPlan).toMatchObject({
      objectType: 'axiom_real_data_semantic_integration_run_plan',
      lane: 'Falcon Lab',
      status: 'ready_for_xhigh_semantic_context_reading_and_integrated_knowledge_object_candidate',
      totalInputPacketCount: 14,
      sourceScaleUpRunId: 'axiom_real_data_scale_up_integration_run_v0_2026_06_08',
      sourceWave2AttachmentId: 'axiom_source_family_scale_up_wave2_attachment_v0_2026_06_08',
    });
    expect(
      runPlan.sourcePacketSelections.filter(
        (selection) => selection.packetSource === 'real_data_scale_up_integration_run',
      ),
    ).toHaveLength(8);
    expect(
      runPlan.sourcePacketSelections.filter(
        (selection) => selection.packetSource === 'source_family_scale_up_wave2',
      ),
    ).toHaveLength(6);
  });

  it('covers all primary reading families without treating L3 27 as input content', () => {
    const runPlan = buildAxiomRealDataSemanticIntegrationRunPlan();

    expect(runPlan.primaryReadingFamilyCoverage).toMatchObject({
      survey_data: expect.any(Number),
      workshop_summaries: expect.any(Number),
      manuals_and_practice_documents: expect.any(Number),
      domestic_web_cache: expect.any(Number),
      international_web_cache: expect.any(Number),
      stage1_scima_fchma_outputs: expect.any(Number),
      ft03_contracts_and_reviewed_boundaries: expect.any(Number),
    });
    for (const count of Object.values(runPlan.primaryReadingFamilyCoverage)) {
      expect(count).toBeGreaterThan(0);
    }
    expect(
      runPlan.sourcePacketSelections.flatMap((selection) => selection.semanticInputFamilies),
    ).not.toContain('l3_27_seed_prior');
    expect(runPlan.l3PriorHandling).toMatchObject({
      timing: 'after_integrated_knowledge_object_candidate_build',
      directContentUse: 'prohibited',
      finalViewCountFixing: 'prohibited',
    });
    expect(runPlan.l3PriorHandling.prohibitedUses).toContain('direct_public_content_generation');
  });

  it('limits xhigh to semantic reading and integrated knowledge object build', () => {
    const runPlan = buildAxiomRealDataSemanticIntegrationRunPlan();

    expect(runPlan.processSequenceStageIds).toEqual([
      'semantic_input_selection',
      'axiom_kernel_xhigh_context_reading',
      'integrated_knowledge_object_build',
      'l3_prior_contrast_and_coverage_check',
      'surface_projection_after_integration',
    ]);
    expect(runPlan.xhighPasses).toEqual([
      'axiom_kernel_xhigh_context_reading',
      'integrated_knowledge_object_build',
    ]);
    expect(runPlan.pageProjectionStatus).toBe(
      'blocked_until_integrated_domain_knowledge_object_candidate_exists_and_is_review_routed',
    );
  });

  it('rejects missing packets, L3-as-input shortcuts, raw-boundary drift, and public movement', () => {
    const runPlan = cloneRunPlan(buildAxiomRealDataSemanticIntegrationRunPlan());

    runPlan.sourcePacketSelections = runPlan.sourcePacketSelections.slice(1);
    runPlan.totalInputPacketCount = runPlan.sourcePacketSelections.length;
    runPlan.sourcePacketSelections[0].semanticInputFamilies.push(
      'l3_27_seed_prior' as never,
    );
    runPlan.sourcePacketSelections[0].dataBoundary.rawOriginalOpened = true as false;
    runPlan.xhighPasses = [
      'axiom_kernel_xhigh_context_reading',
      'axiom_kernel_xhigh_context_reading',
    ] as unknown as AxiomRealDataSemanticIntegrationRunPlan['xhighPasses'];
    runPlan.l3PriorHandling.directContentUse = 'allowed' as 'prohibited';
    runPlan.pageProjectionStatus =
      'ready_for_public_pages' as 'blocked_until_integrated_domain_knowledge_object_candidate_exists_and_is_review_routed';
    runPlan.notNow = runPlan.notNow.filter(
      (item) => item !== 'no_l3_27_direct_public_copy',
    );

    const validation = validateAxiomRealDataSemanticIntegrationRunPlan(runPlan);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'semantic_integration_run_plan_must_select_14_real_derived_packets',
        'l3_27_seed_prior_must_not_be_selected_as_semantic_input_packet_family',
        'semantic_input_packets_must_keep_raw_export_validity_and_public_boundaries_closed',
        'xhigh_passes_must_be_limited_to_context_reading_and_integrated_object_build',
        'l3_prior_must_be_after_integration_and_prohibit_direct_content_or_fixed_count',
        'page_projection_must_wait_for_integrated_domain_knowledge_object_candidate',
        'not_now_must_block_page_l3_runtime_and_learning_movement',
      ]),
    );
  });
});
