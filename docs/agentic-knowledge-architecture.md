# Agentic Knowledge Architecture

## Goal

Scale knowledge ingestion and retrieval for:
- local research data (`references/`)
- future external websites
- guideline/policy documents

## Design

1. Source registry
- Canonical source metadata lives in `config/knowledge-sources.json`.
- Each source has: kind, trust level, refresh policy, location, enabled flag.

2. Planner-first retrieval
- Endpoint `POST /api/knowledge/plan` returns an execution plan.
- Plan steps split retrieval into keyword, semantic, structured, policy checks, and synthesis.

3. Connector model
- `local_fs`: raw data snapshots and generated local catalog.
- `guideline_pdf`: policy and guideline documents.
- `website`: curated external web sources with bounded crawl settings and source-aware post-processing.

## External website operating standard

- Newly discovered high-value sites are onboarded via the standard at `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/docs/knowledge-source-onboarding.md`.
- Website ingestion is not "collect everything"; it is bounded by:
  - role in JAC (`case_practice`, `legal_policy`, `employer_guidance`, etc.)
  - path-scoped crawling
  - source-aware boilerplate filtering
  - post-ingestion safety review

4. Catalog generation
- `npm run knowledge:catalog` builds `references/index/local-catalog.json`.
- Catalog is metadata-only (file inventory), safe to regenerate on each data update.

## Next integration steps

1. Add text extraction workers for `.pdf`, `.xlsm`, `.sav` into normalized records.
2. Add vector + lexical indices over normalized records.
3. Replace direct retrieval inside `/api/jac-assess` with plan-driven execution.
4. Add citation objects in JAC responses to show source grounding.
5. Keep external website discovery as a repeatable operating process, not an ad hoc exception.
