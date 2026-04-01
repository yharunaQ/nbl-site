# FCHMA Original Data Utilization Design

## Purpose

Define how the newly added original datasets should be used in the FCHMA-based product without collapsing them into a single undifferentiated RAG corpus.

The design goal is to preserve:

- respondent-side structural evidence
- supporter-side practice knowledge
- human-reviewable pattern extraction
- low-cost analysis paths that do not depend on heavy LLM usage

## Source Inventory

| Source | Approx. size | Main content | Recommended role |
| --- | ---: | --- | --- |
| `employment_survey_3000/disability_employment.xlsx` | 4553 rows / 180 cols | cross-disability employment survey, structured answers, multiple free-text columns | respondent-side structural baseline |
| `nanbyo_survey_4000/Nanbyo_kanja.xlsx` | 4523 rows / 116 cols | rare disease respondent survey, disclosure, support use, work situation, difficulty, free text | respondent-side disease-specific structural baseline |
| `supporter_practice/Nanbyo_Supporters.xlsx` | 536 rows / 66 cols | rare disease supporter survey, institution/role, exposure, one practice free-text field | supporter capability and stance layer |
| `supporter_practice/toku18_Supporters.xlsx` | 3054 rows / 180 cols | broader supporter survey, support philosophy, collaboration, local linkage, multiple free-text fields | supporter pattern and coordination layer |
| `supporter_practice/toku18_supporters_structure.pdf` | PDF | original analysis structure for supporter survey | schema interpretation guide for supporter pattern modeling |
| `supporter_practice/【分析】障害者就労支援_連携ポイント整理.md` | markdown | curated workshop synthesis | reviewed support-pattern memo |
| `supporter_practice/難病就労支援_相互作用パターン分析と連携設計.md` | markdown | interaction-pattern analysis for rare disease employment support | reviewed coordination-pattern memo |

## Core Separation

Do not put all sources into one generic `references` bucket.

Use four source roles instead:

1. `case_structure_source`
   - respondent surveys that describe barriers, accommodations, participation, support use, and lived difficulty
2. `support_practice_source`
   - supporter surveys that describe how support is delivered, where coordination fails, and what role each institution can play
3. `reviewed_pattern_memo`
   - markdown syntheses distilled from workshops or prior analyses
4. `derived_pattern_asset`
   - canonical variables, embeddings, structural clusters, hypothesis templates, coordination failure modes

This separation prevents a common mistake: using supporter discourse as if it were direct respondent evidence, or using respondent survey codes as if they were intervention rules.

## Recommended Knowledge Lanes

### Lane A: Respondent Structure Lane

Use these sources:

- `disability_employment.xlsx`
- `Nanbyo_kanja.xlsx`

This lane is the main source for:

- difficulty occurrence patterns
- participation barriers
- accommodation gaps
- disclosure/opening patterns
- employment continuity risks
- support-need formation

This lane should feed:

- canonical respondent feature matrix
- ICF-oriented case priors
- cross-case similarity search
- manifold / clustering / pattern mining
- hypothesis seeds for structural analysis

### Lane B: Supporter Practice Lane

Use these sources:

- `Nanbyo_Supporters.xlsx`
- `toku18_Supporters.xlsx`
- `toku18_supporters_structure.pdf`
- the two markdown workshop syntheses

This lane is the main source for:

- coordination roles
- institutional strengths and blind spots
- frequent failure modes in linkage
- intervention options and sequencing
- supporter-side constraints

This lane should feed:

- intervention pattern library
- coordination failure-mode library
- support catalog for planner UI
- supporter-aware explanation layer in JAC/FCHMA

The `toku18_supporters_structure.pdf` file is especially important because it preserves the original analytic intent of the supporter survey:

- one submodel links support content to improvement / non-improvement of vocational difficulty using an ICF-framed interaction model
- another submodel links support intention and implementation to role recognition, knowledge, network participation, organizational climate, and supporter motivation using a planned-behavior style model

This means `toku18` should not be treated as a flat opinion survey. It should be treated as a supporter-side structural model source.

### Lane C: Runtime Knowledge Pack Lane

At runtime, do not pass raw spreadsheets directly to the model.

Instead, build compact packs such as:

- `respondent_structure_priors`
- `support_practice_patterns`
- `coordination_failure_modes`
- `intervention_templates`
- `counter_hypothesis_patterns`

These packs should be versioned and human-reviewable.

## Canonical Concept Model

