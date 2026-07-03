#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Callable


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RECORD_INDEX_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
BRANCH_ASSIGNMENTS_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-rcp-record-structure-lattice-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-rcp-record-structure-lattice-v0-2026-05-18.md"


STATUS = "machine_generated_unreviewed_no_promotion"
AXES = [
    "C01-health-time",
    "C02-entry-translation",
    "C03-support-continuity",
    "C04-information-participation",
    "C05-worksite-contact",
    "C06-life-security",
]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def record_axes(record: dict[str, Any]) -> set[str]:
    return set(record.get("primary_axes", [])) | set(record.get("boundary_axes", []))


def has_axis(record: dict[str, Any], axis: str) -> bool:
    return axis in record_axes(record)


def has_lens(record: dict[str, Any], lens: str) -> bool:
    return lens in record.get("narrative_lens_counts", {})


def diversity_buckets(signals: list[str]) -> set[str]:
    buckets: set[str] = set()
    text = " / ".join(signals)
    if any(k in text for k in ["難病", "慢性", "免疫", "消化器", "神経", "筋疾患", "服薬", "治療", "通院", "医師", "病状", "皮膚"]):
        buckets.add("治療時間・難病/慢性疾患")
    if any(k in text for k in ["疲れ", "体調変動", "無理で崩れ", "活力", "集中力", "痛み"]):
        buckets.add("疲労・痛み・変動")
    if any(k in text for k in ["運動協調", "歩行", "下肢", "上肢", "切断", "身体障害等級", "身体障害者手帳"]):
        buckets.add("移動・姿勢・身体操作")
    if any(k in text for k in ["弱視", "視野", "視覚", "盲"]):
        buckets.add("視覚情報")
    if any(k in text for k in ["難聴", "聴覚", "音声", "発声", "言語"]):
        buckets.add("聴覚・音声情報")
    if any(k in text for k in ["知的", "療育", "発達", "高次脳"]):
        buckets.add("認知・発達・知的")
    if any(k in text for k in ["精神", "心理"]):
        buckets.add("精神・心理")
    if any(k in text for k in ["心臓", "腎臓", "呼吸", "内部障害", "ぼうこう", "直腸", "肝臓"]):
        buckets.add("内部障害・全身管理")
    if not buckets:
        buckets.add("条件信号薄い/未分類")
    return buckets


def axis_package(record: dict[str, Any], include: list[str] | None = None) -> str:
    present = [axis.split("-", 1)[0] for axis in (include or AXES) if has_axis(record, axis)]
    return "+".join(present) if present else "axis-thin"


def branch_state(record: dict[str, Any]) -> set[str]:
    branches = set(record.get("candidate_branches", []))
    tags = set(record.get("boundary_tags", []))
    states: set[str] = set()
    if branches & {"P1-C01A", "P1-C04A-1"}:
        states.add("部分軽減・残存")
    if branches & {"P1-C01B", "P1-C04A-2"}:
        states.add("広範未整合")
    if branches & {"P1-C01C", "P1-C02B", "P1-C03B", "P1-C04A-3", "P1-C05D"}:
        states.add("移行・再就職持ち越し")
    if "P1-C03C" in branches:
        states.add("支援が翻訳機能を担う")
    if tags:
        states.add("境界接触")
    if not states:
        states.add("状態信号薄い")
    return states


def source_prefix(record_id: str) -> str:
    return record_id.split(":", 1)[0]


