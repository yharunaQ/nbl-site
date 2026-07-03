#!/usr/bin/env python3
"""Write Codex-high SCIMA/FCHMA free-text context-reading results.

This artifact records structural readings produced in the Codex session from the
FT-LLM-01 queue. It does not store prompts, redacted source text, structured
field values, or quotations.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
QUEUE_JSON = RUN_DIR / "stage1-production-ft-llm-01-c01-c03-c05-v0-2026-05-23-queue.json"

RUN_ID = "stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23"
RESULTS_JSONL = RUN_DIR / f"{RUN_ID}-results.jsonl"
SUMMARY_JSON = RUN_DIR / f"{RUN_ID}-summary.json"
SUMMARY_MD = RUN_DIR / f"{RUN_ID}-summary.md"

SOURCE_ARTIFACTS = [
    "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-ft-llm-01-c01-c03-c05-v0-2026-05-23-queue.json",
    "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-free-text-llm-context-coverage-audit-v0-2026-05-23.json",
    "docs/nbl-workspace/method/falcon-method-reliability-contract-v0-2026-05-23.md",
]


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def record(
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
            "medical/legal/employment/accommodation finality",
            "knowledge promotion",
        ],
    }


RESULTS: list[dict[str, Any]] = [
    record(
        "employment_survey_3000:04197",
        "employment_survey_3000",
        "C01-health-time",
        "representative_with_boundary",
        "health-time-task-load-fit",
        "closed",
        "健康時間は勤務量、作業負荷、繁忙時の短縮余地、開示順序の組合せで閉じる。",
        "病名ではなく、業務接触点と時間裁量の不足が継続リスクを増幅する。",
        "健康条件は、作業・時間・開示・配置前調整を読むための条件窓に限る。",
        ["繁忙期の実際の調整結果", "職場側の配置判断過程", "再就職後の経時アウトカム"],
        ["体調変動を個人努力不足へ戻す", "疾患ラベルから配慮を直結する"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "employment_survey_3000:13104",
        "employment_survey_3000",
        "C01-health-time",
        "representative_with_boundary",
        "health-time-organizational-buffer",
        "partial",
        "本人の体調より、欠員、納期、管理知識不足が健康時間を圧迫する枝として読める。",
        "個人の休み方だけでなく、組織の余裕と代替設計が主軸になる。",
        "障害・疾病条件は、職場側の支援負担と人員設計を観察する窓になる。",
        ["組織規模別の代替要員構造", "管理者教育の有無", "本人側アウトカム"],
        ["支援職場なら十分とみなす", "負担感を支援否定に変換する"],
        "keep_as_boundary_case",
    ),
    record(
        "employment_survey_3000:25090",
        "employment_survey_3000",
        "C01-health-time",
        "representative_with_boundary",
        "life-security-over-health-time",
        "not_closed",
        "健康時間より、賃金、将来生活、家族後の生活保障、評価の不均衡が前景化する。",
        "C01強化に使うと、生活保障軸の読解を健康時間へ過剰吸収する。",
        "障害条件は、健康時間ではなく生活保障と評価自由度の窓として扱う。",
        ["実際の仕事内容と賃金の対応", "本人の仕事選好", "将来支援資源"],
        ["健康時間枝に無理に分類する", "低賃金問題を能力問題に変える"],
        "do_not_use_for_route_strengthening",
    ),
    record(
        "employment_survey_3000:04135",
        "employment_survey_3000",
        "C01-health-time",
        "boundary",
        "health-time-explainability-threshold",
        "boundary",
        "健康時間は通院や疲労だけでなく、説明可能性、社交参加、限界予測と結びつく。",
        "休めばよいという読みでは、関係形成と不確実な限界管理を落とす。",
        "疾病条件は、本人が何をいつどこまで説明できるかを見る条件窓になる。",
        ["職場の社交規範", "説明後の評価変化", "限界超過後の回復過程"],
        ["症状説明を十分な配慮形成とみなす", "社交参加を本筋外として捨てる"],
        "keep_as_boundary_case",
    ),
    record(
        "nanbyo_survey_4000:01748",
        "nanbyo_survey_4000",
        "C01-health-time",
        "representative_with_boundary",
        "health-time-zero-or-surge-workload",
        "closed",
        "在宅や休める条件があっても、仕事配分が極端なら健康時間は崩れる。",
        "配慮の有無ではなく、配分、評価、突発高負荷の制御が核心になる。",
        "疾病・機能条件は、勤務場所と負荷ピークの設計を読む窓として使う。",
        ["仕事配分の決定者", "高負荷発生時の代替経路", "退職・転職後の変化"],
        ["在宅勤務を十分条件にする", "能力評価を医学状態だけで説明する"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "nanbyo_survey_4000:01638",
        "nanbyo_survey_4000",
        "C01-health-time",
        "representative_with_boundary",
        "health-time-self-management-market-mismatch",
        "closed",
        "日内自己管理と出社型時間割が合わず、在宅仕事不足と制度外費用が生活を圧迫する。",
        "健康問題だけでなく、求人市場と制度対象外性が健康時間を狭める。",
        "疾病名は、時間割、在宅性、自己管理費用、制度接続を読む窓に限る。",
        ["求人探索の範囲", "制度外費用の継続性", "在宅業務での実績可能性"],
        ["完全在宅を万能策にする", "制度対象外性を医学的正当性の問題だけにする"],
        "keep_as_boundary_case",
    ),
    record(
        "nanbyo_survey_4000:00348",
        "nanbyo_survey_4000",
        "C01-health-time",
        "representative_with_boundary",
        "health-time-commute-transfer-training",
        "closed",
        "身体管理、通勤距離、異動可能性、訓練場所が、就業継続の時間自由度を決める。",
        "本人の体調管理ができても、異動と訓練アクセスが崩す可能性がある。",
        "疾病条件は、職場変更時の時間・場所・訓練アクセスの窓として扱う。",
        ["異動時の交渉余地", "職業訓練の代替形式", "転居費用と収入の関係"],
        ["現職維持を安定とみなす", "通勤短縮だけで閉じる"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "nanbyo_survey_4000:03621",
        "nanbyo_survey_4000",
        "C01-health-time",
        "boundary",
        "health-time-work-meaning-security-boundary",
        "boundary",
        "超短時間オンライン継続は、収入より関係維持と生きがいを支える働き方になる。",
        "就労促進の読みだけでは、経済保障があるから成立する選択を誤る。",
        "進行性条件は、働く意味と生活保障の優先順位を見る窓として使う。",
        ["経済保障の制度条件", "本人が望む参加量", "職場側の継続負担"],
        ["仕事を常に第一目標とする", "重度条件を就労不能判断に短絡する"],
        "keep_as_boundary_case",
    ),
    record(
        "employment_survey_3000:04261",
        "employment_survey_3000",
        "C03-support-continuity",
        "representative_with_boundary",
        "support-translation-failure-self-effort-return",
        "closed",
        "相談先があっても、変動性、作業能力、生活費を仕事設計へ翻訳できず途切れる。",
        "窓口数ではなく、本人条件から具体的仕事探索へ橋を架けられるかが重要。",
        "疾病・障害条件は、支援者が何を翻訳できないかを検出する窓になる。",
        ["支援者側の判断根拠", "利用可能な職務選択肢", "医療側情報の使われ方"],
        ["支援利用歴を支援充足とみなす", "不安定性を就労意欲不足へ戻す"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "employment_survey_3000:04197",
        "employment_survey_3000",
        "C03-support-continuity",
        "representative_with_boundary",
        "support-disclosure-to-placement-bridge",
        "closed",
        "開示された制限が、求人選択、配置、勤務短縮の検討へつながる時に支援が接続する。",
        "説明だけでは足りず、仕事側の可変条件に接続されて初めて支援になる。",
        "健康条件は、開示内容が仕事設計へ届くかを見る窓として扱う。",
        ["職場側の確認手順", "支援者の関与有無", "調整後の継続状況"],
        ["開示成功を支援完了にする", "本人説明能力に責任を寄せる"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "employment_survey_3000:13104",
        "employment_survey_3000",
        "C03-support-continuity",
        "representative_with_boundary",
        "support-for-workplace-capacity",
        "closed",
        "支援は本人だけでなく、障害者が働く職場の人員余裕、納期、管理知識にも必要になる。",
        "本人支援だけでは、職場側の支援容量不足を見落とす。",
        "障害条件は、支援組織自体の継続容量を読む条件窓になる。",
        ["事業所側の支援資源", "支援者配置の実態", "欠員時の運用"],
        ["職場負担を本人受入れ否定に変換する", "支援職場を一枚岩に扱う"],
        "keep_as_boundary_case",
    ),
    record(
        "employment_survey_3000:32014",
        "employment_survey_3000",
        "C03-support-continuity",
        "boundary",
        "support-restoration-space-and-rights-uncertainty",
        "boundary",
        "休職、療法、経済支援、安否確認が熟考空間を作るが、開示権利の不安は残る。",
        "支援的措置があっても、復帰か転職かの制度的安心までは閉じない。",
        "障害条件は、休む権利、家族責任、復帰判断を調整する窓として使う。",
        ["復帰・転職の実際結果", "権利情報の入手経路", "管理職理解の変化"],
        ["理念的記述を制度実装と同一視する", "宗教職固有性を一般化する"],
        "keep_as_boundary_case",
    ),
    record(
        "nanbyo_survey_4000:01748",
        "nanbyo_survey_4000",
        "C03-support-continuity",
        "representative_with_boundary",
        "support-informal-accommodation-without-career-bridge",
        "partial",
        "非公式な配慮はあっても、仕事配分、評価、転職設計を支える専門橋渡しが薄い。",
        "身近な理解があることと、継続可能な職業設計があることは別である。",
        "健康条件は、非公式配慮がどこで制度・市場接続を失うかを見る窓になる。",
        ["外部専門支援の接続有無", "評価変更の経緯", "転職支援の具体性"],
        ["家族的職場を安全とみなす", "配慮ありを支援継続と同一視する"],
        "keep_as_boundary_case",
    ),
    record(
        "nanbyo_survey_4000:00059",
        "nanbyo_survey_4000",
        "C03-support-continuity",
        "representative_with_boundary",
        "support-category-exclusion-and-hostile-use",
        "closed",
        "医療説明や相談利用があっても、制度枠外や職場の敵対的解釈で支援が切断される。",
        "専門家関与があっても、カテゴリ運用と職場文化が反転させることがある。",
        "複合疾患条件は、単一カテゴリ支援の漏れと職場翻訳失敗を見る窓になる。",
        ["職場側記録", "制度窓口の判断根拠", "退職後支援の経路"],
        ["本人訴えを制度批判へだけ回収する", "職場の敵対性を一般化しすぎる"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "nanbyo_survey_4000:01638",
        "nanbyo_survey_4000",
        "C03-support-continuity",
        "representative_with_boundary",
        "support-cross-system-dead-end",
        "closed",
        "多窓口照会が横断システムに変換されず、在宅仕事、制度外費用、生活保障に届かない。",
        "相談の反復は支援連続性ではなく、連携不全の証拠にもなる。",
        "制度対象外条件は、初期振分と横断連携の弱さを読む窓になる。",
        ["各窓口の回答範囲", "オンライン就労の実績", "生活保障資源"],
        ["制度外性を例外として捨てる", "本人の長文訴えをノイズ扱いする"],
        "keep_as_boundary_case",
    ),
    record(
        "nanbyo_survey_4000:01434",
        "nanbyo_survey_4000",
        "C03-support-continuity",
        "boundary",
        "support-case-example-gap",
        "boundary",
        "相談が病名事例検索に止まり、現場上司への情報伝達、資料化、同行支援が途切れる。",
        "事例がないことは支援不能ではなく、構造翻訳の必要性を示す。",
        "病名は、類似事例不足時の支援再構成力を見る条件窓に限る。",
        ["現場上司への開示結果", "相談機関の資料化能力", "面接後の継続状況"],
        ["同病名事例の有無を支援可否にする", "本人の非開示を単純な選好にする"],
        "keep_as_boundary_case",
    ),
    record(
        "employment_survey_3000:04197",
        "employment_survey_3000",
        "C05-worksite-contact",
        "representative_with_boundary",
        "worksite-contact-task-exposure-and-peak-load",
        "closed",
        "仕事接触点は身体負荷、環境刺激、外勤、接客、繁忙期などのタスク束に現れる。",
        "設備配慮だけでは、タスク編成とピーク負荷の接触点を落とす。",
        "健康条件は、どのタスク接触点を変えれば働けるかを読む窓になる。",
        ["各タスクの必須性", "配置変更の可否", "繁忙期ルール"],
        ["接触点を物理設備だけに狭める", "病名別配慮リストへ戻す"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "employment_survey_3000:13104",
        "employment_survey_3000",
        "C05-worksite-contact",
        "representative_with_boundary",
        "worksite-contact-production-deadline-buffer",
        "partial",
        "職場接触点は設備より、欠員時の代替、納期、管理者知識、作業分担の運用面に出る。",
        "環境整備済みかどうかだけでは、運用負荷の接触点を見落とす。",
        "障害条件は、支援職場の運用接触点を読む窓になる。",
        ["納期調整の余地", "役割分担の実態", "管理者支援資源"],
        ["支援職場を配慮済みとみなす", "運用負荷を個人負担感だけにする"],
        "keep_as_boundary_case",
    ),
    record(
        "employment_survey_3000:25090",
        "employment_survey_3000",
        "C05-worksite-contact",
        "representative_with_boundary",
        "worksite-contact-evaluation-thin",
        "not_closed",
        "具体的な接触点より、仕事成果、賃金、将来生活、社会的評価の不均衡が前景化する。",
        "C05に使うと、評価・生活保障軸を作業接触点へ過剰還元する。",
        "障害条件は、接触点より評価と生活保障の窓として扱う。",
        ["具体作業環境", "支援機器や設備の有無", "賃金決定プロセス"],
        ["作業環境の薄さを無視してC05へ入れる", "低収入を作業能力問題にする"],
        "do_not_use_for_route_strengthening",
    ),
    record(
        "employment_survey_3000:18050",
        "employment_survey_3000",
        "C05-worksite-contact",
        "boundary",
        "worksite-contact-informal-relation-fit",
        "boundary",
        "既存関係、自営的働き方、在宅性、能率単位収入が接触点を柔軟化している。",
        "うまくいっている事例でも、関係資本に依存するため一般化には注意が要る。",
        "健康条件は、接触点を柔軟化する関係資源と将来悪化不安を見る窓になる。",
        ["関係資本がない場合の再現性", "重症化時の変更余地", "収入安定性"],
        ["成功例を標準モデル化する", "整備済み項目をすべて必要条件にする"],
        "keep_as_boundary_case",
    ),
    record(
        "nanbyo_survey_4000:01748",
        "nanbyo_survey_4000",
        "C05-worksite-contact",
        "representative_with_boundary",
        "worksite-contact-mobility-homework-surge",
        "closed",
        "移動、段差、在宅、突然の高負荷、資格・職種変更が多層の接触点を作る。",
        "一つの配慮ではなく、職務・場所・評価・将来設計を束で読む必要がある。",
        "疾病・機能条件は、物理移動と職務接触点を同時に見る窓として扱う。",
        ["在宅取り消しの理由", "職種変更支援", "能力評価の根拠"],
        ["在宅だけで閉じる", "移動制約を職業選択不能に短絡する"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "nanbyo_survey_4000:01638",
        "nanbyo_survey_4000",
        "C05-worksite-contact",
        "representative_with_boundary",
        "worksite-contact-labor-market-interface",
        "closed",
        "日内管理、外出制約、完全在宅仕事不足が、職場以前の労働市場接触点で詰まる。",
        "職場内設備の問題だけでなく、求人条件と制度接続が接触点になる。",
        "制度外条件は、出勤前提の市場設計を読む窓として扱う。",
        ["完全在宅求人の実在範囲", "職業訓練の実施形式", "収入確保手段"],
        ["在宅要求をわがままと読む", "市場側の接触点をC05外に捨てる"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "nanbyo_survey_4000:03484",
        "nanbyo_survey_4000",
        "C05-worksite-contact",
        "representative_with_boundary",
        "worksite-contact-relapse-proof-and-workplace-trust",
        "closed",
        "再燃時の移動、身体動作、在宅希望、証明困難、職場信頼が接触点になる。",
        "症状の有無だけでは、将来再燃時の接触点と信用問題を見落とす。",
        "疾病条件は、寛解期と再燃期をまたぐ証明・配置設計の窓になる。",
        ["証明書類の扱い", "在宅希望への応答", "配置変更と退職圧力の経緯"],
        ["現在軽い状態を安定とみなす", "再燃可能性を採用拒否根拠にする"],
        "advance_to_pattern_candidate_queue",
    ),
    record(
        "nanbyo_survey_4000:00465",
        "nanbyo_survey_4000",
        "C05-worksite-contact",
        "boundary",
        "worksite-contact-moderate-condition-market-gap",
        "closed",
        "立ち続けでも座り続けでもない中間条件が、市場の職種・時間・経験要件と衝突する。",
        "軽快していることは、緩やかな職務条件が市場にあることを意味しない。",
        "健康条件は、中間的仕事接触点と生活安定の両立可能性を見る窓になる。",
        ["応募先の要件分解", "短時間からフルタイム移行の道筋", "生活保障の補助線"],
        ["体調回復を一般就労可能に直結する", "職種転換を本人訓練だけに寄せる"],
        "advance_to_pattern_candidate_queue",
    ),
]


AGGREGATE_FINDINGS = {
    "C01-health-time": [
        "健康時間は、勤務時間だけでなく、負荷ピーク、通勤・移動、休憩、異動、訓練アクセス、生活保障、働く意味の束として読む必要がある。",
        "同じ健康条件でも、在宅、短時間、自己管理、非公式配慮、経済保障の組合せにより、就労継続の意味が変わる。",
        "生活保障や評価が前景化する記録をC01へ吸収しすぎると、C06/C07/C08の枝を細らせる。",
    ],
    "C03-support-continuity": [
        "支援連続性の中核は、相談先の有無ではなく、本人条件と仕事条件を継続的に再翻訳する機能にある。",
        "制度カテゴリ外、単一疾患枠、同病名事例不足、職場側の敵対的解釈は、支援の存在を支援断絶へ反転させる。",
        "職場側の人員余裕、納期、管理知識、休職・復帰の熟考空間も、支援の対象として読む必要がある。",
    ],
    "C05-worksite-contact": [
        "仕事接触点は設備だけでなく、タスク束、負荷ピーク、在宅・通勤、証明、求人市場、経験要件、評価運用にも出る。",
        "C05は病名別配慮リストではなく、仕事が実行され評価される接触面を分解する枝として強化できる。",
        "接触点が薄い記録は、生活保障、評価、参加意味の枝へ逃がすことでネットワークの過剰吸収を防げる。",
    ],
}


def validate_queue_alignment() -> None:
    queue = json.loads(QUEUE_JSON.read_text(encoding="utf-8"))["queue"]
    expected = {(item["route_id"], item["record_id"]) for item in queue}
    actual = {(item["route_id"], item["record_id"]) for item in RESULTS}
    if expected != actual:
        missing = sorted(expected - actual)
        extra = sorted(actual - expected)
        raise SystemExit(f"queue/result mismatch: missing={missing} extra={extra}")


def validate_no_export_markers() -> None:
    prohibited = ["「", "」", "【", "】", "\""]
    for item in RESULTS:
        for key in ["interaction_reading", "counter_reading", "condition_window_use"]:
            text = item[key]
            if any(mark in text for mark in prohibited):
                raise SystemExit(f"prohibited quote marker in {item['record_id']} {key}")


def write_results() -> None:
    validate_queue_alignment()
    validate_no_export_markers()
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    with RESULTS_JSONL.open("w", encoding="utf-8") as f:
        for item in RESULTS:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    summary = {
        "artifact_id": f"{RUN_ID}-summary",
        "lane": "Falcon / Falcon Lab",
        "status": "codex_high_context_reading_complete_no_text_export_no_promotion",
        "date": "2026-05-23",
        "execution_surface": "codex_high_reasoning_session",
        "api_used": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_context_reading_status": "performed_for_ft_llm_01_queue",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_artifacts": SOURCE_ARTIFACTS,
        "result_count": len(RESULTS),
        "route_counts": dict(Counter(item["route_id"] for item in RESULTS)),
        "dataset_counts": dict(Counter(item["dataset_id"] for item in RESULTS)),
        "relation_closure_counts": dict(Counter(item["relation_closure"] for item in RESULTS)),
        "next_use_counts": dict(Counter(item["next_use"] for item in RESULTS)),
        "aggregate_findings": AGGREGATE_FINDINGS,
        "result_jsonl": rel(RESULTS_JSONL),
        "not_allowed": [
            "source/support validity judgment",
            "review status movement",
            "candidate_pattern or knowledge promotion",
            "public/runtime use",
            "medical/legal/employment/accommodation finality",
        ],
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT-Codex-01 C01/C03/C05 Context Reading Summary",
        "",
        "日付: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: Codex high context-reading complete / no text export / no promotion / unreviewed",
        "",
        "## What This Is",
        "",
        "FT-LLM-01 queueの24件について、Codex高推論セッションでredacted自由記述とstructured selected-responseを読み、SCIMA/FCHMAの文脈枝・反対読み・条件窓・未確定点へ圧縮した。",
        "この成果物は本文、伏字本文、field値、短い引用、PIIを含まない。外部API実行ではない。",
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
        lines.extend([f"- {finding}" for finding in findings])
        lines.append("")
    lines.extend(
        [
            "## Boundary",
            "",
            "- source/support validity、review status、candidate_pattern、knowledge promotion、public/runtime statusは動かしていない。",
            "- 病名・障害名は条件窓として使い、配慮・就労困難性への単純因果にはしていない。",
            "- 24件は専門知識ネットワーク候補の枝を厚くする材料であり、human review済み知識ではない。",
            "",
            f"JSON: `{rel(SUMMARY_JSON)}`",
            f"JSONL: `{rel(RESULTS_JSONL)}`",
        ]
    )
    SUMMARY_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"summary": rel(SUMMARY_JSON), "results": rel(RESULTS_JSONL), "count": len(RESULTS)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write_results()
