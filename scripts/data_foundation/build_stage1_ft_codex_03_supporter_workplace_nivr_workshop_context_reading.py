#!/usr/bin/env python3
"""Write Codex-high SCIMA/FCHMA context readings for FT-Codex-03.

FT-Codex-03 deepens the under-read supporter, workplace, NIVR, and workshop
side of Stage 1. It records structural readings only: no raw text, no
redacted text, no field values, no public/review/runtime promotion.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RUN_ID = "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23"
RESULTS_JSONL = RUN_DIR / f"{RUN_ID}-results.jsonl"
SUMMARY_JSON = RUN_DIR / f"{RUN_ID}-summary.json"
SUMMARY_MD = RUN_DIR / f"{RUN_ID}-summary.md"
RECONNECTION_JSON = RUN_DIR / f"{RUN_ID}-network-reconnection.json"
RECONNECTION_MD = RUN_DIR / f"{RUN_ID}-network-reconnection.md"


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def card(
    card_id: str,
    source_window: str,
    source_refs: list[str],
    primary_axes: list[str],
    structural_node: str,
    relation_closure: str,
    interaction_reading: str,
    counter_reading: str,
    condition_window_use: str,
    missing_context: list[str],
    overinterpretation_risks: list[str],
    network_use: str,
    source_family: str,
) -> dict[str, Any]:
    return {
        "card_id": card_id,
        "source_family": source_family,
        "source_window": source_window,
        "source_refs": source_refs,
        "reading_surface": "redacted_or_local_source_internal_context_reading",
        "execution_surface": "codex_high_reasoning_session",
        "api_used": False,
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_received_redacted_text": source_family in {"supporter", "workplace"},
        "llm_received_local_source_summary": source_family in {"nivr", "workshop"},
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_readiness_status": "local_structural_input_only_not_source_validity",
        "primary_axes": primary_axes,
        "structural_node": structural_node,
        "relation_closure": relation_closure,
        "interaction_reading": interaction_reading,
        "counter_reading": counter_reading,
        "condition_window_use": condition_window_use,
        "missing_context": missing_context,
        "overinterpretation_risks": overinterpretation_risks,
        "network_use": network_use,
        "not_allowed": [
            "raw/redacted text export",
            "field value export",
            "source/support validity judgment",
            "support effectiveness judgment",
            "work capacity or accommodation finality",
            "current policy or legal claim",
            "knowledge promotion",
        ],
    }


RESULTS: list[dict[str, Any]] = [
    card(
        "SPT-01",
        "supporter selected redacted narratives plus supporter knowledge summaries",
        [
            "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl:selected:52,64,69,211,254,319,413,432,438,444,496,506,531",
            "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:10012,10209,10329,10376,10511,10616,10846,10930,11282,11661,12084,12245,12555",
            "data/analysis_ready/supporters/supporter_practice_toku18/v2_effectiveness_catalog/support_effectiveness_catalog.md",
        ],
        ["C03-support-continuity", "C04-information-participation", "C08-prework-participation", "C07-quality-participation"],
        "supporter-learning-to-retranslation-capacity",
        "closed",
        "支援者知識は情報保有ではなく、医療、制度、求人、職場、本人説明を相互翻訳する実践容量として現れる。",
        "研修やマニュアルの有無だけでは、実際の翻訳容量や継続支援の質を説明できない。",
        "支援者属性や経験年数は、翻訳容量を推定する直接因果ではなく、学習場、相談網、役割権限を見る条件窓に限る。",
        ["学習機会の実際の使用", "相談網の密度", "翻訳後の職場応答", "本人側の理解変化"],
        ["支援者熱意を支援妥当性に変換する", "研修不足を個人能力問題に戻す", "相関カタログを効果証明として使う"],
        "thicken_C03_as_retranslation_spine",
        "supporter",
    ),
    card(
        "SPT-02",
        "supporter selected redacted narratives",
        [
            "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl:selected:64,254,438,506",
            "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:12084,12555",
        ],
        ["C02-entry-translation", "C06-life-security", "C03-support-continuity"],
        "category-limbo-and-one-by-one-employer-translation",
        "closed",
        "制度カテゴリに収まりにくい状態では、入口支援、企業説明、生活保障、助成接続が一件ずつ再翻訳される。",
        "カテゴリ外であることを本人の中途半端さや支援対象外性の自然結果として扱えない。",
        "病名、手帳、制度対象性は、入口と生活保障がどこで切れるかを見る条件窓であり、配慮との単純対応表にはしない。",
        ["企業側の制度理解", "利用可能な助成や窓口の当時条件", "本人が望む開示範囲", "求人側の足切り条件"],
        ["現在制度の主張に拡張する", "制度外性から就労困難性を直結する", "個別支援の妥当性判断に進む"],
        "thicken_C02_C06_cross_axis_boundary",
        "supporter",
    ),
    card(
        "SPT-03",
        "supporter selected redacted narratives",
        [
            "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl:selected:69,319,432,496",
            "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:10329,10511,11661",
        ],
        ["C03-support-continuity", "C02-entry-translation", "C04-information-participation"],
        "role-ambiguity-and-referral-without-assessment",
        "closed",
        "支援機関が存在しても、役割分担、評価責任、紹介後の戻り回路が曖昧だと支援は連続面にならない。",
        "紹介や連携実施を支援継続の成立と読まない。",
        "機関種別は、どの役割が何を翻訳し何を手放しているかを見る条件窓に限る。",
        ["紹介後のフィードバック", "評価主体", "本人への説明責任", "企業との再接続点"],
        ["機関間の優劣判断にする", "紹介件数を連携品質にする", "支援不足を単一機関の責任に閉じる"],
        "thicken_C03_support_surface_not_point",
        "supporter",
    ),
    card(
        "SPT-04",
        "supporter selected redacted narratives",
        [
            "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl:selected:211,413,444,531",
            "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:10012,11282",
        ],
        ["C04-information-participation", "C03-support-continuity", "C06-life-security"],
        "safe-disclosure-escalation-boundary",
        "closed",
        "開示は有無ではなく、本人同意、職場理解、問題発生時の安全な相談先、生活上の不利益回避を同時に設計する境界である。",
        "開示推奨や非開示推奨の一方向判断では、情報参加と生活保障の相互作用を落とす。",
        "診断名や障害名は、共有する情報の範囲と相手を決めるための条件窓であり、職務可否判断には使わない。",
        ["本人同意の粒度", "職場側の情報管理", "問題時の相談先", "不利益発生時の戻り回路"],
        ["開示を正解化する", "非開示を成功戦略化する", "差別事実や法的判断を確定する"],
        "connect_to_QR06_disclosure_boundary",
        "supporter",
    ),
    card(
        "SPT-05",
        "supporter selected redacted narratives",
        ["data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl:selected:64,432,506"],
        ["C01-health-time", "C03-support-continuity", "C08-prework-participation"],
        "remote-contact-health-time-vs-assessment-depth",
        "partial",
        "遠隔や電話は健康時間負担を下げるが、職務観察、関係形成、状況把握の厚みを同時に薄くしうる。",
        "遠隔支援を単純なアクセシビリティ改善としてだけ扱えない。",
        "感染リスクや移動困難は、支援接触様式の自由度と情報欠落を同時に見る条件窓になる。",
        ["遠隔後の評価精度", "対面に代わる観察手段", "本人負担の変化", "企業接触の有無"],
        ["遠隔を万能化する", "対面を標準正解化する", "健康リスクから支援不能を推定する"],
        "keep_as_remote_support_boundary_case",
        "supporter",
    ),
    card(
        "SPT-06",
        "supporter selected redacted narratives plus regional variation summaries",
        [
            "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:10209,10376,10511,10846,11661",
            "data/analysis_ready/supporters/knowledge_network/regional_variation_analysis.json",
        ],
        ["C03-support-continuity", "C04-information-participation", "C08-prework-participation"],
        "regional-network-surface-and-coordination-semantics",
        "closed",
        "地域ネットワークは会議体ではなく、入口前準備、医療生活情報、企業接触、紹介後戻りをつなぐ翻訳面として評価する必要がある。",
        "チーム支援という語が同じでも、実際に何を共有し何を戻すかは機関ごとに異なる。",
        "地域差は地域優劣ではなく、翻訳面の密度、役割、戻り回路を見る条件窓として使う。",
        ["会議後の個別支援接続", "共有情報の範囲", "役割別の戻り回路", "地域外資源との接続"],
        ["地域ランキング化する", "会議開催を連携成立にする", "一地域の語りを全国構造にする"],
        "thicken_C03_regional_translation_surface",
        "supporter",
    ),
    card(
        "SPT-07",
        "supporter selected redacted narratives",
        ["data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:10209,10376,10616,10930,12245"],
        ["C08-prework-participation", "C01-health-time", "C03-support-continuity", "C07-quality-participation"],
        "prework-practice-identity-stress-and-work-image",
        "closed",
        "就職前支援は準備不足補填ではなく、生活リズム、ストレス把握、職場体験、自己理解、仕事像を組み直す参加過程である。",
        "訓練や準備を本人側の不足修正として読むと、職場側翻訳や支援継続を見失う。",
        "障害種類や疾病は、準備段階で必要な仕事像と健康時間の調整を読む条件窓に限る。",
        ["体験後の職務条件変更", "本人の仕事像の変化", "職場側の受け止め", "開始後の支援接続"],
        ["readiness欠如へ戻す", "訓練参加を効果証明にする", "本人理解だけを入口解にする"],
        "thicken_C08_as_prework_participation_not_readiness",
        "supporter",
    ),
    card(
        "SPT-08",
        "supporter analysis-ready summaries",
        [
            "data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/toku18_deepdive_synthesis.md",
            "data/analysis_ready/supporters/supporter_practice_toku18/v2_effectiveness_catalog/support_effectiveness_catalog.md",
        ],
        ["C03-support-continuity", "C07-quality-participation", "C06-life-security"],
        "organization-mission-evaluation-funding-as-supporter-capacity",
        "partial",
        "組織目的、評価、財源、文化は支援効果そのものではなく、支援者が翻訳を続けられる制度的容量として読む。",
        "支援メニューと解決感の相関から支援妥当性や効果を決めない。",
        "組織種別は、支援者の裁量、時間、評価、外部接続を読む条件窓に限る。",
        ["因果推論に耐える比較", "支援前状態", "支援後アウトカム", "組織内評価と裁量"],
        ["効果カタログ化する", "組織属性を能力序列にする", "満足や解決感を成果確定にする"],
        "keep_as_capacity_hypothesis_not_effectiveness",
        "supporter",
    ),
    card(
        "SPT-09",
        "supporter selected redacted narratives",
        ["data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl:selected:12084,12555"],
        ["C03-support-continuity", "C08-prework-participation"],
        "no-complaint-no-need-boundary",
        "boundary",
        "相談や苦情が見えない地域や機関では、需要不在ではなく、入口前の検出面が存在しない可能性を残す。",
        "相談件数の少なさをニーズの少なさや問題解決の証拠にできない。",
        "地域や機関種別は、潜在需要がどこで可視化されるかを見る条件窓として扱う。",
        ["未相談者の入口", "紹介前の情報接点", "企業側の把握", "医療生活側の相談導線"],
        ["空白を安定と読む", "支援不要と推定する", "単一地域の沈黙を一般化する"],
        "use_as_detection_boundary_against_false_negative",
        "supporter",
    ),
    card(
        "WPL-01",
        "workplace selected redacted narratives",
        [
            "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0276,0266,0453,0086,0017,0070,0064",
            "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/free_text_units.redacted.jsonl:duplicate-surface-not-independent-count",
        ],
        ["C01-health-time", "C05-worksite-contact", "C04-information-participation", "C06-life-security"],
        "condition-window-diversity-and-individual-response",
        "closed",
        "職場側の多様性認識は病名からの単純 lookup の限界を示すだけでなく、個別の健康時間、接触点、情報共有、生活保障を分解する必要を示す。",
        "多様で分からないという語りを、職場の回避や無理解だけで説明しない。",
        "病名や疾病群は、同じ職場条件で異なる自由度が出ることを見る条件窓として使う。",
        ["実際の職務接触点", "本人が希望する情報共有", "過去受入経験", "支援窓口の有無"],
        ["病名別の単純対応表に戻す", "企業認識を正誤判断する", "想定困難を実困難と同一視する"],
        "strengthen_QR08_condition_window_guardrail",
        "workplace",
    ),
    card(
        "WPL-02",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0091,0661,0580,0547"],
        ["C01-health-time", "C03-support-continuity", "C04-information-participation"],
        "fluctuating-progressive-condition-consultation-line",
        "closed",
        "変動性や進行性は健康時間だけでなく、本人、家族、医療、職場、支援者を結ぶ相談線の有無で職場設計可能性が変わる。",
        "体調変動を職務不能や配慮困難へ直結しない。",
        "疾患の経過は、相談線と再設計タイミングを読む条件窓として扱う。",
        ["再設計の責任者", "医療側情報の共有可能範囲", "本人同意", "職場内相談先"],
        ["進行性を採用困難に変換する", "家族や医療に判断を委譲する", "将来リスクを現在能力判断にする"],
        "thicken_C01_C03_fluctuation_loop",
        "workplace",
    ),
    card(
        "WPL-03",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0244,0280,0358,0631"],
        ["C05-worksite-contact", "C04-information-participation", "C06-life-security"],
        "small-worksite-task-safety-and-staffing-constraints",
        "closed",
        "小規模職場、現場作業、安全、顧客対応、人員余力は、一般的柔軟性ではなく具体的接触点として分解する必要がある。",
        "配慮困難を企業姿勢だけで説明せず、職務接触点と代替可能性の問題として読む。",
        "業種や規模は、作業接触、代替人員、安全説明、収入影響を見る条件窓である。",
        ["代替可能な職務単位", "安全上必須の接触点", "欠勤時の人員設計", "賃金への影響"],
        ["安全語りを排除理由として確定する", "柔軟勤務を万能化する", "小規模を一律不利にする"],
        "thicken_C05_from_workplace_contact_granularity",
        "workplace",
    ),
    card(
        "WPL-04",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0070,0064,0191"],
        ["C02-entry-translation", "C04-information-participation", "C05-worksite-contact"],
        "flexible-system-signaling-and-entry-translation",
        "partial",
        "制度があっても応募者に伝わらない、使われない、求人上の魅力に翻訳されない場合、入口自由度は残る。",
        "柔軟制度の存在を入口解決と読まない。",
        "勤務制度は、求人表示、応募者理解、現場運用のずれを見る条件窓として使う。",
        ["求人情報での表示", "応募者が知る経路", "利用申請の心理的安全", "現場側の運用余力"],
        ["制度保有を配慮成立にする", "応募しない理由を本人側へ戻す", "採用広報を支援効果にする"],
        "connect_C02_to_workplace_signaling_gap",
        "workplace",
    ),
    card(
        "WPL-05",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0453,0661,0741"],
        ["C06-life-security", "C01-health-time", "C03-support-continuity"],
        "life-security-leave-wage-reduction-sequence",
        "closed",
        "休職、短時間、賃金低下、医療費、生活不安は、働く自由と休む自由を同時に狭める順序問題である。",
        "就労継続だけでは生活保障が解けたとは言えない。",
        "制度名や給付条件は、収入、治療継続、休職復帰の相互作用を見る条件窓に限る。",
        ["当時の制度条件", "収入低下の幅", "治療継続条件", "復帰時の職務再設計"],
        ["現在制度主張にする", "収入低下を本人選好とみなす", "雇用継続を成功証明にする"],
        "thicken_C06_from_workplace_livelihood_view",
        "workplace",
    ),
    card(
        "WPL-06",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0086,0091,0580"],
        ["C04-information-participation", "C03-support-continuity", "C05-worksite-contact"],
        "disclosure-privacy-need-observation-gap",
        "closed",
        "本人説明、職場観察、プライバシー、必要配慮のずれは、情報量ではなく安全な確認方法と再設計責任の問題である。",
        "職場側の不安や観察を、本人説明不足や企業不信だけで読まない。",
        "健康情報は、共有範囲、確認方法、同意、職務接触点を読む条件窓として使う。",
        ["同意された共有範囲", "医療情報の翻訳者", "職場観察の扱い", "本人の希望"],
        ["本人と職場のどちらが正しいかを決める", "医療情報提出を正解化する", "プライバシーを障壁だけにする"],
        "connect_to_QR06_from_workplace_side",
        "workplace",
    ),
    card(
        "WPL-07",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0276,0266,0547"],
        ["C07-quality-participation", "C03-support-continuity", "C01-health-time"],
        "future-progression-career-redesign-mediation",
        "closed",
        "将来の変化を見越す職場設計は、本人を傷つけずに役割、評価、負荷、異動を話せる仲介線を必要とする。",
        "将来不安を採用抑制や能力低下予測に直結しない。",
        "進行や再燃可能性は、キャリア再設計の会話条件と仲介線を見る条件窓である。",
        ["本人が望む将来会話", "評価制度との接続", "職務変更時の納得形成", "外部仲介者の有無"],
        ["予後を人事判断に使う", "配慮継続をキャリア停滞に固定する", "職場善意を成果にする"],
        "thicken_C07_as_future_role_redesign_route",
        "workplace",
    ),
    card(
        "WPL-08",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0741,0358,0631"],
        ["C03-support-continuity", "C01-health-time", "C05-worksite-contact", "C07-quality-participation"],
        "open-state-workplace-continuity-contrast",
        "partial",
        "上司面談、負荷調整、異動、医療や家族との相談、教育が組み合わさると、職場は閉じた制約でなく再設計面になる。",
        "良い事例を支援効果や汎用解として使わず、開いている条件の対照として扱う。",
        "支援内容や制度名は、何が接続されると自由度が開くかを見る条件窓に限る。",
        ["支援前後の変化", "本人の評価", "職場負担の分配", "継続期間"],
        ["好事例を成功証明にする", "同じ支援を一般処方化する", "企業善意を制度代替にする"],
        "use_as_open_state_contrast_not_effectiveness",
        "workplace",
    ),
    card(
        "WPL-09",
        "workplace selected redacted narratives",
        ["data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl:selected:0017,0070,0191"],
        ["C03-support-continuity", "C05-worksite-contact", "C08-prework-participation"],
        "no-experience-imagined-difficulty-boundary",
        "boundary",
        "雇用経験がない職場の想定困難は、実際の配慮困難ではなく、入口前情報、相談線、職務分解の不足を示す可能性がある。",
        "未経験職場の不安を、受入不能や配慮不要の根拠にしない。",
        "雇用経験有無は、想定と実接触の差を読む条件窓として扱う。",
        ["実際に接触した職務条件", "相談機会", "求人前情報", "受入経験後の変化"],
        ["想定回答を実態証拠にする", "企業不安を偏見認定にする", "経験なしを低価値データにする"],
        "keep_as_workplace_source_window_boundary",
        "workplace",
    ),
    card(
        "NIVR-01",
        "NIVR local report summary and prior fragmentary reading",
        [
            "data/local_cache/document_fetches/nivr/houkoku172",
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-fragmentary-llm-context-reading-batch2-nivr-life-course-quality-v0-2026-05-18.md:F-LCR-10",
        ],
        ["C01-health-time", "C02-entry-translation", "C03-support-continuity", "C06-life-security", "C07-quality-participation"],
        "triad-survey-health-time-workplace-support-bridge",
        "partial",
        "NIVR No.172系は、本人、職場、支援機関をまたぐ健康時間、入口、支援連続、生活保障、参加品質の橋として使える。",
        "研究報告の要約から現在制度や支援妥当性を判断しない。",
        "難病と配慮の関係は、病名別対応ではなく、健康時間と職場支援接続の相互作用として扱う。",
        ["報告本文の章別精読", "調査設計の限界", "年代差", "現在制度のライブ確認"],
        ["公式報告を現行政策主張にする", "要約だけでsource validityを上げる", "三者構造を因果証明にする"],
        "use_as_source_family_bridge_for_C01_C03_C06",
        "nivr",
    ),
    card(
        "NIVR-02",
        "NIVR local report summary and prior fragmentary reading",
        [
            "data/local_cache/document_fetches/nivr/shiryou79",
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-fragmentary-llm-context-reading-batch2-nivr-life-course-quality-v0-2026-05-18.md:F-LCR-11",
        ],
        ["C03-support-continuity", "C01-health-time", "C02-entry-translation", "C06-life-security", "C07-quality-participation"],
        "medical-work-translation-responsibility",
        "partial",
        "医療と労働の接続資料は、医療判断を職場判断へ移すためではなく、健康時間と仕事条件を翻訳する責任境界として読む。",
        "医療機関が就労可否を決める構図に戻さない。",
        "疾患情報は、共有同意、仕事条件、生活保障への翻訳責任を読む条件窓に限る。",
        ["医療情報の翻訳様式", "本人同意", "職場側の理解能力", "支援機関の媒介責任"],
        ["医学モデル対社会モデルの対立に戻す", "医師意見を最終判断にする", "古い資料を現行運用とみなす"],
        "connect_medical_work_interface_to_C03_guardrail",
        "nivr",
    ),
    card(
        "NIVR-03",
        "NIVR local report summary and prior fragmentary reading",
        [
            "data/local_cache/document_fetches/nivr/houkoku186",
            "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-fragmentary-llm-context-reading-batch2-nivr-life-course-quality-v0-2026-05-18.md:F-LCR-09",
        ],
        ["C07-quality-participation", "C01-health-time", "C03-support-continuity", "C06-life-security"],
        "life-course-quality-career-freedom",
        "partial",
        "中高年期や長期キャリアの資料は、就労継続ではなく役割、処遇、学習、健康時間、生活保障が年齢とともに組み替わる自由度として読める。",
        "年齢や勤続を参加品質や安定の代理指標にしない。",
        "年齢、勤続、障害時期は、職務再設計と生活保障の時系列条件を見る窓に限る。",
        ["報告本文の章別精読", "企業規模や職種の差", "本人の価値判断", "処遇変化"],
        ["年齢から就労困難性を推定する", "継続雇用を質の証明にする", "最新性を未確認のまま公開主張にする"],
        "thicken_C07_life_course_route_without_promotion",
        "nivr",
    ),
    card(
        "WKS-01",
        "workshop derived notes",
        [
            "references/workshops/HW好事例再整理.md",
            "references/workshops/【分析】障害者就労支援_連携ポイント整理.md",
        ],
        ["C08-prework-participation", "C02-entry-translation", "C03-support-continuity", "C01-health-time", "C06-life-security"],
        "phased-support-from-early-info-to-crisis",
        "closed",
        "Workshop資料は、早期情報、自己理解、マッチング、就職後、長期継続、危機対応を分断せず同一経路として読む素材になる。",
        "好事例やワークショップ発言を一般解や成功証明として使わない。",
        "支援段階は、本人準備ではなく参加条件がどの時点で閉じるかを見る条件窓にする。",
        ["元参加者構成", "失敗例との対照", "長期アウトカム", "地域差"],
        ["好事例バイアスを見落とす", "段階モデルを線形手順にする", "個別発言を一般知識にする"],
        "use_as_phase_topology_for_C08_C03",
        "workshop",
    ),
    card(
        "WKS-02",
        "workshop derived notes",
        ["references/workshops/【分析】障害者就労支援_連携ポイント整理.md"],
        ["C03-support-continuity", "C04-information-participation", "C05-worksite-contact"],
        "actor-role-map-as-retranslation-topology",
        "closed",
        "Workshopの関係者地図は、誰が関わるかではなく、医療、生活、求人、職場、本人理解を誰がどう再翻訳するかの位相図として使える。",
        "連携先リストを支援連続の成立と読まない。",
        "機関種別や役割名は、情報形式と職務接触点の翻訳責任を読む条件窓に限る。",
        ["各アクターの戻り回路", "情報共有の同意", "職場側接触の深さ", "機関外空白"],
        ["アクター網羅を品質にする", "役割名から責任を推定する", "連携を善として無検査で使う"],
        "connect_workshop_actor_map_to_C03_C04_C05",
        "workshop",
    ),
    card(
        "WKS-03",
        "workshop derived notes",
        ["references/workshops/難病就労支援_相互作用パターン分析と連携設計.md"],
        ["C02-entry-translation", "C03-support-continuity", "C04-information-participation", "C06-life-security", "C08-prework-participation"],
        "rare-disease-interaction-patterns-as-boundary-tests",
        "closed",
        "難病就労支援の相互作用パターンは、入口遅れ、縦割り、地域空白、企業本人対話、制度隙間、医療労働情報断絶を検査する境界テストとして有用である。",
        "パターン名を確定知識や実装ルールにしない。",
        "疾患希少性や地域は、どの相互作用が不可視化されるかを見る条件窓に限る。",
        ["元発言の文脈確認", "反例", "地域差", "制度時点"],
        ["パターンを診断ラベル化する", "公的制度評価に進める", "地域空白を単純な資源不足にする"],
        "use_as_boundary_test_set_for_Falcon_core",
        "workshop",
    ),
]


AGGREGATE_FINDINGS = {
    "supporter_lens": [
        "支援者側資料は、支援メニューの効果ではなく、支援者が医療、制度、求人、職場、本人説明を相互翻訳できる容量として読むとCoreに接続しやすい。",
        "C03は支援の有無ではなく、評価、紹介、戻り回路、地域ネットワーク、学習場、企業説明が連続面になるかの軸として厚くなった。",
        "C08は本人の準備不足ではなく、仕事像、ストレス、生活リズム、体験、開始後支援を組み直す参加過程として厚くなった。",
    ],
    "workplace_lens": [
        "職場側資料は、職場の正誤や配慮妥当性ではなく、現場接触点、安全、人員余力、求人表示、相談線、将来再設計の自由度を可視化する。",
        "C05は一般的な職場環境ではなく、作業、顧客、移動、安全、欠勤代替、現場情報形式の細かい接触点として大きく厚くなった。",
        "職場未経験の想定困難は実態証拠ではなく、入口前情報と相談線の欠落を示す境界資料として扱う。",
    ],
    "nivr_workshop_lens": [
        "NIVR資料は、研究報告としてsource family bridgeに使い、現在政策、法的判断、支援妥当性、source validityには進めない。",
        "Workshop資料は、実践知の位相図、段階トポロジー、境界テストとして使い、好事例や個別発言を一般処方化しない。",
        "NIVRとWorkshopは、本人、職場、支援機関、医療、生活保障をまたぐ構造を可視化するが、human review前のCore候補接続に留める。",
    ],
    "integration_pressure": [
        "C03はStage 1全体の中心軸として再確認されたが、支援者善意や機関連携を成功証明にしないブレーキが必要である。",
        "C05とC06は、職場側資料により薄さがかなり補われ、C01/C03/C07/C08へ吸収しない独立自由度として扱いやすくなった。",
            "病名、障害名、制度カテゴリ、年齢、地域、職場規模はタブーではなく条件窓であり、配慮や就労困難性との関係を相互作用として読み、単純因果とlookup化を避ける検査設計が必要である。",
    ],
}


RECONNECTIONS = [
    {
        "route_id": "C01-health-time",
        "thickened_by": ["SPT-05", "SPT-07", "WPL-02", "WPL-05", "WPL-08", "NIVR-01", "NIVR-02", "NIVR-03", "WKS-01"],
        "new_pressure": "Health-time must be read through support timing, workplace consultation lines, leave-income sequences, and career redesign.",
        "boundary": "Do not convert condition fluctuation or progression into work-capacity prediction.",
    },
    {
        "route_id": "C02-entry-translation",
        "thickened_by": ["SPT-02", "SPT-03", "WPL-04", "NIVR-01", "NIVR-02", "WKS-01", "WKS-03"],
        "new_pressure": "Entry translation includes category limbo, employer signaling, pre-entry information, and support-role clarity.",
        "boundary": "Do not treat disclosure or category labeling as a one-direction answer.",
    },
    {
        "route_id": "C03-support-continuity",
        "thickened_by": [
            "SPT-01",
            "SPT-02",
            "SPT-03",
            "SPT-04",
            "SPT-05",
            "SPT-06",
            "SPT-08",
            "SPT-09",
            "WPL-02",
            "WPL-05",
            "WPL-06",
            "WPL-07",
            "WPL-08",
            "WPL-09",
            "NIVR-01",
            "NIVR-02",
            "NIVR-03",
            "WKS-01",
            "WKS-02",
            "WKS-03",
        ],
        "new_pressure": "Support continuity becomes the retranslation spine across person, workplace, medical, livelihood, and policy/practice surfaces.",
        "boundary": "Do not equate support presence, meeting presence, referral, or network naming with continuity.",
    },
    {
        "route_id": "C04-information-participation",
        "thickened_by": ["SPT-01", "SPT-03", "SPT-04", "SPT-06", "WPL-01", "WPL-02", "WPL-04", "WPL-06", "WKS-02", "WKS-03"],
        "new_pressure": "Information participation now includes consented disclosure, workplace observation, role-bound sharing, and information format at task-contact points.",
        "boundary": "Do not maximize information sharing; design safe, consented, task-relevant translation.",
    },
    {
        "route_id": "C05-worksite-contact",
        "thickened_by": ["WPL-01", "WPL-03", "WPL-04", "WPL-06", "WPL-08", "WPL-09", "WKS-02"],
        "new_pressure": "Worksite contact must be decomposed into task, safety, staffing, customer, commute, absence substitution, and information format.",
        "boundary": "Do not treat generic flexible work or generic awareness as sufficient worksite redesign.",
    },
    {
        "route_id": "C06-life-security",
        "thickened_by": ["SPT-02", "SPT-04", "SPT-08", "WPL-01", "WPL-03", "WPL-05", "NIVR-01", "NIVR-02", "NIVR-03", "WKS-01", "WKS-03"],
        "new_pressure": "Life security is a direct freedom axis linking income, leave, medical cost, category gaps, family support, and work continuation choices.",
        "boundary": "Do not convert employment continuation into livelihood success.",
    },
    {
        "route_id": "C07-quality-participation",
        "thickened_by": ["SPT-01", "SPT-08", "WPL-07", "WPL-08", "NIVR-01", "NIVR-02", "NIVR-03"],
        "new_pressure": "Quality participation is usable as role, value, future, career, and treatment redesign, especially across life course and workplace planning.",
        "boundary": "Do not promote satisfaction, tenure, or good-practice narratives into success evidence.",
    },
    {
        "route_id": "C08-prework-participation",
        "thickened_by": ["SPT-01", "SPT-05", "SPT-06", "SPT-07", "SPT-09", "WPL-09", "WKS-01", "WKS-03"],
        "new_pressure": "Prework participation is a sequencing route for detection, work image, trial, stress, entry information, and post-entry support.",
        "boundary": "Do not frame C08 as individual readiness deficit.",
    },
]


SOURCE_ARTIFACTS = [
    "data/staging/anonymized/supporter_practice_nanbyo/v0/free_text_units.redacted.jsonl",
    "data/staging/anonymized/supporter_practice_toku18/v0/free_text_units.redacted.jsonl",
    "data/analysis_ready/supporters/knowledge_network/supporter_knowledge_network.json",
    "data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness/toku18_deepdive_synthesis.md",
    "data/analysis_ready/supporters/supporter_practice_toku18/v2_effectiveness_catalog/support_effectiveness_catalog.md",
    "data/staging/anonymized/nanbyo_workplace_2022_2023/v0/free_text_units.redacted.jsonl",
    "data/staging/anonymized/nanbyo_workplace_2022_2023_web_raw0324/v0/free_text_units.redacted.jsonl",
    "data/staging/normalized/nanbyo_workplace_2022_2023/workplace_staging_notes.md",
    "data/staging/normalized/nanbyo_workplace_2022_2023_web_raw0324/workplace_web_raw0324_staging_notes.md",
    "data/local_cache/document_fetches/nivr/houkoku172",
    "data/local_cache/document_fetches/nivr/houkoku186",
    "data/local_cache/document_fetches/nivr/shiryou79",
    "references/workshops/HW好事例再整理.md",
    "references/workshops/【分析】障害者就労支援_連携ポイント整理.md",
    "references/workshops/難病就労支援_相互作用パターン分析と連携設計.md",
    "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.md",
    "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-fragmentary-llm-context-reading-batch1-thin-axis-v0-2026-05-18.md",
    "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-fragmentary-llm-context-reading-batch2-nivr-life-course-quality-v0-2026-05-18.md",
]


def axis_counts() -> dict[str, int]:
    counts: Counter[str] = Counter()
    for row in RESULTS:
        counts.update(row["primary_axes"])
    return dict(counts)


def validate() -> None:
    prohibited = [
        "_x000D_",
        "PERSON_NAME",
        "MEDICAL_INSTITUTION",
        "「",
        "」",
        "“",
        "”",
        "raw_quote",
        "source_valid",
        "support_valid",
        "public_approved",
        "runtime_approved",
        "candidate_pattern_promoted",
    ]
    blobs: list[str] = []
    for row in RESULTS:
        for key in [
            "source_window",
            "structural_node",
            "interaction_reading",
            "counter_reading",
            "condition_window_use",
            "network_use",
        ]:
            blobs.append(str(row.get(key, "")))
        blobs.extend(row.get("source_refs", []))
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

    source_family_counts = Counter(row["source_family"] for row in RESULTS)
    closure_counts = Counter(row["relation_closure"] for row in RESULTS)
    network_use_counts = Counter(row["network_use"] for row in RESULTS)
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
        "source_readiness_status": "local_structural_input_only_not_source_validity",
        "source_artifacts": SOURCE_ARTIFACTS,
        "result_count": len(RESULTS),
        "source_family_counts": dict(source_family_counts),
        "axis_counts": axis_counts(),
        "relation_closure_counts": dict(closure_counts),
        "network_use_counts": dict(network_use_counts),
        "aggregate_findings": AGGREGATE_FINDINGS,
        "duplicate_handling": {
            "workplace_web_raw0324": "treated_as_duplicate_surface_for_context_check_not_independent_count",
            "reason": "same workplace survey surface variant, used only to check staging and reading consistency",
        },
        "boundary": [
            "condition names, disability labels, age, region, and workplace size are usable as condition windows for interaction analysis, not simple causal lookup keys",
            "NIVR and workshop materials remain local structural inputs until source/readiness review and live verification if public use is needed",
            "supporter and workplace readings do not decide support validity, employer validity, accommodation validity, or work capacity",
        ],
        "result_jsonl": rel(RESULTS_JSONL),
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT-Codex-03 Supporter / Workplace / NIVR / Workshop Context Reading Summary",
        "",
        "日付: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: Codex high context-reading complete / no text export / no promotion / unreviewed",
        "",
        "## What This Is",
        "",
        "supporter、workplace、NIVR、workshop側の未読・薄読みに踏み込み、Stage 1 Coreへ接続するための第三読解束。",
        "本文、伏字本文、field値、短い引用、PIIは含めない。source/support validity、review status、candidate_pattern、public/runtime statusは動かさない。",
        "",
        "## Counts",
        "",
        f"- result_count: {summary['result_count']}",
        f"- source_family_counts: {summary['source_family_counts']}",
        f"- axis_counts: {summary['axis_counts']}",
        f"- relation_closure_counts: {summary['relation_closure_counts']}",
        f"- network_use_counts: {summary['network_use_counts']}",
        "",
        "## Source-Lens Findings",
        "",
    ]
    for lens, findings in AGGREGATE_FINDINGS.items():
        lines.append(f"### {lens}")
        lines.extend(f"- {finding}" for finding in findings)
        lines.append("")
    lines.extend(
        [
            "## Duplicate Handling",
            "",
            "- workplace web raw0324は同じ職場調査面の派生として扱い、独立カウントせず、読解一貫性確認だけに使う。",
            "",
            "## Boundary",
            "",
            "- 病名、障害名、制度カテゴリ、年齢、地域、職場規模は条件窓として使い、配慮や就労困難性との関係を相互作用として読み、単純因果lookupにはしない。",
            "- 支援者資料は支援効果ではなく、翻訳容量、役割、戻り回路、学習場として読む。",
            "- 職場資料は企業判断の正誤ではなく、作業接触点、情報共有、相談線、生活保障、将来再設計として読む。",
            "- NIVRとWorkshopは構造入力であり、現在政策、法的判断、source/support validity、public approvalには進めない。",
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
            "target": "merge FT-Codex-01/02/03 into a Stage 1 source-lens saturation map and isolate remaining honest holds",
            "boundary": "no text export, no source/support validity, no review status movement, no knowledge promotion",
        },
    }
    RECONNECTION_JSON.write_text(json.dumps(reconnect, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [
        "# Stage 1 FT-Codex-03 Network Reconnection",
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
        md.append(f"- thickened_by: {', '.join(r['thickened_by'])}")
        md.append(f"- pressure: {r['new_pressure']}")
        md.append(f"- boundary: {r['boundary']}")
        md.append("")
    md.extend(
        [
            "## Boundary",
            "",
            "- source/support validity、review status、candidate_pattern、Domain Core、public/runtime statusは動かしていない。",
            "- 支援者、職場、NIVR、Workshopはsource lensとしてCore候補を厚くするが、支援妥当性や現行政策判断には使わない。",
            "- C03、C05、C06は厚くなったが、human review前の専門知識ネットワーク候補に留める。",
            "",
            f"JSON: `{rel(RECONNECTION_JSON)}`",
        ]
    )
    RECONNECTION_MD.write_text("\n".join(md) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "summary": rel(SUMMARY_JSON),
                "reconnection": rel(RECONNECTION_MD),
                "results": rel(RESULTS_JSONL),
                "count": len(RESULTS),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    write()
