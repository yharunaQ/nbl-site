#!/usr/bin/env python3
"""Consume the human-readable FT03 Evidence/Validity review result.

This records what the review actually moved: readability, internal structural
use boundary, source-basis traceability for internal review, and support-claim
boundary clarity. It does not move source validity, support validity, public
approval, runtime approval, candidate-pattern status, Domain Core, Atlas/27-frame,
or individual judgment.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RESULT_JSON = Path(
    "/Users/YuichiroHARUNA/Downloads/"
    "stage1-production-ft03-evidence-validity-readable-review-result-filled-v0-2026-05-26.json"
)
UNITS_JSON = RUN_DIR / "stage1-production-ft03-evidence-validity-readable-review-units-v0-2026-05-26.json"

PREFIX = "stage1-production-ft03-readable-ev-review-result-interpretation-v0-2026-05-26"
OUT_MD = RUN_DIR / f"{PREFIX}.md"
OUT_JSON = RUN_DIR / f"{PREFIX}.json"

DATE = "2026-05-26"

MUST_NOT_MOVE = [
    "source_validity",
    "support_validity",
    "public_safe/public_approved",
    "runtime_approved",
    "candidate_pattern",
    "Domain Core",
    "Atlas / 27-frame",
    "medical/legal/employment/accommodation/support finality",
    "individual case judgment",
]

PROHIBITED_MARKERS = [
    "_x000D_",
    "PERSON_NAME",
    "MEDICAL_INSTITUTION",
    "raw_quote",
    "candidate_pattern_promoted",
]


def validate(payload: Any) -> None:
    text = payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False)
    for marker in PROHIBITED_MARKERS:
        if marker in text:
            raise SystemExit(f"prohibited marker found: {marker}")


def read_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    validate(payload)
    return payload


def write_json(path: Path, payload: dict[str, Any]) -> None:
    validate(payload)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_md(path: Path, text: str) -> None:
    validate(text)
    path.write_text(text, encoding="utf-8")


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def count_marks(results: dict[str, dict[str, Any]], field: str) -> dict[str, int]:
    return dict(sorted(Counter(row.get(field, "") for row in results.values()).items()))


def build_interpretation(units: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    results = result.get("results", {})
    unit_ids = {unit["unit_id"] for unit in units["units"]}
    reviewed_ids = set(results)
    missing = sorted(unit_ids - reviewed_ids)
    extra = sorted(reviewed_ids - unit_ids)

    mark_counts = {
        "readability_mark": count_marks(results, "readability_mark"),
        "scope_mark": count_marks(results, "scope_mark"),
        "evidence_trace_mark": count_marks(results, "evidence_trace_mark"),
        "support_boundary_mark": count_marks(results, "support_boundary_mark"),
    }
    notes = {
        unit_id: row.get("review_note", "")
        for unit_id, row in results.items()
        if row.get("review_note")
    }
    all_clear = (
        not missing
        and not extra
        and len(results) == units["unit_count"]
        and mark_counts["readability_mark"] == {"clear": units["unit_count"]}
        and mark_counts["scope_mark"] == {"scope_ok_for_internal_structural_use": units["unit_count"]}
        and mark_counts["evidence_trace_mark"] == {"trace_enough_for_internal_review": units["unit_count"]}
        and mark_counts["support_boundary_mark"] == {"not_support_validity_claim": units["unit_count"]}
    )

    moved_statuses = []
    if all_clear:
        moved_statuses = [
            "readable_ev_units_human_reviewed_as_understandable",
            "stage1_ft03_interpretation_output_boundary_reviewed_for_internal_structural_use",
            "source_basis_trace_reviewed_for_internal_review_only",
            "support_validity_boundary_reviewed_as_not_support_claims",
            "old_78_claim_ev_surface_confirmed_superseded_for_human_review",
        ]

    return {
        "artifact_id": PREFIX,
        "date": DATE,
        "lane": "Falcon / Falcon Lab",
        "status": "readable EV review result interpretation / boundary movement only / no validity movement",
        "question_answered": "The Founder reviewed the readability, internal-use scope, source-basis traceability for internal review, and support-claim boundary of the Stage 1 FT03 interpretation/output layer, not the empirical core validity itself.",
        "reviewed_layer": "interpretation_and_output_boundary_layer",
        "reviewed_layer_plain_japanese": "専門知識ネットワークのコアそのものではなく、その候補をFalconがどう読んで、どこまで出力してよいかのガイドライン層。",
        "not_reviewed_layer": [
            "raw/original evidence validity",
            "source validity final judgment",
            "support/intervention validity",
            "public copy safety or approval",
            "runtime behavior approval",
            "candidate_pattern / Domain Core / Atlas movement",
        ],
        "result_counts": {
            "expected_units": units["unit_count"],
            "reviewed_units": len(results),
            "missing_units": missing,
            "extra_units": extra,
            "notes_with_text": len(notes),
        },
        "mark_counts": mark_counts,
        "all_clear_for_this_layer": all_clear,
        "moved_statuses": moved_statuses,
        "what_this_allows": [
            "Use the 8 route views as a human-readable internal interpretation guide.",
            "Use the 32 readable units as the current reviewed answer-discipline layer for Falcon Lab.",
            "Treat the old 78-claim EV tool as internal trace material, not the human review surface.",
            "Proceed to a separate evidence/source/support validity review only after creating source-linked claim cards.",
        ],
        "what_it_does_not_allow": MUST_NOT_MOVE,
        "why_it_felt_repetitive": [
            "Each of the 8 routes repeated the same four checks: core proposition, source-basis, use boundary, guardrail.",
            "That repetition tested consistency of the output boundary, not independent empirical evidence.",
            "The process was therefore closer to reviewing Falcon's reading/output contract than reviewing the knowledge network's source validity.",
        ],
        "next_needed_for_actual_core_validity": [
            "Turn each route into source-linked evidence cards with specific source artifacts and support/non-support claim separation.",
            "Review evidence strength by source family rather than repeating output-boundary checks.",
            "Only then consider source/support validity movement, still without public/runtime/candidate promotion.",
        ],
        "inputs": {
            "review_result": str(RESULT_JSON),
            "readable_units": rel(UNITS_JSON),
        },
        "must_not_move": MUST_NOT_MOVE,
    }


def render_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Readable EV Review Result Interpretation",
        "",
        f"作成日: {DATE}",
        "Lane: Falcon / Falcon Lab",
        "Status: readable EV review result interpretation / boundary movement only / no validity movement",
        "",
        "## What Was Reviewed",
        "",
        payload["reviewed_layer_plain_japanese"],
        "",
        "つまり、今回のレビューは専門知識ネットワークの empirical core validity そのものではなく、Stage 1 FT03の中核候補をFalconが内部でどう読んで、どう出力してよいかの境界を確認したもの。",
        "",
        "## What Was Not Reviewed",
        "",
        *[f"- {item}" for item in payload["not_reviewed_layer"]],
        "",
        "## Result",
        "",
        f"- Reviewed units: {payload['result_counts']['reviewed_units']} / {payload['result_counts']['expected_units']}",
        f"- All clear for this layer: `{str(payload['all_clear_for_this_layer']).lower()}`",
        f"- Notes with text: {payload['result_counts']['notes_with_text']}",
        "",
        "## Mark Counts",
        "",
        f"- Readability: `{json.dumps(payload['mark_counts']['readability_mark'], ensure_ascii=False)}`",
        f"- Scope: `{json.dumps(payload['mark_counts']['scope_mark'], ensure_ascii=False)}`",
        f"- Evidence trace: `{json.dumps(payload['mark_counts']['evidence_trace_mark'], ensure_ascii=False)}`",
        f"- Support boundary: `{json.dumps(payload['mark_counts']['support_boundary_mark'], ensure_ascii=False)}`",
        "",
        "## Moved Statuses",
        "",
        *[f"- {item}" for item in payload["moved_statuses"]],
        "",
        "## Why It Felt Repetitive",
        "",
        *[f"- {item}" for item in payload["why_it_felt_repetitive"]],
        "",
        "## What This Allows",
        "",
        *[f"- {item}" for item in payload["what_this_allows"]],
        "",
        "## What It Does Not Allow",
        "",
        *[f"- {item}" for item in payload["what_it_does_not_allow"]],
        "",
        "## Next Needed For Actual Core Validity",
        "",
        *[f"- {item}" for item in payload["next_needed_for_actual_core_validity"]],
        "",
        f"JSON: `{rel(OUT_JSON)}`",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    units = read_json(UNITS_JSON)
    result = read_json(RESULT_JSON)
    payload = build_interpretation(units, result)
    write_json(OUT_JSON, payload)
    write_md(OUT_MD, render_md(payload))
    print(f"wrote {rel(OUT_MD)}")
    print(f"reviewed units: {payload['result_counts']['reviewed_units']} / {payload['result_counts']['expected_units']}")
    print(f"all clear for this layer: {payload['all_clear_for_this_layer']}")


if __name__ == "__main__":
    main()
