#!/usr/bin/env python3
"""Build Stage 1 production source inventory and broad contact candidates.

This is the first production run step after the SCIMA/FCHMA method reset.
It intentionally avoids old pattern cells, old context-branch assignments, and
old candidate propositions. Outputs contain counts, labels, and IDs only; no
raw or redacted narrative text is exported.
"""

from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RUN_ID = "stage1-production-v0-2026-05-18"

RESPONDENT_DATASETS = {
    "nanbyo_survey_4000": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0",
    "employment_survey_3000": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0",
}

REDACTED_UNIT_FILES = {
    "nanbyo_survey_4000": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
    "employment_survey_3000": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    "supporter_practice_nanbyo": ROOT / "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl",
    "supporter_practice_toku18": ROOT / "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl",
    "nanbyo_workplace_2022_2023": ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl",
    "nanbyo_workplace_2022_2023_web_raw0324": ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/free_text_units.redacted.jsonl",
}

DOCUMENT_GLOBS = (
    ("workshop", ROOT / "references/workshops", ("*.md", "*.txt")),
    ("nivr_web_cache", ROOT / "references/web-cache/nivr_publications", ("*.txt", "*.md")),
    ("nivr_rehadat_translation_cache", ROOT / "references/web-cache/nivr_rehadat_japanese_translations", ("*.txt", "*.md")),
    ("trusted_web_cache", ROOT / "references/web-cache", ("*.txt", "*.md")),
)


@dataclass(frozen=True)
class ContactRule:
    contact_id: str
    result_focus: str
    icf_contact: tuple[str, ...]
    freedom_candidates: tuple[str, ...]
    keywords: tuple[str, ...]
    core_keywords: tuple[str, ...]


CONTACT_RULES: tuple[ContactRule, ...] = (
    ContactRule(
        "C-01-health-time-work-design",
        "治療・体調管理と仕事継続",
        ("心身機能", "健康管理時間", "仕事要求", "職場環境", "参加"),
        ("勤務時間", "休暇・欠勤扱い", "休憩", "職務代替", "職場内解釈", "収入保障"),
        ("通院", "治療", "服薬", "入院", "疲労", "体調", "痛み", "勤務時間", "休憩", "有給", "欠勤", "休職", "復職", "収入"),
        ("通院", "治療", "疲労", "体調", "勤務時間", "休憩", "有給", "欠勤", "休職", "復職"),
    ),
    ContactRule(
        "C-02-entry-translation",
        "就職入口での相互翻訳",
        ("参加入口", "説明・開示", "職務適合", "支援接続", "制度"),
        ("本人条件の企業語化", "求人条件の生活語化", "開示範囲", "実習・見学", "支援者同席", "制度ステータス"),
        ("就職", "応募", "面接", "求人", "開示", "説明", "実習", "見学", "トライアル", "障害者雇用", "手帳", "配慮"),
        ("就職", "応募", "面接", "求人", "開示", "説明", "実習", "障害者雇用", "手帳"),
    ),
    ContactRule(
        "C-03-support-access-role-fit",
        "支援入口・役割分担・継続接続",
        ("支援接続", "制度", "環境因子", "個人・生活", "参加"),
        ("相談入口", "役割分担", "支援メニュー適合", "継続接続", "支援品質", "地域資源"),
        ("相談", "支援", "ハローワーク", "センター", "就労移行", "就労支援", "制度", "紹介", "連携", "フォロー", "役に立"),
        ("相談", "支援", "ハローワーク", "センター", "就労支援", "制度", "連携", "フォロー"),
    ),
    ContactRule(
        "C-04-information-participation-quality",
        "情報アクセスと参加の質",
        ("コミュニケーション", "活動", "仕事設計", "職場環境", "参加の質"),
        ("情報形式", "確認可能性", "責任所在", "評価接続", "役割接続", "本人の依頼負荷"),
        ("情報", "指示", "会議", "コミュニケーション", "意思疎通", "通訳", "筆談", "評価", "昇進", "処遇", "キャリア", "仕事配分"),
        ("情報", "指示", "会議", "意思疎通", "通訳", "筆談", "評価", "キャリア", "仕事配分"),
    ),
    ContactRule(
        "C-05-physical-access-worksite",
        "身体操作・移動と職務場所",
        ("心身機能", "活動", "物理環境", "仕事設計", "参加"),
        ("移動経路", "通勤", "姿勢", "作業場所", "設備", "職務代替", "安全確認"),
        ("移動", "通勤", "階段", "車椅子", "立位", "座位", "姿勢", "手指", "上肢", "下肢", "設備", "バリアフリー", "訪問"),
        ("移動", "通勤", "階段", "車椅子", "立位", "座位", "姿勢", "設備"),
    ),
    ContactRule(
        "C-06-life-security-work-choice",
        "生活保障と仕事選択",
        ("個人・生活", "環境因子", "制度接続", "参加", "時間変化"),
        ("収入保障", "医療費", "家計責任", "雇用形態", "制度対象", "休業時保障", "生活再建"),
        ("収入", "賃金", "給料", "生活費", "医療費", "年金", "手当", "生活保障", "非正規", "退職", "家計", "経済", "将来不安"),
        ("収入", "賃金", "生活費", "医療費", "年金", "手当", "非正規", "退職", "経済"),
    ),
    ContactRule(
        "C-07-career-evaluation-role",
        "評価・役割・キャリア参加",
        ("参加", "仕事の質", "評価", "処遇", "時間変化"),
        ("評価基準", "役割拡大", "技能習得", "処遇", "昇進", "働きがい", "定着"),
        ("評価", "昇進", "報酬", "処遇", "キャリア", "技能", "責任", "働きがい", "満足", "定着", "継続", "役割"),
        ("評価", "昇進", "処遇", "キャリア", "技能", "働きがい", "定着", "役割"),
    ),
    ContactRule(
        "C-08-prework-life-readiness",
        "就労入口以前の生活・体力・活動参加",
        ("個人・生活", "活動", "参加準備", "支援接続", "時間変化"),
        ("生活リズム", "体力", "日中活動", "家族支援", "地域生活", "訓練", "就労自信"),
        ("生活リズム", "体力", "日中活動", "自信", "意欲", "地域生活", "家族", "訓練", "作業所", "復帰", "孤立"),
        ("生活リズム", "体力", "日中活動", "自信", "地域生活", "訓練", "復帰"),
    ),
)