def rcp_score(record: dict[str, Any], rcp_id: str) -> int:
    axes = record_axes(record)
    tags = set(record.get("boundary_tags", []))
    branches = set(record.get("candidate_branches", []))
    status = record["status_group"]
    cell = record["pattern_cell_id"]
    score = 0
    if rcp_id == "RCP-01":
        score += 3 * (status == "currently_working")
        score += 2 * ("C06-life-security" in axes)
        score += 2 * ("C01-health-time" in axes)
        score += 2 * ("C03-support-continuity" in axes)
        score += 1 * ("C04-information-participation" in axes)
        score += 1 * has_lens(record, "participation")
        score += 1 * (cell.startswith("RC-02") or cell.startswith("EC-02") or cell.startswith("EC-03"))
    elif rcp_id == "RCP-02":
        score += 2 * (status in {"not_working_wants_work", "never_worked", "job_transition_or_training", "past_work_not_current"})
        score += 2 * ("C06-life-security" in axes)
        score += 2 * ("C02-entry-translation" in axes)
        score += 2 * ("C03-support-continuity" in axes)
        score += 2 * (cell.startswith("RC-10") or cell.startswith("EC-10"))
        score += 1 * ("P1-C06B" in tags)
    elif rcp_id == "RCP-03":
        score += 3 * ("C01-health-time" in axes)
        score += 3 * ("C06-life-security" in axes)
        score += 1 * ("C03-support-continuity" in axes)
        score += 1 * ("C02-entry-translation" in axes)
        score += 1 * has_lens(record, "health_management")
        score += 1 * has_lens(record, "body_function")
    elif rcp_id == "RCP-04":
        score += 2 * (status == "currently_working")
        score += 2 * ("C04-information-participation" in axes)
        score += 2 * ("C03-support-continuity" in axes)
        score += 2 * ("C06-life-security" in axes)
        score += 1 * ("C02-entry-translation" in axes)
        score += 1 * has_lens(record, "participation")
    elif rcp_id == "RCP-05":
        score += 3 * (status in {"never_worked", "not_working_wants_work", "job_transition_or_training"})
        score += 2 * ("C02-entry-translation" in axes)
        score += 2 * ("C03-support-continuity" in axes)
        score += 2 * ("C06-life-security" in axes)
        score += 1 * ("C01-health-time" in axes)
        score += 2 * (cell.startswith("RC-10") or cell.startswith("EC-10"))
    elif rcp_id == "RCP-06":
        score += 3 * ("C04-information-participation" in axes)
        score += 2 * ("C05-worksite-contact" in axes)
        score += 2 * ("C03-support-continuity" in axes)
        score += 1 * ("C02-entry-translation" in axes)
        score += 1 * has_lens(record, "participation")
        score += 1 * (status == "currently_working")
    return int(score)


def pick_diverse(records: list[dict[str, Any]], count: int) -> list[str]:
    picked: list[str] = []
    seen: set[str] = set()
    by_bucket: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        for bucket in sorted(diversity_buckets(record.get("diversity_signals", []))):
            by_bucket[bucket].append(record)
    for bucket in sorted(by_bucket, key=lambda b: (-len(by_bucket[b]), b)):
        for record in by_bucket[bucket]:
            rid = record["record_id"]
            if rid not in seen:
                picked.append(rid)
                seen.add(rid)
                break
        if len(picked) >= count:
            return picked
    for record in records:
        rid = record["record_id"]
        if rid not in seen:
            picked.append(rid)
            seen.add(rid)
        if len(picked) >= count:
            break
    return picked


def counter_map(records: list[dict[str, Any]]) -> dict[str, int]:
    counts = Counter()
    for record in records:
        counts["records"] += 1
        for key in ["source", "status_group", "pattern_cell_id"]:
            counts[f"{key}:{record[key]}"] += 1
        for axis in AXES:
            if has_axis(record, axis):
                counts[f"axis:{axis}"] += 1
        for state in branch_state(record):
            counts[f"state:{state}"] += 1
        for bucket in diversity_buckets(record.get("diversity_signals", [])):
            counts[f"diversity:{bucket}"] += 1
    return dict(counts)


def top_counter(counter: Counter[str], n: int = 8) -> dict[str, int]:
    return dict(counter.most_common(n))


