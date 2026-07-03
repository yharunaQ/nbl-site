import PageSeo from '@/components/PageSeo';
import AxiomReviewedNextNblCandidateRouteSurface from '@/components/axiom/AxiomReviewedNextNblCandidateRouteSurface';

export default function AxiomReviewedNextNblCandidateHomePage() {
  return (
    <>
      <PageSeo
        title="Axiom reviewed next NBL candidate"
        description="Founder-reviewed Axiom kernel sections rendered into internal next NBL candidate pages."
        path="/internal/axiom-next-nbl-reviewed-candidate"
        noIndex
      />
      <AxiomReviewedNextNblCandidateRouteSurface slug="home" />
    </>
  );
}
