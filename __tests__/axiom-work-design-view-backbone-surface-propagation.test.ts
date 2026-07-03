import {
  AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY,
  buildAxiomWorkDesignViewBackboneSurfacePropagation,
  validateAxiomWorkDesignViewBackboneSurfacePropagation,
  type AxiomWorkDesignViewBackboneSurfacePropagation,
} from '@/lib/axiom/workDesignViewBackboneSurfacePropagation';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePropagation(
  propagation: AxiomWorkDesignViewBackboneSurfacePropagation,
): AxiomWorkDesignViewBackboneSurfacePropagation {
  return JSON.parse(JSON.stringify(propagation)) as AxiomWorkDesignViewBackboneSurfacePropagation;
}

describe('Axiom work-design view backbone surface propagation', () => {
  it('propagates the reconstructed work-design backbone to all 9 next-NBL surfaces', () => {
    const propagation = buildAxiomWorkDesignViewBackboneSurfacePropagation();
    const validation = validateAxiomWorkDesignViewBackboneSurfacePropagation(propagation);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'work_design_view_backbone_surface_propagation_valid',
      errorCount: 0,
      boundary: AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY,
    });
    expect(propagation).toMatchObject({
      objectType: 'axiom_work_design_view_backbone_surface_propagation',
      lane: 'Falcon Lab',
      status: 'semantic_backbone_surface_propagation_ready_internal',
      surfaceCount: 9,
      downstreamSurfaceCount: 8,
      slotCandidateCount: 9,
      contentSourcePolicy:
        'propagate_reconstructed_work_design_view_backbone_to_surfaces_not_falcon_copy_or_public_copy',
    });
    expect(propagation.surfaceSlots.map((slot) => slot.surface)).toEqual([
      ...AXIOM_NEXT_NBL_SITE_SURFACES,
    ]);
    expect(propagation.coverage.downstreamSurfaceIds).not.toContain(
      'twenty_one_views_work_design_guide',
    );
    expect(propagation.coverage.representedSeedDraftIds).toHaveLength(27);
    expect(propagation.coverage.representedSectionDraftIds).toHaveLength(5);
  });

  it('keeps surface-specific selection counts without treating 27 seeds as final public views', () => {
    const propagation = buildAxiomWorkDesignViewBackboneSurfacePropagation();
    const bySurface = new Map(propagation.surfaceSlots.map((slot) => [slot.surface, slot]));

    expect(bySurface.get('reader_facing_top_home')).toMatchObject({
      propagationMode: 'reader_entry_frame',
      operation: 'translate',
      sourceSeedCount: 27,
      sourceSectionCount: 5,
    });
    expect(bySurface.get('twenty_one_views_work_design_guide')).toMatchObject({
      propagationMode: 'source_work_design_views_guide',
      operation: 'display',
      sourceSeedCount: 27,
      sourceSectionCount: 5,
    });
    expect(bySurface.get('consultation_case_reading_collection')).toMatchObject({
      propagationMode: 'case_reading_lens',
      sourceSeedCount: 21,
      sourceSectionCount: 5,
    });
    expect(bySurface.get('cognitive_support_toolkit_studio_multimodal_objects')).toMatchObject({
      propagationMode: 'toolkit_object_backbone',
      sourceSeedCount: 21,
      sourceSectionCount: 5,
    });
    expect(bySurface.get('theory_method_trust_page')).toMatchObject({
      propagationMode: 'method_and_trust_explanation',
      sourceSeedCount: 7,
      sourceSectionCount: 1,
    });
    expect(bySurface.get('about_operating_boundary_page')).toMatchObject({
      propagationMode: 'operating_boundary_explanation',
      sourceSeedCount: 6,
      sourceSectionCount: 1,
    });
    expect(bySurface.get('scene_entry_use_cases')).toMatchObject({
      propagationMode: 'scene_entry_use_case_route',
      operation: 'translate',
      sourceSeedCount: 27,
      sourceSectionCount: 5,
    });
    expect(propagation.mustNotTreatAs).toEqual(
      expect.arrayContaining(['public_copy', 'public_navigation', 'final_view_count']),
    );
  });

  it('keeps every propagated slot review-required, internal, unpublished, and traceable', () => {
    const propagation = buildAxiomWorkDesignViewBackboneSurfacePropagation();

    for (const slot of propagation.surfaceSlots) {
      expect(slot.reviewRoute).toBe('semantic_backbone_surface_copy_review_before_public_use');
      expect(slot.semanticReviewStatus).toBe('review_required_not_review_completed');
      expect(slot.publicUseStatus).toBe('not_public_approved');
      expect(slot.publicationStatus).toBe('not_published');
      expect(slot.sourceSemanticReconstructionId).toBe(propagation.sourceSemanticReconstructionId);
      expect(slot.sourceSeedDraftIds.length).toBeGreaterThan(0);
      expect(slot.sourceSectionDraftIds.length).toBeGreaterThan(0);
      expect(slot.surfaceTranslationCandidateJa).toMatch(
        /public copyではなくreview-required content slot候補/,
      );
    }
    expect(propagation.reviewPolicy).toEqual({
      reviewUnitScale: 'surface_backbone_slot_unit_not_individual_hypothesis',
      reviewRequiredBeforePublicUse: true,
      sourceSemanticReviewStatus: 'semantic_reconstruction_not_public_approved',
    });
  });

  it('rejects propagation artifacts that lose coverage or become public/runtime movement', () => {
    const propagation = clonePropagation(buildAxiomWorkDesignViewBackboneSurfacePropagation());

    propagation.surfaceSlots = propagation.surfaceSlots.slice(0, 8);
    propagation.slotCandidateCount = 8 as 9;
    propagation.surfaceSlots[0].sourceSeedDraftIds = [];
    propagation.surfaceSlots[0].sourceSeedCount = 0;
    propagation.surfaceSlots[0].publicUseStatus = 'public_approved' as 'not_public_approved';
    propagation.notNow = propagation.notNow.filter(
      (item) => item !== 'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    );

    const validation = validateAxiomWorkDesignViewBackboneSurfacePropagation(propagation);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'propagation_must_cover_nine_surfaces_with_eight_downstream_surfaces_in_fixed_order',
        'not_now_must_block_public_copy_navigation_runtime_and_learning',
        'surface_slot_missing_seed_backbone:reader_facing_top_home',
        'surface_slot_must_remain_review_required_not_public:reader_facing_top_home',
      ]),
    );
  });
});
