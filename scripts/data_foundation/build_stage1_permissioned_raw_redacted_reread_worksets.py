#!/usr/bin/env python3
"""Build RR-01..RR-05 worksets and redacted record-level notes.

This script reads redaction manifests/flags and redacted free-text units for
the bounded Stage 1 rereading corridors. It never writes raw or redacted text
to derived outputs. The output is limited to non-quoted structural signals.
"""

from __future__ import annotations

from collections import Counter, defaultdict
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

REDACTED_SURFACES = {
    "employment_survey_3000": {
        "manifest": ROOT / "data/staging/anonymized/employment_survey_3000/v0/redaction_manifest.json",
        "flags": ROOT / "data/staging/anonymized/employment_survey_3000/v0/redaction_review_flags.jsonl",
        "redacted_units": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    },
    "nanbyo_survey_4000": {
        "manifest": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/redaction_manifest.json",
        "flags": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/redaction_review_flags.jsonl",
        "redacted_units": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
    },
}

OUT_MANIFEST_JSON = OUT_DIR / "stage1-production-raw-redacted-rereading-workset-manifest-v0-2026-05-23.json"
OUT_MANIFEST_MD = OUT_DIR / "stage1-production-raw-redacted-rereading-workset-manifest-v0-2026-05-23.md"
OUT_NOTES_JSON = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json"
OUT_NOTES_JSONL = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.jsonl"
OUT_NOTES_MD = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.md"


