#!/usr/bin/env python3
"""Build diversity-aware SCIMA/FCHMA contrast cards.

The previous all-case summaries rank what is common in the whole dataset. This
script ranks what is relatively characteristic inside each health-condition or
disability group, so minority relationships are not hidden by the largest
groups. It exports labels and record IDs only; no raw/redacted narrative text.
"""

from __future__ import annotations

import csv
import json
import math
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_ID = "redacted-narrative-integrated-v0-2026-05-13"


NANBYO_DIR = ROOT / "references/derived/scima-fchma/nanbyo_survey_4000" / RUN_ID
EMPLOYMENT_DIR = ROOT / "references/derived/scima-fchma/employment_survey_3000" / RUN_ID
EMPLOYMENT_STRUCTURED = ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv"


EMPLOYMENT_BROAD_MAP = {
    "視覚障害": {"全盲", "弱視・視野障害", "盲ろう"},
    "聴覚・平衡機能障害": {"ろうあ", "難聴", "平衡機能障害", "盲ろう"},
    "肢体不自由": {"脳性まひ", "頸髄損傷", "脊髄損傷", "筋ジストロフィー", "脳卒中後遺症", "切断、その他", "二分脊椎"},
    "内部障害": {
        "ペースメーカー適用",
        "人工弁適用",
        "心臓機能障害３、４級",
        "心臓機能障害",
        "血液透析適用",
        "腹膜透析適用",
        "腎臓機能障害３、４級",
        "酸素療法適用",
        "呼吸器機能障害３、４級",
        "人工肛門",
        "尿路変更、自己導尿",
        "小腸機能障害１級",
        "小腸機能障害３、４級",
        "抗HIV服薬継続中",
        "抗HIV服薬治療開始前",
    },
    "知的障害": {"知的障害", "ダウン症"},
    "精神障害": {"統合失調症", "気分障害（うつ、そううつ等）", "てんかん", "不安障害・パニック障害", "その他の精神障害"},
    "発達障害": {"広汎性発達障害", "自閉症", "アスペルガー障害", "学習障害", "読字障害", "注意欠陥多動性障害", "トゥレット症候群", "その他の発達障害"},
    "高次脳機能障害": {"高次脳機能障害"},
    "難病・慢性疾患": {"難病、慢性疾患"},
}


@dataclass
class DatasetConfig:
    dataset_id: str
    input_path: Path
    output_dir: Path
    subgroup_field: str
    subgroup_title: str
    lens_fields: dict[str, list[str]]
    min_group_n: int


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    out = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                out.append(json.loads(line))
    return out


def unique(values: list[str]) -> list[str]:
    return sorted(dict.fromkeys(v for v in values if v))


def employment_broad_groups(case: dict[str, Any]) -> list[str]:
    detail = set(case.get("impairment_signals") or [])
    groups = [group for group, labels in EMPLOYMENT_BROAD_MAP.items() if detail & labels]
    return groups or ["障害種類未分類"]


def load_employment_raw_classification() -> dict[str, list[str]]:
    """Keep original classification codes available for audit-adjacent context."""
    by_id: dict[str, list[str]] = defaultdict(list)
    if not EMPLOYMENT_STRUCTURED.exists():
        return {}
    with EMPLOYMENT_STRUCTURED.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            if row["raw_name"] == "分類名":
                values = row["normalized_value"].split("+") if row["normalized_value"] else []
                by_id[f"employment_survey_3000:{row['respondent_id']}"] = values
    return by_id


def case_groups(config: DatasetConfig, case: dict[str, Any]) -> list[str]:
    if config.dataset_id == "employment_survey_3000":
        return employment_broad_groups(case)
    return case.get(config.subgroup_field) or ["疾病群未分類"]


def case_lens_signals(config: DatasetConfig, case: dict[str, Any]) -> dict[str, list[str]]:
    signals: dict[str, list[str]] = {}
    for lens, fields in config.lens_fields.items():
        vals: list[str] = []
        for field in fields:
            value = case.get(field)
            if isinstance(value, list):
                vals.extend(value)
            elif isinstance(value, str) and value:
                vals.append(value)
        signals[lens] = unique(vals)
    signals["パターンセル"] = [case["pattern_cell_id"]]
    signals["就労状態"] = [case.get("status_group") or "unknown"]
    return signals


