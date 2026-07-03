#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Callable


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
ASSIGN_JSON = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
SUBBRANCH_JSON = RUN_DIR / "stage1-production-subbranch-split-candidates-v0-2026-05-18.json"
OUT_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.md"


Record = dict[str, Any]
Predicate = Callable[[Record], bool]


def load_records() -> dict[str, Record]:
    records: dict[str, Record] = defaultdict(
        lambda: {"branches": set(), "boundary_tags": set(), "dominant": set(), "secondary": set(), "source": ""}
    )

    assignments = json.loads(ASSIGN_JSON.read_text(encoding="utf-8"))["assignments"]
    for item in assignments:
        record = records[item["record_id"]]
        record["source"] = item["source"]
        record["branches"].update(item["candidate_branches"])
        record["boundary_tags"].update(item.get("boundary_tags", []))

    subbranch_links = json.loads(SUBBRANCH_JSON.read_text(encoding="utf-8"))["record_links"]
    for item in subbranch_links:
        record = records[item["record_id"]]
        record["source"] = item["source"]
        record["branches"].add(item["branch_id"])
        record["dominant"].update(item["dominant_subbranch_candidates"])
        record["secondary"].update(item["secondary_subbranch_candidates"])

    return dict(records)


def record_set(records: dict[str, Record], predicate: Predicate) -> set[str]:
    return {record_id for record_id, record in records.items() if predicate(record)}


def examples(record_ids: set[str], limit: int = 8) -> list[str]:
    return sorted(record_ids)[:limit]


def relation(
    relation_id: str,
    title: str,
    record_ids: set[str],
    representative_ids: list[str],
    boundary_ids: list[str],
    reading: str,
    counter_reading: str,
    next_use: str,
) -> dict[str, Any]:
    return {
        "relation_id": relation_id,
        "title": title,
        "record_count": len(record_ids),
        "representative_ids": representative_ids,
        "boundary_ids": boundary_ids,
        "reading": reading,
        "counter_reading": counter_reading,
        "next_use": next_use,
    }


