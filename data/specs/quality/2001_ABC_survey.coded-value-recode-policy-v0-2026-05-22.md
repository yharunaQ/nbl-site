# 2001 ABC Survey Coded-Value Recode Policy

作成日: 2026-05-22
Lane: Falcon Lab
状態: recode policy / 未レビュー / 変換未適用 / 統合なし / 昇格なし
本文引用: なし
row-level回答本文の外部化: なし

## Purpose

このpolicyは、`2001_ABC_survey`を専門知識ネットワークの歴史的対照層として使う前に、辞書外コードを静かに欠損化したり、逆に正規カテゴリとして扱ったりしないための処理境界を定める。

この文書は実データの値を書き換えない。以後の派生集計・contrast card生成時に使う分析上の扱いを定義する。

## Input Audit

Source: `data/specs/quality/2001_ABC_survey.linkage-noise-profile-v0-2026-05-22.json`

Initial coded-value audit found 286 out-of-dictionary coded rows across 6 variables.

| table | variable | dictionary content | out-of-dictionary rows | top out-of-dictionary codes | policy |
|---|---|---|---:|---|---|
| B | 当該障害者の勤務形態 | 勤務形態 | 15 | `5` x10, `6` x3, `7` x2 | `undocumented_code_hold` |
| B | 合併障害2つ目 | 合併障害2つ目 | 2 | `62` x1, `0` x1 | `undocumented_code_hold` |
| B | 当該障害者の程度 | 障害程度 | 80 | `9` x80 | `unknown_code_candidate_hold` |
| C | 合併障害1 | 合併障害1 | 15 | `20` x15 | `undocumented_code_hold` |
| C | 合併障害2 | 合併障害2 | 21 | `20` x21 | `undocumented_code_hold` |
| C | 問5　手帳の障害程度 | 障害程度 | 153 | `9` x153 | `unknown_code_candidate_hold` |

## Recode Classes

### `valid_dictionary_code`

The value appears in the questionnaire/data-dictionary allowed-code list.

Use:

- include in coded-category analyses.
- preserve original code and label.

### `blank_or_missing`

The value is blank, null, or absent.

Use:

- keep as missing for the specific variable.
- do not exclude the whole linked record from unrelated analyses.

### `unknown_code_candidate_hold`

The value is outside the current dictionary but plausibly represents an old unknown/no-answer code pattern.

Current cases:

- B severity code `9`.
- C severity code `9`.

Use:

- exclude from severity numerator/denominator unless the specific analysis has an explicit `unknown` stratum.
- keep a `severity_code_hold` noise flag on the record or aggregate cell.
- do not reinterpret as a severity level.
- do not collapse into ordinary missing until codebook reconciliation confirms it.

### `undocumented_code_hold`

The value is outside the current dictionary and cannot be safely interpreted from the current artifact set.

Current cases:

- B work-form codes `5`, `6`, `7`.
- B comorbidity codes `62`, `0`.
- C comorbidity code `20`.

Use:

- exclude from analyses that require that variable's categorical meaning.
- keep an `undocumented_code_hold` flag.
- preserve aggregate counts separately.
- do not map to the nearest category.

## Analysis Rules

1. Never overwrite original secure source files.
2. Do not remove whole A/B/C linked records solely because one variable has a held code.
3. For each derived aggregate, state whether held codes were excluded, separated, or not relevant.
4. For strict triadic contrast cards, carry held-code flags into `noise_flags`.
5. Do not use severity, work-form, or comorbidity fields as condition-window modifiers until held-code handling is explicit in that artifact.
6. Category-level B support vs C need/usefulness profiles can proceed because these held codes do not define the support-category items themselves.

## Integration Boundary

These recode classes are quality controls only. They do not decide:

- whether B or C is more correct.
- whether a support was adequate.
- whether a worker's condition category explains the support need.
- whether a historical pattern is valid for current practice.

The allowed use is to prevent avoidable coded-value noise when generating historical contrast objects for Falcon.
