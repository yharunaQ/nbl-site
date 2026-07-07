# Next NBL Home Hero Image Directions v0

Date: 2026-07-06

## Navigation Card

- Lane: Falcon
- Current phase: next NBL public surface visual direction
- North star asset strengthened: public interface between human life and the expert knowledge network
- Target artifact: top-page hero image candidate set
- Smallest shippable slice: generate and preserve four Image-2.0 hero candidates for Founder comparison
- Done boundary: candidates exist as project assets with internal direction and boundary notes
- Not now: public approval, route replacement, final SEO image swap, legal/medical/employment/accommodation finality, individual consultation intake
- Risks: stock-photo blandness, disability-inspiration trope, abstract AI darkness, overclaiming that AI decides support
- Default next concrete step: choose one visual direction, then crop/test it in the actual top Hero layout before replacing the current asset

## Current Problem

The current top hero is warm but reads as a work-design meeting or workshop image. As the face of NBL, it does not yet carry enough brightness, human life, future orientation, or the sense that AI helps reveal a deeper manifold of work, support, time, environment, and participation.

## Candidate Assets

1. `public/images/nbl-home-hero-candidates/next-nbl-home-hero-life-window-image2-v1.png`
   - Direction: strongest human-life hook; smiling person, bright daily-life/work continuity, generous left-side copy space.
   - Best use: primary homepage hero if the first impression should be human, hopeful, and accessible.

2. `public/images/nbl-home-hero-candidates/next-nbl-home-hero-civic-table-image2-v1.png`
   - Direction: public-interest and inclusive co-design; people at a civic/work table with a visible manifold layer.
   - Best use: homepage or partnership/co-implementation section if public trust and collaboration should lead.

3. `public/images/nbl-home-hero-candidates/next-nbl-home-hero-life-panorama-image2-v1.png`
   - Direction: broad life panorama; work, commute, family, accessibility, and support are connected by a visible network.
   - Best use: conceptual top variant if NBL should immediately read as a society-scale system.

4. `public/images/nbl-home-hero-candidates/next-nbl-home-hero-consultation-manifold-image2-v1.png`
   - Direction: concrete consultation/design scene; warmer and less abstract than the current hero, but still professional.
   - Best use: secondary page or method/support page if the top needs a stronger consultation-support signal.

5. `public/images/nbl-home-hero-candidates/next-nbl-home-hero-diverse-manifold-image2-v2.png`
   - Direction: V2 implementation test; clearer diversity signal, multiple people, visible assistive-device/hearing-aid cues, life/work/commute/support vignettes, and stronger AI-assisted manifold relation lines.
   - Best use: primary homepage hero if the first impression should show NBL as a human-diversity and relation-reading knowledge network, not a single-person lifestyle photo.

## Default Recommendation

Use `diverse-manifold` as the current implementation test. It keeps the brightness and human hook from `life-window`, while making diversity and AI-assisted relation visibility more explicit.

Keep `life-window` as the gentler single-person alternate if V2 feels too visually busy. Keep `civic-table` as the strongest alternate if the top should emphasize public co-design and trust more than individual human-life hook.

## 2026-07-06 Implementation Test

The `life-window` asset was wired into the published home Hero test path and the Falcon preview home test path:

- `/` SEO image: `components/axiom/AxiomNextNblPublishedSitePage.tsx`
- `/` Hero visual: `components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx`
- final QA visual matrix: `lib/axiom/nextNblPublicCandidateFinalQa.ts`
- Axiom public site update definition: `lib/axiom/falconAxiomPublicSiteUpdatePlan.ts`
- Falcon preview home Hero background test: `components/falconLab/NextNblStaticSiteCandidate.tsx`

Visual QA notes:

- Desktop first view: brighter and more human than the previous dark/abstract Hero; headline contrast remains strong.
- Mobile CDP check at 390px: document scroll width remains 390px; Hero grid, headline, body, CTAs, and image stay inside the viewport.
- The visible manifold layer should be read as AI-assisted context visibility, not AI-owned judgment.

This is an implementation preview, not final public approval.

## 2026-07-06 V2 Implementation Test

Founder feedback on v1: good, but diversity and manifold visibility were still weak. The V2 test now uses `next-nbl-home-hero-diverse-manifold-image2-v2.png` for:

- `/` SEO image: `components/axiom/AxiomNextNblPublishedSitePage.tsx`
- `/` Hero visual: `components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx`
- final QA visual matrix: `lib/axiom/nextNblPublicCandidateFinalQa.ts`
- Axiom public site update definition: `lib/axiom/falconAxiomPublicSiteUpdatePlan.ts`
- Falcon preview home Hero background test: `components/falconLab/NextNblStaticSiteCandidate.tsx`

The top Hero CTAs under the title and the HOW-section CTAs were removed for this test because they competed with the primary first-view message. The remaining page entrances below the HOW section are preserved.

V2 boundary check: the visual should convey diversity and relation visibility, not disability inspiration, individual advice, AI certification, legal/medical/employment/accommodation finality, or public approval.

## 2026-07-07 V2 Near-Square Crop Test

The visible `/` Hero image now displays the same V2 source image in a near-square 5:4 crop, while keeping the original wide source asset intact. The crop is slightly right-weighted (`object-position: 51% center`) so the central smiling group, wheelchair user, and relation/manifold lines remain visible.

Reason: the wide V2 image carried diversity and manifold visibility, but the 16:9 card diluted the smile/human hook. A pure square made the faces stronger but became slightly vertically heavy. The 5:4 display is the current compromise: more human immediacy than 16:9, more relational breadth than 1:1.

## Boundary Notes

- These are internal Falcon visual candidates, not public approval.
- The visual layer can imply AI-assisted pattern visibility, but not AI-owned judgment.
- Avoid copy or captions that imply legal, medical, employment, accommodation, or case decisions.
- Avoid diagnosis-name or disability-category lookup framing.
- If a wheelchair or assistive-device signal is used, keep it ordinary and equal, not inspirational or pity-oriented.
- Before public replacement, test actual top layout contrast, mobile crop, alt text, and public-copy risk.

## Prompt Set Summary

All candidates used the same guardrails: photorealistic natural style, wide 16:9 Hero use, no text or logos, bright optimistic daylight, real human life as the hook, subtle manifold / knowledge-network layer, no robots, no hospital/legal imagery, no cyberpunk darkness, no diagnosis labels, no deterministic support claim.
