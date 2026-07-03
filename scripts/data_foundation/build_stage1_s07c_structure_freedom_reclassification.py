#!/usr/bin/env python3
"""Reclassify S-07C by structure-changing degrees of freedom."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
BASE_DIR = ROOT / "references/derived/scima-fchma/stage1-context-reading-v0-2026-05-14"
CASE_JSONL = ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl"
OUT_JSON = BASE_DIR / "stage1-s07c-structure-freedom-reclassification-v0-2026-05-17.json"
OUT_MD = BASE_DIR / "stage1-s07c-structure-freedom-reclassification-v0-2026-05-17.md"

STATUS = "machine_generated_unreviewed_no_promotion"

S07C_BRANCH_KEYWORDS = (
    "情報保障",
    "コミュニケーション",
    "意見",
    "評価",
    "役割",
    "キャリア",
    "参加",
    "処遇",
)

S07C_SIGNAL_FIELDS = (
    "pattern_cell_id",
    "status_group",
    "work_status_label",
    "body_function_signals",
    "impairment_signals",
    "accommodations_needed_absent",
    "accommodations_present",
    "post_employment_unresolved",
    "job_search_unresolved",
    "pre_employment_unresolved",
    "low_work_confidence",
    "narrative_context_labels",
    "uncertainty_flags",
)

AXES = {
    "F03-0-broad-checklist-saturation": {
        "title": "広範チェックリスト飽和",
        "freedom": "多数の未充足・未解決項目が一括で出ており、自由度を機械的に一つへ絞れない。",
        "result_focus": "S-07C候補ではあるが、LLM文脈読解で主自由度を再探索する必要がある。",
        "keywords": (),
        "candidate": "広範な未充足・未解決信号は重要な問題側候補だが、そのままでは情報アクセス、評価、説明負荷、生活条件等が混ざり、構造候補にできない。",
        "counter": "広範信号は単なる回答傾向や一時的不安を含む可能性があり、個別ケース文脈を読まずに構造化しない。",
    },
    "F03-1-information-form-confirmability": {
        "title": "情報形式と確認可能性",
        "freedom": "音声・文字・視覚・手順・事前共有・事後確認など、情報の形式と確認可能性が変わるか。",
        "result_focus": "指示理解、会議・研修参加、職場内学習、日常連絡への参加が変わる。",
        "keywords": (
            "情報保障",
            "コミュニケーション",
            "意思",
            "会話",
            "会議",
            "研修",
            "指示",
            "読む",
            "書く",
            "計算",
            "注意集中",
            "判断",
            "作業マニュアル",
            "OJT",
            "連絡",
        ),
        "candidate": "情報アクセスの主問題は、支援項目名ではなく、職場情報が本人に届き、確認でき、仕事の学習と判断に使える形式へ変換されるかにある可能性。",
        "counter": "主因は情報形式ではなく、職務量、評価制度、対人関係、健康管理、本人が望む情報共有範囲かもしれない。",
    },
    "F03-2-responsibility-ownership": {
        "title": "情報保障・相談の責任所在",
        "freedom": "本人、上司、同僚、支援者、相談員の誰が情報共有と再調整を担うか。",
        "result_focus": "本人が毎回孤立して説明・依頼する状態か、職場内で再調整できる状態かが変わる。",
        "keywords": (
            "相談",
            "上司",
            "同僚",
            "職場内",
            "仕事上の相談",
            "仕事内容や職場状況",
            "専任の相談員",
            "支援機関",
            "支援者",
            "職場理解",
            "生活全般",
        ),
        "candidate": "情報アクセスの問題は、本人のコミュニケーション能力だけでなく、職場内で誰が相談・確認・再調整の責任を持つかによって変わる可能性。",
        "counter": "責任所在に見えても、実際には職務設計、雇用形態、地域資源、本人の相談希望の有無が主因かもしれない。",
    },
    "F03-3-evaluation-role-career-connection": {
        "title": "評価・役割・キャリアへの接続",
        "freedom": "情報アクセスが、評価基準、役割拡大、責任遂行、技能習得、昇進・報酬へ接続されるか。",
        "result_focus": "働いているだけでなく、能力発揮・評価参加・キャリア形成に参加できるかが変わる。",
        "keywords": (
            "評価",
            "昇進",
            "報酬",
            "処遇",
            "キャリア",
            "役割",
            "責任",
            "技能",
            "職業スキル",
            "業務内容",
            "仕事で要求",
            "人事方針",
            "能力",
        ),
        "candidate": "情報保障が会話補助で止まると、評価・責任・役割拡大・キャリア形成への参加が残る可能性。",
        "counter": "評価やキャリアの問題は、情報アクセスではなく、一般的な人事制度、雇用形態、職務経験、本人希望が主因かもしれない。",
    },
    "F03-4-self-explanation-request-burden": {
        "title": "本人が説明・依頼を背負う負荷",
        "freedom": "本人が障害・必要条件・希望・配慮をどの範囲で、誰に、何度説明しなければならないか。",
        "result_focus": "開示、応募、面接、職場内調整、相談し直しの負荷が変わる。",
        "keywords": (
            "説明",
            "伝える",
            "誤解",
            "開示",
            "アピール",
            "応募",
            "面接",
            "説得",
            "連絡",
            "必要な環境整備",
            "病気や障害について",
            "職場で必要な配慮",
        ),
        "candidate": "情報アクセスの構造には、本人が説明・依頼・開示を背負い続ける負荷が含まれ、それが就職入口や職場内参加を狭める可能性。",
        "counter": "説明負荷に見えても、主因は求人条件、本人の開示希望、支援者同席の有無、職場の変更可能性かもしれない。",
    },
    "F03-5-implementation-conditions": {
        "title": "支援実装条件",
        "freedom": "支援機器、通訳、筆談、要約、ジョブコーチ、職場実習等が、職場内で実際に使える条件へ落ちるか。",
        "result_focus": "支援が制度項目・希望項目に留まるか、実際の仕事参加へ届くかが変わる。",
        "keywords": (
            "支援機器",
            "通訳",
            "筆談",
            "要約",
            "機器",
            "ジョブコーチ",
            "同行支援",
            "職場実習",
            "職場見学",
            "トライアル",
            "物理環境",
            "職場配慮",
            "専門性",
        ),
        "candidate": "情報アクセスの構造は、支援を入れるかどうかではなく、支援が守秘・費用・職場承認・専門性・実作業の条件に接続されるかで変わる可能性。",
        "counter": "支援実装条件に見えても、職務そのものの再設計、自然な同僚コミュニケーション、本人希望、評価制度が主因かもしれない。",
    },
    "F03-6-boundary-other-main-axis": {
        "title": "境界: 情報アクセス以外が主自由度",
        "freedom": "似た信号があっても、結果を変える主自由度が健康管理、移動、収入、生活、制度接続等にあるか。",
        "result_focus": "S-07Cへ吸収せず、別構造へ接続すべきケースを切り分ける。",
        "keywords": (
            "通院",
            "治療",
            "疲労",
            "体調",
            "ストレス",
            "収入",
            "生活",
            "地域生活",
            "移動",
            "通勤",
            "姿勢",
            "身体操作",
            "健康管理",
            "病気の定期的なチェック",
        ),
        "candidate": "情報アクセスに見える信号があっても、主自由度が健康管理、移動、生活保障、制度接続にある場合は、S-07Cではなく境界として扱うべきである。",
        "counter": "健康管理や生活問題に見えても、背景で情報共有や相談経路の不足が効いている可能性は残る。",
    },
    "F03-7-context-thin-structured-only": {
        "title": "文脈薄: 構造化信号のみ",
        "freedom": "構造化回答ではS-07Cに当たるが、記述ラベルが薄く、主自由度を決めにくい。",
        "result_focus": "候補IDとして保持するが、構造候補ではなく追加読解待ちにする。",
        "keywords": (),
        "candidate": "記述文脈が薄い場合、選択回答だけで情報アクセス構造を確定せず、同型探索や追加読解候補として保持する。",
        "counter": "記述が薄くても、選択回答だけで十分に構造が出ているケースもあるため、一律に捨てない。",
    },
}

AXIS_THRESHOLDS = {
    "F03-1-information-form-confirmability": (5, 1),
    "F03-2-responsibility-ownership": (5, 1),
    "F03-3-evaluation-role-career-connection": (14, 2),
    "F03-4-self-explanation-request-burden": (5, 1),
    "F03-5-implementation-conditions": (5, 1),
    "F03-6-boundary-other-main-axis": (5, 1),
}

AXIS_FIELDS = {
    "F03-1-information-form-confirmability": ("narrative_context_labels",),
    "F03-2-responsibility-ownership": ("narrative_context_labels",),
    "F03-3-evaluation-role-career-connection": (
        "post_employment_unresolved",
        "satisfaction_risks",
        "narrative_context_labels",
    ),
    "F03-4-self-explanation-request-burden": (
        "disclosure_gaps",
        "narrative_context_labels",
    ),
    "F03-5-implementation-conditions": (
        "narrative_context_labels",
    ),
    "F03-6-boundary-other-main-axis": (
        "narrative_context_labels",
    ),
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


def is_s07c_candidate(row: dict[str, Any]) -> tuple[bool, int, int, list[str]]:
    text = compact_record_text(row, S07C_SIGNAL_FIELDS)
    score, unique, hits = score_keywords(text, S07C_BRANCH_KEYWORDS)
    return score >= 18 and unique >= 3, score, unique, hits


def is_broad_saturation(row: dict[str, Any]) -> bool:
    absent = len(row.get("accommodations_needed_absent") or [])
    post = len(row.get("post_employment_unresolved") or [])
    pre = len(row.get("pre_employment_unresolved") or [])
    return absent >= 25 or post >= 25 or (pre >= 10 and absent >= 15)


def axis_memberships(row: dict[str, Any]) -> tuple[list[str], list[dict[str, Any]]]:
    narrative_labels = row.get("narrative_context_labels") or []
    axis_scores = []
    for axis_id, axis in AXES.items():
        if axis_id in {"F03-0-broad-checklist-saturation", "F03-7-context-thin-structured-only"}:
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
        memberships.append("F03-0-broad-checklist-saturation")
    for item in axis_scores:
        threshold, min_unique = AXIS_THRESHOLDS[item["axis_id"]]
        if item["score"] >= threshold and item["unique_keyword_hits"] >= min_unique:
            memberships.append(item["axis_id"])
    if not narrative_labels:
        memberships.append("F03-7-context-thin-structured-only")
    if not memberships:
        memberships.append("F03-6-boundary-other-main-axis")
    return memberships, axis_scores


def placement(row: dict[str, Any], axis_id: str) -> str:
    if axis_id == "F03-0-broad-checklist-saturation":
        return "exploration_hold"
    if axis_id == "F03-7-context-thin-structured-only":
        return "exploration_hold"
    if axis_id == "F03-6-boundary-other-main-axis":
        return "boundary_side"
    present = len(row.get("accommodations_present") or [])
    absent = len(row.get("accommodations_needed_absent") or [])
    post = len(row.get("post_employment_unresolved") or [])
    pre = len(row.get("pre_employment_unresolved") or [])
    sat = len(row.get("satisfaction_risks") or [])
    status = row.get("status_group")

    if status == "currently_working" and present >= 8 and absent <= 1 and post <= 1 and sat == 0:
        return "mitigation_side"
    if present >= 3 and (absent >= 3 or post >= 2 or sat > 0):
        return "residual_side"
    if absent >= 8 and (post >= 5 or pre >= 5 or sat > 0) and present <= 4:
        return "problem_side"
    return "boundary_side"


def compact_case(row: dict[str, Any], memberships: list[str], axis_scores: list[dict[str, Any]], branch_hits: list[str]) -> dict[str, Any]:
    primary_hint = next((axis_id for axis_id in memberships if axis_id not in {"F03-0-broad-checklist-saturation", "F03-7-context-thin-structured-only"}), memberships[0])
    return {
        "record_id": row["record_id"],
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
            "pre_employment_unresolved": len(row.get("pre_employment_unresolved") or []),
            "satisfaction_risks": len(row.get("satisfaction_risks") or []),
            "narrative_context_labels": len(row.get("narrative_context_labels") or []),
        },
        "safe_signal_labels": {
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
        target.sort(key=lambda case: (-(case["counts"]["accommodations_needed_absent"] + case["counts"]["post_employment_unresolved"] + case["counts"]["pre_employment_unresolved"]), case["record_id"]))
    elif placement_name == "mitigation_side":
        target.sort(key=lambda case: (-case["counts"]["accommodations_present"], case["record_id"]))
    elif placement_name == "residual_side":
        target.sort(key=lambda case: (-(case["counts"]["accommodations_present"] + case["counts"]["accommodations_needed_absent"] + case["counts"]["post_employment_unresolved"]), case["record_id"]))
    else:
        target.sort(key=lambda case: (-(case["counts"]["narrative_context_labels"]), case["record_id"]))
    return [case["record_id"] for case in target[:limit]]


def build() -> dict[str, Any]:
    rows = read_jsonl(CASE_JSONL)
    cases: list[dict[str, Any]] = []
    for row in rows:
        ok, _score, _unique, hits = is_s07c_candidate(row)
        if not ok:
            continue
        memberships, axis_scores = axis_memberships(row)
        cases.append(compact_case(row, memberships, axis_scores, hits))

    positive_contrasts = []
    info_function_pattern = re.compile("難聴|ろう|聴覚|弱視|全盲|視野|知的|自閉|発達|高次脳|読字|学習")
    for row in rows:
        impairment_text = norm(row.get("impairment_signals"))
        present = len(row.get("accommodations_present") or [])
        absent = len(row.get("accommodations_needed_absent") or [])
        post = len(row.get("post_employment_unresolved") or [])
        sat = len(row.get("satisfaction_risks") or [])
        if (
            row.get("status_group") == "currently_working"
            and info_function_pattern.search(impairment_text)
            and present >= 8
            and absent <= 1
            and post <= 1
            and sat == 0
        ):
            positive_contrasts.append({
                "record_id": row["record_id"],
                "counts": {
                    "accommodations_present": present,
                    "accommodations_needed_absent": absent,
                    "post_employment_unresolved": post,
                    "satisfaction_risks": sat,
                    "narrative_context_labels": len(row.get("narrative_context_labels") or []),
                },
                "safe_signal_labels": {
                    "impairment_signals": (row.get("impairment_signals") or [])[:4],
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
        if axis_id in {"F03-0-broad-checklist-saturation", "F03-7-context-thin-structured-only"}:
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
        "source_dataset": "employment_survey_3000",
        "input_case_count": len(rows),
        "s07c_candidate_count": len(cases),
        "positive_contrast_search": {
            "note": "S-07C候補内だけでは軽減側が薄いため、情報アクセス関連の機能信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
            "record_count": len(positive_contrasts),
            "representative_ids": [item["record_id"] for item in positive_contrasts[:20]],
            "records": positive_contrasts,
        },
        "method": {
            "branch_candidate_rule": "stage1 S-07C keyword rule over derived case-interpretation signal fields only: score >= 18 and unique keyword hits >= 3",
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
        "# Stage 1 S-07C 構造自由度再分類 v0",
        "",
        "日付: 2026-05-17",
        "状態: Falcon Lab / 構造発見実験 / 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "## 何をしたか",
        "",
        "S-07C「情報アクセスは合理的配慮項目ではなく参加の質の問題」を、配慮・支援の有無ではなく、結果を変えうる構造上の自由度で再分類した。",
        "",
        f"入力ケース数: {payload['input_case_count']}",
        f"S-07C候補ケース数: {payload['s07c_candidate_count']}",
        f"軽減側の別探索候補数: {payload['positive_contrast_search']['record_count']}",
        "",
        "この出力は、派生済みケース解釈の信号だけを使う。本文引用は含めない。人間レビュー済み知識ではない。",
        "",
        "S-07C候補の内部だけでは、軽減側IDが非常に薄い。これは軽減側が存在しないという意味ではなく、問題側キーワードで作った枝からは軽減側が取りにくいという方法上の発見である。そこで、情報アクセス関連の機能信号を持ち、就労中で未充足・未解決信号が少ない記録を別探索した。",
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
        "S-07Cは「情報保障がある/ない」では粗い。少なくとも、情報形式、責任所在、評価・役割接続、本人の説明負荷、支援実装条件、境界軸に分かれる。",
        "",
        "特に重要なのは、情報アクセスが改善しても、評価・役割・キャリアへ接続しなければ参加の質は残る可能性があること。逆に、支援項目が多くなくても、情報形式や責任所在が機能していれば、同型問題が軽減している可能性がある。",
        "",
        "この再分類は、Falconが作るべき知識を「問題一覧」から「結果を変えうる自由度の地図」へ近づける。",
        "",
        "## 次の処理",
        "",
        "次は、各自由度の上位IDから、記述濃度が高いものをLLM文脈読解にかけ、主自由度が本当に同じか、軽減側が本当に同型か、境界側をどこで切るかを確認する。",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    payload = build()
    write_outputs(payload)
    summary = {
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "s07c_candidate_count": payload["s07c_candidate_count"],
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
