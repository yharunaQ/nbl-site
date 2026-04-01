# FCHMA Respondent Manifold Patterns

## What Was Missing

Until this point, the repo had:

- original structured data
- deterministic projection candidates
- manifold-ready numeric and sparse token inputs

But it did **not** yet have an actual respondent-side manifold pattern extraction step that turned those inputs into a reusable structural knowledge core.

## What Is Implemented Now

The repo now includes:

- `scripts/data_foundation/build_respondent_manifold_patterns.py`
- `data/analysis_ready/pattern_library/respondents/v0/respondent_manifold_patterns.json`
- `data/analysis_ready/pattern_library/respondents/v0/respondent_manifold_assignments.csv`
- `data/analysis_ready/pattern_library/respondents/v0/respondent_manifold_summary.json`
- `lib/fchma/respondentPatternLibrary.ts`

The new extraction step:

1. loads the respondent joint subject space
2. keeps structured numeric features, sparse tokens, and narrative keyword signals in one subject-level table
3. builds a shared low-dimensional embedding from that joint representation
4. extracts multiscale global, local, and micro patterns
5. derives cluster-level causal framework seeds
6. stores representative narratives and lifted structured labels

## Output Shape

Each pattern entry now includes:

- `pattern_key`
- `cluster_subject_count`
- `dataset_mix`
- `dominant_keyword_groups`
- `top_labels_by_concept`
- `causal_framework.summary`
- `causal_framework.chain`
- `causal_framework.amplifiers`
- `causal_framework.protectors`
- `causal_framework.intervention_ports`
- `representative_narratives`

## Important Caveat

This is now a stronger **multiscale pattern seed layer**, but it is still not the final FCHMA judgment layer.

It should be used as:

- a reusable structural prior
- a pattern-library backbone for next-JAC reasoning
- a source of counter-hypotheses and typical intervention ports

It should **not** be treated as:

- final causal truth
- a disease-to-accommodation lookup
- a replacement for case-level review

## Why This Matters

This is the first point where the repo actually contains a data-derived respondent pattern library built from:

- structured respondent data
- narrative respondent data
- a shared joint subject space
- multiscale manifold-oriented local computation

So the system is no longer only preparing manifold inputs. It now begins to extract and preserve manifold-derived structural knowledge.

## Next Step

Use the generated respondent pattern library to update the product-facing frame view so that:

- the current 26-frame summary is treated as a downstream projection
- frame definitions can be revised from data-derived occupancy patterns
- one consultation narrative can first map to manifold-derived structural priors before producing causal summaries and intervention hypotheses
