#!/usr/bin/env python3
"""Connect the 2001 ABC mechanism pack to the Stage 1 network.

This script only reads derived no-text artifacts. It creates an unreviewed
crosswalk showing which Stage 1 routes/branches are thickened by the 2001 ABC
survey and which caution/counter-reading windows are introduced.
"""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = REPO_ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ABC_DIR = REPO_ROOT / "references/derived/scima-fchma/2001-abc-survey-v0-2026-05-22"

STAGE1_KNOWLEDGE_JSON = STAGE1_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
STAGE1_QUERY_INDEX_JSON = STAGE1_DIR / "stage1-production-codex-query-index-v0-2026-05-18.json"
ABC_MECHANISM_PACK_MD = ABC_DIR / "2001-abc-survey-falcon-expert-network-mechanism-pack-v0-2026-05-23.md"
ABC_NETWORK_MAP_JSON = ABC_DIR / "2001-abc-survey-falcon-network-nonchronological-integration-map-v0-2026-05-22.json"
ABC_TRIADIC_SYNTHESIS_JSON = ABC_DIR / "2001-abc-survey-triadic-scima-fchma-synthesis-cards-v0-2026-05-22.json"
ABC_CONDITION_BRIDGE_JSON = ABC_DIR / "2001-abc-survey-condition-window-narrative-motif-bridge-v0-2026-05-23.json"

OUTPUT_JSON = STAGE1_DIR / "stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.json"
OUTPUT_MD = STAGE1_DIR / "stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.md"
OUTPUT_JSONL = STAGE1_DIR / "stage1-production-2001-abc-route-overlay-cards-v0-2026-05-23.jsonl"


