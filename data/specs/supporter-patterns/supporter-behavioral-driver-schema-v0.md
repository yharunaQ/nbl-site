# Supporter Behavioral Driver Schema v0

対象:

- `toku18_Supporters.xlsx`
- `toku18_supporters_structure.pdf`
- `Nanbyo_Supporters.xlsx`

目的:

- 支援者データを「意見集」ではなく、支援実行を促進・阻害する構造として扱う
- intervention hypothesis に `何をすべきか` だけでなく `誰が実行できるか / なぜ実行されないか` を入れる

## 2つの中核モデル

### 1. support_action_model

見るもの:

- どの職業的課題に
- どの支援内容を実施すると
- 解決・改善 / 未解決 がどう変わるか

主な概念:

- `vocational_difficulty_target`
- `support_action`
- `support_action_intensity`
- `difficulty_resolution_state`
- `target_population_mix`
- `institution_type`
- `role_type`

主な対応元:

- `toku18` の `問7*`, `問8*`
- `toku18_structure.pdf` の ICF 枠組み説明

### 2. support_implementation_model

見るもの:

- 効果的支援が、なぜ実行される / されないか

主な概念:

- `role_recognition`
- `support_knowledge`
- `information_access`
- `network_participation`
- `organizational_climate`
- `regional_climate`
- `supporter_motivation`
- `implementation_feasibility`
- `implementation_barrier`

主な対応元:

- `toku18` の `問9*`, `問10*`, `問11*`, `問12*`, `問13*`, `問14*`, `問15*`
- `toku18_supporters_structure.pdf` の計画的行動理論ベース説明
- `Nanbyo_Supporters` の `Q05`, `Q06*`, `Q07*`, `Q08*`, `Q09*`, `Q14x`

## Canonical dimensions

### actor_context

- `institution_type`
- `institution_role_group`
- `professional_qualification`
- `specialty_domain`
- `region`

### client_exposure

- `client_volume`
- `disability_mix`
- `severity_mix`
- `rare_disease_exposure`

### support_orientation

- `whole_person_orientation`
- `environment_modification_orientation`
- `team_support_orientation`
- `life_scene_assessment_orientation`
- `work_continuity_orientation`

### support_beliefs

- `belief_work_condition_fit`
- `belief_disclosure_importance`
- `belief_support_continuity`
- `belief_self_management_importance`
- `belief_economic_context_importance`

### support_knowledge_and_access

- `knowledge_basic_support`
- `knowledge_role_division`
- `knowledge_information_sources`
- `access_to_training`
- `access_to_cases_or_examples`

### network_and_coordination

- `network_participation_level`
- `cross_agency_contact_density`
- `clarity_of_coordinator`
- `availability_of_external_referral`
- `local_coordination_readiness`

### organizational_and_regional_climate

- `organizational_supportiveness`
- `regional_supportiveness`
- `discipline_specific_encouragement`
- `discipline_specific_inhibition`

### motivation_and_meaning

- `supporter_meaningfulness`
- `perceived_reward`
- `perceived_burden`
- `implementation_willingness`

### implementation_constraints

- `time_constraint`
- `knowledge_constraint`
- `authority_constraint`
- `network_constraint`
- `resource_constraint`

## Runtime use in FCHMA

### What this schema should influence

- intervention feasibility ranking
- recommended intervention actor
- coordination plan suggestions
- warning messages about likely implementation barriers
- supporter-facing explanation and training suggestions

### What this schema should not do

- override respondent-side evidence
- determine final support decisions automatically
- be used as if it were direct case outcome evidence

## Suggested first derived assets

- `supporter_behavioral_driver_schema.json`
- `coordination_failure_mode_library.json`
- `intervention_actor_capability_matrix.json`
- `supporter_training_need_clusters.json`

## Immediate follow-on work

1. Map `toku18` variables into the dimensions above.
2. Map `Nanbyo_Supporters` variables into the same dimensions where possible.
3. Build a compact `supporter_practice_patterns` runtime pack.
4. Connect this pack only to intervention generation and coordination explanation layers.
