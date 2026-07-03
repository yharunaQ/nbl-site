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
OUT_JSON = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.md"
MIN_REVIEWABLE_RECORDS = 10

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

SELF_TO_EMPLOYER_TERMS = (
    "説明",
    "伝える",
    "アピール",
    "配慮等を伝える",
    "病気や障害について説明",
    "障害について説明",
    "コミュニケーション",
    "面接",
    "履歴書",
)
JOB_TO_LIFE_TERMS = (
    "勤務時間",
    "休日",
    "休憩",
    "通勤",
    "仕事内容",
    "仕事の内容",
    "職務",
    "責任",
    "配置",
    "作業",
    "ノルマ",
    "治療",
    "通院",
    "体力",
    "疲労",
    "ストレス",
    "職場の出入り",
    "職場内の移動",
)
DISCLOSURE_SCOPE_TERMS = (
    "開示",
    "非開示",
    "伝える範囲",
    "説明する範囲",
    "病気や障害について説明",
)
SUPPORT_MEDIATION_TERMS = (
    "支援",
    "相談",
    "同席",
    "ハローワーク",
    "就労移行",
    "就業・生活支援",
    "職業センター",
    "主治医",
    "ソーシャルワーカー",
    "難病相談",
)
INSTITUTION_TERMS = (
    "手帳",
    "障害者雇用",
    "雇用率制度",
    "制度",
    "等級",
    "受給者証",
)
ENTRY_STAGE_TERMS = (
    "応募",
    "就職活動",
    "求職",
    "面接",
    "実習",
    "見学",
    "職業訓練",
    "就労移行",
    "再就職",
)

CURRENT_STATUSES = {"currently_working"}
TRANSITION_STATUSES = {"not_working_wants_work", "job_transition_or_training", "never_worked", "past_work_not_current"}


