#!/usr/bin/env python3
"""Build Stage 1 SCIMA/FCHMA branch evidence across local source families.

This is a production extraction step, not an approval or promotion step. It
uses local preprocessing to select LLM-worthy context branches and exports only
counts, labels, and source IDs.
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-context-reading-v0-2026-05-14"
RUN_ID = "stage1-production-branch-evidence-v0-2026-05-14"


@dataclass(frozen=True)
class Branch:
    branch_id: str
    title: str
    icf_lenses: tuple[str, ...]
    keywords: tuple[str, ...]
    core_keywords: tuple[str, ...]
    candidate_interaction: str
    counter_interaction: str


BRANCHES: tuple[Branch, ...] = (
    Branch(
        "S-01",
        "現職高負荷・仕事設計未接続",
        ("心身機能", "活動", "参加", "仕事設計", "職場環境", "健康管理時間"),
        ("勤務時間", "休憩", "配置", "職務", "仕事内容", "仕事量", "通勤", "職場理解", "体調", "疲労", "痛み", "治療", "通院", "配慮", "合理的配慮"),
        ("勤務時間", "休憩", "配置", "仕事量", "職場理解", "体調", "疲労", "痛み", "通院", "合理的配慮"),
        "就労継続中でも、心身機能・健康管理時間・生活条件が仕事量、配置、休憩、職場理解に翻訳されず、配慮の有無だけでは説明できない仕事設計未接続として現れる可能性。",
        "主因は仕事設計ではなく、生活保障、制度入口、説明戦略、支援接続、または一時的な治療・復帰局面かもしれない。",
    ),
    Branch(
        "S-02",
        "感染・通勤・症状タイミングの職場翻訳",
        ("心身機能", "環境因子", "仕事条件", "説明・開示", "参加条件"),
        ("感染", "免疫", "通勤", "発熱", "時間帯", "曜日", "人混み", "在宅", "リモート", "テレワーク", "症状悪化", "透析"),
        ("感染", "免疫", "通勤", "発熱", "在宅", "テレワーク", "症状"),
        "感染リスク、通勤、症状の時間変動が、勤務条件や環境調整だけでなく、職場にどう説明され運用されるかという翻訳問題として現れる可能性。",
        "主因は職場翻訳ではなく、地域交通、家庭条件、医学的制約、制度・支援情報不足かもしれない。",
    ),
    Branch(
        "S-03",
        "生活保障・制度不安が仕事調整を上書きする",
        ("個人・生活", "環境因子", "制度接続", "参加", "時間変化"),
        ("生活費", "医療費", "収入", "賃金", "手当", "年金", "生活保障", "非正規", "退職", "生活", "家族", "将来不安", "経済"),
        ("生活費", "医療費", "収入", "賃金", "年金", "生活保障", "非正規", "退職", "将来不安", "経済"),
        "仕事を続ける、減らす、休む、辞めるという選択が、身体負荷だけでなく生活費、制度ステータス、家族責任、将来不安に強く制約される可能性。",
        "制度・生活保障ではなく、職務内容、配置、職場理解、処遇、治療負荷、過去離職経験が中心かもしれない。",
    ),
    Branch(
        "S-04",
        "身体操作・物理アクセスと職務場所の相互作用",
        ("心身機能", "活動", "物理環境", "仕事設計", "参加"),
        ("移動", "階段", "車椅子", "立位", "座位", "手指", "上肢", "下肢", "姿勢", "作業姿勢", "身体", "訪問", "バリアフリー", "物理"),
        ("移動", "階段", "車椅子", "立位", "座位", "手指", "身体", "物理"),
        "身体操作や移動の困難が、単独の機能障害ではなく、職務場所、姿勢、訪問先、通勤、業務変更可能性との相互作用として現れる可能性。",
        "主因は物理アクセスではなく、勤務時間、治療管理、生活動作支援、復職過程、または職場理解かもしれない。",
    ),
    Branch(
        "S-05",
        "就職入口・説明戦略・制度ステータス",
        ("参加入口", "説明・開示", "支援接続", "職務適合", "制度"),
        ("就職活動", "応募", "面接", "開示", "非開示", "説明", "求人", "実習", "トライアル", "障害者雇用", "手帳", "制度ステータス"),
        ("就職", "応募", "面接", "開示", "求人", "実習", "手帳", "障害者雇用"),
        "就職入口で、本人の強み・必要条件・説明内容・求人条件・支援機関接続が企業側に翻訳されず、入口摩擦として現れる可能性。",
        "入口摩擦ではなく、療養優先、就労希望の未形成、職務経験機会、地域求人条件、生活再建が中心かもしれない。",
    ),
    Branch(
        "S-06",
        "支援アクセス・支援メニュー不適合",
        ("支援接続", "制度", "環境因子", "個人・生活", "参加"),
        ("支援", "相談", "ハローワーク", "センター", "就労移行", "就労支援", "制度", "利用", "紹介", "フォロー", "連携", "役に立た"),
        ("ハローワーク", "センター", "就労移行", "就労支援", "紹介", "フォロー", "連携", "役に立た", "支援機関"),
        "支援制度や相談先が存在していても、本人の生活段階、地域条件、就労課題、障害・疾病特性に合う形で届かない可能性。",
        "支援不適合ではなく、利用前、対象外、情報探索中、期待差、地域資源不足、本人の優先順位の違いが混在しているかもしれない。",
    ),
    Branch(
        "S-07",
        "情報アクセス・職務配分・評価参加",
        ("コミュニケーション", "活動", "仕事設計", "職場環境", "参加の質"),
        ("情報共有", "指示", "会議", "コミュニケーション", "意思疎通", "通訳", "筆談", "評価", "昇進", "処遇", "キャリア", "仕事配分", "割り振り"),
        ("情報共有", "指示", "会議", "意思疎通", "通訳", "筆談", "評価", "昇進", "処遇", "キャリア", "仕事配分"),
        "情報アクセスや意思疎通が、会話の困難にとどまらず、職務配分、評価、処遇、キャリア形成への参加を左右する可能性。",
        "主因は情報アクセスではなく、職務設計、評価制度、管理者との関係、相談先不在、本人の生活段階かもしれない。",
    ),
    Branch(
        "S-08",
        "就労入口以前の生活・体力・活動参加",
        ("個人・生活", "活動", "参加準備", "支援接続", "時間変化"),
        ("生活リズム", "体力", "日中活動", "就労自信", "自信", "復帰", "低報酬", "作業所", "地域生活", "家族支援", "訓練"),
        ("生活リズム", "体力", "就労自信", "復帰", "日中活動", "訓練", "地域生活", "家族支援"),
        "主問題が職場内配慮ではなく、生活リズム、体力、日中活動、家族支援、地域生活、復帰可能性にある可能性。",
        "入口以前の生活課題ではなく、求人条件、職務設計、説明機会、支援機関の翻訳不足が中心かもしれない。",
    ),
    Branch(
        "S-09",
        "事業所側の理解・実装能力・連携",
        ("職場環境", "組織", "支援接続", "制度実装", "参加"),
        ("企業", "事業所", "雇用管理", "職場定着", "理解促進", "管理者", "担当者", "産業医", "衛生", "制度導入", "支援機関との連携", "両立支援"),
        ("雇用管理", "職場定着", "理解促進", "管理者", "担当者", "産業医", "支援機関との連携", "両立支援"),
        "企業・事業所側の理解、雇用管理、産業保健、支援機関連携の実装度が、本人側の希望や配慮要望の実現可能性を左右する可能性。",
        "企業側実装ではなく、制度要件、地域支援資源、職務特性、本人の説明機会、調査設問の粒度が主因かもしれない。",
    ),
    Branch(
        "S-10",
        "参加の質・定着・復職後の意味づけ",
        ("参加", "時間変化", "仕事の質", "生活", "環境因子"),
        ("満足", "働きがい", "社会参加", "参加", "継続", "定着", "離職", "休職", "復職", "生活の質", "本人希望", "やりがい"),
        ("満足", "働きがい", "継続", "定着", "離職", "休職", "復職", "生活の質"),
        "就労の有無だけでなく、定着、復職後の役割、働きがい、評価、生活の質が、支援や仕事設計の成果として問われる可能性。",
        "参加の質ではなく、短期的な就職入口、医療・生活条件、制度接続、または調査時点の一時状態が中心かもしれない。",
    ),
)


CASE_FILES = {
    "nanbyo_survey_4000": ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    "employment_survey_3000": ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
}

REDACTED_UNIT_FILES = {
    "nanbyo_survey_4000_units": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
    "employment_survey_3000_units": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    "supporter_practice_nanbyo": ROOT / "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl",
    "supporter_practice_toku18": ROOT / "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl",
    "nanbyo_workplace_2022_2023": ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl",
    "nanbyo_workplace_2022_2023_web_raw0324": ROOT / "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/free_text_units.redacted.jsonl",
}

DOCUMENT_GLOBS = (
    ("workshop", ROOT / "references/workshops", "*.md"),
    ("nivr_web_cache", ROOT / "references/web-cache/nivr_publications", "*.txt"),
    ("nivr_rehadat_translation_cache", ROOT / "references/web-cache/nivr_rehadat_japanese_translations", "*.txt"),
    ("external_web_cache", ROOT / "references/web-cache", "*/*.txt"),
)

PATTERN_CELL_TO_BRANCHES: dict[str, tuple[str, ...]] = {
    "RC-02B-working-partial-accommodation-gap": ("S-01",),
    "RC-02A-working-function-workdesign-underalignment": ("S-01",),
    "EC-02B-current-work-partial-environment-disclosure-gap": ("S-01", "S-07"),
    "EC-02A-current-work-broad-task-accommodation-underalignment": ("S-01",),
    "RC-06-treatment-time-management-friction": ("S-02",),
    "RC-07-non-work-orientation-boundary": ("S-03", "S-08"),
    "RC-10A-transition-with-carried-work-difficulty": ("S-03",),
    "EC-10A-past-work-difficulty-carryover": ("S-03", "S-10"),
    "RC-04-high-function-burden-low-work-context": ("S-03", "S-08"),
    "EC-04-high-impairment-low-work-context": ("S-04", "S-08"),
    "RC-10B-job-search-disclosure-support-friction": ("S-05",),
    "EC-10B-entry-disclosure-support-friction": ("S-05",),
    "RC-05-support-need-access-mismatch": ("S-06",),
    "EC-05-support-access-service-fit-mismatch": ("S-06",),
    "EC-03-current-work-satisfaction-treatment-mismatch": ("S-07", "S-10"),
    "EC-08-narrative-context-low-structured-signal": ("S-07", "S-08"),
    "EC-07-low-work-confidence-boundary": ("S-08",),
}

BRANCH_BY_ID = {branch.branch_id: branch for branch in BRANCHES}


def read_jsonl(path: Path) -> Iterable[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as src:
        for line in src:
            if line.strip():
                yield json.loads(line)


def canonical_source_id(dataset_id: str, raw_id: Any) -> str:
    text = str(raw_id or "unknown")
    if text.startswith(f"{dataset_id}:"):
        return text
    if dataset_id in {"nanbyo_survey_4000", "employment_survey_3000"} and text.isdigit():
        text = text.zfill(5)
    return f"{dataset_id}:{text}"


def norm_text(value: Any) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return " ".join(norm_text(item) for item in value)
    if isinstance(value, dict):
        return " ".join(f"{k} {norm_text(v)}" for k, v in value.items())
    if value is None:
        return ""
    return str(value)


def compile_keywords(branch: Branch) -> tuple[re.Pattern[str], re.Pattern[str]]:
    escaped = [re.escape(item) for item in branch.keywords]
    core = [re.escape(item) for item in branch.core_keywords]
    return re.compile("|".join(escaped)), re.compile("|".join(core))


KEYWORD_PATTERNS = {branch.branch_id: compile_keywords(branch) for branch in BRANCHES}


def score_text(branch: Branch, text: str) -> tuple[int, int, int]:
    all_pattern, core_pattern = KEYWORD_PATTERNS[branch.branch_id]
    all_hits = all_pattern.findall(text)
    core_hits = core_pattern.findall(text)
    unique_hits = len(set(all_hits))
    return len(core_hits) * 4 + unique_hits * 2 + min(len(all_hits), 8), len(core_hits), unique_hits


def case_text(case: dict[str, Any]) -> str:
    fields = [
        "pattern_cell_id",
        "status_group",
        "work_status_label",
        "body_function_signals",
        "impairment_signals",
        "readiness_unresolved",
        "job_search_unresolved",
        "pre_employment_unresolved",
        "post_employment_unresolved",
        "accommodations_needed_absent",
        "accommodations_present",
        "support_use_gaps",
        "consultation_gaps",
        "service_fit_gaps",
        "disclosure_gaps",
        "low_soc_or_life_signals",
        "low_work_confidence",
        "job_type_signals",
        "narrative_context_labels",
        "uncertainty_flags",
    ]
    return " ".join(norm_text(case.get(field)) for field in fields)


def source_family(dataset_id: str) -> str:
    if dataset_id in {"nanbyo_survey_4000", "employment_survey_3000"}:
        return "respondent_survey_case"
    if dataset_id.endswith("_units"):
        return "respondent_survey_redacted_text"
    if dataset_id.startswith("supporter_practice"):
        return "supporter_practice_redacted_text"
    if dataset_id.startswith("nanbyo_workplace"):
        return "workplace_survey_redacted_text"
    return dataset_id


def add_hit(
    hits: dict[str, list[dict[str, Any]]],
    branch: Branch,
    *,
    source_id: str,
    source_family_name: str,
    source_dataset: str,
    score: int,
    core_hits: int,
    signal_kind: str,
    unique_hits: int,
) -> None:
    if signal_kind == "pattern_cell_mapping":
        threshold = 0
        min_core = 0
        min_unique = 0
    elif signal_kind == "document_text":
        threshold = 22
        min_core = 3
        min_unique = 4
    elif signal_kind == "case_interpretation":
        threshold = 9
        min_core = 1
        min_unique = 2
    else:
        threshold = 10
        min_core = 1
        min_unique = 2
    if score < threshold or core_hits < min_core or unique_hits < min_unique:
        return
    hits[branch.branch_id].append({
        "source_id": source_id,
        "source_family": source_family_name,
        "source_dataset": source_dataset,
        "score": score,
        "core_hits": core_hits,
        "unique_hits": unique_hits,
        "signal_kind": signal_kind,
    })


def collect_case_hits() -> dict[str, list[dict[str, Any]]]:
    hits: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for dataset_id, path in CASE_FILES.items():
        if not path.exists():
            continue
        for case in read_jsonl(path):
            record_id = canonical_source_id(dataset_id, case.get("record_id"))
            pattern_cell_id = str(case.get("pattern_cell_id") or "")
            for branch_id in PATTERN_CELL_TO_BRANCHES.get(pattern_cell_id, ()):
                branch = BRANCH_BY_ID[branch_id]
                add_hit(
                    hits,
                    branch,
                    source_id=record_id,
                    source_family_name=source_family(dataset_id),
                    source_dataset=dataset_id,
                    score=8,
                    core_hits=10,
                    unique_hits=10,
                    signal_kind="pattern_cell_mapping",
                )
    return hits


def collect_redacted_unit_hits() -> dict[str, list[dict[str, Any]]]:
    hits: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for dataset_id, path in REDACTED_UNIT_FILES.items():
        if not path.exists():
            continue
        for row in read_jsonl(path):
            text = " ".join([
                norm_text(row.get("raw_name")),
                norm_text(row.get("display_name")),
                norm_text(row.get("question_group")),
                norm_text(row.get("column_reason")),
                norm_text(row.get("redacted_unit_text")),
            ])
            respondent_id = row.get("respondent_id") or row.get("row_ref") or "unknown"
            if dataset_id.endswith("_units"):
                base_dataset = dataset_id.removesuffix("_units")
                source_id = canonical_source_id(base_dataset, respondent_id)
            else:
                source_id = canonical_source_id(dataset_id, respondent_id)
            for branch in BRANCHES:
                score, core_hits, unique_hits = score_text(branch, text)
                add_hit(
                    hits,
                    branch,
                    source_id=source_id,
                    source_family_name=source_family(dataset_id),
                    source_dataset=dataset_id,
                    score=score,
                    core_hits=core_hits,
                    unique_hits=unique_hits,
                    signal_kind="redacted_text_unit",
                )
    return hits


def iter_document_paths() -> Iterable[tuple[str, Path]]:
    seen: set[Path] = set()
    for family, base, pattern in DOCUMENT_GLOBS:
        if not base.exists():
            continue
        for path in sorted(base.glob(pattern)):
            if not path.is_file() or path in seen:
                continue
            seen.add(path)
            if family == "external_web_cache" and "nivr_" in str(path.relative_to(ROOT)):
                continue
            yield family, path


def collect_document_hits() -> dict[str, list[dict[str, Any]]]:
    hits: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for family, path in iter_document_paths():
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        rel = path.relative_to(ROOT).as_posix()
        source_id = f"{family}:{rel}"
        for branch in BRANCHES:
            score, core_hits, unique_hits = score_text(branch, text)
            add_hit(
                hits,
                branch,
                source_id=source_id,
                source_family_name=family,
                source_dataset=family,
                score=score,
                core_hits=core_hits,
                unique_hits=unique_hits,
                signal_kind="document_text",
            )
    return hits


def merge_hits(*hit_sets: dict[str, list[dict[str, Any]]]) -> dict[str, list[dict[str, Any]]]:
    merged: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    for hit_set in hit_sets:
        for branch_id, rows in hit_set.items():
            for row in rows:
                existing = merged[branch_id].get(row["source_id"])
                if existing is None or row["score"] > existing["score"]:
                    merged[branch_id][row["source_id"]] = row
    return {
        branch_id: sorted(rows.values(), key=lambda row: (-row["score"], row["source_id"]))
        for branch_id, rows in merged.items()
    }


def classify_readiness(case_count: int, boundary_count: int, counter_count: int, source_family_count: int) -> str:
    if case_count >= 20 and boundary_count >= 3 and counter_count >= 3 and source_family_count >= 3:
        return "LLM文脈読解の本番候補: ケース量・境界・対照・外部接続がそろい始めている"
    if case_count >= 8:
        return "LLM文脈読解の本番候補: ケース量はあるが境界・対照または外部接続の補強が必要"
    if case_count >= 5:
        return "同型探索候補: レビュー命題化せず追加ケース探索を優先"
    if case_count >= 1:
        return "少数重要シグナル: 消さずに復活探索へ回す"
    return "未検出または外部資料のみ: 調査ケース接続が必要"


def build_branch_result(branch: Branch, hits: list[dict[str, Any]], all_case_ids: set[str]) -> dict[str, Any]:
    source_counts = Counter(row["source_family"] for row in hits)
    dataset_counts = Counter(row["source_dataset"] for row in hits)
    case_rows = [
        row for row in hits
        if row["source_family"] in {
            "respondent_survey_case",
            "respondent_survey_redacted_text",
            "supporter_practice_redacted_text",
            "workplace_survey_redacted_text",
        }
    ]
    case_ids = list(dict.fromkeys(row["source_id"] for row in case_rows))
    case_id_set = set(case_ids)
    boundary_ids = [
        row["source_id"]
        for row in sorted(case_rows, key=lambda row: (row["score"], row["source_id"]))
        if row["source_id"] in case_id_set
    ][:8]

    # Counter candidates are high-signal case records for other branches that did
    # not hit this branch. They are contrast IDs, not disconfirming judgments.
    counter_candidates = sorted(all_case_ids - case_id_set)[:8]
    document_ids = [
        row["source_id"]
        for row in hits
        if row["source_family"] in {"workshop", "nivr_web_cache", "nivr_rehadat_translation_cache", "external_web_cache"}
    ][:12]

    readiness = classify_readiness(
        len(case_ids),
        len(boundary_ids),
        len(counter_candidates),
        len(source_counts),
    )
    return {
        "branch_id": branch.branch_id,
        "title": branch.title,
        "status": "machine_generated_unreviewed_no_promotion",
        "icf_lenses": list(branch.icf_lenses),
        "candidate_interaction": branch.candidate_interaction,
        "counter_interaction": branch.counter_interaction,
        "case_or_unit_count": len(case_ids),
        "source_family_counts": dict(sorted(source_counts.items())),
        "dataset_counts": dict(sorted(dataset_counts.items())),
        "representative_ids": case_ids[:12],
        "boundary_ids": boundary_ids,
        "contrast_ids": counter_candidates,
        "connected_document_ids": document_ids,
        "llm_context_reading_queue": case_ids[:24],
        "readiness": readiness,
        "not_exported": "raw_or_redacted_text",
    }


def write_markdown(results: list[dict[str, Any]], path: Path) -> None:
    lines = [
        "# Stage 1 SCIMA/FCHMA 本番候補抽出 v0",
        "",
        "日付: 2026-05-14",
        "状態: 機械生成・未レビュー・昇格なし",
        "本文引用: なし",
        "",
        "これは第一段階の実作業出力。調査データ、支援者記述、職場調査、workshop、NIVR/web-cacheを、同じSCIMA/FCHMA文脈枝へ接続するための本番候補抽出である。",
        "",
        "## 全体像",
        "",
        "| 枝 | 文脈枝 | ケース/単位 | 読解準備 | 代表ID |",
        "|---|---|---:|---|---|",
    ]
    for result in results:
        reps = ", ".join(f"`{item}`" for item in result["representative_ids"][:3]) or "なし"
        lines.append(
            f"| {result['branch_id']} | {result['title']} | {result['case_or_unit_count']} | {result['readiness']} | {reps} |"
        )

    lines.extend(["", "## 枝別出力", ""])
    for result in results:
        lines.extend([
            f"### {result['branch_id']} {result['title']}",
            "",
            f"ICF接点: {'、'.join(result['icf_lenses'])}",
            "",
            f"候補相互作用: {result['candidate_interaction']}",
            "",
            f"反対相互作用: {result['counter_interaction']}",
            "",
            f"抽出件数: {result['case_or_unit_count']}",
            f"読解準備: {result['readiness']}",
            "",
            f"代表ID: {', '.join(f'`{item}`' for item in result['representative_ids'][:12]) or 'なし'}",
            f"境界ID: {', '.join(f'`{item}`' for item in result['boundary_ids'][:8]) or 'なし'}",
            f"対照ID: {', '.join(f'`{item}`' for item in result['contrast_ids'][:8]) or 'なし'}",
            "",
            "ソース別:",
        ])
        for key, value in result["source_family_counts"].items():
            lines.append(f"- {key}: {value}")
        lines.extend([
            "",
            f"接続資料ID: {', '.join(f'`{item}`' for item in result['connected_document_ids'][:8]) or 'なし'}",
            "",
            "次のLLM読解キュー:",
            f"{', '.join(f'`{item}`' for item in result['llm_context_reading_queue'][:16]) or 'なし'}",
            "",
        ])

    lines.extend([
        "## 使用上の注意",
        "",
        "- これはPythonによる広めの候補抽出であり、SCIMA/FCHMA本体の完了ではない。",
        "- レビューカード化する単位は、この枝をLLMが文脈読解して分けた後の文脈枝である。",
        "- 1-7例相当の枝は、人間レビュー用命題ではなく復活探索候補として残す。",
        "- 本文や伏字済み本文は、この出力に含めていない。",
    ])
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    merged_hits = merge_hits(
        collect_case_hits(),
        collect_redacted_unit_hits(),
        collect_document_hits(),
    )
    all_case_ids = {
        row["source_id"]
        for rows in merged_hits.values()
        for row in rows
        if row["source_family"] in {
            "respondent_survey_case",
            "respondent_survey_redacted_text",
            "supporter_practice_redacted_text",
            "workplace_survey_redacted_text",
        }
    }
    results = [
        build_branch_result(branch, merged_hits.get(branch.branch_id, []), all_case_ids)
        for branch in BRANCHES
    ]
    json_path = OUT_DIR / f"{RUN_ID}.json"
    md_path = OUT_DIR / f"{RUN_ID}.md"
    payload = {
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "source_families": {
            "respondent_survey_case": list(CASE_FILES),
            "redacted_units": list(REDACTED_UNIT_FILES),
            "documents": [family for family, _, _ in DOCUMENT_GLOBS],
        },
        "branch_results": results,
    }
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(results, md_path)
    print(json.dumps({
        "markdown": str(md_path.relative_to(ROOT)),
        "json": str(json_path.relative_to(ROOT)),
        "branches": [
            {
                "branch_id": result["branch_id"],
                "case_or_unit_count": result["case_or_unit_count"],
                "source_families": result["source_family_counts"],
                "readiness": result["readiness"],
            }
            for result in results
        ],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
