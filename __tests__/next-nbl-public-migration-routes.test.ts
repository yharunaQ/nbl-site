const nextConfig = require('../next.config.js');

describe('next NBL public migration redirects', () => {
  it('moves replaced Heron explanation routes to the next NBL public surfaces', async () => {
    const redirects = await nextConfig.redirects();
    const routeMap = new Map(
      redirects.map((redirect: { source: string; destination: string }) => [
        redirect.source,
        redirect.destination,
      ]),
    );

    expect(routeMap.get('/knowledge')).toBe('/work-assessment-concept');
    expect(routeMap.get('/knowledge/network')).toBe('/work-assessment-concept');
    expect(routeMap.get('/knowledge/practice')).toBe('/work-design-tools');
    expect(routeMap.get('/guide')).toBe('/work-design-tools');
    expect(routeMap.get('/guide/download')).toBe('/work-design-tools');
    expect(routeMap.get('/jac')).toBe('/work-design-map');
    expect(routeMap.get('/jac/intro')).toBe('/work-design-map');
    expect(routeMap.get('/jac/next')).toBe('/work-design-map');
    expect(routeMap.get('/jac/guide')).toBe('/work-design-tools');
    expect(routeMap.get('/jac/frames')).toBe('/work-design-tools');
    expect(routeMap.get('/jac/guidebook')).toBe('/work-design-tools');
    expect(routeMap.get('/jac/guidebook/success')).toBe('/work-design-tools');
    expect(routeMap.get('/resources/disability-work-design')).toBe('/work-condition-window');
    expect(routeMap.get('/for-enterprise')).toBe('/organizations/diagnosis');
    expect(routeMap.get('/organizations')).toBe('/organizations/diagnosis');
    expect(routeMap.get('/organizations/design')).toBe('/work-design-tools');
  });

  it('preserves selected Heron surfaces outside the redirect list', async () => {
    const redirects = await nextConfig.redirects();
    const redirectedSources = new Set(
      redirects.map((redirect: { source: string }) => redirect.source),
    );

    expect(redirectedSources.has('/resources/songs')).toBe(false);
    expect(redirectedSources.has('/resources/songs/:path*')).toBe(false);
    expect(redirectedSources.has('/organizations/diagnosis')).toBe(false);
  });
});
