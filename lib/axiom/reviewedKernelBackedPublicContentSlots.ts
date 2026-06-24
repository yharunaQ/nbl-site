import {
  AXIOM_KERNEL_FIELD_IDS,
  AXIOM_NEXT_NBL_SITE_SURFACES,
  type AxiomKernelFieldId,
  type AxiomNextNblSiteSurface,
  type AxiomSurfaceSlotOperation,
} from './siteSurfaceSlotContract';
import {
  buildAxiomKernelCorpusHumanReviewResultReceipt,
  validateAxiomKernelCorpusHumanReviewResultReceipt,
  type AxiomKernelCorpusHumanReviewResultReceipt,
} from './kernelCorpusHumanReviewResultReceipt';
import {
  buildAxiomKernelCorpusHumanReviewTool,
  type AxiomKernelCorpusHumanReviewTool,
  type AxiomKernelCorpusHumanReviewToolDossierRow,
  type AxiomKernelCorpusHumanReviewToolUnit,
} from './kernelCorpusHumanReviewTool';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  type AxiomKernelCorpusHumanReviewMovementBoundary,
} from './kernelCorpusHumanReviewPacket';

export const AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_VERSION =
  'v0_2026_06_08' as const;

export const AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY =
  'axiom_reviewed_kernel_backed_public_content_slots_translate_founder_accepted_kernel_fields_to_next_nbl_surfaces_without_finality_publication_runtime_or_learning_movement' as const;

export const AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_CORE_PROGRESS_CLASSES = [
  'kernel_display',
  'kernel_grounding',
  'kernel_human_review_loop',
] as const satisfies readonly AxiomCoreProgressClass[];

type SurfaceDefinition = {
  surface: AxiomNextNblSiteSurface;
  navigationRoleJa: string;
  preferredScenarioIds: string[];
  preferredTitleFragmentsJa: string[];
  slots: Array<{
    field: AxiomKernelFieldId;
    operation: AxiomSurfaceSlotOperation;
    publicSlotLabelJa: string;
  }>;
};

export type AxiomReviewedKernelBackedPublicContentSlot = {
  slotId: string;
  surface: AxiomNextNblSiteSurface;
  field: AxiomKernelFieldId;
  operation: AxiomSurfaceSlotOperation;
  publicSlotLabelJa: string;
  sourceReviewUnitIds: string[];
  sourceKernelRowIds: string[];
  sourceScenarioIds: string[];
  sourceFamilyLabelsJa: string[];
  internalBasisJa: string;
  publicDraftJa: string | null;
  reviewRoute:
    | 'ready_for_public_copy_review_before_final_public_approval'
    | 'hidden_or_review_routed_before_public_copy';
  publicUseStatus: 'kernel_backed_public_interface_draft_not_public_approved';
  publicationStatus: 'not_published';
  mustNotClaim: AxiomKernelCorpusHumanReviewResultReceipt['publicInterfaceBridge']['doNotExposeAsPublicTruth'];
};

export type AxiomReviewedKernelBackedPublicSurface = {
  surface: AxiomNextNblSiteSurface;
  navigationRoleJa: string;
  sourceReviewUnitIds: string[];
  sourceKernelRowIds: string[];
  sourceScenarioIds: string[];
  sourceFamilyLabelsJa: string[];
  slotCount: number;
  slots: AxiomReviewedKernelBackedPublicContentSlot[];
  founderReviewStatus: 'accepted_as_provisional_kernel_structure';
  publicInterfaceStatus: 'ready_for_kernel_backed_public_content_slot_translation';
};

export type AxiomReviewedKernelBackedPublicContentSlotBundle = {
  bundleId: string;
  objectType: 'axiom_reviewed_kernel_backed_public_content_slot_bundle';
  contractVersion: typeof AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_VERSION;
  lane: 'Falcon Lab';
  status: 'reviewed_kernel_backed_public_content_slots_ready_internal';
  boundary: typeof AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY;
  strengthensCore: typeof AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_CORE_PROGRESS_CLASSES;
  sourceToolId: string;
  sourceReviewResultReceiptId: string;
  sourceReviewResultStatus: AxiomKernelCorpusHumanReviewResultReceipt['status'];
  sourceReviewResultOverallDecision: AxiomKernelCorpusHumanReviewResultReceipt['overallDecision'];
  surfaceCount: 9;
  slotCount: number;
  sourceKernelRowCount: 15;
  sourceReviewUnitCount: 18;
  coverage: {
    surfacesCovered: typeof AXIOM_NEXT_NBL_SITE_SURFACES;
    kernelFieldsCovered: typeof AXIOM_KERNEL_FIELD_IDS;
    coveredKernelRowIds: string[];
    coveredScenarioIds: string[];
  };
  surfaces: AxiomReviewedKernelBackedPublicSurface[];
  publicInterfaceBridge: AxiomKernelCorpusHumanReviewResultReceipt['publicInterfaceBridge'];
  movementBoundary: AxiomKernelCorpusHumanReviewMovementBoundary;
  notNow: string[];
};

