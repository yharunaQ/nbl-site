#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
STAGE1_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_DIR = ROOT / "references/derived/scima-fchma/stage2-first-principles-v0-2026-05-19"
SOURCE_JSON = STAGE1_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
OUT_JSON = OUT_DIR / "falcon-first-principles-framework-from-stage1-v0-2026-05-19.json"
OUT_MD = OUT_DIR / "falcon-first-principles-framework-from-stage1-v0-2026-05-19.md"


PRINCIPLES: list[dict[str, Any]] = [
    {
        "id": "FP-01-interaction-before-attribute",
        "name": "属性より先に相互作用を見る",
        "one_line": "障害や疾病は仕事の可否を直接決めるラベルではなく、人・仕事・環境・支援・時間・制度の相互作用を読む条件窓である。",
        "why_it_matters": "疾病名や障害種類でまとめると、多数派の特徴に引きずられ、少数条件窓に固有の仕事接触点が消える。Falconは属性分類を入口にしても、説明の中心を相互作用へ戻す。",
        "network_basis": {
            "routes": ["QR-08-diversity-conditioned-same-structure"],
            "operators": ["OP-01-translate-condition-to-work", "OP-03-design-work-contact-point"],
            "branches": ["CB-06-minority-window-revival"],
        },
        "practical_question": "この困難または軽減は、個人属性ではなく、どの相互作用の形として現れているか。",
    },
    {
        "id": "FP-02-same-structure-open-closed",
        "name": "問題と解決を同じ構造の開閉として読む",
        "one_line": "困難が発生しているケースと、配慮・支援により発生していないケースは、別物ではなく同じ構造の自由度が閉じた状態と開いた状態として比較できる。",
        "why_it_matters": "問題中心に読むと、支援のある軽減側が知識化されない。Falconは発生、軽減、残余、境界を同じ地図に載せることで、設計可能な自由度を発見する。",
        "network_basis": {
            "routes": ["QR-01-health-time-work-design", "QR-03-worksite-contact-and-mobility"],
            "operators": ["OP-07-update-loop"],
            "branches": ["CB-01-continuity-quality-loop", "CB-02-work-contact-evaluation-loop"],
        },
        "practical_question": "同じ構造のどの自由度が開いている時に困難が軽くなり、閉じている時に困難が表面化するか。",
    },
    {
        "id": "FP-03-health-time-is-work-design",
        "name": "健康時間は仕事設計である",
        "one_line": "体調変動、疲労、痛み、通院、回復、再発は、医学的背景だけでなく、勤務量、休憩、役割、評価、継続可能性へ翻訳すべき仕事設計条件である。",
        "why_it_matters": "健康条件を本人側の不安定さとして扱うと、仕事側の時間構造を固定したままになる。Falconは健康時間を、責任遂行と継続可能性を同時に設計する自由度として読む。",
        "network_basis": {
            "routes": ["QR-01-health-time-work-design", "QR-04-life-security-sequencing"],
            "operators": ["OP-01-translate-condition-to-work", "OP-05-translate-performance-to-value"],
            "branches": ["CB-01-continuity-quality-loop", "CB-03-life-security-sequencing"],
        },
        "practical_question": "健康時間は、勤務時間、休憩、欠勤扱い、職務代替、評価条件へどう翻訳されているか。",
    },
    {
        "id": "FP-04-information-must-become-work-procedure",
        "name": "情報は仕事手順になって初めて参加を支える",
        "one_line": "情報保障や説明は、情報を受け取ること自体では完結せず、作業手順、安全確認、責任分担、評価、相談経路へ接続して初めて仕事参加の自由度になる。",
        "why_it_matters": "情報問題を本人の会話能力や説明能力へ縮めると、仕事側の確認可能性や責任所在が見えなくなる。Falconは情報を、仕事の実行条件へ落とす結節として読む。",
        "network_basis": {
            "routes": ["QR-02-information-work-procedure", "QR-06-disclosure-boundary-and-mutual-translation"],
            "operators": ["OP-02-synchronize-information", "OP-03-design-work-contact-point"],
            "branches": ["CB-04-information-work-procedure-knot"],
        },
        "practical_question": "必要な情報は、誰に、どの形式で、どの作業・確認・評価・安全手順へ接続されているか。",
    },
    {
        "id": "FP-05-work-contact-points-are-the-design-unit",
        "name": "仕事接触点を設計単位にする",
        "one_line": "設備、通勤、動線、姿勢、作業場所、道具、マニュアル、安全確認は配慮項目のリストではなく、人が仕事へ接触する点を変える設計単位である。",
        "why_it_matters": "同じ『移動』でも、視覚、聴覚、肢体、認知、内部障害では有効な接触点が違う。Falconは支援名ではなく、仕事参加の接触点がどう変わるかを読む。",
        "network_basis": {
            "routes": ["QR-03-worksite-contact-and-mobility", "QR-08-diversity-conditioned-same-structure"],
            "operators": ["OP-03-design-work-contact-point", "OP-01-translate-condition-to-work"],
            "branches": ["CB-02-work-contact-evaluation-loop", "CB-06-minority-window-revival"],
        },
        "practical_question": "この支援・環境・道具は、仕事参加のどの接触点を変えているか。",
    },
    {
        "id": "FP-06-disclosure-is-boundary-design",
        "name": "開示は告白ではなく境界設計である",
        "one_line": "病名や障害名を話すかどうかではなく、仕事実行に関係する条件を、誰に、どこまで、どの言葉で、どの手順へ接続するかが開示境界の核心である。",
        "why_it_matters": "開示を本人の勇気や企業理解へ丸めると、翻訳責任とプライバシー保護の両方が曖昧になる。Falconは開示を、相互翻訳と保護境界の設計として読む。",
        "network_basis": {
            "routes": ["QR-06-disclosure-boundary-and-mutual-translation", "QR-05-entry-prework-translation"],
            "operators": ["OP-06-protect-disclosure-boundary", "OP-02-synchronize-information"],
            "branches": ["CB-04-information-work-procedure-knot", "CB-05-entry-prework-translation"],
        },
        "practical_question": "仕事に必要な条件だけを、本人の尊厳とプライバシーを守りながら、どの実務言語へ翻訳するか。",
    },
    {
        "id": "FP-07-support-is-retranslation-not-presence",
        "name": "支援は存在ではなく再翻訳機能である",
        "one_line": "支援の価値は、相談先や制度メニューがあることではなく、本人条件、求人条件、職場条件、医療条件、生活条件を変化局面で再翻訳できることにある。",
        "why_it_matters": "支援の有無を成功・失敗の代替指標にすると、支援が何を担ったのかが消える。Falconは支援者を、翻訳、接続、役割分担、更新ループの機能として読む。",
        "network_basis": {
            "routes": ["QR-01-health-time-work-design", "QR-06-disclosure-boundary-and-mutual-translation"],
            "operators": ["OP-07-update-loop", "OP-02-synchronize-information"],
            "branches": ["CB-01-continuity-quality-loop", "CB-04-information-work-procedure-knot"],
        },
        "practical_question": "支援は、どの条件を、どの局面で、誰に向けて再翻訳しているか。",
    },
    {
        "id": "FP-08-life-security-shapes-choice",
        "name": "生活保障は仕事選択の自由度を形づくる",
        "one_line": "収入、医療費、休業時保障、家計責任、制度対象、雇用形態は背景情報ではなく、待つ、休む、戻る、選び直す自由度を変える制約面である。",
        "why_it_matters": "生活保障を就労意欲や一般的生活問題へ押し出すと、仕事選択と健康時間の実際の自由度が読めなくなる。Falconは生活保障を仕事設計の外側ではなく接触面として読む。",
        "network_basis": {
            "routes": ["QR-04-life-security-sequencing", "QR-05-entry-prework-translation"],
            "operators": ["OP-04-sequence-entry-and-life-security", "OP-07-update-loop"],
            "branches": ["CB-03-life-security-sequencing", "CB-05-entry-prework-translation"],
        },
        "practical_question": "生活保障の状態は、仕事を始める、続ける、休む、戻る、選び直す順序をどう変えているか。",
    },
    {
        "id": "FP-09-participation-has-depth-and-before-entry",
        "name": "参加には深さと入口以前がある",
        "one_line": "仕事参加は就職入口と定着だけでは閉じず、上方向には役割、技能、評価、処遇、働きがいがあり、入口以前には生活リズム、体力、日中活動、訓練、自信がある。",
        "why_it_matters": "就職できたか、定着したかだけを見ると、働き続けながら参加品質が閉じている人と、応募前に自由度を失っている人が見えない。Falconは参加を時間軸と深さの両方で読む。",
        "network_basis": {
            "routes": ["QR-07-quality-career-and-value-translation", "QR-05-entry-prework-translation"],
            "operators": ["OP-05-translate-performance-to-value", "OP-04-sequence-entry-and-life-security"],
            "branches": ["CB-01-continuity-quality-loop", "CB-05-entry-prework-translation"],
        },
        "practical_question": "この人の参加は、入口以前、就職入口、継続、役割拡大、評価、将来見通しのどこで開閉しているか。",
    },
    {
        "id": "FP-10-evaluation-converts-performance-to-value",
        "name": "評価は遂行を価値へ翻訳する装置である",
        "one_line": "条件付き遂行が仕事の価値として認識されなければ、働けていても役割、技能、処遇、キャリアへ接続されない。",
        "why_it_matters": "職場適応を継続だけで見ると、評価されない努力や将来見通しの閉鎖が消える。Falconは評価を、仕事参加の質を開く翻訳装置として読む。",
        "network_basis": {
            "routes": ["QR-07-quality-career-and-value-translation", "QR-01-health-time-work-design"],
            "operators": ["OP-05-translate-performance-to-value", "OP-07-update-loop"],
            "branches": ["CB-01-continuity-quality-loop", "CB-02-work-contact-evaluation-loop"],
        },
        "practical_question": "条件付きで遂行された仕事は、どの評価基準で役割、技能、処遇、将来見通しへ変換されているか。",
    },
    {
        "id": "FP-11-minority-windows-are-discovery-windows",
        "name": "少数条件窓は発見窓である",
        "one_line": "件数が小さい分枝は捨てるべきノイズではなく、多数派に吸収されると見えなくなる接触点や自由度を発見する窓である。",
        "why_it_matters": "多数派の平均構造だけでは、視覚、聴覚、内部障害、認知・発達、複合条件などで必要な具体設計が薄くなる。Falconは少数窓を、同型構造の別形態として復活させる。",
        "network_basis": {
            "routes": ["QR-08-diversity-conditioned-same-structure", "QR-03-worksite-contact-and-mobility"],
            "operators": ["OP-01-translate-condition-to-work", "OP-03-design-work-contact-point"],
            "branches": ["CB-06-minority-window-revival"],
        },
        "practical_question": "少数条件窓にだけ見える接触点は、どの上位構造の別形態として読めるか。",
    },
    {
        "id": "FP-12-learning-loop-over-answer-delivery",
        "name": "答えを渡すより、学習する構造を作る",
        "one_line": "Falconの役割は正解を配布することではなく、観察、構造仮説、反対仮説、実装、結果、再学習をつなぐ専門知識ネットワークを育てることである。",
        "why_it_matters": "障害者就労支援では、個別性と制度・職場条件の差が大きい。Falconは未レビュー候補を人間レビューと実践学習へ接続し、断定ではなく評価可能な知識を作る。",
        "network_basis": {
            "routes": ["QR-01-health-time-work-design", "QR-02-information-work-procedure", "QR-08-diversity-conditioned-same-structure"],
            "operators": ["OP-07-update-loop"],
            "branches": ["CB-01-continuity-quality-loop", "CB-06-minority-window-revival"],
        },
        "practical_question": "この仮説は、どの観察、反対仮説、境界例、実装条件、結果学習へ接続されているか。",
    },
]


