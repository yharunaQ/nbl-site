from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = REPO_ROOT / "data" / "original_secure" / "structured"
SPECS_ROOT = REPO_ROOT / "data" / "specs"


@dataclass(frozen=True)
class SourceConfig:
    source_id: str
    dataset_id: str
    source_role: str
    source_type: str
    relative_path: str
    row_unit: str | None
    population: str | None
    notes: str
    source_files: list[str]
    guide_files: list[str]


WORKBOOK_SOURCES = [
    SourceConfig(
        source_id="employment_survey_3000_workbook",
        dataset_id="employment_survey_3000",
        source_role="case_structure_source",
        source_type="xlsx_workbook",
        relative_path="employment_survey_3000/disability_employment.xlsx",
        row_unit="respondent",
        population="cross-disability respondent survey",
        notes="Cross-disability employment survey with structured items and multiple free-text columns.",
        source_files=["employment_survey_3000/disability_employment.xlsx"],
        guide_files=[],
    ),
    SourceConfig(
        source_id="nanbyo_survey_4000_workbook",
        dataset_id="nanbyo_survey_4000",
        source_role="case_structure_source",
        source_type="xlsx_workbook",
        relative_path="nanbyo_survey_4000/Nanbyo_kanja.xlsx",
        row_unit="respondent",
        population="rare disease respondent survey",
        notes="Rare disease respondent survey with disease labels, disclosure, support use, and multiple free-text fields.",
        source_files=["nanbyo_survey_4000/Nanbyo_kanja.xlsx"],
        guide_files=[],
    ),
    SourceConfig(
        source_id="nanbyo_supporters_workbook",
        dataset_id="supporter_practice_nanbyo",
        source_role="support_practice_source",
        source_type="xlsx_workbook",
        relative_path="supporter_practice/Nanbyo_Supporters.xlsx",
        row_unit="supporter_respondent",
        population="rare disease supporter survey",
        notes="Supporter-side survey focused on rare disease employment support practices and beliefs.",
        source_files=["supporter_practice/Nanbyo_Supporters.xlsx"],
        guide_files=[],
    ),
    SourceConfig(
        source_id="toku18_supporters_workbook",
        dataset_id="supporter_practice_toku18",
        source_role="support_practice_source",
        source_type="xlsx_workbook",
        relative_path="supporter_practice/toku18_Supporters.xlsx",
        row_unit="supporter_respondent",
        population="cross-institution supporter survey",
        notes="Supporter-side survey with collaboration, philosophy, support implementation, and free-text narratives.",
        source_files=["supporter_practice/toku18_Supporters.xlsx"],
        guide_files=["supporter_practice/toku18_supporters_structure.pdf"],
    ),
]


NON_WORKBOOK_SOURCES = [
    SourceConfig(
        source_id="toku18_supporters_structure_note",
        dataset_id="supporter_practice_toku18",
        source_role="reviewed_pattern_memo",
        source_type="pdf_structure_note",
        relative_path="supporter_practice/toku18_supporters_structure.pdf",
        row_unit=None,
        population=None,
        notes="Original analytic structure note for toku18 supporter survey. Use as a schema interpretation guide.",
        source_files=["supporter_practice/toku18_supporters_structure.pdf"],
        guide_files=[],
    ),
    SourceConfig(
        source_id="supporter_linkage_points_memo",
        dataset_id="supporter_practice_workshop_patterns",
        source_role="reviewed_pattern_memo",
        source_type="markdown_analysis",
        relative_path="supporter_practice/【分析】障害者就労支援_連携ポイント整理.md",
        row_unit=None,
        population=None,
        notes="Workshop synthesis of linkage success/failure patterns across disability employment support.",
        source_files=["supporter_practice/【分析】障害者就労支援_連携ポイント整理.md"],
        guide_files=[],
    ),
    SourceConfig(
        source_id="nanbyo_interaction_patterns_memo",
        dataset_id="supporter_practice_workshop_patterns",
        source_role="reviewed_pattern_memo",
        source_type="markdown_analysis",
        relative_path="supporter_practice/難病就労支援_相互作用パターン分析と連携設計.md",
        row_unit=None,
        population=None,
        notes="Workshop synthesis of rare disease employment support interaction patterns and coordination design.",
        source_files=["supporter_practice/難病就労支援_相互作用パターン分析と連携設計.md"],
        guide_files=[],
    ),
]


