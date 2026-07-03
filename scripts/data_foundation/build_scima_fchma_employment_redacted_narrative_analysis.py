#!/usr/bin/env python3
"""Build SCIMA/FCHMA review artifacts for employment_survey_3000.

This is the cross-dataset companion to the nanbyo full analysis. It uses
structured features plus locally redacted narrative units, and writes only
labels/counts/record IDs. Raw or redacted narrative text is not exported.
"""

from __future__ import annotations

import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DATASET_ID = "employment_survey_3000"
RUN_ID = "redacted-narrative-integrated-v0-2026-05-13"
ANALYSIS_READY = ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0"
REDACTED_NARRATIVE = ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl"
OUT_DIR = ROOT / "references/derived/scima-fchma/employment_survey_3000" / RUN_ID


NARRATIVE_RULES: list[tuple[str, str, re.Pattern[str]]] = [
    ("body_function", "疲労・体調変動・痛みなど心身機能負荷", re.compile(r"疲|体調|痛|しび|痺|発作|症状|不調|ストレス")),
    ("activity", "読む・書く・計算・注意集中など課題遂行", re.compile(r"読む|読め|書く|計算|集中|判断|理解|覚え|記憶|作業")),
    ("activity", "移動・通勤・姿勢・身体操作", re.compile(r"通勤|移動|歩|車椅子|立ち|座り|手|腕|運搬|交通")),
    ("participation", "就職活動・応募・面接・職場実習", re.compile(r"就職|求職|応募|面接|実習|履歴書|求人|会社")),
    ("environment", "職場配慮・機器・物理環境", re.compile(r"配慮|環境|設備|機器|トイレ|休憩|在宅|短時間|フレックス|支援機器")),
    ("environment", "職場理解・開示・差別/偏見", re.compile(r"理解|説明|開示|伝え|差別|偏見|上司|同僚|職場")),
    ("support", "相談先・支援機関・制度利用", re.compile(r"相談|支援|制度|ハローワーク|センター|ジョブコーチ|訓練")),
    ("personal_context", "自信・意欲・将来期待", re.compile(r"自信|意欲|希望|将来|不安|挑戦|決断|できる|無理")),
    ("personal_context", "生活・収入・地域生活", re.compile(r"生活|収入|地域|安心|満足|家族|経済")),
]


