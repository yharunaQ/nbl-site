#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OVERLAP_JSON = RUN_DIR / "stage1-production-structural-family-overlap-map-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18.md"


DISCOVERY_SPECS = [
    {
        "discovery_id": "OD-01-health-time-support-career-loop",
        "families": [
            "SF-01-health-time-choice-bundle",
            "SF-05-career-participation-value",
            "SF-08-support-retranslation",
        ],
        "candidate_discovery": "就労継続の中核には、健康時間を守ること、支援が条件を翻訳し直すこと、遂行が役割・処遇・将来見通しへ価値化されることの三者ループがある可能性。",
        "why_it_matters": "支援は継続を助けるだけではなく、健康時間と仕事価値の間をつなぐ翻訳機能として現れる。",
        "counter_reading": "支援があるから良い、働いているから解決済み、とは読まない。健康時間と価値翻訳の残余を見る。",
    },
    {
        "discovery_id": "OD-02-health-time-career-evaluation-stack",
        "families": [
            "SF-01-health-time-choice-bundle",
            "SF-05-career-participation-value",
            "SF-06-evaluation-translation-rule",
        ],
        "candidate_discovery": "現在就労中の多くで、健康時間、仕事価値、評価規則が重なる。働けていることより、条件付き遂行が評価・処遇・将来見通しへどう変換されるかが構造の焦点になる可能性。",
        "why_it_matters": "就労継続の質を、配慮項目ではなく評価翻訳の問題として読める。",
        "counter_reading": "評価の正否や処遇の妥当性判断には進まない。評価規則に何が見えにくいかだけを読む。",
    },
    {
        "discovery_id": "OD-03-information-support-health-time-bridge",
        "families": [
            "SF-01-health-time-choice-bundle",
            "SF-04-information-synchronization",
            "SF-08-support-retranslation",
        ],
        "candidate_discovery": "情報同期は、業務指示だけでなく、健康時間と支援再翻訳をつなぐ橋として現れる可能性。情報が届く範囲が、体調管理、相談、非公式情報、評価、再入口を変える。",
        "why_it_matters": "情報保障を形式問題から、仕事参加と健康時間の同期問題へ引き上げられる。",
        "counter_reading": "情報共有量を増やせばよい、または本人説明能力の問題として読まない。",
    },
    {
        "discovery_id": "OD-04-entry-prework-support-sequence",
        "families": [
            "SF-02-entry-sequence-constraint",
            "SF-03-prework-participation-translation",
            "SF-08-support-retranslation",
        ],
        "candidate_discovery": "未就労・求職・訓練局面では、入口以前参加、入口順序、支援再翻訳が束になる。就職活動前に、生活・訓練・説明・支援接続を求人条件へ翻訳する前段構造がある可能性。",
        "why_it_matters": "就職活動支援を、応募支援ではなく入口前の自由度設計として読める。",
        "counter_reading": "本人準備不足、非就労志向、求人不足だけに戻さない。",
    },
    {
        "discovery_id": "OD-05-worksite-contact-health-support-design",
        "families": [
            "SF-01-health-time-choice-bundle",
            "SF-07-worksite-contact-design",
            "SF-08-support-retranslation",
        ],
        "candidate_discovery": "仕事接触点は、健康時間と支援再翻訳に強く接続する。設備や配慮項目ではなく、作業・移動・休憩・安全・プライバシー・代替作業が健康時間を開閉する可能性。",
        "why_it_matters": "配慮を一覧表でなく、職務との接触面の再設計として扱える。",
        "counter_reading": "障害種類別対応表や設備リストに落とさない。",
    },
    {
        "discovery_id": "OD-06-life-security-health-support-sequence",
        "families": [
            "SF-01-health-time-choice-bundle",
            "SF-08-support-retranslation",
            "SF-10-life-security-sequencing",
        ],
        "candidate_discovery": "生活保障は背景事情ではなく、健康時間と支援利用の順序を変える。待てる時間、休める条件、選べる求人、支援につながる余裕が一体で動く可能性。",
        "why_it_matters": "生活保障を、就労意欲ではなく選択自由度の制約として読める。",
        "counter_reading": "困窮や働く意思の問題に還元しない。",
    },
    {
        "discovery_id": "OD-07-information-worksite-translation-knot",
        "families": [
            "SF-04-information-synchronization",
            "SF-07-worksite-contact-design",
            "SF-08-support-retranslation",
        ],
        "candidate_discovery": "情報同期、仕事接触点、支援再翻訳が重なる場所では、支援者が何を翻訳するかが、実際の作業手順・安全確認・相談場面へ届くかで参加自由度が変わる可能性。",
        "why_it_matters": "情報保障、職場環境、支援を別々に扱わず、仕事参加の翻訳結節点として扱える。",
        "counter_reading": "情報形式、設備、支援利用の三つへ分解しすぎない。",
    },
]


