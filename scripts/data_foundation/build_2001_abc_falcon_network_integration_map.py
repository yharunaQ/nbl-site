#!/usr/bin/env python3
"""Build a non-chronological Falcon network integration map for 2001 ABC.

The artifact generated here is not a knowledge-promotion artifact. It maps
already-derived, no-text 2001 ABC evidence layers into Falcon query routes,
first principles, and freedom axes so Codex can use the source family as a
structural enrichment layer without treating 2001 as a timeline chapter.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
DATASET_ID = "2001_ABC_survey"
DERIVED_DIR = REPO_ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22"
STAGING_DIR = REPO_ROOT / "data/staging/anonymized/2001_ABC_survey/v0"

CATEGORY_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-category-aggregate-contrast-profile-v0-2026-05-22.json"
B_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-B-workplace-perspective-profile-v1-2026-05-22.json"
BC_SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-B-C-linked-narrative-deep-structure-summary-v0-2026-05-22.json"
AC_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-A-C-single-perspective-structure-profiles-v0-2026-05-22.json"
A_LINKED_SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-A-linked-narrative-deep-structure-summary-v0-2026-05-22.json"
ABC_TRIAD_PROFILE_JSON = DERIVED_DIR / "2001-abc-survey-A-B-C-linked-structured-triad-profile-v0-2026-05-22.json"
CONDITION_WINDOW_DEEPENING_JSON = DERIVED_DIR / "2001-abc-survey-condition-window-interaction-deepening-v0-2026-05-23.json"
CONDITION_WINDOW_MOTIFS_MD = DERIVED_DIR / "2001-abc-survey-condition-window-network-motifs-v0-2026-05-23.md"
CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON = DERIVED_DIR / "2001-abc-survey-condition-window-narrative-motif-bridge-v0-2026-05-23.json"
BC_PATTERN_CELLS_JSONL = STAGING_DIR / "bc_linked_narrative_pattern_cells.jsonl"

OUTPUT_JSON = DERIVED_DIR / "2001-abc-survey-falcon-network-nonchronological-integration-map-v0-2026-05-22.json"
OUTPUT_MD = DERIVED_DIR / "2001-abc-survey-falcon-network-nonchronological-integration-map-v0-2026-05-22.md"
CHAT_OVERLAY_MD = DERIVED_DIR / "2001-abc-survey-codex-chat-network-overlay-v0-2026-05-22.md"
CHAT_CARDS_JSONL = DERIVED_DIR / "2001-abc-survey-falcon-chat-retrieval-cards-v0-2026-05-22.jsonl"
CHAT_CARDS_MD = DERIVED_DIR / "2001-abc-survey-falcon-chat-retrieval-cards-v0-2026-05-22.md"


QR_LABELS = {
    "QR-01-health-time-work-design": "health time as work design",
    "QR-02-information-work-procedure": "information as work procedure",
    "QR-03-worksite-contact-and-mobility": "worksite contact and mobility",
    "QR-04-life-security-sequencing": "life security sequencing",
    "QR-05-entry-prework-translation": "entry / prework translation",
    "QR-06-disclosure-boundary-and-mutual-translation": "disclosure boundary and mutual translation",
    "QR-07-quality-career-and-value-translation": "participation quality and value translation",
    "QR-08-diversity-conditioned-same-structure": "diversity-conditioned same structure",
}


FP_LABELS = {
    "FP-01-interaction-before-attribute": "attribute is a condition window, not explanation",
    "FP-02-same-structure-open-closed": "same structure open / closed",
    "FP-03-health-time-is-work-design": "health time is work design",
    "FP-04-information-must-become-work-procedure": "information must become work procedure",
    "FP-05-work-contact-points-are-the-design-unit": "work contact points are the design unit",
    "FP-06-disclosure-is-boundary-design": "disclosure is boundary design",
    "FP-07-support-is-retranslation-not-presence": "support is retranslation, not presence",
    "FP-08-life-security-shapes-choice": "life security shapes choice",
    "FP-09-participation-has-depth-and-before-entry": "participation has depth and before-entry",
    "FP-10-evaluation-converts-performance-to-value": "evaluation converts performance to value",
    "FP-11-minority-windows-are-discovery-windows": "minority windows are discovery windows",
    "FP-12-learning-loop-over-answer-delivery": "learning loop over answer delivery",
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


def by_key(rows: list[dict[str, Any]], key: str) -> dict[str, dict[str, Any]]:
    return {row[key]: row for row in rows}


def route_clean(route: str) -> str:
    return route.split(" (", 1)[0]


def top_items(rows: list[dict[str, Any]], key: str, limit: int = 5) -> list[dict[str, Any]]:
    return sorted(rows, key=lambda item: item.get(key, 0), reverse=True)[:limit]


def compact_cell(cell: dict[str, Any]) -> dict[str, Any]:
    return {
        "pattern_cell_id": cell["pattern_cell_id"],
        "cards": cell["card_count"],
        "source_contrast_family": cell["source_contrast_family"],
        "primary_axis": cell["primary_contrast_axis"],
        "primary_stage1_route": cell["primary_stage1_route"],
        "top_freedom_axes": dict(Counter(cell.get("freedom_axis_counts", {})).most_common(5)),
    }


def cells_by_axis(cells: list[dict[str, Any]], axes: set[str], limit: int = 5) -> list[dict[str, Any]]:
    filtered = [cell for cell in cells if cell["primary_contrast_axis"] in axes]
    return [compact_cell(cell) for cell in sorted(filtered, key=lambda cell: cell["card_count"], reverse=True)[:limit]]


def support_profile(category_profile: dict[str, Any], category: str) -> dict[str, Any]:
    profiles = by_key(category_profile["profiles"], "category")
    item = profiles[category]
    return {
        "category": category,
        "usable_pairs": item["usable_overlap_pairs"],
        "worker_need_without_supervisor_support": item["worker_need_any_without_supervisor_support_any"],
        "worker_need_without_supervisor_support_rate": item["worker_need_any_without_supervisor_support_any_rate"],
        "supervisor_support_worker_unneeded_only": item["supervisor_support_any_worker_unneeded_only"],
        "supervisor_support_worker_unneeded_only_rate": item["supervisor_support_any_worker_unneeded_only_rate"],
        "falcon_routes": [route_clean(route) for route in item["falcon_routes"]],
    }


def b_support(category: str, b_profile: dict[str, Any]) -> dict[str, Any]:
    profiles = by_key(b_profile["support_group_profiles"], "category")
    item = profiles[category]
    return {
        "category": category,
        "usable_records": item["usable_records"],
        "any_support_present": item["record_counts"]["any_support_present"],
        "supervisor_needed_but_not_present": item["record_counts"]["any_supervisor_needed_but_not_present"],
        "all_items_not_needed": item["record_counts"]["all_items_not_needed"],
        "falcon_routes": [route_clean(route) for route in item["falcon_routes"]],
    }


def b_constraint(category: str, b_profile: dict[str, Any]) -> dict[str, Any]:
    profiles = by_key(b_profile["occupational_life_constraint_profiles"], "category")
    item = profiles[category]
    return {
        "category": category,
        "needed_any_constraint": item["needed_any_constraint"],
        "needed_any_constraint_rate": item["needed_any_constraint_rate"],
        "needed_serious_constraint": item["needed_serious_constraint"],
        "needed_serious_constraint_rate": item["needed_serious_constraint_rate"],
        "not_needed_for_work": item["not_needed_for_work"],
        "falcon_routes": [route_clean(route) for route in item["falcon_routes"]],
    }


def problem_block(block: str, b_profile: dict[str, Any]) -> dict[str, Any]:
    profiles = by_key(b_profile["task_contact_problem_block_profiles"], "block")
    item = profiles[block]
    return {
        "block": block,
        "category": item["category"],
        "usable_records": item["usable_records"],
        "any_problem_unresolved": item["record_counts"]["any_problem_unresolved"],
        "any_problem_resolved": item["record_counts"]["any_problem_resolved"],
        "all_items_no_particular_problem": item["record_counts"]["all_items_no_particular_problem"],
        "falcon_routes": [route_clean(route) for route in item["falcon_routes"]],
    }


def compact_a_burden(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "item": item["item"],
        "usable_records": item["usable_records"],
        "burden_or_expected_burden_any": item["burden_or_expected_burden_any"],
        "burden_or_expected_burden_rate": item["burden_or_expected_burden_rate"],
        "falcon_routes": item["falcon_routes"],
    }


def compact_a_advice(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "item": item["item"],
        "usable_records": item["usable_records"],
        "advice_or_external_use_present": item["advice_or_external_use_present"],
        "advice_or_external_use_rate": item["advice_or_external_use_rate"],
        "falcon_routes": item["falcon_routes"],
    }


def compact_likert_item(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "item": item["item"],
        "usable_records": item["usable_records"],
        "agree_or_tend_agree": item["agree_or_tend_agree"],
        "agree_or_tend_agree_rate": item["agree_or_tend_agree_rate"],
        "falcon_routes": item["falcon_routes"],
    }


def compact_c_support(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "category": item["category"],
        "usable_records": item["usable_records"],
        "any_need_or_usefulness": item["record_counts"]["any_need_or_usefulness"],
        "any_need_or_usefulness_rate": item["any_need_or_usefulness_rate"],
        "any_strong_need_or_usefulness_rate": item["any_strong_need_or_usefulness_rate"],
        "freedom_axis": item["freedom_axis"],
        "falcon_routes": item["falcon_routes"],
    }


def compact_c_work_target(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "item": item["item"],
        "usable_records": item["usable_records"],
        "yes": item["yes"],
        "yes_rate": item["yes_rate"],
        "falcon_routes": item["falcon_routes"],
    }


def compact_c_satisfaction(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "usable_records": item["usable_records"],
        "satisfied_or_very_satisfied": item["satisfied_or_very_satisfied"],
        "satisfied_or_very_satisfied_rate": item["satisfied_or_very_satisfied_rate"],
        "dissatisfied_or_not_satisfied": item["dissatisfied_or_not_satisfied"],
        "dissatisfied_or_not_satisfied_rate": item["dissatisfied_or_not_satisfied_rate"],
        "falcon_routes": item["falcon_routes"],
    }


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


def module(
    module_id: str,
    label: str,
    network_function: str,
    routes: list[str],
    first_principles: list[str],
    evidence_windows: list[dict[str, Any]],
    integration_rule: str,
    review_question: str,
    contamination_guard: list[str],
    status: str = "network_enrichment_candidate_unreviewed",
) -> dict[str, Any]:
    return {
        "module_id": module_id,
        "label": label,
        "status": status,
        "integration_mode": "non_chronological_structural_enrichment",
        "network_function": network_function,
        "enriches_query_routes": routes,
        "enriches_first_principles": first_principles,
        "evidence_windows": evidence_windows,
        "integration_rule": integration_rule,
        "human_review_question": review_question,
        "contamination_guard": contamination_guard,
        "source_content_exported": False,
        "narrative_content_included": False,
    }


def build_modules(
    category_profile: dict[str, Any],
    b_profile: dict[str, Any],
    bc_summary: dict[str, Any],
    ac_profile: dict[str, Any],
    a_linked_summary: dict[str, Any],
    abc_triad_profile: dict[str, Any],
    condition_window_deepening: dict[str, Any],
    condition_window_narrative_bridge: dict[str, Any],
    cells: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    axis = bc_summary["contrast_axis_counts"]
    freedom = bc_summary["freedom_axis_counts"]
    a_profile = ac_profile["A_establishment_profile"]
    c_profile = ac_profile["C_worker_profile"]

    common_guards = [
        "do not treat 2001 as current-policy evidence",
        "do not infer support adequacy",
        "do not infer employer or worker accuracy",
        "do not use disability or condition labels as support lookup keys",
        "do not suppress condition-window evidence; analyze it through interaction mechanisms",
        "do not promote to candidate_pattern or reviewed knowledge without human audit",
    ]

    modules = [
        module(
            "M01-work-content-surface-vs-work-design-meaning",
            "Shared work-content surface versus work-design meaning",
            "Thickens Falcon's ability to distinguish shared task names from shared work-design, evaluation, load, and participation meaning.",
            ["QR-03-worksite-contact-and-mobility", "QR-07-quality-career-and-value-translation", "QR-08-diversity-conditioned-same-structure"],
            [
                "FP-02-same-structure-open-closed",
                "FP-05-work-contact-points-are-the-design-unit",
                "FP-10-evaluation-converts-performance-to-value",
                "FP-11-minority-windows-are-discovery-windows",
            ],
            [
                {"type": "B_C_linked_narrative_axis", "axis": "shared_structural_surface", "cards": axis.get("shared_structural_surface", 0)},
                {"type": "B_C_linked_narrative_axis", "axis": "shared_work_content_or_assignment_surface", "cards": axis.get("shared_work_content_or_assignment_surface", 0)},
                {"type": "B_C_linked_narrative_axis", "axis": "work_content_linked_reading", "cards": axis.get("work_content_linked_reading", 0)},
                {"type": "freedom_axis", "axis": "work_content_freedom", "weighted_cards": freedom.get("work_content_freedom", 0)},
                {"type": "pattern_cells", "cells": cells_by_axis(cells, {"shared_structural_surface", "low_signal_manual_review"}, 4)},
            ],
            "Use this module when a query appears to ask what work the person can do, but the deeper issue may be task medium, load, autonomy, evaluation, or participation quality.",
            "Does the shared task label actually share work-design meaning, or only surface vocabulary?",
            common_guards,
        ),
        module(
            "M02-worksite-contact-atlas",
            "Worksite contact atlas",
            "Adds dense workplace-side contact surfaces that previous rare-disease-centered layers did not contain at this granularity.",
            ["QR-02-information-work-procedure", "QR-03-worksite-contact-and-mobility", "QR-08-diversity-conditioned-same-structure"],
            [
                "FP-04-information-must-become-work-procedure",
                "FP-05-work-contact-points-are-the-design-unit",
                "FP-11-minority-windows-are-discovery-windows",
            ],
            [
                {"type": "B_task_contact_problem_block", **problem_block("C-1", b_profile)},
                {"type": "B_task_contact_problem_block", **problem_block("C-2", b_profile)},
                {"type": "B_task_contact_problem_block", **problem_block("C-3", b_profile)},
                {"type": "B_task_contact_problem_block", **problem_block("C-4", b_profile)},
                {"type": "B_C_linked_narrative_axis", "axis": "body_environment_work_design_axis", "cards": axis.get("body_environment_work_design_axis", 0)},
                {"type": "pattern_cells", "cells": cells_by_axis(cells, {"body_environment_work_design_axis"}, 4)},
            ],
            "Use as an atlas of contact points: information presentation, judgment/processing, operation/layout, warning/danger/evacuation, body-environment fit.",
            "Which exact contact point changes the work participation structure, and is it open, closed, residual, or boundary?",
            common_guards,
        ),
        module(
            "M03-support-retranslation-gap",
            "Support presence versus retranslation gap",
            "Prevents Falcon from reading support as presence/absence by preserving supervisor-side support state and worker-side need/usefulness as separate perspectives.",
            ["QR-01-health-time-work-design", "QR-06-disclosure-boundary-and-mutual-translation", "QR-07-quality-career-and-value-translation"],
            [
                "FP-02-same-structure-open-closed",
                "FP-07-support-is-retranslation-not-presence",
                "FP-12-learning-loop-over-answer-delivery",
            ],
            [
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "emergency_disaster")},
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "within_workplace_mobility")},
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "training_skill_education")},
                {"type": "B_C_linked_narrative_axis", "axis": "support_practice_worker_need_translation_gap", "cards": axis.get("support_practice_worker_need_translation_gap", 0)},
                {"type": "B_C_support_practice_need_contrasts", "cards": bc_summary["contrast_family_counts"].get("B_C_support_practice_need_narrative_contrast_candidate", 0)},
            ],
            "Use this when support seems present, absent, needed, not needed, useful, or not useful; treat the question as translation-function analysis, not adequacy judgment.",
            "What is being translated by support: task, information, health time, social relation, life security, evaluation, or disclosure boundary?",
            common_guards,
        ),
        module(
            "M04-information-as-work-procedure",
            "Information as work procedure",
            "Thickens information support from accessibility/communication into work procedure, responsibility, safety, and evaluation.",
            ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation", "QR-03-worksite-contact-and-mobility"],
            [
                "FP-04-information-must-become-work-procedure",
                "FP-06-disclosure-is-boundary-design",
                "FP-05-work-contact-points-are-the-design-unit",
            ],
            [
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "information_communication")},
                {"type": "B_support_state", **b_support("information_communication", b_profile)},
                {"type": "B_occupational_life_constraint", **b_constraint("communication_information_exchange", b_profile)},
                {"type": "B_C_linked_narrative_axis", "axis": "one_sided_information_translation_visibility", "cards": axis.get("one_sided_information_translation_visibility", 0)},
                {"type": "pattern_cells", "cells": cells_by_axis(cells, {"one_sided_information_translation_visibility"}, 4)},
            ],
            "Use when a query mentions explanation, instruction, consultation, communication, manualization, or disclosure; read whether information has become work procedure.",
            "Is the information issue a format issue, a procedure issue, a responsibility issue, a safety issue, or a disclosure-boundary issue?",
            common_guards,
        ),
        module(
            "M05-health-time-visibility",
            "Health-time visibility as work-design signal",
            "Adds historical workplace-heavy checks for when health/self-care/time signals are visible in one perspective but not another.",
            ["QR-01-health-time-work-design", "QR-04-life-security-sequencing", "QR-06-disclosure-boundary-and-mutual-translation"],
            [
                "FP-03-health-time-is-work-design",
                "FP-07-support-is-retranslation-not-presence",
                "FP-08-life-security-shapes-choice",
            ],
            [
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "health_time_self_care")},
                {"type": "B_support_state", **b_support("health_time_self_care_environment", b_profile)},
                {"type": "B_occupational_life_constraint", **b_constraint("regular_attendance_time_reliability", b_profile)},
                {"type": "B_C_linked_narrative_axis", "axis": "worker_health_time_signal_less_visible_to_supervisor", "cards": axis.get("worker_health_time_signal_less_visible_to_supervisor", 0)},
                {"type": "B_C_linked_narrative_axis", "axis": "supervisor_health_time_signal_without_worker_need_pair", "cards": axis.get("supervisor_health_time_signal_without_worker_need_pair", 0)},
            ],
            "Use this module to avoid treating health-time as a personal instability label; route it to time, task, support, evaluation, and disclosure design.",
            "Where does health time enter the work design, and which perspective makes it visible?",
            common_guards,
        ),
        module(
            "M06-life-security-and-offwork-bridge",
            "Life security and off-work bridge",
            "Keeps commuting, daily living, family/support connection, and off-work conditions as work-choice surfaces rather than background noise.",
            ["QR-04-life-security-sequencing", "QR-05-entry-prework-translation", "QR-06-disclosure-boundary-and-mutual-translation"],
            [
                "FP-08-life-security-shapes-choice",
                "FP-09-participation-has-depth-and-before-entry",
                "FP-07-support-is-retranslation-not-presence",
            ],
            [
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "offwork_daily_living")},
                {"type": "category_B_C_support_gap", **support_profile(category_profile, "commuting")},
                {"type": "B_support_state", **b_support("offwork_daily_living", b_profile)},
                {"type": "B_support_state", **b_support("commuting", b_profile)},
                {"type": "B_C_linked_narrative_axis", "axis": "external_support_bridge_axis", "cards": axis.get("external_support_bridge_axis", 0)},
            ],
            "Use when a work question includes commuting, daily living, family, school, welfare, medical, or external support bridge signals.",
            "Does the off-work signal change the order of starting, continuing, resting, returning, or choosing work?",
            common_guards,
        ),
        module(
            "M07-participation-quality-and-evaluation",
            "Participation quality and evaluation",
            "Links work productivity, role, communication, interpersonal relation, satisfaction, and evaluation as participation-quality surfaces.",
            ["QR-07-quality-career-and-value-translation", "QR-03-worksite-contact-and-mobility", "QR-02-information-work-procedure"],
            [
                "FP-09-participation-has-depth-and-before-entry",
                "FP-10-evaluation-converts-performance-to-value",
                "FP-02-same-structure-open-closed",
            ],
            [
                {"type": "B_occupational_life_constraint", **b_constraint("productivity_in_task_execution", b_profile)},
                {"type": "B_occupational_life_constraint", **b_constraint("understanding_knowledge_application", b_profile)},
                {"type": "B_occupational_life_constraint", **b_constraint("interpersonal_relations_at_work", b_profile)},
                {"type": "B_C_linked_narrative_route", "route": "C07-quality-participation", "weighted_cards": bc_summary["stage1_route_counts"].get("C07-quality-participation", 0)},
                {"type": "B_C_linked_narrative_axis", "axis": "management_burden_vs_worker_participation_axis", "cards": axis.get("management_burden_vs_worker_participation_axis", 0)},
            ],
            "Use when the question risks stopping at employment continuation; ask whether performance is converted into value, role, dignity, satisfaction, or future view.",
            "What turns conditional work performance into recognized value, and where does that translation fail or remain invisible?",
            common_guards,
        ),
        module(
            "M08-condition-window-interaction-layer",
            "Condition-window interaction layer",
            "Uses disability category, severity, function, response-mode, and historical sample composition as condition variables for interaction analysis, while preventing disease/disability-to-support lookup contamination.",
            ["QR-08-diversity-conditioned-same-structure", "QR-03-worksite-contact-and-mobility"],
            [
                "FP-01-interaction-before-attribute",
                "FP-05-work-contact-points-are-the-design-unit",
                "FP-11-minority-windows-are-discovery-windows",
            ],
            [
                {
                    "type": "condition_window_QA_required",
                    "reason": "B/C disability and severity mismatch QA exists; condition-window contact variants can be analyzed as unreviewed interaction hypotheses, while reusable condition-window pattern claims require coded-value and alignment review.",
                },
                {"type": "B_task_contact_problem_blocks_available", "blocks": ["C-1", "C-2", "C-3", "C-4"]},
                {
                    "type": "sensitive_health_condition_text_boundary",
                    "allowed_use": "condition-window interaction analysis / ICD indexing / bias-risk check after authorized review; no deterministic support lookup",
                },
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
            "Use as an unreviewed evidence layer: condition windows may guide mechanism search, contact-point comparison, and bias checks; deterministic rules and promoted pattern claims remain gated.",
            "Which contact variation appears under a condition window, through what mechanism, and what alternative explanation remains?",
            common_guards
            + [
                "do not treat condition-window association as causal closure",
                "hold deterministic condition-window rules and promoted claims until coded-value QA, mismatch QA, and human review are resolved",
            ],
        ),
        module(
            "M09-establishment-burden-advice-context",
            "Establishment burden and advice context",
            "Adds A票の事業所・人事労務側の負担感、期待負担、外部助言利用、雇用理由/課題を、支援妥当性ではなく組織側の翻訳コストと接続窓として読む。",
            [
                "QR-03-worksite-contact-and-mobility",
                "QR-04-life-security-sequencing",
                "QR-06-disclosure-boundary-and-mutual-translation",
                "QR-07-quality-career-and-value-translation",
            ],
            [
                "FP-05-work-contact-points-are-the-design-unit",
                "FP-07-support-is-retranslation-not-presence",
                "FP-08-life-security-shapes-choice",
                "FP-12-learning-loop-over-answer-delivery",
            ],
            [
                {
                    "type": "A_establishment_burden_top_items",
                    "row_count": a_profile["row_count"],
                    "items": [compact_a_burden(item) for item in a_profile["burden_profiles"][:7]],
                },
                {
                    "type": "A_establishment_external_advice_top_items",
                    "row_count": a_profile["row_count"],
                    "items": [compact_a_advice(item) for item in a_profile["external_advice_use_profiles"][:7]],
                },
                {
                    "type": "A_establishment_employment_reasons",
                    "items": [compact_likert_item(item) for item in a_profile["employment_reason_profiles"]],
                },
                {
                    "type": "A_establishment_employment_challenges",
                    "items": [compact_likert_item(item) for item in a_profile["employment_challenge_profiles"]],
                },
                {
                    "type": "A_linked_narrative_deep_structure",
                    "deep_card_count": a_linked_summary["deep_card_count"],
                    "pattern_cell_count": a_linked_summary["pattern_cell_count"],
                    "top_contrast_axes": dict(Counter(a_linked_summary["contrast_axis_counts"]).most_common(8)),
                    "top_stage1_routes": dict(Counter(a_linked_summary["stage1_route_counts"]).most_common(6)),
                },
            ],
            "Use this when a question touches employer burden, support load, external consultation, management awareness, life-support connection, or the conversion of employment into organizational value.",
            "Is the observed burden signal a contact-point design cost, a translation/coordination cost, a life-security bridge cost, or an evaluation/value translation problem?",
            common_guards
            + [
                "do not validate establishment burden perception",
                "do not convert A票 burden rates into current employer guidance",
                "treat 1582 A rows as file-level A records until linkage-count QA is complete",
            ],
        ),
        module(
            "M10-worker-need-satisfaction-context",
            "Worker need, usefulness, and satisfaction context",
            "Adds C票の本人側の支援必要/有用性、仕事対象、満足度を、就労能力判定ではなく参加品質・健康時間・自由度の観測窓として読む。",
            [
                "QR-01-health-time-work-design",
                "QR-03-worksite-contact-and-mobility",
                "QR-04-life-security-sequencing",
                "QR-07-quality-career-and-value-translation",
                "QR-08-diversity-conditioned-same-structure",
            ],
            [
                "FP-01-interaction-before-attribute",
                "FP-03-health-time-is-work-design",
                "FP-07-support-is-retranslation-not-presence",
                "FP-09-participation-has-depth-and-before-entry",
                "FP-10-evaluation-converts-performance-to-value",
            ],
            [
                {
                    "type": "C_worker_support_need_usefulness_top_groups",
                    "row_count": c_profile["row_count"],
                    "groups": [compact_c_support(item) for item in c_profile["support_need_usefulness_profiles"][:10]],
                },
                {
                    "type": "C_worker_satisfaction_participation_quality_modifier",
                    **compact_c_satisfaction(c_profile["satisfaction_profile"]),
                },
                {
                    "type": "C_worker_work_target_signals",
                    "items": [compact_c_work_target(item) for item in c_profile["work_content_target_profile"]],
                },
                {
                    "type": "C_condition_window_prepared_layer",
                    "status": c_profile["condition_window_profile"]["status"],
                    "boundary": c_profile["condition_window_profile"]["interpretation_boundary"],
                },
                {
                    "type": "A_C_linked_narrative_deep_structure",
                    "deep_card_count": a_linked_summary["contrast_family_counts"].get(
                        "A_C_establishment_worker_need_narrative_contrast_candidate", 0
                    ),
                    "top_contrast_axes": dict(Counter(a_linked_summary["contrast_axis_counts"]).most_common(8)),
                },
            ],
            "Use this when a query risks treating worker need, support usefulness, satisfaction, or work target as a simple preference/capacity fact; route it to participation-quality and freedom-state analysis.",
            "Which need/usefulness signal changes health time, contact point, life bridge, participation quality, or evaluation, and what remains invisible without A/B linkage?",
            common_guards
            + [
                "do not infer worker capacity or support adequacy from C票",
                "do not use condition-window fields as support lookup rules; use them only through explicit interaction mechanisms",
                "do not treat satisfaction as outcome proof",
            ],
        ),
        module(
            "M11-strict-coded-triad-structure",
            "Strict A/B/C coded triad structure",
            "Adds the exact A/B/C linked coded layer: establishment burden/advice, supervisor support state, and worker need/usefulness in the same linked pair, without row ids or narrative text.",
            [
                "QR-03-worksite-contact-and-mobility",
                "QR-06-disclosure-boundary-and-mutual-translation",
                "QR-07-quality-career-and-value-translation",
                "QR-01-health-time-work-design",
                "QR-04-life-security-sequencing",
            ],
            [
                "FP-02-same-structure-open-closed",
                "FP-03-health-time-is-work-design",
                "FP-05-work-contact-points-are-the-design-unit",
                "FP-07-support-is-retranslation-not-presence",
                "FP-12-learning-loop-over-answer-delivery",
            ],
            [
                {
                    "type": "A_B_C_strict_linked_structured_triad_profile",
                    "strict_A_B_C_pair_count": abc_triad_profile["strict_A_B_C_pair_count"],
                    "profiles": [
                        {
                            "category": item["category"],
                            "A_burden_rate": item["A_burden_or_expected_burden_rate"],
                            "B_support_rate": item["B_support_present_rate"],
                            "B_needed_not_present_rate": item["B_supervisor_needed_but_not_present_rate"],
                            "C_need_rate": item["C_need_or_usefulness_rate"],
                            "A_burden_and_C_need_without_B_support": item["A_burden_and_C_need_without_B_support"],
                            "routes": item["routes"],
                        }
                        for item in abc_triad_profile["profiles"]
                    ],
                }
            ],
            "Use this when a query benefits from the dataset's strict three-perspective linkage rather than only single-perspective or B/C linked reading.",
            "Where do organization-side burden/advice, supervisor-side support state, and worker-side need/usefulness align, diverge, or expose a missing translation function?",
            common_guards
            + [
                "do not treat triad rates as support adequacy",
                "do not export row-level pair ids",
                "do not infer current prevalence from 2001 linked counts",
            ],
        ),
    ]
    return modules


def build_outputs() -> dict[str, Any]:
    category_profile = load_json(CATEGORY_PROFILE_JSON)
    b_profile = load_json(B_PROFILE_JSON)
    bc_summary = load_json(BC_SUMMARY_JSON)
    ac_profile = load_json(AC_PROFILE_JSON)
    a_linked_summary = load_json(A_LINKED_SUMMARY_JSON)
    abc_triad_profile = load_json(ABC_TRIAD_PROFILE_JSON)
    condition_window_deepening = load_json(CONDITION_WINDOW_DEEPENING_JSON)
    condition_window_narrative_bridge = load_json(CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON)
    cells = load_jsonl(BC_PATTERN_CELLS_JSONL)
    modules = build_modules(
        category_profile,
        b_profile,
        bc_summary,
        ac_profile,
        a_linked_summary,
        abc_triad_profile,
        condition_window_deepening,
        condition_window_narrative_bridge,
        cells,
    )

    route_counter: Counter[str] = Counter()
    fp_counter: Counter[str] = Counter()
    for item in modules:
        if item["status"].endswith("_yet"):
            continue
        route_counter.update(item["enriches_query_routes"])
        fp_counter.update(item["enriches_first_principles"])

    return {
        "dataset_id": DATASET_ID,
        "map_id": "2001_ABC_survey_falcon_network_nonchronological_integration_map_v0_2026_05_22",
        "status": "network_enrichment_map_unreviewed_no_promotion",
        "integration_stance": {
            "primary": "non_chronological_structural_enrichment",
            "meaning": "Use 2001 ABC as a structural evidence window for Falcon's expert knowledge network, not as a historical chapter or current-policy authority.",
            "not_allowed": [
                "current support guidance",
                "source/support validity decision",
                "support adequacy decision",
                "disease/disability-to-support lookup",
                "candidate_pattern movement",
                "reviewed knowledge promotion",
                "public/runtime approval",
            ],
        },
        "source_layers_used": [
            str(CATEGORY_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(B_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(BC_SUMMARY_JSON.relative_to(REPO_ROOT)),
            str(AC_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(A_LINKED_SUMMARY_JSON.relative_to(REPO_ROOT)),
            str(ABC_TRIAD_PROFILE_JSON.relative_to(REPO_ROOT)),
            str(CONDITION_WINDOW_DEEPENING_JSON.relative_to(REPO_ROOT)),
            str(CONDITION_WINDOW_MOTIFS_MD.relative_to(REPO_ROOT)),
            str(CONDITION_WINDOW_NARRATIVE_BRIDGE_JSON.relative_to(REPO_ROOT)),
            str(BC_PATTERN_CELLS_JSONL.relative_to(REPO_ROOT)),
        ],
        "module_count": len(modules),
        "active_enrichment_module_count": sum(1 for item in modules if item["status"] == "network_enrichment_candidate_unreviewed"),
        "prepared_hold_module_count": sum(1 for item in modules if item["status"].startswith("prepared_hold")),
        "query_route_enrichment_counts": dict(sorted(route_counter.items())),
        "first_principle_enrichment_counts": dict(sorted(fp_counter.items())),
        "modules": modules,
        "codex_chat_use": [
            "When a query concerns work content, first ask whether the issue is task label, contact point, load, information, evaluation, or participation meaning.",
            "When a query concerns support, treat support as retranslation and coordination function, not presence/absence.",
            "When a query concerns disability category or health condition, use it as a condition window for mechanism search: contact-point variation, function/activity differences, time/load effects, support translation, disclosure boundary, and alternative explanations.",
            "When using 2001 ABC evidence, state era and review limits only when relevant; do not foreground chronology as the main structure.",
        ],
        "source_content_exported": False,
        "narrative_content_included": False,
        "review_status": "unreviewed",
    }


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# 2001 ABC Survey Falcon Network Non-Chronological Integration Map",
        "",
        "作成日: 2026-05-22",
        "Lane: Falcon Lab",
        "状態: network enrichment map / no narrative text / 未レビュー / 昇格なし / runtime未承認",
        "本文引用: なし",
        "",
        "## Core Decision",
        "",
        "2001 ABC調査は、Falconの専門知識ネットワークに時系列の章として入れるのではなく、非時系列の構造 evidence window として入れる。",
        "",
        "理由は、Falconの中核が「2001年時点の知識」ではなく、人・仕事・環境・情報・時間・評価・支援・制度の相互作用を読む専門知識ネットワークだからである。2001年データの価値は、古い制度環境を代表することではなく、身体障害・知的障害を中心とする職場接触点、支援状態、本人側ニーズ、上司側観察、仕事内容記述を、同一単位で比較できることにある。",
        "",
        "## Integration Modules",
        "",
        "| module | function | routes | first principles | evidence windows |",
        "|---|---|---|---|---:|",
    ]
    for item in data["modules"]:
        evidence_count = sum(1 for window in item["evidence_windows"] if window.get("type") != "pattern_cells")
        routes = ", ".join(f"`{route}`" for route in item["enriches_query_routes"])
        fps = ", ".join(f"`{fp}`" for fp in item["enriches_first_principles"])
        lines.append(f"| `{item['module_id']}` | {item['network_function']} | {routes} | {fps} | {evidence_count} |")

    lines.extend(
        [
            "",
            "## Route Enrichment",
            "",
            "| query route | enrichment modules |",
            "|---|---:|",
        ]
    )
    for route, count in data["query_route_enrichment_counts"].items():
        lines.append(f"| `{route}` | {count} |")

    lines.extend(["", "## First Principle Enrichment", "", "| first principle | enrichment modules |", "|---|---:|"])
    for fp, count in data["first_principle_enrichment_counts"].items():
        lines.append(f"| `{fp}` | {count} |")

    lines.extend(["", "## Best Use In Falcon", ""])
    lines.extend(f"- {line}" for line in data["codex_chat_use"])

    lines.extend(
        [
            "",
            "## Non-Contamination Boundary",
            "",
            "- Do not use this as current support guidance.",
            "- Do not make support adequacy, employer accuracy, worker accuracy, or source validity decisions.",
            "- Do not convert disability categories, condition names, or diagnosis text into support lookup rules.",
            "- Do analyze condition-window relations when they are routed through explicit mechanisms and competing explanations.",
            "- Do not promote these modules to `candidate_pattern`, reviewed knowledge, public-safe, public-approved, runtime-approved, or expert-agent grounding without separate gates.",
            "- Treat chronology as context metadata, not the organizing principle.",
            "",
            "## Next Materialization",
            "",
            "The best next materialization is to generate Falcon chat retrieval cards from the active modules, each with route, first-principle, evidence-window counts, counter-reading, and human-review question. These cards should remain unreviewed and no-text until human audit.",
            "",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")

    overlay = [
        "# 2001 ABC Survey Codex Chat Network Overlay",
        "",
        "作成日: 2026-05-22",
        "状態: chat-use overlay / no narrative text / 未レビュー / 昇格なし",
        "",
        "## Use Rule",
        "",
        "Codex should use 2001 ABC as a structural enrichment layer for Falcon, not as a historical chapter. In answers, chronology should usually stay in the limits section, while the main reasoning uses Falcon's route / principle / freedom-axis structure.",
        "",
        "## When To Activate",
        "",
        "| user question shape | activate modules |",
        "|---|---|",
        "| 仕事内容、作業内容、職務設計、できる仕事 | `M01`, `M02`, `M07` |",
        "| 配慮、支援、有効性、必要性 | `M03`, `M04`, `M05` |",
        "| 事業所負担、雇用管理、外部助言 | `M09`, `M03`, `M07` |",
        "| 本人側ニーズ、有用性、満足度 | `M10`, `M03`, `M05`, `M07` |",
        "| A/B/C三者が揃った構造化対比 | `M11`, `M03`, `M09`, `M10` |",
        "| 情報保障、説明、相談、職場理解、開示 | `M04`, `M03`, `M06` |",
        "| 体調、疲労、勤務時間、通院、健康管理 | `M05`, `M03`, `M07` |",
        "| 通勤、生活、家族、外部支援、福祉接続 | `M06`, `M03` |",
        "| 障害種類・条件差・少数窓 | `M08`, plus `M02` / `M01` for contact-point variation |",
        "",
        "## Answering Style",
        "",
        "- Start from structure: contact point, translation mechanism, freedom state, learning loop.",
        "- Say that 2001 ABC can add a historical workplace-heavy contrast window when useful, but do not make chronology the main explanation.",
        "- Use module IDs and pattern-cell IDs as audit anchors when needed.",
        "- Do not quote narrative text or expose staging content.",
        "- State uncertainty as review boundary, not as apology.",
        "",
    ]
    CHAT_OVERLAY_MD.write_text("\n".join(overlay), encoding="utf-8")


def module_activation_terms(module_id: str) -> list[str]:
    terms = {
        "M01-work-content-surface-vs-work-design-meaning": ["仕事内容", "作業内容", "職務設計", "できる仕事", "役割", "評価"],
        "M02-worksite-contact-atlas": ["職場環境", "設備", "操作", "表示", "危険", "避難", "作業手順"],
        "M03-support-retranslation-gap": ["配慮", "支援", "必要性", "有効性", "実施", "未実施"],
        "M04-information-as-work-procedure": ["情報保障", "説明", "伝達", "相談", "開示", "職場理解"],
        "M05-health-time-visibility": ["体調", "疲労", "勤務時間", "通院", "健康管理", "休憩"],
        "M06-life-security-and-offwork-bridge": ["通勤", "生活", "家族", "外部支援", "福祉", "生活保障"],
        "M07-participation-quality-and-evaluation": ["満足度", "生産性", "評価", "やりがい", "人間関係", "キャリア"],
        "M08-condition-window-interaction-layer": ["障害種類", "条件差", "少数窓", "身体障害", "知的障害", "条件窓", "病名", "機能障害", "障害程度"],
        "M09-establishment-burden-advice-context": ["事業所負担", "雇用管理", "人事労務", "外部助言", "管理職", "従業員啓発"],
        "M10-worker-need-satisfaction-context": ["本人ニーズ", "有用性", "満足度", "仕事対象", "参加品質", "健康時間"],
        "M11-strict-coded-triad-structure": ["三者紐付け", "A/B/C", "負担と支援とニーズ", "構造化対比", "strict triad"],
    }
    return terms.get(module_id, [])


def evidence_window_summary(windows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    summary: list[dict[str, Any]] = []
    for window in windows:
        item = {"type": window.get("type", "unknown")}
        for key in [
            "axis",
            "cards",
            "weighted_cards",
            "category",
            "usable_pairs",
            "worker_need_without_supervisor_support",
            "worker_need_without_supervisor_support_rate",
            "usable_records",
            "any_problem_unresolved",
            "any_problem_resolved",
            "needed_any_constraint",
            "needed_any_constraint_rate",
            "block",
            "reason",
            "row_count",
            "status",
            "boundary",
            "deep_card_count",
            "pattern_cell_count",
            "strict_A_B_C_pair_count",
            "condition_window_profile_count",
            "interaction_card_count",
            "linked_B_C_pair_count",
            "motif_count",
            "motif_bridge_count",
            "deep_card_counts",
            "pattern_cell_counts",
            "artifact",
            "bridge_boundary",
        ]:
            if key in window:
                item[key] = window[key]
        for key in ["items", "groups", "profiles", "top_contrast_axes", "top_stage1_routes", "top_condition_window_cards", "motif_ids", "motif_bridges"]:
            if key in window:
                item[key] = window[key]
        if window.get("type") == "pattern_cells":
            item["cell_count"] = len(window.get("cells", []))
            item["top_pattern_cell_ids"] = [cell["pattern_cell_id"] for cell in window.get("cells", [])[:3]]
        summary.append(item)
    return summary


def write_chat_cards(data: dict[str, Any]) -> None:
    cards: list[dict[str, Any]] = []
    for module in data["modules"]:
        card = {
            "card_id": f"{DATASET_ID}:falcon-chat-overlay:{module['module_id']}",
            "dataset_id": DATASET_ID,
            "module_id": module["module_id"],
            "status": "chat_retrieval_card_unreviewed_no_runtime_approval",
            "activation_terms": module_activation_terms(module["module_id"]),
            "integration_mode": module["integration_mode"],
            "network_function": module["network_function"],
            "query_routes": module["enriches_query_routes"],
            "first_principles": module["enriches_first_principles"],
            "evidence_window_summary": evidence_window_summary(module["evidence_windows"]),
            "answer_moves": [
                "start from interaction structure rather than disability label",
                "identify contact point, translation mechanism, freedom state, and missing context",
                "use 2001 ABC as a structural contrast window only when it sharpens the answer",
                "keep chronology in limits rather than as the main explanation",
            ],
            "counter_reading": "The observed structure may reflect survey item design, perspective difference, missing context, or historical selection rather than a reusable mechanism.",
            "human_review_question": module["human_review_question"],
            "do_not_use_for": module["contamination_guard"],
            "source_content_exported": False,
            "narrative_content_included": False,
            "review_status": "unreviewed",
        }
        cards.append(card)

    with CHAT_CARDS_JSONL.open("w", encoding="utf-8") as out:
        for card in cards:
            out.write(json.dumps(card, ensure_ascii=False) + "\n")

    lines = [
        "# 2001 ABC Survey Falcon Chat Retrieval Cards",
        "",
        "作成日: 2026-05-22",
        "状態: chat retrieval cards / no narrative text / 未レビュー / runtime未承認",
        "",
        "| card | activation terms | routes | first principles |",
        "|---|---|---|---|",
    ]
    for card in cards:
        terms = ", ".join(f"`{term}`" for term in card["activation_terms"])
        routes = ", ".join(f"`{route}`" for route in card["query_routes"])
        fps = ", ".join(f"`{fp}`" for fp in card["first_principles"])
        lines.append(f"| `{card['card_id']}` | {terms} | {routes} | {fps} |")
    lines.extend(
        [
            "",
            "## Boundary",
            "",
            "- These cards are retrieval and reasoning aids only.",
            "- They are not reviewed knowledge, public content, or runtime-approved grounding.",
            "- They contain no narrative text.",
            "",
        ]
    )
    CHAT_CARDS_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    data = build_outputs()
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    write_chat_cards(data)
    print(
        json.dumps(
            {
                "module_count": data["module_count"],
                "active_enrichment_module_count": data["active_enrichment_module_count"],
                "prepared_hold_module_count": data["prepared_hold_module_count"],
                "output": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
                "chat_cards": str(CHAT_CARDS_JSONL.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
