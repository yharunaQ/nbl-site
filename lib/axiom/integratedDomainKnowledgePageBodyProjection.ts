import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
  validateAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
  type AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
} from './allLayerIntegratedDomainKnowledgeFounderReviewResultReceipt';
import {
  buildAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  type AxiomAllLayerIntegratedDomainKnowledgeRebuild,
  type AxiomAllLayerRebuiltReviewUnit,
} from './allLayerIntegratedDomainKnowledgeRebuild';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';

export const AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_VERSION =
  'v0_2026_06_12' as const;

export const AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY =
  'axiom_integrated_domain_knowledge_page_body_projection_translates_founder_accepted_10_units_37_substructures_to_internal_next_nbl_candidate_pages_without_public_approval' as const;

export const AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomIntegratedDomainKnowledgePageBodySection = {
  sectionId: string;
  sourceRebuiltUnitId: string;
  sourceTitleJa: string;
  headingJa: string;
  readerFacingSummaryJa: string;
  axiomReadingJa: string;
  changesReadingJa: string[];
  pageUseJa: string;
  sourceSubstructureIds: string[];
  substructureCount: number;
  substructureUseJa: string[];
  cannotYetSayJa: string;
  reviewRoute: 'later_public_copy_review_not_current_founder_review_object';
};

export type AxiomIntegratedDomainKnowledgePageBody = {
  pageBodyId: string;
  surface: AxiomNextNblSiteSurface;
  pageHeadingJa: string;
  openingThesisJa: string;
  readerPromiseJa: string;
  sourceReceiptId: string;
  sourceRebuildId: string;
  sourceUnitIds: string[];
  sourceSubstructureIds: string[];
  bodySections: AxiomIntegratedDomainKnowledgePageBodySection[];
  bodySectionCount: number;
  publicCopyReviewPromptsJa: readonly [string, string, string];
  contentSourceStatus: 'from_founder_accepted_all_layer_integrated_domain_knowledge_not_l3_direct_copy';
  routeStatus: 'internal_candidate_page_body_projection_not_actual_public_navigation';
  publicCopyReviewStatus: 'internal_candidate_page_body_projection_public_copy_review_required';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomIntegratedDomainKnowledgePageBodyProjection = {
  projectionId: string;
  objectType: 'axiom_integrated_domain_knowledge_page_body_projection';
  contractVersion: typeof AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_VERSION;
  lane: 'Falcon Lab';
  status: 'internal_next_nbl_candidate_page_bodies_projected_from_founder_accepted_axiom_integrated_domain_knowledge';
  boundary: typeof AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY;
  strengthensCore: typeof AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_CORE_PROGRESS_CLASSES;
  sourceReceiptId: string;
  sourceReceiptStatus: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt['status'];
  sourceRebuildId: string;
  pageBodyCount: 9;
  surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
  pageBodies: AxiomIntegratedDomainKnowledgePageBody[];
  coverage: {
    acceptedUnitCount: 10;
    acceptedSubstructureCount: number;
    representedUnitIds: string[];
    representedSubstructureIds: string[];
  };
  secondOpinionControlResetApplied: true;
  noNewReviewObjectCreated: true;
  notNow: readonly [
    'no_new_gate8_or_final_release_shell_growth',
    'no_new_founder_review_object_before_page_body_projection',
    'no_l3_direct_content_as_axiom_truth',
    'no_falcon_public_copy_as_axiom_truth',
    'no_actual_public_navigation',
    'no_public_approval_or_publication_execution',
    'no_source_support_validity_finality',
    'no_candidate_pattern_promotion',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_learning_update',
  ];
};

export type AxiomIntegratedDomainKnowledgePageBodyProjectionValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_integrated_domain_knowledge_page_body_projection_valid'
    | 'axiom_integrated_domain_knowledge_page_body_projection_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY;
  strengthensCore: typeof AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_CORE_PROGRESS_CLASSES;
};

type ProjectionDefinition = {
  surface: AxiomNextNblSiteSurface;
  pageHeadingJa: string;
  openingThesisJa: string;
  readerPromiseJa: string;
  sourceUnitIds: string[];
  publicCopyReviewPromptsJa: readonly [string, string, string];
};

