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
OUT_JSON = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.md"
MIN_REVIEWABLE_RECORDS = 10

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

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


def has_branch(record: dict[str, Any], *branch_ids: str) -> bool:
    return bool(set(branch_ids) & record["branches"])


def has_subbranch(record: dict[str, Any], subbranch_id: str) -> bool:
    return subbranch_id in record["dominant"] or subbranch_id in record["secondary"]


def axis_profile(record: dict[str, Any], row: dict[str, Any]) -> dict[str, bool]:
    return {
        "consultation_entry": has_subbranch(record, "C03-1-consultation-entry"),
        "role_division_linkage": has_subbranch(record, "C03-2-role-division-linkage"),
        "service_fit": has_subbranch(record, "C03-3-service-fit"),
        "continuity_support": has_subbranch(record, "C03-4-continuity-support") or "P1-C03D" in record["boundary_tags"],
        "job_development_referral": has_subbranch(record, "C03-5-job-development-referral"),
        "c02_translation_bridge": has_branch(record, "P1-C02A", "P1-C02B") or "P1-C02C" in record["boundary_tags"] or "P1-C02D" in record["boundary_tags"],
        "c01_health_time_bridge": has_branch(record, "P1-C01A", "P1-C01B", "P1-C01C"),
        "current_work_context": row.get("status_group") in CURRENT_STATUSES,
        "transition_context": row.get("status_group") in TRANSITION_STATUSES,
    }


def classify(profile: dict[str, bool]) -> str:
    if profile["current_work_context"] and profile["continuity_support"] and (
        profile["c02_translation_bridge"] or profile["c01_health_time_bridge"]
    ):
        return "C03S-1-current-continuity-retranslation"
    if profile["transition_context"] and profile["consultation_entry"] and profile["job_development_referral"]:
        return "C03S-2-transition-entry-to-job-development"
    if profile["service_fit"] and profile["role_division_linkage"]:
        return "C03S-3-role-division-service-fit"
    if profile["consultation_entry"] and not profile["continuity_support"]:
        return "C03S-4-entry-without-continuity"
    if profile["continuity_support"] and not profile["consultation_entry"]:
        return "C03S-5-continuity-without-entry-signal"
    if profile["c02_translation_bridge"] and (profile["consultation_entry"] or profile["role_division_linkage"] or profile["service_fit"]):
        return "C03S-6-support-as-translation-mediator"
    return "C03S-Z-mixed-or-low-context"


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
        "C03S-1-current-continuity-retranslation": {
            "title": "就労中の継続支援による再翻訳",
            "candidate_proposition": "就労中の支援は、単発相談ではなく、病状変化、仕事内容変更、職場理解、健康時間、入口翻訳を就職後に再翻訳する自由度として働く可能性。",
            "counter_proposition": "継続支援の信号は、困難が大きいケースに支援接続が長く残っているだけで、再翻訳構造を示していない可能性がある。",
            "handling": "reviewable_core_subbranch",
        },
        "C03S-2-transition-entry-to-job-development": {
            "title": "移行期の相談入口から仕事開拓への接続",
            "candidate_proposition": "再就職・求職・実習では、相談入口が求人条件、職場開拓、職業訓練、本人条件説明へ接続すると、入口翻訳の自由度が増える可能性。",
            "counter_proposition": "相談入口ではなく、地域求人量、職業準備、生活保障、体調安定、制度資格が主構造かもしれない。",
            "handling": "reviewable_core_subbranch",
        },
        "C03S-3-role-division-service-fit": {
            "title": "役割分担とサービス適合の支援品質境界",
            "candidate_proposition": "支援資源があっても、本人、職場、医療、福祉、職業支援の役割分担とサービス適合が弱い場合、自由度が増えない可能性。",
            "counter_proposition": "サービス適合に見える問題は、本人条件、職場条件、地域資源、制度対象の問題かもしれない。",
            "handling": "reviewable_quality_subbranch",
        },
        "C03S-4-entry-without-continuity": {
            "title": "相談入口はあるが継続接続が弱い枝",
            "candidate_proposition": "相談入口があっても、就職後・復職・病状変化・仕事内容変更へ接続しなければ、支援資源は構造的自由度になりにくい可能性。",
            "counter_proposition": "継続接続が不要なケース、または現信号では見えていないケースを過剰に問題化している可能性がある。",
            "handling": "reviewable_boundary_subbranch",
        },
        "C03S-5-continuity-without-entry-signal": {
            "title": "継続支援信号が入口より強い枝",
            "candidate_proposition": "相談入口よりも、就職後・復職・変化時の接続が強く出る場合、入口有無ではなく継続的な再翻訳機能を主構造として読む必要がある可能性。",
            "counter_proposition": "入口情報が欠落しているだけで、継続支援が独立構造とは限らない。",
            "handling": "reviewable_boundary_subbranch",
        },
        "C03S-6-support-as-translation-mediator": {
            "title": "支援がC02入口翻訳を媒介する枝",
            "candidate_proposition": "支援者・相談先が、本人条件と求人・職務条件の相互翻訳を媒介することで、入口・就労中・再就職の自由度を増やす可能性。",
            "counter_proposition": "支援の存在を翻訳成立と同一視している可能性がある。C02本体の問題として読むべき場合もある。",
            "handling": "bridge_to_C02_not_standalone_promotion",
        },
        "C03S-Z-mixed-or-low-context": {
            "title": "混合または低文脈の支援接続信号",
            "candidate_proposition": "支援接続に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要な支援構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def main() -> None:
    records, rows = load_records()
    target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if {"P1-C03A", "P1-C03B", "P1-C03C"} & record["branches"]
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
            "c03a_or_c03b_or_c03c_records": len(target_ids),
            "reviewable_subbranches": sum(1 for branch in subbranches if branch["handling"].startswith("reviewable")),
            "minimum_reviewable_records_per_subbranch": MIN_REVIEWABLE_RECORDS,
        },
        "interpretive_result": "C03は支援資源の有無ではなく、相談入口、継続再翻訳、役割分担、サービス適合、仕事開拓がどの局面で自由度を増やすかとして読む構造である。",
        "subbranches": subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C03 Support Continuity Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / LLM文脈読解由来信号の構造再読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C03を、支援資源の有無ではなく、入口・継続・役割分担・サービス適合・仕事開拓の接続構造として読み直した。",
        "",
        "## 結論",
        "",
        payload["interpretive_result"],
        "",
        f"C03A/C03B/C03C target records: {payload['source_set']['c03a_or_c03b_or_c03c_records']}",
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
                f"- support_axis: {', '.join(f'{key}:{value}' for key, value in dist['axis_counts'].items())}",
                "",
            ]
        )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C03を『支援がある/ない』に縮めない。",
            "- 相談入口と継続接続を分け、入口が何へ接続するかを読む。",
            "- 継続支援は有効性判断ではなく、就職後・復職・変化時の再翻訳自由度として扱う。",
            "- 役割分担・サービス適合・仕事開拓は、C03の質を分ける軸として扱う。",
            "- C02との接続は、支援が本人条件と求人条件の相互翻訳を媒介する場合に限って読む。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
