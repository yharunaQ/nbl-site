#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
DISCOVERY_JSON = RUN_DIR / "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.md"


DEEP_READINGS: list[dict[str, Any]] = [
    {
        "discovery_id": "OD-01-health-time-support-career-loop",
        "deep_candidate_name": "健康時間・支援再翻訳・参加価値の循環構造",
        "core_structure": (
            "就労継続は、健康時間を削って働く/守って働くの二択ではない。"
            "健康時間が仕事遂行へ入り、支援が本人条件と職務条件を翻訳し、遂行が役割・評価・将来見通しへ価値化される循環として読む。"
        ),
        "causal_chain": [
            "疾病・障害・機能条件が、疲労、痛み、通院、体調変動、移動負荷、情報処理負荷などを通じて、仕事に使える時間と回復時間を変える。",
            "健康時間の制約が、勤務量、休み方、通勤、休憩、作業速度、仕事の任せ方に翻訳されるかどうかで、同じ就労継続でも構造が分かれる。",
            "支援や職場理解がある場合も、それが単なる助けではなく、本人条件を職務条件・評価条件へ再翻訳する機能を担う時に循環が開く。",
            "循環が閉じる場合、働けていても、健康時間を守る調整が役割・処遇・将来見通しへ接続せず、継続の質が残余化する。",
        ],
        "freedom_degrees": [
            {
                "name": "健康時間の配分自由度",
                "closed_side": "勤務量、休憩、通院、回復時間が本人の自己調整だけに残る。",
                "open_side": "健康時間が職務設計・勤務条件・相談手順へ組み込まれる。",
            },
            {
                "name": "支援再翻訳の自由度",
                "closed_side": "支援が制度利用や相談先に留まり、日々の仕事条件へ届かない。",
                "open_side": "支援が本人条件、職務、職場理解、評価を往復翻訳する。",
            },
            {
                "name": "参加価値の自由度",
                "closed_side": "続けている事実はあるが、役割拡大、処遇、将来見通しへの価値化が弱い。",
                "open_side": "条件付き遂行が、役割・技能・キャリア参加として認識される。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "難病・慢性疾患 / 疲労・痛み・変動",
                "structural_shape": "時間、通院、症状変動、休み方が中心自由度になりやすい。支援が勤務量と回復時間を翻訳できないと、就労継続が自己消耗型になる。",
            },
            {
                "condition_window": "移動・姿勢・身体操作",
                "structural_shape": "健康時間は移動経路、姿勢保持、作業場所、通勤負荷を通じて減る。職務接触点の再設計と一体で読まないと構造が薄くなる。",
            },
            {
                "condition_window": "精神・心理 / 認知・発達・知的",
                "structural_shape": "健康時間は不安、予測可能性、手順理解、対人負荷、説明負荷として現れる。時間量だけでなく、仕事情報の明確さと支援の同伴性が関係する。",
            },
            {
                "condition_window": "聴覚・視覚・内部障害などの少数窓",
                "structural_shape": "聞き取り努力、移動安全、排泄・服薬・プライバシーなど、健康時間を消費する接触点が異なる。少数窓は別分類ではなく循環構造の別形態として読む。",
            },
        ],
        "boundary_counter_reading": (
            "支援がある、または働いているという事実を循環が開いている証拠にしない。"
            "逆に支援が薄いケースでも、本人と職場内の非公式調整で一部自由度が開く場合がある。"
        ),
        "llm_reading_gain": "LLM文脈読解を深く入れる価値は、支援有無ではなく、どの接点で健康時間が仕事価値へ翻訳されているかを読む点にある。",
    },
    {
        "discovery_id": "OD-02-health-time-career-evaluation-stack",
        "deep_candidate_name": "健康時間・参加価値・評価翻訳の積層構造",
        "core_structure": (
            "現在働けていることと、働き方が評価・処遇・将来見通しへ正しく変換されることは別の自由度である。"
            "健康時間を守る働き方が、職場内で価値として読まれるか、制約や不足として読まれるかを構造焦点にする。"
        ),
        "causal_chain": [
            "健康条件により、勤務時間、作業速度、欠勤/休暇、職務範囲、通勤、回復時間が変わる。",
            "その変化が、本人の能力不足として読まれるか、条件付き遂行として読まれるかで評価翻訳が分かれる。",
            "評価翻訳が閉じると、配慮や短時間勤務があっても、昇給、役割、キャリア、働きがいに接続しにくい。",
            "評価翻訳が開くと、健康時間を守る調整が、安定遂行、技能形成、役割設計として価値化される可能性がある。",
        ],
        "freedom_degrees": [
            {
                "name": "評価基準の翻訳自由度",
                "closed_side": "標準的な量・速度・出勤前提だけで評価され、条件付き遂行の価値が見えにくい。",
                "open_side": "成果、安定性、役割、チーム貢献、再現可能な遂行条件として評価される。",
            },
            {
                "name": "キャリア参加の自由度",
                "closed_side": "仕事は続くが、技能形成、役割拡大、将来見通しが薄い。",
                "open_side": "現在の調整が、次の役割・学習・処遇へ接続する。",
            },
            {
                "name": "健康時間の正当化自由度",
                "closed_side": "休む、減らす、避けることが説明負荷や評価不安を生む。",
                "open_side": "健康時間の確保が、仕事を安定させる条件として共有される。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "変動性が大きい慢性疾患・難病",
                "structural_shape": "評価対象が日単位・週単位・月単位で変わる。短期の不安定さと長期の安定貢献をどう翻訳するかが焦点になる。",
            },
            {
                "condition_window": "身体動作・移動条件",
                "structural_shape": "職務範囲や作業場所の変更が、評価上の縮小として扱われるか、接触点再設計として扱われるかで分かれる。",
            },
            {
                "condition_window": "認知・発達・知的 / 精神・心理",
                "structural_shape": "手順明確化、予測可能性、対人負荷の軽減が、甘やかしではなく遂行条件として読まれるかが重要になる。",
            },
        ],
        "boundary_counter_reading": (
            "評価や処遇の妥当性をAIが判断しない。読むべきは、健康時間を守る働き方がどの評価規則へ翻訳されているか、または翻訳されていないかである。"
        ),
        "llm_reading_gain": "構造化回答だけでは、健康時間の調整が本人の価値低下として扱われているのか、職務設計として扱われているのかの文脈差を失いやすい。",
    },
    {
        "discovery_id": "OD-03-information-support-health-time-bridge",
        "deep_candidate_name": "情報同期・支援再翻訳・健康時間の橋構造",
        "core_structure": (
            "情報同期は、情報形式の問題だけではなく、健康時間と支援再翻訳をつなぐ橋である。"
            "必要情報が必要な相手・タイミング・職務場面へ届くかで、体調管理、相談、評価、再入口の自由度が変わる。"
        ),
        "causal_chain": [
            "機能条件により、聞く、見る、読む、説明する、非公式情報を拾う、体調を予告するなどの情報行為に負荷が生じる。",
            "情報が同期しないと、健康時間上の必要が職務条件へ翻訳されず、本人の自己管理・自己説明に滞留する。",
            "支援が入る場合も、情報を本人から職場へ伝えるだけでは不十分で、仕事手順、相談場面、評価、休み方へ変換する必要がある。",
            "橋が開くと、情報同期が健康時間を守り、支援がその同期を維持・更新する機能になる。",
        ],
        "freedom_degrees": [
            {
                "name": "情報到達範囲の自由度",
                "closed_side": "本人が伝えた情報が、現場の作業手順や判断場面へ届かない。",
                "open_side": "必要情報が、上司、同僚、支援者、手順、評価、緊急時対応へ必要範囲で届く。",
            },
            {
                "name": "情報タイミングの自由度",
                "closed_side": "困難が起きてから説明するため、健康時間と信頼を消耗する。",
                "open_side": "事前、変動時、復帰時、役割変更時に同期し直せる。",
            },
            {
                "name": "支援者の翻訳責任自由度",
                "closed_side": "本人が全部説明するか、支援者が一般論を伝えるだけになる。",
                "open_side": "誰が何をどの職務条件へ翻訳するかが分かれる。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "聴覚・音声情報",
                "structural_shape": "情報形式だけでなく、非公式情報、聞き取り努力、相談場面、同席支援、評価説明へ広がる。",
            },
            {
                "condition_window": "視覚情報",
                "structural_shape": "資料形式、移動案内、安全確認、訓練形式、求人説明が健康時間と入口順序へ接続する。",
            },
            {
                "condition_window": "見えにくい内部障害・全身管理",
                "structural_shape": "体調変動、排泄・服薬・休憩、プライバシー、開示境界が情報同期の形を変える。",
            },
            {
                "condition_window": "認知・発達・知的 / 精神・心理",
                "structural_shape": "明示的手順、見通し、相談可能性、対人負荷の低減が、健康時間を守る情報同期として現れる。",
            },
        ],
        "boundary_counter_reading": (
            "情報共有量を増やせばよいとは読まない。開示境界とプライバシーを保ちながら、仕事参加に必要な同期だけを読む必要がある。"
        ),
        "llm_reading_gain": "記述回答を読むことで、同じ『情報不足』が、形式不足、タイミング不足、翻訳主体不足、開示境界の防衛のどれかを分けられる。",
    },
    {
        "discovery_id": "OD-04-entry-prework-support-sequence",
        "deep_candidate_name": "入口以前参加・入口順序・支援再翻訳の前段構造",
        "core_structure": (
            "就職活動以前に、生活リズム、体力、訓練、説明、支援接続、職務イメージを求人条件へ翻訳する前段構造がある。"
            "ここを読まないと、未就労を本人準備不足や求人不足に戻してしまう。"
        ),
        "causal_chain": [
            "機能条件や生活条件が、日中活動、移動、訓練参加、体力、自己説明、職務理解に影響する。",
            "入口以前参加が職務条件へ翻訳されないと、応募、面接、実習、職場定着の前に選択肢が狭まる。",
            "支援がある場合も、応募書類や紹介だけではなく、生活・訓練・体調・説明を求人条件へ翻訳する必要がある。",
            "前段構造が開くと、求職は単発の応募行為ではなく、条件形成と職務接続の順序として扱える。",
        ],
        "freedom_degrees": [
            {
                "name": "入口順序の自由度",
                "closed_side": "応募や面接が先に来て、生活・体力・支援接続・職務条件が後追いになる。",
                "open_side": "訓練、実習、生活安定、支援接続、求人探索が順序づけられる。",
            },
            {
                "name": "入口以前参加の翻訳自由度",
                "closed_side": "日中活動や訓練が、仕事との接点を持たずに分断される。",
                "open_side": "活動、技能、生活リズム、支援利用が職務条件へ接続される。",
            },
            {
                "name": "説明負荷の自由度",
                "closed_side": "本人が入口で一気に説明し、理解されるかどうかに依存する。",
                "open_side": "支援者、資料、実習、職務調整を通じて段階的に説明できる。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "疲労・痛み・変動 / 慢性疾患",
                "structural_shape": "体力形成、勤務時間探索、通院・回復時間の見込みが入口前の主要自由度になる。",
            },
            {
                "condition_window": "認知・発達・知的",
                "structural_shape": "職務手順、実習、支援者の同伴、説明素材が、求人入口より前に必要になる。",
            },
            {
                "condition_window": "視覚・移動・身体条件",
                "structural_shape": "通勤、時間帯、作業場所、訓練形式、移動安全が入口順序を変える。",
            },
        ],
        "boundary_counter_reading": (
            "少数例や5例前後の分枝は候補命題に昇格しない。ただし、同型構造を探索する境界例として保持し、上位構造へ復活させる。"
        ),
        "llm_reading_gain": "記述読解により、求職困難を単一理由ではなく、入口前にどの自由度が閉じているかの順序として読める。",
    },
    {
        "discovery_id": "OD-05-worksite-contact-health-support-design",
        "deep_candidate_name": "仕事接触点・健康時間・支援再翻訳の設計構造",
        "core_structure": (
            "配慮は設備や制度項目ではなく、職務と本人条件が接触する面の再設計として読む。"
            "作業、移動、休憩、安全、プライバシー、代替作業、相談場面が健康時間を開閉する。"
        ),
        "causal_chain": [
            "機能条件が、職場内移動、姿勢、作業速度、感覚情報、安全確認、排泄・服薬・休憩、対人接触に具体化する。",
            "接触点が未設計だと、同じ配慮項目があっても、本人の健康時間や尊厳を消耗する。",
            "支援再翻訳が入る場合、単に職場へ要望を伝えるのではなく、どの接触点をどう変えるかへ落とし込む必要がある。",
            "接触点が設計されると、健康時間、仕事遂行、情報同期、評価翻訳が同時に開く場合がある。",
        ],
        "freedom_degrees": [
            {
                "name": "職務接触点の分解自由度",
                "closed_side": "配慮が抽象的で、実際の作業・動線・時間・安全へ落ちない。",
                "open_side": "作業単位、移動経路、休憩、代替、支援者、確認手順へ分解される。",
            },
            {
                "name": "尊厳・プライバシーの自由度",
                "closed_side": "健康管理や身体条件が周囲の解釈や本人負荷に残る。",
                "open_side": "必要な調整が本人の尊厳と説明範囲を守る形で職務化される。",
            },
            {
                "name": "支援の職務化自由度",
                "closed_side": "支援が相談や制度説明に留まり、接触点設計へ届かない。",
                "open_side": "支援が仕事の場面・手順・役割分担を翻訳する。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "視覚情報",
                "structural_shape": "移動安全、資料形式、時間帯、作業場所、訓練形式が接触点になる。",
            },
            {
                "condition_window": "聴覚・音声情報",
                "structural_shape": "指示、非公式情報、安全確認、相談場面、支援者同席が接触点になる。",
            },
            {
                "condition_window": "内部障害・全身管理",
                "structural_shape": "排泄、服薬、休憩、臭い、通院、プライバシーが接触点になる。",
            },
            {
                "condition_window": "身体動作・移動",
                "structural_shape": "通勤、職場動線、姿勢保持、重量、代替作業、設備配置が接触点になる。",
            },
        ],
        "boundary_counter_reading": (
            "障害種類別対応表に落とすと、同じ仕事接触点が異なる条件窓でどう変形するかが見えなくなる。設備の有無を支援有効性判断にも使わない。"
        ),
        "llm_reading_gain": "LLM読解は、配慮項目名ではなく、実際にどの仕事接触点で健康時間が消費・保護されているかを復元するために必要になる。",
    },
    {
        "discovery_id": "OD-06-life-security-health-support-sequence",
        "deep_candidate_name": "生活保障・健康時間・支援利用の順序構造",
        "core_structure": (
            "生活保障は背景事情ではなく、休めるか、待てるか、治療を続けられるか、求人を選べるか、支援へつながれるかを変える構造面である。"
            "健康時間と支援利用の順序を規定するため、就労意欲や困窮の説明に還元しない。"
        ),
        "causal_chain": [
            "収入、医療費、家計責任、雇用形態、休業時保障、制度対象境界が、健康時間と求職・継続の選択幅を制約する。",
            "生活保障が薄いと、休む、治療する、訓練する、待つ、選び直す自由度が狭まり、条件に合わない入口へ急がされる可能性がある。",
            "支援がある場合も、生活保障制約を読まないと、支援利用のタイミングや求人選択が実質的に閉じる。",
            "生活保障が一定程度開くと、健康時間を守る仕事条件の探索、支援接続、再入口の順序を組みやすくなる。",
        ],
        "freedom_degrees": [
            {
                "name": "待てる時間の自由度",
                "closed_side": "早く働く必要があり、訓練・治療・条件探索が後回しになる。",
                "open_side": "健康時間と職務条件が合う入口を探索する余地がある。",
            },
            {
                "name": "休める条件の自由度",
                "closed_side": "休むことが収入・評価・雇用継続不安と直結する。",
                "open_side": "治療・回復・休業が仕事継続や再入口と接続する。",
            },
            {
                "name": "支援アクセスの自由度",
                "closed_side": "支援につながる時間・心理的余裕・制度対象性が乏しい。",
                "open_side": "支援を使いながら、生活・健康・仕事条件を順序化できる。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "慢性疾患・難病 / 治療時間",
                "structural_shape": "治療継続、医療費、勤務中断、症状変動が生活保障と直接接続する。",
            },
            {
                "condition_window": "過去就業・再入口",
                "structural_shape": "過去の離職や過負荷が、次の入口で待てる時間・選べる求人・支援利用へ持ち越される。",
            },
            {
                "condition_window": "精神・心理 / 認知・発達・知的",
                "structural_shape": "生活不安が予測可能性、相談継続、訓練参加、求人選択の自由度をさらに狭める場合がある。",
            },
        ],
        "boundary_counter_reading": (
            "困窮、意欲、制度利用の有無をAIが評価しない。読むべきは、生活保障面がどの選択自由度を狭め、どの支援順序を変えているかである。"
        ),
        "llm_reading_gain": "記述読解により、同じ『収入不安』でも、休業、医療費、求人選択、支援利用、再入口のどこを閉じているかを分けられる。",
    },
    {
        "discovery_id": "OD-07-information-worksite-translation-knot",
        "deep_candidate_name": "情報同期・仕事接触点・支援再翻訳の結節構造",
        "core_structure": (
            "情報保障、職場環境、支援を三項目に分解しすぎると、実際の参加自由度が見えない。"
            "支援が何を翻訳し、その情報がどの作業手順・安全確認・相談場面・評価場面へ届くかが結節点になる。"
        ),
        "causal_chain": [
            "機能条件により、仕事の情報取得、職場内移動、作業手順、安全確認、相談、説明範囲に負荷が生じる。",
            "情報同期だけがあっても、仕事接触点に落ちなければ参加自由度は開かない。",
            "設備や職場配慮があっても、本人条件と職務条件を翻訳する主体が不明だと、利用・更新・評価への接続が閉じる。",
            "三者が結節すると、情報が手順になり、支援が接触点を翻訳し、職場側の理解が継続的に更新される。",
        ],
        "freedom_degrees": [
            {
                "name": "情報の職務化自由度",
                "closed_side": "情報は伝わるが、作業手順、動線、安全確認、評価基準へ落ちない。",
                "open_side": "必要情報が職務場面ごとの手順・確認・役割へ変換される。",
            },
            {
                "name": "翻訳主体の自由度",
                "closed_side": "本人、支援者、上司、同僚の誰が翻訳するかが曖昧で、本人負荷が残る。",
                "open_side": "誰が何を、どの場面で、どこまで翻訳するかが分担される。",
            },
            {
                "name": "更新ループの自由度",
                "closed_side": "一度の説明や設備導入で止まり、変動や職務変更に追随しない。",
                "open_side": "体調、職務、評価、支援体制の変化に応じて再同期できる。",
            },
        ],
        "variation_windows": [
            {
                "condition_window": "聴覚・音声情報",
                "structural_shape": "安全確認、非公式情報、相談場面、同席支援、職務評価が結節点になりやすい。",
            },
            {
                "condition_window": "視覚情報 / 移動条件",
                "structural_shape": "案内、資料、動線、時間帯、職場説明、訓練形式が結節点になりやすい。",
            },
            {
                "condition_window": "認知・発達・知的 / 高次脳機能",
                "structural_shape": "手順分解、確認、実習、支援者の役割、本人の説明負荷が結節点になりやすい。",
            },
            {
                "condition_window": "内部障害・全身管理 / 複合条件",
                "structural_shape": "見えない健康管理、プライバシー、支援窓口、職場理解、説明境界が結節点になる。",
            },
        ],
        "boundary_counter_reading": (
            "件数は他候補より少ないため、単独の強い候補命題ではなく、複数構造をつなぐ結節候補として扱う。"
            "ただし、少数条件窓の構造を見つける価値は高い。"
        ),
        "llm_reading_gain": "この候補は、LLMが文脈を読まないと三項目へ分解されやすい。深読解で初めて、情報が職務化される結節点を追える。",
    },
]


