# NBL Decision Log

更新日: 2026-03-26

## Entries

### 2026-03-26

- Decision: `配慮設計アシスト` の `1日20件` 制限は、Vercel 本番では file-backed cache ではなく `shared Redis store` を正規系にする
- Why: Vercel Functions の scratch filesystem だけでは、再デプロイや複数インスタンスをまたいだ利用制限が維持できず、招待制 product の cost boundary として弱いため
- Evidence or source: Vercel Functions runtimes docs、Storage on Vercel Marketplace docs、Founder feedback、`lib/security/jacAccessGuard.ts`
- Public impact: public copy 上の `1日20件` 表示と実際の挙動を一致させやすくなる。Vercel 本番では Upstash env が入るまで hardening 未完とみなす
- Follow-up action: `vercel-jac-rate-limit-cutover-2026-03-26.md` を運用基準にし、`ops:jac-rate-limit:check` で env readiness を確認する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-26

- Decision: `配慮設計アシスト` の改善は UI 改善だけでなく `evidence ops loop` として回し、source refresh / feedback ingest / evidence brief / report traceability を定常化する
- Why: NBL のコア価値は配慮提案の wording ではなく、基本エビデンス情報を継続収集し、条件つきの判断材料として返せることにあるため
- Evidence or source: Founder feedback、`knowledge-sources.json`、`knowledge-claims-manifest.json`、`normalized-manifest.json`、`feedback-insights.json`
- Public impact: 最終レポートでは `claim / evidence lane / source URL / missing context` を返せる形へ寄せ、public asset 候補は evidence brief から 1-3 件に絞る
- Follow-up action: `jac-evidence-ops-loop-2026-03-26.md` を基準に、`jac:evidence:brief` と recurring automation を evidence refresh lane に載せる
- Owner: Chief of Staff
- Status: provisional

### 2026-03-26

- Decision: recurring な経営 output は `状況報告` だけで終わらせず、毎回 `Founder Decision Queue` と `AI Autonomous Moves` のどちらかを明示する
- Why: daily / weekly memo が観測中心のままだと、Founder から見て経営が自律的に進んでいる感覚も、節目で判断を求められている感覚も弱くなるため
- Evidence or source: Founder feedback、既存の `daily snapshot` / `weekly loop report` 出力、`snapshot-automation-design-2026-03-17.md`
- Public impact: 直接の public copy 変更はないが、以後の recurring ops と business-agent synthesis は `Decision / Recommended / Why now / Default if no reply` の形を優先する
- Follow-up action: `founder-decision-cadence-2026-03-26.md` を recurring ops の基準文書にし、daily / weekly template と生成スクリプトを更新する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-26

- Decision: NBL は `product-first の AIドリブン社会OS事業` として進め、インフォグラフィックや動画の投げ銭的収益は `bridge revenue lane` に留める
- Why: 初期の主目的は企業・就労支援者向け product と operating layer の fit をつくることであり、content 収益を主事業化すると consulting drift や sensational media drift に戻りやすいため
- Evidence or source: Founder feedback、`Business Structure Round`、`Business Validation Round`、`Value Compounding Operating System`、`disability-holistic-review` workflow
- Public impact: public copy では `応援は任意` と `professional product build が本命` を混同しない。重要な教育資源は paywall 化せず、投げ銭と個別判断や優先対応を結びつけない
- Follow-up action: `ai-driven-social-os-management-policy-2026-03-26.md` を Revenue Architect / Managing Director の基準文書として使い、今後の supporter lane は 1-2 本の infographic / video series で小さく検証する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-18

