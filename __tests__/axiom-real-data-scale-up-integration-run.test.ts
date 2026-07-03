import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY,
  buildAxiomRealDataScaleUpEvidencePackets,
  runAxiomRealDataScaleUpIntegrationRun,
  validateAxiomRealDataScaleUpIntegrationRun,
  type AxiomRealDataScaleUpIntegrationRun,
} from '@/lib/axiom/realDataScaleUpIntegrationRun';
import { validateAxiomRealDerivedEvidencePacket } from '@/lib/axiom/interactionHypothesisKernelRealDerivedEvidenceProtocol';

function sourceText(uri: string): string {
  return readFileSync(path.join(process.cwd(), uri), 'utf8');
}

function cloneRun(run: AxiomRealDataScaleUpIntegrationRun): AxiomRealDataScaleUpIntegrationRun {
  return JSON.parse(JSON.stringify(run)) as AxiomRealDataScaleUpIntegrationRun;
}

describe('Axiom real-data scale-up integration run', () => {
  it('builds the manifest-selected scale-up evidence packets from derived real data', () => {
    const packets = buildAxiomRealDataScaleUpEvidencePackets();

    expect(packets.map((packet) => packet.packetId)).toEqual([
      'axiom_real_data_scale_up_packet_stage1_remaining_context_readings_v0_2026_06_08',
      'axiom_real_data_scale_up_packet_web_cache_batch2_underread_axes_v0_2026_06_08',
      'axiom_real_data_scale_up_packet_ftcodex03_network_reconnection_v0_2026_06_08',
    ]);

    for (const packet of packets) {
      const validation = validateAxiomRealDerivedEvidencePacket(packet);

      expect(validation).toMatchObject({
        valid: true,
        validationStatus: 'real_derived_evidence_packet_valid',
        errorCount: 0,
      });
      expect(packet.dataPolicy).toMatchObject({
        inputLayer: 'references_derived_and_docs_only',
        rawOriginalOpened: false,
        sourceTextExported: false,
        redactedTextExported: false,
        fieldValueExported: false,
        containsSensitiveRawText: false,
        sourceSupportValidityDecision: 'not_decided',
        publicUse: 'not_public_approved',
      });
      expect(packet.counterHypothesis.length).toBeGreaterThan(0);
      expect(packet.missingContext.length).toBeGreaterThan(0);
      expect(packet.cannotYetSay.join(' ')).toContain('support validity');

      for (const source of packet.sourceFoundationRefs) {
        expect(existsSync(path.join(process.cwd(), source.uri))).toBe(true);
        expect(source.containsSensitiveRawText).toBe(false);
        expect(source.allowedAsAxiomCoreTruth).toBe(false);
        expect(source.requiresAxiomEval).toBe(true);
      }
    }
  });

  it('anchors scale-up packets to the actual derived artifacts without opening raw text', () => {
    const cr02 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.md',
    );
    const cr05 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.md',
    );
    const batch2 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md',
    );
    const summary = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
    );
    const network = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
    );

    expect(cr02).toContain('raw_original_opened: False');
    expect(cr02).toContain('conditional_performance');
    expect(cr02).toContain('support_retranslation');
    expect(cr05).toContain('RR-05 is not a weak evidence pile');
    expect(cr05).toContain('deliberate brake layer');
    expect(batch2).toContain('source text exported | False');
    expect(batch2).toContain('WCB2-M01-worksite-contact-procedure-safety');
    expect(batch2).toContain('legal/policy/current/service claims');
    expect(summary).toContain("source_family_counts: {'supporter': 9, 'workplace': 9");
    expect(summary).toContain('integration_pressure');
    expect(network).toContain('Support continuity becomes the retranslation spine');
    expect(network).toContain('Do not equate support presence');
  });

  it('runs pilot plus scale-up packets through kernel build, L3 eval, and review compression', () => {
    const run = runAxiomRealDataScaleUpIntegrationRun();
    const validation = validateAxiomRealDataScaleUpIntegrationRun(run);

    expect(
      run.evalReports
        .filter((report) => report.status !== 'passes')
        .map((report) => ({
          scenarioId: report.scenarioId,
          kernelId: report.kernelId,
          failed: report.checks
            .filter((check) => !check.passed)
            .map((check) => check.id),
        })),
    ).toEqual([]);
    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_data_scale_up_integration_run_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_SCALE_UP_INTEGRATION_RUN_BOUNDARY,
    });
    expect(run).toMatchObject({
      objectType: 'axiom_real_data_scale_up_integration_run',
      lane: 'Falcon Lab',
      status: 'passed_real_data_scale_up_integration_run',
      pilotPacketCount: 5,
      scaleUpPacketCount: 3,
      integratedPacketCount: 8,
      integratedScenarioCount: 5,
    });
    expect(run.intakeUnitIdsExecuted).toEqual([
      'intake_scale_up_stage1_remaining_context_readings',
      'intake_scale_up_stage1_web_cache_deep_reading_batches',
      'intake_scale_up_ftcodex03_supporter_workplace_nivr_workshop',
    ]);
    expect(run.scaleUpPacketMappings).toEqual([
      expect.objectContaining({
        sourceIntakeUnitId: 'intake_scale_up_stage1_remaining_context_readings',
        evidencePacketId:
          'axiom_real_data_scale_up_packet_stage1_remaining_context_readings_v0_2026_06_08',
        status: 'accepted_for_scale_up_integration_run',
      }),
      expect.objectContaining({
        sourceIntakeUnitId: 'intake_scale_up_stage1_web_cache_deep_reading_batches',
        evidencePacketId:
          'axiom_real_data_scale_up_packet_web_cache_batch2_underread_axes_v0_2026_06_08',
        status: 'accepted_for_scale_up_integration_run',
      }),
      expect.objectContaining({
        sourceIntakeUnitId: 'intake_scale_up_ftcodex03_supporter_workplace_nivr_workshop',
        evidencePacketId:
          'axiom_real_data_scale_up_packet_ftcodex03_network_reconnection_v0_2026_06_08',
        status: 'accepted_for_scale_up_integration_run',
      }),
    ]);
    expect(
      run.evalReports
        .filter((report) => report.status !== 'passes')
        .map((report) => ({
          scenarioId: report.scenarioId,
          kernelId: report.kernelId,
          failed: report.checks
            .filter((check) => !check.passed)
            .map((check) => check.id),
        })),
    ).toEqual([]);
    expect(run.evalReports.length).toBe(8);
    expect(run.evalReports.every((report) => report.status === 'passes')).toBe(true);
    expect(run.integratedBatchRun.runs.every((buildRun) => buildRun.validation.valid)).toBe(true);
    expect(run.integratedBatchRun.reviewUnitCompression).toMatchObject({
      packetCount: 8,
      scenarioCount: 5,
      reviewUnitScale: 'compressed_framework_units_not_individual_hypotheses',
      estimatedCoreReviewUnits: 8,
      maxCoreHumanReviewUnits: 100,
    });
  });

  it('routes all pilot and scale-up hypotheses through compressed review units without promotion', () => {
    const run = runAxiomRealDataScaleUpIntegrationRun();

    expect(run.hypothesisReviewCoverage).toMatchObject({
      reviewScale: 'compressed_framework_units_not_individual_hypotheses',
      appliesTo: 'all_pilot_and_scale_up_packet_hypotheses',
      compressedReviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
      reviewStatus: 'routed_to_human_review_packet_promotion_not_moved',
    });
    expect(run.reviewPromotionPacket).toMatchObject({
      objectType: 'axiom_kernel_review_promotion_packet',
      sourceBatchRunId: 'axiom_real_data_scale_up_integrated_kernel_build_batch_run_v0_2026_06_08',
      reviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
      blockedDecisionStatus: {
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        publicRelease: 'not_approved',
        learningUpdate: 'not_promoted',
        knowledgePromotion: 'not_promoted',
      },
    });
    expect(run.dataImperfectionPolicy).toMatchObject({
      admissionStance:
        'incomplete_partial_or_biased_data_is_admissible_as_reality_shadow_not_as_validity',
      gateType: 'overclaim_gate_not_perfection_gate',
    });
    expect(run.notNow).toEqual(
      expect.arrayContaining([
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_movement',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
      ]),
    );
  });

  it('rejects scale-up runs that drift from manifest-ready units or fail L3 eval', () => {
    const run = cloneRun(runAxiomRealDataScaleUpIntegrationRun());

    run.scaleUpPacketMappings[0].sourceIntakeUnitId =
      'intake_pilot_cr01_health_time_life_security';
    run.evalReports[0].status = 'needs_repair';
    run.status = 'failed_real_data_scale_up_integration_run';

    const validation = validateAxiomRealDataScaleUpIntegrationRun(run);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'scale_up_mapping_must_use_manifest_ready_unit:intake_pilot_cr01_health_time_life_security',
        `l3_eval_must_pass:${run.evalReports[0].scenarioId}`,
      ]),
    );
  });
});
