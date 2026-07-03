import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
  validateAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
  type AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
} from './realDataIntegratedDomainKnowledgeL3ContrastReport';
import {
  buildAxiomRealDataIntegratedDomainKnowledgeObject,
  validateAxiomRealDataIntegratedDomainKnowledgeObject,
  type AxiomIntegratedDomainKnowledgeAxis,
  type AxiomRealDataIntegratedDomainKnowledgeObject,
} from './realDataIntegratedDomainKnowledgeObject';
import {
  buildAxiomRealDataSemanticFacetCoverage,
  validateAxiomRealDataSemanticFacetCoverage,
  type AxiomRealDataSemanticFacetCoverage,
} from './realDataSemanticFacetCoverage';

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_VERSION =
  'v0_2026_06_11' as const;

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY =
  'axiom_integrated_domain_knowledge_founder_review_receipt_shell_prepares_high_coverage_axis_facet_review_without_deciding_review_projection_publication_runtime_or_learning' as const;

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomIntegratedDomainKnowledgeFounderReviewDecisionOption =
  | 'accept_as_integrated_domain_knowledge_for_surface_projection'
  | 'revise_axis_or_facet_bundle'
  | 'split_or_merge_axis_facet_bundle'
  | 'hold_until_missing_context_or_source_lens_review';

export type AxiomIntegratedDomainKnowledgeFounderReviewUnitKind =
  | 'axis_semantic_facet_bundle'
  | 'coverage_policy_review'
  | 'residual_watchlist_review'
  | 'l3_contrast_summary_review';

export type AxiomIntegratedDomainKnowledgeFounderReviewUnit = {
  reviewUnitId: string;
  unitKind: AxiomIntegratedDomainKnowledgeFounderReviewUnitKind;
  titleJa: string;
  sourceAxisIds: string[];
  sourceFacetIds: string[];
  sourceResidualIds: string[];
  l3SeedCount: number;
  estimatedCoveragePercentAfterAcceptance: 72 | 97 | 99;
  reviewerMustJudgeJa: string[];
  reviewerMustNotJudge: readonly [
    'source_support_validity',
    'candidate_pattern_promotion',
    'public_approval',
    'publication',
    'runtime_or_learning_update',
  ];
  allowedDecisionOptions: AxiomIntegratedDomainKnowledgeFounderReviewDecisionOption[];
  defaultIfNotReviewed:
    'hold_projection_and_keep_internal_kernel_display_only';
};

export type AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell = {
  shellId: string;
  objectType: 'axiom_integrated_domain_knowledge_founder_review_receipt_shell';
  contractVersion: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_VERSION;
  lane: 'Falcon Lab';
  status:
    'founder_review_receipt_shell_prepared_not_received_not_decided_projection_blocked';
  boundary: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_CORE_PROGRESS_CLASSES;
  sourceKnowledgeObjectId: string;
  sourceSemanticFacetCoverageId: string;
  sourceL3ContrastReportId: string;
  reviewSourceRequired:
    'external_founder_review_result_required_before_surface_projection';
  coveragePolicySnapshot: {
    sixAxisRole:
      'top_level_review_compression_only_not_final_domain_resolution';
    minimumAcceptableCoveragePercent: 95;
    targetOverallSemanticCoveragePercent: 97;
    aspirationalReviewCoveragePercent: 99;
    eightyFiveToNinetyPercentRole:
      'minimum_floor_only_not_axiom_target';
  };
  reviewUnitCount: number;
  maxCoreHumanReviewUnits: 100;
  reviewUnits: AxiomIntegratedDomainKnowledgeFounderReviewUnit[];
  requiredReceiptFields: readonly [
    'reviewer_role_or_name',
    'review_date',
    'per_unit_decision',
    'accepted_revised_split_merged_or_held_units',
    'missing_context_or_source_lens_notes',
    'explicit_surface_projection_permission_or_hold',
  ];
  surfaceProjectionGate: {
    status:
      'blocked_until_external_founder_receipt_accepts_or_holds_all_high_coverage_review_units';
    canProjectToNineCandidateSurfacesNow: false;
    allowedAfterReceipt:
      'project_accepted_or_explicitly_held_axis_facet_bundles_to_falcon_to_axiom_nine_surface_delivery_scaffold_as_internal_public_candidate_slots';
    prohibitedBeforeReceipt: readonly [
      'six_axis_only_public_projection',
      'eighty_five_to_ninety_percent_as_final_coverage_target',
      'l3_27_direct_content_generation',
      'actual_public_navigation',
      'publication',
      'runtime_prompt_retrieval_model_provider_db_schema_change',
      'learning_update',
    ];
  };
  notNow: string[];
};

