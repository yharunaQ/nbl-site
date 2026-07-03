#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
STAGE1_JSON = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18/stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
STAGE2_JSON = ROOT / "references/derived/scima-fchma/stage2-first-principles-v0-2026-05-19/falcon-first-principles-framework-from-stage1-v0-2026-05-19.json"
OUT_DIR = ROOT / "references/derived/scima-fchma/stage3-japan-improvement-agenda-v0-2026-05-19"
OUT_JSON = OUT_DIR / "falcon-japan-improvement-agenda-from-first-principles-v0-2026-05-19.json"
OUT_MD = OUT_DIR / "falcon-japan-improvement-agenda-from-first-principles-v0-2026-05-19.md"


AGENDA_ITEMS: list[dict[str, Any]] = [
    {
        "id": "JA-01-from-diagnosis-list-to-interaction-design",
        "title": "病名・障害名別配慮リストから、相互作用設計へ",
        "problem_hypothesis": "疾病名や障害種類を入口にした整理は必要だが、そこで止まると、仕事・環境・情報・時間・評価・支援との相互作用が見えにくくなる。",
        "first_principles": ["FP-01-interaction-before-attribute", "FP-11-minority-windows-are-discovery-windows"],
        "stage1_routes": ["QR-08-diversity-conditioned-same-structure"],
        "improvement_direction": "障害種類や疾病群を固定分類として使わず、同じ構造がどの条件窓で別形態を取るかを記録・比較する。配慮名ではなく、仕事接触点、情報形式、健康時間、評価条件のどこが変わるかを中心にする。",
        "practical_outputs": [
            "条件窓別の同型構造マップ",
            "少数条件窓を消さないレビュー単位",
            "疾病名・障害種類からoperatorへ戻す検索表",
        ],
        "risk_if_ignored": "多数派の疾病群・障害種類の平均的特徴に引きずられ、少数条件窓に必要な具体的な仕事設計が薄くなる。",
    },
    {
        "id": "JA-02-health-time-as-work-design",
        "title": "体調変動・治療時間を、仕事設計の中心へ",
        "problem_hypothesis": "体調変動、疲労、痛み、通院、回復は本人側の事情として処理されやすく、勤務量、休憩、職務代替、評価、継続可能性へ十分に翻訳されない可能性がある。",
        "first_principles": ["FP-03-health-time-is-work-design", "FP-02-same-structure-open-closed"],
        "stage1_routes": ["QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
        "improvement_direction": "健康時間を、勤務時間短縮という単独配慮ではなく、責任遂行、回復、治療、評価、生活保障を同期する仕事設計面として扱う。",
        "practical_outputs": [
            "健康時間から仕事条件への翻訳シート",
            "発生・軽減・残余を同じ構造で比較するケースレビュー",
            "評価条件と健康時間の接続点リスト",
        ],
        "risk_if_ignored": "本人の体調不安定さだけが問題化され、仕事側の時間構造や評価構造が固定されたままになる。",
    },
    {
        "id": "JA-03-information-to-procedure",
        "title": "情報保障を、仕事手順・安全確認・評価へ落とす",
        "problem_hypothesis": "情報保障や説明が、情報提供やコミュニケーション支援にとどまり、作業手順、責任分担、安全確認、評価、相談経路へ接続されない可能性がある。",
        "first_principles": ["FP-04-information-must-become-work-procedure", "FP-06-disclosure-is-boundary-design"],
        "stage1_routes": ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation"],
        "improvement_direction": "情報を、誰が受け取るかだけでなく、どの形式で、どの仕事場面に、どの確認手順と責任配置で実装されるかまで設計する。",
        "practical_outputs": [
            "情報から作業手順への変換テンプレート",
            "安全確認・評価・相談経路への接続チェック",
            "開示境界と情報共有範囲の設計表",
        ],
        "risk_if_ignored": "本人の説明能力や職場理解の問題として処理され、仕事側の確認可能性と責任所在が曖昧になる。",
    },
    {
        "id": "JA-04-work-contact-point-redesign",
        "title": "配慮項目ではなく、仕事接触点を再設計する",
        "problem_hypothesis": "設備、通勤、動線、道具、作業場所、マニュアル、安全確認が、配慮項目として列挙される一方で、仕事参加のどの接触点を開くのかが見えにくい可能性がある。",
        "first_principles": ["FP-05-work-contact-points-are-the-design-unit", "FP-11-minority-windows-are-discovery-windows"],
        "stage1_routes": ["QR-03-worksite-contact-and-mobility", "QR-08-diversity-conditioned-same-structure"],
        "improvement_direction": "支援名や設備名ではなく、移動、姿勢、情報、安全、職務代替、評価、健康時間のどの接触点を変えるかを設計単位にする。",
        "practical_outputs": [
            "仕事接触点マップ",
            "視覚・聴覚・肢体・内部障害・認知条件窓ごとの接触点変形例",
            "接触点と評価・安全・健康時間の関係表",
        ],
        "risk_if_ignored": "同じ配慮名が異なる条件窓で別の意味を持つことが見えず、実装が表面的になる。",
    },
    {
        "id": "JA-05-support-as-retranslation-loop",
        "title": "支援機関の有無から、再翻訳ループの設計へ",
        "problem_hypothesis": "支援が、相談先、制度メニュー、支援者同席の有無として記録される一方で、何をどの局面で再翻訳したのかが見えにくい可能性がある。",
        "first_principles": ["FP-07-support-is-retranslation-not-presence", "FP-12-learning-loop-over-answer-delivery"],
        "stage1_routes": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-01-health-time-work-design"],
        "improvement_direction": "支援を、本人条件、求人条件、職場条件、医療条件、生活条件を就職前・就職後・復職・変更局面で再翻訳する機能として設計・記録する。",
        "practical_outputs": [
            "支援者の翻訳機能マップ",
            "局面別の再翻訳チェック",
            "支援が担った条件と担っていない条件の記録",
        ],
        "risk_if_ignored": "支援の存在が支援の有効性として誤読され、支援品質や役割分担の学習が進みにくい。",
    },
    {
        "id": "JA-06-life-security-inside-work-choice",
        "title": "生活保障を、仕事選択の自由度として扱う",
        "problem_hypothesis": "収入、医療費、休業時保障、家計責任、雇用形態、制度対象が、就労支援の外側の生活問題として扱われ、仕事選択や健康時間との関係が切れる可能性がある。",
        "first_principles": ["FP-08-life-security-shapes-choice", "FP-03-health-time-is-work-design"],
        "stage1_routes": ["QR-04-life-security-sequencing", "QR-05-entry-prework-translation"],
        "improvement_direction": "生活保障を、待つ、休む、治療する、戻る、選び直す自由度を変える制約面として、仕事設計と支援接続の中に位置づける。",
        "practical_outputs": [
            "生活保障と仕事選択の順序マップ",
            "休業・短時間・復職・再就職の自由度比較",
            "生活再建と入口以前参加の接続表",
        ],
        "risk_if_ignored": "本人の意欲や準備性として誤読され、実際には選択肢が狭まっている構造が見えなくなる。",
    },
    {
        "id": "JA-07-participation-quality-and-pre-entry",
        "title": "就職・定着だけでなく、参加の質と入口以前を見る",
        "problem_hypothesis": "就職できたか、定着したかに焦点が寄ると、役割、技能、評価、処遇、働きがい、将来見通しの閉鎖や、応募前の生活・訓練・自信の自由度が見えにくい可能性がある。",
        "first_principles": ["FP-09-participation-has-depth-and-before-entry", "FP-10-evaluation-converts-performance-to-value"],
        "stage1_routes": ["QR-07-quality-career-and-value-translation", "QR-05-entry-prework-translation"],
        "improvement_direction": "仕事参加を、入口以前、入口、継続、役割拡大、評価、処遇、キャリアの連続構造として読む。",
        "practical_outputs": [
            "参加品質の構造レビュー表",
            "入口以前参加から求人条件への翻訳表",
            "条件付き遂行を価値へ変える評価接続表",
        ],
        "risk_if_ignored": "働けているように見えるが参加品質が閉じている人、応募前に自由度を失っている人が知識化されない。",
    },
    {
        "id": "JA-08-disclosure-boundary-protection",
        "title": "開示負担を本人に集中させず、境界を設計する",
        "problem_hypothesis": "開示が、本人がどこまで話すか、企業が理解するかという二者問題として扱われ、翻訳責任、プライバシー保護、支援者の媒介、仕事手順化が分離する可能性がある。",
        "first_principles": ["FP-06-disclosure-is-boundary-design", "FP-04-information-must-become-work-procedure"],
        "stage1_routes": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-02-information-work-procedure"],
        "improvement_direction": "開示を、本人の尊厳とプライバシーを守りながら、仕事実行に必要な条件を実務言語へ翻訳する境界設計として扱う。",
        "practical_outputs": [
            "開示境界の設計パターン",
            "本人・企業・支援者の翻訳責任分担表",
            "開示情報が接続される仕事手順の記録",
        ],
        "risk_if_ignored": "本人の説明責任が過重になり、職場理解や支援者同席が実務手順へ落ちない。",
    },
    {
        "id": "JA-09-learning-network-instead-of-static-guidance",
        "title": "静的ガイダンスから、学習する専門知識ネットワークへ",
        "problem_hypothesis": "支援知識が、配慮例、制度説明、好事例、相談Q&Aとして静的に蓄積されるだけでは、反対仮説、境界例、実装条件、結果学習が更新されにくい可能性がある。",
        "first_principles": ["FP-12-learning-loop-over-answer-delivery", "FP-02-same-structure-open-closed"],
        "stage1_routes": ["QR-01-health-time-work-design", "QR-02-information-work-procedure", "QR-08-diversity-conditioned-same-structure"],
        "improvement_direction": "観察、構造仮説、反対仮説、境界例、実装条件、結果、レビューを接続し、静的情報ではなく評価可能な専門知識として更新する。",
        "practical_outputs": [
            "候補命題・反対命題・境界例の標準カード",
            "実装条件と結果の学習リンク",
            "人間レビューを通じた知識昇格フロー",
        ],
        "risk_if_ignored": "好事例や配慮例が文脈から切り離され、別条件での再利用時に誤解や過剰一般化が起きる。",
    },
]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def build_agenda() -> dict[str, Any]:
    stage1 = load_json(STAGE1_JSON)
    stage2 = load_json(STAGE2_JSON)
    return {
        "run_id": "stage3-japan-improvement-agenda-v0-2026-05-19",
        "artifact_id": "falcon-japan-improvement-agenda-from-first-principles-v0-2026-05-19",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "purpose": "Outcome 1専門知識ネットワークとOutcome 2第一原理から、日本の障害者就労支援を読む改善課題仮説を構造化する。",
        "method_boundary": [
            "current_policy_claim_not_made",
            "legal_hr_medical_employment_finality_not_made",
            "support_validity_not_decided",
            "source_validity_not_decided",
            "public_release_not_approved",
        ],
        "source_artifacts": {
            "stage1_codex_chat_knowledge_network": str(STAGE1_JSON.relative_to(ROOT)),
            "stage2_first_principles_framework": str(STAGE2_JSON.relative_to(ROOT)),
        },
        "source_counts": {
            "stage1_query_routes": len(stage1["query_routes"]),
            "stage2_principles": len(stage2["principles"]),
            "agenda_items": len(AGENDA_ITEMS),
        },
        "central_thesis": "日本の改善課題は、個別配慮や制度メニューの不足だけでなく、人間の多様性を仕事・環境・情報・時間・評価・支援・制度の相互作用として読み、設計・学習する仕組みの不足として整理できる可能性がある。",
        "agenda_items": AGENDA_ITEMS,
    }


def write_markdown(agenda: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Falcon Japan Improvement Agenda From First Principles",
        "",
        "作成日: 2026-05-19",
        "状態: 機械生成 / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "これは、Outcome 1のCodex用専門知識ネットワークとOutcome 2の第一原理フレームから導いた、日本の障害者就労支援を読むための改善課題仮説である。現行政策の最新確認や制度評価ではなく、Falconネットワーク自身の情報から見える構造的な改善方向を整理する。",
        "",
        "## 中心命題",
        "",
        agenda["central_thesis"],
        "",
        "## 9つの改善課題仮説",
        "",
    ]
    for item in agenda["agenda_items"]:
        lines.extend(
            [
                f"### {item['id']} {item['title']}",
                "",
                f"課題仮説: {item['problem_hypothesis']}",
                "",
                f"第一原理: {', '.join(f'`{principle}`' for principle in item['first_principles'])}",
                f"Stage 1 route: {', '.join(f'`{route}`' for route in item['stage1_routes'])}",
                "",
                f"改善方向: {item['improvement_direction']}",
                "",
                "具体成果物に落とすなら:",
            ]
        )
        for output in item["practical_outputs"]:
            lines.append(f"- {output}")
        lines.extend(["", f"見落とした時のリスク: {item['risk_if_ignored']}", ""])

    lines.extend(
        [
            "## ③の使い方",
            "",
            "このagendaは、制度批判や提言文そのものではなく、Falconが日本の改善課題を第一原理から読むための骨格である。次にやるべきことは、各agenda itemを、調査データの代表ID・境界ID・反対構造候補ID、workshop/NIVR/web-cacheの断片資料slot、実装主体条件へ接続し、改善策を評価可能な仮説として展開すること。",
            "",
            "現時点では、法的判断、政策妥当性判断、雇用管理上の最終判断、個別支援の正解提示はしない。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    agenda = build_agenda()
    OUT_JSON.write_text(json.dumps(agenda, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(agenda)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
