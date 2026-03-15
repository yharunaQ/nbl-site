export const TEMPORARY_PUBLIC_SITE_ENABLED = true;

type RouteConfig = {
  prefix: string;
  slug: string;
  label: string;
  note: string;
};

const TEMPORARY_PUBLIC_ROUTE_CONFIGS: RouteConfig[] = [
  {
    prefix: '/jac/guidebook',
    slug: 'jac-guidebook',
    label: 'JAC Guidebook',
    note: 'guidebook and checkout flow',
  },
  {
    prefix: '/jac/guide',
    slug: 'jac-guide',
    label: 'JAC Guide',
    note: 'extended guide and reference materials',
  },
  {
    prefix: '/jac',
    slug: 'jac',
    label: 'JAC prototype',
    note: 'interactive prototype and consultation support tools',
  },
  {
    prefix: '/dao-participation-lab',
    slug: 'dao-participation-lab',
    label: 'DAO Participation Lab',
    note: 'experimental collaboration workspace',
  },
];

const TEMPORARY_PUBLIC_API_PREFIXES = [
  '/api/jac-assess',
  '/api/jac-assess-refinement',
  '/api/jac-tag-suggest',
  '/api/dao-participation-lab',
  '/api/ebook',
] as const;

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getTemporaryPublicRoute(pathname: string): RouteConfig | null {
  for (const route of TEMPORARY_PUBLIC_ROUTE_CONFIGS) {
    if (matchesPrefix(pathname, route.prefix)) {
      return route;
    }
  }

  return null;
}

export function isTemporarilyDisabledApiPath(pathname: string): boolean {
  return TEMPORARY_PUBLIC_API_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function getTemporaryPublicRouteBySlug(slug: string): RouteConfig | null {
  return TEMPORARY_PUBLIC_ROUTE_CONFIGS.find((route) => route.slug === slug) ?? null;
}
