# Axiom Next NBL Shareable Content Hotfix

Date: 2026-06-25

## Scope

After public route activation, individual report articles and toolkit images needed shareable URLs for SNS and external circulation. This hotfix adds built-in share paths without changing runtime, retrieval, DB/schema, source validity, public judgment, or learning loops.

## Added Share Surfaces

- NBL report article share pages:
  - `/share/nbl-report/[articleId]`
  - Each page carries article-specific title, description, and OGP image.
  - The page links back to the matching report reader deep link: `/articles-social-questions?article=[articleId]#full-article-reader`.
- Toolkit infographic share pages:
  - `/share/toolkit-infographic/[itemId]`
  - Each page carries infographic-specific title, description, and OGP image.
  - The page links back to the matching toolkit image deep link: `/toolkit-studio?image=[itemId]#toolkit-selected-infographic-library`.

## Reader UI

- NBL report articles now expose share actions for the selected article and its visual.
- Toolkit infographic lightbox now exposes share actions for the selected image.
- Query parameters restore selected content on page load:
  - `?article=[articleId]`
  - `?article=[articleId]&visual=1`
  - `?image=[itemId]`

## Verification

- `npx jest __tests__/axiom-next-nbl-shareable-content.test.tsx __tests__/axiom-next-nbl-published-routes.test.tsx --runInBand`
- `npx tsc --noEmit --pretty false`

## Boundary

These share pages are circulation entry points only. They do not provide individual advice, final medical/legal/employment/accommodation judgment, source/support validity approval, runtime behavior, or learning update.
