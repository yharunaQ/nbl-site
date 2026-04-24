# Songs Release Spec — 2026-04-24

Status: approved for implementation
Owner: 春名（編集） / 実装: Sonnet 4.6
Target surface: Heron `/resources/songs/*`（将来 Falcon へ流用）
Related docs:
- `content-inbox/songs/README.md`
- `content-inbox/songs/campaign-song-theme-clusters-2026-03-19.md`
- `docs/nbl-workspace/song-crossmedia-rollout-2026-03-19.md`
- `docs/nbl-workspace/campaign-lane-brief-2026-03-18.md`

---

## 1. 目的と非目的

### 目的
1. 30曲のキャンペーンソングを「NBL Resources の1トラック」として公開し、Heron 先行で立ち上げる。
2. 各曲ページが **SNS上で単独共有されても意味が通り、画像・タイトル・キャッチが適切に表示される**こと。
3. 利用者が**サイト内で繰り返し便利に聴ける**こと（ローカルDLでのプレイリスト化に頼らない）。
4. 曲・キャンペーン・既存Resourceの**クロスリンクが双方向**で機能すること。
5. Heron 実装資産が Falcon 本番化時にそのまま使えること（契約化）。
6. 曲別のフィードバック（いいね・再生数）を得られること。
7. **Heron の Vercel 使用量を増やさない／むしろ減らす**。

### 非目的
- 曲だけで制度解説や個別判断を代替しない（既存 guardrail 継承）。
- 有料配信・サブスクリプション導線は作らない。
- ユーザーログイン／アカウント機能は作らない（お気に入りはlocalStorage）。
- 歌詞シンクロ／波形ビジュアライザは v1 では作らない。

---

## 2. 公開対象（30曲）と保留（5曲）

`content-inbox/songs/` 現況:

### Hold（`Status: hold` → generator 無視・URLなし）
- `次の地平へ/Next Being`
- `次の地平へ/腹ペコのまま`
- `次の地平へ/静かな革命`
- `周辺化された人々/My Second First Time`
- `周辺化された人々/幕が上がる`

上記フォルダは残置。ノート先頭メタに `Status: hold` を明記。generatorはスキップ。

### 公開対象カテゴリと slug

| 日本語ラベル | slug | 公開曲数 |
|---|---|---|
| 合理的配慮キャンペーン | `reasonable-accommodation` | 8 |
| インクルーシブ雇用キャンペーン | `inclusive-employment` | 9 |
| 障害者雇用啓発キャンペーン | `disability-awareness` | 11 |
| 医療・福祉・雇用の連携キャンペーン | `care-work-employment-bridge` | 2 |

合計 30曲（ノート数と一致すること。Phase 0 で自動照合）。

---

## 3. データモデル

### 3.1 source of truth
編集面は従来通り `content-inbox/songs/<campaign-jp>/<title-jp>/campaign-song-note.md`。このファイルだけが人間が書く一次資料。TS/TSXへ直接曲データを書くことを禁ずる。

### 3.2 ノート拡張フィールド（全曲必須は Slug のみ。公開には §6.2 のゲートを通ること）

```
## Publishing
- Slug: de-ki-ru-joken            # kebab-case ASCII 必須・全曲一意
- Status: inbox | review | public | hold
- Catchphrase: 職場設計として配慮を見る入口
- Release date: 2026-04-27
- Duration: 3:12

## Assets (web)
- Audio source: DE ・KI・RU ジョーケン (Remix).wav   # 同フォルダ内のWAV名
- Audio public: songs/audio/de-ki-ru-joken.mp3        # sync後に自動生成されるパス（書き手は触らない）
- Hero visual: songs/still/de-ki-ru-joken.jpg
- Lyric card (optional): songs/lyric-card/de-ki-ru-joken.jpg
- YouTube id:

## Cross-links
- Related song slugs: mienai-nimotsu-no-hero, tomei-na-ryukku
- Related campaigns: inclusive-employment
- Related resource paths:
    - /resources/invisible-disability
- Related infographic keys: invisible-backpack

## Share copy
- X: 140字以内
- Threads: 200字以内
- LINE: 120字以内
```

