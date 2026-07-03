#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RECORD_INDEX_JSON = RUN_DIR / "stage1-production-overlap-discovery-record-index-v0-2026-05-18.json"
FAMILY_ASSIGNMENT_JSON = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.json"
GRAMMAR_JSON = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.json"
FRAGMENTARY_SLOTS_JSON = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-context-branch-card-candidates-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-context-branch-card-candidates-v0-2026-05-18.md"


BRANCH_SPECS = [
    {
        "branch_id": "CB-01-continuity-quality-loop",
        "grammar_id": "SG-01-continuity-quality-loop",
        "core_od_sets": [
            [
                "OD-01-health-time-support-career-loop",
                "OD-02-health-time-career-evaluation-stack",
                "OD-03-information-support-health-time-bridge",
            ]
        ],
        "candidate_proposition": "就労継続の質は、健康時間、情報同期、評価翻訳が循環し、条件付き遂行が役割・技能・将来見通しへ価値化されるかで変わる可能性。",
        "counter_proposition": "見えている構造は、情報同期や評価翻訳ではなく、健康時間・支援接続・職務設計のいずれか単独の未整合を反映している可能性。",
    },
    {
        "branch_id": "CB-02-work-contact-evaluation-loop",
        "grammar_id": "SG-02-work-contact-evaluation-loop",
        "core_od_sets": [
            [
                "OD-01-health-time-support-career-loop",
                "OD-02-health-time-career-evaluation-stack",
                "OD-05-worksite-contact-health-support-design",
            ]
        ],
        "candidate_proposition": "仕事接触点の設計は、健康時間を守るだけでなく、条件付き遂行が評価・役割・将来見通しへどう読まれるかを変える可能性。",
        "counter_proposition": "仕事接触点に見える信号は、評価翻訳ではなく、設備・作業場所・勤務時間の個別課題に留まる可能性。",
    },
    {
        "branch_id": "CB-03-life-security-sequencing",
        "grammar_id": "SG-03-life-security-sequencing",
        "core_od_sets": [
            [
                "OD-01-health-time-support-career-loop",
                "OD-05-worksite-contact-health-support-design",
                "OD-06-life-security-health-support-sequence",
            ],
            [
                "OD-03-information-support-health-time-bridge",
                "OD-06-life-security-health-support-sequence",
                "OD-07-information-worksite-translation-knot",
            ],
        ],
        "candidate_proposition": "生活保障は背景ではなく、待つ、休む、治療する、求人を選ぶ、支援につながる順序を変え、健康時間と仕事接触点の設計を左右する可能性。",
        "counter_proposition": "生活保障に見える信号は、実際には評価翻訳、情報同期、支援接続、または職務設計の未整合を間接的に示している可能性。",
    },
    {
        "branch_id": "CB-04-information-work-procedure-knot",
        "grammar_id": "SG-04-information-to-work-procedure-knot",
        "core_od_sets": [
            [
                "OD-03-information-support-health-time-bridge",
                "OD-05-worksite-contact-health-support-design",
                "OD-07-information-worksite-translation-knot",
            ],
            [
                "OD-03-information-support-health-time-bridge",
                "OD-06-life-security-health-support-sequence",
                "OD-07-information-worksite-translation-knot",
            ],
        ],
        "candidate_proposition": "情報保障、職場環境、支援は別項目ではなく、情報が作業手順・安全確認・相談場面・評価場面へ職務化される結節として現れる可能性。",
        "counter_proposition": "情報同期に見える信号は、情報形式、設備、支援利用、開示境界のいずれかに分解した方がよい可能性。",
    },
    {
        "branch_id": "CB-05-entry-prework-translation",
        "grammar_id": "SG-05-entry-prework-translation",
        "core_od_sets": [["OD-04-entry-prework-support-sequence"]],
        "counter_od_sets": [
            [
                "OD-03-information-support-health-time-bridge",
                "OD-06-life-security-health-support-sequence",
            ],
            [
                "OD-01-health-time-support-career-loop",
                "OD-06-life-security-health-support-sequence",
            ],
            [
                "OD-03-information-support-health-time-bridge",
                "OD-05-worksite-contact-health-support-design",
            ],
            [
                "OD-01-health-time-support-career-loop",
                "OD-05-worksite-contact-health-support-design",
            ],
        ],
        "counter_family_sets": [
            [
                "SF-01-health-time-choice-bundle",
                "SF-10-life-security-sequencing",
            ],
            [
                "SF-01-health-time-choice-bundle",
                "SF-07-worksite-contact-design",
            ],
            [
                "SF-04-information-synchronization",
                "SF-08-support-retranslation",
            ],
            [
                "SF-01-health-time-choice-bundle",
                "SF-08-support-retranslation",
            ],
        ],
        "candidate_proposition": "未就労・求職・訓練局面では、生活リズム、体力、訓練、説明、支援接続、職務イメージを応募前に求人条件へ翻訳する順序が重要になる可能性。",
        "counter_proposition": "入口以前参加に見える信号は、生活保障、健康時間、情報同期、支援接続の不足が混在した上位未整合である可能性。",
    },
    {
        "branch_id": "CB-06-minority-window-revival",
        "grammar_id": "SG-06-minority-window-revival",
        "core_od_sets": [
            [
                "OD-03-information-support-health-time-bridge",
                "OD-06-life-security-health-support-sequence",
                "OD-07-information-worksite-translation-knot",
            ],
            [
                "OD-03-information-support-health-time-bridge",
                "OD-05-worksite-contact-health-support-design",
                "OD-06-life-security-health-support-sequence",
            ],
            [
                "OD-05-worksite-contact-health-support-design",
                "OD-06-life-security-health-support-sequence",
                "OD-07-information-worksite-translation-knot",
            ],
        ],
        "candidate_proposition": "件数が小さい分枝でも、接触点・自由度・結果焦点が同型なら、少数条件窓として上位構造へ復活させられる可能性。",
        "counter_proposition": "小分枝は、同型ではなく別の結果焦点、別の主自由度、または調査信号の偏りによって偶然近く見えている可能性。",
        "force_stage": "same_structure_search_candidate_not_standalone_review_card",
    },
]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def active_od_ids(record: dict[str, Any]) -> set[str]:
    return set(record["primary_od_ids"]) | set(record["boundary_od_ids"])


