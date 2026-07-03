#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
SCALE_RULES_JSON = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-family-proposition-catalog-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-family-proposition-catalog-v0-2026-05-18.md"


PROPOSITIONS: dict[str, dict[str, str]] = {
    "SF-01-health-time-choice-bundle": {
        "proposition": "健康時間は就労可否ではなく、続ける、休む、戻る、選び直す自由度を、勤務時間、休息、通院、収入保障、職場理解の束として再配分できるかの構造である。",
        "counter": "病状の重さ、本人の意欲、就労継続/非継続の状態だけでは説明しない。",
        "discriminator": "健康時間が、職務量・休み方・収入・制度対象・支援接続のどこを変えているか。",
    },
    "SF-02-entry-sequence-constraint": {
        "proposition": "移行入口は求人応募の一時点ではなく、健康安定、求人条件、訓練、支援利用、説明範囲、生活再建をどの順序で接続できるかの構造である。",
        "counter": "就職活動の積極性、準備不足、求人不足だけには還元しない。",
        "discriminator": "入口に入る前に、どの条件が先に整わないと次の自由度が開かないか。",
    },
    "SF-03-prework-participation-translation": {
        "proposition": "入口以前参加は生活準備一般ではなく、生活リズム、体力、読み書き・記憶・手順、訓練、家族・地域・支援者を求人条件へ翻訳する前段自由度である。",
        "counter": "未就労や生活参加を本人準備不足や非就労志向として問題化しない。",
        "discriminator": "入口以前の活動が、どの職務条件・訓練条件・説明条件へ接続されると入口が開くか。",
    },
    "SF-04-information-synchronization": {
        "proposition": "情報同期は情報形式の提供ではなく、本人条件・健康時間・支援役割・職務条件が、業務指示、非公式情報、安全確認、相談場面、役割期待、評価へどこまで同期しているかの構造である。",
        "counter": "情報共有量を増やす、または本人説明能力だけの問題として読まない。",
        "discriminator": "どの情報面が開いており、どの情報面が仕事参加・評価・安全・健康時間に届いていないか。",
    },
    "SF-05-career-participation-value": {
        "proposition": "キャリア参加価値は、条件付きの遂行や勤務継続が、成果、役割、処遇、働きがい、将来見通しへ価値翻訳されているかの構造である。",
        "counter": "満足度、昇進意欲、個人能力、職場への感謝/不満だけでは説明しない。",
        "discriminator": "できている仕事が、役割拡大・評価・処遇・将来見通しへどう翻訳されるか。",
    },
    "SF-06-evaluation-translation-rule": {
        "proposition": "評価翻訳は、配慮・支援・体調変動を前提にした遂行が、通常の評価規則で過小評価されず、仕事上の価値として扱われるかの構造である。",
        "counter": "生産性、勤怠、能力、配慮の妥当性判断には還元しない。",
        "discriminator": "変動や支援付き遂行が、評価・処遇・役割期待のどこで価値化または不可視化されるか。",
    },
    "SF-07-worksite-contact-design": {
        "proposition": "仕事接触点は設備や配慮項目ではなく、本人の機能条件と職務が接する面を、移動、姿勢、作業手順、安全確認、時間帯、休憩、代替作業、プライバシー、尊厳として設計できているかの構造である。",
        "counter": "障害種類別対応表、設備リスト、職場環境一般には落とさない。",
        "discriminator": "どの接触点が仕事参加を開き、どの接触点が健康時間・情報同期・評価へ未接続で残るか。",
    },
    "SF-08-support-retranslation": {
        "proposition": "支援再翻訳は、支援の有無ではなく、本人条件、職務条件、求人条件、生活条件、評価条件を誰がどのタイミングで仕事参加へ翻訳し直すかの構造である。",
        "counter": "相談先の有効性、支援者評価、制度利用の有無として判断しない。",
        "discriminator": "支援が何を翻訳しており、どの自由度を開き、どの自由度を残しているか。",
    },
    "SF-09-disclosure-translation-boundary": {
        "proposition": "開示境界は伝える量や本人の説明能力ではなく、本人条件と職務条件を、誰が、どの場面で、どの範囲まで翻訳し、不利益・誤解・本人負荷をどう下げるかの構造である。",
        "counter": "開示する/しない、本人がうまく説明すべき、という二択にはしない。",
        "discriminator": "何を伝えると自由度が開き、何を伝えると不利益・誤解・負荷が増えるか。",
    },
    "SF-10-life-security-sequencing": {
        "proposition": "生活保障順序は、収入、医療費、家計責任、雇用形態、制度対象、休業時保障、生活再建が、待てる時間、選べる仕事、使える支援をどう制約するかの構造である。",
        "counter": "生活困窮、就労意欲、働き方の希望だけとして読まない。",
        "discriminator": "生活保障が、入口順序、健康時間、支援接続、評価処遇のどこを先に閉じるか。",
    },
}


