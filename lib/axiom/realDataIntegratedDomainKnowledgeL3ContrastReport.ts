import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomKernelDerivedWorkDesignViewsContract,
  validateAxiomKernelDerivedWorkDesignViewsContract,
  type AxiomKernelDerivedViewSeed,
  type AxiomKernelDerivedWorkDesignViewsContract,
} from './kernelDerivedWorkDesignViewsContract';
import {
  buildAxiomRealDataIntegratedDomainKnowledgeObject,
  validateAxiomRealDataIntegratedDomainKnowledgeObject,
  type AxiomRealDataIntegratedDomainKnowledgeObject,
} from './realDataIntegratedDomainKnowledgeObject';

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_VERSION =
  'v0_2026_06_11' as const;

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY =
  'axiom_l3_prior_contrast_report_compares_integrated_domain_axes_against_l3_27_without_using_l3_as_content_source_or_fixed_view_count' as const;

export const AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_human_review_loop',
  'kernel_display',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomL3PriorContrastMovement =
  | 'covered_by_integrated_axis'
  | 'merge_into_integrated_axis'
  | 'split_pressure_on_integrated_axis'
  | 'rename_candidate_after_review'
  | 'gap_or_hold_until_missing_context';

export type AxiomL3PriorContrastRow = {
  seedId: string;
  seedKind: AxiomKernelDerivedViewSeed['seedKind'];
  l3LabelJa: string;
  comparedAxisIds: string[];
  movement: AxiomL3PriorContrastMovement;
  reasonJa: string;
  founderReviewQuestionJa: string;
  l3UseBoundary:
    'bootstrap_prior_contrast_only_not_axiom_content_source_or_public_copy';
};

export type AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport = {
  reportId: string;
  objectType: 'axiom_integrated_domain_knowledge_l3_prior_contrast_report';
  contractVersion: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_VERSION;
  lane: 'Falcon Lab';
  status: 'ready_for_founder_review_of_l3_contrast_against_integrated_axes';
  boundary: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_CORE_PROGRESS_CLASSES;
  sourceKnowledgeObjectId: string;
  sourceL3ContractId: string;
  integratedAxisCount: number;
  l3SeedCount: 27;
  l3PrincipalPatternCount: 21;
  l3CrossCuttingAxisCount: 6;
  finalViewCountStatus:
    'not_fixed_l3_contrast_can_trigger_merge_split_rename_drop_or_hold_only';
  l3UsePolicy: {
    allowed:
      'coverage_contrast_gap_merge_split_rename_drop_hold_and_naming_candidate';
    prohibited:
      'direct_content_generation_axiom_core_truth_fixed_view_count_semantic_approval_source_support_validity';
  };
  movementSummary: Record<AxiomL3PriorContrastMovement, number>;
  rows: AxiomL3PriorContrastRow[];
  founderReviewRoute: {
    reviewUnitScale: 'six_integrated_axes_plus_l3_contrast_summary_not_27_public_views';
    maxCoreHumanReviewUnits: 100;
    suggestedReviewUnitCount: 7;
    reviewerQuestionJa:
      '六つのAxiom統合軸に対し、L3 27 seedの照合結果をcoverage/gap/merge/split/rename/hold判断として受け入れるか。';
    reviewMustNotDecide: readonly [
      'source_support_validity',
      'candidate_pattern_promotion',
      'public_approval',
      'publication',
      'runtime_or_learning_update',
    ];
  };
  notNow: string[];
};

export type AxiomRealDataIntegratedDomainKnowledgeL3ContrastReportValidation = {
  valid: boolean;
  validationStatus:
    | 'integrated_domain_knowledge_l3_contrast_report_valid'
    | 'integrated_domain_knowledge_l3_contrast_report_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_CORE_PROGRESS_CLASSES;
};

const AXIS = {
  healthTime: 'axiom_domain_axis_health_time_life_security_work_density',
  supportContinuity: 'axiom_domain_axis_support_retranslation_continuity_network',
  worksiteContact: 'axiom_domain_axis_worksite_contact_task_information_safety',
  sourceLens: 'axiom_domain_axis_source_lens_jurisdiction_historical_brake',
  informationParticipation:
    'axiom_domain_axis_information_participation_disclosure_boundary',
  valueGrowth: 'axiom_domain_axis_value_role_growth_quality_loop',
} as const;

