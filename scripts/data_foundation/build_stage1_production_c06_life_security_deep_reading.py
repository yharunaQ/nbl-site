#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.md"
MIN_REVIEWABLE_RECORDS = 10

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

CURRENT_STATUSES = {"currently_working"}
NONCURRENT_STATUSES = {
    "not_working_wants_work",
    "job_transition_or_training",
    "never_worked",
    "past_work_not_current",
    "no_current_work_wish",
    "unknown_or_other",
}


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
    status_group = row.get("status_group")
    return {
        "current_work_context": status_group in CURRENT_STATUSES,
        "noncurrent_or_transition_context": status_group in NONCURRENT_STATUSES,
        "life_security_current_work_choice": has_tag(record, "P1-C06A"),
        "life_security_transition_pressure": has_tag(record, "P1-C06B"),
        "life_security_support_bridge": has_tag(record, "P1-C06C"),
        "life_security_health_time_boundary": has_tag(record, "P1-C06D"),
        "life_security_evaluation_boundary": has_tag(record, "P1-C06E"),
        "c01_health_time_bridge": has_branch(record, "P1-C01A", "P1-C01B", "P1-C01C") or has_tag(record, "P1-C01D"),
        "c02_translation_bridge": has_branch(record, "P1-C02A", "P1-C02B") or has_tag(record, "P1-C02C", "P1-C02D"),
        "c03_support_bridge": has_branch(record, "P1-C03A", "P1-C03B", "P1-C03C") or has_tag(record, "P1-C03D"),
        "c04_information_bridge": has_branch(record, "P1-C04A-1", "P1-C04A-2", "P1-C04A-3") or has_tag(record, "P1-C04B"),
        "c05_worksite_bridge": has_branch(record, "P1-C05A", "P1-C05B", "P1-C05D") or has_tag(record, "P1-C05C", "P1-C05E"),
    }


def classify(profile: dict[str, bool]) -> str:
    if profile["current_work_context"] and profile["life_security_current_work_choice"]:
        return "C06L-1-current-work-choice-life-security"
    if profile["noncurrent_or_transition_context"] and profile["life_security_transition_pressure"]:
        return "C06L-2-transition-life-security-pressure"
    if profile["current_work_context"] and profile["life_security_health_time_boundary"]:
        return "C06L-3-current-health-time-life-security-boundary"
    if profile["life_security_support_bridge"] and profile["life_security_evaluation_boundary"]:
        return "C06L-4-support-evaluation-life-security-boundary"
    if profile["life_security_support_bridge"]:
        return "C06L-5-support-life-security-bridge"
    if profile["life_security_health_time_boundary"]:
        return "C06L-6-health-time-life-security-residual-boundary"
    if profile["life_security_evaluation_boundary"]:
        return "C06L-7-evaluation-life-security-residual-boundary"
    return "C06L-Z-mixed-or-low-context"


def compact_distribution(record_ids: set[str], rows: dict[str, dict[str, Any]], profiles: dict[str, dict[str, bool]]) -> dict[str, Any]:
    source = Counter(record_id.split(":", 1)[0] for record_id in record_ids)
    status = Counter()
    pattern = Counter()
    diversity = Counter()
    job_type = Counter()
    axis = Counter()
    for record_id in record_ids:
        row = rows[record_id]
        status[row.get("status_group", "unknown")] += 1
        pattern[row.get("pattern_cell_id", "unknown")] += 1
        diversity.update(row.get("health_condition_groups", [])[:8])
        diversity.update(row.get("body_function_signals", [])[:8])
        diversity.update(row.get("impairment_signals", [])[:8])
        diversity.update(row.get("handbook_signals", [])[:8])
        job_type.update(row.get("job_type_signals", [])[:8])
        axis.update(key for key, value in profiles[record_id].items() if value)
    return {
        "source_counts": dict(source.most_common()),
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(10)),
        "diversity_anchor_counts": dict(diversity.most_common(14)),
        "job_type_counts": dict(job_type.most_common(10)),
        "axis_counts": dict(axis.most_common()),
    }


