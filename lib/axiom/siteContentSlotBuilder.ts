import {
  type AxiomKernelFieldId,
  type AxiomSurfaceSlotOperation,
  type AxiomThemeObjectContract,
} from './siteSurfaceSlotContract';
import { type AxiomInteractionHypothesisKernel } from './interactionHypothesisKernelContract';

export const AXIOM_SITE_CONTENT_SLOT_BOUNDARY =
  'axiom_site_content_slots_are_kernel_backed_internal_drafts_not_public_copy_or_publication' as const;

export type AxiomSiteContentSlot = {
  slotId: string;
  surface: string;
  sourceKernelId: string;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  draftStatus: 'kernel_backed_internal_draft_requires_review';
  publicUseStatus: 'not_public_approved';
  publicationStatus: 'not_published';
  reviewRequiredBeforePublication: true;
  internalDraft: string;
  publicDraft: string | null;
};

export type AxiomSiteContentSlotBundle = {
  bundleId: string;
  lane: 'Falcon Lab';
  coreProgressClass: 'kernel_display';
  status: 'kernel_backed_content_slots_internal_draft';
  sourceKernelId: string;
  sourceThemeId: string;
  boundary: typeof AXIOM_SITE_CONTENT_SLOT_BOUNDARY;
  slotCount: number;
  slots: AxiomSiteContentSlot[];
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

export type AxiomSiteContentSlotBundleValidation = {
  valid: boolean;
  validationStatus: 'contract_valid' | 'contract_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_SITE_CONTENT_SLOT_BOUNDARY;
  coreProgressClass: 'kernel_display';
};

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function fieldText(kernel: AxiomInteractionHypothesisKernel, field: AxiomKernelFieldId): string {
  switch (field) {
    case 'observation':
      return kernel.observation.map((item) => item.text).join(' / ');
    case 'inference':
      return kernel.inference.map((item) => item.text).join(' / ');
    case 'counterHypothesis':
      return kernel.counterHypothesis.map((item) => item.text).join(' / ');
    case 'missingContext':
      return kernel.missingContext.map((item) => item.question).join(' / ');
    case 'implementationActorConditions':
      return kernel.implementationActorConditions
        .map((item) => `${item.actor}: ${item.condition}`)
        .join(' / ');
    case 'sourceLensStatus':
      return Object.values(kernel.sourceLensStatus)
        .map((item) => `${item.lens}: ${item.status}; ${item.note}`)
        .join(' / ');
    case 'actionabilityBand':
      return kernel.actionabilityBand;
    case 'cannotYetSay':
      return kernel.cannotYetSay.join(' / ');
    case 'humanReviewRoute':
      return `${kernel.humanReviewRoute.routeStatus}; ${kernel.humanReviewRoute.reviewerQuestion}`;
  }
}

function draftForOperation(
  operation: AxiomSurfaceSlotOperation,
  sourceText: string,
  publicReadableRole: string,
): {
  internalDraft: string;
  publicDraft: string | null;
} {
  if (operation === 'hide') {
    return {
      internalDraft: `Hidden from this surface. Internal basis: ${sourceText}`,
      publicDraft: null,
    };
  }

  if (operation === 'route_to_review') {
    return {
      internalDraft: `Route to review before publication. Basis: ${sourceText}`,
      publicDraft: null,
    };
  }

  if (operation === 'translate') {
    return {
      internalDraft: `Translate for role "${publicReadableRole}": ${sourceText}`,
      publicDraft: `Draft requires review: ${publicReadableRole}`,
    };
  }

  return {
    internalDraft: `Display for role "${publicReadableRole}": ${sourceText}`,
    publicDraft: `Draft requires review: ${sourceText}`,
  };
}

export function buildAxiomSiteContentSlotBundle(
  kernel: AxiomInteractionHypothesisKernel,
  theme: AxiomThemeObjectContract,
): AxiomSiteContentSlotBundle {
  const slots = theme.surfaces.flatMap((surface) =>
    surface.slots.map((slotItem) => {
      const sourceText = fieldText(kernel, slotItem.field);
      const drafts = draftForOperation(slotItem.operation, sourceText, slotItem.publicReadableRole);

      return {
        slotId: `${surface.surface}:${slotItem.field}:${slotItem.operation}`,
        surface: surface.surface,
        sourceKernelId: kernel.kernelId,
        field: slotItem.field,
        operation: slotItem.operation,
        draftStatus: 'kernel_backed_internal_draft_requires_review' as const,
        publicUseStatus: 'not_public_approved' as const,
        publicationStatus: 'not_published' as const,
        reviewRequiredBeforePublication: true as const,
        internalDraft: drafts.internalDraft,
        publicDraft: drafts.publicDraft,
      };
    }),
  );

  return {
    bundleId: `axiom_site_content_slots_from_${kernel.kernelId}`,
    lane: 'Falcon Lab',
    coreProgressClass: 'kernel_display',
    status: 'kernel_backed_content_slots_internal_draft',
    sourceKernelId: kernel.kernelId,
    sourceThemeId: theme.themeId,
    boundary: AXIOM_SITE_CONTENT_SLOT_BOUNDARY,
    slotCount: slots.length,
    slots,
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

export function validateAxiomSiteContentSlotBundle(
  bundle: AxiomSiteContentSlotBundle,
  theme: AxiomThemeObjectContract,
): AxiomSiteContentSlotBundleValidation {
  const errors: string[] = [];
  const expectedSlotCount = theme.surfaces.reduce((sum, surface) => sum + surface.slots.length, 0);
  const expectedSlotIds = new Set(
    theme.surfaces.flatMap((surface) =>
      surface.slots.map((slotItem) => `${surface.surface}:${slotItem.field}:${slotItem.operation}`),
    ),
  );

  pushIf(bundle.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    bundle.coreProgressClass !== 'kernel_display',
    errors,
    'core_progress_must_be_kernel_display',
  );
  pushIf(
    bundle.status !== 'kernel_backed_content_slots_internal_draft',
    errors,
    'status_must_remain_kernel_backed_internal_draft',
  );
  pushIf(
    bundle.boundary !== AXIOM_SITE_CONTENT_SLOT_BOUNDARY,
    errors,
    'boundary_must_remain_internal_draft_not_public_copy',
  );
  pushIf(bundle.slotCount !== bundle.slots.length, errors, 'slot_count_must_match_slots_length');
  pushIf(bundle.slotCount !== expectedSlotCount, errors, 'slot_count_must_match_theme_slot_count');

  for (const slot of bundle.slots) {
    pushIf(!expectedSlotIds.has(slot.slotId), errors, `slot_not_defined_by_theme:${slot.slotId}`);
    pushIf(
      slot.draftStatus !== 'kernel_backed_internal_draft_requires_review',
      errors,
      `slot_status_must_remain_internal_draft:${slot.slotId}`,
    );
    pushIf(
      slot.publicUseStatus !== 'not_public_approved' ||
        slot.publicationStatus !== 'not_published' ||
        slot.reviewRequiredBeforePublication !== true,
      errors,
      `slot_must_not_be_public_approved_or_published:${slot.slotId}`,
    );
    pushIf(
      slot.internalDraft.trim().length === 0,
      errors,
      `slot_internal_draft_required:${slot.slotId}`,
    );
    pushIf(
      slot.operation === 'hide' && slot.publicDraft !== null,
      errors,
      `hidden_slot_must_not_have_public_draft:${slot.slotId}`,
    );
    pushIf(
      slot.operation === 'route_to_review' && slot.publicDraft !== null,
      errors,
      `review_routed_slot_must_not_have_public_draft:${slot.slotId}`,
    );
  }

  pushIf(
    bundle.movementBoundary.runtime !== 'not_changed' ||
      bundle.movementBoundary.prompt !== 'not_changed' ||
      bundle.movementBoundary.retrieval !== 'not_changed' ||
      bundle.movementBoundary.modelProvider !== 'not_changed' ||
      bundle.movementBoundary.dbSchema !== 'not_changed',
    errors,
    'runtime_prompt_retrieval_model_provider_db_schema_must_not_change',
  );
  pushIf(
    bundle.movementBoundary.publicApproval !== 'not_approved' ||
      bundle.movementBoundary.publication !== 'not_published' ||
      bundle.movementBoundary.knowledgePromotion !== 'not_promoted',
    errors,
    'public_approval_publication_or_promotion_must_not_move',
  );

  return {
    valid: errors.length === 0,
    validationStatus: errors.length === 0 ? 'contract_valid' : 'contract_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_SITE_CONTENT_SLOT_BOUNDARY,
    coreProgressClass: 'kernel_display',
  };
}
