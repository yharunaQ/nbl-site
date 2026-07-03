import Link from 'next/link';
import { buildAxiomReviewedKernelBackedCandidatePageAssembly } from '@/lib/axiom/reviewedKernelBackedCandidatePageAssembly';
import { buildAxiomReviewedKernelBackedCandidateRouteMap } from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';
import { buildAxiomWorkDesignViewBackboneSurfacePropagation } from '@/lib/axiom/workDesignViewBackboneSurfacePropagation';
import { buildAxiomWorkDesignBackboneSurfaceDraftAssembly } from '@/lib/axiom/workDesignBackboneSurfaceDraftAssembly';
import { AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE } from '@/lib/axiom/falconAxiomPublicSiteUpdatePlan';

const assembly = buildAxiomReviewedKernelBackedCandidatePageAssembly();
const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap(assembly);
const backbonePropagation = buildAxiomWorkDesignViewBackboneSurfacePropagation();
const surfaceDraftAssembly = buildAxiomWorkDesignBackboneSurfaceDraftAssembly();
const surfaceDraftBySurface = new Map(
  surfaceDraftAssembly.surfaceDrafts.map((draft) => [draft.surface, draft]),
);

function compactTrace(values: string[], limit = 3) {
  const visible = values.slice(0, limit);
  const hiddenCount = Math.max(values.length - visible.length, 0);

  return hiddenCount > 0 ? `${visible.join(', ')} +${hiddenCount}` : visible.join(', ');
}

function publicCandidatePath(slug: string) {
  return `${AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE}/${slug}`;
}