export type AxiomIntegratedDomainKnowledgeFounderReviewReceiptShellValidation = {
  valid: boolean;
  validationStatus:
    | 'integrated_domain_knowledge_founder_review_receipt_shell_valid'
    | 'integrated_domain_knowledge_founder_review_receipt_shell_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_CORE_PROGRESS_CLASSES;
};

const REVIEW_MUST_NOT_JUDGE = [
  'source_support_validity',
  'candidate_pattern_promotion',
  'public_approval',
  'publication',
  'runtime_or_learning_update',
] as const;

const DECISION_OPTIONS: AxiomIntegratedDomainKnowledgeFounderReviewDecisionOption[] = [
  'accept_as_integrated_domain_knowledge_for_surface_projection',
  'revise_axis_or_facet_bundle',
  'split_or_merge_axis_facet_bundle',
  'hold_until_missing_context_or_source_lens_review',
];

const REQUIRED_RECEIPT_FIELDS = [
  'reviewer_role_or_name',
  'review_date',
  'per_unit_decision',
  'accepted_revised_split_merged_or_held_units',
  'missing_context_or_source_lens_notes',
  'explicit_surface_projection_permission_or_hold',
] as const;

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildAxisUnit(
  axis: AxiomIntegratedDomainKnowledgeAxis,
  index: number,
  semanticFacetCoverage: AxiomRealDataSemanticFacetCoverage,
): AxiomIntegratedDomainKnowledgeFounderReviewUnit {
  const axisFacets = semanticFacetCoverage.facets.filter(
    (facet) => facet.parentAxisId === axis.axisId,
  );

  return {
    reviewUnitId: `founder_review_axis_facet_bundle_${index + 1}_${axis.axisId}`,
    unitKind: 'axis_semantic_facet_bundle',
    titleJa: `${axis.candidateLabelJa} / ${axisFacets.length} facets`,
    sourceAxisIds: [axis.axisId],
    sourceFacetIds: axisFacets.map((facet) => facet.facetId),
    sourceResidualIds: [],
    l3SeedCount: new Set(axisFacets.flatMap((facet) => facet.l3SeedRefs)).size,
    estimatedCoveragePercentAfterAcceptance: 97,
    reviewerMustJudgeJa: [
      'この軸のobservationからinferenceへの橋渡しが、実データの影として妥当か。',
      'この軸に属するfacet群が、少数・高リスク・source lens差を落とさずに保持しているか。',
      'この単位を受け入れるか、修正するか、分割/統合するか、missing context/source lens確認までholdするか。',
    ],
    reviewerMustNotJudge: REVIEW_MUST_NOT_JUDGE,
    allowedDecisionOptions: DECISION_OPTIONS,
    defaultIfNotReviewed:
      'hold_projection_and_keep_internal_kernel_display_only',
  };
}

