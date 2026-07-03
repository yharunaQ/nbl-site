import {
  AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY,
  buildAxiomKernelCorpusHumanReviewPacket,
  validateAxiomKernelCorpusHumanReviewPacket,
  type AxiomKernelCorpusHumanReviewPacket,
} from '@/lib/axiom/kernelCorpusHumanReviewPacket';
import { buildAxiomKernelCorpusReviewReadoutAdapter } from '@/lib/axiom/kernelCorpusReviewReadoutAdapter';

function clonePacket(
  packet: AxiomKernelCorpusHumanReviewPacket,
): AxiomKernelCorpusHumanReviewPacket {
  return JSON.parse(JSON.stringify(packet)) as AxiomKernelCorpusHumanReviewPacket;
}

describe('Axiom kernel corpus human-review packet', () => {
  it('builds a readable human-review packet from the 15-item kernel corpus without executing review', () => {
    const adapter = buildAxiomKernelCorpusReviewReadoutAdapter();
    const packet = buildAxiomKernelCorpusHumanReviewPacket(adapter);
    const validation = validateAxiomKernelCorpusHumanReviewPacket(packet, adapter);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_human_review_packet_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_PACKET_BOUNDARY,
    });
    expect(packet).toMatchObject({
      objectType: 'axiom_kernel_corpus_human_review_packet',
      lane: 'Falcon Lab',
      status: 'compressed_human_review_packet_prepared_not_executed',
      totalKernelRows: 15,
      maxCoreHumanReviewUnits: 100,
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      reviewResultStatus: 'not_recorded',
      sourceFamilyCoverage: {
        coreEligibleSourceFamilyCount: 10,
        representedCoreEligibleSourceFamilyCount: 10,
        deliveryLayerExcludedCount: 1,
      },
      rowCoverage: {
        coveredRowCount: 15,
        totalRowCount: 15,
        scenarioCount: 5,
      },
    });
    expect(packet.unitCount).toBe(adapter.reviewUnitIndex.length + 2);
    expect(packet.unitCount).toBeLessThanOrEqual(packet.maxCoreHumanReviewUnits);
  });

  it('compresses all rows into review units plus source-family and cross-corpus checklist units', () => {
    const packet = buildAxiomKernelCorpusHumanReviewPacket();
    const sourceFamilyUnit = packet.units.find(
      (unit) => unit.unitType === 'source_family_coverage_review',
    );
    const crossBoundaryUnit = packet.units.find(
      (unit) => unit.unitType === 'cross_corpus_boundary_review',
    );

    expect(sourceFamilyUnit).toMatchObject({
      reviewScale: 'source_family_set_not_individual_source',
      rowCount: 15,
    });
    expect(crossBoundaryUnit).toMatchObject({
      reviewScale: 'cross_corpus_boundary_not_public_release',
      rowCount: 15,
    });
    expect(packet.sourceFamilyCoverage.sourceFamilyEntryIds).toEqual(
      expect.arrayContaining([
        'source_family_respondent_surveys_3000_4000',
        'source_family_supporter_practice',
        'source_family_workplace_surveys',
        'source_family_workshop_practice_knowledge',
        'source_family_domestic_web_cache',
        'source_family_international_web_cache',
        'source_family_historical_2001_abc',
        'source_family_stage1_scima_fchma_derived',
        'source_family_l3_ft03_review_frames',
        'source_family_manuals_and_documents',
      ]),
    );
    expect(
      packet.units.some((unit) =>
        unit.readableChecklist.some(
          (item) => item.checkId === 'reality_shadow_use_without_perfection_requirement',
        ),
      ),
    ).toBe(true);
    expect(
      crossBoundaryUnit?.readableChecklist.some(
        (item) => item.checkId === 'delivery_layer_excluded_from_core_truth',
      ),
    ).toBe(true);
  });

  it('keeps source/support validity, public approval, runtime, promotion, and learning blocked', () => {
    const packet = buildAxiomKernelCorpusHumanReviewPacket();

    expect(packet.movementBoundary).toMatchObject({
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      sourceValidity: 'not_decided',
      supportValidity: 'not_decided',
      candidatePattern: 'not_candidate_pattern',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      publicRelease: 'not_approved',
      publication: 'not_published',
      knowledgePromotion: 'not_promoted',
      learningUpdate: 'not_promoted',
    });
    expect(packet.notNow).toEqual(
      expect.arrayContaining([
        'no_human_review_execution_by_codex',
        'no_reviewer_assignment_by_codex',
        'no_source_or_support_validity_decision',
        'no_public_page_filling_from_unpromoted_kernel',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
    for (const unit of packet.units) {
      expect(unit.reviewExecutionStatus).toBe('not_executed');
      expect(unit.reviewerAssignmentStatus).toBe('not_assigned_by_codex');
      expect(unit.reviewResultStatus).toBe('not_recorded');
      expect(unit.currentUseAllowed).toBe('internal_kernel_display_and_review_navigation_only');
      expect(unit.approvalEffect).toBe(
        'does_not_approve_source_support_validity_public_use_runtime_or_learning',
      );
      expect(
        unit.readableChecklist.every(
          (item) => item.completionStatus === 'unchecked_review_required_outside_codex',
        ),
      ).toBe(true);
    }
  });

  it('rejects packets that lose compressed units, complete review, or move public/promotion boundaries', () => {
    const adapter = buildAxiomKernelCorpusReviewReadoutAdapter();
    const packet = clonePacket(buildAxiomKernelCorpusHumanReviewPacket(adapter));

    packet.units = packet.units.slice(1);
    packet.unitCount = packet.units.length;
    packet.reviewExecutionStatus = 'executed' as unknown as 'not_executed';
    packet.sourceFamilyCoverage.sourceFamilyEntryIds =
      packet.sourceFamilyCoverage.sourceFamilyEntryIds.filter(
        (entryId) => entryId !== 'source_family_manuals_and_documents',
      );
    packet.units[0].readableChecklist[0].completionStatus =
      'completed' as unknown as 'unchecked_review_required_outside_codex';
    packet.movementBoundary.publicRelease =
      'approved' as unknown as 'not_approved';
    packet.notNow = packet.notNow.filter(
      (item) => item !== 'no_human_review_execution_by_codex',
    );

    const validation = validateAxiomKernelCorpusHumanReviewPacket(packet, adapter);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'human_review_packet_unit_count_must_match_compressed_units_plus_two_and_stay_under_100',
        'human_review_packet_must_not_execute_assign_or_record_review_result',
        'source_family_coverage_must_show_10_represented_and_1_delivery_excluded',
        'source_family_missing_from_human_review_packet:source_family_manuals_and_documents',
        expect.stringContaining('compressed_review_unit_missing:'),
        expect.stringContaining('unit_checklist_must_remain_unchecked:'),
        'human_review_packet_must_not_move_validity_public_promotion_or_learning',
        'human_review_packet_not_now_must_block_review_execution_validity_runtime_public_and_learning',
      ]),
    );
  });
});
