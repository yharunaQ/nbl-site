#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from itertools import combinations
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RECORD_INDEX_JSON = RUN_DIR / "stage1-production-overlap-discovery-record-index-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-overlap-discovery-cooccurrence-map-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-overlap-discovery-cooccurrence-map-v0-2026-05-18.md"


META_READINGS = {
    (
        "OD-01-health-time-support-career-loop",
        "OD-02-health-time-career-evaluation-stack",
        "OD-03-information-support-health-time-bridge",
    ): {
        "meta_id": "OM-01-continuity-quality-engine",
        "name": "就労継続の質を作る中核エンジン",
        "reading": "健康時間、評価翻訳、情報同期が重なる。働いているかどうかではなく、体調・情報・評価が循環して、仕事の価値として読まれるかが焦点になる。",
        "risk": "現在就労中の多数派に見えるため、解決済みや一般的継続課題として浅くまとめる危険がある。",
    },
    (
        "OD-01-health-time-support-career-loop",
        "OD-02-health-time-career-evaluation-stack",
        "OD-05-worksite-contact-health-support-design",
    ): {
        "meta_id": "OM-02-worksite-evaluation-contact-engine",
        "name": "仕事接触点が評価と健康時間を同時に変える構造",
        "reading": "作業場所、移動、休憩、手順、代替作業などの接触点が、健康時間を守るだけでなく、評価・役割・将来見通しへ影響する。",
        "risk": "配慮項目や設備リストに落とすと、評価翻訳との接続が消える。",
    },
    (
        "OD-01-health-time-support-career-loop",
        "OD-05-worksite-contact-health-support-design",
        "OD-06-life-security-health-support-sequence",
    ): {
        "meta_id": "OM-03-health-contact-life-security-sequence",
        "name": "健康時間・仕事接触点・生活保障の順序構造",
        "reading": "健康時間を守る仕事接触点の設計は、待てる時間、休める条件、求人を選べる余地と連動する。生活保障は背景ではなく順序を変える。",
        "risk": "生活事情を背景ノイズにすると、なぜ同じ配慮でも機能する場合としない場合があるかを読み落とす。",
    },
    (
        "OD-03-information-support-health-time-bridge",
        "OD-05-worksite-contact-health-support-design",
        "OD-07-information-worksite-translation-knot",
    ): {
        "meta_id": "OM-04-information-worksite-translation-knot",
        "name": "情報を仕事手順へ落とす翻訳結節",
        "reading": "情報同期、仕事接触点、支援再翻訳が結節する。情報が形式に留まらず、作業手順、安全確認、相談、評価へ届くかが自由度を決める。",
        "risk": "件数は中規模だが、少数条件窓の高解像度構造が多い。単独命題化より結節候補として扱う。",
    },
    (
        "OD-03-information-support-health-time-bridge",
        "OD-06-life-security-health-support-sequence",
        "OD-07-information-worksite-translation-knot",
    ): {
        "meta_id": "OM-05-sparse-information-life-security-knot",
        "name": "情報結節が生活保障順序へ伸びる少数構造",
        "reading": "情報同期や支援翻訳が、休めるか、待てるか、再入口へ進めるかという生活保障順序へ伸びる。件数は小さいが構造的価値が高い。",
        "risk": "件数だけで捨てると、少数窓に固有の自由度を落とす。単独候補ではなく上位構造の境界として保持する。",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def top_examples(records: list[dict[str, Any]], limit: int = 10) -> list[str]:
    picked: list[str] = []
    seen_source: set[str] = set()
    for record in records:
        if record["source"] in seen_source:
            continue
        picked.append(record["record_id"])
        seen_source.add(record["source"])
        if len(picked) >= limit:
            return picked
    for record in records:
        if record["record_id"] not in picked:
            picked.append(record["record_id"])
        if len(picked) >= limit:
            return picked
    return picked


def counts(values: list[str], limit: int = 5) -> dict[str, int]:
    return dict(Counter(values).most_common(limit))


def build_rows(records: list[dict[str, Any]], mode: str, size: int) -> list[dict[str, Any]]:
    field = "primary_od_ids" if mode == "primary" else "active_od_ids"
    grouped: dict[tuple[str, ...], list[dict[str, Any]]] = {}
    for record in records:
        ids = sorted(record["primary_od_ids"]) if mode == "primary" else sorted(set(record["primary_od_ids"]) | set(record["boundary_od_ids"]))
        if len(ids) < size:
            continue
        for combo in combinations(ids, size):
            grouped.setdefault(combo, []).append(record)

    rows = []
    for combo, combo_records in grouped.items():
        rows.append(
            {
                "od_ids": list(combo),
                "record_count": len(combo_records),
                "example_record_ids": top_examples(combo_records),
                "status_counts": counts([record["status_group"] for record in combo_records]),
                "condition_counts": counts([condition for record in combo_records for condition in record["condition_buckets"]]),
                "state_counts": counts([state for record in combo_records for state in record["state_readings"]]),
            }
        )
    return sorted(rows, key=lambda row: (-row["record_count"], row["od_ids"]))


def build_payload() -> dict[str, Any]:
    record_index = load_json(RECORD_INDEX_JSON)
    records = record_index["record_assignments"]
    primary_pairs = build_rows(records, "primary", 2)
    primary_triples = build_rows(records, "primary", 3)
    active_pairs = build_rows(records, "active", 2)

    meta_candidates = []
    triples_by_key = {tuple(row["od_ids"]): row for row in primary_triples}
    for key, reading in META_READINGS.items():
        row = triples_by_key.get(key, {"record_count": 0, "example_record_ids": [], "condition_counts": {}, "status_counts": {}, "state_counts": {}})
        meta_candidates.append({**reading, "od_ids": list(key), **row})

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-overlap-discovery-cooccurrence-map-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "overlap discovery同士の共起を見て、単独候補より深い循環・積層・結節を発見単位として扱うための未レビューmap。"
        ),
        "source_artifacts": [str(RECORD_INDEX_JSON.relative_to(ROOT))],
        "primary_pair_count": len(primary_pairs),
        "primary_triple_count": len(primary_triples),
        "active_pair_count": len(active_pairs),
        "meta_candidates": meta_candidates,
        "primary_pairs": primary_pairs,
        "primary_triples": primary_triples,
        "active_pairs": active_pairs,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values) if values else "-"


