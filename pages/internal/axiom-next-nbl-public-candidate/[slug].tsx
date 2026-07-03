import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import PageSeo from '@/components/PageSeo';
import AxiomNextNblPublicCandidateSiteSurface from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import { buildAxiomReviewedKernelBackedCandidateRouteMap } from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';

type AxiomNextNblPublicCandidatePageProps = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<AxiomNextNblPublicCandidatePageProps> = async ({
  params,
  res,
}) => {
  const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap();
  const slug = String(params?.slug ?? 'home');
  const routeExists = routeMap.routes.some((route) => route.slug === slug);

  res.setHeader('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (!routeExists) {
    return { notFound: true };
  }

  return { props: { slug } };
};

export default function AxiomNextNblPublicCandidatePage({
  slug,
}: AxiomNextNblPublicCandidatePageProps) {
  return (
    <>
      <PageSeo
        title="Next Being Lab | 仕事条件で読む"
        description="働きづらさを人の問題で終わらせず、仕事条件の地図として読み直すNext Being Labの次期サイト候補。"
        path={`/internal/axiom-next-nbl-public-candidate/${slug}`}
        noIndex
      />
      <Head>
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <AxiomNextNblPublicCandidateSiteSurface slug={slug} />
    </>
  );
}
