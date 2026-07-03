#!/usr/bin/env python3
"""Bridge redacted rereading gaps with analysis-ready structured signals.

This pass does not open raw originals and does not export raw/label text. It
uses canonical concepts, frames, and field references from analysis_ready to
test whether RR-01..RR-05 records that were weak in the redacted-text pass are
recoverable through structured data.
"""

from __future__ import annotations

from collections import Counter, defaultdict
import csv
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

REDACTED_NOTES = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json"

DATASET_PATHS = {
    "employment_survey_3000": {
        "canonical": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/canonical_projection_candidates.csv",
        "structured": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv",
        "multiselect": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/multiselect_values.csv",
    },
    "nanbyo_survey_4000": {
        "canonical": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/canonical_projection_candidates.csv",
        "structured": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv",
        "multiselect": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/multiselect_values.csv",
    },
}

OUT_JSON = OUT_DIR / "stage1-production-structured-followup-rereading-bridge-v0-2026-05-23.json"
OUT_MD = OUT_DIR / "stage1-production-structured-followup-rereading-bridge-v0-2026-05-23.md"
OUT_JSONL = OUT_DIR / "stage1-production-structured-followup-rereading-bridge-records-v0-2026-05-23.jsonl"


CONCEPT_AXIS_MAP = {
    "health_condition": ["C01-health-time"],
    "activity_and_participation_difficulty": ["C01-health-time", "C05-worksite-contact", "C08-prework-participation"],
    "accommodation_and_support": ["C03-support-continuity", "C04-information-participation", "C05-worksite-contact"],
    "disclosure_and_explanation": ["C02-entry-disclosure-translation", "C04-information-participation"],
    "self_efficacy_and_future_outlook": ["C07-quality-participation", "C08-prework-participation"],
    "work_status": ["C07-quality-participation", "C08-prework-participation"],
    "respondent_profile": [],
}

FRAME_AXIS_MAP = {
    "health_condition": ["C01-health-time"],
    "activities": ["C05-worksite-contact", "C08-prework-participation"],
    "participation": ["C07-quality-participation", "C08-prework-participation"],
    "environmental_factors": ["C03-support-continuity", "C04-information-participation", "C05-worksite-contact", "C06-life-security"],
    "personal_factors": ["C07-quality-participation"],
}

FIELD_AXIS_LEXICONS = {
    "C01-health-time": ["体調", "疲労", "通院", "治療", "病", "休", "痛", "体力", "健康"],
    "C02-entry-disclosure-translation": ["開示", "説明", "伝", "応募", "採用", "求人", "面接"],
    "C03-support-continuity": ["支援", "相談", "助言", "援助", "家族", "医師", "福祉"],
    "C04-information-participation": ["情報", "指示", "会議", "聞", "見", "読", "書", "コミュニケーション"],
    "C05-worksite-contact": ["作業", "職場", "設備", "通勤", "移動", "安全", "仕事", "配置", "配慮"],
    "C06-life-security": ["収入", "賃金", "生活", "家計", "制度", "年金", "医療費", "雇用形態"],
    "C07-quality-participation": ["評価", "処遇", "やりがい", "役割", "責任", "技能", "将来", "満足"],
    "C08-prework-participation": ["訓練", "実習", "生活リズム", "求職", "再就職", "準備", "自信"],
}


def normalize_id(value: Any) -> str | None:
    text = str(value or "").strip()
    if text.isdigit():
        return str(int(text))
    return None


def record_key(dataset_id: str, respondent_id: str) -> str:
    return f"{dataset_id}:{int(respondent_id):05d}"


def split_record_id(record_id: str) -> tuple[str, str]:
    dataset_id, local_id = record_id.split(":", 1)
    return dataset_id, str(int(local_id))


def load_redacted_notes() -> dict[str, Any]:
    return json.loads(REDACTED_NOTES.read_text(encoding="utf-8"))


def group_targets(record_ids: set[str]) -> dict[str, set[str]]:
    out: dict[str, set[str]] = defaultdict(set)
    for rid in record_ids:
        dataset_id, local = split_record_id(rid)
        out[dataset_id].add(local)
    return dict(out)


