import PageSeo from '@/components/PageSeo';
import { NextNblStaticSiteHomeCandidate } from '@/components/falconLab/NextNblStaticSiteCandidate';

export default function FalconNextNblPreviewHomePage() {
  return (
    <>
      <PageSeo
        title="働きづらさを、仕事条件から考える。"
        description="働きづらさを、本人の状態だけでなく、仕事の時間、作業、情報、環境、支援、評価の重なりとして読み直す入口です。"
        path="/preview/falcon-next-nbl"
        imagePath="/images/nbl-home-hero-candidates/next-nbl-home-hero-diverse-manifold-image2-v2.png"
        imageAlt="明るい場で多様な人々の仕事、生活、移動、支援の関係がAI時代のmanifoldとして重なって見えるビジュアル"
        noIndex
      />
      <NextNblStaticSiteHomeCandidate />
    </>
  );
}
