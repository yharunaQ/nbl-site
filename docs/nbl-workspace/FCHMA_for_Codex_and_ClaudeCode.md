# FCHMA implementation brief for Codex and Claude Code

## 1. What FCHMA is

FCHMA stands for Framework-guided Contextual Hypergraph and Manifold Analysis.

Japanese name:
枠組み誘導型 文脈ハイパーグラフ・マニフォールド分析法

FCHMA is not just a research method for qualitative analysis. In this product, it is the core logic for understanding a case, generating support hypotheses, and learning from outcomes.

Its purpose is to analyze narratives such as interviews, consultation notes, and free-text responses without flattening them into isolated fragments. It does this by using a comprehensive framework as a reference frame, preserving contextual meaning chains across multiple sentences, representing multi-factor interactions as higher-order structures, and combining AI-assisted candidate generation with human review and feedback.

## 2. Why this matters in the product

This product must not become any of the following:

- a chat-first consultation app
- a disease-to-accommodation lookup tool
- an FAQ search product
- a static knowledge base of common supports
- an AI auto-judgment engine

The product goal is different:

- understand how a specific case is structured
- identify what is driving the problem
- identify where intervention is possible
- suggest support hypotheses
- record what was actually tried
- learn from outcomes and update practical knowledge

FCHMA matters because it is the method that makes this possible.

## 3. Core idea in one sentence

Do not treat a case as a list of symptoms or themes. Treat it as a structured interaction among multiple factors unfolding through time.

## 4. Main analytic frame: ICF

The main analytic frame is ICF.

Use ICF as the primary frame for:

- body functions and structures
- activities
- participation
- environmental factors
- personal factors
- health condition in context

Important:
ICF is not a fixed causal theory. It is a reference frame for organizing and comparing interacting factors.

Do not use ICF as if it proves causality by itself.

## 5. Supporting classification frame: ICD

Use ICD only as a secondary support frame.

Use ICD for:

- disease name normalization
- diagnosis label normalization
- absorbing naming variation
- indexing and search
- grouping and stratification when helpful

Do not use ICD as the main reasoning engine.
Do not collapse the product into disease-name-first support logic.
Do not map disease name directly to support recommendations without structural analysis.

Summary:

- ICF = main frame for structural understanding
- ICD = normalization and indexing support for health condition labels

## 6. The main problem FCHMA solves

Traditional qualitative methods are useful, but in this product they are not enough on their own.

Typical weaknesses:

- text gets split into small coded fragments
- relationships across multiple sentences are lost
- multi-factor interactions are reduced to separate labels
- final outputs become theme lists rather than case structures
- support design becomes generic rather than case-structural

FCHMA solves this by preserving structure rather than only extracting themes.

## 7. The non-negotiable unit of analysis: contextual semantic chain

The basic unit is not a sentence and not a keyword.
The basic unit is a contextual semantic chain.

A contextual semantic chain is a span of discourse in which:

- the same speaker continues a meaningful line of narration
- two or more relevant elements are involved
- at least one relation among those elements is present or implied
- sequence, transition, or consequence can be traced

Example:

- fatigue increases
- work takes longer
- supervisor does not understand
- the person stops asking for support
- job retention becomes unstable

This should not be stored as five separate labels. It should be stored as one structured chain.

## 8. Higher-order interaction is essential

The product must preserve interactions involving three or more factors at once.

This is why hypergraph thinking matters.

Real consultation cases often look like this:

- symptom fluctuation
- workload design
- supervisor communication
- commuting burden
- participation restriction

These are not just pairwise links. They form a higher-order structure.
If the system only stores pairwise relations or flat tags, it loses the real mechanism of the case.

## 9. What manifold analysis is doing here

Manifold analysis is not the truth machine.
It is a structure-discovery aid.

Use it to:

- find recurring structural patterns across cases
- identify clusters of similar case structures
- identify bridge cases and outliers
- explore non-linear similarity among case structures

Do not use it to claim that the machine has automatically discovered the final explanation.
The result always needs interpretation and audit.

## 10. AI's role

AI is a candidate generator, not the final judge.

AI may help with:

- extracting contextual semantic chain candidates
- mapping text spans to ICF elements
- proposing ICD normalization candidates
- proposing relations among elements
- proposing structural hypotheses
- proposing intervention hypotheses
- surfacing similar cases
- generating competing interpretations
- surfacing possible exceptions and edge cases

AI must not be treated as the final source of:

- case judgment
- support decision
- outcome evaluation
- ethical decision
- knowledge update without review

## 11. Human role

Human professionals must remain responsible for:

- reviewing structural hypotheses
- correcting wrong or shallow interpretations
- choosing among competing interpretations
- deciding what support is actually appropriate
- reviewing what happened after intervention
- deciding what should become reusable knowledge

Human edits are first-class data, not disposable corrections.

## 12. Why this is better than disease-first reasoning

