import {
  AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY,
  buildAxiomManualDocumentEvidencePacket,
  buildAxiomManualDocumentSourceFamilyAttachment,
  validateAxiomManualDocumentSourceFamilyAttachment,
  type AxiomManualDocumentSourceFamilyAttachment,
} from '@/lib/axiom/manualDocumentSourceFamilyAttachment';

function cloneAttachment(
  attachment: AxiomManualDocumentSourceFamilyAttachment,
): AxiomManualDocumentSourceFamilyAttachment {
  return JSON.parse(JSON.stringify(attachment)) as AxiomManualDocumentSourceFamilyAttachment;
}

describe('Axiom manual/document source-family attachment', () => {
  it('builds one derived non-sensitive manual/document packet and passes deterministic kernel eval', () => {
    const attachment = buildAxiomManualDocumentSourceFamilyAttachment();
    const validation = validateAxiomManualDocumentSourceFamilyAttachment(attachment);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'manual_document_source_family_attachment_valid',
      errorCount: 0,
      boundary: AXIOM_MANUAL_DOCUMENT_SOURCE_FAMILY_ATTACHMENT_BOUNDARY,
    });
    expect(attachment).toMatchObject({
      objectType: 'axiom_manual_document_source_family_attachment',
      lane: 'Falcon Lab',
      status: 'manual_document_packet_attached_to_kernel_corpus_pending_review',
      sourceFamilyEntryId: 'source_family_manuals_and_documents',
      basePacketCount: 14,
      manualDocumentPacketCount: 1,
      projectedCorpusPacketCount: 15,
    });
    expect(attachment.manualDocumentBatchRun.packetCount).toBe(1);
    expect(attachment.manualDocumentBatchRun.status).toBe(
      'passed_real_derived_non_sensitive_kernel_build_batch',
    );
    expect(attachment.evalReports).toHaveLength(1);
    expect(attachment.evalReports[0]).toMatchObject({
      scenarioId: 'l3_policy_service_coordination_source_lens_v0',
      status: 'passes',
    });
  });

  it('keeps manual/document evidence as metadata/manifest derived input, not source text or public guidance', () => {
    const packet = buildAxiomManualDocumentEvidencePacket();

    expect(packet.dataPolicy).toMatchObject({
      rawOriginalOpened: false,
      sourceTextExported: false,
      redactedTextExported: false,
      fieldValueExported: false,
      sourceSupportValidityDecision: 'not_decided',
      publicUse: 'not_public_approved',
    });
    expect(packet.sourceFoundationRefs.map((foundation) => foundation.uri)).toEqual(
      expect.arrayContaining([
        'references/documents/mhlw-treatment-work-mental-manual-2026.meta.json',
        'references/documents/mhlw-treatment-work-mental-manual-2026.pdf',
        'references/documents/2026+Resource_Disability+Inclusive+AI_Remediated.pdf',
        'references/index/normalized-manifest.json',
      ]),
    );
    expect(packet.actionabilityBand).toBe('hold_or_research_needed');
    expect(packet.cannotYetSay).toEqual(
      expect.arrayContaining([
        'No manual/document source is approved as current policy, legal advice, accommodation validity, support validity, or public guidance.',
        'No PDF text, source text, raw original, redacted text, or field value has been opened or exported.',
      ]),
    );
  });

  it('rejects attachments that move validity/public/runtime/promotion or lose the manual target', () => {
    const attachment = cloneAttachment(buildAxiomManualDocumentSourceFamilyAttachment());

    attachment.sourceFamilyEntryId = 'source_family_domestic_web_cache' as unknown as
      'source_family_manuals_and_documents';
    attachment.manualDocumentBatchRun.runs[0].evidencePacket.dataPolicy.sourceTextExported =
      true as unknown as false;
    attachment.manualDocumentBatchRun.runs[0].evidencePacket.movementBoundary.publicApproved =
      'approved' as unknown as 'not_approved';
    attachment.notNow = attachment.notNow.filter(
      (item) => item !== 'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    );

    const validation = validateAxiomManualDocumentSourceFamilyAttachment(attachment);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'manual_document_attachment_must_target_manuals_and_documents_source_family',
        'manual_document_packet_must_not_open_or_export_raw_source_or_field_values',
        'manual_document_packet_must_not_move_validity_public_runtime_pattern_or_promotion',
        'manual_document_attachment_not_now_must_block_validity_public_runtime_and_learning',
      ]),
    );
  });
});
