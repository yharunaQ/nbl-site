import {
  AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
  buildAxiomCandidatePageDataBundle,
  validateAxiomCandidatePageDataBundle,
  type AxiomCandidatePageDataBundle,
} from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';
import { AXIOM_L3_EVAL_SCENARIO_IDS } from '@/lib/axiom/interactionHypothesisKernelScenarioFixtures';

function cloneBundle(bundle: AxiomCandidatePageDataBundle): AxiomCandidatePageDataBundle {
  return JSON.parse(JSON.stringify(bundle)) as AxiomCandidatePageDataBundle;
}

describe('Axiom site candidate page data', () => {
  it('builds internal candidate page data for all fixed next NBL surfaces', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();
    const bundle = buildAxiomCandidatePageDataBundle(matrix);
    const validation = validateAxiomCandidatePageDataBundle(bundle, matrix);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(bundle).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_page_data_bundle_not_public_page_implementation',
      boundary: AXIOM_SITE_CANDIDATE_PAGE_DATA_BOUNDARY,
      sourceMatrixId: matrix.matrixId,
      pageCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
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
    expect(bundle.pages.map((page) => page.surface)).toEqual(AXIOM_NEXT_NBL_SITE_SURFACES);
    expect(
      bundle.pages.every(
        (page) => page.scenarioCoverageCount === AXIOM_L3_EVAL_SCENARIO_IDS.length,
      ),
    ).toBe(true);
    expect(bundle.pages.every((page) => page.sectionCount === page.stableSlotCount)).toBe(true);
  });

  it('keeps every section review-required and not published', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();
    const bundle = buildAxiomCandidatePageDataBundle(matrix);
    const sections = bundle.pages.flatMap((page) => page.sections);

    expect(sections.length).toBeGreaterThan(0);
    expect(
      sections.every(
        (section) =>
          section.reviewRequiredBeforePublication &&
          section.publicUseStatus === 'not_public_approved' &&
          section.publicationStatus === 'not_published',
      ),
    ).toBe(true);
    expect(
      sections.every(
        (section) => section.scenarioCoverageCount === AXIOM_L3_EVAL_SCENARIO_IDS.length,
      ),
    ).toBe(true);
  });

  it('keeps hidden and review-routed sections internal-only', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();
    const bundle = buildAxiomCandidatePageDataBundle(matrix);
    const internalOnlySections = bundle.pages.flatMap((page) =>
      page.sections.filter(
        (section) => section.sectionPolicy === 'internal_only_hidden_or_review_routed',
      ),
    );

    expect(internalOnlySections.length).toBeGreaterThan(0);
    expect(
      internalOnlySections.every((section) => section.representativePublicDrafts.length === 0),
    ).toBe(true);
  });

  it('rejects candidate page data that drops a page or moves publication state', () => {
    const matrix = buildAxiomSitePreviewReviewMatrix();
    const bundle = cloneBundle(buildAxiomCandidatePageDataBundle(matrix));
    bundle.pages = bundle.pages.filter((page) => page.surface !== 'scene_entry_use_cases');
    bundle.pageCount = bundle.pages.length;
    bundle.movementBoundary.publicApproval =
      'approved' as unknown as AxiomCandidatePageDataBundle['movementBoundary']['publicApproval'];

    const validation = validateAxiomCandidatePageDataBundle(bundle, matrix);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'page_count_must_match_fixed_next_nbl_surfaces',
        'candidate_page_missing:scene_entry_use_cases',
        'candidate_page_data_must_not_move_approval_validity_promotion_or_learning',
      ]),
    );
  });
});
