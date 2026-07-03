#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
FOUR_PLACEMENT_JSON = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-polarity-stress-test-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-polarity-stress-test-v0-2026-05-18.md"

CONTACT_LABELS = {
    "C-01-health-time-work-design": "健康時間",
    "C-02-entry-translation": "入口相互翻訳",
    "C-03-support-access-role-fit": "支援接続・役割適合",
    "C-04-information-participation-quality": "情報参加",
    "C-05-physical-access-worksite": "仕事参加接触点",
    "C-06-life-security-work-choice": "生活保障",
    "C-07-career-evaluation-role": "参加品質",
    "C-08-prework-life-readiness": "入口以前参加",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def classify(row: dict[str, Any]) -> str:
    problem = row["problem_count"]
    mitigation = row["mitigation_count"]
    residual = row["residual_count"]
    boundary = row["boundary_count"]
    if problem >= 5 and mitigation >= 5:
        return "two_sided_problem_mitigation_visible"
    if problem >= 5 and mitigation > 0:
        return "problem_visible_mitigation_thin"
    if mitigation >= 5 and problem == 0:
        return "mitigation_visible_problem_not_direct"
    if residual >= 1000 and problem == 0 and mitigation == 0:
        return "residual_thick_polarity_hidden"
    if boundary >= 20 and problem == 0 and mitigation == 0 and residual < 100:
        return "boundary_only_small_direct_signal"
    if boundary <= 2 and residual >= 100:
        return "boundary_thin_residual_thick"
    return "mixed_or_low_polarity"


def interpretation_for_status(status: str) -> str:
    return {
        "two_sided_problem_mitigation_visible": "問題側と軽減側の両方が見える。自由度の有無で構造がどう変わるかを同型で読める候補。",
        "problem_visible_mitigation_thin": "問題側は見えるが軽減側が薄い。支援がない構造だけを問題化しないよう、軽減・境界例を追加探索する。",
        "mitigation_visible_problem_not_direct": "軽減側が見えるが問題側が直接見えない。支援有効性とは読まず、自由度が何を媒介しているかを読む。",
        "residual_thick_polarity_hidden": "残余が厚いが問題/軽減が直接薄い。調査構造上の盲点として、LLM文脈読解・relation edgeで分岐する。",
        "boundary_only_small_direct_signal": "境界例中心の小信号。周辺自由度との接点として保持し、単独命題化しない。",
        "boundary_thin_residual_thick": "残余が厚く境界が薄い。過剰一般化の危険が高いため、反対命題と境界探索を優先する。",
        "mixed_or_low_polarity": "四象限の読みが混合または薄い。別枝への吸収と復活可能性を同時に見る。",
    }[status]


def next_action_for_status(status: str) -> str:
    return {
        "two_sided_problem_mitigation_visible": "問題側・軽減側・残余側を同じ構造の状態差として対比する。",
        "problem_visible_mitigation_thin": "軽減側の同型例を支援接続・断片資料側から補う。",
        "mitigation_visible_problem_not_direct": "軽減の有効性ではなく、何の翻訳・接続・媒介かを抽出する。",
        "residual_thick_polarity_hidden": "深読解または構造穴攻撃で自由度を細分化する。",
        "boundary_only_small_direct_signal": "relation edgeへ接続し、単独昇格を避ける。",
        "boundary_thin_residual_thick": "境界例と反対命題を先に補い、候補命題の射程を絞る。",
        "mixed_or_low_polarity": "隣接軸への吸収、または小自由度としての復活を検査する。",
    }[status]


def build() -> dict[str, Any]:
    placements = load_json(FOUR_PLACEMENT_JSON)["four_placement_candidates"]
    relations = load_json(RELATION_JSON)["relations"]
    rows = []
    by_contact: dict[str, Counter[str]] = defaultdict(Counter)
    for row in placements:
        status = classify(row)
        by_contact[row["contact_id"]][status] += 1
        rows.append(
            {
                "contact_id": row["contact_id"],
                "contact_label": CONTACT_LABELS.get(row["contact_id"], row["contact_id"]),
                "freedom": row["freedom"],
                "readiness": row["readiness"],
                "problem_count": row["problem_count"],
                "mitigation_count": row["mitigation_count"],
                "residual_count": row["residual_count"],
                "boundary_count": row["boundary_count"],
                "polarity_status": status,
                "interpretation": interpretation_for_status(status),
                "next_analysis": next_action_for_status(status),
                "problem_ids": row.get("problem_ids", [])[:8],
                "mitigation_ids": row.get("mitigation_ids", [])[:8],
                "residual_ids": row.get("residual_ids", [])[:8],
                "boundary_ids": row.get("boundary_ids", [])[:8],
            }
        )

    contact_summary = []
    for contact_id, counter in by_contact.items():
        contact_rows = [row for row in rows if row["contact_id"] == contact_id]
        residual_total = sum(row["residual_count"] for row in contact_rows)
        mitigation_total = sum(row["mitigation_count"] for row in contact_rows)
        problem_total = sum(row["problem_count"] for row in contact_rows)
        contact_summary.append(
            {
                "contact_id": contact_id,
                "label": CONTACT_LABELS.get(contact_id, contact_id),
                "freedom_count": len(contact_rows),
                "polarity_status_counts": dict(counter.most_common()),
                "problem_total": problem_total,
                "mitigation_total": mitigation_total,
                "residual_total": residual_total,
                "reading": contact_reading(contact_id, counter, problem_total, mitigation_total, residual_total),
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "問題中心読みを避け、同じ構造が問題・軽減・残余・境界として現れるかを検査する。",
        "stress_result": "全体として残余側が厚く、問題/軽減側は調査設計上かなり薄い。したがって、単純な問題件数や支援有無ではなく、relation edgeと構造穴攻撃で自由度を復活させる必要がある。",
        "contact_summary": contact_summary,
        "polarity_rows": rows,
        "relation_count": len(relations),
        "relation_ids": [relation["relation_id"] for relation in relations],
    }


def contact_reading(contact_id: str, counter: Counter[str], problem_total: int, mitigation_total: int, residual_total: int) -> str:
    if contact_id == "C-02-entry-translation":
        return "C02は問題側も軽減側も少数見えるが中心は残余。開示範囲を正解選択にせず、相互翻訳の境界設計として読む。"
    if contact_id == "C-03-support-access-role-fit":
        return "C03は軽減側が相対的に見えるが問題側が直接薄い。支援が有効という結論ではなく、支援が何を再翻訳するかを読む。"
    if contact_id == "C-04-information-participation-quality":
        return "C04は直接問題側が薄く、境界・残余に隠れる。情報参加を周辺論点とせず、仕事参加同期の自由度として復活させる。"
    if contact_id == "C-05-physical-access-worksite":
        return "C05は残余が厚く問題/軽減側が薄い。設備の有無ではなく、仕事参加接触点として細分化する。"
    if contact_id == "C-07-career-evaluation-role":
        return "C07は小信号だが境界に集中する。評価・役割・処遇を、就労継続後の参加品質として保持する。"
    if contact_id == "C-08-prework-life-readiness":
        return "C08は問題側ではなく入口以前の残余・境界に出る。準備不足でなく、入口へ接続する前段自由度として読む。"
    if mitigation_total == 0 and problem_total <= len(counter):
        return "問題/軽減の直接信号が薄い。残余と境界を構造自由度として再分岐する。"
    return "四象限の偏りを使って、問題化、軽減、残余、境界を同じ構造の状態差として読む。"


def fmt_counter(counter: dict[str, int]) -> str:
    if not counter:
        return "なし"
    return ", ".join(f"{key}:{value}" for key, value in counter.items())


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Polarity Stress Test",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "同じ構造が、問題、軽減、残余、境界のどの状態で現れているかを検査した。支援の有無や問題件数で構造を決めないためのストレステストである。",
        "",
        "## 結果",
        "",
        data["stress_result"],
        "",
        "## Contact Summary",
        "",
        "| contact | freedoms | problem | mitigation | residual | polarity | reading |",
        "|---|---:|---:|---:|---:|---|---|",
    ]
    for item in data["contact_summary"]:
        lines.append(
            f"| `{item['contact_id']}` {item['label']} | {item['freedom_count']} | {item['problem_total']} | "
            f"{item['mitigation_total']} | {item['residual_total']} | {fmt_counter(item['polarity_status_counts'])} | {item['reading']} |"
        )

    lines.extend(["", "## Freedom Rows", "", "| contact | freedom | p/m/r/b | polarity | next analysis |", "|---|---|---:|---|---|"])
    for row in data["polarity_rows"]:
        lines.append(
            f"| `{row['contact_id']}` | {row['freedom']} | {row['problem_count']}/{row['mitigation_count']}/{row['residual_count']}/{row['boundary_count']} | "
            f"{row['polarity_status']} | {row['next_analysis']} |"
        )

    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    data = build()
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
