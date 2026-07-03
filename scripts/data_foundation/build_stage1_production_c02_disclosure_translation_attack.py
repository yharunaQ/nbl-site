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
C02_DEEP_JSON = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c02-disclosure-translation-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c02-disclosure-translation-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C02_CONTACT = "C-02-entry-translation"
C02_FREEDOMS = ["本人条件の企業語化", "求人条件の生活語化", "開示範囲", "実習・見学", "支援者同席", "制度ステータス"]

SIGNAL_BUCKETS = {
    "本人条件の仕事語化": ["説明", "伝える", "配慮", "症状", "体調", "障害", "できる", "苦手", "支援条件"],
    "求人・職務条件の生活語化": ["求人", "勤務時間", "仕事内容", "職務", "通勤", "職場環境", "休憩", "応募"],
    "開示範囲・情報境界": ["開示", "伝える", "説明", "理解", "範囲", "情報", "プライバシー"],
    "支援媒介": ["支援者", "相談", "ハローワーク", "医療", "福祉", "同席", "連携"],
    "制度修飾": ["手帳", "制度", "雇用率", "障害者雇用", "資格", "年金", "助成"],
    "実習・見学・場面試行": ["実習", "見学", "試行", "職場体験", "訓練", "面接"],
    "継続再翻訳": ["就職後", "復職", "変化", "継続", "再調整", "配置", "仕事内容変更"],
    "健康時間接続": ["通院", "治療", "服薬", "疲れ", "休憩", "健康管理", "体調", "痛み"],
    "生活保障接続": ["生活", "収入", "家計", "制度", "安心", "地域"],
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
    "本人条件の企業語化": {
        "attack_id": "C02D-1",
        "title": "本人条件の企業語化は本人説明ではなく、健康・活動条件を仕事設計言語へ変換する自由度",
        "candidate_proposition": "本人条件の企業語化は、症状名や障害名を伝えることではなく、体調変動、活動制限、支援条件を、職務、配置、評価、安全、勤務時間として検討可能な言葉へ変換する自由度として現れる可能性。",
        "counter_proposition": "本人条件の企業語化に見える信号は、求人条件の不明確さ、支援者媒介不足、制度ステータス、仕事設計、健康時間の未整合で説明できる可能性。",
        "review_question": "翻訳されるべき本人条件は、健康時間、活動制限、情報参加、身体操作、支援条件、評価条件のどれか。",
    },
    "求人条件の生活語化": {
        "attack_id": "C02D-2",
        "title": "求人条件の生活語化は希望調整ではなく、職務条件を生活・健康管理条件へ戻す自由度",
        "candidate_proposition": "求人条件の生活語化は、本人の希望に合う求人を探すことではなく、勤務時間、通勤、職務、職場環境、評価条件を生活、治療、体調管理、支援利用の条件として読み直す自由度として現れる可能性。",
        "counter_proposition": "求人条件の生活語化に見える信号は、本人条件の企業語化、地域求人量、生活保障、職業準備、支援接続の問題かもしれない。",
        "review_question": "求人側条件のうち、生活・健康管理へ翻訳されていないのは、時間、場所、仕事内容、評価、安全、支援利用のどれか。",
    },
    "開示範囲": {
        "attack_id": "C02D-3",
        "title": "開示範囲は話す量ではなく、どの条件をどの相手へ接続するかという境界設計",
        "candidate_proposition": "開示範囲の自由度は、障害や病気をどこまで話すかではなく、仕事実行に関係する健康・活動・支援条件を、本人、企業、支援者、医療、制度の間でどこまで共有し、どの仕事条件へ接続するかで現れる可能性。",
        "counter_proposition": "開示範囲に見える信号は、実際には本人条件の企業語化、求人条件の生活語化、支援者媒介、制度修飾の境界を拾っているだけかもしれない。",
        "review_question": "開示範囲で決めるべき境界は、情報内容、相手、時期、媒介者、仕事条件への接続、継続再翻訳のどれか。",
    },
    "実習・見学": {
        "attack_id": "C02D-4",
        "title": "実習・見学は体験機会ではなく、相互翻訳を現場で検証する自由度",
        "candidate_proposition": "実習・見学の自由度は、事前体験の有無ではなく、本人条件と求人・職務条件の翻訳が、実際の作業場所、時間、支援、情報、安全で検証されるかで現れる可能性。",
        "counter_proposition": "実習・見学に見える信号は、C03支援接続、C05作業場所、C08職業準備の一部かもしれない。",
        "review_question": "実習・見学で検証されるべき条件は、職務、時間、通勤、身体操作、情報参加、支援役割、安全、評価のどれか。",
    },
    "支援者同席": {
        "attack_id": "C02D-5",
        "title": "支援者同席は付き添いではなく、翻訳責任を分担する媒介自由度",
        "candidate_proposition": "支援者同席の自由度は、本人の代弁ではなく、本人条件と求人条件の相互翻訳を、本人、企業、支援者の間で分担し、入口後の再翻訳へ接続する媒介として現れる可能性。",
        "counter_proposition": "支援者同席に見える信号は、支援利用の有無、相談先アクセス、制度利用、本人説明、企業側理解の問題を混在させている可能性。",
        "review_question": "支援者が媒介しているのは、本人条件、求人条件、開示範囲、制度修飾、実習検証、就職後再翻訳のどれか。",
    },
    "制度ステータス": {
        "attack_id": "C02D-6",
        "title": "制度ステータスは属性分類ではなく、入口翻訳を助けも狭めもする修飾因子",
        "candidate_proposition": "制度ステータスの自由度は、手帳や制度対象で人を分類することではなく、本人条件、求人条件、支援利用、企業側制度枠をどのように接続または誤接続するかを変える修飾因子として現れる可能性。",
        "counter_proposition": "制度ステータスに見える信号を主因にすると、健康時間、職務条件、支援媒介、開示範囲、生活保障の構造を失う可能性。",
        "review_question": "制度ステータスは、翻訳を助けているのか、誤読を生んでいるのか、求人条件を狭めているのか、支援接続を開いているのか。",
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
    return {row["freedom"]: row for row in rows if row["contact_id"] == C02_CONTACT}


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


def c02_deep_summary() -> dict[str, Any]:
    data = load_json(C02_DEEP_JSON)
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
    ids = {"SR-C02T-BIDIRECTIONAL-TRANSLATION", "SR-C02T-C03-CONTINUITY-BRIDGE"}
    return [item for item in load_json(RELATION_JSON)["relations"] if item["relation_id"] in ids]


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C02A", "P1-C02B", "P1-C02C", "P1-C02D"}
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

    for freedom in C02_FREEDOMS:
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
                "method_note": "開示を本人の説明量へ縮めず、何を、誰に、いつ、誰の媒介で、どの仕事条件へ接続するかとして読む。",
            }
        )

    result = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "non_judgment_boundary": "開示妥当性、支援妥当性、採否、配慮充足、制度該当性は判断しない。",
        "purpose": "C02の残った構造穴である開示範囲を、相互翻訳・媒介・制度修飾・場面検証へ割り直す。",
        "attack_result": "C02は本人説明能力でも開示量でもなく、本人条件を仕事設計言語へ変換する方向と、求人・職務条件を生活・健康管理条件へ戻す方向を、開示範囲、支援者媒介、制度修飾、実習・見学で境界設計する入口構造として読む必要がある。",
        "methodological_gain": "開示範囲を独立した正解選択にせず、相互翻訳の境界設計として復活させることで、本人責任化と制度属性化の両方を避けられる。",
        "c02_deep_summary": c02_deep_summary(),
        "relation_summaries": relation_summaries(),
        "fragmentary_bridge": fragmentary_bridge(),
        "translation_overlap": {
            "deep_bidirectional_records": 1461,
            "deep_continuity_bridge_records": 1329,
            "four_placement_contact": {
                item["freedom"]: {
                    "problem": item["problem_count"],
                    "mitigation": item["mitigation_count"],
                    "residual": item["residual_count"],
                    "boundary": item["boundary_count"],
                }
                for item in placements.values()
            },
        },
        "attacks": attacks,
    }
    return result


