#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

OPERATOR_INDEX_JSON = RUN_DIR / "stage1-production-operator-slot-index-v0-2026-05-18.json"
CONTEXT_BRANCH_JSON = RUN_DIR / "stage1-production-context-branch-card-candidates-v0-2026-05-18.json"
FRAGMENTARY_GRAMMAR_JSON = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.json"
STRUCTURAL_GRAMMAR_JSON = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.json"
OVERLAP_DEEP_JSON = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.json"
QUERY_INDEX_JSON = RUN_DIR / "stage1-production-codex-query-index-v0-2026-05-18.json"

OUT_JSON = RUN_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.md"


QUERY_ROUTES: list[dict[str, Any]] = [
    {
        "route_id": "QR-01-health-time-work-design",
        "user_need": "体調変動、通院、疲労、痛み、勤務時間、休憩、休暇、仕事量、評価のずれを構造で読む。",
        "trigger_terms": ["体調", "疲労", "痛み", "通院", "勤務時間", "休憩", "休暇", "仕事量", "評価", "継続"],
        "operators": [
            "OP-01-translate-condition-to-work",
            "OP-03-design-work-contact-point",
            "OP-05-translate-performance-to-value",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-01-continuity-quality-loop",
            "CB-02-work-contact-evaluation-loop",
            "CB-03-life-security-sequencing",
        ],
        "answer_focus": [
            "身体機能・精神機能・全身管理上の条件を、勤務量、休憩、通院時間、職務代替、評価条件へ翻訳できているかを見る。",
            "問題発生側だけでなく、配慮・支援により発生していない側も同じ構造の開閉状態として読む。",
            "生活保障や収入不安が、健康時間と仕事選択の順序を変えていないかを見る。",
        ],
    },
    {
        "route_id": "QR-02-information-work-procedure",
        "user_need": "情報保障、説明、相談、確認、職場内伝達、作業手順化のずれを構造で読む。",
        "trigger_terms": ["情報", "説明", "相談", "伝達", "確認", "手順", "マニュアル", "コミュニケーション"],
        "operators": [
            "OP-02-synchronize-information",
            "OP-03-design-work-contact-point",
            "OP-06-protect-disclosure-boundary",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-01-continuity-quality-loop",
            "CB-04-information-work-procedure-knot",
        ],
        "answer_focus": [
            "本人の説明能力ではなく、情報形式、確認可能性、責任所在、職務手順、評価・安全確認への接続として読む。",
            "開示量の多寡ではなく、誰に何をどこまで伝え、仕事条件へどう翻訳するかの境界設計として読む。",
            "断片資料は根拠確定ではなく、どのICF軸が欠けているかを発見するslotとして扱う。",
        ],
    },
    {
        "route_id": "QR-03-worksite-contact-and-mobility",
        "user_need": "通勤、移動、姿勢、設備、作業場所、安全確認、職務代替を構造で読む。",
        "trigger_terms": ["通勤", "移動", "設備", "作業場所", "姿勢", "安全", "職務代替", "動線", "接触点"],
        "operators": [
            "OP-01-translate-condition-to-work",
            "OP-03-design-work-contact-point",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-02-work-contact-evaluation-loop",
            "CB-04-information-work-procedure-knot",
            "CB-06-minority-window-revival",
        ],
        "answer_focus": [
            "移動や設備をリスト化せず、仕事参加の接触点、情報形式、評価、健康時間が同時に変わる場所として読む。",
            "視覚、聴覚、肢体、内部障害、認知・発達などの条件窓により、有効な接触点設計が変わることを保持する。",
            "少数窓は特殊例として孤立させず、同じ構造が別形態を取る場所として上位構造へ戻す。",
        ],
    },
    {
        "route_id": "QR-04-life-security-sequencing",
        "user_need": "収入、休業、医療費、家計、制度対象、生活再建、働く順序の問題を構造で読む。",
        "trigger_terms": ["収入", "休業", "医療費", "家計", "生活", "制度", "保障", "再建", "順序"],
        "operators": [
            "OP-01-translate-condition-to-work",
            "OP-04-sequence-entry-and-life-security",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-03-life-security-sequencing",
            "CB-05-entry-prework-translation",
        ],
        "answer_focus": [
            "生活保障を就労意欲や能力の判断に変換せず、仕事選択、健康時間、支援接続、訓練順序を変える制約面として読む。",
            "応募・就職だけでなく、入口以前の生活リズム、体力、日中活動、家族支援、地域生活を求人条件への翻訳前段として読む。",
            "就労継続、休む、戻る、選び直す自由度のどこが開閉しているかを見る。",
        ],
    },
    {
        "route_id": "QR-05-entry-prework-translation",
        "user_need": "求職前、訓練、日中活動、生活リズム、自信、応募条件、求人理解を構造で読む。",
        "trigger_terms": ["求職", "応募", "訓練", "日中活動", "生活リズム", "自信", "求人", "入口"],
        "operators": [
            "OP-01-translate-condition-to-work",
            "OP-04-sequence-entry-and-life-security",
            "OP-06-protect-disclosure-boundary",
        ],
        "branches": [
            "CB-05-entry-prework-translation",
            "CB-03-life-security-sequencing",
            "CB-04-information-work-procedure-knot",
        ],
        "answer_focus": [
            "入口以前の参加を、就労準備不足ではなく、求人条件、開示境界、訓練・生活・支援接続へ翻訳する前段として読む。",
            "不採用や未就労を結果判断にせず、どの自由度が求人条件へ接続されていないかを見る。",
            "少数ケースはケース数不足で捨てず、同型探索条件として復活可能性を見る。",
        ],
    },
    {
        "route_id": "QR-06-disclosure-boundary-and-mutual-translation",
        "user_need": "病名・障害名の開示、説明範囲、職場理解、支援者の仲介、プライバシー境界を構造で読む。",
        "trigger_terms": ["開示", "病名", "障害名", "職場理解", "説明範囲", "支援者", "仲介", "プライバシー"],
        "operators": [
            "OP-01-translate-condition-to-work",
            "OP-02-synchronize-information",
            "OP-06-protect-disclosure-boundary",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-04-information-work-procedure-knot",
            "CB-05-entry-prework-translation",
            "CB-01-continuity-quality-loop",
        ],
        "answer_focus": [
            "開示を多い/少ないで評価せず、本人条件と職務条件を相互翻訳するための境界設計として読む。",
            "支援者の存在を有効性判断にせず、翻訳、接続、役割分担、更新ループのどこを担っているかで読む。",
            "職場理解は態度一般でなく、手順、評価、安全、相談、責任所在へ落ちているかを見る。",
        ],
    },
    {
        "route_id": "QR-07-quality-career-and-value-translation",
        "user_need": "働きがい、評価、役割拡大、技能習得、処遇、キャリア、定着の質を構造で読む。",
        "trigger_terms": ["働きがい", "評価", "役割", "技能", "処遇", "昇進", "キャリア", "定着", "価値"],
        "operators": [
            "OP-02-synchronize-information",
            "OP-05-translate-performance-to-value",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-01-continuity-quality-loop",
            "CB-02-work-contact-evaluation-loop",
        ],
        "answer_focus": [
            "働けているかどうかではなく、条件付き遂行が役割・技能・評価・将来見通しへ価値化されているかを見る。",
            "健康時間や支援接続があるだけではなく、評価条件と更新ループへつながっているかを見る。",
            "多数派の継続ケースに引きずられず、継続していても参加品質が閉じている境界例を見る。",
        ],
    },
    {
        "route_id": "QR-08-diversity-conditioned-same-structure",
        "user_need": "疾病群・障害種類・年齢・性別などの条件差を、医学モデル的な群まとめでなく、同じ構造の条件窓として読む。",
        "trigger_terms": ["視覚", "聴覚", "発達", "知的", "身体", "内部障害", "難病", "疾病群", "年齢", "性別", "多様性"],
        "operators": [
            "OP-01-translate-condition-to-work",
            "OP-03-design-work-contact-point",
            "OP-04-sequence-entry-and-life-security",
            "OP-07-update-loop",
        ],
        "branches": [
            "CB-06-minority-window-revival",
            "CB-02-work-contact-evaluation-loop",
            "CB-03-life-security-sequencing",
            "CB-05-entry-prework-translation",
        ],
        "answer_focus": [
            "疾病や機能障害を自由度そのものにせず、構造がどの形で開閉するかを変える条件窓として読む。",
            "同じ移動制約でも、視覚、聴覚、肢体、認知、内部障害などで必要な接触点設計が異なる可能性を保持する。",
            "条件窓別の差は、共通構造からの逸脱ではなく、共通構造の具体的な形態差として読む。",
        ],
    },
]


