# Step 4 Field Reviews

`Step 4` が representative case では pass していても、実ケースで「一般論に見える」「使いどころが分かりにくい」「根拠の見せ方が弱い」と感じることはある。

このフォルダは、その実ケース評価を brief に取り込むための入力置き場。

## 使い方

- 1 ケースにつき 1 つの Markdown を置く
- 書式は `TEMPLATE.md` を使う
- `verdict` は次の 3 つのどれかにする
  - `usable`
  - `mixed`
  - `needs_revision`
- `sourceHotspots` には、気になった source family をカンマ区切りで書く
  - 例: `canada_duty_to_accommodate, australia_jobaccess_guidance`

## 反映コマンド

- 単体更新: `npm run jac:eval:step4:field`
- evidence brief まで更新: `npm run jac:evidence:brief`
- refresh loop 全体: `npm run jac:evidence:refresh:light`

## ねらい

- Step 4 cleanup を無限に続けず、実ケース評価に軸足を移す
- `どの source family がどのケースで弱かったか` を brief に残す
- 次の source cleanup や ranking 修正を、実ケースに結びつけて決める
