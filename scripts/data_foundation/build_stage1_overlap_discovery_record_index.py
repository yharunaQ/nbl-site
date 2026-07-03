#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGNMENT_JSON = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.json"
DEEP_READING_JSON = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-overlap-discovery-record-index-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-overlap-discovery-record-index-v0-2026-05-18.md"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def top_counts(values: list[str], limit: int = 5) -> dict[str, int]:
    return dict(Counter(values).most_common(limit))


def compact_record(record: dict[str, Any]) -> dict[str, Any]:
    return {
        "record_id": record["record_id"],
        "source": record["source"],
        "status_group": record["status_group"],
        "condition_buckets": record["condition_buckets"],
        "state_readings": record["state_readings"],
        "primary_family_ids": record["primary_family_ids"],
        "boundary_family_ids": record["boundary_family_ids"],
    }


def balanced_examples(records: list[dict[str, Any]], limit: int = 12) -> list[str]:
    picked: list[str] = []
    seen_record_ids: set[str] = set()

    def key_for(record: dict[str, Any]) -> tuple[str, str, str]:
        condition = record["condition_buckets"][0] if record["condition_buckets"] else "条件窓なし"
        return (record["source"], record["status_group"], condition)

    by_source: dict[str, list[dict[str, Any]]] = {}
    for record in records:
        by_source.setdefault(record["source"], []).append(record)
    source_order = sorted(by_source)
    source_candidates: dict[str, list[dict[str, Any]]] = {}
    for source, source_records in by_source.items():
        seen_keys: set[str] = set()
        unique_records: list[dict[str, Any]] = []
        for record in sorted(source_records, key=key_for):
            key = "::".join(key_for(record))
            if key in seen_keys:
                continue
            unique_records.append(record)
            seen_keys.add(key)
        source_candidates[source] = unique_records + [
            record for record in source_records if record["record_id"] not in {item["record_id"] for item in unique_records}
        ]

    while len(picked) < limit:
        progressed = False
        for source in source_order:
            while source_candidates[source]:
                record = source_candidates[source].pop(0)
                if record["record_id"] in seen_record_ids:
                    continue
                picked.append(record["record_id"])
                seen_record_ids.add(record["record_id"])
                progressed = True
                break
            if len(picked) >= limit:
                return picked
        if not progressed:
            break
    for record in records:
        if record["record_id"] not in seen_record_ids:
            picked.append(record["record_id"])
            seen_record_ids.add(record["record_id"])
        if len(picked) >= limit:
            return picked
    return picked


