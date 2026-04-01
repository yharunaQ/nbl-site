-- FCHMA initial database layer
-- This draft is intentionally PostgreSQL-first and ORM-agnostic.
-- Vector storage is deferred to a later migration once embedding dimensions are locked.

create extension if not exists pgcrypto;

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  settings_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  role text not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  case_code text not null unique,
  title text not null,
  status text not null check (
    status in ('intake', 'analyzing', 'in_review', 'planned', 'in_followup', 'closed')
  ),
  primary_goal text,
  source_dataset_id text,
  current_snapshot_json jsonb not null default '{}'::jsonb,
  created_by uuid references app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_org_status_idx on cases (organization_id, status);

create table if not exists case_inputs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  input_type text not null check (
    input_type in (
      'intake_form',
      'interview_note',
      'followup_note',
      'survey_import',
      'upload',
      'other'
    )
  ),
  source_label text,
  raw_text text,
  structured_answers_json jsonb not null default '{}'::jsonb,
  provenance_json jsonb not null default '{}'::jsonb,
  created_by uuid references app_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists case_inputs_case_idx on case_inputs (case_id, input_type);

create table if not exists case_input_fields (
  id uuid primary key default gen_random_uuid(),
  case_input_id uuid not null references case_inputs(id) on delete cascade,
  field_key text not null,
  source_dataset_id text,
  canonical_concept text,
  response_type text not null check (
    response_type in (
      'identifier',
      'nominal',
      'ordinal',
      'multiselect',
      'composite_state',
      'free_text',
      'derived_existing',
      'numeric_scalar',
      'count'
    )
  ),
  raw_value_text text,
  value_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (case_input_id, field_key)
);

create index if not exists case_input_fields_concept_idx
  on case_input_fields (source_dataset_id, canonical_concept);

