#!/usr/bin/env python3
"""Build 2001 ABC triadic SCIMA/FCHMA synthesis cards.

This script consumes no-text derived profiles and emits no row-level content.
The cards are route-level synthesis aids, not reviewed knowledge objects.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
DATASET_ID = "2001_ABC_survey"
DERIVED_DIR = REPO_ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22"
QUALITY_DIR = REPO_ROOT / "data/specs/quality"

LINKAGE_PROFILE_JSON = QUALITY_DIR / "2001_ABC_survey.linkage-noise-profile-v0-2026-05-22.json"
AC_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-A-C-single-perspective-structure-profiles-v0-2026-05-22.json"
B_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-B-workplace-perspective-profile-v1-2026-05-22.json"
CATEGORY_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-category-aggregate-contrast-profile-v0-2026-05-22.json"
BC_SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-B-C-linked-narrative-deep-structure-summary-v0-2026-05-22.json"
A_LINKED_SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-A-linked-narrative-deep-structure-summary-v0-2026-05-22.json"
ABC_TRIAD_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-A-B-C-linked-structured-triad-profile-v0-2026-05-22.json"
NETWORK_MAP_JSON = DERIVED_DIR / "2001-abc-survey-falcon-network-nonchronological-integration-map-v0-2026-05-22.json"
CONDITION_WINDOW_DEEPENING_JSON = DERIVED_DIR / "2001-abc-survey-condition-window-interaction-deepening-v0-2026-05-23.json"
CONDITION_WINDOW_MOTIFS_MD = DERIVED_DIR / "2001-abc-survey-condition-window-network-motifs-v0-2026-05-23.md"
CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON = DERIVED_DIR / "2001-abc-survey-condition-window-narrative-motif-bridge-v0-2026-05-23.json"

OUTPUT_JSON = DERIVED_DIR / "2001-abc-survey-triadic-scima-fchma-synthesis-cards-v0-2026-05-22.json"
OUTPUT_MD = DERIVED_DIR / "2001-abc-survey-triadic-scima-fchma-synthesis-cards-v0-2026-05-22.md"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def by_key(rows: list[dict[str, Any]], key: str) -> dict[str, dict[str, Any]]:
    return {row[key]: row for row in rows}


def module_short_id(module_id: str) -> str:
    return module_id.split("-", 1)[0]


def compact_module(module: dict[str, Any]) -> dict[str, Any]:
    return {
        "module_id": module["module_id"],
        "label": module["label"],
        "query_routes": module["enriches_query_routes"],
        "first_principles": module["enriches_first_principles"],
        "evidence_window_types": [window.get("type", "unknown") for window in module["evidence_windows"]],
        "human_review_question": module["human_review_question"],
    }


def compact_top(items: list[dict[str, Any]], fields: list[str], limit: int = 5) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for item in items[:limit]:
        rows.append({field: item[field] for field in fields if field in item})
    return rows


def compact_condition_window_motif_bridge(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "motif_id": item["motif_id"],
        "title": item["title"],
        "matched_deep_card_count": item["matched_deep_card_count"],
        "matched_pattern_cell_count": item["matched_pattern_cell_count"],
        "top_specific_axes": list(item.get("top_specific_axes", {}))[:5],
        "bridge_reading": item["bridge_reading"],
        "condition_specificity_boundary": item["condition_specificity_boundary"],
    }


def c_support_by_category(ac_profile: dict[str, Any], category: str) -> dict[str, Any]:
    rows = by_key(ac_profile["C_worker_profile"]["support_need_usefulness_profiles"], "category")
    item = rows[category]
    return {
        "category": category,
        "usable_records": item["usable_records"],
        "any_need_or_usefulness": item["record_counts"]["any_need_or_usefulness"],
        "any_need_or_usefulness_rate": item["any_need_or_usefulness_rate"],
        "freedom_axis": item["freedom_axis"],
    }


def a_item_contains(ac_profile: dict[str, Any], source_key: str, term: str, limit: int = 4) -> list[dict[str, Any]]:
    fields_by_source = {
        "burden": (
            ac_profile["A_establishment_profile"]["burden_profiles"],
            ["item", "usable_records", "burden_or_expected_burden_any", "burden_or_expected_burden_rate"],
        ),
        "advice": (
            ac_profile["A_establishment_profile"]["external_advice_use_profiles"],
            ["item", "usable_records", "advice_or_external_use_present", "advice_or_external_use_rate"],
        ),
    }
    rows, fields = fields_by_source[source_key]
    filtered = [item for item in rows if term in item["item"]]
    return compact_top(filtered, fields, limit)


def b_support_by_category(b_profile: dict[str, Any], category: str) -> dict[str, Any]:
    rows = by_key(b_profile["support_group_profiles"], "category")
    item = rows[category]
    return {
        "category": category,
        "usable_records": item["usable_records"],
        "any_support_present": item["record_counts"]["any_support_present"],
        "any_supervisor_needed_but_not_present": item["record_counts"]["any_supervisor_needed_but_not_present"],
        "all_items_not_needed": item["record_counts"]["all_items_not_needed"],
    }


def b_constraint_by_category(b_profile: dict[str, Any], category: str) -> dict[str, Any]:
    rows = by_key(b_profile["occupational_life_constraint_profiles"], "category")
    item = rows[category]
    return {
        "category": category,
        "nonempty": item["nonempty"],
        "needed_any_constraint": item["needed_any_constraint"],
        "needed_any_constraint_rate": item["needed_any_constraint_rate"],
        "needed_serious_constraint_rate": item["needed_serious_constraint_rate"],
    }


def b_problem_block(b_profile: dict[str, Any], block: str) -> dict[str, Any]:
    rows = by_key(b_profile["task_contact_problem_block_profiles"], "block")
    item = rows[block]
    return {
        "block": block,
        "category": item["category"],
        "usable_records": item["usable_records"],
        "any_problem_resolved": item["record_counts"]["any_problem_resolved"],
        "any_problem_unresolved": item["record_counts"]["any_problem_unresolved"],
        "all_items_no_particular_problem": item["record_counts"]["all_items_no_particular_problem"],
    }


def category_gap(category_profile: dict[str, Any], category: str) -> dict[str, Any]:
    rows = by_key(category_profile["profiles"], "category")
    item = rows[category]
    return {
        "category": category,
        "usable_overlap_pairs": item["usable_overlap_pairs"],
        "worker_need_without_supervisor_support": item["worker_need_any_without_supervisor_support_any"],
        "worker_need_without_supervisor_support_rate": item["worker_need_any_without_supervisor_support_any_rate"],
        "supervisor_support_worker_unneeded_only": item["supervisor_support_any_worker_unneeded_only"],
        "supervisor_support_worker_unneeded_only_rate": item["supervisor_support_any_worker_unneeded_only_rate"],
    }


def route_union(modules: list[dict[str, Any]]) -> list[str]:
    counter: Counter[str] = Counter()
    for module in modules:
        counter.update(module["enriches_query_routes"])
    return sorted(counter)


def fp_union(modules: list[dict[str, Any]]) -> list[str]:
    counter: Counter[str] = Counter()
    for module in modules:
        counter.update(module["enriches_first_principles"])
    return sorted(counter)


def make_card(
    card_id: str,
    title: str,
    purpose: str,
    module_ids: list[str],
    modules_by_short: dict[str, dict[str, Any]],
    perspective_contribution: dict[str, str],
    scima_reading: dict[str, Any],
    fchma_reading: dict[str, Any],
    evidence_anchors: list[dict[str, Any]],
    counter_reading: str,
    human_review_question: str,
    status: str = "triadic_scima_fchma_synthesis_unreviewed_no_promotion",
) -> dict[str, Any]:
    modules = [modules_by_short[module_id] for module_id in module_ids]
    return {
        "card_id": card_id,
        "dataset_id": DATASET_ID,
        "status": status,
        "title": title,
        "purpose": purpose,
        "integration_level": "route_level_A_B_C_synthesis_not_individual_case_judgment",
        "active_network_modules": module_ids,
        "query_routes": route_union(modules),
        "first_principles": fp_union(modules),
        "perspective_contribution": perspective_contribution,
        "scima_reading": scima_reading,
        "fchma_reading": fchma_reading,
        "evidence_anchors": evidence_anchors,
        "module_anchors": [compact_module(module) for module in modules],
        "counter_reading": counter_reading,
        "human_review_question": human_review_question,
        "not_allowed": [
            "current-policy claim",
            "support adequacy decision",
            "worker capacity decision",
            "employer burden validity decision",
            "disease/disability-to-support lookup",
            "candidate_pattern movement",
            "reviewed knowledge promotion",
            "public/runtime approval",
        ],
        "source_content_exported": False,
        "narrative_content_included": False,
        "row_level_ids_exported": False,
        "review_status": "unreviewed",
    }


def build_cards(
    linkage: dict[str, Any],
    ac_profile: dict[str, Any],
    b_profile: dict[str, Any],
    category_profile: dict[str, Any],
    bc_summary: dict[str, Any],
    a_linked_summary: dict[str, Any],
    abc_triad_profile: dict[str, Any],
    network_map: dict[str, Any],
    condition_window_deepening: dict[str, Any],
    condition_window_narrative_bridge: dict[str, Any],
) -> list[dict[str, Any]]:
    modules_by_short = {module_short_id(module["module_id"]): module for module in network_map["modules"]}
    a_reasons = ac_profile["A_establishment_profile"]["employment_reason_profiles"]
    a_challenges = ac_profile["A_establishment_profile"]["employment_challenge_profiles"]
    c_work_targets = ac_profile["C_worker_profile"]["work_content_target_profile"]
    c_satisfaction = ac_profile["C_worker_profile"]["satisfaction_profile"]
    axis_counts = bc_summary["contrast_axis_counts"]
    family_counts = bc_summary["contrast_family_counts"]

    common_scima_boundary = {
        "source_limit": "A/B/C route-level synthesis; exact individual triad linkage is available as a source capability but not exported here.",
        "era_limit": "2001 evidence window; use structurally, not as current guidance.",
        "review_limit": "unreviewed; no candidate_pattern or reviewed knowledge movement.",
    }

    cards = [
        make_card(
            "2001-ABC-SCIMA-FCHMA-T01-work-content-contact-participation",
            "Work Content, Contact Point, Participation Quality",
            "仕事内容を職名や作業名ではなく、接触点、負荷、情報、評価、参加品質の束として読むための三者カード。",
            ["M01", "M02", "M07", "M10"],
            modules_by_short,
            {
                "A_establishment": "職場配置・教育訓練・給与労働条件・作業成績/雇用管理課題が、仕事内容を組織内の価値変換として見る窓を与える。",
                "B_supervisor": "C-1からC-4の作業接触点とD制約が、仕事内容を環境・操作・判断・情報・安全の接触点に分解する。",
                "C_worker": "仕事対象と満足度、支援必要/有用性が、本人側の参加品質と自由度の窓を与える。",
                "B_C_linked": "共有される作業語彙が同じ仕事設計を意味しない可能性を、B/C記述対比が示す。",
            },
            {
                **common_scima_boundary,
                "common_structure": "same task surface can hide different work-design meaning",
                "interaction_chain": ["task label", "contact point", "load and information", "support translation", "evaluation and participation quality"],
                "condition_window_role": "障害種類は仕事内容の説明原因ではなく、接触点の現れ方を見る条件窓。",
            },
            {
                "function_activity_participation": "活動の可否ではなく、活動がどの参加品質に変換されるかを読む。",
                "environment_and_tools": "設備・表示・操作具・安全・手順を仕事設計の単位として扱う。",
                "agency_freedom": ["work_content_freedom", "information_translation_freedom", "load_quality_safety_freedom"],
            },
            [
                {"type": "B_problem_blocks", "blocks": [b_problem_block(b_profile, block) for block in ["C-1", "C-2", "C-3", "C-4"]]},
                {"type": "C_work_target_signals", "items": compact_top(c_work_targets, ["item", "usable_records", "yes", "yes_rate"], 3)},
                {"type": "B_C_narrative_axes", "shared_structural_surface": axis_counts.get("shared_structural_surface", 0), "shared_work_content_or_assignment_surface": axis_counts.get("shared_work_content_or_assignment_surface", 0)},
            ],
            "作業語彙の一致は、調査票設計、職場語彙、記述粒度の一致であって、同一の仕事設計や同一の自由度を意味しない可能性がある。",
            "同じ仕事内容に見えるものは、どの接触点と参加品質で分岐しているか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T02-support-retranslation",
            "Support As Retranslation, Not Presence",
            "配慮・支援を、ある/ないではなく、仕事・情報・健康時間・生活接続・評価を再翻訳する機能として読むカード。",
            ["M03", "M04", "M05", "M09", "M10"],
            modules_by_short,
            {
                "A_establishment": "負担感・外部助言利用は、組織側で翻訳コストが発生する場所を示す。",
                "B_supervisor": "支援実施・必要だが未実施・不要の三状態が、職場側の支援解釈を分ける。",
                "C_worker": "本人側の必要/有用性は、支援の存在ではなく、支援が本人側の自由度に変換されるかを示す。",
                "B_C_linked": "同じ支援領域でも、上司側実施/不要と本人側必要/有用性のズレが観測される。",
            },
            {
                **common_scima_boundary,
                "common_structure": "support works when it translates a constraint into a usable work procedure or choice",
                "interaction_chain": ["need signal", "workplace interpretation", "support form", "usefulness for worker", "feedback loop"],
                "missing_context": "支援が有効/無効な理由は、行レベルの文脈・実施結果・本人評価のレビューなしに確定しない。",
            },
            {
                "support_system": "支援は個別項目ではなく、仕事・情報・時間・評価への翻訳機能として索引化する。",
                "health_time": "健康時間・疲労・通院・休憩は、支援機能の主要な翻訳対象。",
                "learning_loop": "ズレは正誤ではなく、追加確認と実装学習の入口。",
            },
            [
                {"type": "category_gaps", "items": [category_gap(category_profile, category) for category in ["health_time_self_care", "information_communication", "training_skill_education", "within_workplace_mobility"]]},
                {
                    "type": "strict_A_B_C_coded_triad_profile",
                    "pair_count": abc_triad_profile["strict_A_B_C_pair_count"],
                    "profiles": [
                        {
                            "category": item["category"],
                            "A_burden_rate": item["A_burden_or_expected_burden_rate"],
                            "B_support_rate": item["B_support_present_rate"],
                            "C_need_rate": item["C_need_or_usefulness_rate"],
                            "A_burden_and_C_need_without_B_support": item["A_burden_and_C_need_without_B_support"],
                        }
                        for item in abc_triad_profile["profiles"]
                    ],
                },
                {"type": "B_support_groups", "items": [b_support_by_category(b_profile, category) for category in ["health_time_self_care_environment", "information_communication", "training_skill_education", "within_workplace_mobility"]]},
                {"type": "C_support_groups", "items": [c_support_by_category(ac_profile, category) for category in ["health_time_self_care_environment", "information_communication", "training_skill_education", "within_workplace_mobility"]]},
            ],
            "B/Cのズレは、どちらかの誤りではなく、調査票項目の意味差、実施状況、本人の受け取り、職場側の見え方、時代背景の差で生じうる。",
            "支援項目は何を再翻訳しており、その翻訳がどちらの視点で見えているか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T03-health-time-work-design",
            "Health Time As Work Design",
            "体調・健康管理・勤務時間・休憩・通院・疲労を、個人属性ではなく仕事設計の時間軸として読むカード。",
            ["M05", "M03", "M06", "M10"],
            modules_by_short,
            {
                "A_establishment": "健康管理の負担感と外部助言利用は、組織側で健康時間をどう扱っているかの窓になる。",
                "B_supervisor": "健康管理・環境調整・出勤/時間信頼性制約が、職場側の時間設計認識を示す。",
                "C_worker": "健康時間・セルフケア・環境支援の必要/有用性が本人側で高く出る。",
                "B_C_linked": "健康時間シグナルは一方の視点でだけ可視化される場合がある。",
            },
            {
                **common_scima_boundary,
                "common_structure": "health-time signal becomes work design only when connected to task, schedule, rest, environment, support, and evaluation",
                "interaction_chain": ["body condition", "time/load fluctuation", "work schedule and task demand", "support translation", "participation continuity"],
            },
            {
                "health_time": "健康時間を、勤務時間・負荷・休憩・医療/生活接続・評価の相互作用として読む。",
                "agency_freedom": ["time_freedom", "rest_freedom", "health_management_freedom", "continuity_freedom"],
                "context_environment": "職場環境と生活環境の境界をまたぐ。",
            },
            [
                {"type": "A_health_management_burden", "items": a_item_contains(ac_profile, "burden", "健康管理")},
                {"type": "A_health_management_advice", "items": a_item_contains(ac_profile, "advice", "健康管理")},
                {"type": "B_constraint", "item": b_constraint_by_category(b_profile, "regular_attendance_time_reliability")},
                {"type": "C_support", "item": c_support_by_category(ac_profile, "health_time_self_care_environment")},
                {"type": "B_C_narrative_axes", "worker_health_time_signal_less_visible_to_supervisor": axis_counts.get("worker_health_time_signal_less_visible_to_supervisor", 0), "supervisor_health_time_signal_without_worker_need_pair": axis_counts.get("supervisor_health_time_signal_without_worker_need_pair", 0)},
            ],
            "健康管理の数値は、健康時間が十分設計されていることも不足していることも単独では示さない。",
            "健康時間は、どの仕事要求・支援機能・評価境界と結びつくと参加継続の自由度になるか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T04-information-procedure-disclosure",
            "Information As Procedure And Disclosure Boundary",
            "説明・表示・マニュアル・相談・啓発・開示を、単なる情報提供ではなく仕事手順化と境界設計として読むカード。",
            ["M04", "M02", "M03", "M09"],
            modules_by_short,
            {
                "A_establishment": "管理職/従業員啓発、支援機器、外部助言が、情報を組織手順へ変換する窓になる。",
                "B_supervisor": "情報提示・意思交換・作業手順の支援/制約が、手順化の職場側状態を示す。",
                "C_worker": "情報・コミュニケーション支援の必要/有用性が、本人側の理解・選択・参加の自由度を示す。",
                "B_C_linked": "一方通行の情報や、見えていない翻訳ギャップが記述対比で現れる。",
            },
            {
                **common_scima_boundary,
                "common_structure": "information support matters when it becomes repeatable work procedure, responsibility boundary, and disclosure design",
                "interaction_chain": ["information format", "procedure", "responsibility", "disclosure boundary", "feedback"],
            },
            {
                "information_translation": "情報保障を、見える/聞こえるから、仕事として使える手順へ拡張して読む。",
                "disclosure_boundary": "開示は情報量ではなく、誰が何を知る必要があるかの境界設計。",
                "support_system": "啓発・相談・マニュアル・支援機器を同じ翻訳系に置く。",
            },
            [
                {"type": "A_awareness_burden", "items": a_item_contains(ac_profile, "burden", "啓発")},
                {"type": "A_awareness_advice", "items": a_item_contains(ac_profile, "advice", "啓発")},
                {"type": "B_support", "item": b_support_by_category(b_profile, "information_communication")},
                {"type": "B_constraint", "item": b_constraint_by_category(b_profile, "communication_information_exchange")},
                {"type": "C_support", "item": c_support_by_category(ac_profile, "information_communication")},
                {"type": "B_C_narrative_axis", "one_sided_information_translation_visibility": axis_counts.get("one_sided_information_translation_visibility", 0)},
            ],
            "情報支援の有無は、本人にとって使える手順になっているか、職場の責任境界に組み込まれているかを単独では示さない。",
            "情報はどこで仕事手順・責任分担・開示境界に変換されているか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T05-life-security-offwork-bridge",
            "Life Security And Off-Work Bridge",
            "通勤、家族・学校・福祉、勤務時間外生活、自立生活支援を、仕事外ノイズではなく就労選択の自由度として読むカード。",
            ["M06", "M05", "M09", "M10"],
            modules_by_short,
            {
                "A_establishment": "勤務時間外の自立生活支援、家族/学校/福祉連携、給与労働条件が、生活保障と仕事継続の接続を示す。",
                "B_supervisor": "通勤・日常生活・外部支援の職場側支援状態が、仕事外接続を職場がどう扱うかの窓になる。",
                "C_worker": "通勤・勤務外生活支援の必要/有用性が、本人側の選択自由度を示す。",
                "B_C_linked": "外部支援ブリッジは、職場内支援だけでは見えない参加条件を示す。",
            },
            {
                **common_scima_boundary,
                "common_structure": "off-work conditions shape work choice, continuity, return, and disclosure boundaries",
                "interaction_chain": ["life condition", "commuting or daily living bridge", "work schedule/task", "support coordination", "participation continuity"],
            },
            {
                "life_security": "生活保障を背景要因ではなく、仕事選択・継続・離脱・復帰の自由度として扱う。",
                "agency_freedom": ["commuting_freedom", "daily_living_freedom", "life_security_freedom"],
                "support_system": "家族・学校・福祉・外部機関との接続を支援機能として索引化する。",
            },
            [
                {"type": "A_life_burden", "items": a_item_contains(ac_profile, "burden", "勤務時間外")},
                {"type": "A_family_welfare_advice", "items": a_item_contains(ac_profile, "advice", "家族や学校・福祉施設")},
                {"type": "B_support", "items": [b_support_by_category(b_profile, "commuting"), b_support_by_category(b_profile, "offwork_daily_living")]},
                {"type": "C_support", "items": [c_support_by_category(ac_profile, "commuting"), c_support_by_category(ac_profile, "offwork_daily_living")]},
                {"type": "B_C_narrative_axis", "external_support_bridge_axis": axis_counts.get("external_support_bridge_axis", 0)},
            ],
            "生活・通勤・家族連携の信号は、職場が担うべき範囲を自動的に決めない。支援境界の設計問題として扱う必要がある。",
            "生活保障・通勤・外部支援は、どの就労選択の自由度を開閉しているか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T06-participation-quality-evaluation",
            "Participation Quality And Evaluation",
            "継続就労だけでなく、生産性、役割、満足度、評価、キャリア、職場関係を参加品質として読むカード。",
            ["M07", "M01", "M03", "M10"],
            modules_by_short,
            {
                "A_establishment": "社会的責務、生産性、雇用管理負担、作業成績課題が、雇用の価値変換と評価境界を示す。",
                "B_supervisor": "生産性、理解/知識応用、人間関係制約が、職場側の参加品質認識を示す。",
                "C_worker": "満足度と支援有用性は、仕事に留まること以上の参加品質の窓になる。",
                "B_C_linked": "管理負担と本人参加は、同じ出来事を異なる価値語彙で読んでいる可能性がある。",
            },
            {
                **common_scima_boundary,
                "common_structure": "employment participation deepens when performance becomes recognized value, role, satisfaction, and future option",
                "interaction_chain": ["task execution", "support and environment", "performance recognition", "satisfaction/role", "future participation option"],
            },
            {
                "participation": "雇用継続を最低線とし、役割・満足・評価・将来可能性まで読む。",
                "meaning_evaluation": "作業成績と生産性を、価値変換と評価境界の問題として扱う。",
                "agency_freedom": ["role_freedom", "evaluation_freedom", "career_freedom"],
            },
            [
                {"type": "A_employment_reasons", "items": compact_top(a_reasons, ["item", "usable_records", "agree_or_tend_agree", "agree_or_tend_agree_rate"], 4)},
                {"type": "A_employment_challenges", "items": compact_top(a_challenges, ["item", "usable_records", "agree_or_tend_agree", "agree_or_tend_agree_rate"], 4)},
                {"type": "B_constraints", "items": [b_constraint_by_category(b_profile, category) for category in ["productivity_in_task_execution", "understanding_knowledge_application", "interpersonal_relations_at_work"]]},
                {"type": "C_satisfaction", "item": {k: c_satisfaction[k] for k in ["usable_records", "satisfied_or_very_satisfied", "satisfied_or_very_satisfied_rate", "dissatisfied_or_not_satisfied", "dissatisfied_or_not_satisfied_rate"]}},
                {"type": "B_C_narrative_axis", "management_burden_vs_worker_participation_axis": axis_counts.get("management_burden_vs_worker_participation_axis", 0)},
            ],
            "満足度や生産性は、単独では良い支援や良い雇用の証明にならない。評価基準、選択肢、負荷、生活条件と一緒に読む必要がある。",
            "参加品質は、作業遂行からどのように価値・役割・将来可能性へ変換されているか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T07-worksite-contact-atlas",
            "Worksite Contact Atlas",
            "建築物、作業設備、支援機器、安全、操作、表示、環境を、障害名ではなく接触点単位で読むカード。",
            ["M02", "M01", "M05", "M09", "M10"],
            modules_by_short,
            {
                "A_establishment": "建築物・作業設備・支援機器・安全面の負担/助言が、組織側接触点を示す。",
                "B_supervisor": "情報提示、判断/記憶/測定、操作/把持/レイアウト、警告/危険/避難のブロックが接触点を細分化する。",
                "C_worker": "職場内移動、緊急時、身体環境、健康時間の必要/有用性が本人側の接触自由度を示す。",
                "B_C_linked": "身体環境と仕事設計の軸が記述対比で現れる。",
            },
            {
                **common_scima_boundary,
                "common_structure": "workplace design is read at contact points, not diagnosis categories",
                "interaction_chain": ["built environment", "tool/interface", "task demand", "safety contingency", "participation consequence"],
            },
            {
                "environment_and_tools": "接触点を建築物・作業設備・支援機器・情報提示・安全導線に分解する。",
                "agency_freedom": ["mobility_freedom", "operation_freedom", "safety_freedom", "information_access_freedom"],
                "condition_window": "条件窓は接触点の出方を比較するために使う。",
            },
            [
                {"type": "A_built_environment_burden", "items": a_item_contains(ac_profile, "burden", "建築物")},
                {"type": "A_equipment_burden", "items": a_item_contains(ac_profile, "burden", "支援機器") + a_item_contains(ac_profile, "burden", "作業設備")},
                {"type": "B_problem_blocks", "blocks": [b_problem_block(b_profile, block) for block in ["C-1", "C-2", "C-3", "C-4"]]},
                {"type": "C_support", "items": [c_support_by_category(ac_profile, "within_workplace_mobility"), c_support_by_category(ac_profile, "emergency_disaster")]},
                {"type": "B_C_narrative_axis", "body_environment_work_design_axis": axis_counts.get("body_environment_work_design_axis", 0)},
            ],
            "接触点の頻度や負担感は、現在必要な設計水準や配慮妥当性を直接示さない。",
            "この仕事で自由度を開閉している接触点は、建物・道具・情報・安全・身体環境のどこか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T08-condition-window-interaction-layer",
            "Condition Window Interaction Layer",
            "病名・障害名・程度・機能障害を、配慮検索キーではなく、相互作用の機序・接触点・自由度差を探す条件変数として扱うカード。",
            ["M08", "M02", "M10"],
            modules_by_short,
            {
                "A_establishment": "A票は事業所単位の組織条件を示し、条件窓別の職場構成・負担・助言文脈を補助的に読む材料になる。",
                "B_supervisor": "B票は職場側の障害/程度/補助具窓を含み、B/C不一致をQAしながら接触点差の探索に使う。",
                "C_worker": "C票は詳細な機能障害・回答方法・代理回答窓を含み、本人側の支援必要/有用性や参加品質との関係を機序経由で読む。",
                "B_C_linked": "障害/程度の一致・不一致は、条件窓QAと代替説明を伴う相互作用仮説として扱い、決定論にはしない。",
            },
            {
                **common_scima_boundary,
                "common_structure": "same interaction structure may appear through different condition windows",
                "interaction_chain": ["condition window", "contact-point variation", "support translation", "participation consequence"],
                "promotion_boundary": "condition-window associations may be analyzed as unreviewed interaction hypotheses; deterministic rules and reusable pattern claims require coded-value QA and human review.",
            },
            {
                "condition_window": "病名・障害名・程度・回答方法は、説明原因そのものではなく、機能・活動・仕事要求・環境・時間・支援・評価との相互作用を読む条件変数。",
                "bias_risk": "身体障害・知的障害中心、精神障害雇用義務前、難病なしという時代/サンプル偏りを保持する。",
                "agency_freedom": ["contact_variation_discovery", "minority_window_discovery"],
            },
            [
                {"type": "linkage_counts", "summary": linkage["linkage_summary"]},
                {"type": "B_C_consistency", "summary": linkage["BC_consistency"]},
                {"type": "C_condition_window_status", "status": ac_profile["C_worker_profile"]["condition_window_profile"]["status"]},
                {
                    "type": "condition_window_interaction_deepening",
                    "condition_window_profile_count": condition_window_deepening["condition_window_profile_count"],
                    "interaction_card_count": condition_window_deepening["interaction_card_count"],
                    "linked_B_C_pair_count": condition_window_deepening["linked_B_C_pair_count"],
                    "top_condition_window_cards": [
                        {
                            "card_id": card["card_id"],
                            "condition_window": card["condition_window"],
                            "signal_kind": card["signal_kind"],
                            "routes": card["routes"],
                            "freedom_axes": card["freedom_axes"],
                        }
                        for card in condition_window_deepening["interaction_cards"][:8]
                    ],
                },
                {
                    "type": "condition_window_network_motifs",
                    "artifact": str(CONDITION_WINDOW_MOTIFS_MD.relative_to(REPO_ROOT)),
                    "motif_count": 8,
                    "motif_ids": ["CW-M01", "CW-M02", "CW-M03", "CW-M04", "CW-M05", "CW-M06", "CW-M07", "CW-M08"],
                },
                {
                    "type": "condition_window_narrative_motif_bridge",
                    "artifact": str(CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON.relative_to(REPO_ROOT)),
                    "motif_bridge_count": condition_window_narrative_bridge["motif_bridge_count"],
                    "deep_card_counts": condition_window_narrative_bridge["deep_card_counts"],
                    "pattern_cell_counts": condition_window_narrative_bridge["pattern_cell_counts"],
                    "motif_bridges": [
                        compact_condition_window_motif_bridge(item)
                        for item in condition_window_narrative_bridge["motif_bridges"]
                    ],
                    "bridge_boundary": "Narrative motif matches test mechanism plausibility; they do not prove condition-window truth or authorize condition-to-support lookup.",
                },
            ],
            "条件窓の差は、制度時代、調査票、回答者、リンク不一致、サンプル構成の影響を受けるため、単純な病名/障害名因果では閉じない。",
            "条件窓の違いは、どの機能・活動・接触点・自由度・支援翻訳の違いとして現れ、どの代替説明が残るか。",
        ),
        make_card(
            "2001-ABC-SCIMA-FCHMA-T09-narrative-expansion-route",
            "Narrative Expansion Route",
            "A/B/C記述回答を、本文引用なし・個人情報なしで、今後の深読みに接続するための構造カード。",
            ["M01", "M03", "M04", "M05", "M06", "M07"],
            modules_by_short,
            {
                "A_establishment": "A票には相談内容、雇用理由/課題、留意事項、定着推進など、従来にない組織側記述がある。",
                "B_supervisor": "B票には具体的職種、作業内容、支援、外部機関、課題/ニーズの職場側記述がある。",
                "C_worker": "C票には仕事内容、支援方法、自由記述、診断名等の本人側記述があるが、診断名は特別境界を要する。",
                "B_C_linked": "B/C記述対比はすでに構造候補を生成しており、A記述を足すと組織側翻訳コストが増える。",
            },
            {
                **common_scima_boundary,
                "common_structure": "narrative evidence should be decomposed into route, mechanism, freedom axis, missing context, and counter-reading",
                "interaction_chain": ["raw narrative", "redaction", "card seed", "single/linked contrast", "human review candidate"],
                "missing_context": "A記述の深読みにより、B/Cだけでは見えない組織側・制度接続側の機構が増える可能性がある。",
            },
            {
                "evidence_method": "本文はstaging内に隔離し、derivedには構造要約のみ出す。",
                "learning_loop": "記述深読みによる新規構造は、レビュー前は候補に留める。",
                "bias_risk": "診断名・その他記述・相談先はPII/センシティブ混入リスクを保持する。",
            },
            [
                {"type": "narrative_family_counts", "B_C_work_content_contrasts": family_counts.get("B_C_work_content_narrative_contrast_candidate", 0), "B_C_support_need_contrasts": family_counts.get("B_C_support_practice_need_narrative_contrast_candidate", 0)},
                {
                    "type": "A_linked_narrative_deep_structure",
                    "deep_card_count": a_linked_summary["deep_card_count"],
                    "pattern_cell_count": a_linked_summary["pattern_cell_count"],
                    "contrast_family_counts": a_linked_summary["contrast_family_counts"],
                    "top_contrast_axes": dict(Counter(a_linked_summary["contrast_axis_counts"]).most_common(8)),
                },
                {"type": "open_text_field_counts_available", "fields": len(linkage["open_text_and_sensitive_field_counts"])},
                {"type": "sensitive_boundary", "diagnosis_text": "C問9 is sensitive health text and remains non-exported"},
            ],
            "記述回答の多さは、そのまま知識の厚みではない。重複、時代語彙、個別事情、PII混入、調査票誘導を分離する必要がある。",
            "A/B/C記述のどの部分が、既存モジュールを厚くし、どの部分は新モジュール化すべきか。",
        ),
    ]
    primary_routes = {
        "2001-ABC-SCIMA-FCHMA-T01-work-content-contact-participation": [
            "QR-03-worksite-contact-and-mobility",
            "QR-07-quality-career-and-value-translation",
            "QR-08-diversity-conditioned-same-structure",
        ],
        "2001-ABC-SCIMA-FCHMA-T02-support-retranslation": [
            "QR-06-disclosure-boundary-and-mutual-translation",
            "QR-07-quality-career-and-value-translation",
            "QR-01-health-time-work-design",
        ],
        "2001-ABC-SCIMA-FCHMA-T03-health-time-work-design": [
            "QR-01-health-time-work-design",
            "QR-04-life-security-sequencing",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "2001-ABC-SCIMA-FCHMA-T04-information-procedure-disclosure": [
            "QR-02-information-work-procedure",
            "QR-06-disclosure-boundary-and-mutual-translation",
            "QR-03-worksite-contact-and-mobility",
        ],
        "2001-ABC-SCIMA-FCHMA-T05-life-security-offwork-bridge": [
            "QR-04-life-security-sequencing",
            "QR-05-entry-prework-translation",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "2001-ABC-SCIMA-FCHMA-T06-participation-quality-evaluation": [
            "QR-07-quality-career-and-value-translation",
            "QR-03-worksite-contact-and-mobility",
            "QR-02-information-work-procedure",
        ],
        "2001-ABC-SCIMA-FCHMA-T07-worksite-contact-atlas": [
            "QR-03-worksite-contact-and-mobility",
            "QR-02-information-work-procedure",
            "QR-08-diversity-conditioned-same-structure",
        ],
        "2001-ABC-SCIMA-FCHMA-T08-condition-window-interaction-layer": [
            "QR-08-diversity-conditioned-same-structure",
            "QR-03-worksite-contact-and-mobility",
        ],
        "2001-ABC-SCIMA-FCHMA-T09-narrative-expansion-route": [
            "QR-02-information-work-procedure",
            "QR-03-worksite-contact-and-mobility",
            "QR-06-disclosure-boundary-and-mutual-translation",
            "QR-07-quality-career-and-value-translation",
        ],
    }
    primary_first_principles = {
        "2001-ABC-SCIMA-FCHMA-T01-work-content-contact-participation": [
            "FP-02-same-structure-open-closed",
            "FP-05-work-contact-points-are-the-design-unit",
            "FP-10-evaluation-converts-performance-to-value",
        ],
        "2001-ABC-SCIMA-FCHMA-T02-support-retranslation": [
            "FP-07-support-is-retranslation-not-presence",
            "FP-12-learning-loop-over-answer-delivery",
            "FP-02-same-structure-open-closed",
        ],
        "2001-ABC-SCIMA-FCHMA-T03-health-time-work-design": [
            "FP-03-health-time-is-work-design",
            "FP-07-support-is-retranslation-not-presence",
            "FP-08-life-security-shapes-choice",
        ],
        "2001-ABC-SCIMA-FCHMA-T04-information-procedure-disclosure": [
            "FP-04-information-must-become-work-procedure",
            "FP-06-disclosure-is-boundary-design",
            "FP-05-work-contact-points-are-the-design-unit",
        ],
        "2001-ABC-SCIMA-FCHMA-T05-life-security-offwork-bridge": [
            "FP-08-life-security-shapes-choice",
            "FP-09-participation-has-depth-and-before-entry",
            "FP-07-support-is-retranslation-not-presence",
        ],
        "2001-ABC-SCIMA-FCHMA-T06-participation-quality-evaluation": [
            "FP-09-participation-has-depth-and-before-entry",
            "FP-10-evaluation-converts-performance-to-value",
            "FP-02-same-structure-open-closed",
        ],
        "2001-ABC-SCIMA-FCHMA-T07-worksite-contact-atlas": [
            "FP-05-work-contact-points-are-the-design-unit",
            "FP-04-information-must-become-work-procedure",
            "FP-11-minority-windows-are-discovery-windows",
        ],
        "2001-ABC-SCIMA-FCHMA-T08-condition-window-interaction-layer": [
            "FP-01-interaction-before-attribute",
            "FP-05-work-contact-points-are-the-design-unit",
            "FP-11-minority-windows-are-discovery-windows",
        ],
        "2001-ABC-SCIMA-FCHMA-T09-narrative-expansion-route": [
            "FP-02-same-structure-open-closed",
            "FP-07-support-is-retranslation-not-presence",
            "FP-12-learning-loop-over-answer-delivery",
        ],
    }
    for card in cards:
        card["query_routes"] = primary_routes[card["card_id"]]
        card["first_principles"] = primary_first_principles[card["card_id"]]
    return cards


def build_outputs() -> dict[str, Any]:
    linkage = load_json(LINKAGE_PROFILE_JSON)
    ac_profile = load_json(AC_PROFILE_JSON)
    b_profile = load_json(B_PROFILE_JSON)
    category_profile = load_json(CATEGORY_PROFILE_JSON)
    bc_summary = load_json(BC_SUMMARY_JSON)
    a_linked_summary = load_json(A_LINKED_SUMMARY_JSON)
    abc_triad_profile = load_json(ABC_TRIAD_PROFILE_JSON)
    network_map = load_json(NETWORK_MAP_JSON)
    condition_window_deepening = load_json(CONDITION_WINDOW_DEEPENING_JSON)
    condition_window_narrative_bridge = load_json(CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON)
    cards = build_cards(
        linkage,
        ac_profile,
        b_profile,
        category_profile,
        bc_summary,
        a_linked_summary,
        abc_triad_profile,
        network_map,
        condition_window_deepening,
        condition_window_narrative_bridge,
    )

    route_counter: Counter[str] = Counter()
    fp_counter: Counter[str] = Counter()
    for card in cards:
        if card["status"].startswith("prepared_hold"):
            continue
        route_counter.update(card["query_routes"])
        fp_counter.update(card["first_principles"])

    return {
        "dataset_id": DATASET_ID,
        "artifact_id": "2001_ABC_survey_triadic_scima_fchma_synthesis_cards_v0_2026_05_22",
        "status": "triadic_synthesis_cards_unreviewed_no_promotion_no_runtime_approval",
        "lane": "Falcon Lab",
        "source_layers_used": [
            str(LINKAGE_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(AC_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(B_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(CATEGORY_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(BC_SUMMARY_JSON.relative_to(REPO_ROOT)),
            str(A_LINKED_SUMMARY_JSON.relative_to(REPO_ROOT)),
            str(ABC_TRIAD_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(NETWORK_MAP_JSON.relative_to(REPO_ROOT)),
            str(CONDITION_WINDOW_DEEPENING_JSON.relative_to(REPO_ROOT)),
            str(CONDITION_WINDOW_MOTIFS_MD.relative_to(REPO_ROOT)),
            str(CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON.relative_to(REPO_ROOT)),
        ],
        "scope": {
            "completed": [
                "A/B/C no-text route-level synthesis cards",
                "SCIMA/FCHMA structural reading fields",
                "Falcon query-route and first-principle anchors",
                "counter-reading and human-review question per card",
            ],
            "not_completed_or_not_allowed": [
                "raw narrative text export",
                "individual case judgment",
                "support adequacy or source-validity decision",
                "deterministic condition-window rules or pattern promotion",
                "current-policy claim",
                "public/runtime approval",
            ],
        },
        "linkage_summary": linkage["linkage_summary"],
        "card_count": len(cards),
        "active_synthesis_card_count": sum(1 for card in cards if not card["status"].startswith("prepared_hold")),
        "prepared_hold_card_count": sum(1 for card in cards if card["status"].startswith("prepared_hold")),
        "query_route_counts": dict(sorted(route_counter.items())),
        "first_principle_counts": dict(sorted(fp_counter.items())),
        "cards": cards,
        "source_content_exported": False,
        "narrative_content_included": False,
        "row_level_ids_exported": False,
        "review_status": "unreviewed",
    }


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# 2001 ABC Survey Triadic SCIMA/FCHMA Synthesis Cards",
        "",
        "作成日: 2026-05-22",
        "Lane: Falcon Lab",
        "状態: A/B/C synthesis cards / no narrative text / 未レビュー / 昇格なし / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、2001年ABC調査をFalcon専門知識ネットワークに統合するための、A/B/C三者構造カードである。個別ケース判定ではなく、A票の事業所・人事労務窓、B票の職場上司/職場接触点窓、C票の本人側ニーズ/参加品質窓を、SCIMA/FCHMAの構造読みに接続する。",
        "",
        "時系列的な「2001年知識」としてではなく、非時系列の構造 evidence window として使う。",
        "",
        "## Linkage Frame",
        "",
        f"- A/B/C linked pairs: {data['linkage_summary']['link_class_counts'].get('A_B_C', 0)}",
        f"- A/C without B: {data['linkage_summary']['link_class_counts'].get('A_C_no_B', 0)}",
        f"- A/B without C: {data['linkage_summary']['link_class_counts'].get('A_B_no_C', 0)}",
        f"- B/C without A: {data['linkage_summary']['link_class_counts'].get('B_C_no_A', 0)}",
        "",
        "## Card Index",
        "",
        "| card | purpose | routes | status |",
        "|---|---|---|---|",
    ]
    for card in data["cards"]:
        routes = ", ".join(f"`{route}`" for route in card["query_routes"])
        lines.append(f"| `{card['card_id']}` | {card['purpose']} | {routes} | `{card['status']}` |")

    lines.extend(["", "## Cards", ""])
    for card in data["cards"]:
        lines.extend(
            [
                f"### {card['title']}",
                "",
                f"- card_id: `{card['card_id']}`",
                f"- purpose: {card['purpose']}",
                f"- modules: {', '.join(f'`{module}`' for module in card['active_network_modules'])}",
                f"- SCIMA common structure: {card['scima_reading'].get('common_structure', '')}",
                f"- FCHMA reading: {next(iter(card['fchma_reading'].values())) if card['fchma_reading'] else ''}",
                f"- counter-reading: {card['counter_reading']}",
                f"- human review question: {card['human_review_question']}",
                "",
            ]
        )

    lines.extend(
        [
            "## Boundary",
            "",
            "- These cards are not reviewed knowledge objects.",
            "- They do not quote or export raw narrative content.",
            "- They do not decide support adequacy, source validity, employer burden validity, worker capacity, medical/legal/employment judgment, or current policy.",
            "- They do not move `candidate_pattern`, Domain Core, public-safe, public-approved, runtime-approved, or review status.",
            "- Condition-window analysis is allowed as interaction evidence; deterministic rules, promoted pattern claims, and public/runtime use remain gated.",
            "",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    data = build_outputs()
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    print(
        json.dumps(
            {
                "card_count": data["card_count"],
                "active_synthesis_card_count": data["active_synthesis_card_count"],
                "prepared_hold_card_count": data["prepared_hold_card_count"],
                "output": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
