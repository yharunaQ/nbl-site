import PageSeo from '@/components/PageSeo';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';
import { useNextSiteLinkMode, useNextSitePublished } from './AxiomNextSiteLinks';
import WorkForkEdition from './WorkForkEdition';
import { workForkEditions, type WorkForkEditionSlug } from './workForkRoutes';

export default function WorkForkEditionPage({ slug }: { slug: WorkForkEditionSlug }) {
  const published = useNextSitePublished();
  const isolated = useNextSiteLinkMode() === 'isolated_root';
  const edition = workForkEditions[slug];
  const ContentRoot = isolated ? 'main' : 'div';
  return (
    <>
      <PageSeo
        title={`${edition.title}｜仕事の分かれ道｜Next Being Lab`}
        description={edition.summary}
        path={isolated ? `/${slug}` : `/preview/axiom-next-nbl-v2/${slug}`}
        imagePath={edition.image}
        imageAlt={edition.imageAlt}
        imageWidth={edition.imageWidth}
        imageHeight={edition.imageHeight}
        type="article"
        noIndex={!published}
      />
      <AxiomNextSiteHeader currentPath={`/${slug}`} />
      <ContentRoot>
        <WorkForkEdition issue={edition.issue} />
      </ContentRoot>
      <AxiomNextSiteFooter />
    </>
  );
}
