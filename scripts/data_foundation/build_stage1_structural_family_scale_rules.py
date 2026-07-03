#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from build_stage1_rcp_record_lattice import (
    ROOT,
    RUN_DIR,
    STATUS,
    axis_package,
    branch_state,
    diversity_buckets,
    load_json,
    pick_diverse,
    source_prefix,
    top_counter,
)
from build_stage1_record_structural_state_index import FAMILY_CONFIGS


RECORD_INDEX_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
STRUCTURAL_STATE_INDEX_JSON = RUN_DIR / "stage1-production-record-structural-state-index-v0-2026-05-18.json"
STRUCTURAL_RENAMING_MD = RUN_DIR / "stage1-production-rcp-structural-renaming-v0-2026-05-18.md"
BUNDLE_D_MD = RUN_DIR / "stage1-production-bundle-d-diversity-conditioned-structure-context-reading-v0-2026-05-18.md"
OUT_JSON = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.md"


MINIMUM_CASES = 10
MINORITY_CONDITION_BUCKETS = {
    "視覚情報",
    "聴覚・音声情報",
    "認知・発達・知的",
    "内部障害・全身管理",
}
OPEN_STATES = {"部分軽減・残存", "支援が翻訳機能を担う"}
CLOSED_STATES = {"広範未整合", "移行・再就職持ち越し"}
BOUNDARY_STATES = {"境界接触"}


FAMILY_RULE_NOTES: dict[str, dict[str, Any]] = {
    "SF-01-health-time-choice-bundle": {
        "route_label": "健康時間を就労可否ではなく、時間配分と生活保障の選択束として読む。",
        "split_dimensions": ["休む/続ける/戻る/選び直す", "勤務時間", "休息・通院", "収入・制度対象", "職場理解"],
        "avoid": "働けている状態を解決済み、働いていない状態を能力・意欲不足として読まない。",
    },
    "SF-02-entry-sequence-constraint": {
        "route_label": "入口を本人準備ではなく、応募・訓練・支援利用・生活再建の順序制約として読む。",
        "split_dimensions": ["応募時期", "求人条件", "訓練・実習", "支援接続", "開示説明"],
        "avoid": "生活保障だけで全てを説明せず、求人不足・健康安定・支援未接続を反対構造に残す。",
    },
    "SF-03-prework-participation-translation": {
        "route_label": "入口以前参加を、生活準備一般ではなく求人条件へ接続する前段自由度として読む。",
        "split_dimensions": ["生活リズム", "日中活動", "体力・回復", "訓練", "家族/地域", "支援者"],
        "avoid": "非就労志向や生活参加を問題化しない。",
    },
    "SF-04-information-synchronization": {
        "route_label": "情報を形式ではなく、業務・安全・会議・非公式情報・評価の同期範囲として読む。",
        "split_dimensions": ["業務指示", "会議・研修", "非公式情報", "安全確認", "役割期待", "評価"],
        "avoid": "情報共有を増やせばよい、または本人説明能力の問題として読まない。",
    },
    "SF-05-career-participation-value": {
        "route_label": "条件付き遂行が成果・役割・処遇・将来見通しへ翻訳されるかを読む。",
        "split_dimensions": ["成果", "役割", "技能", "処遇", "責任", "将来見通し"],
        "avoid": "C01/C03/C06の大規模境界を全てC07参加品質に吸い込まない。",
    },
    "SF-06-evaluation-translation-rule": {
        "route_label": "配慮・支援・変動を前提にした遂行が評価規則で価値化されるかを読む。",
        "split_dimensions": ["評価基準", "職務量", "安定稼働期待", "支援利用下の成果", "雇用形態", "処遇"],
        "avoid": "評価されないことを本人能力不足に戻さない。",
    },
    "SF-07-worksite-contact-design": {
        "route_label": "移動・姿勢・設備・手順・安全確認を、職務との接触点として読む。",
        "split_dimensions": ["通勤/移動", "姿勢・作業場所", "設備", "手順", "安全確認", "職務代替"],
        "avoid": "設備リストや障害種類別対応表へ落とさない。",
    },
    "SF-08-support-retranslation": {
        "route_label": "支援の有無ではなく、何を仕事参加へ再翻訳しているかを読む。",
        "split_dimensions": ["相談入口", "役割分担", "職場への翻訳", "本人への再説明", "変化時の再調整", "支援外れ"],
        "avoid": "支援有効性や支援妥当性を判断しない。",
    },
    "SF-09-disclosure-translation-boundary": {
        "route_label": "開示・説明を、本人条件と職務条件の相互翻訳境界として読む。",
        "split_dimensions": ["伝える内容", "伝えない理由", "企業側の受け止め", "必要配慮", "不要な心配", "プライバシー負担"],
        "avoid": "開示量や本人説明能力の問題へ還元しない。",
    },
    "SF-10-life-security-sequencing": {
        "route_label": "生活保障を、待てる時間・選べる仕事・使える支援の順序制約として読む。",
        "split_dimensions": ["収入", "医療費", "家計責任", "雇用形態", "休業時保障", "制度対象"],
        "avoid": "困窮、就労意欲、能力の判断に使わない。",
    },
}


