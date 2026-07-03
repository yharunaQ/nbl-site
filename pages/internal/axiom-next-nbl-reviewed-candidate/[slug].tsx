import type { GetStaticPaths, GetStaticProps } from 'next';
import PageSeo from '@/components/PageSeo';
import AxiomReviewedNextNblCandidateRouteSurface from '@/components/axiom/AxiomReviewedNextNblCandidateRouteSurface';
import { buildAxiomReviewedKernelBackedCandidateRouteMap } from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';

type AxiomReviewedNextNblCandidatePageProps = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths = () => {
  const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap();

  return {
    fallback: false,
    paths: routeMap.routes.map((route) => ({
      params: { slug: route.slug },
    })),
  };
};

export const getStaticProps: GetStaticProps<AxiomReviewedNextNblCandidatePageProps> = ({
  params,
}) => ({
  props: {
    slug: String(params?.slug ?? 'home'),
  },
});

export default function AxiomReviewedNextNblCandidatePage({
  slug,
}: AxiomReviewedNextNblCandidatePageProps) {
  return (
    <>
      <PageSeo
        title="Axiom reviewed next NBL candidate"
        description="Founder-reviewed Axiom kernel sections rendered into internal next NBL candidate pages."
        path={`/internal/axiom-next-nbl-reviewed-candidate/${slug}`}
        noIndex
      />
      <AxiomReviewedNextNblCandidateRouteSurface slug={slug} />
    </>
  );
}
