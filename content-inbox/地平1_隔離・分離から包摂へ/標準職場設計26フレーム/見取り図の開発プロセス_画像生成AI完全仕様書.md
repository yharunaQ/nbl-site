# 仕事設計の見取り図 開発プロセス 画像生成AI完全仕様書

更新日: 2026-03-20
用途: 画像生成AIにそのまま渡して制作を始めるための完全仕様
推奨配置: `content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム`
関連資料:
- `見取り図の開発プロセス_インフォグラフィック仕様書.md`
- `docs/nbl-workspace/mitorizu-development-summary-2026-03-20.md`

## 1. まず最初に渡す指示

あなたは、NBL の public-safe な社会課題インフォグラフィックを作るアートディレクター兼情報デザイナーです。
テーマは `仕事設計の見取り図が、単なる思いつきではなく、公開知識、調査データ、実務記述を AI で横断整理している一方で、古い障害観や診断決め打ちをそのまま再生産せず、ICFに基づく相互作用モデルで批判的に読み替えた上で、監査しながら単純化した地図であること` を伝えることです。

狙いは、`AIすごい` を煽ることではなく、`複雑な情報を、対話の入口として使える地図にしている` と伝えることです。
同時に、`既存の偏見や差別をそのまま集約しているのではない` と伝えることです。
企業の意思決定者、人事、管理職、産業保健、支援者、研究・政策関係者が読者です。

ビジュアルは `研究メモ` ではなく `信頼できる設計図` に見せてください。
誇張、SF感、サイバー感、派手な未来演出、AI神話的表現は避けてください。

## 2. この図の完成イメージ

### 図の役割

- 単なる発想メモではない
- 多様な情報を AI で横断整理している
- 古い障害観や診断決め打ちを、そのまま再生産しない
- ICFベースの相互作用モデルで批判的に整理している
- 監査しながら 3レイヤーと26フレームへ単純化している
- 26フレームだけで個別判断をするのではない
- 将来の個別AI整理や human review につながる土台である

### 読後感

- `考え抜かれている`
- `複雑さを減らしてくれている`
- `でも、雑に単純化していない`
- `偏見の再生産を避けようとしている`
- `この先に個別整理がある`

## 3. 推奨生成モード

### 推奨モード A

`文字は最小限、本文は後から載せる前提のベース画像` を生成する。

理由:

- 日本語の長文は画像生成AIで崩れやすい
- 数値やセクション見出しだけなら比較的安定する
- サイト掲載や修正がしやすい

このモードでは、画像生成AIには

- 大見出し
- 数字
- 短いラベル
- セクション枠

だけを入れさせる。

### 代替モード B

`文字込み完成ポスター` を直接生成する。

条件:

- モデルが日本語テキストに比較的強い
- 出力を小さな修正だけで使いたい

ただし長文は崩れやすいので、本文は 1 セクション 1〜2 行までに抑える。

## 4. キャンバス仕様

### マスター

- サイズ: `1600 x 2400 px`
- 向き: 縦
- アスペクト比: `2:3`
- 背景: 明るいオフホワイト基調

### 派生

- サイト本文用: `1600 x 2000 px`
- SNS横長予告用: `1920 x 1080 px`

### セーフエリア

- 外周余白: 各辺 `96 px`
- 文字ブロックの内側余白: `32 px`
- セクション間ギャップ: `32 px`

## 5. デザイン方針

### 禁止したい見た目

- ネオン
- 紫中心
- ブラック背景
- 脳回路やロボット顔の AI 記号
- 宇宙、未来都市、ホログラム過多
- 感動広告風の人物写真メイン
- 医療ポスター風の病名中心表現

### 目指す見た目

- 情報設計図
- 研究と実務の橋渡し
- 信頼できる public explainer
- 企業読者が引かない落ち着いた画面
- 既存の `jac-foundations` ページに馴染む明るい色調

## 6. 色指定

### ベース

- 背景: `#F8FAFC`
- カード背景: `#FFFFFF`
- 境界線: `#CBD5E1`
- 本文: `#0F172A`
- 補助文字: `#475569`

### 機能色

