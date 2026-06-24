import {
  AXIOM_ALLOWED_CORE_PROGRESS_CLASSES,
  AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
  type AxiomInteractionHypothesisKernel,
} from './interactionHypothesisKernelContract';

export const AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY =
  'axiom_site_surface_slot_contract_is_kernel_display_planning_not_publication_or_public_approval' as const;

export const AXIOM_NEXT_NBL_SITE_SURFACES = [
  'reader_facing_top_home',
  'scene_entry_use_cases',
  'consultation_case_reading_collection',
  'twenty_one_views_work_design_guide',
  'article_social_question_library',
  'cognitive_support_toolkit_studio_multimodal_objects',
  'work_condition_window',
  'theory_method_trust_page',
  'about_operating_boundary_page',
] as const;

export type AxiomNextNblSiteSurface = (typeof AXIOM_NEXT_NBL_SITE_SURFACES)[number];

export const AXIOM_KERNEL_FIELD_IDS = [
  'observation',
  'inference',
  'counterHypothesis',
  'missingContext',
  'implementationActorConditions',
  'sourceLensStatus',
  'actionabilityBand',
  'cannotYetSay',
  'humanReviewRoute',
] as const;

export type AxiomKernelFieldId = (typeof AXIOM_KERNEL_FIELD_IDS)[number];

export type AxiomSurfaceSlotOperation = 'display' | 'translate' | 'hide' | 'route_to_review';

export type AxiomSurfaceSlot = {
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  publicReadableRole: string;
  reviewRequiredBeforePublication: boolean;
};

export type AxiomSurfaceSlotMap = {
  surface: AxiomNextNblSiteSurface;
  navigationRole: string;
  slots: AxiomSurfaceSlot[];
};

export type AxiomThemeObjectContract = {
  themeId: string;
  objectType: 'axiom_theme_object_surface_slot_contract';
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_display';
  status: 'non_runtime_surface_slot_contract_requires_kernel_backcast';
  sourceKernelId: string;
  sourceKernelBoundary: typeof AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY;
  boundary: typeof AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY;
  inheritedSiteCompositionStatus: 'falcon_site_composition_prior';
  contentStatus: 'axiom_content_update_required';
  kernelBackcastStatus: 'kernel_backcast_required';
  surfaces: AxiomSurfaceSlotMap[];
  movementBoundary: {
    runtime: 'not_changed';
    prompt: 'not_changed';
    retrieval: 'not_changed';
    modelProvider: 'not_changed';
    dbSchema: 'not_changed';
    publicApproval: 'not_approved';
    publication: 'not_published';
    knowledgePromotion: 'not_promoted';
  };
};

export type AxiomThemeObjectContractValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY;
  coreProgressClass: 'kernel_display';
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function slot(
  field: AxiomKernelFieldId,
  operation: AxiomSurfaceSlotOperation,
  publicReadableRole: string,
  reviewRequiredBeforePublication: boolean = true,
): AxiomSurfaceSlot {
  return {
    field,
    operation,
    publicReadableRole,
    reviewRequiredBeforePublication,
  };
}