def read_csv_rows(path: Path, targets: set[str]) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            respondent_id = normalize_id(row.get("respondent_id"))
            if respondent_id in targets:
                rows.append(row)
    return rows


def field_axes(row: dict[str, str]) -> set[str]:
    text = " ".join(
        [
            row.get("raw_name") or "",
            row.get("display_name") or "",
            row.get("question_group") or "",
            row.get("canonical_concept") or "",
            row.get("primary_frame") or "",
            row.get("secondary_frame") or "",
            row.get("matched_pattern") or "",
        ]
    )
    axes: set[str] = set()
    concept = row.get("canonical_concept")
    axes.update(CONCEPT_AXIS_MAP.get(concept or "", []))
    for frame_key in ["primary_frame", "secondary_frame"]:
        axes.update(FRAME_AXIS_MAP.get(row.get(frame_key) or "", []))
    for axis, terms in FIELD_AXIS_LEXICONS.items():
        if any(term in text for term in terms):
            axes.add(axis)
    return axes


def build_structured_profiles(target_records: set[str]) -> dict[str, dict[str, Any]]:
    targets_by_dataset = group_targets(target_records)
    profiles: dict[str, dict[str, Any]] = {
        rid: {
            "record_id": rid,
            "structured_rows": 0,
            "canonical_rows": 0,
            "multiselect_rows": 0,
            "canonical_concept_counts": Counter(),
            "primary_frame_counts": Counter(),
            "axis_counts": Counter(),
            "field_refs_without_values": set(),
            "response_type_counts": Counter(),
        }
        for rid in target_records
    }

    for dataset_id, ids in targets_by_dataset.items():
        paths = DATASET_PATHS[dataset_id]
        for row in read_csv_rows(paths["canonical"], ids):
            respondent_id = normalize_id(row.get("respondent_id"))
            if respondent_id is None:
                continue
            rid = record_key(dataset_id, respondent_id)
            profile = profiles[rid]
            profile["canonical_rows"] += 1
            concept = row.get("canonical_concept") or "unknown"
            frame = row.get("primary_frame") or "unknown"
            profile["canonical_concept_counts"][concept] += 1
            profile["primary_frame_counts"][frame] += 1
            for axis in field_axes(row):
                profile["axis_counts"][axis] += 1
            if row.get("raw_name"):
                profile["field_refs_without_values"].add(row["raw_name"])
        for row in read_csv_rows(paths["structured"], ids):
            respondent_id = normalize_id(row.get("respondent_id"))
            if respondent_id is None:
                continue
            rid = record_key(dataset_id, respondent_id)
            profile = profiles[rid]
            profile["structured_rows"] += 1
            profile["response_type_counts"][row.get("response_type") or "unknown"] += 1
            for axis in field_axes(row):
                profile["axis_counts"][axis] += 1
            if row.get("raw_name"):
                profile["field_refs_without_values"].add(row["raw_name"])
        for row in read_csv_rows(paths["multiselect"], ids):
            respondent_id = normalize_id(row.get("respondent_id"))
            if respondent_id is None:
                continue
            rid = record_key(dataset_id, respondent_id)
            profile = profiles[rid]
            profile["multiselect_rows"] += 1
            # Use questionnaire field metadata and option labels internally only.
            for axis in field_axes(row):
                profile["axis_counts"][axis] += 1
            if row.get("raw_name"):
                profile["field_refs_without_values"].add(row["raw_name"])

    finalized = {}
    for rid, profile in profiles.items():
        finalized[rid] = {
            "record_id": rid,
            "structured_rows": profile["structured_rows"],
            "canonical_rows": profile["canonical_rows"],
            "multiselect_rows": profile["multiselect_rows"],
            "canonical_concept_counts": dict(profile["canonical_concept_counts"].most_common()),
            "primary_frame_counts": dict(profile["primary_frame_counts"].most_common()),
            "axis_counts": dict(profile["axis_counts"].most_common()),
            "field_refs_without_values": sorted(profile["field_refs_without_values"]),
            "response_type_counts": dict(profile["response_type_counts"].most_common()),
        }
    return finalized


def redacted_axes(note: dict[str, Any]) -> set[str]:
    return {signal["axis"] for signal in note.get("scima_fchma_signals_without_quotes", [])}


