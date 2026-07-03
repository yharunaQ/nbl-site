---
name: official-source-triage
description: Use when classifying official, public, legal, research, or quasi-official disability-employment source material for NBL/Falcon before using it in strategy, skill packs, public copy, expert-agent grounding, or reviewed knowledge work. Applies to NIVR, MHLW, e-Gov, JEED, council/ministry materials, and comparable international public sources. Keeps source material in evidence/readiness territory unless separately reviewed and prevents current-policy, legal, or accommodation-finality overclaims.
---

# Official Source Triage

## Purpose

Classify source material before using it.

The goal is not to summarize everything. The goal is to decide what the source is, what layer it belongs to, what it can safely support, and what must wait for review.

## Use When

Use this skill for:

- NIVR reports or publication pages
- MHLW disability-employment policy pages
- MHLW reasonable-accommodation guidance
- MHLW treatment-work balance materials
- e-Gov legal text
- JEED materials
- ministry / council / study-group materials
- comparable official or public international sources
- deciding whether a source is evidence, policy context, practice context, or reviewed knowledge candidate

## Do Not Use For

- final legal interpretation
- final accommodation advice
- final employment decision
- public copy approval
- source onboarding beyond an approved band
- knowledge-object promotion
- current/latest policy claims without live verification

## Required Output

Return this structure unless the user asks for another format:

1. Source identity
2. Source role
3. FCHMA layer placement
4. Claim-type separation
5. Recency and jurisdiction risk
6. Bias / overgeneralization risk
7. Safe candidate uses
8. Not-safe uses
9. Next safe action

## Workflow

### 1. Identify Source Identity

Record:

- title
- source actor / operator
- country or jurisdiction
- publication date or page date if visible
- document type
- intended audience
- local path or URL if known
- whether the material was read locally or live-verified

If date, actor, or jurisdiction is missing, mark it as missing.

### 2. Classify Source Role

Choose one or more:

- `legal_text`
- `public_guidance`
- `research_publication`
- `service_navigation`
- `employer_practice`
- `professional_practice`
- `policy_discussion`
- `advocacy_practice`
- `drift_triage`
- `mixed`

Do not collapse these roles. A research report is not legal guidance, and service navigation is not final case routing.

### 3. Place In FCHMA Layer

Choose the highest safe current layer:

- `evidence_layer`
- `source_readiness`
- `source_family_boundary`
- `candidate_structure_input`
- `reviewed_knowledge_candidate`
- `hold`

Default to `evidence_layer`, `source_readiness`, or `source_family_boundary` unless explicit reviewed status is present.

Always state `why not higher layer`.

### 4. Separate Claim Types

Separate statements into:

- `observation`: what the source reports or states
- `inference`: interpretation drawn from observations
- `normative`: what should happen according to policy or value framing
- `recommendation`: action guidance

Never treat a recommendation as a universal fact.

### 5. Check Recency And Jurisdiction

Mark:

- `recency_risk`: low / medium / high / unknown
- `jurisdiction_risk`: low / medium / high / unknown
- `live_verification_needed`: yes / no / before_public_use

Use `before_public_use` for current policy, legal, council, ministry, funding, or operational claims.

### 6. Check Disability-Employment Risk

Mark risk if the source could encourage:

- diagnosis-to-support shortcut
- deficit-only framing
- legal finality
- medical finality
- accommodation finality
- institution replacement claim
- individual examples generalized as universal
- policy discussion treated as enacted rule
- operational drift treated as truth refresh

### 7. Decide Safe Candidate Uses

Allowed candidate uses may include:

- internal evidence note
- source-readiness row
- source boundary note
- claim-hygiene pass
- expert-agent evidence input
- policy/service briefing input
- skill-pack example after review

### 8. Mark Not-Safe Uses

Always mark not-safe if applicable:

- public copy without review
- final legal advice
- final accommodation decision
- current policy claim without verification
- reviewed knowledge object promotion
- public skill release

### 9. Choose Next Safe Action

Pick one:

- `hold`
- `metadata_inventory_only`
- `source_boundary_note`
- `claim_hygiene_pass`
- `document_analysis_memo`
- `drift_triage`
- `xhigh_boundary_packet`
- `Founder_public_promise_review`

## Output Template

```markdown
## Source Identity
- Title:
- Actor:
- Jurisdiction:
- Date:
- Source type:
- Audience:
- Local path / URL:
- Verification mode: local / live

## Source Role
- Primary role:
- Secondary role:
- Why:

## FCHMA Layer Placement
- Current safe layer:
- Why not higher:
- Missing review:

## Claim-Type Separation
- Observation:
- Inference:
- Normative:
- Recommendation:

## Risk
- Recency risk:
- Jurisdiction risk:
- Bias / overgeneralization risk:
- Finality risk:

## Safe Candidate Uses
- ...

## Not-Safe Uses
- ...

## Next Safe Action
- Action:
- Owner:
- Stop before:
```

## Guardrails

- Keep ICF as the support-reasoning frame.
- Use ICD only for health-condition normalization and indexing.
- Keep evidence, structure, hypothesis, and learning separate.
- Preserve provenance and missing context.
- Treat AI as candidate generator only.
- `reviewed` is not public approval.
- `runtime_approved` is not public approval.
- `publicSafe` is not `public_approved`.
- Stop before public release, source adoption, curated promotion, or final professional judgment.
