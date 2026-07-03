#!/usr/bin/env python3
"""Reclassify S-06 by structure-changing degrees of freedom."""

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
OUT_JSON = BASE_DIR / "stage1-s06-structure-freedom-reclassification-v0-2026-05-17.json"
OUT_MD = BASE_DIR / "stage1-s06-structure-freedom-reclassification-v0-2026-05-17.md"

STATUS = "machine_generated_unreviewed_no_promotion"

S06_CORE_CELLS = {
    "RC-05-support-need-access-mismatch",
    "EC-05-support-access-service-fit-mismatch",
}

POSITIVE_CONTRAST_FIELDS = (
    "consultation_gaps",
    "consultation_sources",
    "support_use_gaps",
    "desired_supports",
    "accommodations_present",
    "narrative_context_labels",
)

AXES = {
    "F04-0-broad-support-friction-saturation": {
        "title": "広範な支援摩擦の飽和",
        "freedom": "相談先、制度、支援メニュー、職場調整、生活段階が同時に出ており、主自由度を一つに絞れない。",
        "result_focus": "S-06候補として保持するが、LLM文脈読解では支援アクセスを再分解する。",
        "keywords": (),
        "candidate": "支援ギャップが広範に出る記録は重要だが、そのままでは入口不明、役割分担、メニュー不適合、継続接続、地域資源が混ざる。",
        "counter": "広範な支援摩擦は、支援アクセスではなく、生活保障、就職入口、職場内再設計、本人の希望形成が主自由度かもしれない。",
    },
    "F04-1-entry-legibility": {
        "title": "相談入口が読めるか",
        "freedom": "本人や職場が、どこに何を相談できるか、対象・役割・相談内容を読めるか。",
        "result_focus": "相談到達、初回相談、支援利用開始、早期介入の可能性が変わる。",
        "keywords": (
            "知らなかった",
            "利用の仕方が分からない",
            "相談先",
            "相談",
            "窓口",
            "ハローワーク",
            "センター",
            "主治医",
            "専門医",
            "どこに相談",
            "担当では",
        ),
        "candidate": "支援アクセスの第一自由度は、支援資源の存在ではなく、本人・職場・医療側から相談入口と役割が読めるかにある。",
        "counter": "入口が読めないように見えても、主因は制度対象外、本人の生活段階、地域資源、職場側の受け入れ条件かもしれない。",
    },
    "F04-2-cross-domain-role-translation": {
        "title": "医療・福祉・雇用・企業の役割分担",
        "freedom": "医療、福祉、雇用、企業、本人のどこが何を持ち、誰が翻訳・調整役になるか。",
        "result_focus": "支援が紹介で止まるか、仕事設計・生活条件・治療条件をつなぐ見立てになるかが変わる。",
        "keywords": (
            "連携",
            "関係機関連携",
            "本人・医療・職場",
            "両立支援",
            "主治医",
            "専門医",
            "産業医",
            "ソーシャルワーカー",
            "支援機関",
            "職場",
            "役割",
        ),
        "candidate": "支援アクセスは、紹介先の有無ではなく、本人・医療・福祉・雇用・企業の役割が接続されるかで結果が変わる可能性。",
        "counter": "役割分担に見えても、実際には入口不明、制度対象、地域資源、職務設計、本人同意範囲が主因かもしれない。",
    },
    "F04-3-service-fit-to-context": {
        "title": "支援メニューが本人文脈に合うか",
        "freedom": "支援メニューが、障害特性、疾病変動、生活段階、職務課題、希望する働き方に合う形で届くか。",
        "result_focus": "支援利用後の納得感、実効性、再相談、就労継続への接続が変わる。",
        "keywords": (
            "ニーズには合わなかった",
            "役に立",
            "支援メニュー",
            "専門的就労支援",
            "興味・強み",
            "職業相談",
            "治療と両立",
            "活躍できる仕事",
            "専門性",
            "障害特性",
        ),
        "candidate": "支援の有無ではなく、支援内容が本人の生活段階・職務課題・健康管理条件に合う形へ調整されるかが主自由度になる。",
        "counter": "メニュー不適合に見えても、入口の読み違い、期待差、地域資源不足、制度対象、職場側条件が主因かもしれない。",
    },
    "F04-4-continuity-after-entry": {
        "title": "利用後・就職後の継続接続",
        "freedom": "相談・紹介・就職後に、再調整、定着、体調変化、職場変化へ継続接続できるか。",
        "result_focus": "一回の相談や就職で終わらず、危機前再調整や定着支援へつながるかが変わる。",
        "keywords": (
            "継続支援",
            "就職後も相談",
            "定着",
            "再調整",
            "フォロー",
            "休職",
            "復職",
            "疾患進行時",
            "就業継続支援",
            "相談できる",
        ),
        "candidate": "支援アクセスは入口到達だけでなく、利用後・就職後に変化へ再接続できるかで結果が変わる。",
        "counter": "継続接続に見えても、主因は初期の職務設計、治療時間、生活保障、本人希望、職場内相談経路かもしれない。",
    },
    "F04-5-trust-quality-experience": {
        "title": "支援信頼・品質経験",
        "freedom": "相談経験が、信頼、納得、専門性、本人尊重、再相談意欲へつながるか。",
        "result_focus": "支援を使い続けるか、支援から離れるか、本人が説明負荷を一人で背負うかが変わる。",
        "keywords": (
            "不信",
            "聞いて",
            "熱心",
            "専門性",
            "品質",
            "ニーズには合わなかった",
            "期待",
            "納得",
            "本人責任",
            "支援者",
        ),
        "candidate": "支援利用の有無だけではなく、支援経験が信頼や再相談可能性を作るか失わせるかが、次の支援到達を左右する。",
        "counter": "信頼・品質に見えても、制度対象外、地域資源不足、相談内容の整理不足、本人の同意範囲が主因かもしれない。",
    },
    "F04-6-boundary-institution-life-resource": {
        "title": "境界: 制度対象・生活資源が主自由度",
        "freedom": "支援アクセスに見える信号が、制度対象性、手帳、地域資源、生活保障、医療費、家族条件に主に左右されるか。",
        "result_focus": "S-06へ吸収せず、生活保障・制度入口・地域資源の構造へ接続する。",
        "keywords": (
            "制度",
            "手帳",
            "対象外",
            "地域",
            "生活",
            "収入",
            "医療費",
            "年金",
            "家族",
            "自治体",
            "地域資源",
        ),
        "candidate": "支援アクセスに見える問題でも、主自由度が制度対象・生活資源・地域条件にある場合は境界として扱う。",
        "counter": "制度・生活資源に見えても、実際には相談入口、役割分担、支援メニューの翻訳不足が背景で効いている可能性がある。",
    },
    "F04-7-context-thin-structured-only": {
        "title": "文脈薄: 構造化信号のみ",
        "freedom": "構造化回答ではS-06に当たるが、記述ラベルが薄く、主自由度を決めにくい。",
        "result_focus": "候補IDとして保持するが、構造候補ではなく追加読解待ちにする。",
        "keywords": (),
        "candidate": "支援未利用や相談先リストだけで、支援アクセス構造を確定しない。",
        "counter": "記述が薄くても、選択回答だけで入口不明やメニュー不適合が十分見えている可能性は残る。",
    },
}