既存セクション（Basic Info / Campaign Intent / Lyrics / Guardrails / Notes）は維持。

### 3.3 生成物（Generator 出力、手書き禁止）

`scripts/content/build-songs.mjs` が以下を出力：

- `content/media/songs/generated.json` — 公開対象30曲の構造化データ
- `content/media/songs/by-infographic.json` — `{ "invisible-backpack": ["slug-a", ...] }`
- `content/media/songs/by-resource-path.json` — `{ "/resources/invisible-disability": ["slug-a", ...] }`
- `content/media/songs/by-campaign.json` — `{ "reasonable-accommodation": ["slug-a", ...] }`

型定義は `lib/types/songs.ts` に集約し、Heron・Falcon 両者が import する唯一の契約とする。

### 3.4 キャンペーン定義

`content/media/songs/campaigns.yml`（手書き）

```yaml
- slug: reasonable-accommodation
  title_ja: 合理的配慮キャンペーン
  headline: 特別扱いではなく職場設計として見る
  summary: 少しの工夫でできる条件が増える、という実務の感覚。
  tone_color: emerald
  related_campaigns: [inclusive-employment, disability-awareness]

- slug: inclusive-employment
  title_ja: インクルーシブ雇用キャンペーン
  ...
```

### 3.5 週次ピック

`content/media/songs/weekly-pick.yml`（手書き・毎週1行更新）

```yaml
current:
  week_of: 2026-04-27
  picks:
    - { slug: dekiru-joken,              note: 職場設計として配慮を見る入口に }
    - { slug: mienai-nimotsu-no-hero,    note: "" }
    - { slug: tsunagu-hikari,            note: "" }
archive:
  - week_of: 2026-04-20
    picks: [...]
```

Generator:
- `picks[*].slug` が `generated.json` に存在することを検証、無ければビルド失敗
- `week_of` が前回より古ければ警告
- `current` が2週間以上更新されていなければ `console.warn`（CIでは通す）

運用手順（Sonnetタスクに含む README を添える）：
1. `current.picks` を上書き
2. 旧 `current` を `archive` 先頭に追加
3. `week_of` を今週月曜日に更新
4. commit & push → ISR再生成で反映

---

## 4. 資産配置・変換

| 種類 | 置き場所 | 生成元 | 備考 |
|---|---|---|---|
| 音源（配信） | `public/songs/audio/<slug>.mp3` | `sync-song-assets.mjs` が `content-inbox/...` の WAV から ffmpeg で変換 | 192kbps CBR、ID3タグ（title=曲名, artist=Next Being Lab, album=キャンペーン名） |
| WAV原本 | `content-inbox/songs/.../*.wav` | 人間 | gitに入れる。公開配信しない |
| スチル | `public/songs/still/<slug>.jpg` | 人間がinboxに置いたものを sync でコピー | 1200×630 推奨。無い場合はキャンペーンデフォルトにフォールバック |
| 歌詞カード（任意） | `public/songs/lyric-card/<slug>.jpg` | 同上 | |
| OG動的 | `/api/og?type=song&slug=<slug>` | Edge Function | §8参照 |

キャッシュ: `public/songs/**` には `Cache-Control: public, max-age=31536000, immutable` を `next.config.js` で付与。差し替えは slug 固定なので、次回ビルドの asset hash 連携 or `?v=<buildId>` で対応。

---

## 5. URL / ルーティング（Pages Router）

### 5.1 ページ一覧

| パス | 内容 | レンダリング |
|---|---|---|
| `/resources/songs` | index。ヒーロー + 今週のピック3曲 + 人気ランキング上位5 + カテゴリ4枚 + Guardrail | SSG + ISR 30分 |
| `/resources/songs/campaigns/[campaign]` | キャンペーンページ。概念ノート / 曲リスト / 関連キャンペーン / 「このキャンペーンを通しで聴く」CTA | SSG |
| `/resources/songs/[slug]` | 単独曲ページ。§7参照 | SSG |
| `/resources/songs/favorites` | localStorage の★曲を連続再生 | CSRのみ（SEO対象外） |
| `/resources/songs/discover`（任意・v1.1） | 未再生曲のみ提示 | CSRのみ |

