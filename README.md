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
