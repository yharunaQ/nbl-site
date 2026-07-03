#!/usr/bin/env python3
"""Build no-text adjacent-route sampling for C07/C08.

This artifact keeps C07/C08 narrow, but turns their thinness into a usable
reading program by selecting intersections with thicker neighboring routes.
It reads only derived no-text artifacts and exports no raw/redacted source text
or field values.
"""

from __future__ import annotations

from collections import Counter, defaultdict
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
PREFIX = "stage1-production-c07-c08-adjacent-route-intersection-sampling-v0-2026-05-23"

CR02 = OUT_DIR / "stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.json"
CR03 = OUT_DIR / "stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.json"
CR04 = OUT_DIR / "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.json"
AFTER_RAW = OUT_DIR / "stage1-production-c07-c08-after-raw-resolution-v0-2026-05-23.json"
BRANCH_ASSIGNMENTS = OUT_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
SUBBRANCH_SPLITS = OUT_DIR / "stage1-production-subbranch-split-candidates-v0-2026-05-18.json"
ABC_CROSSWALK = OUT_DIR / "stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.json"

AXIS_BY_PREFIX = {
    "P1-C01": "C01-health-time",
    "P1-C02": "C02-entry-translation",
    "P1-C03": "C03-support-continuity",
    "P1-C04": "C04-information-participation",
    "P1-C05": "C05-worksite-contact",
    "P1-C06": "C06-life-security",
}

