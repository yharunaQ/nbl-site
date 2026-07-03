import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import { type AxiomNextNblSiteSurface } from './siteSurfaceSlotContract';

export const AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CONTRACT_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY =
  'axiom_kernel_derived_work_design_views_count_is_not_fixed_l3_21_27_is_bootstrap_prior_not_axiom_core_truth' as const;

export const AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CORE_PROGRESS_CLASSES = [
  'kernel_build',
  'kernel_eval',
  'kernel_grounding',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelDerivedViewSeedStatus =
  'falcon_bootstrap_prior_requires_axiom_eval_not_final_view';

export type AxiomKernelDerivedViewSeed = {
  seedId: string;
  seedKind: 'l3_principal_interaction_pattern' | 'l3_cross_cutting_axis';
  labelJa: string;
  status: AxiomKernelDerivedViewSeedStatus;
  allowedKernelMovement: readonly [
    'keep',
    'merge',
    'split',
    'rename',
    'drop',
    'hold_for_missing_context',
  ];
};

export type AxiomKernelDerivedWorkDesignViewsContract = {
  contractId: string;
  objectType: 'axiom_kernel_derived_work_design_views_contract';
  contractVersion: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CONTRACT_VERSION;
  lane: 'Falcon Lab';
  status: 'kernel_derived_views_count_not_fixed_ready_for_axiom_eval';
  surface: AxiomNextNblSiteSurface;
  canonicalSurfaceRole: 'kernel_derived_work_design_views_guide';
  legacySurfaceNameStatus:
    'twenty_one_views_is_inherited_surface_label_only_not_final_axiom_view_count';
  pageTitleJa: 'Kernel-derived Work-design Views Guide';
  displayNameJa: '仕事条件から導かれる視点ガイド';
  countPolicy:
    'view_count_is_derived_by_axiom_kernel_eval_not_hardcoded_from_falcon_or_l3';
  boundary: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CORE_PROGRESS_CLASSES;
  bootstrapPriorSource:
    'stage1-production-l3-principal-pattern-extraction-v0-2026-05-26';
  bootstrapPriorSeedCount: 27;
  bootstrapPrincipalPatternCount: 21;
  bootstrapCrossCuttingAxisCount: 6;
  derivedViewCountStatus: 'not_fixed_until_axiom_eval_and_review_driven_compression';
  humanReviewCompressionTarget: 'core_human_review_units_lte_100';
  seeds: AxiomKernelDerivedViewSeed[];
  mustNotTreatAs: readonly [
    'fixed_21_view_public_truth',
    'falcon_copy_reuse',
    'source_support_validity_finality',
    'candidate_pattern_promotion',
    'publication_approval',
  ];
  nextKernelStep:
    'run_axiom_eval_to_merge_split_rename_drop_or_hold_bootstrap_prior_seeds_before_public_copy';
};

export type AxiomKernelDerivedWorkDesignViewsValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_derived_work_design_views_contract_valid'
    | 'kernel_derived_work_design_views_contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CORE_PROGRESS_CLASSES;
};

const ALLOWED_KERNEL_MOVEMENT: AxiomKernelDerivedViewSeed['allowedKernelMovement'] = [
  'keep',
  'merge',
  'split',
  'rename',
  'drop',
  'hold_for_missing_context',
];