export type AxiomReviewedKernelBackedPublicContentSlotBundleValidation = {
  valid: boolean;
  validationStatus:
    | 'reviewed_kernel_backed_public_content_slot_bundle_valid'
    | 'reviewed_kernel_backed_public_content_slot_bundle_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY;
  strengthensCore: typeof AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_CORE_PROGRESS_CLASSES;
};

const SURFACE_DEFINITIONS: SurfaceDefinition[] = [
  {
    surface: 'reader_facing_top_home',
    navigationRoleJa: '読者に、病名や制度名lookupではなく相互作用として読む入口を示す。',
    preferredScenarioIds: [
      'l3_health_time_accommodation_lookup_trap_v0',
      'l3_public_condition_window_non_lookup_v0',
    ],
    preferredTitleFragmentsJa: ['Kernelの基本契約', '横断チェック'],
    slots: [
      { field: 'observation', operation: 'translate', publicSlotLabelJa: '入口の問題信号' },
      { field: 'inference', operation: 'translate', publicSlotLabelJa: '暫定的な読み筋' },
      { field: 'actionabilityBand', operation: 'display', publicSlotLabelJa: '今使える範囲' },
      { field: 'cannotYetSay', operation: 'display', publicSlotLabelJa: 'まだ言えないこと' },
    ],
  },
  {
    surface: 'scene_entry_use_cases',
    navigationRoleJa: '4コマと場面から入り、抽象説明より先に問題状況と見方の転換をつかむ。',
    preferredScenarioIds: [
      'l3_public_condition_window_non_lookup_v0',
      'l3_health_time_accommodation_lookup_trap_v0',
    ],
    preferredTitleFragmentsJa: ['横断チェック', '実装主体条件'],
    slots: [
      { field: 'observation', operation: 'translate', publicSlotLabelJa: '4コマの場面' },
      { field: 'inference', operation: 'translate', publicSlotLabelJa: '場面の読み替え' },
      { field: 'counterHypothesis', operation: 'translate', publicSlotLabelJa: '別の見方' },
      { field: 'missingContext', operation: 'display', publicSlotLabelJa: '次に確認すること' },
    ],
  },
  {
    surface: 'work_condition_window',
    navigationRoleJa: '症状・制度名ではなく、働く条件の窓として困りごとを読む。',
    preferredScenarioIds: ['l3_public_condition_window_non_lookup_v0'],
    preferredTitleFragmentsJa: ['Source lens', 'Actionability'],
    slots: [
      { field: 'observation', operation: 'display', publicSlotLabelJa: '条件の観察' },
      { field: 'inference', operation: 'translate', publicSlotLabelJa: '働く条件への翻訳' },
      { field: 'missingContext', operation: 'display', publicSlotLabelJa: '確認質問' },
      { field: 'sourceLensStatus', operation: 'route_to_review', publicSlotLabelJa: '根拠lens確認' },
    ],
  },
  {
    surface: 'consultation_case_reading_collection',
    navigationRoleJa: '相談事例の一文を、観察・推論・別解・確認質問へ分けて読む。',
    preferredScenarioIds: [
      'l3_health_time_accommodation_lookup_trap_v0',
      'l3_disclosure_information_procedure_boundary_v0',
    ],
    preferredTitleFragmentsJa: ['Kernelの基本契約', '実装主体条件'],
    slots: [
      { field: 'observation', operation: 'display', publicSlotLabelJa: '相談で見えていること' },
      { field: 'inference', operation: 'display', publicSlotLabelJa: '暫定見立て' },
      { field: 'counterHypothesis', operation: 'display', publicSlotLabelJa: '別の読み' },
      { field: 'missingContext', operation: 'display', publicSlotLabelJa: '次に確認すること' },
      { field: 'implementationActorConditions', operation: 'display', publicSlotLabelJa: '関係者条件' },
    ],
  },
  {
    surface: 'twenty_one_views_work_design_guide',
    navigationRoleJa:
      '旧21視点枠を、Axiom evalで導出・再編される仕事条件視点群として使う。',
    preferredScenarioIds: ['l3_post_hiring_quality_evaluation_loop_v0'],
    preferredTitleFragmentsJa: ['L3 21/27 bootstrap prior', 'Review-driven promotion'],
    slots: [
      { field: 'inference', operation: 'translate', publicSlotLabelJa: '視点ごとの問い' },
      { field: 'counterHypothesis', operation: 'translate', publicSlotLabelJa: '代替視点' },
      { field: 'missingContext', operation: 'display', publicSlotLabelJa: '確認すべき文脈' },
      { field: 'humanReviewRoute', operation: 'route_to_review', publicSlotLabelJa: '視点更新review' },
    ],
  },
  {
    surface: 'theory_method_trust_page',
    navigationRoleJa: 'Axiomが何を根拠に、どこまでしか言わないかを説明する。',
    preferredScenarioIds: ['l3_policy_service_coordination_source_lens_v0'],
    preferredTitleFragmentsJa: ['Source lens', 'Cannot-yet-say', 'Review-driven promotion'],
    slots: [
      { field: 'sourceLensStatus', operation: 'display', publicSlotLabelJa: '根拠lens' },
      { field: 'actionabilityBand', operation: 'display', publicSlotLabelJa: '暫定利用範囲' },
      { field: 'cannotYetSay', operation: 'display', publicSlotLabelJa: '方法上の限界' },
      { field: 'humanReviewRoute', operation: 'display', publicSlotLabelJa: '人間レビュー経路' },
    ],
  },
  {
    surface: 'article_social_question_library',
    navigationRoleJa: '記事や社会的問いを、結論ではなく構造的な問いとして流通させる。',
    preferredScenarioIds: [
      'l3_disclosure_information_procedure_boundary_v0',
      'l3_policy_service_coordination_source_lens_v0',
    ],
    preferredTitleFragmentsJa: ['横断チェック', 'Cannot-yet-say'],
    slots: [
      { field: 'observation', operation: 'translate', publicSlotLabelJa: '記事の入口' },
      { field: 'inference', operation: 'translate', publicSlotLabelJa: '構造仮説' },
      { field: 'counterHypothesis', operation: 'route_to_review', publicSlotLabelJa: '別フレーミングreview' },
      { field: 'cannotYetSay', operation: 'display', publicSlotLabelJa: '過剰主張の抑制' },
    ],
  },
  {
    surface: 'cognitive_support_toolkit_studio_multimodal_objects',
    navigationRoleJa: 'kernelの見立てを、図解・ワークシート・相談補助オブジェクトへ翻訳する。',
    preferredScenarioIds: ['l3_post_hiring_quality_evaluation_loop_v0'],
    preferredTitleFragmentsJa: ['実装主体条件', 'Kernelの基本契約'],
    slots: [
      { field: 'observation', operation: 'translate', publicSlotLabelJa: '図解の場面' },
      { field: 'inference', operation: 'translate', publicSlotLabelJa: '相互作用構造' },
      { field: 'missingContext', operation: 'translate', publicSlotLabelJa: 'ワークシートの問い' },
      { field: 'implementationActorConditions', operation: 'display', publicSlotLabelJa: '関係者の作業条件' },
    ],
  },
  {
    surface: 'about_operating_boundary_page',
    navigationRoleJa: 'NBLがすること、しないこと、レビューで止めることを明確にする。',
    preferredScenarioIds: ['l3_policy_service_coordination_source_lens_v0'],
    preferredTitleFragmentsJa: ['Source lens', 'Cannot-yet-say', 'Review-driven promotion'],
    slots: [
      { field: 'sourceLensStatus', operation: 'display', publicSlotLabelJa: 'sourceの扱い' },
      { field: 'actionabilityBand', operation: 'display', publicSlotLabelJa: '助言ではない利用範囲' },
      { field: 'cannotYetSay', operation: 'display', publicSlotLabelJa: '非対応・未決領域' },
      { field: 'humanReviewRoute', operation: 'display', publicSlotLabelJa: 'レビューと承認の境界' },
    ],
  },
];

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) {
    errors.push(error);
  }
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function surfaceDefinitionFor(surface: AxiomNextNblSiteSurface): SurfaceDefinition {
  const definition = SURFACE_DEFINITIONS.find((candidate) => candidate.surface === surface);
  if (!definition) {
    throw new Error(`reviewed_kernel_backed_public_surface_definition_missing:${surface}`);
  }
  return definition;
}

