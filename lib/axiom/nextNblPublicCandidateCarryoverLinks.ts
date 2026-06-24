import { getAxiomNextNblPublishedPath } from './nextNblPublishedRoutes';

export function nextNblPublicCandidateHref(slug: string) {
  return getAxiomNextNblPublishedPath(slug);
}

export const NEXT_NBL_CARRYOVER_LINKS = {
  home: nextNblPublicCandidateHref('home'),
  report: nextNblPublicCandidateHref('articles-social-questions'),
  toolkit: nextNblPublicCandidateHref('toolkit-studio'),
  conditionWindow: nextNblPublicCandidateHref('work-condition-window'),
  siteInfo: nextNblPublicCandidateHref('about-boundary'),
  songs: '/resources/songs',
  forum: '/events/work-condition-forum',
} as const;

export const NEXT_NBL_CARRYOVER_RESOURCE_LINKS: Record<string, { href: string; label: string }> = {
  '/resources/disability-work-design': {
    href: NEXT_NBL_CARRYOVER_LINKS.conditionWindow,
    label: '障害種類から見る',
  },
};

export function resolveNextNblCarryoverResourceLink(path: string) {
  return (
    NEXT_NBL_CARRYOVER_RESOURCE_LINKS[path] ?? {
      href: NEXT_NBL_CARRYOVER_LINKS.toolkit,
      label: 'ツールキット',
    }
  );
}
