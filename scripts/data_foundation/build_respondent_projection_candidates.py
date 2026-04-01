#!/usr/bin/env python3

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'respondents'
CANONICAL_MAP_PATH = (
    REPO_ROOT / 'data' / 'specs' / 'canonical-maps' / 'respondent-canonical-concept-map-v0.json'
)


RESPONDENT_DATASETS = ['employment_survey_3000', 'nanbyo_survey_4000']


ICF_FRAME_BY_CONCEPT = {
    'respondent_profile': 'personal_factors',
    'health_condition': 'health_condition',
    'work_status': 'participation',
    'activity_and_participation_difficulty': 'activities',
    'accommodation_and_support': 'environmental_factors',
    'disclosure_and_explanation': 'environmental_factors',
    'self_efficacy_and_future_outlook': 'personal_factors',
    'narrative_units': 'narrative_units',
}


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding='utf-8'))


def matches_pattern(raw_name: str, pattern: str) -> bool:
    if pattern.endswith('*'):
        return raw_name.startswith(pattern[:-1])
    return raw_name == pattern


def build_pattern_lookup(canonical_map: dict[str, Any]) -> dict[str, list[tuple[str, str]]]:
    lookup: dict[str, list[tuple[str, str]]] = {}
    for concept in canonical_map.get('canonical_concepts', []):
        concept_id = concept['concept_id']
        for dataset_id, patterns in concept.get('source_fields', {}).items():
            lookup.setdefault(dataset_id, [])
            for pattern in patterns:
                lookup[dataset_id].append((pattern, concept_id))
    return lookup


def infer_secondary_frame(raw_name: str, canonical_concept: str) -> str:
    if canonical_concept == 'work_status':
        if '仕事内容' in raw_name or raw_name.endswith('_2'):
            return 'work_design'
        return 'participation'

    if canonical_concept == 'accommodation_and_support':
        if raw_name.startswith('5') or raw_name.startswith('6') or raw_name.startswith('Q15'):
            return 'support_resources'
        if raw_name.startswith('10'):
            return 'environmental_factors'
        return 'support_resources'

    if canonical_concept == 'activity_and_participation_difficulty':
        if raw_name.startswith('11') or raw_name.startswith('Q16'):
            return 'participation'
        return 'activities'

    return ''


def infer_projection_confidence(raw_name: str, matched_pattern: str) -> str:
    if matched_pattern == raw_name:
        return 'high'
    return 'medium'


def project_structured_features(dataset_id: str, pattern_lookup: dict[str, list[tuple[str, str]]]) -> dict[str, Any]:
    dataset_dir = ANALYSIS_READY_ROOT / dataset_id / 'v0'
    structured_path = dataset_dir / 'structured_features.csv'
    free_text_path = dataset_dir / 'free_text_units.jsonl'
    if not structured_path.exists():
        raise FileNotFoundError(f'Missing analysis-ready structured file: {structured_path}')

    structured_df = pd.read_csv(structured_path, low_memory=False)
    patterns = pattern_lookup.get(dataset_id, [])
    projection_rows: list[dict[str, Any]] = []
    narrative_projection_rows: list[dict[str, Any]] = []

    for _, row in structured_df.iterrows():
        raw_name = str(row['raw_name'])
        matched_pattern = None
        matched_concept = None

        for pattern, concept_id in patterns:
            if matches_pattern(raw_name, pattern):
                matched_pattern = pattern
                matched_concept = concept_id
                break

        if not matched_concept:
            continue

        primary_frame = ICF_FRAME_BY_CONCEPT.get(matched_concept, 'unassigned')
        secondary_frame = infer_secondary_frame(raw_name, matched_concept)

        projection_rows.append(
            {
                'dataset_id': dataset_id,
                'respondent_id': row['respondent_id'],
                'row_index': row['row_index'],
                'raw_name': raw_name,
                'display_name': row['display_name'],
                'question_group': row['question_group'],
                'response_type': row['response_type'],
                'canonical_concept': matched_concept,
                'matched_pattern': matched_pattern,
                'primary_frame': primary_frame,
                'secondary_frame': secondary_frame,
                'projection_confidence': infer_projection_confidence(raw_name, matched_pattern),
                'projection_rationale': f'{matched_pattern} matched canonical concept {matched_concept}.',
                'normalized_value': row['normalized_value'],
                'label_text': row['label_text'],
            }
            )

    output_path = dataset_dir / 'canonical_projection_candidates.csv'
    pd.DataFrame(projection_rows).to_csv(output_path, index=False)

    if free_text_path.exists():
        with free_text_path.open('r', encoding='utf-8') as handle:
            for line in handle:
                row = json.loads(line)
                raw_name = str(row['raw_name'])
                matched_pattern = None
                matched_concept = None
                for pattern, concept_id in patterns:
                    if matches_pattern(raw_name, pattern):
                        matched_pattern = pattern
                        matched_concept = concept_id
                        break

                if not matched_concept:
                    continue

                primary_frame = ICF_FRAME_BY_CONCEPT.get(matched_concept, 'narrative_units')
                narrative_projection_rows.append(
                    {
                        'dataset_id': dataset_id,
                        'respondent_id': row['respondent_id'],
                        'row_index': row['row_index'],
                        'raw_name': raw_name,
                        'display_name': row['display_name'],
                        'question_group': row['question_group'],
                        'unit_index': row['unit_index'],
                        'canonical_concept': matched_concept,
                        'matched_pattern': matched_pattern,
                        'primary_frame': primary_frame,
                        'projection_confidence': infer_projection_confidence(raw_name, matched_pattern),
                        'projection_rationale': f'{matched_pattern} matched narrative concept {matched_concept}.',
                        'unit_text': row['unit_text'],
                        'content_hash': row['content_hash'],
                    }
                )

    narrative_output_path = dataset_dir / 'narrative_projection_candidates.jsonl'
    with narrative_output_path.open('w', encoding='utf-8') as handle:
        for row in narrative_projection_rows:
            handle.write(json.dumps(row, ensure_ascii=False) + '\n')

    manifest = {
        'dataset_id': dataset_id,
        'generated_at': iso_now(),
        'input': str(structured_path.relative_to(REPO_ROOT)),
        'output': str(output_path.relative_to(REPO_ROOT)),
        'projection_row_count': len(projection_rows),
        'narrative_input': str(free_text_path.relative_to(REPO_ROOT)),
        'narrative_output': str(narrative_output_path.relative_to(REPO_ROOT)),
        'narrative_projection_row_count': len(narrative_projection_rows),
        'covered_concepts': sorted({row['canonical_concept'] for row in projection_rows}),
        'notes': [
            'This is a deterministic projection seed, not a final ICF judgment.',
            'ICD normalization is still a later layer for health-condition-specific fields.',
        ],
    }
    (dataset_dir / 'canonical_projection_manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    return manifest


def main() -> None:
    canonical_map = load_json(CANONICAL_MAP_PATH)
    pattern_lookup = build_pattern_lookup(canonical_map)
    manifests = [project_structured_features(dataset_id, pattern_lookup) for dataset_id in RESPONDENT_DATASETS]
    print(json.dumps({'generated_at': iso_now(), 'datasets': manifests}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
