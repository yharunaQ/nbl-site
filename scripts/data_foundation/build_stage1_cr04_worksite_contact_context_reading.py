#!/usr/bin/env python3
"""Context-read RR-04 worksite-contact records without exporting text."""

from __future__ import annotations

from collections import Counter, defaultdict
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

WORKSET = OUT_DIR / "stage1-production-raw-redacted-rereading-workset-manifest-v0-2026-05-23.json"
REDACTED_NOTES = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json"
STRUCTURED_BRIDGE = OUT_DIR / "stage1-production-structured-followup-rereading-bridge-v0-2026-05-23.json"

REDACTED_SURFACES = {
    "employment_survey_3000": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    "nanbyo_survey_4000": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
}

OUT_JSON = OUT_DIR / "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.json"
OUT_MD = OUT_DIR / "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md"
OUT_JSONL = OUT_DIR / "stage1-production-cr04-worksite-contact-context-reading-records-v0-2026-05-23.jsonl"


CONTACT_LEXICONS = {
    "mobility_commute": ["通勤", "移動", "歩", "交通", "階段", "車", "駅", "外出"],
    "task_workflow": ["作業", "業務", "仕事内容", "仕事量", "手順", "配置", "職務", "役割"],
    "body_posture_energy": ["姿勢", "立", "座", "疲", "痛", "体力", "身体", "手", "足"],
    "access_rest_safety": ["設備", "安全", "危険", "休憩", "トイレ", "時間", "場所", "環境"],
    "information_contact": ["指示", "確認", "聞", "見", "会議", "情報", "コミュニケーション", "説明"],
    "support_retranslation": ["支援", "相談", "助言", "ジョブコーチ", "上司", "同僚", "職場"],
    "evaluation_value": ["評価", "責任", "成果", "処遇", "やりがい", "満足", "将来"],
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


def rr04_records(workset: dict[str, Any]) -> list[dict[str, str]]:
    for ws in workset["worksets"]:
        if ws["corridor"] == "RR-04-worksite-contact-minority-window":
            rows = []
            for group, ids in ws["record_groups"].items():
                for rid in ids:
                    rows.append({"record_id": rid, "group": group})
            return rows
    raise RuntimeError("RR-04 not found")


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


def detect_contact_types(text: str, field_refs: list[str]) -> dict[str, int]:
    joined = text + "\n" + "\n".join(field_refs)
    out = {}
    for ctype, terms in CONTACT_LEXICONS.items():
        hits = sum(1 for term in terms if term in joined)
        if hits:
            out[ctype] = hits
    return out


def classify_context(contact_counts: dict[str, int], redacted_axes: set[str], structured_axes: set[str], group: str) -> dict[str, Any]:
    types = set(contact_counts)
    supports = []
    revision = []
    if len(types) >= 2 and "C05-worksite-contact" in (redacted_axes | structured_axes):
        supports.append("multi-surface contact point signal")
    if "task_workflow" in types and "support_retranslation" in types:
        supports.append("support appears as work-procedure retranslation candidate")
    if "mobility_commute" in types or "access_rest_safety" in types:
        supports.append("physical/access contact point candidate")
    if "information_contact" in types:
        supports.append("information-to-work-procedure contact candidate")
    if "evaluation_value" in types:
        supports.append("contact point may reach value/evaluation translation")
    if not types:
        revision.append("no contact-type signal in redacted/structured surfaces")
    if types == {"support_retranslation"}:
        revision.append("support signal present without clear work-contact decomposition")
    if "boundary" in group or "uncertain" in group:
        revision.append("boundary/uncertain group; use as test record, not strengthening evidence")
    return {
        "context_supports": sorted(set(supports)),
        "context_revision_pressure": sorted(set(revision)),
        "context_reading_action": (
            "advance_as_contact_point_context_candidate"
            if supports and not (types == {"support_retranslation"})
            else "keep_for_boundary_or_structured_raw_check"
        ),
    }


def main() -> None:
    workset = load(WORKSET)
    redacted = load(REDACTED_NOTES)
    structured = load(STRUCTURED_BRIDGE)
    rr04 = rr04_records(workset)
    record_ids = {row["record_id"] for row in rr04}
    redacted_texts = load_redacted_text_internal(record_ids)
    redacted_by_id = {row["record_id"]: row for row in redacted["record_notes"]}
    structured_by_id = {row["record_id"]: row for row in structured["record_bridges"]}
    rows = []
    type_counts = Counter()
    action_counts = Counter()
    for item in rr04:
        rid = item["record_id"]
        red_note = redacted_by_id.get(rid, {})
        struct_note = structured_by_id.get(rid, {})
        red_axes = {signal["axis"] for signal in red_note.get("scima_fchma_signals_without_quotes", [])}
        structured_axes = set(struct_note.get("structured_axes", []))
        contact_counts = detect_contact_types(
            redacted_texts.get(rid, ""),
            struct_note.get("field_refs_without_values", []) + red_note.get("field_refs_used", []),
        )
        for ctype in contact_counts:
            type_counts[ctype] += 1
        classification = classify_context(contact_counts, red_axes, structured_axes, item["group"])
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
                "redacted_unit_available": bool(redacted_texts.get(rid)),
                "contact_type_counts_without_quotes": contact_counts,
                "redacted_axes": sorted(red_axes),
                "structured_axes": sorted(structured_axes),
                **classification,
                "not_allowed": [
                    "support adequacy judgment",
                    "work capacity judgment",
                    "condition-to-accommodation lookup",
                    "source/support validity judgment",
                    "promotion",
                ],
            }
        )

    data = {
        "artifact_id": "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "cr04_context_reading_no_text_export_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "source_artifacts": [
            str(WORKSET.relative_to(ROOT)),
            str(REDACTED_NOTES.relative_to(ROOT)),
            str(STRUCTURED_BRIDGE.relative_to(ROOT)),
        ],
        "record_count": len(rows),
        "contact_type_record_counts": dict(sorted(type_counts.items())),
        "action_counts": dict(sorted(action_counts.items())),
        "core_reading": [
            "RR-04/C05 can be read as work-contact decomposition rather than equipment or disability-category lookup.",
            "The strongest contact forms are support retranslation, task/workflow, access/rest/safety, and information contact.",
            "Boundary/uncertain records remain brakes; they should not inflate support counts.",
        ],
        "record_context_notes": rows,
    }
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_JSONL.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows), encoding="utf-8")
    OUT_MD.write_text(make_md(data), encoding="utf-8")
    print(f"cr04_records={len(rows)}")
    print(f"actions={dict(action_counts)}")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 CR-04 Worksite Contact Context Reading",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: RR-04 context reading / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        "RR-04/C05のrecordを、仕事接触点の分解として読めるか確認した。",
        "redacted本文は内部読解のみで、出力には本文・伏字段落・field値を含めない。",
        "",
        "## Summary",
        f"- records: {data['record_count']}",
        f"- raw_original_opened: {data['raw_original_opened']}",
        f"- source_text_exported: {data['source_text_exported']}",
        "",
        "## Contact Type Counts",
        "| contact type | records |",
        "|---|---:|",
    ]
    for ctype, count in data["contact_type_record_counts"].items():
        lines.append(f"| {ctype} | {count} |")
    lines.extend(["", "## Action Counts", "| action | records |", "|---|---:|"])
    for action, count in data["action_counts"].items():
        lines.append(f"| {action} | {count} |")
    lines.extend(["", "## Core Reading"])
    for item in data["core_reading"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