DIVERSITY_ANCHOR_RULES: dict[str, tuple[str, ...]] = {
    "visual_information": ("視覚", "見え", "弱視", "全盲", "白杖", "点字"),
    "hearing_information": ("聴覚", "聞こ", "難聴", "ろう", "手話", "補聴", "筆談"),
    "mobility_lower_limb": ("下肢", "歩行", "車椅子", "杖", "階段", "移動", "立位"),
    "upper_limb_hand": ("上肢", "手指", "手が", "腕", "握る", "細かい作業"),
    "cognitive_developmental": ("知的", "発達", "理解", "記憶", "注意", "判断", "手順"),
    "mental_psychological": ("精神", "不安", "うつ", "ストレス", "パニック", "心理"),
    "fatigue_pain_variability": ("疲労", "痛み", "体調変動", "波", "無理", "休憩"),
    "treatment_time_rare_disease": ("難病", "通院", "治療", "服薬", "入院", "再燃", "免疫"),
    "communication_speech": ("言語", "発話", "会話", "コミュニケーション", "意思疎通"),
}

ADJUSTMENT_SIGNAL_RULES: dict[str, tuple[str, ...]] = {
    "gender_or_family_role": ("性別", "男性", "女性", "妊娠", "育児", "介護", "家族"),
    "age_or_life_stage": ("年齢", "年代", "若年", "高齢", "学生", "初職", "復職", "退職"),
    "employment_status": ("就労中", "非就労", "休職", "復職", "離職", "求職", "転職"),
    "employment_form": ("正社員", "非正規", "パート", "アルバイト", "契約", "短時間", "フルタイム"),
    "support_use_status": ("利用", "未利用", "相談", "紹介", "支援", "制度", "手帳"),
}


def read_jsonl(path: Path) -> Iterable[dict[str, Any]]:
    if not path.exists():
        return
    with path.open("r", encoding="utf-8") as src:
        for line in src:
            if line.strip():
                yield json.loads(line)


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


