import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateReleaseReadinessLedgerPage from '@/pages/internal/axiom-next-nbl-candidate-release-readiness-ledger';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate-release readiness ledger page', () => {
  it('renders the internal readiness ledger boundary and summary', () => {
    render(<AxiomNextNblCandidateReleaseReadinessLedgerPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Release Readiness Ledger',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_release_readiness_ledger_is_internal_status_not_public_approval_public_navigation_candidate_promotion_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_release_readiness_ledger_prepared_not_released'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_ready_public_release_hold').length).toBeGreaterThan(0);
    expect(screen.getByText('66')).toBeInTheDocument();
  });

  it('renders surface readiness units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateReleaseReadinessLedgerPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(screen.getAllByText('surface_candidate_release_readiness')).toHaveLength(9);
    expect(screen.getByText('cross_candidate_release_readiness')).toBeInTheDocument();
    expect(screen.getByText('gate8_candidate_release_readiness')).toBeInTheDocument();
  });

  it('separates internal pass statuses from held release gates', () => {
    render(<AxiomNextNblCandidateReleaseReadinessLedgerPage />);

    expect(screen.getAllByText('internally_passed_not_released').length).toBeGreaterThan(0);
    expect(screen.getAllByText('review_required_not_released').length).toBeGreaterThan(0);
    expect(screen.getAllByText('held_until_founder_public_release_gate').length).toBeGreaterThan(0);
    expect(screen.getAllByText('held_until_source_support_validity_review').length).toBeGreaterThan(
      0,
    );
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidateReleaseReadinessLedgerPage />);

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
