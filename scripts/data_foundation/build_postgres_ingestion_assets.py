#!/usr/bin/env python3

from __future__ import annotations

import json
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
SPEC_ROOT = REPO_ROOT / 'data' / 'specs'
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready'
MANIFEST_ROOT = SPEC_ROOT / 'source-manifests'
INGESTION_CONTRACT_PATH = SPEC_ROOT / 'ingestion' / 'postgres-derived-contract-v0.json'

UUID_NAMESPACE = uuid.UUID('4f79cb48-fc49-4d2d-9eb1-99e785d3108a')


@dataclass(frozen=True)
class DatasetBuildConfig:
    dataset_id: str
    lane: str
    source_role: str
    version: str
    structured_filename: str
    narrative_filename: str
    projection_filename: str
    narrative_projection_filename: str
    projection_manifest_filename: str


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding='utf-8'))


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    with path.open('r', encoding='utf-8') as handle:
        return [json.loads(line) for line in handle if line.strip()]


def deterministic_uuid(*parts: str) -> str:
    seed = '::'.join(parts)
    return str(uuid.uuid5(UUID_NAMESPACE, seed))


def json_text(payload: Any) -> str:
    return json.dumps(payload, ensure_ascii=False, sort_keys=True)


def numeric_or_none(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, float) and pd.isna(value):
        return None
    if isinstance(value, str) and not value.strip():
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def int_or_zero(value: Any) -> int:
    numeric_value = numeric_or_none(value)
    if numeric_value is None:
        return 0
    return int(numeric_value)


def bool_or_false(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, float) and pd.isna(value):
        return False
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in {'', '0', 'false', 'no', 'n'}:
            return False
        if lowered in {'1', 'true', 'yes', 'y'}:
            return True
    return bool(value)


def clean_text(value: Any) -> str:
    if value is None:
        return ''
    if isinstance(value, float) and pd.isna(value):
        return ''
    return str(value).strip()


