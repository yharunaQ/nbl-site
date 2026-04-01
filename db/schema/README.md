# FCHMA DB Schema

このディレクトリは、FCHMA ベース相談支援アプリの初期 DB layer を置く。

現段階では、依存追加を伴わずに進めるため:

- PostgreSQL 向け SQL DDL draft
- TypeScript の schema metadata

を並行して管理する。

## 現在のファイル

- `fchma-core.sql`
  - 初期テーブル定義
  - `cases`, `case_inputs`, `case_input_fields`, `narrative_units`
  - `health_conditions`
  - `contextual_semantic_chains`, `chain_elements`, `chain_relations`
  - `structural_hypotheses`, `intervention_hypotheses`
  - `feedback_records`, `outcome_measures`
  - `supporter_pattern_assets`
  - `ai_runs`, `audit_logs`
- `fchma-derived-ingestion.sql`
  - original data から作られた派生資産の PostgreSQL 取り込みレイヤ
  - `dataset_ingestion_batches`
  - `dataset_subjects`
  - `dataset_field_facts`
  - `dataset_narrative_units`
  - `dataset_projection_facts`
  - `dataset_manifold_profiles`

## 方針

- source data の正本は DB に直入れせず、まず `data/specs/` にある spec を通して意味型を固定する
- derived dataset assets は `analysis_ready -> projection -> manifold` を経てから DB に入れる
- 初期 schema は product loop を壊さない最小構成を先に定義する
- ORM は後から差し替え可能にする

## 次段階

次に ORM を入れる場合は、`fchma-core.sql`、`fchma-derived-ingestion.sql`、`lib/fchma/schemaMetadata.ts` を真実の源として Drizzle schema に写す。
