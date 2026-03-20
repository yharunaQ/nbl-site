# Commercial Package Round

更新日: 2026-03-16

## Scope

- 対象論点:
  - first commercial package を employer 用と intermediary 用で分けるか
  - smallest sellable package は何か
  - included / excluded / conditional をどう切るか
  - package wording が consulting drift や unsafe automation pressure を生まないか

## Round Question

- 最初の commercial package は `1つの core package + 2つの wrapper` にするべきか
- それとも partner type ごとに別 product に分けるべきか

## Offer Packaging Lead Memo

## What seems strongest

- 最初の commercial package は `1つの core package + 2つの wrapper` が最も整合的
- 2 つの別 product に分けると、NBL の core intelligence より `相手別の受託調整` が前面に出やすい
- shared core にすると、NBL が売るものを `AI core / workflow / private workspace / boundary design` に固定しやすい

### Proposed Core Package

- internal name:
  - `NBL OS Pilot`
- role:
  - AI-native social OS の最小導入単位

### Included

- AI team startup
- private workspace setup
- issue and workflow map
- knowledge pack initialization
- boundary and escalation pack
- bounded agent usage entitlement
- first operating review memo

### Excluded

- live case-by-case individual advice
- hiring, firing, demotion, discipline, return-to-work final decisions
- medical or diagnostic interpretation
- unlimited meetings or unlimited revisions
- white-label resale rights
- open-ended custom implementation labor

### Conditional

- additional workflow lanes
- additional organization contexts
- approved partner review connection
- system integration work after pilot

## What seems risky

- employer 用と intermediary 用で package 名も deliverable も分けすぎると、営業のたびに別物へ変質する
- `伴走` や `相談支援` のような言葉が前面に出ると、人の常設チーム前提に見えやすい
- intermediary wrapper が network-wide unlimited license に見えると、scope と boundary が壊れる

## What needs to be true

- wrapper の違いは `owner type / context lane / rollout assumption` に限定する
- package の中心が human labor でなく operating layer に固定される
- 名前も promise も、`全部やります` ではなく `ここまでを導入する` に寄る

## Provisional recommendation

- first commercial package は `1 core + 2 wrappers`
- internal core name は仮に `NBL OS Pilot`
- public name は後で圧縮してよいが、scope は変えない

## Revenue Architect Memo

## What seems strongest

- one core package にすると、`startup + recurring + bounded usage` の revenue stack を崩さずに済む
- employer と intermediary で変えるべきなのは料金ロジックより `rollout envelope` の方
- startup fee は導入初期設定費、recurring fee は workspace / knowledge / workflow の更新費、bounded usage は usage control として説明できる

### Employer Wrapper

- internal name:
  - `Workplace Pilot`
- assumption:
  - 1 organization
  - 1 named sponsor
  - 1 primary workflow lane

### Intermediary Wrapper

- internal name:
  - `Partner Node Pilot`
- assumption:
  - 1 intermediary team
  - 1 named operational owner
  - 1 network-facing workflow lane

## What seems risky

- employer wrapper は社内調整や個別ケース相談へ scope creep しやすい
- intermediary wrapper は複数組織への包括支援 license に見えやすい
- public pricing を先に出すと、相手が core package ではなく割引条件だけを見やすい

## What needs to be true

- first package は invitation-only に保つ
- additional contexts と additional usage の境界が明文化されている
- recurring fee の対象が advisory availability でなく platform layer として理解される

## Provisional recommendation

- core package を共通にし、wrapper 差分は narrow に保つ
- public には料金表を出さず、internal only の envelope として検証する
- outcome pricing はまだ package に混ぜない

## Safety and Boundary Lead Memo

## Holistic Positioning

- Scope of source:
  - design partner round、business structure / validation round、障害・就労文脈の boundary 前提
- Covered lenses:
  - `difficulty_occurrence`
  - `difficulty_resolution`
  - `support_need_formation`
- Missing lenses:
  - 実際の partner review capability
  - escalation route の SLA

## What is currently usable

- Usable now (with conditions):
  - one core / two wrappers の package architecture
  - excluded items を先に明文化すること
  - boundary and escalation pack を included に入れること
