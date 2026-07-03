#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
FOUR_PLACEMENT_JSON = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
FRAGMENTARY_BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
C01_DEEP_JSON = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.json"
C01_DEEP_MD = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.md"
C02_DEEP_JSON = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.json"
C02_DEEP_MD = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.md"
C03_DEEP_JSON = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.json"
C03_DEEP_MD = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.md"
C04_DEEP_JSON = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.json"
C04_DEEP_MD = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.md"
C05_3_PURE_JSON = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.json"
C05_3_PURE_MD = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.md"
C06_DEEP_JSON = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.json"
C06_DEEP_MD = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.md"
C07_C08_DEEP_JSON = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.json"
C07_C08_DEEP_MD = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.md"
OUT_JSON = RUN_DIR / "stage1-production-structural-relation-review-cards-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-relation-review-cards-v0-2026-05-18.md"


RELATION_SPECS: dict[str, dict[str, Any]] = {
    "SR-C01C03-LONGTERM-CONTINUITY": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["RU-C01-5", "RU-C03-4"],
        "branch_targets": ["P1-C01A", "P1-C01B", "P1-C01C", "P1-C03A", "P1-C03B", "P1-C03C"],
        "four_placement_targets": [
            ("C-01-health-time-work-design", "職場内解釈"),
            ("C-01-health-time-work-design", "職務代替"),
            ("C-01-health-time-work-design", "休憩"),
            ("C-01-health-time-work-design", "勤務時間"),
            ("C-03-support-access-role-fit", "継続接続"),
            ("C-03-support-access-role-fit", "役割分担"),
        ],
        "candidate_proposition": "健康条件の変化が長期継続・復職・配置に影響する場合、仕事設計側の自由度と、支援が変化局面で翻訳し直す自由度を分けて接続して読む必要がある。",
        "structural_freedoms": ["病状変化を仕事設計へ組み込む", "職務代替や配置を再設計する", "支援が就職後・復職・変化時に翻訳し直す"],
        "overinterpretation_risk": "支援継続が見えることを、支援の有効性や制度妥当性の証拠として読まない。困難の大きいケースに信号が集まっているだけかもしれない。",
        "next_analysis": "C01-5とC03-4を統合せず、長期仕事設計と支援継続接続の二層関係として同型探索を続ける。",
    },
    "SR-C03-ENTRY-VS-CONTINUITY": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["RU-C03-1", "RU-C03-4"],
        "branch_targets": ["P1-C03A", "P1-C03B", "P1-C03C"],
        "four_placement_targets": [
            ("C-03-support-access-role-fit", "相談入口"),
            ("C-03-support-access-role-fit", "継続接続"),
            ("C-03-support-access-role-fit", "役割分担"),
            ("C-03-support-access-role-fit", "支援メニュー適合"),
        ],
        "candidate_proposition": "相談入口の存在と、就職後・復職・病状変化時に支援が継続接続されることは別の自由度であり、支援アクセス一般にまとめると構造を失う。",
        "structural_freedoms": ["入口へ到達する", "入口から仕事・医療・生活へつなぐ", "変化局面で継続的に役割分担を更新する"],
        "overinterpretation_risk": "相談先を知っている/利用していることを、継続支援が成立していることと同一視しない。",
        "next_analysis": "入口で止まるケース、入口から継続へ接続するケース、継続が必要だが入口自体が弱いケースを分ける。",
    },
    "SR-C02T-BIDIRECTIONAL-TRANSLATION": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["RU-C02-T"],
        "branch_targets": ["P1-C02A", "P1-C02B"],
        "four_placement_targets": [
            ("C-02-entry-translation", "本人条件の企業語化"),
            ("C-02-entry-translation", "求人条件の生活語化"),
            ("C-02-entry-translation", "開示範囲"),
            ("C-02-entry-translation", "支援者同席"),
            ("C-02-entry-translation", "制度ステータス"),
        ],
        "candidate_proposition": "就職入口では、本人条件を企業の仕事設計言語へ翻訳する方向と、求人条件を本人の生活・健康管理条件へ翻訳する方向の両方が必要になる。",
        "structural_freedoms": ["本人条件を仕事設計言語にする", "求人・職務条件を生活条件に読み替える", "開示範囲と支援者同席を調整する", "制度ステータスを修飾因子として扱う"],
        "overinterpretation_risk": "本人条件の企業語化を本人の説明能力問題にしない。求人条件の生活語化を本人の希望調整だけにしない。",
        "next_analysis": "双方向型、求人条件優勢型、本人条件優勢型、制度修飾型を別々に同型探索する。",
    },
    "SR-C02T-C03-CONTINUITY-BRIDGE": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["RU-C02-T", "RU-C03-4"],
        "branch_targets": ["P1-C02A", "P1-C02B", "P1-C03A", "P1-C03B", "P1-C03C"],
        "four_placement_targets": [
            ("C-02-entry-translation", "本人条件の企業語化"),
            ("C-02-entry-translation", "求人条件の生活語化"),
            ("C-03-support-access-role-fit", "継続接続"),
            ("C-03-support-access-role-fit", "役割分担"),
        ],
        "candidate_proposition": "入口翻訳は一回で完了する作業ではなく、就職後・復職・病状変化・仕事内容変更の局面で再翻訳される必要がある。",
        "structural_freedoms": ["入口で相互翻訳する", "就職後に再翻訳する", "支援者・職場・医療の役割分担を更新する"],
        "overinterpretation_risk": "C02とC03の共起を、支援ニーズが大きいケースの信号過多としてだけ読める可能性を残す。",
        "next_analysis": "入口翻訳だけで閉じるケースと、継続支援へ橋が必要なケースを分ける。",
    },
    "SR-C04A-C05-WORKSITE-INFORMATION": {
        "status": "boundary_relation_candidate",
        "unit_links": ["RU-C04A-1", "RU-C04A-2", "RU-C04A-3", "RU-C05-3"],
        "branch_targets": ["P1-C04A-1", "P1-C04A-2", "P1-C04A-3", "P1-C05A", "P1-C05B", "P1-C05D"],
        "four_placement_targets": [
            ("C-04-information-participation-quality", "情報形式"),
            ("C-04-information-participation-quality", "確認可能性"),
            ("C-04-information-participation-quality", "責任所在"),
            ("C-04-information-participation-quality", "評価接続"),
            ("C-04-information-participation-quality", "本人の依頼負荷"),
            ("C-05-physical-access-worksite", "安全確認"),
            ("C-05-physical-access-worksite", "作業場所"),
            ("C-05-physical-access-worksite", "設備"),
        ],
        "candidate_proposition": "情報参加の困難は、会話や説明だけでなく、作業場所、安全確認、設備、案内形式との接点として現れることがある。",
        "structural_freedoms": ["情報形式を変える", "確認可能性を作る", "作業場所・設備を情報参加に接続する", "本人の依頼負荷を下げる"],
        "overinterpretation_risk": "C05-3を設備一般の候補命題に即復帰させない。主構造が情報参加である可能性と、C05-3-pureとして復活する可能性を分ける。",
        "next_analysis": "C04A/C05境界として保持しつつ、C05-3-pure代表・境界をLLMで読み、設備本体か情報参加の実装面かを分ける。",
    },
    "SR-C05-WORKSITE-HEALTHTIME": {
        "status": "boundary_relation_candidate",
        "unit_links": ["RU-C05-3", "RU-C01-4", "RU-C01-5"],
        "branch_targets": ["P1-C05A", "P1-C05B", "P1-C05D", "P1-C01A", "P1-C01B", "P1-C01C"],
        "four_placement_targets": [
            ("C-05-physical-access-worksite", "作業場所"),
            ("C-05-physical-access-worksite", "設備"),
            ("C-01-health-time-work-design", "休憩"),
            ("C-01-health-time-work-design", "勤務時間"),
            ("C-01-health-time-work-design", "職場内解釈"),
        ],
        "candidate_proposition": "作業場所・設備に見える問題の一部は、疲労、休息、健康管理、治療継続との接点で仕事参加の自由度を変える。",
        "structural_freedoms": ["休息を職場内で成立させる", "健康時間を作業場所と接続する", "設備を健康管理の文脈で読む"],
        "overinterpretation_risk": "設備の有無を配慮の充足や有効性として判断しない。健康時間側の構造が主である可能性がある。",
        "next_analysis": "C05-4休息・疲労境界をC01へ橋渡しし、C05-3-pure同型探索と混ぜない。",
    },
    "SR-C05-MOBILITY-WORKSITE": {
        "status": "small_but_keep_relation_candidate",
        "unit_links": ["RU-C05-1/2", "RU-C05-3"],
        "branch_targets": ["P1-C05A", "P1-C05B", "P1-C05D"],
        "four_placement_targets": [
            ("C-05-physical-access-worksite", "移動経路"),
            ("C-05-physical-access-worksite", "通勤"),
            ("C-05-physical-access-worksite", "姿勢"),
            ("C-05-physical-access-worksite", "作業場所"),
            ("C-05-physical-access-worksite", "設備"),
        ],
        "candidate_proposition": "通勤、職場内移動、姿勢、身体操作は、設備リストではなく、作業場所と仕事内容をつなぐ自由度として読む必要がある。",
        "structural_freedoms": ["移動経路を変える", "姿勢・身体操作と仕事内容を接続する", "作業場所を移動・安全確認の文脈で読む"],
        "overinterpretation_risk": "障害種類別の固定支援メニューに戻さない。移動・姿勢の信号は疲労、健康時間、生活保障、求人条件でも読める。",
        "next_analysis": "小さい枝として保持し、設備一般から切り出した同型探索を続ける。",
    },
    "SR-C06-HEALTHTIME-LIFESECURITY": {
        "status": "boundary_relation_candidate",
        "unit_links": ["RU-C01-5", "RU-C05-4", "C06L-3"],
        "branch_targets": ["P1-C06D", "P1-C01A", "P1-C01B", "P1-C01C", "P1-C05A", "P1-C05B"],
        "four_placement_targets": [
            ("C-06-life-security-work-choice", "収入保障"),
            ("C-06-life-security-work-choice", "医療費"),
            ("C-06-life-security-work-choice", "休業時保障"),
            ("C-01-health-time-work-design", "勤務時間"),
            ("C-01-health-time-work-design", "休憩"),
            ("C-01-health-time-work-design", "職場内解釈"),
        ],
        "candidate_proposition": "治療、体調変動、回復、休息、勤務継続の時間構造が生活保障と接すると、働き続ける・休む・戻る・選び直す自由度が一体で変わる。",
        "structural_freedoms": ["治療と収入維持を同時に読む", "休職・復職・短時間勤務を生活保障面と接続する", "健康時間を仕事選択条件へ翻訳する"],
        "overinterpretation_risk": "生活保障信号を、本人の就労意欲や能力、支援妥当性の判断材料にしない。設問構造や困難の大きさの反映かもしれない。",
        "next_analysis": "C01健康時間とC06生活保障を、背景と主因に分けず、接触面として同型探索する。",
    },
    "SR-C06-SUPPORT-LIFESECURITY": {
        "status": "boundary_relation_candidate",
        "unit_links": ["RU-C03-1", "RU-C03-4", "C06L-5"],
        "branch_targets": ["P1-C06C", "P1-C03A", "P1-C03B", "P1-C03C"],
        "four_placement_targets": [
            ("C-06-life-security-work-choice", "生活再建"),
            ("C-06-life-security-work-choice", "制度対象"),
            ("C-06-life-security-work-choice", "収入保障"),
            ("C-03-support-access-role-fit", "相談入口"),
            ("C-03-support-access-role-fit", "継続接続"),
            ("C-03-support-access-role-fit", "支援メニュー適合"),
        ],
        "candidate_proposition": "支援は相談資源の有無ではなく、生活保障圧力の下で、制度、収入、仕事条件、健康条件を翻訳し、選択肢を増やす橋として働く可能性。",
        "structural_freedoms": ["相談入口を生活再建へ接続する", "制度対象と仕事条件を翻訳する", "生活保障圧力下で支援の役割分担を更新する"],
        "overinterpretation_risk": "支援接続の共起を支援の有効性と読まない。困難の大きいケースに信号が集まっているだけかもしれない。",
        "next_analysis": "C03支援接続とC06生活保障を、支援資源有無ではなく橋渡し機能として読む。",
    },
    "SR-C06-TRANSITION-LIFESECURITY": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["RU-C02-T", "RU-C03-1", "C06L-2"],
        "branch_targets": ["P1-C06B", "P1-C02A", "P1-C02B", "P1-C03B"],
        "four_placement_targets": [
            ("C-06-life-security-work-choice", "生活再建"),
            ("C-06-life-security-work-choice", "雇用形態"),
            ("C-06-life-security-work-choice", "収入保障"),
            ("C-02-entry-translation", "求人条件の生活語化"),
            ("C-02-entry-translation", "本人条件の企業語化"),
            ("C-08-prework-life-readiness", "体力"),
            ("C-08-prework-life-readiness", "訓練"),
        ],
        "candidate_proposition": "未就労、離職後、再就職、職業準備では、生活保障圧力が、応募条件、訓練参加、支援利用、求人条件の翻訳を急がせたり狭めたりする可能性。",
        "structural_freedoms": ["求人条件を生活条件として読む", "応募・訓練・支援利用の順序を変える", "生活再建と仕事選択を同時に見る"],
        "overinterpretation_risk": "移行期の生活保障信号を、就労意欲や能力の不足として読まない。健康安定、地域求人、本人希望の未確定で説明できる可能性がある。",
        "next_analysis": "C06Bを入口翻訳・職業準備・支援接続の制約面として保持する。",
    },
    "SR-C06-EVALUATION-LIFESECURITY": {
        "status": "boundary_relation_candidate",
        "unit_links": ["C06L-4", "C06L-7", "RU-C04A"],
        "branch_targets": ["P1-C06E", "P1-C04A-1", "P1-C04A-2", "P1-C04A-3", "P1-C05A", "P1-C05B"],
        "four_placement_targets": [
            ("C-06-life-security-work-choice", "雇用形態"),
            ("C-06-life-security-work-choice", "制度対象"),
            ("C-07-career-evaluation-role", "評価基準"),
            ("C-07-career-evaluation-role", "処遇"),
            ("C-07-career-evaluation-role", "昇進"),
            ("C-04-information-participation-quality", "評価接続"),
            ("C-04-information-participation-quality", "責任所在"),
        ],
        "candidate_proposition": "評価、処遇、役割、制度ステータス、情報参加、仕事参加接触点が生活保障と接すると、キャリア参加と収入維持の自由度が同時に問題化する可能性。",
        "structural_freedoms": ["評価基準を情報参加へ接続する", "処遇と生活保障を切り離さず読む", "制度ステータスを主因でなく修飾因子として扱う"],
        "overinterpretation_risk": "評価・処遇の信号を、一般的な職場満足や雇用形態の不満へ丸めない。反対に生活保障へ吸収しすぎない。",
        "next_analysis": "C06Eを評価・処遇・情報参加・生活保障の境界エッジとして保持する。",
    },
    "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT": {
        "status": "structural_blind_spot_relation_candidate",
        "unit_links": ["C07R-1", "C07R-2", "C07R-4"],
        "branch_targets": ["P1-C06E", "P1-C04B", "P1-C05E"],
        "four_placement_targets": [
            ("C-07-career-evaluation-role", "評価基準"),
            ("C-07-career-evaluation-role", "役割拡大"),
            ("C-07-career-evaluation-role", "技能習得"),
            ("C-07-career-evaluation-role", "処遇"),
            ("C-07-career-evaluation-role", "昇進"),
            ("C-07-career-evaluation-role", "働きがい"),
            ("C-07-career-evaluation-role", "定着"),
            ("C-04-information-participation-quality", "評価接続"),
            ("C-04-information-participation-quality", "責任所在"),
        ],
        "candidate_proposition": "評価、役割、処遇、昇進、働きがい、定着は、問題側が薄くても、情報参加と生活保障に接続する仕事参加の質として保持する必要がある。",
        "structural_freedoms": ["評価基準を仕事参加へ接続する", "役割拡大と情報参加をつなぐ", "処遇・定着を生活保障面と接続する"],
        "overinterpretation_risk": "C07に見える信号は、C04情報参加やC06生活保障の副次的境界にすぎない可能性がある。昇進・満足を過剰に目的化しない。",
        "next_analysis": "C07を調査設計が拾いにくい上方向の参加自由度として保持し、外部資料・workshopから反対側と軽減側を補う。",
    },
    "SR-C08-PREWORK-ENTRY-TRANSLATION": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["C08P-1", "C08P-3", "RU-C02-T", "RU-C03-1"],
        "branch_targets": ["P1-C06B", "P1-C02B", "P1-C03B"],
        "four_placement_targets": [
            ("C-08-prework-life-readiness", "生活リズム"),
            ("C-08-prework-life-readiness", "体力"),
            ("C-08-prework-life-readiness", "日中活動"),
            ("C-08-prework-life-readiness", "家族支援"),
            ("C-08-prework-life-readiness", "地域生活"),
            ("C-08-prework-life-readiness", "訓練"),
            ("C-08-prework-life-readiness", "就労自信"),
            ("C-02-entry-translation", "求人条件の生活語化"),
            ("C-03-support-access-role-fit", "相談入口"),
        ],
        "candidate_proposition": "生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信は、本人の準備不足ではなく、求人条件・支援条件・生活条件を入口へ翻訳する前段自由度として現れる。",
        "structural_freedoms": ["生活条件を求人条件へ翻訳する", "日中活動・訓練を入口支援へ接続する", "就労自信を個人特性でなく構造結果として読む"],
        "overinterpretation_risk": "就労前参加を本人責任化しない。反対に、本人の非就労志向や別の生活価値を仕事参加へ過剰に回収しない。",
        "next_analysis": "C08を入口翻訳の前段構造として使い、C02/C03/C06との接続と境界を分ける。",
    },
    "SR-C08-PASTWORK-LIFE-REBUILDING": {
        "status": "reviewable_relation_candidate",
        "unit_links": ["C08P-2", "RU-C01-3", "RU-C02-T", "RU-C03-4"],
        "branch_targets": ["P1-C01C", "P1-C02B", "P1-C03B", "P1-C06B"],
        "four_placement_targets": [
            ("C-08-prework-life-readiness", "体力"),
            ("C-08-prework-life-readiness", "日中活動"),
            ("C-08-prework-life-readiness", "訓練"),
            ("C-08-prework-life-readiness", "就労自信"),
            ("C-01-health-time-work-design", "職務代替"),
            ("C-02-entry-translation", "求人条件の生活語化"),
            ("C-03-support-access-role-fit", "継続接続"),
        ],
        "candidate_proposition": "過去就労で健康時間、入口翻訳、支援接続の未整合が重なると、再就職前に生活再構築、体力、日中活動、就労自信の自由度として現れる可能性がある。",
        "structural_freedoms": ["過去就労困難を生活再構築へ翻訳する", "体力・日中活動を健康時間と分けて読む", "再就職入口への戻り方を設計する"],
        "overinterpretation_risk": "過去就労困難の大きさを、生活再構築構造として読み過ぎない。C01/C02/C03の持ち越しで説明できる場合がある。",
        "next_analysis": "過去就労困難を単なる持ち越しにせず、就労前参加へ変換される構造として保持する。",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def summarize_fragmentary(branch_targets: list[str], links: list[dict[str, Any]]) -> dict[str, Any]:
    target_set = set(branch_targets)
    family_counts: Counter[str] = Counter()
    for link in links:
        search_targets = set(link.get("candidate_branch_search_targets", [])) | set(link.get("boundary_tag_search_targets", []))
        if target_set & search_targets:
            family_counts[link["source_family"]] += 1
    return {"count": sum(family_counts.values()), "family_counts": dict(family_counts)}


def summarize_four_placement(targets: list[tuple[str, str]], candidates: list[dict[str, Any]]) -> dict[str, Any]:
    target_set = set(targets)
    rows = [
        candidate
        for candidate in candidates
        if (candidate["contact_id"], candidate["freedom"]) in target_set
    ]
    readiness_counts: Counter[str] = Counter(row["readiness"] for row in rows)
    totals = Counter()
    diversity = Counter()
    adjustment = Counter()
    for row in rows:
        totals["problem"] += row["problem_count"]
        totals["mitigation"] += row["mitigation_count"]
        totals["residual"] += row["residual_count"]
        totals["boundary"] += row["boundary_count"]
        diversity.update(row.get("diversity_anchor_counts", {}))
        adjustment.update(row.get("adjustment_signal_counts", {}))
    compact_rows = [
        {
            "contact_id": row["contact_id"],
            "freedom": row["freedom"],
            "readiness": row["readiness"],
            "problem_count": row["problem_count"],
            "mitigation_count": row["mitigation_count"],
            "residual_count": row["residual_count"],
            "boundary_count": row["boundary_count"],
            "problem_ids": row["problem_ids"][:5],
            "mitigation_ids": row["mitigation_ids"][:5],
            "residual_ids": row["residual_ids"][:5],
            "boundary_ids": row["boundary_ids"][:5],
        }
        for row in rows
    ]
    return {
        "freedom_count": len(rows),
        "readiness_counts": dict(readiness_counts),
        "placement_totals": dict(totals),
        "top_diversity_anchors": diversity.most_common(6),
        "top_adjustment_signals": adjustment.most_common(6),
        "rows": compact_rows,
    }


def build_cards() -> dict[str, Any]:
    relation_map = load_json(RELATION_JSON)
    four_placement = load_json(FOUR_PLACEMENT_JSON)["four_placement_candidates"]
    bridge = load_json(FRAGMENTARY_BRIDGE_JSON)
    c01_deep = load_json(C01_DEEP_JSON) if C01_DEEP_JSON.exists() else None
    c02_deep = load_json(C02_DEEP_JSON) if C02_DEEP_JSON.exists() else None
    c03_deep = load_json(C03_DEEP_JSON) if C03_DEEP_JSON.exists() else None
    c04_deep = load_json(C04_DEEP_JSON) if C04_DEEP_JSON.exists() else None
    c05_pure = load_json(C05_3_PURE_JSON) if C05_3_PURE_JSON.exists() else None
    c06_deep = load_json(C06_DEEP_JSON) if C06_DEEP_JSON.exists() else None
    c07_c08_deep = load_json(C07_C08_DEEP_JSON) if C07_C08_DEEP_JSON.exists() else None
    relation_by_id = {relation["relation_id"]: relation for relation in relation_map["relations"]}
    cards = []
    for relation_id, spec in RELATION_SPECS.items():
        relation = relation_by_id[relation_id]
        cards.append(
            {
                **relation,
                **spec,
                "fragmentary_slot_summary": summarize_fragmentary(spec["branch_targets"], bridge["fragmentary_source_links"]),
                "four_placement_summary": summarize_four_placement(spec["four_placement_targets"], four_placement),
                "raw_or_redacted_text_included": False,
                "review_status": "not_reviewed",
                "promotion_status": "no_promotion",
                "non_judgment_hold": "医学的妥当性、法的評価、HR・雇用管理上の正否、合理的配慮充足、支援妥当性、就労可否は判断しない。",
            }
        )
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "card_count": len(cards),
        "c01_health_time_deep_reading": {
            "markdown": str(C01_DEEP_MD.relative_to(ROOT)),
            "json": str(C01_DEEP_JSON.relative_to(ROOT)),
            "summary": c01_deep.get("interpretive_result") if c01_deep else "not_available",
        },
        "c02_translation_deep_reading": {
            "markdown": str(C02_DEEP_MD.relative_to(ROOT)),
            "json": str(C02_DEEP_JSON.relative_to(ROOT)),
            "summary": c02_deep.get("interpretive_result") if c02_deep else "not_available",
        },
        "c03_support_continuity_deep_reading": {
            "markdown": str(C03_DEEP_MD.relative_to(ROOT)),
            "json": str(C03_DEEP_JSON.relative_to(ROOT)),
            "summary": c03_deep.get("interpretive_result") if c03_deep else "not_available",
        },
        "c04_information_participation_deep_reading": {
            "markdown": str(C04_DEEP_MD.relative_to(ROOT)),
            "json": str(C04_DEEP_JSON.relative_to(ROOT)),
            "summary": c04_deep.get("interpretive_result") if c04_deep else "not_available",
        },
        "c05_3_pure_deep_reading": {
            "markdown": str(C05_3_PURE_MD.relative_to(ROOT)),
            "json": str(C05_3_PURE_JSON.relative_to(ROOT)),
            "summary": c05_pure.get("interpretive_result") if c05_pure else "not_available",
        },
        "c06_life_security_deep_reading": {
            "markdown": str(C06_DEEP_MD.relative_to(ROOT)),
            "json": str(C06_DEEP_JSON.relative_to(ROOT)),
            "summary": c06_deep.get("interpretive_result") if c06_deep else "not_available",
        },
        "c07_c08_participation_deep_reading": {
            "markdown": str(C07_C08_DEEP_MD.relative_to(ROOT)),
            "json": str(C07_C08_DEEP_JSON.relative_to(ROOT)),
            "summary": c07_c08_deep.get("scientific_discovery_candidate") if c07_c08_deep else "not_available",
        },
        "cards": cards,
    }


