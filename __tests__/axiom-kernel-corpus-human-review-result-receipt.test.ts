import {
  AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY,
  buildAxiomKernelCorpusHumanReviewResultReceipt,
  validateAxiomKernelCorpusHumanReviewResultReceipt,
  type AxiomKernelCorpusHumanReviewResultReceipt,
} from '@/lib/axiom/kernelCorpusHumanReviewResultReceipt';
import { buildAxiomKernelCorpusHumanReviewTool } from '@/lib/axiom/kernelCorpusHumanReviewTool';

function cloneReceipt(
  receipt: AxiomKernelCorpusHumanReviewResultReceipt,
): AxiomKernelCorpusHumanReviewResultReceipt {
  return JSON.parse(JSON.stringify(receipt)) as AxiomKernelCorpusHumanReviewResultReceipt;
}

describe('Axiom kernel corpus human-review result receipt', () => {
  it('records the Founder result that all 18 review units accept the provisional kernel structure', () => {
    const tool = buildAxiomKernelCorpusHumanReviewTool();
    const receipt = buildAxiomKernelCorpusHumanReviewResultReceipt(tool);
    const validation = validateAxiomKernelCorpusHumanReviewResultReceipt(receipt, tool);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_human_review_result_receipt_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_RESULT_RECEIPT_BOUNDARY,
    });
    expect(receipt).toMatchObject({
      objectType: 'axiom_kernel_corpus_human_review_result_receipt',
      lane: 'Falcon Lab',
      status: 'founder_review_result_received_all_units_accept_provisional_kernel_structure',
      reviewSource: 'founder_chat_review_result_2026_06_08',
      reviewerRole: 'Founder',
      unitCount: 18,
      acceptedUnitCount: 18,
      revisedUnitCount: 0,
      heldUnitCount: 0,
      overallDecision: 'all_units_accept_as_provisional_kernel_structure',
    });
    expect(receipt.resultUnits).toHaveLength(18);
    expect(
      receipt.resultUnits.every(
        (unit) =>
          unit.selectedDecision === 'accept_as_provisional_kernel_structure' &&
          unit.reviewResultStatus === 'recorded_external_founder_acceptance' &&
          unit.kernelUseStatus === 'accepted_as_provisional_kernel_structure',
      ),
    ).toBe(true);
  });

  it('allows kernel-backed public interface translation without treating the receipt as final validity or publication', () => {
    const receipt = buildAxiomKernelCorpusHumanReviewResultReceipt();

    expect(receipt.reviewResultInterpretation).toMatchObject({
      provisionalKernelStructureAccepted: true,
      kernelBackedPublicInterfaceContinuation:
        'allowed_to_build_kernel_backed_public_interface_translation',
      directPublicationDecision: 'not_decided_by_this_receipt',
      sourceSupportValidity: 'not_decided_by_this_receipt',
      candidatePattern: 'not_candidate_pattern',
      runtimePromptRetrievalModelProviderDbSchema: 'not_changed',
      learningUpdate: 'not_promoted',
    });
    expect(receipt.publicInterfaceBridge.nextAllowedStep).toBe(
      'build_kernel_backed_public_content_slots_from_reviewed_kernel_fields',
    );
    expect(receipt.publicInterfaceBridge.allowedPublicTranslationFields).toEqual([
      'observation',
      'inference',
      'counterHypothesis',
      'missingContext',
      'implementationActorConditions',
      'sourceLensStatus',
      'actionabilityBand',
      'cannotYetSay',
      'humanReviewRoute',
    ]);
    expect(receipt.publicInterfaceBridge.doNotExposeAsPublicTruth).toEqual([
      'final_support_validity',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
      'individual_case_final_judgment',
      'medical_legal_or_job_placement_finality',
      'raw_sensitive_source_text_or_field_values',
    ]);
  });

  it('rejects receipts that promote validity, publication, runtime movement, or learning update', () => {
    const tool = buildAxiomKernelCorpusHumanReviewTool();
    const receipt = cloneReceipt(buildAxiomKernelCorpusHumanReviewResultReceipt(tool));

    receipt.reviewResultInterpretation.directPublicationDecision =
      'approved' as unknown as 'not_decided_by_this_receipt';
    receipt.reviewResultInterpretation.sourceSupportValidity =
      'valid' as unknown as 'not_decided_by_this_receipt';
    receipt.reviewResultInterpretation.runtimePromptRetrievalModelProviderDbSchema =
      'changed' as unknown as 'not_changed';
    receipt.movementBoundary.publication = 'published' as unknown as 'not_published';
    receipt.movementBoundary.learningUpdate = 'promoted' as unknown as 'not_promoted';
    receipt.notNow = receipt.notNow.filter(
      (item) => item !== 'no_direct_publication_or_public_approval_from_this_receipt',
    );

    const validation = validateAxiomKernelCorpusHumanReviewResultReceipt(receipt, tool);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'receipt_must_not_move_publication_validity_candidate_runtime_or_learning',
        'movement_boundary_must_not_move_runtime_validity_publication_promotion_or_learning',
        'not_now_must_block_finality_runtime_publication_learning_and_sensitive_source_export',
      ]),
    );
  });

  it('rejects partial or non-Founder review results', () => {
    const tool = buildAxiomKernelCorpusHumanReviewTool();
    const receipt = cloneReceipt(buildAxiomKernelCorpusHumanReviewResultReceipt(tool));

    receipt.acceptedUnitCount = 17;
    receipt.resultUnits[0].reviewerNameOrRole = 'Codex' as unknown as 'Founder';
    receipt.resultUnits[0].selectedDecision =
      'hold_for_missing_context_or_source_lens' as unknown as 'accept_as_provisional_kernel_structure';

    const validation = validateAxiomKernelCorpusHumanReviewResultReceipt(receipt, tool);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'receipt_counts_must_record_18_of_18_acceptance_with_no_revise_or_hold',
        expect.stringContaining('receipt_unit_must_record_founder_acceptance_only:'),
      ]),
    );
  });
});
