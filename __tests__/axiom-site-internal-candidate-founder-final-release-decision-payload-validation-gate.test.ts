import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
  type AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneGate(
  gate: AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate,
): AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate {
  return JSON.parse(
    JSON.stringify(gate),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate;
}

describe('Axiom internal candidate Founder final-release decision payload validation gate', () => {
  it('builds a not-run validation gate that rejects the empty payload before ingestion', () => {
    const payloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();
    const gate =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(payloadShell);
    const validation =
      validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(
        gate,
        payloadShell,
      );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(gate).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
      boundary:
        AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_GATE_ROUTE,
      sourcePayloadShellId: payloadShell.shellId,
      sourcePayloadShellStatus:
        'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
      sourcePayloadShellRequiredStatus:
        'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
      gateMode: 'founder_final_release_decision_payload_validation_gate_empty_payload_rejected',
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
      validationUnitCount: 11,
      nextAllowedMovement:
        'payload_validation_can_run_only_after_external_payload_arrives_outside_codex',
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

  it('keeps validation units under the 100-unit cap and covers all fixed surfaces', () => {
    const payloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();
    const gate =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(payloadShell);

    expect(gate.validationUnitCount).toBe(11);
    expect(gate.validationUnitCount).toBeLessThanOrEqual(gate.maxCoreReviewUnits);
    expect(
      gate.validationUnits
        .filter(
          (unit) =>
            unit.unitType ===
            'surface_founder_final_release_decision_payload_validation_gate_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      gate.validationUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_PAYLOAD_VALIDATION_REQUIREMENTS.every((requirement) =>
          unit.requiredValidationRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every validation unit not run, not validated, rejected before ingestion, unaccepted, and unpublished', () => {
    const payloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();
    const gate =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(payloadShell);

    expect(
      gate.validationUnits.every(
        (unit) =>
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

  it('rejects missing surface unit, validation run movement, payload acceptance, and public approval movement', () => {
    const payloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();
    const gate = cloneGate(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(payloadShell),
    );
    gate.validationUnits = gate.validationUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    gate.validationUnitCount = gate.validationUnits.length;
    gate.validationExecutionStatus =
      'run' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate['validationExecutionStatus'];
    gate.payloadAcceptanceStatus =
      'accepted' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate['payloadAcceptanceStatus'];
    gate.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate['movementBoundary']['publicApproval'];

    const validation =
      validateAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(
        gate,
        payloadShell,
      );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'validation_unit_count_must_match_payload_units',
        'surface_validation_unit_missing:scene_entry_use_cases',
        'payload_validation_gate_must_remain_not_run_not_validated_empty_rejected_not_accepted_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_payload_validation_gate_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
