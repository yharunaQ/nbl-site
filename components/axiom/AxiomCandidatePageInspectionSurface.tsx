import { buildAxiomCandidatePageDataBundle } from '@/lib/axiom/siteCandidatePageData';
import {
  AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE,
  buildAxiomCandidatePageRouteMap,
} from '@/lib/axiom/siteCandidatePageRouteMap';
import { buildAxiomGate8PreflightContract } from '@/lib/axiom/siteGate8PreflightContract';
import { buildAxiomSitePreviewReviewMatrix } from '@/lib/axiom/sitePreviewReviewMatrix';
import type {
  AxiomKernelFieldId,
  AxiomNextNblSiteSurface,
  AxiomSurfaceSlotOperation,
} from '@/lib/axiom/siteSurfaceSlotContract';

const previewReviewMatrix = buildAxiomSitePreviewReviewMatrix();
const candidatePageDataBundle = buildAxiomCandidatePageDataBundle(previewReviewMatrix);
const routeMap = buildAxiomCandidatePageRouteMap(candidatePageDataBundle);
const gate8Preflight = buildAxiomGate8PreflightContract(routeMap);

const surfaceLabels: Record<AxiomNextNblSiteSurface, string> = {
  reader_facing_top_home: 'Top / Home',
  work_condition_window: 'Work-condition window',
  consultation_case_reading_collection: 'Case-reading collection',
  twenty_one_views_work_design_guide: 'kernel-derived views guide',
  theory_method_trust_page: 'Theory / Method / Trust',
  article_social_question_library: 'Article / Social question library',
  cognitive_support_toolkit_studio_multimodal_objects: 'Toolkit / Studio',
  about_operating_boundary_page: 'About / Boundary',
  scene_entry_use_cases: 'Scene entry / Use cases',
};

const fieldLabels: Record<AxiomKernelFieldId, string> = {
  observation: 'observation',
  inference: 'inference',
  counterHypothesis: 'counterHypothesis',
  missingContext: 'missingContext',
  implementationActorConditions: 'implementationActorConditions',
  sourceLensStatus: 'sourceLensStatus',
  actionabilityBand: 'actionabilityBand',
  cannotYetSay: 'cannotYetSay',
  humanReviewRoute: 'humanReviewRoute',
};

const operationLabels: Record<AxiomSurfaceSlotOperation, string> = {
  display: 'display',
  translate: 'translate',
  hide: 'hide',
  route_to_review: 'route to review',
};

function boundaryValue(value: string): string {
  return value.replace(/_/g, ' ');
}

