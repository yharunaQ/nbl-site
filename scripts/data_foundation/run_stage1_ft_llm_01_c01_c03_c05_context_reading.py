#!/usr/bin/env python3
"""Prepare FT-LLM-01 redacted+structured context-reading queues.

Default mode only builds a no-text queue. The intended Falcon path is to read
that queue in a Codex high-reasoning session and write no-text structural
results. The optional --execute path remains available for an API-backed run
when OPENAI_API_KEY is present. Prompts and source text are never written to
disk.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
RUN_ID = "stage1-production-ft-llm-01-c01-c03-c05-v0-2026-05-23"

BRANCH_ASSIGNMENTS = RUN_DIR / "stage1-production-branch-assignments-v0-2026-05-18.json"
COVERAGE_AUDIT = RUN_DIR / "stage1-production-free-text-llm-context-coverage-audit-v0-2026-05-23.json"

QUEUE_JSON = RUN_DIR / f"{RUN_ID}-queue.json"
QUEUE_MD = RUN_DIR / f"{RUN_ID}-queue.md"
RESULTS_JSONL = RUN_DIR / f"{RUN_ID}-results.jsonl"
SUMMARY_JSON = RUN_DIR / f"{RUN_ID}-summary.json"
SUMMARY_MD = RUN_DIR / f"{RUN_ID}-summary.md"

REDACTED_SURFACES = {
    "employment_survey_3000": ROOT / "data/staging/anonymized/employment_survey_3000/v0/free_text_units.redacted.jsonl",
    "nanbyo_survey_4000": ROOT / "data/staging/anonymized/nanbyo_survey_4000/v0/free_text_units.redacted.jsonl",
}

STRUCTURED_SURFACES = {
    "employment_survey_3000": ROOT / "data/analysis_ready/respondents/employment_survey_3000/v0/structured_features.csv",
    "nanbyo_survey_4000": ROOT / "data/analysis_ready/respondents/nanbyo_survey_4000/v0/structured_features.csv",
}

TARGET_ROUTES = {
    "C01-health-time": {
        "branch_prefixes": ["P1-C01"],
        "prompt_focus": (
            "健康時間、勤務時間、仕事量、体調変動、休み方、生活保障、継続/休職/復職/再就職の順序が、"
            "単独の健康問題ではなく仕事設計と選択自由度としてどう結びつくかを読む。"
        ),
    },
    "C03-support-continuity": {
        "branch_prefixes": ["P1-C03"],
        "prompt_focus": (
            "相談・支援・医療・職場・制度が、存在の有無ではなく、本人条件と仕事条件を継続的に再翻訳する"
            "機能として働いているか、または途切れているかを読む。"
        ),
    },
    "C05-worksite-contact": {
        "branch_prefixes": ["P1-C05"],
        "prompt_focus": (
            "移動、姿勢、設備、作業場所、情報、手順、支援機器、休憩場所などを、障害名別の配慮ではなく、"
            "仕事が実行され評価される接触点の設計として読む。"
        ),
    },
}

ALLOWED_ENUMS = {
    "relation_closure": {"closed", "partial", "not_closed", "boundary"},
    "next_use": {
        "advance_to_pattern_candidate_queue",
        "keep_as_boundary_case",
        "keep_as_counter_case",
        "needs_more_context",
        "do_not_use_for_route_strengthening",
    },
}


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_local_id(value: str) -> str:
    digits = "".join(re.findall(r"\d+", str(value or "")))
    if not digits:
        return "0"
    return str(int(digits))


def split_record_id(record_id: str) -> tuple[str, str]:
    dataset_id, local = record_id.split(":", 1)
    return dataset_id, normalize_local_id(local)


def record_id_for(dataset_id: str, respondent_id: str) -> str:
    return f"{dataset_id}:{int(normalize_local_id(respondent_id)):05d}"


def route_branch_ids(route_id: str) -> list[str]:
    prefixes = TARGET_ROUTES[route_id]["branch_prefixes"]
    data = load_json(BRANCH_ASSIGNMENTS)
    ids = []
    for branch in data["branch_summaries"]:
        branch_id = branch["branch_id"]
        if any(branch_id.startswith(prefix) for prefix in prefixes):
            ids.append(branch_id)
    return sorted(ids)


def redacted_unit_counts() -> dict[str, dict[str, int]]:
    out: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for dataset_id, path in REDACTED_SURFACES.items():
        with path.open("r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                row = json.loads(line)
                rid = record_id_for(dataset_id, str(row.get("respondent_id", "0")))
                out[dataset_id][rid] += 1
    return {dataset: dict(counts) for dataset, counts in out.items()}


def structured_row_counts() -> dict[str, dict[str, int]]:
    out: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for dataset_id, path in STRUCTURED_SURFACES.items():
        with path.open("r", encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                rid = record_id_for(dataset_id, str(row.get("respondent_id", "0")))
                out[dataset_id][rid] += 1
    return {dataset: dict(counts) for dataset, counts in out.items()}


def choose_records(per_route_dataset_limit: int) -> list[dict[str, Any]]:
    data = load_json(BRANCH_ASSIGNMENTS)
    red_counts = redacted_unit_counts()
    struct_counts = structured_row_counts()

    route_to_branches = {route: set(route_branch_ids(route)) for route in TARGET_ROUTES}
    queue: list[dict[str, Any]] = []
    seen_route_record: set[tuple[str, str]] = set()

    for route_id, branch_ids in route_to_branches.items():
        candidates = []
        for assignment in data["assignments"]:
            record_id = assignment["record_id"]
            dataset_id, _ = split_record_id(record_id)
            if dataset_id not in REDACTED_SURFACES:
                continue
            candidate = sorted(set(assignment.get("candidate_branches", [])) & branch_ids)
            boundary = sorted(set(assignment.get("boundary_tags", [])) & branch_ids)
            if not candidate and not boundary:
                continue
            role = "representative" if candidate else "boundary"
            if candidate and boundary:
                role = "representative_with_boundary"
            candidates.append(
                {
                    "record_id": record_id,
                    "dataset_id": dataset_id,
                    "route_id": route_id,
                    "selection_role": role,
                    "candidate_branch_ids": candidate,
                    "boundary_branch_ids": boundary,
                    "candidate_branch_count": len(candidate),
                    "boundary_branch_count": len(boundary),
                    "total_branch_count": len(assignment.get("candidate_branches", [])) + len(assignment.get("boundary_tags", [])),
                    "redacted_unit_count": red_counts.get(dataset_id, {}).get(record_id, 0),
                    "structured_row_count": struct_counts.get(dataset_id, {}).get(record_id, 0),
                }
            )

        for dataset_id in sorted(REDACTED_SURFACES):
            dataset_candidates = [c for c in candidates if c["dataset_id"] == dataset_id and c["redacted_unit_count"] > 0]
            representatives = [c for c in dataset_candidates if c["selection_role"] != "boundary"]
            boundaries = [c for c in dataset_candidates if c["selection_role"] == "boundary"]
            representatives.sort(
                key=lambda c: (
                    -c["candidate_branch_count"],
                    -c["boundary_branch_count"],
                    -c["redacted_unit_count"],
                    c["record_id"],
                )
            )
            boundaries.sort(
                key=lambda c: (
                    -c["boundary_branch_count"],
                    -c["redacted_unit_count"],
                    c["record_id"],
                )
            )
            picked = representatives[: max(2, per_route_dataset_limit - 1)]
            if boundaries:
                picked.append(boundaries[0])
            for item in picked[:per_route_dataset_limit]:
                key = (route_id, item["record_id"])
                if key in seen_route_record:
                    continue
                seen_route_record.add(key)
                item["reading_surface"] = "redacted_narrative_internal_plus_structured_selected_response_internal"
                item["source_text_exported"] = False
                item["redacted_text_exported"] = False
                item["field_value_exported"] = False
                item["allowed_next_use"] = [
                    "LLM context-branch reading",
                    "representative/boundary/counter classification",
                    "no-text pattern candidate queueing",
                ]
                item["not_allowed"] = [
                    "raw/redacted text export",
                    "field value export",
                    "source/support validity judgment",
                    "medical/legal/employment/accommodation finality",
                    "knowledge promotion",
                ]
                queue.append(item)
    return queue


def load_redacted_text(record_id: str) -> str:
    dataset_id, local_id = split_record_id(record_id)
    parts = []
    with REDACTED_SURFACES[dataset_id].open("r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            row = json.loads(line)
            if normalize_local_id(str(row.get("respondent_id", "0"))) == local_id:
                text = str(row.get("redacted_unit_text") or "").strip()
                if text:
                    parts.append(text)
    return "\n".join(parts)


def load_structured_context(record_id: str, max_rows: int = 80) -> list[str]:
    dataset_id, local_id = split_record_id(record_id)
    rows = []
    with STRUCTURED_SURFACES[dataset_id].open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            if normalize_local_id(str(row.get("respondent_id", "0"))) != local_id:
                continue
            group = (row.get("question_group") or "").strip()
            display = (row.get("display_name") or row.get("raw_name") or "").strip()
            label = (row.get("label_text") or row.get("raw_value_text") or row.get("normalized_value") or "").strip()
            if not display or not label:
                continue
            rows.append(f"- {group} / {display}: {label}")
            if len(rows) >= max_rows:
                break
    return rows


def build_messages(queue_item: dict[str, Any]) -> list[dict[str, str]]:
    redacted_text = load_redacted_text(queue_item["record_id"])
    structured = "\n".join(load_structured_context(queue_item["record_id"]))
    route_id = queue_item["route_id"]
    focus = TARGET_ROUTES[route_id]["prompt_focus"]
    system = (
        "あなたはFalconのSCIMA/FCHMA文脈読解担当です。"
        "病名・障害名から配慮や就労困難性を直接推定せず、ICF上の相互作用、仕事設計、環境、支援、制度、"
        "健康時間、開示境界、評価、生活保障の関係を読みます。"
        "入力にはredacted自由記述と構造化回答が含まれますが、出力には原文・伏字段落・field値・短い引用・キーフレーズを一切含めません。"
        "医療、法律、雇用、配慮妥当性、支援妥当性、就労可否の最終判断をしてはいけません。"
        "JSONのみを出力してください。"
    )
    user = {
        "route_id": route_id,
        "record_id": queue_item["record_id"],
        "selection_role": queue_item["selection_role"],
        "route_focus": focus,
        "structured_selected_response_context": structured,
        "redacted_narrative_context": redacted_text,
        "output_schema": {
            "context_branch": "short route-specific branch name without source text",
            "primary_axis": route_id,
            "relation_closure": "closed|partial|not_closed|boundary",
            "interaction_reading": "no quote; <=90 Japanese chars",
            "counter_reading": "no quote; <=90 Japanese chars",
            "condition_window_use": "no quote; <=90 Japanese chars",
            "missing_context": ["no quote"],
            "overinterpretation_risks": ["no quote"],
            "next_use": "advance_to_pattern_candidate_queue|keep_as_boundary_case|keep_as_counter_case|needs_more_context|do_not_use_for_route_strengthening",
        },
    }
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": json.dumps(user, ensure_ascii=False)},
    ]


def call_openai(messages: list[dict[str, str]], model: str) -> dict[str, Any]:
    try:
        from openai import OpenAI  # type: ignore
    except Exception as exc:  # pragma: no cover - depends on local env
        raise RuntimeError("openai package is not installed") from exc
    client = OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
        max_tokens=700,
    )
    content = response.choices[0].message.content or "{}"
    if content.strip().startswith("```"):
        content = content.strip().strip("`")
        if content.startswith("json"):
            content = content[4:]
    return json.loads(content)


def sanitize_result(queue_item: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    def as_short_text(value: Any, limit: int = 120) -> str:
        text = str(value or "").replace("\n", " ").strip()
        for mark in ["「", "」", "\"", "'", "【", "】"]:
            text = text.replace(mark, "")
        return text[:limit]

    def as_list(value: Any) -> list[str]:
        if not isinstance(value, list):
            return []
        return [as_short_text(item, 90) for item in value[:6]]

    relation = str(result.get("relation_closure") or "boundary")
    if relation not in ALLOWED_ENUMS["relation_closure"]:
        relation = "boundary"
    next_use = str(result.get("next_use") or "needs_more_context")
    if next_use not in ALLOWED_ENUMS["next_use"]:
        next_use = "needs_more_context"
    return {
        "record_id": queue_item["record_id"],
        "dataset_id": queue_item["dataset_id"],
        "route_id": queue_item["route_id"],
        "selection_role": queue_item["selection_role"],
        "reading_surface": queue_item["reading_surface"],
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_received_redacted_text": True,
        "llm_received_structured_selected_response": True,
        "context_branch": as_short_text(result.get("context_branch"), 80),
        "primary_axis": queue_item["route_id"],
        "relation_closure": relation,
        "interaction_reading": as_short_text(result.get("interaction_reading"), 100),
        "counter_reading": as_short_text(result.get("counter_reading"), 100),
        "condition_window_use": as_short_text(result.get("condition_window_use"), 100),
        "missing_context": as_list(result.get("missing_context")),
        "overinterpretation_risks": as_list(result.get("overinterpretation_risks")),
        "next_use": next_use,
        "not_allowed": queue_item["not_allowed"],
    }


def write_queue(queue: list[dict[str, Any]]) -> None:
    summary = {
        "artifact_id": f"{RUN_ID}-queue",
        "lane": "Falcon / Falcon Lab",
        "status": "ft_llm_01_queue_no_text_export_no_promotion",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_executed": False,
        "source_artifacts": [rel(BRANCH_ASSIGNMENTS), rel(COVERAGE_AUDIT)],
        "target_routes": list(TARGET_ROUTES),
        "queue_count": len(queue),
        "route_counts": dict(Counter(item["route_id"] for item in queue)),
        "dataset_counts": dict(Counter(item["dataset_id"] for item in queue)),
        "selection_role_counts": dict(Counter(item["selection_role"] for item in queue)),
        "queue": queue,
    }
    QUEUE_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Stage 1 FT-LLM-01 C01/C03/C05 Queue",
        "",
        "日付: 2026-05-23",
        "状態: LLM context-reading queue / 本文引用なし / 昇格なし / 公開不可 / runtime未承認",
        "",
        "このqueueは、回答者調査2本のredacted自由記述 + structured selected-responseを、SCIMA/FCHMA文脈枝読解へ渡すための最初の実行束である。",
        "この成果物自体はLLM読解結果ではない。実行は、Codex高推論セッションでqueueを読みno-text構造結果を書く方法を標準とする。",
        "APIキーがある環境では同じscriptを `--execute` して、promptを保存せずno-text構造結果を書く任意経路も使える。",
        "",
        "## Counts",
        "",
        f"- queue records: {len(queue)}",
        f"- route counts: {dict(Counter(item['route_id'] for item in queue))}",
        f"- dataset counts: {dict(Counter(item['dataset_id'] for item in queue))}",
        "",
        "## Boundary",
        "",
        "- raw/redacted本文、field値、key phrasesは出力しない。",
        "- source/support validity、review status、promotion、public/runtime statusは動かさない。",
        "- C01/C03/C05は病名・障害名から配慮を引く経路ではなく、健康時間・支援再翻訳・仕事接触点の相互作用として読む。",
        "",
        f"JSON: `{rel(QUEUE_JSON)}`",
    ]
    QUEUE_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_summary(results: list[dict[str, Any]], *, model: str, executed: bool, error: str | None = None) -> None:
    summary = {
        "artifact_id": f"{RUN_ID}-summary",
        "lane": "Falcon / Falcon Lab",
        "status": "ft_llm_01_results_no_text_export_no_promotion" if executed else "ft_llm_01_not_executed",
        "review_status": "unreviewed",
        "promotion_status": "none",
        "public_status": "not_public",
        "runtime_status": "not_runtime_approved",
        "source_text_exported": False,
        "redacted_text_exported": False,
        "field_value_exported": False,
        "llm_executed": executed,
        "model": model if executed else None,
        "error": error,
        "result_count": len(results),
        "route_counts": dict(Counter(item["route_id"] for item in results)),
        "dataset_counts": dict(Counter(item["dataset_id"] for item in results)),
        "relation_closure_counts": dict(Counter(item.get("relation_closure") for item in results)),
        "next_use_counts": dict(Counter(item.get("next_use") for item in results)),
        "result_jsonl": rel(RESULTS_JSONL),
    }
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Stage 1 FT-LLM-01 C01/C03/C05 Summary",
        "",
        "日付: 2026-05-23",
        f"状態: {summary['status']}",
        "",
        f"- llm_executed: {executed}",
        f"- result_count: {len(results)}",
        f"- route_counts: {summary['route_counts']}",
        f"- relation_closure_counts: {summary['relation_closure_counts']}",
        f"- next_use_counts: {summary['next_use_counts']}",
        f"- source_text_exported: {summary['source_text_exported']}",
        f"- redacted_text_exported: {summary['redacted_text_exported']}",
        f"- field_value_exported: {summary['field_value_exported']}",
    ]
    if error:
        lines.append(f"- execution_error: {error}")
    lines.extend(["", f"JSON: `{rel(SUMMARY_JSON)}`", f"JSONL: `{rel(RESULTS_JSONL)}`"])
    SUMMARY_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def execute_queue(queue: list[dict[str, Any]], *, limit: int, model: str, delay: float) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    targets = queue[:limit] if limit else queue
    with RESULTS_JSONL.open("w", encoding="utf-8") as f:
        for item in targets:
            result = call_openai(build_messages(item), model)
            clean = sanitize_result(item, result)
            f.write(json.dumps(clean, ensure_ascii=False) + "\n")
            f.flush()
            results.append(clean)
            if delay:
                time.sleep(delay)
    return results


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--per-route-dataset-limit", type=int, default=4)
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--model", default=os.environ.get("NARRATIVE_MODEL", "gpt-4o-mini"))
    parser.add_argument("--delay", type=float, default=0.2)
    args = parser.parse_args()

    RUN_DIR.mkdir(parents=True, exist_ok=True)
    queue = choose_records(args.per_route_dataset_limit)
    write_queue(queue)

    if not args.execute:
        print(json.dumps({"queue": rel(QUEUE_JSON), "count": len(queue), "llm_executed": False}, ensure_ascii=False, indent=2))
        return

    if not os.environ.get("OPENAI_API_KEY"):
        error = "OPENAI_API_KEY is not set; queue prepared but LLM execution skipped"
        RESULTS_JSONL.write_text("", encoding="utf-8")
        write_summary([], model=args.model, executed=False, error=error)
        print(json.dumps({"queue": rel(QUEUE_JSON), "summary": rel(SUMMARY_JSON), "error": error}, ensure_ascii=False, indent=2))
        return

    results = execute_queue(queue, limit=args.limit, model=args.model, delay=args.delay)
    write_summary(results, model=args.model, executed=True)
    print(json.dumps({"queue": rel(QUEUE_JSON), "summary": rel(SUMMARY_JSON), "results": rel(RESULTS_JSONL), "count": len(results)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
