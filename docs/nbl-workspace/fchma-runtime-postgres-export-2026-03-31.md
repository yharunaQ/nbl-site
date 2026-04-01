# FCHMA Runtime PostgreSQL Export

## Purpose

The current `/cases` lane still runs on the file-backed store.

To avoid blocking on a database client decision, the repo now has a runtime export contract that maps those case records into the existing PostgreSQL core tables.

## Added

- runtime export contract:
  - `data/specs/ingestion/postgres-runtime-case-contract-v0.json`
- runtime export mapper:
  - `lib/fchma/runtimePostgresExport.ts`
- runtime export API:
  - `pages/api/fchma/runtime-export.ts`

## What It Maps

The export bundle now covers:

- `organizations`
- `cases`
- `case_inputs`
- `case_input_fields`
- `narrative_units`
- `health_conditions`
- `structural_hypotheses`
- `intervention_hypotheses`
- `feedback_records`
- `outcome_measures`

## Why This Matters

This keeps the project moving toward the final target without waiting on:

- ORM selection
- direct PostgreSQL client integration
- auth and tenant wiring

The API contract for `/cases` can stay stable while the storage implementation changes underneath it.

## Immediate Next Step

Use this export contract to build the first PostgreSQL-backed repository adapter, keeping:

- `listCases`
- `getCase`
- `createCase`
- `saveReview`
- `appendFeedback`

unchanged at the API layer.
