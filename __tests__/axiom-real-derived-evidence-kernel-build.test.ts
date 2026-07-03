import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { evaluateAxiomInteractionHypothesisKernelAgainstScenario } from '@/lib/axiom/interactionHypothesisKernelEvaluator';
import {
  buildAllAxiomRealDerivedEvidencePacketFixtures,
  buildAxiomRealDerivedFtCodex03SupporterWorkplaceEvidencePacketFixture,
  buildAxiomRealDerivedHealthTimeEvidencePacketFixture,
  buildAxiomRealDerivedJeedDisclosureProcedureEvidencePacketFixture,
  buildAxiomRealDerivedJeedPolicyServiceEvidencePacketFixture,
  buildAxiomRealDerivedPublicConditionWindowEvidencePacketFixture,
  runAxiomRealDerivedEvidenceKernelBuild,
  runAxiomRealDerivedEvidenceKernelBuildBatch,
  validateAxiomRealDerivedEvidencePacket,
  type AxiomRealDerivedEvidencePacket,
} from '@/lib/axiom/interactionHypothesisKernelRealDerivedEvidenceProtocol';

type FalconCoreEvalProfile = {
  scenario_fixtures: Parameters<typeof evaluateAxiomInteractionHypothesisKernelAgainstScenario>[1][];
};

function loadJsonEvidencePacketFixture(): AxiomRealDerivedEvidencePacket {
  return JSON.parse(
    readFileSync(
      path.join(
        process.cwd(),
        'data/specs/axiom/axiom_real_derived_health_time_evidence_packet.fixture-v0-2026-06-08.json',
      ),
      'utf8',
    ),
  ) as AxiomRealDerivedEvidencePacket;
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

function loadHealthTimeScenario() {
  return loadScenario('l3_health_time_accommodation_lookup_trap_v0');
}

function loadScenario(scenarioId: string) {
  const scenario = loadFalconCoreEvalProfile().scenario_fixtures.find(
    (candidate) => candidate.id === scenarioId,
  );

  if (!scenario) {
    throw new Error(`scenario_missing:${scenarioId}`);
  }

  return scenario;
}

function sourceText(uri: string): string {
  return readFileSync(path.join(process.cwd(), uri), 'utf8');
}

function clonePacket(
  packet: AxiomRealDerivedEvidencePacket = buildAxiomRealDerivedHealthTimeEvidencePacketFixture(),
): AxiomRealDerivedEvidencePacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomRealDerivedEvidencePacket;
}

