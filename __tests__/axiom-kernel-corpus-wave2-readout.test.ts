import {
  AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY,
  buildAxiomKernelCorpusWave2Readout,
  validateAxiomKernelCorpusWave2Readout,
  type AxiomKernelCorpusWave2Readout,
} from '@/lib/axiom/kernelCorpusWave2Readout';
import { AXIOM_KERNEL_GROUNDED_FIELDS } from '@/lib/axiom/interactionHypothesisKernelBuildGroundingContract';

function cloneReadout(readout: AxiomKernelCorpusWave2Readout): AxiomKernelCorpusWave2Readout {
  return JSON.parse(JSON.stringify(readout)) as AxiomKernelCorpusWave2Readout;
}

describe('Axiom kernel corpus wave2 expanded readout', () => {
  it('projects the validated wave2 packets into a 14-item internal kernel corpus readout', () => {
    const readout = buildAxiomKernelCorpusWave2Readout();
    const validation = validateAxiomKernelCorpusWave2Readout(readout);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_wave2_readout_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_WAVE2_READOUT_BOUNDARY,
    });
    expect(readout).toMatchObject({
      objectType: 'axiom_kernel_corpus_wave2_expanded_readout',
      lane: 'Falcon Lab',
      status: 'expanded_internal_kernel_corpus_readout_ready',
      baseReadoutId: 'axiom_kernel_corpus_readout_v0_2026_06_08',
      wave2AttachmentId: 'axiom_source_family_scale_up_wave2_attachment_v0_2026_06_08',
      basePacketCount: 8,
      wave2PacketCount: 6,
      totalPacketCount: 14,
      scenarioCount: 5,
      totalReviewNavigationUnitCount: 16,
      maxCoreHumanReviewUnits: 100,
    });
    expect(readout.corpusItems).toHaveLength(14);
    expect(readout.wave2CoverageUpdates).toHaveLength(6);
  });

  it('keeps every expanded corpus item grounded, evaluated, review-routed, and internal-only', () => {
    const readout = buildAxiomKernelCorpusWave2Readout();

    expect(readout.aggregate.evalPassingItemCount).toBe(14);
    expect(readout.aggregate.internalDisplayOnlyItemCount).toBe(14);
    expect(readout.aggregate.wave2IntegratedFamilyCount).toBe(6);
    for (const item of readout.corpusItems) {
      expect(item.evalStatus).toBe('passes');
      expect(item.currentUseAllowed).toBe('internal_kernel_display_and_review_navigation_only');
      expect(item.reviewUnitIds.length).toBeGreaterThan(0);
      expect(item.groundedFields).toEqual(expect.arrayContaining([...AXIOM_KERNEL_GROUNDED_FIELDS]));
      expect(item.sourceFamilyEntryIds.length).toBeGreaterThan(0);
      expect(item.cannotYetSay.length).toBeGreaterThan(0);
    }
  });

  it('marks the six second-wave source families as integrated pending review, not promoted truth', () => {
    const readout = buildAxiomKernelCorpusWave2Readout();

    expect(readout.wave2CoverageUpdates.map((update) => update.sourceFamilyEntryId)).toEqual([
      'source_family_respondent_surveys_3000_4000',
      'source_family_supporter_practice',
      'source_family_workplace_surveys',
      'source_family_workshop_practice_knowledge',
      'source_family_historical_2001_abc',
      'source_family_international_web_cache',
    ]);
    expect(
      readout.wave2CoverageUpdates.every(
        (update) =>
          update.priorCoverageRole === 'next_wave_kernel_grounding_candidate' &&
          update.projectedCoverageRole === 'wave2_integrated_kernel_grounding_pending_review',
      ),
    ).toBe(true);
    expect(readout.notNow).toEqual(
      expect.arrayContaining([
        'no_public_page_filling_from_unpromoted_kernel',
        'no_source_or_support_validity_decision',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects readouts that lose wave2 packets, review routes, or public/runtime brakes', () => {
    const readout = cloneReadout(buildAxiomKernelCorpusWave2Readout());

    readout.corpusItems = readout.corpusItems.slice(0, 13);
    readout.totalPacketCount = 13;
    readout.corpusItems[0].evalStatus = 'needs_repair';
    readout.corpusItems[1].reviewUnitIds = [];
    readout.notNow = readout.notNow.filter(
      (item) => item !== 'no_source_or_support_validity_decision',
    );

    const validation = validateAxiomKernelCorpusWave2Readout(readout);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'wave2_readout_must_project_14_total_kernel_items',
        expect.stringContaining('wave2_packet_missing_from_expanded_readout:'),
        expect.stringContaining('corpus_item_eval_must_pass:'),
        expect.stringContaining('corpus_item_missing_review_route:'),
        'wave2_readout_not_now_must_block_validity_runtime_public_and_learning',
      ]),
    );
  });
});
