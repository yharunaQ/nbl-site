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
C07C08_JSON = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c07-quality-participation-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c07-quality-participation-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C07_CONTACT = "C-07-career-evaluation-role"
C07_FREEDOMS = ["評価基準", "役割拡大", "技能習得", "処遇", "昇進", "働きがい", "定着"]

SIGNAL_BUCKETS = {
    "評価・処遇・キャリア": ["評価", "処遇", "報酬", "昇進", "キャリア", "人事方針", "満足度", "定着"],
    "技能習得・訓練・OJT": ["技能", "訓練", "研修", "実務指導", "OJT", "職業能力", "資格"],
    "役割・責任・改善参加": ["責任", "役割", "作業補助", "改善", "意見", "会議", "上司", "同僚"],
    "情報参加・確認": ["理解", "意思", "会話", "コミュニケーション", "説明", "伝える", "文書", "確認"],
    "健康時間・継続": ["体調", "治療", "通院", "休憩", "健康管理", "疲れ", "無理", "継続"],
    "生活保障・仕事選択": ["収入", "生活", "求人", "就職活動", "再就職", "雇用形態", "地域"],
    "支援接続・媒介": ["相談", "支援", "ケース会議", "産業医", "主治医", "専門的支援者", "制度"],
}

DIVERSITY_BUCKETS = {
    "聴覚・音声情報": ["難聴", "ろう", "聴覚"],
    "視覚情報": ["弱視", "視野", "視覚"],
    "認知・発達・知的": ["知的", "発達", "学習", "高次脳", "注意"],
    "精神・心理": ["精神", "気分", "不安", "統合失調", "パニック"],
    "体調変動・疲労・痛み": ["疲れ", "体調", "痛み", "活力", "崩れ", "進行"],
    "治療時間・難病": ["難病", "慢性", "通院", "治療", "免疫", "透析", "服薬"],
    "移動・姿勢・身体操作": ["歩行", "運動", "平衡", "切断", "肢体", "移動", "姿勢"],
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


def text_items(row: dict[str, Any]) -> list[str]:
    keys = [
        "consultation_gaps",
        "service_fit_gaps",
        "pre_employment_unresolved",
        "post_employment_unresolved",
        "accommodations_present",
        "accommodations_needed_absent",
        "satisfaction_risks",
        "low_work_confidence",
        "low_soc_or_life_signals",
        "readiness_unresolved",
        "job_search_unresolved",
        "support_use_gaps",
        "desired_supports",
        "narrative_context_labels",
    ]
    items: list[str] = []
    for key in keys:
        value = row.get(key)
        if isinstance(value, list):
            items.extend(str(item) for item in value)
    return items


def diversity_strings(row: dict[str, Any]) -> list[str]:
    items: list[str] = []
    for key in ["health_condition_groups", "body_function_signals", "impairment_signals", "handbook_signals"]:
        value = row.get(key)
        if isinstance(value, list):
            items.extend(str(item) for item in value)
    return items


def bucket_counts(strings: list[str], bucket_map: dict[str, list[str]]) -> Counter[str]:
    result: Counter[str] = Counter()
    for bucket, words in bucket_map.items():
        for item in strings:
            if any(word in item for word in words):
                result[bucket] += 1
                break
    return result


def unique_preserve(values: list[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        output.append(value)
    return output


def four_placement_by_freedom() -> dict[str, dict[str, Any]]:
    rows = load_json(FOUR_PLACEMENT_JSON)["four_placement_candidates"]
    return {row["freedom"]: row for row in rows if row["contact_id"] == C07_CONTACT}


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
    missing_ids: list[str] = []
    for record_id in record_ids:
        source[record_id.split(":", 1)[0]] += 1
        row = rows.get(record_id)
        if not row:
            missing_ids.append(record_id)
            continue
        status[row.get("status_group", "unknown")] += 1
        pattern[row.get("pattern_cell_id", "unknown")] += 1
        signals.update(bucket_counts(text_items(row), SIGNAL_BUCKETS))
        diversity.update(bucket_counts(text_items(row) + diversity_strings(row), DIVERSITY_BUCKETS))
        lens.update(row.get("narrative_lens_counts", {}))
    return {
        "source_counts": dict(source.most_common()),
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(8)),
        "signal_bucket_counts": dict(signals.most_common()),
        "diversity_bucket_counts": dict(diversity.most_common()),
        "lens_counts": dict(lens.most_common()),
        "missing_row_ids": missing_ids,
    }


FREEDOM_READINGS = {
    "評価基準": {
        "attack_id": "C07Q-1",
        "title": "評価基準は能力判定ではなく、条件付き遂行を価値へ翻訳する規則",
        "candidate_proposition": "評価基準の自由度は、本人能力の高低ではなく、健康時間、情報参加、支援接続、仕事設計を前提にした遂行を、職場の成果・責任・価値へどう翻訳するかで現れる可能性。",
        "counter_proposition": "評価基準に見える信号は、生活保障、職務難度、雇用形態、情報参加の未整合を拾っているだけかもしれない。",
        "review_question": "評価されていないのは成果、努力、安定稼働、役割、技能、支援を使った遂行のどれか。",
    },
    "役割拡大": {
        "attack_id": "C07Q-2",
        "title": "役割拡大は負荷追加ではなく、参加可能な責任範囲の設計",
        "candidate_proposition": "役割拡大の自由度は、より多く働かせることではなく、情報形式、確認、安全、支援役割、健康時間に合う形で、担える責任範囲や参加場面が広がるかで現れる可能性。",
        "counter_proposition": "役割拡大に見える信号は、単なる職務負荷、昇進希望、職場関係、情報参加の問題かもしれない。",
        "review_question": "広がらない役割は、会議、相談、判断、安全確認、技能実践、改善提案、対人応対のどれか。",
    },
    "技能習得": {
        "attack_id": "C07Q-3",
        "title": "技能習得は個人訓練ではなく、学習機会と仕事参加の接続",
        "candidate_proposition": "技能習得の自由度は、本人の訓練不足ではなく、マニュアル、OJT、支援者媒介、評価基準、仕事内容が、本人の情報・健康・生活条件に合う学習経路として接続するかで現れる可能性。",
        "counter_proposition": "技能習得に見える信号は、入口翻訳、支援サービス利用、職種選択、健康時間の未整合かもしれない。",
        "review_question": "学べないのは技能そのもの、学習媒体、実務指導、評価機会、仕事量、支援接続のどれか。",
    },
    "処遇": {
        "attack_id": "C07Q-4",
        "title": "処遇は賃金判断ではなく、貢献・生活保障・雇用形態の接触面",
        "candidate_proposition": "処遇の自由度は、賃金や待遇の妥当性判断ではなく、できる仕事、雇用形態、生活保障、評価基準、支援制度が噛み合うかで現れる可能性。",
        "counter_proposition": "処遇に見える信号は、収入保障、制度対象、雇用形態、生活満足を拾っているだけかもしれない。",
        "review_question": "処遇に接続していないのは、仕事成果、役割、勤務時間、制度ステータス、生活保障、評価基準のどれか。",
    },
    "昇進": {
        "attack_id": "C07Q-5",
        "title": "昇進は地位上昇ではなく、将来役割への接続可能性",
        "candidate_proposition": "昇進の自由度は、管理職志向の有無ではなく、病気や障害があっても将来の役割、技能、処遇、責任へ接続する道が閉じていないかで現れる可能性。",
        "counter_proposition": "昇進に見える信号は、評価接続、処遇、働きがい、仕事量、生活保障の別表現かもしれない。",
        "review_question": "将来役割への道を閉じているのは、評価基準、情報参加、健康時間、支援接続、職場理解、雇用形態のどれか。",
    },
    "働きがい": {
        "attack_id": "C07Q-6",
        "title": "働きがいは感想ではなく、仕事が価値・役割・将来へ接続する感覚",
        "candidate_proposition": "働きがいの自由度は、主観的満足だけではなく、仕事が社会的役割、成長、評価、生活、自己効力へ接続しているかで現れる可能性。",
        "counter_proposition": "働きがいに見える信号は、生活満足、収入、健康状態、職場関係、低い就労自信の反映かもしれない。",
        "review_question": "働きがいを支える接続は、役割、評価、技能、収入、職場関係、社会参加、将来見通しのどれか。",
    },
    "定着": {
        "attack_id": "C07Q-7",
        "title": "定着は在籍継続ではなく、変化に耐える参加品質",
        "candidate_proposition": "定着の自由度は、単に辞めないことではなく、病状変化、仕事内容変更、評価、支援、生活保障が変化しても、仕事参加の質を再接続できるかで現れる可能性。",
        "counter_proposition": "定着に見える信号は、C01健康時間、C03継続支援、C06生活保障の複合であり、C07固有ではないかもしれない。",
        "review_question": "定着を脆くしているのは、健康時間、評価基準、役割、処遇、支援継続、生活保障、職務変更のどれか。",
    },
}


def relation_summary() -> dict[str, Any]:
    for item in load_json(RELATION_JSON)["relations"]:
        if item["relation_id"] == "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT":
            return item
    return {}


def c07_deep_summary() -> dict[str, Any]:
    data = load_json(C07C08_JSON)
    return {
        "target_records": data["source_set"]["c07_evaluation_life_security_boundary_records"],
        "subbranches": [
            {
                "subbranch_id": item["subbranch_id"],
                "title": item["title"],
                "record_count": item["record_count"],
                "handling": item["handling"],
                "distribution": item["distribution"],
            }
            for item in data["c07_subbranches"]
        ],
    }


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C04B", "P1-C06E", "P1-C03D"}
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
        "freedom_candidates": dict(freedoms.most_common(14)),
    }


def build_attacks() -> list[dict[str, Any]]:
    rows = load_rows()
    assignments = assignment_index()
    four = four_placement_by_freedom()
    attacks: list[dict[str, Any]] = []
    for freedom in C07_FREEDOMS:
        item = four[freedom]
        ids_by_placement = placement_ids(item)
        all_ids = unique_preserve(
            ids_by_placement["problem"]
            + ids_by_placement["mitigation"]
            + ids_by_placement["residual"]
            + ids_by_placement["boundary"]
        )
        placement_counts = {
            "problem": item.get("problem_count", len(ids_by_placement["problem"])),
            "mitigation": item.get("mitigation_count", len(ids_by_placement["mitigation"])),
            "residual": item.get("residual_count", len(ids_by_placement["residual"])),
            "boundary": item.get("boundary_count", len(ids_by_placement["boundary"])),
        }
        branch_counts = Counter()
        boundary_counts = Counter()
        for record_id in all_ids:
            branch_counts.update(assignments.get(record_id, {}).get("branches", set()))
            boundary_counts.update(assignments.get(record_id, {}).get("boundary_tags", set()))
        reading = FREEDOM_READINGS[freedom]
        attacks.append(
            {
                "attack_id": reading["attack_id"],
                "freedom": freedom,
                "title": reading["title"],
                "status": "machine_generated_unreviewed_no_promotion",
                "candidate_record_count": sum(placement_counts.values()),
                "listed_id_count": len(all_ids),
                "placement_counts": placement_counts,
                "listed_placement_id_counts": {key: len(value) for key, value in ids_by_placement.items()},
                "readiness_before_attack": item["readiness"],
                "candidate_proposition": reading["candidate_proposition"],
                "counter_proposition": reading["counter_proposition"],
                "review_question": reading["review_question"],
                "representative_ids": all_ids[:12],
                "residual_ids": ids_by_placement["residual"][:12],
                "boundary_ids": ids_by_placement["boundary"][:12],
                "profile": record_profile(all_ids, rows),
                "branch_counts": dict(branch_counts.most_common(8)),
                "boundary_tag_counts": dict(boundary_counts.most_common(8)),
                "method_note": "直接IDは小さいため、単独候補命題ではなく、C07の大規模境界を読むためのsentinel自由度として扱う。",
            }
        )
    return attacks


def overlap_matrix(attacks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sets = {attack["freedom"]: set(attack["representative_ids"]) for attack in attacks}
    rows: list[dict[str, Any]] = []
    names = list(sets)
    for index, left in enumerate(names):
        for right in names[index + 1 :]:
            rows.append({"left": left, "right": right, "shared_record_count": len(sets[left] & sets[right])})
    return sorted(rows, key=lambda item: item["shared_record_count"], reverse=True)


def build_payload() -> dict[str, Any]:
    attacks = build_attacks()
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "C07が問題側の薄さによって捨てられる構造穴を、仕事参加の質のsentinel自由度として復活させる。",
        "attack_result": "C07直接信号は大きな母集団ではなく、12件前後の同じsentinel群に評価基準、役割拡大、技能習得、処遇、昇進、働きがい、定着が重なる形で現れる。一方で、C07境界は3082件、深い関係edgeは2018件あるため、直接信号の少なさは構造不存在ではなく、調査が上方向の参加品質を拾いにくいことを示す可能性が高い。",
        "methodological_gain": "C07を昇進・満足の周辺話題として扱わず、できる仕事を価値、役割、技能、処遇、将来、継続へ戻す上方向の構造自由度として読む。",
        "c07_deep_summary": c07_deep_summary(),
        "relation_summary": relation_summary(),
        "attacks": attacks,
        "freedom_overlap": overlap_matrix(attacks),
        "fragmentary_bridge": fragmentary_bridge(),
        "non_judgment_boundary": "処遇妥当性、評価妥当性、昇進可否、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
    }


def join_counts(counts: dict[str, int], limit: int = 8) -> str:
    if not counts:
        return "なし"
    return ", ".join(f"{key}:{value}" for key, value in list(counts.items())[:limit])


def ids_text(ids: list[str], limit: int = 8) -> str:
    if not ids:
        return "なし"
    return ", ".join(f"`{record_id}`" for record_id in ids[:limit])


def write_markdown(payload: dict[str, Any]) -> None:
    deep = payload["c07_deep_summary"]
    relation = payload["relation_summary"]
    lines = [
        "# Stage 1 Production C07 Quality Participation Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C07の構造穴を、評価・役割・キャリア参加が仕事参加の質へ接続する自由度として潰すための再分析。",
        "",
        "## 結果",
        "",
        payload["attack_result"],
        "",
        "## 方法上の獲得",
        "",
        payload["methodological_gain"],
        "",
        "## 広い構造面",
        "",
        f"- C07 boundary target records: {deep['target_records']}",
        f"- deep relation `{relation.get('relation_id', 'unknown')}` records: {relation.get('record_count', 0)}",
        f"- relation reading: {relation.get('reading', '')}",
        "",
        "| subbranch | records | handling |",
        "|---|---:|---|",
    ]
    for branch in deep["subbranches"]:
        lines.append(f"| `{branch['subbranch_id']}` {branch['title']} | {branch['record_count']} | {branch['handling']} |")

    lines.extend(
        [
            "",
            "## 7つのsentinel自由度",
            "",
            "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |",
            "|---|---|---:|---:|---:|---|---|",
        ]
    )
    for attack in payload["attacks"]:
        pc = attack["placement_counts"]
        lines.append(
            f"| `{attack['attack_id']}` | {attack['freedom']} | {attack['candidate_record_count']} | "
            f"{attack['listed_id_count']} | {pc['problem']}/{pc['mitigation']}/{pc['residual']}/{pc['boundary']} | "
            f"{attack['title']} | {ids_text(attack['representative_ids'], 5)} |"
        )

    lines.extend(["", "## Detail", ""])
    for attack in payload["attacks"]:
        profile = attack["profile"]
        lines.extend(
            [
                f"### {attack['attack_id']} {attack['title']}",
                "",
                f"自由度: {attack['freedom']}",
                f"candidate record数: {attack['candidate_record_count']}",
                f"listed ID数: {attack['listed_id_count']}",
                f"placement: problem {attack['placement_counts']['problem']} / mitigation {attack['placement_counts']['mitigation']} / residual {attack['placement_counts']['residual']} / boundary {attack['placement_counts']['boundary']}",
                f"listed placement IDs: problem {attack['listed_placement_id_counts']['problem']} / mitigation {attack['listed_placement_id_counts']['mitigation']} / residual {attack['listed_placement_id_counts']['residual']} / boundary {attack['listed_placement_id_counts']['boundary']}",
                f"攻撃前readiness: {attack['readiness_before_attack']}",
                f"代表ID: {ids_text(attack['representative_ids'])}",
                f"残余ID: {ids_text(attack['residual_ids'])}",
                f"境界ID: {ids_text(attack['boundary_ids'])}",
                "",
                f"候補命題: {attack['candidate_proposition']}",
                "",
                f"反対命題: {attack['counter_proposition']}",
                "",
                f"レビューで見る問い: {attack['review_question']}",
                "",
                "分布:",
                f"- source: {join_counts(profile['source_counts'])}",
                f"- status_group: {join_counts(profile['status_group_counts'])}",
                f"- pattern_cell: {join_counts(profile['pattern_cell_counts'])}",
                f"- signal_bucket: {join_counts(profile['signal_bucket_counts'])}",
                f"- diversity_bucket: {join_counts(profile['diversity_bucket_counts'])}",
                f"- narrative_lens: {join_counts(profile['lens_counts'])}",
                f"- branch: {join_counts(attack['branch_counts'])}",
                f"- boundary_tag: {join_counts(attack['boundary_tag_counts'])}",
                f"- row_missing_for_external_ids: {ids_text(profile['missing_row_ids'])}",
                "",
                f"方法メモ: {attack['method_note']}",
                "",
            ]
        )

    lines.extend(
        [
            "## 自由度の重なり",
            "",
            "同じsentinel IDに複数自由度が重なることは、C07が単独項目ではなく、評価、技能、役割、処遇、将来、定着が同時に動く上方向の参加品質であることを示す。",
            "",
            "| freedom A | freedom B | shared records |",
            "|---|---|---:|",
        ]
    )
    for item in payload["freedom_overlap"][:16]:
        lines.append(f"| {item['left']} | {item['right']} | {item['shared_record_count']} |")

    bridge = payload["fragmentary_bridge"]
    lines.extend(
        [
            "",
            "## 断片資料ブリッジ",
            "",
            f"source_family_counts: {join_counts(bridge['source_family_counts'])}",
            f"freedom_candidates: {join_counts(bridge['freedom_candidates'], 14)}",
            f"example_source_ids: {ids_text(bridge['example_source_ids'], 10)}",
            "",
            "断片資料は、評価や処遇の妥当性を判断する根拠ではなく、同型構造・反対構造・欠損軸を探すための探索対象として扱う。",
            "",
            "## 非判断境界",
            "",
            payload["non_judgment_boundary"],
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
