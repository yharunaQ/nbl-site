#!/usr/bin/env python3
"""Reclassify S-05 by structure-changing degrees of freedom."""

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
OUT_JSON = BASE_DIR / "stage1-s05-structure-freedom-reclassification-v0-2026-05-17.json"
OUT_MD = BASE_DIR / "stage1-s05-structure-freedom-reclassification-v0-2026-05-17.md"

STATUS = "machine_generated_unreviewed_no_promotion"

S05_CORE_CELLS = {
    "RC-10B-job-search-disclosure-support-friction",
    "EC-10B-entry-disclosure-support-friction",
}

S05_BRANCH_KEYWORDS = (
    "応募",
    "面接",
    "企業への病気・必要配慮説明",
    "必要配慮説明",
    "説明",
    "開示",
    "伝え",
    "求人",
    "職業訓練",
    "実習",
    "見学",
    "働ける",
    "何時間",
    "どれくらい",
    "不採用",
    "制度ステータス",
    "手帳",
    "障害者雇用",
    "トライアル",
)

S05_SIGNAL_FIELDS = (
    "pattern_cell_id",
    "work_status_label",
    "work_experience",
    "job_type_signals",
    "readiness_unresolved",
    "job_search_unresolved",
    "pre_employment_unresolved",
    "disclosure_gaps",
    "support_use_gaps",
    "narrative_context_labels",
)

POSITIVE_CONTRAST_FIELDS = (
    "work_experience",
    "job_search_unresolved",
    "pre_employment_unresolved",
    "readiness_unresolved",
    "disclosure_gaps",
    "support_use_gaps",
    "accommodations_present",
    "narrative_context_labels",
)