ANSWER_MODES: list[dict[str, Any]] = [
    {
        "mode_id": "AM-01-structural-explanation",
        "use_when": "ユーザーが事例、資料、概念をFalconの構造として説明してほしい時。",
        "steps": [
            "質問語を1つ以上のquery routeへ割り当てる。",
            "routeに接続されたoperatorとcontext branchを読む。",
            "中核構造、開閉/残余状態、代表ID、境界ID、反対構造候補IDを分けて返す。",
            "断片資料は支持根拠ではなく、missing-axis slotまたは同型探索slotとして扱う。",
            "最後に、まだ読めない層をperson/job/environment/support/time/institution/evidenceで明示する。",
        ],
    },
    {
        "mode_id": "AM-02-contrast-and-counter-reading",
        "use_when": "候補命題が粗い、反対命題が弱い、別仮説がありそうな時。",
        "steps": [
            "候補命題を支える構造と、別の主自由度で読める構造を分ける。",
            "反対命題を候補命題の否定材料にせず、別構造の可能性として書く。",
            "boundary IDsを、同じ構造の開閉・残余・混合として読む。",
            "候補が支援有効性やケース正しさへ飛んでいないかを点検する。",
        ],
    },
    {
        "mode_id": "AM-03-diversity-conditioned-reading",
        "use_when": "疾病群、障害種類、年齢層、性別などの差が、多数派要約に吸収されそうな時。",
        "steps": [
            "条件ラベルを医学モデル的な一括群として扱わず、構造が別形態を取る条件窓として扱う。",
            "共通構造と条件窓固有の接触点設計を分ける。",
            "少数窓は単独候補命題にできない場合も、同型探索条件として保存する。",
            "支援方法の一般名ではなく、活動、参加、環境、情報、時間、評価の接点で説明する。",
        ],
    },
    {
        "mode_id": "AM-04-first-principle-bridge",
        "use_when": "②の第一原理整理へ進むため、Stage 1ネットワークから原理候補を抽出する時。",
        "steps": [
            "operatorをまたぐ繰り返し構造を拾う。",
            "特定制度・障害名・支援項目に依存しない構造原理と、条件窓で変形する部分を分ける。",
            "未レビュー構造候補として書き、政策・実務提言や公開表現へは昇格させない。",
        ],
    },
]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def top_items(mapping: dict[str, Any], limit: int = 6) -> dict[str, Any]:
    items = list(mapping.items())
    items.sort(key=lambda item: item[1] if isinstance(item[1], (int, float)) else 0, reverse=True)
    return dict(items[:limit])