CELL_PROPOSITIONS = {
    "EC-02A-current-work-broad-task-accommodation-underalignment": {
        "candidate": (
            "現在就労中で、就職後の職業的課題が広範に未解決であり、必要な職場配慮も多く未整備として出ている。"
            "中心仮説は、個別作業だけでなく、課題遂行、健康管理、対人コミュニケーション、物理・人的環境が、仕事設計として十分につながっていないこと。"
        ),
        "counter": (
            "未解決課題の多さは、職場環境の問題だけを意味しない。"
            "職種選択、本人の技能習得段階、支援制度利用前、回答時点の一時的不安、複数障害の影響が混在している可能性がある。"
        ),
    },
    "EC-02B-current-work-partial-environment-disclosure-gap": {
        "candidate": (
            "現在就労中で一定の就労基盤はあるが、配慮整備、病気・障害の説明、必要支援の伝達、職場理解の一部に摩擦が残る可能性。"
            "中心仮説は、全面的な未整合ではなく、職場との翻訳・調整接点に残る部分的ギャップであること。"
        ),
        "counter": (
            "説明できない、配慮未整備、職場理解のラベルは、本人側の説明不足や職場側の不備だけに還元できない。"
            "説明不要と感じているケース、説明済みだが実装が足りないケース、職務上は問題が限定的なケースを分けて見る。"
        ),
    },
    "EC-03-current-work-satisfaction-treatment-mismatch": {
        "candidate": (
            "現在就労中だが、職業生活満足や処遇適正感が低く、仕事の継続・昇進・報酬・キャリア形成の参加面に摩擦がある可能性。"
            "中心仮説は、配慮の有無だけではなく、働き続けることの意味、処遇、将来展望が参加の質を左右していること。"
        ),
        "counter": (
            "不満足や処遇不適正は、障害・疾患に関わる就労支援課題とは限らない。"
            "一般労働条件、賃金水準、職場文化、個人の職業価値観が混在するため、支援仮説に直結させない。"
        ),
    },
    "EC-10A-past-work-difficulty-carryover": {
        "candidate": (
            "現在は収入のある仕事に就いていないが、過去就業経験があり、就職後の未解決課題や必要配慮未整備の信号が残る。"
            "中心仮説は、過去の仕事上の困難が、再就職準備や就労自信に持ち越されていること。"
        ),
        "counter": (
            "過去就業困難の持ち越しに見えても、現在は療養、生活再建、教育・訓練、家庭事情、年齢段階が前面かもしれない。"
            "離職理由や再就職希望を個別確認せず、就労不能や支援失敗と決めない。"
        ),
    },
    "EC-10B-entry-disclosure-support-friction": {
        "candidate": (
            "就労経験がない、または現在非就労で、応募・面接・説明・配慮伝達・支援利用の入口部分に未解決課題が集まる。"
            "中心仮説は、仕事に入る前の段階で、本人の強み、障害・疾患説明、必要調整を企業向けに翻訳する接点が不足していること。"
        ),
        "counter": (
            "入口摩擦に見えても、就労希望が未形成、教育・生活支援が先行、体調管理が優先、または一般求人以外の進路が適切な可能性がある。"
            "応募支援だけを先走らせない。"
        ),
    },
    "EC-05-support-access-service-fit-mismatch": {
        "candidate": (
            "相談先や就労支援メニューを知らない、利用しても役に立たない、必要だが未利用という信号が重なる。"
            "中心仮説は、支援資源の存在と、本人の障害特性・生活段階・就労課題に合う形で届くことの間に断絶があること。"
        ),
        "counter": (
            "支援ギャップは、支援機関の失敗や本人の利用能力不足を直接意味しない。"
            "利用前、制度対象外、情報不足、地域差、期待と支援内容のズレを分けて読む。"
        ),
    },
    "EC-04-high-impairment-low-work-context": {
        "candidate": (
            "機能障害・手帳・生活上の支援必要性は厚いが、就労経験や職場課題の構造化信号が薄い。"
            "中心仮説は、就労場面の問題がないのではなく、職場文脈に入る前の生活・機能・環境整備が分析の入口になっていること。"
        ),
        "counter": (
            "職場信号の薄さを就労支援不要とは読まない。"
            "調査分岐、就労経験なし、回答者の年齢・生活段階、記述側だけに出る職業文脈を確認する。"
        ),
    },
    "EC-07-low-work-confidence-boundary": {
        "candidate": (
            "適切な理解・配慮・支援があっても仕事ができるか分からない、または難しいという回答が前面に出る。"
            "中心仮説は、就労不能の判定ではなく、就労自信、支援条件の具体化、生活段階を分けて確認する境界群であること。"
        ),
        "counter": (
            "低い就労自信を本人能力の固定評価として読まない。"
            "過去経験、支援未接続、合理的な不安、体調変動、差別経験への警戒が混在している可能性がある。"
        ),
    },
    "EC-08-narrative-context-low-structured-signal": {
        "candidate": (
            "構造化回答では強い未解決信号が少ないが、記述回答側に仕事内容、配慮、支援、生活文脈が出ている。"
            "中心仮説は、チェック項目では薄く見える限定的・局所的な摩擦が記述に残っていること。"
        ),
        "counter": (
            "記述ラベルは中心課題ではなく、一般意見、過去経験、周囲の話、補足説明かもしれない。"
            "構造化信号の弱さを併せて確認する。"
        ),
    },
    "EC-99-mixed-or-low-signal": {
        "candidate": (
            "構造化回答と記述ラベルからは、単一の相互作用仮説をまだ置きにくい。"
            "中心仮説は低ニーズ群ではなく、調査分岐、低記述量、安定就労、複数文脈の混在をレビューで仕分ける保留群であること。"
        ),
        "counter": (
            "低信号は支援不要を意味しない。"
            "安定就労、回答対象外、記述欠如、未捕捉の環境要因が混在する可能性がある。"
        ),
    },
}


DISPLAY_ALIASES = {
    "19仕事ができるか": "条件付き就労自信",
}


