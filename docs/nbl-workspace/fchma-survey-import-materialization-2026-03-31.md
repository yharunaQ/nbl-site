# FCHMA Survey Import Materialization

## Purpose

The repo now supports a deterministic bridge from respondent-side derived dataset subjects into the live `/cases` lane.

This means the new FCHMA runtime is no longer limited to hand-entered intake text.

It can now start from:

- `employment_survey_3000`
- `nanbyo_survey_4000`

through a reviewed import pack built from derived assets.

## Added

- materialization builder:
  - `scripts/data_foundation/build_case_materialization_packs.py`
- runtime loader:
  - `lib/fchma/surveyImportMaterialization.ts`
- APIs:
  - `pages/api/fchma/import-datasets.ts`
  - `pages/api/fchma/import-preview.ts`
- UI:
  - `pages/cases/import.tsx`
- package commands:
  - `npm run fchma:data:case-materialization`
  - `npm run fchma:data:refresh`

## What The Builder Produces

For each respondent dataset under `data/analysis_ready/respondents/<dataset>/v0/`, it now creates:

- `case_materialization/case_materialization_index.json`
- `case_materialization/case_materialization_payloads.jsonl`

Each payload row contains:

- deterministic `survey_import` payload
- import context with dataset, subject key, and batch key
- summary fields for runtime preview

No LLM is used in this step.

## Runtime Behavior

The `/cases/import` page now:

1. lists available respondent import datasets
2. accepts a subject key
3. builds an import preview
4. sends the resulting payload into the existing `/api/fchma/cases` save path

This keeps the runtime contract stable:

- manual case intake and survey import both end up as `FchmaIntakeDraftPayload`
- the existing preview, structure, intervention, review, and feedback flow stays intact

## Why This Matters

This is a major alignment step toward the final product goal.

It connects:

- original structured datasets
- FCHMA-derived normalization and projection assets
- the live case-centered runtime

without collapsing back into a static FAQ or disease-first lookup workflow.

## Remaining Gap

The import path still saves into the file-backed runtime store.

The next step is to move the same `/cases` contract onto a PostgreSQL-backed repository implementation, using the already-generated derived ingestion tables as the storage bridge.