def compact_operator(operator: dict[str, Any]) -> dict[str, Any]:
    return {
        "operator_id": operator["operator_id"],
        "name": operator["name"],
        "function": operator["function"],
        "failure_mode": operator["failure_mode"],
        "icf_contact": operator["icf_contact"],
        "query_use": operator["query_use"],
        "grammar_rules": operator["grammar_rules"],
        "record_count_proxy": operator["record_count_proxy"],
        "record_examples": operator["record_examples"][:8],
        "fragmentary_source_count": operator["fragmentary_source_count"],
        "fragmentary_source_family_counts": operator["fragmentary_source_family_counts"],
        "fragmentary_examples": operator["fragmentary_examples"][:8],
        "direct_fragmentary_grammar_slots": operator["direct_fragmentary_grammar_slots"][:8],
        "missing_axis_pressure": top_items(operator["missing_axis_pressure"], 6),
    }


def compact_branch(branch: dict[str, Any]) -> dict[str, Any]:
    slots = branch.get("fragmentary_slots", {})
    return {
        "branch_id": branch["branch_id"],
        "grammar_id": branch["grammar_id"],
        "grammar_name": branch["grammar_name"],
        "operators": branch["operators"],
        "readiness": branch["readiness"],
        "primary_count": branch["primary_count"],
        "boundary_count": branch["boundary_count"],
        "counter_structure_search_count": branch["counter_structure_search_count"],
        "candidate_proposition": branch["candidate_proposition"],
        "counter_proposition": branch["counter_proposition"],
        "non_judgment_hold": branch["non_judgment_hold"],
        "overinterpretation_risk": branch["overinterpretation_risk"],
        "ethical_bias_risk": branch["ethical_bias_risk"],
        "representative_ids": branch["representative_ids"][:10],
        "boundary_ids": branch["boundary_ids"][:10],
        "counter_structure_ids": branch["counter_structure_ids"][:10],
        "status_counts": top_items(branch["status_counts"], 8),
        "condition_counts": top_items(branch["condition_counts"], 8),
        "boundary_condition_counts": top_items(branch["boundary_condition_counts"], 8),
        "state_counts": top_items(branch["state_counts"], 8),
        "fragmentary_slots": {
            "direct_count": slots.get("direct_count", 0),
            "partial_count": slots.get("partial_count", 0),
            "thin_count": slots.get("thin_count", 0),
            "supporting_only_count": slots.get("supporting_only_count", 0),
            "frequent_missing_required_axes": top_items(slots.get("frequent_missing_required_axes", {}), 6),
            "example_source_ids": slots.get("example_source_ids", [])[:8],
        },
        "review_questions": branch["review_questions"],
        "raw_or_redacted_text_included": False,
        "review_status": branch["review_status"],
        "promotion_status": branch["promotion_status"],
    }