def canonical_source_id(dataset_id: str, raw_id: Any) -> str:
    text = str(raw_id or "unknown")
    if text.startswith(f"{dataset_id}:"):
        return text
    if dataset_id in {"nanbyo_survey_4000", "employment_survey_3000"} and text.isdigit():
        text = text.zfill(5)
    return f"{dataset_id}:{text}"


def source_family(dataset_id: str) -> str:
    if dataset_id in RESPONDENT_DATASETS:
        return "respondent_survey"
    if dataset_id.startswith("supporter_practice"):
        return "supporter_practice"
    if dataset_id.startswith("nanbyo_workplace"):
        return "workplace_survey"
    return dataset_id


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8", newline="") as src:
        return list(csv.DictReader(src))


def collect_structured_texts() -> dict[str, dict[str, Any]]:
    records: dict[str, dict[str, Any]] = {}
    for dataset_id, base in RESPONDENT_DATASETS.items():
        for row in read_csv_rows(base / "structured_features.csv"):
            respondent_id = row.get("respondent_id")
            if not respondent_id:
                continue
            source_id = canonical_source_id(dataset_id, respondent_id)
            record = records.setdefault(source_id, {
                "source_id": source_id,
                "source_dataset": dataset_id,
                "source_family": source_family(dataset_id),
                "text_parts": [],
            })
            # Use selected/value labels, not variable names. Variable names and
            # question labels appear for many respondents and create false
            # contact/adjustment signals.
            record["text_parts"].extend([
                row.get("label_text", ""),
                row.get("raw_value_text", ""),
            ])
    return records


def collect_redacted_texts(records: dict[str, dict[str, Any]]) -> None:
    for dataset_id, path in REDACTED_UNIT_FILES.items():
        for row in read_jsonl(path):
            raw_id = row.get("respondent_id") or row.get("row_ref")
            source_id = canonical_source_id(dataset_id, raw_id)
            record = records.setdefault(source_id, {
                "source_id": source_id,
                "source_dataset": dataset_id,
                "source_family": source_family(dataset_id),
                "text_parts": [],
            })
            # Only the redacted unit text is used for semantic contact
            # extraction. Column/display metadata is useful for provenance, but
            # too broad for production contact discovery.
            record["text_parts"].extend([
                row.get("redacted_unit_text", ""),
            ])


def iter_document_paths() -> Iterable[tuple[str, Path]]:
    seen: set[Path] = set()
    for family, base, patterns in DOCUMENT_GLOBS:
        if not base.exists():
            continue
        for pattern in patterns:
            for path in sorted(base.rglob(pattern)):
                if not path.is_file() or path in seen:
                    continue
                if family == "trusted_web_cache" and ("nivr_publications" in path.parts or "nivr_rehadat_japanese_translations" in path.parts):
                    continue
                seen.add(path)
                yield family, path


def score_rule(rule: ContactRule, text: str) -> tuple[int, int, int]:
    all_hits = [word for word in rule.keywords if word in text]
    core_hits = [word for word in rule.core_keywords if word in text]
    score = len(core_hits) * 5 + len(set(all_hits)) * 2
    return score, len(set(core_hits)), len(set(all_hits))


def detect_named_rules(rules: dict[str, tuple[str, ...]], text: str) -> list[str]:
    found = []
    for rule_id, keywords in rules.items():
        if any(word in text for word in keywords):
            found.append(rule_id)
    return found


def collect_records() -> dict[str, dict[str, Any]]:
    records = collect_structured_texts()
    collect_redacted_texts(records)
    for record in records.values():
        record["text"] = " ".join(norm(part) for part in record.pop("text_parts"))
    return records


