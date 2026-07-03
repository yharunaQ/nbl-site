import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionReceiptShellPage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision receipt shell page', () => {
  it('renders the internal Founder final-release decision receipt shell boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionReceiptShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Receipt Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_receipt_shell_is_not_received_review_input_not_founder_decision_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_receipt_shell_not_received_input_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_received').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_decided').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_approved').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders receipt units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionReceiptShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_founder_final_release_decision_receipt_shell_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_receipt_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_receipt_shell_input'),
    ).toBeInTheDocument();
  });

  it('renders receipt requirements and options without receiving a Founder decision', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionReceiptShellPage />);

    expect(
      screen.getAllByText('founder_decision_receipt_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('receipt_must_name_release_or_no_release_decision_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('human_review_execution_receipt_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_receipt_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_navigation_authorization_receipt_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_approval_publication_receipts_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('rollback_correction_no_intake_confirmation_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('runtime_and_learning_freeze_must_remain_confirmed').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('continue_waiting_for_founder_receipt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_founder_handoff_revision').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_founder_receipt_ingestion_after_external_decision').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('prepare_no_receipt_hold_note').length).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, receipt, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionReceiptShellPage />,
    );

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('受領')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
