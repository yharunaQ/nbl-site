import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellPage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision payload return hold shell page', () => {
  it('renders the internal payload return hold shell boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Payload Return Hold Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_payload_return_hold_shell_is_empty_payload_return_hold_not_founder_decision_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_payload_return_hold_shell_prepared_empty_payload_return_hold_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('payload_return_hold_prepared').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('external_payload_shell_completion_required').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('not_accepted').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders return hold units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_founder_final_release_decision_payload_return_hold_shell_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_payload_return_hold_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_payload_return_hold_shell_input'),
    ).toBeInTheDocument();
  });

  it('renders return hold requirements and options without accepting or ingesting payload', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellPage />);

    expect(
      screen.getAllByText('empty_payload_rejection_must_remain_visible_before_return').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('external_payload_completion_required_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('validation_receipt_required_before_any_ingestion_retry').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('human_review_and_source_support_validity_must_remain_unmoved').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_navigation_public_approval_and_publication_must_remain_blocked')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('return_to_payload_shell_for_external_completion').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('keep_public_release_on_hold').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_external_payload_completion_note_only').length,
    ).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, validation, ingestion, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellPage />,
    );

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('受領')).not.toBeInTheDocument();
    expect(screen.queryByText('検証する')).not.toBeInTheDocument();
    expect(screen.queryByText('取り込む')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
