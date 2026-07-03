#!/usr/bin/env python3
"""Build the FT-Codex-03 refresh of the Stage 1 Core route matrix.

This adds supporter/workplace/NIVR/workshop source-lens readings to the prior
internal route mechanism matrix. It is still unreviewed and not promoted.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_ID = "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23"
OUT_JSON = RUN_DIR / f"{OUT_ID}.json"
OUT_MD = RUN_DIR / f"{OUT_ID}.md"


INPUTS = [
    RUN_DIR / "stage1-production-core-route-mechanism-matrix-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-source-lens-saturation-map-v0-2026-05-23.md",
    RUN_DIR / "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md",
    RUN_DIR / "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md",
]


ROUTES: list[dict[str, Any]] = [
    {
        "route_id": "QR-01-health-time-work-design",
        "core_axis": ["C01-health-time"],
        "refreshed_closure": "candidate_core_thick_but_boundary_sensitive",
        "expert_function": "健康時間を、本人側体調ではなく、支援接触、職場相談線、休職と収入、医療労働翻訳、将来再設計を含む設計変数として読む。",
        "ft03_source_lens_addition": [
            "supporter: 遠隔や電話が健康時間負担を下げつつ評価・関係形成を薄くしうる境界を追加した。",
            "workplace: 変動性、進行性、休職、賃金低下、将来会話が職場相談線の有無で変わることを追加した。",
            "NIVR/workshop: 健康時間を医療、生活、入口、長期継続の橋として使うsource familyを追加した。",
        ],
        "route_moves": [
            "体調情報を、負荷、休息、移動、休職、収入、評価、将来会話へ分解する。",
            "本人説明だけで閉じず、誰が職場側に翻訳し、いつ再設計するかを見る。",
            "C06生活保障が先に閉じていないかを常に確認する。",
        ],
        "brakes": [
            "変動性や進行性を職務能力や採用困難性の予測にしない。",
            "遠隔支援や柔軟勤務を万能解にしない。",
            "NIVR資料から現行制度説明へ進まない。",
        ],
    },
    {
        "route_id": "QR-02-information-work-procedure",
        "core_axis": ["C04-information-participation"],
        "refreshed_closure": "candidate_core_active_with_consent_boundary",
        "expert_function": "情報参加を、情報量ではなく、同意、共有範囲、職場観察、業務手順、安全、評価、人事へ同期する参加構造として読む。",
        "ft03_source_lens_addition": [
            "supporter: 開示が不利益回避、相談先、本人同意と結びつく境界を追加した。",
            "workplace: 本人説明、職場観察、プライバシー、必要確認のずれを追加した。",
            "workshop: アクター地図を情報再翻訳の位相図として追加した。",
        ],
        "route_moves": [
            "何を共有したかではなく、誰に、どの職務接触点へ、どの同意範囲で翻訳されたかを見る。",
            "情報形式が評価、非公式情報、安全、責任分担へ届くかを確認する。",
            "C05接触点、C03支援連続、C06生活保障への波及を追う。",
        ],
        "brakes": [
            "情報共有を最大化しない。",
            "本人と職場のどちらが正しいかを判断しない。",
            "差別認定、法的判断、開示の正解化へ進まない。",
        ],
    },
    {
        "route_id": "QR-03-worksite-contact-and-mobility",
        "core_axis": ["C05-worksite-contact"],
        "refreshed_closure": "candidate_core_thickened_by_workplace_lens",
        "expert_function": "職場接触点を、作業、安全、人員余力、顧客対応、欠勤代替、求人表示、情報形式が重なる具体面として分解する。",
        "ft03_source_lens_addition": [
            "workplace: 小規模、現場作業、安全、顧客、欠勤代替、未経験想定困難を追加した。",
            "workshop: アクター地図を職場接触点への翻訳責任として追加した。",
            "supporter: 企業説明と入口翻訳が接触点設計へ届く必要を追加した。",
        ],
        "route_moves": [
            "作業名ではなく、身体、情報、道具、顧客、安全、代替人員の接触点を分ける。",
            "制度や柔軟勤務が実接触点へ落ちているかを見る。",
            "未経験職場の想定困難は、実証拠でなく入口前情報不足として扱う。",
        ],
        "brakes": [
            "職場側の不安を企業妥当性や偏見認定にしない。",
            "好事例を汎用処方にしない。",
            "設備や職務調整を能力判定へ変換しない。",
        ],
    },
    {
        "route_id": "QR-04-life-security-sequencing",
        "core_axis": ["C06-life-security"],
        "refreshed_closure": "candidate_core_active_as_direct_freedom_axis",
        "expert_function": "生活保障を、医療費、休職、賃金、制度カテゴリ、家族支援、待つ自由、戻る自由を決める直接自由度として読む。",
        "ft03_source_lens_addition": [
            "supporter: 制度カテゴリ境界と一件ずつの企業説明が生活保障と入口を同時に狭めることを追加した。",
            "workplace: 休職、短時間、賃金低下、医療費、生活不安の順序を追加した。",
            "NIVR/workshop: 医療、生活、就労継続を分断しない橋を追加した。",
        ],
        "route_moves": [
            "就労継続の有無ではなく、休める、待てる、戻れる、選び直せる条件を見る。",
            "C01健康時間とC05接触点を、生活保障が支えているか確認する。",
            "制度カテゴリを現在制度説明ではなく、自由度が切れる場所として扱う。",
        ],
        "brakes": [
            "政策妥当性、給付利用可能性、法的判断へ進まない。",
            "雇用継続や満足度を生活保障の解決証明にしない。",
        ],
    },
    {
        "route_id": "QR-05-entry-prework-translation",
        "core_axis": ["C02-entry-translation", "C08-prework-participation"],
        "refreshed_closure": "candidate_core_active_with_preentry_hold",
        "expert_function": "入口と入口以前参加を、制度カテゴリ、求人表示、仕事像、体験、生活リズム、開始後支援が相互翻訳される順序として読む。",
        "ft03_source_lens_addition": [
            "supporter: 就職前体験、自己理解、ストレス把握、支援者の企業説明を追加した。",
            "workplace: 求人表示と柔軟制度の見え方、未経験職場の想定困難を追加した。",
            "workshop: 早期情報から長期継続までの段階トポロジーを追加した。",
        ],
        "route_moves": [
            "未就労や訓練段階を準備不足にせず、何が職務条件へ翻訳されていないかを見る。",
            "求人表示、支援役割、職場体験、開始後戻り回路を一続きで読む。",
            "入口で制度カテゴリや病名がどう働くかを条件窓として扱う。",
        ],
        "brakes": [
            "readiness deficitに戻さない。",
            "開示済みや訓練参加を入口解決にしない。",
            "古いカテゴリ情報を現行説明にしない。",
        ],
    },
    {
        "route_id": "QR-06-disclosure-boundary-and-mutual-translation",
        "core_axis": ["C02-entry-translation", "C03-support-continuity", "C04-information-participation"],
        "refreshed_closure": "candidate_core_active_with_hard_finality_brake",
        "expert_function": "開示を、言うか言わないかではなく、本人同意、職場理解、支援者仲介、不利益回避、問題時相談線の相互翻訳境界として読む。",
        "ft03_source_lens_addition": [
            "supporter: 開示後の不利益、相談線、本人同意、企業説明の境界を追加した。",
            "workplace: プライバシー、観察、必要確認、情報管理のずれを追加した。",
            "NIVR: 医療労働情報を最終判断でなく翻訳責任として読む境界を追加した。",
        ],
        "route_moves": [
            "開示量でなく、情報が仕事手順、評価、安全、休息、通院へ翻訳されたかを見る。",
            "本人、支援者、職場の正誤ではなく、翻訳が止まった場所を探す。",
            "医療情報は共有同意と職務条件への翻訳範囲に限定して扱う。",
        ],
        "brakes": [
            "開示の正解化、非開示の成功戦略化をしない。",
            "医療機関や職場に最終判断を委ねない。",
            "差別、法的妥当性、個別配慮妥当性の判断をしない。",
        ],
    },
    {
        "route_id": "QR-07-quality-career-and-value-translation",
        "core_axis": ["C07-quality-participation"],
        "refreshed_closure": "route_through_now_usable_not_standalone_core",
        "expert_function": "参加品質を、満足度ではなく、役割、価値、処遇、学習、将来会話、キャリア再設計の翻訳として読む。",
        "ft03_source_lens_addition": [
            "workplace: 将来変化を本人を傷つけずに話す仲介線を追加した。",
            "supporter: 組織目的、評価、財源を支援者翻訳容量として追加した。",
            "NIVR: ライフコースと中高年期の参加品質を追加した。",
        ],
        "route_moves": [
            "役割、評価、処遇、学習、将来見通しへ何が翻訳されるかを見る。",
            "C01健康時間、C03支援連続、C05接触点、C06生活保障を通して使う。",
            "好事例は開放条件の対照としてだけ使う。",
        ],
        "brakes": [
            "満足度、勤続、好事例、処遇を成功証明にしない。",
            "単独Core昇格やpublic-ready化をしない。",
        ],
    },
    {
        "route_id": "QR-08-condition-window-not-lookup",
        "core_axis": ["cross-cutting-condition-window"],
        "refreshed_closure": "global_guardrail_strengthened",
        "expert_function": "病名、障害名、制度カテゴリ、年齢、地域、職場規模を、配慮や就労困難性との相互作用を読む条件窓として扱い、単純因果lookup化しない。",
        "ft03_source_lens_addition": [
            "supporter: カテゴリ境界と制度外性が入口、生活保障、企業説明を変えることを追加した。",
            "workplace: 多様性認識、未経験想定困難、職場規模、業種接触点を追加した。",
            "NIVR/workshop: 疾患希少性、地域、ライフコースを境界テストとして追加した。",
        ],
        "route_moves": [
            "条件名を使わないのではなく、どの相互作用が見える窓かを明示する。",
            "条件窓ごとに、共通構造とその条件下でだけ見える特殊構造を分ける。",
            "診断名や制度カテゴリから支援内容へ直行しない。",
        ],
        "brakes": [
            "病名から配慮、困難性、能力、支援必要性を直接推定しない。",
            "条件窓をタブー化して情報を捨てない。",
            "古いカテゴリや地域差を現行判断にしない。",
        ],
    },
]


GLOBAL_UPGRADES = [
    "FT-Codex-03により、C03は支援者、職場、医療、生活、Workshopを横断するretranslation spineとして強化された。",
    "C05は職場側source lensで、設備ではなく作業、安全、人員、顧客、欠勤代替、求人表示まで分解できるようになった。",
    "C06は支援者と職場側から、医療費、休職、賃金低下、カテゴリ境界を含む直接自由度として強化された。",
    "C07/C08はroute-throughとして実用可能になったが、成功証明や準備不足判定へ崩さないブレーキを維持する。",
    "条件窓はタブーではなく、配慮や就労困難性との関係を相互作用として扱う検査窓であることを再固定した。",
]


GLOBAL_BRAKES = [
    "No raw or redacted narrative text, field values, short quotes, or PII are exported.",
    "No source/support validity, review status, candidate_pattern, Domain Core, Atlas/27-frame, public approval, or runtime approval is moved.",
    "No legal, medical, HR, employment, accommodation, support adequacy, worker capacity, or individual-case final judgment is made.",
    "Official and quasi-official sources remain local structural inputs unless separately reviewed and live-verified for public/current claims.",
]


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def validate(payload: dict[str, Any]) -> None:
    text = json.dumps(payload, ensure_ascii=False)
    prohibited = ["_x000D_", "PERSON_NAME", "MEDICAL_INSTITUTION", "raw_quote", "candidate_pattern_promoted"]
    for mark in prohibited:
        if mark in text:
            raise SystemExit(f"prohibited marker found: {mark}")


def write() -> None:
    payload: dict[str, Any] = {
        "artifact_id": OUT_ID,
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "internal_expert_route_matrix_ft03_refresh_no_text_export_no_promotion_unreviewed",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "inputs": [rel(path) for path in INPUTS],
        "global_upgrades": GLOBAL_UPGRADES,
        "global_brakes": GLOBAL_BRAKES,
        "routes": ROUTES,
    }
    validate(payload)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Core Route Mechanism Matrix FT-Codex-03 Refresh",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: internal expert route matrix refresh / no text export / no promotion / unreviewed / runtime未承認",
        "",
        "## Position",
        "",
        "FT-Codex-03のsupporter / workplace / NIVR / workshop source-lensを、既存Stage 1 Core route mechanism matrixへ反映する内部用refresh。",
        "完成宣言、review済み知識、支援妥当性、現行制度説明、公開根拠、runtime承認ではない。",
        "",
        "## Inputs",
        "",
    ]
    lines.extend(f"- `{rel(path)}`" for path in INPUTS)
    lines.extend(["", "## Global Upgrades", ""])
    lines.extend(f"- {item}" for item in GLOBAL_UPGRADES)
    lines.extend(["", "## Global Brakes", ""])
    lines.extend(f"- {item}" for item in GLOBAL_BRAKES)
    lines.extend(["", "## Route Matrix Refresh", ""])
    for route in ROUTES:
        lines.append(f"### {route['route_id']}")
        lines.append(f"- core_axis: {', '.join(route['core_axis'])}")
        lines.append(f"- refreshed_closure: `{route['refreshed_closure']}`")
        lines.append(f"- expert_function: {route['expert_function']}")
        lines.append("")
        lines.append("**FT-Codex-03 Source-Lens Additions**")
        lines.extend(f"- {item}" for item in route["ft03_source_lens_addition"])
        lines.append("")
        lines.append("**Route Moves**")
        lines.extend(f"- {item}" for item in route["route_moves"])
        lines.append("")
        lines.append("**Brakes**")
        lines.extend(f"- {item}" for item in route["brakes"])
        lines.append("")
    lines.extend(
        [
            "## Boundary",
            "",
            "- raw/redacted narrative text、field value、短い引用、PIIは含めない。",
            "- source/support validity、review status、candidate_pattern、Domain Core、public/runtime statusは動かしていない。",
            "- 病名・障害名・制度カテゴリ等は、配慮や就労困難性との関係を相互作用として読む条件窓であり、単純因果lookupにはしない。",
            "",
            f"JSON: `{rel(OUT_JSON)}`",
        ]
    )
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"json": rel(OUT_JSON), "md": rel(OUT_MD), "routes": len(ROUTES)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
