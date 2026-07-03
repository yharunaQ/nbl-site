#!/usr/bin/env python3
"""Build a no-text Stage 1 Core route mechanism matrix.

This artifact consolidates Codex-high survey context reading, 2001 ABC
mechanism crosswalk, web-cache deep readings, and reread calibration into
a chat-usable expert kernel surface without promoting any knowledge item.
"""

from __future__ import annotations

import json
from pathlib import Path


OUT_DIR = Path("references/derived/scima-fchma/stage1-production-v0-2026-05-18")
BASE = "stage1-production-core-route-mechanism-matrix-v0-2026-05-23"


INPUTS = [
    "stage1-production-ft-codex-01-c01-c03-c05-context-reading-v0-2026-05-23-summary.md",
    "stage1-production-ft-codex-01-network-reconnection-v0-2026-05-23.md",
    "stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23-summary.md",
    "stage1-production-ft-codex-02-c02-c04-c06-c07-c08-context-reading-v0-2026-05-23-network-reconnection.md",
    "stage1-production-2001-abc-mechanism-crosswalk-v0-2026-05-23.md",
    "stage1-production-web-cache-deep-reading-batch1-jeed-reference-p0-v0-2026-05-23.md",
    "stage1-production-web-cache-deep-reading-batch2-official-underread-axis-v0-2026-05-23.md",
    "stage1-production-core-expert-kernel-reread-calibration-v0-2026-05-23.md",
]


