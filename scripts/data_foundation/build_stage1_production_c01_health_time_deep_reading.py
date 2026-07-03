#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
SUBBRANCH_JSON = RUN_DIR / "stage1-production-subbranch-split-candidates-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.md"
MIN_REVIEWABLE_RECORDS = 10

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

CURRENT_STATUSES = {"currently_working"}
TRANSITION_STATUSES = {"not_working_wants_work", "job_transition_or_training", "never_worked", "past_work_not_current"}

WORK_HOUR_TERMS = ("勤務時間", "短時間", "休日", "休暇", "遅刻", "早退", "欠勤", "通院")
REST_TERMS = ("休憩", "休息", "疲労", "体力", "疲れ", "休憩所", "回復")
TASK_LOAD_TERMS = ("仕事内容", "職務", "業務量", "作業", "責任", "代替", "配置", "ペース", "ノルマ")
LONG_TERM_TERMS = ("継続", "復職", "休職", "進行", "悪化", "将来", "長期", "治療継続", "再発")
WORKPLACE_UNDERSTANDING_TERMS = ("理解", "説明", "職場", "上司", "同僚", "配慮", "調整")


def load_records() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    records: dict[str, dict[str, Any]] = defaultdict(
        lambda: {
            "branches": set(),
            "boundary_tags": set(),
            "dominant": set(),
            "secondary": set(),
            "c01_scores": Counter(),
            "source": "",
        }
    )
    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    for item in assignments:
        record = records[item["record_id"]]
        record["branches"].update(item["candidate_branches"])
        record["boundary_tags"].update(item.get("boundary_tags", []))
        record["source"] = item["source"]

    subbranch_links = json.loads(SUBBRANCH_JSON.read_text(encoding="utf-8"))["record_links"]
    for item in subbranch_links:
        record = records[item["record_id"]]
        record["branches"].add(item["branch_id"])
        record["dominant"].update(item["dominant_subbranch_candidates"])
        record["secondary"].update(item["secondary_subbranch_candidates"])
        if item["branch_id"].startswith("P1-C01"):
            record["c01_scores"].update(item.get("subbranch_scores", {}))
        record["source"] = item["source"]

    rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                rows[row["record_id"]] = row
    return dict(records), rows


def text_values(row: dict[str, Any], keys: tuple[str, ...]) -> list[str]:
    values: list[str] = []
    for key in keys:
        value = row.get(key)
        if isinstance(value, list):
            values.extend(str(item) for item in value)
        elif isinstance(value, dict):
            values.extend(str(item) for item in value.values())
        elif value:
            values.append(str(value))
    return values


def has_any(values: list[str], terms: tuple[str, ...]) -> bool:
    return any(any(term in value for term in terms) for value in values)


def has_branch(record: dict[str, Any], *branch_ids: str) -> bool:
    return bool(set(branch_ids) & record["branches"])


def has_subbranch(record: dict[str, Any], subbranch_id: str) -> bool:
    return subbranch_id in record["dominant"] or subbranch_id in record["secondary"]


def axis_profile(record: dict[str, Any], row: dict[str, Any]) -> dict[str, bool]:
    c01_scores: Counter[str] = record["c01_scores"]
    primary_subbranch = c01_scores.most_common(1)[0][0] if c01_scores else "none"
    return {
        "primary_C01-4-workplace-understanding": primary_subbranch == "C01-4-workplace-understanding",
        "primary_C01-5-long-term-continuity": primary_subbranch == "C01-5-long-term-continuity",
        "primary_C01-3-task-load-substitution": primary_subbranch == "C01-3-task-load-substitution",
        "primary_C01-1-work-hours-leave": primary_subbranch == "C01-1-work-hours-leave",
        "primary_C01-2-rest-recovery-place": primary_subbranch == "C01-2-rest-recovery-place",
        "workplace_understanding": c01_scores["C01-4-workplace-understanding"] > 0,
        "long_term_continuity": c01_scores["C01-5-long-term-continuity"] > 0,
        "task_load_substitution": c01_scores["C01-3-task-load-substitution"] > 0,
        "work_hours_leave": c01_scores["C01-1-work-hours-leave"] > 0,
        "rest_recovery_place": c01_scores["C01-2-rest-recovery-place"] > 0,
        "c02_translation_bridge": has_branch(record, "P1-C02A", "P1-C02B") or "P1-C02D" in record["boundary_tags"],
        "c03_support_continuity_bridge": has_branch(record, "P1-C03A", "P1-C03B", "P1-C03C") or "P1-C03D" in record["boundary_tags"],
        "c05_physical_rest_boundary": "P1-C01D" in record["boundary_tags"] or has_branch(record, "P1-C05A", "P1-C05B", "P1-C05D"),
        "current_work_context": row.get("status_group") in CURRENT_STATUSES,
        "transition_context": row.get("status_group") in TRANSITION_STATUSES,
    }