TARGET_ROUTES = {
    "C07": "QR-07-quality-career-and-value-translation",
    "C08": "QR-05-entry-prework-translation",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def axis_from_branch(branch_id: str) -> str | None:
    for prefix, axis in AXIS_BY_PREFIX.items():
        if branch_id.startswith(prefix):
            return axis
    return None


def note_by_record(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {row["record_id"]: row for row in data["record_context_notes"]}


def branch_indexes() -> tuple[dict[str, dict[str, Any]], dict[str, list[dict[str, Any]]]]:
    branch_data = load_json(BRANCH_ASSIGNMENTS)
    subbranch_data = load_json(SUBBRANCH_SPLITS)
    assignments = {row["record_id"]: row for row in branch_data["assignments"]}
    subbranches: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in subbranch_data["record_links"]:
        subbranches[row["record_id"]].append(row)
    return assignments, subbranches


def axis_layers_from_record(
    assignment: dict[str, Any],
    note: dict[str, Any] | None,
    c05_note: dict[str, Any] | None,
) -> dict[str, list[str]]:
    strong_axes: set[str] = set()
    boundary_axes: set[str] = set()
    structured_projection_axes: set[str] = set()
    for branch_id in assignment.get("candidate_branches", []):
        axis = axis_from_branch(branch_id)
        if axis:
            strong_axes.add(axis)
    for branch_id in assignment.get("boundary_tags", []):
        axis = axis_from_branch(branch_id)
        if axis:
            boundary_axes.add(axis)
    for source_note in (note, c05_note):
        if not source_note:
            continue
        for axis in source_note.get("redacted_axes", []):
            strong_axes.add(axis)
        for axis in source_note.get("structured_axes", []):
            structured_projection_axes.add(axis)
        if source_note.get("contact_type_counts_without_quotes"):
            strong_axes.add("C05-worksite-contact")
    return {
        "strong_intersection_axes": sorted(strong_axes),
        "boundary_intersection_axes": sorted(boundary_axes),
        "structured_projection_axes": sorted(structured_projection_axes),
        "all_intersection_axes": sorted(strong_axes | boundary_axes | structured_projection_axes),
    }


def context_keys(note: dict[str, Any] | None) -> list[str]:
    if not note:
        return []
    keys: set[str] = set()
    for field in (
        "combined_context_type_counts_without_quotes_or_values",
        "redacted_context_type_counts_without_quotes",
        "structured_field_context_type_counts_without_values",
        "contact_type_counts_without_quotes",
    ):
        keys.update(note.get(field, {}).keys())
    return sorted(keys)


def sample_role(action: str, source: str) -> str:
    if source == "c05_adjacent_only":
        return "adjacent_c05_to_c07_probe"
    if action.startswith("advance"):
        return "representative_intersection"
    if action.startswith("structured_coverage"):
        return "closure_gap_intersection"
    return "boundary_brake_intersection"


def c07_questions(axes: set[str], role: str) -> list[str]:
    questions = []
    if "C05-worksite-contact" in axes:
        questions.append("仕事接触点が、役割・評価・処遇・将来見通しへ翻訳されているか。")
    if "C03-support-continuity" in axes:
        questions.append("支援は存在しているだけか、それとも遂行条件を価値・評価へ再翻訳しているか。")
    if "C01-health-time" in axes:
        questions.append("健康時間・負荷・休息が、参加品質や価値化の自由度をどう変えているか。")
    if "C06-life-security" in axes:
        questions.append("評価・処遇・生活保障の境界は、働き続ける自由度とどう結びつくか。")
    if role == "boundary_brake_intersection":
        questions.append("満足度・継続・構造化項目を成功証明に変換していないか。")
    return questions or ["構造化された参加品質信号だけで、価値翻訳を閉じていないか。"]


def c08_questions(axes: set[str], role: str, context: set[str]) -> list[str]:
    questions = []
    if "C06-life-security" in axes:
        questions.append("生活保障・制度接続・選び直し圧力が、入口前後の順序をどう変えるか。")
    if "C01-health-time" in axes:
        questions.append("健康時間・生活リズム・体力が、訓練、応募、開始、継続のどこで翻訳を要するか。")
    if "C02-entry-translation" in axes or "C03-support-continuity" in axes:
        questions.append("支援・開示・相談は、入口前の準備不足ではなく仕事条件翻訳として働いているか。")
    if "C05-worksite-contact" in axes:
        questions.append("過去/現在の職場接触点は、入口以前の準備や選択条件へ持ち越されているか。")
    if role == "boundary_brake_intersection" or "nonwork_or_low_context_brake" in context:
        questions.append("低文脈・非就労信号を、意欲や readiness deficit に変換していないか。")
    return questions or ["入口前信号を、単なる準備状態ではなく順序と翻訳の問題として読めるか。"]


def profile_record(
    target_axis: str,
    record_id: str,
    note: dict[str, Any] | None,
    assignment: dict[str, Any],
    subbranches: list[dict[str, Any]],
    c05_note: dict[str, Any] | None = None,
    source: str = "direct_target_corridor",
) -> dict[str, Any]:
    axis_layers = axis_layers_from_record(assignment, note, c05_note)
    strong_axes = set(axis_layers["strong_intersection_axes"])
    boundary_axes = set(axis_layers["boundary_intersection_axes"])
    all_axes = strong_axes | boundary_axes | set(axis_layers["structured_projection_axes"])
    context = set(context_keys(note)) | set(context_keys(c05_note))
    action = note.get("context_reading_action", "not_in_target_corridor") if note else "not_in_target_corridor"
    role = sample_role(action, source)
    question_axes = strong_axes | boundary_axes
    questions = c07_questions(question_axes, role) if target_axis == "C07" else c08_questions(question_axes, role, context)
    branch_ids = assignment.get("candidate_branches", [])
    boundary_tags = assignment.get("boundary_tags", [])
    return {
        "target_axis": target_axis,
        "target_route": TARGET_ROUTES[target_axis],
        "record_id": record_id,
        "source_dataset": record_id.split(":", 1)[0],
        "sample_source": source,
        "sample_role": role,
        "corridor_group": note.get("group") if note else c05_note.get("group") if c05_note else None,
        "context_reading_action": action,
        "strong_intersection_axes": axis_layers["strong_intersection_axes"],
        "boundary_intersection_axes": axis_layers["boundary_intersection_axes"],
        "structured_projection_axes": axis_layers["structured_projection_axes"],
        "intersection_axes": sorted(all_axes),
        "candidate_branches": branch_ids,
        "boundary_tags": boundary_tags,
        "dominant_subbranches": [
            {
                "branch_id": row["branch_id"],
                "dominant": row.get("dominant_subbranch_candidates", []),
                "secondary": row.get("secondary_subbranch_candidates", []),
            }
            for row in sorted(subbranches, key=lambda item: item["branch_id"])
        ],
        "context_signal_keys_without_text": sorted(context),
        "derived_supports": sorted(set((note or {}).get("context_supports", []) + (c05_note or {}).get("context_supports", []))),
        "derived_revision_pressure": sorted(
            set((note or {}).get("context_revision_pressure", []) + (c05_note or {}).get("context_revision_pressure", []))
        ),
        "reading_questions": questions,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "validity_judgment_made": False,
        "promotion_made": False,
    }


def profile_score(profile: dict[str, Any]) -> tuple[int, int, str]:
    role_rank = {
        "representative_intersection": 4,
        "closure_gap_intersection": 3,
        "adjacent_c05_to_c07_probe": 2,
        "boundary_brake_intersection": 1,
    }[profile["sample_role"]]
    axes = len(profile["strong_intersection_axes"]) * 2 + len(profile["boundary_intersection_axes"])
    support = len(profile["derived_supports"])
    pressure_penalty = min(2, len(profile["derived_revision_pressure"]))
    return (role_rank * 10 + axes * 2 + support - pressure_penalty, axes, profile["record_id"])


def select_priority(profiles: list[dict[str, Any]], target_axis: str) -> list[dict[str, Any]]:
    caps = {
        "representative_intersection": 4,
        "closure_gap_intersection": 8 if target_axis == "C08" else 6,
        "boundary_brake_intersection": 5,
        "adjacent_c05_to_c07_probe": 6,
    }
    by_role: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for profile in profiles:
        by_role[profile["sample_role"]].append(profile)
    selected = []
    for role, cap in caps.items():
        rows = sorted(by_role.get(role, []), key=profile_score, reverse=True)[:cap]
        selected.extend(rows)
    return sorted(selected, key=lambda item: (item["sample_role"], item["record_id"]))


def route_overlay(crosswalk: dict[str, Any], route_id: str) -> dict[str, Any]:
    for row in crosswalk["route_overlays"]:
        if row["route_id"] == route_id:
            return row
    raise KeyError(route_id)


def axis_overlay(crosswalk: dict[str, Any], axis_id: str) -> dict[str, Any]:
    return crosswalk["stage1_axis_overlays"][axis_id]


def summarize_profiles(profiles: list[dict[str, Any]]) -> dict[str, Any]:
    role_counts = Counter(row["sample_role"] for row in profiles)
    strong_axis_counts = Counter(axis for row in profiles for axis in row["strong_intersection_axes"])
    boundary_axis_counts = Counter(axis for row in profiles for axis in row["boundary_intersection_axes"])
    structured_axis_counts = Counter(axis for row in profiles for axis in row["structured_projection_axes"])
    branch_counts = Counter(branch for row in profiles for branch in row["candidate_branches"])
    boundary_counts = Counter(tag for row in profiles for tag in row["boundary_tags"])
    context_counts = Counter(key for row in profiles for key in row["context_signal_keys_without_text"])
    return {
        "record_count": len(profiles),
        "sample_role_counts": dict(sorted(role_counts.items())),
        "strong_intersection_axis_counts": dict(sorted(strong_axis_counts.items())),
        "boundary_intersection_axis_counts": dict(sorted(boundary_axis_counts.items())),
        "structured_projection_axis_counts": dict(sorted(structured_axis_counts.items())),
        "top_candidate_branches": dict(branch_counts.most_common(10)),
        "top_boundary_tags": dict(boundary_counts.most_common(12)),
        "top_context_signal_keys_without_text": dict(context_counts.most_common(12)),
    }


def main() -> None:
    cr02 = load_json(CR02)
    cr03 = load_json(CR03)
    cr04 = load_json(CR04)
    after_raw = load_json(AFTER_RAW)
    crosswalk = load_json(ABC_CROSSWALK)
    assignments, subbranch_index = branch_indexes()

    assert after_raw["source_text_exported"] is False
    assert after_raw["redacted_text_exported"] is False
    assert after_raw["field_value_exported"] is False

    c02_notes = note_by_record(cr02)
    c03_notes = note_by_record(cr03)
    c04_notes = note_by_record(cr04)

    c07_profiles = [
        profile_record(
            "C07",
            rid,
            note,
            assignments.get(rid, {}),
            subbranch_index.get(rid, []),
            c04_notes.get(rid),
        )
        for rid, note in sorted(c02_notes.items())
    ]
    c08_profiles = [
        profile_record(
            "C08",
            rid,
            note,
            assignments.get(rid, {}),
            subbranch_index.get(rid, []),
            c04_notes.get(rid),
        )
        for rid, note in sorted(c03_notes.items())
    ]

    c07_direct_ids = {row["record_id"] for row in c07_profiles}
    c07_adjacent_ids = []
    for rid, note in sorted(c04_notes.items()):
        if rid in c07_direct_ids:
            continue
        if "C07-quality-participation" in note.get("redacted_axes", []) or note.get("contact_type_counts_without_quotes", {}).get("evaluation_value"):
            c07_adjacent_ids.append(rid)
    for rid in c07_adjacent_ids:
        c07_profiles.append(
            profile_record(
                "C07",
                rid,
                None,
                assignments.get(rid, {}),
                subbranch_index.get(rid, []),
                c04_notes.get(rid),
                source="c05_adjacent_only",
            )
        )

    c07_priority = select_priority(c07_profiles, "C07")
    c08_priority = select_priority(c08_profiles, "C08")

    payload = {
        "artifact_id": PREFIX,
        "lane": "Falcon Lab",
        "status": "adjacent_route_intersection_sampling",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "validity_judgment_made": False,
        "source_artifacts": {
            "after_raw_resolution": str(AFTER_RAW.relative_to(ROOT)),
            "cr02_c07": str(CR02.relative_to(ROOT)),
            "cr03_c08": str(CR03.relative_to(ROOT)),
            "cr04_c05_contact": str(CR04.relative_to(ROOT)),
            "branch_assignments": str(BRANCH_ASSIGNMENTS.relative_to(ROOT)),
            "subbranch_splits": str(SUBBRANCH_SPLITS.relative_to(ROOT)),
            "abc_crosswalk": str(ABC_CROSSWALK.relative_to(ROOT)),
        },
        "decision": [
            "C07/C08 are not promoted; they are routed through thicker adjacent mechanisms.",
            "C07 is strengthened only when quality/value is tied to C05 contact points, C03 support retranslation, C01 health-time, or C06 life-security/evaluation boundaries.",
            "C08 is strengthened only when prework/entry is tied to C02/C03 translation-support, C01 health-time/stamina, or C06 life-security sequencing; low-context/nonwork signals remain brakes.",
            "2001 ABC is used as a multi-perspective mechanism window, not as historical frequency or condition-to-support lookup.",
        ],
        "c07": {
            "route_overlay": route_overlay(crosswalk, TARGET_ROUTES["C07"]),
            "axis_overlay": axis_overlay(crosswalk, "C07-quality-participation"),
            "profile_summary": summarize_profiles(c07_profiles),
            "priority_sample_count": len(c07_priority),
            "priority_samples": c07_priority,
        },
        "c08": {
            "route_overlay": route_overlay(crosswalk, TARGET_ROUTES["C08"]),
            "axis_overlay": axis_overlay(crosswalk, "C08-prework-participation"),
            "profile_summary": summarize_profiles(c08_profiles),
            "priority_sample_count": len(c08_priority),
            "priority_samples": c08_priority,
        },
        "integration_contract": {
            "allowed_use": [
                "Use C07 as value/evaluation translation only after an adjacent route supplies a concrete mechanism.",
                "Use C08 as entry/prework sequencing only after support, health-time, or life-security route context supplies a sequence.",
                "Pair every use with a brake against satisfaction-as-success, employment-as-solved, and readiness-deficit readings.",
            ],
            "not_allowed": [
                "Do not promote C07/C08 to candidate_pattern or Domain Core.",
                "Do not infer support validity, work capacity, readiness, or accommodation appropriateness.",
                "Do not use condition labels as lookup keys for difficulty or accommodation.",
                "Do not export raw, redacted, or structured field values from the source records.",
            ],
            "next_concrete_step": "Convert the selected intersections into no-text route-through Core use cards for Codex chat answer behavior.",
        },
    }

    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (OUT_DIR / f"{PREFIX}.jsonl").open("w", encoding="utf-8") as fh:
        for row in c07_profiles + c08_profiles:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(payload), encoding="utf-8")
    print(
        PREFIX,
        "c07_profiles=",
        payload["c07"]["profile_summary"]["record_count"],
        "c08_profiles=",
        payload["c08"]["profile_summary"]["record_count"],
        "c07_priority=",
        len(c07_priority),
        "c08_priority=",
        len(c08_priority),
    )


def compact_record(row: dict[str, Any]) -> str:
    strong = ", ".join(row["strong_intersection_axes"]) or "-"
    boundary = ", ".join(row["boundary_intersection_axes"]) or "-"
    questions = " / ".join(row["reading_questions"][:2])
    return f"| `{row['record_id']}` | `{row['sample_role']}` | {strong} | {boundary} | {questions} |"


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 C07/C08 Adjacent-Route Intersection Sampling",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon Lab",
        "状態: adjacent-route intersection sampling / 本文引用なし / 昇格なし / 公開不可 / runtime未承認",
        "",
        "## Position",
        "",
        "C07/C08は、raw original確認後も直接閉鎖の薄い経路である。ここではそれを欠陥として隠さず、C05/C01/C06/C02/C03との交差に通して、専門知識ネットワークで安全に使える読み筋へ変換する。",
        "",
        "この成果物は、record-levelのraw/redacted本文も構造化フィールド値も含まない。ID、派生された枝・境界タグ・文脈信号キーだけを使う。",
        "",
        "## Decision",
    ]
    for item in data["decision"]:
        lines.append(f"- {item}")

    for axis_key, title in [("c07", "C07 Quality / Value Translation"), ("c08", "C08 Prework / Entry Translation")]:
        axis = data[axis_key]
        summary = axis["profile_summary"]
        lines.extend(
            [
                "",
                f"## {title}",
                "",
                f"- profiles: {summary['record_count']}",
                f"- priority samples: {axis['priority_sample_count']}",
                f"- sample roles: `{summary['sample_role_counts']}`",
                f"- strong intersections: `{summary['strong_intersection_axis_counts']}`",
                f"- boundary intersections: `{summary['boundary_intersection_axis_counts']}`",
                f"- structured projection axes: `{summary['structured_projection_axis_counts']}`",
                f"- 2001 ABC level: `{axis['route_overlay']['thickening_level']}`",
                f"- 2001 ABC caution: {axis['route_overlay']['counter_or_attention']}",
                "",
                "| record | role | strong intersections | boundary intersections | reading question |",
                "|---|---|---|---|---|",
            ]
        )
        for row in axis["priority_samples"]:
            lines.append(compact_record(row))

    lines.extend(
        [
            "",
            "## Integration Contract",
            "",
            "Allowed use:",
        ]
    )
    for item in data["integration_contract"]["allowed_use"]:
        lines.append(f"- {item}")
    lines.append("")
    lines.append("Not allowed:")
    for item in data["integration_contract"]["not_allowed"]:
        lines.append(f"- {item}")
    lines.extend(["", f"Next concrete step: {data['integration_contract']['next_concrete_step']}", ""])
    return "\n".join(lines)


if __name__ == "__main__":
    main()
