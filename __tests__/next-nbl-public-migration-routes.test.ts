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

    expect(routeMap.get('/knowledge')).toBe('/theory-method-trust');
    expect(routeMap.get('/knowledge/network')).toBe('/theory-method-trust');
    expect(routeMap.get('/knowledge/practice')).toBe('/work-design-views-guide');
    expect(routeMap.get('/guide')).toBe('/work-design-views-guide');
    expect(routeMap.get('/guide/download')).toBe('/work-design-views-guide');
    expect(routeMap.get('/jac')).toBe('/case-readings');
    expect(routeMap.get('/jac/intro')).toBe('/case-readings');
    expect(routeMap.get('/jac/next')).toBe('/case-readings');
    expect(routeMap.get('/jac/guide')).toBe('/work-design-views-guide');
    expect(routeMap.get('/jac/frames')).toBe('/work-design-views-guide');
    expect(routeMap.get('/jac/guidebook')).toBe('/work-design-views-guide');
    expect(routeMap.get('/jac/guidebook/success')).toBe('/work-design-views-guide');
    expect(routeMap.get('/resources/disability-work-design')).toBe('/work-condition-window');
    expect(routeMap.get('/resources/work-design-foundations')).toBe('/theory-method-trust');
    expect(routeMap.get('/resources/invisible-disability')).toBe('/articles-social-questions');
    expect(routeMap.get('/resources/work-support-transformation')).toBe(
      '/work-design-views-guide',
    );
    expect(routeMap.get('/for-enterprise')).toBe('/work-design-views-guide');
    expect(routeMap.get('/organizations')).toBe('/work-condition-window');
    expect(routeMap.get('/organizations/design')).toBe('/work-design-views-guide');
  });

  it('preserves selected Heron surfaces outside the redirect list', async () => {
    const redirects = await nextConfig.redirects();
    const redirectedSources = new Set(
      redirects.map((redirect: { source: string }) => redirect.source),
    );

    expect(redirectedSources.has('/resources/songs')).toBe(false);
    expect(redirectedSources.has('/resources/songs/:path*')).toBe(false);
    expect(redirectedSources.has('/events/work-condition-forum')).toBe(false);
    expect(redirectedSources.has('/events/work-condition-forum/text/:path*')).toBe(false);
    expect(redirectedSources.has('/organizations/diagnosis')).toBe(false);
  });
});
