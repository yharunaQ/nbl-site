---
name: fchma-domain-icf-icd
description: Apply this repo's domain rules for using ICF as the primary structural frame and ICD only for health-condition normalization and indexing. Use when modeling case data, parsing narratives, designing UI or search, building similar-case retrieval, or handling disease and diagnosis labels.
---

# Apply ICF And ICD Correctly

## Read First

Read these files before domain-sensitive changes:

- `../../AGENTS.md`
- `../../PLANS.md`
- `../../docs/nbl-workspace/fchma-consultation-os-redesign-2026-03-30.md`
- `../../docs/nbl-workspace/codex-operating-skillset-2026-03-30.md`

## Keep ICF Primary

Use ICF for:

- structural reasoning
- interaction mapping
- intervention points
- case comparison by structure
- review and editing UI

Keep the main case workspace centered on ICF structure, not disease labels.

## Keep ICD Limited

Use ICD for:

- raw disease and diagnosis normalization
- label deduplication
- indexing and grouping
- secondary filtering for search
- background context in the case record

Do not use ICD as:

- the main explanatory frame
- the main intervention engine
- a shortcut from disease name to support recommendation

## Model Health Conditions Explicitly

When data modeling health conditions, keep room for:

- raw label
- normalized label
- ICD code
- ICD version
- normalization confidence
- source type
- reviewer status

Prefer a separate health-condition layer instead of burying this inside free text.

## Design UI With The Right Emphasis

Prefer:

- ICF structure as the center of the case screen
- ICD as background information
- similar-case panels split into structural similarity, intervention-history similarity, and ICD similarity

Use this ranking priority:

`ICF structural similarity > intervention-history similarity > ICD match`

## Avoid Disease-first Drift

If a feature starts turning into:

- disease-specific answer routing
- disease-name-first navigation
- deterministic disease-to-support matching

stop and reframe it around structure, context, and human review.