### 5.2 静的生成
- `getStaticPaths` は `generated.json` と `campaigns.yml` から全 slug を列挙、`fallback: false`。
- `hold` は列挙しない。将来 public 化時は rebuild で自然に URL が生える。

### 5.3 `/resources` 本体への導線
既存 [pages/resources.tsx](../../pages/resources.tsx) の `resourcesThemeTracks` / `resourcesCollections` に Songs を追加（`lib/content/resourcesFirstRelease.ts` 編集）。status は `public_now`。

---

## 6. Guardrail / 公開ゲート

### 6.1 保持する guardrail
- 曲だけで制度説明や個別判断を代替しない。
- 障害や難病を勇気・努力の物語に閉じ込めない。
- 参加型にする場合も「理解が深まったか」を主軸に。

曲ページ末尾に Companion boundary note を必ず表示。

### 6.2 公開ゲート（`Status: public` で通るために必要な条件）

以下が全て埋まっていなければ generator は `public` として扱わず `review` に降格：

- Slug（一意・kebab-case）
- Catchphrase（1–40字）
- Hero visual（public/songs/still 実ファイル）
- Audio public（public/songs/audio 実ファイル）
- Lyrics（既に全曲入力済み）
- Short concept note（120字以上）
- Companion boundary note（120字以上）
- Primary audience

preflight（`scripts/ops/run-public-release-preflight.mjs`）で落ちればビルド中止。

---

## 7. 単独曲ページ構成（共有単位）

上から順：

1. **Hero**: Hero visual を背景 / 曲名大 / Catchphrase 中 / キャンペーンバッジ小 / Release date
2. **Primary CTA**: 「▶ 再生」ボタン（Player Context にこの曲を load + 同キャンペーンをキューに追加 + 再生開始）
3. **Meta strip**: Duration / キャンペーンリンク / ★お気に入りトグル / ♡数（Cloudflare Workers fetch, 失敗時非表示）
4. **Concept note**: Short concept note 全文
5. **Lyrics block**: `<lang="ja">` / コピー可 / 折りたたみ初期展開
6. **Guardrail note**: Companion boundary note
7. **Related rail**: 関連する曲（`Related song slugs`）／関連Resource（`Related resource paths`）／関連キャンペーン
8. **Share bar**: X / Threads / LINE / Facebook / リンクコピー + Web Share API
9. **Tertiary**: 「mp3をダウンロード」（小）＋ CC-BY-NC 表記
10. **JSON-LD** `MusicRecording`（slug, name, inAlbum=キャンペーン名, byArtist=Next Being Lab, url, image, duration）

### 7.1 PageSeo
- title: `『<曲名>』 — <catchphrase> | Next Being Lab`
- description: Short concept note 先頭120字
- path: `/resources/songs/<slug>`
- og:image: `/api/og?type=song&slug=<slug>&v=<buildId>`
- og:audio: `/songs/audio/<slug>.mp3`
- twitter:card: `summary_large_image`

---

## 8. OG画像（Edge Function）

既存 `pages/api/og.tsx` を拡張。`type=song&slug=<slug>` で分岐。

### レイアウト（1200×630）
- 左半面: Hero visual（cover, 輝度を落としたオーバーレイ）
- 右半面: キャンペーン色帯 / 曲名 72px / Catchphrase 32px / 「Next Being Lab」ロゴ小

### キャッシュ
- `Cache-Control: public, max-age=31536000, immutable`
- slug/v=buildId が変わった時だけ再生成 → Vercel Edge 実行回数を最小化

### 検証
Phase 1 公開前に以下3曲で手動確認（Sonnetタスク）：
- https://cards-dev.twitter.com/validator
- https://developers.facebook.com/tools/debug/
- LINEシェアプレビュー（手元端末）

