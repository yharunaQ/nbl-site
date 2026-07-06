# NBLバーチャル・ニュース公開切り出しメモ v0

Date: 2026-07-06  
Lane: Falcon / next NBL public delivery layer  
Surface: `/toolkit-studio`, `/toolkit-studio/virtual-news/[articleSlug]`

## Navigation Card

- Lane: Falcon
- Current phase: 次期NBL公開面のツールキット棚公開切り出し
- Target artifact: `NBLバーチャル・ニュース` と `ウェブアプリ` 棚
- Smallest shippable slice: ツールキットの `NBLバーチャル・ニュース` 15本を公開リンク化し、`ウェブアプリ` 棚には就労支援機関チェックリスト、ナミノート、ナミノート支援者用ツールを分けて表示する
- Done boundary: 一覧カードから15本の個別架空記事へ遷移でき、2026-07-04リリース作業ディレクトリに残っていた本文、図解、境界、参照リンクを復元して表示する
- Not now: ナミノート支援者用ツールの公開、ナミノートの正式版化、実データ連携、AI実行、個別相談受付、制度・医療・雇用・合理的配慮の確定判断
- Swamp risk: 架空記事を現実のニュースや制度解説に見せること、ナミノート個人試用版を正式な支援アプリに見せること、支援者用ツールを公開済みに見せること

## Published Scope

- `NBLバーチャル・ニュース` 棚は `/toolkit-studio#toolkit-virtual-news-library` に残す。
- 記事カードは `公開中` と表示し、`/toolkit-studio/virtual-news/[articleSlug]` へリンクする。
- 個別記事は、旧リリース作業ディレクトリ `/private/tmp/nbl-site-axiom-guide-release-20260704/lib/content/nblVirtualNews.ts` から本文データを復元して表示する。
- 各記事は、次を含む。
  - 架空記事のタイトル、リード、本文セクション、画像、図解
  - 実在ニュースではないこと
  - 標準体制として見る部品、現場で使う手順、読後に話す問い
  - 参照情報と関連リンク
  - 医療、法務、雇用、人事、合理的配慮、就労可否の判断をしないこと

## Web App Boundary

- `就労支援機関チェックリスト`: 公開中。
- `ナミノート`: 個人試用版として注意付きで外部リンクを置く。
- `ナミノート支援者用ツール`: 準備中。公開リンクは置かない。

## Review Status

- Public copy risk review frame: `usable_with_revision`
- This memo does not approve publication by itself.
- Founder request on 2026-07-06: 未公開分をこの段階で公開に持っていく。
- Implementation meaning: public link activation, old full-body restoration, and boundary copy placement, not knowledge-network promotion or runtime expansion.
