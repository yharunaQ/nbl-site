import Head from 'next/head';
import AxiomCandidatePageInspectionSurface from '@/components/axiom/AxiomCandidatePageInspectionSurface';

export default function AxiomNextNblCandidatePagesPage() {
  return (
    <>
      <Head>
        <title>Axiom Candidate Page Inspection - Falcon Lab</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <AxiomCandidatePageInspectionSurface />
    </>
  );
}
