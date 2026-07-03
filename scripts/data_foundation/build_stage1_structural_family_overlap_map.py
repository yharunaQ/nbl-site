#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from itertools import combinations
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGNMENT_JSON = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.json"
REVIEW_CARDS_JSON = RUN_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-family-overlap-map-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-family-overlap-map-v0-2026-05-18.md"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def pick_balanced(records: list[dict[str, Any]], count: int) -> list[str]:
    picked: list[str] = []
    seen: set[str] = set()
    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        condition = record["condition_buckets"][0] if record["condition_buckets"] else "条件窓なし"
        groups[(record["source"], record["status_group"], condition)].append(record)
    for key in sorted(groups, key=lambda item: (-len(groups[item]), item)):
        for record in groups[key]:
            record_id = record["record_id"]
            if record_id not in seen:
                picked.append(record_id)
                seen.add(record_id)
                break
        if len(picked) >= count:
            return picked
    for record in records:
        record_id = record["record_id"]
        if record_id not in seen:
            picked.append(record_id)
            seen.add(record_id)
        if len(picked) >= count:
            return picked
    return picked


def top_counts(records: list[dict[str, Any]], key: str, limit: int = 8) -> dict[str, int]:
    counter: Counter[str] = Counter()
    for record in records:
        values = record.get(key, [])
        if isinstance(values, list):
            counter.update(values)
        elif values:
            counter[values] += 1
    return dict(counter.most_common(limit))


def summarize_overlap(
    combo: tuple[str, ...],
    records: list[dict[str, Any]],
    titles: dict[str, str],
) -> dict[str, Any]:
    return {
        "family_ids": list(combo),
        "title": " + ".join(titles[item] for item in combo),
        "record_count": len(records),
        "source_counts": dict(Counter(record["source"] for record in records)),
        "status_counts": dict(Counter(record["status_group"] for record in records).most_common(8)),
        "condition_counts": top_counts(records, "condition_buckets", 8),
        "state_counts": top_counts(records, "state_readings", 8),
        "example_ids": pick_balanced(records, 10),
    }


def build_payload() -> dict[str, Any]:
    assignments = load_json(ASSIGNMENT_JSON)["records"]
    review_cards = load_json(REVIEW_CARDS_JSON)["cards"]
    titles = {card["family_id"]: card["title"] for card in review_cards}

    pair_groups: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    triple_groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for record in assignments:
        families = sorted(set(record["primary_family_ids"]))
        for combo in combinations(families, 2):
            pair_groups[combo].append(record)
        for combo in combinations(families, 3):
            triple_groups[combo].append(record)

    pair_rows = [
        summarize_overlap(combo, records, titles)
        for combo, records in pair_groups.items()
        if len(records) >= 30
    ]
    triple_rows = [
        summarize_overlap(combo, records, titles)
        for combo, records in triple_groups.items()
        if len(records) >= 30
    ]
    pair_rows.sort(key=lambda item: (-item["record_count"], item["family_ids"]))
    triple_rows.sort(key=lambda item: (-item["record_count"], item["family_ids"]))

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-family-overlap-map-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "source_artifacts": [
            str(ASSIGNMENT_JSON.relative_to(ROOT)),
            str(REVIEW_CARDS_JSON.relative_to(ROOT)),
        ],
        "purpose": "recordを単一分類せず、複数structural familyが重なる場所を発見対象として扱うための未レビューoverlap map。",
        "record_count": len(assignments),
        "multi_primary_record_count": sum(1 for record in assignments if len(record["primary_family_ids"]) >= 2),
        "pair_overlap_count": len(pair_rows),
        "triple_overlap_count": len(triple_rows),
        "pair_overlaps": pair_rows,
        "triple_overlaps": triple_rows,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values)


def counts_text(values: dict[str, int], limit: int = 4) -> str:
    return ", ".join(f"{key}:{value}" for key, value in list(values.items())[:limit])


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Family Overlap Map",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "recordを一つの分類に閉じ込めず、複数structural familyが重なる場所を発見対象として扱うためのoverlap map。重なりはノイズではなく、SCIMA/FCHMAが見るべき構造束である。",
        "",
        f"record数: {payload['record_count']}",
        f"複数主family record数: {payload['multi_primary_record_count']}",
        f"pair overlap数: {payload['pair_overlap_count']}",
        f"triple overlap数: {payload['triple_overlap_count']}",
        "",
        "## Pair Overlaps",
        "",
        "| families | records | status | conditions | states | examples |",
        "|---|---:|---|---|---|---|",
    ]
    for row in payload["pair_overlaps"][:25]:
        lines.append(
            "| "
            f"{' + '.join(f'`{item}`' for item in row['family_ids'])} | "
            f"{row['record_count']} | "
            f"{counts_text(row['status_counts'])} | "
            f"{counts_text(row['condition_counts'])} | "
            f"{counts_text(row['state_counts'])} | "
            f"{ids_text(row['example_ids'][:8])} |"
        )

    lines.extend(
        [
            "",
            "## Triple Overlaps",
            "",
            "| families | records | status | conditions | states | examples |",
            "|---|---:|---|---|---|---|",
        ]
    )
    for row in payload["triple_overlaps"][:20]:
        lines.append(
            "| "
            f"{' + '.join(f'`{item}`' for item in row['family_ids'])} | "
            f"{row['record_count']} | "
            f"{counts_text(row['status_counts'])} | "
            f"{counts_text(row['condition_counts'])} | "
            f"{counts_text(row['state_counts'])} | "
            f"{ids_text(row['example_ids'][:8])} |"
        )

    lines.extend(
        [
            "",
            "## Interpretation Rules",
            "",
            "- overlapは混乱ではなく、構造自由度の束として読む。",
            "- 件数が大きいoverlapは共通構造候補、少数条件が濃いoverlapは多様性形状候補として扱う。",
            "- pair/tripleを知識昇格しない。次の本文読解・反対読み・境界戻しの優先順位として使う。",
            "- sourceやstatusに偏ったoverlapは、その偏り自体を候補構造として読む。",
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