def load_records() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    records: dict[str, dict[str, Any]] = defaultdict(
        lambda: {
            "branches": set(),
            "boundary_tags": set(),
            "dominant": set(),
            "secondary": set(),
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


def axis_profile(record: dict[str, Any], row: dict[str, Any]) -> dict[str, bool]:
    all_problem = text_values(
        row,
        (
            "readiness_unresolved",
            "job_search_unresolved",
            "pre_employment_unresolved",
            "post_employment_unresolved",
            "accommodations_present",
            "accommodations_needed_absent",
            "disclosure_gaps",
            "support_use_gaps",
            "consultation_gaps",
            "service_fit_gaps",
            "desired_supports",
            "job_type_signals",
            "handbook_signals",
        ),
    )
    support_values = text_values(
        row,
        (
            "support_use_gaps",
            "consultation_sources",
            "consultation_gaps",
            "service_fit_gaps",
            "desired_supports",
        ),
    )
    institution_values = text_values(row, ("handbook_signals", "job_type_signals"))
    status = row.get("status_group")
    return {
        "self_condition_to_employer": "C02-1-self-condition-to-employer" in record["dominant"]
        or "C02-1-self-condition-to-employer" in record["secondary"]
        or has_any(all_problem, SELF_TO_EMPLOYER_TERMS),
        "job_condition_to_life_health": "C02-2-job-condition-to-life" in record["dominant"]
        or "C02-2-job-condition-to-life" in record["secondary"]
        or has_any(all_problem, JOB_TO_LIFE_TERMS),
        "disclosure_scope_boundary": "C02-3-disclosure-scope" in record["dominant"]
        or "C02-3-disclosure-scope" in record["secondary"]
        or has_any(all_problem, DISCLOSURE_SCOPE_TERMS)
        or bool(row.get("disclosure_gaps")),
        "institutional_status_modifier": "C02-4-institutional-status" in record["dominant"]
        or "C02-4-institutional-status" in record["secondary"]
        or has_any(institution_values, INSTITUTION_TERMS),
        "support_mediated_translation": "C02-5-supporter-translation-presence" in record["dominant"]
        or "C02-5-supporter-translation-presence" in record["secondary"]
        or "P1-C02C" in record["boundary_tags"]
        or has_any(support_values, SUPPORT_MEDIATION_TERMS),
        "continuity_after_entry": status in CURRENT_STATUSES and bool(row.get("post_employment_unresolved") or row.get("accommodations_needed_absent")),
        "transition_search_translation": status in TRANSITION_STATUSES
        and (
            bool(row.get("job_search_unresolved") or row.get("pre_employment_unresolved") or row.get("readiness_unresolved"))
            or has_any(all_problem, ENTRY_STAGE_TERMS)
        ),
        "mutual_translation_boundary": "P1-C02D" in record["boundary_tags"],
    }


def classify(profile: dict[str, bool], row: dict[str, Any]) -> str:
    status = row.get("status_group")
    self_axis = profile["self_condition_to_employer"]
    job_axis = profile["job_condition_to_life_health"]
    support_axis = profile["support_mediated_translation"]
    institution_axis = profile["institutional_status_modifier"]
    disclosure_axis = profile["disclosure_scope_boundary"]

    if status in CURRENT_STATUSES and self_axis and job_axis:
        return "C02T-1-current-bidirectional-residual"
    if status in TRANSITION_STATUSES and self_axis and job_axis:
        return "C02T-2-transition-bidirectional-entry"
    if status in CURRENT_STATUSES and job_axis and not self_axis:
        return "C02T-3-current-job-condition-to-life-dominant"
    if status in CURRENT_STATUSES and self_axis and not job_axis:
        return "C02T-4-current-self-condition-to-employer-dominant"
    if status in TRANSITION_STATUSES and job_axis and not self_axis:
        return "C02T-5-transition-job-condition-to-life-dominant"
    if status in TRANSITION_STATUSES and self_axis and not job_axis:
        return "C02T-6-transition-self-condition-to-employer-dominant"
    if support_axis and (disclosure_axis or self_axis or job_axis):
        return "C02T-7-support-mediated-translation-bridge"
    if institution_axis:
        return "C02T-8-institutional-status-modifier-low-context"
    return "C02T-Z-mixed-or-low-context"


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
        "diversity_anchor_counts": dict(diversity.most_common(12)),
        "axis_counts": dict(axis.most_common()),
    }


def branch_specs() -> dict[str, dict[str, str]]:
    return {
        "C02T-1-current-bidirectional-residual": {
            "title": "就労中の双方向翻訳残存",
            "candidate_proposition": "就労中でも、本人条件を仕事設計へ翻訳する方向と、職務・勤務・職場条件を生活・健康管理へ翻訳する方向が両方残る場合、入口問題は就職後調整として持続する可能性。",
            "counter_proposition": "双方向翻訳ではなく、健康時間、職務再設計、職場理解、支援継続のいずれかが主構造かもしれない。",
            "handling": "reviewable_core_subbranch",
        },
        "C02T-2-transition-bidirectional-entry": {
            "title": "移行期の双方向入口翻訳",
            "candidate_proposition": "再就職・求職・実習・職業訓練では、本人条件の企業語化と求人条件の生活語化が同時に成立しないと、仕事選択や応募条件の自由度が狭まる可能性。",
            "counter_proposition": "入口翻訳ではなく、地域求人量、生活保障、職業準備、体調安定、支援制度対象の問題かもしれない。",
            "handling": "reviewable_core_subbranch",
        },
        "C02T-3-current-job-condition-to-life-dominant": {
            "title": "就労中の求人・職務条件生活語化優勢",
            "candidate_proposition": "勤務時間、職務、通勤、休憩、作業条件が本人の生活・健康管理条件に翻訳されない場合、就労中の残存困難として現れる可能性。",
            "counter_proposition": "本人条件の説明不足ではなく、仕事設計や職場内解釈の問題として読むべき可能性がある。",
            "handling": "reviewable_directional_subbranch",
        },
        "C02T-4-current-self-condition-to-employer-dominant": {
            "title": "就労中の本人条件企業語化優勢",
            "candidate_proposition": "本人の機能・体調・支援条件が、職務、評価、配置、同僚理解に接続する言葉へ翻訳されない場合、就労中の摩擦が残る可能性。",
            "counter_proposition": "本人の説明能力問題ではなく、企業側の受け取り形式、支援者の媒介、職務設計の未整備かもしれない。",
            "handling": "reviewable_directional_subbranch",
        },
        "C02T-5-transition-job-condition-to-life-dominant": {
            "title": "移行期の求人条件生活語化優勢",
            "candidate_proposition": "求人、勤務時間、職場環境、実習条件が本人の生活・健康管理条件として読めない場合、応募先選択や就労開始前の見通しが狭まる可能性。",
            "counter_proposition": "求人条件の翻訳ではなく、就労希望、経験不足、地域求人、生活保障、支援接続の問題かもしれない。",
            "handling": "reviewable_directional_subbranch",
        },
        "C02T-6-transition-self-condition-to-employer-dominant": {
            "title": "移行期の本人条件企業語化優勢",
            "candidate_proposition": "求職・面接・実習で、本人条件を仕事実行条件として説明・調整する自由度が弱い場合、入口での摩擦が大きくなる可能性。",
            "counter_proposition": "本人側の説明問題ではなく、求人側の条件提示、支援者同席、制度ステータス、開示範囲の問題かもしれない。",
            "handling": "reviewable_directional_subbranch",
        },
        "C02T-7-support-mediated-translation-bridge": {
            "title": "支援媒介型入口翻訳",
            "candidate_proposition": "支援者、相談先、医療・福祉・職業支援が入口翻訳を媒介する場合、本人条件と求人条件の相互翻訳を補う自由度になりうる。",
            "counter_proposition": "支援利用・相談先の存在は、有効な翻訳成立を意味しない。C03の支援接続問題として読むべき可能性がある。",
            "handling": "bridge_to_C03_not_standalone_promotion",
        },
        "C02T-8-institutional-status-modifier-low-context": {
            "title": "制度ステータス修飾・低文脈",
            "candidate_proposition": "手帳、制度、雇用率等は、入口翻訳を助ける場合も制約する場合もある修飾因子として扱う。",
            "counter_proposition": "制度ステータスを独立説明にすると、個別の仕事条件・支援条件・健康条件の構造を失う。",
            "handling": "modifier_only",
        },
        "C02T-Z-mixed-or-low-context": {
            "title": "混合または低文脈の入口翻訳信号",
            "candidate_proposition": "入口翻訳に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要な同型構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def main() -> None:
    records, rows = load_records()
    target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if {"P1-C02A", "P1-C02B"} & record["branches"]
    )
    profiles = {record_id: axis_profile(records[record_id], rows[record_id]) for record_id in target_ids}
    class_ids: dict[str, list[str]] = defaultdict(list)
    for record_id in target_ids:
        class_ids[classify(profiles[record_id], rows[record_id])].append(record_id)

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
            "c02a_or_c02b_records": len(target_ids),
            "reviewable_subbranches": sum(
                1 for branch in subbranches if branch["handling"].startswith("reviewable")
            ),
            "minimum_reviewable_records_per_subbranch": MIN_REVIEWABLE_RECORDS,
        },
        "interpretive_result": "C02は『本人が説明するか』ではなく、本人条件と求人・職務条件を相互翻訳し、就労中・移行期・支援媒介・制度修飾の局面に分けて読む構造である。単方向だけで独立レビューに耐える枝は少なく、中心は双方向翻訳として残る。",
        "subbranches": subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C02 Translation Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / LLM文脈読解由来信号の構造再読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C02を、本人の説明問題ではなく、本人条件と求人・職務・職場条件の相互翻訳構造として読み直した。",
        "",
        "## 結論",
        "",
        payload["interpretive_result"],
        "",
        f"C02A/C02B target records: {payload['source_set']['c02a_or_c02b_records']}",
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
                f"- translation_axis: {', '.join(f'{key}:{value}' for key, value in dist['axis_counts'].items())}",
                "",
            ]
        )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C02を『本人が企業に説明できるか』に縮めない。",
            "- 入口翻訳は、本人条件の企業語化と、求人・職務条件の生活/健康管理語化の双方向で読む。",
            "- 単方向枝が10件未満の場合は独立候補命題にせず、双方向枝の修飾・例外・境界として復活させる。",
            "- 支援者・相談先は、翻訳を媒介する自由度として扱うが、有効性判断にはしない。",
            "- 手帳・制度ステータスは主命題ではなく、翻訳の自由度を変える修飾因子として扱う。",
            "- 就労中と移行期は別局面だが、同じ相互翻訳構造が残存・入口・再翻訳として現れる。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
