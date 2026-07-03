#!/usr/bin/env python3
"""Build no-text narrative card seed summaries for the 2001 ABC survey."""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
DATASET_ID = "2001_ABC_survey"
STAGING_DIR = REPO_ROOT / "data/staging/anonymized/2001_ABC_survey/v0"
DERIVED_DIR = REPO_ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22"
INPUT_JSONL = STAGING_DIR / "narrative_units.redacted.jsonl"
SEED_INDEX = STAGING_DIR / "narrative_card_seed_index.jsonl"
SUMMARY_JSON = DERIVED_DIR / "2001-abc-survey-narrative-card-seed-summary-v0-2026-05-22.json"
SUMMARY_MD = DERIVED_DIR / "2001-abc-survey-narrative-card-seed-summary-v0-2026-05-22.md"


def card_families(record: dict[str, Any]) -> list[str]:
    table = record["source_table"]
    role = record["field_role"]
    families: list[str] = []
    if table == "A":
        if role in {
            "A_added_establishment_context_narrative",
            "A_employment_reason_challenge_narrative",
            "external_support_advice_narrative",
            "general_open_narrative",
        }:
            families.append("A_establishment_narrative_context_card")
        if role == "external_support_advice_narrative":
            families.append("A_external_advice_use_context_card")
        if role == "A_employment_reason_challenge_narrative":
            families.append("A_employment_reason_challenge_context_card")
    elif table == "B":
        if role == "work_content_narrative":
            families.append("B_work_content_contact_narrative_card")
        if role in {"support_practice_narrative", "external_support_advice_narrative", "general_open_narrative"}:
            families.append("B_support_practice_narrative_card")
        if role == "external_support_advice_narrative":
            families.append("B_external_support_connection_narrative_card")
    elif table == "C":
        if role == "work_content_narrative":
            families.append("C_worker_work_content_narrative_card")
        if role in {"support_practice_narrative", "general_open_narrative"}:
            families.append("C_worker_need_policy_narrative_card")
        if role == "sensitive_health_condition_text":
            families.append("C_sensitive_health_condition_normalization_hold")
    return families or ["narrative_role_needs_review_card"]


def key_for(record: dict[str, Any], family: str) -> tuple[str, str, str | None, str | None]:
    if record["source_table"] == "A":
        scope_hash = record.get("establishment_hash")
    else:
        scope_hash = record.get("pair_hash") or record.get("establishment_hash")
    return (family, record["source_table"], scope_hash, record.get("establishment_hash"))


