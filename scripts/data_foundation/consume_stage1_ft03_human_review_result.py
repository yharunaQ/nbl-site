#!/usr/bin/env python3
"""Consume the human-filled FT03 review result and write bounded overlays.

This script records what the human review moves and, just as importantly, what
it does not move. It also creates a plain-Japanese repair artifact for the G2
route/readability gap identified by the reviewer.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

DEFAULT_INPUT = Path("/Users/YuichiroHARUNA/Downloads/stage1-production-ft03-human-review-result-filled-v0-2026-05-23.json")
OUT_PREFIX = "stage1-production-ft03-human-review-result-complete-overlay-v0-2026-05-25"
INTAKE_JSON = RUN_DIR / "stage1-production-ft03-human-review-result-complete-intake-v0-2026-05-25.json"
OVERLAY_MD = RUN_DIR / f"{OUT_PREFIX}.md"
OVERLAY_JSON = RUN_DIR / f"{OUT_PREFIX}.json"
G2_REPAIR_MD = RUN_DIR / "stage1-production-ft03-g2-eight-view-plain-language-repair-v0-2026-05-25.md"
G2_REPAIR_JSON = RUN_DIR / "stage1-production-ft03-g2-eight-view-plain-language-repair-v0-2026-05-25.json"
USE_CONTRACT_MD = RUN_DIR / "stage1-production-ft03-human-reviewed-boundary-use-contract-v0-2026-05-25.md"
USE_CONTRACT_JSON = RUN_DIR / "stage1-production-ft03-human-reviewed-boundary-use-contract-v0-2026-05-25.json"


PROHIBITED_MARKERS = [
    "_x000D_",
    "PERSON_NAME",
    "MEDICAL_INSTITUTION",
    "raw_quote",
    "candidate_pattern_promoted",
]


MOVES_BY_RESULT = {
    "accept_internal_use": ["internal_codex_use_allowed_with_unreviewed_candidate_label"],
    "accept_route_brakes": ["route_brakes_reviewed_for_internal_use"],
    "accept_source_lens_separation": ["source_lens_separation_reviewed_for_internal_use"],
    "accept_condition_window_language": ["condition_window_guardrail_reviewed_for_internal_use"],
    "usable_for_question_generation": ["support_claim_safety_reviewed_for_internal_questions"],
    "usable_for_counter_hypothesis_only": ["support_claim_safety_reviewed_for_counter_hypotheses_only"],
    "public_concept_translation_possible": ["public_concept_review_input_ready"],
    "runtime_preflight_contract_ready": ["runtime_preflight_requirements_ready"],
}


DOES_NOT_MOVE = [
    "source_validity",
    "support_validity",
    "public_safe",
    "public_approved",
    "runtime_approved",
    "candidate_pattern",
    "Domain Core",
    "Atlas / 27-frame",
    "medical/legal/employment/accommodation finality",
    "DB/schema/provider/model/prompt/retrieval/runtime changes",
]


G2_REPAIR = {
    "artifact_id": "stage1-production-ft03-g2-eight-view-plain-language-repair-v0-2026-05-25",
    "date": "2026-05-25",
    "lane": "Falcon / Falcon Lab",
    "status": "g2_readability_repair_for_human_re_review / no promotion / no public approval / no runtime approval",
    "review_trigger": "G2 human review left result_value blank and noted that the language was not understandable enough for humans.",
    "position": [
        "The eight views are not a strict MECE taxonomy.",
        "They are entry points for reading work-support interaction without collapsing into diagnosis lookup, support efficacy proof, or workplace/person judgment.",
        "MECE-like separation is handled downstream by the six layers: condition, source, work design, translation, freedom state, and review state.",
    ],
    "eight_views": [
        {
            "id": "V1",
            "name": "健康時間と働き方",
            "plain_question": "体調、通院、疲労、休み方、戻り方は、仕事の時間・負荷・評価にどう影響しているか。",
            "use_for": ["勤務量、休憩、通院、欠勤、復帰、将来再設計の問いを作る"],
            "do_not_use_for": ["働ける/働けない判断", "医学的重症度判断", "配慮の正しさ判断"],
        },
        {
            "id": "V2",
            "name": "情報共有と仕事手順",
            "plain_question": "必要な情報は、本人の同意のもとで、実際の仕事手順・安全・評価に届いているか。",
            "use_for": ["何を誰にどこまで共有し、仕事上どう使うかを整理する"],
            "do_not_use_for": ["開示の正解化", "本人/職場の正誤判定", "差別や法的判断"],
        },
        {
            "id": "V3",
            "name": "職場の接触点",
            "plain_question": "作業、道具、安全、顧客、人員余力、欠勤代替など、実際に困難や工夫が生じる接点はどこか。",
            "use_for": ["抽象的な配慮名ではなく、仕事の具体面を分ける"],
            "do_not_use_for": ["本人の能力判定", "企業の良し悪し判断", "設備チェックリスト化"],
        },
        {
            "id": "V4",
            "name": "生活保障と順序",
            "plain_question": "収入、医療費、休職、制度カテゴリ、家族支援は、待つ・休む・戻る自由度をどう変えているか。",
            "use_for": ["仕事選択や治療継続の順序制約を見つける"],
            "do_not_use_for": ["現行制度説明", "給付利用可能性判断", "政策妥当性判断"],
        },
        {
            "id": "V5",
            "name": "入口と就職前の参加",
            "plain_question": "求人、体験、訓練、生活リズム、開始後支援は、就職前から開始後までつながっているか。",
            "use_for": ["入口前後の断絶、仕事像、開始後支援の不足を見つける"],
            "do_not_use_for": ["準備不足判定", "非就労志向推定", "古い制度カテゴリの現行説明"],
        },
        {
            "id": "V6",
            "name": "開示と安全な境界",
            "plain_question": "何を、誰に、どこまで伝え、本人の不利益やプライバシーをどう守るか。",
            "use_for": ["開示範囲、相談線、仕事条件へのつなぎ方を整理する"],
            "do_not_use_for": ["開示すべきかの最終判断", "法的判断", "個別配慮妥当性判断"],
        },
        {
            "id": "V7",
            "name": "役割・評価・将来",
            "plain_question": "働けていることだけでなく、役割、評価、処遇、学習、将来見通しは開いているか。",
            "use_for": ["定着後の参加の質、キャリア、将来会話の問いを作る"],
            "do_not_use_for": ["満足度や勤続からの成功証明", "好事例の汎用処方化"],
        },
        {
            "id": "V8",
            "name": "病名・障害名を手がかりにするが答えにしない",
            "plain_question": "病名・障害名・制度カテゴリは、どの相互作用を見えやすくし、どんな決めつけを招きやすいか。",
            "use_for": ["共通構造と、その条件下でだけ見える構造を分ける"],
            "do_not_use_for": ["病名から配慮を引く", "病名から困難性や能力を推定する", "条件名をタブー化する"],
        },
    ],
    "review_use": [
        "Use this repair artifact to re-review G2 only.",
        "Acceptance of G2 would move route_brakes_reviewed_for_internal_use, and nothing else.",
        "This repair artifact itself does not move G2, public safety, runtime, source/support validity, or candidate pattern status.",
    ],
}


def validate(payload: Any) -> None:
    text = json.dumps(payload, ensure_ascii=False) if not isinstance(payload, str) else payload
    for marker in PROHIBITED_MARKERS:
        if marker in text:
            raise SystemExit(f"prohibited marker found: {marker}")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_review(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    validate(data)
    return data


def gate_overlay(gate: dict[str, Any]) -> dict[str, Any]:
    result = gate.get("result_value") or ""
    moves = MOVES_BY_RESULT.get(result, [])
    complete = bool(result)
    return {
        "gate_id": gate.get("gate_id"),
        "result_value": result,
        "result_label_ja": gate.get("result_label_ja", ""),
        "checked_count": len(gate.get("checked_items", [])),
        "reviewer_notes_no_raw_text": gate.get("reviewer_notes_no_raw_text", []),
        "required_revisions_no_raw_text": gate.get("required_revisions_no_raw_text", []),
        "named_routes_or_artifacts": gate.get("named_routes_or_artifacts", []),
        "gate_complete": complete,
        "moves": moves,
        "status": "human_review_gate_moved" if moves else ("human_review_gate_incomplete_or_hold" if not complete else "human_review_gate_no_movement"),
    }


def build_overlay(data: dict[str, Any], input_path: Path) -> dict[str, Any]:
    gates = [gate_overlay(gate) for gate in data.get("gate_results", [])]
    moved = [move for gate in gates for move in gate["moves"]]
    incomplete = [gate for gate in gates if not gate["gate_complete"]]
    route_brakes_moved = "route_brakes_reviewed_for_internal_use" in moved
    all_gates_complete = not incomplete
    next_required_action = (
        [
            "Use the human-reviewed boundary use contract for Falcon Lab internal Codex use.",
            "Treat the eight views and their misuse brakes as human-reviewed for internal use only.",
            "Do not move source/support validity, public_safe/public_approved, runtime_approved, or candidate_pattern from this result.",
        ]
        if all_gates_complete and route_brakes_moved
        else [
            "Use the G2 plain-language repair artifact for a narrow re-review of the eight views and their misuse brakes.",
            "Do not treat G2 as reviewed until the human result_value is filled explicitly.",
            "Do not move source/support validity, public_safe/public_approved, runtime_approved, or candidate_pattern from this result.",
        ]
    )
    overlay = {
        "artifact_id": OUT_PREFIX,
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "complete_human_review_result_consumed / bounded movements only / no validity-public-runtime promotion",
        "input": {
            "filename": input_path.name,
            "sha256": sha256(input_path),
            "artifact_id": data.get("artifact_id"),
            "derived_from": data.get("derived_from"),
            "review_mode": data.get("review_mode"),
            "overall_decision": data.get("overall_decision"),
        },
        "gate_overlays": gates,
        "moved_statuses": moved,
        "incomplete_gates": [gate["gate_id"] for gate in incomplete],
        "immediate_read": {
            "internal_core_use": "moved_with_unreviewed_candidate_label" if "internal_codex_use_allowed_with_unreviewed_candidate_label" in moved else "not_moved",
            "route_brakes": "moved_for_internal_use_only" if route_brakes_moved else "not_moved_g2_requires_repair_and_re_review",
            "source_lens_separation": "moved_for_internal_use_only" if "source_lens_separation_reviewed_for_internal_use" in moved else "not_moved",
            "condition_window_guardrail": "moved_for_internal_use_only" if "condition_window_guardrail_reviewed_for_internal_use" in moved else "not_moved",
            "support_claim_safety": "moved_for_question_generation_only" if "support_claim_safety_reviewed_for_internal_questions" in moved else "not_moved",
            "public_translation": "public_concept_review_input_ready_only" if "public_concept_review_input_ready" in moved else "not_moved",
            "runtime": "runtime_preflight_requirements_ready_only" if "runtime_preflight_requirements_ready" in moved else "not_moved",
        },
        "explicit_non_movement": DOES_NOT_MOVE,
        "next_required_action": next_required_action,
    }
    validate(overlay)
    return overlay


def write_intake(data: dict[str, Any], input_path: Path) -> None:
    intake = {
        "artifact_id": "stage1-production-ft03-human-review-result-complete-intake-v0-2026-05-25",
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "local_complete_review_result_intake_copy / no source text / no promotion",
        "input_filename": input_path.name,
        "input_sha256": sha256(input_path),
        "review_result": data,
    }
    validate(intake)
    INTAKE_JSON.write_text(json.dumps(intake, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_overlay_md(overlay: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 FT03 Complete Human Review Result Overlay",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: complete human review result consumed / bounded movements only / no validity-public-runtime promotion",
        "",
        "## What Moved",
        "",
    ]
    for move in overlay["moved_statuses"]:
        lines.append(f"- `{move}`")

    lines.extend([
        "",
        "## Immediate Read",
        "",
    ])
    for key, value in overlay["immediate_read"].items():
        lines.append(f"- `{key}`: `{value}`")

    lines.extend([
        "",
        "## Incomplete / Needs Repair",
        "",
    ])
    if overlay["incomplete_gates"]:
        for gate_id in overlay["incomplete_gates"]:
            lines.append(f"- `{gate_id}`: not moved. Human re-review is required before route-brake movement.")
    else:
        lines.append("- none / all seven gates have explicit human result values")

    lines.extend([
        "",
        "## G2 Human Note",
        "",
    ])
    g2 = next((gate for gate in overlay["gate_overlays"] if gate["gate_id"] == "G2-route-brakes"), None)
    if g2 and g2["reviewer_notes_no_raw_text"]:
        for note in g2["reviewer_notes_no_raw_text"]:
            lines.append(f"- {note}")
    else:
        lines.append("- no note")

    lines.extend([
        "",
        "## Explicit Non-Movement",
        "",
    ])
    for item in overlay["explicit_non_movement"]:
        lines.append(f"- `{item}`")

    lines.extend([
        "",
        "## Next Required Action",
        "",
    ])
    for item in overlay["next_required_action"]:
        lines.append(f"- {item}")

    lines.extend([
        "",
        f"JSON: `{OVERLAY_JSON.relative_to(ROOT)}`",
        f"Intake JSON: `{INTAKE_JSON.relative_to(ROOT)}`",
        f"Use contract: `{USE_CONTRACT_MD.relative_to(ROOT)}`",
    ])
    text = "\n".join(lines) + "\n"
    validate(text)
    OVERLAY_MD.write_text(text, encoding="utf-8")


def write_g2_repair() -> None:
    validate(G2_REPAIR)
    G2_REPAIR_JSON.write_text(json.dumps(G2_REPAIR, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Stage 1 FT03 G2 Eight View Plain-Language Repair",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: G2 readability repair / re-review input only / no promotion",
        "",
        "## Position",
        "",
    ]
    for item in G2_REPAIR["position"]:
        lines.append(f"- {item}")

    lines.extend([
        "",
        "## Eight Views",
        "",
    ])
    for view in G2_REPAIR["eight_views"]:
        lines.extend([
            f"### {view['id']} {view['name']}",
            "",
            f"問い: {view['plain_question']}",
            "",
            "使う場面:",
        ])
        for item in view["use_for"]:
            lines.append(f"- {item}")
        lines.append("")
        lines.append("使わない場面:")
        for item in view["do_not_use_for"]:
            lines.append(f"- {item}")
        lines.append("")

    lines.extend([
        "## Review Use",
        "",
    ])
    for item in G2_REPAIR["review_use"]:
        lines.append(f"- {item}")

    lines.extend([
        "",
        f"JSON: `{G2_REPAIR_JSON.relative_to(ROOT)}`",
    ])
    text = "\n".join(lines) + "\n"
    validate(text)
    G2_REPAIR_MD.write_text(text, encoding="utf-8")


def build_use_contract(overlay: dict[str, Any]) -> dict[str, Any]:
    contract = {
        "artifact_id": "stage1-production-ft03-human-reviewed-boundary-use-contract-v0-2026-05-25",
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "human_reviewed_boundary_use_contract / internal use only / no validity-public-runtime approval",
        "source_overlay": str(OVERLAY_JSON.relative_to(ROOT)),
        "reviewed_boundary_movements": overlay["moved_statuses"],
        "allowed_internal_uses": [
            "Use Stage 1 FT03 as an unreviewed-candidate-labeled internal expert knowledge network.",
            "Use the eight views and misuse brakes for route selection and question generation.",
            "Compare information sources as partial views, not as a truth hierarchy.",
            "Use condition names as interaction windows, not as direct lookup keys.",
            "Use support claims for missing-context questions and counter-hypotheses, not support validity.",
            "Use public-facing ideas only as public-concept review inputs, not publishable copy.",
            "Use runtime implications only as preflight requirements, not implementation approval.",
        ],
        "required_answer_shape_for_codex": [
            "State that the knowledge is human-reviewed for boundary use but not source/support-valid.",
            "Name which view or views are being used in plain Japanese.",
            "Separate observation, inference, and possible next question.",
            "Name missing context and at least one counter-hypothesis when making a structural hypothesis.",
            "Keep diagnosis/disability labels as interaction windows and avoid direct accommodation lookup.",
            "End with what cannot be concluded yet when the prompt risks individual judgment.",
        ],
        "not_allowed": DOES_NOT_MOVE,
    }
    validate(contract)
    return contract


def write_use_contract(overlay: dict[str, Any]) -> None:
    contract = build_use_contract(overlay)
    USE_CONTRACT_JSON.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT03 Human-Reviewed Boundary Use Contract",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: human-reviewed boundary use contract / internal use only / no validity-public-runtime approval",
        "",
        "## What This Means",
        "",
        "7つの人間レビュー項目は明示判断まで完了した。これは、Falcon Lab内でStage 1 FT03を境界つきの内部専門知識ネットワーク候補として使うための契約である。",
        "",
        "これはsource/support validity、public-safe、public-approved、runtime-approved、candidate_pattern、Domain Core、Atlas/27-frame、個別判断を動かさない。",
        "",
        "## Allowed Internal Uses",
        "",
    ]
    for item in contract["allowed_internal_uses"]:
        lines.append(f"- {item}")

    lines.extend(["", "## Required Codex Answer Shape", ""])
    for item in contract["required_answer_shape_for_codex"]:
        lines.append(f"- {item}")

    lines.extend(["", "## Not Allowed", ""])
    for item in contract["not_allowed"]:
        lines.append(f"- `{item}`")

    lines.extend([
        "",
        f"Overlay JSON: `{OVERLAY_JSON.relative_to(ROOT)}`",
        f"Contract JSON: `{USE_CONTRACT_JSON.relative_to(ROOT)}`",
    ])
    text = "\n".join(lines) + "\n"
    validate(text)
    USE_CONTRACT_MD.write_text(text, encoding="utf-8")


def main() -> None:
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_INPUT
    data = load_review(input_path)
    write_intake(data, input_path)
    overlay = build_overlay(data, input_path)
    OVERLAY_JSON.write_text(json.dumps(overlay, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_overlay_md(overlay)
    write_g2_repair()
    write_use_contract(overlay)
    print(str(OVERLAY_MD.relative_to(ROOT)))
    print(str(OVERLAY_JSON.relative_to(ROOT)))
    print(str(USE_CONTRACT_MD.relative_to(ROOT)))
    print(str(INTAKE_JSON.relative_to(ROOT)))


if __name__ == "__main__":
    main()
