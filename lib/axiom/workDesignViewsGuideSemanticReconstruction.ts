import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomKernelDerivedWorkDesignViewSet,
  validateAxiomKernelDerivedWorkDesignViewSet,
  type AxiomKernelDerivedWorkDesignViewSet,
} from './kernelDerivedWorkDesignViewSet';
import {
  buildAxiomKernelDerivedWorkDesignViewsContract,
  validateAxiomKernelDerivedWorkDesignViewsContract,
  type AxiomKernelDerivedViewSeed,
  type AxiomKernelDerivedWorkDesignViewsContract,
} from './kernelDerivedWorkDesignViewsContract';
import {
  buildAxiomKernelSemanticWorkDesignViewDerivation,
  validateAxiomKernelSemanticWorkDesignViewDerivation,
  type AxiomKernelSemanticWorkDesignViewDerivation,
} from './kernelSemanticWorkDesignViewDerivation';

export const AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY =
  'axiom_work_design_views_guide_semantic_reconstruction_is_internal_content_candidate_from_l3_semantic_prior_with_kernel_pressure_not_public_copy_or_final_view_count' as const;

export const AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_CORE_PROGRESS_CLASSES = [
  'kernel_eval',
  'kernel_display',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type ReconstructionText = {
  seedId: string;
  semanticRoleJa: string;
  readerQuestionCandidateJa: string;
};

export type AxiomWorkDesignViewsGuideSemanticSeedDraft = {
  seedDraftId: string;
  seedId: string;
  seedKind: AxiomKernelDerivedViewSeed['seedKind'];
  sourceSeedLabelJa: string;
  bridgeCandidateId: string;
  bridgeCandidateLabelJa: string;
  semanticRoleJa: string;
  readerQuestionCandidateJa: string;
  sourceLayerUse: {
    l3Seed: 'semantic_prior';
    kernelCorpus: 'grounding_pressure_missing_context_and_counter_hypothesis_test';
    reviewReceipt: 'provisional_kernel_structure_permission_not_semantic_approval';
  };
  reviewStatus: 'semantic_view_content_review_required_before_public_copy';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomWorkDesignViewsGuideSemanticSectionDraft = {
  sectionDraftId: string;
  bridgeCandidateId: string;
  headingJa: string;
  guidingQuestionJa: string;
  semanticSeedDraftIds: string[];
  seedDraftCount: number;
  sectionStatus:
    'internal_semantic_reconstruction_candidate_not_final_public_section';
  reviewRoute: 'semantic_view_content_review_before_public_guide';
};

export type AxiomWorkDesignViewsGuideSemanticReconstruction = {
  reconstructionId: string;
  objectType: 'axiom_work_design_views_guide_semantic_reconstruction';
  contractVersion: typeof AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_VERSION;
  lane: 'Falcon Lab';
  status: 'work_design_views_guide_semantic_reconstruction_candidates_ready_internal';
  boundary: typeof AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY;
  strengthensCore: typeof AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_CORE_PROGRESS_CLASSES;
  sourceSeedContractId: string;
  sourceViewSetId: string;
  sourceSemanticDerivationId: string;
  contentSourcePolicy:
    'l3_27_seed_meaning_is_reconstructed_with_axiom_kernel_pressure_not_replaced_by_15_or_18_internal_control_units';
  semanticSeedDraftCount: 27;
  principalPatternDraftCount: 21;
  crossCuttingAxisDraftCount: 6;
  sectionDraftCount: number;
  viewCountStatus: 'semantic_reconstruction_candidate_count_not_final';
  seedDrafts: AxiomWorkDesignViewsGuideSemanticSeedDraft[];
  sectionDrafts: AxiomWorkDesignViewsGuideSemanticSectionDraft[];
  reviewPolicy: {
    reviewUnitScale: 'semantic_view_seed_or_section_unit_not_individual_hypothesis';
    semanticReviewRequired: true;
    eighteenUnitReviewReceiptRole:
      'permits_kernel_backed_continuation_but_does_not_approve_semantic_view_content';
  };
  mustNotTreatAs: readonly [
    'public_copy',
    'final_view_count',
    'fixed_21_views',
    'semantic_review_completed',
    'source_support_validity_finality',
    'candidate_pattern_promotion',
  ];
  notNow: string[];
};

export type AxiomWorkDesignViewsGuideSemanticReconstructionValidation = {
  valid: boolean;
  validationStatus:
    | 'work_design_views_guide_semantic_reconstruction_valid'
    | 'work_design_views_guide_semantic_reconstruction_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY;
  strengthensCore: typeof AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_CORE_PROGRESS_CLASSES;
};

const RECONSTRUCTION_TEXTS: ReconstructionText[] = [
  {
    seedId: 'L3-PIP-01',
    semanticRoleJa:
      '体調の波を本人の自己管理不足ではなく、仕事量、締切、休息、代替手順の平準化課題として読む。',
    readerQuestionCandidateJa:
      '一週間や月内で負荷が偏り、回復時間や次の作業準備を奪っていないか。',
  },
  {
    seedId: 'L3-PIP-02',
    semanticRoleJa:
      '治療、通院、服薬、回復時間を勤務外の私事ではなく、働き続けるための時間同期条件として読む。',
    readerQuestionCandidateJa:
      '通院日、回復日、勤務量、評価タイミングが互いに衝突していないか。',
  },
  {
    seedId: 'L3-PIP-03',
    semanticRoleJa:
      '休職と復職を断絶ではなく、負荷を戻す速度、役割、相談線を調整する戻り回路として読む。',
    readerQuestionCandidateJa:
      '戻る日にだけ注目せず、戻った後に仕事量と役割を調整する回路があるか。',
  },
  {
    seedId: 'L3-PIP-04',
    semanticRoleJa:
      '通勤、移動、待機、休息場所を職務外の問題ではなく、仕事に入る前後の消耗条件として読む。',
    readerQuestionCandidateJa:
      '職場に着く前、移動中、休憩時の消耗が仕事遂行の条件に入っているか。',
  },
  {
    seedId: 'L3-PIP-05',
    semanticRoleJa:
      '生活保障を制度知識だけでなく、待つ、休む、選び直す自由を支える仕事設計条件として読む。',
    readerQuestionCandidateJa:
      '収入不安のために、回復や選び直しに必要な時間が奪われていないか。',
  },
  {
    seedId: 'L3-PIP-06',
    semanticRoleJa:
      '健康のために必要な時間と、評価、給与、勤務量の仕組みが衝突する地点を読む。',
    readerQuestionCandidateJa:
      '健康を守る行動が、評価や収入の低下として罰のように働いていないか。',
  },
  {
    seedId: 'L3-PIP-07',
    semanticRoleJa:
      '体調変化を隠すか告げるかの問題に閉じず、将来の変化を話せる仕事条件として読む。',
    readerQuestionCandidateJa:
      '悪化、回復、再発、変動を、いつ誰と何の目的で話せる設計になっているか。',
  },
  {
    seedId: 'L3-PIP-08',
    semanticRoleJa:
      '求人や職務条件と本人条件を、一方的な適合判定ではなく相互翻訳の課題として読む。',
    readerQuestionCandidateJa:
      '求人票の言葉と本人の働ける条件を、具体的な作業・時間・環境へ翻訳できているか。',
  },
  {
    seedId: 'L3-PIP-09',
    semanticRoleJa:
      '応募前の仕事像、体験、参加機会を、入口以前に仕事を理解するための接続条件として読む。',
    readerQuestionCandidateJa:
      '応募する前に、実際の仕事のリズム、手順、人との接点を確かめる機会があるか。',
  },
  {
    seedId: 'L3-PIP-10',
    semanticRoleJa:
      '開示を勇気や説明力の問題にせず、応募、面接、配属で何のために何を共有するかの目的限定設計として読む。',
    readerQuestionCandidateJa:
      '開示する情報が、採否判断ではなく仕事条件の調整に使われる設計になっているか。',
  },
  {
    seedId: 'L3-PIP-11',
    semanticRoleJa:
      '支援機関や専門職の接続を紹介で終えず、本人条件と職場条件を再翻訳し続ける容量として読む。',
    readerQuestionCandidateJa:
      '支援者は、本人、職場、制度の言葉を仕事条件へ翻訳し直せる位置にいるか。',
  },
  {
    seedId: 'L3-PIP-12',
    semanticRoleJa:
      '相談先を一回の窓口ではなく、変化や失敗後にも戻れる継続接続の回路として読む。',
    readerQuestionCandidateJa:
      '困った時、悪化した時、配置が変わった時に、もう一度相談できる線が残っているか。',
  },
  {
    seedId: 'L3-PIP-13',
    semanticRoleJa:
      '文書、口頭、図、手順書などの情報形式を、実際の仕事手順と同期する条件として読む。',
    readerQuestionCandidateJa:
      '伝えた情報が、現場で使える手順、チェック、道具に変換されているか。',
  },
  {
    seedId: 'L3-PIP-14',
    semanticRoleJa:
      '本人、企業、医療、支援、制度のsource lens差を、翻訳が止まる地点として読む。',
    readerQuestionCandidateJa:
      '誰の情報が強く扱われ、誰の情報が弱く扱われ、その差で仕事条件の理解が止まっていないか。',
  },
  {
    seedId: 'L3-PIP-15',
    semanticRoleJa:
      '作業手順、道具、設備を、能力の有無ではなく仕事との接触点を変える実装条件として読む。',
    readerQuestionCandidateJa:
      '困難を本人側だけに置かず、手順、道具、設備のどこを変えると接触が変わるか。',
  },
  {
    seedId: 'L3-PIP-16',
    semanticRoleJa:
      '安全、顧客対応、人員余力を、配慮の可否ではなく現場で実装できる条件として読む。',
    readerQuestionCandidateJa:
      '安全や顧客影響を理由に止める前に、誰がどの余力で実装を支えるか見えているか。',
  },
  {
    seedId: 'L3-PIP-17',
    semanticRoleJa:
      '感覚、情報アクセス、会議、文書、音声を、参加の質を左右する情報環境として読む。',
    readerQuestionCandidateJa:
      '音、光、文字、会議の速度や形式が、参加や理解を妨げていないか。',
  },
  {
    seedId: 'L3-PIP-18',
    semanticRoleJa:
      '認知、手順、タスク切替、記憶負荷を、注意力の問題ではなく仕事設計上の負荷配置として読む。',
    readerQuestionCandidateJa:
      '同時並行、例外処理、記憶頼み、急な切替が、仕事の失敗を作っていないか。',
  },
  {
    seedId: 'L3-PIP-19',
    semanticRoleJa:
      '役割、評価、処遇を、成果の有無だけでなく価値がどう翻訳されるかの問題として読む。',
    readerQuestionCandidateJa:
      '本人の貢献が、役割、評価、処遇の言葉に翻訳されず見えなくなっていないか。',
  },
  {
    seedId: 'L3-PIP-20',
    semanticRoleJa:
      '学習、キャリア、将来見通しを、採用後に成長と選択肢を閉じない仕事設計条件として読む。',
    readerQuestionCandidateJa:
      '今の仕事が続くだけでなく、学び、変化、次の役割へつながる見通しがあるか。',
  },
  {
    seedId: 'L3-PIP-21',
    semanticRoleJa:
      '職場規模、地域、支援資源の差を、同じ方法をそのまま移せない実装差として読む。',
    readerQuestionCandidateJa:
      '大企業、地域企業、支援資源の少ない場所で、同じ設計がどう変わる必要があるか。',
  },
  {
    seedId: 'L3-CCA-22',
    semanticRoleJa:
      '条件窓を診断名や制度名から答えを引くlookupではなく、働く条件を開く入口として保つ。',
    readerQuestionCandidateJa:
      'この入口は答えを出しているのか、それとも次に見る仕事条件を開いているのか。',
  },
  {
    seedId: 'L3-CCA-23',
    semanticRoleJa:
      '一つの見立てに閉じず、反対構造や別解釈を残して読みの暴走を止める。',
    readerQuestionCandidateJa:
      'この見立てと逆の説明、別の制約、見落とした主体は残っているか。',
  },
  {
    seedId: 'L3-CCA-24',
    semanticRoleJa:
      '支援や配慮の妥当性を決める表にせず、条件を読むための問いとして扱う。',
    readerQuestionCandidateJa:
      'この表現は、配慮の正解を断定していないか。',
  },
  {
    seedId: 'L3-CCA-25',
    semanticRoleJa:
      'source、currentness、public boundaryを分け、根拠の強さと公開可能性を混ぜない。',
    readerQuestionCandidateJa:
      'この情報は根拠、現在性、公開可能性のどの段階で止めるべきか。',
  },
  {
    seedId: 'L3-CCA-26',
    semanticRoleJa:
      '開示、同意、PII境界を守り、個別事情を公開面や学習更新へ流さない。',
    readerQuestionCandidateJa:
      '本人の同意や個人情報境界を越えて、説明や学習に使おうとしていないか。',
  },
  {
    seedId: 'L3-CCA-27',
    semanticRoleJa:
      'reviewとlearning loopを閉じず、人間レビュー前の反応や仮説を知識更新にしない。',
    readerQuestionCandidateJa:
      '反応、納得感、暫定仮説を、そのまま学習済み知識にしていないか。',
  },
] as const;

function unique<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function reconstructionText(seedId: string): ReconstructionText {
  const found = RECONSTRUCTION_TEXTS.find((item) => item.seedId === seedId);
  if (!found) throw new Error(`semantic_reconstruction_text_missing:${seedId}`);
  return found;
}

function bridgeForSeed(
  seedId: string,
  viewSet: AxiomKernelDerivedWorkDesignViewSet,
) {
  const candidate = viewSet.candidates.find((item) => item.sourceSeedIds.includes(seedId));
  if (!candidate) throw new Error(`semantic_reconstruction_bridge_missing:${seedId}`);
  return candidate;
}

function buildSeedDraft(
  seed: AxiomKernelDerivedViewSeed,
  viewSet: AxiomKernelDerivedWorkDesignViewSet,
): AxiomWorkDesignViewsGuideSemanticSeedDraft {
  const text = reconstructionText(seed.seedId);
  const bridge = bridgeForSeed(seed.seedId, viewSet);

  return {
    seedDraftId: `semantic_seed_draft:${seed.seedId}`,
    seedId: seed.seedId,
    seedKind: seed.seedKind,
    sourceSeedLabelJa: seed.labelJa,
    bridgeCandidateId: bridge.viewId,
    bridgeCandidateLabelJa: bridge.labelJa,
    semanticRoleJa: text.semanticRoleJa,
    readerQuestionCandidateJa: text.readerQuestionCandidateJa,
    sourceLayerUse: {
      l3Seed: 'semantic_prior',
      kernelCorpus: 'grounding_pressure_missing_context_and_counter_hypothesis_test',
      reviewReceipt: 'provisional_kernel_structure_permission_not_semantic_approval',
    },
    reviewStatus: 'semantic_view_content_review_required_before_public_copy',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

function buildSectionDraft(
  candidate: AxiomKernelDerivedWorkDesignViewSet['candidates'][number],
  seedDrafts: AxiomWorkDesignViewsGuideSemanticSeedDraft[],
): AxiomWorkDesignViewsGuideSemanticSectionDraft {
  const semanticSeedDraftIds = seedDrafts
    .filter((draft) => draft.bridgeCandidateId === candidate.viewId)
    .map((draft) => draft.seedDraftId);

  return {
    sectionDraftId: `semantic_section_draft:${candidate.viewId}`,
    bridgeCandidateId: candidate.viewId,
    headingJa: candidate.labelJa,
    guidingQuestionJa: candidate.readingQuestionJa,
    semanticSeedDraftIds,
    seedDraftCount: semanticSeedDraftIds.length,
    sectionStatus:
      'internal_semantic_reconstruction_candidate_not_final_public_section',
    reviewRoute: 'semantic_view_content_review_before_public_guide',
  };
}

export function buildAxiomWorkDesignViewsGuideSemanticReconstruction(
  seedContract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
  viewSet: AxiomKernelDerivedWorkDesignViewSet = buildAxiomKernelDerivedWorkDesignViewSet(
    seedContract,
  ),
  semanticDerivation: AxiomKernelSemanticWorkDesignViewDerivation =
    buildAxiomKernelSemanticWorkDesignViewDerivation(undefined, undefined, seedContract, viewSet),
): AxiomWorkDesignViewsGuideSemanticReconstruction {
  const seedDrafts = seedContract.seeds.map((seed) => buildSeedDraft(seed, viewSet));
  const sectionDrafts = viewSet.candidates.map((candidate) =>
    buildSectionDraft(candidate, seedDrafts),
  );

  return {
    reconstructionId: `axiom_work_design_views_guide_semantic_reconstruction_from_${semanticDerivation.derivationId}`,
    objectType: 'axiom_work_design_views_guide_semantic_reconstruction',
    contractVersion: AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_VERSION,
    lane: 'Falcon Lab',
    status: 'work_design_views_guide_semantic_reconstruction_candidates_ready_internal',
    boundary: AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY,
    strengthensCore: [
      ...AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_CORE_PROGRESS_CLASSES,
    ],
    sourceSeedContractId: seedContract.contractId,
    sourceViewSetId: viewSet.viewSetId,
    sourceSemanticDerivationId: semanticDerivation.derivationId,
    contentSourcePolicy:
      'l3_27_seed_meaning_is_reconstructed_with_axiom_kernel_pressure_not_replaced_by_15_or_18_internal_control_units',
    semanticSeedDraftCount: 27,
    principalPatternDraftCount: 21,
    crossCuttingAxisDraftCount: 6,
    sectionDraftCount: sectionDrafts.length,
    viewCountStatus: 'semantic_reconstruction_candidate_count_not_final',
    seedDrafts,
    sectionDrafts,
    reviewPolicy: {
      reviewUnitScale: 'semantic_view_seed_or_section_unit_not_individual_hypothesis',
      semanticReviewRequired: true,
      eighteenUnitReviewReceiptRole:
        'permits_kernel_backed_continuation_but_does_not_approve_semantic_view_content',
    },
    mustNotTreatAs: [
      'public_copy',
      'final_view_count',
      'fixed_21_views',
      'semantic_review_completed',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
    ],
    notNow: [
      'no_public_copy_from_semantic_reconstruction_candidates',
      'no_final_view_count_from_semantic_reconstruction_candidates',
      'no_fixed_21_views',
      'no_semantic_review_completion_from_18_unit_receipt',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...semanticDerivation.notNow,
      ...viewSet.notNow,
    ],
  };
}

export function validateAxiomWorkDesignViewsGuideSemanticReconstruction(
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
  seedContract: AxiomKernelDerivedWorkDesignViewsContract =
    buildAxiomKernelDerivedWorkDesignViewsContract(),
  viewSet: AxiomKernelDerivedWorkDesignViewSet = buildAxiomKernelDerivedWorkDesignViewSet(
    seedContract,
  ),
  semanticDerivation: AxiomKernelSemanticWorkDesignViewDerivation =
    buildAxiomKernelSemanticWorkDesignViewDerivation(undefined, undefined, seedContract, viewSet),
): AxiomWorkDesignViewsGuideSemanticReconstructionValidation {
  const errors: string[] = [];
  const seedContractValidation = validateAxiomKernelDerivedWorkDesignViewsContract(seedContract);
  const viewSetValidation = validateAxiomKernelDerivedWorkDesignViewSet(viewSet, seedContract);
  const semanticDerivationValidation = validateAxiomKernelSemanticWorkDesignViewDerivation(
    semanticDerivation,
    undefined,
    undefined,
    seedContract,
    viewSet,
  );
  const expectedSeedIds = new Set(seedContract.seeds.map((seed) => seed.seedId));
  const draftSeedIds = new Set(reconstruction.seedDrafts.map((draft) => draft.seedId));
  const sectionSeedDraftIds = new Set(
    reconstruction.sectionDrafts.flatMap((section) => section.semanticSeedDraftIds),
  );
  const bridgeCandidateIds = new Set(viewSet.candidates.map((candidate) => candidate.viewId));

  pushIf(!seedContractValidation.valid, errors, 'source_seed_contract_must_be_valid');
  pushIf(!viewSetValidation.valid, errors, 'source_view_set_must_be_valid');
  pushIf(!semanticDerivationValidation.valid, errors, 'source_semantic_derivation_must_be_valid');
  pushIf(
    reconstruction.objectType !== 'axiom_work_design_views_guide_semantic_reconstruction',
    errors,
    'object_type_must_match_work_design_views_guide_semantic_reconstruction',
  );
  pushIf(reconstruction.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    reconstruction.boundary !== AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY,
    errors,
    'boundary_must_remain_internal_semantic_reconstruction_not_public_copy',
  );
  pushIf(
    reconstruction.contentSourcePolicy !==
      'l3_27_seed_meaning_is_reconstructed_with_axiom_kernel_pressure_not_replaced_by_15_or_18_internal_control_units',
    errors,
    'content_source_policy_must_preserve_l3_semantic_prior_and_15_18_layer_boundary',
  );
  pushIf(
    reconstruction.semanticSeedDraftCount !== 27 ||
      reconstruction.seedDrafts.length !== 27 ||
      reconstruction.principalPatternDraftCount !== 21 ||
      reconstruction.crossCuttingAxisDraftCount !== 6,
    errors,
    'semantic_reconstruction_must_cover_27_seed_drafts_as_21_principal_plus_6_axis',
  );
  pushIf(
    reconstruction.sectionDraftCount !== viewSet.candidates.length ||
      reconstruction.sectionDrafts.length !== viewSet.candidates.length,
    errors,
    'semantic_reconstruction_section_count_must_match_bridge_candidate_count',
  );
  pushIf(
    reconstruction.viewCountStatus !== 'semantic_reconstruction_candidate_count_not_final',
    errors,
    'semantic_reconstruction_must_not_set_final_view_count',
  );
  pushIf(
    reconstruction.reviewPolicy.semanticReviewRequired !== true ||
      reconstruction.reviewPolicy.eighteenUnitReviewReceiptRole !==
        'permits_kernel_backed_continuation_but_does_not_approve_semantic_view_content',
    errors,
    'review_policy_must_require_semantic_review_and_limit_18_unit_receipt_role',
  );
  pushIf(
    !reconstruction.mustNotTreatAs.includes('public_copy') ||
      !reconstruction.mustNotTreatAs.includes('semantic_review_completed') ||
      !reconstruction.mustNotTreatAs.includes('fixed_21_views'),
    errors,
    'must_not_treat_reconstruction_as_public_copy_review_completed_or_fixed_21',
  );
  pushIf(
    !reconstruction.notNow.includes('no_public_copy_from_semantic_reconstruction_candidates') ||
      !reconstruction.notNow.includes('no_semantic_review_completion_from_18_unit_receipt') ||
      !reconstruction.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !reconstruction.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_public_copy_semantic_review_completion_runtime_and_learning',
  );

  for (const seedId of expectedSeedIds) {
    pushIf(!draftSeedIds.has(seedId), errors, `semantic_seed_draft_missing:${seedId}`);
  }
  for (const draft of reconstruction.seedDrafts) {
    pushIf(
      !expectedSeedIds.has(draft.seedId),
      errors,
      `semantic_seed_draft_unknown_seed:${draft.seedId}`,
    );
    pushIf(
      !bridgeCandidateIds.has(draft.bridgeCandidateId),
      errors,
      `semantic_seed_draft_unknown_bridge:${draft.seedId}:${draft.bridgeCandidateId}`,
    );
    pushIf(draft.semanticRoleJa.trim().length < 24, errors, `semantic_role_too_thin:${draft.seedId}`);
    pushIf(
      draft.readerQuestionCandidateJa.trim().length < 20,
      errors,
      `reader_question_too_thin:${draft.seedId}`,
    );
    pushIf(
      draft.sourceLayerUse.l3Seed !== 'semantic_prior' ||
        draft.sourceLayerUse.kernelCorpus !==
          'grounding_pressure_missing_context_and_counter_hypothesis_test' ||
        draft.sourceLayerUse.reviewReceipt !==
          'provisional_kernel_structure_permission_not_semantic_approval',
      errors,
      `semantic_seed_draft_must_preserve_layer_roles:${draft.seedId}`,
    );
    pushIf(
      draft.reviewStatus !== 'semantic_view_content_review_required_before_public_copy' ||
        draft.publicUseStatus !== 'not_public_approved' ||
        draft.publicationStatus !== 'not_published',
      errors,
      `semantic_seed_draft_must_require_review_and_remain_unpublished:${draft.seedId}`,
    );
  }

  for (const section of reconstruction.sectionDrafts) {
    pushIf(
      !bridgeCandidateIds.has(section.bridgeCandidateId),
      errors,
      `semantic_section_unknown_bridge:${section.sectionDraftId}`,
    );
    pushIf(section.seedDraftCount === 0, errors, `semantic_section_missing_seed_drafts:${section.sectionDraftId}`);
    pushIf(
      section.sectionStatus !==
        'internal_semantic_reconstruction_candidate_not_final_public_section' ||
        section.reviewRoute !== 'semantic_view_content_review_before_public_guide',
      errors,
      `semantic_section_must_remain_internal_and_review_routed:${section.sectionDraftId}`,
    );
    for (const draftId of section.semanticSeedDraftIds) {
      pushIf(
        !sectionSeedDraftIds.has(draftId),
        errors,
        `semantic_section_draft_id_not_indexed:${section.sectionDraftId}:${draftId}`,
      );
    }
  }
  pushIf(
    unique(reconstruction.sectionDrafts.flatMap((section) => section.semanticSeedDraftIds)).length !==
      reconstruction.seedDrafts.length,
    errors,
    'semantic_sections_must_cover_every_seed_draft_exactly_once',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'work_design_views_guide_semantic_reconstruction_valid'
        : 'work_design_views_guide_semantic_reconstruction_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_BOUNDARY,
    strengthensCore: [
      ...AXIOM_WORK_DESIGN_VIEWS_GUIDE_SEMANTIC_RECONSTRUCTION_CORE_PROGRESS_CLASSES,
    ],
  };
}
