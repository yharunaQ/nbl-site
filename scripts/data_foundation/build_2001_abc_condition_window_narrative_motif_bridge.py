#!/usr/bin/env python3
"""Bridge 2001 ABC condition-window motifs to no-text narrative deep reading.

This script does not read raw source text. It uses already-redacted/no-text
SCIMA/FCHMA deep-structure cards and pattern cells to show how narrative-derived
mechanism signals support, refine, or constrain condition-window motifs.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
DATASET_ID = "2001_ABC_survey"
STAGING_DIR = REPO_ROOT / "data/staging/anonymized/2001_ABC_survey/v0"
DERIVED_DIR = REPO_ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22"

CONDITION_WINDOW_DEEPENING_JSON = DERIVED_DIR / "2001-abc-survey-condition-window-interaction-deepening-v0-2026-05-23.json"
BC_DEEP_JSONL = STAGING_DIR / "bc_linked_narrative_deep_structure_cards.jsonl"
A_LINKED_DEEP_JSONL = STAGING_DIR / "a_linked_narrative_deep_structure_cards.jsonl"
BC_PATTERN_CELLS_JSONL = STAGING_DIR / "bc_linked_narrative_pattern_cells.jsonl"
A_PATTERN_CELLS_JSONL = STAGING_DIR / "a_linked_narrative_pattern_cells.jsonl"

OUTPUT_JSON = DERIVED_DIR / "2001-abc-survey-condition-window-narrative-motif-bridge-v0-2026-05-23.json"
OUTPUT_MD = DERIVED_DIR / "2001-abc-survey-condition-window-narrative-motif-bridge-v0-2026-05-23.md"
CHAT_CARDS_JSONL = DERIVED_DIR / "2001-abc-survey-condition-window-narrative-motif-chat-cards-v0-2026-05-23.jsonl"


MOTIF_SPECS: dict[str, dict[str, Any]] = {
    "CW-M01": {
        "title": "情報・コミュニケーションを仕事手順化として読む",
        "tags": {"communication_instruction_translation", "support_practice_or_supervision", "agency_preference_boundary", "task_complexity_quality_safety"},
        "axes": {"one_sided_information_translation_visibility", "information_procedure_alignment_axis", "support_practice_worker_need_translation_gap"},
        "freedoms": {"information_translation_freedom", "preference_disclosure_boundary_freedom", "support_coordination_freedom"},
        "routes": {"C04-information-participation", "C03-support-continuity", "C05-worksite-contact"},
        "condition_card_ids": [
            "2001_ABC_survey:condition-window-interaction:001",
            "2001_ABC_survey:condition-window-interaction:002",
            "2001_ABC_survey:condition-window-interaction:003",
        ],
        "bridge_reading": "情報が届く形式だけでなく、仕事手順、責任分担、反復確認、開示境界に変換されているかを記述構造側から点検する。",
    },
    "CW-M02": {
        "title": "生活保障・勤務外接続を職場内支援と接続して読む",
        "tags": {"commuting_daily_life", "external_support_connection", "support_practice_or_supervision", "social_contact_relationship", "routine_variability_learning"},
        "axes": {"external_support_bridge_axis", "life_security_bridge_axis", "institutional_bridge_translation_axis", "A_C_establishment_worker_context_reading"},
        "freedoms": {"life_commuting_freedom", "institutional_connection_freedom", "support_coordination_freedom", "social_participation_freedom"},
        "routes": {"C06-life-security", "C03-support-continuity", "C07-quality-participation"},
        "condition_card_ids": [
            "2001_ABC_survey:condition-window-interaction:004",
            "2001_ABC_survey:condition-window-interaction:005",
            "2001_ABC_survey:condition-window-interaction:022",
        ],
        "bridge_reading": "生活上の支援、意思表明支援、外部支援接続が、職場内の手順化や参加品質とどう接続するかを読む。",
    },
    "CW-M03": {
        "title": "身体環境から情報・安全・評価への波及を読む",
        "tags": {"physical_access_body_load", "task_content_concrete_work", "communication_instruction_translation", "task_complexity_quality_safety", "support_practice_or_supervision"},
        "axes": {"body_environment_work_design_axis", "work_content_linked_reading", "shared_structural_surface", "work_content_organization_case_alignment_axis"},
        "freedoms": {"body_environment_freedom", "work_content_freedom", "information_translation_freedom", "load_quality_safety_freedom"},
        "routes": {"C05-worksite-contact", "C07-quality-participation", "C04-information-participation"},
        "condition_card_ids": [
            "2001_ABC_survey:condition-window-interaction:006",
            "2001_ABC_survey:condition-window-interaction:007",
            "2001_ABC_survey:condition-window-interaction:015",
        ],
        "bridge_reading": "身体環境の問題を、建物や移動だけで閉じず、操作、表示、文書、周囲の補助、安全導線、評価へ接続して読む。",
    },
    "CW-M04": {
        "title": "内部障害を健康時間・開示・関係・情報翻訳として読む",
        "tags": {"health_time_condition_management", "communication_instruction_translation", "social_contact_relationship", "support_practice_or_supervision", "agency_preference_boundary"},
        "axes": {
            "health_time_visible_across_establishment_and_case_axis",
            "establishment_health_time_signal_without_counterpart_text_axis",
            "counterpart_health_time_signal_without_establishment_text_axis",
            "worker_health_time_signal_less_visible_to_supervisor",
            "supervisor_health_time_signal_without_worker_need_pair",
            "one_sided_information_translation_visibility",
        },
        "freedoms": {"health_time_freedom", "information_translation_freedom", "social_participation_freedom", "support_coordination_freedom", "preference_disclosure_boundary_freedom"},
        "routes": {"C01-health-time", "C04-information-participation", "C07-quality-participation", "C03-support-continuity"},
        "condition_card_ids": [
            "2001_ABC_survey:condition-window-interaction:009",
            "2001_ABC_survey:condition-window-interaction:010",
            "2001_ABC_survey:condition-window-interaction:014",
        ],
        "bridge_reading": "体調・通院・疲労の時間設計が、誰にどの粒度で共有され、仕事手順・評価境界・関係性へ翻訳されているかを読む。",
    },
    "CW-M05": {
        "title": "障害発生時期を再訓練・再設計・開示順序として読む",
        "tags": {"routine_variability_learning", "task_matching_assignment", "task_content_concrete_work", "agency_preference_boundary", "communication_instruction_translation", "participation_satisfaction_quality"},
        "axes": {"work_content_organization_case_alignment_axis", "information_procedure_alignment_axis", "shared_structural_surface", "work_content_linked_reading"},
        "freedoms": {"learning_variability_freedom", "work_assignment_freedom", "work_content_freedom", "evaluation_participation_freedom", "information_translation_freedom"},
        "routes": {"C07-quality-participation", "C05-worksite-contact", "C04-information-participation", "C03-support-continuity"},
        "condition_card_ids": [
            "2001_ABC_survey:condition-window-interaction:018",
            "2001_ABC_survey:condition-window-interaction:019",
            "2001_ABC_survey:condition-window-interaction:024",
        ],
        "bridge_reading": "既存の仕事経験、役割、再訓練、自己理解、開示、評価、生活再編の順序差として読む。",
    },
    "CW-M06": {
        "title": "障害程度を一次元尺度ではなく多機序入口として読む",
        "tags": {"health_time_condition_management", "physical_access_body_load", "communication_instruction_translation", "social_contact_relationship", "support_practice_or_supervision", "routine_variability_learning"},
        "axes": {"body_environment_work_design_axis", "one_sided_information_translation_visibility", "life_security_bridge_axis", "information_procedure_alignment_axis", "establishment_burden_support_translation_axis"},
        "freedoms": {"body_environment_freedom", "health_time_freedom", "information_translation_freedom", "support_coordination_freedom", "social_participation_freedom"},
        "routes": {"C01-health-time", "C03-support-continuity", "C04-information-participation", "C05-worksite-contact", "C07-quality-participation"},
        "condition_card_ids": [
            "2001_ABC_survey:condition-window-interaction:012",
            "2001_ABC_survey:condition-window-interaction:020",
            "2001_ABC_survey:condition-window-interaction:021",
        ],
        "bridge_reading": "程度が、身体機能、制度分類、職務配置、支援対象、回答文脈のどれを代理しているのかを分解する。",
    },
    "CW-M07": {
        "title": "B/C不一致を認識差・翻訳差として読む",
        "tags": {"agency_preference_boundary", "communication_instruction_translation", "health_time_condition_management", "burden_management_risk", "support_practice_or_supervision"},
        "axes": {
            "one_sided_information_translation_visibility",
            "worker_health_time_signal_less_visible_to_supervisor",
            "supervisor_health_time_signal_without_worker_need_pair",
            "establishment_health_time_signal_without_counterpart_text_axis",
            "counterpart_health_time_signal_without_establishment_text_axis",
            "support_practice_worker_need_translation_gap",
            "low_signal_manual_review",
        },
        "freedoms": {"preference_disclosure_boundary_freedom", "information_translation_freedom", "health_time_freedom", "support_coordination_freedom", "management_burden_freedom"},
        "routes": {"C01-health-time", "C03-support-continuity", "C04-information-participation", "C07-quality-participation"},
        "condition_card_ids": ["2001-ABC-SCIMA-FCHMA-T08-condition-window-interaction-layer"],
        "bridge_reading": "不一致を誤り扱いで捨てず、本人理解、職場理解、分類粒度、開示境界、制度時代語彙の差として読む。",
    },
    "CW-M08": {
        "title": "少数窓を発見窓として扱い、単独昇格を止める",
        "tags": {"physical_access_body_load", "external_support_connection", "health_time_condition_management", "routine_variability_learning", "task_complexity_quality_safety"},
        "axes": {"low_signal_manual_review", "body_environment_work_design_axis", "external_support_bridge_axis", "health_time_visible_across_establishment_and_case_axis"},
        "freedoms": {"body_environment_freedom", "institutional_connection_freedom", "health_time_freedom", "learning_variability_freedom", "load_quality_safety_freedom"},
        "routes": {"C01-health-time", "C05-worksite-contact", "C06-life-security", "C07-quality-participation"},
        "condition_card_ids": [],
        "bridge_reading": "少数窓で見えた接触点や自由度を、共通構造の特殊形か別機序候補かとして保留し、単独昇格を防ぐ。",
    },
}

GENERIC_AXES = {
    "shared_structural_surface",
    "work_content_linked_reading",
    "shared_work_content_or_assignment_surface",
    "A_C_establishment_worker_context_reading",
    "A_B_establishment_supervisor_context_reading",
}

GENERIC_TAGS = {
    "task_content_concrete_work",
}

GENERIC_FREEDOMS = {
    "work_content_freedom",
}

MOTIF_GATES: dict[str, dict[str, Any]] = {
    "CW-M01": {
        "required_axes": {
            "one_sided_information_translation_visibility",
            "information_procedure_alignment_axis",
            "support_practice_worker_need_translation_gap",
        },
        "required_tags": {"communication_instruction_translation"},
        "required_freedoms": {"information_translation_freedom"},
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
    "CW-M02": {
        "required_axes": {
            "external_support_bridge_axis",
            "life_security_bridge_axis",
            "institutional_bridge_translation_axis",
        },
        "required_tags": {"commuting_daily_life", "external_support_connection"},
        "required_freedoms": {"life_commuting_freedom", "institutional_connection_freedom"},
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
    "CW-M03": {
        "required_axes": {"body_environment_work_design_axis"},
        "required_tags": {"physical_access_body_load"},
        "required_freedoms": {"body_environment_freedom"},
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
    "CW-M04": {
        "required_axes": {
            "health_time_visible_across_establishment_and_case_axis",
            "establishment_health_time_signal_without_counterpart_text_axis",
            "counterpart_health_time_signal_without_establishment_text_axis",
            "worker_health_time_signal_less_visible_to_supervisor",
            "supervisor_health_time_signal_without_worker_need_pair",
        },
        "required_tags": {"health_time_condition_management"},
        "required_freedoms": {"health_time_freedom"},
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
    "CW-M05": {
        "required_axes": {
            "work_content_organization_case_alignment_axis",
            "information_procedure_alignment_axis",
        },
        "required_tags": {
            "routine_variability_learning",
            "task_matching_assignment",
            "participation_satisfaction_quality",
        },
        "required_freedoms": {
            "learning_variability_freedom",
            "work_assignment_freedom",
            "evaluation_participation_freedom",
        },
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
    "CW-M06": {
        "required_axes": {
            "body_environment_work_design_axis",
            "one_sided_information_translation_visibility",
            "life_security_bridge_axis",
            "information_procedure_alignment_axis",
            "establishment_burden_support_translation_axis",
            "health_time_visible_across_establishment_and_case_axis",
        },
        "required_tags": {
            "health_time_condition_management",
            "physical_access_body_load",
            "communication_instruction_translation",
            "social_contact_relationship",
            "routine_variability_learning",
        },
        "required_freedoms": {
            "body_environment_freedom",
            "health_time_freedom",
            "information_translation_freedom",
            "social_participation_freedom",
            "learning_variability_freedom",
        },
        "min_specific_hits": 3,
        "min_feature_groups": 2,
        "deep_score_threshold": 5.0,
        "pattern_score_threshold": 16.0,
    },
    "CW-M07": {
        "required_axes": {
            "one_sided_information_translation_visibility",
            "worker_health_time_signal_less_visible_to_supervisor",
            "supervisor_health_time_signal_without_worker_need_pair",
            "establishment_health_time_signal_without_counterpart_text_axis",
            "counterpart_health_time_signal_without_establishment_text_axis",
            "support_practice_worker_need_translation_gap",
            "low_signal_manual_review",
            "establishment_burden_support_translation_axis",
            "establishment_burden_vs_worker_participation_axis",
        },
        "required_tags": {
            "agency_preference_boundary",
            "communication_instruction_translation",
            "health_time_condition_management",
            "burden_management_risk",
            "support_practice_or_supervision",
        },
        "required_freedoms": {
            "preference_disclosure_boundary_freedom",
            "information_translation_freedom",
            "health_time_freedom",
            "management_burden_freedom",
            "support_coordination_freedom",
        },
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
    "CW-M08": {
        "required_axes": {"low_signal_manual_review"},
        "required_tags": {
            "physical_access_body_load",
            "external_support_connection",
            "health_time_condition_management",
            "routine_variability_learning",
            "task_complexity_quality_safety",
        },
        "required_freedoms": {
            "body_environment_freedom",
            "institutional_connection_freedom",
            "health_time_freedom",
            "learning_variability_freedom",
            "load_quality_safety_freedom",
        },
        "min_specific_hits": 2,
        "deep_score_threshold": 4.0,
        "pattern_score_threshold": 12.0,
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as src:
        for line in src:
            if line.strip():
                rows.append(json.loads(line))
    return rows


def collect_tags(card: dict[str, Any]) -> Counter[str]:
    counter: Counter[str] = Counter()
    for key, value in card.items():
        if key.endswith("_structural_tags") and isinstance(value, list):
            counter.update(value)
    return counter


def card_features(card: dict[str, Any]) -> dict[str, Counter[str]]:
    return {
        "tags": collect_tags(card),
        "axes": Counter(card.get("contrast_axes", [])),
        "freedoms": Counter(card.get("freedom_axes", [])),
        "routes": Counter(card.get("stage1_route_counts", {})),
    }


def pattern_features(cell: dict[str, Any]) -> dict[str, Counter[str]]:
    tag_counter: Counter[str] = Counter()
    for key, value in cell.items():
        if key.endswith("_tag_counts") and isinstance(value, dict):
            tag_counter.update(value)
    return {
        "tags": tag_counter,
        "axes": Counter(cell.get("axis_counts", {})),
        "freedoms": Counter(cell.get("freedom_axis_counts", {})),
        "routes": Counter(cell.get("stage1_route_counts", {})),
    }


def match_score(features: dict[str, Counter[str]], spec: dict[str, Any]) -> tuple[float, dict[str, list[str]]]:
    matches: dict[str, list[str]] = {}
    weights = {"tags": 1.0, "axes": 2.0, "freedoms": 1.5, "routes": 0.2}
    score = 0.0
    for key in ["tags", "axes", "freedoms", "routes"]:
        spec_values = spec[key]
        found = sorted(set(features[key]) & spec_values)
        matches[key] = found
        for item in found:
            score += weights[key] * min(max(1, features[key][item]), 10)
    return round(score, 3), matches


def passes_motif_gate(
    motif_id: str,
    features: dict[str, Counter[str]],
    matches: dict[str, list[str]],
    score: float,
    source_kind: str,
) -> bool:
    gate = MOTIF_GATES[motif_id]
    threshold_key = "pattern_score_threshold" if source_kind == "pattern" else "deep_score_threshold"
    if score < gate[threshold_key]:
        return False

    required_hits = {
        "axes": set(features["axes"]) & gate["required_axes"],
        "tags": set(features["tags"]) & gate["required_tags"],
        "freedoms": set(features["freedoms"]) & gate["required_freedoms"],
    }
    if not any(required_hits.values()):
        return False

    specific_hits = {
        "axes": set(matches["axes"]) - GENERIC_AXES,
        "tags": set(matches["tags"]) - GENERIC_TAGS,
        "freedoms": set(matches["freedoms"]) - GENERIC_FREEDOMS,
    }
    if sum(len(values) for values in specific_hits.values()) < gate["min_specific_hits"]:
        return False

    min_feature_groups = gate.get("min_feature_groups")
    if min_feature_groups:
        group_count = sum(1 for values in specific_hits.values() if values)
        if group_count < min_feature_groups:
            return False

    return True


def compact_counter(counter: Counter[str], limit: int = 10) -> dict[str, int]:
    return dict(counter.most_common(limit))


def summarize_matches(
    motif_id: str,
    spec: dict[str, Any],
    deep_cards: list[dict[str, Any]],
    pattern_cells: list[dict[str, Any]],
) -> dict[str, Any]:
    deep_matches: list[dict[str, Any]] = []
    for card in deep_cards:
        features = card_features(card)
        score, matches = match_score(features, spec)
        if not passes_motif_gate(motif_id, features, matches, score, "deep"):
            continue
        deep_matches.append(
            {
                "deep_card_id": card["deep_card_id"],
                "source_group": card["source_group"],
                "contrast_family": card["contrast_family"],
                "counterpart_perspective_key": card.get("counterpart_perspective_key"),
                "score": score,
                "matches": matches,
                "contrast_axes": card.get("contrast_axes", []),
                "freedom_axes": card.get("freedom_axes", []),
                "stage1_route_counts": card.get("stage1_route_counts", {}),
                "candidate_interaction_proposition": card.get("candidate_interaction_proposition"),
                "counter_proposition": card.get("counter_proposition"),
                "human_review_question": card.get("human_review_question"),
            }
        )
    deep_matches.sort(key=lambda item: item["score"], reverse=True)

    pattern_matches: list[dict[str, Any]] = []
    for cell in pattern_cells:
        features = pattern_features(cell)
        score, matches = match_score(features, spec)
        if not passes_motif_gate(motif_id, features, matches, score, "pattern"):
            continue
        pattern_matches.append(
            {
                "pattern_cell_id": cell["pattern_cell_id"],
                "source_group": cell["source_group"],
                "source_contrast_family": cell["source_contrast_family"],
                "primary_contrast_axis": cell["primary_contrast_axis"],
                "primary_stage1_route": cell["primary_stage1_route"],
                "card_count": cell["card_count"],
                "score": score,
                "matches": matches,
                "review_sample_deep_card_ids": cell.get("review_sample_deep_card_ids", {}),
            }
        )
    pattern_matches.sort(key=lambda item: (item["score"], item["card_count"]), reverse=True)

    axis_counter: Counter[str] = Counter()
    freedom_counter: Counter[str] = Counter()
    route_counter: Counter[str] = Counter()
    tag_counter: Counter[str] = Counter()
    specific_axis_counter: Counter[str] = Counter()
    specific_freedom_counter: Counter[str] = Counter()
    specific_tag_counter: Counter[str] = Counter()
    family_counter: Counter[str] = Counter()
    source_counter: Counter[str] = Counter()
    counterpart_counter: Counter[str] = Counter()
    proposition_counter: Counter[str] = Counter()
    review_question_counter: Counter[str] = Counter()

    for match in deep_matches:
        source_counter[match["source_group"]] += 1
        family_counter[match["contrast_family"]] += 1
        if match.get("counterpart_perspective_key"):
            counterpart_counter[match["counterpart_perspective_key"]] += 1
        axis_counter.update(match["contrast_axes"])
        specific_axis_counter.update(axis for axis in match["contrast_axes"] if axis not in GENERIC_AXES)
        freedom_counter.update(match["freedom_axes"])
        specific_freedom_counter.update(axis for axis in match["freedom_axes"] if axis not in GENERIC_FREEDOMS)
        route_counter.update(match["stage1_route_counts"])
        for group in match["matches"].values():
            tag_counter.update(group)
        specific_tag_counter.update(tag for tag in match["matches"].get("tags", []) if tag not in GENERIC_TAGS)
        if match.get("candidate_interaction_proposition"):
            proposition_counter[match["candidate_interaction_proposition"]] += 1
        if match.get("human_review_question"):
            review_question_counter[match["human_review_question"]] += 1

    return {
        "motif_id": motif_id,
        "title": spec["title"],
        "condition_window_card_anchors": spec["condition_card_ids"],
        "bridge_reading": spec["bridge_reading"],
        "matched_deep_card_count": len(deep_matches),
        "matched_pattern_cell_count": len(pattern_matches),
        "source_group_counts": compact_counter(source_counter, 8),
        "contrast_family_counts": compact_counter(family_counter, 8),
        "counterpart_perspective_counts": compact_counter(counterpart_counter, 8),
        "top_axes": compact_counter(axis_counter, 12),
        "top_specific_axes": compact_counter(specific_axis_counter, 12),
        "top_freedom_axes": compact_counter(freedom_counter, 12),
        "top_specific_freedom_axes": compact_counter(specific_freedom_counter, 12),
        "top_routes": compact_counter(route_counter, 8),
        "top_matched_features": compact_counter(tag_counter, 14),
        "top_specific_matched_features": compact_counter(specific_tag_counter, 14),
        "top_pattern_cells": pattern_matches[:8],
        "review_sample_deep_cards": deep_matches[:10],
        "dominant_candidate_propositions": compact_counter(proposition_counter, 5),
        "dominant_human_review_questions": compact_counter(review_question_counter, 5),
        "narrative_bridge_status": "mechanism_bridge_unreviewed_no_promotion",
        "matching_policy": {
            "required_feature_gate": "Each motif requires a motif-specific axis, tag, or freedom hit.",
            "specificity_gate": "Generic shared work-content surfaces and route-only overlap are insufficient.",
            "score_cap": "Feature counts are capped during scoring so large aggregate cells do not dominate motif fit.",
            "deep_score_threshold": MOTIF_GATES[motif_id]["deep_score_threshold"],
            "pattern_score_threshold": MOTIF_GATES[motif_id]["pattern_score_threshold"],
        },
        "condition_specificity_boundary": "Narrative deep cards are not condition-specific unless separately linked; use them to test mechanism plausibility, not to prove condition-window claims.",
        "not_allowed": [
            "raw narrative text export",
            "condition-to-support lookup",
            "support adequacy decision",
            "worker capacity decision",
            "source validity decision",
            "candidate_pattern movement",
            "public/runtime approval",
        ],
        "source_content_exported": False,
        "narrative_content_included": False,
        "row_level_ids_exported": False,
    }


def build_outputs() -> dict[str, Any]:
    condition_window = load_json(CONDITION_WINDOW_DEEPENING_JSON)

    bc_cards = load_jsonl(BC_DEEP_JSONL)
    for card in bc_cards:
        card["source_group"] = "B_C_linked_narrative"
    a_cards = load_jsonl(A_LINKED_DEEP_JSONL)
    for card in a_cards:
        card["source_group"] = "A_linked_narrative"
    deep_cards = bc_cards + a_cards

    bc_cells = load_jsonl(BC_PATTERN_CELLS_JSONL)
    for cell in bc_cells:
        cell["source_group"] = "B_C_linked_pattern_cell"
    a_cells = load_jsonl(A_PATTERN_CELLS_JSONL)
    for cell in a_cells:
        cell["source_group"] = "A_linked_pattern_cell"
    pattern_cells = bc_cells + a_cells

    motif_bridges = [
        summarize_matches(motif_id, spec, deep_cards, pattern_cells)
        for motif_id, spec in MOTIF_SPECS.items()
    ]

    return {
        "dataset_id": DATASET_ID,
        "artifact_id": "2001_ABC_survey_condition_window_narrative_motif_bridge_v0_2026_05_23",
        "lane": "Falcon Lab",
        "status": "condition_window_narrative_motif_bridge_unreviewed_no_text_no_promotion",
        "source_layers_used": [
            str(CONDITION_WINDOW_DEEPENING_JSON.relative_to(REPO_ROOT)),
            str(BC_DEEP_JSONL.relative_to(REPO_ROOT)),
            str(A_LINKED_DEEP_JSONL.relative_to(REPO_ROOT)),
            str(BC_PATTERN_CELLS_JSONL.relative_to(REPO_ROOT)),
            str(A_PATTERN_CELLS_JSONL.relative_to(REPO_ROOT)),
        ],
        "source_content_exported": False,
        "narrative_content_included": False,
        "row_level_ids_exported": False,
        "condition_window_profile_count": condition_window["condition_window_profile_count"],
        "condition_window_interaction_card_count": condition_window["interaction_card_count"],
        "deep_card_counts": {
            "B_C_linked_narrative": len(bc_cards),
            "A_linked_narrative": len(a_cards),
        },
        "pattern_cell_counts": {
            "B_C_linked_pattern_cell": len(bc_cells),
            "A_linked_pattern_cell": len(a_cells),
        },
        "motif_bridge_count": len(motif_bridges),
        "motif_bridges": motif_bridges,
        "boundary": [
            "This bridge uses no-text structural cards and pattern cells only.",
            "Narrative bridge signals test mechanism plausibility, not condition-specific truth.",
            "Do not infer support adequacy, worker capacity, source validity, or current guidance.",
            "Human review is required before candidate_pattern, reviewed knowledge, public, or runtime use.",
        ],
        "review_status": "unreviewed",
    }


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# 2001 ABC Survey Condition-Window Narrative Motif Bridge",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon Lab",
        "状態: condition-window narrative motif bridge / no narrative text / 未レビュー / 昇格なし / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、条件窓モチーフを、A/B/C記述回答の no-text deep structure cards と pattern cells に接続する。条件窓が示した支援翻訳・職場接触点・職業生活制約の信号が、記述構造側でも機序として見えるかを点検するための橋である。",
        "",
        "重要な境界として、記述深読みによる一致は条件窓固有の真理を証明しない。機序の妥当性を検討する入口であり、配慮検索表、能力判断、支援妥当性判断、現行政策主張、reviewed knowledge ではない。",
        "",
        "## Source Scope",
        "",
        f"- condition-window profiles: {data['condition_window_profile_count']}",
        f"- condition-window interaction cards: {data['condition_window_interaction_card_count']}",
        f"- B/C narrative deep cards: {data['deep_card_counts']['B_C_linked_narrative']}",
        f"- A-linked narrative deep cards: {data['deep_card_counts']['A_linked_narrative']}",
        f"- B/C pattern cells: {data['pattern_cell_counts']['B_C_linked_pattern_cell']}",
        f"- A-linked pattern cells: {data['pattern_cell_counts']['A_linked_pattern_cell']}",
        "",
        "## Motif Bridge Index",
        "",
        "| motif | narrative deep cards | pattern cells | motif-specific axes | bridge reading |",
        "|---|---:|---:|---|---|",
    ]
    for motif in data["motif_bridges"]:
        axes = ", ".join(f"`{axis}`" for axis in list(motif["top_specific_axes"])[:4])
        lines.append(
            f"| `{motif['motif_id']}` {motif['title']} | {motif['matched_deep_card_count']} | {motif['matched_pattern_cell_count']} | {axes} | {motif['bridge_reading']} |"
        )

    lines.extend(["", "## Motif Details", ""])
    for motif in data["motif_bridges"]:
        lines.extend(
            [
                f"### {motif['motif_id']}: {motif['title']}",
                "",
                f"- matched deep cards: {motif['matched_deep_card_count']}",
                f"- matched pattern cells: {motif['matched_pattern_cell_count']}",
                f"- source groups: {json.dumps(motif['source_group_counts'], ensure_ascii=False)}",
                f"- top axes: {json.dumps(motif['top_axes'], ensure_ascii=False)}",
                f"- top motif-specific axes: {json.dumps(motif['top_specific_axes'], ensure_ascii=False)}",
                f"- top freedom axes: {json.dumps(motif['top_freedom_axes'], ensure_ascii=False)}",
                f"- top motif-specific freedom axes: {json.dumps(motif['top_specific_freedom_axes'], ensure_ascii=False)}",
                f"- top routes: {json.dumps(motif['top_routes'], ensure_ascii=False)}",
                f"- bridge reading: {motif['bridge_reading']}",
                f"- condition-specificity boundary: {motif['condition_specificity_boundary']}",
                "",
                "Top pattern cells:",
                "",
            ]
        )
        for cell in motif["top_pattern_cells"][:5]:
            lines.append(
                f"- `{cell['pattern_cell_id']}` / {cell['source_group']} / {cell['primary_contrast_axis']} / cards {cell['card_count']}"
            )
        lines.extend(["", "Review sample deep cards:", ""])
        for card in motif["review_sample_deep_cards"][:5]:
            lines.append(
                f"- `{card['deep_card_id']}` / {card['source_group']} / score {card['score']} / axes {', '.join(card['contrast_axes'][:4])}"
            )
        lines.append("")

    lines.extend(
        [
            "## Boundary",
            "",
            "- raw narrative text, unit text, PII, and row-level IDs are not exported.",
            "- deep-card IDs and pattern-cell IDs are audit anchors, not reviewed evidence claims.",
            "- This bridge tests mechanism plausibility; it does not prove condition-window claims.",
            "- Do not use this for condition-to-support lookup, support adequacy, worker capacity, source validity, current guidance, public copy, or runtime grounding.",
            "- `candidate_pattern`, Domain Core, Atlas/27-frame, public-safe, public-approved, runtime-approved, and review status are not moved.",
            "",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


def write_chat_cards(data: dict[str, Any]) -> None:
    with CHAT_CARDS_JSONL.open("w", encoding="utf-8") as out:
        for motif in data["motif_bridges"]:
            card = {
                "card_id": f"{DATASET_ID}:condition-window-narrative-motif:{motif['motif_id']}",
                "dataset_id": DATASET_ID,
                "status": "condition_window_narrative_motif_chat_card_unreviewed_no_runtime_approval",
                "motif_id": motif["motif_id"],
                "title": motif["title"],
                "activation_terms": [motif["motif_id"], motif["title"], "条件窓", "記述深読", "SCIMA/FCHMA"],
                "condition_window_card_anchors": motif["condition_window_card_anchors"],
                "top_axes": motif["top_axes"],
                "top_specific_axes": motif["top_specific_axes"],
                "top_freedom_axes": motif["top_freedom_axes"],
                "top_specific_freedom_axes": motif["top_specific_freedom_axes"],
                "top_routes": motif["top_routes"],
                "bridge_reading": motif["bridge_reading"],
                "top_pattern_cells": motif["top_pattern_cells"][:5],
                "review_sample_deep_cards": motif["review_sample_deep_cards"][:5],
                "condition_specificity_boundary": motif["condition_specificity_boundary"],
                "not_allowed": motif["not_allowed"],
                "source_content_exported": False,
                "narrative_content_included": False,
                "row_level_ids_exported": False,
                "review_status": "unreviewed",
            }
            out.write(json.dumps(card, ensure_ascii=False) + "\n")


def main() -> None:
    data = build_outputs()
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    write_chat_cards(data)
    print(
        json.dumps(
            {
                "motif_bridge_count": data["motif_bridge_count"],
                "deep_card_counts": data["deep_card_counts"],
                "pattern_cell_counts": data["pattern_cell_counts"],
                "output": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
                "chat_cards": str(CHAT_CARDS_JSONL.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
