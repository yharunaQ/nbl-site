# FCHMA Manifold Input Recipe

## What this adds

The repo now has a local recipe for first-pass manifold and structure-similarity experiments.

Implemented script:

- `scripts/data_foundation/build_manifold_input_recipes.py`

Package command:

- `npm run fchma:data:manifold-inputs`

## Output contract

For each dataset under `data/analysis_ready/*/<dataset>/v0/`, the recipe now produces:

- `manifold_numeric_features.csv`
- `manifold_sparse_tokens.jsonl`
- `manifold_recipe.json`

## Recipe design

### Respondent lane

Numeric features summarize:

- counts by `canonical_concept`
- counts by `primary_frame`
- counts by `response_type`
- `narrative_unit_count`

Sparse tokens include:

- `concept::*`
- `frame::*`
- `health_condition::*`
- `narrative_concept::*`
- `narrative_field::*`

### Supporter lane

Numeric features summarize:

- counts by `canonical_dimension`
- counts by `support_model`
- counts by `response_type`
- `narrative_unit_count`

Sparse tokens include:

- `dimension::*`
- `model::*`
- `actor_context::*`
- `narrative_dimension::*`
- `narrative_model::*`

## Why this is the right next step

This keeps the project aligned with the final goal while controlling cost:

- no LLM calls
- no raw narrative embeddings yet
- reproducible local preprocessing
- explicit separation between original data, analysis-ready data, and manifold inputs

## Current limits

- numeric features are still count-based and coarse
- sparse tokens currently favor interpretability over completeness
- no dimensionality reduction or clustering is run yet
- supporter-side projection heuristics still need later review

## Next step

Use these manifold inputs to define:

- structure-similarity experiments across respondent cases
- supporter-side coordination pattern similarity
- PostgreSQL ingestion shapes for derived manifold-ready assets
