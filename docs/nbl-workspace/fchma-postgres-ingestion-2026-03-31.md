# FCHMA PostgreSQL Ingestion Path

## Purpose

The repo now has a concrete local path from derived dataset assets into PostgreSQL-shaped tables.

This closes the gap between:

- secure original structured datasets under `data/original_secure/`
- local derived assets under `data/analysis_ready/`
- future runtime and research storage in PostgreSQL

## Added

- SQL layer for derived dataset assets:
  - `db/schema/fchma-derived-ingestion.sql`
- tracked ingestion contract:
  - `data/specs/ingestion/postgres-derived-contract-v0.json`
- TypeScript loader for the contract:
  - `lib/fchma/derivedIngestionContract.ts`
- local builder for PostgreSQL-ready CSV assets:
  - `scripts/data_foundation/build_postgres_ingestion_assets.py`
- package command:
  - `npm run fchma:data:postgres-ingestion`

## Contract Shape

The ingestion contract uses six tables.

1. `dataset_ingestion_batches`
   - one row per dataset build
   - stores manifest and provenance JSON
2. `dataset_subjects`
   - one row per respondent or supporter
   - becomes the stable join point for all downstream assets
3. `dataset_field_facts`
   - one row per normalized structured field
4. `dataset_narrative_units`
   - one row per free-text unit
5. `dataset_projection_facts`
   - one row per deterministic projection candidate
6. `dataset_manifold_profiles`
   - one row per subject-level manifold-ready profile

## Why This Matters

This design keeps the product aligned with the north star:

- original data stays outside PostgreSQL in secure storage
- runtime and research both read the same normalized derived shapes
- case materialization can happen later without reopening raw workbooks
- manifold and similarity experiments stay local and cheap until a stronger retrieval layer is justified

## Current Builder Output

For each dataset version under `data/analysis_ready/*/<dataset>/v0/`, the builder now creates:

- `postgres_ingestion/dataset_ingestion_batches.csv`
- `postgres_ingestion/dataset_subjects.csv`
- `postgres_ingestion/dataset_field_facts.csv`
- `postgres_ingestion/dataset_narrative_units.csv`
- `postgres_ingestion/dataset_projection_facts.csv`
- `postgres_ingestion/dataset_manifold_profiles.csv`
- `postgres_ingestion/load_postgres_ingestion.sql`
- `postgres_ingestion/postgres_ingestion_manifest.json`

These assets are local build artifacts and remain outside git.

## Immediate Implication

The next step is no longer "figure out how to ingest derived assets."

The next step is:

- materialize one `dataset_subject`
- into a `survey_import` case
- with linked `case_inputs`, `case_input_fields`, `narrative_units`, and `health_conditions`

At that point, the FCHMA `/cases` lane can start from real dataset-derived evidence rather than only from ad hoc form input.
