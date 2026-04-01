---
name: fchma-architecture
description: Maintain case-centered architecture and clear boundaries between UI, API, DB, AI orchestration, analytics, audit, and data layers for this repo's FCHMA web app. Use when designing schemas, APIs, modules, migrations, route structure, refactors, or compatibility plans with the existing JAC implementation.
---

# Maintain Architecture Coherence

## Read First

Read these files before proposing or implementing structural changes:

- `../../AGENTS.md`
- `../../PLANS.md`
- `../../docs/nbl-workspace/fchma-consultation-os-redesign-2026-03-30.md`
- `../../data/README.md`

## Map The Change To Layers

Explicitly identify which layers are touched:

- presentation
- application
- orchestration
- persistence
- analytics
- audit
- data foundation

Avoid mixing responsibilities across layers.

## Preserve Case-centered Boundaries

Keep the new FCHMA app centered on:

- `Case`
- `CaseInput`
- `NarrativeUnit`
- `ContextualSemanticChain`
- `StructuralHypothesis`
- `InterventionHypothesis`
- `FeedbackRecord`

Do not let UI concerns or provider-specific logic become the domain model.

## Keep Old And New Separate During Migration

Prefer this migration stance:

- keep current JAC routes and logic working
- build FCHMA features on separate routes and modules
- isolate migration glue at the edges
- merge only after the new loop is stable

## Preserve Traceability

Keep these links intact:

- raw narrative to evidence span
- evidence span to chain
- chain to structural hypothesis
- structural hypothesis to intervention
- intervention to feedback
- AI output to prompt version and audit log

## Keep Data Layers Distinct

Maintain separation between:

- original sensitive data under `data/original_secure/`
- analysis-preparation layers under `data/staging/` and `data/analysis_ready/`
- derived and publishable artifacts under `references/`

## Prefer This Target Shape

When adding new modules, prefer:

- `lib/fchma/domain/`
- `lib/fchma/application/`
- `lib/fchma/orchestration/`
- `lib/fchma/infrastructure/`
- `pages/api/cases/`
- `pages/cases/`
- `components/cases/`
- `db/schema/`

## Stop Before Major Structural Changes

Pause and report before changing:

- major DB schema direction
- auth model
- core information architecture
- external dependency strategy
- migration strategy between old JAC and new FCHMA flows