- source 群: `#E2E8F0`
- AI整理ブロック: `#E0F2FE`
- 3レイヤー:
  - 体調: `#CCFBF1`
  - 就職移行: `#FEF3C7`
  - 職場運用: `#FCE7F3`
- 監査/ガードレール: `#E0E7FF`
- bridge / next step: `#DCFCE7`

### 強調色

- sky accent: `#0284C7`
- indigo accent: `#4F46E5`
- emerald accent: `#059669`
- amber accent: `#D97706`

## 7. タイポグラフィ方針

### 英数字

- 端正で読みやすい sans-serif
- 数値は太め

### 日本語

- 堅すぎないが信用感のある sans-serif

### 文字量ルール

- 1 ブロック 35〜55 文字程度まで
- 細かな説明文は画像に焼き込みすぎない
- 長文は後置き前提でスペースを残す

## 8. レイアウトの完成構図

全体は `上から下へ流れる 6 段構成`。
読み順がひと目で分かるよう、矢印または緩い縦導線を持たせる。

### 第1段: タイトル + 問い

目的:
- この図が `何を説明するか` を即座に伝える

構成:
- 左上: eyebrow
- 中央: 大見出し
- その下: 1〜2行の短い説明

表示テキスト:

- eyebrow: `仕事設計の見取り図`
- title: `この地図は、どう開発されてきたか`
- subtitle:
  `公開知識、調査データ、実務の声を AI で横断整理し、`
  `監査しながら 3レイヤーと26フレームへ単純化した入口です。`

### 第2段: 入力ソース群

目的:
- 多様な情報を材料にしていることを可視化する

構成:
- 左右または放射状に 6 つの source box
- 中央の AI整理ブロックへ矢印を集約

source box ラベル:

- `公開知識`
- `調査データ`
- `実務記述`
- `経験の断片`
- `GLM 関係`
- `編集ガイド`

source box の小さな補助数値:

- `52 類型`
- `1076 課題行`
- `201 件`
- `4914 件`
- `539 関連`

注意:
- すべての数値を各 box に散らす必要はない
- 画面がうるさければ、5つの主要数値を別の stats row に分離してよい

### 第3段: 批判的フィルタ + ICFベース整理

目的:
- 既存情報をそのまま再利用していないことを見せる

中央ブロックのラベル:

- header: `批判的フィルタ`
- subheader: `ICFベースの相互作用モデル`
- subpoints:
  - `古い障害観をそのまま使わない`
  - `診断決め打ちを避ける`
  - `条件 × 業務 × 運用で読み替える`

見た目:
- source box の下流に、やや細長い `filter / reinterpretation` ブロックを置く
- 危険物マークではなく、`選別 / 再解釈 / lens` の印象

### 第4段: AI による再統合

目的:
- AI がしていることを誇張なく見せる

中央ブロックのラベル:

- header: `AI による再統合`
- subpoints:
  - `別々の資料を横断して読む`
  - `重なる課題をまとめる`
  - `近いが違う課題を分ける`
  - `条件軸を残したまま単純化する`

見た目:
- 1つの大きな整理ハブ
- filter ブロックから矢印が集まり、右側または下側へ出力する
- 回路や脳ではなく、`整理テーブル` や `routing hub` の印象

### 第5段: 出力としての 3レイヤー + 26フレーム

目的:
- 単純化の結果が `3レイヤーと26フレーム` であると伝える

構成:
- 3つの色分けされたレイヤーカード
- その近くに `26フレーム` の大きな数字

表示テキスト:

- section title: `最初の対話で使える地図へ`
- layer 1: `体調レイヤー`
- layer 2: `就職移行レイヤー`
- layer 3: `職場運用レイヤー`
- big number: `26フレーム`

補助文:

- `複雑な現実を、最初の対話で使える単位まで絞る`

### 第6段: 監査と境界

目的:
- 単純化が雑ではないことを示す

構成:
- shield 風の監査エリア
- 3〜5 項目のチェック

表示テキスト:

