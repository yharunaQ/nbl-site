# Next Sprint Task: Reduce Boilerplate in `knowledge-claims.jsonl`

## Task ID

- `SPRINT-QC-CLAIMS-001`

## Why this task exists

- Current `knowledge-claims.jsonl` contains navigation-like and template-like statements mixed with usable claim evidence.
- This lowers retrieval precision and can amplify non-actionable or misleading evidence in JAC safety-gate reasoning.

## Scope

- Target pipeline:
  - `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/knowledge/build-claims.mjs`
  - (if needed) `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/scripts/knowledge/build-normalized-records.mjs`
- Reduce boilerplate claim generation from:
  - global navigation/header/footer blocks
  - cookie/privacy/site-map/menu strings
  - list-page search index scaffolding (especially external aggregated pages)

## Non-scope

- No change to legal/safety policy thresholds in safety-gate mode switching logic.
- No source registry expansion in this task.

## Implementation approach

1. Strengthen boilerplate filtering in claim sentence selection.
2. Add source-aware negative patterns for known noisy page types.
3. Add line-quality guards before claim emission (minimum lexical diversity / content ratio).
4. Add a lightweight quality report in manifest for rejected-boilerplate counts by source/pageType.

## Acceptance criteria (Definition of Done)

1. `npm run knowledge:claims` completes successfully.
2. `knowledge-claims-manifest.json` includes boilerplate rejection counters.
3. Sample audit on top noisy sources shows measurable reduction of navigation-like claims.
4. `npm run knowledge:test-safety-gate` still passes (`strict`/`caution` expected scenarios).
5. No increase in safety regression:
   - strict scenario must not downgrade to `caution` only due to filtering.

## Validation checklist

- Before/after diff on:
  - claim count
  - bySourceId distribution
  - byEvidenceScope distribution
  - top repeated statements (manual spot check)
- Manual spot check at least:
  - `jeed_reference`
  - `askjan_website`
  - one government guidance source

## Risk controls (disability-holistic-review aligned)

- Avoid over-filtering case-specific context that encodes:
  - person factors
  - job/task constraints
  - support/accommodation details
  - institution/legal context
- If high recall loss is detected on specific-case evidence, roll back source-specific rules first.

## Open questions to resolve during sprint planning

1. Should rejection rules be global-only, or source-specific with per-source versioning?
2. Do we want to block claim emission for `aggregated_index` pages by default unless case linkage exists?
3. What threshold defines unacceptable noise rate per source?

## Suggested estimate

- Size: `M` (1-2 days including validation and safety re-check)

