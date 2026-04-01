---
name: fchma-delivery
description: Drive autonomous delivery for this repo's FCHMA web app without waiting on minor decisions. Use when implementing a planned slice end-to-end, choosing local file structure, adding tests, updating docs, or deciding whether to proceed versus pause for review.
---

# Deliver Without Waiting

## Read First

Read these files before starting a substantial task:

- `../../AGENTS.md`
- `../../PLANS.md`

## Start From The Current Slice

Pick the smallest shippable slice that advances the current plan.

Prefer:

- one end-to-end vertical slice
- one schema increment with matching API and UI stub
- one reviewable change with docs kept in sync

Avoid broad speculative expansion.

## Proceed Autonomously On Local Decisions

Proceed without waiting on:

- local implementation details
- file organization
- tests
- docs updates
- small UI refinements
- internal refactors that preserve product meaning

## Stop And Report On Major Decisions

Pause before changing:

- major DB schema direction
- auth model
- core information architecture
- main UX flow
- external dependencies
- product scope

## Report Progress In This Shape

Use this reporting format during longer tasks:

- Current phase
- What changed
- What remains
- Risks
- Next concrete step

## Finish The Slice Properly

Do not leave a slice as code-only.
Before considering it done, update what is needed among:

- implementation
- tests
- docs
- `PLANS.md`
- relevant design docs
