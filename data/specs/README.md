# Data Specs

このディレクトリは、original data そのものではなく、original data を安全に再利用するための仕様資産を置く。

ここに置くもの:

- source manifest
- response type map
- canonical concept map
- supporter-side schema
- 生成スクリプトで再作成できる安全な spec

ここに置かないもの:

- 回答原文
- 元 Excel / PDF / Markdown の機微データ本体
- 匿名化前の自由記述抜粋

## ディレクトリ

```text
data/specs/
  README.md
  source-manifests/
  response-type-maps/
  canonical-maps/
  supporter-patterns/
```

## 運用原則

- `source-manifests/` は source の役割と取扱い条件を固定する
- `response-type-maps/` は analysis-ready 変換前の意味型を固定する
- `canonical-maps/` は dataset 間の共通概念と非同値部分を固定する
- `supporter-patterns/` は支援者側の連携・実装条件モデルを固定する

## 更新方法

workbook や補助資料が追加されたら、まず次を更新する。

1. `source-manifests/`
2. `response-type-maps/`
3. 必要なら `canonical-maps/` と `supporter-patterns/`

初期生成は次のスクリプトを使う。

```bash
python3 scripts/data_foundation/build_fchma_data_specs.py
```

このスクリプトは安全な spec のみを書き出し、機微データ本文は保存しない。