type ContrastPlanRow = {
  seedId: string;
  comparedAxisIds: string[];
  movement: AxiomL3PriorContrastMovement;
  reasonJa: string;
};

const CONTRAST_PLAN_ROWS: ContrastPlanRow[] = [
  {
    seedId: 'L3-PIP-01',
    comparedAxisIds: [AXIS.healthTime],
    movement: 'covered_by_integrated_axis',
    reasonJa: '体調変動は健康時間・仕事密度・生活保障の統合軸でより広い相互作用として読まれている。',
  },
  {
    seedId: 'L3-PIP-02',
    comparedAxisIds: [AXIS.healthTime],
    movement: 'merge_into_integrated_axis',
    reasonJa: '治療・通院・回復時間は単独視点ではなく、評価・収入・仕事量との同期問題へ統合される。',
  },
  {
    seedId: 'L3-PIP-03',
    comparedAxisIds: [AXIS.healthTime, AXIS.valueGrowth],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '休職・復職は健康時間だけでなく、戻った後の役割・評価・成長ループにも分けて確認する必要がある。',
  },
  {
    seedId: 'L3-PIP-04',
    comparedAxisIds: [AXIS.healthTime, AXIS.worksiteContact],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '通勤・移動・休息場所は健康時間軸と職場接触点軸の両方にまたがるため、実装単位で分割確認する。',
  },
  {
    seedId: 'L3-PIP-05',
    comparedAxisIds: [AXIS.healthTime],
    movement: 'covered_by_integrated_axis',
    reasonJa: '生活保障は待つ・休む・選び直す自由として健康時間軸に内包される。',
  },
  {
    seedId: 'L3-PIP-06',
    comparedAxisIds: [AXIS.healthTime, AXIS.valueGrowth],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '健康時間と評価・収入の衝突は、時間設計と価値/評価ループの双方で照合する必要がある。',
  },
  {
    seedId: 'L3-PIP-07',
    comparedAxisIds: [AXIS.healthTime, AXIS.informationParticipation],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '将来の体調変化を話せる条件は、健康時間の見通しと開示/情報境界の両方に分割される。',
  },
  {
    seedId: 'L3-PIP-08',
    comparedAxisIds: [AXIS.supportContinuity, AXIS.informationParticipation],
    movement: 'rename_candidate_after_review',
    reasonJa: '求人・本人条件の相互翻訳は、支援の再翻訳機能と情報形式の変換へ再命名できる可能性がある。',
  },
  {
    seedId: 'L3-PIP-09',
    comparedAxisIds: [AXIS.informationParticipation, AXIS.valueGrowth],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '入口以前の仕事像・体験接続は、未就業・就職前の障害者データを活用すべき独立信号である。情報参加軸と価値/成長軸にまたがるため、材料が薄いholdではなく、入口前経験を埋もれさせないsplit pressureとして扱う。',
  },
  {
    seedId: 'L3-PIP-10',
    comparedAxisIds: [AXIS.informationParticipation],
    movement: 'covered_by_integrated_axis',
    reasonJa: '応募・面接・開示の目的限定は、情報形式・参加・開示境界の統合軸で扱われる。',
  },
  {
    seedId: 'L3-PIP-11',
    comparedAxisIds: [AXIS.supportContinuity],
    movement: 'covered_by_integrated_axis',
    reasonJa: '支援接続と再翻訳容量は、支援をネットワーク機能として読む軸の中心にある。',
  },
  {
    seedId: 'L3-PIP-12',
    comparedAxisIds: [AXIS.supportContinuity, AXIS.valueGrowth],
    movement: 'merge_into_integrated_axis',
    reasonJa: '相談線・戻り回路は、支援継続と就業後の再調整ループへ統合される。',
  },
  {
    seedId: 'L3-PIP-13',
    comparedAxisIds: [AXIS.informationParticipation, AXIS.worksiteContact],
    movement: 'merge_into_integrated_axis',
    reasonJa: '情報形式から仕事手順への同期は、情報環境と職場接触点の実装条件として統合される。',
  },
  {
    seedId: 'L3-PIP-14',
    comparedAxisIds: [AXIS.sourceLens, AXIS.supportContinuity],
    movement: 'covered_by_integrated_axis',
    reasonJa: 'source lens差は、過剰一般化ブレーキと支援再翻訳の両方で明示されている。',
  },
  {
    seedId: 'L3-PIP-15',
    comparedAxisIds: [AXIS.worksiteContact],
    movement: 'covered_by_integrated_axis',
    reasonJa: '作業手順・道具・設備は、職場接触点・タスク・安全の実装軸に直接対応する。',
  },
  {
    seedId: 'L3-PIP-16',
    comparedAxisIds: [AXIS.worksiteContact],
    movement: 'covered_by_integrated_axis',
    reasonJa: '安全・顧客・人員余力は、職場懸念を実装条件として分解する軸に含まれる。',
  },
  {
    seedId: 'L3-PIP-17',
    comparedAxisIds: [AXIS.informationParticipation, AXIS.worksiteContact],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '感覚・情報アクセスは参加の質と職場環境の両方にまたがるため、実装時に分割確認する。',
  },
  {
    seedId: 'L3-PIP-18',
    comparedAxisIds: [AXIS.worksiteContact, AXIS.informationParticipation],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '認知・手順・切替負荷は、タスク設計と情報形式の双方に現れる。',
  },
  {
    seedId: 'L3-PIP-19',
    comparedAxisIds: [AXIS.valueGrowth],
    movement: 'covered_by_integrated_axis',
    reasonJa: '役割・評価・処遇の価値翻訳は、就業後の質ループ軸の中心にある。',
  },
  {
    seedId: 'L3-PIP-20',
    comparedAxisIds: [AXIS.valueGrowth],
    movement: 'covered_by_integrated_axis',
    reasonJa: '学習・キャリア・将来見通しは、成長と選択肢を閉じないループとして扱う。',
  },
  {
    seedId: 'L3-PIP-21',
    comparedAxisIds: [AXIS.sourceLens, AXIS.supportContinuity, AXIS.valueGrowth],
    movement: 'split_pressure_on_integrated_axis',
    reasonJa: '地域・規模・支援資源差は、制度差、支援継続、成長機会の複数軸にまたがる。',
  },
  {
    seedId: 'L3-CCA-22',
    comparedAxisIds: [AXIS.healthTime, AXIS.sourceLens],
    movement: 'covered_by_integrated_axis',
    reasonJa: '条件窓をlookup化しない境界は、健康時間軸とsource lensブレーキで保持される。',
  },
  {
    seedId: 'L3-CCA-23',
    comparedAxisIds: Object.values(AXIS),
    movement: 'covered_by_integrated_axis',
    reasonJa: '反対構造・別解釈保持は六軸すべてのcounterHypothesesとcannotYetSayに入っている。',
  },
  {
    seedId: 'L3-CCA-24',
    comparedAxisIds: [AXIS.supportContinuity, AXIS.sourceLens],
    movement: 'covered_by_integrated_axis',
    reasonJa: '支援・配慮妥当性にしない境界は、支援再翻訳軸とsource lens軸で強く保持される。',
  },
  {
    seedId: 'L3-CCA-25',
    comparedAxisIds: [AXIS.sourceLens],
    movement: 'gap_or_hold_until_missing_context',
    reasonJa: 'source/currentness/public境界はsource lens軸の中心だが、現在政策・制度claimへ進めるには別途source/support validity確認が必要なためhold圧力として残す。',
  },
  {
    seedId: 'L3-CCA-26',
    comparedAxisIds: [AXIS.informationParticipation],
    movement: 'covered_by_integrated_axis',
    reasonJa: '開示・同意・PII境界は、情報形式・参加・開示境界軸で扱う。',
  },
  {
    seedId: 'L3-CCA-27',
    comparedAxisIds: Object.values(AXIS),
    movement: 'covered_by_integrated_axis',
    reasonJa: 'review / learning loopを閉じない境界は、report全体のhumanReviewRouteとnotNowで保持される。',
  },
];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function buildRows(
  contract: AxiomKernelDerivedWorkDesignViewsContract,
): AxiomL3PriorContrastRow[] {
  const seedsById = new Map(contract.seeds.map((seed) => [seed.seedId, seed]));

  return CONTRAST_PLAN_ROWS.map((planRow) => {
    const seed = seedsById.get(planRow.seedId);

    if (!seed) {
      throw new Error(`l3_prior_seed_missing_for_contrast:${planRow.seedId}`);
    }

    return {
      seedId: seed.seedId,
      seedKind: seed.seedKind,
      l3LabelJa: seed.labelJa,
      comparedAxisIds: planRow.comparedAxisIds,
      movement: planRow.movement,
      reasonJa: planRow.reasonJa,
      founderReviewQuestionJa:
        `${seed.seedId}「${seed.labelJa}」をAxiom六軸への照合結果として${planRow.movement}扱いにしてよいか。`,
      l3UseBoundary:
        'bootstrap_prior_contrast_only_not_axiom_content_source_or_public_copy',
    } satisfies AxiomL3PriorContrastRow;
  });
}

