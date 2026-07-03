#!/usr/bin/env python3
"""Convert C07/C08 adjacent-route samples into Core use cards.

The cards are operational reading aids for Codex chat. They do not promote
C07/C08, decide validity, or expose source text.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Callable


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
PREFIX = "stage1-production-c07-c08-route-through-core-use-cards-v0-2026-05-23"
SAMPLING = OUT_DIR / "stage1-production-c07-c08-adjacent-route-intersection-sampling-v0-2026-05-23.json"


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def sample_ids(
    samples: list[dict[str, Any]],
    predicate: Callable[[dict[str, Any]], bool],
    limit: int = 6,
) -> list[str]:
    return [row["record_id"] for row in samples if predicate(row)][:limit]


def has_strong(axis: str) -> Callable[[dict[str, Any]], bool]:
    return lambda row: axis in row["strong_intersection_axes"]


def has_boundary(axis: str) -> Callable[[dict[str, Any]], bool]:
    return lambda row: axis in row["boundary_intersection_axes"]


def role_is(role: str) -> Callable[[dict[str, Any]], bool]:
    return lambda row: row["sample_role"] == role


def source_is(source: str) -> Callable[[dict[str, Any]], bool]:
    return lambda row: row["sample_source"] == source


def and_(*predicates: Callable[[dict[str, Any]], bool]) -> Callable[[dict[str, Any]], bool]:
    return lambda row: all(predicate(row) for predicate in predicates)


def or_(*predicates: Callable[[dict[str, Any]], bool]) -> Callable[[dict[str, Any]], bool]:
    return lambda row: any(predicate(row) for predicate in predicates)


def build_cards(sampling: dict[str, Any]) -> list[dict[str, Any]]:
    c07 = sampling["c07"]["priority_samples"]
    c08 = sampling["c08"]["priority_samples"]
    c07_boundary = sample_ids(c07, role_is("boundary_brake_intersection"), 5)
    c08_boundary = sample_ids(c08, role_is("boundary_brake_intersection"), 5)

    cards = [
        {
            "card_id": "C07-RT-01-worksite-contact-to-value",
            "target_route": "QR-07-quality-career-and-value-translation",
            "route_through": ["QR-03-worksite-contact-and-mobility", "QR-02-information-work-procedure"],
            "mechanism": "仕事接触点を、役割・評価・処遇・将来見通しへ翻訳できているかを見る。",
            "use_when": ["働きがい、評価、役割、処遇、キャリアが問われ、仕事接触点や手順の信号がある時。"],
            "answer_move": [
                "最初にC05で作業、動線、情報、安全、支援、評価接触点を分解する。",
                "次にC07で、その接触点が価値・評価へ翻訳されたかを問う。",
                "満足度や雇用継続を成功証明にしない。",
            ],
            "sample_record_ids": sample_ids(c07, has_strong("C05-worksite-contact"), 8),
            "brake_record_ids": c07_boundary,
            "abc_mechanism_nodes": ["MN01", "MN07", "MN08", "MN09", "MN10", "MN12"],
        },
        {
            "card_id": "C07-RT-02-support-retranslation-to-value",
            "target_route": "QR-07-quality-career-and-value-translation",
            "route_through": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-02-information-work-procedure"],
            "mechanism": "支援の存在ではなく、遂行条件が役割・評価・価値へ再翻訳されたかを見る。",
            "use_when": ["支援、相談、説明、職場理解があり、それが評価や役割へ届くかが問われる時。"],
            "answer_move": [
                "支援あり/なしを効果判断にしない。",
                "支援が何を再翻訳したかを、情報、手順、責任分担、評価場面へ分ける。",
                "本人/職場どちらかの認識の正誤判定にしない。",
            ],
            "sample_record_ids": sample_ids(c07, and_(source_is("direct_target_corridor"), has_strong("C03-support-continuity")), 8),
            "brake_record_ids": c07_boundary,
            "abc_mechanism_nodes": ["MN03", "MN04", "MN08", "MN09", "MN10"],
        },
        {
            "card_id": "C07-RT-03-health-time-life-security-to-quality",
            "target_route": "QR-07-quality-career-and-value-translation",
            "route_through": ["QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
            "mechanism": "健康時間、負荷、生活保障、評価・処遇境界が参加品質をどう変えるかを見る。",
            "use_when": ["評価や働きがいの話が、疲労、休息、勤務量、収入、継続可能性と絡む時。"],
            "answer_move": [
                "健康時間を本人の安定性に閉じず、評価・役割・継続条件へ接続する。",
                "生活保障を周辺事情にせず、選択と継続の自由度として読む。",
                "評価や処遇の妥当性判断には進まない。",
            ],
            "sample_record_ids": sample_ids(
                c07,
                and_(
                    source_is("direct_target_corridor"),
                    or_(has_strong("C01-health-time"), has_strong("C06-life-security"), has_boundary("C06-life-security")),
                ),
                8,
            ),
            "brake_record_ids": c07_boundary,
            "abc_mechanism_nodes": ["MN05", "MN06", "MN07", "MN08", "MN10"],
        },
        {
            "card_id": "C07-RT-04-quality-blindspot-brake",
            "target_route": "QR-07-quality-career-and-value-translation",
            "route_through": ["QR-07-quality-career-and-value-translation"],
            "mechanism": "満足度、働けていること、構造化評価項目を、参加品質や支援妥当性の証明にしないためのブレーキ。",
            "use_when": ["C07の直接証拠が薄い、または満足度・継続・評価が単純成功として読まれそうな時。"],
            "answer_move": [
                "まずC07はnarrow test routeだと置く。",
                "役割・評価・将来見通しが閉じていない時は、仮説で止める。",
                "C05/C03/C01/C06のいずれかへ戻して機序を探す。",
            ],
            "sample_record_ids": c07_boundary,
            "brake_record_ids": c07_boundary,
            "abc_mechanism_nodes": ["MN07", "MN09", "MN10", "MN11"],
        },
        {
            "card_id": "C08-RT-01-entry-support-translation",
            "target_route": "QR-05-entry-prework-translation",
            "route_through": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-02-information-work-procedure"],
            "mechanism": "求職前・入口前の信号を、支援、開示、相談、求人条件への翻訳として読む。",
            "use_when": ["訓練、応募、自信、相談、説明範囲が入口前後で絡む時。"],
            "answer_move": [
                "準備不足や非就労志向として始めない。",
                "支援や開示が求人条件・仕事条件へ翻訳されたかを見る。",
                "入口前後を一続きの順序として読む。",
            ],
            "sample_record_ids": sample_ids(c08, and_(has_strong("C02-entry-translation"), has_strong("C03-support-continuity")), 8),
            "brake_record_ids": c08_boundary,
            "abc_mechanism_nodes": ["MN03", "MN04", "MN06", "MN10"],
        },
        {
            "card_id": "C08-RT-02-health-time-stamina-sequence",
            "target_route": "QR-05-entry-prework-translation",
            "route_through": ["QR-01-health-time-work-design"],
            "mechanism": "生活リズム、体力、健康時間を、訓練、応募、開始、継続の順序制約として読む。",
            "use_when": ["入口前の課題が、体力、生活リズム、通院、疲労、活動時間と絡む時。"],
            "answer_move": [
                "健康時間を能力不足に変換しない。",
                "どの順序が開けば次の参加自由度が開くかを問う。",
                "職場接触点へ持ち越される条件を分ける。",
            ],
            "sample_record_ids": sample_ids(c08, has_strong("C01-health-time"), 8),
            "brake_record_ids": c08_boundary,
            "abc_mechanism_nodes": ["MN05", "MN06", "MN11"],
        },
        {
            "card_id": "C08-RT-03-life-security-entry-sequencing",
            "target_route": "QR-05-entry-prework-translation",
            "route_through": ["QR-04-life-security-sequencing"],
            "mechanism": "生活保障、制度、外部支援、家族・地域生活を、入口前後の選び直し自由度として読む。",
            "use_when": ["入口や訓練の話が、収入、制度、通勤、生活再建、支援接続と絡む時。"],
            "answer_move": [
                "生活保障を背景要因で終わらせない。",
                "休む、待つ、訓練する、応募する、戻る、選び直す順序を描く。",
                "2001 ABCは雇用中リンクデータなので、入口以前の直接根拠にはしない。",
            ],
            "sample_record_ids": sample_ids(c08, or_(has_strong("C06-life-security"), has_boundary("C06-life-security")), 8),
            "brake_record_ids": c08_boundary,
            "abc_mechanism_nodes": ["MN06", "MN08", "MN10"],
        },
        {
            "card_id": "C08-RT-04-low-context-nonwork-brake",
            "target_route": "QR-05-entry-prework-translation",
            "route_through": ["QR-05-entry-prework-translation"],
            "mechanism": "低文脈・非就労信号を、意欲、準備不足、能力不足へ短絡しないためのブレーキ。",
            "use_when": ["入口前データが薄い、非就労・低文脈信号がある、またはreadiness deficitに読まれそうな時。"],
            "answer_move": [
                "C08はweak/narrow routeとして扱う。",
                "低文脈信号を支援対象化や欠如判断へ変換しない。",
                "C01/C06/C02/C03へ戻して、何の自由度が閉じているかだけを問う。",
            ],
            "sample_record_ids": c08_boundary,
            "brake_record_ids": c08_boundary,
            "abc_mechanism_nodes": ["MN06", "MN11"],
        },
    ]
    for card in cards:
        card.update(
            {
                "review_status": "unreviewed",
                "promotion_status": "none",
                "public_status": "not_public",
                "runtime_status": "not_runtime_approved",
                "source_text_exported": False,
                "redacted_text_exported": False,
                "field_value_exported": False,
                "validity_judgment_made": False,
                "not_allowed": [
                    "support validity judgment",
                    "support or accommodation recommendation",
                    "work capacity judgment",
                    "readiness deficit judgment",
                    "condition-to-support lookup",
                    "candidate_pattern or Domain Core promotion",
                ],
            }
        )
    return cards


def main() -> None:
    sampling = load_json(SAMPLING)
    assert sampling["source_text_exported"] is False
    assert sampling["redacted_text_exported"] is False
    assert sampling["field_value_exported"] is False

    cards = build_cards(sampling)
    payload = {
        "artifact_id": PREFIX,
        "lane": "Falcon Lab",
        "status": "route_through_core_use_cards",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "validity_judgment_made": False,
        "source_artifacts": [str(SAMPLING.relative_to(ROOT))],
        "cards": cards,
        "answer_contract_addition": [
            "When C07 is triggered, route through C05/C03/C01/C06 before using value/evaluation language.",
            "When C08 is triggered, route through C02/C03/C01/C06 before using entry/prework language.",
            "Always attach the blindspot/low-context brake for C07/C08.",
            "Do not treat these cards as reviewed knowledge or runtime-approved retrieval objects.",
        ],
    }
    (OUT_DIR / f"{PREFIX}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (OUT_DIR / f"{PREFIX}.jsonl").open("w", encoding="utf-8") as fh:
        for card in cards:
            fh.write(json.dumps(card, ensure_ascii=False) + "\n")
    (OUT_DIR / f"{PREFIX}.md").write_text(make_md(payload), encoding="utf-8")
    print(PREFIX, "cards=", len(cards))


def make_md(data: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 C07/C08 Route-Through Core Use Cards",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon Lab",
        "状態: route-through Core use cards / 本文引用なし / 昇格なし / 公開不可 / runtime未承認",
        "",
        "## Position",
        "",
        "C07/C08をCore昇格するのではなく、厚い隣接routeを通して使うためのCodexチャット用カード。カードは未レビューの読み補助であり、支援妥当性・就労能力・readiness・配慮妥当性を判断しない。",
        "",
        "## Answer Contract Addition",
    ]
    for item in data["answer_contract_addition"]:
        lines.append(f"- {item}")
    lines.extend(["", "## Cards", "", "| card | route through | sample anchors | brake anchors | answer move |", "|---|---|---|---|---|"])
    for card in data["cards"]:
        route = ", ".join(f"`{item}`" for item in card["route_through"])
        samples = ", ".join(f"`{item}`" for item in card["sample_record_ids"])
        brakes = ", ".join(f"`{item}`" for item in card["brake_record_ids"])
        move = " / ".join(card["answer_move"])
        lines.append(f"| `{card['card_id']}` | {route} | {samples} | {brakes} | {move} |")
    lines.extend(["", "## Boundary", ""])
    for item in data["cards"][0]["not_allowed"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    main()
