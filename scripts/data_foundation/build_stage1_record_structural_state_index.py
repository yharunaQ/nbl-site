#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Callable

from build_stage1_rcp_record_lattice import (
    ROOT,
    RUN_DIR,
    STATUS,
    AXES,
    axis_package,
    branch_state,
    diversity_buckets,
    has_axis,
    has_lens,
    load_json,
    pick_diverse,
    record_axes,
    source_prefix,
    top_counter,
)


RECORD_INDEX_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-record-structural-state-index-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-record-structural-state-index-v0-2026-05-18.md"


ScoreFn = Callable[[dict[str, Any]], int]


def has_cell_prefix(record: dict[str, Any], *prefixes: str) -> bool:
    return any(record.get("pattern_cell_id", "").startswith(prefix) for prefix in prefixes)


def has_branch_or_tag(record: dict[str, Any], *items: str) -> bool:
    values = set(record.get("candidate_branches", [])) | set(record.get("boundary_tags", []))
    return bool(values & set(items))


def score_health_time_choice(record: dict[str, Any]) -> int:
    return int(
        3 * has_axis(record, "C01-health-time")
        + 3 * has_axis(record, "C06-life-security")
        + has_axis(record, "C03-support-continuity")
        + has_axis(record, "C02-entry-translation")
        + has_lens(record, "health_management")
        + has_lens(record, "body_function")
        + has_branch_or_tag(record, "P1-C01D", "P1-C06C", "P1-C06D")
    )


def score_entry_sequence(record: dict[str, Any]) -> int:
    transition = record["status_group"] in {
        "not_working_wants_work",
        "never_worked",
        "job_transition_or_training",
        "past_work_not_current",
    }
    return int(
        3 * transition
        + 2 * has_axis(record, "C02-entry-translation")
        + 2 * has_axis(record, "C03-support-continuity")
        + 2 * has_axis(record, "C06-life-security")
        + has_cell_prefix(record, "RC-10", "EC-10")
        + has_branch_or_tag(record, "P1-C06B", "P1-C02B", "P1-C03B")
    )


def score_prework_translation(record: dict[str, Any]) -> int:
    prework = record["status_group"] in {
        "never_worked",
        "not_working_wants_work",
        "job_transition_or_training",
        "no_current_work_wish",
    }
    return int(
        3 * prework
        + 2 * has_axis(record, "C02-entry-translation")
        + 2 * has_axis(record, "C03-support-continuity")
        + has_axis(record, "C01-health-time")
        + has_axis(record, "C06-life-security")
        + has_cell_prefix(record, "RC-10", "EC-10")
        + has_lens(record, "activity")
        + has_lens(record, "personal_context")
    )


def score_information_sync(record: dict[str, Any]) -> int:
    return int(
        3 * has_axis(record, "C04-information-participation")
        + 2 * has_axis(record, "C05-worksite-contact")
        + 2 * has_axis(record, "C03-support-continuity")
        + has_axis(record, "C02-entry-translation")
        + has_lens(record, "participation")
        + has_lens(record, "environment")
    )


def score_participation_value(record: dict[str, Any]) -> int:
    return int(
        3 * (record["status_group"] == "currently_working")
        + 2 * has_axis(record, "C03-support-continuity")
        + has_axis(record, "C01-health-time")
        + has_axis(record, "C04-information-participation")
        + has_axis(record, "C05-worksite-contact")
        + has_axis(record, "C06-life-security")
        + 2 * has_lens(record, "participation")
        + has_cell_prefix(record, "RC-02", "EC-02", "EC-03")
    )


def score_evaluation_translation(record: dict[str, Any]) -> int:
    return int(
        2 * (record["status_group"] == "currently_working")
        + 2 * has_axis(record, "C04-information-participation")
        + 2 * has_axis(record, "C03-support-continuity")
        + 2 * has_axis(record, "C06-life-security")
        + has_axis(record, "C02-entry-translation")
        + has_lens(record, "participation")
        + has_lens(record, "support")
    )


def score_worksite_contact(record: dict[str, Any]) -> int:
    return int(
        3 * has_axis(record, "C05-worksite-contact")
        + has_axis(record, "C01-health-time")
        + has_axis(record, "C02-entry-translation")
        + has_axis(record, "C04-information-participation")
        + has_lens(record, "body_function")
        + has_lens(record, "activity")
        + has_lens(record, "environment")
        + has_branch_or_tag(record, "P1-C05A", "P1-C05B", "P1-C05C", "P1-C05E")
    )


