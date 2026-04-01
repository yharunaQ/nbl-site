# External Reality Interface Operating Model

更新日: 2026-03-20
Status: working strategy memo

## Purpose

NBL の AI エージェント運営を、Founder の入力待ちの内向きな loop から、`外の現実世界との継続的な transaction を持つ operating system` に進めるための設計メモ。

この文書で固定したいことは次の 4 つ。

1. `主体性` を、観念ではなく運営上の条件として定義する
2. 外の世界の signal をどう拾い、どう bias を除き、どう意思決定へ変えるかを固定する
3. AI 経営チームと実行チームの新しい役割を追加する
4. 今後 30 日で着手できる最小 safe build を明確にする

## Problem statement

- 現在の NBL は、知識生成、整理、公開素材づくり、運営 loop の設計までは進んでいる
- ただし、現実世界との接点はまだ Founder からの input と feedback に大きく依存している
- そのため、`AI が回している` というより `Founder がキューを出した時だけ進む` 状態に見えやすい
- これは設計思想の問題というより、`external sensing`、`external validation`、`external transaction` の loop がまだ薄いことによる

## Working conclusion

- NBL が主体として立つために必要なのは、`完全自律` ではなく `外界との継続的な相互作用を自力で増やせる仕組み` である
- ここでいう相互作用には、訪問、検索、反応、問い合わせ、返信、面談、紹介、共同設計、継続利用が含まれる
- NBL はまず `AI core + partner edge + human review boundary` のまま、外界との接点だけを厚くするのが現実的である
- 初期の優先順位は `売上` より `signal acquisition -> fit evaluation -> repeated transaction` に置くべきである

## What operational subjecthood means

NBL が `主体として存在する` とは、次の 5 条件がそろうことを指す。

1. 外部 signal を定期的に取得している
2. 取得した signal を、自前の方法論で再整理している
3. その整理結果を public resource、private draft、outreach material に変換している
4. 外部からの反応を再び knowledge と workflow に戻している
5. Founder が毎回起動しなくても、日次・週次でこの loop が回る

## Why current NBL still feels founder-triggered

- `daily snapshot` や `weekly loop report` は整い始めているが、主に内部状態を要約する loop である
- `partner discovery` の骨格はあるが、実名候補と外部 transaction がまだ薄い
- public site はできてきたが、search analytics、reaction、contact tagging、theme-level demand reading がまだ弱い
- 外部の声を拾う lane が `個別の思いつき` と `Founder の観察` に残っている

## Holistic Positioning

- Scope of source:
  - NBL operating model docs
  - partner discovery / business structure docs
  - OpenAI official updates on agent tooling
- Covered lenses:
  - `difficulty_occurrence`
  - `difficulty_resolution`
  - `symptom_work_interaction`
  - `support_need_formation`
- Missing lenses:
  - 実名候補ごとの購買実務
  - 実名候補ごとの response rate
  - 既存 network 以外からの最初の接点形成コスト

## Why naive internet synthesis is dangerous

- 障害や難病をめぐる web 情報には、古い障害概念モデル、 deficit-only framing、 sensational framing、 diagnosis-only generalization が混入している
- 企業側の言説には、`雇えない理由の正当化` や `配慮負担の誇張` が混ざりやすい
- 当事者側の言説にも、特定文脈での切実な経験が universal rule として読まれやすい危険がある
- したがって、`ネット上の本音を大量収集して要約する` だけでは、過去の偏見や差別の再生産につながりうる

## Required interpretation filter

NBL の external listening は、次の filter を通してから knowledge 化する。

### Classification

- `observation`
  - 具体的な出来事、具体的な困りごと、具体的な実践例
- `inference`
  - 観察から導かれた解釈
- `normative`
  - 何が望ましいかという価値判断
- `recommendation`
  - 実際に取る行動提案

### Interaction model

- ICF 的な相互作用モデルを土台にし、`人 / 仕事 / 環境 / 支援 / 時間 / 制度` を分けて読む
- `診断名 -> 支援策` の直結を避け、`症状や特性と仕事・環境の相互作用` として読む
- AI は既存情報をそのまま平均化するのではなく、`批判的・限定的整理 -> 文脈理解による再統合` を行う

### Mandatory context checks

- `person`
- `job`
- `environment`
- `support`
- `time`
- `institution`
- `evidence`

critical context が欠けた signal は、意思決定の根拠ではなく `追加確認が必要な仮説` として扱う。

## External Reality Interface

NBL が外界と接続する lane は、次の 5 層で作る。

### 1. Listening layer

対象:

- 企業の困りごとの言語
- 障害者・難病患者の実際の困りごとの言語
- 支援者・支援機関の operational pain
- 制度変更、研究更新、 accessible technology の変化

主な input:

- official source
- 検索クエリの流入
- YouTube コメント
- SNS / forum / Q&A の公開投稿
- 求人票、採用広報、企業 FAQ
- 支援機関や研究者の公開発信

### 2. Interpretation layer

AI がやること:

- signal を audience 別に整理する
- complaint と structural need を分ける
- partial signal を 4 lenses にマップする
- bias risk を評価する
- `現時点で使える理解` と `まだ危ない一般化` を分ける

### 3. Validation layer

AI がやること:

- 仮説ごとに `どう確かめるか` を設計する
- public resource、mini survey、interview guide、outreach note に落とす
- 反応率、返信内容、滞在、離脱、問い合わせを evidence として回収する

