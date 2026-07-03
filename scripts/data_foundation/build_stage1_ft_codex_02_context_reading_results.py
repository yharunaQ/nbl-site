#!/usr/bin/env python3
"""Write Codex-high SCIMA/FCHMA context readings for FT-Codex-02.

FT-Codex-02 closes a second no-text reading slice for C02/C04/C06 and the
C07/C08 route-through intersections. It records only structural readings.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RUN_ID = "stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23"
RESULTS_JSONL = RUN_DIR / f"{RUN_ID}-results.jsonl"
SUMMARY_JSON = RUN_DIR / f"{RUN_ID}-summary.json"
SUMMARY_MD = RUN_DIR / f"{RUN_ID}-summary.md"
RECONNECTION_JSON = RUN_DIR / f"{RUN_ID}-network-reconnection.json"
RECONNECTION_MD = RUN_DIR / f"{RUN_ID}-network-reconnection.md"


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def item(
    record_id: str,
    dataset_id: str,
    route_id: str,
    selection_role: str,
    context_branch: str,
    relation_closure: str,
    interaction_reading: str,
    counter_reading: str,
    condition_window_use: str,
    missing_context: list[str],
    overinterpretation_risks: list[str],
    next_use: str,
) -> dict[str, Any]:
    return {
        "record_id": record_id,
        "dataset_id": dataset_id,
        "route_id": route_id,
        "selection_role": selection_role,
        "reading_surface": "redacted_narrative_internal_plus_structured_selected_response_internal",
        "execution_surface": "codex_high_reasoning_session",
        "api_used": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_received_redacted_text": True,
        "llm_received_structured_selected_response": True,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "context_branch": context_branch,
        "primary_axis": route_id,
        "relation_closure": relation_closure,
        "interaction_reading": interaction_reading,
        "counter_reading": counter_reading,
        "condition_window_use": condition_window_use,
        "missing_context": missing_context,
        "overinterpretation_risks": overinterpretation_risks,
        "next_use": next_use,
        "not_allowed": [
            "raw/redacted text export",
            "field value export",
            "source/support validity judgment",
            "readiness/work capacity/accommodation judgment",
            "knowledge promotion",
        ],
    }


RESULTS: list[dict[str, Any]] = [
    item(
        "employment_survey_3000:13400",
        "employment_survey_3000",
        "C02-entry-translation",
        "representative_with_boundary",
        "entry-category-limbo-and-workplace-risk",
        "closed",
        "入口翻訳は、制度カテゴリ、通院・体調時配慮、職場内偏見を求人条件へ接続できるかで決まる。",
        "本人の説明努力だけでは、手帳有無や窓口分類で入口が閉じる。",
        "健康・障害条件は、入口で何に分類され何が職務条件へ翻訳されないかを見る窓に限る。",
        ["実際の求人経路", "面接時の応答", "職場側の配慮形成過程"],
        ["制度外性を本人の中途半端さへ戻す", "相談不満を支援妥当性判断にする"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:10089",
        "employment_survey_3000",
        "C02-entry-translation",
        "representative_with_boundary",
        "entry-workform-identity-mismatch",
        "closed",
        "入口翻訳は、支援断絶、作業所化、勤務型、性別役割的な職場分類が重なって崩れる。",
        "生活訓練や単純作業へ逃がすだけでは、職務条件と本人の参加価値が翻訳されない。",
        "障害条件は、会話・時間帯・集団構成・職務型の相互作用を見る窓として使う。",
        ["当時の支援選択肢", "職場内の関係形成過程", "本人の技能・学習資源"],
        ["福祉的就労を安全な入口とみなす", "国際比較的言及を事実主張として外部化する"],
        "keep_as_boundary_case",
    ),
    item(
        "nanbyo_survey_4000:04264",
        "nanbyo_survey_4000",
        "C02-entry-translation",
        "representative_with_boundary",
        "entry-disclosure-without-environment-translation",
        "closed",
        "病状や配慮を伝えても、温度、休憩、通院、急変連絡、在宅訓練へ翻訳されなければ入口は閉じる。",
        "励ましや自己受容支援は、職務・訓練環境の設計翻訳を代替しない。",
        "疾患条件は、入社前説明が実環境へ届くかを検出する条件窓に限る。",
        ["面接時合意の記録", "職場環境調整の責任者", "遠隔訓練の利用可能性"],
        ["開示済みを配慮形成済みとみなす", "支援者の発言を妥当性評価する"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "nanbyo_survey_4000:01766",
        "nanbyo_survey_4000",
        "C02-entry-translation",
        "boundary",
        "entry-window-labeling-and-flex-work",
        "boundary",
        "登録時分類、応募時開示、短時間・繁忙期型就労、家族介護が入口順序を変える。",
        "入口でのラベル付けは支援接続にもなり、応募時の不利にもなりうる。",
        "難病条件は、開示時点と窓口分類の効果を読むためだけに使う。",
        ["窓口分類後の応募先反応", "短時間仕事情報の実在性", "介護責任との時間配分"],
        ["分類表示を差別か支援か一方に決める", "短時間希望を就労意欲低下にする"],
        "keep_as_boundary_case",
    ),
    item(
        "employment_survey_3000:16036",
        "employment_survey_3000",
        "C04-information-participation",
        "representative_with_boundary",
        "information-exclusion-to-evaluation-harm",
        "closed",
        "会議情報、指示、電話対応、評価基準、人事記録が同期しないと、仕事参加と処遇が傷つく。",
        "情報提供不足ではなく、評価・命令・人事に接続した参加排除として読む必要がある。",
        "感覚条件は、情報同期面と評価運用のずれを読む窓として扱う。",
        ["職務上必須の情報経路", "評価基準の運用", "管理者交代時の継続性"],
        ["ハラスメント事実認定へ進む", "聴覚条件から職務不能を推定する"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:04456",
        "employment_survey_3000",
        "C04-information-participation",
        "representative_with_boundary",
        "information-tool-present-social-exclusion",
        "closed",
        "筆談等の手段があっても、非公式情報、身分、賃金、生活費へ届かないと参加は残る。",
        "コミュニケーション手段の整備を情報参加の完了と読まない。",
        "障害条件は、情報手段が職場所属と評価へ届くかを見る窓に限る。",
        ["非公式情報の流れ", "雇用区分の決定過程", "処遇差の根拠"],
        ["手段整備を成功証明にする", "低処遇を障害条件だけで説明する"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:04397",
        "employment_survey_3000",
        "C04-information-participation",
        "representative_with_boundary",
        "information-disclosure-protected-family-work",
        "partial",
        "家族的保護下では条件が伝わるが、外部職場では開示困難が仕事継続と生活保障を狭める。",
        "守られた職場経験を一般的な情報参加成功としては使えない。",
        "疾病条件は、どの関係環境なら説明が仕事条件へ届くかを見る窓になる。",
        ["外部職場での開示応答", "家族職場の具体的調整", "再就労支援の有無"],
        ["本人責任の語りをそのまま因果にする", "家族支援を制度的再現性として扱う"],
        "keep_as_boundary_case",
    ),
    item(
        "employment_survey_3000:11039",
        "employment_survey_3000",
        "C04-information-participation",
        "representative_with_boundary",
        "information-format-task-redesign",
        "closed",
        "電話、口頭、手を離せない作業、映像・文書化など、情報形式が職務設計そのものになる。",
        "情報保障を通訳者配置だけに狭めると、作業手順と外部対応の接触点を落とす。",
        "感覚条件は、情報形式・職務分担・外部連絡の再設計を見る窓として扱う。",
        ["外部相手への説明設計", "職務必須性の分解", "作業手順の媒体化"],
        ["単一支援機関を妥当と判断する", "電話可否だけで職務範囲を決める"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:25090",
        "employment_survey_3000",
        "C06-life-security",
        "boundary",
        "life-security-pay-future-care-boundary",
        "closed",
        "仕事量・賃金・親亡き後の生活が、就労継続の自由度を健康時間より強く規定する。",
        "働いている事実を生活保障の解決と読まない。",
        "障害条件は、評価・賃金・将来生活の接続を読む窓として使う。",
        ["賃金決定の根拠", "将来支援資源", "本人の選好と生活設計"],
        ["低賃金を能力問題にする", "C01/C05へ過剰吸収する"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "nanbyo_survey_4000:03675",
        "nanbyo_survey_4000",
        "C06-life-security",
        "boundary",
        "life-security-benefit-medical-cost-trap",
        "closed",
        "高額医療費、生活保護、収入上限、就職先不足が、働くか休むかの選択肢を狭める。",
        "就労希望の有無ではなく、制度から抜けるリスクが選択を閉じている。",
        "複合健康条件は、医療費と所得保障の相互作用を見る窓に限る。",
        ["医療費助成の実際", "収入増時の負担変化", "利用可能な職種と通勤条件"],
        ["制度批判を政策妥当性判断に進める", "非就労を意欲欠如にする"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "nanbyo_survey_4000:00059",
        "nanbyo_survey_4000",
        "C06-life-security",
        "boundary",
        "life-security-category-exclusion-and-career-loss",
        "partial",
        "制度対象外、退職、療養、資格取得、家族責任が、生活保障と再入口の順序を絡ませる。",
        "支援対象外性だけではなく、職場喪失後の生活・学習資源を同時に読む必要がある。",
        "複合疾患条件は、単一カテゴリ支援から漏れる生活設計を見る窓になる。",
        ["退職後収入源", "資格取得の実効性", "家族責任の変化"],
        ["職場側の不適切性を確定判断する", "資格取得を万能の再入口にする"],
        "keep_as_boundary_case",
    ),
    item(
        "nanbyo_survey_4000:01638",
        "nanbyo_survey_4000",
        "C06-life-security",
        "boundary",
        "life-security-out-of-pocket-system-gap",
        "closed",
        "制度外医療費、在宅仕事不足、家族関係、自己破産不安が、仕事以前の生活基盤を揺らす。",
        "支援窓口の案内では、生活保障と就労可能性の同時崩れを止められない。",
        "制度外条件は、生活保障と在宅仕事市場の接続不全を読む窓になる。",
        ["医療費負担の継続性", "在宅就労収入の可能性", "生活保護時の医療継続"],
        ["長文訴えをノイズとして捨てる", "完全在宅を唯一解にする"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:01062",
        "employment_survey_3000",
        "C07-quality-participation",
        "route_through_sample",
        "quality-contact-to-chance-and-value",
        "partial",
        "仕事接触点が、安全・速度・利益・やる気理解へ翻訳されるかが参加価値を左右する。",
        "就労開始を成功と読まず、機会と評価への翻訳が残ると見る。",
        "障害条件は、接触点が評価と機会へ届くかを見る窓に限る。",
        ["働き始めた後の評価", "作業速度と役割設計", "支援機関の橋渡し内容"],
        ["利益基準を正当/不当と判定する", "やる気を能力補償として扱う"],
        "keep_as_boundary_case",
    ),
    item(
        "employment_survey_3000:03004",
        "employment_survey_3000",
        "C07-quality-participation",
        "route_through_sample",
        "quality-heavy-work-pay-and-advancement",
        "closed",
        "重労働、在宅可否、無給時間、昇進・報酬見通しが、参加品質と生活保障を同時に狭める。",
        "軽度で働けることを、価値翻訳や将来見通しの解決とは読まない。",
        "健康条件は、仕事接触点と評価・報酬の接続を見る窓として使う。",
        ["報酬制度", "在宅時の賃金扱い", "昇進困難の理由"],
        ["昇進妥当性を判断する", "重症者一般へ過度に一般化する"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:01016",
        "employment_survey_3000",
        "C07-quality-participation",
        "low_context_brake",
        "quality-structured-only-brake",
        "not_closed",
        "構造化項目は豊富でも、役割・評価・将来見通しを閉じる本文文脈が不足している。",
        "満足度や職場配慮項目だけでC07を厚くしてはいけない。",
        "障害条件は使わず、低文脈ブレーキとして扱う。",
        ["役割や評価の本文文脈", "本人の価値判断", "処遇・将来見通し"],
        ["構造化回答を成功証明にする", "本文なしで価値翻訳を閉じる"],
        "do_not_use_for_route_strengthening",
    ),
    item(
        "employment_survey_3000:03191",
        "employment_survey_3000",
        "C08-prework-participation",
        "route_through_sample",
        "prework-training-needed-but-nonsequence",
        "partial",
        "職業訓練や資格支援の必要は見えるが、生活リズム・応募・開始・継続の順序はまだ薄い。",
        "訓練必要という一般論だけでC08を閉じない。",
        "障害条件は、入口前支援の順序が不足していることを示す窓に限る。",
        ["具体的な訓練内容", "応募先条件", "開始後の支援接続"],
        ["職業訓練を万能の前段にする", "働き口不足を本人能力問題に戻す"],
        "keep_as_boundary_case",
    ),
    item(
        "employment_survey_3000:04214",
        "employment_survey_3000",
        "C08-prework-participation",
        "route_through_sample",
        "prework-return-reentry-disclosure-sequence",
        "closed",
        "復職、退職、再就職、非開示、短時間条件、扶養が、入口前後の順序を変える。",
        "復職時に問題がなかったことを、再就職入口の解決とは読めない。",
        "疾病条件は、復職と再入口で必要な翻訳が変わることを見る窓として使う。",
        ["退職理由の詳細", "再就職先の職務条件", "扶養・生活保障の影響"],
        ["非開示を単純な成功戦略にする", "家族扶養を一般化する"],
        "advance_to_pattern_candidate_queue",
    ),
    item(
        "employment_survey_3000:01027",
        "employment_survey_3000",
        "C08-prework-participation",
        "low_context_brake",
        "prework-structured-only-brake",
        "not_closed",
        "構造化上は入口前後の支援経験が見えるが、本文文脈がなく順序を閉じられない。",
        "支援利用・課題解決項目だけで入口前段の機序を作らない。",
        "障害条件は使わず、C08低文脈ブレーキにする。",
        ["本文文脈", "支援が何を翻訳したか", "入口後アウトカム"],
        ["構造化項目からreadinessを推定する", "支援歴を支援効果に変換する"],
        "do_not_use_for_route_strengthening",
    ),
    item(
        "employment_survey_3000:01085",
        "employment_survey_3000",
        "C08-prework-participation",
        "route_through_sample",
        "prework-life-security-before-entry",
        "boundary",
        "就職準備以前に、治療継続、生活保障、家族依存、在宅可能性が入口順序を止めている。",
        "非就労を準備不足と読むと、生活保障と治療継続の前提を落とす。",
        "障害条件は、入口前に閉じる生活保障自由度を見る窓として使う。",
        ["利用可能な在宅仕事", "治療継続条件", "家族収入喪失時の支援"],
        ["非就労を意欲欠如にする", "在宅仕事だけを解にする"],
        "keep_as_boundary_case",
    ),
]


AGGREGATE_FINDINGS = {
    "C02-entry-translation": [
        "入口翻訳は開示技術ではなく、窓口分類、制度カテゴリ、求人条件、健康安全説明、面接前の足切りが仕事条件へ翻訳されるかの問題である。",
        "開示済みでも、通院・急変・温度・休憩・短時間・在宅訓練に接続されなければ入口は閉じない。",
        "本人の自己受容や励まし支援は、職務条件翻訳の代替にならない。",
    ],
    "C04-information-participation": [
        "情報参加は情報量ではなく、会議、指示形式、電話・口頭・文書・映像、評価、人事、非公式情報が同期しているかで決まる。",
        "情報手段があっても、所属、処遇、孤立、将来見通しに届かない時は未解決として残す。",
        "情報形式は職務設計そのものであり、通訳や筆談だけに狭めない。",
    ],
    "C06-life-security": [
        "生活保障は背景事情ではなく、医療費、所得上限、賃金、家族責任、将来生活、制度対象外性が仕事選択を直接形作る自由度である。",
        "就労継続や就労希望の有無は、生活保障が閉じている証拠にも解決にもならない。",
        "C06はC01/C05/C07/C08の過剰吸収を止めるブレーキとして使える。",
    ],
    "C07-quality-participation": [
        "C07は単独昇格させず、C05/C03/C01/C06を通した価値・評価・将来見通しの狭い検査路として使う。",
        "満足度、雇用継続、配慮項目を成功証明にしない。",
    ],
    "C08-prework-participation": [
        "C08は準備不足のラベルではなく、治療、生活保障、訓練、応募、復職、再就職、非開示、開始後継続の順序を見る。",
        "本文文脈の薄い記録は、支援歴や構造化項目が豊富でもC08強化に使わない。",
    ],
}


RECONNECTIONS = [
    {
        "route_id": "C02-entry-translation",
        "existing_branches_thickened": ["P1-C02A", "P1-C02B", "P1-C02C", "P1-C02D"],
        "new_pressure": "C02 should be read as mutual translation before entry, not as individual disclosure skill.",
        "escape_routes": ["C03-support-continuity", "C04-information-participation", "C06-life-security"],
    },
    {
        "route_id": "C04-information-participation",
        "existing_branches_thickened": ["P1-C04A-1", "P1-C04A-2", "P1-C04A-3", "P1-C04B"],
        "new_pressure": "C04 connects information format to instruction, evaluation, personnel treatment, and informal belonging.",
        "escape_routes": ["C05-worksite-contact", "C07-quality-participation", "C03-support-continuity"],
    },
    {
        "route_id": "C06-life-security",
        "existing_branches_thickened": ["P1-C06A", "P1-C06B", "P1-C06C", "P1-C06D", "P1-C06E"],
        "new_pressure": "C06 is a direct freedom axis and a brake against collapsing livelihood into health-time, contact, quality, or readiness.",
        "escape_routes": ["C01-health-time", "C07-quality-participation", "C08-prework-participation"],
    },
    {
        "route_id": "C07-quality-participation",
        "existing_branches_thickened": ["SF-05-career-participation-value"],
        "new_pressure": "Use only through C05/C03/C01/C06; keep satisfaction and employment continuity as insufficient.",
        "escape_routes": ["C05-worksite-contact", "C03-support-continuity", "C01-health-time", "C06-life-security"],
    },
    {
        "route_id": "C08-prework-participation",
        "existing_branches_thickened": ["SF-03-prework-participation-translation"],
        "new_pressure": "Use as sequencing of entry conditions, not readiness deficit.",
        "escape_routes": ["C02-entry-translation", "C03-support-continuity", "C01-health-time", "C06-life-security"],
    },
]


def validate() -> None:
    prohibited = ["「", "」", "【", "】", "\"", "_x000D_", "PERSON_NAME", "MEDICAL_INSTITUTION"]
    blobs = []
    for row in RESULTS:
        blobs.extend(str(row.get(key, "")) for key in ["interaction_reading", "counter_reading", "condition_window_use"])
        blobs.extend(row.get("missing_context", []))
        blobs.extend(row.get("overinterpretation_risks", []))
    for text in blobs:
        if any(mark in text for mark in prohibited):
            raise SystemExit(f"prohibited marker found: {text}")


def write() -> None:
    validate()
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    with RESULTS_JSONL.open("w", encoding="utf-8") as f:
        for row in RESULTS:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    summary = {
        "artifact_id": f"{RUN_ID}-summary",
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "codex_high_context_reading_complete_no_text_export_no_promotion",
        "execution_surface": "codex_high_reasoning_session",
        "api_used": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_artifacts": [
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-branch-assignments-v0-2026-05-18.json",
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-c07-c08-adjacent-route-intersection-sampling-v0-2026-05-23.json",
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23-summary.json",
        ],
        "result_count": len(RESULTS),
        "route_counts": dict(Counter(row["route_id"] for row in RESULTS)),
        "dataset_counts": dict(Counter(row["dataset_id"] for row in RESULTS)),
        "relation_closure_counts": dict(Counter(row["relation_closure"] for row in RESULTS)),
        "next_use_counts": dict(Counter(row["next_use"] for row in RESULTS)),
        "aggregate_findings": AGGREGATE_FINDINGS,
        "result_jsonl": rel(RESULTS_JSONL),
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT-Codex-02 C02/C04/C06/C07/C08 Context Reading Summary",
        "",
        "日付: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: Codex high context-reading complete / no text export / no promotion / unreviewed",
        "",
        "## What This Is",
        "",
        "FT-Codex-01後の逃がし先であるC02/C04/C06と、C07/C08 route-through交差部を、redacted自由記述とstructured selected-responseから読んだ第二読解束。",
        "本文、伏字本文、field値、短い引用、PIIは含めない。source/support validity、review status、candidate_pattern、public/runtime statusは動かさない。",
        "",
        "## Counts",
        "",
        f"- result_count: {summary['result_count']}",
        f"- route_counts: {summary['route_counts']}",
        f"- dataset_counts: {summary['dataset_counts']}",
        f"- relation_closure_counts: {summary['relation_closure_counts']}",
        f"- next_use_counts: {summary['next_use_counts']}",
        "",
        "## Route Findings",
        "",
    ]
    for route_id, findings in AGGREGATE_FINDINGS.items():
        lines.append(f"### {route_id}")
        lines.extend(f"- {finding}" for finding in findings)
        lines.append("")
    lines.extend(
        [
            "## Boundary",
            "",
            "- 病名・障害名は条件窓であり、配慮・就労困難性の単純因果にはしていない。",
            "- C07/C08はnarrow routeとして扱い、Core昇格やcandidate_pattern移動はしていない。",
            "- この束は専門知識ネットワーク候補の枝を厚くする材料であり、human review済み知識ではない。",
            "",
            f"JSON: `{rel(SUMMARY_JSON)}`",
            f"JSONL: `{rel(RESULTS_JSONL)}`",
        ]
    )
    SUMMARY_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")

    reconnect = {
        "artifact_id": f"{RUN_ID}-network-reconnection",
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "network_candidate_reconnection_no_text_export_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "execution_surface": "codex_high_reasoning_session",
        "source_artifacts": [rel(SUMMARY_JSON), rel(RESULTS_JSONL)],
        "reconnections": RECONNECTIONS,
        "next_reading_run": {
            "target": "web-cache/NIVR/workshop underread intersections and remaining survey free-text coverage",
            "boundary": "no text export, no source/support validity, no review status movement, no knowledge promotion",
        },
    }
    RECONNECTION_JSON.write_text(json.dumps(reconnect, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    md = [
        "# Stage 1 FT-Codex-02 Network Reconnection",
        "",
        "日付: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: network candidate reconnection / no text export / no promotion / unreviewed",
        "",
        "## Reconnection",
        "",
    ]
    for r in RECONNECTIONS:
        md.append(f"### {r['route_id']}")
        md.append(f"- thickened: {', '.join(r['existing_branches_thickened'])}")
        md.append(f"- pressure: {r['new_pressure']}")
        md.append(f"- escape routes: {', '.join(r['escape_routes'])}")
        md.append("")
    md.extend(
        [
            "## Boundary",
            "",
            "- source/support validity、review status、candidate_pattern、Domain Core、public/runtime statusは動かしていない。",
            "- C07/C08はroute-throughの狭い検査路であり、満足度・雇用継続・構造化項目を成功証明にしない。",
            "",
            f"JSON: `{rel(RECONNECTION_JSON)}`",
        ]
    )
    RECONNECTION_MD.write_text("\n".join(md) + "\n", encoding="utf-8")
    print(json.dumps({"summary": rel(SUMMARY_JSON), "reconnection": rel(RECONNECTION_MD), "results": rel(RESULTS_JSONL), "count": len(RESULTS)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
