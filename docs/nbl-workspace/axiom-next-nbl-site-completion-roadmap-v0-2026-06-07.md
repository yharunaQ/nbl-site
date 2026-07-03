# Axiom Next NBL Site Completion Roadmap v0

Date: 2026-06-07
Lane: Falcon Lab -> Falcon -> public release after approval
Status: roadmap / no publication, public approval, runtime, prompt, retrieval, model/provider, DB/schema, source/support validity, candidate_pattern, or learning-update movement

## Goal

Complete and publish the Axiom-based next NBL site.

This means the next public NBL site is not a patched Falcon surface. It is a delivery layer generated from Axiom kernel objects that can preserve observation, inference, counter-hypothesis, missing context, implementation actor conditions, source-lens status, actionability band, cannot-yet-say limits, and human-review route.

## Progress Rule

Axiom core progress counts only when a slice strengthens one of:

- `kernel_build`
- `kernel_eval`
- `kernel_grounding`
- `kernel_display`
- `kernel_human_review_loop`

Everything else is `delivery_layer_not_core_kernel` until it exposes, translates, tests, or routes the kernel.

## 2026-06-12 Second-Opinion Control Reset

Active addendum: [Axiom Second-Opinion Control Reset v0](axiom-second-opinion-control-reset-v0-2026-06-12.md).

This reset is part of the roadmap. It prevents Axiom from drifting back into governance-shell expansion after the all-layer integrated-domain Founder review passed.

Current constraints:

- Freeze new Gate 8 / final-release / public-navigation / Founder-decision shell, receipt, payload, handoff, validation, ingestion, or return-hold modules while the next concrete work is page-body projection.
- Keep one active Founder review target per cycle. The active accepted object is the 10-unit / 37-substructure all-layer integrated-domain knowledge receipt.
- Treat tests as regression guards for structure, coverage, and boundaries, not as proof that domain interpretations are true.
- Continue the product-critical path: project accepted Axiom integrated-domain knowledge into next-NBL internal candidate page bodies.
- Design actual model-output evaluation later as offline `kernel_eval`, with no publication, public navigation, learning update, runtime/provider commitment, or production retrieval change.

Current result:

- `lib/axiom/integratedDomainKnowledgePageBodyProjection.ts` now projects the Founder-accepted 10 units and 37 substructures into all 9 next-NBL internal candidate page bodies.
- `/internal/axiom-next-nbl-public-candidate/[slug]` now renders these integrated-domain page bodies instead of the earlier L3/work-design-backbone drafts.
- `falconAxiomPublicSiteUpdatePlan` now treats Falcon page purpose, route labels, layout rhythm, and visual assets as delivery scaffolding only, while naming the Axiom content source as `founder_accepted_all_layer_integrated_domain_knowledge_page_body_projection`.
- The projection creates no new Founder review object, no new Gate 8 shell chain, and no public approval/publication/runtime/source-validity/learning movement.

## Site Completion Gates

### Gate 1: Kernel Build

Done when the typed interaction-hypothesis kernel contract and non-sensitive fixture exist and are protected by tests.

Current artifacts:

- `lib/axiom/interactionHypothesisKernelContract.ts`
- `data/specs/axiom/axiom_interaction_hypothesis_kernel.fixture-v0-2026-06-07.json`
- `__tests__/axiom-interaction-hypothesis-kernel-contract.test.ts`

### Gate 2: Kernel Eval

Done when saved/synthetic kernel objects can be checked against L3 scenario fixtures without model calls or runtime changes.

Current artifacts:

- `lib/axiom/interactionHypothesisKernelEvaluator.ts`
- `lib/axiom/interactionHypothesisKernelScenarioFixtures.ts`
- `__tests__/axiom-interaction-hypothesis-kernel-evaluator.test.ts`

Current status:

- The deterministic suite now covers all five existing L3 scenario fixtures from `data/specs/quality/falcon_expert_agent.core_eval_profile-v0-2026-06-07.json`.
- This remains non-runtime evaluation. It does not call a model, change prompts, change retrieval, approve sources/supports, approve public use, or publish the site.

### Gate 3: Kernel Grounding

Done when Axiom can state which fields are filled from `shared_evidence_foundation`, which are `falcon_bootstrap_prior`, and which remain `requires_axiom_eval`.

Current artifacts:

- `lib/axiom/interactionHypothesisKernelBuildGroundingContract.ts`
- `lib/axiom/interactionHypothesisKernelRealDerivedEvidenceProtocol.ts`
- `lib/axiom/interactionHypothesisKernelReviewPromotionPacket.ts`
- `lib/axiom/realDataScaleUpIntakeManifest.ts`
- `lib/axiom/realDataScaleUpIntegrationRun.ts`
- `lib/axiom/realDataSemanticIntegrationPolicy.ts`
- `lib/axiom/realDataSemanticIntegrationRunPlan.ts`
- `lib/axiom/realDataIntegratedDomainKnowledgeObject.ts`
- `lib/axiom/realDataIntegratedDomainKnowledgeL3ContrastReport.ts`
- `lib/axiom/realDataSemanticFacetCoverage.ts`
- `lib/axiom/realDataIntegratedDomainKnowledgeFounderReviewReceiptShell.ts`
- `data/specs/axiom/axiom_kernel_build_grounding_input.fixture-v0-2026-06-08.json`
- `data/specs/axiom/axiom_real_derived_health_time_evidence_packet.fixture-v0-2026-06-08.json`
- `__tests__/axiom-interaction-hypothesis-kernel-build-grounding-contract.test.ts`
- `__tests__/axiom-real-derived-evidence-kernel-build.test.ts`
- `__tests__/axiom-kernel-review-promotion-packet.test.ts`
- `__tests__/axiom-real-data-scale-up-intake-manifest.test.ts`
- `__tests__/axiom-real-data-scale-up-integration-run.test.ts`
- `__tests__/axiom-real-data-semantic-integration-policy.test.ts`
- `__tests__/axiom-real-data-semantic-integration-run-plan.test.ts`
- `__tests__/axiom-real-data-integrated-domain-knowledge-object.test.ts`
- `__tests__/axiom-real-data-integrated-domain-knowledge-l3-contrast-report.test.ts`
- `__tests__/axiom-real-data-semantic-facet-coverage.test.ts`
- `__tests__/axiom-real-data-integrated-domain-knowledge-founder-review-receipt-shell.test.ts`

Current status:

