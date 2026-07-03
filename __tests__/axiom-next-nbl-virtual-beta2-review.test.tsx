import { render, screen } from '@testing-library/react';
import AxiomNextNblVirtualBeta2ReviewPage from '@/pages/internal/axiom-next-nbl-virtual-beta2-review';
import {
  buildAxiomNextNblVirtualBeta2Run,
  validateAxiomNextNblVirtualBeta2Run,
} from '@/lib/axiom/nextNblVirtualBeta2Review';

describe('Axiom next NBL virtual beta 2 review', () => {
  it('builds a valid beta2 comprehensive review across all 9 public-candidate pages', () => {
    const run = buildAxiomNextNblVirtualBeta2Run();
    const validation = validateAxiomNextNblVirtualBeta2Run(run);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_next_nbl_virtual_beta2_review_run_valid',
      errorCount: 0,
    });
    expect(run.status).toBe('internal_virtual_beta2_review_completed_not_public_approval');
    expect(run.pageCount).toBe(9);
    expect(run.pageReviews).toHaveLength(9);
    expect(run.crossSiteReviews.length).toBeGreaterThanOrEqual(4);
    expect(run.businessReviews.length).toBeGreaterThanOrEqual(3);
    expect(run.priorityImprovements.length).toBeGreaterThanOrEqual(6);
    expect(run.findingCount).toBeGreaterThanOrEqual(22);

    expect(run.pageReviews.map((review) => review.pageSlug)).toEqual([
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ]);
  });

  it('records mixed readiness instead of flattening every page into complete or incomplete', () => {
    const run = buildAxiomNextNblVirtualBeta2Run();
    const readiness = new Set(run.pageReviews.map((review) => review.readiness));

    expect(Array.from(readiness)).toEqual(
      expect.arrayContaining([
        'near_candidate_ready',
        'needs_targeted_polish',
        'needs_visual_and_copy_qa',
      ]),
    );

    for (const review of run.pageReviews) {
      expect(review.betaFindings.length).toBeGreaterThanOrEqual(2);
      expect(review.finalQaChecksJa.length).toBeGreaterThanOrEqual(3);
      expect(review.recommendedNextActionJa.length).toBeGreaterThan(10);
    }
  });

  it('keeps public approval, publication, runtime, personal-data, case-judgment, and learning boundaries closed', () => {
    const run = buildAxiomNextNblVirtualBeta2Run();

    expect(run.notNow).toEqual(
      expect.arrayContaining([
        'no_public_approval',
        'no_publication_execution',
        'no_actual_public_navigation_change',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_individual_consultation_or_case_judgment',
        'no_personal_data_collection_or_feedback_form_activation',
        'no_learning_update_from_virtual_beta2',
      ]),
    );
  });

  it('renders beta2 as a readable internal comprehensive review page', () => {
    render(<AxiomNextNblVirtualBeta2ReviewPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'ベータ2総合レビュー：公開前QAへ進む。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('横断レビュー')).toBeInTheDocument();
    expect(screen.getByText('9ページ別レビュー')).toBeInTheDocument();
    expect(screen.getByText('NBL事業チームとしての使い道')).toBeInTheDocument();
    expect(screen.getByText('公開前に優先して直すこと')).toBeInTheDocument();
    expect(screen.getByText('Image-2.0図解と本文の一致')).toBeInTheDocument();
    expect(screen.getByText('NBLレポート')).toBeInTheDocument();
    expect(screen.getByText('今回動かしていない境界')).toBeInTheDocument();
    expect(screen.getByText('no_learning_update_from_virtual_beta2')).toBeInTheDocument();
  });
});