describe('Axiom real-derived evidence kernel build protocol', () => {
  it('keeps the checked-in real-derived evidence packet aligned with the typed fixture', () => {
    const jsonPacket = loadJsonEvidencePacketFixture();
    const typedPacket = buildAxiomRealDerivedHealthTimeEvidencePacketFixture();
    const validation = validateAxiomRealDerivedEvidencePacket(jsonPacket);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_derived_evidence_packet_valid',
      errorCount: 0,
    });
    expect(jsonPacket.packetId).toBe(typedPacket.packetId);
    expect(jsonPacket.dataPolicy).toMatchObject({
      inputLayer: 'references_derived_and_docs_only',
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      containsSensitiveRawText: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
    });
    expect(jsonPacket.observationCandidates.map((observation) => observation.id)).toEqual(
      typedPacket.observationCandidates.map((observation) => observation.id),
    );
  });

  it('anchors the packet to existing derived artifacts without opening raw source text', () => {
    const packet = loadJsonEvidencePacketFixture();

    for (const source of packet.sourceFoundationRefs) {
      expect(existsSync(path.join(process.cwd(), source.uri))).toBe(true);
      expect(source.containsSensitiveRawText).toBe(false);
      expect(source.allowedAsAxiomCoreTruth).toBe(false);
      expect(source.requiresAxiomEval).toBe(true);
    }

    const cr01 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.md',
    );
    const l3 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
    );
    const ft03 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft03-internal-expert-agent-response-contract-v0-2026-05-25.md',
    );
    const audit = sourceText(
      'docs/nbl-workspace/falcon-expert-agent-core-weakness-audit-and-v2-rebuild-2026-06-07.md',
    );

    expect(cr01).toContain('raw_original_opened: False');
    expect(cr01).toContain('source_text_exported: False');
    expect(cr01).toContain('health_time');
    expect(l3).toContain('L3-PIP-01');
    expect(l3).toContain('L3-CCA-22');
    expect(ft03).toContain('V1 健康時間と働き方');
    expect(audit).toContain('interaction-hypothesis kernel');
  });

  it('runs the real-derived non-sensitive packet through grounded kernel build', () => {
    const run = runAxiomRealDerivedEvidenceKernelBuild(loadJsonEvidencePacketFixture());
    const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      loadHealthTimeScenario(),
      '2026-06-08T00:00:00.000Z',
    );

    expect(run).toMatchObject({
      objectType: 'axiom_real_derived_evidence_kernel_build_run',
      lane: 'Falcon Lab',
      status: 'passed_real_derived_non_sensitive_kernel_build',
    });
    expect(run.evidencePacketValidation.valid).toBe(true);
    expect(run.validation.valid).toBe(true);
    expect(run.buildGroundingPacket.kernel).toMatchObject({
      kernelId: 'axiom_kernel_real_derived_cr01_health_time_v0_2026_06_08',
      inputMode: 'evidence_foundation_fixture',
      coreProgressClass: 'kernel_build',
      actionabilityBand: 'usable_provisional_insight',
    });
    expect(run.buildGroundingPacket.kernel.observation[0].text).toContain('CR01 derived');
    expect(run.buildGroundingPacket.kernel.observation[0].text).not.toContain(
      'synthetic worker',
    );
    expect(run.buildGroundingPacket.groundingMap.groundingLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_cr01_context_counts',
          evidenceSpanIds: ['span_cr01_health_time_context_counts'],
        }),
        expect.objectContaining({
          kernelField: 'inference',
          kernelItemId: 'inf_real_health_time_work_design_kernel',
        }),
        expect.objectContaining({
          kernelField: 'counterHypothesis',
          kernelItemId: 'counter_real_health_time_life_security_sequence',
        }),
      ]),
    );
    expect(evalReport.status).toBe('passes');
    expect(evalReport.failedCheckCount).toBe(0);
  });

  it('keeps real-derived review compression below the 100-unit budget', () => {
    const run = runAxiomRealDerivedEvidenceKernelBuild();

    expect(run.reviewUnitCompression).toMatchObject({
      objectType: 'axiom_kernel_build_grounding_review_unit_compression',
      coreProgressClass: 'kernel_human_review_loop',
      packetCount: 1,
      scenarioCount: 1,
      reviewUnitScale: 'compressed_framework_units_not_individual_hypotheses',
      maxCoreHumanReviewUnits: 100,
    });
    expect(run.reviewUnitCompression.estimatedCoreReviewUnits).toBeLessThanOrEqual(100);
    expect(run.reviewUnitCompression.units.length).toBe(8);
    expect(run.reviewUnitCompression.blockedDecisionStatus).toMatchObject({
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
    });
  });

  it('builds a second real-derived JEED policy/service packet from derived reading cards', () => {
    const packet = buildAxiomRealDerivedJeedPolicyServiceEvidencePacketFixture();
    const validation = validateAxiomRealDerivedEvidencePacket(packet);
    const jeedCards = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
    );
    const l3 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_derived_evidence_packet_valid',
      errorCount: 0,
    });
    expect(packet).toMatchObject({
      packetId: 'axiom_real_derived_evidence_packet_jeed_policy_service_coordination_v0_2026_06_08',
      lane: 'Falcon Lab',
      scenarioId: 'l3_policy_service_coordination_source_lens_v0',
      actionabilityBand: 'question_first_only',
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
    expect(jeedCards).toContain('stage1-web-cache-deep-reading:jeed_reference:01fe0b103b8f');
    expect(jeedCards).toContain('"source_text_exported": false');
    expect(jeedCards).toContain(
      'web_cache_deep_reading_candidate_unreviewed_no_promotion_no_runtime_approval',
    );
    expect(l3).toContain('L3-PIP-11');
    expect(l3).toContain('L3-PIP-12');
    expect(l3).toContain('L3-PIP-14');
    expect(l3).toContain('L3-PIP-21');
    expect(l3).toContain('L3-CCA-25');
  });

  it('runs the JEED policy/service packet through the same grounded kernel build and L3 eval', () => {
    const run = runAxiomRealDerivedEvidenceKernelBuild(
      buildAxiomRealDerivedJeedPolicyServiceEvidencePacketFixture(),
    );
    const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      loadScenario('l3_policy_service_coordination_source_lens_v0'),
      '2026-06-08T00:00:00.000Z',
    );

    expect(run).toMatchObject({
      objectType: 'axiom_real_derived_evidence_kernel_build_run',
      lane: 'Falcon Lab',
      status: 'passed_real_derived_non_sensitive_kernel_build',
    });
    expect(run.evidencePacketValidation.valid).toBe(true);
    expect(run.validation.valid).toBe(true);
    expect(run.buildGroundingPacket.kernel).toMatchObject({
      kernelId: 'axiom_kernel_real_derived_jeed_policy_service_coordination_v0_2026_06_08',
      inputMode: 'evidence_foundation_fixture',
      coreProgressClass: 'kernel_build',
      actionabilityBand: 'question_first_only',
    });
    expect(run.buildGroundingPacket.kernel.sourceLensStatus).toMatchObject({
      respondent_data: { status: 'thin_or_missing' },
      supporter_data: { status: 'thin_or_missing' },
      external_evidence: { status: 'bootstrap_prior_only' },
      implementation_actor_conditions: { status: 'present_in_evidence_foundation_fixture' },
    });
    expect(run.buildGroundingPacket.groundingMap.groundingLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_jeed_regional_network_translation',
          evidenceSpanIds: ['span_jeed_regional_network_translation_window'],
        }),
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_jeed_source_identity_boundary',
          evidenceSpanIds: ['span_jeed_coordination_counter_window'],
        }),
        expect.objectContaining({
          kernelField: 'inference',
          kernelItemId: 'inf_real_jeed_policy_service_coordination_kernel',
        }),
      ]),
    );
    expect(evalReport.status).toBe('passes');
    expect(evalReport.failedCheckCount).toBe(0);
  });

  it('runs the JEED disclosure/procedure packet through the same grounded kernel build and L3 eval', () => {
    const run = runAxiomRealDerivedEvidenceKernelBuild(
      buildAxiomRealDerivedJeedDisclosureProcedureEvidencePacketFixture(),
    );
    const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      loadScenario('l3_disclosure_information_procedure_boundary_v0'),
      '2026-06-08T00:00:00.000Z',
    );
    const jeedCards = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl',
    );
    const l3 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
    );

    expect(run).toMatchObject({
      objectType: 'axiom_real_derived_evidence_kernel_build_run',
      lane: 'Falcon Lab',
      status: 'passed_real_derived_non_sensitive_kernel_build',
    });
    expect(run.evidencePacketValidation.valid).toBe(true);
    expect(run.validation.valid).toBe(true);
    expect(run.buildGroundingPacket.kernel).toMatchObject({
      kernelId: 'axiom_kernel_real_derived_jeed_disclosure_procedure_v0_2026_06_08',
      inputMode: 'evidence_foundation_fixture',
      coreProgressClass: 'kernel_build',
      actionabilityBand: 'question_first_only',
    });
    expect(jeedCards).toContain('stage1-web-cache-deep-reading:jeed_reference:156fe85fe4cf');
    expect(jeedCards).toContain('"source_text_exported": false');
    expect(l3).toContain('L3-PIP-10');
    expect(l3).toContain('L3-PIP-13');
    expect(l3).toContain('L3-PIP-17');
    expect(l3).toContain('L3-PIP-18');
    expect(l3).toContain('L3-CCA-26');
    expect(run.buildGroundingPacket.groundingMap.groundingLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_jeed_work_procedure_decomposition',
          evidenceSpanIds: ['span_jeed_work_procedure_decomposition_window'],
        }),
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_jeed_disclosure_translation_boundary',
          evidenceSpanIds: ['span_jeed_disclosure_translation_counter_window'],
        }),
        expect.objectContaining({
          kernelField: 'inference',
          kernelItemId: 'inf_real_jeed_disclosure_procedure_kernel',
        }),
      ]),
    );
    expect(evalReport.status).toBe('passes');
    expect(evalReport.failedCheckCount).toBe(0);
  });

  it('runs the FT-Codex-03 supporter/workplace packet through grounded kernel build and L3 eval', () => {
    const run = runAxiomRealDerivedEvidenceKernelBuild(
      buildAxiomRealDerivedFtCodex03SupporterWorkplaceEvidencePacketFixture(),
    );
    const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      loadScenario('l3_post_hiring_quality_evaluation_loop_v0'),
      '2026-06-08T00:00:00.000Z',
    );
    const summary = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
    );
    const network = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md',
    );
    const l3 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
    );

    expect(run).toMatchObject({
      objectType: 'axiom_real_derived_evidence_kernel_build_run',
      lane: 'Falcon Lab',
      status: 'passed_real_derived_non_sensitive_kernel_build',
    });
    expect(run.evidencePacketValidation.valid).toBe(true);
    expect(run.validation.valid).toBe(true);
    expect(run.buildGroundingPacket.kernel).toMatchObject({
      kernelId: 'axiom_kernel_real_derived_ftcodex03_supporter_workplace_quality_v0_2026_06_08',
      inputMode: 'evidence_foundation_fixture',
      coreProgressClass: 'kernel_build',
      actionabilityBand: 'question_first_only',
      sourceLensStatus: {
        supporter_data: { status: 'present_in_evidence_foundation_fixture' },
      },
    });
    expect(summary).toContain('Status: Codex high context-reading complete / no text export / no promotion / unreviewed');
    expect(summary).toContain("source_family_counts: {'supporter': 9, 'workplace': 9");
    expect(network).toContain('Support continuity becomes the retranslation spine');
    expect(network).toContain('Do not equate support presence, meeting presence, referral, or network naming with continuity.');
    expect(l3).toContain('L3-PIP-06');
    expect(l3).toContain('L3-PIP-19');
    expect(l3).toContain('L3-PIP-20');
    expect(l3).toContain('L3-PIP-21');
    expect(l3).toContain('L3-CCA-24');
    expect(run.buildGroundingPacket.groundingMap.groundingLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_ftcodex03_supporter_translation_capacity',
          evidenceSpanIds: ['span_ftcodex03_supporter_retranslation_capacity'],
        }),
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_ftcodex03_workplace_quality_contact',
          evidenceSpanIds: ['span_ftcodex03_workplace_quality_contact_window'],
        }),
        expect.objectContaining({
          kernelField: 'inference',
          kernelItemId: 'inf_real_ftcodex03_post_hiring_quality_kernel',
        }),
      ]),
    );
    expect(evalReport.status).toBe('passes');
    expect(evalReport.failedCheckCount).toBe(0);
  });

  it('runs the public condition-window non-lookup packet through grounded kernel build and L3 eval', () => {
    const run = runAxiomRealDerivedEvidenceKernelBuild(
      buildAxiomRealDerivedPublicConditionWindowEvidencePacketFixture(),
    );
    const evalReport = evaluateAxiomInteractionHypothesisKernelAgainstScenario(
      run.buildGroundingPacket.kernel,
      loadScenario('l3_public_condition_window_non_lookup_v0'),
      '2026-06-08T00:00:00.000Z',
    );
    const summary = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md',
    );
    const l3 = sourceText(
      'references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-l3-principal-pattern-extraction-v0-2026-05-26.md',
    );

    expect(run).toMatchObject({
      objectType: 'axiom_real_derived_evidence_kernel_build_run',
      lane: 'Falcon Lab',
      status: 'passed_real_derived_non_sensitive_kernel_build',
    });
    expect(run.evidencePacketValidation.valid).toBe(true);
    expect(run.validation.valid).toBe(true);
    expect(run.buildGroundingPacket.kernel).toMatchObject({
      kernelId: 'axiom_kernel_real_derived_public_condition_window_non_lookup_v0_2026_06_08',
      inputMode: 'evidence_foundation_fixture',
      coreProgressClass: 'kernel_build',
      actionabilityBand: 'public_boundary_blocked',
    });
    expect(summary).toContain('病名、障害名、制度カテゴリ、年齢、地域、職場規模は条件窓');
    expect(summary).toContain('単純因果lookupにはしない');
    expect(l3).toContain('L3-PIP-01');
    expect(l3).toContain('L3-PIP-04');
    expect(l3).toContain('L3-PIP-10');
    expect(l3).toContain('L3-PIP-15');
    expect(l3).toContain('L3-PIP-21');
    expect(l3).toContain('L3-CCA-22');
    expect(l3).toContain('L3-CCA-24');
    expect(l3).toContain('L3-CCA-25');
    expect(l3).toContain('L3-CCA-27');
    expect(run.buildGroundingPacket.groundingMap.groundingLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kernelField: 'observation',
          kernelItemId: 'obs_real_public_condition_window_guardrail',
          evidenceSpanIds: ['span_ftcodex03_condition_window_guardrail'],
        }),
        expect.objectContaining({
          kernelField: 'inference',
          kernelItemId: 'inf_real_public_condition_window_non_lookup_kernel',
        }),
        expect.objectContaining({
          kernelField: 'actionabilityBand',
          kernelItemId: 'public_boundary_blocked',
        }),
      ]),
    );
    expect(evalReport.status).toBe('passes');
    expect(evalReport.failedCheckCount).toBe(0);
  });

  it('runs a representative real-derived batch while keeping review units compressed', () => {
    const batchRun = runAxiomRealDerivedEvidenceKernelBuildBatch();
    const packetIds = buildAllAxiomRealDerivedEvidencePacketFixtures().map(
      (packet) => packet.packetId,
    );

    expect(batchRun).toMatchObject({
      objectType: 'axiom_real_derived_evidence_kernel_build_batch_run',
      lane: 'Falcon Lab',
      status: 'passed_real_derived_non_sensitive_kernel_build_batch',
      packetCount: 5,
      scenarioCount: 5,
    });
    expect(batchRun.runs.map((run) => run.evidencePacket.packetId)).toEqual(packetIds);
    expect(batchRun.runs.every((run) => run.validation.valid)).toBe(true);
    expect(batchRun.reviewUnitCompression).toMatchObject({
      objectType: 'axiom_kernel_build_grounding_review_unit_compression',
      coreProgressClass: 'kernel_human_review_loop',
      packetCount: 5,
      scenarioCount: 5,
      reviewUnitScale: 'compressed_framework_units_not_individual_hypotheses',
      maxCoreHumanReviewUnits: 100,
    });
    expect(batchRun.reviewUnitCompression.estimatedCoreReviewUnits).toBeLessThanOrEqual(100);
    expect(batchRun.reviewUnitCompression.units.length).toBe(8);
    expect(batchRun.reviewUnitCompression.blockedDecisionStatus).toMatchObject({
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
    });
  });

  it('rejects real-derived packets that open raw text or move validity', () => {
    const packet = clonePacket();
    packet.dataPolicy.rawOriginalOpened = true as unknown as false;
    packet.evidenceSpans[0].sourceValidity = 'decided' as unknown as 'not_decided';

    const validation = validateAxiomRealDerivedEvidencePacket(packet);
    const run = runAxiomRealDerivedEvidenceKernelBuild(packet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'real_derived_packet_must_not_open_or_export_raw_redacted_or_field_values',
        'span_must_not_move_validity_public_or_promotion:span_cr01_health_time_context_counts',
      ]),
    );
    expect(run.status).toBe('failed_real_derived_kernel_build');
  });
});
