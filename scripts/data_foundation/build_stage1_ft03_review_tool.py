#!/usr/bin/env python3
"""Build a guided static FT03 human review tool.

The UI is intentionally a review workflow, not a link hub. It embeds concise,
no-raw-text reading material for each review item, lets a human record the
decision, and exports a machine-readable JSON result. It does not perform human
review, source/support validity judgment, public approval, or runtime approval.
"""

from __future__ import annotations

import json
import os
import html
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
WORKBOOK_JSON = RUN_DIR / "stage1-production-ft03-human-review-workbook-v0-2026-05-23.json"

TOOL_PREFIX = "stage1-production-ft03-human-review-tool-v0-2026-05-23"
TOOL_HTML = RUN_DIR / f"{TOOL_PREFIX}.html"
TOOL_DATA_JSON = RUN_DIR / f"{TOOL_PREFIX}-data.json"
G2_REPAIR_MD = RUN_DIR / "stage1-production-ft03-g2-eight-view-plain-language-repair-v0-2026-05-25.md"


PROHIBITED_MARKERS = [
    "_x000D_",
    "PERSON_NAME",
    "MEDICAL_INSTITUTION",
    "raw_quote",
    "candidate_pattern_promoted",
]


REVIEW_INPUT_LABELS = {
    "core_cut": "知識ネットワーク候補の全体像",
    "route_matrix": "8つの確認レンズと誤用防止",
    "source_lens": "情報源ごとの見え方と保留",
    "first_principles": "第一原理への整理",
    "japan_agenda": "日本の改善課題仮説",
    "review_packet": "旧レビュー資料",
    "g2_repair": "8つの見方の普通語版",
}


REVIEW_INPUT_PURPOSES = {
    "core_cut": "知識ネットワーク候補の全体像、使える範囲、使ってはいけない範囲を確認する。",
    "route_matrix": "8つの確認レンズが何を見て、何を判断してはいけないかを確認する。",
    "source_lens": "本人・支援者・職場・研究報告・過去データの見え方の違いを確認する。",
    "first_principles": "Falconの基本原理が、病名別対応表ではなく相互作用の見方になっているかを確認する。",
    "japan_agenda": "日本の改善課題仮説が、公開主張や政策評価に飛んでいないかを確認する。",
    "review_packet": "旧レビュー資料との対応を確認する。",
    "g2_repair": "G2で指摘された分かりにくさを補正し、8つの見方と誤用防止を普通の日本語で確認する。",
}


ORIENTATION = {
    "title": "最初に整理しておく全体像",
    "what_is_reviewed": [
        "ここでレビューする対象は、単一の文書ではなく、Falconの知識ネットワーク候補を説明する原成果物の束です。",
        "8つの見方、6つの層、12個の原理は、同じ種類の分類ではありません。役割が違います。",
        "レビューでは、用語を覚えることではなく、この束を内部で考える材料として使ってよいか、誤用されにくいかを見ます。",
    ],
    "three_roles": [
        {
            "name": "8つの見方",
            "role": "どこから読むか",
            "plain": "相談・調査・報告を読む時の入口です。健康時間、情報共有、職場接触点、生活保障など、最初に注目する切り口を決めます。",
        },
        {
            "name": "6つの層",
            "role": "何を分けて見るか",
            "plain": "どの入口から読んでも、条件、情報源、仕事設計、翻訳、自由度、レビュー状態を混ぜないための縦の整理です。",
        },
        {
            "name": "12個の原理",
            "role": "判断が歪まないかを確かめる",
            "plain": "病名から配慮を直接引かない、情報源を上下づけしない、支援を効果証明にしない、などの安全原理です。",
        },
    ],
    "flow": [
        "原成果物を読む",
        "8つの見方で入口を選ぶ",
        "6つの層で混ざりをほどく",
        "12個の原理で誤読を止める",
        "内部利用・修正・保留を判断する",
    ],
    "mece_note": [
        "8つの見方は、厳密なMECE分類ではありません。実際の就労支援では、健康時間、情報共有、生活保障、職場設計が同時に絡むため、無理に一つへ分類すると相互作用が消えます。",
        "MECEに近い役割を持つのは6つの層です。何を見ても、条件、情報源、仕事設計、翻訳、自由度、レビュー状態を分けることで、混線を防ぎます。",
        "12個の原理は分類表ではなく、判断の品質基準です。重なりはありますが、誤読を別方向から止めるための重なりです。",
    ],
    "route_groups": [
        {
            "group": "A. 働き続ける土台",
            "items": ["健康・通院・疲労を仕事設計として見る", "収入・休職・医療費など生活保障を自由度として見る"],
        },
        {
            "group": "B. 情報と開示",
            "items": ["情報共有を同意された仕事手順にする", "開示を、言う/言わないではなく安全な境界設計として見る"],
        },
        {
            "group": "C. 職場と入口",
            "items": ["作業・安全・顧客・人員余力など、仕事の接触点を見る", "就職前・入口・開始後支援を一続きの参加過程として見る"],
        },
        {
            "group": "D. 参加の質と条件",
            "items": ["満足度や勤続だけでなく、役割・評価・将来をみる", "病名・障害名を、答えではなく相互作用を見る窓にする"],
        },
    ],
    "layer_stack": [
        "条件: 病名、障害名、年齢、地域、職場規模など",
        "情報源: 本人、支援者、職場、研究報告、過去データなど",
        "仕事設計: 時間、作業、道具、安全、評価、求人表示など",
        "翻訳: 医療・生活・本人説明を仕事条件へつなぎ直す働き",
        "自由度: 待てる、休める、試せる、戻れる、選び直せるなど",
        "レビュー状態: 下書き、レビュー済み、公開可能、システム組込み可能を分ける",
    ],
    "principle_groups": [
        {
            "group": "見方の偏りを防ぐ",
            "items": ["病名・障害名を避けすぎず、決めつけにも使わない", "本人・支援者・職場・研究を上下づけしない", "古いデータや少数データは構造発見に使い、現在の証明にはしない"],
        },
        {
            "group": "仕事設計へ戻す",
            "items": ["健康時間を仕事設計として見る", "情報共有を仕事手順へつなぐ", "職場環境を具体的な仕事接触点に分解する", "開示を安全な境界設計として見る"],
        },
        {
            "group": "支援と生活を外側に出さない",
            "items": ["支援を、効果証明ではなく情報をつなぎ直す働きとして見る", "生活保障を、働く自由度を決める直接要因として見る"],
        },
        {
            "group": "参加を長い時間で見る",
            "items": ["就職前も参加過程として見る", "就職・定着だけでなく役割・評価・将来を見る", "答えを出すより、反対仮説とレビューで学習する"],
        },
    ],
}