- Decision: 公共広告キャンペーン lane は、`MV 完成待ち` ではなく `audio-first` の公開単位で前に進める
- Why: 既に song の核はあり、Founder 自身にも良心刺激や行動喚起の手応えがある一方、MV までを必須にすると制作コストが高く、公開が止まりやすいため
- Evidence or source: Founder feedback、`content-inbox/youtube-links.md`、`disability-holistic-review` workflow
- Public impact: 初回は `song + still visual + short concept note + boundary note` を最小公開単位とし、song 単体を制度解説や支援案内の代替にはしない
- Follow-up action: `campaign-lane-brief-2026-03-18.md` を基準に、`人が先` を audio-first pilot 候補として再評価し、campaign lane の置き場を `Resources` か別ページかで決める
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: infographic inbox は `spec-first`, `cluster-second`, `image-analysis-third` の3段で整理する
- Why: 仕様書がある資産を画像印象だけで読むと誤読や過度な一般化が起きやすく、逆に root に散在する PNG は cluster を先に作らないと有効活用しづらいため
- Evidence or source: Founder feedback、`content-inbox` の現状、`disability-holistic-review` workflow
- Public impact: 画像資産は 1 枚ごとの公開判断だけでなく、論点クラスターごとの位置づけメモを先に作る
- Follow-up action: `infographic-intake-system-2026-03-18.md` と `employment-design-cluster-2026-03-18.md` を基準に、lane 1 から順に registry を広げる
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: `人間を超えている` 感は、神秘化やAI話題性ではなく、`visible improvement / reusable artifacts / visible boundaries` の3点で見せる
- Why: NBL の showcase は polished AI site に寄るより、運用能力が観測できる site である方が、social OS としての信頼や独自性に合うため
- Evidence or source: Founder feedback、`site-superhuman-strategy-ja.md`、`Showcase Direction Round`
- Public impact: relaunch public home には `How The Site Improves` の断面を足し、個人最適や継続記憶の強い promise は hold する
- Follow-up action: `site-superhuman` の採用点と読み替え点を synthesis note に固定し、relaunch home の次段改善に使う
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: NBL の recurring automation は、まず `daily snapshot` と `weekly loop report` の2本を基準ジョブとして設計する
- Why: monthly dashboard まで一度に自動化するより、日々の現在地と週次の loop review が回るだけで Founder chat 起点の律速をかなり減らせるため
- Evidence or source: Founder feedback、`Operating Loops Round`、`Value Compounding Operating System`
- Public impact: public copy には出さないが、hidden review と ops templates では `daily-snapshots/`、`weekly-loop-reports/`、`monthly-compounding/` の出力先と red flag 条件を固定する
- Follow-up action: `/review/snapshot-automation` を recurring automation の基準ページにし、将来の app automation prompt と output path の原型として使う
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: Founder からの新規素材投入とサイト利用フィードバックは、`content-inbox` 起点の軽量 input flow にまとめる
- Why: Founder が都度フル文脈を説明しなくても、素材投入や使用感フィードバックを短く返せる形にしておく方が、NBL の継続運用と value compounding を止めにくいため
- Evidence or source: Founder feedback、`Value Compounding Operating System`
- Public impact: public copy には直接出さないが、`NBL-FOUNDER-INPUT-GUIDE.md`、`content-inbox/founder-new-content-log.md`、`content-inbox/founder-site-feedback-log.md` を Founder の標準入口として扱う
- Follow-up action: 新しい素材や feedback は、まず inbox に入り、Chief of Staff が `Public Narrative / Knowledge & Method / Business Validation / Next Horizon` へ振り分ける
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: Founder の役割は `daily operator` ではなく、必要最小限の不可逆判断だけを持つ形で operating design に固定する
- Why: NBL の価値複利は、Founder が every loop の作業者に戻ると止まりやすく、逆に Founder がまったく自分の役割を見失うと不安や律速感が残るため
- Evidence or source: Founder feedback、`Value Compounding Operating System`
- Public impact: direct public copy にはまだ出さないが、Founder 向け operating dashboard と executive start page では `Yes / No / Name / Keep / Adjust / Stop` を返す最小役割を明示する
- Follow-up action: `/review/value-compounding` を Founder の最小関与ルールの基準ページとして維持し、将来の recurring automation の boundary に使う
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: NBL の成否は、単月収益だけでなく `artifact / loop / trust / distribution / revenue capacity` の複利で判断する operating design にする
- Why: NBL は相談件数 business ではなく社会OS business であり、初期は revenue 自体より先に、再利用可能な部品と運営機構が複利で立ち上がるかを見る方が本質に合うため
- Evidence or source: Founder feedback、`Operating Loops Round`、`Business Structure Round`、`Business Validation Round`
- Public impact: direct public copy にはまだ出さないが、Founder dashboard と operating review では monthly revenue だけでなく compounding metrics を主要指標として扱う
- Follow-up action: `/review/value-compounding` を operating map に追加し、将来の automation / recurring review の土台にする
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: relaunch public home の showcase 文法を、What We Do / JAC / Resources / About の review pages へ shared shell として広げ始める
- Why: Home だけが `mechanism / artifact / boundary` を見せても、下流ページが従来の draft memo 風のままだと、サイト全体としての一貫性と authority が上がりきらないため
- Evidence or source: `Showcase Direction Round`、`Relaunch Public Home Round`、Founder feedback
- Public impact: まず hidden review で、hero shell、section heading、artifact-first な説明文法を What We Do / JAC / Resources / About へ適用する
- Follow-up action: shared shell を磨きつつ、次は Resources / JAC の public 実装候補と relaunch Home 本体への接続を詰める
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: 新生NBLの Home は、`friendly AI SaaS` 的な polish ではなく、`mechanism / artifact / boundary` が visible な showcase として設計する
- Why: current relaunch draft は整理されているが、均一な card grammar と abstract copy により、NBL が本当に持つ operating model や social OS の手触りが十分に伝わらないため
- Evidence or source: Founder feedback、multi-agent showcase direction round、`Relaunch Public Home Round`
- Public impact: Home には `How NBL works in 3 moves`、`What accumulates`、`six-lens domain framing`、`question-led routing`、`governance note` を入れ、`Next Horizon` は raw public peer stream にしない
- Follow-up action: `RelaunchPublicHome` を第一段で更新し、その後 shared shell を What We Do / Methods / Resources / Vision へ広げる
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: temporary public top page にも、NBL の基本的な考え方と `AIが働く時代の人間参加` に関する最小説明を入れる
- Why: 試験公開側に全体ビジョンがないと、NBL が従来の障害者雇用サイトに引っ張られて見えやすく、障害就労の位置づけが本来より狭く読まれるため
- Evidence or source: Founder feedback、`About Round`
- Public impact: top page に `NBLの基本的な考え方` セクションを追加し、障害就労がより広い参加設計の実装領域であることを明示する
- Follow-up action: 3月20日までに、言い過ぎず薄すぎない表現へさらに調整する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: `/for-enterprise` は `補足ページ` ではなく、企業・組織向けの最初の実務整理ページとして扱う
- Why: タイトルだけの論点列挙や `現在まだ公開していないもの` の掲出は、期待を高めるより未完成感や事故物件感を出しやすく、企業担当者にとっても `で、何が分かるのか` が曖昧になるため
- Evidence or source: Founder feedback、`Enterprise Inbound Round`
- Public impact: `このページが返すこと`、`先に共有したい実務テーマ`、`最初の3つの進め方`、`このページの境界`、`次に見る入口` を中心に組み直し、`未公開一覧` は削除する
- Follow-up action: 3月20日までに文言をさらに締め、トップ・動画・JAC との流れを確認する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: temporary public site の YouTube 導線は `外部チャンネルへ丸投げ` ではなく、`/videos` の curated page を経由する
- Why: 現在設定していた channel handle は 404 で、かつチャンネル全体へ飛ばすだけでは public-safe に案内したい動画と hold 動画が混在して見えてしまうため
- Evidence or source: Founder feedback、current public top-page review、`content-inbox/youtube-links.md`
- Public impact: top page と enterprise note からは `公開動画を見る` を案内し、public_now の 5 本だけをサムネイル付きで見せる
- Follow-up action: 3月20日までに動画ごとの説明文と並び順を軽くレビューする
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: `/jac-foundations` は `図を貼っただけの試験ページ` ではなく、`JAC の読み方を先に説明する公開向け explainer` として組み直す
- Why: 3レイヤー図や基礎図解をそのまま大きく見せるだけでは `急拵え` 感が出やすく、方法論への信頼よりも未整理感が先に立つため
- Evidence or source: Founder feedback、`JAC Foundations Round`
- Public impact: `何が分かるか / 何はまだ決めないか`、`この地図の読み方`、`個別化するときに見る軸`、`図を置く理由` をページ本文に追加する
- Follow-up action: 3月20日までに説明文の表現をさらに締め、公開可否レビューを行う
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: 3月20日までの public-safe な追加説明として、JAC 26フレームの `3レイヤー` と背景インフォグラフィックを試験的に紹介する
- Why: JAC の基礎地図と背景にある考え方が見えると、個別相談や sales 導線より前に方法論への信頼をつくりやすく、記事読者にも `続きがある` 感じを返しやすいため
- Evidence or source: Founder feedback、`JAC Foundations Round`
- Public impact: `/jac-foundations` を追加し、top page と補足ページから自然に辿れるようにする
- Follow-up action: 3レイヤー図と基礎図解の review を行い、3月20日パックに含める
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: 2026年3月20日を、`建設中の退避状態` から `いったん public に出せる面を仕上げる` 小さな目標日にする
- Why: 記事読者の流入前に、全部を完成させるのではなく、信頼できる追加説明と自然な入口を先に整える方が現実的で、レビューも間に合う可能性が高いため
- Evidence or source: Founder feedback、`March 20 Release Sprint`
- Public impact: top page の追加説明、補足ページ、公開説明ノート、JAC entry note、問い合わせ返信テンプレートを優先レビュー対象にする
- Follow-up action: `/review/march20-release` と `content-review/march20-release/` 一式をもとに仕上げる
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: 記事流入に備える情報は `切り分けた landing page` ではなく、トップページ自体が自然に追加情報を返す構成を優先する
- Why: 記事読者だけを狙った別導線に見えると、不気味さや期待外れを生みやすく、NBL の素直な入口として読まれにくいため
- Evidence or source: Founder feedback
- Public impact: top page に `職場設計としての合理的配慮`、`継続就労`、`ニューロダイバーシティ`、`相談導線` を自然に置き、補足ページは補足に下げる
- Follow-up action: temporary public home を厚くし、`/for-enterprise` の押し出しを弱める
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: 記事流入向けの public 入口では、`合理的配慮 = 職場設計`、`中途障害者の継続雇用`、`ニューロダイバーシティ`、`相談・秘密保持導線` を先に見せる
- Why: 記事ベースの論旨が、合理的配慮を思いやりではなく仕事・情報・運用の設計として捉え、まず職場設計で改善し、その次に支援連携を組み込む順序を明確に示しているため
- Evidence or source: `/Users/YuichiroHARUNA/SynologyDrive/2026Next Being Lab/障害者雇用関係/労基旬報/論旨整理案（春名）.docx`、`Article Alignment: Labor Bulletin`
- Public impact: `/for-enterprise` と enterprise inbound review は、障害者雇用の narrow description より `職場設計` と `継続就労` を前に出す
- Follow-up action: public enterprise entry と review draft に article-aligned framing を反映する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: 3月20日以降の記事流入に備える public entry は、`障害者雇用サイト` より `働きづらさと仕事設計を扱う AI-native social OS` に寄せる
- Why: 記事を読んで来る企業担当者は、障害者雇用の narrow concern だけでなく、仕事設計、組織運用、AI時代の働き方への関心でも流入する想定であり、NBL の事業定義とも整合するため
- Evidence or source: Founder input、`Enterprise Inbound Round`
- Public impact: current public site に `企業・組織の方へ` の safe entry を用意し、Home / What We Do / JAC の copy も work design 寄りに調整する
- Follow-up action: `/for-enterprise` と hidden review draft を追加し、temporary public home から導線を出す
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: JAC guidebook は `sales-first checkout` ではなく、`free-first / overage-later` の low-friction entry asset として再定義する
- Why: 最初の小さな役立ちを出し惜しみなく public に出し、継続利用や private layer、rate 超過で有料化する方が NBL の社会OSモデルに合い、相談料や小売に見えにくいため
- Evidence or source: Founder input、`Enterprise Inbound Round`、`Business Structure Review`
- Public impact: guidebook の購入導線を主導線には戻さず、JAC の entry asset / workbook として再評価する
- Follow-up action: JAC positioning と revenue posture を hidden review に反映し、public では sales-first wording を避け続ける
- Owner: Chief of Staff
- Status: provisional

