#!/usr/bin/env python3
"""Context-read RR-02 and RR-03 without exporting text or field values."""

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

OUTPUTS = {
    "RR-02-quality-participation-value-translation": {
        "prefix": "stage1-production-cr02-quality-value-context-reading-v0-2026-05-23",
        "title": "Stage 1 CR-02 Quality / Value Translation Context Reading",
        "lexicons": {
            "role_or_work_value": ["役割", "責任", "成果", "技能", "能力", "仕事", "業務", "職務"],
            "evaluation_or_treatment": ["評価", "処遇", "賃金", "給与", "昇進", "キャリア", "待遇"],
            "future_outlook": ["将来", "継続", "定着", "転職", "退職", "見通し", "希望"],
            "satisfaction_only_risk": ["満足", "やりがい", "不満"],
            "conditional_performance": ["配慮", "支援", "体調", "疲労", "障害", "休", "仕事量"],
            "support_retranslation": ["支援", "相談", "上司", "同僚", "ジョブコーチ", "職場"],
        },
    },
    "RR-03-prework-entry-sequence": {
        "prefix": "stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23",
        "title": "Stage 1 CR-03 Prework / Entry Context Reading",
        "lexicons": {
            "entry_action": ["応募", "採用", "求人", "面接", "就職活動", "求職", "就職"],
            "prework_training": ["訓練", "実習", "職場見学", "体験", "講座", "練習", "資格", "学習"],
            "life_rhythm_stamina": ["生活リズム", "日中", "体力", "疲", "通院", "治療", "健康", "睡眠"],
            "support_bridge": ["支援", "相談", "ハローワーク", "職業センター", "家族", "医師", "福祉"],
            "self_outlook": ["自信", "希望", "不安", "将来", "できる", "能力"],
            "nonwork_or_low_context_brake": ["わからない", "不明", "働きたく", "希望しない", "無理"],
        },
    },
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


def workset_records(workset: dict[str, Any], corridor: str) -> list[dict[str, str]]:
    for ws in workset["worksets"]:
        if ws["corridor"] == corridor:
            rows = []
            for group, ids in ws["record_groups"].items():
                for rid in ids:
                    rows.append({"record_id": rid, "group": group})
            return rows
    raise RuntimeError(f"{corridor} not found")


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


def detect_types(text: str, lexicons: dict[str, list[str]]) -> dict[str, int]:
    out = {}
    for ctype, terms in lexicons.items():
        hits = sum(1 for term in terms if term in text)
        if hits:
            out[ctype] = hits
    return out


def redacted_axes(note: dict[str, Any]) -> set[str]:
    return {signal["axis"] for signal in note.get("scima_fchma_signals_without_quotes", [])}


def classify_rr02(text_types: set[str], field_types: set[str], group: str) -> dict[str, Any]:
    supports = []
    revision = []
    if {"role_or_work_value", "conditional_performance"} <= text_types:
        supports.append("conditional performance can be tested as work-value translation")
    if {"evaluation_or_treatment", "role_or_work_value"} & text_types and "support_retranslation" in text_types:
        supports.append("support may retranslate performance into role/evaluation context")
    if "future_outlook" in text_types and ("role_or_work_value" in text_types or "evaluation_or_treatment" in text_types):
        supports.append("future outlook connects to role/evaluation rather than satisfaction alone")
    if text_types == {"satisfaction_only_risk"} or ("satisfaction_only_risk" in text_types and len(text_types) == 1):
        revision.append("satisfaction-only signal; do not treat as C07 core")
    if "blind_spot_hold" in group:
        revision.append("blind-spot hold; use as boundary before strengthening C07")
    if not supports:
        if field_types:
            revision.append("structured field coverage exists but redacted context has not closed value-translation")
        else:
            revision.append("value-translation not closed by context type")
    return {
        "context_supports": sorted(set(supports)),
        "context_revision_pressure": sorted(set(revision)),
        "context_reading_action": (
            "advance_as_value_translation_context_candidate"
            if supports
            else "structured_coverage_needs_context_confirmation"
            if field_types and "blind_spot_hold" not in group
            else "keep_for_boundary_or_adjacent_axis_check"
        ),
    }


def classify_rr03(text_types: set[str], field_types: set[str], group: str) -> dict[str, Any]:
    supports = []
    revision = []
    if {"entry_action", "prework_training"} <= text_types:
        supports.append("prework activity can be tested as entry translation")
    if {"life_rhythm_stamina", "support_bridge"} <= text_types:
        supports.append("life/stamina and support bridge can be tested as entry sequencing")
    if "self_outlook" in text_types and ("entry_action" in text_types or "prework_training" in text_types):
        supports.append("self-outlook connects to entry/prework context")
    if "nonwork_or_low_context_brake" in text_types or "low_context_hold" in group:
        revision.append("low-context/nonwork signal; keep ethical and overclaim brake")
    if not supports:
        if field_types:
            revision.append("structured field coverage exists but redacted context has not closed pre-entry translation")
        else:
            revision.append("pre-entry translation not closed by context type")
    return {
        "context_supports": sorted(set(supports)),
        "context_revision_pressure": sorted(set(revision)),
        "context_reading_action": (
            "advance_as_prework_entry_context_candidate"
            if supports
            else "structured_coverage_needs_context_confirmation"
            if field_types and "low_context_hold" not in group
            else "keep_for_hold_or_adjacent_axis_check"
        ),
    }


def classify(corridor: str, text_types: set[str], field_types: set[str], group: str) -> dict[str, Any]:
    if corridor.startswith("RR-02"):
        return classify_rr02(text_types, field_types, group)
    if corridor.startswith("RR-03"):
        return classify_rr03(text_types, field_types, group)
    raise RuntimeError(corridor)


def build_corridor(corridor: str, workset: dict[str, Any], redacted: dict[str, Any]) -> dict[str, Any]:
    config = OUTPUTS[corridor]
    rows_meta = workset_records(workset, corridor)
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
        text_types_counts = detect_types(texts.get(rid, ""), config["lexicons"])
        field_types_counts = detect_types("\n".join(refs.get(rid, [])), config["lexicons"])
        combined_types_counts = dict(Counter(text_types_counts) + Counter(field_types_counts))
        for t in text_types_counts:
            redacted_type_counts[t] += 1
        for t in field_types_counts:
            structured_field_type_counts[t] += 1
        for t in combined_types_counts:
            combined_type_counts[t] += 1
        classification = classify(corridor, set(text_types_counts), set(field_types_counts), item["group"])
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
                    "support adequacy judgment",
                    "readiness deficit judgment",
                    "career quality final judgment",
                    "work capacity judgment",
                    "promotion",
                ],
            }
        )
    data = {
        "artifact_id": config["prefix"],
        "lane": "Falcon / Falcon Lab",
        "status": "context_reading_no_text_export_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "corridor": corridor,
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "record_count": len(rows),
        "redacted_context_type_record_counts": dict(sorted(redacted_type_counts.items())),
        "structured_field_context_type_record_counts": dict(sorted(structured_field_type_counts.items())),
        "combined_context_type_record_counts": dict(sorted(combined_type_counts.items())),
        "action_counts": dict(sorted(action_counts.items())),
        "core_reading": core_reading(corridor),
        "record_context_notes": rows,
    }
    prefix = config["prefix"]
    (OUT_DIR / f"{prefix}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / f"{prefix}-records.jsonl").write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows), encoding="utf-8")
    (OUT_DIR / f"{prefix}.md").write_text(make_md(config["title"], data), encoding="utf-8")
    return data


def core_reading(corridor: str) -> list[str]:
    if corridor.startswith("RR-02"):
        return [
            "C07 should remain in Core only as value-translation under context confirmation, not as satisfaction or work-status coverage.",
            "The route is useful when conditional performance connects to role, evaluation, treatment, future outlook, or support retranslation.",
            "Blind-spot records remain brakes and should not inflate Core confidence.",
        ]
    return [
        "C08 should remain in Core only as pre-entry translation under context confirmation, not as preparedness deficit.",
        "The route is useful when training, life rhythm, stamina, support bridge, and entry action connect into a sequence.",
        "Low-context and nonwork-orientation records remain ethical/overclaim brakes.",
    ]


def make_md(title: str, data: dict[str, Any]) -> str:
    lines = [
        f"# {title}",
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
    workset = load(WORKSET)
    redacted = load(REDACTED_NOTES)
    outputs = []
    for corridor in OUTPUTS:
        outputs.append(build_corridor(corridor, workset, redacted))
    for data in outputs:
        print(data["artifact_id"], "records=", data["record_count"], "actions=", data["action_counts"])


if __name__ == "__main__":
    main()
