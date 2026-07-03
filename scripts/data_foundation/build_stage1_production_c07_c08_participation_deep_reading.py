#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
FOUR_PLACEMENT_JSON = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.md"
MIN_REVIEWABLE_RECORDS = 10

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

CURRENT_STATUSES = {"currently_working"}
NONCURRENT_STATUSES = {
    "not_working_wants_work",
    "job_transition_or_training",
    "never_worked",
    "past_work_not_current",
    "no_current_work_wish",
    "unknown_or_other",
}


def load_records() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]], list[dict[str, Any]]]:
    records: dict[str, dict[str, Any]] = defaultdict(lambda: {"branches": set(), "boundary_tags": set(), "source": ""})
    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    for item in assignments:
        record = records[item["record_id"]]
        record["branches"].update(item["candidate_branches"])
        record["boundary_tags"].update(item.get("boundary_tags", []))
        record["source"] = item["source"]

    rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                rows[row["record_id"]] = row

    four_placement = json.loads(FOUR_PLACEMENT_JSON.read_text(encoding="utf-8"))["four_placement_candidates"]
    return dict(records), rows, four_placement


def has_branch(record: dict[str, Any], *branch_ids: str) -> bool:
    return bool(set(branch_ids) & record["branches"])


def has_tag(record: dict[str, Any], *tag_ids: str) -> bool:
    return bool(set(tag_ids) & record["boundary_tags"])


def c07_profile(record: dict[str, Any], row: dict[str, Any]) -> dict[str, bool]:
    status_group = row.get("status_group")
    return {
        "current_work_context": status_group in CURRENT_STATUSES,
        "noncurrent_context": status_group in NONCURRENT_STATUSES,
        "evaluation_life_security_boundary": has_tag(record, "P1-C06E"),
        "information_participation_boundary": has_tag(record, "P1-C04B", "P1-C05E")
        or has_branch(record, "P1-C04A-1", "P1-C04A-2", "P1-C04A-3"),
        "entry_translation_bridge": has_branch(record, "P1-C02A", "P1-C02B") or has_tag(record, "P1-C02C", "P1-C02D"),
        "support_bridge": has_branch(record, "P1-C03A", "P1-C03B", "P1-C03C") or has_tag(record, "P1-C03D", "P1-C06C"),
        "health_time_bridge": has_branch(record, "P1-C01A", "P1-C01B", "P1-C01C") or has_tag(record, "P1-C01D", "P1-C06D"),
        "worksite_bridge": has_branch(record, "P1-C05A", "P1-C05B", "P1-C05D") or has_tag(record, "P1-C05C", "P1-C05E"),
    }


def c08_profile(record: dict[str, Any], row: dict[str, Any]) -> dict[str, bool]:
    status_group = row.get("status_group")
    return {
        "never_worked": status_group == "never_worked",
        "past_work_not_current": status_group == "past_work_not_current",
        "job_transition_or_training": status_group == "job_transition_or_training",
        "not_working_wants_work": status_group == "not_working_wants_work",
        "nonwork_or_unknown": status_group in {"no_current_work_wish", "unknown_or_other"},
        "life_security_transition_pressure": has_tag(record, "P1-C06B"),
        "entry_translation_transition": has_branch(record, "P1-C02B") or has_tag(record, "P1-C02C", "P1-C02D"),
        "support_transition": has_branch(record, "P1-C03B", "P1-C03C") or has_tag(record, "P1-C03D", "P1-C06C"),
        "health_time_transition": has_branch(record, "P1-C01C") or has_tag(record, "P1-C01D", "P1-C06D"),
        "worksite_transition": has_branch(record, "P1-C05D") or has_tag(record, "P1-C05C", "P1-C05E"),
        "information_transition": has_branch(record, "P1-C04A-3") or has_tag(record, "P1-C04B"),
    }


def classify_c07(profile: dict[str, bool]) -> str:
    if profile["current_work_context"] and profile["evaluation_life_security_boundary"] and profile["information_participation_boundary"]:
        return "C07R-1-current-evaluation-information-life-security"
    if profile["evaluation_life_security_boundary"] and (profile["entry_translation_bridge"] or profile["support_bridge"]):
        return "C07R-2-evaluation-through-translation-support"
    if profile["evaluation_life_security_boundary"] and profile["health_time_bridge"]:
        return "C07R-3-evaluation-health-time-continuity"
    if profile["evaluation_life_security_boundary"]:
        return "C07R-4-career-evaluation-residual-boundary"
    return "C07R-Z-mixed-or-low-context"