### 2026-03-17

- Decision: live candidate は `1 candidate = 1 dossier` で持ち、3-4 conversation ごとに founder-readable な `round readout` に閉じる
- Why: 実名候補が入り始めると、scattered notes やチャット断片が founder の負荷になりやすく、boundary fit と ranking の読み筋が崩れやすいため
- Evidence or source: `Partner Dossier Kit`、`Partner Sample Packet`、`Partner Candidate Pipeline`
- Public impact: なし。internal ops として founder 共有は `round readout` と `advancement memo` を正本に寄せる
- Follow-up action: A1 / A2 / B1 / C1 に実名候補が入ったら dossier を作り、4 conversation 後に readout を作る
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: partner ranking は total score だけでなく `boundary readiness` と `low automation pressure` を gate condition として扱う
- Why: NBL では boundary fit と automation pressure が致命的な失敗要因になりやすく、感じの良さや総合点だけで partner を選ぶと drift が起きやすいため
- Evidence or source: `Partner Ranking Logic`、`Partner Discovery Ops Round`
- Public impact: なし。internal ops として `advance / hold / drop / comparison only` の判定に gate condition を必須化する
- Follow-up action: ranking sheet に gate columns を残し、4 conversation 後に provisional ranking を出す
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: discovery の初期運用は、実名候補の前に `A1 / A2 / B1 / C1` の匿名 slot pipeline を固定してから進める
- Why: 候補名より先に target ratio、required evidence、red flags、tracker structure を決めた方が、network convenience に引っ張られず比較運用しやすいため
- Evidence or source: `Partner Candidate Pipeline`、`Partner Discovery Ops Round`
- Public impact: なし。internal ops として candidate list template と outreach tracker template を先に運用する
- Follow-up action: A1 / A2 / B1 / C1 に実名候補を仮入力する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: partner discovery は `target condition を3つに固定し、A:2 / B:1 / C:1 の比率で4 conversation を比較する` 形で進める
- Why: network convenience で相手を広げるより、fixed target / fixed scorecard で比較した方が、NBL に合う partner fit と boundary fit を見分けやすいため
- Evidence or source: `Partner Discovery Ops Round`、`Commercial Discovery Kit`、`Design Partner Round`
- Public impact: public には影響せず、internal ops として `employer-facing intermediary` を primary target、`design-forward employer` を secondary、`research / policy lighthouse` を comparison target に置く
- Follow-up action: outreach note、scorecard sheet、first 4 conversation candidate list を作る
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: 最初の commercial package は `separate products` ではなく `1つの core package + 2つの narrow wrapper` に保つ
- Why: employer 用と intermediary 用で product を分けすぎると、NBL の shared operating layer より相手別の受託調整が前に出て、consulting drift が起きやすいため
- Evidence or source: `Commercial Package Round`、`Design Partner Round`
- Public impact: public には generic pricing をまだ出さず、internal only では `NBL OS Pilot` を core package、`Workplace Pilot` と `Partner Node Pilot` を wrapper として扱う
- Follow-up action: 1 page package brief、exclusions list、boundary one-pager を作り、次の discovery call で wrapper fit を確認する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: 最初の design partner は `employer network を持つ intermediary` を provisional first target とし、`design-forward employer` を second-best に置く
- Why: NBL の初期価値は単発受注の速さより、repeated use、cross-case learning、partner edge、human review boundary を無理なく組めることにあるため
- Evidence or source: `Design Partner Round`、`Business Structure Round`、`Business Validation Round`
- Public impact: 当面は public copy に generic pricing や sales promise を出さず、内部設計として design partner discovery を intermediary first で進める
- Follow-up action: partner scorecard、must-escalate one-pager、2 週間の outreach plan を作り、`/review/design-partner-round` で確認する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: NBL の事業構造は `AI core + partner edge + human review boundary` を前提にし、収益は `startup fee + recurring platform fee + bounded usage` の hybrid を初期案とする
- Why: 相談件数や人月課金に依存すると社会OSではなく受託相談に戻りやすく、障害・就労文脈では高リスク判断の完全自動化も避ける必要があるため
- Evidence or source: `Business Structure Round`、OpenAI Frontier / Codex app、ODEP accessible technology / resources、EEOC accommodation guidance、Stripe pricing guidance
- Public impact: public copy は引き続き慎重に保つが、内部設計としては `consulting-first` でなく `system-layer-first` へ寄せる
- Follow-up action: `/review/business-structure` で review し、今後の About / What We Do / JAC の public copy 圧縮の基準にする
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: NBL の本丸は `AIで人を不要にすること` ではなく、AI で人間の限界を超える事業を動かし、その余力でポスト労働社会の受け皿としての新しい仕事と社会設計を生み出すことに置く
- Why: NBL の価値は automation 自体ではなく、人間が機械のように働かなくても、個性や強みを発揮して参加できる社会の器を広げることにあるため
- Evidence or source: ユーザー指摘。障害や病気の有無にかかわらない参加の受け皿を事業の本丸とするという経営判断
- Public impact: About では `AIで人を不要にするのではない` を明示し、Home / What We Do / JAC もその本丸に接続して説明する
- Follow-up action: About round と hidden review page に反映し、将来の public About 実装の基準にする
- Owner: Chief of Staff
- Status: accepted

