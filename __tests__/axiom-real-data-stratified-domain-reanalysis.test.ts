import fs from 'fs';

import {
  AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY,
  buildAxiomRealDataStratifiedDomainReanalysis,
  validateAxiomRealDataStratifiedDomainReanalysis,
  type AxiomRealDataStratifiedDomainReanalysis,
} from '@/lib/axiom/realDataStratifiedDomainReanalysis';

function cloneReanalysis(
  reanalysis: AxiomRealDataStratifiedDomainReanalysis,
): AxiomRealDataStratifiedDomainReanalysis {
  return JSON.parse(JSON.stringify(reanalysis)) as AxiomRealDataStratifiedDomainReanalysis;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function countJointSubjectTokens(path: string, tokenColumns: string[]) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const indexByColumn = new Map(header.map((column, index) => [column, index]));
  const counts = Object.fromEntries(tokenColumns.map((column) => [column, 0]));
  const datasetCounts: Record<string, number> = {};

  for (const line of lines.slice(1)) {
    const columns = parseCsvLine(line);
    const datasetId = columns[indexByColumn.get('dataset_id') ?? -1];
    datasetCounts[datasetId] = (datasetCounts[datasetId] ?? 0) + 1;

    for (const tokenColumn of tokenColumns) {
      const columnIndex = indexByColumn.get(tokenColumn);
      if (typeof columnIndex === 'number' && Number(columns[columnIndex]) > 0) {
        counts[tokenColumn] += 1;
      }
    }
  }

  return {
    rowCount: lines.length - 1,
    datasetCounts,
    counts,
  };
}

function countHealthConditionTokens(path: string) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const healthColumns = header
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => column.startsWith('token__health_condition::'));

  return healthColumns
    .map(({ column, index }) => {
      let count = 0;

      for (const line of lines.slice(1)) {
        const columns = parseCsvLine(line);
        if (Number(columns[index]) > 0) count += 1;
      }

      return {
        labelJa: column.replace('token__health_condition::', ''),
        sourceTokenColumn: column,
        count,
      };
    })
    .sort((left, right) => right.count - left.count);
}

function countTokenLayer(path: string, layerId: string) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const prefix = `token__${layerId}::`;
  const tokenColumns = header
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => column.startsWith(prefix));

  return tokenColumns
    .map(({ column, index }) => {
      let count = 0;

      for (const line of lines.slice(1)) {
        const columns = parseCsvLine(line);
        if (Number(columns[index]) > 0) count += 1;
      }

      return {
        layerId,
        labelJa: column.replace(prefix, ''),
        sourceTokenColumn: column,
        count,
      };
    })
    .sort((left, right) => left.labelJa.localeCompare(right.labelJa, 'ja'));
}

function countEmploymentPhaseFromStructuredFeatures(path: string) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const indexByColumn = new Map(header.map((column, index) => [column, index]));
  const respondents = new Set<string>();
  const workExperienceCounts: Record<string, number> = {};
  const q7AnyNotUnneededRespondents = new Set<string>();
  const q7ProblemOrResolvedRespondents = new Set<string>();

  for (const line of lines.slice(1)) {
    const columns = parseCsvLine(line);
    const respondentId = columns[indexByColumn.get('respondent_id') ?? -1];
    const rawName = columns[indexByColumn.get('raw_name') ?? -1];
    const labelText = columns[indexByColumn.get('label_text') ?? -1];
    respondents.add(respondentId);

    if (rawName === '8就労経験') {
      workExperienceCounts[labelText] = (workExperienceCounts[labelText] ?? 0) + 1;
    }
    if (rawName.startsWith('7') && rawName !== '７記述') {
      if (labelText && labelText !== '特に必要なし') {
        q7AnyNotUnneededRespondents.add(respondentId);
      }
      if (labelText === '課題が未解決' || labelText === '課題があったが解決済') {
        q7ProblemOrResolvedRespondents.add(respondentId);
      }
    }
  }

  return {
    respondentCount: respondents.size,
    workExperienceCounts,
    nonCurrentIncomeWorkCount:
      (workExperienceCounts[
        '現在は仕事での収入はないが、過去に収入のある仕事に就いていたことがある'
      ] ?? 0) + (workExperienceCounts['過去に収入のある仕事に就いたことはない'] ?? 0),
    q7AnyNotUnneededRespondentCount: q7AnyNotUnneededRespondents.size,
    q7ProblemOrResolvedRespondentCount: q7ProblemOrResolvedRespondents.size,
  };
}