DERIVED_EXISTING_HINTS = (
    "集計用",
    "暫定",
    "分類名",
    "機関職種集計用",
)
FREE_TEXT_HINTS = ("記述", "自由", "具体", "理由", "意見", "要望")
COMPOSITE_HINTS = (
    "必要だが",
    "不必要",
    "役に立った",
    "役に立たなかった",
    "知らなかった",
    "解決済",
    "未解決",
    "説明したいができない",
    "説明の必要無",
    "整備有",
    "整備無",
    "利用したことはないが必要",
)
ORDINAL_HINTS = (
    "全く",
    "ほとんど",
    "どちらとも",
    "比較的多い",
    "日常的",
    "満足",
    "不満足",
    "理想的",
    "その通り",
    "重要",
    "関り",
    "やりがい",
    "主な情報源",
    "補助的",
    "今後、利用したい",
    "意識している",
)
COUNT_HINTS = ("人数", "件数", "対象者数")
NUMERIC_SCALAR_HINTS = ("年齢",)
NOMINAL_HINTS = ("性別", "都道府県", "所在地", "所属機関", "専門分野", "機関職種")


def ensure_dirs() -> None:
    for rel in [
        "source-manifests",
        "response-type-maps",
        "canonical-maps",
        "supporter-patterns",
    ]:
        (SPECS_ROOT / rel).mkdir(parents=True, exist_ok=True)


def iso_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def first_present(columns: list[str], candidates: list[str]) -> str | None:
    for candidate in candidates:
        if candidate in columns:
            return candidate
    return None


def safe_text(value: Any) -> str:
    if pd.isna(value):
        return ""
    return str(value).strip()


def split_labels(label_text: str) -> list[str]:
    if not label_text:
        return []
    parts = [part.strip() for part in label_text.split(";")]
    return [part for part in parts if part and part != "-"]


def classify_response_type(
    raw_name: str,
    display_name: str,
    label_text: str,
    sample_has_plus: bool,
    free_text: bool,
) -> tuple[str, str]:
    combined = f"{raw_name} {display_name} {label_text}"

    if raw_name == "ID" or display_name == "ID":
        return "identifier", "Explicit identifier field."
    if free_text:
        return "free_text", "No coded label set; treat as narrative/free-text source."
    if any(hint in combined for hint in DERIVED_EXISTING_HINTS):
        return "derived_existing", "Existing derived or aggregate coding field."
    if sample_has_plus:
        return "multiselect", "Observed '+' separated values in source data."
    if any(hint in display_name or hint in raw_name for hint in COUNT_HINTS):
        return "count", "Field name suggests count-like quantity."
    if any(hint in display_name or hint in raw_name for hint in NUMERIC_SCALAR_HINTS):
        return "numeric_scalar", "Field name suggests scalar numeric value or band."
    if any(hint in combined for hint in COMPOSITE_HINTS):
        return "composite_state", "Labels combine need/usefulness/resolution/applicability states."
    if any(hint in combined for hint in NOMINAL_HINTS):
        return "nominal", "Field name suggests category rather than order."
    if any(hint in combined for hint in ORDINAL_HINTS):
        return "ordinal", "Labels suggest ordered intensity/frequency/agreement."
    labels = split_labels(label_text)
    if 0 < len(labels) <= 3:
        return "nominal", "Small closed label set without strong ordering evidence."
    if len(labels) >= 4:
        return "ordinal", "Multi-step coded item; defaulting to ordered scale pending review."
    return "nominal", "Fallback classification pending human review."


