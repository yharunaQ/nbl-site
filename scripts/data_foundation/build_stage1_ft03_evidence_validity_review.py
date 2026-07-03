#!/usr/bin/env python3
"""Build FT03 evidence/source/support-validity review scaffold.

This creates review *inputs* only. It does not decide source validity, support
validity, public safety, runtime approval, candidate-pattern status, Domain Core
status, Atlas/27-frame status, or individual-case judgment.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

MATRIX_JSON = RUN_DIR / "stage1-production-core-route-mechanism-matrix-ft03-refresh-v0-2026-05-23.json"
BOUNDARY_JSON = RUN_DIR / "stage1-production-ft03-human-reviewed-boundary-use-contract-v0-2026-05-25.json"
HANDOFF_JSON = RUN_DIR / "stage1-production-ft03-post-review-product-handoff-index-v0-2026-05-25.json"

PREFIX = "stage1-production-ft03-evidence-validity-review-scaffold-v0-2026-05-26"
LEDGER_PREFIX = "stage1-production-ft03-evidence-support-claim-ledger-v0-2026-05-26"
TOOL_PREFIX = "stage1-production-ft03-evidence-validity-review-tool-v0-2026-05-26"

SCAFFOLD_MD = RUN_DIR / f"{PREFIX}.md"
SCAFFOLD_JSON = RUN_DIR / f"{PREFIX}.json"
LEDGER_JSON = RUN_DIR / f"{LEDGER_PREFIX}.json"
LEDGER_MD = RUN_DIR / f"{LEDGER_PREFIX}.md"
TOOL_HTML = RUN_DIR / f"{TOOL_PREFIX}.html"

DATE = "2026-05-26"

PROHIBITED_MARKERS = [
    "_x000D_",
    "PERSON_NAME",
    "MEDICAL_INSTITUTION",
    "raw_quote",
    "candidate_pattern_promoted",
]

MUST_NOT_DECIDE = [
    "source/support validity final decision by Codex",
    "public_safe/public_approved",
    "runtime_approved",
    "candidate_pattern",
    "Domain Core",
    "Atlas / 27-frame",
    "medical/legal/employment/accommodation/support finality",
    "individual case judgment",
]

SUPPORT_TERMS = [
    "支援",
    "配慮",
    "調整",
    "休職",
    "短時間",
    "遠隔",
    "柔軟",
    "制度",
    "生活保障",
    "相談",
    "開示",
    "翻訳",
    "職場",
    "評価",
]


def validate(payload: Any) -> None:
    text = payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False)
    for marker in PROHIBITED_MARKERS:
        if marker in text:
            raise SystemExit(f"prohibited marker found: {marker}")


def read_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    validate(payload)
    return payload


def write_json(path: Path, payload: dict[str, Any]) -> None:
    validate(payload)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_md(path: Path, text: str) -> None:
    validate(text)
    path.write_text(text, encoding="utf-8")


def short_route(route_id: str) -> str:
    match = re.match(r"QR-(\d+)", route_id)
    if not match:
        raise ValueError(f"unexpected route_id: {route_id}")
    return f"R{match.group(1)}"


def claim_kind_to_bucket(kind: str) -> str:
    return {
        "expert_function": "inference",
        "source_lens_addition": "inference_from_source_lens",
        "route_move": "analytic_instruction",
        "brake": "guardrail",
    }[kind]


def review_priority(kind: str, index: int) -> str:
    if kind == "expert_function":
        return "P0_route_spine"
    if kind == "source_lens_addition":
        return "P1_source_lens_trace"
    if kind == "route_move":
        return "P2_support_claim_boundary"
    if kind == "brake":
        return "P3_boundary_guardrail"
    raise ValueError(kind)


def lens_from_source_lens_text(text: str) -> list[str]:
    prefix = text.split(":", 1)[0].strip()
    if "/" in prefix:
        return [part.strip() for part in prefix.split("/")]
    return [prefix]


def is_support_relevant(text: str) -> bool:
    return any(term in text for term in SUPPORT_TERMS)


def review_questions(kind: str, claim_text: str) -> list[str]:
    questions = [
        "このclaimは、どのsource familyまたは派生成果物から来たものとして追跡できるか。",
        "claimの射程は、根拠の範囲より広がっていないか。",
        "病名・障害名・制度カテゴリから配慮や困難性へのlookupに滑っていないか。",
    ]
    if kind == "source_lens_addition":
        questions.insert(1, "そのsource lensで見えることと、他sourceで未確認のことが分けられているか。")
    if kind == "route_move" or is_support_relevant(claim_text):
        questions.append("支援・配慮・制度・職場対応の妥当性claimに見える場合、質問生成に留めるべきか、別途support validity reviewが必要か。")
    if kind == "brake":
        questions.append("このブレーキは過剰に情報を捨てず、過剰推論を止める形になっているか。")
    return questions


def make_claim(
    route: dict[str, Any],
    kind: str,
    index: int,
    claim_text: str,
    source_lenses: list[str],
) -> dict[str, Any]:
    route_id = route["route_id"]
    claim_id = f"EV-{short_route(route_id)}-{kind.upper().replace('_', '-')}-{index:02d}"
    return {
        "claim_id": claim_id,
        "route_id": route_id,
        "core_axis": route.get("core_axis", []),
        "claim_kind": kind,
        "claim_bucket": claim_kind_to_bucket(kind),
        "review_priority": review_priority(kind, index),
        "claim_text": claim_text,
        "source_lenses": source_lenses,
        "source_artifact": str(MATRIX_JSON.relative_to(ROOT)).replace(".json", ".md"),
        "evidence_state": "derived_stage1_ft03_summary_only_not_source_validated",
        "source_validity_state": "not_reviewed",
        "support_validity_state": "not_reviewed",
        "public_use_state": "not_public_safe_or_public_approved",
        "runtime_use_state": "not_runtime_approved",
        "support_relevant": is_support_relevant(claim_text),
        "review_questions": review_questions(kind, claim_text),
        "allowed_human_review_marks": [
            "trace_ok_scope_ok",
            "trace_ok_scope_too_broad",
            "needs_source_reread",
            "needs_support_validity_review",
            "boundary_rewrite_needed",
            "hold_not_reviewable_now",
        ],
        "must_not_decide_here": MUST_NOT_DECIDE,
    }


def build_claim_ledger(matrix: dict[str, Any]) -> list[dict[str, Any]]:
    claims: list[dict[str, Any]] = []
    for route in matrix["routes"]:
        route_lenses = sorted(
            {
                lens
                for item in route.get("ft03_source_lens_addition", [])
                for lens in lens_from_source_lens_text(item)
            }
        )
        claims.append(
            make_claim(
                route,
                "expert_function",
                1,
                route["expert_function"],
                route_lenses,
            )
        )
        for index, item in enumerate(route.get("ft03_source_lens_addition", []), start=1):
            claims.append(
                make_claim(
                    route,
                    "source_lens_addition",
                    index,
                    item,
                    lens_from_source_lens_text(item),
                )
            )
        for index, item in enumerate(route.get("route_moves", []), start=1):
            claims.append(make_claim(route, "route_move", index, item, route_lenses))
        for index, item in enumerate(route.get("brakes", []), start=1):
            claims.append(make_claim(route, "brake", index, item, route_lenses))
    return claims


def build_scaffold(claims: list[dict[str, Any]]) -> dict[str, Any]:
    kind_counts = Counter(claim["claim_kind"] for claim in claims)
    priority_counts = Counter(claim["review_priority"] for claim in claims)
    return {
        "artifact_id": PREFIX,
        "date": DATE,
        "lane": "Falcon / Falcon Lab",
        "status": "evidence_validity_review_scaffold / review input only / no validity decision",
        "position": "FT03の人間レビュー済み境界利用を、claim単位のsource/support validity reviewへ渡すための作業面。",
        "what_moves_now": [
            "review対象claimの棚卸し",
            "source validityとsupport validityを混ぜないレビュー設計",
            "人間レビューUIに投入できるclaim ledger",
        ],
        "what_does_not_move": [
            "source/support validity",
            "public_safe/public_approved",
            "runtime_approved",
            "candidate_pattern",
            "Domain Core",
            "Atlas / 27-frame",
            "individual judgment",
        ],
        "review_sequence": [
            {
                "step": "A",
                "name": "trace and scope",
                "task": "claimがどの派生成果物・source lensに由来し、射程が広がりすぎていないかを確認する。",
                "moves": "trace/scope review mark only",
            },
            {
                "step": "B",
                "name": "source validity",
                "task": "source type, recency, source-family limits, official/current-policy limitsを確認する。",
                "moves": "source validity candidate mark only if human reviewer decides",
            },
            {
                "step": "C",
                "name": "support validity",
                "task": "支援・配慮・制度・職場対応の妥当性claimへ見える箇所を、質問生成に留めるか、別reviewへ送るか判定する。",
                "moves": "support validity candidate/hold mark only if human reviewer decides",
            },
            {
                "step": "D",
                "name": "boundary rewrite",
                "task": "lookup、個別判断、法的・医学的・雇用上の最終判断に滑る文言を修正対象にする。",
                "moves": "rewrite-needed mark only",
            },
        ],
        "review_batches": [
            {
                "batch_id": "EV-B1-route-spine",
                "claim_filter": "review_priority == P0_route_spine",
                "why_first": "8 routeの背骨。ここが広すぎると全体のvalidity reviewが崩れる。",
            },
            {
                "batch_id": "EV-B2-source-lens-trace",
                "claim_filter": "review_priority == P1_source_lens_trace",
                "why_next": "本人・支援者・職場・NIVR・workshop等の見え方を、根拠の階層でなく部分視点として分ける。",
            },
            {
                "batch_id": "EV-B3-support-boundary",
                "claim_filter": "review_priority == P2_support_claim_boundary",
                "why_next": "route moveが支援妥当性や個別判断に見えないよう、質問生成の範囲へ締める。",
            },
            {
                "batch_id": "EV-B4-guardrails",
                "claim_filter": "review_priority == P3_boundary_guardrail",
                "why_last": "ブレーキが過剰に情報を捨てず、危険な推論だけを止めるか確認する。",
            },
        ],
        "claim_counts": {
            "total": len(claims),
            "by_kind": dict(sorted(kind_counts.items())),
            "by_priority": dict(sorted(priority_counts.items())),
            "support_relevant": sum(1 for claim in claims if claim["support_relevant"]),
        },
        "outputs": {
            "claim_ledger_md": str(LEDGER_MD.relative_to(ROOT)),
            "claim_ledger_json": str(LEDGER_JSON.relative_to(ROOT)),
            "review_tool_html": str(TOOL_HTML.relative_to(ROOT)),
        },
        "inputs": [
            str(MATRIX_JSON.relative_to(ROOT)),
            str(BOUNDARY_JSON.relative_to(ROOT)),
            str(HANDOFF_JSON.relative_to(ROOT)),
        ],
        "must_not_decide_here": MUST_NOT_DECIDE,
    }


def markdown_link(path: Path) -> str:
    rel = path.relative_to(ROOT)
    return f"`{rel}`"


def render_scaffold_md(scaffold: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Evidence / Validity Review Scaffold",
        "",
        f"作成日: {DATE}",
        "Lane: Falcon / Falcon Lab",
        "Status: evidence validity review scaffold / review input only / no validity decision",
        "",
        "## Position",
        "",
        scaffold["position"],
        "",
        "ここで作ったものは、根拠や支援claimをレビューするための作業面であり、Codexによる妥当性判定ではない。",
        "",
        "## What Moves Now",
        "",
        *[f"- {item}" for item in scaffold["what_moves_now"]],
        "",
        "## What Does Not Move",
        "",
        *[f"- {item}" for item in scaffold["what_does_not_move"]],
        "",
        "## Review Sequence",
        "",
    ]
    for step in scaffold["review_sequence"]:
        lines.extend(
            [
                f"### {step['step']}. {step['name']}",
                "",
                f"- Task: {step['task']}",
                f"- Moves: {step['moves']}",
                "",
            ]
        )
    lines.extend(
        [
            "## Review Batches",
            "",
        ]
    )
    for batch in scaffold["review_batches"]:
        why = batch.get("why_first") or batch.get("why_next") or batch.get("why_last")
        lines.extend(
            [
                f"### {batch['batch_id']}",
                "",
                f"- Claim filter: `{batch['claim_filter']}`",
                f"- Why: {why}",
                "",
            ]
        )
    lines.extend(
        [
            "## Claim Counts",
            "",
            f"- Total: {scaffold['claim_counts']['total']}",
            f"- Support-relevant: {scaffold['claim_counts']['support_relevant']}",
            f"- By kind: `{json.dumps(scaffold['claim_counts']['by_kind'], ensure_ascii=False)}`",
            f"- By priority: `{json.dumps(scaffold['claim_counts']['by_priority'], ensure_ascii=False)}`",
            "",
            "## Outputs",
            "",
            f"- Claim ledger MD: {markdown_link(LEDGER_MD)}",
            f"- Claim ledger JSON: {markdown_link(LEDGER_JSON)}",
            f"- Review tool HTML: {markdown_link(TOOL_HTML)}",
            "",
            "## Inputs",
            "",
            *[f"- `{item}`" for item in scaffold["inputs"]],
            "",
            "## Must Not Decide Here",
            "",
            *[f"- {item}" for item in scaffold["must_not_decide_here"]],
            "",
            f"JSON: {markdown_link(SCAFFOLD_JSON)}",
            "",
        ]
    )
    return "\n".join(lines)


def render_ledger_md(claims: list[dict[str, Any]]) -> str:
    lines = [
        "# Stage 1 FT03 Evidence / Support Claim Ledger",
        "",
        f"作成日: {DATE}",
        "Lane: Falcon / Falcon Lab",
        "Status: claim ledger for human review / no validity decision",
        "",
        "この台帳は、FT03 route matrixから根拠・支援validity reviewに回すclaimを分解したもの。raw/redacted narrative text、field value、PIIは含めない。",
        "",
    ]
    by_priority: dict[str, list[dict[str, Any]]] = {}
    for claim in claims:
        by_priority.setdefault(claim["review_priority"], []).append(claim)
    for priority, priority_claims in by_priority.items():
        lines.extend([f"## {priority}", ""])
        for claim in priority_claims:
            lines.extend(
                [
                    f"### {claim['claim_id']}",
                    "",
                    f"- Route: `{claim['route_id']}`",
                    f"- Kind: `{claim['claim_kind']}` / Bucket: `{claim['claim_bucket']}`",
                    f"- Source lenses: `{', '.join(claim['source_lenses'])}`",
                    f"- Support relevant: `{str(claim['support_relevant']).lower()}`",
                    f"- Claim: {claim['claim_text']}",
                    "- Review questions:",
                    *[f"  - {question}" for question in claim["review_questions"]],
                    "",
                ]
            )
    lines.extend([f"JSON: {markdown_link(LEDGER_JSON)}", ""])
    return "\n".join(lines)


def render_review_tool(claims: list[dict[str, Any]], scaffold: dict[str, Any]) -> str:
    data = {
        "generated_at": DATE,
        "scaffold": scaffold,
        "claims": claims,
        "blank_result": {
            "reviewer": "",
            "review_date": "",
            "overall_note": "",
            "results": {},
        },
    }
    json_data = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
    return f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FT03 Evidence / Validity Review</title>
  <style>
    :root {{
      --bg: #f7f7f4;
      --ink: #1f2523;
      --muted: #68716d;
      --line: #d9ddd5;
      --accent: #0d6b5f;
      --accent-2: #315f9d;
      --warn: #8a5d00;
      --panel: #ffffff;
      --soft: #eef4f2;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.6;
    }}
    header {{
      padding: 20px clamp(16px, 4vw, 48px);
      border-bottom: 1px solid var(--line);
      background: #fff;
      position: sticky;
      top: 0;
      z-index: 10;
    }}
    h1 {{
      margin: 0 0 6px;
      font-size: 22px;
      letter-spacing: 0;
    }}
    .sub {{
      color: var(--muted);
      font-size: 14px;
    }}
    main {{
      display: grid;
      grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
      gap: 18px;
      padding: 18px clamp(16px, 4vw, 48px) 40px;
    }}
    aside, .claim-panel {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
    }}
    aside {{
      align-self: start;
      position: sticky;
      top: 92px;
      max-height: calc(100vh - 112px);
      overflow: auto;
      padding: 14px;
    }}
    .claim-panel {{
      padding: clamp(16px, 3vw, 28px);
      min-width: 0;
    }}
    .filters {{
      display: grid;
      gap: 10px;
      margin: 14px 0;
    }}
    label {{
      font-size: 13px;
      color: var(--muted);
      display: grid;
      gap: 5px;
    }}
    input, select, textarea {{
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 9px 10px;
      font: inherit;
      background: #fff;
      color: var(--ink);
    }}
    textarea {{ min-height: 88px; resize: vertical; }}
    .claim-list {{
      display: grid;
      gap: 6px;
      margin-top: 12px;
    }}
    .claim-button {{
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 6px;
      padding: 8px;
      text-align: left;
      cursor: pointer;
      font: inherit;
      min-height: 42px;
    }}
    .claim-button.active {{
      border-color: var(--accent);
      background: var(--soft);
    }}
    .claim-button.done::after {{
      content: "記録済";
      display: inline-block;
      margin-left: 6px;
      color: var(--accent);
      font-size: 12px;
    }}
    .meta {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0 18px;
    }}
    .pill {{
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 3px 9px;
      border-radius: 999px;
      background: var(--soft);
      color: var(--ink);
      font-size: 13px;
      border: 1px solid var(--line);
    }}
    .claim-text {{
      font-size: 19px;
      line-height: 1.75;
      padding: 16px 18px;
      border-left: 4px solid var(--accent);
      background: #fbfcfb;
      margin: 0 0 18px;
    }}
    h2 {{
      font-size: 19px;
      margin: 22px 0 8px;
      letter-spacing: 0;
    }}
    h3 {{
      font-size: 15px;
      margin: 18px 0 8px;
      letter-spacing: 0;
    }}
    .checks {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }}
    .field {{
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fff;
    }}
    .questions {{
      background: #fff9eb;
      border: 1px solid #ecd89c;
      border-radius: 8px;
      padding: 12px 16px;
    }}
    .questions li {{ margin: 6px 0; }}
    .actions {{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }}
    button {{
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px 12px;
      font: inherit;
      background: #fff;
      cursor: pointer;
    }}
    button.primary {{
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }}
    button.secondary {{
      background: var(--accent-2);
      color: #fff;
      border-color: var(--accent-2);
    }}
    .small {{
      color: var(--muted);
      font-size: 13px;
    }}
    .blocked {{
      margin-top: 18px;
      color: var(--muted);
      font-size: 13px;
      border-top: 1px solid var(--line);
      padding-top: 12px;
    }}
    @media (max-width: 820px) {{
      header {{ position: static; }}
      main {{ grid-template-columns: 1fr; }}
      aside {{ position: static; max-height: none; }}
      .checks {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <header>
    <h1>FT03 Evidence / Validity Review</h1>
    <div class="sub">claimごとに、根拠追跡・source validity・support validity・境界修正を分けて記録する画面です。ここでは承認ではなくレビュー記録だけを作ります。</div>
  </header>
  <main>
    <aside>
      <div class="small" id="count"></div>
      <div class="filters">
        <label>レビュー者
          <input id="reviewer" placeholder="名前またはイニシャル">
        </label>
        <label>日付
          <input id="reviewDate" type="date">
        </label>
        <label>優先度
          <select id="priorityFilter">
            <option value="">すべて</option>
          </select>
        </label>
        <label>種類
          <select id="kindFilter">
            <option value="">すべて</option>
          </select>
        </label>
      </div>
      <div class="claim-list" id="claimList"></div>
    </aside>
    <section class="claim-panel">
      <div class="small" id="position"></div>
      <h2 id="claimTitle"></h2>
      <div class="meta" id="claimMeta"></div>
      <p class="claim-text" id="claimText"></p>

      <h2>このカードで見ること</h2>
      <div class="questions">
        <ul id="questions"></ul>
      </div>

      <h2>レビュー記録</h2>
      <div class="checks">
        <div class="field">
          <label>1. 根拠追跡
            <select data-field="trace_mark">
              <option value="">未記録</option>
              <option value="trace_ok_scope_ok">追跡でき、射程も妥当</option>
              <option value="trace_ok_scope_too_broad">追跡できるが射程が広い</option>
              <option value="needs_source_reread">source再読が必要</option>
              <option value="hold_not_reviewable_now">今はレビュー保留</option>
            </select>
          </label>
        </div>
        <div class="field">
          <label>2. source validity
            <select data-field="source_validity_mark">
              <option value="">未記録</option>
              <option value="not_validity_reviewed">まだ妥当性判断しない</option>
              <option value="adequate_for_internal_structural_use">内部構造仮説には足りる</option>
              <option value="weak_or_partial_source">弱い・部分的</option>
              <option value="outdated_or_current_claim_risk">古い・現行claimに危険</option>
              <option value="needs_external_or_original_check">外部/原資料確認が必要</option>
            </select>
          </label>
        </div>
        <div class="field">
          <label>3. support validity
            <select data-field="support_validity_mark">
              <option value="">未記録</option>
              <option value="not_a_support_validity_claim">支援妥当性claimではない</option>
              <option value="question_generation_only">質問生成に留める</option>
              <option value="needs_support_validity_review">支援妥当性レビューが必要</option>
              <option value="unsafe_support_implication">危険な支援示唆がある</option>
              <option value="hold_not_reviewable_now">今はレビュー保留</option>
            </select>
          </label>
        </div>
        <div class="field">
          <label>4. 境界
            <select data-field="boundary_mark">
              <option value="">未記録</option>
              <option value="boundary_ok">境界は保たれている</option>
              <option value="rewrite_needed">文言修正が必要</option>
              <option value="lookup_risk">病名・障害名lookupリスク</option>
              <option value="finality_risk">個別/法的/医学的最終判断リスク</option>
              <option value="hold_not_reviewable_now">今はレビュー保留</option>
            </select>
          </label>
        </div>
      </div>

      <h3>メモ</h3>
      <textarea data-field="review_note" placeholder="なぜそう判断したか。必要なら、次に読む資料や修正文案を書く。"></textarea>

      <div class="actions">
        <button id="prevBtn">前へ</button>
        <button class="primary" id="saveNextBtn">保存して次へ</button>
        <button id="nextBtn">次へ</button>
        <button class="secondary" id="exportBtn">JSONを書き出す</button>
      </div>
      <div class="blocked">
        ここで決めないこと: source/support validityの最終決定、public-approved、runtime-approved、candidate_pattern、Domain Core、Atlas/27-frame、個別判断。
      </div>
    </section>
  </main>
  <script id="review-data" type="application/json">{json_data}</script>
  <script>
    const data = JSON.parse(document.getElementById('review-data').textContent);
    const claims = data.claims;
    const results = {{}};
    let filtered = [...claims];
    let index = 0;

    const qs = (sel) => document.querySelector(sel);
    const qsa = (sel) => [...document.querySelectorAll(sel)];
    const claimList = qs('#claimList');
    const fields = () => qsa('[data-field]');

    function unique(key) {{
      return [...new Set(claims.map(c => c[key]))].sort();
    }}

    function fillFilters() {{
      for (const value of unique('review_priority')) {{
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = value;
        qs('#priorityFilter').appendChild(opt);
      }}
      for (const value of unique('claim_kind')) {{
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = value;
        qs('#kindFilter').appendChild(opt);
      }}
      qs('#reviewDate').value = data.generated_at;
    }}

    function applyFilters() {{
      const p = qs('#priorityFilter').value;
      const k = qs('#kindFilter').value;
      filtered = claims.filter(c => (!p || c.review_priority === p) && (!k || c.claim_kind === k));
      index = Math.min(index, Math.max(filtered.length - 1, 0));
      renderList();
      renderClaim();
    }}

    function resultFor(claimId) {{
      if (!results[claimId]) results[claimId] = {{}};
      return results[claimId];
    }}

    function saveCurrent() {{
      const claim = filtered[index];
      if (!claim) return;
      const result = resultFor(claim.claim_id);
      for (const field of fields()) {{
        result[field.dataset.field] = field.value;
      }}
      result.updated_at = new Date().toISOString();
    }}

    function loadCurrentResult() {{
      const claim = filtered[index];
      const result = claim ? resultFor(claim.claim_id) : {{}};
      for (const field of fields()) {{
        field.value = result[field.dataset.field] || '';
      }}
    }}

    function renderList() {{
      claimList.innerHTML = '';
      qs('#count').textContent = `${{filtered.length}}件 / 全${{claims.length}}件`;
      filtered.forEach((claim, i) => {{
        const btn = document.createElement('button');
        btn.className = 'claim-button';
        if (i === index) btn.classList.add('active');
        if (results[claim.claim_id] && Object.values(results[claim.claim_id]).some(Boolean)) btn.classList.add('done');
        btn.textContent = `${{claim.claim_id}}  ${{claim.claim_kind}}`;
        btn.addEventListener('click', () => {{
          saveCurrent();
          index = i;
          renderList();
          renderClaim();
        }});
        claimList.appendChild(btn);
      }});
    }}

    function renderClaim() {{
      const claim = filtered[index];
      if (!claim) {{
        qs('#claimTitle').textContent = '対象がありません';
        qs('#claimText').textContent = '';
        qs('#claimMeta').innerHTML = '';
        qs('#questions').innerHTML = '';
        return;
      }}
      qs('#position').textContent = data.scaffold.position;
      qs('#claimTitle').textContent = claim.claim_id;
      qs('#claimText').textContent = claim.claim_text;
      qs('#claimMeta').innerHTML = [
        ['Route', claim.route_id],
        ['Kind', claim.claim_kind],
        ['Bucket', claim.claim_bucket],
        ['Priority', claim.review_priority],
        ['Source lenses', claim.source_lenses.join(', ')],
        ['Support relevant', claim.support_relevant ? 'yes' : 'no'],
      ].map(([k, v]) => `<span class="pill">${{k}}: ${{v}}</span>`).join('');
      qs('#questions').innerHTML = claim.review_questions.map(q => `<li>${{q}}</li>`).join('');
      loadCurrentResult();
      renderList();
    }}

    function move(delta) {{
      saveCurrent();
      index = Math.max(0, Math.min(filtered.length - 1, index + delta));
      renderClaim();
    }}

    function exportJson() {{
      saveCurrent();
      const payload = {{
        artifact_id: 'stage1-production-ft03-evidence-validity-review-result',
        source_tool: '{TOOL_PREFIX}.html',
        reviewer: qs('#reviewer').value,
        review_date: qs('#reviewDate').value,
        generated_at: new Date().toISOString(),
        boundary: 'human review record only; no Codex-owned validity movement',
        results,
      }};
      const blob = new Blob([JSON.stringify(payload, null, 2)], {{ type: 'application/json' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stage1-production-ft03-evidence-validity-review-result-filled-v0-2026-05-26.json';
      a.click();
      URL.revokeObjectURL(url);
    }}

    qs('#priorityFilter').addEventListener('change', applyFilters);
    qs('#kindFilter').addEventListener('change', applyFilters);
    qs('#prevBtn').addEventListener('click', () => move(-1));
    qs('#nextBtn').addEventListener('click', () => move(1));
    qs('#saveNextBtn').addEventListener('click', () => move(1));
    qs('#exportBtn').addEventListener('click', exportJson);

    fillFilters();
    applyFilters();
  </script>
</body>
</html>
"""


