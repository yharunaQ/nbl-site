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
OUT_JSON = RUN_DIR / "stage1-production-c08-prework-participation-attack-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-c08-prework-participation-attack-v0-2026-05-18.md"

CASE_FILES = [
    ROOT / "references/derived/scima-fchma/nanbyo_survey_4000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
    ROOT / "references/derived/scima-fchma/employment_survey_3000/redacted-narrative-integrated-v0-2026-05-13/case-interpretations.jsonl",
]

C08_CONTACT = "C-08-prework-life-readiness"
C08_FREEDOMS = ["生活リズム", "体力", "日中活動", "家族支援", "地域生活", "訓練", "就労自信"]

SIGNAL_BUCKETS = {
    "健康時間・回復": ["治療", "通院", "服薬", "体調", "休憩", "疲れ", "無理", "回復", "健康管理"],
    "生活リズム・日中活動": ["生活リズム", "日中活動", "労働習慣", "生活", "地域", "活動"],
    "体力・身体操作": ["体力", "歩行", "運動", "移動", "通勤", "姿勢", "身体", "疲れ"],
    "家族・地域・生活保障": ["家族", "地域", "収入", "生活", "家計", "安心"],
    "入口翻訳・求人接続": ["求人", "応募", "面接", "職場実習", "職場見学", "就職活動", "説明", "配慮"],
    "訓練・学習・段階化": ["訓練", "講座", "学習", "資格", "技能", "職業能力", "実習"],
    "支援接続・制度利用": ["相談", "支援", "制度", "利用", "ケース会議", "専門"],
    "就労自信・将来見通し": ["自信", "期待", "将来", "意欲", "説得", "挑戦", "やりたい"],
}

DIVERSITY_BUCKETS = {
    "体調変動・疲労・痛み": ["疲れ", "体調", "痛み", "活力", "崩れ", "進行"],
    "治療時間・難病": ["難病", "慢性", "通院", "治療", "免疫", "透析", "服薬"],
    "精神・心理": ["精神", "気分", "不安", "統合失調", "パニック"],
    "認知・発達・知的": ["知的", "発達", "学習", "高次脳", "注意"],
    "移動・姿勢・身体操作": ["歩行", "運動", "平衡", "切断", "肢体", "移動", "姿勢"],
    "視覚情報": ["弱視", "視野", "視覚"],
    "聴覚・音声情報": ["難聴", "ろう", "聴覚"],
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
        "readiness_unresolved",
        "job_search_unresolved",
        "support_use_gaps",
        "desired_supports",
        "low_work_confidence",
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
    result: list[str] = []
    for key in ["health_condition_groups", "body_function_signals", "impairment_signals", "handbook_signals"]:
        value = row.get(key)
        if isinstance(value, list):
            result.extend(str(item) for item in value)
    return result


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
    return {row["freedom"]: row for row in rows if row["contact_id"] == C08_CONTACT}


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
    for record_id in record_ids:
        source[record_id.split(":", 1)[0]] += 1
        row = rows.get(record_id)
        if not row:
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
    }


FREEDOM_READINGS = {
    "生活リズム": {
        "attack_id": "C08P-A1",
        "title": "生活リズムは勤怠習慣ではなく、健康時間を入口へ接続する同期構造",
        "candidate_proposition": "生活リズムの自由度は、本人の規則正しさではなく、治療、回復、日中活動、支援利用、求人条件を仕事入口の時間構造へ同期できるかで現れる可能性。",
        "counter_proposition": "生活リズムに見える信号は、健康時間、生活保障、家族条件、地域資源、設問上の残余を拾っているだけかもしれない。",
        "review_question": "乱れている、または接続していないのは、睡眠、治療、回復、日中活動、訓練、求人時間、支援利用のどれか。",
    },
    "体力": {
        "attack_id": "C08P-A2",
        "title": "体力は努力量ではなく、活動容量と仕事条件の接続",
        "candidate_proposition": "体力の自由度は、頑張れるかではなく、疲労、痛み、移動、通院、回復、仕事内容、勤務時間を、入口以前にどの活動容量として見積もれるかで現れる可能性。",
        "counter_proposition": "体力に見える信号は、C01健康時間やC05身体操作の境界であり、C08として独立させると過剰分割かもしれない。",
        "review_question": "不足しているのは体力そのものか、回復時間、移動負荷、仕事内容、訓練量、勤務時間の見積もりか。",
    },
    "日中活動": {
        "attack_id": "C08P-A3",
        "title": "日中活動は就労前の社会参加接点",
        "candidate_proposition": "日中活動の自由度は、仕事未満の活動ではなく、生活から職業準備、訓練、実習、地域参加へ橋をかける前段参加として現れる可能性。",
        "counter_proposition": "日中活動に見える信号は、訓練、地域生活、生活リズム、生活保障の別表現かもしれない。",
        "review_question": "仕事入口へ橋渡しする活動は、日中活動、訓練、実習、地域参加、生活再建、支援利用のどれか。",
    },
    "家族支援": {
        "attack_id": "C08P-A4",
        "title": "家族支援は依存ではなく、生活制約と入口選択の条件",
        "candidate_proposition": "家族支援の自由度は、本人の自立不足ではなく、家族役割、生活保障、通院、地域資源、支援制度が仕事入口の選択肢を広げるか狭めるかで現れる可能性。",
        "counter_proposition": "家族支援に見える信号は、生活保障、年齢段階、地域条件、本人希望の未確定を拾っているだけかもしれない。",
        "review_question": "家族・生活条件は、時間、収入、通院、移動、意思決定、支援利用のどこで入口を変えているか。",
    },
    "地域生活": {
        "attack_id": "C08P-A5",
        "title": "地域生活は背景ではなく、入口以前の参加基盤",
        "candidate_proposition": "地域生活の自由度は、生活環境の背景ではなく、交通、支援資源、日中活動、相談先、求人圏、安心して生活できる基盤が仕事入口へ接続するかで現れる可能性。",
        "counter_proposition": "地域生活に見える信号は、生活保障や支援接続の広い信号を拾っているだけかもしれない。",
        "review_question": "地域条件が変えているのは、移動、相談先、訓練、求人圏、日中活動、生活保障のどれか。",
    },
    "訓練": {
        "attack_id": "C08P-A6",
        "title": "訓練は不足補正ではなく、入口への段階化",
        "candidate_proposition": "訓練の自由度は、本人能力不足を補う場ではなく、健康時間、生活リズム、活動容量、職種理解、支援接続を、求人・実習・就職へ段階的に接続する構造として現れる可能性。",
        "counter_proposition": "訓練に見える信号は、入口翻訳、支援メニュー、資格、職種選択の問題かもしれない。",
        "review_question": "訓練で接続すべきものは、生活リズム、体力、技能、求人理解、実習、支援者媒介、健康管理のどれか。",
    },
    "就労自信": {
        "attack_id": "C08P-A7",
        "title": "就労自信は意欲ではなく、成立条件が見える感覚",
        "candidate_proposition": "就労自信の自由度は、本人の意欲の強弱ではなく、健康時間、仕事条件、支援接続、生活保障、訓練、過去経験から、働ける条件が見えるかで現れる可能性。",
        "counter_proposition": "就労自信に見える信号は、心理状態、生活不安、病状負荷、過去就業困難の二次的結果かもしれない。",
        "review_question": "自信を下げているのは、健康見通し、仕事内容、支援利用、収入、訓練、過去経験、地域条件のどれか。",
    },
}