AXIS_THRESHOLDS = {
    "F04-1-entry-legibility": (8, 1),
    "F04-2-cross-domain-role-translation": (8, 1),
    "F04-3-service-fit-to-context": (8, 1),
    "F04-4-continuity-after-entry": (8, 1),
    "F04-5-trust-quality-experience": (8, 1),
    "F04-6-boundary-institution-life-resource": (8, 1),
}

AXIS_FIELDS = {
    "F04-1-entry-legibility": ("consultation_gaps", "support_use_gaps", "consultation_sources", "narrative_context_labels"),
    "F04-2-cross-domain-role-translation": ("support_use_gaps", "consultation_sources", "desired_supports", "narrative_context_labels"),
    "F04-3-service-fit-to-context": ("support_use_gaps", "desired_supports", "narrative_context_labels"),
    "F04-4-continuity-after-entry": ("support_use_gaps", "post_employment_unresolved", "accommodations_present", "narrative_context_labels"),
    "F04-5-trust-quality-experience": ("support_use_gaps", "consultation_gaps", "narrative_context_labels", "counter_reading"),
    "F04-6-boundary-institution-life-resource": ("support_use_gaps", "consultation_gaps", "desired_supports", "low_soc_or_life_signals", "narrative_context_labels"),
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


def is_s06_candidate(row: dict[str, Any]) -> bool:
    return row.get("pattern_cell_id") in S06_CORE_CELLS


def is_broad_saturation(row: dict[str, Any]) -> bool:
    consultation = len(row.get("consultation_gaps") or [])
    support = len(row.get("support_use_gaps") or [])
    absent = len(row.get("accommodations_needed_absent") or [])
    post = len(row.get("post_employment_unresolved") or [])
    return consultation >= 15 or support >= 6 or (absent >= 8 and post >= 5)


def axis_memberships(row: dict[str, Any]) -> tuple[list[str], list[dict[str, Any]]]:
    narrative_labels = row.get("narrative_context_labels") or []
    axis_scores = []
    for axis_id, axis in AXES.items():
        if axis_id in {"F04-0-broad-support-friction-saturation", "F04-7-context-thin-structured-only"}:
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
        memberships.append("F04-0-broad-support-friction-saturation")
    for item in axis_scores:
        threshold, min_unique = AXIS_THRESHOLDS[item["axis_id"]]
        if item["score"] >= threshold and item["unique_keyword_hits"] >= min_unique:
            memberships.append(item["axis_id"])
    if not narrative_labels:
        memberships.append("F04-7-context-thin-structured-only")
    if not memberships:
        memberships.append("F04-6-boundary-institution-life-resource")
    return memberships, axis_scores


def placement(row: dict[str, Any], axis_id: str) -> str:
    if axis_id in {"F04-0-broad-support-friction-saturation", "F04-7-context-thin-structured-only"}:
        return "exploration_hold"

    present = len(row.get("accommodations_present") or [])
    absent = len(row.get("accommodations_needed_absent") or [])
    support = len(row.get("support_use_gaps") or [])
    consultation = len(row.get("consultation_gaps") or [])
    post = len(row.get("post_employment_unresolved") or [])
    job_search = len(row.get("job_search_unresolved") or [])
    pre = len(row.get("pre_employment_unresolved") or [])

    if row.get("status_group") == "currently_working" and support <= 1 and absent <= 2 and post <= 2 and job_search <= 2 and pre <= 2 and present >= 4:
        return "mitigation_side"
    if present >= 4 and (support >= 2 or absent >= 3 or post >= 2 or consultation >= 8):
        return "residual_side"
    if (support >= 3 or consultation >= 12 or absent >= 6) and present <= 8:
        return "problem_side"
    if axis_id == "F04-6-boundary-institution-life-resource":
        return "boundary_side"
    return "boundary_side"


def compact_case(row: dict[str, Any], memberships: list[str], axis_scores: list[dict[str, Any]]) -> dict[str, Any]:
    hold_axes = {"F04-0-broad-support-friction-saturation", "F04-7-context-thin-structured-only"}
    primary_hint = next((axis_id for axis_id in memberships if axis_id not in hold_axes), memberships[0])
    return {
        "record_id": row["record_id"],
        "source_dataset": row.get("source_dataset"),
        "status_group": row.get("status_group"),
        "pattern_cell_id": row.get("pattern_cell_id"),
        "primary_axis_hint": primary_hint,
        "axis_memberships": memberships,
        "placement": placement(row, primary_hint),
        "axis_top_scores": axis_scores[:3],
        "counts": {
            "consultation_gaps": len(row.get("consultation_gaps") or []),
            "support_use_gaps": len(row.get("support_use_gaps") or []),
            "accommodations_present": len(row.get("accommodations_present") or []),
            "accommodations_needed_absent": len(row.get("accommodations_needed_absent") or []),
            "post_employment_unresolved": len(row.get("post_employment_unresolved") or []),
            "job_search_unresolved": len(row.get("job_search_unresolved") or []),
            "pre_employment_unresolved": len(row.get("pre_employment_unresolved") or []),
            "narrative_context_labels": len(row.get("narrative_context_labels") or []),
        },
        "safe_signal_labels": {
            "health_condition_groups": (row.get("health_condition_groups") or [])[:4],
            "impairment_signals": (row.get("impairment_signals") or [])[:4],
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
        target.sort(key=lambda case: (-(case["counts"]["support_use_gaps"] + case["counts"]["consultation_gaps"] + case["counts"]["accommodations_needed_absent"]), case["record_id"]))
    elif placement_name == "mitigation_side":
        target.sort(key=lambda case: (-(case["counts"]["narrative_context_labels"] + case["counts"]["accommodations_present"]), case["record_id"]))
    elif placement_name == "residual_side":
        target.sort(key=lambda case: (-(case["counts"]["accommodations_present"] + case["counts"]["support_use_gaps"] + case["counts"]["consultation_gaps"]), case["record_id"]))
    else:
        target.sort(key=lambda case: (-(case["counts"]["narrative_context_labels"] + case["counts"]["support_use_gaps"]), case["record_id"]))
    return [case["record_id"] for case in target[:limit]]


def build_positive_contrasts(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    support_pattern = re.compile("相談|支援|ハローワーク|主治医|専門医|センター|制度|連携|地域|職場開拓|継続支援")
    positive_contrasts = []
    for row in rows:
        text = compact_record_text(row, POSITIVE_CONTRAST_FIELDS)
        present = len(row.get("accommodations_present") or [])
        absent = len(row.get("accommodations_needed_absent") or [])
        support = len(row.get("support_use_gaps") or [])
        post = len(row.get("post_employment_unresolved") or [])
        job_search = len(row.get("job_search_unresolved") or [])
        pre = len(row.get("pre_employment_unresolved") or [])
        if (
            row.get("status_group") == "currently_working"
            and support_pattern.search(text)
            and present >= 4
            and support <= 1
            and absent <= 2
            and post <= 2
            and job_search <= 2
            and pre <= 2
        ):
            memberships, axis_scores = axis_memberships(row)
            hold_axes = {"F04-0-broad-support-friction-saturation", "F04-7-context-thin-structured-only"}
            structure_axes = [axis_id for axis_id in memberships if axis_id not in hold_axes]
            positive_contrasts.append({
                "record_id": row["record_id"],
                "source_dataset": row.get("source_dataset"),
                "primary_axis_hint": structure_axes[0] if structure_axes else memberships[0],
                "axis_memberships": memberships,
                "axis_top_scores": axis_scores[:3],
                "counts": {
                    "consultation_gaps": len(row.get("consultation_gaps") or []),
                    "support_use_gaps": support,
                    "accommodations_present": present,
                    "accommodations_needed_absent": absent,
                    "post_employment_unresolved": post,
                    "job_search_unresolved": job_search,
                    "pre_employment_unresolved": pre,
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
        if not is_s06_candidate(row):
            continue
        memberships, axis_scores = axis_memberships(row)
        cases.append(compact_case(row, memberships, axis_scores))

    positive_contrasts = build_positive_contrasts(rows)
    hold_axes = {"F04-0-broad-support-friction-saturation", "F04-7-context-thin-structured-only"}
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
        if axis_id in hold_axes:
            placement_counts = Counter({"exploration_hold": len(group)})
            problem_side_ids: list[str] = []
            mitigation_side_ids: list[str] = []
            residual_side_ids: list[str] = []
            boundary_side_ids: list[str] = []
        else:
            placement_counts = Counter(case["placement"] for case in group)
            problem_side_ids = choose_examples(group, "problem_side")
            mitigation_side_ids = choose_examples(group, "mitigation_side")
            residual_side_ids = choose_examples(group, "residual_side")
            boundary_side_ids = choose_examples(group, "boundary_side")
        separate_items = sorted(
            positive_axis_groups.get(axis_id, []),
            key=lambda item: (
                -item["counts"]["narrative_context_labels"],
                -item["counts"]["accommodations_present"],
                item["record_id"],
            ),
        )
        axes.append({
            "axis_id": axis_id,
            "title": axis["title"],
            "freedom": axis["freedom"],
            "result_focus": axis["result_focus"],
            "status": STATUS,
            "record_count": len(group),
            "placement_counts": dict(sorted(placement_counts.items())),
            "separate_mitigation_side_count": len(separate_items),
            "separate_mitigation_side_ids": [item["record_id"] for item in separate_items[:8]],
            "exploration_hold_ids": choose_examples(group, "exploration_hold"),
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
        "s06_candidate_count": len(cases),
        "positive_contrast_search": {
            "note": "S-06候補内だけでは支援アクセス問題側が厚くなるため、支援・相談関連信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
            "record_count": len(positive_contrasts),
            "representative_ids": [item["record_id"] for item in positive_contrasts[:20]],
            "records": positive_contrasts,
        },
        "method": {
            "branch_candidate_rule": "stage1 S-06 core-cell rule over derived case-interpretation signal fields only: RC-05 or EC-05 pattern cell",
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
        "# Stage 1 S-06 構造自由度再分類 v0",
        "",
        "日付: 2026-05-17",
        "状態: Falcon Lab / 構造発見実験 / 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "## 何をしたか",
        "",
        "S-06「支援アクセス・支援メニュー不適合」を、相談先や支援メニューの有無ではなく、支援が本人文脈へ届くかを変える構造上の自由度で再分類した。",
        "",
        f"入力ケース数: {payload['input_case_count']}",
        f"S-06候補ケース数: {payload['s06_candidate_count']}",
        f"軽減側の別探索候補数: {payload['positive_contrast_search']['record_count']}",
        "",
        "この出力は、派生済みケース解釈の信号だけを使う。本文引用は含めない。人間レビュー済み知識ではない。",
        "",
        "S-06候補の内部だけでは、支援アクセスの問題側・残余側が厚くなりやすい。これは軽減側が存在しないという意味ではなく、問題側セルで作った枝からは支援接続が機能している側を取りにくいという方法上の発見である。そこで、支援・相談関連信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
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
        "S-06は「相談先を知っているか」「支援を使ったか」だけでは粗い。結果を変えうる自由度は、相談入口が読めるか、医療・福祉・雇用・企業の役割分担、支援メニューの本人文脈への適合、利用後・就職後の継続接続、支援信頼・品質経験、制度対象・生活資源の境界に分かれる。",
        "",
        "特に重要なのは、支援資源の存在と支援が本人文脈に届くことは別だという点である。支援があるかではなく、どこで入口が読め、誰が翻訳し、どこまで継続接続されるかを構造として読む必要がある。",
        "",
        "この再分類は、Falconが作るべき知識を「支援先一覧」から「支援接続の結果を変えうる自由度の地図」へ近づける。",
        "",
        "## 次の処理",
        "",
        "S-02B、S-05、S-06、S-07Cで、問題側探索と軽減側別探索を対にする必要性が共通して出た。次は、この4枝から共通する構造自由度をまとめ、Stage 1全体の分析パイプラインへ入れる。",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    payload = build()
    write_outputs(payload)
    summary = {
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "s06_candidate_count": payload["s06_candidate_count"],
        "positive_contrast_count": payload["positive_contrast_search"]["record_count"],
        "axes": [
            {
                "axis_id": axis["axis_id"],
                "record_count": axis["record_count"],
                "separate_mitigation_side_count": axis["separate_mitigation_side_count"],
                "placement_counts": axis["placement_counts"],
            }
            for axis in payload["axes"]
        ],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
