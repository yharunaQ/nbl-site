#!/usr/bin/env python3

from __future__ import annotations

import json
import os
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

os.environ.setdefault('OMP_NUM_THREADS', '1')
os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')
os.environ.setdefault('MKL_NUM_THREADS', '1')
os.environ.setdefault('NUMEXPR_NUM_THREADS', '1')

import numpy as np
import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
RESPONDENT_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'respondents'
OUTPUT_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'pattern_library' / 'respondents' / 'v0'
DATASETS = ['employment_survey_3000', 'nanbyo_survey_4000']
JOINT_SUBJECT_SPACE_CSV = OUTPUT_ROOT / 'respondent_joint_subject_space.csv'

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


@dataclass(frozen=True)
class SubjectKey:
    dataset_id: str
    respondent_id: str

    @property
    def id(self) -> str:
        return f'{self.dataset_id}:{self.respondent_id}'


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_output_dir() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    with path.open('r', encoding='utf-8') as handle:
        return [json.loads(line) for line in handle if line.strip()]


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def choose_k(subject_count: int) -> int:
    if subject_count < 50:
        return 3
    if subject_count < 500:
        return 5
    if subject_count < 2000:
        return 7
    if subject_count < 5000:
        return 9
    return 11


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


def build_token_matrix(
    subjects: list[SubjectKey],
    token_lookup: dict[str, list[str]],
    vocabulary: list[str],
) -> np.ndarray:
    vocab_index = {token: index for index, token in enumerate(vocabulary)}
    matrix = np.zeros((len(subjects), len(vocabulary)), dtype=float)

    for row_index, subject in enumerate(subjects):
        for token in token_lookup.get(subject.id, []):
            index = vocab_index.get(token)
            if index is not None:
                matrix[row_index, index] = 1.0

    return matrix


def choose_subcluster_count(cluster_size: int) -> int:
    if cluster_size >= 1600:
        return 4
    if cluster_size >= 900:
        return 3
    if cluster_size >= 320:
        return 2
    return 0


def choose_microcluster_count(cluster_size: int) -> int:
    if cluster_size >= 900:
        return 3
    if cluster_size >= 420:
        return 2
    return 0


def standardize_matrix(matrix: np.ndarray) -> np.ndarray:
    means = matrix.mean(axis=0)
    stds = matrix.std(axis=0)
    stds[stds == 0] = 1.0
    return (matrix - means) / stds


def reduce_with_svd(matrix: np.ndarray, n_components: int) -> np.ndarray:
    if matrix.size == 0:
        return np.zeros((matrix.shape[0], 0))
    centered = matrix - matrix.mean(axis=0, keepdims=True)
    max_components = max(1, min(n_components, centered.shape[0], centered.shape[1]))
    u, s, _ = np.linalg.svd(centered, full_matrices=False)
    return u[:, :max_components] * s[:max_components]


def run_kmeans(
    features: np.ndarray,
    n_clusters: int,
    random_seed: int = 42,
    n_init: int = 8,
    max_iter: int = 60,
) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(random_seed)
    best_labels: np.ndarray | None = None
    best_centroids: np.ndarray | None = None
    best_inertia: float | None = None

    for _ in range(n_init):
        initial_indices = rng.choice(features.shape[0], size=n_clusters, replace=False)
        centroids = features[initial_indices].copy()

        for _ in range(max_iter):
            distances = np.linalg.norm(features[:, None, :] - centroids[None, :, :], axis=2)
            labels = distances.argmin(axis=1)
            next_centroids = centroids.copy()
            for cluster_index in range(n_clusters):
                members = features[labels == cluster_index]
                if len(members) > 0:
                    next_centroids[cluster_index] = members.mean(axis=0)
            if np.allclose(next_centroids, centroids):
                centroids = next_centroids
                break
            centroids = next_centroids

        distances = np.linalg.norm(features[:, None, :] - centroids[None, :, :], axis=2)
        labels = distances.argmin(axis=1)
        inertia = float(np.sum((features - centroids[labels]) ** 2))

        if best_inertia is None or inertia < best_inertia:
            best_inertia = inertia
            best_labels = labels.copy()
            best_centroids = centroids.copy()

    if best_labels is None or best_centroids is None:
        raise RuntimeError('k-means failed to converge')

    return best_labels, best_centroids