export default function AxiomCandidatePageInspectionSurface() {
  return (
    <main className="candidateInspection">
      <header className="hero">
        <div className="eyebrow">Axiom Candidate Pages</div>
        <h1>Axiom Candidate Page Inspection</h1>
        <p>
          9つの次期NBL surfaceを、Axiom candidate page dataから内部検査用にrenderする。
          公開route、公開navigation、公開承認ではない。
        </p>
        <div className="badges" aria-label="boundary status">
          <span>Falcon Lab</span>
          <span>kernel_display</span>
          <span>kernel_human_review_loop</span>
          <span>internal only</span>
          <span>not published</span>
        </div>
      </header>

      <section className="summaryPanel" aria-labelledby="route-map">
        <div>
          <h2 id="route-map">Internal Route Map</h2>
          <p>{routeMap.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>route base</dt>
            <dd>{AXIOM_CANDIDATE_PAGE_INTERNAL_ROUTE_BASE}</dd>
          </div>
          <div>
            <dt>routes</dt>
            <dd>{routeMap.routeCount}</dd>
          </div>
          <div>
            <dt>source bundle</dt>
            <dd>{candidatePageDataBundle.bundleId}</dd>
          </div>
          <div>
            <dt>status</dt>
            <dd>{routeMap.status}</dd>
          </div>
        </dl>
      </section>

      <section className="routePanel" aria-labelledby="route-list">
        <div className="sectionIntro">
          <h2 id="route-list">Route Map Entries</h2>
          <p>内部inspection anchorの一覧。public navigationには追加しない。</p>
        </div>
        <div className="routeGrid">
          {routeMap.routes.map((route) => (
            <article key={route.routeId}>
              <p>{route.surface}</p>
              <h3>{surfaceLabels[route.surface]}</h3>
              <span>{route.internalPath}</span>
              <span>{route.routeStatus}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="preflightPanel" aria-labelledby="gate8-preflight">
        <div className="sectionIntro">
          <h2 id="gate8-preflight">Gate 8 Preflight Hold</h2>
          <p>
            候補surfaceへの昇格前に必要なhold。currentness、accessibility、regression、
            public-boundary、human reviewを未完了として見える化する。
          </p>
        </div>
        <div className="preflightGrid">
          {gate8Preflight.routePreflights.map((route) => (
            <article key={route.routePreflightId}>
              <p>{route.surface}</p>
              <dl>
                <div>
                  <dt>candidate</dt>
                  <dd>{route.candidateSurfaceStatus}</dd>
                </div>
                <div>
                  <dt>currentness</dt>
                  <dd>{route.sourceCurrentnessStatus}</dd>
                </div>
                <div>
                  <dt>accessibility</dt>
                  <dd>{route.accessibilityStatus}</dd>
                </div>
                <div>
                  <dt>regression</dt>
                  <dd>{route.regressionStatus}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="pagePanel" aria-labelledby="candidate-pages">
        <div className="sectionIntro">
          <h2 id="candidate-pages">Candidate Page Renderings</h2>
          <p>
            各surfaceのsectionは、stable slotから作った内部assembly。public draftを持つsectionも
            review-requiredのまま扱う。
          </p>
        </div>
        <div className="pageStack">
          {candidatePageDataBundle.pages.map((page) => (
            <article className="candidatePage" id={page.surface} key={page.pageDataId}>
              <div className="pageHeader">
                <div>
                  <p>{page.surface}</p>
                  <h3>{surfaceLabels[page.surface]}</h3>
                </div>
                <span>{page.sectionCount} sections</span>
              </div>
              <p className="navigationRole">{page.navigationRole}</p>
              <dl className="pageStats">
                <div>
                  <dt>coverage</dt>
                  <dd>{page.scenarioCoverageCount} scenarios</dd>
                </div>
                <div>
                  <dt>review route</dt>
                  <dd>{page.reviewRoute}</dd>
                </div>
                <div>
                  <dt>hidden</dt>
                  <dd>{page.hiddenFields.length > 0 ? page.hiddenFields.join(', ') : 'none'}</dd>
                </div>
                <div>
                  <dt>review routed</dt>
                  <dd>
                    {page.reviewRoutedFields.length > 0
                      ? page.reviewRoutedFields.join(', ')
                      : 'none'}
                  </dd>
                </div>
              </dl>
              <div className="sectionGrid">
                {page.sections.map((section) => (
                  <section className="candidateSection" key={section.sectionId}>
                    <div className="sectionHeader">
                      <p>{fieldLabels[section.field]}</p>
                      <span>{operationLabels[section.operation]}</span>
                    </div>
                    <p className="policy">{section.sectionPolicy}</p>
                    <div className="draftBlock">
                      <span>internal basis</span>
                      {section.representativeInternalDrafts.map((draft, index) => (
                        <p key={`${section.sectionId}-internal-${index}`}>{draft}</p>
                      ))}
                    </div>
                    {section.representativePublicDrafts.length > 0 ? (
                      <div className="draftBlock">
                        <span>review-required public draft candidate</span>
                        {section.representativePublicDrafts.map((draft, index) => (
                          <p key={`${section.sectionId}-public-${index}`}>{draft}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="noPublicDraft">no public draft for this section</p>
                    )}
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
          {Object.entries(routeMap.movementBoundary).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{boundaryValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <style jsx>{`
        .candidateInspection {
          min-height: 100vh;
          background: #f6f7f3;
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
        .routePanel,
        .preflightPanel,
        .pagePanel,
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
          font-size: clamp(2.25rem, 6vw, 5rem);
          line-height: 0.96;
          letter-spacing: 0;
          margin-top: 10px;
        }

        .hero p {
          max-width: 760px;
          margin-top: 18px;
          color: #465246;
          font-size: 1rem;
          line-height: 1.75;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .badges span,
        .pageHeader > span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1;
          padding: 8px 10px;
        }

        .summaryPanel,
        .routePanel,
        .preflightPanel,
        .pagePanel,
        .boundaryPanel {
          background: #ffffff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 22px;
        }

        .summaryPanel {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        }

        h2 {
          font-size: 1rem;
          letter-spacing: 0;
        }

        .summaryPanel p,
        .sectionIntro p,
        .navigationRole,
        .policy,
        .draftBlock p,
        .noPublicDraft {
          color: #556257;
          font-size: 0.88rem;
          line-height: 1.65;
        }

        .summaryPanel p {
          margin-top: 10px;
          overflow-wrap: anywhere;
        }

        dl {
          display: grid;
          gap: 12px;
        }

        .summaryPanel dl,
        .boundaryPanel dl {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        dt {
          color: #6d7c6e;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        dd {
          color: #1c281f;
          font-size: 0.9rem;
          font-weight: 700;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .sectionIntro {
          align-items: end;
          display: flex;
          gap: 20px;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .sectionIntro p {
          max-width: 600px;
        }

        .routeGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .preflightGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .preflightGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .preflightGrid article > p {
          color: #748273;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .preflightGrid dl {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 12px;
        }

        .preflightGrid dl div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 10px;
        }

        .routeGrid article {
          border: 1px solid #dfe4d9;
          border-radius: 8px;
          padding: 14px;
        }

        .routeGrid p,
        .pageHeader p {
          color: #748273;
          font-size: 0.62rem;
          font-weight: 800;
          line-height: 1.35;
          overflow-wrap: anywhere;
          text-transform: uppercase;
        }

        .routeGrid h3,
        .pageHeader h3 {
          font-size: 1rem;
          line-height: 1.25;
          margin-top: 6px;
        }

        .routeGrid span {
          color: #556257;
          display: block;
          font-size: 0.78rem;
          line-height: 1.5;
          margin-top: 8px;
          overflow-wrap: anywhere;
        }

        .pageStack {
          display: grid;
          gap: 16px;
        }

        .candidatePage {
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 18px;
        }

        .pageHeader {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }

        .navigationRole {
          margin-top: 12px;
        }

        .pageStats {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 14px;
        }

        .pageStats div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 10px;
        }

        .sectionGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 16px;
        }

        .candidateSection {
          background: #f7f5ef;
          border-left: 3px solid #77936e;
          border-radius: 6px;
          padding: 14px;
        }

        .sectionHeader {
          align-items: center;
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        .sectionHeader p {
          font-size: 0.92rem;
          font-weight: 800;
        }

        .sectionHeader span {
          background: #ffffff;
          border: 1px solid #d8ded1;
          border-radius: 999px;
          color: #465246;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 6px 8px;
        }

        .policy,
        .noPublicDraft {
          margin-top: 8px;
        }

        .draftBlock {
          border-top: 1px solid #dde3d7;
          margin-top: 12px;
          padding-top: 10px;
        }

        .draftBlock span {
          color: #6d7c6e;
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .draftBlock p + p {
          margin-top: 8px;
        }

        @media (max-width: 980px) {
          .candidateInspection {
            padding: 28px 18px;
          }

          .summaryPanel,
          .routeGrid,
          .preflightGrid,
          .pageStats,
          .sectionGrid {
            grid-template-columns: 1fr;
          }

          .sectionIntro,
          .pageHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .summaryPanel dl,
          .boundaryPanel dl {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 2.4rem;
          }
        }
      `}</style>
    </main>
  );
}
