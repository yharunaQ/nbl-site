import { render, screen } from '@testing-library/react';
import AxiomReviewedNextNblPagesPage from '@/pages/internal/axiom-reviewed-next-nbl-pages';

describe('Axiom reviewed next NBL pages internal surface', () => {
  it('renders 9 reviewed kernel-backed candidate pages from page assembly data', () => {
    render(<AxiomReviewedNextNblPagesPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Reviewed Kernel-Backed Next NBL Pages',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('reviewed_kernel_backed_candidate_pages_ready_internal')).toBeInTheDocument();
    expect(screen.getByText('9 pages')).toBeInTheDocument();
    expect(screen.getByText('37 sections')).toBeInTheDocument();
    expect(screen.getByText('15 kernel rows')).toBeInTheDocument();
    expect(screen.getByText('18 review units')).toBeInTheDocument();
    expect(screen.getByText('9 backbone slots')).toBeInTheDocument();
    expect(screen.getByText('9 body drafts')).toBeInTheDocument();
    for (const title of [
      'Next NBL Home',
      'Scene Entry and Use Cases',
      'Work-condition Window',
      'Consultation Case Readings',
      'Kernel-derived Work-design Views Guide',
      'Theory, Method, Trust',
      'Article and Social Question Library',
      'Cognitive Support Toolkit Studio',
      'About and Operating Boundary',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('shows the reconstructed work-design backbone propagation before page filling', () => {
    render(<AxiomReviewedNextNblPagesPage />);

    expect(screen.getByText('9 Surface Backbone Propagation')).toBeInTheDocument();
    expect(
      screen.getByText(
        'propagate_reconstructed_work_design_view_backbone_to_surfaces_not_falcon_copy_or_public_copy',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('surface_backbone_slot_unit_not_individual_hypothesis'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('reader_facing_top_home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('twenty_one_views_work_design_guide').length).toBeGreaterThan(0);
    expect(screen.getAllByText('scene_entry_use_cases').length).toBeGreaterThan(0);
    expect(screen.getByText('働きづらさを、仕事条件の問いとして読み直す')).toBeInTheDocument();
    expect(screen.getByText('Axiom版 仕事設計の視点候補')).toBeInTheDocument();
    expect(screen.getByText('場面から、仕事条件の見方をつかむ')).toBeInTheDocument();
    expect(
      screen.getAllByText('surface_body_draft_review_required').length,
    ).toBeGreaterThanOrEqual(9);
  });

  it('keeps route intents internal and does not create actual public navigation links', () => {
    render(<AxiomReviewedNextNblPagesPage />);

    expect(
      screen.getAllByText('route_intent_only_actual_public_navigation_not_created').length,
    ).toBeGreaterThanOrEqual(9);
    expect(screen.getAllByRole('link')).toHaveLength(18);
    expect(screen.getAllByRole('link', { name: 'kernel route' })).toHaveLength(9);
    expect(screen.getAllByRole('link', { name: 'public candidate' })).toHaveLength(9);
    for (const link of screen.getAllByRole('link', { name: 'kernel route' })) {
      expect(link).toHaveAttribute('href', expect.stringMatching(/^\/internal\/axiom-next-nbl-reviewed-candidate/));
    }
    for (const link of screen.getAllByRole('link', { name: 'public candidate' })) {
      expect(link).toHaveAttribute('href', expect.stringMatching(/^\/internal\/axiom-next-nbl-public-candidate/));
    }
    expect(screen.getAllByText('not_published').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_public_approved').length).toBeGreaterThan(0);
  });

  it('renders body drafts only for display or translate sections and preserves review-routed holds', () => {
    render(<AxiomReviewedNextNblPagesPage />);

    expect(
      screen.getAllByText('review_required_public_draft_from_reviewed_kernel_slot').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('hidden_or_review_routed_no_public_body').length).toBeGreaterThan(0);
    expect(screen.getAllByText('kernel_or_surface_review_before_public_body').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/section:/).length).toBeGreaterThanOrEqual(37);
  });

  it('shows the assembly boundary that prevents public approval and publication', () => {
    render(<AxiomReviewedNextNblPagesPage />);

    expect(
      screen.getByText(
        'axiom_reviewed_kernel_backed_candidate_page_assembly_is_internal_page_data_from_reviewed_slots_not_public_navigation_public_approval_or_publication',
      ),
    ).toBeInTheDocument();
  });
});
