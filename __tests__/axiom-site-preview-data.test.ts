import {
  AXIOM_SITE_PREVIEW_DATA_BOUNDARY,
  buildDefaultAxiomSitePreviewData,
  validateAxiomSitePreviewData,
  type AxiomSitePreviewData,
} from '@/lib/axiom/sitePreviewData';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function clonePreviewData(data: AxiomSitePreviewData): AxiomSitePreviewData {
  return JSON.parse(JSON.stringify(data)) as AxiomSitePreviewData;
}

describe('Axiom site preview data', () => {
  it('builds a route-level internal preview data object for all fixed next NBL surfaces', () => {
    const previewData = buildDefaultAxiomSitePreviewData();
    const validation = validateAxiomSitePreviewData(previewData);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_SITE_PREVIEW_DATA_BOUNDARY,
      coreProgressClass: 'kernel_display',
    });
    expect(previewData).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_display',
      status: 'internal_preview_not_public_release',
      boundary: AXIOM_SITE_PREVIEW_DATA_BOUNDARY,
      sourceScenarioId: 'l3_health_time_accommodation_lookup_trap_v0',
      sourceKernel: {
        kernelCoreProgressClass: 'kernel_build',
        reviewUnit: 'kernel_contract',
        reviewUnitScale: 'framework_unit_not_instance_hypothesis',
      },
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        knowledgePromotion: 'not_promoted',
      },
    });
    expect(previewData.surfaceCount).toBe(AXIOM_NEXT_NBL_SITE_SURFACES.length);
    expect(previewData.surfaces.map((surface) => surface.surface)).toEqual(
      AXIOM_NEXT_NBL_SITE_SURFACES,
    );
    expect(previewData.surfaces.every((surface) => surface.slotCount > 0)).toBe(true);
    expect(
      previewData.surfaces.every(
        (surface) => surface.reviewRequiredSlotCount === surface.slotCount,
      ),
    ).toBe(true);
  });

  it('preserves the inherited site skeleton while keeping it a Falcon bootstrap prior', () => {
    const previewData = buildDefaultAxiomSitePreviewData();

    expect(
      previewData.surfaces.find((surface) => surface.surface === 'reader_facing_top_home'),
    ).toBeDefined();
    expect(
      previewData.surfaces.find((surface) => surface.surface === 'work_condition_window'),
    ).toBeDefined();
    expect(
      previewData.surfaces.find(
        (surface) => surface.surface === 'consultation_case_reading_collection',
      ),
    ).toBeDefined();
    expect(
      previewData.surfaces.find(
        (surface) => surface.surface === 'twenty_one_views_work_design_guide',
      ),
    ).toBeDefined();
    expect(
      previewData.surfaces.find((surface) => surface.surface === 'theory_method_trust_page'),
    ).toBeDefined();
    expect(
      previewData.surfaces.find((surface) => surface.surface === 'article_social_question_library'),
    ).toBeDefined();
    expect(
      previewData.surfaces.find(
        (surface) => surface.surface === 'cognitive_support_toolkit_studio_multimodal_objects',
      ),
    ).toBeDefined();
    expect(
      previewData.surfaces.find((surface) => surface.surface === 'about_operating_boundary_page'),
    ).toBeDefined();
    expect(
      previewData.surfaces.find((surface) => surface.surface === 'scene_entry_use_cases'),
    ).toBeDefined();
  });

  it('keeps hidden and review-routed fields out of public drafts', () => {
    const previewData = buildDefaultAxiomSitePreviewData();
    const snsSurface = previewData.surfaces.find(
      (surface) => surface.surface === 'scene_entry_use_cases',
    );
    const reviewRoutedSlots = previewData.contentSlotBundle.slots.filter(
      (slot) => slot.operation === 'route_to_review',
    );
    const hiddenSlots = previewData.contentSlotBundle.slots.filter(
      (slot) => slot.operation === 'hide',
    );

    expect(snsSurface?.hiddenFields).toEqual(expect.arrayContaining(['inference']));
    expect(reviewRoutedSlots.length).toBeGreaterThan(0);
    expect(hiddenSlots.length).toBeGreaterThan(0);
    expect([...reviewRoutedSlots, ...hiddenSlots].every((slot) => slot.publicDraft === null)).toBe(
      true,
    );
  });

  it('rejects preview data that drops a surface or moves publication state', () => {
    const previewData = clonePreviewData(buildDefaultAxiomSitePreviewData());
    previewData.surfaces = previewData.surfaces.filter(
      (surface) => surface.surface !== 'scene_entry_use_cases',
    );
    previewData.surfaceCount = previewData.surfaces.length;
    previewData.movementBoundary.publication =
      'published' as unknown as AxiomSitePreviewData['movementBoundary']['publication'];

    const validation = validateAxiomSitePreviewData(previewData);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'surface_count_must_match_fixed_next_nbl_site_surfaces',
        'surface_missing:scene_entry_use_cases',
        'public_approval_publication_or_promotion_must_not_move',
      ]),
    );
  });
});
