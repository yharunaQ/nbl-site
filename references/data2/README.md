# data2 layout (JAC)

`data2` は継続追加を前提に、次の3層で運用します。

## 1) Raw (`raw/`)
- 追記専用の原本。
- 追加データは原則ここに置く。
- 現在の入力ディレクトリ:
  - `raw/chishikiOut`
  - `raw/kijutsuOut`

注: 互換性のため、`chishikiOut` / `kijutsuOut` (legacy) も入力候補として扱う。

## 2) Sanitized (`sanitized/`)
- JAC投入前に匿名化・因果再整理した生成物。
- `npm run jac:data2:prepare` で再生成。
- 出力:
  - `sanitized/chishiki`
  - `sanitized/kijutsu`

## 3) Index (`index/`)
- JACが参照する統合インデックス。
- `npm run jac:data2:index` で再生成。
- 出力:
  - `index/data2-knowledge-index.json`

## 推奨更新フロー
1. raw に新規データを追加
2. `npm run jac:data2:refresh` を実行
3. 失敗が無ければJACに反映

`jac:data2:refresh` は以下を連続実行:
- `jac:data2:prepare`
- `jac:data2:audit:enforce`
- `jac:data2:index`

## 品質ゲート

`npm run jac:quality:gate` を使うと、data2再生成整合・タグ評価・型検査を一括実行できる。

生成物のクリーン状態まで検証したい場合は `npm run jac:quality:gate:strict` を使う。