def main() -> None:
    seed_map: dict[tuple[str, str, str | None, str | None], dict[str, Any]] = {}
    family_counts: Counter[str] = Counter()
    family_unit_counts: Counter[str] = Counter()
    family_signal_counts: dict[str, Counter[str]] = defaultdict(Counter)
    family_role_counts: dict[str, Counter[str]] = defaultdict(Counter)
    family_table_counts: dict[str, Counter[str]] = defaultdict(Counter)
    family_sensitive_counts: Counter[str] = Counter()

    pair_families: dict[str, set[str]] = defaultdict(set)
    est_families: dict[str, set[str]] = defaultdict(set)
    table_by_est: dict[str, set[str]] = defaultdict(set)
    table_by_pair: dict[str, set[str]] = defaultdict(set)

    with INPUT_JSONL.open("r", encoding="utf-8") as src:
        for line in src:
            if not line.strip():
                continue
            record = json.loads(line)
            families = card_families(record)
            pair_hash = record.get("pair_hash")
            est_hash = record.get("establishment_hash")
            if est_hash:
                table_by_est[est_hash].add(record["source_table"])
            if pair_hash:
                table_by_pair[pair_hash].add(record["source_table"])
            for family in families:
                family_unit_counts[family] += 1
                family_signal_counts[family].update(record.get("deterministic_scima_fchma_signal_flags", []))
                family_role_counts[family][record["field_role"]] += 1
                family_table_counts[family][record["source_table"]] += 1
                if record.get("sensitive_health_text"):
                    family_sensitive_counts[family] += 1
                if pair_hash:
                    pair_families[pair_hash].add(family)
                if est_hash:
                    est_families[est_hash].add(family)

                seed_key = key_for(record, family)
                seed = seed_map.setdefault(
                    seed_key,
                    {
                        "dataset_id": DATASET_ID,
                        "card_family": family,
                        "source_table": record["source_table"],
                        "scope_hash": seed_key[2],
                        "establishment_hash": seed_key[3],
                        "pair_hash": record.get("pair_hash"),
                        "perspective": record["perspective"],
                        "unit_count": 0,
                        "field_roles": Counter(),
                        "signals": Counter(),
                        "sensitive_health_unit_count": 0,
                        "review_status": "unreviewed_seed",
                        "source_content_exported": False,
                        "anonymized_content_included": False,
                    },
                )
                seed["unit_count"] += 1
                seed["field_roles"][record["field_role"]] += 1
                seed["signals"].update(record.get("deterministic_scima_fchma_signal_flags", []))
                if record.get("sensitive_health_text"):
                    seed["sensitive_health_unit_count"] += 1

    with SEED_INDEX.open("w", encoding="utf-8") as out:
        for seed in seed_map.values():
            clean_seed = dict(seed)
            clean_seed["field_roles"] = dict(sorted(seed["field_roles"].items()))
            clean_seed["signals"] = dict(sorted(seed["signals"].items()))
            out.write(json.dumps(clean_seed, ensure_ascii=False) + "\n")

    family_counts.update(seed["card_family"] for seed in seed_map.values())

    linked_readiness = {
        "B_C_work_content_pair_overlap": sum(
            1
            for families in pair_families.values()
            if "B_work_content_contact_narrative_card" in families
            and "C_worker_work_content_narrative_card" in families
        ),
        "B_C_support_need_pair_overlap": sum(
            1
            for families in pair_families.values()
            if "B_support_practice_narrative_card" in families
            and "C_worker_need_policy_narrative_card" in families
        ),
        "A_B_support_context_establishment_overlap": sum(
            1
            for families in est_families.values()
            if "A_establishment_narrative_context_card" in families
            and "B_support_practice_narrative_card" in families
        ),
        "A_C_worker_need_context_establishment_overlap": sum(
            1
            for families in est_families.values()
            if "A_establishment_narrative_context_card" in families
            and "C_worker_need_policy_narrative_card" in families
        ),
        "A_B_C_any_narrative_establishment_overlap": sum(
            1 for tables in table_by_est.values() if {"A", "B", "C"}.issubset(tables)
        ),
        "B_C_any_narrative_pair_overlap": sum(
            1 for tables in table_by_pair.values() if {"B", "C"}.issubset(tables)
        ),
    }

    summary = {
        "dataset_id": DATASET_ID,
        "summary_id": "2001_ABC_survey_narrative_card_seed_summary_v0_2026_05_22",
        "status": "aggregate_no_text_card_seed_summary_unreviewed",
        "source_units": str(INPUT_JSONL.relative_to(REPO_ROOT)),
        "seed_index": str(SEED_INDEX.relative_to(REPO_ROOT)),
        "source_content_exported": False,
        "anonymized_content_exported_to_references": False,
        "seed_count": len(seed_map),
        "card_family_seed_counts": dict(sorted(family_counts.items())),
        "card_family_unit_counts": dict(sorted(family_unit_counts.items())),
        "card_family_role_counts": {
            family: dict(sorted(counter.items())) for family, counter in sorted(family_role_counts.items())
        },
        "card_family_signal_counts": {
            family: dict(sorted(counter.items())) for family, counter in sorted(family_signal_counts.items())
        },
        "card_family_table_counts": {
            family: dict(sorted(counter.items())) for family, counter in sorted(family_table_counts.items())
        },
        "card_family_sensitive_health_unit_counts": dict(sorted(family_sensitive_counts.items())),
        "linked_narrative_readiness": linked_readiness,
        "boundary": [
            "seed index contains no raw or redacted text",
            "seed index is still staging, not reviewed knowledge",
            "linked readiness is overlap capacity, not interpretation",
            "no support validity judgment",
            "no diagnosis-to-support lookup",
        ],
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# 2001 ABC Survey Narrative Card Seed Summary",
        "",
        "作成日: 2026-05-22",
        "Lane: Falcon Lab",
        "状態: aggregate no-text card seed summary / 未レビュー / 統合なし / 昇格なし",
        "本文引用: なし",
        "row-level回答本文のreferences外部化: なし",
        "",
        "## Generated",
        "",
        f"- seed index: `{summary['seed_index']}`",
        f"- aggregate JSON summary: `{SUMMARY_JSON.relative_to(REPO_ROOT)}`",
        f"- seed count: {len(seed_map)}",
        "",
        "## Card Families",
        "",
        "| card family | seeds | units |",
        "|---|---:|---:|",
    ]
    for family in sorted(family_unit_counts, key=lambda key: (-family_unit_counts[key], key)):
        lines.append(f"| `{family}` | {family_counts[family]} | {family_unit_counts[family]} |")
    lines.extend(["", "## Linked Narrative Readiness", "", "| overlap | count |", "|---|---:|"])
    for key, value in linked_readiness.items():
        lines.append(f"| `{key}` | {value} |")
    lines.extend(
        [
            "",
            "## Boundary",
            "",
            "- This is overlap/readiness only, not SCIMA/FCHMA interpretation.",
            "- No raw or redacted text is included in this references artifact.",
            "- Individual card promotion and support validity remain outside this step.",
            "",
        ]
    )
    SUMMARY_MD.write_text("\n".join(lines), encoding="utf-8")

    print(
        json.dumps(
            {
                "seed_count": len(seed_map),
                "seed_index": str(SEED_INDEX.relative_to(REPO_ROOT)),
                "summary": str(SUMMARY_JSON.relative_to(REPO_ROOT)),
                "linked_narrative_readiness": linked_readiness,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
