# 次期NBL公開前 NBL-Falconドリームチェック v0

Date: 2026-06-07
Lane: Falcon / public migration

## 判定

機械的な公開前ゲートは通過。Founderの最終公開判断が残る。

## 確認したこと

- 次期NBL主要面は、相談事例集、21視点、場面、記事、認知補助ツールキット、理論と発見、障害種類から見る、イベント、aboutとして分かれている。
- X連動は、`@NBL_workdesign` の軽いアカウント紹介として示し、内部slot、OAuth、receipt、投稿候補管理は公開面に出していない。
- 組織自己チェックは、旧Heronメニューではなく、次期NBLツールページとして表示する。
- フォーラムはイベント枠として扱い、記事集の通常カードや第6プロダクトにしていない。
- フォーラム本文は、記事・図解・動画で公開する。重いスライドPDF配布は初回公開から外し、容量と運用リスクを抑える。
- 個別相談、医学・法務・雇用判断、合理的配慮妥当性判断、診断名lookup、反応数による妥当性判断は公開面で避ける。

## 公開前に直した赤

- `pages/api/work-condition-forum/asset.ts` の動的ファイル探索がTurbopackに広すぎるtraceとして扱われ、production buildを止めていた。Turbopack ignoreでサーバー専用のファイル参照に限定した。
- `pages/cases/[caseId].tsx` がサーバーrepositoryをページ上部でimportし、client chunkに `node:fs/promises` を混入させていた。repository importを `getServerSideProps` 内へ移した。
- `pages/review/fchma-expert-agent.tsx` が内部シナリオ定数のためにfs依存モジュールをclient側へ巻き込んでいた。定数をページ内に置き、生成本体は `getStaticProps` 内の動的importへ閉じた。
- `pages/preview/falcon-next-nbl/[slug].tsx` が明示プレビュー個別ページと同じSSG pathを返していた。動的slugは補助ページだけを生成するようにした。
- フォーラム特別シリーズの本文ページが、公開環境では除外される内部素材フォルダをAPIで読みに行く構造だった。本文は静的な構造化記事を読み、図解PNGは `public/` 配下の静的資産へ正規化した。PDF配布は初回公開から外した。
- Vercelアップロード候補に巨大ローカル作業フォルダ `.claude` が含まれ得た。`.vercelignore` に追加し、フォーラム本文生成に必要な最小の構造化記事だけを除外対象から戻した。内部レビューmanifestは公開デプロイ同梱から外した。
- 旧 `/jac` 系の公開入口がHeron相談室・ガイド側へ戻り得た。音楽フェスと組織自己チェックは残しつつ、旧JAC入口は新NBLの相談事例集または21視点へリダイレクトするようにした。

## 検証

- `npx jest __tests__/falcon-next-nbl-static-site-candidate.test.tsx __tests__/organizations-governance-pages.test.tsx __tests__/next-nbl-public-migration-routes.test.ts __tests__/work-condition-forum-session-packages-page.test.tsx __tests__/work-condition-forum-text-page.test.tsx --runInBand`
- `npx jest __tests__/work-condition-forum-text-page.test.tsx __tests__/fchma-case-review-readiness.test.ts __tests__/fchma-case-feedback-loop-auditability.test.ts --runInBand`
- `npx jest __tests__/fchma-expert-agent-page.test.tsx __tests__/policy-service-consulting-review-scenario.test.ts --runInBand`
- `npx jest __tests__/work-condition-forum-text-page.test.tsx __tests__/next-nbl-public-migration-routes.test.ts --runInBand`
- `npm run typecheck -- --pretty false`
- `npm run build`
- `npm run release:public:preflight`

## 残る注意

- `release:public:preflight` のContact Checksでは、旧 `pages/about.tsx` ソース内に直接の `/contact` 文字列がないため `missing /contact link` と表示される。ただしpreflight gateはpassedで、実HTMLの `/about` には `info@nextbeinglab.org` が出ている。
- 実公開は、`deploy.sh` の `git add -A` をそのまま使わない。現在のワークツリーには長期作業の未整理変更、内部生成物、ローカル素材が大量に混在しているため、次期NBL公開面に必要なファイルだけを明示ステージしてからcommit / pushする。
- この作業ディレクトリには `.vercel/project.json` がない。GitHub push連動のVercel自動デプロイを使うか、別途Vercel project linkを設定してからdeployする。
- このチェックは公開承認、法務・医療・雇用判断、知識昇格、runtime/model採用、SNS投稿承認ではない。
