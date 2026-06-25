# Axiom public concept search v1 lexicon hotfix - 2026-06-25

## Purpose

Improve the static public-site context search without turning it into a runtime retrieval or LLM search system.

The v0 search already expanded terms such as `難病` and `合理的配慮`. Founder review found a practical vocabulary gap: `オープン/クローズ` is a common Japanese employment-support document phrase, but it did not reliably surface the disclosure / information-sharing boundary material.

## Change

- Add `オープン`, `クローズ`, `オープン/クローズ`, `オープン・クローズ`, `オープン就労`, and `クローズ就労` as triggers for the public concept `開示を目的限定の情報共有として見る`.
- Expand that concept to include `非開示`, `伝える範囲`, `言う言わない`, and `開示境界` alongside existing `共有範囲`, `目的限定`, `評価不安`, `不利益`, `スティグマ`, `相談線`, and `記録範囲`.
- Update the search page examples so users can see that `オープン/クローズ` is treated as an entrance into disclosure-boundary and information-sharing-range content.

## Boundary

This is a static public delivery-layer lexicon update only.

It does not add LLM calls, dynamic retrieval, prompt changes, provider changes, DB schema changes, source/support validity movement, individual case judgment, public approval movement, or learning updates.

The search result remains an orientation aid. It does not decide whether a person should disclose, not disclose, or share particular health or disability information.

## Verification

- `npx jest __tests__/axiom-public-concept-search.test.ts --runInBand`
- `npx tsc --noEmit --pretty false`
- `npm run build`
