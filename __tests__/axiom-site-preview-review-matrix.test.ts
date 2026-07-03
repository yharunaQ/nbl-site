import {
  AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY,
  buildAxiomSitePreviewReviewMatrix,
  validateAxiomSitePreviewReviewMatrix,
  type AxiomSitePreviewReviewMatrix,
} from '@/lib/axiom/sitePreviewReviewMatrix';
import { AXIOM_L3_EVAL_SCENARIO_IDS } from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneMatrix(matrix: AxiomSitePreviewReviewMatrix): AxiomSitePreviewReviewMatrix {
  return JSON.parse(JSON.stringify(matrix)) as AxiomSitePreviewReviewMatrix;
}

describe('Axiom site preview review matrix', () => {
  it('builds a multi-scenario preview/review matrix across all L3 fixtures', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();
    const validation = validateAxiomSitePreviewReviewMatrix(matrix);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY,
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
    });
    expect(matrix).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_eval', 'kernel_display', 'kernel_human_review_loop'],
      status: 'multi_scenario_internal_preview_review_matrix_not_public_release',
      boundary: AXIOM_SITE_PREVIEW_REVIEW_MATRIX_BOUNDARY,
      scenarioCount: AXIOM_L3_EVAL_SCENARIO_IDS.length,
      surfaceCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        sourceValidity: 'not_decided',
        supportValidity: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        knowledgePromotion: 'not_promoted',
        learningUpdate: 'not_updated',
      },
    });
    expect(matrix.scenarios.map((scenario) => scenario.scenarioId)).toEqual(
      AXIOM_L3_EVAL_SCENARIO_IDS,
    );
    expect(matrix.scenarios.every((scenario) => scenario.reviewUnitCount === 11)).toBe(true);
    expect(matrix.scenarios.every((scenario) => scenario.reviewUnitCount <= 100)).toBe(true);
  });

  it('derives stable candidate page-slot data for every fixed surface', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();

    expect(matrix.stableSurfacePageSlots.map((surface) => surface.surface)).toEqual(
      AXIOM_NEXT_NBL_SITE_SURFACES,
    );
    expect(
      matrix.stableSurfacePageSlots.every(
        (surface) => surface.scenarioCoverageCount === AXIOM_L3_EVAL_SCENARIO_IDS.length,
      ),
    ).toBe(true);
    expect(matrix.stableSurfacePageSlots.every((surface) => surface.stableSlotCount > 0)).toBe(
      true,
    );
    expect(
      matrix.stableSurfacePageSlots.every((surface) =>
        surface.candidateSlots.every(
          (slot) => slot.scenarioCoverageCount === AXIOM_L3_EVAL_SCENARIO_IDS.length,
        ),
      ),
    ).toBe(true);
  });

  it('keeps public-boundary slots out of public draft candidates across the matrix', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();
    const hiddenOrReviewSlots = matrix.stableSurfacePageSlots.flatMap((surface) =>
      surface.candidateSlots.filter(
        (slot) => slot.operation === 'hide' || slot.operation === 'route_to_review',
      ),
    );
    const snsSurface = matrix.stableSurfacePageSlots.find(
      (surface) => surface.surface === 'scene_entry_use_cases',
    );

    expect(hiddenOrReviewSlots.length).toBeGreaterThan(0);
    expect(hiddenOrReviewSlots.every((slot) => slot.representativePublicDrafts.length === 0)).toBe(
      true,
    );
    expect(snsSurface?.hiddenFields).toEqual(expect.arrayContaining(['inference']));
    expect(snsSurface?.reviewRoutedFields).toEqual(expect.arrayContaining(['humanReviewRoute']));
  });

  it('preserves actionability differences without turning them into public approval', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();

    expect(matrix.scenarios.map((scenario) => scenario.actionabilityBand)).toEqual(
      expect.arrayContaining([
        'usable_provisional_insight',
        'question_first_only',
        'public_boundary_blocked',
      ]),
    );
    expect(
      matrix.scenarios.every((scenario) => scenario.previewValidationStatus === 'contract_valid'),
    ).toBe(true);
    expect(
      matrix.scenarios.every((scenario) => scenario.reviewValidationStatus === 'contract_valid'),
    ).toBe(true);
  });

  it('rejects missing scenarios, surface coverage loss, and approval movement', () => {
    const matrix = cloneMatrix(buildAxiomSitePreviewReviewMatrix());
    matrix.scenarios = matrix.scenarios.filter(
      (scenario) => scenario.scenarioId !== 'l3_public_condition_window_non_lookup_v0',
    );
    matrix.scenarioCount = matrix.scenarios.length;
    matrix.stableSurfacePageSlots[0].candidateSlots[0].scenarioCoverageCount = 1;
    matrix.movementBoundary.publicApproved =
      'approved' as unknown as AxiomSitePreviewReviewMatrix['movementBoundary']['publicApproved'];

    const validation = validateAxiomSitePreviewReviewMatrix(matrix);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'scenario_count_must_match_all_l3_eval_scenarios',
        'scenario_missing:l3_public_condition_window_non_lookup_v0',
        `stable_slot_must_cover_all_scenarios:${matrix.stableSurfacePageSlots[0].candidateSlots[0].stableSlotId}`,
        'matrix_must_not_move_approval_validity_promotion_or_learning',
      ]),
    );
  });
});
