# Axiom セツテンLab 内部プロトタイプ v0

Date: 2026-07-02
Lane: Falcon Lab
Status: implemented internal prototype / no public approval / no runtime or schema movement

## Navigation Card

- Lane: Falcon Lab
- Current phase: Axiom new-app exploration after the completed Waralife research lane
- North star asset strengthened: ICF-based structural reasoning, source-lens separation, human review, provider-agnostic AI packet use
- Target artifact: `/internal/axiom-setsuten-lab`
- Smallest shippable slice: NamiNote shared-data reading app shell with sample received sheet, simple reading view, consultation memo, AI handoff memo, tests, and this memo
- Done boundary: no real data intake, no persistence, no AI call, no public route, no advice or work-capacity judgment
- Not now: replacing NamiNote, reviving Waralife, external AI/API, DB/auth/schema, upload/import, runtime retrieval, support decision workflow, public release
- Risks: becoming another self-record app, treating research成果 as authority, letting AI packet become advice generation, developing in parallel with NamiNote
- Default next concrete step: add an output-lint checker for AI responses before any real user-owned AI handoff experiment

## Position

`Axiom セツテンLab` is a new Axiom/Falcon Lab app concept.

2026-07-02 correction: the first canvas exposed too much internal Falcon/Axiom machinery on the
main screen. The product should read as: "receive NamiNote shared data, then help a supporter or
joint-review partner think more carefully before the next conversation." Internal source-lens and
AI-boundary details should remain available, but should not dominate the first screen.

It is not:

- a successor to `わらいふ`;
- a maintenance release of the completed research app;
- a duplicate of `ナミノート`;
- a medical, welfare, employment, HR, or accommodation decision tool.

The completed research成果 may be used only as `bootstrap prior`: it helps identify why daily
variation, person-side records, supporter interpretation, work conditions, time, and environment
should be read together. It does not authorize copying the old app, borrowing its authority, or
turning old item structure into a deterministic support engine.

## Relationship To NamiNote

`naminote/` is an independent Vite/React app that Claude Code is developing as a person-owned
record and wave-translation notebook. Codex does not edit or depend on that folder in this slice.

The role split is:

- `NamiNote`: person-owned note, local record, selected sharing, wave visibility.
- `Axiom セツテンLab`: supporter / joint-review analysis app that receives a NamiNote share sheet, reads contact points, prepares consultation questions, and optionally exports an AI handoff memo.

The two concepts may later connect through an export/import or shared review packet, but that is
not approved in this slice.

## Prototype Route

Internal route:

- `/internal/axiom-setsuten-lab`

Implemented files:

- `lib/axiomSetsutenLab/axiomSetsutenLab.ts`
- `components/axiomSetsutenLab/AxiomSetsutenLabSurface.tsx`
- `pages/internal/axiom-setsuten-lab.tsx`
- `__tests__/axiom-setsuten-lab.test.tsx`

The page is `noindex,nofollow` and has no public navigation approval.

## Product Loop

```text
NamiNote shared sheet -> simple received-data summary -> careful reading -> consultation memo
-> optional AI handoff memo -> human joint review
```

This is intentionally not:

- record entry;
- advice execution;
- diagnosis-to-support routing;
- work-capacity judgment;
- support action recommendation;
- shared document generation.

## UI Simplification

The main UI now follows a mobile app shape closer to NamiNote:

- sticky app header;
- four bottom tabs: `受け取る`, `読む`, `相談メモ`, `AI用`;
- shared-data sample first, not boundary badges;
- source-lens detail collapsed into "見る角度";
- internal boundary text moved to `このアプリについて` and the AI memo tab.

The first screen should answer "what is this app?" before it answers "what are all the internal
governance rules?"

## Boundary Design

The app uses five source lenses:

- person record;
- work design;
- support review;
- health time;
- regional coordination.

The central rule is that lenses must not be averaged into one explanation. The user can hide and
show lenses to see how the contact map changes. This makes missing-context and source-collision
visible before any hypothesis becomes too attractive.

The AI handoff packet is limited to:

- missing variables;
- safer questions;
- alternative hypotheses;
- drift flags;
- consent and sharing-boundary risks.

AI must not:

- decide support content;
- judge work capacity;
- infer accommodation from diagnosis;
- decide workplace sharing;
- create sharing text without consent;
- treat hypotheses as facts;
- use research成果 or the old app as authority for a conclusion.

## Current Synthetic Scenarios

1. `morning_commute_contact`
   - 朝の立ち上がり、通勤混雑、到着後の余白、早番、支援接触を分ける。
2. `interpretation_collision`
   - 本人記録と支援者解釈を分け、意欲低下ラベルへの飛躍を止める。
3. `coordination_boundary_map`
   - 医療、職場、地域支援の情報境界が本人に戻る構造を地図化する。

All scenarios are synthetic and are not evidence, source validity, or support validity.

## Next Design Gate

Before connecting this to a real AI handoff or NamiNote export, add a response checker that marks
AI output as unsafe when it contains:

- support action refinement;
- A/B-test or implementation-step design;
- workplace-share copy;
- diagnosis-to-support inference;
- work-capacity or employability judgment;
- praise-heavy summary that hides missing variables.

That checker should remain offline and deterministic in the next slice.
