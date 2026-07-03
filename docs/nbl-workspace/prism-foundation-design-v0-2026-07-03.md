# Prism Foundation Design v0 (2026-07-03)

## 位置づけと仮称

Heron（Claude Code, 2026-04）→ Falcon（Codex）→ Axiom（Codex改修）に続く、Fable 5世代の開発トラック。

仮称 **Prism**: Axiomのマニフォールド存在論（潜在不変構造が多様な表現形として現れ、人間の概念はその部分的な影である）に対応する。凍結されたAxiomカーネル＝光源、Prism＝その光をNBLサイト・SNSという複数の表現形へ屈折させる装置。コードネームは変更可能。

前提: [Axiom Kernel Freeze Inventory v0](axiom-kernel-freeze-inventory-v0-2026-07-03.md) の凍結ルールに全面的に従う。

## 目的

NBLサイトとSNSの**両方を貫く共通基盤**を建てる:

> カーネル（凍結・読み取り専用）→ 素材選定 → 起草 → 境界レビュー → Founder承認 → 出力先別レンダリング（サイトページ / SNS投稿）

サイトもSNSも、この単一パイプラインの**出口の違い**にすぎないものとして設計する。専門性の中核はAxiomカーネルにあり、Prismは翻訳・編集・統制・配信を担う。

## 非目標

- Axiomカーネルの再構築・変更（凍結目録A〜D）
- 公開承認・publication・runtime/model/DB/schema変更・source/support validity判断・candidate_pattern昇格・学習更新
- 個別ケースへの確定判断・助言断定（わらいふ検証で確立した「翻訳ツール」原則: 観察・問い・反証を出し、断定と助言をしない）

## 設計原則

1. **カーネル読み取り専用** — 凍結目録に準拠。Prismはカーネルの消費者であり、編集者ではない。
2. **プロセス足場の軽量化** — Codex期は統制をコードに焼き付ける必要があった（receipt/shell/packet/gateの連鎖、`lib/axiom/` の統制系数十ファイル）。Fable/Sonnet世代では、統制は**エージェント役割定義＋チェックリスト＋git履歴**で実現し、コードには知識と表現だけを置く。統制コードの再生産を明示的に禁止する。
3. **人間ゲートは「1点・1画面・1判断」** — 公開に至るものは必ずFounder承認を通る。ただし継承するのはMinimal Governance Coreの**判断基準**（Green/Yellow/Red、公開境界）であって、Codex期の手続き様式ではない。官僚主義の再現を防ぐため次を固定する:
   - ゲートは公開直前の**1つだけ**。中間承認ゲートを作らない。中間品質はguardianら エージェントが担い、Founderには最終判断だけを上げる。
   - 承認の形式は ApprovedContentObject の `founderDecision` フィールドへの記入**のみ**。承認のための受理書・台帳・manifest・packet・shellの類は生成禁止。
   - Founderが読む承認材料は1件につき**1画面以内**（本文＋kernelTrace＋guardian所見＋反証。それ以上の説明文書を添付しない）。
   - 承認記録はオブジェクト自身とgit履歴が兼ねる。専用の記録文書を作らない。
4. **一物多形** — 承認されるのは出力先非依存の `ApprovedContentObject`（後述）。サイトページとSNS投稿は同一承認済みオブジェクトの別レンダリング。承認の二重管理をなくす。
5. **トレーサビリティ** — すべてのコンテンツ候補はカーネルのどの要素（コーパス項目・統合ドメイン知識・27シード・ソースファミリー）に接地しているかのトレースを持つ。接地なしの生成は境界レビューで自動差し戻し。

## アーキテクチャ

```
L0  Frozen Axiom Kernel（入力・読み取り専用）
     └ 凍結目録A〜Dの資産

L1  Kernel Gateway  — lib/prism/kernelGateway.ts
     凍結資産への型付き読み取りAPIを1モジュールに集約。
     Prism側はこのゲートウェイ経由でのみカーネルに触れる。
     （既存の多数のadapter/packetを新世代用に1つの明確な入口へ）

L2  Dream Team  — .claude/agents/prism-*.md
     Fable 5がオーケストレーション。実装系はSonnet 5。

L3  Content Pipeline
     素材選定 → 起草 → 境界レビュー → Founder承認キュー → 出力アダプタ
     中核データ型: ApprovedContentObject

L4  出力アダプタ
     ├ Site Renderer（次期NBLページ。Falcon 9ページ資産・8つの課題等は素材として継承検討）
     └ SNS Renderer（チャネル別フォーマット。自律発信はPhase後半、承認済みオブジェクトのみ）
```

