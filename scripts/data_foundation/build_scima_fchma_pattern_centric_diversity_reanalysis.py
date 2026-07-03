#!/usr/bin/env python3
"""Pattern-centric diversity reanalysis for SCIMA/FCHMA outputs.

This script treats ICF relation patterns as the unit of analysis. Disease
groups, disability groups, sex, age band, region, and work status are used only
as stability/modulation checks, not as the primary explanation.
"""

from __future__ import annotations

import csv
import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_ID = "redacted-narrative-integrated-v0-2026-05-13"
OUT_DIR = ROOT / "references/derived/scima-fchma/pattern-centric-diversity-reanalysis-v0-2026-05-13"


DATASETS = {
    "nanbyo_survey_4000": {
        "case_path": ROOT / "references/derived/scima-fchma/nanbyo_survey_4000" / RUN_ID / "case-interpretations.jsonl",
        "structured_path": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv",
        "age_field": "Q02",
        "sex_field": "Q03",
        "region_field": None,
        "group_field": "health_condition_groups",
        "group_dimension": "疾病群",
    },
    "employment_survey_3000": {
        "case_path": ROOT / "references/derived/scima-fchma/employment_survey_3000" / RUN_ID / "case-interpretations.jsonl",
        "structured_path": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv",
        "age_field": "2年齢",
        "sex_field": "2性別",
        "region_field": "2住所",
        "group_field": "impairment_signals",
        "group_dimension": "障害種類",
    },
}


DATASET_LABELS = {
    "nanbyo_survey_4000": "難病調査4000",
    "employment_survey_3000": "障害者雇用・就労調査3000",
}


EMPLOYMENT_BROAD_MAP = {
    "視覚障害": {"全盲", "弱視・視野障害", "盲ろう"},
    "聴覚・平衡機能障害": {"ろうあ", "難聴", "平衡機能障害", "盲ろう"},
    "肢体不自由": {"脳性まひ", "頸髄損傷", "脊髄損傷", "筋ジストロフィー", "脳卒中後遺症", "切断、その他", "二分脊椎"},
    "内部障害": {
        "ペースメーカー適用",
        "人工弁適用",
        "心臓機能障害３、４級",
        "心臓機能障害",
        "血液透析適用",
        "腹膜透析適用",
        "腎臓機能障害３、４級",
        "酸素療法適用",
        "呼吸器機能障害３、４級",
        "人工肛門",
        "尿路変更、自己導尿",
        "小腸機能障害１級",
        "小腸機能障害３、４級",
        "抗HIV服薬継続中",
        "抗HIV服薬治療開始前",
    },
    "知的障害": {"知的障害", "ダウン症"},
    "精神障害": {"統合失調症", "気分障害（うつ、そううつ等）", "てんかん", "不安障害・パニック障害", "その他の精神障害"},
    "発達障害": {"広汎性発達障害", "自閉症", "アスペルガー障害", "学習障害", "読字障害", "注意欠陥多動性障害", "トゥレット症候群", "その他の発達障害"},
    "高次脳機能障害": {"高次脳機能障害"},
    "難病・慢性疾患": {"難病、慢性疾患"},
}


