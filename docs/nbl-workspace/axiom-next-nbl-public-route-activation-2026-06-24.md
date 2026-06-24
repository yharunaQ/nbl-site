# Axiom Next NBL Public Route Activation

Date: 2026-06-24

## Scope

This release switches the current public NBL route set from the Falcon-based next-site shell to the Axiom-based next NBL surface.

Published Axiom routes:

- `/`
- `/scene-entry`
- `/case-readings`
- `/work-design-views-guide`
- `/articles-social-questions`
- `/toolkit-studio`
- `/work-condition-window`
- `/theory-method-trust`
- `/about-boundary`

Carryover routes preserved:

- `/resources/songs`
- `/events/work-condition-forum`
- `/events/work-condition-forum/text/[id]`

## Implementation Notes

- Public routes render through `components/axiom/AxiomNextNblPublishedSitePage.tsx`.
- Internal candidate links are rewritten to public paths through `lib/axiom/nextNblPublishedRoutes.ts`.
- Legacy Falcon public route names redirect or compatibility-render to the Axiom route set.
- Music fest and forum pages remain available, but their navigation now returns to the Axiom public routes.
- Published pages do not link to the internal candidate route.

## Verification

- `npx jest __tests__/home.test.tsx __tests__/next-nbl-public-migration-routes.test.ts __tests__/axiom-carryover-legacy-page-linking.test.ts __tests__/axiom-next-nbl-published-routes.test.tsx __tests__/work-condition-forum-session-packages-page.test.tsx __tests__/work-condition-forum-text-page.test.tsx __tests__/organizations-governance-pages.test.tsx --runInBand`
- `npx jest __tests__/axiom-next-nbl-public-candidate-site-surface.test.tsx __tests__/axiom-next-nbl-public-candidate-language-boundary.test.tsx __tests__/axiom-next-nbl-public-candidate-final-qa.test.tsx --runInBand`
- `npx tsc --noEmit --pretty false`
- `npx jest __tests__/falcon-expert-agent-core-eval-profile.test.ts --runInBand`
- `npm run build`
- `npm run release:public:preflight`
- Local HTTP check confirmed public Axiom routes and carryover routes return `200`, are indexable, and do not expose `/internal/axiom-next-nbl-public-candidate` links.

## Boundary

This release does not change runtime, model/provider, retrieval, DB/schema, source/support validity, individual consultation handling, candidate-pattern promotion, or learning update.
