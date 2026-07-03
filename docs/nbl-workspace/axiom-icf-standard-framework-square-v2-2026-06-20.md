# Axiom ICF Standard Framework Square v2

Date: 2026-06-20  
Lane: Falcon Lab  
Status: internal visual draft, not public-approved

## Navigation Card

- Lane: Falcon Lab
- Current phase: Axiom knowledge-to-visual translation
- North star asset strengthened: ICF-centered interaction literacy for the NBL core knowledge network
- Target artifact: square ICF framework infographic
- Smallest shippable slice: one Image-2.0-generated Japanese infographic following the standard ICF model
- Done boundary: asset exists, Japanese text is generated in-image, `個人因子` is included, standard ICF layout is preserved
- Not now: public approval, legal/medical/accommodation finality, individual case guidance, runtime or knowledge promotion
- Risks: text-generation typo risk, overclaiming support effect, turning an educational diagram into advice
- Default next concrete step: Founder review of text fidelity and visual density before any public/SNS adaptation

## Output Assets

- Final PNG: `public/images/axiom-icf-standard-framework-square-v2.png`
- Final WebP: `public/images/axiom-icf-standard-framework-square-v2.webp`
- Generated source image retained under Codex generated images: `/Users/YuichiroHARUNA/.codex/generated_images/019ee259-b7e2-73a3-b16d-33138e9c064d/ig_0c5b79649d33dcc1016a35dcc7bbbc819198ba155b73561bab.png`

## Correction From v0

Founder feedback:

- Do not rely on adding Japanese text after generation for this artifact.
- Assume Image-2.0 can handle Japanese correctly.
- Include ICF `個人因子` as an element.
- Prefer the standard ICF framework layout.

This v2 therefore uses direct in-image Japanese text and returns to the standard ICF arrangement:

- top: `健康状態`
- middle row: `心身機能・身体構造` / `活動` / `参加`
- bottom row: `環境因子` / `個人因子`

## Text Used In Image

- Title: `ICF（国際生活機能分類）`
- Subtitle: `生活機能は、健康状態と背景因子の相互作用で変わる`
- Health condition: `健康状態` / `症状変動・治療・通院`
- Body functions and structures: `心身機能・身体構造` / `疲労・痛み・集中・感覚`
- Activity: `活動` / `通勤・会議・手順・作業`
- Participation: `参加` / `働く・学ぶ・チームに入る`
- Environmental factors: `環境因子` / `道具・動線・情報形式・職場文化`
- Personal factors: `個人因子` / `強み・希望・経験・対処`
- Bottom message: `病名だけでなく、同じ場面で条件の組み合わせを見る`
- Interaction examples: `通院 × 繁忙期 × 回復`, `情報形式 × 会議参加`, `手順変更 × 確認先`

## Image-2.0 Prompt

```text
Use case: infographic-diagram
Asset type: square Japanese educational infographic for ICF / employment-support understanding
Primary request: Create a simple, catchy square infographic in Japanese that follows the standard ICF framework layout. Generate the Japanese text directly inside the image. Do not leave text blank for later overlay.

Required exact title text at top:
「ICF（国際生活機能分類）」

Required exact subtitle under title:
「生活機能は、健康状態と背景因子の相互作用で変わる」

Required standard ICF layout:
1. Top center box: 「健康状態」 with small example line 「症状変動・治療・通院」
2. Middle row, three boxes left to right:
   - 「心身機能・身体構造」 with small example line 「疲労・痛み・集中・感覚」
   - 「活動」 with small example line 「通勤・会議・手順・作業」
   - 「参加」 with small example line 「働く・学ぶ・チームに入る」
3. Bottom row, two boxes left to right:
   - 「環境因子」 with small example line 「道具・動線・情報形式・職場文化」
   - 「個人因子」 with small example line 「強み・希望・経験・対処」

Required arrow structure:
- Use clear two-way arrows between 「健康状態」 and each middle-row box.
- Use clear two-way arrows among the three middle-row boxes.
- Use clear two-way arrows from both bottom boxes up to the middle row.
- The diagram should visibly communicate dynamic interaction, not a one-way hierarchy.

Required bottom message text:
「病名だけでなく、同じ場面で条件の組み合わせを見る」

Required compact interaction examples, placed as three small rounded tags near the bottom message or side margin:
「通院 × 繁忙期 × 回復」
「情報形式 × 会議参加」
「手順変更 × 確認先」

Style/medium: clean vector-meets-soft-pencil educational infographic, modern Japanese public learning material, friendly but authoritative. Use simple icons inside or beside boxes: heart/medical calendar for health condition, body/brain icon for body functions, checklist/walking icon for activities, group icon for participation, building/tools icon for environmental factors, person/star icon for personal factors.
Composition/framing: square 1:1, very readable at social media size, generous margins, no decorative clutter. The ICF standard model layout must be immediately recognizable.
Color palette: warm ivory background, deep navy text, teal arrows, green/orange/coral accent boxes, high contrast. No purple-dominant palette.
Text constraints: All Japanese text must be legible and spelled exactly as specified. Do not add English labels. Do not add extra Japanese copy beyond the specified title, subtitle, labels, examples, and bottom message.
Avoid: nonstandard radial network layout, disease-to-support lookup feeling, medical-only hospital imagery, legal/compliance symbols, warning signs, tiny unreadable text, fake characters, pseudo-Japanese, logo, watermark.
```

## Boundary Review

Internal status: `review`

This can convey:

- ICF is a standard interaction framework.
- `個人因子` and `環境因子` are both background factors in the explanatory layout.
- Axiom examples can be used as small work-condition interaction tags without replacing the ICF model.

This must not replace:

- official ICF training
- individual consultation
- medical, legal, accommodation, employment, or ethical final judgment
- public approval of NBL copy or Axiom knowledge promotion

Not now:

- no_public_approval
- no_legal_or_accommodation_finality
- no_current_policy_claim_without_live_verification
- no_sensitive_material_reuse
- no_runtime_or_promotion_movement