create table if not exists narrative_units (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  case_input_id uuid not null references case_inputs(id) on delete cascade,
  source_field_key text,
  sequence_no integer not null,
  unit_type text not null check (
    unit_type in ('paragraph', 'utterance', 'free_text_field', 'summary_chunk')
  ),
  raw_text text not null,
  normalized_text text,
  embedding_model text,
  embedding_version text,
  embedding_json jsonb,
  provenance_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists narrative_units_case_idx on narrative_units (case_id, case_input_id, sequence_no);

create table if not exists health_conditions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  case_input_id uuid references case_inputs(id) on delete set null,
  raw_label text not null,
  normalized_label text,
  health_condition_group text,
  icd_code text,
  icd_version text,
  normalization_confidence numeric(5, 4),
  source_type text not null check (
    source_type in ('user_input', 'survey_import', 'ai_candidate', 'human_review')
  ),
  reviewer_status text not null default 'pending' check (
    reviewer_status in ('pending', 'accepted', 'revised', 'rejected')
  ),
  metadata_json jsonb not null default '{}'::jsonb,
  created_by_ai boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists health_conditions_case_idx on health_conditions (case_id);
create index if not exists health_conditions_icd_idx on health_conditions (icd_code);

create table if not exists ai_runs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  run_kind text not null check (
    run_kind in (
      'chain_extraction',
      'icf_mapping',
      'structural_hypothesis',
      'intervention_hypothesis',
      'feedback_reanalysis',
      'dataset_pattern_extraction'
    )
  ),
  provider text,
  model text,
  prompt_version text,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed')),
  input_artifacts_json jsonb not null default '[]'::jsonb,
  output_artifacts_json jsonb not null default '[]'::jsonb,
  token_usage_json jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ai_runs_case_idx on ai_runs (case_id, run_kind, status);

create table if not exists contextual_semantic_chains (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  source_start integer,
  source_end integer,
  summary text not null,
  sequence_json jsonb not null default '[]'::jsonb,
  evidence_spans_json jsonb not null default '[]'::jsonb,
  hyperedge_json jsonb not null default '{}'::jsonb,
  boundary_confidence numeric(5, 4),
  created_by_ai boolean not null default true,
  reviewed_by_human boolean not null default false,
  status text not null check (status in ('proposed', 'accepted', 'revised', 'rejected')),
  ai_run_id uuid references ai_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contextual_semantic_chains_case_idx
  on contextual_semantic_chains (case_id, status);

create table if not exists chain_elements (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references contextual_semantic_chains(id) on delete cascade,
  element_code text,
  element_label text not null,
  domain text not null,
  element_group text not null,
  polarity text not null default 'neutral' check (polarity in ('burden', 'protection', 'neutral')),
  salience numeric(5, 4),
  evidence_text text,
  confidence numeric(5, 4),
  created_at timestamptz not null default now()
);

create index if not exists chain_elements_chain_idx on chain_elements (chain_id, element_group);

create table if not exists chain_relations (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references contextual_semantic_chains(id) on delete cascade,
  source_element_id uuid not null references chain_elements(id) on delete cascade,
  target_element_id uuid not null references chain_elements(id) on delete cascade,
  relation_type text not null check (
    relation_type in (
      'facilitates',
      'inhibits',
      'mediates',
      'amplifies',
      'compensates',
      'contrasts',
      'delays',
      'loops'
    )
  ),
  confidence numeric(5, 4),
  evidence_text text,
  reviewer_status text not null default 'proposed' check (
    reviewer_status in ('proposed', 'accepted', 'revised', 'rejected')
  ),
  reviewer_note text,
  created_at timestamptz not null default now()
);

create index if not exists chain_relations_chain_idx on chain_relations (chain_id, relation_type);

create table if not exists structural_hypotheses (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  hypothesis_label text not null,
  rationale text not null,
  supporting_chain_ids jsonb not null default '[]'::jsonb,
  competing_hypotheses_json jsonb not null default '[]'::jsonb,
  amplifiers_json jsonb not null default '[]'::jsonb,
  protectors_json jsonb not null default '[]'::jsonb,
  intervention_points_json jsonb not null default '[]'::jsonb,
  confidence numeric(5, 4),
  origin text not null check (origin in ('ai', 'human', 'hybrid')),
  reviewer_decision text not null default 'pending' check (
    reviewer_decision in ('pending', 'accepted', 'revised', 'rejected')
  ),
  ai_run_id uuid references ai_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists structural_hypotheses_case_idx
  on structural_hypotheses (case_id, reviewer_decision);

create table if not exists intervention_hypotheses (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  linked_hypothesis_id uuid references structural_hypotheses(id) on delete set null,
  intervention_type text not null,
  target_relation_or_node text,
  rationale text not null,
  expected_effect text,
  implementation_steps_json jsonb not null default '[]'::jsonb,
  priority integer,
  feasibility text check (feasibility in ('low', 'medium', 'high')),
  risk_note text,
  selected_status text not null default 'proposed' check (
    selected_status in ('proposed', 'selected', 'deferred', 'rejected')
  ),
  owner_role text,
  ai_run_id uuid references ai_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists intervention_hypotheses_case_idx
  on intervention_hypotheses (case_id, selected_status);

create table if not exists feedback_records (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  intervention_id uuid references intervention_hypotheses(id) on delete set null,
  implemented boolean,
  implementation_notes text,
  observed_effect text,
  unresolved_issues text,
  side_effects text,
  updated_structure_notes text,
  reviewer_summary text,
  created_by uuid references app_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists feedback_records_case_idx on feedback_records (case_id, created_at desc);

create table if not exists outcome_measures (
  id uuid primary key default gen_random_uuid(),
  feedback_record_id uuid not null references feedback_records(id) on delete cascade,
  measure_name text not null,
  measure_type text not null check (measure_type in ('numeric', 'ordinal', 'boolean', 'text')),
  baseline_value text,
  observed_value text,
  interpretation text,
  created_at timestamptz not null default now()
);

create index if not exists outcome_measures_feedback_idx on outcome_measures (feedback_record_id);

create table if not exists supporter_pattern_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  asset_type text not null check (
    asset_type in (
      'behavioral_driver_schema',
      'coordination_failure_mode',
      'intervention_actor_capability',
      'runtime_pack',
      'workshop_memo_bridge'
    )
  ),
  source_dataset_id text,
  title text not null,
  summary text,
  pattern_payload jsonb not null default '{}'::jsonb,
  provenance_json jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'approved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists supporter_pattern_assets_type_idx
  on supporter_pattern_assets (asset_type, status);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  case_id uuid references cases(id) on delete cascade,
  actor_user_id uuid references app_users(id) on delete set null,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  before_json jsonb,
  after_json jsonb,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_case_idx on audit_logs (case_id, created_at desc);
create index if not exists audit_logs_entity_idx on audit_logs (entity_type, entity_id);
