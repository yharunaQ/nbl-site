import { AXIOM_KERNEL_GROUNDED_FIELDS } from '@/lib/axiom/interactionHypothesisKernelBuildGroundingContract';
import {
  AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY,
  buildAxiomKernelCorpusManualDocumentReadout,
  validateAxiomKernelCorpusManualDocumentReadout,
  type AxiomKernelCorpusManualDocumentReadout,
} from '@/lib/axiom/kernelCorpusManualDocumentReadout';

function cloneReadout(
  readout: AxiomKernelCorpusManualDocumentReadout,
): AxiomKernelCorpusManualDocumentReadout {
  return JSON.parse(JSON.stringify(readout)) as AxiomKernelCorpusManualDocumentReadout;
}

describe('Axiom kernel corpus manual/document expanded readout', () => {
  it('projects the manual/document packet into a 15-item internal kernel corpus', () => {
    const readout = buildAxiomKernelCorpusManualDocumentReadout();
    const validation = validateAxiomKernelCorpusManualDocumentReadout(readout);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_manual_document_readout_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_MANUAL_DOCUMENT_READOUT_BOUNDARY,
    });
    expect(readout).toMatchObject({
      objectType: 'axiom_kernel_corpus_manual_document_expanded_readout',
      lane: 'Falcon Lab',
      status: 'manual_document_internal_kernel_corpus_readout_ready',
      basePacketCount: 14,
      manualDocumentPacketCount: 1,
      totalPacketCount: 15,
      scenarioCount: 5,
      maxCoreHumanReviewUnits: 100,
      manualDocumentCoverageUpdate: {
        sourceFamilyEntryId: 'source_family_manuals_and_documents',
        priorCoverageRole: 'held_for_derived_non_sensitive_packet',
        projectedCoverageRole: 'manual_document_integrated_kernel_grounding_pending_review',
      },
    });
    expect(readout.corpusItems).toHaveLength(15);
  });

  it('keeps the manual/document corpus row grounded, evaluated, review-routed, and internal-only', () => {
    const readout = buildAxiomKernelCorpusManualDocumentReadout();
    const manualItem = readout.corpusItems.find((item) =>
      item.sourceFamilyEntryIds.includes('source_family_manuals_and_documents'),
    );

    expect(readout.aggregate.evalPassingItemCount).toBe(15);
    expect(readout.aggregate.internalDisplayOnlyItemCount).toBe(15);
    expect(readout.aggregate.manualDocumentIntegratedFamilyCount).toBe(1);
    expect(manualItem).toMatchObject({
      sourceFamilyGroups: ['manual_or_document'],
      sourceFamilyStatuses: ['hold_until_derived_non_sensitive_packet'],
      scenarioId: 'l3_policy_service_coordination_source_lens_v0',
      actionabilityBand: 'hold_or_research_needed',
      evalStatus: 'passes',
      currentUseAllowed: 'internal_kernel_display_and_review_navigation_only',
    });
    expect(manualItem?.reviewUnitIds.length).toBeGreaterThan(0);
    expect(manualItem?.groundedFields).toEqual(
      expect.arrayContaining([...AXIOM_KERNEL_GROUNDED_FIELDS]),
    );
    expect(manualItem?.cannotYetSay).toEqual(
      expect.arrayContaining([
        'No manual/document source is approved as current policy, legal advice, accommodation validity, support validity, or public guidance.',
      ]),
    );
  });

  it('rejects readouts that lose the manual row, review route, eval pass, or guardrails', () => {
    const readout = cloneReadout(buildAxiomKernelCorpusManualDocumentReadout());
    const manualItem = readout.corpusItems.find((item) =>
      item.sourceFamilyEntryIds.includes('source_family_manuals_and_documents'),
    );

    readout.corpusItems = readout.corpusItems.slice(0, 14);
    readout.totalPacketCount = 14;
    if (manualItem) {
      manualItem.evalStatus = 'needs_repair';
      manualItem.reviewUnitIds = [];
    }
    readout.notNow = readout.notNow.filter(
      (item) => item !== 'no_source_or_support_validity_decision',
    );

    const validation = validateAxiomKernelCorpusManualDocumentReadout(readout);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'manual_document_readout_must_project_15_total_kernel_items',
        'manual_document_source_family_missing_from_readout',
        'manual_document_readout_not_now_must_block_validity_runtime_public_and_learning',
      ]),
    );
  });
});