const PRINCIPAL_PATTERN_LABELS = [
  ['L3-PIP-01', '体調変動と負荷平準化'],
  ['L3-PIP-02', '治療・通院・回復時間の同期'],
  ['L3-PIP-03', '休職・復職・戻り回路'],
  ['L3-PIP-04', '通勤・移動・休息場所の接続'],
  ['L3-PIP-05', '生活保障と待つ・休む・選び直す自由'],
  ['L3-PIP-06', '健康時間と評価・収入の衝突'],
  ['L3-PIP-07', '体調変化の将来会話化'],
  ['L3-PIP-08', '求人・職務条件と本人条件の相互翻訳'],
  ['L3-PIP-09', '入口以前参加・仕事像・体験接続'],
  ['L3-PIP-10', '応募・面接・開示の目的限定設計'],
  ['L3-PIP-11', '支援接続と再翻訳容量'],
  ['L3-PIP-12', '相談線・戻り回路・継続接続'],
  ['L3-PIP-13', '情報形式から仕事手順への同期'],
  ['L3-PIP-14', 'source lens差の翻訳停止点'],
  ['L3-PIP-15', '作業手順・道具・設備の接触点'],
  ['L3-PIP-16', '安全・顧客・人員余力の実装条件'],
  ['L3-PIP-17', '感覚・情報アクセスと会議・文書・音声'],
  ['L3-PIP-18', '認知・手順・タスク切替・記憶負荷'],
  ['L3-PIP-19', '役割・評価・処遇の価値翻訳'],
  ['L3-PIP-20', '学習・キャリア・将来見通し'],
  ['L3-PIP-21', '職場規模・地域・支援資源による実装差'],
] as const;

const CROSS_CUTTING_AXIS_LABELS = [
  ['L3-CCA-22', '条件窓はlookupではない'],
  ['L3-CCA-23', '反対構造・別解釈を保持する'],
  ['L3-CCA-24', '支援・配慮妥当性にしない'],
  ['L3-CCA-25', 'source/currentness/public境界'],
  ['L3-CCA-26', '開示・同意・PII境界'],
  ['L3-CCA-27', 'review / learning loopを閉じない'],
] as const;

function seed(
  [seedId, labelJa]: readonly [string, string],
  seedKind: AxiomKernelDerivedViewSeed['seedKind'],
): AxiomKernelDerivedViewSeed {
  return {
    seedId,
    seedKind,
    labelJa,
    status: 'falcon_bootstrap_prior_requires_axiom_eval_not_final_view',
    allowedKernelMovement: ALLOWED_KERNEL_MOVEMENT,
  };
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

export function buildAxiomKernelDerivedWorkDesignViewsContract(): AxiomKernelDerivedWorkDesignViewsContract {
  const seeds = [
    ...PRINCIPAL_PATTERN_LABELS.map((item) =>
      seed(item, 'l3_principal_interaction_pattern'),
    ),
    ...CROSS_CUTTING_AXIS_LABELS.map((item) => seed(item, 'l3_cross_cutting_axis')),
  ];

  return {
    contractId: 'axiom_kernel_derived_work_design_views_contract_from_l3_bootstrap_prior_v0_2026_06_08',
    objectType: 'axiom_kernel_derived_work_design_views_contract',
    contractVersion: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CONTRACT_VERSION,
    lane: 'Falcon Lab',
    status: 'kernel_derived_views_count_not_fixed_ready_for_axiom_eval',
    surface: 'twenty_one_views_work_design_guide',
    canonicalSurfaceRole: 'kernel_derived_work_design_views_guide',
    legacySurfaceNameStatus:
      'twenty_one_views_is_inherited_surface_label_only_not_final_axiom_view_count',
    pageTitleJa: 'Kernel-derived Work-design Views Guide',
    displayNameJa: '仕事条件から導かれる視点ガイド',
    countPolicy:
      'view_count_is_derived_by_axiom_kernel_eval_not_hardcoded_from_falcon_or_l3',
    boundary: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CORE_PROGRESS_CLASSES],
    bootstrapPriorSource:
      'stage1-production-l3-principal-pattern-extraction-v0-2026-05-26',
    bootstrapPriorSeedCount: 27,
    bootstrapPrincipalPatternCount: 21,
    bootstrapCrossCuttingAxisCount: 6,
    derivedViewCountStatus: 'not_fixed_until_axiom_eval_and_review_driven_compression',
    humanReviewCompressionTarget: 'core_human_review_units_lte_100',
    seeds,
    mustNotTreatAs: [
      'fixed_21_view_public_truth',
      'falcon_copy_reuse',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
      'publication_approval',
    ],
    nextKernelStep:
      'run_axiom_eval_to_merge_split_rename_drop_or_hold_bootstrap_prior_seeds_before_public_copy',
  };
}

