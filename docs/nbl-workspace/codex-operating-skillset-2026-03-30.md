# Codex Operating Skillset

更新日: 2026-03-30
Status: working draft

## 1. Purpose

この文書は、Codex の長期運用で会話依存を減らし、設計・計画・実装を一貫して進めるための固定資産である。

役割:

- north star を失わない
- 局所最適や沼にはまらない
- 自律的に進める範囲と止まる条件を明確にする
- ICF 主分析と ICD 正規化の役割分担を固定する

## 2. Fixed Operating Skills

### Skill A: Product North Star Preservation

チェック項目:

- チャット UI 中心に流れていないか
- FAQ 検索中心に流れていないか
- 病名から支援策へ短絡していないか
- ケース構造の可視化と編集が中心に残っているか

### Skill B: Architecture Coherence

チェック項目:

- UI、API、DB、AI orchestration、監査ログ、分析レイヤの責務が混ざっていないか
- case-centered design を維持しているか
- 原テキストと構造化結果の往復可能性があるか
- human edits を独立資産として保持しているか

### Skill C: Delivery Without Waiting

Codex が自律的に進めてよいもの:

- ローカル実装詳細
- ファイル分割
- 小規模 refactor
- テスト追加
- ドキュメント更新
- 軽微な UI 調整

止まるべきもの:

- 大きな DB スキーマ変更
- 認証モデル変更
- コア情報設計変更
- 外部依存追加
- 主要 UX 変更
- スコープ変更

### Skill D: Anti-Swamp Protocol

沼の兆候:

- 同じ層で修正が往復する
- 主要価値に寄与しない細部を長く触る
- 代替案比較なしに深掘りする
- 主要進捗が止まる

対応:

1. 深掘りを止める
2. 学んだことを要約する
3. `minimal / robust / compromise` を出す
4. 推奨案を明示する

### Skill E: Artifact-first Development

原則:

- 重要な判断は `AGENTS.md`、`PLANS.md`、設計文書へ反映する
- 実装だけして文書を置き去りにしない
- TODO、計画、設計文書を同期する

### Skill F: Human-AI Boundary Discipline

AI にやらせること:

- 文脈的意味連鎖候補抽出
- ICF 要素候補抽出
- ICD 病名正規化候補提示
- 関係候補提示
- 構造型候補提示
- 類似ケース候補提示
- 支援仮説候補提示
- 対抗仮説提示

AI にやらせないこと:

- ケースの最終見立て確定
- 単独での支援決定
- 監査なしの学習反映
- 倫理判断の最終決定

### Skill G: ICD-ICF Dual Framing

原則:

- ICF を主分析に使う
- ICD は病名や診断名の正規化と索引化に使う
- ICD を因果説明の主軸にしない
- 類似ケース検索では `ICF構造類似 > 介入履歴類似 > ICD一致` を守る

## 3. TODO Operating Rule

TODO は 3 層で扱う。

### Strategic TODO

- プロダクト全体に影響するもの
- 例: case-centered design、AI 責務分離、ICD と ICF の統合方針

### Delivery TODO

- 現在イテレーションで完了させるもの
- 例: case intake 画面、ICF 抽出 API、review UI

### Local TODO

- 実装上の細部
- 例: バリデーション、型修正、spacing

原則:

- Local TODO は Strategic TODO を壊してはいけない
- Delivery TODO を優先する
- TODO 完了時は必要に応じて `AGENTS.md` と `PLANS.md` を更新する

## 4. Proposed Repo-local Skill Split

将来的に skill として分けるなら、次の 5 本が自然である。

- `product-north-star`
- `architecture-coherence`
- `delivery-without-waiting`
- `anti-swamp`
- `domain-icf-icd`

repo で実際に運用する skill set としては、さらに次を加える。

- `data-foundation`

この段階では、まず repo 内文書として保持し、必要になったら actual skill folder に昇格させる。

## 5. ICD and ICF Implementation Stance

### ICF

- ケース構造
- 相互作用
- 介入可能点
- 支援仮説の主分析

### ICD

- disease label normalization
- 表記揺れ吸収
- ケース検索補助
- 集計補助

### UI rule

- ケース画面の中心は ICF 構造図
- ICD は背景情報として表示する
- 類似ケースでは `ICD類似` と `ICF構造類似` を分けて表示する

## 6. Suggested Session Startup Prompt

```text
Read AGENTS.md and PLANS.md first.
Work as an architect-builder hybrid, but preserve the product north star.
This product is a case-centered FCHMA-based consultation support system.
Use ICF as the main structural frame and ICD only for disease and diagnosis normalization and indexing.
Do not collapse the product into a disease-to-accommodation lookup system.
Do not drift into chat-first UX.
Do not wait for confirmation on local implementation details.
Stop and report before major schema, auth, IA, dependency, or scope changes.
If you detect rabbit-hole risk, stop and present 3 options: minimal, robust, compromise.
Update docs as you go.
```