@dataclass
class CaseAnalysis:
    record_id: str
    respondent_id: str
    status_group: str
    pattern_cell_id: str
    pattern_score: int
    impairment_signals: list[str]
    handbook_signals: list[str]
    work_status_label: str | None
    job_type_signals: list[str]
    consultation_gaps: list[str]
    service_fit_gaps: list[str]
    pre_employment_unresolved: list[str]
    accommodations_present: list[str]
    accommodations_needed_absent: list[str]
    post_employment_unresolved: list[str]
    disclosure_gaps: list[str]
    satisfaction_risks: list[str]
    low_work_confidence: list[str]
    low_soc_or_life_signals: list[str]
    narrative_context_labels: list[str]
    narrative_lens_counts: dict[str, int]
    candidate_interaction: str
    counter_reading: str
    uncertainty_flags: list[str]
    ethical_bias_risks: list[str]


def read_codebook() -> dict[str, dict[str, str]]:
    with (ANALYSIS_READY / "codebook.csv").open("r", encoding="utf-8", newline="") as f:
        return {row["raw_name"]: row for row in csv.DictReader(f)}


def read_structured() -> dict[str, dict[str, list[dict[str, str]]]]:
    by_respondent: dict[str, dict[str, list[dict[str, str]]]] = defaultdict(lambda: defaultdict(list))
    with (ANALYSIS_READY / "structured_features.csv").open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            by_respondent[row["respondent_id"]][row["raw_name"]].append(row)
    return by_respondent


def read_redacted_narrative() -> dict[str, list[dict[str, Any]]]:
    by_respondent: dict[str, list[dict[str, Any]]] = defaultdict(list)
    with REDACTED_NARRATIVE.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                row = json.loads(line)
                by_respondent[str(row["respondent_id"])].append(row)
    return by_respondent


def labels(rows_by_var: dict[str, list[dict[str, str]]], raw_name: str) -> list[str]:
    values = []
    for row in rows_by_var.get(raw_name, []):
        value = (row.get("label_text") or row.get("raw_value_text") or "").strip()
        if value:
            values.extend(part.strip() for part in value.split("|") if part.strip())
    return sorted(dict.fromkeys(values))


def one_label(rows_by_var: dict[str, list[dict[str, str]]], raw_name: str) -> str | None:
    vals = labels(rows_by_var, raw_name)
    return " | ".join(vals) if vals else None


def numeric_value(rows_by_var: dict[str, list[dict[str, str]]], raw_name: str) -> float | None:
    rows = rows_by_var.get(raw_name, [])
    if not rows:
        return None
    value = rows[0].get("numeric_value") or rows[0].get("normalized_value") or ""
    try:
        return float(value)
    except ValueError:
        return None


def field_names_by_group(codebook: dict[str, dict[str, str]], group: str) -> list[str]:
    return [
        raw_name for raw_name, row in codebook.items()
        if row["question_group"] == group and row["response_type"] != "free_text"
    ]


def display(codebook: dict[str, dict[str, str]], raw_name: str) -> str:
    if raw_name in DISPLAY_ALIASES:
        return DISPLAY_ALIASES[raw_name]
    return codebook.get(raw_name, {}).get("display_name") or raw_name


def values_with_phrase(
    rows_by_var: dict[str, list[dict[str, str]]],
    codebook: dict[str, dict[str, str]],
    raw_names: list[str],
    phrases: tuple[str, ...],
) -> list[str]:
    out = []
    for raw_name in raw_names:
        text = one_label(rows_by_var, raw_name) or ""
        if any(phrase in text for phrase in phrases):
            out.append(f"{display(codebook, raw_name)}: {text}")
    return out


def low_ordinal_signals(
    rows_by_var: dict[str, list[dict[str, str]]],
    codebook: dict[str, dict[str, str]],
    raw_names: list[str],
    threshold: float = 2.0,
) -> list[str]:
    out = []
    for raw_name in raw_names:
        value = numeric_value(rows_by_var, raw_name)
        if value is not None and value <= threshold:
            out.append(f"{display(codebook, raw_name)}: {one_label(rows_by_var, raw_name)}")
    return out


def status_group(work_status: str | None) -> str:
    text = work_status or ""
    if "現在、収入のある仕事に就いている" in text:
        return "currently_working"
    if "過去に収入のある仕事に就いていた" in text:
        return "past_work_not_current"
    if "過去に収入のある仕事に就いたことはない" in text:
        return "never_worked"
    return "unknown_or_other"