def workbook_profile(config: SourceConfig) -> tuple[dict[str, Any], dict[str, Any]]:
    path = DATA_ROOT / config.relative_path
    xls = pd.ExcelFile(path)
    data_sheet = xls.sheet_names[0]
    dictionary_sheet = "データ一覧" if "データ一覧" in xls.sheet_names else xls.sheet_names[1]

    df = pd.read_excel(path, sheet_name=data_sheet)
    codebook = pd.read_excel(path, sheet_name=dictionary_sheet)

    codebook_columns = [str(col) for col in codebook.columns]
    raw_name_col = first_present(codebook_columns, ["元の名前", "ID"])
    display_name_col = first_present(codebook_columns, ["表記", "集計表の表記", "調査票での表記"])
    question_col = first_present(codebook_columns, ["設問", "調査票での表記"])
    label_col = first_present(codebook_columns, ["ラベル"])

    free_text_columns: list[str] = []
    variables: list[dict[str, Any]] = []

    for _, row in codebook.iterrows():
        raw_name = safe_text(row.get(raw_name_col)) if raw_name_col else ""
        display_name = safe_text(row.get(display_name_col)) if display_name_col else raw_name
        question_group = safe_text(row.get(question_col)) if question_col else ""
        label_text = safe_text(row.get(label_col)) if label_col else ""

        sample_has_plus = False
        if raw_name and raw_name in df.columns:
            series = df[raw_name].dropna().astype(str)
            sample_has_plus = any("+" in value for value in series.head(200))

        free_text = not label_text and any(hint in f"{raw_name} {display_name} {question_group}" for hint in FREE_TEXT_HINTS)
        if free_text:
            free_text_columns.append(raw_name)

        response_type, reason = classify_response_type(
            raw_name=raw_name,
            display_name=display_name,
            label_text=label_text,
            sample_has_plus=sample_has_plus,
            free_text=free_text,
        )

        variables.append(
            {
                "raw_name": raw_name,
                "display_name": display_name,
                "question_group": question_group,
                "response_type_guess": response_type,
                "guess_reason": reason,
                "label_count": len(split_labels(label_text)),
                "sample_has_plus": sample_has_plus,
                "manual_review_required": True,
            }
        )

    source_manifest = {
        "source_id": config.source_id,
        "dataset_id": config.dataset_id,
        "source_role": config.source_role,
        "source_type": config.source_type,
        "owner": "NBL",
        "sensitivity": "restricted",
        "contains_personal_data": True,
        "contains_free_text": bool(free_text_columns),
        "row_unit": config.row_unit,
        "population": config.population,
        "file_path": config.relative_path,
        "sheet_names": xls.sheet_names,
        "data_sheet": data_sheet,
        "dictionary_sheet": dictionary_sheet,
        "row_count": int(len(df)),
        "column_count": int(len(df.columns)),
        "free_text_columns": free_text_columns,
        "guide_files": config.guide_files,
        "notes": config.notes,
        "generated_at": iso_now(),
    }

    response_type_map = {
        "dataset_id": config.dataset_id,
        "source_id": config.source_id,
        "file_path": config.relative_path,
        "generated_at": iso_now(),
        "taxonomy_version": "v0",
        "response_types": [
            "identifier",
            "nominal",
            "ordinal",
            "multiselect",
            "composite_state",
            "free_text",
            "derived_existing",
            "numeric_scalar",
            "count",
        ],
        "variables": variables,
    }

    return source_manifest, response_type_map


def non_workbook_manifest(config: SourceConfig) -> dict[str, Any]:
    path = DATA_ROOT / config.relative_path
    return {
        "source_id": config.source_id,
        "dataset_id": config.dataset_id,
        "source_role": config.source_role,
        "source_type": config.source_type,
        "owner": "NBL",
        "sensitivity": "restricted",
        "contains_personal_data": False,
        "contains_free_text": True,
        "row_unit": config.row_unit,
        "population": config.population,
        "file_path": config.relative_path,
        "file_size_bytes": path.stat().st_size,
        "guide_files": config.guide_files,
        "notes": config.notes,
        "generated_at": iso_now(),
    }


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    ensure_dirs()

    for config in WORKBOOK_SOURCES:
        source_manifest, response_type_map = workbook_profile(config)
        write_json(
            SPECS_ROOT / "source-manifests" / f"{config.dataset_id}.source-manifest.json",
            source_manifest,
        )
        write_json(
            SPECS_ROOT / "response-type-maps" / f"{config.dataset_id}.response-type-map.json",
            response_type_map,
        )

    for config in NON_WORKBOOK_SOURCES:
        write_json(
            SPECS_ROOT / "source-manifests" / f"{config.source_id}.source-manifest.json",
            non_workbook_manifest(config),
        )


if __name__ == "__main__":
    main()
