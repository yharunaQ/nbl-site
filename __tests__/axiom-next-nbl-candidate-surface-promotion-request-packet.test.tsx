import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateSurfacePromotionRequestPacketPage from '@/pages/internal/axiom-next-nbl-candidate-surface-promotion-request-packet';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-surface promotion request packet page', () => {
  it('renders the internal promotion request packet boundary and summary', () => {
    render(<AxiomNextNblCandidateSurfacePromotionRequestPacketPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Surface Promotion Request Packet',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_surface_promotion_request_packet_is_review_input_not_candidate_promotion_public_approval_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('human_review_input_only')).toBeInTheDocument();
    expect(screen.getByText('not_submitted_by_codex')).toBeInTheDocument();
    expect(screen.getAllByText('not promoted').length).toBeGreaterThan(0);
    expect(screen.getByText('66')).toBeInTheDocument();
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders surface request units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateSurfacePromotionRequestPacketPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_candidate_surface_promotion_request_review_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_candidate_surface_promotion_request_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_candidate_surface_promotion_request_review_input'),
    ).toBeInTheDocument();
  });

  it('renders required review decisions and readiness statuses without executing review', () => {
    render(<AxiomNextNblCandidateSurfacePromotionRequestPacketPage />);

    expect(screen.getAllByText('confirm_public_boundary_hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('confirm_accessibility_readiness').length).toBeGreaterThan(0);
    expect(screen.getAllByText('confirm_regression_evidence_current').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('confirm_source_support_validity_still_undecided').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('confirm_human_review_route').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('confirm_founder_public_release_gate_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('confirm_no_candidate_promotion_public_navigation_or_release').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('internally_passed_not_released').length).toBeGreaterThan(0);
    expect(screen.getAllByText('review_required_not_released').length).toBeGreaterThan(0);
    expect(screen.getAllByText('held_until_founder_public_release_gate').length).toBeGreaterThan(0);
    expect(screen.getAllByText('held_until_source_support_validity_review').length).toBeGreaterThan(
      0,
    );
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidateSurfacePromotionRequestPacketPage />);

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
