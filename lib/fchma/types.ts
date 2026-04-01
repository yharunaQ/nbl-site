export const fchmaCaseStatuses = [
  'intake',
  'analyzing',
  'in_review',
  'planned',
  'in_followup',
  'closed',
] as const;

export const fchmaCaseInputTypes = [
  'intake_form',
  'interview_note',
  'followup_note',
  'survey_import',
  'upload',
  'other',
] as const;

export const fchmaResponseTypes = [
  'identifier',
  'nominal',
  'ordinal',
  'multiselect',
  'composite_state',
  'free_text',
  'derived_existing',
  'numeric_scalar',
  'count',
] as const;

export const fchmaSourceRoles = [
  'case_structure_source',
  'support_practice_source',
  'reviewed_pattern_memo',
  'derived_pattern_asset',
] as const;

export const fchmaAiRunKinds = [
  'chain_extraction',
  'icf_mapping',
  'structural_hypothesis',
  'intervention_hypothesis',
  'feedback_reanalysis',
  'dataset_pattern_extraction',
] as const;

export const fchmaSupporterPatternAssetTypes = [
  'behavioral_driver_schema',
  'coordination_failure_mode',
  'intervention_actor_capability',
  'runtime_pack',
  'workshop_memo_bridge',
] as const;

export type FchmaCaseStatus = (typeof fchmaCaseStatuses)[number];
export type FchmaCaseInputType = (typeof fchmaCaseInputTypes)[number];
export type FchmaResponseType = (typeof fchmaResponseTypes)[number];
export type FchmaSourceRole = (typeof fchmaSourceRoles)[number];
export type FchmaAiRunKind = (typeof fchmaAiRunKinds)[number];
export type FchmaSupporterPatternAssetType =
  (typeof fchmaSupporterPatternAssetTypes)[number];

export interface FchmaSourceManifest {
  source_id: string;
  dataset_id: string;
  source_role: FchmaSourceRole;
  source_type: string;
  owner: string;
  sensitivity: string;
  contains_personal_data: boolean;
  contains_free_text: boolean;
  row_unit: string | null;
  population: string | null;
  file_path: string;
  guide_files: string[];
  notes: string;
  generated_at: string;
  sheet_names?: string[];
  data_sheet?: string;
  dictionary_sheet?: string;
  row_count?: number;
  column_count?: number;
  free_text_columns?: string[];
  file_size_bytes?: number;
}

export interface FchmaResponseTypeMapVariable {
  raw_name: string;
  display_name: string;
  question_group: string;
  response_type_guess: FchmaResponseType;
  guess_reason: string;
  label_count: number;
  sample_has_plus: boolean;
  manual_review_required: boolean;
}

export interface FchmaResponseTypeMap {
  dataset_id: string;
  source_id: string;
  file_path: string;
  generated_at: string;
  taxonomy_version: string;
  response_types: FchmaResponseType[];
  variables: FchmaResponseTypeMapVariable[];
}

export interface FchmaCanonicalConcept {
  concept_id: string;
  description: string;
  source_fields: Record<string, string[]>;
  notes: string[];
}

export interface RespondentCanonicalConceptMap {
  version: string;
  sources: string[];
  canonical_concepts: FchmaCanonicalConcept[];
  dataset_specific_concepts: Record<string, string[]>;
  initial_canonical_fields: string[];
}

export interface SupporterBehavioralDriverModel {
  model_id: string;
  description: string;
  dimensions: string[];
  primary_sources: string[];
}

export interface SupporterBehavioralDriverSchema {
  version: string;
  sources: string[];
  models: SupporterBehavioralDriverModel[];
  canonical_dimensions: Record<string, string[]>;
  runtime_uses: string[];
  non_goals: string[];
  suggested_derived_assets: string[];
}

export interface FchmaTableColumnMetadata {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

export interface FchmaTableMetadata {
  name: string;
  stage: 'core' | 'analysis' | 'planning' | 'feedback' | 'learning' | 'audit';
  purpose: string;
  columns: FchmaTableColumnMetadata[];
}

export interface FchmaDerivedIngestionContractColumn {
  name: string;
  type: string;
  description: string;
}

export interface FchmaDerivedIngestionContractTable {
  table_name: string;
  grain: string;
  primary_key: string;
  runtime_uses: string[];
  research_uses: string[];
  columns: FchmaDerivedIngestionContractColumn[];
}

export interface FchmaDerivedIngestionContract {
  version: string;
  purpose: string;
  notes: string[];
  tables: FchmaDerivedIngestionContractTable[];
}