def build_dataset_assets(config: DatasetBuildConfig, contract_version: str) -> dict[str, Any]:
    dataset_dir = ANALYSIS_READY_ROOT / config.lane / config.dataset_id / config.version
    ingest_dir = dataset_dir / 'postgres_ingestion'
    ingest_dir.mkdir(parents=True, exist_ok=True)

    structured_df = pd.read_csv(dataset_dir / config.structured_filename, low_memory=False)
    narrative_rows = load_jsonl(dataset_dir / config.narrative_filename)
    projection_df = pd.read_csv(dataset_dir / config.projection_filename, low_memory=False)
    narrative_projection_rows = load_jsonl(dataset_dir / config.narrative_projection_filename)
    manifold_df = pd.read_csv(dataset_dir / 'manifold_numeric_features.csv', low_memory=False)
    manifold_tokens = load_jsonl(dataset_dir / 'manifold_sparse_tokens.jsonl')

    analysis_ready_manifest = load_json(dataset_dir / 'analysis-ready-manifest.json')
    projection_manifest = load_json(dataset_dir / config.projection_manifest_filename)
    manifold_recipe = load_json(dataset_dir / 'manifold_recipe.json')
    source_manifest = load_json(MANIFEST_ROOT / f'{config.dataset_id}.source-manifest.json')

    batch_key = f'{config.lane}:{config.dataset_id}:{config.version}'
    batch_id = deterministic_uuid('dataset_ingestion_batch', batch_key)

    narrative_counts: dict[str, int] = {}
    source_row_spans: dict[str, set[int]] = {}
    structured_counts: dict[str, int] = {}
    for _, row in structured_df.iterrows():
        respondent_id = clean_text(row.get('respondent_id'))
        if not respondent_id:
            continue
        structured_counts[respondent_id] = structured_counts.get(respondent_id, 0) + 1
        source_row_spans.setdefault(respondent_id, set()).add(int_or_zero(row.get('row_index', 0)))
    for row in narrative_rows:
        respondent_id = clean_text(row.get('respondent_id'))
        if not respondent_id:
            continue
        narrative_counts[respondent_id] = narrative_counts.get(respondent_id, 0) + 1
        source_row_spans.setdefault(respondent_id, set()).add(int_or_zero(row.get('row_index', 0)))

    subject_rows: list[dict[str, Any]] = []
    subject_ids: dict[str, str] = {}

    for respondent_id in sorted({clean_text(value) for value in structured_df['respondent_id'].tolist()}):
        if not respondent_id:
            continue
        subject_id = deterministic_uuid('dataset_subject', batch_key, respondent_id)
        subject_ids[respondent_id] = subject_id
        row_indices = sorted(source_row_spans.get(respondent_id, set()))
        subject_rows.append(
            {
                'id': subject_id,
                'batch_id': batch_id,
                'dataset_id': config.dataset_id,
                'lane': config.lane,
                'subject_key': respondent_id,
                'source_record_count': int(structured_counts.get(respondent_id, 0)),
                'narrative_unit_count': int(narrative_counts.get(respondent_id, 0)),
                'metadata_json': json_text(
                    {
                        'source_id': source_manifest['source_id'],
                        'source_role': config.source_role,
                        'row_index_min': row_indices[0] if row_indices else None,
                        'row_index_max': row_indices[-1] if row_indices else None,
                    }
                ),
            }
        )

    field_rows: list[dict[str, Any]] = []
    for row in structured_df.itertuples(index=False):
        respondent_id = clean_text(getattr(row, 'respondent_id', ''))
        subject_id = subject_ids.get(respondent_id)
        if not subject_id:
            continue
        field_id = deterministic_uuid(
            'dataset_field_fact',
            batch_key,
            respondent_id,
            str(getattr(row, 'row_index', '')),
            clean_text(getattr(row, 'raw_name', '')),
        )
        field_rows.append(
            {
                'id': field_id,
                'subject_id': subject_id,
                'source_row_index': int_or_zero(getattr(row, 'row_index', 0)),
                'raw_name': clean_text(getattr(row, 'raw_name', '')),
                'display_name': clean_text(getattr(row, 'display_name', '')),
                'question_group': clean_text(getattr(row, 'question_group', '')),
                'response_type': clean_text(getattr(row, 'response_type', '')),
                'raw_value_text': clean_text(getattr(row, 'raw_value_text', '')),
                'normalized_value': clean_text(getattr(row, 'normalized_value', '')),
                'label_text': clean_text(getattr(row, 'label_text', '')),
                'numeric_value': numeric_or_none(getattr(row, 'numeric_value', None)),
                'multiselect_count': int_or_zero(getattr(row, 'multiselect_count', 0)),
                'manual_review_required': bool_or_false(
                    getattr(row, 'manual_review_required', False),
                ),
                'payload_json': json_text(
                    {
                        'dataset_id': config.dataset_id,
                        'source_id': clean_text(getattr(row, 'source_id', '')),
                    }
                ),
            }
        )

    narrative_unit_rows: list[dict[str, Any]] = []
    for row in narrative_rows:
        respondent_id = clean_text(row.get('respondent_id'))
        subject_id = subject_ids.get(respondent_id)
        if not subject_id:
            continue
        narrative_id = deterministic_uuid(
            'dataset_narrative_unit',
            batch_key,
            respondent_id,
            str(row.get('row_index', '')),
            clean_text(row.get('raw_name')),
            str(row.get('unit_index', '')),
            clean_text(row.get('content_hash')),
        )
        narrative_unit_rows.append(
            {
                'id': narrative_id,
                'subject_id': subject_id,
                'source_row_index': int_or_zero(row.get('row_index', 0)),
                'source_field_key': clean_text(row.get('raw_name')),
                'display_name': clean_text(row.get('display_name')),
                'question_group': clean_text(row.get('question_group')),
                'unit_index': int(row.get('unit_index', 0)),
                'raw_text': clean_text(row.get('unit_text')),
                'content_hash': clean_text(row.get('content_hash')),
                'payload_json': json_text(
                    {
                        'dataset_id': config.dataset_id,
                        'source_id': clean_text(row.get('source_id')),
                        'char_count': int_or_zero(row.get('char_count', 0)),
                    }
                ),
            }
        )

    projection_rows: list[dict[str, Any]] = []
    canonical_key_column = 'canonical_concept' if config.lane == 'respondents' else 'canonical_dimension'
    primary_axis_column = 'primary_frame' if config.lane == 'respondents' else 'support_model'
    secondary_axis_column = 'secondary_frame' if config.lane == 'respondents' else None
    structured_source_kind = 'respondent_structured' if config.lane == 'respondents' else 'supporter_structured'
    narrative_source_kind = 'respondent_narrative' if config.lane == 'respondents' else 'supporter_narrative'

    for row in projection_df.itertuples(index=False):
        respondent_id = clean_text(getattr(row, 'respondent_id', ''))
        subject_id = subject_ids.get(respondent_id)
        if not subject_id:
            continue
        projection_id = deterministic_uuid(
            'dataset_projection_fact',
            batch_key,
            structured_source_kind,
            respondent_id,
            str(getattr(row, 'row_index', '')),
            clean_text(getattr(row, 'raw_name', '')),
            clean_text(getattr(row, canonical_key_column, '')),
        )
        payload = {
            'dataset_id': config.dataset_id,
            'matched_pattern': clean_text(getattr(row, 'matched_pattern', '')),
            'normalized_value': clean_text(getattr(row, 'normalized_value', '')),
        }
        projection_rows.append(
            {
                'id': projection_id,
                'subject_id': subject_id,
                'source_row_index': int_or_zero(getattr(row, 'row_index', 0)),
                'source_kind': structured_source_kind,
                'source_field_key': clean_text(getattr(row, 'raw_name', '')),
                'display_name': clean_text(getattr(row, 'display_name', '')),
                'question_group': clean_text(getattr(row, 'question_group', '')),
                'response_type': clean_text(getattr(row, 'response_type', '')),
                'canonical_key': clean_text(getattr(row, canonical_key_column, '')),
                'primary_axis': clean_text(getattr(row, primary_axis_column, '')),
                'secondary_axis': clean_text(getattr(row, secondary_axis_column, '')) if secondary_axis_column else '',
                'projection_confidence': clean_text(getattr(row, 'projection_confidence', '')),
                'projection_rationale': clean_text(getattr(row, 'projection_rationale', '')),
                'label_text': clean_text(getattr(row, 'label_text', '')),
                'payload_json': json_text(payload),
            }
        )

    for row in narrative_projection_rows:
        respondent_id = clean_text(row.get('respondent_id'))
        subject_id = subject_ids.get(respondent_id)
        if not subject_id:
            continue
        projection_id = deterministic_uuid(
            'dataset_projection_fact',
            batch_key,
            narrative_source_kind,
            respondent_id,
            str(row.get('row_index', '')),
            clean_text(row.get('raw_name')),
            str(row.get('unit_index', '')),
            clean_text(row.get(canonical_key_column)),
        )
        payload = {
            'dataset_id': config.dataset_id,
            'matched_pattern': clean_text(row.get('matched_pattern')),
            'unit_text': clean_text(row.get('unit_text')),
            'content_hash': clean_text(row.get('content_hash')),
        }
        primary_axis = clean_text(row.get(primary_axis_column))
        secondary_axis = clean_text(row.get(secondary_axis_column)) if secondary_axis_column else ''
        projection_rows.append(
            {
                'id': projection_id,
                'subject_id': subject_id,
                'source_row_index': int_or_zero(row.get('row_index', 0)),
                'source_kind': narrative_source_kind,
                'source_field_key': clean_text(row.get('raw_name')),
                'display_name': clean_text(row.get('display_name')),
                'question_group': clean_text(row.get('question_group')),
                'response_type': '',
                'canonical_key': clean_text(row.get(canonical_key_column)),
                'primary_axis': primary_axis,
                'secondary_axis': secondary_axis,
                'projection_confidence': clean_text(row.get('projection_confidence')),
                'projection_rationale': clean_text(row.get('projection_rationale')),
                'label_text': '',
                'payload_json': json_text(payload),
            }
        )

    token_map = {
        clean_text(row.get('respondent_id')): row
        for row in manifold_tokens
        if clean_text(row.get('respondent_id'))
    }
    manifold_rows: list[dict[str, Any]] = []
    manifold_feature_columns = [
        column for column in manifold_df.columns if column not in {'dataset_id', 'respondent_id'}
    ]
    for row in manifold_df.itertuples(index=False):
        respondent_id = clean_text(getattr(row, 'respondent_id', ''))
        subject_id = subject_ids.get(respondent_id)
        if not subject_id:
            continue
        numeric_features = {}
        for column in manifold_feature_columns:
            value = getattr(row, column)
            numeric_value = numeric_or_none(value)
            if numeric_value is not None:
                numeric_features[column] = numeric_value
        token_row = token_map.get(respondent_id, {})
        sparse_tokens = token_row.get('tokens', [])
        profile_id = deterministic_uuid('dataset_manifold_profile', batch_key, respondent_id)
        manifold_rows.append(
            {
                'id': profile_id,
                'subject_id': subject_id,
                'numeric_feature_count': len(numeric_features),
                'token_count': int(token_row.get('token_count', len(sparse_tokens) if sparse_tokens else 0)),
                'numeric_features_json': json_text(numeric_features),
                'sparse_tokens_json': json_text(sparse_tokens),
                'recipe_json': json_text(manifold_recipe),
            }
        )

    batch_row = {
        'id': batch_id,
        'batch_key': batch_key,
        'dataset_id': config.dataset_id,
        'lane': config.lane,
        'source_role': config.source_role,
        'version': config.version,
        'artifact_contract_version': contract_version,
        'analysis_ready_manifest_json': json_text(analysis_ready_manifest),
        'projection_manifest_json': json_text(projection_manifest),
        'manifold_recipe_json': json_text(manifold_recipe),
        'source_manifest_json': json_text(source_manifest),
    }

    pd.DataFrame([batch_row]).to_csv(ingest_dir / 'dataset_ingestion_batches.csv', index=False)
    pd.DataFrame(subject_rows).to_csv(ingest_dir / 'dataset_subjects.csv', index=False)
    pd.DataFrame(field_rows).to_csv(ingest_dir / 'dataset_field_facts.csv', index=False)
    pd.DataFrame(narrative_unit_rows).to_csv(ingest_dir / 'dataset_narrative_units.csv', index=False)
    pd.DataFrame(projection_rows).to_csv(ingest_dir / 'dataset_projection_facts.csv', index=False)
    pd.DataFrame(manifold_rows).to_csv(ingest_dir / 'dataset_manifold_profiles.csv', index=False)

    load_sql = f"""-- Generated local loader for {batch_key}
\\copy dataset_ingestion_batches from '{(ingest_dir / 'dataset_ingestion_batches.csv').resolve()}' with (format csv, header true);
\\copy dataset_subjects from '{(ingest_dir / 'dataset_subjects.csv').resolve()}' with (format csv, header true);
\\copy dataset_field_facts from '{(ingest_dir / 'dataset_field_facts.csv').resolve()}' with (format csv, header true);
\\copy dataset_narrative_units from '{(ingest_dir / 'dataset_narrative_units.csv').resolve()}' with (format csv, header true);
\\copy dataset_projection_facts from '{(ingest_dir / 'dataset_projection_facts.csv').resolve()}' with (format csv, header true);
\\copy dataset_manifold_profiles from '{(ingest_dir / 'dataset_manifold_profiles.csv').resolve()}' with (format csv, header true);
"""
    (ingest_dir / 'load_postgres_ingestion.sql').write_text(load_sql, encoding='utf-8')

    manifest = {
        'generated_at': iso_now(),
        'contract_version': contract_version,
        'dataset_id': config.dataset_id,
        'lane': config.lane,
        'version': config.version,
        'batch_key': batch_key,
        'outputs': {
            'dataset_ingestion_batches': str((ingest_dir / 'dataset_ingestion_batches.csv').relative_to(REPO_ROOT)),
            'dataset_subjects': str((ingest_dir / 'dataset_subjects.csv').relative_to(REPO_ROOT)),
            'dataset_field_facts': str((ingest_dir / 'dataset_field_facts.csv').relative_to(REPO_ROOT)),
            'dataset_narrative_units': str((ingest_dir / 'dataset_narrative_units.csv').relative_to(REPO_ROOT)),
            'dataset_projection_facts': str((ingest_dir / 'dataset_projection_facts.csv').relative_to(REPO_ROOT)),
            'dataset_manifold_profiles': str((ingest_dir / 'dataset_manifold_profiles.csv').relative_to(REPO_ROOT)),
            'load_sql': str((ingest_dir / 'load_postgres_ingestion.sql').relative_to(REPO_ROOT)),
        },
        'counts': {
            'subjects': len(subject_rows),
            'field_facts': len(field_rows),
            'narrative_units': len(narrative_unit_rows),
            'projection_facts': len(projection_rows),
            'manifold_profiles': len(manifold_rows),
        },
        'notes': [
            'Derived assets only. Original secure workbooks remain outside PostgreSQL.',
            'This contract keeps runtime case imports and research queries aligned on the same normalized shapes.',
        ],
    }
    (ingest_dir / 'postgres_ingestion_manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    return manifest


def main() -> None:
    contract_version = load_json(INGESTION_CONTRACT_PATH)['version']
    configs = [
        DatasetBuildConfig(
            dataset_id='employment_survey_3000',
            lane='respondents',
            source_role='case_structure_source',
            version='v0',
            structured_filename='structured_features.csv',
            narrative_filename='free_text_units.jsonl',
            projection_filename='canonical_projection_candidates.csv',
            narrative_projection_filename='narrative_projection_candidates.jsonl',
            projection_manifest_filename='canonical_projection_manifest.json',
        ),
        DatasetBuildConfig(
            dataset_id='nanbyo_survey_4000',
            lane='respondents',
            source_role='case_structure_source',
            version='v0',
            structured_filename='structured_features.csv',
            narrative_filename='free_text_units.jsonl',
            projection_filename='canonical_projection_candidates.csv',
            narrative_projection_filename='narrative_projection_candidates.jsonl',
            projection_manifest_filename='canonical_projection_manifest.json',
        ),
        DatasetBuildConfig(
            dataset_id='supporter_practice_nanbyo',
            lane='supporters',
            source_role='support_practice_source',
            version='v0',
            structured_filename='structured_features.csv',
            narrative_filename='free_text_units.jsonl',
            projection_filename='supporter_projection_candidates.csv',
            narrative_projection_filename='supporter_narrative_projection_candidates.jsonl',
            projection_manifest_filename='supporter_projection_manifest.json',
        ),
        DatasetBuildConfig(
            dataset_id='supporter_practice_toku18',
            lane='supporters',
            source_role='support_practice_source',
            version='v0',
            structured_filename='structured_features.csv',
            narrative_filename='free_text_units.jsonl',
            projection_filename='supporter_projection_candidates.csv',
            narrative_projection_filename='supporter_narrative_projection_candidates.jsonl',
            projection_manifest_filename='supporter_projection_manifest.json',
        ),
    ]

    manifests = [build_dataset_assets(config, contract_version) for config in configs]
    print(json.dumps({'generated_at': iso_now(), 'manifests': manifests}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