### 2026-03-16

- Decision: NBL の事業を `個別相談事業` ではなく `AI時代の社会OS事業` として設計する
- Why: 1件ごとの人的対応より、再利用可能な知識、workflow、JAC、resources を積み上げる方が、NBL の実態と将来のレバレッジに合うため
- Evidence or source: ユーザー指摘。`1台のノートパソコンが巨大な建物を凌駕する` AI 時代の事業設計という経営判断
- Public impact: Home、What We Do、JAC、About では `相談サービス` より `社会OS` としての姿が見える構成に寄せる
- Follow-up action: hero copy、事業説明、JAC position を `社会OS` 前提で順次更新する
- Owner: Chief of Staff
- Status: accepted

### 2026-03-16

- Decision: AI 運営モデルは web サイトの都合ではなく、NBL の経営・運営方針の中核として扱う
- Why: staffing、offer、責任範囲、revenue design を決める前提であり、site copy はその下位表現だから
- Evidence or source: ユーザー指摘、`docs/nbl-codex-operating-model.md`、`docs/nbl-workspace/ai-operating-principles-2026-03-16.md`
- Public impact: Home、What We Do、JAC、About、販売導線、試用導線はすべて AI 運営モデルとの整合で判断する
- Follow-up action: 以後の各 round で `人の常設相談窓口` を暗黙に前提しない
- Owner: Chief of Staff
- Status: accepted

