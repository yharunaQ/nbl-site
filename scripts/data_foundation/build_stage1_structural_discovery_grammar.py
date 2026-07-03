#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
COOCCURRENCE_JSON = RUN_DIR / "stage1-production-overlap-discovery-cooccurrence-map-v0-2026-05-18.json"
DEEP_READING_JSON = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.md"


OPERATORS = [
    {
        "operator_id": "OP-01-translate-condition-to-work",
        "name": "本人条件を仕事条件へ翻訳する",
        "function": "疾病・障害・機能条件を、勤務量、作業手順、情報形式、休憩、通勤、評価条件、相談手順などへ翻訳する。",
        "failure_mode": "本人説明、診断名、配慮項目、支援利用の有無で止まり、実際の仕事条件へ落ちない。",
        "icf_contact": ["body_functions", "activities", "participation", "environmental_factors"],
    },
    {
        "operator_id": "OP-02-synchronize-information",
        "name": "必要情報を必要場面へ同期する",
        "function": "業務指示、非公式情報、安全確認、体調変動、相談、評価、復帰時情報を、必要な相手・タイミング・形式へ同期する。",
        "failure_mode": "情報共有量や資料形式だけで評価し、どの職務場面へ届いたかを読まない。",
        "icf_contact": ["activities", "participation", "environmental_factors"],
    },
    {
        "operator_id": "OP-03-design-work-contact-point",
        "name": "仕事接触点を設計する",
        "function": "作業場所、動線、姿勢、手順、設備、休憩、代替作業、安全確認、プライバシー、尊厳を、仕事と本人条件の接触面として分解する。",
        "failure_mode": "設備リストや障害種類別対応表に落ち、健康時間・評価・情報同期との接続が消える。",
        "icf_contact": ["activities", "participation", "environmental_factors"],
    },
    {
        "operator_id": "OP-04-sequence-entry-and-life-security",
        "name": "入口と生活保障の順序を組む",
        "function": "待てる時間、休める条件、治療継続、訓練、求人選択、支援接続、再入口の順序を読む。",
        "failure_mode": "未就労を本人準備不足、求人不足、意欲、困窮の説明へ戻す。",
        "icf_contact": ["participation", "environmental_factors", "personal_context"],
    },
    {
        "operator_id": "OP-05-translate-performance-to-value",
        "name": "条件付き遂行を価値へ翻訳する",
        "function": "健康時間や支援を含む条件付き遂行が、役割、評価、処遇、技能形成、将来見通しへどう変換されるかを読む。",
        "failure_mode": "働けていることを解決済みと読む、または標準的な量・速度だけで価値を読む。",
        "icf_contact": ["participation", "environmental_factors"],
    },
    {
        "operator_id": "OP-06-protect-disclosure-boundary",
        "name": "開示・説明境界を保護する",
        "function": "何を、誰へ、どの職務条件に、どの範囲で翻訳するかを読み、不利益、誤解、本人負荷、プライバシーを同時に扱う。",
        "failure_mode": "言う/言わない、説明量、本人説明能力の問題へ還元する。",
        "icf_contact": ["participation", "environmental_factors", "personal_context"],
    },
    {
        "operator_id": "OP-07-update-loop",
        "name": "変化に応じて再同期する",
        "function": "体調、職務、評価、支援体制、生活条件、移行局面の変化に合わせて、構造を再翻訳・再同期する。",
        "failure_mode": "一度の配慮、制度利用、説明、訓練で構造が閉じたと扱う。",
        "icf_contact": ["body_functions", "activities", "participation", "environmental_factors"],
    },
]