def build_condition_windows(selected: list[dict[str, Any]], focus_axes: list[str]) -> list[dict[str, Any]]:
    windows: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for record in selected:
        pkg = axis_package(record, focus_axes)
        for bucket in diversity_buckets(record.get("diversity_signals", [])):
            windows[(bucket, pkg)].append(record)
    rows: list[dict[str, Any]] = []
    for (bucket, pkg), items in windows.items():
        if len(items) < 10:
            continue
        rows.append(
            {
                "condition_bucket": bucket,
                "axis_package": pkg,
                "record_count": len(items),
                "source_counts": top_counter(Counter(source_prefix(r["record_id"]) for r in items), 4),
                "status_counts": top_counter(Counter(r["status_group"] for r in items), 4),
                "state_counts": top_counter(Counter(s for r in items for s in branch_state(r)), 5),
                "example_ids": pick_diverse(items, 8),
            }
        )
    rows.sort(key=lambda row: (-row["record_count"], row["condition_bucket"], row["axis_package"]))
    return rows[:14]


def build_rcp(records: list[dict[str, Any]], config: dict[str, Any]) -> dict[str, Any]:
    scored = [(rcp_score(record, config["id"]), record) for record in records]
    selected = [record for score, record in scored if score >= config["threshold"]]
    selected.sort(key=lambda record: (-rcp_score(record, config["id"]), record["record_id"]))
    boundary = [record for score, record in scored if config["threshold"] - 2 <= score < config["threshold"]]
    boundary.sort(key=lambda record: (-rcp_score(record, config["id"]), record["record_id"]))
    selected_counter = Counter()
    branch_counter = Counter()
    lens_counter = Counter()
    axes_counter = Counter()
    package_counter = Counter()
    diversity_counter = Counter()
    for record in selected:
        for key in ["source", "status_group", "pattern_cell_id"]:
            selected_counter[f"{key}:{record[key]}"] += 1
        for axis in AXES:
            if has_axis(record, axis):
                axes_counter[axis] += 1
        for item in record.get("candidate_branches", []):
            branch_counter[item] += 1
        for item in record.get("boundary_tags", []):
            branch_counter[item] += 1
        for lens, value in record.get("narrative_lens_counts", {}).items():
            lens_counter[lens] += value
        for bucket in diversity_buckets(record.get("diversity_signals", [])):
            diversity_counter[bucket] += 1
        package_counter[axis_package(record, config["focus_axes"])] += 1
    high_threshold = max(config["threshold"] + 1, config["threshold"])
    high_set = [record for score, record in scored if score >= high_threshold]
    contrast_pool = [record for score, record in scored if score < config["threshold"] and record["source"] in {r["source"] for r in selected[:100]}]
    return {
        "rcp_id": config["id"],
        "title": config["title"],
        "status": STATUS,
        "candidate_selector": config["selector_note"],
        "focus_axes": config["focus_axes"],
        "threshold": config["threshold"],
        "candidate_record_count": len(selected),
        "high_resolution_record_count": len(high_set),
        "boundary_record_count": len(boundary),
        "source_counts": top_counter(Counter(r["source"] for r in selected), 6),
        "status_group_counts": top_counter(Counter(r["status_group"] for r in selected), 7),
        "pattern_cell_counts": top_counter(Counter(r["pattern_cell_id"] for r in selected), 10),
        "axis_counts": dict(axes_counter.most_common()),
        "branch_or_boundary_counts": top_counter(branch_counter, 12),
        "narrative_lens_counts": top_counter(lens_counter, 8),
        "condition_bucket_counts": top_counter(diversity_counter, 10),
        "axis_package_counts": top_counter(package_counter, 10),
        "condition_sensitive_windows": build_condition_windows(selected, config["focus_axes"]),
        "representative_ids": pick_diverse(selected, 18),
        "boundary_ids": pick_diverse(boundary, 18),
        "contrast_ids": pick_diverse(contrast_pool, 18),
        "sharpened_candidate_proposition": config["sharpened_candidate_proposition"],
        "sharpened_counter_proposition": config["sharpened_counter_proposition"],
        "resolution_gain": config["resolution_gain"],
        "next_reading_test": config["next_reading_test"],
        "non_judgment_boundary": "ケース正誤、支援妥当性、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
    }


