#!/usr/bin/env python3
"""Context-read RR-05 as brake/counterexample layer without exporting text."""

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

CORRIDOR = "RR-05-residual-hold-and-counterexamples"
PREFIX = "stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23"

LEXICONS = {
    "health_time": ["体調", "疲労", "疲れ", "通院", "治療", "休", "睡眠", "症状", "病状", "悪化", "回復", "体力", "健康"],
    "life_security": ["収入", "生活", "給与", "賃金", "年金", "手当", "制度", "保障", "経済"],
    "evaluation_value": ["評価", "処遇", "昇進", "キャリア", "待遇", "役割", "責任", "満足", "やりがい", "不満"],
    "prework_entry": ["応募", "採用", "求人", "面接", "就職活動", "求職", "訓練", "実習", "再就職"],
    "body_or_function_boundary": ["身体", "機能", "障害", "痛", "しびれ", "視覚", "聴覚", "精神", "知的"],
    "support_bridge": ["支援", "相談", "上司", "同僚", "職場", "医師", "ハローワーク", "福祉"],
    "nonwork_or_low_context": ["わからない", "不明", "働きたく", "希望しない", "無理"],
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
    hold_roles = []
    if "nonwork_or_low_context" in text_types or "low_context" in group or "nonwork_orientation" in group:
        hold_roles.append("hard brake against readiness-deficit or nonwork-overinterpretation")
    if "body_or_function_boundary" in text_types or "health_body_boundary" in group:
        hold_roles.append("body/function signal boundary; do not convert diagnosis or impairment into support logic")
    if "health_time" in text_types and "evaluation_value" in text_types:
        hold_roles.append("health-time/evaluation absorption check")
    if "health_time" in text_types and "life_security" in text_types:
        hold_roles.append("health-time/life-security residual check")
    if "prework_entry" in text_types:
        hold_roles.append("prework/entry residual check")
    if "support_bridge" in text_types:
        hold_roles.append("support bridge is present but remains unclosed")
    if "evaluation_value" in text_types and "health_time" not in text_types:
        hold_roles.append("value/evaluation signal without health-time closure")
    if not hold_roles and field_types:
        hold_roles.append("structured field coverage exists but no redacted residual role is closed")
    if not hold_roles:
        hold_roles.append("low-context residual hold")

    if "hard brake" in " ".join(hold_roles):
        action = "keep_as_hard_boundary_brake"
    elif "residual check" in " ".join(hold_roles):
        action = "keep_as_route_specific_countercheck"
    else:
        action = "keep_as_general_residual_hold"
    return {
        "hold_roles": sorted(set(hold_roles)),
        "context_reading_action": action,
        "context_supports": [],
        "context_revision_pressure": [
            "RR-05 records must not be added to support counts; use them to test over-smooth Core claims."
        ],
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
    hold_role_counts = Counter()
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
        hold_role_counts.update(classification["hold_roles"])
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
                    "support adequacy judgment",
                    "readiness deficit judgment",
                    "diagnosis-to-accommodation inference",
                    "work capacity judgment",
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
        "hold_role_counts": dict(sorted(hold_role_counts.items())),
        "action_counts": dict(sorted(action_counts.items())),
        "core_reading": [
            "RR-05 is not a weak evidence pile; it is the deliberate brake layer for C01/C06/C07/C08 overclaim control.",
            "Residual records protect Falcon from turning health condition, impairment, satisfaction, nonwork, or preparation signals into single-cause support logic.",
            "Use these records as route-specific counterchecks after a Core route begins to sound complete.",
        ],
        "record_context_notes": rows,
    }


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 CR-05 Residual Hold Context Reading",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: context reading / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        f"Corridor: `{data['corridor']}`",
        "",
        "出力には本文・伏字段落・field値を含めない。文脈型とhold roleだけを残す。",
        "",
        "## Summary",
        f"- records: {data['record_count']}",
        f"- raw_original_opened: {data['raw_original_opened']}",
        f"- source_text_exported: {data['source_text_exported']}",
        "",
        "## Redacted Context Type Counts",
        "",
        "| context type | records |",
        "|---|---:|",
    ]
    for ctype, count in data["redacted_context_type_record_counts"].items():
        lines.append(f"| {ctype} | {count} |")
    lines.extend(["", "## Hold Role Counts", "| hold role | records |", "|---|---:|"])
    for role, count in data["hold_role_counts"].items():
        lines.append(f"| {role} | {count} |")
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
