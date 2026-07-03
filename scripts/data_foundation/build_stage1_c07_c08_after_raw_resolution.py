#!/usr/bin/env python3
"""Resolve C07/C08 thin-route status after raw local-only audit."""

from __future__ import annotations

from collections import Counter
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
PREFIX = "stage1-production-c07-c08-after-raw-resolution-v0-2026-05-23"

CR02 = OUT_DIR / "stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.json"
CR03 = OUT_DIR / "stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.json"
RAW_AUDIT = OUT_DIR / "stage1-production-raw-original-local-only-audit-v0-2026-05-23.json"
ROUTE_CUT = OUT_DIR / "stage1-production-rereading-route-integration-cut-v0-2026-05-23.json"
KERNEL_CALIBRATION = OUT_DIR / "stage1-production-core-expert-kernel-reread-calibration-v0-2026-05-23.json"


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def group_records(data: dict[str, Any]) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for row in data["record_context_notes"]:
        out.setdefault(row["context_reading_action"], []).append(row["record_id"])
    return {key: sorted(set(values)) for key, values in sorted(out.items())}


def raw_effect_for(corridor: str, raw_audit: dict[str, Any]) -> dict[str, Any]:
    rows = [row for row in raw_audit["records"] if row["corridor"] == corridor]
    effect = Counter(row["raw_effect_on_prior_action"] for row in rows)
    closure = Counter("raw_closes" if row["raw_closes_required_relation"] else "raw_not_close" for row in rows)
    return {
        "record_corridor_entries": len(rows),
        "raw_effect_counts": dict(sorted(effect.items())),
        "raw_closure_counts": dict(sorted(closure.items())),
        "raw_adds_possible_closure_from_structured_coverage": raw_audit[
            "raw_adds_possible_closure_from_structured_coverage"
        ].get(corridor, 0),
    }


