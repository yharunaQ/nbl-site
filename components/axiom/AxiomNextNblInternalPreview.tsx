import { buildDefaultAxiomSitePreviewData } from '@/lib/axiom/sitePreviewData';
import { buildDefaultAxiomHumanReviewPacket } from '@/lib/axiom/humanReviewLoopContract';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomCandidatePageRouteMap } from '@/lib/axiom/siteCandidatePageRouteMap';
import { buildAxiomGate8PreflightContract } from '@/lib/axiom/siteGate8PreflightContract';
import { buildAxiomGate8PreflightRunnerCriteriaPacket } from '@/lib/axiom/siteGate8PreflightRunnerCriteria';
import { buildAxiomInternalCandidateFinalPublicReleaseReviewPacket } from '@/lib/axiom/siteInternalCandidateFinalPublicReleaseReviewPacket';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionHandoffManifest';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionIngestionContract';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell';
import { buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionReceiptShell';
import { buildAxiomInternalCandidatePublicNavigationReleaseRouteShell } from '@/lib/axiom/siteInternalCandidatePublicNavigationReleaseRouteShell';
import { buildAxiomInternalCandidatePublicReleaseDecisionPacketShell } from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';
import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';
import { buildAxiomInternalCandidateSurfacePromotionHandoffManifest } from '@/lib/axiom/siteInternalCandidateSurfacePromotionHandoffManifest';
import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';
import { buildAxiomKernelCorpusReviewReadoutAdapter } from '@/lib/axiom/kernelCorpusReviewReadoutAdapter';
import { buildAxiomKernelCorpusSufficiencyGate } from '@/lib/axiom/kernelCorpusSufficiencyGate';
import { buildAxiomKernelCorpusHumanReviewPacket } from '@/lib/axiom/kernelCorpusHumanReviewPacket';
import { buildAxiomKernelCorpusHumanReviewResultReceipt } from '@/lib/axiom/kernelCorpusHumanReviewResultReceipt';
import { buildAxiomReviewedKernelBackedPublicContentSlotBundle } from '@/lib/axiom/reviewedKernelBackedPublicContentSlots';
import { buildAxiomReviewedKernelBackedCandidatePageAssembly } from '@/lib/axiom/reviewedKernelBackedCandidatePageAssembly';
import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';
import { buildAxiomInternalCandidatePublicPagePreviewAssembly } from '@/lib/axiom/siteInternalCandidatePublicPagePreviewAssembly';
import {
  buildAxiomFalconCandidateSurfaceReviewPacket,
  type AxiomFalconCandidateSurfaceReviewPacket,
} from '@/lib/axiom/siteFalconCandidateSurfaceReviewPacket';
import { buildAxiomInternalCandidateSurfaceImplementationScaffold } from '@/lib/axiom/siteInternalCandidateSurfaceImplementationScaffold';
import { buildAxiomInternalCandidateSurfacePageShellBundle } from '@/lib/axiom/siteInternalCandidateSurfacePageShell';
import { buildAxiomInternalCandidateSurfacePageShellReviewPacket } from '@/lib/axiom/siteInternalCandidateSurfacePageShellReviewPacket';
import { buildAxiomInternalCandidateSurfaceRenderAdapterBundle } from '@/lib/axiom/siteInternalCandidateSurfaceRenderAdapter';
import type { AxiomGate8PreflightRunnerReceipt } from '@/lib/axiom/siteGate8PreflightRunnerReceipt';
import gate8RunnerReceiptArtifact from '@/references/axiom/axiom-gate8-preflight-runner-receipt-v0-2026-06-07.json';
import type {
  AxiomKernelFieldId,
  AxiomNextNblSiteSurface,
  AxiomSurfaceSlotOperation,
} from '@/lib/axiom/siteSurfaceSlotContract';

const previewData = buildDefaultAxiomSitePreviewData();
const reviewPacket = buildDefaultAxiomHumanReviewPacket();
const kernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter();
const kernelCorpusSufficiencyGate = buildAxiomKernelCorpusSufficiencyGate();
const kernelCorpusHumanReviewPacket = buildAxiomKernelCorpusHumanReviewPacket(
  kernelCorpusReviewReadoutAdapter,
  kernelCorpusSufficiencyGate,
);
const kernelCorpusHumanReviewResultReceipt = buildAxiomKernelCorpusHumanReviewResultReceipt();
const reviewedKernelBackedPublicContentSlots =
  buildAxiomReviewedKernelBackedPublicContentSlotBundle();
const reviewedKernelBackedCandidatePageAssembly =
  buildAxiomReviewedKernelBackedCandidatePageAssembly(reviewedKernelBackedPublicContentSlots);
const kernelCorpusRowsForPreview = kernelCorpusReviewReadoutAdapter.rows
  .filter(
    (row) =>
      row.itemId.startsWith('wave2_corpus_item_') ||
      row.itemId.startsWith('manual_document_corpus_item_'),
  )
  .slice(0, 7);
const kernelCorpusHumanReviewUnitsForPreview = [
  ...kernelCorpusHumanReviewPacket.units
    .filter((unit) => unit.unitType === 'compressed_kernel_review_unit')
    .slice(0, 4),
  ...kernelCorpusHumanReviewPacket.units.filter(
    (unit) => unit.unitType !== 'compressed_kernel_review_unit',
  ),
];
const previewReviewMatrix = buildAxiomSitePreviewReviewMatrix();
const candidatePageDataBundle = buildAxiomCandidatePageDataBundle(previewReviewMatrix);
const candidatePageRouteMap = buildAxiomCandidatePageRouteMap(candidatePageDataBundle);
const gate8Preflight = buildAxiomGate8PreflightContract(candidatePageRouteMap);
const gate8RunnerCriteria = buildAxiomGate8PreflightRunnerCriteriaPacket(
  gate8Preflight,
  candidatePageRouteMap,
);
const gate8RunnerReceipt = gate8RunnerReceiptArtifact as {
  receiptStatus: string;
  criterionReceiptCount: number;
  criterionReceipts: Array<{
    criterionId: string;
    receiptStatus: string;
    satisfiesCriterionForCandidatePreflight: boolean;
  }>;
  evidence: {
    jestEvidence: { status: string };
    typecheckEvidence: { status: string };
    routeRenderingEvidence: {
      status: string;
      httpStatusByPath: Record<string, number | string>;
    };
  };
  nextAllowedMovement: string;
};
const candidateSurfaceReviewPacket = buildAxiomFalconCandidateSurfaceReviewPacket(
  gate8RunnerReceiptArtifact as unknown as AxiomGate8PreflightRunnerReceipt,
) as AxiomFalconCandidateSurfaceReviewPacket;
const candidateSurfaceImplementationScaffold =
  buildAxiomInternalCandidateSurfaceImplementationScaffold(
    candidatePageDataBundle,
    candidateSurfaceReviewPacket,
  );
const candidateSurfaceRenderAdapterBundle = buildAxiomInternalCandidateSurfaceRenderAdapterBundle(
  candidateSurfaceImplementationScaffold,
);
const candidateSurfacePageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle(
  candidateSurfaceRenderAdapterBundle,
);
const candidateSurfacePageShellReviewPacket =
  buildAxiomInternalCandidateSurfacePageShellReviewPacket(candidateSurfacePageShellBundle);
const candidatePublicPagePreviewAssembly = buildAxiomInternalCandidatePublicPagePreviewAssembly(
  candidateSurfacePageShellBundle,
  candidateSurfacePageShellReviewPacket,
);
const candidatePublicPageHoldPacket = buildAxiomInternalCandidatePublicPageHoldPacket(
  candidatePublicPagePreviewAssembly,
);
const candidateReleaseReadinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger(
  candidatePublicPageHoldPacket,
);
const candidateSurfacePromotionRequestPacket =
  buildAxiomInternalCandidateSurfacePromotionRequestPacket(candidateReleaseReadinessLedger);
const candidateSurfacePromotionHandoffManifest =
  buildAxiomInternalCandidateSurfacePromotionHandoffManifest(
    candidateSurfacePromotionRequestPacket,
  );
const candidatePublicReleaseDecisionPacketShell =
  buildAxiomInternalCandidatePublicReleaseDecisionPacketShell(
    candidateSurfacePromotionHandoffManifest,
  );
const candidatePublicNavigationReleaseRouteShell =
  buildAxiomInternalCandidatePublicNavigationReleaseRouteShell(
    candidatePublicReleaseDecisionPacketShell,
  );
const candidateFinalPublicReleaseReviewPacket =
  buildAxiomInternalCandidateFinalPublicReleaseReviewPacket(
    candidatePublicNavigationReleaseRouteShell,
  );
const candidateFounderFinalReleaseDecisionHandoffManifest =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest(
    candidateFinalPublicReleaseReviewPacket,
  );
const candidateFounderFinalReleaseDecisionReceiptShell =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell(
    candidateFounderFinalReleaseDecisionHandoffManifest,
  );
const candidateFounderFinalReleaseDecisionIngestionContract =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract(
    candidateFounderFinalReleaseDecisionReceiptShell,
  );
const candidateFounderFinalReleaseDecisionPayloadShell =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell(
    candidateFounderFinalReleaseDecisionIngestionContract,
  );
const candidateFounderFinalReleaseDecisionPayloadValidationGate =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate(
    candidateFounderFinalReleaseDecisionPayloadShell,
  );
const candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell(
    candidateFounderFinalReleaseDecisionPayloadValidationGate,
  );
const candidateFounderFinalReleaseDecisionPayloadReturnHoldShell =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell(
    candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell,
  );

const surfaceLabels: Record<AxiomNextNblSiteSurface, string> = {
  reader_facing_top_home: 'Top / Home',
  work_condition_window: 'Work-condition window',
  consultation_case_reading_collection: 'Case-reading collection',
  twenty_one_views_work_design_guide: 'kernel-derived views guide',
  theory_method_trust_page: 'Theory / Method / Trust',
  article_social_question_library: 'Article / Social question library',
  cognitive_support_toolkit_studio_multimodal_objects: 'Toolkit / Studio',
  about_operating_boundary_page: 'About / Boundary',
  scene_entry_use_cases: 'Scene entry / Use cases',
};

const fieldLabels: Record<AxiomKernelFieldId, string> = {
  observation: 'observation',
  inference: 'inference',
  counterHypothesis: 'counterHypothesis',
  missingContext: 'missingContext',
  implementationActorConditions: 'implementationActorConditions',
  sourceLensStatus: 'sourceLensStatus',
  actionabilityBand: 'actionabilityBand',
  cannotYetSay: 'cannotYetSay',
  humanReviewRoute: 'humanReviewRoute',
};

const operationLabels: Record<AxiomSurfaceSlotOperation, string> = {
  display: 'display',
  translate: 'translate',
  hide: 'hide',
  route_to_review: 'review',
};

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomNextNblInternalPreview() {
  return (
    <main className="axiomPreview">
      <header className="hero">
        <div className="eyebrow">Axiom Next NBL</div>
        <h1>Axiom Next NBL Internal Preview</h1>
        <p>
          Axiom kernel objectから次期NBLサイトの固定surfaceへ渡すslotだけを表示する、 Falcon
          Lab内部preview。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>非runtime</span>
          <span>公開未承認</span>
          <span>未公開</span>
        </div>
      </header>

      <section className="statusBand" aria-labelledby="gate-summary">
        <div>
          <h2 id="gate-summary">Gate Summary</h2>
          <p>{previewData.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>source scenario</dt>
            <dd>{previewData.sourceScenarioId}</dd>
          </div>
          <div>
            <dt>source kernel</dt>
            <dd>{previewData.sourceKernel.kernelId}</dd>
          </div>
          <div>
            <dt>review unit</dt>
            <dd>{previewData.sourceKernel.reviewUnitScale}</dd>
          </div>
          <div>
            <dt>core review units</dt>
            <dd>{previewData.sourceKernel.estimatedCoreReviewUnits}</dd>
          </div>
        </dl>
      </section>

      <section className="kernelPanel" aria-labelledby="kernel-source">
        <h2 id="kernel-source">Kernel Source</h2>
        <div className="kernelGrid">
          <div>
            <span>kernel class</span>
            <strong>{previewData.sourceKernel.kernelCoreProgressClass}</strong>
          </div>
          <div>
            <span>display class</span>
            <strong>{previewData.coreProgressClass}</strong>
          </div>
          <div>
            <span>actionability</span>
            <strong>{previewData.sourceKernel.actionabilityBand}</strong>
          </div>
          <div>
            <span>status</span>
            <strong>{previewData.status}</strong>
          </div>
        </div>
        <p className="reviewQuestion">{previewData.sourceKernel.reviewerQuestion}</p>
      </section>

      <section className="matrixPanel" aria-labelledby="kernel-corpus-readout">
        <div className="sectionIntro">
          <h2 id="kernel-corpus-readout">Axiom Core Kernel Corpus Readout</h2>
          <p>
            実データ本格投入に向けた15-item internal kernel corpusを、公開候補ページではなく
            review navigation用のkernel displayとして表示する。
          </p>
        </div>
        <div className="matrixSummary">
          <div>
            <span>kernel rows</span>
            <strong>{kernelCorpusReviewReadoutAdapter.rowCount} kernel rows</strong>
          </div>
          <div>
            <span>wave2 rows</span>
            <strong>{kernelCorpusReviewReadoutAdapter.wave2RowCount} wave2 rows</strong>
          </div>
          <div>
            <span>manual/document rows</span>
            <strong>
              {kernelCorpusReviewReadoutAdapter.manualDocumentRowCount} manual/document row
            </strong>
          </div>
          <div>
            <span>review units</span>
            <strong>
              {kernelCorpusReviewReadoutAdapter.reviewUnitIndex.length} /{' '}
              {kernelCorpusReviewReadoutAdapter.maxCoreHumanReviewUnits}
            </strong>
          </div>
          <div>
            <span>adapter status</span>
            <strong>{kernelCorpusReviewReadoutAdapter.status}</strong>
          </div>
        </div>
        <div className="fieldRows">
          <p>show: {kernelCorpusReviewReadoutAdapter.displayContract.show.join(', ')}</p>
          <p>hide: {kernelCorpusReviewReadoutAdapter.displayContract.hide.join(', ')}</p>
        </div>
        <div className="scenarioRows">
          {kernelCorpusRowsForPreview.map((row) => (
            <article key={row.rowId}>
              <p>{row.sourceFamilyEntryIds.join(', ')}</p>
              <h3>{row.scenarioId}</h3>
              <dl>
                <div>
                  <dt>band</dt>
                  <dd>{row.actionabilityBand}</dd>
                </div>
                <div>
                  <dt>review units</dt>
                  <dd>{row.reviewUnitIds.length}</dd>
                </div>
              </dl>
              <div className="slotMeta">
                <span>fields: {row.groundedFields.join(', ')}</span>
                <span>missing: {row.missingContextSlots.join(', ')}</span>
                <span>cannot yet say: {row.cannotYetSayCount}</span>
                <span>{row.reviewStatus}</span>
                <span>{row.displayUse}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="reviewQuestion">{kernelCorpusReviewReadoutAdapter.boundary}</p>
      </section>

      <section className="matrixPanel" aria-labelledby="kernel-corpus-sufficiency-gate">
        <div className="sectionIntro">
          <h2 id="kernel-corpus-sufficiency-gate">Kernel Corpus Sufficiency Gate</h2>
          <p>
            15-item kernel corpusを、公開ページではなく内部slot計画へ進めてよいかだけを確認する
            compact gate。
          </p>
        </div>
        <div className="matrixSummary">
          <div>
            <span>gate status</span>
            <strong>{kernelCorpusSufficiencyGate.status}</strong>
          </div>
          <div>
            <span>checks</span>
            <strong>
              {kernelCorpusSufficiencyGate.passedCheckCount} /{' '}
              {kernelCorpusSufficiencyGate.checkCount} passed
            </strong>
          </div>
          <div>
            <span>next allowed</span>
            <strong>{kernelCorpusSufficiencyGate.nextAllowedMovement}</strong>
          </div>
        </div>
        <div className="scenarioRows">
          {kernelCorpusSufficiencyGate.checks.map((check) => (
            <article key={check.checkId}>
              <p>{check.checkId}</p>
              <dl>
                <div>
                  <dt>passed</dt>
                  <dd>{String(check.passed)}</dd>
                </div>
                <div>
                  <dt>actual</dt>
                  <dd>{check.actual}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className="reviewQuestion">{kernelCorpusSufficiencyGate.boundary}</p>
      </section>

      <section className="reviewPanel" aria-labelledby="kernel-corpus-human-review-packet">
        <div className="sectionIntro">
          <h2 id="kernel-corpus-human-review-packet">
            Kernel Corpus Human Review Packet
          </h2>
          <p>
            15件のkernel corpusを、個別仮説ではなく圧縮review unitとreadable checklistへまとめる。
            review実行・reviewer割当・validity判断・promotionはまだ動かさない。
          </p>
        </div>
        <div className="reviewSummary">
          <div>
            <span>packet status</span>
            <strong>{kernelCorpusHumanReviewPacket.status}</strong>
          </div>
          <div>
            <span>review units</span>
            <strong>
              {kernelCorpusHumanReviewPacket.unitCount} /{' '}
              {kernelCorpusHumanReviewPacket.maxCoreHumanReviewUnits}
            </strong>
          </div>
          <div>
            <span>row coverage</span>
            <strong>
              {kernelCorpusHumanReviewPacket.rowCoverage.coveredRowCount} /{' '}
              {kernelCorpusHumanReviewPacket.rowCoverage.totalRowCount} rows
            </strong>
          </div>
          <div>
            <span>source families</span>
            <strong>
              {
                kernelCorpusHumanReviewPacket.sourceFamilyCoverage
                  .representedCoreEligibleSourceFamilyCount
              }{' '}
              /{' '}
              {
                kernelCorpusHumanReviewPacket.sourceFamilyCoverage
                  .coreEligibleSourceFamilyCount
              }{' '}
              represented
            </strong>
          </div>
          <div>
            <span>checklist</span>
            <strong>
              {kernelCorpusHumanReviewPacket.readableChecklistSummary.totalChecklistItemCount}{' '}
              unchecked items
            </strong>
          </div>
          <div>
            <span>execution</span>
            <strong>{kernelCorpusHumanReviewPacket.reviewExecutionStatus}</strong>
          </div>
        </div>
        <div className="reviewGrid">
          {kernelCorpusHumanReviewUnitsForPreview.map((unit) => (
            <article className="reviewUnit" key={unit.unitId}>
              <p>{unit.unitType}</p>
              <h3>{unit.sourceReviewUnitId ?? unit.unitId}</h3>
              <div className="reviewFields">{unit.kernelFieldsInScope.join(', ')}</div>
              <p>{unit.reviewQuestion}</p>
              <div className="slotMeta">
                <span>rows: {unit.rowCount}</span>
                <span>source families: {unit.sourceFamilyEntryIds.join(', ')}</span>
                <span>checklist: {unit.readableChecklist.length} unchecked</span>
                <span>{unit.reviewExecutionStatus}</span>
                <span>{unit.reviewerAssignmentStatus}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="reviewQuestion">{kernelCorpusHumanReviewPacket.boundary}</p>
      </section>

      <section
        className="reviewedPublicSlotsPanel"
        aria-labelledby="reviewed-kernel-public-slots"
      >
        <div className="sectionIntro">
          <h2 id="reviewed-kernel-public-slots">
            Reviewed Kernel-Backed Public Content Slots
          </h2>
          <p>
            Founderが18項目すべてを暫定kernel構造として受け入れた後のactive route。
            9つの次期NBL surfaceを、review済みkernel fieldsから給餌する。
          </p>
        </div>
        <div className="reviewedSlotSummary">
          <div>
            <span>receipt</span>
            <strong>{kernelCorpusHumanReviewResultReceipt.overallDecision}</strong>
          </div>
          <div>
            <span>status</span>
            <strong>{reviewedKernelBackedPublicContentSlots.status}</strong>
          </div>
          <div>
            <span>surfaces</span>
            <strong>{reviewedKernelBackedPublicContentSlots.surfaceCount} surfaces</strong>
          </div>
          <div>
            <span>slots</span>
            <strong>{reviewedKernelBackedPublicContentSlots.slotCount} kernel-backed slots</strong>
          </div>
          <div>
            <span>kernel rows</span>
            <strong>
              {reviewedKernelBackedPublicContentSlots.coverage.coveredKernelRowIds.length} /{' '}
              {reviewedKernelBackedPublicContentSlots.sourceKernelRowCount}
            </strong>
          </div>
          <div>
            <span>review units</span>
            <strong>{reviewedKernelBackedPublicContentSlots.sourceReviewUnitCount}</strong>
          </div>
          <div>
            <span>next allowed</span>
            <strong>
              {
                reviewedKernelBackedPublicContentSlots.publicInterfaceBridge
                  .nextAllowedStep
              }
            </strong>
          </div>
        </div>
        <div className="reviewedSlotGrid">
          {reviewedKernelBackedPublicContentSlots.surfaces.map((surface) => (
            <article key={surface.surface}>
              <p>{surface.surface}</p>
              <h3>{surfaceLabels[surface.surface]}</h3>
              <p className="navigationRole">{surface.navigationRoleJa}</p>
              <div className="slotMeta">
                <span>{surface.founderReviewStatus}</span>
                <span>{surface.publicInterfaceStatus}</span>
                <span>rows: {surface.sourceKernelRowIds.length}</span>
                <span>review units: {surface.sourceReviewUnitIds.length}</span>
              </div>
              <div className="reviewedSlotRows">
                {surface.slots.map((slot) => (
                  <div key={slot.slotId}>
                    <span>{slot.operation}</span>
                    <strong>{slot.field}</strong>
                    <p>{slot.publicDraftJa ?? 'hidden or routed to review before public copy'}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="reviewQuestion">{reviewedKernelBackedPublicContentSlots.boundary}</p>
      </section>

      <section
        className="reviewedPageAssemblyPanel"
        aria-labelledby="reviewed-candidate-page-assembly"
      >
        <div className="sectionIntro">
          <h2 id="reviewed-candidate-page-assembly">
            Reviewed Kernel-Backed Candidate Page Assembly
          </h2>
          <p>
            reviewed slotsを9つの内部candidate page dataへ束ねる。
            routeは意図だけを持ち、actual public navigationやpublicationは作らない。
          </p>
        </div>
        <div className="reviewedSlotSummary">
          <div>
            <span>status</span>
            <strong>{reviewedKernelBackedCandidatePageAssembly.status}</strong>
          </div>
          <div>
            <span>pages</span>
            <strong>{reviewedKernelBackedCandidatePageAssembly.pageCount} pages</strong>
          </div>
          <div>
            <span>sections</span>
            <strong>{reviewedKernelBackedCandidatePageAssembly.sectionCount} sections</strong>
          </div>
          <div>
            <span>source slots</span>
            <strong>{reviewedKernelBackedCandidatePageAssembly.sourceSlotCount}</strong>
          </div>
          <div>
            <span>kernel rows</span>
            <strong>
              {reviewedKernelBackedCandidatePageAssembly.coverage.representedKernelRowIds.length}{' '}
              / {reviewedKernelBackedCandidatePageAssembly.sourceKernelRowCount}
            </strong>
          </div>
          <div>
            <span>route status</span>
            <strong>route_intent_only_actual_public_navigation_not_created</strong>
          </div>
        </div>
        <div className="reviewedPageGrid">
          {reviewedKernelBackedCandidatePageAssembly.pages.map((page) => (
            <article key={page.pageId}>
              <p>{page.surface}</p>
              <h3>{page.pageTitleJa}</h3>
              <p className="navigationRole">{page.navigationRoleJa}</p>
              <div className="slotMeta">
                <span>{page.routeIntent}</span>
                <span>{page.routeStatus}</span>
                <span>{page.pageStatus}</span>
                <span>{page.sectionCount} sections</span>
              </div>
              <div className="reviewedSlotRows">
                {page.sections.slice(0, 4).map((section) => (
                  <div key={section.sectionId}>
                    <span>{section.operation}</span>
                    <strong>{section.headingJa}</strong>
                    <p>{section.bodyDraftJa ?? section.reviewRoute}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="reviewQuestion">{reviewedKernelBackedCandidatePageAssembly.boundary}</p>
      </section>

      <section className="matrixPanel" aria-labelledby="multi-scenario-matrix">
        <div className="sectionIntro">
          <h2 id="multi-scenario-matrix">Multi-Scenario Matrix</h2>
          <p>
            5つのL3 fixtureを同じAxiom slot mapへ通し、surfaceごとのstable candidate page-slot
            dataを固定する。
          </p>
        </div>
        <div className="matrixSummary">
          <div>
            <span>scenario coverage</span>
            <strong>{previewReviewMatrix.scenarioCount} L3 scenarios</strong>
          </div>
          <div>
            <span>surface coverage</span>
            <strong>{previewReviewMatrix.surfaceCount} fixed surfaces</strong>
          </div>
          <div>
            <span>matrix status</span>
            <strong>{previewReviewMatrix.status}</strong>
          </div>
        </div>
        <div className="scenarioRows">
          {previewReviewMatrix.scenarios.map((scenario) => (
            <article key={scenario.scenarioId}>
              <p>{scenario.scenarioId}</p>
              <dl>
                <div>
                  <dt>band</dt>
                  <dd>{scenario.actionabilityBand}</dd>
                </div>
                <div>
                  <dt>review units</dt>
                  <dd>{scenario.reviewUnitCount}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="surfaceSection" aria-labelledby="surface-map">
        <div className="sectionIntro">
          <h2 id="surface-map">Fixed Surface Slot Map</h2>
          <p>Falcon最終構成は骨格として継承し、表示内容はAxiom kernel-backed slotから作る。</p>
        </div>
        <div className="surfaceGrid">
          {previewData.surfaces.map((surface) => (
            <article className="surfaceCard" key={surface.surface}>
              <div className="surfaceCardHeader">
                <div>
                  <p>{surface.surface}</p>
                  <h3>{surfaceLabels[surface.surface]}</h3>
                </div>
                <span>{surface.slotCount} slots</span>
              </div>
              <p className="navigationRole">{surface.navigationRole}</p>
              <dl className="operationGrid">
                {Object.entries(surface.operationCounts).map(([operation, count]) => (
                  <div key={operation}>
                    <dt>{operationLabels[operation as AxiomSurfaceSlotOperation]}</dt>
                    <dd>{count}</dd>
                  </div>
                ))}
              </dl>
              <div className="fieldRows">
                <p>
                  review routed:{' '}
                  {surface.reviewRoutedFields.length > 0
                    ? surface.reviewRoutedFields.map((field) => fieldLabels[field]).join(', ')
                    : 'none'}
                </p>
                <p>
                  hidden:{' '}
                  {surface.hiddenFields.length > 0
                    ? surface.hiddenFields.map((field) => fieldLabels[field]).join(', ')
                    : 'none'}
                </p>
              </div>
              <div className="draftSamples">
                {surface.sampleInternalDrafts.map((draft, index) => (
                  <p key={`${surface.surface}-draft-${index}`}>{draft}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stableSlotPanel" aria-labelledby="stable-page-slots">
        <div className="sectionIntro">
          <h2 id="stable-page-slots">Stable Candidate Page Slots</h2>
          <p>
            公開ページ実装の前に、各surfaceが全scenarioから受け取れるfield・operation・review
            routeを安定化する。
          </p>
        </div>
        <div className="stableSlotGrid">
          {previewReviewMatrix.stableSurfacePageSlots.map((surface) => (
            <article key={surface.surface}>
              <p>{surface.surface}</p>
              <h3>{surfaceLabels[surface.surface]}</h3>
              <dl>
                <div>
                  <dt>coverage</dt>
                  <dd>{surface.scenarioCoverageCount} scenarios</dd>
                </div>
                <div>
                  <dt>stable slots</dt>
                  <dd>{surface.stableSlotCount}</dd>
                </div>
              </dl>
              <div className="slotMeta">
                <span>fields: {surface.fieldsCovered.join(', ')}</span>
                <span>operations: {surface.operationsCovered.join(', ')}</span>
                <span>
                  review routed:{' '}
                  {surface.reviewRoutedFields.length > 0
                    ? surface.reviewRoutedFields.join(', ')
                    : 'none'}
                </span>
                <span>
                  hidden:{' '}
                  {surface.hiddenFields.length > 0 ? surface.hiddenFields.join(', ') : 'none'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="candidatePagePanel" aria-labelledby="candidate-page-data">
        <div className="sectionIntro">
          <h2 id="candidate-page-data">Candidate Page Data</h2>
          <p>
            stable slot matrixから9つのsurface別page dataへ束ねる。これは公開routeではなく、
            ページ実装前の内部assembly。
          </p>
        </div>
        <div className="candidateSummary">
          <div>
            <span>candidate pages</span>
            <strong>{candidatePageDataBundle.pageCount} internal page data objects</strong>
          </div>
          <div>
            <span>source matrix</span>
            <strong>{candidatePageDataBundle.sourceMatrixId}</strong>
          </div>
          <div>
            <span>status</span>
            <strong>{candidatePageDataBundle.status}</strong>
          </div>
        </div>
        <div className="candidateGrid">
          {candidatePageDataBundle.pages.map((page) => (
            <article key={page.pageDataId}>
              <p>{page.surface}</p>
              <h3>{surfaceLabels[page.surface]}</h3>
              <dl>
                <div>
                  <dt>sections</dt>
                  <dd>{page.sectionCount}</dd>
                </div>
                <div>
                  <dt>coverage</dt>
                  <dd>{page.scenarioCoverageCount} scenarios</dd>
                </div>
              </dl>
              <div className="slotMeta">
                <span>{page.status}</span>
                <span>{page.reviewRoute}</span>
                <span>fields: {page.fieldsCovered.join(', ')}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gate8Panel" aria-labelledby="gate8-preflight">
        <div className="sectionIntro">
          <h2 id="gate8-preflight">Gate 8 Preflight</h2>
          <p>
            Falcon candidate surfaceへ進む前のpreflight。公開承認ではなく、boundary・currentness
            hold・accessibility・regression・promotion条件を止める。
          </p>
        </div>
        <div className="gate8Summary">
          <div>
            <span>required checks</span>
            <strong>{gate8Preflight.requiredCheckCount}</strong>
          </div>
          <div>
            <span>route preflights</span>
            <strong>{gate8Preflight.routePreflightCount}</strong>
          </div>
          <div>
            <span>status</span>
            <strong>{gate8Preflight.status}</strong>
          </div>
        </div>
        <div className="gate8CheckGrid">
          {gate8Preflight.requiredChecks.map((check) => (
            <article key={check.checkId}>
              <p>{check.category}</p>
              <span>{check.status}</span>
              <span>{check.requirement}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="runnerCriteriaPanel" aria-labelledby="gate8-runner-criteria">
        <div className="sectionIntro">
          <h2 id="gate8-runner-criteria">Gate 8 Runner Criteria</h2>
          <p>
            preflightを実際に走らせる前のcriteria packet。未実行の必須チェックだけを固定し、 Falcon
            candidate surface昇格とpublic releaseは止めたままにする。
          </p>
        </div>
        <div className="runnerSummary">
          <div>
            <span>criteria</span>
            <strong>{gate8RunnerCriteria.criteriaCount}</strong>
          </div>
          <div>
            <span>route targets</span>
            <strong>{gate8RunnerCriteria.routeTargetCount}</strong>
          </div>
          <div>
            <span>status</span>
            <strong>{gate8RunnerCriteria.status}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {gate8RunnerCriteria.criteria.map((criterion) => (
            <article key={criterion.criterionId}>
              <p>{criterion.criterionId}</p>
              <span>{criterion.status}</span>
              <span>{criterion.sourceGate8Category}</span>
              <span>{criterion.commandHint}</span>
            </article>
          ))}
        </div>
        <div className="testTargetPanel">
          <h3>Required Test Targets</h3>
          <div>
            {gate8RunnerCriteria.requiredTestTargets.map((testTarget) => (
              <span key={testTarget}>{testTarget}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="runnerReceiptPanel" aria-labelledby="gate8-runner-receipt">
        <div className="sectionIntro">
          <h2 id="gate8-runner-receipt">Gate 8 Runner Receipt</h2>
          <p>
            criteriaを実行した内部receipt。passedでもcandidate
            surface昇格・公開承認・公開navigationは 動かさず、次に進めるのはreview packet準備だけ。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>receipt status</span>
            <strong>{gate8RunnerReceipt.receiptStatus}</strong>
          </div>
          <div>
            <span>criterion receipts</span>
            <strong>{gate8RunnerReceipt.criterionReceiptCount}</strong>
          </div>
          <div>
            <span>next allowed movement</span>
            <strong>{gate8RunnerReceipt.nextAllowedMovement}</strong>
          </div>
        </div>
        <div className="receiptEvidenceGrid">
          <article>
            <p>jest</p>
            <span>{gate8RunnerReceipt.evidence.jestEvidence.status}</span>
          </article>
          <article>
            <p>typecheck</p>
            <span>{gate8RunnerReceipt.evidence.typecheckEvidence.status}</span>
          </article>
          <article>
            <p>route rendering</p>
            <span>{gate8RunnerReceipt.evidence.routeRenderingEvidence.status}</span>
            {Object.entries(
              gate8RunnerReceipt.evidence.routeRenderingEvidence.httpStatusByPath,
            ).map(([path, status]) => (
              <span key={path}>
                {path}: {status}
              </span>
            ))}
          </article>
        </div>
        <div className="runnerCriteriaGrid">
          {gate8RunnerReceipt.criterionReceipts.map((criterion) => (
            <article key={criterion.criterionId}>
              <p>{criterion.criterionId}</p>
              <span>{criterion.receiptStatus}</span>
              <span>
                satisfies: {criterion.satisfiesCriterionForCandidatePreflight ? 'true' : 'false'}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="candidateReviewPacketPanel"
        aria-labelledby="candidate-surface-review-packet"
      >
        <div className="sectionIntro">
          <h2 id="candidate-surface-review-packet">Candidate Surface Review Packet</h2>
          <p>
            passed receiptから作る候補surface昇格前のreview input。reviewは未実行で、Codexはreviewer
            assignmentも候補昇格も行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>packet status</span>
            <strong>{candidateSurfaceReviewPacket.status}</strong>
          </div>
          <div>
            <span>review units</span>
            <strong>
              {candidateSurfaceReviewPacket.reviewUnitCount} /{' '}
              {candidateSurfaceReviewPacket.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>review execution</span>
            <strong>{candidateSurfaceReviewPacket.reviewExecutionStatus}</strong>
          </div>
          <div>
            <span>reviewer assignment</span>
            <strong>{candidateSurfaceReviewPacket.reviewerAssignmentStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfaceReviewPacket.reviewUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.requiredDecisions.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="scaffoldPanel" aria-labelledby="candidate-surface-scaffold">
        <div className="sectionIntro">
          <h2 id="candidate-surface-scaffold">Internal Candidate Surface Scaffold</h2>
          <p>
            candidate page dataとreview
            packetから作る内部実装scaffold。surface実装単位は固定するが、 Falcon
            candidate昇格・public navigation・公開releaseはまだ行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>scaffold status</span>
            <strong>{candidateSurfaceImplementationScaffold.status}</strong>
          </div>
          <div>
            <span>implementations</span>
            <strong>{candidateSurfaceImplementationScaffold.implementationCount}</strong>
          </div>
          <div>
            <span>review execution</span>
            <strong>{candidateSurfaceImplementationScaffold.sourceReviewExecutionStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfaceImplementationScaffold.implementations.map((implementation) => (
            <article key={implementation.implementationId}>
              <p>{implementation.surface}</p>
              <span>{implementation.internalImplementationPath}</span>
              <span>{implementation.candidateSurfaceStatus}</span>
              <span>{implementation.sectionScaffoldCount} section scaffolds</span>
            </article>
          ))}
        </div>
      </section>

      <section className="renderAdapterPanel" aria-labelledby="candidate-surface-render-adapter">
        <div className="sectionIntro">
          <h2 id="candidate-surface-render-adapter">Internal Candidate Surface Render Adapter</h2>
          <p>
            implementation scaffoldを内部component interfaceへ変換するadapter。surface shellは
            internal-onlyで、public page shellやcandidate昇格ではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>adapter bundle status</span>
            <strong>{candidateSurfaceRenderAdapterBundle.status}</strong>
          </div>
          <div>
            <span>adapters</span>
            <strong>{candidateSurfaceRenderAdapterBundle.adapterCount}</strong>
          </div>
          <div>
            <span>route base</span>
            <strong>{candidateSurfaceRenderAdapterBundle.routeBase}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfaceRenderAdapterBundle.adapters.map((adapter) => (
            <article key={adapter.adapterId}>
              <p>{adapter.surface}</p>
              <span>{adapter.internalRenderPath}</span>
              <span>{adapter.adapterStatus}</span>
              <span>{adapter.renderSlotCount} render slots</span>
            </article>
          ))}
        </div>
      </section>

      <section className="pageShellPanel" aria-labelledby="candidate-surface-page-shell">
        <div className="sectionIntro">
          <h2 id="candidate-surface-page-shell">Internal Candidate Surface Page Shell</h2>
          <p>
            render adapterを内部preview用のpage shellへ配置する。public page、public
            navigation、candidate昇格ではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>page shell bundle status</span>
            <strong>{candidateSurfacePageShellBundle.status}</strong>
          </div>
          <div>
            <span>shells</span>
            <strong>{candidateSurfacePageShellBundle.shellCount}</strong>
          </div>
          <div>
            <span>route base</span>
            <strong>{candidateSurfacePageShellBundle.routeBase}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfacePageShellBundle.shells.map((shell) => (
            <article key={shell.shellId}>
              <p>{shell.surface}</p>
              <span>{shell.internalShellPath}</span>
              <span>{shell.shellStatus}</span>
              <span>{shell.regionCount} page regions</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="pageShellReviewPanel"
        aria-labelledby="candidate-surface-page-shell-review"
      >
        <div className="sectionIntro">
          <h2 id="candidate-surface-page-shell-review">
            Internal Candidate Surface Page Shell Review Packet
          </h2>
          <p>
            page shellをsurface単位とcross-shell単位へ凝縮したreview input。review実行、
            reviewer割当、candidate昇格、public releaseではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>packet status</span>
            <strong>{candidateSurfacePageShellReviewPacket.status}</strong>
          </div>
          <div>
            <span>review units</span>
            <strong>
              {candidateSurfacePageShellReviewPacket.reviewUnitCount} /{' '}
              {candidateSurfacePageShellReviewPacket.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>review execution</span>
            <strong>{candidateSurfacePageShellReviewPacket.reviewExecutionStatus}</strong>
          </div>
          <div>
            <span>reviewer assignment</span>
            <strong>{candidateSurfacePageShellReviewPacket.reviewerAssignmentStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfacePageShellReviewPacket.reviewUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.regionCount} regions</span>
              <span>{unit.requiredDecisions.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="publicPagePreviewPanel"
        aria-labelledby="candidate-public-page-preview-assembly"
      >
        <div className="sectionIntro">
          <h2 id="candidate-public-page-preview-assembly">
            Internal Candidate Public Page Preview Assembly
          </h2>
          <p>
            page-shell review packetから作る内部candidate-public-page preview。public
            navigation、candidate昇格、公開releaseではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>assembly status</span>
            <strong>{candidatePublicPagePreviewAssembly.status}</strong>
          </div>
          <div>
            <span>previews</span>
            <strong>{candidatePublicPagePreviewAssembly.previewCount}</strong>
          </div>
          <div>
            <span>route base</span>
            <strong>{candidatePublicPagePreviewAssembly.routeBase}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidatePublicPagePreviewAssembly.previews.map((preview) => (
            <article key={preview.previewId}>
              <p>{preview.surface}</p>
              <span>{preview.internalPreviewPath}</span>
              <span>{preview.previewStatus}</span>
              <span>{preview.blockCount} preview blocks</span>
            </article>
          ))}
        </div>
      </section>

      <section className="publicPageHoldPanel" aria-labelledby="candidate-public-page-hold-packet">
        <div className="sectionIntro">
          <h2 id="candidate-public-page-hold-packet">Internal Candidate Public Page Hold Packet</h2>
          <p>
            candidate-public-page preview assemblyから作るpublic-boundary / accessibility /
            regression hold。review実行、public navigation、candidate昇格ではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>hold packet status</span>
            <strong>{candidatePublicPageHoldPacket.status}</strong>
          </div>
          <div>
            <span>hold units</span>
            <strong>
              {candidatePublicPageHoldPacket.holdUnitCount} /{' '}
              {candidatePublicPageHoldPacket.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>review execution</span>
            <strong>{candidatePublicPageHoldPacket.reviewExecutionStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidatePublicPageHoldPacket.holdUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.holdCheckCount} hold checks</span>
              <span>{unit.holdChecks.map((check) => check.category).join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="releaseReadinessLedgerPanel"
        aria-labelledby="candidate-release-readiness-ledger"
      >
        <div className="sectionIntro">
          <h2 id="candidate-release-readiness-ledger">
            Internal Candidate Release Readiness Ledger
          </h2>
          <p>
            hold packetから作る内部release readiness ledger。内部通過とholdを分けるが、public
            navigation、candidate昇格、公開releaseではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>ledger status</span>
            <strong>{candidateReleaseReadinessLedger.status}</strong>
          </div>
          <div>
            <span>release readiness</span>
            <strong>{candidateReleaseReadinessLedger.releaseReadinessStatus}</strong>
          </div>
          <div>
            <span>ledger entries</span>
            <strong>{candidateReleaseReadinessLedger.ledgerEntryCount}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateReleaseReadinessLedger.ledgerUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.entryCount} readiness entries</span>
              <span>{unit.releaseReadinessStatus}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="promotionRequestPacketPanel"
        aria-labelledby="candidate-surface-promotion-request-packet"
      >
        <div className="sectionIntro">
          <h2 id="candidate-surface-promotion-request-packet">
            Internal Candidate Surface Promotion Request Packet
          </h2>
          <p>
            release readiness ledgerから作るpromotion request review input。request packetは作るが、
            submission、candidate昇格、public navigation、公開releaseではない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>packet status</span>
            <strong>{candidateSurfacePromotionRequestPacket.status}</strong>
          </div>
          <div>
            <span>request mode</span>
            <strong>{candidateSurfacePromotionRequestPacket.requestMode}</strong>
          </div>
          <div>
            <span>request units</span>
            <strong>
              {candidateSurfacePromotionRequestPacket.requestUnitCount} /{' '}
              {candidateSurfacePromotionRequestPacket.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>submission</span>
            <strong>{candidateSurfacePromotionRequestPacket.requestSubmissionStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfacePromotionRequestPacket.requestUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.sourceLedgerEntryCount} source ledger entries</span>
              <span>{unit.promotionDisposition}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="promotionHandoffManifestPanel"
        aria-labelledby="candidate-surface-promotion-handoff-manifest"
      >
        <div className="sectionIntro">
          <h2 id="candidate-surface-promotion-handoff-manifest">
            Internal Candidate Surface Promotion Handoff Manifest
          </h2>
          <p>
            promotion request packetから作るFounder/reviewer handoff input。Codexは送付、
            review実行、Founder判断、candidate昇格、public releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>manifest status</span>
            <strong>{candidateSurfacePromotionHandoffManifest.status}</strong>
          </div>
          <div>
            <span>manifest mode</span>
            <strong>{candidateSurfacePromotionHandoffManifest.manifestMode}</strong>
          </div>
          <div>
            <span>handoff units</span>
            <strong>
              {candidateSurfacePromotionHandoffManifest.manifestUnitCount} /{' '}
              {candidateSurfacePromotionHandoffManifest.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>handoff status</span>
            <strong>{candidateSurfacePromotionHandoffManifest.handoffStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateSurfacePromotionHandoffManifest.manifestUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.founderDecisionStatus}</span>
              <span>{unit.handoffDecisionOptions.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="publicReleaseDecisionPacketShellPanel"
        aria-labelledby="candidate-public-release-decision-packet-shell"
      >
        <div className="sectionIntro">
          <h2 id="candidate-public-release-decision-packet-shell">
            Internal Candidate Public Release Decision Packet Shell
          </h2>
          <p>
            promotion handoff manifestから作るrelease/no-release decision shell。Codexは公開承認、
            public navigation、publication、release、source/support validity判断を行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>shell status</span>
            <strong>{candidatePublicReleaseDecisionPacketShell.status}</strong>
          </div>
          <div>
            <span>shell mode</span>
            <strong>{candidatePublicReleaseDecisionPacketShell.shellMode}</strong>
          </div>
          <div>
            <span>decision units</span>
            <strong>
              {candidatePublicReleaseDecisionPacketShell.decisionUnitCount} /{' '}
              {candidatePublicReleaseDecisionPacketShell.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>public approval</span>
            <strong>{candidatePublicReleaseDecisionPacketShell.publicApprovalStatus}</strong>
          </div>
          <div>
            <span>publication</span>
            <strong>{candidatePublicReleaseDecisionPacketShell.publicationStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidatePublicReleaseDecisionPacketShell.decisionUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.releaseDecisionStatus}</span>
              <span>{unit.requiredReleaseDecisionRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="publicNavigationReleaseRouteShellPanel"
        aria-labelledby="candidate-public-navigation-release-route-shell"
      >
        <div className="sectionIntro">
          <h2 id="candidate-public-navigation-release-route-shell">
            Internal Candidate Public Navigation Release Route Shell
          </h2>
          <p>
            release decision shellから作るpublic-navigation route
            shell。Codexは実際の公開navigation、 route activation、publication、public
            approval、source/support validity判断を行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>shell status</span>
            <strong>{candidatePublicNavigationReleaseRouteShell.status}</strong>
          </div>
          <div>
            <span>shell mode</span>
            <strong>{candidatePublicNavigationReleaseRouteShell.shellMode}</strong>
          </div>
          <div>
            <span>navigation units</span>
            <strong>
              {candidatePublicNavigationReleaseRouteShell.navigationUnitCount} /{' '}
              {candidatePublicNavigationReleaseRouteShell.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>route activation</span>
            <strong>{candidatePublicNavigationReleaseRouteShell.routeActivationStatus}</strong>
          </div>
          <div>
            <span>actual public navigation</span>
            <strong>
              {candidatePublicNavigationReleaseRouteShell.actualPublicNavigationStatus}
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidatePublicNavigationReleaseRouteShell.navigationUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.routeActivationStatus}</span>
              <span>{unit.requiredNavigationRouteRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="finalPublicReleaseReviewPacketPanel"
        aria-labelledby="candidate-final-public-release-review-packet"
      >
        <div className="sectionIntro">
          <h2 id="candidate-final-public-release-review-packet">
            Internal Candidate Final Public Release Review Packet
          </h2>
          <p>
            public-navigation route shellから作るfinal public-release review
            input。Codexはreview実行、 reviewer割当、公開承認、publication、actual public
            navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>packet status</span>
            <strong>{candidateFinalPublicReleaseReviewPacket.status}</strong>
          </div>
          <div>
            <span>packet mode</span>
            <strong>{candidateFinalPublicReleaseReviewPacket.packetMode}</strong>
          </div>
          <div>
            <span>review units</span>
            <strong>
              {candidateFinalPublicReleaseReviewPacket.reviewUnitCount} /{' '}
              {candidateFinalPublicReleaseReviewPacket.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>review execution</span>
            <strong>{candidateFinalPublicReleaseReviewPacket.reviewExecutionStatus}</strong>
          </div>
          <div>
            <span>public approval</span>
            <strong>{candidateFinalPublicReleaseReviewPacket.publicApprovalStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFinalPublicReleaseReviewPacket.reviewUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.reviewExecutionStatus}</span>
              <span>{unit.requiredFinalReviewRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionHandoffManifestPanel"
        aria-labelledby="candidate-founder-final-release-decision-handoff-manifest"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-handoff-manifest">
            Internal Candidate Founder Final Release Decision Handoff Manifest
          </h2>
          <p>
            final public-release review packetから作るFounder handoff input。Codexはhandoff送付、
            Founder判断、review実行、公開承認、publication、actual public
            navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>manifest status</span>
            <strong>{candidateFounderFinalReleaseDecisionHandoffManifest.status}</strong>
          </div>
          <div>
            <span>manifest mode</span>
            <strong>{candidateFounderFinalReleaseDecisionHandoffManifest.manifestMode}</strong>
          </div>
          <div>
            <span>handoff units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionHandoffManifest.manifestUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionHandoffManifest.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>handoff status</span>
            <strong>{candidateFounderFinalReleaseDecisionHandoffManifest.handoffStatus}</strong>
          </div>
          <div>
            <span>Founder decision</span>
            <strong>
              {candidateFounderFinalReleaseDecisionHandoffManifest.founderDecisionStatus}
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionHandoffManifest.manifestUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.handoffStatus}</span>
              <span>{unit.requiredHandoffRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionReceiptShellPanel"
        aria-labelledby="candidate-founder-final-release-decision-receipt-shell"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-receipt-shell">
            Internal Candidate Founder Final Release Decision Receipt Shell
          </h2>
          <p>
            Founder final-release handoff manifestから作るnot-received receipt shell。CodexはFounder
            receipt受領、Founder判断、review実行、公開承認、publication、actual public navigation、
            releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>shell status</span>
            <strong>{candidateFounderFinalReleaseDecisionReceiptShell.status}</strong>
          </div>
          <div>
            <span>shell mode</span>
            <strong>{candidateFounderFinalReleaseDecisionReceiptShell.shellMode}</strong>
          </div>
          <div>
            <span>receipt units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionReceiptShell.receiptUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionReceiptShell.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>decision receipt</span>
            <strong>
              {candidateFounderFinalReleaseDecisionReceiptShell.decisionReceiptStatus}
            </strong>
          </div>
          <div>
            <span>Founder decision</span>
            <strong>
              {candidateFounderFinalReleaseDecisionReceiptShell.founderDecisionStatus}
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionReceiptShell.receiptUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.decisionReceiptStatus}</span>
              <span>{unit.requiredReceiptRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionIngestionContractPanel"
        aria-labelledby="candidate-founder-final-release-decision-ingestion-contract"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-ingestion-contract">
            Internal Candidate Founder Final Release Decision Ingestion Contract
          </h2>
          <p>
            Founder final-release decision receipt shellの後段に置くempty/not-ingested contract。
            Codexは外部Founder判断payload投入、ingestion、Founder判断、review実行、公開承認、
            publication、actual public navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>contract status</span>
            <strong>{candidateFounderFinalReleaseDecisionIngestionContract.status}</strong>
          </div>
          <div>
            <span>contract mode</span>
            <strong>{candidateFounderFinalReleaseDecisionIngestionContract.contractMode}</strong>
          </div>
          <div>
            <span>ingestion units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionIngestionContract.ingestionUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionIngestionContract.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>external payload</span>
            <strong>
              {candidateFounderFinalReleaseDecisionIngestionContract.externalDecisionPayloadStatus}
            </strong>
          </div>
          <div>
            <span>ingestion</span>
            <strong>{candidateFounderFinalReleaseDecisionIngestionContract.ingestionStatus}</strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionIngestionContract.ingestionUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.ingestionStatus}</span>
              <span>{unit.requiredIngestionRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionPayloadShellPanel"
        aria-labelledby="candidate-founder-final-release-decision-payload-shell"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-payload-shell">
            Internal Candidate Founder Final Release Decision Payload Shell
          </h2>
          <p>
            Founder final-release decision ingestion contractから作るempty schema
            fixture。Codexは外部 Founder判断payload受領、payload
            acceptance、ingestion、Founder判断、review実行、 公開承認、publication、actual public
            navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>shell status</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadShell.status}</strong>
          </div>
          <div>
            <span>shell mode</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadShell.shellMode}</strong>
          </div>
          <div>
            <span>payload units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadShell.payloadUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionPayloadShell.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>payload schema</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadShell.payloadSchemaStatus}</strong>
          </div>
          <div>
            <span>payload acceptance</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadShell.payloadAcceptanceStatus}
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionPayloadShell.payloadUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.externalDecisionPayloadStatus}</span>
              <span>{unit.requiredPayloadRequirements.join(', ')}</span>
              <span>{unit.payloadFields.map((field) => field.fieldId).join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionPayloadValidationGatePanel"
        aria-labelledby="candidate-founder-final-release-decision-payload-validation-gate"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-payload-validation-gate">
            Internal Candidate Founder Final Release Decision Payload Validation Gate
          </h2>
          <p>
            empty payload shellから作るnot-run validation gate。Codexは外部Founder判断payload受領、
            payload validation実行、payload acceptance、ingestion、Founder判断、review実行、
            公開承認、publication、actual public navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>gate status</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadValidationGate.status}</strong>
          </div>
          <div>
            <span>gate mode</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadValidationGate.gateMode}</strong>
          </div>
          <div>
            <span>validation units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadValidationGate.validationUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionPayloadValidationGate.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>validation</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadValidationGate.payloadValidationStatus}
            </strong>
          </div>
          <div>
            <span>empty payload</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadValidationGate.emptyPayloadDisposition}
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionPayloadValidationGate.validationUnits.map((unit) => (
            <article key={unit.unitId}>
              <p>{unit.unitType}</p>
              <span>{unit.surface ?? unit.unitId}</span>
              <span>{unit.payloadValidationStatus}</span>
              <span>{unit.emptyPayloadDisposition}</span>
              <span>{unit.requiredValidationRequirements.join(', ')}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionPayloadValidationReceiptShellPanel"
        aria-labelledby="candidate-founder-final-release-decision-payload-validation-receipt-shell"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-payload-validation-receipt-shell">
            Internal Candidate Founder Final Release Decision Payload Validation Receipt Shell
          </h2>
          <p>
            not-run validation gateから作るvalidation receipt shell。Codexは外部validation
            receipt受領、payload validation実行、payload acceptance、ingestion、Founder判断、
            review実行、公開承認、publication、actual public navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>shell status</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.status}
            </strong>
          </div>
          <div>
            <span>shell mode</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.shellMode}
            </strong>
          </div>
          <div>
            <span>receipt units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.receiptUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>validation receipt</span>
            <strong>
              {
                candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.validationReceiptStatus
              }
            </strong>
          </div>
          <div>
            <span>validation</span>
            <strong>
              {
                candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.payloadValidationStatus
              }
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionPayloadValidationReceiptShell.receiptUnits.map(
            (unit) => (
              <article key={unit.unitId}>
                <p>{unit.unitType}</p>
                <span>{unit.surface ?? unit.unitId}</span>
                <span>{unit.validationReceiptStatus}</span>
                <span>{unit.payloadValidationStatus}</span>
                <span>{unit.requiredReceiptRequirements.join(', ')}</span>
              </article>
            ),
          )}
        </div>
      </section>

      <section
        className="founderFinalReleaseDecisionPayloadReturnHoldShellPanel"
        aria-labelledby="candidate-founder-final-release-decision-payload-return-hold-shell"
      >
        <div className="sectionIntro">
          <h2 id="candidate-founder-final-release-decision-payload-return-hold-shell">
            Internal Candidate Founder Final Release Decision Payload Return Hold Shell
          </h2>
          <p>
            validation receipt shellから作るpayload return/hold shell。Codexは外部payload補完、
            payload validation実行、payload acceptance、ingestion、Founder判断、review実行、
            公開承認、publication、actual public navigation、releaseを行わない。
          </p>
        </div>
        <div className="receiptSummary">
          <div>
            <span>shell status</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.status}</strong>
          </div>
          <div>
            <span>shell mode</span>
            <strong>{candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.shellMode}</strong>
          </div>
          <div>
            <span>return hold units</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.returnHoldUnitCount} /{' '}
              {candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>return hold</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.returnHoldStatus}
            </strong>
          </div>
          <div>
            <span>return target</span>
            <strong>
              {candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.returnTargetStatus}
            </strong>
          </div>
        </div>
        <div className="runnerCriteriaGrid">
          {candidateFounderFinalReleaseDecisionPayloadReturnHoldShell.returnHoldUnits.map(
            (unit) => (
              <article key={unit.unitId}>
                <p>{unit.unitType}</p>
                <span>{unit.surface ?? unit.unitId}</span>
                <span>{unit.returnHoldStatus}</span>
                <span>{unit.returnTargetStatus}</span>
                <span>{unit.requiredReturnHoldRequirements.join(', ')}</span>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="reviewPanel" aria-labelledby="review-queue">
        <div className="sectionIntro">
          <h2 id="review-queue">Human Review Queue</h2>
          <p>
            個別仮説ではなく、kernel contract・各surface・cross-surface boundaryを凝縮して見る。
          </p>
        </div>
        <div className="reviewSummary">
          <div>
            <span>review class</span>
            <strong>{reviewPacket.coreProgressClass}</strong>
          </div>
          <div>
            <span>review units</span>
            <strong>
              {reviewPacket.unitCount} / {reviewPacket.maxCoreReviewUnits}
            </strong>
          </div>
          <div>
            <span>status</span>
            <strong>{reviewPacket.status}</strong>
          </div>
        </div>
        <div className="reviewGrid">
          {reviewPacket.units.map((unit) => (
            <article className="reviewUnit" key={unit.unitId}>
              <p>{unit.unitType}</p>
              <h3>{unit.surface ?? unit.unitId}</h3>
              <div className="reviewFields">{unit.kernelFieldsInScope.join(', ')}</div>
              <p>{unit.reviewQuestion}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryPanel" aria-labelledby="movement-boundary">
        <h2 id="movement-boundary">Movement Boundary</h2>
        <dl>
          {Object.entries(previewData.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .axiomPreview {
          min-height: 100vh;
          background: #f7f5ef;
          color: #17201a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
          padding: 40px;
        }

        .hero,
        .statusBand,
        .kernelPanel,
        .matrixPanel,
        .reviewedPublicSlotsPanel,
        .reviewedPageAssemblyPanel,
        .stableSlotPanel,
        .candidatePagePanel,
        .gate8Panel,
        .runnerCriteriaPanel,
        .runnerReceiptPanel,
        .candidateReviewPacketPanel,
        .scaffoldPanel,
        .renderAdapterPanel,
        .pageShellPanel,
        .pageShellReviewPanel,
        .publicPagePreviewPanel,
        .publicPageHoldPanel,
        .releaseReadinessLedgerPanel,
        .promotionRequestPacketPanel,
        .promotionHandoffManifestPanel,
        .publicReleaseDecisionPacketShellPanel,
        .publicNavigationReleaseRouteShellPanel,
        .finalPublicReleaseReviewPacketPanel,
        .founderFinalReleaseDecisionHandoffManifestPanel,
        .founderFinalReleaseDecisionReceiptShellPanel,
        .founderFinalReleaseDecisionIngestionContractPanel,
        .founderFinalReleaseDecisionPayloadShellPanel,
        .founderFinalReleaseDecisionPayloadValidationGatePanel,
        .founderFinalReleaseDecisionPayloadValidationReceiptShellPanel,
        .founderFinalReleaseDecisionPayloadReturnHoldShellPanel,
        .surfaceSection,
        .reviewPanel,
        .boundaryPanel {
          max-width: 1180px;
          margin: 0 auto 24px;
        }

        .hero {
          border-bottom: 1px solid #cad2c3;
          padding-bottom: 28px;
        }

        .eyebrow {
          color: #59705e;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p,
        dl {
          margin: 0;
        }

        h1 {
          max-width: 880px;
          font-size: clamp(2.3rem, 6vw, 5.1rem);
          line-height: 0.96;
          letter-spacing: 0;
          margin-top: 10px;
        }

        .hero p {
          max-width: 760px;
          margin-top: 18px;
          color: #465246;
          font-size: 1rem;
          line-height: 1.75;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .badges span,
        .surfaceCardHeader span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .statusBand,
        .kernelPanel,
        .matrixPanel,
        .reviewedPublicSlotsPanel,
        .reviewedPageAssemblyPanel,
        .stableSlotPanel,
        .candidatePagePanel,
        .gate8Panel,
        .runnerCriteriaPanel,
        .runnerReceiptPanel,
        .candidateReviewPacketPanel,
        .scaffoldPanel,
        .renderAdapterPanel,
        .pageShellPanel,
        .pageShellReviewPanel,
        .publicPagePreviewPanel,
        .publicPageHoldPanel,
        .releaseReadinessLedgerPanel,
        .promotionRequestPacketPanel,
        .promotionHandoffManifestPanel,
        .publicReleaseDecisionPacketShellPanel,
        .publicNavigationReleaseRouteShellPanel,
        .finalPublicReleaseReviewPacketPanel,
        .founderFinalReleaseDecisionHandoffManifestPanel,
        .founderFinalReleaseDecisionReceiptShellPanel,
        .founderFinalReleaseDecisionIngestionContractPanel,
        .founderFinalReleaseDecisionPayloadShellPanel,
        .founderFinalReleaseDecisionPayloadValidationGatePanel,
        .founderFinalReleaseDecisionPayloadValidationReceiptShellPanel,
        .founderFinalReleaseDecisionPayloadReturnHoldShellPanel,
        .reviewPanel,
        .boundaryPanel {
          background: #ffffff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 22px;
        }

        .statusBand {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
        }

        .reviewedPublicSlotsPanel {
          display: grid;
          gap: 18px;
        }

        h2 {
          font-size: 1rem;
          letter-spacing: 0;
        }

        .statusBand p,
        .reviewQuestion,
        .sectionIntro p,
        .navigationRole,
        .fieldRows p,
        .draftSamples p,
        .reviewedSlotRows p {
          color: #556257;
          font-size: 0.88rem;
          line-height: 1.65;
        }

        .statusBand p {
          margin-top: 10px;
          overflow-wrap: anywhere;
        }

        dl {
          display: grid;
          gap: 12px;
        }

        .statusBand dl,
        .boundaryPanel dl {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        dt {
          color: #6d7c6e;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        dd {
          color: #1c281f;
          font-size: 0.9rem;
          font-weight: 700;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .kernelGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 16px;
        }

        .matrixSummary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        .candidateSummary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        .gate8Summary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        .runnerSummary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        .receiptSummary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        .kernelGrid div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .matrixSummary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .candidateSummary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .gate8Summary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .runnerSummary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .receiptSummary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .kernelGrid span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .matrixSummary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .candidateSummary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .gate8Summary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .runnerSummary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .receiptSummary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .kernelGrid strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .matrixSummary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .candidateSummary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .gate8Summary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .runnerSummary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .receiptSummary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .scenarioRows {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          margin-top: 14px;
        }

        .scenarioRows article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 12px;
        }

        .scenarioRows article > p {
          color: #17201a;
          font-size: 0.72rem;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .scenarioRows dl {
          gap: 8px;
          margin-top: 10px;
        }

        .scenarioRows dd {
          font-size: 0.78rem;
        }

        .reviewSummary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        .reviewSummary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .reviewSummary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .reviewSummary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .reviewedSlotSummary {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .reviewedSlotSummary div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 14px;
        }

        .reviewedSlotSummary span {
          color: #657364;
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .reviewedSlotSummary strong {
          display: block;
          font-size: 0.9rem;
          overflow-wrap: anywhere;
        }

        .reviewedSlotGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .reviewedPageGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .reviewedSlotGrid article,
        .reviewedPageGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .reviewedSlotGrid article > p,
        .reviewedPageGrid article > p {
          color: #667568;
          font-size: 0.76rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .reviewedSlotRows {
          display: grid;
          gap: 8px;
          margin-top: 12px;
        }

        .reviewedSlotRows div {
          background: #f7f5ef;
          border: 1px solid #e3e7de;
          border-radius: 8px;
          padding: 10px;
        }

        .reviewedSlotRows span {
          color: #667568;
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .reviewedSlotRows strong {
          color: #1c281f;
          display: block;
          font-size: 0.82rem;
          margin-top: 3px;
        }

        .reviewQuestion {
          border-top: 1px solid #d8ded1;
          margin-top: 18px;
          padding-top: 16px;
        }

        .sectionIntro {
          align-items: end;
          display: flex;
          gap: 20px;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .sectionIntro p {
          max-width: 560px;
        }

        .surfaceGrid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .stableSlotGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .candidateGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .gate8CheckGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .runnerCriteriaGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .receiptEvidenceGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .gate8CheckGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .runnerCriteriaGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .receiptEvidenceGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .gate8CheckGrid p {
          color: #17201a;
          font-size: 0.88rem;
          font-weight: 800;
        }

        .runnerCriteriaGrid p {
          color: #17201a;
          font-size: 0.88rem;
          font-weight: 800;
        }

        .receiptEvidenceGrid p {
          color: #17201a;
          font-size: 0.88rem;
          font-weight: 800;
        }

        .gate8CheckGrid span {
          color: #556257;
          display: block;
          font-size: 0.8rem;
          line-height: 1.5;
          margin-top: 8px;
        }

        .runnerCriteriaGrid span {
          color: #556257;
          display: block;
          font-size: 0.8rem;
          line-height: 1.5;
          margin-top: 8px;
          overflow-wrap: anywhere;
        }

        .receiptEvidenceGrid span {
          color: #556257;
          display: block;
          font-size: 0.8rem;
          line-height: 1.5;
          margin-top: 8px;
          overflow-wrap: anywhere;
        }

        .testTargetPanel {
          border-top: 1px solid #e3e7de;
          margin-top: 18px;
          padding-top: 14px;
        }

        .testTargetPanel h3 {
          font-size: 0.95rem;
        }

        .testTargetPanel div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .testTargetPanel span {
          background: #f7f5ef;
          border: 1px solid #d8ded1;
          border-radius: 999px;
          color: #425043;
          font-size: 0.76rem;
          font-weight: 700;
          line-height: 1.35;
          max-width: 100%;
          overflow-wrap: anywhere;
          padding: 7px 9px;
        }

        .candidateGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .candidateGrid article > p {
          color: #748273;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .candidateGrid h3 {
          font-size: 0.98rem;
          margin-top: 6px;
        }

        .candidateGrid dl {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 12px;
        }

        .candidateGrid dl div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 10px;
        }

        .stableSlotGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .stableSlotGrid article > p {
          color: #748273;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .stableSlotGrid h3 {
          font-size: 0.98rem;
          margin-top: 6px;
        }

        .stableSlotGrid dl {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 12px;
        }

        .stableSlotGrid dl div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 10px;
        }

        .slotMeta {
          border-top: 1px solid #e3e7de;
          display: grid;
          gap: 6px;
          margin-top: 12px;
          padding-top: 12px;
        }

        .slotMeta span {
          color: #556257;
          font-size: 0.8rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .reviewGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 14px;
        }

        .reviewUnit {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .reviewUnit > p:first-child {
          color: #748273;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .reviewUnit h3 {
          font-size: 0.95rem;
          line-height: 1.3;
          margin-top: 6px;
          overflow-wrap: anywhere;
        }

        .reviewUnit > p:last-child,
        .reviewFields {
          color: #556257;
          font-size: 0.82rem;
          line-height: 1.55;
          margin-top: 8px;
        }

        .reviewFields {
          background: #f7f5ef;
          border-radius: 6px;
          padding: 8px;
        }

        .surfaceCard {
          background: #ffffff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          min-height: 430px;
          padding: 18px;
        }

        .surfaceCardHeader {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .surfaceCardHeader p {
          color: #748273;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1.35;
          max-width: 100%;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .surfaceCardHeader h3 {
          font-size: 1.05rem;
          line-height: 1.24;
          margin-top: 6px;
        }

        .navigationRole {
          margin-top: 12px;
        }

        .operationGrid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 14px;
        }

        .operationGrid div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 10px;
        }

        .operationGrid dd {
          font-size: 1.1rem;
        }

        .fieldRows {
          border-top: 1px solid #e3e7de;
          display: grid;
          gap: 4px;
          margin-top: 14px;
          padding-top: 12px;
        }

        .draftSamples {
          display: grid;
          gap: 8px;
          margin-top: auto;
          padding-top: 14px;
        }

        .draftSamples p {
          background: #f7f5ef;
          border-left: 3px solid #77936e;
          border-radius: 4px;
          padding: 10px;
        }

        @media (max-width: 980px) {
          .axiomPreview {
            padding: 28px 18px;
          }

          .statusBand,
          .kernelGrid,
          .matrixSummary,
          .candidateSummary,
          .gate8Summary,
          .runnerSummary,
          .receiptSummary,
          .scenarioRows,
          .reviewGrid,
          .reviewSummary,
          .reviewedSlotSummary,
          .reviewedSlotGrid,
          .reviewedPageGrid,
          .surfaceGrid,
          .stableSlotGrid,
          .candidateGrid,
          .gate8CheckGrid,
          .runnerCriteriaGrid,
          .receiptEvidenceGrid {
            grid-template-columns: 1fr;
          }

          .sectionIntro {
            align-items: flex-start;
            flex-direction: column;
          }

          .surfaceCard {
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .statusBand dl,
          .boundaryPanel dl,
          .operationGrid {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 2.45rem;
          }
        }
      `}</style>
    </main>
  );
}
