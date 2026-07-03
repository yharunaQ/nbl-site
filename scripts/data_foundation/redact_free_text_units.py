#!/usr/bin/env python3
"""Deterministically redact obvious PII from free-text JSONL units.

This is a local preprocessing step. It is intentionally conservative about
publication claims: output remains sensitive staging data, not public material.
The goal is to preserve analytic context while replacing direct identifiers
with typed placeholders.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from typing import Callable


Rule = tuple[str, re.Pattern[str], str | Callable[[re.Match[str]], str]]


NAME_EXCEPTIONS = {
    "患者",
    "皆",
    "みな",
    "お子",
    "子供",
    "医師",
    "先生",
    "会社",
    "職場",
    "上司",
    "同僚",
    "家族",
    "友人",
    "自分",
    "本人",
}


def _person_name_replacer(match: re.Match[str]) -> str:
    name = match.group(1)
    suffix = match.group(2)
    if name in NAME_EXCEPTIONS:
        return match.group(0)
    return f"[PERSON_NAME]{suffix}"


RULES: list[Rule] = [
    (
        "email",
        re.compile(r"(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?![A-Za-z0-9._%+-])"),
        "[EMAIL]",
    ),
    (
        "url",
        re.compile(r"https?://[^\s　、。)）]+|www\.[^\s　、。)）]+", re.IGNORECASE),
        "[URL]",
    ),
    (
        "sns_id",
        re.compile(r"(?<![A-Za-z0-9_])@[A-Za-z0-9_]{3,30}(?![A-Za-z0-9_])"),
        "[SNS_ID]",
    ),
    (
        "phone",
        re.compile(r"(?<!\d)(?:0\d{1,4}[-ー－]?\d{1,4}[-ー－]?\d{3,4}|\d{2,4}[-ー－]\d{2,4}[-ー－]\d{3,4})(?!\d)"),
        "[PHONE]",
    ),
    (
        "postal_code",
        re.compile(r"〒?\s*\d{3}[-ー－]\d{4}"),
        "[POSTAL_CODE]",
    ),
    (
        "date",
        re.compile(r"(?:19|20)\d{2}[年/\-.]\s*\d{1,2}[月/\-.]\s*\d{1,2}日?|令和\d{1,2}年\d{1,2}月\d{1,2}日"),
        "[DATE]",
    ),
    (
        "birthdate",
        re.compile(r"生年月日\s*[:：]?\s*[^\s　、。]+"),
        "生年月日:[DATE]",
    ),
    (
        "age",
        re.compile(r"(?<!\d)\d{1,3}\s*[歳才](?!\d)"),
        "[AGE]",
    ),
    (
        "address",
        re.compile(r"(?:北海道|東京都|大阪府|京都府|[一-龥]{2,3}県)[一-龥ぁ-んァ-ヶー]{1,16}(?:市|区|町|村)[^\s　、。]{0,24}(?:\d|丁目|番|号)[^\s　、。]*"),
        "[ADDRESS]",
    ),
    (
        "address_detail",
        re.compile(r"(?<!\d)\d{1,4}(?:丁目|番地|番|号|[-ー－])\d{0,4}(?:[-ー－]\d{1,4})?(?!\d)"),
        "[ADDRESS_DETAIL]",
    ),
    (
        "medical_institution",
        re.compile(r"[一-龥ぁ-んァ-ヶA-Za-z0-9・ー]{2,30}(?:大学病院|総合病院|病院|医院|クリニック)"),
        "[MEDICAL_INSTITUTION]",
    ),
    (
        "employer",
        re.compile(r"(?:株式会社|有限会社|合同会社)\s*[一-龥ぁ-んァ-ヶA-Za-z0-9・ー]{2,30}|[一-龥ぁ-んァ-ヶA-Za-z0-9・ー]{2,30}\s*(?:株式会社|有限会社|合同会社)"),
        "[EMPLOYER_NAME]",
    ),
    (
        "school",
        re.compile(r"[一-龥ぁ-んァ-ヶA-Za-z0-9・ー]{2,30}(?:大学|高等学校|高校|専門学校|中学校|小学校)"),
        "[SCHOOL_NAME]",
    ),
    (
        "id_number",
        re.compile(r"(?:ID|Id|id|番号|No\.?|NO\.?)\s*[:：]?\s*[A-Za-z0-9][-A-Za-z0-9_]{3,}"),
        "[ID_NUMBER]",
    ),
    (
        "person_name_honorific",
        re.compile(r"([一-龥ぁ-んァ-ヶー]{2,8})(さん|様|氏|先生)"),
        _person_name_replacer,
    ),
]


QA_PATTERNS: dict[str, re.Pattern[str]] = {
    "email": RULES[0][1],
    "url": RULES[1][1],
    "phone": RULES[3][1],
    "postal_code": RULES[4][1],
    "exact_date": RULES[5][1],
}


def redact_text(text: str) -> tuple[str, Counter[str]]:
    counts: Counter[str] = Counter()
    redacted = text
    for rule_name, pattern, replacement in RULES:
        matches = list(pattern.finditer(redacted))
        if not matches:
            continue
        if callable(replacement):
            before = redacted
            redacted = pattern.sub(replacement, redacted)
            if redacted != before:
                counts[rule_name] += len(matches)
        else:
            redacted = pattern.sub(replacement, redacted)
            counts[rule_name] += len(matches)
    return redacted, counts


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--dataset-id", default="unknown_dataset")
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    output_jsonl = args.output_dir / "free_text_units.redacted.jsonl"
    manifest_path = args.output_dir / "redaction_manifest.json"
    flags_path = args.output_dir / "redaction_review_flags.jsonl"

    total = 0
    changed = 0
    type_counts: Counter[str] = Counter()
    residual_counts: Counter[str] = Counter()
    flagged = 0

    with args.input.open("r", encoding="utf-8") as src, output_jsonl.open("w", encoding="utf-8") as out, flags_path.open("w", encoding="utf-8") as flags:
        for line in src:
            if not line.strip():
                continue
            total += 1
            record = json.loads(line)
            raw_text = record.get("unit_text", "")
            redacted_text, counts = redact_text(raw_text)
            type_counts.update(counts)
            if redacted_text != raw_text:
                changed += 1

            residual = {
                name: len(pattern.findall(redacted_text))
                for name, pattern in QA_PATTERNS.items()
            }
            residual = {name: count for name, count in residual.items() if count}
            residual_counts.update(residual)
            if residual:
                flagged += 1
                flags.write(json.dumps({
                    "dataset_id": record.get("dataset_id"),
                    "respondent_id": record.get("respondent_id"),
                    "raw_name": record.get("raw_name"),
                    "unit_index": record.get("unit_index"),
                    "residual_pattern_counts": residual,
                    "review_reason": "residual_obvious_identifier_pattern_after_redaction",
                }, ensure_ascii=False) + "\n")

            clean_record = {
                key: value
                for key, value in record.items()
                if key != "unit_text"
            }
            clean_record.update({
                "redacted_unit_text": redacted_text,
                "redaction_types": sorted(counts.keys()),
                "redaction_count": sum(counts.values()),
                "original_content_hash": record.get("content_hash") or sha256_text(raw_text),
                "redacted_content_hash": sha256_text(redacted_text),
                "redacted_char_count": len(redacted_text),
                "redaction_status": "local_deterministic_redaction_not_human_reviewed",
            })
            out.write(json.dumps(clean_record, ensure_ascii=False) + "\n")

    manifest = {
        "dataset_id": args.dataset_id,
        "input": str(args.input),
        "output": str(output_jsonl),
        "review_flags": str(flags_path),
        "status": "local_deterministic_redaction_not_human_reviewed",
        "records": total,
        "records_changed": changed,
        "redaction_type_counts": dict(sorted(type_counts.items())),
        "residual_obvious_identifier_pattern_counts": dict(sorted(residual_counts.items())),
        "residual_flagged_records": flagged,
        "raw_text_exported": False,
        "redacted_text_public_safe": False,
        "notes": [
            "Typed placeholders preserve analytic context better than deletion.",
            "This does not guarantee full de-identification; Japanese names, rare institutions, and unique life events may require human review.",
            "Use this output as staging input before full narrative analysis, not as public or reviewed knowledge.",
        ],
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "records": total,
        "records_changed": changed,
        "redaction_type_counts": dict(sorted(type_counts.items())),
        "residual_flagged_records": flagged,
        "output": str(output_jsonl),
        "manifest": str(manifest_path),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
