# NBL Content Inventory

更新日: 2026-03-22

このファイルは、公開候補を棚卸しするための共有台帳。

現在のコアは、`仕事設計の見取り図 / 26フレームカード版 / 仕事設計ガイド / 配慮設計アシスト / 雇用設計コレクション` の束として扱う。
公開名では `jac` を使わず、必要な場合だけ legacy route や内部識別子として残す。
収益の主軸は `startup fee / recurring fee / bounded private usage` の private layer に置き、先行5章版は開発履歴 / 編集資産として扱う。

## 判定ラベル

- `public_now`: そのまま public に載せられる
- `public_after_rewrite`: public 候補として再構成する価値がある。AI が rewrite draft を起こしてよい
- `internal_only`: 内部判断や設計のために保持する
- `hold`: 放置ではなく `internal incubation / revival queue`。AI が weekly で再評価し、hidden review draft までは進めてよい

## Review rule

- Founder が毎回この棚を手で掘り返す前提にはしない
- weekly review で AI が `hold / public_after_rewrite` から再起動候補を 1-3 件出す
- Founder の `Yes / No / Adjust` は、その候補が `public candidate / public promise` に近づく境界で使う

## Inventory

| Path or topic | Audience | Current role | Decision | Reason | Needed action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| Whole-site architecture | 企業、支援者、当事者、研究・政策 | サイト全体設計 | provisional | `AI時代の社会OSを設計する研究と実装のスタジオサイト` として整理する必要がある。加えて、仕事設計プロダクト群が現在のコアであることを全導線に組み込む必要がある | `docs/nbl-workspace/site-architecture-2026-03-15.md` を基準に stream ごとに棚卸しを続ける | Chief of Staff |
| Home page (`pages/index.tsx`) |  |  |  |  |  |  |
| 仕事設計の見取り図 (`pages/jac-foundations.tsx`) | 企業、支援者、研究・政策 | public-safe な基礎地図 | public_now | 3レイヤー、仕事のコンディションマップ、雇用の正常化、質の指標を、仕事設計プロダクト群の土台として返せている | 基礎地図として維持しつつ、仕事設計 / Resources / 雇用設計 review との接続を強める | Chief of Staff |
| 26フレームカード版 (`pages/jac/frames.tsx`) | 企業、支援者、当事者 | 見取り図の次に置く current core の本体 | public_after_rewrite | 3/9 時点の `jac-26-card-edition.md` を土台にした main surface はあるが、公開導線と名称がまだ整い切っていない | wording と導線を最終見直しし、current core の本体として public-safe に出す | Chief of Staff |
| 仕事設計ガイド (legacy route `pages/jac/guide.tsx`) | 企業、支援者、当事者 | method entry のはずの public route | public_after_rewrite | 実装はあるが、26カード版より前に出る旧導線や個別化に近い wording が残り、現在の posture とズレる | `/review/jac-positioning` を基準に、method entry としての役割へ絞り直す | Chief of Staff |
| 配慮設計アシスト (legacy route `pages/jac.tsx`) | Founder の外部依頼対応、将来の operator-assist 候補 | Founder-operated internal tool | internal_only | 実装はあるが、`AIカウンセラー` や open trial promise に見える wording が現在の実運用と衝突する。いまは Founder が内部で使ってノウハウを集める段階 | internal tool として boundary を固定し、将来は `operator-assisted -> self-serve` の順で評価する | Chief of Staff |
| 先行5章版アーカイブ (legacy route `pages/jac/guidebook.tsx`) | 編集・開発レビュー、方法論を深く知りたい読者 | 26カード版に至る前段の試作記録 / 編集資産 | internal_only | 本体ではないが、利用者に伝わるまとめ方を試した重要な開発履歴として価値がある。checkout 起点で見せると現行 product と誤認されやすい | 開発履歴として静かに保持し、有効だったまとめ方を 26カード版や他の前段面へ逆輸入する | Chief of Staff |
| Guidebook / docs links |  |  |  |  |  |  |
| Service / pricing blocks |  |  |  |  |  |  |
| Reports / research materials |  |  |  |  |  |  |
| DAO participation lab |  |  |  |  |  |  |
| Inbox series: インフォグラフィック群 | 当事者理解、企業、支援者 | メディア資産 | mixed | 基礎図解は `public_now`、制度/当事者理解は `public_after_rewrite`、思想/未整理素材は `hold`。当事者理解系は重要コンテンツ | `docs/nbl-workspace/infographic-triage-2026-03-15.md` を基準に優先 review する |  |
| 就労支援設計の変革テーマ群 (`/resources/work-support-transformation`, `/review/employment-design`) | 企業、支援者、当事者、研究・政策 | public collection と review rationale の二層構成 | public_now | NBL を `企業向け個別支援` ではなく `社会OS事業` として見せるうえで、制度、専門支援、慢性疾患支援まで含む公開知識層が必要。公開 collection を持つことで、仕事設計プロダクト群と Resources のあいだをつなげられる | public collection を基準面として維持しつつ、`/review/employment-design` は公開理由と構成判断の内部面として残す | Chief of Staff |
| 障害者雇用支援の世界標準 (`content-inbox/地平1_隔離・分離から包摂へ/障害者雇用支援の世界標準`) | 企業、支援者、研究・政策 | 就労支援設計の変革テーマ群の世界標準レーン | public_now | NBL が企業内の配慮論だけでなく、支援設計や制度設計も含めて課題を読むことを示せる重要資産。公開面では `世界標準レーン` として明示した | `インクルーシブ雇用` `諸外国の3層` を軸に保守しつつ、必要に応じて `合理的配慮の潮流` や `質の指標` との接続を強める | Chief of Staff |
| 日本における変革課題 (`content-inbox/地平1_隔離・分離から包摂へ/日本における変革課題`) | 企業、支援者、研究・政策 | 就労支援設計の変革テーマ群の制度変革レーン | public_now | NBL が企業だけの課題を扱うのではなく、日本の制度前提と現場運用のねじれまで扱うことを示せる。公開面では `日本の変革課題レーン` として位置づけた | `日本と世界の比較` `障害者雇用の正常化` を軸に、仕事設計への橋を維持する | Chief of Staff |
| 慢性疾患の支援 (`content-inbox/地平1_隔離・分離から包摂へ/慢性疾患の支援`) | 当事者、企業、支援者、研究・政策 | 就労支援設計の変革テーマ群と見えない障害理解をつなぐ bridge lane | public_now | 障害者雇用枠では拾いきれない体調変動や継続就労、専門支援との連携を扱う重要テーマ。公開 collection に入ることで、NBL のコアとの関係が見えやすくなった | 公開済み動画、図解、4コマとの往復導線を保ち、`見えない障害の理解` との橋渡しを強める | Chief of Staff |
| Inbox series: PNG 図解群 |  | メディア資産 | mixed | レイヤー図や基礎図は有望だが、その他に thought piece と重複がある | 基礎図と hold を切り分ける |  |
| Inbox series: 難病コミック4コマ群 | 当事者理解、企業、支援者 | メディア資産 / 制作途中素材 | public_after_rewrite | 「見えない障害」の理解を促す重要シリーズ候補。初回 shortlist は選定済み | `content-review/invisible-disability-series/manifest.md` を基準に優先 review する |  |
| Inbox series: YouTube 動画 |  | 外部公開メディア | mixed | `public_now` 5 本、`public_after_rewrite` 5 本、`hold` 5 本に仮仕分け | `docs/nbl-workspace/youtube-triage-2026-03-15.md` を基準に扱う |  |
| Inbox series: 公共広告キャンペーン song / MV | 一般、当事者、企業、支援者 | awareness asset | mixed | 記憶に残る導線として強いが、MV 完成待ちだと止まりやすく、song 単体では概念の境界説明が不足しやすい | `docs/nbl-workspace/campaign-lane-brief-2026-03-18.md` を基準に、audio-first の最小公開単位を設計する | Chief of Staff |
