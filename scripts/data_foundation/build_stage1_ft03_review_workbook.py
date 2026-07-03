#!/usr/bin/env python3
"""Build a practical FT03 human review workbook and blank result form.

The workbook tells a human reviewer exactly what to read, what to decide, and
what each decision moves. It does not perform review, source/support validity,
public approval, or runtime approval.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
STAGE2_DIR = ROOT / "references/derived/scima-fchma/stage2-first-principles-ft03-v0-2026-05-23"
STAGE3_DIR = ROOT / "references/derived/scima-fchma/stage3-japan-improvement-agenda-ft03-v0-2026-05-23"

OUT_PREFIX = "stage1-production-ft03-human-review-workbook-v0-2026-05-23"
WORKBOOK_MD = RUN_DIR / f"{OUT_PREFIX}.md"
WORKBOOK_JSON = RUN_DIR / f"{OUT_PREFIX}.json"
RESULT_FORM_JSON = RUN_DIR / "stage1-production-ft03-human-review-result-form-blank-v0-2026-05-23.json"
GATE_MAP_MD = RUN_DIR / "stage1-production-ft03-gate-movement-map-v0-2026-05-23.md"
GATE_MAP_JSON = RUN_DIR / "stage1-production-ft03-gate-movement-map-v0-2026-05-23.json"


REVIEW_INPUTS = {
    "core_cut": RUN_DIR / "stage1-production-core-candidate-completion-cut-ft03-v0-2026-05-23.md",
    "route_matrix": RUN_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md",
    "source_lens": RUN_DIR / "stage1-production-source-lens-saturation-map-v0-2026-05-23.md",
    "first_principles": STAGE2_DIR / "falcon-first-principles-framework-from-stage1-ft03-v0-2026-05-23.md",
    "japan_agenda": STAGE3_DIR / "falcon-japan-improvement-agenda-from-ft03-first-principles-v0-2026-05-23.md",
    "review_packet": RUN_DIR / "stage1-production-ft03-human-review-source-validity-packet-v0-2026-05-23.md",
}


REVIEW_MODES = [
    {
        "id": "R0-30min-founder-review",
        "time": "30 minutes",
        "purpose": "Decide whether the FT03 Core can be used as an unreviewed internal expert-network candidate.",
        "read": ["core_cut", "first_principles"],
        "decide": ["G1-core-internal-use", "G4-condition-window-language"],
    },
    {
        "id": "R1-60min-route-review",
        "time": "60 minutes",
        "purpose": "Check whether route brakes are strong enough to prevent overclaiming.",
        "read": ["core_cut", "route_matrix", "source_lens"],
        "decide": ["G1-core-internal-use", "G2-route-brakes", "G4-condition-window-language"],
    },
    {
        "id": "R2-90min-boundary-review",
        "time": "90 minutes",
        "purpose": "Move source/support validity, public-safe, and runtime-readiness forward without approving them.",
        "read": ["core_cut", "route_matrix", "source_lens", "first_principles", "japan_agenda"],
        "decide": ["G1-core-internal-use", "G2-route-brakes", "G3-source-lens", "G4-condition-window-language", "G5-support-claim-safety", "G6-public-safe-translation", "G7-runtime-readiness"],
    },
]


GATES: list[dict[str, Any]] = [
    {
        "id": "G1-core-internal-use",
        "question": "このFT03 Core cutを、未レビュー内部専門知識ネットワーク候補としてCodexが使ってよいか。",
        "reviewer_checks": [
            "中心命題がFalconの目的に合っているか。",
            "未レビューであることが十分に見えるか。",
            "個別判断、支援妥当性、現行政策、public/runtimeへ飛んでいないか。",
        ],
        "allowed_values": ["accept_internal_use", "accept_with_required_revisions", "hold"],
        "if_accepts_moves": ["internal_codex_use_allowed_with_unreviewed_candidate_label"],
        "does_not_move": ["human_reviewed_knowledge", "source_validity", "support_validity", "public_safe", "runtime_approved"],
    },
    {
        "id": "G2-route-brakes",
        "question": "8 routeそれぞれのuse_for / do_not_use_forが、人間に分かる強さで書けているか。",
        "reviewer_checks": [
            "どのrouteが医療・法務・雇用・配慮の最終判断に見えるか。",
            "C07/C08が成功証明や準備不足判定に見えないか。",
            "C03支援連続性が支援効果証明に見えないか。",
        ],
        "allowed_values": ["accept_route_brakes", "revise_named_routes", "hold_named_routes"],
        "if_accepts_moves": ["route_brakes_reviewed_for_internal_use"],
        "does_not_move": ["candidate_pattern", "Domain Core", "public_ready_route", "runtime_route"],
    },
    {
        "id": "G3-source-lens",
        "question": "本人・支援者・職場・NIVR・workshop・web-cache・2001 ABCの使い方が、部分観測として分離されているか。",
        "reviewer_checks": [
            "どれか一つのsource lensが真実扱いになっていないか。",
            "NIVR/official系が現行政策や法的根拠に見えていないか。",
            "2001 ABCが現在妥当性の証明に見えていないか。",
        ],
        "allowed_values": ["accept_source_lens_separation", "revise_source_lens_language", "hold_source_lens_use"],
        "if_accepts_moves": ["source_lens_separation_reviewed_for_internal_use"],
        "does_not_move": ["source_validity", "public_source_use", "current_policy_claim"],
    },
    {
        "id": "G4-condition-window-language",
        "question": "病名・障害名等を、タブーにもlookupにもせず、相互作用窓として扱えているか。",
        "reviewer_checks": [
            "病名から配慮や困難性を直接引くように読める箇所がないか。",
            "逆に、病名・障害名を扱えない禁忌として読める箇所がないか。",
            "共通構造と条件下特殊構造の両方が残っているか。",
        ],
        "allowed_values": ["accept_condition_window_language", "revise_condition_window_language", "hold_condition_window_language"],
        "if_accepts_moves": ["condition_window_guardrail_reviewed_for_internal_use"],
        "does_not_move": ["diagnosis_to_accommodation_lookup", "condition_to_work_capacity_rule"],
    },
    {
        "id": "G5-support-claim-safety",
        "question": "支援について、効果・妥当性を決めず、よい問いを作るための構造として扱えているか。",
        "reviewer_checks": [
            "支援者熱意、会議、紹介、同席、メニューが効果証明に見えていないか。",
            "支援者再翻訳容量という言い方が実務上わかるか。",
            "support validityを決める前に、質問生成・反対仮説生成だけに留まっているか。",
        ],
        "allowed_values": ["usable_for_question_generation", "usable_for_counter_hypothesis_only", "hold_support_claims"],
        "if_accepts_moves": ["support_claim_safety_reviewed_for_internal_questions"],
        "does_not_move": ["support_validity", "intervention_recommendation", "reasonable_accommodation_correctness"],
    },
    {
        "id": "G6-public-safe-translation",
        "question": "このCoreからpublic/NBL/SNSへ翻訳できる概念と、まだ出してはいけない概念を分けられるか。",
        "reviewer_checks": [
            "public向けに出せるのは原理レベルか、source付き主張か、現行政策主張かを分ける。",
            "病名・障害名から支援を引く印象が出ないか。",
            "NBLが医療・法務・雇用判断を代替する印象が出ないか。",
        ],
        "allowed_values": ["public_concept_translation_possible", "public_translation_needs_revision", "hold_public_translation"],
        "if_accepts_moves": ["public_concept_review_input_ready"],
        "does_not_move": ["public_safe", "public_approved", "public_copy_approved", "SNS_approved"],
    },
    {
        "id": "G7-runtime-readiness",
        "question": "このCoreを将来runtimeに入れるなら、どの制約が最低限必要か。",
        "reviewer_checks": [
            "runtimeが返してよいのは構造仮説・欠落文脈・反対仮説までか。",
            "個別判断や配慮推奨に見える出力をどう止めるか。",
            "reviewed/unreviewed/source-validity/public-safeの状態をruntimeが表示できる必要があるか。",
        ],
        "allowed_values": ["runtime_preflight_contract_ready", "runtime_contract_needs_revision", "hold_runtime_readiness"],
        "if_accepts_moves": ["runtime_preflight_requirements_ready"],
        "does_not_move": ["runtime_approved", "provider_prompt_route_schema_DB_changes"],
    },
]


BLANK_RESULT_FORM = {
    "artifact_id": "stage1-production-ft03-human-review-result-form-blank-v0-2026-05-23",
    "instruction": "Reviewer fills result_value and reviewer_notes_no_raw_text. Do not paste raw/source/case text.",
    "reviewer": "",
    "date": "",
    "overall_decision": "",
    "gate_results": [
        {
            "gate_id": gate["id"],
            "result_value": "",
            "allowed_values": gate["allowed_values"],
            "reviewer_notes_no_raw_text": [],
            "required_revisions_no_raw_text": [],
            "named_routes_or_artifacts": [],
        }
        for gate in GATES
    ],
    "explicit_non_approval": [
        "not public-approved unless separately reviewed",
        "not runtime-approved unless separately approved",
        "not source/support validity unless explicitly stated in a separate gate",
        "not legal/medical/employment/accommodation finality",
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


def write_workbook() -> None:
    payload = {
        "artifact_id": OUT_PREFIX,
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "human_review_workbook_no_review_performed",
        "review_inputs": {key: rel(path) for key, path in REVIEW_INPUTS.items()},
        "review_modes": REVIEW_MODES,
        "gates": GATES,
        "blank_result_form": rel(RESULT_FORM_JSON),
    }
    validate(payload)
    WORKBOOK_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT03 Human Review Workbook",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: human review workbook / review未実施 / source-support validity未判断 / public不可 / runtime未承認",
        "",
        "## 何をすればよいか",
        "",
        "人間レビューでやることは、全成果物を精読して採点することではない。まず、下の7 gateに対して、accept / revise / holdを選ぶ。",
        "raw本文や個別source本文を貼らず、短い no-raw-text notes だけを残す。",
        "",
        "## 最短レビュー",
        "",
    ]
    for mode in REVIEW_MODES:
        lines.append(f"### {mode['id']} ({mode['time']})")
        lines.append(f"- purpose: {mode['purpose']}")
        lines.append(f"- read: {', '.join(mode['read'])}")
        lines.append(f"- decide: {', '.join(mode['decide'])}")
        lines.append("")
    lines.extend(["## Review Inputs", ""])
    for key, path in REVIEW_INPUTS.items():
        lines.append(f"- {key}: `{rel(path)}`")
    lines.extend(["", "## 7 Review Gates", ""])
    for gate in GATES:
        lines.append(f"### {gate['id']}")
        lines.append("")
        lines.append(f"判定すること: {gate['question']}")
        lines.append("")
        lines.append("見るポイント:")
        lines.extend(f"- {check}" for check in gate["reviewer_checks"])
        lines.append("")
        lines.append(f"選べる値: {', '.join(gate['allowed_values'])}")
        lines.append(f"accept時に前へ動くもの: {', '.join(gate['if_accepts_moves'])}")
        lines.append(f"ここでは動かないもの: {', '.join(gate['does_not_move'])}")
        lines.append("")
    lines.extend(
        [
            "## 返し方",
            "",
            f"空フォーム: `{rel(RESULT_FORM_JSON)}`",
            "",
            "Founder/reviewerは、このJSONの `result_value` と `reviewer_notes_no_raw_text` だけ埋めればよい。",
            "Codexはその結果を受け取った後、元成果物を上書きせず、review overlay artifactを別に作る。",
            "",
            f"JSON: `{rel(WORKBOOK_JSON)}`",
        ]
    )
    WORKBOOK_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_gate_map() -> None:
    payload = {
        "artifact_id": "stage1-production-ft03-gate-movement-map-v0-2026-05-23",
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "gate_movement_map_no_gate_moved",
        "gates": [
            {
                "gate_id": gate["id"],
                "if_accepts_moves": gate["if_accepts_moves"],
                "does_not_move": gate["does_not_move"],
                "result_values": gate["allowed_values"],
            }
            for gate in GATES
        ],
        "codex_next_after_result": [
            "create a separate review overlay artifact",
            "preserve original candidate artifacts",
            "apply only the gate movements explicitly approved by the human reviewer",
            "keep non-approved scopes visible",
        ],
    }
    validate(payload)
    GATE_MAP_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Stage 1 FT03 Gate Movement Map",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: gate movement map / gate未移動",
        "",
        "このartifactは、review結果が来た時に何が前へ動き、何が動かないかを固定する。Codexはこの時点では何も承認しない。",
        "",
    ]
    for gate in GATES:
        lines.append(f"## {gate['id']}")
        lines.append(f"- result values: {', '.join(gate['allowed_values'])}")
        lines.append(f"- accept moves: {', '.join(gate['if_accepts_moves'])}")
        lines.append(f"- does not move: {', '.join(gate['does_not_move'])}")
        lines.append("")
    lines.extend(
        [
            "## Codex Next After Human Result",
            "",
            "- review overlay artifactを別に作る。",
            "- 元candidate artifactは上書きしない。",
            "- 人間が明示したgateだけを動かす。",
            "- 非承認スコープは残す。",
            "",
            f"JSON: `{rel(GATE_MAP_JSON)}`",
        ]
    )
    GATE_MAP_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write() -> None:
    validate(BLANK_RESULT_FORM)
    RESULT_FORM_JSON.write_text(json.dumps(BLANK_RESULT_FORM, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_workbook()
    write_gate_map()
    print(
        json.dumps(
            {
                "workbook": rel(WORKBOOK_MD),
                "result_form": rel(RESULT_FORM_JSON),
                "gate_map": rel(GATE_MAP_MD),
                "gates": len(GATES),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    write()
