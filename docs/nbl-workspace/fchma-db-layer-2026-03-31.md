# FCHMA Initial DB Layer

## Purpose

Move from planning artifacts into an implementation-ready data layer without blocking on ORM selection.

## What Was Added

- SQL DDL draft:
  - `db/schema/fchma-core.sql`
- TypeScript domain and schema metadata:
  - `lib/fchma/types.ts`
  - `lib/fchma/sourceSpecs.ts`
  - `lib/fchma/schemaMetadata.ts`
- Safe spec assets already generated under:
  - `data/specs/`

## Why This Shape

The repo does not yet have a DB library such as Drizzle installed.

Rather than stop progress, this layer uses:

- PostgreSQL-first SQL as the portable truth for the initial schema
- TypeScript metadata as the app-side truth for table purpose and field meaning
- JSON specs as the bridge from original datasets into case-centered ingestion

This keeps progress aligned with the product north star while avoiding premature commitment to one ORM implementation.

## Core Decision

The initial schema is centered on four loops:

1. intake
2. structural analysis
3. intervention planning
4. feedback and learning

That is why the schema now has first-class support for:

- `cases`
- `case_inputs`
- `case_input_fields`
- `narrative_units`
- `health_conditions`
- `contextual_semantic_chains`
- `structural_hypotheses`
- `intervention_hypotheses`
- `feedback_records`
- `supporter_pattern_assets`

## Important Constraint

Vector storage is intentionally not locked yet.

The schema stores embedding metadata and leaves pgvector-specific storage to a later migration once:

- provider strategy
- embedding dimension
- runtime retrieval path

are fixed.

## Immediate Next Step

Use the new schema metadata and source spec layer to implement:

- case-centered TypeScript records and adapters
- ingestion of respondent free-text into `narrative_units`
- ingestion of health-condition fields into `health_conditions`
- supporter runtime pack loading from `supporter_pattern_assets`

At that point, adding Drizzle becomes a translation step rather than a fresh design step.
