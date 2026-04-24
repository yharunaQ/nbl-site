# Songs Inbox

## Purpose

このフォルダは、NBL の campaign lane 候補となる song 素材の整理棚。

初回公開単位は、原則として次の 4 点を 1 セットで考える。

1. song
2. still visual
3. short concept note
4. boundary note

## Current Rule

- song 単体を制度解説や支援案内の代替にはしない
- 1 曲 1 場面 1 行動刺激で整理する
- 企業 / 当事者 / 支援者 / 一般の audience を混ぜすぎない
- 各曲フォルダの `campaign-song-note.md` を正本にする

## Suggested workflow

1. 各曲フォルダの `campaign-song-note.md` を埋める
2. `npm run songs:refresh` で tracker と companion map を更新する
3. `campaign-song-tracker.md` と `song-infographic-candidate-map-latest.md` で未記入箇所と infographic 候補を確認する
4. `song-video-overlap-map-latest.md` で YouTube との役割分担を確認する
5. 公開ゲートを通るには以下が必要: Slug / Catchphrase / Hero visual / Audio / Short concept note / Companion boundary note / Primary audience
6. `Status: public` にして `npm run songs:build` を走らせ、preflight で確認

## 曲の追加

1. `content-inbox/songs/<キャンペーン>/<タイトル>/` を作成
2. 下記テンプレで `campaign-song-note.md` を作成。**Slug は必須・全曲一意**
3. 音源 WAV を同フォルダに置く
4. `npm run songs:refresh` でtracker更新・欠損確認

## カテゴリの追加

1. `content-inbox/songs/<新キャンペーン>/` フォルダを作る
2. `content/media/songs/campaigns.yml` に slug / title_ja / headline / summary / tone_color を追加
3. `lib/types/songs.ts` の `CampaignSlug` 型に追加

## 音源の差し替え

1. 同フォルダで旧WAVを削除 → 新WAVを置く（ファイル名は何でもよい）
2. ノートの `- Audio source:` 欄を新ファイル名に更新
3. `npm run songs:sync` で `public/songs/audio/<slug>.mp3` を再生成

## campaign-song-note.md テンプレ

```markdown
# Campaign Song Memo

## Basic Info

- Campaign: <キャンペーン日本語名>
- Title: <曲名>
- Folder: `content-inbox/songs/<キャンペーン>/<タイトル>`
- Audio files:
  - `<filename>.wav`
- Status: inbox

## Publishing

- Slug:                              # 必須・kebab-case ASCII・全曲一意
- Status: inbox                      # inbox | review | public | hold
- Catchphrase:                       # 1–40字
- Release date:                      # YYYY-MM-DD
- Duration:                          # 例: 3:12

## Assets (web)

- Audio source:                      # 同フォルダ内のWAVファイル名
- Hero visual:                       # songs/still/<slug>.jpg
- Lyric card (optional):             # songs/lyric-card/<slug>.jpg
- YouTube id:

## Campaign Intent

- Primary audience:
- Secondary audience:
- Campaign purpose:
- One scene / one action stimulus:
- Short concept note (120-200 chars):

## Cross-links

- Related song slugs:                # slug-a, slug-b
- Related campaigns:                 # reasonable-accommodation 等
- Related resource paths:            # /resources/invisible-disability
- Related infographic keys:          # invisible-backpack 等

## Share copy

- X (140字以内):
- Threads (200字以内):
- LINE (120字以内):

## Lyrics

\`\`\`text
（歌詞）
\`\`\`

## Related Assets

- Related infographic:
- Still visual / cover art:
- Companion boundary note:
- Related links:

## Guardrails

- What this song can convey:
- What this song should not replace:
- Bias / misunderstanding risk:
- Additional context needed:

## Notes

- Feedback:
- Revision log:
```

## Related docs

- `docs/nbl-workspace/songs-release-spec-2026-04-24.md`
- `docs/nbl-workspace/campaign-lane-brief-2026-03-18.md`
- `docs/nbl-workspace/decision-log.md`
- `content-inbox/songs/campaign-song-theme-clusters-2026-03-19.md`
- `docs/nbl-workspace/song-crossmedia-rollout-2026-03-19.md`
- `content/media/songs/campaigns.yml`
- `content/media/songs/weekly-pick.yml`
