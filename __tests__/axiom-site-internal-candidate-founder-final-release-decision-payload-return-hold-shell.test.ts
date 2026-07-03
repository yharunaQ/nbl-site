import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneShell(
  shell: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell,
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell {
  return JSON.parse(
    JSON.stringify(shell),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell;
}

function buildSources() {
  const payloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();
  const validationGate =
    buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(payloadShell);
  const validationReceiptShell =
    buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
      validationGate,
    );

  return { payloadShell, validationGate, validationReceiptShell };
}

describe('Axiom internal candidate Founder final-release decision payload return hold shell', () => {
  it('builds a payload return/hold shell without receiving, validating, ingesting, or deciding release', () => {
    const { payloadShell, validationGate, validationReceiptShell } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
        validationReceiptShell,
      );
    const validation =
      validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
        shell,
        validationReceiptShell,
        validationGate,
        payloadShell,
      );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(shell).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_payload_return_hold_shell_prepared_empty_payload_return_hold_not_released',
      boundary:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_BOUNDARY,
      route:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_SHELL_ROUTE,
      sourceValidationReceiptShellId: validationReceiptShell.shellId,
      sourceValidationReceiptShellStatus:
        'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
      sourceValidationReceiptShellRequiredStatus:
        'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
      shellMode:
        'founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion',
      returnHoldStatus: 'payload_return_hold_prepared',
      returnTargetStatus: 'external_payload_shell_completion_required',
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
      returnHoldUnitCount: 11,
      nextAllowedMovement:
        'external_payload_shell_may_be_completed_outside_codex_then_validation_gate_may_be_rebuilt',
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

  it('keeps return hold units under the 100-unit cap and covers all fixed surfaces', () => {
    const { validationReceiptShell } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
        validationReceiptShell,
      );

    expect(shell.returnHoldUnitCount).toBe(11);
    expect(shell.returnHoldUnitCount).toBeLessThanOrEqual(shell.maxCoreReviewUnits);
    expect(
      shell.returnHoldUnits
        .filter(
          (unit) =>
            unit.unitType ===
            'surface_founder_final_release_decision_payload_return_hold_shell_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      shell.returnHoldUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_RETURN_HOLD_REQUIREMENTS.every((requirement) =>
          unit.requiredReturnHoldRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every return hold unit not received, not run, not validated, empty, rejected, not accepted, not ingested, unapproved, and unpublished', () => {
    const { validationReceiptShell } = buildSources();
    const shell =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
        validationReceiptShell,
      );

    expect(
      shell.returnHoldUnits.every(
        (unit) =>
          unit.returnHoldStatus === 'payload_return_hold_prepared' &&
          unit.returnTargetStatus === 'external_payload_shell_completion_required' &&
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

  it('rejects missing surface unit, accepted payload, ingested payload, and public approval movement', () => {
    const { payloadShell, validationGate, validationReceiptShell } = buildSources();
    const shell = cloneShell(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
        validationReceiptShell,
      ),
    );
    shell.returnHoldUnits = shell.returnHoldUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    shell.returnHoldUnitCount = shell.returnHoldUnits.length;
    shell.payloadAcceptanceStatus =
      'accepted' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell['payloadAcceptanceStatus'];
    shell.ingestionStatus =
      'ingested' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell['ingestionStatus'];
    shell.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell['movementBoundary']['publicApproval'];

    const validation =
      validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
        shell,
        validationReceiptShell,
        validationGate,
        payloadShell,
      );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'return_hold_unit_count_must_match_validation_receipt_units',
        'surface_payload_return_hold_unit_missing:scene_entry_use_cases',
        'shell_must_remain_return_hold_not_received_not_run_not_validated_empty_rejected_not_accepted_not_ingested_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_payload_return_hold_shell_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
