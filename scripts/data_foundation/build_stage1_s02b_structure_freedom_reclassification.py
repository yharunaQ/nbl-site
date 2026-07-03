#!/usr/bin/env python3
"""Reclassify S-02B by structure-changing degrees of freedom."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
BASE_DIR = ROOT / "references/derived/scima-fchma/stage1-context-reading-v0-2026-05-14"
CASE_FILES = {
    "nanbyo_survey_4000": ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    "employment_survey_3000": ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
}
OUT_JSON = BASE_DIR / "stage1-s02b-structure-freedom-reclassification-v0-2026-05-17.json"
OUT_MD = BASE_DIR / "stage1-s02b-structure-freedom-reclassification-v0-2026-05-17.md"

STATUS = "machine_generated_unreviewed_no_promotion"

S02B_BRANCH_KEYWORDS = (
    "通院",
    "治療",
    "入院",
    "手術",
    "有給",
    "休暇",
    "採用後",
    "復帰",
    "休職",
    "休み",
)

S02B_SIGNAL_FIELDS = (
    "body_function_signals",
    "post_employment_unresolved",
    "accommodations_needed_absent",
    "support_use_gaps",
    "narrative_context_labels",
)

AXES = {
    "F01-0-broad-checklist-saturation": {
        "title": "広範チェックリスト飽和",
        "freedom": "治療・通院に加えて未充足・未解決が広範に出ており、主自由度を機械的に一つへ絞れない。",
        "result_focus": "S-02B候補として保持するが、LLM文脈読解で再探索する必要がある。",
        "keywords": (),
        "candidate": "広範な未充足・未解決信号は、治療時間、収入、仕事設計、開示、支援アクセスが混ざるため、単独構造候補にしない。",
        "counter": "広範信号は回答傾向や一時的不安を含む可能性があり、個別文脈を読まずに構造化しない。",
    },
    "F01-1-leave-income-conversion": {
        "title": "休み方が収入・生活保障へ変換される構造",
        "freedom": "通院・治療のための休み方が、有給、欠勤、給与、休業、生活費、医療費へどう変換されるか。",
        "result_focus": "治療継続、収入維持、生活安定、休暇の回復機能が変わる。",
        "keywords": (
            "有給",
            "休暇",
            "欠勤",
            "収入",
            "給与",
            "報酬",
            "生活",
            "医療費",
            "休業",
            "傷病手当",
            "経済",
            "生活設計",
        ),
        "candidate": "治療・通院時間は、休暇項目の問題ではなく、休み方が収入・生活保障・回復時間に変換される構造として読む必要がある。",
        "counter": "主因は収入変換ではなく、職務代替、雇用形態、医療機関の時間、本人の生活設計、制度接続かもしれない。",
    },
    "F01-2-treatment-schedule-work-schedule-translation": {
        "title": "治療予定を仕事予定へ翻訳する構造",
        "freedom": "治療、通院、入院、服薬、疲労回復の予定を、勤務時間、出退勤、休憩、休日、予定変更へ翻訳できるか。",
        "result_focus": "治療継続と勤務継続の両立可能性が変わる。",
        "keywords": (
            "通院",
            "治療",
            "入院",
            "手術",
            "服薬",
            "勤務時間",
            "休日",
            "出退勤",
            "休憩",
            "体調管理",
            "疲労回復",
            "時差",
            "フレックス",
            "予定",
        ),
        "candidate": "治療時間の構造は、治療予定を仕事予定へ翻訳できるか、またその翻訳が日常運用に落ちるかで変わる可能性。",
        "counter": "予定翻訳に見えても、主因は仕事量、職務代替、収入保障、職場内解釈、医療上の不安定性かもしれない。",
    },
    "F01-3-work-substitution-design-rigidity": {
        "title": "職務代替・仕事設計が固定される構造",
        "freedom": "治療・体調変動がある時に、仕事量、仕事内容、配置、担当、締切、勤務場所を動かせるか。",
        "result_focus": "体調悪化を避けながら責任・業務継続・職場内評価を保てるかが変わる。",
        "keywords": (
            "仕事量",
            "仕事内容",
            "業務",
            "職務",
            "配置",
            "代替",
            "締切",
            "人員",
            "短時間",
            "在宅",
            "勤務場所",
            "得意分野",
            "無理な仕事内容",
            "業務調整",
        ),
        "candidate": "治療時間問題は、休みを取れるかだけでなく、職務代替や仕事設計が固定されているかで継続可能性が変わる可能性。",
        "counter": "仕事設計に見えても、主因は治療予定、収入保障、本人の説明負荷、職場理解、制度利用条件かもしれない。",
    },
    "F01-4-temporal-stage-transition": {
        "title": "採用・現職継続・休職復職の時間軸差",
        "freedom": "同じ治療条件でも、採用前、採用直後、現職継続、休職、復職、離職後、再就職で意味が変わるか。",
        "result_focus": "入口排除、現職での再調整、休職復職、再就職準備が変わる。",
        "keywords": (
            "採用",
            "就職活動",
            "就職後",
            "採用後",
            "現職",
            "休職",
            "復職",
            "離職",
            "再就職",
            "継続",
            "復帰",
            "応募",
            "面接",
        ),
        "candidate": "治療条件は、どの時間軸に置かれるかで、入口の説明問題、現職調整、復職設計、再就職準備へ分かれる可能性。",
        "counter": "時間軸差に見えても、主因は職務設計、収入保障、支援アクセス、本人希望、医療上の変動かもしれない。",
    },
    "F01-5-workplace-interpretation": {
        "title": "職場内解釈が問題を変える構造",
        "freedom": "体調変動や治療調整が、迷惑、怠慢、仮病、能力不足ではなく、仕事設計課題として読まれるか。",
        "result_focus": "職場理解、説明負荷、孤立、評価、継続可能性が変わる。",
        "keywords": (
            "職場理解",
            "開示",
            "偏見",
            "負担感",
            "誤解",
            "説明",
            "上司",
            "同僚",
            "正しい理解",
            "迷惑",
            "怠慢",
            "仮病",
            "能力不足",
        ),
        "candidate": "治療・体調変動は、職場がそれをどう解釈するかによって、配慮以前に評価・孤立・継続困難へ変換される可能性。",
        "counter": "職場解釈に見えても、実際には職務代替不能性、治療予定の予測困難、本人の開示希望、収入保障が主因かもしれない。",
    },
    "F01-6-boundary-support-life-institution": {
        "title": "境界: 生活保障・制度接続・支援アクセスが主自由度",
        "freedom": "治療時間に見える信号が、生活保障、相談入口、制度接続、地域資源、手帳・制度ステータスに主に左右されるか。",
        "result_focus": "S-02Bへ吸収せず、生活保障・支援入口・制度接続の構造へ接続する。",
        "keywords": (
            "相談",
            "支援",
            "制度",
            "手帳",
            "地域",
            "生活",
            "収入",
            "年金",
            "医療費",
            "専門的就労支援",
            "利用の仕方が分からない",
            "ニーズには合わなかった",
        ),
        "candidate": "治療時間に見える問題でも、主自由度が生活保障・制度接続・支援アクセスにある場合は境界として扱うべきである。",
        "counter": "制度・生活問題に見えても、背景で治療予定と仕事予定の翻訳不全が効いている可能性は残る。",
    },
    "F01-7-context-thin-structured-only": {
        "title": "文脈薄: 構造化信号のみ",
        "freedom": "構造化回答ではS-02Bに当たるが、記述ラベルが薄く、主自由度を決めにくい。",
        "result_focus": "候補IDとして保持するが、構造候補ではなく追加読解待ちにする。",
        "keywords": (),
        "candidate": "記述文脈が薄い場合、通院回数や配慮信号だけで治療時間構造を確定せず、追加読解候補として保持する。",
        "counter": "記述が薄くても、選択回答だけで十分に構造が出ているケースもあるため、一律に捨てない。",
    },
}

AXIS_THRESHOLDS = {
    "F01-1-leave-income-conversion": (5, 1),
    "F01-2-treatment-schedule-work-schedule-translation": (5, 1),
    "F01-3-work-substitution-design-rigidity": (5, 1),
    "F01-4-temporal-stage-transition": (4, 1),
    "F01-5-workplace-interpretation": (5, 1),
    "F01-6-boundary-support-life-institution": (8, 2),
}

AXIS_FIELDS = {
    "F01-1-leave-income-conversion": ("narrative_context_labels",),
    "F01-2-treatment-schedule-work-schedule-translation": ("narrative_context_labels",),
    "F01-3-work-substitution-design-rigidity": ("narrative_context_labels",),
    "F01-4-temporal-stage-transition": ("narrative_context_labels",),
    "F01-5-workplace-interpretation": ("narrative_context_labels",),
    "F01-6-boundary-support-life-institution": ("narrative_context_labels",),
}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as src:
        for line in src:
            if line.strip():
                rows.append(json.loads(line))
    return rows


def norm(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return " ".join(norm(item) for item in value)
    if isinstance(value, dict):
        return " ".join(norm(v) for v in value.values())
    return str(value)


def compact_record_text(row: dict[str, Any], fields: tuple[str, ...]) -> str:
    return " ".join(norm(row.get(field)) for field in fields)


def score_keywords(text: str, keywords: tuple[str, ...]) -> tuple[int, int, list[str]]:
    hits: list[str] = []
    total = 0
    for word in keywords:
        count = text.count(word)
        if count:
            hits.append(word)
            total += count
    return total + len(hits) * 3, len(hits), hits


def load_cases() -> list[dict[str, Any]]:
    rows = []
    for dataset_id, path in CASE_FILES.items():
        for row in read_jsonl(path):
            row = dict(row)
            row["source_dataset"] = dataset_id
            rows.append(row)
    return rows


def is_s02b_candidate(row: dict[str, Any]) -> tuple[bool, int, int, list[str]]:
    text = compact_record_text(row, S02B_SIGNAL_FIELDS)
    score, unique, hits = score_keywords(text, S02B_BRANCH_KEYWORDS)
    return score >= 16 and unique >= 2, score, unique, hits


def is_broad_saturation(row: dict[str, Any]) -> bool:
    absent = len(row.get("accommodations_needed_absent") or [])
    post = len(row.get("post_employment_unresolved") or [])
    job_search = len(row.get("job_search_unresolved") or [])
    support = len(row.get("support_use_gaps") or [])
    return absent >= 10 or post >= 8 or (job_search >= 6 and support >= 5)


def axis_memberships(row: dict[str, Any]) -> tuple[list[str], list[dict[str, Any]]]:
    narrative_labels = row.get("narrative_context_labels") or []
    axis_scores = []
    for axis_id, axis in AXES.items():
        if axis_id in {"F01-0-broad-checklist-saturation", "F01-7-context-thin-structured-only"}:
            continue
        text = compact_record_text(row, AXIS_FIELDS[axis_id])
        score, unique, hits = score_keywords(text, axis["keywords"])
        axis_scores.append({
            "axis_id": axis_id,
            "score": score,
            "unique_keyword_hits": unique,
            "matched_keywords": hits[:8],
        })
    axis_scores.sort(key=lambda item: (-item["score"], item["axis_id"]))
    memberships = []
    if is_broad_saturation(row):
        memberships.append("F01-0-broad-checklist-saturation")
    for item in axis_scores:
        threshold, min_unique = AXIS_THRESHOLDS[item["axis_id"]]
        if item["score"] >= threshold and item["unique_keyword_hits"] >= min_unique:
            memberships.append(item["axis_id"])
    if not narrative_labels:
        memberships.append("F01-7-context-thin-structured-only")
    if not memberships:
        memberships.append("F01-6-boundary-support-life-institution")
    return memberships, axis_scores


def placement(row: dict[str, Any], axis_id: str) -> str:
    if axis_id in {"F01-0-broad-checklist-saturation", "F01-7-context-thin-structured-only"}:
        return "exploration_hold"
    present = len(row.get("accommodations_present") or [])
    absent = len(row.get("accommodations_needed_absent") or [])
    post = len(row.get("post_employment_unresolved") or [])
    job_search = len(row.get("job_search_unresolved") or [])
    support = len(row.get("support_use_gaps") or [])
    status = row.get("status_group")

    if status == "currently_working" and present >= 8 and absent <= 1 and post <= 1:
        return "mitigation_side"
    if present >= 4 and (absent >= 2 or post >= 2 or support >= 3):
        return "residual_side"
    if absent >= 5 and (post >= 3 or job_search >= 3 or support >= 3) and present <= 5:
        return "problem_side"
    if axis_id == "F01-6-boundary-support-life-institution":
        return "boundary_side"
    return "boundary_side"


def compact_case(row: dict[str, Any], memberships: list[str], axis_scores: list[dict[str, Any]], branch_hits: list[str]) -> dict[str, Any]:
    primary_hint = next((axis_id for axis_id in memberships if axis_id not in {"F01-0-broad-checklist-saturation", "F01-7-context-thin-structured-only"}), memberships[0])
    return {
        "record_id": row["record_id"],
        "source_dataset": row.get("source_dataset"),
        "status_group": row.get("status_group"),
        "pattern_cell_id": row.get("pattern_cell_id"),
        "primary_axis_hint": primary_hint,
        "axis_memberships": memberships,
        "placement": placement(row, primary_hint),
        "branch_keyword_hits": branch_hits,
        "axis_top_scores": axis_scores[:3],
        "counts": {
            "accommodations_present": len(row.get("accommodations_present") or []),
            "accommodations_needed_absent": len(row.get("accommodations_needed_absent") or []),
            "post_employment_unresolved": len(row.get("post_employment_unresolved") or []),
            "job_search_unresolved": len(row.get("job_search_unresolved") or []),
            "support_use_gaps": len(row.get("support_use_gaps") or []),
            "narrative_context_labels": len(row.get("narrative_context_labels") or []),
        },
        "safe_signal_labels": {
            "health_condition_groups": (row.get("health_condition_groups") or [])[:4],
            "body_function_signals": (row.get("body_function_signals") or [])[:4],
            "narrative_context_labels": (row.get("narrative_context_labels") or [])[:6],
            "uncertainty_flags": (row.get("uncertainty_flags") or [])[:4],
        },
    }


def choose_examples(cases: list[dict[str, Any]], placement_name: str, limit: int = 8) -> list[str]:
    if placement_name == "exploration_hold":
        target = list(cases)
    else:
        target = [case for case in cases if case["placement"] == placement_name]
    if placement_name == "problem_side":
        target.sort(key=lambda case: (-(case["counts"]["accommodations_needed_absent"] + case["counts"]["post_employment_unresolved"] + case["counts"]["job_search_unresolved"]), case["record_id"]))
    elif placement_name == "mitigation_side":
        target.sort(key=lambda case: (-case["counts"]["accommodations_present"], case["record_id"]))
    elif placement_name == "residual_side":
        target.sort(key=lambda case: (-(case["counts"]["accommodations_present"] + case["counts"]["accommodations_needed_absent"] + case["counts"]["post_employment_unresolved"]), case["record_id"]))
    else:
        target.sort(key=lambda case: (-(case["counts"]["narrative_context_labels"] + case["counts"]["support_use_gaps"]), case["record_id"]))
    return [case["record_id"] for case in target[:limit]]


def build() -> dict[str, Any]:
    rows = load_cases()
    cases = []
    for row in rows:
        ok, _score, _unique, hits = is_s02b_candidate(row)
        if not ok:
            continue
        memberships, axis_scores = axis_memberships(row)
        cases.append(compact_case(row, memberships, axis_scores, hits))

    positive_contrasts = []
    time_pattern = re.compile("通院|治療|入院|手術|服薬|体調|疲労|休憩|出退勤|勤務時間")
    for row in rows:
        text = compact_record_text(row, S02B_SIGNAL_FIELDS)
        present = len(row.get("accommodations_present") or [])
        absent = len(row.get("accommodations_needed_absent") or [])
        post = len(row.get("post_employment_unresolved") or [])
        support = len(row.get("support_use_gaps") or [])
        if (
            row.get("status_group") == "currently_working"
            and time_pattern.search(text)
            and present >= 8
            and absent <= 1
            and post <= 1
            and support <= 3
        ):
            positive_contrasts.append({
                "record_id": row["record_id"],
                "source_dataset": row.get("source_dataset"),
                "counts": {
                    "accommodations_present": present,
                    "accommodations_needed_absent": absent,
                    "post_employment_unresolved": post,
                    "support_use_gaps": support,
                    "narrative_context_labels": len(row.get("narrative_context_labels") or []),
                },
                "safe_signal_labels": {
                    "health_condition_groups": (row.get("health_condition_groups") or [])[:4],
                    "narrative_context_labels": (row.get("narrative_context_labels") or [])[:6],
                },
            })
    positive_contrasts.sort(
        key=lambda item: (
            -item["counts"]["accommodations_present"],
            -item["counts"]["narrative_context_labels"],
            item["record_id"],
        )
    )

    axis_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for case in cases:
        for axis_id in case["axis_memberships"]:
            axis_groups[axis_id].append(case)

    axes = []
    for axis_id, axis in AXES.items():
        group = axis_groups.get(axis_id, [])
        if axis_id in {"F01-0-broad-checklist-saturation", "F01-7-context-thin-structured-only"}:
            placement_counts = Counter({"exploration_hold": len(group)})
        else:
            placement_counts = Counter(case["placement"] for case in group)
        axes.append({
            "axis_id": axis_id,
            "title": axis["title"],
            "freedom": axis["freedom"],
            "result_focus": axis["result_focus"],
            "status": STATUS,
            "record_count": len(group),
            "placement_counts": dict(sorted(placement_counts.items())),
            "exploration_hold_ids": choose_examples(group, "exploration_hold"),
            "problem_side_ids": choose_examples(group, "problem_side"),
            "mitigation_side_ids": choose_examples(group, "mitigation_side"),
            "residual_side_ids": choose_examples(group, "residual_side"),
            "boundary_side_ids": choose_examples(group, "boundary_side"),
            "candidate_structure": axis["candidate"],
            "counter_structure": axis["counter"],
        })

    return {
        "status": STATUS,
        "raw_or_redacted_text_included": False,
        "source_datasets": sorted(CASE_FILES),
        "input_case_count": len(rows),
        "s02b_candidate_count": len(cases),
        "positive_contrast_search": {
            "note": "S-02B候補内だけでは軽減側が問題側より薄くなるため、治療・時間関連信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
            "record_count": len(positive_contrasts),
            "representative_ids": [item["record_id"] for item in positive_contrasts[:20]],
            "records": positive_contrasts,
        },
        "method": {
            "branch_candidate_rule": "stage1 S-02B keyword rule over derived case-interpretation signal fields only: score >= 16 and unique keyword hits >= 2",
            "structure_discovery_rule": "assign non-exclusive degree-of-freedom memberships, then mark problem/mitigation/residual/boundary/hold placement using derived signal counts",
            "llm_context_reading_status": "Codex synthesis over derived signals; no raw narrative quotation",
        },
        "axes": axes,
        "case_assignments": cases,
    }


def md_list(items: list[str]) -> str:
    if not items:
        return "なし"
    return ", ".join(f"`{item}`" for item in items)


def write_outputs(payload: dict[str, Any]) -> None:
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 S-02B 構造自由度再分類 v0",
        "",
        "日付: 2026-05-17",
        "状態: Falcon Lab / 構造発見実験 / 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "## 何をしたか",
        "",
        "S-02B「治療・通院時間が休暇制度・採用直後制度・復帰予定と衝突する」を、通院配慮の有無ではなく、結果を変えうる構造上の自由度で再分類した。",
        "",
        f"入力ケース数: {payload['input_case_count']}",
        f"S-02B候補ケース数: {payload['s02b_candidate_count']}",
        f"軽減側の別探索候補数: {payload['positive_contrast_search']['record_count']}",
        "",
        "この出力は、派生済みケース解釈の信号だけを使う。本文引用は含めない。人間レビュー済み知識ではない。",
        "",
        "S-02B候補の内部だけでは、問題側・残余側が厚くなりやすい。これは軽減側が存在しないという意味ではなく、問題側キーワードで作った枝からは軽減側が取りにくいという方法上の発見である。そこで、治療・時間関連信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
        "",
        f"軽減側別探索ID: {md_list(payload['positive_contrast_search']['representative_ids'][:12])}",
        "",
        "## 自由度別の結果",
        "",
        "| 自由度 | 件数 | 保留 | 問題側 | 軽減側 | 残余側 | 境界側 |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for axis in payload["axes"]:
        pc = axis["placement_counts"]
        lines.append(
            f"| {axis['title']} | {axis['record_count']} | {pc.get('exploration_hold', 0)} | {pc.get('problem_side', 0)} | {pc.get('mitigation_side', 0)} | {pc.get('residual_side', 0)} | {pc.get('boundary_side', 0)} |"
        )

    lines.extend([
        "",
        "## 構造候補",
        "",
    ])
    for axis in payload["axes"]:
        lines.extend([
            f"### {axis['axis_id']} {axis['title']}",
            "",
            f"自由度: {axis['freedom']}",
            f"結果焦点: {axis['result_focus']}",
            f"件数: {axis['record_count']}",
            f"候補構造: {axis['candidate_structure']}",
            f"反対構造: {axis['counter_structure']}",
            "",
            f"保留ID: {md_list(axis['exploration_hold_ids'])}",
            f"問題側ID: {md_list(axis['problem_side_ids'])}",
            f"軽減側ID: {md_list(axis['mitigation_side_ids'])}",
            f"残余側ID: {md_list(axis['residual_side_ids'])}",
            f"境界側ID: {md_list(axis['boundary_side_ids'])}",
            "",
        ])

    lines.extend([
        "## 読み取れたこと",
        "",
        "S-02Bは「通院配慮がある/ない」では粗い。少なくとも、休み方の収入変換、治療予定の仕事予定への翻訳、職務代替・仕事設計、採用・現職・復職の時間軸、職場内解釈、生活保障・制度接続の境界に分かれる。",
        "",
        "特に重要なのは、治療時間そのものではなく、治療時間が収入、職務代替、説明負荷、職場内評価、復職経路へどう変換されるかが結果を変える点である。",
        "",
        "この再分類は、Falconが作るべき知識を「通院配慮一覧」から「治療・時間条件の結果を変えうる自由度の地図」へ近づける。",
        "",
        "## 次の処理",
        "",
        "次は、S-07CとS-02Bで共通して見えた方法上の発見を統合する。問題側枝からは軽減側が取りにくいため、今後のStage 1本番では、問題側探索と軽減側探索を必ず対で走らせる。",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    payload = build()
    write_outputs(payload)
    summary = {
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "s02b_candidate_count": payload["s02b_candidate_count"],
        "positive_contrast_count": payload["positive_contrast_search"]["record_count"],
        "axes": [
            {
                "axis_id": axis["axis_id"],
                "record_count": axis["record_count"],
                "placement_counts": axis["placement_counts"],
            }
            for axis in payload["axes"]
        ],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
