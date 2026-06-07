# Falcon Next NBL APSE-Inspired Virtual Forum Article Library Handoff v0

Date: 2026-06-04
Lane: Falcon / Falcon Lab
Status: internal handoff / article-library special content candidate / public copy未承認 / public IA未承認 / APSE非公式 / runtime未接続

2026-06-04 implementation note:

- Standalone Falcon Lab preview route added: `/preview/work-condition-forum`.
- This route is intentionally not connected from `/preview/falcon-next-nbl` or the article library yet.
- Purpose of the standalone page is to test virtual-forum appearance, 22-session structure, Packet 1 production grammar, and NotebookLM / YouTube production lane before next-NBL IA integration.
- Implementation files:
  - `pages/preview/work-condition-forum.tsx`
  - `__tests__/work-condition-forum-preview.test.tsx`

2026-06-04 production update:

- Full 22-theme production packet seed added: `docs/nbl-workspace/falcon-next-nbl-work-condition-forum-22-theme-production-packets-v0-2026-06-04.md`.
- Each theme now has an article seed, NotebookLM material, YouTube operator kit, Image-2.0 visual brief, and public-boundary memo.
- The actual NotebookLM video generation and YouTube upload remain founder/operator work; Codex supplies the structured material and boundary checks.
- Image-2.0 visual seed saved for the standalone preview: `public/images/work-condition-forum-virtual-stage-v1.webp`.
- The standalone page now uses the visual seed as a forum-stage hero while remaining unlinked from the next-NBL site.

2026-06-04 Packet 1 v1 update:

- Packet 1 production bundle added: `docs/nbl-workspace/falcon-next-nbl-work-condition-forum-packet-1-production-v1-2026-06-04.md`.
- Packet 1 now has five article v1 drafts, NotebookLM-ready materials, YouTube packages, visual/diagram briefs, and internal boundary reviews.
- Image-2.0 Packet 1 five-portal visual saved: `public/images/work-condition-forum-packet-1-five-portals-v1.webp`.
- The standalone page now shows the Packet 1 visual and status, but remains unlinked and not public-approved.

2026-06-04 virtual presenter correction:

- Virtual presenter program added: `docs/nbl-workspace/falcon-next-nbl-work-condition-forum-virtual-presenter-program-v1-2026-06-04.md`.
- The forum should not be produced as 22 NBL solo lectures. NBL is the editor, boundary keeper, and work-condition map provider; fictional composite presenters carry distinct standpoints and session styles.
- Packet 1 NotebookLM material now includes presenter standpoint, opening scene, central tension, two wrong readings, work-condition map, participant prompts, and what-not-to-conclude blocks.
- Image-2.0 virtual presenter wall saved: `public/images/work-condition-forum-virtual-presenter-wall-v1.webp`.

2026-06-06 completion / integration update:

- The standalone forum preview is now complete enough to hand back to the next-NBL integration thread.
- Current reader-facing hub route: `/preview/work-condition-forum-session-packages`.
- Current article route pattern: `/preview/work-condition-forum-text/[id]`, with `VF-01` through `VF-22`.
- The older `/preview/work-condition-forum` concept page should not be surfaced as the public-facing forum hub. Reusable intent from that page has been folded into the completed hub.
- Main implementation/data files:
  - `lib/falconLab/workConditionForum.ts`
  - `pages/preview/work-condition-forum-session-packages.tsx`
  - `pages/preview/work-condition-forum-text/[id].tsx`
  - `scripts/content/build-work-condition-forum-structured-articles.mjs`
  - `docs/nbl-workspace/work-condition-forum/structured-articles/`
  - `__tests__/work-condition-forum-session-packages-page.test.tsx`
  - `__tests__/work-condition-forum-text-page.test.tsx`
- Main visual/material assets:
  - generated fictional conference-city hero: `public/images/work-condition-forum-virtual-city-hero-v1.webp`
  - generated presenter photos: `public/images/work-condition-forum-presenters/vf-01.webp` through `vf-22.png`
  - infographics supplied by founder: `content-inbox/workdesign-forum`
  - slide PDFs supplied by founder: `content-inbox/workdesign-pdf`
  - YouTube links recorded in the forum metadata used by `lib/falconLab/workConditionForum.ts`.
