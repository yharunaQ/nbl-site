# Axiom work-design guide layout refresh - 2026-07-04

## Navigation Card

- Lane: Falcon
- Current phase: Axiom public work-design guide display refinement
- North star asset strengthened: Axiom integrated knowledge as a readable work-design public interface
- Target artifact: `components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx`
- Smallest shippable slice: Reorder the work-design guide page hero, premise, five-domain entry, and per-design-card content.
- Done boundary: Page rendering and targeted tests updated; no public approval or knowledge promotion.
- Not now: Runtime, retrieval, DB/schema, source validity, `candidate_pattern`, publication approval, Heron migration.
- Risks: Over-compressing perspective-shift explanation; making image assets decorative; weakening domain-to-card correspondence.
- Default next concrete step: Founder visual review of `/work-design-views-guide`, then decide whether the same ordering should propagate to share/export surfaces.

## What Changed

- The work-design guide hero now follows the same text-plus-visual pattern as other Axiom pages instead of using an image-first special layout.
- The premise section keeps the same argument, but removes the premise infographic from the reader flow and replaces the "individual problem" card with icon-supported explanations for response, early detection, prevention, and growth.
- The five design-domain entrance cards now show the same formal domain titles used by the detailed sections, with matching domain color styling.
- Each design-domain header now includes small in-domain links to the design topics belonging to that domain, so the five-domain structure and the detailed cards can be read as one hierarchy.
- Each detailed design card now reads in this order:
  1. title
  2. description
  3. compact perspective-shift points as a concretization of the description, including the "problem situations change through design" explanation that had been attached to the main visual
  4. main situation-level four-panel visual, without extra visible microcopy above the image
  5. integrated concrete design items, item-level image diagrams, and item-level points
- The former single "concrete items" board is no longer rendered as one large reader-facing image. Its existing Japanese image panels are split into 37 per-item PNGs under `public/images/axiom-work-design-guide/item-diagrams/`, then paired with each item title, explanation, and design points.
- The perspective-shift point list is now a numbered vertical reader aid instead of a three-column bullet list, and the concrete item cards use the actual item title as the card heading instead of repeating a generic "design item" label.
- The published `/work-design-views-guide` route is now explicitly included in the public-release preflight route scope and file checks, matching its sitemap entry and published-route renderer.

## Boundary Review

- Status: usable_with_revision
- Legal, medical, HR, employment, and accommodation finality: not added.
- Human-judgment replacement: not added.
- Public approval implication: not added; this is a display/layout refinement.
- Source/current-policy dependency: none added.
- Learning update or knowledge promotion: not performed.

## Remaining

- Founder visual review should decide whether the cropped per-item diagrams are sufficient, or whether a later Image-2.0 generation pass should create item-specific replacement diagrams.
- The premise and concrete-item aggregate images may still exist in the asset inventory; this refresh changes the reader page, not asset tracking or public approval.
- The pre-entry / transition item crops 1 and 2 were corrected after visual review found their top labels were clipped.
- Final external deployment still requires the normal clean-main deploy path; this note records local publication-readiness movement only.

## Clean Worktree Release Attempt

- Because the main workspace was concurrently modified by Claude Code and contained thousands of staged/untracked changes, the release slice was isolated outside the primary tree.
- Claude's rebased kernel-freeze branch `claude/kernel-freeze-on-origin` was confirmed as an add-only 394-file branch on top of `origin/main`, then used as the base for `/private/tmp/nbl-site-axiom-guide-release-20260704`.
- The design-guide render change, item-level image assets, route-scope checks, `.claude/` gitignore rule, and this release note were applied there without copying unrelated primary-tree WIP.
- The preflight shared ops root now supports `NBL_OPS_ROOT` so branch validation can explicitly check the clean integration worktree while preserving the default primary-tree behavior.
- Confirmed locally in the integration worktree:
  - `npm run typecheck`
  - `npx --no-install jest __tests__/public-release-preflight-scope.test.ts __tests__/axiom-next-nbl-public-candidate-site-surface.test.tsx __tests__/axiom-next-nbl-published-routes.test.tsx --runInBand`
  - `npm run build` with network access for Google Fonts
  - `NBL_OPS_ROOT=/private/tmp/nbl-site-axiom-guide-release-20260704 npm run release:public:preflight` with network access for Google Fonts
- The public-release preflight reports record both execution root and checked root so the validation target is auditable:
  - `docs/nbl-workspace/ops/public-release-preflights/2026-07-04.md`
  - `docs/nbl-workspace/ops/public-release-preflights/2026-07-04-surface.md`
- The `/share/...` routes are already present on `origin/main` and are not part of this integration diff; separate public judgment for future share-route changes remains outside this slice.
