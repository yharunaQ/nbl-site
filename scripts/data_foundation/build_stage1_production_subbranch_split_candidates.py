#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-subbranch-split-candidates-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-subbranch-split-candidates-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

TEXT_FIELDS = [
    "health_condition_groups",
    "impairment_signals",
    "handbook_signals",
    "body_function_signals",
    "work_status_label",
    "job_type_signals",
    "readiness_unresolved",
    "job_search_unresolved",
    "pre_employment_unresolved",
    "post_employment_unresolved",
    "accommodations_present",
    "accommodations_needed_absent",
    "support_use_gaps",
    "consultation_gaps",
    "service_fit_gaps",
    "disclosure_gaps",
    "desired_supports",
    "narrative_context_labels",
    "low_soc_or_life_signals",
    "satisfaction_risks",
]

TARGET_BRANCHES = {
    "P1-C01A",
    "P1-C01B",
    "P1-C01C",
    "P1-C02A",
    "P1-C02B",
    "P1-C03A",
    "P1-C03B",
    "P1-C03C",
    "P1-C05A",
    "P1-C05B",
    "P1-C05D",
}

SUBBRANCH_RULES: dict[str, dict[str, tuple[str, ...]]] = {
    "C01": {
        "C01-1-work-hours-leave": ("勤務時間", "休日", "出退勤", "短時間", "フルタイム", "休暇", "欠勤", "有給"),
        "C01-2-rest-recovery-place": ("休憩", "疲労回復", "休憩所", "健康管理", "休息"),
        "C01-3-task-load-substitution": ("仕事内容", "業務", "職務", "課題", "負担", "代替", "配置", "転換"),
        "C01-4-workplace-understanding": ("理解", "説明", "配慮", "偏見", "同僚", "上司", "職場理解"),
        "C01-5-long-term-continuity": ("長期", "復職", "休職", "進行", "継続", "配置", "疾患進行"),
    },
    "C02": {
        "C02-1-self-condition-to-employer": ("企業に", "説明", "配慮を伝え", "誤解", "アピール", "面接"),
        "C02-2-job-condition-to-life": ("求人", "希望の仕事", "会社についての情報", "職場見学", "実習", "仕事内容", "勤務時間"),
        "C02-3-disclosure-scope": ("開示", "説明したいができない", "伝える", "必要な環境整備"),
        "C02-4-institutional-status": ("障害者雇用", "手帳", "制度", "トライアル", "雇用率"),
        "C02-5-supporter-translation-presence": ("支援者同席", "同席", "ケース会議", "支援機関", "説明支援"),
    },
    "C03": {
        "C03-1-consultation-entry": ("相談", "窓口", "知らなかった", "利用の仕方", "カウンセリング"),
        "C03-2-role-division-linkage": ("役割分担", "医療", "職場担当者", "主治医", "産業医", "ケース会議", "連携"),
        "C03-3-service-fit": ("役に立たなかった", "ニーズには合わなかった", "必要だが", "利用したことはないが必要"),
        "C03-4-continuity-support": ("就職後も相談", "継続", "長期", "復職", "進行時", "フォロー"),
        "C03-5-job-development-referral": ("職場開拓", "求人確保", "あっせん", "紹介", "職場実習"),
    },
    "C05": {
        "C05-1-commuting-route": ("通勤", "移動", "交通機関", "歩行", "階段", "経路"),
        "C05-2-posture-operation": ("姿勢", "立った姿勢", "座位", "手指", "上肢", "下肢", "運搬"),
        "C05-3-worksite-facility": ("設備", "作業場所", "作業机", "道具", "施設", "ドア", "スロープ", "通路", "トイレ"),
        "C05-4-rest-fatigue-boundary": ("休憩", "疲労", "体調", "健康管理", "疲れ"),
        "C05-5-information-access-boundary": ("情報", "案内", "音声", "視覚", "聴覚", "意思疎通"),
    },
}


def compact_text(record: dict[str, Any]) -> str:
    values: list[str] = []
    for key in TEXT_FIELDS:
        value = record.get(key)
        if isinstance(value, list):
            values.extend(str(item) for item in value)
        elif isinstance(value, dict):
            values.extend(str(item) for item in value.values())
            values.extend(str(item) for item in value.keys())
        elif value:
            values.append(str(value))
    return " / ".join(values)


def branch_group(branch_id: str) -> str | None:
    if branch_id.startswith("P1-C01"):
        return "C01"
    if branch_id.startswith("P1-C02"):
        return "C02"
    if branch_id.startswith("P1-C03"):
        return "C03"
    if branch_id.startswith("P1-C05"):
        return "C05"
    return None


def load_cases() -> dict[str, dict[str, Any]]:
    records: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                row["_text"] = compact_text(row)
                records[row["record_id"]] = row
    return records


