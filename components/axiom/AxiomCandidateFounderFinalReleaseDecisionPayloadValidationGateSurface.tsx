import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate';

const founderPayloadValidationGate =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadValidationGate();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionPayloadValidationGateSurface() {
  return (
    <main className="founderPayloadValidationSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Founder Payload Validation Gate</div>
        <h1>Axiom Candidate Founder Final Release Decision Payload Validation Gate</h1>
        <p>
          空のFounder decision payload shellを検証前に止める内部gate。外部payloadはまだ空で、
          validation実行、payload acceptance、ingestion、公開承認、publication、actual public
          navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not run</span>
          <span>rejected before ingestion</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="founder-validation-summary">
        <div>
          <h2 id="founder-validation-summary">Founder Payload Validation Gate Summary</h2>
          <p>{founderPayloadValidationGate.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{founderPayloadValidationGate.status}</dd>
          </div>
          <div>
            <dt>gate mode</dt>
            <dd>{founderPayloadValidationGate.gateMode}</dd>
          </div>
          <div>
            <dt>validation</dt>
            <dd>{founderPayloadValidationGate.payloadValidationStatus}</dd>
          </div>
          <div>
            <dt>empty payload</dt>
            <dd>{founderPayloadValidationGate.emptyPayloadDisposition}</dd>
          </div>
          <div>
            <dt>payload acceptance</dt>
            <dd>{founderPayloadValidationGate.payloadAcceptanceStatus}</dd>
          </div>
          <div>
            <dt>validation units</dt>
            <dd>
              {founderPayloadValidationGate.validationUnitCount} /{' '}
              {founderPayloadValidationGate.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="validationPanel" aria-labelledby="founder-validation-units">
        <div className="sectionIntro">
          <h2 id="founder-validation-units">Founder Payload Validation Units</h2>
          <p>11 payload unitsを、検証前に空payloadとしてrejectするgateへ変換する。</p>
        </div>
        <div className="validationStack">
          {founderPayloadValidationGate.validationUnits.map((unit) => (
            <article className="validationCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.emptyPayloadDisposition}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>execution</dt>
                  <dd>{unit.validationExecutionStatus}</dd>
                </div>
                <div>
                  <dt>validation</dt>
                  <dd>{unit.payloadValidationStatus}</dd>
                </div>
                <div>
                  <dt>acceptance</dt>
                  <dd>{unit.payloadAcceptanceStatus}</dd>
                </div>
                <div>
                  <dt>source payload unit</dt>
                  <dd>{unit.sourcePayloadUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredValidationRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="fieldGrid">
                {unit.sourcePayloadFieldIds.map((fieldId) => (
                  <span key={`${unit.unitId}-${fieldId}`}>{fieldId}</span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.validationOptions.map((option) => (
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
          {Object.entries(founderPayloadValidationGate.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .founderPayloadValidationSurface {
          min-height: 100vh;
          background: #f6f4ee;
          color: #171f1c;
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
        .validationPanel,
        .boundaryPanel {
          max-width: 1180px;
          margin: 0 auto 24px;
        }

        .hero {
          border-bottom: 1px solid #cbd4c7;
          padding-bottom: 28px;
        }

        .eyebrow {
          color: #566f5b;
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
          max-width: 1020px;
          font-size: clamp(2.12rem, 5.2vw, 4.7rem);
          line-height: 0.98;
          letter-spacing: 0;
          margin-top: 10px;
        }

        .hero p,
        .summaryPanel p,
        .sectionIntro p {
          color: #536152;
          line-height: 1.7;
          margin-top: 10px;
          max-width: 840px;
        }

        .badges,
        .requirementGrid,
        .fieldGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .badges {
          margin-top: 20px;
        }

        .badges span,
        .cardHeader span,
        .requirementGrid span,
        .fieldGrid span {
          border: 1px solid #a6b49e;
          border-radius: 999px;
          color: #304034;
          font-size: 0.74rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .fieldGrid span {
          background: #f7f9f4;
        }

        .summaryPanel,
        .validationPanel,
        .boundaryPanel {
          background: #ffffff;
          border: 1px solid #d7dfd0;
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
          color: #171f1c;
          font-size: 0.86rem;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .validationStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .validationCard {
          border: 1px solid #d7dfd0;
          border-radius: 8px;
          padding: 16px;
        }

        .cardHeader {
          align-items: start;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .cardHeader p {
          color: #667365;
          font-size: 0.74rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        h2 {
          font-size: 1.15rem;
        }

        h3 {
          font-size: 1rem;
          overflow-wrap: anywhere;
        }

        .metaGrid,
        .boundaryPanel dl {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 14px;
        }

        .requirementGrid,
        .fieldGrid {
          margin-top: 14px;
        }

        @media (max-width: 760px) {
          .founderPayloadValidationSurface {
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
