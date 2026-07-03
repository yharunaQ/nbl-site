#!/usr/bin/env python3
"""Build the FT03 human-review/source-validity input packet.

This prepares review questions only. It does not perform review or assign
source/support validity.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
STAGE2_DIR = ROOT / "references/derived/scima-fchma/stage2-first-principles-ft03-v0-2026-05-23"
STAGE3_DIR = ROOT / "references/derived/scima-fchma/stage3-japan-improvement-agenda-ft03-v0-2026-05-23"
OUT_ID = "stage1-production-ft03-human-review-source-validity-packet-v0-2026-05-23"
OUT_JSON = RUN_DIR / f"{OUT_ID}.json"
OUT_MD = RUN_DIR / f"{OUT_ID}.md"


REVIEW_ITEMS: list[dict[str, Any]] = [
    {
        "review_item_id": "FT03-HR-01-core-candidate-completion-cut",
        "artifact": RUN_DIR / "stage1-production-core-candidate-completion-cut-ft03-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether the FT03 cut is sufficient as an unreviewed internal expert-network candidate for Codex use.",
        "allowed_result_values": ["accept_internal_candidate_cut", "revise_cut_before_use", "hold_cut"],
        "must_not_decide_here": ["public approval", "runtime approval", "support validity", "source validity", "individual case judgment"],
    },
    {
        "review_item_id": "FT03-HR-02-route-readiness-and-brakes",
        "artifact": RUN_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether each route's use_for and do_not_use_for boundaries are appropriate for internal analysis.",
        "allowed_result_values": ["accept_route_brakes", "revise_route_brakes", "hold_specific_route"],
        "must_not_decide_here": ["candidate_pattern promotion", "Domain Core movement", "public-ready route status"],
    },
    {
        "review_item_id": "FT03-HR-03-source-lens-triangulation",
        "artifact": RUN_DIR / "stage1-production-source-lens-saturation-map-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether respondent, supporter, workplace, NIVR, workshop, web-cache, and 2001 ABC are separated and triangulated appropriately.",
        "allowed_result_values": ["accept_source_lens_separation", "revise_source_lens_use", "hold_source_lens"],
        "must_not_decide_here": ["source validity", "support validity", "which actor is correct"],
    },
    {
        "review_item_id": "FT03-HR-04-condition-window-guardrail",
        "artifact": RUN_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether the condition-window framing avoids both tabooing condition labels and simple diagnosis/disability lookup.",
        "allowed_result_values": ["accept_condition_window_guardrail", "revise_condition_window_language", "hold_condition_window_use"],
        "must_not_decide_here": ["diagnosis-to-accommodation rules", "condition-to-work-capacity inference"],
    },
    {
        "review_item_id": "FT03-HR-05-first-principles-refresh",
        "artifact": STAGE2_DIR / "falcon-first-principles-framework-from-stage1-ft03-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether the FT03 first-principles framework follows from the Stage 1 candidate cut and preserves boundaries.",
        "allowed_result_values": ["accept_internal_framework", "revise_framework", "hold_framework"],
        "must_not_decide_here": ["public doctrine", "policy recommendation approval", "runtime behavior"],
    },
    {
        "review_item_id": "FT03-HR-06-japan-agenda-boundary",
        "artifact": STAGE3_DIR / "falcon-japan-improvement-agenda-from-ft03-first-principles-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether the Japan improvement agenda stays at structural hypothesis level and avoids current-policy/legal finality.",
        "allowed_result_values": ["accept_internal_agenda_hypotheses", "revise_agenda_boundary", "hold_agenda"],
        "must_not_decide_here": ["current policy claim", "legal judgment", "public proposal approval"],
    },
    {
        "review_item_id": "FT03-HR-07-next-work-sequencing",
        "artifact": RUN_DIR / "stage1-production-core-candidate-completion-cut-ft03-v0-2026-05-23.md",
        "what_reviewer_decides": "Whether next work should prioritize human review, source validity, public/interface design, or further narrow rereading.",
        "allowed_result_values": ["prioritize_human_review", "prioritize_source_validity", "prioritize_interface_after_review", "prioritize_named_rereading_hold"],
        "must_not_decide_here": ["automatic promotion", "runtime widening", "public launch"],
    },
]


REVIEW_RESULT_SCHEMA = {
    "review_item_id": "FT03-HR-xx",
    "reviewer": "human reviewer identifier",
    "date": "YYYY-MM-DD",
    "result_value": "one allowed_result_value",
    "required_revisions": ["short no-raw-text notes"],
    "approved_scope": "internal_structure_only|source_readiness_only|hold",
    "explicit_non_approval": [
        "not public-approved",
        "not runtime-approved",
        "not support validity",
        "not source/legal/current-policy finality",
    ],
}


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def validate(payload: dict[str, Any]) -> None:
    text = json.dumps(payload, ensure_ascii=False)
    prohibited = ["_x000D_", "PERSON_NAME", "MEDICAL_INSTITUTION", "raw_quote", "candidate_pattern_promoted"]
    for mark in prohibited:
        if mark in text:
            raise SystemExit(f"prohibited marker found: {mark}")


def write() -> None:
    payload: dict[str, Any] = {
        "artifact_id": OUT_ID,
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "review_input_packet_no_review_result_no_validity_decision",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "review_not_performed",
        "source_validity_status": "not_decided",
        "support_validity_status": "not_decided",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "review_items": [
            {**item, "artifact": rel(item["artifact"])}
            for item in REVIEW_ITEMS
        ],
        "review_result_schema": REVIEW_RESULT_SCHEMA,
    }
    validate(payload)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT03 Human Review / Source Validity Packet",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: review input packet / review結果なし / source validity未判断 / support validity未判断 / public不可 / runtime未承認",
        "",
        "このpacketはレビューを実行しない。FT03後にCodexが判断してはいけない箇所を、人間が判断できる形へ切り出す。",
        "",
        "## Review Principles",
        "",
        "- Reviewer may accept, revise, or hold internal shapes; Codex does not move review status.",
        "- Source validity is separate from support validity.",
        "- Public, current-policy, legal, and runtime use require separate verification and approval.",
        "- Review notes should remain no-raw-text and no-PII.",
        "",
        "## Review Items",
        "",
    ]
    for item in REVIEW_ITEMS:
        lines.append(f"### {item['review_item_id']}")
        lines.append(f"- artifact: `{rel(item['artifact'])}`")
        lines.append(f"- what reviewer decides: {item['what_reviewer_decides']}")
        lines.append(f"- allowed result values: {', '.join(item['allowed_result_values'])}")
        lines.append(f"- must not decide here: {', '.join(item['must_not_decide_here'])}")
        lines.append("")
    lines.extend(
        [
            "## Review Result Schema",
            "",
            "```json",
            json.dumps(REVIEW_RESULT_SCHEMA, ensure_ascii=False, indent=2),
            "```",
            "",
            f"JSON: `{rel(OUT_JSON)}`",
        ]
    )
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"json": rel(OUT_JSON), "md": rel(OUT_MD), "review_items": len(REVIEW_ITEMS)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