- Multi-scenario non-runtime evidence-foundation build/grounding packets exist for all five L3 scenario fixtures.
- Each packet binds evidence spans to `observation`, `inference`, `counterHypothesis`, `missingContext`, `implementationActorConditions`, `sourceLensStatus`, `actionabilityBand`, `cannotYetSay`, and `humanReviewRoute`.
- Falcon public pages and SNS progress are explicitly held as inherited frames requiring Axiom eval, not Axiom core truth.
- The review-driven promotion gate blocks source/support validity, `candidate_pattern`, runtime/public approval, publication, knowledge promotion, and learning update while allowing provisional kernel build, counter-hypothesis generation, missing-context question generation, and deterministic kernel improvement.
- Review-compression now bundles all five scenario packets into 8 framework-level review units under the 100-unit budget, avoiding instance-hypothesis review queues.
- A real-derived batch now covers all five L3 eval scenarios: the CR01 health-time/life-security respondent-derived packet, the JEED web-cache deep-reading policy/service coordination packet, the JEED web-cache deep-reading disclosure/work-procedure packet, the FT-Codex-03 supporter/workplace quality-evaluation packet, and the FT-Codex-03 public condition-window non-lookup packet all use only `references/derived` and `docs/nbl-workspace` summaries/cards, validate no raw/redacted/source text or field values are opened/exported, produce grounded kernels, and pass their matching L3 eval scenarios.
- The batch fixes the active invariant that AI deep reading creates auditable Kernel objects, not final advice, public copy, current policy claims, source/support validity, or learning updates.
- A review-driven promotion packet now maps the 8 compressed framework units into human-review-required promotion units while preserving internal provisional kernel work and blocking source/support validity, `candidate_pattern`, runtime/public approval, publication, knowledge promotion, and learning update.
- A real-data scale-up intake manifest now selects which derived/supporter/workplace/source-family packets can enter the next integration run, requires grounded kernel build and matching L3 eval, and states that all accepted packet hypotheses are reviewed through compressed framework units rather than individual hypothesis review.
- The manifest is now explicitly an overclaim gate, not a perfection gate: incomplete, partial, or biased evidence is admissible as reality-shadow input when it remains non-sensitive, traceable, and convertible into grounded kernel fields or an explicit hold.
- The first manifest-selected scale-up integration run now adds three accepted packets from CR02-CR05 remaining context readings, web-cache batch2 official underread axes, and FT-Codex-03 network reconnection. The integrated run has 8 packets across all five L3 scenarios, passes deterministic kernel build and L3 eval, routes all hypotheses through the review-driven promotion packet, and remains compressed to 8 framework-level review units under the 100-unit budget.
- A source-family utilization ledger now keeps Falcon/Heron-era evidence coverage visible to Axiom before site filling. It covers respondent surveys, supporter data, workplace data, workshop practice knowledge, manuals/documents, domestic web-cache, international web-cache, historical 2001 ABC, Stage 1 derived artifacts, L3/FT03 frames, and Falcon/Heron delivery artifacts, while marking delivery artifacts as `delivery_layer_not_core_kernel`.
- A stable kernel corpus/readout now consolidates the integrated batch and source-family utilization ledger into an internal object for display and review navigation. It binds each evidence packet to its build-grounding packet, kernel ID, scenario, source-family entries, grounded fields, eval pass status, review units, and internal-only use boundary.
- A second source-family scale-up wave now adds respondent surveys, supporter practice, workplace surveys, workshop practice knowledge, 2001 ABC, and international web-cache as six derived non-sensitive packets. All six pass deterministic kernel build and L3 eval, attach to the stable corpus/readout, and project the internal corpus to 14 kernel items across all five L3 scenarios.
- A manual/document source-family attachment now adds one derived non-sensitive packet from local document metadata, normalized manifest, and document object refs. It does not open PDF text, raw originals, source text, redacted text, or field values; it passes deterministic kernel build and L3 policy/service/source-lens eval, then expands the corpus to 15 kernel items.
- A compact review/readout display adapter now exposes the 15 internal kernel items by source family, L3 scenario, grounded fields, actionability band, missing-context slots, cannot-yet-say count, and compressed review unit while hiding raw originals, source text, field values, public recommendations, and source/support validity.
- The adapter is now wired into `/internal/axiom-next-nbl-preview` as kernel-display-only inspection before any public page filling.
- A source-family kernel coverage audit now compares the 15-item corpus against the 11-entry source-family utilization ledger, with all 10 core-eligible source families represented and Falcon/Heron delivery artifacts excluded from core truth.
- A compact corpus sufficiency gate now passes 10/10 checks for 15 items, 10/10 core-eligible source families, five L3 scenarios, grounded-field coverage, eval pass status, review routing, review budget under 100, hidden raw/public/validity fields, delivery-layer exclusion, and unmoved validity/public/runtime/learning guardrails. This only allows internal slot planning from the kernel corpus; it does not approve public page filling, review execution, promotion, or publication.
- A 15-item corpus compressed human-review packet/readable checklist now converts the current corpus review-unit index plus source-family coverage and cross-corpus boundary into review units under the 100-unit budget. It preserves reality-shadow use of imperfect evidence, traceability without raw/source text, counter-hypothesis and missing-context visibility, actionability-band non-finality, source/support/public/runtime/learning blocks, and review-result-before-promotion checks. It is displayed in `/internal/axiom-next-nbl-preview` as core review navigation only; review execution, reviewer assignment, source/support validity, `candidate_pattern`, public approval, publication, runtime/prompt/retrieval/model/provider/DB/schema, and learning update remain unmoved.
- A dedicated internal human-review tool now exposes the same packet as practical review controls at `/internal/axiom-kernel-corpus-human-review-tool`: a top-level numbered 18-item review list with human-readable titles, review questions, accept/revise/hold criteria, compact per-item decision/note inputs, detail-toggle review-target dossiers, and a Founder review result receipt. The detail dossiers show included scenarios/source families, what the reviewer must judge, what they must not judge, and per-kernel-row observation, inference, counter-hypothesis, missing context, source lens, actionability band, cannot-yet-say, evidence-span summary, actor-condition, and data-policy readout. The Founder result accepts all 18 units as provisional kernel structure and allows kernel-backed public content-slot translation, while the tool itself still does not submit, persist, approve, publish, assign reviewers, execute review, or ingest into DB/runtime.
- The 2026-06-11 real-data semantic integration correction is now implemented as a core-gate layer before public page-body expansion. `realDataSemanticIntegrationRunPlan` selects all 14 non-sensitive real-derived packets from the 8-packet scale-up integration run plus the 6-packet source-family wave2 attachment, covers survey data, workshop/practice materials, manuals/documents, domestic web-cache, international web-cache, Stage 1 SCIMA/FCHMA outputs, and FT03 boundaries, and limits Xhigh guidance to semantic context reading and integrated-knowledge build. `realDataIntegratedDomainKnowledgeObject` builds the first six-axis integrated domain knowledge candidate under the 100-unit review budget. This is an Axiom domain-knowledge candidate, not L3 direct content, final 21/27 view count, source/support validity, `candidate_pattern`, public approval, runtime movement, publication, or learning update.
- `realDataIntegratedDomainKnowledgeL3ContrastReport` now compares the six Axiom integrated axes against all 27 L3 seeds as bootstrap-prior coverage/contrast/gap/merge/split/rename/hold material only. It keeps final view count unfixed and compresses review to six axes plus one contrast summary, not 27 public views.
- `realDataSemanticFacetCoverage` now raises the active semantic-coverage target above the 85-90% floor region. The six axes are top-level review compression only, not final domain resolution. The current coverage rule sets 95% as minimum acceptable coverage, 97% as the active target through 42 semantic facets, and 99% as aspirational after residual watchlist review/hold. Low-frequency, high-risk, jurisdiction/history, disclosure/discrimination, pre-entry, post-hiring quality, and other diversity facets must remain visible before public-surface projection.
- `realDataIntegratedDomainKnowledgeFounderReviewReceiptShell` now converts the integrated-domain review into 9 Founder-review units: six axis+facet bundles, coverage policy, residual watchlist, and L3 contrast summary. The shell covers all 42 facets and all residuals, stays under 100 review units, and blocks surface projection until an external Founder receipt accepts, revises, splits/merges, or explicitly holds every unit. It is not a Founder decision, source/support validity, public approval, publication, runtime movement, or learning update.