const UNIT_IDS = {
  healthTime: 'rebuilt_unit_fluctuating_health_time_work_density',
  medicalTime: 'rebuilt_unit_regular_medical_monitoring_treatment_time',
  sensoryAccess: 'rebuilt_unit_sensory_information_access_communication',
  cognitiveAccess: 'rebuilt_unit_cognitive_procedural_access_switching_load',
  disclosure: 'rebuilt_unit_disclosure_stigma_purpose_limited_information',
  preEntry: 'rebuilt_unit_pre_entry_job_image_transition',
  worksiteContact: 'rebuilt_unit_worksite_contact_task_safety_tools',
  supportNetwork: 'rebuilt_unit_support_retranslation_continuity_network',
  qualityLoop: 'rebuilt_unit_role_value_growth_quality_loop',
  sourceLens: 'rebuilt_unit_source_lens_universal_structure_boundary_guard',
} as const;

const PROJECTION_DEFINITIONS: readonly ProjectionDefinition[] = [
  {
    surface: 'reader_facing_top_home',
    pageHeadingJa: '働きづらさを、相互作用の仕事条件として読み直す',
    openingThesisJa:
      'Axiom版NBLは、障害名や配慮名から答えを引くサイトではなく、健康時間、情報形式、職場接触点、支援接続、評価、生活保障がどう噛み合うかを読み始める入口にする。',
    readerPromiseJa:
      'トップページでは、10の統合知識をそのまま並べるのではなく、読者が次にどの入口へ進めばよいか分かる読み順に翻訳する。',
    sourceUnitIds: [
      UNIT_IDS.healthTime,
      UNIT_IDS.sensoryAccess,
      UNIT_IDS.disclosure,
      UNIT_IDS.worksiteContact,
      UNIT_IDS.supportNetwork,
      UNIT_IDS.qualityLoop,
      UNIT_IDS.sourceLens,
    ],
    publicCopyReviewPromptsJa: [
      'トップページとして、専門用語より先に「何を読めるサイトか」が伝わるか。',
      '病名別lookupや支援策一覧に戻らず、相互作用の仕事条件として開けているか。',
      '公開承認前の候補である境界が、免責だけでなく読み方の信頼として見えるか。',
    ],
  },
  {
    surface: 'work_condition_window',
    pageHeadingJa: '障害種類・疾病名から、職場条件へ。',
    openingThesisJa:
      '病名や障害種類は、困りごとを話し始める入口になります。そこから支援策を逆引きせず、時間、情報、手順、移動、開示、評価のどの条件を確認するかへ進みます。',
    readerPromiseJa:
      '難病、内部障害、視覚障害、聴覚・平衡機能障害、肢体不自由、知的障害、精神障害、発達障害、高次脳機能障害の違いを埋もれさせず、共通する仕事条件と分けるべき条件を同時に示す。',
    sourceUnitIds: [
      UNIT_IDS.healthTime,
      UNIT_IDS.medicalTime,
      UNIT_IDS.sensoryAccess,
      UNIT_IDS.cognitiveAccess,
      UNIT_IDS.disclosure,
      UNIT_IDS.worksiteContact,
    ],
    publicCopyReviewPromptsJa: [
      '障害種類・疾病名を入口にしながら、病名別の答え表に見えていないか。',
      '少数だが重要な感覚・認知・内部障害の条件が、難病の大きな負荷量に埋もれていないか。',
      '確認すべき仕事条件が読者に具体的に見えるか。',
    ],
  },
  {
    surface: 'consultation_case_reading_collection',
    pageHeadingJa: '相談の一文を、観察・見立て・別解・文脈へ分ける',
    openingThesisJa:
      '相談事例は、正解集ではなく読み方の訓練面にする。Axiomの統合知識を使って、見えていること、推論していること、別の可能性、足りない文脈を分けて読む。',
    readerPromiseJa:
      '事例本文では、個別判断をせず、相談文の背後にある仕事条件と関係者条件を読めるようにする。',
    sourceUnitIds: [
      UNIT_IDS.healthTime,
      UNIT_IDS.disclosure,
      UNIT_IDS.worksiteContact,
      UNIT_IDS.supportNetwork,
      UNIT_IDS.qualityLoop,
    ],
    publicCopyReviewPromptsJa: [
      '事例が助言や判定ではなく、見立ての分解として読めるか。',
      '反対仮説やmissing contextが消えていないか。',
      '個人情報や個別支援判断へ踏み込まず、公開可能な学習面になっているか。',
    ],
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    pageHeadingJa: 'Axiom版 仕事設計視点ガイド',
    openingThesisJa:
      '旧21視点を固定継承せず、Axiomが実データと国内外の情報を読み直して得た統合知識を、仕事設計の視点候補として並べる。最終的な視点数や名称は、公開コピー段階でさらに統合・分割されうる。',
    readerPromiseJa:
      '視点ガイドでは、Founderレビュー済みの統合知識を、企業・支援者・本人が仕事条件を点検するための地図として読む。',
    sourceUnitIds: [...Object.values(UNIT_IDS)],
    publicCopyReviewPromptsJa: [
      '視点群が、固定の公式分類ではなくAxiom版の仕事設計候補として伝わるか。',
      '粒度の違う候補が、下部構造によって十分に具体化されているか。',
      '旧21視点やL3 27 seedをAxiom truthとして直コピーしていないか。',
    ],
  },
  {
    surface: 'theory_method_trust_page',
    pageHeadingJa: '読み方の専門知識と、読み取った専門知識を分けて示す',
    openingThesisJa:
      'NBLの専門性は、専門情報をどう読み、どう言いすぎずに届けるかという第一層と、その読み方でまとめた仕事・社会参加の専門知識という第二層に分かれる。',
    readerPromiseJa:
      '方法ページでは、AIの読解力がどこで働き、観察・推論・別の可能性・足りない文脈をどう分けるのかを、サイト全体の専門知識提供と切り分けて説明する。',
    sourceUnitIds: [
      UNIT_IDS.sourceLens,
      UNIT_IDS.supportNetwork,
      UNIT_IDS.disclosure,
      UNIT_IDS.healthTime,
      UNIT_IDS.qualityLoop,
    ],
    publicCopyReviewPromptsJa: [
      'AIが最終判断者に見えず、候補生成と構造読解の役割として説明できているか。',
      'source lens、cannot-yet-say、人間レビュー、公開承認が分離されているか。',
      '専門性を強く示しつつ、過剰な権威付けになっていないか。',
    ],
  },
  {
    surface: 'article_social_question_library',
    pageHeadingJa: '社会の違和感を、仕事条件の問いへ戻す',
    openingThesisJa:
      '記事や社会的な問いは、主張や炎上の材料ではなく、働きづらさの背後にある条件を読み直す入口にする。短い問いを、構造、別解、missing contextへ戻す。',
    readerPromiseJa:
      '記事集では、Axiomの統合知識を社会的な言葉へ翻訳し、読者が自分の職場や支援場面で問い直せる形にする。',
    sourceUnitIds: [
      UNIT_IDS.healthTime,
      UNIT_IDS.disclosure,
      UNIT_IDS.preEntry,
      UNIT_IDS.qualityLoop,
      UNIT_IDS.sourceLens,
    ],
    publicCopyReviewPromptsJa: [
      'SNS向きの断定や煽りではなく、考える入口になっているか。',
      '記事がkernelのmissing contextや反対仮説へ戻る導線を持つか。',
      '社会反応を根拠や学習更新として扱っていないか。',
    ],
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    pageHeadingJa: '図解・4コマ・音楽で、仕事条件を見える形にする',
    openingThesisJa:
      '仕事と支援の複雑な関係は、文章だけでは伝わりにくい。ツールキットでは、選別済みの図解、4コマ、音楽、フォーラム資料を、ひとりで読む、会議で共有する、研修で使う入口として並べる。',
    readerPromiseJa:
      'ツールキットでは、健康時間、情報アクセス、手順理解、職場接触点、支援接続を、画像や音で共有できる素材として扱う。',
    sourceUnitIds: [
      UNIT_IDS.healthTime,
      UNIT_IDS.sensoryAccess,
      UNIT_IDS.cognitiveAccess,
      UNIT_IDS.worksiteContact,
      UNIT_IDS.supportNetwork,
    ],
    publicCopyReviewPromptsJa: [
      'ツールが診断・助言・配慮判定に見えていないか。',
      '複雑な構造を減らしすぎず、使える形に翻訳できているか。',
      '関係者条件や実装余力を消していないか。',
    ],
  },
  {
    surface: 'about_operating_boundary_page',
    pageHeadingJa: 'NBLが読むこと、判断しないこと',
    openingThesisJa:
      'NBLは、障害者・難病患者の就労を、本人の能力や診断名ではなく仕事条件の相互作用として読む。個別判断、医療判断、法的判断、就職保証、支援妥当性の最終判断は行わない。',
    readerPromiseJa:
      '運営境界ページでは、Axiomの専門性と、その専門性が越えてはいけない境界を同時に示す。',
    sourceUnitIds: [
      UNIT_IDS.sourceLens,
      UNIT_IDS.supportNetwork,
      UNIT_IDS.disclosure,
      UNIT_IDS.qualityLoop,
    ],
    publicCopyReviewPromptsJa: [
      '境界説明が免責だけでなく、何を支援するのかも示しているか。',
      '公開承認前の候補を運営方針として断定していないか。',
      'source/support validityと公開可能性を混ぜていないか。',
    ],
  },
  {
    surface: 'scene_entry_use_cases',
    pageHeadingJa: '8つの古くて新しい課題を、仕事条件の地図へ',
    openingThesisJa:
      '場面から入るページは、抽象的な理論説明より先に、昔から理念や制度では語られてきたのに解けなかった課題を4コマのユースケースで見せる。読者は、何が数字・名前・制度・善意・検索結果に見え、どの仕事条件として共有し直すのかを直感的につかめる。',
    readerPromiseJa:
      '場面ページでは、見える数字と見えにくい参加、名前で止まる、健康時間、情報の分断、制度から現場へ、上司依存、検索・SNS・AI要約の限界、学びが育たない、の8課題を、4コマと確認ポイントに変換する。',
    sourceUnitIds: [
      UNIT_IDS.healthTime,
      UNIT_IDS.disclosure,
      UNIT_IDS.cognitiveAccess,
      UNIT_IDS.worksiteContact,
      UNIT_IDS.preEntry,
      UNIT_IDS.supportNetwork,
    ],
    publicCopyReviewPromptsJa: [
      '4コマや場面が、説明過多を避けて問題状況を一撃で伝えているか。',
      '場面が個別助言や配慮判定ではなく、見方の転換として読めるか。',
      '相談事例、視点ガイド、ツールキットへ自然に進めるか。',
    ],
  },
];

