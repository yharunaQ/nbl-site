#!/usr/bin/env python3
"""Build the Stage 1 internal expert kernel for Falcon.

The kernel is a no-raw-text derived artifact. It turns the Stage 1 route,
operator, structural-family, 2001 ABC, and web-cache layers into reasoning
objects that Codex can use as an internal expert-agent scaffold.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

STAGE1_NETWORK = OUT_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
OPERATOR_INDEX = OUT_DIR / "stage1-production-operator-slot-index-v0-2026-05-18.json"
STRUCTURAL_FAMILIES = OUT_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.json"
ABC_OVERLAY = OUT_DIR / "stage1-production-2001-abc-codex-chat-expert-use-overlay-v0-2026-05-23.json"
WEB_BATCH1 = OUT_DIR / "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.json"
WEB_BATCH2 = OUT_DIR / "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.json"
CORE_PACKET = OUT_DIR / "stage1-production-core-completion-candidate-v0-2026-05-23.json"
C07_C08_ROUTE_THROUGH = OUT_DIR / "stage1-production-c07-c08-route-through-core-use-cards-v0-2026-05-23.json"

OUT_JSON = OUT_DIR / "stage1-production-core-expert-kernel-v0-2026-05-23.json"
OUT_MD = OUT_DIR / "stage1-production-core-expert-kernel-v0-2026-05-23.md"
OUT_JSONL = OUT_DIR / "stage1-production-core-expert-kernel-route-objects-v0-2026-05-23.jsonl"


ROUTE_FAMILY_MAP = {
    "QR-01-health-time-work-design": [
        "SF-01-health-time-choice-bundle",
        "SF-06-evaluation-translation-rule",
        "SF-10-life-security-sequencing",
        "SF-07-worksite-contact-design",
    ],
    "QR-02-information-work-procedure": [
        "SF-04-information-synchronization",
        "SF-08-support-retranslation",
        "SF-09-disclosure-translation-boundary",
        "SF-07-worksite-contact-design",
    ],
    "QR-03-worksite-contact-and-mobility": [
        "SF-07-worksite-contact-design",
        "SF-04-information-synchronization",
        "SF-01-health-time-choice-bundle",
        "SF-10-life-security-sequencing",
    ],
    "QR-04-life-security-sequencing": [
        "SF-10-life-security-sequencing",
        "SF-01-health-time-choice-bundle",
        "SF-02-entry-sequence-constraint",
        "SF-08-support-retranslation",
    ],
    "QR-05-entry-prework-translation": [
        "SF-02-entry-sequence-constraint",
        "SF-03-prework-participation-translation",
        "SF-08-support-retranslation",
        "SF-09-disclosure-translation-boundary",
    ],
    "QR-06-disclosure-boundary-and-mutual-translation": [
        "SF-09-disclosure-translation-boundary",
        "SF-04-information-synchronization",
        "SF-08-support-retranslation",
        "SF-03-prework-participation-translation",
    ],
    "QR-07-quality-career-and-value-translation": [
        "SF-05-career-participation-value",
        "SF-06-evaluation-translation-rule",
        "SF-01-health-time-choice-bundle",
        "SF-08-support-retranslation",
    ],
    "QR-08-diversity-conditioned-same-structure": [
        "SF-07-worksite-contact-design",
        "SF-01-health-time-choice-bundle",
        "SF-04-information-synchronization",
        "SF-09-disclosure-translation-boundary",
        "SF-10-life-security-sequencing",
    ],
}


ROUTE_KERNEL_SPECS = {
    "QR-01-health-time-work-design": {
        "core_function": "健康時間を、働ける/働けないの判定ではなく、仕事量、休息、通院、生活保障、評価が同時に組み替わる設計変数として読む。",
        "working_core_claim": "体調変動・疲労・痛み・通院は、本人側の症状情報だけではなく、仕事接触点、勤務量、休む権利、評価規則、収入不安のどこに翻訳されるかで困難にも自由度にもなる。",
        "mechanism": [
            "本人条件が勤務量、休憩、通院、作業場所、職務代替へ翻訳される。",
            "健康時間が見えるだけでなく、評価・処遇・役割期待へ損なわれずに接続される。",
            "生活保障が弱い場合、待つ・休む・戻る・選び直す自由度が先に閉じる。",
            "支援や職場理解は、健康情報を仕事条件へ再翻訳できる時だけ構造的な意味を持つ。",
        ],
        "expert_moves": [
            "健康信号を、時間、負荷、休息、通院、評価、収入の六つへ分解する。",
            "支援の有無ではなく、健康時間がどの職務手順へ翻訳されているかを見る。",
            "同じ観測を、評価翻訳の問題、生活保障の問題、情報同期の問題として読み替える。",
            "条件窓ごとに、健康時間が移動、疲労、感覚、認知、内部障害、生活責任のどこで形を変えるかを見る。",
        ],
        "condition_window_use": "病名・障害名は、健康時間がどの接触点で見えにくくなるかを探す窓であり、配慮や就労困難性を直に引くキーではない。",
        "counter_readings": [
            "体調問題に見えるものが、実際には評価規則や勤務量調整の欠落かもしれない。",
            "本人の体調管理問題に見えるものが、生活保障の不足で選択時間が閉じた結果かもしれない。",
            "支援があるように見えても、健康時間を仕事手順へ翻訳していなければ自由度は開かない。",
        ],
        "exploration_threads": [
            "健康時間を、個人の制約ではなく職場の時間設計能力として測るには何を見ればよいか。",
            "2001 ABCの内部障害・職場上司視点は、難病データ不在を補うのではなく、健康時間の職場翻訳をどう鋭くするか。",
        ],
    },
    "QR-02-information-work-procedure": {
        "core_function": "情報を、説明量ではなく、必要な場面、相手、形式、タイミング、責任、評価に同期する参加構造として読む。",
        "working_core_claim": "情報保障・相談・伝達は、本人が説明できたかではなく、業務指示、非公式情報、安全確認、職務分担、評価へ届いて初めて仕事参加の自由度になる。",
        "mechanism": [
            "本人条件と職務条件の情報が、作業手順・安全・役割期待に落ちる。",
            "支援者や上司が、情報を職場で使える単位へ再翻訳する。",
            "開示境界が保護されない場合、情報同期は本人負荷や不利益不安を増やす。",
            "情報は一回の説明ではなく、業務変化・体調変化・評価場面で更新される。",
        ],
        "expert_moves": [
            "情報が届いていない場所を、指示、相談、非公式情報、安全、評価に分ける。",
            "情報形式の問題と、職務設計・責任分担の問題を切り分ける。",
            "本人説明能力ではなく、職場側の受け取り構造と再翻訳者を探す。",
            "情報同期が健康時間、生活保障、開示境界へ波及しているかを見る。",
        ],
        "condition_window_use": "聴覚、視覚、認知、内部障害、精神障害、難病などの条件差は、どの情報面が不可視化されるかを探す入口として扱う。",
        "counter_readings": [
            "情報保障の不足ではなく、職務権限や評価規則に情報が接続していない可能性がある。",
            "説明不足に見えるものが、開示境界を守る設計がないために本人が説明できない状態かもしれない。",
            "相談先が存在しても、情報を仕事手順へ変換しない場合は参加構造にならない。",
        ],
        "exploration_threads": [
            "情報が増えるほど本人負荷が増える場面と、自由度が開く場面を分ける判別子は何か。",
            "職場上司回答と本人回答の差は、情報の量ではなく同期先の違いとして読めるか。",
        ],
    },
    "QR-03-worksite-contact-and-mobility": {
        "core_function": "仕事接触点を、設備リストではなく、身体・認知・情報・道具・場所・安全・評価が接する設計面として読む。",
        "working_core_claim": "通勤、移動、姿勢、設備、作業場所、安全確認、職務代替は、障害種類別対応表ではなく、本人条件と職務要求が接する場所をどう分解し直すかの問題である。",
        "mechanism": [
            "接触点を、移動、姿勢、手順、道具、情報、安全、休憩、代替作業、尊厳に分解する。",
            "接触点ごとに、健康時間・情報同期・評価・生活保障への波及を読む。",
            "職場上司視点は、本人側データだけでは見えない作業手順と配置の粒度を補う。",
            "接触点設計は固定配慮ではなく、職務変化と体調変化で更新される。",
        ],
        "expert_moves": [
            "障害名から対応表へ行かず、実際の作業接点を分解する。",
            "設備、動線、手順、安全確認、情報、評価のどこで自由度が閉じるかを見る。",
            "2001 ABCの職場上司回答を、現場接触点の粒度を増す窓として使う。",
            "web-cache事例は成功根拠ではなく、接触点分解の語彙を増やす入力として読む。",
        ],
        "condition_window_use": "条件窓は、視覚なら資料・移動、聴覚なら呼び出し・非公式情報、内部障害なら休憩・トイレ・服薬、認知なら手順など、同じ接触点構造の形の違いを探すために使う。",
        "counter_readings": [
            "設備問題に見えるものが、情報同期や安全責任分担の未整備かもしれない。",
            "移動問題に見えるものが、勤務時間・休息・評価・生活保障の連鎖かもしれない。",
            "配慮があるように見えても、職務の価値化や役割期待に接続しなければ定着の質は上がらない。",
        ],
        "exploration_threads": [
            "職場上司データから、本人データでは出にくい接触点語彙をどこまで抽出できるか。",
            "接触点の設計を、合理的配慮の項目ではなく、仕事そのものの再設計言語に変えられるか。",
        ],
    },
    "QR-04-life-security-sequencing": {
        "core_function": "生活保障を背景事情ではなく、待つ、休む、治療する、選び直す、戻る自由度を決める順序構造として読む。",
        "working_core_claim": "収入、医療費、家計責任、雇用形態、制度対象、休業時保障は、仕事選択の前提ではなく、健康時間・入口・支援接続・評価処遇の順序を直接変える。",
        "mechanism": [
            "生活保障が弱いと、本人は健康時間や適職探索を待てず、入口選択が先に狭まる。",
            "制度対象や休業保障は、治療・休息・職務調整の交渉余地を変える。",
            "支援は、生活条件を仕事条件へ翻訳できる場合にだけ入口順序を組み替える。",
            "生活保障は現行制度評価ではなく、仕事設計上の時間・選択・リスク配分として読む。",
        ],
        "expert_moves": [
            "生活問題として分離せず、仕事選択の順序をどこで閉じているかを見る。",
            "待てる時間、休める時間、試せる仕事、戻れる経路を分ける。",
            "制度の正否ではなく、制度接続がどの自由度を開閉するかを読む。",
            "健康時間と生活保障の絡みを、就労意欲や自己責任へ戻さない。",
        ],
        "condition_window_use": "条件窓は、医療費、通院頻度、体力回復、家族支援、雇用形態などがどの順序制約を強めるかを見るために使う。",
        "counter_readings": [
            "就労意欲の低さに見えるものが、生活保障不足で選べる順序が閉じている状態かもしれない。",
            "制度利用の有無に見えるものが、仕事条件へ翻訳できる支援者不在の問題かもしれない。",
            "収入問題に見えるものが、健康時間・入口・評価の複合制約かもしれない。",
        ],
        "exploration_threads": [
            "生活保障を、政策論の前に、個別ケースの時間設計変数としてどう扱うか。",
            "2001 ABCの負担感・職場配慮データは、生活保障そのものではなく、職場側に見える負担/継続条件をどう補助するか。",
        ],
    },
    "QR-05-entry-prework-translation": {
        "core_function": "入口以前参加を、準備不足ではなく、生活リズム、訓練、家族・地域・支援、求人条件への前段翻訳として読む。",
        "working_core_claim": "求職前、訓練、日中活動、生活リズム、自信、応募条件、求人理解は、応募時点の前に職務条件へ翻訳されることで入口を開く。",
        "mechanism": [
            "入口は求人応募の一時点ではなく、健康、生活、訓練、支援、開示、求人条件の順序で作られる。",
            "就労以前の活動が、職務手順や勤務量、説明範囲、支援役割へ接続される。",
            "未就労状態は、本人準備不足ではなく、前段翻訳機能が弱い可能性として読む。",
            "web-cacheの事例・Q&Aは、入口前の翻訳語彙を増やす入力として使う。",
        ],
        "expert_moves": [
            "応募前に閉じている自由度を、生活、訓練、支援、求人理解、開示の順に分ける。",
            "準備不足の説明に飛ばず、何へ翻訳されれば入口が開くかを見る。",
            "条件窓ごとに、前段参加が職務条件へ接続される経路の違いを探す。",
            "入口を就職率ではなく、選択可能な仕事の質と順序で読む。",
        ],
        "condition_window_use": "条件窓は、読み書き、手順、体力、移動、健康管理、家族支援など、入口以前に必要な翻訳対象を発見するために使う。",
        "counter_readings": [
            "未就労や訓練段階を、本人の非就労志向や準備不足と読まない。",
            "求人不足に見えるものが、求人条件を本人条件へ翻訳する手前の問題かもしれない。",
            "支援機関の有無ではなく、入口順序を組み替える役割を果たしているかを見る。",
        ],
        "exploration_threads": [
            "入口以前参加を、労働市場の外側ではなく仕事設計の前工程として記述できるか。",
            "C調査の詳細な機能障害データは、応募前の前段翻訳をどこまで精密化できるか。",
        ],
    },
    "QR-06-disclosure-boundary-and-mutual-translation": {
        "core_function": "開示を、言う/言わないではなく、本人条件と職務条件をどこまで誰が翻訳し、本人負荷と不利益を下げるかの境界設計として読む。",
        "working_core_claim": "病名・障害名の開示、説明範囲、職場理解、支援者仲介、プライバシーは、個人情報の提示量ではなく、仕事条件に必要な情報だけを安全に翻訳する構造である。",
        "mechanism": [
            "開示境界は、本人条件を職務条件へ翻訳する最小十分な範囲を探す。",
            "職場側の理解は、病名理解ではなく、手順・時間・安全・評価への翻訳で判断する。",
            "支援者は、本人の秘密を代弁するのではなく、仕事条件との相互翻訳を助ける。",
            "開示は一度の決定ではなく、入口、配置、変化、評価ごとに再同期される。",
        ],
        "expert_moves": [
            "開示量ではなく、伝えると開く自由度と、伝えると増える負荷を並べて読む。",
            "診断名の意味ではなく、職務上必要な条件単位へ変換する。",
            "本人説明能力ではなく、説明を受ける職場側構造を問う。",
            "開示しない選択も、構造上の保護や不利益回避として読む。",
        ],
        "condition_window_use": "条件窓は、不可視性、誤解されやすさ、説明負荷、非公式情報、安全確認、評価場面の違いを探すために使う。",
        "counter_readings": [
            "開示しないことを問題化せず、開示しても自由度が開かない構造を疑う。",
            "職場理解に見えるものが、実際には評価・役割・安全へ同期していない可能性がある。",
            "支援者仲介があっても、本人負荷やプライバシー境界を増やす場合がある。",
        ],
        "exploration_threads": [
            "病名理解を求めないまま、職場が必要十分な仕事条件を受け取る形式は何か。",
            "A/B/Cの三者差は、誰が何を知っているかではなく、どこまで職務条件に変換されたかとして読めるか。",
        ],
    },
    "QR-07-quality-career-and-value-translation": {
        "core_function": "定着を、在籍継続ではなく、条件付き遂行が成果、役割、処遇、働きがい、将来見通しへ価値化される構造として読む。",
        "working_core_claim": "働きがい、評価、役割拡大、技能習得、処遇、キャリアは、支援付き・変動付きの遂行が仕事上の価値として扱われるかに左右される。",
        "mechanism": [
            "遂行が可能でも、成果・役割・処遇へ翻訳されなければ参加の質は閉じる。",
            "評価規則が通常稼働を前提にしすぎると、条件付き遂行が不可視化される。",
            "支援は、できる仕事を増やすだけでなく、価値として読まれる経路を作る必要がある。",
            "満足度は心理状態ではなく、役割期待と評価翻訳の結果として読む。",
        ],
        "expert_moves": [
            "継続しているかより、役割、評価、処遇、技能、将来見通しが開いているかを見る。",
            "本人満足度を、仕事の価値翻訳と職場期待の構造として読む。",
            "配慮や支援が、成果の見え方を消していないかを点検する。",
            "身体・知的・精神・難病などの条件窓ごとに、価値化されにくい成果の違いを探す。",
        ],
        "condition_window_use": "条件窓は、成果が不可視化される場所、評価で不利になりやすい前提、キャリア見通しが閉じる接触点を探すために使う。",
        "counter_readings": [
            "満足度の高低を本人心理や職場評価だけで説明しない。",
            "配慮があることを定着の質と同一視しない。",
            "処遇や評価の妥当性判断ではなく、評価翻訳の構造として読む。",
        ],
        "exploration_threads": [
            "2001 ABCの満足度・有用性・上司視点は、定着の質をどう構造化できるか。",
            "支援付き遂行を、労務上の負担感ではなく価値生成として説明する語彙はどこにあるか。",
        ],
    },
    "QR-08-diversity-conditioned-same-structure": {
        "core_function": "疾病群・障害種類・年齢・性別を、層別要約ではなく、同じ構造が別の接触点・自由度・翻訳機序として現れる条件窓として読む。",
        "working_core_claim": "病名・障害名と配慮や困難性の関係は扱ってよいが、単純因果では扱わない。条件窓は、共通構造と、その条件下でだけ見える特殊構造を分けるために使う。",
        "mechanism": [
            "共通構造は、健康時間、仕事接触点、情報同期、支援再翻訳、生活保障、評価、開示境界で読む。",
            "条件窓は、どの構造が強く出るか、どの接触点が見えにくいか、どの反対読みが必要かを変える。",
            "2001 ABCは、身体・知的障害と三者紐付けの厚みで条件窓の機序探索を強める。",
            "難病・精神障害・現在制度の不足は、欠落ではなく適用境界として明示する。",
        ],
        "expert_moves": [
            "条件名を入口にしても、必ず構造、接触点、自由度、反対読みに戻す。",
            "共通構造と条件固有構造を分けて書く。",
            "条件窓ごとの違いを、配慮表ではなく機序差として表す。",
            "古いデータは時代差を持つ構造窓として扱い、現在妥当性へ飛ばない。",
        ],
        "condition_window_use": "条件窓はタブーではない。使い方の制約は、単純因果・能力判定・配慮表化を避け、相互作用の形を見つけることにある。",
        "counter_readings": [
            "条件名を使わないこと自体が、重要な相互作用を見落とす危険になる。",
            "一方で条件名から配慮を直に引くと、職場・支援・制度・評価の自由度が消える。",
            "古い身体・知的障害データを、現在の全領域代表として使わない。",
        ],
        "exploration_threads": [
            "条件窓を、偏見を増やさず専門知識を精密化する索引としてどう設計するか。",
            "2001年データの三者紐付けは、条件差を平均化せず、A/B/C差の機序としてどこまで読めるか。",
        ],
    },
}


NOT_ALLOWED = [
    "source/support/intervention validity decision",
    "medical/legal/employment/accommodation/case final judgment",
    "condition-to-support lookup",
    "work capacity or employability decision",
    "review status, candidate_pattern, Domain Core, Atlas/27-frame, public-safe, public-approved, runtime-approved movement",
    "public/current-policy claim without verification",
    "raw sensitive text, PII, or narrative quotation/export",
]


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def compact_operator(operator_summary: dict[str, Any]) -> dict[str, Any]:
    return {
        "operator_id": operator_summary.get("operator_id"),
        "name": operator_summary.get("name"),
        "function": operator_summary.get("function"),
        "failure_mode": operator_summary.get("failure_mode"),
        "icf_contact": operator_summary.get("icf_contact", []),
        "record_count_proxy": operator_summary.get("record_count_proxy"),
        "fragmentary_source_count": operator_summary.get("fragmentary_source_count"),
        "missing_axis_pressure": operator_summary.get("missing_axis_pressure", {}),
    }


def compact_family(card: dict[str, Any]) -> dict[str, Any]:
    return {
        "family_id": card.get("family_id"),
        "title": card.get("title"),
        "record_count": card.get("record_count"),
        "boundary_record_count": card.get("boundary_record_count"),
        "core_reading": card.get("core_reading"),
        "discriminator": card.get("discriminator"),
        "split_dimensions": card.get("split_dimensions", []),
        "counter_reading": card.get("counter_reading"),
        "overread_risk": card.get("overread_risk"),
    }


def motifs_for_route(batch: dict[str, Any], route_id: str) -> list[dict[str, Any]]:
    motifs = []
    for motif in batch.get("motif_cards", []):
        if route_id in motif.get("routes", []):
            motifs.append(
                {
                    "motif_id": motif.get("motif_id"),
                    "source_count": motif.get("source_count"),
                    "axes": motif.get("axes") or [motif.get("axis_id")],
                    "mechanism_reading": motif.get("mechanism_reading"),
                    "core_contribution": motif.get("core_contribution"),
                    "counter_window": motif.get("counter_window"),
                }
            )
    return motifs


def build_route_object(
    route: dict[str, Any],
    core_card: dict[str, Any],
    abc_card: dict[str, Any],
    batch1: dict[str, Any],
    batch2: dict[str, Any],
    family_by_id: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    route_id = route["route_id"]
    spec = ROUTE_KERNEL_SPECS[route_id]
    families = [
        compact_family(family_by_id[fid])
        for fid in ROUTE_FAMILY_MAP[route_id]
        if fid in family_by_id
    ]
    web_additions = {
        "batch1_jeed_reference_p0": batch1.get("stage1_route_core_additions", {}).get(route_id),
        "batch2_official_underread_axis": batch2.get("stage1_route_core_additions", {}).get(route_id),
        "batch1_motifs": motifs_for_route(batch1, route_id),
        "batch2_motifs": motifs_for_route(batch2, route_id),
    }
    return {
        "route_id": route_id,
        "kernel_status": "internal_expert_kernel_unreviewed_no_promotion_no_runtime",
        "source_text_exported": False,
        "stage1_axis": core_card.get("stage1_axis"),
        "user_need": route.get("user_need"),
        "core_function": spec["core_function"],
        "working_core_claim": spec["working_core_claim"],
        "mechanism": spec["mechanism"],
        "operator_chain": [compact_operator(op) for op in route.get("operator_summaries", [])],
        "structural_families": families,
        "evidence_layers": {
            "stage1_survey_and_context_branch_layer": {
                "operators": route.get("operators", []),
                "branches": route.get("branches", []),
                "answer_focus": route.get("answer_focus", []),
            },
            "abc_2001_triadic_layer": {
                "use_level": abc_card.get("abc_use_level"),
                "mechanism_nodes": abc_card.get("mechanism_nodes", []),
                "mechanism_titles": abc_card.get("mechanism_titles", []),
                "what_2001_abc_adds": abc_card.get("what_2001_abc_adds"),
                "minimum_caution": abc_card.get("minimum_caution"),
            },
            "web_cache_deep_reading_layer": web_additions,
        },
        "expert_moves": spec["expert_moves"],
        "condition_window_use": spec["condition_window_use"],
        "counter_readings": spec["counter_readings"],
        "exploration_threads": spec["exploration_threads"],
        "kernel_answer_frame": [
            "routeを選ぶ。",
            "operator_chainで相互作用を分解する。",
            "structural_familiesで共通構造と条件窓を接続する。",
            "ABC layerで三者差・職場粒度・身体/知的障害窓を足す。",
            "web-cache layerで公式/準公式の語彙・実装 actor 条件を足す。",
            "counter_readingsで単純因果、配慮表化、能力判定を崩す。",
            "remaining boundaryを明示して、判断ではなく評価可能な構造として返す。",
        ],
        "not_allowed": NOT_ALLOWED,
        "route_stop_conditions": core_card.get("route_stop_conditions", []),
    }


def make_markdown(kernel: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append("# Stage 1 Core Expert Kernel")
    lines.append("")
    lines.append("作成日: 2026-05-23")
    lines.append("Lane: Falcon / Falcon Lab")
    lines.append("状態: 内部Expert Kernel / 未レビュー / 昇格なし / 公開不可 / runtime未承認")
    lines.append("本文引用: なし")
    lines.append("")
    lines.append("この成果物は、Stage 1を管理する表ではない。Falconが内部で考えるための推論kernelである。")
    lines.append("既存のStage 1 route、operator、structural family、2001 ABC、web-cache深読みに分かれていた層を、routeごとの専門家推論オブジェクトにまとめた。")
    lines.append("")
    lines.append("## What This Kernel Adds")
    for item in kernel["what_this_kernel_adds"]:
        lines.append(f"- {item}")
    lines.append("")
    lines.append("## Global Expert Grammar")
    for item in kernel["global_expert_grammar"]:
        lines.append(f"- {item}")
    lines.append("")
    lines.append("## Source Stack")
    for key, value in kernel["source_stack"].items():
        if isinstance(value, dict):
            summary = ", ".join(f"{k}: {v}" for k, v in value.items())
            lines.append(f"- {key}: {summary}")
        else:
            lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Route Kernels")
    for obj in kernel["route_kernels"]:
        lines.append("")
        lines.append(f"### {obj['route_id']}")
        lines.append("")
        lines.append(f"**Core function:** {obj['core_function']}")
        lines.append("")
        lines.append(f"**Working core claim:** {obj['working_core_claim']}")
        lines.append("")
        lines.append("**Mechanism:**")
        for mechanism in obj["mechanism"]:
            lines.append(f"- {mechanism}")
        lines.append("")
        lines.append("**Expert moves:**")
        for move in obj["expert_moves"]:
            lines.append(f"- {move}")
        lines.append("")
        lines.append(f"**Condition-window use:** {obj['condition_window_use']}")
        lines.append("")
        lines.append("**Counter readings:**")
        for counter in obj["counter_readings"]:
            lines.append(f"- {counter}")
        lines.append("")
        lines.append("**Structural family anchors:**")
        for family in obj["structural_families"]:
            lines.append(
                f"- {family['family_id']}: {family['title']} / {family['core_reading']}"
            )
        abc = obj["evidence_layers"]["abc_2001_triadic_layer"]
        lines.append("")
        lines.append("**2001 ABC layer:**")
        lines.append(f"- use: {abc['use_level']}")
        lines.append(f"- adds: {abc['what_2001_abc_adds']}")
        lines.append(f"- caution: {abc['minimum_caution']}")
        web = obj["evidence_layers"]["web_cache_deep_reading_layer"]
        additions = [
            web.get("batch1_jeed_reference_p0"),
            web.get("batch2_official_underread_axis"),
        ]
        additions = [a for a in additions if a]
        if additions or web.get("batch1_motifs") or web.get("batch2_motifs"):
            lines.append("")
            lines.append("**Web-cache layer:**")
            for addition in additions:
                lines.append(f"- {addition}")
            for motif in web.get("batch1_motifs", []) + web.get("batch2_motifs", []):
                lines.append(
                    f"- {motif['motif_id']}: {motif['core_contribution']}"
                )
        lines.append("")
        lines.append("**Exploration threads:**")
        for thread in obj["exploration_threads"]:
            lines.append(f"- {thread}")
    lines.append("")
    lines.append("## Boundaries")
    for item in kernel["not_allowed"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    stage1 = load_json(STAGE1_NETWORK)
    operators = load_json(OPERATOR_INDEX)
    structural = load_json(STRUCTURAL_FAMILIES)
    abc = load_json(ABC_OVERLAY)
    batch1 = load_json(WEB_BATCH1)
    batch2 = load_json(WEB_BATCH2)
    core = load_json(CORE_PACKET)
    route_through = load_json(C07_C08_ROUTE_THROUGH)

    routes_by_id = {route["route_id"]: route for route in stage1["query_routes"]}
    core_by_route = {card["route_id"]: card for card in core["route_cards"]}
    abc_by_route = {card["route_id"]: card for card in abc["route_cards"]}
    family_by_id = {card["family_id"]: card for card in structural["cards"]}

    route_objects = [
        build_route_object(
            route=routes_by_id[route_id],
            core_card=core_by_route.get(route_id, {}),
            abc_card=abc_by_route.get(route_id, {}),
            batch1=batch1,
            batch2=batch2,
            family_by_id=family_by_id,
        )
        for route_id in ROUTE_KERNEL_SPECS
    ]

    kernel = {
        "artifact_id": "stage1-production-core-expert-kernel-v0-2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "kernel_status": "internal_expert_kernel_unreviewed_no_promotion_no_runtime",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "purpose": "Give Falcon a concrete internal reasoning kernel for Stage 1 expert-agent use, without changing review, public, runtime, or promotion status.",
        "source_artifacts": [
            str(STAGE1_NETWORK.relative_to(ROOT)),
            str(OPERATOR_INDEX.relative_to(ROOT)),
            str(STRUCTURAL_FAMILIES.relative_to(ROOT)),
            str(ABC_OVERLAY.relative_to(ROOT)),
            str(WEB_BATCH1.relative_to(ROOT)),
            str(WEB_BATCH2.relative_to(ROOT)),
            str(CORE_PACKET.relative_to(ROOT)),
            str(C07_C08_ROUTE_THROUGH.relative_to(ROOT)),
        ],
        "what_this_kernel_adds": [
            "Stage 1 routeを、単なる検索routeではなく専門家推論routeとして使えるようにした。",
            "各routeに、core function、working core claim、mechanism、expert moves、counter readings、condition-window useを持たせた。",
            "2001 ABCの三者紐付け価値を、職場粒度、上司/本人/事業所差、身体・知的障害条件窓として接続した。",
            "web-cache深読みによる公式・準公式ソース語彙を、実装 actor 条件と職場接触点の分解に接続した。",
            "C07/C08は単独安定routeではなく、route-through cardsで厚い隣接routeを通す使用法に固定した。",
            "病名・障害名をタブー化せず、条件窓として科学的に扱うための推論手順を明示した。",
        ],
        "global_expert_grammar": [
            "病名・障害名は、配慮表ではなく相互作用を見つける条件窓として使う。",
            "本人条件、仕事条件、職場環境、支援、制度、健康時間、評価、開示境界を同時に読む。",
            "困難の有無だけでなく、自由度がどこで開き、どこで閉じ、どこで残るかを見る。",
            "支援の有無ではなく、支援が何を誰に再翻訳しているかを見る。",
            "三者差は矛盾ではなく、接触点、情報同期、評価、負担感、本人有用性が別の場所に現れたものとして読む。",
            "古いデータは現在妥当性の証明ではなく、機序探索の厚い構造窓として使う。",
            "公式・準公式web-cacheは、権威づけではなく、実装 actor 条件と語彙を増やす入力として扱う。",
        ],
        "source_stack": {
            "stage1_routes": len(stage1["query_routes"]),
            "operators": len(operators["operators"]),
            "structural_families": len(structural["cards"]),
            "abc_route_cards": len(abc["route_cards"]),
            "web_cache": {
                "batch1_source_cards": batch1.get("batch_scope", {}).get("source_count"),
                "batch1_motifs": len(batch1.get("motif_cards", [])),
                "batch2_source_cards": batch2.get("batch_scope", {}).get("source_count"),
                "batch2_motifs": len(batch2.get("motif_cards", [])),
                "batch2_source_families": len(batch2.get("family_profiles", [])),
            },
            "c07_c08_route_through_cards": len(route_through["cards"]),
        },
        "route_kernels": route_objects,
        "not_allowed": NOT_ALLOWED,
    }

    dump_json(OUT_JSON, kernel)
    OUT_JSONL.write_text(
        "".join(json.dumps(obj, ensure_ascii=False) + "\n" for obj in route_objects),
        encoding="utf-8",
    )
    OUT_MD.write_text(make_markdown(kernel), encoding="utf-8")

    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")
    print(f"wrote {OUT_JSONL.relative_to(ROOT)}")
    print(f"route_kernels={len(route_objects)}")


if __name__ == "__main__":
    main()