def build_payload() -> dict[str, Any]:
    records = load_json(RECORD_INDEX_JSON)["records"]
    configs = [
        {
            "id": "RCP-01",
            "title": "長期キャリア参加は、健康時間・評価・生活保障を同時に再設計できるかで開閉する",
            "threshold": 11,
            "focus_axes": ["C07-quality-participation", "C01-health-time", "C06-life-security", "C03-support-continuity", "C04-information-participation"],
            "selector_note": "就労中 + C01/C03/C06接触 + C04/participation境界。C07は直接軸でなく参加品質の復元対象として扱う。",
            "sharpened_candidate_proposition": "就労継続中の参加品質は、健康時間を守りながら、支援・情報・職務設計を成果/役割/処遇/将来見通しへ翻訳できるかという複合自由度として現れる。",
            "sharpened_counter_proposition": "C07として見ているものは、C01/C03/C06の大規模境界を参加品質へ投影しただけで、評価・役割・処遇の独自構造をまだ十分に示していない可能性がある。",
            "resolution_gain": "雇用の質を満足度ではなく、健康時間と生活保障を含む条件付き遂行が職場価値へ翻訳される構造として読む。",
            "next_reading_test": "代表IDでは、健康時間・支援接続・生活保障が評価/役割/将来見通しへどう接続しているかを確認する。境界IDでは、C07にせずC01/C06に留めるべきケースを探す。",
        },
        {
            "id": "RCP-02",
            "title": "移行期の生活保障圧力は、求人選択・訓練参加・支援利用の順序を狭める",
            "threshold": 10,
            "focus_axes": ["C06-life-security", "C08-prework-participation", "C02-entry-translation", "C03-support-continuity"],
            "selector_note": "未就労/離職/移行 + C02/C03/C06 + RC/EC-10系。C08は入口以前参加として復元する。",
            "sharpened_candidate_proposition": "移行期では、生活保障圧力が求人条件、訓練、支援利用、健康回復、応募時期の順序を変え、入口翻訳の自由度を狭める。",
            "sharpened_counter_proposition": "生活保障圧力ではなく、求人不足、健康安定、支援接続、本人希望、制度対象の未確定が主構造である可能性がある。",
            "resolution_gain": "生活保障を背景ではなく、入口翻訳の順序と待てる時間を変える制約面として読む。",
            "next_reading_test": "代表IDで、収入/制度/生活再建が応募時期・訓練・支援利用の順序をどう変えるかを見る。境界IDで生活保障ではなく求人/支援/健康安定の問題を分ける。",
        },
        {
            "id": "RCP-03",
            "title": "健康時間と生活保障が接すると、続ける・休む・戻る・選び直す自由度が一体で変わる",
            "threshold": 9,
            "focus_axes": ["C01-health-time", "C06-life-security", "C03-support-continuity", "C02-entry-translation"],
            "selector_note": "C01/C06強接触 + health_management/body_function。C03/C02は休む・戻る・選び直す接続として扱う。",
            "sharpened_candidate_proposition": "健康時間と生活保障が接すると、短時間勤務、休むこと、復帰、職務変更、収入維持、再就職が別々でなく一つの自由度として開閉する。",
            "sharpened_counter_proposition": "生活保障は背景条件で、主構造はC01健康時間またはC02/C03の翻訳不足として説明できる可能性がある。",
            "resolution_gain": "治療/体調変動を就労可否ではなく、仕事と生活の時間配分を再設計する自由度として読む。",
            "next_reading_test": "代表IDで、休む・続ける・戻る・選び直すのどれが連動しているかを見る。境界IDで生活保障に接していない純C01を分ける。",
        },
        {
            "id": "RCP-04",
            "title": "評価処遇は、条件付き遂行を職場の価値へ翻訳する規則である",
            "threshold": 9,
            "focus_axes": ["C07-quality-participation", "C04-information-participation", "C03-support-continuity", "C06-life-security", "C02-entry-translation"],
            "selector_note": "就労中 + C04/C03/C06 + participation境界。直接C07 12件はsentinel、ここでは大規模橋渡し枝を読む。",
            "sharpened_candidate_proposition": "評価処遇は、配慮・支援・情報保障・健康時間を使った条件付き遂行を、成果/責任/技能/処遇へ翻訳する職場規則として現れる。",
            "sharpened_counter_proposition": "評価処遇に見えるものは、職務量、雇用形態、生活保障、支援接続、情報参加の未整合を一か所に集めているだけかもしれない。",
            "resolution_gain": "評価を能力判定ではなく、遂行条件を価値へ翻訳する制度的・職場的ルールとして読む。",
            "next_reading_test": "代表IDで、何が評価対象から落ちているかを成果/安定稼働/役割/技能/支援利用に分ける。境界IDで評価ではなく情報・職務負荷・生活保障の主問題を分ける。",
        },
        {
            "id": "RCP-05",
            "title": "入口以前参加は、本人の準備不足ではなく、仕事入口へ接続する前段自由度である",
            "threshold": 10,
            "focus_axes": ["C08-prework-participation", "C02-entry-translation", "C03-support-continuity", "C01-health-time", "C06-life-security"],
            "selector_note": "未就労/求職/移行 + C02/C03/C06 + C01/RC10。C08は本人責任でなく入口以前の接続自由度として扱う。",
            "sharpened_candidate_proposition": "生活リズム、体力、日中活動、家族/地域、訓練、自信は、本人の準備不足ではなく、求人条件と支援条件へ接続する前段自由度として現れる。",
            "sharpened_counter_proposition": "C08は独立構造ではなく、C02入口翻訳、C03支援接続、C06生活保障、C01健康時間の組み合わせとして十分説明できる可能性がある。",
            "resolution_gain": "就職前の生活/活動を個人属性でなく、入口翻訳を成立させる前段参加構造として読む。",
            "next_reading_test": "代表IDで、睡眠/日中活動/体力/訓練/家族/地域/自信のどれが求人条件へ未接続かを見る。境界IDで非就労志向を問題化していないか確認する。",
        },
        {
            "id": "RCP-06",
            "title": "情報参加は、業務指示だけでなく、役割・評価・安全・キャリア参加へ同期する",
            "threshold": 9,
            "focus_axes": ["C04-information-participation", "C05-worksite-contact", "C03-support-continuity", "C02-entry-translation", "C07-quality-participation"],
            "selector_note": "C04強接触 + C05/C03/C02 + participation。情報形式ではなく、職場参加の同期構造として扱う。",
            "sharpened_candidate_proposition": "情報参加は、指示理解だけではなく、会議、確認、安全、非公式情報、役割期待、評価、技能習得へ同期することで仕事参加の質を左右する。",
            "sharpened_counter_proposition": "情報参加に見えるものは、職務量、対人関係、職場文化、評価制度、開示範囲の問題を情報形式へ寄せているだけかもしれない。",
            "resolution_gain": "情報を伝達手段ではなく、仕事参加・安全・評価・役割を同時に同期する自由度として読む。",
            "next_reading_test": "代表IDで、同期していない情報が指示/会議/研修/安全/評価/相談/非公式情報/役割期待のどれかを見る。境界IDで開示過多・プライバシー負担を反対構造として残す。",
        },
    ]
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-rcp-record-structure-lattice-v0-2026-05-18",
        "status": STATUS,
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "C06/C07/C08再圧縮命題をrecord索引へ戻し、共通構造と多様性条件ごとの自由度形状を同時に読むための構造格子。",
        "method_boundary": {
            "not_grouping_by_condition": "疾病群・障害種類を最終分類にせず、同じ構造自由度が条件ごとに別の形を取るかを見る。",
            "no_validity_decision": "支援有効性、配慮妥当性、就労可否、ケース正誤は判断しない。",
            "minimum_case_rule": "condition_sensitive_windowは10件未満なら命題化せず、探索窓に留める。",
        },
        "source_artifacts": [
            str(RECORD_INDEX_JSON.relative_to(ROOT)),
            str(BRANCH_ASSIGNMENTS_JSON.relative_to(ROOT)),
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-c06-c07-c08-recompressed-propositions-v0-2026-05-18.md",
        ],
        "rcp_lattice": [build_rcp(records, config) for config in configs],
    }