def corridor_status(corridors: list[str], axes: set[str], is_hold_record: bool) -> dict[str, Any]:
    supports = []
    revision = []
    decisions = []
    for corridor in corridors:
        if corridor.startswith("RR-01"):
            if {"C01-health-time", "C06-life-security"} <= axes:
                supports.append("C01+C06 visible after structured bridge")
                decisions.append("RR-01 can proceed to context confirmation, not raw-first")
            else:
                revision.append("C01+C06 pair still not visible; raw/structured field lookup may be needed")
        elif corridor.startswith("RR-02"):
            if "C07-quality-participation" in axes:
                supports.append("C07 visible after structured bridge")
                decisions.append("RR-02 should test value-translation rather than treat C07 as absent")
            else:
                revision.append("C07 still weak; likely modifier or adjacent-axis absorption")
        elif corridor.startswith("RR-03"):
            if "C08-prework-participation" in axes:
                supports.append("C08 visible after structured bridge")
                decisions.append("RR-03 should test pre-entry translation, not preparedness deficit")
            else:
                revision.append("C08 still weak; keep pre-entry axis under strict hold")
        elif corridor.startswith("RR-04"):
            if "C05-worksite-contact" in axes:
                supports.append("C05 visible after structured bridge")
                decisions.append("RR-04 remains a strong contact-point corridor")
            else:
                revision.append("C05 still weak; test C04/C01/C03 absorption")
        elif corridor.startswith("RR-05"):
            decisions.append("RR-05 remains overgeneralization brake")
    if is_hold_record:
        decisions.append("hold record: do not use as strengthening evidence without context closure")
    return {
        "structured_supports": sorted(set(supports)),
        "structured_revision_pressure": sorted(set(revision)),
        "next_decisions": sorted(set(decisions)),
    }