RELATIONS = {
    "R01-health-fluctuation-schedule-workdesign": {
        "title": "体調変動・治療管理 × 勤務時間/休憩/仕事内容調整",
        "candidate": "体調変動、疲労、通院、治療管理が、勤務時間、休憩、仕事内容、在宅/短時間などの仕事設計と結びつく。",
        "families": ["health", "schedule", "work_design"],
    },
    "R02-disclosure-accommodation-translation": {
        "title": "説明・開示 × 必要配慮の翻訳/職場理解",
        "candidate": "病気・障害の説明や必要配慮の伝達が、職場理解、偏見防止、配慮実装の接点で詰まりやすい。",
        "families": ["disclosure", "understanding", "accommodation"],
    },
    "R03-support-access-service-fit": {
        "title": "支援アクセス × 支援メニューの適合",
        "candidate": "相談先や支援制度の存在と、本人の生活段階・職業課題に合う形で届くことの間に断絶がある。",
        "families": ["support_access", "service_fit"],
    },
    "R04-cognitive-task-structure": {
        "title": "認知・遂行機能 × 手順化/OJT/職業能力評価",
        "candidate": "注意集中、読む・書く、判断、課題遂行などの活動課題が、マニュアル、個別実務指導、職業能力評価と結びつく。",
        "families": ["cognitive_task", "structured_instruction"],
    },
    "R05-communication-information-access": {
        "title": "情報理解・コミュニケーション × 意思疎通支援/人的支援",
        "candidate": "会話、議論、説明理解、意思伝達などの活動課題が、意思疎通機器、通訳、職場理解、人的支援と結びつく。",
        "families": ["communication", "communication_support"],
    },
    "R06-mobility-physical-access": {
        "title": "移動・身体操作 × 物理環境/支援機器",
        "candidate": "歩行、通勤、姿勢、手指操作、運搬などの活動課題が、支援機器、施設改善、物理環境調整と結びつく。",
        "families": ["mobility_physical", "physical_environment"],
    },
    "R07-psychosocial-workplace-relations": {
        "title": "対人・ストレス負荷 × 職場理解/相談体制",
        "candidate": "ストレス、人間関係、疎外感、職場負担感が、上司・同僚の理解、相談者、職場内の調整体制と結びつく。",
        "families": ["psychosocial", "understanding", "human_support"],
    },
    "R08-career-participation-treatment": {
        "title": "参加の質・処遇 × キャリア/安定就労",
        "candidate": "満足、処遇、昇進、報酬、仕事の継続、経済的自立が、キャリア形成や安定就労の環境と結びつく。",
        "families": ["career_participation", "career_support"],
    },
    "R09-entry-readiness-disclosure-support": {
        "title": "就職入口・職業準備 × 開示/支援接続",
        "candidate": "応募、面接、会社情報、職場実習、自己アピール、就労希望の表明が、開示・配慮説明や支援接続と結びつく。",
        "families": ["entry_readiness", "disclosure", "support_access"],
    },
    "R10-condition-uncertainty-work-confidence": {
        "title": "病状変動・将来不安 × 就労自信/生活設計",
        "candidate": "病状進行、症状変動、将来不安、仕事への自信が、生活設計や就労継続の判断と結びつく。",
        "families": ["condition_uncertainty", "work_confidence", "life_design"],
    },
}


NON_ACTIONABLE_STRATA = {
    "他疾患",
    "疾病群未分類",
    "障害種類未分類",
    "unknown_or_other",
    "性別不明",
    "年齢不明",
}


VALUE_DISPLAY = {
    "currently_working": "現在就労中",
    "not_working_wants_work": "未就労・就労希望あり",
    "job_transition_or_training": "移行・訓練期",
    "no_current_work_wish": "現在は就労希望なし",
    "past_work_not_current": "過去就労あり・現在就労なし",
    "never_worked": "就労経験なし",
    "unknown_or_other": "不明・その他",
}


FAMILY_PATTERNS: dict[str, list[str]] = {
    "health": ["疲", "体調", "崩れ", "通院", "治療", "服薬", "健康管理", "自己管理", "休養", "病状悪化"],
    "schedule": ["勤務時間", "休憩", "短時間", "在宅", "時差", "フレックス", "休日", "通院への配慮", "勤務中の服薬"],
    "work_design": ["仕事内容", "仕事の内容", "仕事設計", "配置", "業務", "無理のない仕事", "職務", "仕事量", "能力的に無理"],
    "disclosure": ["説明", "開示", "伝え", "配慮等の伝達", "必要配慮説明", "病気や障害の説明"],
    "understanding": ["理解", "偏見", "差別", "啓発", "上司", "同僚", "職場全体", "正しい理解"],
    "accommodation": ["配慮", "整備無", "必要だが", "職場配慮", "環境整備", "調整"],
    "support_access": ["知らなかった", "相談", "支援", "制度", "ハローワーク", "センター", "利用の仕方", "支援アクセス"],
    "service_fit": ["役に立たなかった", "ニーズには合わなかった", "利用したことはないが必要", "必要な支援", "未利用"],
    "cognitive_task": ["注意", "集中", "判断", "問題解決", "読む", "書く", "計算", "理解", "課題遂行", "記憶"],
    "structured_instruction": ["マニュアル", "研修", "OJT", "個別実務指導", "職業能力", "技能", "能力評価", "訓練"],
    "communication": ["会話", "議論", "応対", "意思を伝える", "話や文書", "コミュニケーション", "聴覚", "難聴", "言語"],
    "communication_support": ["意思疎通", "手話", "通訳", "コミュニケーション機器", "人的支援", "専門的支援者"],
    "mobility_physical": ["歩", "移動", "通勤", "交通", "立った姿勢", "座った姿勢", "手と手指", "手と腕", "運搬", "身体操作"],
    "physical_environment": ["支援機器", "施設改善", "スロープ", "駐車場", "通路", "作業机", "トイレ", "物理環境", "移動用"],
    "psychosocial": ["ストレス", "人間関係", "疎外", "負担感", "意欲", "自己効力", "精神", "孤立"],
    "human_support": ["相談者", "専任相談員", "同僚等の作業補助", "ジョブコーチ", "同行支援", "ケース会議"],
    "career_participation": ["満足", "処遇", "昇進", "報酬", "仕事の継続", "キャリア", "経済", "社会の一員", "生きがい"],
    "career_support": ["キャリアアップ", "職業人生", "転職", "退職時", "資格取得", "職業スキル"],
    "entry_readiness": ["就職活動", "応募", "面接", "履歴書", "求人", "職場実習", "仕事調べ", "会社情報", "アピール", "能力獲得"],
    "condition_uncertainty": ["病状進行", "将来", "不安", "全くできない", "進行", "変動", "免疫", "感染"],
    "work_confidence": ["仕事ができる", "自信", "両立の自信", "就労自信", "できるとは思わない", "わからない"],
    "life_design": ["人生設計", "生活設計", "生活", "地域", "安心", "家族", "当たり前の生活"],
}


