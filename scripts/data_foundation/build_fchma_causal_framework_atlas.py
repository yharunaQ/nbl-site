#!/usr/bin/env python3

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_PATH = (
    REPO_ROOT / 'data' / 'specs' / 'canonical-maps' / 'fchma-causal-framework-atlas-v0.json'
)


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


LAYERS = [
    {
        'id': 'condition_work_interaction',
        'label': '体調-仕事相互作用レイヤー',
        'description': '症状、体調変動、仕事要求、場面負荷の相互作用を扱う。',
    },
    {
        'id': 'participation_transition',
        'label': '参加・移行レイヤー',
        'description': '就労参加、継続、移行、離脱リスク、時間経過を扱う。',
    },
    {
        'id': 'support_orchestration',
        'label': '支援オーケストレーションレイヤー',
        'description': '配慮、連携、説明、制度アクセス、支援体制を扱う。',
    },
]


DOMAINS = [
    {
        'id': 'symptom_variability',
        'label': '症状変動',
        'primary_layer': 'condition_work_interaction',
        'node_pattern': ['health_condition', 'body_functions_structures', 'activities'],
        'question_seed': 'どの症状・変動が、どの作業場面で強く出るか。',
        'intervention_ports': ['症状変動の場面特定', '負荷が高い時間帯の切り分け', '回復余地の確保'],
    },
    {
        'id': 'task_demand_mismatch',
        'label': '仕事要求ミスマッチ',
        'primary_layer': 'condition_work_interaction',
        'node_pattern': ['activities', 'work_design', 'participation'],
        'question_seed': '必要な作業要求と現在の遂行条件がどこで噛み合っていないか。',
        'intervention_ports': ['タスク切り出し', '時間設計の変更', '役割期待の調整'],
    },
    {
        'id': 'participation_role_instability',
        'label': '参加・役割不安定化',
        'primary_layer': 'participation_transition',
        'node_pattern': ['activities', 'participation', 'role_expectations'],
        'question_seed': '働き方や役割期待のどこが継続を不安定にしているか。',
        'intervention_ports': ['就労継続条件の再設定', '役割の再定義', '参加条件の緩和'],
    },
    {
        'id': 'accommodation_environment_gap',
        'label': '配慮・環境ギャップ',
        'primary_layer': 'support_orchestration',
        'node_pattern': ['environmental_factors', 'support_resources', 'participation'],
        'question_seed': '必要な配慮と実際の職場環境の間にどのギャップがあるか。',
        'intervention_ports': ['必要配慮の言語化', '職場内調整', '環境設定の見直し'],
    },
    {
        'id': 'communication_disclosure_mediation',
        'label': '説明・開示媒介',
        'primary_layer': 'support_orchestration',
        'node_pattern': ['personal_factors', 'environmental_factors', 'support_resources'],
        'question_seed': '誰に何をどう伝えるかが支援形成にどう影響しているか。',
        'intervention_ports': ['説明順序の設計', '開示範囲の調整', '対話相手の選定'],
    },
    {
        'id': 'support_coordination_access',
        'label': '支援連携アクセス',
        'primary_layer': 'support_orchestration',
        'node_pattern': ['support_resources', 'institutional_conditions', 'participation'],
        'question_seed': '必要な支援資源に接続できているか、連携の詰まりはどこか。',
        'intervention_ports': ['連携先の明確化', '支援導線の一本化', '役割分担の再設定'],
    },
    {
        'id': 'temporal_trajectory_instability',
        'label': '時間経過・移行不安定化',
        'primary_layer': 'participation_transition',
        'node_pattern': ['temporal_change', 'activities', 'participation'],
        'question_seed': '時間経過、再燃、移行期がどのように困難を変動させるか。',
        'intervention_ports': ['移行期支援', '再燃時対応ルート', '短期再評価サイクル'],
    },
    {
        'id': 'institutional_constraint_and_access',
        'label': '制度制約・制度アクセス',
        'primary_layer': 'support_orchestration',
        'node_pattern': ['institutional_conditions', 'support_resources', 'participation'],
        'question_seed': '制度上の要件やアクセス条件が何を可能にし、何を塞いでいるか。',
        'intervention_ports': ['制度導線の確認', '給付・制度利用の整理', '法制度ガードレール確認'],
    },
]


MOTIFS = [
    {
        'id': 'amplification',
        'label': '増幅',
        'relation_pattern': ['amplifies'],
        'summary': '条件の重なりが困難や不安定さを強める。',
    },
    {
        'id': 'mismatch',
        'label': 'ミスマッチ',
        'relation_pattern': ['inhibits', 'constrains'],
        'summary': '要求条件と利用可能条件のズレが生じている。',
    },
    {
        'id': 'bottleneck',
        'label': 'ボトルネック',
        'relation_pattern': ['mediates', 'blocks'],
        'summary': '一箇所の詰まりが全体の流れを止めている。',
    },
    {
        'id': 'buffering',
        'label': '緩衝',
        'relation_pattern': ['buffers', 'stabilizes'],
        'summary': '保護因子や支援が負荷を和らげている。',
    },
    {
        'id': 'compensation',
        'label': '補償',
        'relation_pattern': ['compensates', 'substitutes'],
        'summary': '別の資源や設計変更が不足を補っている。',
    },
    {
        'id': 'delay_recurrence',
        'label': '遅延・再燃',
        'relation_pattern': ['delays', 'loops'],
        'summary': '時間差や再発的なループが問題を見えにくくしている。',
    },
]


def build_framework_entry(domain: dict[str, Any], motif: dict[str, Any]) -> dict[str, Any]:
    return {
        'framework_id': f"{domain['id']}__{motif['id']}",
        'title': f"{domain['label']} × {motif['label']}",
        'primary_layer': domain['primary_layer'],
        'domain_id': domain['id'],
        'motif_id': motif['id'],
        'summary': f"{domain['label']}の文脈で、{motif['summary']}",
        'node_pattern': domain['node_pattern'],
        'relation_pattern': motif['relation_pattern'],
        'core_question': domain['question_seed'],
        'interpretation_focus': [
            'observation',
            'inference',
            'recommendation',
        ],
        'typical_intervention_ports': domain['intervention_ports'],
        'view_cut_keys': [
            'layer',
            'domain',
            'motif',
            'actor',
            'phase',
            'severity',
            'evidence_density',
        ],
    }


def main() -> None:
    frameworks = [build_framework_entry(domain, motif) for domain in DOMAINS for motif in MOTIFS]
    payload = {
        'version': '0.1.0',
        'generated_at': iso_now(),
        'positioning': {
            'role': 'The exhaustive methodological superstructure for FCHMA causal reasoning.',
            'note': 'Product-facing frame sets such as 26 frames should be treated as projections or cuts of this atlas, not the atlas itself.',
        },
        'layers': LAYERS,
        'domains': DOMAINS,
        'motifs': MOTIFS,
        'framework_count': len(frameworks),
        'frameworks': frameworks,
        'cut_principles': [
            'Cut by layer when showing macro structure.',
            'Cut by domain when showing causal location.',
            'Cut by motif when showing how the problem behaves.',
            'Cut by actor when assigning intervention ownership.',
            'Cut by phase when distinguishing pre-employment, transition, and post-employment.',
            'Cut by evidence_density when deciding whether to ask more questions before stronger advice.',
        ],
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'framework_count': len(frameworks), 'output': str(OUTPUT_PATH.relative_to(REPO_ROOT))}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