### Gate 4: Axiom Theme Object

Done when one theme object can feed all site surfaces without inventing new public sections.

Required surface families:

- reader-facing top/home
- work-condition window
- consultation case-reading collection
- inherited 21 views / work-design guide slot, rebuilt as kernel-derived work-design views whose count is not fixed
- theory / method / trust page
- article / social-question library
- cognitive support toolkit / studio / multimodal objects
- about / operating-boundary page
- scene entry / use cases

The inherited "21 views" wording is not a fixed Axiom result. The L3 21 principal interaction patterns plus six cross-cutting axes are `falcon_bootstrap_prior` seeds for `kernel_eval`; Axiom may keep, merge, split, rename, drop, or hold them before producing the public work-design views guide.

Current artifacts:

- `lib/axiom/siteSurfaceSlotContract.ts`
- `lib/axiom/kernelDerivedWorkDesignViewsContract.ts`
- `lib/axiom/kernelDerivedWorkDesignViewSet.ts`
- `lib/axiom/kernelSemanticWorkDesignViewDerivation.ts`
- `lib/axiom/workDesignViewsGuideSemanticReconstruction.ts`
- `lib/axiom/workDesignViewBackboneSurfacePropagation.ts`
- `lib/axiom/workDesignBackboneSurfaceDraftAssembly.ts`
- `lib/axiom/falconAxiomPublicSiteUpdatePlan.ts`
- `lib/axiom/realDataSemanticIntegrationPolicy.ts`
- `lib/axiom/realDataSemanticIntegrationRunPlan.ts`
- `lib/axiom/realDataIntegratedDomainKnowledgeObject.ts`
- `lib/axiom/realDataIntegratedDomainKnowledgeL3ContrastReport.ts`
- `lib/axiom/realDataSemanticFacetCoverage.ts`
- `lib/axiom/realDataIntegratedDomainKnowledgeFounderReviewReceiptShell.ts`
- `components/axiom/AxiomIntegratedDomainKnowledgeReviewSurface.tsx`
- `pages/internal/axiom-integrated-domain-knowledge-review.tsx`
- `components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx`
- `pages/internal/axiom-next-nbl-public-candidate/index.tsx`
- `pages/internal/axiom-next-nbl-public-candidate/[slug].tsx`
- `__tests__/axiom-site-surface-slot-contract.test.ts`
- `__tests__/axiom-kernel-derived-work-design-views-contract.test.ts`
- `__tests__/axiom-kernel-derived-work-design-view-set.test.ts`
- `__tests__/axiom-kernel-semantic-work-design-view-derivation.test.ts`
- `__tests__/axiom-work-design-views-guide-semantic-reconstruction.test.ts`
- `__tests__/axiom-work-design-view-backbone-surface-propagation.test.ts`
- `__tests__/axiom-work-design-backbone-surface-draft-assembly.test.ts`
- `__tests__/axiom-falcon-axiom-public-site-update-plan.test.ts`
- `__tests__/axiom-real-data-semantic-integration-policy.test.ts`
- `__tests__/axiom-real-data-semantic-integration-run-plan.test.ts`
- `__tests__/axiom-real-data-integrated-domain-knowledge-object.test.ts`
- `__tests__/axiom-real-data-integrated-domain-knowledge-l3-contrast-report.test.ts`
- `__tests__/axiom-real-data-semantic-facet-coverage.test.ts`
- `__tests__/axiom-real-data-integrated-domain-knowledge-founder-review-receipt-shell.test.ts`
- `__tests__/axiom-integrated-domain-knowledge-review-surface.test.tsx`
- `__tests__/axiom-next-nbl-public-candidate-site-surface.test.tsx`

Current status:

- Initial non-runtime surface slot contract exists.
- Every inherited next-site surface is mapped to kernel fields.
- Every required kernel field is mapped to at least one surface.
- Falcon site composition remains a prior map, not Axiom content.
- The inherited 21-view slot is now explicitly a kernel-derived work-design views guide: L3 21/27 remains bootstrap prior, the final view count is not fixed, and count-changing kernel movements are allowed before public copy.
- The first current-eval view set now compresses the L3 21 principal pattern seeds plus six cross-cutting axes into five current kernel-derived view candidates traced to all 15 internal kernel corpus items. This is not a final view count, public copy, source/support validity decision, `candidate_pattern` promotion, publication approval, runtime change, or learning update.
- A semantic derivation bridge now distinguishes the 15-item kernel corpus, 18 compressed kernel review units, and L3 27 semantic seeds. The 15 items are evidence-grounded reasoning material, not work-design view content. The 18 units are provisional kernel-structure / boundary acceptance, not semantic approval of the work-design views. The 27 L3 seeds remain content-rich semantic priors to be reconstructed through Axiom eval, not fixed final Axiom view count.
- A work-design views guide semantic reconstruction layer now creates 27 internal seed-level content candidates and five section candidates from the L3 semantic prior while using the 15-item corpus only as grounding pressure and the 18-unit receipt only as continuation permission. These are not public copy, final view count, completed semantic review, source/support validity, `candidate_pattern` promotion, runtime movement, publication approval, or learning update.
- A work-design backbone surface propagation layer now maps that semantic reconstruction to all 9 next-NBL surfaces as review-required internal slot candidates. It defines surface-specific seed/section selection counts, keeps the inherited work-design guide as the source surface, identifies the other 8 downstream surfaces, and preserves review routing before public body copy. This is `kernel_display` / `kernel_eval` / `kernel_human_review_loop`, not public copy, actual public navigation, publication, final view count, source/support validity, `candidate_pattern` promotion, runtime movement, or learning update.
- A work-design backbone surface draft assembly layer now converts the 9 propagation slots into 9 surface-specific internal body draft candidates. Each draft has a page heading candidate, opening frame, body-section candidates, source seed questions/roles, and three surface review questions. These draft candidates are displayed inside the internal reviewed page list and candidate routes, but remain review-required internal drafts rather than public copy, public navigation, publication approval, runtime movement, or learning update.
- A Falcon-to-Axiom public-site update plan now fixes how the existing Falcon final-site purpose and layout are reused. Falcon page purposes, nav roles, hero rhythm, visual assets, and home/detail page posture are delivery scaffolding only; Falcon public copy is not Axiom core truth. After the 2026-06-12 Founder/second-opinion correction, the plan covers all 9 Axiom surfaces, restores Falcon NS-04 "場面から入る" as an independent scene/use-case entrance, demotes SNS circulation to an article/about operating route, uses progressive disclosure instead of forcing heavy context strips everywhere, and prevents page-by-page manual reconstruction drift.
- A Founder-review public-like candidate route now renders the 9 surface body drafts as readable next-NBL page candidates under `/internal/axiom-next-nbl-public-candidate/[slug]`. The route inherits Falcon final-page context, navigation posture, hero/layout rhythm, and visual assets as delivery scaffolding. Its current 7+6+7+5+2 backbone display is provisional and now explicitly blocked from direct page-body expansion until real-data semantic integration creates an Axiom integrated domain knowledge object. It remains internal, noindex, not actual public navigation, not final public approval, not publication execution, not runtime movement, and not learning update.
- 2026-06-11 correction: a real-data semantic integration policy now supersedes direct public page-body expansion from L3 27 seed or the temporary 7+6+7+5+2 backbone. The 15/18-item kernel is an epistemic reading and expression skill, not a domain-content inventory. L3 27 is Falcon bootstrap prior for contrast, coverage, gap detection, merge/split/rename/drop/hold pressure, and possible post-integration naming; it is not Axiom content source, core truth, fixed final view count, semantic review completion, or source/support validity. The next core step is to build an Axiom integrated domain knowledge object from survey data, workshop summaries, manuals/practice documents, domestic/international web-cache, Stage 1 SCIMA/FCHMA outputs, and FT03 boundaries, then compare against L3 27 only as bootstrap prior. Xhigh-level reasoning is recommended for the semantic context-reading and integrated-knowledge build passes; deterministic contracts, tests, and route shells do not require Xhigh or runtime/provider changes.
- The first run of that correction is now present: the run plan selects 14 real-derived input packets and the integrated domain knowledge object candidate compresses them into six reviewable domain axes before any L3 contrast or page projection. The axes are candidate components only; final work-design view count remains unfixed and must pass Founder review or explicit hold before public-candidate page body generation.
- The high-diversity semantic facet layer now expands those six axes into 42 facets before projection. This treats 85-90% as insufficient except as a floor, preserves diversity coverage as a first-class kernel-eval requirement, and blocks six-axis-only public projection.
- The integrated-domain Founder review receipt shell now turns this into 9 review units and keeps projection blocked until an external Founder receipt covers every unit. This prevents Codex from inventing a review result and prevents low-resolution 6-axis-only page filling.
- `/internal/axiom-integrated-domain-knowledge-review` now renders a discovery-first Founder review surface. It starts with six clear-cut, general-reader Axiom hypothesis cards that state the plain conclusion, what Axiom found, how the reading changes, the review question, and likely next-site use. The six integrated axes, 42 semantic facets and residual watchlist, 9-unit receipt shell, and L3 27 contrast table remain available only under a collapsed audit disclosure, so the Founder reviews the actual hypothesis content rather than repeated control-layer representations. This review surface is internal/noindex and does not create actual public navigation, public approval, publication execution, runtime movement, source/support validity, or learning update.

### Gate 5: Surface Slot Map

Done when each surface defines which kernel fields it displays, translates, hides, or routes to review.

Current status:

- Initial slot map exists in `lib/axiom/siteSurfaceSlotContract.ts`.
- No page implementation should precede this slot map except urgent safety/factual-risk fixes.

### Gate 6: Kernel-Backed Content Slots

Done when public-readable content slots are filled from Axiom objects, not copied from Falcon page copy as core truth.

Falcon final site composition may remain a map. Falcon concrete copy remains `axiom_content_update_required` unless backcast to kernel fields.

Current artifacts:

- `lib/axiom/siteContentSlotBuilder.ts`
- `__tests__/axiom-site-content-slot-builder.test.ts`

Current status:

- Initial internal content slot bundle builder exists.
- Slots are generated from a kernel object plus the surface slot contract.
- Hidden and review-routed fields do not produce public draft text.
- Public-readable draft strings remain `not_public_approved`, `not_published`, and review-required.

### Gate 7: Internal Display And Review Loop

Done when internal users can inspect the kernel object separately from public/rendered copy and route framework-level review units.

Human review blocks promotion, publication, finality, source/support validity, `candidate_pattern`, `runtime_approved`, `public_approved`, and learning updates. It must not block internal provisional reasoning, scenario eval, deterministic kernel improvement, or kernel-object display.

Current artifacts:

- `lib/axiom/sitePreviewData.ts`
- `__tests__/axiom-site-preview-data.test.ts`
- `lib/axiom/humanReviewLoopContract.ts`
- `__tests__/axiom-human-review-loop-contract.test.ts`
- `lib/axiom/sitePreviewReviewMatrix.ts`
- `__tests__/axiom-site-preview-review-matrix.test.ts`
- `lib/axiom/siteCandidatePageData.ts`
- `__tests__/axiom-site-candidate-page-data.test.ts`
- `lib/axiom/siteCandidatePageRouteMap.ts`
- `__tests__/axiom-site-candidate-page-route-map.test.ts`
- `components/axiom/AxiomNextNblInternalPreview.tsx`
- `components/axiom/AxiomCandidatePageInspectionSurface.tsx`
- `pages/internal/axiom-next-nbl-preview.tsx`
- `pages/internal/axiom-next-nbl-candidate-pages.tsx`
- `__tests__/axiom-next-nbl-internal-preview.test.tsx`
- `__tests__/axiom-next-nbl-candidate-pages.test.tsx`