MECHANISM_NODES: list[dict[str, Any]] = [
    {
        "node_id": "MN01",
        "title": "Shared Task Surface Versus Work-Design Meaning",
        "thickens_routes": ["QR-03-worksite-contact-and-mobility", "QR-07-quality-career-and-value-translation", "QR-08-diversity-conditioned-same-structure"],
        "thickens_stage1_axes": ["C05-worksite-contact", "C07-quality-participation"],
        "thickens_context_branches": ["CB-02-work-contact-evaluation-loop", "CB-06-minority-window-revival"],
        "thickens_relations": ["SR-C05-MOBILITY-WORKSITE", "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT"],
        "contribution": "同じ仕事内容・職名・作業語彙の背後にある接触点、負荷、情報、評価、参加品質の違いをStage 1へ戻す。",
        "caution_windows": [
            "同じ作業名を同じ仕事設計と見なさない。",
            "仕事内容から就労可否や能力を推定しない。",
        ],
        "expert_agent_question": "この仕事語彙は、どの接触点・自由度・評価境界を隠しているか。",
    },
    {
        "node_id": "MN02",
        "title": "Worksite Contact Point Atlas",
        "thickens_routes": ["QR-03-worksite-contact-and-mobility", "QR-02-information-work-procedure", "QR-08-diversity-conditioned-same-structure"],
        "thickens_stage1_axes": ["C05-worksite-contact", "C04-information-participation"],
        "thickens_context_branches": ["CB-02-work-contact-evaluation-loop", "CB-04-information-work-procedure-knot", "CB-06-minority-window-revival"],
        "thickens_relations": ["SR-C05-MOBILITY-WORKSITE", "SR-C04A-C05-WORKSITE-INFORMATION", "SR-C05-WORKSITE-HEALTHTIME"],
        "contribution": "B票の作業接触点を、建物・設備・操作・表示・危険・避難・判断・周囲とのやり取りへ分解する。",
        "caution_windows": [
            "職場側の問題解決/未解決は本人側の参加経験を代弁しない。",
            "接触点の困難を本人能力の欠如として閉じない。",
        ],
        "expert_agent_question": "職場で閉じているのは、設備、動線、情報、操作、安全、周囲との接触のどれか。",
    },
    {
        "node_id": "MN03",
        "title": "Support Presence Versus Retranslation Gap",
        "thickens_routes": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-01-health-time-work-design", "QR-07-quality-career-and-value-translation"],
        "thickens_stage1_axes": ["C03-support-continuity", "C01-health-time", "C07-quality-participation"],
        "thickens_context_branches": ["CB-01-continuity-quality-loop", "CB-03-life-security-sequencing", "CB-05-entry-prework-translation"],
        "thickens_relations": ["SR-C01C03-LONGTERM-CONTINUITY", "SR-C03-ENTRY-VS-CONTINUITY", "SR-C02T-C03-CONTINUITY-BRIDGE", "SR-C06-SUPPORT-LIFESECURITY"],
        "contribution": "支援あり/なし、必要/不要、有用/不要を、支援妥当性ではなく再翻訳機能としてStage 1へ接続する。",
        "caution_windows": [
            "B/C差を支援失敗や本人/上司どちらかの正誤として扱わない。",
            "支援の存在を支援の機能や効果と同一視しない。",
        ],
        "expert_agent_question": "支援は、仕事・情報・健康時間・生活保障・評価・開示境界の何を再翻訳しているか。",
    },
    {
        "node_id": "MN04",
        "title": "Information As Work Procedure",
        "thickens_routes": ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation", "QR-03-worksite-contact-and-mobility"],
        "thickens_stage1_axes": ["C04-information-participation", "C05-worksite-contact"],
        "thickens_context_branches": ["CB-04-information-work-procedure-knot", "CB-01-continuity-quality-loop"],
        "thickens_relations": ["SR-C04A-C05-WORKSITE-INFORMATION", "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT"],
        "contribution": "情報保障・説明・相談を、形式ではなく作業手順、責任分担、確認、安全、評価境界への変換として厚くする。",
        "caution_windows": [
            "情報課題を本人の理解力問題に短絡しない。",
            "聴覚・説明理解の窓を感覚障害だけの特殊支援に閉じない。",
        ],
        "expert_agent_question": "情報は、職務手順・確認・安全・評価へ落ちているか、それとも説明で止まっているか。",
    },
    {
        "node_id": "MN05",
        "title": "Health-Time Visibility As Work Design",
        "thickens_routes": ["QR-01-health-time-work-design", "QR-04-life-security-sequencing", "QR-06-disclosure-boundary-and-mutual-translation", "QR-03-worksite-contact-and-mobility"],
        "thickens_stage1_axes": ["C01-health-time", "C06-life-security", "C05-worksite-contact"],
        "thickens_context_branches": ["CB-01-continuity-quality-loop", "CB-02-work-contact-evaluation-loop", "CB-03-life-security-sequencing"],
        "thickens_relations": ["SR-C01C03-LONGTERM-CONTINUITY", "SR-C05-WORKSITE-HEALTHTIME", "SR-C06-HEALTHTIME-LIFESECURITY", "SR-C08-PASTWORK-LIFE-REBUILDING"],
        "contribution": "体調・疲労・通院・休憩を、個人の安定性ではなく時間、負荷、代替手順、評価、開示粒度として再配置する。",
        "caution_windows": [
            "2001 ABCには難病データがないため、内部障害窓を現在の難病就労の代表にしない。",
            "健康時間を本人側の問題発生に閉じず、仕事設計の接触点として読む。",
        ],
        "expert_agent_question": "健康時間は、誰にどの粒度で見え、どの仕事手順や評価条件に翻訳されているか。",
    },
    {
        "node_id": "MN06",
        "title": "Life Security And Off-Work Bridge",
        "thickens_routes": ["QR-04-life-security-sequencing", "QR-05-entry-prework-translation", "QR-06-disclosure-boundary-and-mutual-translation"],
        "thickens_stage1_axes": ["C06-life-security", "C08-prework-participation", "C03-support-continuity"],
        "thickens_context_branches": ["CB-03-life-security-sequencing", "CB-05-entry-prework-translation"],
        "thickens_relations": ["SR-C06-SUPPORT-LIFESECURITY", "SR-C06-TRANSITION-LIFESECURITY", "SR-C06-HEALTHTIME-LIFESECURITY", "SR-C08-PREWORK-ENTRY-TRANSLATION"],
        "contribution": "通勤、日常生活、家族、福祉、学校、医療を、職場外背景ではなく仕事選択と継続順序の自由度として扱う。",
        "caution_windows": [
            "職場外支援を就労意欲や能力の代替指標にしない。",
            "2001 ABCは雇用中サンプル中心なので、未就労・入口以前参加の直接根拠にしない。",
        ],
        "expert_agent_question": "生活・外部支援の信号は、開始、継続、休む、戻る、選び直す順序をどう変えているか。",
    },
    {
        "node_id": "MN07",
        "title": "Participation Quality And Value Translation",
        "thickens_routes": ["QR-07-quality-career-and-value-translation", "QR-01-health-time-work-design", "QR-03-worksite-contact-and-mobility"],
        "thickens_stage1_axes": ["C07-quality-participation", "C01-health-time", "C05-worksite-contact"],
        "thickens_context_branches": ["CB-01-continuity-quality-loop", "CB-02-work-contact-evaluation-loop"],
        "thickens_relations": ["SR-C07-QUALITY-PARTICIPATION-BLINDSPOT", "SR-C06-EVALUATION-LIFESECURITY"],
        "contribution": "雇用継続や作業遂行を、満足度、役割、評価、関係、将来展望、価値化の層へ開く。",
        "caution_windows": [
            "満足度を支援妥当性や成功証明にしない。",
            "働けていることを構造上の解決済みと読まない。",
        ],
        "expert_agent_question": "条件付き遂行は、役割・評価・処遇・技能形成・将来見通しへ変換されているか。",
    },
    {
        "node_id": "MN08",
        "title": "Establishment Burden And Advice Context",
        "thickens_routes": ["QR-03-worksite-contact-and-mobility", "QR-06-disclosure-boundary-and-mutual-translation", "QR-07-quality-career-and-value-translation", "QR-04-life-security-sequencing"],
        "thickens_stage1_axes": ["C05-worksite-contact", "C03-support-continuity", "C07-quality-participation", "C06-life-security"],
        "thickens_context_branches": ["CB-02-work-contact-evaluation-loop", "CB-04-information-work-procedure-knot", "CB-03-life-security-sequencing"],
        "thickens_relations": ["SR-C06-SUPPORT-LIFESECURITY", "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT", "SR-C04A-C05-WORKSITE-INFORMATION"],
        "contribution": "A票の負担感・期待負担・外部助言利用を、組織側の翻訳コストと支援接続窓としてStage 1へ追加する。",
        "caution_windows": [
            "事業所負担を正当/不当や実負担の証明として扱わない。",
            "A票は事業所単位であり、個別B/C経験と一対一対応しない。",
        ],
        "expert_agent_question": "組織側で翻訳されにくいのは、設備、情報、健康時間、外部支援、評価、開示境界のどれか。",
    },
    {
        "node_id": "MN09",
        "title": "Worker Need, Usefulness, And Satisfaction Context",
        "thickens_routes": ["QR-01-health-time-work-design", "QR-03-worksite-contact-and-mobility", "QR-06-disclosure-boundary-and-mutual-translation", "QR-07-quality-career-and-value-translation"],
        "thickens_stage1_axes": ["C01-health-time", "C03-support-continuity", "C05-worksite-contact", "C07-quality-participation"],
        "thickens_context_branches": ["CB-01-continuity-quality-loop", "CB-02-work-contact-evaluation-loop", "CB-04-information-work-procedure-knot"],
        "thickens_relations": ["SR-C01C03-LONGTERM-CONTINUITY", "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT"],
        "contribution": "C票の支援必要/有用性・仕事対象・満足度・機能障害窓を、本人側自由度と参加品質として厚くする。",
        "caution_windows": [
            "本人側ニーズを即時の支援指示に変換しない。",
            "代理回答や回答方法を本人認識そのものとして扱わない。",
        ],
        "expert_agent_question": "本人側の必要/有用性は、活動、参加、健康時間、情報、生活保障、評価のどの自由度を示しているか。",
    },
    {
        "node_id": "MN10",
        "title": "Strict A/B/C Coded Triad",
        "thickens_routes": ["QR-03-worksite-contact-and-mobility", "QR-06-disclosure-boundary-and-mutual-translation", "QR-07-quality-career-and-value-translation", "QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
        "thickens_stage1_axes": ["C01-health-time", "C03-support-continuity", "C05-worksite-contact", "C06-life-security", "C07-quality-participation"],
        "thickens_context_branches": ["CB-01-continuity-quality-loop", "CB-02-work-contact-evaluation-loop", "CB-03-life-security-sequencing", "CB-04-information-work-procedure-knot"],
        "thickens_relations": ["SR-C01C03-LONGTERM-CONTINUITY", "SR-C04A-C05-WORKSITE-INFORMATION", "SR-C06-SUPPORT-LIFESECURITY", "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT"],
        "contribution": "A/B/Cを同じリンク単位で見ることで、組織、職場、本人の三者差を同一構造上に置ける。",
        "caution_windows": [
            "三者一致を正解、三者不一致を誤りとして扱わない。",
            "選抜サンプル、B/C障害・程度不一致、項目対応の粗さを保持する。",
        ],
        "expert_agent_question": "三者差は、接触点、翻訳、制度接続、評価境界のどこで生じているか。",
    },
    {
        "node_id": "MN11",
        "title": "Condition Windows As Mechanism Search",
        "thickens_routes": ["QR-08-diversity-conditioned-same-structure", "QR-03-worksite-contact-and-mobility", "QR-02-information-work-procedure", "QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
        "thickens_stage1_axes": ["C05-worksite-contact", "C04-information-participation", "C01-health-time", "C06-life-security"],
        "thickens_context_branches": ["CB-06-minority-window-revival", "CB-02-work-contact-evaluation-loop", "CB-03-life-security-sequencing", "CB-04-information-work-procedure-knot"],
        "thickens_relations": ["SR-C04A-C05-WORKSITE-INFORMATION", "SR-C05-MOBILITY-WORKSITE", "SR-C05-WORKSITE-HEALTHTIME", "SR-C06-HEALTHTIME-LIFESECURITY"],
        "contribution": "障害種類、機能障害、程度、発生時期、回答方法を、接触点差や自由度差を探す条件窓としてStage 1へ接続する。",
        "caution_windows": [
            "条件窓を病名/障害名から配慮・困難性を引くキーにしない。",
            "条件窓差を制度時代、サンプル構成、回答者、分類粒度、B/C不一致から切り離さない。",
        ],
        "expert_agent_question": "条件窓の違いは、どの接触点・自由度・翻訳機序の違いとして現れているか。",
    },
    {
        "node_id": "MN12",
        "title": "Condition-Window Narrative Motif Bridge",
        "thickens_routes": ["QR-08-diversity-conditioned-same-structure", "QR-02-information-work-procedure", "QR-03-worksite-contact-and-mobility", "QR-04-life-security-sequencing", "QR-07-quality-career-and-value-translation"],
        "thickens_stage1_axes": ["C04-information-participation", "C05-worksite-contact", "C06-life-security", "C07-quality-participation"],
        "thickens_context_branches": ["CB-06-minority-window-revival", "CB-04-information-work-procedure-knot", "CB-02-work-contact-evaluation-loop", "CB-03-life-security-sequencing", "CB-01-continuity-quality-loop"],
        "thickens_relations": ["SR-C04A-C05-WORKSITE-INFORMATION", "SR-C05-MOBILITY-WORKSITE", "SR-C06-SUPPORT-LIFESECURITY", "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT"],
        "contribution": "条件窓信号を、情報手順化、生活保障、身体環境、健康時間、再設計、程度、不一致、少数窓の記述構造モチーフで点検する。",
        "caution_windows": [
            "記述構造との一致は条件窓固有の真理を証明しない。",
            "機序の妥当性検討に留め、candidate_patternやreviewed knowledgeへ動かさない。",
        ],
        "expert_agent_question": "条件窓候補は、記述構造側で同じ機序として見えるか、それとも別説明が残るか。",
    },
]


ROUTE_SUMMARIES: dict[str, dict[str, Any]] = {
    "QR-01-health-time-work-design": {
        "stage1_axis": "C01-health-time",
        "thickening_level": "strong",
        "what_2001_abc_adds": "健康時間を本人側症状だけでなく、職場接触点、支援状態、A/B/C差、内部障害/機能窓として読める。",
        "counter_or_attention": "難病データはない。内部障害窓を現在の難病就労の代表にせず、健康時間の仕事設計としてだけ使う。",
    },
    "QR-02-information-work-procedure": {
        "stage1_axis": "C04-information-participation",
        "thickening_level": "strong",
        "what_2001_abc_adds": "聴覚・説明・相談・情報交換を、情報形式だけでなく作業手順、安全、確認、評価境界として厚くする。",
        "counter_or_attention": "情報課題を本人理解力や感覚障害だけに閉じない。職場手順化の有無を問う。",
    },
    "QR-03-worksite-contact-and-mobility": {
        "stage1_axis": "C05-worksite-contact",
        "thickening_level": "very_strong",
        "what_2001_abc_adds": "B票の詳細な職場上司視点により、設備、動線、操作、表示、安全、作業遂行、周囲との接触を細かく分解できる。",
        "counter_or_attention": "職場側の問題認識や解決状態を、本人の経験、支援妥当性、能力判断と同一視しない。",
    },
    "QR-04-life-security-sequencing": {
        "stage1_axis": "C06-life-security",
        "thickening_level": "moderate",
        "what_2001_abc_adds": "通勤、日常生活、外部支援、家族・福祉接続を、仕事選択と継続順序の自由度として補強する。",
        "counter_or_attention": "雇用中サンプル中心なので、生活保障全体や未就労層を代表しない。信号は間接的に使う。",
    },
    "QR-05-entry-prework-translation": {
        "stage1_axis": "C08-prework-participation",
        "thickening_level": "weak_boundary",
        "what_2001_abc_adds": "雇用理由、雇用課題、外部助言、発生時期・再訓練窓から、入口以前参加の周辺条件を限定的に照らす。",
        "counter_or_attention": "2001 ABCは未就労・求職前データではない。入口以前参加は反証・注意窓として使う。",
    },
    "QR-06-disclosure-boundary-and-mutual-translation": {
        "stage1_axis": "C03-support-continuity / C04-information-participation",
        "thickening_level": "strong",
        "what_2001_abc_adds": "B/C不一致、支援必要/有用性、A票負担・助言、条件窓を、開示量ではなく相互翻訳の境界として読める。",
        "counter_or_attention": "不一致を正誤判定にしない。開示の多寡や職場理解の善悪ではなく、何が仕事条件へ翻訳されたかを問う。",
    },
    "QR-07-quality-career-and-value-translation": {
        "stage1_axis": "C07-quality-participation",
        "thickening_level": "strong",
        "what_2001_abc_adds": "満足度、作業遂行、生産性、役割、評価、A票負担感を、参加品質と価値翻訳の窓として追加する。",
        "counter_or_attention": "満足度は支援妥当性の証明ではない。雇用継続を解決済みと読まない。",
    },
    "QR-08-diversity-conditioned-same-structure": {
        "stage1_axis": "condition-window / CB-06-minority-window-revival",
        "thickening_level": "very_strong",
        "what_2001_abc_adds": "身体障害・知的障害中心の詳細な機能/程度/回答方法窓を、同じ構造の別形態探索に使える。",
        "counter_or_attention": "条件窓を配慮検索表にしない。少数窓は発見窓であり、単独昇格や現在主張は禁止。",
    },
}


STAGE1_AXIS_SUMMARIES: dict[str, dict[str, Any]] = {
    "C01-health-time": {
        "thickened_by": ["MN05", "MN03", "MN09", "MN10", "MN11"],
        "stage1_gain": "健康時間を、本人症状、職場接触点、支援翻訳、A/B/C差として読み分けられる。",
        "caution": "難病欠落と2001年時代差を保持し、内部障害窓を現在の難病就労へ直結しない。",
    },
    "C02-entry-translation": {
        "thickened_by": ["MN06", "MN08", "MN10"],
        "stage1_gain": "雇用理由・課題・外部助言から、入口翻訳の周辺条件を限定的に補える。",
        "caution": "2001 ABCは雇用中リンクデータであり、入口前・未就労の主根拠にはならない。",
    },
    "C03-support-continuity": {
        "thickened_by": ["MN03", "MN06", "MN08", "MN09", "MN10"],
        "stage1_gain": "支援状態、必要/有用性、外部支援接続、A票負担/助言を同じ構造上で比較できる。",
        "caution": "支援の有無・必要・有用性を効果や妥当性に変換しない。",
    },
    "C04-information-participation": {
        "thickened_by": ["MN04", "MN02", "MN11", "MN12"],
        "stage1_gain": "情報保障を手順、安全、確認、評価、条件窓へ接続して読める。",
        "caution": "情報課題を本人理解力や聴覚障害だけで説明しない。",
    },
    "C05-worksite-contact": {
        "thickened_by": ["MN01", "MN02", "MN04", "MN05", "MN08", "MN10", "MN11"],
        "stage1_gain": "2001 ABCが最も厚くする枝。仕事接触点を多視点・詳細項目・条件窓で分解できる。",
        "caution": "職場側の問題ブロックを本人能力や配慮妥当性へ直結しない。",
    },
    "C06-life-security": {
        "thickened_by": ["MN06", "MN03", "MN05", "MN08", "MN10"],
        "stage1_gain": "通勤、日常生活、外部支援、健康時間、組織負担の接続を生活保障の順序問題として補強する。",
        "caution": "職場外信号は間接的で、雇用中サンプルの選抜性が強い。",
    },
    "C07-quality-participation": {
        "thickened_by": ["MN01", "MN07", "MN08", "MN09", "MN10"],
        "stage1_gain": "作業遂行、満足度、評価、役割、事業所負担を、参加品質の別層として扱える。",
        "caution": "満足度・継続・生産性を成功/失敗の証明にしない。",
    },
    "C08-prework-participation": {
        "thickened_by": ["MN06", "MN05", "MN11"],
        "stage1_gain": "発生時期、再設計、外部支援から入口以前参加の反証・境界条件を補える。",
        "caution": "未就労・求職前の直接データではなく、弱い境界窓として扱う。",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def group_nodes_by(field: str) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for node in MECHANISM_NODES:
        for key in node[field]:
            grouped[key].append(node)
    return dict(grouped)


def build_outputs() -> dict[str, Any]:
    stage1 = load_json(STAGE1_KNOWLEDGE_JSON)
    query_index = load_json(STAGE1_QUERY_INDEX_JSON)
    network_map = load_json(ABC_NETWORK_MAP_JSON)
    synthesis = load_json(ABC_TRIADIC_SYNTHESIS_JSON)
    condition_bridge = load_json(ABC_CONDITION_BRIDGE_JSON)

    by_route = group_nodes_by("thickens_routes")
    route_overlays: list[dict[str, Any]] = []
    for route in stage1["query_routes"]:
        route_id = route["route_id"]
        nodes = by_route.get(route_id, [])
        summary = ROUTE_SUMMARIES[route_id]
        route_overlays.append(
            {
                "route_id": route_id,
                "stage1_user_need": route["user_need"],
                **summary,
                "mechanism_nodes": [node["node_id"] for node in nodes],
                "mechanism_titles": [node["title"] for node in nodes],
                "expert_agent_questions": [node["expert_agent_question"] for node in nodes],
            }
        )

    return {
        "artifact_id": "stage1_production_2001_abc_mechanism_crosswalk_v0_2026_05_23",
        "lane": "Falcon Lab",
        "status": "stage1_crosswalk_unreviewed_no_promotion_no_runtime_approval",
        "review_status": "unreviewed",
        "source_content_exported": False,
        "narrative_content_included": False,
        "source_artifacts": [
            str(STAGE1_KNOWLEDGE_JSON.relative_to(REPO_ROOT)),
            str(STAGE1_QUERY_INDEX_JSON.relative_to(REPO_ROOT)),
            str(ABC_MECHANISM_PACK_MD.relative_to(REPO_ROOT)),
            str(ABC_NETWORK_MAP_JSON.relative_to(REPO_ROOT)),
            str(ABC_TRIADIC_SYNTHESIS_JSON.relative_to(REPO_ROOT)),
            str(ABC_CONDITION_BRIDGE_JSON.relative_to(REPO_ROOT)),
        ],
        "stage1_network_status": {
            "status": stage1["status"],
            "review_status": stage1["review_status"],
            "promotion_status": stage1["promotion_status"],
            "runtime_status": stage1["runtime_status"],
            "public_status": stage1["public_status"],
        },
        "abc_source_status": {
            "network_modules": network_map["active_enrichment_module_count"],
            "synthesis_cards": synthesis["active_synthesis_card_count"],
            "condition_motif_bridges": condition_bridge["motif_bridge_count"],
        },
        "mechanism_nodes": MECHANISM_NODES,
        "route_overlays": route_overlays,
        "stage1_axis_overlays": STAGE1_AXIS_SUMMARIES,
        "stage1_relation_targets": sorted({relation for node in MECHANISM_NODES for relation in node["thickens_relations"]}),
        "query_index_counts": {
            "axis_query_cards": len(query_index.get("axis_query_cards", [])),
            "relation_query_cards": len(query_index.get("relation_query_cards", [])),
        },
        "expert_agent_use": [
            "Use 2001 ABC when it sharpens a Stage 1 route's mechanism, not when it merely adds historical frequency.",
            "Pair every thickening claim with its caution/counter-reading window.",
            "Treat disability/function/degree labels as condition windows for mechanism search; do not use them as support lookup keys.",
            "Keep 2001 era, physical/intellectual-heavy sample, mental-disability legal context, and rare-disease absence visible when relevant.",
        ],
        "not_allowed": [
            "source/support validity decision",
            "support adequacy or worker capacity decision",
            "current policy or practice guidance",
            "condition-to-support lookup",
            "candidate_pattern movement",
            "reviewed knowledge promotion",
            "public/runtime approval",
        ],
    }


def write_markdown(data: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Stage 1 x 2001 ABC Mechanism Crosswalk",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon Lab",
        "状態: Stage 1 crosswalk / no narrative text / 未レビュー / 昇格なし / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、2001 ABCの12機序ノードをStage 1全体ネットワークへ接続し、どの既存枝を厚くするか、どこを反証・注意窓として扱うかを整理する。",
        "",
        "2001 ABCは、時系列の古い知識としてではなく、Stage 1の構造枝を厚くする多視点 evidence window として使う。Falconの専門家エージェントは、厚みを足すたびに、同じ位置へ反証・注意窓も置く。",
        "",
        "## Route Overlay",
        "",
        "| Stage 1 route | 2001 ABC thickening | level | mechanism nodes | caution / counter window |",
        "|---|---|---|---|---|",
    ]
    for route in data["route_overlays"]:
        nodes = ", ".join(f"`{node}`" for node in route["mechanism_nodes"])
        lines.append(
            f"| `{route['route_id']}` | {route['what_2001_abc_adds']} | `{route['thickening_level']}` | {nodes} | {route['counter_or_attention']} |"
        )

    lines.extend(["", "## Stage 1 Axis Overlay", "", "| Stage 1 axis | thickened by | gain | caution |", "|---|---|---|---|"])
    for axis, item in data["stage1_axis_overlays"].items():
        nodes = ", ".join(f"`{node}`" for node in item["thickened_by"])
        lines.append(f"| `{axis}` | {nodes} | {item['stage1_gain']} | {item['caution']} |")

    lines.extend(["", "## Mechanism Node Crosswalk", ""])
    for node in data["mechanism_nodes"]:
        lines.extend(
            [
                f"### {node['node_id']}. {node['title']}",
                "",
                f"- thickens routes: {', '.join(f'`{route}`' for route in node['thickens_routes'])}",
                f"- thickens Stage 1 axes: {', '.join(f'`{axis}`' for axis in node['thickens_stage1_axes'])}",
                f"- thickens context branches: {', '.join(f'`{branch}`' for branch in node['thickens_context_branches'])}",
                f"- thickens relations: {', '.join(f'`{relation}`' for relation in node['thickens_relations'])}",
                f"- contribution: {node['contribution']}",
                f"- expert-agent question: {node['expert_agent_question']}",
                "- caution windows:",
            ]
        )
        for caution in node["caution_windows"]:
            lines.append(f"  - {caution}")
        lines.append("")

    lines.extend(
        [
            "## Expert Agent Use",
            "",
            "- Use 2001 ABC when it sharpens a Stage 1 route's mechanism, not when it merely adds historical frequency.",
            "- Pair every thickening claim with its caution/counter-reading window.",
            "- Treat disability/function/degree labels as condition windows for mechanism search; do not use them as support lookup keys.",
            "- Keep 2001 era, physical/intellectual-heavy sample, mental-disability legal context, and rare-disease absence visible when relevant.",
            "",
            "## Boundary",
            "",
            "- This is not reviewed knowledge, candidate_pattern movement, Domain Core movement, public evidence, or runtime grounding.",
            "- No raw narrative text, redacted narrative text, PII, or row-level IDs are exported.",
            "- No source/support validity, support adequacy, worker capacity, legal/medical/employment judgment, or current-policy claim is made.",
            "- 2001 ABC can thicken Stage 1 mechanisms; it cannot by itself authorize deterministic condition-window rules.",
            "",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


def write_route_cards(data: dict[str, Any]) -> None:
    with OUTPUT_JSONL.open("w", encoding="utf-8") as out:
        for route in data["route_overlays"]:
            card = {
                "card_id": f"stage1-production:2001-abc-route-overlay:{route['route_id']}",
                "status": "route_overlay_unreviewed_no_runtime_approval",
                "route_id": route["route_id"],
                "stage1_axis": route["stage1_axis"],
                "thickening_level": route["thickening_level"],
                "mechanism_nodes": route["mechanism_nodes"],
                "what_2001_abc_adds": route["what_2001_abc_adds"],
                "counter_or_attention": route["counter_or_attention"],
                "expert_agent_questions": route["expert_agent_questions"],
                "not_allowed": data["not_allowed"],
                "source_content_exported": False,
                "narrative_content_included": False,
                "review_status": "unreviewed",
            }
            out.write(json.dumps(card, ensure_ascii=False) + "\n")


def main() -> None:
    data = build_outputs()
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(data)
    write_route_cards(data)
    print(
        json.dumps(
            {
                "mechanism_nodes": len(data["mechanism_nodes"]),
                "route_overlays": len(data["route_overlays"]),
                "stage1_axes": len(data["stage1_axis_overlays"]),
                "output": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
                "route_cards": str(OUTPUT_JSONL.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
