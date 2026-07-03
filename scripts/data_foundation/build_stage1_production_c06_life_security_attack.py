#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
FOUR_PLACEMENT_JSON = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
C06_DEEP_JSON = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c06-life-security-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c06-life-security-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C06_CONTACT = "C-06-life-security-work-choice"
C06_FREEDOMS = ["収入保障", "医療費", "家計責任", "雇用形態", "制度対象", "休業時保障", "生活再建"]

SIGNAL_BUCKETS = {
    "収入・賃金": ["収入", "賃金", "給与", "所得", "生活費", "家計"],
    "医療費・治療継続": ["医療費", "治療", "通院", "服薬", "医療", "費用"],
    "家計責任・扶養": ["家計", "家族", "扶養", "責任", "生活"],
    "雇用形態・時間": ["雇用形態", "正社員", "パート", "短時間", "勤務時間", "休職"],
    "制度対象・資格": ["制度", "手帳", "対象", "資格", "年金", "助成", "雇用率"],
    "休業・復職": ["休業", "休職", "復職", "欠勤", "休暇", "再開"],
    "生活再建・地域": ["生活再建", "地域", "住まい", "日中活動", "安心", "自信"],
    "仕事選択・入口": ["求人", "応募", "仕事選択", "就職", "再就職", "訓練"],
    "支援接続": ["相談", "支援", "福祉", "医療", "連携", "サービス"],
}

DIVERSITY_BUCKETS = {
    "体調変動・疲労・痛み": ["疲れ", "体調", "痛み", "活力", "崩れ", "進行"],
    "治療時間・難病": ["難病", "慢性", "通院", "治療", "免疫", "透析", "服薬"],
    "移動・姿勢・身体操作": ["歩行", "運動", "平衡", "切断", "肢体", "移動", "姿勢", "損傷"],
    "視覚情報": ["弱視", "視野", "視覚"],
    "聴覚・音声情報": ["難聴", "ろう", "聴覚"],
    "認知・発達・知的": ["知的", "発達", "学習", "高次脳", "注意"],
    "精神・心理": ["精神", "気分", "不安", "統合失調", "パニック"],
}