function allRows(units: AxiomKernelCorpusHumanReviewToolUnit[]) {
  const byRowId = new Map<string, AxiomKernelCorpusHumanReviewToolDossierRow>();
  for (const unit of units) {
    for (const row of unit.reviewDossier.rows) {
      byRowId.set(row.rowId, row);
    }
  }

  return Array.from(byRowId.values());
}

function matchingUnits(
  definition: SurfaceDefinition,
  units: AxiomKernelCorpusHumanReviewToolUnit[],
) {
  const preferred = units.filter((unit) => {
    const title = unit.reviewDossier.titleJa;
    const scenarioMatches = unit.scenarioIds.some((scenarioId) =>
      definition.preferredScenarioIds.includes(scenarioId),
    );
    const titleMatches = definition.preferredTitleFragmentsJa.some((fragment) =>
      title.includes(fragment),
    );

    return scenarioMatches || titleMatches;
  });

  return preferred.length > 0 ? preferred : units.slice(0, 2);
}

function matchingRows(
  definition: SurfaceDefinition,
  units: AxiomKernelCorpusHumanReviewToolUnit[],
) {
  const rows = allRows(matchingUnits(definition, units));
  const preferredRows = rows.filter((row) =>
    definition.preferredScenarioIds.includes(row.scenarioId),
  );

  return preferredRows.length > 0 ? preferredRows : rows;
}

