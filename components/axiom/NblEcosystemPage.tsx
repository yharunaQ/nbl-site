import WorkForkEditionPage from './WorkForkEditionPage';
import { firstDayAssistance, isWorkForkEditionSlug, nextSiteHome, type WorkForkEditionSlug } from './workForkRoutes';
import FirstDayAssistancePage from './FirstDayAssistancePage';
import AxiomPublicCollaboration from './AxiomPublicCollaboration';
import PageSeo from '@/components/PageSeo';
import AxiomNextNblV2FlagshipSurface from './AxiomNextNblV2FlagshipSurface';
import { AxiomNextSiteLinksProvider } from './AxiomNextSiteLinks';
import SupportOrganizationChecklist from './SupportOrganizationChecklist';
import AxiomPracticeWorkbook from './AxiomPracticeWorkbook';
import AxiomProjectsPublishedSurface from './AxiomProjectsPublishedSurface';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';


export const ecosystemPageMetadata = {
  'public-collaboration': ['公開の議論と改善提案｜Next Being Lab', '現場の別案や資料への異論を届け、提案と改訂の経過を追えます。'],
  projects: [
    'プロジェクト・協働の相談｜Next Being Lab',
    '仕事と支援の組織づくり、教育・研修、政策・制度・資源分析への協働の入口。',
  ],
  'practice-workbook': [
    '会議用ワークブック｜Next Being Lab',
    '判断、実施と受渡し、結果と再判断、機関の体制を整理する会議用の四様式。',
  ],
  home: [
    nextSiteHome.title,
    nextSiteHome.summary,
  ],
  'case-readings': [
    '相談事例2.0｜Next Being Lab',
    '相談の一言から、何を確かめ、どう対応するかを考える。架空の場面を通じて、具体策、重要なリスク、本人の選択と見直しを示します。',
  ],
  'work-design-views-guide': [
    '仕事設計ガイド2.0｜Next Being Lab',
    '仕事の渡し方、時間・量、情報、支援のつなぎ方。今ある無理や手戻りを見直し、多様な人が働ける共通基盤をつくるガイドです。',
  ],
  search: [
    'NBLサイト内検索｜Next Being Lab',
    '仕事の困りごとから、相談事例・ガイド・図解・読み物を探します。個人の病状や個別相談を送信する窓口ではありません。',
  ],
  'support-organization-checklist': [
    '就労支援の実践・体制改善ツール｜Next Being Lab',
    'NIVR研究を踏まえ、本人と企業を支える実践と機関・地域の体制を別々に確認。二つの入口から、支援を届けるための具体的な改善メモをつくります。',
  ],
} as const;

export type EcosystemSlug = keyof typeof ecosystemPageMetadata | WorkForkEditionSlug | typeof firstDayAssistance.slug;

export default function NblEcosystemPage({
  slug,
  initialGuideSystemId,
  published = true,
}: {
  slug: EcosystemSlug;
  initialGuideSystemId?: string;
  published?: boolean;
}) {
  if (isWorkForkEditionSlug(slug)) {
    return (
      <AxiomNextSiteLinksProvider mode="isolated_root" published={published}>
        <WorkForkEditionPage slug={slug} />
      </AxiomNextSiteLinksProvider>
    );
  }
  if (slug === firstDayAssistance.slug) {
    return (
      <AxiomNextSiteLinksProvider mode="isolated_root" published={published}>
        <FirstDayAssistancePage />
      </AxiomNextSiteLinksProvider>
    );
  }

  const [title, description] = ecosystemPageMetadata[slug];
  return (
    <AxiomNextSiteLinksProvider mode="isolated_root" published={published}>
      <PageSeo
        title={title}
        description={description}
        path={slug === 'home' ? '/' : `/${slug}`}
        noIndex={!published}
      />
      {slug === 'public-collaboration' ? (
        <><AxiomNextSiteHeader currentPath="/public-collaboration" /><AxiomPublicCollaboration /><AxiomNextSiteFooter /></>
      ) : slug === 'support-organization-checklist' ? (
        <SupportOrganizationChecklist />
      ) : slug === 'practice-workbook' ? (
        <><AxiomNextSiteHeader currentPath="/practice-workbook" /><AxiomPracticeWorkbook /><AxiomNextSiteFooter /></>
      ) : slug === 'projects' ? (
        <AxiomProjectsPublishedSurface candidateBusinessContext />
      ) : (
        <AxiomNextNblV2FlagshipSurface surface={slug} initialGuideSystemId={initialGuideSystemId} />
      )}
    </AxiomNextSiteLinksProvider>
  );
}