def main() -> None:
    records = load_records()

    sets = {
        "c01_5": record_set(records, lambda r: "C01-5-long-term-continuity" in r["dominant"]),
        "c03_4": record_set(records, lambda r: "C03-4-continuity-support" in r["dominant"]),
        "c03_1": record_set(records, lambda r: "C03-1-consultation-entry" in r["dominant"]),
        "c02_self": record_set(records, lambda r: "C02-1-self-condition-to-employer" in r["dominant"]),
        "c02_job": record_set(records, lambda r: "C02-2-job-condition-to-life" in r["dominant"]),
        "c02_institutional": record_set(
            records,
            lambda r: "C02-4-institutional-status" in r["dominant"] or "C02-4-institutional-status" in r["secondary"],
        ),
        "c02_supporter": record_set(
            records,
            lambda r: "C02-5-supporter-translation-presence" in r["dominant"] or "C02-5-supporter-translation-presence" in r["secondary"],
        ),
        "c04a": record_set(records, lambda r: any(branch.startswith("P1-C04A") for branch in r["branches"])),
        "c05_3": record_set(records, lambda r: "C05-3-worksite-facility" in r["dominant"]),
        "c05_4": record_set(records, lambda r: "C05-4-rest-fatigue-boundary" in r["dominant"]),
        "c05_5": record_set(
            records,
            lambda r: "C05-5-information-access-boundary" in r["dominant"] or "C05-5-information-access-boundary" in r["secondary"],
        ),
        "c05_12": record_set(
            records,
            lambda r: "C05-1-commuting-route" in r["dominant"] or "C05-2-posture-operation" in r["dominant"],
        ),
        "c01c": record_set(records, lambda r: "P1-C01C" in r["branches"]),
        "c02b": record_set(records, lambda r: "P1-C02B" in r["branches"]),
        "c03b": record_set(records, lambda r: "P1-C03B" in r["branches"]),
        "c04b": record_set(records, lambda r: "P1-C04B" in r["boundary_tags"]),
        "c06a": record_set(records, lambda r: "P1-C06A" in r["boundary_tags"]),
        "c06b": record_set(records, lambda r: "P1-C06B" in r["boundary_tags"]),
        "c06c": record_set(records, lambda r: "P1-C06C" in r["boundary_tags"]),
        "c06d": record_set(records, lambda r: "P1-C06D" in r["boundary_tags"]),
        "c06e": record_set(records, lambda r: "P1-C06E" in r["boundary_tags"]),
    }

    c02_both = sets["c02_self"] & sets["c02_job"]
    c02_job_only = sets["c02_job"] - sets["c02_self"]
    c02_self_only = sets["c02_self"] - sets["c02_job"]

    relations = [
        relation(
            "SR-C01C03-LONGTERM-CONTINUITY",
            "健康時間の長期設計と支援継続接続",
            sets["c01_5"] & sets["c03_4"],
            examples(sets["c01_5"] & sets["c03_4"]),
            examples((sets["c01_5"] ^ sets["c03_4"])),
            "長期継続の困難は、仕事設計だけでも支援利用だけでも読めない。健康条件の変化を仕事設計へ組み込む自由度と、支援が変化局面で翻訳し直す自由度を分けて接続する。",
            "共起は、困難が大きいケースに信号が集まっただけで、長期設計と支援継続の構造的関係を示していない可能性がある。",
            "`C01-5` と `C03-4` を統合せず、関係エッジとして保持する。",
        ),
        relation(
            "SR-C03-ENTRY-VS-CONTINUITY",
            "相談入口と継続接続の分離",
            sets["c03_1"] & sets["c03_4"],
            examples(sets["c03_1"] & sets["c03_4"]),
            examples((sets["c03_1"] ^ sets["c03_4"])),
            "相談入口と継続接続の共起は相対的に小さい。入口を知っている/使うことと、病状変化・復職・就職後調整へ継続接続されることは別の自由度として扱う。",
            "相談入口と継続接続の差は、データ項目や設問構造の違いによって見えているだけかもしれない。",
            "`C03-1` と `C03-4` を同じ支援アクセス一般に吸収しない。",
        ),
        relation(
            "SR-C02T-BIDIRECTIONAL-TRANSLATION",
            "入口翻訳の双方向型",
            c02_both,
            examples(c02_both),
            examples(c02_job_only | c02_self_only),
            "本人条件を仕事設計言語へ翻訳する方向と、求人条件を生活・健康管理条件へ翻訳する方向は、多くのケースで同時に必要になる。これは本人の説明能力ではなく、入口の相互翻訳構造として読む。",
            "双方向に見える信号は、単に回答項目が多いケースや困難が大きいケースを拾っているだけかもしれない。",
            "`C02-1` と `C02-2` は独立カードではなく、双方向ペアと方向優勢型へ分ける。",
        ),
        relation(
            "SR-C02T-C03-CONTINUITY-BRIDGE",
            "入口翻訳から継続支援への橋",
            (sets["c02_self"] | sets["c02_job"]) & sets["c03_4"],
            examples((sets["c02_self"] | sets["c02_job"]) & sets["c03_4"]),
            examples((sets["c02_self"] | sets["c02_job"]) - sets["c03_4"]),
            "入口での翻訳困難は、就職後・復職・病状変化の局面で再翻訳が必要になる可能性がある。入口翻訳は一回で終わる作業ではなく、継続支援と接続する構造として読む。",
            "C02とC03の共起は、支援ニーズが大きいケースに複数信号が集まっただけかもしれない。",
            "`C02-T` から `C03-4` への関係エッジを作り、入口と継続を段階差として保持する。",
        ),
        relation(
            "SR-C04A-C05-WORKSITE-INFORMATION",
            "情報参加が作業場所・設備として現れる境界",
            sets["c04a"] & sets["c05_3"],
            examples(sets["c04a"] & sets["c05_3"]),
            examples(sets["c04a"] - sets["c05_3"]),
            "情報参加の困難は、会話や説明だけでなく、作業場所、安全確認、設備、案内形式との接点として現れる。C04Aは情報参加、C05は場所・身体・環境として分けつつ、境界エッジで読む。",
            "C04AとC05-3の共起は、情報参加ではなく、広い職場環境不一致を拾っているだけかもしれない。",
            "`RU-C05-3` を単独候補から降ろし、`C04A/C05` 境界として保持する。",
        ),
        relation(
            "SR-C05-WORKSITE-HEALTHTIME",
            "作業場所・設備と健康時間・休息境界",
            sets["c05_3"] & sets["c05_4"],
            examples(sets["c05_3"] & sets["c05_4"]),
            examples(sets["c05_3"] - sets["c05_4"]),
            "設備・作業場所に見える問題の一部は、疲労、休息、健康管理、治療継続との接点で自由度を変える。設備の有無ではなく、健康時間を職場内でどう成立させるかを読む。",
            "健康時間の信号が広く出ているだけで、作業場所・設備との構造関係は弱い可能性がある。",
            "`C05-4` は `C01` へ橋渡しし、設備一般へ吸収しない。",
        ),
        relation(
            "SR-C05-MOBILITY-WORKSITE",
            "移動・姿勢と作業場所の接点",
            sets["c05_12"] & sets["c05_3"],
            examples(sets["c05_12"] & sets["c05_3"]),
            examples(sets["c05_12"] - sets["c05_3"]),
            "通勤、職場内移動、姿勢、身体操作は、設備リストではなく、作業場所と仕事内容をつなぐ自由度として読む。障害種類別の固定支援メニューへ戻さない。",
            "移動・姿勢の信号は、疲労、健康時間、生活保障、求人条件の問題で説明できる可能性がある。",
            "`C05-1/2` を小さくても保持し、設備一般から分ける。",
        ),
        relation(
            "SR-C06-HEALTHTIME-LIFESECURITY",
            "健康時間と生活保障の接触面",
            sets["c06d"] & (sets["c01_5"] | sets["c05_4"]),
            examples(sets["c06d"] & (sets["c01_5"] | sets["c05_4"])),
            examples(sets["c06d"] - (sets["c01_5"] | sets["c05_4"])),
            "治療、体調変動、回復、休息、勤務継続の時間構造は、生活保障と接すると、仕事を続ける/休む/戻る/選び直す自由度を一体で変える。",
            "生活保障と健康時間の共起は、難病調査の設問構造や困難の大きさを拾っているだけで、接触面を示していない可能性がある。",
            "`C06D` を背景条件へ落とさず、C01健康時間とC06生活保障の境界エッジとして保持する。",
        ),
        relation(
            "SR-C06-SUPPORT-LIFESECURITY",
            "支援接続と生活保障の橋",
            sets["c06c"] & (sets["c03_1"] | sets["c03_4"]),
            examples(sets["c06c"] & (sets["c03_1"] | sets["c03_4"])),
            examples(sets["c06c"] - (sets["c03_1"] | sets["c03_4"])),
            "支援接続は、相談資源の有無ではなく、生活保障圧力の下で、制度、収入、仕事条件、健康条件を翻訳し、選択肢を増やす橋として働く可能性がある。",
            "支援接続と生活保障の共起は、困難が大きいケースに複数信号が集まっただけかもしれない。",
            "`C06C` を支援有効性の証拠にせず、C03支援接続とC06生活保障の橋として読む。",
        ),
        relation(
            "SR-C06-TRANSITION-LIFESECURITY",
            "移行期の生活保障圧力と入口翻訳",
            sets["c06b"] & (sets["c02_job"] | sets["c02_self"] | sets["c03_1"]),
            examples(sets["c06b"] & (sets["c02_job"] | sets["c02_self"] | sets["c03_1"])),
            examples(sets["c06b"] - (sets["c02_job"] | sets["c02_self"] | sets["c03_1"])),
            "未就労、離職後、再就職、職業準備では、生活保障圧力が、応募条件、訓練参加、支援利用、求人条件の翻訳を急がせたり狭めたりする可能性がある。",
            "移行期の困難は、生活保障ではなく、健康安定、地域求人、職業準備、本人希望の未確定によって説明できる可能性がある。",
            "`C06B` を就労意欲や能力の読みへ使わず、入口翻訳・支援接続の制約面として保持する。",
        ),
        relation(
            "SR-C06-EVALUATION-LIFESECURITY",
            "評価・処遇と生活保障の接触面",
            sets["c06e"] & (sets["c02_institutional"] | sets["c04a"] | sets["c05_3"]),
            examples(sets["c06e"] & (sets["c02_institutional"] | sets["c04a"] | sets["c05_3"])),
            examples(sets["c06e"] - (sets["c02_institutional"] | sets["c04a"] | sets["c05_3"])),
            "評価、処遇、役割、制度ステータス、仕事参加接触点が生活保障と接すると、キャリア参加と収入維持の自由度が同時に問題化する可能性がある。",
            "評価・処遇の信号は、一般的な職場満足や雇用形態を拾っているだけかもしれない。",
            "`C06E` を不満足一般へ吸収せず、評価・処遇・生活保障の境界エッジとして保持する。",
        ),
        relation(
            "SR-C07-QUALITY-PARTICIPATION-BLINDSPOT",
            "評価・役割・キャリア参加の構造的盲点",
            sets["c06e"] & sets["c04b"],
            examples(sets["c06e"] & sets["c04b"]),
            examples(sets["c06e"] - sets["c04b"]),
            "評価、役割、処遇、昇進、働きがい、定着は、問題側が薄くても、情報参加と生活保障に接続する仕事参加の質として保持する必要がある。",
            "C07に見える信号は、C04情報参加やC06生活保障の副次的境界にすぎない可能性がある。",
            "C07を昇進・満足の周辺話題として捨てず、調査設計が拾いにくい上方向の参加自由度として保持する。",
        ),
        relation(
            "SR-C08-PREWORK-ENTRY-TRANSLATION",
            "就労前参加から入口翻訳への橋",
            sets["c06b"] & (sets["c02b"] | sets["c03b"]),
            examples(sets["c06b"] & (sets["c02b"] | sets["c03b"])),
            examples(sets["c06b"] - (sets["c02b"] | sets["c03b"])),
            "生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信は、本人の準備不足ではなく、求人条件・支援条件・生活条件を入口へ翻訳する前段自由度として現れる。",
            "C08はC02入口翻訳、C03支援接続、C06生活保障で説明でき、独立段階として切り出すと過剰分割になる可能性がある。",
            "就労入口以前の生活・体力・活動参加を、本人責任ではなく入口翻訳の前段構造として探索する。",
        ),
        relation(
            "SR-C08-PASTWORK-LIFE-REBUILDING",
            "過去就労困難から生活再構築への橋",
            sets["c01c"] & sets["c02b"] & sets["c03b"],
            examples(sets["c01c"] & sets["c02b"] & sets["c03b"]),
            examples((sets["c01c"] | sets["c02b"] | sets["c03b"]) - (sets["c01c"] & sets["c02b"] & sets["c03b"])),
            "過去就労で健康時間、入口翻訳、支援接続の未整合が重なると、再就職前に生活再構築、体力、日中活動、就労自信の自由度として現れる可能性がある。",
            "三者の共起は、過去就労困難の大きさを拾っているだけで、生活再構築構造を示していない可能性がある。",
            "過去就労困難を単なる持ち越しにせず、就労前参加の再構築へ変換される構造として読む。",
        ),
    ]

    payload = {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "set_counts": {key: len(value) for key, value in sets.items()},
        "c02_direction_counts": {
            "bidirectional": len(c02_both),
            "job_condition_to_life_only": len(c02_job_only),
            "self_condition_to_employer_only": len(c02_self_only),
            "institutional_modifier": len(sets["c02_institutional"]),
            "supporter_translation_modifier": len(sets["c02_supporter"]),
        },
        "relations": relations,
    }
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Production Deep Relation Map",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "この出力は、候補カードを単独で並べるのではなく、SCIMA/FCHMAの構造的自由度としてどの枝を分け、どの枝を関係エッジで接続するかを示す。",
        "",
        "## Set Counts",
        "",
        "| set | records |",
        "|---|---:|",
    ]
    for key, value in payload["set_counts"].items():
        lines.append(f"| `{key}` | {value} |")

    lines.extend([
        "",
        "## C02 Translation Directions",
        "",
        "| direction | records |",
        "|---|---:|",
    ])
    for key, value in payload["c02_direction_counts"].items():
        lines.append(f"| `{key}` | {value} |")

    lines.extend(["", "## Structural Relations", ""])
    for item in relations:
        reps = ", ".join(f"`{record_id}`" for record_id in item["representative_ids"])
        boundaries = ", ".join(f"`{record_id}`" for record_id in item["boundary_ids"])
        lines.extend([
            f"### {item['relation_id']} {item['title']}",
            "",
            f"record数: {item['record_count']}",
            "",
            f"代表ID: {reps if reps else 'なし'}",
            "",
            f"境界ID: {boundaries if boundaries else 'なし'}",
            "",
            f"読み: {item['reading']}",
            "",
            f"反対読み: {item['counter_reading']}",
            "",
            f"次の使い方: {item['next_use']}",
            "",
        ])

    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