def build_payload() -> dict[str, Any]:
    assignments = load_json(ASSIGNMENT_JSON)
    deep = load_json(DEEP_READING_JSON)
    readings = {item["discovery_id"]: item for item in deep["deep_readings"]}

    per_od: dict[str, dict[str, Any]] = {}
    for discovery_id, reading in readings.items():
        per_od[discovery_id] = {
            "discovery_id": discovery_id,
            "deep_candidate_name": reading["deep_candidate_name"],
            "families": reading["families"],
            "record_count_from_discovery": reading["record_count"],
            "primary_record_ids": [],
            "boundary_record_ids": [],
            "primary_examples": [],
            "boundary_examples": [],
        }

    record_assignments: list[dict[str, Any]] = []
    for record in assignments["records"]:
        primary = set(record["primary_family_ids"])
        boundary = set(record["boundary_family_ids"])
        broad = primary | boundary
        primary_od_ids: list[str] = []
        boundary_od_ids: list[str] = []
        for discovery_id, reading in readings.items():
            families = set(reading["families"])
            if families <= primary:
                primary_od_ids.append(discovery_id)
                per_od[discovery_id]["primary_record_ids"].append(record["record_id"])
            elif families <= broad and len(families & primary) >= 2:
                boundary_od_ids.append(discovery_id)
                per_od[discovery_id]["boundary_record_ids"].append(record["record_id"])
        if primary_od_ids or boundary_od_ids:
            record_assignments.append(
                {
                    **compact_record(record),
                    "primary_od_ids": primary_od_ids,
                    "boundary_od_ids": boundary_od_ids,
                }
            )

    records_by_id = {record["record_id"]: record for record in assignments["records"]}
    for item in per_od.values():
        primary_records = [records_by_id[record_id] for record_id in item["primary_record_ids"]]
        boundary_records = [records_by_id[record_id] for record_id in item["boundary_record_ids"]]
        item["primary_count"] = len(primary_records)
        item["boundary_count"] = len(boundary_records)
        item["primary_examples"] = balanced_examples(primary_records)
        item["boundary_examples"] = balanced_examples(boundary_records)
        item["primary_status_counts"] = top_counts([record["status_group"] for record in primary_records])
        item["boundary_status_counts"] = top_counts([record["status_group"] for record in boundary_records])
        item["primary_condition_counts"] = top_counts(
            [condition for record in primary_records for condition in record["condition_buckets"]]
        )
        item["boundary_condition_counts"] = top_counts(
            [condition for record in boundary_records for condition in record["condition_buckets"]]
        )
        item["primary_state_counts"] = top_counts(
            [state for record in primary_records for state in record["state_readings"]]
        )
        item["boundary_state_counts"] = top_counts(
            [state for record in boundary_records for state in record["state_readings"]]
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-overlap-discovery-record-index-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "7つのoverlap discovery candidatesをrecord側へ戻し、primary一致とboundary一致を分けて検索可能にする。"
            "単独分類ではなく、循環・積層・結節の発見単位からrecord IDへ戻るための未レビュー索引。"
        ),
        "source_artifacts": [
            str(ASSIGNMENT_JSON.relative_to(ROOT)),
            str(DEEP_READING_JSON.relative_to(ROOT)),
        ],
        "record_with_overlap_discovery_count": len(record_assignments),
        "overlap_discoveries": list(per_od.values()),
        "record_assignments": record_assignments,
    }


def counts_text(counts: dict[str, int]) -> str:
    return ", ".join(f"{key}:{value}" for key, value in counts.items()) if counts else "-"


def ids_text(ids: list[str]) -> str:
    return ", ".join(f"`{record_id}`" for record_id in ids) if ids else "-"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Overlap Discovery Record Index",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "7つのoverlap discovery candidatesを、record側へ戻すための索引。primary一致は発見候補の中核、boundary一致は少数窓・境界例・復活候補として扱う。これは分類表ではなく、構造発見からrecordへ戻るための未レビュー作業台である。",
        "",
        f"overlap discoveryに接続したrecord数: {payload['record_with_overlap_discovery_count']}",
        "",
        "## Discovery to Record",
        "",
        "| discovery | primary | boundary | primary conditions | boundary conditions | primary examples | boundary examples |",
        "|---|---:|---:|---|---|---|---|",
    ]
    for item in payload["overlap_discoveries"]:
        lines.append(
            "| "
            f"`{item['discovery_id']}` {item['deep_candidate_name']} "
            f"| {item['primary_count']} "
            f"| {item['boundary_count']} "
            f"| {counts_text(item['primary_condition_counts'])} "
            f"| {counts_text(item['boundary_condition_counts'])} "
            f"| {ids_text(item['primary_examples'][:6])} "
            f"| {ids_text(item['boundary_examples'][:6])} |"
        )

    lines.extend(
        [
            "",
            "## 読み方",
            "",
            "- primary一致は、その発見候補の三つのstructural familyが主familyとして同時に立っているrecord。",
            "- boundary一致は、三つのfamilyがprimary+boundaryの範囲に入り、少なくとも二つがprimaryとして立っているrecord。",
            "- boundary一致は弱い命題ではなく、構造の変形、残余、少数条件窓、または上位構造への復活候補として読む。",
            "- ここでも疾病・障害種類は分類先ではなく、同じ発見構造の形を変える条件窓である。",
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
