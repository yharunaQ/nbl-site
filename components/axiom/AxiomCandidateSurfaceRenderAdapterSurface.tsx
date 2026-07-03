import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import { buildAxiomFalconCandidateSurfaceReviewPacket } from '@/lib/axiom/siteFalconCandidateSurfaceReviewPacket';
import { buildAxiomInternalCandidateSurfaceImplementationScaffold } from '@/lib/axiom/siteInternalCandidateSurfaceImplementationScaffold';
import { buildAxiomInternalCandidateSurfaceRenderAdapterBundle } from '@/lib/axiom/siteInternalCandidateSurfaceRenderAdapter';
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
const renderAdapterBundle =
  buildAxiomInternalCandidateSurfaceRenderAdapterBundle(implementationScaffold);

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

export default function AxiomCandidateSurfaceRenderAdapterSurface() {
  return (
    <main className="adapterSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Render Adapter</div>
        <h1>Axiom Candidate Surface Render Adapter</h1>
        <p>
          implementation scaffoldを安定した内部component interfaceへ変換したrender adapter。 public
          page shell、candidate昇格、公開承認、公開releaseではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>internal preview only</span>
          <span>not promoted</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="adapter-summary">
        <div>
          <h2 id="adapter-summary">Adapter Summary</h2>
          <p>{renderAdapterBundle.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{renderAdapterBundle.status}</dd>
          </div>
          <div>
            <dt>adapters</dt>
            <dd>{renderAdapterBundle.adapterCount}</dd>
          </div>
          <div>
            <dt>route base</dt>
            <dd>{renderAdapterBundle.routeBase}</dd>
          </div>
          <div>
            <dt>source scaffold</dt>
            <dd>{renderAdapterBundle.sourceImplementationScaffoldId}</dd>
          </div>
        </dl>
      </section>

      <section className="adapterPanel" aria-labelledby="adapter-list">
        <div className="sectionIntro">
          <h2 id="adapter-list">Surface Render Adapters</h2>
          <p>各surfaceを同じ内部component interfaceで描画できるようにする。</p>
        </div>
        <div className="adapterStack">
          {renderAdapterBundle.adapters.map((adapter) => (
            <article className="adapterCard" id={adapter.surface} key={adapter.adapterId}>
              <div className="cardHeader">
                <div>
                  <p>{adapter.surface}</p>
                  <h3>{surfaceLabels[adapter.surface]}</h3>
                </div>
                <span>{adapter.renderSlotCount} render slots</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>internal path</dt>
                  <dd>{adapter.internalRenderPath}</dd>
                </div>
                <div>
                  <dt>adapter status</dt>
                  <dd>{adapter.adapterStatus}</dd>
                </div>
                <div>
                  <dt>shell</dt>
                  <dd>{adapter.shellStatus}</dd>
                </div>
                <div>
                  <dt>candidate</dt>
                  <dd>{adapter.candidateSurfaceStatus}</dd>
                </div>
              </dl>
              <div className="slotGrid">
                {adapter.renderSlots.map((slot) => (
                  <section className="slotCard" key={slot.renderSlotId}>
                    <div>
                      <p>{slot.field}</p>
                      <span>{slot.operation}</span>
                    </div>
                    <strong>{slot.componentKind}</strong>
                    <span>{slot.allowedOutput}</span>
                    <span>{slot.publicUseStatus}</span>
                    <span>{slot.publicationStatus}</span>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryPanel" aria-labelledby="movement-boundary">
        <h2 id="movement-boundary">Movement Boundary</h2>
        <dl>
          {Object.entries(renderAdapterBundle.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .adapterSurface {
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
        .adapterPanel,
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
        .cardHeader span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .summaryPanel,
        .adapterPanel,
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

        .adapterStack {
          display: grid;
          gap: 14px;
        }

        .adapterCard {
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

        .slotGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .slotCard {
          background: #f7f5ef;
          border-radius: 8px;
          display: grid;
          gap: 7px;
          padding: 12px;
        }

        .slotCard p {
          color: #17201a;
          font-size: 0.88rem;
          font-weight: 800;
        }

        .slotCard span,
        .slotCard strong {
          color: #556257;
          display: block;
          font-size: 0.78rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        @media (max-width: 980px) {
          .adapterSurface {
            padding: 28px 18px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .boundaryPanel dl,
          .metaGrid,
          .slotGrid {
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
