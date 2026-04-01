#!/usr/bin/env python3

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'respondents'


@dataclass(frozen=True)
class DatasetConfig:
    dataset_id: str
    version: str
    label: str


CANONICAL_ORDER = [
    'respondent_profile',
    'health_condition',
    'work_status',
    'activity_and_participation_difficulty',
    'accommodation_and_support',
    'disclosure_and_explanation',
    'self_efficacy_and_future_outlook',
]

CANONICAL_TO_PAYLOAD_FIELD = {
    'respondent_profile': 'respondentProfile',
    'health_condition': 'healthCondition',
    'work_status': 'workStatus',
    'activity_and_participation_difficulty': 'difficulty',
    'accommodation_and_support': 'supportAndAccommodation',
    'disclosure_and_explanation': 'disclosure',
    'self_efficacy_and_future_outlook': 'futureOutlook',
}


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding='utf-8'))


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    with path.open('r', encoding='utf-8') as handle:
        return [json.loads(line) for line in handle if line.strip()]


def clean_text(value: Any) -> str:
    if value is None:
        return ''
    if isinstance(value, float) and pd.isna(value):
        return ''
    return str(value).strip()


def unique_preserving_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        normalized = item.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)
    return result


def render_projection_line(row: dict[str, Any]) -> str:
    label = clean_text(row.get('label_text')) or clean_text(row.get('normalized_value'))
    display_name = clean_text(row.get('display_name')) or clean_text(row.get('raw_name'))
    if label and display_name:
        return f'{display_name}: {label}'
    return label or display_name


def build_primary_goal(section_texts: dict[str, str], dataset_label: str) -> str:
    goal_parts: list[str] = []
    if section_texts.get('difficulty'):
        goal_parts.append('活動・参加上の困難の構造確認')
    if section_texts.get('supportAndAccommodation'):
        goal_parts.append('必要な配慮・支援の再設計')
    if section_texts.get('workStatus'):
        goal_parts.append('就労状況と負荷条件の再確認')
    if section_texts.get('futureOutlook'):
        goal_parts.append('今後の希望と実行可能性の整理')

    if goal_parts:
        return ' / '.join(goal_parts)

    return f'{dataset_label}由来ケースの構造把握'


def trim_text(text: str, max_length: int) -> str:
    if len(text) <= max_length:
        return text
    return text[: max_length - 1].rstrip() + '…'


def looks_code_like(text: str) -> bool:
    normalized = text.strip()
    if not normalized:
        return False
    allowed = set('0123456789+-| ')
    return all(character in allowed for character in normalized)


def build_payload_record(
    dataset_id: str,
    dataset_label: str,
    batch_key: str,
    subject_key: str,
    projection_rows: list[dict[str, Any]],
    narrative_rows: list[dict[str, Any]],
) -> dict[str, Any]:
    section_texts = {
        'respondentProfile': '',
        'healthCondition': '',
        'workStatus': '',
        'difficulty': '',
        'supportAndAccommodation': '',
        'disclosure': '',
        'futureOutlook': '',
    }

    grouped_rows: dict[str, list[dict[str, Any]]] = {concept: [] for concept in CANONICAL_ORDER}
    for row in projection_rows:
        canonical = clean_text(row.get('canonical_concept'))
        if canonical in grouped_rows:
            grouped_rows[canonical].append(row)

    health_labels = unique_preserving_order(
        [
            clean_text(row.get('label_text')) or clean_text(row.get('normalized_value'))
            for row in grouped_rows['health_condition']
        ]
    )

    for canonical_key, payload_field in CANONICAL_TO_PAYLOAD_FIELD.items():
        rendered_lines = unique_preserving_order(
            [render_projection_line(row) for row in grouped_rows[canonical_key]]
        )
        section_texts[payload_field] = '\n'.join(rendered_lines[:12])

    narrative_lines = unique_preserving_order(
        [
            trim_text(
                f'{clean_text(row.get("display_name")) or clean_text(row.get("raw_name"))}: {clean_text(row.get("unit_text"))}',
                180,
            )
            for row in sorted(
                narrative_rows,
                key=lambda item: (
                    int(float(item.get('row_index', 0))),
                    int(float(item.get('unit_index', 0))),
                ),
            )
        ]
    )
    narratives = '\n'.join(narrative_lines[:24])

    health_head = health_labels[0] if health_labels else ''
    readable_health_head = '' if looks_code_like(health_head) else health_head
    title = (
        trim_text(f'{dataset_label} {subject_key} - {readable_health_head}', 80)
        if readable_health_head
        else trim_text(f'{dataset_label} {subject_key}', 80)
    )
    primary_goal = build_primary_goal(section_texts, dataset_label)

    payload = {
        'title': title,
        'primaryGoal': primary_goal,
        'respondentProfile': section_texts['respondentProfile']
        or f'{dataset_label} の respondent {subject_key}',
        'healthCondition': '、'.join(health_labels[:8]) or section_texts['healthCondition'],
        'workStatus': section_texts['workStatus'],
        'difficulty': section_texts['difficulty'],
        'supportAndAccommodation': section_texts['supportAndAccommodation'],
        'disclosure': section_texts['disclosure'],
        'futureOutlook': section_texts['futureOutlook'],
        'narratives': narratives,
        'inputType': 'survey_import',
        'importContext': {
            'datasetId': dataset_id,
            'subjectKey': subject_key,
            'batchKey': batch_key,
            'lane': 'respondents',
        },
    }

    return {
        'datasetId': dataset_id,
        'datasetLabel': dataset_label,
        'subjectKey': subject_key,
        'payload': payload,
        'summary': {
            'healthConditionHead': readable_health_head,
            'difficultyLineCount': len(
                [line for line in section_texts['difficulty'].split('\n') if line.strip()]
            ),
            'narrativeUnitCount': len(narrative_lines),
        },
    }


