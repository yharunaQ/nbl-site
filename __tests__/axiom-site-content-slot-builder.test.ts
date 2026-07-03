import {
  AXIOM_SITE_CONTENT_SLOT_BOUNDARY,
  buildAxiomSiteContentSlotBundle,
  validateAxiomSiteContentSlotBundle,
  type AxiomSiteContentSlotBundle,
} from '@/lib/axiom/siteContentSlotBuilder';
import { buildAxiomInteractionHypothesisKernelFixtureForScenario } from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';
import { buildAxiomThemeObjectSurfaceSlotFixture } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneBundle(bundle: AxiomSiteContentSlotBundle): AxiomSiteContentSlotBundle {
  return JSON.parse(JSON.stringify(bundle)) as AxiomSiteContentSlotBundle;
}

describe('Axiom site content slot builder', () => {
  it('builds kernel-backed internal content slots from the surface slot contract', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
      'l3_health_time_accommodation_lookup_trap_v0',
    );
    const theme = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
    const bundle = buildAxiomSiteContentSlotBundle(kernel, theme);
    const validation = validateAxiomSiteContentSlotBundle(bundle, theme);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_SITE_CONTENT_SLOT_BOUNDARY,
      coreProgressClass: 'kernel_display',
    });
    expect(bundle).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClass: 'kernel_display',
      status: 'kernel_backed_content_slots_internal_draft',
      sourceKernelId: kernel.kernelId,
      sourceThemeId: theme.themeId,
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
    expect(bundle.slotCount).toBe(
      theme.surfaces.reduce((sum, surface) => sum + surface.slots.length, 0),
    );
    expect(bundle.slots.every((slot) => slot.reviewRequiredBeforePublication)).toBe(true);
  });

  it('keeps hidden and review-routed slots out of public draft text', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
      'l3_public_condition_window_non_lookup_v0',
    );
    const theme = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
    const bundle = buildAxiomSiteContentSlotBundle(kernel, theme);
    const hiddenOrReviewSlots = bundle.slots.filter(
      (slot) => slot.operation === 'hide' || slot.operation === 'route_to_review',
    );

    expect(hiddenOrReviewSlots.length).toBeGreaterThan(0);
    expect(hiddenOrReviewSlots.every((slot) => slot.publicDraft === null)).toBe(true);
    expect(hiddenOrReviewSlots.every((slot) => slot.internalDraft.length > 0)).toBe(true);
  });

  it('creates public-readable drafts only as review-required drafts', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
      'l3_post_hiring_quality_evaluation_loop_v0',
    );
    const theme = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
    const bundle = buildAxiomSiteContentSlotBundle(kernel, theme);
    const publicDraftSlots = bundle.slots.filter((slot) => slot.publicDraft !== null);

    expect(publicDraftSlots.length).toBeGreaterThan(0);
    expect(publicDraftSlots.every((slot) => slot.publicUseStatus === 'not_public_approved')).toBe(
      true,
    );
    expect(publicDraftSlots.every((slot) => slot.publicationStatus === 'not_published')).toBe(true);
    expect(
      publicDraftSlots.every((slot) => slot.publicDraft?.includes('Draft requires review')),
    ).toBe(true);
  });

  it('rejects content slots that drift from the theme contract or publish themselves', () => {
    const kernel = buildAxiomInteractionHypothesisKernelFixtureForScenario(
      'l3_health_time_accommodation_lookup_trap_v0',
    );
    const theme = buildAxiomThemeObjectSurfaceSlotFixture(kernel);
    const bundle = cloneBundle(buildAxiomSiteContentSlotBundle(kernel, theme));
    bundle.slots[0].slotId = 'unexpected:slot:id';
    bundle.slots[0].publicationStatus =
      'published' as unknown as AxiomSiteContentSlotBundle['slots'][number]['publicationStatus'];
    bundle.movementBoundary.publication =
      'published' as unknown as AxiomSiteContentSlotBundle['movementBoundary']['publication'];

    const validation = validateAxiomSiteContentSlotBundle(bundle, theme);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'slot_not_defined_by_theme:unexpected:slot:id',
        'slot_must_not_be_public_approved_or_published:unexpected:slot:id',
        'public_approval_publication_or_promotion_must_not_move',
      ]),
    );
  });
});
