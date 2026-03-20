# Inbox Snapshot

更新日: 2026-03-15

## Observation

- `content-inbox` には、画像・動画・仕様書・編集プロジェクトが混在している。
- 拡張子ベースの概数:
  - `png`: 115
  - `txt`: 20
  - `prproj`: 17
  - `mp4`: 16
  - `psd`: 8
  - `docx`: 6
  - `pdf`: 3
  - `pptx`: 1
  - `mp3`: 1
- 主要なかたまり:
  - `content-inbox/インフォグラフィック`
  - `content-inbox/PNG`
  - `content-inbox/難病コミック４コマ`
- `難病コミック４コマ` 配下には、画像だけでなく `mp4`、`prproj`、`psd`、`txt`、`docx`、`pdf` が含まれている。
- YouTube リンクそのものは、まだ一覧化されていない。

## Inference

- 現在の inbox は「Web ページ本文の候補群」より、「NBL のメディアアーカイブ兼制作途中の素材群」に近い。
- 今後の公開設計では、トップページの説明文だけでなく、`インフォグラフィック / 動画 / 解説記事 / 研究資料` を分けて扱う必要がありそう。
- 動画はローカル素材と公開済み YouTube を分けて管理しないと、サイト導線設計で混線しやすい。

## Recommendation

- YouTube は `content-inbox/youtube-links.md` で URL ベースに管理する。
- まずは素材単位ではなく「シリーズ単位」で inventory を切る。
- 初回の公開設計では、以下を候補シリーズとして扱う。
  - インフォグラフィック群
  - 難病コミック4コマ群
  - 就労支援・合理的配慮の図解群
  - 年末まとめや総括系ビジュアル

## Immediate next actions

1. YouTube 動画の URL を `content-inbox/youtube-links.md` に追加する
2. `docs/nbl-workspace/content-inventory.md` に、シリーズ単位の行を増やす
3. 各シリーズを `public_now / public_after_rewrite / internal_only / hold` に仮置きする