const NOT_NOW = [
  'no_new_gate8_or_final_release_shell_growth',
  'no_new_founder_review_object_before_page_body_projection',
  'no_l3_direct_content_as_axiom_truth',
  'no_falcon_public_copy_as_axiom_truth',
  'no_actual_public_navigation',
  'no_public_approval_or_publication_execution',
  'no_source_support_validity_finality',
  'no_candidate_pattern_promotion',
  'no_runtime_prompt_retrieval_model_provider_db_schema_change',
  'no_learning_update',
] as const;

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function unitById(
  unitId: string,
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild,
): AxiomAllLayerRebuiltReviewUnit {
  const unit = rebuild.rebuiltReviewUnits.find((candidate) => candidate.rebuiltUnitId === unitId);
  if (!unit) throw new Error(`axiom_integrated_domain_unit_missing:${unitId}`);
  return unit;
}

function buildSection(
  surface: AxiomNextNblSiteSurface,
  unit: AxiomAllLayerRebuiltReviewUnit,
): AxiomIntegratedDomainKnowledgePageBodySection {
  return {
    sectionId: `axiom_page_body_section:${surface}:${unit.rebuiltUnitId}`,
    sourceRebuiltUnitId: unit.rebuiltUnitId,
    sourceTitleJa: unit.titleJa,
    headingJa: unit.titleJa,
    readerFacingSummaryJa: unit.founderReviewCard.plainFindingJa,
    axiomReadingJa: unit.founderReviewCard.axiomReadingJa,
    changesReadingJa: [...unit.founderReviewCard.changesReadingJa],
    pageUseJa: unit.founderReviewCard.nextNblUseCandidateJa,
    sourceSubstructureIds: unit.substructures.map((substructure) => substructure.substructureId),
    substructureCount: unit.substructures.length,
    substructureUseJa: unit.substructures.map((substructure) => substructure.nextNblUseCandidateJa),
    cannotYetSayJa: unit.founderReviewCard.boundaryNoteJa,
    reviewRoute: 'later_public_copy_review_not_current_founder_review_object',
  };
}