def main() -> None:
    cr02 = load(CR02)
    cr03 = load(CR03)
    raw = load(RAW_AUDIT)
    route_cut = load(ROUTE_CUT)
    calibration = load(KERNEL_CALIBRATION)
    assert raw["raw_original_opened"] is True
    assert raw["source_text_exported"] is False

    route_calibration = {row["route_id"]: row for row in calibration["route_calibrations"]}
    route_implications = {row["route_id"]: row for row in route_cut["route_implications"]}

    c07 = {
        "axis": "C07-quality-participation",
        "primary_route": "QR-07-quality-career-and-value-translation",
        "corridor": cr02["corridor"],
        "post_raw_resolution": "keep_narrow_test_route",
        "why_not_closed_by_raw": [
            "raw local-only audit added no new closure from structured-coverage records",
            "only 3 of 18 CR-02 records were context-advanced",
            "10 of 18 remain structured coverage needing context confirmation",
            "5 of 18 remain boundary or adjacent-axis checks",
        ],
        "usable_core_form": "C07 is usable as value-translation only when role/evaluation/treatment/future-outlook is context-closed, not as satisfaction or employment-quality in general.",
        "thickening_route": [
            "connect to C05 worksite contact when evaluation/value appears through task, workflow, information, or support retranslation",
            "connect to C01/C06 when health-time and life-security change the possibility of role, treatment, or future outlook",
            "use 2001 ABC A/B/C differences as workplace burden / supervisor view / worker satisfaction contrast windows, not validity judgments",
            "use web-cache only as terminology and actor-condition windows until source review",
        ],
        "record_groups": group_records(cr02),
        "raw_effect": raw_effect_for(cr02["corridor"], raw),
        "kernel_calibration": route_calibration["QR-07-quality-career-and-value-translation"],
        "route_implication": route_implications["RI-02-quality-value-translation"],
    }

    c08 = {
        "axis": "C08-prework-participation",
        "primary_route": "QR-05-entry-prework-translation",
        "corridor": cr03["corridor"],
        "post_raw_resolution": "keep_narrow_test_route",
        "why_not_closed_by_raw": [
            "raw local-only audit added no new closure from structured-coverage records",
            "only 3 of 24 CR-03 records were context-advanced",
            "17 of 24 remain structured coverage needing context confirmation",
            "4 of 24 remain hold or adjacent-axis checks",
        ],
        "usable_core_form": "C08 is usable as pre-entry translation only when training, life rhythm, stamina, support bridge, self-outlook, and entry action form a sequence; never as preparedness deficit.",
        "thickening_route": [
            "connect to C06 when livelihood pressure changes entry timing, training participation, or job-choice sequence",
            "connect to C01 when health-time/stamina/life rhythm must be translated before entry",
            "connect to C02/C03 when support or disclosure boundary turns prework activity into job-condition translation",
            "use nonwork/low-context records as ethical brakes, not deficits",
        ],
        "record_groups": group_records(cr03),
        "raw_effect": raw_effect_for(cr03["corridor"], raw),
        "kernel_calibration": route_calibration["QR-05-entry-prework-translation"],
        "route_implication": route_implications["RI-03-prework-entry-translation"],
    }

    payload = {
        "artifact_id": PREFIX,
        "lane": "Falcon / Falcon Lab",
        "status": "thin_route_resolution_after_raw_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": True,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_received_raw_text": False,
        "source_artifacts": {
            "cr02": str(CR02.relative_to(ROOT)),
            "cr03": str(CR03.relative_to(ROOT)),
            "raw_audit": str(RAW_AUDIT.relative_to(ROOT)),
            "route_cut": str(ROUTE_CUT.relative_to(ROOT)),
            "kernel_calibration": str(KERNEL_CALIBRATION.relative_to(ROOT)),
        },
        "decision": [
            "Do not try to make C07/C08 look thick by raw rereading; raw did not add closure.",
            "Keep both as narrow test routes with explicit adjacent-route dependencies.",
            "Use C07/C08 in Codex answers only through their closure tests and brakes.",
        ],
        "c07_resolution": c07,
        "c08_resolution": c08,
        "next_if_more_depth_needed": [
            "C07: select additional records from C05/C01/C06 intersections where evaluation/value is missing, then run no-text context typing.",
            "C08: select additional transition records from C06/C01/C02/C03 intersections where pre-entry sequence is missing, then run no-text context typing.",
            "Do not reopen raw broadly; use raw only for a named record/field gap not answerable from analysis_ready/redacted layers.",
        ],
    }
    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(payload), encoding="utf-8")
    print(PREFIX, "c07=", c07["post_raw_resolution"], "c08=", c08["post_raw_resolution"])


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 C07/C08 After-Raw Resolution",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: thin-route resolution after raw / 本文引用なし / 昇格なし / 公開不可",
        "",
        "raw original local-only audit後のC07/C08の扱いを決める。結論は、rawで無理に厚くせず、狭いtest routeとして使うこと。",
        "",
        "## Decision",
    ]
    for item in data["decision"]:
        lines.append(f"- {item}")
    for key, title in [("c07_resolution", "C07 Quality / Value Translation"), ("c08_resolution", "C08 Prework / Entry Translation")]:
        item = data[key]
        lines.extend([
            "",
            f"## {title}",
            f"- post_raw_resolution: `{item['post_raw_resolution']}`",
            f"- corridor: `{item['corridor']}`",
            f"- usable_core_form: {item['usable_core_form']}",
            "",
            "Why not closed by raw:",
        ])
        for reason in item["why_not_closed_by_raw"]:
            lines.append(f"- {reason}")
        lines.append("")
        lines.append("Thickening route:")
        for route in item["thickening_route"]:
            lines.append(f"- {route}")
        lines.extend([
            "",
            "Raw effect:",
            f"- record-corridor entries: {item['raw_effect']['record_corridor_entries']}",
            f"- raw effect counts: {item['raw_effect']['raw_effect_counts']}",
            f"- raw closure counts: {item['raw_effect']['raw_closure_counts']}",
            f"- raw adds possible closure from structured coverage: {item['raw_effect']['raw_adds_possible_closure_from_structured_coverage']}",
        ])
    lines.extend(["", "## Next If More Depth Needed"])
    for item in data["next_if_more_depth_needed"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
