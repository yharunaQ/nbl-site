import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadShell';

const founderPayloadShell = buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadShell();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionPayloadShellSurface() {
  return (
    <main className="founderPayloadSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Founder Payload Shell</div>
        <h1>Axiom Candidate Founder Final Release Decision Payload Shell</h1>
        <p>
          Founder final-release decision ingestion contractの前提になる空のpayload schema fixture。
          外部Founder判断payloadはまだ空で、payload acceptance、ingestion、公開承認、publication、
          actual public navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>empty fixture</span>
          <span>not accepted</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="founder-payload-summary">
        <div>
          <h2 id="founder-payload-summary">Founder Decision Payload Shell Summary</h2>
          <p>{founderPayloadShell.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{founderPayloadShell.status}</dd>
          </div>
          <div>
            <dt>shell mode</dt>
            <dd>{founderPayloadShell.shellMode}</dd>
          </div>
          <div>
            <dt>payload schema</dt>
            <dd>{founderPayloadShell.payloadSchemaStatus}</dd>
          </div>
          <div>
            <dt>external payload</dt>
            <dd>{founderPayloadShell.externalDecisionPayloadStatus}</dd>
          </div>
          <div>
            <dt>payload acceptance</dt>
            <dd>{founderPayloadShell.payloadAcceptanceStatus}</dd>
          </div>
          <div>
            <dt>payload units</dt>
            <dd>
              {founderPayloadShell.payloadUnitCount} / {founderPayloadShell.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="payloadPanel" aria-labelledby="founder-payload-units">
        <div className="sectionIntro">
          <h2 id="founder-payload-units">Founder Final Release Decision Payload Units</h2>
          <p>11 ingestion unitsを、外部Founder判断payloadの空schema fixtureへ変換する。</p>
        </div>
        <div className="payloadStack">
          {founderPayloadShell.payloadUnits.map((unit) => (
            <article className="payloadCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.externalDecisionPayloadStatus}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>schema</dt>
                  <dd>{unit.payloadSchemaStatus}</dd>
                </div>
                <div>
                  <dt>acceptance</dt>
                  <dd>{unit.payloadAcceptanceStatus}</dd>
                </div>
                <div>
                  <dt>ingestion</dt>
                  <dd>{unit.ingestionStatus}</dd>
                </div>
                <div>
                  <dt>source ingestion unit</dt>
                  <dd>{unit.sourceIngestionUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredPayloadRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="fieldGrid">
                {unit.payloadFields.map((field) => (
                  <span key={`${unit.unitId}-${field.fieldId}`}>
                    {field.fieldId}: {field.valueStatus} / {field.acceptedStatus}
                  </span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.payloadOptions.map((option) => (
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
          {Object.entries(founderPayloadShell.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .founderPayloadSurface {
          min-height: 100vh;
          background: #f7f4ee;
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
        .payloadPanel,
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
          max-width: 980px;
          font-size: clamp(2.18rem, 5.4vw, 4.8rem);
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
          max-width: 820px;
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
        .payloadPanel,
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

        .payloadStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .payloadCard {
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
          .founderPayloadSurface {
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
