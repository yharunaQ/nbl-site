#!/usr/bin/env python3
"""Build the Stage 3 Japan improvement agenda from the FT03 first principles."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
STAGE2_DIR = ROOT / "references/derived/scima-fchma/stage2-first-principles-ft03-v0-2026-05-23"
OUT_DIR = ROOT / "references/derived/scima-fchma/stage3-japan-improvement-agenda-ft03-v0-2026-05-23"
OUT_JSON = OUT_DIR / "falcon-japan-improvement-agenda-from-ft03-first-principles-v0-2026-05-23.json"
OUT_MD = OUT_DIR / "falcon-japan-improvement-agenda-from-ft03-first-principles-v0-2026-05-23.md"


INPUTS = [
    STAGE1_DIR / "stage1-production-core-candidate-completion-cut-ft03-v0-2026-05-23.md",
    STAGE1_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.md",
    STAGE2_DIR / "falcon-first-principles-framework-from-stage1-ft03-v0-2026-05-23.md",
]


AGENDA_ITEMS: list[dict[str, Any]] = [
    {
        "id": "JA-01-condition-window-interaction-infrastructure",
        "title": "病名・障害名をlookupでなく相互作用窓として使う基盤",
        "problem_hypothesis": "条件名を使うこと自体を避けると特殊構造が消え、条件名から配慮を直接引くと単純因果に落ちる。",
        "first_principles": ["FP-01-condition-windows-are-interaction-windows", "FP-11-minority-and-old-data-are-structure-discovery-windows"],
        "stage1_routes": ["QR-08-condition-window-not-lookup"],
        "improvement_direction": "疾病群、障害種類、制度カテゴリ、年齢、地域、職場規模を、共通構造と条件下特殊構造を分けるための窓として扱う。",
        "practical_outputs": ["条件窓別相互作用マップ", "共通構造と特殊構造の分離テンプレート", "病名・障害名からrouteへ戻す検索補助"],
        "current_policy_hold": "現行制度分類や公的支援対象性の説明は、別途公式確認なしにしない。",
    },
    {
        "id": "JA-02-source-lens-triangulation",
        "title": "本人・支援者・職場・研究・実践知を正誤序列でなく三角測量する",
        "problem_hypothesis": "本人、支援者、職場、研究報告、workshopの観測差が、矛盾や優劣として扱われると、翻訳停止点が見えなくなる。",
        "first_principles": ["FP-02-source-lenses-are-partial-not-hierarchical", "FP-12-learning-loop-over-answer-delivery"],
        "stage1_routes": ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation"],
        "improvement_direction": "source lensごとに見えるものと見えないものを明示し、差分を情報同期、評価、負担、支援役割の検査点にする。",
        "practical_outputs": ["source-lens比較カード", "三者差の翻訳停止点マップ", "本人/支援者/職場観測の非序列レビュー手順"],
        "current_policy_hold": "source validityやsupport validityは別ゲートで扱う。",
    },
    {
        "id": "JA-03-health-time-and-leave-income-work-design",
        "title": "体調変動・治療時間・休職収入を仕事設計として扱う",
        "problem_hypothesis": "健康時間が本人側事情として扱われると、負荷、休息、休職、収入、戻る経路、将来会話が仕事設計から外れる。",
        "first_principles": ["FP-03-health-time-is-a-work-design-variable", "FP-08-life-security-is-a-direct-freedom-axis"],
        "stage1_routes": ["QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
        "improvement_direction": "健康時間を、職務負荷、休息、休職時収入、医療生活情報の翻訳、評価、復帰、将来再設計へ接続する。",
        "practical_outputs": ["健康時間から仕事条件への翻訳シート", "休職・短時間・収入低下の順序マップ", "将来再設計の会話条件チェック"],
        "current_policy_hold": "病状や体調変動から就労可能性や配慮妥当性を判断しない。",
    },
    {
        "id": "JA-04-consented-information-and-disclosure-procedure",
        "title": "情報共有と開示を同意された仕事手順へ落とす",
        "problem_hypothesis": "情報共有が説明量や本人の開示努力に寄ると、同意、プライバシー、確認手順、評価、安全、相談線への接続が曖昧になる。",
        "first_principles": ["FP-04-information-must-become-consented-work-procedure", "FP-06-disclosure-is-safe-boundary-design"],
        "stage1_routes": ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation"],
        "improvement_direction": "共有範囲、相手、形式、確認手順、責任配置、問題時相談線を、本人同意と職場実務の両方から設計する。",
        "practical_outputs": ["開示境界設計表", "情報から作業手順への変換テンプレート", "安全・評価・相談線への接続チェック"],
        "current_policy_hold": "開示すべきか、差別か、法的に十分かは判断しない。",
    },
    {
        "id": "JA-05-work-contact-point-redesign",
        "title": "配慮項目でなく仕事接触点を再設計する",
        "problem_hypothesis": "配慮名や柔軟勤務制度だけでは、小規模職場、現場作業、安全、顧客対応、欠勤代替、人員余力が見えにくい。",
        "first_principles": ["FP-05-work-contact-points-are-the-design-unit", "FP-02-source-lenses-are-partial-not-hierarchical"],
        "stage1_routes": ["QR-03-worksite-contact-and-mobility"],
        "improvement_direction": "作業、身体、情報、道具、顧客、安全、代替人員、求人表示を職場接触点として分解する。",
        "practical_outputs": ["仕事接触点マップ", "小規模/現場/安全/顧客接触点の分解表", "求人表示と制度運用のずれ検査"],
        "current_policy_hold": "企業の不安や好事例を妥当性判断や汎用処方にしない。",
    },
    {
        "id": "JA-06-supporter-retranslation-capacity",
        "title": "支援機関の有無から支援者の再翻訳容量へ",
        "problem_hypothesis": "支援が相談先、紹介、会議、制度メニューとして扱われると、医療、生活、求人、職場、本人説明を誰が翻訳したかが見えにくい。",
        "first_principles": ["FP-07-support-is-retranslation-capacity", "FP-12-learning-loop-over-answer-delivery"],
        "stage1_routes": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-01-health-time-work-design"],
        "improvement_direction": "支援者学習、役割分担、紹介後戻り回路、地域ネットワークを再翻訳容量として記録する。",
        "practical_outputs": ["支援者再翻訳容量マップ", "紹介後戻り回路チェック", "地域ネットワークの翻訳面レビュー"],
        "current_policy_hold": "支援メニュー相関や支援者熱意を効果証明にしない。",
    },
    {
        "id": "JA-07-life-security-inside-employment-support",
        "title": "生活保障を就労支援の外側に出さない",
        "problem_hypothesis": "収入、医療費、制度カテゴリ、家族支援が生活問題として切り離されると、働く、休む、治療する、戻る、選び直す自由度が読めない。",
        "first_principles": ["FP-08-life-security-is-a-direct-freedom-axis", "FP-03-health-time-is-a-work-design-variable"],
        "stage1_routes": ["QR-04-life-security-sequencing", "QR-05-entry-prework-translation"],
        "improvement_direction": "生活保障を、入口選択、休職、短時間、復職、再就職、治療継続の順序制約として仕事設計へ戻す。",
        "practical_outputs": ["生活保障と仕事選択の順序表", "待つ/休む/戻る自由度チェック", "制度カテゴリ境界の構造記録"],
        "current_policy_hold": "給付、制度、政策の現行説明や妥当性判断はしない。",
    },
    {
        "id": "JA-08-entry-prework-and-detection",
        "title": "入口以前を準備不足でなく検出・体験・仕事像の過程として扱う",
        "problem_hypothesis": "相談や苦情がない、就職前支援中、訓練中という状態を、ニーズ不在や準備不足として読みやすい。",
        "first_principles": ["FP-09-entry-and-prework-are-participation-processes", "FP-01-condition-windows-are-interaction-windows"],
        "stage1_routes": ["QR-05-entry-prework-translation"],
        "improvement_direction": "検出導線、職場体験、仕事像、ストレス把握、生活リズム、開始後支援を入口前後の同一過程として扱う。",
        "practical_outputs": ["入口以前参加レビュー表", "相談なしをニーズ不在としない検出チェック", "体験から職務条件への翻訳表"],
        "current_policy_hold": "未就労や訓練段階をreadiness deficitにしない。",
    },
    {
        "id": "JA-09-quality-career-and-future-redesign",
        "title": "就職・定着を超えて役割・評価・将来を再設計する",
        "problem_hypothesis": "就職や定着が見えると、役割、処遇、学習、将来見通し、キャリア再設計が閉じている状態を見落としやすい。",
        "first_principles": ["FP-10-quality-is-role-value-and-future-translation", "FP-03-health-time-is-a-work-design-variable"],
        "stage1_routes": ["QR-07-quality-career-and-value-translation"],
        "improvement_direction": "参加品質を、役割、評価、処遇、学習、将来会話、健康時間変化への再設計として扱う。",
        "practical_outputs": ["参加品質レビュー表", "将来変化の会話条件カード", "条件付き遂行から価値への評価接続表"],
        "current_policy_hold": "満足度、勤続、好事例を成功証明にしない。",
    },
    {
        "id": "JA-10-learning-network-with-review-gates",
        "title": "静的ガイダンスではなくレビューゲート付き学習ネットワークへ",
        "problem_hypothesis": "配慮例、制度説明、好事例、Q&Aが静的に蓄積されるだけでは、反対仮説、境界例、結果学習、人間レビューがつながりにくい。",
        "first_principles": ["FP-12-learning-loop-over-answer-delivery", "FP-02-source-lenses-are-partial-not-hierarchical"],
        "stage1_routes": ["QR-08-condition-window-not-lookup", "QR-03-worksite-contact-and-mobility"],
        "improvement_direction": "観察、構造仮説、反対仮説、境界例、実装条件、結果、人間レビュー、source/support validityを分けて接続する。",
        "practical_outputs": ["候補命題カード", "反対仮説・境界例カード", "human review/source validity分離フロー"],
        "current_policy_hold": "未レビュー候補をpublic copyやruntime behaviorへ移さない。",
    },
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
        "artifact_id": "falcon-japan-improvement-agenda-from-ft03-first-principles-v0-2026-05-23",
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "japan_improvement_agenda_from_ft03_first_principles_unreviewed_no_promotion",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "inputs": [rel(path) for path in INPUTS],
        "central_thesis": "日本の改善課題は、制度メニューや個別配慮の不足だけでなく、条件窓、source lens、仕事接触点、健康時間、情報共有、生活保障、支援者再翻訳、評価、学習レビューをつなぐ設計能力の不足として整理できる可能性がある。",
        "agenda_items": AGENDA_ITEMS,
        "method_boundary": [
            "current_policy_claim_not_made",
            "legal_hr_medical_employment_finality_not_made",
            "support_validity_not_decided",
            "source_validity_not_decided",
            "public_release_not_approved",
        ],
    }
    validate(payload)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Falcon Japan Improvement Agenda From FT03 First Principles",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: Japan improvement agenda / from FT03 first principles / no text export / no promotion / unreviewed / public不可 / runtime未承認",
        "",
        "## Central Thesis",
        "",
        payload["central_thesis"],
        "",
        "これは現行政策の最新確認や制度評価ではなく、FT03 Core cutと第一原理から見える構造的な改善課題仮説である。",
        "",
        "## 10 Improvement Agenda Hypotheses",
        "",
    ]
    for item in AGENDA_ITEMS:
        lines.append(f"### {item['id']} {item['title']}")
        lines.append("")
        lines.append(f"課題仮説: {item['problem_hypothesis']}")
        lines.append("")
        lines.append(f"第一原理: {', '.join(f'`{p}`' for p in item['first_principles'])}")
        lines.append(f"Stage 1 route: {', '.join(f'`{r}`' for r in item['stage1_routes'])}")
        lines.append("")
        lines.append(f"改善方向: {item['improvement_direction']}")
        lines.append("")
        lines.append("具体成果物に落とすなら:")
        lines.extend(f"- {output}" for output in item["practical_outputs"])
        lines.append("")
        lines.append(f"current-policy hold: {item['current_policy_hold']}")
        lines.append("")
    lines.extend(["## Method Boundary", ""])
    lines.extend(f"- {item}" for item in payload["method_boundary"])
    lines.extend(["- raw/redacted text、field value、短い引用、PIIは外部化していない。"])
    lines.extend(["", "## Inputs", ""])
    lines.extend(f"- `{rel(path)}`" for path in INPUTS)
    lines.extend(["", f"JSON: `{rel(OUT_JSON)}`"])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"json": rel(OUT_JSON), "md": rel(OUT_MD), "agenda_items": len(AGENDA_ITEMS)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
