import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
} from './siteSurfaceSlotContract';
import {
  buildAxiomWorkDesignViewBackboneSurfacePropagation,
  validateAxiomWorkDesignViewBackboneSurfacePropagation,
  type AxiomWorkDesignViewBackboneSurfacePropagation,
  type AxiomWorkDesignViewBackboneSurfaceSlotCandidate,
} from './workDesignViewBackboneSurfacePropagation';
import {
  buildAxiomWorkDesignViewsGuideSemanticReconstruction,
  validateAxiomWorkDesignViewsGuideSemanticReconstruction,
  type AxiomWorkDesignViewsGuideSemanticReconstruction,
  type AxiomWorkDesignViewsGuideSemanticSectionDraft,
  type AxiomWorkDesignViewsGuideSemanticSeedDraft,
} from './workDesignViewsGuideSemanticReconstruction';

export const AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY =
  'axiom_work_design_backbone_surface_draft_assembly_creates_review_required_internal_page_body_candidates_not_public_copy_or_publication' as const;

export const AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type SurfaceDraftDefinition = {
  surface: AxiomNextNblSiteSurface;
  pageHeadingCandidateJa: string;
  openingFrameJa: string;
  surfaceReviewQuestionsJa: readonly [string, string, string];
};

export type AxiomWorkDesignBackboneSurfaceBodySectionCandidate = {
  bodySectionCandidateId: string;
  sourceSemanticSectionDraftId: string;
  headingCandidateJa: string;
  guidingQuestionJa: string;
  seedQuestionCandidatesJa: string[];
  seedRoleCandidatesJa: string[];
  sourceSeedDraftIds: string[];
  reviewRoute: 'surface_body_section_review_before_public_copy';
};

export type AxiomWorkDesignBackboneSurfaceDraftCandidate = {
  surfaceDraftCandidateId: string;
  surface: AxiomNextNblSiteSurface;
  sourcePropagationSlotCandidateId: string;
  pageHeadingCandidateJa: string;
  openingThesisCandidateJa: string;
  bodySectionCandidates: AxiomWorkDesignBackboneSurfaceBodySectionCandidate[];
  bodySectionCandidateCount: number;
  sourceSeedDraftIds: string[];
  sourceSectionDraftIds: string[];
  surfaceReviewQuestionsJa: readonly [string, string, string];
  semanticReviewStatus: 'surface_body_draft_review_required';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  reviewRoute: 'surface_body_draft_review_before_public_page_copy';
};

export type AxiomWorkDesignBackboneSurfaceDraftAssembly = {
  draftAssemblyId: string;
  objectType: 'axiom_work_design_backbone_surface_draft_assembly';
  contractVersion: typeof AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_VERSION;
  lane: 'Falcon Lab';
  status: 'surface_body_draft_candidates_ready_internal';
  boundary: typeof AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY;
  strengthensCore: typeof AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_CORE_PROGRESS_CLASSES;
  sourceSemanticReconstructionId: string;
  sourcePropagationId: string;
  surfaceDraftCandidateCount: 9;
  contentSourcePolicy:
    'surface_body_drafts_from_axiom_semantic_backbone_not_falcon_public_copy';
  surfaceDrafts: AxiomWorkDesignBackboneSurfaceDraftCandidate[];
  coverage: {
    surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
    representedSeedDraftIds: string[];
    representedSectionDraftIds: string[];
    representedPropagationSlotCandidateIds: string[];
  };
  reviewPolicy: {
    reviewUnitScale: 'surface_body_draft_unit_not_individual_hypothesis';
    reviewRequiredBeforePublicCopy: true;
    semanticReviewRequiredBeforePublication: true;
  };
  mustNotTreatAs: readonly [
    'public_copy',
    'public_navigation',
    'publication_approval',
    'final_view_count',
    'source_support_validity_finality',
    'candidate_pattern_promotion',
  ];
  notNow: string[];
};

export type AxiomWorkDesignBackboneSurfaceDraftAssemblyValidation = {
  valid: boolean;
  validationStatus:
    | 'work_design_backbone_surface_draft_assembly_valid'
    | 'work_design_backbone_surface_draft_assembly_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY;
  strengthensCore: typeof AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_CORE_PROGRESS_CLASSES;
};

