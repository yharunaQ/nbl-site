import {
  AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY,
  buildAxiomKernelCorpusHumanReviewTool,
  validateAxiomKernelCorpusHumanReviewTool,
  type AxiomKernelCorpusHumanReviewTool,
} from '@/lib/axiom/kernelCorpusHumanReviewTool';
import { buildAxiomKernelCorpusHumanReviewPacket } from '@/lib/axiom/kernelCorpusHumanReviewPacket';

function cloneTool(tool: AxiomKernelCorpusHumanReviewTool): AxiomKernelCorpusHumanReviewTool {
  return JSON.parse(JSON.stringify(tool)) as AxiomKernelCorpusHumanReviewTool;
}

describe('Axiom kernel corpus human-review tool', () => {
  it('builds an internal review aid from the compressed human-review packet', () => {
    const packet = buildAxiomKernelCorpusHumanReviewPacket();
    const tool = buildAxiomKernelCorpusHumanReviewTool(packet);
    const validation = validateAxiomKernelCorpusHumanReviewTool(tool, packet);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'kernel_corpus_human_review_tool_valid',
      errorCount: 0,
      boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY,
    });
    expect(tool).toMatchObject({
      objectType: 'axiom_kernel_corpus_human_review_tool',
      lane: 'Falcon Lab',
      status: 'human_review_tool_prepared_input_only_not_submitted',
      unitCount: packet.unitCount,
      maxCoreHumanReviewUnits: 100,
      totalKernelRows: 15,
      sourceFamilyCount: 10,
      scenarioCount: 5,
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      submissionStatus: 'not_submitted',
      persistenceStatus: 'not_persisted_no_db_or_api',
      approvalStatus: 'not_approved',
      publicationStatus: 'not_published',
      receiptTemplateStatus: 'blank_template_only_not_received',
    });
  });

  it('gives every review unit decision options, note fields, and a blank receipt template', () => {
    const tool = buildAxiomKernelCorpusHumanReviewTool();

    for (const unit of tool.units) {
      expect(unit.decisionOptions).toEqual([
        'accept_as_provisional_kernel_structure',
        'revise_kernel_fields_before_review_result',
        'hold_for_missing_context_or_source_lens',
        'external_review_required_before_any_promotion',
      ]);
      expect(unit.defaultDecision).toBe('external_review_required_before_any_promotion');
      expect(unit.noteFields).toEqual([
        'reviewer_name_or_role',
        'decision_reason',
        'required_revision',
        'missing_context_to_check',
        'source_lens_or_bias_risk',
        'promotion_blocker',
      ]);
      expect(unit.inputStatus).toBe('blank_for_human_review');
      expect(unit.outputStatus).toBe('not_submitted_not_recorded');
      expect(unit.checklistLabels.length).toBeGreaterThan(0);
      expect(unit.reviewDossier.titleJa).toBeTruthy();
      expect(unit.reviewDossier.shortPurposeJa).toBeTruthy();
      expect(unit.reviewDossier.rows).toHaveLength(unit.rowCount);
      expect(unit.reviewDossier.reviewerMustJudgeJa.length).toBeGreaterThan(0);
      expect(unit.reviewDossier.reviewerMustNotJudgeJa).toEqual(
        expect.arrayContaining([
          'source/support validityの最終判断',
          'candidate_pattern昇格',
          'publication',
          'learning update',
        ]),
      );
      for (const row of unit.reviewDossier.rows) {
        expect(row.scenarioLabelJa).toBeTruthy();
        expect(row.sourceFamilyLabelsJa.length).toBeGreaterThan(0);
        expect(row.observations.length).toBeGreaterThan(0);
        expect(row.inference).toBeTruthy();
        expect(row.counterHypotheses.length).toBeGreaterThan(0);
        expect(row.missingContextQuestions.length).toBeGreaterThan(0);
        expect(row.sourceLensStatusSummary.length).toBeGreaterThan(0);
        expect(row.cannotYetSay.length).toBeGreaterThan(0);
      }
    }

    expect(tool.receiptTemplate).toMatchObject({
      receiptStatus: 'blank_not_received',
      reviewerSummary: '',
      overallDecision: 'unfilled',
    });
    expect(tool.receiptTemplate.unitResults).toHaveLength(tool.unitCount);
    expect(
      tool.receiptTemplate.unitResults.every((unit) => unit.reviewResultStatus === 'not_recorded'),
    ).toBe(true);
  });

  it('rejects tools that submit, persist, approve, or mutate review receipt state', () => {
    const packet = buildAxiomKernelCorpusHumanReviewPacket();
    const tool = cloneTool(buildAxiomKernelCorpusHumanReviewTool(packet));

    tool.submissionStatus = 'submitted' as unknown as 'not_submitted';
    tool.persistenceStatus = 'persisted' as unknown as 'not_persisted_no_db_or_api';
    tool.approvalStatus = 'approved' as unknown as 'not_approved';
    tool.receiptTemplate.receiptStatus = 'received' as unknown as 'blank_not_received';
    tool.units[0].defaultDecision =
      'accept_as_provisional_kernel_structure' as unknown as 'external_review_required_before_any_promotion';
    tool.notNow = tool.notNow.filter((item) => item !== 'no_form_submission_or_ingestion');

    const validation = validateAxiomKernelCorpusHumanReviewTool(tool, packet);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'tool_must_not_execute_assign_submit_persist_approve_publish_or_receive_receipt',
        'receipt_template_must_remain_blank_not_received',
        expect.stringContaining('unit_default_decision_must_block_promotion:'),
        'tool_not_now_must_block_submission_review_validity_runtime_and_learning',
      ]),
    );
  });
});