WORKSETS: list[dict[str, Any]] = [
    {
        "batch_id": "RR-B1",
        "corridor": "RR-01-health-time-life-security",
        "purpose": "C06が背景事情ではなく、健康時間・休む・戻る・選び直す自由度を実際に閉じているか確認する。",
        "hold_condition": "生活保障が主に背景属性または困難量の代理に見える場合、C06単独の厚み付けを止める。",
        "record_groups": {
            "primary": [
                "employment_survey_3000:03105",
                "employment_survey_3000:03176",
                "employment_survey_3000:04082",
                "employment_survey_3000:04134",
                "employment_survey_3000:05061",
                "employment_survey_3000:07038",
            ],
            "boundary": [
                "employment_survey_3000:01023",
                "employment_survey_3000:02027",
                "employment_survey_3000:02029",
                "employment_survey_3000:02031",
                "employment_survey_3000:02043",
                "employment_survey_3000:03039",
            ],
            "cross_check": [
                "employment_survey_3000:01005",
                "employment_survey_3000:01009",
                "employment_survey_3000:01013",
                "nanbyo_survey_4000:00002",
            ],
        },
    },
    {
        "batch_id": "RR-B2",
        "corridor": "RR-02-quality-participation-value-translation",
        "purpose": "C07が満足度や上昇志向ではなく、条件付き遂行を役割・評価・処遇・将来見通しへ翻訳する構造か確認する。",
        "hold_condition": "C07信号がC04/C06/C03に吸収される場合、C07はquality modifierとして保持する。",
        "record_groups": {
            "current_participation_quality": [
                "employment_survey_3000:01009",
                "employment_survey_3000:01019",
                "employment_survey_3000:01021",
                "employment_survey_3000:01032",
                "employment_survey_3000:01034",
                "employment_survey_3000:01037",
            ],
            "translation_support_bridge": [
                "employment_survey_3000:01002",
                "employment_survey_3000:01003",
                "employment_survey_3000:01005",
                "employment_survey_3000:01007",
                "employment_survey_3000:01010",
                "employment_survey_3000:01011",
            ],
            "blind_spot_hold": [
                "employment_survey_3000:01016",
                "employment_survey_3000:01047",
                "employment_survey_3000:01048",
                "employment_survey_3000:02014",
                "employment_survey_3000:02018",
                "employment_survey_3000:03006",
            ],
        },
    },
    {
        "batch_id": "RR-B3",
        "corridor": "RR-03-prework-entry-sequence",
        "purpose": "C08を準備不足へ戻さず、生活・体力・訓練・支援接続を入口条件へ翻訳する前段自由度として確認する。",
        "hold_condition": "C08が過剰分割に見える場合、C02/C03/C06のpre-entry modifierへ戻す。",
        "record_groups": {
            "first_entry": [
                "employment_survey_3000:01003",
                "employment_survey_3000:01043",
                "employment_survey_3000:01078",
                "employment_survey_3000:01085",
                "employment_survey_3000:02040",
                "employment_survey_3000:02044",
            ],
            "past_work_to_rebuilding": [
                "employment_survey_3000:01007",
                "employment_survey_3000:01011",
                "employment_survey_3000:01022",
                "employment_survey_3000:01024",
                "employment_survey_3000:01026",
                "employment_survey_3000:01028",
            ],
            "transition_bridge": [
                "employment_survey_3000:03073",
                "employment_survey_3000:03074",
                "employment_survey_3000:03112",
                "employment_survey_3000:03191",
                "employment_survey_3000:03213",
                "employment_survey_3000:04031",
            ],
            "low_context_hold": [
                "employment_survey_3000:01027",
                "employment_survey_3000:04096",
                "employment_survey_3000:04097",
                "employment_survey_3000:04101",
                "employment_survey_3000:04171",
                "employment_survey_3000:04214",
            ],
        },
    },
    {
        "batch_id": "RR-B4",
        "corridor": "RR-04-worksite-contact-minority-window",
        "purpose": "C05/SG-06の少数窓を、仕事接触点の別形態として戻せるか確認する。",
        "hold_condition": "C05 pureが大半C04/C01/C03へ吸収される場合、C05Pはcontact modifierとして保持する。",
        "record_groups": {
            "c05_pure_broad": [
                "employment_survey_3000:01032",
                "employment_survey_3000:01054",
                "employment_survey_3000:01062",
                "employment_survey_3000:01082",
                "employment_survey_3000:03004",
                "employment_survey_3000:03019",
            ],
            "c05_partial_residual": [
                "employment_survey_3000:01021",
                "employment_survey_3000:01091",
                "employment_survey_3000:03027",
                "employment_survey_3000:03029",
                "employment_survey_3000:03031",
                "employment_survey_3000:03032",
            ],
            "boundary_uncertain": [
                "employment_survey_3000:04073",
                "employment_survey_3000:12054",
                "employment_survey_3000:05093",
                "employment_survey_3000:28005",
                "employment_survey_3000:29060",
            ],
            "sg06_search_anchors": [
                "employment_survey_3000:13127",
                "nanbyo_survey_4000:03195",
                "employment_survey_3000:04367",
                "nanbyo_survey_4000:03795",
                "employment_survey_3000:04255",
                "nanbyo_survey_4000:00030",
                "employment_survey_3000:04343",
                "nanbyo_survey_4000:01416",
            ],
        },
    },
    {
        "batch_id": "RR-B5",
        "corridor": "RR-05-residual-hold-and-counterexamples",
        "purpose": "厚みを増やすのではなく、上位構造を反証・修正する境界例として使えるか確認する。",
        "hold_condition": "直接anchor、direct closure、governed outcomeが増えない場合、familyを明示holdへ戻す。",
        "record_groups": {
            "c06_health_time_residual": [
                "employment_survey_3000:01023",
                "employment_survey_3000:02027",
                "employment_survey_3000:02029",
                "employment_survey_3000:02031",
                "employment_survey_3000:02043",
                "employment_survey_3000:03039",
            ],
            "c06_c07_evaluation_residual": [
                "employment_survey_3000:01016",
                "employment_survey_3000:01048",
                "employment_survey_3000:02006",
                "employment_survey_3000:02012",
                "employment_survey_3000:02014",
                "employment_survey_3000:02045",
            ],
            "c07_health_time_absorption": [
                "employment_survey_3000:03159",
                "employment_survey_3000:04169",
                "employment_survey_3000:06006",
                "employment_survey_3000:06028",
                "employment_survey_3000:09013",
                "employment_survey_3000:10020",
            ],
            "c08_health_body_boundary": [
                "employment_survey_3000:19046",
                "nanbyo_survey_4000:00074",
                "nanbyo_survey_4000:00110",
                "nanbyo_survey_4000:00134",
                "nanbyo_survey_4000:00178",
                "nanbyo_survey_4000:00194",
            ],
            "c08_nonwork_orientation_boundary": [
                "employment_survey_3000:08067",
                "employment_survey_3000:10095",
                "employment_survey_3000:21042",
            ],
            "c08_low_context_hold": [
                "employment_survey_3000:01027",
                "employment_survey_3000:04096",
                "employment_survey_3000:04097",
                "employment_survey_3000:04101",
                "employment_survey_3000:04171",
                "employment_survey_3000:04214",
            ],
        },
    },
]