function valuesForField(
  field: AxiomKernelFieldId,
  rows: AxiomKernelCorpusHumanReviewToolDossierRow[],
  sourceReviewUnitIds: string[],
) {
  if (field === 'observation') {
    return rows.flatMap((row) => row.observations);
  }
  if (field === 'inference') {
    return rows.map((row) => row.inference);
  }
  if (field === 'counterHypothesis') {
    return rows.flatMap((row) => row.counterHypotheses);
  }
  if (field === 'missingContext') {
    return rows.flatMap((row) => row.missingContextQuestions);
  }
  if (field === 'implementationActorConditions') {
    return rows.flatMap((row) => row.implementationActorConditions);
  }
  if (field === 'sourceLensStatus') {
    return rows.flatMap((row) => row.sourceLensStatusSummary);
  }
  if (field === 'actionabilityBand') {
    return unique(rows.map((row) => row.actionabilityBand));
  }
  if (field === 'cannotYetSay') {
    return rows.flatMap((row) => row.cannotYetSay);
  }

  return sourceReviewUnitIds.map(
    (sourceReviewUnitId) =>
      `Founder accepted ${sourceReviewUnitId} as provisional kernel structure; public copy still requires surface review before final approval.`,
  );
}

function compactBasis(values: string[], fallback: string) {
  const compacted = unique(values).slice(0, 3);

  return compacted.length > 0 ? compacted.join(' / ') : fallback;
}

function publicDraftForSlot(
  definition: SurfaceDefinition,
  slot: SurfaceDefinition['slots'][number],
  basis: string,
) {
  if (slot.operation === 'hide') {
    return null;
  }
  if (slot.operation === 'route_to_review') {
    return null;
  }

  if (slot.operation === 'translate') {
    return `${definition.navigationRoleJa} ${slot.publicSlotLabelJa}: ${basis}`;
  }

  return `${slot.publicSlotLabelJa}: ${basis}`;
}

function collectSourceFamilyLabels(rows: AxiomKernelCorpusHumanReviewToolDossierRow[]) {
  return unique(rows.flatMap((row) => row.sourceFamilyLabelsJa));
}

function collectSourceScenarioIds(rows: AxiomKernelCorpusHumanReviewToolDossierRow[]) {
  return unique(rows.map((row) => row.scenarioId));
}

function collectRowIds(rows: AxiomKernelCorpusHumanReviewToolDossierRow[]) {
  return unique(rows.map((row) => row.rowId));
}

