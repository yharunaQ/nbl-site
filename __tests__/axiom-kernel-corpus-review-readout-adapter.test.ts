import {
  AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY,
  buildAxiomKernelCorpusReviewReadoutAdapter,
  validateAxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutAdapter,
} from '@/lib/axiom/kernelCorpusReviewReadoutAdapter';
import { AXIOM_KERNEL_GROUNDED_FIELDS } from '@/lib/axiom/interactionHypothesisKernelBuildGroundingContract';

function cloneAdapter(
  adapter: AxiomKernelCorpusReviewReadoutAdapter,
): AxiomKernelCorpusReviewReadoutAdapter {
  return JSON.parse(JSON.stringify(adapter)) as AxiomKernelCorpusReviewReadoutAdapter;
}

describe('Axiom kernel corpus review readout adapter', () => {
  it('builds an internal review/display adapter for the 15-item manual/document-expanded corpus', () => {
    const adapter = buildAxiomKernelCorpusReviewReadoutAdapter();
    const validation = validateAxiomKernelCorpusReviewReadoutAdapter(adapter);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_review_readout_adapter_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_REVIEW_READOUT_ADAPTER_BOUNDARY,
    });
    expect(adapter).toMatchObject({
      objectType: 'axiom_kernel_corpus_review_readout_adapter',
      lane: 'Falcon Lab',
      status: 'internal_review_readout_adapter_ready',
      sourceWave2ReadoutId: 'axiom_kernel_corpus_wave2_expanded_readout_v0_2026_06_08',
      sourceManualDocumentReadoutId:
        'axiom_kernel_corpus_manual_document_expanded_readout_v0_2026_06_08',
      rowCount: 15,
      wave2RowCount: 6,
      manualDocumentRowCount: 1,
      maxCoreHumanReviewUnits: 100,
    });
    expect(adapter.rows).toHaveLength(15);
    expect(adapter.reviewUnitIndex.length).toBeGreaterThan(0);
    expect(adapter.sourceFamilyIndex.length).toBeGreaterThan(0);
  });

  it('keeps every row grounded, review-routed, and internal-only', () => {
    const adapter = buildAxiomKernelCorpusReviewReadoutAdapter();

    for (const row of adapter.rows) {
      expect(row.displayUse).toBe('internal_review_readout_only');
      expect(row.reviewStatus).toBe('review_required_before_promotion');
      expect(row.promotionStatus).toBe('not_promoted');
      expect(row.reviewUnitIds.length).toBeGreaterThan(0);
      expect(row.sourceFamilyEntryIds.length).toBeGreaterThan(0);
      expect(row.groundedFields).toEqual(expect.arrayContaining([...AXIOM_KERNEL_GROUNDED_FIELDS]));
      expect(row.cannotYetSayCount).toBeGreaterThan(0);
    }
  });

  it('exposes the six wave2 source families and the manual/document family through the source-family index', () => {
    const adapter = buildAxiomKernelCorpusReviewReadoutAdapter();
    const sourceFamilyIds = adapter.sourceFamilyIndex.map((entry) => entry.sourceFamilyEntryId);

    expect(sourceFamilyIds).toEqual(
      expect.arrayContaining([
        'source_family_respondent_surveys_3000_4000',
        'source_family_supporter_practice',
        'source_family_workplace_surveys',
        'source_family_workshop_practice_knowledge',
        'source_family_historical_2001_abc',
        'source_family_international_web_cache',
        'source_family_manuals_and_documents',
      ]),
    );
    expect(adapter.displayContract.show).toEqual(
      expect.arrayContaining([
        'source_family',
        'scenario',
        'grounded_fields',
        'actionability_band',
        'missing_context_slots',
        'cannot_yet_say_count',
        'review_units',
      ]),
    );
    expect(adapter.displayContract.hide).toEqual(
      expect.arrayContaining([
        'raw_original',
        'source_text',
        'field_values',
        'public_recommendation',
        'source_support_validity',
      ]),
    );
  });

  it('rejects adapters that lose rows, review routes, source family index, or boundary hides', () => {
    const adapter = cloneAdapter(buildAxiomKernelCorpusReviewReadoutAdapter());

    adapter.rows = adapter.rows.slice(0, 14);
    adapter.rowCount = 14;
    adapter.rows[0].reviewUnitIds = [];
    adapter.rows[1].displayUse = 'public_review_readout_only' as unknown as 'internal_review_readout_only';
    adapter.displayContract.hide = adapter.displayContract.hide.filter(
      (item) => item !== 'source_support_validity',
    );
    adapter.notNow = adapter.notNow.filter(
      (item) => item !== 'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    );

    const validation = validateAxiomKernelCorpusReviewReadoutAdapter(adapter);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'adapter_must_expose_15_rows_with_6_wave2_rows_and_1_manual_document_row',
        expect.stringContaining('row_missing_review_units:'),
        expect.stringContaining('row_must_remain_internal:'),
        'adapter_display_contract_must_hide_raw_validity_and_public_recommendation',
        'adapter_not_now_must_block_validity_runtime_public_and_learning',
      ]),
    );
  });
});