export function buildAxiomThemeObjectSurfaceSlotFixture(
  kernel: AxiomInteractionHypothesisKernel,
): AxiomThemeObjectContract {
  const surfaces: AxiomSurfaceSlotMap[] = [
    {
      surface: 'reader_facing_top_home',
      navigationRole:
        'opens the Axiom way of reading work-condition questions without final advice',
      slots: [
        slot(
          'observation',
          'translate',
          'turns the theme into an ordinary reader-facing problem signal',
        ),
        slot(
          'inference',
          'translate',
          'shows the provisional structural reading as a question, not a conclusion',
        ),
        slot('actionabilityBand', 'display', 'keeps the page from pretending to be final advice'),
        slot('cannotYetSay', 'display', 'keeps trust limits visible'),
      ],
    },
    {
      surface: 'scene_entry_use_cases',
      navigationRole:
        'opens low-cognitive-load scene-based use cases before abstract explanation',
      slots: [
        slot('observation', 'translate', 'turns the problem signal into a concrete scene'),
        slot('inference', 'translate', 'shows the structural reading as a short scene turn'),
        slot('counterHypothesis', 'translate', 'keeps the scene from becoming a single answer'),
        slot('missingContext', 'display', 'turns the next question into the scene point'),
      ],
    },
    {
      surface: 'work_condition_window',
      navigationRole: 'uses condition categories as windows into interaction structure',
      slots: [
        slot('observation', 'display', 'shows the concrete condition signal'),
        slot('inference', 'translate', 'reframes the signal into work-contact points'),
        slot('missingContext', 'display', 'turns lookup pressure into confirmation questions'),
        slot(
          'sourceLensStatus',
          'route_to_review',
          'prevents unreviewed source status from becoming public truth',
        ),
      ],
    },
    {
      surface: 'consultation_case_reading_collection',
      navigationRole: 'shows how a case sentence becomes a structured reading',
      slots: [
        slot(
          'observation',
          'display',
          'keeps the original case signal separate from interpretation',
        ),
        slot('inference', 'display', 'shows the provisional hypothesis layer'),
        slot('counterHypothesis', 'display', 'keeps alternative readings visible'),
        slot('missingContext', 'display', 'shows next questions before advice'),
        slot(
          'implementationActorConditions',
          'display',
          'shows who must be involved before action',
        ),
      ],
    },
    {
      surface: 'twenty_one_views_work_design_guide',
      navigationRole:
        'connects kernel readings to work-design views whose count is derived by Axiom eval',
      slots: [
        slot(
          'inference',
          'translate',
          'maps provisional readings to view-level learning questions',
        ),
        slot('counterHypothesis', 'translate', 'keeps alternate routes available in the guide'),
        slot('missingContext', 'display', 'turns each view into a checkable question'),
        slot(
          'humanReviewRoute',
          'route_to_review',
          'keeps reusable view-level changes under review',
        ),
      ],
    },
    {
      surface: 'theory_method_trust_page',
      navigationRole: 'explains why the site reads work through kernel objects',
      slots: [
        slot('sourceLensStatus', 'display', 'explains source-lens strength and limits'),
        slot('actionabilityBand', 'display', 'explains provisional actionability'),
        slot('cannotYetSay', 'display', 'states finality limits'),
        slot('humanReviewRoute', 'display', 'shows where human review enters'),
      ],
    },
    {
      surface: 'article_social_question_library',
      navigationRole: 'turns kernel readings into public questions and article slots',
      slots: [
        slot('observation', 'translate', 'turns signals into article entry points'),
        slot('inference', 'translate', 'keeps articles grounded in structural hypotheses'),
        slot(
          'counterHypothesis',
          'route_to_review',
          'routes alternative public framings before publication',
        ),
        slot('cannotYetSay', 'display', 'prevents articles from overclaiming'),
      ],
    },
    {
      surface: 'cognitive_support_toolkit_studio_multimodal_objects',
      navigationRole:
        'translates kernel readings into diagrams, scenes, scripts, and multimodal teaching objects',
      slots: [
        slot('observation', 'translate', 'turns the problem signal into a scene or object'),
        slot('inference', 'translate', 'makes the interaction structure graspable'),
        slot(
          'missingContext',
          'translate',
          'turns missing context into worksheet or prompt objects',
        ),
        slot('implementationActorConditions', 'display', 'shows what each actor needs to handle'),
      ],
    },
    {
      surface: 'about_operating_boundary_page',
      navigationRole: 'states what NBL does, does not do, and how review works',
      slots: [
        slot('sourceLensStatus', 'display', 'shows why source status matters'),
        slot('actionabilityBand', 'display', 'explains non-final actionability'),
        slot('cannotYetSay', 'display', 'states non-goals and finality boundaries'),
        slot('humanReviewRoute', 'display', 'states review and approval routes'),
      ],
    },
  ];

  return {
    themeId: `axiom_theme_from_${kernel.kernelId}`,
    objectType: 'axiom_theme_object_surface_slot_contract',
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_display',
    status: 'non_runtime_surface_slot_contract_requires_kernel_backcast',
    sourceKernelId: kernel.kernelId,
    sourceKernelBoundary: kernel.boundary,
    boundary: AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY,
    inheritedSiteCompositionStatus: 'falcon_site_composition_prior',
    contentStatus: 'axiom_content_update_required',
    kernelBackcastStatus: 'kernel_backcast_required',
    surfaces: surfaces.sort(
      (a, b) =>
        AXIOM_NEXT_NBL_SITE_SURFACES.indexOf(a.surface) -
        AXIOM_NEXT_NBL_SITE_SURFACES.indexOf(b.surface),
    ),
    movementBoundary: {
      runtime: 'not_changed',
      prompt: 'not_changed',
      retrieval: 'not_changed',
      modelProvider: 'not_changed',
      dbSchema: 'not_changed',
      publicApproval: 'not_approved',
      publication: 'not_published',
      knowledgePromotion: 'not_promoted',
    },
  };
}

