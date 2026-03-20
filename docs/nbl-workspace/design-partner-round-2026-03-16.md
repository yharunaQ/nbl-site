# Design Partner Round

更新日: 2026-03-16

## Scope

- 対象論点:
  - 最初の design partner を `employer` に置くか `intermediary` に置くか
  - recurring model に乗りやすい相手はどちらか
  - partner edge と human review boundary を安全に置ける相手はどちらか
  - 2 週間で回せる discovery の最小実験は何か

## Round Question

- first design partner profile は何か
- second-best profile は何か
- avoid profile は何か

## Distribution Lead Memo

## What seems strongest

- `employer network を持つ intermediary` は、public resources から private layer への橋を作りやすい
- employer 単体より、同種の friction を複数ケースで再利用しやすく、NBL の `社会OS` に必要な learning loop が回りやすい
- trust channel と revenue channel を分けやすい
  - trust:
    - resources
    - research / policy translation
    - disability / accessibility 文脈での credibility
  - revenue:
    - private workspace
    - workflow setup
    - recurring knowledge updates

## What seems risky

- intermediary は意思決定者が分散しやすく、導入責任者が曖昧だと PoC が止まりやすい
- public-good rhetoric が強い相手だと、startup fee や recurring fee が薄まりやすい
- employer 単体は decision speed が速いことがある一方で、1 社 custom project に閉じて learning が横展開しにくい

## What needs to be true

- intermediary 側に `employer-facing の明確な owner` がいる
- 導入目的が単発相談ではなく、workflow redesign や repeated use に向いている
- NBL の public resources から discovery conversation へつなぐ導線が作れる

## Provisional recommendation

- first candidate は `employer network を持つ intermediary`
- second-best は `design-forward employer`
- 最初の outreach は intermediary 2、employer 1 の比率で打つ

## Revenue Architect Memo

## What seems strongest

- `startup + recurring + bounded usage` は、intermediary の方が repeated demand を前提に説明しやすい
- employer 単体は予算責任者が明確で startup fee は通りやすいが、2 回目以降が custom support 扱いになりやすい
- intermediary は複数 employer / user context を束ねられるなら、recurring layer の説明に合う

## What seems risky

- intermediary が公益性を理由に `低単価での包括支援` を求めると、NBL が consulting dependency に戻る
- employer 直販は scope creep が起きやすい
  - 例:
    - 個別 case review
    - 社内調整同席
    - human labor の暗黙期待
- どちらの相手でも、pricing を先に出しすぎると boundary が曖昧なまま売ろうとしてしまう

## What needs to be true

- contract 上、料金対象が `人の相談件数` でなく `AI core / workflow / private workspace` に紐づいている
- overage や bounded usage が open-ended support に見えない
- first partner が `毎回 bespoke support を買う相手` でない

## Provisional recommendation

- first revenue hypothesis は intermediary 向けに置く
- ただし offer は invitation-only で、generic pricing はまだ public に出さない
- employer 直販は second lane として残すが、custom consulting request が強い相手は避ける

## Partnership Lead Memo

## What seems strongest

- intermediary は `partner edge` を担いやすい
  - contextualization
  - employer network access
  - field implementation
  - external escalation
- legitimacy と safeguard を同時に確保しやすい
- employer 単体だと現場実装は進みやすいが、safeguard を外部に持ちにくい

## What seems risky

- intermediary が white-label 的に NBL を下請け利用すると、core intelligence が薄まる
- employer 直販は `自社向けに全部合わせてほしい` 圧力が出やすい
- research / policy partner は legitimacy に効くが、最初の recurring revenue には直結しにくい

## What needs to be true

- partner edge と AI core の責任分界が契約上も説明上も明確である
- intermediary は `distribution` と `safeguard` を補うが、NBL の判断ロジックを置き換えない
- human review boundary を担う外部人材や組織の接続可能性がある

## Provisional recommendation

- first partner profile は `employer network を持ち、contextual review を引き受けられる intermediary`
- second-best は `internal sponsor と implementation appetite を持つ employer`
- avoid は `white-label resale only` の intermediary と `headcount reduction logic` の employer

## Safety and Boundary Lead Memo

## Holistic Positioning

- Scope of source:
  - NBL の operating model、business structure / validation round、障害・就労文脈での escalation 前提
- Covered lenses:
  - `difficulty_occurrence`
  - `difficulty_resolution`
  - `support_need_formation`
- Missing lenses:
  - 実際の partner 候補が持つ review capability
  - contract 上の escalation SLA

## What is currently usable

- Usable now (with conditions):
  - intermediary first 仮説を置くこと
  - employer 直販を second-best として残すこと
  - partner candidate scorecard に boundary 項目を入れること
- Not yet usable:
  - intermediary だから安全とみなすこと
  - employer だから危険とみなすこと
  - missing context のまま accommodation relevant judgment へ進むこと

