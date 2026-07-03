#!/usr/bin/env python3
"""Summarize route-level core revision pressure from rereading passes."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

REDACTED_NOTES = OUT_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json"
STRUCTURED_BRIDGE = OUT_DIR / "stage1-production-structured-followup-rereading-bridge-v0-2026-05-23.json"
CORE_KERNEL = OUT_DIR / "stage1-production-core-expert-kernel-v0-2026-05-23.json"

OUT_JSON = OUT_DIR / "stage1-production-rereading-core-revision-pressure-v0-2026-05-23.json"
OUT_MD = OUT_DIR / "stage1-production-rereading-core-revision-pressure-v0-2026-05-23.md"


ROUTE_IMPACTS = [
    {
        "impact_id": "RI-01-health-time-life-security",
        "routes": ["QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
        "corridor": "RR-01-health-time-life-security",
        "reading": "C01/C06 coupling is not settled by redacted text alone; structured coverage suggests the corridor should be context-read before any weakening.",
        "core_action": "keep as active core route, but require context confirmation of life-security as sequencing freedom rather than background attribute",
        "next_reading_batch": "CR-01-RR01-life-security-context",
        "do_not_do": "do not treat income/life-security co-presence as proof of employment difficulty or support validity",
    },
    {
        "impact_id": "RI-02-quality-value-translation",
        "routes": ["QR-07-quality-career-and-value-translation"],
        "corridor": "RR-02-quality-participation-value-translation",
        "reading": "C07 was weak in redacted lexical signals but broad in structured projection. This is exactly where Core can overclaim if it mistakes questionnaire coverage for value-translation evidence.",
        "core_action": "keep C07, but downgrade any completion language until context reading proves role/evaluation/treatment/future-outlook translation",
        "next_reading_batch": "CR-02-RR02-value-translation-context",
        "do_not_do": "do not infer career quality from satisfaction, work status, support use, or projection coverage alone",
    },
    {
        "impact_id": "RI-03-prework-entry-translation",
        "routes": ["QR-05-entry-prework-translation"],
        "corridor": "RR-03-prework-entry-sequence",
        "reading": "C08 was weak in redacted lexical signals and broad in structured projection. It should remain a live but tightly tested route, not a finished independent axis.",
        "core_action": "hold C08 as pre-entry translation route pending context reading; treat low-context and nonwork-orientation records as brakes",
        "next_reading_batch": "CR-03-RR03-prework-entry-context",
        "do_not_do": "do not convert nonwork, low-context, training, or preparation signals into readiness deficit",
    },
    {
        "impact_id": "RI-04-worksite-contact",
        "routes": ["QR-03-worksite-contact-and-mobility", "QR-02-information-work-procedure"],
        "corridor": "RR-04-worksite-contact-minority-window",
        "reading": "C05 has support from both redacted and structured passes. It is the strongest immediate route for deeper record-level completion work.",
        "core_action": "advance C05 to the next context-reading batch as the main Core strengthening path",
        "next_reading_batch": "CR-04-RR04-worksite-contact-context",
        "do_not_do": "do not reduce contact points to equipment lists, disability-category tables, or accommodation adequacy judgments",
    },
    {
        "impact_id": "RI-05-residual-holds",
        "routes": [
            "QR-01-health-time-work-design",
            "QR-04-life-security-sequencing",
            "QR-05-entry-prework-translation",
            "QR-07-quality-career-and-value-translation",
        ],
        "corridor": "RR-05-residual-hold-and-counterexamples",
        "reading": "Residual records are not evidence of core strength. They are brakes that keep the network from becoming a polished overclaim.",
        "core_action": "keep as explicit hold/counterexample layer; use only after a route starts overgeneralizing",
        "next_reading_batch": "CR-05-residual-hold-checks",
        "do_not_do": "do not use residual holds to increase apparent support counts",
    },
]


def load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def corridor_lookup(rows: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    return {row["corridor"]: row for row in rows}


def make_data() -> dict[str, Any]:
    redacted = load(REDACTED_NOTES)
    structured = load(STRUCTURED_BRIDGE)
    kernel = load(CORE_KERNEL)
    redacted_by_corridor = corridor_lookup(redacted["corridor_summary"])
    structured_by_corridor = corridor_lookup(structured["summary"]["corridor_summary"])
    route_ids = {route["route_id"] for route in kernel["route_kernels"]}
    impacts = []
    for impact in ROUTE_IMPACTS:
        corridor = impact["corridor"]
        impacts.append(
            {
                **impact,
                "routes_present_in_kernel": [route for route in impact["routes"] if route in route_ids],
                "redacted_summary": redacted_by_corridor.get(corridor, {}),
                "structured_summary": structured_by_corridor.get(corridor, {}),
            }
        )
    return {
        "artifact_id": "stage1-production-rereading-core-revision-pressure-v0-2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "route_level_revision_pressure_from_rereading_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "source_artifacts": [
            str(REDACTED_NOTES.relative_to(ROOT)),
            str(STRUCTURED_BRIDGE.relative_to(ROOT)),
            str(CORE_KERNEL.relative_to(ROOT)),
        ],
        "route_impacts": impacts,
        "core_decision": [
            "Do not evaluate Stage 1 Core as complete yet.",
            "Use C05/RR-04 as the strongest next completion path.",
            "Keep C07/RR-02 and C08/RR-03 alive but context-tested; do not present them as finished independent routes.",
            "Use RR-05 as the brake layer whenever a route starts sounding too smooth.",
            "Raw original is not yet the first move because structured bridge removed the immediate no-data gap; raw local-only remains available if context reading fails.",
        ],
    }


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Rereading Core Revision Pressure",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: route-level revision pressure / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        "redacted初回読解とstructured bridgeを、Coreをどう切削するかのroute別判断に変換した。",
        "これは完成評価ではなく、完成へ進めるための次読解指示である。",
        "",
        "## Core Decision",
    ]
    for item in data["core_decision"]:
        lines.append(f"- {item}")
    lines.extend(["", "## Route Impacts"])
    for impact in data["route_impacts"]:
        lines.extend(
            [
                "",
                f"### {impact['impact_id']}",
                f"- routes: {', '.join(impact['routes'])}",
                f"- corridor: {impact['corridor']}",
                f"- reading: {impact['reading']}",
                f"- core action: {impact['core_action']}",
                f"- next reading batch: {impact['next_reading_batch']}",
                f"- do not do: {impact['do_not_do']}",
                f"- redacted summary: {impact['redacted_summary']}",
                f"- structured summary: {impact['structured_summary']}",
            ]
        )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    data = make_data()
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_MD.write_text(make_md(data), encoding="utf-8")
    print(f"route_impacts={len(data['route_impacts'])}")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
