import { render, screen } from '@testing-library/react';
import AxiomNextNblCandidatePublicNavigationReleaseRouteShellPage from '@/pages/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

describe('Axiom next NBL candidate public-navigation release route shell page', () => {
  it('renders the internal public-navigation route shell boundary and summary', () => {
    render(<AxiomNextNblCandidatePublicNavigationReleaseRouteShellPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Candidate Public Navigation Release Route Shell',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_internal_candidate_public_navigation_release_route_shell_is_review_input_not_actual_public_navigation_public_approval_publication_or_release',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('public_navigation_release_route_review_input_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_activated').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_added').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_approved').length).toBeGreaterThan(0);
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('renders surface navigation units for every fixed next-NBL surface plus cross and Gate 8 units', () => {
    render(<AxiomNextNblCandidatePublicNavigationReleaseRouteShellPage />);

    for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
      expect(screen.getByText(surface)).toBeInTheDocument();
    }
    expect(
      screen.getAllByText('surface_public_navigation_release_route_shell_review_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_public_navigation_release_route_shell_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_public_navigation_release_route_shell_review_input'),
    ).toBeInTheDocument();
  });

  it('renders route requirements and options without activating public navigation', () => {
    render(<AxiomNextNblCandidatePublicNavigationReleaseRouteShellPage />);

    expect(
      screen.getAllByText('explicit_founder_public_navigation_decision_required').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_release_decision_must_be_approved_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('source_support_validity_must_be_decided_outside_codex').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('public_boundary_and_accessibility_must_be_reviewed').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('regression_receipt_must_be_current').length).toBeGreaterThan(0);
    expect(screen.getAllByText('rollback_and_correction_route_must_exist').length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText('no_personal_data_collection_or_case_intake_route').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('no_runtime_or_learning_update_route').length).toBeGreaterThan(0);
    expect(screen.getAllByText('keep_internal_only').length).toBeGreaterThan(0);
    expect(screen.getAllByText('return_to_release_decision_shell_revision').length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText('prepare_public_navigation_after_explicit_approval').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('prepare_no_release_hold_notice').length).toBeGreaterThan(0);
  });

  it('does not expose input, approval, publication, navigation, or link affordances', () => {
    const { container } = render(<AxiomNextNblCandidatePublicNavigationReleaseRouteShellPage />);

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
