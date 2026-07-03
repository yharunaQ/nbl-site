import {
  AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
  buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch,
  validateAxiomKernelReviewPromotionPacket,
  type AxiomKernelReviewPromotionPacket,
} from '@/lib/axiom/interactionHypothesisKernelReviewPromotionPacket';
import { runAxiomRealDerivedEvidenceKernelBuildBatch } from '@/lib/axiom/interactionHypothesisKernelRealDerivedEvidenceProtocol';

function clonePacket(packet: AxiomKernelReviewPromotionPacket): AxiomKernelReviewPromotionPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomKernelReviewPromotionPacket;
}

describe('Axiom kernel review-driven promotion packet', () => {
  it('builds promotion review units from the real-derived grounded kernel batch', () => {
    const batchRun = runAxiomRealDerivedEvidenceKernelBuildBatch();
    const packet = buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch(batchRun);
    const validation = validateAxiomKernelReviewPromotionPacket(packet, batchRun);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'review_promotion_packet_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
      coreProgressClass: 'kernel_human_review_loop',
    });
    expect(packet).toMatchObject({
      objectType: 'axiom_kernel_review_promotion_packet',
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_human_review_loop',
      status: 'review_packet_prepared_promotion_not_moved',
      boundary: AXIOM_KERNEL_REVIEW_PROMOTION_PACKET_BOUNDARY,
      reviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
      sourcePacketIds: [
        'axiom_real_derived_evidence_packet_cr01_health_time_v0_2026_06_08',
        'axiom_real_derived_evidence_packet_jeed_policy_service_coordination_v0_2026_06_08',
        'axiom_real_derived_evidence_packet_jeed_disclosure_procedure_v0_2026_06_08',
        'axiom_real_derived_evidence_packet_ftcodex03_supporter_workplace_quality_v0_2026_06_08',
        'axiom_real_derived_evidence_packet_public_condition_window_non_lookup_v0_2026_06_08',
      ],
      sourceScenarioIds: [
        'l3_health_time_accommodation_lookup_trap_v0',
        'l3_policy_service_coordination_source_lens_v0',
        'l3_disclosure_information_procedure_boundary_v0',
        'l3_post_hiring_quality_evaluation_loop_v0',
        'l3_public_condition_window_non_lookup_v0',
      ],
    });
    expect(packet.promotionUnits).toHaveLength(8);
    expect(packet.reviewUnitCount).toBeLessThanOrEqual(packet.maxCoreHumanReviewUnits);
    expect(
      packet.promotionUnits.every(
        (unit) => unit.reviewScale === 'compressed_framework_unit_not_individual_hypothesis',
      ),
    ).toBe(true);
  });

  it('keeps promotion blocked while allowing provisional kernel work', () => {
    const batchRun = runAxiomRealDerivedEvidenceKernelBuildBatch();
    const packet = buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch(batchRun);

    expect(packet.blockedDecisionStatus).toMatchObject({
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      publicRelease: 'not_approved',
      learningUpdate: 'not_promoted',
      knowledgePromotion: 'not_promoted',
    });
    expect(packet.provisionalWorkAllowed).toEqual(
      expect.arrayContaining([
        'provisional_hypothesis_generation',
        'counter_hypothesis_generation',
        'missing_context_question_generation',
        'actionability_band_classification',
        'non_sensitive_scenario_evaluation',
        'deterministic_kernel_logic_improvement',
        'kernel_object_display_ui',
        'review_packet_preparation_from_labeled_provisional_objects',
      ]),
    );

    for (const unit of packet.promotionUnits) {
      expect(unit.requiresHumanReview).toBe(true);
      expect(unit.currentUseAllowed).toBe(
        'internal_provisional_kernel_build_grounding_eval_display_only',
      );
      expect(unit.promotionRoute).toBe(
        'requires_human_review_before_source_support_validity_candidate_pattern_runtime_public_or_learning',
      );
      expect(unit.blocks).toEqual(
        expect.arrayContaining([
          'public_release',
          'source_validity',
          'support_validity',
          'candidate_pattern',
          'runtime_approved',
          'public_approved',
          'outcome_learning_update',
        ]),
      );
    }
  });

  it('maps compressed review units to the kernel fields that review must inspect', () => {
    const packet = buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch();
    const sourceLensUnit = packet.promotionUnits.find(
      (unit) => unit.sourceUnitType === 'source_lens_status',
    );
    const actorUnit = packet.promotionUnits.find(
      (unit) => unit.sourceUnitType === 'implementation_actor_conditions',
    );
    const promotionGateUnit = packet.promotionUnits.find(
      (unit) => unit.sourceUnitType === 'review_driven_promotion_gate',
    );

    expect(sourceLensUnit?.kernelFieldsInScope).toEqual(['sourceLensStatus', 'missingContext']);
    expect(actorUnit?.kernelFieldsInScope).toEqual([
      'implementationActorConditions',
      'missingContext',
    ]);
    expect(promotionGateUnit?.kernelFieldsInScope).toEqual(['humanReviewRoute']);
  });

  it('rejects review packets that pretend human review or promotion has moved', () => {
    const batchRun = runAxiomRealDerivedEvidenceKernelBuildBatch();
    const packet = clonePacket(buildAxiomKernelReviewPromotionPacketFromRealDerivedBatch(batchRun));

    packet.promotionUnits[0].requiresHumanReview = false as unknown as true;
    packet.promotionUnits[0].blockedDecisionStatus.sourceValidity =
      'decided' as unknown as AxiomKernelReviewPromotionPacket['blockedDecisionStatus']['sourceValidity'];
    packet.movementBoundary.publicRelease =
      'approved' as unknown as AxiomKernelReviewPromotionPacket['movementBoundary']['publicRelease'];

    const validation = validateAxiomKernelReviewPromotionPacket(packet, batchRun);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'unit_must_require_human_review:promotion_review_unit_kernel_contract',
        'unit_must_not_move_blocked_decisions:promotion_review_unit_kernel_contract',
        'movement_boundary_must_not_move_validity_approval_promotion_or_learning',
      ]),
    );
  });
});