## Bias/Discrimination Risk

- Risk level: medium
- Risk factors:
  - intermediary が diagnosis-based の一般論を複数 employer に横流しすると、context collapse risk が上がる
  - employer 直販で HR automation pressure が強いと、employment action への unsafe drift が起きやすい
  - pricing pressure が強い相手だと、human review boundary を省略しやすい

## Additional Information Required

- Must-have questions:
  - human review boundary を誰が引き受けるか
  - employer / intermediary のどちらが person / job / environment / support / time / institution の確認を実務で持てるか
  - diagnosis-only framing を拒否する運用に同意できるか
- Nice-to-have questions:
  - de-identified case learning をどこまで共有できるか
  - escalation 時の expected turnaround は何日か

## AI-supported zone

- issue structuring
- workflow mapping
- resource suggestion
- first-draft documentation
- missing-context question generation

## Must-escalate zone

- hiring, firing, demotion, discipline, return-to-work final decisions
- medical or diagnostic interpretation
- crisis, self-harm, abuse, acute safety
- major missing context cases
- requests for certainty where evidence is partial

## Missing context

- partner の actual review capacity
- contract boundary の文言
- escalation route の operational owner

## Provisional next action

- Minimal safe action now:
  - candidate scorecard に boundary 項目を組み込む
  - first outreach 前に `must-escalate` line を短文化する
- Re-evaluation trigger:
  - first 3 discovery calls で、review capability と automation pressure が見えたとき

## Provisional recommendation

- first candidate を intermediary に置くこと自体は許容できる
- ただし条件は `contextual review capability` と `human review boundary` の明示
- それがない intermediary は employer より安全とは言えない

## Validation Ops Lead Memo

## What seems strongest

- intermediary first 仮説は、2 週間で discovery しやすい
- 3 通りの相手を scorecard で比較すれば、design partner 判断を感覚で決めずに済む
- employer 直販も 1 件混ぜることで、比較対象を残せる

## What seems risky

- 最初から sell しようとすると、pricing と boundary の仮説が検証されない
- 1 相手だけに寄せると、たまたま相性の良い / 悪い相手に引っ張られる
- research-only 相手ばかりだと learning はあっても commercial evidence が取れない

## What needs to be true

- discovery call の目的が `受注` でなく `fit evaluation` になっている
- scorecard が 5-8 項目で簡潔である
- confirm / falsify の基準が先に書かれている

## Provisional recommendation

- 2 週間の discovery sequence を回す
  - week 1:
    - intermediary 2 件
    - employer 1 件
    - research / policy lighthouse 1 件
  - week 2:
    - scorecard 採点
    - first candidate 決定
    - startup + recurring の envelope 仮置き

### Proposed Scorecard

1. repeated use potential
2. named internal owner
3. workflow redesign appetite
4. willingness to keep human review boundary
5. access to employer or repeated operational contexts
6. private workspace / knowledge setup readiness
7. budget tolerance for startup + recurring
8. low pressure toward unsafe automation

### Confirm / Falsify Evidence

- confirm:
  - intermediary が recurring layer に理解を示す
  - boundary への同意が得られる
  - repeated use case が複数想定できる
- falsify:
  - 単発相談や人手代行の要求が中心
  - pricing が time-and-materials 前提になる
  - accommodation judgment automation を期待される

## Chief of Staff Synthesis

## Agreed structure

- first design partner profile は `employer network を持つ intermediary`
- second-best profile は `design-forward employer`
- avoid profile は:
  - price-only buyer
  - white-label resale only intermediary
  - AI で雇用削減を前面に出す employer

## Real tradeoffs

- intermediary first は recurring と safeguard に強いが、意思決定が遅くなりやすい
- employer first は導入が速い可能性があるが、custom consulting trap に戻りやすい
- したがって `最速受注` より `再利用可能な operating layer が育つか` を優先する

## Provisional decisions

- provisional first target は `employer-facing intermediary`
- employer direct は second lane として残す
- first round では pricing の public disclosure はしない
- first outreach 前に must-escalate boundary を 1 page に圧縮する

## Next experiments

- outreach target:
  - employer network を持つ intermediary 2 件
  - design-forward employer 1 件
  - research / policy lighthouse 1 件
- evidence to collect:
  - recurring fit
  - boundary acceptance
  - repeated use potential
  - decision-owner clarity
- falsification trigger:
  - 3 件続けて consulting-like demand が強い
  - human review boundary を受け入れない
  - repeated use ではなく one-off support しか想定できない

## Decision-ready note

- いまの NBL では、最初の design partner は `employer network を持つ intermediary` を provisional first target とするのが最も整合的
- これは employer を否定する判断ではなく、`社会OSとして育つ learning loop` と `boundary safety` を優先した結果
