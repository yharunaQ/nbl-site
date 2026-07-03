import { buildAxiomInternalCandidatePublicPageHoldPacket } from '@/lib/axiom/siteInternalCandidatePublicPageHoldPacket';

const holdPacket = buildAxiomInternalCandidatePublicPageHoldPacket();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidatePublicPageHoldPacketSurface() {
  return (
    <main className="holdPacketSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Hold Packet</div>
        <h1>Axiom Candidate Public Page Hold Packet</h1>
        <p>
          candidate-public-page preview assemblyから作る内部hold gate。public navigation、
          candidate昇格、公開承認、公開release、review実行ではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not released</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="hold-summary">
        <div>
          <h2 id="hold-summary">Hold Packet Summary</h2>
          <p>{holdPacket.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{holdPacket.status}</dd>
          </div>
          <div>
            <dt>hold units</dt>
            <dd>
              {holdPacket.holdUnitCount} / {holdPacket.maxCoreReviewUnits}
            </dd>
          </div>
          <div>
            <dt>review execution</dt>
            <dd>{holdPacket.reviewExecutionStatus}</dd>
          </div>
          <div>
            <dt>reviewer assignment</dt>
            <dd>{holdPacket.reviewerAssignmentStatus}</dd>
          </div>
        </dl>
      </section>

      <section className="holdPanel" aria-labelledby="hold-units">
        <div className="sectionIntro">
          <h2 id="hold-units">Hold Units</h2>
          <p>公開前に止める境界をsurface単位とcross/gate単位へ凝縮する。</p>
        </div>
        <div className="holdStack">
          {holdPacket.holdUnits.map((unit) => (
            <article className="holdCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.holdCheckCount} hold checks</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>preview blocks</dt>
                  <dd>{unit.previewBlockCount}</dd>
                </div>
                <div>
                  <dt>review execution</dt>
                  <dd>{unit.reviewExecutionStatus}</dd>
                </div>
                <div>
                  <dt>reviewer assignment</dt>
                  <dd>{unit.reviewerAssignmentStatus}</dd>
                </div>
                <div>
                  <dt>source path</dt>
                  <dd>{unit.sourceInternalPreviewPath ?? 'cross/gate unit'}</dd>
                </div>
              </dl>
              <div className="checkGrid">
                {unit.holdChecks.map((check) => (
                  <section className="checkCard" key={check.checkId}>
                    <div>
                      <p>{check.category}</p>
                      <span>{check.evidenceSource}</span>
                    </div>
                    <strong>{check.holdStatus}</strong>
                    <span>{check.requirement}</span>
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
          {Object.entries(holdPacket.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .holdPacketSurface {
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
        .holdPanel,
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
        .holdPanel,
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

        .holdStack {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }

        .holdCard {
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
        .checkCard p {
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

        .checkGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .checkCard {
          background: #fbfbf7;
          border: 1px solid #dfe5d8;
          border-radius: 8px;
          display: grid;
          gap: 8px;
          min-width: 0;
          padding: 12px;
        }

        .checkCard strong {
          color: #24332a;
          font-size: 0.84rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .checkCard span {
          color: #566353;
          font-size: 0.78rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 860px) {
          .holdPacketSurface {
            padding: 22px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .metaGrid,
          .checkGrid,
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