def build_source_inventory(records: dict[str, dict[str, Any]]) -> dict[str, Any]:
    structured_counts: dict[str, dict[str, int]] = {}
    for dataset_id, base in RESPONDENT_DATASETS.items():
        structured_rows = read_csv_rows(base / "structured_features.csv")
        structured_counts[dataset_id] = {
            "structured_feature_rows": len(structured_rows),
            "structured_respondent_count": len({row.get("respondent_id", "") for row in structured_rows if row.get("respondent_id")}),
            "codebook_rows": len(read_csv_rows(base / "codebook.csv")),
        }

    redacted_counts = {}
    for dataset_id, path in REDACTED_UNIT_FILES.items():
        rows = list(read_jsonl(path))
        redacted_counts[dataset_id] = {
            "redacted_unit_count": len(rows),
            "redacted_record_count": len({str(row.get("respondent_id") or row.get("row_ref") or "") for row in rows}),
            "exists": path.exists(),
        }

    document_counts = Counter(family for family, _ in iter_document_paths())
    return {
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "structured_sources": structured_counts,
        "redacted_unit_sources": redacted_counts,
        "document_sources": dict(sorted(document_counts.items())),
        "combined_record_count": len(records),
        "source_family_counts": dict(sorted(Counter(row["source_family"] for row in records.values()).items())),
    }


def build_contact_candidates(records: dict[str, dict[str, Any]]) -> dict[str, Any]:
    contacts: list[dict[str, Any]] = []
    for rule in CONTACT_RULES:
        hits: list[dict[str, Any]] = []
        anchor_counts: Counter[str] = Counter()
        adjustment_counts: Counter[str] = Counter()
        for record in records.values():
            text = record["text"]
            score, core_hits, unique_hits = score_rule(rule, text)
            if score < 12 or core_hits < 1 or unique_hits < 3:
                continue
            anchors = detect_named_rules(DIVERSITY_ANCHOR_RULES, text)
            adjustment_signals = detect_named_rules(ADJUSTMENT_SIGNAL_RULES, text)
            anchor_counts.update(anchors)
            adjustment_counts.update(adjustment_signals)
            hits.append({
                "source_id": record["source_id"],
                "source_dataset": record["source_dataset"],
                "source_family": record["source_family"],
                "score": score,
                "core_hits": core_hits,
                "unique_hits": unique_hits,
                "diversity_anchors": anchors[:6],
                "adjustment_signals": adjustment_signals[:6],
            })
        hits.sort(key=lambda row: (-row["score"], row["source_id"]))
        contacts.append({
            "contact_id": rule.contact_id,
            "status": "broad_contact_candidate_not_proposition",
            "result_focus": rule.result_focus,
            "icf_contact": list(rule.icf_contact),
            "freedom_candidates": list(rule.freedom_candidates),
            "hit_count": len(hits),
            "source_family_counts": dict(sorted(Counter(row["source_family"] for row in hits).items())),
            "dataset_counts": dict(sorted(Counter(row["source_dataset"] for row in hits).items())),
            "diversity_anchor_counts": dict(sorted(anchor_counts.items())),
            "adjustment_signal_counts": dict(sorted(adjustment_counts.items())),
            "representative_ids": [row["source_id"] for row in hits[:12]],
            "boundary_ids": [row["source_id"] for row in sorted(hits, key=lambda row: (row["score"], row["source_id"]))[:8]],
            "next_step": "four_placement_search_by_freedom",
        })

    return {
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "contact_candidate_count": len(contacts),
        "contact_candidates": contacts,
    }


def build_document_slots() -> dict[str, Any]:
    slots: list[dict[str, Any]] = []
    for family, path in iter_document_paths():
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        rel = path.relative_to(ROOT).as_posix()
        best: list[dict[str, Any]] = []
        for rule in CONTACT_RULES:
            score, core_hits, unique_hits = score_rule(rule, text)
            if score < 16 or core_hits < 2:
                continue
            best.append({
                "contact_id": rule.contact_id,
                "score": score,
                "core_hits": core_hits,
                "unique_hits": unique_hits,
            })
        if not best:
            continue
        best.sort(key=lambda row: (-row["score"], row["contact_id"]))
        slots.append({
            "source_id": f"{family}:{rel}",
            "source_family": family,
            "status": "fragmentary_source_slot_not_case_placement",
            "matched_contacts": best[:5],
            "slot_use": {
                "freedom_slot": True,
                "missing_axis_slot": True,
                "counter_structure_slot": True,
                "search_condition_slot": True,
            },
            "raw_or_redacted_text_included": False,
        })
    return {
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "fragmentary_source_slot_count": len(slots),
        "source_family_counts": dict(sorted(Counter(row["source_family"] for row in slots).items())),
        "fragmentary_source_slots": slots,
    }


