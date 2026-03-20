# 就業共通設計 化 監査チェックリスト

更新日: 2026-03-02
対象: 26フレームの名称/要約/ポイント/導線

## A. Holistic Positioning

- Scope of source
  - data2 / raw_data / web-cache / GLM のどれに基づく記述か明記されている
- Covered lenses
  - difficulty_occurrence
  - difficulty_resolution
  - symptom_work_interaction
  - support_need_formation
- Missing lenses
  - 欠落レンズがあれば「追加確認質問」で補う導線がある

## B. Bias / Discrimination Risk

`risk_level: high` 判定条件（1つでも該当でhigh）:
- 診断名だけで可否を断定
- 個人努力不足へ帰責する表現
- 条件確認なしの処方箋型提案
- 法域差を無視した法制度記述

`risk_level: medium`:
- レンズ不足がある
- 根拠トレースが弱い
- 条件文が曖昧

`risk_level: low`:
- 条件付き表現で統一
- 4レンズを跨ぐ説明
- 不確実性と再評価条件が明示

## C. Missing Context Checks（7観点）

- person
- job
- environment
- support
- time
- institution
- evidence

判定:
- 重大欠落が1つでもあれば「個別相談へ条件持ち込み」導線を必須化

## D. MECE / 境界監査

- 隣接フレームとの境界が1行で説明できる
- 「選ぶ条件」と「非適用条件」が両方ある
- タイトルだけで見分けづらいペアが残っていない

## E. Actionability

- ポイントが抽象語で終わっていない
- 1週間以内に試せる初手がある
- 観測KPIまたは再評価トリガーがある

## F. 公開導線整合

- ガイド: 共通設計の入口として読める
- 冊子: 現場運用に落ちる
- 個別相談: 条件最適化の受け皿として明確

## G. 監査結果フォーマット

```md
## Frame: <id>
- Risk level: low|medium|high
- Risk factors: ...
- Missing contexts: ...
- MECE note: ...
- Actionability note: ...
- Required fix: ...
```
