# Data Workspace Guide

このディレクトリは、`references/` と役割を分けるための作業ガイドである。

## 原則

- `references/` は公開可能または再生成可能な派生物を置く
- `data/` は original data の整理と分析準備の作業場所を定義する
- 機微性のある original data は Git に入れない
- original data の正本は、repo ではなく安全なローカル保管または DB / encrypted storage に置く

## 推奨レイヤ

```text
data/
  README.md
  templates/
    original-source-manifest.template.json
    analysis-ready-manifest.template.json

  original_secure/              # Git には入れない
    structured/
      employment_survey_3000/
      nanbyo_survey_4000/
      supporter_practice/
    unstructured/
      manuals/
      casebooks/
      support_guides/
    manifests/

  staging/                      # Git には入れない
    normalized/
    anonymized/
    dictionaries/
    joins/

  analysis_ready/               # Git には入れない
    tabular/
    narrative_units/
    embeddings/
    graph_inputs/
    manifold_inputs/

  local_cache/                  # Git には入れない
    batch_runs/
    api_responses/
    content_hashes/
```

## まず置くべきもの

### 1. `structured/employment_survey_3000/`

この 3000 名規模アンケートは、構造化データの主柱として扱う。

最低限そろえるもの:

- 元ファイル
- 変数表
- 設問票
- 欠損値や特殊コードの説明
- 自由記述列の対応表
- source manifest

### 2. `structured/nanbyo_survey_4000/`

この 4000 名規模アンケートは別 dataset として保持する。
調査項目が微妙に違うため、無理に最初から 1 つの表へ寄せず、まずは `別 dataset` として正本を保つ。

最低限そろえるもの:

- 元ファイル
- 変数表
- 設問票
- employment survey との差分メモ
- 自由記述列の対応表
- source manifest

### 3. `structured/supporter_practice/`

支援者データは `利用者支援の実情` を補う重要な original data として別格に置く。

最低限そろえるもの:

- 元ファイル
- 項目定義
- 利用文脈メモ
- source manifest

## 再整理の順番

1. 元ファイルと設問票、変数表を dataset 単位で集める
2. 各 dataset に `source manifest` を付ける
3. 変数名を変えずに `raw snapshot` を保管する
4. staging で匿名化、欠損値整理、コード表の正規化を行う
5. analysis_ready で共通 schema を作る
6. manifold や類似検索は `analysis_ready` から始める

## 重要な分離

### 正本

- 元アンケートファイル
- 自由記述原文
- 元コード表
- 設問票

### 派生物

- 匿名化済みテーブル
- narrative unit 分割
- embeddings
- graph input
- manifold input
- 可視化やクラスタ結果

`references/` に移すのはこの `派生物` 側に限るのが安全。

## manifold 分析の考え方

manifold 分析そのものは必ずしも高価な LLM API を必要としない。
高コストになりやすいのは、自由記述を分析用表現へ変換するところである。

推奨方針:

- 先に tabular 部分だけで manifold を試す
- 自由記述は全文を毎回処理せず、分割と content hash を先に作る
- embeddings は変更分だけ再計算する
- 高価な LLM は曖昧な narrative の再解釈に限定する

## dataset ごとの最初の deliverable

各 dataset について、まず次の 1 セットを作る。

- `source_manifest.json`
- `questionnaire.pdf` または設問票コピー
- `data_dictionary.csv` または相当資料
- `dataset_notes.md`

これが揃うと、あとで ingest script を作りやすい。