- Completed page stance:
  - The hub is a simple virtual-forum front page with forum name, aim, generated venue image, 6 sessions, and 22 presentation cards.
  - Presentation cards link to the article pages, not to raw material links.
  - Article pages are the main reading experience, with summary overlay, infographic enlargement, slide link, embedded video, structured text, footer boundary, and next-presentation navigation.
  - Internal production terms such as `Falcon Lab`, `public未承認`, `NotebookLM素材`, `ARTICLE FIRST`, and construction-plan language should stay out of the reader-facing surface.
- Verification completed:
  - `npx jest __tests__/work-condition-forum-session-packages-page.test.tsx --runInBand`
  - `npx jest __tests__/work-condition-forum-text-page.test.tsx __tests__/work-condition-forum-session-packages-page.test.tsx --runInBand`
  - `npm run typecheck -- --pretty false`
- Local HTTP checks for `/preview/work-condition-forum-session-packages` and `/preview/work-condition-forum-text/VF-05`.

2026-06-06 next-NBL article-library integration update:

- `/preview/falcon-next-nbl/policy-research` now connects the completed forum hub as an article-library special series.
- Public placement is a featured block labeled `特別シリーズ` / `仕事条件デザイン・バーチャルフォーラム`, positioned before the ordinary article selector.
- The block links to `/preview/work-condition-forum-session-packages#forum-top`, so readers land on the forum hero rather than the session list.
- The 22 presentations are not rendered as 22 ordinary article cards in the main article list.
- Reader-facing copy stays simple: 6 sessions, 22 presentations, article pages, and the series aim.
- Reader-facing copy does not expose `Falcon Lab`, `public未承認`, `NotebookLM素材`, `ARTICLE FIRST`, construction-plan language, or APSE official / translated / partnership / certification wording.
- Boundary copy remains concise: no official partnership / translation / certification implication, no medical / legal / employment / HR / accommodation-validity finality, and no policy / current-statistics finality without separate live verification.

2026-06-07 entrance feature update:

- `/preview/falcon-next-nbl` now features the same special series as a lightweight entrance event after the product map and before the social-knowledge loop.
- The home feature is not a new product card and does not change the five-product IA.
- Reader-facing copy frames it as `記事集の特別企画`, not as a standalone APSE page, official event, translation, or certification.
- The home feature link also uses `/preview/work-condition-forum-session-packages#forum-top`.

## Navigation Card

- Lane: Falcon / Falcon Lab
- Current slice: APSE 2026 program-inspired virtual conferenceを、次期NBL `記事ライブラリ` の特別コンテンツ候補として接続する。
- North star asset strengthened: next NBL article library as a safe public interface to the Falcon work-condition knowledge network.
- Target artifact: `/preview/falcon-next-nbl/policy-research` article library integration direction and production packet handoff.
- Smallest shippable slice: special-series placement, routing, package grammar, first production packet, and coordination prompt to the next-NBL site thread.
- Done boundary: next-NBL site team can decide UI placement without treating the 22 sessions as ordinary article-card sprawl.
- Not now: public approval, APSE partnership claim, APSE official reproduction, live policy/legal verification, 22-session full production, image generation, Heron release.
- Risks: APSE translation/republication confusion, article-library overload, diagnosis/accommodation lookup drift, policy/current-law finality, special content becoming a sixth product.

## Source Basis

The local PDF `APSE_2026_Complete_Schedule-5_3_26-2.pdf` was read as an inspiration and theme-mapping source only.

Usable inspiration signals:

- Competitive integrated employment / Employment First as the broad conference spine.
- Job analysis, customized employment, informed choice, visual profiles, career pathways.
- Lived experience, language, dignity, trust, psychological safety.
- Youth transition, Pre-ETS, AAC, neurodivergent employment.
- Business engagement, HR translation, model employer, public-sector employment.
- Policy-practice feedback, funding, benefits, subminimum-wage-to-CIE system barriers.
- AI for employment support, AI policy, assistive technology, AI readiness.
- Mental health, trauma, sensory regulation, non-apparent disability, health and employment.
- Research, fidelity, quality indicators, customer benefit, research-provider partnership.

Not usable without separate review:

- APSE session text as translated public content.
- Presenter names, session formats, logos, schedule structure, or any appearance of official partnership.
- Current US policy/legal details as Japanese public claims.
- Any claim that APSE endorses, certifies, co-hosts, or is reproduced by NBL.

## Placement Decision

