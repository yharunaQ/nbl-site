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
OUT_JSON = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

EQUIPMENT_TERMS = (
    "機器",
    "道具",
    "作業机",
    "施設改善",
    "職場の出入り",
    "職場内の移動",
    "冷暖房",
    "トイレ",
    "休憩所",
    "食堂",
    "支援機器",
    "作業マニュアル",
    "研修用テキスト",
    "個人移動用",
    "医療的な器具",
)
TASK_ROLE_TERMS = (
    "職務",
    "責任",
    "課題",
    "技能",
    "注意",
    "判断",
    "ストレス",
    "人間関係",
    "応対",
    "読む",
    "書く",
    "計算",
    "遅刻",
    "早退",
    "欠勤",
    "昇進",
    "報酬",
    "身分",
)
PHYSICAL_OPERATION_TERMS = (
    "歩く",
    "移動",
    "運搬",
    "手と腕",
    "手指",
    "姿勢",
    "トイレ",
    "危険",
    "身なり",
    "服装",
)
ENTRY_TERMS = (
    "説明",
    "アピール",
    "情報",
    "見学",
    "実習",
    "面接",
    "応募",
    "申し込み",
    "履歴書",
    "配慮等を伝える",
)


def load_records() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    records: dict[str, dict[str, Any]] = defaultdict(lambda: {"branches": set(), "dominant": set(), "secondary": set(), "source": ""})
    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    for item in assignments:
        record = records[item["record_id"]]
        record["branches"].update(item["candidate_branches"])
        record["source"] = item["source"]

    subbranch_links = json.loads(SUBBRANCH_JSON.read_text(encoding="utf-8"))["record_links"]
    for item in subbranch_links:
        record = records[item["record_id"]]
        record["branches"].add(item["branch_id"])
        record["dominant"].update(item["dominant_subbranch_candidates"])
        record["secondary"].update(item["secondary_subbranch_candidates"])
        record["source"] = item["source"]

    case_rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                case_rows[row["record_id"]] = row
    return dict(records), case_rows


def record_set(records: dict[str, dict[str, Any]], predicate) -> set[str]:
    return {record_id for record_id, record in records.items() if predicate(record)}


def has_any(values: list[str] | None, terms: tuple[str, ...]) -> bool:
    return any(any(term in value for term in terms) for value in values or [])


def classify(row: dict[str, Any]) -> str:
    equipment_present = has_any(row.get("accommodations_present"), EQUIPMENT_TERMS)
    equipment_absent = has_any(row.get("accommodations_needed_absent"), EQUIPMENT_TERMS)
    task_role = has_any(row.get("post_employment_unresolved"), TASK_ROLE_TERMS)
    physical_operation = has_any(row.get("post_employment_unresolved"), PHYSICAL_OPERATION_TERMS)
    entry_translation = has_any(row.get("pre_employment_unresolved"), ENTRY_TERMS) or bool(row.get("disclosure_gaps"))
    support_signal = bool(row.get("consultation_gaps") or row.get("service_fit_gaps") or row.get("support_use_gaps"))
    status = row.get("status_group")

    if equipment_absent and task_role:
        return "C05P-1-unmet-worksite-arrangement-broad-task-role"
    if equipment_present and not equipment_absent and task_role:
        return "C05P-2-partial-worksite-arrangement-residual-task-role"
    if equipment_absent and physical_operation:
        return "C05P-3-unmet-worksite-arrangement-physical-operation"
    if status in {"past_work_not_current", "never_worked"} and (equipment_absent or entry_translation):
        return "C05P-4-worksite-arrangement-carried-into-transition"
    if entry_translation and support_signal:
        return "C05P-B1-worksite-signal-as-entry-support-translation"
    return "C05P-Z-mixed-or-uncertain"


def compact_distribution(record_ids: set[str], rows: dict[str, dict[str, Any]]) -> dict[str, Any]:
    status = Counter()
    pattern = Counter()
    impairment = Counter()
    handbook = Counter()
    for record_id in record_ids:
        row = rows[record_id]
        status[row.get("status_group", "unknown")] += 1
        pattern[row.get("pattern_cell_id", "unknown")] += 1
        impairment.update(row.get("impairment_signals", [])[:8])
        handbook.update(row.get("handbook_signals", [])[:8])
    return {
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(10)),
        "impairment_signal_counts": dict(impairment.most_common(12)),
        "handbook_signal_counts": dict(handbook.most_common(8)),
    }


