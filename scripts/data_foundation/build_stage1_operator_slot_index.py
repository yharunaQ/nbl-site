#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
GRAMMAR_JSON = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.json"
FRAGMENTARY_SLOTS_JSON = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-operator-slot-index-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-operator-slot-index-v0-2026-05-18.md"


OPERATOR_QUERY_USES = {
    "OP-01-translate-condition-to-work": "本人条件が、勤務量、作業手順、通勤、評価条件、相談手順などへどう翻訳されるかを探す。",
    "OP-02-synchronize-information": "必要情報が、業務指示、非公式情報、安全確認、相談、評価へ届いているかを探す。",
    "OP-03-design-work-contact-point": "作業、動線、設備、休憩、代替作業、プライバシーなどの仕事接触点を探す。",
    "OP-04-sequence-entry-and-life-security": "待つ、休む、治療する、訓練する、求人を選ぶ、支援につながる順序を探す。",
    "OP-05-translate-performance-to-value": "条件付き遂行が、評価、役割、処遇、技能形成、将来見通しへどう変換されるかを探す。",
    "OP-06-protect-disclosure-boundary": "何を誰へどの範囲で説明するか、本人負荷・不利益・誤解・プライバシーの境界を探す。",
    "OP-07-update-loop": "体調、職務、評価、支援体制、生活条件の変化に応じた再同期を探す。",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def build_payload() -> dict[str, Any]:
    grammar = load_json(GRAMMAR_JSON)
    fragmentary = load_json(FRAGMENTARY_SLOTS_JSON)
    operator_items = {operator["operator_id"]: {**operator} for operator in grammar["operators"]}

    for operator_id, operator in operator_items.items():
        operator["query_use"] = OPERATOR_QUERY_USES[operator_id]
        operator["grammar_rules"] = []
        operator["record_count_proxy"] = 0
        operator["record_examples"] = []
        operator["fragmentary_source_count"] = 0
        operator["fragmentary_source_family_counts"] = Counter()
        operator["fragmentary_examples"] = []
        operator["direct_fragmentary_grammar_slots"] = []
        operator["missing_axis_pressure"] = Counter()

    for rule in grammar["grammar_rules"]:
        for operator_id in rule["operators"]:
            operator = operator_items[operator_id]
            operator["grammar_rules"].append(
                {
                    "grammar_id": rule["grammar_id"],
                    "name": rule["name"],
                    "source_record_count": rule["source_record_count"],
                }
            )
            operator["record_count_proxy"] += rule["source_record_count"]
            for record_id in rule["source_example_record_ids"]:
                if record_id not in operator["record_examples"] and len(operator["record_examples"]) < 12:
                    operator["record_examples"].append(record_id)

    for source in fragmentary["source_slots"]:
        for operator_id in source["visible_operators"]:
            operator = operator_items[operator_id]
            operator["fragmentary_source_count"] += 1
            operator["fragmentary_source_family_counts"][source["source_family"]] += 1
            if len(operator["fragmentary_examples"]) < 10:
                operator["fragmentary_examples"].append(source["source_id"])
            for slot in source["grammar_slots"]:
                if slot["slot_status"] == "direct_fragmentary_grammar_slot":
                    value = f"{slot['grammar_id']}::{source['source_id']}"
                    if len(operator["direct_fragmentary_grammar_slots"]) < 12:
                        operator["direct_fragmentary_grammar_slots"].append(value)
                for axis in slot["missing_required_axes"]:
                    operator["missing_axis_pressure"][axis] += 1

    operators = []
    for operator in operator_items.values():
        operators.append(
            {
                **operator,
                "fragmentary_source_family_counts": dict(operator["fragmentary_source_family_counts"].most_common()),
                "missing_axis_pressure": dict(operator["missing_axis_pressure"].most_common(8)),
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-operator-slot-index-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "構造文法をoperator単位で引けるようにし、Codexチャットでrecord側・断片資料側・文法側を横断検索するための未レビュー索引。"
        ),
        "source_artifacts": [
            str(GRAMMAR_JSON.relative_to(ROOT)),
            str(FRAGMENTARY_SLOTS_JSON.relative_to(ROOT)),
        ],
        "operators": operators,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values) if values else "-"


def counts_text(values: dict[str, int]) -> str:
    return ", ".join(f"{key}:{value}" for key, value in values.items()) if values else "-"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Operator Slot Index",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "構造文法をoperator単位で引けるようにした。Falcon/Codexが、record側、断片資料側、構造文法側を同じoperatorで横断して読むための未レビュー索引である。",
        "",
        "## Operators",
        "",
        "| operator | query use | grammar rules | record proxy | fragmentary sources | missing-axis pressure | record examples | source examples |",
        "|---|---|---|---:|---:|---|---|---|",
    ]
    for operator in payload["operators"]:
        rules = ", ".join(f"`{item['grammar_id']}`" for item in operator["grammar_rules"])
        lines.append(
            "| "
            f"`{operator['operator_id']}` {operator['name']} "
            f"| {operator['query_use']} "
            f"| {rules} "
            f"| {operator['record_count_proxy']} "
            f"| {operator['fragmentary_source_count']} "
            f"| {counts_text(operator['missing_axis_pressure'])} "
            f"| {ids_text(operator['record_examples'][:4])} "
            f"| {ids_text(operator['fragmentary_examples'][:3])} |"
        )

    lines.extend(
        [
            "",
            "## Use In Codex Chat",
            "",
            "- 質問が支援名や障害名で来ても、まずoperatorへ変換して読む。",
            "- operatorから、対応するgrammar rule、record examples、fragmentary source slotsへ戻る。",
            "- record proxyは重複を含む作業量指標であり、統計的な母数や有病率ではない。",
            "- fragmentary sourcesは支持根拠ではなく、欠けた軸と同型探索条件を示す。",
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
