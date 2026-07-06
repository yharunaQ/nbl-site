# ツールキット Webアプリ棚 再配置メモ v0

Date: 2026-07-06  
Lane: Falcon / current NBL site delivery layer  
Surface: `/toolkit-studio`

## Navigation Card

- Lane: Falcon
- Current phase: 次期NBL公開面のツールキット棚整理
- North star asset strengthened: reviewed / review-required knowledge outputsを、読者が安全に使える道具棚として見せる
- Target artifact: `/toolkit-studio` の媒体棚
- Smallest shippable slice: `就労支援機関チェックリスト` 単独棚を `ウェブアプリ` 棚に再分類し、`NBLバーチャル・ニュース` 棚は15本の架空記事へリンクできる公開状態にする
- Done boundary: NBLバーチャル・ニュース棚と15本の個別記事リンクを公開し、`ウェブアプリ` 棚カードは読者向け概要に絞り、就労支援機関チェックリスト、ナミノート、ナミノート支援者用ツールは別の具体一覧セクションに表示する
- Not now: ナミノート支援者用ツールの公開、実データ連携、AI実行、個別相談受付、架空記事を実在ニュース・現行制度解説として扱うこと
- Risks: 未公開のNBLバーチャル・ニュースを公開済み記事に見せること、個人試用版のナミノートを正式版アプリに見せること、支援者用ツールを支援判断ツールに見せること、チェックリストを診断名・支援機関評価に見せること
- Default next concrete step: `/toolkit-studio` とNBLバーチャル・ニュース個別記事の表示を、実表示と公開前レビューで確認する

## Placement Change

旧配置:

- 媒体棚の1つとして `就労支援機関チェックリスト`

新配置:

- 媒体棚の1つとして `NBLバーチャル・ニュース` を保持する
- 15本の個別記事リンクを置き、記事一覧は `公開中` として見せる
- 媒体棚の1つとして `ウェブアプリ`
- `ウェブアプリ` 棚カードは、他の媒体棚と同じ密度に保つ。スマホ利用説明やアプリ3件をカード内へ詰め込まない。
- `#toolkit-web-app-library` を具体一覧セクションとして分ける。
- 具体一覧の項目順:
  - `就労支援機関チェックリスト`: 支援機関や診断名で止めず、本人・仕事・環境・支援・時間の条件へ戻す入口。
  - `ナミノート`: 本人が所有する波の記録ノート。個人試用版として注意事項を併記し、公開リンクを置く。
  - `ナミノート支援者用ツール`: 本人が共有した記録を相談前に整理するための支援者向けツール。現時点では準備中で公開リンクにしない。

## Smartphone Use Note

ナミノートはウェブアプリだが、スマホのホーム画面に追加すれば、アイコンから開くスマホアプリのように使える。

この説明は `#toolkit-web-app-library` の導入部に置く。リンクは個人試用版として置き、医療・就労・合理的配慮の判断や助言をしないこと、端末内保存とバックアップ、第三者情報を書かないことを明記する。

## Correction Note

`NBLバーチャル・ニュース公開` がNot nowだった段階では、`/toolkit-studio` から棚自体を消す意味ではなかった。

この段階では、ウェブアプリ棚と同じ公開パッケージとして、15本の架空記事への個別リンクを開く。各記事は2026-07-04リリース作業ディレクトリに残っていた旧本文データを復元し、実在ニュース、現行制度の確定解説、個別判断ではなく、働き方の調整・地域連携・企業運用を検討するための架空未来記事として表示する。

## Public Copy Risk Review

- Short judgment: `usable_with_revision`
- Boundary check: 医療、法務、雇用、人事、合理的配慮、就労可否の判断をしない。
- Work-design frame: 記録・共有準備・支援接続の道具として説明し、診断名別対応や支援機関評価にしない。
- Condition map integrity: 本人、仕事、環境、支援、時間の関係を残す。
- Evidence/source status: NBLバーチャル・ニュースは架空記事として公開、ナミノートは個人試用版、ナミノート支援者用ツールは準備中。公開コピーリスクレビューは出版承認や知識昇格ではない。

## Not Now

- no_public_copy_approval
- no_public_IA_approval
- no_supporter_tool_public_release
- no_individual_consultation_intake
- no_medical_legal_employment_or_accommodation_finality
- no_runtime_retrieval_DB_schema_or_learning_update
- no_virtual_news_as_real_news_or_current_policy_claim
