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
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
C04_DEEP_JSON = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-c04-direct-information-participation-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c04-direct-information-participation-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C04_CONTACT = "C-04-information-participation-quality"
C04_FREEDOMS = [
    "情報形式",
    "確認可能性",
    "責任所在",
    "評価接続",
    "役割接続",
    "本人の依頼負荷",
]


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


def text_items(row: dict[str, Any]) -> list[str]:
    keys = [
        "consultation_gaps",
        "service_fit_gaps",
        "pre_employment_unresolved",
        "post_employment_unresolved",
        "accommodations_present",
        "accommodations_needed_absent",
        "disclosure_gaps",
        "satisfaction_risks",
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


SIGNAL_BUCKETS = {
    "理解・意思伝達・会話参加": ["理解", "意思", "会話", "議論", "応対", "コミュニケーション", "話", "文書"],
    "情報形式・支援機器・媒体": ["意思疎通", "支援機器", "パソコン", "電話", "FAX", "電子メール", "マニュアル", "テキスト", "案内"],
    "確認・安全・エラー予防": ["危険", "安全", "確認", "注意", "集中", "対処"],
    "技能習得・訓練・OJT": ["技能", "訓練", "研修", "実務指導", "OJT", "講座", "学習", "職業能力"],
    "責任・役割・支援者媒介": ["責任", "同僚", "上司", "支援者", "手話通訳", "介助者", "ケース会議", "相談員"],
    "評価・処遇・キャリア": ["評価", "昇進", "報酬", "処遇", "キャリア", "人事方針", "満足度"],
    "健康時間・仕事設計": ["通院", "治療", "服薬", "休憩", "健康管理", "仕事内容", "業務内容", "勤務時間", "体調"],
    "生活保障・移行制約": ["収入", "生活", "地域", "再就職", "就職活動", "求人", "応募", "実習"],
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


def bucket_counts(strings: list[str], bucket_map: dict[str, list[str]]) -> Counter[str]:
    counts: Counter[str] = Counter()
    joined_items = [str(item) for item in strings]
    for bucket, words in bucket_map.items():
        for item in joined_items:
            if any(word in item for word in words):
                counts[bucket] += 1
                break
    return counts


def record_diversity_strings(row: dict[str, Any]) -> list[str]:
    strings: list[str] = []
    for key in ["health_condition_groups", "body_function_signals", "impairment_signals", "handbook_signals"]:
        value = row.get(key)
        if isinstance(value, list):
            strings.extend(str(item) for item in value)
    return strings


def classify_case_signal(row: dict[str, Any]) -> dict[str, Any]:
    items = text_items(row)
    diversity = record_diversity_strings(row)
    return {
        "status_group": row.get("status_group", "unknown"),
        "pattern_cell_id": row.get("pattern_cell_id", "unknown"),
        "signal_buckets": list(bucket_counts(items, SIGNAL_BUCKETS).keys()),
        "diversity_buckets": list(bucket_counts(diversity + items, DIVERSITY_BUCKETS).keys()),
        "narrative_lens_counts": row.get("narrative_lens_counts", {}),
    }


def four_placement_by_freedom() -> dict[str, dict[str, Any]]:
    data = load_json(FOUR_PLACEMENT_JSON)["four_placement_candidates"]
    result: dict[str, dict[str, Any]] = {}
    for item in data:
        if item["contact_id"] == C04_CONTACT and item["freedom"] in C04_FREEDOMS:
            result[item["freedom"]] = item
    return result


def assignment_index() -> dict[str, dict[str, set[str]]]:
    result: dict[str, dict[str, set[str]]] = defaultdict(lambda: {"branches": set(), "boundary_tags": set()})
    for item in load_json(ASSIGN_JSON)["assignments"]:
        result[item["record_id"]]["branches"].update(item.get("candidate_branches", []))
        result[item["record_id"]]["boundary_tags"].update(item.get("boundary_tags", []))
    return result


def c04_subbranch_index() -> dict[str, str]:
    result: dict[str, str] = {}
    for branch in load_json(C04_DEEP_JSON)["subbranches"]:
        for record_id in branch.get("representative_ids", []):
            result.setdefault(record_id, branch["subbranch_id"])
        # The json only stores representatives, but that is enough for display anchoring here.
    return result


def placement_ids(item: dict[str, Any]) -> dict[str, list[str]]:
    return {
        "problem": item.get("problem_ids", []),
        "mitigation": item.get("mitigation_ids", []),
        "residual": item.get("residual_ids", []),
        "boundary": item.get("boundary_ids", []),
    }


def unique_preserve(values: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        out.append(value)
    return out


def compact_record_profile(record_ids: list[str], rows: dict[str, dict[str, Any]]) -> dict[str, Any]:
    status = Counter()
    pattern = Counter()
    signals = Counter()
    diversity = Counter()
    lens = Counter()
    source = Counter()
    for record_id in record_ids:
        row = rows.get(record_id)
        if not row:
            source[record_id.split(":", 1)[0]] += 1
            continue
        profile = classify_case_signal(row)
        source[record_id.split(":", 1)[0]] += 1
        status[profile["status_group"]] += 1
        pattern[profile["pattern_cell_id"]] += 1
        signals.update(profile["signal_buckets"])
        diversity.update(profile["diversity_buckets"])
        lens.update(profile["narrative_lens_counts"])
    return {
        "source_counts": dict(source.most_common()),
        "status_group_counts": dict(status.most_common()),
        "pattern_cell_counts": dict(pattern.most_common(8)),
        "signal_bucket_counts": dict(signals.most_common()),
        "diversity_bucket_counts": dict(diversity.most_common()),
        "lens_counts": dict(lens.most_common()),
    }


FREEDOM_READINGS = {
    "情報形式": {
        "attack_id": "C04D-1",
        "title": "情報形式は媒体選択ではなく、仕事遂行へ届く形式化",
        "candidate_proposition": "情報形式の自由度は、手段の有無ではなく、仕事の説明、確認、訓練、会議、危険情報、評価情報が本人に使える形へ変換され、職務遂行に戻れるかで現れる可能性。",
        "counter_proposition": "情報形式に見える信号は、実際には支援機器、物理環境、職務難度、健康時間、支援接続の不足かもしれない。",
        "review_question": "媒体・機器の有無ではなく、どの仕事情報が、誰に、どの形式で、どの行為へ接続していないのかを確認できるか。",
    },
    "確認可能性": {
        "attack_id": "C04D-2",
        "title": "確認可能性は安全・エラー予防・暗黙知の同期自由度",
        "candidate_proposition": "確認可能性の自由度は、本人が聞き返す能力ではなく、指示、危険、変更、暗黙の了解、体調調整、支援役割を相互確認できる仕事構造として現れる可能性。",
        "counter_proposition": "確認困難に見えるものは、作業手順の未整備、危険作業そのもの、経験不足、職場関係、健康時間の問題かもしれない。",
        "review_question": "確認できない対象は、作業手順、危険、変更、評価、支援役割、体調調整のどれか。",
    },
    "責任所在": {
        "attack_id": "C04D-3",
        "title": "責任所在は本人努力ではなく役割分担の見える化",
        "candidate_proposition": "責任所在の自由度は、本人が説明すべきか職場が整えるべきかの二分ではなく、本人、上司・同僚、専門支援者、医療・生活支援、制度の役割が仕事場面で見える化されるかで現れる可能性。",
        "counter_proposition": "責任所在に見える信号は、支援制度アクセス、職場理解、評価処遇、本人の希望整理、生活保障の問題を混ぜているかもしれない。",
        "review_question": "未接続の役割は、本人説明、職場調整、支援者媒介、医療・生活支援、制度利用のどれか。",
    },
    "評価接続": {
        "attack_id": "C04D-4",
        "title": "評価接続はできる仕事を評価・技能・処遇へ戻す自由度",
        "candidate_proposition": "評価接続の自由度は、配慮の有無ではなく、本人が遂行できる仕事内容、学習機会、技能習得、昇進、処遇、キャリアが、情報参加の構造を通じて評価へ接続されるかで現れる可能性。",
        "counter_proposition": "評価接続に見える信号は、仕事量、職務難度、雇用形態、賃金水準、満足度、生活保障の問題かもしれない。",
        "review_question": "評価から落ちているのは、技能習得、仕事成果、役割拡大、処遇、昇進、働きがいのどれか。",
    },
    "役割接続": {
        "attack_id": "C04D-5",
        "title": "役割接続は会話参加を職場内の役割へ戻す自由度",
        "candidate_proposition": "役割接続の自由度は、親睦や会話量ではなく、会議、相談、作業補助、危険確認、訓練、改善提案などの情報参加が職場内の役割遂行へ接続されるかで現れる可能性。",
        "counter_proposition": "役割接続に見える信号は、職場関係、作業場所、支援者配置、キャリア評価、健康時間の問題かもしれない。",
        "review_question": "情報参加が不足している結果、担えない役割や参加しにくい場面は何か。",
    },
    "本人の依頼負荷": {
        "attack_id": "C04D-6",
        "title": "本人の依頼負荷は自己主張ではなく翻訳コスト",
        "candidate_proposition": "本人の依頼負荷は、本人の意欲や説明能力の問題ではなく、必要配慮、健康条件、仕事条件、支援役割を繰り返し本人が翻訳・交渉し続ける構造コストとして現れる可能性。",
        "counter_proposition": "依頼負荷に見える信号は、開示範囲、支援接続、職場理解、生活保障、職務選択の未整理かもしれない。",
        "review_question": "本人が繰り返し担っている翻訳は、健康条件、配慮内容、仕事条件、支援制度、評価・役割のどれか。",
    },
}


def bridge_counts() -> dict[str, Any]:
    branch_bridge = load_json(BRIDGE_JSON)["branch_bridge"]
    target_ids = {"P1-C04A-1", "P1-C04A-2", "P1-C04A-3", "P1-C04B", "P1-C05E"}
    counts: Counter[str] = Counter()
    examples: list[str] = []
    for item in branch_bridge:
        if item["branch_id"] not in target_ids:
            continue
        counts.update(item.get("fragmentary_source_counts", {}))
        examples.extend(item.get("fragmentary_source_examples", [])[:4])
    return {
        "source_family_counts": dict(counts.most_common()),
        "example_source_ids": unique_preserve(examples)[:12],
    }


def build_attacks() -> list[dict[str, Any]]:
    rows = load_rows()
    four = four_placement_by_freedom()
    assignments = assignment_index()
    c04_subbranches = c04_subbranch_index()
    attacks: list[dict[str, Any]] = []
    for freedom in C04_FREEDOMS:
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
        total_candidate_count = sum(placement_counts.values())
        assignment_counts = Counter()
        boundary_counts = Counter()
        c04_subbranch_counts = Counter()
        for record_id in all_ids:
            assignment_counts.update(assignments.get(record_id, {}).get("branches", set()))
            boundary_counts.update(assignments.get(record_id, {}).get("boundary_tags", set()))
            if record_id in c04_subbranches:
                c04_subbranch_counts[c04_subbranches[record_id]] += 1
        reading = FREEDOM_READINGS[freedom]
        attacks.append(
            {
                "attack_id": reading["attack_id"],
                "freedom": freedom,
                "title": reading["title"],
                "status": "machine_generated_unreviewed_no_promotion",
                "candidate_record_count": total_candidate_count,
                "listed_id_count": len(all_ids),
                "placement_counts": placement_counts,
                "listed_placement_id_counts": {key: len(value) for key, value in ids_by_placement.items()},
                "readiness_before_attack": item["readiness"],
                "candidate_proposition": reading["candidate_proposition"],
                "counter_proposition": reading["counter_proposition"],
                "review_question": reading["review_question"],
                "representative_ids": all_ids[:12],
                "boundary_ids": ids_by_placement["boundary"][:12],
                "residual_ids": ids_by_placement["residual"][:12],
                "problem_ids": ids_by_placement["problem"][:12],
                "mitigation_ids": ids_by_placement["mitigation"][:12],
                "profile": compact_record_profile(all_ids, rows),
                "assignment_counts": dict(assignment_counts.most_common(8)),
                "boundary_tag_counts": dict(boundary_counts.most_common(8)),
                "c04_subbranch_anchor_counts": dict(c04_subbranch_counts.most_common()),
                "method_note": "問題側が薄い場合でも、残余・境界信号を、仕事参加へ接続する自由度として読む。支援の有効性や妥当性は判断しない。",
            }
        )
    return attacks


def overlap_matrix(attacks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sets = {attack["freedom"]: set(attack["representative_ids"] + attack["boundary_ids"] + attack["residual_ids"]) for attack in attacks}
    rows: list[dict[str, Any]] = []
    for left, left_ids in sets.items():
        for right, right_ids in sets.items():
            if left >= right:
                continue
            rows.append(
                {
                    "left": left,
                    "right": right,
                    "shared_record_count": len(left_ids & right_ids),
                }
            )
    return sorted(rows, key=lambda item: item["shared_record_count"], reverse=True)


def build_payload() -> dict[str, Any]:
    attacks = build_attacks()
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "C04の直接信号がC05/C06/C03へ吸収される構造穴を、情報参加の実装自由度へ割り直す。",
        "attack_result": "C04の直接信号は大きな独立母集団ではなく、情報形式、確認可能性、責任所在、評価接続、役割接続、本人の依頼負荷が重なる少数・高密度の構造束として現れる。問題側が0でも、残余・境界側に仕事参加へ戻る自由度がある。",
        "methodological_gain": "情報参加を『配慮項目』や『コミュニケーション能力』としてではなく、仕事情報を責任・安全・技能・評価・役割へ同期する構造自由度として扱う。",
        "attack_count": len(attacks),
        "attacks": attacks,
        "freedom_overlap": overlap_matrix(attacks),
        "fragmentary_bridge": bridge_counts(),
        "non_judgment_boundary": "支援妥当性、就労可否、医学・法的・HR・配慮十分性判断、レビュー状態移動、知識昇格はしない。",
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
        "# Stage 1 Production C04 Direct Information Participation Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C04の構造穴を、情報参加が仕事参加へ接続する自由度として潰すための再分析。",
        "",
        "## 結果",
        "",
        payload["attack_result"],
        "",
        "## 方法上の獲得",
        "",
        payload["methodological_gain"],
        "",
        "## 6つの直接自由度",
        "",
        "| ID | 自由度 | candidate records | listed IDs | placement p/m/r/b | 読み | 代表ID |",
        "|---|---|---:|---:|---:|---|---|",
    ]
    for attack in payload["attacks"]:
        pc = attack["placement_counts"]
        lines.append(
            f"| `{attack['attack_id']}` | {attack['freedom']} | {attack['candidate_record_count']} | "
            f"{attack['listed_id_count']} | "
            f"{pc['problem']}/{pc['mitigation']}/{pc['residual']}/{pc['boundary']} | "
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
                f"- branch: {join_counts(attack['assignment_counts'])}",
                f"- boundary_tag: {join_counts(attack['boundary_tag_counts'])}",
                "",
                f"方法メモ: {attack['method_note']}",
                "",
            ]
        )

    lines.extend(
        [
            "## 自由度の重なり",
            "",
            "同じrecordが複数自由度に現れる場合、それは分類の失敗だけではなく、同じ情報参加構造の中で、媒体、確認、責任、評価、役割、依頼負荷が同時に動く可能性を示す。",
            "",
            "| freedom A | freedom B | shared records |",
            "|---|---|---:|",
        ]
    )
    for item in payload["freedom_overlap"][:12]:
        lines.append(f"| {item['left']} | {item['right']} | {item['shared_record_count']} |")

    bridge = payload["fragmentary_bridge"]
    lines.extend(
        [
            "",
            "## 断片資料ブリッジ",
            "",
            f"source_family_counts: {join_counts(bridge['source_family_counts'])}",
            f"example_source_ids: {ids_text(bridge['example_source_ids'], 10)}",
            "",
            "断片資料は、支援妥当性の根拠ではなく、同型構造・反対構造・欠損軸を探すための探索対象として扱う。",
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
