import { buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest } from '@/lib/axiom/siteInternalCandidateFounderFinalReleaseDecisionHandoffManifest';

const founderHandoffManifest =
  buildAxiomInternalCandidateFounderFinalReleaseDecisionHandoffManifest();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidateFounderFinalReleaseDecisionHandoffManifestSurface() {
  return (
    <main className="founderHandoffSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Founder Handoff</div>
        <h1>Axiom Candidate Founder Final Release Decision Handoff Manifest</h1>
        <p>
          final public-release review packetから作る内部Founder handoff manifest。handoff送付、
          Founder判断、review実行、公開承認、publication、actual public
          navigation、releaseは行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not sent</span>
          <span>not decided</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="founder-handoff-summary">
        <div>
          <h2 id="founder-handoff-summary">Founder Handoff Manifest Summary</h2>
          <p>{founderHandoffManifest.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{founderHandoffManifest.status}</dd>
          </div>
          <div>
            <dt>manifest mode</dt>
            <dd>{founderHandoffManifest.manifestMode}</dd>
          </div>
          <div>
            <dt>handoff</dt>
            <dd>{founderHandoffManifest.handoffStatus}</dd>
          </div>
          <div>
            <dt>Founder decision</dt>
            <dd>{founderHandoffManifest.founderDecisionStatus}</dd>
          </div>
          <div>
            <dt>public approval</dt>
            <dd>{founderHandoffManifest.publicApprovalStatus}</dd>
          </div>
          <div>
            <dt>handoff units</dt>
            <dd>
              {founderHandoffManifest.manifestUnitCount} /{' '}
              {founderHandoffManifest.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="handoffPanel" aria-labelledby="founder-handoff-units">
        <div className="sectionIntro">
          <h2 id="founder-handoff-units">Founder Final Release Decision Handoff Units</h2>
          <p>11 final review unitsを、Founder判断前の未送付handoff要件へ変換する。</p>
        </div>
        <div className="handoffStack">
          {founderHandoffManifest.manifestUnits.map((unit) => (
            <article className="handoffCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.handoffStatus}</span>
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
                  <dt>source final review unit</dt>
                  <dd>{unit.sourceFinalReviewUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredHandoffRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.handoffDecisionOptions.map((option) => (
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
          {Object.entries(founderHandoffManifest.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .founderHandoffSurface {
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
        .handoffPanel,
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
        .handoffPanel,
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

        .handoffStack {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .handoffCard {
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
          .founderHandoffSurface {
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
