# Business Structure Round

更新日: 2026-03-16

## Scope

- 対象論点:
  - NBL の運営主体
  - distribution
  - revenue
  - partnership
  - 事業としての成立条件

## External Validation Notes

- OpenAI は 2026年2月5日公開の Frontier 紹介で、AI により企業が `以前は実行できなかったこと` を実行できるようになり、ボトルネックは model intelligence より `how agents are built and run` だと述べている。
  - Source: [OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/)
- OpenAI は 2026年2月2日公開の記事で、Codex app を `multiple agents in parallel` の command center と位置づけている。
  - Source: [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)
- ODEP は 2026年1月31日更新ページで、アクセシブル技術は `workers with and without disabilities` を支え、`designed by and with disabled people` であるべきだとしている。
  - Source: [ODEP Accessible Technology](https://www.dol.gov/agencies/odep/program-areas/employment-supports/technology/)
- ODEP は employers, technology developers, policy makers, consumers をつなぐ PEAT を、accessible technology の innovation と policy development の catalyst として案内している。
  - Source: [ODEP Policy Development and Technical Assistance](https://www.dol.gov/agencies/odep/resources)
- EEOC は reasonable accommodation は個別的で、effective である必要があり、essential function を消す義務までは含まないと整理している。
  - Source: [EEOC reasonable accommodation guidance](https://www.eeoc.gov/policy/docs/accommodation.html)
- Stripe は 2026年時点の公式資料で、AI/automation 向け pricing として `flat fee and overage`、`usage-based`、`outcome-based pricing` を案内している。
  - Sources:
    - [Stripe usage-based pricing](https://docs.stripe.com/subscriptions/pricing-models/usage-based-pricing)
    - [Stripe usage-based billing](https://stripe.com/billing/usage-based-billing)
    - [Stripe outcome-based pricing guide](https://stripe.com/en-br/resources/more/outcome-based-pricing)

## Managing Director Memo

### Viability Call

- NBL は `相談事業` としては弱い
- NBL は `AIネイティブな社会OS事業` としては成立余地がある
- ただし、成立するのは `人手の相談件数` ではなく `再利用可能な system layer` を売る場合に限る

### Not Viable Shape

- 単発相談を人手で積み上げる
- 未完成の JAC trial を主 product にする
- vision と media だけで revenue を期待する
- pricing draft を先に出して market fit を後回しにする

### Viable Shape

- AI-operated core
- reusable methods / workflows / resources
- enterprise-facing operating layer
- partner-enabled distribution
- human-in-command review for high-risk boundary cases

## Operating Entity Memo

### Recommended Entity Shape

- `AI-operated core studio`
  - 知識基盤、workflow、agent orchestration、JAC、resources を運営
- `partner-enabled edge`
  - 企業、支援機関、研究者、技術パートナーが現場導入や contextualization を補う
- `human review boundary`
  - 法的判断、雇用上の最終決定、個別高リスクケースは AI 単独で確定しない

### Why

- AI ネイティブなレバレッジは core に集約した方が強い
- 障害・就労文脈は individual context と legal context を無視できない
- したがって `全部 AI` でも `全部人` でもなく、`AI core + partner edge + human review boundary` が現実的

## Distribution Memo

### Distribution Flywheel

1. Public resources
   - 図解、動画、見えない障害シリーズ、selected reports
2. Method entry
   - What We Do, JAC guide, AI team startup entry
3. Enterprise/private layer
   - private workspace, internal knowledge pack, workflow setup
4. Partner expansion
   - employers, support organizations, workforce/public intermediaries, accessibility/AI tool partners

### Good Channels

- B2B direct
  - 企業・組織の意思決定者
- B2B2B / institutional
  - 支援機関、職業リハ、大学、研究会、公共系 technical assistance network
- ecosystem
  - accessible technology and workflow partners

### Weak Channels

- D2C 単発販売だけに頼る
- guidebook 単体販売を最初の主導線にする
- SNS だけで trust を作ろうとする

## Revenue Memo

### Recommended Revenue Stack

#### Layer 1: Fixed-scope startup revenue

- AI チーム起動
- private knowledge / workflow setup
- initial design pack

これは `人月型の相談料` ではなく、`OS 導入の初期設定費` に近い

#### Layer 2: Recurring enterprise revenue

- subscription for private workspace
- managed knowledge updates
- workflow maintenance
- JAC / agent usage entitlement

Stripe の公式 pricing pattern でいう `flat fee + overage` が最も相性が良い

#### Layer 3: Usage or credit revenue

- JAC assessments
- agent runs
- private dataset / workflow calls

usage-based or credit burndown は productization 後に相性がよい

#### Layer 4: Outcome-linked revenue

- 限定された operational outcome にだけ適用

例:
- 文書生成完了
- workflow completion
- measured reduction in specific operational delay

ただし `合理的配慮そのもの` や `雇用意思決定` を outcome pricing の対象にしない

### Revenue Principles

- 初期は hybrid model が自然
  - startup fee
  - recurring platform fee
  - bounded usage
- pure outcome-based は後段
- pure consulting fee dependence は避ける

## Partnership Memo

### Partnership Classes

1. Employer partners
   - 実装現場
2. Support / workforce partners
   - contextualization, escalation, external re-evaluation
3. Research / policy partners
   - evidence, legitimacy, policy translation
4. Technology partners
   - billing, workflow, AI, accessibility stack

### What Partnerships Are For

- distribution
- legitimacy
- implementation capacity
- boundary handling

### What Partnerships Are Not For

- NBL の core intelligence を丸ごと外注すること
- 人手不足の穴埋めだけを期待すること

## Evidence And Ethics Lead Memo

## Holistic Positioning

- Scope of source:
  - NBL の operating model、JAC、Resources、Vision
- Covered lenses:
  - `difficulty_occurrence`
  - `difficulty_resolution`
  - `support_need_formation`
- Missing lenses:
  - high-risk case の escalation boundary をどう public に書くか
  - partner review の minimum conditions

## What is currently usable

- Usable now (with conditions):
  - accessible technology / workflow / employer support を system change として扱う
  - partner network を distribution と safeguard に使う
  - hybrid pricing を想定する
- Not yet usable:
  - accommodation judgment の完全自動化
  - `AIだけで完結する` という表現
  - employment outcome を安易に保証する pricing

## Bias/Discrimination Risk

- Risk level: medium
- Risk factors:
  - 人間を不要とみなす rhetoric が混ざると、障害当事者や支援者との trust を壊す
  - AI の効率を優先しすぎると、個別事情と legal obligation が見えなくなる
  - partner boundary が曖昧だと責任分界が崩れる

## Additional Information Required

- Must-have questions:
  - initial enterprise layer を fixed fee で始めるか、 invitation-only subscription で始めるか
  - partner review boundary を契約上どう定義するか
- Nice-to-have questions:
  - public sector / research grant 型の revenue をどこまで混ぜるか

## Provisional Next Action

- Minimal safe action now:
  - business structure review draft を作る
  - `not viable / viable` の線を先に示す
  - partner classes と revenue stack を仮置きする
- Re-evaluation trigger:
  - first enterprise design partner が決まったとき
  - JAC private usage policy が固まったとき

## Product And Implementation Lead Memo

### What To Build Next

1. hidden review page で business structure を見える化する
2. About / Home / What We Do からこの構造へつなげる
3. その後で public copy に圧縮する

### Validation Queue

- design partner 仮説
- recurring fee 仮説
- usage meter 仮説
- partner boundary 仮説
- high-risk escalation 仮説

## Integrated Recommendation

- NBL は `AI core + partner edge + human review boundary` で設計する
- revenue は `startup fee + recurring platform fee + bounded usage` の hybrid を初期案とする
- distribution は public resources から enterprise/private layer へ、さらに partner expansion へ回す
- viability の鍵は `consulting` ではなく `reusable operating system layers` を売れるかどうかにある
