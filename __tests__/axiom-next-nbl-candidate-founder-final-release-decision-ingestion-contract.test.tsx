import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidateFounderFinalReleaseDecisionIngestionContractPage from '@/pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate Founder final-release decision ingestion contract page', () => {
  it('renders the internal Founder final-release decision ingestion contract boundary and summary', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionIngestionContractPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Founder Final Release Decision Ingestion Contract',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_founder_final_release_decision_ingestion_contract_is_empty_not_ingested_not_founder_decision_public_approval_publication_actual_public_navigation_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_ingestion_contract_empty_not_ingested'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('empty').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_ingested').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_decided').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders ingestion units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionIngestionContractPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_founder_final_release_decision_ingestion_contract_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_ingestion_contract_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_ingestion_contract_input'),
    ).toBeInTheDocument();
  });

  it('renders ingestion requirements and options without ingesting a Founder decision payload', () => {
    render(<AxiomNextNblCandidateFounderFinalReleaseDecisionIngestionContractPage />);

    expect(
      screen.getAllByText('external_founder_decision_payload_required_before_ingestion').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('decision_payload_must_name_release_or_no_release').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('human_review_execution_evidence_required_before_ingestion').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_evidence_required_before_ingestion').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_navigation_authorization_required_before_ingestion').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_approval_publication_evidence_required_before_ingestion').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('rollback_correction_no_intake_confirmation_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('runtime_and_learning_freeze_must_remain_confirmed').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('keep_ingestion_empty_until_external_receipt').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('reject_partial_or_ambiguous_founder_receipt').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('prepare_ingestion_mapping_after_external_decision').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_receipt_shell_hold_note').length).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, ingestion, or link affordances', () => {
    const { container } = render(
      <AxiomNextNblCandidateFounderFinalReleaseDecisionIngestionContractPage />,
    );

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText('取り込み')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
