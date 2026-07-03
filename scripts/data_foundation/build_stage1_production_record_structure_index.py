#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
WORKING_MAP_JSON = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

BRANCH_AXIS = {
    "P1-C01": "C01-health-time",
    "P1-C02": "C02-entry-translation",
    "P1-C03": "C03-support-continuity",
    "P1-C04": "C04-information-participation",
    "P1-C05": "C05-worksite-contact",
    "P1-C06": "C06-life-security",
    "P1-C07": "C07-quality-participation",
    "P1-C08": "C08-prework-participation",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def load_case_rows() -> dict[str, dict[str, Any]]:
    rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                rows[row["record_id"]] = row
    return rows


def axis_for_branch(branch: str) -> str | None:
    for prefix, axis in BRANCH_AXIS.items():
        if branch.startswith(prefix):
            return axis
    return None


def unique(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value and value not in seen:
            seen.add(value)
            result.append(value)
    return result


def diversity_signals(row: dict[str, Any]) -> list[str]:
    output: list[str] = []
    for key in ["health_condition_groups", "body_function_signals", "impairment_signals", "handbook_signals"]:
        value = row.get(key)
        if isinstance(value, list):
            output.extend(str(item) for item in value)
    return unique(output)[:12]


def build_index() -> dict[str, Any]:
    assignments = load_json(ASSIGN_JSON)["assignments"]
    working_map = load_json(WORKING_MAP_JSON)
    case_rows = load_case_rows()
    records: list[dict[str, Any]] = []
    primary_axis_counts: Counter[str] = Counter()
    boundary_axis_counts: Counter[str] = Counter()
    source_counts: Counter[str] = Counter()
    status_counts: Counter[str] = Counter()
    pattern_counts: Counter[str] = Counter()
    axis_pair_counts: Counter[str] = Counter()
    attack_axis_signal_counts: Counter[str] = Counter()
    for node in working_map["nodes"]:
        if node.get("node_type") == "structure_attack_freedom":
            attack_axis_signal_counts[node["axis_id"]] += node.get("record_count") or 0

    for item in assignments:
        record_id = item["record_id"]
        row = case_rows.get(record_id, {})
        candidate_branches = item.get("candidate_branches", [])
        boundary_tags = item.get("boundary_tags", [])
        primary_axes = unique([axis for branch in candidate_branches if (axis := axis_for_branch(branch))])
        boundary_axes = unique([axis for branch in boundary_tags if (axis := axis_for_branch(branch))])
        source = item.get("source") or record_id.split(":", 1)[0]
        source_counts[source] += 1
        status = row.get("status_group", "unknown")
        pattern = row.get("pattern_cell_id", "unknown")
        status_counts[status] += 1
        pattern_counts[pattern] += 1
        primary_axis_counts.update(primary_axes)
        boundary_axis_counts.update(boundary_axes)
        for left in primary_axes:
            for right in boundary_axes:
                if left != right:
                    axis_pair_counts[f"{left} -> {right}"] += 1
        records.append(
            {
                "record_id": record_id,
                "source": source,
                "status_group": status,
                "pattern_cell_id": pattern,
                "primary_axes": primary_axes,
                "boundary_axes": boundary_axes,
                "candidate_branches": candidate_branches,
                "boundary_tags": boundary_tags,
                "diversity_signals": diversity_signals(row),
                "narrative_lens_counts": row.get("narrative_lens_counts", {}),
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "record IDからSCIMA/FCHMA構造自由度へ引くための機械可読索引。本文引用・PII・レビュー判断は含めない。",
        "record_count": len(records),
        "source_counts": dict(source_counts.most_common()),
        "status_group_counts": dict(status_counts.most_common()),
        "pattern_cell_counts": dict(pattern_counts.most_common(20)),
        "primary_axis_counts": dict(primary_axis_counts.most_common()),
        "boundary_axis_counts": dict(boundary_axis_counts.most_common()),
        "attack_axis_candidate_signal_counts": dict(attack_axis_signal_counts.most_common()),
        "axis_pair_counts": dict(axis_pair_counts.most_common(30)),
        "records": records,
    }


def fmt_counter(counter: dict[str, int]) -> str:
    if not counter:
        return "なし"
    return ", ".join(f"{key}:{value}" for key, value in counter.items())


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Record Structure Index",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "record IDから、どのSCIMA/FCHMA構造自由度に入るかを引くための索引。本文、PII、判断結果は含めない。",
        "",
        f"record数: {data['record_count']}",
        f"source: {fmt_counter(data['source_counts'])}",
        "",
        "## Axis Coverage",
        "",
        "| axis | primary records | boundary records | attack candidate signals |",
        "|---|---:|---:|---:|",
    ]
    axes = sorted(set(data["primary_axis_counts"]) | set(data["boundary_axis_counts"]) | set(data["attack_axis_candidate_signal_counts"]))
    for axis in axes:
        lines.append(
            f"| `{axis}` | {data['primary_axis_counts'].get(axis, 0)} | {data['boundary_axis_counts'].get(axis, 0)} | "
            f"{data['attack_axis_candidate_signal_counts'].get(axis, 0)} |"
        )

    lines.extend(
        [
            "",
            "注: attack candidate signals は同一recordの重複を含む自由度候補数であり、固有record数ではない。C07/C08のようにbranch assignment上は薄いが、構造穴攻撃で保持すべき軸を落とさないために併記する。",
        ]
    )

    lines.extend(["", "## Strong Axis Pairs", "", "| pair | records |", "|---|---:|"])
    for pair, count in list(data["axis_pair_counts"].items())[:20]:
        lines.append(f"| `{pair}` | {count} |")

    lines.extend(["", "## Status / Pattern", ""])
    lines.append(f"- status_group: {fmt_counter(data['status_group_counts'])}")
    lines.append(f"- pattern_cell: {fmt_counter(data['pattern_cell_counts'])}")
    lines.extend(["", f"JSON: `{OUT_JSON.relative_to(ROOT)}`"])
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    data = build_index()
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
