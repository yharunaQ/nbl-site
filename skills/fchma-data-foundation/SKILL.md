---
name: fchma-data-foundation
description: Handle original datasets safely and prepare analysis-ready data for this repo's FCHMA web app. Use when organizing surveys, free-text data, manuals, source manifests, anonymization, staging, embeddings, manifold inputs, or cost-controlled preprocessing pipelines.
---

# Prepare Original Data Safely

## Read First

Read these files before touching source datasets:

- `../../AGENTS.md`
- `../../PLANS.md`
- `../../data/README.md`

## Keep The Layers Separate

Maintain this separation:

- `data/original_secure/` for sensitive source datasets
- `data/staging/` for normalization and anonymization work
- `data/analysis_ready/` for model and manifold inputs
- `references/` for derived, republishable, or re-creatable artifacts

Do not treat `references/` as the source of truth for original datasets.

## Start With Dataset Integrity

For each dataset, create or preserve:

- original file snapshot
- questionnaire or survey instrument
- data dictionary
- free-text column memo
- dataset notes
- source manifest

Prefer keeping major datasets separate until the canonical variable map is explicit.

## Prepare Structured Data First

Prefer this order:

1. preserve raw structured data unchanged
2. document missing codes and value labels
3. anonymize and normalize in staging
4. create analysis-ready tables
5. add narrative processing
6. build graph and manifold inputs

## Control API Spend

Assume LLM usage is expensive.

Prefer these cost controls:

- preprocess locally first
- split free text once and reuse the segmentation
- content-hash records and process only changes
- cache embeddings and AI outputs
- run manifold experiments on tabular data first
- use high-cost models only for ambiguous narrative interpretation

## Treat Manifold As A Derived Layer

Treat manifold inputs and outputs as derived artifacts, not raw truth.

Keep:

- the original dataset
- the analysis-ready dataset
- the manifold input recipe
- the manifold result version

separate and traceable.
