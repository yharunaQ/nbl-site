import {
  AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY,
  buildAxiomReviewedKernelBackedCandidatePageAssembly,
  validateAxiomReviewedKernelBackedCandidatePageAssembly,
  type AxiomReviewedKernelBackedCandidatePageAssembly,
} from '@/lib/axiom/reviewedKernelBackedCandidatePageAssembly';
import { buildAxiomReviewedKernelBackedPublicContentSlotBundle } from '@/lib/axiom/reviewedKernelBackedPublicContentSlots';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function cloneAssembly(
  assembly: AxiomReviewedKernelBackedCandidatePageAssembly,
): AxiomReviewedKernelBackedCandidatePageAssembly {
  return JSON.parse(JSON.stringify(assembly)) as AxiomReviewedKernelBackedCandidatePageAssembly;
}

describe('Axiom reviewed kernel-backed candidate page assembly', () => {
  it('assembles 9 internal candidate pages from reviewed kernel-backed public slots', () => {
    const slotBundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();
    const assembly = buildAxiomReviewedKernelBackedCandidatePageAssembly(slotBundle);
    const validation = validateAxiomReviewedKernelBackedCandidatePageAssembly(assembly, slotBundle);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'reviewed_kernel_backed_candidate_page_assembly_valid',
      errorCount: 0,
      boundary: AXIOM_REVIEWED_KERNEL_BACKED_CANDIDATE_PAGE_ASSEMBLY_BOUNDARY,
    });
    expect(assembly).toMatchObject({
      objectType: 'axiom_reviewed_kernel_backed_candidate_page_assembly',
      lane: 'Falcon Lab',
      status: 'reviewed_kernel_backed_candidate_pages_ready_internal',
      pageCount: 9,
      sectionCount: 37,
      sourceSlotCount: 37,
      sourceKernelRowCount: 15,
      sourceReviewUnitCount: 18,
    });
    expect(assembly.pages.map((page) => page.surface)).toEqual([...AXIOM_NEXT_NBL_SITE_SURFACES]);
    expect(assembly.coverage.surfacesCovered).toEqual([...AXIOM_NEXT_NBL_SITE_SURFACES]);
  });

  it('represents every reviewed source slot exactly once as an internal page section', () => {
    const slotBundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();
    const assembly = buildAxiomReviewedKernelBackedCandidatePageAssembly(slotBundle);
    const sourceSlotIds = slotBundle.surfaces.flatMap((surface) =>
      surface.slots.map((slot) => slot.slotId),
    );
    const sectionSlotIds = assembly.pages.flatMap((page) =>
      page.sections.map((section) => section.sourceSlotId),
    );

    expect([...sectionSlotIds].sort()).toEqual([...sourceSlotIds].sort());
    expect(assembly.coverage.representedSlotIds.sort()).toEqual([...sourceSlotIds].sort());
    expect(assembly.coverage.representedKernelRowIds).toHaveLength(15);
    expect(assembly.coverage.representedReviewUnitIds.length).toBeGreaterThan(0);
  });

  it('keeps route intent separate from actual public navigation and publication', () => {
    const assembly = buildAxiomReviewedKernelBackedCandidatePageAssembly();

    for (const page of assembly.pages) {
      expect(page.routeIntent).toMatch(/^future_/);
      expect(page.routeStatus).toBe('route_intent_only_actual_public_navigation_not_created');
      expect(page.pageStatus).toBe('internal_candidate_page_data_from_reviewed_kernel_slots');
      expect(page.publicUseStatus).toBe('not_public_approved');
      expect(page.publicationStatus).toBe('not_published');
    }
  });

  it('keeps hidden and review-routed slot sections without public body text', () => {
    const assembly = buildAxiomReviewedKernelBackedCandidatePageAssembly();
    const hiddenOrReviewSections = assembly.pages.flatMap((page) =>
      page.sections.filter(
        (section) => section.operation === 'hide' || section.operation === 'route_to_review',
      ),
    );
    const displayOrTranslateSections = assembly.pages.flatMap((page) =>
      page.sections.filter(
        (section) => section.operation === 'display' || section.operation === 'translate',
      ),
    );

    expect(hiddenOrReviewSections.length).toBeGreaterThan(0);
    expect(hiddenOrReviewSections.every((section) => section.bodyDraftJa === null)).toBe(true);
    expect(displayOrTranslateSections.length).toBeGreaterThan(0);
    expect(
      displayOrTranslateSections.every((section) => section.bodyDraftJa !== null),
    ).toBe(true);
  });

  it('rejects missing surfaces, missing slot representation, public navigation, or publication movement', () => {
    const slotBundle = buildAxiomReviewedKernelBackedPublicContentSlotBundle();
    const assembly = cloneAssembly(buildAxiomReviewedKernelBackedCandidatePageAssembly(slotBundle));

    assembly.pages = assembly.pages.filter((page) => page.surface !== 'scene_entry_use_cases');
    assembly.pageCount = 8 as 9;
    assembly.coverage.representedSlotIds = assembly.coverage.representedSlotIds.slice(0, 36);
    assembly.pages[0].routeStatus =
      'public_route_created' as unknown as 'route_intent_only_actual_public_navigation_not_created';
    assembly.movementBoundary.publication = 'published' as unknown as 'not_published';
    assembly.notNow = assembly.notNow.filter(
      (item) => item !== 'no_actual_public_navigation_from_route_intent',
    );

    const validation = validateAxiomReviewedKernelBackedCandidatePageAssembly(
      assembly,
      slotBundle,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'assembly_must_cover_nine_surfaces_in_fixed_order',
        'coverage_must_represent_every_source_slot',
        expect.stringContaining('page_must_not_create_actual_public_navigation:'),
        'movement_boundary_must_not_move_navigation_finality_publication_runtime_promotion_or_learning',
        'not_now_must_block_navigation_finality_publication_runtime_learning_and_sensitive_source_export',
      ]),
    );
  });
});
