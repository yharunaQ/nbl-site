# Next Being Lab — Website Starter

How to run:

```bash
npm i
npm run dev
```

Deploy to Vercel (recommended). Update docs in `public/docs/`.

Generated on 2025-09-29.

## JAC API Access Control

Recommended production env settings for cost control:

```bash
JAC_PUBLIC_ENABLED=false
JAC_ACCESS_TOKEN=<strong-random-token>
JAC_RATE_LIMIT_PER_MINUTE=8
JAC_RATE_LIMIT_PER_DAY=120
JAC_GLOBAL_RATE_LIMIT_PER_DAY=3000
JAC_FORCE_FAST_WHEN_HIGH_USAGE=true
JAC_FORCE_FAST_THRESHOLD_PER_DAY=1800
OPENAI_CHAT_TIMEOUT_MS=45000
```

## JAC Safety Audit Log

`/api/jac-assess` calls append a safety audit event to `.tmp/jac-safety-audit/YYYY-MM-DD.jsonl`.

Each event stores:

- safety gate mode/policy/reason codes
- evidence/source/warning counts
- input size metadata (length/count only)
- request fingerprint hashes (`ipHash`, `userAgentHash`)

It does **not** store raw consultation text.

Quick summary:

```bash
npm run jac:audit:summary
```

Optional filters:

```bash
# last 3 days
JAC_AUDIT_DAYS=3 npm run jac:audit:summary

# specific UTC day
JAC_AUDIT_DAY=2026-02-11 npm run jac:audit:summary
```

Retention:

```bash
JAC_AUDIT_LOG_RETENTION_DAYS=14
```

## JAC Data2 / Tag Quality Gate

Run full gate locally:

```bash
npm run jac:quality:gate
```

This runs:

- `jac:data2:refresh` (regenerate + anonymization audit + index build)
- `jac:audit:wording:enforce` (カード文言が data2/GLM/claims 根拠に合っているか監査)
- `jac:eval:tags-local:enforce`
- `typecheck`

`pre-push` hook executes the same gate.

Quick checks when editing only wording/guide:

```bash
npm run jac:audit:wording:enforce
```

If this fails, check:

- `reviewRequiredCount` (0 以外なら要修正)
- `reviewRequired[].cardId` と `ungroundedTerms`
- 対象カードのタイトル/説明/selectionBoundaryを根拠語彙に合わせる

Strict mode (generated file cleanliness check included):

```bash
npm run jac:quality:gate:strict
```

Legacy互換出力（`chishikiOut_jac` / `kijutsuOut_jac`）も厳密に検査したい場合:

```bash
JAC_INCLUDE_LEGACY_COMPAT_IN_CLEAN_CHECK=1 npm run jac:data2:generated:clean
```

## JAC Guidebook Sales MVP (Stripe)

Implemented routes:

- sales page: `/jac/guidebook`
- checkout API: `POST /api/ebook/checkout`
- purchase verification API: `GET /api/ebook/session?session_id=...`
- protected download API: `GET /api/ebook/download?token=...`

Required environment variables:

```bash
STRIPE_SECRET_KEY=sk_live_or_test_xxx
JAC_GUIDEBOOK_STRIPE_PRICE_ID=price_xxx
JAC_GUIDEBOOK_DOWNLOAD_TOKEN_SECRET=<long-random-secret>
```

Optional environment variables:

```bash
# default: public/ebooks/jac-guidebook.pdf
JAC_GUIDEBOOK_FILE_PATH=public/ebooks/jac-guidebook.pdf

# default: jac-guidebook.pdf
JAC_GUIDEBOOK_FILE_NAME=jac-guidebook.pdf

# default: /jac/guidebook/success
JAC_GUIDEBOOK_SUCCESS_PATH=/jac/guidebook/success

# default: /jac/guidebook?canceled=1
JAC_GUIDEBOOK_CANCEL_PATH=/jac/guidebook?canceled=1

# default: 7200 seconds (2 hours)
JAC_GUIDEBOOK_DOWNLOAD_TOKEN_TTL_SEC=7200

# optional fixed public origin for production proxies
JAC_GUIDEBOOK_PUBLIC_ORIGIN=https://your-domain.example
```

Setup checklist:

1. Create a Stripe Product/Price and set `JAC_GUIDEBOOK_STRIPE_PRICE_ID`.
2. Put ebook file at `public/ebooks/jac-guidebook.pdf` (or set `JAC_GUIDEBOOK_FILE_PATH`).
3. Open `/jac/guidebook` and test checkout in Stripe test mode.
4. Complete payment and verify `/jac/guidebook/success` download button works.

## Guidebook Manuscript Workflow

Create draft manuscript from current 26 frame definitions:

```bash
npm run ebook:guidebook:draft
```

Export review files (`.docx` and, if available, `.pdf`):

```bash
npm run ebook:guidebook:export
```

Notes:

- `.docx` export uses `pandoc` if installed.
- On macOS, if `pandoc` is not installed, it falls back to `textutil`.
- `.pdf` export requires either `soffice` (LibreOffice) or a working `pandoc` PDF engine.

All-in-one refresh:

```bash
npm run ebook:guidebook:refresh
```

Readable layout export (cover + toc + chapter page breaks):

```bash
npm run ebook:guidebook:layout
```

The command prints JSON including:

- `pdfCreated`: whether PDF generation succeeded
- `chromeAttempts`: per-mode execution result (`--headless=new` / `--headless`)

If running inside a restricted sandbox, `pdfCreated` may be `false` even when HTML generation succeeds.

Input file can be overridden:

```bash
node ./scripts/ebook/build-readable-layout.mjs --input docs/guidebook/book1-health-layer-draft.md --output-base book1-health-layer-draft
```

Book1 shortcut:

```bash
npm run ebook:book1:layout
```

Markdown image syntax (`![alt](path)`) is supported and embedded into HTML/PDF.

Outputs:

- `docs/guidebook/dist/jac-guidebook-readable-sample.html`
- `docs/guidebook/dist/jac-guidebook-readable-sample.pdf` (if Chrome headless print succeeds)

Paths:

- markdown source: `docs/guidebook/manuscript.md`
- review docx: `docs/guidebook/dist/jac-guidebook-review.docx`
- review pdf: `docs/guidebook/dist/jac-guidebook.pdf`
- publish pdf: `public/ebooks/jac-guidebook.pdf`

Recommended editing flow:

1. Generate markdown draft.
2. Convert to docx and review/edit with Word.
3. Reflect approved edits back to markdown (`docs/guidebook/manuscript.md`).
4. Export final pdf and publish to `public/ebooks/jac-guidebook.pdf`.
