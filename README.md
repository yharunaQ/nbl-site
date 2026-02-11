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