function buildSurface(
  definition: SurfaceDefinition,
  tool: AxiomKernelCorpusHumanReviewTool,
  receipt: AxiomKernelCorpusHumanReviewResultReceipt,
): AxiomReviewedKernelBackedPublicSurface {
  const units = matchingUnits(definition, tool.units);
  const rows = matchingRows(definition, tool.units);
  const sourceReviewUnitIds = unique(units.map((unit) => unit.sourceReviewUnitId));
  const sourceKernelRowIds = collectRowIds(rows);
  const sourceScenarioIds = collectSourceScenarioIds(rows);
  const sourceFamilyLabelsJa = collectSourceFamilyLabels(rows);
  const mustNotClaim = receipt.publicInterfaceBridge.doNotExposeAsPublicTruth;
  const slots = definition.slots.map((slot) => {
    const basis = compactBasis(
      valuesForField(slot.field, rows, sourceReviewUnitIds),
      `No public-facing value prepared for ${slot.field}; route back to kernel review.`,
    );
    const publicDraftJa = publicDraftForSlot(definition, slot, basis);

    return {
      slotId: `${definition.surface}:${slot.field}:${slot.operation}`,
      surface: definition.surface,
      field: slot.field,
      operation: slot.operation,
      publicSlotLabelJa: slot.publicSlotLabelJa,
      sourceReviewUnitIds,
      sourceKernelRowIds,
      sourceScenarioIds,
      sourceFamilyLabelsJa,
      internalBasisJa: basis,
      publicDraftJa,
      reviewRoute:
        publicDraftJa === null
          ? 'hidden_or_review_routed_before_public_copy'
          : 'ready_for_public_copy_review_before_final_public_approval',
      publicUseStatus: 'kernel_backed_public_interface_draft_not_public_approved',
      publicationStatus: 'not_published',
      mustNotClaim,
    } satisfies AxiomReviewedKernelBackedPublicContentSlot;
  });

  return {
    surface: definition.surface,
    navigationRoleJa: definition.navigationRoleJa,
    sourceReviewUnitIds,
    sourceKernelRowIds,
    sourceScenarioIds,
    sourceFamilyLabelsJa,
    slotCount: slots.length,
    slots,
    founderReviewStatus: 'accepted_as_provisional_kernel_structure',
    publicInterfaceStatus: 'ready_for_kernel_backed_public_content_slot_translation',
  };
}

export function buildAxiomReviewedKernelBackedPublicContentSlotBundle(
  tool: AxiomKernelCorpusHumanReviewTool = buildAxiomKernelCorpusHumanReviewTool(),
  receipt: AxiomKernelCorpusHumanReviewResultReceipt =
    buildAxiomKernelCorpusHumanReviewResultReceipt(tool),
): AxiomReviewedKernelBackedPublicContentSlotBundle {
  const surfaces = AXIOM_NEXT_NBL_SITE_SURFACES.map((surface) =>
    buildSurface(surfaceDefinitionFor(surface), tool, receipt),
  );
  const coveredKernelRowIds = unique(surfaces.flatMap((surface) => surface.sourceKernelRowIds));
  const coveredScenarioIds = unique(surfaces.flatMap((surface) => surface.sourceScenarioIds));

  return {
    bundleId: `axiom_reviewed_kernel_backed_public_content_slots_from_${receipt.receiptId}`,
    objectType: 'axiom_reviewed_kernel_backed_public_content_slot_bundle',
    contractVersion: AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_VERSION,
    lane: 'Falcon Lab',
    status: 'reviewed_kernel_backed_public_content_slots_ready_internal',
    boundary: AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY,
    strengthensCore: [...AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_CORE_PROGRESS_CLASSES],
    sourceToolId: tool.toolId,
    sourceReviewResultReceiptId: receipt.receiptId,
    sourceReviewResultStatus: receipt.status,
    sourceReviewResultOverallDecision: receipt.overallDecision,
    surfaceCount: 9,
    slotCount: surfaces.reduce((sum, surface) => sum + surface.slotCount, 0),
    sourceKernelRowCount: 15,
    sourceReviewUnitCount: 18,
    coverage: {
      surfacesCovered: [...AXIOM_NEXT_NBL_SITE_SURFACES],
      kernelFieldsCovered: [...AXIOM_KERNEL_FIELD_IDS],
      coveredKernelRowIds,
      coveredScenarioIds,
    },
    surfaces,
    publicInterfaceBridge: receipt.publicInterfaceBridge,
    movementBoundary: { ...receipt.movementBoundary },
    notNow: [
      'no_final_source_support_validity_claim',
      'no_candidate_pattern_promotion',
      'no_individual_case_final_judgment',
      'no_raw_sensitive_source_text_or_field_values_export',
      'no_public_approval_or_publication_execution_from_this_bundle',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
    ],
  };
}

