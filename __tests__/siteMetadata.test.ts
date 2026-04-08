import { buildSiteUrl, DEFAULT_SOCIAL_IMAGE_URL, SITE_URL } from '@/lib/siteMetadata';

describe('siteMetadata', () => {
  it('builds absolute URLs for relative paths', () => {
    expect(buildSiteUrl('/about')).toBe(`${SITE_URL}/about`);
    expect(buildSiteUrl('contact')).toBe(`${SITE_URL}/contact`);
  });

  it('normalizes the root path and strips query/hash fragments', () => {
    expect(buildSiteUrl('/')).toBe(`${SITE_URL}/`);
    expect(buildSiteUrl('/resources?ref=sns#top')).toBe(`${SITE_URL}/resources`);
  });

  it('keeps absolute URLs unchanged', () => {
    expect(buildSiteUrl('https://cdn.example.com/card.png')).toBe(
      'https://cdn.example.com/card.png',
    );
  });

  it('exposes the default social image as an absolute URL pointing to the OG API', () => {
    expect(DEFAULT_SOCIAL_IMAGE_URL).toBe(`${SITE_URL}/api/og`);
  });
});