export function validateAxiomKernelDerivedWorkDesignViewsContract(
  contract: AxiomKernelDerivedWorkDesignViewsContract,
): AxiomKernelDerivedWorkDesignViewsValidation {
  const errors: string[] = [];
  const seedIds = new Set(contract.seeds.map((item) => item.seedId));
  const principalSeeds = contract.seeds.filter(
    (item) => item.seedKind === 'l3_principal_interaction_pattern',
  );
  const axisSeeds = contract.seeds.filter((item) => item.seedKind === 'l3_cross_cutting_axis');

  pushIf(
    contract.objectType !== 'axiom_kernel_derived_work_design_views_contract',
    errors,
    'object_type_must_be_kernel_derived_work_design_views_contract',
  );
  pushIf(contract.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    contract.boundary !== AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
    errors,
    'boundary_must_state_view_count_not_fixed',
  );
  pushIf(
    contract.countPolicy !==
      'view_count_is_derived_by_axiom_kernel_eval_not_hardcoded_from_falcon_or_l3',
    errors,
    'count_policy_must_not_hardcode_21_views',
  );
  pushIf(
    contract.legacySurfaceNameStatus !==
      'twenty_one_views_is_inherited_surface_label_only_not_final_axiom_view_count',
    errors,
    'legacy_21_surface_name_must_be_label_only',
  );
  pushIf(
    contract.derivedViewCountStatus !==
      'not_fixed_until_axiom_eval_and_review_driven_compression',
    errors,
    'derived_view_count_must_remain_not_fixed',
  );
  pushIf(contract.bootstrapPriorSeedCount !== 27, errors, 'bootstrap_prior_seed_count_must_be_27');
  pushIf(
    principalSeeds.length !== contract.bootstrapPrincipalPatternCount,
    errors,
    'principal_pattern_seed_count_must_match_bootstrap_prior_not_final_count',
  );
  pushIf(
    axisSeeds.length !== contract.bootstrapCrossCuttingAxisCount,
    errors,
    'cross_cutting_axis_seed_count_must_match_bootstrap_prior_not_final_count',
  );
  pushIf(seedIds.size !== contract.seeds.length, errors, 'seed_ids_must_be_unique');
  pushIf(
    !contract.mustNotTreatAs.includes('fixed_21_view_public_truth'),
    errors,
    'must_not_treat_bootstrap_prior_as_fixed_21_view_public_truth',
  );
  pushIf(
    !contract.strengthensCore.includes('kernel_eval') ||
      !contract.strengthensCore.includes('kernel_build') ||
      !contract.strengthensCore.includes('kernel_human_review_loop'),
    errors,
    'contract_must_strengthen_kernel_build_eval_and_review_loop',
  );

  for (const candidateSeed of contract.seeds) {
    pushIf(
      candidateSeed.status !== 'falcon_bootstrap_prior_requires_axiom_eval_not_final_view',
      errors,
      `seed_must_require_axiom_eval_not_final_view:${candidateSeed.seedId}`,
    );
    pushIf(
      !candidateSeed.allowedKernelMovement.includes('merge') ||
        !candidateSeed.allowedKernelMovement.includes('split') ||
        !candidateSeed.allowedKernelMovement.includes('drop'),
      errors,
      `seed_must_allow_count_changing_kernel_movement:${candidateSeed.seedId}`,
    );
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_derived_work_design_views_contract_valid'
        : 'kernel_derived_work_design_views_contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_DERIVED_WORK_DESIGN_VIEWS_CORE_PROGRESS_CLASSES],
  };
}
