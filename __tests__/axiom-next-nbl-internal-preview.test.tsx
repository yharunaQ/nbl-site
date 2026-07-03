import { render, screen } from '@testing-library/react';
import AxiomNextNblPreviewPage from '@/pages/internal/axiom-next-nbl-preview';

describe('Axiom next NBL internal preview page', () => {
  it('renders the Axiom internal preview boundary and kernel display status', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Next NBL Internal Preview',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Falcon Lab').length).toBeGreaterThan(0);
    expect(screen.getAllByText('kernel_display').length).toBeGreaterThan(0);
    expect(screen.getByText('非runtime')).toBeInTheDocument();
    expect(screen.getByText('公開未承認')).toBeInTheDocument();
    expect(screen.getByText('未公開')).toBeInTheDocument();
    expect(screen.getByText('Gate Summary')).toBeInTheDocument();
    expect(screen.getByText('Kernel Source')).toBeInTheDocument();
    expect(screen.getByText('Axiom Core Kernel Corpus Readout')).toBeInTheDocument();
    expect(screen.getByText('15 kernel rows')).toBeInTheDocument();
    expect(screen.getByText('6 wave2 rows')).toBeInTheDocument();
    expect(screen.getByText('1 manual/document row')).toBeInTheDocument();
    expect(screen.getByText('internal_review_readout_adapter_ready')).toBeInTheDocument();
    expect(screen.getByText('Kernel Corpus Sufficiency Gate')).toBeInTheDocument();
    expect(
      screen.getByText('passed_internal_kernel_sufficiency_gate_not_public_or_promotion'),
    ).toBeInTheDocument();
    expect(screen.getByText('10 / 10 passed')).toBeInTheDocument();
    expect(screen.getByText('Kernel Corpus Human Review Packet')).toBeInTheDocument();
    expect(
      screen.getByText('compressed_human_review_packet_prepared_not_executed'),
    ).toBeInTheDocument();
    expect(screen.getByText('Reviewed Kernel-Backed Public Content Slots')).toBeInTheDocument();
    expect(screen.getByText('all_units_accept_as_provisional_kernel_structure')).toBeInTheDocument();
    expect(screen.getByText('9 surfaces')).toBeInTheDocument();
    expect(screen.getAllByText('15 / 15').length).toBeGreaterThan(0);
    expect(
      screen.getByText('build_kernel_backed_public_content_slots_from_reviewed_kernel_fields'),
    ).toBeInTheDocument();
    expect(screen.getByText('Reviewed Kernel-Backed Candidate Page Assembly')).toBeInTheDocument();
    expect(screen.getByText('reviewed_kernel_backed_candidate_pages_ready_internal')).toBeInTheDocument();
    expect(screen.getByText('9 pages')).toBeInTheDocument();
    expect(screen.getByText('37 sections')).toBeInTheDocument();
    expect(screen.getByText('Multi-Scenario Matrix')).toBeInTheDocument();
    expect(screen.getByText('Fixed Surface Slot Map')).toBeInTheDocument();
    expect(screen.getByText('Stable Candidate Page Slots')).toBeInTheDocument();
    expect(screen.getByText('Candidate Page Data')).toBeInTheDocument();
    expect(screen.getByText('Gate 8 Preflight')).toBeInTheDocument();
    expect(screen.getByText('Gate 8 Runner Criteria')).toBeInTheDocument();
    expect(screen.getByText('Gate 8 Runner Receipt')).toBeInTheDocument();
    expect(screen.getByText('Candidate Surface Review Packet')).toBeInTheDocument();
    expect(screen.getByText('Internal Candidate Surface Scaffold')).toBeInTheDocument();
    expect(screen.getByText('Internal Candidate Surface Render Adapter')).toBeInTheDocument();
    expect(screen.getByText('Internal Candidate Surface Page Shell')).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Surface Page Shell Review Packet'),
    ).toBeInTheDocument();
    expect(screen.getByText('Internal Candidate Public Page Preview Assembly')).toBeInTheDocument();
    expect(screen.getByText('Internal Candidate Public Page Hold Packet')).toBeInTheDocument();
    expect(screen.getByText('Internal Candidate Release Readiness Ledger')).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Surface Promotion Request Packet'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Surface Promotion Handoff Manifest'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Public Release Decision Packet Shell'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Public Navigation Release Route Shell'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Final Public Release Review Packet'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Founder Final Release Decision Handoff Manifest'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Founder Final Release Decision Receipt Shell'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Founder Final Release Decision Ingestion Contract'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Founder Final Release Decision Payload Shell'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Internal Candidate Founder Final Release Decision Payload Validation Gate'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Internal Candidate Founder Final Release Decision Payload Validation Receipt Shell',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Internal Candidate Founder Final Release Decision Payload Return Hold Shell',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Human Review Queue')).toBeInTheDocument();
    expect(screen.getByText('Movement Boundary')).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_site_preview_data_is_internal_kernel_display_not_public_site_or_publication',
      ),
    ).toBeInTheDocument();
  });

  it('renders the 15-item kernel corpus readout as internal review navigation only', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'axiom_kernel_corpus_review_readout_adapter_is_internal_display_and_review_navigation_not_public_runtime_or_promotion',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'show: source_family, scenario, grounded_fields, actionability_band, missing_context_slots, cannot_yet_say_count, review_units',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'hide: raw_original, source_text, field_values, public_recommendation, source_support_validity',
      ),
    ).toBeInTheDocument();
    for (const sourceFamilyEntryId of [
      'source_family_respondent_surveys_3000_4000',
      'source_family_supporter_practice',
      'source_family_workplace_surveys',
      'source_family_workshop_practice_knowledge',
      'source_family_historical_2001_abc',
      'source_family_international_web_cache',
      'source_family_manuals_and_documents',
    ]) {
      expect(screen.getAllByText(new RegExp(sourceFamilyEntryId)).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText('review_required_before_promotion').length).toBeGreaterThanOrEqual(
      7,
    );
    expect(screen.getAllByText('internal_review_readout_only')).toHaveLength(7);
  });

  it('renders the compact kernel corpus sufficiency gate without public movement', () => {
    render(<AxiomNextNblPreviewPage />);

    for (const checkId of [
      'corpus_has_15_items',
      'all_core_eligible_source_families_represented',
      'five_l3_scenarios_covered',
      'all_grounded_fields_covered',
      'all_items_pass_eval',
      'all_items_review_routed',
      'review_budget_under_100',
      'display_contract_hides_raw_public_and_validity_fields',
      'delivery_layer_excluded_from_core_truth',
      'movement_boundaries_not_moved',
    ]) {
      expect(screen.getByText(checkId)).toBeInTheDocument();
    }
    expect(
      screen.getByText('internal_slot_planning_allowed_from_kernel_corpus_not_public_page_filling'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'axiom_kernel_corpus_sufficiency_gate_checks_internal_kernel_readiness_not_public_approval_or_promotion',
      ),
    ).toBeInTheDocument();
  });

  it('renders the 15-item kernel corpus human-review packet as a readable checklist, not review execution', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'axiom_kernel_corpus_human_review_packet_is_readable_checklist_not_review_execution_validity_or_promotion',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/15\s*\/\s*15 rows/)).toBeInTheDocument();
    expect(screen.getAllByText(/10\s*\/\s*10 represented/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('compressed_kernel_review_unit').length).toBeGreaterThan(0);
    expect(screen.getByText('source_family_coverage_review')).toBeInTheDocument();
    expect(screen.getByText('cross_corpus_boundary_review')).toBeInTheDocument();
    expect(screen.getAllByText('not_executed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_assigned_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/checklist: \d+ unchecked/).length).toBeGreaterThan(0);
  });

  it('renders Founder-accepted kernel-backed public content slots for all fixed next NBL surfaces', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'axiom_reviewed_kernel_backed_public_content_slots_translate_founder_accepted_kernel_fields_to_next_nbl_surfaces_without_finality_publication_runtime_or_learning_movement',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('reviewed_kernel_backed_public_content_slots_ready_internal')).toBeInTheDocument();
    expect(screen.getByText('37 kernel-backed slots')).toBeInTheDocument();
    for (const surface of [
      'reader_facing_top_home',
      'work_condition_window',
      'consultation_case_reading_collection',
      'twenty_one_views_work_design_guide',
      'theory_method_trust_page',
      'article_social_question_library',
      'cognitive_support_toolkit_studio_multimodal_objects',
      'about_operating_boundary_page',
      'scene_entry_use_cases',
    ]) {
      expect(screen.getAllByText(surface).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText('accepted_as_provisional_kernel_structure').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('ready_for_kernel_backed_public_content_slot_translation').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('hidden or routed to review before public copy').length).toBeGreaterThan(0);
  });

  it('renders reviewed kernel-backed candidate page assembly without actual public navigation', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'axiom_reviewed_kernel_backed_candidate_page_assembly_is_internal_page_data_from_reviewed_slots_not_public_navigation_public_approval_or_publication',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('37 sections')).toBeInTheDocument();
    expect(
      screen.getAllByText('route_intent_only_actual_public_navigation_not_created').length,
    ).toBeGreaterThanOrEqual(9);
    expect(screen.getAllByText('internal_candidate_page_data_from_reviewed_kernel_slots').length).toBeGreaterThan(0);
    for (const title of [
      'Next NBL Home',
      'Scene Entry and Use Cases',
      'Work-condition Window',
      'Consultation Case Readings',
      'Kernel-derived Work-design Views Guide',
      'Theory, Method, Trust',
      'Article and Social Question Library',
      'Cognitive Support Toolkit Studio',
      'About and Operating Boundary',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('renders all fixed next NBL surfaces from Axiom slot data', () => {
    render(<AxiomNextNblPreviewPage />);

    for (const surface of [
      'reader_facing_top_home',
      'work_condition_window',
      'consultation_case_reading_collection',
      'twenty_one_views_work_design_guide',
      'theory_method_trust_page',
      'article_social_question_library',
      'cognitive_support_toolkit_studio_multimodal_objects',
      'about_operating_boundary_page',
      'scene_entry_use_cases',
    ]) {
      expect(screen.getAllByText(surface).length).toBeGreaterThan(0);
    }

    expect(screen.getAllByText('Scene entry / Use cases').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/review routed:/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/hidden:/).length).toBeGreaterThan(0);
  });

  it('renders the five-scenario matrix and stable candidate page-slot data', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(screen.getByText('5 L3 scenarios')).toBeInTheDocument();
    expect(screen.getByText('9 fixed surfaces')).toBeInTheDocument();
    expect(
      screen.getByText('multi_scenario_internal_preview_review_matrix_not_public_release'),
    ).toBeInTheDocument();
    for (const scenarioId of [
      'l3_health_time_accommodation_lookup_trap_v0',
      'l3_disclosure_information_procedure_boundary_v0',
      'l3_policy_service_coordination_source_lens_v0',
      'l3_public_condition_window_non_lookup_v0',
      'l3_post_hiring_quality_evaluation_loop_v0',
    ]) {
      expect(screen.getAllByText(scenarioId).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText('5 scenarios').length).toBeGreaterThanOrEqual(9);
    expect(screen.getAllByText(/stable slots/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fields:/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/operations:/).length).toBeGreaterThan(0);
  });

  it('renders internal candidate page data without creating public page affordances', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(screen.getByText('9 internal page data objects')).toBeInTheDocument();
    expect(
      screen.getByText('internal_candidate_page_data_bundle_not_public_page_implementation'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('internal_candidate_page_data_not_public_page')).toHaveLength(9);
    expect(
      screen.getAllByText('surface_review_unit_required_before_public_page_build'),
    ).toHaveLength(9);
  });

  it('renders Gate 8 preflight checks before Falcon candidate promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('gate8_preflight_contract_not_candidate_surface_release'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('public_boundary').length).toBeGreaterThan(0);
    expect(screen.getAllByText('source_currentness_hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('accessibility_readiness').length).toBeGreaterThan(0);
    expect(screen.getAllByText('regression_readiness').length).toBeGreaterThan(0);
    expect(screen.getAllByText('route_promotion_criteria').length).toBeGreaterThan(0);
    expect(screen.getAllByText('human_review_gate').length).toBeGreaterThan(0);
    expect(screen.getAllByText('required_before_falcon_candidate_surface')).toHaveLength(6);
  });

  it('renders Gate 8 runner criteria and required regression targets without running promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('runner_criteria_packet_internal_required_not_run'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('no_public_affordances').length).toBeGreaterThan(0);
    expect(screen.getAllByText('required_hold_labels').length).toBeGreaterThan(0);
    expect(screen.getAllByText('internal_route_rendering').length).toBeGreaterThan(0);
    expect(screen.getAllByText('axiom_contract_regression').length).toBeGreaterThan(0);
    expect(screen.getAllByText('falcon_eval_preservation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('required_not_run')).toHaveLength(5);
    expect(
      screen.getByText('__tests__/falcon-expert-agent-core-eval-profile.test.ts'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('__tests__/axiom-interaction-hypothesis-kernel-contract.test.ts'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('__tests__/axiom-next-nbl-candidate-pages.test.tsx'),
    ).toBeInTheDocument();
  });

  it('renders the executed Gate 8 runner receipt without candidate or public movement', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.queryByText('passed_internal_preflight_not_promoted') ??
        screen.queryByText('failed_internal_preflight_not_promoted'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'prepare_falcon_candidate_surface_review_packet_only_not_public_release',
      ) ?? screen.queryByText('remain_internal_until_failed_or_not_run_checks_are_repaired'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/internal_preflight_check/)).toHaveLength(5);
    expect(screen.getAllByText(/satisfies: (true|false)/)).toHaveLength(5);
    expect(screen.getAllByText(/passed|failed/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/\/internal\/axiom-next-nbl-preview:/)).toBeInTheDocument();
    expect(screen.getByText(/\/internal\/axiom-next-nbl-candidate-pages:/)).toBeInTheDocument();
    expect(
      screen.getByText(/\/internal\/axiom-next-nbl-candidate-surface-scaffold:/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\/internal\/axiom-next-nbl-candidate-surface-render-adapter:/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\/internal\/axiom-next-nbl-candidate-surface-page-shell:/),
    ).toBeInTheDocument();
  });

  it('renders the candidate-surface review packet without executing review or promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('candidate_surface_review_packet_prepared_not_promoted'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_executed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_assigned_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_candidate_review')).toHaveLength(9);
    expect(screen.getAllByText('cross_surface_boundary_review').length).toBeGreaterThan(0);
    expect(screen.getByText('gate8_receipt_review')).toBeInTheDocument();
    expect(screen.getAllByText(/human_review_required_before_candidate_promotion/)).toHaveLength(
      11,
    );
    expect(screen.getAllByText(/public_release_requires_separate_founder_approval/)).toHaveLength(
      11,
    );
  });

  it('renders the internal candidate-surface implementation scaffold without promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_surface_implementation_scaffold_not_promoted'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_promoted_to_falcon_candidate_surface').length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText(/\/internal\/axiom-next-nbl-candidate-surface-scaffold#/).length,
    ).toBe(9);
    expect(screen.getAllByText(/section scaffolds/).length).toBe(9);
  });

  it('renders the internal candidate-surface render adapter without promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_surface_render_adapter_bundle_not_promoted'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('internal_render_adapter_not_promoted').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/\/internal\/axiom-next-nbl-candidate-surface-render-adapter#/).length,
    ).toBe(9);
    expect(screen.getAllByText(/render slots/).length).toBe(9);
  });

  it('renders the internal candidate-surface page shell without promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_surface_page_shell_bundle_not_promoted'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('internal_candidate_surface_page_shell_not_promoted').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/\/internal\/axiom-next-nbl-candidate-surface-page-shell#/).length,
    ).toBe(9);
    expect(screen.getAllByText(/page regions/).length).toBe(9);
  });

  it('renders the internal candidate-surface page-shell review packet without executing review', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_surface_page_shell_review_packet_prepared_not_executed'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_executed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('not_assigned_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_page_shell_review')).toHaveLength(9);
    expect(screen.getByText('cross_page_shell_boundary_review')).toBeInTheDocument();
    expect(screen.getByText('gate8_page_shell_receipt_boundary_review')).toBeInTheDocument();
    expect(screen.getAllByText(/review_region_kind_mapping/)).toHaveLength(11);
    expect(
      screen.getAllByText(/confirm_no_public_navigation_candidate_promotion_or_release/),
    ).toHaveLength(11);
  });

  it('renders the internal candidate-public-page preview assembly without promotion', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_public_page_preview_assembly_not_promoted'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('internal_candidate_public_page_preview_not_promoted').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/\/internal\/axiom-next-nbl-candidate-public-page-preview#/).length,
    ).toBe(9);
    expect(screen.getAllByText(/preview blocks/).length).toBe(9);
  });

  it('renders the internal candidate-public-page hold packet without release movement', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_public_page_hold_packet_prepared_not_released'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_candidate_public_page_hold')).toHaveLength(9);
    expect(screen.getByText('cross_candidate_public_page_hold')).toBeInTheDocument();
    expect(screen.getByText('gate8_candidate_public_page_hold')).toBeInTheDocument();
    expect(screen.getAllByText(/public_boundary/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/accessibility_readiness/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/regression_readiness/).length).toBeGreaterThan(0);
  });

  it('renders the internal candidate-release readiness ledger without release movement', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText('internal_candidate_release_readiness_ledger_prepared_not_released'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('not_ready_public_release_hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_candidate_release_readiness')).toHaveLength(9);
    expect(screen.getByText('cross_candidate_release_readiness')).toBeInTheDocument();
    expect(screen.getByText('gate8_candidate_release_readiness')).toBeInTheDocument();
    expect(screen.getByText('66')).toBeInTheDocument();
  });

  it('renders the internal candidate-surface promotion request packet as review input only', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_surface_promotion_request_packet_prepared_for_review_not_submitted_not_promoted',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('human_review_input_only')).toBeInTheDocument();
    expect(screen.getByText('not_submitted_by_codex')).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_candidate_surface_promotion_request_review_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_candidate_surface_promotion_request_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_candidate_surface_promotion_request_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('blocked_until_human_review_and_founder_public_release_gate').length,
    ).toBe(11);
  });

  it('renders the internal candidate-surface promotion handoff manifest as review handoff input only', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_surface_promotion_handoff_manifest_prepared_not_sent_not_promoted',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('founder_reviewer_handoff_input_only')).toBeInTheDocument();
    expect(screen.getAllByText('prepared_not_sent_by_codex').length).toBeGreaterThan(0);
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_candidate_surface_promotion_handoff_review_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_candidate_surface_promotion_handoff_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_candidate_surface_promotion_handoff_review_input'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/continue_internal_only/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/send_to_human_review_outside_codex/).length).toBeGreaterThan(0);
  });

  it('renders the internal public-release decision packet shell without approval or release', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_public_release_decision_packet_shell_prepared_not_decided_not_approved_not_released',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('public_release_decision_review_input_only')).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_public_release_decision_shell_review_input')).toHaveLength(
      9,
    );
    expect(
      screen.getByText('cross_public_release_decision_shell_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_public_release_decision_shell_review_input'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/founder_public_release_decision_required/).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/source_support_validity_review_required/).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/not_approved/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_published/).length).toBeGreaterThan(0);
  });

  it('renders the internal public-navigation release route shell without route activation or public navigation', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_public_navigation_release_route_shell_prepared_not_added_not_approved_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('public_navigation_release_route_review_input_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_public_navigation_release_route_shell_review_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_public_navigation_release_route_shell_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_public_navigation_release_route_shell_review_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/explicit_founder_public_navigation_decision_required/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/source_support_validity_must_be_decided_outside_codex/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_activated/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_added/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_approved/).length).toBeGreaterThan(0);
  });

  it('renders the internal final public-release review packet without executing review or release', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_final_public_release_review_packet_prepared_not_executed_not_approved_not_released',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('final_public_release_review_input_only')).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_final_public_release_review_input')).toHaveLength(9);
    expect(screen.getByText('cross_final_public_release_review_input')).toBeInTheDocument();
    expect(screen.getByText('gate8_final_public_release_review_input')).toBeInTheDocument();
    expect(
      screen.getAllByText(/founder_final_public_release_review_required/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/source_support_validity_decision_required_outside_codex/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_executed/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_assigned_by_codex/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_approved/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision handoff manifest without sending handoff or deciding release', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_handoff_manifest_prepared_not_sent_not_decided_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_handoff_input_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_founder_final_release_decision_handoff_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_handoff_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_handoff_input'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/founder_must_decide_outside_codex/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/source_support_validity_must_be_decided_outside_codex_before_release/)
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/prepared_not_sent_by_codex/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_decided/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_approved/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision receipt shell without receiving or deciding release', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_receipt_shell_prepared_not_received_not_decided_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_receipt_shell_not_received_input_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_founder_final_release_decision_receipt_shell_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_receipt_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_receipt_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/founder_decision_receipt_required_outside_codex/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/source_support_validity_receipt_required_outside_codex/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_received/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_decided/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_approved/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision ingestion contract without payload ingestion or release', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_ingestion_contract_prepared_empty_not_ingested_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_ingestion_contract_empty_not_ingested'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_founder_final_release_decision_ingestion_contract_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_ingestion_contract_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_ingestion_contract_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/external_founder_decision_payload_required_before_ingestion/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/source_support_validity_evidence_required_before_ingestion/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/empty/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_ingested/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_approved/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision payload shell without receiving or accepting a payload', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(
      screen.getByText(
        'internal_candidate_founder_final_release_decision_payload_shell_prepared_empty_not_received_not_ingested_not_released',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('founder_final_release_decision_payload_shell_empty_fixture_only'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_founder_final_release_decision_payload_shell_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_payload_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_payload_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/external_founder_decision_payload_must_be_supplied_outside_codex/)
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/payload_must_reference_source_support_validity_evidence/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/founderDecision/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/releaseDecision/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/declared_empty_fixture/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_accepted/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision payload validation gate without running validation or accepting payload', () => {
    render(<AxiomNextNblPreviewPage />);

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
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_founder_final_release_decision_payload_validation_gate_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_payload_validation_gate_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_payload_validation_gate_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/payload_fields_must_be_non_empty_before_validation/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/source_support_validity_evidence_must_be_present_before_validation/)
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_validated/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/rejected_before_ingestion/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_accepted/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision payload validation receipt shell without receiving validation receipt or validating payload', () => {
    render(<AxiomNextNblPreviewPage />);

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
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
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
    expect(
      screen.getAllByText(/payload_validation_receipt_required_after_external_payload_validation/)
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/empty_payload_rejection_receipt_required_before_return_to_payload_shell/)
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_received/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_validated/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_accepted/).length).toBeGreaterThan(0);
  });

  it('renders the internal Founder final-release decision payload return hold shell without completing or ingesting payload', () => {
    render(<AxiomNextNblPreviewPage />);

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
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('surface_founder_final_release_decision_payload_return_hold_shell_input'),
    ).toHaveLength(9);
    expect(
      screen.getByText('cross_founder_final_release_decision_payload_return_hold_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('gate8_founder_final_release_decision_payload_return_hold_shell_input'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/empty_payload_rejection_must_remain_visible_before_return/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/external_payload_completion_required_outside_codex/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/payload_return_hold_prepared/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/external_payload_shell_completion_required/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_accepted/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not_ingested/).length).toBeGreaterThan(0);
  });

  it('renders condensed framework-level human review units under the 100-unit limit', () => {
    render(<AxiomNextNblPreviewPage />);

    expect(screen.getAllByText('kernel_human_review_loop').length).toBeGreaterThan(0);
    expect(screen.getAllByText('11 / 100').length).toBeGreaterThan(0);
    expect(
      screen.getByText('framework_level_review_packet_prepared_internal_only'),
    ).toBeInTheDocument();
    expect(screen.getByText('kernel_contract_review')).toBeInTheDocument();
    expect(screen.getAllByText('cross_surface_boundary_review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('surface_slot_review')).toHaveLength(9);
    expect(screen.getByText('review_kernel_contract')).toBeInTheDocument();
    expect(screen.getByText('review_cross_surface_boundary')).toBeInTheDocument();
  });

  it('does not expose input, approval, publication, or runtime affordances', () => {
    const { container } = render(<AxiomNextNblPreviewPage />);

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
    expect(screen.getByText('not published')).toBeInTheDocument();
    expect(screen.getByText('not approved')).toBeInTheDocument();
  });
});