export function validateAxiomThemeObjectSurfaceSlotContract(
  contract: AxiomThemeObjectContract,
): AxiomThemeObjectContractValidation {
  const errors: string[] = [];
  const surfaces = contract.surfaces.map((surface) => surface.surface);
  const fieldsCovered = new Set(
    contract.surfaces.flatMap((surface) => surface.slots.map((slotItem) => slotItem.field)),
  );

  pushIf(
    contract.objectType !== 'axiom_theme_object_surface_slot_contract',
    errors,
    'object_type_must_be_axiom_theme_object_surface_slot_contract',
  );
  pushIf(contract.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    contract.coreProgressClass !== 'kernel_display',
    errors,
    'core_progress_must_be_kernel_display',
  );
  pushIf(
    !AXIOM_ALLOWED_CORE_PROGRESS_CLASSES.includes(contract.coreProgressClass),
    errors,
    'kernel_display_must_remain_allowed_axiom_core_progress_class',
  );
  pushIf(
    contract.boundary !== AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY,
    errors,
    'boundary_must_remain_surface_slot_contract_not_publication',
  );
  pushIf(
    contract.sourceKernelBoundary !== AXIOM_INTERACTION_HYPOTHESIS_KERNEL_BOUNDARY,
    errors,
    'source_kernel_boundary_must_remain_axiom_kernel_contract_boundary',
  );
  pushIf(
    contract.inheritedSiteCompositionStatus !== 'falcon_site_composition_prior' ||
      contract.contentStatus !== 'axiom_content_update_required' ||
      contract.kernelBackcastStatus !== 'kernel_backcast_required',
    errors,
    'site_composition_must_remain_prior_content_requires_kernel_backcast',
  );

  for (const surface of AXIOM_NEXT_NBL_SITE_SURFACES) {
    pushIf(!surfaces.includes(surface), errors, `surface_missing:${surface}`);
  }

  for (const surface of contract.surfaces) {
    pushIf(surface.slots.length === 0, errors, `surface_slots_required:${surface.surface}`);
    pushIf(
      surface.navigationRole.trim().length === 0,
      errors,
      `surface_navigation_role_required:${surface.surface}`,
    );
  }

  for (const field of AXIOM_KERNEL_FIELD_IDS) {
    pushIf(!fieldsCovered.has(field), errors, `kernel_field_not_mapped_to_any_surface:${field}`);
  }

  pushIf(
    contract.movementBoundary.runtime !== 'not_changed' ||
      contract.movementBoundary.prompt !== 'not_changed' ||
      contract.movementBoundary.retrieval !== 'not_changed' ||
      contract.movementBoundary.modelProvider !== 'not_changed' ||
      contract.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    contract.movementBoundary.publicApproval !== 'not_approved' ||
      contract.movementBoundary.publication !== 'not_published' ||
      contract.movementBoundary.knowledgePromotion !== 'not_promoted',
    errors,
    'public_approval_publication_or_promotion_must_not_move',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SITE_SURFACE_SLOT_CONTRACT_BOUNDARY,
    coreProgressClass: 'kernel_display',
  };
}
