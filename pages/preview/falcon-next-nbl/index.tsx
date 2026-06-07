import PageSeo from '@/components/PageSeo';
import { NextNblStaticSiteHomeCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';

export default function FalconNextNblPreviewHomePage() {
  return (
    <>
      <PageSeo
        title="働きづらさを、仕事条件から考える。"
        description="働きづらさを、本人の状態だけでなく、仕事の時間、作業、情報、環境、支援、評価の重なりとして読み直す入口です。"
        path="/preview/falcon-next-nbl"
        imagePath="/images/next-nbl-work-design-hero-v1.webp"
        imageAlt="企業担当者、支援者、産業保健職が仕事の条件を同じ場面で整理しているイラスト"
        noIndex
      />
      <NextNblStaticSiteHomeCandidate />
    </>
  );
}