FRAME_LAYERS = [
    {
        "id": "L1-condition-window",
        "name": "条件窓",
        "description": "疾病、障害種類、身体・精神・感覚・認知・内部障害、年齢、生活条件など。説明の中心ではなく、構造がどの形を取るかを変える窓。",
    },
    {
        "id": "L2-work-design-surface",
        "name": "仕事設計面",
        "description": "勤務量、時間、休憩、通勤、作業場所、道具、手順、情報形式、安全確認、職務代替、評価条件。",
    },
    {
        "id": "L3-translation-mechanism",
        "name": "翻訳機構",
        "description": "本人条件を仕事条件へ、求人条件を本人の生活・健康・支援条件へ、遂行を価値へ翻訳する機能。",
    },
    {
        "id": "L4-freedom-state",
        "name": "自由度状態",
        "description": "困難発生、軽減、残余、境界、移行、上方向参加、入口以前参加など、同じ構造が開閉する状態。",
    },
    {
        "id": "L5-learning-loop",
        "name": "学習ループ",
        "description": "観察、候補命題、反対命題、境界例、実装条件、結果、再翻訳、人間レビューをつなぐ循環。",
    },
]


def load_network() -> dict[str, Any]:
    return json.loads(SOURCE_JSON.read_text(encoding="utf-8"))