def build_route(
    route: dict[str, Any],
    operators_by_id: dict[str, dict[str, Any]],
    branches_by_id: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    ops = [operators_by_id[operator_id] for operator_id in route["operators"] if operator_id in operators_by_id]
    branches = [branches_by_id[branch_id] for branch_id in route["branches"] if branch_id in branches_by_id]
    representative_ids: list[str] = []
    boundary_ids: list[str] = []
    counter_ids: list[str] = []
    for branch in branches:
        representative_ids.extend(branch["representative_ids"][:4])
        boundary_ids.extend(branch["boundary_ids"][:4])
        counter_ids.extend(branch["counter_structure_ids"][:4])
    return {
        **route,
        "operator_summaries": [compact_operator(operator) for operator in ops],
        "branch_summaries": [compact_branch(branch) for branch in branches],
        "representative_record_ids": representative_ids[:18],
        "boundary_record_ids": boundary_ids[:18],
        "counter_structure_record_ids": counter_ids[:18],
    }


def build_network() -> dict[str, Any]:
    operator_payload = load_json(OPERATOR_INDEX_JSON)
    branch_payload = load_json(CONTEXT_BRANCH_JSON)
    fragmentary_payload = load_json(FRAGMENTARY_GRAMMAR_JSON)
    structural_grammar_payload = load_json(STRUCTURAL_GRAMMAR_JSON)
    overlap_deep_payload = load_json(OVERLAP_DEEP_JSON)
    query_index_payload = load_json(QUERY_INDEX_JSON)

    operators_by_id = {item["operator_id"]: item for item in operator_payload["operators"]}
    branches_by_id = {item["branch_id"]: item for item in branch_payload["branch_cards"]}

    routes = [build_route(route, operators_by_id, branches_by_id) for route in QUERY_ROUTES]
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-codex-chat-knowledge-network-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "purpose": "Stage 1の調査データ、workshop、NIVR/web-cache分析成果を、Codexチャット上で専門知識ネットワークとして引くための未レビュー実用入口。",
        "source_artifacts": {
            "operator_slot_index": str(OPERATOR_INDEX_JSON.relative_to(ROOT)),
            "context_branch_card_candidates": str(CONTEXT_BRANCH_JSON.relative_to(ROOT)),
            "fragmentary_source_grammar_slots": str(FRAGMENTARY_GRAMMAR_JSON.relative_to(ROOT)),
            "structural_discovery_grammar": str(STRUCTURAL_GRAMMAR_JSON.relative_to(ROOT)),
            "structural_overlap_deep_context_reading": str(OVERLAP_DEEP_JSON.relative_to(ROOT)),
            "codex_query_index": str(QUERY_INDEX_JSON.relative_to(ROOT)),
        },
        "network_scope": {
            "survey_record_indexed": True,
            "workshop_fragmentary_sources_indexed": True,
            "nivr_web_cache_fragmentary_sources_indexed": True,
            "trusted_web_cache_fragmentary_sources_indexed": True,
            "source_validity_decided": False,
            "support_validity_decided": False,
            "knowledge_promoted": False,
            "public_use_ready": False,
        },
        "local_codex_answer_contract": [
            "必ず未レビュー構造候補として答える。",
            "raw narrative、伏字済み本文、PIIを引用・再出力しない。",
            "record ID、source ID、operator、context branch、grammar slotだけを参照アンカーにする。",
            "支援・配慮の有無を善悪や有効性判断にせず、構造の開閉・残余・境界状態として読む。",
            "疾病群・障害種類・年齢・性別は人間の多様性を示す条件窓として扱い、医学モデル的な一括説明にしない。",
            "断片資料は支持根拠やケース数として扱わず、欠けたICF軸、自由度slot、同型探索条件、反対構造slotとして扱う。",
            "法的、医学的、雇用管理、個別支援妥当性、就労可否、ケース正誤の判断をしない。",
            "回答の最後に、まだ読めない層をperson/job/environment/support/time/institution/evidenceの観点で短く示す。",
        ],
        "answer_modes": ANSWER_MODES,
        "query_routes": routes,
        "network_nodes": {
            "operators": [compact_operator(operator) for operator in operator_payload["operators"]],
            "context_branches": [compact_branch(branch) for branch in branch_payload["branch_cards"]],
            "structural_grammar_rules": structural_grammar_payload.get("grammar_rules", []),
            "fragmentary_grammar_summary": fragmentary_payload["grammar_summary"],
            "deep_overlap_readings": overlap_deep_payload.get("deep_readings", []),
            "codex_query_index_counts": {
                "axis_query_card_count": query_index_payload["axis_query_card_count"],
                "relation_query_card_count": query_index_payload["relation_query_card_count"],
            },
        },
        "try_queries": [
            "就労継続しているが体調管理と評価が噛み合わないケースを、Falconの構造で説明して。",
            "情報保障と職場環境が別々に扱われている時、SCIMA/FCHMAではどう読めるか。",
            "未就労・求職前の支援を応募支援ではなく、入口以前参加の構造で読むとどうなるか。",
            "視覚障害、聴覚障害、内部障害、発達障害で、同じ移動・仕事接触点構造がどう別形態を取るか。",
            "支援があるため問題が発生していないケースと、支援がないため問題が発生しているケースを同じ構造で比較して。",
        ],
    }


