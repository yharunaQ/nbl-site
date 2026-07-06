# Next NBL Virtual News IA Repositioning v0

Date: 2026-07-06
Lane: Falcon / next NBL public delivery layer
Status: compromise implementation cut completed; not public approval

## Navigation Card

- Lane: Falcon
- Current phase: 次期NBL公開面の情報設計改装カット実装
- North star asset strengthened: 専門知識ネットワークを、現実課題に接続する安全な公開入口として見せる
- Target artifact: `NBLバーチャル・ニュース` と `8つの課題` のページ役割再配置案
- Smallest shippable slice: `/virtual-news` 上位ハブ、トップ/ナビ/記事からの導線、トップの6入口カード先頭への `バーチャルニュース` 配置、ツールキット側での `8つの課題の地図` 直行導線、ツールキットからのバーチャルニュース橋削除を実装する
- Done boundary: `/virtual-news` が公開ルート一覧・SEO・ナビに入り、15本の記事を既存URLのまま一覧化し、トップの6入口カード自体がWhat mapとして `バーチャルニュース` から始まり、トップ上段の重複地図画像とバーチャルニュース大型カードは削除され、ツールキットの `8つの課題の地図` は `/scene-entry` へ直接進み、バーチャルニュース記事一覧と中継橋はツールキットから外れ、ツールキット内コンテンツは入口棚 -> 選別図解・4コマ -> ウェブアプリ -> 場面別パッケージ -> 境界の順に整理され、関連テストと型チェックが通っている
- Not now: 本番公開ナビ変更、URL移行、リダイレクト、SEO canonical変更、記事内容の現在情報更新、公開承認、法務・医療・雇用・合理的配慮の判断
- Risks: 架空ニュースを実在ニュースや現行制度解説に見せること、8つの課題を社会接点の主役として過剰に背負わせ続けること、トップ導線を増やしすぎること
- Default next concrete step: previewで実画面を確認し、URL移行 / canonical / 旧記事パスの扱いを別判断として保留する

## Current Repo Truth

- 現行の公開ルートは `/`, `/virtual-news`, `/scene-entry`, `/work-design-views-guide`, `/case-readings`, `/articles-social-questions`, `/toolkit-studio`, `/work-condition-window`, `/theory-method-trust`, `/projects`, `/about-boundary`。
- `/virtual-news` は `NBLバーチャル・ニュース` の上位ハブとして公開ルート一覧 / SEO / primary nav candidateに入っている。
- `/scene-entry` は残しつつ、表示ラベルと導線は `課題地図` / `8つの課題の地図` に寄せている。
- `toolkit-studio` は `8つの課題の地図` を主役棚にし、棚カードから `/scene-entry` の地図本体へ直接進む。
- `NBLバーチャル・ニュース` は `toolkit-studio` には記事一覧も中継橋も残さない。個別記事URLは互換性のため `/toolkit-studio/virtual-news/[articleSlug]` にある。
- 既存メモ `toolkit-virtual-news-publication-cut-v0-2026-07-06.md` は、バーチャルニュースをツールキット内で公開リンク化するところまでを記録している。
- 今回の新しい論点は、公開済み/候補済みの棚の中身ではなく、サイト全体での役割順位である。

## Repositioning Hypothesis

Founder observation:

- `8つの課題` は、当初「NBL専門知識のユースケース」として置かれていた。
- しかし、現実の課題との接点が最も強く、かつNBL専門知識ネットワークのデモとして機能しているのは `NBLバーチャル・ニュース` ではないか。
- 一方で、`8つの課題` は理論的・体系的で、ツールキットや設計ガイドに近い。
- そのため、`NBLバーチャル・ニュース` がツールキットの奥にある現配置は、価値の見え方として弱い。

Codex reading:

- 妥当。`NBLバーチャル・ニュース` は、制度ニュース、企業運用、地域連携、支援体制、予算、相談線など、社会側の現実的な詰まりを「もし実装されたらニュースになる形」へ変換している。
- これはNBLの専門知識ネットワークの強み、つまり断片的な現実課題を本人・仕事・環境・支援・時間・制度の関係へ読み替える力を、最も直感的に見せる。
- `8つの課題` は重要だが、役割は「現実課題の最初のデモ」よりも「NBLが扱う問題空間の体系地図」に近い。

