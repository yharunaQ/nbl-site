#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.md"
MIN_REVIEWABLE_RECORDS = 10

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

CURRENT_STATUSES = {"currently_working"}
TRANSITION_STATUSES = {"not_working_wants_work", "job_transition_or_training", "never_worked", "past_work_not_current"}


def load_records() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    records: dict[str, dict[str, Any]] = defaultdict(lambda: {"branches": set(), "boundary_tags": set(), "source": ""})
    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    for item in assignments:
        record = records[item["record_id"]]
        record["branches"].update(item["candidate_branches"])
        record["boundary_tags"].update(item.get("boundary_tags", []))
        record["source"] = item["source"]

    rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                rows[row["record_id"]] = row
    return dict(records), rows


def has_branch(record: dict[str, Any], *branch_ids: str) -> bool:
    return bool(set(branch_ids) & record["branches"])


def has_tag(record: dict[str, Any], *tag_ids: str) -> bool:
    return bool(set(tag_ids) & record["boundary_tags"])


def axis_profile(record: dict[str, Any], row: dict[str, Any]) -> dict[str, bool]:
    return {
        "partial_information_arrangement_residual": has_branch(record, "P1-C04A-1"),
        "broad_information_misalignment": has_branch(record, "P1-C04A-2"),
        "transition_information_carryover": has_branch(record, "P1-C04A-3"),
        "information_health_life_worksite_boundary": has_tag(record, "P1-C04B"),
        "information_physical_environment_boundary": has_tag(record, "P1-C05E"),
        "c02_translation_bridge": has_branch(record, "P1-C02A", "P1-C02B") or has_tag(record, "P1-C02C", "P1-C02D"),
        "c03_support_bridge": has_branch(record, "P1-C03A", "P1-C03B", "P1-C03C") or has_tag(record, "P1-C03D"),
        "c01_health_time_bridge": has_branch(record, "P1-C01A", "P1-C01B", "P1-C01C") or has_tag(record, "P1-C01D"),
        "c05_worksite_bridge": has_branch(record, "P1-C05A", "P1-C05B", "P1-C05D") or has_tag(record, "P1-C05E"),
        "c06_life_security_bridge": has_tag(record, "P1-C06A", "P1-C06B", "P1-C06C", "P1-C06D", "P1-C06E"),
        "current_work_context": row.get("status_group") in CURRENT_STATUSES,
        "transition_context": row.get("status_group") in TRANSITION_STATUSES,
    }


