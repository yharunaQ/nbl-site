# Value Compounding Operating System

更新日: 2026-03-17
Status: hidden review operating design

## Why this round exists

NBL の成否を `単月収益` だけで見ると、初期の本質を見失いやすい。

NBL は相談件数 business ではなく、AI運営によって artifact、loop、trust、distribution、revenue capacity を複利で増やす `社会OS事業` として設計しているため、先に複利の立ち上がりを測る operating design が必要になる。

## Working conclusion

NBL が見るべきものは、次の順である。

1. artifact compounding
2. loop compounding
3. trust compounding
4. distribution compounding
5. revenue capacity compounding
6. revenue itself

収益は重要だが、初期は `複利の最後に出てくるもの` と見る方が自然。

## Founder role

Founder は `毎回の round を回す人` ではなく、`不可逆性を引き受ける人` として位置づける。

### Founder が持つ

- public に本当に約束すること
- 外部連絡と実名候補
- 思想や経営判断として採る / 捨てるの最終判断
- 高リスク境界と human review boundary
- NBL の器自体を続けるかどうか

### AI が持つ

- round の下準備
- 比較表、scorecard、tracker
- hidden review page
- draft copy
- snapshot と monitoring の生成

## Minimum required Founder actions

Founder は `常時関与` する必要はない。
必要なのは、次の最小限だけ。

### 随時 / 呼ばれたときだけ

- `進める / 止める / 誰にする` を短く返す
- 対象:
  - public promise
  - 外部連絡
  - 実名候補
  - 高リスク境界

### 週1回 15-20分

- weekly loop report の赤信号だけを見る
- 赤信号がなければ何もしなくてよい

### 月1回 30-45分

- compounding dashboard を見て `continue / adjust / stop` を決める

### 四半期ごと 60分

- NBL の器自体を続けるか
- Horizon 1 / Horizon 2 の比重を変えるか
- より上位の基盤に吸収されるならどう縮退するか

## Cadence

### Daily

- operating snapshot
- blocked items
- next best round

### Weekly

- 5 loop review
- PDCA memo
- priority reset

### Monthly

- compounding dashboard
- continue / adjust / stop judgment

### Quarterly

- horizon rebalance
- operating structure review
- NBL の器自体の必要性の再評価

## Metrics by stage

### 0-6週間

- artifact 数 / 週
- Founder 1時間あたりの成果物数
- Founder トリガーなしで進んだ round 比率
- 再利用 asset 数

### 6-12週間

- 既存部品の再利用率
- 公開資源 -> 次の対話 の発生数
- shared shell 利用率
- decision log 追加数

### 3-6か月

- 有望 conversation 数
- A1 / A2 / B1 / C1 pipeline の進捗
- 再訪する相手の数
- 公開資源経由の inbound

### 6-12か月

- revenue / Founder hour
- recurring へ移行した相手の数
- AIツール費に対する売上倍率
- 1 revenue event から再利用された artifact 数

## Decision rule

### Keep going even if revenue is still tiny when

- reusable asset が増えている
- Founder 関与あたりの output が増えている
- public resource からの inbound が増えている
- recurring につながる conversation quality が上がっている

### Re-evaluate even if revenue appears when

- 毎回ゼロから作っている
- artifact が残らない
- Founder が daily operator に戻っている
- 単発案件だけが増えている

## AGI / ASI posture

NBL は自己保存を最優先にする必要はない。

もし AGI / ASI 時代に、NBL の個別事業としての器が不要になっても、

- participation design
- boundary design
- method stewardship
- reusable social OS parts

が残るなら、それは成功に含めてよい。

つまり、NBL の goal は `会社を永続させること` ではなく、`価値が生み出され続ける構造を残すこと` に置く。

## Immediate next use

- `/review/value-compounding` を Founder 向け operating dashboard の基準ページにする
- `NBL-EXECUTIVE-START-HERE.md` から参照できるようにする
- 将来の automation は、この cadence をそのまま recurring task に落とす
