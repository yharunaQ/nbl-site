import type { FchmaTableMetadata } from '@/lib/fchma/types';

export const fchmaInitialTableMetadata: FchmaTableMetadata[] = [
  {
    name: 'organizations',
    stage: 'core',
    purpose: 'Tenant-level settings and ownership for case work.',
    columns: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary key.' },
      { name: 'name', type: 'text', required: true, description: 'Organization display name.' },
      {
        name: 'settings_json',
        type: 'jsonb',
        description: 'Model policy, display settings, and organization defaults.',
      },
    ],
  },
  {
    name: 'app_users',
    stage: 'core',
    purpose: 'Reviewer and case worker accounts scoped to an organization.',
    columns: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary key.' },
      {
        name: 'organization_id',
        type: 'uuid',
        required: true,
        description: 'Owning organization.',
      },
      { name: 'role', type: 'text', required: true, description: 'User role.' },
      { name: 'display_name', type: 'text', required: true, description: 'Display label.' },
    ],
  },
  {
    name: 'cases',
    stage: 'core',
    purpose: 'Top-level consultation unit for the full intake-analysis-planning-feedback loop.',
    columns: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary key.' },
      { name: 'case_code', type: 'text', required: true, description: 'Stable case identifier.' },
      { name: 'status', type: 'text', required: true, description: 'Loop stage status.' },
      { name: 'primary_goal', type: 'text', description: 'Primary support goal or concern.' },
      {
        name: 'current_snapshot_json',
        type: 'jsonb',
        description: 'Current UI snapshot aggregated from reviewed data.',
      },
    ],
  },
  {
    name: 'case_inputs',
    stage: 'core',
    purpose: 'Raw input artifacts for cases, including forms, notes, uploads, and survey imports.',
    columns: [
      { name: 'id', type: 'uuid', required: true, description: 'Primary key.' },
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      {
        name: 'input_type',
        type: 'text',
        required: true,
        description: 'Input source category.',
      },
      { name: 'raw_text', type: 'text', description: 'Original unstructured text when present.' },
      {
        name: 'structured_answers_json',
        type: 'jsonb',
        description: 'Form answers or imported survey payload.',
      },
    ],
  },
  {
    name: 'case_input_fields',
    stage: 'core',
    purpose: 'Normalized field-level representation tied to response type maps and canonical concepts.',
    columns: [
      { name: 'case_input_id', type: 'uuid', required: true, description: 'Parent input.' },
      { name: 'field_key', type: 'text', required: true, description: 'Source field name.' },
      {
        name: 'response_type',
        type: 'text',
        required: true,
        description: 'Meaning type such as ordinal, multiselect, or free_text.',
      },
      {
        name: 'canonical_concept',
        type: 'text',
        description: 'Optional canonical concept crosswalk.',
      },
      { name: 'value_json', type: 'jsonb', description: 'Structured field value payload.' },
    ],
  },
  {
    name: 'narrative_units',
    stage: 'analysis',
    purpose: 'Narrative fragments derived from raw text for FCHMA chain extraction and retrieval.',
    columns: [
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      { name: 'case_input_id', type: 'uuid', required: true, description: 'Source input.' },
      { name: 'source_field_key', type: 'text', description: 'Original free-text field key.' },
      { name: 'sequence_no', type: 'integer', required: true, description: 'Ordering within source.' },
      { name: 'raw_text', type: 'text', required: true, description: 'Original text span.' },
      {
        name: 'normalized_text',
        type: 'text',
        description: 'Preprocessed text used for analysis.',
      },
    ],
  },
  {
    name: 'health_conditions',
    stage: 'analysis',
    purpose: 'Case-level health condition labels and ICD normalization candidates.',
    columns: [
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      { name: 'raw_label', type: 'text', required: true, description: 'Original label as entered.' },
      { name: 'normalized_label', type: 'text', description: 'Preferred reviewed label.' },
      { name: 'icd_code', type: 'text', description: 'ICD candidate or accepted code.' },
      {
        name: 'reviewer_status',
        type: 'text',
        required: true,
        description: 'Pending, accepted, revised, or rejected.',
      },
    ],
  },
  {
    name: 'contextual_semantic_chains',
    stage: 'analysis',
    purpose: 'FCHMA chain candidates linking narrative evidence to structural interaction patterns.',
    columns: [
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      { name: 'summary', type: 'text', required: true, description: 'Chain summary.' },
      { name: 'sequence_json', type: 'jsonb', description: 'Ordered chain structure.' },
      { name: 'evidence_spans_json', type: 'jsonb', description: 'Evidence span references.' },
      { name: 'status', type: 'text', required: true, description: 'Review state.' },
    ],
  },
  {
    name: 'chain_elements',
    stage: 'analysis',
    purpose: 'ICF or extended elements participating in a semantic chain.',
    columns: [
      { name: 'chain_id', type: 'uuid', required: true, description: 'Parent chain.' },
      { name: 'element_code', type: 'text', description: 'ICF or extended code.' },
      { name: 'element_group', type: 'text', required: true, description: 'ICF layer group.' },
      { name: 'polarity', type: 'text', required: true, description: 'Burden/protection/neutral.' },
    ],
  },
  {
    name: 'chain_relations',
    stage: 'analysis',
    purpose: 'Directed relations across chain elements such as amplifies or inhibits.',
    columns: [
      { name: 'chain_id', type: 'uuid', required: true, description: 'Parent chain.' },
      {
        name: 'relation_type',
        type: 'text',
        required: true,
        description: 'Relation semantics such as amplifies or mediates.',
      },
      {
        name: 'reviewer_status',
        type: 'text',
        required: true,
        description: 'Review status for the relation candidate.',
      },
    ],
  },
  {
    name: 'structural_hypotheses',
    stage: 'planning',
    purpose: 'Human-reviewable structural hypotheses grounded in chains and case evidence.',
    columns: [
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      {
        name: 'hypothesis_label',
        type: 'text',
        required: true,
        description: 'Short hypothesis label.',
      },
      { name: 'rationale', type: 'text', required: true, description: 'Hypothesis explanation.' },
      {
        name: 'intervention_points_json',
        type: 'jsonb',
        description: 'Potential intervention leverage points.',
      },
      {
        name: 'reviewer_decision',
        type: 'text',
        required: true,
        description: 'Review disposition.',
      },
    ],
  },
  {
    name: 'intervention_hypotheses',
    stage: 'planning',
    purpose: 'Candidate intervention plans linked to structural hypotheses.',
    columns: [
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      {
        name: 'linked_hypothesis_id',
        type: 'uuid',
        description: 'Supporting structural hypothesis.',
      },
      {
        name: 'intervention_type',
        type: 'text',
        required: true,
        description: 'Work design, accommodation, or linkage action type.',
      },
      { name: 'feasibility', type: 'text', description: 'Low, medium, or high feasibility.' },
      { name: 'selected_status', type: 'text', required: true, description: 'Planner disposition.' },
    ],
  },
  {
    name: 'feedback_records',
    stage: 'feedback',
    purpose: 'Implementation and observed outcome records for the learning loop.',
    columns: [
      { name: 'case_id', type: 'uuid', required: true, description: 'Owning case.' },
      { name: 'intervention_id', type: 'uuid', description: 'Related intervention.' },
      { name: 'implemented', type: 'boolean', description: 'Whether the action was implemented.' },
      {
        name: 'updated_structure_notes',
        type: 'text',
        description: 'Reframing notes after implementation.',
      },
    ],
  },
  {
    name: 'outcome_measures',
    stage: 'feedback',
    purpose: 'Structured outcome deltas attached to feedback records.',
    columns: [
      {
        name: 'feedback_record_id',
        type: 'uuid',
        required: true,
        description: 'Parent feedback record.',
      },
      { name: 'measure_name', type: 'text', required: true, description: 'Outcome measure name.' },
      { name: 'measure_type', type: 'text', required: true, description: 'Measure type.' },
    ],
  },
  {
    name: 'supporter_pattern_assets',
    stage: 'learning',
    purpose: 'Reviewed supporter-side coordination and behavioral driver assets for runtime planning.',
    columns: [
      { name: 'asset_key', type: 'text', required: true, description: 'Stable unique asset key.' },
      {
        name: 'asset_type',
        type: 'text',
        required: true,
        description: 'Behavioral driver, coordination failure mode, or runtime pack.',
      },
      { name: 'pattern_payload', type: 'jsonb', required: true, description: 'Stored asset payload.' },
      { name: 'status', type: 'text', required: true, description: 'Review lifecycle state.' },
    ],
  },
  {
    name: 'dataset_ingestion_batches',
    stage: 'audit',
    purpose: 'Versioned provenance batches for derived dataset assets ingested into PostgreSQL.',
    columns: [
      { name: 'id', type: 'uuid', required: true, description: 'Deterministic batch identifier.' },
      { name: 'batch_key', type: 'text', required: true, description: 'Stable batch key.' },
      { name: 'dataset_id', type: 'text', required: true, description: 'Dataset identifier.' },
      { name: 'lane', type: 'text', required: true, description: 'respondents or supporters.' },
      {
        name: 'analysis_ready_manifest_json',
        type: 'jsonb',
        description: 'Analysis-ready manifest for reproducible rebuilds.',
      },
    ],
  },
  {
    name: 'dataset_subjects',
    stage: 'analysis',
    purpose: 'Subject-level join table bridging derived dataset assets into runtime cases and research.',
    columns: [
      { name: 'id', type: 'uuid', required: true, description: 'Deterministic subject identifier.' },
      {
        name: 'batch_id',
        type: 'uuid',
        required: true,
        description: 'Owning ingestion batch.',
      },
      {
        name: 'subject_key',
        type: 'text',
        required: true,
        description: 'Source respondent or supporter identifier.',
      },
      {
        name: 'metadata_json',
        type: 'jsonb',
        description: 'Row-span provenance and source identifiers.',
      },
    ],
  },
  {
    name: 'dataset_field_facts',
    stage: 'analysis',
    purpose: 'Normalized field-level facts derived from secure original datasets.',
    columns: [
      { name: 'subject_id', type: 'uuid', required: true, description: 'Owning subject.' },
      { name: 'raw_name', type: 'text', required: true, description: 'Source field key.' },
      {
        name: 'response_type',
        type: 'text',
        required: true,
        description: 'Meaning type preserved from the response-type map.',
      },
      { name: 'payload_json', type: 'jsonb', description: 'Normalized field payload.' },
    ],
  },
  {
    name: 'dataset_narrative_units',
    stage: 'analysis',
    purpose: 'Subject-level narrative units derived from free-text fields in structured datasets.',
    columns: [
      { name: 'subject_id', type: 'uuid', required: true, description: 'Owning subject.' },
      {
        name: 'source_field_key',
        type: 'text',
        required: true,
        description: 'Original free-text field name.',
      },
      { name: 'unit_index', type: 'integer', required: true, description: 'Sequence within field.' },
      { name: 'raw_text', type: 'text', required: true, description: 'Narrative unit text.' },
    ],
  },
  {
    name: 'dataset_projection_facts',
    stage: 'analysis',
    purpose: 'Deterministic projection candidates preserved as candidates rather than final judgments.',
    columns: [
      { name: 'subject_id', type: 'uuid', required: true, description: 'Owning subject.' },
      {
        name: 'source_kind',
        type: 'text',
        required: true,
        description: 'Structured or narrative projection lane.',
      },
      {
        name: 'canonical_key',
        type: 'text',
        required: true,
        description: 'Canonical concept or supporter dimension.',
      },
      { name: 'primary_axis', type: 'text', description: 'ICF frame or support model.' },
      { name: 'payload_json', type: 'jsonb', description: 'Matched pattern and context.' },
    ],
  },
  {
    name: 'dataset_manifold_profiles',
    stage: 'learning',
    purpose: 'Compact subject-level numeric and sparse profiles for later similarity and manifold work.',
    columns: [
      { name: 'subject_id', type: 'uuid', required: true, description: 'Owning subject.' },
      {
        name: 'numeric_feature_count',
        type: 'integer',
        required: true,
        description: 'Count of numeric feature keys.',
      },
      { name: 'token_count', type: 'integer', required: true, description: 'Count of sparse tokens.' },
      {
        name: 'numeric_features_json',
        type: 'jsonb',
        required: true,
        description: 'Numeric manifold-ready features.',
      },
      {
        name: 'sparse_tokens_json',
        type: 'jsonb',
        required: true,
        description: 'Sparse symbolic tokens for first-pass similarity.',
      },
    ],
  },
  {
    name: 'ai_runs',
    stage: 'audit',
    purpose: 'Provider-agnostic tracking for AI generation runs and their artifacts.',
    columns: [
      { name: 'run_kind', type: 'text', required: true, description: 'AI run category.' },
      { name: 'provider', type: 'text', description: 'AI provider name.' },
      { name: 'model', type: 'text', description: 'Model identifier.' },
      { name: 'prompt_version', type: 'text', description: 'Prompt version label.' },
      { name: 'status', type: 'text', required: true, description: 'Execution status.' },
    ],
  },
  {
    name: 'audit_logs',
    stage: 'audit',
    purpose: 'Append-only record of user and system changes for reviewability.',
    columns: [
      { name: 'action_type', type: 'text', required: true, description: 'Action label.' },
      { name: 'entity_type', type: 'text', required: true, description: 'Changed entity type.' },
      { name: 'before_json', type: 'jsonb', description: 'Prior state.' },
      { name: 'after_json', type: 'jsonb', description: 'New state.' },
    ],
  },
];

export const fchmaInitialTableNames = fchmaInitialTableMetadata.map((table) => table.name);

export function getFchmaTableMetadata(tableName: string): FchmaTableMetadata | undefined {
  return fchmaInitialTableMetadata.find((table) => table.name === tableName);
}
