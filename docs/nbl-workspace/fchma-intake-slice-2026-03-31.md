# FCHMA Intake Slice

## What this slice adds

This slice creates the first visible and interactive FCHMA path in the app:

- `/cases`
  - overview page for the new case-centered lane
- `/cases/new`
  - intake workspace that previews how a free-form case will be normalized and structurally reframed
- `/api/fchma/intake-blueprint`
  - serves the intake blueprint derived from respondent canonical concepts
- `/api/fchma/intake-draft`
  - converts intake text into field, health-condition, and narrative previews
- `/api/fchma/structure-preview`
  - converts the same intake text into deterministic FCHMA structure candidates
- `/api/fchma/intervention-preview`
  - converts the structure candidates into supporter-aware intervention candidates
- `/api/fchma/cases`
  - saves and lists file-backed case records for the new lane
- `/api/fchma/cases/[caseId]/review`
  - stores human review decisions, selected hypotheses, and selected interventions
- `/api/fchma/cases/[caseId]/feedback`
  - records implementation and follow-up outcomes against a saved case

## Why this matters

The project now has a bridge from:

- original data specs
- canonical concept maps
- initial database layer

to an actual product surface.

This keeps progress aligned with the long-term goal:

1. preserve raw case text
2. map it into structured concepts
3. feed structural reasoning
4. prepare intervention planning
5. preserve feedback-ready shapes

## Current limitation

This slice does not yet persist to a real database.

That is intentional. The app now has:

- a stable intake blueprint
- deterministic normalization preview
- a schema-ready shape

So the next step is persistence and structural-analysis preview, not more abstract planning.

## Added in the same slice

A deterministic structure preview layer now exists.

It does not replace AI reasoning. It gives the app a stable pre-AI shape for:

- health condition nodes
- activity and participation nodes
- environmental and personal factor candidates
- relation candidates
- initial intervention-point hypotheses

This keeps the workflow moving even before provider-specific orchestration is wired in.

## End-to-end state after this slice

The app now has a deterministic chain for the new lane:

1. intake text
2. normalized field preview
3. structure preview
4. intervention preview

The same lane is now also persistable through a file-backed runtime store:

5. save case draft
6. reopen case detail
7. review structural hypotheses
8. select intervention hypotheses
9. record implementation feedback

This is still pre-database, but the new product lane is no longer only docs and specs.

## Provider abstraction added

The deterministic preview path now sits behind a thin orchestration layer:

- `lib/fchma/orchestration.ts`
- `lib/fchma/payloadGuards.ts`

This matters because the page and API contract no longer need to know whether
the structure and intervention candidates came from:

- deterministic preview rules
- a future model-backed reasoning provider
- a hybrid provider

That keeps the next step small: swap persistence and reasoning implementations
without changing the case workflow surface.

## Repository boundary added

The `/cases` lane now also depends on a repository adapter instead of importing
the file-backed store directly:

- `lib/fchma/caseRepository.ts`

Today it still resolves to the runtime file store. The point is that the page
and API layer now depend on a stable contract for:

- list case
- get case
- create case
- save review
- append feedback

This keeps the next persistence move aligned with the final goal: swap in a
PostgreSQL repository without rewriting the product workflow.
