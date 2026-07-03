# Axiom Next NBL Beta Integrated Improvement Plan v0

Date: 2026-06-24  
Lane: Falcon Lab / Axiom delivery-layer pre-public improvement  
Source: `axiom-next-nbl-virtual-beta-test-run-v0-2026-06-24.md` and `axiom-next-nbl-virtual-beta2-review-run-v0-2026-06-24.md`

## Goal

次期NBLサイト公開候補9ページを、ベータ結果に基づき、場当たり的な個別修正ではなく全体の読者体験として整える。

この計画は公開承認ではない。実行してよいのは内部候補ページのコピー、導線、表示、レビュー可能性の改善まで。

## Improvement Lanes

### Lane 1: Public Language Sweep

内部語・開発語を公開候補本文から抜く。

- `Axiom`, `kernel`, `Founderレビュー済み`, `source lens`, `cannot-yet-say`, `runtime`, `publication` などは、公開ページ本文では原則使わない。
- 必要な境界は、読者向けには「言いすぎを止める」「仮説として読む」「まだ確認が必要なことを残す」と表現する。
- 内部候補画面の上部・フッターの noindex / not-public 表示は残す。

### Lane 2: Intelligent Cross-Page Routing

ページ下部の単純な「次に読む」をやめ、各ページの役割に合わせて次の行動を示す。

- 8つの課題 -> 相談事例 / 設計ガイド / ツールキット
- 相談事例 -> 設計ガイド / 障害種類から見る / ツールキット
- 設計ガイド -> 相談事例 / NBLレポート / ツールキット
- NBLレポート -> 相談事例 / 設計ガイド / ツールキット
- ツールキット -> 8つの課題 / 相談事例 / NBLレポート
- 障害種類から見る -> 相談事例 / 設計ガイド / NBLの専門性
- NBLの専門性 -> 設計ガイド / NBLレポート / サイト情報
- サイト情報 -> トップ / NBLの専門性 / NBLレポート

### Lane 3: Business Use Without Individual Consultation

NBL事業活用導線は、個別相談受付ではなく、研修・教材・共同検討・講演・調査研究・資料活用として示す。

- トップに「企業・行政・支援機関の方へ」の短い活用カードを置く。
- サイト情報の問い合わせ説明にも同じ境界を反映する。
- DMやSNS返信で個別判断をしない境界は維持する。

### Lane 4: Visual and Accessibility QA

Image-2.0図解・4コマは、本文内容と一致し、代替テキストだけでも要点が分かる必要がある。

- 今回は導線とコピーの統合改修を先に行う。
- 次段で、画像ごとの本文対応表とalt QAを実装する。

### Lane 5: Page-Specific Deepening

次段のページ別深掘り。

- 相談事例: 複数選択時の当初見立て・確認質問・支援計画分岐を厚くする。
- NBLレポート: 記事索引と図解対応表を完成させる。
- ツールキット: 選別図解の棚を用途別にさらに整える。
- 障害種類から見る: 初心者向け説明の温度を最終調整する。

## Current Increment

今回の実装範囲:

1. Public Language Sweepの第一弾。
2. Intelligent Cross-Page Routingの実装。
3. Business Use Without Individual Consultationの最小導線。
4. この計画をPLANSに同期。

## Implemented Follow-Up

### Beta 2 Comprehensive Review

ベータ統合改修後の再レビューとして、`/internal/axiom-next-nbl-virtual-beta2-review` を追加した。

- 9ページは公開候補として一巡しており、次の中心課題は新規構築ではなく公開前QAであると整理した。
- 横断レビューは、内部語・個別判断誤認、Image-2.0図解と本文/altの一致、スマホ密度、公開境界の4点を優先する。
- ページ別レビューは、各ページを `候補に近い` / `部分仕上げ` / `図解/コピーQA` に分け、最終QAチェックと次の具体アクションへ圧縮した。
- NBL事業視点では、サイトを個別相談受付や営業ページではなく、研修、共同検討、NBLレポート、SNS社会対話、素材活用を支える公開信頼の母艦として扱う。

これは公開承認、公開実行、actual public navigation、runtime/model/provider/schema変更、source/support validity、個別相談、個人情報取得、learning updateではない。

### NBL Report Editorial Map / Visual Correspondence

Lane 4 / Lane 5 の最初の追加実装として、`articles-social-questions` に次を追加した。

