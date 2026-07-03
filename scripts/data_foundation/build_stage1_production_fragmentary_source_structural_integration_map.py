#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from itertools import combinations
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
SLOTS_JSON = RUN_DIR / "stage1-production-fragmentary-source-slots-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
WORKING_MAP_JSON = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.md"


CONTACT_TO_AXIS = {
    "C-01-health-time-work-design": "C01-health-time",
    "C-02-entry-translation": "C02-entry-translation",
    "C-03-support-access-role-fit": "C03-support-continuity",
    "C-04-information-participation-quality": "C04-information-participation",
    "C-05-physical-access-worksite": "C05-worksite-contact",
    "C-06-life-security-work-choice": "C06-life-security",
    "C-07-career-evaluation-role": "C07-quality-participation",
    "C-08-prework-life-readiness": "C08-prework-participation",
}


AXIS_ORDER = [
    "C01-health-time",
    "C02-entry-translation",
    "C03-support-continuity",
    "C04-information-participation",
    "C05-worksite-contact",
    "C06-life-security",
    "C07-quality-participation",
    "C08-prework-participation",
]


BRANCH_TO_AXIS_PREFIX = {
    "P1-C01": "C01-health-time",
    "P1-C02": "C02-entry-translation",
    "P1-C03": "C03-support-continuity",
    "P1-C04": "C04-information-participation",
    "P1-C05": "C05-worksite-contact",
    "P1-C06": "C06-life-security",
    "P1-C07": "C07-quality-participation",
    "P1-C08": "C08-prework-participation",
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


def branch_axis(branch_id: str) -> str | None:
    for prefix, axis_id in BRANCH_TO_AXIS_PREFIX.items():
        if branch_id.startswith(prefix):
            return axis_id
    return None


def axis_labels(working_map: dict[str, Any]) -> dict[str, str]:
    return {item["axis_id"]: item["label"] for item in working_map["axis_summaries"]}


def matched_axes_for_source(source: dict[str, Any]) -> list[dict[str, Any]]:
    by_axis: dict[str, dict[str, Any]] = {}
    for contact in source.get("matched_contacts", []):
        axis_id = CONTACT_TO_AXIS.get(contact["contact_id"])
        if not axis_id:
            continue
        existing = by_axis.get(axis_id)
        if existing is None or contact["score"] > existing["score"]:
            by_axis[axis_id] = {
                "axis_id": axis_id,
                "contact_id": contact["contact_id"],
                "score": contact["score"],
                "core_hits": contact["core_hits"],
                "unique_hits": contact["unique_hits"],
            }
    ranked = sorted(by_axis.values(), key=lambda item: (-item["score"], AXIS_ORDER.index(item["axis_id"])))
    for index, item in enumerate(ranked, start=1):
        item["rank"] = index
    return ranked


def integration_status(source: dict[str, Any], axes: list[dict[str, Any]]) -> str:
    top_score = axes[0]["score"] if axes else 0
    has_branch = bool(source.get("candidate_branch_search_targets"))
    has_boundary = bool(source.get("boundary_tag_search_targets"))
    if len(axes) >= 3 and has_branch and has_boundary:
        return "multi_axis_fragmentary_structure_target"
    if len(axes) >= 2 and top_score >= 30:
        return "two_axis_fragmentary_structure_target"
    if len(axes) == 1 and top_score >= 20:
        return "single_axis_fragmentary_structure_target"
    return "weak_fragmentary_source_hold"


def integration_uses(source: dict[str, Any], axes: list[dict[str, Any]]) -> list[str]:
    uses: list[str] = []
    slot_use = source.get("slot_use", {})
    if len(axes) >= 2:
        uses.append("same_structure_multi_axis_reading")
    if source.get("candidate_branch_search_targets"):
        uses.append("candidate_branch_search")
    if source.get("boundary_tag_search_targets"):
        uses.append("boundary_or_counter_structure_search")
    for key, label in [
        ("freedom_slot", "freedom_slot"),
        ("missing_axis_slot", "missing_axis_probe"),
        ("counter_structure_slot", "counter_structure_probe"),
        ("search_condition_slot", "search_condition"),
    ]:
        if slot_use.get(key):
            uses.append(label)
    return uniq(uses)


def build_source_integrations(bridge: dict[str, Any]) -> list[dict[str, Any]]:
    integrations = []
    for source in bridge["fragmentary_source_links"]:
        axes = matched_axes_for_source(source)
        branch_targets = source.get("candidate_branch_search_targets", [])
        boundary_targets = source.get("boundary_tag_search_targets", [])
        branch_axes = uniq([axis for axis in (branch_axis(item) for item in branch_targets) if axis])
        boundary_axes = uniq([axis for axis in (branch_axis(item) for item in boundary_targets) if axis])
        integrations.append(
            {
                "source_id": source["source_id"],
                "source_family": source["source_family"],
                "status": "fragmentary_source_structural_target_not_case_placement",
                "integration_status": integration_status(source, axes),
                "matched_axes": axes,
                "top_axis": axes[0]["axis_id"] if axes else None,
                "secondary_axes": [item["axis_id"] for item in axes[1:]],
                "candidate_branch_search_targets": branch_targets,
                "candidate_branch_axes": branch_axes,
                "boundary_tag_search_targets": boundary_targets,
                "boundary_axes": boundary_axes,
                "integration_uses": integration_uses(source, axes),
                "raw_or_redacted_text_included": False,
            }
        )
    return integrations


def axis_coverage(integrations: list[dict[str, Any]], labels: dict[str, str]) -> list[dict[str, Any]]:
    coverage = []
    for axis_id in AXIS_ORDER:
        family_counts: Counter[str] = Counter()
        top_axis_family_counts: Counter[str] = Counter()
        score_sum = 0
        scores: list[int] = []
        examples: dict[str, list[str]] = defaultdict(list)
        use_counts: Counter[str] = Counter()
        for item in integrations:
            axis_match = next((axis for axis in item["matched_axes"] if axis["axis_id"] == axis_id), None)
            if not axis_match:
                continue
            family = item["source_family"]
            family_counts[family] += 1
            score_sum += axis_match["score"]
            scores.append(axis_match["score"])
            use_counts.update(item["integration_uses"])
            if item["top_axis"] == axis_id:
                top_axis_family_counts[family] += 1
            if len(examples[family]) < 5:
                examples[family].append(item["source_id"])
        total = sum(family_counts.values())
        coverage.append(
            {
                "axis_id": axis_id,
                "label": labels.get(axis_id, axis_id),
                "matched_source_count": total,
                "top_axis_source_count": sum(top_axis_family_counts.values()),
                "source_family_counts": dict(sorted(family_counts.items())),
                "top_axis_family_counts": dict(sorted(top_axis_family_counts.items())),
                "average_axis_score": round(score_sum / total, 1) if total else 0,
                "max_axis_score": max(scores) if scores else 0,
                "integration_use_counts": dict(use_counts.most_common()),
                "source_examples_by_family": dict(examples),
            }
        )
    return coverage


def axis_pair_coverage(integrations: list[dict[str, Any]], labels: dict[str, str]) -> list[dict[str, Any]]:
    pair_counts: Counter[tuple[str, str]] = Counter()
    pair_family_counts: dict[tuple[str, str], Counter[str]] = defaultdict(Counter)
    pair_examples: dict[tuple[str, str], list[str]] = defaultdict(list)
    for item in integrations:
        axes = [axis["axis_id"] for axis in item["matched_axes"] if axis["score"] >= 16]
        axes = [axis for axis in AXIS_ORDER if axis in axes]
        for pair in combinations(axes[:6], 2):
            pair_counts[pair] += 1
            pair_family_counts[pair][item["source_family"]] += 1
            if len(pair_examples[pair]) < 8:
                pair_examples[pair].append(item["source_id"])
    rows = []
    for pair, count in pair_counts.most_common(20):
        rows.append(
            {
                "axis_pair": list(pair),
                "axis_pair_label": f"{labels.get(pair[0], pair[0])} x {labels.get(pair[1], pair[1])}",
                "source_count": count,
                "source_family_counts": dict(sorted(pair_family_counts[pair].items())),
                "source_examples": pair_examples[pair],
            }
        )
    return rows


def target_coverage(integrations: list[dict[str, Any]], target_key: str) -> list[dict[str, Any]]:
    counts: Counter[str] = Counter()
    family_counts: dict[str, Counter[str]] = defaultdict(Counter)
    examples: dict[str, list[str]] = defaultdict(list)
    for item in integrations:
        for target in item.get(target_key, []):
            counts[target] += 1
            family_counts[target][item["source_family"]] += 1
            if len(examples[target]) < 8:
                examples[target].append(item["source_id"])
    return [
        {
            "target_id": target,
            "source_count": count,
            "source_family_counts": dict(sorted(family_counts[target].items())),
            "source_examples": examples[target],
        }
        for target, count in counts.most_common()
    ]


def family_profiles(integrations: list[dict[str, Any]], labels: dict[str, str]) -> list[dict[str, Any]]:
    by_family: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in integrations:
        by_family[item["source_family"]].append(item)
    profiles = []
    for family, items in sorted(by_family.items()):
        axis_counts: Counter[str] = Counter()
        top_axis_counts: Counter[str] = Counter()
        status_counts: Counter[str] = Counter(item["integration_status"] for item in items)
        use_counts: Counter[str] = Counter()
        for item in items:
            axis_counts.update(axis["axis_id"] for axis in item["matched_axes"])
            if item["top_axis"]:
                top_axis_counts[item["top_axis"]] += 1
            use_counts.update(item["integration_uses"])
        profiles.append(
            {
                "source_family": family,
                "source_count": len(items),
                "integration_status_counts": dict(status_counts.most_common()),
                "matched_axis_counts": [
                    {"axis_id": axis_id, "label": labels.get(axis_id, axis_id), "source_count": count}
                    for axis_id, count in axis_counts.most_common()
                ],
                "top_axis_counts": [
                    {"axis_id": axis_id, "label": labels.get(axis_id, axis_id), "source_count": count}
                    for axis_id, count in top_axis_counts.most_common()
                ],
                "integration_use_counts": dict(use_counts.most_common()),
                "source_examples": [item["source_id"] for item in items[:8]],
            }
        )
    return profiles


def findings(
    integrations: list[dict[str, Any]],
    axis_rows: list[dict[str, Any]],
    pair_rows: list[dict[str, Any]],
) -> list[str]:
    total = len(integrations)
    multi = sum(1 for item in integrations if item["integration_status"] == "multi_axis_fragmentary_structure_target")
    weak = sum(1 for item in integrations if item["integration_status"] == "weak_fragmentary_source_hold")
    top_axes = sorted(axis_rows, key=lambda item: item["matched_source_count"], reverse=True)[:3]
    thin_axes = sorted(axis_rows, key=lambda item: item["matched_source_count"])[:2]
    lead_pairs = pair_rows[:3]
    lines = [
        f"{total}件の断片資料のうち{multi}件は、単独論点ではなく複数構造軸を同時に読む探索対象になった。",
        f"弱い接続として保留した資料は{weak}件で、構造軸へ無理に昇格させていない。",
        "接続が厚い軸: " + "、".join(f"{item['label']}({item['matched_source_count']}件)" for item in top_axes) + "。",
        "接続が薄い軸: " + "、".join(f"{item['label']}({item['matched_source_count']}件)" for item in thin_axes) + "。薄い軸は欠落ではなく、断片資料側で見えにくい自由度として扱う。",
        "同時に現れやすい軸ペア: " + "、".join(f"{item['axis_pair_label']}({item['source_count']}件)" for item in lead_pairs) + "。",
    ]
    return lines


def build_payload() -> dict[str, Any]:
    working_map = read_json(WORKING_MAP_JSON)
    bridge = read_json(BRIDGE_JSON)
    labels = axis_labels(working_map)
    integrations = build_source_integrations(bridge)
    axis_rows = axis_coverage(integrations, labels)
    pair_rows = axis_pair_coverage(integrations, labels)
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "purpose": "断片資料を、調査データから作った8つの構造自由度へ接続し、同型探索・境界探索・反対構造探索に使うための未レビュー統合地図。",
        "method_boundary": {
            "fragmentary_sources_are_not_cases": True,
            "no_source_validity_decision": True,
            "no_support_validity_judgment": True,
            "no_public_claim": True,
            "no_knowledge_promotion": True,
        },
        "fragmentary_source_count": len(integrations),
        "source_family_counts": bridge["source_family_counts"],
        "structural_findings": findings(integrations, axis_rows, pair_rows),
        "axis_coverage": axis_rows,
        "axis_pair_coverage_top20": pair_rows,
        "candidate_branch_target_coverage": target_coverage(integrations, "candidate_branch_search_targets"),
        "boundary_tag_target_coverage": target_coverage(integrations, "boundary_tag_search_targets"),
        "source_family_profiles": family_profiles(integrations, labels),
        "source_integrations": integrations,
    }


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Fragmentary Source Structural Integration Map",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "これは、workshop、NIVR、web-cacheの断片資料を、調査データから作った8つのSCIMA/FCHMA構造自由度へ接続するための本番用作業地図である。断片資料をケースとして数えず、支援妥当性の根拠にもせず、同型探索・境界探索・反対構造探索の入口として使う。",
        "",
        f"断片資料数: {payload['fragmentary_source_count']}",
        "",
        "## 構造上の発見",
        "",
    ]
    lines.extend(f"- {item}" for item in payload["structural_findings"])

    lines.extend(["", "## Source Family", "", "| family | sources |", "|---|---:|"])
    for family, count in sorted(payload["source_family_counts"].items()):
        lines.append(f"| `{family}` | {count} |")

    lines.extend([
        "",
        "## 8軸への接続",
        "",
        "| axis | matched sources | top-axis sources | average score | max score | source families |",
        "|---|---:|---:|---:|---:|---|",
    ])
    for item in payload["axis_coverage"]:
        families = ", ".join(f"{family}:{count}" for family, count in item["source_family_counts"].items()) or "なし"
        lines.append(
            f"| `{item['axis_id']}` {item['label']} | {item['matched_source_count']} | {item['top_axis_source_count']} | {item['average_axis_score']} | {item['max_axis_score']} | {families} |"
        )

    lines.extend([
        "",
        "## 軸ペア上位",
        "",
        "| axis pair | sources | source families | examples |",
        "|---|---:|---|---|",
    ])
    for item in payload["axis_pair_coverage_top20"][:12]:
        families = ", ".join(f"{family}:{count}" for family, count in item["source_family_counts"].items())
        examples = ", ".join(f"`{source_id}`" for source_id in item["source_examples"][:3])
        lines.append(f"| {item['axis_pair_label']} | {item['source_count']} | {families} | {examples} |")

    lines.extend([
        "",
        "## Family別の読み筋",
        "",
        "| family | sources | integration status | top axes | use | examples |",
        "|---|---:|---|---|---|---|",
    ])
    for item in payload["source_family_profiles"]:
        statuses = ", ".join(f"{key}:{value}" for key, value in item["integration_status_counts"].items())
        axes = ", ".join(f"{axis['label']}:{axis['source_count']}" for axis in item["top_axis_counts"][:5]) or "なし"
        uses = ", ".join(f"{key}:{value}" for key, value in list(item["integration_use_counts"].items())[:5])
        examples = ", ".join(f"`{source_id}`" for source_id in item["source_examples"][:3])
        lines.append(f"| `{item['source_family']}` | {item['source_count']} | {statuses} | {axes} | {uses} | {examples} |")

    lines.extend([
        "",
        "## 使い方",
        "",
        "- 調査データrecord ID側で出た構造軸から、同じ軸または軸ペアを持つ断片資料source IDへ飛ぶ。",
        "- 断片資料source IDから、候補枝・境界タグ・軸ペアをたどって、問題側だけでなく軽減側、残余側、反対構造を探す。",
        "- 接続が薄い軸は、重要でない軸ではなく、断片資料に出にくい自由度として扱い、次のLLM文脈読解の探索条件にする。",
        "- ここでは本文を引用せず、source IDと構造ラベルだけを保持する。",
        "",
        f"JSON: `{OUT_JSON.relative_to(ROOT)}`",
    ])
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
