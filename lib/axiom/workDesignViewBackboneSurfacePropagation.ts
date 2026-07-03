import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';
import {
  buildAxiomWorkDesignViewsGuideSemanticReconstruction,
  validateAxiomWorkDesignViewsGuideSemanticReconstruction,
  type AxiomWorkDesignViewsGuideSemanticReconstruction,
  type AxiomWorkDesignViewsGuideSemanticSectionDraft,
  type AxiomWorkDesignViewsGuideSemanticSeedDraft,
} from './workDesignViewsGuideSemanticReconstruction';

export const AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY =
  'axiom_work_design_view_backbone_surface_propagation_maps_semantic_reconstruction_to_next_nbl_surfaces_without_public_copy_publication_or_final_view_count' as const;

export const AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_eval',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type SurfacePropagationDefinition = {
  surface: AxiomNextNblSiteSurface;
  propagationMode:
    | 'reader_entry_frame'
    | 'condition_window_map'
    | 'case_reading_lens'
    | 'source_work_design_views_guide'
    | 'method_and_trust_explanation'
    | 'article_question_pool'
    | 'toolkit_object_backbone'
    | 'operating_boundary_explanation'
    | 'scene_entry_use_case_route';
  operation: AxiomSurfaceSlotOperation;
  propagationRoleJa: string;
  seedSelection:
    | 'all_seed_drafts'
    | 'principal_pattern_seed_drafts'
    | 'cross_cutting_axis_seed_drafts'
    | 'source_lens_boundary_seed_drafts';
  sectionSelection: 'all_section_drafts' | 'boundary_section_only';
};

export type AxiomWorkDesignViewBackboneSurfaceSlotCandidate = {
  slotCandidateId: string;
  surface: AxiomNextNblSiteSurface;
  propagationMode: SurfacePropagationDefinition['propagationMode'];
  operation: AxiomSurfaceSlotOperation;
  propagationRoleJa: string;
  sourceSemanticReconstructionId: string;
  sourceSectionDraftIds: string[];
  sourceSeedDraftIds: string[];
  sourceSeedCount: number;
  sourceSectionCount: number;
  surfaceTranslationCandidateJa: string;
  reviewRoute: 'semantic_backbone_surface_copy_review_before_public_use';
  semanticReviewStatus: 'review_required_not_review_completed';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
};

