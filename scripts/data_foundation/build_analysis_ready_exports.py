#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
SPEC_ROOT = REPO_ROOT / 'data' / 'specs'
MANIFEST_ROOT = SPEC_ROOT / 'source-manifests'
RESPONSE_MAP_ROOT = SPEC_ROOT / 'response-type-maps'
ORIGINAL_ROOT = REPO_ROOT / 'data' / 'original_secure' / 'structured'
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready'


@dataclass
class DictionaryEntry:
    raw_name: str
    labels: list[str]
    code_width: int | None
    min_code: int | None
    max_code: int | None


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding='utf-8'))


def normalize_column_name(name: Any) -> str:
    if name is None:
        return ''
    if isinstance(name, float) and math.isnan(name):
        return ''
    return str(name).strip()


def clean_text(value: Any) -> str:
    if value is None:
        return ''
    if isinstance(value, float) and math.isnan(value):
        return ''
    if pd.isna(value):
        return ''
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def to_int_or_none(value: Any) -> int | None:
    text = clean_text(value)
    if not text:
        return None
    try:
        return int(float(text))
    except ValueError:
        return None


def detect_code_width(dictionary_df: pd.DataFrame) -> tuple[str | None, str | None]:
    width_col = None
    width_mode = None

    if '二桁データ' in dictionary_df.columns:
        width_col = '二桁データ'
        width_mode = 'two_digit_flag'
    elif 'データ桁数' in dictionary_df.columns:
        width_col = 'データ桁数'
        width_mode = 'digit_width'

    return width_col, width_mode


def extract_dictionary_entries(dictionary_df: pd.DataFrame) -> dict[str, DictionaryEntry]:
    if dictionary_df.empty:
        return {}

    raw_name_col = '元の名前' if '元の名前' in dictionary_df.columns else 'ID' if 'ID' in dictionary_df.columns else None
    if raw_name_col is None:
        return {}

    width_col, width_mode = detect_code_width(dictionary_df)
    entries: dict[str, DictionaryEntry] = {}

    for _, row in dictionary_df.iterrows():
        raw_name = clean_text(row.get(raw_name_col))
        if not raw_name:
            continue

        labels_raw = clean_text(row.get('ラベル'))
        labels = [part.strip() for part in labels_raw.split(';') if part.strip()]
        min_code = to_int_or_none(row.get('最小'))
        max_code = to_int_or_none(row.get('最大'))

        code_width = None
        if width_col:
            width_value = row.get(width_col)
            if width_mode == 'two_digit_flag':
                code_width = 2 if to_int_or_none(width_value) else None
            else:
                code_width = to_int_or_none(width_value)

        entries[raw_name] = DictionaryEntry(
            raw_name=raw_name,
            labels=labels,
            code_width=code_width,
            min_code=min_code,
            max_code=max_code,
        )

    return entries


def format_code(value: int, code_width: int | None) -> str:
    if code_width and code_width > 1:
        return str(value).zfill(code_width)
    return str(value)


def build_code_lookup(entry: DictionaryEntry) -> dict[str, str]:
    if not entry.labels:
        return {}

    if entry.min_code is not None and entry.max_code is not None:
        expected = entry.max_code - entry.min_code + 1
        if expected == len(entry.labels):
            return {
                format_code(entry.min_code + index, entry.code_width): label
                for index, label in enumerate(entry.labels)
            }

    return {
        format_code(index + 1, entry.code_width): label
        for index, label in enumerate(entry.labels)
    }


def normalize_code_text(raw_text: str, entry: DictionaryEntry | None) -> str:
    cleaned = raw_text.strip()
    if not cleaned:
        return ''

    if re.fullmatch(r'-?\d+(?:\.0+)?', cleaned):
        integer_value = int(float(cleaned))
        return format_code(integer_value, entry.code_width if entry else None)

    return cleaned


def split_multiselect_value(raw_text: str, entry: DictionaryEntry | None) -> list[str]:
    return [
        normalize_code_text(part, entry)
        for part in raw_text.split('+')
        if normalize_code_text(part, entry)
    ]


def infer_label(code_text: str, entry: DictionaryEntry | None) -> str:
    if not entry:
        return ''
    lookup = build_code_lookup(entry)
    return lookup.get(code_text, '')


def lane_from_role(source_role: str) -> str:
    if source_role == 'case_structure_source':
        return 'respondents'
    if source_role == 'support_practice_source':
        return 'supporters'
    return 'other'


