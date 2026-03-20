# Infographic Intake System

更新日: 2026-03-18
Status: working intake rule

## Working conclusion

`仕様書の紐付け` と `画像内容の分析` は二者択一ではない。

NBL では、次の順で扱うのがよい。

1. `spec-first`
2. `cluster-second`
3. `image-analysis-third`

つまり、仕様書があるものはまず仕様書を正本として結びつける。
その上で、仕様書がないもの、タイトルだけでは意味が取れないもの、複数画像の関係が重要なものだけを画像分析に回す。

## Why this order is better

- 仕様書がある資産は、画像だけより意図・対象・伝えたい論点が正確に取れる
- 画像分析だけで先に進むと、障害・難病・就労支援の文脈で過度な一般化を起こしやすい
- ただし root に散在する PNG 群は仕様書が近くにないことも多く、`cluster` で仮整理しないと活用しづらい

## Three intake lanes

### Lane 1: spec-linked assets

対象:

- 同じフォルダに `仕様書`, `spec`, `docx`, `txt` がある画像群

やること:

- image path を記録する
- spec path を記録する
- spec を正本として `何のための画像か` を1行で残す
- public / review / hold の仮置きを決める

### Lane 2: cluster-linked assets

対象:

- root や `PNG/` に散在し、タイトルだけでは意味が取りにくい画像群
- ただし、複数枚をまとめると主張の流れが見えるもの

やること:

- 画像を `1枚ごと` ではなく `論点クラスター` で束ねる
- `observation / inference / normative / recommendation` を分ける
- NBL サイトのどの stream に入るか仮置きする

### Lane 3: image-analysis-needed assets

対象:

- spec がない
- タイトルが弱い
- cluster に置いても意味が曖昧

やること:

- 画像の構図、テキスト、矢印、比較対象を読み取る
- 仮タイトルと仮要約を付ける
- 必要なら後で人間確認に戻す

## Minimum registry fields

各画像またはクラスターについて、最低でも次を持つ。

- asset path
- working title
- cluster
- spec path
- observation
- inference
- normative claim
- recommendation
- covered lenses: person / job / environment / support / time / institution
- missing lenses
- risk level
- proposed stream: What We Do / Methods / Resources / Vision / Operating Model / Hold
- next action

## Risk rule

障害・難病・就労支援の画像は、画像の印象だけで universal claim にしない。

特に次は high risk。

- diagnosis-only conclusion
- 日本制度の制約を飛ばして一般化
- 当事者理解画像をそのまま policy claim に変換
- 企業責任だけ / 本人責任だけ の片寄った読み

## Immediate use

- まず `content-review/infographic-inventory/asset-registry-template.md` を基準にする
- つぎに、今回 Founder が挙げた 9 枚を `cluster-linked assets` の最初の見本にする
- その後、近接フォルダに仕様書があるシリーズから lane 1 を広げる