The four spreadsheets should not be flattened into one table.

Instead, map them into a shared concept model with dataset-specific transforms.

### Respondent-side canonical concepts

- respondent profile
- health condition / diagnosis raw label
- ICD normalization candidate
- impairment / symptom burden
- activity difficulty
- participation difficulty
- environmental barriers
- accommodation status
- disclosure status
- support-use history
- work design / job type
- self-efficacy / coping / future outlook
- free-text narrative units

### Supporter-side canonical concepts

- institution type
- role / qualification
- client exposure / case mix
- vocational difficulty target
- support action performed
- support action intent
- perceived improvement / non-improvement
- support philosophy
- collaboration pattern
- local network condition
- role recognition
- knowledge access
- organizational climate
- supporter motivation / meaningfulness
- perceived implementation feasibility
- perceived failure mode
- free-text practice narratives

### Joint bridge concepts

These are the concepts that connect Lane A and Lane B:

- barrier type
- accommodation gap
- coordination gap
- disclosure difficulty
- support pathway
- crisis trigger
- stabilization factor
- intervention target
- intervention actor

## Response-Type Discipline

Before any manifold or vector work, every variable must be classified.

Use this response-type taxonomy:

- `nominal`
- `ordinal`
- `multiselect`
- `composite_state`
- `free_text`
- `identifier`
- `derived_existing`
- `numeric_scalar`
- `count`

Examples:

- `性別`, `所属機関` -> `nominal`
- `満足度`, `関わり頻度` -> `ordinal`
- `疾病`, `仕事内容`, `資格` -> `multiselect`
- `整備有 / 必要だが整備無 / 不必要` -> `composite_state`
- `記述回答`, `自由記述` -> `free_text`
- `ID` -> `identifier`
- `分類名`, `機関職種集計用` -> `derived_existing`
- `年齢` -> `numeric_scalar`
- `対象者数` -> `count`

`composite_state` columns must not be treated as linear scales. They should be decomposed when needed, such as:

- `needed`
- `available`
- `used`
- `useful`
- `aware`
- `resolved`
- `unresolved`
- `not_applicable`

This is essential for both valid similarity search and valid manifold structure.

## Processing Pipeline

### Stage 0: Source registration

For each source, register:

- source id
- dataset role
- respondent/supporter population
- one-row semantics
- sheet semantics
- codebook location
- sensitive-data flags

### Stage 1: Type mapping

Create per-dataset `response_type_map` files.

Required output:

- raw variable name
- canonical concept candidate
- response type
- multiselect separator
- missing / not-applicable conventions
- whether the variable is safe for manifold input

### Stage 2: Canonical mapping

Create a `canonical_concept_map` across:

- employment respondent survey
- rare disease respondent survey
- rare disease supporter survey
- toku18 supporter survey

This map should explicitly separate:

- true common concepts
- conceptually related but non-equivalent variables
- dataset-specific concepts with no crosswalk

### Stage 3: Analysis-ready transformation

Transform each source into analysis-ready outputs:

- structured feature tables
- multiselect exploded tables
- free-text unit tables
- code-to-label lookup tables
- provenance metadata

### Stage 4: ICF / ICD projection

Projection should happen after the structured cleanup, not before.

- ICD is used for condition normalization and indexing
- ICF is used for interaction framing and structural reasoning

For respondent surveys, create projected layers such as:

- `body_functions_structures`
- `activities`
- `participation`
- `environmental_factors`
- `personal_factors`
- `support_resources`
- `work_design`
- `temporal_change`

For supporter sources, project into:

- `institutional_conditions`
- `support_resources`
- `coordination_structure`
- `intervention_actor`
- `implementation_constraints`
- `supporter_behavioral_drivers`

For `toku18`, preserve two projections in parallel:

1. `support_action_model`
   - maps supporter actions to vocational difficulty improvement / non-improvement
2. `support_implementation_model`
   - maps role recognition, knowledge, network participation, organizational climate, and supporter motivation to likely implementation of effective support

### Stage 5: Pattern extraction

Pattern extraction should be separate by lane.

Respondent lane:

- structure clusters
- barrier bundles
- accommodation-gap patterns
- disclosure and continuity patterns

Supporter lane:

- coordination failure modes
- effective linkage patterns
- intervention sequencing patterns
- actor-role complementarity patterns

### Stage 6: Runtime packaging

Prepare compact assets for product runtime:

