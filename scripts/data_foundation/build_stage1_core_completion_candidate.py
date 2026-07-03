#!/usr/bin/env python3
"""Build the Stage 1 Core completion candidate packet.

This packet integrates the existing Stage 1 Codex network, 2001 ABC overlays,
and web-cache deep-reading batches into a single Core candidate view. It does
not promote knowledge, approve runtime retrieval, or create public claims.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = REPO_ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

STAGE1_NETWORK = STAGE1_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
QUERY_INDEX = STAGE1_DIR / "stage1-production-codex-query-index-v0-2026-05-18.json"
ANSWER_PLAYBOOK = STAGE1_DIR / "stage1-production-codex-chat-answer-playbook-v0-2026-05-20.md"
ABC_OVERLAY = STAGE1_DIR / "stage1-production-2001-abc-codex-chat-expert-use-overlay-v0-2026-05-23.json"
WEB_AUDIT = STAGE1_DIR / "stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.json"
WEB_BATCH1 = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.json"
WEB_BATCH2 = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.json"
RAW_READ_REMEDIATION = STAGE1_DIR / "stage1-production-permissioned-raw-read-remediation-packet-v0-2026-05-20.md"
THIN_AXIS_PACKET = STAGE1_DIR / "stage1-production-thin-axis-thickening-packet-c06-c07-c08-sg06-v0-2026-05-20.md"
ROUTE_INTEGRATION_CUT = STAGE1_DIR / "stage1-production-rereading-route-integration-cut-v0-2026-05-23.md"
KERNEL_REREAD_CALIBRATION = STAGE1_DIR / "stage1-production-core-expert-kernel-reread-calibration-v0-2026-05-23.md"
RAW_ORIGINAL_LOCAL_AUDIT = STAGE1_DIR / "stage1-production-raw-original-local-only-audit-v0-2026-05-23.md"
C07_C08_AFTER_RAW = STAGE1_DIR / "stage1-production-c07-c08-after-raw-resolution-v0-2026-05-23.md"
C07_C08_INTERSECTION_SAMPLING = STAGE1_DIR / "stage1-production-c07-c08-adjacent-route-intersection-sampling-v0-2026-05-23.json"
C07_C08_ROUTE_THROUGH_CARDS = STAGE1_DIR / "stage1-production-c07-c08-route-through-core-use-cards-v0-2026-05-23.json"
HUMAN_REVIEW_PACKET = STAGE1_DIR / "stage1-production-human-review-source-validity-packet-v0-2026-05-23.md"

OUTPUT_JSON = STAGE1_DIR / "stage1-production-core-completion-candidate-v0-2026-05-23.json"
OUTPUT_MD = STAGE1_DIR / "stage1-production-core-completion-candidate-v0-2026-05-23.md"
OUTPUT_JSONL = STAGE1_DIR / "stage1-production-core-completion-route-cards-v0-2026-05-23.jsonl"


ROUTE_TO_AXIS = {
    "QR-01-health-time-work-design": "C01-health-time",
    "QR-02-information-work-procedure": "C04-information-participation",
    "QR-03-worksite-contact-and-mobility": "C05-worksite-contact",
    "QR-04-life-security-sequencing": "C06-life-security",
    "QR-05-entry-prework-translation": "C08-prework-participation / C02-entry-translation",
    "QR-06-disclosure-boundary-and-mutual-translation": "C02-entry-translation / C03-support-continuity / C04-information-participation",
    "QR-07-quality-career-and-value-translation": "C07-quality-participation",
    "QR-08-diversity-conditioned-same-structure": "condition-window / CB-06-minority-window-revival",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def route_map_from_stage1(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {route["route_id"]: route for route in data["query_routes"]}


def route_map_from_abc(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {route["route_id"]: route for route in data["route_cards"]}


def route_reinforcement(route_id: str, batch: dict[str, Any]) -> int:
    return int(batch.get("route_counts", {}).get(route_id, 0))


def candidate_level(route_id: str, abc_card: dict[str, Any] | None, batch1_count: int, batch2_count: int) -> str:
    if route_id in {"QR-03-worksite-contact-and-mobility", "QR-06-disclosure-boundary-and-mutual-translation"}:
        return "core_candidate_strong_multi_source"
    if route_id == "QR-08-diversity-conditioned-same-structure":
        return "core_candidate_strong_condition_window_with_no_lookup_boundary"
    if route_id in {"QR-01-health-time-work-design", "QR-02-information-work-procedure", "QR-07-quality-career-and-value-translation"}:
        return "core_candidate_usable_with_active_cautions"
    if route_id == "QR-04-life-security-sequencing":
        return "core_candidate_boundary_strengthened_but_current_claim_hold"
    if route_id == "QR-05-entry-prework-translation":
        return "core_candidate_boundary_strengthened_but_prework_hold"
    if abc_card or batch1_count or batch2_count:
        return "core_candidate_usable"
    return "core_candidate_needs_more_structure"


def route_stop_conditions(route_id: str) -> list[str]:
    common = [
        "unreviewed; no promotion",
        "no source/support validity decision",
        "no public/current-policy/legal/accommodation claim",
        "no runtime approval",
    ]
    route_specific = {
        "QR-01-health-time-work-design": ["do not infer work capacity, medical severity, or support adequacy from health-time signals"],
        "QR-02-information-work-procedure": ["do not reduce information issues to worker comprehension or sensory category"],
        "QR-03-worksite-contact-and-mobility": ["do not turn worksite contact points into ability judgment or equipment checklist"],
        "QR-04-life-security-sequencing": ["do not present benefits, service, or policy routes as current guidance without live verification"],
        "QR-05-entry-prework-translation": ["do not treat prework state as preparedness deficit or non-work preference"],
        "QR-06-disclosure-boundary-and-mutual-translation": ["do not decide whether someone should disclose a condition or who is correct"],
        "QR-07-quality-career-and-value-translation": ["do not treat satisfaction, retention, productivity, or career signals as support success"],
        "QR-08-diversity-conditioned-same-structure": ["do not create diagnosis/disability-to-support lookup rules"],
    }
    return common + route_specific.get(route_id, [])


def route_next_reading(route_id: str) -> list[str]:
    common = [
        "use route first, then attach source-family and condition-window overlays",
        "return every source to contact point, translation mechanism, freedom state, and counter-reading",
    ]
    route_specific = {
        "QR-01-health-time-work-design": ["permissioned raw-read RR-01 can later confirm health-time / life-security coupling"],
        "QR-02-information-work-procedure": ["web-cache Batch 2 hearing/manual sources can deepen procedure and safety translation"],
        "QR-03-worksite-contact-and-mobility": ["2001 ABC + JEED/web-cache C05 should be used together for worksite contact decomposition"],
        "QR-04-life-security-sequencing": ["MHLW/NIVR C06 sources need claim-hygiene separation before policy-facing use"],
        "QR-05-entry-prework-translation": ["Q&A / training / service sources should remain entry-translation windows, not guidance"],
        "QR-06-disclosure-boundary-and-mutual-translation": ["ABC B/C mismatch and web-cache mutual-understanding sources should be paired"],
        "QR-07-quality-career-and-value-translation": ["NIVR/JEED C07 sources should test value translation, not success claims"],
        "QR-08-diversity-conditioned-same-structure": ["2001 ABC condition windows should be used as discovery windows only"],
    }
    return common + route_specific.get(route_id, [])


def build_route_cards() -> list[dict[str, Any]]:
    stage1 = load_json(STAGE1_NETWORK)
    abc = load_json(ABC_OVERLAY)
    audit = load_json(WEB_AUDIT)
    batch1 = load_json(WEB_BATCH1)
    batch2 = load_json(WEB_BATCH2)

    stage1_routes = route_map_from_stage1(stage1)
    abc_routes = route_map_from_abc(abc)
    cards: list[dict[str, Any]] = []
    for route_id, route in stage1_routes.items():
        abc_card = abc_routes.get(route_id)
        batch1_count = route_reinforcement(route_id, batch1)
        batch2_count = route_reinforcement(route_id, batch2)
        web_audit_count = audit["summary"]["route_candidate_counts"].get(route_id, 0)
        cards.append(
            {
                "route_id": route_id,
                "status": "stage1_core_route_completion_candidate_unreviewed",
                "candidate_level": candidate_level(route_id, abc_card, batch1_count, batch2_count),
                "stage1_axis": ROUTE_TO_AXIS.get(route_id, "unknown"),
                "stage1_use": route.get("use_case") or route.get("primary_question") or route.get("query"),
                "stage1_operators": route.get("operators", []),
                "stage1_branches": route.get("context_branches", []),
                "abc_use_level": abc_card.get("abc_use_level") if abc_card else None,
                "abc_mechanism_nodes": abc_card.get("mechanism_nodes") if abc_card else [],
                "abc_contribution": abc_card.get("what_2001_abc_adds") if abc_card else None,
                "abc_caution": abc_card.get("minimum_caution") if abc_card else None,
                "web_cache_audit_candidate_sources": web_audit_count,
                "web_cache_batch1_sources": batch1_count,
                "web_cache_batch2_sources": batch2_count,
                "web_cache_batch1_addition": batch1.get("stage1_route_core_additions", {}).get(route_id),
                "web_cache_batch2_addition": batch2.get("stage1_route_core_additions", {}).get(route_id),
                "route_stop_conditions": route_stop_conditions(route_id),
                "next_reading_use": route_next_reading(route_id),
                "source_text_exported": False,
                "review_status": "unreviewed",
            }
        )
    return cards


def build_packet() -> dict[str, Any]:
    route_cards = build_route_cards()
    web_audit = load_json(WEB_AUDIT)
    batch1 = load_json(WEB_BATCH1)
    batch2 = load_json(WEB_BATCH2)
    abc = load_json(ABC_OVERLAY)
    stage1 = load_json(STAGE1_NETWORK)
    query_index = load_json(QUERY_INDEX)
    route_through = load_json(C07_C08_ROUTE_THROUGH_CARDS)
    return {
        "artifact_id": "stage1_production_core_completion_candidate_v0_2026_05_23",
        "lane": "Falcon / Falcon Lab",
        "status": "core_completion_candidate_unreviewed_no_promotion_no_runtime_approval",
        "review_status": "unreviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "source_text_exported": False,
        "source_artifacts": [
            str(STAGE1_NETWORK.relative_to(REPO_ROOT)),
            str(QUERY_INDEX.relative_to(REPO_ROOT)),
            str(ANSWER_PLAYBOOK.relative_to(REPO_ROOT)),
            str(ABC_OVERLAY.relative_to(REPO_ROOT)),
            str(WEB_AUDIT.relative_to(REPO_ROOT)),
            str(WEB_BATCH1.relative_to(REPO_ROOT)),
            str(WEB_BATCH2.relative_to(REPO_ROOT)),
            str(RAW_READ_REMEDIATION.relative_to(REPO_ROOT)),
            str(THIN_AXIS_PACKET.relative_to(REPO_ROOT)),
            str(ROUTE_INTEGRATION_CUT.relative_to(REPO_ROOT)),
            str(KERNEL_REREAD_CALIBRATION.relative_to(REPO_ROOT)),
            str(RAW_ORIGINAL_LOCAL_AUDIT.relative_to(REPO_ROOT)),
            str(C07_C08_AFTER_RAW.relative_to(REPO_ROOT)),
            str(C07_C08_INTERSECTION_SAMPLING.relative_to(REPO_ROOT)),
            str(C07_C08_ROUTE_THROUGH_CARDS.relative_to(REPO_ROOT)),
            str(HUMAN_REVIEW_PACKET.relative_to(REPO_ROOT)),
        ],
        "completion_meaning": {
            "what_is_now_usable": "Stage 1 can be used in Codex as an auditable unreviewed expert knowledge network candidate across 8 routes, with survey-derived structure, 2001 ABC mechanism overlays, web-cache source-family deep-reading layers, raw local-only calibration, and C07/C08 route-through cards.",
            "what_is_not_claimed": "not reviewed knowledge, not public-safe, not runtime-approved, not current legal/policy/accommodation guidance, not source/support validity.",
            "why_core_is_stronger_than_prototype": "The packet connects route logic to mechanism nodes, source-family layers, condition-window cautions, underread-axis web-cache deepening, and explicit stop conditions.",
        },
        "route_count": len(route_cards),
        "stage1_network_counts": {
            "query_routes": len(stage1.get("query_routes", [])),
            "answer_modes": len(stage1.get("answer_modes", [])),
            "network_node_groups": len(stage1.get("network_nodes", {})),
        },
        "query_index_counts": {
            "axis_query_cards": len(query_index.get("axis_query_cards", [])),
            "relation_query_cards": len(query_index.get("relation_query_cards", [])),
        },
        "web_cache_layer_counts": {
            "audit_sources": web_audit["summary"]["total_web_cache_sources"],
            "audit_integrated_sources": web_audit["summary"]["stage1_existing_integrated_sources"],
            "audit_not_yet_integrated_sources": web_audit["summary"]["not_yet_integrated_sources"],
            "batch1_sources": batch1["batch_scope"]["source_count"],
            "batch2_sources": batch2["batch_scope"]["source_count"],
        },
        "abc_layer_counts": {
            "route_cards": abc["route_count"],
            "contract_additions": len(abc["global_answer_contract_addition"]),
        },
        "c07_c08_route_through_counts": {
            "cards": len(route_through["cards"]),
            "source_artifacts": len(route_through["source_artifacts"]),
        },
        "route_cards": route_cards,
        "remaining_uncertainties": [
            "raw original local-only audit for RR-01 to RR-05 has been run; raw本文・field値・PIIは出力していない",
            "broad raw original reading is still not approved; future raw use requires named record / field / purpose / stop condition",
            "CR-02/C07 and CR-03/C08 remain narrow test routes; use C07/C08 route-through cards rather than standalone route claims",
            "CR-05 residual holds must be used as a brake/counterexample layer, not as support evidence",
            "web-cache Batch 1 and Batch 2 are source-signal and title/audit-card driven; they are not human-reviewed source interpretations",
            "official/current/legal/policy/service claims require live verification before public or policy-facing use",
            "C06/C07/C08 are strengthened but still carry boundary/hold logic rather than promoted independent patterns",
            "condition windows can be analyzed, but diagnosis/disability-to-support lookup remains prohibited",
        ],
        "next_core_actions": [
            "use this completion candidate only with the reread calibration layer and C07/C08 route-through cards; do not use earlier route levels by themselves",
            "continue raw-original remediation only if redacted/structured context remains insufficient for a narrow, explicit question",
            "prepare human review packet over route cards, mechanism overlays, and web-cache source-family layers",
            "keep UI/runtime/interface work downstream until this Core candidate is reviewed or explicitly accepted as unreviewed internal layer",
        ],
    }


def write_jsonl(route_cards: list[dict[str, Any]]) -> None:
    with OUTPUT_JSONL.open("w", encoding="utf-8") as f:
        for card in route_cards:
            f.write(json.dumps(card, ensure_ascii=False, sort_keys=True) + "\n")


def row(values: list[Any]) -> str:
    return "| " + " | ".join(str(value) for value in values) + " |"


def write_markdown(data: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Stage 1 Core Completion Candidate",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: Core completion candidate / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        data["completion_meaning"]["what_is_now_usable"],
        "",
        "これは「完成宣言」ではなく、Stage 1 Coreを専門知識ネットワーク候補として閉じるための現在の最上位束ねである。プロトタイプの動作確認ではなく、route、operator、context branch、2001 ABC、web-cache、薄い軸、stop conditionを同じ面に置く。",
        "",
        "2026-05-23追記: このpacketは、後続のrecord-level再読解とraw local-only auditで較正された。Codexで使う時は、必ず [Stage 1 Core Expert Kernel Reread Calibration](stage1-production-core-expert-kernel-reread-calibration-v0-2026-05-23.md)、[Stage 1 rereading route integration cut](stage1-production-rereading-route-integration-cut-v0-2026-05-23.md)、[Stage 1 C07/C08 After-Raw Resolution](stage1-production-c07-c08-after-raw-resolution-v0-2026-05-23.md)、[Stage 1 C07/C08 Route-Through Core Use Cards](stage1-production-c07-c08-route-through-core-use-cards-v0-2026-05-23.md) を先に読む。",
        "",
        "## Boundary",
        "",
        data["completion_meaning"]["what_is_not_claimed"],
        "",
        "## Layer Counts",
        "",
        row(["layer", "count / state"]),
        row(["---", "---"]),
        row(["Stage 1 routes", data["route_count"]]),
        row(["query index axis cards", data["query_index_counts"]["axis_query_cards"]]),
        row(["query index relation cards", data["query_index_counts"]["relation_query_cards"]]),
        row(["2001 ABC route cards", data["abc_layer_counts"]["route_cards"]]),
        row(["web-cache audit sources", data["web_cache_layer_counts"]["audit_sources"]]),
        row(["web-cache not-yet-integrated sources", data["web_cache_layer_counts"]["audit_not_yet_integrated_sources"]]),
        row(["web-cache Batch 1 sources", data["web_cache_layer_counts"]["batch1_sources"]]),
        row(["web-cache Batch 2 sources", data["web_cache_layer_counts"]["batch2_sources"]]),
        row(["C07/C08 route-through cards", data["c07_c08_route_through_counts"]["cards"]]),
        "",
        "## Route Completion Cards",
        "",
        row(["route", "candidate level", "ABC use", "web audit", "Batch1", "Batch2", "main stop condition"]),
        row(["---", "---", "---", "---:", "---:", "---:", "---"]),
    ]
    for card in data["route_cards"]:
        lines.append(
            row(
                [
                    f"`{card['route_id']}`",
                    f"`{card['candidate_level']}`",
                    f"`{card['abc_use_level']}`" if card["abc_use_level"] else "",
                    card["web_cache_audit_candidate_sources"],
                    card["web_cache_batch1_sources"],
                    card["web_cache_batch2_sources"],
                    card["route_stop_conditions"][-1],
                ]
            )
        )

    lines.extend(["", "## Route Use Notes", ""])
    for card in data["route_cards"]:
        lines.extend(
            [
                f"### {card['route_id']}",
                "",
                f"- level: `{card['candidate_level']}`",
                f"- axis: `{card['stage1_axis']}`",
                f"- ABC: {card['abc_contribution'] or 'なし'}",
                f"- ABC caution: {card['abc_caution'] or 'なし'}",
                f"- web Batch 1: {card['web_cache_batch1_addition'] or 'なし'}",
                f"- web Batch 2: {card['web_cache_batch2_addition'] or 'なし'}",
                f"- stop: {card['route_stop_conditions'][-1]}",
                "",
            ]
        )

    lines.extend(
        [
            "## Remaining Uncertainties",
            "",
        ]
    )
    for item in data["remaining_uncertainties"]:
        lines.append(f"- {item}")

    lines.extend(["", "## Next Core Actions", ""])
    for item in data["next_core_actions"]:
        lines.append(f"- {item}")

    lines.extend(
        [
            "",
            "## Source Artifacts",
            "",
        ]
    )
    for artifact in data["source_artifacts"]:
        lines.append(f"- `{artifact}`")

    lines.extend(
        [
            "",
            f"JSON: `{OUTPUT_JSON.relative_to(REPO_ROOT)}`",
            f"Route cards JSONL: `{OUTPUT_JSONL.relative_to(REPO_ROOT)}`",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    data = build_packet()
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_jsonl(data["route_cards"])
    write_markdown(data)
    print(
        json.dumps(
            {
                "routes": data["route_count"],
                "status": data["status"],
                "json": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
                "md": str(OUTPUT_MD.relative_to(REPO_ROOT)),
                "jsonl": str(OUTPUT_JSONL.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
