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
C05_DEEP_JSON = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.json"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c05-worksite-mobility-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c05-worksite-mobility-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C05_CONTACT = "C-05-physical-access-worksite"
C05_FREEDOMS = ["移動経路", "通勤", "姿勢", "作業場所", "設備", "職務代替", "安全確認"]

SIGNAL_BUCKETS = {
    "移動・通勤・地域接続": ["移動", "通勤", "歩行", "交通", "地域", "通路", "駐車場"],
    "姿勢・身体操作": ["姿勢", "身体", "手", "腕", "運搬", "トイレ", "身なり", "服装"],
    "設備・道具・作業場所": ["設備", "道具", "作業場所", "作業机", "施設", "機器", "休憩所", "食堂", "マニュアル"],
    "健康時間・回復": ["通院", "治療", "服薬", "休憩", "健康管理", "疲れ", "体調", "痛み", "無理"],
    "仕事内容・職務代替": ["仕事内容", "業務", "職務", "作業", "役割", "責任", "代替", "調整"],
    "安全確認・危険対応": ["安全", "危険", "確認", "注意", "集中", "対処"],
    "情報参加・案内": ["案内", "説明", "理解", "文書", "会話", "コミュニケーション", "伝える"],
    "入口翻訳・求人条件": ["求人", "応募", "面接", "実習", "見学", "配慮", "就職活動"],
    "生活保障・制度": ["収入", "生活", "制度", "雇用形態", "家計", "安心"],
}

