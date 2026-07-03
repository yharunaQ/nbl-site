import { buildAxiomInternalCandidatePublicPagePreviewAssembly } from '@/lib/axiom/siteInternalCandidatePublicPagePreviewAssembly';
import type { AxiomNextNblSiteSurface } from '@/lib/axiom/siteSurfaceSlotContract';

const previewAssembly = buildAxiomInternalCandidatePublicPagePreviewAssembly();

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

export default function AxiomCandidatePublicPagePreviewAssemblySurface() {
  return (
    <main className="previewAssemblySurface">
      <header className="hero">
        <div className="eyebrow">Axiom Internal Preview</div>
        <h1>Axiom Candidate Public Page Preview Assembly</h1>
        <p>
          page-shell review packetから作る内部candidate-public-page preview。public navigation、
          candidate昇格、公開承認、公開releaseではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>internal preview only</span>
          <span>not promoted</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="preview-assembly-summary">
        <div>
          <h2 id="preview-assembly-summary">Preview Assembly Summary</h2>
          <p>{previewAssembly.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{previewAssembly.status}</dd>
          </div>
          <div>
            <dt>previews</dt>
            <dd>{previewAssembly.previewCount}</dd>
          </div>
          <div>
            <dt>route base</dt>
            <dd>{previewAssembly.routeBase}</dd>
          </div>
          <div>
            <dt>review execution</dt>
            <dd>{previewAssembly.sourceReviewExecutionStatus}</dd>
          </div>
        </dl>
      </section>

      <section className="previewPanel" aria-labelledby="preview-list">
        <div className="sectionIntro">
          <h2 id="preview-list">Internal Candidate Public Page Previews</h2>
          <p>既存page regionsをreview gate付きの内部preview blockへ配置する。</p>
        </div>
        <div className="previewStack">
          {previewAssembly.previews.map((preview) => (
            <article className="previewCard" id={preview.surface} key={preview.previewId}>
              <div className="cardHeader">
                <div>
                  <p>{preview.surface}</p>
                  <h3>{surfaceLabels[preview.surface]}</h3>
                </div>
                <span>{preview.blockCount} preview blocks</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>internal preview path</dt>
                  <dd>{preview.internalPreviewPath}</dd>
                </div>
                <div>
                  <dt>preview status</dt>
                  <dd>{preview.previewStatus}</dd>
                </div>
                <div>
                  <dt>route status</dt>
                  <dd>{preview.routeStatus}</dd>
                </div>
                <div>
                  <dt>candidate</dt>
                  <dd>{preview.candidateSurfaceStatus}</dd>
                </div>
                <div>
                  <dt>public navigation</dt>
                  <dd>{preview.publicNavigationStatus}</dd>
                </div>
                <div>
                  <dt>publication</dt>
                  <dd>{preview.publicationStatus}</dd>
                </div>
              </dl>
              <div className="blockGrid">
                {preview.blocks.map((block) => (
                  <section className="blockCard" key={block.blockId}>
                    <div>
                      <p>{block.field}</p>
                      <span>{block.operation}</span>
                    </div>
                    <strong>{block.treatment}</strong>
                    <span>{block.contentSource}</span>
                    <span>{block.publicUseStatus}</span>
                    <span>{block.publicationStatus}</span>
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
          {Object.entries(previewAssembly.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .previewAssemblySurface {
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
        .previewPanel,
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
          font-size: clamp(2.25rem, 5.6vw, 4.9rem);
          line-height: 0.96;
          letter-spacing: 0;
          margin-top: 10px;
        }

        .hero p,
        .summaryPanel p,
        .sectionIntro p {
          color: #556252;
          line-height: 1.7;
          margin-top: 10px;
          max-width: 760px;
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
        .previewPanel,
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

        dl {
          display: grid;
          gap: 10px;
        }

        .summaryPanel dl,
        .metaGrid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        dt {
          color: #687467;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        dd {
          color: #263229;
          font-size: 0.9rem;
          line-height: 1.45;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .previewStack {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }

        .previewCard {
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 18px;
        }

        .cardHeader {
          align-items: start;
          display: flex;
          gap: 16px;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .cardHeader p,
        .blockCard p {
          color: #5d6d5d;
          font-size: 0.74rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        h2 {
          font-size: 1.28rem;
          letter-spacing: 0;
        }

        h3 {
          font-size: 1.04rem;
          letter-spacing: 0;
          margin-top: 4px;
        }

        .metaGrid,
        .boundaryPanel dl {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }

        .metaGrid div,
        .boundaryPanel dl div {
          background: #f6f8f3;
          border: 1px solid #e1e6dc;
          border-radius: 8px;
          padding: 10px;
        }

        .blockGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .blockCard {
          background: #fbfbf7;
          border: 1px solid #dfe5d8;
          border-radius: 8px;
          display: grid;
          gap: 8px;
          min-width: 0;
          padding: 12px;
        }

        .blockCard strong {
          color: #24332a;
          font-size: 0.84rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .blockCard span {
          color: #566353;
          font-size: 0.78rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 860px) {
          .previewAssemblySurface {
            padding: 22px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .metaGrid,
          .blockGrid,
          .boundaryPanel dl {
            grid-template-columns: 1fr;
          }

          .cardHeader {
            display: grid;
          }

          h1 {
            font-size: 2.35rem;
          }
        }
      `}</style>
    </main>
  );
}