### 2026-03-16

- Decision: `relaunch home` の方針整理だけでなく、temporary public site を置き換える将来の完成版トップに近い hidden implementation draft を先に持つ
- Why: 戦略メモだけでは `本当にトップとして成立するか` が見えにくく、public 差し替え時の実装距離も測りにくいため
- Evidence or source: `Relaunch Home Round` と `Relaunch Public Home Round`
- Public impact: すぐには公開しないが、今後の `/` 差し替えは `relaunch public home` component を母体に進める
- Follow-up action: `/review/relaunch-public-home` を基準に、What We Do / JAC / Resources / About との接続を詰める
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: NBL の AI中心運営は、Founder の逐次トリガーではなく `Chief of Staff / Public Narrative / Business Validation / Knowledge And Method / Next Horizon` の 5 loop で定常運転する前提で整理する
- Why: 役割分担や round memo は増えてきたが、Founder から見た `どう回り続けるのか` が 1 枚で見えず、不安や律速感が残りやすいため
- Evidence or source: `NBL Codex Operating Model`、`NBL Business Agent Briefs`、`Relaunch Home`、`Next Horizon`、partner discovery 一式の蓄積
- Public impact: 直接の public copy 変更はないが、今後の hidden review と実装はこの loop map を基準に優先順位づけする
- Follow-up action: `/review/operating-loops` と `Operating Loops Round` を、Founder 向け operating map として維持する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: NBL は `Horizon 1 = 障害・難病の雇用支援R&D` と `Horizon 2 = participation design の芽出し` を並走させ、旧DAO発想は `internal incubation` として再定義する
- Why: 当面の実務支援だけでは `AI時代の人間参加をどう設計するか` という本丸を取り切れず、かといって future vision だけでは現実の R&D 基盤が弱くなるため
- Evidence or source: ユーザー指摘、`NBL AI Operating Principles`、`About`、`Relaunch Home`、旧 DAO Participation Lab の棚卸し
- Public impact: raw DAO prototype は public に戻さず、将来の説明では `DAO` より `participation design experiments` を主語にする
- Follow-up action: `/review/next-horizon` と `Next Horizon Round` を基準に、future public narrative と internal incubation の境界を整える
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: 新生NBLの次の本流は、散在する draft を `relaunch home` に束ね、全体ビジョン・current offer・method・resources・business を 1 つの入口で返せる構造へ寄せる
- Why: 仮公開 sprint は進んだが、現状の hidden review 群は個別には読めても、新生NBLとして何を目指し何を今返すのかが 1 ページでは見えにくいため
- Evidence or source: `About`、`What We Do`、`Site Architecture`、`JAC Positioning`、`Business Structure` の review drafts と `Relaunch Home Round`
- Public impact: 今後の本公開 home は、障害就労特化サイトにも未来思想ページにも寄らず、`AI時代の人間参加を設計する事業` と `その現在の実装` を同時に返す構成になる
- Follow-up action: `/review/relaunch-home` を核に、What We Do、Resources、JAC、About の本公開用 page implementation を再接続する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-16

