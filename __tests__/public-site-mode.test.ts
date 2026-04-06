import { getTemporaryPublicRoute } from '@/lib/publicSiteMode';

describe('temporary public route gating', () => {
  it('returns null for fully-public jac routes', () => {
    // /jac, /jac/frames, /jac/guide are now fully public (not in temporary block list)
    expect(getTemporaryPublicRoute('/jac')).toBeNull();
    expect(getTemporaryPublicRoute('/jac/frames')).toBeNull();
    expect(getTemporaryPublicRoute('/jac/guide')).toBeNull();
  });

  it('keeps legacy archive routes in the temporary list', () => {
    expect(getTemporaryPublicRoute('/jac/guidebook')?.slug).toBe('jac-guidebook');
  });

  it('keeps docs downloads on a temporary hold path', () => {
    expect(getTemporaryPublicRoute('/docs')?.slug).toBe('docs');
    expect(getTemporaryPublicRoute('/docs/houkoku126_summary.pdf')?.slug).toBe('docs');
  });
});
