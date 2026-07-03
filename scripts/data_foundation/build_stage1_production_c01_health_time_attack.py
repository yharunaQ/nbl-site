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
C01_DEEP_JSON = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c01-health-time-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c01-health-time-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C01_CONTACT = "C-01-health-time-work-design"
C01_FREEDOMS = ["勤務時間", "休暇・欠勤扱い", "休憩", "職務代替", "職場内解釈", "収入保障"]

SIGNAL_BUCKETS = {
    "勤務時間・ペース": ["勤務時間", "短時間", "時短", "ペース", "残業", "時間"],
    "治療・通院": ["通院", "治療", "服薬", "医療", "受診"],
    "休息・回復": ["休憩", "回復", "疲れ", "休む", "無理", "体調"],
    "職務負荷・代替": ["仕事内容", "業務", "職務", "代替", "責任", "作業量", "負荷"],
    "職場内解釈": ["理解", "説明", "職場", "上司", "同僚", "配慮", "伝える"],
    "長期継続・復職": ["継続", "復職", "将来", "長期", "再発", "変化"],
    "生活保障・収入": ["収入", "生活", "賃金", "家計", "制度", "保障"],
    "作業場所・設備": ["作業場所", "設備", "通勤", "姿勢", "休憩所", "環境"],
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
    "勤務時間": {
        "attack_id": "C01T-1",
        "title": "勤務時間は短縮配慮ではなく、健康時間と責任遂行を同期する時間設計",
        "candidate_proposition": "勤務時間の自由度は、単に短くすることではなく、体調変動、治療、回復、業務量、責任範囲を同じ時間構造に乗せられるかで現れる可能性。",
        "counter_proposition": "勤務時間に見える信号は、仕事内容、通勤、生活保障、職場内解釈、支援接続の問題かもしれない。",
        "review_question": "時間を変えることで接続されるのは、治療、回復、業務量、責任、通勤、生活保障のどれか。",
    },
    "休暇・欠勤扱い": {
        "attack_id": "C01T-2",
        "title": "休暇・欠勤扱いは寛容さではなく、治療と役割継続を両立する制度面",
        "candidate_proposition": "休暇・欠勤扱いの自由度は、休ませることではなく、治療・体調変化・復職・役割維持・評価・収入保障が断絶しないようにする制度面として現れる可能性。",
        "counter_proposition": "休暇・欠勤扱いに見える信号は、生活保障、制度対象、職場理解、仕事内容代替の問題かもしれない。",
        "review_question": "休暇・欠勤扱いで守るべき接続は、治療、復職、評価、役割、収入、支援継続のどれか。",
    },
    "休憩": {
        "attack_id": "C01T-3",
        "title": "休憩は休ませる時間ではなく、回復を仕事サイクルへ組み込む自由度",
        "candidate_proposition": "休憩の自由度は、休憩時間の有無ではなく、疲労、痛み、服薬、集中、姿勢、作業場所を仕事の継続サイクルへ組み込めるかで現れる可能性。",
        "counter_proposition": "休憩に見える信号は、勤務時間、作業場所、設備、仕事内容、健康管理の境界かもしれない。",
        "review_question": "休憩が接続しているのは、疲労回復、服薬、姿勢、集中、安全、作業場所のどれか。",
    },
    "職務代替": {
        "attack_id": "C01T-4",
        "title": "職務代替は免除ではなく、健康時間を保ちながら役割を残す再配分",
        "candidate_proposition": "職務代替の自由度は、できない仕事を外すことではなく、体調変動や治療条件の中で責任・技能・評価を保つために業務を再配分することで現れる可能性。",
        "counter_proposition": "職務代替に見える信号は、C05の作業場所、C04の情報参加、C07の評価処遇の問題かもしれない。",
        "review_question": "代替されるべきなのは、身体負荷、時間負荷、対人負荷、安全確認、評価対象、責任範囲のどれか。",
    },
    "職場内解釈": {
        "attack_id": "C01T-5",
        "title": "職場内解釈は病気理解ではなく、健康時間を仕事の言葉へ変換する自由度",
        "candidate_proposition": "職場内解釈の自由度は、病気を理解してもらうことではなく、体調変動、治療、疲労、休憩、仕事内容、評価を職場で扱える言葉へ変換することで現れる可能性。",
        "counter_proposition": "職場内解釈に見える信号は、本人説明、情報参加、支援者媒介、職務設計の問題かもしれない。",
        "review_question": "職場内で解釈されるべき条件は、体調変動、治療、休憩、職務負荷、評価、長期継続のどれか。",
    },
    "収入保障": {
        "attack_id": "C01T-6",
        "title": "収入保障は生活問題ではなく、健康時間の中断を仕事選択へ接続する制約面",
        "candidate_proposition": "収入保障の自由度は、生活費の問題だけではなく、治療、休業、短時間勤務、復職、職務変更が仕事選択と生活継続にどう接続するかで現れる可能性。",
        "counter_proposition": "収入保障に見える信号は、C06生活保障、制度対象、雇用形態、地域求人の問題かもしれない。",
        "review_question": "収入保障が制約しているのは、休業、短時間勤務、治療継続、復職、仕事選択、支援利用のどれか。",
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
    return {row["freedom"]: row for row in rows if row["contact_id"] == C01_CONTACT}


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


def c01_deep_summary() -> dict[str, Any]:
    data = load_json(C01_DEEP_JSON)
    return {
        "source_set": data["source_set"],
        "interpretive_result": data["interpretive_result"],
        "scientific_discovery_candidate": data.get("scientific_discovery_candidate"),
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
    ids = {"SR-C01C03-LONGTERM-CONTINUITY", "SR-C05-WORKSITE-HEALTHTIME", "SR-C06-HEALTHTIME-LIFESECURITY"}
    return [item for item in load_json(RELATION_JSON)["relations"] if item["relation_id"] in ids]


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C01A", "P1-C01B", "P1-C01C", "P1-C01D"}
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
    for freedom in C01_FREEDOMS:
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
                "method_note": "健康状態の重さではなく、健康時間が仕事内容、責任、職場解釈、支援、生活保障へどう接続するかとして読む。",
            }
        )
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "non_judgment_boundary": "医療判断、就労可否、配慮充足、支援妥当性、ケース正誤は判断しない。",
        "purpose": "C01を、疾病・重症度ではなく、健康時間を仕事設計へ接続する自由度として割り直す。",
        "attack_result": "C01は病気や体調の問題ではなく、勤務時間、休暇・欠勤扱い、休憩、職務代替、職場内解釈、収入保障が、体調変動・治療・回復を仕事設計へ接続する健康時間構造として読む必要がある。",
        "methodological_gain": "健康時間を医学的制約ではなく、仕事参加の時間設計として読むことで、疾病群に引きずられず、同じ症状でも自由度が異なる構造を保持できる。",
        "c01_deep_summary": c01_deep_summary(),
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
        "# Stage 1 Production C01 Health Time Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C01を、疾病・重症度ではなく、健康時間を仕事設計へ接続する自由度として再分析した。",
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
        f"- C01 target records: {data['c01_deep_summary']['source_set']['c01a_or_c01b_or_c01c_records']}",
        f"- C01 reviewable subbranches: {data['c01_deep_summary']['source_set']['reviewable_subbranches']}",
    ]
    for relation in data["relation_summaries"]:
        lines.append(f"- deep relation `{relation['relation_id']}` records: {relation['record_count']} / {relation['reading']}")

    lines.extend(["", "## 6つの健康時間自由度", "", "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |", "|---|---|---:|---:|---:|---|---|"])
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
                "問題ID: " + (", ".join(f"`{record_id}`" for record_id in placement["listed_problem_ids"]) if placement["listed_problem_ids"] else "なし"),
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