def signal_stats(
    cases: list[dict[str, Any]],
    config: DatasetConfig,
    group_cases: set[str],
    lens: str,
) -> list[dict[str, Any]]:
    group_n = len(group_cases)
    other_n = len(cases) - group_n
    in_counts: Counter[str] = Counter()
    out_counts: Counter[str] = Counter()

    for case in cases:
        rid = case["record_id"]
        values = set(case_lens_signals(config, case).get(lens, []))
        if rid in group_cases:
            in_counts.update(values)
        else:
            out_counts.update(values)

    rows = []
    min_count = 2 if group_n < 30 else max(3, math.ceil(group_n * 0.04))
    for label, in_count in in_counts.items():
        if in_count < min_count:
            continue
        out_count = out_counts[label]
        in_rate = in_count / group_n if group_n else 0
        out_rate = out_count / other_n if other_n else 0
        if in_rate < 0.04:
            continue
        lift = (in_count + 0.5) / (group_n + 1) / ((out_count + 0.5) / (other_n + 1))
        diff = in_rate - out_rate
        distinctive = lift >= 1.25 or diff >= 0.07 or group_n < 40
        if not distinctive:
            continue
        score = math.log2(lift) + diff * 2.0 + min(in_rate, 0.8)
        rows.append({
            "label": label,
            "in_count": in_count,
            "in_rate": round(in_rate, 3),
            "other_rate": round(out_rate, 3),
            "lift": round(lift, 2),
            "score": round(score, 3),
        })

    rows.sort(key=lambda r: (-r["score"], -r["in_count"], r["label"]))
    return rows


def prevalence_stats(
    cases: list[dict[str, Any]],
    config: DatasetConfig,
    group_cases: set[str],
    lens: str,
    limit: int = 3,
) -> list[dict[str, Any]]:
    group_n = len(group_cases)
    counts: Counter[str] = Counter()
    for case in cases:
        if case["record_id"] in group_cases:
            counts.update(set(case_lens_signals(config, case).get(lens, [])))
    return [
        {"label": label, "in_count": count, "in_rate": round(count / group_n, 3), "other_rate": None, "lift": None}
        for label, count in counts.most_common(limit)
    ]


def top_for_lens(cases: list[dict[str, Any]], config: DatasetConfig, group_cases: set[str], lens: str, limit: int = 4) -> list[dict[str, Any]]:
    distinctive = signal_stats(cases, config, group_cases, lens)
    if distinctive:
        return distinctive[:limit]
    return prevalence_stats(cases, config, group_cases, lens, limit)


def format_signal(item: dict[str, Any]) -> str:
    if item.get("lift") is None:
        return f"{item['label']}（群内{item['in_count']}件/{item['in_rate']:.0%}）"
    return f"{item['label']}（群内{item['in_count']}件/{item['in_rate']:.0%}、他群{item['other_rate']:.0%}、{item['lift']}倍）"


def select_ids(
    group: str,
    group_members: list[dict[str, Any]],
    config: DatasetConfig,
    top_by_lens: dict[str, list[dict[str, Any]]],
) -> dict[str, list[str]]:
    top_labels = {
        item["label"]
        for lens, items in top_by_lens.items()
        if lens not in {"パターンセル", "就労状態"}
        for item in items[:3]
    }
    dominant_cell = top_by_lens.get("パターンセル", [{}])[0].get("label")

    scored = []
    for case in group_members:
        labels = set()
        for values in case_lens_signals(config, case).values():
            labels.update(values)
        hit = len(labels & top_labels)
        scored.append((hit, case.get("pattern_score", 0), case["record_id"], case))

    representative = [rid for _, _, rid, _ in sorted(scored, key=lambda x: (-x[0], -x[1], x[2]))[:5]]
    boundary = [rid for _, _, rid, _ in sorted(scored, key=lambda x: (x[0], x[1], x[2]))[:5]]
    exceptions = [
        case["record_id"]
        for hit, _, _, case in sorted(scored, key=lambda x: (x[0], x[2]))
        if case.get("pattern_cell_id") != dominant_cell or not case.get("narrative_context_labels")
    ][:5]
    return {"representative_record_ids": representative, "boundary_record_ids": boundary, "exception_or_counterexample_record_ids": exceptions}


