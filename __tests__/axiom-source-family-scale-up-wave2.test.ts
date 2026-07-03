import { existsSync } from 'node:fs';
import path from 'node:path';

import {
  AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY,
  buildAxiomSourceFamilyScaleUpWave2Attachment,
  buildAxiomSourceFamilyScaleUpWave2Packets,
  validateAxiomSourceFamilyScaleUpWave2Attachment,
  type AxiomSourceFamilyScaleUpWave2Attachment,
} from '@/lib/axiom/sourceFamilyScaleUpWave2';

function cloneAttachment(
  attachment: AxiomSourceFamilyScaleUpWave2Attachment,
): AxiomSourceFamilyScaleUpWave2Attachment {
  return JSON.parse(JSON.stringify(attachment)) as AxiomSourceFamilyScaleUpWave2Attachment;
}

describe('Axiom source-family scale-up wave 2', () => {
  it('builds six derived non-sensitive packets for the next source-family wave', () => {
    const packets = buildAxiomSourceFamilyScaleUpWave2Packets();

    expect(packets).toHaveLength(6);
    expect(packets.map((packet) => packet.packetId)).toEqual([
      'axiom_wave2_packet_respondent_surveys_3000_4000_v0_2026_06_08',
      'axiom_wave2_packet_supporter_practice_v0_2026_06_08',
      'axiom_wave2_packet_workplace_surveys_v0_2026_06_08',
      'axiom_wave2_packet_workshop_practice_knowledge_v0_2026_06_08',
      'axiom_wave2_packet_2001_abc_triadic_source_lens_v0_2026_06_08',
      'axiom_wave2_packet_international_web_cache_jurisdiction_contrast_v0_2026_06_08',
    ]);
    for (const packet of packets) {
      expect(packet.dataPolicy).toMatchObject({
        inputLayer: 'references_derived_and_docs_only',
        rawOriginalOpened: false,
        sourceTextExported: false,
        redactedTextExported: false,
        fieldValueExported: false,
        sourceSupportValidityDecision: 'not_decided',
        publicUse: 'not_public_approved',
      });
      for (const source of packet.sourceFoundationRefs) {
        expect(existsSync(path.join(process.cwd(), source.uri))).toBe(true);
      }
    }
  });

  it('attaches wave2 packets to the stable corpus and passes kernel build plus L3 eval', () => {
    const attachment = buildAxiomSourceFamilyScaleUpWave2Attachment();
    const validation = validateAxiomSourceFamilyScaleUpWave2Attachment(attachment);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'source_family_scale_up_wave2_attachment_valid',
      errorCount: 0,
      boundary: AXIOM_SOURCE_FAMILY_SCALE_UP_WAVE2_BOUNDARY,
    });
    expect(attachment).toMatchObject({
      objectType: 'axiom_source_family_scale_up_wave2_attachment',
      lane: 'Falcon Lab',
      status: 'prepared_wave2_packets_attached_to_stable_corpus',
      baseReadoutId: 'axiom_kernel_corpus_readout_v0_2026_06_08',
      sourceLedgerId: 'axiom_source_family_utilization_ledger_v0_2026_06_08',
      basePacketCount: 8,
      wave2PacketCount: 6,
      projectedCorpusPacketCount: 14,
      reviewUnitCount: 8,
      maxCoreHumanReviewUnits: 100,
    });
    expect(attachment.wave2BatchRun.status).toBe(
      'passed_real_derived_non_sensitive_kernel_build_batch',
    );
    expect(attachment.evalReports).toHaveLength(6);
    expect(attachment.evalReports.every((report) => report.status === 'passes')).toBe(true);
  });

  it('covers the required next-wave source family entries without treating delivery as core truth', () => {
    const attachment = buildAxiomSourceFamilyScaleUpWave2Attachment();

    expect(attachment.packetMappings.map((mapping) => mapping.sourceFamilyEntryId)).toEqual([
      'source_family_respondent_surveys_3000_4000',
      'source_family_supporter_practice',
      'source_family_workplace_surveys',
      'source_family_workshop_practice_knowledge',
      'source_family_historical_2001_abc',
      'source_family_international_web_cache',
    ]);
    expect(attachment.packetMappings.map((mapping) => mapping.sourceFamilyGroup)).toEqual([
      'respondent_survey',
      'supporter_data',
      'workplace_data',
      'workshop_practice_knowledge',
      'historical_2001_abc',
      'international_web_cache',
    ]);
    expect(
      attachment.packetMappings.every(
        (mapping) =>
          mapping.status === 'prepared_as_derived_non_sensitive_packet_attached_to_corpus',
      ),
    ).toBe(true);
    expect(attachment.notNow).toEqual(
      expect.arrayContaining([
        'no_public_page_filling_from_unpromoted_kernel',
        'no_source_or_support_validity_decision',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
      ]),
    );
  });

  it('rejects attachments that drop a wave2 family, fail eval, or move runtime/public boundaries', () => {
    const attachment = cloneAttachment(buildAxiomSourceFamilyScaleUpWave2Attachment());

    attachment.packetMappings = attachment.packetMappings.filter(
      (mapping) => mapping.sourceFamilyEntryId !== 'source_family_international_web_cache',
    );
    attachment.evalReports[0].status = 'needs_repair';
    attachment.wave2BatchRun.runs[0].evidencePacket.dataPolicy.rawOriginalOpened =
      true as unknown as false;
    attachment.notNow = attachment.notNow.filter(
      (item) => item !== 'no_public_page_filling_from_unpromoted_kernel',
    );

    const validation = validateAxiomSourceFamilyScaleUpWave2Attachment(attachment);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'wave2_l3_eval_reports_must_all_pass',
        'wave2_required_entry_missing:source_family_international_web_cache',
        'wave2_packet_must_not_open_or_export_raw_or_move_validity:axiom_wave2_packet_respondent_surveys_3000_4000_v0_2026_06_08',
        'wave2_not_now_must_block_validity_runtime_public_page_filling_and_learning',
      ]),
    );
  });
});