def score_support_retranslation(record: dict[str, Any]) -> int:
    related_axes = sum(
        int(has_axis(record, axis))
        for axis in [
            "C01-health-time",
            "C02-entry-translation",
            "C04-information-participation",
            "C05-worksite-contact",
            "C06-life-security",
        ]
    )
    return int(
        3 * has_axis(record, "C03-support-continuity")
        + related_axes
        + has_lens(record, "support")
        + has_branch_or_tag(record, "P1-C03A", "P1-C03B", "P1-C03C", "P1-C03D")
    )


def score_disclosure_boundary(record: dict[str, Any]) -> int:
    return int(
        3 * has_axis(record, "C02-entry-translation")
        + has_axis(record, "C04-information-participation")
        + has_axis(record, "C03-support-continuity")
        + has_lens(record, "environment")
        + has_lens(record, "personal_context")
        + has_branch_or_tag(record, "P1-C02A", "P1-C02B", "P1-C02C", "P1-C02D")
    )


def score_life_security_sequence(record: dict[str, Any]) -> int:
    return int(
        3 * has_axis(record, "C06-life-security")
        + has_axis(record, "C01-health-time")
        + has_axis(record, "C02-entry-translation")
        + has_axis(record, "C03-support-continuity")
        + (record["status_group"] in {"currently_working", "not_working_wants_work", "past_work_not_current", "job_transition_or_training"})
        + has_branch_or_tag(record, "P1-C06B", "P1-C06C", "P1-C06D", "P1-C06E")
    )


FAMILY_CONFIGS: list[dict[str, Any]] = [
    {
        "family_id": "SF-01-health-time-choice-bundle",
        "title": "健康時間の選択束",
        "threshold": 8,
        "score": score_health_time_choice,
        "core_reading": "治療、体調変動、休息、勤務時間、収入、制度対象が、続ける・休む・戻る・選び直す自由度を一体で開閉する。",
        "boundary_reading": "就労可否や医学判断ではなく、時間配分と生活保障の接続として扱う。",
        "focus_axes": ["C01-health-time", "C06-life-security", "C03-support-continuity", "C02-entry-translation"],
    },
    {
        "family_id": "SF-02-entry-sequence-constraint",
        "title": "移行入口の順序制約",
        "threshold": 9,
        "score": score_entry_sequence,
        "core_reading": "生活保障、健康時間、求人、訓練、支援、開示説明が、応募・実習・再入口の順序を変える。",
        "boundary_reading": "未就労や離職後を準備不足として読まず、順序制約として読む。",
        "focus_axes": ["C06-life-security", "C02-entry-translation", "C03-support-continuity", "C01-health-time"],
    },
    {
        "family_id": "SF-03-prework-participation-translation",
        "title": "入口以前参加の前段翻訳",
        "threshold": 9,
        "score": score_prework_translation,
        "core_reading": "生活リズム、体力、日中活動、家族/地域、訓練、支援、自信が求人条件・支援条件へ接続する。",
        "boundary_reading": "非就労志向や生活参加を問題化しない。",
        "focus_axes": ["C02-entry-translation", "C03-support-continuity", "C01-health-time", "C06-life-security"],
    },
    {
        "family_id": "SF-04-information-synchronization",
        "title": "情報同期の参加構造",
        "threshold": 8,
        "score": score_information_sync,
        "core_reading": "情報形式ではなく、指示、会議、研修、安全、非公式情報、役割期待、評価が同期する範囲を見る。",
        "boundary_reading": "情報共有過多、開示負担、職場文化、評価制度へ戻すべきIDを残す。",
        "focus_axes": ["C04-information-participation", "C05-worksite-contact", "C03-support-continuity", "C02-entry-translation"],
    },
    {
        "family_id": "SF-05-career-participation-value",
        "title": "キャリア参加の価値翻訳",
        "threshold": 8,
        "score": score_participation_value,
        "core_reading": "条件付き遂行が、成果、役割、処遇、技能、将来見通しへ翻訳されるかを見る。",
        "boundary_reading": "C01/C03/C06の大規模境界をC07へ投影しすぎない。",
        "focus_axes": ["C01-health-time", "C03-support-continuity", "C04-information-participation", "C05-worksite-contact", "C06-life-security"],
    },
    {
        "family_id": "SF-06-evaluation-translation-rule",
        "title": "条件付き遂行の評価翻訳",
        "threshold": 8,
        "score": score_evaluation_translation,
        "core_reading": "配慮・支援・変動・情報保障を前提にした遂行が、評価規則の中で価値として扱われるかを見る。",
        "boundary_reading": "評価処遇ではなく、雇用形態、生活保障、職務負荷、情報参加の問題へ戻すIDを分ける。",
        "focus_axes": ["C04-information-participation", "C03-support-continuity", "C06-life-security", "C02-entry-translation"],
    },
    {
        "family_id": "SF-07-worksite-contact-design",
        "title": "仕事接触点の設計",
        "threshold": 7,
        "score": score_worksite_contact,
        "core_reading": "移動、姿勢、作業場所、設備、手順、安全確認、職務代替が仕事参加へ接続するかを見る。",
        "boundary_reading": "設備リストや障害種別対応表へ落とさず、職務との接触点として読む。",
        "focus_axes": ["C05-worksite-contact", "C01-health-time", "C02-entry-translation", "C04-information-participation"],
    },
    {
        "family_id": "SF-08-support-retranslation",
        "title": "支援の再翻訳機能",
        "threshold": 8,
        "score": score_support_retranslation,
        "core_reading": "支援の有無ではなく、健康時間、求人条件、情報参加、生活保障、仕事接触点のどれを再翻訳しているかを見る。",
        "boundary_reading": "支援有効性や支援妥当性は判断しない。",
        "focus_axes": ["C03-support-continuity", "C01-health-time", "C02-entry-translation", "C04-information-participation", "C05-worksite-contact", "C06-life-security"],
    },
    {
        "family_id": "SF-09-disclosure-translation-boundary",
        "title": "開示・説明の境界翻訳",
        "threshold": 7,
        "score": score_disclosure_boundary,
        "core_reading": "本人条件と求人・職務・職場理解の間で、何をどこまで説明するかを相互翻訳として読む。",
        "boundary_reading": "本人説明能力や開示量の問題へ還元しない。",
        "focus_axes": ["C02-entry-translation", "C04-information-participation", "C03-support-continuity"],
    },
    {
        "family_id": "SF-10-life-security-sequencing",
        "title": "生活保障の順序制約",
        "threshold": 7,
        "score": score_life_security_sequence,
        "core_reading": "収入、医療費、家計責任、雇用形態、休業時保障、制度対象が、待てる時間・選べる仕事・使える支援の順序を変える。",
        "boundary_reading": "困窮や意欲の判断ではなく、選択順序の制約面として読む。",
        "focus_axes": ["C06-life-security", "C01-health-time", "C02-entry-translation", "C03-support-continuity"],
    },
]


