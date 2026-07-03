import PageSeo from '@/components/PageSeo';
import AxiomProjectsPublishedSurface from '@/components/axiom/AxiomProjectsPublishedSurface';
import AxiomNextNblPublicCandidateSiteSurface from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import {
  getAxiomNextNblPublishedPath,
  type AxiomNextNblPublishedSlug,
} from '@/lib/axiom/nextNblPublishedRoutes';

const pageSeoBySlug: Record<
  AxiomNextNblPublishedSlug,
  {
    description: string;
    imageAlt: string;
    imagePath: string;
    title: string;
  }
> = {
  home: {
    title: 'Next Being Lab | 障害者雇用・難病就労支援から、AI時代の仕事設計へ',
    description:
      '多様な人間と社会・環境の相互作用を踏まえ、AIの助けで認知負荷を下げながら、働きづらさを仕事・環境・支援・時間・評価の条件として読み直すNext Being Labの入口。',
    imagePath: '/images/next-nbl-home-hero-image2-v1.png',
    imageAlt: 'Next Being Labの全体入口を示す図',
  },
  'scene-entry': {
    title: '8つの課題 | Next Being Lab',
    description:
      '昔から語られてきたが解けにくかった働きづらさの課題を、仕事条件から読み直すページ。',
    imagePath: '/images/next-nbl-work-design-scene-month-end-v1.png',
    imageAlt: '働きづらさの典型場面を読み直す図',
  },
  'case-readings': {
    title: '相談事例 | Next Being Lab',
    description: '相談の一言をつぶさず拾い、仕事条件の設計へつなげるアセスメントの入口。',
    imagePath: '/images/next-nbl-consultation-assessment-loop-hero-v1.png',
    imageAlt: '相談の一言から仕事条件設計へつなぐ図',
  },
  'work-design-views-guide': {
    title: '未来の仕事・社会参加設計ガイド | Next Being Lab',
    description: '人間の多様性を前提に、仕事と社会参加を設計し直すための実用ガイド。',
    imagePath: '/images/next-nbl-work-design-hero-v1.png',
    imageAlt: '未来の仕事と社会参加を設計する全体図',
  },
  'articles-social-questions': {
    title: 'NBLレポート | Next Being Lab',
    description: '現場、政策、社会の問いを、仕事条件の論考として読み直すNBLレポート。',
    imagePath: '/images/next-nbl-report-hero-v1.png',
    imageAlt: 'NBLレポートの論考入口を示す図',
  },
  'toolkit-studio': {
    title: 'ツールキット | Next Being Lab',
    description: '図解、4コマ、音楽、フォーラム、資料を、会議や研修で使える形に並べた入口。',
    imagePath: '/images/next-nbl-toolkit-hero-image2-v1.png',
    imageAlt: '図解や音楽などのツールキットを示す図',
  },
  'work-condition-window': {
    title: '障害種類から見る | Next Being Lab',
    description: '障害種類や疾病名から入り、例外的対応ではなく職場設計として読み直す入口。',
    imagePath: '/images/next-nbl-condition-window-hero-image2-v1.png',
    imageAlt: '障害種類から職場設計へ進む入口を示す図',
  },
  'theory-method-trust': {
    title: 'NBLの専門性 | Next Being Lab',
    description: '専門情報を安全に読み、複雑な仕事条件を人に使える形へ翻訳するNBLの専門性。',
    imagePath: '/images/next-nbl-method-trust-hero-reading-power-v1.png',
    imageAlt: 'NBLの専門性と専門知識ネットワークを示す図',
  },
  projects: {
    title: 'プロジェクト | Next Being Lab',
    description:
      '仕事と参加の条件デザイン、難病地域連携、福祉・医療・雇用の連携設計・人材育成に関心のある方へ。',
    imagePath: '/images/nbl-projects-tom-sawyer-wall-painting-hero-v1.png',
    imageAlt: '白い壁を楽しそうに塗る少年と、参加したくなる人々のイラスト',
  },
  'about-boundary': {
    title: 'サイト情報 | Next Being Lab',
    description: 'Next Being Labの運営目的、責任者、問い合わせ、免責、著作権、SNS発信の扱い。',
    imagePath: '/images/next-nbl-home-hero-image2-v1.png',
    imageAlt: 'Next Being Labのサイト情報を示す図',
  },
};

export default function AxiomNextNblPublishedSitePage({
  slug,
}: {
  slug: AxiomNextNblPublishedSlug;
}) {
  const seo = pageSeoBySlug[slug];

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        path={getAxiomNextNblPublishedPath(slug)}
        imagePath={seo.imagePath}
        imageAlt={seo.imageAlt}
      />
      {slug === 'projects' ? (
        <AxiomProjectsPublishedSurface />
      ) : (
        <AxiomNextNblPublicCandidateSiteSurface slug={slug} routeMode="published" />
      )}
    </>
  );
}
