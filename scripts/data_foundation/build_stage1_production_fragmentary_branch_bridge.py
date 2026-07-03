#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
SLOTS_JSON = RUN_DIR / "stage1-production-fragmentary-source-slots-v0-2026-05-18.json"
FOUR_JSON = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
BRANCH_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.md"


CONTACT_TO_BRANCHES = {
    "C-01-health-time-work-design": {
        "candidate_branches": ["P1-C01A", "P1-C01B", "P1-C01C"],
        "boundary_tags": ["P1-C01D", "P1-C05C", "P1-C06D"],
    },
    "C-02-entry-translation": {
        "candidate_branches": ["P1-C02A", "P1-C02B"],
        "boundary_tags": ["P1-C02C", "P1-C02D"],
    },
    "C-03-support-access-role-fit": {
        "candidate_branches": ["P1-C03A", "P1-C03B", "P1-C03C"],
        "boundary_tags": ["P1-C03D", "P1-C02C", "P1-C06C"],
    },
    "C-04-information-participation-quality": {
        "candidate_branches": ["P1-C04A-1", "P1-C04A-2", "P1-C04A-3"],
        "boundary_tags": ["P1-C04B", "P1-C05E"],
    },
    "C-05-physical-access-worksite": {
        "candidate_branches": ["P1-C05A", "P1-C05B", "P1-C05D"],
        "boundary_tags": ["P1-C01D", "P1-C05C", "P1-C05E"],
    },
    "C-06-life-security-work-choice": {
        "candidate_branches": [],
        "boundary_tags": ["P1-C06A", "P1-C06B", "P1-C06C", "P1-C06D", "P1-C06E"],
    },
    "C-07-career-evaluation-role": {
        "candidate_branches": [],
        "boundary_tags": ["P1-C04B", "P1-C06E"],
    },
    "C-08-prework-life-readiness": {
        "candidate_branches": [],
        "boundary_tags": ["P1-C02B", "P1-C03B", "P1-C06B"],
    },
}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def uniq(items: list[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            output.append(item)
    return output


def main() -> None:
    slots = read_json(SLOTS_JSON)["fragmentary_source_slots"]
    four = read_json(FOUR_JSON)["four_placement_candidates"]
    branches = read_json(BRANCH_JSON)["branch_summaries"]
    branch_known = {item["branch_id"] for item in branches}

    fragment_links: list[dict[str, Any]] = []
    branch_source_counts: dict[str, Counter[str]] = defaultdict(Counter)
    branch_source_examples: dict[str, list[str]] = defaultdict(list)
    contact_source_counts: dict[str, Counter[str]] = defaultdict(Counter)

    for source in slots:
        candidate_branches: list[str] = []
        boundary_tags: list[str] = []
        matched_contacts: list[dict[str, Any]] = []
        for contact in source["matched_contacts"]:
            contact_id = contact["contact_id"]
            mapping = CONTACT_TO_BRANCHES.get(contact_id)
            if not mapping:
                continue
            matched_contacts.append(contact)
            candidate_branches.extend(mapping["candidate_branches"])
            boundary_tags.extend(mapping["boundary_tags"])
            contact_source_counts[contact_id][source["source_family"]] += 1

        candidate_branches = [item for item in uniq(candidate_branches) if item in branch_known]
        boundary_tags = [item for item in uniq(boundary_tags) if item in branch_known]
        if not candidate_branches and not boundary_tags:
            continue

        source_id = source["source_id"]
        for branch_id in candidate_branches + boundary_tags:
            branch_source_counts[branch_id][source["source_family"]] += 1
            if len(branch_source_examples[branch_id]) < 10:
                branch_source_examples[branch_id].append(source_id)

        fragment_links.append(
            {
                "source_id": source_id,
                "source_family": source["source_family"],
                "status": "fragmentary_source_branch_search_target_not_case_placement",
                "matched_contacts": matched_contacts[:5],
                "candidate_branch_search_targets": candidate_branches,
                "boundary_tag_search_targets": boundary_tags,
                "slot_use": source["slot_use"],
                "raw_or_redacted_text_included": False,
            }
        )

    freedom_counts: dict[str, Counter[str]] = defaultdict(Counter)
    freedom_examples: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for candidate in four:
        contact_id = candidate["contact_id"]
        mapping = CONTACT_TO_BRANCHES.get(contact_id)
        if not mapping:
            continue
        target_branches = [
            item
            for item in mapping["candidate_branches"] + mapping["boundary_tags"]
            if item in branch_known
        ]
        for branch_id in target_branches:
            freedom_counts[branch_id][candidate["freedom"]] += 1
            if len(freedom_examples[branch_id]) < 8:
                freedom_examples[branch_id].append(
                    {
                        "contact_id": contact_id,
                        "freedom": candidate["freedom"],
                        "readiness": candidate["readiness"],
                        "problem_count": candidate["problem_count"],
                        "mitigation_count": candidate["mitigation_count"],
                        "residual_count": candidate["residual_count"],
                        "boundary_count": candidate["boundary_count"],
                        "problem_ids": candidate["problem_ids"][:5],
                        "mitigation_ids": candidate["mitigation_ids"][:5],
                        "residual_ids": candidate["residual_ids"][:5],
                        "boundary_ids": candidate["boundary_ids"][:5],
                    }
                )

    branch_bridge = []
    for branch in branches:
        branch_id = branch["branch_id"]
        branch_bridge.append(
            {
                "branch_id": branch_id,
                "label": branch["label"],
                "kind": branch["kind"],
                "survey_assignment_count": branch["count"],
                "fragmentary_source_counts": dict(branch_source_counts[branch_id]),
                "fragmentary_source_examples": branch_source_examples[branch_id],
                "freedom_candidates": freedom_counts[branch_id].most_common(),
                "four_placement_examples": freedom_examples[branch_id],
            }
        )

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "interpretation": "Fragmentary sources are connected as search targets and missing-axis/counter-structure aids, not as cases and not as support validity evidence.",
        "fragmentary_source_link_count": len(fragment_links),
        "source_family_counts": dict(sorted(Counter(item["source_family"] for item in fragment_links).items())),
        "branch_bridge": branch_bridge,
        "fragmentary_source_links": fragment_links,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production Fragmentary Source Branch Bridge",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "この出力は、workshop、NIVR、web-cacheをケース数として足すのではなく、調査データから作った枝の自由度・欠落軸・反対構造・探索条件へ接続するための本番ブリッジである。",
        "",
        f"断片資料リンク数: {len(fragment_links)}",
        "",
        "## Source Families",
        "",
        "| family | linked sources |",
        "|---|---:|",
    ]
    for family, count in sorted(Counter(item["source_family"] for item in fragment_links).items()):
        lines.append(f"| {family} | {count} |")

    lines.extend(["", "## Branch Bridge", "", "| branch | survey cases | fragmentary sources | freedoms | examples |", "|---|---:|---:|---|---|"])
    for item in branch_bridge:
        source_total = sum(item["fragmentary_source_counts"].values())
        freedoms = ", ".join(name for name, _ in item["freedom_candidates"][:5]) or "なし"
        examples = ", ".join(f"`{source_id}`" for source_id in item["fragmentary_source_examples"][:3]) or "なし"
        lines.append(
            f"| `{item['branch_id']}` {item['label']} | {item['survey_assignment_count']} | {source_total} | {freedoms} | {examples} |"
        )

    lines.extend(
        [
            "",
            "## Reading Use",
            "",
            "- 断片資料は、人間レビュー済み知識でも、支援の妥当性根拠でもない。",
            "- survey case assignment は、同型ケース候補を探す土台として使う。",
            "- fragmentary source link は、LLM文脈読解で見る自由度、足りない軸、反対構造、探索条件を増やすために使う。",
            "- 枝の候補命題化は、最低ケース数、軽減側または対照側、境界例がそろった場合に限る。",
        ]
    )
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
