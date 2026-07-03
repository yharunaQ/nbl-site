#!/usr/bin/env python3
"""Context-read RR-01 without exporting text or field values."""

from __future__ import annotations

from collections import Counter, defaultdict
import csv
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

WORKSET = OUT_DIR / "stage1-production-raw-redacted-rereading-workset-manifest-v0-2026-05-23.json"
REDACTED_NOTES = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json"

REDACTED_SURFACES = {
    "employment_survey_3000": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    "nanbyo_survey_4000": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
}

DATASET_PATHS = {
    "employment_survey_3000": [
        ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/canonical_projection_candidates.csv",
        ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv",
        ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/multiselect_values.csv",
    ],
    "nanbyo_survey_4000": [
        ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/canonical_projection_candidates.csv",
        ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv",
        ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/multiselect_values.csv",
    ],
}

CORRIDOR = "RR-01-health-time-life-security"
PREFIX = "stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23"

LEXICONS = {
    "health_time": ["体調", "疲労", "疲れ", "通院", "治療", "休", "睡眠", "症状", "病状", "悪化", "回復", "体力", "健康"],
    "work_time_design": ["勤務", "時間", "短時間", "休憩", "休暇", "欠勤", "遅刻", "早退", "シフト", "残業"],
    "task_load_design": ["仕事量", "作業", "業務", "職務", "負担", "責任", "ペース", "配置", "仕事内容"],
    "life_security": ["収入", "生活", "給与", "賃金", "年金", "手当", "制度", "保障", "経済"],
    "support_bridge": ["支援", "相談", "上司", "同僚", "職場", "医師", "ハローワーク", "福祉"],
    "sequence_or_choice": ["継続", "退職", "復職", "転職", "再就職", "将来", "選択", "希望"],
}


def load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_id(value: Any) -> str | None:
    text = str(value or "").strip()
    if text.isdigit():
        return str(int(text))
    return None


def split_record_id(record_id: str) -> tuple[str, str]:
    dataset_id, local = record_id.split(":", 1)
    return dataset_id, str(int(local))


def workset_records(workset: dict[str, Any]) -> list[dict[str, str]]:
    for ws in workset["worksets"]:
        if ws["corridor"] == CORRIDOR:
            rows = []
            for group, ids in ws["record_groups"].items():
                for rid in ids:
                    rows.append({"record_id": rid, "group": group})
            return rows
    raise RuntimeError(f"{CORRIDOR} not found")


def load_redacted_text_internal(record_ids: set[str]) -> dict[str, str]:
    targets: dict[str, set[str]] = defaultdict(set)
    for rid in record_ids:
        dataset_id, local = split_record_id(rid)
        targets[dataset_id].add(local)
    texts: dict[str, list[str]] = defaultdict(list)
    for dataset_id, ids in targets.items():
        with REDACTED_SURFACES[dataset_id].open(encoding="utf-8") as handle:
            for line in handle:
                if not line.strip():
                    continue
                row = json.loads(line)
                respondent_id = normalize_id(row.get("respondent_id"))
                if respondent_id in ids:
                    rid = f"{dataset_id}:{int(respondent_id):05d}"
                    texts[rid].append(row.get("redacted_unit_text") or "")
    return {rid: "\n".join(parts) for rid, parts in texts.items()}


def load_field_refs(record_ids: set[str]) -> dict[str, list[str]]:
    targets: dict[str, set[str]] = defaultdict(set)
    for rid in record_ids:
        dataset_id, local = split_record_id(rid)
        targets[dataset_id].add(local)
    refs: dict[str, set[str]] = defaultdict(set)
    for dataset_id, ids in targets.items():
        for path in DATASET_PATHS[dataset_id]:
            with path.open(newline="", encoding="utf-8") as handle:
                reader = csv.DictReader(handle)
                for row in reader:
                    respondent_id = normalize_id(row.get("respondent_id"))
                    if respondent_id in ids:
                        rid = f"{dataset_id}:{int(respondent_id):05d}"
                        for key in [
                            "raw_name",
                            "display_name",
                            "question_group",
                            "canonical_concept",
                            "primary_frame",
                            "secondary_frame",
                            "matched_pattern",
                        ]:
                            if row.get(key):
                                refs[rid].add(row[key])
    return {rid: sorted(values) for rid, values in refs.items()}


def detect_types(text: str) -> dict[str, int]:
    out = {}
    for ctype, terms in LEXICONS.items():
        hits = sum(1 for term in terms if term in text)
        if hits:
            out[ctype] = hits
    return out


def redacted_axes(note: dict[str, Any]) -> set[str]:
    return {signal["axis"] for signal in note.get("scima_fchma_signals_without_quotes", [])}


def classify(text_types: set[str], field_types: set[str], group: str) -> dict[str, Any]:
    supports = []
    revision = []
    if {"health_time", "life_security"} <= text_types:
        supports.append("health-time and life-security close as a sequencing freedom context")
    if "health_time" in text_types and ({"work_time_design", "task_load_design"} & text_types):
        supports.append("health-time closes through work-time or task-load design")
    if {"life_security", "sequence_or_choice", "support_bridge"} <= text_types:
        supports.append("life-security closes through support-mediated choice or sequence")
    if "support_bridge" in text_types and "health_time" in text_types and "sequence_or_choice" in text_types:
        supports.append("support bridge can retranslate health-time into continuity or transition")
    if "life_security" in text_types and "health_time" not in text_types:
        revision.append("life-security appears without health-time closure; do not treat as C01/C06 coupling")
    if "health_time" in text_types and "life_security" not in text_types and "work_time_design" not in text_types and "task_load_design" not in text_types:
        revision.append("health-time appears without work-design or life-security closure")
    if group in {"boundary", "cross_check"}:
        revision.append(f"{group} record; use as contrast before strengthening the route")
    if not supports:
        if field_types:
            revision.append("structured field coverage exists but redacted context has not closed health-time/life-security coupling")
        else:
            revision.append("health-time/life-security coupling not closed by context type")
    action = (
        "advance_as_health_time_life_security_context_candidate"
        if supports
        else "structured_coverage_needs_context_confirmation"
        if field_types and group == "primary"
        else "keep_for_boundary_or_cross_axis_check"
    )
    return {
        "context_supports": sorted(set(supports)),
        "context_revision_pressure": sorted(set(revision)),
        "context_reading_action": action,
    }


