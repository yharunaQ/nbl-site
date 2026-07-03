#!/usr/bin/env python3
"""Build no-text SCIMA/FCHMA narrative card candidates for 2001 ABC."""

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
ROUTE_MAP_JSON = DERIVED_DIR / "2001-abc-survey-narrative-stage1-structure-route-map-v0-2026-05-22.json"

CARD_CANDIDATES_JSONL = STAGING_DIR / "narrative_single_perspective_card_candidates.jsonl"
LINKED_CANDIDATES_JSONL = STAGING_DIR / "narrative_linked_contrast_candidates.jsonl"
SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-narrative-card-candidate-summary-v0-2026-05-22.json"
SUMMARY_MD = DERIVED_DIR / "2001-abc-survey-narrative-card-candidate-summary-v0-2026-05-22.md"


def stable_hash(*parts: str | None) -> str:
    return sha256("|".join(part or "" for part in parts).encode("utf-8")).hexdigest()[:24]


def card_families(record: dict[str, Any]) -> list[str]:
    table = record["source_table"]
    role = record["field_role"]
    families: list[str] = []
    if table == "A":
        if role in {
            "A_added_establishment_context_narrative",
            "A_employment_reason_challenge_narrative",
            "external_support_advice_narrative",
            "general_open_narrative",
        }:
            families.append("A_establishment_narrative_context_card")
        if role == "external_support_advice_narrative":
            families.append("A_external_advice_use_context_card")
        if role == "A_employment_reason_challenge_narrative":
            families.append("A_employment_reason_challenge_context_card")
    elif table == "B":
        if role == "work_content_narrative":
            families.append("B_work_content_contact_narrative_card")
        if role in {"support_practice_narrative", "external_support_advice_narrative", "general_open_narrative"}:
            families.append("B_support_practice_narrative_card")
        if role == "external_support_advice_narrative":
            families.append("B_external_support_connection_narrative_card")
    elif table == "C":
        if role == "work_content_narrative":
            families.append("C_worker_work_content_narrative_card")
        if role in {"support_practice_narrative", "general_open_narrative"}:
            families.append("C_worker_need_policy_narrative_card")
        if role == "sensitive_health_condition_text":
            families.append("C_sensitive_health_condition_normalization_hold")
    return families or ["narrative_role_needs_review_card"]


def scope_hash_for(record: dict[str, Any]) -> str | None:
    if record["source_table"] == "A":
        return record.get("establishment_hash")
    return record.get("pair_hash") or record.get("establishment_hash")


def load_route_map() -> dict[str, dict[str, Any]]:
    data = json.loads(ROUTE_MAP_JSON.read_text(encoding="utf-8"))
    return {item["card_family"]: item for item in data["route_map"]}


def missing_context_flags(card: dict[str, Any]) -> list[str]:
    flags: list[str] = []
    if card["source_table"] == "A":
        flags.extend(["no_worker_perspective_in_single_card", "no_supervisor_perspective_in_single_card"])
    elif card["source_table"] == "B":
        flags.extend(["no_worker_perspective_in_single_card", "no_establishment_context_in_single_card"])
    elif card["source_table"] == "C":
        flags.extend(["no_supervisor_perspective_in_single_card", "no_establishment_context_in_single_card"])
    if card["sensitive_health_unit_count"]:
        flags.append("sensitive_health_text_review_required")
    if "narrative_role_needs_review_card" == card["card_family"]:
        flags.append("field_role_manual_review_required")
    return flags


def candidate_kind(card_family: str) -> str:
    if card_family.startswith("A_"):
        return "single_perspective_establishment_context"
    if card_family.startswith("B_"):
        return "single_perspective_supervisor_workplace"
    if card_family.startswith("C_"):
        return "single_perspective_worker"
    return "single_perspective_manual_review_hold"


