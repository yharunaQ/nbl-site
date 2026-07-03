import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidatePagesPage from '@/pages/internal/axiom-next-nbl-candidate-pages';

describe('Axiom next NBL candidate pages internal inspection route', () => {
  it('renders the internal candidate page inspection boundary', () => {
    render(<AxiomNextNblCandidatePagesPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Page Inspection',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Falcon Lab')).toBeInTheDocument();
    expect(screen.getByText('kernel_display')).toBeInTheDocument();
    expect(screen.getByText('kernel_human_review_loop')).toBeInTheDocument();
    expect(screen.getByText('internal only')).toBeInTheDocument();
    expect(screen.getAllByText('not published').length).toBeGreaterThan(0);
    expect(screen.getByText('Internal Route Map')).toBeInTheDocument();
    expect(screen.getByText('Route Map Entries')).toBeInTheDocument();
    expect(screen.getByText('Gate 8 Preflight Hold')).toBeInTheDocument();
    expect(screen.getByText('Candidate Page Renderings')).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_site_candidate_page_route_map_is_internal_inspection_not_public_navigation_or_publication',
      ),
    ).toBeInTheDocument();
  });

  it('renders all nine fixed surface candidate pages from Axiom candidate page data', () => {
    render(<AxiomNextNblCandidatePagesPage />);

    for (const surface of [
      'reader_facing_top_home',
      'work_condition_window',
      'consultation_case_reading_collection',
      'twenty_one_views_work_design_guide',
      'theory_method_trust_page',
      'article_social_question_library',
      'cognitive_support_toolkit_studio_multimodal_objects',
      'about_operating_boundary_page',
      'scene_entry_use_cases',
    ]) {
      expect(screen.getAllByText(surface).length).toBeGreaterThan(0);
      expect(
        screen.getByText(`/internal/axiom-next-nbl-candidate-pages#${surface}`),
      ).toBeInTheDocument();
    }

    expect(screen.getByText('9')).toBeInTheDocument();
    expect(
      screen.getAllByText(/surface_review_unit_required_before_public_page_build/).length,
    ).toBeGreaterThanOrEqual(9);
    expect(screen.getAllByText('5 scenarios').length).toBeGreaterThanOrEqual(9);
  });

  it('renders section policies without public page affordances', () => {
    const { container } = render(<AxiomNextNblCandidatePagesPage />);

    expect(
      screen.getAllByText('draftable_requires_review_before_public_use').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('internal_only_hidden_or_review_routed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('no public draft for this section').length).toBeGreaterThan(0);
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
  });

  it('renders route-level Gate 8 holds for every candidate page surface', () => {
    render(<AxiomNextNblCandidatePagesPage />);

    expect(screen.getAllByText('not_promoted_to_falcon_candidate_surface')).toHaveLength(9);
    expect(screen.getAllByText('hold_until_reviewed_or_live_currentness_check')).toHaveLength(9);
    expect(screen.getAllByText('required_not_run').length).toBeGreaterThanOrEqual(18);
  });
});