def md_list(items: list[str], prefix: str = "-") -> list[str]:
    return [f"{prefix} {item}" for item in items]


def write_markdown(network: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Stage 1 Codex Chat Knowledge Network",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "これは、Stage 1の分析成果をCodex上のチャットで専門知識ネットワークとして使うための入口である。最終知識ではなく、質問をoperator、文脈枝、record ID、断片資料slotへ接続するための未レビュー実用レイヤーとして使う。",
        "",
        "## 使い方の核",
        "",
    ]
    lines.extend(md_list(network["local_codex_answer_contract"]))

    lines.extend([
        "",
        "## Query Routes",
        "",
        "| route | 主な問い | operators | branches |",
        "|---|---|---|---|",
    ])
    for route in network["query_routes"]:
        operators = ", ".join(f"`{operator_id}`" for operator_id in route["operators"])
        branches = ", ".join(f"`{branch_id}`" for branch_id in route["branches"])
        lines.append(f"| `{route['route_id']}` | {route['user_need']} | {operators} | {branches} |")

    lines.extend(["", "## Route Details", ""])
    for route in network["query_routes"]:
        lines.extend([
            f"### {route['route_id']}",
            "",
            f"用途: {route['user_need']}",
            "",
            "見る焦点:",
        ])
        lines.extend(md_list(route["answer_focus"]))
        lines.extend([
            "",
            "代表ID:",
            ", ".join(f"`{record_id}`" for record_id in route["representative_record_ids"][:12]),
            "",
            "境界ID:",
            ", ".join(f"`{record_id}`" for record_id in route["boundary_record_ids"][:12]),
            "",
            "反対構造候補ID:",
            ", ".join(f"`{record_id}`" for record_id in route["counter_structure_record_ids"][:12]),
            "",
            "接続文脈枝:",
        ])
        for branch in route["branch_summaries"]:
            lines.extend([
                f"- `{branch['branch_id']}`: {branch['candidate_proposition']}",
                f"  - 反対構造候補: {branch['counter_proposition']}",
                f"  - count: primary {branch['primary_count']} / boundary {branch['boundary_count']} / counter-search {branch['counter_structure_search_count']}",
                f"  - 多様性条件窓: {', '.join(f'{k} {v}' for k, v in branch['condition_counts'].items())}",
            ])
        lines.append("")

    lines.extend(["## Answer Modes", ""])
    for mode in network["answer_modes"]:
        lines.extend([f"### {mode['mode_id']}", "", f"用途: {mode['use_when']}", "", "手順:"])
        lines.extend(md_list(mode["steps"]))
        lines.append("")

    lines.extend([
        "## Operators",
        "",
        "| operator | 機能 | 典型的な失敗 |",
        "|---|---|---|",
    ])
    for operator in network["network_nodes"]["operators"]:
        lines.append(f"| `{operator['operator_id']}` {operator['name']} | {operator['function']} | {operator['failure_mode']} |")

    lines.extend([
        "",
        "## Context Branches",
        "",
        "| branch | readiness | primary | boundary | candidate proposition |",
        "|---|---|---:|---:|---|",
    ])
    for branch in network["network_nodes"]["context_branches"]:
        lines.append(
            f"| `{branch['branch_id']}` | `{branch['readiness']}` | {branch['primary_count']} | {branch['boundary_count']} | {branch['candidate_proposition']} |"
        )

    lines.extend([
        "",
        "## Fragmentary Source Slots",
        "",
        "| grammar | direct | partial | thin | supporting only | 主なmissing axes |",
        "|---|---:|---:|---:|---:|---|",
    ])
    for grammar in network["network_nodes"]["fragmentary_grammar_summary"]:
        missing = ", ".join(f"{axis} {count}" for axis, count in grammar["missing_axis_counts"].items())
        lines.append(
            f"| `{grammar['grammar_id']}` {grammar['name']} | {grammar['direct_count']} | {grammar['partial_count']} | {grammar['thin_count']} | {grammar['supporting_only_count']} | {missing} |"
        )

    lines.extend([
        "",
        "## 回答の最小形",
        "",
        "Codex上でこのネットワークを使う時は、次の順に短く答える。",
        "",
        "1. 未レビュー構造候補としての中核構造",
        "2. 関係するoperatorとcontext branch",
        "3. 代表ID、境界ID、反対構造候補ID",
        "4. 支援・配慮・制度・情報・仕事接触点が開閉する自由度",
        "5. 多様性条件窓による具体的な形態差",
        "6. 断片資料slotが示すmissing axisまたは同型探索条件",
        "7. まだ読めないこと",
        "",
        "## 試せる問い",
        "",
    ])
    lines.extend(md_list(network["try_queries"]))

    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    network = build_network()
    OUT_JSON.write_text(json.dumps(network, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(network)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
