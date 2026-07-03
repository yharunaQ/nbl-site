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
C03_DEEP_JSON = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c03-support-mediation-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c03-support-mediation-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C03_CONTACT = "C-03-support-access-role-fit"
C03_FREEDOMS = ["相談入口", "役割分担", "支援メニュー適合", "継続接続", "支援品質", "地域資源"]

SIGNAL_BUCKETS = {
    "相談入口": ["相談", "入口", "窓口", "ハローワーク", "医療", "福祉", "支援機関"],
    "継続再翻訳": ["継続", "就職後", "復職", "変化", "再調整", "仕事内容変更", "定着"],
    "役割分担": ["役割", "分担", "同席", "連携", "企業", "医療", "福祉", "家族"],
    "サービス適合": ["適合", "合わない", "メニュー", "サービス", "制度", "対象", "利用"],
    "仕事開拓・求人接続": ["求人", "職場開拓", "応募", "面接", "実習", "訓練", "仕事探し"],
    "健康時間接続": ["通院", "治療", "体調", "疲れ", "休憩", "健康管理", "痛み"],
    "生活保障接続": ["生活", "収入", "家計", "制度", "安心", "地域"],
    "情報参加接続": ["説明", "理解", "伝える", "情報", "確認", "コミュニケーション"],
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
    "相談入口": {
        "attack_id": "C03M-1",
        "title": "相談入口は相談先の有無ではなく、どの条件へ接続するかの入口自由度",
        "candidate_proposition": "相談入口の自由度は、相談先があるかではなく、本人条件、求人条件、健康時間、生活保障、職場調整、仕事開拓のどれへ接続するかで現れる可能性。",
        "counter_proposition": "相談入口に見える信号は、困難の大きいケースほど相談先が増えるという逆向きの反映かもしれない。",
        "review_question": "相談入口は、健康時間、入口翻訳、仕事開拓、生活保障、職場調整、継続接続のどれへ届いているか。",
    },
    "役割分担": {
        "attack_id": "C03M-2",
        "title": "役割分担は連携美談ではなく、翻訳責任の配置自由度",
        "candidate_proposition": "役割分担の自由度は、本人、企業、支援者、医療、福祉、家族の誰がどの条件を翻訳・調整するかが明確になることで現れる可能性。",
        "counter_proposition": "役割分担に見える信号は、支援者が多いだけで、翻訳責任が実際に整理されていない可能性がある。",
        "review_question": "誰が、本人条件、求人条件、健康条件、制度条件、職場条件のどれを翻訳しているか。",
    },
    "支援メニュー適合": {
        "attack_id": "C03M-3",
        "title": "支援メニュー適合は制度利用ではなく、構造自由度への適合",
        "candidate_proposition": "支援メニュー適合の自由度は、制度やサービスを使うことではなく、健康時間、入口翻訳、情報参加、作業場所、生活保障のどの構造自由度へ支援が適合するかで現れる可能性。",
        "counter_proposition": "支援メニュー適合に見える信号は、制度対象、地域資源、本人希望、求人側条件の問題かもしれない。",
        "review_question": "支援メニューが適合または不適合になっている自由度は、健康時間、入口翻訳、情報参加、仕事参加接触点、生活保障のどれか。",
    },
    "継続接続": {
        "attack_id": "C03M-4",
        "title": "継続接続は定着支援ではなく、変化時の再翻訳自由度",
        "candidate_proposition": "継続接続の自由度は、支援が続くことではなく、就職後、復職、病状変化、仕事内容変更、評価変更の局面で条件を再翻訳できるかで現れる可能性。",
        "counter_proposition": "継続接続に見える信号は、困難が続いているため支援が長引いているだけかもしれない。",
        "review_question": "再翻訳が必要な変化局面は、体調、仕事内容、職場理解、評価、生活保障、制度条件のどれか。",
    },
    "支援品質": {
        "attack_id": "C03M-5",
        "title": "支援品質は満足度ではなく、自由度を増やす翻訳精度",
        "candidate_proposition": "支援品質の自由度は、支援への満足ではなく、支援が本人条件と職場条件をどれだけ具体的な仕事設計・生活設計へ翻訳できるかで現れる可能性。",
        "counter_proposition": "支援品質に見える信号は、利用可能資源の量、制度対象、地域差、本人の状況の複雑さを反映している可能性がある。",
        "review_question": "品質差として現れているのは、情報整理、役割分担、継続接続、職場調整、生活保障接続、仕事開拓のどれか。",
    },
    "地域資源": {
        "attack_id": "C03M-6",
        "title": "地域資源は資源量ではなく、生活圏から仕事圏への接続自由度",
        "candidate_proposition": "地域資源の自由度は、地域に支援機関があるかではなく、生活圏、通勤圏、医療圏、求人圏、制度圏を仕事参加へ接続できるかで現れる可能性。",
        "counter_proposition": "地域資源に見える信号は、求人量、交通、生活保障、医療アクセス、制度対象の問題かもしれない。",
        "review_question": "地域資源が接続または分断しているのは、相談、求人、通勤、医療、生活保障、職場調整のどれか。",
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
    return {row["freedom"]: row for row in rows if row["contact_id"] == C03_CONTACT}


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


def c03_deep_summary() -> dict[str, Any]:
    data = load_json(C03_DEEP_JSON)
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
        "SR-C01C03-LONGTERM-CONTINUITY",
        "SR-C03-ENTRY-VS-CONTINUITY",
        "SR-C02T-C03-CONTINUITY-BRIDGE",
        "SR-C06-SUPPORT-LIFESECURITY",
    }
    return [item for item in load_json(RELATION_JSON)["relations"] if item["relation_id"] in ids]


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C03A", "P1-C03B", "P1-C03C", "P1-C03D"}
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

    for freedom in C03_FREEDOMS:
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
                "method_note": "支援の有効性ではなく、何を翻訳し、どの局面へ接続し、誰が責任を分担するかとして読む。",
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "non_judgment_boundary": "支援有効性、制度妥当性、サービス選定、配慮充足、ケース正誤は判断しない。",
        "purpose": "C03の軽減側に見える信号を、支援有効性ではなく、翻訳・接続・役割分担の自由度へ割り直す。",
        "attack_result": "C03は支援資源の有無でも支援有効性でもなく、相談入口、役割分担、メニュー適合、継続接続、支援品質、地域資源が、本人条件・求人条件・健康時間・生活保障をどの局面へ再翻訳するかとして読む必要がある。",
        "methodological_gain": "軽減側信号を支援の成功例として読まず、自由度を増やす媒介構造として読むことで、支援あり/なしの単純比較を避けられる。",
        "c03_deep_summary": c03_deep_summary(),
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
        "# Stage 1 Production C03 Support Mediation Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C03の軽減側信号を、支援有効性ではなく、翻訳・接続・役割分担の自由度として再分析した。",
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
        f"- C03 target records: {data['c03_deep_summary']['source_set']['c03a_or_c03b_or_c03c_records']}",
        f"- C03 reviewable subbranches: {data['c03_deep_summary']['source_set']['reviewable_subbranches']}",
    ]
    for relation in data["relation_summaries"]:
        lines.append(f"- deep relation `{relation['relation_id']}` records: {relation['record_count']} / {relation['reading']}")

    lines.extend(["", "## 6つの支援媒介自由度", "", "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |", "|---|---|---:|---:|---:|---|---|"])
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
                "軽減ID: "
                + (", ".join(f"`{record_id}`" for record_id in placement["listed_mitigation_ids"][:8]) if placement["listed_mitigation_ids"] else "なし"),
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