## Proposed Role Split

| Surface                   | Current role                                | Revised role                                                     |
| ------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `NBLバーチャル・ニュース` | ツールキット内の架空記事棚                  | 現実課題と専門知ネットワークをつなぐ第一級入口                   |
| `8つの課題`               | 4コマで見るユースケース入口                 | 課題空間を体系的に学ぶ地図 / ガイド / ツールキット寄りの整理面   |
| `NBLレポート`             | 社会の問いを論考化する記事入口              | ニュース型より深い論考・解説・批評の入口                         |
| `ツールキット`            | 図解・ニュース・4コマ・音楽・ウェブアプリ棚 | 会議・研修・共有で使う素材棚。バーチャルニュース記事棚は置かない |

## IA Options

### Minimal

- `/toolkit-studio/virtual-news/[articleSlug]` はそのまま。
- トップページと主要導線から `/virtual-news` へ直接リンクする。
- ナビのトップレベルは増やさず、トップの入口カードを `課題でつかむ` から `ニュースでつかむ` に寄せる。
- `8つの課題` は引き続き `/scene-entry` に置くが、トップ導線上の優先度を下げる。

Pros:

- ルート移行なしで最も早い。
- 既存記事URL、テスト、SEO影響が小さい。

Cons:

- URL上はまだツールキットの奥に見える。
- `NBLバーチャル・ニュース` が独立コンテンツであることは完全には伝わらない。

### Robust

- `/virtual-news` を新設し、バーチャルニュース一覧の正式ハブにする。
- 個別記事も `/virtual-news/[articleSlug]` へ移す。
- 旧 `/toolkit-studio/virtual-news/[articleSlug]` はリダイレクトまたは互換リンクにする。
- グローバルナビに `バーチャルニュース` を置く。
- `8つの課題` は `設計ガイド` または `ツールキット` 内の `課題地図` として再配置する。

Pros:

- 役割とURLが最も一致する。
- NBLの現実接点デモとして強く見える。

Cons:

- 公開IA変更、URL移行、SEO、リンク互換、テスト更新が必要。
- 公開承認前に進めるには大きい。

### Compromise

- `/virtual-news` の上位ハブだけを追加する。
- 既存の個別記事URL `/toolkit-studio/virtual-news/[articleSlug]` は当面維持する。
- `/virtual-news` は同じ記事データを使い、トップ・ナビ・NBLレポートから入れる。
- `toolkit-studio` 内のバーチャルニュース棚と中継橋は外し、ツールキットは素材本体と場面別パッケージに集中させる。
- `8つの課題` は当面 `/scene-entry` のまま残しつつ、ツールキット内では `8つの課題の地図` / `課題地図` の棚カードから直接 `/scene-entry` へ送る。

Pros:

- 価値の見え方を前面化しつつ、既存URLを壊さない。
- 公開候補面で試しやすい。
- 将来 robust 案へ移行しやすい。

Cons:

- 一時的に `/virtual-news` ハブと旧個別記事URL `/toolkit-studio/virtual-news/[articleSlug]` の二層構造になる。
- canonical / SEO 方針は別途決める必要がある。

## Recommendation

推奨は `compromise`。

理由:

- Founderの指摘どおり、`NBLバーチャル・ニュース` はNBL専門知識ネットワークの社会接点デモとして前面化すべき。
- ただし、公開済み/候補済みの個別記事パスを即時移行すると、公開IA・SEO・リンク互換の判断が混ざる。
- まず `/virtual-news` ハブを追加し、既存記事パスは保ったまま、読者の第一印象だけを正すのがよい。

## Implementation Cut Completed

2026-07-06に、合意済みの `compromise` 方針で実装した。