def is_primary_for_any(record: dict[str, Any], core_sets: list[list[str]]) -> bool:
    primary = set(record["primary_od_ids"])
    return any(set(core) <= primary for core in core_sets)


def is_boundary_for_any(record: dict[str, Any], core_sets: list[list[str]]) -> bool:
    primary = set(record["primary_od_ids"])
    active = active_od_ids(record)
    return any(set(core) <= active and not set(core) <= primary for core in core_sets)


def is_near_counter_for_any(record: dict[str, Any], core_sets: list[list[str]]) -> bool:
    primary = set(record["primary_od_ids"])
    active = active_od_ids(record)
    for core in core_sets:
        target = set(core)
        if target <= active:
            continue
        if len(active & target) >= max(1, len(target) - 1) and len(primary & target) >= max(1, len(target) - 2):
            return True
    return False


def is_counter_set_for_any(record: dict[str, Any], counter_sets: list[list[str]]) -> bool:
    active = active_od_ids(record)
    return any(set(core) <= active for core in counter_sets)


def is_counter_family_set_for_any(record: dict[str, Any], counter_sets: list[list[str]]) -> bool:
    primary = set(record["primary_family_ids"])
    active = primary | set(record["boundary_family_ids"])
    for family_set in counter_sets:
        target = set(family_set)
        if target <= active and len(primary & target) >= 1:
            return True
    return False


def counts(values: list[str], limit: int = 8) -> dict[str, int]:
    return dict(Counter(values).most_common(limit))


def balanced_ids(records: list[dict[str, Any]], limit: int = 12) -> list[str]:
    picked: list[str] = []
    seen_record_ids: set[str] = set()

    def key_for(record: dict[str, Any]) -> tuple[str, str, str]:
        condition = record["condition_buckets"][0] if record["condition_buckets"] else "条件窓なし"
        return (record["source"], record["status_group"], condition)

    by_source: dict[str, list[dict[str, Any]]] = {}
    for record in records:
        by_source.setdefault(record["source"], []).append(record)

    source_candidates: dict[str, list[dict[str, Any]]] = {}
    for source, source_records in by_source.items():
        seen_keys: set[str] = set()
        unique: list[dict[str, Any]] = []
        for record in sorted(source_records, key=key_for):
            key = "::".join(key_for(record))
            if key in seen_keys:
                continue
            unique.append(record)
            seen_keys.add(key)
        unique_ids = {record["record_id"] for record in unique}
        source_candidates[source] = unique + [record for record in source_records if record["record_id"] not in unique_ids]

    while len(picked) < limit:
        progressed = False
        for source in sorted(source_candidates):
            while source_candidates[source]:
                record = source_candidates[source].pop(0)
                if record["record_id"] in seen_record_ids:
                    continue
                picked.append(record["record_id"])
                seen_record_ids.add(record["record_id"])
                progressed = True
                break
            if len(picked) >= limit:
                return picked
        if not progressed:
            break
    return picked


