import PageSeo from '@/components/PageSeo';
import { NextNblStaticSitePageCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

const page = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-06')!;

export default function FalconNextNblPartnershipPreviewPage() {
  return (
    <>
      <PageSeo
        title="認知補助ツールキット"
        description="文章だけでは共有しにくい働きづらさを、図解、場面、ワークシート、音の入口、読み下しへ分け、会議や研修で使える道具として届ける。"
        path="/preview/falcon-next-nbl/partnership"
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
