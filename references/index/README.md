# Local Catalog

This folder stores generated index artifacts for local knowledge sources.

## Generate catalog

```bash
npm run knowledge:catalog
```

This writes `local-catalog.json` with file inventory metadata under `references/`.

## Generate normalized records

```bash
npm run knowledge:normalize
```

This writes:

- `normalized-records.jsonl` (retrieval-ready chunks and metadata records)
- `normalized-manifest.json` (counts, coverage, and extraction warnings)
- Interaction metadata is attached per record under `interactionContext`:
  - `language`, `country`, `legalContext`, `trustTier`
  - `pageType`, `evidenceScope` (specific case vs aggregated index)
  - `interactionModelSignals` (difficulty occurrence/resolution, symptom-work interaction, support needs)
  - `supportTypeHints`, `disabilityHints`
  - `industryFacets`, `companySizeFacets`, `accommodationFacets`, `outcomeFacets`

Extractor behavior:

- `.pdf`: `pdftotext` primary, `strings` fallback
- `.xlsm`: workbook xml extraction (`worksheets/`, `tables/`, `sharedStrings`)
- `.sav`: `strings` fallback (metadata/noisy text possible)

## Generate knowledge claims

```bash
npm run knowledge:claims
```

This writes:

- `knowledge-claims.jsonl` (deduplicated claim units for downstream reasoning)
- `knowledge-claims-manifest.json` (claim coverage, risk/confidence distribution, and source breakdown)

Claim generation:

- Converts `normalized-records.jsonl` into claim units (`interaction_signal`, `accommodation_action`, `outcome_signal`)
- Aggregates duplicate statements across records
- Adds applicability gaps (`missingContexts`), bias/discrimination risk level, and confidence score per claim

## Test safety gate (jac-assess)

```bash
# terminal 1
JAC_PUBLIC_ENABLED=true npm run dev

# terminal 2
npm run knowledge:test-safety-gate
```

The test verifies that `process.safetyGate` is returned and that:

- aggregated-index heavy scenario is forced to `strict`
- specific-case mixed scenario is evaluated as `caution`

## Fetch website sources (optional)

```bash
npm run knowledge:fetch-web
```

Notes:

- Fetch target is controlled by `config/knowledge-sources.json` (`kind: website` + `enabled`).
- Output cache is written to `references/web-cache/`.
- Website snapshots write both text (`*.txt`) and sidecar metadata (`*.meta.json`) for structured extraction.
- Use `KNOWLEDGE_FETCH_INCLUDE_DISABLED=1` to dry-run disabled website sources.
- Some public sites may block automated access from this environment (for example, some ILO endpoints currently return 403); keep those sources disabled until connectivity is stable.
- Tunable env vars:
  - `KNOWLEDGE_FETCH_TIMEOUT_MS` (request timeout)
  - `KNOWLEDGE_FETCH_RETRIES` (max retry count)
  - `KNOWLEDGE_FETCH_RETRY_BASE_MS` / `KNOWLEDGE_FETCH_RETRY_MAX_MS` (backoff window)
  - `KNOWLEDGE_FETCH_RETRY_AFTER_MAX_MS` (cap for `Retry-After` wait)
  - `KNOWLEDGE_FETCH_CONCURRENCY` (parallel fetch workers)
  - `KNOWLEDGE_FETCH_DOMAIN_MIN_INTERVAL_MS` (minimum gap per domain)
  - `KNOWLEDGE_FETCH_CRAWL_DEPTH` (default crawl depth if source has no `crawlDepth`)
  - `KNOWLEDGE_FETCH_MAX_PAGES_PER_SOURCE` (default source page cap if source has no `maxPages`)
  - `KNOWLEDGE_FETCH_MAX_DISCOVERED_LINKS_PER_PAGE` (per-page enqueue cap)
- Website source config can define:
  - `crawlDepth`
  - `maxPages`
  - `allowedHosts`
  - `allowPathPrefixes`
  - `seedUrlTemplate` + `seedPageStart`/`seedPageEnd`/`seedPageStep` for paginated seed expansion

## Generate embeddings (optional)

```bash
npm run knowledge:embed
```

Requires `OPENAI_API_KEY`. Writes `embeddings.jsonl`.
