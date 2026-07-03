---
name: nbl-public-copy-risk-review
description: Use when reviewing NBL public/SNS/offer/site/interface drafts, free diagnostic hooks, BtoB review wording, or Heron reuse candidates for boundary safety, work-design maturity, condition-map integrity, source/public-approval status, learning-contamination risk, and agent-conflict handling before public use. Internal Falcon skill only; does not approve publication, legal compliance, or final professional judgment.
---

# NBL Public Copy Risk Review

## Purpose

Review NBL public-facing or near-public drafts before they move toward publication, site architecture, offer design, SNS use, or skill-pack packaging.

The purpose is not to make a draft sound more alarming. The purpose is to protect Falcon's core while preserving a positive work-design interface:

> 仕事の困難を、人の問題で終わらせず、仕事・環境・支援の条件として見直す。

This skill should help NBL turn copy toward work-design maturity, coordination-load reduction, safer-use review, and worker/supporter dignity without implying legal certification or AI-owned judgment.

## Internal Boundary

This is an internal Falcon / Falcon Lab review skill.

It does not:

- approve publication
- approve public site IA, top page, navigation, pricing, offer, or release
- certify legal compliance
- provide legal, medical, employment, ethical, or accommodation final judgment
- promote Heron content into Falcon public assets
- approve a public `SKILL.md` release
- change runtime, retrieval, DB, source adoption, curated status, Heron, `candidate_pattern`, or `public_approved`
- mutate Falcon domain-core behavior from a client-specific correction

Current law, policy, ministry, council, legal-obligation, statistics, funding, or operational claims require live verification and Founder/xhigh review before public use.

## Use When

Use this skill for:

- next NBL site concept copy
- public resource introductions
- SNS post drafts
- newsletter hooks
- free diagnostic or maturity-check prompts
- BtoB review offer wording
- AI-draft / form / script / workflow review descriptions
- NBL Skill Pack public descriptions
- Heron reuse candidates before Falcon migration
- sample public-facing text created from internal Falcon artifacts

## Do Not Use For

- final legal review
- final public approval
- public IA approval
- final sales promise, pricing, or contract scope
- real customer material containing confidential or sensitive information
- individual case judgment
- public current-policy claims without live source verification
- knowledge-object promotion
- automatic core-skill learning

If the user asks for public approval, legal finality, final accommodation guidance, or direct Heron publication, stop and prepare a boundary packet instead.

## Required Output

Return this full structure unless the user asks for a compact pass.

For compact mode, you may shorten narrative fields, but you must keep:

- `Short Judgment`
- `Boundary Check`
- `Work-Design Maturity Check`
- `Issues`
- `Revision Direction`
- `Learning Capture`
- `Not Now`

Never return `approved` as the status. Use only:

- `usable_with_revision`
- `hold`
- `hard_boundary`

```markdown
## Candidate Review
- Artifact reviewed:
- Intended audience:
- Intended surface:
- Status:

## Short Judgment
- Overall status: usable_with_revision / hold / hard_boundary
- Primary reason:

## Boundary Check
- Legal/compliance finality:
- Medical/employment/accommodation finality:
- Human-judgment replacement:
- Public approval implication:
- Source/current-policy dependency:
- Required escalation:

## Work-Design Maturity Check
- Maturity framing:
- Coordination load / manager burden:
- Improvement pathway:
- Fear/defensiveness risk:
- Suggested safer frame:

## Condition Map Integrity
- Person / job / environment / support preserved:
- Deterministic advice avoided:
- Heron-to-Falcon reuse boundary:
- Missing caveat:

## Bias / Dignity Check
- Diagnosis-first risk:
- Worker agency:
- Support actor conditions:
- Employer-only risk-control drift:

## Evidence / Source Status
- Source claims used:
- Live verification needed:
- Official-source-triage needed:
- Public-use review needed:

## Issues
| severity | phrase / assumption | issue | safer direction |
| --- | --- | --- | --- |

## Revision Direction
- Minimal:
- Robust:
- Compromise:

## Learning Capture
- Correction reason:
- Generalization scope:
- Contamination risk:
- Confidence:
- Recommended target:
- Auto-routing allowed:
- Human review required:

## Agent Conflict Record
- Objecting agent:
- Objection type:
- Minimal passing condition:
- Round count:
- Arbitration needed:

## Not Now
- no_public_copy_approval
- no_public_IA_approval
- no_legal_compliance_certification
- no_final_accommodation_or_employment_judgment
- no_Heron_direct_migration
- no_source_adoption
- no_runtime_retrieval_DB_or_promotion_movement
- no_public_skill_release
- no_domain_core_mutation_without_governed_review
```

