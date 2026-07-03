#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from build_stage1_rcp_record_lattice import (
    ROOT,
    RUN_DIR,
    STATUS,
    branch_state,
    diversity_buckets,
    load_json,
)
from build_stage1_record_structural_state_index import FAMILY_CONFIGS


RECORD_INDEX_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
CATALOG_JSON = RUN_DIR / "stage1-production-structural-family-proposition-catalog-v0-2026-05-18.json"
REVIEW_CARDS_JSON = RUN_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.md"


def family_scores(record: dict[str, Any]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for config in FAMILY_CONFIGS:
        score = int(config["score"](record))
        threshold = int(config["threshold"])
        if score >= threshold:
            state = "primary"
        elif score >= threshold - 2:
            state = "boundary"
        else:
            state = "out"
        rows.append(
            {
                "family_id": config["family_id"],
                "title": config["title"],
                "score": score,
                "threshold": threshold,
                "assignment_state": state,
            }
        )
    rows.sort(key=lambda item: (-item["score"], item["family_id"]))
    return rows


def compact_record(record: dict[str, Any]) -> dict[str, Any]:
    scores = family_scores(record)
    primary = [row for row in scores if row["assignment_state"] == "primary"]
    boundary = [row for row in scores if row["assignment_state"] == "boundary"]
    return {
        "record_id": record["record_id"],
        "source": record["source"],
        "status_group": record["status_group"],
        "pattern_cell_id": record["pattern_cell_id"],
        "top_family_id": primary[0]["family_id"] if primary else None,
        "primary_family_ids": [row["family_id"] for row in primary[:5]],
        "boundary_family_ids": [row["family_id"] for row in boundary[:5]],
        "family_scores": scores[:10],
        "condition_buckets": sorted(diversity_buckets(record.get("diversity_signals", []))),
        "state_readings": sorted(branch_state(record)),
        "primary_axes": record.get("primary_axes", []),
        "boundary_axes": record.get("boundary_axes", []),
        "narrative_lens_counts": record.get("narrative_lens_counts", {}),
    }


def pick_balanced(records: list[dict[str, Any]], count: int) -> list[str]:
    picked: list[str] = []
    seen: set[str] = set()
    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        condition = record["condition_buckets"][0] if record["condition_buckets"] else "条件窓なし"
        groups[(record["source"], record["status_group"], condition)].append(record)
    for key in sorted(groups, key=lambda item: (-len(groups[item]), item)):
        for record in groups[key]:
            record_id = record["record_id"]
            if record_id not in seen:
                picked.append(record_id)
                seen.add(record_id)
                break
        if len(picked) >= count:
            return picked
    for record in records:
        record_id = record["record_id"]
        if record_id not in seen:
            picked.append(record_id)
            seen.add(record_id)
        if len(picked) >= count:
            return picked
    return picked


def build_payload() -> dict[str, Any]:
    records = load_json(RECORD_INDEX_JSON)["records"]
    assignments = [compact_record(record) for record in records]

    family_primary: dict[str, list[dict[str, Any]]] = defaultdict(list)
    family_boundary: dict[str, list[dict[str, Any]]] = defaultdict(list)
    top_family_counts: Counter[str] = Counter()
    no_primary = 0
    for assignment in assignments:
        if assignment["top_family_id"]:
            top_family_counts[assignment["top_family_id"]] += 1
        else:
            no_primary += 1
        for family_id in assignment["primary_family_ids"]:
            family_primary[family_id].append(assignment)
        for family_id in assignment["boundary_family_ids"]:
            family_boundary[family_id].append(assignment)

    family_rows = []
    for config in FAMILY_CONFIGS:
        family_id = config["family_id"]
        family_rows.append(
            {
                "family_id": family_id,
                "title": config["title"],
                "top_family_count": top_family_counts[family_id],
                "primary_touch_count": len(family_primary[family_id]),
                "boundary_touch_count": len(family_boundary[family_id]),
                "primary_example_ids": pick_balanced(family_primary[family_id], 8),
                "boundary_example_ids": pick_balanced(family_boundary[family_id], 8),
            }
        )

    source_counts = Counter(assignment["source"] for assignment in assignments)
    status_counts = Counter(assignment["status_group"] for assignment in assignments)
    multi_primary = sum(1 for assignment in assignments if len(assignment["primary_family_ids"]) >= 2)
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-record-family-assignment-index-v0-2026-05-18",
        "status": STATUS,
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "source_artifacts": [
            str(RECORD_INDEX_JSON.relative_to(ROOT)),
            str(CATALOG_JSON.relative_to(ROOT)),
            str(REVIEW_CARDS_JSON.relative_to(ROOT)),
        ],
        "purpose": "8241 recordを10 structural family review cardへ接続し、主family・境界family・状態読みを本文なしで検索できるようにする未レビュー索引。",
        "record_count": len(assignments),
        "source_counts": dict(source_counts),
        "status_group_counts": dict(status_counts),
        "no_primary_family_count": no_primary,
        "multi_primary_family_count": multi_primary,
        "family_summary": family_rows,
        "records": assignments,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values)


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Record Family Assignment Index",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "8241件のrecord IDを、10個のstructural family review cardへ接続した。JSONにはrecordごとの主family、境界family、family score、条件窓、状態読みを含める。Markdownは全件一覧ではなく、全体の構造分布と代表IDだけを示す。",
        "",
        f"record数: {payload['record_count']}",
        f"主familyなし: {payload['no_primary_family_count']}",
        f"複数主family: {payload['multi_primary_family_count']}",
        "",
        "## Family Summary",
        "",
        "| family | top family | primary touch | boundary touch | primary examples | boundary examples |",
        "|---|---:|---:|---:|---|---|",
    ]
    for row in payload["family_summary"]:
        lines.append(
            "| "
            f"`{row['family_id']}` {row['title']} | "
            f"{row['top_family_count']} | "
            f"{row['primary_touch_count']} | "
            f"{row['boundary_touch_count']} | "
            f"{ids_text(row['primary_example_ids'])} | "
            f"{ids_text(row['boundary_example_ids'])} |"
        )
    lines.extend(
        [
            "",
            "## Use In Next Analysis",
            "",
            "- `top_family_id` は便宜上の入口であり、最終分類ではない。",
            "- `primary_family_ids` が複数あるrecordは、構造の重なりを見る優先対象にする。",
            "- `boundary_family_ids` は、過剰分類を戻すための候補であり、弱い根拠として昇格しない。",
            "- 条件窓と状態読みを使い、多数派のfamilyだけに要約を独占させない。",
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