def load_overlap() -> dict[str, Any]:
    return json.loads(OVERLAP_JSON.read_text(encoding="utf-8"))


def find_overlap(overlap: dict[str, Any], families: list[str]) -> dict[str, Any] | None:
    target = sorted(families)
    for row in overlap["triple_overlaps"]:
        if sorted(row["family_ids"]) == target:
            return row
    for row in overlap["pair_overlaps"]:
        if sorted(row["family_ids"]) == target:
            return row
    return None


def build_payload() -> dict[str, Any]:
    overlap = load_overlap()
    discoveries = []
    for spec in DISCOVERY_SPECS:
        row = find_overlap(overlap, spec["families"])
        discoveries.append(
            {
                **spec,
                "record_count": row["record_count"] if row else 0,
                "source_counts": row["source_counts"] if row else {},
                "status_counts": row["status_counts"] if row else {},
                "condition_counts": row["condition_counts"] if row else {},
                "state_counts": row["state_counts"] if row else {},
                "example_ids": row["example_ids"] if row else [],
            }
        )
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "source_artifacts": [str(OVERLAP_JSON.relative_to(ROOT))],
        "purpose": "structural family overlapを、次のLLM文脈読解とFounder/Proレビューに使える発見候補へ圧縮する未レビュー成果物。",
        "discovery_count": len(discoveries),
        "discoveries": discoveries,
    }


def ids_text(values: list[str], limit: int = 8) -> str:
    return ", ".join(f"`{value}`" for value in values[:limit])


def counts_text(values: dict[str, int], limit: int = 4) -> str:
    return ", ".join(f"{key}:{value}" for key, value in list(values.items())[:limit])


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Overlap Discovery Candidates",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "structural family overlap mapから、次に深く読むべき発見候補を圧縮した。ここでの発見候補は知識昇格ではなく、SCIMA/FCHMAの構造読解が従来要約より高い解像度を出し始めているかを検査するための作業仮説である。",
        "",
        "## Discovery Candidates",
        "",
    ]
    for item in payload["discoveries"]:
        lines.extend(
            [
                f"### {item['discovery_id']}",
                "",
                f"- families: {', '.join(f'`{family}`' for family in item['families'])}",
                f"- records: {item['record_count']}",
                f"- 候補発見: {item['candidate_discovery']}",
                f"- 重要性: {item['why_it_matters']}",
                f"- 反対読み: {item['counter_reading']}",
                f"- status: {counts_text(item['status_counts'])}",
                f"- conditions: {counts_text(item['condition_counts'])}",
                f"- states: {counts_text(item['state_counts'])}",
                f"- examples: {ids_text(item['example_ids'])}",
                "",
            ]
        )
    lines.extend(
        [
            "## Next Use",
            "",
            "- この7候補を次のLLM文脈読解の優先束にする。",
            "- 各候補で、代表、境界、開いた側、閉じた側、少数条件窓を最低数確保して読む。",
            "- 件数が大きくても、疾病・障害種類を最終分類にしない。",
            "- 発見候補は未レビューのまま扱い、支援有効性・配慮妥当性・就労可否判断へ進まない。",
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
