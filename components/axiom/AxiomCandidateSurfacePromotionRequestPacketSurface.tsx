import { buildAxiomInternalCandidateSurfacePromotionRequestPacket } from '@/lib/axiom/siteInternalCandidateSurfacePromotionRequestPacket';

const promotionRequestPacket = buildAxiomInternalCandidateSurfacePromotionRequestPacket();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateSurfacePromotionRequestPacketSurface() {
  return (
    <main className="promotionRequestSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Promotion Request Packet</div>
        <h1>Axiom Candidate Surface Promotion Request Packet</h1>
        <p>
          readiness ledgerから作る内部review input。request packetは作るが、submission、 candidate
          promotion、public navigation、公開releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>review input only</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="promotion-request-summary">
        <div>
          <h2 id="promotion-request-summary">Request Summary</h2>
          <p>{promotionRequestPacket.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{promotionRequestPacket.status}</dd>
          </div>
          <div>
            <dt>request mode</dt>
            <dd>{promotionRequestPacket.requestMode}</dd>
          </div>
          <div>
            <dt>submission</dt>
            <dd>{promotionRequestPacket.requestSubmissionStatus}</dd>
          </div>
          <div>
            <dt>candidate promotion</dt>
            <dd>{promotionRequestPacket.candidatePromotionStatus}</dd>
          </div>
          <div>
            <dt>review units</dt>
            <dd>
              {promotionRequestPacket.requestUnitCount} /{' '}
              {promotionRequestPacket.maxCoreReviewUnits}
            </dd>
          </div>
          <div>
            <dt>source ledger entries</dt>
            <dd>{promotionRequestPacket.sourceLedgerEntryCount}</dd>
          </div>
        </dl>
      </section>

      <section className="requestPanel" aria-labelledby="promotion-request-units">
        <div className="sectionIntro">
          <h2 id="promotion-request-units">Review Input Units</h2>
          <p>66 readiness entriesを、surface / cross / Gate 8の11 review unitsへ凝縮する。</p>
        </div>
        <div className="requestStack">
          {promotionRequestPacket.requestUnits.map((unit) => (
            <article className="requestCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.sourceLedgerEntryCount} ledger entries</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>request status</dt>
                  <dd>{unit.requestStatus}</dd>
                </div>
                <div>
                  <dt>disposition</dt>
                  <dd>{unit.promotionDisposition}</dd>
                </div>
                <div>
                  <dt>review route</dt>
                  <dd>{unit.humanReviewRoute}</dd>
                </div>
                <div>
                  <dt>source ledger unit</dt>
                  <dd>{unit.sourceLedgerUnitId}</dd>
                </div>
              </dl>
              <div className="statusRow">
                {unit.sourceReadinessStatuses.map((status) => (
                  <span key={`${unit.unitId}-${status}`}>{status}</span>
                ))}
              </div>
              <div className="decisionGrid">
                {unit.requiredReviewDecisions.map((decision) => (
                  <span key={`${unit.unitId}-${decision}`}>{decision}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryPanel" aria-labelledby="movement-boundary">
        <h2 id="movement-boundary">Movement Boundary</h2>
        <dl>
          {Object.entries(promotionRequestPacket.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .promotionRequestSurface {
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
        .requestPanel,
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
          max-width: 900px;
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
          max-width: 780px;
        }

        .badges,
        .statusRow,
        .decisionGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .badges {
          margin-top: 20px;
        }

        .badges span,
        .cardHeader span,
        .statusRow span,
        .decisionGrid span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.74rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .summaryPanel,
        .requestPanel,
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
          letter-spacing: 0;
          text-transform: uppercase;
        }

        dd {
          color: #263229;
          font-size: 0.9rem;
          line-height: 1.45;
          margin: 4px 0 0;
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

        .requestStack {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }

        .requestCard {
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

        .cardHeader p {
          color: #5d6d5d;
          font-size: 0.74rem;
          font-weight: 800;
          overflow-wrap: anywhere;
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

        .statusRow,
        .decisionGrid {
          margin-top: 14px;
        }

        .decisionGrid span {
          background: #fbfbf7;
          border-radius: 8px;
          line-height: 1.35;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 860px) {
          .promotionRequestSurface {
            padding: 22px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .metaGrid,
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