---

## 9. Player アーキテクチャ

### 9.1 Context
`components/songs/PlayerProvider.tsx` を `pages/_app.tsx` でラップ。

state:
- `queue: Song[]`
- `currentIndex: number`
- `isPlaying: boolean`
- `mode: "queue" | "shuffle" | "repeat-one"`
- `position: number`（seconds）

actions:
- `play(song, queueHint?)` — キュー未設定なら単曲、hintあればキュー構築して再生
- `playCampaign(campaignSlug, startSlug?)`
- `playFavorites()`
- `playWeeklyPicks()`
- `next()` / `prev()` / `toggle()` / `seek(s)` / `setMode(m)`

### 9.2 MiniPlayer
- 画面下固定 50px、再生中のみ表示、折りたたみトグルあり
- 表示: スチル / 曲名 / 再生ボタン / 進捗バー / 次へ / キュー展開
- キュー展開パネルで並び替え・削除可（v1.1）
- ルート遷移しても `<audio>` は永続マウント → 音切れなし

### 9.3 Media Session API
メタデータ（title / artist / album / artwork）と handler（play / pause / nexttrack / previoustrack / seekto）を登録。ロック画面・AirPods・Android通知から操作可。

### 9.4 お気に入り
localStorage key `nbl.songs.favorites.v1` = `{ slug: string, addedAt: string }[]`。
- 曲ページ・カードに★ボタン
- `/resources/songs/favorites` で連続再生
- 同ページに「エクスポート」「インポート」（JSON文字列のコピペ）

### 9.5 再生履歴
localStorage key `nbl.songs.history.v1` = `{ slug, playedAt, secondsPlayed }[]`（上限200件、古いものから破棄）。未再生曲レール・Discoverページで使う。

---

## 10. クロスリンク

### 10.1 原則
- ノートに書くのは片方向のみ（song → infographic、song → song）。
- Generator が逆インデックス（`by-infographic.json` など）を作る。

### 10.2 既存Resourceへの差し込み
- インフォグラフィックに `data-infographic-key="invisible-backpack"` を付与（1回）。
- `<RelatedSongsRail infographicKey="invisible-backpack" />` を該当位置に置く。
- 以降、曲を追加するだけで自動で関連曲が並ぶ。

### 10.3 Phase 1 の差し込み対象（最低ライン）
- [pages/resources/invisible-disability.tsx](../../pages/resources/invisible-disability.tsx) — 透明なリュック系インフォグラフィックに「透明なリュック」「見えない荷物のヒーロー」「見えない翼」「見えないからだの天気」を関連付け
- [pages/resources/disability-work-design.tsx](../../pages/resources/disability-work-design.tsx) — 合理的配慮関連の曲
- [pages/resources/work-design-foundations.tsx](../../pages/resources/work-design-foundations.tsx) — インクルーシブ雇用系

Infographic key の一覧は Phase 0 で棚卸しして `docs/nbl-workspace/infographic-key-map-2026-04-24.md` に固定する。

---

## 11. リアクション基盤（Cloudflare Workers + KV）

### 11.1 選定理由
Heron の Vercel 関数枠逼迫を避けるため、リアクションAPIは Vercel の外に出す。Cloudflare Workers + KV は無料枠（読10万/日・書1千/日）で30曲×想定トラフィックに十分。

### 11.2 エンドポイント

Base: `https://reactions.nbl.workers.dev`（最終ドメインは確定時に更新）

| Method | Path | Body / Query | 返却 |
|---|---|---|---|
| POST | `/like` | `{ slug }` | `{ slug, likes }` |
| POST | `/play` | `{ slug }`（30秒継続再生後に1回） | `{ slug, plays }` |
| POST | `/share` | `{ slug, platform }` | `{ slug, shares }` |
| GET | `/get?slug=<slug>` | — | `{ slug, likes, plays, shares }` |
| GET | `/top?metric=likes&limit=5` | — | `[{ slug, value }, ...]` |

