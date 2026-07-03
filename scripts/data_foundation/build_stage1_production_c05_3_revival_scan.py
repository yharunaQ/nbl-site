#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
SUBBRANCH_JSON = RUN_DIR / "stage1-production-subbranch-split-candidates-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c05-3-revival-scan-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c05-3-revival-scan-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]


def load_records() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    records: dict[str, dict[str, Any]] = defaultdict(lambda: {"branches": set(), "dominant": set(), "secondary": set(), "source": ""})

    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    for item in assignments:
        record = records[item["record_id"]]
        record["branches"].update(item["candidate_branches"])
        record["source"] = item["source"]

    subbranch_links = json.loads(SUBBRANCH_JSON.read_text(encoding="utf-8"))["record_links"]
    for item in subbranch_links:
        record = records[item["record_id"]]
        record["branches"].add(item["branch_id"])
        record["dominant"].update(item["dominant_subbranch_candidates"])
        record["secondary"].update(item["secondary_subbranch_candidates"])
        record["source"] = item["source"]

    case_rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                case_rows[row["record_id"]] = row
    return dict(records), case_rows


def record_set(records: dict[str, dict[str, Any]], predicate) -> set[str]:
    return {record_id for record_id, record in records.items() if predicate(record)}


def top(counter: Counter[Any], limit: int = 10) -> list[tuple[Any, int]]:
    return counter.most_common(limit)


def main() -> None:
    records, case_rows = load_records()
    c05_3 = record_set(records, lambda r: "C05-3-worksite-facility" in r["dominant"])
    c05_4 = record_set(records, lambda r: "C05-4-rest-fatigue-boundary" in r["dominant"])
    c05_5 = record_set(records, lambda r: "C05-5-information-access-boundary" in r["dominant"] or "C05-5-information-access-boundary" in r["secondary"])
    c05_12 = record_set(records, lambda r: "C05-1-commuting-route" in r["dominant"] or "C05-2-posture-operation" in r["dominant"])
    c04a = record_set(records, lambda r: any(branch.startswith("P1-C04A") for branch in r["branches"]))

    pure_candidates = c05_3 - c05_4 - c05_5 - c05_12 - c04a
    status_counts = Counter(case_rows[rid].get("status_group", "unknown") for rid in pure_candidates)
    pattern_counts = Counter(case_rows[rid].get("pattern_cell_id", "unknown") for rid in pure_candidates)
    impairment_counts: Counter[str] = Counter()
    branch_combo_counts: Counter[tuple[str, ...]] = Counter()
    for rid in pure_candidates:
        row = case_rows[rid]
        impairment_counts.update(row.get("impairment_signals", [])[:8])
        branch_combo_counts[tuple(sorted(records[rid]["branches"]))] += 1

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "scan_target": "C05-3-worksite-facility",
        "counts": {
            "c05_3_dominant": len(c05_3),
            "after_excluding_health_time_c05_4": len(c05_3 - c05_4),
            "after_excluding_information_c05_5": len(c05_3 - c05_5),
            "after_excluding_mobility_c05_1_2": len(c05_3 - c05_12),
            "after_excluding_health_information_mobility_c04a": len(pure_candidates),
        },
        "source_counts": dict(Counter(records[rid]["source"] for rid in pure_candidates)),
        "status_group_counts": dict(status_counts),
        "pattern_cell_counts": dict(top(pattern_counts, 12)),
        "impairment_signal_counts": dict(top(impairment_counts, 12)),
        "branch_combo_counts": [
            {"branches": list(branches), "count": count}
            for branches, count in top(branch_combo_counts, 12)
        ],
        "representative_ids": sorted(pure_candidates)[:16],
        "boundary_ids": sorted((c05_3 & (c05_4 | c05_5 | c05_12 | c04a)))[:16],
        "interpretation": (
            "C05-3は単独候補から完全に降ろすのではなく、C05-3-pure同型探索として復活させる。"
            "ただし現段階では設備・作業場所の有効性や充足を判断せず、仕事参加・課題遂行・職場理解・入口翻訳との接点として読む。"
        ),
        "next_use": "C05-3-pureはレビュー候補命題ではなく、次のLLM文脈読解対象。代表・境界・軽減/残余配置を作ってから候補命題化を判断する。",
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C05-3 Revival Scan",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "`RU-C05-3` を単独候補から降ろした判断が強すぎないかを確認するため、情報参加、健康時間、移動・姿勢、C04A境界を除いた同型候補を再探索した。",
        "",
        "## Counts",
        "",
        "| step | records |",
        "|---|---:|",
    ]
    for key, value in payload["counts"].items():
        lines.append(f"| `{key}` | {value} |")
    lines.extend([
        "",
        f"source: {', '.join(f'{key}: {value}' for key, value in payload['source_counts'].items()) or 'なし'}",
        "",
        "## Interpretation",
        "",
        payload["interpretation"],
        "",
        "以前の「C05-3本体はほぼ残らない」という読みは、境界を厳しく取りすぎていた。セット差分で見ると、`C05-3-pure` 候補は730件残る。ただし、これは設備・作業場所の単独有効性を示すものではなく、仕事参加・課題遂行・職場理解・入口翻訳との接点として読むべき候補である。",
        "",
        "## Representative / Boundary IDs",
        "",
        f"代表ID: {', '.join(f'`{rid}`' for rid in payload['representative_ids'])}",
        "",
        f"境界ID: {', '.join(f'`{rid}`' for rid in payload['boundary_ids'])}",
        "",
        "## Distribution",
        "",
        "| status_group | count |",
        "|---|---:|",
    ])
    for key, value in payload["status_group_counts"].items():
        lines.append(f"| `{key}` | {value} |")
    lines.extend(["", "| pattern_cell | count |", "|---|---:|"])
    for key, value in payload["pattern_cell_counts"].items():
        lines.append(f"| `{key}` | {value} |")
    lines.extend(["", "| impairment_signal | count |", "|---|---:|"])
    for key, value in payload["impairment_signal_counts"].items():
        lines.append(f"| `{key}` | {value} |")
    lines.extend([
        "",
        "## Revised Handling",
        "",
        "- `RU-C05-3` は設備一般として即候補命題化しない。",
        "- ただし `C05-3-pure` は探索枝として十分な規模があるため、単独候補保留から同型探索対象へ引き上げる。",
        "- 次は代表ID・境界IDをLLMで読み、作業場所・設備が主自由度なのか、C01/C02/C03の実装面なのかを分ける。",
        "- 設備の有無、支援の有効性、合理的配慮の充足、職場の正否は判断しない。",
    ])
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
