import { readFileSync } from 'node:fs';
import path from 'node:path';
import { AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS } from '@/lib/axiom/siteGate8PreflightRunnerCriteria';

describe('Axiom Gate 8 preflight runner script', () => {
  it('keeps the executable receipt runner aligned with required targets and movement boundaries', () => {
    const scriptPath = path.join(process.cwd(), 'scripts/axiom/run-gate8-preflight-receipt.mjs');
    const script = readFileSync(scriptPath, 'utf8');

    for (const testTarget of AXIOM_GATE8_RUNNER_REQUIRED_TEST_TARGETS) {
      expect(script).toContain(testTarget);
    }

    expect(script).toContain('references/axiom');
    expect(script).toContain('axiom-gate8-preflight-runner-receipt-v0-2026-06-07.json');
    expect(script).toContain(
      'axiom_gate8_preflight_runner_receipt_is_internal_execution_evidence_not_candidate_promotion_or_public_release',
    );
    expect(script).toContain('falconCandidateSurfacePromotion');
    expect(script).toContain('not_promoted');
    expect(script).toContain('publicApproved');
    expect(script).toContain('not_approved');
    expect(script).toContain('learningUpdate');
    expect(script).toContain('not_updated');
  });
});