- Decision: JAC は `NBL の中核方法論 / product stream` として位置づけ、初期公開では `個別相談サービス` や `open sales page` として見せない
- Why: JAC は重要だが、NBL 全体そのものではなく、現時点では guide / trial / guidebook の責任範囲も混在しているため
- Evidence or source: `components/ProductJac.tsx`、`pages/jac.tsx`、`pages/jac/guide.tsx`、`pages/jac/guidebook.tsx` の review と `JAC Positioning Round`
- Public impact: JAC 固有ページは role、workflow、boundaries、current access posture を中心に構成し、個別相談・購入導線・alpha wording は hold する
- Follow-up action: `/review/jac-positioning` を review し、承認後に将来の public JAC page 実装へ移す
- Owner: Chief of Staff
- Status: provisional

### 2026-03-15

- Decision: 当事者理解インフォグラフィックと 4 コマまんがを、「見えない障害」の理解を促す重要コンテンツとして扱う
- Why: NBL の価値を、制度論や方法論だけでなく、 lived experience に根ざした理解導線として示せるため
- Evidence or source: ユーザー判断。`content-inbox/インフォグラフィック` と `content-inbox/難病コミック４コマ` に相当素材が存在
- Public impact: 初期サイトでの主要 content pillar 候補。ただし、体験談の一般化防止と文脈付けは必要
- Follow-up action: `見えない障害の理解` シリーズとして束ね、`public_after_rewrite` を前提に優先 review する
- Owner: Chief of Staff
- Status: accepted