- section title: `単純化の前後で点検していること`
- checks:
  - `26/26 整合`
  - `1076/1076 カバー`
  - `法政策差は別レイヤーへ`
  - `地域支援の詳細は必要に応じて別ガイドへ`
  - `文言監査を継続`

小注:

- `2026-03-20 時点で wording review 3 件継続中`

### 第7段: 次につながるもの

目的:
- この図が入口であり、終点ではないと示す

構成:
- bridge または handoff の図
- 右方向か下方向へ流す

表示テキスト:

- section title: `この地図が次につながるもの`
- items:
  - `公開向け基礎説明`
  - `企業向けの仕事設計`
  - `個別事情の整理`
  - `AI 支援`
  - `human review`

締めの短文:

- `見取り図は入口であり、実際の整理では条件軸を重ねる`

## 9. 画像生成AIに渡す完成プロンプト

### 推奨プロンプト A

Create a vertical Japanese public-facing infographic, 1600x2400, with a calm editorial information-design style, bright off-white background, clean card layout, soft borders, and clear reading flow from top to bottom.

Theme: explain that the "work design map" is not a random idea, but a simplified entry framework built by cross-analyzing public knowledge, research data, practical narratives, and statistical relations with AI. Make clear that disability-related information is often contaminated by outdated disability models, bias, discrimination, and diagnosis-only framing, so the process first applies a critical filter and an ICF-based interaction-model reinterpretation before AI reintegration, then audits boundaries before simplifying into 3 layers and 26 frames.

Audience: business leaders, HR, managers, occupational health, support professionals, and policy or research readers.

Visual tone: trustworthy, intelligent, practical, diagrammatic, like a strategy map or system design explainer. No cyberpunk, no futuristic glowing AI brain, no robot, no sci-fi city, no dark background.

Layout:
1. Top title block with eyebrow, title, and short subtitle.
2. Source section with multiple input boxes.
3. A critical filter block showing outdated disability models and diagnosis-only bias are not reused as-is.
4. An ICF-based interaction-model reinterpretation block.
5. A central AI synthesis block showing cross-analysis and contextual reintegration.
6. Output section showing 3 colored layers and a large "26 frames" emphasis.
7. Audit and boundary section with shield-like visual treatment and checklist feeling.
8. Final bridge section showing connection to public explanation, enterprise work design, individual case structuring, AI support, and human review.

Use the following palette:
- background #F8FAFC
- white cards #FFFFFF
- border #CBD5E1
- text dark slate #0F172A
- support text #475569
- AI block light sky #E0F2FE
- health layer #CCFBF1
- transition layer #FEF3C7
- operations layer #FCE7F3
- audit block #E0E7FF
- bridge block #DCFCE7

Typography style: modern, clean, editorial sans serif, bold for numeric highlights, calm and legible.

Important: keep Japanese text minimal and clean. Avoid rendering dense small paragraphs. Use clear section headers, large numerals, and short labels only. Leave generous clean areas for later text overlay if needed.

Include these exact short Japanese labels where possible:
- 仕事設計の見取り図
- この地図は、どう開発されてきたか
- 公開知識
- 調査データ
- 実務記述
- 経験の断片
- GLM 関係
- 編集ガイド
- 批判的フィルタ
- ICFベースの相互作用モデル
- AI による再統合
- 体調レイヤー
- 就職移行レイヤー
- 職場運用レイヤー
- 26フレーム
- 単純化の前後で点検していること
- この地図が次につながるもの
- 個別事情の整理
- human review

Numeric highlights to include cleanly:
- 52 類型
- 1076 課題行
- 201 件
- 4914 件
- 539 関連
- 26/26 整合

The final image should look like a premium public explainer infographic, not a pitch deck, not a medical poster, and not a generic AI marketing ad. It should visually imply that bias is critically filtered before synthesis, not merely that more data was collected.

### 代替プロンプト B

Create a text-light infographic base in Japanese editorial style for later manual text overlay.
The infographic should visualize a pipeline:
inputs of public knowledge, research data, practical records, narrative fragments, and GLM relations -> critical filter against outdated disability models and diagnosis-only bias -> ICF-based interaction-model reinterpretation -> AI contextual reintegration -> simplification into 3 layers and 26 frames -> audit and boundary checks -> bridge to individual case structuring and human review.