### 4. Transaction layer

初期に transaction として数えるもの:

- resource 経由の訪問
- contact / email / reply
- interview 参加
- design-partner 候補との面談
- 紹介の発生
- 共同企画の打診

後段で transaction として数えるもの:

- startup fee
- recurring workspace
- paid pilot
- co-created resource series

### 5. Compounding layer

すべての反応を、次の 5 つへ戻す。

- artifact
- scorecard
- dossier
- public copy
- partner selection rule

## Recommended new agent roles

### Reality Interface Lead

- 全体の外部接点設計を持つ
- `何を拾い、何を transaction と数え、何を next best round にするか` を固定する

### Market Listening Lead

- 企業、当事者、支援者、研究・政策の signal monitoring を行う
- raw signal を taxonomy に沿って整理する

### Community Signal Lead

- 当事者、難病患者、支援者の lived-experience signal を扱う
- bias / discrimination risk の first gate を持つ

### Validation Ops Lead

- 仮説を `resource test / interview / outreach / landing page` に変える
- 反応を比較可能な evidence に変える

### Partner Outreach Lead

- A1 / A2 / B1 / C1 slot に沿って候補を探す
- short note、brief、boundary note、call guide を準備する

### Chief of Staff

- 各 loop を founder-readable な round readout に閉じる
- Founder には `Yes / No / Name / Keep / Adjust / Stop` だけ返せる形で上げる

## Recommended operating loops

### Daily

- official source の変化確認
- search / contact / content reaction の短い snapshot
- red flag だけを inbox へ上げる

### Weekly

- audience 別 signal digest
- strongest need hypothesis の更新
- next public artifact または next outreach hypothesis を 1 つ決める

### Biweekly

- 1 本の resource test
- 1 本の interview guide
- 1 本の outreach packet refresh

### Monthly

- external transaction review
- A1 / A2 / B1 / C1 pipeline update
- keep / adjust / drop judgment

## First 30 days: minimal safe build

### Days 1-7

- signal taxonomy を固定する
- `企業 / 当事者 / 支援者 / 研究政策` の 4 track を分ける
- raw signal log と synthesis log を分ける

### Days 8-14

- official source watch を recurring 化する
- public web listening のキーワードセットを固定する
- bias / discrimination review template を固定する

### Days 15-21

- audience 別に `本音の need hypothesis` を 3 本ずつ作る
- そのうち public-safe なものを 2 本 resource draft に変える
- `まだ public-safe でないが重要` な論点は hidden review に回す

### Days 22-30

- A1 / A2 / B1 / C1 の候補探索を始める
- 1 本の interview / listening prompt を用意する
- 1 本の partner packet を更新する
- Founder に返すものを `実名候補 1-2 件 + 送付文面採否` まで圧縮する

## What AI can do now

- official source の継続監視
- public web signal の収集と構造化
- bias-aware synthesis
- need hypothesis の生成
- resource / survey / interview / outreach draft の作成
- candidate scorecard / dossier / round readout の整備

## What AI should not claim yet

- `AI だけで市場を理解した` とは言わない
- `個別の雇用判断や合理的配慮判断を自動で返せる` とは言わない
- `ネット上の声 = 現場の真実` とみなさない
- `完全自律経営` を約束しない

## Founder boundary

Founder が持つべきものは、引き続き少なくてよい。

- 実名候補の投入
- 公開上の promise の採否
- 実際の外部送信または最終承認
- high-risk な boundary judgment
- irreversible な partnership decision

## What success would look like in 90 days

- Founder からの初期 input がなくても、weekly に `external signal digest` が出る
- monthly に `next best audience` と `next best artifact` が更新される
- 4 audience track それぞれに reusable signal map がある
- A1 / A2 / B1 / C1 pipeline の少なくとも 2 slot に live candidate が入る
- public resource 経由の inbound と direct outreach 経由の conversation が並行して発生する

## Source notes

### Internal docs

- `docs/nbl-codex-operating-model.md`
- `docs/nbl-business-agent-briefs.md`
- `docs/nbl-workspace/operating-loops-round-2026-03-17.md`
- `docs/nbl-workspace/business-structure-round-2026-03-16.md`
- `docs/nbl-workspace/business-validation-round-2026-03-16.md`
- `docs/nbl-workspace/external-connection-marketing-strategy-2026-03-19.md`
- `docs/nbl-workspace/partner-ops-map-2026-03-17.md`
- `docs/nbl-workspace/partner-discovery-ops-round-2026-03-16.md`

### External official sources

- OpenAI Help Center, `Assistants API (v2) FAQ`, updated 2025-03-11 note on the new Agents platform:
  - https://help.openai.com/en/articles/8550641-assistants-api-v2-faq
- OpenAI, `New tools and features in the Responses API`, published 2025-05-21:
  - https://openai.com/index/new-tools-and-features-in-the-responses-api/
- OpenAI, `Introducing the Codex app`, published 2026-02-02:
  - https://openai.com/index/introducing-the-codex-app/

## Decision-ready note

- NBL の次の進化は、`もっと賢い agent` を足すことではなく、`外界との接点を回す loop` を足すことにある
- その中心は、`market listening`、`bias-aware synthesis`、`fit evaluation`、`partner transaction` の 4 連結である
- Founder の弱みがここにあるなら、なおさら AI team は `外の signal を拾い、比較し、次の打ち手に変える機構` を先に作るべきである
