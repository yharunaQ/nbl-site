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

Extractor behavior:
- `.pdf`: `pdftotext` primary, `strings` fallback
- `.xlsm`: workbook xml extraction (`worksheets/`, `tables/`, `sharedStrings`)
- `.sav`: `strings` fallback (metadata/noisy text possible)

## Fetch website sources (optional)

```bash
npm run knowledge:fetch-web
```

Notes:
- Fetch target is controlled by `config/knowledge-sources.json` (`kind: website` + `enabled`).
- Output cache is written to `references/web-cache/`.
- Use `KNOWLEDGE_FETCH_INCLUDE_DISABLED=1` to dry-run disabled website sources.

## Generate embeddings (optional)

```bash
npm run knowledge:embed
```

Requires `OPENAI_API_KEY`. Writes `embeddings.jsonl`.