export default function AxiomReviewedNextNblPagesSurface() {
  return (
    <main className="reviewedPages">
      <header className="hero">
        <p className="eyebrow">Falcon Lab / Axiom next NBL</p>
        <h1>Reviewed Kernel-Backed Next NBL Pages</h1>
        <p>
          Founder accepted kernel review resultから作った9つの内部candidate page。
          actual public navigation、public approval、publicationはまだ作らない。
        </p>
        <div className="heroMeta">
          <span>{assembly.status}</span>
          <span>{assembly.pageCount} pages</span>
          <span>{assembly.sectionCount} sections</span>
          <span>{assembly.sourceKernelRowCount} kernel rows</span>
          <span>{assembly.sourceReviewUnitCount} review units</span>
          <span>{backbonePropagation.slotCandidateCount} backbone slots</span>
          <span>{surfaceDraftAssembly.surfaceDraftCandidateCount} body drafts</span>
        </div>
      </header>

      <section className="summary" aria-labelledby="assembly-summary">
        <div>
          <h2 id="assembly-summary">Assembly Boundary</h2>
          <p>{assembly.boundary}</p>
        </div>
        <dl>
          <div>
            <dt>source slots</dt>
            <dd>{assembly.sourceSlotCount}</dd>
          </div>
          <div>
            <dt>represented rows</dt>
            <dd>{assembly.coverage.representedKernelRowIds.length}</dd>
          </div>
          <div>
            <dt>route status</dt>
            <dd>route_intent_only_actual_public_navigation_not_created</dd>
          </div>
        </dl>
      </section>

      <section className="backbonePropagation" aria-labelledby="backbone-propagation">
        <div className="sectionIntro">
          <p className="eyebrow">kernel-derived work-design backbone</p>
          <h2 id="backbone-propagation">9 Surface Backbone Propagation</h2>
          <p>
            旧21視点を固定せず、Axiomでsemantic reconstructionした仕事設計backboneを9つの次期NBL
            surfaceへ流す内部slot候補。ここでは公開本文ではなく、各surfaceがどのseed/section候補を受け取るかを固定する。
          </p>
        </div>
        <dl className="backboneMeta">
          <div>
            <dt>policy</dt>
            <dd>{backbonePropagation.contentSourcePolicy}</dd>
          </div>
          <div>
            <dt>surface slots</dt>
            <dd>{backbonePropagation.slotCandidateCount}</dd>
          </div>
          <div>
            <dt>downstream</dt>
            <dd>{backbonePropagation.downstreamSurfaceCount}</dd>
          </div>
          <div>
            <dt>review</dt>
            <dd>{backbonePropagation.reviewPolicy.reviewUnitScale}</dd>
          </div>
        </dl>
        <div className="backboneGrid">
          {backbonePropagation.surfaceSlots.map((slot) => (
            <article key={slot.slotCandidateId}>
              <p>{slot.propagationMode}</p>
              <h3>{slot.surface}</h3>
              <p>{slot.propagationRoleJa}</p>
              {surfaceDraftBySurface.get(slot.surface) ? (
                <div className="draftPreview">
                  <h4>{surfaceDraftBySurface.get(slot.surface)?.pageHeadingCandidateJa}</h4>
                  <p>{surfaceDraftBySurface.get(slot.surface)?.openingThesisCandidateJa}</p>
                </div>
              ) : null}
              <div className="traceGrid compact">
                <div>
                  <dt>operation</dt>
                  <dd>{slot.operation}</dd>
                </div>
                <div>
                  <dt>seed drafts</dt>
                  <dd>{slot.sourceSeedCount}</dd>
                </div>
                <div>
                  <dt>sections</dt>
                  <dd>{slot.sourceSectionCount}</dd>
                </div>
                <div>
                  <dt>status</dt>
                  <dd>{surfaceDraftBySurface.get(slot.surface)?.semanticReviewStatus}</dd>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pageStack" aria-labelledby="page-stack">
        <h2 id="page-stack">9 Internal Candidate Pages</h2>
        {assembly.pages.map((page) => (
          <article className="pageCard" key={page.pageId}>
            <header>
              <p>{page.surface}</p>
              <h3>{page.pageTitleJa}</h3>
              <span>{page.routeIntent}</span>
              {routeMap.routes.find((route) => route.surface === page.surface) ? (
                <div className="routeLinks">
                  <Link
                    href={
                      routeMap.routes.find((route) => route.surface === page.surface)?.path ??
                      '/internal/axiom-next-nbl-reviewed-candidate/home'
                    }
                  >
                    kernel route
                  </Link>
                  <Link
                    href={publicCandidatePath(
                      routeMap.routes.find((route) => route.surface === page.surface)?.slug ??
                        'home',
                    )}
                  >
                    public candidate
                  </Link>
                </div>
              ) : null}
            </header>
            <p className="navigationRole">{page.navigationRoleJa}</p>
            <dl className="pageMeta">
              <div>
                <dt>route</dt>
                <dd>{page.routeStatus}</dd>
              </div>
              <div>
                <dt>status</dt>
                <dd>{page.pageStatus}</dd>
              </div>
              <div>
                <dt>sections</dt>
                <dd>{page.sectionCount}</dd>
              </div>
              <div>
                <dt>publication</dt>
                <dd>{page.publicationStatus}</dd>
              </div>
              <div>
                <dt>public use</dt>
                <dd>{page.publicUseStatus}</dd>
              </div>
            </dl>
            <div className="sections">
              {page.sections.map((section) => (
                <section className="sectionCard" key={section.sectionId}>
                  <div className="sectionHead">
                    <div>
                      <p>{section.field}</p>
                      <h4>{section.headingJa}</h4>
                    </div>
                    <span>{section.operation}</span>
                  </div>
                  {section.bodyDraftJa ? (
                    <p className="bodyDraft">{section.bodyDraftJa}</p>
                  ) : (
                    <p className="holdDraft">{section.reviewRoute}</p>
                  )}
                  <div className="traceGrid">
                    <div>
                      <dt>section</dt>
                      <dd>{section.sectionId}</dd>
                    </div>
                    <div>
                      <dt>slot</dt>
                      <dd>{section.sourceSlotId}</dd>
                    </div>
                    <div>
                      <dt>rows</dt>
                      <dd>{compactTrace(section.sourceKernelRowIds)}</dd>
                    </div>
                    <div>
                      <dt>review units</dt>
                      <dd>{compactTrace(section.sourceReviewUnitIds)}</dd>
                    </div>
                    <div>
                      <dt>section status</dt>
                      <dd>{section.sectionStatus}</dd>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>

      <style jsx>{`
        .reviewedPages {
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
        .summary,
        .backbonePropagation,
        .pageStack {
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
        h4,
        p,
        dl {
          margin: 0;
        }

        h1 {
          font-size: clamp(2.2rem, 5vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: 0;
          margin-top: 10px;
          max-width: 900px;
        }

        .hero > p:last-of-type {
          color: #465246;
          font-size: 1rem;
          line-height: 1.75;
          margin-top: 18px;
          max-width: 780px;
        }

        .heroMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .heroMeta span,
        .pageCard header span,
        .pageCard header a,
        .sectionHead > span {
          border: 1px solid #a7b59f;
          border-radius: 999px;
          color: #304034;
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1.2;
          padding: 8px 10px;
        }

        .pageCard header a {
          background: #17201a;
          color: #fff;
          text-decoration: none;
        }

        .routeLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }

        .summary,
        .backbonePropagation,
        .pageCard {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 22px;
        }

        .summary {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        }

        .summary p,
        .sectionIntro p,
        .backboneGrid article > p:nth-of-type(2),
        .navigationRole,
        .bodyDraft,
        .holdDraft {
          color: #4d5a51;
          font-size: 0.92rem;
          line-height: 1.7;
        }

        .summary dl,
        .backboneMeta,
        .pageMeta {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .summary dl div,
        .backboneMeta div,
        .pageMeta div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 12px;
        }

        dt {
          color: #6d7c6e;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        dd {
          color: #1c281f;
          font-size: 0.86rem;
          font-weight: 700;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .pageStack {
          display: grid;
          gap: 16px;
        }

        .sectionIntro {
          margin-bottom: 14px;
        }

        .sectionIntro h2 {
          font-size: 1.12rem;
          margin-top: 4px;
        }

        .sectionIntro p:last-child {
          margin-top: 8px;
          max-width: 880px;
        }

        .backboneGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .backboneGrid article {
          background: #f8f7f1;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 14px;
        }

        .backboneGrid article > p:first-child {
          color: #667568;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .backboneGrid h3 {
          font-size: 0.9rem;
          margin-top: 4px;
          overflow-wrap: anywhere;
        }

        .backboneGrid article > p:nth-of-type(2) {
          font-size: 0.8rem;
          margin-top: 8px;
        }

        .draftPreview {
          background: #fff;
          border: 1px solid #e0e3d9;
          border-radius: 8px;
          margin-top: 10px;
          padding: 10px;
        }

        .draftPreview h4 {
          font-size: 0.88rem;
        }

        .draftPreview p {
          color: #4d5a51;
          font-size: 0.78rem;
          line-height: 1.58;
          margin-top: 6px;
        }

        .pageStack > h2 {
          font-size: 1rem;
        }

        .pageCard header {
          align-items: flex-start;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .pageCard header p,
        .sectionHead p {
          color: #667568;
          font-size: 0.76rem;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .pageCard h3 {
          font-size: 1.35rem;
          margin-top: 4px;
        }

        .navigationRole,
        .pageMeta,
        .sections {
          margin-top: 14px;
        }

        .sections {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .sectionCard {
          background: #f7f5ef;
          border: 1px solid #e3e7de;
          border-radius: 8px;
          padding: 14px;
        }

        .sectionHead {
          align-items: flex-start;
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }

        .sectionHead h4 {
          font-size: 0.96rem;
          margin-top: 4px;
        }

        .bodyDraft,
        .holdDraft {
          margin-top: 10px;
        }

        .holdDraft {
          background: #fff;
          border-left: 3px solid #7f8d78;
          border-radius: 4px;
          padding: 10px;
        }

        .traceGrid {
          border-top: 1px solid #d8ded1;
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 12px;
          padding-top: 12px;
        }

        .traceGrid.compact {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (max-width: 920px) {
          .reviewedPages {
            padding: 28px 18px;
          }

          .summary,
          .summary dl,
          .backboneMeta,
          .backboneGrid,
          .pageMeta,
          .sections,
          .traceGrid {
            grid-template-columns: 1fr;
          }

          .pageCard header,
          .sectionHead {
            display: grid;
          }
        }
      `}</style>
    </main>
  );
}