- Added `/virtual-news` as a top-level published route and SEO surface.
- Added `AxiomVirtualNewsHubPage`, using the existing `nblVirtualNewsArticles` data source.
- Kept individual article paths at `/toolkit-studio/virtual-news/[articleSlug]` for continuity.
- Updated the public primary nav candidate to place `バーチャルニュース` after `トップ` and remove `8つの課題` from the primary nav.
- Kept `/scene-entry` and shifted visible labels/copy toward `課題地図` / `8つの課題の地図`.
- Updated the toolkit shelf so `8つの課題の地図` is the main theory/system map entrance and links directly to `/scene-entry`.
- Removed the 15-card `NBLバーチャル・ニュース` article grid from `toolkit-studio`.
- Removed the `Virtual news bridge` section from `toolkit-studio`.
- Removed the extra `Issue map` relay section from `toolkit-studio`; the map body remains on `/scene-entry`.
- Reordered `toolkit-studio` content to entrance shelves -> selected infographics / 4-koma -> web apps -> use packages -> boundary.
- Updated the top page so the six entrance cards themselves function as the What map, with `バーチャルニュース` as the first card.
- Removed the standalone home map image and duplicate standalone virtual-news feature card above the six entrance cards.
- Replaced internal-sounding home copy about the entrance cards with reader-facing work-condition copy, and added three compact bottom utility cards for `NBLの専門性`, `サイト情報`, and `プロジェクト`.
- Replaced internal Article library copy about URL maintenance / hub positioning with reader-facing copy about the implementation conditions the fictional news format helps readers inspect.
- Added a small `Reality signals` shelf after the main Article library on `/virtual-news` for manually curated real-news items that resemble a virtual-news theme. The first entry records the user-provided Nikkei BP Human Capital Online article about SCSK's reasonable-accommodation guide and treatment-work support funding, connects it to the CAP/CAF-style virtual article, and keeps `ユーザー提供記事 / 原文確認` plus no-evaluation boundary copy visible.
- Reordered same-level navigation and reader path options so `設計ガイド` comes before `相談事例`: the public header tabs, all-pages menu, top six entrance cards, `/virtual-news` and `/projects` page menus, and public route list now support a systematic-guide-first reading path before individual consultation examples.
- Removed `課題地図` from the `全ページ` menu and mobile navigation lists. `/scene-entry` remains available through contextual links such as toolkit shelves and direct issue-map links, but it is no longer presented as a general site-wide menu item.
- Added three priority virtual-news articles as a professional-quality second pillar for daily work-contact issues: `team-fairness-work-allocation-redesign` for coworker fairness / workload / evaluation redesign, `medical-information-work-condition-translation` for translating medical information into work-condition memos, and `information-access-meeting-emergency-standard` for meeting, information-access, and emergency-communication standards.
- Founder correction: the priority treatment must not rely on a separate shelf alone. The articles themselves need sharper news-style headlines, concrete field detail, and article-specific photographs. Revised the three new articles away from abstract/head-heavy explanation and generic sticky-note group-work visuals, added non-workshop hero images, and tightened figure captions so diagrams correspond to the text rather than feeling arbitrary.
- Replaced the visible `reasonable-accommodation-system-design` hero image with a support-desk / assistive-tool / implementation-document photo direction to avoid the repeated post-it group-work visual pattern.
- Added a `/virtual-news` priority shelf, `いま現場に近い3つの未解決接点`, above the full article library as a navigation aid, not as the main quality solution.
- Updated article-page navigation so individual articles return to `/virtual-news` and `仕事設計ガイド`; removed the confusing `ツールキット内の棚` header link.
- Revised the treatment-work article away from public-facing `Axiom/NBLが...` promotional phrasing. It now treats the official treatment-work support flow as background and tells the S社 story through work-condition granularity, daily operation, and review triggers.
- Gave `/virtual-news` its own hub Hero caption so the top-level page does not inherit article-internal caption language.
- Confirmed `NBLの専門性` uses the `TheoryMethodTrustHeroDemoMovie` React/Canvas animation on the published route; the mp4/audio work files remain outside this deployment slice.
- Updated Final QA visual/copy contract wording for the new home alt and `8つの課題の地図`.
- Verification: targeted and related Jest suites passed; `npm run typecheck` passed.