def format_counts(counts: dict[str, int]) -> str:
    if not counts:
        return "なし"
    return ", ".join(f"{key}: {value}" for key, value in counts.items())


def format_ids(ids: list[str]) -> str:
    return ", ".join(f"`{item}`" for item in ids) if ids else "なし"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Relation Review Cards",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "このカード群は、単独のパターン候補ではなく、SCIMA/FCHMAの構造的自由度として読むべき関係をまとめたもの。人間レビューで見る対象は、支援や配慮の正否ではなく、構造としてこの切り方が有益かどうかである。",
        "",
        f"relation card数: {payload['card_count']}",
        f"C01 health time deep reading: `{payload['c01_health_time_deep_reading']['markdown']}`",
        f"C02 translation deep reading: `{payload['c02_translation_deep_reading']['markdown']}`",
        f"C03 support continuity deep reading: `{payload['c03_support_continuity_deep_reading']['markdown']}`",
        f"C04 information participation deep reading: `{payload['c04_information_participation_deep_reading']['markdown']}`",
        f"C05-3 pure deep reading: `{payload['c05_3_pure_deep_reading']['markdown']}`",
        f"C06 life security deep reading: `{payload['c06_life_security_deep_reading']['markdown']}`",
        f"C07/C08 participation deep reading: `{payload['c07_c08_participation_deep_reading']['markdown']}`",
        "",
    ]
    for card in payload["cards"]:
        placement = card["four_placement_summary"]
        fragmentary = card["fragmentary_slot_summary"]
        lines.extend(
            [
                f"## {card['relation_id']} {card['title']}",
                "",
                f"状態: {card['status']}",
                f"接続unit: {', '.join(f'`{unit}`' for unit in card['unit_links'])}",
                f"record数: {card['record_count']}",
                f"代表ID: {format_ids(card['representative_ids'])}",
                f"境界ID: {format_ids(card['boundary_ids'])}",
                "",
                f"候補命題: {card['candidate_proposition']}",
                "",
                "構造的自由度:",
            ]
        )
        for freedom in card["structural_freedoms"]:
            lines.append(f"- {freedom}")
        lines.extend(
            [
                "",
                f"読み: {card['reading']}",
                "",
                f"反対読み: {card['counter_reading']}",
                "",
                f"過剰解釈リスク: {card['overinterpretation_risk']}",
                "",
                f"断片資料スロット: {fragmentary['count']}件 ({format_counts(fragmentary['family_counts'])})",
                "自由度配置サマリ:",
                f"- readiness: {format_counts(placement['readiness_counts'])}",
                f"- problem/residual/mitigation/boundary: {format_counts(placement['placement_totals'])}",
                f"- 多様性アンカー濃淡: {', '.join(f'{key}:{value}' for key, value in placement['top_diversity_anchors']) or 'なし'}",
                f"- 調整・修飾シグナル濃淡: {', '.join(f'{key}:{value}' for key, value in placement['top_adjustment_signals']) or 'なし'}",
                "",
                "| freedom | readiness | problem | mitigation | residual | boundary |",
                "|---|---|---:|---:|---:|---:|",
            ]
        )
        for row in placement["rows"]:
            lines.append(
                f"| {row['contact_id']} / {row['freedom']} | {row['readiness']} | {row['problem_count']} | {row['mitigation_count']} | {row['residual_count']} | {row['boundary_count']} |"
            )
        lines.extend(
            [
                "",
                f"非判断留保: {card['non_judgment_hold']}",
                "",
                f"次の分析: {card['next_analysis']}",
                "",
            ]
        )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    payload = build_cards()
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
