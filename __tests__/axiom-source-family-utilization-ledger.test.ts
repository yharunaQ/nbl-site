import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY,
  buildAxiomSourceFamilyUtilizationLedger,
  validateAxiomSourceFamilyUtilizationLedger,
  type AxiomSourceFamilyUtilizationLedger,
} from '@/lib/axiom/sourceFamilyUtilizationLedger';

function cloneLedger(
  ledger: AxiomSourceFamilyUtilizationLedger,
): AxiomSourceFamilyUtilizationLedger {
  return JSON.parse(JSON.stringify(ledger)) as AxiomSourceFamilyUtilizationLedger;
}

describe('Axiom source-family utilization ledger', () => {
  it('builds a valid source-family ledger anchored to the 8-packet Axiom integration run', () => {
    const ledger = buildAxiomSourceFamilyUtilizationLedger();
    const validation = validateAxiomSourceFamilyUtilizationLedger(ledger);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'source_family_utilization_ledger_valid',
      errorCount: 0,
      boundary: AXIOM_SOURCE_FAMILY_UTILIZATION_LEDGER_BOUNDARY,
    });
    expect(ledger).toMatchObject({
      objectType: 'axiom_source_family_utilization_ledger',
      lane: 'Falcon Lab',
      status: 'source_family_utilization_ledger_ready',
      sourceIntegrationRunId: 'axiom_real_data_scale_up_integration_run_v0_2026_06_08',
      integratedPacketCount: 8,
      integratedScenarioCount: 5,
      compressedReviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
    });
    expect(ledger.summary).toMatchObject({
      totalEntries: 11,
      integratedEntries: 3,
      deliveryLayerEntries: 1,
    });
  });

  it('keeps every important Falcon/Heron source family visible to Axiom', () => {
    const ledger = buildAxiomSourceFamilyUtilizationLedger();

    expect(ledger.requiredGroups).toEqual([
      'respondent_survey',
      'supporter_data',
      'workplace_data',
      'workshop_practice_knowledge',
      'manual_or_document',
      'domestic_web_cache',
      'international_web_cache',
      'historical_2001_abc',
      'stage1_scima_fchma_derived',
      'l3_ft03_review_frame',
      'falcon_heron_delivery_layer',
    ]);
    for (const group of ledger.requiredGroups) {
      expect(ledger.entries.some((entry) => entry.group === group)).toBe(true);
    }
  });

  it('records what is already integrated and what remains for the next Axiom wave', () => {
    const ledger = buildAxiomSourceFamilyUtilizationLedger();
    const byId = new Map(ledger.entries.map((entry) => [entry.entryId, entry]));

    expect(byId.get('source_family_respondent_surveys_3000_4000')).toMatchObject({
      status: 'partially_integrated_next_wave_candidate',
      knownScale: expect.stringContaining('4523'),
      currentAxiomUse: expect.stringContaining('CR01 and CR02-CR05'),
    });
    expect(byId.get('source_family_domestic_web_cache')).toMatchObject({
      status: 'integrated_in_axiom_scale_up_run',
      currentAxiomUse: expect.stringContaining('JEED batch1 and official underread batch2'),
    });
    expect(byId.get('source_family_international_web_cache')).toMatchObject({
      status: 'manifest_ready_next_wave_candidate',
      nextAxiomUse: expect.stringContaining('jurisdiction-contrast packet'),
    });
    expect(byId.get('source_family_historical_2001_abc')).toMatchObject({
      status: 'manifest_ready_next_wave_candidate',
      nextAxiomUse: expect.stringContaining('triadic source-lens packet'),
    });
    expect(byId.get('source_family_falcon_heron_delivery_artifacts')).toMatchObject({
      status: 'delivery_layer_not_core_kernel',
    });
    expect(ledger.nextWaveRecommendation.recommendedEntryIds).toEqual(
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

  it('anchors entries to local manifests or derived artifacts without requiring raw source reads', () => {
    const ledger = buildAxiomSourceFamilyUtilizationLedger();

    for (const entry of ledger.entries) {
      for (const uri of entry.sourceUris) {
        expect(existsSync(path.join(process.cwd(), uri))).toBe(true);
      }
      expect(entry.noRawOrPromotionBoundary).toMatchObject({
        rawOriginalOpened: false,
        sourceTextExported: false,
        redactedTextExported: false,
        fieldValueExported: false,
        sourceSupportValidityDecision: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        learningUpdate: 'not_promoted',
      });
      expect(entry.targetKernelFields).toEqual(
        expect.arrayContaining([
          'observation',
          'inference',
          'counterHypothesis',
          'missingContext',
          'implementationActorConditions',
          'sourceLensStatus',
          'actionabilityBand',
          'cannotYetSay',
          'humanReviewRoute',
        ]),
      );
    }
  });

  it('rejects ledgers that drop source families, open raw data, or treat delivery as core truth', () => {
    const ledger = cloneLedger(buildAxiomSourceFamilyUtilizationLedger());

    ledger.entries = ledger.entries.filter((entry) => entry.group !== 'international_web_cache');
    ledger.entries[0].noRawOrPromotionBoundary.rawOriginalOpened = true as unknown as false;
    ledger.notNow = ledger.notNow.filter(
      (item) => item !== 'no_delivery_artifact_as_axiom_core_truth',
    );

    const validation = validateAxiomSourceFamilyUtilizationLedger(ledger);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'required_source_family_group_missing:international_web_cache',
        'entry_must_not_open_or_export_raw_source_or_field_values:source_family_respondent_surveys_3000_4000',
        'ledger_not_now_must_block_delivery_truth_validity_publication_and_learning',
      ]),
    );
  });
});