function buildReviewUnits(
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject,
  semanticFacetCoverage: AxiomRealDataSemanticFacetCoverage,
  l3ContrastReport: AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
): AxiomIntegratedDomainKnowledgeFounderReviewUnit[] {
  const axisUnits = knowledgeObject.axes.map((axis, index) =>
    buildAxisUnit(axis, index, semanticFacetCoverage),
  );

  return [
    ...axisUnits,
    {
      reviewUnitId: 'founder_review_coverage_policy_95_97_99',
      unitKind: 'coverage_policy_review',
      titleJa: 'semantic coverage基準: 95% minimum / 97% target / 99% aspirational',
      sourceAxisIds: knowledgeObject.axes.map((axis) => axis.axisId),
      sourceFacetIds: semanticFacetCoverage.facets.map((facet) => facet.facetId),
      sourceResidualIds: [],
      l3SeedCount: l3ContrastReport.l3SeedCount,
      estimatedCoveragePercentAfterAcceptance: 97,
      reviewerMustJudgeJa: [
        '85〜90%を最終目標にせず、最低床として扱う方針でよいか。',
        '42 facetを通じて多様性coverageを優先する方針でよいか。',
        '6軸だけで公開surfaceへ投影しないブレーキを維持するか。',
      ],
      reviewerMustNotJudge: REVIEW_MUST_NOT_JUDGE,
      allowedDecisionOptions: DECISION_OPTIONS,
      defaultIfNotReviewed:
        'hold_projection_and_keep_internal_kernel_display_only',
    },
    {
      reviewUnitId: 'founder_review_residual_watchlist_99_aspirational',
      unitKind: 'residual_watchlist_review',
      titleJa: 'residual watchlist: 低頻度・高リスク・制度差・成長品質',
      sourceAxisIds: knowledgeObject.axes.map((axis) => axis.axisId),
      sourceFacetIds: Array.from(
        new Set(semanticFacetCoverage.residuals.flatMap((residual) => residual.relatedFacetIds)),
      ),
      sourceResidualIds: semanticFacetCoverage.residuals.map((residual) => residual.residualId),
      l3SeedCount: 0,
      estimatedCoveragePercentAfterAcceptance: 99,
      reviewerMustJudgeJa: [
        '主成分として小さくても落とせない残差が見えているか。',
        '開示/差別、制度差/歴史差、応募前参加/就業後成長の残差をholdまたは追加修正すべきか。',
        '99% aspirational coverageへ進めるために、追加すべきwatchlistがあるか。',
      ],
      reviewerMustNotJudge: REVIEW_MUST_NOT_JUDGE,
      allowedDecisionOptions: DECISION_OPTIONS,
      defaultIfNotReviewed:
        'hold_projection_and_keep_internal_kernel_display_only',
    },
    {
      reviewUnitId: 'founder_review_l3_27_contrast_summary',
      unitKind: 'l3_contrast_summary_review',
      titleJa: 'L3 27 bootstrap prior contrast summary',
      sourceAxisIds: knowledgeObject.axes.map((axis) => axis.axisId),
      sourceFacetIds: [],
      sourceResidualIds: [],
      l3SeedCount: l3ContrastReport.rows.length,
      estimatedCoveragePercentAfterAcceptance: 97,
      reviewerMustJudgeJa: [
        'L3 27をcontent sourceではなく、coverage/gap/merge/split/rename/holdの照合表として使う方針でよいか。',
        'L3照合から追加でsplit/merge/rename/holdすべき統合軸やfacetがあるか。',
        '最終の仕事設計視点数を21/27に固定しない扱いでよいか。',
      ],
      reviewerMustNotJudge: REVIEW_MUST_NOT_JUDGE,
      allowedDecisionOptions: DECISION_OPTIONS,
      defaultIfNotReviewed:
        'hold_projection_and_keep_internal_kernel_display_only',
    },
  ];
}

export function buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell(
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject =
    buildAxiomRealDataIntegratedDomainKnowledgeObject(),
  semanticFacetCoverage: AxiomRealDataSemanticFacetCoverage =
    buildAxiomRealDataSemanticFacetCoverage(knowledgeObject),
  l3ContrastReport: AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport =
    buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(knowledgeObject),
): AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell {
  const reviewUnits = buildReviewUnits(
    knowledgeObject,
    semanticFacetCoverage,
    l3ContrastReport,
  );

  return {
    shellId:
      'axiom_integrated_domain_knowledge_founder_review_receipt_shell_v0_2026_06_11',
    objectType: 'axiom_integrated_domain_knowledge_founder_review_receipt_shell',
    contractVersion:
      AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_VERSION,
    lane: 'Falcon Lab',
    status:
      'founder_review_receipt_shell_prepared_not_received_not_decided_projection_blocked',
    boundary:
      AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY,
    strengthensCore: [
      ...AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_CORE_PROGRESS_CLASSES,
    ],
    sourceKnowledgeObjectId: knowledgeObject.knowledgeObjectId,
    sourceSemanticFacetCoverageId: semanticFacetCoverage.coverageId,
    sourceL3ContrastReportId: l3ContrastReport.reportId,
    reviewSourceRequired:
      'external_founder_review_result_required_before_surface_projection',
    coveragePolicySnapshot: {
      sixAxisRole: semanticFacetCoverage.coveragePolicy.sixAxisRole,
      minimumAcceptableCoveragePercent:
        semanticFacetCoverage.coveragePolicy.minimumAcceptableCoveragePercent,
      targetOverallSemanticCoveragePercent:
        semanticFacetCoverage.coveragePolicy.targetOverallSemanticCoveragePercent,
      aspirationalReviewCoveragePercent:
        semanticFacetCoverage.coveragePolicy.aspirationalReviewCoveragePercent,
      eightyFiveToNinetyPercentRole:
        semanticFacetCoverage.coveragePolicy.eightyFiveToNinetyPercentRole,
    },
    reviewUnitCount: reviewUnits.length,
    maxCoreHumanReviewUnits: 100,
    reviewUnits,
    requiredReceiptFields: REQUIRED_RECEIPT_FIELDS,
    surfaceProjectionGate: {
      status:
        'blocked_until_external_founder_receipt_accepts_or_holds_all_high_coverage_review_units',
      canProjectToNineCandidateSurfacesNow: false,
      allowedAfterReceipt:
        'project_accepted_or_explicitly_held_axis_facet_bundles_to_falcon_to_axiom_nine_surface_delivery_scaffold_as_internal_public_candidate_slots',
      prohibitedBeforeReceipt: [
        'six_axis_only_public_projection',
        'eighty_five_to_ninety_percent_as_final_coverage_target',
        'l3_27_direct_content_generation',
        'actual_public_navigation',
        'publication',
        'runtime_prompt_retrieval_model_provider_db_schema_change',
        'learning_update',
      ],
    },
    notNow: Array.from(
      new Set([
        'no_founder_review_result_created_by_codex',
        'no_surface_projection_before_external_founder_receipt',
        'no_six_axis_only_public_projection',
        'no_85_90_percent_as_final_coverage_target',
        'no_l3_27_direct_public_copy',
        'no_fixed_21_or_27_final_view_count',
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_promotion',
        'no_public_approval_or_publication',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_learning_update',
        ...semanticFacetCoverage.notNow,
        ...l3ContrastReport.notNow,
      ]),
    ),
  };
}

