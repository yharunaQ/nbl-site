#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Callable


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.md"

INPUTS = [
    ROOT
    / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT
    / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
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

TERMS = {
    "hearing_info_anchor": ["難聴", "ろう", "聴覚", "平衡", "言語"],
    "conversation": ["会話", "議論", "意思を伝える", "話や文書", "人と応対", "人間関係"],
    "information_tools": ["意思疎通", "支援機器", "コミュニケーション機器", "電話", "電子メール", "誰もが使いやすい機器"],
    "manual_training": ["作業マニュアル", "研修", "技能訓練", "OJT", "実務指導", "職業スキル"],
    "evaluation": ["昇進", "キャリアアップ", "人事方針", "責任に十分に応える", "処遇", "職業能力"],
    "health_time": ["通院", "服薬", "治療", "健康管理", "疲れ", "体調変動", "疲労", "少しの無理", "休憩", "病状悪化", "疾患自己管理", "両立"],
    "work_design": ["勤務時間", "休日", "仕事内容", "業務", "配置", "転換", "休職", "復職", "出退勤", "職場負担", "働き方"],
    "entry": ["就職活動", "求人", "応募", "面接", "職場実習", "職場見学", "履歴書", "企業に", "説明", "配慮を伝え", "配慮等を伝える", "開示", "アピール"],
    "translation": ["誤解されず", "必要配慮", "必要な配慮", "健康や安全", "会社についての情報", "希望の仕事"],
    "support": ["相談", "支援", "ハローワーク", "職業センター", "就業・生活支援", "主治医", "専門医", "産業医", "自治体", "職業訓練"],
    "service_fit": ["役に立たなかった", "ニーズには合わなかった", "必要だが", "利用の仕方が分からない", "知らなかった", "利用したことはないが必要"],
    "role_translation": ["説明支援", "配慮の整理", "職場開拓", "求人確保", "職業能力の評価", "職業相談", "カウンセリング", "ケース会議", "医療・職場", "関係機関"],
    "continuity": ["就職後も相談", "継続支援", "疾患進行時", "長期", "復職", "配置", "キャリア"],
    "mobility_posture": ["歩行", "移動", "通勤", "姿勢", "立った姿勢", "運搬", "交通機関", "上肢", "下肢", "体幹", "運動協調"],
    "facility_access": ["ドア", "スロープ", "駐車場", "非常口", "手すり", "通路", "床面", "案内", "トイレ", "休憩所", "食堂", "施設改善", "作業机", "機器", "道具", "設備", "作業場所"],
    "information_access": ["案内", "視覚", "聴覚", "音声", "支援機器", "意思疎通", "マニュアル", "文書", "情報"],
    "life_security": ["生活", "収入", "経済", "将来", "人生設計", "地域で安心", "満足度", "処遇", "不適正", "追い詰め", "生活に十分"],
}


def list_count(record: dict[str, Any], key: str) -> int:
    value = record.get(key)
    return len(value) if isinstance(value, list) else 0


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


def row(record: dict[str, Any]) -> dict[str, Any]:
    text = compact_text(record)
    hits = {name: any(term in text for term in terms) for name, terms in TERMS.items()}
    return {
        "record_id": record["record_id"],
        "source": record["record_id"].split(":")[0],
        "status_group": record.get("status_group"),
        "pattern_cell_id": record.get("pattern_cell_id"),
        "pre": list_count(record, "pre_employment_unresolved"),
        "jobsearch": list_count(record, "job_search_unresolved"),
        "readiness": list_count(record, "readiness_unresolved"),
        "post": list_count(record, "post_employment_unresolved"),
        "present": list_count(record, "accommodations_present"),
        "absent": list_count(record, "accommodations_needed_absent"),
        "support_gap": list_count(record, "support_use_gaps")
        + list_count(record, "consultation_gaps")
        + list_count(record, "service_fit_gaps"),
        "disclosure_gap": list_count(record, "disclosure_gaps"),
        "life_low": list_count(record, "low_soc_or_life_signals"),
        "satisfaction": list_count(record, "satisfaction_risks"),
        "hits": [name for name, ok in hits.items() if ok],
        "_hits": hits,
    }


Predicate = Callable[[dict[str, Any]], bool]


def has(r: dict[str, Any], name: str) -> bool:
    return bool(r["_hits"].get(name))


def current(r: dict[str, Any]) -> bool:
    return r["status_group"] == "currently_working"


def noncurrent(r: dict[str, Any]) -> bool:
    return r["status_group"] != "currently_working"


BRANCHES: dict[str, dict[str, Any]] = {
    "P1-C04A-1": {
        "kind": "candidate_branch",
        "label": "情報参加の部分軽減・残存ギャップ",
        "predicate": lambda r: current(r)
        and r["pattern_cell_id"] == "EC-02B-current-work-partial-environment-disclosure-gap"
        and has(r, "hearing_info_anchor")
        and has(r, "conversation")
        and has(r, "information_tools")
        and (has(r, "manual_training") or has(r, "evaluation"))
        and r["present"] >= 8
        and r["post"] >= 5,
    },
    "P1-C04A-2": {
        "kind": "candidate_branch",
        "label": "情報参加の広範未整合",
        "predicate": lambda r: current(r)
        and r["pattern_cell_id"] == "EC-02A-current-work-broad-task-accommodation-underalignment"
        and has(r, "hearing_info_anchor")
        and has(r, "conversation")
        and has(r, "information_tools")
        and (has(r, "manual_training") or has(r, "evaluation"))
        and r["post"] >= 12
        and r["absent"] >= 12,
    },
    "P1-C04A-3": {
        "kind": "candidate_branch",
        "label": "情報参加困難の移行・再就職持ち越し",
        "predicate": lambda r: noncurrent(r)
        and r["pattern_cell_id"] == "EC-10A-past-work-difficulty-carryover"
        and has(r, "hearing_info_anchor")
        and has(r, "conversation")
        and has(r, "information_tools")
        and (has(r, "manual_training") or has(r, "evaluation"))
        and r["pre"] >= 5
        and r["post"] >= 7,
    },
    "P1-C01A": {
        "kind": "candidate_branch",
        "label": "健康時間の部分軽減・残存ギャップ",
        "predicate": lambda r: current(r)
        and has(r, "health_time")
        and has(r, "work_design")
        and r["present"] >= 7
        and (r["post"] >= 1 or r["absent"] >= 2),
    },
    "P1-C01B": {
        "kind": "candidate_branch",
        "label": "健康時間と仕事設計の広範未整合",
        "predicate": lambda r: current(r)
        and has(r, "health_time")
        and has(r, "work_design")
        and r["post"] >= 4
        and r["support_gap"] >= 2,
    },
    "P1-C01C": {
        "kind": "candidate_branch",
        "label": "健康時間困難の移行・再就職持ち越し",
        "predicate": lambda r: noncurrent(r)
        and has(r, "health_time")
        and has(r, "work_design")
        and (r["readiness"] >= 3 or r["jobsearch"] >= 3 or r["pre"] >= 3)
        and r["post"] >= 3,
    },
    "P1-C02A": {
        "kind": "candidate_branch",
        "label": "就労中の入口翻訳残存",
        "predicate": lambda r: current(r)
        and has(r, "entry")
        and (has(r, "translation") or has(r, "support"))
        and (r["pre"] + r["jobsearch"] + r["readiness"] >= 2)
        and (r["post"] >= 1 or r["absent"] >= 2),
    },
    "P1-C02B": {
        "kind": "candidate_branch",
        "label": "移行・再就職での入口翻訳持ち越し",
        "predicate": lambda r: noncurrent(r)
        and has(r, "entry")
        and (has(r, "translation") or has(r, "support"))
        and (r["pre"] + r["jobsearch"] + r["readiness"] >= 3)
        and (r["post"] >= 2 or r["support_gap"] >= 5),
    },
    "P1-C03A": {
        "kind": "candidate_branch",
        "label": "就労中の支援適合ギャップ",
        "predicate": lambda r: current(r)
        and has(r, "support")
        and has(r, "service_fit")
        and r["support_gap"] >= 5
        and r["post"] >= 1,
    },
    "P1-C03B": {
        "kind": "candidate_branch",
        "label": "移行・再就職での支援接続ギャップ",
        "predicate": lambda r: noncurrent(r)
        and has(r, "support")
        and has(r, "service_fit")
        and r["support_gap"] >= 8
        and (r["pre"] + r["jobsearch"] >= 2 or r["post"] >= 2),
    },
    "P1-C03C": {
        "kind": "candidate_branch",
        "label": "支援が翻訳機能を担う枝",
        "predicate": lambda r: has(r, "support")
        and has(r, "service_fit")
        and has(r, "role_translation")
        and (r["pre"] + r["jobsearch"] + r["post"] >= 3),
    },
    "P1-C05A": {
        "kind": "candidate_branch",
        "label": "移動・姿勢と仕事遂行",
        "predicate": lambda r: current(r)
        and has(r, "mobility_posture")
        and r["post"] >= 3,
    },
    "P1-C05B": {
        "kind": "candidate_branch",
        "label": "施設・設備・作業場所と仕事参加",
        "predicate": lambda r: current(r)
        and has(r, "facility_access")
        and (r["present"] + r["absent"] >= 8)
        and r["post"] >= 1,
    },
    "P1-C05D": {
        "kind": "candidate_branch",
        "label": "移行・再就職でのアクセス持ち越し",
        "predicate": lambda r: noncurrent(r)
        and (has(r, "mobility_posture") or has(r, "facility_access"))
        and (r["pre"] + r["jobsearch"] + r["readiness"] >= 3)
        and r["post"] >= 2,
    },
    "P1-C01D": {
        "kind": "boundary_tag",
        "label": "健康時間と移動・物理アクセス",
        "predicate": lambda r: has(r, "health_time")
        and (has(r, "mobility_posture") or has(r, "facility_access"))
        and r["post"] >= 2,
    },
    "P1-C02C": {
        "kind": "boundary_tag",
        "label": "支援接続を介した入口翻訳",
        "predicate": lambda r: has(r, "entry")
        and has(r, "support")
        and r["support_gap"] >= 8,
    },
    "P1-C02D": {
        "kind": "boundary_tag",
        "label": "仕事条件の相互翻訳",
        "predicate": lambda r: has(r, "entry")
        and has(r, "work_design")
        and (r["present"] >= 3 or r["absent"] >= 2),
    },
    "P1-C03D": {
        "kind": "boundary_tag",
        "label": "継続接続",
        "predicate": lambda r: has(r, "continuity") and r["post"] >= 1,
    },
    "P1-C04B": {
        "kind": "boundary_tag",
        "label": "情報参加と健康管理・生活保障・職場環境",
        "predicate": lambda r: has(r, "information_access")
        and (
            has(r, "health_time")
            or has(r, "life_security")
            or has(r, "facility_access")
            or has(r, "work_design")
        )
        and (r["post"] >= 1 or r["absent"] >= 2 or r["life_low"] >= 1),
    },
    "P1-C05C": {
        "kind": "boundary_tag",
        "label": "健康時間・休息場所との境界",
        "predicate": lambda r: has(r, "health_time")
        and (has(r, "mobility_posture") or has(r, "facility_access")),
    },
    "P1-C05E": {
        "kind": "boundary_tag",
        "label": "情報アクセスとの境界",
        "predicate": lambda r: has(r, "information_access")
        and (has(r, "mobility_posture") or has(r, "facility_access")),
    },
    "P1-C06A": {
        "kind": "boundary_tag",
        "label": "就労中の生活保障・仕事選択境界",
        "predicate": lambda r: current(r)
        and has(r, "life_security")
        and (r["life_low"] >= 1 or r["satisfaction"] >= 1)
        and (r["post"] >= 1 or r["absent"] >= 2),
    },
    "P1-C06B": {
        "kind": "boundary_tag",
        "label": "移行・再就職での生活保障圧力",
        "predicate": lambda r: noncurrent(r)
        and has(r, "life_security")
        and (r["readiness"] + r["pre"] + r["jobsearch"] >= 3),
    },
    "P1-C06C": {
        "kind": "boundary_tag",
        "label": "支援接続と生活保障の橋渡し",
        "predicate": lambda r: has(r, "life_security")
        and has(r, "support")
        and r["support_gap"] >= 5,
    },
    "P1-C06D": {
        "kind": "boundary_tag",
        "label": "健康時間と生活保障の境界",
        "predicate": lambda r: has(r, "life_security")
        and has(r, "health_time")
        and (r["post"] >= 2 or r["readiness"] >= 2),
    },
    "P1-C06E": {
        "kind": "boundary_tag",
        "label": "評価・処遇・生活保障の境界",
        "predicate": lambda r: has(r, "life_security")
        and has(r, "evaluation")
        and (r["life_low"] >= 1 or r["satisfaction"] >= 1),
    },
}


def load_records() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for path in INPUTS:
        with path.open() as handle:
            for line in handle:
                records.append(row(json.loads(line)))
    return records


def main() -> None:
    rows = load_records()
    branch_counts: Counter[str] = Counter()
    branch_sources: dict[str, Counter[str]] = defaultdict(Counter)
    branch_status: dict[str, Counter[str]] = defaultdict(Counter)
    branch_cells: dict[str, Counter[str]] = defaultdict(Counter)
    branch_examples: dict[str, list[str]] = defaultdict(list)
    assignments: list[dict[str, Any]] = []

    for r in rows:
        candidate_branches: list[str] = []
        boundary_tags: list[str] = []
        for branch_id, spec in BRANCHES.items():
            if spec["predicate"](r):
                if spec["kind"] == "candidate_branch":
                    candidate_branches.append(branch_id)
                else:
                    boundary_tags.append(branch_id)
                branch_counts[branch_id] += 1
                branch_sources[branch_id][r["source"]] += 1
                branch_status[branch_id][r["status_group"] or "unknown"] += 1
                branch_cells[branch_id][r["pattern_cell_id"] or "unknown"] += 1
                if len(branch_examples[branch_id]) < 20:
                    branch_examples[branch_id].append(r["record_id"])

        if candidate_branches or boundary_tags:
            assignments.append(
                {
                    "record_id": r["record_id"],
                    "source": r["source"],
                    "candidate_branches": candidate_branches,
                    "boundary_tags": boundary_tags,
                }
            )

    branch_summaries = []
    for branch_id, spec in BRANCHES.items():
        branch_summaries.append(
            {
                "branch_id": branch_id,
                "label": spec["label"],
                "kind": spec["kind"],
                "count": branch_counts[branch_id],
                "source_counts": dict(branch_sources[branch_id]),
                "status_counts": dict(branch_status[branch_id]),
                "top_pattern_cells": branch_cells[branch_id].most_common(8),
                "example_record_ids": branch_examples[branch_id],
            }
        )

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "branch_count": len(BRANCHES),
        "record_count": len(rows),
        "assigned_record_count": len(assignments),
        "branch_summaries": branch_summaries,
        "assignments": assignments,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "# Stage 1 Production Branch Assignments",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        f"対象レコード数: {len(rows)}",
        f"割当ありレコード数: {len(assignments)}",
        "",
        "## Branch Counts",
        "",
        "| branch | kind | count | examples |",
        "|---|---:|---:|---|",
    ]
    for summary in branch_summaries:
        examples = ", ".join(f"`{rid}`" for rid in summary["example_record_ids"][:6])
        lines.append(
            f"| `{summary['branch_id']}` {summary['label']} | {summary['kind']} | {summary['count']} | {examples} |"
        )
    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- この割当は本番分析用の機械生成候補であり、人間レビュー済み知識ではない。",
            "- 複数枝への重複割当を許す。SCIMA/FCHMAでは、同じケースが複数自由度の交点に位置することを保持する。",
            "- 本ファイルは本文や非識別化テキストを含まず、record ID と枝IDのみを出力する。",
        ]
    )
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
