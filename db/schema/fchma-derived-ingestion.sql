-- FCHMA derived dataset ingestion layer
-- This layer stores normalized assets generated from secure original datasets.
-- It is designed to bridge runtime case materialization and offline research
-- without storing the original raw workbook files in PostgreSQL.

create table if not exists dataset_ingestion_batches (
  id uuid primary key,
  batch_key text not null unique,
  dataset_id text not null,
  lane text not null check (lane in ('respondents', 'supporters')),
  source_role text not null check (
    source_role in ('case_structure_source', 'support_practice_source')
  ),
  version text not null,
  artifact_contract_version text not null,
  analysis_ready_manifest_json jsonb not null default '{}'::jsonb,
  projection_manifest_json jsonb not null default '{}'::jsonb,
  manifold_recipe_json jsonb not null default '{}'::jsonb,
  source_manifest_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dataset_ingestion_batches_dataset_idx
  on dataset_ingestion_batches (lane, dataset_id, version);

create table if not exists dataset_subjects (
  id uuid primary key,
  batch_id uuid not null references dataset_ingestion_batches(id) on delete cascade,
  dataset_id text not null,
  lane text not null check (lane in ('respondents', 'supporters')),
  subject_key text not null,
  source_record_count integer not null default 0,
  narrative_unit_count integer not null default 0,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (batch_id, subject_key)
);

create index if not exists dataset_subjects_batch_idx
  on dataset_subjects (batch_id, subject_key);

create table if not exists dataset_field_facts (
  id uuid primary key,
  subject_id uuid not null references dataset_subjects(id) on delete cascade,
  source_row_index integer,
  raw_name text not null,
  display_name text,
  question_group text,
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
  normalized_value text,
  label_text text,
  numeric_value double precision,
  multiselect_count integer,
  manual_review_required boolean not null default false,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dataset_field_facts_subject_idx
  on dataset_field_facts (subject_id, raw_name);
create index if not exists dataset_field_facts_question_idx
  on dataset_field_facts (question_group, response_type);

create table if not exists dataset_narrative_units (
  id uuid primary key,
  subject_id uuid not null references dataset_subjects(id) on delete cascade,
  source_row_index integer,
  source_field_key text not null,
  display_name text,
  question_group text,
  unit_index integer not null,
  raw_text text not null,
  content_hash text,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dataset_narrative_units_subject_idx
  on dataset_narrative_units (subject_id, source_field_key, unit_index);
create index if not exists dataset_narrative_units_hash_idx
  on dataset_narrative_units (content_hash);

create table if not exists dataset_projection_facts (
  id uuid primary key,
  subject_id uuid not null references dataset_subjects(id) on delete cascade,
  source_row_index integer,
  source_kind text not null check (
    source_kind in (
      'respondent_structured',
      'respondent_narrative',
      'supporter_structured',
      'supporter_narrative'
    )
  ),
  source_field_key text not null,
  display_name text,
  question_group text,
  response_type text,
  canonical_key text not null,
  primary_axis text,
  secondary_axis text,
  projection_confidence text,
  projection_rationale text,
  label_text text,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dataset_projection_facts_subject_idx
  on dataset_projection_facts (subject_id, source_kind);
create index if not exists dataset_projection_facts_canonical_idx
  on dataset_projection_facts (canonical_key, primary_axis);

create table if not exists dataset_manifold_profiles (
  id uuid primary key,
  subject_id uuid not null unique references dataset_subjects(id) on delete cascade,
  numeric_feature_count integer not null default 0,
  token_count integer not null default 0,
  numeric_features_json jsonb not null default '{}'::jsonb,
  sparse_tokens_json jsonb not null default '[]'::jsonb,
  recipe_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists dataset_manifold_profiles_subject_idx
  on dataset_manifold_profiles (subject_id);