def narrative_labels(narrative_rows: list[dict[str, Any]]) -> tuple[list[str], dict[str, int]]:
    label_counts: Counter[str] = Counter()
    lens_counts: Counter[str] = Counter()
    for row in narrative_rows:
        text = row.get("redacted_unit_text") or ""
        for lens, label, pattern in NARRATIVE_RULES:
            if pattern.search(text):
                label_counts[label] += 1
                lens_counts[lens] += 1
    return sorted(label_counts, key=lambda x: (-label_counts[x], x)), dict(sorted(lens_counts.items()))


def stable_score(parts: list[str]) -> int:
    return int(hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()[:8], 16)


def classify_case(features: dict[str, Any]) -> tuple[str, int]:
    sg = features["status_group"]
    impairment_n = len(features["impairment_signals"]) + len(features["handbook_signals"])
    consultation_gap_n = len(features["consultation_gaps"])
    service_gap_n = len(features["service_fit_gaps"])
    pre_n = len(features["pre_employment_unresolved"])
    need_absent_n = len(features["accommodations_needed_absent"])
    present_n = len(features["accommodations_present"])
    post_n = len(features["post_employment_unresolved"])
    disclosure_n = len(features["disclosure_gaps"])
    satisfaction_n = len(features["satisfaction_risks"])
    low_conf_n = len(features["low_work_confidence"])
    low_soc_n = len(features["low_soc_or_life_signals"])
    narrative_n = len(features["narrative_context_labels"])

    if sg == "currently_working" and post_n >= 10 and need_absent_n >= 10:
        return "EC-02A-current-work-broad-task-accommodation-underalignment", 120 + post_n * 3 + need_absent_n + disclosure_n
    if sg == "currently_working" and (need_absent_n >= 5 or post_n >= 4 or disclosure_n):
        return "EC-02B-current-work-partial-environment-disclosure-gap", 100 + need_absent_n * 2 + post_n * 2 + disclosure_n * 4 + present_n
    if sg == "currently_working" and satisfaction_n >= 2:
        return "EC-03-current-work-satisfaction-treatment-mismatch", 90 + satisfaction_n * 5 + low_soc_n
    if sg == "past_work_not_current" and (post_n >= 4 or need_absent_n >= 6):
        return "EC-10A-past-work-difficulty-carryover", 100 + post_n * 3 + need_absent_n + low_conf_n * 4
    if sg in {"past_work_not_current", "never_worked"} and (pre_n >= 4 or disclosure_n or service_gap_n >= 5):
        return "EC-10B-entry-disclosure-support-friction", 90 + pre_n * 3 + disclosure_n * 5 + service_gap_n + low_conf_n
    if consultation_gap_n + service_gap_n >= 10:
        return "EC-05-support-access-service-fit-mismatch", 80 + consultation_gap_n + service_gap_n * 2 + pre_n
    if impairment_n >= 5 and sg != "currently_working" and post_n + need_absent_n + pre_n <= 4:
        return "EC-04-high-impairment-low-work-context", 75 + impairment_n * 3 + low_conf_n * 3
    if low_conf_n and post_n + need_absent_n + pre_n <= 6:
        return "EC-07-low-work-confidence-boundary", 65 + low_conf_n * 8 + impairment_n + low_soc_n
    if narrative_n and post_n + need_absent_n + pre_n + service_gap_n <= 3:
        return "EC-08-narrative-context-low-structured-signal", 55 + narrative_n * 3
    return "EC-99-mixed-or-low-signal", 30 + impairment_n + post_n + need_absent_n + pre_n + service_gap_n + narrative_n


