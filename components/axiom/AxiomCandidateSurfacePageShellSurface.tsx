import { buildAxiomInternalCandidateSurfacePageShellBundle } from '@/lib/axiom/siteInternalCandidateSurfacePageShell';
import type { AxiomNextNblSiteSurface } from '@/lib/axiom/siteSurfaceSlotContract';

const pageShellBundle = buildAxiomInternalCandidateSurfacePageShellBundle();

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

export default function AxiomCandidateSurfacePageShellSurface() {
  return (
    <main className="pageShellSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Page Shell</div>
        <h1>Axiom Candidate Surface Page Shell</h1>
        <p>
          render adapterを内部preview用のpage shellへ配置する。 public page、public
          navigation、candidate昇格、公開承認、公開releaseではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>internal preview only</span>
          <span>not promoted</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="page-shell-summary">
        <div>
          <h2 id="page-shell-summary">Page Shell Summary</h2>
          <p>{pageShellBundle.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{pageShellBundle.status}</dd>
          </div>
          <div>
            <dt>shells</dt>
            <dd>{pageShellBundle.shellCount}</dd>
          </div>
          <div>
            <dt>route base</dt>
            <dd>{pageShellBundle.routeBase}</dd>
          </div>
          <div>
            <dt>source adapter</dt>
            <dd>{pageShellBundle.sourceRenderAdapterBundleId}</dd>
          </div>
        </dl>
      </section>

      <section className="shellPanel" aria-labelledby="page-shell-list">
        <div className="sectionIntro">
          <h2 id="page-shell-list">Internal Page Shells</h2>
          <p>各surfaceを同じ内部page shellへ置き、公開前の表示単位を固定する。</p>
        </div>
        <div className="shellStack">
          {pageShellBundle.shells.map((shell) => (
            <article className="shellCard" id={shell.surface} key={shell.shellId}>
              <div className="cardHeader">
                <div>
                  <p>{shell.surface}</p>
                  <h3>{surfaceLabels[shell.surface]}</h3>
                </div>
                <span>{shell.regionCount} page regions</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>internal shell path</dt>
                  <dd>{shell.internalShellPath}</dd>
                </div>
                <div>
                  <dt>shell status</dt>
                  <dd>{shell.shellStatus}</dd>
                </div>
                <div>
                  <dt>shell kind</dt>
                  <dd>{shell.shellKind}</dd>
                </div>
                <div>
                  <dt>review execution</dt>
                  <dd>{shell.reviewExecutionStatus}</dd>
                </div>
                <div>
                  <dt>candidate</dt>
                  <dd>{shell.candidateSurfaceStatus}</dd>
                </div>
                <div>
                  <dt>public navigation</dt>
                  <dd>{shell.publicNavigationStatus}</dd>
                </div>
              </dl>
              <div className="regionGrid">
                {shell.regions.map((region) => (
                  <section className="regionCard" key={region.regionId}>
                    <div>
                      <p>{region.field}</p>
                      <span>{region.operation}</span>
                    </div>
                    <strong>{region.regionKind}</strong>
                    <span>{region.sourceComponentKind}</span>
                    <span>{region.allowedContentSource}</span>
                    <span>{region.allowedOutput}</span>
                    <span>{region.publicUseStatus}</span>
                    <span>{region.publicationStatus}</span>
                  </section>
                ))}
              </div>
              <div className="decisionRows">
                {shell.requiredReviewDecisions.map((decision) => (
                  <span key={`${shell.shellId}-${decision}`}>{decision}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryPanel" aria-labelledby="movement-boundary">
        <h2 id="movement-boundary">Movement Boundary</h2>
        <dl>
          {Object.entries(pageShellBundle.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .pageShellSurface {
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
        .shellPanel,
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
        .shellPanel,
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

        .summaryPanel p,
        .sectionIntro p {
          color: #556252;
          line-height: 1.7;
          margin-top: 8px;
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

        .shellStack {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }

        .shellCard {
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
        .regionCard p {
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

        .regionGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .regionCard {
          background: #fbfbf7;
          border: 1px solid #dfe5d8;
          border-radius: 8px;
          display: grid;
          gap: 8px;
          min-width: 0;
          padding: 12px;
        }

        .regionCard strong {
          color: #24332a;
          font-size: 0.84rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .regionCard span {
          color: #566353;
          font-size: 0.78rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .decisionRows {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 860px) {
          .pageShellSurface {
            padding: 22px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .metaGrid,
          .regionGrid,
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