function buildPageBody(
  definition: ProjectionDefinition,
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild,
  receipt: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
): AxiomIntegratedDomainKnowledgePageBody {
  const units = definition.sourceUnitIds.map((unitId) => unitById(unitId, rebuild));
  const bodySections = units.map((unit) => buildSection(definition.surface, unit));
  const sourceSubstructureIds = unique(
    bodySections.flatMap((section) => section.sourceSubstructureIds),
  );

  return {
    pageBodyId: `axiom_integrated_domain_page_body:${definition.surface}`,
    surface: definition.surface,
    pageHeadingJa: definition.pageHeadingJa,
    openingThesisJa: definition.openingThesisJa,
    readerPromiseJa: definition.readerPromiseJa,
    sourceReceiptId: receipt.receiptId,
    sourceRebuildId: rebuild.rebuildId,
    sourceUnitIds: definition.sourceUnitIds,
    sourceSubstructureIds,
    bodySections,
    bodySectionCount: bodySections.length,
    publicCopyReviewPromptsJa: definition.publicCopyReviewPromptsJa,
    contentSourceStatus:
      'from_founder_accepted_all_layer_integrated_domain_knowledge_not_l3_direct_copy',
    routeStatus: 'internal_candidate_page_body_projection_not_actual_public_navigation',
    publicCopyReviewStatus: 'internal_candidate_page_body_projection_public_copy_review_required',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

function definitionForSurface(surface: AxiomNextNblSiteSurface): ProjectionDefinition {
  const definition = PROJECTION_DEFINITIONS.find((candidate) => candidate.surface === surface);
  if (!definition) {
    throw new Error(`axiom_page_body_projection_definition_missing:${surface}`);
  }
  return definition;
}

export function buildAxiomIntegratedDomainKnowledgePageBodyProjection(
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(),
  receipt: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt = buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
    rebuild,
  ),
): AxiomIntegratedDomainKnowledgePageBodyProjection {
  const pageBodies = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
    buildPageBody(definitionForSurface(surface), rebuild, receipt),
  );
  const representedUnitIds = unique(pageBodies.flatMap((page) => page.sourceUnitIds));
  const representedSubstructureIds = unique(
    pageBodies.flatMap((page) => page.sourceSubstructureIds),
  );

  return {
    projectionId: 'axiom_integrated_domain_knowledge_page_body_projection_v0_2026_06_12',
    objectType: 'axiom_integrated_domain_knowledge_page_body_projection',
    contractVersion: AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_VERSION,
    lane: 'Falcon Lab',
    status:
      'internal_next_nbl_candidate_page_bodies_projected_from_founder_accepted_axiom_integrated_domain_knowledge',
    boundary: AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY,
    strengthensCore: [
      ...AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_CORE_PROGRESS_CLASSES,
    ],
    sourceReceiptId: receipt.receiptId,
    sourceReceiptStatus: receipt.status,
    sourceRebuildId: rebuild.rebuildId,
    pageBodyCount: 9,
    surfacesCovered: [...AXIOM_NEXT_NBL_SITE_SURFACES],
    pageBodies,
    coverage: {
      acceptedUnitCount: 10,
      acceptedSubstructureCount: rebuild.allLayerCoverageReview.totalSubstructureCount,
      representedUnitIds,
      representedSubstructureIds,
    },
    secondOpinionControlResetApplied: true,
    noNewReviewObjectCreated: true,
    notNow: NOT_NOW,
  };
}

