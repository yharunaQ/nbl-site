import PageSeo from '@/components/PageSeo';
import { NextNblStaticSitePageCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblPublicSiteFixtures';

const page = nextSiteCandidatePages.find((candidate) => candidate.id === 'NS-02')!;

export default function FalconNextNblWorkDesignMapPreviewPage() {
  return (
    <>
      <PageSeo
        title="仕事条件で読む相談事例集"
        description="近い構造から、複数の読み筋、確認したいこと、情報が増えると見えること、合意前の確認候補まで読む典型相談事例。"
        path="/preview/falcon-next-nbl/work-design-map"
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
        noIndex
      />
      <NextNblStaticSitePageCandidate page={page} />
    </>
  );
}