LENS_FIELDS = {
    "nanbyo_survey_4000": {
        "心身機能": ["body_function_signals"],
        "職業準備・生活設計": ["readiness_unresolved"],
        "就職入口": ["job_search_unresolved"],
        "就業後課題": ["post_employment_unresolved"],
        "職場環境・配慮": ["accommodations_present", "accommodations_needed_absent"],
        "支援接続": ["support_use_gaps", "consultation_sources", "desired_supports"],
        "記述文脈": ["narrative_context_labels"],
    },
    "employment_survey_3000": {
        "就職入口": ["pre_employment_unresolved"],
        "就業後課題": ["post_employment_unresolved"],
        "職場環境・配慮": ["accommodations_present", "accommodations_needed_absent"],
        "支援接続": ["consultation_gaps", "service_fit_gaps"],
        "説明・開示": ["disclosure_gaps"],
        "参加・処遇": ["satisfaction_risks"],
        "就労自信": ["low_work_confidence"],
        "記述文脈": ["narrative_context_labels"],
    },
}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                rows.append(json.loads(line))
    return rows


def record_id(dataset_id: str, respondent_id: str) -> str:
    if dataset_id == "nanbyo_survey_4000":
        try:
            return f"{dataset_id}:{int(respondent_id):05d}"
        except ValueError:
            return f"{dataset_id}:{respondent_id}"
    return f"{dataset_id}:{respondent_id}"


def read_strata(dataset_id: str, config: dict[str, Any]) -> dict[str, dict[str, str]]:
    strata: dict[str, dict[str, str]] = defaultdict(dict)
    wanted = {config["age_field"], config["sex_field"]}
    if config.get("region_field"):
        wanted.add(config["region_field"])
    with config["structured_path"].open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            raw_name = row["raw_name"]
            if raw_name not in wanted:
                continue
            rid = record_id(dataset_id, row["respondent_id"])
            value = row.get("label_text") or row.get("raw_value_text") or row.get("normalized_value") or ""
            if not value:
                continue
            if raw_name == config["age_field"]:
                strata[rid]["年齢層"] = age_band(dataset_id, value)
            elif raw_name == config["sex_field"]:
                strata[rid]["性別"] = value
            elif raw_name == config.get("region_field"):
                strata[rid]["地域"] = value
    return strata


def age_band(dataset_id: str, value: str) -> str:
    if dataset_id == "nanbyo_survey_4000":
        if "18～24" in value or "25～29" in value:
            return "18-29歳"
        if "30～34" in value or "35～39" in value:
            return "30代"
        if "40～44" in value or "45～49" in value:
            return "40代"
        if "50～54" in value or "55～59" in value:
            return "50代"
        if "60～65" in value:
            return "60-65歳"
        return value
    try:
        age = int(float(value))
    except ValueError:
        return value
    if age < 30:
        return "29歳以下"
    if age < 40:
        return "30代"
    if age < 50:
        return "40代"
    if age < 60:
        return "50代"
    return "60歳以上"