GRAMMAR_RULES = [
    {
        "grammar_id": "SG-01-continuity-quality-loop",
        "name": "就労継続の質を読む循環文法",
        "source_meta_ids": ["OM-01-continuity-quality-engine"],
        "source_od_ids": [],
        "operators": ["OP-01-translate-condition-to-work", "OP-02-synchronize-information", "OP-05-translate-performance-to-value", "OP-07-update-loop"],
        "rule": "健康時間が仕事遂行へ入り、情報同期がその条件を職務場面へ届け、評価翻訳が遂行を価値化し、変化時に再同期できるかを見る。",
        "open_state": "健康時間、情報、評価が相互に更新され、条件付き遂行が役割・技能・将来見通しへつながる。",
        "closed_state": "働いている事実はあるが、健康時間の自己負担、情報不同期、評価不透明、将来見通しの弱さが残る。",
        "diversity_anchor_reading": "慢性疾患では症状変動と通院、聴覚・視覚では情報同期、認知・精神心理では手順と予測可能性、内部障害では見えにくい健康管理が主要接触点を変える。",
        "counter_structure": "現在就労中の多数派に見えるため、単なる継続困難や支援不足の一般論として読まれている可能性。",
    },
    {
        "grammar_id": "SG-02-work-contact-evaluation-loop",
        "name": "仕事接触点が評価と健康時間を同時に変える文法",
        "source_meta_ids": ["OM-02-worksite-evaluation-contact-engine"],
        "source_od_ids": [],
        "operators": ["OP-03-design-work-contact-point", "OP-01-translate-condition-to-work", "OP-05-translate-performance-to-value"],
        "rule": "作業場所、動線、休憩、手順、代替作業、プライバシーなどの仕事接触点が、健康時間だけでなく評価・役割・将来見通しをどう変えるかを見る。",
        "open_state": "接触点が職務単位へ分解され、本人条件を守る調整が仕事価値として読まれる。",
        "closed_state": "配慮項目はあるが、実作業・評価・役割へ落ちず、本人負荷や価値低下として残る。",
        "diversity_anchor_reading": "視覚では移動安全と資料、聴覚では安全確認と非公式情報、内部障害では排泄・服薬・休憩、身体動作では動線・姿勢・重量が接触点を変える。",
        "counter_structure": "設備や配慮名に強い信号があり、評価翻訳まで読めていない可能性。",
    },
    {
        "grammar_id": "SG-03-life-security-sequencing",
        "name": "生活保障が仕事・健康・支援の順序を変える文法",
        "source_meta_ids": ["OM-03-health-contact-life-security-sequence", "OM-05-sparse-information-life-security-knot"],
        "source_od_ids": [],
        "operators": ["OP-04-sequence-entry-and-life-security", "OP-01-translate-condition-to-work", "OP-07-update-loop"],
        "rule": "収入、医療費、家計責任、休業時保障、制度対象境界が、待つ、休む、治療する、選ぶ、支援につながる順序をどう変えるかを見る。",
        "open_state": "生活保障面が、健康時間を守る探索、支援接続、再入口の順序を支える。",
        "closed_state": "生活制約が強く、条件に合わない入口、自己消耗的継続、支援未接続へ急がされる。",
        "diversity_anchor_reading": "治療時間のある疾患では医療・休業、過去就業では再入口、精神心理・認知条件では相談継続と予測可能性が強く修飾する。",
        "counter_structure": "生活保障に見える信号が、実際には評価翻訳、職務設計、支援接続の途切れを表している可能性。",
    },
    {
        "grammar_id": "SG-04-information-to-work-procedure-knot",
        "name": "情報を仕事手順へ落とす結節文法",
        "source_meta_ids": ["OM-04-information-worksite-translation-knot", "OM-05-sparse-information-life-security-knot"],
        "source_od_ids": [],
        "operators": ["OP-02-synchronize-information", "OP-03-design-work-contact-point", "OP-01-translate-condition-to-work", "OP-06-protect-disclosure-boundary"],
        "rule": "情報保障、職場環境、支援を分けず、情報が作業手順、安全確認、相談場面、評価場面へどう職務化されるかを見る。",
        "open_state": "情報が職務場面ごとの手順・確認・役割へ変換され、翻訳主体と更新ループが明確になる。",
        "closed_state": "情報は伝わるが、手順、動線、安全、評価、支援責任へ落ちず、本人説明負荷が残る。",
        "diversity_anchor_reading": "聴覚では非公式情報と安全確認、視覚では案内と動線、認知・高次脳では手順分解、内部障害では見えない健康管理とプライバシーが結節点を変える。",
        "counter_structure": "件数が中小規模のため、単独主要命題ではなく、少数条件窓の復活や上位構造の境界として読むべき可能性。",
    },
    {
        "grammar_id": "SG-05-entry-prework-translation",
        "name": "入口以前参加を求人条件へ翻訳する文法",
        "source_meta_ids": [],
        "source_od_ids": ["OD-04-entry-prework-support-sequence"],
        "operators": ["OP-04-sequence-entry-and-life-security", "OP-01-translate-condition-to-work", "OP-06-protect-disclosure-boundary"],
        "rule": "生活リズム、体力、訓練、実習、支援接続、説明素材、職務イメージを、応募より前に求人条件へ翻訳する順序として読む。",
        "open_state": "入口前活動が職務条件と接続され、応募・面接・実習・定着の前段が組まれる。",
        "closed_state": "応募が先に来て、生活、訓練、体調、説明、職務条件が後追いになる。",
        "diversity_anchor_reading": "慢性疾患では勤務時間探索、認知・発達・知的では手順・実習・同伴、視覚・移動では通勤・時間帯・訓練形式が入口順序を変える。",
        "counter_structure": "入口以前参加に見えるものが、実際には生活保障、情報同期、支援接続の不足として別構造に属する可能性。",
    },
    {
        "grammar_id": "SG-06-minority-window-revival",
        "name": "少数条件窓を上位構造へ復活させる文法",
        "source_meta_ids": ["OM-05-sparse-information-life-security-knot"],
        "source_od_ids": [],
        "operators": ["OP-01-translate-condition-to-work", "OP-03-design-work-contact-point", "OP-07-update-loop"],
        "rule": "1-7例の小分枝は単独命題にせず、接触点、自由度、結果焦点が同型なら上位構造の変形として復活させる。",
        "open_state": "少数窓が大分類へ吸収されず、共通構造の別形態として保持される。",
        "closed_state": "件数の小ささにより捨てられる、または障害種類別の特殊例として孤立する。",
        "diversity_anchor_reading": "視覚、聴覚、内部障害、認知・高次脳、複合条件は、件数ではなく接触点の違いで読む。",
        "counter_structure": "小分枝が本当に同型ではなく、別の結果焦点や別の主自由度を持つ可能性。",
    },
]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def build_payload() -> dict[str, Any]:
    cooccurrence = load_json(COOCCURRENCE_JSON)
    deep = load_json(DEEP_READING_JSON)
    meta_by_id = {item["meta_id"]: item for item in cooccurrence["meta_candidates"]}
    od_by_id = {item["discovery_id"]: item for item in deep["deep_readings"]}

    grammar_rules = []
    for rule in GRAMMAR_RULES:
        meta_ids = rule["source_meta_ids"]
        meta_records = [meta_by_id[meta_id] for meta_id in meta_ids if meta_id in meta_by_id]
        source_od_ids = rule.get("source_od_ids", [])
        od_records = [od_by_id[od_id] for od_id in source_od_ids if od_id in od_by_id]
        related_od_ids = sorted({od_id for meta in meta_records for od_id in meta.get("od_ids", [])} | set(source_od_ids))
        source_examples = list(
            dict.fromkeys(
                [record_id for meta in meta_records for record_id in meta.get("example_record_ids", [])]
                + [record_id for od in od_records for record_id in od.get("read_anchor_record_ids", [])]
            )
        )[:12]
        grammar_rules.append(
            {
                **rule,
                "source_record_count": sum(meta["record_count"] for meta in meta_records)
                + sum(od["record_count"] for od in od_records),
                "source_example_record_ids": source_examples,
                "related_od_ids": related_od_ids,
                "review_status": "not_reviewed",
                "promotion_status": "no_promotion",
            }
        )

    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "artifact_id": "stage1-production-structural-discovery-grammar-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "raw_or_redacted_text_included": False,
        "purpose": (
            "overlap discoveryとmeta candidatesを、次の調査データ・断片資料分析で再利用できる構造文法へ圧縮する。"
            "知識昇格ではなく、SCIMA/FCHMAの分析解像度を維持するための未レビュー作業文法。"
        ),
        "source_artifacts": [
            str(COOCCURRENCE_JSON.relative_to(ROOT)),
            str(DEEP_READING_JSON.relative_to(ROOT)),
        ],
        "operators": OPERATORS,
        "grammar_rules": grammar_rules,
        "use_in_next_analysis": [
            "recordやsourceを、支援有無・障害種類・就労有無で先に切らず、operatorの組み合わせとして読む。",
            "断片資料は、どのoperatorだけが見えていて、どのICF軸が欠けているかを読む。",
            "小分枝は候補命題化せず、SG-06で上位構造へ復活できるかを探索する。",
            "人間レビュー用カードは、このgrammar rule単位ではなく、最低ケース数・境界例・反例を満たす文脈枝単位で作る。",
        ],
    }


