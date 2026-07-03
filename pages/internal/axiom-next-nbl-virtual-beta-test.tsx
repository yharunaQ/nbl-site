import Head from 'next/head';
import PageSeo from '@/components/PageSeo';
import AxiomNextNblVirtualBetaTestSurface from '@/components/axiom/AxiomNextNblVirtualBetaTestSurface';

export default function AxiomNextNblVirtualBetaTestPage() {
  return (
    <>
      <PageSeo
        title="Axiom next NBL virtual beta test"
        description="Internal virtual beta test result for the Axiom next NBL public candidate site."
        path="/internal/axiom-next-nbl-virtual-beta-test"
        noIndex
      />
      <Head>
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <AxiomNextNblVirtualBetaTestSurface />
    </>
  );
}
