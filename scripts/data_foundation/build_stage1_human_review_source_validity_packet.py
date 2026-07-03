#!/usr/bin/env python3
"""Prepare human review and source-validity packet without making judgments."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
PREFIX = "stage1-production-human-review-source-validity-packet-v0-2026-05-23"

ARTIFACTS = {
    "raw_local_only_audit": OUT_DIR / "stage1-production-raw-original-local-only-audit-v0-2026-05-23.json",
    "route_integration_cut": OUT_DIR / "stage1-production-rereading-route-integration-cut-v0-2026-05-23.json",
    "kernel_reread_calibration": OUT_DIR / "stage1-production-core-expert-kernel-reread-calibration-v0-2026-05-23.json",
    "c07_c08_resolution": OUT_DIR / "stage1-production-c07-c08-after-raw-resolution-v0-2026-05-23.json",
    "web_cache_audit": OUT_DIR / "stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.json",
    "web_cache_batch1": OUT_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.json",
    "web_cache_batch2": OUT_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.json",
    "abc_overlay": OUT_DIR / "stage1-production-2001-abc-codex-chat-expert-use-overlay-v0-2026-05-23.json",
}


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def source_family_review_queue(web: dict[str, Any]) -> list[dict[str, Any]]:
    summary = web.get("summary", {})
    families = (
        web.get("source_family_profiles")
        or web.get("source_family_counts")
        or web.get("family_profiles")
        or summary.get("family_profiles")
    )
    if isinstance(families, list):
        rows = families
    else:
        rows = []
    out = []
    for row in rows[:40]:
        family = row.get("family") or row.get("source_family") or row.get("family_id")
        if not family:
            continue
        out.append(
            {
                "family": family,
                "safe_current_layer": row.get("safe_layer") or row.get("current_safe_layer") or "source_readiness_or_boundary",
                "review_question": "Can this source family be used as candidate structure input for Stage 1, or only as source-family boundary?",
                "not_reviewed_as": [
                    "current policy authority",
                    "legal guidance",
                    "support adequacy evidence",
                    "public copy basis",
                ],
            }
        )
    return out


def main() -> None:
    loaded = {key: load(path) for key, path in ARTIFACTS.items()}
    route_cut = loaded["route_integration_cut"]
    c07_c08 = loaded["c07_c08_resolution"]
    raw = loaded["raw_local_only_audit"]
    web = loaded["web_cache_audit"]

    review_items = [
        {
            "review_item_id": "HR-01-raw-local-only-sufficiency",
            "object": "raw original local-only audit",
            "artifact": str(ARTIFACTS["raw_local_only_audit"].relative_to(ROOT)),
            "what_reviewer_decides": "Whether local-only raw audit is sufficient for the current Stage 1 closure question, or whether any named record/field needs further raw reading.",
            "allowed_result_values": ["sufficient_for_current_question", "needs_named_raw_followup", "insufficient_method"],
            "must_not_decide_here": ["support adequacy", "case correctness", "public release", "runtime approval"],
            "current_finding_for_review": {
                "unique_records": raw["unique_record_count"],
                "record_corridor_entries": raw["record_corridor_entry_count"],
                "raw_adds_possible_closure_from_structured_coverage": raw[
                    "raw_adds_possible_closure_from_structured_coverage"
                ],
            },
        },
        {
            "review_item_id": "HR-02-route-integration-shape",
            "object": "CR-01..CR-05 route integration",
            "artifact": str(ARTIFACTS["route_integration_cut"].relative_to(ROOT)),
            "what_reviewer_decides": "Whether each route implication is a reasonable unreviewed internal route shape, and which route needs tightening before human-facing use.",
            "allowed_result_values": ["accept_internal_shape", "revise_internal_shape", "hold_route"],
            "must_not_decide_here": ["candidate_pattern promotion", "Domain Core movement", "public-safe approval"],
            "route_items": [
                {
                    "route_id": row["route_id"],
                    "context_advanced": row["context_advanced"],
                    "needs_context_confirmation": row["needs_context_confirmation"],
                    "brake_or_boundary": row["brake_or_boundary"],
                    "review_question": "Does the proposed core_integration preserve interaction reasoning without overclaim?",
                }
                for row in route_cut["route_implications"]
            ],
        },
        {
            "review_item_id": "HR-03-c07-c08-thin-route-resolution",
            "object": "C07/C08 after raw resolution",
            "artifact": str(ARTIFACTS["c07_c08_resolution"].relative_to(ROOT)),
            "what_reviewer_decides": "Whether C07 and C08 should remain narrow test routes, be merged into adjacent routes, or receive additional no-text intersection sampling.",
            "allowed_result_values": ["keep_narrow_test_route", "merge_into_adjacent_route", "sample_more_intersections"],
            "must_not_decide_here": ["support success", "readiness deficit", "career quality finality"],
            "current_finding_for_review": {
                "c07_post_raw_resolution": c07_c08["c07_resolution"]["post_raw_resolution"],
                "c08_post_raw_resolution": c07_c08["c08_resolution"]["post_raw_resolution"],
            },
        },
        {
            "review_item_id": "HR-04-source-family-validity-triage",
            "object": "web-cache and official/quasi-official source families",
            "artifact": str(ARTIFACTS["web_cache_audit"].relative_to(ROOT)),
            "what_reviewer_decides": "For each source family, whether it can support candidate structure input, source readiness only, source-family boundary, or hold.",
            "allowed_result_values": [
                "candidate_structure_input",
                "source_readiness",
                "source_family_boundary",
                "hold",
            ],
            "must_not_decide_here": [
                "current policy claim without live verification",
                "legal interpretation",
                "accommodation finality",
                "public copy approval",
            ],
            "source_family_review_queue": source_family_review_queue(web),
        },
        {
            "review_item_id": "HR-05-support-validity-boundary",
            "object": "support validity and intervention implication boundary",
            "artifact": str(ARTIFACTS["kernel_reread_calibration"].relative_to(ROOT)),
            "what_reviewer_decides": "Whether a route can be used to ask better support-design questions. This is not approval of any support or intervention.",
            "allowed_result_values": [
                "usable_for_question_generation",
                "usable_for_counter_hypothesis_only",
                "hold_for_more_evidence",
            ],
            "must_not_decide_here": [
                "support adequacy",
                "reasonable accommodation correctness",
                "employment decision",
                "medical/legal judgment",
            ],
        },
    ]

    payload = {
        "artifact_id": PREFIX,
        "lane": "Falcon / Falcon Lab",
        "status": "human_review_packet_no_review_result_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_validity_status": "not_decided",
        "support_validity_status": "not_decided",
        "raw_original_opened": raw["raw_original_opened"],
        "source_text_exported": False,
        "field_value_exported": False,
        "purpose": "Make the remaining human review and source/support validity work reviewable without Codex deciding it.",
        "review_principles": [
            "A reviewer may accept, revise, or hold route shapes; Codex does not move review status.",
            "Source validity means whether a source can support a structural reading, not whether a support is valid.",
            "Support validity is outside this packet except as a boundary to keep route use non-prescriptive.",
            "Current policy, legal, public, and runtime use require separate verification and approval.",
        ],
        "review_items": review_items,
        "review_result_schema": {
            "review_item_id": "HR-xx",
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
        },
    }
    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(payload), encoding="utf-8")
    print(PREFIX, "review_items=", len(review_items))


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Human Review / Source Validity Packet",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: human review packet / review結果なし / source validity未判断 / support validity未判断 / 公開不可",
        "",
        "このpacketはレビューを実行しない。Codexが判断してはいけない箇所を、人間が判断できる形へ切り出す。",
        "",
        "## Review Principles",
    ]
    for item in data["review_principles"]:
        lines.append(f"- {item}")
    lines.extend(["", "## Review Items"])
    for item in data["review_items"]:
        lines.extend([
            "",
            f"### {item['review_item_id']} {item['object']}",
            f"- artifact: `{item['artifact']}`" if "artifact" in item else "- artifact: multiple",
            f"- what reviewer decides: {item['what_reviewer_decides']}",
            f"- allowed result values: {', '.join(item['allowed_result_values'])}",
            f"- must not decide here: {', '.join(item['must_not_decide_here'])}",
        ])
        if "current_finding_for_review" in item:
            lines.append(f"- current finding for review: `{item['current_finding_for_review']}`")
        if "route_items" in item:
            lines.append("- route items:")
            for route in item["route_items"]:
                lines.append(
                    f"  - {route['route_id']}: advanced={route['context_advanced']}, "
                    f"needs_confirmation={route['needs_context_confirmation']}, "
                    f"brake={route['brake_or_boundary']}"
                )
        if "source_family_review_queue" in item:
            lines.append(f"- source families queued: {len(item['source_family_review_queue'])}")
    lines.extend([
        "",
        "## Review Result Schema",
        "```json",
        json.dumps(data["review_result_schema"], ensure_ascii=False, indent=2),
        "```",
        "",
    ])
    return "\n".join(lines)


if __name__ == "__main__":
    main()