function countUpperDisabilityCategoriesFromStructuredFeatures(
  structuredFeaturesPath: string,
  codebookPath: string,
) {
  const codebookLines = fs.readFileSync(codebookPath, 'utf8').trim().split(/\r?\n/);
  const codebookHeader = parseCsvLine(codebookLines[0]);
  const codebookIndexByColumn = new Map(
    codebookHeader.map((column, index) => [column, index]),
  );
  const classLine = codebookLines
    .slice(1)
    .map(parseCsvLine)
    .find((columns) => columns[codebookIndexByColumn.get('raw_name') ?? -1] === '分類名');
  const optionLabels =
    classLine?.[codebookIndexByColumn.get('labels_joined') ?? -1].split(' | ') ?? [];
  const upperLabels = new Set([
    '視覚障害',
    '聴覚・平衡機能障害',
    '肢体不自由',
    '内部障害',
    '知的障害',
    '精神障害',
    '発達障害',
    '高次脳機能障害',
    '難病',
  ]);
  const lines = fs.readFileSync(structuredFeaturesPath, 'utf8').trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const indexByColumn = new Map(header.map((column, index) => [column, index]));
  const counts: Record<string, number> = {};

  for (const line of lines.slice(1)) {
    const columns = parseCsvLine(line);
    if (columns[indexByColumn.get('raw_name') ?? -1] !== '分類名') continue;

    const seen = new Set<string>();
    const normalizedValue = columns[indexByColumn.get('normalized_value') ?? -1];
    for (const code of normalizedValue.split('+').filter(Boolean)) {
      const label = optionLabels[Number(code) - 1];
      if (!label || !upperLabels.has(label) || seen.has(label)) continue;
      seen.add(label);
      counts[label] = (counts[label] ?? 0) + 1;
    }
  }

  return counts;
}

function countFreeTextRespondents(path: string, rawName: string) {
  const respondentIds = new Set<string>();
  let unitCount = 0;

  for (const line of fs.readFileSync(path, 'utf8').trim().split(/\r?\n/)) {
    const item = JSON.parse(line) as { respondent_id: string; raw_name: string };
    if (item.raw_name !== rawName) continue;
    respondentIds.add(item.respondent_id);
    unitCount += 1;
  }

  return {
    respondentCount: respondentIds.size,
    unitCount,
  };
}

