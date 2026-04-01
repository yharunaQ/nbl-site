import { createHash } from 'node:crypto';
import type { FchmaCaseRecord, FchmaFeedbackRecord } from '@/lib/fchma/caseStore';
import runtimeCaseContractJson from '@/data/specs/ingestion/postgres-runtime-case-contract-v0.json';

export type FchmaRuntimePostgresContract = {
  version: string;
  purpose: string;
  notes: string[];
  tables: string[];
};

export type FchmaRuntimePostgresExportBundle = {
  contractVersion: string;
  generatedAt: string;
  defaultOrganization: {
    id: string;
    name: string;
    settings_json: Record<string, unknown>;
  };
  tables: {
    organizations: Array<Record<string, unknown>>;
    cases: Array<Record<string, unknown>>;
    case_inputs: Array<Record<string, unknown>>;
    case_input_fields: Array<Record<string, unknown>>;
    narrative_units: Array<Record<string, unknown>>;
    health_conditions: Array<Record<string, unknown>>;
    structural_hypotheses: Array<Record<string, unknown>>;
    intervention_hypotheses: Array<Record<string, unknown>>;
    feedback_records: Array<Record<string, unknown>>;
    outcome_measures: Array<Record<string, unknown>>;
  };
  summary: Record<string, number>;
};

export const fchmaRuntimePostgresContract =
  runtimeCaseContractJson as FchmaRuntimePostgresContract;

const defaultOrganizationId = '00000000-0000-0000-0000-000000000001';

