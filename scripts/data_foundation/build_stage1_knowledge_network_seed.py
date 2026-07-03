#!/usr/bin/env python3
"""Build a Stage 1 Falcon Lab knowledge-network seed from context branches."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
BASE_DIR = ROOT / "references/derived/scima-fchma/stage1-context-reading-v0-2026-05-14"
ASSIGNMENT_JSON = BASE_DIR / "stage1-context-branch-assignment-v0-2026-05-14.json"
ROOT_EVIDENCE_JSON = BASE_DIR / "stage1-production-branch-evidence-v0-2026-05-14.json"
OUT_JSON = BASE_DIR / "stage1-falcon-lab-knowledge-network-seed-v0-2026-05-14.json"
OUT_MD = BASE_DIR / "stage1-falcon-lab-knowledge-network-seed-v0-2026-05-14.md"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def connected_documents_by_root(root_evidence: dict[str, Any]) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for row in root_evidence["branch_results"]:
        out[row["branch_id"]] = row.get("connected_document_ids", [])
    return out


def build_seed() -> dict[str, Any]:
    assignment = load_json(ASSIGNMENT_JSON)
    root_evidence = load_json(ROOT_EVIDENCE_JSON)
    docs_by_root = connected_documents_by_root(root_evidence)
    objects = []
    for row in assignment["branch_assignments"]:
        objects.append({
            "knowledge_seed_id": f"stage1:{row['context_branch_id']}",
            "context_branch_id": row["context_branch_id"],
            "root_branch_id": row["root_branch_id"],
            "title": row["title"],
            "status": "machine_generated_unreviewed_no_promotion",
            "review_status": "not_reviewed",
            "runtime_status": "not_approved",
            "public_status": "not_public",
            "assignment_count": row["assignment_count"],
            "source_family_counts": row["source_family_counts"],
            "candidate_interaction": row["candidate_interaction"],
            "counter_interaction": row["counter_interaction"],
            "representative_ids": row["representative_ids"][:8],
            "boundary_ids": row["boundary_ids"][:8],
            "contrast_ids": row["contrast_ids"][:8],
            "connected_document_ids": docs_by_root.get(row["root_branch_id"], [])[:10],
            "raw_or_redacted_text_included": False,
            "use_in_codex": "Use as an unreviewed context-branch index for analysis and critique, not as a final answer source.",
        })
    return {
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "source_record_count": assignment["source_record_count"],
        "context_branch_count": len(objects),
        "knowledge_seeds": objects,
    }


def write_markdown(seed: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Falcon Lab 知識ネットワークseed v0",
        "",
        "日付: 2026-05-14",
        "状態: 機械生成・未レビュー・昇格なし",
        "本文引用: なし",
        "",
        "これは第一段階前半の成果として、調査データ、支援者記述、職場調査、workshop、NIVR/web-cache接続を、SCIMA/FCHMAの文脈枝としてCodex上で使えるようにした未レビューseedである。病名・障害種類の一覧ではなく、ICF上の相互作用を主語にしている。",
        "",
        f"入力ID数: {seed['source_record_count']}",
        f"文脈枝数: {seed['context_branch_count']}",
        "",
        "## 一覧",
        "",
        "| seed | 文脈枝 | 割当ID数 | 代表ID | 接続資料 |",
        "|---|---|---:|---|---:|",
    ]
    for item in seed["knowledge_seeds"]:
        reps = ", ".join(f"`{rid}`" for rid in item["representative_ids"][:3]) or "なし"
        lines.append(
            f"| `{item['knowledge_seed_id']}` | {item['title']} | {item['assignment_count']} | {reps} | {len(item['connected_document_ids'])} |"
        )

    lines.extend(["", "## seed別", ""])
    for item in seed["knowledge_seeds"]:
        lines.extend([
            f"### {item['knowledge_seed_id']} {item['title']}",
            "",
            f"割当ID数: {item['assignment_count']}",
            f"候補相互作用: {item['candidate_interaction']}",
            f"反対相互作用: {item['counter_interaction']}",
            f"代表ID: {', '.join(f'`{rid}`' for rid in item['representative_ids']) or 'なし'}",
            f"境界ID: {', '.join(f'`{rid}`' for rid in item['boundary_ids']) or 'なし'}",
            f"対照ID: {', '.join(f'`{rid}`' for rid in item['contrast_ids']) or 'なし'}",
            f"接続資料ID: {', '.join(f'`{rid}`' for rid in item['connected_document_ids']) or 'なし'}",
            "",
        ])

    lines.extend([
        "## 使用境界",
        "",
        "- Codex上では、未レビューの分析・批判・追加探索の索引として使う。",
        "- 人間レビュー済み知識、公開用知識、runtime承認済み知識としては使わない。",
        "- 医学的妥当性、法的評価、雇用管理の適否、合理的配慮充足、就労可否は判断しない。",
    ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    seed = build_seed()
    OUT_JSON.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(seed)
    print(json.dumps({
        "markdown": str(OUT_MD.relative_to(ROOT)),
        "json": str(OUT_JSON.relative_to(ROOT)),
        "context_branch_count": seed["context_branch_count"],
        "source_record_count": seed["source_record_count"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