def make_case(
    respondent_id: str,
    rows_by_var: dict[str, list[dict[str, str]]],
    narrative_rows: list[dict[str, Any]],
    codebook: dict[str, dict[str, str]],
) -> CaseAnalysis:
    consultation_names = field_names_by_group(codebook, "就労相談先")
    service_names = field_names_by_group(codebook, "就労相談内容")
    pre_names = field_names_by_group(codebook, "就職前や就職活動の職業的課題の状況")
    accommodation_names = field_names_by_group(codebook, "職場配慮の状況")
    post_names = field_names_by_group(codebook, "就職後の職業的課題")
    disclosure_names = field_names_by_group(codebook, "説明・開示状況")
    satisfaction_names = field_names_by_group(codebook, "満足度や動機")
    soc_names = field_names_by_group(codebook, "SOC（首尾一貫感覚）") + field_names_by_group(codebook, "全般的満足度")

    work_status = one_label(rows_by_var, "8就労経験")
    narrative_context, narrative_lenses = narrative_labels(narrative_rows)
    impairment = labels(rows_by_var, "3障害")
    handbooks = []
    for raw_name in ("4身体手帳", "4身体重度", "4療育手帳", "4療育重度", "4精神手帳", "4精神重度", "4その他"):
        val = one_label(rows_by_var, raw_name)
        if val and val != "無":
            handbooks.append(f"{display(codebook, raw_name)}: {val}")

    features = {
        "status_group": status_group(work_status),
        "impairment_signals": impairment,
        "handbook_signals": handbooks,
        "consultation_gaps": values_with_phrase(rows_by_var, codebook, consultation_names, ("知らなかった", "相談したが役に立たなかった")),
        "service_fit_gaps": values_with_phrase(rows_by_var, codebook, service_names, ("利用したことはないが必要", "利用したが役に立たなかった")),
        "pre_employment_unresolved": values_with_phrase(rows_by_var, codebook, pre_names, ("課題が未解決",)),
        "accommodations_present": values_with_phrase(rows_by_var, codebook, accommodation_names, ("整備有",)),
        "accommodations_needed_absent": values_with_phrase(rows_by_var, codebook, accommodation_names, ("必要だが整備無",)),
        "post_employment_unresolved": values_with_phrase(rows_by_var, codebook, post_names, ("未解決課題有",)),
        "disclosure_gaps": values_with_phrase(rows_by_var, codebook, disclosure_names, ("説明したいができない",)),
        "satisfaction_risks": values_with_phrase(rows_by_var, codebook, satisfaction_names, ("不満足", "全く希望と違う", "不適正", "非常に不適正")),
        "low_work_confidence": values_with_phrase(rows_by_var, codebook, ["19仕事ができるか"], ("絶対に仕事はできない", "仕事ができるとは思わない", "わからない")),
        "low_soc_or_life_signals": low_ordinal_signals(rows_by_var, codebook, soc_names),
        "narrative_context_labels": narrative_context,
    }
    cell_id, score = classify_case(features)
    proposition = CELL_PROPOSITIONS[cell_id]

    uncertainty_flags = []
    if not narrative_context:
        uncertainty_flags.append("記述回答ラベルなし")
    if not features["impairment_signals"]:
        uncertainty_flags.append("機能障害カテゴリの構造化信号が少ない")
    if features["accommodations_needed_absent"] and not features["accommodations_present"]:
        uncertainty_flags.append("必要配慮は出るが整備有信号が少ない")
    if status_group(work_status) != "currently_working" and not features["post_employment_unresolved"]:
        uncertainty_flags.append("非就労/移行段階のため就業後課題が出にくい可能性")
    if status_group(work_status) == "currently_working" and not features["post_employment_unresolved"] and not features["accommodations_needed_absent"]:
        uncertainty_flags.append("就労中だが未解決・未整備信号が少ない")

    ethical_risks = [
        "障害種別から就労可能性や配慮内容を直接推定しない",
        "未解決課題を本人能力不足として読まない",
        "支援未利用や説明困難を本人責任として読まない",
    ]
    if features["low_work_confidence"]:
        ethical_risks.append("低い就労自信を固定的な就労不能判断にしない")
    if "説明したいができない" in " ".join(features["disclosure_gaps"]):
        ethical_risks.append("開示困難を本人の消極性ではなく環境との相互作用として読む")

    return CaseAnalysis(
        record_id=f"{DATASET_ID}:{respondent_id}",
        respondent_id=respondent_id,
        status_group=features["status_group"],
        pattern_cell_id=cell_id,
        pattern_score=score,
        impairment_signals=impairment,
        handbook_signals=handbooks,
        work_status_label=work_status,
        job_type_signals=labels(rows_by_var, "9仕事内容"),
        consultation_gaps=features["consultation_gaps"],
        service_fit_gaps=features["service_fit_gaps"],
        pre_employment_unresolved=features["pre_employment_unresolved"],
        accommodations_present=features["accommodations_present"],
        accommodations_needed_absent=features["accommodations_needed_absent"],
        post_employment_unresolved=features["post_employment_unresolved"],
        disclosure_gaps=features["disclosure_gaps"],
        satisfaction_risks=features["satisfaction_risks"],
        low_work_confidence=features["low_work_confidence"],
        low_soc_or_life_signals=features["low_soc_or_life_signals"],
        narrative_context_labels=narrative_context,
        narrative_lens_counts=narrative_lenses,
        candidate_interaction=proposition["candidate"],
        counter_reading=proposition["counter"],
        uncertainty_flags=uncertainty_flags,
        ethical_bias_risks=ethical_risks,
    )