### 2026-03-15

- Decision: NBL サイト全体は `AI時代の社会OSを設計する研究と実装のスタジオサイト` として設計し、JAC はその中核 stream の 1 つとして位置づける
- Why: JAC、理解促進コンテンツ、研究資料、長期ビジョン、実験ページが混在しており、単一プロダクトサイトとして扱うと全体が歪むため
- Evidence or source: 現在の `pages/index.tsx`、`components/`、`/jac`、`/dao-participation-lab`、inbox 資産群の棚卸し
- Public impact: 全体構造は `Home / What We Do / Resources / JAC / About` を provisional site map とし、hold 領域を分離する
- Follow-up action: この site map に沿って、各 stream ごとの content inventory に戻る
- Owner: Chief of Staff
- Status: provisional

### 2026-03-15

- Decision: 初期公開では、NBL を `AI運営のバーチャルチーム` として明示し、人の常設相談窓口に見える文言は採らない
- Why: NBL には常設の実メンバー体制がなく、AI チームで動く前提を public copy に反映しないと、運営実態と promise がずれるため
- Evidence or source: ユーザー指摘、`docs/nbl-codex-operating-model.md`、`What We Do Round`
- Public impact: Home、What We Do、About では、運営主体、できること、できないことを AI チーム基準で書く
- Follow-up action: review draft と decision memo の相談前提文言を AI 運営モデルに置き換える
- Owner: Chief of Staff
- Status: provisional