def build_framework() -> dict[str, Any]:
    network = load_network()
    route_by_id = {route["route_id"]: route for route in network["query_routes"]}
    return {
        "run_id": "stage2-first-principles-v0-2026-05-19",
        "artifact_id": "falcon-first-principles-framework-from-stage1-v0-2026-05-19",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "purpose": "Outcome 1のCodex-usable専門知識ネットワークから、Outcome 2の第一原理フレームを導出する。",
        "source_artifact": str(SOURCE_JSON.relative_to(ROOT)),
        "source_network_counts": {
            "query_routes": len(network["query_routes"]),
            "operators": len(network["network_nodes"]["operators"]),
            "context_branches": len(network["network_nodes"]["context_branches"]),
            "fragmentary_grammar_rules": len(network["network_nodes"]["fragmentary_grammar_summary"]),
        },
        "frame_layers": FRAME_LAYERS,
        "principles": PRINCIPLES,
        "route_to_principles": {
            route_id: [
                principle["id"]
                for principle in PRINCIPLES
                if route_id in principle["network_basis"]["routes"]
            ]
            for route_id in route_by_id
        },
        "how_to_use_in_codex_chat": [
            "ユーザーの問いをStage 1のquery routeへ割り当てる。",
            "routeに接続されたprincipleを選ぶ。",
            "principleを、条件窓、仕事設計面、翻訳機構、自由度状態、学習ループの5層へ展開する。",
            "個別判断や支援妥当性ではなく、評価可能な構造仮説として返す。",
            "必要ならOutcome 3の日本改善課題へ、どの第一原理が欠けている社会設計かとして橋渡しする。",
        ],
    }


