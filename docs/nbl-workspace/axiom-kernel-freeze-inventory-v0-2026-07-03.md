# Axiom Kernel Freeze Inventory v0 (2026-07-03)

## 目的

Fable 5世代（仮称 Prism）の開発着手に先立ち、「壊してはいけないAxiomの中核」を目録化し、凍結を宣言する。
新世代開発はこの目録のパスを**読み取り専用**として扱う。これにより、新世代の試行がどれだけ大胆でも、Axiomの中核資産は構造的に守られる。

対応gitタグ: `axiom-kernel-freeze-v0-2026-07-03`

## 凍結の理由

Axiomの本当の中核はTypeScriptコードではなく、**証拠に接地した知識構造と、Founder自身のレビュー履歴**である。
15項目カーネルコーパス、18単位のFounderレビュー受理、L3の27シード、ソースファミリー台帳、境界定義は、モデルやフレームワークを替えても再現できない資産であり、これらを入力として保全する限り、新世代開発でAxiomが壊れることはない。

## 凍結対象

### A. 証拠接地の知識・データ資産（再現不可・最重要）

- `data/specs/axiom/` — カーネルフィクスチャ一式（interaction hypothesis kernel v0、kernel build grounding input、real-derived evidence packet）
- `data/specs/canonical-maps/` — FCHMA因果フレームワークatlas、canonical concept maps
- `data/specs/` 配下のその他仕様フィクスチャ
- `references/` — 一次資料・ガイドラインPDF・調査資産・`references/axiom/`（Gate 8 preflight receipt）
- `config/knowledge-sources.json` — 信頼レベル付き知識ソース台帳

**git管理外（ローカルのみ・特に注意）:**

- `data/original_secure/` — 生の機微データ。輸出・公開・新世代からの直接参照は禁止のまま
- `data/analysis_ready/` — 分析可能化済みデータ
- `data/local_cache/`, `data/staging/` — 信頼済みキャッシュ・中間生成物

これらは `.gitignore` 対象でgit履歴に存在しない。**Synology Drive同期が唯一の保全機構**であり、凍結タグでは守れない。別媒体へのバックアップ確認を推奨する。

### B. カーネル推論・レビュー資産（`lib/axiom/` 内の知識系モジュール）

- `lib/axiom/interactionHypothesisKernel*.ts` — カーネル契約・決定論的L3評価器・グラウンディング契約・実データ証拠プロトコル・レビュー昇格パケット・シナリオフィクスチャ
- `lib/axiom/kernelCorpus*.ts` — 15項目コーパス読み出し・wave2読み出し・充足ゲート・人間レビューツール/パケット/結果受理・レビュー読み出しアダプタ
- `lib/axiom/sourceFamily*.ts`, `lib/axiom/manualDocumentSourceFamilyAttachment.ts` — ソースファミリー台帳・カバレッジ監査・スケールアップwave2
- `lib/axiom/realData*.ts` — 統合ドメイン知識オブジェクト・層別再解析・意味統合ポリシー/ラン・ファセットカバレッジ・L3対比レポート・Founderレビュー受理シェル
- `lib/axiom/allLayerIntegratedDomainKnowledge*.ts` — 全層統合ドメイン知識・Founderレビュー結果受理
- `lib/axiom/kernelDerived*.ts`, `lib/axiom/kernelSemantic*.ts`, `lib/axiom/workDesignView*.ts` — L3 27シード→ビュー導出の契約・意味再構成
- `lib/axiom/reviewedKernelBacked*.ts` — レビュー済みカーネル由来の公開コンテンツスロット・候補ページ組立・ルートマップ
- `__tests__/axiom-*.test.ts(x)` — 上記の回帰ガード（真理証明ではなく回帰防止として維持）

### C. ガバナンス・境界定義

- `docs/nbl-workspace/ops/control-plane-minimal-governance-core-v0-2026-05-13.md` — Minimal Governance Core（Green/Yellow/Red、公開境界、人間レビュー、active truth）
- `docs/nbl-workspace/axiom-development-charter-v0-2026-06-07.md` — Axiom開発憲章
- `docs/nbl-workspace/axiom-second-opinion-control-reset-v0-2026-06-12.md` — 統制リセット（シェル増殖凍結・レビュー1点集中）
- `docs/nbl-workspace/axiom-portable-expert-reasoning-skill-v0-2026-07-01.md` — ポータブル専門推論スキル（カーネルの可搬形）
- `docs/nbl-workspace/Axiom流の就労支援知識・スキル.md`
- `skills/` — fchma-north-star / fchma-architecture / fchma-domain-icf-icd / fchma-data-foundation / fchma-anti-swamp / fchma-delivery / nbl-expert-agent / nbl-public-copy-risk-review / campaign-content-boundary / official-source-triage
- `AGENTS.md` の Mission / Product North Star / Main Analytic Frames（ICF=主分析フレーム、ICD=正規化・索引のみ）

### D. データ基盤生成パイプライン

- `scripts/data_foundation/` — Stage1コアカーネル構築・2001abc三者連環・nanbyo_survey_4000系の分析/構築スクリプト群
- `scripts/axiom/` — Gate 8 preflightランナー

### E. 現行デリバリー層（凍結・ただし将来置換可能）

- `components/axiom/`, `components/axiomSetsutenLab/`
- `pages/internal/axiom-*`, Axiom公開ルート（nextNblPublishedRoutes配下）
- `lib/axiom/` の site* / packet / shell / receipt / preflight 系（Codex期の統制足場）
- `lib/axiomSetsutenLab/`

位置づけ: A〜Dと異なり**知識ではなく表現・統制の足場**であり、新世代による置き換え候補。ただし現行公開サイトの動作を支えているため、新世代トラックからの変更は禁止。置き換えは新名前空間に構築し、明示的なゲート通過後に切り替える。

## 凍結ルール

1. 新世代（Prism）ブランチ/ワークツリーから、上記凍結パスへの**書き込み・削除・移動は禁止**。読み取りは自由。
2. 新世代のコード・ドキュメントは新名前空間（`prism/`、`lib/prism/`、`.claude/agents/prism-*` 等）にのみ置く。
3. 新世代から `main` へのマージは、(1) 既存テスト全通過 (2) 境界チェックリスト通過 (3) Founder承認、の3ゲートを必須とする。
4. `data/original_secure/` の生データは新世代パイプラインから直接参照しない。カーネル（B）と統合ドメイン知識オブジェクトを唯一の入口とする。
5. 凍結の解除・対象変更は、本ドキュメントの改訂版（v1以降）として明示的に行う。暗黙の例外は認めない。

## 境界

本ドキュメントは凍結宣言であり、公開承認・publication・runtime/model/schema変更・source/support validity判断・candidate_pattern昇格・学習更新のいずれでもない。
