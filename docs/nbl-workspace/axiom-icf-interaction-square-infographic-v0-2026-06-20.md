# Axiom ICF Interaction Square Infographic v0

Date: 2026-06-20  
Lane: Falcon Lab  
Status: superseded internal visual draft, not public-approved

Supersession note: This v0 used a text-free Image-2.0 base plus local Japanese text overlay. Founder feedback on 2026-06-20 rejected that direction for this artifact. The current direction is to use Image-2.0-generated Japanese text directly and follow the standard ICF layout, including `個人因子` as its own framework element.

## Navigation Card

- Lane: Falcon Lab
- Current phase: Axiom knowledge-to-visual translation
- North star asset strengthened: ICF-centered interaction literacy for the NBL core knowledge network
- Target artifact: square ICF interaction infographic
- Smallest shippable slice: one generated visual base, one final labeled PNG/WebP, one reproducible overlay script
- Done boundary: asset exists, text is accurate, boundary status is recorded
- Not now: public approval, legal/medical/accommodation finality, individual case guidance, runtime or knowledge promotion
- Risks: disease-first drift, overclaiming support effect, treating campaign visual as professional advice
- Default next concrete step: review wording and decide whether to adapt into site/SNS surfaces after separate public-copy review

## Output Assets

- Final PNG: `public/images/axiom-icf-interaction-square-v1.png`
- Final WebP: `public/images/axiom-icf-interaction-square-v1.webp`
- Image-generated base: `public/images/axiom-icf-interaction-square-base-v1.png`
- Overlay renderer: `scripts/content/render-axiom-icf-interaction-square.mjs`

## Core Message

ICF should be understood as a map for seeing interactions, not as a disease-name-to-support lookup.

Final headline:

> ICFは「相互作用」を見る地図

Final subhead:

> 国際生活機能分類：からだ・活動・参加・環境・個人因子を同じ場面で見る

Bottom message:

> 支援は「1点の配慮」より、相互作用のどこを変えるか。

## ICF / Axiom Content Map

| visual area | label | example shown |
| --- | --- | --- |
| top | 健康状態 | 症状変動 × 回復余地 / 治療・通院も時間軸で見る |
| upper left | 心身機能・構造 | 疲労・痛み・集中・感覚 / 仕事量や情報形式と結びつく |
| upper right | 活動 | 通勤・会議・手順・作業 / 道具や確認先で変わる |
| right | 参加 | 働く・学ぶ・チームに入る / 資料形式で会議参加が変わる |
| lower left | 環境因子 | 道具・動線・職場文化 / 静かな席や見える手順も条件 |
| center | 個人因子 | 強み・希望・経験・対処 |
| bottom | 時間 | 通院 × 繁忙期 × 回復 |
| lower right | 支援・制度 | 上司・支援者・制度 |

The Axiom examples intentionally emphasize:

- health time and work density
- information format and participation
- procedure change and switching load
- movement, tools, and contact points
- disclosure scope and evaluation separation
- preconditions for participation rather than person-blame

## Image-2.0 Base Prompt

```text
Use case: infographic-diagram
Asset type: square educational infographic base for a Japanese employment-support website
Primary request: Create a simple, catchy, square 1:1 infographic base explaining the ICF framework as interactions between a person, work, environment, support, time, and health/functioning. This is a text-free base image; all labels will be added later.
Scene/backdrop: warm off-white paper background with a friendly workplace consultation scene at the center: one worker, one supervisor, one support professional, a desk, laptop, notes, calendar, small plant. Around the scene, six clean rounded nodes connected by looping arrows, suggesting mutual influence and feedback. Leave generous blank space inside and near every node for later Japanese text overlay.
Subject: ICF-style interaction map: health condition/body functioning, activities, participation, environmental factors, personal factors, and work/support/time conditions represented by simple icons only: heart/health pulse, brain/body, walking/task checklist, group participation, building/tools, person/star, clock, handshake.
Style/medium: polished vector-meets-soft-pencil educational illustration, modern Japanese public-sector explainer, approachable and trustworthy, not corporate stock, no photorealism.
Composition/framing: square 1:1, central large circular scene, six to eight satellite nodes evenly arranged around it, clear curved arrows between nodes and back to center, bottom has one wide empty rounded caption band with no text.
Lighting/mood: bright, calm, optimistic, practical.
Color palette: warm ivory background, deep navy outlines, teal and emerald accents, small coral/orange highlights, restrained and high-contrast.
Constraints: Absolutely no readable text, no letters, no numbers, no pseudo-Japanese, no logos, no watermark. Keep all boxes blank and clean for later overlay. Make the arrows and nodes visually clear at social-media square size.
Avoid: medical-only imagery, disease-name lookup feeling, legal/compliance symbols, warning triangles, hospital scene, clutter, tiny details, decorative gradient blobs.
```

## Boundary Review

Internal status: `review`

This can convey:

- ICF is an interaction map.
- Work difficulty should be read through person / job / environment / support / time / institution conditions.
- A visual can open a conversation before detailed case analysis.

This must not replace:

- individual consultation
- medical, legal, accommodation, employment, or ethical final judgment
- official ICF training or source-verified policy explanation
- public approval of NBL copy or Axiom knowledge promotion

Likely misunderstandings to prevent:

- The graphic is a diagnostic tool.
- Every case can be solved by changing one visible condition.
- The examples are universal support recommendations.

Needed companion context before public use:

- "考える入口であり、個別判断ではない"
- "実際の支援は本人・仕事・環境・支援・時間・制度を確認して検討する"
- "公開利用には別途、文言・出典・権利・Founder review が必要"

Not now:

- no_public_approval
- no_legal_or_accommodation_finality
- no_current_policy_claim_without_live_verification
- no_sensitive_material_reuse
- no_runtime_or_promotion_movement
