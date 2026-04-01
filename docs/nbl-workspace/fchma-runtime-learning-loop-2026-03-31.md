# FCHMA Runtime Learning Loop

## Purpose

The `/cases` lane now exposes a first runtime learning loop instead of only storing feedback.

This is still lightweight and deterministic, but it matters because:

- review decisions are now aggregated
- feedback records are now summarized into outcome patterns
- unresolved re-framing signals are now visible on the dashboard

## Added

- learning summary builder:
  - `lib/fchma/learningSummary.ts`
- API:
  - `pages/api/fchma/learning-summary.ts`
- dashboard integration:
  - `pages/cases/index.tsx`

## Current Summary Signals

The runtime now derives:

- total cases
- reviewed cases
- planned cases
- follow-up cases
- feedback capture count
- source mix: manual vs survey import
- dataset distribution for survey imports
- top selected hypotheses
- top intervention titles with outcome mix
- recurring updated-structure signals from feedback notes

## Why This Is On Target

The product goal is not only to generate one-off case advice.

It is to:

1. structure a case
2. intervene
3. record what happened
4. improve the next case

The new learning summary is the first visible runtime step for stage 4.

## Remaining Gap

The learning summary is still descriptive.

It does not yet:

- write reviewed learning assets into PostgreSQL
- propose supporter pattern updates from runtime evidence
- feed ranked intervention priors back into model-backed reasoning

Those are the next steps after the repository boundary is moved off the file store.
