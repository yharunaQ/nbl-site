# AGENTS.md

## Mission

Build a case-centered, FCHMA-based consultation support system.
This is not a chat app, not an FAQ app, and not a disease-to-accommodation lookup tool.
It is a learning consultation-support OS that helps professionals:

- structure a case using ICF as the main analytic frame
- normalize disease and diagnosis labels using ICD
- generate structural hypotheses
- propose intervention hypotheses
- record implementation and outcomes
- improve professional knowledge through feedback loops

## Product North Star

The core value is not model cleverness.
The core value is high-quality structured case knowledge:

- narrative structure
- ICF-based relations
- ICD-normalized health condition labels
- human-reviewed hypotheses
- intervention-outcome links
- evolving pattern library

## Main Analytic Frames

- ICF: primary frame for case structure, interaction, and intervention reasoning
- ICD: normalization and indexing frame for disease, diagnosis, and health-condition labels

Use ICD for normalization, indexing, and grouping.
Do not use ICD as the main explanatory frame for support reasoning.

## Product Principles

1. Keep the product case-centered.
2. Keep ICF as the main structure frame.
3. Use ICD only for health-condition normalization and indexing.
4. Never reduce support logic to disease-name lookup.
5. Preserve raw narrative and evidence spans.
6. Treat AI as a candidate generator, not a final decision-maker.
7. Treat human review and edits as first-class data.
8. Preserve auditability.
9. Favor usable increments over architecture theater.
10. Keep the system provider-agnostic for future model upgrades.

## Non-goals

- Fully autonomous diagnosis or case judgment
- One-shot AI answer generation without review
- Static FAQ-centered product design
- Disease-first deterministic recommendation engine
- Excessive optimization of minor UI details before the core loop works

## Architecture Rules

- Keep responsibilities separated across UI, API, DB, AI orchestration, analytics, and audit layers.
- Keep a case-centered domain model.
- Preserve traceability from structured output back to source evidence.
- Store model outputs, prompt versions, and human edits separately.
- Avoid hard-coding provider-specific logic into product logic.
- Keep original data separate from derived reference artifacts.
- Treat `data/original_secure/` as the local home for sensitive source datasets and `references/` as derived or publishable assets.

## Repo-local Skills

When a task clearly matches one of these skill areas, read the corresponding skill under `skills/` before proceeding:

- `skills/fchma-north-star/SKILL.md`
- `skills/fchma-architecture/SKILL.md`
- `skills/fchma-delivery/SKILL.md`
- `skills/fchma-anti-swamp/SKILL.md`
- `skills/fchma-domain-icf-icd/SKILL.md`
- `skills/fchma-data-foundation/SKILL.md`

## Required Workflow

Before major implementation:

- restate the current goal
- check `AGENTS.md` and `PLANS.md`
- identify non-goals
- propose the smallest shippable increment
- identify swamp risks

When reporting progress, use:

- Current phase
- What changed
- What remains
- Risks
- Next concrete step

## Artifact-first Rule

- Important design decisions must be reflected in `AGENTS.md`, `PLANS.md`, or the relevant design doc.
- Do not let conversation-only decisions remain undocumented.
- Keep plans, docs, and implementation aligned.

## Autonomy Boundary

Proceed without asking for confirmation on:

- local implementation details
- file organization
- tests
- docs updates
- small UI refinements
- refactors that do not change product meaning

Stop and report before changing:

- DB schema in major ways
- auth model
- core information architecture
- external dependencies
- main UX flow
- product scope

## Anti-swamp Rule

If rabbit-hole risk appears:

1. stop deepening
2. summarize what was learned
3. propose 3 options: minimal, robust, compromise
4. recommend one option

## Human-AI Boundary

AI may help with:

- contextual semantic chain extraction
- ICF element suggestion
- ICD normalization candidates
- relation candidates
- structural hypothesis candidates
- similar-case candidates
- intervention hypothesis candidates
- counter-hypothesis generation

AI must not own:

- final case judgment
- unreviewed intervention decisions
- unreviewed learning updates
- final ethical decisions

## Done Definition

A task is not done when code exists.
A task is done only when:

- code is implemented
- tests are updated when needed
- docs are updated
- plan artifacts are updated
- known risks are stated clearly
