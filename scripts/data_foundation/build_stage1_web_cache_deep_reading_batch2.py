#!/usr/bin/env python3
"""Build Stage 1 web-cache deep-reading cards for underread official sources.

Batch 2 uses already-integrated Japanese official/quasi-official web-cache
sources that touch underread Stage 1 axes. It keeps them as unreviewed
candidate structure inputs and does not change promotion, runtime, or public
status.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = REPO_ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
AUDIT_JSONL = STAGE1_DIR / "stage1-production-web-cache-scima-fchma-source-cards-v0-2026-05-23.jsonl"

OUTPUT_JSON = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.json"
OUTPUT_MD = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md"
OUTPUT_JSONL = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-cards-v0-2026-05-23.jsonl"

JAPAN_OFFICIAL_PREFIXES = ("jeed_", "mhlw_", "nivr_")
UNDERREAD_AXES = ["C05-worksite-contact", "C06-life-security", "C07-quality-participation", "C08-prework-participation"]

AXIS_MOTIFS: dict[str, dict[str, Any]] = {
    "C05-worksite-contact": {
        "motif_id": "WCB2-M01-worksite-contact-procedure-safety",
        "routes": ["QR-03-worksite-contact-and-mobility", "QR-02-information-work-procedure"],
        "mechanism_reading": "仕事参加を、設備や職場環境項目ではなく、作業手順、身体操作、情報、安全、配置、責任遂行が接する接触点として読む。",
        "core_contribution": "C05を、2001 ABCとweb-cache双方から厚くし、職務接触点の分解をStage 1 Coreの中心的読み筋に戻す。",
        "counter_window": "設備・職務・作業環境を、支援妥当性や能力判定に変換しない。",
    },
    "C06-life-security": {
        "motif_id": "WCB2-M02-life-security-sequencing-and-service-boundary",
        "routes": ["QR-04-life-security-sequencing", "QR-05-entry-prework-translation"],
        "mechanism_reading": "制度、生活、賃金、助成、地域資源を、働く、待つ、休む、戻る、選び直す順序を開閉する条件として読む。",
        "core_contribution": "C06を背景事情から、健康時間・入口翻訳・支援接続の順序制約としてCoreへ戻す。",
        "counter_window": "制度・助成・生活資源を、現在使える支援案や法的判断として提示しない。",
    },
    "C07-quality-participation": {
        "motif_id": "WCB2-M03-quality-value-career-translation",
        "routes": ["QR-07-quality-career-and-value-translation"],
        "mechanism_reading": "雇用継続の後ろにある役割、評価、技能、処遇、キャリア、働きがいを、条件付き遂行の価値翻訳として読む。",
        "core_contribution": "C07を満足度・活躍談ではなく、参加品質と価値翻訳の構造として厚くする。",
        "counter_window": "成功事例、美談、企業評価、本人能力評価にしない。評価妥当性も判断しない。",
    },
    "C08-prework-participation": {
        "motif_id": "WCB2-M04-prework-entry-readiness-translation",
        "routes": ["QR-05-entry-prework-translation", "QR-06-disclosure-boundary-and-mutual-translation"],
        "mechanism_reading": "募集、採用、訓練、学校、支援機関、職務選定を、応募前の生活・支援・説明条件を求人条件へ翻訳する前段自由度として読む。",
        "core_contribution": "C08を準備不足でなく、入口以前参加から職務条件へつなぐ翻訳回廊として厚くする。",
        "counter_window": "未就労や入口前状態を本人側の不足・非就労志向として読まない。",
    },
}

FAMILY_READING: dict[str, str] = {
    "jeed_employer_q_and_a": "事業主向けQ&Aを、採用・配置・社内支援・職務選定の手順化された翻訳窓として読む。",
    "jeed_hearing_manual": "聴覚障害雇用支援manualを、情報保障、職場手順、安全、キャリアを分離して読む条件窓として使う。",
    "jeed_low_adoption_industry_casebook": "雇用が進みにくい業種の事例を、業種特性ではなく仕事接触点と支援接続の再設計窓として読む。",
    "jeed_reference": "JEED事例リファレンスを、好事例ではなく、職務・支援・情報・評価・生活条件の構造開閉窓として読む。",
    "jeed_regional_vocational_centers": "地域障害者職業センター資料を、サービス現況ではなく支援接続と役割分担のsource boundaryとして読む。",
    "jeed_regional_vocational_centers_exact_pair": "地域障害者職業センター対資料を、支援接続の粒度差を確認するsource boundaryとして読む。",
    "jeed_retention_utilization_casebook": "定着・活用事例を、継続支援と参加品質の再翻訳窓として読む。",
    "mhlw_disability_employment_policy": "厚労省政策資料を、現行政策主張ではなく、制度・雇用義務・差別禁止・合理的配慮がどの自由度へ触れるかの境界資料として読む。",
    "mhlw_disability_welfare_work_support": "障害福祉・就労支援資料を、サービス種別ではなく生活保障・入口以前参加・支援接続の順序窓として読む。",
    "mhlw_employment_reasonable_accommodation": "合理的配慮資料を、法的結論ではなく、開示境界・職務接触点・情報同期のclaim hygiene対象として読む。",
    "mhlw_nakapo_centers": "ナカポ資料を、現行サービス案内ではなく、地域支援接続のsource boundaryとして読む。",
    "mhlw_treatment_work_balance": "治療と仕事の両立資料を、健康時間と支援接続の順序設計として読む。",
    "mhlw_treatment_work_balance_navi": "両立支援ナビ資料を、現行サービス案内ではなく健康時間・制度接続の探索窓として読む。",
    "mhlw_treatment_work_consultable_support": "相談先資料を、現在利用可能案内ではなく、相談入口と支援接続の構造窓として読む。",
    "mhlw_treatment_work_consultation_map": "相談map資料を、現行案内でなく支援接続の地図化がどの自由度を見える化するかとして読む。",
    "mhlw_treatment_work_fee_subsidy": "助成資料を、制度利用案内ではなく生活保障・雇用継続順序の境界窓として読む。",
    "nivr_publications": "NIVR研究資料を、研究知見の確定ではなく、Stage 1 routeの構造仮説を検査する研究source windowとして読む。",
    "nivr_rehadat_japanese_translations": "REHADAT翻訳資料を、海外実務の移植ではなく、同型構造とjurisdiction差を比較する境界窓として読む。",
}


def load_selected_cards() -> list[dict[str, Any]]:
    selected: list[dict[str, Any]] = []
    with AUDIT_JSONL.open(encoding="utf-8") as f:
        for line in f:
            card = json.loads(line)
            if card["deep_read_priority"] != "P2_existing_source_underread_axis_deepening":
                continue
            if not card["source_family"].startswith(JAPAN_OFFICIAL_PREFIXES):
                continue
            selected.append(card)
    return selected


def dedupe(items: list[str]) -> list[str]:
    out: list[str] = []
    for item in items:
        if item not in out:
            out.append(item)
    return out


def axis_motif_payload(axis_id: str) -> dict[str, Any]:
    return AXIS_MOTIFS[axis_id]


def build_card(card: dict[str, Any]) -> dict[str, Any]:
    underread_axes = [axis for axis in card["top_axes"] if axis in UNDERREAD_AXES]
    motif_payloads = [axis_motif_payload(axis) for axis in underread_axes]
    motif_ids = [motif["motif_id"] for motif in motif_payloads]
    routes = dedupe(card["route_candidates"] + [route for motif in motif_payloads for route in motif["routes"]])
    return {
        "deep_card_id": card["source_card_id"].replace("stage1-web-cache", "stage1-web-cache-deep-reading-batch2"),
        "status": "web_cache_deep_reading_batch2_unreviewed_no_promotion_no_runtime_approval",
        "source_path": card["source_path"],
        "source_family": card["source_family"],
        "title": card["title"],
        "actor": card["actor"],
        "jurisdiction": card["jurisdiction"],
        "source_roles": card["source_roles"],
        "safe_layer": card["safe_layer"],
        "stage1_fragmentary_map_integrated": card["stage1_fragmentary_map_integrated"],
        "existing_stage1_top_axis": card["existing_stage1_top_axis"],
        "existing_stage1_integration_status": card["existing_stage1_integration_status"],
        "underread_axes": underread_axes,
        "motif_ids": motif_ids,
        "all_top_axes": card["top_axes"],
        "route_candidates": routes,
        "family_reading": FAMILY_READING.get(card["source_family"], "国内公式・準公式資料を、source boundaryとしてSCIMA/FCHMA routeへ戻す。"),
        "mechanism_readings": [motif["mechanism_reading"] for motif in motif_payloads],
        "core_contributions": [motif["core_contribution"] for motif in motif_payloads],
        "counter_windows": [motif["counter_window"] for motif in motif_payloads],
        "claim_hygiene": {
            "observation": "source may describe practice, policy, research, service, or employer guidance",
            "inference": "Stage 1 route placement is Falcon's candidate structural reading",
            "normative": "any recommended action remains source-bound and review-bound",
            "recommendation": "no source recommendation is treated as final, universal, or current without review",
        },
        "not_allowed": [
            "source/support validity decision",
            "support adequacy or worker capacity decision",
            "current policy or legal claim",
            "public guidance without live verification",
            "good-practice generalization",
            "condition-to-support lookup",
            "candidate_pattern movement",
            "reviewed knowledge promotion",
            "public/runtime approval",
        ],
        "source_text_exported": False,
        "review_status": "unreviewed",
    }


def build_outputs(cards: list[dict[str, Any]]) -> dict[str, Any]:
    deep_cards = [build_card(card) for card in cards]
    axis_counts = Counter(axis for card in deep_cards for axis in card["underread_axes"])
    route_counts = Counter(route for card in deep_cards for route in card["route_candidates"])
    family_counts = Counter(card["source_family"] for card in deep_cards)
    motif_counts = Counter(motif for card in deep_cards for motif in card["motif_ids"])

    family_profiles: list[dict[str, Any]] = []
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for card in deep_cards:
        grouped[card["source_family"]].append(card)
    for family, family_cards in sorted(grouped.items()):
        family_profiles.append(
            {
                "source_family": family,
                "source_count": len(family_cards),
                "actor": family_cards[0]["actor"],
                "jurisdiction": family_cards[0]["jurisdiction"],
                "safe_layer": family_cards[0]["safe_layer"],
                "family_reading": family_cards[0]["family_reading"],
                "underread_axis_counts": dict(Counter(axis for card in family_cards for axis in card["underread_axes"])),
                "route_counts": dict(Counter(route for card in family_cards for route in card["route_candidates"])),
                "examples": [
                    {
                        "source_path": card["source_path"],
                        "title": card["title"],
                        "underread_axes": card["underread_axes"],
                    }
                    for card in family_cards[:5]
                ],
            }
        )

    motif_cards: list[dict[str, Any]] = []
    for axis_id, motif in AXIS_MOTIFS.items():
        motif_cards.append(
            {
                "motif_id": motif["motif_id"],
                "axis_id": axis_id,
                "source_count": motif_counts[motif["motif_id"]],
                "routes": motif["routes"],
                "mechanism_reading": motif["mechanism_reading"],
                "core_contribution": motif["core_contribution"],
                "counter_window": motif["counter_window"],
                "family_counts": dict(
                    Counter(
                        card["source_family"]
                        for card in deep_cards
                        if motif["motif_id"] in card["motif_ids"]
                    )
                ),
            }
        )

    route_core_additions = {
        "QR-03-worksite-contact-and-mobility": "国内公式・準公式web-cacheのC05信号を、職務接触点、作業手順、安全、配置、情報接続の分解窓として追加する。",
        "QR-04-life-security-sequencing": "MHLW/JEED/海外比較ではなく国内資料内のC06信号を、制度・生活・助成・地域資源が就労順序へ触れる境界窓として追加する。",
        "QR-05-entry-prework-translation": "採用、訓練、支援機関、職務選定資料を、入口以前参加から求人条件への翻訳窓として追加する。",
        "QR-07-quality-career-and-value-translation": "定着、スキルアップ、キャリア、活躍、評価資料を、参加品質と価値翻訳の未レビュー候補として追加する。",
        "QR-02-information-work-procedure": "聴覚manual、Q&A、事例資料を、情報が作業手順・安全・責任分担へ落ちるかを見る窓として追加する。",
        "QR-06-disclosure-boundary-and-mutual-translation": "合理的配慮・相談・職場理解資料を、開示量でなく仕事条件への相互翻訳境界として追加する。",
    }

    return {
        "artifact_id": "stage1_production_web_cache_deep_reading_batch2_official_underread_axis_v0_2026_05_23",
        "lane": "Falcon / Falcon Lab",
        "status": "web_cache_deep_reading_batch2_unreviewed_no_promotion_no_runtime_approval",
        "review_status": "unreviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "source_text_exported": False,
        "source_artifacts": [
            str(AUDIT_JSONL.relative_to(REPO_ROOT)),
            "references/web-cache/",
        ],
        "method_boundary": {
            "web_cache_sources_are_not_cases": True,
            "no_source_validity_decision": True,
            "no_support_validity_judgment": True,
            "no_public_or_current_policy_claim": True,
            "no_knowledge_promotion": True,
            "no_runtime_approval": True,
        },
        "batch_scope": {
            "selection_rule": "P2_existing_source_underread_axis_deepening and source_family begins with jeed_/mhlw_/nivr_",
            "source_count": len(deep_cards),
            "underread_axes": UNDERREAD_AXES,
        },
        "underread_axis_counts": dict(axis_counts),
        "route_counts": dict(route_counts),
        "source_family_counts": dict(family_counts),
        "motif_cards": motif_cards,
        "family_profiles": family_profiles,
        "source_deep_cards": deep_cards,
        "stage1_route_core_additions": route_core_additions,
    }


def write_jsonl(cards: list[dict[str, Any]]) -> None:
    with OUTPUT_JSONL.open("w", encoding="utf-8") as f:
        for card in cards:
            f.write(json.dumps(card, ensure_ascii=False, sort_keys=True) + "\n")


def row(values: list[Any]) -> str:
    return "| " + " | ".join(str(value) for value in values) + " |"


def write_markdown(data: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Stage 1 Web-Cache Deep Reading Batch 2: Official Underread Axes",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: web-cache deep-reading candidate / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、既にStage 1断片資料mapへ入っている国内公式・準公式web-cacheのうち、C05/C06/C07/C08の薄い軸に触れている279件を、Core完成前の深読み層へ戻すBatch 2である。",
        "",
        "目的は、資料を支持根拠や指針として使うことではなく、仕事接触点、生活保障順序、参加品質、入口以前参加を、Stage 1 routeの接触点・翻訳機序・自由度・反対読みに変換することである。",
        "",
        "## Batch Scope",
        "",
        row(["item", "value"]),
        row(["---", "---"]),
        row(["source count", data["batch_scope"]["source_count"]]),
        row(["selection", data["batch_scope"]["selection_rule"]]),
        row(["source text exported", data["source_text_exported"]]),
        "",
        "## Underread Axis Counts",
        "",
        row(["axis", "sources"]),
        row(["---", "---:"]),
    ]
    for axis, count in sorted(data["underread_axis_counts"].items()):
        lines.append(row([f"`{axis}`", count]))

    lines.extend(["", "## Motif Cards", "", row(["motif", "axis", "sources", "routes", "core contribution", "counter window"]), row(["---", "---", "---:", "---", "---", "---"])])
    for motif in data["motif_cards"]:
        routes = ", ".join(f"`{route}`" for route in motif["routes"])
        lines.append(
            row(
                [
                    f"`{motif['motif_id']}`",
                    f"`{motif['axis_id']}`",
                    motif["source_count"],
                    routes,
                    motif["core_contribution"],
                    motif["counter_window"],
                ]
            )
        )

    lines.extend(["", "## Source Family Profiles", "", row(["family", "sources", "safe layer", "axis counts", "reading"]), row(["---", "---:", "---", "---", "---"])])
    for profile in data["family_profiles"]:
        axes = ", ".join(f"`{axis}`:{count}" for axis, count in sorted(profile["underread_axis_counts"].items()))
        lines.append(row([f"`{profile['source_family']}`", profile["source_count"], profile["safe_layer"], axes, profile["family_reading"]]))

    lines.extend(["", "## Stage 1 Route Additions", "", row(["route", "what this batch adds"]), row(["---", "---"])])
    for route, addition in data["stage1_route_core_additions"].items():
        lines.append(row([f"`{route}`", addition]))

    lines.extend(["", "## Source Deep Card Examples", "", row(["source", "family", "underread axes", "routes"]), row(["---", "---", "---", "---"])])
    for card in data["source_deep_cards"][:60]:
        axes = ", ".join(f"`{axis}`" for axis in card["underread_axes"])
        routes = ", ".join(f"`{route}`" for route in card["route_candidates"][:4])
        lines.append(row([f"`{card['source_path']}`", f"`{card['source_family']}`", axes, routes]))

    lines.extend(
        [
            "",
            "## Use Contract",
            "",
            "- 279件は既にStage 1断片mapへ入っているが、薄い軸の深読みに再利用する。",
            "- 国内公式・準公式資料でも、source/support validity、現行制度、合理的配慮、支援妥当性の最終判断はしない。",
            "- C05/C06/C07/C08は、個別sourceの主張ではなく、Stage 1 Coreがまだ厚くすべき構造自由度として読む。",
            "- legal/policy/current/service claimsには、live verificationとhuman reviewが必要である。",
            "",
            "## Next Safe Core Action",
            "",
            "Batch 1とBatch 2を、Stage 1 Core Completion Packetのweb-cache layerとして接続し、2001 ABC・survey・workshop・NIVR/web-cacheを同じ8 route上で閉じる。",
            "",
            f"JSON: `{OUTPUT_JSON.relative_to(REPO_ROOT)}`",
            f"JSONL: `{OUTPUT_JSONL.relative_to(REPO_ROOT)}`",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    source_cards = load_selected_cards()
    data = build_outputs(source_cards)
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_jsonl(data["source_deep_cards"])
    write_markdown(data)
    print(
        json.dumps(
            {
                "source_deep_cards": len(data["source_deep_cards"]),
                "families": len(data["source_family_counts"]),
                "motifs": len(data["motif_cards"]),
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