describe('Axiom real-data stratified domain reanalysis', () => {
  it('supersedes the six-axis correction with a stratified reanalysis object', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const validation = validateAxiomRealDataStratifiedDomainReanalysis(reanalysis);

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'real_data_stratified_domain_reanalysis_valid',
      errorCount: 0,
      boundary: AXIOM_REAL_DATA_STRATIFIED_DOMAIN_REANALYSIS_BOUNDARY,
    });
    expect(reanalysis).toMatchObject({
      objectType: 'axiom_real_data_stratified_domain_reanalysis',
      lane: 'Falcon Lab',
      status: 'stratified_reanalysis_complete_six_axis_candidate_superseded',
      oldSixAxisFinding:
        'superseded_not_safe_to_use_as_final_integrated_domain_knowledge',
      minoritySignalProtectionPolicy: {
        policyId: 'low_n_high_specificity_signal_sweep_before_axis_rebuild',
        scope: 'all_scannable_layers_before_axis_rebuild_not_only_founder_examples',
        longTailHealthConditionTokenCount: 18,
        upperDisabilityCategoryCount: 9,
        prohibitedShortcut: 'patch_only_examples_named_in_founder_review',
      },
      reviewUnitCandidateSetStatus:
        'provisional_pre_all_layer_candidate_set_requires_revalidation_after_all_layer_sweep',
      revisedReviewUnitCount: 9,
      nextRequiredCoreMove:
        'rebuild_integrated_domain_knowledge_object_from_all_layer_reanalysis_and_revalidate_review_unit_candidates_before_surface_projection',
    });
  });

  it('matches the local joint subject space counts for dominant and protected signals', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const sourceCounts = countJointSubjectTokens(reanalysis.sourceArtifacts.jointSubjectSpaceCsv, [
      'token__health_condition::難病法による指定難病の診断を受け、医療受給者証を所持している',
      'token__health_condition::弱視・視野障害',
      'token__health_condition::難聴',
      'token__health_condition::ろうあ',
      'token__health_condition::血液透析適用',
      'token__narrative_field::７記述',
    ]);

    const signalsById = new Map(
      reanalysis.signals.map((signal) => [signal.signalId, signal]),
    );

    expect(sourceCounts.rowCount).toBe(reanalysis.dataProfile.jointSubjectCount);
    expect(sourceCounts.datasetCounts).toEqual(reanalysis.dataProfile.datasetCounts);
    expect(
      signalsById.get('signal_rare_disease_designated_heavy_loading')?.sourceMetric.count,
    ).toBe(
      sourceCounts.counts[
        'token__health_condition::難病法による指定難病の診断を受け、医療受給者証を所持している'
      ],
    );
    expect(
      signalsById.get('signal_visual_hearing_information_access')?.sourceMetric.count,
    ).toBe(
      sourceCounts.counts['token__health_condition::弱視・視野障害'] +
        sourceCounts.counts['token__health_condition::難聴'] +
        sourceCounts.counts['token__health_condition::ろうあ'],
    );
    expect(
      signalsById.get('signal_internal_disability_regular_monitoring')?.sourceMetric.count,
    ).toBe(sourceCounts.counts['token__health_condition::血液透析適用']);
    expect(
      signalsById.get('signal_pre_entry_job_image_and_transition')?.sourceMetric.count,
    ).toBe(sourceCounts.counts['token__narrative_field::７記述']);
    expect(
      signalsById.get('signal_general_long_tail_health_condition_sweep')?.sourceMetric,
    ).toMatchObject({
      metricKind: 'long_tail_health_condition_token_count',
      count: 18,
      denominator: 22,
    });
    expect(
      signalsById.get('signal_all_scannable_layers_before_axis_rebuild')?.sourceMetric,
    ).toMatchObject({
      metricKind: 'all_scannable_layer_count',
      count: 10,
    });
  });

  it('keeps pre-entry and non-current work as a large employment-phase signal, not low-frequency residue', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const phaseCounts = countEmploymentPhaseFromStructuredFeatures(
      reanalysis.sourceArtifacts.employmentSurveyStructuredFeaturesCsv,
    );
    const q7FreeTextCounts = countFreeTextRespondents(
      'data/analysis_ready/respondents/employment_survey_3000/v0/free_text_units.jsonl',
      '７記述',
    );
    const signalsById = new Map(
      reanalysis.signals.map((signal) => [signal.signalId, signal]),
    );

    expect(phaseCounts.respondentCount).toBe(
      reanalysis.employmentPhaseCoverageAudit.totalRespondents,
    );
    expect(phaseCounts.workExperienceCounts['現在、収入のある仕事に就いている']).toBe(
      reanalysis.employmentPhaseCoverageAudit.currentIncomeWorkCount,
    );
    expect(phaseCounts.nonCurrentIncomeWorkCount).toBe(
      reanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkCount,
    );
    expect(phaseCounts.q7AnyNotUnneededRespondentCount).toBe(
      reanalysis.employmentPhaseCoverageAudit.q7StructuredAnyNotUnneededRespondentCount,
    );
    expect(phaseCounts.q7ProblemOrResolvedRespondentCount).toBe(
      reanalysis.employmentPhaseCoverageAudit.q7StructuredProblemOrResolvedRespondentCount,
    );
    expect(q7FreeTextCounts).toMatchObject({
      respondentCount: reanalysis.employmentPhaseCoverageAudit.q7FreeTextRespondentCount,
      unitCount: reanalysis.employmentPhaseCoverageAudit.q7FreeTextUnitCount,
    });
    expect(reanalysis.employmentPhaseCoverageAudit).toMatchObject({
      nonCurrentIncomeWorkPercent: '35.8%',
      interpretationCorrectionJa: expect.stringContaining('低頻度ではない'),
    });
    expect(
      signalsById.get('signal_non_current_income_work_population')?.sourceMetric,
    ).toMatchObject({
      metricKind: 'employment_survey_respondent_count',
      count: 1630,
      denominator: 4553,
    });
    expect(
      reanalysis.revisedReviewUnitCandidates.find(
        (unit) => unit.unitId === 'revised_unit_pre_entry_job_image_and_transition',
      )?.sourceSignalIds,
    ).toEqual(
      expect.arrayContaining([
        'signal_pre_entry_job_image_and_transition',
        'signal_non_current_income_work_population',
      ]),
    );
  });

  it('protects all low-n health-condition tokens, not only Founder examples', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const sourceHealthCounts = countHealthConditionTokens(
      reanalysis.sourceArtifacts.jointSubjectSpaceCsv,
    );
    const sourceLongTail = sourceHealthCounts
      .filter(
        (token) =>
          token.count > 0 &&
          token.count < reanalysis.minoritySignalProtectionPolicy.lowNThresholdCount,
      )
      .sort((left, right) => left.labelJa.localeCompare(right.labelJa, 'ja'));
    const reanalysisLongTail = reanalysis.longTailHealthConditionSignals
      .map(({ labelJa, sourceTokenColumn, count }) => ({
        labelJa,
        sourceTokenColumn,
        count,
      }))
      .sort((left, right) => left.labelJa.localeCompare(right.labelJa, 'ja'));

    expect(sourceHealthCounts).toHaveLength(
      reanalysis.minoritySignalProtectionPolicy.totalHealthConditionTokenCount,
    );
    expect(sourceLongTail).toHaveLength(
      reanalysis.minoritySignalProtectionPolicy.longTailHealthConditionTokenCount,
    );
    expect(reanalysisLongTail).toEqual(sourceLongTail);
    expect(
      reanalysis.longTailHealthConditionSignals.every(
        (signalItem) => signalItem.routedToReviewUnitIds.length > 0,
      ),
    ).toBe(true);
    for (const nonExampleLongTailSignal of [
      '知的障害',
      '高次脳機能障害',
      '切断、その他',
      '頸髄損傷',
      'てんかん',
      '皮膚筋炎／多発性筋炎',
      '重症筋無力症',
    ]) {
      expect(
        reanalysis.longTailHealthConditionSignals.map((signalItem) => signalItem.labelJa),
      ).toContain(nonExampleLongTailSignal);
    }
  });

  it('preserves upper disability categories separately from detailed health-condition tokens', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const sourceUpperCounts = countUpperDisabilityCategoriesFromStructuredFeatures(
      reanalysis.sourceArtifacts.employmentSurveyStructuredFeaturesCsv,
      reanalysis.sourceArtifacts.employmentSurveyCodebookCsv,
    );
    const reanalysisUpperCounts = Object.fromEntries(
      reanalysis.upperDisabilityCategorySignals.map((signalItem) => [
        signalItem.labelJa,
        signalItem.count,
      ]),
    );

    expect(reanalysis.upperDisabilityCategorySignals).toHaveLength(9);
    expect(reanalysisUpperCounts).toEqual(sourceUpperCounts);
    expect(reanalysisUpperCounts).toMatchObject({
      難病: 2138,
      内部障害: 757,
      肢体不自由: 651,
      精神障害: 598,
      '聴覚・平衡機能障害': 464,
      知的障害: 432,
      視覚障害: 349,
      発達障害: 335,
      高次脳機能障害: 290,
    });
    expect(
      reanalysis.upperDisabilityCategorySignals.every(
        (signalItem) =>
          signalItem.sourceCategoryRole ===
            'upper_disability_category_not_detail_disease_token' &&
          signalItem.routedToReviewUnitIds.length > 0,
      ),
    ).toBe(true);
    expect(
      reanalysis.signals.find(
        (signal) => signal.signalId === 'signal_upper_disability_category_sweep',
      ),
    ).toMatchObject({
      sourceMetric: {
        metricKind: 'analysis_ready_item_coverage_count',
        count: 9,
      },
    });
  });

  it('protects every scannable joint-subject token layer before rebuilding axes', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const expectedLayerCounts = {
      health_condition: 22,
      narrative_concept: 5,
      narrative_field: 18,
      concept: 3,
      frame: 1,
    };

    expect(reanalysis.minoritySignalProtectionPolicy.scannableLayerIds).toEqual([
      'joint_subject_health_condition_tokens',
      'joint_subject_narrative_concept_tokens',
      'joint_subject_narrative_field_tokens',
      'joint_subject_concept_tokens',
      'joint_subject_frame_tokens',
      'employment_survey_upper_disability_category_labels',
      'employment_survey_employment_phase_labels',
      'manifold_pattern_family_counts',
      'manifold_pattern_level_counts',
      'source_model_prior_lenses',
    ]);

    for (const [layerId, expectedCount] of Object.entries(expectedLayerCounts)) {
      const sourceLayer = countTokenLayer(
        reanalysis.sourceArtifacts.jointSubjectSpaceCsv,
        layerId,
      );
      const reanalysisLayer = reanalysis.protectedTokenLayerSummaries.find(
        (layer) => layer.layerId === layerId,
      );

      expect(sourceLayer).toHaveLength(expectedCount);
      expect(reanalysisLayer?.totalTokenCount).toBe(expectedCount);
      expect(reanalysisLayer?.protectedTokenCount).toBe(expectedCount);
      expect(
        reanalysisLayer?.tokens
          .map(({ layerId: tokenLayerId, labelJa, sourceTokenColumn, count }) => ({
            layerId: tokenLayerId,
            labelJa,
            sourceTokenColumn,
            count,
          }))
          .sort((left, right) => left.labelJa.localeCompare(right.labelJa, 'ja')),
      ).toEqual(sourceLayer);
      expect(
        reanalysisLayer?.tokens.every((token) => token.routedToReviewUnitIds.length > 0),
      ).toBe(true);
    }

    const narrativeFieldLayer = reanalysis.protectedTokenLayerSummaries.find(
      (layer) => layer.layerId === 'narrative_field',
    );

    expect(narrativeFieldLayer?.tokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          labelJa: 'xQ11',
          count: 149,
          protectionClass: 'low_n_high_specificity',
        }),
        expect.objectContaining({
          labelJa: '5記述',
          count: 491,
          protectionClass: 'phase_specific_context',
        }),
      ]),
    );
  });

  it('uses the existing multilevel manifold pattern output instead of principal-load-only compression', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const patternOutput = JSON.parse(
      fs.readFileSync(reanalysis.sourceArtifacts.respondentManifoldPatternsJson, 'utf8'),
    ) as {
      patterns: Array<{ pattern_key: string; pattern_level: string }>;
    };
    const familyCounts = patternOutput.patterns.reduce<Record<string, number>>(
      (counts, pattern) => {
        const family = pattern.pattern_key.replace(/_pattern_.*/, '');
        counts[family] = (counts[family] ?? 0) + 1;
        return counts;
      },
      {},
    );
    const levelCounts = patternOutput.patterns.reduce<Record<string, number>>(
      (counts, pattern) => {
        const level = pattern.pattern_level;
        counts[level] = (counts[level] ?? 0) + 1;
        return counts;
      },
      {},
    );

    expect(patternOutput.patterns).toHaveLength(44);
    expect(familyCounts).toMatchObject({
      communication_barrier: 16,
      fatigue_schedule: 21,
      accommodation_gap: 7,
    });
    expect(levelCounts).toMatchObject({
      global: 11,
      local: 17,
      micro: 16,
    });
    expect(
      Object.fromEntries(
        reanalysis.patternFamilyProtections.map((family) => [
          family.familyId,
          family.patternCount,
        ]),
      ),
    ).toEqual(familyCounts);
    expect(
      Object.fromEntries(
        reanalysis.patternLevelProtections.map((level) => [
          level.levelId,
          level.patternCount,
        ]),
      ),
    ).toEqual(levelCounts);
    expect(
      reanalysis.patternFamilyProtections.find(
        (family) => family.familyId === 'accommodation_gap',
      ),
    ).toMatchObject({
      patternCount: 7,
      routedToReviewUnitIds: expect.arrayContaining([
        'revised_unit_worksite_contact_task_safety_tools',
        'revised_unit_support_retranslation_continuity_network',
      ]),
    });
    expect(
      reanalysis.signals.find(
        (signal) => signal.signalId === 'signal_multilevel_pattern_family_balance',
      ),
    ).toMatchObject({
      sourceMetric: {
        metricKind: 'manifold_pattern_count',
        count: 44,
      },
      axisImplication: 'must_split_from_existing_axis',
    });
  });

  it('keeps nine provisional review-unit candidates for revalidation after the all-layer sweep', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
    const unitIds = reanalysis.revisedReviewUnitCandidates.map((unit) => unit.unitId);

    expect(reanalysis.reviewUnitCandidateSetStatus).toBe(
      'provisional_pre_all_layer_candidate_set_requires_revalidation_after_all_layer_sweep',
    );
    expect(reanalysis.reviewUnitCandidateSetUseJa).toContain('最終review unit構造ではない');
    expect(reanalysis.reviewUnitCandidateSetUseJa).toContain('維持・分割・統合・rename・hold');
    expect(unitIds).toEqual([
      'revised_unit_fluctuating_health_time_and_work_density',
      'revised_unit_regular_medical_monitoring_and_treatment_time',
      'revised_unit_communication_and_information_access',
      'revised_unit_disclosure_stigma_and_purpose_limited_information',
      'revised_unit_pre_entry_job_image_and_transition',
      'revised_unit_worksite_contact_task_safety_tools',
      'revised_unit_support_retranslation_continuity_network',
      'revised_unit_role_value_growth_quality_loop',
      'revised_unit_source_lens_universal_structure_and_boundary_guard',
    ]);
    expect(
      reanalysis.revisedReviewUnitCandidates.every(
        (unit) =>
          unit.reviewRoute ===
          'founder_review_required_before_integrated_domain_object_rebuild_or_surface_projection',
      ),
    ).toBe(true);
  });

  it('rejects attempts to keep the old six-axis object or project surfaces before rebuild', () => {
    const reanalysis = cloneReanalysis(buildAxiomRealDataStratifiedDomainReanalysis());

    reanalysis.oldSixAxisFinding =
      'accepted_final' as 'superseded_not_safe_to_use_as_final_integrated_domain_knowledge';
    reanalysis.revisedReviewUnitCandidates = reanalysis.revisedReviewUnitCandidates.slice(0, 6);
    reanalysis.revisedReviewUnitCount = 6 as 9;
    reanalysis.nextRequiredCoreMove =
      'project_surfaces_now' as 'rebuild_integrated_domain_knowledge_object_from_all_layer_reanalysis_and_revalidate_review_unit_candidates_before_surface_projection';
    reanalysis.notNow = reanalysis.notNow.filter(
      (item) => item !== 'no_use_of_old_six_axis_object_as_final_axiom_domain_knowledge',
    );

    const validation = validateAxiomRealDataStratifiedDomainReanalysis(reanalysis);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'six_axis_candidate_must_be_superseded_by_stratified_reanalysis',
        'reanalysis_must_keep_nine_provisional_review_unit_candidates_with_split_health_access_and_pre_entry_units',
        'next_core_move_must_rebuild_from_all_layer_reanalysis_and_revalidate_review_units_not_project_surfaces',
        'not_now_must_block_old_six_axis_public_runtime_learning_and_raw_text_export',
      ]),
    );
  });

  it('keeps source lenses as weighted partial views rather than final answers', () => {
    const reanalysis = buildAxiomRealDataStratifiedDomainReanalysis();

    expect(reanalysis.sourceLensProtections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceLensId: 'nanbyo_survey_4000',
          cannotUseAsJa: expect.arrayContaining(['障害者就労全体の単独代表']),
        }),
        expect.objectContaining({
          sourceLensId: 'historical_linked_triangular_source_family',
          cannotUseAsJa: expect.arrayContaining(['現行日本実務の答え']),
        }),
      ]),
    );
    expect(
      reanalysis.sourceLensProtections.every(
        (lens) => lens.routedToReviewUnitIds.length > 0,
      ),
    ).toBe(true);
  });

  it('rejects example-only long-tail patches that do not scan all low-n signals', () => {
    const reanalysis = cloneReanalysis(buildAxiomRealDataStratifiedDomainReanalysis());

    reanalysis.minoritySignalProtectionPolicy.longTailHealthConditionTokenCount = 3 as 18;
    reanalysis.minoritySignalProtectionPolicy.prohibitedShortcut =
      'allow_founder_example_patch' as 'patch_only_examples_named_in_founder_review';
    reanalysis.longTailHealthConditionSignals =
      reanalysis.longTailHealthConditionSignals.filter((signalItem) =>
        ['弱視・視野障害', '難聴', '血液透析適用'].includes(signalItem.labelJa),
      );

    const validation = validateAxiomRealDataStratifiedDomainReanalysis(reanalysis);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'minority_signal_policy_must_block_example_only_patch',
        'long_tail_health_condition_signals_must_be_scanned_and_routed_not_example_only',
      ]),
    );
  });

  it('rejects all-layer protection regressions before integrated knowledge rebuild', () => {
    const reanalysis = cloneReanalysis(buildAxiomRealDataStratifiedDomainReanalysis());

    reanalysis.protectedTokenLayerSummaries = reanalysis.protectedTokenLayerSummaries.filter(
      (layer) => layer.layerId === 'health_condition',
    );
    reanalysis.patternFamilyProtections = reanalysis.patternFamilyProtections.filter(
      (family) => family.familyId !== 'accommodation_gap',
    );
    reanalysis.patternLevelProtections = reanalysis.patternLevelProtections.filter(
      (level) => level.levelId !== 'micro',
    );
    reanalysis.sourceLensProtections = reanalysis.sourceLensProtections.slice(0, 1);

    const validation = validateAxiomRealDataStratifiedDomainReanalysis(reanalysis);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'all_joint_subject_token_layers_must_be_scanned_and_routed_before_axis_rebuild',
        'pattern_families_including_small_accommodation_gap_must_be_preserved',
        'pattern_levels_must_preserve_global_local_and_micro_resolution',
        'source_lens_protections_must_preserve_weight_and_limits_before_axis_rebuild',
      ]),
    );
  });
});