def extract_keyword_counts(texts: list[str]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for group_key, keywords in KEYWORD_GROUPS.items():
        count = sum(1 for text in texts if any(keyword in text for keyword in keywords))
        if count > 0:
            counts[group_key] = count
    return counts


def representative_narratives(
    texts: list[dict[str, Any]],
    cluster_keyword_groups: list[str],
    limit: int = 3,
) -> list[dict[str, Any]]:
    scored: list[tuple[int, dict[str, Any]]] = []
    for row in texts:
        text = str(row.get('unit_text', '')).strip()
        if not text:
            continue
        score = 0
        for group in cluster_keyword_groups:
            for keyword in KEYWORD_GROUPS.get(group, []):
                if keyword in text:
                    score += 1
        if score == 0:
            score = min(1, len(text) // 40)
        scored.append((score, row))

    scored.sort(key=lambda item: (-item[0], len(str(item[1].get('unit_text', '')))))
    selected: list[dict[str, Any]] = []
    seen = set()
    for _, row in scored:
        key = (row.get('dataset_id'), row.get('respondent_id'), row.get('unit_text'))
        if key in seen:
            continue
        seen.add(key)
        selected.append(
            {
                'dataset_id': row.get('dataset_id'),
                'respondent_id': row.get('respondent_id'),
                'canonical_concept': row.get('canonical_concept'),
                'unit_text': row.get('unit_text'),
            }
        )
        if len(selected) >= limit:
            break

    return selected


def prevalence_table(
    projection_df: pd.DataFrame,
    subject_ids: set[str],
    global_subject_count: int,
) -> list[dict[str, Any]]:
    cluster_df = projection_df[projection_df['subject_id'].isin(subject_ids)].copy()
    rows: list[dict[str, Any]] = []

    for concept, concept_group in cluster_df.groupby('canonical_concept'):
        cluster_counts = (
            concept_group.groupby('label_text')['subject_id'].nunique().sort_values(ascending=False)
        )
        global_group = projection_df[projection_df['canonical_concept'] == concept]
        global_counts = global_group.groupby('label_text')['subject_id'].nunique()

        for label_text, count in cluster_counts.items():
            if not isinstance(label_text, str) or not label_text.strip() or label_text == 'nan':
                continue
            cluster_ratio = count / max(1, len(subject_ids))
            global_ratio = global_counts.get(label_text, 0) / max(1, global_subject_count)
            lift = cluster_ratio / global_ratio if global_ratio > 0 else 0.0
            rows.append(
                {
                    'canonical_concept': concept,
                    'label_text': label_text,
                    'cluster_subject_count': int(count),
                    'cluster_ratio': round(cluster_ratio, 4),
                    'global_ratio': round(global_ratio, 4),
                    'lift': round(lift, 3),
                }
            )

    rows.sort(
        key=lambda row: (
            -row['lift'],
            -row['cluster_ratio'],
            row['canonical_concept'],
            row['label_text'],
        )
    )
    return rows


def infer_cluster_pattern_key(
    top_keywords: list[str],
    top_labels_by_concept: dict[str, list[str]],
    pattern_index: int,
) -> str:
    if 'communication' in top_keywords:
        return f'communication_barrier_pattern_{pattern_index + 1}'
    if 'fatigue' in top_keywords or 'time_schedule' in top_keywords:
        return f'fatigue_schedule_pattern_{pattern_index + 1}'
    if 'support' in top_keywords:
        return f'accommodation_gap_pattern_{pattern_index + 1}'
    if any('未解決' in label or '必要' in label for labels in top_labels_by_concept.values() for label in labels):
        return f'unresolved_participation_pattern_{pattern_index + 1}'
    return f'respondent_manifold_pattern_{pattern_index + 1}'


def infer_causal_framework(
    top_labels_by_concept: dict[str, list[str]],
    keyword_counts: dict[str, int],
) -> dict[str, Any]:
    activity_labels = top_labels_by_concept.get('activity_and_participation_difficulty', [])
    support_labels = top_labels_by_concept.get('accommodation_and_support', [])
    future_labels = top_labels_by_concept.get('self_efficacy_and_future_outlook', [])
    work_labels = top_labels_by_concept.get('work_status', [])

    environment_gap = any(
        marker in label
        for label in support_labels
        for marker in ['必要', '未整備', '不足', '知らなかった', '整備無', '未解決']
    ) or keyword_counts.get('support', 0) > 0
    activity_burden = any(
        marker in label
        for label in activity_labels
        for marker in ['未解決', '困り', '当てはまる', '課題']
    ) or any(keyword_counts.get(key, 0) > 0 for key in ['fatigue', 'pain', 'communication', 'cognition'])
    participation_strain = any(
        marker in label
        for label in work_labels
        for marker in ['就きたい', '休職', 'していない', '非正規', '困難']
    ) or activity_burden
    personal_fragility = any(
        marker in label
        for label in future_labels
        for marker in ['全く違う', '不安', '難しい']
    ) or keyword_counts.get('emotion', 0) > 0

    chain = []
    amplifiers = []
    protectors = []
    intervention_ports = []

    if activity_burden:
        chain.append('health_condition -> activities')
        amplifiers.append('症状や体調変動が活動遂行の負荷を増幅')
        intervention_ports.append('負荷が強い場面・時間帯・コミュニケーション条件の再設計')
    if activity_burden and participation_strain:
        chain.append('activities -> participation')
        amplifiers.append('活動上の困難が就労参加の不安定さへ連結')
        intervention_ports.append('仕事内容、勤務時間、会議・通勤などの条件を再調整')
    if environment_gap:
        chain.append('environmental_factors -> participation')
        amplifiers.append('配慮不足や支援未整備が参加負荷を押し戻す')
        intervention_ports.append('必要配慮の言語化と上司・人事・支援者の調整')
    else:
        protectors.append('既存の配慮や支援が参加の安定化に寄与する余地')
    if personal_fragility:
        chain.append('personal_factors -> participation')
        amplifiers.append('不安や自己効力感の揺らぎが継続判断を弱める')
        intervention_ports.append('短期目標の再設定と悪化時の相談ルート整備')

    if not chain:
        chain.append('health_condition -> activities -> participation')
        intervention_ports.append('困難が強い場面の特定と支援仮説の再分解')

    summary = ' / '.join(chain)
    return {
        'summary': summary,
        'chain': chain,
        'amplifiers': amplifiers,
        'protectors': protectors,
        'intervention_ports': list(dict.fromkeys(intervention_ports)),
    }


def build_pattern_entry(
    *,
    cluster_subject_ids: set[str],
    cluster_id: str,
    pattern_level: str,
    pattern_index: int,
    projection_df: pd.DataFrame,
    narratives_by_subject: dict[str, list[dict[str, Any]]],
    global_subject_count: int,
) -> dict[str, Any]:
    cluster_narratives = [
        row
        for subject_id in cluster_subject_ids
        for row in narratives_by_subject.get(subject_id, [])
    ]

    prevalence_rows = prevalence_table(projection_df, cluster_subject_ids, global_subject_count)
    top_labels_by_concept: dict[str, list[str]] = {}
    for row in prevalence_rows:
        concept = str(row['canonical_concept'])
        if concept not in top_labels_by_concept:
            top_labels_by_concept[concept] = []
        if len(top_labels_by_concept[concept]) < 3:
            top_labels_by_concept[concept].append(str(row['label_text']))

    narrative_texts = [
        str(row.get('unit_text', '')).strip()
        for row in cluster_narratives
        if str(row.get('unit_text', '')).strip()
    ]
    keyword_counts = extract_keyword_counts(narrative_texts)
    top_keyword_groups = [
        key for key, _ in sorted(keyword_counts.items(), key=lambda item: (-item[1], item[0]))[:4]
    ]
    causal_framework = infer_causal_framework(top_labels_by_concept, keyword_counts)

    dataset_mix = (
        pd.Series([subject_id.split(':', 1)[0] for subject_id in cluster_subject_ids]).value_counts().to_dict()
    )
    pattern_key = infer_cluster_pattern_key(top_keyword_groups, top_labels_by_concept, pattern_index)

    return {
        'pattern_key': pattern_key,
        'cluster_id': cluster_id,
        'pattern_level': pattern_level,
        'cluster_subject_count': len(cluster_subject_ids),
        'dataset_mix': dataset_mix,
        'dominant_keyword_groups': top_keyword_groups,
        'keyword_counts': keyword_counts,
        'top_labels_by_concept': top_labels_by_concept,
        'causal_framework': causal_framework,
        'representative_narratives': representative_narratives(cluster_narratives, top_keyword_groups),
        'prevalence_rows': prevalence_rows[:18],
        'notes': [
            'Derived locally from the joint subject-level respondent space and narrative projection candidates.',
            'This is a reviewed pattern seed, not a final causal truth.',
            'Use as a structural knowledge core candidate for next-JAC reasoning and counter-hypothesis generation.',
        ],
    }


def main() -> None:
    ensure_output_dir()

    projection_frames: list[pd.DataFrame] = []
    narrative_rows: list[dict[str, Any]] = []
    if not JOINT_SUBJECT_SPACE_CSV.exists():
        raise FileNotFoundError(
            'joint subject space is missing. Run build_respondent_joint_subject_space.py first.'
        )

    joint_subject_df = pd.read_csv(JOINT_SUBJECT_SPACE_CSV, low_memory=False)

    for dataset_id in DATASETS:
        dataset_dir = RESPONDENT_ROOT / dataset_id / 'v0'

        projection_df = pd.read_csv(dataset_dir / 'canonical_projection_candidates.csv', low_memory=False)
        projection_df['subject_id'] = projection_df['dataset_id'].astype(str) + ':' + projection_df['respondent_id'].astype(str)
        projection_frames.append(projection_df)

        for row in read_jsonl(dataset_dir / 'narrative_projection_candidates.jsonl'):
            row['subject_id'] = f"{row['dataset_id']}:{row['respondent_id']}"
            narrative_rows.append(row)
    projection_df = pd.concat(projection_frames, ignore_index=True)

    subjects = [
        SubjectKey(dataset_id=str(row['dataset_id']), respondent_id=str(row['respondent_id']))
        for _, row in joint_subject_df[['dataset_id', 'respondent_id']].drop_duplicates().iterrows()
    ]

    joint_feature_columns = [
        column
        for column in joint_subject_df.columns
        if column not in {'dataset_id', 'respondent_id', 'subject_id'}
    ]
    joint_matrix = (
        joint_subject_df[joint_feature_columns]
        .apply(pd.to_numeric, errors='coerce')
        .fillna(0.0)
        .to_numpy(dtype=float)
    )
    joint_scaled = standardize_matrix(joint_matrix)

    embedding_dim = min(12, joint_scaled.shape[1], joint_scaled.shape[0])
    if embedding_dim >= 2:
        embedding = reduce_with_svd(joint_scaled, embedding_dim)
    else:
        embedding = joint_scaled

    cluster_count = choose_k(len(subjects))
    clusters, _ = run_kmeans(embedding, n_clusters=cluster_count, random_seed=42, n_init=10, max_iter=80)

    assignment_rows: list[dict[str, Any]] = []
    subject_cluster_lookup: dict[str, int] = {}
    for subject, cluster_label, coords in zip(subjects, clusters, embedding):
        subject_cluster_lookup[subject.id] = int(cluster_label)
        assignment_rows.append(
            {
                'subject_id': subject.id,
                'dataset_id': subject.dataset_id,
                'respondent_id': subject.respondent_id,
                'cluster_id': f'cluster_{int(cluster_label) + 1}',
                'embedding_x': round(float(coords[0]), 6) if len(coords) > 0 else 0.0,
                'embedding_y': round(float(coords[1]), 6) if len(coords) > 1 else 0.0,
            }
        )

    global_subject_count = len(subjects)
    narratives_by_subject: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in narrative_rows:
        narratives_by_subject[str(row['subject_id'])].append(row)

    pattern_entries: list[dict[str, Any]] = []
    subject_ids = [subject.id for subject in subjects]
    subject_index_lookup = {subject_id: index for index, subject_id in enumerate(subject_ids)}

    for cluster_label in sorted(set(clusters)):
        cluster_subject_ids = {
            subject.id for subject, assigned in zip(subjects, clusters) if int(assigned) == int(cluster_label)
        }
        parent_cluster_id = f'cluster_{int(cluster_label) + 1}'
        parent_entry = build_pattern_entry(
            cluster_subject_ids=cluster_subject_ids,
            cluster_id=parent_cluster_id,
            pattern_level='global',
            pattern_index=len(pattern_entries),
            projection_df=projection_df,
            narratives_by_subject=narratives_by_subject,
            global_subject_count=global_subject_count,
        )
        pattern_entries.append(parent_entry)

        subcluster_count = choose_subcluster_count(len(cluster_subject_ids))
        if subcluster_count < 2:
            continue

        subset_subject_ids = sorted(cluster_subject_ids)
        subset_indices = [subject_index_lookup[subject_id] for subject_id in subset_subject_ids]
        subset_features = embedding[subset_indices]
        sub_labels, _ = run_kmeans(
            subset_features,
            n_clusters=subcluster_count,
            random_seed=42 + int(cluster_label),
            n_init=8,
            max_iter=60,
        )

        for sub_label in sorted(set(sub_labels)):
            subcluster_subject_ids = {
                subject_id
                for subject_id, assigned in zip(subset_subject_ids, sub_labels)
                if int(assigned) == int(sub_label)
            }
            if len(subcluster_subject_ids) < 90:
                continue

            local_cluster_id = f'{parent_cluster_id}_sub_{int(sub_label) + 1}'
            pattern_entries.append(
                build_pattern_entry(
                    cluster_subject_ids=subcluster_subject_ids,
                    cluster_id=local_cluster_id,
                    pattern_level='local',
                    pattern_index=len(pattern_entries),
                    projection_df=projection_df,
                    narratives_by_subject=narratives_by_subject,
                    global_subject_count=global_subject_count,
                )
            )

            microcluster_count = choose_microcluster_count(len(subcluster_subject_ids))
            if microcluster_count < 2:
                continue

            local_subject_ids = sorted(subcluster_subject_ids)
            local_indices = [subject_index_lookup[subject_id] for subject_id in local_subject_ids]
            local_features = embedding[local_indices]
            micro_labels, _ = run_kmeans(
                local_features,
                n_clusters=microcluster_count,
                random_seed=420 + int(cluster_label) * 10 + int(sub_label),
                n_init=6,
                max_iter=50,
            )

            for micro_label in sorted(set(micro_labels)):
                micro_subject_ids = {
                    subject_id
                    for subject_id, assigned in zip(local_subject_ids, micro_labels)
                    if int(assigned) == int(micro_label)
                }
                if len(micro_subject_ids) < 70:
                    continue
                pattern_entries.append(
                    build_pattern_entry(
                        cluster_subject_ids=micro_subject_ids,
                        cluster_id=f'{local_cluster_id}_micro_{int(micro_label) + 1}',
                        pattern_level='micro',
                        pattern_index=len(pattern_entries),
                        projection_df=projection_df,
                        narratives_by_subject=narratives_by_subject,
                        global_subject_count=global_subject_count,
                    )
                )

    summary = {
        'generated_at': iso_now(),
        'subject_count': global_subject_count,
        'cluster_count': cluster_count,
        'pattern_count': len(pattern_entries),
        'datasets': DATASETS,
        'joint_feature_count': len(joint_feature_columns),
        'pattern_levels': sorted({entry['pattern_level'] for entry in pattern_entries}),
    }

    pd.DataFrame(assignment_rows).to_csv(OUTPUT_ROOT / 'respondent_manifold_assignments.csv', index=False)
    write_json(OUTPUT_ROOT / 'respondent_manifold_patterns.json', {'summary': summary, 'patterns': pattern_entries})
    write_json(
        OUTPUT_ROOT / 'respondent_manifold_summary.json',
        {
            **summary,
            'pattern_keys': [entry['pattern_key'] for entry in pattern_entries],
        },
    )

    print(json.dumps({'summary': summary, 'output_root': str(OUTPUT_ROOT.relative_to(REPO_ROOT))}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
