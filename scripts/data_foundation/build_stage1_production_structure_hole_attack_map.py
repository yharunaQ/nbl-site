#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
SEED_JSON = RUN_DIR / "stage1-production-knowledge-network-seed-v0-2026-05-18.json"
FOUR_JSON = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
REL_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structure-hole-attack-map-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structure-hole-attack-map-v0-2026-05-18.md"

DEEP_ARTIFACTS = {
    "C01-health-time": RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.json",
    "C02-translation": RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.json",
    "C03-support-continuity": RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.json",
    "C04-information-participation": RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.json",
    "C05-3-pure": RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.json",
    "C06-life-security": RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.json",
    "C07-C08-participation": RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.json",
}

WEAK_READINESS = {
    "not_ready_no_problem_side",
    "needs_boundary_or_contrast_search",
    "needs_mitigation_or_residual_search",
    "minority_or_revival_search_signal",
}

WEAK_HANDLING_TERMS = (
    "hold",
    "boundary",
    "not_standalone",
    "thin_signal",
    "low_context",
    "blind_spot",
)


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def collect_deep_subbranches() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for artifact_id, path in DEEP_ARTIFACTS.items():
        if not path.exists():
            continue
        payload = load_json(path)
        for key in ("subbranches", "c07_subbranches", "c08_subbranches"):
            for branch in payload.get(key, []):
                rows.append({"artifact_id": artifact_id, **branch})
    return rows


def weakness_score_for_four(row: dict[str, Any]) -> int:
    score = 0
    if row["readiness"] in WEAK_READINESS:
        score += 4
    if row["problem_count"] == 0:
        score += 3
    if row["mitigation_count"] == 0:
        score += 2
    if row["boundary_count"] < 3:
        score += 1
    if row["residual_count"] >= 100:
        score += 2
    return score


