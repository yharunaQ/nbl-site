# 仕事設計の見取り図 開発要約

更新日: 2026-03-20
用途: public-safe な説明文とインフォグラフィック設計の根拠整理

## 1. この見取り図をどう説明するか

仕事設計の見取り図は、単なる思いつきではない。
このプロジェクトでは、公開知識、調査データ、実務記述、ナラティブ、編集用ガイドを AI で横断整理してきたが、その前提として `既存情報は中立ではない` という立場を取る。障害に関する多くの情報は、古い障害概念モデル、欠陥中心の見方、能力主義、診断決め打ち、差別や偏見に関連するバイアスに汚染されているため、そのまま集約すると過去の誤解を再生産しやすい。

そのため NBL では、まず ICF に基づく相互作用モデルと条件つき因果の見方を土台に、既存情報を批判的かつ限定的に整理する。何が本人要因で、何が仕事・環境・支援・制度との相互作用なのかを切り分け、その上で現在の生成AIの文脈理解を使って再統合し、3レイヤーと26フレームへ単純化してきた。

外から見えるのは最も単純化した入口であり、その背後には次の層がある。

- 古い障害観に汚染された情報の批判的フィルタ
- ICFベースの相互作用モデルと条件つき因果の整理
- data2 の類型化と index 化
- knowledge claims の蓄積
- 難病GLMの有意関連
- 26フレームへの再編集
- 法政策・地域支援・個別事情をどこまで外へ逃がすかの境界設計
- wording / coverage / minority / tier の監査

## 2. 2026-03-20 時点で public に使える根拠

### データと知識の母集団

- `references/data2/index/data2-knowledge-index.json`
  - 52 類型
  - 1076 課題行
  - 201 narrative highlights
- `references/index/knowledge-claims.jsonl`
  - 4914 行
- `references/GLM_resutls/nanbyo-glm-metrics.json`
  - 4 sheets
  - significant relations 539
  - unique predictors with significant relation 209

### 26フレーム化と編集

- `scripts/jac/build-common-design-copy.mjs`
  - `pages/jac/guide.tsx` の `PATTERN_CARDS` と `CARD_MINING_PROFILES`
  - data2 index
  - knowledge claims
  を横断して `references/jac/common-work-design-copy.json` を生成
- `scripts/jac/generate-26-narrative-atlas.mjs`
  - 26フレームを narrative atlas へ展開
- `docs/guidebook/jac-26-card-edition.md`
  - 3レイヤーを全体地図、カードを現場で使う最小単位として整理

### 境界設計

- `references/jac/card-tier-policy.json`
  - 26カードの expected tier を保持
- `references/jac/layer-disposition.json`
  - 法政策差と地域支援の詳細を、カード本体へ厚く混ぜず、どこまで残すかを 5 重点カードで整理
- `docs/jac-26frame-update-review-memo.md`
  - 重点カードで、どの論点をカード本体に残し、どれを共通レイヤーや別ガイドへ逃がしたかを確認

### 監査結果

- `node scripts/jac/audit-tier-alignment.mjs`
  - 26/26 aligned
  - mismatch 0
- `node scripts/jac/audit-uncovered-issues.mjs`
  - 1076/1076 covered
  - uncovered 0
- `node scripts/jac/audit-readiness.mjs`
  - tier mismatch 0
  - uncovered rows 0
  - low-diff high-overlap pairs 0
  - actionable uncovered raw/web 0
  - ただし wording review required 3 件のため `overallStatus: NOT_READY`
- `node scripts/jac/audit-wording-grounding.mjs`
  - review required 3 件
  - 現状は `夜勤` と `視覚` の grounding に追加確認が必要

## 3. public-safe に言えること

- 単発の思いつきではなく、複数の情報源を AI で横断整理し、監査しながら単純化したフレームワーク
- ただ集めたのではなく、古い障害観や診断決め打ちをそのまま再生産しないため、ICF に基づく相互作用モデルで批判的に読み替えている
- 表に見えている 3レイヤーと26フレームは、背後の知識体系を最初の対話で使える形に絞ったもの
- 26フレームだけで個別事情を決めるのではなく、本人、仕事、環境、支援、時間、制度の条件を重ねて使う
- 今後の個別AI整理や human review に接続する土台として設計している

## 4. public では言い過ぎになること

- 「世界中の情報をすべて網羅した」
- 「最新理論を完全に代表している」
- 「この見取り図だけで個別判断できる」
- 「すでに常設の個別AI相談サービスが稼働している」

上の表現は、現状のローカル証拠からは言い過ぎになりやすい。
代わりに、`国内外の公開知識や調査データをAIで横断整理し`、`監査しながら単純化した` と表現するのが安全。

## 5. public copy の叩き台

### 短い説明

この見取り図は、単なる思いつきではありません。
障害に関する既存情報に含まれる古い障害観や診断決め打ちをそのまま使わず、ICF に基づく相互作用モデルで批判的に読み替えたうえで、公開知識、調査データ、実務の声を AI で横断整理し、3レイヤーと26フレームへ単純化したものです。

### もう一段詳しい説明

見えているのは最も単純化した入口です。
背後では、52類型、1076課題行、201 narrative、4914 claims、難病GLMの有意関連などを土台に、古い障害観の批判的フィルタ、相互作用モデルでの整理、AI による文脈つき再統合、境界設計、未カバー確認を重ねています。

### 個別化への橋

この地図は、最初の共通言語をつくるためのものです。
実際の整理では、本人、仕事、環境、支援、時間、制度の条件を重ね、必要な場面では human review や外部支援へ戻します。

## 6. 新インフォグラフィックで見せるべき構図

1. 入力: 公開知識、調査、記述、ナラティブ
2. 批判的フィルタ: 古い障害観 / 診断決め打ち / 欠陥中心の説明をそのまま使わない
3. ICFベース整理: 相互作用モデル / 条件つき因果
4. AI による再統合: claims / relations / issue patterns
5. 単純化: 3レイヤー + 26フレーム + 条件軸
6. 監査: tier / uncovered / wording / minority
7. 接続先: 個別整理、AI支援、人の判断

## 7. 参照ファイル

- `docs/jac-common-work-design-runbook.md`
- `docs/jac-26frame-update-review-memo.md`
- `docs/nbl-workspace/jac-positioning-round-2026-03-16.md`
- `docs/nbl-workspace/jac-foundations-round-2026-03-17.md`
- `docs/guidebook/jac-26-card-edition.md`
- `docs/guidebook/frames-26-layer-summary.md`
- `references/data2/index/data2-knowledge-index.json`
- `references/index/knowledge-claims.jsonl`
- `references/GLM_resutls/nanbyo-glm-metrics.json`
- `references/GLM_resutls/nanbyo-glm-significant-relations.json`
- `references/jac/card-tier-policy.json`
- `references/jac/layer-disposition.json`
- `references/jac/card-count-robustness-k20-34.json`
- `scripts/jac/build-common-design-copy.mjs`
- `scripts/jac/generate-26-narrative-atlas.mjs`
- `scripts/jac/audit-tier-alignment.mjs`
- `scripts/jac/audit-uncovered-issues.mjs`
- `scripts/jac/audit-wording-grounding.mjs`
- `scripts/jac/audit-readiness.mjs`