def top_counts(cases: list[CaseAnalysis], attr: str, limit: int = 8) -> list[dict[str, Any]]:
    counter: Counter[str] = Counter()
    for case in cases:
        values = getattr(case, attr)
        if isinstance(values, list):
            counter.update(values)
    return [{"label": label, "count": count} for label, count in counter.most_common(limit)]


def build_pattern_cells(cases: list[CaseAnalysis]) -> list[dict[str, Any]]:
    grouped: dict[str, list[CaseAnalysis]] = defaultdict(list)
    for case in cases:
        grouped[case.pattern_cell_id].append(case)

    cells = []
    for cell_id, group in sorted(grouped.items(), key=lambda item: (-len(item[1]), item[0])):
        sorted_by_score = sorted(
            group,
            key=lambda c: (
                c.status_group == "unknown_or_other",
                -c.pattern_score,
                stable_score([c.record_id, cell_id]),
            ),
        )
        boundary = sorted(group, key=lambda c: (c.pattern_score, stable_score([c.record_id, cell_id])))[:8]
        exceptions = [
            c for c in group
            if "記述回答ラベルなし" in c.uncertainty_flags
            or "必要配慮は出るが整備有信号が少ない" in c.uncertainty_flags
            or "機能障害カテゴリの構造化信号が少ない" in c.uncertainty_flags
        ][:8]
        cells.append({
            "pattern_cell_id": cell_id,
            "status": "machine_generated_unreviewed_no_promotion",
            "record_count": len(group),
            "included_record_ids": [c.record_id for c in group],
            "representative_record_ids": [c.record_id for c in sorted_by_score[:8]],
            "boundary_record_ids": [c.record_id for c in boundary],
            "exception_or_counterexample_record_ids": [c.record_id for c in exceptions],
            "dominant_status_groups": dict(Counter(c.status_group for c in group).most_common()),
            "top_impairment_signals": top_counts(group, "impairment_signals"),
            "top_handbook_signals": top_counts(group, "handbook_signals"),
            "top_consultation_gaps": top_counts(group, "consultation_gaps"),
            "top_service_fit_gaps": top_counts(group, "service_fit_gaps"),
            "top_pre_employment_unresolved": top_counts(group, "pre_employment_unresolved"),
            "top_accommodations_needed_absent": top_counts(group, "accommodations_needed_absent"),
            "top_post_employment_unresolved": top_counts(group, "post_employment_unresolved"),
            "top_disclosure_gaps": top_counts(group, "disclosure_gaps"),
            "top_satisfaction_risks": top_counts(group, "satisfaction_risks"),
            "top_low_work_confidence": top_counts(group, "low_work_confidence"),
            "top_narrative_context_labels": top_counts(group, "narrative_context_labels"),
            "candidate_interaction": sorted_by_score[0].candidate_interaction,
            "counter_reading": sorted_by_score[0].counter_reading,
            "overinterpretation_risks": [
                "件数を重要度・真実性・因果性として読まない",
                "障害種別ごとの一般論に短絡しない",
                "未レビューの機械候補を知識として昇格しない",
            ],
        })
    return cells