def branch_specs() -> dict[str, dict[str, str]]:
    return {
        "C06L-1-current-work-choice-life-security": {
            "title": "就労中の生活保障・仕事選択境界",
            "candidate_proposition": "就労中でも、収入、処遇、生活満足、将来見通しが仕事内容、働き方、配慮、評価と接続しない場合、仕事を続ける自由度や仕事を選び直す自由度が狭まる可能性。",
            "counter_proposition": "生活保障信号は、仕事構造ではなく一般的な生活満足、雇用形態、賃金水準、家族条件、地域条件の反映かもしれない。",
            "handling": "reviewable_cross_domain_subbranch",
        },
        "C06L-2-transition-life-security-pressure": {
            "title": "移行期の生活保障圧力",
            "candidate_proposition": "未就労、離職後、職業準備、再就職では、生活保障の圧力が、仕事選択、応募条件、訓練参加、支援利用、健康回復の順序を狭める可能性。",
            "counter_proposition": "移行困難は生活保障ではなく、健康安定、職業準備、地域求人、支援接続、入口翻訳、本人希望の未確定で説明できる可能性がある。",
            "handling": "reviewable_transition_subbranch",
        },
        "C06L-3-current-health-time-life-security-boundary": {
            "title": "就労中の健康時間・生活保障境界",
            "candidate_proposition": "治療、体調変動、回復、勤務継続の時間構造が生活保障と接続すると、短時間勤務、休職、復職、仕事内容変更、収入維持の自由度が一体で問題化する可能性。",
            "counter_proposition": "主構造は健康時間や仕事設計であり、生活保障は背景条件にすぎない可能性がある。",
            "handling": "reviewable_boundary_subbranch",
        },
        "C06L-4-support-evaluation-life-security-boundary": {
            "title": "支援・評価処遇・生活保障境界",
            "candidate_proposition": "支援接続や評価・処遇が、生活保障と結びつく場合、単なる支援利用や職場満足ではなく、役割、賃金、制度対象、仕事継続の自由度を左右する可能性。",
            "counter_proposition": "支援、評価、処遇、生活保障が同時に出ているだけで、因果的・構造的接続までは示していない可能性がある。",
            "handling": "reviewable_quality_boundary_subbranch",
        },
        "C06L-5-support-life-security-bridge": {
            "title": "支援接続と生活保障の橋渡し",
            "candidate_proposition": "支援は、相談資源の存在ではなく、収入、制度、生活再建、仕事条件、職場接続を翻訳し、生活保障圧力の下で仕事選択の自由度を増やす橋渡しとして働く可能性。",
            "counter_proposition": "支援接続の信号は、困難の大きさを示すだけで、生活保障上の自由度を増やす働きまでは示していない可能性がある。",
            "handling": "reviewable_bridge_subbranch",
        },
        "C06L-6-health-time-life-security-residual-boundary": {
            "title": "健康時間・生活保障残存境界",
            "candidate_proposition": "健康時間と生活保障が接しているが、仕事選択、支援接続、評価処遇へまだ十分に分解できない場合、治療と収入維持の自由度が潜在的な主構造として残る可能性。",
            "counter_proposition": "現段階の分類規則が粗く、C01健康時間またはC03支援接続へ再分類すべき可能性がある。",
            "handling": "boundary_hold_not_standalone_promotion",
        },
        "C06L-7-evaluation-life-security-residual-boundary": {
            "title": "評価処遇・生活保障残存境界",
            "candidate_proposition": "評価、処遇、役割、満足の信号が生活保障と接するが、仕事設計や支援接続へまだ十分に分解できない場合、キャリア参加の自由度として残る可能性。",
            "counter_proposition": "生活保障ではなく、C04情報参加、C05作業環境、一般的な職場満足、雇用形態の問題かもしれない。",
            "handling": "boundary_hold_not_standalone_promotion",
        },
        "C06L-Z-mixed-or-low-context": {
            "title": "混合または低文脈の生活保障信号",
            "candidate_proposition": "生活保障に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要な生活保障構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def main() -> None:
    records, rows = load_records()
    c06_tags = {"P1-C06A", "P1-C06B", "P1-C06C", "P1-C06D", "P1-C06E"}
    target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if c06_tags & record["boundary_tags"]
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
            "c06_life_security_boundary_records": len(target_ids),
            "reviewable_subbranches": sum(1 for branch in subbranches if branch["handling"].startswith("reviewable")),
            "minimum_reviewable_records_per_subbranch": MIN_REVIEWABLE_RECORDS,
        },
        "interpretive_result": "C06は生活困窮や意欲の問題ではなく、収入、制度対象、処遇、健康時間、支援接続、仕事選択の自由度を制約する生活保障面として読む必要がある。生活保障は背景ではなく、仕事選択・継続・再就職の構造を変える接触面である。",
        "scientific_discovery_candidate": "生活保障は、本人の働く意欲や能力を判断する材料ではなく、どの仕事を選べるか、どの支援を使えるか、どの健康時間を確保できるかを変える制約面である。この面を読むと、同じ機能障害でも支援の有効性が変わる理由を説明しやすくなる。",
        "subbranches": subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C06 Life Security Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 派生信号の構造再読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C06を、生活困窮や意欲の問題ではなく、仕事選択・健康時間・支援接続・評価処遇を制約する生活保障面として読み直した。",
        "",
        "## 結論",
        "",
        payload["interpretive_result"],
        "",
        "## 科学的発見候補",
        "",
        payload["scientific_discovery_candidate"],
        "",
        f"C06 life-security boundary target records: {payload['source_set']['c06_life_security_boundary_records']}",
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
                f"- job_type: {', '.join(f'{key}:{value}' for key, value in dist['job_type_counts'].items())}",
                f"- life_security_axis: {', '.join(f'{key}:{value}' for key, value in dist['axis_counts'].items())}",
                "",
            ]
        )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C06を、貧困、満足度、意欲、本人責任へ還元しない。",
            "- 生活保障は背景条件ではなく、仕事選択、就労継続、再就職、健康時間、支援接続、評価処遇の自由度を変える接触面として読む。",
            "- 生活保障信号が強いことを、就労可能性、就労意欲、支援有効性の判断に使わない。",
            "- 支援や配慮の有無だけでなく、生活保障圧力の下で、その支援が自由度を増やすかを読む。",
            "",
        ]
    )
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