export type AxiomWorkDesignViewBackboneSurfacePropagation = {
  propagationId: string;
  objectType: 'axiom_work_design_view_backbone_surface_propagation';
  contractVersion: typeof AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_VERSION;
  lane: 'Falcon Lab';
  status: 'semantic_backbone_surface_propagation_ready_internal';
  boundary: typeof AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY;
  strengthensCore: typeof AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_CORE_PROGRESS_CLASSES;
  sourceSemanticReconstructionId: string;
  surfaceCount: 9;
  downstreamSurfaceCount: 8;
  slotCandidateCount: 9;
  contentSourcePolicy:
    'propagate_reconstructed_work_design_view_backbone_to_surfaces_not_falcon_copy_or_public_copy';
  surfaceSlots: AxiomWorkDesignViewBackboneSurfaceSlotCandidate[];
  coverage: {
    surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
    representedSectionDraftIds: string[];
    representedSeedDraftIds: string[];
    downstreamSurfaceIds: AxiomNextNblSiteSurface[];
  };
  reviewPolicy: {
    reviewUnitScale: 'surface_backbone_slot_unit_not_individual_hypothesis';
    reviewRequiredBeforePublicUse: true;
    sourceSemanticReviewStatus: 'semantic_reconstruction_not_public_approved';
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

export type AxiomWorkDesignViewBackboneSurfacePropagationValidation = {
  valid: boolean;
  validationStatus:
    | 'work_design_view_backbone_surface_propagation_valid'
    | 'work_design_view_backbone_surface_propagation_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY;
  strengthensCore: typeof AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_CORE_PROGRESS_CLASSES;
};

const SURFACE_PROPAGATION_DEFINITIONS: SurfacePropagationDefinition[] = [
  {
    surface: 'reader_facing_top_home',
    propagationMode: 'reader_entry_frame',
    operation: 'translate',
    propagationRoleJa:
      'トップページで、病名・制度名lookupではなく仕事条件を読む入口として視点backboneを使う。',
    seedSelection: 'all_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
  {
    surface: 'work_condition_window',
    propagationMode: 'condition_window_map',
    operation: 'translate',
    propagationRoleJa:
      '条件窓で、症状や障害種別を答えではなく仕事条件へ開く問いとして使う。',
    seedSelection: 'all_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
  {
    surface: 'consultation_case_reading_collection',
    propagationMode: 'case_reading_lens',
    operation: 'display',
    propagationRoleJa:
      '相談事例を、観察・見立て・別解・確認質問へ分けて読むレンズとして使う。',
    seedSelection: 'principal_pattern_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    propagationMode: 'source_work_design_views_guide',
    operation: 'display',
    propagationRoleJa:
      '旧21視点枠を、Axiom版仕事設計視点ガイドの主対象として再構成する。',
    seedSelection: 'all_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
  {
    surface: 'theory_method_trust_page',
    propagationMode: 'method_and_trust_explanation',
    operation: 'display',
    propagationRoleJa:
      '方法・信頼ページで、15/18/27レイヤー差分とsemantic reconstruction手順を説明する。',
    seedSelection: 'source_lens_boundary_seed_drafts',
    sectionSelection: 'boundary_section_only',
  },
  {
    surface: 'article_social_question_library',
    propagationMode: 'article_question_pool',
    operation: 'translate',
    propagationRoleJa:
      '記事・社会的問いで、各視点を結論ではなく読者が考える問いとして展開する。',
    seedSelection: 'all_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    propagationMode: 'toolkit_object_backbone',
    operation: 'translate',
    propagationRoleJa:
      '図解、ワークシート、場面、マルチモーダル教材の骨格として使う。',
    seedSelection: 'principal_pattern_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
  {
    surface: 'about_operating_boundary_page',
    propagationMode: 'operating_boundary_explanation',
    operation: 'display',
    propagationRoleJa:
      'このサイトで何をしないか、公開・レビュー・source境界を示す説明として使う。',
    seedSelection: 'cross_cutting_axis_seed_drafts',
    sectionSelection: 'boundary_section_only',
  },
  {
    surface: 'scene_entry_use_cases',
    propagationMode: 'scene_entry_use_case_route',
    operation: 'translate',
    propagationRoleJa:
      '場面から入るページで、抽象説明の前に4コマ・短い場面・確認ポイントとして使う。',
    seedSelection: 'all_seed_drafts',
    sectionSelection: 'all_section_drafts',
  },
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

function selectedSeedDrafts(
  selection: SurfacePropagationDefinition['seedSelection'],
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignViewsGuideSemanticSeedDraft[] {
  if (selection === 'all_seed_drafts') return reconstruction.seedDrafts;
  if (selection === 'principal_pattern_seed_drafts') {
    return reconstruction.seedDrafts.filter(
      (draft) => draft.seedKind === 'l3_principal_interaction_pattern',
    );
  }
  if (selection === 'cross_cutting_axis_seed_drafts') {
    return reconstruction.seedDrafts.filter((draft) => draft.seedKind === 'l3_cross_cutting_axis');
  }

  return reconstruction.seedDrafts.filter((draft) =>
    ['L3-PIP-14', 'L3-CCA-22', 'L3-CCA-23', 'L3-CCA-24', 'L3-CCA-25', 'L3-CCA-26', 'L3-CCA-27'].includes(
      draft.seedId,
    ),
  );
}

function selectedSectionDrafts(
  selection: SurfacePropagationDefinition['sectionSelection'],
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignViewsGuideSemanticSectionDraft[] {
  if (selection === 'all_section_drafts') return reconstruction.sectionDrafts;

  return reconstruction.sectionDrafts.filter(
    (section) =>
      section.bridgeCandidateId === 'kernel_view_candidate_source_lens_boundary_and_counter_reading',
  );
}

function surfaceTranslationCandidateJa(
  definition: SurfacePropagationDefinition,
  seedDrafts: AxiomWorkDesignViewsGuideSemanticSeedDraft[],
  sectionDrafts: AxiomWorkDesignViewsGuideSemanticSectionDraft[],
) {
  return `${definition.propagationRoleJa} ${sectionDrafts.length} section candidates / ${seedDrafts.length} seed drafts を、public copyではなくreview-required content slot候補として受け取る。`;
}

function surfacePropagationDefinitionFor(
  surface: AxiomNextNblSiteSurface,
): SurfacePropagationDefinition {
  const definition = SURFACE_PROPAGATION_DEFINITIONS.find(
    (candidate) => candidate.surface === surface,
  );
  if (!definition) {
    throw new Error(`work_design_view_backbone_surface_propagation_definition_missing:${surface}`);
  }
  return definition;
}

function buildSurfaceSlot(
  definition: SurfacePropagationDefinition,
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction,
): AxiomWorkDesignViewBackboneSurfaceSlotCandidate {
  const seedDrafts = selectedSeedDrafts(definition.seedSelection, reconstruction);
  const sectionDrafts = selectedSectionDrafts(definition.sectionSelection, reconstruction);

  return {
    slotCandidateId: `semantic_backbone_surface_slot:${definition.surface}`,
    surface: definition.surface,
    propagationMode: definition.propagationMode,
    operation: definition.operation,
    propagationRoleJa: definition.propagationRoleJa,
    sourceSemanticReconstructionId: reconstruction.reconstructionId,
    sourceSectionDraftIds: sectionDrafts.map((section) => section.sectionDraftId),
    sourceSeedDraftIds: seedDrafts.map((draft) => draft.seedDraftId),
    sourceSeedCount: seedDrafts.length,
    sourceSectionCount: sectionDrafts.length,
    surfaceTranslationCandidateJa: surfaceTranslationCandidateJa(definition, seedDrafts, sectionDrafts),
    reviewRoute: 'semantic_backbone_surface_copy_review_before_public_use',
    semanticReviewStatus: 'review_required_not_review_completed',
    publicUseStatus: 'not_public_approved',
    publicationStatus: 'not_published',
  };
}

export function buildAxiomWorkDesignViewBackboneSurfacePropagation(
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction =
    buildAxiomWorkDesignViewsGuideSemanticReconstruction(),
): AxiomWorkDesignViewBackboneSurfacePropagation {
  const surfaceSlots = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
    buildSurfaceSlot(surfacePropagationDefinitionFor(surface), reconstruction),
  );
  const representedSectionDraftIds = unique(
    surfaceSlots.flatMap((slot) => slot.sourceSectionDraftIds),
  );
  const representedSeedDraftIds = unique(surfaceSlots.flatMap((slot) => slot.sourceSeedDraftIds));
  const downstreamSurfaceIds = surfaceSlots
    .map((slot) => slot.surface)
    .filter((surface) => surface !== 'twenty_one_views_work_design_guide');

  return {
    propagationId: `axiom_work_design_view_backbone_surface_propagation_from_${reconstruction.reconstructionId}`,
    objectType: 'axiom_work_design_view_backbone_surface_propagation',
    contractVersion: AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_VERSION,
    lane: 'Falcon Lab',
    status: 'semantic_backbone_surface_propagation_ready_internal',
    boundary: AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY,
    strengthensCore: AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_CORE_PROGRESS_CLASSES,
    sourceSemanticReconstructionId: reconstruction.reconstructionId,
    surfaceCount: 9,
    downstreamSurfaceCount: 8,
    slotCandidateCount: 9,
    contentSourcePolicy:
      'propagate_reconstructed_work_design_view_backbone_to_surfaces_not_falcon_copy_or_public_copy',
    surfaceSlots,
    coverage: {
      surfacesCovered: AXIOM_NEXT_NBL_SITE_SURFACES,
      representedSectionDraftIds,
      representedSeedDraftIds,
      downstreamSurfaceIds,
    },
    reviewPolicy: {
      reviewUnitScale: 'surface_backbone_slot_unit_not_individual_hypothesis',
      reviewRequiredBeforePublicUse: true,
      sourceSemanticReviewStatus: 'semantic_reconstruction_not_public_approved',
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
      'no_public_copy_from_surface_propagation',
      'no_public_navigation_from_surface_propagation',
      'no_public_approval_or_publication',
      'no_final_view_count_from_surface_propagation',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...reconstruction.notNow,
    ],
  };
}

export function validateAxiomWorkDesignViewBackboneSurfacePropagation(
  propagation: AxiomWorkDesignViewBackboneSurfacePropagation,
  reconstruction: AxiomWorkDesignViewsGuideSemanticReconstruction =
    buildAxiomWorkDesignViewsGuideSemanticReconstruction(),
): AxiomWorkDesignViewBackboneSurfacePropagationValidation {
  const errors: string[] = [];
  const reconstructionValidation = validateAxiomWorkDesignViewsGuideSemanticReconstruction(reconstruction);
  const surfaceIds = propagation.surfaceSlots.map((slot) => slot.surface);
  const expectedSurfaces = AXIOM_NEXT_NBL_SITE_SURFACES.join('|');
  const actualSurfaces = surfaceIds.join('|');
  const reconstructionSeedDraftIds = new Set(reconstruction.seedDrafts.map((draft) => draft.seedDraftId));
  const reconstructionSectionDraftIds = new Set(
    reconstruction.sectionDrafts.map((section) => section.sectionDraftId),
  );

  pushIf(!reconstructionValidation.valid, errors, 'source_semantic_reconstruction_must_be_valid');
  pushIf(
    propagation.objectType !== 'axiom_work_design_view_backbone_surface_propagation',
    errors,
    'object_type_must_match_work_design_view_backbone_surface_propagation',
  );
  pushIf(propagation.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    propagation.boundary !== AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY,
    errors,
    'boundary_must_remain_surface_propagation_not_public_copy_or_publication',
  );
  pushIf(
    propagation.surfaceCount !== 9 ||
      propagation.downstreamSurfaceCount !== 8 ||
      propagation.slotCandidateCount !== 9 ||
      propagation.surfaceSlots.length !== 9 ||
      actualSurfaces !== expectedSurfaces,
    errors,
    'propagation_must_cover_nine_surfaces_with_eight_downstream_surfaces_in_fixed_order',
  );
  pushIf(
    propagation.contentSourcePolicy !==
      'propagate_reconstructed_work_design_view_backbone_to_surfaces_not_falcon_copy_or_public_copy',
    errors,
    'content_source_policy_must_block_falcon_copy_and_public_copy',
  );
  pushIf(
    propagation.coverage.representedSeedDraftIds.length !== reconstruction.seedDrafts.length,
    errors,
    'propagation_must_represent_all_semantic_seed_drafts',
  );
  pushIf(
    propagation.coverage.representedSectionDraftIds.length !== reconstruction.sectionDrafts.length,
    errors,
    'propagation_must_represent_all_semantic_section_drafts',
  );
  pushIf(
    propagation.coverage.downstreamSurfaceIds.length !== 8 ||
      propagation.coverage.downstreamSurfaceIds.includes('twenty_one_views_work_design_guide'),
    errors,
    'propagation_must_identify_eight_downstream_surfaces_excluding_source_guide',
  );
  pushIf(
    propagation.reviewPolicy.reviewRequiredBeforePublicUse !== true ||
      propagation.reviewPolicy.sourceSemanticReviewStatus !==
        'semantic_reconstruction_not_public_approved',
    errors,
    'review_policy_must_require_surface_copy_review_before_public_use',
  );
  pushIf(
    !propagation.mustNotTreatAs.includes('public_copy') ||
      !propagation.mustNotTreatAs.includes('public_navigation') ||
      !propagation.mustNotTreatAs.includes('publication_approval'),
    errors,
    'must_not_treat_propagation_as_public_copy_navigation_or_publication',
  );
  pushIf(
    !propagation.notNow.includes('no_public_copy_from_surface_propagation') ||
      !propagation.notNow.includes('no_public_navigation_from_surface_propagation') ||
      !propagation.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !propagation.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_public_copy_navigation_runtime_and_learning',
  );

  for (const slot of propagation.surfaceSlots) {
    pushIf(slot.sourceSeedCount === 0, errors, `surface_slot_missing_seed_backbone:${slot.surface}`);
    pushIf(
      slot.sourceSectionCount === 0,
      errors,
      `surface_slot_missing_section_backbone:${slot.surface}`,
    );
    pushIf(
      slot.reviewRoute !== 'semantic_backbone_surface_copy_review_before_public_use' ||
        slot.semanticReviewStatus !== 'review_required_not_review_completed' ||
        slot.publicUseStatus !== 'not_public_approved' ||
        slot.publicationStatus !== 'not_published',
      errors,
      `surface_slot_must_remain_review_required_not_public:${slot.surface}`,
    );
    for (const seedDraftId of slot.sourceSeedDraftIds) {
      pushIf(
        !reconstructionSeedDraftIds.has(seedDraftId),
        errors,
        `surface_slot_unknown_seed_draft:${slot.surface}:${seedDraftId}`,
      );
    }
    for (const sectionDraftId of slot.sourceSectionDraftIds) {
      pushIf(
        !reconstructionSectionDraftIds.has(sectionDraftId),
        errors,
        `surface_slot_unknown_section_draft:${slot.surface}:${sectionDraftId}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'work_design_view_backbone_surface_propagation_valid'
        : 'work_design_view_backbone_surface_propagation_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_BOUNDARY,
    strengthensCore: AXIOM_WORK_DESIGN_VIEW_BACKBONE_SURFACE_PROPAGATION_CORE_PROGRESS_CLASSES,
  };
}