def counts_text(values: dict[str, int]) -> str:
    return ", ".join(f"{key}:{value}" for key, value in values.items()) if values else "-"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Overlap Discovery Cooccurrence Map",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "7つのoverlap discoveryをrecord側へ戻したうえで、発見候補どうしの共起を見た。ここでの焦点は分類ではなく、循環、積層、橋、結節がどこで同時に立つかである。",
        "",
        "## Meta Candidates",
        "",
        "| meta | records | reading | risk | examples |",
        "|---|---:|---|---|---|",
    ]
    for item in payload["meta_candidates"]:
        lines.append(
            f"| `{item['meta_id']}` {item['name']} | {item['record_count']} | {item['reading']} | {item['risk']} | {ids_text(item['example_record_ids'][:6])} |"
        )

    lines.extend(
        [
            "",
            "## Top Primary Pairs",
            "",
            "| OD pair | records | conditions | examples |",
            "|---|---:|---|---|",
        ]
    )
    for row in payload["primary_pairs"][:12]:
        lines.append(
            f"| {', '.join(f'`{od}`' for od in row['od_ids'])} | {row['record_count']} | {counts_text(row['condition_counts'])} | {ids_text(row['example_record_ids'][:6])} |"
        )

    lines.extend(
        [
            "",
            "## Top Primary Triples",
            "",
            "| OD triple | records | conditions | examples |",
            "|---|---:|---|---|",
        ]
    )
    for row in payload["primary_triples"][:12]:
        lines.append(
            f"| {', '.join(f'`{od}`' for od in row['od_ids'])} | {row['record_count']} | {counts_text(row['condition_counts'])} | {ids_text(row['example_record_ids'][:6])} |"
        )

    lines.extend(
        [
            "",
            "## Reading Gain",
            "",
            "- OD-01/OD-02/OD-03の1015件は、現在就労の量ではなく、健康時間・情報同期・評価翻訳が循環する継続品質の中心構造として読む。",
            "- OD-03/OD-05/OD-07の228件は、情報、職場環境、支援を分解せず、仕事手順へ落ちる翻訳結節として読む。",
            "- OD-03/OD-06/OD-07など56件規模の少数共起は、単独命題化せず、上位構造の境界・復活候補として保持する。",
            "- 件数が大きい共起ほど一般構造、小さい共起ほど少数条件窓の自由度を示す可能性がある。どちらも必要で、片方だけではSCIMA/FCHMAの解像度にならない。",
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
