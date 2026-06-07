import PageSeo from '@/components/PageSeo';
import { NextNblStaticSitePageCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

const page = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-05')!;

export default function FalconNextNblPolicyResearchPreviewPage() {
  return (
    <>
      <PageSeo
        title="働き方の問いをひらく記事集"
        description="SNSやニュースの短い問いを、賛否や相談回答で終わらせず、職場で観察できる条件と次に話す問いへひらくページ。"
        path="/preview/falcon-next-nbl/policy-research"
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
