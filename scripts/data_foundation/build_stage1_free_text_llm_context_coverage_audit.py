#!/usr/bin/env python3
"""Audit free-text LLM context-reading coverage for Stage 1.

This script intentionally reads only manifests, counts, JSON keys, and no-text
derived summaries. It does not print or export raw/redacted narrative text,
field values, key phrases, or source passages.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ARTIFACT_ID = "stage1-production-free-text-llm-context-coverage-audit-v0-2026-05-23"
OUT_JSON = RUN_DIR / f"{ARTIFACT_ID}.json"
OUT_MD = RUN_DIR / f"{ARTIFACT_ID}.md"


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def line_count(path: Path) -> int | None:
    if not path.exists():
        return None
    with path.open("rb") as f:
        return sum(1 for _ in f)


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def jsonl_counts(path: Path, key: str) -> dict[str, int]:
    counts: Counter[str] = Counter()
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            row = json.loads(line)
            counts[str(row.get(key, "unknown"))] += 1
    return dict(sorted(counts.items()))


def jsonl_ok_counts(path: Path, key: str) -> dict[str, int]:
    counts: Counter[str] = Counter()
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            row = json.loads(line)
            if row.get("extraction_ok"):
                counts[str(row.get(key, "unknown"))] += 1
    return dict(sorted(counts.items()))


def case_interpretation_summary(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"exists": False}
    cases = 0
    pattern_counts: Counter[str] = Counter()
    with_narrative_labels = 0
    with_uncertainty_flags = 0
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            row = json.loads(line)
            cases += 1
            pattern_counts[str(row.get("pattern_cell_id", "unknown"))] += 1
            if row.get("narrative_context_labels"):
                with_narrative_labels += 1
            if row.get("uncertainty_flags"):
                with_uncertainty_flags += 1
    return {
        "exists": True,
        "case_count": cases,
        "pattern_cell_count": len(pattern_counts),
        "records_with_narrative_labels": with_narrative_labels,
        "records_with_uncertainty_flags": with_uncertainty_flags,
    }


def manifest_summary(path: Path) -> dict[str, Any]:
    data = load_json(path)
    if not data:
        return {"exists": False}
    return {
        "exists": True,
        "status": data.get("status"),
        "records": data.get("records"),
        "records_changed": data.get("records_changed"),
        "review_flagged_records": data.get("review_flagged_records"),
        "residual_flagged_records": data.get("residual_flagged_records"),
        "redacted_text_public_safe": data.get("redacted_text_public_safe"),
        "anonymized_content_public_safe": data.get("anonymized_content_public_safe"),
        "raw_text_exported": data.get("raw_text_exported", data.get("source_raw_text_exported")),
        "source_content_exported": data.get("source_content_exported"),
    }


def artifact_scalar(path: Path, keys: list[str]) -> dict[str, Any]:
    data = load_json(path)
    if not data:
        return {"exists": False}
    out = {"exists": True}
    for key in keys:
        out[key] = data.get(key)
    return out


def make_row(
    *,
    corpus_id: str,
    role: str,
    redacted_units_path: Path,
    manifest_path: Path,
    current_processing: str,
    llm_context_status: str,
    scima_fchma_status: str,
    next_action: str,
    analysis_ready_units_path: Path | None = None,
    legacy_llm_signal: dict[str, Any] | None = None,
    redacted_machine_integration: dict[str, Any] | None = None,
    stage1_context_artifacts: list[str] | None = None,
) -> dict[str, Any]:
    return {
        "corpus_id": corpus_id,
        "role": role,
        "analysis_ready_unit_count": line_count(analysis_ready_units_path) if analysis_ready_units_path else None,
        "redacted_unit_count": line_count(redacted_units_path),
        "redaction_manifest": manifest_summary(manifest_path),
        "legacy_llm_signal_extraction": legacy_llm_signal or {"exists": False},
        "redacted_machine_integration": redacted_machine_integration or {"exists": False},
        "stage1_context_artifacts": stage1_context_artifacts or [],
        "current_processing": current_processing,
        "llm_context_reading_status": llm_context_status,
        "scima_fchma_completion_status": scima_fchma_status,
        "next_action": next_action,
    }


def build_audit() -> dict[str, Any]:
    narrative_signal_path = ROOT / "data/analysis_ready/joint_icf/v1_canonical/narrative_icf_signals.jsonl"
    supporter_signal_path = ROOT / "data/analysis_ready/supporters/joint/v1_narrative/supporter_narrative_signals.jsonl"
    narrative_counts = jsonl_counts(narrative_signal_path, "dataset")
    narrative_ok = jsonl_ok_counts(narrative_signal_path, "dataset")
    supporter_counts = jsonl_counts(supporter_signal_path, "dataset")
    supporter_ok = jsonl_ok_counts(supporter_signal_path, "dataset")

    employment_cases = ROOT / (
        "references/derived/scima-fchma/employment_survey_3000/"
        "redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl"
    )
    nanbyo_cases = ROOT / (
        "references/derived/scima-fchma/nanbyo_survey_4000/"
        "redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl"
    )

    coverage_rows = [
        make_row(
            corpus_id="employment_survey_3000",
            role="respondent_survey",
            analysis_ready_units_path=ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/free_text_units.jsonl",
            redacted_units_path=ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/employment_survey_3000/v0/redaction_manifest.json",
            legacy_llm_signal={
                "exists": narrative_signal_path.exists(),
                "artifact": rel(narrative_signal_path),
                "rows": narrative_counts.get("employment", 0),
                "extraction_ok_rows": narrative_ok.get("employment", 0),
                "status": "legacy_analysis_ready_unit_text_signal_extraction_not_current_redacted_context_branch_reading",
            },
            redacted_machine_integration={
                "artifact": rel(employment_cases),
                **case_interpretation_summary(employment_cases),
            },
            stage1_context_artifacts=[
                "stage1-production-llm-context-reading-batch1-v0-2026-05-18.md",
                "stage1-production-llm-context-reading-batch2-subbranch-v0-2026-05-18.md",
                "stage1-production-bundle-a-participation-quality-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-b-entry-order-life-security-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-c-health-time-life-security-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-d-diversity-conditioned-structure-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-e-info-worksite-disclosure-polarity-context-reading-v0-2026-05-18.md",
                "stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.md",
                "stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.md",
                "stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.md",
                "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md",
                "stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.md",
            ],
            current_processing="redacted_units_exist; legacy_llm_signal_extraction_exists; redacted_machine_case_integration_exists; selective_stage1_context_reading_exists",
            llm_context_status="partial_selective_not_full_record_level_or_full_branch_coverage",
            scima_fchma_status="not_complete_as_survey_free_text_scima_fchma",
            next_action="run governed redacted+structured LLM context-branch reading for representative/boundary/counter records by C01-C08 routes; no text export",
        ),
        make_row(
            corpus_id="nanbyo_survey_4000",
            role="respondent_survey",
            analysis_ready_units_path=ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/free_text_units.jsonl",
            redacted_units_path=ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/redaction_manifest.json",
            legacy_llm_signal={
                "exists": narrative_signal_path.exists(),
                "artifact": rel(narrative_signal_path),
                "rows": narrative_counts.get("nanbyo", 0),
                "extraction_ok_rows": narrative_ok.get("nanbyo", 0),
                "status": "legacy_analysis_ready_unit_text_signal_extraction_not_current_redacted_context_branch_reading",
            },
            redacted_machine_integration={
                "artifact": rel(nanbyo_cases),
                **case_interpretation_summary(nanbyo_cases),
            },
            stage1_context_artifacts=[
                "stage1-production-llm-context-reading-batch1-v0-2026-05-18.md",
                "stage1-production-llm-context-reading-batch2-subbranch-v0-2026-05-18.md",
                "stage1-production-bundle-a-participation-quality-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-b-entry-order-life-security-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-c-health-time-life-security-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-d-diversity-conditioned-structure-context-reading-v0-2026-05-18.md",
                "stage1-production-bundle-e-info-worksite-disclosure-polarity-context-reading-v0-2026-05-18.md",
                "stage1-production-cr01-health-time-life-security-context-reading-v0-2026-05-23.md",
                "stage1-production-cr02-quality-value-context-reading-v0-2026-05-23.md",
                "stage1-production-cr03-prework-entry-context-reading-v0-2026-05-23.md",
                "stage1-production-cr04-worksite-contact-context-reading-v0-2026-05-23.md",
                "stage1-production-cr05-residual-hold-context-reading-v0-2026-05-23.md",
            ],
            current_processing="redacted_units_exist; legacy_llm_signal_extraction_exists; redacted_machine_case_integration_exists; selective_stage1_context_reading_exists",
            llm_context_status="partial_selective_not_full_record_level_or_full_branch_coverage",
            scima_fchma_status="not_complete_as_survey_free_text_scima_fchma",
            next_action="run governed redacted+structured LLM context-branch reading for representative/boundary/counter records by C01-C08 routes; no text export",
        ),
        make_row(
            corpus_id="supporter_practice_nanbyo",
            role="supporter_survey",
            analysis_ready_units_path=ROOT / "data/analysis_ready/supporters/supporter_practice_nanbyo/v0/free_text_units.jsonl",
            redacted_units_path=ROOT / "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/supporter_practice_nanbyo/v0/redaction_manifest.json",
            legacy_llm_signal={
                "exists": supporter_signal_path.exists(),
                "artifact": rel(supporter_signal_path),
                "rows": supporter_counts.get("nanbyo", 0),
                "extraction_ok_rows": supporter_ok.get("nanbyo", 0),
                "status": "legacy_analysis_ready_unit_text_signal_extraction_not_current_redacted_context_branch_reading",
            },
            current_processing="redacted_units_exist; legacy_llm_signal_extraction_exists; used in Stage 1 connection artifacts; no dedicated redacted SCIMA/FCHMA context-branch completion found",
            llm_context_status="partial_or_unverified",
            scima_fchma_status="not_complete_as_supporter_free_text_scima_fchma",
            next_action="queue supporter-side redacted+structured context readings as mechanism/counter-mechanism evidence, not support-validity judgments",
        ),
        make_row(
            corpus_id="supporter_practice_toku18",
            role="supporter_survey",
            analysis_ready_units_path=ROOT / "data/analysis_ready/supporters/supporter_practice_toku18/v0/free_text_units.jsonl",
            redacted_units_path=ROOT / "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/supporter_practice_toku18/v0/redaction_manifest.json",
            legacy_llm_signal={
                "exists": supporter_signal_path.exists(),
                "artifact": rel(supporter_signal_path),
                "rows": supporter_counts.get("toku18", 0),
                "extraction_ok_rows": supporter_ok.get("toku18", 0),
                "status": "legacy_analysis_ready_unit_text_signal_extraction_not_current_redacted_context_branch_reading",
            },
            current_processing="redacted_units_exist; legacy_llm_signal_extraction_exists; used in Stage 1 connection artifacts; no dedicated redacted SCIMA/FCHMA context-branch completion found",
            llm_context_status="partial_or_unverified",
            scima_fchma_status="not_complete_as_supporter_free_text_scima_fchma",
            next_action="queue supporter-side redacted+structured context readings as mechanism/counter-mechanism evidence, not support-validity judgments",
        ),
        make_row(
            corpus_id="nanbyo_workplace_2022_2023",
            role="workplace_survey",
            redacted_units_path=ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/redaction_manifest.json",
            current_processing="redacted_units_exist; no Stage 1 dedicated LLM context-reading completion found",
            llm_context_status="missing_or_unverified",
            scima_fchma_status="not_complete_as_workplace_free_text_scima_fchma",
            next_action="build workplace-perspective redacted+structured context reading focused on employer constraints, work design, and burden translation",
        ),
        make_row(
            corpus_id="nanbyo_workplace_2022_2023_web_raw0324",
            role="workplace_survey",
            redacted_units_path=ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/free_text_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/redaction_manifest.json",
            current_processing="redacted_units_exist; no Stage 1 dedicated LLM context-reading completion found",
            llm_context_status="missing_or_unverified",
            scima_fchma_status="not_complete_as_workplace_free_text_scima_fchma",
            next_action="deduplicate/compare against nanbyo_workplace_2022_2023 before context reading to avoid duplicate evidence weight",
        ),
        make_row(
            corpus_id="2001_ABC_survey",
            role="linked_triad_survey",
            redacted_units_path=ROOT / "data/staging/anonymized/2001_ABC_survey/v0/narrative_units.redacted.jsonl",
            manifest_path=ROOT / "data/staging/anonymized/2001_ABC_survey/v0/narrative_redaction_manifest.json",
            redacted_machine_integration={
                "staging_summary": artifact_scalar(
                    ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22/2001-abc-survey-narrative-staging-summary-v0-2026-05-22.json",
                    ["status", "total_units", "source_content_exported", "anonymized_content_exported_to_references"],
                ),
                "a_linked_deep_summary": artifact_scalar(
                    ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22/2001-abc-survey-A-linked-narrative-deep-structure-summary-v0-2026-05-22.json",
                    ["status", "deep_card_count", "pattern_cell_count", "source_content_exported", "narrative_content_exported_to_references", "review_status"],
                ),
                "bc_linked_deep_summary": artifact_scalar(
                    ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22/2001-abc-survey-B-C-linked-narrative-deep-structure-summary-v0-2026-05-22.json",
                    ["status", "deep_card_count", "pattern_cell_count", "source_content_exported", "narrative_content_exported_to_references", "review_status"],
                ),
                "triadic_synthesis": artifact_scalar(
                    ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22/2001-abc-survey-triadic-scima-fchma-synthesis-cards-v0-2026-05-22.json",
                    ["status", "card_count", "source_content_exported", "narrative_content_included", "row_level_ids_exported", "review_status"],
                ),
            },
            current_processing="redacted_narrative_units_exist; machine structural no-text summaries and triadic synthesis exist; no auditable row-level LLM context-reading completion marker found",
            llm_context_status="partial_or_unverified",
            scima_fchma_status="not_complete_as_2001_linked_free_text_scima_fchma",
            next_action="sample linked A-B-C representative/boundary/counter triads and perform redacted+structured LLM context reading that separates A/B/C perspectives",
        ),
    ]

    evidence_artifacts = {
        "standard": rel(ROOT / "docs/nbl-workspace/method/scima-fchma-llm-context-reading-standard-v0-2026-05-13.md"),
        "legacy_pre_llm_integration": rel(ROOT / "references/derived/scima-fchma/falcon_core_analysis_integration_v0_2026-05-14/falcon-core-analysis-integration-v0-2026-05-14.md"),
        "stage1_branch_assignments": rel(RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"),
        "stage1_context_card_candidates": rel(RUN_DIR / "stage1-production-context-branch-card-candidates-v0-2026-05-18.json"),
        "record_level_redacted_rereading": rel(RUN_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json"),
        "raw_original_local_only_audit": rel(RUN_DIR / "stage1-production-raw-original-local-only-audit-v0-2026-05-23.json"),
        "web_cache_source_audit": rel(RUN_DIR / "stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.json"),
    }

    return {
        "artifact_id": ARTIFACT_ID,
        "lane": "Falcon / Falcon Lab",
        "status": "coverage_audit_no_text_export_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "key_phrases_exported": False,
        "validity_judgment_made": False,
        "bottom_line": [
            "Python-only cooccurrence, regex, clustering, or redacted-machine grouping is not SCIMA/FCHMA completion.",
            "Legacy LLM signal extraction exists for respondent and supporter narratives, but it was run from analysis_ready unit_text and is signal extraction, not the current redacted context-branch reading standard.",
            "Employment and nanbyo respondent corpora have strong redacted-machine integration and selective Stage 1 context-reading artifacts, but not full free-text SCIMA/FCHMA completion.",
            "Supporter, workplace, web-cache, NIVR/report, and 2001 ABC layers add important perspective diversity, but their context-reading coverage is partial or source-family selective.",
            "The honest next move is not another completion packet; it is governed redacted+structured LLM context reading by route, with no source text export and no promotion.",
        ],
        "coverage_rows": coverage_rows,
        "stage1_record_level_followup": {
            "workset_manifest": artifact_scalar(
                RUN_DIR / "stage1-production-raw-redacted-rereading-workset-manifest-v0-2026-05-23.json",
                ["status", "raw_original_opened", "raw_original_opened_in_followup_artifact", "target_record_count", "source_text_exported", "redacted_text_exported"],
            ),
            "redacted_notes": artifact_scalar(
                RUN_DIR / "stage1-production-redacted-record-level-rereading-notes-v0-2026-05-23.json",
                ["status", "raw_original_opened", "redacted_text_read_internal", "record_count", "records_with_redacted_units", "records_without_redacted_units", "source_text_exported", "redacted_text_exported"],
            ),
            "raw_local_only": artifact_scalar(
                RUN_DIR / "stage1-production-raw-original-local-only-audit-v0-2026-05-23.json",
                ["status", "raw_original_opened", "record_count", "unique_record_count", "source_text_exported", "redacted_text_exported", "field_value_exported", "llm_received_raw_text"],
            ),
        },
        "fragmentary_source_coverage": {
            "web_cache_audit": artifact_scalar(
                RUN_DIR / "stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.json",
                ["status", "review_status", "raw_text_exported"],
            ),
            "existing_fragmentary_llm_batches": [
                rel(RUN_DIR / "stage1-production-fragmentary-llm-context-reading-batch1-thin-axis-v0-2026-05-18.md"),
                rel(RUN_DIR / "stage1-production-fragmentary-llm-context-reading-batch2-nivr-life-course-quality-v0-2026-05-18.md"),
                rel(RUN_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.md"),
                rel(RUN_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md"),
            ],
            "status": "useful_source_family_context_reading_exists_but_not_complete_full_original_source_coverage",
        },
        "next_sequence": [
            {
                "step": "FT-LLM-01",
                "target": "employment_survey_3000 + nanbyo_survey_4000",
                "work": "redacted+structured route-batch context reading for C01/C03/C05 first, then C02/C04/C06, then C07/C08 through adjacent routes",
                "output_rule": "no raw/redacted text, no field values, record IDs and structural interpretation only",
            },
            {
                "step": "FT-LLM-02",
                "target": "supporter_practice_nanbyo + supporter_practice_toku18",
                "work": "supporter-side mechanism/counter-mechanism readings, separating practice insight from support-validity judgment",
                "output_rule": "no text export; no support validity decision",
            },
            {
                "step": "FT-LLM-03",
                "target": "2001_ABC_survey",
                "work": "linked A/B/C triad readings that preserve employer, supervisor, and worker perspective disagreement",
                "output_rule": "no narrative text; linked perspective relation only",
            },
            {
                "step": "FT-LLM-04",
                "target": "nanbyo_workplace_2022_2023",
                "work": "workplace-perspective context readings after duplicate/source-surface reconciliation",
                "output_rule": "burden/constraint as translation condition, not employer validity judgment",
            },
            {
                "step": "FT-LLM-05",
                "target": "NIVR/report/web-cache",
                "work": "source-family deep reading from audited priority queues; connect to route mechanisms without treating sources as case evidence",
                "output_rule": "no current-policy claim; no source/support validity decision",
            },
        ],
        "evidence_artifacts": evidence_artifacts,
    }


def write_markdown(audit: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Free-Text LLM Context Coverage Audit",
        "",
        "日付: 2026-05-23",
        "レーン: Falcon / Falcon Lab",
        "状態: coverage audit / 本文引用なし / 昇格なし / 公開不可 / runtime未承認",
        "",
        "## 結論",
        "",
    ]
    for item in audit["bottom_line"]:
        lines.append(f"- {item}")

    lines.extend([
        "",
        "## Coverage Matrix",
        "",
        "| corpus | redacted units | legacy LLM signal | redacted machine integration | LLM context status | SCIMA/FCHMA status |",
        "|---|---:|---|---|---|---|",
    ])
    for row in audit["coverage_rows"]:
        legacy = row["legacy_llm_signal_extraction"]
        machine = row["redacted_machine_integration"]
        legacy_text = "none"
        if legacy.get("exists"):
            legacy_text = f"{legacy.get('rows', 0)} rows / ok {legacy.get('extraction_ok_rows', 0)}"
        machine_text = "none"
        if machine.get("exists"):
            machine_text = f"{machine.get('case_count', machine.get('card_count', 'exists'))}"
        elif row["corpus_id"] == "2001_ABC_survey":
            machine_text = "staging/deep summaries/synthesis"
        lines.append(
            "| "
            + " | ".join(
                [
                    f"`{row['corpus_id']}`",
                    str(row["redacted_unit_count"]),
                    legacy_text,
                    machine_text,
                    row["llm_context_reading_status"],
                    row["scima_fchma_completion_status"],
                ]
            )
            + " |"
        )

    lines.extend([
        "",
        "## What This Means",
        "",
        "- `narrative_icf_signals.jsonl` and `supporter_narrative_signals.jsonl` are legacy LLM signal extraction layers. They are useful as historical features, but because they were not the current redacted context-branch protocol and can contain phrase-level outputs, they must not be treated as final SCIMA/FCHMA reading.",
        "- `redacted-narrative-integrated` artifacts are valuable: they combine structured answers with redacted free-text labels and create record IDs, boundary IDs, and counter-read candidates. But the scripts use deterministic labels/rules and candidate propositions, so they are queues for SCIMA/FCHMA, not completion.",
        "- Stage 1 has several actual context-reading artifacts, including Batch 1/2, Bundle A-E, CR-01 to CR-05, fragmentary LLM batches, and web-cache deep readings. These are selective route/corridor readings. They do not prove full free-text coverage across all corpora.",
        "- 2001 ABC has strong redacted narrative staging and linked triad synthesis. Its current status should remain partial/unverified for row-level LLM context reading until selected A/B/C linked records are read under the same redacted+structured protocol.",
        "",
        "## Next Sequence",
        "",
    ])
    for step in audit["next_sequence"]:
        lines.extend([
            f"### {step['step']} `{step['target']}`",
            "",
            f"- Work: {step['work']}",
            f"- Output rule: {step['output_rule']}",
            "",
        ])

    lines.extend([
        "## Boundaries Kept",
        "",
        "- No raw or redacted narrative text is exported.",
        "- No key phrases, field values, source passages, or PII are exported.",
        "- No source/support validity, review status, promotion, public approval, or runtime approval is changed.",
        "",
        f"JSON: `{rel(OUT_JSON)}`",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    audit = build_audit()
    OUT_JSON.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(audit)
    print(json.dumps({"json": rel(OUT_JSON), "markdown": rel(OUT_MD)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