def sentence_like_split(text: str) -> list[str]:
    normalized = text.replace('\r\n', '\n').replace('\r', '\n')
    parts = re.split(r'(?<=[。！？])|\n+', normalized)
    return [part.strip() for part in parts if part and part.strip()]


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def export_dataset(manifest: dict[str, Any], response_map: dict[str, Any], version: str) -> dict[str, Any]:
    dataset_id = manifest['dataset_id']
    source_id = manifest['source_id']
    source_role = manifest['source_role']
    lane = lane_from_role(source_role)
    workbook_path = ORIGINAL_ROOT / manifest['file_path']

    if not workbook_path.exists():
        raise FileNotFoundError(f'Missing workbook: {workbook_path}')

    data_sheet = manifest.get('data_sheet')
    dictionary_sheet = manifest.get('dictionary_sheet')
    if not data_sheet or not dictionary_sheet:
        raise ValueError(f'Manifest missing sheet names for {dataset_id}')

    workbook = pd.ExcelFile(workbook_path)
    data_df = workbook.parse(data_sheet)
    dictionary_df = workbook.parse(dictionary_sheet)
    data_df.columns = [normalize_column_name(column) for column in data_df.columns]
    dictionary_df.columns = [normalize_column_name(column) for column in dictionary_df.columns]

    dictionary_entries = extract_dictionary_entries(dictionary_df)
    variables = {
        item['raw_name']: item
        for item in response_map.get('variables', [])
        if clean_text(item.get('raw_name'))
    }

    respondent_id_column = 'ID' if 'ID' in data_df.columns else None
    structured_rows: list[dict[str, Any]] = []
    multiselect_rows: list[dict[str, Any]] = []
    free_text_rows: list[dict[str, Any]] = []
    codebook_rows: list[dict[str, Any]] = []

    for raw_name, metadata in variables.items():
        entry = dictionary_entries.get(raw_name)
        codebook_rows.append(
            {
                'dataset_id': dataset_id,
                'source_id': source_id,
                'raw_name': raw_name,
                'display_name': clean_text(metadata.get('display_name')),
                'question_group': clean_text(metadata.get('question_group')),
                'response_type': clean_text(metadata.get('response_type_guess')),
                'manual_review_required': bool(metadata.get('manual_review_required')),
                'code_width': entry.code_width if entry else None,
                'min_code': entry.min_code if entry else None,
                'max_code': entry.max_code if entry else None,
                'labels_joined': ' | '.join(entry.labels) if entry else '',
            }
        )

    for row_index, row in data_df.iterrows():
        respondent_id = clean_text(row.get(respondent_id_column)) if respondent_id_column else ''
        if not respondent_id:
            respondent_id = f'row_{row_index + 1:05d}'

        for raw_name, metadata in variables.items():
            if raw_name not in data_df.columns:
                continue

            raw_value = row.get(raw_name)
            raw_value_text = clean_text(raw_value)
            if not raw_value_text:
                continue

            response_type = clean_text(metadata.get('response_type_guess'))
            entry = dictionary_entries.get(raw_name)
            display_name = clean_text(metadata.get('display_name'))
            question_group = clean_text(metadata.get('question_group'))

            if response_type == 'free_text':
                units = sentence_like_split(raw_value_text) or [raw_value_text]
                for unit_index, unit_text in enumerate(units, start=1):
                    free_text_rows.append(
                        {
                            'dataset_id': dataset_id,
                            'source_id': source_id,
                            'respondent_id': respondent_id,
                            'row_index': row_index + 1,
                            'raw_name': raw_name,
                            'display_name': display_name,
                            'question_group': question_group,
                            'unit_index': unit_index,
                            'unit_text': unit_text,
                            'char_count': len(unit_text),
                            'content_hash': hashlib.sha256(unit_text.encode('utf-8')).hexdigest(),
                        }
                    )
                continue

            normalized_value = raw_value_text
            numeric_value: float | None = None
            label_text = ''
            multiselect_count = 0

            if response_type == 'multiselect':
                options = split_multiselect_value(raw_value_text, entry)
                multiselect_count = len(options)
                label_parts: list[str] = []
                for option_index, option_code in enumerate(options, start=1):
                    option_label = infer_label(option_code, entry)
                    if option_label:
                        label_parts.append(option_label)
                    multiselect_rows.append(
                        {
                            'dataset_id': dataset_id,
                            'source_id': source_id,
                            'respondent_id': respondent_id,
                            'row_index': row_index + 1,
                            'raw_name': raw_name,
                            'display_name': display_name,
                            'question_group': question_group,
                            'option_index': option_index,
                            'option_code': option_code,
                            'option_label': option_label,
                        }
                    )
                label_text = ' | '.join(label_parts)
            else:
                normalized_value = normalize_code_text(raw_value_text, entry)
                label_text = infer_label(normalized_value, entry)

                if response_type in {'numeric_scalar', 'count', 'ordinal'}:
                    try:
                        numeric_value = float(raw_value_text)
                    except ValueError:
                        numeric_value = None

            structured_rows.append(
                {
                    'dataset_id': dataset_id,
                    'source_id': source_id,
                    'respondent_id': respondent_id,
                    'row_index': row_index + 1,
                    'raw_name': raw_name,
                    'display_name': display_name,
                    'question_group': question_group,
                    'response_type': response_type,
                    'raw_value_text': raw_value_text,
                    'normalized_value': normalized_value,
                    'label_text': label_text,
                    'numeric_value': numeric_value,
                    'multiselect_count': multiselect_count if response_type == 'multiselect' else None,
                    'manual_review_required': bool(metadata.get('manual_review_required')),
                }
            )

    output_dir = ANALYSIS_READY_ROOT / lane / dataset_id / version
    output_dir.mkdir(parents=True, exist_ok=True)

    structured_path = output_dir / 'structured_features.csv'
    multiselect_path = output_dir / 'multiselect_values.csv'
    free_text_path = output_dir / 'free_text_units.jsonl'
    codebook_path = output_dir / 'codebook.csv'
    provenance_path = output_dir / 'provenance.json'
    manifest_path = output_dir / 'analysis-ready-manifest.json'

    pd.DataFrame(structured_rows).to_csv(structured_path, index=False)
    pd.DataFrame(multiselect_rows).to_csv(multiselect_path, index=False)
    pd.DataFrame(codebook_rows).to_csv(codebook_path, index=False)

    with free_text_path.open('w', encoding='utf-8') as handle:
        for row in free_text_rows:
            handle.write(json.dumps(row, ensure_ascii=False) + '\n')

    provenance = {
        'dataset_id': dataset_id,
        'source_id': source_id,
        'source_role': source_role,
        'source_file': str(workbook_path.relative_to(REPO_ROOT)),
        'data_sheet': data_sheet,
        'dictionary_sheet': dictionary_sheet,
        'response_map': str(
            (RESPONSE_MAP_ROOT / f'{dataset_id}.response-type-map.json').relative_to(REPO_ROOT)
        ),
        'generated_at': iso_now(),
        'version': version,
    }
    write_json(provenance_path, provenance)

    manifest_payload = {
        'dataset_id': dataset_id,
        'source_id': source_id,
        'stage': 'analysis_ready',
        'lane': lane,
        'version': version,
        'generated_at': provenance['generated_at'],
        'row_count': int(len(data_df)),
        'structured_feature_count': len(structured_rows),
        'multiselect_value_count': len(multiselect_rows),
        'free_text_unit_count': len(free_text_rows),
        'files': {
            'structured_features': str(structured_path.relative_to(REPO_ROOT)),
            'multiselect_values': str(multiselect_path.relative_to(REPO_ROOT)),
            'free_text_units': str(free_text_path.relative_to(REPO_ROOT)),
            'codebook': str(codebook_path.relative_to(REPO_ROOT)),
            'provenance': str(provenance_path.relative_to(REPO_ROOT)),
        },
        'cost_control_notes': [
            'No LLM calls were used for this export.',
            'Free-text was segmented locally and assigned content hashes.',
            'Structured data was normalized before any future embedding or manifold step.',
        ],
    }
    write_json(manifest_path, manifest_payload)

    return manifest_payload


