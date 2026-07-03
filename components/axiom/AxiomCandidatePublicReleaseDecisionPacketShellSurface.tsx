import { buildAxiomInternalCandidatePublicReleaseDecisionPacketShell } from '@/lib/axiom/siteInternalCandidatePublicReleaseDecisionPacketShell';

const releaseDecisionShell = buildAxiomInternalCandidatePublicReleaseDecisionPacketShell();

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidatePublicReleaseDecisionPacketShellSurface() {
  return (
    <main className="releaseDecisionSurface">
      <header className="hero">
        <div className="eyebrow">Axiom Release Decision Shell</div>
        <h1>Axiom Candidate Public Release Decision Packet Shell</h1>
        <p>
          handoff manifestから作る内部release/no-release decision shell。公開承認、公開navigation、
          publication、release、source/support validity判断、review実行は行わない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>not approved</span>
          <span>not released</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="release-decision-summary">
        <div>
          <h2 id="release-decision-summary">Decision Shell Summary</h2>
          <p>{releaseDecisionShell.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>status</dt>
            <dd>{releaseDecisionShell.status}</dd>
          </div>
          <div>
            <dt>shell mode</dt>
            <dd>{releaseDecisionShell.shellMode}</dd>
          </div>
          <div>
            <dt>release decision</dt>
            <dd>{releaseDecisionShell.releaseDecisionStatus}</dd>
          </div>
          <div>
            <dt>public approval</dt>
            <dd>{releaseDecisionShell.publicApprovalStatus}</dd>
          </div>
          <div>
            <dt>publication</dt>
            <dd>{releaseDecisionShell.publicationStatus}</dd>
          </div>
          <div>
            <dt>decision units</dt>
            <dd>
              {releaseDecisionShell.decisionUnitCount} / {releaseDecisionShell.maxCoreReviewUnits}
            </dd>
          </div>
        </dl>
      </section>

      <section className="decisionPanel" aria-labelledby="decision-units">
        <div className="sectionIntro">
          <h2 id="decision-units">Release Decision Units</h2>
          <p>11 handoff unitsを、公開release判断前に必要な未決要件へ変換する。</p>
        </div>
        <div className="decisionStack">
          {releaseDecisionShell.decisionUnits.map((unit) => (
            <article className="decisionCard" key={unit.unitId}>
              <div className="cardHeader">
                <div>
                  <p>{unit.unitType}</p>
                  <h3>{unit.surface ?? unit.unitId}</h3>
                </div>
                <span>{unit.releaseDecisionStatus}</span>
              </div>
              <dl className="metaGrid">
                <div>
                  <dt>public approval</dt>
                  <dd>{unit.publicApprovalStatus}</dd>
                </div>
                <div>
                  <dt>publication</dt>
                  <dd>{unit.publicationStatus}</dd>
                </div>
                <div>
                  <dt>source/support validity</dt>
                  <dd>{unit.sourceSupportValidityStatus}</dd>
                </div>
                <div>
                  <dt>source handoff unit</dt>
                  <dd>{unit.sourceHandoffManifestUnitId}</dd>
                </div>
              </dl>
              <div className="requirementGrid">
                {unit.requiredReleaseDecisionRequirements.map((requirement) => (
                  <span key={`${unit.unitId}-${requirement}`}>{requirement}</span>
                ))}
              </div>
              <div className="requirementGrid">
                {unit.releaseDecisionOptions.map((option) => (
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
          {Object.entries(releaseDecisionShell.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .releaseDecisionSurface {
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
        .decisionPanel,
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
          max-width: 940px;
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
        .decisionPanel,
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

        .decisionStack {
          display: grid;
          gap: 16px;
          margin-top: 18px;
        }

        .decisionCard {
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

        .requirementGrid {
          margin-top: 14px;
        }

        .requirementGrid span {
          background: #fbfbf7;
          border-radius: 8px;
          line-height: 1.35;
        }

        .boundaryPanel dl {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 860px) {
          .releaseDecisionSurface {
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
