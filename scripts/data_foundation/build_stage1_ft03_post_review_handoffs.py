#!/usr/bin/env python3
"""Build post-review handoff artifacts from the FT03 boundary contract.

These are product-facing *inputs* derived from the human-reviewed boundary use
contract. They do not approve public copy, runtime use, source/support validity,
candidate patterns, Domain Core, Atlas/27-frame, or individual judgments.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

CONTRACT_JSON = RUN_DIR / "stage1-production-ft03-human-reviewed-boundary-use-contract-v0-2026-05-25.json"
OVERLAY_JSON = RUN_DIR / "stage1-production-ft03-human-review-result-complete-overlay-v0-2026-05-25.json"

INTERNAL_AGENT_PREFIX = "stage1-production-ft03-internal-expert-agent-response-contract-v0-2026-05-25"
PUBLIC_CONCEPT_PREFIX = "stage1-production-ft03-next-nbl-public-concept-candidates-v0-2026-05-25"
RUNTIME_PREFLIGHT_PREFIX = "stage1-production-ft03-runtime-preflight-requirements-v0-2026-05-25"
HANDOFF_INDEX_PREFIX = "stage1-production-ft03-post-review-product-handoff-index-v0-2026-05-25"

INTERNAL_AGENT_MD = RUN_DIR / f"{INTERNAL_AGENT_PREFIX}.md"
INTERNAL_AGENT_JSON = RUN_DIR / f"{INTERNAL_AGENT_PREFIX}.json"
PUBLIC_CONCEPT_MD = RUN_DIR / f"{PUBLIC_CONCEPT_PREFIX}.md"
PUBLIC_CONCEPT_JSON = RUN_DIR / f"{PUBLIC_CONCEPT_PREFIX}.json"
RUNTIME_PREFLIGHT_MD = RUN_DIR / f"{RUNTIME_PREFLIGHT_PREFIX}.md"
RUNTIME_PREFLIGHT_JSON = RUN_DIR / f"{RUNTIME_PREFLIGHT_PREFIX}.json"
HANDOFF_INDEX_MD = RUN_DIR / f"{HANDOFF_INDEX_PREFIX}.md"
HANDOFF_INDEX_JSON = RUN_DIR / f"{HANDOFF_INDEX_PREFIX}.json"


PROHIBITED_MARKERS = [
    "_x000D_",
    "PERSON_NAME",
    "MEDICAL_INSTITUTION",
    "raw_quote",
    "candidate_pattern_promoted",
]


EXPECTED_MOVES = [
    "internal_codex_use_allowed_with_unreviewed_candidate_label",
    "route_brakes_reviewed_for_internal_use",
    "source_lens_separation_reviewed_for_internal_use",
    "condition_window_guardrail_reviewed_for_internal_use",
    "support_claim_safety_reviewed_for_internal_questions",
    "public_concept_review_input_ready",
    "runtime_preflight_requirements_ready",
]


EIGHT_VIEWS = [
    {
        "id": "V1",
        "name": "健康時間と働き方",
        "agent_use": "体調、通院、疲労、休息、戻り方を、仕事の時間・負荷・評価へどうつなげるかを見る。",
        "question": "健康時間は仕事条件にどう翻訳されているか。",
    },
    {
        "id": "V2",
        "name": "情報共有と仕事手順",
        "agent_use": "必要情報が本人同意の範囲で仕事手順・安全・評価に届いているかを見る。",
        "question": "情報は、誰に、どこまで、仕事上どう使われているか。",
    },
    {
        "id": "V3",
        "name": "職場の接触点",
        "agent_use": "作業、道具、安全、顧客、人員余力、欠勤代替など、実際の接点を分解する。",
        "question": "困難や工夫が生じる仕事の接点はどこか。",
    },
    {
        "id": "V4",
        "name": "生活保障と順序",
        "agent_use": "収入、医療費、休職、制度カテゴリが、待つ・休む・戻る自由度をどう変えるかを見る。",
        "question": "生活保障は、仕事選択の順序をどう開閉しているか。",
    },
    {
        "id": "V5",
        "name": "入口と就職前の参加",
        "agent_use": "求人、体験、訓練、生活リズム、開始後支援を一続きの参加過程として見る。",
        "question": "入口前後で何が仕事条件へ翻訳されていないか。",
    },
    {
        "id": "V6",
        "name": "開示と安全な境界",
        "agent_use": "何を誰にどこまで伝え、不利益やプライバシーをどう守るかを見る。",
        "question": "開示は仕事条件と安全な相談線へつながっているか。",
    },
    {
        "id": "V7",
        "name": "役割・評価・将来",
        "agent_use": "働けているかだけでなく、役割、評価、学習、将来見通しが開いているかを見る。",
        "question": "参加の質は、役割・評価・将来へつながっているか。",
    },
    {
        "id": "V8",
        "name": "病名・障害名を手がかりにするが答えにしない",
        "agent_use": "条件名が見えやすくする相互作用と、招きやすい決めつけを分ける。",
        "question": "病名・障害名はどの相互作用を見る窓になっているか。",
    },
]


SIX_LAYERS = [
    "条件: 病名、障害名、年齢、地域、職場規模など",
    "情報源: 本人、支援者、職場、研究報告、過去データなど",
    "仕事設計: 時間、作業、道具、安全、評価、求人表示など",
    "翻訳: 医療・生活・本人説明を仕事条件へつなぎ直す働き",
    "自由度: 待てる、休める、試せる、戻れる、選び直せるなど",
    "レビュー状態: 下書き、レビュー済み、公開可能、システム組込み可能を分ける",
]


PUBLIC_CONCEPTS = [
    {
        "id": "PC-01",
        "working_title": "病名から答えを出さず、仕事との相互作用を見る",
        "public_value": "病名・障害名を避けるのではなく、仕事・環境・支援との関係を見直す入口にする。",
        "possible_surfaces": ["次期NBLトップの中核概念", "SNS連載の初回テーマ", "利用者向け説明カード"],
        "say": ["病名や障害名は、困りごとを決めつけるためではなく、見落としやすい相互作用に気づくための手がかりになる。"],
        "do_not_say": ["この病名ならこの配慮が必要", "障害名から就労困難性が分かる"],
        "needed_before_public": ["public copy risk review", "source/current-policy claim separation", "Founder wording review"],
    },
    {
        "id": "PC-02",
        "working_title": "配慮名ではなく、仕事の接触点を見直す",
        "public_value": "配慮リストではなく、作業・安全・顧客・人員余力など具体的な仕事面を一緒に見る。",
        "possible_surfaces": ["企業向け説明", "ワークデザイン診断の概念候補", "図解記事"],
        "say": ["働きにくさは、抽象的な配慮名だけではなく、仕事のどの接点で起きているかを見ると設計しやすくなる。"],
        "do_not_say": ["AIが合理的配慮を判定する", "この調整で法的に安全"],
        "needed_before_public": ["public copy risk review", "legal-finality wording check", "work-design example review"],
    },
    {
        "id": "PC-03",
        "working_title": "健康時間を仕事設計に戻す",
        "public_value": "通院、疲労、休息、回復、戻り方を、本人の問題ではなく仕事設計の変数として扱う。",
        "possible_surfaces": ["利用者向けインターフェイス", "企業研修テーマ", "インフォグラフィック"],
        "say": ["体調や治療の時間は、仕事量、休み方、評価、復帰の道筋と切り離さずに考える必要がある。"],
        "do_not_say": ["体調から働けるか判定する", "病状に応じた勤務条件をNBLが決める"],
        "needed_before_public": ["medical-finality boundary review", "public wording review", "example anonymization review"],
    },
    {
        "id": "PC-04",
        "working_title": "支援は有無ではなく、情報をつなぎ直す力として見る",
        "public_value": "支援機関があるかだけでなく、医療・生活・職場・本人説明をどうつなぐかを見る。",
        "possible_surfaces": ["支援者向け記事", "内部専門エージェントの説明", "連携設計ワークシート"],
        "say": ["支援の価値は、必要な情報や条件を、変化する局面でつなぎ直せるかにも表れる。"],
        "do_not_say": ["この支援が有効", "支援機関の良否を判定する"],
        "needed_before_public": ["support validity review", "public copy risk review", "support actor dignity review"],
    },
    {
        "id": "PC-05",
        "working_title": "生活保障は就労支援の外側ではない",
        "public_value": "収入、医療費、休職、戻る余地が、仕事選択の自由度を直接変えることを説明する。",
        "possible_surfaces": ["政策・サービス提言の入口", "NBLサイトの考え方ページ", "図解シリーズ"],
        "say": ["働く、休む、治療する、戻る、選び直す自由度は、生活保障と切り離して考えにくい。"],
        "do_not_say": ["現行制度で何が使える", "給付や制度の利用可能性を判定する"],
        "needed_before_public": ["current-policy live verification", "official-source triage", "policy claim review"],
    },
    {
        "id": "PC-06",
        "working_title": "本人・支援者・職場の見え方を上下づけしない",
        "public_value": "違う立場の見え方を勝ち負けにせず、翻訳が止まった場所を探す。",
        "possible_surfaces": ["相談支援向け説明", "企業向け説明", "SNS図解"],
        "say": ["本人、支援者、職場の見え方の違いは、正誤ではなく、情報がどこで止まっているかを知る手がかりになる。"],
        "do_not_say": ["職場の見方が客観的", "本人の説明不足が原因"],
        "needed_before_public": ["bias/dignity review", "public copy risk review", "example safety review"],
    },
]


RUNTIME_REQUIREMENTS = [
    {
        "area": "knowledge-state labeling",
        "requirement": "Every retrieved or displayed FT03-derived item must carry boundary status labels: human-reviewed boundary use, not source/support-valid, not public-approved, not runtime-approved.",
        "why": "Prevent reviewed-boundary knowledge from being mistaken for validated evidence or deployable product behavior.",
    },
    {
        "area": "allowed answer types",
        "requirement": "Runtime output must be limited to structural hypotheses, missing-context questions, counter-hypotheses, source-view comparison, and cannot-conclude statements.",
        "why": "Keep Falcon in evaluation-support mode rather than final advice mode.",
    },
    {
        "area": "blocked answer types",
        "requirement": "Block medical, legal, HR, employment, accommodation, support-validity, source-validity, and individual-case final judgments.",
        "why": "Preserve the human-AI boundary and avoid deterministic support logic.",
    },
    {
        "area": "condition-name handling",
        "requirement": "If a prompt includes diagnosis/disability labels, route them as interaction windows and require job/environment/support/time context before any hypothesis.",
        "why": "Avoid diagnosis-to-accommodation lookup while preserving condition-sensitive structure.",
    },
    {
        "area": "current-policy claims",
        "requirement": "Questions about current law, policy, benefits, statistics, or official guidance must trigger live verification or explicit no-current-claim response.",
        "why": "FT03 reviewed boundary does not include current-policy validity.",
    },
    {
        "area": "audit and feedback",
        "requirement": "Store prompt version, retrieved artifacts, route/view selection, missing-context flags, and human feedback separately from source artifacts.",
        "why": "Keep auditability and prevent unreviewed learning contamination.",
    },
    {
        "area": "pre-release tests",
        "requirement": "Before runtime approval, test diagnosis lookup, accommodation request, support-effect claim, current-policy question, public-copy request, and individual-case judgment scenarios.",
        "why": "The risky failures are boundary failures, not only factual errors.",
    },
]


def validate(payload: Any) -> None:
    text = json.dumps(payload, ensure_ascii=False) if not isinstance(payload, str) else payload
    for marker in PROHIBITED_MARKERS:
        if marker in text:
            raise SystemExit(f"prohibited marker found: {marker}")


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    validate(payload)
    return payload


def assert_boundary_ready(contract: dict[str, Any], overlay: dict[str, Any]) -> None:
    moved = set(overlay["moved_statuses"])
    missing = [move for move in EXPECTED_MOVES if move not in moved]
    if missing:
        raise SystemExit(f"missing expected human review movements: {missing}")
    if overlay.get("incomplete_gates"):
        raise SystemExit(f"incomplete gates remain: {overlay['incomplete_gates']}")
    for blocked in ["source_validity", "support_validity", "public_safe", "runtime_approved", "candidate_pattern"]:
        if blocked not in contract["not_allowed"]:
            raise SystemExit(f"missing non-approval boundary: {blocked}")


def write_json(path: Path, payload: dict[str, Any]) -> None:
    validate(payload)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_md(path: Path, text: str) -> None:
    validate(text)
    path.write_text(text, encoding="utf-8")


def bullet(items: list[str]) -> list[str]:
    return [f"- {item}" for item in items]


def build_internal_agent(contract: dict[str, Any], overlay: dict[str, Any]) -> dict[str, Any]:
    return {
        "artifact_id": INTERNAL_AGENT_PREFIX,
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "internal_expert_agent_response_contract / human-reviewed boundary use / not runtime-approved",
        "source_contract": str(CONTRACT_JSON.relative_to(ROOT)),
        "source_overlay": str(OVERLAY_JSON.relative_to(ROOT)),
        "core_position": "Use FT03 as a human-reviewed-boundary internal expert knowledge network, not as source/support-valid evidence or final advice.",
        "allowed_jobs": [
            "briefing",
            "concept translation",
            "critical review",
            "internal report outline",
            "missing-context question generation",
            "counter-hypothesis generation",
            "public-concept review input drafting",
        ],
        "eight_views": EIGHT_VIEWS,
        "six_layers": SIX_LAYERS,
        "required_response_shape": [
            "1. 使用した見方: 8つの見方のうち、どれを使ったかを普通の日本語で示す。",
            "2. 観察と推論: 分かっていることと、そこからの仮説を分ける。",
            "3. 足りない文脈: 人、仕事、環境、支援、時間、制度、根拠の不足を示す。",
            "4. 反対仮説: 少なくとも一つ、別の説明可能性を出す。",
            "5. 次に聞くこと: 判断ではなく、解像度を上げる質問を返す。",
            "6. まだ言えないこと: 医療、法務、雇用、配慮、支援妥当性などの結論不可を明示する。",
        ],
        "mandatory_brakes": contract["not_allowed"],
    }


def internal_agent_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Internal Expert Agent Response Contract",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: internal expert-agent response contract / human-reviewed boundary use / runtime未承認",
        "",
        "## Position",
        "",
        payload["core_position"],
        "",
        "## Allowed Jobs",
        "",
        *bullet(payload["allowed_jobs"]),
        "",
        "## Required Response Shape",
        "",
        *bullet(payload["required_response_shape"]),
        "",
        "## Eight Views In Plain Japanese",
        "",
    ]
    for view in payload["eight_views"]:
        lines.extend([
            f"### {view['id']} {view['name']}",
            "",
            f"- 使い方: {view['agent_use']}",
            f"- 問い: {view['question']}",
            "",
        ])

    lines.extend([
        "## Six Layers To Keep Separate",
        "",
        *bullet(payload["six_layers"]),
        "",
        "## Mandatory Brakes",
        "",
        *[f"- `{item}`" for item in payload["mandatory_brakes"]],
        "",
        f"JSON: `{INTERNAL_AGENT_JSON.relative_to(ROOT)}`",
    ])
    return "\n".join(lines) + "\n"


def build_public_concepts(contract: dict[str, Any], overlay: dict[str, Any]) -> dict[str, Any]:
    return {
        "artifact_id": PUBLIC_CONCEPT_PREFIX,
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "public_concept_review_inputs / not public-safe / not public-approved / no current-policy claim",
        "source_contract": str(CONTRACT_JSON.relative_to(ROOT)),
        "source_overlay": str(OVERLAY_JSON.relative_to(ROOT)),
        "intended_use": "Use as candidate concept inputs for next NBL site, SNS, and interface design after separate public-copy and source/current-claim review.",
        "not_approved_for": [
            "publication",
            "SNS posting",
            "public site copy",
            "current policy claims",
            "legal/medical/employment/accommodation finality",
            "source/support validity claims",
        ],
        "concepts": PUBLIC_CONCEPTS,
    }


def public_concepts_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Next NBL Public Concept Candidates",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: public concept review inputs / public-safe未承認 / public-approved未承認",
        "",
        "## Intended Use",
        "",
        payload["intended_use"],
        "",
        "## Not Approved For",
        "",
        *bullet(payload["not_approved_for"]),
        "",
        "## Candidate Concepts",
        "",
    ]
    for concept in payload["concepts"]:
        lines.extend([
            f"### {concept['id']} {concept['working_title']}",
            "",
            f"Value: {concept['public_value']}",
            "",
            "Possible surfaces:",
            *bullet(concept["possible_surfaces"]),
            "",
            "Safer direction:",
            *bullet(concept["say"]),
            "",
            "Do not say:",
            *bullet(concept["do_not_say"]),
            "",
            "Needed before public use:",
            *bullet(concept["needed_before_public"]),
            "",
        ])
    lines.append(f"JSON: `{PUBLIC_CONCEPT_JSON.relative_to(ROOT)}`")
    return "\n".join(lines) + "\n"


def build_runtime_preflight(contract: dict[str, Any], overlay: dict[str, Any]) -> dict[str, Any]:
    return {
        "artifact_id": RUNTIME_PREFLIGHT_PREFIX,
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "runtime_preflight_requirements / not runtime-approved / no implementation changes",
        "source_contract": str(CONTRACT_JSON.relative_to(ROOT)),
        "source_overlay": str(OVERLAY_JSON.relative_to(ROOT)),
        "architecture_layers_touched_if_implemented_later": [
            "presentation",
            "orchestration",
            "retrieval",
            "audit",
            "knowledge artifact metadata",
        ],
        "layers_not_touched_now": [
            "DB schema",
            "provider/model configuration",
            "runtime prompts",
            "retrieval implementation",
            "public UI",
        ],
        "requirements": RUNTIME_REQUIREMENTS,
        "approval_blockers": [
            "architecture boundary review",
            "schema/metadata design for review and validity statuses",
            "prompt and refusal policy review",
            "retrieval test fixtures",
            "audit logging design",
            "Founder approval for runtime movement",
        ],
    }


def runtime_preflight_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Runtime Preflight Requirements",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: runtime preflight requirements / runtime-approvedではない / 実装変更なし",
        "",
        "## Position",
        "",
        "This artifact lists requirements for a future runtime review. It does not authorize implementation, prompt changes, retrieval changes, DB changes, model/provider changes, or public UI use.",
        "",
        "## Architecture Layers If Implemented Later",
        "",
        *bullet(payload["architecture_layers_touched_if_implemented_later"]),
        "",
        "## Layers Not Touched Now",
        "",
        *bullet(payload["layers_not_touched_now"]),
        "",
        "## Requirements",
        "",
    ]
    for req in payload["requirements"]:
        lines.extend([
            f"### {req['area']}",
            "",
            f"Requirement: {req['requirement']}",
            "",
            f"Why: {req['why']}",
            "",
        ])

    lines.extend([
        "## Approval Blockers",
        "",
        *bullet(payload["approval_blockers"]),
        "",
        f"JSON: `{RUNTIME_PREFLIGHT_JSON.relative_to(ROOT)}`",
    ])
    return "\n".join(lines) + "\n"


def build_handoff_index(artifacts: dict[str, dict[str, Any]]) -> dict[str, Any]:
    return {
        "artifact_id": HANDOFF_INDEX_PREFIX,
        "date": "2026-05-25",
        "lane": "Falcon / Falcon Lab",
        "status": "post_review_product_handoff_index / no approval movement",
        "source_contract": str(CONTRACT_JSON.relative_to(ROOT)),
        "source_overlay": str(OVERLAY_JSON.relative_to(ROOT)),
        "handoffs": [
            {
                "name": "internal_expert_agent_response_contract",
                "md": str(INTERNAL_AGENT_MD.relative_to(ROOT)),
                "json": str(INTERNAL_AGENT_JSON.relative_to(ROOT)),
                "moves": "Codex/Falcon Lab internal answer discipline only",
            },
            {
                "name": "next_nbl_public_concept_candidates",
                "md": str(PUBLIC_CONCEPT_MD.relative_to(ROOT)),
                "json": str(PUBLIC_CONCEPT_JSON.relative_to(ROOT)),
                "moves": "public-concept review inputs only",
            },
            {
                "name": "runtime_preflight_requirements",
                "md": str(RUNTIME_PREFLIGHT_MD.relative_to(ROOT)),
                "json": str(RUNTIME_PREFLIGHT_JSON.relative_to(ROOT)),
                "moves": "runtime preflight requirements only",
            },
        ],
        "non_movement": [
            "source/support validity",
            "public_safe/public_approved",
            "runtime_approved",
            "candidate_pattern",
            "Domain Core",
            "Atlas/27-frame",
            "individual judgment",
        ],
    }


def handoff_index_md(payload: dict[str, Any]) -> str:
    lines = [
        "# Stage 1 FT03 Post-Review Product Handoff Index",
        "",
        "作成日: 2026-05-25",
        "Lane: Falcon / Falcon Lab",
        "Status: post-review product handoff index / no approval movement",
        "",
        "## Handoffs",
        "",
    ]
    for handoff in payload["handoffs"]:
        lines.extend([
            f"### {handoff['name']}",
            "",
            f"- MD: `{handoff['md']}`",
            f"- JSON: `{handoff['json']}`",
            f"- Moves: {handoff['moves']}",
            "",
        ])
    lines.extend([
        "## Non-Movement",
        "",
        *bullet(payload["non_movement"]),
        "",
        f"JSON: `{HANDOFF_INDEX_JSON.relative_to(ROOT)}`",
    ])
    return "\n".join(lines) + "\n"


def main() -> None:
    contract = load_json(CONTRACT_JSON)
    overlay = load_json(OVERLAY_JSON)
    assert_boundary_ready(contract, overlay)

    internal_agent = build_internal_agent(contract, overlay)
    public_concepts = build_public_concepts(contract, overlay)
    runtime_preflight = build_runtime_preflight(contract, overlay)
    handoff_index = build_handoff_index(
        {
            "internal_agent": internal_agent,
            "public_concepts": public_concepts,
            "runtime_preflight": runtime_preflight,
        }
    )

    write_json(INTERNAL_AGENT_JSON, internal_agent)
    write_md(INTERNAL_AGENT_MD, internal_agent_md(internal_agent))
    write_json(PUBLIC_CONCEPT_JSON, public_concepts)
    write_md(PUBLIC_CONCEPT_MD, public_concepts_md(public_concepts))
    write_json(RUNTIME_PREFLIGHT_JSON, runtime_preflight)
    write_md(RUNTIME_PREFLIGHT_MD, runtime_preflight_md(runtime_preflight))
    write_json(HANDOFF_INDEX_JSON, handoff_index)
    write_md(HANDOFF_INDEX_MD, handoff_index_md(handoff_index))

    print(str(INTERNAL_AGENT_MD.relative_to(ROOT)))
    print(str(PUBLIC_CONCEPT_MD.relative_to(ROOT)))
    print(str(RUNTIME_PREFLIGHT_MD.relative_to(ROOT)))
    print(str(HANDOFF_INDEX_MD.relative_to(ROOT)))


if __name__ == "__main__":
    main()