Recommended placement:

`記事ライブラリ` special content series, not a standalone sixth product.

Reader-facing series name candidate:

`仕事条件デザイン・バーチャルフォーラム`

Full candidate title:

`NBL仕事条件デザイン・バーチャルフォーラム 2026`

Subtitle:

`「働ける人を探す」から、「働ける条件を設計する」へ`

Why article library:

- The current article library already owns social questions, policy/research topics, SNS discomfort, and field-level contradictions.
- The APSE-inspired forum is a structured editorial series: it starts from social/professional questions and turns them into work-condition reading.
- Each session can produce an article, infographic, and post-reading question, while richer artifacts route outward to toolkit, studio, 21 views, and consultation cases.

Why not a new product:

- The forum is a publication/editorial format, not a new core NBL product.
- It should strengthen article library and route readers into existing product surfaces.
- Making it a sixth product would compete with article library, cognitive toolkit, and work-design studio.

## Relationship To Existing Next NBL Surfaces

| surface | role in this series |
| --- | --- |
| `記事ライブラリ` | parent surface; special series hub, session articles, session infographics, proceedings-style reads |
| `認知補助ツールキット` | destination for one-page infographics, workshop sheets, slide-derived handouts, facilitation tools |
| `仕事条件アセスメント相談事例集` | destination for case-like examples and consultation phrase conversion |
| `21視点ガイド` | destination for concepts that need reusable viewpoint cards |
| `モデル場面 / work-design studio` | destination for workshop / panel / role-play / fictional workplace scenes |
| SNS operation loop | generates short X-native questions and returns them to the series, without treating reactions as evidence |
| About / trust page | explains operator purpose and boundaries, not the forum itself |

## Article Library Integration Shape

Do not render 22 sessions as 22 ordinary cards in the main article list at first.

Use a two-level structure:

1. A featured special-series card on the article library page.
2. A special-series hub or article filter that lists packets and sessions.

Initial public-facing labels:

- `特別シリーズ`
- `仮想フォーラム`
- `仕事条件デザイン`
- `雇用率の先へ`

Avoid:

- `APSE公式`
- `APSE日本版`
- `APSE翻訳`
- `APSE認定`
- `海外先進事例をそのまま導入`

Possible UI card copy:

> APSE 2026周辺のテーマ群に着想を得て、日本の障害者雇用、難病・慢性疾患、メンタルヘルス、若者移行、企業支援、政策実装、AI活用を、NBLの仕事条件デザインとして読み直す仮想フォーラムです。公式提携や翻訳ではなく、公開前レビュー中の特別シリーズです。

## Series Architecture

Use 6 tracks, 22 sessions.

1. `基調・統合`
   - 雇用率の先へ
   - ラベルと言葉の向こうの就労経験
   - 支援ツールボックスの統合
   - 持続可能な雇用成果とは何か
2. `本人中心の仕事設計`
   - 観察から仕事をつくる
   - インフォームド・チョイス
   - ビジュアルプロフィールと支援記録
   - 収入・ベネフィット・キャリア設計
3. `見えない条件と健康時間`
   - 見えない障害・難病・症状変動
   - 就職不安・回避・離脱
   - 問題行動を勤務条件のサインとして読む
   - 心理的安全・トラウマ・感覚調整
4. `若者移行とキャリア`
   - 学校から仕事へ
   - ニューロダイバージェントな若者の成長設計
   - AAC・コミュニケーション支援を職場へ
5. `企業連携と制度実装`
   - HRを戦略パートナーへ
   - 企業連携は営業ではない
   - 自治体・公的部門をモデル雇用主にする
   - 政策を現場に閉じる
   - 福祉的就労から地域雇用へ
6. `AI・研究・評価`
   - AIは支援者を置き換えるのか、増幅するのか
   - 測るべきものを測る

Note: the current 22-session design has `AIポリシーと導入準備` as an independent session candidate. If the site team wants exactly 22 public cards, keep it as #21 and make `測るべきものを測る` #22 while moving the sustainability session into closing copy. If the editorial series wants cleaner public pacing, merge AI readiness into the AI session and keep sustainability as the closing article. Founder decision can stay lightweight.

## Production Packet Grammar

Each session packet should carry:

- `session_id`
- `track`
- `public_title`
- `central_question`
- `target_reader`
- `APSE_inspiration_signals`
- `NBL_reframing`
- `article_draft`
- `video_outline`
- `reading_script`
- `slide_outline`
- `one_page_infographic_brief`
- `proceedings_text`
- `generated_photo_prompt`
- `related_next_nbl_routes`
- `public_boundary_memo`
- `source_currentness_review_needed`
- `publication_status`

Public article rendering should show only:

- title
- target reader
- central question
- article body
- corresponding infographic
- post-reading question
- related NBL routes
- short boundary note

Internal-only fields:

- APSE mapping notes
- source/currentness status
- public-copy risk memo
- image prompt controls
- publication status
- APSE non-affiliation check

## First Packet Recommendation

Start with 5 sessions:

1. `雇用率の先へ`
2. `ラベルと言葉の向こうの就労経験`
3. `観察から仕事をつくる`
4. `見えない障害・難病・症状変動`
5. `AIは支援者を置き換えるのか、増幅するのか`

Why this packet:

- It defines the series' public grammar.
- It covers the article library's strongest existing lanes: employment quality, language/lived experience, job analysis, invisible illness/health time, and AI boundary.
- It lets the site team design one special-series hub without needing all 22 sessions complete.
- It creates immediate bridges to existing article categories and assets.

## Site-Team Implementation Suggestion

Current local preview routes:

- `/preview/work-condition-forum-session-packages`
- `/preview/work-condition-forum-text/VF-01` through `/preview/work-condition-forum-text/VF-22`
- Role: completed independent Falcon Lab preview for the virtual forum hub and 22 article pages.
- Constraint: do not surface as public-approved; integrate through the next-NBL article-library special-series IA after public copy / boundary / current-source review.

Minimal UI addition:

- Add one `特別シリーズ` feature block to the article library page.
- Add a category/filter entry: `特別シリーズ` if the article library uses filters.
- Link the featured block to the completed forum hub or migrate that hub under the article-library route.

Robust UI addition:

- Create a dedicated route under the article library, such as `/preview/falcon-next-nbl/policy-research?series=work-condition-forum` or a slug route if the site team prefers.
- Show the completed 6-session / 22-presentation structure.
- Avoid making the forum a top-level nav item.

Recommended compromise:

- Start with a featured block and internal series record on the article-library surface.
- Reuse the completed independent hub as the detail page, either by route migration or by wrapper route.
- Keep the old concept page hidden and remove or redirect it only after the next-NBL IA route is chosen.

## Boundary Requirements

Public copy must say:

- This is inspired by broad APSE 2026 theme areas, not an official APSE program, translation, partnership, or reproduction.
- NBL does not provide medical, legal, employment, HR, or accommodation-validity final judgment.
- Disability names, diagnosis names, and policy terms are entrances, not conclusions.
- Support logic is organized through person / job / environment / support / time / institution / evaluation interactions.
- Current law, policy, statistics, funding, and official-source claims require separate live verification and review before public use.
- Generated conference photos must depict fictional Japanese-facing virtual conference scenes and must not resemble real APSE presenters or real persons.

## Coordination Request For Next NBL Site Thread

Suggested message to send:

```text
APSE 2026 program-inspired virtual forum work has started in a separate Falcon content thread.

Please treat it as an `記事ライブラリ` special-series candidate, not a sixth product and not an APSE official/translated page.

Recommended placement:
- parent surface: `/preview/falcon-next-nbl/policy-research`
- public label: `特別シリーズ` / `仕事条件デザイン・バーチャルフォーラム`
- first UI move: featured special-series block or internal series filter, not 22 ordinary article cards
- first content packet: 雇用率の先へ / ラベルと言葉の向こうの就労経験 / 観察から仕事をつくる / 見えない障害・難病・症状変動 / AIは支援者を置き換えるのか、増幅するのか

Please keep:
- no APSE official partnership/reproduction implication
- no diagnosis-to-accommodation lookup
- no medical/legal/employment/accommodation finality
- no current policy/statistics claim without live verification
- no top-level product expansion before Packet 1 exists

Handoff artifact:
docs/nbl-workspace/falcon-next-nbl-apse-inspired-virtual-forum-article-library-handoff-v0-2026-06-04.md
```

## Next Concrete Step

In the `次期NBL統合構成を整理` thread, decide the article-library IA path and route label, then connect the completed forum hub as a special-series feature rather than adding 22 ordinary article cards to the main article list.
