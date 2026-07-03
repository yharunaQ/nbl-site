import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomFalconCandidateSurfaceReviewPacket } from '@/lib/axiom/siteFalconCandidateSurfaceReviewPacket';
import { buildAxiomInternalCandidateSurfaceImplementationScaffold } from '@/lib/axiom/siteInternalCandidateSurfaceImplementationScaffold';
import type { AxiomGate8PreflightRunnerReceipt } from '@/lib/axiom/siteGate8PreflightRunnerReceipt';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import type { AxiomNextNblSiteSurface } from '@/lib/axiom/siteSurfaceSlotContract';
import gate8RunnerReceiptArtifact from '@/references/axiom/axiom-gate8-preflight-runner-receipt-v0-2026-06-07.json';

const candidatePageDataBundle = buildAxiomCandidatePageDataBundle(
  buildAxiomSitePreviewReviewMatrix(),
);
const candidateSurfaceReviewPacket = buildAxiomFalconCandidateSurfaceReviewPacket(
  gate8RunnerReceiptArtifact as unknown as AxiomGate8PreflightRunnerReceipt,
);
const implementationScaffold = buildAxiomInternalCandidateSurfaceImplementationScaffold(
  candidatePageDataBundle,
  candidateSurfaceReviewPacket,
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

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateSurfaceImplementationScaffoldSurface() {
  return (
    <main className="scaffoldSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Candidate Surface</div>
        <h1>Axiom Internal Candidate Surface Scaffold</h1>
        <p>
          reviewed-slot dataとcandidate-surface review packetから作る内部実装scaffold。 Falcon
          candidate昇格、公開navigation、公開承認、公開releaseではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not promoted</span>
          <span>not public</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="scaffold-summary">
        <div>
          <h2 id="scaffold-summary">Scaffold Summary</h2>
          <p>{implementationScaffold.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{implementationScaffold.status}</dd>
          </div>
          <div>
            <dt>implementations</dt>
            <dd>{implementationScaffold.implementationCount}</dd>
          </div>
          <div>
            <dt>review units</dt>
            <dd>
              {implementationScaffold.reviewUnitCount} / {implementationScaffold.maxCoreReviewUnits}
            </dd>
          </div>
          <div>
            <dt>review execution</dt>
            <dd>{implementationScaffold.sourceReviewExecutionStatus}</dd>
          </div>
        </dl>
      </section>

      <section className="implementationPanel" aria-labelledby="implementation-list">
        <div className="sectionIntro">
          <h2 id="implementation-list">Internal Implementation Scaffolds</h2>
          <p>各surfaceのsection render modeとreview/promotion boundaryを固定する。</p>
        </div>
        <div className="implementationStack">
          {implementationScaffold.implementations.map((implementation) => (
            <article
              className="implementationCard"
              id={implementation.surface}
              key={implementation.implementationId}
            >
              <div className="cardHeader">
                <div>
                  <p>{implementation.surface}</p>
                  <h3>{surfaceLabels[implementation.surface]}</h3>
                </div>
                <span>{implementation.sectionScaffoldCount} sections</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>internal path</dt>
                  <dd>{implementation.internalImplementationPath}</dd>
                </div>
                <div>
                  <dt>candidate status</dt>
                  <dd>{implementation.candidateSurfaceStatus}</dd>
                </div>
                <div>
                  <dt>public navigation</dt>
                  <dd>{implementation.publicNavigationStatus}</dd>
                </div>
                <div>
                  <dt>publication</dt>
                  <dd>{implementation.publicationStatus}</dd>
                </div>
              </dl>
              <div className="sectionGrid">
                {implementation.sectionScaffolds.map((section) => (
                  <section className="sectionCard" key={section.sectionScaffoldId}>
                    <div>
                      <p>{section.field}</p>
                      <span>{section.operation}</span>
                    </div>
                    <strong>{section.renderMode}</strong>
                    <span>{section.publicUseStatus}</span>
                    <span>{section.publicationStatus}</span>
                  </section>
                ))}
              </div>
              <div className="decisionRows">
                {implementation.requiredReviewDecisions.map((decision) => (
                  <span key={`${implementation.implementationId}-${decision}`}>{decision}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryPanel" aria-labelledby="movement-boundary">
        <h2 id="movement-boundary">Movement Boundary</h2>
        <dl>
          {Object.entries(implementationScaffold.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .scaffoldSurface {
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
        .summaryPanel,
        .implementationPanel,
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
          max-width: 860px;
          font-size: clamp(2.25rem, 5.6vw, 4.9rem);
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
        .cardHeader span,
        .decisionRows span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .summaryPanel,
        .implementationPanel,
        .boundaryPanel {
          background: #ffffff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 22px;
        }

        .summaryPanel {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
        }

        h2 {
          font-size: 1rem;
          letter-spacing: 0;
        }

        .summaryPanel p,
        .sectionIntro p {
          color: #556257;
          font-size: 0.88rem;
          line-height: 1.65;
          margin-top: 10px;
          overflow-wrap: anywhere;
        }

        dl {
          display: grid;
          gap: 12px;
        }

        .summaryPanel dl,
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

        .sectionIntro {
          align-items: end;
          display: flex;
          gap: 20px;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .implementationStack {
          display: grid;
          gap: 14px;
        }

        .implementationCard {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 18px;
        }

        .cardHeader {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }

        .cardHeader p {
          color: #748273;
          font-size: 0.66rem;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .cardHeader h3 {
          font-size: 1.05rem;
          margin-top: 6px;
        }

        .metaGrid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 14px;
        }

        .metaGrid div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 10px;
        }

        .sectionGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .sectionCard {
          background: #f7f5ef;
          border-radius: 8px;
          display: grid;
          gap: 7px;
          padding: 12px;
        }

        .sectionCard p {
          color: #17201a;
          font-size: 0.88rem;
          font-weight: 800;
        }

        .sectionCard span,
        .sectionCard strong {
          color: #556257;
          display: block;
          font-size: 0.78rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .decisionRows {
          border-top: 1px solid #e3e7de;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
          padding-top: 14px;
        }

        .decisionRows span {
          border-radius: 8px;
          line-height: 1.35;
        }

        @media (max-width: 980px) {
          .scaffoldSurface {
            padding: 28px 18px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .boundaryPanel dl,
          .metaGrid,
          .sectionGrid {
            grid-template-columns: 1fr;
          }

          .sectionIntro,
          .cardHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
