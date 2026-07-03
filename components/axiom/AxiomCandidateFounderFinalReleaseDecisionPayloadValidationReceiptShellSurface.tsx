import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell';

const validationReceiptShell =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShell();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionPayloadValidationReceiptShellSurface() {
  return (
    <main className="validationReceiptSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Payload Validation Receipt Shell</div>
        <h1>Axiom Candidate Founder Final Release Decision Payload Validation Receipt Shell</h1>
        <p>
          空のFounder final-release decision payloadを受け付けないvalidation gateから作る内部receipt
          shell。validation receiptは未受領で、payload
          validation、ingestion、Founder判断、公開承認、publication、actual public
          navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not received</span>
          <span>not validated</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="validation-receipt-summary">
        <div>
          <h2 id="validation-receipt-summary">Payload Validation Receipt Shell Summary</h2>
          <p>{validationReceiptShell.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{validationReceiptShell.status}</dd>
          </div>
          <div>
            <dt>shell mode</dt>
            <dd>{validationReceiptShell.shellMode}</dd>
          </div>
          <div>
            <dt>validation receipt</dt>
            <dd>{validationReceiptShell.validationReceiptStatus}</dd>
          </div>
          <div>
            <dt>validation</dt>
            <dd>{validationReceiptShell.payloadValidationStatus}</dd>
          </div>
          <div>
            <dt>empty payload</dt>
            <dd>{validationReceiptShell.emptyPayloadDisposition}</dd>
          </div>
          <div>
            <dt>receipt units</dt>
            <dd>
              {validationReceiptShell.receiptUnitCount} /{' '}
              {validationReceiptShell.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="receiptPanel" aria-labelledby="validation-receipt-units">
        <div className="sectionIntro">
          <h2 id="validation-receipt-units">Payload Validation Receipt Units</h2>
          <p>11 validation gate unitsを、未受領validation receipt shellの未決要件へ変換する。</p>
        </div>
        <div className="receiptStack">
          {validationReceiptShell.receiptUnits.map((unit) => (
            <article className="receiptCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.validationReceiptStatus}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>validation</dt>
                  <dd>{unit.payloadValidationStatus}</dd>
                </div>
                <div>
                  <dt>empty payload</dt>
                  <dd>{unit.emptyPayloadDisposition}</dd>
                </div>
                <div>
                  <dt>payload acceptance</dt>
                  <dd>{unit.payloadAcceptanceStatus}</dd>
                </div>
                <div>
                  <dt>source validation unit</dt>
                  <dd>{unit.sourceValidationUnitId}</dd>
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
          {Object.entries(validationReceiptShell.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .validationReceiptSurface {
          min-height: 100vh;
          background: #f6f4ee;
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
          border-bottom: 1px solid #c9d0c2;
          padding-bottom: 28px;
        }

        .eyebrow {
          color: #5c6f5f;
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
          max-width: 980px;
          font-size: clamp(2.1rem, 5.4vw, 4.7rem);
          line-height: 0.98;
          letter-spacing: 0;
          margin-top: 10px;
        }

        .hero p,
        .summaryPanel p,
        .sectionIntro p {
          color: #556252;
          line-height: 1.7;
          margin-top: 10px;
          max-width: 860px;
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
          border: 1px solid #d7ddd0;
          border-radius: 8px;
          padding: 22px;
        }

        .summaryPanel {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
        }

        dl,
        .metaGrid {
          display: grid;
          gap: 10px;
        }

        .summaryPanel dl,
        .boundaryPanel dl {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        dt {
          color: #63705e;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        dd {
          color: #19241c;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .receiptStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .receiptCard {
          border: 1px solid #d7ddd0;
          border-radius: 8px;
          padding: 18px;
        }

        .cardHeader {
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }

        .cardHeader p {
          color: #64705f;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .cardHeader h3 {
          font-size: 1.08rem;
          margin-top: 4px;
          overflow-wrap: anywhere;
        }

        .metaGrid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 16px;
        }

        .requirementGrid {
          margin-top: 14px;
        }

        @media (max-width: 760px) {
          .validationReceiptSurface {
            padding: 24px 16px;
          }

          .summaryPanel,
          .summaryPanel dl,
          .boundaryPanel dl,
          .metaGrid {
            grid-template-columns: 1fr;
          }

          .cardHeader {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