function deterministicUuid(seed: string): string {
  const hex = createHash('sha1').update(seed).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(
    17,
    20,
  )}-${hex.slice(20, 32)}`;
}

function jsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function summarizeFeedback(feedback: FchmaFeedbackRecord): {
  improvementSignal: 'improved' | 'partial' | 'not_improved' | 'not_implemented';
  followupNeeded: boolean;
} {
  if (!feedback.implemented) {
    return { improvementSignal: 'not_implemented', followupNeeded: true };
  }
  if (feedback.observedEffect.trim() && feedback.unresolvedIssues.trim()) {
    return { improvementSignal: 'partial', followupNeeded: true };
  }
  if (feedback.observedEffect.trim()) {
    return { improvementSignal: 'improved', followupNeeded: false };
  }
  return { improvementSignal: 'not_improved', followupNeeded: true };
}

export function buildFchmaRuntimePostgresExportBundle(
  cases: FchmaCaseRecord[],
): FchmaRuntimePostgresExportBundle {
  const generatedAt = new Date().toISOString();

  const tables: FchmaRuntimePostgresExportBundle['tables'] = {
    organizations: [
      {
        id: defaultOrganizationId,
        name: 'FCHMA Runtime Seed Org',
        settings_json: {
          source: 'file_runtime_store',
          export_contract_version: fchmaRuntimePostgresContract.version,
        },
      },
    ],
    cases: [],
    case_inputs: [],
    case_input_fields: [],
    narrative_units: [],
    health_conditions: [],
    structural_hypotheses: [],
    intervention_hypotheses: [],
    feedback_records: [],
    outcome_measures: [],
  };

  for (const caseRecord of cases) {
    const caseInputId = deterministicUuid(`case-input:${caseRecord.id}`);
    const inputType = caseRecord.intakePayload.inputType ?? 'intake_form';

    tables.cases.push({
      id: caseRecord.id,
      organization_id: defaultOrganizationId,
      case_code: caseRecord.caseCode,
      title: caseRecord.title,
      status: caseRecord.status,
      primary_goal: caseRecord.primaryGoal,
      source_dataset_id: caseRecord.intakePayload.importContext?.datasetId ?? null,
      current_snapshot_json: {
        review: jsonClone(caseRecord.review),
        feedbackCount: caseRecord.feedbackRecords.length,
        sourceType: inputType,
      },
      created_by: null,
      created_at: caseRecord.createdAt,
      updated_at: caseRecord.updatedAt,
    });

    tables.case_inputs.push({
      id: caseInputId,
      case_id: caseRecord.id,
      input_type: inputType,
      source_label: caseRecord.intakePreview.caseInputDraft.sourceLabel,
      raw_text: caseRecord.intakePayload.narratives,
      structured_answers_json: jsonClone(caseRecord.intakePayload),
      provenance_json: {
        importContext: caseRecord.intakePayload.importContext ?? null,
        sourceLabel: caseRecord.intakePreview.caseInputDraft.sourceLabel,
      },
      created_by: null,
      created_at: caseRecord.createdAt,
    });

    for (const field of caseRecord.intakePreview.fieldPreviews) {
      tables.case_input_fields.push({
        id: deterministicUuid(`case-input-field:${caseRecord.id}:${field.fieldKey}`),
        case_input_id: caseInputId,
        field_key: field.fieldKey,
        source_dataset_id: caseRecord.intakePayload.importContext?.datasetId ?? null,
        canonical_concept: field.canonicalConcept,
        response_type: field.responseType,
        raw_value_text: field.rawValueText,
        value_json: {
          rawValueText: field.rawValueText,
          canonicalConcept: field.canonicalConcept,
        },
        created_at: caseRecord.createdAt,
      });
    }

    for (const narrativeUnit of caseRecord.intakePreview.narrativeUnits) {
      tables.narrative_units.push({
        id: deterministicUuid(
          `narrative-unit:${caseRecord.id}:${narrativeUnit.sourceFieldKey}:${narrativeUnit.sequenceNo}`,
        ),
        case_id: caseRecord.id,
        case_input_id: caseInputId,
        source_field_key: narrativeUnit.sourceFieldKey,
        sequence_no: narrativeUnit.sequenceNo,
        unit_type: 'free_text_field',
        raw_text: narrativeUnit.rawText,
        normalized_text: narrativeUnit.rawText,
        embedding_model: null,
        embedding_version: null,
        embedding_json: null,
        provenance_json: {
          sourceFieldKey: narrativeUnit.sourceFieldKey,
          inputType,
        },
        created_at: caseRecord.createdAt,
      });
    }

    for (const healthCondition of caseRecord.intakePreview.healthConditions) {
      const acceptedCandidate = healthCondition.normalizationCandidates[0];
      tables.health_conditions.push({
        id: deterministicUuid(`health-condition:${caseRecord.id}:${healthCondition.rawLabel}`),
        case_id: caseRecord.id,
        case_input_id: caseInputId,
        raw_label: healthCondition.rawLabel,
        normalized_label: acceptedCandidate?.preferredLabelSeed ?? null,
        health_condition_group:
          acceptedCandidate?.normalizationScope === 'non_icd_group'
            ? acceptedCandidate.preferredLabelSeed
            : null,
        icd_code: acceptedCandidate?.normalizationScope === 'icd_candidate' ? null : null,
        icd_version: null,
        normalization_confidence: null,
        source_type: healthCondition.sourceType,
        reviewer_status: 'pending',
        metadata_json: {
          normalizationCandidates: jsonClone(healthCondition.normalizationCandidates),
        },
        created_by_ai: false,
        created_at: caseRecord.createdAt,
        updated_at: caseRecord.updatedAt,
      });
    }

    for (const hypothesis of caseRecord.structurePreview.hypotheses) {
      const reviewerDecision = caseRecord.review.selectedHypotheses.includes(hypothesis.label)
        ? 'accepted'
        : caseRecord.review.reviewerDecision === 'rejected'
          ? 'rejected'
          : 'pending';

      tables.structural_hypotheses.push({
        id: deterministicUuid(`structural-hypothesis:${caseRecord.id}:${hypothesis.label}`),
        case_id: caseRecord.id,
        hypothesis_label: hypothesis.label,
        rationale: hypothesis.rationale,
        supporting_chain_ids: [],
        competing_hypotheses_json: [],
        amplifiers_json: [],
        protectors_json: [],
        intervention_points_json: jsonClone(hypothesis.interventionPoints),
        confidence: null,
        origin: 'ai',
        reviewer_decision: reviewerDecision,
        ai_run_id: null,
        created_at: caseRecord.createdAt,
        updated_at: caseRecord.updatedAt,
      });
    }

    for (const intervention of caseRecord.interventionPreview) {
      const selectedStatus = caseRecord.review.selectedInterventions.includes(intervention.title)
        ? 'selected'
        : caseRecord.review.reviewerDecision === 'rejected'
          ? 'rejected'
          : 'proposed';

      tables.intervention_hypotheses.push({
        id: deterministicUuid(`intervention:${caseRecord.id}:${intervention.title}`),
        case_id: caseRecord.id,
        linked_hypothesis_id: null,
        intervention_type: intervention.interventionType,
        target_relation_or_node: null,
        rationale: intervention.rationale,
        expected_effect: null,
        implementation_steps_json: jsonClone(intervention.implementationNotes),
        priority: null,
        feasibility: intervention.feasibility,
        risk_note: null,
        selected_status: selectedStatus,
        owner_role: intervention.ownerRole,
        ai_run_id: null,
        created_at: caseRecord.createdAt,
        updated_at: caseRecord.updatedAt,
      });
    }

    for (const feedback of caseRecord.feedbackRecords) {
      const feedbackId = feedback.id;
      const interventionId = deterministicUuid(`intervention:${caseRecord.id}:${feedback.selectedInterventionTitle}`);
      const feedbackSummary = summarizeFeedback(feedback);

      tables.feedback_records.push({
        id: feedbackId,
        case_id: caseRecord.id,
        intervention_id: interventionId,
        implemented: feedback.implemented,
        implementation_notes: feedback.implementationNotes,
        observed_effect: feedback.observedEffect,
        unresolved_issues: feedback.unresolvedIssues,
        side_effects: null,
        updated_structure_notes: feedback.updatedStructureNotes,
        reviewer_summary: feedback.reviewerSummary,
        created_by: null,
        created_at: feedback.recordedAt,
      });

      tables.outcome_measures.push({
        id: deterministicUuid(`outcome:${feedbackId}:implemented`),
        feedback_record_id: feedbackId,
        measure_name: 'implemented',
        measure_type: 'boolean',
        baseline_value: null,
        observed_value: String(feedback.implemented),
        interpretation: feedbackSummary.followupNeeded ? 'followup_needed' : 'stable',
        created_at: feedback.recordedAt,
      });

      if (feedback.observedEffect.trim()) {
        tables.outcome_measures.push({
          id: deterministicUuid(`outcome:${feedbackId}:observed_effect`),
          feedback_record_id: feedbackId,
          measure_name: 'observed_effect',
          measure_type: 'text',
          baseline_value: null,
          observed_value: feedback.observedEffect,
          interpretation: feedbackSummary.improvementSignal,
          created_at: feedback.recordedAt,
        });
      }

      if (feedback.unresolvedIssues.trim()) {
        tables.outcome_measures.push({
          id: deterministicUuid(`outcome:${feedbackId}:unresolved_issues`),
          feedback_record_id: feedbackId,
          measure_name: 'unresolved_issues',
          measure_type: 'text',
          baseline_value: null,
          observed_value: feedback.unresolvedIssues,
          interpretation: 'needs_followup',
          created_at: feedback.recordedAt,
        });
      }
    }
  }

  const summary = Object.fromEntries(
    Object.entries(tables).map(([tableName, rows]) => [tableName, rows.length]),
  );

  return {
    contractVersion: fchmaRuntimePostgresContract.version,
    generatedAt,
    defaultOrganization: {
      id: defaultOrganizationId,
      name: 'FCHMA Runtime Seed Org',
      settings_json: {
        source: 'file_runtime_store',
        export_contract_version: fchmaRuntimePostgresContract.version,
      },
    },
    tables,
    summary,
  };
}
