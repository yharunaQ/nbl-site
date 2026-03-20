# NBL Publication Gate

更新日: 2026-03-20

## 目的

NBL の public サイトに出すものと、まだ出さないものを分ける。

## 判定カテゴリ

### `public_now`

次をすべて満たす。

- 対象読者が明確
- offer / 内容 / CTA が実在し、現在提供可能
- draft や `(仮)` のままではない
- missing asset がない
- internal note や構想メモではない
- 障害・難病就労支援の記述が過度に一般化されていない

### `public_after_rewrite`

- 出す価値はある
- ただし public 向けの文脈、言葉、証拠の置き方に直しが必要

### `internal_only`

- 研究素材
- raw note
- 実験設計
- 仮説メモ
- governance / lab の内部議論
- public へ約束する内容としては未成熟なもの

### `hold`

- 方向性が未決定
- 資料未整備
- offer が未成立
- 表現リスクが高い
- 現時点で public に出すと誤解を招きやすい

## Review と Public を分ける

- 内部確認用の page と、外部公開する page は同じ URL にしない
- `pages/review/` は founder feedback と内部検討のための面として維持する
- public top や public main lane から `/review/` へ直接つながない
- public page に `docs/nbl-workspace`、`content-review/`、internal memo 的な導線を出さない

## External-Eye Gate

外部公開前は、`外部の目` で次を止める責任を AI 側の release gate が持つ。

- public route から `/review/` へ飛ばしていないか
- public HTML に internal path や review label が出ていないか
- 内部確認用に便利な説明が、そのまま public に漏れていないか
- `Founder がコメントするための面` と `外部へ約束する面` が混ざっていないか

## 障害・難病就労支援コンテンツの追加チェック

各候補について、最低限これを確認する。

### 1. 主張の型を分ける

- `observation`: 何が観察されたか
- `inference`: そこから何を読み取っているか
- `normative`: 何を重視すべきだとしているか
- `recommendation`: 何を行動として勧めるか

1 つの観察や 1 つの事例を、普遍的事実として扱わない。

### 2. 文脈不足を確認する

次の文脈が抜けていたら、強い言い切りをしない。

- `person`
- `job`
- `environment`
- `support`
- `time`
- `institution`
- `evidence`

### 3. 差別・偏見リスクを確認する

次のいずれかがある場合、`hold` か `rewrite` に回す。

- 診断名だけで結論づけている
- 当事者の強みや環境条件が消えている
- 個別配慮を一般論の処方箋として出している
- 法制度と職場運用を混同している

## 今のリポジトリで優先 review する候補

以下は自動公開ではなく、先に review する。

- `(仮)` を含む service 名や認定名
- price / plan / PoC 募集に見える表現
- alpha / beta / trial の public 導線
- guidebook draft や docs 直リンク
- lab / experiment / governance 系の public 表示

これは「必ず消す」という意味ではなく、「経営判断なしでは public truth にしない」という意味。

## AI 運営モデルの追加チェック

AI チームで運営する前提なら、以下を public copy に反映する。

1. 運営主体が AI チームであることが分かるか
2. 人が常時対応する窓口のような誤読を生まないか
3. AI が担う範囲と、まだ担えない範囲が曖昧になっていないか
4. intake / 提案 / 叩き台生成 / 資源整理など、実際にできることだけを書いているか

## 公開前の最終質問

各ページについて、公開前にこれだけは答える。

1. このページは誰のためのページか
2. このページを見た人に、次に何をしてほしいか
3. 今この時点で、約束できる内容だけになっているか
4. 表現が過度に広すぎたり、断定的すぎたりしないか
5. missing asset や仮置きの導線が残っていないか