def direct_freedom_holes(four_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    holes = []
    for row in four_rows:
        score = weakness_score_for_four(row)
        if score < 6:
            continue
        holes.append(
            {
                "hole_id": f"FH-{len(holes)+1:02d}",
                "contact_id": row["contact_id"],
                "freedom": row["freedom"],
                "weakness_score": score,
                "readiness": row["readiness"],
                "problem_count": row["problem_count"],
                "mitigation_count": row["mitigation_count"],
                "residual_count": row["residual_count"],
                "boundary_count": row["boundary_count"],
                "interpretation": direct_hole_interpretation(row),
                "next_attack": direct_hole_next_attack(row),
                "example_ids": {
                    "problem": row.get("problem_ids", [])[:5],
                    "mitigation": row.get("mitigation_ids", [])[:5],
                    "residual": row.get("residual_ids", [])[:5],
                    "boundary": row.get("boundary_ids", [])[:5],
                },
            }
        )
    holes.sort(key=lambda item: (-item["weakness_score"], item["contact_id"], item["freedom"]))
    return holes


def direct_hole_interpretation(row: dict[str, Any]) -> str:
    contact = row["contact_id"]
    freedom = row["freedom"]
    if contact == "C-07-career-evaluation-role":
        return "評価・役割・キャリア参加は、問題側として語られにくく、残余・境界に沈むため、調査データだけでは過小評価される可能性。"
    if contact == "C-04-information-participation-quality":
        return "情報参加は少数派構造で、直接の問題・軽減対が薄い。外部資料と境界例を使い、仕事参加の確認可能性として復元する必要。"
    if contact == "C-08-prework-life-readiness":
        return "就労前参加は本人準備不足に見えやすく、問題側として明示されにくい。入口翻訳・支援接続の前段として読む必要。"
    if contact == "C-05-physical-access-worksite" and freedom == "通勤":
        return "通勤は大きな残余信号があるが、対照や境界が薄い。移動・健康時間・生活保障の交差として分け直す必要。"
    if contact == "C-02-entry-translation" and freedom == "開示範囲":
        return "開示範囲は問題・軽減が見えるが境界が薄い。本人説明能力に落とさず、情報範囲・媒介・制度修飾として読む必要。"
    return "直接信号の極性が偏っており、現抽出のままでは構造自由度を過小または過大に読む可能性。"


def direct_hole_next_attack(row: dict[str, Any]) -> str:
    contact = row["contact_id"]
    freedom = row["freedom"]
    if contact == "C-07-career-evaluation-role":
        return "C07をC04情報参加・C06生活保障・C03支援接続の上方向エッジとして、外部資料側から軽減/反対構造を補う。"
    if contact == "C-04-information-participation-quality":
        return "C04の直接少数例、P1-C04B/P1-C05E境界、workshop/NIVR情報参加資料を同型探索する。"
    if contact == "C-08-prework-life-readiness":
        return "C08をC02/C03/C06の前段に置き、未就労・過去就労・非就労志向を分けて追加読解する。"
    if contact == "C-05-physical-access-worksite" and freedom == "通勤":
        return "通勤を移動経路、健康時間、生活保障、求人条件のどれが主自由度かで再分岐する。"
    if contact == "C-02-entry-translation" and freedom == "開示範囲":
        return "開示範囲を本人条件の企業語化、求人条件の生活語化、支援者媒介、制度ステータスに分けて境界例を補う。"
    return "問題側、軽減側、残余側、境界側の欠けている極を補う探索を実行する。"


def deep_handling_holes(subbranches: list[dict[str, Any]]) -> list[dict[str, Any]]:
    holes = []
    for row in subbranches:
        handling = row.get("handling", "")
        if not any(term in handling for term in WEAK_HANDLING_TERMS):
            continue
        record_count = int(row.get("record_count", 0))
        severity = 2
        if "structural_blind_spot" in handling or "ethical_boundary" in handling:
            severity = 5
        elif record_count >= 500 and ("boundary" in handling or "hold" in handling):
            severity = 4
        elif record_count >= 100:
            severity = 3
        holes.append(
            {
                "hole_id": f"SH-{len(holes)+1:02d}",
                "artifact_id": row["artifact_id"],
                "subbranch_id": row["subbranch_id"],
                "title": row.get("title", ""),
                "record_count": record_count,
                "handling": handling,
                "severity": severity,
                "candidate_proposition": row.get("candidate_proposition", ""),
                "counter_proposition": row.get("counter_proposition", ""),
                "next_attack": subbranch_next_attack(row),
                "representative_ids": row.get("representative_ids", [])[:8],
                "contrast_ids": row.get("contrast_ids", [])[:8],
            }
        )
    holes.sort(key=lambda item: (-item["severity"], -item["record_count"], item["subbranch_id"]))
    return holes


def subbranch_next_attack(row: dict[str, Any]) -> str:
    sid = row["subbranch_id"]
    if sid.startswith("C07R"):
        return "C07を構造的盲点として扱い、評価・役割・処遇の問題側/軽減側を断片資料から補う。"
    if sid.startswith("C08P-5"):
        return "非就労志向を問題化しない倫理境界として、仕事参加以外の生活価値を保持したまま構造を読む。"
    if sid.startswith("C04I-4"):
        return "情報参加と物理環境を分け、音声・視覚・安全確認・設備表示の接触点へ再分岐する。"
    if sid.startswith("C01H-7") or sid.startswith("C05"):
        return "健康時間、休息、物理環境、移動を主自由度別に分け、設備リスト化を避ける。"
    if sid.startswith("C06"):
        return "生活保障を背景化せず、仕事選択、支援接続、評価処遇、健康時間のどれを制約するかで分ける。"
    return "現handlingを確定させず、対照例・反対命題・外部資料接続で再読解する。"


def fragmentary_holes(branch_bridge: list[dict[str, Any]]) -> list[dict[str, Any]]:
    holes = []
    for row in branch_bridge:
        branch_id = row.get("branch_id", "")
        source_count = int(row.get("fragmentary_source_count", 0))
        survey_count = int(row.get("survey_case_count", 0))
        if source_count >= 25 and survey_count >= 50:
            continue
        if source_count == 0 and survey_count == 0:
            continue
        holes.append(
            {
                "hole_id": f"BH-{len(holes)+1:02d}",
                "branch_id": branch_id,
                "label": row.get("label", ""),
                "survey_case_count": survey_count,
                "fragmentary_source_count": source_count,
                "freedoms": row.get("freedoms", []),
                "example_sources": row.get("example_sources", [])[:5],
                "next_attack": "調査データ側と断片資料側のどちらが薄いかを分け、同型探索の検索語と対照構造を増やす。",
            }
        )
    holes.sort(key=lambda item: (item["fragmentary_source_count"], item["survey_case_count"]))
    return holes


def relation_holes(relations: list[dict[str, Any]]) -> list[dict[str, Any]]:
    holes = []
    for row in relations:
        count = int(row["record_count"])
        if count >= 100:
            continue
        holes.append(
            {
                "hole_id": f"RH-{len(holes)+1:02d}",
                "relation_id": row["relation_id"],
                "title": row["title"],
                "record_count": count,
                "reading": row["reading"],
                "counter_reading": row["counter_reading"],
                "next_attack": "小さいが重要な関係なので、少数派構造として保持し、同型例と反対例を追加探索する。",
                "representative_ids": row.get("representative_ids", [])[:8],
                "boundary_ids": row.get("boundary_ids", [])[:8],
            }
        )
    holes.sort(key=lambda item: item["record_count"])
    return holes


def build_payload() -> dict[str, Any]:
    seed = load_json(SEED_JSON)
    four = load_json(FOUR_JSON)["four_placement_candidates"]
    relation = load_json(REL_JSON)["relations"]
    bridge = load_json(BRIDGE_JSON)["branch_bridge"]
    subbranches = collect_deep_subbranches()

    direct = direct_freedom_holes(four)
    deep = deep_handling_holes(subbranches)
    branch = fragmentary_holes(bridge)
    rel = relation_holes(relation)

    next_attack_order = [
        {
            "rank": 1,
            "target": "C04 direct information participation",
            "why": "直接信号が少数で、C05/C06/C03へ吸収されやすい。ここを潰さないと聴覚・視覚・認知・安全確認の自由度が落ちる。",
            "input_holes": [h["hole_id"] for h in direct if h["contact_id"] == "C-04-information-participation-quality"][:5]
            + [h["hole_id"] for h in deep if h["subbranch_id"].startswith("C04")][:5],
            "concrete_next": "C04/P1-C04B/P1-C05Eの境界例を、情報形式・確認可能性・責任・評価・安全確認へ再分岐する。",
        },
        {
            "rank": 2,
            "target": "C07 quality of participation",
            "why": "問題側が薄いが、仕事参加の質を落とすとFalconが就職/定着の二点モデルに戻る。",
            "input_holes": [h["hole_id"] for h in direct if h["contact_id"] == "C-07-career-evaluation-role"][:7]
            + [h["hole_id"] for h in deep if h["subbranch_id"].startswith("C07")][:5],
            "concrete_next": "評価・役割・処遇・技能習得・働きがいを、情報参加・生活保障・支援接続の上方向エッジとして補強する。",
        },
        {
            "rank": 3,
            "target": "C08 prework participation",
            "why": "本人準備不足へ落ちやすい。入口以前の生活・体力・活動参加を構造化しないと自由度が入口で詰まる。",
            "input_holes": [h["hole_id"] for h in direct if h["contact_id"] == "C-08-prework-life-readiness"][:5]
            + [h["hole_id"] for h in deep if h["subbranch_id"].startswith("C08")][:5],
            "concrete_next": "未就労、過去就労、非就労志向を分け、C02/C03/C06への橋と倫理境界を追加読解する。",
        },
        {
            "rank": 4,
            "target": "C05 commuting / mobility / worksite split",
            "why": "通勤・移動・姿勢・設備が残余に偏り、支援メニュー表へ戻る危険がある。",
            "input_holes": [h["hole_id"] for h in direct if h["contact_id"] == "C-05-physical-access-worksite"][:3]
            + [h["hole_id"] for h in deep if h["artifact_id"].startswith("C05")][:5],
            "concrete_next": "通勤を、移動経路、健康時間、求人条件、生活保障、作業場所のどれが主自由度かで再分岐する。",
        },
        {
            "rank": 5,
            "target": "C02 disclosure scope",
            "why": "開示範囲は本人説明能力に落ちやすく、境界例が少ない。",
            "input_holes": [h["hole_id"] for h in direct if h["contact_id"] == "C-02-entry-translation" and h["freedom"] == "開示範囲"],
            "concrete_next": "開示範囲を、本人条件の企業語化、求人条件の生活語化、支援者媒介、制度ステータスの境界として再読解する。",
        },
    ]

    return {
        "run_id": seed["run_id"],
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": "Stage 1 production seedの未閉鎖構造穴を、次に潰す分析対象へ変換する。進捗管理ではなく分析攻撃地図。",
        "seed_counts": {
            "deep_subbranch_count": seed["deep_subbranch_count"],
            "relation_count": seed["relation_count"],
            "fragmentary_source_link_count": seed["fragmentary_source_link_count"],
        },
        "hole_counts": {
            "direct_freedom_holes": len(direct),
            "deep_subbranch_handling_holes": len(deep),
            "fragmentary_bridge_holes": len(branch),
            "small_relation_holes": len(rel),
        },
        "next_attack_order": next_attack_order,
        "direct_freedom_holes": direct,
        "deep_subbranch_handling_holes": deep,
        "fragmentary_bridge_holes": branch,
        "small_relation_holes": rel,
    }


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structure Hole Attack Map",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "これは進捗表ではなく、Stage 1 production seedでまだ閉じていない構造穴を、次に潰す分析対象へ変換したもの。",
        "",
        "## 現在のseed",
        "",
        f"- deep subbranch数: {payload['seed_counts']['deep_subbranch_count']}",
        f"- relation edge数: {payload['seed_counts']['relation_count']}",
        f"- fragmentary source link数: {payload['seed_counts']['fragmentary_source_link_count']}",
        "",
        "## 穴の数",
        "",
        f"- direct freedom holes: {payload['hole_counts']['direct_freedom_holes']}",
        f"- deep subbranch handling holes: {payload['hole_counts']['deep_subbranch_handling_holes']}",
        f"- fragmentary bridge holes: {payload['hole_counts']['fragmentary_bridge_holes']}",
        f"- small relation holes: {payload['hole_counts']['small_relation_holes']}",
        "",
        "## 次の攻撃順",
        "",
    ]
    for item in payload["next_attack_order"]:
        lines.extend(
            [
                f"### {item['rank']}. {item['target']}",
                "",
                f"理由: {item['why']}",
                "",
                f"入力hole: {', '.join(f'`{hole}`' for hole in item['input_holes']) or 'なし'}",
                "",
                f"次にやること: {item['concrete_next']}",
                "",
            ]
        )

    lines.extend(["## Direct Freedom Holes", "", "| hole | contact/freedom | readiness | p/m/r/b | next attack |", "|---|---|---|---:|---|"])
    for hole in payload["direct_freedom_holes"]:
        lines.append(
            f"| `{hole['hole_id']}` | {hole['contact_id']} / {hole['freedom']} | {hole['readiness']} | "
            f"{hole['problem_count']}/{hole['mitigation_count']}/{hole['residual_count']}/{hole['boundary_count']} | {hole['next_attack']} |"
        )

    lines.extend(["", "## Deep Subbranch Handling Holes", "", "| hole | subbranch | records | handling | next attack |", "|---|---|---:|---|---|"])
    for hole in payload["deep_subbranch_handling_holes"]:
        lines.append(
            f"| `{hole['hole_id']}` | `{hole['subbranch_id']}` {hole['title']} | {hole['record_count']} | {hole['handling']} | {hole['next_attack']} |"
        )

    lines.extend(["", "## Small Relation Holes", "", "| hole | relation | records | next attack |", "|---|---|---:|---|"])
    for hole in payload["small_relation_holes"]:
        lines.append(f"| `{hole['hole_id']}` | `{hole['relation_id']}` {hole['title']} | {hole['record_count']} | {hole['next_attack']} |")

    lines.extend(
        [
            "",
            "## 方法上の修正",
            "",
            "- ここで止まらない。次は `次の攻撃順` のrank 1から、構造穴を実際に潰す。",
            "- 件数が少ない、問題側が薄い、境界扱いになっている、という理由だけで構造を捨てない。",
            "- ただし、支援妥当性、就労可否、本人意欲、評価妥当性、法的・医学的判断はしない。",
            "",
        ]
    )
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    payload = build_payload()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
