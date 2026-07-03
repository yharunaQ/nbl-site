# Axiom Next NBL Virtual Beta Test Run v0

Date: 2026-06-24  
Lane: Falcon Lab / Axiom delivery-layer pre-public review  
Status: internal virtual beta complete, not public approval

## Purpose

公開前に、次期NBLサイト9ページを想定利用者とNBL事業チームの目で読み、改善候補と事業活用の方向を集める。

これは公開承認、publication、actual public navigation、runtime/prompt/retrieval/model/provider/DB/schema、source/support validity、candidate_pattern、learning updateではない。

## Implemented Artifacts

- `lib/axiom/nextNblVirtualBetaTest.ts`
- 16 virtual beta agents
  - 9 page reviews
  - NBL business-team reviews
  - priority improvement queue
  - validation contract
- `components/axiom/AxiomNextNblVirtualBetaTestSurface.tsx`
  - readable internal review surface
- `pages/internal/axiom-next-nbl-virtual-beta-test.tsx`
  - noindex internal route
- `__tests__/axiom-next-nbl-virtual-beta-test.test.tsx`
  - coverage and boundary regression tests

Internal review route:

- `/internal/axiom-next-nbl-virtual-beta-test`

## Review Coverage

Virtual beta perspectives:

- 障害のある求職者・就労者
- 難病・慢性疾患のある就労者
- 視覚障害のある読者
- 聴覚・情報参加の読者
- 発達障害・精神障害・メンタルヘルスの読者
- 企業人事・DEI担当
- 現場管理職
- 就労支援機関・ジョブコーチ
- 医療・福祉・教育から職場へつなぐ支援者
- 行政・政策・研究の読者
- 家族・ピアサポート
- ニュース・SNS経由の読者
- NBL編集・プロダクト責任者
- NBL事業開発・連携責任者
- NBL信頼・運営境界責任者
- NBL SNS・社会対話責任者

## Main Findings

1. 次期サイトは公開候補として読める段階に近づいているが、公開前の重点は内部語除去、図解と本文の一致、アクセシビリティ、事業活用導線の最小整理。
2. 利用者視点では、相談事例、設計ガイド、8つの課題、障害種類から見る入口の価値が特に高い。
3. 弱点は、説明過多になる瞬間、図解が本文とずれる瞬間、個別相談窓口と誤解される瞬間に集中する。
4. 事業視点では、サイトは営業ページではなく、研修、共同検討、教材、レポート、SNS社会対話を支える信頼母艦として使うのが自然。

## Priority Improvement Queue

1. 公開候補ページ全体の内部語・開発語の除去。
2. Image-2.0図解・4コマの内容一致とアクセシビリティ点検。
3. 個別相談ではないNBL事業活用への最小導線。
4. NBLレポートの索引・検索・図解対応。
5. 相談事例ページの複数選択時の見立てと支援計画分岐の厚み。

## Not Now

- no_public_approval
- no_publication_execution
- no_actual_public_navigation_change
- no_runtime_prompt_retrieval_model_provider_db_schema_change
- no_source_support_validity_finality
- no_candidate_pattern_promotion
- no_individual_consultation_or_case_judgment
- no_personal_data_collection_or_feedback_form_activation
- no_learning_update_from_virtual_beta