def main() -> None:
    records, rows = load_records()
    c05_3 = record_set(records, lambda r: "C05-3-worksite-facility" in r["dominant"])
    c05_4 = record_set(records, lambda r: "C05-4-rest-fatigue-boundary" in r["dominant"])
    c05_5 = record_set(records, lambda r: "C05-5-information-access-boundary" in r["dominant"] or "C05-5-information-access-boundary" in r["secondary"])
    c05_12 = record_set(records, lambda r: "C05-1-commuting-route" in r["dominant"] or "C05-2-posture-operation" in r["dominant"])
    c04a = record_set(records, lambda r: any(branch.startswith("P1-C04A") for branch in r["branches"]))
    pure = c05_3 - c05_4 - c05_5 - c05_12 - c04a

    class_ids: dict[str, list[str]] = defaultdict(list)
    for record_id in sorted(pure):
        class_ids[classify(rows[record_id])].append(record_id)

    class_specs = {
        "C05P-1-unmet-worksite-arrangement-broad-task-role": {
            "title": "作業場所・設備未整備と課題/責任遂行の広範未整合",
            "candidate_proposition": "作業場所・設備・道具・マニュアル等が、課題達成、責任遂行、技能習得、ストレス対処、職場内関係に接続していない場合、仕事参加の自由度が狭まる可能性。",
            "counter_proposition": "主構造は設備ではなく、仕事内容設計、職場理解、支援接続、入口翻訳、または雇用形態の問題かもしれない。",
            "handling": "reviewable_subbranch_candidate_after_llm_context_reading",
        },
        "C05P-2-partial-worksite-arrangement-residual-task-role": {
            "title": "作業場所・設備の部分整備と課題/責任遂行の残存",
            "candidate_proposition": "作業場所・設備・道具等が一部整備されていても、それが課題達成、責任遂行、技能習得、評価、職場理解に接続しなければ残存困難が残る可能性。",
            "counter_proposition": "整備済みに見える信号は、設備が有効だったことを示さず、残存困難は仕事内容、評価、支援接続、健康時間の問題かもしれない。",
            "handling": "reviewable_subbranch_candidate_after_llm_context_reading",
        },
        "C05P-3-unmet-worksite-arrangement-physical-operation": {
            "title": "作業場所・設備未整備と身体操作・安全確認",
            "candidate_proposition": "作業場所・設備の未整備が、移動、運搬、姿勢、安全確認、トイレ利用などの身体操作と接続している場合、同じ設備名でも必要な自由度が変わる可能性。",
            "counter_proposition": "これはC05-1/2またはC01健康時間の問題であり、C05-3本体ではない可能性がある。",
            "handling": "boundary_or_merge_after_llm_context_reading",
        },
        "C05P-4-worksite-arrangement-carried-into-transition": {
            "title": "作業場所・設備未整合の移行・再就職持ち越し",
            "candidate_proposition": "過去就労で作業場所・設備と仕事内容の接続が未解決だった場合、再就職・実習・求人選択・必要条件説明に持ち越される可能性。",
            "counter_proposition": "持ち越しに見える信号は、入口翻訳、支援接続、生活保障、就労希望、地域求人条件によって説明できる可能性がある。",
            "handling": "transition_boundary_candidate",
        },
        "C05P-B1-worksite-signal-as-entry-support-translation": {
            "title": "作業場所・設備信号の入口翻訳/支援接続化",
            "candidate_proposition": "設備・作業場所の話に見えるが、実際には必要条件を企業・支援者・本人の間で翻訳する問題として読める可能性。",
            "counter_proposition": "設備本体の問題を、入口翻訳に吸収しすぎている可能性がある。",
            "handling": "boundary_candidate_not_review_card",
        },
        "C05P-Z-mixed-or-uncertain": {
            "title": "混合または低確度の作業場所・設備信号",
            "candidate_proposition": "構造が混合しており、C05-3-pureとしては保留する。",
            "counter_proposition": "少数の重要な接触点を分類規則が拾えていない可能性がある。",
            "handling": "hold_for_manual_or_llm_check",
        },
    }

    subbranches = []
    for class_id, ids in sorted(class_ids.items()):
        record_set_for_class = set(ids)
        subbranches.append(
            {
                "subbranch_id": class_id,
                **class_specs[class_id],
                "record_count": len(ids),
                "representative_ids": ids[:12],
                "boundary_ids": sorted((pure - record_set_for_class))[:12],
                "distribution": compact_distribution(record_set_for_class, rows),
            }
        )

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "source_set": {
            "c05_3_dominant": len(c05_3),
            "c05_3_pure_after_boundary_exclusion": len(pure),
        },
        "interpretive_result": "C05-3-pureは設備リストではなく、作業場所・設備が課題達成・責任遂行・技能習得・身体操作に接続する構造として読むと有効性が出る。",
        "subbranches": subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C05-3 Pure Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / LLM文脈読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "`C05-3-pure` を設備リストとしてではなく、作業場所・設備が仕事参加のどの接触点に接続しているかで読み直した。",
        "",
        "## 結論",
        "",
        "C05-3-pureは復活させる。ただし、候補命題は「設備がある/ない」ではない。主語は、作業場所・設備・道具・マニュアル等が、課題達成、責任遂行、技能習得、身体操作、安全確認、職場理解、入口翻訳にどう接続するかである。",
        "",
        f"C05-3 dominant: {payload['source_set']['c05_3_dominant']}",
        f"C05-3 pure after boundary exclusion: {payload['source_set']['c05_3_pure_after_boundary_exclusion']}",
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
                f"境界ID: {', '.join(f'`{rid}`' for rid in branch['boundary_ids'])}",
                "",
                f"候補命題: {branch['candidate_proposition']}",
                "",
                f"反対命題: {branch['counter_proposition']}",
                "",
                f"扱い: {branch['handling']}",
                "",
                "分布:",
                f"- status_group: {', '.join(f'{key}:{value}' for key, value in dist['status_group_counts'].items())}",
                f"- pattern_cell: {', '.join(f'{key}:{value}' for key, value in dist['pattern_cell_counts'].items())}",
                f"- impairment_signal: {', '.join(f'{key}:{value}' for key, value in dist['impairment_signal_counts'].items())}",
                "",
            ]
        )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C05-3を一度境界に落としたのは正しかったが、完全に降ろすのは強すぎた。",
            "- 設備・作業場所は、C01/C02/C03/C04の実装面に吸収される部分と、C05-3-pureとして残る部分を分ける。",
            "- C05-3-pureの中核は、設備名ではなく、仕事参加の接触点との接続である。",
            "- 設備の有効性、合理的配慮の充足、職場の正否は判断しない。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
