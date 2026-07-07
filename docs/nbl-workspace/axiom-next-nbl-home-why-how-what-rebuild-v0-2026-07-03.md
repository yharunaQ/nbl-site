# Axiom Next NBL Home Why / How / What Rebuild v0

Date: 2026-07-03
Lane: Falcon
Target: published Next NBL top page

## Current Slice

Rebuild the top page sequence so that the first screen gives the NBL why, the next section explains the method briefly, and the existing content/product map becomes the what.

## Design Decision

The top page should not become a long manifesto. Its job is to make the site understandable in one hit and then move readers into the strongest content and product surfaces.

Sequence:

1. Why: "障害者雇用・難病就労支援から、AI時代の仕事設計へ。"
2. How: "膨大で偏りを含む情報を、実践できる仕事条件の地図へ。"
3. What: "未解決の働きづらさは、仕事・社会参加設計の応用問題。" with the existing home entrance diagram and route cards.

The previous home hero diagram remains valuable, but its role is changed from the first hero to the what / entrance map. The first hero now carries the larger NBL necessity in a socially legible way: disability employment and rare/chronic disease work support reveal unresolved design problems that become more important in the AI era. NBL uses AI to reduce the cognitive load of reading complex person-work-environment-support interactions, while keeping human confirmation and practice at the center.

The hero lead begins with the AI-era context rather than only the design abstraction: AI is rapidly changing work and society, so the opening copy translates "diverse people interacting with society and environment" into a more immediately readable public phrase: designing work and social participation from human diversity and the combination of work, environment, and support. NBL then explains that this cannot be implemented by ideals alone and positions AI as support for lowering the reading / sense-making burden of human practice.

The first hero keeps only the "サイト情報" call to action. "プロジェクト" remains available in later sections where the reader already understands the why/how frame, but it is not used as an equal first-screen choice.

The first hero image is generated as `public/images/next-nbl-home-why-hero-imagegen-v1.png` with WebP companion `public/images/next-nbl-home-why-hero-imagegen-v1.webp`. The image avoids readable in-image text and uses a left-to-right transformation: fragmented employment-support / rare-disease work-support information -> AI-assisted contextual reading lens with human review -> condition map for person, work, environment, support, time, and evaluation. In the top hero it is displayed in a slightly cropped 4:3 frame, not at the raw 16:9-like ratio, so it reads as a primary face of the site rather than a long explanatory banner. This keeps the image as the face of the why while leaving the detailed what / entrance map in the lower section.

The home page now ends after the what / entrance-card grid and the shared boundary footer. The earlier bottom "For teams" band and the two-card "NBLの専門性 / サイト情報" reminder were removed from the home page to keep the top page focused on why -> how -> what. Those destinations remain available through the header, hero / how calls to action, and their own pages.

## 2026-07-07 Founder Recheck Adjustment

Founder reviewed the whole site and corrected the `How` section.

- Keep the `How` headline as `膨大で偏りを含む情報を、実践できる仕事条件の地図へ。`
- Add the explicit warning that domestic and international disability-employment-support information is vast, but direct summarization is dangerous.
- Restore the `NBLの専門性` link directly under the `How` explanation. This link is useful here because the warning naturally asks why NBL can read information differently, and the answer belongs on the expertise page.
- Do not restore the top hero's earlier `バーチャルニュース` / `サイト情報` button noise. The correction is only for the `How` explanation link.

Boundary: this is a public-surface copy / navigation refinement only. It is not public approval, source validity, legal / medical / employment / accommodation judgment, runtime movement, or knowledge promotion.

Visual direction: keep the page trustworthy and readable, but avoid an overly muted beige / ivory surface. The first hero uses a deep teal / ink lab tone so the site has a visible advanced-research core, while the how and what sections stay light for scanning and content entry. This is a visual hierarchy adjustment only; it does not change public approval status, IA, promises, or product scope.

## Boundary

This is a Falcon public-surface implementation change, not a public approval decision.

Not moved:

- public approval
- Heron migration
- individual consultation intake
- medical, legal, HR, or accommodation final judgment
- runtime, model, prompt, retrieval, DB, or schema behavior
- source/support validity
- knowledge promotion or `candidate_pattern`

## Swamp Guard

Keep the home page short. Do not expand the hero into a civilization-theory explanation. Avoid making public copy so defensive that the point disappears. Use the hero to create orientation, the how section to create trust, and the what section to send readers into concrete pages.