ROUTES = [
    {
        "route_id": "QR-01-health-time-work-design",
        "core_axis": ["C01-health-time"],
        "current_closure": "active_boundary_sensitive",
        "expert_function": "健康時間を、働ける/働けないではなく、負荷、休息、通院、移動、生活保障、評価、仕事意味が同時に組み替わる設計変数として読む。",
        "strongest_source_windows": [
            "FT-Codex-01 C01 context reading",
            "2001 ABC MN03/MN05/MN09/MN10/MN11",
            "web-cache Batch 1/2 health-time/work-design windows",
            "reread calibration CR-01 with CR-05 brake",
        ],
        "mechanism": [
            "健康信号が、時間量だけでなく負荷ピーク、休憩、通勤、異動、在宅、自己管理、生活保障、評価へ分岐する。",
            "支援や職場理解は、健康情報を仕事手順と評価規則へ再翻訳できる時だけ自由度になる。",
            "生活保障が弱い場合、休む、待つ、戻る、選び直す自由度が先に閉じる。",
        ],
        "expert_moves": [
            "健康状態を、時間、負荷、休息、通院、移動、評価、収入へ分解する。",
            "C01だけで閉じず、生活保障が前景化すればC06、価値・役割が前景化すればC07、入口順序ならC08へ逃がす。",
            "病名・障害名は、健康時間が見えにくくなる接触点を探す条件窓として扱う。",
        ],
        "brakes": [
            "体調変動や通院の有無から就労困難性、支援必要性、仕事能力を判断しない。",
            "配慮が存在することを健康時間が開いた証拠にしない。",
        ],
    },
    {
        "route_id": "QR-02-information-work-procedure",
        "core_axis": ["C04-information-participation"],
        "current_closure": "active_with_contact_point_support",
        "expert_function": "情報を説明量ではなく、会議、指示、非公式情報、安全、責任、評価、人事、処遇へ同期する参加構造として読む。",
        "strongest_source_windows": [
            "FT-Codex-02 C04 context reading",
            "2001 ABC MN02/MN04/MN11/MN12",
            "JEED hearing/manual and employer Q&A web-cache windows",
            "reread calibration CR-04 with CR-05 brake",
        ],
        "mechanism": [
            "情報形式が作業手順、安全確認、責任分担、評価境界へ落ちる時に参加自由度になる。",
            "筆談、通訳、メール、動画、口頭代替などの手段は、所属、処遇、将来見通しまで届かなければ未解決が残る。",
            "情報同期は一回の説明ではなく、業務変化、体調変化、評価場面で更新される。",
        ],
        "expert_moves": [
            "情報が届かない場所を、指示、会議、非公式情報、安全、評価、人事へ分ける。",
            "本人の説明能力ではなく、職場側が情報を使える単位へ翻訳する構造を見る。",
            "情報課題がC05接触点、C07価値翻訳、C03支援再翻訳へ波及しているかを確認する。",
        ],
        "brakes": [
            "情報課題を本人理解力や感覚障害カテゴリへ還元しない。",
            "情報手段の存在を情報参加の達成と読まない。",
        ],
    },
    {
        "route_id": "QR-03-worksite-contact-and-mobility",
        "core_axis": ["C05-worksite-contact"],
        "current_closure": "thickest_current_route",
        "expert_function": "仕事接触点を、設備リストではなく、身体、認知、情報、道具、場所、安全、休憩、評価が接する設計面として読む。",
        "strongest_source_windows": [
            "FT-Codex-01 C05 context reading",
            "2001 ABC B票職場上司回答 and MN01/MN02/MN04/MN05/MN10/MN11/MN12",
            "web-cache Batch 1/2 C05 worksite-contact windows",
            "reread calibration CR-04 with CR-05 brake",
        ],
        "mechanism": [
            "接触点は、設備、動線、姿勢、道具、情報、安全、休憩、代替作業、求人要件、評価運用へ分解される。",
            "同じ作業名でも、職場上の接触点、負荷、情報、評価、尊厳の構造が異なる。",
            "接触点設計は固定配慮ではなく、職務変化、体調変化、異動、在宅取消、証明不能で更新が必要になる。",
        ],
        "expert_moves": [
            "障害名から配慮表へ行かず、実際の作業接点を分解する。",
            "C05が厚い時ほど、C04情報同期、C01健康時間、C07価値翻訳、C06生活保障への波及を確認する。",
            "職場側データは本人経験や支援妥当性ではなく、接触点語彙を増やす窓として使う。",
        ],
        "brakes": [
            "設備・作業環境を支援妥当性や能力判定へ変換しない。",
            "職場側の問題認識や解決状態を本人側の経験と同一視しない。",
        ],
    },
    {
        "route_id": "QR-04-life-security-sequencing",
        "core_axis": ["C06-life-security"],
        "current_closure": "active_boundary_sensitive",
        "expert_function": "生活保障を背景事情ではなく、待つ、休む、治療する、選び直す、戻る自由度を決める順序構造として読む。",
        "strongest_source_windows": [
            "FT-Codex-02 C06 context reading",
            "FT-Codex-01 C01 escape-route readings",
            "2001 ABC MN05/MN06/MN08/MN10/MN11/MN12",
            "web-cache Batch 2 MHLW/JEED/NIVR C06 windows",
        ],
        "mechanism": [
            "医療費、所得上限、賃金、雇用形態、家族責任、制度対象外性が仕事選択と継続順序を直接形作る。",
            "生活保障が弱いと、健康時間や適職探索を待てず、入口選択が先に狭まる。",
            "支援は、生活条件を仕事条件へ翻訳できる場合にだけ入口順序を組み替える。",
        ],
        "expert_moves": [
            "生活問題として分離せず、仕事選択の順序をどこで閉じているかを見る。",
            "待てる時間、休める時間、試せる仕事、戻れる経路を分ける。",
            "C06を使って、C01/C05/C07/C08への過剰吸収を止める。",
        ],
        "brakes": [
            "制度・給付・政策の現在妥当性や利用可能性を判断しない。",
            "就労希望や就労継続を生活保障の解決証拠にしない。",
        ],
    },
    {
        "route_id": "QR-05-entry-prework-translation",
        "core_axis": ["C02-entry-translation", "C08-prework-participation"],
        "current_closure": "active_but_sequence_sensitive",
        "expert_function": "入口と入口以前参加を、準備不足ではなく、健康、生活、訓練、支援、開示、求人条件が職務条件へ翻訳される順序として読む。",
        "strongest_source_windows": [
            "FT-Codex-02 C02/C08 context reading",
            "FT-Codex-01 C03/C05 escape routes",
            "web-cache Batch 1/2 entry-prework windows",
            "2001 ABC as weak boundary window only",
        ],
        "mechanism": [
            "入口翻訳は開示技術ではなく、窓口分類、制度カテゴリ、求人条件、健康安全説明、面接前の足切りが仕事条件へ翻訳されるかの問題である。",
            "開示済みでも、通院、急変、温度、休憩、短時間、在宅訓練などに接続されなければ入口は閉じない。",
            "入口以前参加は、治療、生活保障、訓練、応募、復職、再就職、非開示、開始後継続の順序として読む。",
        ],
        "expert_moves": [
            "応募前に閉じている自由度を、生活、訓練、支援、求人理解、開示、安全へ分ける。",
            "未就労や訓練段階を準備不足と読まず、何へ翻訳されれば入口が開くかを見る。",
            "C02とC08をC03支援連続性、C01健康時間、C06生活保障へ接続して読む。",
        ],
        "brakes": [
            "本人の自己受容や励まし支援を、職務条件翻訳の代替にしない。",
            "2001 ABCは雇用中リンクデータなので、入口以前参加の主根拠にしない。",
        ],
    },
    {
        "route_id": "QR-06-disclosure-boundary-and-mutual-translation",
        "core_axis": ["C02-entry-translation", "C03-support-continuity", "C04-information-participation"],
        "current_closure": "active_with_hard_finality_brake",
        "expert_function": "開示を、言う/言わないではなく、本人条件と職務条件をどの範囲で安全に相互翻訳するかの境界として読む。",
        "strongest_source_windows": [
            "FT-Codex-02 C02/C04 context reading",
            "FT-Codex-01 C03 support-continuity reading",
            "2001 ABC B/C/A差 and MN03/MN04/MN06/MN08/MN10",
            "web-cache Batch 1/2 disclosure-boundary windows",
        ],
        "mechanism": [
            "開示量ではなく、開示された情報が職務手順、安全、責任、評価、休息、通院、支援役割へ落ちるかが中核である。",
            "制度カテゴリ外、単一疾患枠、同病名事例不足、職場側の敵対的解釈は、支援の存在を断絶へ反転させる。",
            "三者差は正誤ではなく、翻訳先が異なることによる構造差として読む。",
        ],
        "expert_moves": [
            "何を開示したかより、誰がどの仕事条件へ翻訳したかを見る。",
            "開示境界が健康時間、情報同期、生活保障、評価へどう波及したかを確認する。",
            "支援者・本人・職場のどれが正しいかではなく、翻訳が止まった場所を特定する。",
        ],
        "brakes": [
            "開示すべきか、誰が正しいか、どの情報が十分かを決めない。",
            "開示の多寡や職場理解の善悪を支援妥当性判断に変えない。",
        ],
    },
    {
        "route_id": "QR-07-quality-career-and-value-translation",
        "core_axis": ["C07-quality-participation"],
        "current_closure": "narrow_route_through_adjacent_axes",
        "expert_function": "参加品質を、満足度や継続ではなく、役割、評価、処遇、技能形成、将来見通しへ条件付き遂行が価値翻訳されるかとして読む。",
        "strongest_source_windows": [
            "FT-Codex-02 C07 route-through readings",
            "2001 ABC MN01/MN07/MN08/MN09/MN10/MN12",
            "web-cache Batch 1/2 C07 windows",
            "reread calibration CR-02 with CR-05 brake",
        ],
        "mechanism": [
            "働けていること、満足度、雇用継続、配慮項目は成功証明ではなく、価値翻訳の検査入口である。",
            "参加品質はC05接触点、C03支援再翻訳、C01健康時間、C06生活保障を通ってだけ厚く読める。",
            "条件付き遂行が役割、評価、処遇、技能形成、将来見通しへ接続するかが焦点である。",
        ],
        "expert_moves": [
            "C07を単独昇格させず、C05/C03/C01/C06経由で読む。",
            "役割、評価、処遇、将来見通しが文脈で閉じた時だけ厚く使う。",
            "満足度や雇用継続を、反証・注意窓として必ず保持する。",
        ],
        "brakes": [
            "満足度、定着、処遇、構造化項目の被覆だけで参加品質を語らない。",
            "成功事例、美談、企業評価、本人能力評価にしない。",
        ],
    },
    {
        "route_id": "QR-08-diversity-conditioned-same-structure",
        "core_axis": ["condition-window-use-across-C01-C08"],
        "current_closure": "condition_window_with_hard_lookup_brake",
        "expert_function": "病名・障害名・機能・程度・年齢・性別等を、同じ相互作用構造がどの接触点で変形するかを探す条件窓として扱う。",
        "strongest_source_windows": [
            "2001 ABC condition-window mechanisms MN11/MN12",
            "FT-Codex-01/02 condition-window brakes",
            "web-cache family profiles by source role and jurisdiction",
            "method correction on condition-window use",
        ],
        "mechanism": [
            "条件窓は、健康時間、仕事接触点、情報参加、生活保障、評価、開示境界の見え方を変える。",
            "条件窓差は、制度時代、サンプル構成、回答者、分類粒度、三者不一致から切り離さずに読む。",
            "同じ構造と、多様性条件下でだけ見える特殊構造を分けて探索する。",
        ],
        "expert_moves": [
            "病名・障害名をタブー化せず、しかし配慮表のキーにはしない。",
            "条件窓から、どの自由度・接触点・翻訳機序が変形しているかを問う。",
            "少数窓は発見窓として使い、単独昇格や現在主張に使わない。",
        ],
        "brakes": [
            "病名・障害名から配慮、困難性、支援必要性を直接引かない。",
            "条件窓差を制度時代、サンプル構成、回答者、分類粒度から切り離さない。",
        ],
    },
]


