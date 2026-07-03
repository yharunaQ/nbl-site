import {
  AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY,
  buildAxiomKernelCorpusReadout,
  validateAxiomKernelCorpusReadout,
  type AxiomKernelCorpusReadout,
} from '@/lib/axiom/kernelCorpusReadout';
import { AXIOM_KERNEL_GROUNDED_FIELDS } from '@/lib/axiom/interactionHypothesisKernelBuildGroundingContract';

function cloneReadout(readout: AxiomKernelCorpusReadout): AxiomKernelCorpusReadout {
  return JSON.parse(JSON.stringify(readout)) as AxiomKernelCorpusReadout;
}

describe('Axiom kernel corpus readout', () => {
  it('builds a stable internal corpus readout from the 8-packet integration run and source-family ledger', () => {
    const readout = buildAxiomKernelCorpusReadout();
    const validation = validateAxiomKernelCorpusReadout(readout);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_readout_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_READOUT_BOUNDARY,
    });
    expect(readout).toMatchObject({
      objectType: 'axiom_kernel_corpus_readout',
      lane: 'Falcon Lab',
      status: 'stable_internal_kernel_corpus_readout_ready',
      sourceIntegrationRunId: 'axiom_real_data_scale_up_integration_run_v0_2026_06_08',
      sourceLedgerId: 'axiom_source_family_utilization_ledger_v0_2026_06_08',
      packetCount: 8,
      scenarioCount: 5,
      sourceFamilyEntryCount: 11,
      reviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
    });
    expect(readout.corpusItems).toHaveLength(8);
    expect(readout.reviewNavigation).toHaveLength(8);
  });

  it('makes each kernel item displayable with grounding, eval status, source families, and review navigation', () => {
    const readout = buildAxiomKernelCorpusReadout();

    for (const item of readout.corpusItems) {
      expect(item.currentUseAllowed).toBe('internal_kernel_display_and_review_navigation_only');
      expect(item.evalStatus).toBe('passes');
      expect(item.sourceFamilyEntryIds.length).toBeGreaterThan(0);
      expect(item.sourceFamilyGroups.length).toBeGreaterThan(0);
      expect(item.reviewUnitIds.length).toBeGreaterThan(0);
      expect(item.groundedFields).toEqual(expect.arrayContaining([...AXIOM_KERNEL_GROUNDED_FIELDS]));
      expect(item.inferenceCount).toBeGreaterThan(0);
      expect(item.counterHypothesisCount).toBeGreaterThan(0);
      expect(item.missingContextSlots.length).toBeGreaterThan(0);
      expect(item.implementationActorCount).toBeGreaterThan(0);
      expect(item.cannotYetSay.length).toBeGreaterThan(0);
    }
  });

  it('keeps source-family coverage visible before any public page filling', () => {
    const readout = buildAxiomKernelCorpusReadout();
    const coverageByGroup = new Map(
      readout.sourceFamilyCoverage.map((entry) => [entry.group, entry]),
    );

    expect(coverageByGroup.get('stage1_scima_fchma_derived')).toMatchObject({
      coverageRole: 'integrated_kernel_grounding',
    });
    expect(coverageByGroup.get('domestic_web_cache')).toMatchObject({
      coverageRole: 'integrated_kernel_grounding',
    });
    expect(coverageByGroup.get('international_web_cache')).toMatchObject({
      coverageRole: 'next_wave_kernel_grounding_candidate',
    });
    expect(coverageByGroup.get('historical_2001_abc')).toMatchObject({
      coverageRole: 'next_wave_kernel_grounding_candidate',
    });
    expect(coverageByGroup.get('falcon_heron_delivery_layer')).toMatchObject({
      coverageRole: 'delivery_layer_not_core_truth',
    });
    expect(readout.nextWaveCandidateEntryIds).toEqual(
      expect.arrayContaining([
        'source_family_respondent_surveys_3000_4000',
        'source_family_supporter_practice',
        'source_family_workplace_surveys',
        'source_family_workshop_practice_knowledge',
        'source_family_historical_2001_abc',
        'source_family_international_web_cache',
      ]),
    );
  });

  it('routes the corpus through compressed review units without moving promotion or runtime boundaries', () => {
    const readout = buildAxiomKernelCorpusReadout();

    expect(readout.reviewUnitCount).toBeLessThanOrEqual(100);
    for (const unit of readout.reviewNavigation) {
      expect(unit.routeStatus).toBe('human_review_required_before_promotion');
      expect(unit.packetIds.length).toBeGreaterThan(0);
      expect(unit.scenarioIds.length).toBeGreaterThan(0);
      expect(unit.kernelFieldsInScope.length).toBeGreaterThan(0);
    }
    expect(readout.notNow).toEqual(
      expect.arrayContaining([
        'no_public_page_filling_from_unpromoted_kernel',
        'no_source_or_support_validity_decision',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects readouts that drop packets, review navigation, or delivery-layer boundaries', () => {
    const readout = cloneReadout(buildAxiomKernelCorpusReadout());

    readout.corpusItems = readout.corpusItems.slice(1);
    readout.corpusItems[0].reviewUnitIds = [];
    readout.sourceFamilyCoverage = readout.sourceFamilyCoverage.map((entry) =>
      entry.group === 'falcon_heron_delivery_layer'
        ? { ...entry, coverageRole: 'integrated_kernel_grounding' }
        : entry,
    );
    readout.notNow = readout.notNow.filter(
      (item) => item !== 'no_public_page_filling_from_unpromoted_kernel',
    );

    const validation = validateAxiomKernelCorpusReadout(readout);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'readout_must_cover_integrated_8_packet_5_scenario_run',
        expect.stringContaining('missing_corpus_item_for_packet:'),
        expect.stringContaining('item_missing_review_navigation:'),
        'falcon_heron_delivery_must_remain_delivery_layer_not_core_truth',
        'readout_not_now_must_block_public_validity_runtime_and_learning',
      ]),
    );
  });
});