def classify_c08(profile: dict[str, bool]) -> str:
    if profile["never_worked"] and profile["life_security_transition_pressure"]:
        return "C08P-1-first-entry-life-readiness"
    if profile["past_work_not_current"] and (profile["health_time_transition"] or profile["entry_translation_transition"] or profile["support_transition"]):
        return "C08P-2-past-work-to-life-rebuilding"
    if profile["life_security_transition_pressure"] and (profile["entry_translation_transition"] or profile["support_transition"]):
        return "C08P-3-transition-readiness-to-entry-translation"
    if profile["life_security_transition_pressure"] and (profile["health_time_transition"] or profile["worksite_transition"]):
        return "C08P-4-health-body-readiness-boundary"
    if profile["nonwork_or_unknown"] and profile["life_security_transition_pressure"]:
        return "C08P-5-nonwork-orientation-life-boundary"
    return "C08P-Z-mixed-or-low-context"


def compact_distribution(record_ids: set[str], rows: dict[str, dict[str, Any]], profiles: dict[str, dict[str, bool]]) -> dict[str, Any]:
    source = Counter(record_id.split(":", 1)[0] for record_id in record_ids)
    status = Counter()
    pattern = Counter()
    diversity = Counter()
    job_type = Counter()
    axis = Counter()
    for record_id in record_ids:
        row = rows[record_id]
        status[row.get("status_group", "unknown")] += 1
        pattern[row.get("pattern_cell_id", "unknown")] += 1
        diversity.update(row.get("health_condition_groups", [])[:8])
        diversity.update(row.get("body_function_signals", [])[:8])
        diversity.update(row.get("impairment_signals", [])[:8])
        diversity.update(row.get("handbook_signals", [])[:8])
        job_type.update(row.get("job_type_signals", [])[:8])
        axis.update(key for key, value in profiles[record_id].items() if value)
    return {
        "source_counts": dict(source.most_common()),
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(10)),
        "diversity_anchor_counts": dict(diversity.most_common(14)),
        "job_type_counts": dict(job_type.most_common(10)),
        "axis_counts": dict(axis.most_common()),
    }


def placement_summary(four_placement: list[dict[str, Any]], contact_id: str) -> dict[str, Any]:
    rows = [row for row in four_placement if row["contact_id"] == contact_id]
    readiness = Counter(row["readiness"] for row in rows)
    totals = Counter()
    source_family = Counter()
    direct_ids: dict[str, list[str]] = {}
    for row in rows:
        totals["problem"] += row["problem_count"]
        totals["mitigation"] += row["mitigation_count"]
        totals["residual"] += row["residual_count"]
        totals["boundary"] += row["boundary_count"]
        ids = []
        for key in ("problem_ids", "mitigation_ids", "residual_ids", "boundary_ids"):
            ids.extend(row.get(key, [])[:6])
        direct_ids[row["freedom"]] = ids[:12]
        for source_id in ids:
            source_family[source_id.split(":", 1)[0]] += 1
    return {
        "contact_id": contact_id,
        "freedom_rows": len(rows),
        "readiness_counts": dict(readiness),
        "placement_totals": dict(totals),
        "source_family_counts_from_example_ids": dict(source_family),
        "direct_example_ids_by_freedom": direct_ids,
    }