def write_markdown(framework: dict[str, Any]) -> None:
    lines: list[str] = [
        "# Falcon First Principles Framework From Stage 1",
        "",
        "作成日: 2026-05-19",
        "状態: 機械生成 / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "これは、Stage 1のCodex用専門知識ネットワークから直接導いた、Falconの第一原理フレームである。抽象理念から作った宣言ではなく、調査データ、workshop、NIVR/web-cache断片資料をSCIMA/FCHMAで整理した結果から、Falconが世界をどう読むかを人間に分かる形へ圧縮したもの。",
        "",
        "## 中心命題",
        "",
        "障害者就労支援の中核は、個人を仕事へ合わせることではない。人間の多様性を条件窓として読み、人・仕事・環境・情報・時間・評価・支援・制度の相互作用を再設計することで、働く自由度を増やすことである。",
        "",
        "## 5層モデル",
        "",
        "| layer | 意味 |",
        "|---|---|",
    ]
    for layer in framework["frame_layers"]:
        lines.append(f"| `{layer['id']}` {layer['name']} | {layer['description']} |")

    lines.extend(["", "## 12 First Principles", ""])
    for principle in framework["principles"]:
        basis = principle["network_basis"]
        lines.extend(
            [
                f"### {principle['id']} {principle['name']}",
                "",
                principle["one_line"],
                "",
                f"なぜ重要か: {principle['why_it_matters']}",
                "",
                f"実務上の問い: {principle['practical_question']}",
                "",
                "Stage 1接続:",
                f"- routes: {', '.join(f'`{item}`' for item in basis['routes'])}",
                f"- operators: {', '.join(f'`{item}`' for item in basis['operators'])}",
                f"- branches: {', '.join(f'`{item}`' for item in basis['branches'])}",
                "",
            ]
        )

    lines.extend(
        [
            "## Route To Principles",
            "",
            "| Stage 1 route | 対応する第一原理 |",
            "|---|---|",
        ]
    )
    for route_id, principle_ids in framework["route_to_principles"].items():
        lines.append(f"| `{route_id}` | {', '.join(f'`{item}`' for item in principle_ids)} |")

    lines.extend(
        [
            "",
            "## Codexでの使い方",
            "",
        ]
    )
    for item in framework["how_to_use_in_codex_chat"]:
        lines.append(f"- {item}")

    lines.extend(
        [
            "",
            "## ②から③への橋",
            "",
            "Outcome 3では、この第一原理を使って日本の改善課題を読む。たとえば、健康時間が仕事設計へ翻訳されない社会設計、情報が仕事手順へ落ちない職場設計、生活保障が仕事選択の自由度を狭める制度設計、少数条件窓が多数派平均へ吸収される知識設計、といった形で、課題を第一原理から整理できる。",
            "",
            "この段階では、政策・制度・法的・雇用管理上の最終判断はしない。Falconが提示するのは、改善課題を評価可能にするための構造仮説である。",
        ]
    )
    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    framework = build_framework()
    OUT_JSON.write_text(json.dumps(framework, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(framework)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