Use a bright, calm, trustworthy system-diagram aesthetic.
Do not place long text paragraphs.
Use only short Japanese labels, large numerals, boxes, arrows, and clean empty text panels.
The output must be visually balanced and publication-ready for a social impact website.

## 10. negative prompt

Do not use:
- cyberpunk
- purple neon
- dark mode
- robot faces
- humanoid AI
- glowing brain circuits
- sci-fi cityscape
- stock-photo-like smiling business people as the main focus
- medical chart aesthetic
- overly dense tiny text
- distorted Japanese typography
- excessive 3D effects
- childish infographic style
- clipart look

## 11. 画像内の正確な文字指定

### 最優先で正確に入れたい文字

- `仕事設計の見取り図`
- `この地図は、どう開発されてきたか`
- `26フレーム`
- `批判的フィルタ`
- `ICFベースの相互作用モデル`
- `AI による再統合`
- `体調レイヤー`
- `就職移行レイヤー`
- `職場運用レイヤー`
- `26/26 整合`

### 入ればよい文字

- `公開知識`
- `調査データ`
- `実務記述`
- `経験の断片`
- `GLM 関係`
- `編集ガイド`
- `批判的フィルタ`
- `ICFベースの相互作用モデル`
- `AI による再統合`
- `個別事情の整理`
- `human review`

### 無理に画像へ焼き込まなくてよい文字

- 1〜2行を超える説明文
- 小さな注釈
- wording review 継続中の細かな注

これらは後から手作業で追加してよい。

## 12. 後載せ用の本文テキスト

画像生成AIが本文を崩す場合は、以下を後置きする。

### 本文A

既存情報に含まれる古い障害観や診断決め打ちをそのまま使わず、ICF に基づく相互作用モデルで読み替えた上で、公開知識、調査データ、実務の声を AI で横断整理し、3レイヤーと26フレームへ単純化しています。

### 本文B

見えているのは最も単純化した入口です。実際の整理では、本人、仕事、環境、支援、時間、制度の条件を重ねます。

### 小注

2026-03-20 時点で wording review 3 件継続中

## 13. モデルへの実行ルール

- 1回目は `推奨モードA` で生成する
- 文字が崩れたら、文字をさらに減らした `代替プロンプトB` で再生成する
- 大見出しと数字が読めれば成功に近い
- 小さな日本語本文は手で載せる前提でよい

## 14. 採用判定チェックリスト

次を満たしたら採用候補:

- 一見して `設計図` に見える
- `AI広告` や `未来産業` に見えない
- source -> AI整理 -> 3レイヤー/26フレーム -> 監査 -> 次の接続 が追える
- 3レイヤーの色分けが自然
- 数字が主張しすぎず、でも見つけやすい
- 日本語が破綻していない
- 企業読者が引かない

## 15. 再生成指示テンプレート

### 文字が多すぎるとき

Text is too dense. Reduce paragraph text by 60 percent. Keep only title, short labels, numerals, and clean empty panels for later overlay.

### AI広告っぽいとき

Remove all futuristic AI marketing aesthetics. Make it look like a serious public explainer and system-design infographic, not a technology advertisement.

### 情報の流れが弱いとき

Strengthen the directional flow from inputs to critical filter to ICF-based reinterpretation to AI synthesis to 3 layers and 26 frames to audit to next-step bridge. Make the reading order obvious in one glance.

### 企業向けに硬すぎるとき

Keep it professional, but warmer and more accessible. Reduce bureaucratic heaviness. Preserve trust and clarity.

## 16. 出力ファイル名の提案

- `mitorizu-development-process-infographic-v1.png`
- `mitorizu-development-process-infographic-v1-textlight.png`
- `mitorizu-development-process-infographic-v1-social.png`

## 17. 最終注意

この図は、`AIがすべてを判断する` 図ではない。
`偏見や古い障害観をそのまま再生産せず、複雑な情報を、最初の対話で使える入口に変換し、その先で個別事情や human review へ橋をかける` 図として仕上げること。