export function validateAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell(
  shell: AxiomIntegratedDomainKnowledgeFounderReviewReceiptShell,
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject =
    buildAxiomRealDataIntegratedDomainKnowledgeObject(),
  semanticFacetCoverage: AxiomRealDataSemanticFacetCoverage =
    buildAxiomRealDataSemanticFacetCoverage(knowledgeObject),
  l3ContrastReport: AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport =
    buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(knowledgeObject),
): AxiomIntegratedDomainKnowledgeFounderReviewReceiptShellValidation {
  const errors: string[] = [];
  const knowledgeValidation = validateAxiomRealDataIntegratedDomainKnowledgeObject(
    knowledgeObject,
  );
  const facetValidation = validateAxiomRealDataSemanticFacetCoverage(
    semanticFacetCoverage,
    knowledgeObject,
  );
  const contrastValidation = validateAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
    l3ContrastReport,
    knowledgeObject,
  );
  const axisIds = new Set(knowledgeObject.axes.map((axis) => axis.axisId));
  const shellAxisIds = new Set(shell.reviewUnits.flatMap((unit) => unit.sourceAxisIds));
  const shellFacetIds = new Set(shell.reviewUnits.flatMap((unit) => unit.sourceFacetIds));
  const coverageFacetIds = new Set(semanticFacetCoverage.facets.map((facet) => facet.facetId));
  const shellResidualIds = new Set(
    shell.reviewUnits.flatMap((unit) => unit.sourceResidualIds),
  );

  pushIf(!knowledgeValidation.valid, errors, 'source_knowledge_object_must_validate');
  pushIf(!facetValidation.valid, errors, 'source_semantic_facet_coverage_must_validate');
  pushIf(!contrastValidation.valid, errors, 'source_l3_contrast_report_must_validate');
  pushIf(
    shell.objectType !== 'axiom_integrated_domain_knowledge_founder_review_receipt_shell',
    errors,
    'object_type_must_be_integrated_domain_knowledge_founder_review_receipt_shell',
  );
  pushIf(shell.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    shell.status !==
      'founder_review_receipt_shell_prepared_not_received_not_decided_projection_blocked',
    errors,
    'status_must_remain_prepared_not_received_not_decided_projection_blocked',
  );
  pushIf(
    shell.boundary !==
      AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY,
    errors,
    'boundary_must_prevent_codex_created_review_projection_publication_runtime_or_learning',
  );
  pushIf(
    shell.sourceKnowledgeObjectId !== knowledgeObject.knowledgeObjectId ||
      shell.sourceSemanticFacetCoverageId !== semanticFacetCoverage.coverageId ||
      shell.sourceL3ContrastReportId !== l3ContrastReport.reportId,
    errors,
    'source_ids_must_match_knowledge_facet_coverage_and_l3_contrast',
  );
  pushIf(
    shell.coveragePolicySnapshot.minimumAcceptableCoveragePercent !== 95 ||
      shell.coveragePolicySnapshot.targetOverallSemanticCoveragePercent !== 97 ||
      shell.coveragePolicySnapshot.aspirationalReviewCoveragePercent !== 99 ||
      shell.coveragePolicySnapshot.eightyFiveToNinetyPercentRole !==
        'minimum_floor_only_not_axiom_target',
    errors,
    'coverage_snapshot_must_keep_95_floor_97_target_99_aspirational_not_85_90_target',
  );
  pushIf(
    shell.reviewUnitCount !== shell.reviewUnits.length ||
      shell.reviewUnitCount !== knowledgeObject.integratedAxisCount + 3,
    errors,
    'review_unit_count_must_be_six_axis_units_plus_coverage_residual_and_l3_summary',
  );
  pushIf(
    shell.reviewUnitCount > 100 || shell.maxCoreHumanReviewUnits !== 100,
    errors,
    'review_units_must_remain_under_100',
  );
  for (const axisId of axisIds) {
    pushIf(!shellAxisIds.has(axisId), errors, `review_units_must_cover_axis:${axisId}`);
  }
  for (const facetId of coverageFacetIds) {
    pushIf(!shellFacetIds.has(facetId), errors, `review_units_must_cover_facet:${facetId}`);
  }
  for (const residual of semanticFacetCoverage.residuals) {
    pushIf(
      !shellResidualIds.has(residual.residualId),
      errors,
      `review_units_must_cover_residual:${residual.residualId}`,
    );
  }
  pushIf(
    !shell.reviewUnits.some((unit) => unit.unitKind === 'coverage_policy_review') ||
      !shell.reviewUnits.some((unit) => unit.unitKind === 'residual_watchlist_review') ||
      !shell.reviewUnits.some((unit) => unit.unitKind === 'l3_contrast_summary_review'),
    errors,
    'review_units_must_include_coverage_policy_residual_watchlist_and_l3_contrast_summary',
  );
  pushIf(
    !shell.reviewUnits.every(
      (unit) =>
        unit.defaultIfNotReviewed ===
          'hold_projection_and_keep_internal_kernel_display_only' &&
        unit.allowedDecisionOptions.includes(
          'hold_until_missing_context_or_source_lens_review',
        ) &&
        unit.reviewerMustNotJudge.includes('source_support_validity') &&
        unit.reviewerMustNotJudge.includes('publication'),
    ),
    errors,
    'review_units_must_default_to_hold_and_forbid_validity_publication_runtime_learning',
  );
  pushIf(
    shell.surfaceProjectionGate.status !==
      'blocked_until_external_founder_receipt_accepts_or_holds_all_high_coverage_review_units' ||
      shell.surfaceProjectionGate.canProjectToNineCandidateSurfacesNow !== false,
    errors,
    'surface_projection_gate_must_remain_blocked_until_external_founder_receipt',
  );
  pushIf(
    !shell.surfaceProjectionGate.prohibitedBeforeReceipt.includes(
      'six_axis_only_public_projection',
    ) ||
      !shell.surfaceProjectionGate.prohibitedBeforeReceipt.includes(
        'eighty_five_to_ninety_percent_as_final_coverage_target',
      ) ||
      !shell.surfaceProjectionGate.prohibitedBeforeReceipt.includes(
        'runtime_prompt_retrieval_model_provider_db_schema_change',
      ) ||
      !shell.surfaceProjectionGate.prohibitedBeforeReceipt.includes('learning_update'),
    errors,
    'projection_gate_must_block_six_axis_85_90_runtime_and_learning_before_receipt',
  );
  pushIf(
    !shell.notNow.includes('no_founder_review_result_created_by_codex') ||
      !shell.notNow.includes('no_surface_projection_before_external_founder_receipt') ||
      !shell.notNow.includes('no_85_90_percent_as_final_coverage_target') ||
      !shell.notNow.includes('no_public_approval_or_publication') ||
      !shell.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_codex_review_projection_85_90_publication_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'integrated_domain_knowledge_founder_review_receipt_shell_valid'
        : 'integrated_domain_knowledge_founder_review_receipt_shell_invalid',
    errorCount: errors.length,
    errors,
    boundary:
      AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_BOUNDARY,
    strengthensCore: [
      ...AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_FOUNDER_REVIEW_RECEIPT_SHELL_CORE_PROGRESS_CLASSES,
    ],
  };
}