AXES = {
    "F02-0-broad-entry-friction-saturation": {
        "title": "広範な入口摩擦の飽和",
        "freedom": "応募、面接、制度、支援接続、訓練、生活再建が同時に出ており、主自由度を一つに絞れない。",
        "result_focus": "S-05候補として保持するが、LLM文脈読解では入口摩擦を再分解する。",
        "keywords": (),
        "candidate": "入口摩擦が広範に出る記録は重要だが、そのままでは説明戦略、制度ステータス、求人条件、支援接続、生活段階が混ざる。",
        "counter": "広範な入口摩擦は、就職入口そのものではなく、療養優先、生活再建、仕事経験不足、地域求人条件の反映かもしれない。",
    },
    "F02-1-condition-to-employer-language": {
        "title": "本人条件を企業語へ翻訳する構造",
        "freedom": "体調変動、疲労、通院、必要配慮、働ける時間や業務範囲を、応募・面接・採用判断で扱える言葉へ変換できるか。",
        "result_focus": "応募、面接、採用入口、採用後初期調整の通過可能性が変わる。",
        "keywords": (
            "体調",
            "疲労",
            "通院",
            "病気や障害",
            "必要配慮",
            "説明",
            "伝え",
            "開示",
            "働ける",
            "何時間",
            "どれくらい",
            "面接",
            "応募",
        ),
        "candidate": "S-05の中核は、本人が病名を説明することではなく、変動する就労可能性と必要条件を採用側が評価・調整できる形式へ翻訳する構造にある。",
        "counter": "主因は説明形式ではなく、求人条件、職務経験、職業訓練、制度ステータス、本人の希望形成かもしれない。",
    },
    "F02-2-job-requirement-to-life-language": {
        "title": "求人条件を生活語へ翻訳する構造",
        "freedom": "求人票、勤務条件、仕事内容、職務要求、職業スキルを、本人の体調管理・生活条件・参加可能性に戻して検討できるか。",
        "result_focus": "希望の仕事、応募先選択、ミスマッチ回避、採用後の継続可能性が変わる。",
        "keywords": (
            "求人",
            "希望の仕事",
            "仕事内容",
            "勤務条件",
            "職業スキル",
            "能力",
            "履歴書",
            "応募書類",
            "職務",
            "資格",
            "仕事で要求",
            "職務経験",
        ),
        "candidate": "入口支援は本人を企業に説明するだけでなく、求人や仕事要求を本人の生活・健康管理・強みの言葉へ戻す双方向翻訳である可能性。",
        "counter": "求人翻訳に見えても、主因は地域求人の少なさ、制度入口、支援機関接続、本人の就労希望段階かもしれない。",
    },
    "F02-3-formal-status-gate": {
        "title": "制度ステータスが入口を規定する構造",
        "freedom": "手帳、障害者雇用枠、雇用率制度、面接会、トライアル、制度対象性が、本人条件や職務適合より先に入口を決めるか。",
        "result_focus": "使える求人入口、支援入口、応募可能性、説明範囲が変わる。",
        "keywords": (
            "手帳",
            "障害者雇用",
            "雇用率",
            "障害者枠",
            "面接会",
            "トライアル",
            "制度",
            "制度ステータス",
            "対象外",
            "雇用義務化",
            "職場開拓",
        ),
        "candidate": "制度ステータスは、支援不要/必要の判定ではなく、どの入口が開くか、何を説明できるかを変える自由度として読む必要がある。",
        "counter": "制度ステータスに見えても、求人要件、職務内容、支援者の翻訳、本人の自己理解、地域条件が主自由度かもしれない。",
    },
    "F02-4-supported-trial-translation": {
        "title": "実習・見学・支援者同席で翻訳する構造",
        "freedom": "面接だけでは見えない強み・必要条件を、職場実習、見学、トライアル、支援者同席、相談支援で具体化できるか。",
        "result_focus": "選考前後の相互理解、仕事の切り出し、採用後の初期調整が変わる。",
        "keywords": (
            "職場実習",
            "実習",
            "見学",
            "トライアル",
            "支援者",
            "同行",
            "同席",
            "ハローワーク",
            "相談",
            "支援機関",
            "ジョブコーチ",
            "職場開拓",
        ),
        "candidate": "入口の自由度は、本人説明だけでなく、実習・見学・支援者同席によって本人条件と職務条件を一緒に可視化できるかで変わる可能性。",
        "counter": "実習や同席の有無ではなく、職務内容、企業側の受け入れ条件、生活保障、本人の同意範囲が主因かもしれない。",
    },
    "F02-5-training-physical-treatment-access": {
        "title": "訓練・移動・治療条件が入口を制約する構造",
        "freedom": "通勤、移動、姿勢、痛み、通院、治療、疲労が、職業訓練、面接、見学、実習へ参加する条件を変えるか。",
        "result_focus": "求人応募以前の訓練参加、面接参加、職場確認、準備機会が変わる。",
        "keywords": (
            "職業訓練",
            "訓練",
            "移動",
            "通勤",
            "姿勢",
            "歩行",
            "痛み",
            "通院",
            "治療",
            "入院",
            "疲労",
            "見学",
            "面接",
        ),
        "candidate": "就職入口の問題は、説明や制度だけでなく、訓練・面接・見学に参加できる身体的・時間的条件が動くかで変わる可能性。",
        "counter": "物理・治療条件に見えても、求人条件、支援機関の遠隔対応、生活保障、説明戦略、就労希望段階が主因かもしれない。",
    },
    "F02-6-boundary-readiness-life-rebuilding": {
        "title": "境界: 希望形成・生活再建が主自由度",
        "freedom": "就職入口に見える信号が、療養優先、生活再建、収入不安、自己効力、人生設計、就労希望形成に主に左右されるか。",
        "result_focus": "S-05へ吸収せず、S-03やS-08の生活・準備段階構造へ接続する。",
        "keywords": (
            "療養",
            "生活",
            "収入",
            "医療費",
            "家族",
            "生活リズム",
            "自信",
            "社会的疎外",
            "再就職意欲",
            "人生設計",
            "仕事の方向性",
            "準備が整わない",
        ),
        "candidate": "入口摩擦に見えるものでも、主自由度が生活再建や希望形成にある場合は、採用入口の問題へ短絡しない。",
        "counter": "生活再建に見えても、実際には求人条件、説明機会、制度ステータス、支援者翻訳の不足が背景で効いている可能性がある。",
    },
    "F02-7-context-thin-structured-only": {
        "title": "文脈薄: 構造化信号のみ",
        "freedom": "構造化回答ではS-05に当たるが、記述ラベルが薄く、主自由度を決めにくい。",
        "result_focus": "候補IDとして保持するが、構造候補ではなく追加読解待ちにする。",
        "keywords": (),
        "candidate": "就職入口関連の選択回答だけで、説明戦略・制度・生活段階を確定しない。",
        "counter": "記述が薄くても、選択回答だけで入口構造が十分見えている可能性は残る。",
    },
}

