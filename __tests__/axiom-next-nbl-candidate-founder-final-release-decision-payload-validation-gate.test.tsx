import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationGatePage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision payload validation gate page', () => {
  it('renders the internal Founder final-release decision payload validation gate boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationGatePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Payload Validation Gate',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_payload_validation_gate_is_not_run_empty_payload_rejected_not_founder_decision_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_payload_validation_gate_prepared_not_run_empty_payload_rejected_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'founder_final_release_decision_payload_validation_gate_empty_payload_rejected',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_run').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_validated').length).toBeGreaterThan(0);
    expect(screen.getAllByText('rejected_before_ingestion').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders validation units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationGatePage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_founder_final_release_decision_payload_validation_gate_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_payload_validation_gate_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_payload_validation_gate_input'),
    ).toBeInTheDocument();
  });

  it('renders validation requirements and options without validating or accepting payload', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationGatePage />);

    expect(
      screen.getAllByText('payload_fields_must_be_non_empty_before_validation').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('release_or_no_release_must_be_declared_before_validation').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_evidence_must_be_present_before_validation')
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('reject_empty_payload_before_ingestion').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_validation_after_external_payload_arrives').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('founderDecision').length).toBeGreaterThan(0);
    expect(screen.getAllByText('releaseDecision').length).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, validation-run, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationGatePage />,
    );

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('検証する')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
