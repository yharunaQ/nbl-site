#!/usr/bin/env python3

from __future__ import annotations

import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
RESPONDENT_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'respondents'
OUTPUT_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'pattern_library' / 'respondents' / 'v0'
DATASETS = ['employment_survey_3000', 'nanbyo_survey_4000']

KEYWORD_GROUPS = {
    'fatigue': ['疲', '疲労', 'だる', '倦怠', 'しんど'],
    'pain': ['痛', '疼'],
    'communication': ['聞き', '聞こ', '話', '会話', 'コミュニケーション', '説明', '伝え'],
    'cognition': ['集中', '理解', '注意', '忘', '頭', '眠'],
    'time_schedule': ['時間', '勤務', 'シフト', '休憩', '残業', '会議', '午後', '朝'],
    'mobility': ['通勤', '移動', '歩', '立', '階段'],
    'emotion': ['不安', 'ストレス', '落ち込', '迷', '心配'],
    'support': ['配慮', '支援', '上司', '人事', '相談', '調整', 'ジョブコーチ'],
}


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    with path.open('r', encoding='utf-8') as handle:
        return [json.loads(line) for line in handle if line.strip()]


def select_token_vocabulary(token_rows: list[dict[str, Any]]) -> list[str]:
    df_counter: Counter[str] = Counter()
    for row in token_rows:
        for token in set(row.get('tokens', [])):
            df_counter[token] += 1

    subject_count = max(1, len(token_rows))
    min_df = max(8, int(subject_count * 0.015))
    max_df = int(subject_count * 0.75)
    selected = [
        token
        for token, count in df_counter.most_common()
        if count >= min_df and count <= max_df
    ]
    return selected[:240]


def keyword_counts_for_text(text: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for group_key, keywords in KEYWORD_GROUPS.items():
        if any(keyword in text for keyword in keywords):
            counts[group_key] = 1
    return counts


def main() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

    numeric_frames: list[pd.DataFrame] = []
    token_rows: list[dict[str, Any]] = []
    narrative_rows: list[dict[str, Any]] = []

    for dataset_id in DATASETS:
        dataset_dir = RESPONDENT_ROOT / dataset_id / 'v0'
        numeric_df = pd.read_csv(dataset_dir / 'manifold_numeric_features.csv', low_memory=False)
        numeric_df['subject_id'] = numeric_df['dataset_id'].astype(str) + ':' + numeric_df['respondent_id'].astype(str)
        numeric_frames.append(numeric_df)

        for row in read_jsonl(dataset_dir / 'manifold_sparse_tokens.jsonl'):
            row['subject_id'] = f"{row['dataset_id']}:{row['respondent_id']}"
            token_rows.append(row)

        for row in read_jsonl(dataset_dir / 'narrative_projection_candidates.jsonl'):
            row['subject_id'] = f"{row['dataset_id']}:{row['respondent_id']}"
            narrative_rows.append(row)

    numeric_df = pd.concat(numeric_frames, ignore_index=True).fillna(0)
    numeric_feature_columns = [
        column
        for column in numeric_df.columns
        if column not in {'dataset_id', 'respondent_id', 'subject_id'}
    ]

    token_vocabulary = select_token_vocabulary(token_rows)
    token_lookup = {str(row['subject_id']): set(row.get('tokens', [])) for row in token_rows}

    narrative_keyword_lookup: dict[str, Counter[str]] = defaultdict(Counter)
    narrative_count_lookup: Counter[str] = Counter()
    for row in narrative_rows:
        subject_id = str(row['subject_id'])
        text = str(row.get('unit_text', '')).strip()
        if not text:
            continue
        narrative_count_lookup[subject_id] += 1
        for key, value in keyword_counts_for_text(text).items():
            narrative_keyword_lookup[subject_id][key] += value

    joint_rows: list[dict[str, Any]] = []
    for _, row in numeric_df.iterrows():
        subject_id = str(row['subject_id'])
        joint_row: dict[str, Any] = {
            'subject_id': subject_id,
            'dataset_id': str(row['dataset_id']),
            'respondent_id': str(row['respondent_id']),
            'narrative_unit_count_joint': int(narrative_count_lookup.get(subject_id, 0)),
        }

        for column in numeric_feature_columns:
            joint_row[column] = row[column]

        active_tokens = token_lookup.get(subject_id, set())
        for token in token_vocabulary:
            joint_row[f'token__{token}'] = 1 if token in active_tokens else 0

        keyword_counter = narrative_keyword_lookup.get(subject_id, Counter())
        for keyword_group in KEYWORD_GROUPS:
            joint_row[f'narrative_keyword__{keyword_group}'] = int(keyword_counter.get(keyword_group, 0))

        joint_rows.append(joint_row)

    joint_df = pd.DataFrame(joint_rows)
    output_csv = OUTPUT_ROOT / 'respondent_joint_subject_space.csv'
    output_manifest = OUTPUT_ROOT / 'respondent_joint_subject_space_manifest.json'
    joint_df.to_csv(output_csv, index=False)

    manifest = {
        'generated_at': iso_now(),
        'subject_count': int(len(joint_df)),
        'datasets': DATASETS,
        'numeric_feature_count': len(numeric_feature_columns),
        'token_feature_count': len(token_vocabulary),
        'narrative_keyword_feature_count': len(KEYWORD_GROUPS),
        'output': str(output_csv.relative_to(REPO_ROOT)),
        'notes': [
            'This is the joint subject-level representation that should sit underneath true manifold analysis.',
            'It combines structured numeric features, sparse projection tokens, and narrative keyword evidence.',
            'Use this as the input layer for neighborhood graph construction and multiscale local pattern extraction.',
        ],
    }
    output_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