### 11.3 アンチスパム
- CORS: `Access-Control-Allow-Origin` は NBL 本番ドメインのみ
- ハート: `HMAC(day|ip|slug)` を KV に `EX 86400` で置き、存在すれば重複として 200 を返す（カウントは増やさない）
- play: 同 IP+slug は10分に1回まで
- 異常連続POST（1秒以上連続して10リクエスト超）はIPを1時間ブロック

### 11.4 KV キー設計
- `song:<slug>:likes` — counter
- `song:<slug>:plays` — counter
- `song:<slug>:shares:<platform>` — counter
- `seen:<day>:<ip_hash>:<slug>` — dedupe（TTL 86400）
- `top:likes`, `top:plays` — JSON（5分キャッシュ、書き込みのたびに洗い替えしない）

### 11.5 クライアント側取得戦略
- **曲ページ**: マウント時に `/get?slug=<slug>` を1回 fetch、以後ページ内遷移では再フェッチしない。
- **index ランキング**: `getStaticProps` 内で `/top?limit=5` を fetch、ISR 30分。
- **いいねボタン押下**: 楽観的UI（+1即反映）→ POST 失敗時はロールバック＋トースト。

### 11.6 フィーチャーフラグ
`NEXT_PUBLIC_REACTIONS_ENABLED=true|false`。false なら ♡・ランキング UI 自体を非表示（API 呼ばない）。Phase 0 / 1 で段階的に有効化可能。

---

## 12. Vercel 使用量 監査・最適化

### 12.1 Phase 0 監査（Sonnetタスク）
1. Vercel Observability で**過去30日の Function Invocations 上位10エンドポイント**を書き出す
2. 同 Bandwidth 上位を書き出す
3. `/api/og.tsx` が Edge runtime か確認 / 未 Edge なら移行
4. `/api/jac-*` の呼び出し頻度を整理、SSGで置き換え可能なものを特定
5. SSR になっている Resource / cases ページが無いか `next build` 出力で確認
6. `next/image` 使用箇所の配信量、プリビルド WebP で置き換え可能な大きな画像を特定
7. 結果を `docs/nbl-workspace/vercel-usage-audit-2026-04-24.md` にまとめる

### 12.2 最適化の打ち手（優先順）
1. `/api/og` に長期 immutable cache を付ける（現状最大の削減候補の可能性）
2. 静的にできる API 呼び出しを SSG + ISR に逃がす
3. 大きい画像を `public/` 直配信に切替（`next/image` 変換回避）
4. Songs のリアクションAPIを Workers に外出し（§11）
5. 既存JAC関連APIの必要性棚卸し → 使われていないものは削除 or gate

### 12.3 受け入れ基準
Phase 2 公開後1週間の **Vercel Function Invocations 総量が Phase 0 監査時点より増えない**こと。守れない場合は Phase 3 を止めて追加最適化。

---

## 13. Phase 分解（Sonnetへの発注単位）

### Phase 0 — 基盤整備（公開せず）
0-1. Vercel 使用量監査（§12.1）
0-2. `lib/types/songs.ts` 型定義
0-3. ノート schema 拡張・テンプレ更新・1曲ドッグフード（`dekiru-joken`）
0-4. `scripts/content/build-songs.mjs`（generator + 逆インデックス + weekly-pick検証）
0-5. `scripts/content/sync-song-assets.mjs`（WAV→MP3 ffmpeg、スチルコピー、欠損チェック）
0-6. `campaigns.yml` / `weekly-pick.yml` の初期ファイル作成
0-7. Cloudflare Workers プロジェクト作成・`/get`+`/top`+`/like` を最小実装・staging ドメインでデプロイ
0-8. `infographic-key-map-2026-04-24.md` 作成