GATE_GUIDES: dict[str, dict[str, Any]] = {
    "G1-core-internal-use": {
        "title_ja": "内部で考える材料として使えるか",
        "plain_goal": "この資料を、外部に出す答えではなく、Falconが見落としを減らすための内部メモとして使ってよいかを判断する。",
        "read_first": [
            "上に表示される原成果物群は、いくつかの調査・報告・作業メモをもとに、障害者就労支援で見落としやすい関係を整理した下書きです。",
            "使ってよい範囲は、よりよい質問を作る、別の見方を出す、足りない情報に気づく、というところまでです。",
            "人に対して「この配慮が正しい」「働ける/働けない」「この支援が有効」と判断するためには使いません。",
        ],
        "look_for": [
            "どこを読んでも「下書き」「内部用の考える材料」だと分かるか。",
            "質問を作ることと、助言や判断をすることの境目が見えるか。",
            "病名や障害名から答えを直接出す資料に見えないか。",
        ],
        "risk_watch": [
            "「完成版」「正しい知識」「根拠として使える」と読める言い方。",
            "内部で読む許可が、公開やシステム組込みの許可に見えてしまうこと。",
        ],
        "reviewer_checks": [
            "これは下書き・内部用だと明確に分かる。",
            "できることが、質問作成・見落とし発見・別仮説の提示に限られている。",
            "個別の配慮、就労可否、支援の正しさを判断する資料に見えない。",
        ],
        "moves_ja": ["内部で、質問作りや見落とし確認の材料として使える。"],
        "not_moves_ja": ["公開してよいこと", "システムに組み込んでよいこと", "支援や配慮の正しさ", "個別ケースの判断"],
        "source_keys": ["core_cut", "first_principles"],
    },
    "G2-route-brakes": {
        "title_ja": "8つの見方に誤用防止があるか",
        "plain_goal": "健康、情報共有、職場、生活保障、入口、開示、キャリア、病名・障害名の扱いという8つの見方が、危ない使われ方を止められるかを見る。",
        "read_first": [
            "この資料には、仕事と支援を読むための8つの見方があります。これは処方箋ではなく、問題を分解するためのレンズです。",
            "たとえば、満足度や勤続があっても、それだけで「成功」とは言えません。訓練中や未就労でも、それだけで「準備不足」とは言えません。",
            "各レンズには、使ってよい場面と、使ってはいけない場面が必要です。",
        ],
        "look_for": [
            "8つの見方が、何を考えるためのものか自然に分かるか。",
            "支援者が関わったことを、支援が正しい証明にしていないか。",
            "職場の不安や好事例を、本人の能力や企業の良し悪しの判断にしていないか。",
        ],
        "risk_watch": [
            "番号や専門語だけが並び、何を止めたいのか分からない状態。",
            "「よくある配慮一覧」や「障害別の対応表」に見えてしまうこと。",
        ],
        "reviewer_checks": [
            "8つの見方が、人間に分かる普通の言葉で説明されている。",
            "各見方に、使ってはいけない場面が書かれている。",
            "成功証明、能力判定、企業評価、準備不足判定に滑らない。",
        ],
        "moves_ja": ["8つの見方を、誤用防止つきの内部レンズとして使いやすくなる。"],
        "not_moves_ja": ["見方の正式採用", "公開用の説明", "障害別の配慮表", "支援や配慮の判断"],
        "source_keys": ["g2_repair", "route_matrix", "source_lens", "core_cut"],
    },
    "G3-source-lens": {
        "title_ja": "情報源を上下関係にしていないか",
        "plain_goal": "本人、支援者、職場、研究報告、過去データを、どれが正しいかの勝負ではなく、それぞれ別の面を見ている情報源として扱えているかを見る。",
        "read_first": [
            "本人、支援者、職場は、それぞれ違うものを見ています。違いは間違い探しではなく、何が翻訳されていないかを見る手がかりです。",
            "研究報告や公的資料は大事な材料ですが、それだけで今の制度説明や公開主張に使えるわけではありません。",
            "2001年データは古いですが、職場や三者の関係を細かく見る材料として使えます。ただし現在の妥当性の証明にはしません。",
        ],
        "look_for": [
            "本人・支援者・職場の違いを、正誤や優劣として扱っていないか。",
            "研究報告や公的資料を、公開用の根拠としてそのまま使っていないか。",
            "古いデータを、現在も同じだという証明にしていないか。",
        ],
        "risk_watch": [
            "「本人の見方より職場の見方が客観的」などの上下づけ。",
            "古いデータや一部の情報源から、現在の一般論を作ってしまうこと。",
        ],
        "reviewer_checks": [
            "情報源ごとの見え方の違いが、正誤ではなく補完関係として扱われている。",
            "研究報告や公的資料を、公開根拠や現行制度説明にそのまま使っていない。",
            "2001年データは、構造発見の材料として位置づけられている。",
        ],
        "moves_ja": ["情報源の違いを、内部で比較する材料として使いやすくなる。"],
        "not_moves_ja": ["どの情報源が正しいかの判断", "公開根拠としての採用", "現在制度の説明", "2001年データの現在妥当性"],
        "source_keys": ["source_lens", "route_matrix"],
    },
    "G4-condition-window-language": {
        "title_ja": "病名・障害名の扱いが偏っていないか",
        "plain_goal": "病名や障害名を、避けるべき言葉にも、答えを直接出す鍵にもせず、仕事や支援との関係を考える手がかりとして扱えているかを見る。",
        "read_first": [
            "Falconは病名や障害名を無視しません。無視すると、その条件だから見える困難や工夫が消えてしまいます。",
            "一方で、病名や障害名から配慮や就労困難性を直接引きません。それは固定観念につながります。",
            "見るべきなのは、体調、作業、時間、情報共有、生活保障、職場環境、支援がどう組み合わさっているかです。",
        ],
        "look_for": [
            "病名や障害名を扱うこと自体が悪い、という読みになっていないか。",
            "病名や障害名から配慮、能力、困難性を直接決めていないか。",
            "共通する構造と、その条件だから見える構造を分けているか。",
        ],
        "risk_watch": [
            "「病名は使わない方が安全」という過剰な避け方。",
            "「この障害ならこの配慮」という早見表のような使い方。",
        ],
        "reviewer_checks": [
            "病名・障害名を扱うこと自体を禁止していない。",
            "病名・障害名から配慮や困難性を直接決めていない。",
            "仕事・環境・支援・生活との相互作用を見る説明になっている。",
        ],
        "moves_ja": ["病名・障害名を、決めつけではなく相互作用を見る手がかりとして扱いやすくなる。"],
        "not_moves_ja": ["病名別の配慮表", "病名からの能力判断", "病名を扱わないという禁止ルール"],
        "source_keys": ["first_principles", "route_matrix"],
    },
    "G5-support-claim-safety": {
        "title_ja": "支援を「効いた証明」にしていないか",
        "plain_goal": "支援者や支援機関の関わりを、効果や正しさの証明ではなく、情報をつなぎ直す働きとして扱えているかを見る。",
        "read_first": [
            "支援があるかないかだけでは、何が起きているかは分かりません。",
            "大事なのは、医療、生活、求人、職場、本人の説明を、必要な相手に分かる形へつなぎ直せているかです。",
            "支援者の熱意、会議、紹介、同席、メニューは、それだけでは効果の証明ではありません。",
        ],
        "look_for": [
            "支援があるから良い、ないから悪い、という読みになっていないか。",
            "支援が何を誰に伝え直したのかを見ているか。",
            "支援の正しさではなく、追加で何を確認すべきかに使えているか。",
        ],
        "risk_watch": [
            "支援機関名や支援メニューが、効果保証のように見えること。",
            "合理的配慮や支援の正誤判断に見える表現。",
        ],
        "reviewer_checks": [
            "支援の有無を、成果や正しさの証明にしていない。",
            "支援の役割が、情報や条件をつなぎ直す働きとして説明されている。",
            "この段階では、問い作りや反対仮説に使うだけだと分かる。",
        ],
        "moves_ja": ["支援について、追加で確認すべきことや別の見方を出す材料にできる。"],
        "not_moves_ja": ["支援効果の判断", "支援機関の良否判断", "合理的配慮の正誤判断", "個別支援の推奨"],
        "source_keys": ["source_lens", "route_matrix", "japan_agenda"],
    },
    "G6-public-safe-translation": {
        "title_ja": "外部に出せる話と出せない話を分けられるか",
        "plain_goal": "NBLサイトやSNSで使える可能性がある考え方と、まだ外に出してはいけない判断・主張を分ける。",
        "read_first": [
            "外部に出せる可能性があるのは、『病名から答えを出さず、仕事・環境・支援の関係を見る』という考え方です。",
            "まだ出してはいけないのは、現行制度の説明、政策評価、支援効果、個別の配慮判断、法的・医療的・雇用上の判断です。",
            "短いSNS文にすると、下書きの境界が消えやすいので特に注意します。",
        ],
        "look_for": [
            "NBLが医療・法務・雇用判断を代替するように見えないか。",
            "病名・障害名から支援を引く印象が出ないか。",
            "考え方、仮説、根拠付き主張、現行制度の説明が混ざっていないか。",
        ],
        "risk_watch": [
            "分かりやすくするために強く言い切り、未確認の主張になってしまうこと。",
            "公的資料を読んだことが、そのまま公開承認済みの根拠に見えること。",
        ],
        "reviewer_checks": [
            "外部に出せるのは考え方・視点までだと分かる。",
            "現行制度、政策評価、個別配慮、支援効果をここで語っていない。",
            "NBLが専門判断を代替する印象になっていない。",
        ],
        "moves_ja": ["外部向けに言い換える候補テーマを検討しやすくなる。"],
        "not_moves_ja": ["公開承認", "SNS投稿承認", "現行制度の説明", "政策・法務・医療・雇用の判断"],
        "source_keys": ["first_principles", "japan_agenda"],
    },
    "G7-runtime-readiness": {
        "title_ja": "将来システムに入れる前の条件が分かるか",
        "plain_goal": "この知識を将来チャットや検索システムに入れるなら、何を返してよく、何を返してはいけないかを整理できるかを見る。",
        "read_first": [
            "システムが返してよいのは、可能な見方、足りない情報、別の仮説、確認した方がよい質問までです。",
            "返してはいけないのは、個別支援の推奨、配慮の正しさ、法的・医療的・雇用上の判断です。",
            "下書きなのか、レビュー済みなのか、公開可能なのかを、システム上で区別して表示できる必要があります。",
        ],
        "look_for": [
            "返してよい内容と止める内容が、実装者にも分かる言葉になっているか。",
            "下書きの知識を、確定回答として出さない仕組みが必要だと分かるか。",
            "ここでシステム組込みを承認したことになっていないか。",
        ],
        "risk_watch": [
            "プロトタイプが動いたことを、実運用してよいことと混同すること。",
            "将来のUIやチャットで、Falconが正解を返すエージェントに見えること。",
        ],
        "reviewer_checks": [
            "システムが返してよい内容が、質問・仮説・不足情報に限られている。",
            "個別判断や支援推奨を返してはいけないことが分かる。",
            "このレビューはシステム組込みの承認ではないと明確に分かる。",
        ],
        "moves_ja": ["将来システムに入れる前に必要な制約を整理する材料にできる。"],
        "not_moves_ja": ["システム組込みの承認", "実運用の承認", "回答生成ルールの変更", "データベースやプロンプトの変更"],
        "source_keys": ["core_cut", "first_principles"],
    },
}


