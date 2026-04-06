# PLANS.md

## Product

FCHMA-based consultation support web app

## Current North Star

Build the smallest working loop that supports:

1. case intake
2. AI-assisted structural analysis
3. human review and edit
4. intervention hypothesis generation
5. feedback recording

## Main Analytic Frames

- ICF: primary frame for structure and interaction
- ICD: normalization and indexing frame for health condition and diagnosis labels

## Current Phase

Phase 1b: product-facing next JAC shell with minimal-input first interaction

## Active Truth Sources

- `AGENTS.md`
- `PLANS.md`
- `docs/nbl-workspace/fchma-consultation-os-redesign-2026-03-30.md`
- `docs/nbl-workspace/fchma-original-data-utilization-design-2026-03-31.md`
- `docs/nbl-workspace/fchma-db-layer-2026-03-31.md`
- `docs/nbl-workspace/fchma-intake-slice-2026-03-31.md`
- `docs/nbl-workspace/fchma-analysis-ready-pipeline-2026-03-31.md`
- `docs/nbl-workspace/fchma-manifold-input-recipe-2026-03-31.md`
- `data/README.md`
- `data/specs/**/*`
- `db/schema/fchma-core.sql`
- `lib/fchma/*.ts`
- `skills/*/SKILL.md`

## Scope of Current Iteration

- [x] architecture proposal
- [x] domain model diagram
- [x] DB schema draft
- [x] original data workspace guide
- [x] original data folder scaffold
- [x] original data utilization design across respondent and supporter datasets
- [x] source manifest generation for current original datasets
- [x] initial response-type map scaffolds for the four structured datasets
- [x] initial respondent canonical concept map
- [x] initial supporter behavioral driver schema
- [x] analysis-ready export scaffold for all four structured datasets
- [x] respondent projection seed scaffold
- [x] supporter projection seed scaffold
- [x] health-condition normalization seed scaffold
- [x] manifold input recipe from analysis-ready exports
- [x] first respondent-side manifold pattern extraction combining numeric features and narrative projection evidence
- [x] causal framework atlas as the methodological superstructure above product-facing frame cuts
- [x] PostgreSQL ingestion contract and local ingestion asset builder
- [x] respondent survey import materialization into the `/cases` lane
- [x] runtime learning summary from review and feedback records
- [x] runtime PostgreSQL export contract for the `/cases` lane
- [x] case intake skeleton
- [x] structural analysis skeleton
- [x] intervention planner skeleton
- [x] runtime case persistence prototype
- [x] human review and feedback recorder skeleton
- [x] public share metadata baseline for current public pages
- [x] repository adapter boundary for the `/cases` lane
- [x] product-facing `/jac/next` shell for the next JAC preview
- [x] bridge CTA from current `/jac` to `/jac/next`
- [x] minimal-input `/jac/next` entry that infers an initial FCHMA payload from one consultation narrative
- [x] public `/jac/next` access model switched to tokenless, rate-limit-only guard
- [x] deterministic-only fallback for `/jac/next` when the model provider is unavailable
- [ ] initial database schema implementation
- [x] provider abstraction scaffold

## MVP Success Criteria

- A user can create a case
- A user can input free text and selected responses
- The system proposes ICF-based structural candidates
- The system normalizes disease labels to ICD candidates
- A human can review and edit the structure
- The system proposes intervention hypotheses with rationale
- A user can record what was implemented and what happened

## Deferred for Later

- full manifold visualization
- advanced cross-case analytics
- automated pattern library learning
- organization-level benchmarking
- complex permissions model

## Current Risks

- confusing ICD normalization with ICF-based structural reasoning
- overbuilding UI before the core loop works
- drifting into heavy intake forms instead of minimal-input intelligent inference
- mistaking coarse pattern clustering for true multimodal manifold analysis
- storing only summaries and losing evidence traceability
- letting AI outputs overwrite human-reviewed structure
- opening `/jac/next` without a shared production rate-limit store
- running production `/jac/next` without `OPENAI_API_KEY` degrades to deterministic-only hypotheses, which are usable but less precise than model-backed assessment
- entering rabbit holes in minor UX or schema issues
- mixing sensitive original datasets into `references/`

## Open Decisions

- [ ] exact DB schema for ICD normalization tables
- [ ] vector search approach
- [ ] provider abstraction strategy
- [ ] audit log granularity
- [ ] selected-response schema design
- [ ] human review and correction of generated response-type maps
- [ ] supporter-side coordination pattern schema JSON aligned with runtime pack design
- [ ] PostgreSQL-backed repository implementation for the `/cases` lane
- [ ] AI orchestration handoff from deterministic preview to model-backed structural reasoning
- [x] PostgreSQL ingestion path from analysis-ready, projection, and manifold-ready assets
- [x] case materialization path from `dataset_subjects` into `cases` and `case_inputs`
- [ ] survey import provenance display and review affordances refinement
- [ ] runtime learning summary to supporter pattern candidate bridge
- [ ] PostgreSQL-backed repository adapter using the runtime export contract
- [ ] reasoning handoff from minimal intake preview to manifold-derived respondent pattern library
- [ ] explicit mapping from atlas frameworks to 3-layer / 26-frame product views
- [x] joint subject-level manifold representation integrating structured variables and narrative evidence before pattern extraction
- [x] multiscale global / local / micro respondent pattern extraction from the joint subject space
- [ ] data-driven update proposal for the current 26-frame product view

## Next Concrete Step

Derive the first data-driven update proposal for the current 3-layer / 26-frame view from the 44 respondent-side multiscale manifold patterns, then connect that proposal back into the minimal-input next-JAC reasoning path.
