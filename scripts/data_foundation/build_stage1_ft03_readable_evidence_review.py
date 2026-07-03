#!/usr/bin/env python3
"""Build a human-readable FT03 Evidence/Validity review surface.

The previous EV scaffold exposed compressed internal route-matrix claims. This
script turns those claims into reviewable human propositions. It treats any
partially filled prior result as usability feedback only, not as source/support
validity movement.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
DOWNLOAD_RESULT = Path(
    "/Users/YuichiroHARUNA/Downloads/"
    "stage1-production-ft03-evidence-validity-review-result-filled-v0-2026-05-26.json"
)

MATRIX_JSON = RUN_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.json"
OLD_LEDGER_JSON = RUN_DIR / "stage1-production-ft03-evidence-support-claim-ledger-v0-2026-05-26.json"

PREFIX = "stage1-production-ft03-evidence-validity-readable-review-units-v0-2026-05-26"
FAILURE_PREFIX = "stage1-production-ft03-evidence-validity-review-usability-failure-intake-v0-2026-05-26"
TOOL_PREFIX = "stage1-production-ft03-evidence-validity-readable-review-tool-v0-2026-05-26"

UNITS_MD = RUN_DIR / f"{PREFIX}.md"
UNITS_JSON = RUN_DIR / f"{PREFIX}.json"
FAILURE_MD = RUN_DIR / f"{FAILURE_PREFIX}.md"
FAILURE_JSON = RUN_DIR / f"{FAILURE_PREFIX}.json"
TOOL_HTML = RUN_DIR / f"{TOOL_PREFIX}.html"

DATE = "2026-05-26"

PROHIBITED_MARKERS = [
    "_x000D_",
    "PERSON_NAME",
    "MEDICAL_INSTITUTION",
    "raw_quote",
    "candidate_pattern_promoted",
]

MUST_NOT_MOVE = [
    "source/support validity",
    "public_safe/public_approved",
    "runtime_approved",
    "candidate_pattern",
    "Domain Core",
    "Atlas / 27-frame",
    "medical/legal/employment/accommodation/support finality",
    "individual case judgment",
]


ROUTE_REPAIRS: dict[str, dict[str, Any]] = {
    "QR-01-health-time-work-design": {
        "short_id": "R01",
        "title": "健康時間を仕事設計の問題として読む",
        "core_statement": "Falconは、体調・通院・疲労・休息・復帰を、本人の体調管理だけでなく、勤務時間、負荷、移動、休職、収入、評価、将来の働き方の再設計と結びつく構造仮説として扱ってよい。",
        "why_it_matters": "体調情報を医学的重症度や就労可能性に直結させず、仕事条件と生活条件のどこを確認すべきかに変換できる。",
        "source_plain": [
            "支援者側資料からは、遠隔・電話などが移動や体調負荷を下げる一方で、本人の困りごとや働きぶりを周囲が理解する機会が薄くなる場合がある、という見方が出ている。",
            "職場側資料からは、症状の変動、休職、賃金低下、将来の働き方の相談が、職場内の相談線や調整の場と結びつく可能性が見える。",
            "NIVR・workshop由来の資料からは、健康、生活、入口支援、長期継続を分けずに読む必要が示されている。",
        ],
        "allowed_use": [
            "体調情報が出たとき、仕事量・休息・移動・収入・評価・復帰や将来相談を確認する質問を作る。",
            "本人説明だけで閉じず、誰が職場側へ翻訳しているかを確認する。",
        ],
        "not_allowed": [
            "変動性や進行性だけから、職務能力や採用困難性を判定する。",
            "遠隔支援や柔軟勤務を常に有効な解決策として扱う、または逆に選択肢から除外する。",
        ],
        "guardrail_rewrite": "変動性・進行性・遠隔支援・柔軟勤務は重要な検討要因として残す。ただし、それだけで能力、採用困難性、支援妥当性を決めない。",
    },
    "QR-02-information-work-procedure": {
        "short_id": "R02",
        "title": "情報共有を仕事手順・安全・評価へつなげて読む",
        "core_statement": "Falconは、情報共有を量の問題ではなく、本人同意、共有範囲、職場での使われ方、仕事手順、安全、評価、人事との接続として扱ってよい。",
        "why_it_matters": "開示するかしないかだけでなく、共有された情報が仕事のどの場面で役立つ形に変換されているかを確認できる。",
        "source_plain": [
            "支援者側資料からは、開示が不利益回避、相談先、本人同意と結びつく必要が見える。",
            "職場側資料からは、本人説明、職場観察、プライバシー、必要確認のずれが生じうることが見える。",
            "workshop由来の資料からは、関係者の間で情報を再翻訳する必要が示されている。",
        ],
        "allowed_use": [
            "誰に、どこまで、どの目的で情報を共有したかを整理する質問を作る。",
            "情報が実際の仕事手順、安全、評価に届いているかを見る。",
        ],
        "not_allowed": [
            "開示量を増やせばよいと扱う。",
            "本人か職場のどちらが正しいかを判定する。",
            "差別認定や法的判断をする。",
        ],
        "guardrail_rewrite": "情報共有は最大化ではなく、本人同意と仕事上の必要性に沿って設計するものとして扱う。",
    },
    "QR-03-worksite-contact-and-mobility": {
        "short_id": "R03",
        "title": "配慮名ではなく職場の接触点を分解する",
        "core_statement": "Falconは、働きにくさや工夫を、抽象的な配慮名ではなく、作業、道具、安全、顧客対応、人員余力、欠勤代替、求人表示などの具体的な接触点として扱ってよい。",
        "why_it_matters": "支援や配慮を一般論にせず、どの仕事場面で相互作用が起きているかを見つけられる。",
        "source_plain": [
            "職場側資料からは、小規模職場、現場作業、安全、顧客対応、欠勤代替、未経験職場での想定困難が見える。",
            "支援者側資料からは、企業説明や入口での翻訳が職場の具体的な接触点に届く必要が見える。",
            "workshop由来の資料からは、関係者の役割分担が職場接触点の設計に影響することが見える。",
        ],
        "allowed_use": [
            "仕事名ではなく、身体動作、情報、道具、安全、顧客、代替人員などを分けて質問する。",
            "柔軟制度や支援制度が実際の仕事接触点に届いているかを見る。",
        ],
        "not_allowed": [
            "職場側の不安を、そのまま妥当性や偏見認定にする。",
            "設備や職務調整の有無から本人能力を判定する。",
        ],
        "guardrail_rewrite": "職場側の不安は判断材料ではなく、接触点を明らかにするための手がかりとして扱う。",
    },
    "QR-04-life-security-sequencing": {
        "short_id": "R04",
        "title": "生活保障を就労支援の外側に置かない",
        "core_statement": "Falconは、収入、医療費、休職、賃金低下、制度カテゴリ、家族支援を、待つ、休む、戻る、選び直す自由度に関わる構造として扱ってよい。",
        "why_it_matters": "仕事継続の問題を、本人の意欲や職場調整だけでなく、生活上の選択肢が閉じる順序として読める。",
        "source_plain": [
            "支援者側資料からは、制度カテゴリや企業説明の難しさが、入口支援と生活保障を同時に狭める可能性が見える。",
            "職場側資料からは、休職、短時間勤務、賃金低下、医療費、生活不安が就労継続と絡む可能性が見える。",
            "NIVR・workshop由来の資料からは、医療、生活、就労継続を切り離さない視点が示されている。",
        ],
        "allowed_use": [
            "休めるか、待てるか、戻れるか、選び直せるかを確認する質問を作る。",
            "健康時間や職場接触点を、生活保障が支えているかを見る。",
        ],
        "not_allowed": [
            "現行制度の利用可能性を判定する。",
            "給付や制度の法的判断をする。",
            "雇用継続や満足度から生活保障が解決済みだと推定する。",
        ],
        "guardrail_rewrite": "生活保障は制度解説ではなく、選択肢が開くか閉じるかを見る観点として使う。",
    },
    "QR-05-entry-prework-translation": {
        "short_id": "R05",
        "title": "就職前から開始後までを一続きに読む",
        "core_statement": "Falconは、求人、職場体験、訓練、生活リズム、自己理解、開始後支援を、就職前から開始後までつながる参加過程として扱ってよい。",
        "why_it_matters": "未就労や訓練段階を準備不足と見なさず、何が仕事条件へ翻訳されていないかを確認できる。",
        "source_plain": [
            "支援者側資料からは、就職前体験、自己理解、ストレス把握、支援者による企業説明の重要性が見える。",
            "職場側資料からは、求人表示、柔軟制度の見え方、未経験職場での想定困難が見える。",
            "workshop由来の資料からは、早期情報から長期継続までの段階をつなぐ必要が見える。",
        ],
        "allowed_use": [
            "入口前後で、仕事像、求人表示、支援役割、開始後の戻り回路がつながっているかを質問する。",
            "制度カテゴリや病名が入口でどう作用しているかを条件窓として扱う。",
        ],
        "not_allowed": [
            "未就労や訓練段階を準備不足と判定する。",
            "開示済みや訓練参加だけで入口問題が解決済みと扱う。",
        ],
        "guardrail_rewrite": "入口の問題は本人の準備だけでなく、仕事条件への翻訳不足としても検討する。",
    },
    "QR-06-disclosure-boundary-and-mutual-translation": {
        "short_id": "R06",
        "title": "開示を相互翻訳と安全境界として扱う",
        "core_statement": "Falconは、開示を言う・言わないの二択ではなく、本人同意、職場理解、支援者仲介、不利益回避、問題時の相談線を含む相互翻訳の問題として扱ってよい。",
        "why_it_matters": "開示の正解を決めずに、どの情報がどの仕事条件へ安全に届いているかを確認できる。",
        "source_plain": [
            "支援者側資料からは、開示後の不利益、相談線、本人同意、企業説明の境界が見える。",
            "職場側資料からは、プライバシー、観察、必要確認、情報管理のずれが見える。",
            "NIVR由来の資料からは、医療情報を職務条件へ翻訳する責任と限界が見える。",
        ],
        "allowed_use": [
            "開示量ではなく、情報が仕事手順、評価、安全、休息、通院にどうつながったかを質問する。",
            "本人、支援者、職場の正誤ではなく、翻訳が止まった場所を探す。",
        ],
        "not_allowed": [
            "開示すべきかどうかを最終判断する。",
            "非開示や開示を成功戦略として一般化する。",
            "差別、法的妥当性、個別配慮妥当性を判断する。",
        ],
        "guardrail_rewrite": "開示は、本人同意と不利益回避を前提に、仕事条件へ安全につなぐ設計課題として扱う。",
    },
    "QR-07-quality-career-and-value-translation": {
        "short_id": "R07",
        "title": "働けているかだけでなく参加の質を見る",
        "core_statement": "Falconは、就労継続や満足度だけでなく、役割、評価、処遇、学習、将来見通し、キャリア再設計を参加の質として扱ってよい。",
        "why_it_matters": "定着や継続を成功証明にせず、その人の役割や将来が開いているかを確認できる。",
        "source_plain": [
            "職場側資料からは、将来変化を本人を傷つけずに話す仲介線の必要性が見える。",
            "支援者側資料からは、組織目的、評価、財源が支援者の翻訳容量に影響することが見える。",
            "NIVR由来の資料からは、ライフコースや中高年期を含む参加品質の視点が見える。",
        ],
        "allowed_use": [
            "役割、評価、処遇、学習、将来見通しについて質問する。",
            "健康時間、支援連続性、職場接触点、生活保障を通して参加の質を見る。",
        ],
        "not_allowed": [
            "満足度、勤続、好事例、処遇を成功証明にする。",
            "好事例を汎用処方にする。",
        ],
        "guardrail_rewrite": "参加の質は、成功証明ではなく、役割・評価・将来の自由度を確認する観点として使う。",
    },
    "QR-08-condition-window-not-lookup": {
        "short_id": "R08",
        "title": "病名・障害名を答えではなく条件窓として使う",
        "core_statement": "Falconは、病名、障害名、制度カテゴリ、年齢、地域、職場規模を、配慮や困難性の答えではなく、相互作用を見えやすくする条件窓として扱ってよい。",
        "why_it_matters": "条件名をタブーにせず、共通構造と、その条件下でだけ見える特殊構造を分けて扱える。",
        "source_plain": [
            "支援者側資料からは、制度カテゴリや制度外性が入口、生活保障、企業説明を変える可能性が見える。",
            "職場側資料からは、職場規模、業種、未経験、職場の多様性理解が相互作用に影響する可能性が見える。",
            "NIVR・workshop由来の資料からは、疾患希少性、地域、ライフコースを境界テストとして扱う必要が見える。",
        ],
        "allowed_use": [
            "条件名がどの相互作用を見えやすくしているかを質問する。",
            "共通構造と条件下でだけ見える構造を分ける。",
        ],
        "not_allowed": [
            "病名から配慮、困難性、能力、支援必要性を直接推定する。",
            "条件名をタブー化して、重要な相互作用情報を捨てる。",
            "古いカテゴリ情報や地域差を現行判断に使う。",
        ],
        "guardrail_rewrite": "条件名は使う。ただし、配慮や能力の答えではなく、相互作用を検討する入口として使う。",
    },
}


def validate(payload: Any) -> None:
    text = payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False)
    for marker in PROHIBITED_MARKERS:
        if marker in text:
            raise SystemExit(f"prohibited marker found: {marker}")


def read_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    validate(payload)
    return payload


def write_json(path: Path, payload: dict[str, Any]) -> None:
    validate(payload)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_md(path: Path, text: str) -> None:
    validate(text)
    path.write_text(text, encoding="utf-8")


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def analyze_prior_result() -> dict[str, Any]:
    if not DOWNLOAD_RESULT.exists():
        return {
            "artifact_id": FAILURE_PREFIX,
            "date": DATE,
            "status": "prior result not found / no usability intake",
            "prior_result_path": str(DOWNLOAD_RESULT),
            "usable_as_validity_review": False,
        }
    result = read_json(DOWNLOAD_RESULT)
    rows = result.get("results", {})
    notes = [row.get("review_note", "") for row in rows.values() if row.get("review_note")]
    marks = Counter()
    for row in rows.values():
        for key in ["trace_mark", "source_validity_mark", "support_validity_mark", "boundary_mark"]:
            value = row.get(key)
            if value:
                marks[f"{key}:{value}"] += 1
    issue_counts = {
        "meaning_unclear": sum("意味" in note or "分から" in note for note in notes),
        "compressed_causality": sum("因果" in note or "言葉足らず" in note for note in notes),
        "meta_not_reviewable": sum("source family" in note or "関係のない" in note for note in notes),
        "over_negation": sum("否定" in note or "選択肢" in note or "予測" in note for note in notes),
    }
    return {
        "artifact_id": FAILURE_PREFIX,
        "date": DATE,
        "lane": "Falcon / Falcon Lab",
        "status": "usability failure intake / prior EV result treated as review-surface feedback only",
        "prior_result_path": str(DOWNLOAD_RESULT),
        "filled_items": len(rows),
        "notes_with_text": len(notes),
        "mark_counts": dict(sorted(marks.items())),
        "issue_counts": issue_counts,
        "diagnosis": [
            "旧EVレビュー面は、内部分析者向けの圧縮claimを人間レビュー対象として出していた。",
            "source_lens_additionには、Evidence/Validityで判断すべき命題ではなく、生成過程のメタ記述が混ざっていた。",
            "複数の変数が関係づけを説明されないまま列挙され、人間が何を承認・保留すべきか分からない項目があった。",
            "brake文が『それだけで判断しない』ではなく『使ってはいけない』という過剰否定に見えた。",
        ],
        "decision": "この途中結果はsource/support validity marksとして消費しない。レビュー面の usability failure としてのみ取り込む。",
        "must_not_move": MUST_NOT_MOVE,
    }


def route_original_items(route: dict[str, Any]) -> dict[str, Any]:
    return {
        "expert_function": route.get("expert_function"),
        "source_lens_additions": route.get("ft03_source_lens_addition", []),
        "route_moves": route.get("route_moves", []),
        "brakes": route.get("brakes", []),
    }


def build_units(matrix: dict[str, Any]) -> list[dict[str, Any]]:
    routes = {route["route_id"]: route for route in matrix["routes"]}
    units: list[dict[str, Any]] = []
    for route_id, repair in ROUTE_REPAIRS.items():
        route = routes[route_id]
        base = {
            "route_id": route_id,
            "route_short_id": repair["short_id"],
            "route_title": repair["title"],
            "core_axis": route.get("core_axis", []),
            "source_artifact": rel(MATRIX_JSON).replace(".json", ".md"),
            "original_internal_items_for_trace_only": route_original_items(route),
            "source_validity_state": "not_reviewed",
            "support_validity_state": "not_reviewed",
            "public_use_state": "not_public_safe_or_public_approved",
            "runtime_use_state": "not_runtime_approved",
            "must_not_move": MUST_NOT_MOVE,
        }
        units.append(
            {
                **base,
                "unit_id": f"EV2-{repair['short_id']}-A-core-proposition",
                "unit_kind": "core_proposition",
                "review_title": repair["title"],
                "review_statement": repair["core_statement"],
                "why_it_matters": repair["why_it_matters"],
                "reviewer_decides": [
                    "この命題は、人間が理解できる文として成立しているか。",
                    "内部構造仮説として使うには、射程が広すぎないか。",
                    "病名・障害名から配慮や困難性へ直行していないか。",
                ],
                "if_accepted_allows": "Falconがこのrouteを内部の見立て・質問生成の入口として使える。",
                "if_held_repair": "文言をさらに具体化するか、source rereadに戻す。",
            }
        )
        units.append(
            {
                **base,
                "unit_id": f"EV2-{repair['short_id']}-B-source-basis",
                "unit_kind": "source_basis",
                "review_title": f"{repair['title']}の根拠の見方",
                "review_statement": "次のsource lensの読み方を、根拠の上下関係ではなく、部分視点の束として扱ってよいか。",
                "source_basis_plain": repair["source_plain"],
                "reviewer_decides": [
                    "どのsource lensが何を支えているか理解できるか。",
                    "source lensから言える範囲を超えていないか。",
                    "原資料・派生成果物の再読が必要なsource lensはあるか。",
                ],
                "if_accepted_allows": "このrouteを複数source lensの比較材料として使える。",
                "if_held_repair": "source lens別に再読し、根拠の範囲を狭めて書き直す。",
            }
        )
        units.append(
            {
                **base,
                "unit_id": f"EV2-{repair['short_id']}-C-use-boundary",
                "unit_kind": "use_boundary",
                "review_title": f"{repair['title']}をFalconがどう使ってよいか",
                "review_statement": "このrouteは、支援や配慮の妥当性を判断するためではなく、追加で確認すべき文脈や反対仮説を出すために使う。",
                "allowed_use": repair["allowed_use"],
                "not_allowed": repair["not_allowed"],
                "reviewer_decides": [
                    "許される使い方が、質問生成と構造仮説に留まっているか。",
                    "支援・配慮・制度・職場対応の妥当性判断に見える箇所はないか。",
                    "個別ケース判断や法的・医学的判断に滑らないか。",
                ],
                "if_accepted_allows": "内部エージェントがこのrouteを回答の観点として使える。",
                "if_held_repair": "allowed_use/not_allowedをさらに具体化し、support validity reviewへ送る箇所を分ける。",
            }
        )
        units.append(
            {
                **base,
                "unit_id": f"EV2-{repair['short_id']}-D-guardrail",
                "unit_kind": "guardrail",
                "review_title": f"{repair['title']}のブレーキ表現",
                "review_statement": repair["guardrail_rewrite"],
                "reviewer_decides": [
                    "過剰推論を止める表現になっているか。",
                    "重要な検討要因まで捨てる過剰否定になっていないか。",
                    "Falconが実際に使う文として分かりやすいか。",
                ],
                "if_accepted_allows": "旧brake文をこの表現へ置き換える候補にできる。",
                "if_held_repair": "ブレーキ文を『使わない』ではなく『それだけで判断しない』形へ再修正する。",
            }
        )
    return units


def build_units_payload(units: list[dict[str, Any]], failure: dict[str, Any]) -> dict[str, Any]:
    counts = Counter(unit["unit_kind"] for unit in units)
    return {
        "artifact_id": PREFIX,
        "date": DATE,
        "lane": "Falcon / Falcon Lab",
        "status": "human-readable evidence-validity review units / review input only / no validity decision",
        "position": "旧78-claim台帳を人間レビュー対象としては不適切と扱い、8route x 4種類の理解可能なreview unitへ再構成したもの。",
        "supersedes_for_human_review": [
            rel(RUN_DIR / "stage1-production-ft03-evidence-support-claim-ledger-v0-2026-05-26.md"),
            rel(RUN_DIR / "stage1-production-ft03-evidence-validity-review-tool-v0-2026-05-26.html"),
        ],
        "does_not_delete_or_invalidate_as_trace": "旧78-claim台帳は内部trace素材として残すが、人間validity reviewの主対象にはしない。",
        "prior_partial_result_handling": failure["decision"],
        "unit_count": len(units),
        "unit_counts_by_kind": dict(sorted(counts.items())),
        "recommended_order": [
            "core_proposition",
            "source_basis",
            "use_boundary",
            "guardrail",
        ],
        "units": units,
        "outputs": {
            "readable_units_md": rel(UNITS_MD),
            "readable_units_json": rel(UNITS_JSON),
            "readable_review_tool_html": rel(TOOL_HTML),
            "usability_failure_intake_md": rel(FAILURE_MD),
            "usability_failure_intake_json": rel(FAILURE_JSON),
        },
        "must_not_move": MUST_NOT_MOVE,
    }


def render_failure_md(failure: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Evidence / Validity Review Usability Failure Intake",
        "",
        f"作成日: {DATE}",
        "Lane: Falcon / Falcon Lab",
        "Status: usability failure intake / no validity movement",
        "",
        "## Position",
        "",
        "途中まで入力された旧Evidence/Validityレビュー結果は、source/support validityの判断として消費しない。レビュー面そのものが人間に理解しにくいという設計問題を示すフィードバックとして扱う。",
        "",
        "## What Was Learned",
        "",
        *[f"- {item}" for item in failure.get("diagnosis", [])],
        "",
        "## Prior Result Counts",
        "",
        f"- Filled items: {failure.get('filled_items', 0)}",
        f"- Notes with text: {failure.get('notes_with_text', 0)}",
        f"- Issue counts: `{json.dumps(failure.get('issue_counts', {}), ensure_ascii=False)}`",
        "",
        "## Decision",
        "",
        failure.get("decision", ""),
        "",
        "## Must Not Move",
        "",
        *[f"- {item}" for item in MUST_NOT_MOVE],
        "",
        f"JSON: `{rel(FAILURE_JSON)}`",
        "",
    ]
    return "\n".join(lines)


def render_units_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Human-Readable Evidence / Validity Review Units",
        "",
        f"作成日: {DATE}",
        "Lane: Falcon / Falcon Lab",
        "Status: human-readable review input / no validity decision",
        "",
        "## Position",
        "",
        payload["position"],
        "",
        "旧78-claim台帳は内部trace素材として残すが、人間レビューの主対象からは外す。ここでは、Falconに許す内部利用命題、source lensの見方、use boundary、guardrailを、人間が読める単位にする。",
        "",
        "## Counts",
        "",
        f"- Unit count: {payload['unit_count']}",
        f"- By kind: `{json.dumps(payload['unit_counts_by_kind'], ensure_ascii=False)}`",
        "",
    ]
    for unit in payload["units"]:
        lines.extend(
            [
                f"## {unit['unit_id']}: {unit['review_title']}",
                "",
                f"- Kind: `{unit['unit_kind']}`",
                f"- Route: `{unit['route_id']}`",
                "",
                "### レビュー対象",
                "",
                unit["review_statement"],
                "",
            ]
        )
        if unit.get("why_it_matters"):
            lines.extend(["### なぜ重要か", "", unit["why_it_matters"], ""])
        if unit.get("source_basis_plain"):
            lines.extend(["### 根拠の見方", ""])
            lines.extend(f"- {item}" for item in unit["source_basis_plain"])
            lines.append("")
        if unit.get("allowed_use"):
            lines.extend(["### Falconに許す使い方", ""])
            lines.extend(f"- {item}" for item in unit["allowed_use"])
            lines.append("")
        if unit.get("not_allowed"):
            lines.extend(["### 許さない使い方", ""])
            lines.extend(f"- {item}" for item in unit["not_allowed"])
            lines.append("")
        lines.extend(["### 人間が判断すること", ""])
        lines.extend(f"- {item}" for item in unit["reviewer_decides"])
        lines.extend(
            [
                "",
                "### 結果の意味",
                "",
                f"- OKなら: {unit['if_accepted_allows']}",
                f"- 保留なら: {unit['if_held_repair']}",
                "",
            ]
        )
    lines.extend(
        [
            "## Must Not Move",
            "",
            *[f"- {item}" for item in MUST_NOT_MOVE],
            "",
            f"JSON: `{rel(UNITS_JSON)}`",
            f"Review tool: `{rel(TOOL_HTML)}`",
            "",
        ]
    )
    return "\n".join(lines)


def render_tool(payload: dict[str, Any]) -> str:
    data = json.dumps(payload, ensure_ascii=False).replace("<", "\\u003c")
    return f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FT03 Readable Evidence / Validity Review</title>
  <style>
    :root {{
      --bg: #f6f6f2;
      --ink: #202421;
      --muted: #66706a;
      --line: #d8ddd5;
      --panel: #ffffff;
      --soft: #eef4f0;
      --accent: #0b6b5f;
      --blue: #315f9d;
      --warn-bg: #fff8e6;
      --warn-line: #e7d18b;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.65;
    }}
    header {{
      background: #fff;
      border-bottom: 1px solid var(--line);
      padding: 18px clamp(16px, 4vw, 48px);
      position: sticky;
      top: 0;
      z-index: 10;
    }}
    h1 {{ margin: 0 0 4px; font-size: 22px; letter-spacing: 0; }}
    .sub {{ color: var(--muted); font-size: 14px; max-width: 980px; }}
    main {{
      display: grid;
      grid-template-columns: minmax(230px, 320px) minmax(0, 1fr);
      gap: 18px;
      padding: 18px clamp(16px, 4vw, 48px) 42px;
    }}
    aside, section {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }}
    aside {{
      align-self: start;
      position: sticky;
      top: 92px;
      max-height: calc(100vh - 112px);
      overflow: auto;
      padding: 14px;
    }}
    section {{ padding: clamp(16px, 3vw, 30px); min-width: 0; }}
    label {{ display: grid; gap: 5px; color: var(--muted); font-size: 13px; margin: 8px 0; }}
    input, select, textarea {{
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 9px 10px;
      font: inherit;
      color: var(--ink);
      background: #fff;
    }}
    textarea {{ min-height: 92px; resize: vertical; }}
    .list {{ display: grid; gap: 7px; margin-top: 12px; }}
    .item {{
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 6px;
      padding: 8px;
      cursor: pointer;
      text-align: left;
      font: inherit;
    }}
    .item.active {{ border-color: var(--accent); background: var(--soft); }}
    .item.done::after {{
      content: "記録済";
      display: inline-block;
      margin-left: 8px;
      color: var(--accent);
      font-size: 12px;
    }}
    .pillrow {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 18px; }}
    .pill {{
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      border: 1px solid var(--line);
      background: var(--soft);
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 13px;
    }}
    h2 {{ font-size: 20px; margin: 20px 0 8px; letter-spacing: 0; }}
    h3 {{ font-size: 16px; margin: 18px 0 8px; letter-spacing: 0; }}
    .statement {{
      font-size: 19px;
      line-height: 1.8;
      border-left: 4px solid var(--accent);
      background: #fbfcfb;
      padding: 16px 18px;
      margin: 0 0 16px;
    }}
    .note {{
      border: 1px solid var(--warn-line);
      background: var(--warn-bg);
      border-radius: 8px;
      padding: 12px 14px;
      margin: 14px 0;
    }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }}
    .box {{
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fff;
    }}
    ul {{ padding-left: 1.2rem; }}
    li {{ margin: 5px 0; }}
    details {{
      margin-top: 16px;
      border-top: 1px solid var(--line);
      padding-top: 12px;
    }}
    pre {{
      white-space: pre-wrap;
      background: #f4f5f2;
      border: 1px solid var(--line);
      padding: 10px;
      border-radius: 6px;
      font-size: 12px;
      overflow: auto;
    }}
    .actions {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }}
    button {{
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px 12px;
      font: inherit;
      background: #fff;
      cursor: pointer;
    }}
    button.primary {{ background: var(--accent); color: #fff; border-color: var(--accent); }}
    button.secondary {{ background: var(--blue); color: #fff; border-color: var(--blue); }}
    @media (max-width: 860px) {{
      header {{ position: static; }}
      main {{ grid-template-columns: 1fr; }}
      aside {{ position: static; max-height: none; }}
      .grid {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <header>
    <h1>FT03 Readable Evidence / Validity Review</h1>
    <div class="sub">旧78件の圧縮claimではなく、Falconに何を許すかを人間が読める命題として確認します。ここで作るのはレビュー記録であり、source/support validityやpublic/runtime承認ではありません。</div>
  </header>
  <main>
    <aside>
      <div id="count" class="sub"></div>
      <label>レビュー者<input id="reviewer" placeholder="名前またはイニシャル"></label>
      <label>日付<input id="reviewDate" type="date"></label>
      <label>種類<select id="kindFilter"><option value="">すべて</option></select></label>
      <div class="list" id="unitList"></div>
    </aside>
    <section>
      <div class="pillrow" id="meta"></div>
      <h2 id="title"></h2>
      <p class="statement" id="statement"></p>
      <div class="note" id="why"></div>
      <div id="sourceBlock"></div>
      <div class="grid">
        <div class="box">
          <h3>人間が判断すること</h3>
          <ul id="decides"></ul>
        </div>
        <div class="box">
          <h3>結果の意味</h3>
          <p><strong>OKなら</strong><br><span id="accepted"></span></p>
          <p><strong>保留なら</strong><br><span id="held"></span></p>
        </div>
      </div>
      <div id="useBlock"></div>

      <h2>レビュー記録</h2>
      <div class="grid">
        <label>読みやすさ
          <select data-field="readability_mark">
            <option value="">未記録</option>
            <option value="clear">理解できる</option>
            <option value="mostly_clear">だいたい理解できるが修正したい</option>
            <option value="unclear">意味が分からない</option>
            <option value="not_reviewable">この形ではレビュー不能</option>
          </select>
        </label>
        <label>射程
          <select data-field="scope_mark">
            <option value="">未記録</option>
            <option value="scope_ok_for_internal_structural_use">内部構造仮説として妥当</option>
            <option value="scope_too_broad">広すぎる</option>
            <option value="scope_too_narrow_or_overblocked">狭すぎる/止めすぎ</option>
            <option value="hold_needs_rewrite">保留・書き直し</option>
          </select>
        </label>
        <label>根拠確認
          <select data-field="evidence_trace_mark">
            <option value="">未記録</option>
            <option value="trace_enough_for_internal_review">内部レビューには追跡できる</option>
            <option value="needs_source_reread">source再読が必要</option>
            <option value="current_or_official_claim_risk">現行/公式claimに危険</option>
            <option value="hold_not_reviewable_now">今は保留</option>
          </select>
        </label>
        <label>支援claim境界
          <select data-field="support_boundary_mark">
            <option value="">未記録</option>
            <option value="not_support_validity_claim">支援妥当性claimではない</option>
            <option value="question_generation_only">質問生成に留める</option>
            <option value="needs_support_validity_review">支援妥当性レビューへ送る</option>
            <option value="unsafe_support_or_finality_risk">危険な支援/最終判断リスク</option>
          </select>
        </label>
      </div>
      <label>修正文案・メモ
        <textarea data-field="review_note" placeholder="この命題をどう直せばレビュー可能になるか、またはOKにする条件を書く。"></textarea>
      </label>
      <div class="actions">
        <button id="prevBtn">前へ</button>
        <button class="primary" id="saveNextBtn">保存して次へ</button>
        <button id="nextBtn">次へ</button>
        <button class="secondary" id="exportBtn">JSONを書き出す</button>
      </div>
      <details>
        <summary>内部trace用の旧圧縮claimを見る</summary>
        <pre id="originals"></pre>
      </details>
    </section>
  </main>
  <script id="review-data" type="application/json">{data}</script>
  <script>
    const payload = JSON.parse(document.getElementById('review-data').textContent);
    const units = payload.units;
    const results = {{}};
    let filtered = [...units];
    let index = 0;
    const qs = s => document.querySelector(s);
    const qsa = s => [...document.querySelectorAll(s)];

    function fillKindFilter() {{
      for (const kind of [...new Set(units.map(u => u.unit_kind))].sort()) {{
        const opt = document.createElement('option');
        opt.value = kind;
        opt.textContent = kind;
        qs('#kindFilter').appendChild(opt);
      }}
      qs('#reviewDate').value = '{DATE}';
    }}
    function saveCurrent() {{
      const unit = filtered[index];
      if (!unit) return;
      results[unit.unit_id] ||= {{}};
      for (const field of qsa('[data-field]')) {{
        results[unit.unit_id][field.dataset.field] = field.value;
      }}
      results[unit.unit_id].updated_at = new Date().toISOString();
    }}
    function loadCurrent() {{
      const unit = filtered[index];
      const row = unit ? (results[unit.unit_id] || {{}}) : {{}};
      for (const field of qsa('[data-field]')) {{
        field.value = row[field.dataset.field] || '';
      }}
    }}
    function renderList() {{
      qs('#count').textContent = `${{filtered.length}}件 / 全${{units.length}}件`;
      qs('#unitList').innerHTML = '';
      filtered.forEach((unit, i) => {{
        const btn = document.createElement('button');
        btn.className = 'item';
        if (i === index) btn.classList.add('active');
        if (results[unit.unit_id] && Object.values(results[unit.unit_id]).some(Boolean)) btn.classList.add('done');
        btn.textContent = `${{unit.unit_id}}  ${{unit.route_title}}`;
        btn.addEventListener('click', () => {{
          saveCurrent();
          index = i;
          render();
        }});
        qs('#unitList').appendChild(btn);
      }});
    }}
    function renderUseBlock(unit) {{
      const blocks = [];
      if (unit.allowed_use) {{
        blocks.push(`<div class="box"><h3>Falconに許す使い方</h3><ul>${{unit.allowed_use.map(x => `<li>${{x}}</li>`).join('')}}</ul></div>`);
      }}
      if (unit.not_allowed) {{
        blocks.push(`<div class="box"><h3>許さない使い方</h3><ul>${{unit.not_allowed.map(x => `<li>${{x}}</li>`).join('')}}</ul></div>`);
      }}
      qs('#useBlock').innerHTML = blocks.length ? `<div class="grid" style="margin-top:12px">${{blocks.join('')}}</div>` : '';
    }}
    function renderSourceBlock(unit) {{
      if (!unit.source_basis_plain) {{
        qs('#sourceBlock').innerHTML = '';
        return;
      }}
      qs('#sourceBlock').innerHTML = `<h3>根拠の見方</h3><ul>${{unit.source_basis_plain.map(x => `<li>${{x}}</li>`).join('')}}</ul>`;
    }}
    function render() {{
      const unit = filtered[index];
      if (!unit) return;
      qs('#meta').innerHTML = [
        ['Route', unit.route_short_id],
        ['Kind', unit.unit_kind],
        ['Status', 'review input only'],
      ].map(([k,v]) => `<span class="pill">${{k}}: ${{v}}</span>`).join('');
      qs('#title').textContent = unit.review_title;
      qs('#statement').textContent = unit.review_statement;
      qs('#why').textContent = unit.why_it_matters || 'この項目では、根拠の見方または境界表現を確認します。';
      qs('#decides').innerHTML = unit.reviewer_decides.map(x => `<li>${{x}}</li>`).join('');
      qs('#accepted').textContent = unit.if_accepted_allows;
      qs('#held').textContent = unit.if_held_repair;
      qs('#originals').textContent = JSON.stringify(unit.original_internal_items_for_trace_only, null, 2);
      renderSourceBlock(unit);
      renderUseBlock(unit);
      loadCurrent();
      renderList();
    }}
    function applyFilters() {{
      saveCurrent();
      const kind = qs('#kindFilter').value;
      filtered = units.filter(u => !kind || u.unit_kind === kind);
      index = Math.min(index, Math.max(filtered.length - 1, 0));
      render();
    }}
    function move(delta) {{
      saveCurrent();
      index = Math.max(0, Math.min(filtered.length - 1, index + delta));
      render();
    }}
    function exportJson() {{
      saveCurrent();
      const out = {{
        artifact_id: 'stage1-production-ft03-evidence-validity-readable-review-result',
        source_tool: '{TOOL_PREFIX}.html',
        reviewer: qs('#reviewer').value,
        review_date: qs('#reviewDate').value,
        generated_at: new Date().toISOString(),
        boundary: 'human readable review record only; no Codex-owned validity movement',
        prior_partial_result_handling: payload.prior_partial_result_handling,
        results,
      }};
      const blob = new Blob([JSON.stringify(out, null, 2)], {{type: 'application/json'}});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stage1-production-ft03-evidence-validity-readable-review-result-filled-v0-2026-05-26.json';
      a.click();
      URL.revokeObjectURL(url);
    }}
    qs('#kindFilter').addEventListener('change', applyFilters);
    qs('#prevBtn').addEventListener('click', () => move(-1));
    qs('#nextBtn').addEventListener('click', () => move(1));
    qs('#saveNextBtn').addEventListener('click', () => move(1));
    qs('#exportBtn').addEventListener('click', exportJson);
    fillKindFilter();
    render();
  </script>
</body>
</html>
"""


def main() -> None:
    matrix = read_json(MATRIX_JSON)
    if OLD_LEDGER_JSON.exists():
        read_json(OLD_LEDGER_JSON)
    failure = analyze_prior_result()
    units = build_units(matrix)
    payload = build_units_payload(units, failure)

    write_json(FAILURE_JSON, failure)
    write_md(FAILURE_MD, render_failure_md(failure))
    write_json(UNITS_JSON, payload)
    write_md(UNITS_MD, render_units_md(payload))
    write_md(TOOL_HTML, render_tool(payload))

    print(f"wrote {rel(FAILURE_MD)}")
    print(f"wrote {rel(UNITS_MD)}")
    print(f"wrote {rel(TOOL_HTML)}")
    print(f"readable units: {len(units)}")


if __name__ == "__main__":
    main()
