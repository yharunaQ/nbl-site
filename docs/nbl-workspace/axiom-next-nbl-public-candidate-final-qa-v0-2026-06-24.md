# Axiom Next NBL Public Candidate Final QA v0

Date: 2026-06-24  
Lane: Falcon Lab / Axiom delivery-layer pre-public QA  
Status: internal final QA contract ready, not public approval

## Route

Internal QA surface:

- `/internal/axiom-next-nbl-public-candidate-final-qa`

Primary implementation artifacts:

- `lib/axiom/nextNblPublicCandidateFinalQa.ts`
- `components/axiom/AxiomNextNblPublicCandidateFinalQaSurface.tsx`
- `components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx` (`buildAxiomNblReportArticleVisualQaItems`)
- `pages/internal/axiom-next-nbl-public-candidate-final-qa.tsx`
- `__tests__/axiom-next-nbl-public-candidate-final-qa.test.tsx`
- `__tests__/axiom-next-nbl-public-candidate-language-boundary.test.tsx`

## Purpose

ベータ2後の公開候補9ページについて、公開前に人間が確認すべき箇所を次の3点へ圧縮する。

1. 主要なImage-2.0画像、4コマ、設計ガイド図解、Hero図が、本文と同じ意味を示しているか。
2. altだけでも、その画像が担う仕事条件・参加設計の論点が分かるか。
3. `Axiom`, `kernel`, `runtime`, `source lens`, `missing context`, `Founder` などの内部語が公開本文へ漏れないか。

## Coverage

Final QA matrix covers 37+ major visual/copy/alt items:

- `home`: Hero図
- `scene-entry`: 8つの課題マップ + 8本の4コマ
- `case-readings`: 相談アセスメントHero図
- `work-design-views-guide`: Hero図、前提図、10状況レベル図、10具体設計項目図
- `articles-social-questions`: NBLレポートHero図 + 36本の記事別インフォグラフィック対応表
- `toolkit-studio`: ツールキットHero図
- `work-condition-window`: 障害種類入口Hero図
- `theory-method-trust`: NBLの専門性Hero図

`about-boundary` is included in page coverage but has no major visual item in this matrix.

The 36-article NBL report table is generated from the same public-candidate article data used by `articles-social-questions`. For each article it records the reader question, Image-2.0 infographic path, alt, visual-correspondence text, cues, body headings, and the three next-use routes.

The Jest QA also verifies that every image referenced by the Final QA matrix and the 36-article report table exists under `public/images/` and is non-empty. This prevents broken-image regressions before human visual review.

## Language Boundary Test

A separate render-level test scans all 9 public-candidate pages for internal or process terms that should not appear in reader-facing copy:

- `kernel`
- `runtime`
- `source lens`
- `missing context`
- `cannot-yet-say`
- `candidate_pattern`
- `public_approved`
- `learning update`
- `Founderレビュー済み`

The same test confirms that `サイト情報` still visibly states the individual-consultation, medical/legal/HR/employment, and reasonable-accommodation final-judgment boundaries, and that `@NBL_workdesign` is presented as a social-distribution account rather than a DM consultation route.

## Browser Limitation

The in-app browser currently blocks automated inspection of `http://localhost:3006` and `http://127.0.0.1:3006` for this thread. This QA pass therefore does not claim screenshot-based human visual approval.

It records a code/static review contract so that the next human visual check can inspect the exact image/copy/alt pairs without rediscovering the target list.

## NBL Public Copy Risk Review Alignment

This pass follows the internal public-copy boundary:

- no legal, medical, employment, or accommodation finality;
- no AI-owned individual case judgment;
- no public approval implication;
- no source/current-policy finality;
- no runtime, retrieval, DB, or model movement;
- no learning update from the QA artifact.

## Result

The Final QA surface is ready as an internal review aid. It does not approve the site for publication.

The main remaining visual QA risk is not missing page construction. It is whether generated images, especially the visual-heavy `8つの課題`, `設計ガイド`, and `NBLレポート`, match the public copy closely enough when seen by a human reader. The NBL report article/infographic target list is now complete for all 36 articles; human visual judgment is still required before public release.

## Not Now

- no_public_approval
- no_publication_execution
- no_actual_public_navigation_change
- no_runtime_prompt_retrieval_model_provider_db_schema_change
- no_source_support_validity_finality
- no_individual_consultation_or_case_judgment
- no_personal_data_collection_or_feedback_form_activation
- no_learning_update_from_final_qa
