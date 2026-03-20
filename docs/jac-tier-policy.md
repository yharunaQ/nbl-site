# JAC 因果Tier設計（凍結点）

更新日: 2026-03-02  
参照実装:
- `references/jac/card-tier-policy.json`
- `lib/jac/causalTier.ts`

## 目的
- 難病GLMを中核として維持しつつ、`data2`/`raw_data`/`web-cache` 由来の広い障害領域を同じ26カードで扱う。
- `GLM hit件数` を単純KPIにせず、カードごとの設計意図に沿った因果表現を維持する。
- ツギハギ実装を避けるため、判定ロジックを `lib/jac/causalTier.ts` に一本化する。

## Tier定義
- `Tier A (GLM直接因果)`
  - 設計意図としてGLM中核領域に位置づくカード。
  - A判定にはGLM直接接続が必要。
- `Tier B (三角測量因果推定)`
  - GLMが薄い/対象外でも、`data2 + claims + 制度/事例レーン` の統合で条件付き因果を扱うカード。
- `Tier C (関連知見)`
  - 根拠不足時の待避レーン。因果断定を行わない。

## 判定ルール（要点）
- 設計Tierが `A` のカード:
  - GLM接続あり → `A`
  - GLM接続なし + 三角測量十分 → `B`（要見直し）
  - それ以外 → `C`（要見直し）
- 設計Tierが `B` のカード:
  - 三角測量十分（またはGLM補助 + 三角測量準十分） → `B`
  - それ以外 → `C`

## 26カードの設計Tier

### Tier A（難病GLM中核）
- `p-meeting-overload`
- `p-fatigue-pacing`
- `p-medical-schedule`
- `p-return-to-work-ramp`
- `p-shift-rhythm-guard`
- `p-internal-treatment-compatibility`
- `p-mental-fluctuation-plan`

### Tier B（三角測量）
- `p-environment-sensory`
- `p-commute-hybrid`
- `p-disclosure-boundary`
- `p-manager-checkin`
- `p-customer-facing-load`
- `p-visual-document-access`
- `p-hearing-meeting-access`
- `p-physical-mobility-route`
- `p-safety-critical-operations`
- `p-intellectual-task-clarity`
- `p-developmental-switch-load`
- `p-higher-brain-memory-support`
- `p-jobmatch-exploration`
- `p-application-contact-flow`
- `p-interview-self-advocacy`
- `p-skill-building-path`
- `p-worktrial-transition`
- `p-income-condition-stability`
- `p-support-service-navigation`

## 表示順（導入ガイド）
- 初期表示は、相談者が全体像を把握しやすいよう 3 レイヤー順で固定する。
  - 体調レイヤー（9）
  - 就職移行レイヤー（7）
  - 職場運用レイヤー（10）
- タグ/詳細テーマを選択した場合は、根拠スコア（data2/claims/因果Tier）で再ランキングする。

## 監査基準
- 主要KPIは `設計Tier整合率`。
- `GLM hit 0` 自体は異常ではない。異常は「A設計カードがA条件を満たさない」場合。
- 監査は次の2本で運用:
  - 既存: `jac:audit:glm-density`（構造観測）
  - 新規: `jac:audit:tier-alignment`（設計整合）
  - 追加: `jac:audit:card-count-robustness`（26固定を外したクラスタ再推定）

## 最終READY判定
- 日次/リリース前の最終判定は `jac:audit:readiness` を使用する。
- 強制判定は `jac:audit:readiness:enforce`。
- `jac:quality:gate` / `jac:quality:gate:strict` には `jac:audit:readiness:enforce` を組み込む。
- カード数の見直し判断時は、`jac:audit:card-count-robustness` を実行し、
  - `bestK`
  - `k26`
  - `comparison.bestKIs26 / bestKNear26 / nearOptimal26`
  を併読して判断する。
- 判定軸（すべて pass で `READY`）:
  - `tier_alignment_mismatch`: Tier設計不整合件数
  - `data2_uncovered_rows`: data2課題の未カバー件数
  - `wording_review_required`: 文言根拠の要レビュー件数
  - `minority_low_diff_overlap_pairs`: 高重複かつ低差分のペア件数
  - `minority_actionable_uncovered_raw`: raw_data希少記述の actionable 未カバー件数
  - `minority_actionable_uncovered_web`: web_cache希少記述の actionable 未カバー件数
- 閾値は環境変数で調整可能:
  - `JAC_MAX_TIER_MISMATCH`（default: `0`）
  - `JAC_MAX_UNCOVERED_ROWS`（default: `0`）
  - `JAC_MAX_WORDING_REVIEW`（default: `0`）
  - `JAC_MAX_LOW_DIFF_OVERLAP`（default: `0`）
  - `JAC_MAX_ACTIONABLE_UNCOVERED_RAW`（default: `0`）
  - `JAC_MAX_ACTIONABLE_UNCOVERED_WEB`（default: `0`）

## 少数事例・微差の保全ルール
- 監査:
  - `jac:audit:mece` で重複・固有寄与を確認する。
  - `jac:audit:minority-diff` で希少課題被覆（`data2`）と希少記述被覆（`raw_data`/`web-cache`）および高重複ペアの差分量を確認する。
  - しきい値は環境変数で調整可能:
    - `JAC_RARE_ISSUE_MAX_COUNT`
    - `JAC_RARE_CLAIM_TEXT_MAX_COUNT`
    - `JAC_RARE_CLAIM_MAX_EVIDENCE_COUNT`
- 統合禁止条件:
  - 希少課題（頻度しきい値以下）を主に受け持つカードを削除する案。
  - 高重複でも、`selectionBoundary`・`failureRisks`・`followUpQuestions`・`package` の差分が大きいペアの統合案。
- 例外条件:
  - 統合する場合は、上記差分を統合先カードへ明示移植し、`jac:audit:minority-diff` 再実行で劣化がないことを確認する。