def build_single_perspective_cards(route_map: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str | None, str], dict[str, Any]] = {}
    with UNITS_JSONL.open("r", encoding="utf-8") as src:
        for line in src:
            if not line.strip():
                continue
            record = json.loads(line)
            for family in card_families(record):
                scope_hash = scope_hash_for(record)
                key = (family, scope_hash, record["source_table"])
                card = groups.setdefault(
                    key,
                    {
                        "dataset_id": DATASET_ID,
                        "card_id": f"{DATASET_ID}:narrative-card:{stable_hash(family, scope_hash, record['source_table'])}",
                        "card_family": family,
                        "candidate_kind": candidate_kind(family),
                        "source_table": record["source_table"],
                        "perspective": record["perspective"],
                        "scope_hash": scope_hash,
                        "establishment_hash": record.get("establishment_hash"),
                        "pair_hash": record.get("pair_hash"),
                        "unit_ids": [],
                        "unit_count": 0,
                        "field_roles": Counter(),
                        "signals": Counter(),
                        "columns": Counter(),
                        "sensitive_health_unit_count": 0,
                        "source_content_exported": False,
                        "narrative_content_included": False,
                        "review_status": "unreviewed_candidate",
                        "allowed_use": "SCIMA_FCHMA_candidate_card_only",
                    },
                )
                card["unit_ids"].append(record["unit_id"])
                card["unit_count"] += 1
                card["field_roles"][record["field_role"]] += 1
                card["signals"].update(record.get("deterministic_scima_fchma_signal_flags", []))
                card["columns"][str(record["column"])] += 1
                if record.get("sensitive_health_text"):
                    card["sensitive_health_unit_count"] += 1

    cards: list[dict[str, Any]] = []
    for card in groups.values():
        route_info = route_map.get(card["card_family"], {})
        clean = dict(card)
        clean["candidate_id"] = clean["card_id"]
        clean["unit_ids"] = sorted(card["unit_ids"])
        clean["field_roles"] = dict(sorted(card["field_roles"].items()))
        clean["signals"] = dict(sorted(card["signals"].items()))
        clean["columns"] = dict(sorted(card["columns"].items(), key=lambda item: int(item[0])))
        clean["stage1_route_candidates"] = route_info.get("direct_stage1_routes", ["manual-route-review-hold"])
        clean["routes"] = clean["stage1_route_candidates"]
        clean["signal_weighted_route_counts"] = route_info.get("signal_weighted_route_counts", {})
        clean["missing_context_flags"] = missing_context_flags(clean)
        clean["interpretation_boundary"] = (
            "candidate card only; no support validity, source validity, case judgment, "
            "current-policy claim, or knowledge promotion"
        )
        cards.append(clean)
    return sorted(cards, key=lambda card: (card["card_family"], card["scope_hash"] or ""))


