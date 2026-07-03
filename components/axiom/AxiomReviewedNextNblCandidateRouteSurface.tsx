import Link from 'next/link';
import {
  AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE,
  buildAxiomReviewedKernelBackedCandidateRouteMap,
  getAxiomReviewedKernelBackedCandidatePageForSlug,
} from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';
import { buildAxiomReviewedKernelBackedCandidatePageAssembly } from '@/lib/axiom/reviewedKernelBackedCandidatePageAssembly';
import { buildAxiomKernelDerivedWorkDesignViewsContract } from '@/lib/axiom/kernelDerivedWorkDesignViewsContract';
import { buildAxiomKernelDerivedWorkDesignViewSet } from '@/lib/axiom/kernelDerivedWorkDesignViewSet';
import { buildAxiomKernelSemanticWorkDesignViewDerivation } from '@/lib/axiom/kernelSemanticWorkDesignViewDerivation';
import { buildAxiomWorkDesignViewsGuideSemanticReconstruction } from '@/lib/axiom/workDesignViewsGuideSemanticReconstruction';
import { buildAxiomWorkDesignViewBackboneSurfacePropagation } from '@/lib/axiom/workDesignViewBackboneSurfacePropagation';
import { buildAxiomWorkDesignBackboneSurfaceDraftAssembly } from '@/lib/axiom/workDesignBackboneSurfaceDraftAssembly';

const assembly = buildAxiomReviewedKernelBackedCandidatePageAssembly();
const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap(assembly);
const derivedViewsContract = buildAxiomKernelDerivedWorkDesignViewsContract();
const derivedViewSet = buildAxiomKernelDerivedWorkDesignViewSet(derivedViewsContract);
const semanticDerivation = buildAxiomKernelSemanticWorkDesignViewDerivation(
  undefined,
  undefined,
  derivedViewsContract,
  derivedViewSet,
);
const semanticReconstruction = buildAxiomWorkDesignViewsGuideSemanticReconstruction(
  derivedViewsContract,
  derivedViewSet,
  semanticDerivation,
);
const backboneSurfacePropagation =
  buildAxiomWorkDesignViewBackboneSurfacePropagation(semanticReconstruction);
const surfaceDraftAssembly = buildAxiomWorkDesignBackboneSurfaceDraftAssembly(
  semanticReconstruction,
  backboneSurfacePropagation,
);
const heroImage = '/images/next-nbl-work-design-hero-v1.webp';

function compactTrace(values: string[], limit = 4) {
  const visible = values.slice(0, limit);
  const hiddenCount = Math.max(values.length - visible.length, 0);

  return hiddenCount > 0 ? `${visible.join(', ')} +${hiddenCount}` : visible.join(', ');
}

function pathForSlug(slug: string) {
  return `${AXIOM_REVIEWED_NEXT_NBL_CANDIDATE_ROUTE_BASE}/${slug}`;
}

export function AxiomReviewedNextNblCandidateRouteNotFound({ slug }: { slug: string }) {
  return (
    <main className="candidateRoute">
      <section className="notFound">
        <p>internal candidate route not found</p>
        <h1>{slug}</h1>
        <Link href={pathForSlug('home')}>homeへ戻る</Link>
      </section>
      <style jsx>{`
        .candidateRoute {
          min-height: 100vh;
          background: #f7f5ef;
          color: #17201a;
          padding: 40px;
        }

        .notFound {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          margin: 0 auto;
          max-width: 720px;
          padding: 28px;
        }
      `}</style>
    </main>
  );
}

