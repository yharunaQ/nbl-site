import {
  type AxiomCoreProgressClass,
} from './interactionHypothesisKernelContract';
import {
  type AxiomRealDerivedEvidencePacket,
} from './interactionHypothesisKernelRealDerivedEvidenceProtocol';
import {
  runAxiomRealDataScaleUpIntegrationRun,
  validateAxiomRealDataScaleUpIntegrationRun,
  type AxiomRealDataScaleUpIntegrationRun,
} from './realDataScaleUpIntegrationRun';
import {
  AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES,
  buildAxiomRealDataSemanticIntegrationPolicy,
  validateAxiomRealDataSemanticIntegrationPolicy,
  type AxiomRealDataSemanticIntegrationPolicy,
  type AxiomSemanticIntegrationInputFamily,
  type AxiomSemanticIntegrationStage,
} from './realDataSemanticIntegrationPolicy';
import {
  buildAxiomSourceFamilyScaleUpWave2Attachment,
  validateAxiomSourceFamilyScaleUpWave2Attachment,
  type AxiomSourceFamilyScaleUpWave2Attachment,
  type AxiomSourceFamilyScaleUpWave2PacketMapping,
} from './sourceFamilyScaleUpWave2';

export const AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_VERSION =
  'v0_2026_06_11' as const;

export const AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY =
  'axiom_real_data_semantic_integration_run_plan_selects_real_derived_packets_for_xhigh_domain_knowledge_build_not_l3_direct_public_copy_or_runtime_change' as const;

