import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadShellPage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision payload shell page', () => {
  it('renders the internal Founder final-release decision payload shell boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Payload Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_payload_shell_is_empty_schema_fixture_not_founder_decision_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_payload_shell_empty_fixture_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('declared_empty_fixture').length).toBeGreaterThan(0);
    expect(screen.getAllByText('empty').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_accepted').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders payload units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_founder_final_release_decision_payload_shell_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_payload_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_payload_shell_input'),
    ).toBeInTheDocument();
  });

  it('renders payload requirements, empty fields, and options without accepting a payload', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadShellPage />);

    expect(
      screen.getAllByText('external_founder_decision_payload_must_be_supplied_outside_codex')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('payload_must_declare_release_or_no_release').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('payload_must_reference_human_review_execution_evidence').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('payload_must_reference_source_support_validity_evidence').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('founderDecision: empty / not_accepted').length).toBeGreaterThan(0);
    expect(screen.getAllByText('releaseDecision: empty / not_accepted').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('sourceSupportValidityEvidence: empty / not_accepted').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('keep_payload_empty_until_external_founder_decision').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_ingestion_only_after_payload_validation').length,
    ).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, payload acceptance, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadShellPage />,
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
