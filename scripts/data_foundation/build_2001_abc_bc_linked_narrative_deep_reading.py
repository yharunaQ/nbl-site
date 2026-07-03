#!/usr/bin/env python3
"""Build no-text B/C linked narrative SCIMA/FCHMA structure cards.

This reads locally redacted narrative units, but it writes no narrative content
to outputs. The goal is to turn the high-value B/C linked contrasts into an
auditable work queue for later human review and pattern-card drafting.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from hashlib import sha256
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
DATASET_ID = "2001_ABC_survey"
STAGING_DIR = REPO_ROOT / "data/staging/anonymized/2001_ABC_survey/v0"
DERIVED_DIR = REPO_ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22"

UNITS_JSONL = STAGING_DIR / "narrative_units.redacted.jsonl"
CARD_CANDIDATES_JSONL = STAGING_DIR / "narrative_single_perspective_card_candidates.jsonl"
LINKED_CANDIDATES_JSONL = STAGING_DIR / "narrative_linked_contrast_candidates.jsonl"

OUTPUT_CARDS_JSONL = STAGING_DIR / "bc_linked_narrative_deep_structure_cards.jsonl"
OUTPUT_PATTERN_CELLS_JSONL = STAGING_DIR / "bc_linked_narrative_pattern_cells.jsonl"

SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-B-C-linked-narrative-deep-structure-summary-v0-2026-05-22.json"
SUMMARY_MD = DERIVED_DIR / "2001-abc-survey-B-C-linked-narrative-deep-structure-summary-v0-2026-05-22.md"
PATTERN_MD = DERIVED_DIR / "2001-abc-survey-B-C-linked-narrative-pattern-cells-v0-2026-05-22.md"


TARGET_CONTRAST_FAMILIES = {
    "B_C_work_content_narrative_contrast_candidate",
    "B_C_support_practice_need_narrative_contrast_candidate",
}


TAG_RULES: dict[str, list[str]] = {
    "task_matching_assignment": ["適材", "適所", "適性", "能力", "配置", "担当", "向いて", "できる仕事", "仕事がある"],
    "task_content_concrete_work": [
        "作業",
        "業務",
        "仕事",
        "職務",
        "製造",
        "事務",
        "清掃",
        "検査",
        "入力",
        "販売",
        "接客",
        "組立",
        "加工",
        "運搬",
        "梱包",
        "包装",
        "袋詰",
        "製品",
        "部品",
        "商品",
        "印刷",
        "原稿",
        "ライン",
        "工程",
        "オペレーター",
        "開発",
        "営業",
        "修理",
        "メンテナンス",
        "マッサージ",
        "調理",
        "洗浄",
        "仕分",
        "検品",
        "品出し",
        "配送",
        "運転",
        "農作業",
        "園芸",
        "縫製",
        "データ",
        "パソコン",
        "PC",
        "書類",
        "ファイル",
        "郵便",
        "経理",
        "会計",
        "電話",
    ],
    "task_complexity_quality_safety": ["品質", "クオリティ", "ミス", "正確", "危険", "安全", "注意", "責任", "不良"],
    "pace_volume_time_pressure": ["ペース", "速度", "早く", "遅い", "量", "能率", "納期", "時間内", "残業"],
    "routine_variability_learning": ["単純", "反復", "繰り返", "慣れ", "覚え", "変化", "訓練", "練習", "習練", "マスター"],
    "physical_access_body_load": ["重い", "軽作業", "立ち", "座り", "歩行", "階段", "車いす", "手", "視力", "聴覚", "疲"],
    "communication_instruction_translation": ["指示", "説明", "連絡", "伝達", "理解", "確認", "会話", "手話", "筆談", "相談"],
    "social_contact_relationship": ["人間関係", "同僚", "上司", "職場", "客", "お客様", "周囲", "理解", "偏見"],
    "support_practice_or_supervision": ["配慮", "支援", "補助", "介助", "指導", "見守", "援助", "相談員", "ジョブコーチ"],
    "external_support_connection": ["ハローワーク", "職安", "学校", "福祉", "施設", "病院", "医師", "家族", "支援機関"],
    "health_time_condition_management": ["通院", "治療", "服薬", "体調", "疲労", "休憩", "勤務時間", "健康", "診療"],
    "commuting_daily_life": ["通勤", "送迎", "住居", "寮", "生活", "自立", "家族"],
    "participation_satisfaction_quality": ["満足", "不満", "やりがい", "希望", "続け", "定着", "評価", "給料", "賃金"],
    "burden_management_risk": ["負担", "困難", "課題", "問題", "心配", "管理", "留意", "難しい"],
    "agency_preference_boundary": ["希望", "したい", "したくない", "困る", "必要", "ほしい", "自分", "本人"],
}


TAG_TO_FREEDOM_AXIS: dict[str, str] = {
    "task_matching_assignment": "work_assignment_freedom",
    "task_content_concrete_work": "work_content_freedom",
    "task_complexity_quality_safety": "load_quality_safety_freedom",
    "pace_volume_time_pressure": "pace_time_freedom",
    "routine_variability_learning": "learning_variability_freedom",
    "physical_access_body_load": "body_environment_freedom",
    "communication_instruction_translation": "information_translation_freedom",
    "social_contact_relationship": "social_participation_freedom",
    "support_practice_or_supervision": "support_coordination_freedom",
    "external_support_connection": "institutional_connection_freedom",
    "health_time_condition_management": "health_time_freedom",
    "commuting_daily_life": "life_commuting_freedom",
    "participation_satisfaction_quality": "evaluation_participation_freedom",
    "burden_management_risk": "management_burden_freedom",
    "agency_preference_boundary": "preference_disclosure_boundary_freedom",
}


STAGE_ROUTE_BY_TAG: dict[str, list[str]] = {
    "task_matching_assignment": ["C05-worksite-contact", "C07-quality-participation"],
    "task_content_concrete_work": ["C05-worksite-contact", "C07-quality-participation"],
    "task_complexity_quality_safety": ["C05-worksite-contact", "C07-quality-participation"],
    "pace_volume_time_pressure": ["C01-health-time", "C05-worksite-contact"],
    "routine_variability_learning": ["C05-worksite-contact", "C07-quality-participation"],
    "physical_access_body_load": ["C01-health-time", "C05-worksite-contact"],
    "communication_instruction_translation": ["C04-information-participation", "C05-worksite-contact"],
    "social_contact_relationship": ["C04-information-participation", "C07-quality-participation"],
    "support_practice_or_supervision": ["C03-support-continuity", "C05-worksite-contact"],
    "external_support_connection": ["C03-support-continuity", "C06-life-security"],
    "health_time_condition_management": ["C01-health-time", "C03-support-continuity"],
    "commuting_daily_life": ["C06-life-security"],
    "participation_satisfaction_quality": ["C07-quality-participation"],
    "burden_management_risk": ["C03-support-continuity", "C05-worksite-contact"],
    "agency_preference_boundary": ["C04-information-participation", "C07-quality-participation"],
}


def stable_hash(*parts: str | None) -> str:
    return sha256("|".join(part or "" for part in parts).encode("utf-8")).hexdigest()[:24]


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as src:
        for line in src:
            if line.strip():
                rows.append(json.loads(line))
    return rows


def tag_text(text: str) -> list[str]:
    tags = []
    for tag, keywords in TAG_RULES.items():
        if any(keyword in text for keyword in keywords):
            tags.append(tag)
    return sorted(tags)


def unit_route_tags(tags: list[str]) -> list[str]:
    routes: set[str] = set()
    for tag in tags:
        routes.update(STAGE_ROUTE_BY_TAG.get(tag, []))
    return sorted(routes)


def perspective_signature(units: list[dict[str, Any]]) -> dict[str, Any]:
    tag_counts: Counter[str] = Counter()
    route_counts: Counter[str] = Counter()
    role_counts: Counter[str] = Counter()
    source_columns: Counter[str] = Counter()
    sensitive_health_count = 0
    unit_ids: list[str] = []

    for unit in units:
        text = unit.get("redacted_unit_text", "")
        tags = tag_text(text)
        tag_counts.update(tags)
        route_counts.update(unit_route_tags(tags))
        role_counts[unit.get("field_role", "unknown")] += 1
        source_columns[str(unit.get("column", "unknown"))] += 1
        if unit.get("sensitive_health_text"):
            sensitive_health_count += 1
        unit_ids.append(unit["unit_id"])

    freedom_axes = sorted({TAG_TO_FREEDOM_AXIS[tag] for tag in tag_counts})
    return {
        "unit_count": len(units),
        "unit_ids": sorted(unit_ids),
        "tag_counts": dict(sorted(tag_counts.items())),
        "dominant_tags": [tag for tag, _count in tag_counts.most_common(6)],
        "freedom_axes": freedom_axes,
        "stage1_route_counts": dict(sorted(route_counts.items())),
        "field_role_counts": dict(sorted(role_counts.items())),
        "source_column_counts": dict(sorted(source_columns.items(), key=lambda item: int(item[0]) if item[0].isdigit() else 9999)),
        "sensitive_health_unit_count": sensitive_health_count,
    }


def contrast_axes(b_tags: set[str], c_tags: set[str], contrast_family: str) -> list[str]:
    axes: list[str] = []
    shared = b_tags & c_tags
    if shared:
        axes.append("shared_structural_surface")
    if {"task_content_concrete_work", "task_matching_assignment"} & shared:
        axes.append("shared_work_content_or_assignment_surface")
    if "support_practice_or_supervision" in b_tags and (
        {"agency_preference_boundary", "participation_satisfaction_quality", "health_time_condition_management"} & c_tags
    ):
        axes.append("support_practice_worker_need_translation_gap")
    if "communication_instruction_translation" in (b_tags ^ c_tags):
        axes.append("one_sided_information_translation_visibility")
    if "health_time_condition_management" in c_tags and "health_time_condition_management" not in b_tags:
        axes.append("worker_health_time_signal_less_visible_to_supervisor")
    if "health_time_condition_management" in b_tags and "health_time_condition_management" not in c_tags:
        axes.append("supervisor_health_time_signal_without_worker_need_pair")
    if "burden_management_risk" in b_tags and (
        {"agency_preference_boundary", "participation_satisfaction_quality"} & c_tags
    ):
        axes.append("management_burden_vs_worker_participation_axis")
    if "external_support_connection" in b_tags or "external_support_connection" in c_tags:
        axes.append("external_support_bridge_axis")
    if "physical_access_body_load" in b_tags or "physical_access_body_load" in c_tags:
        axes.append("body_environment_work_design_axis")
    if not axes:
        axes.append("low_signal_manual_review")
    if contrast_family == "B_C_work_content_narrative_contrast_candidate":
        axes.append("work_content_linked_reading")
    if contrast_family == "B_C_support_practice_need_narrative_contrast_candidate":
        axes.append("support_need_linked_reading")
    return sorted(set(axes))


def candidate_proposition(axes: list[str], contrast_family: str) -> dict[str, str]:
    if "support_practice_worker_need_translation_gap" in axes:
        proposition = (
            "支援実践の記述と本人側の必要・希望・参加感の記述が、同じ職場接点を扱いながら別の自由度を指している可能性がある。"
        )
        counter = "単に質問項目の違いによって語彙が分かれているだけで、実際の相互作用差ではない可能性がある。"
        review = "同一ペア内で、支援方法・情報伝達・健康時間・参加感がどの程度つながっているかを本文で確認する。"
    elif "worker_health_time_signal_less_visible_to_supervisor" in axes:
        proposition = "本人側に健康時間・体調管理の信号がある一方、職場側の仕事内容記述では見えにくい可能性がある。"
        counter = "職場側が別の選択式項目で把握しており、記述欄には出ていないだけの可能性がある。"
        review = "健康時間の信号が仕事内容・勤務時間・支援接続のどこに現れているかを確認する。"
    elif "shared_work_content_or_assignment_surface" in axes:
        proposition = "職場側と本人側が、少なくとも仕事内容・作業割当の同一表面を共有して記述している可能性がある。"
        counter = "同じ作業名を挙げていても、負荷・裁量・評価・満足の意味は異なる可能性がある。"
        review = "共有されているのが作業名なのか、負荷調整や参加の自由度まで含むのかを確認する。"
    elif "body_environment_work_design_axis" in axes:
        proposition = "身体負荷・作業環境・仕事設計が、職場側または本人側の記述で主要な接点になっている可能性がある。"
        counter = "身体・環境語は個別条件の記述にとどまり、仕事設計の構造差までは示していない可能性がある。"
        review = "身体機能、活動、作業環境、支援方法のどこが接続しているかを確認する。"
    elif contrast_family == "B_C_support_practice_need_narrative_contrast_candidate":
        proposition = "職場側の支援実践と本人側の必要・制度・参加感を対照できる候補である。"
        counter = "片側の記述密度が低く、対照ではなく単独記述の寄せ集めにとどまる可能性がある。"
        review = "支援実践と本人側ニーズの間に、時間・場所・情報・評価・生活保障の接点があるか確認する。"
    else:
        proposition = "職場側と本人側の仕事内容記述を対照できる候補である。"
        counter = "同一ペアでも、質問文の違いにより比較可能性が限定される可能性がある。"
        review = "仕事内容の一致・ずれ・不足情報を、支援妥当性判断なしで確認する。"
    return {
        "candidate_interaction_proposition": proposition,
        "counter_proposition": counter,
        "human_review_question": review,
    }


def load_units_by_id() -> dict[str, dict[str, Any]]:
    units: dict[str, dict[str, Any]] = {}
    with UNITS_JSONL.open("r", encoding="utf-8") as src:
        for line in src:
            if not line.strip():
                continue
            record = json.loads(line)
            units[record["unit_id"]] = record
    return units


def build_cards() -> list[dict[str, Any]]:
    units_by_id = load_units_by_id()
    source_cards = {card["card_id"]: card for card in load_jsonl(CARD_CANDIDATES_JSONL)}
    contrasts = [
        contrast
        for contrast in load_jsonl(LINKED_CANDIDATES_JSONL)
        if contrast["contrast_family"] in TARGET_CONTRAST_FAMILIES
    ]

    deep_cards: list[dict[str, Any]] = []
    for contrast in contrasts:
        perspective_units: dict[str, list[dict[str, Any]]] = {"B": [], "C": []}
        for card_id in contrast["source_card_ids"]:
            source_card = source_cards[card_id]
            table = source_card["source_table"]
            if table not in perspective_units:
                continue
            for unit_id in source_card["unit_ids"]:
                unit = units_by_id[unit_id]
                perspective_units[table].append(unit)

        b_signature = perspective_signature(perspective_units["B"])
        c_signature = perspective_signature(perspective_units["C"])
        b_tags = set(b_signature["tag_counts"])
        c_tags = set(c_signature["tag_counts"])
        axes = contrast_axes(b_tags, c_tags, contrast["contrast_family"])
        proposition = candidate_proposition(axes, contrast["contrast_family"])
        shared_tags = sorted(b_tags & c_tags)
        b_only_tags = sorted(b_tags - c_tags)
        c_only_tags = sorted(c_tags - b_tags)
        route_counts = Counter()
        route_counts.update(b_signature["stage1_route_counts"])
        route_counts.update(c_signature["stage1_route_counts"])
        route_counts.update(contrast.get("routes", []))

        deep_card_id = f"{DATASET_ID}:bc-linked-deep-card:{stable_hash(contrast['candidate_id'])}"
        deep_cards.append(
            {
                "dataset_id": DATASET_ID,
                "deep_card_id": deep_card_id,
                "source_contrast_id": contrast["candidate_id"],
                "contrast_family": contrast["contrast_family"],
                "pair_hash": contrast.get("pair_hash"),
                "establishment_hash": contrast.get("establishment_hash"),
                "perspectives": {
                    "B_supervisor_workplace": b_signature,
                    "C_worker": c_signature,
                },
                "shared_structural_tags": shared_tags,
                "B_only_structural_tags": b_only_tags,
                "C_only_structural_tags": c_only_tags,
                "contrast_axes": axes,
                "freedom_axes": sorted(set(b_signature["freedom_axes"]) | set(c_signature["freedom_axes"])),
                "stage1_route_counts": dict(sorted(route_counts.items())),
                "source_content_exported": False,
                "narrative_content_included": False,
                "review_status": "machine_structural_reading_unreviewed",
                "allowed_use": "SCIMA_FCHMA_pattern_candidate_preparation_only",
                "boundary": (
                    "No support validity, source validity, case judgment, employment judgment, current-policy claim, "
                    "knowledge promotion, public approval, or runtime approval."
                ),
                **proposition,
            }
        )
    return sorted(deep_cards, key=lambda card: (card["contrast_family"], card["deep_card_id"]))


def cell_key(card: dict[str, Any]) -> tuple[str, str, str]:
    primary_axes = [axis for axis in card["contrast_axes"] if not axis.endswith("_linked_reading")]
    if not primary_axes:
        primary_axes = ["low_signal_manual_review"]
    top_axis = primary_axes[0]
    top_route = max(card["stage1_route_counts"].items(), key=lambda item: (item[1], item[0]))[0]
    return card["contrast_family"], top_axis, top_route


def build_pattern_cells(cards: list[dict[str, Any]]) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for card in cards:
        groups[cell_key(card)].append(card)

    cells: list[dict[str, Any]] = []
    for (family, primary_axis, route), group in groups.items():
        axis_counts: Counter[str] = Counter()
        route_counts: Counter[str] = Counter()
        freedom_counts: Counter[str] = Counter()
        b_tag_counts: Counter[str] = Counter()
        c_tag_counts: Counter[str] = Counter()
        shared_counts: Counter[str] = Counter()

        for card in group:
            axis_counts.update(card["contrast_axes"])
            route_counts.update(card["stage1_route_counts"])
            freedom_counts.update(card["freedom_axes"])
            b_tag_counts.update(card["perspectives"]["B_supervisor_workplace"]["tag_counts"])
            c_tag_counts.update(card["perspectives"]["C_worker"]["tag_counts"])
            shared_counts.update(card["shared_structural_tags"])

        cell_id = f"{DATASET_ID}:bc-linked-pattern-cell:{stable_hash(family, primary_axis, route)}"
        review_samples = review_sample_ids(group)
        review_focus = (
            "対照が実際の相互作用を示すのか、質問項目差・記述密度差・片側欠測による見かけの差なのかを確認する。"
        )
        cells.append(
            {
                "dataset_id": DATASET_ID,
                "pattern_cell_id": cell_id,
                "source_contrast_family": family,
                "primary_contrast_axis": primary_axis,
                "primary_stage1_route": route,
                "card_count": len(group),
                "deep_card_ids": [card["deep_card_id"] for card in group],
                "review_sample_deep_card_ids": review_samples,
                "axis_counts": dict(sorted(axis_counts.items())),
                "stage1_route_counts": dict(sorted(route_counts.items())),
                "freedom_axis_counts": dict(sorted(freedom_counts.items())),
                "B_tag_counts": dict(sorted(b_tag_counts.items())),
                "C_tag_counts": dict(sorted(c_tag_counts.items())),
                "shared_tag_counts": dict(sorted(shared_counts.items())),
                "candidate_interaction_proposition": group[0]["candidate_interaction_proposition"],
                "counter_proposition": group[0]["counter_proposition"],
                "uncertainty": [
                    "machine structural reading only",
                    "deterministic lexical tags are not sufficient interpretation",
                    "redacted staging is not public-safe",
                    "2001 survey context predates current employment-duty and disability-policy environment",
                ],
                "overinterpretation_risk": [
                    "do not treat frequency as practical importance",
                    "do not infer support adequacy from either perspective",
                    "do not convert disability/condition labels into support rules",
                    "do not treat supervisor or worker perspective as final truth",
                ],
                "human_review_question": review_focus,
                "review_status": "pattern_cell_unreviewed",
                "source_content_exported": False,
                "narrative_content_included": False,
            }
        )
    return sorted(cells, key=lambda cell: (-cell["card_count"], cell["source_contrast_family"], cell["primary_contrast_axis"]))


def tag_total(card: dict[str, Any], side: str) -> int:
    return sum(card["perspectives"][side]["tag_counts"].values())


def shared_tag_total(card: dict[str, Any]) -> int:
    b_tags = card["perspectives"]["B_supervisor_workplace"]["tag_counts"]
    c_tags = card["perspectives"]["C_worker"]["tag_counts"]
    return sum(min(b_tags.get(tag, 0), c_tags.get(tag, 0)) for tag in set(b_tags) | set(c_tags))


def one_sided_tag_total(card: dict[str, Any]) -> int:
    return len(card["B_only_structural_tags"]) + len(card["C_only_structural_tags"])


def uncertainty_score(card: dict[str, Any]) -> int:
    score = 0
    if "low_signal_manual_review" in card["contrast_axes"]:
        score += 4
    score += abs(tag_total(card, "B_supervisor_workplace") - tag_total(card, "C_worker"))
    if not card["shared_structural_tags"]:
        score += 2
    return score


def top_ids(cards: list[dict[str, Any]], key, limit: int = 3, reverse: bool = True) -> list[str]:
    selected: list[str] = []
    for card in sorted(cards, key=key, reverse=reverse):
        if card["deep_card_id"] not in selected:
            selected.append(card["deep_card_id"])
        if len(selected) >= limit:
            break
    return selected


def review_sample_ids(cards: list[dict[str, Any]]) -> dict[str, list[str]]:
    return {
        "representative": top_ids(
            cards,
            key=lambda card: (shared_tag_total(card), len(card["freedom_axes"]), card["perspectives"]["B_supervisor_workplace"]["unit_count"] + card["perspectives"]["C_worker"]["unit_count"]),
        ),
        "boundary": top_ids(
            cards,
            key=lambda card: (len(card["freedom_axes"]), shared_tag_total(card), card["perspectives"]["B_supervisor_workplace"]["unit_count"] + card["perspectives"]["C_worker"]["unit_count"]),
            reverse=False,
        ),
        "one_sided_visibility": top_ids(cards, key=lambda card: (one_sided_tag_total(card), uncertainty_score(card))),
        "high_uncertainty": top_ids(cards, key=lambda card: (uncertainty_score(card), one_sided_tag_total(card))),
    }


def compact_counter(counter: dict[str, int], limit: int = 12) -> dict[str, int]:
    return dict(Counter(counter).most_common(limit))


def write_outputs(cards: list[dict[str, Any]], cells: list[dict[str, Any]]) -> None:
    with OUTPUT_CARDS_JSONL.open("w", encoding="utf-8") as out:
        for card in cards:
            out.write(json.dumps(card, ensure_ascii=False) + "\n")
    with OUTPUT_PATTERN_CELLS_JSONL.open("w", encoding="utf-8") as out:
        for cell in cells:
            out.write(json.dumps(cell, ensure_ascii=False) + "\n")

    family_counts = Counter(card["contrast_family"] for card in cards)
    axis_counts: Counter[str] = Counter()
    route_counts: Counter[str] = Counter()
    freedom_counts: Counter[str] = Counter()
    for card in cards:
        axis_counts.update(card["contrast_axes"])
        route_counts.update(card["stage1_route_counts"])
        freedom_counts.update(card["freedom_axes"])

    summary = {
        "dataset_id": DATASET_ID,
        "summary_id": "2001_ABC_survey_B_C_linked_narrative_deep_structure_summary_v0_2026_05_22",
        "status": "machine_structural_reading_no_text_unreviewed",
        "deep_structure_cards": str(OUTPUT_CARDS_JSONL.relative_to(REPO_ROOT)),
        "pattern_cells": str(OUTPUT_PATTERN_CELLS_JSONL.relative_to(REPO_ROOT)),
        "deep_card_count": len(cards),
        "pattern_cell_count": len(cells),
        "contrast_family_counts": dict(sorted(family_counts.items())),
        "contrast_axis_counts": dict(sorted(axis_counts.items())),
        "stage1_route_counts": dict(sorted(route_counts.items())),
        "freedom_axis_counts": dict(sorted(freedom_counts.items())),
        "top_pattern_cells": [
            {
                "pattern_cell_id": cell["pattern_cell_id"],
                "source_contrast_family": cell["source_contrast_family"],
                "primary_contrast_axis": cell["primary_contrast_axis"],
                "primary_stage1_route": cell["primary_stage1_route"],
                "card_count": cell["card_count"],
                "top_freedom_axes": compact_counter(cell["freedom_axis_counts"], 6),
                "review_sample_deep_card_ids": cell["review_sample_deep_card_ids"],
            }
            for cell in cells[:12]
        ],
        "source_content_exported": False,
        "narrative_content_exported_to_references": False,
        "review_status": "unreviewed",
        "boundary": [
            "No narrative text in references outputs.",
            "Staging cards contain ids and structural tags only, not narrative content.",
            "This is pattern-candidate preparation, not reviewed knowledge.",
            "No support validity, source validity, case judgment, public approval, or runtime approval.",
        ],
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# 2001 ABC Survey B/C Linked Narrative Deep Structure Summary",
        "",
        "作成日: 2026-05-22",
        "Lane: Falcon Lab",
        "状態: machine structural reading / no narrative text / 未レビュー / 統合なし / 昇格なし",
        "本文引用: なし",
        "",
        "## Outputs",
        "",
        f"- deep structure cards: `{summary['deep_structure_cards']}`",
        f"- pattern cells: `{summary['pattern_cells']}`",
        f"- deep card count: {len(cards)}",
        f"- pattern cell count: {len(cells)}",
        "",
        "## Contrast Families",
        "",
        "| family | cards |",
        "|---|---:|",
    ]
    for family, count in summary["contrast_family_counts"].items():
        lines.append(f"| `{family}` | {count} |")

    lines.extend(["", "## Dominant Contrast Axes", "", "| axis | cards |", "|---|---:|"])
    for axis, count in Counter(summary["contrast_axis_counts"]).most_common(14):
        lines.append(f"| `{axis}` | {count} |")

    lines.extend(["", "## Stage 1 Routes", "", "| route | weighted cards |", "|---|---:|"])
    for route, count in Counter(summary["stage1_route_counts"]).most_common():
        lines.append(f"| `{route}` | {count} |")

    lines.extend(["", "## Top Pattern Cells", "", "| cell | family | primary axis | route | cards |", "|---|---|---|---|---:|"])
    for cell in summary["top_pattern_cells"]:
        lines.append(
            f"| `{cell['pattern_cell_id']}` | `{cell['source_contrast_family']}` | "
            f"`{cell['primary_contrast_axis']}` | `{cell['primary_stage1_route']}` | {cell['card_count']} |"
        )

    lines.extend(
        [
            "",
            "## Reading Boundary",
            "",
            "- These are SCIMA/FCHMA pattern-candidate preparation artifacts.",
            "- They do not judge support adequacy, employer accuracy, worker accuracy, or source validity.",
            "- 2001年データの制度時代差を保持し、現在政策への直接主張には使わない。",
            "- Human review is required before any candidate pattern or reusable knowledge status.",
            "",
        ]
    )
    SUMMARY_MD.write_text("\n".join(lines), encoding="utf-8")

    pattern_lines = [
        "# 2001 ABC Survey B/C Linked Narrative Pattern Cells",
        "",
        "作成日: 2026-05-22",
        "Lane: Falcon Lab",
        "状態: pattern cells / no narrative text / 未レビュー",
        "本文引用: なし",
        "",
        "| pattern cell | cards | source family | primary axis | primary route | representative samples | review focus |",
        "|---|---:|---|---|---|---|---|",
    ]
    for cell in cells:
        samples = ", ".join(f"`{sample}`" for sample in cell["review_sample_deep_card_ids"]["representative"][:2])
        pattern_lines.append(
            f"| `{cell['pattern_cell_id']}` | {cell['card_count']} | `{cell['source_contrast_family']}` | "
            f"`{cell['primary_contrast_axis']}` | `{cell['primary_stage1_route']}` | {samples} | {cell['human_review_question']} |"
        )
    pattern_lines.extend(
        [
            "",
            "## Boundary",
            "",
            "- Pattern cells are grouping aids for human audit, not reviewed patterns.",
            "- Use the staging JSONL to select representative, boundary, exception, and counter cases when raw/redacted narrative access is authorized.",
            "",
        ]
    )
    PATTERN_MD.write_text("\n".join(pattern_lines), encoding="utf-8")


def main() -> None:
    cards = build_cards()
    cells = build_pattern_cells(cards)
    write_outputs(cards, cells)
    print(
        json.dumps(
            {
                "deep_card_count": len(cards),
                "pattern_cell_count": len(cells),
                "summary": str(SUMMARY_JSON.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