AXIS_LEXICONS: dict[str, list[str]] = {
    "C01-health-time": ["体調", "疲労", "通院", "治療", "病院", "休", "痛", "薬", "睡眠", "体力", "入院", "症状"],
    "C02-entry-disclosure-translation": ["開示", "説明", "伝え", "理解", "面接", "応募", "採用", "求人", "履歴"],
    "C03-support-continuity": ["支援", "相談", "ハローワーク", "職業センター", "ジョブコーチ", "家族", "医師", "福祉", "主治医"],
    "C04-information-participation": ["情報", "指示", "会議", "聞", "見", "書", "読", "コミュニケーション", "手話", "筆談", "確認"],
    "C05-worksite-contact": ["作業", "職場", "設備", "通勤", "移動", "階段", "トイレ", "休憩", "姿勢", "安全", "仕事量", "配置", "作業内容"],
    "C06-life-security": ["収入", "給料", "賃金", "生活", "家計", "制度", "年金", "医療費", "休職", "雇用形態", "保障"],
    "C07-quality-participation": ["評価", "昇進", "処遇", "やりがい", "役割", "責任", "技能", "キャリア", "満足", "将来"],
    "C08-prework-participation": ["訓練", "実習", "生活リズム", "日中", "求職", "再就職", "準備", "自信", "就職活動"],
}


def load_manifest(dataset_id: str) -> dict[str, Any]:
    path = REDACTED_SURFACES[dataset_id]["manifest"]
    data = json.loads(path.read_text(encoding="utf-8"))
    return {
        "dataset_id": data.get("dataset_id"),
        "status": data.get("status"),
        "records": data.get("records"),
        "records_changed": data.get("records_changed"),
        "residual_flagged_records": data.get("residual_flagged_records"),
        "raw_text_exported": data.get("raw_text_exported"),
        "redacted_text_public_safe": data.get("redacted_text_public_safe"),
        "redaction_type_counts": data.get("redaction_type_counts", {}),
        "residual_obvious_identifier_pattern_count": len(data.get("residual_obvious_identifier_pattern_counts", {})),
    }


def count_flag_lines(dataset_id: str) -> int:
    path = REDACTED_SURFACES[dataset_id]["flags"]
    if not path.exists():
        return -1
    return sum(1 for line in path.read_text(encoding="utf-8").splitlines() if line.strip())


def split_record_id(record_id: str) -> tuple[str, str]:
    dataset_id, local_id = record_id.split(":", 1)
    return dataset_id, str(int(local_id))


def normalize_respondent_id(value: Any) -> str | None:
    text = str(value or "").strip()
    if text.isdigit():
        return str(int(text))
    return None


def all_workset_records() -> dict[str, dict[str, list[str]]]:
    records: dict[str, dict[str, list[str]]] = {}
    for workset in WORKSETS:
        for group, ids in workset["record_groups"].items():
            for record_id in ids:
                records.setdefault(record_id, {"batches": [], "groups": [], "corridors": []})
                records[record_id]["batches"].append(workset["batch_id"])
                records[record_id]["groups"].append(group)
                records[record_id]["corridors"].append(workset["corridor"])
    return records


def load_redacted_units(target_records: set[str]) -> dict[str, list[dict[str, Any]]]:
    by_record: dict[str, list[dict[str, Any]]] = defaultdict(list)
    targets_by_dataset: dict[str, set[str]] = defaultdict(set)
    for record_id in target_records:
        dataset_id, respondent_id = split_record_id(record_id)
        targets_by_dataset[dataset_id].add(respondent_id)

    for dataset_id, respondent_ids in targets_by_dataset.items():
        path = REDACTED_SURFACES[dataset_id]["redacted_units"]
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                if not line.strip():
                    continue
                row = json.loads(line)
                respondent_id = normalize_respondent_id(row.get("respondent_id"))
                if respondent_id is None:
                    continue
                if respondent_id in respondent_ids:
                    record_id = f"{dataset_id}:{int(respondent_id):05d}"
                    by_record[record_id].append(row)
    return dict(by_record)


def detect_axes(text: str) -> dict[str, dict[str, Any]]:
    axes: dict[str, dict[str, Any]] = {}
    for axis, terms in AXIS_LEXICONS.items():
        hits = [term for term in terms if term in text]
        if hits:
            axes[axis] = {
                "signal_present": True,
                "matched_signal_families": sorted({term_family(term) for term in hits}),
                "hit_count": len(hits),
            }
    return axes


