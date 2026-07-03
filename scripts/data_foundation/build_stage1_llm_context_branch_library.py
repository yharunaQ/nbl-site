#!/usr/bin/env python3
"""Consolidate Stage 1 LLM context readings into a branch library."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
BASE_DIR = ROOT / "references/derived/scima-fchma/stage1-context-reading-v0-2026-05-14"
BATCH_FILES = [
    BASE_DIR / "stage1-llm-context-branch-reading-batch1-v0-2026-05-14.md",
    BASE_DIR / "stage1-llm-context-branch-reading-batch2-v0-2026-05-14.md",
]
OUT_MD = BASE_DIR / "stage1-llm-context-branch-library-v0-2026-05-14.md"
OUT_JSON = BASE_DIR / "stage1-llm-context-branch-library-v0-2026-05-14.json"


FIELD_PATTERNS = {
    "representative_ids": re.compile(r"^代表ID: (.+)$", re.MULTILINE),
    "boundary_ids": re.compile(r"^境界ID: (.+)$", re.MULTILINE),
    "contrast_ids": re.compile(r"^対照ID: (.+)$", re.MULTILINE),
    "candidate_interaction": re.compile(r"^候補命題: (.+)$", re.MULTILINE),
    "counter_interaction": re.compile(r"^反対命題: (.+)$", re.MULTILINE),
    "reading_note": re.compile(r"^読解メモ: (.+)$", re.MULTILINE),
}


def parse_ids(value: str) -> list[str]:
    return re.findall(r"`([^`]+)`", value)


def parse_batch(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8")
    matches = list(re.finditer(r"^### (S-\d{2}[A-Z]) (.+)$", text, re.MULTILINE))
    branches: list[dict[str, Any]] = []
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[start:end]
        context_branch_id = match.group(1)
        branch_root = context_branch_id[:4]
        record: dict[str, Any] = {
            "context_branch_id": context_branch_id,
            "root_branch_id": branch_root,
            "title": match.group(2).strip(),
            "source_file": str(path.relative_to(ROOT)),
            "status": "machine_generated_unreviewed_no_promotion",
            "raw_or_redacted_text_included": False,
        }
        for field, pattern in FIELD_PATTERNS.items():
            field_match = pattern.search(block)
            if not field_match:
                record[field] = [] if field.endswith("_ids") else ""
                continue
            value = field_match.group(1).strip()
            record[field] = parse_ids(value) if field.endswith("_ids") else value
        branches.append(record)
    return branches


def write_markdown(branches: list[dict[str, Any]]) -> None:
    lines = [
        "# Stage 1 SCIMA/FCHMA LLM文脈枝ライブラリ v0",
        "",
        "日付: 2026-05-14",
        "状態: 機械生成・未レビュー・昇格なし",
        "本文引用: なし",
        "",
        "これは第一段階のLLM文脈読解で割れた文脈枝を、Founder/Proが一枚で見られるように統合したもの。調査データ、支援者記述、職場調査、workshop、NIVR/web-cache接続を、病名・障害種類ではなくICF上の相互作用として読むための作業ライブラリである。",
        "",
        "## 全体表",
        "",
        "| 文脈枝 | 元枝 | 名称 | 代表ID | 境界ID | 対照ID |",
        "|---|---|---|---:|---:|---:|",
    ]
    for branch in branches:
        lines.append(
            f"| {branch['context_branch_id']} | {branch['root_branch_id']} | {branch['title']} | "
            f"{len(branch['representative_ids'])} | {len(branch['boundary_ids'])} | {len(branch['contrast_ids'])} |"
        )
    lines.extend(["", "## 枝別カード", ""])
    current_root = None
    for branch in branches:
        if branch["root_branch_id"] != current_root:
            current_root = branch["root_branch_id"]
            lines.extend([f"## {current_root}", ""])
        lines.extend([
            f"### {branch['context_branch_id']} {branch['title']}",
            "",
            f"候補命題: {branch['candidate_interaction']}",
            "",
            f"反対命題: {branch['counter_interaction']}",
            "",
            f"代表ID: {', '.join(f'`{item}`' for item in branch['representative_ids']) or 'なし'}",
            f"境界ID: {', '.join(f'`{item}`' for item in branch['boundary_ids']) or 'なし'}",
            f"対照ID: {', '.join(f'`{item}`' for item in branch['contrast_ids']) or 'なし'}",
        ])
        if branch["reading_note"]:
            lines.extend(["", f"読解メモ: {branch['reading_note']}"])
        lines.append("")
    lines.extend([
        "## 使い方",
        "",
        "- この文脈枝は、レビュー済み知識ではなく、次の全件探索と人間レビュー候補化の作業単位。",
        "- 1つの枝に病名・障害種類を直接結びつけず、心身機能、活動、参加、仕事設計、職場環境、支援接続、制度、生活時間の関係として読む。",
        "- 代表ID、境界ID、対照IDを開いて、枝の維持・分割・合流・棄却を判断する。",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    branches: list[dict[str, Any]] = []
    for path in BATCH_FILES:
        branches.extend(parse_batch(path))
    branches.sort(key=lambda item: item["context_branch_id"])
    OUT_JSON.write_text(json.dumps({
        "status": "machine_generated_unreviewed_no_promotion",
        "raw_or_redacted_text_included": False,
        "context_branch_count": len(branches),
        "context_branches": branches,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(branches)
    print(json.dumps({
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "context_branch_count": len(branches),
        "root_counts": {
            root: sum(1 for branch in branches if branch["root_branch_id"] == root)
            for root in sorted({branch["root_branch_id"] for branch in branches})
        },
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