function movementSummary(
  rows: AxiomL3PriorContrastRow[],
): Record<AxiomL3PriorContrastMovement, number> {
  return {
    covered_by_integrated_axis: rows.filter(
      (row) => row.movement === 'covered_by_integrated_axis',
    ).length,
    merge_into_integrated_axis: rows.filter(
      (row) => row.movement === 'merge_into_integrated_axis',
    ).length,
    split_pressure_on_integrated_axis: rows.filter(
      (row) => row.movement === 'split_pressure_on_integrated_axis',
    ).length,
    rename_candidate_after_review: rows.filter(
      (row) => row.movement === 'rename_candidate_after_review',
    ).length,
    gap_or_hold_until_missing_context: rows.filter(
      (row) => row.movement === 'gap_or_hold_until_missing_context',
    ).length,
  };
}

export function buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject =
    buildAxiomRealDataIntegratedDomainKnowledgeObject(),
  l3Contract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
): AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport {
  const rows = buildRows(l3Contract);

  return {
    reportId:
      'axiom_integrated_domain_knowledge_l3_prior_contrast_report_v0_2026_06_11',
    objectType: 'axiom_integrated_domain_knowledge_l3_prior_contrast_report',
    contractVersion: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_VERSION,
    lane: 'Falcon Lab',
    status: 'ready_for_founder_review_of_l3_contrast_against_integrated_axes',
    boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY,
    strengthensCore: [
      ...AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_CORE_PROGRESS_CLASSES,
    ],
    sourceKnowledgeObjectId: knowledgeObject.knowledgeObjectId,
    sourceL3ContractId: l3Contract.contractId,
    integratedAxisCount: knowledgeObject.integratedAxisCount,
    l3SeedCount: 27,
    l3PrincipalPatternCount: 21,
    l3CrossCuttingAxisCount: 6,
    finalViewCountStatus:
      'not_fixed_l3_contrast_can_trigger_merge_split_rename_drop_or_hold_only',
    l3UsePolicy: {
      allowed:
        'coverage_contrast_gap_merge_split_rename_drop_hold_and_naming_candidate',
      prohibited:
        'direct_content_generation_axiom_core_truth_fixed_view_count_semantic_approval_source_support_validity',
    },
    movementSummary: movementSummary(rows),
    rows,
    founderReviewRoute: {
      reviewUnitScale: 'six_integrated_axes_plus_l3_contrast_summary_not_27_public_views',
      maxCoreHumanReviewUnits: 100,
      suggestedReviewUnitCount: 7,
      reviewerQuestionJa:
        '六つのAxiom統合軸に対し、L3 27 seedの照合結果をcoverage/gap/merge/split/rename/hold判断として受け入れるか。',
      reviewMustNotDecide: [
        'source_support_validity',
        'candidate_pattern_promotion',
        'public_approval',
        'publication',
        'runtime_or_learning_update',
      ],
    },
    notNow: Array.from(
      new Set([
        'no_l3_27_direct_public_copy',
        'no_fixed_21_or_27_final_view_count',
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_movement',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
        ...knowledgeObject.notNow,
      ]),
    ),
  };
}

