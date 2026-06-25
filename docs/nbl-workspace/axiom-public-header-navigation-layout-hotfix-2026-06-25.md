# Axiom public header navigation layout hotfix - 2026-06-25

## Purpose

Fix the published site header after adding concept search. The previous header tried to show all public page tabs plus the search form in one desktop row, which could crowd or break the layout.

## Changed

- Desktop header now shows only the primary reader routes:
  - Top
  - 8つの課題
  - 相談事例
  - 設計ガイド
  - NBLレポート
- The search form remains visible in the desktop header.
- Remaining public pages are available through a compact `全ページ` menu.
- Mobile navigation uses horizontal scrolling instead of wrapping many tabs across multiple awkward lines.

## Boundary

This is a public delivery-layer layout hotfix only. It does not change page content, routes, Axiom kernel content, search ranking, runtime behavior, source/support validity, learning update, or public approval logic.
