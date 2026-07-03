import {
  AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY,
  buildAxiomManifoldDisplayBridge,
  validateAxiomManifoldDisplayBridge,
  type AxiomManifoldDisplayBridge,
} from '@/lib/axiom/axiomManifoldDisplayBridge';

function cloneBridge(bridge: AxiomManifoldDisplayBridge): AxiomManifoldDisplayBridge {
  return JSON.parse(JSON.stringify(bridge)) as AxiomManifoldDisplayBridge;
}

describe('Axiom manifold display bridge', () => {
  it('builds an internal shadow-to-manifold display bridge from existing Axiom derived objects', () => {
    const bridge = buildAxiomManifoldDisplayBridge();
    const validation = validateAxiomManifoldDisplayBridge(bridge);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_manifold_display_bridge_valid',
      errorCount: 0,
      boundary: AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY,
    });
    expect(bridge).toMatchObject({
      bridgeId: 'axiom_manifold_display_bridge_v0_2026_06_28',
      lane: 'Falcon Lab',
      status:
        'internal_html_svg_simulation_ready_for_founder_understanding_not_public_video_approval',
      numericSourceSummary: {
        jointSubjectCount: 9076,
        employmentSurveyCount: 4553,
        nanbyoSurveyCount: 4523,
        manifoldPatternCount: 44,
        revisedReviewUnitCount: 9,
        integratedAxisCount: 6,
      },
    });
    expect(bridge.strengthensCore).toEqual([
      'kernel_display',
      'kernel_eval',
      'kernel_human_review_loop',
    ]);
    expect(bridge.sourceObjectIds.stratifiedReanalysisId).toBe(
      'axiom_real_data_stratified_domain_reanalysis_v0_2026_06_12',
    );
    expect(bridge.sourceObjectIds.integratedDomainKnowledgeObjectId).toBe(
      'axiom_integrated_domain_knowledge_object_candidate_v0_2026_06_11',
    );
  });

  it('keeps the simulation numeric, phased, and review-bound instead of claiming public truth', () => {
    const bridge = buildAxiomManifoldDisplayBridge();
    const phaseIds = bridge.phases.map((phase) => phase.phaseId);

    expect(phaseIds).toEqual([
      'distorted_shadow',
      'icf_interaction_reconstruction',
      'latent_manifold',
      'revised_human_shadow',
    ]);
    expect(bridge.boundaryLanguageJa).toContain('真実の最終断定');
    expect(bridge.publicCopyRiskReview.primaryRiskJa).toContain('過剰主張');
    expect(bridge.publicCopyRiskReview.requiredBeforePublicUseJa).toEqual(
      expect.arrayContaining([
        'Founder public-copy review',
        'campaign-content boundary review for video assets',
        'separate publication approval',
      ]),
    );

    for (const node of bridge.simulation.nodes) {
      expect(Object.keys(node.phaseCoordinates).sort()).toEqual([...phaseIds].sort());
      expect(['internal_only', 'candidate_projection_only', 'not_public_approved']).toContain(
        node.publicUseStatus,
      );
      expect(node.sourceBasisJa.join(' ')).not.toContain('data/original_secure');
    }

    expect(
      bridge.simulation.nodes.filter((node) => node.kind === 'source_shadow_word'),
    ).toHaveLength(6);
    expect(bridge.simulation.nodes.some((node) => node.kind === 'latent_axis')).toBe(true);
    expect(bridge.simulation.nodes.some((node) => node.kind === 'public_projection')).toBe(true);
    expect(
      bridge.simulation.edges.every(
        (edge) => edge.evidenceDisciplineJa.length > 0 && edge.weight > 0,
      ),
    ).toBe(true);
  });

  it('rejects bridges that drop boundary, source counts, graph discipline, or not-now gates', () => {
    const bridge = cloneBridge(buildAxiomManifoldDisplayBridge());
    bridge.boundary = 'public_ready_truth_machine' as typeof AXIOM_MANIFOLD_DISPLAY_BRIDGE_BOUNDARY;
    bridge.numericSourceSummary.jointSubjectCount = 1;
    bridge.numericSourceSummary.manifoldPatternCount = 1;
    bridge.boundaryLanguageJa = 'AIが真実を発見する';
    bridge.simulation.nodes = bridge.simulation.nodes.filter(
      (node) => node.kind !== 'public_projection',
    );
    bridge.simulation.edges[0].targetNodeId = 'missing_node';
    bridge.notNow = bridge.notNow.filter(
      (item) => item !== 'no_actual_public_navigation_or_publication',
    );

    const validation = validateAxiomManifoldDisplayBridge(bridge);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'bridge_boundary_must_match_internal_display_contract',
        'bridge_must_reference_existing_stratified_reanalysis_counts',
        'bridge_must_preserve_44_manifold_pattern_basis',
        'bridge_must_block_truth_machine_language',
        'bridge_missing_node_kind:public_projection',
        'edge_references_missing_node:fatigue_to_health_time',
        'bridge_missing_not_now:no_actual_public_navigation_or_publication',
      ]),
    );
  });
});