def make_candidate_relation(card: dict[str, Any], config: DatasetConfig) -> str:
    def first(lens: str) -> str | None:
        items = card["top_by_lens"].get(lens) or []
        return items[0]["label"] if items else None

    if config.dataset_id == "nanbyo_survey_4000":
        body = first("心身機能")
        work = first("就業・活動課題") or first("就職活動・移行")
        env = first("職場環境・配慮") or first("支援接続")
        narrative = first("記述文脈")
        parts = [p for p in [body, work, env, narrative] if p]
        if len(parts) >= 3:
            return f"{card['subgroup']}では、{parts[0]}と{parts[1]}が、{parts[2]}と同時に出やすい。記述側では{parts[3] if len(parts) > 3 else '関連文脈'}も重なり、疾病群ごとの仕事設計・支援接点の違いを確認する候補関係。"
    else:
        task = first("就業後課題") or first("就職前・就職活動")
        env = first("職場環境・配慮") or first("説明・開示")
        support = first("支援接続")
        narrative = first("記述文脈")
        parts = [p for p in [task, env, support, narrative] if p]
        if len(parts) >= 3:
            return f"{card['subgroup']}では、{parts[0]}が、{parts[1]}や{parts[2]}と結びついて出やすい。記述側では{parts[3] if len(parts) > 3 else '関連文脈'}が重なり、障害種類ごとの仕事内容・環境・支援接点を確認する候補関係。"
    return f"{card['subgroup']}では、全体集計とは異なる信号の組み合わせがある。代表IDと境界IDで、群内の共通性と個別差を確認する。"


def build_cards(config: DatasetConfig) -> dict[str, Any]:
    cases = read_jsonl(config.input_path)
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for case in cases:
        for group in case_groups(config, case):
            grouped[group].append(case)

    cards = []
    for group, members in grouped.items():
        if len(members) < config.min_group_n:
            continue
        group_cases = {case["record_id"] for case in members}
        top_by_lens = {
            lens: top_for_lens(cases, config, group_cases, lens)
            for lens in ["パターンセル", "就労状態", *config.lens_fields.keys()]
        }
        card = {
            "subgroup": group,
            "subgroup_type": config.subgroup_title,
            "record_count": len(members),
            "dataset_share": round(len(members) / len(cases), 3),
            "status": "machine_generated_unreviewed_no_promotion",
            "small_group_note": "少数群の探索カード。比率差は強く出やすいため、代表IDと反例IDの確認が必要。" if len(members) < 40 else "",
            "top_by_lens": top_by_lens,
        }
        card.update(select_ids(group, members, config, top_by_lens))
        card["candidate_relation"] = make_candidate_relation(card, config)
        card["counter_relation"] = (
            "この関係は疾病名・障害種類から支援内容を直接決めるものではない。"
            "同じ群内の仕事内容、生活段階、職場環境、支援接続、記述文脈の差を先に確認する。"
        )
        cards.append(card)

    def sort_key(card: dict[str, Any]) -> tuple[Any, ...]:
        subgroup = card["subgroup"]
        is_residual = any(token in subgroup for token in ("未分類", "他疾患", "その他"))
        max_lift = max([i.get("lift") or 1 for v in card["top_by_lens"].values() for i in v] or [1])
        if config.dataset_id == "employment_survey_3000":
            preferred = [
                "視覚障害",
                "聴覚・平衡機能障害",
                "肢体不自由",
                "内部障害",
                "知的障害",
                "精神障害",
                "発達障害",
                "高次脳機能障害",
                "難病・慢性疾患",
            ]
            order = preferred.index(subgroup) if subgroup in preferred else len(preferred)
            return (is_residual, order, subgroup)
        return (is_residual, card["record_count"] < 40, -max_lift, -card["record_count"], subgroup)

    cards.sort(key=sort_key)
    return {
        "dataset_id": config.dataset_id,
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "case_count": len(cases),
        "subgroup_type": config.subgroup_title,
        "subgroup_count": len(cards),
        "raw_or_redacted_text_included": False,
        "method": {
            "ranking": "within-subgroup prevalence plus contrast against all other cases",
            "purpose": "avoid majority disease/disability groups dominating all-case summaries",
            "promotion": "none",
        },
        "cards": cards,
    }


