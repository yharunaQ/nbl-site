import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateSurfacePromotionHandoffManifestPage from '@/pages/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-surface promotion handoff manifest page', () => {
  it('renders the internal handoff manifest boundary and summary', () => {
    render(<AxiomNextNblCandidateSurfacePromotionHandoffManifestPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Surface Promotion Handoff Manifest',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_surface_promotion_handoff_manifest_is_review_handoff_input_not_review_execution_candidate_promotion_public_approval_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('founder_reviewer_handoff_input_only')).toBeInTheDocument();
    expect(screen.getAllByText('prepared_not_sent_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_decided').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_executed').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
    expect(
      screen.getByText('founder_or_reviewer_can_review_outside_codex_only'),
    ).toBeInTheDocument();
  });

  it('renders surface handoff units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateSurfacePromotionHandoffManifestPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_candidate_surface_promotion_handoff_review_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_candidate_surface_promotion_handoff_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_candidate_surface_promotion_handoff_review_input'),
    ).toBeInTheDocument();
  });

  it('renders handoff options without turning them into decisions', () => {
    render(<AxiomNextNblCandidateSurfacePromotionHandoffManifestPage />);

    expect(screen.getAllByText('continue_internal_only').length).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_kernel_revision').length).toBeGreaterThan(0);
    expect(screen.getAllByText('send_to_human_review_outside_codex').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_separate_public_release_packet_after_review').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('confirm_no_candidate_promotion_public_navigation_or_release').length,
    ).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidateSurfacePromotionHandoffManifestPage />);

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
