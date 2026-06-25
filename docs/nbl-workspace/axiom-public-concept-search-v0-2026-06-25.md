# Axiom public concept search v0 - 2026-06-25

## Purpose

Add a public-site search entrance that can find NBL content by context, not only by literal page text.

Example: a query for `難病` should also surface health-time, treatment, symptom fluctuation, disclosure, evaluation, income anxiety, internal disability, NBL report, and toolkit material when relevant.

## Implementation

- `lib/axiom/axiomPublicConceptSearch.ts` defines a static public search index.
- The index combines:
  - public page entrances
  - work / social-participation design domains
  - disability / disease-name entrances
  - NBL report shareable article entries
  - toolkit infographic shareable entries
- `pages/search.tsx` renders a static search page with query suggestions and context-expansion explanations.
- The public site header links to `/search`; desktop large layouts also include a compact search form.

## Search Design

The v0 search expands common reader terms into NBL concept contexts.

- `難病` -> `健康時間`, `治療`, `通院`, `症状変動`, `体調変動`, `回復時間`, `開示`, `評価`, `収入不安`
- `合理的配慮` -> `仕事設計`, `作業`, `手順`, `環境`, `相談線`, `評価`
- `視覚` / `聴覚` -> `情報保障`, `会議`, `資料`, `警告`, `口頭`, `文字`
- `通勤` / `移動` -> `職場接触点`, `休憩場所`, `姿勢`, `安全`, `消耗`
- `AI` / `SNS` / `検索` -> `資料の読み方`, `一面性`, `過剰一般化`, `専門性`

## Boundary

This is a static public delivery-layer search. It does not call an LLM, create a dynamic retrieval system, change prompts, change providers, change DB schema, change source/support validity, make individual judgments, approve public content, or update Axiom learning.

The result explanations are orientation text, not final professional, legal, medical, employment, or accommodation judgments.

## Verification

- `npx jest __tests__/axiom-public-concept-search.test.ts --runInBand`
- `npx tsc --noEmit --pretty false`
- `npm run build`
