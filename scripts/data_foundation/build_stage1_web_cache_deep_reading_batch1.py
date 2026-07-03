#!/usr/bin/env python3
"""Build Stage 1 web-cache deep-reading cards for P0 JEED sources.

The output turns P0 unintegrated Japanese official/quasi-official web-cache
sources into SCIMA/FCHMA structural reading cards. It does not quote source
text, judge support validity, or promote knowledge.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = REPO_ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
AUDIT_JSONL = STAGE1_DIR / "stage1-production-web-cache-scima-fchma-source-cards-v0-2026-05-23.jsonl"
OUTPUT_JSON = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.json"
OUTPUT_MD = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.md"
OUTPUT_JSONL = STAGE1_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-cards-v0-2026-05-23.jsonl"


MOTIF_RULES: dict[str, dict[str, Any]] = {
    "WC-M01-regional-network-to-work-continuity": {
        "title_keywords": ["地域", "ネットワーク", "つながり"],
        "axes": ["C02-entry-translation", "C03-support-continuity", "C08-prework-participation"],
        "routes": [
            "QR-05-entry-prework-translation",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "mechanism_reading": "地域資源や関係者の接続を、入口以前参加から職場継続へ翻訳する支援連結機序として読む。",
        "core_contribution": "支援は単一機関の有無ではなく、地域・職場・本人条件を再翻訳する接続面として扱える。",
        "counter_window": "地域連携を有効性の証明や制度優位の根拠にしない。どの自由度が再接続されたかだけを見る。",
    },
    "WC-M02-life-support-stabilizes-work-choice": {
        "title_keywords": ["社員寮", "生活支援", "安定就労"],
        "axes": ["C06-life-security", "C03-support-continuity", "C02-entry-translation"],
        "routes": [
            "QR-04-life-security-sequencing",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "mechanism_reading": "住まい・生活支援・職場継続を、働く前後の順序制約と再接続の構造として読む。",
        "core_contribution": "生活保障は背景事情ではなく、働く、休む、戻る、続ける自由度を開閉する条件としてCoreに戻せる。",
        "counter_window": "生活支援があれば安定就労できる、という一般化はしない。雇用中事例の選択性も残す。",
    },
    "WC-M03-task-contact-and-workflow-redesign": {
        "title_keywords": ["ピッキング", "梱包", "物流", "製造ライン", "リサイクル", "農場", "現場", "こまつな"],
        "axes": ["C05-worksite-contact", "C02-entry-translation", "C03-support-continuity"],
        "routes": [
            "QR-03-worksite-contact-and-mobility",
            "QR-02-information-work-procedure",
        ],
        "mechanism_reading": "職務を大きな雇用枠ではなく、作業手順、道具、配置、安全、周囲との接触点へ分解して読む。",
        "core_contribution": "2001 ABCで強まったC05を、現代の職場事例web-cache側から補強する候補になる。",
        "counter_window": "職務分解を能力判定や作業適性の決定にしない。職場側の設計・評価・支援接続を同時に見る。",
    },
    "WC-M04-mutual-understanding-and-disclosure-translation": {
        "title_keywords": ["当事者目線", "相互理解", "意思表示", "安心", "悩まない", "迷わない", "個別の支援", "特性や疾患"],
        "axes": ["C04-information-participation", "C03-support-continuity", "C02-entry-translation"],
        "routes": [
            "QR-02-information-work-procedure",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "mechanism_reading": "説明、意思表示、理解、個別支援を、開示量ではなく仕事条件への相互翻訳として読む。",
        "core_contribution": "本人の説明力や職場の善意へ還元せず、情報が手順・責任・相談・安全・評価へ落ちるかを問える。",
        "counter_window": "誰が正しく理解したか、どの配慮が妥当かを判断しない。認識差は翻訳境界として扱う。",
    },
    "WC-M05-team-role-and-information-procedure": {
        "title_keywords": ["チーム", "一緒に働く", "あたりまえの職場"],
        "axes": ["C07-quality-participation", "C04-information-participation", "C03-support-continuity"],
        "routes": [
            "QR-07-quality-career-and-value-translation",
            "QR-02-information-work-procedure",
        ],
        "mechanism_reading": "チーム内の役割、手順、周囲との関係を、参加品質と情報同期の構造として読む。",
        "core_contribution": "働けているかではなく、役割・評価・周囲との手順化が参加品質をどう変えるかを補強する。",
        "counter_window": "職場文化の美談や成功事例として使わない。役割と評価のどこが開閉したかを読む。",
    },
    "WC-M06-value-career-and-skill-translation": {
        "title_keywords": ["スキルアップ", "戦力化", "リーダー", "未来", "能力", "活かす", "成果"],
        "axes": ["C07-quality-participation", "C02-entry-translation", "C03-support-continuity"],
        "routes": [
            "QR-07-quality-career-and-value-translation",
            "QR-05-entry-prework-translation",
        ],
        "mechanism_reading": "条件付き遂行や支援下の遂行が、成果、技能、役割、将来見通しへ価値翻訳されるかを見る。",
        "core_contribution": "C07を満足度ではなく、仕事上の価値翻訳と上方向参加品質として厚くする。",
        "counter_window": "戦力化・能力発揮を本人努力や職場成功の一般論にしない。評価妥当性も判断しない。",
    },
}


DEFAULT_MOTIF = {
    "motif_id": "WC-M00-jeed-reference-general-work-support-translation",
    "axes": ["C02-entry-translation", "C03-support-continuity"],
    "routes": [
        "QR-05-entry-prework-translation",
        "QR-06-disclosure-boundary-and-mutual-translation",
    ],
    "mechanism_reading": "JEED事例を、入口条件、職場条件、支援接続の再翻訳候補として読む。",
    "core_contribution": "事例を成功根拠にせず、どのSCIMA/FCHMA自由度が開閉したかを探すsource windowにする。",
    "counter_window": "支援妥当性、能力、雇用管理、制度効果の最終判断へ進まない。",
}


def load_cards() -> list[dict[str, Any]]:
    cards: list[dict[str, Any]] = []
    with AUDIT_JSONL.open(encoding="utf-8") as f:
        for line in f:
            card = json.loads(line)
            if card["deep_read_priority"] == "P0_unintegrated_japan_official_or_research_core":
                cards.append(card)
    return cards


def motif_matches(title: str) -> list[str]:
    matched: list[str] = []
    for motif_id, rule in MOTIF_RULES.items():
        if any(keyword in title for keyword in rule["title_keywords"]):
            matched.append(motif_id)
    return matched or [DEFAULT_MOTIF["motif_id"]]


def motif_payload(motif_id: str) -> dict[str, Any]:
    if motif_id == DEFAULT_MOTIF["motif_id"]:
        return DEFAULT_MOTIF
    payload = dict(MOTIF_RULES[motif_id])
    payload["motif_id"] = motif_id
    return payload


def dedupe(seq: list[str]) -> list[str]:
    out: list[str] = []
    for item in seq:
        if item not in out:
            out.append(item)
    return out


def build_source_deep_card(card: dict[str, Any]) -> dict[str, Any]:
    motifs = [motif_payload(motif_id) for motif_id in motif_matches(card["title"])]
    axes = dedupe(card["top_axes"] + [axis for motif in motifs for axis in motif["axes"]])
    routes = dedupe(card["route_candidates"] + [route for motif in motifs for route in motif["routes"]])
    return {
        "deep_card_id": card["source_card_id"].replace("stage1-web-cache", "stage1-web-cache-deep-reading"),
        "status": "web_cache_deep_reading_candidate_unreviewed_no_promotion_no_runtime_approval",
        "source_path": card["source_path"],
        "source_family": card["source_family"],
        "title": card["title"],
        "actor": card["actor"],
        "jurisdiction": card["jurisdiction"],
        "source_roles": card["source_roles"],
        "safe_layer": "candidate_structure_input",
        "source_identity_boundary": {
            "local_reading": "local cached source signals from the web-cache audit plus title-level motif classification",
            "live_verified": False,
            "why_not_higher": "not human-reviewed; no currentness check; no source/support validity decision",
        },
        "motif_ids": [motif["motif_id"] for motif in motifs],
        "scima_fchma_axes": axes[:6],
        "route_candidates": routes[:8],
        "mechanism_readings": [motif["mechanism_reading"] for motif in motifs],
        "core_contributions": [motif["core_contribution"] for motif in motifs],
        "counter_windows": [motif["counter_window"] for motif in motifs],
        "deep_read_questions": [
            "このsourceは、どの接触点・翻訳機序・自由度・反対読みを厚くするか。",
            "sourceの実務語彙は、Stage 1 routeのどのoperatorに戻せるか。",
            "成功・好事例・制度説明に見える部分を、支援妥当性でなく構造開閉として読めるか。",
            "同じ観測を、情報同期、生活保障、仕事接触点、参加品質のどれへ戻すべきか。",
        ],
        "not_allowed": [
            "source/support validity decision",
            "support adequacy or worker capacity decision",
            "current policy or legal claim",
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
    deep_cards = [build_source_deep_card(card) for card in cards]
    motif_sources: dict[str, list[dict[str, Any]]] = defaultdict(list)
    route_counts = Counter()
    axis_counts = Counter()
    for card in deep_cards:
        for motif_id in card["motif_ids"]:
            motif_sources[motif_id].append(
                {
                    "source_path": card["source_path"],
                    "title": card["title"],
                    "axes": card["scima_fchma_axes"][:4],
                }
            )
        for route in card["route_candidates"]:
            route_counts[route] += 1
        for axis in card["scima_fchma_axes"]:
            axis_counts[axis] += 1

    motif_cards: list[dict[str, Any]] = []
    for motif_id, sources in sorted(motif_sources.items()):
        payload = motif_payload(motif_id)
        motif_cards.append(
            {
                "motif_id": motif_id,
                "status": "web_cache_motif_unreviewed_no_promotion",
                "source_count": len(sources),
                "axes": payload["axes"],
                "routes": payload["routes"],
                "mechanism_reading": payload["mechanism_reading"],
                "core_contribution": payload["core_contribution"],
                "counter_window": payload["counter_window"],
                "sources": sources,
            }
        )

    route_core_additions = {
        "QR-03-worksite-contact-and-mobility": "JEED事例の作業・現場・物流・農場・製造・リサイクル語彙を、仕事接触点の分解候補として追加する。",
        "QR-04-life-security-sequencing": "生活支援・住まい・安定就労の資料を、生活保障が就労継続順序を変える候補窓として追加する。",
        "QR-05-entry-prework-translation": "準備、地域、支援接続、入口翻訳の資料を、応募以前から職務条件へつなぐ候補窓として追加する。",
        "QR-06-disclosure-boundary-and-mutual-translation": "当事者目線、相互理解、意思表示、個別支援の資料を、開示量ではなく相互翻訳境界として追加する。",
        "QR-07-quality-career-and-value-translation": "スキルアップ、戦力化、リーダー、能力活用の資料を、条件付き遂行の価値翻訳候補として追加する。",
        "QR-02-information-work-procedure": "意思表示、チーム、手順、個別支援の資料を、情報が作業手順へ落ちるかを見る候補として追加する。",
    }

    return {
        "artifact_id": "stage1_production_web_cache_deep_reading_batch1_jeed_reference_p0_v0_2026_05_23",
        "lane": "Falcon / Falcon Lab",
        "status": "web_cache_deep_reading_batch_unreviewed_no_promotion_no_runtime_approval",
        "review_status": "unreviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "source_text_exported": False,
        "source_artifacts": [
            str(AUDIT_JSONL.relative_to(REPO_ROOT)),
            "references/web-cache/jeed_reference/",
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
            "selection_rule": "P0_unintegrated_japan_official_or_research_core from web-cache source audit",
            "source_count": len(deep_cards),
            "family": "jeed_reference",
            "actor": "JEED",
            "jurisdiction": "Japan",
        },
        "axis_counts": dict(axis_counts),
        "route_counts": dict(route_counts),
        "motif_cards": motif_cards,
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
        "# Stage 1 Web-Cache Deep Reading Batch 1: JEED Reference P0",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: web-cache deep-reading candidate / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、web-cache source auditでP0になった未統合JEED事例リファレンス20件を、Stage 1 CoreのSCIMA/FCHMA深読みに接続するBatch 1である。",
        "",
        "ここでのJEED事例は、成功事例、支援妥当性根拠、現行指針、配慮表ではない。職務接触点、地域支援、入口翻訳、相互理解、参加品質、生活保障順序を厚くするsource windowとして使う。",
        "",
        "## Batch Scope",
        "",
        row(["item", "value"]),
        row(["---", "---"]),
        row(["source family", "`jeed_reference`"]),
        row(["source count", data["batch_scope"]["source_count"]]),
        row(["selection", data["batch_scope"]["selection_rule"]]),
        row(["source text exported", data["source_text_exported"]]),
        "",
        "## Motif Cards",
        "",
        row(["motif", "sources", "axes", "routes", "core contribution", "counter window"]),
        row(["---", "---:", "---", "---", "---", "---"]),
    ]
    for motif in data["motif_cards"]:
        axes = ", ".join(f"`{axis}`" for axis in motif["axes"])
        routes = ", ".join(f"`{route}`" for route in motif["routes"])
        lines.append(
            row(
                [
                    f"`{motif['motif_id']}`",
                    motif["source_count"],
                    axes,
                    routes,
                    motif["core_contribution"],
                    motif["counter_window"],
                ]
            )
        )

    lines.extend(
        [
            "",
            "## Stage 1 Route Additions",
            "",
            row(["route", "what this batch adds"]),
            row(["---", "---"]),
        ]
    )
    for route, addition in data["stage1_route_core_additions"].items():
        lines.append(row([f"`{route}`", addition]))

    lines.extend(
        [
            "",
            "## Source Deep Cards",
            "",
            row(["source", "motifs", "axes", "routes", "primary reading"]),
            row(["---", "---", "---", "---", "---"]),
        ]
    )
    for card in data["source_deep_cards"]:
        motifs = ", ".join(f"`{motif}`" for motif in card["motif_ids"])
        axes = ", ".join(f"`{axis}`" for axis in card["scima_fchma_axes"][:4])
        routes = ", ".join(f"`{route}`" for route in card["route_candidates"][:4])
        lines.append(
            row(
                [
                    f"`{card['source_path']}`",
                    motifs,
                    axes,
                    routes,
                    card["mechanism_readings"][0],
                ]
            )
        )

    lines.extend(
        [
            "",
            "## Use Contract",
            "",
            "- JEED事例を、良い支援・悪い支援の判定に使わない。",
            "- 事例内の職務・生活・支援・地域・情報・評価語彙を、Stage 1 routeの接触点、翻訳機序、自由度、反対読みへ戻す。",
            "- 事例が示す構造は、支援妥当性でも現在の制度説明でもなく、未レビューのcandidate structure inputである。",
            "- public/current/legal/accommodation claimに使う前には、live verificationとhuman reviewが必要である。",
            "",
            "## Next Safe Core Action",
            "",
            "このBatch 1を、Stage 1 Core Completion Packetのweb-cache reading layerに接続する。次は、既存統合済みだが薄い軸に触れているJEED/MHLW/NIVR sourcesを、C05/C06/C07/C08中心にBatch 2として深読みに回す。",
            "",
            f"JSON: `{OUTPUT_JSON.relative_to(REPO_ROOT)}`",
            f"JSONL: `{OUTPUT_JSONL.relative_to(REPO_ROOT)}`",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    source_cards = load_cards()
    data = build_outputs(source_cards)
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_jsonl(data["source_deep_cards"])
    write_markdown(data)
    print(
        json.dumps(
            {
                "source_deep_cards": len(data["source_deep_cards"]),
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