def c07_specs() -> dict[str, dict[str, str]]:
    return {
        "C07R-1-current-evaluation-information-life-security": {
            "title": "就労中の評価・情報参加・生活保障境界",
            "candidate_proposition": "評価、処遇、責任、昇進、働きがいは、本人の意欲や満足だけではなく、情報参加と生活保障に接続する仕事参加の質として現れる可能性。",
            "counter_proposition": "これはC04情報参加またはC06生活保障の境界にすぎず、C07として独立して読むと過剰分割かもしれない。",
            "handling": "reviewable_quality_of_participation_subbranch",
        },
        "C07R-2-evaluation-through-translation-support": {
            "title": "評価処遇を入口翻訳・支援接続で読む枝",
            "candidate_proposition": "評価や処遇の自由度は、本人条件をどの役割・成果基準へ翻訳するか、支援がその翻訳をどう媒介するかによって変わる可能性。",
            "counter_proposition": "評価処遇ではなく、支援接続や入口翻訳の信号が強いだけかもしれない。",
            "handling": "reviewable_bridge_subbranch",
        },
        "C07R-3-evaluation-health-time-continuity": {
            "title": "評価・定着・健康時間継続境界",
            "candidate_proposition": "病状変化や健康時間がある場合、評価、役割拡大、定着は、安定稼働前提の評価基準と噛み合わないことで問題化する可能性。",
            "counter_proposition": "主構造はC01健康時間であり、評価やキャリア参加は副次的な結果にすぎない可能性。",
            "handling": "boundary_to_C01_not_standalone_promotion",
        },
        "C07R-4-career-evaluation-residual-boundary": {
            "title": "評価・役割・キャリア参加の残存境界",
            "candidate_proposition": "評価、役割、処遇、働きがい、定着に関係しうるが、現在の調査信号では問題側が薄く、構造の存在を低く見積もっている可能性。",
            "counter_proposition": "C07は現データでは独立候補にするだけの根拠がなく、C04/C06/C03の修飾条件として保持すべきかもしれない。",
            "handling": "structural_blind_spot_hold",
        },
        "C07R-Z-mixed-or-low-context": {
            "title": "混合または低文脈のキャリア参加信号",
            "candidate_proposition": "評価・役割・キャリア参加に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def c08_specs() -> dict[str, dict[str, str]]:
    return {
        "C08P-1-first-entry-life-readiness": {
            "title": "未就労から初回入口への生活準備接続",
            "candidate_proposition": "未就労から仕事入口へ向かう場合、生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信は、本人の準備不足ではなく、入口翻訳と支援接続の前段自由度として現れる可能性。",
            "counter_proposition": "初回入口の困難は、生活準備ではなく、求人条件、制度対象、支援接続、健康安定、本人希望の未確定で説明できる可能性がある。",
            "handling": "reviewable_prework_subbranch",
        },
        "C08P-2-past-work-to-life-rebuilding": {
            "title": "過去就労困難から生活再構築への枝",
            "candidate_proposition": "過去就労で健康時間、入口翻訳、支援接続、仕事環境の未整合が残ると、再就職前に生活再構築、体力、日中活動、就労自信の自由度として現れる可能性。",
            "counter_proposition": "これはC01/C02/C03の移行期持ち越しであり、C08として独立させると段階を増やしすぎる可能性がある。",
            "handling": "reviewable_transition_rebuilding_subbranch",
        },
        "C08P-3-transition-readiness-to-entry-translation": {
            "title": "生活準備から入口翻訳への接続",
            "candidate_proposition": "職業準備や再就職では、生活条件・体力・支援条件が求人条件と翻訳されないと、応募、訓練、実習、支援利用の自由度が狭まる可能性。",
            "counter_proposition": "入口翻訳や生活保障の構造で説明でき、C08の主構造ではない可能性がある。",
            "handling": "reviewable_bridge_to_C02_C03",
        },
        "C08P-4-health-body-readiness-boundary": {
            "title": "体力・健康時間・活動参加境界",
            "candidate_proposition": "体力や活動参加は、本人の努力量ではなく、健康時間、休息、身体操作、日中活動の接続自由度として現れる可能性。",
            "counter_proposition": "体力信号はC01健康時間やC05身体操作へ吸収すべき可能性がある。",
            "handling": "boundary_to_C01_C05_not_standalone_promotion",
        },
        "C08P-5-nonwork-orientation-life-boundary": {
            "title": "非就労志向・不明状態の生活参加境界",
            "candidate_proposition": "現在の就労希望が弱い、または不明な状態は、意欲不足ではなく、生活保障、健康時間、地域生活、日中活動、支援接続の自由度がまだ仕事入口へ接続していない状態かもしれない。",
            "counter_proposition": "仕事参加を前提化しすぎて、本人の非就労志向や別の生活価値を過剰に問題化している可能性がある。",
            "handling": "ethical_boundary_subbranch",
        },
        "C08P-Z-mixed-or-low-context": {
            "title": "混合または低文脈の就労前参加信号",
            "candidate_proposition": "就労入口以前の生活・体力・活動参加に関係しうるが、現信号だけでは自由度単位に分けない。",
            "counter_proposition": "分類規則が少数の重要構造を拾えていない可能性がある。",
            "handling": "hold_for_deeper_context_reading",
        },
    }


def make_subbranches(
    class_ids: dict[str, list[str]],
    specs: dict[str, dict[str, str]],
    target_ids: set[str],
    rows: dict[str, dict[str, Any]],
    profiles: dict[str, dict[str, bool]],
) -> list[dict[str, Any]]:
    subbranches = []
    for class_id, ids in sorted(class_ids.items()):
        ids_set = set(ids)
        spec = specs[class_id]
        handling = spec["handling"]
        if handling.startswith("reviewable") and len(ids) < MIN_REVIEWABLE_RECORDS:
            handling = "thin_signal_modifier_not_reviewable_alone"
        subbranches.append(
            {
                "subbranch_id": class_id,
                **spec,
                "handling": handling,
                "record_count": len(ids),
                "representative_ids": ids[:12],
                "contrast_ids": sorted(target_ids - ids_set)[:12],
                "distribution": compact_distribution(ids_set, rows, profiles),
            }
        )
    return subbranches


def main() -> None:
    records, rows, four_placement = load_records()

    c07_target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if "P1-C06E" in record["boundary_tags"]
    )
    c07_profiles = {record_id: c07_profile(records[record_id], rows[record_id]) for record_id in c07_target_ids}
    c07_class_ids: dict[str, list[str]] = defaultdict(list)
    for record_id in c07_target_ids:
        c07_class_ids[classify_c07(c07_profiles[record_id])].append(record_id)

    c08_target_ids = sorted(
        record_id
        for record_id, record in records.items()
        if "P1-C06B" in record["boundary_tags"]
        or (rows[record_id].get("status_group") in NONCURRENT_STATUSES and has_branch(record, "P1-C01C", "P1-C02B", "P1-C03B"))
    )
    c08_profiles = {record_id: c08_profile(records[record_id], rows[record_id]) for record_id in c08_target_ids}
    c08_class_ids: dict[str, list[str]] = defaultdict(list)
    for record_id in c08_target_ids:
        c08_class_ids[classify_c08(c08_profiles[record_id])].append(record_id)

    c07_subbranches = make_subbranches(c07_class_ids, c07_specs(), set(c07_target_ids), rows, c07_profiles)
    c08_subbranches = make_subbranches(c08_class_ids, c08_specs(), set(c08_target_ids), rows, c08_profiles)

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "source_set": {
            "c07_evaluation_life_security_boundary_records": len(c07_target_ids),
            "c08_prework_life_readiness_boundary_records": len(c08_target_ids),
            "minimum_reviewable_records_per_subbranch": MIN_REVIEWABLE_RECORDS,
        },
        "c07_interpretive_result": "C07は昇進や満足の話ではなく、評価基準、役割、処遇、技能習得、定着が、情報参加・支援接続・健康時間・生活保障と接触する仕事参加の質である。問題側が薄いこと自体が、調査設計上の盲点である可能性がある。",
        "c08_interpretive_result": "C08は本人の準備不足ではなく、生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信が、仕事入口へ接続する前段の参加構造である。",
        "scientific_discovery_candidate": "仕事参加は、就職できるか/働き続けるかだけでは閉じない。上方向には評価・役割・キャリア参加、手前側には生活・体力・活動参加があり、両者を読むことで、就労支援の自由度は入口と定着の二点モデルを超える。",
        "c07_direct_contact_summary": placement_summary(four_placement, "C-07-career-evaluation-role"),
        "c08_direct_contact_summary": placement_summary(four_placement, "C-08-prework-life-readiness"),
        "c07_subbranches": c07_subbranches,
        "c08_subbranches": c08_subbranches,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production C07/C08 Participation Deep Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 派生信号の構造再読解 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C07/C08を、就職・定着の主流パターンから漏れやすい上下方向の参加自由度として読み直した。",
        "",
        "## 結論",
        "",
        f"C07: {payload['c07_interpretive_result']}",
        "",
        f"C08: {payload['c08_interpretive_result']}",
        "",
        "## 科学的発見候補",
        "",
        payload["scientific_discovery_candidate"],
        "",
        f"C07 target records: {payload['source_set']['c07_evaluation_life_security_boundary_records']}",
        f"C08 target records: {payload['source_set']['c08_prework_life_readiness_boundary_records']}",
        f"minimum reviewable records per subbranch: {payload['source_set']['minimum_reviewable_records_per_subbranch']}",
        "",
        "## Direct Contact Summary",
        "",
        f"- C07 freedom rows: {payload['c07_direct_contact_summary']['freedom_rows']}, readiness: {payload['c07_direct_contact_summary']['readiness_counts']}, placements: {payload['c07_direct_contact_summary']['placement_totals']}",
        f"- C08 freedom rows: {payload['c08_direct_contact_summary']['freedom_rows']}, readiness: {payload['c08_direct_contact_summary']['readiness_counts']}, placements: {payload['c08_direct_contact_summary']['placement_totals']}",
        "",
        "## C07 Subbranches",
        "",
        "| subbranch | records | handling | representative IDs |",
        "|---|---:|---|---|",
    ]
    for branch in c07_subbranches:
        reps = ", ".join(f"`{rid}`" for rid in branch["representative_ids"][:6])
        lines.append(f"| `{branch['subbranch_id']}` {branch['title']} | {branch['record_count']} | {branch['handling']} | {reps} |")

    lines.extend(["", "## C08 Subbranches", "", "| subbranch | records | handling | representative IDs |", "|---|---:|---|---|"])
    for branch in c08_subbranches:
        reps = ", ".join(f"`{rid}`" for rid in branch["representative_ids"][:6])
        lines.append(f"| `{branch['subbranch_id']}` {branch['title']} | {branch['record_count']} | {branch['handling']} | {reps} |")

    for section_title, branches in (("C07 Detail", c07_subbranches), ("C08 Detail", c08_subbranches)):
        lines.extend(["", f"## {section_title}", ""])
        for branch in branches:
            dist = branch["distribution"]
            lines.extend(
                [
                    f"### {branch['subbranch_id']} {branch['title']}",
                    "",
                    f"record数: {branch['record_count']}",
                    f"代表ID: {', '.join(f'`{rid}`' for rid in branch['representative_ids'])}",
                    f"対照ID: {', '.join(f'`{rid}`' for rid in branch['contrast_ids'])}",
                    "",
                    f"候補命題: {branch['candidate_proposition']}",
                    "",
                    f"反対命題: {branch['counter_proposition']}",
                    "",
                    f"扱い: {branch['handling']}",
                    "",
                    "分布:",
                    f"- source: {', '.join(f'{key}:{value}' for key, value in dist['source_counts'].items())}",
                    f"- status_group: {', '.join(f'{key}:{value}' for key, value in dist['status_group_counts'].items())}",
                    f"- pattern_cell: {', '.join(f'{key}:{value}' for key, value in dist['pattern_cell_counts'].items())}",
                    f"- diversity_anchor: {', '.join(f'{key}:{value}' for key, value in dist['diversity_anchor_counts'].items())}",
                    f"- job_type: {', '.join(f'{key}:{value}' for key, value in dist['job_type_counts'].items())}",
                    f"- axis: {', '.join(f'{key}:{value}' for key, value in dist['axis_counts'].items())}",
                    "",
                ]
            )

    lines.extend(
        [
            "## 方法上の修正",
            "",
            "- C07を、昇進・満足・やりがいの周辺話題として捨てない。仕事参加の質、役割、評価、処遇、定着の自由度として保持する。",
            "- C08を、本人の準備不足や意欲不足として読まない。仕事入口へ接続する前段の生活・体力・活動参加構造として読む。",
            "- C07/C08は、問題側が薄いことを根拠不足として切り捨てず、調査設計が拾いにくい構造的盲点として扱う。",
            "- ただし、現段階では支援妥当性、評価妥当性、就労可否、本人意欲の判断には使わない。",
            "",
        ]
    )
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
