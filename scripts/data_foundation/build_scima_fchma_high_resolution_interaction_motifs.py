#!/usr/bin/env python3
"""Mine high-resolution SCIMA/FCHMA interaction motifs.

The earlier pattern-centric pass kept ICF relation patterns primary, but the
result was still close to broad variable co-occurrence. This pass treats each
case as a bundle of ICF-relevant atoms and mines multi-lens interaction motifs:
function/activity/personal signals plus work design/environment/support/
participation signals. Disease/disability, age, sex, and work status are used
only as contrast lenses after motif discovery.
"""

from __future__ import annotations

import csv
import itertools
import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_ID = "redacted-narrative-integrated-v0-2026-05-13"
OUT_DIR = ROOT / "references/derived/scima-fchma/high-resolution-interaction-motifs-v0-2026-05-13"


DATASETS = {
    "nanbyo_survey_4000": {
        "label": "難病調査4000",
        "case_path": ROOT / "references/derived/scima-fchma/nanbyo_survey_4000" / RUN_ID / "case-interpretations.jsonl",
        "structured_path": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv",
        "age_field": "Q02",
        "sex_field": "Q03",
        "region_field": None,
        "group_dimension": "疾病群",
    },
    "employment_survey_3000": {
        "label": "障害者雇用・就労調査3000",
        "case_path": ROOT / "references/derived/scima-fchma/employment_survey_3000" / RUN_ID / "case-interpretations.jsonl",
        "structured_path": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv",
        "age_field": "2年齢",
        "sex_field": "2性別",
        "region_field": "2住所",
        "group_dimension": "障害種類",
    },
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


VALUE_DISPLAY = {
    "currently_working": "現在就労中",
    "not_working_wants_work": "未就労・就労希望あり",
    "job_transition_or_training": "移行・訓練期",
    "no_current_work_wish": "現在は就労希望なし",
    "past_work_not_current": "過去就労あり・現在就労なし",
    "never_worked": "就労経験なし",
    "unknown_or_other": "不明・その他",
}


NON_ACTIONABLE_STRATA = {"他疾患", "疾病群未分類", "障害種類未分類", "unknown_or_other", "性別不明", "年齢不明"}


CASE_FIELDS = {
    "nanbyo_survey_4000": [
        "body_function_signals",
        "readiness_unresolved",
        "job_search_unresolved",
        "post_employment_unresolved",
        "accommodations_present",
        "accommodations_needed_absent",
        "support_use_gaps",
        "consultation_sources",
        "desired_supports",
        "narrative_context_labels",
    ],
    "employment_survey_3000": [
        "pre_employment_unresolved",
        "post_employment_unresolved",
        "accommodations_present",
        "accommodations_needed_absent",
        "consultation_gaps",
        "service_fit_gaps",
        "disclosure_gaps",
        "satisfaction_risks",
        "low_work_confidence",
        "low_soc_or_life_signals",
        "narrative_context_labels",
    ],
}


@dataclass(frozen=True)
class AtomRule:
    atom_id: str
    label: str
    lens: str
    role: str
    priority: int
    pattern: re.Pattern[str]


def rx(text: str) -> re.Pattern[str]:
    return re.compile(text)


ATOM_RULES = [
    AtomRule("health_fluctuation", "体調変動・疲労・痛み", "心身機能", "person", 95, rx("疲|体調|痛|しび|痺|症状|不調|発作|崩れ")),
    AtomRule("treatment_time_management", "通院・治療・服薬の時間管理", "健康管理", "person", 90, rx("通院|治療|服薬|医師|健康管理|自己管理|休養|入院")),
    AtomRule("condition_progression_uncertainty", "病状進行・将来不安", "個人・生活", "person", 84, rx("進行|将来|不安|免疫|感染|人生設計|生活設計")),
    AtomRule("cognitive_task_load", "読む・書く・判断・注意集中", "活動", "person", 88, rx("読む|読め|書く|計算|集中|判断|理解|覚え|記憶|問題解決|課題遂行")),
    AtomRule("communication_activity", "会話・意思疎通・応対", "活動", "person", 88, rx("会話|議論|意思疎通|応対|コミュニケーション|聴覚|難聴|言語|手話|通訳")),
    AtomRule("mobility_physical_activity", "移動・通勤・姿勢・身体操作", "活動", "person", 88, rx("歩|移動|通勤|交通|立った姿勢|座った姿勢|手と手指|手と腕|運搬|身体操作|車椅子")),
    AtomRule("psychosocial_stress", "ストレス・人間関係・孤立感", "個人・生活", "person", 82, rx("ストレス|人間関係|疎外|孤立|意欲|自己効力|精神的|負担感")),
    AtomRule("work_schedule_flex", "勤務時間・休憩・在宅等の調整", "仕事設計", "context", 92, rx("勤務時間|休憩|短時間|在宅|テレワーク|時差|フレックス|休日|出退勤|8時間")),
    AtomRule("job_content_redesign", "仕事内容・配置・仕事量の再設計", "仕事設計", "context", 94, rx("仕事内容|仕事の内容|仕事量|配置|業務|職務|無理のない仕事|能力的に無理|責任|安定して継続")),
    AtomRule("physical_environment_tools", "物理環境・支援機器", "職場環境", "context", 86, rx("支援機器|施設改善|設備|トイレ|駐車場|作業机|通路|冷暖房|エアコン|空気清浄機|物理環境")),
    AtomRule("workplace_understanding", "上司・同僚の理解と偏見防止", "職場環境", "context", 92, rx("理解|偏見|差別|啓発|上司|同僚|職場全体|正しい理解")),
    AtomRule("disclosure_translation", "病気・障害・必要配慮の説明", "説明・開示", "bridge", 94, rx("説明|開示|伝え|伝達|必要配慮|環境整備、配慮、支援|病気や障害")),
    AtomRule("support_navigation", "支援制度・相談先への接続", "支援接続", "context", 90, rx("知らなかった|相談|支援|制度|ハローワーク|センター|利用の仕方|ジョブコーチ|相談員")),
    AtomRule("support_fit_gap", "支援メニューと本人文脈の不一致", "支援接続", "context", 86, rx("ニーズには合わなかった|役に立たなかった|利用したことはないが必要|必要な支援|未利用|仕事内容や職場状況")),
    AtomRule("entry_readiness", "応募・面接・職場実習・自己アピール", "就職入口", "bridge", 84, rx("就職活動|応募|面接|履歴書|求人|職場実習|会社情報|アピール|希望の仕事|能力を身につける")),
    AtomRule("structured_instruction_training", "手順化・OJT・訓練・能力評価", "支援接続", "context", 80, rx("マニュアル|研修|OJT|個別実務指導|職業能力|技能|能力評価|訓練|資格取得")),
    AtomRule("career_participation_quality", "満足・処遇・昇進・報酬・継続", "参加", "outcome", 88, rx("満足|処遇|昇進|報酬|キャリア|仕事の継続|経済的自立|社会の一員|生きがい")),
    AtomRule("work_confidence_gap", "就労自信・条件付き不安", "個人・生活", "outcome", 82, rx("仕事ができる|自信|できるとは思わない|絶対に仕事はできない|わからない|両立の自信")),
    AtomRule("implemented_accommodation", "既にある配慮・環境整備", "職場環境", "context", 60, rx("__FIELD_accommodations_present__")),
    AtomRule("unmet_accommodation", "必要だが未整備の配慮", "職場環境", "context", 90, rx("__FIELD_accommodations_needed_absent__")),
    AtomRule("high_function_burden", "強い機能負荷", "心身機能", "person", 78, rx("かなりの支障|全く未解決|絶対に仕事はできない|非常に不適正|全く希望と違う")),
]


ATOM_BY_ID = {rule.atom_id: rule for rule in ATOM_RULES}
PERSON_ROLES = {"person", "bridge"}
CONTEXT_ROLES = {"context"}


def display_value(value: str) -> str:
    return VALUE_DISPLAY.get(value, value)


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


def read_narrative_presence(dataset_id: str) -> dict[str, dict[str, int]]:
    path = ROOT / f"data/staging/anonymized/{dataset_id}/v0/free_text_units.redacted.jsonl"
    presence: dict[str, dict[str, int]] = defaultdict(lambda: {"units": 0, "chars": 0})
    if not path.exists():
        return presence
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            row = json.loads(line)
            text = str(row.get("redacted_unit_text") or "").strip()
            if not text or text == "*" or len(text) < 4:
                continue
            rid = record_id(dataset_id, str(row["respondent_id"]))
            presence[rid]["units"] += 1
            presence[rid]["chars"] += len(text)
    return presence


def broad_groups(dataset_id: str, case: dict[str, Any]) -> list[str]:
    if dataset_id == "nanbyo_survey_4000":
        return case.get("health_condition_groups") or ["疾病群未分類"]
    detail = set(case.get("impairment_signals") or [])
    groups = [group for group, labels in EMPLOYMENT_BROAD_MAP.items() if detail & labels]
    return groups or ["障害種類未分類"]


def field_values(dataset_id: str, case: dict[str, Any]) -> list[tuple[str, str]]:
    values: list[tuple[str, str]] = []
    for field in CASE_FIELDS[dataset_id]:
        value = case.get(field)
        if isinstance(value, list):
            values.extend((field, str(v)) for v in value if v)
        elif isinstance(value, str) and value:
            values.append((field, value))
    if case.get("pattern_cell_id"):
        values.append(("pattern_cell_id", case["pattern_cell_id"]))
    return values


def atoms_for_case(dataset_id: str, case: dict[str, Any]) -> list[str]:
    atoms: set[str] = set()
    for field, value in field_values(dataset_id, case):
        marker_text = f"__FIELD_{field}__ {value}"
        for rule in ATOM_RULES:
            if rule.pattern.search(marker_text):
                atoms.add(rule.atom_id)
    if case.get("accommodations_present"):
        atoms.add("implemented_accommodation")
    if case.get("accommodations_needed_absent"):
        atoms.add("unmet_accommodation")
    if dataset_id == "employment_survey_3000" and case.get("service_fit_gaps"):
        atoms.add("support_fit_gap")
    if dataset_id == "nanbyo_survey_4000" and any("ニーズには合わなかった" in x for x in case.get("support_use_gaps") or []):
        atoms.add("support_fit_gap")
    ordered = sorted(atoms, key=lambda atom_id: (-ATOM_BY_ID[atom_id].priority, atom_id))
    return ordered[:12]


def valid_motif(combo: tuple[str, ...]) -> bool:
    rules = [ATOM_BY_ID[atom] for atom in combo]
    lenses = {rule.lens for rule in rules}
    roles = {rule.role for rule in rules}
    if len(lenses) < 3:
        return False
    if not roles & PERSON_ROLES or not roles & CONTEXT_ROLES:
        return False
    if {"implemented_accommodation", "unmet_accommodation"}.issuperset(combo):
        return False
    return True


def motif_combos(atoms: list[str]) -> set[tuple[str, ...]]:
    out: set[tuple[str, ...]] = set()
    for size in (3, 4):
        for combo in itertools.combinations(sorted(atoms), size):
            if valid_motif(combo):
                out.add(combo)
    return out


def stratum_values(dataset_id: str, case: dict[str, Any], strata: dict[str, dict[str, str]]) -> dict[str, list[str]]:
    rid = case["record_id"]
    values = {
        DATASETS[dataset_id]["group_dimension"]: broad_groups(dataset_id, case),
        "性別": [strata.get(rid, {}).get("性別", "性別不明")],
        "年齢層": [strata.get(rid, {}).get("年齢層", "年齢不明")],
        "就労状態": [case.get("status_group") or "unknown_or_other"],
    }
    region = strata.get(rid, {}).get("地域")
    if region:
        values["地域"] = [region]
    return values


def dimension_stats(
    dataset_id: str,
    all_cases: list[dict[str, Any]],
    hit_ids: set[str],
    strata: dict[str, dict[str, str]],
) -> dict[str, Any]:
    stats: dict[str, Any] = {}
    group_dim = DATASETS[dataset_id]["group_dimension"]
    for dim in [group_dim, "性別", "年齢層", "就労状態", "地域"]:
        total_counts: Counter[str] = Counter()
        hit_counts: Counter[str] = Counter()
        for case in all_cases:
            for value in stratum_values(dataset_id, case, strata).get(dim, []):
                total_counts[value] += 1
                if case["record_id"] in hit_ids:
                    hit_counts[value] += 1
        if not total_counts:
            continue
        global_rate = len(hit_ids) / len(all_cases)
        rows = []
        active = 0
        eligible = 0
        for value, total in total_counts.items():
            if total < 20:
                continue
            eligible += 1
            hits = hit_counts[value]
            rate = hits / total
            if hits >= 5 and rate >= max(0.03, global_rate * 0.75):
                active += 1
            lift = (hits + 0.5) / (total + 1) / ((len(hit_ids) + 0.5) / (len(all_cases) + 1))
            rows.append({"value": value, "total": total, "hits": hits, "rate": round(rate, 3), "lift": round(lift, 2)})
        rows.sort(key=lambda row: (-row["lift"], -row["hits"], row["value"]))
        min_total_for_strong = 20 if dim == group_dim else 50
        strongest = [
            row for row in rows
            if row["total"] >= min_total_for_strong
            and row["hits"] >= 3
            and row["lift"] >= 1.3
            and row["value"] not in NON_ACTIONABLE_STRATA
        ][:6]
        stats[dim] = {
            "eligible_strata": eligible,
            "active_strata": active,
            "coverage": round(active / eligible, 3) if eligible else None,
            "strongest_strata": strongest,
            "all_strata": rows,
        }
    return stats


def strongest_contexts(card: dict[str, Any], dataset_id: str) -> list[dict[str, Any]]:
    contexts = []
    for dim in [DATASETS[dataset_id]["group_dimension"], "性別", "年齢層", "就労状態", "地域"]:
        for row in card["stratification"].get(dim, {}).get("strongest_strata") or []:
            contexts.append({"dimension": dim, **row})
    contexts.sort(key=lambda row: (-row["lift"], -row["hits"], row["dimension"], row["value"]))
    return contexts


def motif_score(combo: tuple[str, ...], count: int, n_cases: int) -> float:
    share = count / n_cases
    lenses = len({ATOM_BY_ID[atom].lens for atom in combo})
    specificity = 1.0
    if share > 0.35:
        specificity -= min(0.55, share - 0.35)
    if share < 0.012:
        specificity -= 0.25
    return math.log(count + 1) * lenses * len(combo) * max(0.3, specificity)


def classify_card(card: dict[str, Any], dataset_id: str) -> str:
    contexts = strongest_contexts(card, dataset_id)
    max_lift = max((ctx["lift"] for ctx in contexts), default=0)
    share = card["dataset_share"]
    if card["record_count"] < 35:
        return "少数例からの要レビュー・モチーフ"
    if max_lift >= 1.55:
        return "特定文脈で増幅する高解像度モチーフ"
    if share >= 0.06 and max_lift < 1.35:
        return "疾病群・障害種類によらない高解像度共通モチーフ"
    return "共通性を持つが文脈で濃淡が出るモチーフ"


def motif_title(combo: tuple[str, ...]) -> str:
    role_order = {"person": 0, "bridge": 1, "context": 2, "outcome": 3}
    rules = sorted((ATOM_BY_ID[atom] for atom in combo), key=lambda rule: (role_order.get(rule.role, 9), rule.lens, rule.label))
    return " × ".join(rule.label for rule in rules)


def motif_proposition(combo: tuple[str, ...]) -> str:
    rules = [ATOM_BY_ID[atom] for atom in combo]
    person = [rule.label for rule in rules if rule.role == "person"]
    bridge = [rule.label for rule in rules if rule.role == "bridge"]
    context = [rule.label for rule in rules if rule.role == "context"]
    outcome = [rule.label for rule in rules if rule.role == "outcome"]
    first = "・".join(person + bridge) or "本人側の機能・活動・説明接点"
    second = "・".join(context) or "職場環境・支援接続"
    if outcome:
        return f"{first}が、{second}との接点で現れ、{ '・'.join(outcome) }にも関わっている可能性。"
    return f"{first}が、{second}との接点で同時に現れている可能性。"


def counter_proposition() -> str:
    return (
        "このモチーフは因果、支援妥当性、本人能力、職場の良否を確定しない。"
        "同じラベルの束でも、時期、職務、本人の希望、既に試した配慮、制度利用前後で意味が変わるため、代表IDと境界IDを人間レビューで読み分ける。"
    )


def diversity_reading(card: dict[str, Any], dataset_id: str) -> str:
    contexts = strongest_contexts(card, dataset_id)[:4]
    if not contexts:
        return "特定の疾病群・障害種類に強く寄せず、ICF上の相互作用として横断的に確認する。"
    text = "、".join(
        f"{ctx['dimension']}={display_value(ctx['value'])}（{ctx['hits']}/{ctx['total']}件、{ctx['lift']}倍）"
        for ctx in contexts
    )
    return f"{text}で相対的に強い。これは群で人を説明するためではなく、このICF相互作用がどの文脈で見落とされやすいかを示す。"


def pick_ids(
    dataset_id: str,
    combo: tuple[str, ...],
    cases: list[dict[str, Any]],
    case_atoms: dict[str, set[str]],
    hit_ids: set[str],
    strata: dict[str, dict[str, str]],
    card: dict[str, Any],
    narrative_presence: dict[str, dict[str, int]],
) -> dict[str, list[str]]:
    group_dim = DATASETS[dataset_id]["group_dimension"]
    seen_groups = set()
    reps = []
    for case in sorted(
        (c for c in cases if c["record_id"] in hit_ids),
        key=lambda c: (
            -min(narrative_presence.get(c["record_id"], {}).get("units", 0), 8),
            -min(narrative_presence.get(c["record_id"], {}).get("chars", 0), 1200),
            -c.get("pattern_score", 0),
            c["record_id"],
        ),
    ):
        groups = stratum_values(dataset_id, case, strata).get(group_dim, [])
        if any(group not in seen_groups for group in groups):
            reps.append(case["record_id"])
            seen_groups.update(groups)
        if len(reps) >= 6:
            break
    if len(reps) < 6:
        for case in sorted(
            (c for c in cases if c["record_id"] in hit_ids),
            key=lambda c: (
                -min(narrative_presence.get(c["record_id"], {}).get("units", 0), 8),
                -min(narrative_presence.get(c["record_id"], {}).get("chars", 0), 1200),
                c["record_id"],
            ),
        ):
            if case["record_id"] not in reps:
                reps.append(case["record_id"])
            if len(reps) >= 6:
                break

    combo_set = set(combo)
    near = []
    for case in cases:
        atoms = case_atoms[case["record_id"]]
        overlap = len(combo_set & atoms)
        if case["record_id"] not in hit_ids and overlap == len(combo) - 1:
            near.append((
                min(narrative_presence.get(case["record_id"], {}).get("units", 0), 8),
                min(narrative_presence.get(case["record_id"], {}).get("chars", 0), 1200),
                case.get("pattern_score", 0),
                case["record_id"],
            ))
    boundary = [rid for _, _, _, rid in sorted(near, key=lambda item: (-item[0], -item[1], -item[2], item[3]))[:6]]

    strongest = strongest_contexts(card, dataset_id)
    target_dim = strongest[0]["dimension"] if strongest else None
    target_value = strongest[0]["value"] if strongest else None
    counters = []
    for case in cases:
        if case["record_id"] in hit_ids:
            continue
        if target_dim and target_value not in stratum_values(dataset_id, case, strata).get(target_dim, []):
            continue
        if len(combo_set & case_atoms[case["record_id"]]) <= max(1, len(combo) - 2):
            counters.append((
                min(narrative_presence.get(case["record_id"], {}).get("units", 0), 8),
                min(narrative_presence.get(case["record_id"], {}).get("chars", 0), 1200),
                case["record_id"],
            ))
    return {
        "representative_record_ids": reps,
        "boundary_record_ids": boundary,
        "exception_or_counterexample_record_ids": [
            rid for _, _, rid in sorted(counters, key=lambda item: (-item[0], -item[1], item[2]))[:6]
        ],
    }


def collect_cases(dataset_id: str) -> tuple[list[dict[str, Any]], dict[str, dict[str, str]], dict[str, set[str]], dict[tuple[str, ...], int]]:
    config = DATASETS[dataset_id]
    cases = read_jsonl(config["case_path"])
    strata = read_strata(dataset_id, config)
    case_atoms: dict[str, set[str]] = {}
    counts: Counter[tuple[str, ...]] = Counter()
    for case in cases:
        atoms = atoms_for_case(dataset_id, case)
        case_atoms[case["record_id"]] = set(atoms)
        counts.update(motif_combos(atoms))
    return cases, strata, case_atoms, dict(counts)


def build_dataset_cards(dataset_id: str) -> dict[str, Any]:
    cases, strata, case_atoms, counts = collect_cases(dataset_id)
    narrative_presence = read_narrative_presence(dataset_id)
    n_cases = len(cases)
    min_count = 35
    preliminary = [
        (combo, count, motif_score(combo, count, n_cases))
        for combo, count in counts.items()
        if count >= min_count and count / n_cases <= 0.45
    ]
    preliminary.sort(key=lambda item: (-item[2], -item[1], item[0]))
    selected_for_stats = preliminary[:260]

    cards = []
    for combo, count, score in selected_for_stats:
        hit_ids = {case["record_id"] for case in cases if set(combo).issubset(case_atoms[case["record_id"]])}
        stratification = dimension_stats(dataset_id, cases, hit_ids, strata)
        card = {
            "motif_id": f"{dataset_id}:M{len(cards)+1:03d}",
            "atom_ids": list(combo),
            "atom_labels": [ATOM_BY_ID[atom].label for atom in combo],
            "lenses": sorted({ATOM_BY_ID[atom].lens for atom in combo}),
            "status": "machine_generated_unreviewed_no_promotion",
            "record_count": count,
            "dataset_share": round(count / n_cases, 3),
            "score": round(score, 2),
            "title": motif_title(combo),
            "candidate_interaction": motif_proposition(combo),
            "counter_interaction": counter_proposition(),
            "stratification": stratification,
            "context_readiness": {
                "hit_records_with_narrative": sum(1 for rid in hit_ids if narrative_presence.get(rid, {}).get("units", 0) > 0),
                "hit_records_with_narrative_share": round(
                    sum(1 for rid in hit_ids if narrative_presence.get(rid, {}).get("units", 0) > 0) / len(hit_ids), 3
                ) if hit_ids else 0,
            },
        }
        card["motif_class"] = classify_card(card, dataset_id)
        card["diversity_reading"] = diversity_reading(card, dataset_id)
        card["strongest_contexts"] = strongest_contexts(card, dataset_id)[:8]
        card.update(pick_ids(dataset_id, combo, cases, case_atoms, hit_ids, strata, card, narrative_presence))
        cards.append(card)

    final_cards = pick_reviewable_cards(cards)
    return {
        "dataset_id": dataset_id,
        "dataset_label": DATASETS[dataset_id]["label"],
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "case_count": n_cases,
        "raw_or_redacted_text_included": False,
        "method": {
            "primary_unit": "multi-lens ICF interaction motif",
            "not_primary_unit": "disease group or disability group",
            "strata_used_as_contrast_lenses": [DATASETS[dataset_id]["group_dimension"], "性別", "年齢層", "就労状態", "地域"],
        },
        "reviewable_cards": final_cards,
        "top_candidate_count": len(cards),
    }


def pick_reviewable_cards(cards: list[dict[str, Any]]) -> list[dict[str, Any]]:
    buckets = [
        "疾病群・障害種類によらない高解像度共通モチーフ",
        "共通性を持つが文脈で濃淡が出るモチーフ",
        "特定文脈で増幅する高解像度モチーフ",
        "少数例からの要レビュー・モチーフ",
    ]
    picked: list[dict[str, Any]] = []
    picked_atoms: list[set[str]] = []
    for bucket in buckets:
        candidates = [card for card in cards if card["motif_class"] == bucket]
        candidates.sort(key=lambda card: (
            -card["context_readiness"]["hit_records_with_narrative"],
            -card["context_readiness"]["hit_records_with_narrative_share"],
            -len(card["strongest_contexts"]),
            -card["score"],
            -card["record_count"],
        ))
        for card in candidates:
            atoms = set(card["atom_ids"])
            if any(len(atoms & prev) / len(atoms | prev) > 0.55 for prev in picked_atoms):
                continue
            picked.append(card)
            picked_atoms.append(atoms)
            if len([c for c in picked if c["motif_class"] == bucket]) >= 2:
                break
        if len(picked) >= 8:
            break
    if len(picked) < 8:
        for card in sorted(cards, key=lambda c: (-c["score"], -c["record_count"])):
            atoms = set(card["atom_ids"])
            if card in picked or any(len(atoms & prev) / len(atoms | prev) > 0.55 for prev in picked_atoms):
                continue
            picked.append(card)
            picked_atoms.append(atoms)
            if len(picked) >= 8:
                break
    return picked[:8]


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
        lines.append(f"- {dim}: カバー {stats['active_strata']}/{stats['eligible_strata']}、相対的に強い層: {text}")
    return lines


def write_markdown(path: Path, results: list[dict[str, Any]]) -> None:
    lines = [
        "# SCIMA/FCHMA 高解像度相互作用モチーフ v0",
        "",
        "日付: 2026-05-13",
        "状態: 機械生成・未レビュー・昇格なし",
        "入力: 既存のケース解釈、構造化信号、伏字化済み記述ラベル。本文引用は含めない。",
        "",
        "## この再分析で変えたこと",
        "",
        "- 疾病群・障害種類や単独変数ではなく、ケース内で同時に出る ICF 接点の束を分析単位にした。",
        "- 1つのモチーフは、心身機能・活動・個人/生活・仕事設計・職場環境・説明/開示・支援接続・参加のうち3領域以上を含む。",
        "- 疾病群・障害種類・性別・年齢層・就労状態は、モチーフ発見後の濃淡確認にだけ使う。",
        "",
    ]
    for result in results:
        dataset_id = result["dataset_id"]
        lines.extend([
            f"## {result['dataset_label']}（{dataset_id}）",
            "",
            f"- ケース数: {result['case_count']}",
            f"- レビュー用モチーフ数: {len(result['reviewable_cards'])}",
            "",
        ])
        for card in result["reviewable_cards"]:
            lines.extend([
                f"### {card['title']}（{card['record_count']}件 / {card['dataset_share']:.0%}）",
                "",
                f"分類: {card['motif_class']}",
                f"ICF接点: {'、'.join(card['lenses'])}",
                f"文脈確認素材: 記述あり {card['context_readiness']['hit_records_with_narrative']}/{card['record_count']}件（{card['context_readiness']['hit_records_with_narrative_share']:.0%}）",
                "",
                f"候補相互作用: {card['candidate_interaction']}",
                "",
                f"反対相互作用: {card['counter_interaction']}",
                "",
                f"多様性の読み: {card['diversity_reading']}",
                "",
                f"代表ID: {', '.join(card['representative_record_ids'])}",
                f"境界ID: {', '.join(card['boundary_record_ids']) or 'なし'}",
                f"例外・反例候補ID: {', '.join(card['exception_or_counterexample_record_ids']) or 'なし'}",
                "",
                "層別での見え方:",
                *format_strata(card, dataset_id),
                "",
                "レビューで見ること:",
                "- この束は本当に同じ相互作用として扱えるか。",
                "- 代表IDと境界IDの差は、仕事設計、職場環境、支援接続、本人の希望・生活段階のどこで生じているか。",
                "- 疾病群・障害種類に見える強まりは、医学名ではなく ICF 上の活動・環境関係として説明できるか。",
                "",
            ])
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results = [build_dataset_cards(dataset_id) for dataset_id in DATASETS]
    md_path = OUT_DIR / "scima-fchma-high-resolution-interaction-motifs.md"
    json_path = OUT_DIR / "scima-fchma-high-resolution-interaction-motifs.json"
    write_markdown(md_path, results)
    json_path.write_text(json.dumps({
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "results": results,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "markdown": str(md_path.relative_to(ROOT)),
        "json": str(json_path.relative_to(ROOT)),
        "datasets": [
            {
                "dataset_id": result["dataset_id"],
                "case_count": result["case_count"],
                "reviewable_cards": len(result["reviewable_cards"]),
                "classes": dict(Counter(card["motif_class"] for card in result["reviewable_cards"])),
            }
            for result in results
        ],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
