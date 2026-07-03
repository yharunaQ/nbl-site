import {
  AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY,
  buildAxiomReviewedKernelBackedPublicContentSlotBundle,
  validateAxiomReviewedKernelBackedPublicContentSlotBundle,
  type AxiomReviewedKernelBackedPublicContentSlotBundle,
} from '@/lib/axiom/reviewedKernelBackedPublicContentSlots';
import {
  AXIOM_KERNEL_FIELD_IDS,
  AXIOM_NEXT_NBL_SITE_SURFACES,
} from '@/lib/axiom/siteSurfaceSlotContract';

function cloneBundle(
  bundle: AxiomReviewedKernelBackedPublicContentSlotBundle,
): AxiomReviewedKernelBackedPublicContentSlotBundle {
  return JSON.parse(JSON.stringify(bundle)) as AxiomReviewedKernelBackedPublicContentSlotBundle;
}

describe('Axiom reviewed kernel-backed public content slots', () => {
  it('builds 9 next NBL public-surface slots from the Founder-accepted kernel review result', () => {
    const bundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();
    const validation = validateAxiomReviewedKernelBackedPublicContentSlotBundle(bundle);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'reviewed_kernel_backed_public_content_slot_bundle_valid',
      errorCount: 0,
      boundary: AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY,
    });
    expect(bundle).toMatchObject({
      objectType: 'axiom_reviewed_kernel_backed_public_content_slot_bundle',
      lane: 'Falcon Lab',
      status: 'reviewed_kernel_backed_public_content_slots_ready_internal',
      sourceReviewResultStatus:
        'founder_review_result_received_all_units_accept_provisional_kernel_structure',
      sourceReviewResultOverallDecision: 'all_units_accept_as_provisional_kernel_structure',
      surfaceCount: 9,
      sourceKernelRowCount: 15,
      sourceReviewUnitCount: 18,
    });
    expect(bundle.surfaces.map((surface) => surface.surface)).toEqual([
      ...AXIOM_NEXT_NBL_SITE_SURFACES,
    ]);
    expect(bundle.coverage.surfacesCovered).toEqual([...AXIOM_NEXT_NBL_SITE_SURFACES]);
  });

  it('covers all reviewed kernel rows and all allowed kernel bridge fields', () => {
    const bundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();
    const fields = new Set(
      bundle.surfaces.flatMap((surface) => surface.slots.map((slot) => slot.field)),
    );

    expect(bundle.coverage.coveredKernelRowIds).toHaveLength(15);
    expect(bundle.coverage.kernelFieldsCovered).toEqual([...AXIOM_KERNEL_FIELD_IDS]);
    for (const field of AXIOM_KERNEL_FIELD_IDS) {
      expect(fields.has(field)).toBe(true);
    }
    expect(bundle.coverage.coveredScenarioIds).toEqual(
      expect.arrayContaining([
        'l3_health_time_accommodation_lookup_trap_v0',
        'l3_disclosure_information_procedure_boundary_v0',
        'l3_policy_service_coordination_source_lens_v0',
        'l3_public_condition_window_non_lookup_v0',
        'l3_post_hiring_quality_evaluation_loop_v0',
      ]),
    );
  });

  it('renders scene entry as reviewed low-cognitive-load scene translation', () => {
    const bundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();
    const scene = bundle.surfaces.find(
      (surface) => surface.surface === 'scene_entry_use_cases',
    );
    const home = bundle.surfaces.find((surface) => surface.surface === 'reader_facing_top_home');

    expect(scene?.navigationRoleJa).toBe(
      '4コマと場面から入り、抽象説明より先に問題状況と見方の転換をつかむ。',
    );
    expect(scene?.slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'observation',
          operation: 'translate',
          publicSlotLabelJa: '4コマの場面',
          reviewRoute: 'ready_for_public_copy_review_before_final_public_approval',
        }),
        expect.objectContaining({
          field: 'inference',
          operation: 'translate',
          publicSlotLabelJa: '場面の読み替え',
          reviewRoute: 'ready_for_public_copy_review_before_final_public_approval',
        }),
        expect.objectContaining({
          field: 'counterHypothesis',
          operation: 'translate',
          publicSlotLabelJa: '別の見方',
        }),
        expect.objectContaining({
          field: 'missingContext',
          operation: 'display',
          publicSlotLabelJa: '次に確認すること',
        }),
      ]),
    );
    expect(scene?.slots.every((slot) => slot.publicDraftJa !== null)).toBe(true);
    expect(home?.slots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'observation',
          operation: 'translate',
          reviewRoute: 'ready_for_public_copy_review_before_final_public_approval',
        }),
      ]),
    );
    expect(
      home?.slots.find((slot) => slot.field === 'observation')?.publicDraftJa,
    ).toContain('入口の問題信号');
  });

  it('carries explicit non-claims so public slots do not become final support validity or individual judgment', () => {
    const bundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();

    for (const slot of bundle.surfaces.flatMap((surface) => surface.slots)) {
      expect(slot.mustNotClaim).toEqual([
        'final_support_validity',
        'source_support_validity_finality',
        'candidate_pattern_promotion',
        'individual_case_final_judgment',
        'medical_legal_or_job_placement_finality',
        'raw_sensitive_source_text_or_field_values',
      ]);
      expect(slot.publicUseStatus).toBe(
        'kernel_backed_public_interface_draft_not_public_approved',
      );
      expect(slot.publicationStatus).toBe('not_published');
    }
  });

  it('rejects partial surface coverage, publication movement, and sensitive/finality boundary loss', () => {
    const bundle = cloneBundle(buildAxiomReviewedKernelBackedPublicContentSlotBundle());

    bundle.surfaces = bundle.surfaces.filter(
      (surface) => surface.surface !== 'work_condition_window',
    );
    bundle.surfaceCount = 8 as 9;
    bundle.coverage.coveredKernelRowIds = bundle.coverage.coveredKernelRowIds.slice(0, 14);
    bundle.movementBoundary.publication = 'published' as unknown as 'not_published';
    bundle.notNow = bundle.notNow.filter(
      (item) => item !== 'no_raw_sensitive_source_text_or_field_values_export',
    );

    const validation = validateAxiomReviewedKernelBackedPublicContentSlotBundle(bundle);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'bundle_must_cover_nine_next_nbl_surfaces_in_fixed_order',
        'bundle_must_cover_all_15_kernel_rows',
        'movement_boundary_must_not_move_finality_publication_runtime_promotion_or_learning',
        'not_now_must_block_finality_publication_runtime_learning_and_sensitive_source_export',
      ]),
    );
  });
});
