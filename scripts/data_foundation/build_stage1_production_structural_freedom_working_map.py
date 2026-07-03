#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_JSON = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.md"

DEEP_ARTIFACTS = {
    "C01-health-time": RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.json",
    "C02-entry-translation": RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.json",
    "C03-support-continuity": RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.json",
    "C04-information-participation": RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.json",
    "C05-worksite-contact": RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.json",
    "C06-life-security": RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.json",
    "C07-C08-participation": RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.json",
}

ATTACK_ARTIFACTS = {
    "C01-health-time": RUN_DIR / "stage1-production-c01-health-time-attack-v0-2026-05-18.json",
    "C02-entry-translation": RUN_DIR / "stage1-production-c02-disclosure-translation-attack-v0-2026-05-18.json",
    "C03-support-continuity": RUN_DIR / "stage1-production-c03-support-mediation-attack-v0-2026-05-18.json",
    "C04-information-participation": RUN_DIR / "stage1-production-c04-direct-information-participation-attack-v0-2026-05-18.json",
    "C05-worksite-contact": RUN_DIR / "stage1-production-c05-worksite-mobility-attack-v0-2026-05-18.json",
    "C06-life-security": RUN_DIR / "stage1-production-c06-life-security-attack-v0-2026-05-18.json",
    "C07-quality-participation": RUN_DIR / "stage1-production-c07-quality-participation-attack-v0-2026-05-18.json",
    "C08-prework-participation": RUN_DIR / "stage1-production-c08-prework-participation-attack-v0-2026-05-18.json",
}

RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"

AXES = {
    "C01-health-time": {
        "label": "健康時間",
        "first_principle": "体調変動、治療、回復、休憩を、勤務時間だけでなく仕事内容、責任、配置、復職、長期継続へ接続する自由度。",
        "avoid": "医学的重症度や体調自己管理だけで説明しない。",
    },
    "C02-entry-translation": {
        "label": "入口相互翻訳",
        "first_principle": "本人条件を仕事設計言語へ変換し、求人・職務条件を生活・健康管理条件へ戻す双方向の自由度。",
        "avoid": "本人説明能力や開示量へ縮めない。",
    },
    "C03-support-continuity": {
        "label": "支援継続再翻訳",
        "first_principle": "相談入口、支援者、医療・福祉・職業支援が、就職前後、復職、病状変化、仕事内容変更で条件を再翻訳する自由度。",
        "avoid": "支援資源の有無や支援有効性判断にしない。",
    },
    "C04-information-participation": {
        "label": "情報参加同期",
        "first_principle": "説明、確認、理解、意思伝達を、責任、安全、評価、役割、支援へ同期させる自由度。",
        "avoid": "本人のコミュニケーション能力問題へ縮めない。",
    },
    "C05-worksite-contact": {
        "label": "仕事参加接触点",
        "first_principle": "通勤、移動、姿勢、作業場所、設備、職務代替、安全確認が、仕事内容、健康時間、情報参加、生活保障と接触する自由度。",
        "avoid": "設備や障害種類別支援メニューに戻さない。",
    },
    "C06-life-security": {
        "label": "生活保障制約",
        "first_principle": "収入、制度、生活安定が、仕事選択、健康時間、支援利用、評価処遇を広げも狭めもする制約面。",
        "avoid": "就労意欲や生活困窮だけで説明しない。",
    },
    "C07-quality-participation": {
        "label": "上方向参加品質",
        "first_principle": "評価、役割拡大、技能、処遇、昇進、働きがい、定着が、単なる就労継続を超えて仕事参加の質を変える自由度。",
        "avoid": "問題件数が少ないから周辺論点と見なさない。",
    },
    "C08-prework-participation": {
        "label": "入口以前参加",
        "first_principle": "生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信を、求人条件・支援条件へ接続する前段自由度。",
        "avoid": "本人の準備不足や意欲不足にしない。",
    },
}

