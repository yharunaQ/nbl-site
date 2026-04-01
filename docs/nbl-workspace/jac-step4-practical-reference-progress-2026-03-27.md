# JAC Step 4 Practical Reference Progress

## 今回入れたこと

- Step 4 を `assessment.citations` の後処理ではなく、`step4Evidence + step4ClaimIds` から server-side で組み立てる `step4EvidencePack` へ移し始めた。
- `agenticExecutor` には LLM 推論用 `evidence` とは別に、Step 4 用の wider / more diverse pool として `step4Evidence` と `step4ClaimIds` を追加した。
- Step 4 の参考資料の位置付けを、「合意文書に書いた合理的配慮や支援を、どの場面で何を確認し、どう試し、どう見直すか具体化する実践資料」として固定した。
- external かつ `aggregated_index` の `legal_policy` / `employer_guidance` は、Step 4 で `direct_basis` としては扱わず、`具体策の参考資料` として表示する。
- `web-cache` のうち、`AskJAN` / `JEED` / `AskEARN` / `JobAccess` / `UK GOV` / `Headway` / `Canada` / `EU` などの practical source から、検索ヒットに近いページを `web-cache 由来の具体策ヒント` として別枠表示する。
- `search_index` / `finder` / `index` のような一覧ページは practical preview から除外する。
- `specific_case` / `case_detail` / `case_guide` は、類似事例として優先的に practical preview に出す。
- `build-claims` の artifact 生成時点でも、external aggregated guidance と index-like page は `related_reading` に落とすようにした。
- external の `search_index` / `finder` / `index` / `resource_hub` は claim 生成自体をスキップするようにした。
- `related_reading` 向けに、event / feedback widget / 連絡先導線 / start page 由来の low-value statement を source family ごとに落とす quality gate を追加した。
- `practical reference` preview では、action-oriented な文を優先して要約し、event / about / contact / privacy 系の URL や文面は候補から外す ranking/filter を追加した。
- `practical reference` preview に consultation / selected tags / follow-up answers を渡し、今回の相談で重要な論点に近い reference が先に出る条件付き ranking を追加した。
- Step 4 下段の `referenceCitations` も consultation / selected tags / follow-up answers に応じて並び替え、preview と citation card の関連度を揃えた。
- Step 4 下段の `referenceCitations` には、grant 手続き・一般メリット訴求・ポータル導線のような low-value reference を runtime で落とす品質 gate と URL 単位の重複除去を追加した。
- Step 4 下段の `referenceCitations` では、残った `related_reading` についても sample excerpt と相談文脈を使って summary を practical な短文へ寄せ、抜粋順も相談条件に近いものが先に来るようにした。
- Step 4 下段の `referenceCitations` では、generic な claim 見出しも相談文脈に応じた短い実践ラベルへ置き換え、reference-only の card が「何の具体策か」を先に読めるようにした。
- Step 4 下段の `referenceCitations` では、同じ practical タイトルに寄った reference-only citation を1枚の card に束ね、近い資料が散らばりにくいようにした。
- Step 4 の preview / citation / artifact では、`successful and scalable program` や `efficient and responsive accommodation process` のような組織一般論を additional low-value pattern として落とし、`talk to the employee` `review functional abilities` のような調整プロセスの具体文を優先するようにした。
- Step 4 では、Canada 系の調整プロセス資料を `本人と職場で調整案をすり合わせる具体策` として読めるように、調整プロセス専用の practical label と context matching を追加した。
- Step 4 の `web-cache 由来の具体策ヒント` には、`対話の軸 / 試行候補 / 見直しの軸` を付け、同じ参考資料でも「何のために使う資料か」が先に分かるようにした。
- Step 4 の `web-cache 由来の具体策ヒント` の summary は、英語の断片をそのまま見せるのではなく、`対話で確認` `試し方の例` `見直しの観点` から始まる短い日本語の実務文へ寄せた。
- Step 4 下段の citation card でも、review 系の資料は `調整後の見直しポイント`、dialogue 系の資料は `本人と職場で調整案をすり合わせる具体策` のように実務ラベルへ寄せるようにした。
- Step 4 下段の reference detail でも、badge と summary の先頭を `対話で確認 / 試し方の例 / 見直しの観点` に寄せ、card を開いた瞬間に使い方が分かるようにした。
- representative case 5件と artifact audit 1件からなる `Step 4` 回帰評価を追加し、`jac:eval:step4:brief` で markdown / json の snapshot を残せるようにした。
- `jac:evidence:refresh:light` / `full` には `jac:eval:step4:brief` を組み込み、evidence brief 側でも `Step 4 Eval Snapshot` を参照できるようにした。
- AskJAN の `Add to MyJAN` や vendor/product 列挙のような boilerplate が `direct_basis` に残る問題に対して quality gate を追加し、representative eval の artifact audit で継続監視できるようにした。
- practical preview では、同一 source family の候補が上位を埋め尽くしにくいように、最初の数件は source 多様性を保って選ぶようにした。
- AskJAN の `Close Menu Close` や `Employer Live Chat Home`、AskEARN / JobAccess / Canada.ca の brand-only title のような navigation/title noise を、preview title 抽出時に切り落とすようにした。
- AskJAN の case page や Canada / JobAccess / AskEARN の generic guide title は、相談文脈に応じて `勤務時間・休憩・治療スケジュールの類似事例` `勤務時間・休憩・治療スケジュールを整理する対話ガイド` のような日本語の practical title へ寄せるようにした。
- `build-claims` では、AskEARN の導入文 (`Getting Started / Publications`)、ODEP grant 表記、ICT resource list、Canada の figure text、UK GOV の対象範囲一般説明のような weak statement を `related_reading` claim 生成の段階で落とすようにした。
- `build-claims` の claim cleanup には `Open Close` / `Close Open` の UI ノイズ除去も追加し、EU 系の useful statement を落とさずに文を整えられるようにした。
- runtime 側の `filterReferenceCitationsByUsefulness` でも、citation 全体だけでなく detail 単位で low-value text を見るようにし、artifact 再生成前でも source-family intro 文が表示に残りにくくした。
- representative eval には `related_reading` 用の artifact audit を追加し、今回 blocked にした weak statement が再混入したら検知できるようにした。
- AskEARN の `legal risk` / `welcome accommodation requests` のような抽象的組織一般論と、Canada の `union / complaint` のような救済導線文を additional low-value pattern として preview / runtime / artifact の3層で落とすようにした。
- practical preview では、record 全体に具体策が含まれていても、検索ヒット excerpt 自体が low-value generality なら候補から外すようにして、少数候補時の取りこぼしを塞いだ。
- `build-claims` では、pick した sentence をそのまま保存せず `normalizeClaimInput` を通してから claim 化するようにし、`Flexible working time Flexible working time ...` のような重複見出しが artifact に残りにくくした。
- `related_reading` は claimType / signal ごとに別 claim を持たせず、同じ source family・同じ canonical statement なら artifact 段階で統合するようにし、JobAccess / Canada / AskEARN の同文重複をまとめた。
- 追加で、AskEARN の learning-center 一般論、UK GOV の EHRC 外部誘導文、EU の collective bargaining 一般論、JobAccess の support plan / obligation / funding 導線文を low-value pattern に追加した。
- `jac-step4-eval` には `same-source duplicate` audit と `related_reading hotspot` 集計を追加し、ops brief 側でも `related_reading 件数 / hotspot source / duplicate count` を毎回確認できるようにした。
- AskEARN の `newsletter / Section 501 / disclaimer / implementation network`、JobAccess の `site maintained / save / workers compensation`、Canada の `HR specialist / disability management program` のような residual generality を追加で low-value / conditional に振り分けた。
- runtime の preview / citation でも同じ source-family rule を共有し、JobAccess の `support plan template` は `調整の進め方 / 見直し` が必要な文脈だけに出すようにした。
- `jac:eval:step4:brief` の更新後に `jac:evidence:brief` を追従させ、Step 4 snapshot と evidence brief の `related_reading` 件数がズレない運用に揃えた。
- `jac:eval:step4:brief` は `Action Routing` を返すようにし、`hotspot source -> 影響する代表ケース -> 次に直す source-family rule` をそのまま ops brief へ流せるようにした。
- `jac:eval:step4:field` を追加し、`references/jac/eval/field-reviews/` の実ケースレビューを markdown / json brief に変換して evidence brief へ接続した。
- `jac:evidence:refresh:light` / `full` には `jac:eval:step4:field` も組み込み、phase gate が `evaluation_ready` に入った後は cleanup 継続ではなく `実ケース評価 -> hotspot -> 次修正` のループへ移れるようにした。
- `jac:eval:step4:brief` 自体も `field review` summary を読み、`Field Review Signals` と `Action Routing` に unresolved case / weak theme / field hotspot を反映できるようにした。
- これにより、実ケースレビューが入った後は `related_reading hotspot` だけでなく `実ケースで弱かった source family` が action queue の優先順位に直結する。
- `jac:evidence:brief` には `External Source Update Focus` を追加し、AskJAN / EARN / JobAccess / Canada など外部 lane の最新差分確認と source-family rule 点検を、field review とは別の定常作業として見える化した。
- `/jac` の Step 4 主表示は、`aiAssessment.citations` の card 直表示から、`buildStep4OutputModel` で組んだ structured 出力へ切り替えた。
- これにより、`根拠として使える情報` は `direct_basis` detail を資料単位で統合して表示し、`実践の参考資料` も `support catalog / practical preview / 補助資料` の3レーンで整理して見せる形になった。
- `executeAgenticPlan` の最終 evidence pool には source diversity を入れ、JEED の高スコア hit が上位を埋めても AskJAN / AskEARN / JobAccess など website source が一定数残るようにした。
- JobAccess では `getting-started-new-job / rights / discrimination / apprenticeship` 系の landing / admin URL を low-value lane に落とし、`save flexible` のような landing-page 由来文が runtime citation に残らないようにした。
- Canada では `HR specialist / duty to enquire / disability management program / recovery-benefit generality` を追加で low-value 化し、AskEARN では `sample policy / JAN referral / legal primer / event / org-program` の残存一般論をさらに落とした。
- AskEARN では `resources / acing-the-basics / toolkit` の page family も low-value lane に寄せ、Canada では `how-to-build-program / handling-cases-tool / fundamentals` の generic page family を skip 寄りにした。