def term_family(term: str) -> str:
    for axis, terms in AXIS_LEXICONS.items():
        if term in terms:
            return axis.split("-", 1)[0]
    return "unknown"


def structural_assessment(corridors: list[str], axes: dict[str, Any], unit_count: int) -> dict[str, Any]:
    axis_set = set(axes)
    supports: list[str] = []
    revision: list[str] = []
    holds: list[str] = []
    if unit_count == 0:
        return {
            "supports_current_structure": [],
            "counter_or_revision_pressure": ["no_redacted_free_text_units_found"],
            "hold_or_stop_reason": "analysis_ready_structured_or_raw_field_lookup_needed",
        }
    for corridor in corridors:
        if corridor.startswith("RR-01"):
            if {"C01-health-time", "C06-life-security"} <= axis_set:
                supports.append("health-time and life-security co-signal present without quotation")
            elif "C01-health-time" in axis_set and "C06-life-security" not in axis_set:
                revision.append("health-time signal present but life-security signal not detected in redacted text")
            elif "C06-life-security" in axis_set:
                revision.append("life-security signal present without clear health-time signal in redacted text")
        elif corridor.startswith("RR-02"):
            if "C07-quality-participation" in axis_set:
                supports.append("quality/value signal present; test relation to evaluation, role, support, health-time, or worksite contact")
            else:
                revision.append("quality/value signal not detected; C07 may depend on structured fields or be absorbed by adjacent axes")
        elif corridor.startswith("RR-03"):
            if "C08-prework-participation" in axis_set:
                supports.append("prework/entry signal present; test whether it translates to job conditions")
            else:
                revision.append("prework signal not detected; C08 may be low-context or structured-field driven")
        elif corridor.startswith("RR-04"):
            if "C05-worksite-contact" in axis_set:
                supports.append("worksite-contact signal present; test whether it is equipment-only or contact-point redesign")
            else:
                revision.append("worksite-contact signal not detected in redacted text")
        elif corridor.startswith("RR-05"):
            holds.append("residual hold record; use to limit overgeneralization, not to strengthen the route by default")
    return {
        "supports_current_structure": sorted(set(supports)),
        "counter_or_revision_pressure": sorted(set(revision)),
        "hold_or_stop_reason": "; ".join(sorted(set(holds))) or None,
    }


def build_record_note(record_id: str, meta: dict[str, list[str]], units: list[dict[str, Any]]) -> dict[str, Any]:
    text = "\n".join((unit.get("redacted_unit_text") or "") for unit in units)
    axes = detect_axes(text)
    field_counter = Counter((unit.get("raw_name") or "unknown") for unit in units)
    question_counter = Counter((unit.get("question_group") or "unknown") for unit in units)
    redaction_statuses = sorted({unit.get("redaction_status") for unit in units if unit.get("redaction_status")})
    redaction_types = sorted({r for unit in units for r in unit.get("redaction_types", [])})
    assessment = structural_assessment(meta["corridors"], axes, len(units))
    return {
        "record_id": record_id,
        "reading_surface": "redacted_text_internal_only",
        "source_text_exported": False,
        "pii_or_sensitive_text_exported": False,
        "redacted_text_exported": False,
        "batches": sorted(set(meta["batches"])),
        "groups": sorted(set(meta["groups"])),
        "corridors": sorted(set(meta["corridors"])),
        "redacted_unit_count": len(units),
        "field_refs_used": sorted(field_counter),
        "question_groups_used": sorted(question_counter),
        "redaction_statuses": redaction_statuses,
        "redaction_types_present": redaction_types,
        "scima_fchma_signals_without_quotes": [
            {
                "axis": axis,
                "signal": "lexical structural signal present in redacted row-level text",
                "confidence": "low",
                "limit": "deterministic lexical scan only; does not decide source validity, support validity, or final structure",
                "hit_count": payload["hit_count"],
            }
            for axis, payload in sorted(axes.items())
        ],
        "icf_contacts": infer_icf_contacts(set(axes)),
        **assessment,
        "allowed_next_use": "derived_note_only_needs_human_or_llm_context_reading_before_core_revision",
    }


