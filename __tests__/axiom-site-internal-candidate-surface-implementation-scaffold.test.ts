import {
  AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE,
  AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY,
  buildAxiomInternalCandidateSurfaceImplementationScaffold,
  validateAxiomInternalCandidateSurfaceImplementationScaffold,
  type AxiomInternalCandidateSurfaceImplementationScaffold,
} from '@/lib/axiom/siteInternalCandidateSurfaceImplementationScaffold';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { buildAxiomFalconCandidateSurfaceReviewPacket } from '@/lib/axiom/siteFalconCandidateSurfaceReviewPacket';
import {
  AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS,
  buildAxiomGate8PreflightRunnerReceipt,
  buildNotRunAxiomGate8PreflightRunnerEvidenceInput,
  type AxiomGate8PreflightRunnerEvidenceInput,
} from '@/lib/axiom/siteGate8PreflightRunnerReceipt';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from '@/lib/axiom/siteGate8PreflightRunnerCriteria';
import { AXIOM_NEXT_NBL_SITE_SURFACES } from '@/lib/axiom/siteSurfaceSlotContract';

function buildPassingEvidence(targets: string[]): AxiomGate8PreflightRunnerEvidenceInput {
  return {
    jestEvidence: {
      evidenceId: 'axiom_gate8_jest_evidence_passed_for_surface_scaffold_test',
      status: 'passed',
      commandLabel: 'npx jest required Axiom/Falcon Gate 8 targets --runInBand',
      targets,
      summary: 'Required Axiom and Falcon Jest targets passed.',
    },
    typecheckEvidence: {
      evidenceId: 'axiom_gate8_typecheck_evidence_passed_for_surface_scaffold_test',
      status: 'passed',
      commandLabel: 'npm run typecheck',
      targets: ['tsc --noEmit'],
      summary: 'Typecheck passed.',
    },
    routeRenderingEvidence: {
      evidenceId: 'axiom_gate8_route_rendering_evidence_passed_for_surface_scaffold_test',
      status: 'passed',
      checkedInternalPaths: [...AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS],
      httpStatusByPath: Object.fromEntries(
        AXIOM_GATE8_INTERNAL_ROUTE_RENDER_TARGETS.map((path) => [path, 200]),
      ),
      summary: 'Internal Axiom routes returned HTTP 200.',
    },
  };
}

function buildSources() {
  const candidatePageDataBundle = buildAxiomCandidatePageDataBundle(
    buildAxiomSitePreviewReviewMatrix(),
  );
  const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
  const receipt = buildAxiomGate8PreflightRunnerReceipt(
    criteriaPacket,
    buildPassingEvidence(criteriaPacket.requiredTestTargets),
  );
  const reviewPacket = buildAxiomFalconCandidateSurfaceReviewPacket(receipt);

  return { candidatePageDataBundle, receipt, reviewPacket };
}

function cloneScaffold(
  scaffold: AxiomInternalCandidateSurfaceImplementationScaffold,
): AxiomInternalCandidateSurfaceImplementationScaffold {
  return JSON.parse(
    JSON.stringify(scaffold),
  ) as AxiomInternalCandidateSurfaceImplementationScaffold;
}

