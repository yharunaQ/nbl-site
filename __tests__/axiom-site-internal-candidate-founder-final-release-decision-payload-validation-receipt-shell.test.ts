import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell {
  return JSON.parse(
    JSON.stringify(shell),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell;
}

function buildSources() {
  const payloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();
  const validationGate =
    buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(payloadShell);

  return { payloadShell, validationGate };
}

describe('Axiom internal candidate Founder final-release decision payload validation receipt shell', () => {
  it('builds a payload validation receipt shell without receiving, validating, ingesting, or deciding release', () => {
    const { payloadShell, validationGate } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
        validationGate,
      );
    const validation =
      validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
        shell,
        validationGate,
        payloadShell,
      );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(shell).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
      boundary:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_BOUNDARY,
      route:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_SHELL_ROUTE,
      sourceValidationGateId: validationGate.gateId,
      sourceValidationGateStatus:
        'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
      sourceValidationGateRequiredStatus:
        'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
      shellMode:
        'founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only',
      validationReceiptStatus: 'not_received',
      validationExecutionStatus: 'not_run',
      payloadValidationStatus: 'not_validated',
      emptyPayloadDisposition: 'rejected_before_ingestion',
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
      receiptUnitCount: 11,
      nextAllowedMovement:
        'payload_validation_receipt_can_be_ingested_only_after_valid_external_payload_validation_outside_codex',
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

  it('keeps validation receipt units under the 100-unit cap and covers all fixed surfaces', () => {
    const { validationGate } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
        validationGate,
      );

    expect(shell.receiptUnitCount).toBe(11);
    expect(shell.receiptUnitCount).toBeLessThanOrEqual(shell.maxCoreReviewUnits);
    expect(
      shell.receiptUnits
        .filter(
          (unit) =>
            unit.unitType ===
            'surface_founder_final_release_decision_payload_validation_receipt_shell_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      shell.receiptUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_RECEIPT_REQUIREMENTS.every(
          (requirement) => unit.requiredReceiptRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every validation receipt unit not received, not run, not validated, empty, rejected, not accepted, not ingested, unapproved, and unpublished', () => {
    const { validationGate } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
        validationGate,
      );

    expect(
      shell.receiptUnits.every(
        (unit) =>
          unit.validationReceiptStatus === 'not_received' &&
          unit.validationExecutionStatus === 'not_run' &&
          unit.payloadValidationStatus === 'not_validated' &&
          unit.emptyPayloadDisposition === 'rejected_before_ingestion' &&
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

  it('rejects missing surface unit, received validation receipt, validated payload, and public approval movement', () => {
    const { payloadShell, validationGate } = buildSources();
    const shell = cloneShell(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
        validationGate,
      ),
    );
    shell.receiptUnits = shell.receiptUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    shell.receiptUnitCount = shell.receiptUnits.length;
    shell.validationReceiptStatus =
      'received' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell['validationReceiptStatus'];
    shell.payloadValidationStatus =
      'validated' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell['payloadValidationStatus'];
    shell.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell['movementBoundary']['publicApproval'];

    const validation =
      validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
        shell,
        validationGate,
        payloadShell,
      );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'validation_receipt_unit_count_must_match_validation_units',
        'surface_payload_validation_receipt_unit_missing:scene_entry_use_cases',
        'shell_must_remain_not_received_not_run_not_validated_empty_rejected_not_accepted_not_ingested_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_payload_validation_receipt_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