def summarize_windows(records: list[dict[str, Any]], focus_axes: list[str]) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str, str], list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        package = axis_package(record, focus_axes)
        for bucket in diversity_buckets(record.get("diversity_signals", [])):
            for state in branch_state(record):
                groups[(bucket, package, state)].append(record)

    rows: list[dict[str, Any]] = []
    for (bucket, package, state), items in groups.items():
        if len(items) < MINIMUM_CASES:
            continue
        rows.append(
            {
                "condition_bucket": bucket,
                "axis_package": package,
                "state": state,
                "record_count": len(items),
                "source_counts": top_counter(Counter(source_prefix(r["record_id"]) for r in items), 4),
                "status_counts": top_counter(Counter(r["status_group"] for r in items), 5),
                "example_ids": pick_diverse(items, 10),
            }
        )
    rows.sort(key=lambda item: (-item["record_count"], item["condition_bucket"], item["axis_package"], item["state"]))
    return rows


def pair_open_closed_windows(windows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_window: dict[tuple[str, str], dict[str, list[dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    for row in windows:
        by_window[(row["condition_bucket"], row["axis_package"])][row["state"]].append(row)

    pairs: list[dict[str, Any]] = []
    for (bucket, package), state_rows in by_window.items():
        open_rows = [row for state in OPEN_STATES for row in state_rows.get(state, [])]
        closed_rows = [row for state in CLOSED_STATES for row in state_rows.get(state, [])]
        if not open_rows or not closed_rows:
            continue
        open_best = max(open_rows, key=lambda row: row["record_count"])
        closed_best = max(closed_rows, key=lambda row: row["record_count"])
        pairs.append(
            {
                "condition_bucket": bucket,
                "axis_package": package,
                "open_state": open_best["state"],
                "open_record_count": open_best["record_count"],
                "open_example_ids": open_best["example_ids"][:6],
                "closed_state": closed_best["state"],
                "closed_record_count": closed_best["record_count"],
                "closed_example_ids": closed_best["example_ids"][:6],
            }
        )
    pairs.sort(key=lambda item: -(item["open_record_count"] + item["closed_record_count"]))
    return pairs


def unique_ids(rows: list[dict[str, Any]], limit: int) -> list[str]:
    ids: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for record_id in row.get("example_ids", []):
            if record_id not in seen:
                ids.append(record_id)
                seen.add(record_id)
            if len(ids) >= limit:
                return ids
    return ids


def family_rule(records: list[dict[str, Any]], state_family: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    scored = [(config["score"](record), record) for record in records]
    selected = [record for score, record in scored if score >= config["threshold"]]
    selected.sort(key=lambda record: (-config["score"](record), record["record_id"]))
    boundary = [record for score, record in scored if config["threshold"] - 2 <= score < config["threshold"]]
    boundary.sort(key=lambda record: (-config["score"](record), record["record_id"]))

    windows = summarize_windows(selected, config["focus_axes"])
    common_windows = [row for row in windows if row["condition_bucket"] not in MINORITY_CONDITION_BUCKETS][:8]
    minority_windows = [row for row in windows if row["condition_bucket"] in MINORITY_CONDITION_BUCKETS][:16]
    open_closed_pairs = pair_open_closed_windows(windows)[:10]
    boundary_ids = pick_diverse(boundary, 14)
    representative_ids = state_family.get("representative_ids", [])[:14]

    note = FAMILY_RULE_NOTES[config["family_id"]]
    return {
        "family_id": config["family_id"],
        "title": config["title"],
        "status": STATUS,
        "record_count": state_family["record_count"],
        "boundary_record_count": state_family["boundary_record_count"],
        "threshold": config["threshold"],
        "route_label": note["route_label"],
        "split_dimensions": note["split_dimensions"],
        "avoid": note["avoid"],
        "minimum_case_rule": f"{MINIMUM_CASES}件未満のcondition-state windowは命題化せず探索保留。",
        "llm_required_when": [
            "minority_condition_windowが10件以上ある",
            "open_stateとclosed_stateが同じcondition/axis package内に併存する",
            "boundary_score帯に代表IDが多い",
            "narrative_lensが薄く構造化回答中心である",
            "支援・配慮・制度の有効性判断へ滑りそうなとき",
        ],
        "common_windows": common_windows,
        "minority_windows": minority_windows,
        "open_closed_pairs": open_closed_pairs,
        "read_packets": [
            {
                "packet_id": f"{config['family_id']}-common-core",
                "purpose": "多数窓の共通構造を読む。多数派条件に最終命題を独占させない。",
                "record_ids": representative_ids,
            },
            {
                "packet_id": f"{config['family_id']}-minority-condition",
                "purpose": "視覚、聴覚、認知・発達・知的、内部障害・全身管理の条件窓で、同じ構造がどう別形態を取るか読む。",
                "record_ids": unique_ids(minority_windows, 16),
            },
            {
                "packet_id": f"{config['family_id']}-open-closed-polarity",
                "purpose": "問題側と軽減/開きかけ側を同じ構造の開閉状態として読む。支援有効性判断にはしない。",
                "record_ids": unique_ids(
                    [
                        {"example_ids": pair["open_example_ids"] + pair["closed_example_ids"]}
                        for pair in open_closed_pairs
                    ],
                    16,
                ),
            },
            {
                "packet_id": f"{config['family_id']}-boundary-return",
                "purpose": "このfamilyへ上げすぎたIDを、別構造へ戻すために読む。",
                "record_ids": boundary_ids,
            },
        ],
    }


def build_payload() -> dict[str, Any]:
    records = load_json(RECORD_INDEX_JSON)["records"]
    state_index = load_json(STRUCTURAL_STATE_INDEX_JSON)
    state_by_family = {family["family_id"]: family for family in state_index["structural_families"]}
    rules = [family_rule(records, state_by_family[config["family_id"]], config) for config in FAMILY_CONFIGS]
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-family-scale-rules-v0-2026-05-18",
        "status": STATUS,
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "Bundle A-Dで得た構造読解を、全件分析で使う分岐ルールとLLM読解対象選定規則へ変換する。",
        "source_artifacts": [
            str(RECORD_INDEX_JSON.relative_to(ROOT)),
            str(STRUCTURAL_STATE_INDEX_JSON.relative_to(ROOT)),
            str(STRUCTURAL_RENAMING_MD.relative_to(ROOT)),
            str(BUNDLE_D_MD.relative_to(ROOT)),
        ],
        "global_guards": [
            "疾病・障害種類を最終分類にしない。",
            "同じ構造の開いた状態と閉じた状態を別パターンに切断しない。",
            "10件未満の窓は命題化せず探索保留にする。",
            "支援有効性、配慮妥当性、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
        ],
        "structural_family_rule_count": len(rules),
        "structural_family_scale_rules": rules,
    }


def md_ids(ids: list[str]) -> str:
    return ", ".join(f"`{record_id}`" for record_id in ids) if ids else "なし"


def markdown(payload: dict[str, Any]) -> str:
    lines: list[str] = [
        "# Stage 1 Production Structural Family Scale Rules",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "Bundle A-Dで得た構造読解を、全件分析で使う分岐ルールとLLM読解対象選定規則へ変換した。これは最終知識ではなく、次の文脈読解を多数派バイアスに流さず進めるための作業規則である。",
        "",
        "## Global Guards",
        "",
    ]
    for guard in payload["global_guards"]:
        lines.append(f"- {guard}")
    lines.extend(["", "## Rule Overview", "", "| family | records | boundary | route | minority windows | polarity pairs |", "|---|---:|---:|---|---:|---:|"])
    for rule in payload["structural_family_scale_rules"]:
        lines.append(
            f"| `{rule['family_id']}` {rule['title']} | {rule['record_count']} | {rule['boundary_record_count']} | {rule['route_label']} | {len(rule['minority_windows'])} | {len(rule['open_closed_pairs'])} |"
        )

    lines.extend(["", "## Structural Family Rules", ""])
    for rule in payload["structural_family_scale_rules"]:
        lines.extend(
            [
                f"### {rule['family_id']} {rule['title']}",
                "",
                f"- records: {rule['record_count']}",
                f"- boundary records: {rule['boundary_record_count']}",
                f"- route: {rule['route_label']}",
                f"- split dimensions: {', '.join(rule['split_dimensions'])}",
                f"- avoid: {rule['avoid']}",
                f"- minimum case rule: {rule['minimum_case_rule']}",
                "",
                "#### LLM Required When",
                "",
            ]
        )
        for item in rule["llm_required_when"]:
            lines.append(f"- {item}")

        lines.extend(["", "#### Common Windows", "", "| condition | package | state | records | examples |", "|---|---|---|---:|---|"])
        for window in rule["common_windows"][:6]:
            lines.append(
                f"| {window['condition_bucket']} | `{window['axis_package']}` | {window['state']} | {window['record_count']} | {md_ids(window['example_ids'][:6])} |"
            )

        lines.extend(["", "#### Minority Condition Windows", "", "| condition | package | state | records | examples |", "|---|---|---|---:|---|"])
        for window in rule["minority_windows"][:8]:
            lines.append(
                f"| {window['condition_bucket']} | `{window['axis_package']}` | {window['state']} | {window['record_count']} | {md_ids(window['example_ids'][:6])} |"
            )

        lines.extend(["", "#### Open / Closed Polarity Pairs", "", "| condition | package | open | closed |", "|---|---|---|---|"])
        for pair in rule["open_closed_pairs"][:6]:
            lines.append(
                f"| {pair['condition_bucket']} | `{pair['axis_package']}` | {pair['open_state']} {pair['open_record_count']}: {md_ids(pair['open_example_ids'][:4])} | {pair['closed_state']} {pair['closed_record_count']}: {md_ids(pair['closed_example_ids'][:4])} |"
            )

        lines.extend(["", "#### Read Packets", ""])
        for packet in rule["read_packets"]:
            lines.append(f"- `{packet['packet_id']}`: {packet['purpose']} IDs: {md_ids(packet['record_ids'])}")
        lines.append("")

    lines.extend(
        [
            "## Immediate Use",
            "",
            "- 次の本番LLM文脈読解は、各familyの `minority-condition` と `open-closed-polarity` を優先して、共通構造と多様性条件の両方を読む。",
            "- 共通窓だけで命題を確定しない。少数条件窓と境界復帰パケットで反対構造を確保する。",
            "- この成果物は、全件分析の分岐規則であり、レビュー済み知識や公開用説明ではない。",
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
