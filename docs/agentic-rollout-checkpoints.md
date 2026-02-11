# Agentic Rollout Checkpoints

## Phase 1: Foundation (Completed)
- Source registry (`config/knowledge-sources.json`)
- Planner endpoint (`POST /api/knowledge/plan`)
- Local catalog generator (`npm run knowledge:catalog`)

## Phase 2: Planner-Driven Assessment (Completed)
- `POST /api/jac-assess` now executes planner + tool steps.
- Response includes:
  - `process.stepProgress`
  - `process.selectedSources`
  - `process.planWarnings`
  - `process.evidenceCount`

## Phase 3: UX Transparency (Completed)
- Step 3 shows execution progress and step status.
- Causal assessment includes citation traces.
- Sidebar summarizes source usage and warnings.

## Phase 4: Data Connectors (In Progress)
Current status:
- local normalizer script implemented (`npm run knowledge:normalize`)
- website connector scaffold implemented (`npm run knowledge:fetch-web`)
- extractor hardening added:
  - pdf: `pdftotext` primary + `strings` fallback
  - xlsm: worksheet/table xml extraction (not only `sharedStrings`)
  - sav: `strings` fallback extraction
- manifest now includes:
  - `byContentType`
  - `metadataOnlyCount`
  - `extractionCoveragePct`
- latest local run:
  - `fileCount=33`
  - `recordCount=1842`
  - `metadataOnlyCount=1`
  - `extractionCoveragePct=97.0`
- optional embedding build script implemented (`npm run knowledge:embed`)

Decision checkpoint:
1. Keep web sources disabled and continue local-only quality tuning.
2. Enable AskJAN / JEED seeds and run scheduled fetch into `references/web-cache`.
3. Add multi-page crawling/rules (robots-aware, dedupe, refresh) before enabling web.

## Phase 5: Retrieval Quality (In Progress)
Current status:
- `jac-assess` now calls planner + agentic executor.
- lexical search upgraded to BM25-style scoring (from simple keyword count).
- semantic step supports hybrid mode when embeddings exist; lexical fallback otherwise.
- evidence normalization updated (dedupe by evidence id + keep highest score).
- UI now shows step completion ratio, ingestion notes, and evidence preview.

Decision checkpoint:
1. Lexical + rules only (fast, lower quality).
2. Hybrid search (BM25 + embeddings) for narrative evidence.
3. Hybrid + reranker (best quality, highest cost/latency).

## Phase 6: Governance (Next)
Decision checkpoint:
1. Citation required only.
2. Citation + confidence score.
3. Citation + confidence + policy-rule violation reports.

Planned sprint task:
- Reduce boilerplate claim noise in `knowledge-claims.jsonl`:
  - see `/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter/docs/next-sprint-claims-quality-task.md`