- `pattern_library/respondent/*`
- `pattern_library/supporter/*`
- `knowledge_packs/interventions/*`
- `knowledge_packs/coordination/*`

## How Each Source Should Be Used in Product

### `disability_employment.xlsx`

Use for:

- cross-disability baseline structure patterns
- job/accommodation/problem-state relations
- broad case similarity priors

Do not use for:

- disease-specific support rules
- direct intervention finalization

### `Nanbyo_kanja.xlsx`

Use for:

- rare disease-specific respondent patterns
- disclosure/non-disclosure structure
- support-seeking and work-continuity interactions
- disease-label normalization seeds

Do not use for:

- generic cross-disability assumptions without weighting

### `Nanbyo_Supporters.xlsx`

Use for:

- rare disease support-actor view
- rare disease-specific institutional blind spots
- compact intervention and coordination priors

Do not use for:

- direct case truth

### `toku18_Supporters.xlsx`

Use for:

- general supporter-side pattern mining
- cross-institution coordination logic
- intervention rationale and implementation conditions
- supporter-behavior driver modeling
- linking support content to perceived improvement patterns

Do not use for:

- respondent-side prevalence claims

Interpret this dataset with `toku18_supporters_structure.pdf` as its schema guide, not only with the raw codebook. The PDF shows that the original design already separates:

- vocational difficulty and its resolution state
- support implementation
- role recognition
- knowledge and information access
- network participation
- organizational and regional encouragement / discouragement
- supporter-side motivation

### Workshop markdown syntheses

Use for:

- curated pattern seeds
- reviewed language for support explanations
- failure-mode taxonomy seeds

Do not use for:

- direct numeric evidence
- replacing the original survey rows

## AI Boundary and Cost Control

### What should be done without LLM calls

- spreadsheet parsing
- PDF structure-note parsing
- type classification storage
- multiselect expansion
- one-hot / ordinal / composite decomposition
- ICD alias dictionary application where deterministic
- manifold / clustering / distance calculation on structured tables
- hashing, deduplication, chunk registration

### What may use embeddings only

- free-text column indexing
- supporter narrative retrieval
- reviewed memo retrieval

### What should use LLM selectively

- ICF hypothesis drafting from free text
- coordination failure-mode summarization
- pattern naming and explanation drafts
- counter-hypothesis generation

### Cost controls

- cache by content hash
- never re-embed unchanged text
- chunk by free-text field, not by whole workbook
- run LLM only on reviewed subsets, novel clusters, or runtime-selected snippets
- keep respondent and supporter text pipelines separate
- prefer local / statistical processing for tabular structure

The manifold work itself should be treated as a local analytic step, not an API-heavy step.

## Recommended Storage Products

Store the following analysis-ready outputs outside the original files:

- `analysis_ready/respondents/employment/structured_features.parquet`
- `analysis_ready/respondents/nanbyo/structured_features.parquet`
- `analysis_ready/supporters/nanbyo/structured_features.parquet`
- `analysis_ready/supporters/toku18/structured_features.parquet`
- `analysis_ready/*/free_text_units.parquet`
- `analysis_ready/*/response_type_map.json`
- `analysis_ready/*/canonical_mapping.json`
- `analysis_ready/pattern_library/*.json`

## Immediate Implementation Priorities

1. Create source manifests for all four spreadsheets and both markdown memos.
2. Register `toku18_supporters_structure.pdf` as a supporter-schema guide source.
3. Create `response_type_map` for each spreadsheet.
4. Create a first `canonical_concept_map` between the two respondent surveys.
5. Create a first supporter-side `coordination_pattern_schema`, including a `supporter_behavioral_driver_schema` derived from the `toku18` structure note.
6. Implement analysis-ready export scripts for structured and free-text outputs.
7. Only after that, connect the outputs to the FCHMA app runtime.

## Near-term Product Use

For the MVP and early FCHMA app:

- use respondent datasets to support structural hypothesis generation
- use supporter datasets and workshop memos to support intervention hypothesis generation
- surface both as candidate knowledge with provenance
- keep human review mandatory before any final recommendation

## Design Summary

The effective design is not:

- one giant RAG corpus
- one model prompt containing raw spreadsheet excerpts
- one combined table mixing respondent and supporter answers

The effective design is:

- two main knowledge lanes
- a reviewed pattern-memo layer
- analysis-ready derived assets
- compact runtime packs
- strict separation between case evidence and support practice knowledge
