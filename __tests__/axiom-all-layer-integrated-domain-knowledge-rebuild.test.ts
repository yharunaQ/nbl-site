import {
  AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY,
  buildAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  validateAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  type AxiomAllLayerIntegratedDomainKnowledgeRebuild,
} from '@/lib/axiom/allLayerIntegratedDomainKnowledgeRebuild';
import { buildAxiomRealDataStratifiedDomainReanalysis } from '@/lib/axiom/realDataStratifiedDomainReanalysis';

function cloneRebuild(
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild,
): AxiomAllLayerIntegratedDomainKnowledgeRebuild {
  return JSON.parse(JSON.stringify(rebuild)) as AxiomAllLayerIntegratedDomainKnowledgeRebuild;
}

describe('Axiom all-layer integrated domain knowledge rebuild candidate', () => {
  it('revalidates the provisional nine candidates instead of treating them as fixed units', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(reanalysis);
    const validation = validateAxiomAllLayerIntegratedDomainKnowledgeRebuild(
      rebuild,
      reanalysis,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'axiom_all_layer_integrated_domain_knowledge_rebuild_valid',
      errorCount: 0,
      boundary: AXIOM_ALL_LAYER_INTEGRATED_DOMAIN_KNOWLEDGE_REBUILD_BOUNDARY,
    });
    expect(rebuild).toMatchObject({
      objectType: 'axiom_all_layer_integrated_domain_knowledge_rebuild_candidate',
      lane: 'Falcon Lab',
      status: 'all_layer_rebuild_candidate_pending_founder_review',
      provisionalReviewUnitCount: 9,
      revalidatedReviewUnitCount: 10,
      provisionalNineUseStatus:
        'not_fixed_only_comparison_scaffold_after_all_layer_reanalysis',
      nextRequiredCoreMove:
        'founder_review_rebuilt_all_layer_units_before_integrated_domain_object_rebuild_or_surface_projection',
    });
    expect(rebuild.revalidationPrincipleJa).toContain('暫定9候補は固定入力ではない');
  });

  it('splits sensory information access from cognitive procedural access after all-layer review', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
    const splitDecision = rebuild.provisionalCandidateRevalidations.find(
      (decision) =>
        decision.provisionalUnitId === 'revised_unit_communication_and_information_access',
    );
    const rebuiltUnitIds = rebuild.rebuiltReviewUnits.map((unit) => unit.rebuiltUnitId);

    expect(splitDecision).toMatchObject({
      decision: 'split_after_all_layer_sweep',
      resultingRebuiltUnitIds: [
        'rebuilt_unit_sensory_information_access_communication',
        'rebuilt_unit_cognitive_procedural_access_switching_load',
      ],
    });
    expect(rebuiltUnitIds).toContain(
      'rebuilt_unit_sensory_information_access_communication',
    );
    expect(rebuiltUnitIds).toContain(
      'rebuilt_unit_cognitive_procedural_access_switching_load',
    );
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) => unit.rebuiltUnitId === 'rebuilt_unit_sensory_information_access_communication',
      )?.allLayerProtectionInputs.protectedSignalLabelsJa,
    ).toEqual(expect.arrayContaining(['弱視・視野障害', '難聴', 'ろうあ']));
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) => unit.rebuiltUnitId === 'rebuilt_unit_cognitive_procedural_access_switching_load',
      )?.allLayerProtectionInputs.protectedSignalLabelsJa,
    ).toEqual(expect.arrayContaining(['知的障害', '高次脳機能障害', 'てんかん']));
  });

  it('covers every protected layer, pattern family, pattern level, and source lens', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const tokenLayers = new Set<string>(
      rebuild.rebuiltReviewUnits.flatMap(
        (unit) => unit.allLayerProtectionInputs.tokenLayerIds,
      ),
    );
    const patternFamilies = new Set<string>(
      rebuild.rebuiltReviewUnits.flatMap(
        (unit) => unit.allLayerProtectionInputs.patternFamilyIds,
      ),
    );
    const patternLevels = new Set<string>(
      rebuild.rebuiltReviewUnits.flatMap(
        (unit) => unit.allLayerProtectionInputs.patternLevelIds,
      ),
    );
    const sourceLenses = new Set<string>(
      rebuild.rebuiltReviewUnits.flatMap(
        (unit) => unit.allLayerProtectionInputs.sourceLensIds,
      ),
    );
    const substructureSignals = new Set(
      rebuild.rebuiltReviewUnits.flatMap((unit) =>
        unit.substructures.flatMap((substructure) => substructure.protectedSignalsJa),
      ),
    );

    expect(rebuild.coverageAssertions).toMatchObject({
      protectedJointSubjectTokenLayerCount: 5,
      protectedJointSubjectTokenCount: 49,
      longTailHealthConditionTokenCount: 18,
      patternFamilyCount: 3,
      patternLevelCount: 3,
      sourceLensCount: 2,
    });
    for (const layerId of ['health_condition', 'narrative_concept', 'narrative_field', 'concept', 'frame']) {
      expect(tokenLayers.has(layerId)).toBe(true);
    }
    for (const familyId of ['communication_barrier', 'fatigue_schedule', 'accommodation_gap']) {
      expect(patternFamilies.has(familyId)).toBe(true);
    }
    for (const levelId of ['global', 'local', 'micro']) {
      expect(patternLevels.has(levelId)).toBe(true);
    }
    for (const lensId of ['nanbyo_survey_4000', 'historical_linked_triangular_source_family']) {
      expect(sourceLenses.has(lensId)).toBe(true);
    }
    expect(rebuild.allLayerCoverageReview).toMatchObject({
      reviewStatus:
        'coverage_sufficient_for_founder_review_not_for_final_public_projection',
      protectedTokenLayerCoverage: '5/5',
      protectedJointSubjectTokenCoverage: '49/49',
      longTailHealthConditionCoverage: '18/18',
      patternFamilyCoverage: '3/3',
      patternLevelCoverage: '3/3',
      sourceLensCoverage: '2/2',
      prohibitedShortcut:
        'do_not_accept_top_level_10_without_substructure_coverage_review',
    });
    expect(rebuild.allLayerCoverageReview.totalSubstructureCount).toBeGreaterThanOrEqual(34);
    for (const signal of reanalysis.longTailHealthConditionSignals) {
      expect(substructureSignals.has(signal.labelJa)).toBe(true);
    }
  });

  it('keeps all rebuilt units blocked from public projection until Founder review', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();

    expect(
      rebuild.rebuiltReviewUnits.every(
        (unit) =>
          unit.publicProjectionStatus ===
          'blocked_until_founder_review_accepts_revises_splits_merges_or_holds_this_rebuilt_unit',
      ),
    ).toBe(true);
    expect(rebuild.notNow).toEqual(
      expect.arrayContaining([
        'no_use_of_provisional_nine_as_fixed_final_domain_units',
        'no_surface_projection_before_founder_review_of_rebuilt_all_layer_units',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
      ]),
    );
  });

  it('keeps every rebuilt unit reviewable as a clear general-reader Founder card', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();

    expect(
      rebuild.rebuiltReviewUnits.every(
        (unit) =>
          unit.founderReviewCard.plainFindingJa.length > 20 &&
          unit.founderReviewCard.axiomReadingJa.length > 30 &&
          unit.founderReviewCard.changesReadingJa.length >= 2 &&
          unit.founderReviewCard.founderReviewQuestionJa.includes('受け入れてよいか') &&
          unit.founderReviewCard.nextNblUseCandidateJa.length > 20 &&
          unit.founderReviewCard.boundaryNoteJa.length > 20,
      ),
    ).toBe(true);
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) =>
          unit.rebuiltUnitId ===
          'rebuilt_unit_sensory_information_access_communication',
      )?.founderReviewCard.plainFindingJa,
    ).toContain('開示するかとは別');
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) =>
          unit.rebuiltUnitId ===
          'rebuilt_unit_cognitive_procedural_access_switching_load',
      )?.founderReviewCard.plainFindingJa,
    ).toContain('手順、説明、切替、評価');
  });

  it('marks coarse candidates for substructure review and gives them enough internal structure', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
    const requiredIds = [
      'rebuilt_unit_sensory_information_access_communication',
      'rebuilt_unit_cognitive_procedural_access_switching_load',
      'rebuilt_unit_pre_entry_job_image_transition',
      'rebuilt_unit_worksite_contact_task_safety_tools',
    ];

    expect(rebuild.allLayerCoverageReview.substructureRequiredUnitIds).toEqual(
      expect.arrayContaining(requiredIds),
    );
    for (const unitId of requiredIds) {
      const unit = rebuild.rebuiltReviewUnits.find(
        (candidate) => candidate.rebuiltUnitId === unitId,
      );

      expect(unit?.granularityStatus).toBe(
        'requires_substructure_review_before_surface_projection',
      );
      expect(unit?.substructureCoverageStatus).toBe(
        'substructure_must_be_reviewed_before_surface_projection',
      );
      expect(unit?.substructures.length).toBeGreaterThanOrEqual(4);
    }
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) => unit.rebuiltUnitId === 'rebuilt_unit_worksite_contact_task_safety_tools',
      )?.substructures.map((substructure) => substructure.labelJa),
    ).toEqual(
      expect.arrayContaining([
        '作業分解・仕事密度・手順の接触点',
        '道具・設備・物理/感覚環境',
        '職場内移動・職場外移動・通勤接続',
        '安全・リスク・ミス許容度',
        '人員余力・顧客接点・調整余地',
      ]),
    );
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) => unit.rebuiltUnitId === 'rebuilt_unit_fluctuating_health_time_work_density',
      )?.substructures.map((substructure) => substructure.labelJa),
    ).toEqual(expect.arrayContaining(['通勤・職場外移動が健康時間を消耗する']));
    expect(
      rebuild.rebuiltReviewUnits.find(
        (unit) =>
          unit.rebuiltUnitId ===
          'rebuilt_unit_sensory_information_access_communication',
      )?.substructures.map((substructure) => substructure.labelJa),
    ).toEqual(expect.arrayContaining(['身体操作・道具操作へのアクセス']));
  });

  it('runs a pre-Founder autonomous review pass that reduces but does not replace Founder judgment', () => {
    const rebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild();
    const review = rebuild.preFounderAutonomousReview;
    const passIds = review.findings.map((finding) => finding.passId);
    const mobilityFinding = review.findings.find(
      (finding) => finding.passId === 'mobility_and_accessibility_overlap_review',
    );

    expect(review).toMatchObject({
      status:
        'pre_founder_autonomous_review_complete_founder_attention_reduced_not_replaced',
      findingCount: 5,
      founderAttentionRequiredCount: 3,
      resolvedFindingCount: 2,
    });
    expect(passIds).toEqual(
      expect.arrayContaining([
        'granularity_balance_review',
        'cross_disability_coverage_review',
        'mobility_and_accessibility_overlap_review',
        'source_count_bias_review',
        'surface_projection_risk_review',
      ]),
    );
    expect(
      review.findings.every(
        (finding) =>
          finding.observationJa.length > 20 &&
          finding.correctionAppliedJa.length > 20 &&
          finding.remainingFounderQuestionJa.length > 20 &&
          finding.blocksSurfaceProjection,
      ),
    ).toBe(true);
    expect(mobilityFinding).toMatchObject({
      relatedRebuiltUnitIds: expect.arrayContaining([
        'rebuilt_unit_fluctuating_health_time_work_density',
        'rebuilt_unit_sensory_information_access_communication',
        'rebuilt_unit_worksite_contact_task_safety_tools',
      ]),
      relatedSubstructureIds: expect.arrayContaining([
        'health_time_commute_and_mobility_consumption',
        'sensory_access_body_operation_and_tool_contact',
        'worksite_contact_internal_external_mobility_and_commute',
      ]),
    });
    expect(review.founderReviewCompression.founderReviewRoleJa).toContain(
      '一つずつ監査するのではなく',
    );
    expect(review.founderReviewCompression.codexPreReviewRoleJa).toContain(
      '先に検査',
    );
    expect(review.notNow).toEqual(
      expect.arrayContaining([
        'no_replacement_of_founder_review_by_codex_autonomous_review',
        'no_public_approval_or_publication',
        'no_learning_update',
      ]),
    );
  });

  it('rejects regressions that restore fixed nine, merge the split, or drop all-layer coverage', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const rebuild = cloneRebuild(buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(reanalysis));

    rebuild.provisionalNineUseStatus =
      'fixed_final_units' as 'not_fixed_only_comparison_scaffold_after_all_layer_reanalysis';
    rebuild.revalidatedReviewUnitCount = 9 as 10;
    rebuild.rebuiltReviewUnits = rebuild.rebuiltReviewUnits.filter(
      (unit) =>
        unit.rebuiltUnitId !==
        'rebuilt_unit_cognitive_procedural_access_switching_load',
    );
    rebuild.rebuiltReviewUnits = rebuild.rebuiltReviewUnits.map((unit) => ({
      ...unit,
      allLayerProtectionInputs: {
        ...unit.allLayerProtectionInputs,
        patternFamilyIds: unit.allLayerProtectionInputs.patternFamilyIds.filter(
          (familyId) => familyId !== 'accommodation_gap',
        ),
      },
    }));
    rebuild.coverageAssertions.patternFamilyCount = 2 as 3;
    rebuild.notNow = rebuild.notNow.filter(
      (item) => item !== 'no_use_of_provisional_nine_as_fixed_final_domain_units',
    );
    rebuild.preFounderAutonomousReview.passIds = rebuild.preFounderAutonomousReview.passIds.filter(
      (passId) => passId !== 'mobility_and_accessibility_overlap_review',
    );
    rebuild.preFounderAutonomousReview.findings =
      rebuild.preFounderAutonomousReview.findings.filter(
        (finding) => finding.passId !== 'mobility_and_accessibility_overlap_review',
      );
    rebuild.preFounderAutonomousReview.findingCount = 4;
    rebuild.preFounderAutonomousReview.founderReviewCompression.founderReviewRoleJa = '';
    rebuild.preFounderAutonomousReview.notNow =
      rebuild.preFounderAutonomousReview.notNow.filter(
        (item) => item !== 'no_replacement_of_founder_review_by_codex_autonomous_review',
      );
    rebuild.rebuiltReviewUnits[0].founderReviewCard.plainFindingJa = '';
    rebuild.rebuiltReviewUnits[0].substructures = [];
    rebuild.allLayerCoverageReview.longTailHealthConditionCoverage = '17/18' as '18/18';

    const validation = validateAxiomAllLayerIntegratedDomainKnowledgeRebuild(
      rebuild,
      reanalysis,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'provisional_nine_must_not_be_used_as_fixed_final_units',
        'all_layer_rebuild_must_split_information_access_from_cognitive_procedural_load',
        'all_provisional_candidates_must_be_revalidated_and_information_access_must_split',
        'coverage_assertions_must_match_all_layer_reanalysis_counts',
        'rebuilt_units_must_cover_all_protected_layers_patterns_and_source_lenses',
        'not_now_must_block_fixed_nine_surface_runtime_publication_and_learning',
        'all_layer_coverage_review_must_protect_long_tail_substructure_and_coarse_units',
        'pre_founder_autonomous_review_must_run_all_required_passes_before_founder_review',
        'pre_founder_autonomous_review_must_record_mobility_accessibility_correction',
        'pre_founder_autonomous_review_must_reduce_but_not_replace_founder_review',
        'rebuilt_unit_must_have_reviewable_substructure:rebuilt_unit_fluctuating_health_time_work_density',
        'rebuilt_unit_must_have_clear_founder_review_card:rebuilt_unit_fluctuating_health_time_work_density',
      ]),
    );
  });
});
