# Infographic Key Map — 2026-04-24

インフォグラフィックへのキー（slug）と、対応するリソースページ・画像ファイル・候補曲の一覧。
`campaign-song-note.md` の `Related infographic keys:` に書くのはここの「Key」欄の値。
コードで参照するのは `data-infographic-key="<key>"` 属性と `<RelatedSongsRail infographicKey="<key>" />`。

## visible-disability シリーズ (`/resources/invisible-disability`)

| Key | Image file | 日本語タイトル | 候補曲（slug） |
|---|---|---|---|
| `common-overview` | invisible-disability/common-overview.png | 見えない障害・難病の全体像 | — |
| `internal-weather` | invisible-disability/internal-weather.png | からだの天気（体調変動） | `karada-no-tenki-yoho`, `mienai-karada-no-tenki` |
| `invisible-backpack` | invisible-disability/invisible-backpack.png | 透明なリュック（見えない荷物） | `tomei-na-ryukku`, `mienai-nimotsu-no-hero`, `mienai-tsubasa` |
| `work-friction` | invisible-disability/work-friction.png | 就労の摩擦ポイント | `mienai-nimotsu-no-hero`, `ganbari-yori-sekkei` |
| `explanation-burden` | invisible-disability/explanation-burden.png | 説明コスト・開示の負担 | `mienai-tsubasa`, `hito-ga-saki` |
| `medical-care-is-work` | invisible-disability/medical-care-is-work.png | 通院・治療も仕事 | `seido-wa-hito-wo-tomenai`, `tsunagu-hikari` |
| `energy-wave` | invisible-disability/energy-wave.png | エネルギー波（体調の波） | `condition-switch`, `mienai-karada-no-tenki` |
| `support-friction` | invisible-disability/support-friction.png | 支援の摩擦・ミスマッチ | `ganbari-yori-sekkei`, `aizu-wa-warai-da` |
| `nanbyo-first-principles` | invisible-disability/nanbyo-work-support-first-principles.png | 難病就労支援の原則 | `tsunagu-hikari`, `mae-ni-susumenai-mama-de` |

## 障害者雇用設計シリーズ (`/resources/disability-work-design`)

| Key | Image file | 日本語タイトル | 候補曲（slug） |
|---|---|---|---|
| `visual-impairment` | disability-work-design/visual-impairment.png | 視覚障害と就労設計 | — |
| `hearing-impairment` | disability-work-design/hearing-impairment.png | 聴覚障害と就労設計 | — |
| `physical-disability` | disability-work-design/physical-disability.png | 肢体障害と就労設計 | — |
| `internal-disability` | disability-work-design/internal-disability.png | 内部障害と就労設計 | `karada-no-tenki-yoho`, `mienai-karada-no-tenki` |
| `intellectual-disability` | disability-work-design/intellectual-disability.png | 知的障害と就労設計 | — |
| `neurodiversity` | disability-work-design/neurodiversity.png | 発達障害・ニューロダイバーシティ | `chigai-wo-chikara-ni`, `sore-wa-shitsu-janai` |
| `mental-health` | disability-work-design/mental-health.png | 精神障害・メンタルヘルスと就労 | `ganbari-yori-sekkei`, `sore-wa-shitsu-janai` |
| `developmental-disability` | disability-work-design/developmental-disability.png | 発達障害の職場設計 | `chigai-wo-chikara-ni` |
| `acquired-brain-injury` | disability-work-design/acquired-brain-injury.png | 高次脳機能障害と就労 | — |
| `intractable-disease` | disability-work-design/intractable-disease.png | 難病と就労設計 | `karada-no-tenki-yoho`, `mienai-karada-no-tenki`, `mae-ni-susumenai-mama-de` |
| `mental-health-ips` | disability-work-design/mental-health-ips.png | IPSモデル・精神障害就労 | `ganbari-yori-sekkei` |

## 就労支援の変革シリーズ (`/resources/work-support-transformation`)

| Key | Image file | 日本語タイトル | 候補曲（slug） |
|---|---|---|---|
| `inclusive-employment` | work-support-transformation/inclusive-employment.png | インクルーシブ雇用の全体像 | `light-me-up`, `work-of-tomorrow`, `tomo-ni-tsukuru-mirai` |
| `global-three-layers` | work-support-transformation/global-three-layers.png | 国際比較・3層モデル | `work-of-tomorrow` |
| `japan-vs-world` | work-support-transformation/japan-vs-world.png | 日本と世界の就労支援比較 | `work-of-tomorrow` |
| `chronic-illness-trends` | work-support-transformation/chronic-illness-trends.png | 慢性疾患・治療就労両立の動向 | `balance-treatment-work-song`, `tsunagu-hikari` |
| `balance-treatment-work` | work-support-transformation/balance-treatment-work.png | 治療と仕事の両立 | `tsunagu-hikari`, `condition-switch` |
| `employment-frame` | work-support-transformation/employment-frame.png | 就労支援のフレーム | `seido-wa-hito-wo-tomenai` |
| `foundational-training` | work-support-tomorrow/foundational-training.png | 基礎的職業訓練 | — |
| `job-choice-support` | work-support-transformation/job-choice-support.png | 職業選択支援 | `career-wo-tomenai` |
| `employment-normalization` | work-support-transformation/employment-normalization.png | 就労の社会的位置付け | `hito-ga-saki` |
| `work-design-foundations` | work-design-foundations (series) | 就労支援の基礎概念 | `kagayaki-no-switch`, `return-is-smile` |

---

## Phase 1 で差し込む優先インフォグラフィック

以下のキーを持つページに、まず `<RelatedSongsRail>` を差し込む。

| Priority | Key | Resource page | 候補曲（公開時点で slug 確定次第） |
|---|---|---|---|
| 1 | `invisible-backpack` | /resources/invisible-disability | 透明なリュック, 見えない荷物のヒーロー, 見えない翼 |
| 2 | `internal-weather` | /resources/invisible-disability | からだの天気予報, 見えないからだの天気 |
| 3 | `reasonable-accommodation-design`* | /resources/disability-work-design | DE・KI・RU ジョーケン, コンディション・スイッチ, リターンは笑顔 |
| 4 | `inclusive-employment` | /resources/work-support-transformation | Light Me Up, Work of Tomorrow |
| 5 | `mental-health` | /resources/disability-work-design | がんばりより設計, それは「質」じゃない |

*`reasonable-accommodation-design` は現時点でインフォグラフィック画像が存在しないが、新規制作が予定される場合に追加予定。既存ページに対応画像がなければ `RelatedSongsRail` のみ表示するセクションとして追加する。

---

## 管理ルール

- このファイルは人間が管理する（generatorは触らない）
- 新インフォグラフィックが公開されたらこの表に追加する
- 曲の slug が確定したら「候補曲」欄を更新する
- `campaign-song-note.md` への `Related infographic keys:` 記入時はここのKeyを使う
- 実装時には `data-infographic-key="<key>"` 属性をインフォグラフィックの親要素に付与する
