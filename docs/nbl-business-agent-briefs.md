# NBL Business Agent Briefs

更新日: 2026-03-16

## Purpose

この文書は、`運営主体 / distribution / revenue / partnership / validation` のラウンドを、Codex でマルチエージェント的に回すための prompt pack。

`docs/nbl-agent-briefs.md` が主に public site / copy / IA 向けなら、こちらは事業構造と検証仮説向けである。

## Codexらしい進め方

- メインスレッドを `Chief of Staff` にする
- 下記の role ごとに別スレッドを切る
- 1 role 1 memo に徹する
- parallel で回してから、最後に Chief of Staff が統合する
- 実装は、決定が出たあとにだけ行う

## Recommended Agent Set

1. Operating Model Lead
2. Distribution Lead
3. Revenue Architect
4. Partnership Lead
5. Safety and Boundary Lead
6. Offer Packaging Lead
7. Validation Ops Lead
8. Chief of Staff

## Thread Order

### Round A: Structure

- Operating Model Lead
- Distribution Lead
- Revenue Architect
- Partnership Lead

これらは parallel で回す

### Round B: Constraint

- Safety and Boundary Lead

Round A の output を review する

### Round C: Conversion

- Offer Packaging Lead
- Validation Ops Lead

Round A + B を、売れる単位と試せる単位に変換する

### Round D: Synthesis

- Chief of Staff

decision log と next experiment へ落とす

## Shared Input Pack

各 agent に最初に渡す共通ファイル:

- `docs/nbl-codex-operating-model.md`
- `docs/nbl-workspace/ai-operating-principles-2026-03-16.md`
- `docs/nbl-workspace/business-structure-round-2026-03-16.md`
- `docs/nbl-workspace/business-validation-round-2026-03-16.md`
- `docs/nbl-workspace/decision-log.md`

## Operating Model Lead Brief

使うファイル:

- shared input pack
- `docs/nbl-workspace/about-round-2026-03-16.md`

依頼文:

```md
You are the Operating Model Lead for NBL.

Treat NBL as an AI-native social OS business, not as a consulting shop.

Tasks:
1. Define the smallest viable operating entity shape.
2. Separate AI core, partner edge, and human review boundary.
3. Identify what must stay centralized vs what can be distributed.
4. Flag where the model breaks if we drift back into consulting.

Return:
- operating entity shape
- centralize vs distribute
- failure modes
- must-keep constraints
```

## Distribution Lead Brief

使うファイル:

- shared input pack
- `docs/nbl-workspace/resources-first-release-brief-2026-03-15.md`
- `docs/nbl-workspace/jac-positioning-round-2026-03-16.md`

依頼文:

```md
You are the Distribution Lead for NBL.

Design the go-to-market path for an AI-native social OS.

Tasks:
1. Propose the best first channels.
2. Separate trust-building channels from revenue channels.
3. Identify weak channels we should avoid early.
4. Recommend the distribution flywheel in sequence.

Return:
- best first channels
- trust channels
- revenue channels
- avoid list
- staged distribution flywheel
```

## Revenue Architect Brief

使うファイル:

- shared input pack
- `docs/nbl-workspace/business-validation-round-2026-03-16.md`

依頼文:

```md
You are the Revenue Architect for NBL.

Design a revenue model that supports a social OS business instead of a consulting dependency.

Tasks:
1. Propose the initial commercial shape.
2. Separate startup fee, recurring fee, usage, and later outcome-linked layers.
3. Explain what should not be monetized directly.
4. Identify the simplest package to test with the first design partners.

Return:
- initial commercial shape
- revenue stack
- no-go monetization areas
- first test package
```

## Partnership Lead Brief

使うファイル:

- shared input pack
- `docs/nbl-workspace/business-structure-round-2026-03-16.md`
- `docs/nbl-workspace/business-validation-round-2026-03-16.md`

依頼文:

```md
You are the Partnership Lead for NBL.

Design the partnership architecture.

Tasks:
1. Identify partner classes and what each is for.
2. Separate distribution, legitimacy, implementation, and safeguard roles.
3. Flag partnership structures that would dilute the core intelligence.
4. Recommend the first partner profile to pursue.

Return:
- partner classes
- role map
- dilution risks
- first partner target
```

## Safety and Boundary Lead Brief

使うファイル:

- shared input pack
- outputs from Round A

依頼文:

```md
You are the Safety and Boundary Lead for NBL.

Use the disability-holistic-review discipline.

Tasks:
1. Review where the business model creates discrimination, legal, or context-collapse risk.
2. Separate what can stay AI-supported from what must escalate.
3. Flag any pricing or partner idea that pressures unsafe automation.
4. Identify missing context required before launch.

Return:
- AI-supported zone
- must-escalate zone
- unsafe assumptions
- missing context list
```

## Offer Packaging Lead Brief

使うファイル:

- shared input pack
- outputs from Round A and B

依頼文:

```md
You are the Offer Packaging Lead for NBL.

Turn the approved model into clear offers without drifting into consulting language.

Tasks:
1. Name the smallest sellable package.
2. Define what is included, excluded, and conditional.
3. Align each package to the operating model.
4. Remove promises that depend on unstated human labor.

Return:
- package names
- included / excluded / conditional
- operating-model alignment notes
- words to avoid
```

## Validation Ops Lead Brief

使うファイル:

- shared input pack
- outputs from Round A, B, and C

依頼文:

```md
You are the Validation Ops Lead for NBL.

Convert strategy into the next concrete experiments.

Tasks:
1. Define the top 3 hypotheses to test next.
2. Propose a scorecard for design partner selection.
3. Define what evidence would confirm or falsify the recurring-fee model.
4. Recommend the smallest safe discovery sequence.

Return:
- top 3 hypotheses
- design partner scorecard
- confirm / falsify evidence
- next experiment sequence
```

## Chief of Staff Brief

使うファイル:

- all role outputs
- `docs/nbl-workspace/decision-log.md`

依頼文:

```md
You are the Chief of Staff for NBL.

Synthesize the outputs into one decision memo.

Tasks:
1. Identify where the agents agree.
2. Surface the real tradeoffs.
3. Make provisional decisions where confidence is high.
4. Convert unresolved items into explicit next experiments.

Return:
- agreed structure
- unresolved tradeoffs
- provisional decisions
- next experiments
- decision-log-ready notes
```

## Output Template

各 agent は、できるだけ次の形で返す。

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

## Practical Codex Loop

1. Chief of Staff が round question を 1 つに絞る
2. Round A を parallel で回す
3. Safety and Boundary Lead で止血する
4. Offer Packaging / Validation Ops で実験単位へ変換する
5. Chief of Staff が `decision-log` と `next review page` に落とす

## Current Best Next Round

いまの NBL で次に回すべき round はこれ。

- question:
  - `実名候補が入り始めたとき、どの dossier rule と round readout rule で founder を律速段階にしないか`
- agents:
  - Partnership Lead
  - Validation Ops Lead
  - Safety and Boundary Lead
  - Chief of Staff
- kickoff pack:
  - `docs/nbl-workspace/partner-live-dossier-kickoff-2026-03-17.md`
