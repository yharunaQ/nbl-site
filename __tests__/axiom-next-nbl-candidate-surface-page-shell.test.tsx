import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateSurfacePageShellPage from '@/pages/internal/axiom-next-nbl-candidate-surface-page-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-surface page shell page', () => {
  it('renders the internal page shell boundary and summary', () => {
    render(<AxiomNextNblCandidateSurfacePageShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Surface Page Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_surface_page_shell_is_internal_preview_not_public_page_navigation_candidate_promotion_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_surface_page_shell_bundle_not_promoted'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('/internal/axiom-next-nbl-candidate-surface-page-shell'),
    ).toBeInTheDocument();
  });

  it('renders one internal page shell for every fixed next-NBL surface', () => {
    render(<AxiomNextNblCandidateSurfacePageShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
      expect(
        screen.getByText(`/internal/axiom-next-nbl-candidate-surface-page-shell#${surface}`),
      ).toBeInTheDocument();
    }

    expect(screen.getAllByText('internal_candidate_surface_page_shell_not_promoted')).toHaveLength(
      9,
    );
    expect(screen.getAllByText('internal_preview_page_shell')).toHaveLength(9);
    expect(screen.getAllByText('not_promoted_to_falcon_candidate_surface')).toHaveLength(9);
    expect(screen.getAllByText('not_added')).toHaveLength(9);
    expect(screen.getAllByText('not_executed')).toHaveLength(9);
  });

  it('renders stable page region kinds and internal kernel-field-only content source', () => {
    render(<AxiomNextNblCandidateSurfacePageShellPage />);

    expect(
      screen.getAllByText('public_draft_candidate_region_review_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('hidden_or_review_routed_region_placeholder').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('axiom_kernel_object_fields_only').length).toBeGreaterThan(9);
    expect(screen.getAllByText('internal_preview_only').length).toBeGreaterThan(9);
    expect(screen.getAllByText('not_public_approved').length).toBeGreaterThan(9);
    expect(screen.getAllByText('not_published').length).toBeGreaterThan(9);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidateSurfacePageShellPage />);

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
