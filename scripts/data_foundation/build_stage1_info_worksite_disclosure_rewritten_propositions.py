#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
SCALE_RULES_JSON = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.json"
BUNDLE_E_MD = RUN_DIR / "stage1-production-bundle-e-info-worksite-disclosure-polarity-context-reading-v0-2026-05-18.md"
OUT_JSON = RUN_DIR / "stage1-production-info-worksite-disclosure-rewritten-propositions-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-info-worksite-disclosure-rewritten-propositions-v0-2026-05-18.md"


FAMILY_REWRITES: dict[str, dict[str, Any]] = {
    "SF-04-information-synchronization": {
        "short_name": "情報同期",
        "rewritten_candidate_proposition": (
            "情報同期は情報形式の提供ではなく、本人の機能条件・健康時間・支援役割・職務条件が、"
            "業務指示、非公式情報、安全確認、相談場面、役割期待、評価へどこまで同期しているかの構造である。"
        ),
        "counter_proposition": (
            "情報共有量を増やせば解決する、または本人説明能力だけの問題である、とは読めない。"
            "支援がある場合も、どの同期面が開き、どの同期面が残るかを分けて読む。"
        ),
        "condition_shapes": {
            "認知・発達・知的": "手順、役割期待、確認可能性、評価規則への同期が中心になる。",
            "聴覚・音声情報": "聞き取り負荷、非公式情報、会議・相談場面、健康時間への同期が中心になる。",
            "視覚情報": "資料形式、移動安全、訓練・資格、仕事評価への同期が中心になる。",
            "内部障害・全身管理": "健康管理、休憩・通院、説明範囲、勤務量への同期が中心になる。",
            "精神・心理": "職場反応、安心して言える場、評価・役割期待への同期が中心になる。",
        },
    },
    "SF-07-worksite-contact-design": {
        "short_name": "仕事接触点",
        "rewritten_candidate_proposition": (
            "仕事接触点は設備や配慮項目ではなく、本人の機能条件と職務が接する面を、"
            "移動、姿勢、作業手順、安全確認、時間帯、休憩、代替作業、プライバシー、尊厳として設計できているかの構造である。"
        ),
        "counter_proposition": (
            "障害種類別の設備対応表、または職場環境の一般改善としては足りない。"
            "同じ支援でも、職務との接触面に届いているかで開く自由度が変わる。"
        ),
        "condition_shapes": {
            "認知・発達・知的": "作業手順、確認方法、仕事量、支援者の役割分担が接触点になる。",
            "聴覚・音声情報": "呼び出し、安全確認、非公式コミュニケーション、相談場面が接触点になる。",
            "視覚情報": "移動安全、資料・画面、時間帯、通勤、訓練形式が接触点になる。",
            "内部障害・全身管理": "トイレ、臭い、服薬、休憩、通院、体調変動、プライバシーが接触点になる。",
            "移動・姿勢・身体操作": "通勤、姿勢、作業場所、設備、代替動作、安全確認が接触点になる。",
        },
    },
    "SF-09-disclosure-translation-boundary": {
        "short_name": "開示境界",
        "rewritten_candidate_proposition": (
            "開示境界は伝える量や本人の説明能力ではなく、本人条件と職務条件を、"
            "誰が、どの場面で、どの範囲まで翻訳し、不利益・誤解・本人負荷をどう下げるかの構造である。"
        ),
        "counter_proposition": (
            "開示する/しないの二択、または本人がうまく説明すべき問題としては読めない。"
            "支援者が入る場合も、翻訳される内容と残るリスクを分ける必要がある。"
        ),
        "condition_shapes": {
            "認知・発達・知的": "本人が言える場、支援者による補助説明、仕事条件への翻訳が境界になる。",
            "聴覚・音声情報": "聞こえにくさ、会議・相談場面、配慮伝達、周囲の理解が境界になる。",
            "視覚情報": "移動・資料・安全・訓練条件をどこまで職場へ説明するかが境界になる。",
            "内部障害・全身管理": "見えにくい体調管理、トイレ・服薬・休憩、差別不安、処遇不安が境界になる。",
            "精神・心理": "職場反応への不安、説明負荷、安心して相談できる相手が境界になる。",
        },
    },
}


PROBLEM_REWRITES = [
    {
        "original_id": "RC-02A-working-function-workdesign-underalignment",
        "rewritten_candidate_proposition": (
            "就労継続中でも、心身機能・健康時間・作業量・職務代替・評価規則が広い範囲で同期せず、"
            "仕事設計そのものが本人条件を十分に受け止めていない可能性。"
        ),
        "distinction": "広域の仕事設計未整合を読む。部分的支援の残余問題とは分ける。",
    },
    {
        "original_id": "RC-02B-working-partial-accommodation-gap",
        "rewritten_candidate_proposition": (
            "就労継続中で、支援・配慮・職場枠が一部の自由度を開いているが、"
            "情報同期、開示境界、健康時間、評価・将来見通しの残余自由度が残っている可能性。"
        ),
        "distinction": "開いた自由度と残る自由度を読む。支援有効性判断ではない。",
    },
    {
        "original_id": "RC-10A-transition-with-carried-work-difficulty",
        "rewritten_candidate_proposition": (
            "過去就業・離職・訓練・求職の経験から、健康時間、仕事接触点、生活保障、開示境界の未解決自由度が、"
            "次の入口順序へ持ち越されている可能性。"
        ),
        "distinction": "過去就業経験がある再入口の再同期問題を読む。",
    },
    {
        "original_id": "RC-10B-job-search-disclosure-support-friction",
        "rewritten_candidate_proposition": (
            "就職活動・未就労入口で、求人条件、説明範囲、支援接続、訓練・資格、生活見通しがまだ接続されず、"
            "入口以前から入口への翻訳が摩擦を起こしている可能性。"
        ),
        "distinction": "過去就業の持ち越しではなく、入口前の翻訳摩擦を読む。",
    },
    {
        "original_id": "RC-04-high-function-burden-low-work-context",
        "rewritten_candidate_proposition": (
            "心身機能上の負荷は強いが、仕事設計、情報同期、支援接続、生活保障のどこで職業問題化しているかが薄く混合しており、"
            "単独パターンではなく構造穴探索窓として扱うべき可能性。"
        ),
        "distinction": "弱いパターンという説明ではなく、どの構造へ戻すべきかを探す境界命題にする。",
    },
]