RESULT_LABELS: dict[str, dict[str, dict[str, str]]] = {
    "G1-core-internal-use": {
        "accept_internal_use": {
            "label": "このまま内部で使える",
            "meaning": "外部に出さず、質問作りや見落とし確認の材料として使える。",
        },
        "accept_with_required_revisions": {
            "label": "直せば使える",
            "meaning": "危ない表現を直せば、内部の考える材料にできる。",
        },
        "hold": {
            "label": "まだ使わない",
            "meaning": "内部用でも誤用の危険が大きい。",
        },
    },
    "G2-route-brakes": {
        "accept_route_brakes": {
            "label": "誤用防止は十分",
            "meaning": "8つの見方を安全に使うための止め方が分かる。",
        },
        "revise_named_routes": {
            "label": "一部を直す",
            "meaning": "特定の見方だけ、誤用されそうな表現を直す。",
        },
        "hold_named_routes": {
            "label": "一部または全体を保留",
            "meaning": "誤用防止が弱く、まだ使わない。",
        },
    },
    "G3-source-lens": {
        "accept_source_lens_separation": {
            "label": "情報源の扱いは十分",
            "meaning": "各情報源を部分的な見え方として扱えている。",
        },
        "revise_source_lens_language": {
            "label": "表現を直す",
            "meaning": "正誤づけや、公開根拠のように見える言い方を直す。",
        },
        "hold_source_lens_use": {
            "label": "まだ使わない",
            "meaning": "情報源の扱いが危うく、判断材料にしにくい。",
        },
    },
    "G4-condition-window-language": {
        "accept_condition_window_language": {
            "label": "この扱いでよい",
            "meaning": "病名・障害名を避けすぎず、決めつけにもしていない。",
        },
        "revise_condition_window_language": {
            "label": "表現を直す",
            "meaning": "避けすぎ、または決めつけに見える表現を直す。",
        },
        "hold_condition_window_language": {
            "label": "まだ使わない",
            "meaning": "病名・障害名の扱いが危険なので保留する。",
        },
    },
    "G5-support-claim-safety": {
        "usable_for_question_generation": {
            "label": "質問作りに使える",
            "meaning": "支援の正しさは決めず、何を確認すべきかに使える。",
        },
        "usable_for_counter_hypothesis_only": {
            "label": "別仮説だけに使う",
            "meaning": "少し危ういので、反対の見方を出す用途に限る。",
        },
        "hold_support_claims": {
            "label": "まだ使わない",
            "meaning": "支援の効果や正しさに見えやすいため保留する。",
        },
    },
    "G6-public-safe-translation": {
        "public_concept_translation_possible": {
            "label": "公開用の素材にできる",
            "meaning": "公開承認ではないが、外部向けに言い換える検討材料にはできる。",
        },
        "public_translation_needs_revision": {
            "label": "公開前に直す",
            "meaning": "このままでは誤解や強すぎる主張になりやすい。",
        },
        "hold_public_translation": {
            "label": "外部向けは保留",
            "meaning": "NBLサイトやSNSに出す検討へ進めない。",
        },
    },
    "G7-runtime-readiness": {
        "runtime_preflight_contract_ready": {
            "label": "組込み条件の整理に進める",
            "meaning": "システム承認ではないが、必要な制約を整理する材料にはできる。",
        },
        "runtime_contract_needs_revision": {
            "label": "条件を直す",
            "meaning": "返してよい内容・止める内容の線引きを直す必要がある。",
        },
        "hold_runtime_readiness": {
            "label": "組込み検討は保留",
            "meaning": "将来のシステム組込みの前提整理にもまだ使わない。",
        },
    },
}


MODE_LABELS = {
    "R0-30min-founder-review": {
        "label_ja": "30分: 最小レビュー",
        "guide_ja": "内部で考える材料として使えるか、病名・障害名の扱いが危なくないかだけを見る。",
    },
    "R1-60min-route-review": {
        "label_ja": "60分: 誤用防止レビュー",
        "guide_ja": "8つの見方が誤用されないか、情報源の扱いが偏っていないかを見る。",
    },
    "R2-90min-boundary-review": {
        "label_ja": "90分: 全体レビュー",
        "guide_ja": "内部利用、支援の扱い、外部発信、将来のシステム組込み前の境界まで見る。",
    },
}


