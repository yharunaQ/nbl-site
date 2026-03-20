# Business Validation Round

更新日: 2026-03-16

## Scope

- 対象論点:
  - design partner hypothesis
  - recurring fee hypothesis
  - partner boundary hypothesis
  - high-risk escalation hypothesis

## Source Notes

以下は主に official source を参照したうえでの仮説整理であり、一部は NBL 向けの推論を含む。

- OpenAI Frontier は、enterprise value のボトルネックは model intelligence より `how agents are built and run` だとしている。
  - Source: [OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/)
- OpenAI Frontier Alliances は、real impact には workflow redesign, systems integration, leadership alignment, change management が必要だとしている。
  - Source: [Frontier Alliances](https://openai.com/index/frontier-alliance-partners/)
- ODEP Accessible Technology は、accessible technology は `workers with and without disabilities` を支え、`designed by and with disabled people` であるべきだとしている。
  - Source: [ODEP Accessible Technology](https://www.dol.gov/agencies/odep/program-areas/employment-supports/technology/)
- ODEP resources は PEAT を employer, technology developer, policy maker, consumer をつなぐ catalyst として案内している。
  - Source: [ODEP Resources / PEAT](https://www.dol.gov/agencies/odep/resources)
- EEOC guidance は reasonable accommodation は individual であり、essential function を消す義務までは含まないと整理している。
  - Sources:
    - [EEOC accommodation guidance](https://www.eeoc.gov/policy/docs/accommodation.html)
    - [EEOC employer responsibilities](https://www.eeoc.gov/publications/ada-your-responsibilities-employer)
- Stripe documentation は hybrid pricing として `fixed fee and overage`、`credit burndown`、`outcome-based pricing` を案内している。
  - Sources:
    - [Stripe usage-based pricing](https://docs.stripe.com/subscriptions/pricing-models/usage-based-pricing)
    - [Stripe fixed fee and overages](https://docs.stripe.com/billing/subscriptions/usage-based-v1/use-cases/flat-fee-and-overages)
    - [Stripe credit-based pricing](https://docs.stripe.com/billing/subscriptions/usage-based/use-cases/credits-based-pricing-model)
    - [Stripe outcome-based pricing guide](https://stripe.com/en-br/resources/more/outcome-based-pricing)

## Managing Director Memo

### Design Partner Hypothesis

最初の design partner は、次の条件を満たす組織が有望。

1. 企業・組織内に、障害 / 病気 / 働きづらさの friction を放置できない責任者がいる
2. 相談窓口だけでなく、workflow や仕事設計を変えたい意思がある
3. private workspace や internal knowledge pack を使う余地がある
4. AI-only ではなく、必要時の human review / partner review を受け入れられる

### Best Initial Partner Types

- design-forward employer
- support / workforce intermediary with employer network
- research / policy lighthouse partner

### Weak Initial Partner Types

- 単発相談だけを求める相手
- price compare だけで決める相手
- AI で雇用削減を前面に出す相手

## Revenue Hypothesis Memo

### Recommended First Commercial Shape

- invitation-only startup package
- recurring platform fee
- included usage entitlement
- bounded overage or credits

### Why

- NBL の価値は毎回ゼロから相談することではなく、知識基盤と workflow が蓄積されること
- したがって、monthly recurring layer がないと社会OSになりにくい

### Provisional Revenue Hypotheses

#### H1. Startup + recurring is the default

- startup fee:
  - initial design pack
  - private knowledge setup
  - workflow configuration
- recurring fee:
  - knowledge updates
  - workspace access
  - bounded agent usage

#### H2. Usage should be capped or metered, not open-ended

- included monthly usage
- overage or credit burndown after the entitlement

#### H3. Outcome pricing should be narrow

- if used, it should be tied to workflow outputs, not accommodation decisions themselves

## Partner Boundary Memo

### AI Core Owns

- knowledge synthesis
- workflow scaffolding
- JAC logic
- documentation drafts
- resource packaging

### Partner Edge Owns

- organizational context
- implementation on the ground
- stakeholder alignment
- external escalation
- institution-specific adaptation

### Human Review Boundary Owns

- legal-sensitive interpretation
- employment action implications
- high-risk individual case review
- crisis / safety-related judgment

## High-Risk Escalation Memo

### Must Escalate

- hiring, firing, demotion, discipline, return-to-work final decisions
- medical or diagnostic interpretation
- crisis, self-harm, acute safety, abuse, violence
- cases with missing core context across person / job / environment / support / time / institution
- requests that seek certainty where evidence is partial

### Can Stay In AI-Supported Zone

- issue structuring
- workflow mapping
- resource suggestion
- first-draft documentation
- question generation for missing context

## Evidence And Ethics Lead Memo

## Holistic Positioning

- Scope of source:
  - NBL の AI operating model と official accommodation / accessibility / pricing guidance
- Covered lenses:
  - `difficulty_occurrence`
  - `difficulty_resolution`
  - `support_need_formation`
- Missing lenses:
  - partner selection criteria の具体スコア
  - escalation SLA の具体値

## What is currently usable

- Usable now (with conditions):
  - design partner を invitation-only で始める
  - startup + recurring + bounded usage の hybrid
  - partner edge と human review boundary を明示する
- Not yet usable:
  - public に generic pricing を出す
  - high-risk case を AI alone で完結させる
  - outcome pricing を accommodation result 全体にかける

## Bias/Discrimination Risk

- Risk level: medium
- Risk factors:
  - efficiency を前面に出しすぎると、人の状況や法的責任が見えなくなる
  - support partner を軽視すると contextual risk が増える
  - pricing を急ぎすぎると vulnerable users への不利益が出る

## Additional Information Required

- Must-have questions:
  - first design partner を employer に置くか intermediary に置くか
  - human review boundary を NBL external partner で担うか
- Nice-to-have questions:
  - grant / sponsored research revenue を初期に混ぜるか

## Provisional Next Action

- Minimal safe action now:
  - business validation review page を作る
  - H1/H2/H3 と escalation boundary を review する
  - partner candidate scorecard の素案を作る
- Re-evaluation trigger:
  - first partner discovery call の結果が入ったとき

## Integrated Recommendation

- 初期は `design partner 1-3組` に絞る
- fee は `startup + recurring + bounded usage`
- boundary は `AI core + partner edge + human review`
- high-risk case は AI-supported, human-decided を原則にする