AXIS_THRESHOLDS = {
    "F02-1-condition-to-employer-language": (10, 2),
    "F02-2-job-requirement-to-life-language": (8, 2),
    "F02-3-formal-status-gate": (8, 1),
    "F02-4-supported-trial-translation": (8, 1),
    "F02-5-training-physical-treatment-access": (8, 1),
    "F02-6-boundary-readiness-life-rebuilding": (8, 1),
}

AXIS_FIELDS = {
    "F02-1-condition-to-employer-language": ("job_search_unresolved", "pre_employment_unresolved", "disclosure_gaps", "accommodations_present", "narrative_context_labels"),
    "F02-2-job-requirement-to-life-language": ("job_search_unresolved", "pre_employment_unresolved", "job_type_signals", "narrative_context_labels"),
    "F02-3-formal-status-gate": ("pattern_cell_id", "handbook_signals", "job_type_signals", "desired_supports", "narrative_context_labels"),
    "F02-4-supported-trial-translation": ("support_use_gaps", "consultation_gaps", "consultation_sources", "accommodations_present", "narrative_context_labels"),
    "F02-5-training-physical-treatment-access": ("body_function_signals", "job_search_unresolved", "pre_employment_unresolved", "support_use_gaps", "narrative_context_labels"),
    "F02-6-boundary-readiness-life-rebuilding": ("readiness_unresolved", "low_work_confidence", "low_soc_or_life_signals", "narrative_context_labels"),
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


def is_s05_candidate(row: dict[str, Any]) -> tuple[bool, int, int, list[str]]:
    text = compact_record_text(row, S05_SIGNAL_FIELDS)
    score, unique, hits = score_keywords(text, S05_BRANCH_KEYWORDS)
    is_core_cell = row.get("pattern_cell_id") in S05_CORE_CELLS
    return is_core_cell or (score >= 26 and unique >= 2), score, unique, hits


def is_broad_saturation(row: dict[str, Any]) -> bool:
    job_search = len(row.get("job_search_unresolved") or [])
    pre = len(row.get("pre_employment_unresolved") or [])
    readiness = len(row.get("readiness_unresolved") or [])
    support = len(row.get("support_use_gaps") or [])
    absent = len(row.get("accommodations_needed_absent") or [])
    return (job_search >= 4 and support >= 5) or (pre >= 6 and absent >= 4) or (readiness >= 4 and support >= 5)


def axis_memberships(row: dict[str, Any]) -> tuple[list[str], list[dict[str, Any]]]:
    narrative_labels = row.get("narrative_context_labels") or []
    axis_scores = []
    for axis_id, axis in AXES.items():
        if axis_id in {"F02-0-broad-entry-friction-saturation", "F02-7-context-thin-structured-only"}:
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
        memberships.append("F02-0-broad-entry-friction-saturation")
    for item in axis_scores:
        threshold, min_unique = AXIS_THRESHOLDS[item["axis_id"]]
        if item["score"] >= threshold and item["unique_keyword_hits"] >= min_unique:
            memberships.append(item["axis_id"])
    if not narrative_labels:
        memberships.append("F02-7-context-thin-structured-only")
    if not memberships:
        memberships.append("F02-6-boundary-readiness-life-rebuilding")
    return memberships, axis_scores


def placement(row: dict[str, Any], axis_id: str) -> str:
    if axis_id in {"F02-0-broad-entry-friction-saturation", "F02-7-context-thin-structured-only"}:
        return "exploration_hold"

    present = len(row.get("accommodations_present") or [])
    absent = len(row.get("accommodations_needed_absent") or [])
    job_search = len(row.get("job_search_unresolved") or [])
    pre = len(row.get("pre_employment_unresolved") or [])
    readiness = len(row.get("readiness_unresolved") or [])
    support = len(row.get("support_use_gaps") or [])
    disclosure = len(row.get("disclosure_gaps") or [])
    post = len(row.get("post_employment_unresolved") or [])

    if (
        row.get("status_group") == "currently_working"
        and present >= 5
        and job_search <= 1
        and pre <= 1
        and support <= 2
        and disclosure <= 1
        and post <= 2
        and absent <= 2
    ):
        return "mitigation_side"
    if present >= 4 and (job_search >= 2 or pre >= 2 or support >= 3 or disclosure >= 1 or absent >= 3):
        return "residual_side"
    if (job_search >= 3 or pre >= 3 or support >= 4 or disclosure >= 2) and present <= 5:
        return "problem_side"
    if axis_id == "F02-6-boundary-readiness-life-rebuilding" or readiness >= 3:
        return "boundary_side"
    return "boundary_side"


def compact_case(row: dict[str, Any], memberships: list[str], axis_scores: list[dict[str, Any]], branch_hits: list[str]) -> dict[str, Any]:
    hold_axes = {"F02-0-broad-entry-friction-saturation", "F02-7-context-thin-structured-only"}
    primary_hint = next((axis_id for axis_id in memberships if axis_id not in hold_axes), memberships[0])
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
            "job_search_unresolved": len(row.get("job_search_unresolved") or []),
            "pre_employment_unresolved": len(row.get("pre_employment_unresolved") or []),
            "readiness_unresolved": len(row.get("readiness_unresolved") or []),
            "support_use_gaps": len(row.get("support_use_gaps") or []),
            "disclosure_gaps": len(row.get("disclosure_gaps") or []),
            "post_employment_unresolved": len(row.get("post_employment_unresolved") or []),
            "narrative_context_labels": len(row.get("narrative_context_labels") or []),
        },
        "safe_signal_labels": {
            "health_condition_groups": (row.get("health_condition_groups") or [])[:4],
            "impairment_signals": (row.get("impairment_signals") or [])[:4],
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
        target.sort(key=lambda case: (-(case["counts"]["job_search_unresolved"] + case["counts"]["pre_employment_unresolved"] + case["counts"]["support_use_gaps"]), case["record_id"]))
    elif placement_name == "mitigation_side":
        target.sort(key=lambda case: (-(case["counts"]["accommodations_present"] + case["counts"]["narrative_context_labels"]), case["record_id"]))
    elif placement_name == "residual_side":
        target.sort(key=lambda case: (-(case["counts"]["accommodations_present"] + case["counts"]["job_search_unresolved"] + case["counts"]["support_use_gaps"]), case["record_id"]))
    else:
        target.sort(key=lambda case: (-(case["counts"]["narrative_context_labels"] + case["counts"]["readiness_unresolved"]), case["record_id"]))
    return [case["record_id"] for case in target[:limit]]


def build_positive_contrasts(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entry_pattern = re.compile("応募|面接|就職活動|採用|必要配慮|説明|開示|職業訓練|実習|見学|手帳|障害者雇用|支援者|ハローワーク")
    positive_contrasts = []
    for row in rows:
        text = compact_record_text(row, POSITIVE_CONTRAST_FIELDS)
        present = len(row.get("accommodations_present") or [])
        absent = len(row.get("accommodations_needed_absent") or [])
        job_search = len(row.get("job_search_unresolved") or [])
        pre = len(row.get("pre_employment_unresolved") or [])
        support = len(row.get("support_use_gaps") or [])
        disclosure = len(row.get("disclosure_gaps") or [])
        post = len(row.get("post_employment_unresolved") or [])
        if (
            row.get("status_group") == "currently_working"
            and entry_pattern.search(text)
            and present >= 5
            and absent <= 2
            and job_search <= 1
            and pre <= 1
            and support <= 2
            and disclosure <= 1
            and post <= 2
        ):
            memberships, axis_scores = axis_memberships(row)
            hold_axes = {"F02-0-broad-entry-friction-saturation", "F02-7-context-thin-structured-only"}
            structure_axes = [axis_id for axis_id in memberships if axis_id not in hold_axes]
            positive_contrasts.append({
                "record_id": row["record_id"],
                "source_dataset": row.get("source_dataset"),
                "primary_axis_hint": structure_axes[0] if structure_axes else memberships[0],
                "axis_memberships": memberships,
                "axis_top_scores": axis_scores[:3],
                "counts": {
                    "accommodations_present": present,
                    "accommodations_needed_absent": absent,
                    "job_search_unresolved": job_search,
                    "pre_employment_unresolved": pre,
                    "support_use_gaps": support,
                    "disclosure_gaps": disclosure,
                    "post_employment_unresolved": post,
                    "narrative_context_labels": len(row.get("narrative_context_labels") or []),
                },
                "safe_signal_labels": {
                    "health_condition_groups": (row.get("health_condition_groups") or [])[:4],
                    "impairment_signals": (row.get("impairment_signals") or [])[:4],
                    "narrative_context_labels": (row.get("narrative_context_labels") or [])[:6],
                },
            })
    positive_contrasts.sort(
        key=lambda item: (
            -item["counts"]["narrative_context_labels"],
            -item["counts"]["accommodations_present"],
            item["record_id"],
        )
    )
    return positive_contrasts


def build() -> dict[str, Any]:
    rows = load_cases()
    cases = []
    for row in rows:
        ok, _score, _unique, hits = is_s05_candidate(row)
        if not ok:
            continue
        memberships, axis_scores = axis_memberships(row)
        cases.append(compact_case(row, memberships, axis_scores, hits))

    positive_contrasts = build_positive_contrasts(rows)
    hold_axes = {"F02-0-broad-entry-friction-saturation", "F02-7-context-thin-structured-only"}
    positive_axis_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in positive_contrasts:
        for axis_id in item["axis_memberships"]:
            if axis_id not in hold_axes:
                positive_axis_groups[axis_id].append(item)

    axis_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for case in cases:
        for axis_id in case["axis_memberships"]:
            axis_groups[axis_id].append(case)

    axes = []
    for axis_id, axis in AXES.items():
        group = axis_groups.get(axis_id, [])
        if axis_id in {"F02-0-broad-entry-friction-saturation", "F02-7-context-thin-structured-only"}:
            placement_counts = Counter({"exploration_hold": len(group)})
            exploration_hold_ids = choose_examples(group, "exploration_hold")
            problem_side_ids: list[str] = []
            mitigation_side_ids: list[str] = []
            residual_side_ids: list[str] = []
            boundary_side_ids: list[str] = []
        else:
            placement_counts = Counter(case["placement"] for case in group)
            exploration_hold_ids = choose_examples(group, "exploration_hold")
            problem_side_ids = choose_examples(group, "problem_side")
            mitigation_side_ids = choose_examples(group, "mitigation_side")
            residual_side_ids = choose_examples(group, "residual_side")
            boundary_side_ids = choose_examples(group, "boundary_side")
        axes.append({
            "axis_id": axis_id,
            "title": axis["title"],
            "freedom": axis["freedom"],
            "result_focus": axis["result_focus"],
            "status": STATUS,
            "record_count": len(group),
            "placement_counts": dict(sorted(placement_counts.items())),
            "separate_mitigation_side_count": len(positive_axis_groups.get(axis_id, [])),
            "separate_mitigation_side_ids": [
                item["record_id"]
                for item in sorted(
                    positive_axis_groups.get(axis_id, []),
                    key=lambda item: (
                        -item["counts"]["narrative_context_labels"],
                        -item["counts"]["accommodations_present"],
                        item["record_id"],
                    ),
                )[:8]
            ],
            "exploration_hold_ids": exploration_hold_ids,
            "problem_side_ids": problem_side_ids,
            "mitigation_side_ids": mitigation_side_ids,
            "residual_side_ids": residual_side_ids,
            "boundary_side_ids": boundary_side_ids,
            "candidate_structure": axis["candidate"],
            "counter_structure": axis["counter"],
        })

    return {
        "status": STATUS,
        "raw_or_redacted_text_included": False,
        "source_datasets": sorted(CASE_FILES),
        "input_case_count": len(rows),
        "s05_candidate_count": len(cases),
        "positive_contrast_search": {
            "note": "S-05候補内だけでは入口摩擦の問題側が厚くなるため、入口・説明・制度関連信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
            "record_count": len(positive_contrasts),
            "representative_ids": [item["record_id"] for item in positive_contrasts[:20]],
            "records": positive_contrasts,
        },
        "method": {
            "branch_candidate_rule": "stage1 S-05 core-cell rule plus keyword rule over derived case-interpretation signal fields only: core pattern cell or score >= 26 and unique keyword hits >= 2",
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
        "# Stage 1 S-05 構造自由度再分類 v0",
        "",
        "日付: 2026-05-17",
        "状態: Falcon Lab / 構造発見実験 / 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "## 何をしたか",
        "",
        "S-05「就職入口・説明戦略・制度ステータス」を、本人の説明能力や支援の有無ではなく、入口で結果を変えうる構造上の自由度で再分類した。",
        "",
        f"入力ケース数: {payload['input_case_count']}",
        f"S-05候補ケース数: {payload['s05_candidate_count']}",
        f"軽減側の別探索候補数: {payload['positive_contrast_search']['record_count']}",
        "",
        "この出力は、派生済みケース解釈の信号だけを使う。本文引用は含めない。人間レビュー済み知識ではない。",
        "",
        "S-05候補の内部だけでは、入口摩擦の問題側・残余側が厚くなりやすい。これは軽減側が存在しないという意味ではなく、問題側キーワードで作った枝からは、入口翻訳が機能している側を取りにくいという方法上の発見である。そこで、入口・説明・制度関連信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
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
        "候補枝内の軽減側は少ないため、別探索で拾った軽減側候補を自由度別に対応づける。",
        "",
        "| 自由度 | 別探索の軽減側候補 | 代表ID |",
        "|---|---:|---|",
    ])
    for axis in payload["axes"]:
        lines.append(
            f"| {axis['title']} | {axis['separate_mitigation_side_count']} | {md_list(axis['separate_mitigation_side_ids'][:5])} |"
        )

    lines.extend(["", "## 構造候補", ""])
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
            f"別探索軽減側ID: {md_list(axis['separate_mitigation_side_ids'])}",
            f"残余側ID: {md_list(axis['residual_side_ids'])}",
            f"境界側ID: {md_list(axis['boundary_side_ids'])}",
            "",
        ])

    lines.extend([
        "## 読み取れたこと",
        "",
        "S-05は「病気や障害をうまく説明できるか」だけでは粗い。入口で動く自由度は、本人条件を企業語へ翻訳すること、求人条件を本人の生活語へ戻すこと、制度ステータス、実習・見学・支援者同席、訓練・移動・治療条件、生活再建・希望形成の境界に分かれる。",
        "",
        "特に重要なのは、入口支援が一方向の説明支援ではない点である。本人の強みや必要条件を企業側が扱える形にしつつ、求人・職務要求を本人の健康管理・生活条件・参加可能性へ戻す双方向翻訳として読む必要がある。",
        "",
        "この再分類は、Falconが作るべき知識を「就職活動支援メニュー」から「入口で結果を変えうる自由度の地図」へ近づける。",
        "",
        "## 次の処理",
        "",
        "S-02B、S-05、S-07Cで、問題側探索と軽減側別探索を対にする必要性が共通して出た。次はS-06支援アクセスで、相談先の有無ではなく、本人・企業・医療・福祉・雇用のどの接続自由度が結果を変えるかを同じ型で検証する。",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    payload = build()
    write_outputs(payload)
    summary = {
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "s05_candidate_count": payload["s05_candidate_count"],
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