- `NBLレポートの編集地図`: 読者の問い、テーマ、立場、仕事条件、図解の関係を先に示す。
- `図解対応`: 選択中の記事について、図解が本文のどの読者問い・仕事条件・設計論点を先に見せるものかを明示する。
- 記事ごとの対応タグは重複を除去し、React key warningを出さない。
- Jestで、編集地図、図解対応、Image-2.0系記事図解、既存検索/絞り込み/本文リーダーの維持を確認する。

これは記事内容の公開承認ではなく、公開候補レビューのための読者体験改善である。

### Toolkit Use Packages

Lane 5 のツールキット深掘りとして、`toolkit-studio` に次を追加した。

- `使う場面から、素材を組み合わせる`: 媒体別の棚だけでなく、初回相談・初回会議、管理職・人事研修、難病・慢性疾患の健康時間、研修・フォーラム後の実装という4つの利用場面で素材を束ねる。
- 各パッケージは、選別図解、相談事例、設計ガイド、NBLレポート、音楽、フォーラム、障害種類入口を、具体的な使いどころと到達状態つきで接続する。
- これによりツールキットは他ページへの単なるリンク集ではなく、文章だけでは届きにくい仕事条件の見方を、会議・研修・相談で扱える素材パッケージとして示す。
- Jestで、4パッケージ、主要リンク、既存5媒体棚、7図解グループ、57図解カード、音楽・フォーラム実体、lightbox、境界文言の維持を確認する。

これは素材利用の公開候補UIであり、個別助言、研修提供の確定、著作権許諾、公開承認、runtime化、SNS実行、learning updateではない。

### Consultation Assessment Flow Clarification

Lane 5 の相談事例深掘りとして、`case-readings` に次を追加した。

- `アセスメントの流れ`: 相談の一言を残す、条件に分ける、当初見立て、確認問い、確認結果ごとの支援計画分岐を、右側の結果表示で一続きに見せる。
- 複数の具体チェックを選んだとき、選択領域数と確認問い数が変わるため、ページが回答表ではなく、相談を条件確認へ広げるデモとして読める。
- Jestで、相談事例ページがアセスメントの流れを表示し、複数チェック時に選択領域数が変わることを確認する。

これは静的なモデル表示であり、個別相談受付、個別支援計画の確定、雇用・医療・法務判断、公開承認、runtime化、learning updateではない。

### Condition-Window Beginner Explanation Retuning

Lane 5 の障害種類入口の温度調整として、`work-condition-window` に次を追加した。

- 各障害カテゴリの冒頭に `まず知っておきたいこと` と `職場設計で見ること` を置き、読者が障害種類について知りたい気持ちを受け止めてから仕事条件へ進める構造にした。
- 9カテゴリすべてで、障害名から直接配慮答えに進むのではなく、情報形式、時間、動線、手順、相談線、評価、支援接続などの条件へ自然につなぐ。
- Jestで、9カテゴリすべてに初心者向け説明と職場設計ブリッジが出ること、視覚障害・難病の冒頭が診断名別の答え表ではなく条件設計へ進むことを確認する。

これは公開候補ページの説明温度調整であり、障害名別の必要配慮判定、個別相談、医学・雇用・法務判断、公開承認、runtime化、learning updateではない。

### Public Candidate Final QA Matrix

Lane 4 の公開前QAとして、`/internal/axiom-next-nbl-public-candidate-final-qa` を追加した。

- 主要Image-2.0画像、4コマ、設計ガイド図解、Hero図について、画像パス、alt、周辺コピー、読者に伝えるべき理解、確認観点を1つの対応表にした。
- `8つの課題` は課題マップ + 8本の4コマ、`設計ガイド` はHero / 前提図 / 10状況レベル図 / 10具体設計項目図までを主要QA対象にした。
- `Axiom`, `kernel`, `runtime`, `source lens`, `missing context`, `Founder` など、公開本文で避ける内部語と置換方針を明示した。
- `NBLレポート` はHeroに加え、36本の記事別インフォグラフィック一致を、記事の問い、図解、alt、図解対応、本文見出し、次の導線まで含む全件対応表として追加した。

これはブラウザ自動確認がブロックされている状態でのコード/静的QA契約であり、スクリーンショットベースの人間視覚承認ではない。公開承認、公開実行、actual public navigation、runtime/model/provider/schema変更、source/support validity、個別相談、個人情報取得、learning updateではない。

## Not Now

- no_public_approval
- no_publication_execution
- no_actual_public_navigation_change
- no_runtime_prompt_retrieval_model_provider_db_schema_change
- no_source_support_validity_finality
- no_individual_consultation_or_case_judgment
- no_personal_data_collection_or_feedback_form_activation
- no_learning_update
