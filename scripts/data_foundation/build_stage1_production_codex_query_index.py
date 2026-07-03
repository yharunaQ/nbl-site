#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
WORKING_MAP_JSON = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.json"
RECORD_INDEX_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
FRAGMENTARY_INTEGRATION_JSON = RUN_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-codex-query-index-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-codex-query-index-v0-2026-05-18.md"


RELATION_AXES = {
    "SR-C01C03-LONGTERM-CONTINUITY": ["C01-health-time", "C03-support-continuity"],
    "SR-C03-ENTRY-VS-CONTINUITY": ["C03-support-continuity"],
    "SR-C02T-BIDIRECTIONAL-TRANSLATION": ["C02-entry-translation"],
    "SR-C02T-C03-CONTINUITY-BRIDGE": ["C02-entry-translation", "C03-support-continuity"],
    "SR-C04A-C05-WORKSITE-INFORMATION": ["C04-information-participation", "C05-worksite-contact"],
    "SR-C05-WORKSITE-HEALTHTIME": ["C05-worksite-contact", "C01-health-time"],
    "SR-C05-MOBILITY-WORKSITE": ["C05-worksite-contact"],
    "SR-C06-HEALTHTIME-LIFESECURITY": ["C06-life-security", "C01-health-time"],
    "SR-C06-SUPPORT-LIFESECURITY": ["C06-life-security", "C03-support-continuity"],
    "SR-C06-TRANSITION-LIFESECURITY": ["C06-life-security", "C02-entry-translation", "C08-prework-participation"],
    "SR-C06-EVALUATION-LIFESECURITY": ["C06-life-security", "C07-quality-participation"],
    "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT": [
        "C07-quality-participation",
        "C04-information-participation",
        "C06-life-security",
    ],
    "SR-C08-PREWORK-ENTRY-TRANSLATION": [
        "C08-prework-participation",
        "C02-entry-translation",
        "C03-support-continuity",
    ],
    "SR-C08-PASTWORK-LIFE-REBUILDING": [
        "C08-prework-participation",
        "C01-health-time",
        "C02-entry-translation",
        "C03-support-continuity",
    ],
}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def axis_lookup(working_map: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {item["axis_id"]: item for item in working_map["axis_summaries"]}


def axis_nodes(working_map: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    by_axis: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for node in working_map["nodes"]:
        by_axis[node["axis_id"]].append(node)
    return by_axis


def related_relations(relations: list[dict[str, Any]]) -> dict[str, list[str]]:
    by_axis: dict[str, list[str]] = defaultdict(list)
    for relation in relations:
        for axis_id in RELATION_AXES.get(relation["relation_id"], []):
            by_axis[axis_id].append(relation["relation_id"])
    return by_axis


def record_examples(records: list[dict[str, Any]], axis_id: str, mode: str) -> list[str]:
    key = "primary_axes" if mode == "primary" else "boundary_axes"
    examples: list[str] = []
    source_seen: Counter[str] = Counter()
    for record in records:
        if axis_id not in record.get(key, []):
            continue
        source = record["source"]
        if source_seen[source] >= 5:
            continue
        examples.append(record["record_id"])
        source_seen[source] += 1
        if len(examples) >= 12:
            break
    return examples


def axis_record_profile(record_index: dict[str, Any], axis_id: str) -> dict[str, Any]:
    records = record_index["records"]
    primary = [record for record in records if axis_id in record.get("primary_axes", [])]
    boundary = [record for record in records if axis_id in record.get("boundary_axes", [])]
    diversity = Counter()
    status = Counter()
    source = Counter()
    patterns = Counter()
    for record in primary + boundary:
        diversity.update(record.get("diversity_signals", []))
        status[record.get("status_group", "unknown")] += 1
        source[record.get("source", "unknown")] += 1
        patterns[record.get("pattern_cell_id", "unknown")] += 1
    return {
        "primary_record_count": len(primary),
        "boundary_record_count": len(boundary),
        "attack_candidate_signal_count": record_index.get("attack_axis_candidate_signal_counts", {}).get(axis_id, 0),
        "record_examples_primary": record_examples(records, axis_id, "primary"),
        "record_examples_boundary": record_examples(records, axis_id, "boundary"),
        "status_group_counts": dict(status.most_common(8)),
        "source_counts": dict(source.most_common()),
        "pattern_cell_counts": dict(patterns.most_common(8)),
        "top_diversity_signals": dict(diversity.most_common(12)),
    }


def axis_source_profile(integration: dict[str, Any], axis_id: str) -> dict[str, Any]:
    row = next(item for item in integration["axis_coverage"] if item["axis_id"] == axis_id)
    sources = [
        source
        for source in integration["source_integrations"]
        if any(axis["axis_id"] == axis_id for axis in source["matched_axes"])
    ]
    top_sources = [source["source_id"] for source in sources if source["top_axis"] == axis_id][:10]
    source_examples: list[str] = []
    for family, examples in row.get("source_examples_by_family", {}).items():
        source_examples.extend(examples[:3])
    return {
        "matched_fragmentary_source_count": row["matched_source_count"],
        "top_axis_fragmentary_source_count": row["top_axis_source_count"],
        "source_family_counts": row["source_family_counts"],
        "source_examples": source_examples[:12],
        "top_axis_source_examples": top_sources,
    }


def relation_source_examples(integration: dict[str, Any], axes: list[str]) -> list[str]:
    examples: list[str] = []
    for source in integration["source_integrations"]:
        matched = {axis["axis_id"] for axis in source["matched_axes"]}
        if all(axis in matched for axis in axes):
            examples.append(source["source_id"])
        if len(examples) >= 12:
            return examples
    if len(axes) <= 1:
        return examples
    for source in integration["source_integrations"]:
        matched = {axis["axis_id"] for axis in source["matched_axes"]}
        if len(matched.intersection(axes)) >= 2 and source["source_id"] not in examples:
            examples.append(source["source_id"])
        if len(examples) >= 12:
            break
    return examples


def build_axis_cards(
    working_map: dict[str, Any],
    record_index: dict[str, Any],
    integration: dict[str, Any],
    relations: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    axis_meta = axis_lookup(working_map)
    nodes = axis_nodes(working_map)
    relation_map = related_relations(relations)
    cards = []
    for axis_id, meta in axis_meta.items():
        record_profile = axis_record_profile(record_index, axis_id)
        source_profile = axis_source_profile(integration, axis_id)
        card = {
            "query_id": f"QX-{axis_id}",
            "query_type": "axis",
            "axis_id": axis_id,
            "label": meta["label"],
            "first_principle": meta["first_principle"],
            "avoid_reading": meta["avoid"],
            "status": "machine_generated_unreviewed_no_promotion",
            "record_profile": record_profile,
            "fragmentary_source_profile": source_profile,
            "top_nodes": [
                {
                    "node_id": node["node_id"],
                    "node_type": node["node_type"],
                    "title": node["title"],
                    "record_count": node.get("record_count"),
                    "representative_ids": node.get("representative_ids", [])[:5],
                }
                for node in sorted(nodes.get(axis_id, []), key=lambda item: item.get("record_count") or 0, reverse=True)[:8]
            ],
            "related_relation_ids": relation_map.get(axis_id, []),
            "codex_query_route": [
                "axisの第一原理とavoid_readingで読みの範囲を固定する。",
                "record_examples_primaryとrecord_examples_boundaryを対照し、問題側だけに縮めない。",
                "fragmentary sourceはsource IDだけを参照し、支援妥当性ではなく同型探索・境界探索に使う。",
                "related_relation_idsで別自由度との接触面を確認する。",
            ],
            "raw_or_redacted_text_included": False,
        }
        cards.append(card)
    return cards


def build_relation_cards(
    relations: list[dict[str, Any]],
    working_map: dict[str, Any],
    integration: dict[str, Any],
) -> list[dict[str, Any]]:
    labels = {item["axis_id"]: item["label"] for item in working_map["axis_summaries"]}
    cards = []
    for relation in relations:
        axes = RELATION_AXES.get(relation["relation_id"], [])
        cards.append(
            {
                "query_id": f"QR-{relation['relation_id']}",
                "query_type": "relation",
                "relation_id": relation["relation_id"],
                "title": relation["title"],
                "axes": [{"axis_id": axis_id, "label": labels.get(axis_id, axis_id)} for axis_id in axes],
                "record_count": relation["record_count"],
                "representative_ids": relation.get("representative_ids", [])[:8],
                "boundary_ids": relation.get("boundary_ids", [])[:8],
                "reading": relation["reading"],
                "counter_reading": relation["counter_reading"],
                "next_use": relation["next_use"],
                "fragmentary_source_examples": relation_source_examples(integration, axes),
                "status": "machine_generated_unreviewed_no_promotion",
                "raw_or_redacted_text_included": False,
            }
        )
    return cards


def build_payload() -> dict[str, Any]:
    working_map = read_json(WORKING_MAP_JSON)
    record_index = read_json(RECORD_INDEX_JSON)
    integration = read_json(FRAGMENTARY_INTEGRATION_JSON)
    relations = read_json(RELATION_JSON)["relations"]
    axis_cards = build_axis_cards(working_map, record_index, integration, relations)
    relation_cards = build_relation_cards(relations, working_map, integration)
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "purpose": "CodexチャットでStage 1知識ネットワークを使うための、軸別・関係別の未レビューquery index。",
        "method_boundary": {
            "no_raw_text": True,
            "no_pii": True,
            "no_source_validity_decision": True,
            "no_support_validity_judgment": True,
            "no_knowledge_promotion": True,
        },
        "axis_query_card_count": len(axis_cards),
        "relation_query_card_count": len(relation_cards),
        "axis_query_cards": axis_cards,
        "relation_query_cards": relation_cards,
    }


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Codex Query Index",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "これは、FalconのStage 1知識ネットワークをCodexチャットで使うための、軸別・関係別query indexである。record IDとsource IDだけを保持し、本文引用、PII、支援妥当性判断、知識昇格は含めない。",
        "",
        f"axis query cards: {payload['axis_query_card_count']}",
        f"relation query cards: {payload['relation_query_card_count']}",
        "",
        "## Axis Query Cards",
        "",
        "| query | records primary/boundary/attack | fragmentary sources | relations | examples |",
        "|---|---:|---:|---|---|",
    ]
    for card in payload["axis_query_cards"]:
        record = card["record_profile"]
        source = card["fragmentary_source_profile"]
        example_ids = record["record_examples_primary"] or record["record_examples_boundary"]
        if not example_ids:
            example_ids = [
                record_id
                for node in card["top_nodes"]
                for record_id in node.get("representative_ids", [])
            ]
        examples = ", ".join(f"`{record_id}`" for record_id in example_ids[:3])
        relations = ", ".join(f"`{relation_id}`" for relation_id in card["related_relation_ids"][:5]) or "なし"
        lines.append(
            f"| `{card['axis_id']}` {card['label']} | {record['primary_record_count']}/{record['boundary_record_count']}/{record['attack_candidate_signal_count']} | "
            f"{source['matched_fragmentary_source_count']} | {relations} | {examples} |"
        )

    lines.extend([
        "",
        "## Relation Query Cards",
        "",
        "| query | axes | records | representative IDs | fragmentary source examples |",
        "|---|---|---:|---|---|",
    ])
    for card in payload["relation_query_cards"]:
        axes = ", ".join(f"{item['label']}" for item in card["axes"])
        reps = ", ".join(f"`{record_id}`" for record_id in card["representative_ids"][:3])
        sources = ", ".join(f"`{source_id}`" for source_id in card["fragmentary_source_examples"][:2]) or "なし"
        lines.append(f"| `{card['relation_id']}` {card['title']} | {axes} | {card['record_count']} | {reps} | {sources} |")

    lines.extend([
        "",
        "## 使い方",
        "",
        "- ユーザーの問いを、まず8軸のどれに近いかへ置く。",
        "- 軸カードでrecord ID、source ID、関連relationを同時に見る。",
        "- relationカードで代表IDと境界IDを対照し、単独原因・支援有効性・医学モデルへ縮めない。",
        "- 必要な時だけ、許可範囲内で元の分析ready情報を読み、本文は引用しない。",
        "",
        f"JSON: `{OUT_JSON.relative_to(ROOT)}`",
    ])
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
