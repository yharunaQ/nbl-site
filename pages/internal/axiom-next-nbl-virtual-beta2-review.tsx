import Head from 'next/head';
import PageSeo from '@/components/PageSeo';
import AxiomNextNblVirtualBeta2ReviewSurface from '@/components/axiom/AxiomNextNblVirtualBeta2ReviewSurface';

export default function AxiomNextNblVirtualBeta2ReviewPage() {
  return (
    <>
      <PageSeo
        title="Axiom next NBL virtual beta 2 review"
        description="Internal virtual beta 2 review result for the Axiom next NBL public candidate site."
        path="/internal/axiom-next-nbl-virtual-beta2-review"
        noIndex
      />
      <Head>
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <AxiomNextNblVirtualBeta2ReviewSurface />
    </>
  );
}