const SURFACE_DRAFT_DEFINITIONS: SurfaceDraftDefinition[] = [
  {
    surface: 'reader_facing_top_home',
    pageHeadingCandidateJa: '働きづらさを、仕事条件の問いとして読み直す',
    openingFrameJa:
      'トップページは、診断名や制度名から答えを引く入口ではなく、体調、時間、役割、評価、支援接続がどう噛み合っているかを読み始める入口にする。',
    surfaceReviewQuestionsJa: [
      '読者入口として、結論ではなく仕事条件の問いになっているか。',
      '旧FalconコピーやSNS反応をAxiom core truthとして扱っていないか。',
      '次に読むsurfaceへ自然につながるか。',
    ],
  },
  {
    surface: 'work_condition_window',
    pageHeadingCandidateJa: '症状名ではなく、働く条件を開く',
    openingFrameJa:
      '条件窓は、病名や配慮名を正解にする場所ではなく、時間、作業、環境、情報、関係者の条件を開いて確認質問へ変える場所にする。',
    surfaceReviewQuestionsJa: [
      'lookup型の答えに戻っていないか。',
      'missing contextを読者が確認できる問いとして残しているか。',
      'source lensの弱さを公開本文で断定に変えていないか。',
    ],
  },
  {
    surface: 'consultation_case_reading_collection',
    pageHeadingCandidateJa: '相談の一文を、見立てと別解へ分ける',
    openingFrameJa:
      '相談事例集は、個別事情を公開判断へ変える場ではなく、観察、暫定見立て、反対仮説、missing context、関係者条件を分けて読む練習面にする。',
    surfaceReviewQuestionsJa: [
      '事例を助言や判定として見せていないか。',
      'counter hypothesisが十分に見えるか。',
      '個人情報や個別支援判断へ踏み込んでいないか。',
    ],
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    pageHeadingCandidateJa: 'Axiom版 仕事設計の視点候補',
    openingFrameJa:
      '仕事設計ガイドは、内部の10発見と37下部構造をそのまま並べるのではなく、読者が問題状況から解決状況へ進める仕事設計の視点と状況レベルへ再編集する。',
    surfaceReviewQuestionsJa: [
      '21という数をfinal view countとして扱っていないか。',
      '15/18/27のレイヤー差分を混ぜていないか。',
      '視点が現場の仕事条件を読む言葉になっているか。',
    ],
  },
  {
    surface: 'theory_method_trust_page',
    pageHeadingCandidateJa: '根拠・限界・レビューの扱い',
    openingFrameJa:
      '方法と信頼のページは、AIの読解力を使う場所と、人間レビューで止める場所を分けて説明し、source/support validityや公開承認を混ぜない。',
    surfaceReviewQuestionsJa: [
      'AIが最終判断者に見えていないか。',
      'source lens、currentness、public boundaryが分離されているか。',
      'review前の候補を完成知識に見せていないか。',
    ],
  },
  {
    surface: 'article_social_question_library',
    pageHeadingCandidateJa: '社会的な問いを、仕事条件へ戻す',
    openingFrameJa:
      '記事と社会的問いは、反応を集めるための主張ではなく、日常の言葉を仕事条件の構造へ戻し、反対仮説と確認質問を残す循環にする。',
    surfaceReviewQuestionsJa: [
      'SNS向きの断定や煽りに寄っていないか。',
      '社会的問いがkernelのmissing contextへ戻るか。',
      '反応を根拠や学習更新として扱っていないか。',
    ],
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    pageHeadingCandidateJa: '見立てを、図解とワークシートに変える',
    openingFrameJa:
      'ツールキットは、専門的な見立てをそのまま読ませるのではなく、場面、図解、問い、ワークシートへ翻訳し、同じ仕事条件を別の認知経路で掴めるようにする。',
    surfaceReviewQuestionsJa: [
      'ツールが診断・助言・配慮判定に見えていないか。',
      '使う人の認知負荷を下げているか。',
      '関係者条件や実装余力を消していないか。',
    ],
  },
  {
    surface: 'about_operating_boundary_page',
    pageHeadingCandidateJa: 'NBLがすること、しないこと',
    openingFrameJa:
      '運営境界ページは、NBLが仕事条件を読む支援をすること、個別判断・医療判断・法的判断・就職保証をしないことを分けて示す。',
    surfaceReviewQuestionsJa: [
      '境界説明が免責だけでなく、何を支援するかも示しているか。',
      'public approval前の候補を運営方針として断定していないか。',
      'source/support validityと公開可能性を混ぜていないか。',
    ],
  },
  {
    surface: 'scene_entry_use_cases',
    pageHeadingCandidateJa: '場面から、仕事条件の見方をつかむ',
    openingFrameJa:
      '場面から入るページは、反応獲得のSNS面ではなく、4コマ、短い場面、確認ポイントを使って、説明を読む前に仕事条件の見方をつかむ入口にする。',
    surfaceReviewQuestionsJa: [
      '4コマや場面が、説明過多を避けて問題状況を一撃で伝えているか。',
      '場面が個別助言や配慮判定に見えていないか。',
      '相談事例、視点ガイド、ツールキットへの導線が自然に残っているか。',
    ],
  },
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function draftDefinition(surface: AxiomNextNblSiteSurface): SurfaceDraftDefinition {
  const found = SURFACE_DRAFT_DEFINITIONS.find((definition) => definition.surface === surface);
  if (!found) throw new Error(`surface_draft_definition_missing:${surface}`);
  return found;
}

function selectedSeedDrafts(
  slot: AxiomWorkDesignViewBackboneSurfaceSlotCandidate,
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignViewsGuideSemanticSeedDraft[] {
  const sourceSeedIds = new Set(slot.sourceSeedDraftIds);
  return reconstruction.seedDrafts.filter((draft) => sourceSeedIds.has(draft.seedDraftId));
}

function selectedSectionDrafts(
  slot: AxiomWorkDesignViewBackboneSurfaceSlotCandidate,
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignViewsGuideSemanticSectionDraft[] {
  const sourceSectionIds = new Set(slot.sourceSectionDraftIds);
  return reconstruction.sectionDrafts.filter((section) =>
    sourceSectionIds.has(section.sectionDraftId),
  );
}

function buildBodySectionCandidate(
  surface: AxiomNextNblSiteSurface,
  section: AxiomWorkDesignViewsGuideSemanticSectionDraft,
  seedDrafts: AxiomWorkDesignViewsGuideSemanticSeedDraft[],
): AxiomWorkDesignBackboneSurfaceBodySectionCandidate {
  const sectionSeedIds = new Set(section.semanticSeedDraftIds);
  const sectionSeeds = seedDrafts.filter((draft) => sectionSeedIds.has(draft.seedDraftId));

  return {
    bodySectionCandidateId: `surface_body_section_candidate:${surface}:${section.sectionDraftId}`,
    sourceSemanticSectionDraftId: section.sectionDraftId,
    headingCandidateJa: section.headingJa,
    guidingQuestionJa: section.guidingQuestionJa,
    seedQuestionCandidatesJa: sectionSeeds.map((draft) => draft.readerQuestionCandidateJa),
    seedRoleCandidatesJa: sectionSeeds.map((draft) => draft.semanticRoleJa),
    sourceSeedDraftIds: sectionSeeds.map((draft) => draft.seedDraftId),
    reviewRoute: 'surface_body_section_review_before_public_copy',
  };
}

function buildSurfaceDraft(
  slot: AxiomWorkDesignViewBackboneSurfaceSlotCandidate,
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignBackboneSurfaceDraftCandidate {
  const definition = draftDefinition(slot.surface);
  const seedDrafts = selectedSeedDrafts(slot, reconstruction);
  const sectionDrafts = selectedSectionDrafts(slot, reconstruction);
  const bodySectionCandidates = sectionDrafts.map((section) =>
    buildBodySectionCandidate(slot.surface, section, seedDrafts),
  );

  return {
    surfaceDraftCandidateId: `surface_body_draft_candidate:${slot.surface}`,
    surface: slot.surface,
    sourcePropagationSlotCandidateId: slot.slotCandidateId,
    pageHeadingCandidateJa: definition.pageHeadingCandidateJa,
    openingThesisCandidateJa: definition.openingFrameJa,
    bodySectionCandidates,
    bodySectionCandidateCount: bodySectionCandidates.length,
    sourceSeedDraftIds: [...slot.sourceSeedDraftIds],
    sourceSectionDraftIds: [...slot.sourceSectionDraftIds],
    surfaceReviewQuestionsJa: definition.surfaceReviewQuestionsJa,
    semanticReviewStatus: 'surface_body_draft_review_required',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
    reviewRoute: 'surface_body_draft_review_before_public_page_copy',
  };
}

export function buildAxiomWorkDesignBackboneSurfaceDraftAssembly(
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction =
    buildAxiomWorkDesignViewsGuideSemanticReconstruction(),
  propagation: AxiomWorkDesignViewBackboneSurfacePropagation =
    buildAxiomWorkDesignViewBackboneSurfacePropagation(reconstruction),
): AxiomWorkDesignBackboneSurfaceDraftAssembly {
  const surfaceDrafts = propagation.surfaceSlots.map((slot) =>
    buildSurfaceDraft(slot, reconstruction),
  );

  return {
    draftAssemblyId: `axiom_work_design_backbone_surface_draft_assembly_from_${propagation.propagationId}`,
    objectType: 'axiom_work_design_backbone_surface_draft_assembly',
    contractVersion: AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_VERSION,
    lane: 'Falcon Lab',
    status: 'surface_body_draft_candidates_ready_internal',
    boundary: AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY,
    strengthensCore: AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_CORE_PROGRESS_CLASSES,
    sourceSemanticReconstructionId: reconstruction.reconstructionId,
    sourcePropagationId: propagation.propagationId,
    surfaceDraftCandidateCount: 9,
    contentSourcePolicy:
      'surface_body_drafts_from_axiom_semantic_backbone_not_falcon_public_copy',
    surfaceDrafts,
    coverage: {
      surfacesCovered: AXIOM_NEXT_NBL_SITE_SURFACES,
      representedSeedDraftIds: unique(surfaceDrafts.flatMap((draft) => draft.sourceSeedDraftIds)),
      representedSectionDraftIds: unique(
        surfaceDrafts.flatMap((draft) => draft.sourceSectionDraftIds),
      ),
      representedPropagationSlotCandidateIds: surfaceDrafts.map(
        (draft) => draft.sourcePropagationSlotCandidateId,
      ),
    },
    reviewPolicy: {
      reviewUnitScale: 'surface_body_draft_unit_not_individual_hypothesis',
      reviewRequiredBeforePublicCopy: true,
      semanticReviewRequiredBeforePublication: true,
    },
    mustNotTreatAs: [
      'public_copy',
      'public_navigation',
      'publication_approval',
      'final_view_count',
      'source_support_validity_finality',
      'candidate_pattern_promotion',
    ],
    notNow: [
      'no_public_copy_from_surface_body_drafts',
      'no_public_navigation_from_surface_body_drafts',
      'no_public_approval_or_publication',
      'no_final_view_count_from_surface_body_drafts',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...propagation.notNow,
    ],
  };
}

export function validateAxiomWorkDesignBackboneSurfaceDraftAssembly(
  draftAssembly: AxiomWorkDesignBackboneSurfaceDraftAssembly,
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction =
    buildAxiomWorkDesignViewsGuideSemanticReconstruction(),
  propagation: AxiomWorkDesignViewBackboneSurfacePropagation =
    buildAxiomWorkDesignViewBackboneSurfacePropagation(reconstruction),
): AxiomWorkDesignBackboneSurfaceDraftAssemblyValidation {
  const errors: string[] = [];
  const reconstructionValidation =
    validateAxiomWorkDesignViewsGuideSemanticReconstruction(reconstruction);
  const propagationValidation = validateAxiomWorkDesignViewBackboneSurfacePropagation(
    propagation,
    reconstruction,
  );
  const expectedSurfaceOrder = AXIOM_NEXT_NBL_SITE_SURFACES.join('|');
  const actualSurfaceOrder = draftAssembly.surfaceDrafts.map((draft) => draft.surface).join('|');
  const propagationSlotIds = new Set(
    propagation.surfaceSlots.map((slot) => slot.slotCandidateId),
  );
  const reconstructionSeedDraftIds = new Set(
    reconstruction.seedDrafts.map((draft) => draft.seedDraftId),
  );
  const reconstructionSectionDraftIds = new Set(
    reconstruction.sectionDrafts.map((section) => section.sectionDraftId),
  );

  pushIf(!reconstructionValidation.valid, errors, 'source_semantic_reconstruction_must_be_valid');
  pushIf(!propagationValidation.valid, errors, 'source_surface_propagation_must_be_valid');
  pushIf(
    draftAssembly.objectType !== 'axiom_work_design_backbone_surface_draft_assembly',
    errors,
    'object_type_must_match_work_design_backbone_surface_draft_assembly',
  );
  pushIf(draftAssembly.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    draftAssembly.status !== 'surface_body_draft_candidates_ready_internal',
    errors,
    'status_must_be_surface_body_draft_candidates_ready_internal',
  );
  pushIf(
    draftAssembly.boundary !== AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY,
    errors,
    'boundary_must_remain_internal_surface_body_drafts_not_public_copy',
  );
  pushIf(
    draftAssembly.sourceSemanticReconstructionId !== reconstruction.reconstructionId ||
      draftAssembly.sourcePropagationId !== propagation.propagationId,
    errors,
    'source_ids_must_match_reconstruction_and_propagation',
  );
  pushIf(
    draftAssembly.surfaceDraftCandidateCount !== 9 ||
      draftAssembly.surfaceDrafts.length !== 9 ||
      actualSurfaceOrder !== expectedSurfaceOrder,
    errors,
    'draft_assembly_must_cover_nine_surfaces_in_fixed_order',
  );
  pushIf(
    draftAssembly.contentSourcePolicy !==
      'surface_body_drafts_from_axiom_semantic_backbone_not_falcon_public_copy',
    errors,
    'content_source_policy_must_block_falcon_public_copy',
  );
  pushIf(
    draftAssembly.coverage.representedSeedDraftIds.length !== reconstruction.seedDrafts.length,
    errors,
    'draft_assembly_must_represent_all_semantic_seed_drafts',
  );
  pushIf(
    draftAssembly.coverage.representedSectionDraftIds.length !== reconstruction.sectionDrafts.length,
    errors,
    'draft_assembly_must_represent_all_semantic_section_drafts',
  );
  pushIf(
    draftAssembly.coverage.representedPropagationSlotCandidateIds.length !==
      propagation.surfaceSlots.length,
    errors,
    'draft_assembly_must_represent_all_propagation_slots',
  );
  pushIf(
    draftAssembly.reviewPolicy.reviewRequiredBeforePublicCopy !== true ||
      draftAssembly.reviewPolicy.semanticReviewRequiredBeforePublication !== true,
    errors,
    'review_policy_must_require_surface_body_review_before_public_copy',
  );
  pushIf(
    !draftAssembly.mustNotTreatAs.includes('public_copy') ||
      !draftAssembly.mustNotTreatAs.includes('public_navigation') ||
      !draftAssembly.mustNotTreatAs.includes('publication_approval'),
    errors,
    'must_not_treat_surface_body_drafts_as_public_copy_navigation_or_publication',
  );
  pushIf(
    !draftAssembly.notNow.includes('no_public_copy_from_surface_body_drafts') ||
      !draftAssembly.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !draftAssembly.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_public_copy_runtime_and_learning',
  );

  for (const draft of draftAssembly.surfaceDrafts) {
    pushIf(
      !propagationSlotIds.has(draft.sourcePropagationSlotCandidateId),
      errors,
      `surface_draft_unknown_propagation_slot:${draft.surface}`,
    );
    pushIf(
      draft.pageHeadingCandidateJa.trim().length < 8 ||
        draft.openingThesisCandidateJa.trim().length < 40,
      errors,
      `surface_draft_copy_too_thin:${draft.surface}`,
    );
    pushIf(
      draft.bodySectionCandidateCount !== draft.sourceSectionDraftIds.length ||
        draft.bodySectionCandidates.length !== draft.sourceSectionDraftIds.length ||
        draft.bodySectionCandidates.length === 0,
      errors,
      `surface_draft_must_have_body_section_for_each_source_section:${draft.surface}`,
    );
    pushIf(
      draft.semanticReviewStatus !== 'surface_body_draft_review_required' ||
        draft.publicUseStatus !== 'not_public_approved' ||
        draft.publicationStatus !== 'not_published' ||
        draft.reviewRoute !== 'surface_body_draft_review_before_public_page_copy',
      errors,
      `surface_draft_must_remain_review_required_not_public:${draft.surface}`,
    );
    pushIf(
      draft.surfaceReviewQuestionsJa.length !== 3,
      errors,
      `surface_draft_must_have_three_review_questions:${draft.surface}`,
    );
    for (const seedDraftId of draft.sourceSeedDraftIds) {
      pushIf(
        !reconstructionSeedDraftIds.has(seedDraftId),
        errors,
        `surface_draft_unknown_seed_draft:${draft.surface}:${seedDraftId}`,
      );
    }
    for (const sectionDraftId of draft.sourceSectionDraftIds) {
      pushIf(
        !reconstructionSectionDraftIds.has(sectionDraftId),
        errors,
        `surface_draft_unknown_section_draft:${draft.surface}:${sectionDraftId}`,
      );
    }
    for (const section of draft.bodySectionCandidates) {
      pushIf(
        section.reviewRoute !== 'surface_body_section_review_before_public_copy',
        errors,
        `surface_body_section_must_remain_review_routed:${draft.surface}:${section.bodySectionCandidateId}`,
      );
      pushIf(
        section.sourceSeedDraftIds.length === 0 ||
          section.seedQuestionCandidatesJa.length !== section.sourceSeedDraftIds.length ||
          section.seedRoleCandidatesJa.length !== section.sourceSeedDraftIds.length,
        errors,
        `surface_body_section_must_preserve_seed_questions_and_roles:${draft.surface}:${section.bodySectionCandidateId}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'work_design_backbone_surface_draft_assembly_valid'
        : 'work_design_backbone_surface_draft_assembly_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_BOUNDARY,
    strengthensCore: AXIOM_WORK_DESIGN_BACKBONE_SURFACE_DRAFT_ASSEMBLY_CORE_PROGRESS_CLASSES,
  };
}
