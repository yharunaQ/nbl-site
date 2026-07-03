import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellPage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision payload validation receipt shell page', () => {
  it('renders the internal payload validation receipt shell boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Payload Validation Receipt Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_is_not_received_not_validated_not_founder_decision_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_payload_validation_receipt_shell_prepared_not_received_not_validated_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_received').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_validated').length).toBeGreaterThan(0);
    expect(screen.getAllByText('rejected_before_ingestion').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders validation receipt units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText(
        'surface_founder_final_release_decision_payload_validation_receipt_shell_input',
      ),
    ).toHaveLength(9);
    expect(
      screen.getByText(
        'cross_founder_final_release_decision_payload_validation_receipt_shell_input',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'gate8_founder_final_release_decision_payload_validation_receipt_shell_input',
      ),
    ).toBeInTheDocument();
  });

  it('renders receipt requirements and options without running validation or accepting payload', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellPage />);

    expect(
      screen.getAllByText('payload_validation_receipt_required_after_external_payload_validation')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('receipt_must_name_valid_or_invalid_payload_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('empty_payload_rejection_receipt_required_before_return_to_payload_shell')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_receipt_required_before_release').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_approval_publication_receipts_required_before_release').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('continue_waiting_for_validation_receipt').length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText('return_to_payload_shell_for_external_completion').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_ingestion_contract_only_after_valid_external_payload_receipt')
        .length,
    ).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, validation, ingestion, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellPage />,
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
