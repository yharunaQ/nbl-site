import {
  AXIOM_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_REQUIREMENTS,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY,
  AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_ROUTE,
  buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
  validateAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
  type AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
} from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionIngestionContract';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionReceiptShell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneContract(
  contract: AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract,
): AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract {
  return JSON.parse(
    JSON.stringify(contract),
  ) as AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract;
}

describe('Axiom internal candidate Founder final-release decision ingestion contract', () => {
  it('builds an empty Founder final-release decision ingestion contract without ingesting or deciding release', () => {
    const receiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell();
    const contract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(receiptShell);
    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(
      contract,
      receiptShell,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(contract).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status:
        'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
      boundary: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_BOUNDARY,
      route: AXIOM_INTERNAL_CANDIDATE_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_CONTRACT_ROUTE,
      sourceReceiptShellId: receiptShell.shellId,
      sourceReceiptShellStatus:
        'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
      sourceReceiptShellRequiredStatus:
        'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
      contractMode: 'founder_final_release_decision_ingestion_contract_empty_not_ingested',
      externalDecisionPayloadStatus: 'empty',
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
      ingestionUnitCount: 11,
      nextAllowedMovement:
        'founder_decision_payload_ingestion_allowed_only_after_external_receipt_outside_codex',
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

  it('keeps ingestion units under the 100-unit cap and covers all fixed surfaces', () => {
    const receiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell();
    const contract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(receiptShell);

    expect(contract.ingestionUnitCount).toBe(11);
    expect(contract.ingestionUnitCount).toBeLessThanOrEqual(contract.maxCoreReviewUnits);
    expect(
      contract.ingestionUnits
        .filter(
          (unit) =>
            unit.unitType === 'surface_founder_final_release_decision_ingestion_contract_input',
        )
        .map((unit) => unit.surface),
    ).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      contract.ingestionUnits.every((unit) =>
        AXIOM_FOUNDER_FINAL_RELEASE_DECISION_INGESTION_REQUIREMENTS.every((requirement) =>
          unit.requiredIngestionRequirements.includes(requirement),
        ),
      ),
    ).toBe(true);
  });

  it('keeps every ingestion unit empty, not ingested, not received, undecided, unexecuted, unassigned, unactivated, unapproved, and unpublished', () => {
    const receiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell();
    const contract =
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(receiptShell);

    expect(
      contract.ingestionUnits.every(
        (unit) =>
          unit.externalDecisionPayloadStatus === 'empty' &&
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

  it('rejects missing surface unit, payload movement, ingestion movement, and public approval movement', () => {
    const receiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell();
    const contract = cloneContract(
      buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(receiptShell),
    );
    contract.ingestionUnits = contract.ingestionUnits.filter(
      (unit) => unit.surface !== 'scene_entry_use_cases',
    );
    contract.ingestionUnitCount = contract.ingestionUnits.length;
    contract.externalDecisionPayloadStatus =
      'present' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract['externalDecisionPayloadStatus'];
    contract.ingestionStatus =
      'ingested' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract['ingestionStatus'];
    contract.movementBoundary.publicApproval =
      'approved' as unknown as AxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract['movementBoundary']['publicApproval'];

    const validation = validateAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(
      contract,
      receiptShell,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'ingestion_unit_count_must_match_receipt_units',
        'surface_ingestion_unit_missing:scene_entry_use_cases',
        'ingestion_contract_must_remain_empty_not_ingested_not_received_undecided_unexecuted_unassigned_unactivated_unapproved_and_unpublished',
        'founder_final_release_decision_ingestion_contract_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
