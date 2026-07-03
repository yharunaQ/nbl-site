import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_FIELD_IDS,
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionIngestionContract';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell,
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell {
  return JSON.parse(
    JSON.stringify(shell),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell;
}

describe('Axiom internal candidate Founder final-release decision payload shell', () => {
  it('builds an empty Founder final-release decision payload schema shell without receiving or ingesting a decision', () => {
    const ingestionContract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(ingestionContract);
    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(
      shell,
      ingestionContract,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(shell).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_SHELL_ROUTE,
      sourceIngestionContractId: ingestionContract.contractId,
      sourceIngestionContractStatus:
        'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
      sourceIngestionContractRequiredStatus:
        'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
      shellMode: 'founder_final_release_decision_payload_shell_empty_fixture_only',
      payloadSchemaStatus: 'declared_empty_fixture',
      externalDecisionPayloadStatus: 'empty',
      payloadAcceptanceStatus: 'not_accepted',
      ingestionStatus: 'not_ingested',
      decisionReceiptStatus: 'not_received',
      founderDecisionStatus: 'not_decided',
      reviewExecutionStatus: 'not_executed',
      reviewerAssignmentStatus: 'not_assigned_by_codex',
      releaseDecisionStatus: 'not_decided',
      routeActivationStatus: 'not_activated',
      actualPublicNavigationStatus: 'not_added',
      publicApprovalStatus: 'not_approved',
      publicationStatus: 'not_published',
      sourceSupportValidityStatus: 'not_decided',
      maxCoreReviewUnits: 100,
      payloadUnitCount: 11,
      nextAllowedMovement:
        'external_founder_payload_may_be_filled_only_after_founder_decision_outside_codex',
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        publicNavigation: 'not_added',
        falconCandidateSurfacePromotion: 'not_promoted',
        sourceValidity: 'not_decided',
        sourceCurrentness: 'not_decided',
        supportValidity: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        knowledgePromotion: 'not_promoted',
        learningUpdate: 'not_updated',
      },
    });
  });

  it('keeps payload review units under the 100-unit cap and covers all fixed surfaces', () => {
    const ingestionContract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(ingestionContract);

    expect(shell.payloadUnitCount).toBe(11);
    expect(shell.payloadUnitCount).toBeLessThanOrEqual(shell.maxCoreReviewUnits);
    expect(
      shell.payloadUnits
        .filter(
          (unit) => unit.unitType === 'surface_founder_final_release_decision_payload_shell_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      shell.payloadUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_REQUIREMENTS.every((requirement) =>
          unit.requiredPayloadRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every payload field empty, not accepted, and required before ingestion', () => {
    const ingestionContract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(ingestionContract);

    for (const unit of shell.payloadUnits) {
      expect(unit.payloadFields.map((field) => field.fieldId)).toEqual(
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_FIELD_IDS,
      );
      expect(
        unit.payloadFields.every(
          (field) =>
            field.valueStatus === 'empty' &&
            field.acceptedStatus === 'not_accepted' &&
            field.requiredBeforeIngestion,
        ),
      ).toBe(true);
    }
  });

  it('keeps every payload unit empty, not accepted, not ingested, not received, undecided, unexecuted, unassigned, unactivated, unapproved, and unpublished', () => {
    const ingestionContract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(ingestionContract);

    expect(
      shell.payloadUnits.every(
        (unit) =>
          unit.payloadSchemaStatus === 'declared_empty_fixture' &&
          unit.externalDecisionPayloadStatus === 'empty' &&
          unit.payloadAcceptanceStatus === 'not_accepted' &&
          unit.ingestionStatus === 'not_ingested' &&
          unit.decisionReceiptStatus === 'not_received' &&
          unit.founderDecisionStatus === 'not_decided' &&
          unit.reviewExecutionStatus === 'not_executed' &&
          unit.reviewerAssignmentStatus === 'not_assigned_by_codex' &&
          unit.releaseDecisionStatus === 'not_decided' &&
          unit.routeActivationStatus === 'not_activated' &&
          unit.actualPublicNavigationStatus === 'not_added' &&
          unit.publicApprovalStatus === 'not_approved' &&
          unit.publicationStatus === 'not_published' &&
          unit.sourceSupportValidityStatus === 'not_decided' &&
          unit.blocksCandidatePromotion &&
          unit.blocksPublicNavigation &&
          unit.blocksPublicRelease &&
          unit.doesNotBlockInternalPreview,
      ),
    ).toBe(true);
  });

  it('rejects missing surface unit, filled payload field, payload acceptance, and public approval movement', () => {
    const ingestionContract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract();
    const shell = cloneShell(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(ingestionContract),
    );
    shell.payloadUnits = shell.payloadUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    shell.payloadUnitCount = shell.payloadUnits.length;
    shell.payloadUnits[0].payloadFields[0].valueStatus =
      'filled' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell['payloadUnits'][number]['payloadFields'][number]['valueStatus'];
    shell.payloadAcceptanceStatus =
      'accepted' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell['payloadAcceptanceStatus'];
    shell.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell['movementBoundary']['publicApproval'];

    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(
      shell,
      ingestionContract,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'payload_unit_count_must_match_ingestion_units',
        'surface_payload_unit_missing:scene_entry_use_cases',
        expect.stringContaining('payload_field_must_remain_empty_not_accepted_required:'),
        'payload_shell_must_remain_empty_not_accepted_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_payload_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
