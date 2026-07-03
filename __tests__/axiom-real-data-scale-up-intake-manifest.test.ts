import {
  AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY,
  AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES,
  buildAxiomRealDataScaleUpIntakeManifest,
  validateAxiomRealDataScaleUpIntakeManifest,
  type AxiomRealDataScaleUpIntakeManifest,
} from '@/lib/axiom/realDataScaleUpIntakeManifest';
import { AXIOM_SOURCE_LENSES } from '@/lib/axiom/interactionHypothesisKernelContract';
import { AXIOM_L3_EVAL_SCENARIO_IDS } from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';
import { runAxiomRealDerivedEvidenceKernelBuildBatch } from '@/lib/axiom/interactionHypothesisKernelRealDerivedEvidenceProtocol';

function cloneManifest(
  manifest: AxiomRealDataScaleUpIntakeManifest,
): AxiomRealDataScaleUpIntakeManifest {
  return JSON.parse(JSON.stringify(manifest)) as AxiomRealDataScaleUpIntakeManifest;
}

describe('Axiom real-data scale-up intake manifest', () => {
  it('builds a valid intake manifest from the all-scenario real-derived pilot batch', () => {
    const pilotBatchRun = runAxiomRealDerivedEvidenceKernelBuildBatch();
    const manifest = buildAxiomRealDataScaleUpIntakeManifest(pilotBatchRun);
    const validation = validateAxiomRealDataScaleUpIntakeManifest(manifest, pilotBatchRun);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'scale_up_intake_manifest_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY,
      strengthensCore: AXIOM_REAL_DATA_SCALE_UP_CORE_PROGRESS_CLASSES,
    });
    expect(manifest).toMatchObject({
      objectType: 'axiom_real_data_scale_up_intake_manifest',
      lane: 'Falcon Lab',
      status: 'scale_up_manifest_ready_for_next_kernel_integration_run',
      boundary: AXIOM_REAL_DATA_SCALE_UP_INTAKE_MANIFEST_BOUNDARY,
      prerequisitePilotBatchStatus: 'passed_real_derived_non_sensitive_kernel_build_batch',
    });
    expect(manifest.prerequisiteScenarioCoverage).toEqual(AXIOM_L3_EVAL_SCENARIO_IDS);
    expect(manifest.prerequisitePacketIds).toEqual([
      'axiom_real_derived_evidence_packet_cr01_health_time_v0_2026_06_08',
      'axiom_real_derived_evidence_packet_jeed_policy_service_coordination_v0_2026_06_08',
      'axiom_real_derived_evidence_packet_jeed_disclosure_procedure_v0_2026_06_08',
      'axiom_real_derived_evidence_packet_ftcodex03_supporter_workplace_quality_v0_2026_06_08',
      'axiom_real_derived_evidence_packet_public_condition_window_non_lookup_v0_2026_06_08',
    ]);
    expect(manifest.intakeUnits.length).toBeGreaterThanOrEqual(8);
  });

  it('covers all source lenses and all five L3 scenarios before scale-up execution', () => {
    const manifest = buildAxiomRealDataScaleUpIntakeManifest();
    const coveredLenses = new Set(
      manifest.intakeUnits.flatMap((unit) => unit.requiredSourceLenses),
    );
    const coveredScenarios = new Set(
      manifest.intakeUnits.flatMap((unit) => unit.targetScenarioIds),
    );

    for (const lens of AXIOM_SOURCE_LENSES) {
      expect(coveredLenses.has(lens)).toBe(true);
      expect(manifest.sourceLensCoverage[lens]).toBe('covered_by_ready_or_pilot_unit');
    }
    for (const scenarioId of AXIOM_L3_EVAL_SCENARIO_IDS) {
      expect(coveredScenarios.has(scenarioId)).toBe(true);
      expect(manifest.scenarioCoverage[scenarioId]).toBe(
        'covered_by_pilot_or_scale_up_unit',
      );
    }
  });

  it('keeps every intake unit inside no-raw, no-validity, no-promotion boundaries', () => {
    const manifest = buildAxiomRealDataScaleUpIntakeManifest();

    for (const unit of manifest.intakeUnits) {
      expect(unit.acceptanceCriteria).toEqual(
        expect.arrayContaining([
          'must_use_references_derived_or_docs_only',
          'must_not_open_raw_original_or_redacted_text',
          'must_not_export_source_text_or_field_values',
          'must_not_require_perfect_or_complete_data_for_kernel_build',
          'must_convert_incompleteness_to_kernel_fields_or_explicit_hold',
          'must_build_grounded_axiom_kernel',
          'must_pass_matching_l3_eval_scenario',
          'must_route_to_review_promotion_packet',
          'must_keep_review_units_under_100',
          'must_not_move_source_support_validity_candidate_pattern_runtime_public_or_learning',
        ]),
      );
      expect(unit.noRawOrPromotionBoundary).toMatchObject({
        rawOriginalOpened: false,
        redactedTextExported: false,
        sourceTextExported: false,
        fieldValueExported: false,
        sourceSupportValidityDecision: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        learningUpdate: 'not_promoted',
      });
      expect(unit.holdIf.length).toBeGreaterThan(0);
    }
  });

  it('treats imperfect data as admissible reality-shadow input, not as a reason to thin the core', () => {
    const manifest = buildAxiomRealDataScaleUpIntakeManifest();

    expect(manifest.dataImperfectionPolicy).toMatchObject({
      admissionStance:
        'incomplete_partial_or_biased_data_is_admissible_as_reality_shadow_not_as_validity',
      gateType: 'overclaim_gate_not_perfection_gate',
      perfectionRequirement: 'not_required_for_kernel_build_or_grounding',
      minimumRequirement: 'must_be_convertible_to_grounded_kernel_field_or_explicit_hold',
    });
    expect(manifest.dataImperfectionPolicy.requiredConversionTargets).toEqual(
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
    expect(manifest.dataImperfectionPolicy.prohibitedInterpretation).toEqual(
      expect.arrayContaining([
        'do_not_exclude_partial_or_biased_data_merely_because_it_is_incomplete',
        'do_not_treat_incomplete_data_as_final_fact_support_validity_or_public_guidance',
      ]),
    );

    for (const unit of manifest.intakeUnits) {
      expect(unit.dataImperfectionHandling).toMatchObject({
        incompleteDataAdmissible: true,
        admissionBasis:
          'usable_as_reality_shadow_when_non_sensitive_traceable_and_not_overclaimed',
      });
      expect(unit.dataImperfectionHandling.conversionTargets).toEqual(
        manifest.dataImperfectionPolicy.requiredConversionTargets,
      );
      expect(unit.dataImperfectionHandling.rejectOnlyWhen).toEqual(
        expect.arrayContaining([
          'incompleteness_would_be_hidden_as_source_support_validity_or_public_truth',
        ]),
      );
      expect(unit.dataImperfectionHandling.interpretationRule.length).toBeGreaterThan(20);
    }
  });

  it('treats compressed review units as the review surface for all accepted packet hypotheses', () => {
    const manifest = buildAxiomRealDataScaleUpIntakeManifest();

    expect(manifest.humanReviewCompressionPolicy).toMatchObject({
      reviewScale: 'compressed_framework_units_not_individual_hypotheses',
      maxCoreHumanReviewUnits: 100,
      currentCompressedReviewUnitCount: 8,
      compressionSource: 'real_derived_batch_review_unit_compression',
      appliesToHypothesisSet:
        'all_hypotheses_in_accepted_packets_are_reviewed_via_compressed_framework_units',
    });
    expect(manifest.reviewPromotionPacket).toMatchObject({
      objectType: 'axiom_kernel_review_promotion_packet',
      reviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
    });
    expect(manifest.reviewPromotionPacket.blockedDecisionStatus).toMatchObject({
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
      knowledgePromotion: 'not_promoted',
    });
  });

  it('rejects manifests that open raw data, drop L3 coverage, or move promotion state', () => {
    const pilotBatchRun = runAxiomRealDerivedEvidenceKernelBuildBatch();
    const manifest = cloneManifest(buildAxiomRealDataScaleUpIntakeManifest(pilotBatchRun));

    manifest.prerequisiteScenarioCoverage = manifest.prerequisiteScenarioCoverage.filter(
      (scenarioId) => scenarioId !== 'l3_public_condition_window_non_lookup_v0',
    );
    manifest.intakeUnits[0].noRawOrPromotionBoundary.rawOriginalOpened =
      true as unknown as false;
    manifest.dataImperfectionPolicy.gateType =
      'perfection_gate' as unknown as AxiomRealDataScaleUpIntakeManifest['dataImperfectionPolicy']['gateType'];
    manifest.intakeUnits[0].dataImperfectionHandling.incompleteDataAdmissible =
      false as unknown as true;
    manifest.reviewPromotionPacket.blockedDecisionStatus.candidatePattern =
      'candidate_pattern' as unknown as AxiomRealDataScaleUpIntakeManifest['reviewPromotionPacket']['blockedDecisionStatus']['candidatePattern'];

    const validation = validateAxiomRealDataScaleUpIntakeManifest(manifest, pilotBatchRun);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'pilot_batch_must_cover_all_l3_scenarios_before_scale_up',
        'unit_must_not_open_or_export_raw_redacted_source_or_field_values:intake_pilot_cr01_health_time_life_security',
        'data_imperfection_policy_must_be_overclaim_gate_not_perfection_gate',
        'unit_must_admit_incomplete_data_as_reality_shadow:intake_pilot_cr01_health_time_life_security',
        'review_promotion_packet_must_validate',
      ]),
    );
  });
});
