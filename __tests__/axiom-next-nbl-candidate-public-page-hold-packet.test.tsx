import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidatePublicPageHoldPacketPage from '@/pages/internal/axiom-next-nbl-candidate-public-page-hold-packet';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-public-page hold packet page', () => {
  it('renders the internal hold packet boundary and summary', () => {
    render(<AxiomNextNblCandidatePublicPageHoldPacketPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Public Page Hold Packet',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_public_page_hold_packet_is_hold_gate_not_public_navigation_review_execution_candidate_promotion_public_approval_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_public_page_hold_packet_prepared_not_released'),
    ).toBeInTheDocument();
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders surface hold units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidatePublicPageHoldPacketPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(screen.getAllByText('surface_candidate_public_page_hold')).toHaveLength(9);
    expect(screen.getByText('cross_candidate_public_page_hold')).toBeInTheDocument();
    expect(screen.getByText('gate8_candidate_public_page_hold')).toBeInTheDocument();
    expect(screen.getAllByText('not_executed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_assigned_by_codex').length).toBeGreaterThan(0);
  });

  it('renders all required hold categories as not released', () => {
    render(<AxiomNextNblCandidatePublicPageHoldPacketPage />);

    for (const category of [
      'public_boundary',
      'accessibility_readiness',
      'regression_readiness',
      'source_currentness_hold',
      'human_review_gate',
      'public_navigation_release_hold',
    ]) {
      expect(screen.getAllByText(category)).toHaveLength(11);
    }
    expect(screen.getAllByText('required_hold_not_released')).toHaveLength(66);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidatePublicPageHoldPacketPage />);

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
