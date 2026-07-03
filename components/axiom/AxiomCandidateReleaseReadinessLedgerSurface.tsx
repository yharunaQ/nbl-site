import { buildAxiomInternalCandidateReleaseReadinessLedger } from '@/lib/axiom/siteInternalCandidateReleaseReadinessLedger';

const readinessLedger = buildAxiomInternalCandidateReleaseReadinessLedger();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateReleaseReadinessLedgerSurface() {
  return (
    <main className="ledgerSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Readiness Ledger</div>
        <h1>Axiom Candidate Release Readiness Ledger</h1>
        <p>
          hold packetから作る内部readiness ledger。内部通過とholdを分けるが、public
          navigation、candidate昇格、公開承認、公開releaseではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not ready for public release</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="ledger-summary">
        <div>
          <h2 id="ledger-summary">Readiness Summary</h2>
          <p>{readinessLedger.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{readinessLedger.status}</dd>
          </div>
          <div>
            <dt>release readiness</dt>
            <dd>{readinessLedger.releaseReadinessStatus}</dd>
          </div>
          <div>
            <dt>ledger units</dt>
            <dd>{readinessLedger.ledgerUnitCount}</dd>
          </div>
          <div>
            <dt>ledger entries</dt>
            <dd>{readinessLedger.ledgerEntryCount}</dd>
          </div>
        </dl>
      </section>

      <section className="ledgerPanel" aria-labelledby="ledger-units">
        <div className="sectionIntro">
          <h2 id="ledger-units">Readiness Units</h2>
          <p>内部通過・review required・Founder gate holdを公開前ledgerとして分離する。</p>
        </div>
        <div className="ledgerStack">
          {readinessLedger.ledgerUnits.map((unit) => (
            <article className="ledgerCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.entryCount} entries</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>release readiness</dt>
                  <dd>{unit.releaseReadinessStatus}</dd>
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
                  <dt>source hold unit</dt>
                  <dd>{unit.sourceHoldUnitId}</dd>
                </div>
              </dl>
              <div className="entryGrid">
                {unit.entries.map((entry) => (
                  <section className="entryCard" key={entry.entryId}>
                    <p>{entry.category}</p>
                    <strong>{entry.readinessStatus}</strong>
                    <span>{entry.sourceHoldCheckId}</span>
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
          {Object.entries(readinessLedger.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .ledgerSurface {
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
        .ledgerPanel,
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
        .ledgerPanel,
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

        .ledgerStack {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }

        .ledgerCard {
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
        .entryCard p {
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

        .entryGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .entryCard {
          background: #fbfbf7;
          border: 1px solid #dfe5d8;
          border-radius: 8px;
          display: grid;
          gap: 8px;
          min-width: 0;
          padding: 12px;
        }

        .entryCard strong {
          color: #24332a;
          font-size: 0.84rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .entryCard span {
          color: #566353;
          font-size: 0.78rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 860px) {
          .ledgerSurface {
            padding: 22px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .metaGrid,
          .entryGrid,
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