Still not done:

- No full URL migration to `/virtual-news/[articleSlug]`.
- No redirects or canonical URL policy change.
- No current news, policy, source-status, legal, medical, employment, or accommodation judgment update.
- No runtime, provider, schema, or knowledge-network promotion.

## Candidate Site Structure

Primary navigation candidate:

- トップ
- バーチャルニュース
- 設計ガイド
- 相談事例
- NBLレポート
- ツールキット

Secondary / contextual placement:

- `8つの課題の地図`: 設計ガイド、ツールキット、NBL専門性ページから入る体系地図。ツールキットでは棚カードから `/scene-entry` へ直接進む。
- `NBLバーチャル・ニュース`: トップ、ナビ、NBLレポートから入る現実接点デモ。ツールキットには記事棚も中継橋も置かない。

Possible copy:

- `NBLバーチャル・ニュース`: 現実の課題を、仕事条件のニュース像として先に読む。
- `8つの課題の地図`: NBLが扱う古くて新しい問題空間を、体系的に見渡す。
- `ツールキット`: 図解、課題地図、4コマ、音楽、ウェブアプリを、会議・研修で使う素材棚。

## Public Copy Risk Review

- Short judgment: `usable_with_revision`
- Legal/compliance finality: 判定・制度解説・法的安全の保証にしない。
- Medical/employment/accommodation finality: 個別の就労可否、合理的配慮、医療判断、人事判断をしない。
- Human-judgment replacement: ニュース形式でも、AIやNBLが実装可否を決めるように見せない。
- Source/current-policy dependency: 実在ニュース、現行政策、統計、助成金、法令を述べる場合は公開時点の別確認が必要。
- Reality-signal shelf boundary: 実ニュースを祝う棚は、NBLによる企業施策評価、法令適合確認、合理的配慮の妥当性判断、治療と仕事の両立支援の正しさの認定ではない。原文確認と別レビューが必要。
- Work-design maturity: 現実課題を、本人・仕事・環境・支援・時間・制度の条件へ戻す役割は強い。
- Condition map integrity: 診断名や制度名からのショートカットではなく、関係者・手順・予算・相談線・評価を残す。
- Not public approval: このメモは公開IA承認、記事公開承認、法務/医療/雇用判断、知識昇格ではない。

## Pro Baton Pack

If escalating remaining IA decisions, the narrow decisions are:

1. 個別記事URLを将来 `/virtual-news/[articleSlug]` へ移すか。
2. 旧 `/toolkit-studio/virtual-news/[articleSlug]` の canonical / redirect 方針をどうするか。
3. `8つの課題の地図` を将来さらに設計ガイド / ツールキット配下へ移すか。

Codex default:

- `NBLバーチャル・ニュース` はトップレベルハブ化済みで、ツールキット内の記事一覧と中継橋からは外した。
- 個別記事URLは当面維持。
- `8つの課題` は `課題地図` 方向へリラベル済み。追加移動は別判断。

## Completed Implementation Slice

Founder合意後に完了した実装:

1. Add `/virtual-news` hub using existing `nblVirtualNewsArticles`.
2. Add a published route slug and SEO wrapper for the hub.
3. Update top/home/nav labels so `NBLバーチャル・ニュース` is visible without entering `/toolkit-studio`.
4. Keep existing article paths and add cross-links back to `/virtual-news`.
5. Rename top-level references to `8つの課題` where needed, without deleting `/scene-entry`.
6. Move the toolkit page emphasis to `8つの課題の地図`, link it directly to `/scene-entry`, and remove the virtual-news article grid and bridge from toolkit.
7. Reorder toolkit content as selected infographics / 4-koma -> web apps -> use packages -> boundary.
8. Add tests for nav visibility, hub article count, old path continuity, direct toolkit issue-map routing, toolkit ordering, and boundary wording.
9. Make the home six entrance cards the What map itself: replace the first `8つの課題` entrance with `バーチャルニュース` and remove the redundant map image / standalone virtual-news card above it.
