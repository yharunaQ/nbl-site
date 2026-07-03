import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidatePublicPagePreviewPage from '@/pages/internal/axiom-next-nbl-candidate-public-page-preview';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-public-page preview page', () => {
  it('renders the internal candidate-public-page preview assembly boundary and summary', () => {
    render(<AxiomNextNblCandidatePublicPagePreviewPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Public Page Preview Assembly',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_public_page_preview_assembly_is_internal_preview_not_public_navigation_public_approval_candidate_promotion_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_public_page_preview_assembly_not_promoted'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('/internal/axiom-next-nbl-candidate-public-page-preview'),
    ).toBeInTheDocument();
  });

  it('renders one internal candidate-public-page preview for every fixed next-NBL surface', () => {
    render(<AxiomNextNblCandidatePublicPagePreviewPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
      expect(
        screen.getByText(`/internal/axiom-next-nbl-candidate-public-page-preview#${surface}`),
      ).toBeInTheDocument();
    }

    expect(screen.getAllByText('internal_candidate_public_page_preview_not_promoted')).toHaveLength(
      9,
    );
    expect(screen.getAllByText('internal_preview_route_only_not_public_navigation')).toHaveLength(
      9,
    );
    expect(screen.getAllByText('not_promoted_to_falcon_candidate_surface')).toHaveLength(9);
    expect(screen.getAllByText('not_added')).toHaveLength(9);
    expect(screen.getAllByText('not_published').length).toBeGreaterThan(9);
  });

  it('renders stable preview block treatments and kernel-field-only source', () => {
    render(<AxiomNextNblCandidatePublicPagePreviewPage />);

    expect(
      screen.getAllByText('candidate_public_copy_placeholder_review_required').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('hidden_or_review_route_placeholder').length).toBeGreaterThan(0);
    expect(screen.getAllByText('axiom_kernel_object_fields_only').length).toBeGreaterThan(9);
    expect(screen.getAllByText('not_public_approved').length).toBeGreaterThan(9);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidatePublicPagePreviewPage />);

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
