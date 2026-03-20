# JAC Guidebook Planning (Global Evidence-Driven)

## Purpose

Build a public-facing JAC introductory guidebook that looks simple but is deeply evidence-driven, using:
- global web knowledge sources (US/UK/EU/DE/AU/CA/JP)
- GLM-derived interaction logic
- local free-text narrative data
- JAC safety-gate thinking (normal/caution/strict equivalent framing)

This is not a generic accommodation tips page.  
It is a structured knowledge product derived from JAC's internal reasoning assets.

## Product Positioning

Primary value:
- convert fragmented evidence into reusable understanding for broad audiences
- show "why this tends to work" under explicit conditions
- prevent overgeneralization with legal/context boundaries

Non-goal:
- replacing individual consultation
- deterministic advice without context confirmation

## Data Foundation (Current Assets)

Evidence assets available now:
- `references/index/knowledge-claims.jsonl`
- `references/index/knowledge-claims-manifest.json`
- GLM artifacts in `references/GLM_resutls/`
- local narrative sources in `references/raw_data/`

Current claim distribution snapshot (from manifest):
- claimCount: `1487`
- bySourceId major buckets:
  - `jeed_reference` (JP)
  - `askjan_website` (US)
  - `canada_duty_to_accommodate` (CA)
  - `uk_gov_disability_employment` (UK)
  - `eu_reasonable_accommodation` (EU)
  - `germany_*` (DE)
  - `australia_jobaccess_guidance` (AU)
  - `nbl_local_research` (local)

## Core Content Model

Main content unit: **Difficulty-to-Accommodation Pattern Card**

Each card must include:
1. Situation pattern (observable "困りごと")
2. Interaction explanation (4 lenses):
   - difficulty occurrence
   - difficulty resolution
   - symptom-work interaction
   - support-need formation
3. Candidate accommodation bundle (not single action list)
4. Preconditions / applicability
5. Failure/overload risks
6. Must-ask follow-up questions
7. Jurisdiction note (JP/US/EU/etc.)
8. Evidence trace (claims/GLM/reference IDs)

## Information Architecture (JAC Intro Page)

1. Hero:
- "困りごとを、条件つきで解ける知識に変える"

2. Main section:
- Pattern cards (problem-first navigation)
- filters: task / symptom / environment / preference / jurisdiction

3. Deep layer (expandable):
- rationale and evidence trace
- uncertainty/confidence and missing context

4. Boundary section:
- "このページで分かること / 分からないこと"
- link to `/jac` individual workflow

## Content Generation Pipeline

1. Pattern extraction:
- cluster claims by situation-language + interaction signal + context facets

2. Bundle design:
- create accommodation bundles from recurring co-occurrence patterns

3. Safety shaping:
- apply missing-context checks:
  - person/job/environment/support/time/institution/evidence
- if missing-critical-context is high, downgrade from "proposal" to "question-first guidance"

4. Editorial rewrite:
- plain language first, depth second
- preserve evidence IDs for drill-down

## Readability / Usability Design

Principles:
- one-card = one core situation
- short top layer (5-8 lines), deep layer on demand
- avoid medical/legal jargon in top layer
- explicit "when not to apply" block for trust

Interaction:
- card-level quick actions:
  - "適用条件を確認する"
  - "追加質問を表示"
  - "個別相談へ進む"

## Quality Gates (Before Publish)

1. Evidence quality:
- no high-volume boilerplate claims in surfaced cards
- every card has at least one non-boilerplate evidence trace

2. Safety quality:
- no diagnosis-deterministic language
- no jurisdiction-agnostic legal claim
- clear uncertainty declaration when evidence is partial

3. UX quality:
- user can identify a relevant card within 30-60 seconds
- user can find "next action" without scrolling ambiguity

## Delivery Plan (Phased)

Phase A: Design Spec (1 sprint)
- finalize card schema
- define clustering and scoring rules
- define copy tone and boundary language

Phase B: Content Prototype (1 sprint)
- generate 8-12 high-impact cards
- add evidence drill-down panels
- internal review with safety checklist

Phase C: JAC Intro Integration (1 sprint)
- implement intro page and `/jac` linkage
- add analytics events and feedback capture

Phase D: Iteration Loop (ongoing)
- monthly refresh from claims dataset updates
- monitor confusion/misuse patterns
- adjust card copy and risk flags

## KPI Proposal

Adoption:
- intro page -> `/jac` transition rate
- card expansion rate

Understanding:
- "内容が具体行動に結びついた" feedback rate
- reduced bounce on JAC entry funnel

Safety:
- % of users reaching "question-first" prompts before prescriptive action in risky patterns
- audit trend consistency with safety-gate distributions

## Open Decisions

1. Should jurisdiction filtering default to auto-detect or user-select first?
2. Should evidence trace be always visible or "advanced mode" only?
3. How much GLM detail is shown publicly vs hidden in expert view?
