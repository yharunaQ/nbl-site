---
name: fchma-anti-swamp
description: Detect rabbit-hole risk and recover with option-based decisions during design or implementation of this repo's FCHMA web app. Use when work loops on minor details, schema churn, premature UI polish, taxonomy perfectionism, over-analysis, or low-leverage refactors.
---

# Detect And Exit Rabbit Holes

## Watch For These Signals

Treat these as swamp risk:

- repeated edits in the same layer without user-visible progress
- long focus on minor UI polish before the core loop works
- repeated schema churn without a clear slice boundary
- deep debate on taxonomy or naming with no delivery impact
- trying to perfect manifold or learning logic before basic intake-review-feedback exists
- mixing old JAC cleanup with new FCHMA build in the same change set

## Stop Escalating Complexity

When swamp risk appears:

1. stop deepening the same path
2. summarize what was learned in 3 short points
3. produce 3 options

Required option set:

- `minimal`
- `robust`
- `compromise`

## Recommend One Option

Choose one option and explain it in terms of:

- delivery speed
- architectural safety
- future migration cost

Prefer the option that preserves the core loop and keeps the next step concrete.

## Return To A Small Slice

After choosing an option, restate the next smallest move.

Good examples:

- add one schema table instead of redesigning the whole DB
- build one analysis panel instead of a full dashboard
- implement one provider interface instead of a full orchestration framework