def write_markdown(path: Path, result: dict[str, Any]) -> None:
    lines = [
        f"# {result['dataset_id']} 多様性対照 SCIMA/FCHMA カード v0",
        "",
        "日付: 2026-05-13",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "入力: 既存の全件ケース解釈。本文引用は含めない。",
        "",
        "## 何を変えたか",
        "",
        "- 全体件数順ではなく、疾病群・障害種類ごとの群内比率と他群との差で特徴を出す。",
        "- 多数派に引きずられないよう、代表ID・境界ID・反例候補IDを群ごとに出す。",
        "- 疾病名・障害種類から支援を決めるのではなく、ICF要素の関係候補として読む。",
        "",
        "## カード",
        "",
    ]
    lens_order = [
        "パターンセル",
        "就労状態",
        "心身機能",
        "就業・活動課題",
        "就職活動・移行",
        "職場環境・配慮",
        "支援接続",
        "就職前・就職活動",
        "就業後課題",
        "説明・開示",
        "職業満足・処遇",
        "就労自信",
        "記述文脈",
    ]
    for card in result["cards"]:
        lines.extend([
            f"### {card['subgroup']}（{card['record_count']}件 / {card['dataset_share']:.0%}）",
            "",
            f"候補関係: {card['candidate_relation']}",
            "",
            f"反対関係: {card['counter_relation']}",
            "",
            f"代表ID: {', '.join(card['representative_record_ids'])}",
            f"境界ID: {', '.join(card['boundary_record_ids'])}",
            f"例外・反例候補ID: {', '.join(card['exception_or_counterexample_record_ids']) or 'なし'}",
            "",
        ])
        if card["small_group_note"]:
            lines.extend([f"少数群メモ: {card['small_group_note']}", ""])
        for lens in lens_order:
            items = card["top_by_lens"].get(lens)
            if not items:
                continue
            lines.append(f"- {lens}: " + "、".join(format_signal(item) for item in items[:4]))
        lines.append("")
    lines.extend([
        "## 読み方",
        "",
        "- これは疾病別・障害別の支援メニュー表ではない。",
        "- 群内で目立つICF要素の結びつきを、人間レビューで維持・分割・棄却するための入口である。",
    ])
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    configs = [
        DatasetConfig(
            dataset_id="nanbyo_survey_4000",
            input_path=NANBYO_DIR / "case-interpretations.jsonl",
            output_dir=NANBYO_DIR,
            subgroup_field="health_condition_groups",
            subgroup_title="疾病群",
            min_group_n=10,
            lens_fields={
                "心身機能": ["body_function_signals"],
                "就業・活動課題": ["post_employment_unresolved", "readiness_unresolved"],
                "就職活動・移行": ["job_search_unresolved"],
                "職場環境・配慮": ["accommodations_needed_absent", "accommodations_present"],
                "支援接続": ["support_use_gaps", "desired_supports", "consultation_sources"],
                "記述文脈": ["narrative_context_labels"],
            },
        ),
        DatasetConfig(
            dataset_id="employment_survey_3000",
            input_path=EMPLOYMENT_DIR / "case-interpretations.jsonl",
            output_dir=EMPLOYMENT_DIR,
            subgroup_field="impairment_signals",
            subgroup_title="障害種類・疾病カテゴリ",
            min_group_n=20,
            lens_fields={
                "就職前・就職活動": ["pre_employment_unresolved"],
                "就業後課題": ["post_employment_unresolved"],
                "職場環境・配慮": ["accommodations_needed_absent", "accommodations_present"],
                "支援接続": ["consultation_gaps", "service_fit_gaps"],
                "説明・開示": ["disclosure_gaps"],
                "職業満足・処遇": ["satisfaction_risks"],
                "就労自信": ["low_work_confidence"],
                "記述文脈": ["narrative_context_labels"],
            },
        ),
    ]

    summaries = []
    for config in configs:
        result = build_cards(config)
        json_path = config.output_dir / "diversity-aware-contrast-cards.json"
        md_path = config.output_dir / "diversity-aware-contrast-cards.md"
        json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        write_markdown(md_path, result)
        summaries.append({
            "dataset_id": config.dataset_id,
            "subgroup_count": result["subgroup_count"],
            "markdown": str(md_path.relative_to(ROOT)),
            "json": str(json_path.relative_to(ROOT)),
            "top_subgroups": [
                {"subgroup": card["subgroup"], "record_count": card["record_count"]}
                for card in result["cards"][:8]
            ],
        })

    print(json.dumps(summaries, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
