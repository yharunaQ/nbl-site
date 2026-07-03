#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
CATALOG_JSON = RUN_DIR / "stage1-production-structural-family-proposition-catalog-v0-2026-05-18.json"
SCALE_RULES_JSON = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.md"


CARD_READINGS: dict[str, dict[str, str]] = {
    "SF-01-health-time-choice-bundle": {
        "core": "健康状態を理由に働ける/働けないを判定するのではなく、仕事と生活の時間配分をどこで組み替えられるかを見る。",
        "diversity": "難病・慢性疾患では通院・疲労・収入が前に出やすいが、聴覚、視覚、認知、内部障害では時間配分の形が別になる。",
        "risk": "健康問題を就労可否や本人の体調管理能力に戻すと、仕事設計側の自由度を失う。",
    },
    "SF-02-entry-sequence-constraint": {
        "core": "入口を求人応募の一点ではなく、健康、生活、訓練、支援、説明、求人条件の順序問題として読む。",
        "diversity": "視覚では訓練・資格・移動、認知では手順・支援者、内部障害では生活再建や健康管理が入口順序を変える。",
        "risk": "求職活動の量や求人不足だけでまとめると、入口の前に閉じている自由度を見落とす。",
    },
    "SF-03-prework-participation-translation": {
        "core": "就労以前の生活・訓練・地域参加を、求人条件へ接続される前段自由度として読む。",
        "diversity": "認知・発達・知的条件では読み書き・記憶・手順、視覚では訓練形式、内部障害では体力・健康管理が前段自由度になる。",
        "risk": "未就労を準備不足として読むと、入口以前に必要な翻訳機能を消してしまう。",
    },
    "SF-04-information-synchronization": {
        "core": "情報を形式ではなく、仕事参加、評価、安全、健康時間に届く同期範囲として読む。",
        "diversity": "聴覚では非公式情報と聞き取り負荷、視覚では資料・移動安全、認知では手順と確認可能性、内部障害では健康管理情報が中心になる。",
        "risk": "情報共有量や本人説明能力の問題へ戻すと、構造自由度が潰れる。",
    },
    "SF-05-career-participation-value": {
        "core": "働けているかではなく、条件付き遂行が役割、成果、処遇、将来見通しへ価値化されているかを見る。",
        "diversity": "障害・疾病条件によって、価値化されにくい成果、役割拡大、処遇、働きがいの形が変わる。",
        "risk": "満足度や本人能力に戻すと、仕事の価値翻訳という構造が見えなくなる。",
    },
    "SF-06-evaluation-translation-rule": {
        "core": "支援や変動を前提にした遂行が、評価規則の中で仕事上の価値として扱われるかを見る。",
        "diversity": "体調変動、認知条件、情報条件、移動条件は、それぞれ評価で不可視化される場所が違う。",
        "risk": "評価や処遇の妥当性判断に進むと、未レビュー境界を越える。ここでは評価翻訳の構造候補に留める。",
    },
    "SF-07-worksite-contact-design": {
        "core": "設備ではなく、本人条件と職務が接する面を、移動、安全、手順、休憩、プライバシー、尊厳として読む。",
        "diversity": "視覚では移動・資料・時間帯、内部障害ではトイレ・服薬・休憩、聴覚では呼び出し・安全確認、認知では手順が接触点になる。",
        "risk": "障害種類別対応表にすると、同じ仕事接触点の開閉構造を見失う。",
    },
    "SF-08-support-retranslation": {
        "core": "支援の有無ではなく、誰が何を仕事参加へ翻訳し直しているかを見る。",
        "diversity": "支援が開く自由度は、入口、職場内調整、本人説明、評価、生活再建で異なる。",
        "risk": "支援有効性や支援者評価に進むと境界を越える。翻訳機能と残余自由度だけを見る。",
    },
    "SF-09-disclosure-translation-boundary": {
        "core": "開示は言う/言わないではなく、本人条件と職務条件をどの範囲で翻訳するかの境界として読む。",
        "diversity": "内部障害では見えにくさと不利益不安、聴覚では会議・相談場面、認知では本人が言える場、視覚では安全・資料条件が境界になる。",
        "risk": "本人説明能力や開示量に戻すと、相互翻訳の自由度を失う。",
    },
    "SF-10-life-security-sequencing": {
        "core": "生活保障を背景事情ではなく、待てる時間、選べる仕事、使える支援を制約する順序構造として読む。",
        "diversity": "難病・慢性疾患では医療費や休業保障、内部障害では生活の質、認知・発達条件では家族・支援接続が順序を変える。",
        "risk": "困窮や就労意欲の問題として読むと、生活保障が入口・健康時間・評価処遇を閉じる構造を失う。",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def ids(values: list[str], limit: int = 6) -> list[str]:
    return values[:limit]


def simplify_window(window: dict[str, Any]) -> dict[str, Any]:
    return {
        "condition": window["condition_bucket"],
        "axis_package": window["axis_package"],
        "state": window["state"],
        "record_count": window["record_count"],
        "example_ids": ids(window["example_ids"]),
    }


def simplify_pair(pair: dict[str, Any]) -> dict[str, Any]:
    return {
        "condition": pair["condition_bucket"],
        "axis_package": pair["axis_package"],
        "open_state": pair["open_state"],
        "open_record_count": pair["open_record_count"],
        "open_example_ids": ids(pair["open_example_ids"], 4),
        "closed_state": pair["closed_state"],
        "closed_record_count": pair["closed_record_count"],
        "closed_example_ids": ids(pair["closed_example_ids"], 4),
    }


def build_cards() -> dict[str, Any]:
    catalog = load_json(CATALOG_JSON)
    scale_rules = {
        item["family_id"]: item
        for item in load_json(SCALE_RULES_JSON)["structural_family_scale_rules"]
    }
    cards = []
    for index, catalog_item in enumerate(catalog["families"], start=1):
        family_id = catalog_item["family_id"]
        scale_item = scale_rules[family_id]
        reading = CARD_READINGS[family_id]
        card = {
            "card_id": f"SFC-{index:02d}",
            "family_id": family_id,
            "title": catalog_item["title"],
            "status": "machine_generated_unreviewed_no_promotion",
            "record_count": catalog_item["record_count"],
            "boundary_record_count": catalog_item["boundary_record_count"],
            "candidate_proposition": catalog_item["candidate_proposition"],
            "counter_reading": catalog_item["counter_proposition"],
            "discriminator": catalog_item["discriminator"],
            "core_reading": reading["core"],
            "diversity_inside_commonality": reading["diversity"],
            "overread_risk": reading["risk"],
            "split_dimensions": catalog_item["split_dimensions"],
            "common_windows": [simplify_window(item) for item in scale_item["common_windows"][:3]],
            "minority_windows": [simplify_window(item) for item in scale_item["minority_windows"][:5]],
            "open_closed_pairs": [simplify_pair(item) for item in scale_item["open_closed_pairs"][:4]],
            "read_anchor_ids": {
                "common_core": catalog_item["common_core_ids"],
                "minority_condition": catalog_item["minority_condition_ids"],
                "open_closed": catalog_item["open_closed_ids"],
                "boundary_return": catalog_item["boundary_return_ids"],
            },
        }
        cards.append(card)
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-family-review-cards-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "source_artifacts": [
            str(CATALOG_JSON.relative_to(ROOT)),
            str(SCALE_RULES_JSON.relative_to(ROOT)),
        ],
        "purpose": "10 structural familyを、Founder/Proが方法の働き方として確認できるレビューカードへ展開した未レビュー成果物。",
        "card_count": len(cards),
        "cards": cards,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values)


def window_line(window: dict[str, Any]) -> str:
    return (
        f"{window['condition']} / {window['state']} / {window['record_count']}件: "
        f"{ids_text(window['example_ids'])}"
    )


def pair_line(pair: dict[str, Any]) -> str:
    return (
        f"{pair['condition']} / open {pair['open_state']} {pair['open_record_count']}件 "
        f"({ids_text(pair['open_example_ids'])}) / closed {pair['closed_state']} {pair['closed_record_count']}件 "
        f"({ids_text(pair['closed_example_ids'])})"
    )


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Family Review Cards",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "10個のstructural familyを、候補命題、反対読み、識別点、多数窓、少数条件窓、開閉ペア、境界戻しIDまで含むレビューカードへ展開した。これは知識昇格ではなく、全件分析でSCIMA/FCHMAの構造読解が働いているかを確認するための成果物である。",
        "",
        "## Cards",
        "",
    ]
    for card in payload["cards"]:
        lines.extend(
            [
                f"### {card['card_id']} {card['family_id']} {card['title']}",
                "",
                f"- records: {card['record_count']}",
                f"- boundary records: {card['boundary_record_count']}",
                f"- 候補命題: {card['candidate_proposition']}",
                f"- 反対読み: {card['counter_reading']}",
                f"- 識別点: {card['discriminator']}",
                f"- 読みの核心: {card['core_reading']}",
                f"- 共通性の中の多様性: {card['diversity_inside_commonality']}",
                f"- 過読リスク: {card['overread_risk']}",
                f"- split dimensions: {', '.join(card['split_dimensions'])}",
                "",
                "#### Common Windows",
                "",
            ]
        )
        for window in card["common_windows"]:
            lines.append(f"- {window_line(window)}")
        lines.extend(["", "#### Minority Condition Windows", ""])
        for window in card["minority_windows"]:
            lines.append(f"- {window_line(window)}")
        lines.extend(["", "#### Open / Closed Pairs", ""])
        for pair in card["open_closed_pairs"]:
            lines.append(f"- {pair_line(pair)}")
        lines.extend(
            [
                "",
                "#### Read Anchors",
                "",
                f"- common core: {ids_text(card['read_anchor_ids']['common_core'])}",
                f"- minority condition: {ids_text(card['read_anchor_ids']['minority_condition'])}",
                f"- open/closed: {ids_text(card['read_anchor_ids']['open_closed'])}",
                f"- boundary return: {ids_text(card['read_anchor_ids']['boundary_return'])}",
                "",
            ]
        )

    lines.extend(
        [
            "## Use In Next Analysis",
            "",
            "- まずこの10カードを固定した作業単位として、RC/record側の候補命題を再生成する。",
            "- recordは1 familyへ閉じ込めず、主family、境界family、戻し先familyを保持する。",
            "- 少数条件窓は別分類にしない。同じ候補命題の下位形状として読む。",
            "- 開いた側と閉じた側は別パターンに切断せず、同じ構造の開閉・残余状態として保持する。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_cards()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
