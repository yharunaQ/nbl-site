import { readFileSync } from 'node:fs';
import path from 'node:path';

type AxiomGate8ReceiptArtifact = {
  receiptStatus: string;
  boundary: string;
  criterionReceipts: Array<{
    criterionId: string;
    receiptStatus: string;
    satisfiesCriterionForCandidatePreflight: boolean;
    inheritedBlocksCandidatePromotion: boolean;
  }>;
  evidence: {
    jestEvidence: { status: string };
    typecheckEvidence: { status: string };
    routeRenderingEvidence: {
      status: string;
      httpStatusByPath: Record<string, number | string>;
    };
  };
  movementBoundary: {
    falconCandidateSurfacePromotion: string;
    publicApproval: string;
    publication: string;
    publicNavigation: string;
    runtimeApproved: string;
    publicApproved: string;
    learningUpdate: string;
  };
};

describe('Axiom Gate 8 preflight runner receipt artifact', () => {
  it('records a passed internal preflight without candidate promotion or public approval', () => {
    const receiptPath = path.join(
      process.cwd(),
      'references/axiom/axiom-gate8-preflight-runner-receipt-v0-2026-06-07.json',
    );
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8')) as AxiomGate8ReceiptArtifact;

    expect(receipt.receiptStatus).toBe('passed_internal_preflight_not_promoted');
    expect(receipt.boundary).toBe(
      'axiom_gate8_preflight_runner_receipt_is_internal_execution_evidence_not_candidate_promotion_or_public_release',
    );
    expect(
      receipt.criterionReceipts.every(
        (criterion) =>
          criterion.receiptStatus === 'passed_internal_preflight_check' &&
          criterion.satisfiesCriterionForCandidatePreflight &&
          criterion.inheritedBlocksCandidatePromotion,
      ),
    ).toBe(true);
    expect(receipt.evidence.jestEvidence.status).toBe('passed');
    expect(receipt.evidence.typecheckEvidence.status).toBe('passed');
    expect(receipt.evidence.routeRenderingEvidence.status).toBe('passed');
    expect(receipt.evidence.routeRenderingEvidence.httpStatusByPath).toMatchObject({
      '/internal/axiom-next-nbl-preview': 200,
      '/internal/axiom-next-nbl-candidate-pages': 200,
      '/internal/axiom-next-nbl-candidate-surface-scaffold': 200,
      '/internal/axiom-next-nbl-candidate-surface-render-adapter': 200,
      '/internal/axiom-next-nbl-candidate-surface-page-shell': 200,
      '/internal/axiom-next-nbl-candidate-public-page-preview': 200,
      '/internal/axiom-next-nbl-candidate-public-page-hold-packet': 200,
      '/internal/axiom-next-nbl-candidate-release-readiness-ledger': 200,
      '/internal/axiom-next-nbl-candidate-surface-promotion-request-packet': 200,
      '/internal/axiom-next-nbl-candidate-surface-promotion-handoff-manifest': 200,
      '/internal/axiom-next-nbl-candidate-public-release-decision-packet-shell': 200,
      '/internal/axiom-next-nbl-candidate-public-navigation-release-route-shell': 200,
      '/internal/axiom-next-nbl-candidate-final-public-release-review-packet': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-handoff-manifest': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-receipt-shell': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-ingestion-contract': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-shell': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-gate': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-validation-receipt-shell': 200,
      '/internal/axiom-next-nbl-candidate-founder-final-release-decision-payload-return-hold-shell': 200,
    });
    expect(receipt.movementBoundary).toMatchObject({
      falconCandidateSurfacePromotion: 'not_promoted',
      publicApproval: 'not_approved',
      publication: 'not_published',
      publicNavigation: 'not_added',
      runtimeApproved: 'not_approved',
      publicApproved: 'not_approved',
      learningUpdate: 'not_updated',
    });
  });
});