FREEDOM_READINGS = {
    "収入保障": {
        "attack_id": "C06S-1",
        "title": "収入保障は所得量ではなく、仕事選択と健康時間をつなぐ安全余地",
        "candidate_proposition": "収入保障の自由度は、収入の多寡ではなく、治療、休職、短時間勤務、職務変更、再就職の選択肢を狭めずに保てるかで現れる可能性。",
        "counter_proposition": "収入保障に見える信号は、雇用形態、家計責任、制度対象、地域求人の問題かもしれない。",
        "review_question": "収入保障が支えている、または狭めている選択肢は、治療継続、短時間勤務、休職、復職、再就職、支援利用のどれか。",
    },
    "医療費": {
        "attack_id": "C06S-2",
        "title": "医療費は費用問題ではなく、治療継続と仕事選択の接続面",
        "candidate_proposition": "医療費の自由度は、費用負担だけではなく、治療継続、勤務時間、収入、制度利用、仕事選択が同時に制約される接続面として現れる可能性。",
        "counter_proposition": "医療費に見える信号は、健康時間、制度対象、収入保障、家計責任の境界かもしれない。",
        "review_question": "医療費が変えているのは、治療継続、勤務時間、休職、制度利用、職種選択、生活再建のどれか。",
    },
    "家計責任": {
        "attack_id": "C06S-3",
        "title": "家計責任は個人事情ではなく、選べる仕事条件を変える制約面",
        "candidate_proposition": "家計責任の自由度は、家庭事情ではなく、働き方、収入、通院、休業、支援利用、再就職の順序を制約する面として現れる可能性。",
        "counter_proposition": "家計責任に見える信号は、収入保障、制度対象、本人希望、地域求人の問題かもしれない。",
        "review_question": "家計責任は、仕事を続ける、休む、戻る、変える、探す、支援を使う、のどれを制約しているか。",
    },
    "雇用形態": {
        "attack_id": "C06S-4",
        "title": "雇用形態は属性ではなく、保障・時間・評価を束ねる構造条件",
        "candidate_proposition": "雇用形態の自由度は、正規/非正規などの属性ではなく、収入保障、休業時保障、勤務時間、評価、制度対象、支援接続を束ねる構造条件として現れる可能性。",
        "counter_proposition": "雇用形態に見える信号は、仕事内容、健康時間、生活保障、制度対象の代理変数かもしれない。",
        "review_question": "雇用形態が束ねているのは、賃金、休業保障、勤務時間、評価、支援接続、職務変更のどれか。",
    },
    "制度対象": {
        "attack_id": "C06S-5",
        "title": "制度対象は分類ではなく、支援・求人・保障への入口を変える修飾因子",
        "candidate_proposition": "制度対象の自由度は、人を制度分類することではなく、支援利用、求人枠、収入保障、医療費、雇用形態への入口を広げも狭めもする修飾因子として現れる可能性。",
        "counter_proposition": "制度対象を主因にすると、仕事条件、健康時間、支援媒介、生活再建の構造を失う可能性。",
        "review_question": "制度対象は、何への入口を開き、何を狭めているのか。支援、求人、保障、医療費、雇用形態のどれか。",
    },
    "休業時保障": {
        "attack_id": "C06S-6",
        "title": "休業時保障は休む権利ではなく、健康時間の中断を仕事継続へ戻す緩衝面",
        "candidate_proposition": "休業時保障の自由度は、休めるかではなく、病状変化、治療、休職、復職、収入、役割維持が断絶しないようにする緩衝面として現れる可能性。",
        "counter_proposition": "休業時保障に見える信号は、C01健康時間、雇用形態、制度対象、職場内解釈の問題かもしれない。",
        "review_question": "休業時保障が緩衝しているのは、治療、回復、復職、役割、評価、収入、支援継続のどれか。",
    },
    "生活再建": {
        "attack_id": "C06S-7",
        "title": "生活再建は就労前の個人準備ではなく、仕事選択を取り戻す基盤自由度",
        "candidate_proposition": "生活再建の自由度は、本人の準備不足ではなく、生活リズム、収入、医療、地域、支援、就労自信を整え、仕事選択を取り戻す基盤として現れる可能性。",
        "counter_proposition": "生活再建に見える信号は、C08入口以前参加、C03支援接続、C02入口翻訳の問題かもしれない。",
        "review_question": "生活再建で取り戻すべき基盤は、生活リズム、医療、収入、地域、支援、訓練、就労自信のどれか。",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def load_rows() -> dict[str, dict[str, Any]]:
    rows: dict[str, dict[str, Any]] = {}
    for path in CASE_FILES:
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                row = json.loads(line)
                rows[row["record_id"]] = row
    return rows


def assignment_index() -> dict[str, dict[str, set[str]]]:
    result: dict[str, dict[str, set[str]]] = defaultdict(lambda: {"branches": set(), "boundary_tags": set()})
    for item in load_json(ASSIGN_JSON)["assignments"]:
        result[item["record_id"]]["branches"].update(item.get("candidate_branches", []))
        result[item["record_id"]]["boundary_tags"].update(item.get("boundary_tags", []))
    return result


def unique_preserve(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result


def text_items(row: dict[str, Any]) -> list[str]:
    keys = [
        "pre_employment_unresolved",
        "post_employment_unresolved",
        "accommodations_present",
        "accommodations_needed_absent",
        "readiness_unresolved",
        "job_search_unresolved",
        "support_use_gaps",
        "desired_supports",
        "consultation_gaps",
        "service_fit_gaps",
        "low_soc_or_life_signals",
        "narrative_context_labels",
    ]
    items: list[str] = []
    for key in keys:
        value = row.get(key)
        if isinstance(value, list):
            items.extend(str(item) for item in value)
    return items


def diversity_strings(row: dict[str, Any]) -> list[str]:
    output: list[str] = []
    for key in ["health_condition_groups", "body_function_signals", "impairment_signals", "handbook_signals"]:
        value = row.get(key)
        if isinstance(value, list):
            output.extend(str(item) for item in value)
    return output


def bucket_counts(strings: list[str], bucket_map: dict[str, list[str]]) -> Counter[str]:
    result: Counter[str] = Counter()
    for bucket, words in bucket_map.items():
        for item in strings:
            if any(word in item for word in words):
                result[bucket] += 1
                break
    return result


def four_placement_by_freedom() -> dict[str, dict[str, Any]]:
    rows = load_json(FOUR_PLACEMENT_JSON)["four_placement_candidates"]
    return {row["freedom"]: row for row in rows if row["contact_id"] == C06_CONTACT}


def placement_ids(row: dict[str, Any]) -> dict[str, list[str]]:
    return {
        "problem": row.get("problem_ids", []),
        "mitigation": row.get("mitigation_ids", []),
        "residual": row.get("residual_ids", []),
        "boundary": row.get("boundary_ids", []),
    }


def record_profile(record_ids: list[str], rows: dict[str, dict[str, Any]]) -> dict[str, Any]:
    source = Counter()
    status = Counter()
    pattern = Counter()
    signals = Counter()
    diversity = Counter()
    lens = Counter()
    missing: list[str] = []
    for record_id in record_ids:
        source[record_id.split(":", 1)[0]] += 1
        row = rows.get(record_id)
        if not row:
            missing.append(record_id)
            continue
        items = text_items(row)
        status[row.get("status_group", "unknown")] += 1
        pattern[row.get("pattern_cell_id", "unknown")] += 1
        signals.update(bucket_counts(items, SIGNAL_BUCKETS))
        diversity.update(bucket_counts(items + diversity_strings(row), DIVERSITY_BUCKETS))
        lens.update(row.get("narrative_lens_counts", {}))
    return {
        "source_counts": dict(source.most_common()),
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(8)),
        "signal_bucket_counts": dict(signals.most_common()),
        "diversity_bucket_counts": dict(diversity.most_common()),
        "lens_counts": dict(lens.most_common()),
        "missing_row_ids": missing,
    }


def c06_deep_summary() -> dict[str, Any]:
    data = load_json(C06_DEEP_JSON)
    return {
        "source_set": data["source_set"],
        "interpretive_result": data["interpretive_result"],
        "subbranches": [
            {
                "subbranch_id": item["subbranch_id"],
                "title": item["title"],
                "record_count": item["record_count"],
                "handling": item["handling"],
            }
            for item in data["subbranches"]
        ],
    }


def relation_summaries() -> list[dict[str, Any]]:
    ids = {
        "SR-C06-HEALTHTIME-LIFESECURITY",
        "SR-C06-SUPPORT-LIFESECURITY",
        "SR-C06-TRANSITION-LIFESECURITY",
        "SR-C06-EVALUATION-LIFESECURITY",
    }
    return [item for item in load_json(RELATION_JSON)["relations"] if item["relation_id"] in ids]


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C06A", "P1-C06B", "P1-C06C", "P1-C06D"}
    counts: Counter[str] = Counter()
    examples: list[str] = []
    freedoms: Counter[str] = Counter()
    for item in load_json(BRIDGE_JSON)["branch_bridge"]:
        if item["branch_id"] not in target_ids:
            continue
        counts.update(item.get("fragmentary_source_counts", {}))
        examples.extend(item.get("fragmentary_source_examples", [])[:4])
        freedoms.update({name: count for name, count in item.get("freedom_candidates", [])})
    return {
        "source_family_counts": dict(counts.most_common()),
        "example_source_ids": unique_preserve(examples)[:12],
        "freedom_candidates": dict(freedoms.most_common(16)),
    }


def build_attack() -> dict[str, Any]:
    rows = load_rows()
    assignments = assignment_index()
    placements = four_placement_by_freedom()
    attacks: list[dict[str, Any]] = []
    for freedom in C06_FREEDOMS:
        placement = placements[freedom]
        ids_by_placement = placement_ids(placement)
        listed_ids = unique_preserve(
            ids_by_placement["problem"]
            + ids_by_placement["mitigation"]
            + ids_by_placement["residual"]
            + ids_by_placement["boundary"]
        )
        profile = record_profile(listed_ids, rows)
        branch_counts: Counter[str] = Counter()
        boundary_counts: Counter[str] = Counter()
        for record_id in listed_ids:
            branch_counts.update(assignments[record_id]["branches"])
            boundary_counts.update(assignments[record_id]["boundary_tags"])
        reading = FREEDOM_READINGS[freedom]
        attacks.append(
            {
                "attack_id": reading["attack_id"],
                "freedom": freedom,
                "title": reading["title"],
                "candidate_record_count": placement["problem_count"]
                + placement["mitigation_count"]
                + placement["residual_count"]
                + placement["boundary_count"],
                "listed_id_count": len(listed_ids),
                "four_placement": {
                    "problem": placement["problem_count"],
                    "mitigation": placement["mitigation_count"],
                    "residual": placement["residual_count"],
                    "boundary": placement["boundary_count"],
                    "readiness": placement["readiness"],
                    "listed_problem_ids": ids_by_placement["problem"],
                    "listed_mitigation_ids": ids_by_placement["mitigation"],
                    "listed_residual_ids": ids_by_placement["residual"],
                    "listed_boundary_ids": ids_by_placement["boundary"],
                },
                "representative_ids": listed_ids[:8],
                "candidate_proposition": reading["candidate_proposition"],
                "counter_proposition": reading["counter_proposition"],
                "review_question": reading["review_question"],
                "profile": profile,
                "branch_counts": dict(branch_counts.most_common(8)),
                "boundary_tag_counts": dict(boundary_counts.most_common(8)),
                "method_note": "生活困窮や意欲ではなく、仕事選択、健康時間、支援接続、評価処遇を変える制約面として読む。",
            }
        )
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "non_judgment_boundary": "制度該当性、給付判断、支援妥当性、就労可否、ケース正誤は判断しない。",
        "purpose": "C06を、生活困窮や意欲ではなく、仕事選択と健康時間を制約する生活保障面として割り直す。",
        "attack_result": "C06は生活困窮や意欲ではなく、収入保障、医療費、家計責任、雇用形態、制度対象、休業時保障、生活再建が、仕事選択・健康時間・支援接続・評価処遇を同時に変える制約面として読む必要がある。",
        "methodological_gain": "生活保障を背景情報ではなく構造自由度として読むことで、同じ健康条件でも選べる仕事・使える支援・保てる健康時間が変わる理由を保持できる。",
        "c06_deep_summary": c06_deep_summary(),
        "relation_summaries": relation_summaries(),
        "fragmentary_bridge": fragmentary_bridge(),
        "attacks": attacks,
    }


def fmt_counter(counter: dict[str, int]) -> str:
    if not counter:
        return "なし"
    return ", ".join(f"{key}:{value}" for key, value in counter.items())


def write_markdown(data: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production C06 Life Security Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C06を、生活困窮や意欲ではなく、仕事選択と健康時間を制約する生活保障面として再分析した。",
        "",
        "## 結果",
        "",
        data["attack_result"],
        "",
        "## 方法上の獲得",
        "",
        data["methodological_gain"],
        "",
        "## 広い構造面",
        "",
        f"- C06 target records: {data['c06_deep_summary']['source_set']['c06_life_security_boundary_records']}",
        f"- C06 reviewable subbranches: {data['c06_deep_summary']['source_set']['reviewable_subbranches']}",
    ]
    for relation in data["relation_summaries"]:
        lines.append(f"- deep relation `{relation['relation_id']}` records: {relation['record_count']} / {relation['reading']}")

    lines.extend(["", "## 7つの生活保障自由度", "", "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |", "|---|---|---:|---:|---:|---|---|"])
    for attack in data["attacks"]:
        placement = attack["four_placement"]
        reps = ", ".join(f"`{record_id}`" for record_id in attack["representative_ids"][:5])
        lines.append(
            f"| `{attack['attack_id']}` | {attack['freedom']} | {attack['candidate_record_count']} | {attack['listed_id_count']} | "
            f"{placement['problem']}/{placement['mitigation']}/{placement['residual']}/{placement['boundary']} | {attack['title']} | {reps} |"
        )

    lines.extend(["", "## Detail", ""])
    for attack in data["attacks"]:
        placement = attack["four_placement"]
        profile = attack["profile"]
        lines.extend(
            [
                f"### {attack['attack_id']} {attack['title']}",
                "",
                f"自由度: {attack['freedom']}",
                f"candidate record数: {attack['candidate_record_count']}",
                f"listed ID数: {attack['listed_id_count']}",
                f"placement: problem {placement['problem']} / mitigation {placement['mitigation']} / residual {placement['residual']} / boundary {placement['boundary']}",
                f"listed placement IDs: problem {len(placement['listed_problem_ids'])} / mitigation {len(placement['listed_mitigation_ids'])} / residual {len(placement['listed_residual_ids'])} / boundary {len(placement['listed_boundary_ids'])}",
                f"攻撃前readiness: {placement['readiness']}",
                "代表ID: " + ", ".join(f"`{record_id}`" for record_id in attack["representative_ids"]),
                "残余ID: " + (", ".join(f"`{record_id}`" for record_id in placement["listed_residual_ids"][:8]) if placement["listed_residual_ids"] else "なし"),
                "境界ID: " + (", ".join(f"`{record_id}`" for record_id in placement["listed_boundary_ids"][:8]) if placement["listed_boundary_ids"] else "なし"),
                "",
                f"候補命題: {attack['candidate_proposition']}",
                "",
                f"反対命題: {attack['counter_proposition']}",
                "",
                f"レビューで見る問い: {attack['review_question']}",
                "",
                "分布:",
                f"- source: {fmt_counter(profile['source_counts'])}",
                f"- status_group: {fmt_counter(profile['status_group_counts'])}",
                f"- pattern_cell: {fmt_counter(profile['pattern_cell_counts'])}",
                f"- signal_bucket: {fmt_counter(profile['signal_bucket_counts'])}",
                f"- diversity_bucket: {fmt_counter(profile['diversity_bucket_counts'])}",
                f"- narrative_lens: {fmt_counter(profile['lens_counts'])}",
                f"- branch: {fmt_counter(attack['branch_counts'])}",
                f"- boundary_tag: {fmt_counter(attack['boundary_tag_counts'])}",
                "- row_missing_for_external_ids: "
                + (", ".join(f"`{record_id}`" for record_id in profile["missing_row_ids"]) if profile["missing_row_ids"] else "なし"),
                "",
                f"方法メモ: {attack['method_note']}",
                "",
            ]
        )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    data = build_attack()
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
