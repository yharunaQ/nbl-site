import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionHandoffManifestPage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision handoff manifest page', () => {
  it('renders the internal Founder final-release handoff boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionHandoffManifestPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Handoff Manifest',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_handoff_manifest_is_handoff_input_not_review_execution_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_handoff_input_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('prepared_not_sent_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_decided').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_approved').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders handoff units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionHandoffManifestPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_founder_final_release_decision_handoff_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_handoff_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_handoff_input'),
    ).toBeInTheDocument();
  });

  it('renders Founder handoff requirements and options without deciding release', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionHandoffManifestPage />);

    expect(screen.getAllByText('founder_must_decide_outside_codex').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('human_review_must_execute_outside_codex_before_release').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_must_be_decided_outside_codex_before_release')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_navigation_must_not_activate_from_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_approval_and_publication_must_not_be_set_by_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('rollback_correction_no_intake_boundary_must_be_confirmed').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('runtime_prompt_retrieval_model_db_must_remain_frozen').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('learning_update_must_remain_blocked').length).toBeGreaterThan(0);
    expect(screen.getAllByText('continue_internal_hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_final_review_packet_revision').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('send_to_founder_final_release_decision_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_no_release_or_release_candidate_status_note').length,
    ).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, send, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionHandoffManifestPage />,
    );

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('送信')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