def linked_contrast_candidates(cards: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_pair: dict[str, dict[str, list[dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    by_est: dict[str, dict[str, list[dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    for card in cards:
        if card.get("pair_hash"):
            by_pair[card["pair_hash"]][card["card_family"]].append(card)
        if card.get("establishment_hash"):
            by_est[card["establishment_hash"]][card["card_family"]].append(card)

    specs = [
        {
            "contrast_family": "B_C_work_content_narrative_contrast_candidate",
            "scope": "pair",
            "left": "B_work_content_contact_narrative_card",
            "right": "C_worker_work_content_narrative_card",
            "routes": ["C05-worksite-contact", "C07-quality-participation"],
            "boundary": "compare supervisor-side and worker-side work-content language without deciding which is more accurate",
        },
        {
            "contrast_family": "B_C_support_practice_need_narrative_contrast_candidate",
            "scope": "pair",
            "left": "B_support_practice_narrative_card",
            "right": "C_worker_need_policy_narrative_card",
            "routes": ["C03-support-continuity", "C05-worksite-contact", "C07-quality-participation"],
            "boundary": "compare support practice language and worker need/policy language without support adequacy judgment",
        },
        {
            "contrast_family": "A_B_establishment_support_context_narrative_contrast_candidate",
            "scope": "establishment",
            "left": "A_establishment_narrative_context_card",
            "right": "B_support_practice_narrative_card",
            "routes": ["C03-support-continuity", "C05-worksite-contact", "C07-quality-participation"],
            "boundary": "compare establishment context and supervisor support-practice language without employer-side final judgment",
        },
        {
            "contrast_family": "A_C_establishment_worker_need_narrative_contrast_candidate",
            "scope": "establishment",
            "left": "A_establishment_narrative_context_card",
            "right": "C_worker_need_policy_narrative_card",
            "routes": ["C03-support-continuity", "C06-life-security", "C07-quality-participation"],
            "boundary": "compare establishment context and worker need/policy language without treating one as truth",
        },
    ]

    contrasts: list[dict[str, Any]] = []
    for spec in specs:
        source = by_pair if spec["scope"] == "pair" else by_est
        for scope_hash, family_map in source.items():
            left_cards = family_map.get(spec["left"], [])
            right_cards = family_map.get(spec["right"], [])
            if not left_cards or not right_cards:
                continue
            left = left_cards[0]
            right = right_cards[0]
            contrast_id = f"{DATASET_ID}:narrative-contrast:{stable_hash(spec['contrast_family'], scope_hash)}"
            signals = Counter()
            signals.update(left.get("signals", {}))
            signals.update(right.get("signals", {}))
            routes = spec["routes"]
            contrasts.append(
                {
                    "dataset_id": DATASET_ID,
                    "candidate_id": contrast_id,
                    "contrast_id": contrast_id,
                    "contrast_family": spec["contrast_family"],
                    "scope": spec["scope"],
                    "scope_hash": scope_hash,
                    "establishment_hash": left.get("establishment_hash") or right.get("establishment_hash"),
                    "pair_hash": left.get("pair_hash") or right.get("pair_hash"),
                    "source_card_ids": [left["card_id"], right["card_id"]],
                    "source_card_families": [left["card_family"], right["card_family"]],
                    "unit_count": left["unit_count"] + right["unit_count"],
                    "signals": dict(sorted(signals.items())),
                    "stage1_route_candidates": routes,
                    "routes": routes,
                    "source_content_exported": False,
                    "narrative_content_included": False,
                    "review_status": "unreviewed_contrast_candidate",
                    "interpretation_boundary": spec["boundary"],
                }
            )
    return sorted(contrasts, key=lambda item: (item["contrast_family"], item["scope_hash"]))


def counter_from(items: list[dict[str, Any]], key: str) -> dict[str, int]:
    counter: Counter[str] = Counter()
    for item in items:
        counter[item[key]] += 1
    return dict(sorted(counter.items()))


def route_counter(items: list[dict[str, Any]]) -> dict[str, int]:
    counter: Counter[str] = Counter()
    for item in items:
        counter.update(item.get("stage1_route_candidates", []))
    return dict(sorted(counter.items()))


def write_outputs(cards: list[dict[str, Any]], contrasts: list[dict[str, Any]]) -> None:
    with CARD_CANDIDATES_JSONL.open("w", encoding="utf-8") as out:
        for card in cards:
            out.write(json.dumps(card, ensure_ascii=False) + "\n")
    with LINKED_CANDIDATES_JSONL.open("w", encoding="utf-8") as out:
        for contrast in contrasts:
            out.write(json.dumps(contrast, ensure_ascii=False) + "\n")

    summary = {
        "dataset_id": DATASET_ID,
        "summary_id": "2001_ABC_survey_narrative_card_candidate_summary_v0_2026_05_22",
        "status": "candidate_cards_generated_no_text_unreviewed",
        "single_perspective_card_candidates": str(CARD_CANDIDATES_JSONL.relative_to(REPO_ROOT)),
        "linked_contrast_candidates": str(LINKED_CANDIDATES_JSONL.relative_to(REPO_ROOT)),
        "source_content_exported": False,
        "narrative_content_exported_to_references": False,
        "narrative_content_included_in_candidates": False,
        "single_perspective_card_count": len(cards),
        "linked_contrast_candidate_count": len(contrasts),
        "card_family_counts": counter_from(cards, "card_family"),
        "contrast_family_counts": counter_from(contrasts, "contrast_family"),
        "single_card_route_counts": route_counter(cards),
        "linked_contrast_route_counts": route_counter(contrasts),
        "boundary": [
            "candidate cards contain no raw or redacted narrative text",
            "unit_ids link back to redacted staging only",
            "cards are unreviewed and not knowledge promotion",
            "no support validity judgment",
            "no disease-to-support lookup",
        ],
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# 2001 ABC Survey Narrative Card Candidate Summary",
        "",
        "作成日: 2026-05-22",
        "Lane: Falcon Lab",
        "状態: candidate cards generated / no text / 未レビュー / 統合なし / 昇格なし",
        "本文引用: なし",
        "row-level回答本文のreferences外部化: なし",
        "",
        "## Generated",
        "",
        f"- single-perspective card candidates: `{summary['single_perspective_card_candidates']}`",
        f"- linked contrast candidates: `{summary['linked_contrast_candidates']}`",
        f"- single-perspective card count: {len(cards)}",
        f"- linked contrast candidate count: {len(contrasts)}",
        "",
        "## Single-Perspective Card Families",
        "",
        "| card family | candidates |",
        "|---|---:|",
    ]
    for family, count in summary["card_family_counts"].items():
        lines.append(f"| `{family}` | {count} |")
    lines.extend(["", "## Linked Contrast Families", "", "| contrast family | candidates |", "|---|---:|"])
    for family, count in summary["contrast_family_counts"].items():
        lines.append(f"| `{family}` | {count} |")
    lines.extend(["", "## Route Counts", "", "| route | single cards | linked contrasts |", "|---|---:|---:|"])
    routes = sorted(set(summary["single_card_route_counts"]) | set(summary["linked_contrast_route_counts"]))
    for route in routes:
        lines.append(
            f"| `{route}` | {summary['single_card_route_counts'].get(route, 0)} | "
            f"{summary['linked_contrast_route_counts'].get(route, 0)} |"
        )
    lines.extend(
        [
            "",
            "## Boundary",
            "",
            "- Candidate files contain unit ids and aggregate flags, not narrative text.",
            "- These are SCIMA/FCHMA work queues, not findings.",
            "- Human review and deeper context reading remain required before any knowledge promotion.",
            "",
        ]
    )
    SUMMARY_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    route_map = load_route_map()
    cards = build_single_perspective_cards(route_map)
    contrasts = linked_contrast_candidates(cards)
    write_outputs(cards, contrasts)
    print(
        json.dumps(
            {
                "single_perspective_card_count": len(cards),
                "linked_contrast_candidate_count": len(contrasts),
                "summary": str(SUMMARY_JSON.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
