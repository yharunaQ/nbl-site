#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
FRAGMENTARY_JSON = RUN_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.json"
GRAMMAR_JSON = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.md"


AXIS_TO_OPERATORS = {
    "C01-health-time": ["OP-01-translate-condition-to-work", "OP-07-update-loop"],
    "C02-entry-translation": ["OP-01-translate-condition-to-work", "OP-04-sequence-entry-and-life-security", "OP-06-protect-disclosure-boundary"],
    "C03-support-continuity": ["OP-01-translate-condition-to-work", "OP-07-update-loop"],
    "C04-information-participation": ["OP-02-synchronize-information", "OP-06-protect-disclosure-boundary"],
    "C05-worksite-contact": ["OP-03-design-work-contact-point"],
    "C06-life-security": ["OP-04-sequence-entry-and-life-security"],
    "C07-quality-participation": ["OP-05-translate-performance-to-value"],
    "C08-prework-participation": ["OP-04-sequence-entry-and-life-security", "OP-01-translate-condition-to-work"],
}


GRAMMAR_AXIS_SIGNATURES = {
    "SG-01-continuity-quality-loop": {
        "required": ["C01-health-time", "C04-information-participation", "C07-quality-participation"],
        "supporting": ["C03-support-continuity"],
    },
    "SG-02-work-contact-evaluation-loop": {
        "required": ["C01-health-time", "C05-worksite-contact", "C07-quality-participation"],
        "supporting": ["C03-support-continuity"],
    },
    "SG-03-life-security-sequencing": {
        "required": ["C01-health-time", "C06-life-security"],
        "supporting": ["C03-support-continuity", "C05-worksite-contact", "C02-entry-translation"],
    },
    "SG-04-information-to-work-procedure-knot": {
        "required": ["C04-information-participation", "C05-worksite-contact"],
        "supporting": ["C03-support-continuity", "C02-entry-translation"],
    },
    "SG-05-entry-prework-translation": {
        "required": ["C02-entry-translation", "C08-prework-participation"],
        "supporting": ["C03-support-continuity", "C01-health-time", "C06-life-security"],
    },
    "SG-06-minority-window-revival": {
        "required": ["C05-worksite-contact", "C06-life-security"],
        "supporting": ["C04-information-participation", "C08-prework-participation", "C01-health-time"],
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def grammar_match(source_axes: set[str], grammar_id: str) -> dict[str, Any]:
    signature = GRAMMAR_AXIS_SIGNATURES[grammar_id]
    required = set(signature["required"])
    supporting = set(signature["supporting"])
    visible_required = sorted(source_axes & required)
    visible_supporting = sorted(source_axes & supporting)
    missing_required = sorted(required - source_axes)
    missing_supporting = sorted(supporting - source_axes)
    score = len(visible_required) * 2 + len(visible_supporting)
    if len(visible_required) == len(required):
        slot_status = "direct_fragmentary_grammar_slot"
    elif visible_required and visible_supporting:
        slot_status = "partial_fragmentary_grammar_slot"
    elif visible_required:
        slot_status = "thin_required_axis_slot"
    elif visible_supporting:
        slot_status = "supporting_only_missing_axis_probe"
    else:
        slot_status = "no_grammar_slot"
    return {
        "grammar_id": grammar_id,
        "score": score,
        "slot_status": slot_status,
        "visible_required_axes": visible_required,
        "visible_supporting_axes": visible_supporting,
        "missing_required_axes": missing_required,
        "missing_supporting_axes": missing_supporting,
    }


def integration_use_for(slot: dict[str, Any]) -> list[str]:
    uses = ["freedom_slot"]
    if slot["missing_required_axes"]:
        uses.append("missing_axis_slot")
        uses.append("survey_same_structure_search_condition")
    if slot["slot_status"] in {"partial_fragmentary_grammar_slot", "thin_required_axis_slot"}:
        uses.append("counter_structure_slot")
    if slot["slot_status"] == "supporting_only_missing_axis_probe":
        uses.append("do_not_use_as_supporting_evidence")
    return uses


def build_payload() -> dict[str, Any]:
    fragmentary = load_json(FRAGMENTARY_JSON)
    grammar = load_json(GRAMMAR_JSON)
    grammar_names = {rule["grammar_id"]: rule["name"] for rule in grammar["grammar_rules"]}
    source_slots = []
    grammar_summary: dict[str, dict[str, Any]] = {
        grammar_id: {
            "grammar_id": grammar_id,
            "name": grammar_names[grammar_id],
            "direct_count": 0,
            "partial_count": 0,
            "thin_count": 0,
            "supporting_only_count": 0,
            "source_family_counts": Counter(),
            "examples": [],
            "missing_axis_counts": Counter(),
        }
        for grammar_id in GRAMMAR_AXIS_SIGNATURES
    }

    for source in fragmentary["source_integrations"]:
        axes = {axis["axis_id"] for axis in source["matched_axes"]}
        visible_operators = sorted({operator for axis in axes for operator in AXIS_TO_OPERATORS.get(axis, [])})
        slots = []
        for grammar_id in GRAMMAR_AXIS_SIGNATURES:
            slot = grammar_match(axes, grammar_id)
            if slot["slot_status"] == "no_grammar_slot":
                continue
            slot["grammar_name"] = grammar_names.get(grammar_id, grammar_id)
            slot["integration_uses"] = integration_use_for(slot)
            slots.append(slot)
            summary = grammar_summary[grammar_id]
            if slot["slot_status"] == "direct_fragmentary_grammar_slot":
                summary["direct_count"] += 1
            elif slot["slot_status"] == "partial_fragmentary_grammar_slot":
                summary["partial_count"] += 1
            elif slot["slot_status"] == "thin_required_axis_slot":
                summary["thin_count"] += 1
            elif slot["slot_status"] == "supporting_only_missing_axis_probe":
                summary["supporting_only_count"] += 1
            summary["source_family_counts"][source["source_family"]] += 1
            for axis in slot["missing_required_axes"]:
                summary["missing_axis_counts"][axis] += 1
            if len(summary["examples"]) < 8:
                summary["examples"].append(source["source_id"])

        source_slots.append(
            {
                "source_id": source["source_id"],
                "source_family": source["source_family"],
                "integration_status": source["integration_status"],
                "top_axis": source["top_axis"],
                "visible_axes": sorted(axes),
                "visible_operators": visible_operators,
                "grammar_slots": sorted(slots, key=lambda item: (-item["score"], item["grammar_id"])),
                "raw_or_redacted_text_included": False,
            }
        )

    final_summary = []
    for item in grammar_summary.values():
        final_summary.append(
            {
                **item,
                "source_family_counts": dict(item["source_family_counts"].most_common()),
                "missing_axis_counts": dict(item["missing_axis_counts"].most_common()),
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "workshop/NIVR/web-cache断片資料を、構造文法のoperator slotへ接続する。"
            "断片資料をケース数や支持根拠にせず、freedom slot、missing-axis slot、counter-structure slot、search-condition slotとして扱う。"
        ),
        "source_artifacts": [
            str(FRAGMENTARY_JSON.relative_to(ROOT)),
            str(GRAMMAR_JSON.relative_to(ROOT)),
        ],
        "fragmentary_source_count": len(source_slots),
        "grammar_summary": sorted(final_summary, key=lambda item: item["grammar_id"]),
        "source_slots": source_slots,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values) if values else "-"


def counts_text(values: dict[str, int]) -> str:
    return ", ".join(f"{key}:{value}" for key, value in values.items()) if values else "-"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Fragmentary Source Grammar Slots",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "workshop、NIVR、web-cacheの断片資料を、構造文法のoperator slotへ接続した。断片資料はケースでも支持根拠でもなく、どの自由度が見えていて、どのICF軸が欠け、調査データ側でどの同型条件を探すべきかを示す探索素材として扱う。",
        "",
        f"断片資料数: {payload['fragmentary_source_count']}",
        "",
        "## Grammar Summary",
        "",
        "| grammar | direct | partial | thin | supporting only | source families | frequent missing required axes | examples |",
        "|---|---:|---:|---:|---:|---|---|---|",
    ]
    for item in payload["grammar_summary"]:
        lines.append(
            "| "
            f"`{item['grammar_id']}` {item['name']} "
            f"| {item['direct_count']} "
            f"| {item['partial_count']} "
            f"| {item['thin_count']} "
            f"| {item['supporting_only_count']} "
            f"| {counts_text(item['source_family_counts'])} "
            f"| {counts_text(item['missing_axis_counts'])} "
            f"| {ids_text(item['examples'][:4])} |"
        )

    lines.extend(
        [
            "",
            "## Slot Reading",
            "",
            "- direct: 断片資料内に、その文法のrequired axesが揃っている。ただしケースではないため支持根拠ではなく、同型探索条件として使う。",
            "- partial: required axisとsupporting axisが混在している。文脈読解で、同じ構造の断片か、別構造かを確認する。",
            "- thin: required axisの一部だけが見える。単独では弱いが、missing-axis探索の入口になる。",
            "- supporting only: supporting axisだけが見える。支援・制度・説明一般に見えやすいため、構造支持として使わず、欠けた軸を探す。",
            "",
            "## Method Gain",
            "",
            "- 断片資料を調査データへ単純合算せず、欠けたICF軸を明示できる。",
            "- NIVR/web-cacheで薄く出るC05/C06/C08も、欠落ではなく、断片資料で観測されにくい自由度として扱える。",
            "- workshop資料は複数operatorが見えやすいが、それでもケース全体ではないため、同型探索条件に留める。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
