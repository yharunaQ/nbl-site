---
name: campaign-content-boundary
description: Use when reviewing NBL campaign, SNS, song-use, visual, short-video, infographic, or awareness assets for internal boundary safety before publication. This internal Falcon skill separates emotional/persuasive content from professional guidance, source-verified claims, work-design explanation, accommodation/legal finality, and public approval. It does not approve publication, clear copyright/licensing, verify current policy, or replace human review.
---

# Campaign Content Boundary

## Purpose

Review campaign-like assets so awareness, emotion, and persuasion do not replace evidence, context, work-design explanation, source verification, worker agency, or human professional judgment.

Default frame:

> Campaign assets can open attention; they must not close judgment.

This is an internal Falcon / Falcon Lab skill only.

## Use When

Use this skill when the user asks for boundary review of:

- song-use plans
- still visuals
- lyric-card concepts
- infographics
- short SNS posts
- short video concepts
- campaign bundles
- companion-note drafts
- awareness assets tied to disability, work, AI safer-use, support, HR, or institutional communication

Example triggers:

- "この曲をSNSで使う前に境界メモを作って"
- "このインフォグラフィックと曲の組み合わせを点検して"
- "キャンペーン素材が支援助言に見えないか見て"
- "この啓発投稿に必要な注意書きを整理して"
- "このAI safer-use campaign exampleの公開前リスクを見て"

## Do Not Use For

- final public approval
- legal review
- medical review
- final accommodation guidance
- individual case judgment
- current policy verification by itself
- source adoption
- public site IA, pricing, offer, or release approval
- brand strategy approval
- runtime prompt or model-behavior design
- generic copywriting without boundary-review intent

If the user asks for public approval, legal finality, current-policy claims, real-asset release, external Skill Pack publication, or runtime behavior, stop and prepare a boundary note. Use `xhigh` / Pro before proceeding.

## Hard Boundaries

This skill does not:

- approve publication
- approve public SNS/site/offer copy
- approve public Skill Pack release
- clear copyright, licensing, attribution, platform, or brand-use questions
- quote, rewrite, or transform substantial song lyrics
- certify legal compliance
- provide legal, medical, employment, ethical, or accommodation final judgment
- verify current law, current policy, ministry, council, funding, statistics, or official-source claims
- handle confidential customer, worker, supporter, or individual-case material without a separate approved path
- change runtime, retrieval, DB, schema, source adoption, Atlas / 27, `candidate_pattern`, or promoted knowledge
- replace human professional judgment

## Real-Asset Handling

You may review real asset descriptions for internal boundary notes only when:

- the user intentionally provides or identifies the asset
- the task is boundary review, not publication approval
- no confidential customer / worker / supporter / individual-case information is included
- the output does not reproduce protected creative expression
- any release decision is routed outside this skill

If confidential, sensitive, client-specific, or individual-case material appears:

- stop normal processing
- say the material requires an approved handling path
- do not turn the material into examples, reusable learning, or public copy

If the asset includes current legal, policy, ministry, council, funding, statistics, official-source, or obligation claims:

- route to `skills/official-source-triage/SKILL.md`
- require live verification and `xhigh` / Founder review before public use

## Copyright And Lyrics

Do not:

- quote substantial lyrics
- rewrite lyrics into public-ready copy
- create lyric cards from copyrighted lyrics
- approve song use, licensing, attribution, platform clearance, or copyright safety
- infer a full song meaning from protected lyrics

You may:

- describe a song's intended campaign role at a high level
- flag that lyric-led assets need copyright/licensing review
- create non-lyric boundary notes, such as "awareness asset, not advice"
- recommend companion explanations that do not reproduce lyrics

## Workflow

1. Identify the asset.
2. Identify the primary audience.
3. Identify one intended action stimulus.
4. State what the asset can convey.
5. State what the asset must not replace.
6. Identify likely misunderstandings.
7. Identify needed companion context.
8. Check boundary flags.
9. Return an internal status.
10. State the next safe step.

## Boundary Flags

Check explicitly for:

- legal/compliance finality
- medical or diagnostic explanation
- accommodation or employment decision
- universalized disability experience
- disclosure pressure
- worker-agency reduction
- employer-only risk-control framing
- institutional blame without reviewed basis
- source/current-policy dependency
- public approval implication
- AI certification implication
- missing person / job / environment / support / time / institution context
- copyright / licensing risk for music, lyrics, image, video, or brand assets

## Internal Status Labels

All status labels are internal only. None means public approval.

| status | internal meaning | public meaning |
| --- | --- | --- |
| `inbox` | insufficient context to review | not approved |
| `review` | internally reviewable with companion boundary notes | not approved |
| `hold` | useful idea but risk, missing context, or adjacent promise is too high | not approved |
| `hard-boundary` | do not proceed without separate source/legal/public/human review | not approved |

Never return:

- `approved`
- `publication_ready`
- `legally_safe`
- `NBL_certified`
- `accommodation_ready`
- `evidence_based` unless a separate reviewed-source status exists

## Required Output

Use this structure unless the user asks for a compact pass:

```markdown
## Asset Identity
- Asset:
- Source / real-asset status:
- Publication status:

## Intended Use
- Audience:
- Intended action stimulus:
- Surface:

## Boundary Review
- What this can convey:
- What this must not replace:
- Likely misunderstandings:
- Needed companion context:

## Boundary Flags
- Legal/compliance finality:
- Medical/employment/accommodation finality:
- Source/current-policy dependency:
- Copyright/licensing risk:
- Disclosure pressure:
- Universalized experience:
- Public approval implication:
- AI certification implication:
- Missing context:

## Internal Status
- Status: inbox / review / hold / hard-boundary
- Reason:

## Not Now
- no_public_approval
- no_legal_or_accommodation_finality
- no_copyright_or_licensing_clearance
- no_current_policy_claim_without_live_verification
- no_sensitive_material_reuse
- no_runtime_or_promotion_movement

## Next Safe Step
-
```

## Safer Companion Note Pattern

When useful, draft a short companion note that keeps the asset in the right lane:

- awareness asset, not advice
- thinking aid, not a decision tool
- artificial example, not certification
- actual work support depends on person / job / environment / support / time / institution
- public/current-source claims need separate verification

Keep companion notes concise and avoid turning them into public approval.