export function validateAxiomReviewedKernelBackedPublicContentSlotBundle(
  bundle: AxiomReviewedKernelBackedPublicContentSlotBundle,
  tool: AxiomKernelCorpusHumanReviewTool = buildAxiomKernelCorpusHumanReviewTool(),
  receipt: AxiomKernelCorpusHumanReviewResultReceipt =
    buildAxiomKernelCorpusHumanReviewResultReceipt(tool),
): AxiomReviewedKernelBackedPublicContentSlotBundleValidation {
  const errors: string[] = [];
  const receiptValidation = validateAxiomKernelCorpusHumanReviewResultReceipt(receipt, tool);
  const expectedSurfaceOrder = AXIOM_NEXT_NBL_SITE_SURFACES.join('|');
  const actualSurfaceOrder = bundle.surfaces.map((surface) => surface.surface).join('|');
  const sourceRowIds = new Set(allRows(tool.units).map((row) => row.rowId));
  const allSlotFields = new Set(bundle.surfaces.flatMap((surface) => surface.slots.map((slot) => slot.field)));

  pushIf(!receiptValidation.valid, errors, 'source_founder_review_receipt_must_be_valid');
  pushIf(
    bundle.objectType !== 'axiom_reviewed_kernel_backed_public_content_slot_bundle',
    errors,
    'object_type_must_match_reviewed_kernel_backed_public_content_slot_bundle',
  );
  pushIf(
    bundle.contractVersion !== AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_VERSION,
    errors,
    'contract_version_must_match_reviewed_kernel_backed_public_content_slots_v0_2026_06_08',
  );
  pushIf(bundle.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    bundle.status !== 'reviewed_kernel_backed_public_content_slots_ready_internal',
    errors,
    'status_must_be_reviewed_kernel_backed_public_content_slots_ready_internal',
  );
  pushIf(
    bundle.boundary !== AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY,
    errors,
    'boundary_must_translate_reviewed_kernel_without_finality_publication_runtime_or_learning',
  );
  pushIf(bundle.sourceToolId !== tool.toolId, errors, 'source_tool_id_mismatch');
  pushIf(
    bundle.sourceReviewResultReceiptId !== receipt.receiptId ||
      bundle.sourceReviewResultStatus !== receipt.status ||
      bundle.sourceReviewResultOverallDecision !== receipt.overallDecision,
    errors,
    'source_review_result_trace_mismatch',
  );
  pushIf(
    bundle.surfaceCount !== 9 ||
      bundle.surfaces.length !== 9 ||
      actualSurfaceOrder !== expectedSurfaceOrder,
    errors,
    'bundle_must_cover_nine_next_nbl_surfaces_in_fixed_order',
  );
  pushIf(
    bundle.sourceKernelRowCount !== 15 ||
      bundle.coverage.coveredKernelRowIds.length !== 15 ||
      bundle.coverage.coveredKernelRowIds.some((rowId) => !sourceRowIds.has(rowId)),
    errors,
    'bundle_must_cover_all_15_kernel_rows',
  );
  pushIf(
    bundle.sourceReviewUnitCount !== 18,
    errors,
    'bundle_must_trace_to_18_founder_accepted_review_units',
  );
  pushIf(bundle.slotCount <= 0, errors, 'slot_count_must_be_positive');
  pushIf(
    bundle.slotCount !== bundle.surfaces.reduce((sum, surface) => sum + surface.slotCount, 0),
    errors,
    'slot_count_must_match_surface_slot_counts',
  );
  for (const field of AXIOM_KERNEL_FIELD_IDS) {
    pushIf(!allSlotFields.has(field), errors, `kernel_field_not_mapped:${field}`);
  }

  for (const surface of bundle.surfaces) {
    pushIf(surface.slotCount !== surface.slots.length, errors, `surface_slot_count_mismatch:${surface.surface}`);
    pushIf(surface.sourceReviewUnitIds.length === 0, errors, `surface_missing_review_units:${surface.surface}`);
    pushIf(surface.sourceKernelRowIds.length === 0, errors, `surface_missing_kernel_rows:${surface.surface}`);
    pushIf(surface.sourceScenarioIds.length === 0, errors, `surface_missing_scenarios:${surface.surface}`);
    pushIf(surface.sourceFamilyLabelsJa.length === 0, errors, `surface_missing_source_families:${surface.surface}`);
    pushIf(
      surface.founderReviewStatus !== 'accepted_as_provisional_kernel_structure' ||
        surface.publicInterfaceStatus !== 'ready_for_kernel_backed_public_content_slot_translation',
      errors,
      `surface_must_be_founder_accepted_and_ready_for_slot_translation:${surface.surface}`,
    );
    for (const slot of surface.slots) {
      pushIf(slot.surface !== surface.surface, errors, `slot_surface_mismatch:${slot.slotId}`);
      pushIf(
        !receipt.publicInterfaceBridge.allowedPublicTranslationFields.includes(slot.field),
        errors,
        `slot_field_not_allowed_by_founder_receipt:${slot.slotId}`,
      );
      pushIf(
        slot.sourceReviewUnitIds.length === 0 || slot.sourceKernelRowIds.length === 0,
        errors,
        `slot_must_trace_to_review_units_and_kernel_rows:${slot.slotId}`,
      );
      pushIf(slot.internalBasisJa.trim().length === 0, errors, `slot_internal_basis_required:${slot.slotId}`);
      pushIf(
        (slot.operation === 'hide' || slot.operation === 'route_to_review') &&
          slot.publicDraftJa !== null,
        errors,
        `hidden_or_review_routed_slot_must_not_have_public_draft:${slot.slotId}`,
      );
      pushIf(
        (slot.operation === 'display' || slot.operation === 'translate') &&
          (slot.publicDraftJa === null || slot.publicDraftJa.trim().length === 0),
        errors,
        `display_or_translate_slot_must_have_review_required_public_draft:${slot.slotId}`,
      );
      pushIf(
        slot.publicUseStatus !== 'kernel_backed_public_interface_draft_not_public_approved' ||
          slot.publicationStatus !== 'not_published',
        errors,
        `slot_must_not_be_public_approved_or_published:${slot.slotId}`,
      );
      pushIf(
        slot.mustNotClaim.join('|') !==
          receipt.publicInterfaceBridge.doNotExposeAsPublicTruth.join('|'),
        errors,
        `slot_must_carry_public_truth_exclusions:${slot.slotId}`,
      );
    }
  }

  pushIf(
    bundle.publicInterfaceBridge.nextAllowedStep !==
      'build_kernel_backed_public_content_slots_from_reviewed_kernel_fields',
    errors,
    'bundle_must_follow_founder_receipt_public_interface_bridge',
  );
  pushIf(
    bundle.movementBoundary.runtime !== 'not_changed' ||
      bundle.movementBoundary.prompt !== 'not_changed' ||
      bundle.movementBoundary.retrieval !== 'not_changed' ||
      bundle.movementBoundary.modelProvider !== 'not_changed' ||
      bundle.movementBoundary.dbSchema !== 'not_changed' ||
      bundle.movementBoundary.sourceValidity !== 'not_decided' ||
      bundle.movementBoundary.supportValidity !== 'not_decided' ||
      bundle.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      bundle.movementBoundary.publicApproved !== 'not_approved' ||
      bundle.movementBoundary.publicRelease !== 'not_approved' ||
      bundle.movementBoundary.publication !== 'not_published' ||
      bundle.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      bundle.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'movement_boundary_must_not_move_finality_publication_runtime_promotion_or_learning',
  );
  pushIf(
    !bundle.notNow.includes('no_final_source_support_validity_claim') ||
      !bundle.notNow.includes('no_candidate_pattern_promotion') ||
      !bundle.notNow.includes('no_individual_case_final_judgment') ||
      !bundle.notNow.includes('no_raw_sensitive_source_text_or_field_values_export') ||
      !bundle.notNow.includes('no_public_approval_or_publication_execution_from_this_bundle') ||
      !bundle.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !bundle.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_finality_publication_runtime_learning_and_sensitive_source_export',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'reviewed_kernel_backed_public_content_slot_bundle_valid'
        : 'reviewed_kernel_backed_public_content_slot_bundle_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_BOUNDARY,
    strengthensCore: [...AXIOM_REVIEWED_KERNEL_BACKED_PUBLIC_CONTENT_SLOTS_CORE_PROGRESS_CLASSES],
  };
}