def build_condition_windows(records: list[dict[str, Any]], focus_axes: list[str]) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        pkg = axis_package(record, focus_axes)
        for bucket in diversity_buckets(record.get("diversity_signals", [])):
            for state in branch_state(record):
                groups[(bucket, pkg, state)].append(record)

    rows: list[dict[str, Any]] = []
    for (bucket, pkg, state), items in groups.items():
        if len(items) < 10:
            continue
        rows.append(
            {
                "condition_bucket": bucket,
                "axis_package": pkg,
                "state": state,
                "record_count": len(items),
                "source_counts": top_counter(Counter(source_prefix(r["record_id"]) for r in items), 4),
                "status_counts": top_counter(Counter(r["status_group"] for r in items), 5),
                "example_ids": pick_diverse(items, 8),
            }
        )
    rows.sort(key=lambda row: (-row["record_count"], row["condition_bucket"], row["axis_package"], row["state"]))
    return rows[:18]


def summarize_family(records: list[dict[str, Any]], config: dict[str, Any]) -> dict[str, Any]:
    scored = [(config["score"](record), record) for record in records]
    selected = [record for score, record in scored if score >= config["threshold"]]
    selected.sort(key=lambda record: (-config["score"](record), record["record_id"]))
    boundary = [record for score, record in scored if config["threshold"] - 2 <= score < config["threshold"]]
    boundary.sort(key=lambda record: (-config["score"](record), record["record_id"]))

    axis_counter = Counter()
    package_counter = Counter()
    condition_counter = Counter()
    state_counter = Counter()
    lens_counter = Counter()
    for record in selected:
        for axis in AXES:
            if axis in record_axes(record):
                axis_counter[axis] += 1
        package_counter[axis_package(record, config["focus_axes"])] += 1
        for bucket in diversity_buckets(record.get("diversity_signals", [])):
            condition_counter[bucket] += 1
        for state in branch_state(record):
            state_counter[state] += 1
        for lens, value in record.get("narrative_lens_counts", {}).items():
            lens_counter[lens] += value

    return {
        "family_id": config["family_id"],
        "title": config["title"],
        "status": STATUS,
        "threshold": config["threshold"],
        "record_count": len(selected),
        "boundary_record_count": len(boundary),
        "core_reading": config["core_reading"],
        "boundary_reading": config["boundary_reading"],
        "source_counts": top_counter(Counter(record["source"] for record in selected), 5),
        "status_group_counts": top_counter(Counter(record["status_group"] for record in selected), 7),
        "axis_counts": top_counter(axis_counter, 8),
        "axis_package_counts": top_counter(package_counter, 8),
        "condition_bucket_counts": top_counter(condition_counter, 10),
        "state_counts": top_counter(state_counter, 8),
        "narrative_lens_counts": top_counter(lens_counter, 8),
        "representative_ids": pick_diverse(selected, 16),
        "boundary_ids": pick_diverse(boundary, 16),
        "condition_state_windows": build_condition_windows(selected, config["focus_axes"]),
        "non_judgment_boundary": "ケース正誤、支援妥当性、配慮妥当性、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
    }


