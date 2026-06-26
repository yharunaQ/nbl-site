# Axiom home Start here entry hotfix - 2026-06-26

## Purpose

Revise the public top page `Start here` section so it no longer reads like a procedural explanation of how to use the site.

The section should state the main NBL message directly and make the six primary entrances visually attractive:

- 8つの課題
- 相談事例
- 設計ガイド
- NBLレポート
- ツールキット
- 障害種類から見る

## Change

- Replaced the procedural heading `いま知りたい入口から、仕事条件の地図へ。` with the stronger message `問いはばらばらでも、見る地図はひとつ。`
- Added a compact main-message panel: `働きづらさを、本人の弱さや職場の善意だけで終わらせない。`
- Rewrote the six entrance cards so each has a reader-facing promise rather than an explanatory route description.
- Made the six cards more visual using page icons, color-coded entrance windows, and three small context chips per entrance.

## Boundary

This is a public delivery-layer UI / copy refinement.

It does not change Axiom core, kernel contracts, runtime, retrieval, model/provider behavior, DB schema, source/support validity, public approval logic, individual consultation behavior, or learning updates.

## Verification

- `npx jest __tests__/home.test.tsx __tests__/axiom-next-nbl-published-routes.test.tsx --runInBand`
- `npx tsc --noEmit --pretty false`
- `npm run build`