- Not yet usable:
  - intermediary wrapper を `相談窓口の外注` のように見せること
  - employer wrapper を `合理的配慮判断の代行` のように見せること
  - high-risk case review を package の暗黙機能にすること

## Bias/Discrimination Risk

- Risk level: medium
- Risk factors:
  - `見えない障害` や accommodation 関連の一般論を package 化すると、diagnosis-only framing に見えやすい
  - employer wrapper が HR automation と誤読されると、employment action support への drift が起きやすい
  - intermediary wrapper が大きすぎる promise を持つと、context collapse が起きやすい

## Additional Information Required

- Must-have questions:
  - human review boundary の operational owner は誰か
  - partner review connection は package 外か package 条件内か
  - person / job / environment / support / time / institution の missing context を誰が埋めるか
- Nice-to-have questions:
  - de-identified case learning の共有条件
  - pilot continuation の judge は誰か

## AI-supported zone

- issue structuring
- workflow mapping
- documentation draft
- resource suggestion
- boundary note generation

## Must-escalate zone

- final employment decisions
- medical or diagnostic interpretation
- crisis / safety
- major missing context cases
- certainty claims under partial evidence

## Missing context

- review partner capacity
- contract wording
- escalation turnaround expectations

## Provisional recommendation

- package には `boundary and escalation pack` を必ず含める
- words to avoid を先に決める
- wrapper は narrow にし、high-risk review labor を暗黙に含めない

## Validation Ops Lead Memo

## What seems strongest

- one core / two wrappers の方が、次の discovery call で比較検証しやすい
- included / excluded / conditional を先に見せると、unsafe fit を早く落とせる
- package fit は受注前に十分検証できる

## What seems risky

- package name だけ先に決めて中身が曖昧だと、また雰囲気営業に戻る
- intermediary wrapper を大きくしすぎると、最初の call で license expectation が膨らむ
- employer wrapper で `人の伴走` が読める表現を残すと、期待値がずれる

## What needs to be true

- discovery call で `core / wrapper / exclusions` を順に説明する
- fit evaluation の観点が recurring fit と boundary fit に固定される
- continuation 条件が repeated use と owner clarity に結びつく

## Provisional recommendation

- next 4 conversations では、同じ core package を出し分けずに見せる
- employer には `Workplace Pilot` cover
- intermediary には `Partner Node Pilot` cover
- 反応差分を scorecard に記録する

### Confirm / Falsify Evidence

- confirm:
  - 相手が `core package` の考え方を理解する
  - excluded items に強い反発がない
  - recurring layer を advisory retainer でなく system layer として理解する
- falsify:
  - custom labor の追加要求が先に出る
  - unlimited support の期待が消えない
  - employment action support を求められる

## Chief of Staff Synthesis

## Agreed structure

- first commercial package は `1つの core package + 2つの wrapper`
- separate products はまだ作らない
- `Workplace Pilot` と `Partner Node Pilot` は wrapper であり、別事業ではない

## Real tradeoffs

- package を 1 つに保つと、営業の自由度は下がるが operating model は守りやすい
- wrapper を分けると理解は進むが、別 product 化すると consulting drift が起きやすい
- よって `same core, narrow wrapper` が現時点で最も NBL らしい

## Provisional decisions

- smallest sellable package は仮に `NBL OS Pilot`
- employer には `Workplace Pilot` wrapper
- intermediary には `Partner Node Pilot` wrapper
- public pricing はまだ出さない
- boundary and escalation pack は included に入れる

## Words To Avoid

- consultation service
- unlimited support
- outsourced expert desk
- fully automated accommodation
- compliance guarantee
- AIが最終判断する

## Next experiments

- discovery material:
  - 1 page package brief
  - exclusions list
  - boundary one-pager
- evidence to collect:
  - core package understanding
  - wrapper fit
  - recurring fit
  - exclusion acceptance
- falsification trigger:
  - two consecutive calls where package is interpreted as labor outsourcing

## Decision-ready note

- 最初の commercial package は `2つの別 product` に分けず、`1つの core package + 2つの narrow wrapper` に保つ
- これにより NBL は `受託相談` ではなく `社会OSの導入単位` を売る形を守りやすい
