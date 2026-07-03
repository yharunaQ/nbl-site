import Head from 'next/head';
import PageSeo from '@/components/PageSeo';
import AxiomNextNblPublicCandidateFinalQaSurface from '@/components/axiom/AxiomNextNblPublicCandidateFinalQaSurface';

export default function AxiomNextNblPublicCandidateFinalQaPage() {
  return (
    <>
      <PageSeo
        title="Axiom next NBL public candidate final QA"
        description="Internal final QA matrix for visual, copy, and public-language boundaries on the Axiom next NBL public candidate site."
        path="/internal/axiom-next-nbl-public-candidate-final-qa"
        noIndex
      />
      <Head>
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <AxiomNextNblPublicCandidateFinalQaSurface />
    </>
  );
}
