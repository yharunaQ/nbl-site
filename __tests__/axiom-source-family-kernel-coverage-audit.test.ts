import {
  AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY,
  buildAxiomSourceFamilyKernelCoverageAudit,
  validateAxiomSourceFamilyKernelCoverageAudit,
  type AxiomSourceFamilyKernelCoverageAudit,
} from '@/lib/axiom/sourceFamilyKernelCoverageAudit';

function cloneAudit(
  audit: AxiomSourceFamilyKernelCoverageAudit,
): AxiomSourceFamilyKernelCoverageAudit {
  return JSON.parse(JSON.stringify(audit)) as AxiomSourceFamilyKernelCoverageAudit;
}

describe('Axiom source-family kernel coverage audit', () => {
  it('builds a valid audit from the 15-item kernel corpus and 11 source-family ledger entries', () => {
    const audit = buildAxiomSourceFamilyKernelCoverageAudit();
    const validation = validateAxiomSourceFamilyKernelCoverageAudit(audit);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'source_family_kernel_coverage_audit_valid',
      errorCount: 0,
      boundary: AXIOM_SOURCE_FAMILY_KERNEL_COVERAGE_AUDIT_BOUNDARY,
    });
    expect(audit).toMatchObject({
      objectType: 'axiom_source_family_kernel_coverage_audit',
      lane: 'Falcon Lab',
      status: 'source_family_kernel_coverage_audit_ready',
      totalKernelRows: 15,
      summary: {
        totalLedgerEntries: 11,
        coreEligibleEntryCount: 10,
        representedCoreEligibleEntryCount: 10,
        heldCoreEligibleEntryCount: 0,
        excludedDeliveryLayerEntryCount: 1,
        coverageStatus: 'all_current_core_eligible_families_represented_or_explicitly_held',
      },
    });
  });

  it('keeps every non-delivery source family represented or explicitly held', () => {
    const audit = buildAxiomSourceFamilyKernelCoverageAudit();
    const byId = new Map(audit.entries.map((entry) => [entry.entryId, entry]));

    for (const representedEntryId of [
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
    ]) {
      expect(byId.get(representedEntryId)).toMatchObject({
        corpusCoverageStatus: 'represented_in_current_kernel_corpus',
        nextMovement: 'covered_in_current_internal_corpus_pending_review',
      });
      expect(byId.get(representedEntryId)?.rowCount).toBeGreaterThan(0);
    }

    expect(audit.nextCorePacketTargets).toEqual([]);
  });

  it('excludes Falcon/Heron delivery artifacts from core truth while keeping them visible', () => {
    const audit = buildAxiomSourceFamilyKernelCoverageAudit();

    expect(byId(audit).get('source_family_falcon_heron_delivery_artifacts')).toMatchObject({
      ledgerStatus: 'delivery_layer_not_core_kernel',
      corpusCoverageStatus: 'excluded_delivery_layer_not_core_kernel',
      nextMovement: 'keep_as_delivery_layer_not_core_truth',
      rowCount: 0,
    });
    expect(audit.guardrails).toMatchObject({
      rawOriginalOpened: false,
      sourceTextExported: false,
      fieldValueExported: false,
      sourceSupportValidityDecision: 'not_decided',
      publicApproved: 'not_approved',
      runtimeApproved: 'not_approved',
      candidatePattern: 'not_candidate_pattern',
      learningUpdate: 'not_promoted',
    });
  });

  it('rejects audits that drop a source family, pretend delivery is represented, or move guardrails', () => {
    const audit = cloneAudit(buildAxiomSourceFamilyKernelCoverageAudit());

    audit.entries = audit.entries.filter(
      (entry) => entry.entryId !== 'source_family_international_web_cache',
    );
    const deliveryEntry = audit.entries.find(
      (entry) => entry.entryId === 'source_family_falcon_heron_delivery_artifacts',
    );
    if (deliveryEntry) {
      deliveryEntry.corpusCoverageStatus = 'represented_in_current_kernel_corpus';
    }
    audit.guardrails.sourceTextExported = true as unknown as false;
    audit.nextCorePacketTargets = ['source_family_manuals_and_documents'];

    const validation = validateAxiomSourceFamilyKernelCoverageAudit(audit);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'coverage_audit_must_include_every_ledger_entry',
        'coverage_audit_missing_ledger_entry:source_family_international_web_cache',
        'coverage_audit_summary_must_match_entries',
        'unrepresented_source_family_must_not_be_marked_represented:source_family_falcon_heron_delivery_artifacts',
        'falcon_heron_delivery_artifacts_must_remain_excluded_from_core_truth',
        'manuals_and_documents_must_not_remain_next_core_packet_target_after_integration',
        'coverage_audit_guardrails_must_not_move_raw_validity_public_runtime_pattern_or_learning',
      ]),
    );
  });
});

function byId(audit: AxiomSourceFamilyKernelCoverageAudit) {
  return new Map(audit.entries.map((entry) => [entry.entryId, entry]));
}
