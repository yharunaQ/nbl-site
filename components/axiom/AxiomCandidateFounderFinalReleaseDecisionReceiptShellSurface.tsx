import { buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionReceiptShell';

const founderReceiptShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionReceiptShell();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionReceiptShellSurface() {
  return (
    <main className="founderReceiptSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Founder Receipt Shell</div>
        <h1>Axiom Candidate Founder Final Release Decision Receipt Shell</h1>
        <p>
          Founder final-release decision handoff manifestから作る内部receipt shell。
          Founder判断receiptはまだ受領しておらず、公開承認、publication、actual public
          navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not received</span>
          <span>not decided</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="founder-receipt-summary">
        <div>
          <h2 id="founder-receipt-summary">Founder Decision Receipt Shell Summary</h2>
          <p>{founderReceiptShell.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{founderReceiptShell.status}</dd>
          </div>
          <div>
            <dt>shell mode</dt>
            <dd>{founderReceiptShell.shellMode}</dd>
          </div>
          <div>
            <dt>decision receipt</dt>
            <dd>{founderReceiptShell.decisionReceiptStatus}</dd>
          </div>
          <div>
            <dt>Founder decision</dt>
            <dd>{founderReceiptShell.founderDecisionStatus}</dd>
          </div>
          <div>
            <dt>public approval</dt>
            <dd>{founderReceiptShell.publicApprovalStatus}</dd>
          </div>
          <div>
            <dt>receipt units</dt>
            <dd>
              {founderReceiptShell.receiptUnitCount} / {founderReceiptShell.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="receiptPanel" aria-labelledby="founder-receipt-units">
        <div className="sectionIntro">
          <h2 id="founder-receipt-units">Founder Final Release Decision Receipt Units</h2>
          <p>11 Founder handoff unitsを、未受領receipt shellの未決要件へ変換する。</p>
        </div>
        <div className="receiptStack">
          {founderReceiptShell.receiptUnits.map((unit) => (
            <article className="receiptCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.decisionReceiptStatus}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>Founder decision</dt>
                  <dd>{unit.founderDecisionStatus}</dd>
                </div>
                <div>
                  <dt>actual public navigation</dt>
                  <dd>{unit.actualPublicNavigationStatus}</dd>
                </div>
                <div>
                  <dt>public approval</dt>
                  <dd>{unit.publicApprovalStatus}</dd>
                </div>
                <div>
                  <dt>source handoff unit</dt>
                  <dd>{unit.sourceHandoffUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredReceiptRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.receiptOptions.map((option) => (
                  <span key={`${unit.unitId}-${option}`}>{option}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="boundaryPanel" aria-labelledby="movement-boundary">
        <h2 id="movement-boundary">Movement Boundary</h2>
        <dl>
          {Object.entries(founderReceiptShell.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .founderReceiptSurface {
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
        .receiptPanel,
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
          max-width: 960px;
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
          max-width: 800px;
        }

        .badges,
        .requirementGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .badges {
          margin-top: 20px;
        }

        .badges span,
        .cardHeader span,
        .requirementGrid span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.74rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .summaryPanel,
        .receiptPanel,
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
          color: #17201a;
          font-size: 0.86rem;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .receiptStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .receiptCard {
          border: 1px solid #d7dfd0;
          border-radius: 8px;
          padding: 16px;
        }

        .cardHeader {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }

        .cardHeader p {
          color: #627062;
          font-size: 0.74rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        h2 {
          font-size: clamp(1.45rem, 3vw, 2.35rem);
          line-height: 1.05;
        }

        h3 {
          font-size: 1rem;
          line-height: 1.25;
          margin-top: 4px;
          overflow-wrap: anywhere;
        }

        .metaGrid,
        .requirementGrid {
          margin-top: 14px;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 16px;
        }

        @media (max-width: 760px) {
          .founderReceiptSurface {
            padding: 24px 16px;
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
        }
      `}</style>
    </main>
  );
}
