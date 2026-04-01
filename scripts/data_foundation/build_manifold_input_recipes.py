#!/usr/bin/env python3

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready'


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def split_labels(text: Any) -> list[str]:
    if text is None or (isinstance(text, float) and pd.isna(text)):
        return []
    return [part.strip() for part in str(text).split(' | ') if part and part.strip()]


def build_numeric_feature_rows(
    df: pd.DataFrame,
    respondent_id_column: str,
    grouping_fields: list[str],
    narrative_counts: dict[str, int],
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []

    for respondent_id, group in df.groupby(respondent_id_column, dropna=False):
        feature_row: dict[str, Any] = {
            'dataset_id': str(group.iloc[0]['dataset_id']),
            respondent_id_column: str(respondent_id),
            'source_row_count': int(len(group)),
            'narrative_unit_count': int(narrative_counts.get(str(respondent_id), 0)),
        }

        for field in grouping_fields:
            counts = group[field].fillna('missing').value_counts()
            for value, count in counts.items():
                feature_row[f'count__{field}__{value}'] = int(count)

        rows.append(feature_row)

    return rows


def build_sparse_token_rows(
    df: pd.DataFrame,
    narrative_rows: list[dict[str, Any]],
    respondent_id_column: str,
    lane: str,
) -> list[dict[str, Any]]:
    narrative_by_respondent: dict[str, list[dict[str, Any]]] = {}
    for row in narrative_rows:
        narrative_by_respondent.setdefault(str(row[respondent_id_column]), []).append(row)

    token_rows: list[dict[str, Any]] = []

    for respondent_id, group in df.groupby(respondent_id_column, dropna=False):
        tokens: set[str] = set()
        first = group.iloc[0]
        respondent_key = str(respondent_id)

        if lane == 'respondents':
            for concept in group['canonical_concept'].dropna().astype(str).unique():
                tokens.add(f'concept::{concept}')
            for frame in group['primary_frame'].dropna().astype(str).unique():
                tokens.add(f'frame::{frame}')
            for label in group[group['canonical_concept'] == 'health_condition']['label_text'].tolist():
                for part in split_labels(label):
                    tokens.add(f'health_condition::{part}')
        else:
            for dimension in group['canonical_dimension'].dropna().astype(str).unique():
                tokens.add(f'dimension::{dimension}')
            for model in group['support_model'].dropna().astype(str).unique():
                tokens.add(f'model::{model}')
            for label in group[group['canonical_dimension'] == 'actor_context']['label_text'].tolist():
                for part in split_labels(label):
                    tokens.add(f'actor_context::{part}')

        for row in narrative_by_respondent.get(respondent_key, []):
            if lane == 'respondents':
                tokens.add(f'narrative_concept::{row["canonical_concept"]}')
                tokens.add(f'narrative_field::{row["raw_name"]}')
            else:
                tokens.add(f'narrative_dimension::{row["canonical_dimension"]}')
                tokens.add(f'narrative_model::{row["support_model"]}')

        token_rows.append(
            {
                'dataset_id': str(first['dataset_id']),
                respondent_id_column: respondent_key,
                'token_count': len(tokens),
                'tokens': sorted(tokens),
            }
        )

    return token_rows


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    with path.open('w', encoding='utf-8') as handle:
      for row in rows:
          handle.write(json.dumps(row, ensure_ascii=False) + '\n')


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    with path.open('r', encoding='utf-8') as handle:
        return [json.loads(line) for line in handle if line.strip()]


def build_dataset_recipe(
    dataset_dir: Path,
    structured_filename: str,
    narrative_filename: str,
    respondent_id_column: str,
    lane: str,
    grouping_fields: list[str],
) -> dict[str, Any]:
    structured_path = dataset_dir / structured_filename
    narrative_path = dataset_dir / narrative_filename

    structured_df = pd.read_csv(structured_path, low_memory=False)
    narrative_rows = load_jsonl(narrative_path)

    narrative_counts: dict[str, int] = {}
    for row in narrative_rows:
        respondent_id = str(row[respondent_id_column])
        narrative_counts[respondent_id] = narrative_counts.get(respondent_id, 0) + 1

    numeric_rows = build_numeric_feature_rows(
        df=structured_df,
        respondent_id_column=respondent_id_column,
        grouping_fields=grouping_fields,
        narrative_counts=narrative_counts,
    )
    token_rows = build_sparse_token_rows(
        df=structured_df,
        narrative_rows=narrative_rows,
        respondent_id_column=respondent_id_column,
        lane=lane,
    )

    numeric_output_path = dataset_dir / 'manifold_numeric_features.csv'
    sparse_output_path = dataset_dir / 'manifold_sparse_tokens.jsonl'
    recipe_output_path = dataset_dir / 'manifold_recipe.json'

    pd.DataFrame(numeric_rows).to_csv(numeric_output_path, index=False)
    write_jsonl(sparse_output_path, token_rows)

    recipe = {
        'generated_at': iso_now(),
        'lane': lane,
        'dataset_id': str(structured_df.iloc[0]['dataset_id']),
        'inputs': {
            'structured_projection': str(structured_path.relative_to(REPO_ROOT)),
            'narrative_projection': str(narrative_path.relative_to(REPO_ROOT)),
        },
        'outputs': {
            'numeric_features': str(numeric_output_path.relative_to(REPO_ROOT)),
            'sparse_tokens': str(sparse_output_path.relative_to(REPO_ROOT)),
        },
        'respondent_count': len(numeric_rows),
        'grouping_fields': grouping_fields,
        'cost_control_notes': [
            'Uses local deterministic preprocessing only.',
            'Narrative text is represented as concept and field tokens, not raw text embeddings.',
            'Suitable for first-pass structure-similarity experiments before expensive model use.',
        ],
    }
    write_json(recipe_output_path, recipe)
    return recipe


def main() -> None:
    recipes = []

    recipes.append(
        build_dataset_recipe(
            dataset_dir=ANALYSIS_READY_ROOT / 'respondents' / 'employment_survey_3000' / 'v0',
            structured_filename='canonical_projection_candidates.csv',
            narrative_filename='narrative_projection_candidates.jsonl',
            respondent_id_column='respondent_id',
            lane='respondents',
            grouping_fields=['canonical_concept', 'primary_frame', 'response_type'],
        )
    )
    recipes.append(
        build_dataset_recipe(
            dataset_dir=ANALYSIS_READY_ROOT / 'respondents' / 'nanbyo_survey_4000' / 'v0',
            structured_filename='canonical_projection_candidates.csv',
            narrative_filename='narrative_projection_candidates.jsonl',
            respondent_id_column='respondent_id',
            lane='respondents',
            grouping_fields=['canonical_concept', 'primary_frame', 'response_type'],
        )
    )
    recipes.append(
        build_dataset_recipe(
            dataset_dir=ANALYSIS_READY_ROOT / 'supporters' / 'supporter_practice_nanbyo' / 'v0',
            structured_filename='supporter_projection_candidates.csv',
            narrative_filename='supporter_narrative_projection_candidates.jsonl',
            respondent_id_column='respondent_id',
            lane='supporters',
            grouping_fields=['canonical_dimension', 'support_model', 'response_type'],
        )
    )
    recipes.append(
        build_dataset_recipe(
            dataset_dir=ANALYSIS_READY_ROOT / 'supporters' / 'supporter_practice_toku18' / 'v0',
            structured_filename='supporter_projection_candidates.csv',
            narrative_filename='supporter_narrative_projection_candidates.jsonl',
            respondent_id_column='respondent_id',
            lane='supporters',
            grouping_fields=['canonical_dimension', 'support_model', 'response_type'],
        )
    )

    print(json.dumps({'generated_at': iso_now(), 'recipes': recipes}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
