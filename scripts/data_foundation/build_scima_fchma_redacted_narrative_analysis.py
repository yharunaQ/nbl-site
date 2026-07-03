#!/usr/bin/env python3
"""Build redacted narrative integrated SCIMA/FCHMA analysis artifacts.

Inputs are analysis-ready structured fields plus locally redacted free-text
units. Outputs intentionally avoid raw/redacted narrative quotes and keep all
knowledge unreviewed.
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
DATASET_ID = "nanbyo_survey_4000"
RUN_ID = "redacted-narrative-integrated-v0-2026-05-13"
ANALYSIS_READY = ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0"
REDACTED_NARRATIVE = ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl"
OUT_DIR = ROOT / "references/derived/scima-fchma/nanbyo_survey_4000" / RUN_ID


Q10_LABELS = {
    "Q10_01": "医師による就業制限",
    "Q10_02": "通院による支障",
    "Q10_03": "服薬・治療の支障",
    "Q10_04": "疲れやすさ・体調変動",
    "Q10_05": "少しの無理で崩れやすい",
    "Q10_06": "活力・集中力低下",
    "Q10_07": "運動協調・歩行障害",
    "Q10_08": "病状進行への不安",
    "Q10_09": "身体の痛み",
    "Q10_10": "皮膚・容貌変化",
    "Q10_11": "免疫機能低下",
    "Q10_12": "精神・心理症状",
}

Q13_LABELS = {
    "Q13_1": "治療と仕事両立の自信なし",
    "Q13_2": "社会的疎外感",
    "Q13_3": "就職・再就職困難と経済的/精神的追い詰め",
    "Q13_4": "再就職意欲の喪失",
    "Q13_5": "人生設計・仕事の方向性の悩み",
}

Q15_LABELS = {
    "Q15_2_1": "求人応募・就職活動の方法が分からない",
    "Q15_2_2": "準備が整わないまま就職を急ぐ必要",
    "Q15_2_3": "企業への病気・必要配慮説明が困難",
    "Q15_2_4": "希望の就職に至らない",
    "Q15_2_5": "就職活動過程のその他困難",
}

Q16_LABELS = {
    "Q16_5_1": "仕事内容・働き方が体調管理上無理",
    "Q16_5_2": "職場負担感",
    "Q16_5_3": "疾患自己管理の限界",
    "Q16_5_4": "人間関係・コミュニケーションストレス",
    "Q16_5_5": "病状進行による困難",
    "Q16_5_6": "治療・生活と仕事のトレードオフ",
    "Q16_5_7": "病状悪化による離職",
    "Q16_5_8": "集中力・意欲低下等による退職勧奨/解雇",
    "Q16_5_9": "休職期間超過による退職・契約非継続",
}

Q164_LABELS = {
    "Q16_4_01": "就職活動時に必要配慮を伝えている",
    "Q16_4_02": "面接段階で就職後の必要配慮を検討する姿勢",
    "Q16_4_03": "体調悪化につながる無理な仕事内容が含まれていない",
    "Q16_4_04": "通院・体調管理・疲労回復ができる勤務時間/休日",
    "Q16_4_05": "通院・健康管理・休憩等がしやすい仕事内容",
    "Q16_4_06": "就職後に必要配慮を職場に伝えている",
    "Q16_4_07": "上司・同僚の病気/障害への正しい理解",
    "Q16_4_08": "通院等への出退勤時刻や休憩等の調整",
    "Q16_4_09": "体調に合わせた柔軟な業務調整体制",
    "Q16_4_10": "許可・説明なしに柔軟に休憩できる体制",
    "Q16_4_11": "体調悪化時の早めの休憩・通院等の許可",
    "Q16_4_12": "休職時の医療機関と職場が協力した復職支援",
    "Q16_4_13": "配慮や調整を職場全体で検討する場",
    "Q16_4_14": "得意分野中心の業務調整・転換",
    "Q16_4_15": "進行等を考慮した長期的な仕事内容・配置検討",
}

Q17_LABELS = {
    "Q17_1": "治療と両立して活躍できる仕事の相談",
    "Q17_2": "必要な理解・配慮の整理/説明支援",
    "Q17_3": "本人・医療・職場等による両立支援",
    "Q17_4": "疾患進行時の就業継続支援",
    "Q17_5": "就職後も相談できる継続支援",
    "Q17_6": "興味・強みを踏まえた職業相談",
    "Q17_7": "職場開拓/求人確保",
    "Q17_8": "制度利用・関係機関連携",
}

NARRATIVE_RULES: list[tuple[str, str, re.Pattern[str]]] = [
    ("body_function", "体調変動・疲労・崩れやすさ", re.compile(r"疲|体調|倦怠|だる|無理|波|変動|休")),
    ("body_function", "痛み・しびれ・身体症状", re.compile(r"痛|疼|しび|痺|頭痛|腹痛|関節|筋肉")),
    ("health_management", "通院・治療・服薬管理", re.compile(r"通院|治療|服薬|薬|検査|入院|医師|主治医")),
    ("body_function", "免疫・感染/環境リスク", re.compile(r"感染|免疫|コロナ|衛生|予防")),
    ("body_function", "視覚・聴覚・言語など感覚/コミュニケーション", re.compile(r"視覚|見え|聴|聞こ|耳|音声|言語|会話|コミュニケーション")),
    ("activity", "歩行・移動・通勤負荷", re.compile(r"歩|移動|通勤|交通|車|電車|バス|階段|立ち")),
    ("activity", "仕事量・仕事内容・勤務時間との不一致", re.compile(r"仕事|勤務|業務|作業|時間|残業|負担|職務|配置|シフト")),
    ("environment", "休憩・柔軟調整・在宅等の環境調整", re.compile(r"休憩|配慮|調整|在宅|テレワーク|短時間|時短|休暇|柔軟")),
    ("environment", "職場理解・開示・偏見/負担感", re.compile(r"理解|伝え|説明|開示|差別|偏見|迷惑|負担|上司|同僚|職場")),
    ("support", "就職活動・制度利用・支援アクセス", re.compile(r"就職|求職|面接|ハローワーク|支援|相談|制度|障害者雇用|求人")),
    ("personal_context", "経済・生活設計・将来不安", re.compile(r"経済|収入|生活|将来|不安|家計|お金|給料")),
    ("personal_context", "就労意欲・自己効力・社会的孤立", re.compile(r"意欲|自信|孤立|疎外|社会|辞め|退職|働きたい|働け")),
]


@dataclass
class CaseAnalysis:
    record_id: str
    respondent_id: str
    status_group: str
    pattern_cell_id: str
    pattern_score: int
    health_condition_groups: list[str]
    handbook_signals: list[str]
    body_function_signals: list[str]
    hospitalization_and_visits: dict[str, str]
    work_status_label: str | None
    work_experience: dict[str, Any]
    readiness_unresolved: list[str]
    job_search_unresolved: list[str]
    post_employment_unresolved: list[str]
    accommodations_present: list[str]
    accommodations_needed_absent: list[str]
    support_use_gaps: list[str]
    consultation_sources: list[str]
    desired_supports: list[str]
    narrative_context_labels: list[str]
    narrative_lens_counts: dict[str, int]
    candidate_interaction: str
    counter_reading: str
    uncertainty_flags: list[str]
    ethical_bias_risks: list[str]


CELL_PROPOSITIONS = {
    "RC-02A-working-function-workdesign-underalignment": {
        "candidate": (
            "就労中だが、就業後困難が広範に未解決で、必要配慮の多くが未実装として出ている。"
            "中心仮説は、個別の配慮不足ではなく、体調変動・治療時間・仕事内容・配置・職場全体の調整が、仕事設計に十分組み込まれていないこと。"
        ),
        "counter": (
            "未整合が強く見えても、現職環境が一律に悪いとは限らない。"
            "必要配慮の希望、将来不安、一般的制度ニーズ、現職での実害が混在している可能性がある。"
            "RC-02Bとの差は、困難の広がりと未実装配慮の厚さで検証する。"
        ),
    },
    "RC-02B-working-partial-accommodation-gap": {
        "candidate": (
            "就労中で一定の配慮や継続基盤はあるが、疲労・体調変動、勤務時間、職場理解、開示・相談などの一部接点に未調整が残っている可能性。"
            "中心仮説は、全面的な仕事設計不全ではなく、部分的な配慮ギャップが就業後困難を残していること。"
        ),
        "counter": (
            "配慮あり信号も比較的多いため、ギャップは単純な不足ではなく、既存配慮では吸収しにくい症状変動、職場外要因、回答者の期待水準かもしれない。"
            "RC-02Aのような広範な未整合に拡大して読まない。"
        ),
    },
    "RC-10A-transition-with-carried-work-difficulty": {
        "candidate": (
            "現在は非就労または移行段階で、職業準備・就職活動・過去就業後困難が同時に厚く残る。"
            "中心仮説は、単なる求職支援不足ではなく、過去の就業中断、体調管理と仕事内容の不一致、支援接続の未解決が、再就職準備全体に持ち越されていること。"
        ),
        "counter": (
            "過去困難の持ち越しに見えても、現在の療養優先、生活再建、経済事情、支援待ち、就労意欲の揺れが主因かもしれない。"
            "就職活動中と求職前を同じ移行段階としてまとめすぎない。"
        ),
    },
    "RC-10B-job-search-disclosure-support-friction": {
        "candidate": (
            "現在は非就労または移行段階だが、過去就業後困難よりも、応募・面接・開示・必要配慮説明・支援アクセスの摩擦が前面に出る可能性。"
            "中心仮説は、仕事に入る前の接点で、病気説明と必要調整の翻訳が詰まっていること。"
        ),
        "counter": (
            "開示・支援アクセスのラベルが強くても、就職活動そのものが中心課題とは限らない。"
            "職種選択、体調安定、通院時間、経済事情、差別経験への不安が先行している可能性がある。"
            "RC-10Aのような過去就業困難の蓄積とは分けて見る。"
        ),
    },
    "RC-04-high-function-burden-low-work-context": {
        "candidate": (
            "非就労または移行寄りで、心身機能上の支障が非常に厚い一方、就職活動・就業後困難・職場配慮の構造化信号は薄い。"
            "中心仮説は、就労場面の問題がないのではなく、まだ職場文脈に乗る前の体調負荷・治療生活・生活再建が前面にあること。"
        ),
        "counter": (
            "職場信号の薄さを、就労支援不要と読んではいけない。"
            "調査分岐で職場設問が出ていない、過去経験を回答していない、または記述にだけ仕事文脈が出る可能性がある。"
            "支援仮説は医療・生活・職業準備の順序を確認してから立てる。"
        ),
    },
    "RC-05-support-need-access-mismatch": {
        "candidate": (
            "相談・支援ニーズは厚いが、利用方法不明やニーズ不一致が重なり、支援制度があることと本人の文脈に届くことの間に断絶がある可能性。"
        ),
        "counter": (
            "支援ギャップ信号は、支援機関の失敗や本人の利用能力不足を直接示さない。"
            "未利用、利用前、情報探索中、制度対象外、期待と支援内容のズレが混在している可能性がある。"
        ),
    },
    "RC-06-treatment-time-management-friction": {
        "candidate": (
            "就労中で配慮あり信号も一定あるが、通院・治療・服薬管理と休憩・勤務時間・仕事内容の調整が残る可能性。"
            "中心仮説は、配慮の有無ではなく、日々の健康管理時間が業務リズムに組み込まれているか。"
        ),
        "counter": (
            "治療時間の問題に見えても、実際には仕事内容、通勤、対人環境、収入不安が主要因かもしれない。"
            "治療管理だけを中心に固定しない。"
        ),
    },
    "RC-07-non-work-orientation-boundary": {
        "candidate": (
            "仕事希望なしの回答群でも、心身機能負荷、生活設計、社会的孤立、支援ニーズが残ることがある。"
            "中心仮説は、現時点での非就労志向を、支援不要にも復職前提にも短絡せず、生活段階の境界条件として扱うこと。"
        ),
        "counter": (
            "仕事希望なしには、安定した本人意思、療養優先、一時的断念、情報不足、過去の失敗経験、経済・家族条件が混在する。"
            "本人意思の尊重と、支援機会の閉鎖を混同しない。"
        ),
    },
    "RC-08-narrative-context-with-low-structured-friction": {
        "candidate": (
            "構造化回答では支障や未解決が薄いが、記述回答側には仕事量、体調変動、職場理解などの局所文脈が出ている。"
            "中心仮説は、チェック項目だけでは拾いにくい軽微・限定的・言語化途上の摩擦があること。"
        ),
        "counter": (
            "記述中の一語が中心課題とは限らず、過去経験、一般意見、家族や周囲の話、制度への期待が混じる可能性がある。"
            "構造化信号が薄いことも併せて重く見る。"
        ),
    },
    "RC-99-mixed-or-low-signal": {
        "candidate": (
            "構造化回答と記述ラベルからは、単一の相互作用仮説をまだ置きにくい。"
            "中心仮説は、低困難群ではなく、調査分岐・欠損・軽度信号・複数文脈が混在し、レビューで別セルへ移すための保留群であること。"
        ),
        "counter": (
            "低信号は低ニーズを意味しない。"
            "回答対象外の設問、記述欠如、未捕捉の環境要因、または安定就労群が混在する可能性がある。"
        ),
    },
}


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
            if not line.strip():
                continue
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
    value = rows[0].get("normalized_value") or rows[0].get("numeric_value") or ""
    try:
        return float(value)
    except ValueError:
        return None


def unresolved(rows_by_var: dict[str, list[dict[str, str]]], mapping: dict[str, str]) -> list[str]:
    out = []
    for raw_name, label in mapping.items():
        text = one_label(rows_by_var, raw_name) or ""
        if "未解決" in text:
            out.append(f"{label}: {text}")
    return out


def accommodation_by_state(rows_by_var: dict[str, list[dict[str, str]]], code: int) -> list[str]:
    out = []
    for raw_name, label in Q164_LABELS.items():
        if numeric_value(rows_by_var, raw_name) == code:
            out.append(label)
    return out


def support_gaps(rows_by_var: dict[str, list[dict[str, str]]]) -> list[str]:
    out = []
    for raw_name, label in Q17_LABELS.items():
        text = one_label(rows_by_var, raw_name) or ""
        if "ニーズには合わなかった" in text or "利用の仕方が分からない" in text:
            out.append(f"{label}: {text}")
    return out


def body_function_signals(rows_by_var: dict[str, list[dict[str, str]]]) -> list[str]:
    out = []
    for raw_name, label in Q10_LABELS.items():
        value = numeric_value(rows_by_var, raw_name)
        if value is not None and value >= 3:
            out.append(f"{label}: {one_label(rows_by_var, raw_name)}")
    return out


def status_group(work_status_label: str | None) -> str:
    text = work_status_label or ""
    if "現在、特に仕事に就く希望はない" in text:
        return "no_current_work_wish"
    if "可能なら仕事に就きたい" in text:
        return "not_working_wants_work"
    if "就職活動中" in text or "職業訓練中" in text:
        return "job_transition_or_training"
    if "雇用されている" in text or "事業を営んでいる" in text or "就労継続支援A型" in text:
        return "currently_working"
    if "病気療養" in text or "仕事に就かず" in text:
        return "not_currently_working"
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
    text = "|".join(parts)
    return int(hashlib.sha256(text.encode("utf-8")).hexdigest()[:8], 16)


def classify_case(features: dict[str, Any]) -> tuple[str, int]:
    sg = features["status_group"]
    q10_n = len(features["body_function_signals"])
    post_n = len(features["post_employment_unresolved"])
    job_n = len(features["job_search_unresolved"])
    ready_n = len(features["readiness_unresolved"])
    need_absent_n = len(features["accommodations_needed_absent"])
    support_gap_n = len(features["support_use_gaps"])
    narrative = set(features["narrative_context_labels"])

    if sg == "no_current_work_wish":
        return "RC-07-non-work-orientation-boundary", 80 + ready_n * 6 + q10_n
    if sg == "currently_working" and post_n >= 5 and need_absent_n >= 5:
        return "RC-02A-working-function-workdesign-underalignment", 100 + post_n * 4 + need_absent_n + q10_n
    if sg == "currently_working" and (post_n >= 2 or need_absent_n >= 4):
        return "RC-02B-working-partial-accommodation-gap", 80 + post_n * 4 + need_absent_n + q10_n
    if sg in {"job_transition_or_training", "not_working_wants_work"} and (post_n >= 4 or job_n >= 4):
        return "RC-10A-transition-with-carried-work-difficulty", 90 + post_n * 4 + job_n * 3 + q10_n
    if sg in {"job_transition_or_training", "not_working_wants_work"} and ("職場理解・開示・偏見/負担感" in narrative or job_n >= 2):
        return "RC-10B-job-search-disclosure-support-friction", 75 + job_n * 4 + ready_n + support_gap_n
    if q10_n >= 7 and sg not in {"currently_working"}:
        return "RC-04-high-function-burden-low-work-context", 70 + q10_n * 3 + ready_n
    if support_gap_n >= 4:
        return "RC-05-support-need-access-mismatch", 65 + support_gap_n * 5 + ready_n + job_n
    if "通院・治療・服薬管理" in narrative and ("休憩・柔軟調整・在宅等の環境調整" in narrative or need_absent_n >= 3):
        return "RC-06-treatment-time-management-friction", 60 + need_absent_n + q10_n
    if narrative and q10_n + post_n + job_n + ready_n <= 2:
        return "RC-08-narrative-context-with-low-structured-friction", 55 + len(narrative)
    return "RC-99-mixed-or-low-signal", 30 + q10_n + post_n + job_n + ready_n + support_gap_n


def make_case(respondent_id: str, rows_by_var: dict[str, list[dict[str, str]]], narrative_rows: list[dict[str, Any]]) -> CaseAnalysis:
    work_status = one_label(rows_by_var, "Q11_1")
    narrative_context, narrative_lenses = narrative_labels(narrative_rows)
    q10 = body_function_signals(rows_by_var)
    handbooks = labels(rows_by_var, "Q09_2") + labels(rows_by_var, "Q09_4")
    ready = unresolved(rows_by_var, Q13_LABELS)
    job_search = unresolved(rows_by_var, Q15_LABELS)
    post = unresolved(rows_by_var, Q16_LABELS)
    present = accommodation_by_state(rows_by_var, 1)
    needed_absent = accommodation_by_state(rows_by_var, 2)
    gaps = support_gaps(rows_by_var)
    sg = status_group(work_status)

    features = {
        "status_group": sg,
        "body_function_signals": q10,
        "readiness_unresolved": ready,
        "job_search_unresolved": job_search,
        "post_employment_unresolved": post,
        "accommodations_needed_absent": needed_absent,
        "support_use_gaps": gaps,
        "narrative_context_labels": narrative_context,
    }
    cell_id, score = classify_case(features)

    propositions = CELL_PROPOSITIONS[cell_id]
    interaction = propositions["candidate"]
    counter = propositions["counter"]

    uncertainty_flags = []
    if not narrative_context:
        uncertainty_flags.append("記述回答ラベルなし")
    if not q10:
        uncertainty_flags.append("Q10支障の構造化信号が少ない")
    if not post and "一般就労をした経験がある" in (one_label(rows_by_var, "Q16_1") or ""):
        uncertainty_flags.append("就業経験ありだが就業後未解決信号が少ない")
    if needed_absent and not present:
        uncertainty_flags.append("必要配慮は出るが配慮あり信号が少ない")
    if not needed_absent and sg in {"no_current_work_wish", "not_working_wants_work"}:
        uncertainty_flags.append("職場文脈がなく配慮項目が出ない可能性")

    ethical_risks = [
        "疾病名から就労可能性や配慮内容を直接推定しない",
        "Q10支障を本人欠陥として扱わない",
        "未解決や支援ニーズを本人責任に寄せない",
    ]
    if sg == "no_current_work_wish":
        ethical_risks.append("仕事希望なしを支援不要・就労拒否・復職対象のいずれにも短絡しない")
    if "特に何も伝えなかった" in (one_label(rows_by_var, "Q15_3") or ""):
        ethical_risks.append("非開示を本人責任として読まない")

    return CaseAnalysis(
        record_id=f"{DATASET_ID}:{int(respondent_id):05d}",
        respondent_id=respondent_id,
        status_group=sg,
        pattern_cell_id=cell_id,
        pattern_score=score,
        health_condition_groups=labels(rows_by_var, "Q05_3"),
        handbook_signals=sorted(dict.fromkeys(handbooks)),
        body_function_signals=q10,
        hospitalization_and_visits={
            key: one_label(rows_by_var, key) or ""
            for key in ("Q06", "Q07", "Q08")
        },
        work_status_label=work_status,
        work_experience={
            "general_work_after_onset": one_label(rows_by_var, "Q16_1"),
            "job_type": labels(rows_by_var, "Q16_2"),
            "weekly_hours": one_label(rows_by_var, "Q16_3_1"),
            "weekly_days": one_label(rows_by_var, "Q16_3_2"),
            "one_way_commute": one_label(rows_by_var, "Q16_3_3"),
            "job_search_after_onset": one_label(rows_by_var, "Q15_1"),
            "disclosure": labels(rows_by_var, "Q15_3"),
        },
        readiness_unresolved=ready,
        job_search_unresolved=job_search,
        post_employment_unresolved=post,
        accommodations_present=present,
        accommodations_needed_absent=needed_absent,
        support_use_gaps=gaps,
        consultation_sources=labels(rows_by_var, "Q18"),
        desired_supports=labels(rows_by_var, "Q19"),
        narrative_context_labels=narrative_context,
        narrative_lens_counts=narrative_lenses,
        candidate_interaction=interaction,
        counter_reading=counter,
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
        sorted_by_score = sorted(group, key=lambda c: (-c.pattern_score, stable_score([c.record_id, cell_id])))
        boundary = sorted(group, key=lambda c: (c.pattern_score, stable_score([c.record_id, cell_id])))[:8]
        exception_candidates = [
            c for c in group
            if "記述回答ラベルなし" in c.uncertainty_flags
            or "職場文脈がなく配慮項目が出ない可能性" in c.uncertainty_flags
            or not c.body_function_signals
        ][:8]
        cells.append({
            "pattern_cell_id": cell_id,
            "status": "machine_generated_unreviewed_no_promotion",
            "record_count": len(group),
            "included_record_ids": [c.record_id for c in group],
            "representative_record_ids": [c.record_id for c in sorted_by_score[:8]],
            "boundary_record_ids": [c.record_id for c in boundary],
            "exception_or_counterexample_record_ids": [c.record_id for c in exception_candidates],
            "dominant_status_groups": dict(Counter(c.status_group for c in group).most_common()),
            "top_body_function_signals": top_counts(group, "body_function_signals"),
            "top_readiness_unresolved": top_counts(group, "readiness_unresolved"),
            "top_job_search_unresolved": top_counts(group, "job_search_unresolved"),
            "top_post_employment_unresolved": top_counts(group, "post_employment_unresolved"),
            "top_accommodations_needed_absent": top_counts(group, "accommodations_needed_absent"),
            "top_support_use_gaps": top_counts(group, "support_use_gaps"),
            "top_narrative_context_labels": top_counts(group, "narrative_context_labels"),
            "candidate_interaction": sorted_by_score[0].candidate_interaction,
            "counter_reading": sorted_by_score[0].counter_reading,
            "overinterpretation_risks": [
                "件数を重要度・真実性・因果性として読まない",
                "同じセル内の個別差を潰さない",
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

    selected = cells[:8]
    lines = [
        "# 難病調査4000 伏字化記述統合 SCIMA/FCHMA 全件分析 v0",
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
        "- 目的: 人間レビュー前に、ICF構成要素と記述文脈を失わずに候補パターンへ束ねる。",
        "",
        "## 主要パターン候補",
        "",
    ]
    for cell in selected:
        lines.extend([
            f"### {cell['pattern_cell_id']}（{cell['record_count']}件）",
            "",
            f"候補命題: {cell['candidate_interaction']}",
            "",
            f"代表ID: {', '.join(cell['representative_record_ids'][:5])}",
            f"境界ID: {', '.join(cell['boundary_record_ids'][:5])}",
            f"例外・反例候補ID: {', '.join(cell['exception_or_counterexample_record_ids'][:5]) or 'なし'}",
            "",
            f"- 心身機能: {bullet_counts(cell['top_body_function_signals'])}",
            f"- 職業準備: {bullet_counts(cell['top_readiness_unresolved'])}",
            f"- 就職活動: {bullet_counts(cell['top_job_search_unresolved'])}",
            f"- 就業後困難: {bullet_counts(cell['top_post_employment_unresolved'])}",
            f"- 必要だがない職場配慮: {bullet_counts(cell['top_accommodations_needed_absent'])}",
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
                f"- 心身機能: {', '.join(case.body_function_signals[:5]) or 'なし'}",
                f"- 環境因子: 必要だがない配慮 {len(case.accommodations_needed_absent)}件、配慮あり {len(case.accommodations_present)}件",
                f"- 記述文脈: {', '.join(case.narrative_context_labels[:5]) or 'なし'}",
                "",
            ])
    lines.extend([
        "## この出力の使いどころ",
        "",
        "- 人間レビューで代表・境界・例外IDを開いて、セルを維持・分割・棄却する。",
        "- 件数は重要度ではなく、レビュー順序を決める補助情報として扱う。",
        "- 記述回答は伏字済み入力からラベル化しているが、引用や公開利用はしない。",
    ])
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    structured = read_structured()
    narratives = read_redacted_narrative()
    all_ids = sorted(structured.keys(), key=lambda x: int(x))

    cases = [make_case(rid, structured[rid], narratives.get(rid, [])) for rid in all_ids]
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
