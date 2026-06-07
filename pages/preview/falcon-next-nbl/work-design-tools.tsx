import PageSeo from '@/components/PageSeo';
import { NextNblStaticSitePageCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

const page = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-03')!;

export default function FalconNextNblWorkDesignToolsPreviewPage() {
  return (
    <>
      <PageSeo
        title="未来設計21視点ガイド"
        description="障害者雇用や難病就労支援で蓄積されてきた知見を、人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計へ展開する。"
        path="/preview/falcon-next-nbl/work-design-tools"
        imagePath="/images/next-nbl-future-design-21-view-map-v1.webp"
        imageAlt="21視点で未来の仕事を設計するために、仕事条件と人間の多様性を中心に4つの実装領域へ広げる図解"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