## 意味

- Step 4 の最終表示は、ようやく `LLM citations の出来不出来に従属する trace 表示` から離れ始めた。
- これにより、Step 4 の basis / practical reference は `top 16 evidence の偶然` ではなく、Step 4 専用の wider pool と claims から再構成できる段階に入った。
- Step 4 の `根拠として使える情報` は、外部 aggregated guidance によって水増しされにくくなった。
- Step 4 の `実践の参考資料` は、単なる claim の羅列ではなく、実際に検索で当たった practical page の短い要約を見せられるようになった。
- これにより、`根拠` と `具体策のヒント` を混ぜずに扱える。
- artifact でも `direct_basis` が `1748 -> 1386` に下がり、`related_reading` は `368 -> 160` まで圧縮された。external aggregated guidance が `direct_basis` に残らない状態になった。
- `search_index` / `finder` / `index` 由来の claim は artifact から消え、`AskJAN` / `JEED` の索引ページが Step 4 を汚しにくくなった。
- Step 4 の `web-cache 由来の具体策ヒント` では、行動に結びつく具体文が上に来やすくなり、イベント案内や feedback widget のような low-value preview が出にくくなった。
- Step 4 の `web-cache 由来の具体策ヒント` は、勤務時間・疲労、認知負荷、感覚環境、身体負荷、会議対話、安全、メンタル負荷といった主要論点に応じて並び順と説明文が変わるようになった。
- Step 4 下段の citation card も、同じ主要論点に応じて reference が先に見えるようになった。
- Step 4 下段の citation card は、残った reference についても「一般説明」ではなく「今回の相談で使える具体文」が summary に出やすくなった。
- Step 4 下段の citation card は、見出し・summary・excerpt の3層が同じ相談文脈に揃い、generic な参考資料カードに見えにくくなった。
- Step 4 下段の citation card は、近い practical reference が束ねられることで card 数が減り、一覧としての読みやすさも上がった。
- Step 4 の reference は、一般的な制度・組織運用の説明よりも、本人と職場で何を確認し、どこを試し、どう見直すかが先に見える構成へ寄った。
- Step 4 の preview は、`この資料は対話に使うのか / 試行候補なのか / 見直しに使うのか` が先に分かるため、読む順番と使いどころが把握しやすくなった。
- Step 4 の citation detail も、英語原文の前に日本語の実務 lead が入ることで、detail を開いた瞬間の理解が速くなった。
- Step 4 の preview / citation detail は、原文抜粋を sample excerpt 側へ残しつつ、summary 側では「何をどう使うか」を日本語で先に読める構成へ寄った。
- Step 4 は、代表ケースで「本当に今の相談に寄った practical reference を返せているか」を継続比較できる段階に入った。
- Step 4 の basis 側でも、AskJAN 由来の boilerplate 汚染を regression として検出・抑止できるようになった。
- Step 4 の practical preview は、AskJAN や JEED の case だけが並ぶのではなく、JobAccess や Canada の guide も早い段階で見えるようになり、source family の偏りが減った。
- Step 4 の practical preview は、原文 title にナビゲーションやブランド名が混ざっていても、最初に見える1行が「今回何に使える資料か」を表しやすくなった。
- Step 4 の `related_reading` は、導入文・図表説明・制度の対象範囲だけを述べる weak statement が artifact から外れやすくなり、以後の ranking / summary / merge が concrete な文に寄りやすくなった。
- Step 4 の eval snapshot は `7 total / 7 passed` になり、AskJAN boilerplate に加えて low-value related reading の再混入も regression として監視できるようになった。
- Step 4 の `related_reading` は、抽象的な法的リスク訴求や救済導線の文がさらに混入しにくくなり、本人と職場の調整プロセスに使える practical line が上に残りやすくなった。
- practical preview は、候補数が少ないケースでも `abstract legal-risk` や `recourse` が紛れ込みにくくなり、対話に使える Canada / JobAccess 系の具体文が先に見えやすくなった。
- Step 4 の artifact 文面自体も、重複見出しや UI 由来の反復を抱えた statement が減り、EU / JobAccess 系の具体文がそのまま practical reference として読みやすくなった。
- Step 4 の artifact 自体も source family ごとの同文重複が消え、`related_reading` は `160 -> 79`、主要 source family も `AskEARN 43 -> 21`、`JobAccess 62 -> 21`、`Canada 42 -> 27` まで圧縮された。
- Step 4 の改善は wording tuning ではなく、`representative cases + artifact audits + hotspot metrics` で継続運用ループに乗る形へ移り始めた。
- Step 4 は phase gate 上も `evaluation_ready` に到達し、これ以上 source cleanup を無限に続ける段階ではなく、実ケースレビューを入れて `まだ弱い source family` を選んで直す段階に入った。
- Step 4 eval brief も、representative case と実ケース評価を別々に眺める形ではなく、同じ action routing の中で統合的に判断する段階へ進んだ。
- 第4の柱は `実ケース評価だけ` ではなく、`外部最新情報の収集・差分把握・更新反映` と `実ケース評価` の二本立てとして運用上も明確になった。
- Step 4 の最後の `根拠と情報源` も、整理済みの knowledge role を主材料に使う段階へ入り、裏側の整理が最終出力に反映され始めた。
- Step 4 の `web-cache 由来の具体策ヒント` は、表示の整理だけでなく上流 evidence pool 自体も source 偏重が緩和され、JEED だけに寄った微妙な参考資料になりにくくなった。

## まだ残っていること

- `web-cache` の practical preview は、検索ヒットベースの抽出に consultation 条件の ranking を重ねた初段まで。source family 単位の最適化はまだ途中。
- `related_reading` にはなお低品質な statement が混ざる。特に一部の `document` 系 source では、一般論の紹介文や制度プロセスの文が残っている。
- `citation` 生成は role 分離まで完了したが、reference 専用の ranking / summarization / source family ごとの quality gate はまだ粗い。
- 残っている low-value reference は少数まで減ったが、なお一部の一般論ページや legal caveat は残る。
- representative eval は source pool 固定で Step 4 の presentation logic を測る初版であり、runtime retrieval の multilingual 精度や実ケースでの使い勝手は field review で別途見続ける必要がある。

## 次の本丸

1. `web-cache` の practical source を source family 単位で監査し、一般論ページや legal caveat をさらに落とす
2. `related_reading` 専用の要約・短文化ルールを強め、Step 4 で実践に使える粒度へ寄せる
3. citation の claim 文自体を、相談条件に近い実践粒度へ寄せる生成/再要約へ進める
4. field review を feedback hotspot や founder review と接続し、Step 4 改善の打ち手を `実ケースの弱さ -> source family -> rule修正` で追えるようにする
