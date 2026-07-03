#!/usr/bin/env python3
"""Calibrate the Stage 1 Core Expert Kernel with CR-01..CR-05 rereading."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

KERNEL = OUT_DIR / "stage1-production-core-expert-kernel-v0-2026-05-23.json"
ROUTE_CUT = OUT_DIR / "stage1-production-rereading-route-integration-cut-v0-2026-05-23.json"
PREFIX = "stage1-production-core-expert-kernel-reread-calibration-v0-2026-05-23"


ROUTE_CALIBRATION = {
    "QR-01-health-time-work-design": {
        "closure_tier": "active_boundary_sensitive",
        "uses_route_implications": ["RI-01-health-time-life-security", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "健康時間を仕事設計へ読む時は、work-time/task-load/support/sequence/life-securityのどれで関係が閉じているかを先に示す。",
        "must_add_brake": "健康・体調・収入の共起だけでは就労困難、支援必要、仕事能力を判断しない。",
    },
    "QR-02-information-work-procedure": {
        "closure_tier": "active_with_contact_point_support",
        "uses_route_implications": ["RI-04-worksite-contact", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "情報は説明量ではなく、作業手順・安全・責任・評価に届く接触点として読む。",
        "must_add_brake": "本人の説明能力や感覚障害カテゴリだけに還元しない。",
    },
    "QR-03-worksite-contact-and-mobility": {
        "closure_tier": "thickest_current_route",
        "uses_route_implications": ["RI-04-worksite-contact", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "Stage 1で最も厚い現在routeとして、仕事接触点をtask/workflow, access/rest/safety, information, mobility, body-posture-energy, support retranslation, evaluation-valueへ分解する。",
        "must_add_brake": "設備リスト、障害種類別対応表、配慮妥当性判断にしない。",
    },
    "QR-04-life-security-sequencing": {
        "closure_tier": "active_boundary_sensitive",
        "uses_route_implications": ["RI-01-health-time-life-security", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "生活保障は背景ではなく、待つ、休む、治療する、選び直す、戻る順序自由度として読む。",
        "must_add_brake": "制度・給付・政策の現在妥当性や本人の就労意欲判断に進まない。",
    },
    "QR-05-entry-prework-translation": {
        "closure_tier": "narrow_test_route",
        "uses_route_implications": ["RI-03-prework-entry-translation", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "入口以前参加は、training/life rhythm/stamina/support/entry actionがsequenceとして閉じた時だけ厚く使う。",
        "must_add_brake": "未就労、訓練、低文脈、非就労志向を準備不足や能力不足に変換しない。",
    },
    "QR-06-disclosure-boundary-and-mutual-translation": {
        "closure_tier": "not_directly_reread_in_this_cut",
        "uses_route_implications": ["RI-04-worksite-contact", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "開示は、情報がどの職務接触点へ安全に翻訳されるかとして、CR-04の接触点grammarを経由して読む。",
        "must_add_brake": "開示すべきか、誰が正しいか、どの情報が十分かを決めない。",
    },
    "QR-07-quality-career-and-value-translation": {
        "closure_tier": "narrow_test_route",
        "uses_route_implications": ["RI-02-quality-value-translation", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "働きがい・評価・キャリアは、role/evaluation/treatment/future-outlook translationが文脈で閉じた時だけ厚く使う。",
        "must_add_brake": "満足度、定着、処遇、仕事状態、構造化項目被覆だけで参加品質を語らない。",
    },
    "QR-08-diversity-conditioned-same-structure": {
        "closure_tier": "condition_window_with_hard_lookup_brake",
        "uses_route_implications": ["RI-04-worksite-contact", "RI-05-residual-hold-counterexamples"],
        "answer_modifier": "条件窓は、同じ接触点・時間・情報・評価・生活保障構造がどの形で変形するかを見るために使う。",
        "must_add_brake": "病名・障害名から配慮、困難性、支援必要性を直接引かない。",
    },
}


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def route_implication_map(route_cut: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {item["route_id"]: item for item in route_cut["route_implications"]}


def main() -> None:
    kernel = load(KERNEL)
    route_cut = load(ROUTE_CUT)
    ri_map = route_implication_map(route_cut)
    calibrated_routes = []
    for route in kernel["route_kernels"]:
        route_id = route["route_id"]
        calibration = ROUTE_CALIBRATION[route_id]
        implications = [ri_map[item] for item in calibration["uses_route_implications"]]
        calibrated_routes.append(
            {
                "route_id": route_id,
                "closure_tier_after_reread": calibration["closure_tier"],
                "answer_modifier": calibration["answer_modifier"],
                "must_add_brake": calibration["must_add_brake"],
                "reread_implication_ids": calibration["uses_route_implications"],
                "reread_counts": [
                    {
                        "route_implication": item["route_id"],
                        "records": item["record_count"],
                        "context_advanced": item["context_advanced"],
                        "needs_context_confirmation": item["needs_context_confirmation"],
                        "brake_or_boundary": item["brake_or_boundary"],
                    }
                    for item in implications
                ],
                "preserved_kernel_core_function": route["core_function"],
                "preserved_kernel_counter_readings": route["counter_readings"],
            }
        )

    payload = {
        "artifact_id": PREFIX,
        "lane": "Falcon / Falcon Lab",
        "status": "kernel_calibration_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "raw_original_opened": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "source_artifacts": {
            "core_expert_kernel": str(KERNEL.relative_to(ROOT)),
            "route_integration_cut": str(ROUTE_CUT.relative_to(ROOT)),
        },
        "calibration_rule": [
            "Use the original Core Expert Kernel for concepts, routes, mechanisms, and counter-readings.",
            "Use this calibration before answering so route strength follows record-level rereading.",
            "Structured-field coverage is only a possibility window; do not count it as Core support.",
            "CR-05 is a mandatory brake before any route is described as complete.",
        ],
        "route_calibrations": calibrated_routes,
        "chat_use_sequence": [
            "Identify the user intent and candidate QR route.",
            "Read this route calibration before using the route kernel.",
            "If closure_tier is narrow_test_route, answer as a question/hypothesis structure, not as a stable route.",
            "If closure_tier is thickest_current_route, still include the CR-05 brake and no adequacy judgment.",
            "If condition windows appear, use them to vary contact points and freedoms, not to infer supports.",
        ],
    }
    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(payload), encoding="utf-8")
    print(PREFIX, "routes=", len(calibrated_routes))


def make_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 Core Expert Kernel Reread Calibration",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: kernel calibration / raw本文未読 / 本文引用なし / 昇格なし / 公開不可",
        "",
        "既存Core Expert Kernelを捨てず、CR-01..CR-05のrecord-level再読解で回答時の使い方を較正する。",
        "",
        "## Calibration Rule",
    ]
    for item in payload["calibration_rule"]:
        lines.append(f"- {item}")
    lines.extend(["", "## Chat Use Sequence"])
    for item in payload["chat_use_sequence"]:
        lines.append(f"- {item}")
    lines.extend(["", "## Route Calibrations", ""])
    for route in payload["route_calibrations"]:
        lines.extend([
            f"### {route['route_id']}",
            f"- closure_tier_after_reread: `{route['closure_tier_after_reread']}`",
            f"- answer_modifier: {route['answer_modifier']}",
            f"- must_add_brake: {route['must_add_brake']}",
            "- reread_counts:",
        ])
        for count in route["reread_counts"]:
            lines.append(
                f"  - {count['route_implication']}: records={count['records']}, "
                f"context_advanced={count['context_advanced']}, "
                f"needs_context_confirmation={count['needs_context_confirmation']}, "
                f"brake_or_boundary={count['brake_or_boundary']}"
            )
        lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