def readiness(primary_count: int, boundary_count: int, counter_count: int, force_stage: str | None = None) -> str:
    if force_stage:
        return force_stage
    if primary_count >= 20 and boundary_count >= 3 and counter_count >= 3:
        return "review_card_candidate_possible_unreviewed"
    if primary_count >= 8 and boundary_count >= 3:
        return "context_branch_candidate_needs_counter"
    if primary_count >= 5:
        return "same_structure_search_candidate"
    if primary_count >= 1:
        return "signal_only_not_candidate"
    return "no_branch_signal"


def branch_fragmentary_summary(grammar_id: str, fragmentary: dict[str, Any]) -> dict[str, Any]:
    summary = next((item for item in fragmentary["grammar_summary"] if item["grammar_id"] == grammar_id), None)
    if not summary:
        return {}
    return {
        "direct_count": summary["direct_count"],
        "partial_count": summary["partial_count"],
        "thin_count": summary["thin_count"],
        "supporting_only_count": summary["supporting_only_count"],
        "frequent_missing_required_axes": summary["missing_axis_counts"],
        "example_source_ids": summary["examples"][:8],
    }


def build_payload() -> dict[str, Any]:
    record_index = load_json(RECORD_INDEX_JSON)
    family_assignment = load_json(FAMILY_ASSIGNMENT_JSON)
    grammar = load_json(GRAMMAR_JSON)
    fragmentary = load_json(FRAGMENTARY_SLOTS_JSON)
    grammar_by_id = {item["grammar_id"]: item for item in grammar["grammar_rules"]}
    records = record_index["record_assignments"]
    all_family_records = family_assignment["records"]
    branch_cards = []

    for spec in BRANCH_SPECS:
        primary_records = [record for record in records if is_primary_for_any(record, spec["core_od_sets"])]
        primary_ids = {record["record_id"] for record in primary_records}
        boundary_records = [
            record
            for record in records
            if record["record_id"] not in primary_ids and is_boundary_for_any(record, spec["core_od_sets"])
        ]
        primary_or_boundary_ids = primary_ids | {record["record_id"] for record in boundary_records}
        counter_sets = spec.get("counter_od_sets", [])
        counter_family_sets = spec.get("counter_family_sets", [])
        counter_records = []
        if counter_family_sets:
            for record in all_family_records:
                if record["record_id"] in primary_or_boundary_ids:
                    continue
                if is_counter_family_set_for_any(record, counter_family_sets):
                    counter_records.append(record)
        else:
            for record in records:
                if record["record_id"] in primary_or_boundary_ids:
                    continue
                if counter_sets:
                    if is_counter_set_for_any(record, counter_sets):
                        counter_records.append(record)
                elif is_near_counter_for_any(record, spec["core_od_sets"]):
                    counter_records.append(record)
        grammar_rule = grammar_by_id[spec["grammar_id"]]
        condition_values = [condition for record in primary_records for condition in record["condition_buckets"]]
        boundary_condition_values = [condition for record in boundary_records for condition in record["condition_buckets"]]
        state_values = [state for record in primary_records for state in record["state_readings"]]
        status_values = [record["status_group"] for record in primary_records]
        branch_cards.append(
            {
                "branch_id": spec["branch_id"],
                "grammar_id": spec["grammar_id"],
                "grammar_name": grammar_rule["name"],
                "operators": grammar_rule["operators"],
                "core_od_sets": spec["core_od_sets"],
                "primary_count": len(primary_records),
                "boundary_count": len(boundary_records),
                "counter_structure_search_count": len(counter_records),
                "readiness": readiness(
                    len(primary_records),
                    len(boundary_records),
                    len(counter_records),
                    spec.get("force_stage"),
                ),
                "candidate_proposition": spec["candidate_proposition"],
                "counter_proposition": spec["counter_proposition"],
                "non_judgment_hold": "支援妥当性、配慮充足、雇用管理、医学的妥当性、法的評価、就労可否は判断しない。",
                "overinterpretation_risk": "record件数は構造候補の探索強度であり、原因確定、効果量、支援有効性、政策根拠ではない。",
                "ethical_bias_risk": "多数派条件窓に少数派の接触点が吸収されること、または少数窓を特殊例として孤立させることを避ける。",
                "representative_ids": balanced_ids(primary_records),
                "boundary_ids": balanced_ids(boundary_records),
                "counter_structure_ids": balanced_ids(counter_records),
                "status_counts": counts(status_values),
                "condition_counts": counts(condition_values),
                "boundary_condition_counts": counts(boundary_condition_values),
                "state_counts": counts(state_values),
                "fragmentary_slots": branch_fragmentary_summary(spec["grammar_id"], fragmentary),
                "review_questions": [
                    "この文脈枝は、支援有無や障害種類ではなく、operator接続として読めているか。",
                    "代表IDと境界IDは、同じ構造の開閉・残余・変形として比較できるか。",
                    "反対構造候補は、候補命題の否定ではなく、別の主自由度の可能性を示しているか。",
                    "断片資料slotは、支持根拠ではなく、欠けたICF軸と同型探索条件として扱えているか。",
                ],
                "raw_or_redacted_text_included": False,
                "review_status": "not_reviewed",
                "promotion_status": "no_promotion",
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-context-branch-card-candidates-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "operator文法から、最低ケース数、境界例、反対構造候補、断片資料slotを持つ文脈枝カード候補を抽出する。"
            "これはレビュー結果でも知識昇格でもなく、次の人間レビュー候補または同型探索候補を切り分ける未レビュー成果物。"
        ),
        "source_artifacts": [
            str(RECORD_INDEX_JSON.relative_to(ROOT)),
            str(FAMILY_ASSIGNMENT_JSON.relative_to(ROOT)),
            str(GRAMMAR_JSON.relative_to(ROOT)),
            str(FRAGMENTARY_SLOTS_JSON.relative_to(ROOT)),
        ],
        "branch_card_count": len(branch_cards),
        "branch_cards": branch_cards,
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values) if values else "-"