Current status:

- The first route-level internal preview data object exists.
- `/internal/axiom-next-nbl-preview` displays the Axiom kernel-backed site slot map and a condensed human review queue.
- The preview now displays a five-scenario preview/review matrix and stable candidate page-slot data for every fixed next-site surface.
- The preview now also displays the first internal candidate page data bundle for all nine fixed surfaces.
- `/internal/axiom-next-nbl-candidate-pages` renders the nine internal candidate page data objects through an internal route-map.
- Human review units are framework/surface-level, not instance-hypothesis-level.
- The first packet creates 11 review units: kernel contract, 9 fixed next-site surfaces, and one cross-surface boundary unit.
- The multi-scenario matrix covers all five L3 fixtures and all nine fixed surfaces without creating public copy or publication movement.
- Candidate page data remains internal slot assembly, not public route implementation or public copy.
- Candidate page route-map remains internal inspection only and does not add public navigation.
- The packet enforces the 100-unit review budget and still does not approve publication, runtime, source/support validity, `candidate_pattern`, `runtime_approved`, `public_approved`, or learning updates.

### Gate 8: Falcon Candidate Site

Done when the Axiom-backed site can run as a Falcon candidate surface and pass public-boundary, source/currentness, accessibility, and regression checks.

This is still not public approval.

Current artifacts:

- `lib/axiom/siteGate8PreflightContract.ts`
- `lib/axiom/siteGate8PreflightRunnerCriteria.ts`
- `lib/axiom/siteGate8PreflightRunnerReceipt.ts`
- `lib/axiom/siteFalconCandidateSurfaceReviewPacket.ts`
- `lib/axiom/siteInternalCandidateSurfaceImplementationScaffold.ts`
- `lib/axiom/siteInternalCandidateSurfaceRenderAdapter.ts`
- `lib/axiom/siteInternalCandidateSurfacePageShell.ts`
- `lib/axiom/siteInternalCandidateSurfacePageShellReviewPacket.ts`
- `lib/axiom/siteInternalCandidatePublicPagePreviewAssembly.ts`
- `lib/axiom/siteInternalCandidatePublicPageHoldPacket.ts`
- `lib/axiom/siteInternalCandidateReleaseReadinessLedger.ts`
- `lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket.ts`
- `lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest.ts`
- `lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell.ts`
- `lib/axiom/siteInternalCandidatePublicNavigationReleaseRouteShell.ts`
- `lib/axiom/siteInternalCandidateFinalPublicReleaseReviewPacket.ts`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionHandoffManifest.ts`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionReceiptShell.ts`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionIngestionContract.ts`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell.ts`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate.ts`
- `__tests__/axiom-site-gate8-preflight-contract.test.ts`
- `__tests__/axiom-site-gate8-preflight-runner-criteria.test.ts`
- `__tests__/axiom-site-gate8-preflight-runner-receipt.test.ts`
- `__tests__/axiom-site-falcon-candidate-surface-review-packet.test.ts`
- `__tests__/axiom-site-internal-candidate-surface-implementation-scaffold.test.ts`
- `__tests__/axiom-site-internal-candidate-surface-render-adapter.test.ts`
- `__tests__/axiom-site-internal-candidate-surface-page-shell.test.ts`
- `__tests__/axiom-site-internal-candidate-surface-page-shell-review-packet.test.ts`
- `__tests__/axiom-site-internal-candidate-public-page-preview-assembly.test.ts`
- `__tests__/axiom-site-internal-candidate-public-page-hold-packet.test.ts`
- `__tests__/axiom-site-internal-candidate-release-readiness-ledger.test.ts`
- `__tests__/axiom-site-internal-candidate-surface-promotion-request-packet.test.ts`
- `__tests__/axiom-site-internal-candidate-surface-promotion-handoff-manifest.test.ts`
- `__tests__/axiom-site-internal-candidate-public-release-decision-packet-shell.test.ts`
- `__tests__/axiom-site-internal-candidate-public-navigation-release-route-shell.test.ts`
- `__tests__/axiom-site-internal-candidate-final-public-release-review-packet.test.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-handoff-manifest.test.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-receipt-shell.test.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-ingestion-contract.test.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-shell.test.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-validation-gate.test.ts`
- `__tests__/axiom-gate8-preflight-runner-script.test.ts`
- `__tests__/axiom-gate8-preflight-runner-receipt-artifact.test.ts`
- `components/axiom/AxiomCandidateSurfaceImplementationScaffoldSurface.tsx`
- `components/axiom/AxiomCandidateSurfaceRenderAdapterSurface.tsx`
- `components/axiom/AxiomCandidateSurfacePageShellSurface.tsx`
- `components/axiom/AxiomCandidatePublicPagePreviewAssemblySurface.tsx`
- `components/axiom/AxiomCandidatePublicPageHoldPacketSurface.tsx`
- `components/axiom/AxiomCandidateReleaseReadinessLedgerSurface.tsx`
- `components/axiom/AxiomCandidateSurfacePromotionRequestPacketSurface.tsx`
- `components/axiom/AxiomCandidateSurfacePromotionHandoffManifestSurface.tsx`
- `components/axiom/AxiomCandidatePublicReleaseDecisionPacketShellSurface.tsx`
- `components/axiom/AxiomCandidatePublicNavigationReleaseRouteShellSurface.tsx`
- `components/axiom/AxiomCandidateFinalPublicReleaseReviewPacketSurface.tsx`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionHandoffManifestSurface.tsx`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionReceiptShellSurface.tsx`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionIngestionContractSurface.tsx`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionPayloadShellSurface.tsx`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionPayloadValidationGateSurface.tsx`
- `pages/internal/axiom-next-nbl-candidate-surface-scaffold.tsx`
- `pages/internal/axiom-next-nbl-candidate-surface-render-adapter.tsx`
- `pages/internal/axiom-next-nbl-candidate-surface-page-shell.tsx`
- `pages/internal/axiom-next-nbl-candidate-public-page-preview.tsx`
- `pages/internal/axiom-next-nbl-candidate-public-page-hold-packet.tsx`
- `pages/internal/axiom-next-nbl-candidate-release-readiness-ledger.tsx`
- `pages/internal/axiom-next-nbl-candidate-surface-promotion-request-packet.tsx`
- `pages/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest.tsx`
- `pages/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell.tsx`
- `pages/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell.tsx`
- `pages/internal/axiom-next-nbl-candidate-final-public-release-review-packet.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate.tsx`
- `__tests__/axiom-next-nbl-candidate-surface-scaffold.test.tsx`
- `__tests__/axiom-next-nbl-candidate-surface-render-adapter.test.tsx`
- `__tests__/axiom-next-nbl-candidate-surface-page-shell.test.tsx`
- `__tests__/axiom-next-nbl-candidate-public-page-preview.test.tsx`
- `__tests__/axiom-next-nbl-candidate-public-page-hold-packet.test.tsx`
- `__tests__/axiom-next-nbl-candidate-release-readiness-ledger.test.tsx`
- `__tests__/axiom-next-nbl-candidate-surface-promotion-request-packet.test.tsx`
- `__tests__/axiom-next-nbl-candidate-surface-promotion-handoff-manifest.test.tsx`
- `__tests__/axiom-next-nbl-candidate-public-release-decision-packet-shell.test.tsx`
- `__tests__/axiom-next-nbl-candidate-public-navigation-release-route-shell.test.tsx`
- `__tests__/axiom-next-nbl-candidate-final-public-release-review-packet.test.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest.test.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell.test.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract.test.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell.test.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate.test.tsx`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.ts`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellSurface.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell.test.tsx`
- `lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell.ts`
- `__tests__/axiom-site-internal-candidate-founder-final-release-decision-payload-return-hold-shell.test.ts`
- `components/axiom/AxiomCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellSurface.tsx`
- `pages/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell.tsx`
- `__tests__/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell.test.tsx`
- `scripts/axiom/run-gate8-preflight-receipt.mjs`
- `references/axiom/axiom-gate8-preflight-runner-receipt-v0-2026-06-07.json`
- `references/axiom/axiom-gate8-preflight-runner-receipt-v0-2026-06-07.md`
- Gate 8 display sections in `components/axiom/AxiomNextNblInternalPreview.tsx`
- Gate 8 hold display in `components/axiom/AxiomCandidatePageInspectionSurface.tsx`

