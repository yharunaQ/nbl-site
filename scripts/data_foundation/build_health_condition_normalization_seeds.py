#!/usr/bin/env python3

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
ANALYSIS_READY_ROOT = REPO_ROOT / 'data' / 'analysis_ready' / 'respondents'
OUTPUT_DIR = REPO_ROOT / 'data' / 'specs' / 'icd'
OUTPUT_PATH = OUTPUT_DIR / 'health-condition-normalization-seeds-v0.json'


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def split_labels_joined(text: str) -> list[str]:
    return [part.strip() for part in text.split(' | ') if part.strip()]


def normalize_alias_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()


def build_alias_candidates(label: str) -> list[str]:
    aliases = {normalize_alias_text(label)}

    if '／' in label:
        aliases.update(normalize_alias_text(part) for part in label.split('／') if part.strip())
    if '/' in label:
        aliases.update(normalize_alias_text(part) for part in label.split('/') if part.strip())
    if '|' in label:
        aliases.update(normalize_alias_text(part) for part in label.split('|') if part.strip())

    paren_matches = re.findall(r'[（(]([^）)]+)[）)]', label)
    aliases.update(normalize_alias_text(match) for match in paren_matches if match.strip())

    return sorted(alias for alias in aliases if alias)


def build_entry(
    entry_id: str,
    raw_label: str,
    label_kind: str,
    normalization_scope: str,
    icd_lookup_priority: str,
    source_dataset_ids: list[str],
    source_fields: list[str],
    notes: list[str] | None = None,
) -> dict[str, Any]:
    return {
        'id': entry_id,
        'raw_label': raw_label,
        'preferred_label_seed': normalize_alias_text(raw_label),
        'alias_candidates': build_alias_candidates(raw_label),
        'label_kind': label_kind,
        'normalization_scope': normalization_scope,
        'icd_lookup_priority': icd_lookup_priority,
        'source_dataset_ids': sorted(source_dataset_ids),
        'source_fields': sorted(source_fields),
        'review_required': True,
        'notes': notes or [],
    }


def collect_employment_entries() -> list[dict[str, Any]]:
    codebook_path = ANALYSIS_READY_ROOT / 'employment_survey_3000' / 'v0' / 'codebook.csv'
    multiselect_path = ANALYSIS_READY_ROOT / 'employment_survey_3000' / 'v0' / 'multiselect_values.csv'
    codebook_df = pd.read_csv(codebook_path)
    multiselect_df = pd.read_csv(multiselect_path, low_memory=False)
    entries: list[dict[str, Any]] = []

    disability_labels = sorted(
        label
        for label in multiselect_df[multiselect_df['raw_name'] == '3障害']['option_label'].dropna().unique()
        if isinstance(label, str) and label.strip()
    )
    for index, label in enumerate(disability_labels, start=1):
        entries.append(
          build_entry(
              entry_id=f'employment_group_{index:03d}',
              raw_label=label,
              label_kind='broad_condition_group',
              normalization_scope='non_icd_group',
              icd_lookup_priority='none',
              source_dataset_ids=['employment_survey_3000'],
              source_fields=['3障害'],
              notes=[
                  'Broad disability or condition grouping from employment respondent survey.',
                  'Keep separate from ICD disease normalization.',
              ],
          )
        )

    derived_rows = codebook_df[codebook_df['raw_name'] == '分類名']
    if not derived_rows.empty:
        for index, label in enumerate(split_labels_joined(str(derived_rows.iloc[0]['labels_joined'])), start=1):
            entries.append(
              build_entry(
                  entry_id=f'employment_derived_group_{index:03d}',
                  raw_label=label,
                  label_kind='derived_condition_group',
                  normalization_scope='non_icd_group',
                  icd_lookup_priority='none',
                  source_dataset_ids=['employment_survey_3000'],
                  source_fields=['分類名'],
                  notes=[
                      'Derived aggregate condition grouping for cross-disability employment analysis.',
                      'Use for grouping and retrieval, not for ICD indexing.',
                  ],
              )
            )

    return entries


def collect_nanbyo_entries() -> list[dict[str, Any]]:
    multiselect_path = ANALYSIS_READY_ROOT / 'nanbyo_survey_4000' / 'v0' / 'multiselect_values.csv'
    multiselect_df = pd.read_csv(multiselect_path, low_memory=False)
    entries: list[dict[str, Any]] = []

    admin_fields = {'Q05_1'}
    disease_fields = {'Q05_2_1', 'Q05_2_2', 'Q05_2_3', 'Q05_2_4'}

    admin_labels = sorted(
        label
        for label in multiselect_df[multiselect_df['raw_name'].isin(admin_fields)]['option_label'].dropna().unique()
        if isinstance(label, str) and label.strip()
    )
    for index, label in enumerate(admin_labels, start=1):
        entries.append(
          build_entry(
              entry_id=f'nanbyo_admin_{index:03d}',
              raw_label=label,
              label_kind='administrative_status',
              normalization_scope='administrative_status',
              icd_lookup_priority='none',
              source_dataset_ids=['nanbyo_survey_4000'],
              source_fields=sorted(admin_fields),
              notes=[
                  'Legal or administrative status related to rare-disease designation or benefits.',
                  'Useful for context and filtering, not as an ICD disease label.',
              ],
          )
        )

    disease_labels = sorted(
        label
        for label in multiselect_df[multiselect_df['raw_name'].isin(disease_fields)]['option_label'].dropna().unique()
        if isinstance(label, str) and label.strip()
    )
    for index, label in enumerate(disease_labels, start=1):
        entries.append(
          build_entry(
              entry_id=f'nanbyo_disease_{index:03d}',
              raw_label=label,
              label_kind='disease_label',
              normalization_scope='icd_candidate',
              icd_lookup_priority='high',
              source_dataset_ids=['nanbyo_survey_4000'],
              source_fields=sorted(disease_fields),
              notes=[
                  'Disease label candidate from rare-disease respondent survey.',
                  'Should later be mapped to ICD code with human review.',
              ],
          )
        )

    return entries


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    entries = collect_employment_entries() + collect_nanbyo_entries()
    payload = {
        'version': 'v0',
        'generated_at': iso_now(),
        'purpose': 'Seed dictionary for health-condition normalization prior to ICD indexing.',
        'principles': [
            'ICD is used for normalization and indexing, not as the main support logic.',
            'Broad disability groups stay separate from disease-label candidates.',
            'Administrative or legal status stays separate from disease labels.',
            'All entries require later human review before final ICD assignment.',
        ],
        'source_datasets': ['employment_survey_3000', 'nanbyo_survey_4000'],
        'entry_count': len(entries),
        'entries': entries,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'generated_at': iso_now(), 'output': str(OUTPUT_PATH.relative_to(REPO_ROOT)), 'entry_count': len(entries)}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
