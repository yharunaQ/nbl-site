import {
  AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY,
  buildAxiomHumanReviewPacket,
  buildDefaultAxiomHumanReviewPacket,
  validateAxiomHumanReviewPacket,
  type AxiomHumanReviewPacket,
} from '@/lib/axiom/humanReviewLoopContract';
import { buildDefaultAxiomSitePreviewData } from '@/lib/axiom/sitePreviewData';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePacket(packet: AxiomHumanReviewPacket): AxiomHumanReviewPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomHumanReviewPacket;
}

describe('Axiom human review loop contract', () => {
  it('builds framework-level review units from the internal preview data', () => {
    const previewData = buildDefaultAxiomSitePreviewData();
    const packet = buildAxiomHumanReviewPacket(previewData);
    const validation = validateAxiomHumanReviewPacket(packet, previewData);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY,
      coreProgressClass: 'kernel_human_review_loop',
    });
    expect(packet).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_human_review_loop',
      status: 'framework_level_review_packet_prepared_internal_only',
      boundary: AXIOM_HUMAN_REVIEW_LOOP_BOUNDARY,
      maxCoreReviewUnits: 100,
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        knowledgePromotion: 'not_promoted',
        learningUpdate: 'not_updated',
      },
    });
    expect(packet.unitCount).toBe(11);
    expect(packet.unitCount).toBeLessThanOrEqual(packet.maxCoreReviewUnits);
    expect(
      packet.units.every(
        (unit) => unit.unitScale === 'framework_or_surface_unit_not_instance_hypothesis',
      ),
    ).toBe(true);
  });

  it('creates one kernel unit, one cross-surface unit, and one unit per fixed surface', () => {
    const packet = buildDefaultAxiomHumanReviewPacket();
    const surfaceUnitIds = packet.units
      .filter((unit) => unit.unitType === 'surface_slot_review')
      .map((unit) => unit.surface);

    expect(packet.units.filter((unit) => unit.unitType === 'kernel_contract_review')).toHaveLength(
      1,
    );
    expect(
      packet.units.filter((unit) => unit.unitType === 'cross_surface_boundary_review'),
    ).toHaveLength(1);
    expect(surfaceUnitIds).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
  });

  it('blocks publication, validity, runtime approval, candidate pattern, and learning updates', () => {
    const packet = buildDefaultAxiomHumanReviewPacket();

    for (const unit of packet.units) {
      expect(unit.reviewBlocks).toEqual(
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
      expect(unit.doesNotBlock).toEqual(
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
      expect(unit.approvalEffect).toBe(
        'does_not_approve_publication_runtime_source_support_or_learning',
      );
    }
  });

  it('rejects packets that exceed 100 units or move approval state', () => {
    const previewData = buildDefaultAxiomSitePreviewData();
    const packet = clonePacket(buildAxiomHumanReviewPacket(previewData));
    const firstUnit = packet.units[0];

    packet.units = Array.from({ length: 101 }, (_, index) => ({
      ...firstUnit,
      unitId: `review_unit_${index}`,
    }));
    packet.unitCount = packet.units.length;
    packet.movementBoundary.publicApproved =
      'approved' as unknown as AxiomHumanReviewPacket['movementBoundary']['publicApproved'];

    const validation = validateAxiomHumanReviewPacket(packet, previewData);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'unit_count_must_not_exceed_100',
        'review_packet_must_not_move_approval_validity_promotion_or_learning',
      ]),
    );
  });
});