### Phase 1 — 先行公開
1-1. `components/songs/` 実装（Hero, LyricsBlock, RelatedRail, ShareBar, MiniPlayer, FavStar, PlayerProvider, JsonLd）
1-2. `pages/resources/songs/index.tsx`, `campaigns/[campaign].tsx`, `[slug].tsx`, `favorites.tsx`
1-3. `/api/og.tsx` に `type=song` を追加（Edge runtime）
1-4. preflight 拡張（§6.2）
1-5. `pages/resources.tsx` に Songs トラック追加
1-6. Phase 1 公開曲の Catchphrase / Hero visual / Concept note / Boundary note / Audience を埋める（`reasonable-accommodation` 全8 + 他カテゴリ先行1〜2ずつ）
1-7. Workers の `/play`/`/share` を本実装 + 本番ドメイン切替 + フィーチャーフラグ ON
1-8. SNSプレビュー検証3曲（§8）
1-9. 既存Resourceへの `<RelatedSongsRail>` 差し込み（§10.3）

### Phase 2 — 残り17曲一括公開
2-1. 残り曲の必須フィールド埋め
2-2. preflight 通過確認
2-3. 本番反映（1コミット）
2-4. index の「new」フラグを1週間点灯

### Phase 3 — 運用
3-1. 週次ピック更新ルーチン（本人1行更新 → push → ISR反映）
3-2. 月次: Vercel 使用量レビュー + リアクションデータレビュー
3-3. Falcon 開発側と `content/media/songs/generated.json` の import 経路すり合わせ

---

## 14. Falcon 引き継ぎ契約

### 14.1 共有レイヤ（Falcon が import / 読み込みしてよい）
- `content-inbox/songs/` — 正本
- `content/media/songs/*.json` / `*.yml` — 生成物・設定
- `lib/types/songs.ts` — 型
- `public/songs/**` — 配信資産
- `scripts/content/build-songs.mjs` / `sync-song-assets.mjs`
- Cloudflare Workers エンドポイント

### 14.2 共有可能コンポーネント境界
`components/songs/` 配下は以下のルールで書く：

| 部品 | クライアント依存 | Falcon 再利用 |
|---|---|---|
| `SongHero.tsx` | なし | 可（RSCでもOK） |
| `LyricsBlock.tsx` | なし | 可 |
| `RelatedRail.tsx` | なし | 可 |
| `JsonLd.tsx` | なし | 可 |
| `PlayerProvider.tsx` | "use client" | 可（App Routerでも `<ClientBoundary>` 直下に置けば動く） |
| `MiniPlayer.tsx` | "use client" | 可 |
| `FavStar.tsx` | "use client" | 可 |
| `ShareBar.tsx` | "use client"（Web Share API） | 可 |

**原則**: サーバー固有API（`next/headers`等）を `components/songs/` では使わない。データは全て props か context から。

### 14.3 互換維持方針
- `lib/types/songs.ts` の公開 interface は**後方互換変更のみ**許す（フィールド追加OK、削除・意味変更は major 運用とし Falcon 側に通知）。
- Workers エンドポイントは `/v1/` プレフィックス付きで運用（今は未プレフィックスで出してよいが、breaking変更時 `/v2/` に分ける）。

---

## 15. 運用ドキュメント（Sonnetが作る）

- `content-inbox/songs/README.md` を更新（既存を拡張）
  - ノート拡張フィールドの説明
  - 曲追加・カテゴリ追加・音源差し替え手順
  - `Status: hold` の挙動
- `content/media/songs/README.md`（新規）
  - `weekly-pick.yml` 運用手順（week_of 更新 → archive 追加 → commit）
  - `campaigns.yml` 追加手順
- `components/songs/README.md`（新規）
  - 各コンポーネントの入力 props
  - Falcon 再利用時の注意点（"use client" 境界）

---

## 16. Open points（実装中に判定、ブレたら Opus に戻す）

- Workers 本番ドメイン（`reactions.nextbeinglab.com` か `*.workers.dev` か）
- ffmpeg ビットレート（192kbps で高いと判断されたら 160kbps）
- Hero visual がまだ無い曲の**フォールバック方針**（キャンペーン共通デフォルト画像 vs 公開を見送り `review` ステータスに留める）
- Phase 1 の先行曲リスト最終確定（`reasonable-accommodation` 全8 + 他カテゴリから4〜6、合計12〜14曲想定）
