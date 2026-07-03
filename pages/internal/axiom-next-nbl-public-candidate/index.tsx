import Head from 'next/head';
import PageSeo from '@/components/PageSeo';
import AxiomNextNblPublicCandidateSiteSurface from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';

export default function AxiomNextNblPublicCandidateHomePage() {
  return (
    <>
      <PageSeo
        title="Next Being Lab | 仕事条件で読む"
        description="働きづらさを人の問題で終わらせず、仕事条件の地図として読み直すNext Being Labの次期サイト候補。"
        path="/internal/axiom-next-nbl-public-candidate"
        noIndex
      />
      <Head>
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <AxiomNextNblPublicCandidateSiteSurface slug="home" />
    </>
  );
}
