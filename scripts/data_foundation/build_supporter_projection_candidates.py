#!/usr/bin/env python3

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'supporters'
SCHEMA_PATH = (
    REPO_ROOT / 'data' / 'specs' / 'supporter-patterns' / 'supporter-behavioral-driver-schema-v0.json'
)

SUPPORTER_DATASETS = ['supporter_practice_nanbyo', 'supporter_practice_toku18']


DIMENSION_KEYWORDS = {
    'actor_context': ['所属', '機関', '所在地', '都道府県', '職種', '資格', '専門分野'],
    'client_exposure': ['対象者', '患者', '関わる機会', '対象者数', '相談・支援対象者数', '支援対象者像'],
    'support_orientation': ['全人的', '生活場面', '環境改善', '就労継続', '支援内容別', '支援'],
    'support_beliefs': ['重要', '必要', '認識', '考え', '捉え方'],
    'support_knowledge_and_access': ['知識', '情報', '研修', '事例', 'アクセス', '情報源'],
    'network_and_coordination': ['連携', 'ネットワーク', '紹介', '相談先', 'コーディネーター', '協力'],
    'organizational_and_regional_climate': ['組織', '地域', '周知', '位置付け', '積極', '消極'],
    'motivation_and_meaning': ['やりがい', '意味', '報酬', '負担', '意欲', '実施したい'],
    'implementation_constraints': ['時間', '権限', '資源', '制約', '不足', '困難', '難しい'],
}


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def infer_support_model(raw_name: str, display_name: str, question_group: str) -> str:
    combined = ' '.join([raw_name, display_name, question_group])
    if raw_name.startswith('問5') or '支援内容別の経験' in question_group:
        return 'support_action_model'
    if any(keyword in combined for keyword in ['連携', 'ネットワーク', '位置付け', '周知', 'やりがい', '負担', '知識']):
        return 'support_implementation_model'
    if '支援対象者像' in question_group or '関わる機会' in question_group:
        return 'support_action_model'
    return 'support_implementation_model'


def infer_dimension(raw_name: str, display_name: str, question_group: str) -> tuple[str, str]:
    combined = ' '.join([raw_name, display_name, question_group])
    for dimension, keywords in DIMENSION_KEYWORDS.items():
        if any(keyword in combined for keyword in keywords):
            return dimension, 'high'

    if '回答者の属性' in question_group:
        return 'actor_context', 'medium'
    if '支援対象者像' in question_group or '関わる機会' in question_group:
        return 'client_exposure', 'medium'
    if 'ケースマネジメント' in question_group or '支援内容別の経験' in question_group:
        return 'support_orientation', 'medium'

    return 'support_orientation', 'low'


def project_supporter_dataset(dataset_id: str) -> dict[str, Any]:
    dataset_dir = ANALYSIS_READY_ROOT / dataset_id / 'v0'
    structured_path = dataset_dir / 'structured_features.csv'
    free_text_path = dataset_dir / 'free_text_units.jsonl'
    if not structured_path.exists():
        raise FileNotFoundError(f'Missing analysis-ready structured file: {structured_path}')

    structured_df = pd.read_csv(structured_path, low_memory=False)
    projection_rows: list[dict[str, Any]] = []
    narrative_rows: list[dict[str, Any]] = []

    for _, row in structured_df.iterrows():
        raw_name = str(row['raw_name'])
        display_name = str(row['display_name'])
        question_group = str(row['question_group'])
        dimension, confidence = infer_dimension(raw_name, display_name, question_group)
        support_model = infer_support_model(raw_name, display_name, question_group)
        projection_rows.append(
            {
                'dataset_id': dataset_id,
                'respondent_id': row['respondent_id'],
                'row_index': row['row_index'],
                'raw_name': raw_name,
                'display_name': display_name,
                'question_group': question_group,
                'response_type': row['response_type'],
                'support_model': support_model,
                'canonical_dimension': dimension,
                'projection_confidence': confidence,
                'projection_rationale': f'{dimension} inferred from display_name/question_group keywords.',
                'normalized_value': row['normalized_value'],
                'label_text': row['label_text'],
            }
        )

    if free_text_path.exists():
        with free_text_path.open('r', encoding='utf-8') as handle:
            for line in handle:
                row = json.loads(line)
                raw_name = str(row['raw_name'])
                display_name = str(row['display_name'])
                question_group = str(row['question_group'])
                dimension, confidence = infer_dimension(raw_name, display_name, question_group)
                support_model = infer_support_model(raw_name, display_name, question_group)
                narrative_rows.append(
                    {
                        'dataset_id': dataset_id,
                        'respondent_id': row['respondent_id'],
                        'row_index': row['row_index'],
                        'raw_name': raw_name,
                        'display_name': display_name,
                        'question_group': question_group,
                        'unit_index': row['unit_index'],
                        'support_model': support_model,
                        'canonical_dimension': dimension,
                        'projection_confidence': confidence,
                        'projection_rationale': f'{dimension} inferred from narrative field context.',
                        'unit_text': row['unit_text'],
                        'content_hash': row['content_hash'],
                    }
                )

    output_path = dataset_dir / 'supporter_projection_candidates.csv'
    pd.DataFrame(projection_rows).to_csv(output_path, index=False)

    narrative_output_path = dataset_dir / 'supporter_narrative_projection_candidates.jsonl'
    with narrative_output_path.open('w', encoding='utf-8') as handle:
        for row in narrative_rows:
            handle.write(json.dumps(row, ensure_ascii=False) + '\n')

    manifest = {
        'dataset_id': dataset_id,
        'generated_at': iso_now(),
        'input': str(structured_path.relative_to(REPO_ROOT)),
        'output': str(output_path.relative_to(REPO_ROOT)),
        'projection_row_count': len(projection_rows),
        'narrative_input': str(free_text_path.relative_to(REPO_ROOT)),
        'narrative_output': str(narrative_output_path.relative_to(REPO_ROOT)),
        'narrative_projection_row_count': len(narrative_rows),
        'covered_dimensions': sorted({row['canonical_dimension'] for row in projection_rows}),
        'covered_models': sorted({row['support_model'] for row in projection_rows}),
        'notes': [
            'This is a deterministic supporter-side seed, not a final practice judgment.',
            'The supporter schema remains separate from respondent-side case truth.',
        ],
    }
    (dataset_dir / 'supporter_projection_manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    return manifest


def main() -> None:
    _ = json.loads(SCHEMA_PATH.read_text(encoding='utf-8'))
    manifests = [project_supporter_dataset(dataset_id) for dataset_id in SUPPORTER_DATASETS]
    print(json.dumps({'generated_at': iso_now(), 'datasets': manifests}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