## ドリームチーム構成（L2）

| エージェント | 役割 | モデル |
|---|---|---|
| `prism-axiom-expert` | 専門性の声。ポータブル専門推論スキル（2026-07-01版）を搭載。ICF主フレーム・ICD正規化のみ・反証併記・断定/助言ゼロ | fable/opus |
| `prism-information-architect` | サイトIA・ナビゲーション・ページ役割設計。Falcon 9ページ機能パリティ資産を素材に再設計 | fable/opus |
| `prism-chief-editor` | 公開日本語文言・トーン・読者の認知負荷設計。「8つの課題」等の既存編集資産を継承評価 | fable/opus |
| `prism-boundary-guardian` | 公開境界の番人。**差し戻し権を持つ**。制度事実の一次資料確認（雇用率2.7%=R8.7施行等の時限性チェック含む）、助言断定・機微輸出・個別ケース確定判断・接地なし生成のブロック | fable/opus |
| `prism-sns-strategist` | チャネル別フォーマット・頻度・社会との往復設計。発信だけでなく反応の取り込み方針も設計（ただし学習更新はしない） | fable/opus |
| `prism-engineer` | 実装。設計書とレビューコメントに従いコードを書く | **sonnet** |
| `prism-qa` | テスト・回帰・アクセシビリティ・既存サイト無影響の検証 | **sonnet** |

運用: Fable（本体）が設計・タスク分割・統合レビューを担い、実装タスクをAgentツールで `prism-engineer`（Sonnet 5）へ委任する。ナミノートv0/v0.5で実証済みの分業と同型。

## ApprovedContentObject（L3の要）

サイトとSNSを貫く承認単位。最低限のフィールド:

- `id`, `title`, `bodyJa` — 内容
- `kernelTrace[]` — 接地しているカーネル要素への参照（必須・空なら不受理）
- `boundaryReview` — guardian のチェック結果と残存注意（必須）
- `counterHypotheses[]` — 反証・別解釈（翻訳ツール原則）
- `founderDecision` — 承認/保留/差し戻し + 日付（承認なしに L4 へ渡らない）
- `renderTargets[]` — site / sns の別と各アダプタ向けヒント

## フェーズ計画

- **P0 凍結（2026-07-03 完了）** — 凍結目録作成、gitタグ `axiom-kernel-freeze-v0-2026-07-03`
- **P1 本設計書のFounderレビュー（2026-07-03 承認済み。修正1件: 人間ゲートを「1点・1画面・1判断」に固定し官僚主義の再現を禁止）**
- **P2 基盤実装（Sonnet 5委任、Fableレビュー）** — ブランチ `prism/foundation` を別ワークツリーで作成し、(1) `lib/prism/kernelGateway.ts` (2) `ApprovedContentObject` 契約＋テスト (3) `.claude/agents/prism-*.md` チーム定義、を実装
- **P3 パイロット** — 同一の ApprovedContentObject 1件から、サイトページ候補1本とSNS投稿候補1本を生成し、境界レビューを通してFounder承認キューまで到達させる（公開はしない）
- **P4 評価** — Axiom現行デリバリー層との比較でFounderが置き換え可否を判断。可の場合のみ切り替え設計へ

## リスクと手当

- **Axiomを壊す** → 凍結目録＋別ワークツリー＋3ゲートマージで構造的に遮断
- **統制足場の再肥大** → 設計原則2で統制コード再生産を禁止。guardianの差し戻しはgit上のレビュー記録として残す
- **承認手続きの官僚化（Codex期の悪夢の再現）** → 設計原則3の「1点・1画面・1判断」で固定。承認関連の新規文書種別は、Founderが明示的に求めた場合にのみ追加できる（エージェント側からの提案・自動生成は禁止）
- **SNS自律発信の暴走** → P3までは承認キュー止まり。自律投稿はP4以降に別途設計・別途Founder承認
- **新旧二重管理** → P4で置き換え判断するまで、公開系の変更は現行Axiomトラックのみで行う

## 境界

本ドキュメントは設計書であり、公開承認・publication・runtime/model/schema変更・source/support validity判断・candidate_pattern昇格・学習更新のいずれでもない。実装着手（P2）はFounderのP1承認後。