def load_scale_rules() -> list[dict[str, Any]]:
    payload = json.loads(SCALE_RULES_JSON.read_text(encoding="utf-8"))
    return payload["structural_family_scale_rules"]


def first_packet_ids(family: dict[str, Any], suffix: str) -> list[str]:
    for packet in family["read_packets"]:
        if packet["packet_id"].endswith(suffix):
            return packet["record_ids"][:8]
    return []


def build_catalog() -> dict[str, Any]:
    families = []
    for family in load_scale_rules():
        rewrite = PROPOSITIONS[family["family_id"]]
        families.append(
            {
                "family_id": family["family_id"],
                "title": family["title"],
                "record_count": family["record_count"],
                "boundary_record_count": family["boundary_record_count"],
                "candidate_proposition": rewrite["proposition"],
                "counter_proposition": rewrite["counter"],
                "discriminator": rewrite["discriminator"],
                "split_dimensions": family["split_dimensions"],
                "avoid": family["avoid"],
                "common_core_ids": first_packet_ids(family, "common-core"),
                "minority_condition_ids": first_packet_ids(family, "minority-condition"),
                "open_closed_ids": first_packet_ids(family, "open-closed-polarity"),
                "boundary_return_ids": first_packet_ids(family, "boundary-return"),
            }
        )
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-family-proposition-catalog-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "source_artifacts": [str(SCALE_RULES_JSON.relative_to(ROOT))],
        "purpose": "10 structural familiesを、互いに重複しない候補命題・反対読み・識別子として使うための未レビューcatalog。",
        "family_count": len(families),
        "families": families,
    }


def ids_text(ids: list[str]) -> str:
    return ", ".join(f"`{item}`" for item in ids)


def write_markdown(catalog: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Family Proposition Catalog",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "10個のstructural familyを、互いに重複しない候補命題・反対読み・識別子へ書き分けた。これは知識昇格ではなく、全件分析時に同じ抽象文を複数カードへ貼ることを避けるための分析用catalogである。",
        "",
        "## Catalog",
        "",
        "| family | records | boundary | candidate proposition | counter reading | discriminator |",
        "|---|---:|---:|---|---|---|",
    ]
    for item in catalog["families"]:
        lines.append(
            "| "
            f"`{item['family_id']}` {item['title']} | "
            f"{item['record_count']} | "
            f"{item['boundary_record_count']} | "
            f"{item['candidate_proposition']} | "
            f"{item['counter_proposition']} | "
            f"{item['discriminator']} |"
        )

    lines.extend(["", "## Read Anchors", ""])
    for item in catalog["families"]:
        lines.extend(
            [
                f"### {item['family_id']} {item['title']}",
                "",
                f"- split dimensions: {', '.join(item['split_dimensions'])}",
                f"- avoid: {item['avoid']}",
                f"- common core IDs: {ids_text(item['common_core_ids'])}",
                f"- minority condition IDs: {ids_text(item['minority_condition_ids'])}",
                f"- open/closed IDs: {ids_text(item['open_closed_ids'])}",
                f"- boundary return IDs: {ids_text(item['boundary_return_ids'])}",
                "",
            ]
        )

    lines.extend(
        [
            "## Use In Next Analysis",
            "",
            "- family名だけで分類せず、candidate proposition、counter proposition、discriminatorの3点で読む。",
            "- 条件窓別の特徴は、familyの下位形状として読む。疾病・障害種類を最終分類にしない。",
            "- 支援・配慮の有無は開閉状態として扱い、支援有効性判断へ移らない。",
            "- 反対読みは、候補命題の否定材料ではなく、別構造・境界・残余を誤って潰さないために使う。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    catalog = build_catalog()
    OUT_JSON.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(catalog)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