def load_scale_rules() -> dict[str, Any]:
    payload = json.loads(SCALE_RULES_JSON.read_text(encoding="utf-8"))
    return {item["family_id"]: item for item in payload["structural_family_scale_rules"]}


def condition_shape(condition: str, shapes: dict[str, str]) -> str:
    return shapes.get(condition, "同じ自由度がこの条件窓でどの形を取るか、本文読解で確認する。")


def rewrite_family(family: dict[str, Any], rewrite: dict[str, Any]) -> dict[str, Any]:
    minority_windows = family["minority_windows"][:8]
    polarity_pairs = family["open_closed_pairs"][:6]
    return {
        "family_id": family["family_id"],
        "title": family["title"],
        "record_count": family["record_count"],
        "boundary_record_count": family["boundary_record_count"],
        "rewritten_candidate_proposition": rewrite["rewritten_candidate_proposition"],
        "counter_proposition": rewrite["counter_proposition"],
        "avoid": family["avoid"],
        "split_dimensions": family["split_dimensions"],
        "minority_windows": [
            {
                **window,
                "shape_reading": condition_shape(window["condition_bucket"], rewrite["condition_shapes"]),
            }
            for window in minority_windows
        ],
        "open_closed_pairs": [
            {
                **pair,
                "shape_reading": condition_shape(pair["condition_bucket"], rewrite["condition_shapes"]),
            }
            for pair in polarity_pairs
        ],
    }


def build_payload() -> dict[str, Any]:
    scale_rules = load_scale_rules()
    families = [
        rewrite_family(scale_rules[family_id], rewrite)
        for family_id, rewrite in FAMILY_REWRITES.items()
    ]
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-info-worksite-disclosure-rewritten-propositions-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "source_artifacts": [
            str(SCALE_RULES_JSON.relative_to(ROOT)),
            str(BUNDLE_E_MD.relative_to(ROOT)),
        ],
        "purpose": "SF-04/SF-07/SF-09と重複命題カードを、構造名・条件窓・開閉/残余状態で書き分けるための未レビュー成果物。",
        "family_rewrites": families,
        "problem_rewrites": PROBLEM_REWRITES,
    }


def ids_text(ids: list[str], limit: int = 6) -> str:
    return ", ".join(f"`{item}`" for item in ids[:limit])


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Info Worksite Disclosure Rewritten Propositions",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "Bundle Eの読解を、実際の候補命題書き換えに落とした。狙いは、同じ抽象命題を複数カードへ貼るのを止め、構造名、条件窓、開いた自由度、残る自由度が見える命題にすること。",
        "",
        "## Problematic Proposition Rewrites",
        "",
        "| original | rewritten candidate proposition | distinction |",
        "|---|---|---|",
    ]
    for item in payload["problem_rewrites"]:
        lines.append(
            f"| `{item['original_id']}` | {item['rewritten_candidate_proposition']} | {item['distinction']} |"
        )

    lines.extend(["", "## Family Rewrites", ""])
    for family in payload["family_rewrites"]:
        lines.extend(
            [
                f"### {family['family_id']} {family['title']}",
                "",
                f"- records: {family['record_count']}",
                f"- boundary records: {family['boundary_record_count']}",
                f"- 候補命題: {family['rewritten_candidate_proposition']}",
                f"- 反対読み: {family['counter_proposition']}",
                f"- 避ける読み: {family['avoid']}",
                "",
                "#### Minority Condition Windows",
                "",
                "| condition | state | records | shape reading | examples |",
                "|---|---|---:|---|---|",
            ]
        )
        for window in family["minority_windows"]:
            lines.append(
                "| "
                f"{window['condition_bucket']} | "
                f"{window['state']} | "
                f"{window['record_count']} | "
                f"{window['shape_reading']} | "
                f"{ids_text(window['example_ids'])} |"
            )
        lines.extend(
            [
                "",
                "#### Open / Closed Pair Rewrites",
                "",
                "| condition | open | closed | shape reading | representative IDs |",
                "|---|---|---|---|---|",
            ]
        )
        for pair in family["open_closed_pairs"]:
            ids = pair["open_example_ids"][:3] + pair["closed_example_ids"][:3]
            lines.append(
                "| "
                f"{pair['condition_bucket']} | "
                f"{pair['open_state']} {pair['open_record_count']} | "
                f"{pair['closed_state']} {pair['closed_record_count']} | "
                f"{pair['shape_reading']} | "
                f"{ids_text(ids, 6)} |"
            )
        lines.append("")

    lines.extend(
        [
            "## Use In Next Analysis",
            "",
            "- RC系カードを再生成する時、候補命題はこの粒度で書く。",
            "- `支援が翻訳機能を担う` と `広範未整合` は別パターンではなく、同じ構造の開閉・残余としてペアで扱う。",
            "- 10件未満の条件窓は候補命題化せず、境界例または同型探索の材料として保持する。",
            "- 反対読みは、候補命題を支持する否定材料ではなく、別構造・境界・残余を誤って潰さないための読みとして書く。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