def fmt_counter(counter: dict[str, int]) -> str:
    if not counter:
        return "なし"
    return ", ".join(f"{key}:{value}" for key, value in counter.items())


def write_markdown(data: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Stage 1 Production C02 Disclosure Translation Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C02の構造穴である開示範囲を、本人説明能力や開示量ではなく、入口翻訳の境界設計として潰すための再分析。",
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
        f"- C02 target records: {data['c02_deep_summary']['source_set']['c02a_or_c02b_records']}",
        f"- C02 reviewable subbranches: {data['c02_deep_summary']['source_set']['reviewable_subbranches']}",
    ]
    for relation in data["relation_summaries"]:
        lines.append(
            f"- deep relation `{relation['relation_id']}` records: {relation['record_count']} / {relation['reading']}"
        )

    lines.extend(["", "## 6つの入口翻訳自由度", "", "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |", "|---|---|---:|---:|---:|---|---|"])
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
                "問題ID: "
                + (", ".join(f"`{record_id}`" for record_id in placement["listed_problem_ids"]) if placement["listed_problem_ids"] else "なし"),
                "軽減ID: "
                + (", ".join(f"`{record_id}`" for record_id in placement["listed_mitigation_ids"]) if placement["listed_mitigation_ids"] else "なし"),
                "残余ID: "
                + (", ".join(f"`{record_id}`" for record_id in placement["listed_residual_ids"][:8]) if placement["listed_residual_ids"] else "なし"),
                "境界ID: "
                + (", ".join(f"`{record_id}`" for record_id in placement["listed_boundary_ids"][:8]) if placement["listed_boundary_ids"] else "なし"),
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