def build() -> dict[str, Any]:
    workset = load(WORKSET)
    redacted = load(REDACTED_NOTES)
    rows_meta = workset_records(workset)
    record_ids = {row["record_id"] for row in rows_meta}
    texts = load_redacted_text_internal(record_ids)
    refs = load_field_refs(record_ids)
    redacted_by_id = {row["record_id"]: row for row in redacted["record_notes"]}
    rows = []
    redacted_type_counts = Counter()
    structured_field_type_counts = Counter()
    combined_type_counts = Counter()
    action_counts = Counter()
    for item in rows_meta:
        rid = item["record_id"]
        text_types_counts = detect_types(texts.get(rid, ""))
        field_types_counts = detect_types("\n".join(refs.get(rid, [])))
        combined_types_counts = dict(Counter(text_types_counts) + Counter(field_types_counts))
        for t in text_types_counts:
            redacted_type_counts[t] += 1
        for t in field_types_counts:
            structured_field_type_counts[t] += 1
        for t in combined_types_counts:
            combined_type_counts[t] += 1
        classification = classify(set(text_types_counts), set(field_types_counts), item["group"])
        action_counts[classification["context_reading_action"]] += 1
        rows.append(
            {
                "record_id": rid,
                "group": item["group"],
                "reading_surface": "redacted_internal_plus_structured_field_refs",
                "raw_original_opened": False,
                "source_text_exported": False,
                "redacted_text_exported": False,
                "field_value_exported": False,
                "redacted_unit_available": bool(texts.get(rid)),
                "redacted_context_type_counts_without_quotes": text_types_counts,
                "structured_field_context_type_counts_without_values": field_types_counts,
                "combined_context_type_counts_without_quotes_or_values": combined_types_counts,
                "redacted_axes": sorted(redacted_axes(redacted_by_id.get(rid, {}))),
                **classification,
                "not_allowed": [
                    "life-security adequacy judgment",
                    "work capacity judgment",
                    "support adequacy judgment",
                    "medical or employment finality",
                    "promotion",
                ],
            }
        )
    return {
        "artifact_id": PREFIX,
        "lane": "Falcon / Falcon Lab",
        "status": "context_reading_no_text_export_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "corridor": CORRIDOR,
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "record_count": len(rows),
        "redacted_context_type_record_counts": dict(sorted(redacted_type_counts.items())),
        "structured_field_context_type_record_counts": dict(sorted(structured_field_type_counts.items())),
        "combined_context_type_record_counts": dict(sorted(combined_type_counts.items())),
        "action_counts": dict(sorted(action_counts.items())),
        "core_reading": [
            "C01/C06 should remain active only when health-time, work design, life security, support, or sequence are read as interacting freedoms.",
            "Life security is not a background attribute and not a deficit judgment; it is a constraint surface on work choice, continuity, transition, and health-time implementation.",
            "Boundary and cross-check records should prevent the route from absorbing all income, health, or time signals into a smooth core claim.",
        ],
        "record_context_notes": rows,
    }


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 CR-01 Health-Time / Life-Security Context Reading",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: context reading / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        f"Corridor: `{data['corridor']}`",
        "",
        "出力には本文・伏字段落・field値を含めない。文脈型だけを残す。",
        "",
        "## Summary",
        f"- records: {data['record_count']}",
        f"- raw_original_opened: {data['raw_original_opened']}",
        f"- source_text_exported: {data['source_text_exported']}",
        "",
        "## Redacted Context Type Counts",
        "",
        "redacted本文側で検出された文脈型。Core強度の判断ではこちらを主に見る。",
        "",
        "| context type | records |",
        "|---|---:|",
    ]
    for ctype, count in data["redacted_context_type_record_counts"].items():
        lines.append(f"| {ctype} | {count} |")
    lines.extend([
        "",
        "## Structured Field Coverage Counts",
        "",
        "構造化field名・概念名側の被覆。これは設問設計上の可能性窓であり、文脈閉鎖やCore支持数ではない。",
        "",
        "| context type | records |",
        "|---|---:|",
    ])
    for ctype, count in data["structured_field_context_type_record_counts"].items():
        lines.append(f"| {ctype} | {count} |")
    lines.extend(["", "## Action Counts", "| action | records |", "|---|---:|"])
    for action, count in data["action_counts"].items():
        lines.append(f"| {action} | {count} |")
    lines.extend(["", "## Core Reading"])
    for item in data["core_reading"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    data = build()
    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / f"{PREFIX}-records.jsonl").write_text(
        "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in data["record_context_notes"]),
        encoding="utf-8",
    )
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(data), encoding="utf-8")
    print(PREFIX, "records=", data["record_count"], "actions=", data["action_counts"])


if __name__ == "__main__":
    main()