export const AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_CORE_PROGRESS_CLASSES = [
  ...AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_POLICY_CORE_PROGRESS_CLASSES,
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomRealDataSemanticIntegrationSourcePacketSelection = {
  selectionId: string;
  packetSource: 'real_data_scale_up_integration_run' | 'source_family_scale_up_wave2';
  evidencePacketId: string;
  scenarioId: string;
  sourceFamilyLabel: string;
  semanticInputFamilies: Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>[];
  sourceLensSummary: {
    respondentData: 'present' | 'thin_or_missing' | 'bootstrap_or_not_applicable';
    supporterData: 'present' | 'thin_or_missing' | 'bootstrap_or_not_applicable';
    externalEvidence: 'present' | 'thin_or_missing' | 'bootstrap_or_not_applicable';
    implementationActorConditions: 'present' | 'thin_or_missing' | 'bootstrap_or_not_applicable';
  };
  dataBoundary: {
    rawOriginalOpened: false;
    sourceTextExported: false;
    redactedTextExported: false;
    fieldValueExported: false;
    sourceSupportValidityDecision: 'not_decided';
    publicUse: 'not_public_approved';
  };
  l3PriorUse:
    'not_input_source_only_later_contrast_coverage_gap_split_merge_rename_hold_or_naming_candidate';
};

export type AxiomRealDataSemanticIntegrationRunPlan = {
  runPlanId: string;
  objectType: 'axiom_real_data_semantic_integration_run_plan';
  contractVersion: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_VERSION;
  lane: 'Falcon Lab';
  status:
    'ready_for_xhigh_semantic_context_reading_and_integrated_knowledge_object_candidate';
  boundary: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_CORE_PROGRESS_CLASSES;
  policyId: string;
  sourceScaleUpRunId: string;
  sourceWave2AttachmentId: string;
  totalInputPacketCount: number;
  sourcePacketSelections: AxiomRealDataSemanticIntegrationSourcePacketSelection[];
  primaryReadingFamilyCoverage: Record<
    Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>,
    number
  >;
  processSequenceStageIds: AxiomSemanticIntegrationStage['stageId'][];
  xhighPasses: readonly [
    'axiom_kernel_xhigh_context_reading',
    'integrated_knowledge_object_build',
  ];
  l3PriorHandling: {
    timing: 'after_integrated_knowledge_object_candidate_build';
    allowedUses: AxiomRealDataSemanticIntegrationPolicy['sourceFamilyPolicy']['l3PriorAllowedUses'];
    prohibitedUses: AxiomRealDataSemanticIntegrationPolicy['sourceFamilyPolicy']['l3PriorProhibitedUses'];
    directContentUse: 'prohibited';
    finalViewCountFixing: 'prohibited';
  };
  pageProjectionStatus:
    'blocked_until_integrated_domain_knowledge_object_candidate_exists_and_is_review_routed';
  notNow: string[];
};

export type AxiomRealDataSemanticIntegrationRunPlanValidation = {
  valid: boolean;
  validationStatus:
    | 'real_data_semantic_integration_run_plan_valid'
    | 'real_data_semantic_integration_run_plan_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY;
  strengthensCore: typeof AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_CORE_PROGRESS_CLASSES;
};

const REQUIRED_PRIMARY_FAMILIES = [
  'survey_data',
  'workshop_summaries',
  'manuals_and_practice_documents',
  'domestic_web_cache',
  'international_web_cache',
  'stage1_scima_fchma_outputs',
  'ft03_contracts_and_reviewed_boundaries',
] as const satisfies readonly Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>[];

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function lensPresence(
  packet: AxiomRealDerivedEvidencePacket,
  lens: keyof AxiomRealDerivedEvidencePacket['sourceLensStatus'],
): 'present' | 'thin_or_missing' | 'bootstrap_or_not_applicable' {
  const status = packet.sourceLensStatus[lens].status;

  if (status === 'present_in_evidence_foundation_fixture' || status === 'present_in_synthetic_fixture') {
    return 'present';
  }
  if (status === 'thin_or_missing') {
    return 'thin_or_missing';
  }
  return 'bootstrap_or_not_applicable';
}

function familiesForScaleUpPacket(
  packetId: string,
): Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>[] {
  if (packetId.includes('web_cache_batch2')) {
    return [
      'domestic_web_cache',
      'stage1_scima_fchma_outputs',
      'ft03_contracts_and_reviewed_boundaries',
    ];
  }
  if (packetId.includes('ftcodex03')) {
    return [
      'workshop_summaries',
      'manuals_and_practice_documents',
      'stage1_scima_fchma_outputs',
      'ft03_contracts_and_reviewed_boundaries',
    ];
  }
  if (packetId.includes('jeed')) {
    return [
      'domestic_web_cache',
      'manuals_and_practice_documents',
      'stage1_scima_fchma_outputs',
      'ft03_contracts_and_reviewed_boundaries',
    ];
  }
  return [
    'survey_data',
    'stage1_scima_fchma_outputs',
    'ft03_contracts_and_reviewed_boundaries',
  ];
}

function familiesForWave2Mapping(
  mapping: AxiomSourceFamilyScaleUpWave2PacketMapping,
): Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>[] {
  switch (mapping.sourceFamilyGroup) {
    case 'respondent_survey':
      return [
        'survey_data',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
    case 'supporter_data':
      return [
        'survey_data',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
    case 'workplace_data':
      return [
        'survey_data',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
    case 'workshop_practice_knowledge':
      return [
        'workshop_summaries',
        'manuals_and_practice_documents',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
    case 'historical_2001_abc':
      return [
        'survey_data',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
    case 'international_web_cache':
      return [
        'international_web_cache',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
    default:
      return [
        'manuals_and_practice_documents',
        'stage1_scima_fchma_outputs',
        'ft03_contracts_and_reviewed_boundaries',
      ];
  }
}

function selectionFromPacket(
  packet: AxiomRealDerivedEvidencePacket,
  packetSource: AxiomRealDataSemanticIntegrationSourcePacketSelection['packetSource'],
  sourceFamilyLabel: string,
  semanticInputFamilies: Exclude<AxiomSemanticIntegrationInputFamily, 'l3_27_seed_prior'>[],
): AxiomRealDataSemanticIntegrationSourcePacketSelection {
  return {
    selectionId: `semantic_integration_selection_${packet.packetId}`,
    packetSource,
    evidencePacketId: packet.packetId,
    scenarioId: packet.scenarioId,
    sourceFamilyLabel,
    semanticInputFamilies,
    sourceLensSummary: {
      respondentData: lensPresence(packet, 'respondent_data'),
      supporterData: lensPresence(packet, 'supporter_data'),
      externalEvidence: lensPresence(packet, 'external_evidence'),
      implementationActorConditions: lensPresence(packet, 'implementation_actor_conditions'),
    },
    dataBoundary: {
      rawOriginalOpened: packet.dataPolicy.rawOriginalOpened,
      sourceTextExported: packet.dataPolicy.sourceTextExported,
      redactedTextExported: packet.dataPolicy.redactedTextExported,
      fieldValueExported: packet.dataPolicy.fieldValueExported,
      sourceSupportValidityDecision: packet.dataPolicy.sourceSupportValidityDecision,
      publicUse: packet.dataPolicy.publicUse,
    },
    l3PriorUse:
      'not_input_source_only_later_contrast_coverage_gap_split_merge_rename_hold_or_naming_candidate',
  };
}

function buildSourcePacketSelections(
  scaleUpRun: AxiomRealDataScaleUpIntegrationRun,
  wave2Attachment: AxiomSourceFamilyScaleUpWave2Attachment,
): AxiomRealDataSemanticIntegrationSourcePacketSelection[] {
  const wave2MappingsByPacketId = new Map(
    wave2Attachment.packetMappings.map((mapping) => [mapping.evidencePacketId, mapping]),
  );

  const scaleUpSelections = scaleUpRun.integratedBatchRun.runs.map((run) =>
    selectionFromPacket(
      run.evidencePacket,
      'real_data_scale_up_integration_run',
      `scale_up_integrated:${run.evidencePacket.scenarioId}`,
      familiesForScaleUpPacket(run.evidencePacket.packetId),
    ),
  );
  const wave2Selections = wave2Attachment.wave2BatchRun.runs.map((run) => {
    const mapping = wave2MappingsByPacketId.get(run.evidencePacket.packetId);

    if (!mapping) {
      throw new Error(`wave2_mapping_missing_for_semantic_integration:${run.evidencePacket.packetId}`);
    }

    return selectionFromPacket(
      run.evidencePacket,
      'source_family_scale_up_wave2',
      mapping.sourceFamilyEntryId,
      familiesForWave2Mapping(mapping),
    );
  });

  return [...scaleUpSelections, ...wave2Selections];
}

function buildFamilyCoverage(
  selections: AxiomRealDataSemanticIntegrationSourcePacketSelection[],
): AxiomRealDataSemanticIntegrationRunPlan['primaryReadingFamilyCoverage'] {
  const coverage = Object.fromEntries(
    REQUIRED_PRIMARY_FAMILIES.map((family) => [family, 0]),
  ) as AxiomRealDataSemanticIntegrationRunPlan['primaryReadingFamilyCoverage'];

  for (const selection of selections) {
    for (const family of selection.semanticInputFamilies) {
      coverage[family] += 1;
    }
  }

  return coverage;
}

export function buildAxiomRealDataSemanticIntegrationRunPlan(
  policy: AxiomRealDataSemanticIntegrationPolicy = buildAxiomRealDataSemanticIntegrationPolicy(),
  scaleUpRun: AxiomRealDataScaleUpIntegrationRun = runAxiomRealDataScaleUpIntegrationRun(),
  wave2Attachment: AxiomSourceFamilyScaleUpWave2Attachment =
    buildAxiomSourceFamilyScaleUpWave2Attachment(),
): AxiomRealDataSemanticIntegrationRunPlan {
  const selections = buildSourcePacketSelections(scaleUpRun, wave2Attachment);

  return {
    runPlanId: 'axiom_real_data_semantic_integration_run_plan_v0_2026_06_11',
    objectType: 'axiom_real_data_semantic_integration_run_plan',
    contractVersion: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_VERSION,
    lane: 'Falcon Lab',
    status: 'ready_for_xhigh_semantic_context_reading_and_integrated_knowledge_object_candidate',
    boundary: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_CORE_PROGRESS_CLASSES],
    policyId: policy.policyId,
    sourceScaleUpRunId: scaleUpRun.runId,
    sourceWave2AttachmentId: wave2Attachment.attachmentId,
    totalInputPacketCount: selections.length,
    sourcePacketSelections: selections,
    primaryReadingFamilyCoverage: buildFamilyCoverage(selections),
    processSequenceStageIds: policy.processSequence.map((stage) => stage.stageId),
    xhighPasses: [
      'axiom_kernel_xhigh_context_reading',
      'integrated_knowledge_object_build',
    ],
    l3PriorHandling: {
      timing: 'after_integrated_knowledge_object_candidate_build',
      allowedUses: policy.sourceFamilyPolicy.l3PriorAllowedUses,
      prohibitedUses: policy.sourceFamilyPolicy.l3PriorProhibitedUses,
      directContentUse: 'prohibited',
      finalViewCountFixing: 'prohibited',
    },
    pageProjectionStatus:
      'blocked_until_integrated_domain_knowledge_object_candidate_exists_and_is_review_routed',
    notNow: Array.from(
      new Set([
        'no_page_body_expansion_before_integrated_domain_knowledge_object_candidate',
        'no_l3_27_direct_public_copy',
        'no_fixed_21_or_27_final_view_count',
        'no_source_or_support_validity_decision',
        'no_candidate_pattern_movement',
        'no_runtime_prompt_retrieval_model_provider_db_schema_change',
        'no_public_approval_or_publication',
        'no_learning_update',
        ...policy.notNow,
        ...scaleUpRun.notNow,
        ...wave2Attachment.notNow,
      ]),
    ),
  };
}

export function validateAxiomRealDataSemanticIntegrationRunPlan(
  runPlan: AxiomRealDataSemanticIntegrationRunPlan,
  policy: AxiomRealDataSemanticIntegrationPolicy = buildAxiomRealDataSemanticIntegrationPolicy(),
  scaleUpRun: AxiomRealDataScaleUpIntegrationRun = runAxiomRealDataScaleUpIntegrationRun(),
  wave2Attachment: AxiomSourceFamilyScaleUpWave2Attachment =
    buildAxiomSourceFamilyScaleUpWave2Attachment(),
): AxiomRealDataSemanticIntegrationRunPlanValidation {
  const errors: string[] = [];
  const policyValidation = validateAxiomRealDataSemanticIntegrationPolicy(policy);
  const scaleUpValidation = validateAxiomRealDataScaleUpIntegrationRun(scaleUpRun);
  const wave2Validation = validateAxiomSourceFamilyScaleUpWave2Attachment(wave2Attachment);
  const expectedPacketIds = new Set([
    ...scaleUpRun.integratedBatchRun.runs.map((run) => run.evidencePacket.packetId),
    ...wave2Attachment.wave2BatchRun.runs.map((run) => run.evidencePacket.packetId),
  ]);
  const selectedPacketIds = new Set(
    runPlan.sourcePacketSelections.map((selection) => selection.evidencePacketId),
  );

  pushIf(!policyValidation.valid, errors, 'semantic_integration_policy_must_validate');
  pushIf(!scaleUpValidation.valid, errors, 'source_scale_up_run_must_validate');
  pushIf(!wave2Validation.valid, errors, 'source_wave2_attachment_must_validate');
  pushIf(
    runPlan.objectType !== 'axiom_real_data_semantic_integration_run_plan',
    errors,
    'object_type_must_be_axiom_real_data_semantic_integration_run_plan',
  );
  pushIf(runPlan.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    runPlan.status !==
      'ready_for_xhigh_semantic_context_reading_and_integrated_knowledge_object_candidate',
    errors,
    'run_plan_must_be_ready_for_xhigh_semantic_context_reading_and_integrated_object_build',
  );
  pushIf(
    runPlan.boundary !== AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY,
    errors,
    'boundary_must_block_l3_direct_public_copy_runtime_and_page_shortcut',
  );
  pushIf(
    runPlan.totalInputPacketCount !== 14 ||
      runPlan.sourcePacketSelections.length !== 14 ||
      runPlan.totalInputPacketCount !== expectedPacketIds.size,
    errors,
    'semantic_integration_run_plan_must_select_14_real_derived_packets',
  );
  for (const packetId of expectedPacketIds) {
    pushIf(!selectedPacketIds.has(packetId), errors, `semantic_selection_missing_packet:${packetId}`);
  }
  for (const family of REQUIRED_PRIMARY_FAMILIES) {
    pushIf(
      runPlan.primaryReadingFamilyCoverage[family] <= 0,
      errors,
      `primary_reading_family_missing:${family}`,
    );
  }
  pushIf(
    runPlan.sourcePacketSelections.some((selection) =>
      (selection.semanticInputFamilies as AxiomSemanticIntegrationInputFamily[]).includes(
        'l3_27_seed_prior',
      ),
    ),
    errors,
    'l3_27_seed_prior_must_not_be_selected_as_semantic_input_packet_family',
  );
  pushIf(
    runPlan.sourcePacketSelections.some(
      (selection) =>
        selection.dataBoundary.rawOriginalOpened !== false ||
        selection.dataBoundary.sourceTextExported !== false ||
        selection.dataBoundary.redactedTextExported !== false ||
        selection.dataBoundary.fieldValueExported !== false ||
        selection.dataBoundary.sourceSupportValidityDecision !== 'not_decided' ||
        selection.dataBoundary.publicUse !== 'not_public_approved',
    ),
    errors,
    'semantic_input_packets_must_keep_raw_export_validity_and_public_boundaries_closed',
  );
  pushIf(
    runPlan.processSequenceStageIds.join(',') !==
      'semantic_input_selection,axiom_kernel_xhigh_context_reading,integrated_knowledge_object_build,l3_prior_contrast_and_coverage_check,surface_projection_after_integration',
    errors,
    'process_sequence_must_keep_integration_before_l3_contrast_and_surface_projection',
  );
  pushIf(
    runPlan.xhighPasses.join(',') !==
      'axiom_kernel_xhigh_context_reading,integrated_knowledge_object_build',
    errors,
    'xhigh_passes_must_be_limited_to_context_reading_and_integrated_object_build',
  );
  pushIf(
    runPlan.l3PriorHandling.timing !== 'after_integrated_knowledge_object_candidate_build' ||
      runPlan.l3PriorHandling.directContentUse !== 'prohibited' ||
      runPlan.l3PriorHandling.finalViewCountFixing !== 'prohibited' ||
      !runPlan.l3PriorHandling.prohibitedUses.includes('direct_public_content_generation'),
    errors,
    'l3_prior_must_be_after_integration_and_prohibit_direct_content_or_fixed_count',
  );
  pushIf(
    runPlan.pageProjectionStatus !==
      'blocked_until_integrated_domain_knowledge_object_candidate_exists_and_is_review_routed',
    errors,
    'page_projection_must_wait_for_integrated_domain_knowledge_object_candidate',
  );
  pushIf(
    !runPlan.notNow.includes('no_page_body_expansion_before_integrated_domain_knowledge_object_candidate') ||
      !runPlan.notNow.includes('no_l3_27_direct_public_copy') ||
      !runPlan.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !runPlan.notNow.includes('no_learning_update'),
    errors,
    'not_now_must_block_page_l3_runtime_and_learning_movement',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'real_data_semantic_integration_run_plan_valid'
        : 'real_data_semantic_integration_run_plan_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_BOUNDARY,
    strengthensCore: [...AXIOM_REAL_DATA_SEMANTIC_INTEGRATION_RUN_PLAN_CORE_PROGRESS_CLASSES],
  };
}