def main() -> None:
    matrix = read_json(MATRIX_JSON)
    boundary = read_json(BOUNDARY_JSON)
    handoff = read_json(HANDOFF_JSON)

    if "source_validity" not in boundary.get("not_allowed", []):
        raise SystemExit("boundary contract does not preserve source_validity as not_allowed")
    if "source/support validity" not in handoff.get("non_movement", []):
        raise SystemExit("handoff index does not preserve source/support validity non-movement")

    claims = build_claim_ledger(matrix)
    scaffold = build_scaffold(claims)

    ledger_payload = {
        "artifact_id": LEDGER_PREFIX,
        "date": DATE,
        "lane": "Falcon / Falcon Lab",
        "status": "claim ledger for human evidence/source/support-validity review / no validity decision",
        "source": str(MATRIX_JSON.relative_to(ROOT)),
        "claim_count": len(claims),
        "claims": claims,
        "must_not_decide_here": MUST_NOT_DECIDE,
    }

    write_json(SCAFFOLD_JSON, scaffold)
    write_json(LEDGER_JSON, ledger_payload)
    write_md(SCAFFOLD_MD, render_scaffold_md(scaffold))
    write_md(LEDGER_MD, render_ledger_md(claims))
    write_md(TOOL_HTML, render_review_tool(claims, scaffold))

    print(f"wrote {SCAFFOLD_MD.relative_to(ROOT)}")
    print(f"wrote {LEDGER_MD.relative_to(ROOT)}")
    print(f"wrote {TOOL_HTML.relative_to(ROOT)}")
    print(f"claims: {len(claims)}")


if __name__ == "__main__":
    main()
