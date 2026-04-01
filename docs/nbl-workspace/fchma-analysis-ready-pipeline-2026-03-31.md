# FCHMA Analysis-ready Pipeline

## What is now runnable

The repo now has a local, non-LLM preprocessing path from original structured workbooks
to analysis-ready assets under `data/analysis_ready/`.

Implemented scripts:

- `scripts/data_foundation/build_analysis_ready_exports.py`
- `scripts/data_foundation/build_respondent_projection_candidates.py`
- `scripts/data_foundation/build_supporter_projection_candidates.py`
- `scripts/data_foundation/build_health_condition_normalization_seeds.py`
- `scripts/data_foundation/build_manifold_input_recipes.py`
- `scripts/data_foundation/build_postgres_ingestion_assets.py`
- `scripts/data_foundation/build_case_materialization_packs.py`

Package commands:

- `npm run fchma:data:analysis-ready`
- `npm run fchma:data:respondent-projection`
- `npm run fchma:data:supporter-projection`
- `npm run fchma:data:health-condition-seeds`
- `npm run fchma:data:manifold-inputs`
- `npm run fchma:data:postgres-ingestion`
- `npm run fchma:data:case-materialization`
- `npm run fchma:data:refresh`

## Current output layers

For each workbook dataset, the export step creates:

- `structured_features.csv`
- `multiselect_values.csv`
- `free_text_units.jsonl`
- `codebook.csv`
- `provenance.json`
- `analysis-ready-manifest.json`

For respondent datasets, the projection step adds:

- `canonical_projection_candidates.csv`
- `narrative_projection_candidates.jsonl`
- `canonical_projection_manifest.json`

For supporter datasets, the projection step adds:

- `supporter_projection_candidates.csv`
- `supporter_narrative_projection_candidates.jsonl`
- `supporter_projection_manifest.json`

For respondent health-condition normalization, the seed step adds:

- `data/specs/icd/health-condition-normalization-seeds-v0.json`

For manifold preparation, the recipe step adds:

- `manifold_numeric_features.csv`
- `manifold_sparse_tokens.jsonl`
- `manifold_recipe.json`

For PostgreSQL handoff, the ingestion step adds:

- `postgres_ingestion/dataset_ingestion_batches.csv`
- `postgres_ingestion/dataset_subjects.csv`
- `postgres_ingestion/dataset_field_facts.csv`
- `postgres_ingestion/dataset_narrative_units.csv`
- `postgres_ingestion/dataset_projection_facts.csv`
- `postgres_ingestion/dataset_manifold_profiles.csv`
- `postgres_ingestion/load_postgres_ingestion.sql`
- `postgres_ingestion/postgres_ingestion_manifest.json`

For runtime case import, the materialization step adds:

- `case_materialization/case_materialization_index.json`
- `case_materialization/case_materialization_payloads.jsonl`

## Why this matters

This is a direct step toward the final product goal.

The repo can now:

1. preserve original structured data separately
2. transform it into reusable analysis-ready tables
3. keep free text split with content hashes
4. build deterministic projection seeds for respondent and supporter lanes
5. build seed dictionaries for later ICD indexing
6. defer expensive AI use until later structural reasoning steps

## Current limits

- These projections are seeds, not final FCHMA judgments
- ICD normalization is not yet implemented
- Seed-level health-condition normalization now exists, but final ICD coding does not
- ICF projection is still coarse and deterministic
- Supporter-side dimension mapping is keyword based and needs later review
- No manifold inputs are generated yet from the projection outputs

## Recommended next step

Build the next local layer from these outputs:

- health-condition normalization seeds for ICD indexing
- repository-backed ingestion into PostgreSQL tables
- manifold input recipes derived from structured and projected tables
- case materialization from derived dataset subjects into the `/cases` runtime lane
- PostgreSQL-backed repository replacement under the existing `/cases` contract