## Workflow

### 1. Identify The Draft

Record:

- artifact title or path
- intended audience
- intended surface
- publication status
- whether it uses Heron material
- whether it relies on official/current source claims
- whether it uses sensitive or customer-specific material

If sensitive or real customer material appears, do not process it through this skill unless a separate approved handling path exists.

### 2. Check Boundary And Finality

Look for language that implies:

- legal compliance guarantee
- dispute prevention guarantee
- medical judgment
- employment, hiring, dismissal, or personnel judgment
- individual accommodation decision
- public approval, Founder approval, or reviewed-knowledge promotion
- AI replacing human professional judgment

Hard boundary examples:

- "法的に安全にします"
- "AIが合理的配慮を判定します"
- "この対応でトラブルを防げます"
- "障害名から必要な配慮がわかります"
- "公開承認済み"

### 3. Preserve ICF / Context Discipline

Check whether the draft keeps these conditions visible:

- person
- job
- environment
- support
- time
- institution
- evidence / source status

Risk patterns:

- diagnosis-to-support shortcut
- individual story generalized as universal
- job/environment/support omitted
- disease or disability category treated as the main explanation
- ICF interaction flattened into a checklist

### 4. Review Work-Design Maturity

The strongest default public framing is not fear. It is maturity, workload, and work-design clarity.

Check whether the draft helps the reader see:

- process maturity
- coordination load
- manager / HR judgment burden
- repeated workflow friction
- missing context
- handoff clarity
- condition-design opportunities
- when human review reduces burden

Prefer phrases like:

- "プロセス成熟度を点検する"
- "調整負荷を減らす"
- "管理職や人事の判断負担を軽くする"
- "現場で繰り返される摩擦を見える化する"
- "実際に使う前に、人間レビューで安全にする"

Use carefully:

- compliance
- discrimination
- escalation
- obligation
- risk

Avoid public defaults:

- "違反リスクを診断する"
- "非コンプライアンスを発見する"
- "法的に安全にする"
- "危機"
- "認証"

Numeric workload-reduction claims, such as "20 percent reduction," require reviewed evidence or must be clearly framed as hypothetical. Prefer qualitative wording until evidence is reviewed.

### 5. Protect Condition Map Integrity

If the draft uses `仕事のコンディションマップ`, `できる条件`, or similar language, check that each positive phrase maps back to at least one concrete condition:

- person
- job
- environment
- support
- time
- institution

The phrase should not become pure inspiration. It must keep the interaction model visible.

Safe patterns:

- "条件がそろえば、働きやすさは変わる"
- "仕事の困難を、人の問題で終わらせず、条件の設計として見直す"
- "本人、仕事、環境、支援の条件を一緒に見る"

Required caveats:

- conditions do not solve every case automatically
- individual review may be needed
- Heron wording is a reuse candidate, not Falcon public approval

### 6. Check Customer Psychology

Review whether the draft creates:

- trust
- curiosity
- constructive urgency
- actionability
- reduced shame
- willingness to inspect process gaps

Also review whether it could create:

- defensiveness
- concealment
- panic
- blame
- thought-stopping
- request for final legal answers

If the draft surfaces risk, pair it with a non-accusatory improvement path.

### 7. Protect Worker / Supporter Dignity

BtoB copy must not turn the worker into a compliance risk object.

