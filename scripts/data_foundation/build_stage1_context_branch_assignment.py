#!/usr/bin/env python3
"""Assign all available Stage 1 records/units to LLM-derived context branches."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
BASE_DIR = ROOT / "references/derived/scima-fchma/stage1-context-reading-v0-2026-05-14"
LIBRARY_JSON = BASE_DIR / "stage1-llm-context-branch-library-v0-2026-05-14.json"
OUT_JSON = BASE_DIR / "stage1-context-branch-assignment-v0-2026-05-14.json"
OUT_MD = BASE_DIR / "stage1-context-branch-assignment-v0-2026-05-14.md"

CASE_FILES = {
    "nanbyo_survey_4000": ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    "employment_survey_3000": ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
}

REDACTED_UNIT_FILES = {
    "nanbyo_survey_4000": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
    "employment_survey_3000": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    "supporter_practice_nanbyo": ROOT / "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl",
    "supporter_practice_toku18": ROOT / "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl",
    "nanbyo_workplace_2022_2023": ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl",
    "nanbyo_workplace_2022_2023_web_raw0324": ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/free_text_units.redacted.jsonl",
}

BRANCH_KEYWORDS: dict[str, tuple[str, ...]] = {
    "S-01A": ("人員不足", "接客", "販売", "シフト", "短時間", "勤務時間", "休憩", "仕事量", "現場", "体調の悪い", "フルタイム"),
    "S-01B": ("通勤", "在宅", "テレワーク", "姿勢", "座位", "感染", "短時間", "勤務場所", "応募", "面接", "勤務条件"),
    "S-01C": ("昇進", "報酬", "賃金", "キャリア", "技能", "責任", "安定", "処遇", "正社員", "雇用条件"),
    "S-01D": ("どれくらい", "何時間", "働ける", "説明", "実際", "体調変動", "疲労", "面接", "回答に困る", "予測"),
    "S-02A": ("体調変動", "日内", "疲労", "見た目", "伝わりにくい", "キャンセル", "理解", "忘れ", "見通し"),
    "S-02B": ("通院", "治療", "入院", "手術", "有給", "休暇", "採用後", "復帰", "休職", "休み"),
    "S-02C": ("感染", "免疫", "外見", "視線", "接客", "対人", "髪", "ウィッグ", "ストレス", "人混み"),
    "S-03A": ("収入", "医療費", "入院費", "生活費", "傷病手当", "非正規", "扶養", "生活保護", "年金", "家計"),
    "S-03B": ("相談", "窓口", "担当では", "分からない", "雇用保険", "自営", "制度対象", "保健所", "どこに相談"),
    "S-03C": ("障害者雇用", "手帳", "最低賃金", "年金", "賃金", "生活自立", "自立", "短時間", "非正規"),
    "S-04A": ("職場文脈", "記述回答ラベルなし", "就労できない", "非就労", "収入のある仕事", "身体状況", "職にはつけなかった"),
    "S-04B": ("歩行", "通勤", "座位", "姿勢", "職業訓練", "送迎", "訓練施設", "移動", "階段", "長時間"),
    "S-04C": ("正社員", "フルタイム", "登用", "キャリア", "昇進", "報酬", "処遇", "雇用形態"),
    "S-05A": ("応募", "面接", "何時間", "どれくらい", "説明", "働ける", "体調", "不採用", "伝える"),
    "S-05B": ("手帳", "障害者雇用", "雇用率", "面接会", "トライアル", "制度ステータス", "障害者枠", "難病"),
    "S-05C": ("職業訓練", "実習", "見学", "移動", "姿勢", "面接", "通院", "訓練", "求人応募"),
    "S-06A": ("地域支援者", "バックアップ", "体制整備", "二次支援", "地域", "支援機関", "連携", "役割"),
    "S-06B": ("相談先", "相談", "担当では", "分からない", "役に立", "聞いて", "ハローワーク", "窓口", "不信"),
    "S-06C": ("専門性", "独自性", "共通性", "品質", "支援技術", "支援メニュー", "地域資源", "バランス"),
    "S-07A": ("意思疎通", "情報共有", "会議", "指示", "通訳", "筆談", "評価", "昇進", "仕事配分"),
    "S-07B": ("読む", "書く", "判断", "注意集中", "マニュアル", "OJT", "補助", "納期", "責任範囲"),
    "S-07C": ("情報保障", "コミュニケーション", "意見", "評価", "役割", "キャリア", "参加", "処遇"),
    "S-08A": ("生活リズム", "体力", "日中活動", "家族支援", "地域生活", "活動参加", "生活支援"),
    "S-08B": ("機能障害", "職場文脈", "記述回答ラベルなし", "就労経験", "就労できない", "生活動作", "非就労"),
    "S-08C": ("低報酬", "作業所", "訓練", "地域活動", "日中活動", "一般就労", "参加段階", "収入"),
    "S-09A": ("産業医", "把握", "本人申告", "配置転換", "全社", "局所", "雇用管理", "安全", "難病理解"),
    "S-09B": ("代弁", "翻訳", "面接", "実習", "企業側", "支援センター", "担当者", "企業と私の間", "同席"),
    "S-09C": ("特別枠", "全従業員", "健康管理", "メンタルヘルス", "一般雇用管理", "病気をかかえる", "雇用管理"),
    "S-10A": ("休職", "復職", "籍", "入院治療", "休職期間", "継続", "職場復帰", "仕事先"),
    "S-10B": ("昇進", "報酬", "安定", "尊厳", "処遇", "正社員", "雇用条件", "キャリア", "参加の質"),
    "S-10C": ("復職支援", "再就職支援", "地域連携", "バックアップ", "地域支援", "センターの役割", "体制整備"),
}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    if not path.exists():
        return rows
    with path.open("r", encoding="utf-8") as src:
        for line in src:
            if line.strip():
                rows.append(json.loads(line))
    return rows


def canonical_source_id(dataset_id: str, raw_id: Any) -> str:
    text = str(raw_id or "unknown")
    if text.startswith(f"{dataset_id}:"):
        return text
    if dataset_id in {"nanbyo_survey_4000", "employment_survey_3000"} and text.isdigit():
        text = text.zfill(5)
    return f"{dataset_id}:{text}"


def norm(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return " ".join(norm(item) for item in value)
    if isinstance(value, dict):
        return " ".join(norm(v) for v in value.values())
    return str(value)


def source_family(dataset_id: str) -> str:
    if dataset_id in {"nanbyo_survey_4000", "employment_survey_3000"}:
        return "respondent_survey"
    if dataset_id.startswith("supporter_practice"):
        return "supporter_practice"
    if dataset_id.startswith("nanbyo_workplace"):
        return "workplace_survey"
    return dataset_id


def collect_records() -> dict[str, dict[str, Any]]:
    records: dict[str, dict[str, Any]] = {}
    for dataset_id, path in CASE_FILES.items():
        for row in read_jsonl(path):
            source_id = canonical_source_id(dataset_id, row.get("record_id"))
            text = " ".join(
                norm(row.get(field))
                for field in [
                    "pattern_cell_id",
                    "status_group",
                    "work_status_label",
                    "body_function_signals",
                    "impairment_signals",
                    "accommodations_needed_absent",
                    "accommodations_present",
                    "post_employment_unresolved",
                    "job_search_unresolved",
                    "pre_employment_unresolved",
                    "low_work_confidence",
                    "narrative_context_labels",
                    "uncertainty_flags",
                ]
            )
            records[source_id] = {
                "source_id": source_id,
                "source_dataset": dataset_id,
                "source_family": source_family(dataset_id),
                "text": text,
            }

    grouped_units: dict[str, list[str]] = defaultdict(list)
    unit_meta: dict[str, tuple[str, str]] = {}
    for dataset_id, path in REDACTED_UNIT_FILES.items():
        for row in read_jsonl(path):
            raw_id = row.get("respondent_id") or row.get("row_ref")
            source_id = canonical_source_id(dataset_id, raw_id)
            unit_text = norm(row.get("redacted_unit_text"))
            grouped_units[source_id].append(unit_text)
            unit_meta[source_id] = (dataset_id, source_family(dataset_id))

    for source_id, text_parts in grouped_units.items():
        dataset_id, family = unit_meta[source_id]
        if source_id in records:
            records[source_id]["text"] += " " + " ".join(text_parts)
        else:
            records[source_id] = {
                "source_id": source_id,
                "source_dataset": dataset_id,
                "source_family": family,
                "text": " ".join(text_parts),
            }
    return records


def compile_patterns() -> dict[str, re.Pattern[str]]:
    return {
        branch_id: re.compile("|".join(re.escape(word) for word in words))
        for branch_id, words in BRANCH_KEYWORDS.items()
    }


def score_record(pattern: re.Pattern[str], text: str) -> tuple[int, int]:
    hits = pattern.findall(text)
    unique = len(set(hits))
    return len(hits) + unique * 3, unique


def assign_records(records: dict[str, dict[str, Any]], library: dict[str, Any]) -> list[dict[str, Any]]:
    patterns = compile_patterns()
    library_by_id = {
        branch["context_branch_id"]: branch
        for branch in library["context_branches"]
    }
    branch_hits: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records.values():
        text = record["text"]
        for branch_id, pattern in patterns.items():
            score, unique = score_record(pattern, text)
            if record["source_family"] == "respondent_survey":
                threshold = 18
                min_unique = 3
            else:
                threshold = 8
                min_unique = 2
            if score < threshold or unique < min_unique:
                continue
            branch_hits[branch_id].append({
                "source_id": record["source_id"],
                "source_dataset": record["source_dataset"],
                "source_family": record["source_family"],
                "score": score,
                "unique_keyword_hits": unique,
            })

    results: list[dict[str, Any]] = []
    all_ids = set(records)
    for branch_id in sorted(library_by_id):
        hits = sorted(branch_hits.get(branch_id, []), key=lambda row: (-row["score"], row["source_id"]))
        source_counts = Counter(row["source_family"] for row in hits)
        dataset_counts = Counter(row["source_dataset"] for row in hits)
        hit_ids = list(dict.fromkeys(row["source_id"] for row in hits))
        boundary = [
            row["source_id"]
            for row in sorted(hits, key=lambda row: (row["score"], row["source_id"]))
        ][:8]
        contrast = sorted(all_ids - set(hit_ids))[:8]
        lib = library_by_id[branch_id]
        results.append({
            "context_branch_id": branch_id,
            "root_branch_id": lib["root_branch_id"],
            "title": lib["title"],
            "status": "machine_generated_unreviewed_no_promotion",
            "raw_or_redacted_text_included": False,
            "assignment_count": len(hit_ids),
            "source_family_counts": dict(sorted(source_counts.items())),
            "dataset_counts": dict(sorted(dataset_counts.items())),
            "representative_ids": hit_ids[:12],
            "boundary_ids": boundary,
            "contrast_ids": contrast,
            "candidate_interaction": lib["candidate_interaction"],
            "counter_interaction": lib["counter_interaction"],
        })
    return results


def write_markdown(results: list[dict[str, Any]]) -> None:
    lines = [
        "# Stage 1 SCIMA/FCHMA 文脈枝 全件展開 v0",
        "",
        "日付: 2026-05-14",
        "状態: 機械生成・未レビュー・昇格なし",
        "本文引用: なし",
        "",
        "LLMで作った31の文脈枝を、伏字化済み記述回答・ケース解釈・支援者記述・職場調査へ全件展開した作業出力。これはレビュー済み知識ではなく、第一段階の専門知識ネットワーク候補を実際に使える形へ近づけるための枝別インデックスである。",
        "",
        "## 全体表",
        "",
        "| 文脈枝 | 名称 | 割当ID数 | 主なソース | 代表ID |",
        "|---|---|---:|---|---|",
    ]
    for row in results:
        sources = ", ".join(f"{k}:{v}" for k, v in row["source_family_counts"].items()) or "なし"
        reps = ", ".join(f"`{item}`" for item in row["representative_ids"][:3]) or "なし"
        lines.append(f"| {row['context_branch_id']} | {row['title']} | {row['assignment_count']} | {sources} | {reps} |")

    lines.extend(["", "## 枝別インデックス", ""])
    for row in results:
        lines.extend([
            f"### {row['context_branch_id']} {row['title']}",
            "",
            f"割当ID数: {row['assignment_count']}",
            f"候補命題: {row['candidate_interaction']}",
            f"反対命題: {row['counter_interaction']}",
            f"代表ID: {', '.join(f'`{item}`' for item in row['representative_ids']) or 'なし'}",
            f"境界ID: {', '.join(f'`{item}`' for item in row['boundary_ids']) or 'なし'}",
            f"対照ID: {', '.join(f'`{item}`' for item in row['contrast_ids']) or 'なし'}",
            "",
        ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    library = json.loads(LIBRARY_JSON.read_text(encoding="utf-8"))
    records = collect_records()
    results = assign_records(records, library)
    OUT_JSON.write_text(json.dumps({
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "source_record_count": len(records),
        "context_branch_count": len(results),
        "branch_assignments": results,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(results)
    print(json.dumps({
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "source_record_count": len(records),
        "context_branch_count": len(results),
        "nonempty_context_branches": sum(1 for row in results if row["assignment_count"]),
        "top_assignments": [
            {
                "context_branch_id": row["context_branch_id"],
                "assignment_count": row["assignment_count"],
            }
            for row in sorted(results, key=lambda item: item["assignment_count"], reverse=True)[:10]
        ],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