Disease-first reasoning is tempting because it is easy to implement.

Example:

- disease A -> issue X -> accommodation Y

This is useful as a rough entry point, but not as the main engine.

Why it fails:

- same diagnosis can produce different structural problems
- different diagnoses can share similar structural barriers
- support often depends more on structure than diagnosis
- case-specific environmental and participation factors get lost

Use ICD-normalized conditions as background context, not as the primary decision path.

## 13. Why this is better than flat theme analysis

Flat theme analysis may tell us what topics appear.
It does not necessarily tell us:

- what triggered what
- what amplified what
- what protected against decline
- where the chain can be interrupted
- which intervention point matters most

The product needs these answers because support planning depends on them.

## 14. Product implications

Because the product adopts FCHMA, the app must be designed around:

- cases, not chats
- structures, not only summaries
- editable evidence-backed chains, not opaque model outputs
- intervention hypotheses linked to structural hypotheses
- feedback loops linked to actual outcomes
- reusable pattern libraries built from reviewed cases

This means the center of the UI should be:

- case overview
- structure view
- chain editor
- intervention planner
- feedback recorder
- pattern explorer

Not just a chatbot pane.

## 15. The full loop the product should support

The intended loop is:

1. intake a new case
2. ingest narrative and selected-response data
3. normalize health condition labels with ICD candidates
4. extract contextual semantic chains
5. map elements into ICF structure
6. build structural hypotheses
7. review and edit hypotheses with a human
8. generate intervention hypotheses
9. choose and implement interventions
10. record outcomes and unresolved issues
11. update the reusable pattern library
12. improve future case handling

If the product cannot support this loop, it is not truly implementing FCHMA.

## 16. Non-negotiable implementation points

These points must not be dropped.

### 16.1 Preserve raw evidence

Every structural interpretation must stay traceable to the original text span.
Do not store only summaries.

### 16.2 Keep ICF primary

ICF is the main frame for structure.
ICD is secondary.
Do not reverse this.

### 16.3 Preserve contextual chains

Do not reduce the system to sentence-level tagging or keyword extraction.

### 16.4 Preserve higher-order structure

Do not reduce the core model to flat categories or only pairwise links.

### 16.5 Separate AI output from human-reviewed knowledge

Store AI candidates, human edits, and final reviewed structures separately.

### 16.6 Treat feedback as first-class data

Do not stop at recommendation.
Record what happened.

### 16.7 Keep provider abstraction

The system must remain compatible with future general AI improvements.
Do not hardwire product logic to one model vendor or one model version.

## 17. What the knowledge asset really is

The long-term asset is not the current model.
The long-term asset is the reviewed structure linked to outcomes.

That includes:

- contextual semantic chains
- ICF structural mappings
- ICD-normalized health conditions
- reviewed structural hypotheses
- intervention choices
- intervention-outcome links
- exception cases
- pattern library evolution

This is what allows the product to improve together with general AI rather than compete against it directly.

## 18. Comparison with other approaches

### Traditional qualitative coding

Good for careful reading.
Weak for preserving full structural interaction across multiple sentences.

### Theme analysis with LLM support

Good for summarization and theme grouping.
Weak for representing case mechanisms and intervention points.

### Disease-first knowledge base

Good for quick lookup.
Weak for case-specific structural reasoning.

### Pure tabular analytics

Good for distributions and correlations.
Weak for understanding narrative mechanisms and support logic.

### FCHMA

Best suited when the goal is:

- structural case formulation
- intervention planning
- learning from outcomes
- combining narrative, structured responses, and professional review

## 19. Warning signs of implementation drift

If the product starts to look like any of the following, it is drifting away from FCHMA:

- disease-name-first recommendation engine
- chatbot-first UX
- summary-only output without evidence spans
- flat label tagging without chain structure
- recommendation without review
- no feedback-to-learning loop
- structure hidden inside opaque prompts with no editable representation

## 20. Practical design principles for Codex and Claude Code

Any coding agent working on this product should follow these rules.

- Read project instructions first.
- Preserve the north star.
- Treat ICF as the main structural frame.
- Treat ICD as normalization support.
- Keep the system case-centered.
- Keep contextual semantic chains editable.
- Keep structural hypotheses auditable.
- Keep intervention logic linked to structural logic.
- Keep feedback linked to interventions.
- Keep AI provider logic abstracted.
- Do not optimize local details at the expense of the core loop.

## 21. Short version for agents

FCHMA means:

- use ICF as the main structural frame
- use ICD only to normalize health condition labels
- preserve narrative as contextual semantic chains
- represent multi-factor interactions as higher-order case structure
- use AI for candidate generation, not final judgment
- keep human review central
- link structure to intervention
- link intervention to feedback
- treat reviewed structure plus outcomes as the main product asset

## 22. Final instruction

If a design or implementation choice makes the product simpler but breaks structural case understanding, human auditability, or the feedback learning loop, reject that choice.

