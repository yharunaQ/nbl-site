# Vercel JAC Rate Limit Cutover

更新日: 2026-03-26

## Decision

- `配慮設計アシスト` の `1日20件` 制限は、Vercel 本番では `.tmp` ではなく `shared store` を前提にする。
- 既定の shared store は `Upstash Redis`。
- ローカル / VPS では file-backed fallback を残すが、Vercel では `JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK=false` を推奨する。
- 公開中の `/jac/next` ではアクセストークンを要求せず、rate limit のみで利用量を制御する。
- private mode が必要な場合だけ `JAC_ACCESS_TOKEN_REQUIRED=true` を明示し、旧 `JAC_PUBLIC_ENABLED=false` は token 必須条件として扱わない。
- `/api/fchma/assess` は `OPENAI_API_KEY` が未設定または model provider が失敗した場合、利用者向けエラーではなく deterministic-only の暫定見立てを返す。

## Why

- Vercel Functions は `read-only filesystem` が前提で、`/tmp` は scratch space に過ぎない。
- `1日20件` 制限は、再デプロイや複数インスタンスをまたいで共有されないと意味が薄くなる。
- Vercel の storage guidance でも `Redis` は rate limiting 向き。

## Required Env

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK=false`

## Recommended Env

- `OPENAI_API_KEY`（model-backed assessment を使う場合）
- `OPENAI_MODEL`（任意。未設定時はコード側の既定モデル）
- `JAC_RATE_LIMIT_TIMEZONE=Asia/Tokyo`
- `JAC_COSTLY_RATE_LIMIT_PER_TOKEN_PER_DAY=20`
- `JAC_RATE_LIMIT_PER_DAY=120`
- `JAC_GLOBAL_RATE_LIMIT_PER_DAY=3000`
- `JAC_ACCESS_TOKEN_REQUIRED=false` または未設定

## Cutover Steps

1. Vercel project に `Upstash for Vercel` を追加する。
2. Production environment に `UPSTASH_REDIS_REST_URL` と `UPSTASH_REDIS_REST_TOKEN` を入れる。
3. 追加で `JAC_RATE_LIMIT_ALLOW_LOCAL_FALLBACK=false` を入れる。
4. `JAC_RATE_LIMIT_TIMEZONE=Asia/Tokyo` を確認する。
5. `JAC_ACCESS_TOKEN_REQUIRED` が未設定または `false` であることを確認する。
6. 再デプロイする。
7. 必要なら `npm run ops:jac-rate-limit:check` で env の想定値を確認する。

## Acceptance

- アクセストークンなしの `jac-assess` が `401 Access token required.` にならない。
- `fchma-assess` が `OPENAI_API_KEY が設定されていません。` を利用者向けエラーとして返さず、`providerId=deterministic_only` の暫定見立てを返す。
- 同一利用単位の `jac-assess` の 21 回目が 429 になる。
- その判定が再デプロイ後も維持される。
- 日本時間 0 時をまたぐと翌日ぶんとして再開する。

## Current Code Surface

- shared-store aware guard: `lib/security/jacAccessGuard.ts`
- guarded costly routes:
  - `pages/api/jac-assess.ts`
  - `pages/api/fchma/assess.ts`
  - `pages/api/jac-followup-suggest.ts`
  - `pages/api/jac-tag-suggest.ts`
- deterministic fallback for model-provider failures:
  - `lib/fchma/deterministicAssessmentFallback.ts`
- config self-check:
  - `scripts/ops/check-jac-rate-limit-config.mjs`
- one-off token reset:
  - `scripts/ops/reset-jac-token-rate-limit.mjs`

## Official Sources

- Vercel Functions runtimes:
  - https://vercel.com/docs/functions/runtimes
- Storage on Vercel Marketplace:
  - https://vercel.com/docs/marketplace-storage
- Upstash for Vercel:
  - https://vercel.com/integrations/upstash
- Upstash Redis REST API:
  - https://upstash.com/docs/redis/features/restapi
