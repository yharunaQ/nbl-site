#!/usr/bin/env python3
"""Build a Codex chat expert-use overlay for Stage 1 + 2001 ABC.

The overlay turns the Stage 1 x 2001 ABC crosswalk into operational answer
rules. It does not change runtime, retrieval, review, promotion, or public
status.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = REPO_ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

CROSSWALK_JSON = STAGE1_DIR / "stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.json"
ANSWER_PLAYBOOK_MD = STAGE1_DIR / "stage1-production-codex-chat-answer-playbook-v0-2026-05-20.md"
STAGE1_KNOWLEDGE_JSON = STAGE1_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"

OUTPUT_JSON = STAGE1_DIR / "stage1-production-2001-abc-codex-chat-expert-use-overlay-v0-2026-05-23.json"
OUTPUT_MD = STAGE1_DIR / "stage1-production-2001-abc-codex-chat-expert-use-overlay-v0-2026-05-23.md"
OUTPUT_JSONL = STAGE1_DIR / "stage1-production-2001-abc-codex-chat-expert-use-route-cards-v0-2026-05-23.jsonl"


ROUTE_USE_RULES: dict[str, dict[str, Any]] = {
    "QR-01-health-time-work-design": {
        "use_2001_abc_when": [
            "health-time is entangled with workplace contact points, support state, or evaluation rather than only symptoms",
            "the question includes internal disability, fatigue, commuting, rest, attendance, task load, or support visibility",
        ],
        "do_not_use_2001_abc_when": [
            "the user needs current rare-disease evidence or current policy guidance",
            "the answer would imply a medical or work-capacity judgment",
        ],
        "answer_move": "Use 2001 ABC to add supervisor/workplace and worker-side visibility checks to Stage 1 health-time reasoning.",
        "minimum_caution": "2001 ABC has no rare-disease data; internal-disability windows are mechanism hints, not rare-disease substitutes.",
    },
    "QR-02-information-work-procedure": {
        "use_2001_abc_when": [
            "information, explanation, hearing/communication, consultation, instructions, or workplace understanding appear",
            "the question risks treating information accessibility as separate from work procedure",
        ],
        "do_not_use_2001_abc_when": [
            "the requested answer is a deterministic support list by diagnosis or disability category",
            "the issue is purely current legal/public guidance",
        ],
        "answer_move": "Use 2001 ABC to ask whether information became work procedure, safety check, responsibility split, and evaluation condition.",
        "minimum_caution": "Do not reduce information issues to worker comprehension or sensory category; test workplace procedural translation.",
    },
    "QR-03-worksite-contact-and-mobility": {
        "use_2001_abc_when": [
            "the question concerns equipment, movement, posture, task operation, safety, evacuation, environment, or task contact",
            "a concrete workplace contact point needs to be decomposed before any support hypothesis",
        ],
        "do_not_use_2001_abc_when": [
            "the answer would treat supervisor problem ratings as worker capacity",
            "the question needs prevalence or current practice frequency",
        ],
        "answer_move": "Use 2001 ABC as the strongest worksite-contact thickener: break the workplace into contact points before discussing support.",
        "minimum_caution": "Supervisor-side problem/resolution signals are not worker experience or support adequacy.",
    },
    "QR-04-life-security-sequencing": {
        "use_2001_abc_when": [
            "commuting, daily living, family, school, medical/welfare connection, or external support shapes work continuation",
            "the issue is the order of starting, continuing, resting, returning, or choosing work",
        ],
        "do_not_use_2001_abc_when": [
            "the answer needs non-employed or pre-employment population evidence",
            "the answer would infer motivation or capacity from life-support signals",
        ],
        "answer_move": "Use 2001 ABC as a moderate bridge from workplace support to off-work/life-security sequencing.",
        "minimum_caution": "The dataset is employment-linked and selected; life-security signals are indirect.",
    },
    "QR-05-entry-prework-translation": {
        "use_2001_abc_when": [
            "employment reasons, employment challenges, advice-use, disability onset timing, or retraining may illuminate entry conditions",
            "the question needs a counter-window showing what 2001 ABC cannot cover",
        ],
        "do_not_use_2001_abc_when": [
            "the question is mainly about job-seeking, pre-employment, day activity, or training pathways",
            "the answer would use 2001 ABC as primary prework evidence",
        ],
        "answer_move": "Use 2001 ABC mostly as a boundary/counter-window for entry-prework reasoning, not as the main source.",
        "minimum_caution": "2001 ABC is weak for entry/prework because it is not a pre-employment dataset.",
    },
    "QR-06-disclosure-boundary-and-mutual-translation": {
        "use_2001_abc_when": [
            "the question includes disclosure, explanation scope, workplace understanding, support mediation, or B/C perspective differences",
            "condition labels, support needs, and workplace actions must be translated without deciding who is correct",
        ],
        "do_not_use_2001_abc_when": [
            "the answer would say whether someone should disclose a diagnosis",
            "the answer would judge employer or worker accuracy",
        ],
        "answer_move": "Use 2001 ABC to separate disclosure amount from mutual translation into work conditions.",
        "minimum_caution": "B/C mismatch is a recognition/translation signal, not an error or validity decision.",
    },
    "QR-07-quality-career-and-value-translation": {
        "use_2001_abc_when": [
            "the question concerns satisfaction, role, evaluation, productivity, career, retention quality, or value recognition",
            "employment continuation may hide closed participation quality",
        ],
        "do_not_use_2001_abc_when": [
            "the answer would treat satisfaction as support success",
            "the answer would judge performance or evaluation validity",
        ],
        "answer_move": "Use 2001 ABC to move from employed/not-employed to participation quality and value translation.",
        "minimum_caution": "Satisfaction, productivity, and continuation are not proof of support adequacy or success.",
    },
    "QR-08-diversity-conditioned-same-structure": {
        "use_2001_abc_when": [
            "the question asks how disability/function/degree/onset/response-mode changes the form of a common structure",
            "the agent needs condition-window evidence without falling into diagnosis-first reasoning",
        ],
        "do_not_use_2001_abc_when": [
            "the answer would create disease/disability-to-support rules",
            "the question is mainly about rare disease or mental-disability current legal context",
        ],
        "answer_move": "Use 2001 ABC as a strong condition-window layer for mechanism search across physical/intellectual-heavy data.",
        "minimum_caution": "Condition windows are discovery windows; no deterministic rule, public claim, or promotion follows.",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def abc_use_level(thickening_level: str) -> str:
    if thickening_level == "very_strong":
        return "use_as_primary_stage1_thickener_with_caution"
    if thickening_level == "strong":
        return "use_as_active_stage1_thickener_with_caution"
    if thickening_level == "moderate":
        return "use_as_secondary_bridge_with_boundary"
    return "use_as_counter_or_boundary_window"


def build_route_card(route: dict[str, Any], crosswalk: dict[str, Any]) -> dict[str, Any]:
    route_id = route["route_id"]
    rules = ROUTE_USE_RULES[route_id]
    return {
        "card_id": f"stage1-production:2001-abc-chat-use:{route_id}",
        "route_id": route_id,
        "status": "codex_chat_expert_use_overlay_unreviewed_no_runtime_approval",
        "abc_use_level": abc_use_level(route["thickening_level"]),
        "stage1_axis": route["stage1_axis"],
        "mechanism_nodes": route["mechanism_nodes"],
        "mechanism_titles": route["mechanism_titles"],
        "use_2001_abc_when": rules["use_2001_abc_when"],
        "do_not_use_2001_abc_when": rules["do_not_use_2001_abc_when"],
        "answer_move": rules["answer_move"],
        "minimum_caution": rules["minimum_caution"],
        "what_2001_abc_adds": route["what_2001_abc_adds"],
        "counter_or_attention": route["counter_or_attention"],
        "expert_agent_questions": route["expert_agent_questions"],
        "answer_sequence": [
            "Start from the Stage 1 route and its operator/branch logic.",
            "Decide whether 2001 ABC is a primary thickener, active thickener, secondary bridge, or boundary window.",
            "Use the mechanism-node questions to identify contact point, translation mechanism, freedom state, and counter-reading.",
            "State the 2001 ABC contribution only as unreviewed no-text structural evidence.",
            "Attach the minimum caution and missing-context checks.",
        ],
        "required_boundary_sentence": "2001 ABC is used here as an unreviewed no-text structural evidence window; it does not decide support adequacy, worker capacity, source validity, current guidance, or condition-to-support rules.",
        "not_allowed": crosswalk["not_allowed"],
        "source_content_exported": False,
        "narrative_content_included": False,
        "review_status": "unreviewed",
    }


def build_outputs() -> dict[str, Any]:
    crosswalk = load_json(CROSSWALK_JSON)
    stage1 = load_json(STAGE1_KNOWLEDGE_JSON)
    route_cards = [build_route_card(route, crosswalk) for route in crosswalk["route_overlays"]]
    return {
        "artifact_id": "stage1_production_2001_abc_codex_chat_expert_use_overlay_v0_2026_05_23",
        "lane": "Falcon Lab",
        "status": "codex_chat_expert_use_overlay_unreviewed_no_promotion_no_runtime_approval",
        "review_status": "unreviewed",
        "source_content_exported": False,
        "narrative_content_included": False,
        "source_artifacts": [
            str(CROSSWALK_JSON.relative_to(REPO_ROOT)),
            str(ANSWER_PLAYBOOK_MD.relative_to(REPO_ROOT)),
            str(STAGE1_KNOWLEDGE_JSON.relative_to(REPO_ROOT)),
        ],
        "stage1_network_status": crosswalk["stage1_network_status"],
        "route_cards": route_cards,
        "global_answer_contract_addition": [
            "Use 2001 ABC only after the Stage 1 route is identified.",
            "Use 2001 ABC to thicken mechanisms, not to add frequency, authority, or current guidance.",
            "Always pair the 2001 ABC contribution with its caution/counter-reading window.",
            "For condition labels, ask how the condition window changes contact points, translation mechanisms, and freedom states.",
            "If the question is rare-disease specific, mental-disability legal-context specific, current-policy specific, or pre-employment primary, keep 2001 ABC secondary or boundary-only.",
        ],
        "answer_micro_template": {
            "abc_position": "2001 ABCをここでは[primary/active/secondary/boundary]の未レビュー構造窓として使う。",
            "mechanism": "[MN]に沿って、接触点、翻訳機序、自由度、反対読みを分ける。",
            "caution": "時代差、身体/知的障害中心、難病欠落、B/C不一致、A票事業所単位性を必要に応じて示す。",
            "stop_line": "支援妥当性、能力判断、現行制度判断、病名・障害名からの配慮検索には使わない。",
        },
        "route_count": len(route_cards),
        "stage1_route_count": len(stage1["query_routes"]),
        "not_allowed": crosswalk["not_allowed"],
    }


def write_markdown(data: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Stage 1 + 2001 ABC Codex Chat Expert Use Overlay",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon Lab",
        "状態: Codex chat expert-use overlay / no narrative text / 未レビュー / 昇格なし / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、Stage 1 answer playbookの横で使う2001 ABC専用オーバーレイである。目的は、Falconがチャット応答で2001 ABCをいつ使い、どう使い、どこで止めるかをQR別に定義することにある。",
        "",
        "2001 ABCは、回答の出発点ではない。まずStage 1 routeを決め、そのrouteの機序を厚くする時だけ呼び出す。使った場合は必ず反証・注意窓を同じ場所に置く。",
        "",
        "## Global Answer Contract Addition",
        "",
    ]
    for item in data["global_answer_contract_addition"]:
        lines.append(f"- {item}")

    lines.extend(
        [
            "",
            "## Route Use Matrix",
            "",
            "| route | use level | use 2001 ABC when | do not use when | minimum caution |",
            "|---|---|---|---|---|",
        ]
    )
    for card in data["route_cards"]:
        use_when = "<br>".join(card["use_2001_abc_when"])
        avoid = "<br>".join(card["do_not_use_2001_abc_when"])
        lines.append(
            f"| `{card['route_id']}` | `{card['abc_use_level']}` | {use_when} | {avoid} | {card['minimum_caution']} |"
        )

    lines.extend(["", "## Route Cards", ""])
    for card in data["route_cards"]:
        lines.extend(
            [
                f"### {card['route_id']}",
                "",
                f"- ABC use level: `{card['abc_use_level']}`",
                f"- Stage 1 axis: `{card['stage1_axis']}`",
                f"- mechanism nodes: {', '.join(f'`{node}`' for node in card['mechanism_nodes'])}",
                f"- answer move: {card['answer_move']}",
                f"- what 2001 ABC adds: {card['what_2001_abc_adds']}",
                f"- counter/attention: {card['counter_or_attention']}",
                f"- minimum caution: {card['minimum_caution']}",
                "",
                "Expert-agent questions:",
            ]
        )
        for question in card["expert_agent_questions"]:
            lines.append(f"- {question}")
        lines.extend(
            [
                "",
                "Answer sequence:",
            ]
        )
        for step in card["answer_sequence"]:
            lines.append(f"- {step}")
        lines.append("")

    lines.extend(
        [
            "## Answer Micro Template",
            "",
            "```text",
            "2001 ABCの位置づけ:",
            data["answer_micro_template"]["abc_position"],
            "",
            "機序:",
            data["answer_micro_template"]["mechanism"],
            "",
            "注意窓:",
            data["answer_micro_template"]["caution"],
            "",
            "停止線:",
            data["answer_micro_template"]["stop_line"],
            "```",
            "",
            "## Boundary",
            "",
            "- This is not reviewed knowledge, candidate_pattern movement, Domain Core movement, public evidence, or runtime grounding.",
            "- No raw narrative text, redacted narrative text, PII, or row-level IDs are exported.",
            "- No source/support validity, support adequacy, worker capacity, legal/medical/employment judgment, or current-policy claim is made.",
            "- 2001 ABC can thicken Stage 1 mechanisms; it cannot authorize deterministic condition-window rules.",
            "",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


def write_jsonl(data: dict[str, Any]) -> None:
    with OUTPUT_JSONL.open("w", encoding="utf-8") as out:
        for card in data["route_cards"]:
            out.write(json.dumps(card, ensure_ascii=False) + "\n")


def main() -> None:
    data = build_outputs()
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    write_jsonl(data)
    print(
        json.dumps(
            {
                "route_cards": data["route_count"],
                "output": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
                "route_cards_jsonl": str(OUTPUT_JSONL.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