def classify(profile: dict[str, bool]) -> str:
    if profile["partial_information_arrangement_residual"]:
        return "C04I-1-current-partial-information-participation-residual"
    if profile["broad_information_misalignment"]:
        return "C04I-2-current-broad-information-participation-redesign"
    if profile["transition_information_carryover"]:
        return "C04I-3-transition-information-participation-carryover"
    if profile["information_physical_environment_boundary"] and profile["c05_worksite_bridge"]:
        return "C04I-4-information-physical-environment-boundary"
    if profile["information_health_life_worksite_boundary"] and profile["current_work_context"]:
        return "C04I-5-current-information-as-health-worksite-boundary"
    if profile["information_health_life_worksite_boundary"] and profile["transition_context"]:
        return "C04I-6-transition-information-life-security-boundary"
    return "C04I-Z-mixed-or-low-context"


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
        diversity.update(row.get("handbook_signals", [])[:8])
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
        "C04I-1-current-partial-information-participation-residual": {
            "title": "就労中の情報参加部分整備・残存",
            "candidate_proposition": "情報参加に一部の整備があっても、理解、意思伝達、会話参加、確認可能性が責任遂行、訓練、評価、昇進、職場関係へ接続しなければ、参加の質に残存ギャップが出る可能性。",
            "counter_proposition": "残存困難は情報参加ではなく、職務難度、精神的ストレス、物理環境、雇用形態、支援接続の不適合かもしれない。",
            "handling": "reviewable_minority_subbranch",
        },
        "C04I-2-current-broad-information-participation-redesign": {
            "title": "就労中の情報参加広範再設計",
            "candidate_proposition": "情報参加の未整合が広い場合、単一の情報形式や機器ではなく、説明、確認、訓練、責任分担、評価、支援接続を一体で再設計する必要がある可能性。",
            "counter_proposition": "広範未整合は、全般的な仕事設計不一致、支援接続不全、職務要求過多、生活保障不安、回答信号の多さかもしれない。",
            "handling": "reviewable_minority_subbranch",
        },
        "C04I-3-transition-information-participation-carryover": {
            "title": "移行期の情報参加困難持ち越し",
            "candidate_proposition": "過去就労で情報参加困難が未解決だと、再就職・職業訓練・実習入口で、本人条件説明、必要支援整理、仕事選択、職場理解形成に持ち越される可能性。",
            "counter_proposition": "移行困難は、療養優先、生活再建、経済条件、求人条件、就労意欲の揺れ、別の活動制限で説明できる可能性がある。",
            "handling": "reviewable_minority_transition_subbranch",
        },
        "C04I-4-information-physical-environment-boundary": {
            "title": "情報参加と物理環境・安全確認境界",
            "candidate_proposition": "情報参加は、会話や文書だけでなく、作業場所、移動中の案内、安全確認、音声・視覚情報、設備表示との接点として現れる可能性。",
            "counter_proposition": "これは情報参加ではなく、C05の物理アクセス、移動、姿勢、設備本体の問題かもしれない。",
            "handling": "boundary_to_C05_not_standalone_promotion",
        },
        "C04I-5-current-information-as-health-worksite-boundary": {
            "title": "就労中の情報参加・健康時間・職場環境境界",
            "candidate_proposition": "健康時間、仕事設計、職場環境の調整が、本人と職場の間で確認可能な情報形式にならない場合、就労中の調整が成立しにくい可能性。",
            "counter_proposition": "主構造はC01健康時間、C02入口翻訳、C03支援接続、C05作業場所であり、C04は実装面にすぎない可能性がある。",
            "handling": "boundary_cross_domain_subbranch",
        },
        "C04I-6-transition-information-life-security-boundary": {
            "title": "移行期の情報参加・生活保障境界",
            "candidate_proposition": "移行期では、仕事条件、支援条件、生活保障、健康条件が整理された情報として接続しないと、応募・実習・訓練・再就職の自由度が狭まる可能性。",
            "counter_proposition": "情報参加ではなく、生活保障、地域求人、職業準備、健康安定、制度対象の問題かもしれない。",
            "handling": "boundary_to_C02_C06_not_standalone_promotion",
        },
        "C04I-Z-mixed-or-low-context": {
            "title": "混合または低文脈の情報参加信号",
            "candidate_proposition": "情報参加に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要な情報参加構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def main() -> None:
    records, rows = load_records()
    target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if any(branch.startswith("P1-C04A") for branch in record["branches"])
        or "P1-C04B" in record["boundary_tags"]
        or "P1-C05E" in record["boundary_tags"]
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
            "c04_or_information_boundary_records": len(target_ids),
            "reviewable_subbranches": sum(1 for branch in subbranches if branch["handling"].startswith("reviewable")),
            "minimum_reviewable_records_per_subbranch": MIN_REVIEWABLE_RECORDS,
        },
        "interpretive_result": "C04はコミュニケーション能力問題ではなく、説明・確認・暗黙知・責任・訓練・評価・安全確認を、仕事参加へ接続する情報参加構造である。少数枝だが、多数派の健康時間・支援接続・物理環境に吸収すると重要な自由度を失う。",
        "scientific_discovery_candidate": "情報参加は『情報を受け取る/伝える』だけではなく、仕事の責任、評価、キャリア、安全、支援役割を同期するための構造自由度である。",
        "subbranches": subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C04 Information Participation Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 派生信号の構造再読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C04を、本人のコミュニケーション能力問題ではなく、情報参加が仕事参加へどう接続するかの構造として読み直した。",
        "",
        "## 結論",
        "",
        payload["interpretive_result"],
        "",
        "## 科学的発見候補",
        "",
        payload["scientific_discovery_candidate"],
        "",
        f"C04/information boundary target records: {payload['source_set']['c04_or_information_boundary_records']}",
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
                f"- information_axis: {', '.join(f'{key}:{value}' for key, value in dist['axis_counts'].items())}",
                "",
            ]
        )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C04を本人の説明能力やコミュニケーション能力へ還元しない。",
            "- 情報参加は、説明、確認、暗黙知、責任分担、訓練、評価、安全確認、キャリア接続の構造として読む。",
            "- 少数枝でも、C01/C02/C03/C05/C06へ吸収せず、情報参加が主自由度になる場合を保持する。",
            "- 物理環境や支援機器があることを、情報参加の軽減や有効性の証拠にしない。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