DIVERSITY_BUCKETS = {
    "移動・姿勢・身体操作": ["歩行", "運動", "平衡", "切断", "肢体", "移動", "姿勢", "損傷"],
    "体調変動・疲労・痛み": ["疲れ", "体調", "痛み", "活力", "崩れ", "進行"],
    "治療時間・難病": ["難病", "慢性", "通院", "治療", "免疫", "透析", "服薬"],
    "視覚情報": ["弱視", "視野", "視覚"],
    "聴覚・音声情報": ["難聴", "ろう", "聴覚"],
    "認知・発達・知的": ["知的", "発達", "学習", "高次脳", "注意"],
    "精神・心理": ["精神", "気分", "不安", "統合失調", "パニック"],
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


def unique_preserve(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result


def four_placement_by_freedom() -> dict[str, dict[str, Any]]:
    rows = load_json(FOUR_PLACEMENT_JSON)["four_placement_candidates"]
    return {row["freedom"]: row for row in rows if row["contact_id"] == C05_CONTACT}


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


FREEDOM_READINGS = {
    "移動経路": {
        "attack_id": "C05M-1",
        "title": "移動経路はアクセス経路ではなく、生活圏から仕事場面への接続",
        "candidate_proposition": "移動経路の自由度は、道や交通手段の有無ではなく、体調、身体操作、地域生活、求人圏、作業場所が仕事参加へつながるかで現れる可能性。",
        "counter_proposition": "移動経路に見える信号は、通勤、生活保障、地域条件、健康時間の広い残余かもしれない。",
        "review_question": "移動経路が狭めているのは、通勤、職場内移動、地域求人、通院、休憩、安全確認のどれか。",
    },
    "通勤": {
        "attack_id": "C05M-2",
        "title": "通勤は移動可否ではなく、健康時間と求人条件の結節",
        "candidate_proposition": "通勤の自由度は、移動できるかではなく、疲労、通院、勤務時間、地域交通、求人場所、生活保障が仕事選択へ接続するかで現れる可能性。",
        "counter_proposition": "通勤に見える信号は、健康時間、生活保障、地域求人、就労希望の未確定を拾っているだけかもしれない。",
        "review_question": "通勤が主自由度なのか、健康時間、求人条件、地域生活、生活保障、作業場所のどれが主か。",
    },
    "姿勢": {
        "attack_id": "C05M-3",
        "title": "姿勢は身体条件ではなく、作業持続と環境設計の接点",
        "candidate_proposition": "姿勢の自由度は、身体機能の問題だけではなく、作業台、休憩、身体操作、疼痛・疲労、職務代替が作業持続へ接続するかで現れる可能性。",
        "counter_proposition": "姿勢に見える信号は、C01健康時間やC05設備の実装面かもしれない。",
        "review_question": "姿勢問題は、身体操作、痛み、疲労、設備、休憩、職務代替のどれで自由度が変わるか。",
    },
    "作業場所": {
        "attack_id": "C05M-4",
        "title": "作業場所は場所ではなく、仕事参加接触点の配置",
        "candidate_proposition": "作業場所の自由度は、職場の物理的位置ではなく、仕事内容、情報参加、休憩、設備、安全、支援者、評価がどこで接触するかで現れる可能性。",
        "counter_proposition": "作業場所に見える信号は、設備、通勤、健康時間、情報参加の境界にすぎない可能性がある。",
        "review_question": "作業場所で接続していないのは、仕事内容、身体操作、情報、休息、安全、支援、評価のどれか。",
    },
    "設備": {
        "attack_id": "C05M-5",
        "title": "設備は物品ではなく、作業・情報・休息を媒介する接触面",
        "candidate_proposition": "設備の自由度は、物があるかではなく、道具、マニュアル、支援機器、休憩場所、施設が課題達成・情報参加・健康時間へ接続するかで現れる可能性。",
        "counter_proposition": "設備に見える信号は、C04情報参加、C01健康時間、C03支援接続の実装面かもしれない。",
        "review_question": "設備が媒介するのは、身体操作、情報形式、休息、作業精度、安全、技能習得のどれか。",
    },
    "職務代替": {
        "attack_id": "C05M-6",
        "title": "職務代替は免除ではなく、仕事参加を保つタスク再設計",
        "candidate_proposition": "職務代替の自由度は、できない仕事を外すことではなく、体調、身体操作、安全、技能、責任を保ちながらタスクを再配分することで現れる可能性。",
        "counter_proposition": "職務代替に見える信号は、仕事内容不一致、評価処遇、支援接続、健康時間の問題かもしれない。",
        "review_question": "代替すべきなのは、身体負荷、時間負荷、安全確認、対人応対、技能習得、責任範囲のどれか。",
    },
    "安全確認": {
        "attack_id": "C05M-7",
        "title": "安全確認は注意力ではなく、物理環境と情報参加の同期",
        "candidate_proposition": "安全確認の自由度は、本人の注意力だけではなく、危険情報、移動経路、作業場所、支援役割、確認手順が同期するかで現れる可能性。",
        "counter_proposition": "安全確認に見える信号は、C04確認可能性、C05設備、C01健康時間、C03支援接続の境界かもしれない。",
        "review_question": "安全確認が成立しないのは、情報形式、移動、設備、役割分担、体調変動、作業手順のどれか。",
    },
}


def relation_summaries() -> list[dict[str, Any]]:
    ids = {"SR-C04A-C05-WORKSITE-INFORMATION", "SR-C05-WORKSITE-HEALTHTIME", "SR-C05-MOBILITY-WORKSITE"}
    return [item for item in load_json(RELATION_JSON)["relations"] if item["relation_id"] in ids]


def c05_deep_summary() -> dict[str, Any]:
    data = load_json(C05_DEEP_JSON)
    return {
        "source_set": data["source_set"],
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


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C05A", "P1-C05B", "P1-C05C", "P1-C05D", "P1-C05E"}
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


def build_attacks() -> list[dict[str, Any]]:
    rows = load_rows()
    assignments = assignment_index()
    four = four_placement_by_freedom()
    attacks: list[dict[str, Any]] = []
    for freedom in C05_FREEDOMS:
        item = four[freedom]
        ids_by_placement = placement_ids(item)
        all_ids = unique_preserve(ids_by_placement["problem"] + ids_by_placement["mitigation"] + ids_by_placement["residual"] + ids_by_placement["boundary"])
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
                "method_note": "設備・通勤・作業場所を支援メニュー名で終わらせず、どの仕事参加接触点を変える自由度かとして読む。",
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
        "purpose": "C05が支援メニュー表へ戻る構造穴を、仕事参加接触点の自由度として割り直す。",
        "attack_result": "C05直接信号は、通勤・移動経路・作業場所・設備が1000件超で厚く、姿勢・職務代替・安全確認も独立した接触点を持つ。C05は設備名ではなく、健康時間、情報参加、入口翻訳、生活保障、仕事内容が物理環境で接触する構造として読む必要がある。",
        "methodological_gain": "同じ設備・通勤でも、主自由度が健康時間、移動、作業場所、情報、安全、職務代替のどこにあるかで支援構造が変わる、という多様性を保持する。",
        "c05_deep_summary": c05_deep_summary(),
        "relation_summaries": relation_summaries(),
        "attacks": attacks,
        "freedom_overlap": overlap_matrix(attacks),
        "fragmentary_bridge": fragmentary_bridge(),
        "non_judgment_boundary": "設備妥当性、合理的配慮充足、職場正否、就労可否、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
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
    lines = [
        "# Stage 1 Production C05 Worksite Mobility Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C05の構造穴を、通勤・移動・姿勢・作業場所・設備・職務代替・安全確認が仕事参加へ接続する自由度として潰すための再分析。",
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
    ]
    source_set = payload["c05_deep_summary"]["source_set"]
    lines.append(f"- C05-3 dominant: {source_set.get('c05_3_dominant')}")
    lines.append(f"- C05-3 pure after boundary exclusion: {source_set.get('c05_3_pure_after_boundary_exclusion')}")
    for relation in payload["relation_summaries"]:
        lines.append(f"- deep relation `{relation['relation_id']}` records: {relation['record_count']} / {relation['reading']}")
    lines.extend(["", "| subbranch | records | handling |", "|---|---:|---|"])
    for branch in payload["c05_deep_summary"]["subbranches"]:
        lines.append(f"| `{branch['subbranch_id']}` {branch['title']} | {branch['record_count']} | {branch['handling']} |")

    lines.extend(
        [
            "",
            "## 7つの接触点自由度",
            "",
            "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |",
            "|---|---|---:|---:|---:|---|---|",
        ]
    )
    for attack in payload["attacks"]:
        pc = attack["placement_counts"]
        lines.append(
            f"| `{attack['attack_id']}` | {attack['freedom']} | {attack['candidate_record_count']} | {attack['listed_id_count']} | "
            f"{pc['problem']}/{pc['mitigation']}/{pc['residual']}/{pc['boundary']} | {attack['title']} | {ids_text(attack['representative_ids'], 5)} |"
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
            "同じIDに複数自由度が重なる場合、通勤・移動・姿勢・設備・作業場所は、同じ物理環境問題ではなく、仕事参加接触点の中で複数自由度が同時に動いている可能性がある。",
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
            f"freedom_candidates: {join_counts(bridge['freedom_candidates'], 16)}",
            f"example_source_ids: {ids_text(bridge['example_source_ids'], 10)}",
            "",
            "断片資料は、設備や配慮の妥当性を判断する根拠ではなく、同型構造・反対構造・欠損軸を探すための探索対象として扱う。",
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
