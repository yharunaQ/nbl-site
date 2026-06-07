import PageSeo from '@/components/PageSeo';
import { NextNblStaticSitePageCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

const page = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-07')!;

export default function FalconNextNblWorkAssessmentConceptPreviewPage() {
  return (
    <>
      <PageSeo
        title="理論と発見"
        description="働きづらさを過重な認知負荷と相互作用の問題として捉え、ICF準拠の枠組みとAIの文脈読解で専門知識ネットワークへ変える考え方。"
        path="/preview/falcon-next-nbl/work-assessment-concept"
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="仕事条件の知識ネットワークを表すイラスト"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
