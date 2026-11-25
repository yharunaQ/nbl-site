import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useNextSiteCandidate } from './AxiomNextSiteCandidateContext';
import { AxiomNextSiteLinksProvider } from './AxiomNextSiteLinks';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';

export default function AxiomNextSiteCarryoverShell({ children }: { children: ReactNode }) {
  const candidate = useNextSiteCandidate();
  const { pathname } = useRouter();
  const included = pathname === '/virtual-news' || pathname.startsWith('/toolkit-studio/virtual-news/') || pathname === '/events' || pathname.startsWith('/events/') ||
    pathname === '/resources/songs' || pathname.startsWith('/resources/songs/') ||
    pathname.startsWith('/projects/') || pathname === '/about' || pathname === '/contact';
  if (!candidate || !included) return <>{children}</>;
  return (
    <AxiomNextSiteLinksProvider mode="isolated_root">
      <AxiomNextSiteHeader currentPath={pathname} />
      {children}
      <AxiomNextSiteFooter />
    </AxiomNextSiteLinksProvider>
  );
}
