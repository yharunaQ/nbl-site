#!/usr/bin/env python3
"""Build the Stage 1 source-lens saturation map.

This merges FT-Codex-01/02/03 into a compact map of which Stage 1 routes are
now thick enough for internal expert-network use, and which holds remain
honest. It does not promote knowledge, review status, source/support validity,
public status, or runtime status.
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
OUT_ID = "stage1-production-source-lens-saturation-map-v0-2026-05-23"
OUT_JSON = RUN_DIR / f"{OUT_ID}.json"
OUT_MD = RUN_DIR / f"{OUT_ID}.md"


INPUTS = {
    "ft_codex_01": RUN_DIR / "stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23-summary.json",
    "ft_codex_02": RUN_DIR / "stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23-summary.json",
    "ft_codex_03": RUN_DIR / "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-summary.json",
    "core_route_matrix": RUN_DIR / "stage1-production-core-route-mechanism-matrix-v0-2026-05-23.json",
    "ft_codex_01_reconnection": RUN_DIR / "stage1-production-ft-codex-01-network-reconnection-v0-2026-05-23.md",
    "ft_codex_02_reconnection": RUN_DIR / "stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23-network-reconnection.md",
    "ft_codex_03_reconnection": RUN_DIR / "stage1-production-ft-codex-03-supporter-workplace-nivr-workshop-context-reading-v0-2026-05-23-network-reconnection.md",
}


ROUTE_ORDER = [
    "C01-health-time",
    "C02-entry-translation",
    "C03-support-continuity",
    "C04-information-participation",
    "C05-worksite-contact",
    "C06-life-security",
    "C07-quality-participation",
    "C08-prework-participation",
]


ROUTE_SATURATION = [
    {
        "route_id": "C01-health-time",
        "saturation_state": "candidate_core_thick_but_boundary_sensitive",
        "source_lens_coverage": ["respondent-survey", "workplace", "supporter", "NIVR", "workshop", "web-cache"],
        "usable_internal_function": "健康時間を、時間量ではなく負荷、休息、通院、移動、生活保障、職場再設計、評価へ分岐する設計変数として読む。",
        "what_ft03_added": "職場相談線、休職と収入低下、遠隔支援、将来再設計により、C01が本人側体調だけで閉じないことを補強した。",
        "honest_hold": "変動性や進行性から就労可能性、配慮妥当性、将来リスク判断へ進まない。NIVR等の現在制度利用は別途ライブ確認が必要。",
    },
    {
        "route_id": "C02-entry-translation",
        "saturation_state": "candidate_core_active_with_sequence_hold",
        "source_lens_coverage": ["respondent-survey", "supporter", "workplace", "NIVR", "workshop", "web-cache"],
        "usable_internal_function": "入口を、開示技術ではなく、制度カテゴリ、求人表示、職務条件、健康安全説明、支援役割が相互翻訳される順序として読む。",
        "what_ft03_added": "支援者側のカテゴリ境界、職場側の求人シグナル、Workshopの入口前段階により、入口以前から就職後への連続性が厚くなった。",
        "honest_hold": "入口前参加を本人の準備不足へ戻さない。古い制度カテゴリや地域差は現行説明にしない。",
    },
    {
        "route_id": "C03-support-continuity",
        "saturation_state": "candidate_core_spine_strongest_current_route",
        "source_lens_coverage": ["respondent-survey", "supporter", "workplace", "NIVR", "workshop", "web-cache", "2001-ABC"],
        "usable_internal_function": "支援を有無ではなく、医療、生活、求人、職場、本人説明、評価、紹介後戻りを再翻訳する連続面として読む。",
        "what_ft03_added": "支援者学習、役割曖昧性、地域ネットワーク、職場相談線、Workshop関係者地図により、C03が中心軸としてかなり固まった。",
        "honest_hold": "支援者善意、会議開催、紹介、ネットワーク名、効果カタログを支援妥当性や効果証明にしない。",
    },
    {
        "route_id": "C04-information-participation",
        "saturation_state": "candidate_core_active_with_consent_boundary",
        "source_lens_coverage": ["respondent-survey", "supporter", "workplace", "workshop", "web-cache", "2001-ABC"],
        "usable_internal_function": "情報を説明量ではなく、同意、共有範囲、業務手順、安全、非公式情報、評価、人事に同期する参加構造として読む。",
        "what_ft03_added": "支援者側の開示境界と職場側の観察、プライバシー、必要確認のずれにより、C04がQR-06 disclosure boundaryへ明確に接続した。",
        "honest_hold": "情報共有を最大化しない。法的判断、差別認定、誰が正しいかの判定に進まない。",
    },
    {
        "route_id": "C05-worksite-contact",
        "saturation_state": "candidate_core_thickened_by_workplace_lens",
        "source_lens_coverage": ["respondent-survey", "workplace", "workshop", "web-cache", "2001-ABC"],
        "usable_internal_function": "職場環境を設備リストではなく、作業、顧客、安全、欠勤代替、人員余力、移動、情報形式の接触点として分解する。",
        "what_ft03_added": "職場側自由記述により、小規模、現場作業、安全、顧客対応、求人表示、未経験想定困難の境界が追加された。",
        "honest_hold": "職場側の不安や好事例を本人経験、企業妥当性、職務能力判断へ変換しない。",
    },
    {
        "route_id": "C06-life-security",
        "saturation_state": "candidate_core_active_as_direct_freedom_axis",
        "source_lens_coverage": ["respondent-survey", "supporter", "workplace", "NIVR", "workshop", "web-cache", "2001-ABC"],
        "usable_internal_function": "生活保障を背景事情ではなく、待つ、休む、治療する、戻る、選び直す自由度を決める直接軸として読む。",
        "what_ft03_added": "支援者側の制度カテゴリ境界と職場側の休職、賃金低下、医療費、生活不安により、C06がC01/C05/C07に吸収されない軸として強まった。",
        "honest_hold": "現行制度利用可能性、政策妥当性、生活保護や給付の法的判断へ進まない。",
    },
    {
        "route_id": "C07-quality-participation",
        "saturation_state": "route_through_now_usable_not_standalone_core",
        "source_lens_coverage": ["respondent-survey", "supporter", "workplace", "NIVR", "web-cache", "2001-ABC"],
        "usable_internal_function": "参加品質を満足度ではなく、役割、価値、将来見通し、処遇、学習、キャリア再設計へ翻訳されるかとして読む。",
        "what_ft03_added": "NIVRのライフコース、職場側の将来再設計、支援者側の組織容量により、C07はroute-throughとしてかなり使いやすくなった。",
        "honest_hold": "満足度、勤続、好事例、処遇を成功証明にしない。単独のCore昇格やpublic-ready化はしない。",
    },
    {
        "route_id": "C08-prework-participation",
        "saturation_state": "route_through_now_usable_with_preentry_hold",
        "source_lens_coverage": ["respondent-survey", "supporter", "workplace-boundary", "workshop", "web-cache"],
        "usable_internal_function": "入口以前を準備不足ではなく、検出、仕事像、生活リズム、体験、ストレス、求人情報、開始後支援への順序として読む。",
        "what_ft03_added": "支援者側の就職前体験とWorkshopの段階設計により、C08は本人不足ではなく参加過程として再固定された。",
        "honest_hold": "pre-entry直接資料はまだ偏りがあり、未就労や訓練段階をreadiness deficitに戻さない。",
    },
]


REMAINING_HOLDS = [
    {
        "hold_id": "H-01-human-review-and-source-support-validity",
        "why_hold_is_honest": "FT-Codex成果は構造候補であり、人間レビュー、source validity、support validityは未実施である。",
        "what_was_tightened": "各カードにno text export、no promotion、not allowed、missing context、overinterpretation riskを持たせた。",
        "reopen_condition": "Founder/reviewerによる明示レビュー、source/support validityの別ゲート、またはPro batonでの狭い判断。",
    },
    {
        "hold_id": "H-02-current-policy-and-official-source-use",
        "why_hold_is_honest": "NIVR、MHLW、JEED等はlocal source/readiness素材として使ったが、公開・現行制度説明にはライブ確認が必要である。",
        "what_was_tightened": "NIVRはsource family bridge、Workshopはpractice topologyとして分離した。",
        "reopen_condition": "公式ページまたは報告書本文の該当箇所を現行利用目的で再確認し、public-use用の出典審査を行う。",
    },
    {
        "hold_id": "H-03-C07-C08-promotion",
        "why_hold_is_honest": "C07/C08は厚くなったが、成功証明や準備不足判定へ崩れやすい。",
        "what_was_tightened": "route-through使用、逃がし先、過剰解釈ブレーキを明示した。",
        "reopen_condition": "同一機序の反例・閉鎖例・開放例を複数source lensで確認し、human reviewで昇格範囲を決める。",
    },
    {
        "hold_id": "H-04-raw-original-and-derived-source-boundary",
        "why_hold_is_honest": "一部はredacted自由記述、NIVR/Workshopは派生要約・local docs中心であり、本文の公開引用や外部化はしていない。",
        "what_was_tightened": "raw/redacted text, field values, short quotes, and PII remain outside artifacts.",
        "reopen_condition": "必要なsource familyごとにpermissioned raw/full-text rereadingを行い、no-export境界で差分だけを構造化する。",
    },
]


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def combined_counts(summaries: list[dict[str, Any]]) -> dict[str, Any]:
    route_counts: Counter[str] = Counter()
    source_counts: Counter[str] = Counter()
    closure_counts: Counter[str] = Counter()
    total = 0
    for summary in summaries:
        total += int(summary["result_count"])
        route_counts.update(summary.get("route_counts", {}))
        route_counts.update(summary.get("axis_counts", {}))
        source_counts.update(summary.get("dataset_counts", {}))
        source_counts.update(summary.get("source_family_counts", {}))
        closure_counts.update(summary.get("relation_closure_counts", {}))
    return {
        "result_count": total,
        "route_or_axis_counts": {route: route_counts.get(route, 0) for route in ROUTE_ORDER},
        "source_lens_counts": dict(source_counts),
        "relation_closure_counts": dict(closure_counts),
    }


def validate(payload: dict[str, Any]) -> None:
    text = json.dumps(payload, ensure_ascii=False)
    prohibited = ["_x000D_", "PERSON_NAME", "MEDICAL_INSTITUTION", "raw_quote", "candidate_pattern_promoted"]
    for mark in prohibited:
        if mark in text:
            raise SystemExit(f"prohibited marker found: {mark}")


def write() -> None:
    summaries = [load_json(INPUTS["ft_codex_01"]), load_json(INPUTS["ft_codex_02"]), load_json(INPUTS["ft_codex_03"])]
    counts = combined_counts(summaries)
    payload: dict[str, Any] = {
        "artifact_id": OUT_ID,
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "source_lens_saturation_map_no_text_export_no_promotion_unreviewed",
        "execution_surface": "codex_high_reasoning_session",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "inputs": {key: rel(path) for key, path in INPUTS.items()},
        "combined_counts": counts,
        "route_saturation": ROUTE_SATURATION,
        "remaining_honest_holds": REMAINING_HOLDS,
        "stage1_current_read": {
            "core_candidate_state": "FT-Codex-01/02/03 give enough source-lens thickness to refresh the internal Stage 1 expert route matrix, but not to promote knowledge or approve public/runtime use.",
            "strongest_current_routes": ["C03-support-continuity", "C05-worksite-contact", "C06-life-security", "C01-health-time"],
            "usable_with_route_through_brakes": ["C07-quality-participation", "C08-prework-participation"],
            "next_safe_move": "refresh the Stage 1 Core route mechanism matrix with FT-Codex-03 source-lens additions, preserving no-promotion boundaries",
        },
    }
    validate(payload)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 Source-Lens Saturation Map",
        "",
        "日付: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: source-lens saturation map / no text export / no promotion / unreviewed",
        "",
        "## Position",
        "",
        "FT-Codex-01/02/03を束ね、Stage 1 Coreがどのsource lensで厚くなったか、どこをまだholdするべきかを整理した内部用飽和マップ。",
        "これは完成宣言、review済み知識、source/support validity、public approval、runtime approvalではない。",
        "",
        "## Combined Counts",
        "",
        f"- result_count: {counts['result_count']}",
        f"- route_or_axis_counts: {counts['route_or_axis_counts']}",
        f"- source_lens_counts: {counts['source_lens_counts']}",
        f"- relation_closure_counts: {counts['relation_closure_counts']}",
        "",
        "## Route Saturation",
        "",
    ]
    for route in ROUTE_SATURATION:
        lines.append(f"### {route['route_id']}")
        lines.append(f"- state: {route['saturation_state']}")
        lines.append(f"- source_lens: {', '.join(route['source_lens_coverage'])}")
        lines.append(f"- internal function: {route['usable_internal_function']}")
        lines.append(f"- FT-Codex-03 addition: {route['what_ft03_added']}")
        lines.append(f"- honest hold: {route['honest_hold']}")
        lines.append("")
    lines.extend(["## Remaining Honest Holds", ""])
    for hold in REMAINING_HOLDS:
        lines.append(f"### {hold['hold_id']}")
        lines.append(f"- why hold is honest: {hold['why_hold_is_honest']}")
        lines.append(f"- tightened: {hold['what_was_tightened']}")
        lines.append(f"- reopen condition: {hold['reopen_condition']}")
        lines.append("")
    lines.extend(
        [
            "## Current Read",
            "",
            "- FT-Codex-01/02/03で、内部専門家ネットワークとしてCore route matrixを更新できる厚みは出た。",
            "- C03、C05、C06、C01は現時点で特に強い。C07/C08は使えるがroute-through brake付きで扱う。",
            "- 次の安全な動きは、FT-Codex-03のsource-lens追加をStage 1 Core route mechanism matrixへ反映すること。",
            "",
            "## Boundary",
            "",
            "- raw/redacted text、field value、短い引用、PIIは外部化していない。",
            "- source/support validity、review status、candidate_pattern、Domain Core、public/runtime statusは動かしていない。",
            "- 病名・障害名・制度カテゴリ等は、配慮や就労困難性との関係を相互作用として読む条件窓であり、単純因果lookupにはしない。",
            "",
            f"JSON: `{rel(OUT_JSON)}`",
        ]
    )
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"json": rel(OUT_JSON), "md": rel(OUT_MD), "result_count": counts["result_count"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    write()
