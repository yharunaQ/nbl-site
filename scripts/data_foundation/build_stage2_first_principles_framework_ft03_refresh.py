#!/usr/bin/env python3
"""Build the Stage 2 first-principles framework from the FT03 completion cut."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_DIR = ROOT / "references/derived/scima-fchma/stage2-first-principles-ft03-v0-2026-05-23"
OUT_JSON = OUT_DIR / "falcon-first-principles-framework-from-stage1-ft03-v0-2026-05-23.json"
OUT_MD = OUT_DIR / "falcon-first-principles-framework-from-stage1-ft03-v0-2026-05-23.md"


INPUTS = [
    STAGE1_DIR / "stage1-production-core-candidate-completion-cut-ft03-v0-2026-05-23.md",
    STAGE1_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md",
    STAGE1_DIR / "stage1-production-source-lens-saturation-map-v0-2026-05-23.md",
    STAGE1_DIR / "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.md",
]


FRAME_LAYERS = [
    {
        "id": "L1-condition-window",
        "name": "条件窓",
        "description": "病名、障害名、制度カテゴリ、年齢、地域、職場規模など。無視もlookup化もせず、配慮や就労困難性との相互作用を読む窓として扱う。",
    },
    {
        "id": "L2-source-lens",
        "name": "source lens",
        "description": "本人、支援者、職場、NIVR、workshop、web-cache、2001 ABCはそれぞれ部分的な観測窓であり、正誤序列ではなく相互補正のために使う。",
    },
    {
        "id": "L3-work-design-surface",
        "name": "仕事設計面",
        "description": "時間、休憩、通勤、作業、道具、情報形式、安全、顧客対応、人員余力、欠勤代替、求人表示、評価条件など。",
    },
    {
        "id": "L4-translation-mechanism",
        "name": "翻訳機構",
        "description": "本人条件、医療生活情報、求人条件、職場条件、支援役割、制度条件を仕事参加へ再翻訳する機能。",
    },
    {
        "id": "L5-freedom-state",
        "name": "自由度状態",
        "description": "待てる、休める、試せる、戻れる、選び直せる、説明できる、相談できる、評価されるという自由度の開閉状態。",
    },
    {
        "id": "L6-learning-and-review-loop",
        "name": "学習・レビュー循環",
        "description": "観察、構造仮説、反対仮説、境界例、実装条件、結果、人間レビュー、source/support validityを分離して接続する循環。",
    },
]


PRINCIPLES: list[dict[str, Any]] = [
    {
        "id": "FP-01-condition-windows-are-interaction-windows",
        "name": "条件窓は相互作用を見る窓である",
        "one_line": "病名・障害名・制度カテゴリ等はタブーではなく、配慮や就労困難性との関係を相互作用として読む条件窓である。",
        "why_it_matters": "条件名を捨てると特殊構造が消え、条件名から直接配慮を引くと単純因果に落ちる。Falconは条件窓ごとに共通構造と特殊構造を分ける。",
        "stage1_basis": ["QR-08-condition-window-not-lookup", "FT-Codex-03 workplace diversity lens", "2001 ABC condition-window mechanism overlay"],
        "practical_question": "この条件名は、どの相互作用を見えやすくし、どの誤った単純因果へ引き込みやすいか。",
        "boundary": "病名から配慮、困難性、能力、支援必要性を直接推定しない。",
    },
    {
        "id": "FP-02-source-lenses-are-partial-not-hierarchical",
        "name": "source lensは部分観測であり正誤序列ではない",
        "one_line": "本人、支援者、職場、研究報告、workshopはそれぞれ違う接触面を見ており、どれか一つを真実として他を従属させない。",
        "why_it_matters": "三者差や機関差を矛盾として片づけると、情報同期、評価、負担、支援役割のずれが消える。Falconは差分を翻訳停止点として読む。",
        "stage1_basis": ["FT-Codex-03 supporter/workplace/NIVR/workshop reconnection", "2001 ABC triadic crosswalk", "source-lens saturation map"],
        "practical_question": "この観測は、どのsource lensから見えており、別のlensでは何が見えにくいか。",
        "boundary": "本人、支援者、職場のどれが正しいかをCodexが決めない。",
    },
    {
        "id": "FP-03-health-time-is-a-work-design-variable",
        "name": "健康時間は仕事設計変数である",
        "one_line": "体調変動、通院、疲労、休職、回復は本人側の不安定さではなく、負荷、休息、収入、相談線、評価へ翻訳される仕事設計変数である。",
        "why_it_matters": "健康時間を医学的背景だけで扱うと、職場相談線、休職時収入、戻る経路、将来再設計が見えなくなる。",
        "stage1_basis": ["QR-01-health-time-work-design", "C01/C06 source-lens saturation", "FT-Codex-03 workplace fluctuation and leave-income sequence"],
        "practical_question": "健康時間は、勤務量、休憩、欠勤扱い、収入、評価、将来会話へどう翻訳されているか。",
        "boundary": "体調変動から就労可能性や配慮妥当性を判断しない。",
    },
    {
        "id": "FP-04-information-must-become-consented-work-procedure",
        "name": "情報は同意された仕事手順になって初めて参加を支える",
        "one_line": "情報共有は量ではなく、本人同意、共有範囲、職場で使える手順、安全、評価、相談線へ接続して初めて自由度になる。",
        "why_it_matters": "情報不足を本人説明力や職場理解に還元すると、同意、プライバシー、実務手順への翻訳責任が見えなくなる。",
        "stage1_basis": ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation", "FT-Codex-03 disclosure/privacy workplace lens"],
        "practical_question": "必要情報は、誰に、どの同意範囲で、どの作業・安全・評価手順へ接続されているか。",
        "boundary": "情報共有を最大化しない。開示の正解を決めない。",
    },
    {
        "id": "FP-05-work-contact-points-are-the-design-unit",
        "name": "仕事接触点を設計単位にする",
        "one_line": "職場環境は設備リストではなく、作業、道具、情報、安全、顧客、欠勤代替、人員余力、求人表示が接する具体面である。",
        "why_it_matters": "一般的な柔軟勤務や配慮項目に戻すと、小規模職場、現場作業、安全、顧客対応などの実接触点が消える。",
        "stage1_basis": ["QR-03-worksite-contact-and-mobility", "FT-Codex-03 workplace contact granularity", "2001 ABC B-survey workplace supervisor lens"],
        "practical_question": "この仕事で実際に接している身体、情報、道具、顧客、安全、人員余力の面はどこか。",
        "boundary": "職場側の不安や好事例を能力判定、企業妥当性、汎用処方へ変換しない。",
    },
    {
        "id": "FP-06-disclosure-is-safe-boundary-design",
        "name": "開示は安全な境界設計である",
        "one_line": "開示は言うか言わないかではなく、本人同意、不利益回避、仕事手順への翻訳、問題時相談線を同時に設計する境界である。",
        "why_it_matters": "開示を本人の勇気や企業理解に丸めると、翻訳責任とプライバシー保護の両方が消える。",
        "stage1_basis": ["QR-06-disclosure-boundary-and-mutual-translation", "FT-Codex-03 supporter safe-disclosure boundary", "FT-Codex-03 workplace disclosure/privacy gap"],
        "practical_question": "何を、誰に、どこまで、どの言葉で、どの仕事条件へ接続するか。",
        "boundary": "開示すべきか、誰が正しいか、法的にどうかを判断しない。",
    },
    {
        "id": "FP-07-support-is-retranslation-capacity",
        "name": "支援は存在ではなく再翻訳容量である",
        "one_line": "支援の価値は窓口やメニューの存在ではなく、医療、生活、求人、職場、本人説明を変化局面で再翻訳できる容量にある。",
        "why_it_matters": "支援の有無や会議開催を成果の代理指標にすると、誰が何をどこへ翻訳したのかが消える。",
        "stage1_basis": ["QR-03 support continuity spine", "FT-Codex-03 supporter learning-to-retranslation", "regional network surface"],
        "practical_question": "支援は、どの条件を、どの局面で、誰に向けて再翻訳しているか。",
        "boundary": "支援者熱意、紹介件数、支援メニュー相関を支援妥当性や効果証明にしない。",
    },
    {
        "id": "FP-08-life-security-is-a-direct-freedom-axis",
        "name": "生活保障は直接の自由度軸である",
        "one_line": "収入、医療費、休職、制度カテゴリ、家族支援は背景事情ではなく、待つ、休む、戻る、選び直す自由度を直接決める。",
        "why_it_matters": "生活保障を仕事外の問題へ押し出すと、健康時間や入口選択がなぜ閉じるのかが説明できない。",
        "stage1_basis": ["QR-04-life-security-sequencing", "FT-Codex-03 workplace leave-wage sequence", "FT-Codex-03 category-limbo life security"],
        "practical_question": "この人は、休めるか、待てるか、治療を続けられるか、戻れるか、選び直せるか。",
        "boundary": "現行制度説明、政策妥当性、給付利用可能性は別途確認なしに扱わない。",
    },
    {
        "id": "FP-09-entry-and-prework-are-participation-processes",
        "name": "入口と入口以前は参加過程である",
        "one_line": "入口以前は準備不足ではなく、検出、仕事像、体験、生活リズム、ストレス、求人情報、開始後支援を組み直す参加過程である。",
        "why_it_matters": "未就労や訓練段階をreadiness deficitに戻すと、入口前に閉じている支援・求人・生活保障の自由度が見えなくなる。",
        "stage1_basis": ["QR-05-entry-prework-translation", "FT-Codex-03 prework practice identity stress work image", "Workshop phased support topology"],
        "practical_question": "応募前から開始後まで、どの条件がどの仕事条件へ翻訳されていないか。",
        "boundary": "未就労、訓練、非相談を本人側不足やニーズ不在と読まない。",
    },
    {
        "id": "FP-10-quality-is-role-value-and-future-translation",
        "name": "参加品質は役割・価値・将来への翻訳である",
        "one_line": "参加品質は満足度や勤続ではなく、役割、評価、処遇、学習、将来会話、キャリア再設計へ仕事が翻訳されるかで読む。",
        "why_it_matters": "働けている、満足している、続いているだけでは、価値や将来見通しが閉じたままの状態を落とす。",
        "stage1_basis": ["QR-07-quality-career-and-value-translation", "FT-Codex-03 future progression career mediation", "NIVR life-course quality lens"],
        "practical_question": "条件付き遂行は、役割、評価、処遇、学習、将来見通しへどう変換されているか。",
        "boundary": "満足度、勤続、好事例を成功証明にしない。C07はroute-throughで使う。",
    },
    {
        "id": "FP-11-minority-and-old-data-are-structure-discovery-windows",
        "name": "少数窓と古いデータは構造発見窓である",
        "one_line": "件数が小さい条件窓や2001年データは、現在妥当性の証明ではなく、多数派に埋もれる接触点と三者差を見つける構造窓である。",
        "why_it_matters": "古いデータや少数窓を捨てると、身体・知的障害の職場粒度や三者紐付けから得られる接触点構造を失う。",
        "stage1_basis": ["2001 ABC mechanism crosswalk", "QR-08-condition-window-not-lookup", "source-lens saturation map"],
        "practical_question": "この古い/少数sourceは、現行主張ではなく、どの機序の発見窓として使えるか。",
        "boundary": "古い制度や条件分布を現行政策・現行職場判断へ移植しない。",
    },
    {
        "id": "FP-12-learning-loop-over-answer-delivery",
        "name": "答えを渡すより、学習する構造を作る",
        "one_line": "Falconの役割は正解配布ではなく、観察、構造仮説、反対仮説、境界例、実装条件、結果、人間レビューを接続する知識ネットワークを育てることである。",
        "why_it_matters": "未レビュー候補を答えとして出すと、個別性、反例、source lens差、review gateが消える。",
        "stage1_basis": ["Stage 1 Core candidate completion cut", "human review/source validity separation", "Codex chat use contract"],
        "practical_question": "この仮説は、どの観察、反対仮説、境界例、実装条件、レビュー条件へ接続されているか。",
        "boundary": "human review、source/support validity、public/runtime approvalをCodexが代替しない。",
    },
]


ROUTE_TO_PRINCIPLES = {
    "QR-01-health-time-work-design": ["FP-03-health-time-is-a-work-design-variable", "FP-08-life-security-is-a-direct-freedom-axis", "FP-10-quality-is-role-value-and-future-translation"],
    "QR-02-information-work-procedure": ["FP-04-information-must-become-consented-work-procedure", "FP-06-disclosure-is-safe-boundary-design"],
    "QR-03-worksite-contact-and-mobility": ["FP-05-work-contact-points-are-the-design-unit", "FP-02-source-lenses-are-partial-not-hierarchical"],
    "QR-04-life-security-sequencing": ["FP-08-life-security-is-a-direct-freedom-axis", "FP-03-health-time-is-a-work-design-variable"],
    "QR-05-entry-prework-translation": ["FP-09-entry-and-prework-are-participation-processes", "FP-06-disclosure-is-safe-boundary-design", "FP-08-life-security-is-a-direct-freedom-axis"],
    "QR-06-disclosure-boundary-and-mutual-translation": ["FP-06-disclosure-is-safe-boundary-design", "FP-04-information-must-become-consented-work-procedure", "FP-07-support-is-retranslation-capacity"],
    "QR-07-quality-career-and-value-translation": ["FP-10-quality-is-role-value-and-future-translation", "FP-03-health-time-is-a-work-design-variable"],
    "QR-08-condition-window-not-lookup": ["FP-01-condition-windows-are-interaction-windows", "FP-11-minority-and-old-data-are-structure-discovery-windows", "FP-12-learning-loop-over-answer-delivery"],
}


CODEX_USE = [
    "問いをrouteへ割り当てる前に、source lensと条件窓を明示する。",
    "第一原理は結論ではなく、観察を分解する検査レンズとして使う。",
    "病名・障害名を使う時は、相互作用を読むための窓として何を見ているかを明示する。",
    "支援や配慮の妥当性、現行制度、個別判断へ進まず、missing contextと反対仮説を返す。",
    "Outcome 3へ進む時は、現在政策主張ではなく社会設計上の自由度の開閉として橋渡しする。",
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
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    payload: dict[str, Any] = {
        "artifact_id": "falcon-first-principles-framework-from-stage1-ft03-v0-2026-05-23",
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "first_principles_from_ft03_core_cut_unreviewed_no_promotion",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "inputs": [rel(path) for path in INPUTS],
        "central_claim": "障害者就労支援の中核は、病名や障害名を無視することでも、そこから配慮を直接引くことでもない。条件窓ごとに、人、仕事、職場、情報、健康時間、生活保障、支援、評価、制度の相互作用を読み、自由度がどこで開閉するかを設計可能にすることである。",
        "frame_layers": FRAME_LAYERS,
        "principles": PRINCIPLES,
        "route_to_principles": ROUTE_TO_PRINCIPLES,
        "codex_use": CODEX_USE,
        "boundary": [
            "unreviewed internal framework",
            "not public-safe or public-approved",
            "not source/support validity",
            "not medical/legal/employment/accommodation/support adequacy final guidance",
            "not runtime approved",
        ],
    }
    validate(payload)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Falcon First Principles Framework From Stage 1 FT-Codex-03",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: first-principles framework / from FT03 Core cut / no text export / no promotion / unreviewed / public不可 / runtime未承認",
        "",
        "## Central Claim",
        "",
        payload["central_claim"],
        "",
        "## Frame Layers",
        "",
        "| layer | 意味 |",
        "|---|---|",
    ]
    lines.extend(f"| `{layer['id']}` {layer['name']} | {layer['description']} |" for layer in FRAME_LAYERS)
    lines.extend(["", "## 12 First Principles", ""])
    for principle in PRINCIPLES:
        lines.append(f"### {principle['id']} {principle['name']}")
        lines.append("")
        lines.append(principle["one_line"])
        lines.append("")
        lines.append(f"なぜ重要か: {principle['why_it_matters']}")
        lines.append("")
        lines.append(f"実務上の問い: {principle['practical_question']}")
        lines.append("")
        lines.append(f"Stage 1 basis: {', '.join(principle['stage1_basis'])}")
        lines.append("")
        lines.append(f"Boundary: {principle['boundary']}")
        lines.append("")
    lines.extend(["## Route To Principles", "", "| Stage 1 route | 対応する第一原理 |", "|---|---|"])
    for route, principles in ROUTE_TO_PRINCIPLES.items():
        lines.append(f"| `{route}` | {', '.join(f'`{p}`' for p in principles)} |")
    lines.extend(["", "## Codexでの使い方", ""])
    lines.extend(f"- {item}" for item in CODEX_USE)
    lines.extend(["", "## Boundary", ""])
    lines.extend(f"- {item}" for item in payload["boundary"])
    lines.extend(["- raw/redacted text、field value、短い引用、PIIは外部化していない。"])
    lines.extend(["", "## Inputs", ""])
    lines.extend(f"- `{rel(path)}`" for path in INPUTS)
    lines.extend(["", f"JSON: `{rel(OUT_JSON)}`"])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"json": rel(OUT_JSON), "md": rel(OUT_MD), "principles": len(PRINCIPLES)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
