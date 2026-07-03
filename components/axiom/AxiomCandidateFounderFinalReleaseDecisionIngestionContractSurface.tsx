import { buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionIngestionContract';

const founderIngestionContract =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionIngestionContract();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionIngestionContractSurface() {
  return (
    <main className="founderIngestionSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Founder Ingestion Contract</div>
        <h1>Axiom Candidate Founder Final Release Decision Ingestion Contract</h1>
        <p>
          Founder final-release decision receipt shellの後段に置く内部ingestion contract。
          外部Founder判断payloadはまだ空で、ingestion、公開承認、publication、actual public
          navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_eval</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>empty</span>
          <span>not ingested</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="founder-ingestion-summary">
        <div>
          <h2 id="founder-ingestion-summary">Founder Decision Ingestion Contract Summary</h2>
          <p>{founderIngestionContract.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{founderIngestionContract.status}</dd>
          </div>
          <div>
            <dt>contract mode</dt>
            <dd>{founderIngestionContract.contractMode}</dd>
          </div>
          <div>
            <dt>external payload</dt>
            <dd>{founderIngestionContract.externalDecisionPayloadStatus}</dd>
          </div>
          <div>
            <dt>ingestion</dt>
            <dd>{founderIngestionContract.ingestionStatus}</dd>
          </div>
          <div>
            <dt>Founder decision</dt>
            <dd>{founderIngestionContract.founderDecisionStatus}</dd>
          </div>
          <div>
            <dt>ingestion units</dt>
            <dd>
              {founderIngestionContract.ingestionUnitCount} /{' '}
              {founderIngestionContract.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="ingestionPanel" aria-labelledby="founder-ingestion-units">
        <div className="sectionIntro">
          <h2 id="founder-ingestion-units">Founder Final Release Decision Ingestion Units</h2>
          <p>11 receipt unitsを、空のingestion contractの必須要件へ変換する。</p>
        </div>
        <div className="ingestionStack">
          {founderIngestionContract.ingestionUnits.map((unit) => (
            <article className="ingestionCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.ingestionStatus}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>external payload</dt>
                  <dd>{unit.externalDecisionPayloadStatus}</dd>
                </div>
                <div>
                  <dt>Founder decision</dt>
                  <dd>{unit.founderDecisionStatus}</dd>
                </div>
                <div>
                  <dt>actual public navigation</dt>
                  <dd>{unit.actualPublicNavigationStatus}</dd>
                </div>
                <div>
                  <dt>source receipt unit</dt>
                  <dd>{unit.sourceReceiptUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredIngestionRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.ingestionOptions.map((option) => (
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
          {Object.entries(founderIngestionContract.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .founderIngestionSurface {
          min-height: 100vh;
          background: #f6f3ec;
          color: #181f1c;
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
        .ingestionPanel,
        .boundaryPanel {
          max-width: 1180px;
          margin: 0 auto 24px;
        }

        .hero {
          border-bottom: 1px solid #c9d3c5;
          padding-bottom: 28px;
        }

        .eyebrow {
          color: #556e5b;
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
          color: #536052;
          line-height: 1.7;
          margin-top: 10px;
          max-width: 820px;
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
          border: 1px solid #a6b49e;
          border-radius: 999px;
          color: #304034;
          font-size: 0.74rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .summaryPanel,
        .ingestionPanel,
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
          color: #181f1c;
          font-size: 0.86rem;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .ingestionStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .ingestionCard {
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

        .requirementGrid {
          margin-top: 14px;
        }

        @media (max-width: 760px) {
          .founderIngestionSurface {
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
