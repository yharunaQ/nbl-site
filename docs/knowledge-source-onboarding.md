# Knowledge Source Onboarding Standard

更新日: 2026-03-07

## 目的

JAC が外部Webの有益情報を継続的に取り込めるようにしつつ、無差別収集ではなく、相談支援に使える精度と境界を保つ。

## 適用対象

- 新たに発見した外部サイト
- 既存ソースの拡張候補
- `config/knowledge-sources.json` に未登録の高価値リソース

## 採用判断の基準

以下を満たす場合に候補化する。

1. JAC の相談支援に寄与する
   - 個別配慮
   - 組織運用
   - 制度/政策
   - 定着/復職
   - メンタルヘルス、神経多様性、合理的配慮
2. 既存ソースを補完する
   - 例: `AskJAN` の個別配慮に対して `askEARN` は雇用主・経営運用を補完する
3. 出所と運営主体が明確
4. 継続アクセス可能で、path を限定した crawl が可能
5. 差別・過度な一般化・診断決め打ちを増幅しにくい

## 標準手順

1. 候補発見
   - サイト名、運営主体、対象読者、国/法域、JAC への補完価値をメモする。
2. 位置づけ確認
   - `disability-holistic-review` の観点で、`observation / inference / normative / recommendation` を分ける。
   - `difficulty_occurrence / difficulty_resolution / symptom_work_interaction / support_need_formation` のどこを強くカバーするか確認する。
3. bounded crawl 設計
   - `allowPathPrefixes` を最小化する。
   - `seedUrls` は代表ページに限定する。
   - `maxPages` と `crawlDepth` は保守的に始める。
4. source 追加
   - `config/knowledge-sources.json` に追加する。
   - 必要なら `scripts/knowledge/fetch-web-sources.mjs` に優先度付けを追加する。
5. source-aware 正規化
   - `scripts/knowledge/build-normalized-records.mjs` で `country / legalContext / pageType` を定義する。
   - 既存分類に無理がある場合だけ新しい `pageType` や `evidenceLane` を追加する。
6. boilerplate 対策
   - `scripts/knowledge/build-claims.mjs` に source 固有の header/footer/navigation 除外ルールを追加する。
7. 取り込み実行
   - `KNOWLEDGE_FETCH_SOURCE_IDS=<source_id> npm run knowledge:fetch-web`
   - `npm run knowledge:normalize`
   - `npm run knowledge:claims`
8. 妥当性確認
   - `references/web-cache/web-fetch-manifest.json`
   - `references/index/normalized-manifest.json`
   - `references/index/knowledge-claims-manifest.json`
   - claim の上位抜粋を目視し、navigation 文や宣伝文が混ざっていないか確認する。
9. JAC での扱い確認
   - `case_practice / legal_policy / employer_guidance / aggregated_general / mixed` のどこに入るか確認する。
   - high-risk aggregated evidence に偏る場合は、補助根拠として扱う前提を明示する。

## 最低限の確認項目

- source は JAC の目的に対して補完価値があるか
- law/policy と employer practice を混同していないか
- ページ種別が適切か
- 国/法域が明示できているか
- boilerplate claim が過剰に出ていないか
- `knowledge:test-safety-gate` を壊していないか

## 運用ルール

- 新規サイトは「見つけたら都度追加検討」ではなく、本手順で標準化して扱う。
- 追加時は必ず bounded crawl で始める。
- source 追加だけで終わらせず、`pageType` と claim 品質まで確認する。
- 高価値でも、診断決め打ちや差別を助長するサイトは採用しない。
- 既存 source と役割が重なる場合は、重複ではなく補完関係を説明できることを条件にする。
