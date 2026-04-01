# 2026-03-20 Post-Release Check

## Summary

- GitHub `main` was updated to `13f2fee53e863c925a9a22f0109e01b072eed9e5`
- Production site is still serving an older Vercel deployment
- The latest Vercel deployment for commit `13f2fee...` failed
- This is not yet a successful public release

## Live Checks

Checked against `https://nextbeinglab.org` on 2026-03-20 JST.

### HTTP status

- `/` -> `200`
- `/for-enterprise` -> `200`
- `/jac-foundations` -> `200`
- `/videos` -> `200`
- `/what-we-do` -> `404`
- `/resources` -> `404`
- `/contact` -> `404`
- `/about` -> `404`
- `/robots.txt` -> `200`
- `/sitemap.xml` -> `200`

### Content mismatch

- `/` still shows older wording such as `JACの基礎説明`
- `/` does not yet show newer wording such as `仕事設計の見取り図の基礎説明`
- `/jac-foundations` still shows older `JAC 26フレーム` wording
- `/jac-foundations` does not yet show the newer `仕事設計の見取り図` title
- `/jac-foundations/employment-normalization.png?v=2026-03-20-1` returns `404`
- `/jac-foundations/condition-map.png?v=2026-03-20-1` returns `200`
- `/jac-foundations/quality-metrics.png?v=2026-03-20-1` returns `200`

## Deployment Status

GitHub commit status for `13f2fee...`:

- `Vercel` -> `failure`
- Description: `Deployment has failed`
- Target: `https://vercel.com/yharunaqs-projects/nbl-site/6XJP2QnhnEW74XdhpLzMwAAnjVUD`

## Constraints

- Public GitHub status confirms deployment failure, but detailed Vercel logs were not accessible without authenticated Vercel project access
- Local `release:public:preflight` passed before push
- This strongly suggests the blocker is in the deployment environment rather than the local app logic

## Strong Suspicion To Verify

This is an inference, not a confirmed log-derived root cause.

- The tracked repository payload is very large for a deployment source
- Current tracked file size is about `1676 MB`
- Tracked `content-inbox/songs` alone is about `983 MB`
- Vercel documents build/storage limits and CLI source upload limits, so deployment-source size is a plausible failure factor

## Suggested Recovery Paths

1. Preferred: remove non-deploy internal assets from the tracked deployment source and keep only site-required files in the deploying repo
2. Alternative: split the deploy target so Vercel builds from a smaller public-site subtree or separate repo
3. If Vercel project access is available, inspect deployment `dpl_6XJP2QnhnEW74XdhpLzMwAAnjVUD` logs first, then confirm the exact blocker before cleanup

## Recovery Update

Follow-up fixes were applied after this initial failed check.

- `content-inbox` was removed from the Git-tracked deploy source while keeping local files intact
- `eslint` was upgraded to match `eslint-config-next@16`
- `.vercelignore` was narrowed so build-time `references/**` files remain available
- `lib/ebook/config.ts` was adjusted to avoid whole-project tracing from `process.cwd()`

### Final Result

- Vercel deployment for commit `9655c73` completed successfully
- Production now returns `200` for `/`, `/what-we-do`, `/for-enterprise`, `/jac-foundations`, `/resources`, `/videos`, `/contact`, and `/about`
- Updated public wording is visible:
  - top page shows `仕事設計の見取り図の基礎説明`
  - `jac-foundations` shows `仕事設計の見取り図`
  - `contact` no longer includes the earlier top-down phrasing checks
  - `videos` no longer shows the blanket `見えない障害のシリーズを見る`
- Versioned infographic assets all return `200`, including `employment-normalization.png?v=2026-03-20-1`