def inline_markdown(text: str) -> str:
    value = html.escape(text)
    value = re.sub(r"`([^`]+)`", r"<code>\1</code>", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", value)
    value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" target="_blank" rel="noreferrer">\1</a>', value)
    return value


def render_table(lines: list[str]) -> str:
    rows: list[list[str]] = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(set(cell) <= {"-", ":", " "} for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return ""
    header = rows[0]
    body = rows[1:]
    head_html = "".join(f"<th>{inline_markdown(cell)}</th>" for cell in header)
    body_html = "".join(
        "<tr>" + "".join(f"<td>{inline_markdown(cell)}</td>" for cell in row) + "</tr>"
        for row in body
    )
    return f"<table><thead><tr>{head_html}</tr></thead><tbody>{body_html}</tbody></table>"


def render_markdown(md: str) -> str:
    """Render the subset of Markdown used by derived Falcon artifacts."""

    out: list[str] = []
    paragraph: list[str] = []
    bullet: list[str] = []
    table: list[str] = []
    code: list[str] = []
    in_code = False

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            out.append(f"<p>{inline_markdown(' '.join(paragraph))}</p>")
            paragraph = []

    def flush_bullet() -> None:
        nonlocal bullet
        if bullet:
            out.append("<ul>" + "".join(f"<li>{inline_markdown(item)}</li>" for item in bullet) + "</ul>")
            bullet = []

    def flush_table() -> None:
        nonlocal table
        if table:
            out.append(render_table(table))
            table = []

    def flush_code() -> None:
        nonlocal code
        if code:
            escaped_code = html.escape("\n".join(code))
            out.append(f"<pre><code>{escaped_code}</code></pre>")
            code = []

    for raw_line in md.splitlines():
        line = raw_line.rstrip()
        if line.startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                flush_paragraph()
                flush_bullet()
                flush_table()
                in_code = True
            continue

        if in_code:
            code.append(line)
            continue

        if not line.strip():
            flush_paragraph()
            flush_bullet()
            flush_table()
            continue

        if line.lstrip().startswith("|") and line.rstrip().endswith("|"):
            flush_paragraph()
            flush_bullet()
            table.append(line)
            continue

        flush_table()

        heading_match = re.match(r"^(#{1,6})\s+(.+)$", line)
        if heading_match:
            flush_paragraph()
            flush_bullet()
            level = min(len(heading_match.group(1)) + 1, 6)
            out.append(f"<h{level}>{inline_markdown(heading_match.group(2))}</h{level}>")
            continue

        bullet_match = re.match(r"^\s*[-*]\s+(.+)$", line)
        if bullet_match:
            flush_paragraph()
            bullet.append(bullet_match.group(1))
            continue

        flush_bullet()
        paragraph.append(line.strip())

    flush_paragraph()
    flush_bullet()
    flush_table()
    flush_code()
    return "\n".join(out)


HTML_TEMPLATE = """<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Falcon Human Review Flow</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f6f4;
      --panel: #ffffff;
      --ink: #162026;
      --muted: #63707a;
      --line: #d7dedb;
      --green: #1f6f50;
      --green-soft: #e5f3ec;
      --blue: #2d5d93;
      --blue-soft: #e6edf7;
      --amber: #8b6019;
      --amber-soft: #f8efd9;
      --red: #9b2f35;
      --red-soft: #f8e4e4;
      --violet: #6d4f8f;
      --shadow: 0 10px 28px rgba(22, 32, 38, 0.08);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      min-width: 320px;
    }

    a {
      color: var(--blue);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button {
      border: 1px solid var(--line);
      background: #fff;
      color: var(--ink);
      border-radius: 7px;
      min-height: 40px;
      padding: 8px 12px;
      cursor: pointer;
    }

    button:hover {
      border-color: var(--blue);
    }

    button.primary,
    button.active {
      background: var(--green);
      border-color: var(--green);
      color: #fff;
    }

    button.secondary-active {
      background: var(--blue);
      border-color: var(--blue);
      color: #fff;
    }

    button.warning {
      background: var(--amber-soft);
      border-color: #d7b56b;
      color: #5c3a08;
    }

    .topbar {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: start;
      padding: 18px 24px;
      background: #fff;
      border-bottom: 1px solid var(--line);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    h1 {
      margin: 0;
      font-size: 23px;
      line-height: 1.28;
      letter-spacing: 0;
    }

    .subtitle {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.55;
    }

    .guard {
      max-width: 520px;
      padding: 9px 12px;
      border-radius: 8px;
      background: var(--red-soft);
      color: var(--red);
      border: 1px solid #e5b4b7;
      font-size: 13px;
      line-height: 1.5;
    }

    .workspace {
      display: grid;
      grid-template-columns: minmax(255px, 310px) minmax(0, 1fr) minmax(310px, 390px);
      gap: 14px;
      padding: 14px;
      align-items: start;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .panel h2 {
      margin: 0;
      padding: 14px 16px 8px;
      font-size: 15px;
      line-height: 1.35;
      letter-spacing: 0;
    }

    .panel-body {
      padding: 0 16px 16px;
    }

    .rail,
    .output-col {
      display: grid;
      gap: 14px;
    }

    .mode-list,
    .step-list,
    .action-row,
    .decision-options,
    .flow-steps {
      display: grid;
      gap: 8px;
    }

    .mode-btn,
    .step-btn {
      width: 100%;
      text-align: left;
    }

    .mode-btn strong,
    .step-btn strong {
      display: block;
      font-size: 13px;
      line-height: 1.35;
    }

    .mode-btn span,
    .step-btn span {
      display: block;
      margin-top: 3px;
      font-size: 12px;
      line-height: 1.45;
      color: var(--muted);
    }

    .mode-btn.active span,
    .step-btn.active span {
      color: rgba(255, 255, 255, 0.88);
    }

    .meter-line {
      display: grid;
      gap: 6px;
      margin-bottom: 12px;
      color: var(--muted);
      font-size: 13px;
    }

    .meter {
      height: 9px;
      border-radius: 999px;
      background: #e8ece9;
      overflow: hidden;
    }

    .meter span {
      display: block;
      width: 0%;
      height: 100%;
      background: var(--green);
    }

    .flow-steps {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin: 0 0 14px;
    }

    .flow-pill {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 7px 9px;
      background: #fbfcfb;
      font-size: 12px;
      text-align: center;
      color: #39464d;
      line-height: 1.35;
    }

    .main-panel {
      min-height: 760px;
    }

    .main-head {
      padding: 18px 20px 12px;
      border-bottom: 1px solid var(--line);
    }

    .step-kicker {
      color: var(--green);
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .main-head h2 {
      padding: 0;
      margin: 0;
      font-size: 24px;
      line-height: 1.38;
      letter-spacing: 0;
    }

    .goal-text {
      margin: 8px 0 0;
      color: #3f4b54;
      line-height: 1.58;
      font-size: 14px;
    }

    .main-body {
      padding: 18px 20px 22px;
      display: grid;
      gap: 16px;
    }

    .read-block,
    .check-block,
    .decision-block,
    .note-block {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      background: #fbfcfb;
    }

    .read-block {
      background: #fff;
    }

    .section-title {
      margin: 0 0 9px;
      font-weight: 700;
      font-size: 14px;
      color: #2e3c43;
    }

    ul {
      margin: 0;
      padding-left: 19px;
    }

    li {
      margin: 0 0 7px;
      line-height: 1.62;
      font-size: 14px;
    }

    .check-row {
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 8px;
      align-items: start;
      padding: 7px 0;
      border-top: 1px solid #edf0ee;
      font-size: 14px;
      line-height: 1.55;
    }

    .check-row:first-of-type {
      border-top: 0;
    }

    .check-row input {
      width: 18px;
      height: 18px;
      min-height: 18px;
      margin-top: 2px;
    }

    .decision-options {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .option-btn {
      text-align: left;
      min-height: 98px;
      display: grid;
      align-content: start;
      gap: 5px;
      overflow-wrap: anywhere;
    }

    .option-btn strong {
      font-size: 14px;
      line-height: 1.35;
    }

    .option-btn span {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .option-btn.selected {
      background: var(--blue);
      border-color: var(--blue);
      color: #fff;
    }

    .option-btn.selected span {
      color: rgba(255, 255, 255, 0.86);
    }

    label {
      display: grid;
      gap: 6px;
      color: #35434b;
      font-weight: 700;
      font-size: 13px;
    }

    input,
    select,
    textarea {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 7px;
      padding: 9px 10px;
      background: #fff;
      color: var(--ink);
      min-height: 38px;
    }

    textarea {
      min-height: 82px;
      resize: vertical;
      line-height: 1.52;
      font-size: 13px;
    }

    .output-json {
      min-height: 330px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      white-space: pre;
      overflow: auto;
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    .badge {
      display: inline-flex;
      min-height: 27px;
      align-items: center;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      line-height: 1.35;
      border: 1px solid var(--line);
      background: #fff;
    }

    .badge.move {
      background: var(--green-soft);
      border-color: #9bcbb3;
      color: #0c5438;
    }

    .badge.stop {
      background: var(--red-soft);
      border-color: #e5b4b7;
      color: var(--red);
    }

    .warning-box,
    .safe-box {
      border-radius: 8px;
      padding: 12px;
      font-size: 13px;
      line-height: 1.55;
    }

    .warning-box {
      border: 1px solid #d7b56b;
      background: var(--amber-soft);
      color: #553707;
    }

    .safe-box {
      border: 1px solid #9bcbb3;
      background: var(--green-soft);
      color: #0d4933;
    }

    details {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      padding: 10px 12px;
    }

    summary {
      cursor: pointer;
      color: #2e3c43;
      font-weight: 700;
      font-size: 13px;
    }

    .source-list {
      display: grid;
      gap: 7px;
      list-style: none;
      padding: 10px 0 0;
      margin: 0;
    }

    .source-list li {
      border-top: 1px solid #edf0ee;
      padding-top: 8px;
      overflow-wrap: anywhere;
      font-size: 13px;
      margin: 0;
    }

    .source-reading-block {
      border: 1px solid #cbd8df;
      border-radius: 8px;
      background: #fff;
      padding: 14px;
    }

    .orientation-block {
      border: 1px solid #b8c6d6;
      border-radius: 8px;
      background: #ffffff;
      padding: 14px;
    }

    .orientation-block h3 {
      margin: 0 0 9px;
      font-size: 18px;
      line-height: 1.35;
      letter-spacing: 0;
    }

    .orientation-lede {
      display: grid;
      gap: 7px;
      margin-bottom: 12px;
    }

    .orientation-lede p {
      margin: 0;
      color: #35444d;
      line-height: 1.65;
      font-size: 14px;
    }

    .orientation-flow {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      margin: 12px 0;
    }

    .flow-card {
      border: 1px solid var(--line);
      background: var(--blue-soft);
      border-radius: 8px;
      min-height: 78px;
      padding: 10px;
      display: grid;
      align-content: center;
      text-align: center;
      font-size: 13px;
      line-height: 1.45;
      color: #24405f;
    }

    .role-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin: 12px 0;
    }

    .role-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfb;
      padding: 12px;
    }

    .role-card strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .role-card em {
      display: inline-block;
      font-style: normal;
      color: var(--green);
      font-weight: 700;
      margin-bottom: 7px;
      font-size: 13px;
    }

    .role-card p {
      margin: 0;
      color: #46545d;
      font-size: 13px;
      line-height: 1.58;
    }

    .orientation-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }

    .mini-map {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfb;
      padding: 12px;
    }

    .mini-map h4 {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 1.35;
      letter-spacing: 0;
    }

    .mini-map ul {
      margin: 0;
      padding-left: 18px;
    }

    .mini-map li {
      font-size: 13px;
      line-height: 1.55;
      margin-bottom: 6px;
    }

    .mece-note {
      border: 1px solid #d7b56b;
      background: var(--amber-soft);
      color: #553707;
      border-radius: 8px;
      padding: 12px;
      margin-top: 12px;
    }

    .mece-note p {
      margin: 0 0 8px;
      font-size: 13px;
      line-height: 1.58;
    }

    .mece-note p:last-child {
      margin-bottom: 0;
    }

    .source-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0;
    }

    .source-tab {
      font-size: 13px;
      min-height: 34px;
      padding: 6px 10px;
    }

    .source-tab.active {
      background: var(--blue);
      border-color: var(--blue);
      color: #fff;
    }

    .source-purpose {
      color: #42515a;
      font-size: 13px;
      line-height: 1.55;
      margin: 0 0 10px;
    }

    .source-viewer {
      max-height: 520px;
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fcfdfc;
      padding: 16px;
    }

    .source-viewer h2,
    .source-viewer h3,
    .source-viewer h4 {
      margin: 18px 0 8px;
      line-height: 1.35;
      letter-spacing: 0;
    }

    .source-viewer h2:first-child,
    .source-viewer h3:first-child,
    .source-viewer h4:first-child {
      margin-top: 0;
    }

    .source-viewer h2 {
      font-size: 20px;
    }

    .source-viewer h3 {
      font-size: 17px;
    }

    .source-viewer h4 {
      font-size: 15px;
    }

    .source-viewer p,
    .source-viewer li {
      font-size: 14px;
      line-height: 1.7;
    }

    .source-viewer table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 13px;
    }

    .source-viewer th,
    .source-viewer td {
      border: 1px solid var(--line);
      padding: 7px 8px;
      vertical-align: top;
      text-align: left;
    }

    .source-viewer th {
      background: var(--blue-soft);
    }

    .source-viewer code {
      background: #eef2f5;
      border-radius: 5px;
      padding: 1px 4px;
      font-size: 0.92em;
    }

    .source-viewer pre {
      overflow: auto;
      background: #eef2f5;
      border-radius: 7px;
      padding: 10px;
    }

    .two-col {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .muted {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.55;
    }

    .nav-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }

    @media (max-width: 1180px) {
      .workspace {
        grid-template-columns: minmax(245px, 300px) minmax(0, 1fr);
      }

      .output-col {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 780px) {
      .topbar,
      .workspace {
        grid-template-columns: 1fr;
      }

      .topbar {
        position: static;
        padding: 16px;
      }

      .workspace {
        padding: 10px;
      }

      .main-panel {
        min-height: 0;
      }

      .flow-steps,
      .orientation-flow,
      .role-grid,
      .orientation-grid,
      .decision-options,
      .two-col,
      .nav-row {
        grid-template-columns: 1fr;
      }

      .main-head h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div>
      <h1>Falcon 人間レビュー・フロー</h1>
      <p class="subtitle">MDを探し回らず、この画面で「読む → チェック → 判断 → 記録」を順番に進める内部作業台。</p>
    </div>
    <div class="guard">個別の原文や個人情報は貼らない。公開、システム組込み、根拠としての採用はここでは承認しない。</div>
  </header>

  <main class="workspace">
    <aside class="rail">
      <section class="panel">
        <h2>所要時間を選ぶ</h2>
        <div class="panel-body">
          <div id="mode-list" class="mode-list"></div>
        </div>
      </section>

      <section class="panel">
        <h2>レビュー順</h2>
        <div class="panel-body">
          <div class="meter-line">
            <span id="completion-label">0 / 0 判断済み</span>
            <div class="meter" aria-hidden="true"><span id="completion-meter"></span></div>
          </div>
          <div id="step-list" class="step-list"></div>
        </div>
      </section>
    </aside>

    <section id="main-panel" class="panel main-panel" aria-live="polite"></section>

    <aside class="output-col">
      <section class="panel">
          <h2>記録者情報</h2>
        <div class="panel-body">
          <div class="two-col">
            <label>記録者
              <input id="reviewer-input" autocomplete="name" />
            </label>
            <label>日付
              <input id="date-input" type="date" />
            </label>
          </div>
          <label style="margin-top: 10px;">全体判断
            <select id="overall-input">
              <option value="">未選択</option>
              <option value="accept_selected_gates_with_limits">選んだ項目は制約つきで使える</option>
              <option value="accept_after_required_revisions">修正後なら使える</option>
              <option value="hold_selected_gates">まだ使わない</option>
              <option value="mixed_gate_results">項目ごとに判断が分かれる</option>
            </select>
          </label>
          <div class="safe-box" style="margin-top: 12px;">ここに残るのは、人間が選んだ判断の記録です。Codexが承認を代行するものではありません。</div>
        </div>
      </section>

      <section class="panel">
        <h2>記録データ</h2>
        <div class="panel-body">
          <div id="warnings" class="warning-box" hidden></div>
          <textarea id="json-output" class="output-json" readonly spellcheck="false"></textarea>
          <div class="action-row" style="margin-top: 10px;">
            <button id="copy-json" class="primary" type="button">記録をコピー</button>
            <button id="download-json" type="button">記録を保存</button>
            <button id="clear-draft" class="warning" type="button">入力を消す</button>
          </div>
        </div>
      </section>
    </aside>
  </main>

  <script>
    const REVIEW_DATA = __DATA_JSON__;
    const PROHIBITED_MARKERS = __PROHIBITED_JSON__;
    const STORAGE_KEY = "falcon-ft03-human-review-flow-v2-2026-05-23";

    const byId = (id) => document.getElementById(id);
    const today = () => new Date().toISOString().slice(0, 10);
    const modeById = (id) => REVIEW_DATA.review_modes.find((mode) => mode.id === id);
    const gateById = (id) => REVIEW_DATA.gates.find((gate) => gate.id === id);
    const resultLabels = (gate) => gate.result_labels || {};

    function escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function defaultState() {
      return {
        mode: "R2-90min-boundary-review",
        selectedGateId: "G1-core-internal-use",
        selectedSourceByGate: {},
        reviewer: "",
        date: today(),
        overall_decision: "",
        gate_results: REVIEW_DATA.gates.map((gate) => ({
          gate_id: gate.id,
          result_value: "",
          result_label_ja: "",
          checked_items: [],
          reviewer_notes_no_raw_text: [],
          required_revisions_no_raw_text: [],
          named_routes_or_artifacts: []
        }))
      };
    }

    function loadState() {
      let loaded = {};
      try {
        loaded = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch (error) {
        loaded = {};
      }
      const base = defaultState();
      const loadedByGate = new Map((loaded.gate_results || []).map((result) => [result.gate_id, result]));
      base.mode = loaded.mode || base.mode;
      base.selectedGateId = loaded.selectedGateId || base.selectedGateId;
      base.selectedSourceByGate = loaded.selectedSourceByGate || {};
      base.reviewer = loaded.reviewer || "";
      base.date = loaded.date || base.date;
      base.overall_decision = loaded.overall_decision || "";
      base.gate_results = base.gate_results.map((result) => ({ ...result, ...(loadedByGate.get(result.gate_id) || {}) }));
      return base;
    }

    let state = loadState();

    function saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function activeGateIds() {
      return modeById(state.mode).decide;
    }

    function activeIndex() {
      return activeGateIds().indexOf(state.selectedGateId);
    }

    function resultByGate(gateId) {
      return state.gate_results.find((result) => result.gate_id === gateId);
    }

    function splitLines(value) {
      return value.split("\\n").map((line) => line.trim()).filter(Boolean);
    }

    function splitTokens(value) {
      return value.split(/[\\n,]/).map((line) => line.trim()).filter(Boolean);
    }

    function renderModes() {
      byId("mode-list").innerHTML = REVIEW_DATA.review_modes.map((mode) => `
        <button type="button" class="mode-btn ${mode.id === state.mode ? "active" : ""}" data-mode="${escapeHtml(mode.id)}">
          <strong>${escapeHtml(mode.label_ja)}</strong>
          <span>${escapeHtml(mode.guide_ja)}</span>
        </button>
      `).join("");

      byId("mode-list").querySelectorAll("[data-mode]").forEach((button) => {
        button.addEventListener("click", () => {
          state.mode = button.dataset.mode;
          const ids = activeGateIds();
          if (!ids.includes(state.selectedGateId)) state.selectedGateId = ids[0];
          saveState();
          render();
        });
      });
    }

    function renderSteps() {
      const ids = activeGateIds();
      const completed = ids.filter((id) => resultByGate(id).result_value).length;
      byId("completion-label").textContent = `${completed} / ${ids.length} 判断済み`;
      byId("completion-meter").style.width = `${ids.length ? Math.round((completed / ids.length) * 100) : 0}%`;

      byId("step-list").innerHTML = ids.map((id, index) => {
        const gate = gateById(id);
        const result = resultByGate(id);
        const selected = id === state.selectedGateId;
        const label = result.result_label_ja || "未判断";
        return `
          <button type="button" class="step-btn ${selected ? "active" : ""}" data-gate="${escapeHtml(id)}">
            <strong>${index + 1}. ${escapeHtml(gate.title_ja)}</strong>
            <span>${escapeHtml(label)}</span>
          </button>
        `;
      }).join("");

      byId("step-list").querySelectorAll("[data-gate]").forEach((button) => {
        button.addEventListener("click", () => {
          state.selectedGateId = button.dataset.gate;
          saveState();
          render();
        });
      });
    }

    function sourceLinks(gate) {
      return gate.source_keys.map((key) => {
        const source = REVIEW_DATA.review_inputs[key];
        return `<li><a href="${escapeHtml(source.href)}" target="_blank" rel="noreferrer">${escapeHtml(source.label_ja)}</a><br><span class="muted">${escapeHtml(source.path)}</span></li>`;
      }).join("");
    }

    function sourceReading(gate) {
      const selected = state.selectedSourceByGate[gate.id] || gate.source_keys[0];
      const source = REVIEW_DATA.review_inputs[selected] || REVIEW_DATA.review_inputs[gate.source_keys[0]];
      const tabs = gate.source_keys.map((key) => {
        const item = REVIEW_DATA.review_inputs[key];
        return `
          <button type="button" class="source-tab ${key === selected ? "active" : ""}" data-source-key="${escapeHtml(key)}">
            ${escapeHtml(item.label_ja)}
          </button>
        `;
      }).join("");
      return `
        <section class="source-reading-block">
          <p class="section-title">この確認項目で読む原成果物</p>
          <p class="source-purpose">${escapeHtml(source.purpose_ja)}</p>
          <div class="source-tabs">${tabs}</div>
          <article class="source-viewer">${source.html_preview}</article>
        </section>
      `;
    }

    function listHtml(items) {
      return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }

    function orientationBlock(gate) {
      const openAttr = gate.id === "G1-core-internal-use" ? "open" : "";
      return `
        <details class="orientation-block" ${openAttr}>
          <summary>${escapeHtml(REVIEW_DATA.orientation.title)}</summary>
          <div class="orientation-lede">
            ${REVIEW_DATA.orientation.what_is_reviewed.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
          <div class="orientation-flow">
            ${REVIEW_DATA.orientation.flow.map((item) => `<div class="flow-card">${escapeHtml(item)}</div>`).join("")}
          </div>
          <div class="role-grid">
            ${REVIEW_DATA.orientation.three_roles.map((role) => `
              <div class="role-card">
                <strong>${escapeHtml(role.name)}</strong>
                <em>${escapeHtml(role.role)}</em>
                <p>${escapeHtml(role.plain)}</p>
              </div>
            `).join("")}
          </div>
          <div class="mece-note">
            ${REVIEW_DATA.orientation.mece_note.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
          <div class="orientation-grid">
            <div class="mini-map">
              <h4>8つの見方を4束で見る</h4>
              ${REVIEW_DATA.orientation.route_groups.map((group) => `
                <p class="section-title">${escapeHtml(group.group)}</p>
                ${listHtml(group.items)}
              `).join("")}
            </div>
            <div class="mini-map">
              <h4>6つの層</h4>
              ${listHtml(REVIEW_DATA.orientation.layer_stack)}
            </div>
            <div class="mini-map">
              <h4>12個の原理を4束で見る</h4>
              ${REVIEW_DATA.orientation.principle_groups.map((group) => `
                <p class="section-title">${escapeHtml(group.group)}</p>
                ${listHtml(group.items)}
              `).join("")}
            </div>
            <div class="mini-map">
              <h4>レビューでの判断</h4>
              ${listHtml([
                "この束を内部の考える材料として使ってよいか。",
                "危ない読み方を止める説明になっているか。",
                "外部公開、個別判断、システム組込みへ勝手に進んでいないか。"
              ])}
            </div>
          </div>
        </details>
      `;
    }

    function renderMainPanel() {
      const ids = activeGateIds();
      const index = activeIndex();
      const gate = gateById(state.selectedGateId);
      const result = resultByGate(gate.id);
      const labels = resultLabels(gate);

      byId("main-panel").innerHTML = `
        <div class="main-head">
          <div class="flow-steps" aria-label="レビューの流れ">
            <div class="flow-pill">1. 要点を読む</div>
            <div class="flow-pill">2. チェックする</div>
            <div class="flow-pill">3. 判断を選ぶ</div>
            <div class="flow-pill">4. 記録する</div>
          </div>
          <div class="step-kicker">確認項目 ${index + 1} / ${ids.length}</div>
          <h2>${escapeHtml(gate.title_ja)}</h2>
          <p class="goal-text">${escapeHtml(gate.plain_goal)}</p>
        </div>
        <div class="main-body">
          ${orientationBlock(gate)}

          ${sourceReading(gate)}

          <section class="read-block">
            <p class="section-title">読みながら見る観点</p>
            <ul>${gate.read_first.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>

          <section class="read-block">
            <p class="section-title">ここを見る</p>
            <ul>${gate.look_for.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>

          <section class="warning-box">
            <p class="section-title">誤読注意</p>
            <ul>${gate.risk_watch.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>

          <section class="check-block">
            <p class="section-title">チェック</p>
            ${gate.reviewer_checks.map((item) => `
              <label class="check-row">
                <input type="checkbox" data-check-item="${escapeHtml(item)}" ${result.checked_items.includes(item) ? "checked" : ""} />
                <span>${escapeHtml(item)}</span>
              </label>
            `).join("")}
          </section>

          <section class="decision-block">
            <p class="section-title">判断を選ぶ</p>
            <div class="decision-options">
              ${gate.allowed_values.map((value) => `
                <button type="button" class="option-btn ${result.result_value === value ? "selected" : ""}" data-result-value="${escapeHtml(value)}">
                  <strong>${escapeHtml(labels[value].label)}</strong>
                  <span>${escapeHtml(labels[value].meaning)}</span>
                </button>
              `).join("")}
            </div>
          </section>

          <section class="note-block">
            <div class="two-col">
              <label>判断メモ / 本文貼付なし
                <textarea id="notes-input" placeholder="短く。例: 内部用ならよいが、外部向けには成功例のように見えない修正が必要。">${escapeHtml((result.reviewer_notes_no_raw_text || []).join("\\n"))}</textarea>
              </label>
              <label>必要修正 / 本文貼付なし
                <textarea id="revisions-input" placeholder="修正が必要な場合だけ、対象と修正方向を短く。">${escapeHtml((result.required_revisions_no_raw_text || []).join("\\n"))}</textarea>
              </label>
            </div>
            <label style="margin-top: 10px;">気になった対象
              <textarea id="named-input" placeholder="例: 支援の扱い、職場の見方、病名・障害名の扱い、公開向け表現">${escapeHtml((result.named_routes_or_artifacts || []).join("\\n"))}</textarea>
            </label>
          </section>

          <section>
            <p class="section-title">この判断で動くもの</p>
            <div class="badge-row">${gate.moves_ja.map((item) => `<span class="badge move">${escapeHtml(item)}</span>`).join("")}</div>
          </section>
          <section>
            <p class="section-title">この判断では動かないもの</p>
            <div class="badge-row">${gate.not_moves_ja.map((item) => `<span class="badge stop">${escapeHtml(item)}</span>`).join("")}</div>
          </section>

          <details>
            <summary>原成果物リンク（照合が必要な時だけ）</summary>
            <ul class="source-list">${sourceLinks(gate)}</ul>
          </details>

          <div class="nav-row">
            <button id="prev-step" type="button" ${index === 0 ? "disabled" : ""}>前へ</button>
            <button id="next-step" type="button" class="primary" ${index >= ids.length - 1 ? "disabled" : ""}>次へ</button>
          </div>
        </div>
      `;

      byId("main-panel").querySelectorAll("[data-check-item]").forEach((input) => {
        input.addEventListener("change", () => {
          const item = input.dataset.checkItem;
          const set = new Set(result.checked_items || []);
          if (input.checked) set.add(item);
          else set.delete(item);
          result.checked_items = Array.from(set);
          saveState();
          renderOutputOnly();
        });
      });

      byId("main-panel").querySelectorAll("[data-source-key]").forEach((button) => {
        button.addEventListener("click", () => {
          state.selectedSourceByGate[gate.id] = button.dataset.sourceKey;
          saveState();
          render();
        });
      });

      byId("main-panel").querySelectorAll("[data-result-value]").forEach((button) => {
        button.addEventListener("click", () => {
          const value = button.dataset.resultValue;
          result.result_value = value;
          result.result_label_ja = labels[value].label;
          saveState();
          render();
        });
      });

      byId("notes-input").addEventListener("input", (event) => {
        result.reviewer_notes_no_raw_text = splitLines(event.target.value);
        saveState();
        renderOutputOnly();
      });
      byId("revisions-input").addEventListener("input", (event) => {
        result.required_revisions_no_raw_text = splitLines(event.target.value);
        saveState();
        renderOutputOnly();
      });
      byId("named-input").addEventListener("input", (event) => {
        result.named_routes_or_artifacts = splitTokens(event.target.value);
        saveState();
        renderOutputOnly();
      });
      byId("prev-step").addEventListener("click", () => {
        if (index <= 0) return;
        state.selectedGateId = ids[index - 1];
        saveState();
        render();
      });
      byId("next-step").addEventListener("click", () => {
        if (index >= ids.length - 1) return;
        state.selectedGateId = ids[index + 1];
        saveState();
        render();
      });
    }

    function buildOutput() {
      const allowed = new Set(activeGateIds());
      return {
        artifact_id: "stage1-production-ft03-human-review-result-filled-v0-2026-05-23",
        derived_from: REVIEW_DATA.artifact_id,
        lane: REVIEW_DATA.lane,
        status: "human_filled_review_result_no_raw_text",
        reviewer: state.reviewer,
        date: state.date,
        review_mode: state.mode,
        overall_decision: state.overall_decision,
        gate_results: state.gate_results
          .filter((result) => allowed.has(result.gate_id))
          .map((result) => ({
            gate_id: result.gate_id,
            result_value: result.result_value,
            result_label_ja: result.result_label_ja,
            checked_items: result.checked_items || [],
            reviewer_notes_no_raw_text: result.reviewer_notes_no_raw_text || [],
            required_revisions_no_raw_text: result.required_revisions_no_raw_text || [],
            named_routes_or_artifacts: result.named_routes_or_artifacts || []
          })),
        explicit_non_approval: REVIEW_DATA.explicit_non_approval
      };
    }

    function lintOutput(output) {
      const text = JSON.stringify(output.gate_results || [], null, 2);
      const warnings = [];
      for (const marker of PROHIBITED_MARKERS) {
        if (text.includes(marker)) warnings.push(`禁止markerが含まれています: ${marker}`);
      }
      if (/raw\\s*[:：]/i.test(text) || /quote\\s*[:：]/i.test(text)) {
        warnings.push("raw本文や引用を貼った可能性があります。メモはno-raw-textにしてください。");
      }
      if (/public[-_ ]?approved|runtime[-_ ]?approved|candidate_pattern_promoted/i.test(text)) {
        warnings.push("このtoolで承認できない語が含まれています。承認ではなく制約メモとして書けているか確認してください。");
      }
      return warnings;
    }

    function renderReviewerInputs() {
      byId("reviewer-input").value = state.reviewer;
      byId("date-input").value = state.date;
      byId("overall-input").value = state.overall_decision;
    }

    function renderOutputOnly() {
      const output = buildOutput();
      const warnings = lintOutput(output);
      const warningEl = byId("warnings");
      if (warnings.length) {
        warningEl.hidden = false;
        warningEl.innerHTML = `<strong>出力前に確認</strong><br>${warnings.map(escapeHtml).join("<br>")}`;
      } else {
        warningEl.hidden = true;
        warningEl.textContent = "";
      }
      byId("json-output").value = JSON.stringify(output, null, 2);
    }

    function render() {
      renderModes();
      renderSteps();
      renderMainPanel();
      renderReviewerInputs();
      renderOutputOnly();
    }

    byId("reviewer-input").addEventListener("input", (event) => {
      state.reviewer = event.target.value;
      saveState();
      renderOutputOnly();
    });
    byId("date-input").addEventListener("input", (event) => {
      state.date = event.target.value;
      saveState();
      renderOutputOnly();
    });
    byId("overall-input").addEventListener("input", (event) => {
      state.overall_decision = event.target.value;
      saveState();
      renderOutputOnly();
    });
    byId("copy-json").addEventListener("click", async () => {
      const text = byId("json-output").value;
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        byId("json-output").select();
        document.execCommand("copy");
      }
    });
    byId("download-json").addEventListener("click", () => {
      const blob = new Blob([byId("json-output").value + "\\n"], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "stage1-production-ft03-human-review-result-filled-v0-2026-05-23.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
    byId("clear-draft").addEventListener("click", () => {
      const confirmed = window.confirm("このブラウザに保存された入力だけを消します。成果物ファイルは変更しません。");
      if (!confirmed) return;
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      render();
    });

    render();
  </script>
</body>
</html>
"""


def relative_href(path_string: str) -> str:
    target = ROOT / path_string
    return os.path.relpath(target, start=RUN_DIR)


def validate(payload: dict[str, Any] | list[Any] | str) -> None:
    text = json.dumps(payload, ensure_ascii=False) if not isinstance(payload, str) else payload
    for marker in PROHIBITED_MARKERS:
        if marker in text:
            raise SystemExit(f"prohibited marker found: {marker}")


def enrich_modes(modes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    enriched = []
    for mode in modes:
        next_mode = dict(mode)
        next_mode.update(MODE_LABELS[mode["id"]])
        enriched.append(next_mode)
    return enriched


def enrich_gate(gate: dict[str, Any]) -> dict[str, Any]:
    guide = GATE_GUIDES[gate["id"]]
    labels = RESULT_LABELS[gate["id"]]
    return {
        **gate,
        **guide,
        "result_labels": labels,
    }


def build_tool_data(workbook: dict[str, Any]) -> dict[str, Any]:
    review_inputs = {}
    for key, path_string in workbook["review_inputs"].items():
        source_path = ROOT / path_string
        source_md = source_path.read_text(encoding="utf-8")
        review_inputs[key] = {
            "label_ja": REVIEW_INPUT_LABELS[key],
            "purpose_ja": REVIEW_INPUT_PURPOSES[key],
            "path": path_string,
            "href": relative_href(path_string),
            "html_preview": render_markdown(source_md),
        }
    if G2_REPAIR_MD.exists():
        key = "g2_repair"
        source_md = G2_REPAIR_MD.read_text(encoding="utf-8")
        path_string = str(G2_REPAIR_MD.relative_to(ROOT))
        review_inputs[key] = {
            "label_ja": REVIEW_INPUT_LABELS[key],
            "purpose_ja": REVIEW_INPUT_PURPOSES[key],
            "path": path_string,
            "href": relative_href(path_string),
            "html_preview": render_markdown(source_md),
        }

    return {
        "artifact_id": TOOL_PREFIX,
        "date": "2026-05-23",
        "lane": workbook["lane"],
        "status": "guided_static_human_review_tool_no_review_performed",
        "source_workbook": str(WORKBOOK_JSON.relative_to(ROOT)),
        "orientation": ORIENTATION,
        "review_inputs": review_inputs,
        "review_modes": enrich_modes(workbook["review_modes"]),
        "gates": [enrich_gate(gate) for gate in workbook["gates"]],
        "explicit_non_approval": [
            "not public-approved unless separately reviewed",
            "not runtime-approved unless separately approved",
            "not source/support validity; any later validity gate must be separate and explicit",
            "not legal/medical/employment/accommodation finality",
            "not a Codex-owned review result",
        ],
    }


def write_outputs() -> None:
    workbook = json.loads(WORKBOOK_JSON.read_text(encoding="utf-8"))
    data = build_tool_data(workbook)
    validate(data)

    TOOL_DATA_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    html = (
        HTML_TEMPLATE
        .replace("__DATA_JSON__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
        .replace("__PROHIBITED_JSON__", json.dumps(PROHIBITED_MARKERS, ensure_ascii=False))
    )
    TOOL_HTML.write_text(html, encoding="utf-8")

    print(str(TOOL_HTML.relative_to(ROOT)))
    print(str(TOOL_DATA_JSON.relative_to(ROOT)))


if __name__ == "__main__":
    write_outputs()
