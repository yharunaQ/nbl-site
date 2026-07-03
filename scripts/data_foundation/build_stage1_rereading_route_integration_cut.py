#!/usr/bin/env python3
"""Integrate CR-01..CR-05 rereading outputs into route-level Core implications."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
PREFIX = "stage1-production-rereading-route-integration-cut-v0-2026-05-23"

INPUTS = {
    "CR-01": OUT_DIR / "stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.json",
    "CR-02": OUT_DIR / "stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.json",
    "CR-03": OUT_DIR / "stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.json",
    "CR-04": OUT_DIR / "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.json",
    "CR-05": OUT_DIR / "stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.json",
}


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def action_count(data: dict[str, Any], action: str) -> int:
    return int(data.get("action_counts", {}).get(action, 0))


def main() -> None:
    loaded = {key: load(path) for key, path in INPUTS.items()}
    for key, data in loaded.items():
        assert data["raw_original_opened"] is False, key
        assert data["source_text_exported"] is False, key
        assert data["redacted_text_exported"] is False, key
        assert data["field_value_exported"] is False, key

    route_implications = [
        {
            "route_id": "RI-01-health-time-life-security",
            "source_context_reading": "CR-01",
            "corridor": loaded["CR-01"]["corridor"],
            "record_count": loaded["CR-01"]["record_count"],
            "context_advanced": action_count(loaded["CR-01"], "advance_as_health_time_life_security_context_candidate"),
            "needs_context_confirmation": action_count(loaded["CR-01"], "structured_coverage_needs_context_confirmation"),
            "brake_or_boundary": action_count(loaded["CR-01"], "keep_for_boundary_or_cross_axis_check"),
            "core_integration": "keep active as health-time / work-design / life-security interaction route",
            "what_it_thickens": [
                "health-time is not only symptom management; it can be implemented through work-time, task-load, support, sequence, and life-security freedoms",
                "life-security should be modeled as a constraint surface on work choice and continuity, not as a background attribute",
            ],
            "what_it_prevents": [
                "income or livelihood signals becoming proof of work difficulty",
                "health-time signals absorbing all life-security or support issues",
            ],
        },
        {
            "route_id": "RI-02-quality-value-translation",
            "source_context_reading": "CR-02",
            "corridor": loaded["CR-02"]["corridor"],
            "record_count": loaded["CR-02"]["record_count"],
            "context_advanced": action_count(loaded["CR-02"], "advance_as_value_translation_context_candidate"),
            "needs_context_confirmation": action_count(loaded["CR-02"], "structured_coverage_needs_context_confirmation"),
            "brake_or_boundary": action_count(loaded["CR-02"], "keep_for_boundary_or_adjacent_axis_check"),
            "core_integration": "keep as narrow value-translation route, not as standalone career-quality completion",
            "what_it_thickens": [
                "career quality must be read as role/evaluation/treatment/future-outlook translation when context closes",
                "satisfaction or work status alone is not enough to strengthen C07",
            ],
            "what_it_prevents": [
                "questionnaire coverage inflating Core confidence",
                "satisfaction-only signals turning into career-quality claims",
            ],
        },
        {
            "route_id": "RI-03-prework-entry-translation",
            "source_context_reading": "CR-03",
            "corridor": loaded["CR-03"]["corridor"],
            "record_count": loaded["CR-03"]["record_count"],
            "context_advanced": action_count(loaded["CR-03"], "advance_as_prework_entry_context_candidate"),
            "needs_context_confirmation": action_count(loaded["CR-03"], "structured_coverage_needs_context_confirmation"),
            "brake_or_boundary": action_count(loaded["CR-03"], "keep_for_hold_or_adjacent_axis_check"),
            "core_integration": "keep as narrow pre-entry translation route, not as readiness-deficit logic",
            "what_it_thickens": [
                "training, life rhythm, stamina, support bridge, and entry action matter only when read as a sequence",
                "entry route should preserve nonwork and low-context records as ethical brakes",
            ],
            "what_it_prevents": [
                "nonwork orientation becoming lack-of-readiness interpretation",
                "preparation or training signals becoming support recommendation logic",
            ],
        },
        {
            "route_id": "RI-04-worksite-contact",
            "source_context_reading": "CR-04",
            "corridor": loaded["CR-04"].get("corridor", "RR-04-worksite-contact-minority-window"),
            "record_count": loaded["CR-04"]["record_count"],
            "context_advanced": action_count(loaded["CR-04"], "advance_as_contact_point_context_candidate"),
            "needs_context_confirmation": 0,
            "brake_or_boundary": action_count(loaded["CR-04"], "keep_for_boundary_or_structured_raw_check"),
            "core_integration": "strongest current Stage 1 Core strengthening route",
            "what_it_thickens": [
                "worksite contact can be decomposed into task/workflow, access/rest/safety, information contact, mobility, body-posture-energy, support retranslation, and evaluation-value interfaces",
                "C05 becomes a contact-point grammar rather than an equipment list or disability-category table",
            ],
            "what_it_prevents": [
                "accommodation logic collapsing into fixed item lists",
                "worksite signals becoming support adequacy judgments",
            ],
        },
        {
            "route_id": "RI-05-residual-hold-counterexamples",
            "source_context_reading": "CR-05",
            "corridor": loaded["CR-05"]["corridor"],
            "record_count": loaded["CR-05"]["record_count"],
            "context_advanced": 0,
            "needs_context_confirmation": 0,
            "brake_or_boundary": loaded["CR-05"]["record_count"],
            "core_integration": "explicit brake and counterexample layer, not support evidence",
            "what_it_thickens": [
                "Core claims must survive body/function boundary, nonwork/low-context, residual health-time/life-security, and unclosed support-bridge checks",
                "RR-05 is the pressure-test layer that keeps Falcon from becoming a fluent but single-cause model",
            ],
            "what_it_prevents": [
                "diagnosis or impairment becoming direct support logic",
                "residual records being counted as Core support",
            ],
        },
    ]

    payload = {
        "artifact_id": PREFIX,
        "lane": "Falcon / Falcon Lab",
        "status": "route_integration_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "input_artifacts": {key: str(path.relative_to(ROOT)) for key, path in INPUTS.items()},
        "integration_rule": [
            "Count context-advanced records as route-strengthening pressure only when redacted context closes the relation.",
            "Treat structured-field coverage as possibility-window evidence, not Core support.",
            "Treat CR-05 as brake/counterexample layer; do not add it to support counts.",
            "This artifact changes no review status, candidate_pattern, Domain Core, public-safe, public-approved, or runtime-approved state.",
        ],
        "route_implications": route_implications,
        "current_core_shape": [
            "CR-04/C05 is currently the thickest route and can carry worksite-contact grammar development.",
            "CR-01/C01-C06 is real but boundary-sensitive; life-security should be integrated as sequencing freedom, not as background or deficit.",
            "CR-02/C07 and CR-03/C08 remain live but narrow; most records are structured-coverage windows rather than context-closed relations.",
            "CR-05 supplies mandatory brake checks before any route is described as complete.",
        ],
        "not_complete_reasons": [
            "raw original remains unopened under the permissioned ladder",
            "C07 and C08 are under-closed at record-context level",
            "human review has not evaluated these route implications",
            "source/support/intervention validity remains out of scope",
        ],
    }
    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(payload), encoding="utf-8")
    print(PREFIX, "routes=", len(route_implications))


def make_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Rereading Route Integration Cut",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: route integration / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        "CR-01..CR-05のrecord-level再読解を、Stage 1 Coreへどう入れるかのroute判断へ変換する。",
        "",
        "## Integration Rule",
    ]
    for item in payload["integration_rule"]:
        lines.append(f"- {item}")
    lines.extend(["", "## Route Implications", ""])
    for route in payload["route_implications"]:
        lines.extend([
            f"### {route['route_id']}",
            f"- source: {route['source_context_reading']} / `{route['corridor']}`",
            f"- records: {route['record_count']}",
            f"- context_advanced: {route['context_advanced']}",
            f"- needs_context_confirmation: {route['needs_context_confirmation']}",
            f"- brake_or_boundary: {route['brake_or_boundary']}",
            f"- core_integration: {route['core_integration']}",
            "- thickens:",
        ])
        for item in route["what_it_thickens"]:
            lines.append(f"  - {item}")
        lines.append("- prevents:")
        for item in route["what_it_prevents"]:
            lines.append(f"  - {item}")
        lines.append("")
    lines.append("## Current Core Shape")
    for item in payload["current_core_shape"]:
        lines.append(f"- {item}")
    lines.append("")
    lines.append("## Not Complete Reasons")
    for item in payload["not_complete_reasons"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
