import { buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell';

const returnHoldShell =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionPayloadReturnHoldShell();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionPayloadReturnHoldShellSurface() {
  return (
    <main className="returnHoldSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Payload Return Hold Shell</div>
        <h1>Axiom Candidate Founder Final Release Decision Payload Return Hold Shell</h1>
        <p>
          validation receipt shellから作る内部return/hold shell。空payload拒否を保持したまま、
          外部でpayload shellを補完する必要だけを示し、payload validation、ingestion、Founder判断、
          公開承認、publication、actual public navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>return hold</span>
          <span>not ingested</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="return-hold-summary">
        <div>
          <h2 id="return-hold-summary">Payload Return Hold Shell Summary</h2>
          <p>{returnHoldShell.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{returnHoldShell.status}</dd>
          </div>
          <div>
            <dt>shell mode</dt>
            <dd>{returnHoldShell.shellMode}</dd>
          </div>
          <div>
            <dt>return hold</dt>
            <dd>{returnHoldShell.returnHoldStatus}</dd>
          </div>
          <div>
            <dt>return target</dt>
            <dd>{returnHoldShell.returnTargetStatus}</dd>
          </div>
          <div>
            <dt>payload acceptance</dt>
            <dd>{returnHoldShell.payloadAcceptanceStatus}</dd>
          </div>
          <div>
            <dt>return hold units</dt>
            <dd>
              {returnHoldShell.returnHoldUnitCount} / {returnHoldShell.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="returnHoldPanel" aria-labelledby="return-hold-units">
        <div className="sectionIntro">
          <h2 id="return-hold-units">Payload Return Hold Units</h2>
          <p>11 validation receipt unitsを、外部payload補完へ戻すhold単位へ変換する。</p>
        </div>
        <div className="returnHoldStack">
          {returnHoldShell.returnHoldUnits.map((unit) => (
            <article className="returnHoldCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.returnHoldStatus}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>return target</dt>
                  <dd>{unit.returnTargetStatus}</dd>
                </div>
                <div>
                  <dt>validation</dt>
                  <dd>{unit.payloadValidationStatus}</dd>
                </div>
                <div>
                  <dt>payload acceptance</dt>
                  <dd>{unit.payloadAcceptanceStatus}</dd>
                </div>
                <div>
                  <dt>source receipt unit</dt>
                  <dd>{unit.sourceValidationReceiptUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredReturnHoldRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.returnHoldOptions.map((option) => (
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
          {Object.entries(returnHoldShell.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .returnHoldSurface {
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
        .returnHoldPanel,
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
        .returnHoldPanel,
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

        .returnHoldStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .returnHoldCard {
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
          .returnHoldSurface {
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