def discover_workbook_manifests(dataset_ids: list[str] | None) -> list[dict[str, Any]]:
    manifests: list[dict[str, Any]] = []
    allowed = set(dataset_ids or [])

    for path in sorted(MANIFEST_ROOT.glob('*.json')):
        manifest = load_json(path)
        if manifest.get('source_type') != 'xlsx_workbook':
            continue
        if allowed and manifest.get('dataset_id') not in allowed:
            continue
        manifests.append(manifest)

    return manifests


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Build analysis-ready exports from original structured FCHMA datasets.'
    )
    parser.add_argument(
        '--dataset-id',
        action='append',
        dest='dataset_ids',
        help='Limit export to one or more dataset ids.',
    )
    parser.add_argument(
        '--version',
        default='v0',
        help='Output version folder under data/analysis_ready/<lane>/<dataset>/<version>.',
    )
    args = parser.parse_args()

    manifests = discover_workbook_manifests(args.dataset_ids)
    if not manifests:
        raise SystemExit('No workbook manifests matched the requested dataset ids.')

    summaries = []
    for manifest in manifests:
        response_map_path = RESPONSE_MAP_ROOT / f"{manifest['dataset_id']}.response-type-map.json"
        if not response_map_path.exists():
            raise FileNotFoundError(f'Missing response type map: {response_map_path}')
        response_map = load_json(response_map_path)
        summaries.append(export_dataset(manifest, response_map, args.version))

    print(json.dumps({'generated_at': iso_now(), 'datasets': summaries}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
