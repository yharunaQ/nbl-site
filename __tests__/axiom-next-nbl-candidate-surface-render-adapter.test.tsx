import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateSurfaceRenderAdapterPage from '@/pages/internal/axiom-next-nbl-candidate-surface-render-adapter';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-surface render adapter page', () => {
  it('renders the internal render adapter boundary and summary', () => {
    render(<AxiomNextNblCandidateSurfaceRenderAdapterPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Surface Render Adapter',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_surface_render_adapter_is_internal_component_interface_not_public_page_candidate_promotion_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_surface_render_adapter_bundle_not_promoted'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('/internal/axiom-next-nbl-candidate-surface-render-adapter'),
    ).toBeInTheDocument();
  });

  it('renders one internal render adapter for every fixed next-NBL surface', () => {
    render(<AxiomNextNblCandidateSurfaceRenderAdapterPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
      expect(
        screen.getByText(`/internal/axiom-next-nbl-candidate-surface-render-adapter#${surface}`),
      ).toBeInTheDocument();
    }

    expect(screen.getAllByText('internal_render_adapter_not_promoted')).toHaveLength(9);
    expect(screen.getAllByText('internal_candidate_surface_shell_not_public_page')).toHaveLength(9);
    expect(screen.getAllByText('not_promoted_to_falcon_candidate_surface')).toHaveLength(9);
  });

  it('renders stable component kinds and internal-preview-only output', () => {
    render(<AxiomNextNblCandidateSurfaceRenderAdapterPage />);

    expect(
      screen.getAllByText('review_required_public_draft_candidate_block').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('hidden_or_review_routed_placeholder_block').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('internal_preview_only').length).toBeGreaterThan(9);
    expect(screen.getAllByText('not_public_approved').length).toBeGreaterThan(9);
    expect(screen.getAllByText('not_published').length).toBeGreaterThan(9);
  });

  it('does not expose input, approval, publication, or navigation affordances', () => {
    const { container } = render(<AxiomNextNblCandidateSurfaceRenderAdapterPage />);

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