GLOBAL_UPGRADES = [
    "FT-Codex-01/02により、8 routeのうちC01/C02/C03/C04/C05/C06の実読解厚みが増し、C07/C08はroute-throughとして誇張を抑える使用法に固定された。",
    "2001 ABCは時系列的基礎ではなく、三者差、職場接触点、条件窓を厚くする構造窓として使う位置づけが明確になった。",
    "web-cache Batch 1/2は、公式・準公式資料を権威根拠でなく、職場手順、生活保障順序、入口翻訳、参加品質の語彙供給源として接続した。",
    "条件窓はタブーではないが、配慮・困難性の直接検索キーではないという科学的使用法に補正された。",
]

GLOBAL_BRAKES = [
    "No raw or redacted narrative text, field values, short quotes, or PII are exported.",
    "No source/support validity, review status, candidate_pattern, Domain Core, Atlas/27-frame, public approval, or runtime approval is moved.",
    "No legal, medical, HR, employment, accommodation, support adequacy, worker capacity, or individual-case final judgment is made.",
    "Official and quasi-official sources remain source-readiness/candidate-structure inputs unless separately reviewed and live-verified for public/current claims.",
]


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def md_list(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def build_markdown(payload: dict) -> str:
    lines: list[str] = [
        "# Stage 1 Core Route Mechanism Matrix",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "Status: internal expert route matrix / no text export / no promotion / unreviewed / runtime未承認",
        "",
        "## Position",
        "",
        "これはStage 1 Coreを、Codexチャットで使えるroute別の専門家推論面へ再編した成果物である。完成宣言、review済み知識、支援妥当性、現行制度説明、公開根拠ではない。",
        "",
        "入力は、FT-Codex-01/02のCodex高推論によるredacted+structured context reading、2001 ABC mechanism crosswalk、web-cache deep reading Batch 1/2、Core Expert Kernel reread calibrationである。本文、伏字本文、field値、短い引用、PIIは含めない。",
        "",
        "## Inputs",
        "",
        md_list([f"`{item}`" for item in payload["inputs"]]),
        "",
        "## Global Upgrades",
        "",
        md_list(payload["global_upgrades"]),
        "",
        "## Global Brakes",
        "",
        md_list(payload["global_brakes"]),
        "",
        "## Route Matrix",
        "",
    ]
    for route in payload["routes"]:
        lines.extend(
            [
                f"### {route['route_id']}",
                "",
                f"- core_axis: {', '.join(f'`{axis}`' for axis in route['core_axis'])}",
                f"- current_closure: `{route['current_closure']}`",
                f"- expert_function: {route['expert_function']}",
                "",
                "**Strongest Source Windows**",
                "",
                md_list(route["strongest_source_windows"]),
                "",
                "**Mechanism**",
                "",
                md_list(route["mechanism"]),
                "",
                "**Expert Moves**",
                "",
                md_list(route["expert_moves"]),
                "",
                "**Brakes**",
                "",
                md_list(route["brakes"]),
                "",
            ]
        )
    lines.extend(
        [
            "## Expert-Agent Use Contract",
            "",
            "- まずrouteを一つに固定せず、C01-C08のどこへ逃がすべきかを確認する。",
            "- 条件窓を使う時は、自由度・接触点・翻訳機序の変形を問う。",
            "- 構造化項目、満足度、雇用継続、支援の有無、公式資料の存在を、成功・妥当性・現在利用可能性の証明にしない。",
            "- C07/C08は単独routeではなく、C01/C02/C03/C05/C06を通した検査路として使う。",
            "- 回答では、確定判断でなく、どの相互作用を見に行くべきかを提示する。",
            "",
            f"JSON: `{OUT_DIR / (BASE + '.json')}`",
        ]
    )
    return "\n".join(lines) + "\n"


def validate_no_text_export(text: str) -> None:
    forbidden = [
        "_x000D_",
        "PERSON_NAME",
        "MEDICAL_INSTITUTION",
        "問1",
        "問2",
        "潰瘍性",
        "全身性",
        "ALS",
        "筋萎縮",
        "膿疱",
        "電話対応が出来ない",
        "ハローワークへ行け",
    ]
    found = [token for token in forbidden if token in text]
    if found:
        raise SystemExit(f"forbidden text export marker(s): {found}")


def main() -> None:
    payload = {
        "date": "2026-05-23",
        "lane": "Falcon / Falcon Lab",
        "status": "internal_expert_route_matrix_no_text_export_no_promotion_unreviewed",
        "inputs": INPUTS,
        "global_upgrades": GLOBAL_UPGRADES,
        "global_brakes": GLOBAL_BRAKES,
        "routes": ROUTES,
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    md = build_markdown(payload)
    validate_no_text_export(md)
    validate_no_text_export(json.dumps(payload, ensure_ascii=False))
    write_json(OUT_DIR / f"{BASE}.json", payload)
    (OUT_DIR / f"{BASE}.md").write_text(md, encoding="utf-8")
    print(json.dumps({"markdown": str(OUT_DIR / f"{BASE}.md"), "json": str(OUT_DIR / f"{BASE}.json"), "routes": len(ROUTES)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