def main() -> None:
    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    records = load_cases()
    subbranch_counts: dict[str, Counter[str]] = defaultdict(Counter)
    secondary_counts: dict[str, Counter[str]] = defaultdict(Counter)
    subbranch_examples: dict[tuple[str, str], list[str]] = defaultdict(list)
    secondary_examples: dict[tuple[str, str], list[str]] = defaultdict(list)
    branch_unassigned: Counter[str] = Counter()
    branch_ambiguous: Counter[str] = Counter()
    record_links: list[dict[str, Any]] = []

    for assignment in assignments:
        record = records.get(assignment["record_id"])
        if not record:
            continue
        text = record["_text"]
        for branch_id in assignment["candidate_branches"]:
            if branch_id not in TARGET_BRANCHES:
                continue
            group = branch_group(branch_id)
            if not group:
                continue
            scored: list[tuple[str, int]] = []
            for subbranch_id, terms in SUBBRANCH_RULES[group].items():
                score = sum(1 for term in terms if term in text)
                if score:
                    scored.append((subbranch_id, score))
            scored.sort(key=lambda item: (-item[1], item[0]))
            if not scored:
                branch_unassigned[branch_id] += 1
                dominant: list[str] = []
                secondary: list[str] = []
            else:
                max_score = scored[0][1]
                dominant = [subbranch_id for subbranch_id, score in scored if score == max_score]
                secondary = [
                    subbranch_id
                    for subbranch_id, score in scored
                    if score < max_score and score >= max_score - 1
                ][:3]
                if len(dominant) > 2:
                    branch_ambiguous[branch_id] += 1
                for subbranch_id in dominant:
                    subbranch_counts[branch_id][subbranch_id] += 1
                    if len(subbranch_examples[(branch_id, subbranch_id)]) < 12:
                        subbranch_examples[(branch_id, subbranch_id)].append(assignment["record_id"])
                for subbranch_id in secondary:
                    secondary_counts[branch_id][subbranch_id] += 1
                    if len(secondary_examples[(branch_id, subbranch_id)]) < 12:
                        secondary_examples[(branch_id, subbranch_id)].append(assignment["record_id"])
            record_links.append(
                {
                    "record_id": assignment["record_id"],
                    "source": assignment["source"],
                    "branch_id": branch_id,
                    "dominant_subbranch_candidates": dominant,
                    "secondary_subbranch_candidates": secondary,
                    "subbranch_scores": dict(scored),
                }
            )

    branch_summaries = []
    for branch_id in sorted(TARGET_BRANCHES):
        branch_summaries.append(
            {
                "branch_id": branch_id,
                "dominant_subbranch_counts": dict(subbranch_counts[branch_id]),
                "secondary_subbranch_counts": dict(secondary_counts[branch_id]),
                "unassigned_count": branch_unassigned[branch_id],
                "ambiguous_dominant_count": branch_ambiguous[branch_id],
                "dominant_examples": {
                    subbranch_id: subbranch_examples[(branch_id, subbranch_id)]
                    for subbranch_id in subbranch_counts[branch_id]
                },
                "secondary_examples": {
                    subbranch_id: secondary_examples[(branch_id, subbranch_id)]
                    for subbranch_id in secondary_counts[branch_id]
                },
            }
        )

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "interpretation": "Subbranch candidates narrow the next LLM reading target; they are not final propositions.",
        "branch_summaries": branch_summaries,
        "record_links": record_links,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production Subbranch Split Candidates",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "この出力は、大枝を候補命題へ直行させず、次のLLM文脈読解を自由度別に狭めるための分割候補である。",
        "",
    ]
    for summary in branch_summaries:
        lines.extend([
            f"## {summary['branch_id']}",
            "",
            f"曖昧優勢ケース数: {summary['ambiguous_dominant_count']}",
            "",
            "| dominant subbranch | count | examples |",
            "|---|---:|---|",
        ])
        for subbranch_id, count in sorted(summary["dominant_subbranch_counts"].items(), key=lambda item: (-item[1], item[0])):
            examples = ", ".join(f"`{rid}`" for rid in summary["dominant_examples"][subbranch_id][:6])
            lines.append(f"| `{subbranch_id}` | {count} | {examples} |")
        lines.append(f"| no-subbranch-hit | {summary['unassigned_count']} | なし |")
        lines.extend(["", "| secondary near-tie | count | examples |", "|---|---:|---|"])
        for subbranch_id, count in sorted(summary["secondary_subbranch_counts"].items(), key=lambda item: (-item[1], item[0])):
            examples = ", ".join(f"`{rid}`" for rid in summary["secondary_examples"][subbranch_id][:6])
            lines.append(f"| `{subbranch_id}` | {count} | {examples} |")
        lines.append("")
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