def broad_groups(dataset_id: str, case: dict[str, Any]) -> list[str]:
    if dataset_id == "nanbyo_survey_4000":
        return case.get("health_condition_groups") or ["疾病群未分類"]
    detail = set(case.get("impairment_signals") or [])
    groups = [group for group, labels in EMPLOYMENT_BROAD_MAP.items() if detail & labels]
    return groups or ["障害種類未分類"]


def flatten_case_labels(dataset_id: str, case: dict[str, Any]) -> list[str]:
    labels: list[str] = []
    for fields in LENS_FIELDS[dataset_id].values():
        for field in fields:
            value = case.get(field)
            if isinstance(value, list):
                labels.extend(str(v) for v in value if v)
            elif isinstance(value, str) and value:
                labels.append(value)
    labels.append(case.get("pattern_cell_id", ""))
    labels.append(case.get("status_group", ""))
    return labels


def families_for_case(dataset_id: str, case: dict[str, Any]) -> set[str]:
    text = "\n".join(flatten_case_labels(dataset_id, case))
    families = set()
    for family, needles in FAMILY_PATTERNS.items():
        if any(needle in text for needle in needles):
            families.add(family)
    return families


def relations_for_case(dataset_id: str, case: dict[str, Any]) -> list[str]:
    families = families_for_case(dataset_id, case)
    relations = []
    for relation_id, relation in RELATIONS.items():
        required = relation["families"]
        hits = sum(1 for family in required if family in families)
        if hits >= 2:
            relations.append(relation_id)

    # Avoid leaving clinically/socially meaningful cases empty when the signal is
    # concentrated in one broad family plus narrative.
    if not relations and {"support_access", "service_fit"} & families:
        relations.append("R03-support-access-service-fit")
    if not relations and {"health", "condition_uncertainty", "work_confidence"} & families:
        relations.append("R10-condition-uncertainty-work-confidence")
    return relations


def stratum_values(dataset_id: str, case: dict[str, Any], strata: dict[str, dict[str, str]]) -> dict[str, list[str]]:
    rid = case["record_id"]
    values = {
        DATASETS[dataset_id]["group_dimension"]: broad_groups(dataset_id, case),
        "性別": [strata.get(rid, {}).get("性別", "性別不明")],
        "年齢層": [strata.get(rid, {}).get("年齢層", "年齢不明")],
        "就労状態": [case.get("status_group") or "unknown"],
    }
    region = strata.get(rid, {}).get("地域")
    if region:
        values["地域"] = [region]
    return values


def label_lens_values(dataset_id: str, case: dict[str, Any]) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for lens, fields in LENS_FIELDS[dataset_id].items():
        vals: list[str] = []
        for field in fields:
            value = case.get(field)
            if isinstance(value, list):
                vals.extend(value)
            elif isinstance(value, str) and value:
                vals.append(value)
        out[lens] = sorted(dict.fromkeys(vals))
    return out