export function validateAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
  report: AxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
  knowledgeObject: AxiomRealDataIntegratedDomainKnowledgeObject =
    buildAxiomRealDataIntegratedDomainKnowledgeObject(),
  l3Contract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
): AxiomRealDataIntegratedDomainKnowledgeL3ContrastReportValidation {
  const errors: string[] = [];
  const knowledgeValidation = validateAxiomRealDataIntegratedDomainKnowledgeObject(
    knowledgeObject,
  );
  const l3Validation = validateAxiomKernelDerivedWorkDesignViewsContract(l3Contract);
  const expectedSeedIds = new Set(l3Contract.seeds.map((seed) => seed.seedId));
  const rowSeedIds = new Set(report.rows.map((row) => row.seedId));
  const axisIds = new Set(knowledgeObject.axes.map((axis) => axis.axisId));
  const rowAxisIds = new Set(report.rows.flatMap((row) => row.comparedAxisIds));
  const summaryTotal = Object.values(report.movementSummary).reduce(
    (total, count) => total + count,
    0,
  );

  pushIf(!knowledgeValidation.valid, errors, 'source_integrated_knowledge_object_must_validate');
  pushIf(!l3Validation.valid, errors, 'source_l3_contract_must_validate');
  pushIf(
    report.objectType !== 'axiom_integrated_domain_knowledge_l3_prior_contrast_report',
    errors,
    'object_type_must_be_l3_prior_contrast_report',
  );
  pushIf(report.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    report.status !== 'ready_for_founder_review_of_l3_contrast_against_integrated_axes',
    errors,
    'report_must_be_ready_for_founder_review_not_public_projection',
  );
  pushIf(
    report.boundary !== AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY,
    errors,
    'boundary_must_keep_l3_as_contrast_not_content_source',
  );
  pushIf(
    report.integratedAxisCount !== knowledgeObject.integratedAxisCount ||
      report.integratedAxisCount !== 6,
    errors,
    'report_must_compare_against_six_integrated_axes',
  );
  pushIf(
    report.l3SeedCount !== 27 ||
      report.l3PrincipalPatternCount !== 21 ||
      report.l3CrossCuttingAxisCount !== 6 ||
      report.rows.length !== 27 ||
      rowSeedIds.size !== 27,
    errors,
    'report_must_cover_all_27_l3_seed_rows_once',
  );
  for (const seedId of expectedSeedIds) {
    pushIf(!rowSeedIds.has(seedId), errors, `l3_contrast_missing_seed:${seedId}`);
  }
  for (const axisId of axisIds) {
    pushIf(!rowAxisIds.has(axisId), errors, `l3_contrast_missing_axis:${axisId}`);
  }
  for (const row of report.rows) {
    pushIf(row.comparedAxisIds.length === 0, errors, `l3_row_missing_axis:${row.seedId}`);
    pushIf(
      row.l3UseBoundary !==
        'bootstrap_prior_contrast_only_not_axiom_content_source_or_public_copy',
      errors,
      `l3_row_must_keep_bootstrap_prior_boundary:${row.seedId}`,
    );
  }
  pushIf(
    summaryTotal !== 27 ||
      report.movementSummary.gap_or_hold_until_missing_context < 1 ||
      report.movementSummary.split_pressure_on_integrated_axis < 1 ||
      report.movementSummary.merge_into_integrated_axis < 1,
    errors,
    'movement_summary_must_cover_27_rows_and_keep_gap_split_merge_pressure_visible',
  );
  pushIf(
    report.finalViewCountStatus !==
      'not_fixed_l3_contrast_can_trigger_merge_split_rename_drop_or_hold_only' ||
      report.l3UsePolicy.prohibited !==
        'direct_content_generation_axiom_core_truth_fixed_view_count_semantic_approval_source_support_validity',
    errors,
    'l3_policy_must_prohibit_content_source_fixed_count_and_semantic_approval',
  );
  pushIf(
    report.founderReviewRoute.reviewUnitScale !==
      'six_integrated_axes_plus_l3_contrast_summary_not_27_public_views' ||
      report.founderReviewRoute.suggestedReviewUnitCount !== 7 ||
      report.founderReviewRoute.maxCoreHumanReviewUnits !== 100 ||
      !report.founderReviewRoute.reviewMustNotDecide.includes('publication'),
    errors,
    'founder_review_route_must_compress_to_axes_plus_summary_and_block_publication',
  );
  pushIf(
    !report.notNow.includes('no_l3_27_direct_public_copy') ||
      !report.notNow.includes('no_fixed_21_or_27_final_view_count') ||
      !report.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !report.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_l3_fixed_count_runtime_public_and_learning_movement',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'integrated_domain_knowledge_l3_contrast_report_valid'
        : 'integrated_domain_knowledge_l3_contrast_report_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_BOUNDARY,
    strengthensCore: [
      ...AXIOM_REAL_DATA_INTEGRATED_DOMAIN_KNOWLEDGE_L3_CONTRAST_CORE_PROGRESS_CLASSES,
    ],
  };
}