def make_record_bridges(notes: dict[str, Any], profiles: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    note_by_id = {note["record_id"]: note for note in notes["record_notes"]}
    followup_ids = set(notes["followup_queue"]["no_redacted_units"]) | set(notes["followup_queue"]["needs_context_reading_next"])
    bridges = []
    for rid in sorted(followup_ids):
        note = note_by_id[rid]
        profile = profiles[rid]
        combined_axes = redacted_axes(note) | set(profile["axis_counts"])
        status = corridor_status(
            note["corridors"],
            combined_axes,
            any(group.endswith("hold") or "hold" in group for group in note.get("groups", [])),
        )
        bridges.append(
            {
                "record_id": rid,
                "source_text_exported": False,
                "redacted_text_exported": False,
                "raw_original_opened": False,
                "corridors": note["corridors"],
                "groups": note["groups"],
                "redacted_unit_count": note["redacted_unit_count"],
                "structured_rows": profile["structured_rows"],
                "canonical_rows": profile["canonical_rows"],
                "multiselect_rows": profile["multiselect_rows"],
                "redacted_axes": sorted(redacted_axes(note)),
                "structured_axes": sorted(profile["axis_counts"]),
                "combined_axes": sorted(combined_axes),
                "canonical_concept_counts": profile["canonical_concept_counts"],
                "primary_frame_counts": profile["primary_frame_counts"],
                "field_refs_without_values": profile["field_refs_without_values"],
                "response_type_counts": profile["response_type_counts"],
                **status,
                "allowed_next_use": "context_reading_or_raw_local_only_if_needed_no_text_export",
            }
        )
    return bridges


def summarize(bridges: list[dict[str, Any]]) -> dict[str, Any]:
    axis_counts = Counter()
    recovered_no_redacted = 0
    raw_queue = []
    corridor_rows: dict[str, Counter] = defaultdict(Counter)
    for bridge in bridges:
        for axis in bridge["combined_axes"]:
            axis_counts[axis] += 1
        if bridge["redacted_unit_count"] == 0 and bridge["structured_axes"]:
            recovered_no_redacted += 1
        if not bridge["structured_axes"] and bridge["redacted_unit_count"] == 0:
            raw_queue.append(bridge["record_id"])
        for corridor in bridge["corridors"]:
            row = corridor_rows[corridor]
            row["records"] += 1
            if bridge["structured_supports"]:
                row["structured_supports"] += 1
            if bridge["structured_revision_pressure"]:
                row["structured_revision_pressure"] += 1
            if "RR-05" in corridor or any("hold record" in d for d in bridge["next_decisions"]):
                row["holds"] += 1
    return {
        "bridge_record_count": len(bridges),
        "no_redacted_records_recovered_by_structured": recovered_no_redacted,
        "raw_local_only_queue_after_structured_bridge": raw_queue,
        "raw_local_only_queue_count": len(raw_queue),
        "combined_axis_record_counts": dict(sorted(axis_counts.items())),
        "corridor_summary": [
            {"corridor": corridor, **dict(counter)}
            for corridor, counter in sorted(corridor_rows.items())
        ],
    }


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Structured Follow-Up Rereading Bridge",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: analysis_ready structured bridge / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        "redacted初回読解で残った穴を、analysis_readyのstructured/canonical/multiselect信号で再評価した。",
        "出力にはraw値、label text、自由記述、伏字段落を含めない。",
        "",
        "## Summary",
        f"- bridge records: {data['summary']['bridge_record_count']}",
        f"- no-redacted records recovered by structured signals: {data['summary']['no_redacted_records_recovered_by_structured']}",
        f"- records lacking structured coverage: {data['summary']['raw_local_only_queue_count']}",
        f"- source_text_exported: {data['source_text_exported']}",
        "",
        "## Structured Coverage Counts",
        "",
        "これは設問・projectionの被覆であり、構造確定ではない。Core改訂にはcontext readingでの絞り込みが必要である。",
        "",
        "| axis | records |",
        "|---|---:|",
    ]
    for axis, count in data["summary"]["combined_axis_record_counts"].items():
        lines.append(f"| {axis} | {count} |")
    lines.extend(["", "## Corridor Summary", "| corridor | records | structured supports | revision pressure | holds |", "|---|---:|---:|---:|---:|"])
    for row in data["summary"]["corridor_summary"]:
        lines.append(
            f"| {row['corridor']} | {row.get('records',0)} | {row.get('structured_supports',0)} | "
            f"{row.get('structured_revision_pressure',0)} | {row.get('holds',0)} |"
        )
    lines.extend(["", "## Core Consequence"])
    lines.extend(data["core_consequence"])
    lines.extend(["", "## Next Queue"])
    if data["summary"]["raw_local_only_queue_after_structured_bridge"]:
        for rid in data["summary"]["raw_local_only_queue_after_structured_bridge"]:
            lines.append(f"- raw local-only candidate: `{rid}`")
    else:
        lines.append("- raw local-only candidate is empty after structured bridge.")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    notes = load_redacted_notes()
    followup_ids = set(notes["followup_queue"]["no_redacted_units"]) | set(notes["followup_queue"]["needs_context_reading_next"])
    profiles = build_structured_profiles(followup_ids)
    bridges = make_record_bridges(notes, profiles)
    summary = summarize(bridges)
    data = {
        "artifact_id": "stage1-production-structured-followup-rereading-bridge-v0-2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "structured_followup_bridge_no_raw_no_text_export",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "label_text_exported": False,
        "source_artifacts": [str(REDACTED_NOTES.relative_to(ROOT))],
        "summary": summary,
        "core_consequence": [
            "- C07/C08はredacted lexicalだけでは弱かったが、structured/canonical projectionでは被覆がある。Coreから削る前にcontext readingで価値翻訳・入口前翻訳として本当に立つか確認する。",
            "- RR-04 C05はredactedとstructuredの双方で比較的強く、仕事接触点は次の深読みに進める価値が高い。",
            "- RR-05は引き続き過剰一般化を止めるための境界束であり、Core強化の根拠として使わない。",
            "- raw local-onlyへ進む前に、structuredで被覆できたrecordはredacted/structured統合文脈読解へ進める。",
        ],
        "record_bridges": bridges,
    }
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_JSONL.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in bridges), encoding="utf-8")
    OUT_MD.write_text(make_md(data), encoding="utf-8")
    print(f"bridge_records={len(bridges)}")
    print(f"raw_queue_after_structured={summary['raw_local_only_queue_count']}")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