export default function AxiomReviewedNextNblCandidateRouteSurface({ slug }: { slug: string }) {
  const current = getAxiomReviewedKernelBackedCandidatePageForSlug(slug, assembly, routeMap);

  if (!current) {
    return <AxiomReviewedNextNblCandidateRouteNotFound slug={slug} />;
  }

  const { page, route } = current;
  const visibleSections = page.sections.filter((section) => section.bodyDraftJa !== null);
  const heldSections = page.sections.filter((section) => section.bodyDraftJa === null);
  const surfaceDraft = surfaceDraftAssembly.surfaceDrafts.find(
    (draft) => draft.surface === page.surface,
  );
  const showDerivedViewsContract = page.surface === derivedViewsContract.surface;
  const principalSeeds = derivedViewsContract.seeds.filter(
    (seed) => seed.seedKind === 'l3_principal_interaction_pattern',
  );
  const crossCuttingSeeds = derivedViewsContract.seeds.filter(
    (seed) => seed.seedKind === 'l3_cross_cutting_axis',
  );

  return (
    <main className="candidateRoute">
      <header className="hero">
        <div className={`heroTone ${route.visualTone}`} aria-hidden="true">
          <img alt="" src={heroImage} />
        </div>
        <nav aria-label="Axiom internal candidate navigation">
          {routeMap.routes.map((candidateRoute) => (
            <Link
              aria-current={candidateRoute.slug === route.slug ? 'page' : undefined}
              href={candidateRoute.path}
              key={candidateRoute.routeId}
            >
              {candidateRoute.navLabelJa}
            </Link>
          ))}
        </nav>
        <div className="heroCopy">
          <p className="eyebrow">Axiom reviewed candidate route</p>
          <h1>{page.pageTitleJa}</h1>
          <p>{page.navigationRoleJa}</p>
          <div className="heroMeta">
            <span>{route.routeStatus}</span>
            <span>{route.publicNavigationStatus}</span>
            <span>{route.publicUseStatus}</span>
            <span>{route.publicationStatus}</span>
          </div>
        </div>
      </header>

      <section className="routeSummary" aria-labelledby="route-summary">
        <div>
          <h2 id="route-summary">Kernel Relation</h2>
          <p>
            このcandidate pageは、Falcon風の見た目にreviewed Axiom kernel sectionを流し込んだ内部routeです。
            page purposeや見た目の骨格は継承候補ですが、具体コンテンツはAxiom kernelから作り直します。
            actual public navigationでもpublicationでもありません。
          </p>
        </div>
        <dl>
          <div>
            <dt>surface</dt>
            <dd>{page.surface}</dd>
          </div>
          <div>
            <dt>sections</dt>
            <dd>{page.sectionCount}</dd>
          </div>
          <div>
            <dt>kernel rows</dt>
            <dd>{page.sourceKernelRowIds.length}</dd>
          </div>
          <div>
            <dt>review units</dt>
            <dd>{page.sourceReviewUnitIds.length}</dd>
          </div>
        </dl>
      </section>

      {surfaceDraft ? (
        <section className="surfaceBodyDraft" aria-labelledby="surface-body-draft">
          <div className="sectionIntro">
            <p className="eyebrow">kernel-derived surface body draft</p>
            <h2 id="surface-body-draft">{surfaceDraft.pageHeadingCandidateJa}</h2>
            <p>{surfaceDraft.openingThesisCandidateJa}</p>
          </div>
          <div className="surfaceBodyDraftGrid">
            {surfaceDraft.bodySectionCandidates.map((section) => (
              <article key={section.bodySectionCandidateId}>
                <p>{section.reviewRoute}</p>
                <h3>{section.headingCandidateJa}</h3>
                <p>{section.guidingQuestionJa}</p>
                <ul>
                  {section.seedQuestionCandidatesJa.slice(0, 3).map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="surfaceReviewQuestions">
            {surfaceDraft.surfaceReviewQuestionsJa.map((question) => (
              <span key={question}>{question}</span>
            ))}
          </div>
        </section>
      ) : null}

      {showDerivedViewsContract ? (
        <section className="derivedViews" aria-labelledby="derived-views">
          <div className="sectionIntro">
            <p className="eyebrow">kernel-derived views contract</p>
            <h2 id="derived-views">視点数は固定しない</h2>
            <p>
              旧「21視点」は inherited surface label であり、Axiom core truthではありません。
              L3の21 principal patternsと6 cross-cutting axesはbootstrap priorとして使いますが、
              Axiom evalで統合・分割・改名・追加保留・削除され得る候補seedです。
            </p>
          </div>
          <div className="derivedViewsMeta">
            <span>{derivedViewsContract.countPolicy}</span>
            <span>{derivedViewsContract.derivedViewCountStatus}</span>
            <span>{derivedViewsContract.humanReviewCompressionTarget}</span>
            <span>{derivedViewsContract.boundary}</span>
          </div>
          <div className="currentViewSet" aria-label="Current kernel-derived view candidates">
            <div>
              <h3>Semantic derivation bridge</h3>
              <p>
                15 kernel items、18 compressed review units、L3 27 semantic seedsは別レイヤーです。
                ここでは単純照合せず、seedの意味をkernel corpusで圧力テストし、公開guide前のsemantic reconstructionへ渡します。
              </p>
            </div>
            <div className="layerGrid">
              {semanticDerivation.sourceLayerLedger.map((layer) => (
                <article key={layer.layerId}>
                  <span>{layer.unitCount}</span>
                  <h4>{layer.layerId}</h4>
                  <p>{layer.role}</p>
                  <p>{layer.useInDerivation}</p>
                </article>
              ))}
            </div>
          <div className="semanticGuards">
              <span>{semanticDerivation.derivationMethod}</span>
              {semanticDerivation.falseEquivalenceGuards.map((guard) => (
                <span key={guard}>{guard}</span>
              ))}
              <span>{semanticDerivation.humanReviewNeed}</span>
            </div>
            <div className="semanticReconstruction" aria-label="Content-level semantic reconstruction candidates">
              <div>
                <h3>Content-level semantic reconstruction candidates</h3>
                <p>
                  {semanticReconstruction.semanticSeedDraftCount} seed drafts /{' '}
                  {semanticReconstruction.sectionDraftCount} section candidates。
                  {semanticReconstruction.contentSourcePolicy}
                </p>
              </div>
              <div className="semanticSectionGrid">
                {semanticReconstruction.sectionDrafts.map((section) => {
                  const seedDrafts = semanticReconstruction.seedDrafts.filter((draft) =>
                    section.semanticSeedDraftIds.includes(draft.seedDraftId),
                  );

                  return (
                    <article key={section.sectionDraftId}>
                      <p>{section.sectionStatus}</p>
                      <h4>{section.headingJa}</h4>
                      <p>{section.guidingQuestionJa}</p>
                      <div className="semanticSeedList">
                        {seedDrafts.map((draft) => (
                          <div key={draft.seedDraftId}>
                            <span>{draft.seedId}</span>
                            <h5>{draft.sourceSeedLabelJa}</h5>
                            <p>{draft.semanticRoleJa}</p>
                            <p>{draft.readerQuestionCandidateJa}</p>
                          </div>
                        ))}
                      </div>
                      <div className="trace">
                        <span>{section.reviewRoute}</span>
                        <span>{semanticReconstruction.reviewPolicy.eighteenUnitReviewReceiptRole}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="surfacePropagation" aria-label="Backbone surface propagation">
              <div>
                <h3>Backbone surface propagation</h3>
                <p>
                  {backboneSurfacePropagation.slotCandidateCount} surface slots /{' '}
                  {backboneSurfacePropagation.downstreamSurfaceCount} downstream surfaces。
                  {backboneSurfacePropagation.contentSourcePolicy}
                </p>
              </div>
              <div className="surfacePropagationGrid">
                {backboneSurfacePropagation.surfaceSlots.map((slot) => (
                  <article key={slot.slotCandidateId}>
                    <p>{slot.propagationMode}</p>
                    <h4>{slot.surface}</h4>
                    <p>{slot.propagationRoleJa}</p>
                    <div className="trace">
                      <span>operation: {slot.operation}</span>
                      <span>seed drafts: {slot.sourceSeedCount}</span>
                      <span>section candidates: {slot.sourceSectionCount}</span>
                      <span>{slot.reviewRoute}</span>
                      <span>{slot.semanticReviewStatus}</span>
                      <span>{slot.publicUseStatus}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="viewCandidateGrid">
              {semanticDerivation.bridgeCandidates.map((candidate) => (
                <article key={candidate.bridgeCandidateId}>
                  <p>{candidate.semanticReviewStatus}</p>
                  <h4>{candidate.labelJa}</h4>
                  <p>{candidate.semanticQuestionJa}</p>
                  <div className="trace">
                    <span>seeds: {candidate.sourceSeedCount}</span>
                    <span>corpus items: {candidate.corpusItemCount}</span>
                    <span>review units: {candidate.reviewUnitCount}</span>
                    <span>{candidate.corpusRoleInDerivation}</span>
                    <span>{candidate.reviewReceiptRoleInDerivation}</span>
                    <span>{candidate.publicGuideReadiness}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="seedColumns">
            <article>
              <h3>Bootstrap principal pattern seeds</h3>
              <p>{principalSeeds.length} seeds, not final views</p>
              <ol>
                {principalSeeds.map((seed) => (
                  <li key={seed.seedId}>
                    <span>{seed.seedId}</span>
                    {seed.labelJa}
                  </li>
                ))}
              </ol>
            </article>
            <article>
              <h3>Cross-cutting check seeds</h3>
              <p>{crossCuttingSeeds.length} seeds, not final views</p>
              <ol>
                {crossCuttingSeeds.map((seed) => (
                  <li key={seed.seedId}>
                    <span>{seed.seedId}</span>
                    {seed.labelJa}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>
      ) : null}

      <section className="publicSections" aria-labelledby="public-sections">
        <div className="sectionIntro">
          <p className="eyebrow">candidate body</p>
          <h2 id="public-sections">Review-required page sections</h2>
        </div>
        <div className="sectionGrid">
          {visibleSections.map((section) => (
            <article className="sectionCard" key={section.sectionId}>
              <p>{section.field}</p>
              <h3>{section.headingJa}</h3>
              <p>{section.bodyDraftJa}</p>
              <div className="trace">
                <span>{section.sectionStatus}</span>
                <span>slot: {section.sourceSlotId}</span>
                <span>rows: {compactTrace(section.sourceKernelRowIds)}</span>
                <span>review units: {compactTrace(section.sourceReviewUnitIds)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="holdSections" aria-labelledby="held-sections">
        <div className="sectionIntro">
          <p className="eyebrow">not directly published</p>
          <h2 id="held-sections">Hidden / review-routed sections</h2>
        </div>
        <div className="holdGrid">
          {heldSections.map((section) => (
            <article key={section.sectionId}>
              <p>{section.operation}</p>
              <h3>{section.headingJa}</h3>
              <span>{section.reviewRoute}</span>
              <span>{section.sourceSlotId}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="boundary" aria-labelledby="boundary">
        <h2 id="boundary">Candidate Route Boundary</h2>
        <p>{routeMap.boundary}</p>
      </section>

      <style jsx>{`
        .candidateRoute {
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
        }

        .hero {
          min-height: 78vh;
          overflow: hidden;
          position: relative;
        }

        .heroTone {
          inset: 0;
          position: absolute;
        }

        .heroTone::after {
          background: linear-gradient(110deg, rgba(2, 6, 23, 0.94), rgba(2, 6, 23, 0.82), rgba(2, 6, 23, 0.24));
          content: '';
          inset: 0;
          position: absolute;
        }

        .heroTone img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0 auto;
          max-width: 1180px;
          padding: 26px 40px 0;
          position: relative;
          z-index: 2;
        }

        nav a {
          border: 1px solid rgba(255, 255, 255, 0.34);
          border-radius: 999px;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 8px 11px;
          text-decoration: none;
        }

        nav a[aria-current='page'] {
          background: #fff;
          color: #17201a;
        }

        .heroCopy {
          color: #fff;
          margin: 0 auto;
          max-width: 1180px;
          padding: 112px 40px 80px;
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          color: #b7d4be;
          font-size: 0.78rem;
          font-weight: 900;
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
          font-size: clamp(3rem, 8vw, 6.6rem);
          line-height: 0.92;
          letter-spacing: 0;
          margin-top: 12px;
          max-width: 980px;
        }

        .heroCopy > p:last-of-type {
          color: rgba(255, 255, 255, 0.86);
          font-size: 1.06rem;
          line-height: 1.8;
          margin-top: 20px;
          max-width: 720px;
        }

        .heroMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .heroMeta span {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 999px;
          color: #fff;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 8px 10px;
        }

        .routeSummary,
        .surfaceBodyDraft,
        .derivedViews,
        .publicSections,
        .holdSections,
        .boundary {
          margin: 0 auto;
          max-width: 1180px;
          padding: 34px 40px;
        }

        .routeSummary {
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
        }

        .routeSummary p,
        .surfaceBodyDraft p,
        .derivedViews p,
        .boundary p,
        .sectionCard p,
        .holdGrid span {
          color: #4d5a51;
          font-size: 0.92rem;
          line-height: 1.72;
        }

        dl {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        dl div,
        .sectionCard,
        .viewCandidateGrid article,
        .seedColumns article,
        .holdGrid article,
        .boundary {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
        }

        dl div {
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
          font-size: 0.9rem;
          font-weight: 800;
          margin: 4px 0 0;
        }

        .sectionIntro {
          margin-bottom: 16px;
        }

        .sectionIntro h2,
        .derivedViews h2,
        .boundary h2 {
          font-size: 1.2rem;
          margin-top: 4px;
        }

        .derivedViews {
          padding-top: 10px;
        }

        .surfaceBodyDraft {
          padding-top: 10px;
        }

        .surfaceBodyDraftGrid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .surfaceBodyDraftGrid article {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 18px;
        }

        .surfaceBodyDraftGrid article > p:first-child {
          color: #657364;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .surfaceBodyDraftGrid h3 {
          font-size: 1rem;
          margin-top: 5px;
        }

        .surfaceBodyDraftGrid ul {
          display: grid;
          gap: 6px;
          margin: 12px 0 0;
          padding-left: 20px;
        }

        .surfaceBodyDraftGrid li {
          color: #4d5a51;
          font-size: 0.82rem;
          line-height: 1.55;
        }

        .surfaceReviewQuestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .surfaceReviewQuestions span {
          background: #17201a;
          border-radius: 999px;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 8px 10px;
        }

        .derivedViewsMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .derivedViewsMeta span {
          background: #17201a;
          border-radius: 999px;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          overflow-wrap: anywhere;
          padding: 8px 10px;
        }

        .seedColumns {
          display: grid;
          gap: 14px;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
        }

        .seedColumns article {
          padding: 18px;
        }

        .currentViewSet {
          margin-bottom: 18px;
        }

        .currentViewSet > div:first-child {
          margin-bottom: 12px;
        }

        .currentViewSet h3,
        .seedColumns h3 {
          font-size: 1rem;
        }

        .viewCandidateGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .semanticReconstruction {
          margin-bottom: 18px;
        }

        .surfacePropagation {
          margin-bottom: 18px;
        }

        .surfacePropagation > div:first-child {
          margin-bottom: 12px;
        }

        .surfacePropagationGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .surfacePropagationGrid article {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 16px;
        }

        .surfacePropagationGrid article > p:first-child {
          color: #657364;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .surfacePropagationGrid h4 {
          font-size: 0.92rem;
          margin: 5px 0 0;
          overflow-wrap: anywhere;
        }

        .surfacePropagationGrid article > p:nth-of-type(2) {
          font-size: 0.82rem;
          margin-top: 8px;
        }

        .semanticReconstruction > div:first-child {
          margin-bottom: 12px;
        }

        .semanticSectionGrid {
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
        }

        .semanticSectionGrid article {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 18px;
        }

        .semanticSectionGrid article > p:first-child {
          color: #657364;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .semanticSectionGrid h4 {
          font-size: 1.05rem;
          margin: 5px 0 0;
        }

        .semanticSeedList {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 14px;
        }

        .semanticSeedList div {
          background: #f7f5ef;
          border: 1px solid #e0dfd4;
          border-radius: 8px;
          padding: 12px;
        }

        .semanticSeedList span {
          color: #6a765f;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .semanticSeedList h5 {
          font-size: 0.92rem;
          margin: 4px 0 0;
        }

        .semanticSeedList p {
          font-size: 0.8rem;
          margin-top: 8px;
        }

        .layerGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-bottom: 12px;
        }

        .layerGrid article {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 14px;
        }

        .layerGrid span {
          color: #5f6b5a;
          font-size: 1.3rem;
          font-weight: 900;
        }

        .layerGrid h4 {
          font-size: 0.88rem;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .layerGrid p {
          font-size: 0.78rem;
          margin-top: 8px;
        }

        .semanticGuards {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .semanticGuards span {
          background: #f2f0e7;
          border: 1px solid #d8ded1;
          border-radius: 999px;
          color: #28342b;
          font-size: 0.7rem;
          font-weight: 800;
          overflow-wrap: anywhere;
          padding: 7px 9px;
        }

        .viewCandidateGrid article {
          padding: 18px;
        }

        .viewCandidateGrid h4 {
          font-size: 1rem;
          margin: 5px 0 0;
        }

        .viewCandidateGrid article > p:first-child {
          color: #657364;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .viewCandidateGrid article > p:nth-of-type(2) {
          margin-top: 10px;
        }

        .seedColumns ol {
          display: grid;
          gap: 8px;
          margin: 14px 0 0;
          padding-left: 20px;
        }

        .seedColumns li {
          color: #273229;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .seedColumns li span {
          color: #6a765f;
          display: block;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .sectionGrid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .sectionCard {
          padding: 20px;
        }

        .sectionCard > p:first-child,
        .holdGrid p {
          color: #657364;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .sectionCard h3,
        .holdGrid h3 {
          font-size: 1.12rem;
          margin-top: 5px;
        }

        .sectionCard > p:nth-of-type(2) {
          margin-top: 12px;
        }

        .trace {
          border-top: 1px solid #e3e7de;
          display: grid;
          gap: 6px;
          margin-top: 14px;
          padding-top: 12px;
        }

        .trace span {
          color: #556257;
          font-size: 0.78rem;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .holdGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .holdGrid article {
          display: grid;
          gap: 8px;
          padding: 16px;
        }

        .boundary {
          margin-bottom: 40px;
        }

        .boundary p {
          margin-top: 8px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 900px) {
          nav,
          .heroCopy,
          .routeSummary,
          .surfaceBodyDraft,
          .derivedViews,
          .publicSections,
          .holdSections,
          .boundary {
            padding-left: 18px;
            padding-right: 18px;
          }

          .hero {
            min-height: auto;
          }

          .heroCopy {
            padding-bottom: 58px;
            padding-top: 76px;
          }

          .routeSummary,
          dl,
          .layerGrid,
          .viewCandidateGrid,
          .surfacePropagationGrid,
          .surfaceBodyDraftGrid,
          .semanticSeedList,
          .seedColumns,
          .sectionGrid,
          .holdGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