def build_dataset_pack(config: DatasetConfig) -> dict[str, Any]:
    dataset_dir = ANALYSIS_READY_ROOT / config.dataset_id / config.version
    output_dir = dataset_dir / 'case_materialization'
    output_dir.mkdir(parents=True, exist_ok=True)

    projection_df = pd.read_csv(dataset_dir / 'canonical_projection_candidates.csv', low_memory=False)
    narrative_rows = load_jsonl(dataset_dir / 'free_text_units.jsonl')
    ingestion_manifest = load_json(
        dataset_dir / 'postgres_ingestion' / 'postgres_ingestion_manifest.json'
    )

    projection_by_subject: dict[str, list[dict[str, Any]]] = {}
    for row in projection_df.to_dict(orient='records'):
        projection_by_subject.setdefault(clean_text(row.get('respondent_id')), []).append(row)

    narrative_by_subject: dict[str, list[dict[str, Any]]] = {}
    for row in narrative_rows:
        narrative_by_subject.setdefault(clean_text(row.get('respondent_id')), []).append(row)

    payload_rows: list[dict[str, Any]] = []
    for subject_key in sorted(projection_by_subject.keys()):
        if not subject_key:
            continue
        payload_rows.append(
            build_payload_record(
                dataset_id=config.dataset_id,
                dataset_label=config.label,
                batch_key=ingestion_manifest['batch_key'],
                subject_key=subject_key,
                projection_rows=projection_by_subject.get(subject_key, []),
                narrative_rows=narrative_by_subject.get(subject_key, []),
            )
        )

    with (output_dir / 'case_materialization_payloads.jsonl').open('w', encoding='utf-8') as handle:
        for row in payload_rows:
            handle.write(json.dumps(row, ensure_ascii=False) + '\n')

    index_payload = {
        'generated_at': iso_now(),
        'datasetId': config.dataset_id,
        'datasetLabel': config.label,
        'version': config.version,
        'batchKey': ingestion_manifest['batch_key'],
        'subjectCount': len(payload_rows),
        'sampleSubjects': [
            {
                'subjectKey': row['subjectKey'],
                'title': row['payload']['title'],
                'healthConditionHead': row['summary']['healthConditionHead'],
                'narrativeUnitCount': row['summary']['narrativeUnitCount'],
            }
            for row in payload_rows[:24]
        ],
        'outputs': {
            'payloads': str(
                (output_dir / 'case_materialization_payloads.jsonl').relative_to(REPO_ROOT)
            ),
        },
        'notes': [
            'Deterministic survey-import pack for the /cases runtime lane.',
            'Uses projection candidates and narrative units only. No LLM involved.',
        ],
    }
    (output_dir / 'case_materialization_index.json').write_text(
        json.dumps(index_payload, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )

    return index_payload


def main() -> None:
    configs = [
        DatasetConfig(
            dataset_id='employment_survey_3000',
            version='v0',
            label='障害・疾病 就労調査',
        ),
        DatasetConfig(
            dataset_id='nanbyo_survey_4000',
            version='v0',
            label='難病患者調査',
        ),
    ]

    indexes = [build_dataset_pack(config) for config in configs]
    print(json.dumps({'generated_at': iso_now(), 'indexes': indexes}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
