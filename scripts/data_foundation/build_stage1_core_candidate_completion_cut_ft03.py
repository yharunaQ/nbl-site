#!/usr/bin/env python3
"""Build the Stage 1 Core candidate completion cut after FT-Codex-03.

The cut separates internal expert-network readiness from human review,
source/support validity, public use, and runtime approval. It is intentionally
not a promotion artifact.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_ID = "stage1-production-core-candidate-completion-cut-ft03-v0-2026-05-23"
OUT_JSON = RUN_DIR / f"{OUT_ID}.json"
OUT_MD = RUN_DIR / f"{OUT_ID}.md"


INPUTS = [
    RUN_DIR / "stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23-summary.md",
    RUN_DIR / "stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23-summary.md",
    RUN_DIR / "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md",
    RUN_DIR / "stage1-production-source-lens-saturation-map-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-c07-c08-route-through-core-use-cards-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-human-review-source-validity-packet-v0-2026-05-23.md",
]


COMPLETION_CUT = {
    "cut_id": "stage1_core_candidate_completion_cut_ft03",
    "cut_status": "internal_expert_network_candidate_cut_complete",
    "plain_meaning": "Stage 1 Coreは、Codex上で未レビューの内部専門知識ネットワーク候補として使うためのroute、source-lens、brake、holdが揃った。",
    "not_meaning": [
        "human-reviewed knowledge",
        "source/support validity approved knowledge",
        "public-safe or public-approved content",
        "runtime-approved retrieval or model behavior",
        "medical, legal, HR, accommodation, employment, or individual-case final guidance",
        "diagnosis/disability-to-accommodation lookup system",
    ],
    "why_this_cut_is_not_premature": [
        "FT-Codex-01/02で本人側survey free-textとstructured contextを8軸へ再読解した。",
        "FT-Codex-03でsupporter、workplace、NIVR、workshop側の薄読みに入り、Core route matrixへ再接続した。",
        "source-lens saturation mapで、厚い軸、route-through軸、honest holdを分けた。",
        "病名・障害名・制度カテゴリは、扱わない対象ではなく、相互作用を読む条件窓として再固定した。",
        "raw/redacted text、field value、PII、短い引用を外部化せず、判断ゲートを動かしていない。",
    ],
}


ROUTE_READINESS = [
    {
        "route_id": "QR-01-health-time-work-design",
        "readiness": "internal_candidate_ready_with_boundary",
        "use_for": ["健康時間の分解", "職場相談線の確認", "生活保障への逃がし", "将来再設計の問い出し"],
        "do_not_use_for": ["就労可能性予測", "医学的重症度判断", "配慮妥当性判断"],
        "source_lens_strength": ["respondent", "supporter", "workplace", "NIVR", "workshop", "web-cache"],
    },
    {
        "route_id": "QR-02-information-work-procedure",
        "readiness": "internal_candidate_ready_with_consent_boundary",
        "use_for": ["情報同期の分解", "共有同意範囲の問い出し", "業務手順・安全・評価への接続確認"],
        "do_not_use_for": ["開示正解化", "差別認定", "本人/職場の正誤判定"],
        "source_lens_strength": ["respondent", "supporter", "workplace", "workshop", "web-cache", "2001-ABC"],
    },
    {
        "route_id": "QR-03-worksite-contact-and-mobility",
        "readiness": "internal_candidate_ready_strong",
        "use_for": ["作業接触点分解", "安全・顧客・欠勤代替・人員余力の検査", "職場側source lensの構造化"],
        "do_not_use_for": ["能力判定", "企業妥当性判断", "設備チェックリスト化"],
        "source_lens_strength": ["respondent", "workplace", "workshop", "web-cache", "2001-ABC"],
    },
    {
        "route_id": "QR-04-life-security-sequencing",
        "readiness": "internal_candidate_ready_current_claim_hold",
        "use_for": ["待つ・休む・戻る自由度の分解", "収入・医療費・休職の順序検査", "C01/C05/C07過剰吸収のブレーキ"],
        "do_not_use_for": ["現行制度説明", "政策妥当性判断", "給付利用可能性判断"],
        "source_lens_strength": ["respondent", "supporter", "workplace", "NIVR", "workshop", "web-cache", "2001-ABC"],
    },
    {
        "route_id": "QR-05-entry-prework-translation",
        "readiness": "internal_candidate_ready_with_preentry_hold",
        "use_for": ["入口前後の順序検査", "求人表示・仕事像・体験・開始後支援の接続確認", "C02/C08の分離"],
        "do_not_use_for": ["readiness deficit判定", "非就労志向推定", "古い制度カテゴリの現行説明"],
        "source_lens_strength": ["respondent", "supporter", "workplace-boundary", "workshop", "web-cache"],
    },
    {
        "route_id": "QR-06-disclosure-boundary-and-mutual-translation",
        "readiness": "internal_candidate_ready_strong_with_hard_finality_brake",
        "use_for": ["開示境界の分解", "本人同意・職場理解・支援者仲介の検査", "翻訳停止点の特定"],
        "do_not_use_for": ["開示すべきかの判断", "法的妥当性判断", "個別配慮妥当性判断"],
        "source_lens_strength": ["respondent", "supporter", "workplace", "NIVR", "web-cache", "2001-ABC"],
    },
    {
        "route_id": "QR-07-quality-career-and-value-translation",
        "readiness": "route_through_ready_not_standalone",
        "use_for": ["役割・価値・処遇・将来見通しの翻訳検査", "C01/C03/C05/C06経由の参加品質分析"],
        "do_not_use_for": ["満足度や勤続からの成功証明", "単独Core昇格", "public-ready化"],
        "source_lens_strength": ["respondent", "supporter", "workplace", "NIVR", "web-cache", "2001-ABC"],
    },
    {
        "route_id": "QR-08-condition-window-not-lookup",
        "readiness": "global_guardrail_ready",
        "use_for": ["条件窓の明示", "共通構造と条件下特殊構造の分離", "病名・障害名と配慮/困難性の相互作用分析"],
        "do_not_use_for": ["病名から配慮を引く", "病名から困難性を推定する", "条件窓のタブー化"],
        "source_lens_strength": ["respondent", "supporter", "workplace", "NIVR", "workshop", "2001-ABC"],
    },
]


CHAT_USE_CONTRACT = {
    "allowed_internal_uses": [
        "route selection for a new case or source fragment",
        "structural hypothesis generation with uncertainty flags",
        "counter-hypothesis generation",
        "missing-context question generation",
        "source-lens comparison across respondent, supporter, workplace, NIVR, workshop, web-cache, and 2001 ABC",
        "first-principles framework refresh as long as it cites the Stage 1 candidate boundary",
        "Japan improvement agenda draft inputs as long as current-policy claims are not made without verification",
    ],
    "required_answer_shape": [
        "state which route or routes are being used",
        "separate observation, inference, and normative/recommendation language",
        "name missing context and overinterpretation risk",
        "use condition names as interaction windows, not direct lookup keys",
        "explicitly say when a claim is unreviewed candidate knowledge",
    ],
    "prohibited_uses": [
        "medical/legal/employment/accommodation/support adequacy final judgment",
        "source/support validity decision",
        "diagnosis/disability-to-accommodation lookup",
        "public copy, SNS claims, or current policy claims without separate review",
        "runtime retrieval, prompt, model, schema, route, or DB changes",
        "candidate_pattern, Domain Core, Atlas/27-frame, public-approved, or runtime-approved movement",
    ],
}


REVIEW_SEPARATION = [
    {
        "gate": "internal_expert_network_candidate",
        "state_after_cut": "complete_enough_for_codex_internal_use_with_boundaries",
        "owner": "Codex can use within Falcon Lab boundaries",
    },
    {
        "gate": "human_review",
        "state_after_cut": "not_done",
        "owner": "Founder/reviewer, not Codex alone",
    },
    {
        "gate": "source_support_validity",
        "state_after_cut": "not_done",
        "owner": "Founder/reviewer/Pro gate",
    },
    {
        "gate": "public_or_policy_use",
        "state_after_cut": "not_done",
        "owner": "separate source review, wording-risk review, and live verification",
    },
    {
        "gate": "runtime_use",
        "state_after_cut": "not_done",
        "owner": "separate architecture/runtime approval",
    },
]


NEXT_AFTER_CUT = [
    "refresh Stage 2 first-principles framework from the FT03 completion cut, not from older abstract synthesis",
    "then refresh Stage 3 Japan improvement agenda from the same cut with current-policy claim hold",
    "keep human review/source validity as a separate packet, not as a blocker to internal analysis use",
]


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
        "status": "core_candidate_completion_cut_no_text_export_no_promotion_unreviewed",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "inputs": [rel(path) for path in INPUTS],
        "completion_cut": COMPLETION_CUT,
        "route_readiness": ROUTE_READINESS,
        "chat_use_contract": CHAT_USE_CONTRACT,
        "review_separation": REVIEW_SEPARATION,
        "next_after_cut": NEXT_AFTER_CUT,
    }
    validate(payload)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Core Candidate Completion Cut FT-Codex-03",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: Core candidate completion cut / no text export / no promotion / unreviewed / public不可 / runtime未承認",
        "",
        "## Cut",
        "",
        COMPLETION_CUT["plain_meaning"],
        "",
        "これはhuman-reviewed knowledge、source/support validity、public approval、runtime approval、個別判断ではない。",
        "",
        "## Why This Cut Is Not Premature",
        "",
    ]
    lines.extend(f"- {item}" for item in COMPLETION_CUT["why_this_cut_is_not_premature"])
    lines.extend(["", "## Route Readiness", ""])
    for route in ROUTE_READINESS:
        lines.append(f"### {route['route_id']}")
        lines.append(f"- readiness: `{route['readiness']}`")
        lines.append(f"- source_lens: {', '.join(route['source_lens_strength'])}")
        lines.append(f"- use_for: {', '.join(route['use_for'])}")
        lines.append(f"- do_not_use_for: {', '.join(route['do_not_use_for'])}")
        lines.append("")
    lines.extend(["## Codex Chat Use Contract", "", "### Allowed Internal Uses"])
    lines.extend(f"- {item}" for item in CHAT_USE_CONTRACT["allowed_internal_uses"])
    lines.extend(["", "### Required Answer Shape"])
    lines.extend(f"- {item}" for item in CHAT_USE_CONTRACT["required_answer_shape"])
    lines.extend(["", "### Prohibited Uses"])
    lines.extend(f"- {item}" for item in CHAT_USE_CONTRACT["prohibited_uses"])
    lines.extend(["", "## Gate Separation", ""])
    for gate in REVIEW_SEPARATION:
        lines.append(f"- {gate['gate']}: {gate['state_after_cut']} / {gate['owner']}")
    lines.extend(["", "## Next After Cut", ""])
    lines.extend(f"- {item}" for item in NEXT_AFTER_CUT)
    lines.extend(["", "## Boundary", ""])
    lines.extend(f"- {item}" for item in COMPLETION_CUT["not_meaning"])
    lines.extend(
        [
            "- raw/redacted text、field value、短い引用、PIIは外部化していない。",
            "- 病名・障害名・制度カテゴリ等は、配慮や就労困難性との関係を相互作用として読む条件窓であり、単純因果lookupにはしない。",
            "",
            "## Inputs",
            "",
        ]
    )
    lines.extend(f"- `{rel(path)}`" for path in INPUTS)
    lines.extend(["", f"JSON: `{rel(OUT_JSON)}`"])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"json": rel(OUT_JSON), "md": rel(OUT_MD), "routes": len(ROUTE_READINESS)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