def write_json(path: Path, obj: Any) -> None:
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_markdown_summary(path: Path, cells: list[dict[str, Any]], cases_by_id: dict[str, CaseAnalysis]) -> None:
    def bullet_counts(items: list[dict[str, Any]]) -> str:
        if not items:
            return "なし"
        return "、".join(f"{item['label']}（{item['count']}）" for item in items[:5])

    lines = [
        "# 雇用・就労調査3000 伏字化記述統合 SCIMA/FCHMA 全件分析 v0",
        "",
        "日付: 2026-05-13",
        f"対象: `{DATASET_ID}` 全件",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "入力: 構造化回答 + 伏字済み記述回答。本文引用は含めない。",
        "",
        "## 全体像",
        "",
        f"- ケース数: {sum(cell['record_count'] for cell in cells)}",
        f"- パターン候補セル数: {len(cells)}",
        "- 目的: 難病調査で改善したレビュー形式が、障害横断の就労調査にも通用するかを確認する。",
        "",
        "## 主要パターン候補",
        "",
    ]
    for cell in cells:
        lines.extend([
            f"### {cell['pattern_cell_id']}（{cell['record_count']}件）",
            "",
            f"候補命題: {cell['candidate_interaction']}",
            "",
            f"代表ID: {', '.join(cell['representative_record_ids'][:5])}",
            f"境界ID: {', '.join(cell['boundary_record_ids'][:5])}",
            f"例外・反例候補ID: {', '.join(cell['exception_or_counterexample_record_ids'][:5]) or 'なし'}",
            "",
            f"- 機能障害・健康条件: {bullet_counts(cell['top_impairment_signals'])}",
            f"- 支援アクセス/相談: {bullet_counts(cell['top_consultation_gaps'])}",
            f"- 支援内容の適合: {bullet_counts(cell['top_service_fit_gaps'])}",
            f"- 就職前・就職活動課題: {bullet_counts(cell['top_pre_employment_unresolved'])}",
            f"- 必要だがない職場配慮: {bullet_counts(cell['top_accommodations_needed_absent'])}",
            f"- 就職後課題: {bullet_counts(cell['top_post_employment_unresolved'])}",
            f"- 説明・開示ギャップ: {bullet_counts(cell['top_disclosure_gaps'])}",
            f"- 就労自信の低さ/不明: {bullet_counts(cell['top_low_work_confidence'])}",
            f"- 記述文脈ラベル: {bullet_counts(cell['top_narrative_context_labels'])}",
            "",
            f"反対命題: {cell['counter_reading']}",
            "",
        ])
        for rid in cell["representative_record_ids"][:2]:
            case = cases_by_id[rid]
            lines.extend([
                f"代表レコード `{rid}` の見え方:",
                f"- 状態: {case.work_status_label or case.status_group}",
                f"- 機能障害・健康条件: {', '.join(case.impairment_signals[:5]) or 'なし'}",
                f"- 就職後課題: {', '.join(case.post_employment_unresolved[:5]) or 'なし'}",
                f"- 環境因子: 必要だがない配慮 {len(case.accommodations_needed_absent)}件、整備有 {len(case.accommodations_present)}件",
                f"- 記述文脈: {', '.join(case.narrative_context_labels[:5]) or 'なし'}",
                "",
            ])
    lines.extend([
        "## この出力の使いどころ",
        "",
        "- 難病調査と同じく、代表・境界・例外IDを開いて、セルを維持・分割・棄却する。",
        "- 障害種別ごとの一般論ではなく、ICF構成要素の相互作用として読む。",
        "- 記述回答は伏字済み入力からラベル化しているが、引用や公開利用はしない。",
    ])
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    codebook = read_codebook()
    structured = read_structured()
    narratives = read_redacted_narrative()
    all_ids = sorted(structured.keys())

    cases = [make_case(rid, structured[rid], narratives.get(rid, []), codebook) for rid in all_ids]
    cells = build_pattern_cells(cases)
    cases_by_id = {case.record_id: case for case in cases}

    with (OUT_DIR / "case-interpretations.jsonl").open("w", encoding="utf-8") as f:
        for case in cases:
            f.write(json.dumps(case.__dict__, ensure_ascii=False) + "\n")

    write_json(OUT_DIR / "pattern-cells.json", {
        "dataset_id": DATASET_ID,
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "case_count": len(cases),
        "pattern_cell_count": len(cells),
        "raw_or_redacted_text_included": False,
        "pattern_cells": cells,
    })
    write_markdown_summary(OUT_DIR / "founder-reviewable-pattern-cards.md", cells, cases_by_id)

    print(json.dumps({
        "output_dir": str(OUT_DIR.relative_to(ROOT)),
        "case_count": len(cases),
        "pattern_cell_count": len(cells),
        "top_cells": [
            {"pattern_cell_id": cell["pattern_cell_id"], "record_count": cell["record_count"]}
            for cell in cells[:8]
        ],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