### 2026-03-15

- Decision: 初期公開の主 CTA は `JAC試用` でも `問い合わせ` でもなく `AIチームで状況整理を始める` とする
- Why: 人の相談導線を主軸にすると運営実態とずれ、JAC 試用を最上位にすると準備中要素まで promise に見えやすいため
- Evidence or source: `components/Hero.tsx`、`components/Services.tsx`、`components/ProductJac.tsx` の review と `What We Do Round`
- Public impact: Home と What We Do は AI 起動導線を主軸にし、JAC は説明対象として位置づける
- Follow-up action: `What We Do` review draft と Home の再設計に反映する
- Owner: Chief of Staff
- Status: provisional

### 2026-03-15

- Decision: `What We Do` で今 public に約束する offer は `AIチームによる論点整理`、`AIチームによる実装設計・試行`、`AI教材・resources` に絞る
- Why: 現行 draft にある価格、認定、alpha/beta、販売導線に加え、人の伴走や live 提供を前提にした表現は promise として早すぎるため
- Evidence or source: `components/Services.tsx`、`components/Phase1.tsx`、`components/ProductJac.tsx` の role-based review とユーザー指摘
- Public impact: 初期公開の `What We Do` は AI チームが担う整理、設計、資源提供を中心に構成し、hold 領域は public 導線から外す
- Follow-up action: `/review/what-we-do` と page draft を review し、承認後に本公開用実装へ移す
- Owner: Chief of Staff
- Status: provisional

### 2026-03-15

- Decision: 初期公開の Home は `NBL は何者か` と `どこへ進むか` に役割を限定し、支援詳細は `What We Do` に逃がす
- Why: 現行 Home は理念、JAC、資料、販売、実験が混在しており、初回訪問で理解負荷が高いため
- Evidence or source: `What We Do Round`、`Site Architecture`、`components/Hero.tsx`、`components/TrustStrip.tsx`、`components/Reports.tsx` の review
- Public impact: Home は `AIチームで状況整理を始める` CTA、`What We Do` の要約、各 stream への入口を中心に再設計する
- Follow-up action: `/review/home-first-release` の draft を review し、承認後に本公開 Home の実装へ移す
- Owner: Chief of Staff
- Status: provisional

### 2026-03-15

- Decision: 初期公開の `Resources` は、`見えない障害の理解`、基礎図解、選抜動画、主要資料の 4 collection に束ねる
- Why: 現在の素材量が多く、直置きするとアーカイブ化して導線が壊れるため
- Evidence or source: `infographic triage`、`youtube triage`、`invisible disability series` の review
- Public impact: `Resources` は series 単位の入口ページとして構成し、WIP や thought pieces は hold に残す
- Follow-up action: `/review/resources-first-release` の draft を review し、承認後に本公開 `Resources` 実装へ移す
- Owner: Chief of Staff
- Status: provisional