describe('Axiom internal candidate-surface implementation scaffold', () => {
  it('builds implementation scaffolds for all fixed next-NBL surfaces from reviewed slot data', () => {
    const { candidatePageDataBundle, receipt, reviewPacket } = buildSources();
    const scaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
      candidatePageDataBundle,
      reviewPacket,
    );
    const validation = validateAxiomInternalCandidateSurfaceImplementationScaffold(
      scaffold,
      candidatePageDataBundle,
      reviewPacket,
      receipt,
    );

    expect(validation).toMatchObject({
      valid: true,
      validationStatus: 'contract_valid',
      errorCount: 0,
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY,
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
    });
    expect(scaffold).toMatchObject({
      lane: 'Falcon Lab',
      coreProgressClasses: ['kernel_display', 'kernel_human_review_loop'],
      status: 'internal_candidate_surface_implementation_scaffold_not_promoted',
      boundary: AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_SCAFFOLD_BOUNDARY,
      routeBase: AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE,
      sourceCandidatePageDataBundleId: candidatePageDataBundle.bundleId,
      sourceReviewPacketId: reviewPacket.packetId,
      sourceReviewPacketStatus: 'candidate_surface_review_packet_prepared_not_promoted',
      sourceReviewExecutionStatus: 'not_executed',
      sourceReviewerAssignmentStatus: 'not_assigned_by_codex',
      sourceReceiptId: receipt.receiptId,
      implementationCount: AXIOM_NEXT_NBL_SITE_SURFACES.length,
      maxCoreReviewUnits: 100,
      reviewUnitCount: reviewPacket.reviewUnitCount,
      movementBoundary: {
        runtime: 'not_changed',
        prompt: 'not_changed',
        retrieval: 'not_changed',
        modelProvider: 'not_changed',
        dbSchema: 'not_changed',
        publicApproval: 'not_approved',
        publication: 'not_published',
        publicNavigation: 'not_added',
        falconCandidateSurfacePromotion: 'not_promoted',
        sourceValidity: 'not_decided',
        sourceCurrentness: 'not_decided',
        supportValidity: 'not_decided',
        candidatePattern: 'not_candidate_pattern',
        runtimeApproved: 'not_approved',
        publicApproved: 'not_approved',
        knowledgePromotion: 'not_promoted',
        learningUpdate: 'not_updated',
      },
    });
    expect(scaffold.implementations.map((implementation) => implementation.surface)).toEqual(
      AXIOM_NEXT_NBL_SITE_SURFACES,
    );
  });

  it('keeps every implementation internal, not promoted, not public approved, and not published', () => {
    const { candidatePageDataBundle, reviewPacket } = buildSources();
    const scaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
      candidatePageDataBundle,
      reviewPacket,
    );

    expect(
      scaffold.implementations.every(
        (implementation) =>
          implementation.internalImplementationPath ===
            `${AXIOM_INTERNAL_CANDIDATE_SURFACE_IMPLEMENTATION_ROUTE_BASE}#${implementation.surface}` &&
          implementation.internalImplementationPath.startsWith('/internal/') &&
          implementation.status === 'internal_candidate_surface_scaffold_not_promoted' &&
          implementation.routeStatus === 'internal_inspection_route_only_not_public_navigation' &&
          implementation.candidateSurfaceStatus === 'not_promoted_to_falcon_candidate_surface' &&
          implementation.publicUseStatus === 'not_public_approved' &&
          implementation.publicationStatus === 'not_published' &&
          implementation.publicNavigationStatus === 'not_added' &&
          implementation.reviewExecutionStatus === 'not_executed',
      ),
    ).toBe(true);
  });

  it('preserves source section counts and renders hidden or review-routed sections as placeholders', () => {
    const { candidatePageDataBundle, reviewPacket } = buildSources();
    const scaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
      candidatePageDataBundle,
      reviewPacket,
    );

    for (const implementation of scaffold.implementations) {
      const sourcePage = candidatePageDataBundle.pages.find(
        (page) => page.surface === implementation.surface,
      );

      expect(sourcePage).toBeDefined();
      expect(implementation.sectionScaffoldCount).toBe(sourcePage?.sectionCount);
      for (const sectionScaffold of implementation.sectionScaffolds) {
        const sourceSection = sourcePage?.sections.find(
          (section) => section.sectionId === sectionScaffold.sourceSectionId,
        );

        expect(sourceSection).toBeDefined();
        expect(sectionScaffold.reviewRequiredBeforeCandidatePromotion).toBe(true);
        expect(sectionScaffold.reviewRequiredBeforePublication).toBe(true);
        expect(sectionScaffold.publicUseStatus).toBe('not_public_approved');
        expect(sectionScaffold.publicationStatus).toBe('not_published');
        if (sourceSection?.sectionPolicy === 'internal_only_hidden_or_review_routed') {
          expect(sectionScaffold.renderMode).toBe('render_hidden_or_review_routed_placeholder');
        }
      }
    }
  });

  it('rejects scaffolds built against a not-run source receipt', () => {
    const candidatePageDataBundle = buildAxiomCandidatePageDataBundle(
      buildAxiomSitePreviewReviewMatrix(),
    );
    const criteriaPacket = buildAxiomGate8PreflightRunnerCriteriaPacket();
    const receipt = buildAxiomGate8PreflightRunnerReceipt(
      criteriaPacket,
      buildNotRunAxiomGate8PreflightRunnerEvidenceInput(),
    );
    const reviewPacket = buildAxiomFalconCandidateSurfaceReviewPacket(receipt);
    const scaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
      candidatePageDataBundle,
      reviewPacket,
    );

    const validation = validateAxiomInternalCandidateSurfaceImplementationScaffold(
      scaffold,
      candidatePageDataBundle,
      reviewPacket,
      receipt,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('source_review_packet_must_validate');
  });

  it('rejects missing implementation, public path, review execution, and promotion movement', () => {
    const { candidatePageDataBundle, receipt, reviewPacket } = buildSources();
    const scaffold = cloneScaffold(
      buildAxiomInternalCandidateSurfaceImplementationScaffold(
        candidatePageDataBundle,
        reviewPacket,
      ),
    );
    scaffold.implementations = scaffold.implementations.filter(
      (implementation) => implementation.surface !== 'scene_entry_use_cases',
    );
    scaffold.implementationCount = scaffold.implementations.length;
    scaffold.implementations[0].internalImplementationPath =
      '/preview/axiom-next-nbl#reader_facing_top_home' as unknown as AxiomInternalCandidateSurfaceImplementationScaffold['implementations'][number]['internalImplementationPath'];
    scaffold.sourceReviewExecutionStatus =
      'executed' as unknown as AxiomInternalCandidateSurfaceImplementationScaffold['sourceReviewExecutionStatus'];
    scaffold.movementBoundary.falconCandidateSurfacePromotion =
      'promoted' as unknown as AxiomInternalCandidateSurfaceImplementationScaffold['movementBoundary']['falconCandidateSurfacePromotion'];

    const validation = validateAxiomInternalCandidateSurfaceImplementationScaffold(
      scaffold,
      candidatePageDataBundle,
      reviewPacket,
      receipt,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([
        'source_review_must_not_be_executed_or_assigned_by_codex',
        'implementation_count_must_match_fixed_next_nbl_surfaces',
        'candidate_surface_implementation_missing:scene_entry_use_cases',
        'implementation_internal_path_must_match_internal_anchor:reader_facing_top_home',
        'implementation_path_must_remain_internal:reader_facing_top_home',
        'scaffold_must_not_move_candidate_public_validity_promotion_or_learning',
      ]),
    );
  });
});