def build_payload() -> dict[str, Any]:
    records = load_json(RECORD_INDEX_JSON)["records"]
    families = [summarize_family(records, config) for config in FAMILY_CONFIGS]
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-record-structural-state-index-v0-2026-05-18",
        "status": STATUS,
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "Bundle A/B/C後の構造名を、8241 recordへ戻して、同型構造・条件窓・開閉状態で検索できるようにする未レビュー索引。",
        "method_boundary": {
            "not_final_pattern": "structural familyは最終パターンではなく、次のLLM文脈読解と人間レビューのための索引。",
            "not_condition_grouping": "疾病・障害種類で人をまとめず、同じ構造自由度の形を変える条件窓として扱う。",
            "minimum_case_rule": "condition-state windowは10件未満なら出さない。",
        },
        "source_artifacts": [
            str(RECORD_INDEX_JSON.relative_to(ROOT)),
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-rcp-structural-renaming-v0-2026-05-18.md",
        ],
        "structural_family_count": len(families),
        "structural_families": families,
    }


def markdown(payload: dict[str, Any]) -> str:
    lines: list[str] = [
        "# Stage 1 Production Record Structural State Index",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "Bundle A/B/Cで得た構造読解を、8241 record側へ戻すための索引。RCPを最終パターンにせず、同型構造、条件窓、開閉状態として検索できるようにする。",
        "",
        "## Method Guard",
        "",
        "- structural familyは最終パターンではなく、次のLLM文脈読解と人間レビューのための索引。",
        "- 疾病・障害種類は分類名ではなく、同じ構造自由度の形を変える条件窓として扱う。",
        "- condition-state windowは10件未満なら出さない。",
        "- 支援有効性、配慮妥当性、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
        "",
        "## Structural Family Overview",
        "",
        "| family | records | boundary | main states | main condition windows |",
        "|---|---:|---:|---|---|",
    ]
    for family in payload["structural_families"]:
        states = ", ".join(f"{k} {v}" for k, v in list(family["state_counts"].items())[:3])
        conditions = ", ".join(f"{k} {v}" for k, v in list(family["condition_bucket_counts"].items())[:4])
        lines.append(
            f"| `{family['family_id']}` {family['title']} | {family['record_count']} | {family['boundary_record_count']} | {states} | {conditions} |"
        )

    lines.extend(["", "## Structural Families", ""])
    for family in payload["structural_families"]:
        lines.extend(
            [
                f"### {family['family_id']} {family['title']}",
                "",
                f"- records: {family['record_count']}",
                f"- boundary records: {family['boundary_record_count']}",
                f"- core reading: {family['core_reading']}",
                f"- boundary reading: {family['boundary_reading']}",
                f"- source: {', '.join(f'{k} {v}' for k, v in family['source_counts'].items())}",
                f"- status: {', '.join(f'{k} {v}' for k, v in family['status_group_counts'].items())}",
                f"- axis packages: {', '.join(f'`{k}` {v}' for k, v in family['axis_package_counts'].items())}",
                f"- states: {', '.join(f'{k} {v}' for k, v in family['state_counts'].items())}",
                f"- representative: {', '.join(f'`{rid}`' for rid in family['representative_ids'])}",
                f"- boundary: {', '.join(f'`{rid}`' for rid in family['boundary_ids'])}",
                "",
                "#### Condition-State Windows",
                "",
                "| condition bucket | axis package | state | records | example IDs |",
                "|---|---|---|---:|---|",
            ]
        )
        for window in family["condition_state_windows"]:
            ids = ", ".join(f"`{rid}`" for rid in window["example_ids"])
            lines.append(
                f"| {window['condition_bucket']} | `{window['axis_package']}` | {window['state']} | {window['record_count']} | {ids} |"
            )
        lines.append("")

    lines.extend(
        [
            "## Immediate Use",
            "",
            "- ここから次のLLM文脈読解対象を選ぶ。各familyで、代表・境界・少数条件窓を最低数つきで抽出する。",
            "- 同じ構造の開いた状態と閉じた状態を対で読む。開いた状態を支援有効性判断にしない。",
            "- 少数条件窓は、件数が少なくても、10件以上なら探索対象として残す。10件未満は命題化せず、保留窓にする。",
            "",
            f"JSON: `{OUT_JSON.relative_to(ROOT)}`",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_MD.write_text(markdown(payload), encoding="utf-8")


if __name__ == "__main__":
    main()