def classify(profile: dict[str, bool]) -> str:
    if profile["current_work_context"] and profile["primary_C01-4-workplace-understanding"]:
        return "C01H-1-current-health-time-to-workplace-interpretation"
    if profile["current_work_context"] and profile["primary_C01-5-long-term-continuity"]:
        return "C01H-2-current-long-term-continuity-support-coupling"
    if profile["current_work_context"] and profile["primary_C01-3-task-load-substitution"]:
        return "C01H-3-current-task-load-substitution"
    if profile["transition_context"] and profile["primary_C01-5-long-term-continuity"]:
        return "C01H-4-transition-long-term-carryover"
    if profile["transition_context"] and profile["primary_C01-3-task-load-substitution"]:
        return "C01H-5-transition-task-load-carryover"
    if profile["primary_C01-1-work-hours-leave"] or profile["primary_C01-2-rest-recovery-place"]:
        return "C01H-6-work-hours-rest-as-implementation-freedom"
    if profile["c05_physical_rest_boundary"] and (profile["rest_recovery_place"] or profile["long_term_continuity"]):
        return "C01H-7-health-time-physical-environment-boundary"
    return "C01H-Z-mixed-or-low-context"


def compact_distribution(record_ids: set[str], rows: dict[str, dict[str, Any]], profiles: dict[str, dict[str, bool]]) -> dict[str, Any]:
    source = Counter(record_id.split(":", 1)[0] for record_id in record_ids)
    status = Counter()
    pattern = Counter()
    diversity = Counter()
    axis = Counter()
    for record_id in record_ids:
        row = rows[record_id]
        status[row.get("status_group", "unknown")] += 1
        pattern[row.get("pattern_cell_id", "unknown")] += 1
        diversity.update(row.get("health_condition_groups", [])[:8])
        diversity.update(row.get("body_function_signals", [])[:8])
        diversity.update(row.get("impairment_signals", [])[:8])
        axis.update(key for key, value in profiles[record_id].items() if value)
    return {
        "source_counts": dict(source.most_common()),
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(10)),
        "diversity_anchor_counts": dict(diversity.most_common(14)),
        "axis_counts": dict(axis.most_common()),
    }


