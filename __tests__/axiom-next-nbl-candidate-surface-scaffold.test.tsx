import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateSurfaceScaffoldPage from '@/pages/internal/axiom-next-nbl-candidate-surface-scaffold';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-surface scaffold page', () => {
  it('renders the internal candidate-surface scaffold boundary and summary', () => {
    render(<AxiomNextNblCandidateSurfaceScaffoldPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Internal Candidate Surface Scaffold',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_surface_implementation_scaffold_is_internal_inspection_not_falcon_candidate_promotion_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_surface_implementation_scaffold_not_promoted'),
    ).toBeInTheDocument();
    expect(screen.getByText('not_executed')).toBeInTheDocument();
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders implementation scaffolds for all fixed next-NBL surfaces', () => {
    render(<AxiomNextNblCandidateSurfaceScaffoldPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
      expect(
        screen.getByText(`/internal/axiom-next-nbl-candidate-surface-scaffold#${surface}`),
      ).toBeInTheDocument();
    }

    expect(screen.getAllByText('not_promoted_to_falcon_candidate_surface')).toHaveLength(9);
    expect(screen.getAllByText('not_added')).toHaveLength(9);
    expect(screen.getAllByText('not_published').length).toBeGreaterThanOrEqual(9);
  });

  it('renders section-level implementation modes without public approval', () => {
    render(<AxiomNextNblCandidateSurfaceScaffoldPage />);

    expect(
      screen.getAllByText('render_review_required_public_draft_candidate').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('render_hidden_or_review_routed_placeholder').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('not_public_approved').length).toBeGreaterThan(9);
    expect(
      screen.getAllByText('human_review_required_before_candidate_promotion').length,
    ).toBeGreaterThanOrEqual(9);
    expect(
      screen.getAllByText('public_release_requires_separate_founder_approval').length,
    ).toBeGreaterThanOrEqual(9);
  });

  it('does not expose input, approval, publication, or navigation affordances', () => {
    const { container } = render(<AxiomNextNblCandidateSurfaceScaffoldPage />);

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
