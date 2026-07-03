import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidatePublicReleaseDecisionPacketShellPage from '@/pages/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate public-release decision packet shell page', () => {
  it('renders the internal public-release decision shell boundary and summary', () => {
    render(<AxiomNextNblCandidatePublicReleaseDecisionPacketShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Public Release Decision Packet Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_public_release_decision_packet_shell_is_review_input_not_public_approval_public_navigation_publication_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('public_release_decision_review_input_only')).toBeInTheDocument();
    expect(screen.getAllByText('not_decided').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_approved').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_published').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders surface decision units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidatePublicReleaseDecisionPacketShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(screen.getAllByText('surface_public_release_decision_shell_review_input')).toHaveLength(
      9,
    );
    expect(
      screen.getByText('cross_public_release_decision_shell_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_public_release_decision_shell_review_input'),
    ).toBeInTheDocument();
  });

  it('renders release requirements and options without turning them into decisions', () => {
    render(<AxiomNextNblCandidatePublicReleaseDecisionPacketShellPage />);

    expect(screen.getAllByText('founder_public_release_decision_required').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('human_review_execution_required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('source_support_validity_review_required').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('public_boundary_review_required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('accessibility_review_required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('regression_receipt_currentness_required').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('public_navigation_plan_required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('rollback_and_correction_playbook_required').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('no_release_continue_internal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_kernel_or_surface_revision').length).toBeGreaterThan(0);
    expect(screen.getAllByText('request_source_support_validity_review').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_public_release_packet_after_explicit_approval').length,
    ).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidatePublicReleaseDecisionPacketShellPage />);

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
