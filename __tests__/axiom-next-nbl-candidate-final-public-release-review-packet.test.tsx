import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFinalPublicReleaseReviewPacketPage from '@/pages/internal/axiom-next-nbl-candidate-final-public-release-review-packet';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate final public-release review packet page', () => {
  it('renders the internal final public-release review packet boundary and summary', () => {
    render(<AxiomNextNblCandidateFinalPublicReleaseReviewPacketPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Final Public Release Review Packet',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_final_public_release_review_packet_is_review_input_not_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('final_public_release_review_input_only')).toBeInTheDocument();
    expect(screen.getAllByText('not_executed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_assigned_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_approved').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders final review units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFinalPublicReleaseReviewPacketPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(screen.getAllByText('surface_final_public_release_review_input')).toHaveLength(9);
    expect(screen.getByText('cross_final_public_release_review_input')).toBeInTheDocument();
    expect(screen.getByText('gate8_final_public_release_review_input')).toBeInTheDocument();
  });

  it('renders final review requirements and options without executing release review', () => {
    render(<AxiomNextNblCandidateFinalPublicReleaseReviewPacketPage />);

    expect(
      screen.getAllByText('founder_final_public_release_review_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('human_review_execution_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_navigation_authorization_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_decision_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_boundary_accessibility_regression_receipt_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('rollback_correction_and_no_intake_boundary_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('runtime_prompt_retrieval_model_db_freeze_required').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('learning_update_block_required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('continue_internal_hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_navigation_route_shell_revision').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('request_external_final_release_review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('prepare_no_release_status_packet').length).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidateFinalPublicReleaseReviewPacketPage />);

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