Current status:

- First Gate 8 preflight contract exists.
- First Gate 8 runner/criteria packet exists as an internal required-not-run check packet.
- First executable Gate 8 runner receipt exists and currently records `passed_internal_preflight_not_promoted`.
- First Falcon candidate-surface review packet exists as review input, not review execution or promotion.
- First internal candidate-surface implementation scaffold exists for all nine fixed next-NBL surfaces.
- First internal candidate-surface render adapter exists for all nine fixed next-NBL surfaces.
- First internal candidate-surface page shell exists for all nine fixed next-NBL surfaces.
- First internal candidate-surface page-shell review packet exists with 11 review units and review execution still `not_executed`.
- First internal candidate-public-page preview assembly exists for all nine fixed next-NBL surfaces.
- First internal public-boundary/accessibility/regression hold packet exists with 11 hold units and review execution still `not_executed`.
- First internal candidate-release readiness ledger exists and records `not_ready_public_release_hold`.
- First internal candidate-surface promotion request packet exists as `human_review_input_only`, records 11 request units from 66 readiness entries, and remains `not_submitted_by_codex` / `not_promoted`.
- First internal Founder/reviewer promotion handoff manifest exists as `founder_reviewer_handoff_input_only`, records 11 handoff units, and remains `prepared_not_sent_by_codex`, `not_decided`, `not_executed`, and `not_promoted`.
- First internal public-release decision packet shell exists as `public_release_decision_review_input_only`, records 11 release/no-release decision units, and remains `not_decided`, `not_approved`, `not_published`, and `not_released`.
- First internal public-navigation release route shell exists as `public_navigation_release_route_review_input_only`, records 11 navigation route units, and remains `not_added`, `not_activated`, `not_approved`, and `not_published`.
- First internal final public-release review packet exists as `final_public_release_review_input_only`, records 11 final review units, and remains `not_executed`, `not_assigned_by_codex`, `not_added`, `not_approved`, and `not_published`.
- First internal Founder final-release decision handoff manifest exists as `founder_final_release_decision_handoff_input_only`, records 11 handoff units, and remains `prepared_not_sent_by_codex`, `not_decided`, `not_executed`, `not_added`, `not_approved`, and `not_published`.
- First internal Founder final-release decision receipt shell exists as `founder_final_release_decision_receipt_shell_not_received_input_only`, records 11 receipt units, and remains `not_received`, `not_decided`, `not_executed`, `not_added`, `not_approved`, and `not_published`.
- First internal external Founder decision ingestion contract exists as `founder_final_release_decision_ingestion_contract_empty_not_ingested`, records 11 ingestion units, and remains `empty`, `not_ingested`, `not_received`, `not_decided`, `not_executed`, `not_added`, `not_approved`, and `not_published`.
- First external Founder decision payload schema shell exists as `founder_final_release_decision_payload_shell_empty_fixture_only`, records 11 payload units, and remains `declared_empty_fixture`, `empty`, `not_accepted`, `not_ingested`, `not_received`, `not_decided`, `not_approved`, and `not_published`.
- First external Founder decision payload validation gate exists as `founder_final_release_decision_payload_validation_gate_empty_payload_rejected`, records 11 validation units, and remains `not_run`, `not_validated`, `rejected_before_ingestion`, `empty`, `not_accepted`, `not_ingested`, `not_decided`, `not_approved`, and `not_published`.
- First external Founder decision payload validation receipt shell exists as `founder_final_release_decision_payload_validation_receipt_shell_not_received_empty_payload_rejected_input_only`, records 11 receipt units, and remains `not_received`, `not_run`, `not_validated`, `rejected_before_ingestion`, `empty`, `not_accepted`, `not_ingested`, `not_decided`, `not_approved`, and `not_published`.
- First external Founder decision payload return/hold shell exists as `founder_final_release_decision_payload_return_hold_shell_empty_payload_rejected_waiting_external_completion`, records 11 return/hold units, and remains `payload_return_hold_prepared`, `external_payload_shell_completion_required`, `not_received`, `not_run`, `not_validated`, `rejected_before_ingestion`, `empty`, `not_accepted`, `not_ingested`, `not_decided`, `not_approved`, and `not_published`.
- Required check categories are fixed: public-boundary, source/currentness hold, accessibility readiness, regression readiness, route promotion criteria, and human-review gate.
- First runner criteria are fixed: no public affordances, required hold labels, internal route rendering, Axiom contract regression, and Falcon eval preservation.
- All nine fixed next-site surfaces are on Gate 8 hold before Falcon candidate-surface promotion.
- Source/currentness, accessibility, regression, public boundary, and human review are visible as required before candidate promotion.
- Required regression targets explicitly include the existing Falcon expert-agent core eval profile so Axiom work cannot weaken it.
- The latest executed receipt artifact passed required Axiom/Falcon Jest targets, `npm run typecheck`, and HTTP 200 checks for twenty internal routes: `/internal/axiom-next-nbl-preview`, `/internal/axiom-next-nbl-candidate-pages`, `/internal/axiom-next-nbl-candidate-surface-scaffold`, `/internal/axiom-next-nbl-candidate-surface-render-adapter`, `/internal/axiom-next-nbl-candidate-surface-page-shell`, `/internal/axiom-next-nbl-candidate-public-page-preview`, `/internal/axiom-next-nbl-candidate-public-page-hold-packet`, `/internal/axiom-next-nbl-candidate-release-readiness-ledger`, `/internal/axiom-next-nbl-candidate-surface-promotion-request-packet`, `/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest`, `/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell`, `/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell`, `/internal/axiom-next-nbl-candidate-final-public-release-review-packet`, `/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest`, `/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell`, `/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract`, `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell`, `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate`, `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell`, and `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell`.
- Gate 8 runner now separates pre-run targets from the post-run receipt artifact test, so a failed receipt can be repaired without self-referential test lock-in.
- The candidate-surface review packet compresses review into 11 units: 9 surface reviews, one cross-surface boundary review, and one Gate 8 receipt review. Review remains `not_executed` and reviewer assignment remains `not_assigned_by_codex`.
- `/internal/axiom-next-nbl-candidate-surface-scaffold` renders the internal implementation scaffold, section render modes, required review decisions, and no-promotion/no-public boundary.
- `/internal/axiom-next-nbl-candidate-surface-render-adapter` renders the internal component-interface adapter, stable component kinds, section render modes, and no-promotion/no-public boundary.
- `/internal/axiom-next-nbl-candidate-surface-page-shell` renders the internal page shell, stable page region kinds, kernel-field-only content source, and no-promotion/no-public boundary.
- The internal preview displays the page-shell review packet as review input for region kind mapping, hidden/review-routed region handling, public draft candidate placement, and no-public-navigation/promotion boundaries.
- `/internal/axiom-next-nbl-candidate-public-page-preview` renders the internal candidate-public-page preview assembly, stable preview block treatments, kernel-field-only content source, and no-promotion/no-public boundary.
- `/internal/axiom-next-nbl-candidate-public-page-hold-packet` renders the internal public-boundary/accessibility/regression hold packet, required hold categories, and no-release/no-promotion boundary.
- `/internal/axiom-next-nbl-candidate-release-readiness-ledger` renders the internal release-readiness ledger, separates internal regression pass from held release gates, and keeps `not_ready_public_release_hold`.
- `/internal/axiom-next-nbl-candidate-surface-promotion-request-packet` renders the internal promotion request packet as review input only, condenses 66 ledger entries into 11 request units, and keeps request submission, candidate promotion, public navigation, and public release blocked.
- `/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest` renders the internal Founder/reviewer handoff manifest as review handoff input only, keeps the handoff prepared but not sent, and keeps Founder decision, review execution, candidate promotion, public navigation, and public release blocked.
- `/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell` renders the internal release/no-release decision shell as review input only, lists Founder release decision, human review execution, source/support validity, public boundary, accessibility, regression-currentness, public-navigation plan, and rollback/correction playbook requirements, and keeps public approval, publication, public navigation, and release blocked.
- `/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell` renders the internal public-navigation release route shell as review input only, lists explicit Founder public-navigation decision, external public-release approval, source/support validity, boundary/accessibility, regression-currentness, rollback/correction, no personal-data intake, and no runtime/learning-update requirements, and keeps actual public navigation, route activation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-final-public-release-review-packet` renders the internal final public-release review packet as review input only, lists Founder final public-release review, human review execution outside Codex, public-navigation authorization outside Codex, source/support validity decision outside Codex, boundary/accessibility/regression receipt, rollback/correction/no-intake boundary, runtime freeze, and learning-update block requirements, and keeps review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest` renders the internal Founder final-release decision handoff manifest as handoff input only, lists Founder-outside-Codex decision, human review outside Codex, source/support validity outside Codex, no Codex route activation, no Codex public approval/publication, rollback/correction/no-intake boundary, runtime freeze, and learning-update block requirements, and keeps handoff sending, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell` renders the internal Founder final-release decision receipt shell as not-received input only, lists Founder decision receipt, release/no-release naming, human review receipt, source/support validity receipt, public-navigation authorization receipt, public approval/publication receipts, rollback/correction/no-intake confirmation, and runtime/learning freeze requirements, and keeps receipt ingestion, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract` renders the internal external Founder decision ingestion contract as empty/not-ingested input only, lists external Founder decision payload, release/no-release naming, human review evidence, source/support validity evidence, public-navigation authorization, public approval/publication evidence, rollback/correction/no-intake confirmation, and runtime/learning freeze requirements, and keeps payload ingestion, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell` renders the external Founder decision payload schema shell as empty fixture only, lists external Founder decision payload, release/no-release declaration, human review execution evidence, source/support validity evidence, public-navigation authorization, public approval/publication evidence, rollback/correction/no-intake confirmation, and runtime/learning freeze fields, and keeps payload acceptance, ingestion, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate` renders the external Founder decision payload validation gate as not-run/empty-payload-rejected input only, lists non-empty payload fields, release/no-release declaration, human review execution evidence, source/support validity evidence, public-navigation authorization, public approval/publication evidence, rollback/correction/no-intake confirmation, and runtime/learning freeze validation requirements, and keeps payload validation execution, payload acceptance, ingestion, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell` renders the external Founder decision payload validation receipt shell as not-received/not-validated input only, lists external validation receipt, valid/invalid payload naming, empty payload rejection receipt, human review execution evidence receipt, source/support validity receipt, public-navigation authorization receipt, public approval/publication receipts, and runtime/learning freeze confirmation requirements, and keeps validation receipt ingestion, payload validation execution, payload acceptance, ingestion, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- `/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell` renders the external Founder decision payload return/hold shell as empty-payload-return-hold input only, lists empty-payload rejection visibility, external payload completion outside Codex, validation receipt before ingestion retry, required payload field preservation, human review/source-support validity hold, public navigation/public approval/publication block, runtime freeze, and learning-update block requirements, and keeps external payload completion, payload validation execution, payload acceptance, ingestion, Founder decision, review execution, reviewer assignment, actual public navigation, public approval, publication, and release blocked.
- This does not promote the route-map to Falcon candidate surface, add public navigation, publish content, approve public use, decide source/support validity, or move runtime/prompt/retrieval/model/provider/DB/schema.

### Gate 9: Public Release

Done only after Founder/public approval and the final release packet.

This roadmap does not approve publication.

## Current Packet

Current packet: `kernel_eval` plus first `kernel_display` and `kernel_human_review_loop` planning/content-slot/display/review contracts.

Done boundary:

- deterministic evaluator exists
- five Axiom kernel fixtures pass the existing L3 scenario suite
- evaluator fails closed on lost L3 pattern coverage or boundary movement
- first surface slot contract maps all inherited next-site surfaces to kernel fields
- first content slot builder generates internal review-required slots from kernel and surface contracts
- first route-level internal preview data object and internal preview page exist
- first framework-level human review packet exists with 11 units, under the 100-unit limit
- five-scenario preview/review matrix exists across all L3 fixtures
- stable candidate page-slot data exists for all nine fixed next-site surfaces
- internal candidate page data bundle exists for all nine fixed next-site surfaces
- internal candidate page route-map and renderer exist for all nine fixed next-site surfaces
- Gate 8 preflight contract exists and holds all nine fixed surfaces before Falcon candidate-surface promotion
- Gate 8 runner/criteria packet exists with five required-not-run criteria and required regression targets, including Falcon eval preservation
- Gate 8 runner receipt exists with passed internal preflight evidence and still does not promote candidate/public release
- Falcon candidate-surface review packet exists with 11 compressed review units and still does not execute review, assign reviewer, or promote candidate/public release
- internal candidate-surface implementation scaffold exists for all nine fixed surfaces and still does not add public navigation or promote candidate/public release
- internal candidate-surface render adapter exists for all nine fixed surfaces and still does not add public navigation or promote candidate/public release
- internal candidate-surface page shell exists for all nine fixed surfaces and still does not add public navigation or promote candidate/public release
- internal candidate-surface page-shell review packet exists with 11 review units, under the 100-unit limit, and still does not execute review, assign reviewer, add public navigation, or promote candidate/public release
- internal candidate-public-page preview assembly exists for all nine fixed surfaces and still does not add public navigation or promote candidate/public release
- internal public-boundary/accessibility/regression hold packet exists with 11 hold units, under the 100-unit limit, and still does not execute review, assign reviewer, add public navigation, or promote candidate/public release
- internal candidate-release readiness ledger exists with 11 ledger units and 66 ledger entries, and still does not execute review, assign reviewer, add public navigation, or promote candidate/public release
- internal candidate-surface promotion request packet exists with 11 request units from 66 readiness entries, under the 100-unit limit, and still does not submit a request, execute review, assign reviewer, add public navigation, or promote candidate/public release
- internal Founder/reviewer promotion handoff manifest exists with 11 handoff units, under the 100-unit limit, and still does not send a handoff, decide Founder/reviewer status, execute review, assign reviewer, add public navigation, or promote candidate/public release
- internal public-release decision packet shell exists with 11 release/no-release decision units, under the 100-unit limit, and still does not decide release, approve public use, publish content, add public navigation, execute review, assign reviewer, or decide source/support validity
- internal public-navigation release route shell exists with 11 navigation route units, under the 100-unit limit, and still does not activate a route, add actual public navigation, approve public use, publish content, execute review, assign reviewer, or decide source/support validity
- internal final public-release review packet exists with 11 final review units, under the 100-unit limit, and still does not execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- internal Founder final-release decision handoff manifest exists with 11 handoff units, under the 100-unit limit, and still does not send handoff, decide Founder status, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- internal Founder final-release decision receipt shell exists with 11 receipt units, under the 100-unit limit, and still does not receive Founder decision, decide release/no-release, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- internal external Founder decision ingestion contract exists with 11 ingestion units, under the 100-unit limit, and still does not accept a decision payload, ingest a payload, decide release/no-release, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- external Founder decision payload schema shell exists with 11 payload units, under the 100-unit limit, and still does not fill a decision payload, accept a payload, ingest a payload, decide release/no-release, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- external Founder decision payload validation gate exists with 11 validation units, under the 100-unit limit, and still does not run payload validation, accept a payload, ingest a payload, decide release/no-release, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- external Founder decision payload validation receipt shell exists with 11 receipt units, under the 100-unit limit, and still does not receive validation receipt, run payload validation, accept a payload, ingest a payload, decide release/no-release, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- external Founder decision payload return/hold shell exists with 11 return/hold units, under the 100-unit limit, and still does not complete a payload, receive validation receipt, run payload validation, accept a payload, ingest a payload, decide release/no-release, execute review, assign reviewer, activate a route, add actual public navigation, approve public use, publish content, or decide source/support validity
- existing Falcon expert-agent core eval remains passing

## Not Now

- public-site publication
- public approval
- public IA redesign
- SNS posting or social operation changes
- runtime / prompt / retrieval / model/provider movement
- DB/schema movement
- source validity or support validity decision
- `candidate_pattern`
- `runtime_approved`
- `public_approved`
- learning update

## Swamp Risks

- creating public pages before the kernel-backed slot map exists
- expanding review paperwork without scenario evaluation
- treating Falcon site copy as Axiom content
- optimizing UI before kernel fields are stable
- widening into SNS operations before theme objects are kernel-backed

## Next Concrete Step

The Founder review result now accepts all 18 compressed human-review units as provisional kernel structure. Stable reviewed kernel-backed public content slots have been built for all 9 next-NBL surfaces. The slot bundle covers all 15 current kernel rows and all bridge fields: `observation`, `inference`, `counterHypothesis`, `missingContext`, `implementationActorConditions`, `sourceLensStatus`, `actionabilityBand`, `cannotYetSay`, and `humanReviewRoute`. The reviewed candidate page assembly now converts the 37 reviewed slots into 9 internal page data objects with route intent only and no actual public navigation. `/internal/axiom-reviewed-next-nbl-pages` renders those 9 internal candidate pages with 37 traceable sections, and `/internal/axiom-next-nbl-reviewed-candidate/[slug]` now renders Falcon-like internal candidate routes from the same reviewed page objects. The next kernel-safe continuation is to inspect and tighten these 9 internal candidate routes for public-copy quality while preserving section IDs, slot IDs, source review units, kernel row IDs, field operations, hidden/review-routed sections, and final public-approval gates. Do not treat the receipt, slot bundle, page assembly, internal render surface, or candidate routes as final source/support validity, `candidate_pattern` promotion, individual case judgment, public approval, publication execution, raw/sensitive source-text export, runtime/prompt/retrieval/model/provider/DB/schema movement, or learning update.