def load_discoveries() -> dict[str, dict[str, Any]]:
    payload = json.loads(DISCOVERY_JSON.read_text(encoding="utf-8"))
    return {item["discovery_id"]: item for item in payload["discoveries"]}


def build_payload() -> dict[str, Any]:
    discoveries = load_discoveries()
    readings: list[dict[str, Any]] = []
    for reading in DEEP_READINGS:
        discovery = discoveries[reading["discovery_id"]]
        readings.append(
            {
                **reading,
                "families": discovery["families"],
                "record_count": discovery["record_count"],
                "source_counts": discovery["source_counts"],
                "status_counts": discovery["status_counts"],
                "condition_counts": discovery["condition_counts"],
                "state_counts": discovery["state_counts"],
                "read_anchor_record_ids": discovery["example_ids"],
                "review_status": "not_reviewed",
                "promotion_status": "no_promotion",
            }
        )
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "structural overlap discovery candidatesを、因果連鎖、自由度、条件窓による変形、開閉/残余状態として深読解する。"
            "人間向けの平易な説明ではなく、次の全体分析でCodexが構造を見失わないための未レビュー作業成果物。"
        ),
        "reading_basis": [
            "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18",
            "stage1-production-record-family-assignment-index-v0-2026-05-18",
            "stage1-production-bundle-d-diversity-conditioned-structure-context-reading-v0-2026-05-18",
            "stage1-production-bundle-e-info-worksite-disclosure-polarity-context-reading-v0-2026-05-18",
        ],
        "deep_readings": readings,
    }


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Overlap Deep Context Reading",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "7つのstructural overlap discovery candidatesを、因果連鎖、自由度、条件窓による変形、開閉/残余状態として深読解した。ここでは人間向けの説明しやすさより、次の全体分析でCodexが構造を浅く戻さないことを優先する。",
        "",
        "## 使い方",
        "",
        "- 候補命題を、支援の有無、障害種類、就労有無に切断しない。",
        "- 疾病・障害・機能条件は、人の分類ではなく、同じ構造自由度の形を変える条件窓として読む。",
        "- 反対読みは候補命題の否定ではなく、早合点を防ぐ別構造・境界・残余の読みとして使う。",
        "- 件数が小さい分枝は単独命題化しないが、上位構造内の変形として復活させる。",
        "",
    ]
    for reading in payload["deep_readings"]:
        examples = ", ".join(f"`{record_id}`" for record_id in reading["read_anchor_record_ids"][:10])
        families = ", ".join(f"`{family_id}`" for family_id in reading["families"])
        lines.extend(
            [
                f"## {reading['discovery_id']}",
                "",
                f"深読解名: {reading['deep_candidate_name']}",
                f"families: {families}",
                f"records: {reading['record_count']}",
                f"read anchors: {examples}",
                "",
                f"中核構造: {reading['core_structure']}",
                "",
                "### 因果連鎖",
                "",
            ]
        )
        for item in reading["causal_chain"]:
            lines.append(f"- {item}")
        lines.extend(["", "### 自由度", ""])
        for item in reading["freedom_degrees"]:
            lines.append(f"- {item['name']}: 閉じる側={item['closed_side']} / 開く側={item['open_side']}")
        lines.extend(["", "### 条件窓による変形", ""])
        for item in reading["variation_windows"]:
            lines.append(f"- {item['condition_window']}: {item['structural_shape']}")
        lines.extend(
            [
                "",
                f"境界・反対読み: {reading['boundary_counter_reading']}",
                "",
                f"LLM文脈読解の利得: {reading['llm_reading_gain']}",
                "",
            ]
        )

    lines.extend(
        [
            "## 次に効く読み",
            "",
            "- OD-01/OD-02は、現在就労中ケースの深部構造として、健康時間が価値・評価へどう翻訳されるかを読む。",
            "- OD-03/OD-07は、情報を形式ではなく、健康時間・仕事接触点・支援責任へ届く同期範囲として読む。",
            "- OD-04は、未就労・求職を本人準備不足に戻さず、入口以前参加を求人条件へ翻訳する順序として読む。",
            "- OD-05は、配慮項目を設備リストにせず、仕事接触点で健康時間・尊厳・支援がどう開閉するかを読む。",
            "- OD-06は、生活保障を背景事情ではなく、待つ・休む・治療する・選ぶ・支援につながる自由度として読む。",
            "",
            "この深読解を次の全件分析で使う時は、単独family分類ではなく、overlapが作る結節・循環・積層を発見単位にする。",
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