DEEP_AXIS_MAP = {
    "C01-health-time": "C01-health-time",
    "C02-entry-translation": "C02-entry-translation",
    "C03-support-continuity": "C03-support-continuity",
    "C04-information-participation": "C04-information-participation",
    "C05-worksite-contact": "C05-worksite-contact",
    "C06-life-security": "C06-life-security",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def top(counter: dict[str, int] | None, limit: int = 8) -> dict[str, int]:
    if not counter:
        return {}
    return dict(Counter(counter).most_common(limit))


def distribution_for_node(item: dict[str, Any]) -> dict[str, Any]:
    distribution = item.get("distribution") or item.get("profile") or {}
    return {
        "source_counts": top(distribution.get("source_counts")),
        "status_group_counts": top(distribution.get("status_group_counts")),
        "pattern_cell_counts": top(distribution.get("pattern_cell_counts")),
        "diversity_counts": top(distribution.get("diversity_anchor_counts") or distribution.get("diversity_bucket_counts")),
        "signal_bucket_counts": top(distribution.get("signal_bucket_counts")),
    }


def deep_nodes() -> list[dict[str, Any]]:
    nodes: list[dict[str, Any]] = []
    for artifact_id, path in DEEP_ARTIFACTS.items():
        data = load_json(path)
        branches: list[tuple[str, dict[str, Any]]] = []
        for key in ["subbranches", "c07_subbranches", "c08_subbranches"]:
            for item in data.get(key, []):
                branches.append((key, item))
        for key, item in branches:
            if artifact_id == "C07-C08-participation":
                axis_id = "C07-quality-participation" if key == "c07_subbranches" else "C08-prework-participation"
            else:
                axis_id = DEEP_AXIS_MAP[artifact_id]
            nodes.append(
                {
                    "node_id": item["subbranch_id"],
                    "node_type": "deep_subbranch",
                    "axis_id": axis_id,
                    "artifact_id": artifact_id,
                    "title": item["title"],
                    "record_count": item["record_count"],
                    "handling": item.get("handling"),
                    "candidate_proposition": item.get("candidate_proposition"),
                    "counter_proposition": item.get("counter_proposition"),
                    "review_question": None,
                    "representative_ids": item.get("representative_ids", [])[:8],
                    "contrast_ids": item.get("contrast_ids", [])[:8],
                    "distribution": distribution_for_node(item),
                }
            )
    return nodes


def attack_nodes() -> list[dict[str, Any]]:
    nodes: list[dict[str, Any]] = []
    for axis_id, path in ATTACK_ARTIFACTS.items():
        data = load_json(path)
        for item in data.get("attacks", []):
            placement = item.get("four_placement") or item.get("placement_counts") or {}
            nodes.append(
                {
                    "node_id": item["attack_id"],
                    "node_type": "structure_attack_freedom",
                    "axis_id": axis_id,
                    "artifact_id": path.stem,
                    "title": item["title"],
                    "freedom": item.get("freedom"),
                    "record_count": item.get("candidate_record_count"),
                    "handling": item.get("status") or "machine_generated_unreviewed_no_promotion",
                    "candidate_proposition": item.get("candidate_proposition"),
                    "counter_proposition": item.get("counter_proposition"),
                    "review_question": item.get("review_question"),
                    "representative_ids": item.get("representative_ids", [])[:8],
                    "four_placement": {
                        "problem": placement.get("problem", 0),
                        "mitigation": placement.get("mitigation", 0),
                        "residual": placement.get("residual", 0),
                        "boundary": placement.get("boundary", 0),
                    },
                    "distribution": distribution_for_node(item),
                }
            )
    return nodes


def relation_nodes() -> list[dict[str, Any]]:
    relations = load_json(RELATION_JSON)["relations"]
    return [
        {
            "relation_id": item["relation_id"],
            "title": item["title"],
            "record_count": item["record_count"],
            "reading": item["reading"],
            "candidate_proposition": item.get("candidate_proposition"),
            "counter_reading": item.get("counter_reading") or item.get("counter_proposition"),
            "linked_contacts": item.get("contacts") or item.get("linked_contacts") or [],
        }
        for item in relations
    ]


def bridge_summary() -> dict[str, Any]:
    bridge = load_json(BRIDGE_JSON)
    branch_counts = {}
    for item in bridge["branch_bridge"]:
        branch_counts[item["branch_id"]] = {
            "case_records": item.get("case_record_count"),
            "fragmentary_sources": item.get("fragmentary_source_count"),
            "source_family_counts": item.get("fragmentary_source_counts", {}),
            "freedom_candidates": item.get("freedom_candidates", [])[:8],
        }
    return {
        "fragmentary_source_link_count": bridge["fragmentary_source_link_count"],
        "source_family_counts": bridge["source_family_counts"],
        "branch_counts": branch_counts,
    }


def axis_summaries(nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_axis: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for node in nodes:
        by_axis[node["axis_id"]].append(node)
    summaries = []
    for axis_id, axis in AXES.items():
        axis_nodes = by_axis.get(axis_id, [])
        deep = [node for node in axis_nodes if node["node_type"] == "deep_subbranch"]
        attacks = [node for node in axis_nodes if node["node_type"] == "structure_attack_freedom"]
        diversity = Counter()
        signal = Counter()
        for node in axis_nodes:
            diversity.update(node["distribution"].get("diversity_counts", {}))
            signal.update(node["distribution"].get("signal_bucket_counts", {}))
        largest = sorted(axis_nodes, key=lambda item: item.get("record_count") or 0, reverse=True)[:5]
        summaries.append(
            {
                "axis_id": axis_id,
                "label": axis["label"],
                "first_principle": axis["first_principle"],
                "avoid": axis["avoid"],
                "deep_subbranch_count": len(deep),
                "attack_freedom_count": len(attacks),
                "largest_nodes": [
                    {
                        "node_id": node["node_id"],
                        "title": node["title"],
                        "record_count": node.get("record_count"),
                    }
                    for node in largest
                ],
                "top_diversity_signals": dict(diversity.most_common(10)),
                "top_structural_signals": dict(signal.most_common(10)),
            }
        )
    return summaries


def build_map() -> dict[str, Any]:
    nodes = deep_nodes() + attack_nodes()
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "FalconがSCIMA/FCHMA構造自由度として検索・批判・追加分析するための未レビューworking map。",
        "method_boundary": {
            "not_public": True,
            "not_reviewed": True,
            "no_promotion": True,
            "no_support_validity_judgment": True,
            "no_case_correctness_judgment": True,
        },
        "axis_summaries": axis_summaries(nodes),
        "nodes": nodes,
        "relations": relation_nodes(),
        "fragmentary_source_bridge": bridge_summary(),
        "query_route": [
            "まず8つの構造自由度のどれが主かを見る。",
            "次にrelation edgeで、健康時間、入口翻訳、支援継続、情報参加、仕事参加接触点、生活保障、参加品質、入口以前参加の接続を見る。",
            "疾病・障害種類・性別・年齢等は固定分類の主因ではなく、各自由度内で意味を変える多様性信号として扱う。",
            "反対命題を必ず同時に読む。単一枝だけで支援妥当性や制度妥当性を判断しない。",
        ],
    }


def fmt_counter(counter: dict[str, int]) -> str:
    if not counter:
        return "なし"
    return ", ".join(f"{key}:{value}" for key, value in counter.items())


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Freedom Working Map",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "これは、個別カードや分析ログではなく、Falconが次の分析で使うための構造自由度working mapである。レビュー済み知識ではない。",
        "",
        "## 8つの構造自由度",
        "",
        "| axis | 第一原理読み | 深読解枝 | 攻撃自由度 | 避ける読み |",
        "|---|---|---:|---:|---|",
    ]
    for axis in data["axis_summaries"]:
        lines.append(
            f"| `{axis['axis_id']}` {axis['label']} | {axis['first_principle']} | "
            f"{axis['deep_subbranch_count']} | {axis['attack_freedom_count']} | {axis['avoid']} |"
        )

    lines.extend(["", "## 軸ごとの強いノード", ""])
    for axis in data["axis_summaries"]:
        lines.extend([f"### {axis['label']}", ""])
        for node in axis["largest_nodes"]:
            lines.append(f"- `{node['node_id']}` {node['title']}: {node['record_count']}件")
        lines.append(f"- 多様性信号: {fmt_counter(axis['top_diversity_signals'])}")
        if axis["top_structural_signals"]:
            lines.append(f"- 構造信号: {fmt_counter(axis['top_structural_signals'])}")
        lines.append("")

    lines.extend(["## Relation Spine", "", "| relation | records | reading |", "|---|---:|---|"])
    for relation in data["relations"]:
        lines.append(f"| `{relation['relation_id']}` {relation['title']} | {relation['record_count']} | {relation['reading']} |")

    lines.extend(["", "## 使い方", ""])
    for item in data["query_route"]:
        lines.append(f"- {item}")

    lines.extend(
        [
            "",
            "## 機械可読ノード",
            "",
            f"- node数: {len(data['nodes'])}",
            f"- relation数: {len(data['relations'])}",
            f"- 断片資料リンク数: {data['fragmentary_source_bridge']['fragmentary_source_link_count']}",
            f"- JSON: `{OUT_JSON.relative_to(ROOT)}`",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    data = build_map()
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