def counts_text(values: dict[str, int]) -> str:
    return ", ".join(f"{key}:{value}" for key, value in values.items()) if values else "-"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Context Branch Card Candidates",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "operator文法から、最低ケース数、境界例、反対構造候補、断片資料slotを持つ文脈枝カード候補を抽出した。これはレビュー結果ではなく、次に人間レビューへ出せる可能性のある枝、または同型探索に留める枝を分けるための未レビュー成果物である。",
        "",
        "## Branch Candidates",
        "",
        "| branch | readiness | primary | boundary | counter search | conditions | representative IDs | boundary IDs | counter IDs |",
        "|---|---|---:|---:|---:|---|---|---|---|",
    ]
    for card in payload["branch_cards"]:
        lines.append(
            "| "
            f"`{card['branch_id']}` {card['grammar_name']} "
            f"| {card['readiness']} "
            f"| {card['primary_count']} "
            f"| {card['boundary_count']} "
            f"| {card['counter_structure_search_count']} "
            f"| {counts_text(card['condition_counts'])} "
            f"| {ids_text(card['representative_ids'][:5])} "
            f"| {ids_text(card['boundary_ids'][:5])} "
            f"| {ids_text(card['counter_structure_ids'][:5])} |"
        )

    lines.extend(["", "## Cards", ""])
    for card in payload["branch_cards"]:
        fragmentary = card["fragmentary_slots"]
        lines.extend(
            [
                f"### {card['branch_id']} {card['grammar_name']}",
                "",
                f"- readiness: {card['readiness']}",
                f"- primary/boundary/counter: {card['primary_count']} / {card['boundary_count']} / {card['counter_structure_search_count']}",
                f"- operators: {ids_text(card['operators'])}",
                f"- candidate proposition: {card['candidate_proposition']}",
                f"- counter proposition: {card['counter_proposition']}",
                f"- representative IDs: {ids_text(card['representative_ids'][:10])}",
                f"- boundary IDs: {ids_text(card['boundary_ids'][:10])}",
                f"- counter-structure search IDs: {ids_text(card['counter_structure_ids'][:10])}",
                f"- condition counts: {counts_text(card['condition_counts'])}",
                f"- boundary condition counts: {counts_text(card['boundary_condition_counts'])}",
                f"- state counts: {counts_text(card['state_counts'])}",
                f"- fragmentary slots: direct={fragmentary.get('direct_count', 0)}, partial={fragmentary.get('partial_count', 0)}, thin={fragmentary.get('thin_count', 0)}, supporting_only={fragmentary.get('supporting_only_count', 0)}",
                f"- frequent missing required axes: {counts_text(fragmentary.get('frequent_missing_required_axes', {}))}",
                f"- fragmentary examples: {ids_text(fragmentary.get('example_source_ids', [])[:5])}",
                f"- non-judgment hold: {card['non_judgment_hold']}",
                f"- overinterpretation risk: {card['overinterpretation_risk']}",
                f"- ethical/bias risk: {card['ethical_bias_risk']}",
                "",
                "review questions:",
            ]
        )
        for question in card["review_questions"]:
            lines.append(f"- {question}")
        lines.append("")

    lines.extend(
        [
            "## Interpretation",
            "",
            "- `review_card_candidate_possible_unreviewed` は、レビューへ出せる可能性があるという作業状態であり、レビュー済み・知識昇格ではない。",
            "- `same_structure_search_candidate_not_standalone_review_card` は、単独カードにせず、少数条件窓を上位構造へ復活させる探索候補として扱う。",
            "- 断片資料slotは、調査データのケース数に足さない。欠けたICF軸と同型探索条件として使う。",
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