Check whether the draft:

- preserves worker context and agency
- includes support actors and implementation conditions
- avoids employer-only risk-control framing
- avoids diagnosis-first or deficit-only language
- presents review as safer coordination, not control over the person

### 8. Check Evidence And Source Status

If the draft relies on public facts, mark:

- source status
- whether live verification is needed
- whether `skills/official-source-triage/SKILL.md` should be used first
- whether Founder/xhigh review is needed before public use

Do not treat local source notes, old web-cache, council mentions, or historical policy readings as current public truth.

### 9. Capture Learning Without Contamination

If the review produces a correction, classify it as:

- `domain_core_candidate`
- `segment_pattern_candidate`
- `client_specific`
- `artifact_specific`
- `style_preference`
- `jurisdiction_or_policy_specific`
- `hold`

Also classify:

- `contamination_risk`: low / medium / high
- `confidence`: 0.00 to 1.00
- `recommended_target`: skill / prompt / rubric / eval_item / client_profile / reviewed_knowledge_candidate / hold
- `auto-routing allowed`: yes / no
- `human review required`: yes / no

Confidence rule:

- confidence >= 0.90 may allow automatic routing only
- confidence >= 0.90 never allows automatic domain-core adoption
- any `domain_core_candidate` requires governed review
- any medium/high contamination risk requires human review
- human generalization judgments are themselves learning signals

### 10. Record Agent Conflict

If an agent objects, the objection must include:

- objection type: `hard_stop`, `negotiable_blocker`, or `improvement_request`
- exact phrase, assumption, or workflow step
- reason
- minimal passing condition
- whether human arbitration is required now

For `improvement_request` or `negotiable_blocker`:

1. Propose three alternatives: minimal, robust, compromise.
2. Allow at most two negotiation rounds.
3. Route unresolved conflict to human arbitration.

For `hard_stop`:

- stop immediately
- record the hard-boundary reason
- prepare a decision packet if safe parallel work remains

## Risk Levels

| level | meaning | allowed action |
| --- | --- | --- |
| low | wording can be improved but boundary is intact | suggest safer framing |
| medium | missing context, source, or caveat may mislead | require revision before use |
| high | likely overclaim, fear trigger, dignity risk, or finality implication | hold public use; rewrite needed |
| hard_boundary | legal, finality, public approval, source, runtime, DB, retrieval, promotion, or human-judgment boundary | stop and prepare decision packet |

## Public-Facing Naming Guidance

The internal skill name includes `risk` because it is a boundary review tool.

Customer-facing names should usually avoid making risk the first emotional frame. Prefer:

- copy readiness review
- work-design maturity review
- safer-use review
- coordination-load review
- workflow clarity review

## Sample Review Rules

Samples must use non-sensitive fixture text.

Samples must not use:

- real customer material
- sensitive case text
- unreleased client artifacts
- current legal or policy claims unless live-verified and marked as such

Samples must not return `approved`. Use `usable_with_revision`, `hold`, or `hard_boundary`.

## Stop Conditions

Stop and report before:

- public publication approval
- public IA/top page approval
- legal compliance certification
- final professional judgment
- Heron edit or direct Heron-to-Falcon migration
- source adoption or current-policy claim without required review
- runtime/model/provider default change
- retrieval, semantic, vector, embedding, ranking, DB, auth, PII, or promotion movement
- `candidate_pattern` or `public_approved` movement
- public skill release

## Guardrails

- Keep ICF as the support-reasoning frame.
- Use ICD only for health-condition normalization and indexing.
- Preserve evidence, structure, hypothesis, and learning separation.
- Treat AI as a candidate generator only.
- Keep public-site surfaces as delivery layers around the core knowledge network.
- Treat Heron materials as reuse candidates that require Falcon audit, grounding review, and wording-risk review.
- Treat reviewed knowledge status, runtime approval, and public approval as separate gates.
- Do not let BtoB usefulness erase worker dignity.
- Do not let positive campaign language become deterministic professional advice.