def relation_summaries() -> list[dict[str, Any]]:
    ids = {"SR-C08-PREWORK-ENTRY-TRANSLATION", "SR-C08-PASTWORK-LIFE-REBUILDING"}
    return [item for item in load_json(RELATION_JSON)["relations"] if item["relation_id"] in ids]


def c08_deep_summary() -> dict[str, Any]:
    data = load_json(C07C08_JSON)
    return {
        "target_records": data["source_set"]["c08_prework_life_readiness_boundary_records"],
        "subbranches": [
            {
                "subbranch_id": item["subbranch_id"],
                "title": item["title"],
                "record_count": item["record_count"],
                "handling": item["handling"],
                "distribution": item["distribution"],
            }
            for item in data["c08_subbranches"]
        ],
    }


def fragmentary_bridge() -> dict[str, Any]:
    target_ids = {"P1-C01C", "P1-C02B", "P1-C03B", "P1-C06B"}
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
    for freedom in C08_FREEDOMS:
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
                "method_note": "本人の準備不足や意欲不足へ還元せず、入口以前に仕事条件へ接続される自由度として扱う。",
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
        "purpose": "C08が本人準備不足へ落ちる構造穴を、入口以前の生活・体力・活動参加の自由度として復活させる。",
        "attack_result": "C08直接信号は、生活リズムを除く多くの自由度で100件規模の残余を持ち、C02入口翻訳、C03支援接続、C06生活保障、C01健康時間へ強く接続する。これは本人の準備不足ではなく、生活・体力・地域・訓練・就労自信が仕事入口へ接続される前段構造として読むべきである。",
        "methodological_gain": "C08を『働く前の個人状態』ではなく、仕事入口の成立条件を準備する前段参加構造として扱う。",
        "c08_deep_summary": c08_deep_summary(),
        "relation_summaries": relation_summaries(),
        "attacks": attacks,
        "freedom_overlap": overlap_matrix(attacks),
        "fragmentary_bridge": fragmentary_bridge(),
        "non_judgment_boundary": "就労意欲、就労可否、訓練必要性、家族支援の妥当性、医学・法的・HR判断、レビュー状態移動、知識昇格はしない。",
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
    deep = payload["c08_deep_summary"]
    lines = [
        "# Stage 1 Production C08 Prework Participation Attack",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "C08の構造穴を、入口以前の生活・体力・活動参加が仕事入口へ接続する自由度として潰すための再分析。",
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
        f"- C08 boundary target records: {deep['target_records']}",
    ]
    for relation in payload["relation_summaries"]:
        lines.append(f"- deep relation `{relation['relation_id']}` records: {relation['record_count']} / {relation['reading']}")

    lines.extend(["", "| subbranch | records | handling |", "|---|---:|---|"])
    for branch in deep["subbranches"]:
        lines.append(f"| `{branch['subbranch_id']}` {branch['title']} | {branch['record_count']} | {branch['handling']} |")

    lines.extend(
        [
            "",
            "## 7つの前段自由度",
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
                "",
                f"方法メモ: {attack['method_note']}",
                "",
            ]
        )

    lines.extend(
        [
            "## 自由度の重なり",
            "",
            "同じIDに複数自由度が重なる場合、生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信は、個別の本人要因ではなく入口以前の一体的な参加構造として動く可能性がある。",
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
            "断片資料は、本人準備や訓練必要性を判断する根拠ではなく、同型構造・反対構造・欠損軸を探すための探索対象として扱う。",
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