def relation_signal_summary(dataset_id: str, relation_cases: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    summary = {}
    for lens in LENS_FIELDS[dataset_id].keys():
        counter: Counter[str] = Counter()
        for case in relation_cases:
            counter.update(label_lens_values(dataset_id, case).get(lens, []))
        summary[lens] = [{"label": label, "count": count} for label, count in counter.most_common(5)]
    return summary


def dimension_stats(
    all_cases: list[dict[str, Any]],
    relation_case_ids: set[str],
    dataset_id: str,
    strata: dict[str, dict[str, str]],
) -> dict[str, Any]:
    stats: dict[str, Any] = {}
    for dim in [DATASETS[dataset_id]["group_dimension"], "性別", "年齢層", "就労状態", "地域"]:
        total_counts: Counter[str] = Counter()
        hit_counts: Counter[str] = Counter()
        for case in all_cases:
            values = stratum_values(dataset_id, case, strata).get(dim, [])
            for value in values:
                total_counts[value] += 1
                if case["record_id"] in relation_case_ids:
                    hit_counts[value] += 1
        if not total_counts:
            continue
        global_rate = len(relation_case_ids) / len(all_cases)
        rows = []
        eligible = 0
        active = 0
        for value, total in total_counts.items():
            if total < 20:
                continue
            eligible += 1
            hits = hit_counts[value]
            rate = hits / total
            if hits >= 5 and rate >= max(0.05, global_rate * 0.75):
                active += 1
            lift = (hits + 0.5) / (total + 1) / ((len(relation_case_ids) + 0.5) / (len(all_cases) + 1))
            rows.append({
                "value": value,
                "total": total,
                "hits": hits,
                "rate": round(rate, 3),
                "lift": round(lift, 2),
            })
        rows.sort(key=lambda r: (-r["lift"], -r["hits"], r["value"]))
        relation_total = sum(hit_counts.values())
        top_share = max((hit_counts[v] for v in hit_counts), default=0) / relation_total if relation_total else 0
        group_dim = DATASETS[dataset_id]["group_dimension"]
        min_total_for_strong = 20 if dim == group_dim else 50
        strongest_rows = [
            row for row in rows
            if row["total"] >= min_total_for_strong
            and row["hits"] >= 3
            and row["lift"] >= 1.25
            and row["value"] not in NON_ACTIONABLE_STRATA
        ][:6]
        stats[dim] = {
            "eligible_strata": eligible,
            "active_strata": active,
            "coverage": round(active / eligible, 3) if eligible else None,
            "top_share_within_relation": round(top_share, 3),
            "strongest_strata": strongest_rows,
            "all_strata": rows,
        }
    return stats


def strongest_contexts(card: dict[str, Any], dataset_id: str) -> list[dict[str, Any]]:
    contexts = []
    for dim in [DATASETS[dataset_id]["group_dimension"], "性別", "年齢層", "就労状態", "地域"]:
        stats = card["stratification"].get(dim)
        if not stats:
            continue
        for row in stats.get("strongest_strata") or []:
            contexts.append({"dimension": dim, **row})
    contexts.sort(key=lambda row: (-row["lift"], -row["hits"], row["dimension"], row["value"]))
    return contexts


def display_value(value: str) -> str:
    return VALUE_DISPLAY.get(value, value)


def classify_relation(card: dict[str, Any], dataset_id: str) -> str:
    group_dim = DATASETS[dataset_id]["group_dimension"]
    stats = card["stratification"]
    group_strengths = stats.get(group_dim, {}).get("strongest_strata") or []
    context_strengths = strongest_contexts(card, dataset_id)
    max_group_lift = max((row["lift"] for row in group_strengths), default=0)
    max_context_lift = max((row["lift"] for row in context_strengths), default=0)
    n = card["record_count"]
    share = card["dataset_share"]

    if n < 30:
        return "少数例からの要確認パターン"
    if share >= 0.65 and max_context_lift < 1.25:
        return "疾病群・障害種類によらない共通横断パターン"
    if share >= 0.45:
        if max_context_lift >= 1.25:
            return "共通だが文脈で強まるパターン"
        return "疾病群・障害種類によらない共通横断パターン"
    if max_group_lift >= 1.3 or max_context_lift >= 1.45:
        return "特定文脈で強く出る多様性パターン"
    return "共通だが文脈で強まるパターン"


def diversity_reading(card: dict[str, Any], dataset_id: str) -> str:
    contexts = strongest_contexts(card, dataset_id)[:5]
    if not contexts:
        return "特定の疾病群・障害種類・性別・年齢層に強く寄らず、仕事設計・支援接続・職場理解の共通課題として読む。"
    context_text = "、".join(
        f"{row['dimension']}={display_value(row['value'])}（{row['hits']}/{row['total']}件、{row['lift']}倍）"
        for row in contexts
    )
    if card["dataset_share"] >= 0.45:
        return f"共通パターンとして残しつつ、{context_text}で強まりがあるため、レビューでは共通コアと文脈別の分岐を分けて見る。"
    return f"全体要約に埋もれやすいが、{context_text}で相対的に強く出る。疾病名・障害種類で決め打ちせず、該当するICF活動・環境関係としてレビューする。"


def select_relation_ids(
    dataset_id: str,
    relation_cases: list[dict[str, Any]],
    strata: dict[str, dict[str, str]],
    relation_id: str,
) -> dict[str, list[str]]:
    group_dim = DATASETS[dataset_id]["group_dimension"]
    seen_groups = set()
    representative = []
    relation_family = set(RELATIONS[relation_id]["families"])
    for case in sorted(
        relation_cases,
        key=lambda c: (-len(families_for_case(dataset_id, c) & relation_family), -c.get("pattern_score", 0), c["record_id"]),
    ):
        groups = stratum_values(dataset_id, case, strata).get(group_dim, [])
        if any(group not in seen_groups for group in groups):
            representative.append(case["record_id"])
            seen_groups.update(groups)
        if len(representative) >= 6:
            break
    if len(representative) < 6:
        for case in sorted(relation_cases, key=lambda c: c["record_id"]):
            if case["record_id"] not in representative:
                representative.append(case["record_id"])
            if len(representative) >= 6:
                break

    scored = []
    for case in relation_cases:
        fams = families_for_case(dataset_id, case)
        scored.append((len(fams & relation_family), case.get("pattern_score", 0), case["record_id"]))
    boundary = [rid for _, _, rid in sorted(scored, key=lambda x: (x[0], x[1], x[2]))[:6]]
    return {
        "representative_record_ids": representative,
        "boundary_record_ids": boundary,
    }


def counter_ids_for_relation(
    dataset_id: str,
    all_cases: list[dict[str, Any]],
    relation_case_ids: set[str],
    strata: dict[str, dict[str, str]],
    card: dict[str, Any],
) -> list[str]:
    group_dim = DATASETS[dataset_id]["group_dimension"]
    strongest = card["stratification"].get(group_dim, {}).get("strongest_strata") or []
    target_groups = [row["value"] for row in strongest[:3]]
    out = []
    for case in all_cases:
        if case["record_id"] in relation_case_ids:
            continue
        groups = stratum_values(dataset_id, case, strata).get(group_dim, [])
        if target_groups and not any(group in target_groups for group in groups):
            continue
        out.append(case["record_id"])
        if len(out) >= 6:
            break
    return out


def build_dataset_result(dataset_id: str) -> dict[str, Any]:
    config = DATASETS[dataset_id]
    cases = read_jsonl(config["case_path"])
    strata = read_strata(dataset_id, config)

    relation_to_cases: dict[str, list[dict[str, Any]]] = defaultdict(list)
    case_relations: dict[str, list[str]] = {}
    for case in cases:
        relations = relations_for_case(dataset_id, case)
        case_relations[case["record_id"]] = relations
        for relation in relations:
            relation_to_cases[relation].append(case)

    cards = []
    for relation_id, relation_cases in relation_to_cases.items():
        relation_case_ids = {case["record_id"] for case in relation_cases}
        stratification = dimension_stats(cases, relation_case_ids, dataset_id, strata)
        card = {
            "relation_id": relation_id,
            "relation_title": RELATIONS[relation_id]["title"],
            "status": "machine_generated_unreviewed_no_promotion",
            "record_count": len(relation_cases),
            "dataset_share": round(len(relation_cases) / len(cases), 3),
            "candidate_relation": RELATIONS[relation_id]["candidate"],
            "counter_relation": (
                "この関係は疾病名・障害種類・性別・年齢層から支援内容を直接決めるものではない。"
                "層をまたいで安定する部分と、特定文脈で強まる部分を分けて、人間レビューで維持・分割・棄却する。"
            ),
            "stratification": stratification,
            "top_signals_by_lens": relation_signal_summary(dataset_id, relation_cases),
        }
        card["pattern_class"] = classify_relation(card, dataset_id)
        card["diversity_reading"] = diversity_reading(card, dataset_id)
        card["strongest_contexts"] = strongest_contexts(card, dataset_id)[:8]
        card.update(select_relation_ids(dataset_id, relation_cases, strata, relation_id))
        card["exception_or_counterexample_record_ids"] = counter_ids_for_relation(dataset_id, cases, relation_case_ids, strata, card)
        cards.append(card)

    class_order = {
        "疾病群・障害種類によらない共通横断パターン": 0,
        "共通だが文脈で強まるパターン": 1,
        "特定文脈で強く出る多様性パターン": 2,
        "少数例からの要確認パターン": 3,
    }
    cards.sort(key=lambda c: (class_order[c["pattern_class"]], -c["record_count"], c["relation_id"]))

    return {
        "dataset_id": dataset_id,
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "case_count": len(cases),
        "relation_count": len(cards),
        "raw_or_redacted_text_included": False,
        "method": {
            "primary_unit": "ICF relation pattern",
            "strata_used_as_checks": [config["group_dimension"], "性別", "年齢層", "就労状態", "地域"],
            "purpose": "separate cross-cutting common patterns from context-amplified or context-specific diversity patterns",
            "promotion": "none",
        },
        "relation_cards": cards,
    }


def format_signal(items: list[dict[str, Any]]) -> str:
    if not items:
        return "なし"
    return "、".join(f"{item['label']}（{item['count']}）" for item in items[:4])


def format_strata(card: dict[str, Any], dataset_id: str) -> list[str]:
    lines = []
    for dim in [DATASETS[dataset_id]["group_dimension"], "性別", "年齢層", "就労状態", "地域"]:
        stats = card["stratification"].get(dim)
        if not stats:
            continue
        strongest = stats.get("strongest_strata") or []
        if strongest:
            text = "、".join(f"{display_value(row['value'])} {row['hits']}/{row['total']}件 {row['lift']}倍" for row in strongest[:4])
        else:
            text = "特に強い層なし"
        lines.append(f"- {dim}: カバー {stats['active_strata']}/{stats['eligible_strata']}、相対的に強く出る層: {text}")
    return lines


def write_markdown(path: Path, results: list[dict[str, Any]]) -> None:
    lines = [
        "# SCIMA/FCHMA パターン中心・多様性再分析 v0",
        "",
        "日付: 2026-05-13",
        "状態: 機械生成・未レビュー・昇格なし",
        "入力: 難病調査4000・雇用就労調査3000の既存ケース解釈。本文引用は含めない。",
        "",
        "## 何を変えたか",
        "",
        "- 疾病群・障害種類を主語にしない。",
        "- ICF関係パターンを主語にし、疾病群・障害種類・性別・年齢層・就労状態は安定性と増幅を調べる検査軸にする。",
        "- 関係が多くの層に存在するだけでは「共通横断」にしない。特定層での相対的な強まりを別に表示する。",
        "- 出力を「共通横断」「共通だが文脈で強まる」「特定文脈で強く出る」に分ける。",
        "",
    ]
    for result in results:
        dataset_id = result["dataset_id"]
        lines.extend([
            f"## {DATASET_LABELS.get(dataset_id, dataset_id)}（{dataset_id}）",
            "",
            f"- ケース数: {result['case_count']}",
            f"- 関係パターン数: {result['relation_count']}",
            "",
        ])
        for card in result["relation_cards"]:
            lines.extend([
                f"### {card['relation_title']}（{card['record_count']}件 / {card['dataset_share']:.0%}）",
                "",
                f"分類: {card['pattern_class']}",
                "",
                f"候補関係: {card['candidate_relation']}",
                "",
                f"反対関係: {card['counter_relation']}",
                "",
                f"多様性の読み: {card['diversity_reading']}",
                "",
                f"代表ID: {', '.join(card['representative_record_ids'])}",
                f"境界ID: {', '.join(card['boundary_record_ids'])}",
                f"例外・反例候補ID: {', '.join(card['exception_or_counterexample_record_ids']) or 'なし'}",
                "",
                "層別での見え方:",
                *format_strata(card, dataset_id),
                "",
                "主なICF接点:",
            ])
            for lens, items in card["top_signals_by_lens"].items():
                lines.append(f"- {lens}: {format_signal(items)}")
            lines.append("")
    lines.extend([
        "## 読み方",
        "",
        "- 共通横断は、疾病群・障害種類をまたいで出る実務上の基盤パターン。",
        "- 文脈で強まるパターンは、共通性を持ちながら、特定の機能・生活・職場文脈で設計上の重みが増すもの。",
        "- 特定文脈パターンは、少数派を含む多様性の入口であり、疾病名・障害種類による決め打ちではない。",
    ])
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results = [build_dataset_result(dataset_id) for dataset_id in DATASETS]
    json_path = OUT_DIR / "pattern-centric-diversity-reanalysis.json"
    md_path = OUT_DIR / "pattern-centric-diversity-reanalysis.md"
    json_path.write_text(json.dumps({
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "results": results,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(md_path, results)
    print(json.dumps({
        "markdown": str(md_path.relative_to(ROOT)),
        "json": str(json_path.relative_to(ROOT)),
        "datasets": [
            {
                "dataset_id": result["dataset_id"],
                "case_count": result["case_count"],
                "relation_count": result["relation_count"],
                "classes": dict(Counter(card["pattern_class"] for card in result["relation_cards"])),
            }
            for result in results
        ],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