def write_markdown(inventory: dict[str, Any], contacts: dict[str, Any], slots: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Source Inventory + Broad Contact Extraction v0",
        "",
        "Date: 2026-05-18",
        "Status: machine-generated / unreviewed / no promotion",
        "本文引用: なし",
        "",
        "## 入力インベントリ",
        "",
        f"統合ID数: {inventory['combined_record_count']}",
        "",
        "### 構造化データ",
        "",
        "| dataset | respondent | rows | codebook |",
        "|---|---:|---:|---:|",
    ]
    for dataset_id, row in inventory["structured_sources"].items():
        lines.append(
            f"| {dataset_id} | {row['structured_respondent_count']} | {row['structured_feature_rows']} | {row['codebook_rows']} |"
        )
    lines.extend(["", "### 非識別化記述単位", "", "| dataset | records | units |", "|---|---:|---:|"])
    for dataset_id, row in inventory["redacted_unit_sources"].items():
        lines.append(f"| {dataset_id} | {row['redacted_record_count']} | {row['redacted_unit_count']} |")
    lines.extend(["", "### 断片資料", "", "| family | files |", "|---|---:|"])
    for family, count in inventory["document_sources"].items():
        lines.append(f"| {family} | {count} |")

    lines.extend(["", "## Broad Contact Candidates", "", "| contact | focus | hits | top anchors | top adjustment |", "|---|---|---:|---|---|"])
    for item in contacts["contact_candidates"]:
        anchors = ", ".join(f"{key}:{value}" for key, value in sorted(item["diversity_anchor_counts"].items(), key=lambda kv: (-kv[1], kv[0]))[:4]) or "なし"
        adjustments = ", ".join(f"{key}:{value}" for key, value in sorted(item["adjustment_signal_counts"].items(), key=lambda kv: (-kv[1], kv[0]))[:4]) or "なし"
        lines.append(f"| {item['contact_id']} | {item['result_focus']} | {item['hit_count']} | {anchors} | {adjustments} |")

    lines.extend(["", "## Contact Detail", ""])
    for item in contacts["contact_candidates"]:
        lines.extend([
            f"### {item['contact_id']} {item['result_focus']}",
            "",
            f"ICF接触点: {'、'.join(item['icf_contact'])}",
            f"自由度候補: {'、'.join(item['freedom_candidates'])}",
            f"hit_count: {item['hit_count']}",
            f"代表ID: {', '.join(f'`{rid}`' for rid in item['representative_ids'][:8]) or 'なし'}",
            f"境界ID: {', '.join(f'`{rid}`' for rid in item['boundary_ids'][:6]) or 'なし'}",
            "",
        ])

    lines.extend([
        "## Fragmentary Source Slots",
        "",
        f"slot source count: {slots['fragmentary_source_slot_count']}",
        "",
        "| family | count |",
        "|---|---:|",
    ])
    for family, count in slots["source_family_counts"].items():
        lines.append(f"| {family} | {count} |")

    lines.extend([
        "",
        "## 次の処理",
        "",
        "この出力は候補命題ではない。次は、各contactのfreedom_candidatesごとに問題側・軽減側・残余側・境界側を別探索する。",
    ])
    (RUN_DIR / "stage1-production-source-inventory-and-contact-candidates-v0-2026-05-18.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    records = collect_records()
    inventory = build_source_inventory(records)
    contacts = build_contact_candidates(records)
    slots = build_document_slots()

    (RUN_DIR / "stage1-production-source-inventory-v0-2026-05-18.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (RUN_DIR / "stage1-production-contact-candidates-v0-2026-05-18.json").write_text(json.dumps(contacts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (RUN_DIR / "stage1-production-fragmentary-source-slots-v0-2026-05-18.json").write_text(json.dumps(slots, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(inventory, contacts, slots)

    print(json.dumps({
        "run_dir": str(RUN_DIR.relative_to(ROOT)),
        "combined_record_count": inventory["combined_record_count"],
        "contact_candidate_count": contacts["contact_candidate_count"],
        "fragmentary_source_slot_count": slots["fragmentary_source_slot_count"],
        "contact_hits": {
            item["contact_id"]: item["hit_count"]
            for item in contacts["contact_candidates"]
        },
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
