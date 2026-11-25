import type { ReactNode } from 'react';
import PageSeo from '@/components/PageSeo';
import { MATERIALS_EDITION, MATERIALS_UPDATED } from '@/lib/materials/catalog';
import styles from './Materials.module.css';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from '../axiom/AxiomNextSiteChrome';
import { AxiomNextSiteLinksProvider } from '../axiom/AxiomNextSiteLinks';
import { useNextSiteCandidate } from '../axiom/AxiomNextSiteCandidateContext';
export default function MaterialsShell({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}) {
  const ContentRoot = useNextSiteCandidate() ? 'main' : 'div';
  return (
    <AxiomNextSiteLinksProvider mode="isolated_root">
    <div className={styles.site}>
      <PageSeo title={`${title} | NBL資料集`} description={description} path={path} />
      <a className={styles.skip} href="#materials-main">
        本文へ進む
      </a>
      <AxiomNextSiteHeader currentPath={path} />
      <ContentRoot id="materials-main">{children}</ContentRoot>
      <AxiomNextSiteFooter editionNote={`${MATERIALS_EDITION} ／ 更新 ${MATERIALS_UPDATED}`} />
    </div>
    </AxiomNextSiteLinksProvider>
  );
}
