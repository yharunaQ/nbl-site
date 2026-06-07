import PageSeo from '@/components/PageSeo';
import { NextNblStaticSitePageCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

const page = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-04')!;

export default function FalconNextNblWorkDesignStudioPreviewPage() {
  return (
    <>
      <PageSeo
        title="場面から入る"
        description="タテ割り支援で見えにくくなった状況を、直感的なストーリーとして見える化し、相談事例集、考え方、教材へ進む導入にする。"
        path="/preview/falcon-next-nbl/work-design-studio"
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
