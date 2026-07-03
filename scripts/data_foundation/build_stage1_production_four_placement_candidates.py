#!/usr/bin/env python3
"""Build Stage 1 production four-placement candidates by contact freedom.

This narrows broad contacts into problem / mitigation / residual / boundary
candidate IDs. It is still deterministic pre-LLM extraction, not SCIMA/FCHMA
completion and not a review judgment.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any

from build_stage1_production_source_inventory_and_contacts import (
    ADJUSTMENT_SIGNAL_RULES,
    CONTACT_RULES,
    DIVERSITY_ANCHOR_RULES,
    ROOT,
    RUN_DIR,
    RUN_ID,
    collect_records,
    detect_named_rules,
    score_rule,
)


PROBLEM_TERMS = (
    "困", "難しい", "できない", "できず", "できな", "支障", "無理", "不足", "不安", "負担",
    "未", "ない", "分から", "わから", "辞め", "退職", "休職", "悪化", "解雇", "不採用",
    "役に立た", "断念", "迷惑", "差別", "偏見", "疲れ", "痛み",
)

MITIGATION_TERMS = (
    "配慮", "調整", "相談", "支援", "利用", "理解", "休憩", "短時間", "在宅", "フレックス",
    "時差", "実習", "見学", "通訳", "筆談", "手順", "設備", "継続", "フォロー", "連携",
    "可能", "できる", "助か", "合わせ", "認め", "許可", "変更",
)

FREEDOM_TERMS: dict[str, tuple[str, ...]] = {
    "勤務時間": ("勤務時間", "時間", "時短", "短時間", "シフト", "フレックス", "時差", "残業"),
    "休暇・欠勤扱い": ("休暇", "有給", "欠勤", "休み", "休職", "復職", "休業"),
    "休憩": ("休憩", "休む", "休ませ", "横になる"),
    "職務代替": ("代替", "分担", "配置", "仕事内容", "業務", "職務", "作業量"),
    "職場内解釈": ("理解", "迷惑", "怠慢", "仮病", "説明", "伝え", "上司", "同僚", "職場"),
    "収入保障": ("収入", "賃金", "給料", "生活費", "医療費", "手当", "年金"),
    "本人条件の企業語化": ("説明", "伝え", "開示", "面接", "応募", "企業", "会社", "配慮"),
    "求人条件の生活語化": ("求人", "仕事内容", "条件", "勤務", "通勤", "生活", "体調"),
    "開示範囲": ("開示", "説明", "伝え", "言う", "病名", "障害", "配慮"),
    "実習・見学": ("実習", "見学", "トライアル", "体験", "試行"),
    "支援者同席": ("同席", "支援者", "代弁", "同行", "間に", "センター"),
    "制度ステータス": ("手帳", "障害者雇用", "制度", "雇用率", "対象", "枠"),
    "相談入口": ("相談", "窓口", "ハローワーク", "センター", "どこ", "入口"),
    "役割分担": ("役割", "連携", "医療", "福祉", "雇用", "企業", "担当"),
    "支援メニュー適合": ("メニュー", "合う", "適合", "役に立", "利用", "支援内容"),
    "継続接続": ("継続", "フォロー", "就職後", "定着", "再相談", "つなが"),
    "支援品質": ("専門", "品質", "不信", "信頼", "理解", "技術"),
    "地域資源": ("地域", "資源", "近く", "通える", "地方", "施設"),
    "情報形式": ("情報", "指示", "文字", "音声", "視覚", "筆談", "通訳", "手話"),
    "確認可能性": ("確認", "事前", "後で", "メモ", "繰り返", "分かる"),
    "責任所在": ("誰", "担当", "責任", "上司", "同僚", "本人", "会社"),
    "評価接続": ("評価", "昇進", "処遇", "報酬", "基準"),
    "役割接続": ("役割", "仕事配分", "割り振り", "責任", "参加"),
    "本人の依頼負荷": ("頼む", "お願い", "説明", "毎回", "負担", "言い出"),
    "移動経路": ("移動", "通勤", "階段", "エレベーター", "通路", "距離"),
    "通勤": ("通勤", "電車", "バス", "交通", "車", "移動"),
    "姿勢": ("姿勢", "座位", "立位", "立ち", "座り", "横"),
    "作業場所": ("場所", "現場", "訪問", "在宅", "作業場", "職場"),
    "設備": ("設備", "バリアフリー", "車椅子", "トイレ", "機器", "エレベーター"),
    "安全確認": ("安全", "確認", "危険", "見え", "聞こ", "警報"),
    "医療費": ("医療費", "治療費", "薬代", "入院費"),
    "家計責任": ("家計", "家族", "扶養", "生活費", "介護"),
    "雇用形態": ("正社員", "非正規", "パート", "アルバイト", "契約", "短時間"),
    "制度対象": ("対象", "制度", "手当", "年金", "雇用保険", "生活保護"),
    "休業時保障": ("休業", "傷病手当", "休職", "手当", "保障"),
    "生活再建": ("生活", "再建", "将来", "不安", "地域", "自立"),
    "評価基準": ("評価", "基準", "判断", "成果", "能力"),
    "役割拡大": ("役割", "責任", "任せ", "拡大", "仕事配分"),
    "技能習得": ("技能", "訓練", "研修", "覚え", "学習"),
    "処遇": ("処遇", "賃金", "報酬", "昇進", "待遇"),
    "昇進": ("昇進", "昇格", "キャリア", "責任"),
    "働きがい": ("働きがい", "やりがい", "満足", "意味"),
    "定着": ("定着", "継続", "離職", "退職", "続け"),
    "生活リズム": ("生活リズム", "日中", "睡眠", "朝", "習慣"),
    "体力": ("体力", "疲労", "疲れ", "持久", "無理"),
    "日中活動": ("日中活動", "作業所", "活動", "通所", "訓練"),
    "家族支援": ("家族", "親", "介護", "支援者", "家庭"),
    "地域生活": ("地域", "生活", "外出", "通える", "参加"),
    "訓練": ("訓練", "職業訓練", "練習", "準備"),
    "就労自信": ("自信", "できるか", "不安", "意欲", "働け"),
}


def term_hits(terms: tuple[str, ...], text: str) -> int:
    return sum(1 for term in terms if term in text)


def placement_for(text: str, freedom_terms: tuple[str, ...]) -> str | None:
    freedom_hit = term_hits(freedom_terms, text)
    if freedom_hit == 0:
        return None
    problem = term_hits(PROBLEM_TERMS, text) > 0
    mitigation = term_hits(MITIGATION_TERMS, text) > 0
    if problem and mitigation:
        return "residual_ids"
    if mitigation and not problem:
        return "mitigation_ids"
    if problem:
        return "problem_ids"
    return "boundary_ids"


def build_four_placements(records: dict[str, dict[str, Any]]) -> dict[str, Any]:
    rows: list[dict[str, Any]] = []
    for rule in CONTACT_RULES:
        contact_pool = []
        for record in records.values():
            score, core_hits, unique_hits = score_rule(rule, record["text"])
            if score >= 12 and core_hits >= 1 and unique_hits >= 3:
                contact_pool.append((record, score))

        for freedom in rule.freedom_candidates:
            freedom_terms = FREEDOM_TERMS.get(freedom, tuple(freedom.split("・")))
            placements: dict[str, list[dict[str, Any]]] = {
                "problem_ids": [],
                "mitigation_ids": [],
                "residual_ids": [],
                "boundary_ids": [],
            }
            anchor_counts: Counter[str] = Counter()
            adjustment_counts: Counter[str] = Counter()
            for record, contact_score in contact_pool:
                text = record["text"]
                placement = placement_for(text, freedom_terms)
                if placement is None:
                    if len(placements["boundary_ids"]) < 40:
                        placements["boundary_ids"].append({
                            "source_id": record["source_id"],
                            "source_dataset": record["source_dataset"],
                            "source_family": record["source_family"],
                            "score": contact_score,
                            "boundary_reason": "contact_hit_without_freedom_specific_signal",
                        })
                    continue
                anchors = detect_named_rules(DIVERSITY_ANCHOR_RULES, text)
                adjustments = detect_named_rules(ADJUSTMENT_SIGNAL_RULES, text)
                anchor_counts.update(anchors)
                adjustment_counts.update(adjustments)
                placements[placement].append({
                    "source_id": record["source_id"],
                    "source_dataset": record["source_dataset"],
                    "source_family": record["source_family"],
                    "score": contact_score + term_hits(freedom_terms, text) * 3,
                    "diversity_anchors": anchors[:6],
                    "adjustment_signals": adjustments[:6],
                })

            for key in placements:
                placements[key].sort(key=lambda item: (-item["score"], item["source_id"]))

            problem_count = len(placements["problem_ids"])
            mitigation_count = len(placements["mitigation_ids"])
            residual_count = len(placements["residual_ids"])
            boundary_count = len(placements["boundary_ids"])
            if problem_count >= 8 and mitigation_count >= 8 and residual_count >= 3 and boundary_count >= 3:
                readiness = "llm_context_reading_candidate"
            elif residual_count >= 20 and boundary_count >= 3:
                readiness = "llm_polarity_split_candidate"
            elif residual_count >= 20:
                readiness = "needs_boundary_or_contrast_search"
            elif problem_count >= 8 and (mitigation_count < 8 or residual_count < 3):
                readiness = "needs_mitigation_or_residual_search"
            elif 1 <= problem_count < 8:
                readiness = "minority_or_revival_search_signal"
            else:
                readiness = "not_ready_no_problem_side"

            rows.append({
                "contact_id": rule.contact_id,
                "result_focus": rule.result_focus,
                "freedom": freedom,
                "status": "machine_generated_four_placement_candidate_not_reviewed",
                "readiness": readiness,
                "problem_count": problem_count,
                "mitigation_count": mitigation_count,
                "residual_count": residual_count,
                "boundary_count": boundary_count,
                "diversity_anchor_counts": dict(sorted(anchor_counts.items())),
                "adjustment_signal_counts": dict(sorted(adjustment_counts.items())),
                "problem_ids": [item["source_id"] for item in placements["problem_ids"][:16]],
                "mitigation_ids": [item["source_id"] for item in placements["mitigation_ids"][:16]],
                "residual_ids": [item["source_id"] for item in placements["residual_ids"][:16]],
                "boundary_ids": [item["source_id"] for item in placements["boundary_ids"][:12]],
                "non_judgment_hold": "No medical, legal, HR, accommodation sufficiency, support validity, or employment correctness judgment.",
            })
    return {
        "run_id": RUN_ID,
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "four_placement_candidate_count": len(rows),
        "readiness_counts": dict(sorted(Counter(row["readiness"] for row in rows).items())),
        "four_placement_candidates": rows,
    }


def write_markdown(payload: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Four-Placement Candidates v0",
        "",
        "Date: 2026-05-18",
        "Status: machine-generated / unreviewed / no promotion",
        "本文引用: なし",
        "",
        "## Summary",
        "",
        f"four-placement candidates: {payload['four_placement_candidate_count']}",
        "",
        "| readiness | count |",
        "|---|---:|",
    ]
    for key, value in payload["readiness_counts"].items():
        lines.append(f"| {key} | {value} |")

    lines.extend([
        "",
        "## Candidates",
        "",
        "| contact | freedom | readiness | problem | mitigation | residual | boundary |",
        "|---|---|---|---:|---:|---:|---:|",
    ])
    for row in payload["four_placement_candidates"]:
        lines.append(
            f"| {row['contact_id']} | {row['freedom']} | {row['readiness']} | "
            f"{row['problem_count']} | {row['mitigation_count']} | {row['residual_count']} | {row['boundary_count']} |"
        )

    lines.extend(["", "## LLM Reading Queue", ""])
    for row in payload["four_placement_candidates"]:
        if row["readiness"] not in {
            "llm_context_reading_candidate",
            "llm_polarity_split_candidate",
            "needs_mitigation_or_residual_search",
            "needs_boundary_or_contrast_search",
        }:
            continue
        anchors = ", ".join(
            f"{key}:{value}"
            for key, value in sorted(row["diversity_anchor_counts"].items(), key=lambda kv: (-kv[1], kv[0]))[:5]
        ) or "なし"
        adjustments = ", ".join(
            f"{key}:{value}"
            for key, value in sorted(row["adjustment_signal_counts"].items(), key=lambda kv: (-kv[1], kv[0]))[:5]
        ) or "なし"
        lines.extend([
            f"### {row['contact_id']} / {row['freedom']}",
            "",
            f"結果焦点: {row['result_focus']}",
            f"readiness: {row['readiness']}",
            f"多様性アンカー濃淡: {anchors}",
            f"調整・修飾シグナル濃淡: {adjustments}",
            f"問題側ID: {', '.join(f'`{item}`' for item in row['problem_ids'][:8]) or 'なし'}",
            f"軽減側ID: {', '.join(f'`{item}`' for item in row['mitigation_ids'][:8]) or 'なし'}",
            f"残余側ID: {', '.join(f'`{item}`' for item in row['residual_ids'][:8]) or 'なし'}",
            f"境界側ID: {', '.join(f'`{item}`' for item in row['boundary_ids'][:8]) or 'なし'}",
            "",
        ])
    lines.extend([
        "## Use Boundary",
        "",
        "- これはLLM文脈読解キューであり、候補命題ではない。",
        "- 軽減側IDは成功例や正しい支援の判定ではない。",
        "- 残余側IDは支援不十分の判定ではない。",
        "- 境界側IDはノイズではなく、別構造または自由度違いの候補である。",
    ])
    (RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    payload = build_four_placements(collect_records())
    out_json = RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.json"
    out_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(payload)
    print(json.dumps({
        "json": str(out_json.relative_to(ROOT)),
        "markdown": str((RUN_DIR / "stage1-production-four-placement-candidates-v0-2026-05-18.md").relative_to(ROOT)),
        "readiness_counts": payload["readiness_counts"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