export function getAxiomIntegratedDomainKnowledgePageBodyBySurface(
  surface: AxiomNextNblSiteSurface,
  projection: AxiomIntegratedDomainKnowledgePageBodyProjection = buildAxiomIntegratedDomainKnowledgePageBodyProjection(),
) {
  return projection.pageBodies.find((pageBody) => pageBody.surface === surface) ?? null;
}

export function validateAxiomIntegratedDomainKnowledgePageBodyProjection(
  projection: AxiomIntegratedDomainKnowledgePageBodyProjection,
  rebuild: AxiomAllLayerIntegratedDomainKnowledgeRebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(),
  receipt: AxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt = buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
    rebuild,
  ),
): AxiomIntegratedDomainKnowledgePageBodyProjectionValidation {
  const errors: string[] = [];
  const receiptValidation =
    validateAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(receipt, rebuild);
  const acceptedUnitIds = rebuild.rebuiltReviewUnits.map((unit) => unit.rebuiltUnitId);
  const acceptedSubstructureIds = rebuild.rebuiltReviewUnits.flatMap((unit) =>
    unit.substructures.map((substructure) => substructure.substructureId),
  );

  pushIf(!receiptValidation.valid, errors, 'source_founder_review_receipt_must_be_valid');
  pushIf(
    projection.boundary !== AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY,
    errors,
    'boundary_must_preserve_internal_projection_without_public_approval',
  );
  pushIf(projection.pageBodyCount !== 9, errors, 'page_body_count_must_be_9');
  pushIf(projection.pageBodies.length !== 9, errors, 'page_body_rows_must_be_9');
  pushIf(
    AXIOM_NEXT_NBL_SITE_SURFACES.some(
      (surface) => !projection.pageBodies.some((page) => page.surface === surface),
    ),
    errors,
    'all_9_surfaces_must_have_page_bodies',
  );
  pushIf(
    acceptedUnitIds.some((unitId) => !projection.coverage.representedUnitIds.includes(unitId)),
    errors,
    'all_10_accepted_units_must_be_represented',
  );
  pushIf(
    acceptedSubstructureIds.some(
      (substructureId) => !projection.coverage.representedSubstructureIds.includes(substructureId),
    ),
    errors,
    'all_37_accepted_substructures_must_be_represented',
  );
  pushIf(
    projection.coverage.acceptedSubstructureCount !==
      rebuild.allLayerCoverageReview.totalSubstructureCount,
    errors,
    'accepted_substructure_count_must_match_rebuild',
  );
  pushIf(
    !projection.secondOpinionControlResetApplied,
    errors,
    'second_opinion_control_reset_must_be_applied',
  );
  pushIf(
    !projection.noNewReviewObjectCreated,
    errors,
    'projection_must_not_create_new_founder_review_object',
  );

  for (const pageBody of projection.pageBodies) {
    pushIf(!pageBody.pageHeadingJa, errors, `page_heading_missing:${pageBody.surface}`);
    pushIf(!pageBody.openingThesisJa, errors, `opening_thesis_missing:${pageBody.surface}`);
    pushIf(pageBody.bodySectionCount < 4, errors, `too_few_body_sections:${pageBody.surface}`);
    pushIf(
      pageBody.contentSourceStatus !==
        'from_founder_accepted_all_layer_integrated_domain_knowledge_not_l3_direct_copy',
      errors,
      `content_source_must_be_founder_accepted_integrated_domain_knowledge:${pageBody.surface}`,
    );
    pushIf(
      pageBody.routeStatus !==
        'internal_candidate_page_body_projection_not_actual_public_navigation',
      errors,
      `route_status_must_remain_internal:${pageBody.surface}`,
    );
    pushIf(
      pageBody.publicCopyReviewStatus !==
        'internal_candidate_page_body_projection_public_copy_review_required',
      errors,
      `public_copy_review_status_required:${pageBody.surface}`,
    );
    pushIf(
      pageBody.publicUseStatus !== 'not_public_approved',
      errors,
      `public_use_status_must_remain_not_approved:${pageBody.surface}`,
    );
    pushIf(
      pageBody.publicationStatus !== 'not_published',
      errors,
      `publication_status_must_remain_not_published:${pageBody.surface}`,
    );
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_integrated_domain_knowledge_page_body_projection_valid'
        : 'axiom_integrated_domain_knowledge_page_body_projection_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_BOUNDARY,
    strengthensCore: [
      ...AXIOM_INTEGRATED_DOMAIN_KNOWLEDGE_PAGE_BODY_PROJECTION_CORE_PROGRESS_CLASSES,
    ],
  };
}
