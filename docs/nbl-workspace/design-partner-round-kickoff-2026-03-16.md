# Design Partner Round Kickoff

更新日: 2026-03-16

## この文書の役割

この文書は、`最初の design partner を employer に置くか、intermediary に置くか` を、Codex のマルチエージェント運用で実際に回すための kickoff pack。

`docs/nbl-business-agent-briefs.md` が役割定義なら、こちらは `今回の round をどう実行するか` を固定する実務メモである。

## Round Question

- いまの NBL が最初に狙うべき design partner は:
  - `employer` か
  - `intermediary` か

補助問い:

- どちらが recurring model に乗りやすいか
- どちらが partner edge と human review boundary を安全に置きやすいか
- どちらが NBL の `社会OS` という事業定義を育てやすいか

## この round のゴール

この round では、次の 4 つを決める。

1. 最優先で当たりにいく design partner profile
2. second-best profile
3. 断るべき相手の条件
4. discovery の最小実験手順

## 使う agent

Round A:

- Distribution Lead
- Revenue Architect
- Partnership Lead

Round B:

- Safety and Boundary Lead

Round C:

- Validation Ops Lead

Round D:

- Chief of Staff

今回は `Offer Packaging Lead` は任意。
最初の相手を決めることが主目的なので、package naming は後段でもよい。

## 共通入力

全 agent に最初に渡す。

- `docs/nbl-codex-operating-model.md`
- `docs/nbl-business-agent-briefs.md`
- `docs/nbl-workspace/ai-operating-principles-2026-03-16.md`
- `docs/nbl-workspace/business-structure-round-2026-03-16.md`
- `docs/nbl-workspace/business-validation-round-2026-03-16.md`
- `docs/nbl-workspace/decision-log.md`

## 各 agent への追加指示

### Distribution Lead

追加で問うこと:

- employer と intermediary のどちらが trust channel と revenue channel を両立しやすいか
- public resources からどちらへ自然につながるか
- 最初の 3 件の outreach の打ち先はどちらか

### Revenue Architect

追加で問うこと:

- startup + recurring + bounded usage を、どちらの相手なら通しやすいか
- employer と intermediary で pricing friction はどう違うか
- 無理な値付けや scope creep が起きやすいのはどちらか

### Partnership Lead

追加で問うこと:

- partner edge をどちらが担いやすいか
- legitimacy と safeguard を、どちらの方が先に確保しやすいか
- NBL の core intelligence を薄めやすい提携形態はどちらに多いか

### Safety and Boundary Lead

追加で問うこと:

- employer 直販と intermediary 経由で、障害・病気・合理的配慮文脈の risk はどう違うか
- missing context が起きたときに、誰が human review boundary を引き受けるか
- diagnosis-only framing や unsafe automation pressure が強まりやすいのはどちらか

### Validation Ops Lead

追加で問うこと:

- 2 週間で回せる discovery sequence はどちらか
- 最初の partner scorecard に必要な項目
- confirm / falsify を何で判定するか

### Chief of Staff

追加で問うこと:

- どこまで一致したか
- disagreement の本質は何か
- provisional decision と next experiment を 1 枚に圧縮できるか

## Codex 上での回し方

1. メインスレッドを `Chief of Staff` にする
2. 5 本の別スレッドを開く
3. Round A の 3 role を parallel で走らせる
4. Round A の結果を Safety and Boundary Lead に渡す
5. Round A + B を Validation Ops Lead に渡す
6. 最後に Chief of Staff が統合する

重要なのは、各 agent に `全部考えさせない` こと。
1 role 1 responsibility に切る。

## 各 agent の期待出力

各メモは 500-900 words 程度に抑える。

必須見出し:

```md
## What seems strongest
- ...

## What seems risky
- ...

## What needs to be true
- ...

## Provisional recommendation
- ...
```

Safety and Boundary Lead だけは、下記も必須。

```md
## AI-supported zone
- ...

## Must-escalate zone
- ...

## Missing context
- ...
```

## Chief of Staff の統合フォーマット

Chief of Staff は最後に次の形へ圧縮する。

```md
## Decision
- first design partner profile:
- second-best profile:
- avoid profile:

## Why
- ...

## What must be true
- ...

## Next experiment
- outreach target:
- evidence to collect:
- falsification trigger:
```

## 今回の暫定見立て

現時点では、仮説としては次が強い。

- first candidate:
  - employer network を持つ intermediary
- second candidate:
  - design-forward employer

理由:

- employer 単体より context transfer が効きやすい
- partner edge を置きやすい
- human review boundary を外部に接続しやすい
- recurring layer を組みやすい

ただし、これはまだ `仮説`。
distribution / pricing / safety を別々に検証してから Chief of Staff が統合する。

## Round 完了の定義

この round は、次が埋まったら完了。

- first design partner profile が 1 つに絞れている
- scorecard が 5-8 項目で言語化されている
- outreach の最初の 3 target condition が決まっている
- must-escalate boundary が明文化されている
- decision log に provisional entry を追加できる

## 次の round への接続

この round が終わったら、次はこれ。

- `first commercial package を employer 用と intermediary 用で分けるか`

そのときは `Offer Packaging Lead` を本格参加させる。