def ids_text(values: list[str]) -> str:
    return ", ".join(f"`{value}`" for value in values) if values else "-"


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Structural Discovery Grammar",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "overlap discoveryとmeta candidatesを、次の分析で再利用できる構造文法へ圧縮した。これは知識昇格ではなく、SCIMA/FCHMAの読みが支援有無・障害種類・就労有無へ浅く戻らないための作業文法である。",
        "",
        "## Operators",
        "",
        "| operator | function | failure mode |",
        "|---|---|---|",
    ]
    for operator in payload["operators"]:
        lines.append(
            f"| `{operator['operator_id']}` {operator['name']} | {operator['function']} | {operator['failure_mode']} |"
        )

    lines.extend(["", "## Grammar Rules", ""])
    for rule in payload["grammar_rules"]:
        lines.extend(
            [
                f"### {rule['grammar_id']} {rule['name']}",
                "",
                f"- source record count: {rule['source_record_count']}",
                f"- source examples: {ids_text(rule['source_example_record_ids'][:8])}",
                f"- source meta: {ids_text(rule['source_meta_ids'])}",
                f"- related OD: {ids_text(rule['related_od_ids'])}",
                f"- operators: {ids_text(rule['operators'])}",
                f"- rule: {rule['rule']}",
                f"- open state: {rule['open_state']}",
                f"- closed/residual state: {rule['closed_state']}",
                f"- diversity anchor reading: {rule['diversity_anchor_reading']}",
                f"- counter structure: {rule['counter_structure']}",
                "",
            ]
        )

    lines.extend(
        [
            "## Next Analysis Use",
            "",
        ]
    )
    for item in payload["use_in_next_analysis"]:
        lines.append(f"- {item}")

    lines.extend(
        [
            "",
            "## Critical Method Shift",
            "",
            "ここでの発見は、問題中心の分類ではなく、自由度を開閉するoperatorの組み合わせとして読む。つまり、同じ障害種類、同じ支援有無、同じ就労状態でも、operatorの接続が異なれば別構造になり、異なる障害種類でもoperator接続が同型なら同じ上位構造として扱える。",
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