def infer_icf_contacts(axis_set: set[str]) -> list[str]:
    contacts = set()
    if "C01-health-time" in axis_set:
        contacts.update(["body_functions", "activities", "participation"])
    if "C02-entry-disclosure-translation" in axis_set:
        contacts.update(["participation", "environmental_factors"])
    if "C03-support-continuity" in axis_set:
        contacts.update(["environmental_factors", "participation"])
    if "C04-information-participation" in axis_set:
        contacts.update(["activities", "participation", "environmental_factors"])
    if "C05-worksite-contact" in axis_set:
        contacts.update(["activities", "participation", "environmental_factors"])
    if "C06-life-security" in axis_set:
        contacts.update(["environmental_factors", "participation"])
    if "C07-quality-participation" in axis_set:
        contacts.update(["participation", "environmental_factors"])
    if "C08-prework-participation" in axis_set:
        contacts.update(["activities", "participation", "environmental_factors"])
    return sorted(contacts)


def make_manifest_md(manifest: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Raw/Redacted Rereading Workset Manifest",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: workset manifest / redacted safety check / raw本文未読 / 昇格なし / 公開不可",
        "本文引用: なし",
        "",
        "このmanifestは、RR-01からRR-05をrecord-level再読解へ進めるための作業単位を固定する。",
        "raw originalはまだ開いていない。redaction manifest / flagsとredacted row-level textの存在だけを確認した。",
        "",
        "## Redaction Surfaces",
    ]
    for dataset_id, surface in manifest["redaction_surfaces"].items():
        lines.extend(
            [
                f"### {dataset_id}",
                f"- status: {surface['manifest'].get('status')}",
                f"- redacted unit records: {surface['manifest'].get('records')}",
                f"- records changed by redaction: {surface['manifest'].get('records_changed')}",
                f"- residual flagged records: {surface['manifest'].get('residual_flagged_records')}",
                f"- review flag lines: {surface['review_flag_lines']}",
                f"- raw text exported by redaction step: {surface['manifest'].get('raw_text_exported')}",
                f"- redacted text public safe: {surface['manifest'].get('redacted_text_public_safe')}",
                "",
            ]
        )
    lines.append("## Worksets")
    for workset in manifest["worksets"]:
        lines.extend(
            [
                "",
                f"### {workset['batch_id']} / {workset['corridor']}",
                f"- purpose: {workset['purpose']}",
                f"- records: {workset['record_count']}",
                f"- datasets: {workset['dataset_counts']}",
                f"- hold condition: {workset['hold_condition']}",
                "| group | records |",
                "|---|---:|",
            ]
        )
        for group, ids in workset["record_groups"].items():
            lines.append(f"| {group} | {len(ids)} |")
    lines.extend(
        [
            "",
            "## Next Use",
            "- redacted row-level readingは本文引用なしの構造noteに限定する。",
            "- raw original local-only extractionは、redactedでは足りないrecordだけに限定する。",
            "- Coreを強くするだけでなく、削る、戻す、holdするためにも使う。",
            "",
        ]
    )
    return "\n".join(lines)