def branch_specs() -> dict[str, dict[str, str]]:
    return {
        "C01H-1-current-health-time-to-workplace-interpretation": {
            "title": "就労中の健康時間の職場内翻訳",
            "candidate_proposition": "健康時間・体調変動・治療条件が、勤務、休憩、職務、責任、配置、説明可能性の言葉へ翻訳されない場合、就労中の部分配慮があっても未整合が残る可能性。",
            "counter_proposition": "健康時間ではなく、入口翻訳、職場理解、支援接続、仕事内容設計、評価の問題として読むべき可能性がある。",
            "handling": "reviewable_core_subbranch",
        },
        "C01H-2-current-long-term-continuity-support-coupling": {
            "title": "就労中の長期継続設計と支援再翻訳",
            "candidate_proposition": "病状変化、治療継続、復職、仕事内容変更を前提にした長期設計が弱い場合、支援が就職後に再翻訳する自由度と接続しないと継続困難が残る可能性。",
            "counter_proposition": "長期継続の信号は、医療条件、生活保障、家族条件、年齢、地域労働市場、本人希望を反映しているだけかもしれない。",
            "handling": "reviewable_core_subbranch",
        },
        "C01H-3-current-task-load-substitution": {
            "title": "就労中の仕事内容負荷・職務代替",
            "candidate_proposition": "健康時間の問題が勤務時間だけでなく仕事内容、業務量、作業ペース、責任範囲、代替可能性に接続している場合、時間配慮だけでは残存困難が減らない可能性。",
            "counter_proposition": "仕事内容負荷に見える問題は、職場理解、支援接続、本人希望、職務能力評価、入口翻訳の問題かもしれない。",
            "handling": "reviewable_resolution_subbranch",
        },
        "C01H-4-transition-long-term-carryover": {
            "title": "移行期の健康時間・長期継続持ち越し",
            "candidate_proposition": "過去就労で病状変化、治療継続、復職、長期配置の設計が弱かった場合、再就職・求職・職業準備で将来見通しや応募条件の自由度が狭まる可能性。",
            "counter_proposition": "移行期の困難は、地域求人、生活保障、就労希望、職業準備、支援制度対象の問題かもしれない。",
            "handling": "reviewable_transition_subbranch",
        },
        "C01H-5-transition-task-load-carryover": {
            "title": "移行期の仕事内容負荷・職務代替持ち越し",
            "candidate_proposition": "過去の仕事内容・業務量・責任範囲と健康時間の未整合が、再就職時の仕事選択、実習、求人条件翻訳に持ち越される可能性。",
            "counter_proposition": "仕事内容負荷ではなく、入口翻訳、支援接続、経験不足、地域求人、本人希望の未確定かもしれない。",
            "handling": "reviewable_transition_subbranch",
        },
        "C01H-6-work-hours-rest-as-implementation-freedom": {
            "title": "勤務時間・休憩を実装自由度として扱う枝",
            "candidate_proposition": "勤務時間、休暇、休憩、回復場所は独立解決策ではなく、職場内翻訳、長期継続、仕事内容負荷を実装する自由度として働く可能性。",
            "counter_proposition": "勤務時間・休憩そのものが主構造のケースを、実装面に吸収しすぎている可能性がある。",
            "handling": "implementation_freedom_not_standalone_promotion",
        },
        "C01H-7-health-time-physical-environment-boundary": {
            "title": "健康時間と物理環境・休息境界",
            "candidate_proposition": "作業場所、移動、姿勢、設備、休憩場所に見える信号の一部は、疲労、回復、治療継続、体調変動を職場内で成立させる境界自由度として読める可能性。",
            "counter_proposition": "物理環境本体、情報参加、移動経路、支援接続の問題を健康時間へ吸収しすぎている可能性がある。",
            "handling": "boundary_to_C05_not_standalone_promotion",
        },
        "C01H-Z-mixed-or-low-context": {
            "title": "混合または低文脈の健康時間信号",
            "candidate_proposition": "健康時間に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要な健康時間構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def main() -> None:
    records, rows = load_records()
    target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if {"P1-C01A", "P1-C01B", "P1-C01C"} & record["branches"]
    )
    profiles = {record_id: axis_profile(records[record_id], rows[record_id]) for record_id in target_ids}
    class_ids: dict[str, list[str]] = defaultdict(list)
    for record_id in target_ids:
        class_ids[classify(profiles[record_id])].append(record_id)

    specs = branch_specs()
    subbranches = []
    for class_id, ids in sorted(class_ids.items()):
        ids_set = set(ids)
        spec = specs[class_id]
        handling = spec["handling"]
        if handling.startswith("reviewable") and len(ids) < MIN_REVIEWABLE_RECORDS:
            handling = "thin_signal_modifier_not_reviewable_alone"
        subbranches.append(
            {
                "subbranch_id": class_id,
                **spec,
                "handling": handling,
                "record_count": len(ids),
                "representative_ids": ids[:12],
                "contrast_ids": sorted(set(target_ids) - ids_set)[:12],
                "distribution": compact_distribution(ids_set, rows, profiles),
            }
        )

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "source_set": {
            "c01a_or_c01b_or_c01c_records": len(target_ids),
            "reviewable_subbranches": sum(1 for branch in subbranches if branch["handling"].startswith("reviewable")),
            "minimum_reviewable_records_per_subbranch": MIN_REVIEWABLE_RECORDS,
        },
        "interpretive_result": "C01の中核は『病気があるから働きにくい』ではなく、仕事側の安定能力前提と、変動・回復・治療・予後という健康時間の構造が噛み合わないことにある。勤務時間や休憩は解決策名ではなく、この時間構造を仕事へ接続する実装自由度である。",
        "scientific_discovery_candidate": "健康時間は、個人内で変動する条件を、職務、責任、配置、支援継続、物理環境へ再翻訳し続ける必要を生む。これは疾病群に閉じないが、疾患・機能障害の多様性によって必要な自由度の形が変わる。",
        "subbranches": subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C01 Health Time Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / LLM文脈読解由来信号の構造再読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C01を、医学的制約の一覧ではなく、健康時間・体調変動・治療継続が仕事設計へどう接続されるかの構造として読み直した。",
        "",
        "## 結論",
        "",
        payload["interpretive_result"],
        "",
        "## 科学的発見候補",
        "",
        payload["scientific_discovery_candidate"],
        "",
        f"C01A/C01B/C01C target records: {payload['source_set']['c01a_or_c01b_or_c01c_records']}",
        f"reviewable subbranches: {payload['source_set']['reviewable_subbranches']}",
        f"minimum reviewable records per subbranch: {payload['source_set']['minimum_reviewable_records_per_subbranch']}",
        "",
        "## Subbranches",
        "",
        "| subbranch | records | handling | representative IDs |",
        "|---|---:|---|---|",
    ]
    for branch in subbranches:
        reps = ", ".join(f"`{rid}`" for rid in branch["representative_ids"][:6])
        lines.append(f"| `{branch['subbranch_id']}` {branch['title']} | {branch['record_count']} | {branch['handling']} | {reps} |")

    lines.extend(["", "## Detail", ""])
    for branch in subbranches:
        dist = branch["distribution"]
        lines.extend(
            [
                f"### {branch['subbranch_id']} {branch['title']}",
                "",
                f"record数: {branch['record_count']}",
                f"代表ID: {', '.join(f'`{rid}`' for rid in branch['representative_ids'])}",
                f"対照ID: {', '.join(f'`{rid}`' for rid in branch['contrast_ids'])}",
                "",
                f"候補命題: {branch['candidate_proposition']}",
                "",
                f"反対命題: {branch['counter_proposition']}",
                "",
                f"扱い: {branch['handling']}",
                "",
                "分布:",
                f"- source: {', '.join(f'{key}:{value}' for key, value in dist['source_counts'].items())}",
                f"- status_group: {', '.join(f'{key}:{value}' for key, value in dist['status_group_counts'].items())}",
                f"- pattern_cell: {', '.join(f'{key}:{value}' for key, value in dist['pattern_cell_counts'].items())}",
                f"- diversity_anchor: {', '.join(f'{key}:{value}' for key, value in dist['diversity_anchor_counts'].items())}",
                f"- health_time_axis: {', '.join(f'{key}:{value}' for key, value in dist['axis_counts'].items())}",
                "",
            ]
        )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C01を疾病名や医学的重さの説明に縮めない。",
            "- 健康時間は、変動、回復、治療、予後を仕事側の時間構造へ接続する自由度として読む。",
            "- 勤務時間・休憩は独立解決策ではなく、職場内翻訳、長期継続、仕事内容負荷を実装する自由度として扱う。",
            "- 疾病群や障害種類は主語ではなく、どの自由度が必要になるかを変える多様性条件として扱う。",
            "- C02入口翻訳、C03継続支援、C05物理環境へ接続する時は、健康時間側が主構造か実装面かを分ける。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