def markdown(payload: dict[str, Any]) -> str:
    lines: list[str] = [
        "# Stage 1 Production RCP Record Structure Lattice",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C06/C07/C08の再圧縮命題を、調査record側へ戻して構造解像度を上げるための格子。疾病群・障害種類で人をまとめるのではなく、同じ構造自由度が、健康時間、情報参加、仕事接触点、生活保障、入口以前参加の条件下でどのように形を変えるかを読む。",
        "",
        "## Method Guard",
        "",
        "- 疾病・障害種類は最終分類ではなく、自由度の形を変える条件として扱う。",
        "- condition-sensitive window は10件未満なら命題化せず、探索窓に留める。",
        "- 支援有効性、配慮妥当性、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
        "",
        "## RCP Lattice",
        "",
    ]
    for row in payload["rcp_lattice"]:
        lines.extend(
            [
                f"### {row['rcp_id']} {row['title']}",
                "",
                f"- candidate records: {row['candidate_record_count']}",
                f"- high-resolution records: {row['high_resolution_record_count']}",
                f"- boundary records: {row['boundary_record_count']}",
                f"- selector: {row['candidate_selector']}",
                f"- sharpened candidate proposition: {row['sharpened_candidate_proposition']}",
                f"- sharpened counter-proposition: {row['sharpened_counter_proposition']}",
                f"- resolution gain: {row['resolution_gain']}",
                f"- next reading test: {row['next_reading_test']}",
                "",
                "#### Counts",
                "",
                f"- source: {', '.join(f'{k} {v}' for k, v in row['source_counts'].items())}",
                f"- status: {', '.join(f'{k} {v}' for k, v in row['status_group_counts'].items())}",
                f"- condition buckets: {', '.join(f'{k} {v}' for k, v in row['condition_bucket_counts'].items())}",
                f"- axis packages: {', '.join(f'`{k}` {v}' for k, v in row['axis_package_counts'].items())}",
                f"- branch/boundary: {', '.join(f'`{k}` {v}' for k, v in row['branch_or_boundary_counts'].items())}",
                "",
                "#### Representative / Boundary / Contrast IDs",
                "",
                f"- representative: {', '.join(f'`{rid}`' for rid in row['representative_ids'])}",
                f"- boundary: {', '.join(f'`{rid}`' for rid in row['boundary_ids'])}",
                f"- contrast: {', '.join(f'`{rid}`' for rid in row['contrast_ids'])}",
                "",
                "#### Condition-Sensitive Windows",
                "",
                "| condition bucket | axis package | records | states | example IDs |",
                "|---|---|---:|---|---|",
            ]
        )
        for window in row["condition_sensitive_windows"]:
            states = ", ".join(f"{k} {v}" for k, v in window["state_counts"].items())
            ids = ", ".join(f"`{rid}`" for rid in window["example_ids"])
            lines.append(
                f"| {window['condition_bucket']} | `{window['axis_package']}` | {window['record_count']} | {states} | {ids} |"
            )
        lines.append("")
    lines.extend(
        [
            "## How To Use Next",
            "",
            "- この格子で代表/境界/対照IDを選び、raw本文を引用せずにLLM文脈読解へ戻す。",
            "- 各RCPで、共通構造と条件ごとの自由度形状を分ける。",
            "- 直接信号が薄いC07/C08は、単独件数ではなく、C01-C06との接触面とsentinel IDで復元する。",
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