def make_notes_md(notes: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Redacted Record-Level Rereading Notes",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: redacted row-level deterministic first pass / raw本文未読 / 引用なし / 昇格なし / 公開不可",
        "本文引用: なし",
        "",
        "このartifactはredacted本文を内部で読み、出力には本文を出さず、recordごとの非引用構造シグナルだけを残す。",
        "lexical scanなので、Core改訂には人間またはLLM文脈読解による次段確認が必要である。",
        "",
        "## Summary",
        f"- records: {notes['record_count']}",
        f"- records with redacted units: {notes['records_with_redacted_units']}",
        f"- records without redacted units: {notes['records_without_redacted_units']}",
        f"- source_text_exported: {notes['source_text_exported']}",
        "",
        "## Axis Signal Counts",
        "| axis | records |",
        "|---|---:|",
    ]
    for axis, count in notes["axis_signal_record_counts"].items():
        lines.append(f"| {axis} | {count} |")
    lines.extend(["", "## Corridor Notes", "| corridor | records | supports | revision pressure | holds |", "|---|---:|---:|---:|---:|"])
    for row in notes["corridor_summary"]:
        lines.append(
            f"| {row['corridor']} | {row['records']} | {row['records_with_supports']} | "
            f"{row['records_with_revision_pressure']} | {row['records_with_hold_reason']} |"
        )
    lines.extend(
        [
            "",
            "## Follow-Up Queue",
            f"- no redacted units, structured/raw lookup candidates: {len(notes['followup_queue']['no_redacted_units'])}",
            f"- redacted units present but needs context reading: {len(notes['followup_queue']['needs_context_reading_next'])}",
            f"- raw local-only candidates: {len(notes['followup_queue']['raw_local_only_if_redacted_and_structured_are_insufficient'])}",
            "",
            "## Interpretation",
            "- この段階では、本文引用、支援妥当性判断、source validity判断、promotionは行っていない。",
            "- signalが出ないrecordは、構造がないという意味ではない。structured fieldまたはLLM文脈読解が必要な可能性がある。",
            "- RR-05は厚み付けではなく、過剰一般化を止めるための境界recordとして扱う。",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    target_meta = all_workset_records()
    target_ids = set(target_meta)
    redacted_units = load_redacted_units(target_ids)

    surfaces = {}
    for dataset_id in REDACTED_SURFACES:
        surfaces[dataset_id] = {
            "manifest": load_manifest(dataset_id),
            "review_flag_lines": count_flag_lines(dataset_id),
        }

    worksets = []
    for workset in WORKSETS:
        ids = [rid for group_ids in workset["record_groups"].values() for rid in group_ids]
        worksets.append(
            {
                **workset,
                "record_count": len(ids),
                "unique_record_count": len(set(ids)),
                "dataset_counts": dict(Counter(rid.split(":", 1)[0] for rid in ids)),
                "records_with_redacted_units": sum(1 for rid in set(ids) if redacted_units.get(rid)),
                "records_without_redacted_units": sorted(rid for rid in set(ids) if not redacted_units.get(rid)),
            }
        )

    manifest = {
        "artifact_id": "stage1-production-raw-redacted-rereading-workset-manifest-v0-2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "workset_manifest_redaction_checked_raw_original_not_opened",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "target_record_count": len(target_ids),
        "redaction_surfaces": surfaces,
        "worksets": worksets,
    }

    record_notes = [
        build_record_note(record_id, target_meta[record_id], redacted_units.get(record_id, []))
        for record_id in sorted(target_ids)
    ]
    axis_counts = Counter()
    for note in record_notes:
        for signal in note["scima_fchma_signals_without_quotes"]:
            axis_counts[signal["axis"]] += 1
    corridor_rows = []
    for workset in WORKSETS:
        corridor = workset["corridor"]
        corridor_notes = [n for n in record_notes if corridor in n["corridors"]]
        corridor_rows.append(
            {
                "corridor": corridor,
                "records": len(corridor_notes),
                "records_with_supports": sum(1 for n in corridor_notes if n["supports_current_structure"]),
                "records_with_revision_pressure": sum(1 for n in corridor_notes if n["counter_or_revision_pressure"]),
                "records_with_hold_reason": sum(1 for n in corridor_notes if n["hold_or_stop_reason"]),
            }
        )
    notes = {
        "artifact_id": "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "redacted_record_level_deterministic_first_pass_no_text_export",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "redacted_text_read_internal": True,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "record_count": len(record_notes),
        "records_with_redacted_units": sum(1 for n in record_notes if n["redacted_unit_count"] > 0),
        "records_without_redacted_units": sum(1 for n in record_notes if n["redacted_unit_count"] == 0),
        "axis_signal_record_counts": dict(sorted(axis_counts.items())),
        "corridor_summary": corridor_rows,
        "followup_queue": {
            "no_redacted_units": [
                n["record_id"] for n in record_notes if n["redacted_unit_count"] == 0
            ],
            "needs_context_reading_next": [
                n["record_id"]
                for n in record_notes
                if n["redacted_unit_count"] > 0
                and n["counter_or_revision_pressure"]
                and not n["supports_current_structure"]
            ],
            "raw_local_only_if_redacted_and_structured_are_insufficient": [
                n["record_id"] for n in record_notes if n["redacted_unit_count"] == 0
            ],
        },
        "record_notes": record_notes,
    }

    OUT_MANIFEST_JSON.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_MANIFEST_MD.write_text(make_manifest_md(manifest), encoding="utf-8")
    OUT_NOTES_JSON.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_NOTES_JSONL.write_text(
        "".join(json.dumps(note, ensure_ascii=False) + "\n" for note in record_notes),
        encoding="utf-8",
    )
    OUT_NOTES_MD.write_text(make_notes_md(notes), encoding="utf-8")

    print(f"worksets={len(worksets)} target_records={len(target_ids)}")
    print(f"redacted_notes={len(record_notes)} no_text_export=true raw_original_opened=false")
    print(f"wrote {OUT_MANIFEST_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_NOTES_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
